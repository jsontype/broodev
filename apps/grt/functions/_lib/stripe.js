/* Stripe — 웹훅 서명 검증 + 최소 REST 클라이언트 (SDK 없이 fetch · Web Crypto 만 사용 → 빌드 없이 Pages Functions 에 그대로 배포)
   문서: https://docs.stripe.com/webhooks#verify-manually · https://docs.stripe.com/api */

import { timingSafeEqual } from './http.js';

const enc = new TextEncoder();
const hex = (buf) => Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');

/* Stripe-Signature: t=1700000000,v1=abc…,v1=def…(키 교체 중엔 v1 이 둘) · 5분 이내 · HMAC-SHA256(secret, `${t}.${rawBody}`) */
export async function verifyStripeSignature(rawBody, header, secret, toleranceSec) {
  if (!secret || !header) return false;
  let t = null; const v1 = [];
  for (const part of String(header).split(',')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    const k = part.slice(0, i).trim(), v = part.slice(i + 1).trim();
    if (k === 't') t = v; else if (k === 'v1') v1.push(v);
  }
  if (!t || !v1.length) return false;
  const ts = Number(t);
  if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > (toleranceSec || 300)) return false;
  const expected = await hmacHex(secret, `${t}.${rawBody}`);
  return v1.some((s) => timingSafeEqual(s, expected));
}

export async function hmacHex(secret, message) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', key, enc.encode(message)));
}

/* 테스트·수동 호출용: 서명 헤더 생성 */
export async function signPayload(rawBody, secret, ts) {
  const t = ts || Math.floor(Date.now() / 1000);
  return `t=${t},v1=${await hmacHex(secret, `${t}.${rawBody}`)}`;
}

/* GET https://api.stripe.com/v1/{path} — 실패하면 null(호출 쪽이 폴백). 계정 기본 API 버전 사용(필드 신구 형태는 helper 가 흡수) */
export async function stripeGet(env, path, fetchImpl) {
  const key = env && env.STRIPE_SECRET_KEY;
  if (!key) return null;
  const f = fetchImpl || fetch;
  try {
    const r = await f('https://api.stripe.com/v1/' + path, { headers: { authorization: 'Bearer ' + key } });
    if (!r.ok) return null;
    return await r.json();
  } catch (e) { return null; }
}

/* 구독의 현재 기간 종료(초). 2025-03 이후 API(basil)에서는 items.data[].current_period_end 로 옮겨갔다 — 둘 다 본다 */
export function subscriptionPeriodEnd(sub) {
  if (!sub) return null;
  if (typeof sub.current_period_end === 'number') return sub.current_period_end;
  const items = sub.items && sub.items.data || [];
  let max = null;
  for (const it of items) if (typeof it.current_period_end === 'number') max = max == null ? it.current_period_end : Math.max(max, it.current_period_end);
  return max;
}

/* 인보이스 → 구독 ID (구: invoice.subscription · 신: invoice.parent.subscription_details.subscription) */
export function invoiceSubscriptionId(inv) {
  if (!inv) return null;
  const s = inv.subscription || (inv.parent && inv.parent.subscription_details && inv.parent.subscription_details.subscription);
  return typeof s === 'string' ? s : (s && s.id) || null;
}

/* 인보이스 라인 중 가장 늦은 기간 종료(초) */
export function invoicePeriodEnd(inv) {
  const lines = inv && inv.lines && inv.lines.data || [];
  let max = null;
  for (const l of lines) if (l.period && typeof l.period.end === 'number') max = max == null ? l.period.end : Math.max(max, l.period.end);
  return max;
}

export const idOf = (x) => (typeof x === 'string' ? x : (x && x.id) || null);
