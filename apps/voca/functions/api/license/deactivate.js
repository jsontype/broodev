/* POST /api/license/deactivate  { key, device }
   이 기기의 등록을 해제(3대 한도에서 자리를 비움). 라이선스 상태와 무관하게 기기만 뺀다.
   응답 200 { ok:true, devices, max_devices } · 404 invalid */

import { json, err, readJson, sameSite } from '../../_lib/http.js';
import { normalizeKey } from '../../_lib/keys.js';
import { Store, publicView } from '../../_lib/store.js';

export async function onRequest(ctx) {
  if (ctx.request.method !== 'POST') return err('method-not-allowed', 405);
  return deactivate(ctx);
}

export async function deactivate({ request, env }) {
  if (!env.VOCA_LICENSES) return err('kv-not-bound', 500);
  if (!sameSite(request)) return err('forbidden', 403);
  const body = await readJson(request);
  if (!body) return err('bad-request', 400);
  const key = normalizeKey(body.key);
  const device = typeof body.device === 'string' ? body.device : '';
  if (!key || !device) return err('bad-request', 400);

  const store = new Store(env.VOCA_LICENSES);
  const lic = await store.getLicense(key);
  if (!lic) return err('invalid', 404);
  const before = (lic.devices || []).length;
  lic.devices = (lic.devices || []).filter((d) => d.id !== device);
  if (lic.devices.length !== before) await store.putLicense(lic);
  return json({ ok: true, ...publicView(lic) });
}
