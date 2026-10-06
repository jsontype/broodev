/* Utils — 평생(買い切り) 플랜 할인 표시 (pricing.html 플랜 카드 · 앱 페이지의 잠금 안내 · 사이드바 메뉴 배지) — 단일 로직
   - PLANS.lifetime.list(정가) 가 price(판매가) 보다 크면 할인 모드: [data-deal] 블록 표시 · [data-price-list] 에 정가(취소선) ·
     [data-promo="키"] 에 i18n(promo_*) 문구(변수: {list} {price} {save} {off} {d}) · [data-promo="tag"] 는 「-50%」
   - list 를 null 로 두면(biz.js) 전부 숨겨져 할인 전 화면으로 돌아간다. 실제 결제 금액은 Stripe Price(price) 그대로
   - PLANS.promo.until('YYYY-MM-DD') 이 있으면 「N일 남음」, 없으면 「기간 한정」. 가짜 마감(리셋되는 타이머) 금지 — 실제 종료일만 넣는다
   - 로드 순서: i18n.js → biz.js → promo.js (site.js/app.js 보다 앞). 언어가 바뀌면(mh:lang) 다시 채우고, site.js 는 조각을 끼운 뒤 MH_PROMO.apply() 를 부른다
   - 라이선스 보유자(MH_LICENSE.active)에게는 사이드바 메뉴의 「-50%」 배지를 숨긴다(btc·voca 와 동일). license.js 는 이 파일 뒤에 로드되므로 DOMContentLoaded · mh:license 에 다시 적용
   ⚠ 景品表示法(二重価格表示): list 는 종료 후 실제로 받을 「将来の販売価格」 여야 한다 — docs/stripe-setup.md §13 */
(function () {
  'use strict';
  var I = window.MH_I18N, PLANS = window.PLANS || {};

  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }
  function yen(n) { return '¥' + Number(n).toLocaleString('en-US'); }

  function vars() {
    var L = PLANS.lifetime || {};
    var list = L.list != null && L.price != null && L.list > L.price ? L.list : null;
    var off = list ? Math.round((1 - L.price / list) * 100) : 0, days = null;
    if (list && PLANS.promo && PLANS.promo.until) {
      var d = Math.ceil((Date.parse(PLANS.promo.until + 'T23:59:59+09:00') - Date.now()) / 864e5);
      days = d > 0 ? d : null;   // 종료일이 지나면 날짜 없이 「기간 한정」으로(가격은 biz.js 에서 바꿀 것)
    }
    return { on: !!list, list: list, price: L.price, off: off, save: list ? list - L.price : 0, days: days };
  }

  function apply() {
    var v = vars();
    var tv = { list: v.list != null ? yen(v.list) : '', price: v.price != null ? yen(v.price) : '', save: yen(v.save), off: v.off, d: v.days };
    each('[data-deal]', function (el) { el.hidden = !v.on; });
    each('[data-price-list]', function (el) { el.hidden = !v.on; if (v.on) el.textContent = yen(v.list); });
    var lic = !!(window.MH_LICENSE && window.MH_LICENSE.active && window.MH_LICENSE.active());
    each('[data-promo]', function (el) {
      var k = el.getAttribute('data-promo');
      el.hidden = !v.on || (lic && el.classList.contains('pg-menu-deal'));
      if (el.hidden) return;
      if (k === 'tag') { el.textContent = '-' + v.off + '%'; return; }
      if (k === 'promo_limited' && v.days != null) k = 'promo_days';
      if (I) el.textContent = I.t(k, tv);
    });
  }

  window.MH_PROMO = { apply: apply, vars: vars, yen: yen };
  document.addEventListener('mh:lang', apply);
  document.addEventListener('mh:license', apply);
  document.addEventListener('DOMContentLoaded', apply);
  apply();
}());
