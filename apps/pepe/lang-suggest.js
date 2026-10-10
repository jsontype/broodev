/* broodev 언어 제안 바 — 원본: packages/seo/lang-suggest.js → 각 앱 루트 /lang-suggest.js 로 복사(node scripts/seo-sync.mjs). 앱 사본을 직접 고치지 말 것.
 *
 * 왜: 표시 언어를 브라우저 언어(navigator)로 자동 전환하면 구글봇(미국 영어 환경으로 렌더)에게 기준 언어 정본 대신 영어판이 보여 색인이 망가진다.
 *     그래서 표시 언어는 ?lang= → 앱 저장값 → 페이지 기준 언어(정적 <html lang>) 로만 정하고(packages/seo/README.md),
 *     브라우저 언어가 기준 언어와 다르면 그 언어로 「이 페이지는 ○○로도 볼 수 있습니다 [○○로 보기] [×]」 바를 띄운다.
 * 안 띄우는 경우: ?lang= 가 있음 · 앱 저장 키에 고른 언어가 있음 · 지금 화면 언어(<html lang>)가 이미 기준 언어가 아님 · 닫은 적 있음(localStorage lang-suggest:off)
 *                 · 봇 UA · iframe 안 · 브라우저 언어가 13개 언어에 없거나 기준 언어와 같음
 * 사용: <script src="/lang-suggest.js" data-key="btc:lang" data-json="1" data-base="ko" defer></script>
 *   data-key    앱이 고른 언어를 저장하는 localStorage 키(값이 있으면 안 띄움 · [보기]를 누르면 여기에 저장)
 *   data-json   "1" 이면 저장값이 JSON 문자열(예: "\"ja\"")
 *   data-base   기준 언어(생략 시 정적 <html lang> — zh-Hans → zh)
 *   data-param  언어 쿼리 이름(기본 lang)
 * 바 요소: div.lsg[lang][translate=no][data-i18n-skip] — i18n 스캐너는 [lang] 요소를 건너뛴다.
 */
(function () {
  'use strict';
  var LANGS = ['en', 'ja', 'ko', 'zh', 'zh-Hant', 'th', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'nl'];
  // [안내 문장, 전환 버튼, 닫기 aria-label] — 모두 그 언어의 자국어
  var MSG = {
    en: ['This page is also available in English.', 'View in English', 'Close'],
    ja: ['このページは日本語でもご覧いただけます。', '日本語で表示', '閉じる'],
    ko: ['이 페이지는 한국어로도 볼 수 있습니다.', '한국어로 보기', '닫기'],
    zh: ['本页面也提供简体中文版。', '查看简体中文版', '关闭'],
    'zh-Hant': ['本頁面也提供繁體中文版。', '查看繁體中文版', '關閉'],
    th: ['หน้านี้มีฉบับภาษาไทยด้วย', 'ดูเป็นภาษาไทย', 'ปิด'],
    es: ['Esta página también está disponible en español.', 'Ver en español', 'Cerrar'],
    fr: ['Cette page est également disponible en français.', 'Voir en français', 'Fermer'],
    de: ['Diese Seite gibt es auch auf Deutsch.', 'Auf Deutsch ansehen', 'Schließen'],
    it: ['Questa pagina è disponibile anche in italiano.', 'Vedi in italiano', 'Chiudi'],
    pt: ['Esta página também está disponível em português.', 'Ver em português', 'Fechar'],
    ru: ['Эта страница доступна и на русском языке.', 'Открыть на русском', 'Закрыть'],
    nl: ['Deze pagina is ook beschikbaar in het Nederlands.', 'Bekijk in het Nederlands', 'Sluiten']
  };
  var BOT = /bot|crawl|spider|slurp|mediapartners|google-inspectiontool|googleother|lighthouse|pagespeed|facebookexternalhit|embedly|yeti|petalbot|bytespider|yandex|baidu|applebot|semrush|ahrefs|preview/i;

  function norm(x) {
    x = String(x == null ? '' : x).trim().toLowerCase();
    if (!x) return null;
    if (x === 'zh-hant' || /^zh[-_](tw|hk|mo|hant)/.test(x)) return 'zh-Hant';
    var b = x.split(/[-_]/)[0];
    if (b === 'zh') return 'zh';
    return LANGS.indexOf(b) >= 0 ? b : null;
  }

  var me = document.currentScript;
  var cfg = (me && me.dataset) || {};
  var KEY = cfg.key || '';
  var JSONV = cfg.json === '1';
  var PARAM = cfg.param || 'lang';
  var BASE = norm(cfg.base || document.documentElement.getAttribute('lang')) || 'ko';

  var store = null;
  try { store = window.localStorage; } catch (e) { store = null; }
  function get(k) { try { return store ? store.getItem(k) : null; } catch (e) { return null; } }
  function set(k, v) { try { if (store) store.setItem(k, v); } catch (e) { /* 프라이빗 모드 */ } }

  function want() {
    try { if (window.top !== window.self) return null; } catch (e) { return null; }
    if (BOT.test(navigator.userAgent || '')) return null;
    var q = null;
    try { q = new URLSearchParams(location.search).get(PARAM); } catch (e) { q = null; }
    if (norm(q)) return null;
    if (get('lang-suggest:off') === '1') return null;
    if (KEY) {
      var raw = get(KEY);
      if (raw != null && raw !== '') {
        var v = raw;
        if (JSONV) { try { v = JSON.parse(raw); } catch (e) { v = raw; } }
        if (norm(v)) return null;
      }
    }
    var cur = norm(document.documentElement.getAttribute('lang'));
    if (cur && cur !== BASE) return null;
    var c = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
    for (var i = 0; i < c.length; i++) {
      var l = norm(c[i]);
      if (l) return l === BASE ? null : l;
    }
    return null;
  }

  var CSS =
    '.lsg{position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483000;max-width:540px;margin:0 auto;box-sizing:border-box;' +
    // × 는 오른쪽 위 고정(absolute) — flex 항목이면 좁은 화면에서 혼자 다음 줄 왼쪽으로 떨어져 빈 줄이 생김(390px 실측)
    'display:flex;align-items:center;flex-wrap:wrap;gap:8px 12px;padding:10px 48px 10px 16px;border-radius:12px;background:#15181d;color:#eef1f5;' +
    // 테두리는 어두운 페이지(#0f1115 등) 위에서도 바 경계가 보이게 .24
    'border:1px solid rgba(255,255,255,.24);box-shadow:0 8px 28px rgba(0,0,0,.35);font:14px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans",sans-serif;' +
    'letter-spacing:0;text-align:left;text-transform:none}' +
    '.lsg *{box-sizing:border-box}' +
    '.lsg-t{flex:1 1 180px;min-width:0}' +
    '.lsg-go{flex:none;display:inline-block;padding:7px 14px;border-radius:8px;background:#eef1f5;color:#111418;text-decoration:none;font-weight:600;white-space:nowrap}' +
    '.lsg-go:hover,.lsg-go:focus-visible{background:#fff;outline:2px solid #7fb3ff;outline-offset:2px}' +
    '.lsg-x{position:absolute;top:8px;right:8px;width:32px;height:32px;margin:0;padding:0;border:0;border-radius:8px;background:transparent;color:inherit;font:20px/32px system-ui,sans-serif;cursor:pointer}' +
    '.lsg-x:hover,.lsg-x:focus-visible{background:rgba(255,255,255,.12)}' +
    '@media print{.lsg{display:none}}';

  function show(l) {
    if (document.querySelector('.lsg')) return;
    var m = MSG[l] || MSG.en;
    if (!document.getElementById('lsg-css')) {
      var st = document.createElement('style');
      st.id = 'lsg-css';
      st.textContent = CSS;
      (document.head || document.documentElement).appendChild(st);
    }
    var bar = document.createElement('div');
    bar.className = 'lsg';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', m[1]);
    bar.setAttribute('lang', l === 'zh' ? 'zh-Hans' : l);
    bar.setAttribute('translate', 'no');
    bar.setAttribute('data-i18n-skip', '');
    var t = document.createElement('span');
    t.className = 'lsg-t';
    t.textContent = m[0];
    var go = document.createElement('a');
    go.className = 'lsg-go';
    go.textContent = m[1];
    go.setAttribute('hreflang', l === 'zh' ? 'zh-Hans' : l);
    try {
      var u = new URL(location.href);
      u.searchParams.set(PARAM, l);
      go.href = u.pathname + u.search + u.hash;
    } catch (e) {
      go.href = '?' + PARAM + '=' + encodeURIComponent(l);
    }
    go.addEventListener('click', function () { if (KEY) set(KEY, JSONV ? JSON.stringify(l) : l); });
    var x = document.createElement('button');
    x.type = 'button';
    x.className = 'lsg-x';
    x.setAttribute('aria-label', m[2]);
    x.textContent = '×';
    x.addEventListener('click', function () {
      set('lang-suggest:off', '1');
      if (bar.parentNode) bar.parentNode.removeChild(bar);
    });
    bar.appendChild(t);
    bar.appendChild(go);
    bar.appendChild(x);
    document.body.appendChild(bar);
  }

  function run() {
    var l = want();
    if (l) setTimeout(function () { if (want() === l) show(l); }, 700);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
