/* POST /api/license/resend  { email, lang? }
   구매 메일 주소로 유효한 키를 다시 보낸다. 존재 여부를 노출하지 않기 위해 항상 200 { ok:true }.
   레이트리밋: 같은 메일 10분에 1회 · 같은 IP 30초에 1회(KV TTL). 메일 발송 실패도 200(로그만). */

import { json, err, readJson, sameSite, clientIp } from '../../_lib/http.js';
import { Store, normEmail, licenseProblem } from '../../_lib/store.js';
import { sendLicenseMail } from '../../_lib/mail.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LANGS = ['ja', 'ko', 'en'];

export async function onRequest(ctx) {
  if (ctx.request.method !== 'POST') return err('method-not-allowed', 405);
  return resend(ctx);
}

export async function resend({ request, env }) {
  if (!env.VOCA_LICENSES) return err('kv-not-bound', 500);
  if (!sameSite(request)) return err('forbidden', 403);
  const body = await readJson(request);
  if (!body) return err('bad-request', 400);
  const email = normEmail(body.email);
  if (!EMAIL_RE.test(email) || email.length > 254) return err('bad-request', 400);
  const lang = LANGS.indexOf(body.lang) >= 0 ? body.lang : 'en';

  const store = new Store(env.VOCA_LICENSES);
  const ip = clientIp(request);
  if (ip && (await store.rateLimited('ip', ip, 30))) return json({ ok: true, throttled: true });
  if (await store.rateLimited('email', email, 600)) return json({ ok: true, throttled: true });

  const lics = (await store.licensesByEmail(email)).filter((l) => !licenseProblem(l));
  if (!lics.length) return json({ ok: true });

  const name = lics[0].name || '';
  const useLang = body.lang ? lang : (lics[0].locale || 'en');
  await sendLicenseMail(env, {
    to: email, lang: useLang, name, resend: true,
    items: lics.map((l) => ({ key: l.key, plan: l.plan, expires: l.expires }))
  });
  return json({ ok: true });
}
