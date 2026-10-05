/* POST /api/license/verify  { key, device, name? }
   앱(js/license.js)이 활성화·주기 재검증에 호출. 유효하면 기기를 등록(최대 3대)하고 요약을 돌려준다.
   응답 200 { ok:true, plan, status, expires, devices, max_devices, email(마스킹) }
        400 bad-request · 404 invalid · 403 expired | canceled | refunded | disputed | revoked | device_limit · 405 */

import { json, err, readJson, sameSite, maskEmail, nowIso } from '../../_lib/http.js';
import { normalizeKey } from '../../_lib/keys.js';
import { Store, MAX_DEVICES, licenseProblem, publicView } from '../../_lib/store.js';

const DEVICE_ID_RE = /^[A-Za-z0-9_-]{8,64}$/;
const TOUCH_MS = 6 * 3600 * 1000;      // 같은 기기의 last-seen 은 6시간에 한 번만 기록(KV 쓰기 절약)


function cors(request, res) {
  const origin = request.headers.get('origin') || '';
  if (!/^https:\/\/([a-z0-9-]+\.)?broodev\.com$/i.test(origin) && !/\.pages\.dev$/i.test(origin)) return res;
  const h = new Headers(res.headers);
  h.set('access-control-allow-origin', origin);
  h.set('access-control-allow-headers', 'content-type');
  h.set('access-control-allow-methods', 'POST, OPTIONS');
  h.set('vary', 'origin');
  return new Response(res.body, { status: res.status, headers: h });
}

export async function onRequest(ctx) {
  if (ctx.request.method === 'OPTIONS') return cors(ctx.request, new Response(null, { status: 204 }));
  if (ctx.request.method !== 'POST') return err('method-not-allowed', 405);
  return cors(ctx.request, await verify(ctx));
}

export async function verify({ request, env }) {
  if (!env.BTC_LICENSES) return err('kv-not-bound', 500);
  if (!sameSite(request)) return err('forbidden', 403);
  const body = await readJson(request);
  if (!body) return err('bad-request', 400);

  const key = normalizeKey(body.key);
  if (!key) return err('invalid', 404);
  const device = typeof body.device === 'string' && DEVICE_ID_RE.test(body.device) ? body.device : null;
  const name = typeof body.name === 'string' ? body.name.slice(0, 80) : '';

  const store = new Store(env.BTC_LICENSES);
  const lic = await store.getLicense(key);
  const problem = licenseProblem(lic);
  if (problem === 'invalid') return err('invalid', 404);
  if (problem) return err(problem, 403, { expires: lic.expires || null, plan: lic.plan });

  let changed = false;
  if (device) {
    lic.devices = lic.devices || [];
    const now = Date.now();
    const found = lic.devices.find((d) => d.id === device);
    if (found) {
      if (!found.last || now - Date.parse(found.last) > TOUCH_MS) { found.last = nowIso(); if (name && !found.name) found.name = name; changed = true; }
    } else {
      if (lic.devices.length >= MAX_DEVICES) return err('device_limit', 403, { ...publicView(lic) });
      lic.devices.push({ id: device, name, first: nowIso(), last: nowIso() });
      changed = true;
    }
  }
  if (changed) await store.putLicense(lic);
  return json({ ok: true, ...publicView(lic), email: maskEmail(lic.email) });
}
