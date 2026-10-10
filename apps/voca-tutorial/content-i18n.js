/* content-i18n.js — 콘텐츠 페이지(가이드·소개·약관·404)의 13개 언어 전환 (2026-10-09 · btc · voca · voca-tutorial 공통 사본 — 코인 14종은 gen_coin.py 가 복제)
 *   HTML 안의 한국어 본문이 정본(검색엔진이 색인하는 판). 다른 12개 언어는 /i18n/<doc>.<lang>.html 조각(<main> 전체 번역)을 받아 바꿔 끼운다.
 *   언어 결정: ?lang= → 앱에서 고른 언어(localStorage[data-key], JSON 문자열) → 한국어.
 *     브라우저 언어(navigator)는 쓰지 않는다 — 검색 로봇(en-US)이 렌더한 영어판이 한국어 정본 대신 색인되지 않게. 처음 온 사람은 nav 의 언어 선택으로 바꾼다.
 *     언어 선택(사용자가 고른 언어)만 앱 키에 저장 → 앱 본체·다른 콘텐츠 페이지도 같은 언어로 열린다. 언어를 바꾸면 ?lang= 을 붙여 다시 연다(차트 스크립트가 새 언어로 한 번만 돌게).
 *     ?lang= 으로 연 언어는 저장하지 않는다(L1) — 대신 같은 사이트 링크를 누를 때 ?lang= 을 이어 붙인다(voca · voca-tutorial 사본 2026-10-10 · btc·코인 사본은 아직 저장함).
 *   페이지 스크립트(차트 등)는 window.CI18N.ready 뒤에 돌린다: (window.CI18N ? window.CI18N.ready : Promise.resolve()).then(function () { … window.CI18N.lang … })
 *     ready 는 번역본으로 바꾼 뒤(또는 한국어·실패 시 즉시) 풀린다. lang 은 실제로 보이는 언어(조각을 못 받으면 'ko').
 *   사용: <head> 끝에 <script src="/content-i18n.js?v=…" data-key="btc:lang" data-doc="about"></script> (defer 없이 — 번역이 들어올 때까지 본문을 가려
 *         한국어가 번쩍 보이지 않게. 3초 안에 못 받으면 한국어 그대로 보인다)
 *   조각 형식: <main class="wrap" data-title="번역된 <title>" data-desc="번역된 meta description"> …원문 <main> 과 같은 구조·속성의 번역… </main>
 *   <main> 밖 메뉴(voca 의 nav.site-nav 등)는 스크립트 태그에 data-chrome 이 있으면 앱별 /i18n/_chrome.<lang>.html 이 맡는다: <div data-ci18n-sel="CSS 선택자"> 안의 <a href=…>번역</a> 을
 *     선택자 안의 같은 href 링크 글자에 넣는다(aria-current 등 페이지별 속성은 그대로). 파일이 없으면 건너뛴다. og:/twitter: 제목·설명도 data-title/desc 로 맞춘다.
 *   검사: node scripts/content-i18n-check.mjs (구조·속성·링크·문자 체계·누락) · node scripts/i18n-scan.mjs --set lsjson:<data-key> (실제 렌더)
 */
(function () {
  var LANGS = ['en', 'ja', 'ko', 'zh', 'zh-Hant', 'th', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'nl'];
  var NAMES = { en: 'English', ja: '日本語', ko: '한국어', zh: '简体中文', 'zh-Hant': '繁體中文', th: 'ไทย', es: 'Español', fr: 'Français', de: 'Deutsch', it: 'Italiano', pt: 'Português', ru: 'Русский', nl: 'Nederlands' };
  var LABEL = { en: 'Language', ja: '言語', ko: '언어', zh: '语言', 'zh-Hant': '語言', th: 'ภาษา', es: 'Idioma', fr: 'Langue', de: 'Sprache', it: 'Lingua', pt: 'Idioma', ru: 'Язык', nl: 'Taal' };
  var me = document.currentScript;
  var root = document.documentElement;
  var done;
  var api = window.CI18N = { lang: 'ko', ready: new Promise(function (res) { done = res; }) };
  if (!me) { done(); return; }
  var KEY = me.getAttribute('data-key') || '', DOC = me.getAttribute('data-doc') || '';
  var V = (/[?&]v=([^&#]+)/.exec(me.src) || [])[1] || '';

  function valid(l) { return typeof l === 'string' && LANGS.indexOf(l) >= 0 ? l : null; }
  function stored() { try { var r = localStorage.getItem(KEY); if (r == null) return null; try { return JSON.parse(r); } catch (e) { return r; } } catch (e) { return null; } }
  function save(l) { try { if (KEY) localStorage.setItem(KEY, JSON.stringify(l)); } catch (e) {} }
  var q = null;
  try { q = new URLSearchParams(location.search).get('lang'); } catch (e) {}
  var lang = valid(q);
  if (!lang) lang = valid(stored()) || 'ko'; // ?lang= 으로 연 언어는 저장하지 않는다(packages/seo L1 — 저장 키 = 사용자가 고른 언어만 · 아래 언어 선택에서 저장)

  // 같은 사이트 안 링크를 누르면 지금 언어를 ?lang= 으로 이어 붙인다(저장 대신 주소로 언어를 잇기 — 누르는 순간에만 바꿔 정적 href 는 그대로)
  if (lang !== 'ko') document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a || a.hasAttribute('download')) return;
    try {
      var u = new URL(a.getAttribute('href'), location.href);
      if (u.origin !== location.origin || u.searchParams.has('lang') || /\.(?!html$)[a-z0-9]+$/i.test(u.pathname) || (u.pathname === location.pathname && u.hash)) return;
      u.searchParams.set('lang', lang);
      a.href = u.pathname + u.search + u.hash;
    } catch (err) {}
  }, true);

  var css = document.createElement('style');
  css.textContent = 'html.ci18n-wait main{visibility:hidden}' +
    '.ci18n-sel{margin-left:auto;font:inherit;font-size:12px;line-height:1.3;padding:2px 6px;border:1px solid currentColor;border-radius:6px;background:transparent;color:inherit;opacity:.85;cursor:pointer;max-width:9.5em}' +
    '.ci18n-sel option{color:#111;background:#fff}';
  (document.head || root).appendChild(css);
  var unhide = function () { root.classList.remove('ci18n-wait'); };
  if (lang !== 'ko') { root.classList.add('ci18n-wait'); setTimeout(unhide, 3000); }

  function finish(l) { api.lang = l; root.lang = l === 'zh' ? 'zh-Hans' : l; addSelector(l); unhide(); done(); }
  function isAd(n) { return n.nodeType === 1 && (n.classList.contains('google-auto-placed') || (n.tagName === 'INS' && n.classList.contains('adsbygoogle'))); }

  function setMeta(sel, v) { if (!v) return; var ms = document.querySelectorAll(sel); for (var i = 0; i < ms.length; i++) ms[i].setAttribute('content', v); }

  // <main> 밖 메뉴: _chrome 조각의 [data-ci18n-sel] 마다 같은 href 링크의 글자만 바꾼다
  function chrome(html) {
    var t = document.createElement('template');
    t.innerHTML = html;
    var groups = t.content.querySelectorAll('[data-ci18n-sel]');
    for (var g = 0; g < groups.length; g++) {
      var targets = document.querySelectorAll(groups[g].getAttribute('data-ci18n-sel'));
      var links = groups[g].querySelectorAll('a[href]');
      for (var k = 0; k < targets.length; k++) {
        for (var i = 0; i < links.length; i++) {
          var hits = targets[k].querySelectorAll('a[href="' + links[i].getAttribute('href').replace(/"/g, '\\"') + '"]');
          for (var j = 0; j < hits.length; j++) hits[j].textContent = links[i].textContent;
        }
        var al = groups[g].getAttribute('aria-label');
        if (al) targets[k].setAttribute('aria-label', al);
      }
    }
  }

  function swap(src, title, desc) {
    var main = document.querySelector('main');
    if (!main) return false;
    // 자동 광고가 이미 끼워 넣은 요소는 그대로 둔다(떼어 내면 광고 iframe 이 다시 로드됨) — 나머지만 교체
    var kids = Array.prototype.slice.call(main.childNodes), anchor = null;
    for (var i = 0; i < kids.length; i++) {
      if (isAd(kids[i])) { if (!anchor) anchor = kids[i]; } else main.removeChild(kids[i]);
    }
    var nodes = Array.prototype.slice.call(src.childNodes);
    for (var j = 0; j < nodes.length; j++) main.insertBefore(document.importNode(nodes[j], true), anchor);
    if (title) document.title = title;
    setMeta('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]', desc);
    setMeta('meta[property="og:title"], meta[name="twitter:title"]', title);
    return true;
  }

  function addSelector(l) {
    var host = document.querySelector('main nav') || document.querySelector('main');
    if (!host || host.querySelector('.ci18n-sel')) return;
    var sel = document.createElement('select');
    sel.className = 'ci18n-sel';
    sel.setAttribute('aria-label', LABEL[l] || LABEL.en);
    for (var i = 0; i < LANGS.length; i++) {
      var o = document.createElement('option');
      o.value = LANGS[i]; o.textContent = NAMES[LANGS[i]]; o.lang = LANGS[i];
      if (LANGS[i] === l) o.selected = true;
      sel.appendChild(o);
    }
    sel.addEventListener('change', function () {
      save(sel.value);
      try { var u = new URL(location.href); u.searchParams.set('lang', sel.value); location.replace(u.toString()); }
      catch (e) { location.reload(); }
    });
    host.appendChild(sel);
  }

  // 번역 조각은 head 에서 바로 받기 시작한다(본문 파싱과 병렬) — 바꿔 끼우기는 DOMContentLoaded 뒤
  function get(name) {
    return fetch('/i18n/' + name + '.' + lang + '.html' + (V ? '?v=' + V : ''), { credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); });
  }
  var pMain = lang === 'ko' ? null : get(DOC);
  var pChrome = lang === 'ko' || !me.hasAttribute('data-chrome') ? null : get('_chrome').catch(function () { return ''; });
  if (pMain) pMain.catch(function () {});

  function start() {
    if (!pMain) { finish('ko'); return; }
    Promise.all([pMain, pChrome]).then(function (res) {
      var t = document.createElement('template');
      t.innerHTML = res[0];
      var m = t.content.querySelector('main');
      if (!m || !swap(m, m.getAttribute('data-title'), m.getAttribute('data-desc'))) throw new Error('no <main>');
      if (res[1]) chrome(res[1]);
      finish(lang);
    }).catch(function () { finish('ko'); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
