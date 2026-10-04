/* broodev 포털(index.html · 404.html) i18n 런타임 — 13개 언어. 사전은 assets/js/i18n-data.js 의 window.BROODEV_I18N (ko 가 원문, en 이 번역 기준)
   - 언어 집합·순서·이름은 utils(js/i18n.js)·legal(legal.js) 와 동일. 저장 키 'broodev:lang' 은 legal.js 와 공유 → 포털 ↔ 법적 페이지 사이에서 언어가 따라간다
   - 감지: ?lang= → localStorage(broodev:lang) → navigator.languages 첫 매치(zh-TW/HK/MO → zh-Hant) → en
   - 마크업: data-i18n="key"(textContent) · data-i18n-html="key"(innerHTML — 사전의 내 문자열만; <span data-count> 같은 자리표시 포함 가능) ·
             data-i18n-placeholder / data-i18n-aria-label / data-i18n-alt / data-i18n-title(속성) · data-lang-current(현재 언어명) ·
             .portal-lang(풀다운 — 여러 개 가능: 헤더 + 햄버거 사이드바) 안의 .portal-lang-toggle / .portal-lang-menu(비워 두면 13개 항목을 채움)
   - ⚠ main.js 보다 먼저 실행돼야 한다: main.js 가 .reveal-type 제목을 SplitType 으로 글자 단위 <span> 으로 쪼개므로 그 전에 텍스트를 바꿔야 한다.
     같은 이유로 언어 변경은 새로고침(?lang=)으로 처리한다 — 쪼개진 글자·AOS·ScrollTrigger 를 새 텍스트로 다시 만들기 위해(home3 와 동일)
   - portal.js 는 window.BROODEV_T(key, vars, fallback) 로 카탈로그 이름·설명·UI 문구를 꺼낸다 */
(function (root) {
  'use strict';
  var D = root.BROODEV_I18N || {};
  var LANGS = ['en', 'ja', 'ko', 'zh', 'es', 'pt', 'fr', 'ru', 'de', 'it', 'th', 'zh-Hant', 'nl'];
  var NAMES = { en: 'English', ja: '日本語', ko: '한국어', zh: '简体中文', es: 'Español', pt: 'Português', fr: 'Français', ru: 'Русский', de: 'Deutsch', it: 'Italiano', th: 'ไทย', 'zh-Hant': '繁體中文', nl: 'Nederlands' };
  var HTML_LANG = { zh: 'zh-Hans' };
  var STORE = 'broodev:lang';

  function norm(tag) {
    tag = String(tag || '').toLowerCase();
    if (!tag) return null;
    if (tag.indexOf('zh') === 0) return /hant|tw|hk|mo/.test(tag) ? 'zh-Hant' : 'zh';
    var p = tag.split('-')[0];
    return LANGS.indexOf(p) >= 0 ? p : null;
  }
  function detect() {
    var q = /[?&]lang=([A-Za-z-]+)/.exec(root.location ? root.location.search : '');
    if (q && norm(q[1])) return norm(q[1]);
    var saved = null; try { saved = localStorage.getItem(STORE); } catch (e) { /* 프라이빗 모드 */ }
    if (LANGS.indexOf(saved) >= 0) return saved;
    var nav = root.navigator || {};
    var cands = nav.languages && nav.languages.length ? nav.languages : [nav.language];
    for (var i = 0; i < cands.length; i++) { var l = norm(cands[i]); if (l) return l; }
    return 'en';
  }
  var cur = detect();
  try { if (/[?&]lang=/.test(location.search)) localStorage.setItem(STORE, cur); } catch (e) { /* 저장 못 해도 이번 페이지는 적용 */ }

  // t(key, vars, fallback): 현재 언어 → en → ko → fallback(카탈로그 원문 등) → key
  function t(key, vars, fallback) {
    var s = D[cur] && D[cur][key] != null ? D[cur][key]
      : (D.en && D.en[key] != null ? D.en[key]
        : (D.ko && D.ko[key] != null ? D.ko[key] : (fallback != null ? fallback : key)));
    if (vars) s = String(s).replace(/\{(\w+)\}/g, function (_, k) { return vars[k] != null ? vars[k] : ''; });
    return s;
  }
  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }

  function apply() {
    document.documentElement.lang = HTML_LANG[cur] || cur;
    if (D.en && D.en.meta_title && document.body && !document.body.hasAttribute('data-i18n-static-title')) {
      var page = document.body.getAttribute('data-i18n-page');     // 404 는 nf_title
      document.title = t(page === '404' ? 'nf_title' : 'meta_title');
    }
    var md = document.querySelector('meta[name="description"]');
    if (md && D.en && D.en.meta_desc) md.setAttribute('content', t('meta_desc'));
    var og = { 'meta[property="og:title"]': 'og_title', 'meta[name="twitter:title"]': 'og_title', 'meta[property="og:description"]': 'og_desc', 'meta[name="twitter:description"]': 'og_desc', 'meta[property="og:image:alt"]': 'og_title' };
    Object.keys(og).forEach(function (sel) { var el = document.querySelector(sel); if (el && D.en && D.en[og[sel]]) el.setAttribute('content', t(og[sel])); });
    each('[data-i18n]', function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    each('[data-i18n-html]', function (el) { el.innerHTML = t(el.getAttribute('data-i18n-html')); });
    ['placeholder', 'aria-label', 'alt', 'title'].forEach(function (attr) {
      each('[data-i18n-' + attr + ']', function (el) { el.setAttribute(attr, t(el.getAttribute('data-i18n-' + attr))); });
    });
    each('[data-lang-current]', function (el) { el.textContent = NAMES[cur]; });
    each('[data-lang]', function (el) { el.classList.toggle('active', el.getAttribute('data-lang') === cur); });
  }

  function set(lang) {
    if (LANGS.indexOf(lang) < 0) return;
    try { localStorage.setItem(STORE, lang); } catch (e) { /* ?lang= 으로 전달 */ }
    if (lang === cur) return;
    // SplitType 조각·AOS·ScrollTrigger 를 새 언어로 다시 만들기 위해 새로고침
    location.replace(location.pathname + '?lang=' + lang + location.hash);
  }

  // 풀다운(.portal-lang — 여러 개). 항목 href 는 ?lang= 실제 링크(크롤러용), 클릭은 가로채서 저장 → 새로고침
  function bindDropdowns() {
    var all = [];
    each('.portal-lang', function (dd) {
      var btn = dd.querySelector('.portal-lang-toggle'), menu = dd.querySelector('.portal-lang-menu');
      if (!btn || !menu) return;
      if (!menu.children.length) {
        LANGS.forEach(function (l) {
          var li = document.createElement('li'), a = document.createElement('a');
          a.href = '?lang=' + l; a.setAttribute('role', 'option'); a.setAttribute('data-lang', l); a.setAttribute('lang', HTML_LANG[l] || l); a.textContent = NAMES[l];
          if (l === cur) { a.className = 'active'; a.setAttribute('aria-selected', 'true'); }
          li.appendChild(a); menu.appendChild(li);
        });
      }
      var close = function () { dd.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
      btn.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        all.forEach(function (c) { if (c !== close) c(); });
        var open = dd.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      Array.prototype.forEach.call(menu.querySelectorAll('[data-lang]'), function (a) {
        a.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); close(); set(a.getAttribute('data-lang')); });
      });
      all.push(close);
    });
    document.addEventListener('click', function (e) { if (!e.target.closest || !e.target.closest('.portal-lang')) all.forEach(function (c) { c(); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') all.forEach(function (c) { c(); }); });
  }

  root.BROODEV_T = t;
  root.BROODEV_I18N_RT = { t: t, apply: apply, set: set, lang: function () { return cur; }, LANGS: LANGS, NAMES: NAMES };
  apply();
  bindDropdowns();
}(window));
