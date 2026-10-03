/* Utils — 안내 페이지 공통 (pricing.html · contact.html — 법적 문서는 broodev.com/legal/ 로 통합)
   - 헤더 언어 풀다운(#pg-lang) 토글 + [data-lang] 클릭 → MH_I18N.set
   - <title>·meta description 은 i18n.js apply() 가 <body data-page> 에 맞춰 title_* / desc_* 키로 교체 (여기서는 안 함)
   - 언어별 본문 <article data-lang-block="ja|ko|en"> 중 현재 언어만 표시 — 그 외 10개 언어는 en 블록 (JS 없을 땐 HTML 에 ja 가 보이는 상태)
   - [data-biz="키"] ← BIZ (언어별 변형 키 '_ko' '_en' 이 있으면 우선) · [data-biz-href="email"] ← mailto:
   - [data-price="yearly|lifetime"] ← PLANS 금액(¥2,500 형식) · [data-plan="free_limits.photos"] ← PLANS 경로값
   - 등록번호(BIZ.invoice_no)가 자리표시자(T000…)면 [data-biz-row="invoice_no"] 행을 숨김
   index.html 은 app.js 가 같은 역할을 하므로 이 파일을 넣지 않는다. */
(function () {
  'use strict';
  var I = window.MH_I18N, BIZ = window.BIZ || {}, PLANS = window.PLANS || {};
  if (!I) return;

  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }
  function yen(n) { return '¥' + Number(n).toLocaleString('en-US'); }
  function path(obj, p) { return String(p).split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, obj); }

  // 사업자 정보 · 금액 채우기 (언어가 바뀔 때마다 — 언어별 변형 키 때문에)
  function fill(lang) {
    each('[data-biz]', function (el) {
      var k = el.getAttribute('data-biz');
      // 언어별 변형(_ko/_en)이 있으면 그것, ja 외 언어인데 변형이 없으면 _en, 그래도 없으면 기본(일본어 正文)
      var v = BIZ[k + '_' + lang] != null ? BIZ[k + '_' + lang] : (lang !== 'ja' && BIZ[k + '_en'] != null ? BIZ[k + '_en'] : BIZ[k]);
      if (v != null) el.textContent = v;
    });
    each('[data-biz-href]', function (el) {
      var k = el.getAttribute('data-biz-href');
      if (k === 'email' && BIZ.email) {
        el.setAttribute('href', 'mailto:' + BIZ.email);
        if (!el.hasAttribute('data-biz') && !el.hasAttribute('data-i18n')) el.textContent = BIZ.email; // 번역 라벨이 있는 링크는 href 만
      }
      else if (BIZ[k]) el.setAttribute('href', BIZ[k]);
    });
    each('[data-price]', function (el) {
      var plan = PLANS[el.getAttribute('data-price')];
      if (plan && plan.price != null) el.textContent = yen(plan.price);
    });
    each('[data-price-monthly]', function (el) {           // 연간 금액 ÷ 12 (참고 표시)
      var plan = PLANS[el.getAttribute('data-price-monthly')];
      if (plan && plan.price != null) el.textContent = yen(Math.round(plan.price / 12));
    });
    each('[data-plan]', function (el) {
      var v = path(PLANS, el.getAttribute('data-plan'));
      if (v != null) el.textContent = v;
    });
    // 구매 버튼: Payment Link 가 있으면 활성(.when-live 문구), 없으면 비활성(.when-soon 문구)
    each('[data-checkout]', function (el) {
      var plan = PLANS[el.getAttribute('data-checkout')], url = plan && plan.checkout;
      if (url) { el.setAttribute('href', url); el.removeAttribute('aria-disabled'); el.setAttribute('target', '_blank'); el.setAttribute('rel', 'noopener'); }
      else { el.setAttribute('href', '#'); el.setAttribute('aria-disabled', 'true'); }
      each('.when-live', function (s) { if (el.contains(s)) s.hidden = !url; });
      each('.when-soon', function (s) { if (el.contains(s)) s.hidden = !!url; });
    });
    each('[data-portal]', function (el) {
      if (PLANS.portal) { el.setAttribute('href', PLANS.portal); el.hidden = false; } else el.hidden = true;
    });
    var placeholder = !BIZ.invoice_no || /^T0{13}$/.test(BIZ.invoice_no);
    each('[data-biz-row="invoice_no"]', function (el) { el.hidden = placeholder; });
  }

  // 언어 풀다운 (app.js 와 동일한 동작)
  var $lang = document.getElementById('pg-lang'), $toggle = document.getElementById('pg-lang-toggle');
  function closeLang() {
    if (!$lang) return;
    $lang.classList.remove('open');
    if ($toggle) $toggle.setAttribute('aria-expanded', 'false');
  }
  if ($lang && $toggle) {
    $toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = $lang.classList.toggle('open');
      $toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) { if (!$lang.contains(e.target)) closeLang(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLang(); });
  }
  each('[data-lang]', function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); I.set(el.getAttribute('data-lang')); closeLang(); });
  });

  document.addEventListener('mh:lang', function () {
    var lang = I.lang();
    // 긴 본문은 ja·ko·en 블록만 있다 — 그 외 10개 언어는 en 블록(메뉴·푸터·title 은 사전으로 번역됨)
    var have = {};
    each('[data-lang-block]', function (el) { have[el.getAttribute('data-lang-block')] = true; });
    var show = have[lang] ? lang : (have.en ? 'en' : 'ja');
    each('[data-lang-block]', function (el) { el.hidden = el.getAttribute('data-lang-block') !== show; });
    fill(lang);
  });

  I.apply();
}());
