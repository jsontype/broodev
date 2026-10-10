/* dev2 i18n 런타임 — 13개 언어 (사전은 i18n-data.js 의 window.HOME2_I18N). dev3/assets/js/i18n.js 를 이 템플릿에 맞게 옮긴 것.
   감지: localStorage(home:lang) → ?lang= → navigator.languages 순서대로 첫 매치 → en  (dev3 와 같은 키라 홈을 바꿔 끼워도 언어가 유지된다)
   페이지 제목·설명: <html data-i18n-title="key" data-i18n-desc="key"> (생략 시 meta_title/meta_desc)
   마크업: data-i18n="key"(textContent) · data-i18n-aria-label · data-i18n-alt · data-i18n-placeholder · data-i18n-titleattr(title 속성)
           data-lang-current(현재 언어명) · [data-lang="xx"](풀다운 항목, 클릭 → 저장 → 새로고침)
   ⚠ 이 파일은 jquery(·jquery.validate) 다음, custom.js 보다 먼저 실행돼야 한다 — custom.js 가 DOM ready 때 오프스크린 섹션의
     스크롤 위치(data-scroll-offset)를 재고 슬라이더 페이저를 만들기 때문에, 그 전에 글자를 바꿔 둔다. 언어 변경은 새로고침으로 처리한다. */
(function (root) {
  'use strict';
  var D = root.HOME2_I18N || {};
  // 풀다운 순서: 영어 · 일본어 · 한국어, 그 아래 btc 앱과 같은 10개 (dev3 와 동일)
  var LANGS = ['en', 'ja', 'ko', 'zh', 'zh-Hant', 'th', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'nl'];
  var NAMES = { en: 'English', ja: '日本語', ko: '한국어', zh: '简体中文', 'zh-Hant': '繁體中文', th: 'ไทย', es: 'Español', fr: 'Français', de: 'Deutsch', it: 'Italiano', pt: 'Português', ru: 'Русский', nl: 'Nederlands' };
  var KEY = 'home:lang';
  var fromQuery = false;

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
    if (q && norm(q[1])) { fromQuery = true; return norm(q[1]); }
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
  function withLang(href) { return href.replace(/([?&])lang=[^&#]*&?/, '$1').replace(/[?&]$/, '').replace(/^([^#]*?)(#|$)/, function (_, p, h) { return p + (p.indexOf('?') >= 0 ? '&' : '?') + 'lang=' + encodeURIComponent(cur) + h; }); }

  function apply() {
    var html = document.documentElement;
    html.lang = cur === 'zh' ? 'zh-Hans' : cur;
    document.title = t(html.getAttribute('data-i18n-title') || 'meta_title');
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', t(html.getAttribute('data-i18n-desc') || 'meta_desc'));
    // OG/트위터 메타도 같은 값으로 (크롤러용 정적 값은 HTML 원문 = 한국어)
    var ttl = document.title, dsc = md ? md.getAttribute('content') : '';
    each('meta[property="og:title"],meta[name="twitter:title"],meta[property="og:image:alt"]', function (el) { el.setAttribute('content', ttl); });
    each('meta[property="og:description"],meta[name="twitter:description"]', function (el) { el.setAttribute('content', dsc); });
    each('[data-i18n]', function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    each('[data-i18n-aria-label]', function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria-label'))); });
    each('[data-i18n-alt]', function (el) { el.setAttribute('alt', t(el.getAttribute('data-i18n-alt'))); });
    each('[data-i18n-placeholder]', function (el) { el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder'))); });
    each('[data-i18n-titleattr]', function (el) { el.setAttribute('title', t(el.getAttribute('data-i18n-titleattr'))); });
    each('[data-lang-current]', function (el) { el.textContent = NAMES[cur]; });
    each('[data-lang]', function (el) { el.classList.toggle('active', el.getAttribute('data-lang') === cur); });
    // Blog 모달 iframe(data-src)은 언제나 같은 언어로 — localStorage 를 못 쓰는 환경에서도 ?lang= 으로 전달
    each('iframe[data-src]', function (el) { el.setAttribute('data-src', withLang(el.getAttribute('data-src'))); });
    // ?lang= 으로만 들어온 경우(저장 안 됨)엔 내부 .html 링크에도 언어를 붙여 페이지 이동 후에도 유지
    if (fromQuery) each('a[href$=".html"],a[href*=".html#"]', function (el) { var h = el.getAttribute('href'); if (!/^[a-z]+:|^\/\//i.test(h)) el.setAttribute('href', withLang(h)); });
    // jquery.validate 기본 메시지(영어)를 현재 언어로
    var $ = root.jQuery;
    if ($ && $.validator && $.validator.messages) { $.validator.messages.required = t('val_required'); $.validator.messages.email = t('val_email'); }
  }

  function set(lang) {
    if (LANGS.indexOf(lang) < 0 || lang === cur) return;
    try { localStorage.setItem(KEY, lang); } catch (e) { /* 저장 실패 시 ?lang 으로 */ }
    location.replace(location.pathname + '?lang=' + lang + location.hash);
  }

  // 풀다운: 자체 토글 — Bootstrap dropdown 의존 없음. Blog 모달 iframe 안에서는 부모 페이지의 풀다운을 쓰므로 숨긴다.
  function bindDropdown() {
    var dd = document.getElementById('lang-dd'), btn = document.getElementById('lang-dd-toggle');
    if (!dd || !btn) return;
    var framed = false;
    try { framed = root.self !== root.top; } catch (e) { framed = true; }
    if (framed) { dd.style.display = 'none'; return; }
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

  root.HOME2_T = t;
  root.HOME2_I18N_RT = { t: t, apply: apply, set: set, lang: function () { return cur; }, LANGS: LANGS, NAMES: NAMES };
  apply();
  bindDropdown();
}(window));
