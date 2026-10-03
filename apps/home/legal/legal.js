/* broodev.com 법적 페이지 공통 — 언어 전환(ja·ko·en) + biz.js 값 채움
   - 언어: ?lang= → localStorage(broodev:legal-lang) → 브라우저 언어(ja/ko, 그 외 en). .legal-lang 의 [data-lang] 클릭으로 전환·저장
   - <article data-lang-block="ja|ko|en"> 중 현재 언어만 표시(HTML 기본은 ja 가 보이는 상태 → JS 없이도 正文은 보임)
   - <title>·meta description 은 각 article 의 data-title / data-desc 로 교체
   - [data-biz="키"] ← BIZ(언어별 '_ko' '_en' 변형 우선) · [data-biz-href="email"] ← mailto: · [data-price="utils.yearly"] ← PLANS 경로(¥3,980) · [data-price-monthly] ← 연액 ÷ 12 반올림 · [data-plan-url] ← href
   - BIZ.invoice_no 가 자리표시자(T000…)면 [data-biz-row="invoice_no"] 숨김 */
(function () {
  'use strict';
  var BIZ = window.BIZ || {}, PLANS = window.PLANS || {};
  var LANGS = ['ja', 'ko', 'en'];
  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }
  function yen(n) { return '¥' + Number(n).toLocaleString('en-US'); }
  function path(obj, p) { return String(p).split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, obj); }
  function norm(tag) { tag = String(tag || '').toLowerCase(); return tag.indexOf('ja') === 0 ? 'ja' : tag.indexOf('ko') === 0 ? 'ko' : tag.indexOf('en') === 0 ? 'en' : null; }
  function detect() {
    var q = /[?&]lang=([A-Za-z-]+)/.exec(location.search);
    if (q && norm(q[1])) return norm(q[1]);
    var saved = null; try { saved = localStorage.getItem('broodev:legal-lang'); } catch (e) { /* 프라이빗 모드 */ }
    if (LANGS.indexOf(saved) >= 0) return saved;
    return norm(navigator.language) || 'en';
  }
  function apply(lang) {
    document.documentElement.lang = lang;
    each('[data-lang-block]', function (el) {
      var on = el.getAttribute('data-lang-block') === lang;
      el.hidden = !on;
      if (on) {
        if (el.getAttribute('data-title')) document.title = el.getAttribute('data-title');
        var md = document.querySelector('meta[name="description"]');
        if (md && el.getAttribute('data-desc')) md.setAttribute('content', el.getAttribute('data-desc'));
      }
    });
    each('[data-lang]', function (a) { a.classList.toggle('active', a.getAttribute('data-lang') === lang); });
    each('[data-biz]', function (el) {
      var k = el.getAttribute('data-biz');
      var v = BIZ[k + '_' + lang] != null ? BIZ[k + '_' + lang] : BIZ[k];
      if (v != null) el.textContent = v;
    });
    each('[data-biz-href]', function (el) {
      var k = el.getAttribute('data-biz-href');
      if (k === 'email' && BIZ.email) { el.setAttribute('href', 'mailto:' + BIZ.email); if (!el.hasAttribute('data-static')) el.textContent = BIZ.email; }
      else if (BIZ[k]) el.setAttribute('href', BIZ[k]);
    });
    each('[data-price]', function (el) { var v = path(PLANS, el.getAttribute('data-price')); if (v != null) el.textContent = yen(v); });
    each('[data-price-monthly]', function (el) { var v = path(PLANS, el.getAttribute('data-price-monthly')); if (v != null) el.textContent = yen(Math.round(v / 12)); });
    each('[data-plan-url]', function (el) { var v = path(PLANS, el.getAttribute('data-plan-url')); if (v) el.setAttribute('href', v); });
    var placeholder = !BIZ.invoice_no || /^T0{13}$/.test(BIZ.invoice_no);
    each('[data-biz-row="invoice_no"]', function (el) { el.hidden = placeholder; });
  }
  each('[data-lang]', function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var l = a.getAttribute('data-lang');
      try { localStorage.setItem('broodev:legal-lang', l); } catch (e2) { /* 무시 */ }
      apply(l);
    });
  });
  apply(detect());
}());
