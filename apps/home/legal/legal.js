/* broodev.com 법적 페이지 · premium.html 공통 — 13개 언어 풀다운 + biz.js 값 채움
   - 언어 목록·이름·순서는 utils(js/i18n.js) 와 동일한 13개. 풀다운 <ul id="legal-lang-menu"> 는 비워 두면 이 파일이 채운다(5개 페이지에 13개를 중복 기재하지 않기 위해)
   - 감지: ?lang=(utils 푸터 링크가 실어 보냄) → localStorage(broodev:legal-lang) → navigator.languages 첫 매치(zh-TW/HK/MO → zh-Hant) → en
   - 본문: <article data-lang-block="ja|ko|en"> 중 선택 언어 블록을 표시. 그 외 10개 언어(zh·es·pt·fr·ru·de·it·th·zh-Hant·nl)는 법적 문서 번역본이 없으므로
     en 블록을 보여 주고 그 언어로 쓴 안내(#legal-notice: 「ja·ko·en 만 제공, 아래는 영어판, 정본은 일본어」)를 본문 위에 띄운다. 풀다운에서는 그런 언어에 「EN」 꼬리표
   - <title>·meta description 은 표시 중인 article 의 data-title / data-desc 로 교체. <html lang> 은 선택 언어(zh → zh-Hans)
   - [data-biz="키"] ← BIZ(언어별 '_ko' '_en' 변형 우선) · [data-biz-href="email"] ← mailto: · [data-price="utils.yearly"] ← PLANS 경로(¥2,500) · [data-price-monthly] ← 연액 ÷ 12 반올림 · [data-plan-url] ← href
   - BIZ.invoice_no 가 자리표시자(T000…)면 [data-biz-row="invoice_no"] 숨김
   - HTML 기본은 ja 가 보이는 상태 → JS 없이도 正文은 보인다 */
(function () {
  'use strict';
  var BIZ = window.BIZ || {}, PLANS = window.PLANS || {};
  var LANGS = ['en', 'ja', 'ko', 'zh', 'es', 'pt', 'fr', 'ru', 'de', 'it', 'th', 'zh-Hant', 'nl'];
  var NAMES = { en: 'English', ja: '日本語', ko: '한국어', zh: '简体中文', es: 'Español', pt: 'Português', fr: 'Français', ru: 'Русский', de: 'Deutsch', it: 'Italiano', th: 'ไทย', 'zh-Hant': '繁體中文', nl: 'Nederlands' };
  var HTML_LANG = { zh: 'zh-Hans' };
  var STORE = 'broodev:legal-lang';
  // 번역본이 없는 언어에 띄우는 안내(그 언어로). 법적 문서는 ja·ko·en 만 있고, 정본은 일본어(利用規約 第17条)
  var NOTICE = {
    zh: '本页面目前仅提供日语、韩语和英语版本。以下显示的是英文版；具有法律效力的正式文本为日文版。',
    es: 'Esta página solo está disponible en japonés, coreano e inglés. A continuación se muestra la versión en inglés; el texto japonés es el que tiene validez legal.',
    pt: 'Esta página está disponível apenas em japonês, coreano e inglês. Abaixo é exibida a versão em inglês; o texto em japonês é o que tem validade legal.',
    fr: 'Cette page n’est disponible qu’en japonais, coréen et anglais. La version anglaise est affichée ci-dessous ; le texte japonais fait foi.',
    ru: 'Эта страница доступна только на японском, корейском и английском языках. Ниже показана английская версия; юридически обязательным является японский текст.',
    de: 'Diese Seite ist nur auf Japanisch, Koreanisch und Englisch verfügbar. Unten wird die englische Fassung angezeigt; rechtlich maßgeblich ist der japanische Text.',
    it: 'Questa pagina è disponibile solo in giapponese, coreano e inglese. Di seguito è mostrata la versione inglese; il testo giapponese è quello legalmente vincolante.',
    th: 'หน้านี้มีเฉพาะภาษาญี่ปุ่น เกาหลี และอังกฤษเท่านั้น ด้านล่างแสดงฉบับภาษาอังกฤษ ฉบับภาษาญี่ปุ่นเป็นฉบับที่มีผลทางกฎหมาย',
    'zh-Hant': '本頁面目前僅提供日文、韓文及英文版本。以下顯示英文版；具法律效力的正式文本為日文版。',
    nl: 'Deze pagina is alleen beschikbaar in het Japans, Koreaans en Engels. Hieronder staat de Engelse versie; de Japanse tekst is juridisch bindend.',
    en: 'This page is available in Japanese, Korean and English only. The English version is shown below; the Japanese text is legally binding.'
  };

  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }
  function yen(n) { return '¥' + Number(n).toLocaleString('en-US'); }
  function path(obj, p) { return String(p).split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, obj); }
  // 'ko-KR' → ko · 'zh-TW'/'zh-Hant-HK' → zh-Hant · 'zh'/'zh-CN' → zh · 'pt-BR' → pt · 미지원 → null
  function norm(tag) {
    tag = String(tag || '').toLowerCase();
    if (!tag) return null;
    if (tag.indexOf('zh') === 0) return /hant|tw|hk|mo/.test(tag) ? 'zh-Hant' : 'zh';
    var p = tag.split('-')[0];
    return LANGS.indexOf(p) >= 0 ? p : null;
  }
  function detect() {
    var q = /[?&]lang=([A-Za-z-]+)/.exec(location.search);
    if (q && norm(q[1])) return norm(q[1]);
    var saved = null; try { saved = localStorage.getItem(STORE); } catch (e) { /* 프라이빗 모드 */ }
    if (LANGS.indexOf(saved) >= 0) return saved;
    var cands = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
    for (var i = 0; i < cands.length; i++) { var l = norm(cands[i]); if (l) return l; }
    return 'en';
  }

  // 이 페이지에 번역 블록이 있는 언어(보통 ja·ko·en). 없는 언어는 en(없으면 첫 블록)으로
  var blocks = [];
  each('[data-lang-block]', function (el) { blocks.push(el.getAttribute('data-lang-block')); });
  function blockFor(lang) { return blocks.indexOf(lang) >= 0 ? lang : (blocks.indexOf('en') >= 0 ? 'en' : blocks[0]); }

  var notice = document.getElementById('legal-notice');
  if (!notice) {
    var first = document.querySelector('[data-lang-block]');
    if (first) {
      notice = document.createElement('div');
      notice.id = 'legal-notice'; notice.className = 'legal-notice'; notice.setAttribute('role', 'note'); notice.hidden = true;
      first.parentNode.insertBefore(notice, first);
    }
  }

  function apply(lang) {
    var block = blockFor(lang);
    document.documentElement.lang = HTML_LANG[lang] || lang;
    each('[data-lang-block]', function (el) {
      var on = el.getAttribute('data-lang-block') === block;
      el.hidden = !on;
      if (on) {
        if (el.getAttribute('data-title')) document.title = el.getAttribute('data-title');
        var md = document.querySelector('meta[name="description"]');
        if (md && el.getAttribute('data-desc')) md.setAttribute('content', el.getAttribute('data-desc'));
      }
    });
    if (notice) {
      var fb = block !== lang && NOTICE[lang];
      notice.hidden = !fb;
      if (fb) { notice.textContent = NOTICE[lang]; notice.setAttribute('lang', HTML_LANG[lang] || lang); }
    }
    each('[data-lang]', function (a) { a.classList.toggle('active', a.getAttribute('data-lang') === lang); });
    each('[data-lang-current]', function (el) { el.textContent = NAMES[lang]; });
    each('[data-biz]', function (el) {
      var k = el.getAttribute('data-biz');
      var v = BIZ[k + '_' + block] != null ? BIZ[k + '_' + block] : BIZ[k];
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

  function set(lang) {
    if (LANGS.indexOf(lang) < 0) return;
    try { localStorage.setItem(STORE, lang); } catch (e) { /* 무시 */ }
    try { history.replaceState(null, '', location.pathname + '?lang=' + lang + location.hash); } catch (e2) { /* file: 등 */ }
    apply(lang);
  }

  // 풀다운 항목(LANGS 순서). href 는 ?lang= 변형 URL — 클릭은 가로채 저장·전환하고, 크롤러에는 실제 링크. 번역본 없는 언어에는 「EN」 꼬리표
  var menu = document.getElementById('legal-lang-menu');
  if (menu && !menu.children.length) {
    LANGS.forEach(function (l) {
      var li = document.createElement('li'), a = document.createElement('a');
      a.href = '?lang=' + l; a.setAttribute('role', 'option'); a.setAttribute('data-lang', l); a.setAttribute('lang', HTML_LANG[l] || l); a.textContent = NAMES[l];
      if (blocks.length && blocks.indexOf(l) < 0) { var tag = document.createElement('span'); tag.className = 'legal-lang-fb'; tag.setAttribute('lang', 'en'); tag.textContent = 'EN'; a.appendChild(tag); }
      li.appendChild(a); menu.appendChild(li);
    });
  }
  var $lang = document.getElementById('legal-lang'), $toggle = document.getElementById('legal-lang-toggle');
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
  each('[data-lang]', function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); set(a.getAttribute('data-lang')); closeLang(); });
  });

  apply(detect());
  window.BROODEV_LEGAL = { apply: apply, set: set, LANGS: LANGS, NAMES: NAMES };
}());
