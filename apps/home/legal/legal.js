/* broodev.com 법적 페이지 · premium.html 공통 — 13개 언어 풀다운 + 번역 조각 로딩 + biz.js 값 채움
   - 언어 목록·이름·순서는 utils(js/i18n.js) 와 동일한 13개. 풀다운 <ul id="legal-lang-menu"> 는 비워 두면 이 파일이 채운다(5개 페이지에 13개를 중복 기재하지 않기 위해)
   - 감지: ?lang=(utils 푸터 링크가 실어 보냄) → localStorage(broodev:lang — 포털 assets/js/i18n.js 와 같은 키: 포털에서 고른 언어가 여기에도 이어진다) → navigator.languages 첫 매치(zh-TW/HK/MO → zh-Hant) → en
   - 상단 헤더 메뉴(포털 셸) 라벨은 [data-nav="apps|premium|about|contact"] ← NAV (포털 i18n-data.js 의 nav_* 와 같은 문구)
   - 본문: 페이지 HTML 에는 <article data-lang-block="ja|ko|en"> 3개만 들어 있다(일본어 正文 · JS 없이도 ja 가 보임).
     그 외 10개 언어(zh·es·pt·fr·ru·de·it·th·zh-Hant·nl)는 /legal/i18n/{doc}.{lang}.html 조각(같은 구조의 <article> 1개)을 선택 시 fetch 해서 끼워 넣는다
     — 13개를 한 파일에 다 넣으면 페이지가 10배 무거워지므로. {doc} 은 <body data-legal-doc="tokushoho|terms|privacy|refund|premium">
     조각을 못 받으면(오프라인·404) en 블록 + 그 언어로 쓴 안내(#legal-notice: 「영어판 표시 · 정본은 일본어」)로 폴백
   - <title>·meta description 은 표시 중인 article 의 data-title / data-desc 로 교체. <html lang> 은 선택 언어(zh → zh-Hans)
   - [data-biz="키"] ← BIZ(언어별 '_ko' '_en' 변형 우선 · ja 외 언어에 전용 변형이 없으면 '_en') · [data-biz-href="email"] ← mailto: ·
     [data-price="utils.yearly"] ← PLANS 경로(¥2,500) · [data-price-monthly] ← 연액 ÷ 12 반올림 · [data-plan-url] ← href
   - BIZ.invoice_no 가 자리표시자(T000…)면 [data-biz-row="invoice_no"] 숨김
   - V = 캐시 버스터. legal.js/css·조각을 고치면 여기와 5개 페이지의 ?v= 를 같이 올린다 */
(function () {
  'use strict';
  var BIZ = window.BIZ || {}, PLANS = window.PLANS || {};
  var V = '20261007b';
  var LANGS = ['en', 'ja', 'ko', 'zh', 'es', 'pt', 'fr', 'ru', 'de', 'it', 'th', 'zh-Hant', 'nl'];
  var NAMES = { en: 'English', ja: '日本語', ko: '한국어', zh: '简体中文', es: 'Español', pt: 'Português', fr: 'Français', ru: 'Русский', de: 'Deutsch', it: 'Italiano', th: 'ไทย', 'zh-Hant': '繁體中文', nl: 'Nederlands' };
  var HTML_LANG = { zh: 'zh-Hans' };
  var STORE = 'broodev:lang';   // 포털(assets/js/i18n.js)과 공유
  var DOC = document.body.getAttribute('data-legal-doc') || (location.pathname.replace(/\.html?$/, '').split('/').pop() || '');
  var FRAG_BASE = '/legal/i18n/';
  // 조각을 못 받았을 때의 안내(그 언어로). 정본은 일본어(利用規約 第17条)
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
  // 하단 공통 링크(.legal-foot [data-foot="키"]) 라벨 — utils js/i18n.js 의 foot_* 와 같은 문구. premium 은 「Premium · 요금」
  var FOOT = {
    ja: { premium: 'Premium · 料金', tokushoho: '特定商取引法に基づく表記', terms: '利用規約', privacy: 'プライバシーポリシー', refund: '返金・解約ポリシー', contact: 'お問い合わせ' },
    ko: { premium: 'Premium · 요금', tokushoho: '특정상거래법 표기', terms: '이용약관', privacy: '개인정보 처리방침', refund: '환불·해지 정책', contact: '문의' },
    en: { premium: 'Premium · Pricing', tokushoho: 'Legal notice (特定商取引法)', terms: 'Terms of Service', privacy: 'Privacy Policy', refund: 'Refund & Cancellation', contact: 'Contact' },
    zh: { premium: 'Premium · 价格', tokushoho: '特定商取引法声明', terms: '服务条款', privacy: '隐私政策', refund: '退款与取消政策', contact: '联系我们' },
    es: { premium: 'Premium · Precios', tokushoho: 'Aviso legal (Ley japonesa de transacciones comerciales)', terms: 'Términos del servicio', privacy: 'Política de privacidad', refund: 'Reembolsos y cancelación', contact: 'Contacto' },
    pt: { premium: 'Premium · Preços', tokushoho: 'Aviso legal (Lei japonesa de transações comerciais)', terms: 'Termos de serviço', privacy: 'Política de privacidade', refund: 'Reembolsos e cancelamento', contact: 'Contato' },
    fr: { premium: 'Premium · Tarifs', tokushoho: 'Mentions légales (loi japonaise sur les transactions commerciales)', terms: 'Conditions d’utilisation', privacy: 'Politique de confidentialité', refund: 'Remboursement et résiliation', contact: 'Contact' },
    ru: { premium: 'Premium · Цены', tokushoho: 'Юридическая информация (японский закон о коммерческих сделках)', terms: 'Условия использования', privacy: 'Политика конфиденциальности', refund: 'Возврат и отмена', contact: 'Контакты' },
    de: { premium: 'Premium · Preise', tokushoho: 'Impressum (jap. Gesetz über besondere Handelsgeschäfte)', terms: 'Nutzungsbedingungen', privacy: 'Datenschutzerklärung', refund: 'Rückerstattung & Kündigung', contact: 'Kontakt' },
    it: { premium: 'Premium · Prezzi', tokushoho: 'Note legali (legge giapponese sulle transazioni commerciali)', terms: 'Termini di servizio', privacy: 'Informativa sulla privacy', refund: 'Rimborsi e disdetta', contact: 'Contatti' },
    th: { premium: 'Premium · ราคา', tokushoho: 'ประกาศตามกฎหมายธุรกรรมเฉพาะ (ญี่ปุ่น)', terms: 'ข้อกำหนดการใช้งาน', privacy: 'นโยบายความเป็นส่วนตัว', refund: 'นโยบายคืนเงินและยกเลิก', contact: 'ติดต่อ' },
    'zh-Hant': { premium: 'Premium · 價格', tokushoho: '特定商取引法標示', terms: '服務條款', privacy: '隱私權政策', refund: '退款與取消政策', contact: '聯絡我們' },
    nl: { premium: 'Premium · Prijzen', tokushoho: 'Wettelijke vermelding (Japanse wet op handelstransacties)', terms: 'Gebruiksvoorwaarden', privacy: 'Privacybeleid', refund: 'Terugbetaling & opzegging', contact: 'Contact' }
  };
  var LANG_LABEL = { ja: '言語', ko: '언어', en: 'Language', zh: '语言', es: 'Idioma', pt: 'Idioma', fr: 'Langue', ru: 'Язык', de: 'Sprache', it: 'Lingua', th: 'ภาษา', 'zh-Hant': '語言', nl: 'Taal' };
  // 상단 헤더 메뉴([data-nav]) — 포털 assets/js/i18n-data.js 의 nav_apps/nav_premium/nav_about/nav_contact 와 같은 문구
  var NAV = {
    ja: { apps: 'アプリ一覧', premium: 'Premium', about: '紹介', contact: 'お問い合わせ' },
    ko: { apps: '전체 앱', premium: '프리미엄', about: '소개', contact: '연락' },
    en: { apps: 'Apps', premium: 'Premium', about: 'About', contact: 'Contact' },
    zh: { apps: '全部应用', premium: 'Premium', about: '关于', contact: '联系' },
    es: { apps: 'Apps', premium: 'Premium', about: 'Acerca de', contact: 'Contacto' },
    pt: { apps: 'Apps', premium: 'Premium', about: 'Sobre', contact: 'Contato' },
    fr: { apps: 'Applis', premium: 'Premium', about: 'À propos', contact: 'Contact' },
    ru: { apps: 'Приложения', premium: 'Premium', about: 'О проекте', contact: 'Контакты' },
    de: { apps: 'Apps', premium: 'Premium', about: 'Über uns', contact: 'Kontakt' },
    it: { apps: 'App', premium: 'Premium', about: 'Informazioni', contact: 'Contatti' },
    th: { apps: 'แอปทั้งหมด', premium: 'Premium', about: 'เกี่ยวกับ', contact: 'ติดต่อ' },
    'zh-Hant': { apps: '應用程式', premium: 'Premium', about: '關於', contact: '聯絡' },
    nl: { apps: 'Apps', premium: 'Premium', about: 'Over', contact: 'Contact' }
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
    if (q && norm(q[1])) {
      try { localStorage.setItem(STORE, norm(q[1])); } catch (e0) { /* 저장 못 해도 이번 페이지는 적용 */ }   // 포털(i18n.js)과 동일: ?lang= 로 온 언어가 다음 페이지에도 이어지게
      return norm(q[1]);
    }
    var saved = null; try { saved = localStorage.getItem(STORE); } catch (e) { /* 프라이빗 모드 */ }
    if (LANGS.indexOf(saved) >= 0) return saved;
    var cands = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
    for (var i = 0; i < cands.length; i++) { var l = norm(cands[i]); if (l) return l; }
    return 'en';
  }

  // 지금 문서 안에 있는 언어 블록(처음엔 ja·ko·en, 조각을 받으면 늘어남). 없는 언어는 en(없으면 첫 블록)으로
  var blocks = [], failed = {};
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

  // 번역 조각 fetch → 마지막 블록 뒤에 삽입. 실패하면 failed 에 기록(세션 중 재시도 안 함)
  function ensureBlock(lang, cb) {
    if (blocks.indexOf(lang) >= 0) return cb(true);
    if (!DOC || failed[lang] || typeof window.fetch !== 'function' || !('content' in document.createElement('template'))) return cb(false);
    window.fetch(FRAG_BASE + DOC + '.' + lang + '.html?v=' + V, { credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.text(); })
      .then(function (html) {
        var tpl = document.createElement('template');
        tpl.innerHTML = html;
        var art = tpl.content.querySelector('[data-lang-block="' + lang + '"]');
        if (!art) throw new Error('no article');
        art.hidden = true;
        var all = document.querySelectorAll('[data-lang-block]'), last = all[all.length - 1];
        last.parentNode.insertBefore(art, last.nextSibling);
        blocks.push(lang);
        cb(true);
      })
      .catch(function () { failed[lang] = true; cb(false); });
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
    var foot = FOOT[lang] || FOOT.en;
    each('[data-foot]', function (el) { var v = foot[el.getAttribute('data-foot')]; if (v) el.textContent = v; });
    var nav = NAV[lang] || NAV.en;
    each('[data-nav]', function (el) { var v = nav[el.getAttribute('data-nav')]; if (v) el.textContent = v; });
    each('#legal-lang-toggle', function (el) { el.setAttribute('aria-label', LANG_LABEL[lang] || LANG_LABEL.en); });
    each('[data-biz]', function (el) {
      var k = el.getAttribute('data-biz');
      var v = BIZ[k + '_' + block] != null ? BIZ[k + '_' + block] : (block !== 'ja' && BIZ[k + '_en'] != null ? BIZ[k + '_en'] : BIZ[k]);
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
    // 평생 플랜 할인 표시(premium.html .deal-row): PLANS.<app>.lifetime_list 가 null 이면 deal-off → 태그·취소선·小字 숨김(legal.css)
    each('[data-price$=".lifetime_list"]', function (el) {
      var on = path(PLANS, el.getAttribute('data-price')) != null, row = el.closest ? el.closest('.deal-row') : null;
      if (row) row.classList.toggle('deal-off', !on);
    });
    var placeholder = !BIZ.invoice_no || /^T0{13}$/.test(BIZ.invoice_no);
    each('[data-biz-row="invoice_no"]', function (el) { el.hidden = placeholder; });
    document.documentElement.setAttribute('data-legal-ready', lang);
  }

  // 공개 진입점: 블록이 없으면 받아오는 동안 본문을 숨겼다가(영어판이 잠깐 비치지 않게) 도착 후 apply. 늦게 도착한 이전 요청은 무시(seq)
  var seq = 0;
  function show(lang) {
    var my = ++seq;
    if (blocks.indexOf(lang) >= 0) return apply(lang);
    document.documentElement.lang = HTML_LANG[lang] || lang;
    document.documentElement.removeAttribute('data-legal-ready');
    each('[data-lang-block]', function (el) { el.hidden = true; });
    if (notice) notice.hidden = true;
    each('[data-lang-current]', function (el) { el.textContent = NAMES[lang]; });
    ensureBlock(lang, function () { if (my === seq) apply(lang); });
  }

  function set(lang) {
    if (LANGS.indexOf(lang) < 0) return;
    try { localStorage.setItem(STORE, lang); } catch (e) { /* 무시 */ }
    try { history.replaceState(null, '', location.pathname + '?lang=' + lang + location.hash); } catch (e2) { /* file: 등 */ }
    show(lang);
  }

  // 풀다운 항목(LANGS 순서). href 는 ?lang= 변형 URL — 클릭은 가로채 저장·전환하고, 크롤러에는 실제 링크
  var menu = document.getElementById('legal-lang-menu');
  if (menu && !menu.children.length) {
    LANGS.forEach(function (l) {
      var li = document.createElement('li'), a = document.createElement('a');
      a.href = '?lang=' + l; a.setAttribute('role', 'option'); a.setAttribute('data-lang', l); a.setAttribute('lang', HTML_LANG[l] || l); a.textContent = NAMES[l];
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

  show(detect());
  window.BROODEV_LEGAL = { show: show, set: set, LANGS: LANGS, NAMES: NAMES, doc: DOC };
}());
