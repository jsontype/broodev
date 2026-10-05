/* Utils 라이선스 API — HTTP 공통 (Cloudflare Pages Functions)
   모든 응답은 JSON · no-store. 같은 도메인(utils.broodev.com)에서만 호출되므로 CORS 헤더는 두지 않는다. */

export function json(obj, status, extraHeaders) {
  const headers = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...(extraHeaders || {}) };
  return new Response(JSON.stringify(obj), { status: status || 200, headers });
}

export function err(code, status, extra) {
  return json({ ok: false, error: code, ...(extra || {}) }, status || 400);
}

/* 본문 JSON 읽기 — 크기 제한(기본 16KB) · 잘못된 JSON 이면 null */
export async function readJson(request, maxBytes) {
  const limit = maxBytes || 16 * 1024;
  const len = Number(request.headers.get('content-length') || 0);
  if (len > limit) return null;
  const text = await request.text();
  if (text.length > limit) return null;
  try { return JSON.parse(text || '{}'); } catch (e) { return null; }
}

/* 앱 페이지에서 온 요청인지(Origin/Referer) — 헤더는 위조 가능하므로 「다른 사이트가 폼으로 때리는 것」만 막는 최소 방어.
   Stripe 웹훅에는 쓰지 않는다(서명 검증이 방어선). */
export function sameSite(request) {
  const ref = request.headers.get('origin') || request.headers.get('referer') || '';
  if (!ref) return true;                       // 일부 브라우저·프라이버시 설정은 Origin 을 빼고 보낸다
  return /^https?:\/\/([a-z0-9-]+\.)*broodev\.com(\/|$)|^https:\/\/[a-z0-9.-]+\.pages\.dev(\/|$)|^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(ref);   // 본番 · Pages 프리뷰 · 로컬
}

export function clientIp(request) {
  return request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || '';
}

/* 상수 시간 문자열 비교(토큰·서명) — 길이가 달라도 같은 시간이 걸리게 */
export function timingSafeEqual(a, b) {
  a = String(a); b = String(b);
  const len = Math.max(a.length, b.length);
  let diff = a.length === b.length ? 0 : 1;
  for (let i = 0; i < len; i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

export function nowIso() { return new Date().toISOString(); }

/* 메일 주소 마스킹(응답·로그용): ab***@example.com */
export function maskEmail(email) {
  const s = String(email || '');
  const at = s.indexOf('@');
  if (at <= 0) return s ? '***' : '';
  const local = s.slice(0, at);
  return local.slice(0, Math.min(2, local.length)) + '***' + s.slice(at);
}
