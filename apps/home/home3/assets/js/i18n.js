/* home3 i18n 런타임 — 13개 언어 (사전은 i18n-data.js 의 window.HOME3_I18N)
   감지: localStorage(home:lang) → ?lang= → navigator.languages 순서대로 첫 매치 → en
   마크업: data-i18n="key"(textContent) · data-i18n-html="key"(innerHTML — 사전 문자열만) · data-i18n-aria-label="key"
           data-lang-current(현재 언어명) · [data-lang="xx"](풀다운 항목, 클릭 → 저장 → 새로고침)
   ⚠ 이 파일은 jquery 다음, carousel.js(slick/swiper 초기화)·gsapAnimation.js(SplitText) 보다 먼저 실행돼야 한다 —
     슬라이더가 슬라이드를 복제하고 GSAP 이 글자를 쪼개기 전에 텍스트를 바꿔야 하므로. 언어 변경은 새로고침으로 처리한다. */
(function (root) {
  'use strict';
  var D = root.HOME3_I18N || {};
  // 풀다운 순서: 영어 · 일본어 · 한국어, 그 아래 btc 앱과 같은 10개
  var LANGS = ['en', 'ja', 'ko', 'zh', 'zh-Hant', 'th', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'nl'];
  var NAMES = { en: 'English', ja: '日本語', ko: '한국어', zh: '简体中文', 'zh-Hant': '繁體中文', th: 'ไทย', es: 'Español', fr: 'Français', de: 'Deutsch', it: 'Italiano', pt: 'Português', ru: 'Русский', nl: 'Nederlands' };
  var KEY = 'home:lang';

  // 'ko-KR' → ko · 'zh-TW'/'zh-Hant-HK' → zh-Hant · 'zh'/'zh-CN' → zh · 미지원 → null
  function norm(tag) {
    tag = String(tag || '').toLowerCase();
    if (!tag) return null;
    if (tag.indexOf('zh') === 0) return /hant|tw|hk|mo/.test(tag) ? 'zh-Hant' : 'zh';
    var p = tag.split('-')[0];
    return LANGS.indexOf(p) >= 0 ? p : null;
  }

  function detect() {
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) { /* 프라이빗 모드 등 */ }
    if (LANGS.indexOf(saved) >= 0) return saved;
    var q = /[?&]lang=([A-Za-z-]+)/.exec(root.location ? root.location.search : '');
    if (q && norm(q[1])) return norm(q[1]);
    var cands = root.navigator && root.navigator.languages && root.navigator.languages.length ? root.navigator.languages : [root.navigator && root.navigator.language];
    for (var i = 0; i < cands.length; i++) { var n = norm(cands[i]); if (n) return n; }
    return 'en';
  }

  var cur = detect();

  function t(key, vars) {
    var s = D[cur] && D[cur][key] != null ? D[cur][key] : (D.en && D.en[key] != null ? D.en[key] : (D.ko && D.ko[key] != null ? D.ko[key] : key));
    if (vars) s = s.replace(/\{(\w+)\}/g, function (_, k) { return vars[k] != null ? vars[k] : ''; });
    return s;
  }

  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }

  function apply() {
    document.documentElement.lang = cur;
    document.title = t('meta_title');
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', t('meta_desc'));
    each('[data-i18n]', function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    each('[data-i18n-html]', function (el) { el.innerHTML = t(el.getAttribute('data-i18n-html')); });
    each('[data-i18n-aria-label]', function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria-label'))); });
    each('[data-lang-current]', function (el) { el.textContent = NAMES[cur]; });
    each('[data-lang]', function (el) { el.classList.toggle('active', el.getAttribute('data-lang') === cur); });
  }

  function set(lang) {
    if (LANGS.indexOf(lang) < 0 || lang === cur) return;
    try { localStorage.setItem(KEY, lang); } catch (e) { /* 저장 실패 시 ?lang 으로 */ }
    // 슬라이더 복제본·SplitText 조각까지 새 언어로 다시 만들기 위해 새로고침 (localStorage 가 안 되면 ?lang= 로 전달)
    var u = location.pathname + '?lang=' + lang + location.hash;
    location.replace(u);
  }

  // 풀다운(헤더): 자체 토글 — Bootstrap dropdown/Popper 의존 없음
  function bindDropdown() {
    var dd = document.getElementById('lang-dd'), btn = document.getElementById('lang-dd-toggle');
    if (!dd || !btn) return;
    var close = function () { dd.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      var open = dd.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) { if (!dd.contains(e.target)) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    each('[data-lang]', function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); close(); set(el.getAttribute('data-lang')); });
    });
  }

  root.HOME3_T = t;
  root.HOME3_I18N_RT = { t: t, apply: apply, set: set, lang: function () { return cur; }, LANGS: LANGS, NAMES: NAMES };
  apply();
  bindDropdown();
}(window));
