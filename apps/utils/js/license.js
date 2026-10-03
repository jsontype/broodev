/* Utils — 프리미엄 라이선스 상태 (브라우저 쪽 · 2026-10-04)
   무료/프리미엄의 경계는 출력 형식(js/biz.js PLANS.premium_formats). 이 파일은 「이 브라우저에 유효한 라이선스가 있는가」만 답한다.

   저장: localStorage 'mh:license' = {"key":"…","exp":"2027-10-04"|null,"at":"2026-10-04T…"}
     - exp null = 買い切り(만료 없음). 年額은 Stripe 갱신 시 서버가 exp 를 늘려 준다
   발급: 아직 없음 — Stripe Payment Link 결제 → (Cloudflare Pages Functions + KV) 웹훅이 키를 발급해 메일로 보내고,
         요금 페이지의 「ライセンスを有効化」 입력란이 /api/license/activate 로 검증한 뒤 set() 을 부른다 (docs/stripe-setup.md §10)
   ★ 브라우저 쪽 판정은 우회될 수 있다(개발자 도구). 출력물 자체는 브라우저에서 만들어지므로 서버 검증은 「키 발급·활성화 횟수(3대)」에만 둔다 — 정책상 허용 */
(function (root) {
  'use strict';
  var KEY = 'mh:license';

  function read() {
    try { return JSON.parse(root.localStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
  }
  function active() {
    var L = read();
    if (!L || !L.key) return false;
    if (L.exp && new Date(L.exp + 'T23:59:59').getTime() < Date.now()) return false;  // 만료일(그날 끝까지 유효)
    return true;
  }
  function set(key, exp) {
    try { root.localStorage.setItem(KEY, JSON.stringify({ key: String(key), exp: exp || null, at: new Date().toISOString() })); } catch (e) { /* 저장 불가 */ }
  }
  function clear() { try { root.localStorage.removeItem(KEY); } catch (e) { /* 무시 */ } }

  // 형식(xlsx/pptx/ai/psd)이 프리미엄인지 — biz.js 가 없는 페이지(index/pptx 는 biz.js 를 싣지 않음)를 위해 기본값 내장
  function isPremiumFormat(fmt) {
    var P = root.PLANS && root.PLANS.premium_formats ? root.PLANS.premium_formats : ['pptx', 'ai', 'psd'];
    return P.indexOf(fmt) >= 0;
  }

  root.MH_LICENSE = { active: active, set: set, clear: clear, read: read, isPremiumFormat: isPremiumFormat };
}(window));
