/* Utils — 안내 페이지 공통 (pricing.html · contact.html · 404.html — 법적 문서는 broodev.com/legal/ 로 통합)
   - 헤더 언어 풀다운(#pg-lang) 토글 + [data-lang] 클릭 → MH_I18N.set
   - <title>·meta description 은 i18n.js apply() 가 <body data-page> 에 맞춰 title_* / desc_* 키로 교체 (여기서는 안 함)
   - 언어별 본문: 페이지 HTML 에는 <article data-lang-block="ja|ko|en"> 3개만 있다(JS 없을 땐 ja 가 보임). 그 외 10개 언어는
     i18n/{data-page}.{lang}.html 조각(같은 구조의 <article> 1개)을 선택 시 fetch 해 끼워 넣는다(13개를 한 파일에 넣으면 10배 무거워지므로).
     조각을 못 받으면(오프라인·404) en 블록. 조각 변경 시 V 와 5개 페이지의 ?v= 를 같이 올린다
   - [data-biz="키"] ← BIZ (언어별 변형 키 '_ko' '_en' 이 있으면 우선) · [data-biz-href="email"] ← mailto:
   - [data-price="yearly|lifetime"] ← PLANS 금액(¥2,500 형식) · [data-plan="경로"] ← PLANS 경로값(범용)
   - 법적 문서 링크(https://broodev.com/…)에 ?lang=현재언어 를 실어 보냄 (legal.js 가 같은 언어로 연다)
   - 등록번호(BIZ.invoice_no)가 자리표시자(T000…)면 [data-biz-row="invoice_no"] 행을 숨김
   index.html · pptx.html 은 app.js 가 같은 역할을 하므로 이 파일을 넣지 않는다. */
(function () {
  'use strict';
  var I = window.MH_I18N, BIZ = window.BIZ || {}, PLANS = window.PLANS || {};
  if (!I) return;
  var V = '20261008a';
  var DOC = document.body ? document.body.getAttribute('data-page') : null;

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

  // broodev.com 법적 문서 링크에 현재 언어를 실어 보냄 — legal.js 가 ?lang= 을 읽어 같은 언어로 연다
  function carryLang(lang) {
    each('a[href^="https://broodev.com/"]', function (a) {
      try { var u = new URL(a.href); u.searchParams.set('lang', lang); a.href = u.toString(); } catch (e) { /* 구형 브라우저 */ }
    });
  }

  // 긴 본문(data-lang-block): 있는 블록은 바로, 없는 언어는 i18n/{DOC}.{lang}.html 조각을 받아 끼운 뒤 표시. 실패하면 en
  var blocks = {}, failed = {}, seq = 0;
  each('[data-lang-block]', function (el) { blocks[el.getAttribute('data-lang-block')] = true; });
  var hasBlocks = Object.keys(blocks).length > 0;
  function showBlock(lang) {
    var show = blocks[lang] ? lang : (blocks.en ? 'en' : 'ja');
    each('[data-lang-block]', function (el) { el.hidden = el.getAttribute('data-lang-block') !== show; });
    document.documentElement.setAttribute('data-block-ready', show);
  }
  function ensureBlock(lang, cb) {
    if (blocks[lang]) return cb(true);
    if (!DOC || failed[lang] || typeof window.fetch !== 'function' || !('content' in document.createElement('template'))) return cb(false);
    window.fetch('i18n/' + DOC + '.' + lang + '.html?v=' + V, { credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.text(); })
      .then(function (html) {
        var tpl = document.createElement('template');
        tpl.innerHTML = html;
        var art = tpl.content.querySelector('[data-lang-block="' + lang + '"]');
        if (!art) throw new Error('no article');
        art.hidden = true;
        var all = document.querySelectorAll('[data-lang-block]'), last = all[all.length - 1];
        last.parentNode.insertBefore(art, last.nextSibling);
        blocks[lang] = true;
        cb(true);
      })
      .catch(function () { failed[lang] = true; cb(false); });
  }

  document.addEventListener('mh:lang', function () {
    var lang = I.lang();
    fill(lang);
    carryLang(lang);
    if (!hasBlocks) return;
    if (blocks[lang]) { showBlock(lang); return; }
    var my = ++seq;
    document.documentElement.removeAttribute('data-block-ready');
    each('[data-lang-block]', function (el) { el.hidden = true; });   // 받는 동안 영어판이 잠깐 비치지 않게
    ensureBlock(lang, function () { if (my !== seq) return; showBlock(lang); fill(lang); carryLang(lang); if (window.MH_PROMO) window.MH_PROMO.apply(); });   // 조각을 끼운 뒤 할인 표시(promo.js)도 다시
  });

  // ── 라이선스 활성화 UI (pricing.html #pg-license · 문구는 i18n lic_*) — js/license.js 가 서버(/api/license/*)와 통신 ──
  var LIC = window.MH_LICENSE, $lf = document.getElementById('pg-license-form');
  if (LIC && $lf) {
    var $key = document.getElementById('pg-license-key'), $lbtn = $lf.querySelector('button');
    var $lst = document.getElementById('pg-license-status'), $act = document.getElementById('pg-license-active');
    var $line = document.getElementById('pg-license-line'), $exp = document.getElementById('pg-license-exp'), $dev = document.getElementById('pg-license-dev');
    var $deact = document.getElementById('pg-license-deactivate');
    var $rsLink = document.getElementById('pg-license-resend-link'), $rsForm = document.getElementById('pg-license-resend-form'), $rsEmail = document.getElementById('pg-license-resend-email');
    var lastMsg = null;
    var ERR = { invalid: 'lic_err_invalid', expired: 'lic_err_expired', canceled: 'lic_err_canceled', refunded: 'lic_err_canceled', disputed: 'lic_err_canceled', revoked: 'lic_err_canceled', device_limit: 'lic_err_device_limit' };

    function planLabel(p) { return I.t(p === 'yearly' ? 'lic_plan_yearly' : 'lic_plan_lifetime'); }
    function fmtDate(iso) {
      if (!iso) return '';
      var d = new Date(iso); if (isNaN(d)) return String(iso).slice(0, 10);
      try { return d.toLocaleDateString(I.lang() === 'zh-Hant' ? 'zh-TW' : I.lang(), { year: 'numeric', month: 'long', day: 'numeric' }); } catch (e) { return d.toISOString().slice(0, 10); }
    }
    function msg(key, vars, isErr) {
      lastMsg = key ? { key: key, vars: vars, isErr: !!isErr } : null;
      if (!key) { $lst.hidden = true; return; }
      $lst.hidden = false; $lst.textContent = I.t(key, vars); $lst.classList.toggle('is-error', !!isErr);
    }
    function renderState() {
      var L = LIC.read(), on = LIC.active();
      $act.hidden = !on; $lf.hidden = on;
      if (!on) return;
      $line.textContent = I.t('lic_active_line', { plan: planLabel(L.plan) });
      $exp.textContent = L.exp ? I.t('lic_expires', { date: fmtDate(L.exp) }) : '';
      $dev.textContent = L.devices != null ? I.t('lic_devices', { n: L.devices, max: L.max || 3 }) : '';
    }
    $lf.addEventListener('submit', function (e) {
      e.preventDefault();
      var k = LIC.normalize($key.value);
      if (!k) { msg('lic_need_key', null, true); return; }
      $lbtn.disabled = true; msg('lic_checking');
      LIC.activate(k, function (err) {
        $lbtn.disabled = false;
        if (err) { msg(ERR[err] || 'lic_err_network', { max: 3 }, true); return; }
        $key.value = ''; msg('lic_done'); renderState();
      });
    });
    if ($deact) $deact.addEventListener('click', function (e) {
      e.preventDefault(); $deact.disabled = true;
      LIC.deactivate(function () { $deact.disabled = false; msg(null); renderState(); });
    });
    if ($rsLink && $rsForm) {
      $rsLink.addEventListener('click', function (e) { e.preventDefault(); $rsForm.hidden = !$rsForm.hidden; if (!$rsForm.hidden && $rsEmail) $rsEmail.focus(); });
      $rsForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var em = ($rsEmail.value || '').trim(); if (!em) return;
        var b = $rsForm.querySelector('button'); b.disabled = true;
        var lang = I.lang(); lang = lang === 'ja' || lang === 'ko' ? lang : 'en';
        LIC.resend(em, lang, function (err) { b.disabled = false; $rsForm.hidden = true; msg(err ? 'lic_err_network' : 'lic_resend_ok', null, !!err); });
      });
    }
    // 메일의 링크 pricing?license=KEY → 자동 활성화(주소창에서는 키를 지움)
    var qm = /[?&]license=([^&#]+)/.exec(location.search);
    if (qm) {
      var k0 = LIC.normalize(decodeURIComponent(qm[1]));
      try { var u = new URL(location.href); u.searchParams.delete('license'); history.replaceState(null, '', u.toString()); } catch (e) { /* 무시 */ }
      if (k0) {
        $key.value = k0;
        var cur = LIC.read();
        if (!(LIC.active() && cur && cur.key === k0)) setTimeout(function () { $lf.dispatchEvent(new Event('submit', { cancelable: true })); }, 0);
      }
      setTimeout(function () { var sec = document.getElementById('pg-license'); if (sec && sec.scrollIntoView) sec.scrollIntoView({ block: 'start' }); }, 50);
    }
    document.addEventListener('mh:lang', function () { renderState(); if (lastMsg) msg(lastMsg.key, lastMsg.vars, lastMsg.isErr); });
    document.addEventListener('mh:license', renderState);
    renderState();
  }

  I.apply();
}());
