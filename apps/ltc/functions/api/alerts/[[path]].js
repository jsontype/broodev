/* 극단 공포·탐욕일 때만 구독자에게 메일. 투자조언이 아니다.
   POST /api/alerts/tick  Authorization: Bearer <ALERT_CRON_SECRET>
   구독은 POST /api/alerts/subscribe { key, email, lang } */
import { json, err, readJson, sameSite, nowIso } from '../../_lib/http.js';
import { normalizeKey } from '../../_lib/keys.js';
import { Store, licenseProblem } from '../../_lib/store.js';

const FROM = 'Y Systems Support <support@broodev.com>';

export async function onRequest(ctx) {
  const { request, env } = ctx;
  if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
  const url = new URL(request.url);
  if (url.pathname.endsWith('/subscribe')) return subscribe(request, env);
  if (url.pathname.endsWith('/tick')) return tick(request, env);
  return err('not-found', 404);
}

async function subscribe(request, env) {
  if (request.method !== 'POST') return err('method-not-allowed', 405);
  if (!env.BTC_LICENSES) return err('kv-not-bound', 500);
  if (!sameSite(request)) return err('forbidden', 403);
  const body = await readJson(request);
  const key = normalizeKey(body && body.key);
  const email = String((body && body.email) || '').trim().toLowerCase();
  if (!key || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err('bad-request', 400);
  const store = new Store(env.BTC_LICENSES);
  const lic = await store.getLicense(key);
  if (licenseProblem(lic)) return err('invalid', 403);
  await env.BTC_LICENSES.put('alert:' + email, JSON.stringify({ email, key, lang: (body && body.lang) || 'ja', at: nowIso() }));
  return json({ ok: true });
}

async function tick(request, env) {
  if (request.method !== 'POST') return err('method-not-allowed', 405);
  const secret = env.ALERT_CRON_SECRET || '';
  const auth = request.headers.get('authorization') || '';
  if (!secret || auth !== 'Bearer ' + secret) return err('forbidden', 403);
  if (!env.BTC_LICENSES || !env.RESEND_API_KEY) return err('kv-not-bound', 500);

  const fngRes = await fetch('https://api.alternative.me/fng/?limit=1');
  if (!fngRes.ok) return err('upstream', 502);
  const fngJson = await fngRes.json();
  const value = Number(fngJson && fngJson.data && fngJson.data[0] && fngJson.data[0].value);
  if (!Number.isFinite(value)) return err('upstream', 502);
  const extreme = value <= 25 ? 'fear' : value >= 75 ? 'greed' : null;
  if (!extreme) return json({ ok: true, skipped: 'not-extreme', value });

  const day = new Date().toISOString().slice(0, 10);
  if (await env.BTC_LICENSES.get('alert-sent:' + day)) return json({ ok: true, skipped: 'already-sent', value });

  const text = extreme === 'fear'
    ? '暗号資産市場の恐怖・強欲指数が極端な恐怖です（' + value + '）。参考シグナルであり、投資助言ではありません。8指標の合成スコアはサイトで確認してください。\nhttps://btc.broodev.com/'
    : '暗号資産市場の恐怖・強欲指数が極端な強欲です（' + value + '）。参考シグナルであり、投資助言ではありません。8指標の合成スコアはサイトで確認してください。\nhttps://btc.broodev.com/';

  let cursor, n = 0;
  do {
    const page = await env.BTC_LICENSES.list({ prefix: 'alert:', cursor });
    for (const k of page.keys) {
      if (k.name.startsWith('alert-sent:')) continue;
      const row = await env.BTC_LICENSES.get(k.name, 'json');
      if (!row || !row.email) continue;
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { authorization: 'Bearer ' + env.RESEND_API_KEY, 'content-type': 'application/json' },
        body: JSON.stringify({ from: env.MAIL_FROM || FROM, to: row.email, subject: 'Crypto Signal — 参考（投資助言ではありません）', text }),
      });
      if (r.ok) n++;
    }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  await env.BTC_LICENSES.put('alert-sent:' + day, String(n), { expirationTtl: 3 * 86400 });
  return json({ ok: true, value, sent: n });
}
