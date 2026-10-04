/* 라이선스 저장소 — Workers KV 네임스페이스 `UTILS_LICENSES` (Pages 프로젝트 broodev-utils → Settings → Bindings)
   키 설계(모두 문자열 값 · JSON):
     lic:<KEY>          라이선스 본체 { key, email, name, plan: 'yearly'|'lifetime', status, created, updated, expires|null,
                        cancel_at_period_end, customer, subscription, payment_intent, session, locale, devices:[{id,name,first,last}], mail_sent|mail_error, note }
     sub:<sub_id>       → KEY     (invoice.paid · subscription.updated/deleted 가 찾는 길)
     pi:<pi_id>         → KEY     (charge.refunded · dispute: payment_intent 로)
     cus:<cus_id>       → KEY     (고객 단위 폴백)
     sess:<session_id>  → KEY     (같은 Checkout 세션 중복 발급 방지)
     email:<email>      → [KEY…]  (재송·조회)
     evt:<event_id>     → '1'     (웹훅 멱등 · 7일 TTL)
     subperiod:<sub_id> → 초      (invoice.paid 가 checkout.session.completed 보다 먼저 올 때 보관 · 1일 TTL)
     rl:<종류>:<값>     → '1'     (재송 레이트리밋 TTL)
   status: active | canceled(해지·결제 실패로 종료) | refunded | disputed | revoked(관리자) */

export const MAX_DEVICES = 3;
export const GRACE_SEC = 3 * 24 * 3600;          // 年額 기간 종료 후 유예(결제 재시도·시차)
const EVT_TTL = 7 * 24 * 3600;
const SUBPERIOD_TTL = 24 * 3600;

export const VALID_STATUS = ['active', 'canceled', 'refunded', 'disputed', 'revoked'];

export class Store {
  constructor(kv) { this.kv = kv; }

  async getJson(k) { const v = await this.kv.get(k); if (v == null) return null; try { return JSON.parse(v); } catch (e) { return null; } }
  async putJson(k, obj, opts) { return this.kv.put(k, JSON.stringify(obj), opts); }

  /* ── 라이선스 ── */
  async getLicense(key) { return key ? this.getJson('lic:' + key) : null; }
  async putLicense(lic) { lic.updated = new Date().toISOString(); return this.putJson('lic:' + lic.key, lic); }

  /* 발급: 본체 + 모든 인덱스 */
  async createLicense(lic) {
    lic.created = lic.created || new Date().toISOString();
    lic.devices = lic.devices || [];
    lic.status = lic.status || 'active';
    await this.putLicense(lic);
    const jobs = [];
    if (lic.subscription) jobs.push(this.kv.put('sub:' + lic.subscription, lic.key));
    if (lic.payment_intent) jobs.push(this.kv.put('pi:' + lic.payment_intent, lic.key));
    if (lic.customer) jobs.push(this.kv.put('cus:' + lic.customer, lic.key));
    if (lic.session) jobs.push(this.kv.put('sess:' + lic.session, lic.key));
    if (lic.email) jobs.push(this.addEmailIndex(lic.email, lic.key));
    await Promise.all(jobs);
    return lic;
  }

  async addEmailIndex(email, key) {
    const k = 'email:' + normEmail(email);
    const list = (await this.getJson(k)) || [];
    if (list.indexOf(key) < 0) list.push(key);
    return this.putJson(k, list);
  }

  async keysByEmail(email) { return (await this.getJson('email:' + normEmail(email))) || []; }
  async licensesByEmail(email) {
    const keys = await this.keysByEmail(email);
    const all = await Promise.all(keys.map((k) => this.getLicense(k)));
    return all.filter(Boolean);
  }

  async keyBySubscription(id) { return id ? this.kv.get('sub:' + id) : null; }
  async keyByPaymentIntent(id) { return id ? this.kv.get('pi:' + id) : null; }
  async keyByCustomer(id) { return id ? this.kv.get('cus:' + id) : null; }
  async keyBySession(id) { return id ? this.kv.get('sess:' + id) : null; }

  async licenseBySubscription(id) { return this.getLicense(await this.keyBySubscription(id)); }
  /* 환불·분쟁: payment_intent → 없으면 customer */
  async licenseByPaymentOrCustomer(piId, cusId) {
    let key = await this.keyByPaymentIntent(piId);
    if (!key) key = await this.keyByCustomer(cusId);
    return this.getLicense(key);
  }

  /* ── 웹훅 멱등 ── */
  async seenEvent(id) { return !!(id && (await this.kv.get('evt:' + id))); }
  async markEvent(id) { if (id) await this.kv.put('evt:' + id, '1', { expirationTtl: EVT_TTL }); }

  async rememberSubPeriod(subId, endSec) { if (subId && endSec) await this.kv.put('subperiod:' + subId, String(endSec), { expirationTtl: SUBPERIOD_TTL }); }
  async takeSubPeriod(subId) { const v = subId ? await this.kv.get('subperiod:' + subId) : null; return v ? Number(v) : null; }

  /* ── 레이트리밋(있으면 true = 차단) ── */
  async rateLimited(kind, value, ttlSec) {
    const k = 'rl:' + kind + ':' + value;
    if (await this.kv.get(k)) return true;
    await this.kv.put(k, '1', { expirationTtl: Math.max(60, ttlSec || 60) });
    return false;
  }
}

export function normEmail(e) { return String(e || '').trim().toLowerCase(); }

/* 유효 판정(서버 기준). 반환: null(유효) 또는 사유 문자열 */
export function licenseProblem(lic, nowMs) {
  if (!lic) return 'invalid';
  if (lic.status !== 'active') return lic.status === 'canceled' ? 'canceled' : (lic.status || 'invalid');
  if (lic.expires && Date.parse(lic.expires) < (nowMs || Date.now())) return 'expired';
  return null;
}

/* 공개용 요약(이메일은 마스킹 — 호출 쪽에서) */
export function publicView(lic) {
  return {
    plan: lic.plan,
    status: lic.status,
    expires: lic.expires || null,
    cancel_at_period_end: !!lic.cancel_at_period_end,
    devices: (lic.devices || []).length,
    max_devices: MAX_DEVICES
  };
}

export const secToIso = (sec) => (sec ? new Date(sec * 1000).toISOString() : null);
