/* SHEET (excel.broodev.com) — 앱 본체: 화면 · x-spreadsheet · 자동 저장/불러오기 · 탭 간 충돌 방지 · 가져오기/내보내기 · Google 동기화 연결.
   순수 로직은 i18n.js · store.js · sync.js · convert.js · pdf.js 에 있고, 여기서는 DOM 과 이어 붙이기만 한다. */
(function () {
  'use strict';
  var I = window.SheetI18n, S = window.SheetStore, Y = window.SheetSync, C = window.SheetConvert, P = window.SheetPdf;
  var CDN = {
    xs: 'https://cdn.jsdelivr.net/npm/x-data-spreadsheet@1.1.9/dist/xspreadsheet.js',
    xsCss: 'https://cdn.jsdelivr.net/npm/x-data-spreadsheet@1.1.9/dist/xspreadsheet.css',
    exceljs: 'https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js',
    pdflib: 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js',
    gis: 'https://accounts.google.com/gsi/client'
  };
  var MIME_XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  var LS = { lang: I.STORAGE_KEY, current: 'excel:current', sync: 'excel:sync', ping: 'excel:ping', hint: 'excel:hint-off' };
  var SAVE_DEBOUNCE = 600;
  var CLIENT_ID = (typeof GOOGLE_CLIENT_ID === 'string' ? GOOGLE_CLIENT_ID : '').trim();
  var TAB = Math.random().toString(36).slice(2, 10);

  var lang = I.detectLang();
  var t = function (k, v) { return I.t(lang, k, v); };
  var $ = function (s) { return document.querySelector(s); };
  var lsGet = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
  var lsSet = function (k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { /* 저장소 차단 */ } };
  var clone = function (v) { return JSON.parse(JSON.stringify(v)); };

  // ---------- 상태
  var store = null, xs = null, book = null, persisted = false;
  var lastJson = '', saveTimer = 0, saveChain = Promise.resolve(), localState = 'ready', lastSavedAt = 0;
  // confirmedJson: IndexedDB 에 저장이 확인된 내용 · inflight: 저장 요청은 했지만 아직 확인 안 된 내용 · saveErr: 마지막 저장 실패
  var confirmedJson = '', inflight = [], saveErr = null, saveSeq = 0;
  // 페이지를 떠나는 순간(pagehide·탭 숨김·beforeunload) 아직 IndexedDB 에 닿지 않은 내용은 localStorage 에 동기식으로 임시 보관 → 다음에 열 때 복구
  var PENDING = 'excel:pending:', pendingMine = {}, pendingSeq = {};
  var syncEngine = null, syncState = null, accessToken = null, tokenExp = 0, gisPromise = null;
  var fxCell = { ri: 0, ci: 0 }, lastCopyText = null, hintOff = lsGet(LS.hint) === '1';
  var readyResolve; var ready = new Promise(function (r) { readyResolve = r; });

  /* ================================================================ 공통 UI */
  function el(tag, cls, attrs) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (attrs) Object.keys(attrs).forEach(function (k) { if (k === 'text') e.textContent = attrs[k]; else e.setAttribute(k, attrs[k]); });
    return e;
  }
  /** action = {text, fn(toastEl)} 이면 토스트 안에 버튼(예: 백업 내려받기 · 취소) */
  function toast(msg, kind, ms, action) {
    var d = el('div', 'toast' + (kind ? ' ' + kind : ''), { role: kind === 'err' ? 'alert' : 'status' });
    var span = el('span', 'toast-msg', { text: msg });
    d.appendChild(span);
    if (action) {
      var b = el('button', 'toast-act', { type: 'button', text: action.text });
      b.addEventListener('click', function () { action.fn(d); });
      d.appendChild(b);
    }
    d.setText = function (m) { span.textContent = m; };
    $('#toasts').appendChild(d);
    if (ms !== 0) setTimeout(function () { d.remove(); }, ms || 4200);
    return d;
  }
  /** 확인/입력 창 — {title, message, value?, okText?, danger?, choices?:[{value,text}]} → Promise<false | true | string>
   *  포커스는 창 안에 가둔다(Tab/Shift+Tab 순환) · Esc 닫기 · 닫으면 원래 자리로 포커스 복귀 */
  function modal(o) {
    return new Promise(function (resolve) {
      var root = $('#modal'), prevFocus = document.activeElement;
      if (xs && xs.sheet) xs.sheet.focusing = false;
      root.textContent = '';
      var card = el('div', 'modal-card', { role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'modalTitle' });
      card.appendChild(el('h2', '', { id: 'modalTitle', text: o.title }));
      if (o.message) card.appendChild(el('p', '', { text: o.message }));
      var input = null;
      if (o.value !== undefined) {
        var lab = el('label', '', { for: 'modalInput', text: t('nameLabel') });
        input = el('input', '', { id: 'modalInput', type: 'text', maxlength: '120', autocomplete: 'off' });
        input.value = o.value;
        card.appendChild(lab); card.appendChild(input);
      }
      var actions = el('div', 'modal-actions' + (o.choices ? ' stack' : ''));
      var cancel = el('button', 'btn ghost', { type: 'button', text: t('cancel') });
      var ok = null;
      if (o.choices) {
        o.choices.forEach(function (c, i) {
          var b = el('button', 'btn' + (i ? ' ghost' : ''), { type: 'button', text: c.text });
          b.addEventListener('click', function () { done(c.value); });
          actions.appendChild(b);
          if (!ok) ok = b;
        });
        actions.appendChild(cancel);
      } else {
        ok = el('button', 'btn' + (o.danger ? ' warn' : ''), { type: 'button', text: o.okText || t('ok') });
        actions.appendChild(cancel); actions.appendChild(ok);
      }
      card.appendChild(actions);
      root.appendChild(card);
      root.hidden = false;
      var done = function (v) {
        root.hidden = true; root.textContent = '';
        document.removeEventListener('keydown', onKey, true);
        document.removeEventListener('focusin', onFocusIn, true);
        try { if (prevFocus && prevFocus.focus) prevFocus.focus(); } catch (e) { /* ignore */ }
        // 연 버튼이 사라졌으면(목록 다시 그림) 「통합문서」 버튼으로 — 포커스가 페이지 처음으로 튀지 않게
        setTimeout(function () { var a = document.activeElement; if (!a || a === document.body) { var fb = o.returnFocus || $('#booksBtn'); if (fb) fb.focus(); } }, 0);
        resolve(v);
      };
      var submit = function () { if (input) { var v = input.value.trim(); if (!v) { input.focus(); return; } done(v); } else done(true); };
      var onKey = function (e) {
        if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); done(false); }
        else if (e.key === 'Enter' && input && document.activeElement === input) { e.preventDefault(); e.stopPropagation(); submit(); }
        else if (e.key === 'Tab') {
          // 포커스 가두기: 창 밖(뒤의 페이지)으로 나가지 않게 순환
          var f = Array.prototype.filter.call(card.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])'), function (x) { return !x.disabled && x.offsetParent !== null; });
          if (!f.length) return;
          var i = f.indexOf(document.activeElement);
          var n = e.shiftKey ? (i <= 0 ? f.length - 1 : i - 1) : (i < 0 || i === f.length - 1 ? 0 : i + 1);
          e.preventDefault(); e.stopPropagation();
          f[n].focus();
        }
      };
      // 창 밖을 눌러 포커스가 빠져나가도 다시 창 안으로
      var onFocusIn = function (e) { if (!card.contains(e.target)) { (input || ok || cancel).focus(); } };
      document.addEventListener('keydown', onKey, true);
      document.addEventListener('focusin', onFocusIn, true);
      cancel.onclick = function () { done(false); };
      if (!o.choices) ok.onclick = submit;
      root.onclick = function (e) { if (e.target === root) done(false); };
      setTimeout(function () { if (input) { input.focus(); input.select(); } else ok.focus(); }, 0);
    });
  }
  var pops = [];
  function closePops(except) { pops.forEach(function (p) { if (p.pop !== except) { p.pop.hidden = true; p.btn.setAttribute('aria-expanded', 'false'); } }); }
  /** 메뉴가 화면 오른쪽/왼쪽 밖으로 나가면 버튼 오른쪽 끝에 맞추거나 화면 안으로 당긴다(휴대폰에서 가로 스크롤 방지) */
  function placePop(pop) {
    pop.style.left = ''; pop.style.right = '';
    var vw = document.documentElement.clientWidth || window.innerWidth, m = 8;
    var r = pop.getBoundingClientRect();
    if (r.right > vw - m) { pop.style.left = 'auto'; pop.style.right = '0'; r = pop.getBoundingClientRect(); }
    if (r.left < m) {
      var host = pop.offsetParent ? pop.offsetParent.getBoundingClientRect() : { left: 0 };
      pop.style.right = 'auto'; pop.style.left = Math.round(m - host.left) + 'px';
    }
  }
  function bindPop(btn, pop, onOpen) {
    pops.push({ btn: btn, pop: pop });
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = pop.hidden;
      closePops(pop);
      pop.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      if (open) placePop(pop);
      if (open && onOpen) onOpen();
    });
    pop.addEventListener('click', function (e) { e.stopPropagation(); });
  }
  function loadScript(url, globalName) {
    if (globalName && window[globalName]) return Promise.resolve(window[globalName]);
    loadScript.cache = loadScript.cache || {};
    if (!loadScript.cache[url]) {
      loadScript.cache[url] = new Promise(function (resolve, reject) {
        var s = document.createElement('script');
        s.src = url; s.async = true;
        s.onload = function () { resolve(globalName ? window[globalName] : true); };
        s.onerror = function () { delete loadScript.cache[url]; reject(new Error('load ' + url.split('/')[2])); };
        document.head.appendChild(s);
      });
    }
    return loadScript.cache[url];
  }
  function loadCss(url) {
    loadCss.cache = loadCss.cache || {};
    if (!loadCss.cache[url]) {
      loadCss.cache[url] = new Promise(function (resolve, reject) {
        var l = document.createElement('link');
        l.rel = 'stylesheet'; l.href = url;
        l.onload = function () { resolve(true); };
        l.onerror = function () { delete loadCss.cache[url]; reject(new Error('load ' + url.split('/')[2])); };
        document.head.appendChild(l);
      });
    }
    return loadCss.cache[url];
  }
  function hhmm(ts) { try { return new Intl.DateTimeFormat(I.intlLocale(lang), { hour: '2-digit', minute: '2-digit' }).format(new Date(ts)); } catch (e) { var d = new Date(ts); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); } }
  function shortWhen(ts) {
    var d = new Date(ts), now = new Date();
    if (d.toDateString() === now.toDateString()) return hhmm(ts);
    try { return new Intl.DateTimeFormat(I.intlLocale(lang), { dateStyle: 'medium' }).format(d); } catch (e) { return d.toISOString().slice(0, 10); }
  }
  function safeFile(s) { return String(s || 'SHEET').replace(/[\\/:*?"<>|\u0000-\u001f]+/g, '_').replace(/\s+/g, ' ').trim().slice(0, 100) || 'SHEET'; }
  function download(blob, name) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
  }

  /* ================================================================ 언어 · 정적 문구 · SEO */
  function setMeta(sel, val) { var m = document.querySelector(sel); if (m) m.setAttribute('content', val); }
  function applyStaticI18n() {
    document.documentElement.lang = I.htmlLang(lang);
    document.querySelectorAll('[data-i]').forEach(function (e) { e.textContent = t(e.getAttribute('data-i')); });
    document.querySelectorAll('[data-i-title]').forEach(function (e) { e.title = t(e.getAttribute('data-i-title')); });
    document.querySelectorAll('[data-i-aria]').forEach(function (e) { e.setAttribute('aria-label', t(e.getAttribute('data-i-aria'))); });
    document.querySelectorAll('[data-i-ph]').forEach(function (e) { e.placeholder = t(e.getAttribute('data-i-ph')); });
    document.title = t('title');
    setMeta('meta[name="description"]', t('desc'));
    setMeta('meta[property="og:title"]', t('ogTitle'));
    setMeta('meta[property="og:description"]', t('ogDesc'));
    setMeta('meta[property="og:image:alt"]', t('ogTitle'));
    setMeta('meta[property="og:locale"]', I.OG_LOCALE[lang] || 'en_US');
    setMeta('meta[name="twitter:title"]', t('ogTitle'));
    setMeta('meta[name="twitter:description"]', t('ogDesc'));
    var q = '?lang=' + encodeURIComponent(lang);
    var set = function (id, href) { var a = document.getElementById(id); if (a) a.href = href; };
    set('lnkTerms', 'https://broodev.com/legal/terms' + q);
    set('lnkPrivacy', 'https://broodev.com/legal/privacy' + q);
    set('lnkContact', 'https://voca.broodev.com/contact?app=excel&lang=' + encodeURIComponent(lang));
    renderSeo();
    var sel = $('#lang'); if (sel) sel.value = lang;
  }
  function renderSeo() {
    var s = I.seo(lang), box = $('#seoBody');
    if (!box) return;
    box.textContent = '';
    box.appendChild(el('h2', '', { id: 'seo-title', text: t('appName') + ' — SHEET' }));
    box.appendChild(el('p', 'lead', { text: s.intro }));
    box.appendChild(el('h2', '', { text: s.howTitle }));
    var ol = el('ol');
    s.steps.forEach(function (x) { ol.appendChild(el('li', '', { text: x })); });
    box.appendChild(ol);
    box.appendChild(el('h2', '', { text: s.faqTitle }));
    s.faq.forEach(function (qa) { box.appendChild(el('h3', '', { text: qa[0] })); box.appendChild(el('p', '', { text: qa[1] })); });
    var ld = document.getElementById('ld-json');
    if (ld) ld.textContent = JSON.stringify(I.ldJson(lang));
  }
  function buildLangSelect() {
    var sel = $('#lang');
    sel.textContent = '';
    I.LANGS.forEach(function (l) { var o = el('option', '', { value: l, lang: I.htmlLang(l), text: I.NATIVE[l] }); sel.appendChild(o); });
    sel.value = lang;
    sel.addEventListener('change', function () { setLang(sel.value); });
  }
  function setLang(l) {
    l = I.normLang(l) || 'en';
    if (l === lang) return;
    flushSave();
    lang = l;
    lsSet(LS.lang, l);
    try { var u = new URL(location.href); u.searchParams.set('lang', l); history.replaceState(null, '', u.toString()); } catch (e) { /* ignore */ }
    applyStaticI18n();
    if (xs) {
      var data = xs.getData(), idx = activeSheetIndex(), unsaved = saveErr || lastJson === '';
      createGrid();
      xs.loadData(clone(data));
      lastJson = unsaved ? '' : JSON.stringify(xs.getData());
      switchSheet(idx);
      syncFxFromSelector();
    }
    renderBookTitle(); renderStatus(); renderSyncUi(); updateHint();
    if (!$('#booksPanel').hidden) renderBooks();
  }

  /* ================================================================ x-spreadsheet */
  function createGrid() {
    var host = $('#grid');
    host.textContent = '';
    window.x_spreadsheet.locale(lang, I.xsLocale(lang));
    xs = window.x_spreadsheet(host, {
      mode: 'edit', showToolbar: true, showGrid: true, showContextmenu: true, showBottomBar: true,
      view: { height: function () { return host.clientHeight; }, width: function () { return host.clientWidth; } },
      row: { len: 200, height: 25 },
      col: { len: 26, width: 100, indexWidth: 60, minWidth: 60 }
    });
    patchXs();
    xs.change(function () { scheduleSave(); });
    xs.on('cell-selected', function (cell, ri, ci) { setFx(ri, ci); announceCell(); });
    xs.on('cells-selected', function (cell, r) { if (r) setFx(r.sri, r.sci); announceCell(); });
    a11yGrid();
    xs.on('cell-edited', function (text) { if (document.activeElement !== $('#fxInput')) $('#fxInput').value = text == null ? '' : String(text); });
  }
  function patchXs() {
    // (1) x-spreadsheet 내부 Element.html() 은 innerHTML 을 쓴다 → 셀 값·시트 이름이 HTML 로 해석되지 않게 textContent 로 바꾼다
    var EP = Object.getPrototypeOf(xs.sheet.el);
    if (EP && typeof EP.html === 'function' && !EP.__sheetSafe) {
      EP.html = function (c) { if (c !== undefined) { this.el.textContent = c == null ? '' : String(c); return this; } return this.el.textContent; };
      EP.__sheetSafe = true;
    }
    // (2) 엑셀·구글 시트 붙여넣기: \n 줄바꿈, 따옴표 안 줄바꿈/탭, 끝 줄 처리 + 범위가 모자라면 행/열 늘리기
    var DP = Object.getPrototypeOf(xs.sheet.data);
    if (DP && !DP.__sheetPaste) {
      DP.pasteFromText = function (txt) {
        var lines = C.parseTSV(txt), self = this;
        if (!lines.length) return;
        var r = self.selector.range, width = Math.max.apply(null, lines.map(function (x) { return x.length; }));
        if (self.rows.len < r.sri + lines.length + 1) self.rows.len = r.sri + lines.length + 20;
        if (self.cols.len < r.sci + width + 1) self.cols.len = r.sci + width + 2;
        self.changeData(function () { self.rows.paste(lines, r); });
      };
      DP.__sheetPaste = true;
    }
    // (3) 새 시트 이름 현지화 + 시트 추가/삭제도 자동 저장
    var origAdd = xs.addSheet.bind(xs), origDel = xs.deleteSheet.bind(xs);
    xs.addSheet = function (name, active) { var d = origAdd(name || uniqueSheetName(), active); scheduleSave(); return d; };
    xs.deleteSheet = function () { origDel(); scheduleSave(); };
  }
  // ---------- 키보드만으로 쓰기 (x-spreadsheet 는 마우스 클릭으로만 그리드에 들어가고, 툴바·시트 탭에 포커스가 가지 않는다)
  //  · 그리드(.x-spreadsheet-overlayer)를 Tab 으로 들어갈 수 있게 → 들어오면 화살표·Enter·F2·바로 입력이 그대로 동작
  //  · 키보드로 들어온 경우 Tab 은 그리드를 벗어난다(갇히지 않게). 마우스로 고른 셀에서는 엑셀처럼 오른쪽 칸으로
  //  · 툴바 버튼·드롭다운 항목·시트 탭·＋ 시트 추가를 Tab 으로 닿게(role=button + 툴팁을 이름으로, Enter/Space = 클릭)
  //  · 라이브러리에 남은 영어 문구(인쇄 미리보기 제목 · 데이터 유효성 범위 예시) 현지화
  var gridObs = null, gridKb = false, gridPointerAt = 0, decorRaf = 0;
  var KB_SEL = '.x-spreadsheet-toolbar-btn, .x-spreadsheet-dropdown-content .x-spreadsheet-item, .x-spreadsheet-color-palette-cell, ' +
    '.x-spreadsheet-bottombar .x-spreadsheet-menu > li, .x-spreadsheet-bottombar .x-spreadsheet-icon, .x-spreadsheet-bottombar .x-spreadsheet-dropdown-header';
  function gridOverlay() { return $('#grid') && $('#grid').querySelector('.x-spreadsheet-overlayer'); }
  /** 셀 선택 상태의 포커스 — 라이브러리는 셀을 옮길 때마다 그리드 안의 숨은 입력칸(IME 용)으로 포커스를 옮긴다 */
  function inGridNav(n) { var ov = gridOverlay(); return !!ov && !!n && (n === ov || (ov.contains(n) && n.tagName === 'INPUT')); }
  function setKb(on) { gridKb = on; var g = $('#grid'); if (g) g.classList.toggle('kb-nav', !!on); }
  function focusGrid() {
    var ov = gridOverlay();
    if (!ov) return;
    setKb(true);
    try { ov.focus({ preventScroll: true }); } catch (e) { ov.focus(); }
    if (xs && xs.sheet) xs.sheet.focusing = true;
  }
  function decorateGrid() {
    decorRaf = 0;
    var host = $('#grid');
    if (!host || !xs) return;
    var ov = host.querySelector('.x-spreadsheet-overlayer');
    if (ov && !ov.__kb) {
      ov.__kb = true;
      ov.tabIndex = 0;
      ov.setAttribute('role', 'application');
      ov.addEventListener('pointerdown', function () { gridPointerAt = Date.now(); setKb(false); }, true);
      ov.addEventListener('focus', function () {
        if (Date.now() - gridPointerAt > 400) setKb(true);        // Tab 으로 들어옴
        if (xs && xs.sheet) xs.sheet.focusing = true;
        announceCell();
      });
    }
    if (ov) ov.setAttribute('aria-label', t('gridLabel'));
    // 툴바 · 드롭다운 · 시트 탭
    var bottomLis = host.querySelectorAll('.x-spreadsheet-bottombar .x-spreadsheet-menu > li');
    Array.prototype.forEach.call(host.querySelectorAll(KB_SEL), function (n) {
      var isFirstLi = n === bottomLis[0];
      if (isFirstLi) return;                                      // ＋/… 를 담는 칸 자체는 건너뛴다(안의 아이콘이 버튼)
      if (n.classList.contains('x-spreadsheet-icon') && !n.closest('.x-spreadsheet-menu > li:first-child')) return;
      if (n.classList.contains('x-spreadsheet-dropdown-header') && !n.closest('.x-spreadsheet-bottombar')) return;
      if (n.classList.contains('x-spreadsheet-icon') && n.closest('.x-spreadsheet-dropdown-header')) return;   // … 아이콘은 머리글이 버튼
      if (!n.__kb) { n.__kb = true; n.tabIndex = 0; n.setAttribute('role', 'button'); }
      var label = '';
      if (n.classList.contains('x-spreadsheet-toolbar-btn')) label = n.getAttribute('data-tooltip') || '';
      else if (n.classList.contains('x-spreadsheet-color-palette-cell')) label = rgbHex(n.style.backgroundColor);
      else if (n.classList.contains('x-spreadsheet-icon')) label = t('addSheet');
      else if (n.classList.contains('x-spreadsheet-dropdown-header')) label = t('moreSheets');
      else if (n.tagName === 'LI') { n.title = t('sheetTabTip'); n.setAttribute('aria-pressed', n.classList.contains('active') ? 'true' : 'false'); }
      if (label && n.getAttribute('aria-label') !== label) n.setAttribute('aria-label', label);
      if (n.classList.contains('x-spreadsheet-toolbar-btn')) {
        var dd = n.querySelector('.x-spreadsheet-dropdown-content');
        if (dd) n.setAttribute('aria-expanded', dd.style.display === 'block' ? 'true' : 'false');
      }
    });
    // 툴바는 Tab 한 번(로빙 tabindex) — 안에서는 ←/→/Home/End 로 이동
    var bar = host.querySelector('.x-spreadsheet-toolbar-btns');
    if (bar) {
      bar.setAttribute('role', 'toolbar');
      bar.setAttribute('aria-label', (I.xsLocale(lang).toolbar || {}).format || 'Format');
      var items = toolbarItems(bar);
      if (items.indexOf(bar.__rov) < 0) bar.__rov = items[0];
      Array.prototype.forEach.call(bar.children, function (n) { if (n.classList.contains('x-spreadsheet-toolbar-btn')) { var v = n === bar.__rov ? 0 : -1; if (n.tabIndex !== v) n.tabIndex = v; } });
    }
    Array.prototype.forEach.call(host.querySelectorAll('.x-spreadsheet-toolbar-more .x-spreadsheet-toolbar-btn'), function (n) { if (n.tabIndex !== 0) n.tabIndex = 0; });
    // 스크롤 막대는 마우스용 — Tab 순서에서 뺀다(그리드 안에서 화살표로 스크롤된다)
    Array.prototype.forEach.call(host.querySelectorAll('.x-spreadsheet-scrollbar, .x-spreadsheet-selector .hide-input input'), function (sb) { if (sb.tabIndex !== -1) sb.tabIndex = -1; });
    // 남은 영어 문구
    var pt = document.querySelector('.x-spreadsheet-print-bar .-title');
    if (pt && pt.textContent !== t('xsPrintTitle')) pt.textContent = t('xsPrintTitle');
    Array.prototype.forEach.call(document.querySelectorAll('.x-spreadsheet-modal input'), function (inp) {
      if (inp.placeholder === 'E3 or E3:F12' || inp.__rangePh) { inp.__rangePh = true; if (inp.placeholder !== t('xsRangePh')) inp.placeholder = t('xsRangePh'); }
    });
  }
  function rgbHex(c) { var m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(c || ''); return m ? '#' + [m[1], m[2], m[3]].map(function (x) { return ('0' + (+x).toString(16)).slice(-2); }).join('') : (c || ''); }
  function toolbarItems(bar) {
    return Array.prototype.filter.call(bar.children, function (c) { return c.classList.contains('x-spreadsheet-toolbar-btn') && c.offsetParent !== null; });
  }
  function a11yGrid() {
    decorateGrid();
    if (gridObs) gridObs.disconnect();
    try {
      gridObs = new MutationObserver(function () { if (!decorRaf) decorRaf = requestAnimationFrame(decorateGrid); });
      gridObs.observe($('#grid'), { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
      var pr = document.querySelector('.x-spreadsheet-print');
      if (pr && !$('#grid').contains(pr)) gridObs.observe(pr, { childList: true, subtree: true });
    } catch (e) { /* 오래된 브라우저 */ }
  }
  var liveTimer = 0;
  /** 화면 읽기 프로그램용: 키보드로 셀을 옮기면 「B5 값」을 읽어 준다 */
  function announceCell() {
    if (!gridKb || !xs) return;
    var ov = gridOverlay();
    if (!ov || !inGridNav(document.activeElement)) return;
    clearTimeout(liveTimer);
    liveTimer = setTimeout(function () {
      var live = $('#cellLive');
      if (!live || !xs) return;
      var s = xs.sheet.data.selector, r = s.range, c = xs.sheet.data.getCell(s.ri, s.ci);
      var refTxt = r && (r.eri > r.sri || r.eci > r.sci) ? C.rangeRef(r) : C.cellRef(s.ri, s.ci);
      live.textContent = refTxt + (c && c.text != null && c.text !== '' ? ' ' + String(c.text) : '');
    }, 120);
  }
  /** 이름 상자 → 셀/범위 선택 후 그리드로 포커스 */
  function goToRef(v) {
    var rg = C.parseRange(String(v || '').replace(/\s+/g, ''));
    if (!rg || !xs) { toast(t('refBad'), 'warn'); try { $('#fxRef').select(); } catch (e) { /* ignore */ } return false; }
    var sh = xs.sheet, d = sh.data;
    if (rg.eri >= d.rows.len) d.rows.len = Math.min(rg.eri + 20, 100000);
    if (rg.eci >= d.cols.len) d.cols.len = Math.min(rg.eci + 2, 16384);
    sh.selector.set(rg.sri, rg.sci, true);
    if (rg.eri !== rg.sri || rg.eci !== rg.sci) sh.selector.setEnd(rg.eri, rg.eci, false);
    // 보이는 곳으로 스크롤
    try {
      var rect = d.getSelectedRect(), off = sh.getTableOffset();
      if (rect.top < 0 || rect.top + rect.height > off.height) sh.verticalScrollbar.move({ top: Math.max(0, d.rows.sumHeight(0, rg.sri)) });
      if (rect.left < 0 || rect.left + rect.width > off.width) sh.horizontalScrollbar.move({ left: Math.max(0, d.cols.sumWidth(0, rg.sci)) });
    } catch (e) { /* ignore */ }
    try { sh.toolbar.reset(); } catch (e) { /* ignore */ }
    sh.table.render();
    setFx(rg.sri, rg.sci);
    focusGrid();
    return true;
  }
  /** 툴바·시트 탭 키보드 동작 · 그리드에서 Tab 으로 나가기 · 편집을 마치면 그리드로 포커스 복귀 (한 번만 등록) */
  function bindGridKeys() {
    // 스크롤 막대는 브라우저가 tabindex=-1 이어도 Tab 으로 멈추는 경우가 있다(키보드 스크롤러) → 다음/이전 컨트롤로 넘긴다
    var lastTab = { at: 0, back: false };
    /** ref 의 앞/뒤에서 Tab 으로 갈 컨트롤(ref 의 자식은 건너뜀) */
    var adjacentTabbable = function (ref, back) {
      var all = Array.prototype.filter.call(document.querySelectorAll('a[href], button, input, select, textarea, [tabindex]'), function (x) {
        return x.tabIndex >= 0 && !x.disabled && x.offsetParent !== null && !x.classList.contains('x-spreadsheet-scrollbar') && !ref.contains(x);
      });
      if (back) { for (var i = all.length - 1; i >= 0; i--) if (all[i].compareDocumentPosition(ref) & Node.DOCUMENT_POSITION_FOLLOWING) return all[i]; return null; }
      for (var j = 0; j < all.length; j++) if (ref.compareDocumentPosition(all[j]) & Node.DOCUMENT_POSITION_FOLLOWING) return all[j];
      return null;
    };
    document.addEventListener('focusin', function (e) {
      var n = e.target;
      if (!n || !n.classList || !n.classList.contains('x-spreadsheet-scrollbar') || Date.now() - lastTab.at > 300) return;
      var next = adjacentTabbable(n, lastTab.back);
      if (next) next.focus();
    }, true);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') { lastTab.at = Date.now(); lastTab.back = e.shiftKey; }
      if (!xs) return;
      var tg = e.target, ov = gridOverlay();
      // 키보드로 들어온 그리드: Tab = 그리드 밖으로(라이브러리가 Tab 을 「오른쪽 칸」으로 가로채지 않게)
      if (e.key === 'Tab' && inGridNav(tg) && gridKb && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.stopPropagation();
        if (xs.sheet) xs.sheet.focusing = false;
        var to = adjacentTabbable(ov, e.shiftKey);      // 숨은 입력칸에서도 그리드 「밖」의 앞/뒤 컨트롤로
        if (to) { e.preventDefault(); to.focus(); }
        return;
      }
      // 셀 편집 중 Enter/Tab/Esc → 편집이 끝나면 포커스를 그리드로(키보드 사용자가 길을 잃지 않게)
      if ((e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') && tg && tg.tagName === 'TEXTAREA' && ov && ov.contains(tg)) {
        var wasKb = gridKb;
        setTimeout(function () {
          var a = document.activeElement;
          if (!a || a === document.body || (a.tagName === 'TEXTAREA' && a.offsetParent === null)) { focusGrid(); setKb(wasKb); }
        }, 0);
        return;
      }
      if (!tg || !tg.__kb) return;
      var isTab = tg.tagName === 'LI' && tg.closest('.x-spreadsheet-bottombar');
      var bar = tg.parentNode && tg.parentNode.classList && tg.parentNode.classList.contains('x-spreadsheet-toolbar-btns') ? tg.parentNode : null;
      if (bar && /^(ArrowLeft|ArrowRight|Home|End)$/.test(e.key)) {
        var items = toolbarItems(bar), i = items.indexOf(tg);
        var n = e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : e.key === 'ArrowLeft' ? (i <= 0 ? items.length - 1 : i - 1) : (i >= items.length - 1 ? 0 : i + 1);
        e.preventDefault(); e.stopPropagation();
        if (items[n]) { bar.__rov = items[n]; items.forEach(function (x) { x.tabIndex = x === items[n] ? 0 : -1; }); items[n].focus(); }
        return;
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); e.stopPropagation();
        setKb(true);                                  // 툴바 동작 뒤 라이브러리가 포커스를 셀로 돌려도 Tab 으로 나갈 수 있게
        var head = tg.classList.contains('x-spreadsheet-toolbar-btn') && tg.querySelector(':scope > .x-spreadsheet-dropdown > .x-spreadsheet-dropdown-header');
        (head || tg).click();
        if (head) setTimeout(function () { var first = tg.querySelector('.x-spreadsheet-dropdown-content [tabindex="0"]'); var dd = tg.querySelector('.x-spreadsheet-dropdown-content'); if (first && dd && dd.style.display === 'block') first.focus(); decorateGrid(); }, 30);
        else if (tg.closest('.x-spreadsheet-dropdown-content')) { var btn = tg.closest('.x-spreadsheet-toolbar-btn'); if (btn) setTimeout(function () { btn.focus(); }, 0); }
      } else if (/^Arrow(Left|Right|Up|Down)$/.test(e.key) && tg.closest('.x-spreadsheet-dropdown-content')) {
        var box = tg.closest('.x-spreadsheet-dropdown-content');
        var list = Array.prototype.filter.call(box.querySelectorAll('[tabindex="0"]'), function (x) { return x.offsetParent !== null; });
        var k = list.indexOf(tg), row = tg.closest('tr'), step = row ? row.querySelectorAll('[tabindex="0"]').length || 1 : 1;
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowDown' ? step : -step;
        var nx = list[Math.max(0, Math.min(list.length - 1, k + d))];
        e.preventDefault(); e.stopPropagation();
        if (nx) nx.focus();
      } else if (e.key === 'Escape' && tg.closest('.x-spreadsheet-dropdown-content')) {
        var owner = tg.closest('.x-spreadsheet-toolbar-btn');
        var h = owner && owner.querySelector('.x-spreadsheet-dropdown-header');
        e.stopPropagation();
        if (h) h.click();
        if (owner) owner.focus();
      } else if (isTab && e.key === 'F2') {
        e.preventDefault(); e.stopPropagation();
        tg.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
        setTimeout(function () { var inp = tg.querySelector('input'); if (inp) { inp.focus(); inp.select(); inp.addEventListener('keydown', function (ev) { ev.stopPropagation(); if (ev.key === 'Enter' || ev.key === 'Escape') inp.blur(); }); } }, 0);
      } else if (isTab && (e.key === 'ContextMenu' || (e.key === 'F10' && e.shiftKey))) {
        e.preventDefault(); e.stopPropagation();
        tg.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
        setTimeout(function () { var m = $('#grid').querySelector('.x-spreadsheet-bottombar .x-spreadsheet-contextmenu .x-spreadsheet-item'); if (m) { m.tabIndex = 0; m.__kb = true; m.setAttribute('role', 'button'); m.focus(); } }, 0);
      }
    }, true);
  }

  function uniqueSheetName() {
    var base = t('sheetWord'), names = {}, n = (xs && xs.datas ? xs.datas.length : 0) + 1;
    (xs && xs.datas ? xs.datas : []).forEach(function (d) { names[String(d.name).toLowerCase()] = 1; });
    while (names[(base + n).toLowerCase()]) n++;
    return base + n;
  }
  function activeSheetIndex() { if (!xs) return 0; var i = xs.datas.indexOf(xs.sheet.data); return i < 0 ? 0 : i; }
  function switchSheet(i) {
    var bb = xs && xs.bottombar;
    if (!bb || !bb.items[i] || i === activeSheetIndex()) return;
    bb.clickSwap2(bb.items[i]);
  }
  function currentData() { return clone(xs.getData()); }
  function loadBookIntoGrid(b, keepSheet) {
    var sheets = b.sheets && b.sheets.length ? b.sheets : [C.blankSheet(t('sheetWord') + '1')];
    xs.loadData(clone(sheets));
    lastJson = JSON.stringify(xs.getData());
    confirmedJson = lastJson;          // 새 초안도 「손대지 않음」이면 임시 사본을 남기지 않는다
    saveErr = null;
    if (keepSheet) switchSheet(keepSheet);
    syncFxFromSelector();
    lastSavedAt = persisted ? (b.updatedAt || 0) : 0;
    localState = 'ready';
    renderBookTitle(); updateHint(); renderStatus();
  }

  // ---------- 수식 입력줄 (모바일에서도 셀을 편집할 수 있는 통로)
  function syncFxFromSelector() { var s = xs.sheet.data.selector || {}; setFx(s.ri || 0, s.ci || 0); }
  function setFx(ri, ci) {
    if (ri < 0 || ci < 0) return;
    fxCell = { ri: ri, ci: ci };
    $('#fxRef').value = C.cellRef(ri, ci);
    if (document.activeElement !== $('#fxInput')) { var c = xs.sheet.data.getCell(ri, ci); $('#fxInput').value = c && c.text != null ? String(c.text) : ''; }
  }
  function commitFx() {
    var d = xs.sheet.data, v = $('#fxInput').value, c = d.getCell(fxCell.ri, fxCell.ci);
    var old = c && c.text != null ? String(c.text) : '';
    if (v === old) return;
    d.changeData(function () { d.rows.setCellText(fxCell.ri, fxCell.ci, v); });
    try { d.validations.validate(fxCell.ri, fxCell.ci, v); } catch (e) { /* ignore */ }
    xs.reRender();
  }

  // ---------- 복사(시스템 클립보드로도) · 붙여넣기(외부 텍스트 우선)
  var normClip = function (s) { return String(s || '').replace(/\r\n?/g, '\n').replace(/\n$/, ''); };
  function isEditingCell() { var a = document.activeElement; return !!(a && a.tagName === 'TEXTAREA' && $('#grid').contains(a)); }
  function selectionTSV() {
    var d = xs.sheet.data, r = d.selector.range, sheets = currentData(), si = activeSheetIndex(), calc = C.createCalc(sheets), lines = [];
    for (var ri = r.sri; ri <= r.eri; ri++) {
      var row = [];
      for (var ci = r.sci; ci <= r.eci; ci++) {
        var v = calc.display(si, ri, ci);
        row.push(/[\t\n"]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v);
      }
      lines.push(row.join('\t'));
    }
    return lines.join('\r\n');
  }

  /* ================================================================ 저장 */
  function isDirty() { return !!saveTimer || (!!xs && JSON.stringify(xs.getData()) !== lastJson); }
  function scheduleSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(function () { saveTimer = 0; flushSave(); }, SAVE_DEBOUNCE);
  }
  /** opts.persist: 내용이 그대로여도 아직 저장 안 된 새 통합문서면 저장 · opts.force: 무조건 저장 */
  function flushSave(opts) {
    opts = opts || {};
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = 0; }
    if (!xs || !book || !store) return saveChain;
    var json = JSON.stringify(xs.getData());
    var changed = json !== lastJson;
    if (!changed && !opts.force && !(opts.persist && !persisted)) return saveChain;
    lastJson = json;
    var target = book, seq = ++saveSeq;
    inflight.push(json);
    localState = 'saving'; renderStatus();
    var unflight = function () { var k = inflight.indexOf(json); if (k >= 0) inflight.splice(k, 1); };
    saveChain = saveChain.then(function () {
      return store.saveBook({ id: target.id, name: target.name, sheets: JSON.parse(json), createdAt: target.createdAt, updatedAt: target.updatedAt, conflictOf: target.conflictOf });
    }).then(function (rec) {
      unflight();
      if (book && book.id === rec.id) { book = rec; persisted = true; confirmedJson = json; }
      clearPending(rec.id, json, seq);
      saveErr = null;
      lastSavedAt = Date.now(); localState = 'saved';
      lsSet(LS.current, rec.id);
      ping([rec.id]);
      renderStatus(); updateHint();
      if (!$('#booksPanel').hidden) renderBooks();
      if (syncOn() && syncEngine) syncEngine.schedule();
    }).catch(function (err) {
      unflight();
      // 저장 실패: 「저장 안 됨」으로 되돌려 다음 편집·Ctrl+S·주기 재시도·pagehide 가 다시 저장하게 한다
      if (book && book.id === target.id && lastJson === json) lastJson = '';
      var first = !saveErr;
      saveErr = { quota: isQuota(err) };
      localState = 'error'; renderStatus();
      writePending();                                   // IndexedDB 가 막혀도 localStorage 에 임시 사본
      if (first) toast(t(saveErr.quota ? 'tQuota' : 'tSaveFail'), 'err', 15000, { text: t('backupXlsx'), fn: function (d) { d.remove(); doExport('xlsx'); } });
      if (window.console) console.warn('[sheet] save failed', err);
    });
    return saveChain;
  }
  function isQuota(err) { return !!err && (err.name === 'QuotaExceededError' || err.code === 22 || /quota/i.test(String(err.message || err.name || ''))); }
  /** 다른 통합문서로 넘어가기 전: 지금 화면이 저장되지 않았으면(저장 실패) 넘어가지 않는다 */
  var STOP = { stop: true };
  function savedOrStop() {
    return flushSave().then(function () {
      if (saveErr) { toast(t(saveErr.quota ? 'tQuota' : 'tSaveFail'), 'err', 8000, { text: t('backupXlsx'), fn: function (d) { d.remove(); doExport('xlsx'); } }); throw STOP; }
    });
  }
  function ignoreStop(e) { if (e !== STOP) throw e; }

  // ---------- 떠나는 순간의 임시 사본 (localStorage, 동기식)
  function hash(str) { var h = 0x811c9dc5; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36) + ':' + str.length; }
  /** @returns {boolean} 저장할 것이 없거나 임시 사본을 남겼으면 true */
  function writePending() {
    if (!xs || !book) return true;
    var json;
    try { json = JSON.stringify(xs.getData()); } catch (e) { return false; }
    if (json === confirmedJson && !saveErr) return true;          // IndexedDB 에 이미 있음
    try {
      localStorage.setItem(PENDING + book.id, JSON.stringify({
        v: 1, id: book.id, name: book.name, createdAt: book.createdAt || 0, conflictOf: book.conflictOf || null,
        base: book.updatedAt || 0, mine: inflight.concat([confirmedJson]).filter(Boolean).map(hash), at: Date.now(), sheets: json
      }));
      localStorage.setItem(LS.current, book.id);
      pendingMine[book.id] = json; pendingSeq[book.id] = saveSeq;
      return true;
    } catch (e) { return false; }
  }
  /** 저장이 확인되면 임시 사본 정리 — 그 내용이거나 임시 사본보다 나중에 요청한 저장이면 */
  function clearPending(id, json, seq) {
    if (!(id in pendingMine)) return;
    if (pendingMine[id] === json || seq > pendingSeq[id]) { lsSet(PENDING + id, null); delete pendingMine[id]; delete pendingSeq[id]; }
  }
  /** 시작할 때: 지난번에 IndexedDB 에 닿지 못한 내용 복구. 그사이 다른 탭·기기가 고쳤으면 사본으로(유실 0) */
  function recoverPending() {
    var keys = [];
    try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && k.indexOf(PENDING) === 0) keys.push(k); } } catch (e) { return Promise.resolve(0); }
    var restored = [];
    return keys.reduce(function (p, k) {
      return p.then(function () {
        var pd = null; try { pd = JSON.parse(localStorage.getItem(k)); } catch (e) { /* 손상 */ }
        if (!pd || !pd.id || typeof pd.sheets !== 'string') { lsSet(k, null); return; }
        return store.getRecord(pd.id).then(function (rec) {
          var recJson = rec && !rec.deleted ? JSON.stringify(rec.sheets || []) : null;
          if (recJson === pd.sheets) return;                                   // 결국 저장됐음
          var sheets = JSON.parse(pd.sheets);
          var ours = !rec || (rec.updatedAt || 0) <= (pd.base || 0) || (recJson != null && (pd.mine || []).indexOf(hash(recJson)) >= 0);
          restored.push(pd.id);
          if (ours) return store.saveBook({ id: pd.id, name: pd.name || (rec && rec.name) || '', sheets: sheets, createdAt: pd.createdAt || undefined, updatedAt: 0, conflictOf: pd.conflictOf || undefined });
          return store.createBook({ name: ((pd.name || '') + ' ' + t('conflictSuffix')).trim(), sheets: sheets, conflictOf: pd.id }).then(function (c) { restored.push(c.id); });
        }).then(function () { lsSet(k, null); });
      }).catch(function (e) { if (window.console) console.warn('[sheet] restore failed', e); });   // 키는 남겨 다음에 다시
    }, Promise.resolve()).then(function () {
      if (restored.length) { ping(restored); toast(t('tRestored')); }
      return restored.length;
    });
  }
  function ping(ids) { lsSet(LS.ping, JSON.stringify({ tab: TAB, ids: ids || [], t: Date.now() })); }
  function updateHint() {
    var h = $('#hint'); if (!h || !xs) return;
    h.hidden = hintOff || !C.isBookEmpty(xs.getData());
  }

  /* ================================================================ 통합문서 */
  function draftBook(n) {
    return { id: store.newId(), name: t('untitled', { n: n || 1 }), sheets: [C.blankSheet(t('sheetWord') + '1')], createdAt: Date.now(), updatedAt: 0 };
  }
  function pickInitialBook() {
    var id = lsGet(LS.current);
    return (id ? store.getBook(id) : Promise.resolve(null)).then(function (b) {
      if (b) return b;
      return store.listBooks().then(function (list) { return list[0] || null; });
    }).then(function (b) {
      if (b) { persisted = true; return b; }
      persisted = false;
      return draftBook(1);
    });
  }
  function renderBookTitle() {
    if (!book) return;
    $('#bookName').textContent = book.name;
    $('#booksBtn').setAttribute('aria-label', t('books') + ': ' + book.name);
    $('#booksBtn').title = t('books');
  }
  function renderBooks() {
    if (!store) return Promise.resolve();
    return store.listBooks().then(function (list) {
      var ul = $('#booksList');
      ul.textContent = '';
      $('#booksEmpty').hidden = list.length > 0;
      list.forEach(function (b) {
        var li = el('li', b.id === (book && book.id) ? 'current' : '');
        var open = el('button', 'bk-open', { type: 'button' });
        var nm = el('span', 'bk-name'); nm.textContent = b.name || '—';
        if (b.id === (book && book.id)) { var tag = el('span', 'bk-tag', { text: t('current') }); nm.appendChild(tag); }
        var meta = el('span', 'bk-meta', { text: t('edited', { t: shortWhen(b.updatedAt) }) + ' · ' + t('sheetsN', { n: (b.sheets || []).length }) });
        open.appendChild(nm); open.appendChild(meta);
        open.addEventListener('click', function () { closePops(); openBook(b.id); });
        var rn = el('button', 'bk-act', { type: 'button', 'aria-label': t('rename') + ': ' + b.name, title: t('rename') }); rn.textContent = '✎';
        rn.addEventListener('click', function () { renameBook(b.id, b.name); });
        var del = el('button', 'bk-act danger', { type: 'button', 'aria-label': t('del') + ': ' + b.name, title: t('del') }); del.textContent = '✕';
        del.addEventListener('click', function () { deleteBook(b.id, b.name); });
        li.appendChild(open); li.appendChild(rn); li.appendChild(del);
        ul.appendChild(li);
      });
    });
  }
  function openBook(id) {
    return savedOrStop().then(function () { return store.getBook(id); }).then(function (rec) {
      if (!rec) return;
      book = rec; persisted = true;
      lsSet(LS.current, rec.id);
      loadBookIntoGrid(book);
    }).catch(ignoreStop);
  }
  function newBook() {
    closePops();
    return savedOrStop().then(function () { return store.listBooks(); }).then(function (list) {
      return store.createBook({ name: t('untitled', { n: list.length + 1 }), sheets: [C.blankSheet(t('sheetWord') + '1')] });
    }).then(function (rec) {
      book = rec; persisted = true;
      lsSet(LS.current, rec.id); ping([rec.id]);
      loadBookIntoGrid(book);
      if (syncOn() && syncEngine) syncEngine.schedule();
      return rec;
    }).catch(ignoreStop);
  }
  function renameBook(id, name) {
    return modal({ title: t('renameTitle'), value: name || '' }).then(function (v) {
      if (!v || v === name) return;
      var isCur = book && book.id === id;
      var p;
      if (isCur) { book.name = v; p = flushSave({ force: true }); }
      else p = store.renameBook(id, v).then(function () { ping([id]); if (syncOn() && syncEngine) syncEngine.schedule(); });
      return p.then(function () { renderBookTitle(); renderBooks(); });
    });
  }
  function deleteBook(id, name) {
    return modal({ title: t('delTitle'), message: t('delConfirm', { name: name }), okText: t('del'), danger: true }).then(function (ok) {
      if (!ok) return;
      var isCur = book && book.id === id;
      if (isCur && saveTimer) { clearTimeout(saveTimer); saveTimer = 0; }
      return saveChain.then(function () { return store.deleteBook(id); }).then(function () {
        ping([id]);
        toast(t('tDeleted', { name: name }));
        if (syncOn() && syncEngine) syncEngine.schedule();
        return isCur ? openFallback() : null;
      }).then(function () { return renderBooks(); });
    });
  }
  function openFallback() {
    return store.listBooks().then(function (list) {
      if (list[0]) { book = list[0]; persisted = true; lsSet(LS.current, book.id); }
      else { book = draftBook(1); persisted = false; lsSet(LS.current, null); }
      loadBookIntoGrid(book);
    });
  }

  /* ================================================================ 가져오기 · 내보내기 · 인쇄 */
  function importFile(file) {
    if (!file) return Promise.resolve();
    var name = file.name || 'file', ext = (name.split('.').pop() || '').toLowerCase(), base = name.replace(/\.[^.]+$/, '') || name;
    var work;
    if (ext === 'xlsx' || ext === 'xlsm') {
      work = loadScript(CDN.exceljs, 'ExcelJS').then(function () { return file.arrayBuffer(); }).then(function (buf) { return C.importXlsx(buf, window.ExcelJS); });
    } else if (ext === 'csv' || ext === 'tsv' || ext === 'txt') {
      work = file.arrayBuffer().then(function (buf) {
        var text = C.decodeText(buf, lang);
        return [C.sheetFromMatrix(C.parseCSV(text, ext === 'tsv' ? '\t' : undefined), base.slice(0, 31))];
      });
    } else {
      toast(t('tUnsupported'), 'warn');
      return Promise.resolve();
    }
    var busy = toast(t('tWorking'), '', 0);
    return work.then(function (sheets) {
      return savedOrStop().then(function () { return store.createBook({ name: base, sheets: sheets }); });
    }).then(function (rec) {
      book = rec; persisted = true;
      lsSet(LS.current, rec.id); ping([rec.id]);
      loadBookIntoGrid(book);
      if (syncOn() && syncEngine) syncEngine.schedule();
      busy.remove();
      toast(t('tImported', { name: base }));
      return rec;
    }).catch(function (err) {
      busy.remove();
      if (err === STOP) return;
      toast(t('tImportFail', { msg: (err && err.message) || String(err) }), 'err');
    });
  }
  function bookForExport() { return { name: book.name, sheets: currentData(), createdAt: book.createdAt, updatedAt: book.updatedAt || Date.now() }; }
  function makeXlsxBlob() {
    return loadScript(CDN.exceljs, 'ExcelJS').then(function (ExcelJS) { return C.exportXlsx(bookForExport(), ExcelJS || window.ExcelJS); })
      .then(function (buf) { return new Blob([buf], { type: MIME_XLSX }); });
  }
  function makeCsvBlob() {
    var sheets = currentData();
    return Promise.resolve(new Blob(['﻿' + C.sheetToCSV(sheets, activeSheetIndex())], { type: 'text/csv;charset=utf-8' }));
  }
  /** opts: {range, dpr, format:'png'|'jpeg', quality, onProgress, signal} */
  function makePdfBlob(opts) {
    opts = opts || {};
    return loadScript(CDN.pdflib, 'PDFLib').then(function (PDFLib) {
      return P.exportPdf({
        sheets: currentData(), sheetIndex: activeSheetIndex(), title: book.name, PDFLib: PDFLib || window.PDFLib, lang: lang,
        planOpts: opts.range ? { range: opts.range } : undefined, dpr: opts.dpr, format: opts.format, quality: opts.quality,
        onProgress: opts.onProgress, signal: opts.signal
      });
    }).then(function (bytes) { return new Blob([bytes], { type: 'application/pdf' }); });
  }
  var PDF_BIG = 30;   // 이 쪽수를 넘으면 미리 묻는다(원본 화질은 쪽마다 수 MB 메모리)
  /** @returns {Promise<Object|null>} PDF 옵션 — null 이면 취소 */
  function choosePdfMode() {
    var sheets = currentData(), si = activeSheetIndex(), n = P.countPages(sheets[si]);
    if (n <= PDF_BIG) return Promise.resolve({});
    var r = xs.sheet.data.selector && xs.sheet.data.selector.range, sel = null, choices = [];
    if (r && (r.eri > r.sri || r.eci > r.sci)) {
      sel = { sri: r.sri, sci: r.sci, eri: r.eri, eci: r.eci };
      choices.push({ value: 'sel', text: t('pdfSel', { n: P.countPages(sheets[si], { range: sel }) }) });
    }
    choices.push({ value: 'fast', text: t('pdfFast') }, { value: 'full', text: t('pdfFull') });
    return modal({ title: t('pdfBigTitle'), message: t('pdfBigMsg', { n: n }), choices: choices }).then(function (v) {
      if (!v) return null;
      if (v === 'sel') return { range: sel };
      if (v === 'fast') return { dpr: 1.25 };      // 작은 파일
      return { dpr: 2 };
    });
  }
  function exportPdfFlow(file) {
    return flushSave().then(choosePdfMode).then(function (mode) {
      if (!mode) return null;
      var sig = { aborted: false };
      var busy = toast(t('tWorking'), '', 0, { text: t('cancel'), fn: function (d) { sig.aborted = true; d.setText(t('pdfCancelled')); } });
      mode.signal = sig;
      mode.onProgress = function (i, n) { if (!sig.aborted && n > 1) busy.setText(t('pdfProgress', { i: Math.min(i + 1, n), n: n })); };
      return makePdfBlob(mode).then(function (blob) {
        busy.remove();
        download(blob, file);
        toast(t('tExported', { file: file }));
        return blob;
      }, function (err) {
        busy.remove();
        if (err && err.code === 'cancelled') { toast(t('pdfCancelled')); return null; }
        toast(t('tExportFail', { msg: (err && err.message) || String(err) }), 'err');
        return null;
      });
    });
  }
  function doExport(kind) {
    closePops();
    var sheetName = (xs.sheet.data && xs.sheet.data.name) || '';
    var file = kind === 'xlsx' ? safeFile(book.name) + '.xlsx' : safeFile(book.name + ' - ' + sheetName) + '.' + kind;
    if (kind === 'pdf') return exportPdfFlow(file);
    var make = kind === 'xlsx' ? makeXlsxBlob : makeCsvBlob;
    var busy = toast(t('tWorking'), '', 0);
    return flushSave().then(function () { return make(); }).then(function (blob) {
      busy.remove();
      download(blob, file);
      toast(t('tExported', { file: file }));
      return blob;
    }).catch(function (err) {
      busy.remove();
      toast(t('tExportFail', { msg: (err && err.message) || String(err) }), 'err');
    });
  }
  function preparePrint() {
    var area = $('#print-area');
    area.textContent = '';
    area.appendChild(P.buildPrintTable(document, currentData(), activeSheetIndex()));
  }

  /* ================================================================ 다른 탭과의 충돌 방지 (storage 이벤트) */
  function onStorage(e) {
    if (e.key !== LS.ping || !e.newValue) return;
    var msg; try { msg = JSON.parse(e.newValue); } catch (er) { return; }
    if (!msg || msg.tab === TAB) return;
    if (!$('#booksPanel').hidden) renderBooks();
    if (!book || (msg.ids || []).indexOf(book.id) < 0) return;
    store.getRecord(book.id).then(function (rec) {
      if (!rec) return;
      var dirty = isDirty();
      if (rec.deleted) {
        toast(t('tTabDeleted'), 'warn');
        if (dirty) return flushSave({ force: true });      // 고치던 내용은 지우지 않고 되살려 저장
        return openFallback();
      }
      if ((rec.updatedAt || 0) <= (book.updatedAt || 0)) return;
      if (dirty) {
        // 다른 탭의 최신본은 사본으로 보존하고, 이 탭에서 고친 내용을 원본으로 저장 → 어느 쪽도 잃지 않는다
        return store.createBook({ name: (rec.name + ' ' + t('conflictSuffix')).trim(), sheets: rec.sheets, conflictOf: rec.id }).then(function (copy) {
          book.updatedAt = rec.updatedAt;
          ping([copy.id]);
          toast(t('tTabConflict'), 'warn');
          return flushSave({ force: true });
        });
      }
      var idx = activeSheetIndex();
      book = rec; persisted = true;
      loadBookIntoGrid(book, idx);
      toast(t('tTabUpdated'));
    });
  }

  /* ================================================================ 상태 표시 */
  function renderStatus() {
    var box = $('#status'), tx = $('#statusText');
    if (!box) return;
    var on = syncOn(), s = syncState && syncState.state, st, text;
    var online = navigator.onLine !== false;
    if (localState === 'saving') { st = 'saving'; text = t('st_saving'); }
    else if (localState === 'error') { st = 'error'; text = t('st_unsaved'); }
    else if (on && !online) { st = 'offline'; text = t('st_offline'); }
    else if (on && s === 'syncing') { st = 'syncing'; text = t('st_syncing'); }
    else if (on && s === 'offline') { st = 'offline'; text = t('st_offline'); }
    else if (on && (s === 'pending' || s === 'auth')) { st = 'pending'; text = t('st_pending'); }
    else if (on && s === 'synced' && syncState.at >= lastSavedAt) { st = 'synced'; text = t('st_syncedAt', { t: hhmm(syncState.at) }); }
    else if (lastSavedAt) { st = 'saved'; text = Date.now() - lastSavedAt < 60000 ? t('st_savedNow') : t('st_savedAt', { t: hhmm(lastSavedAt) }); }
    else { st = 'ready'; text = t('st_ready'); }
    box.setAttribute('data-state', st);
    tx.textContent = text;
    box.title = st === 'error' ? t(saveErr && saveErr.quota ? 'tQuota' : 'tSaveFail') : t('st_tip');
  }

  /* ================================================================ Google 동기화 (GIS 토큰 + Drive appDataFolder) */
  function syncOn() { return !!CLIENT_ID && lsGet(LS.sync) === '1'; }
  function ensureGis() {
    if (window.google && window.google.accounts && window.google.accounts.oauth2) return Promise.resolve();
    if (!gisPromise) gisPromise = loadScript(CDN.gis).then(function () {
      return new Promise(function (resolve, reject) {
        var n = 0, tick = function () { if (window.google && window.google.accounts && window.google.accounts.oauth2) resolve(); else if (++n > 100) reject(new Error('gis')); else setTimeout(tick, 50); };
        tick();
      });
    }).catch(function (e) { gisPromise = null; throw e; });
    return gisPromise;
  }
  /** 액세스 토큰은 메모리에만 둔다(localStorage 저장 금지) */
  function getToken(opts) {
    opts = opts || {};
    if (!opts.refresh && accessToken && Date.now() < tokenExp) return Promise.resolve(accessToken);
    return ensureGis().then(function () {
      return new Promise(function (resolve, reject) {
        var fail = function (code) { var e = new Error(code || 'auth'); e.code = 'auth'; reject(e); };
        var client = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: Y.SCOPE,
          callback: function (resp) {
            if (!resp || resp.error || !resp.access_token) { fail(resp && resp.error); return; }
            accessToken = resp.access_token;
            tokenExp = Date.now() + Math.max(60, (+resp.expires_in || 3600) - 60) * 1000;
            resolve(accessToken);
          },
          error_callback: function (err) { fail(err && err.type); }
        });
        client.requestAccessToken({ prompt: '' });
      });
    });
  }
  function ensureEngine() {
    if (syncEngine) return syncEngine;
    syncEngine = Y.createSyncEngine({
      fetch: function (u, i) { return window.fetch(u, i); },
      getToken: getToken,
      fileName: 'sheet-workbooks.json',
      debounceMs: 3000,
      isOnline: function () { return navigator.onLine !== false; },
      beforeSync: function () { return flushSave(); },
      conflictName: function (n) { return (n + ' ' + t('conflictSuffix')).trim(); },
      load: function () {
        return Promise.all([store.allRecordsMap(), store.getMeta('syncBase')]).then(function (r) { return { items: r[0], base: r[1] || {} }; });
      },
      saveBase: function (b) { return store.setMeta('syncBase', b); },
      apply: applyRemote,
      onStatus: function (s) {
        var prev = syncState && syncState.state;
        syncState = s;
        renderStatus(); renderSyncUi();
        if (s.state === 'synced' && s.conflicts) toast(t('tConflicts', { n: s.conflicts }), 'warn');
        if (s.state === 'auth' && prev !== 'auth') toast(t('tPopup'), 'warn');
      }
    });
    return syncEngine;
  }
  /** 병합 결과 중 이 기기에 써야 할 레코드 반영 */
  function applyRemote(records, merge, ctx) {
    var cur = book ? records.filter(function (r) { return r.id === book.id; })[0] : null;
    var dirty = !!cur && isDirty();
    var write = records, extra = null;
    if (cur && dirty && !cur.deleted) {
      // 지금 고치는 중인 통합문서가 원격에서 바뀜 → 원격본은 사본으로, 화면의 내용은 원본으로 (유실 0)
      write = records.filter(function (r) { return r !== cur; });
      extra = { id: cur.id + '~t' + (cur.updatedAt || 0).toString(36), name: (cur.name + ' ' + t('conflictSuffix')).trim(), sheets: cur.sheets, createdAt: Date.now(), updatedAt: Date.now(), conflictOf: cur.id };
      write = write.concat([extra]);
    }
    var result = { skipped: [] };
    return store.putRecords(write, ctx && ctx.expect).then(function (res) {
      result = res || result;
      var sk = result.skipped || [];
      var wrote = write.filter(function (r) { return sk.indexOf(r.id) < 0; });
      if (wrote.length) ping(wrote.map(function (r) { return r.id; }));
      if (!$('#booksPanel').hidden) renderBooks();
      if (!cur || sk.indexOf(cur.id) >= 0) return;          // 동기화 도중 이 기기에서 저장됨 → 화면 유지, 다음 병합에서 사본 처리
      if (dirty && !cur.deleted) { book.updatedAt = Math.max(book.updatedAt || 0, cur.updatedAt || 0); return flushSave({ force: true }); }
      if (dirty && cur.deleted) return flushSave({ force: true });
      toast(t('tRemoteUpdated'));
      if (cur.deleted) return openFallback();
      var idx = activeSheetIndex();
      book = cur; persisted = true;
      loadBookIntoGrid(book, idx);
    }).then(function () { return result; });
  }
  function connect() {
    if (!CLIENT_ID) { toast(t('syncSoonTip')); return; }
    closePops();
    lsSet(LS.sync, '1');
    var eng = ensureEngine();
    eng.start();
    getToken({ refresh: true }).then(function () { return eng.syncNow(); }).then(function (r) {
      if (r && r.ok) toast(t('tSynced'));
    }).catch(function () {
      syncState = { state: 'auth', at: Date.now() };
      renderStatus(); renderSyncUi();
      toast(t('tPopup'), 'warn');
    });
    renderSyncUi();
  }
  function syncNowManual() {
    closePops();
    if (!syncEngine) ensureEngine();
    syncEngine.syncNow().then(function (r) { toast(r && r.ok ? t('tSynced') : t('tSyncFail'), r && r.ok ? '' : 'warn'); });
  }
  function disconnect() {
    closePops();
    modal({ title: t('syncOff'), message: t('confirmDisconnect'), okText: t('syncOff') }).then(function (ok) {
      if (!ok) return;
      try { if (accessToken && window.google && window.google.accounts) window.google.accounts.oauth2.revoke(accessToken, function () {}); } catch (e) { /* ignore */ }
      accessToken = null; tokenExp = 0;
      lsSet(LS.sync, null);
      if (syncEngine) { syncEngine.stop(); syncEngine = null; }
      syncState = null;
      renderSyncUi(); renderStatus();
      toast(t('tDisconnected'));
    });
  }
  function renderSyncUi() {
    var btn = $('#syncBtn'), lbl = $('#syncLabel'), note = $('#syncNote');
    if (!btn) return;
    btn.classList.remove('warn');
    if (!CLIENT_ID) {
      btn.setAttribute('aria-disabled', 'true');
      btn.removeAttribute('aria-haspopup'); btn.removeAttribute('aria-expanded');
      lbl.textContent = t('syncSoon');
      btn.title = t('syncSoonTip');
      note.textContent = t('syncSoonTip');
      return;
    }
    btn.removeAttribute('aria-disabled');
    note.textContent = t('syncHelp');
    if (!syncOn()) { lbl.textContent = t('syncConnect'); btn.title = t('syncHelp'); btn.removeAttribute('aria-haspopup'); }
    else if (syncState && syncState.state === 'auth') { lbl.textContent = t('syncRe'); btn.title = t('tPopup'); btn.classList.add('warn'); btn.removeAttribute('aria-haspopup'); }
    else { lbl.textContent = t('syncOn'); btn.title = t('syncHelp'); btn.setAttribute('aria-haspopup', 'true'); }
  }

  /* ================================================================ 이벤트 연결 */
  function bindUi() {
    // 화면 읽기 프로그램용 셀 안내(시각적으로 숨김)
    if (!$('#cellLive')) { var live = el('div', 'sr-only', { id: 'cellLive', 'aria-live': 'polite' }); document.body.appendChild(live); }
    bindGridKeys();
    var whenReady = function (fn) { return function () { var self = this, args = arguments; return ready.then(function () { return fn.apply(self, args); }); }; };
    bindPop($('#booksBtn'), $('#booksPanel'), whenReady(renderBooks));
    bindPop($('#exportBtn'), $('#exportMenu'));
    document.addEventListener('click', function () { closePops(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePops(); });
    $('#newBtn').addEventListener('click', whenReady(newBook));
    $('#panelNew').addEventListener('click', whenReady(newBook));
    $('#importBtn').addEventListener('click', function () { $('#fileInput').click(); });
    $('#fileInput').addEventListener('change', function () { var f = this.files && this.files[0]; this.value = ''; ready.then(function () { importFile(f); }); });
    document.querySelectorAll('[data-export]').forEach(function (b) { b.addEventListener('click', whenReady(function () { doExport(b.getAttribute('data-export')); })); });
    $('#printBtn').addEventListener('click', function () { if (!xs) return; preparePrint(); window.print(); });
    window.addEventListener('beforeprint', function () { if (!$('#print-area').firstChild && xs) preparePrint(); });
    window.addEventListener('afterprint', function () { $('#print-area').textContent = ''; });
    $('#hintX').addEventListener('click', function () { hintOff = true; lsSet(LS.hint, '1'); updateHint(); });

    // 동기화 버튼: 미연결 → 연결 / 인증 필요 → 다시 연결 / 연결됨 → 메뉴
    var syncBtn = $('#syncBtn'), syncMenu = $('#syncMenu');
    pops.push({ btn: syncBtn, pop: syncMenu });
    syncBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (!CLIENT_ID) { toast(t('syncSoonTip')); return; }
      if (!syncOn() || (syncState && syncState.state === 'auth')) { connect(); return; }
      var open = syncMenu.hidden; closePops(syncMenu); syncMenu.hidden = !open; syncBtn.setAttribute('aria-expanded', String(open));
      if (open) placePop(syncMenu);
    });
    syncMenu.addEventListener('click', function (e) { e.stopPropagation(); });
    $('#syncNowBtn').addEventListener('click', syncNowManual);
    $('#syncOffBtn').addEventListener('click', disconnect);

    // 이름 상자: B5 · A1:C3 을 입력하고 Enter → 그 셀로 이동(키보드만으로 아무 셀이나)
    var ref = $('#fxRef');
    ref.addEventListener('focus', function () { if (xs && xs.sheet) xs.sheet.focusing = false; try { ref.select(); } catch (e) { /* ignore */ } setTimeout(function () { try { if (document.activeElement === ref) ref.select(); } catch (e) { /* ignore */ } }, 0); });
    ref.addEventListener('keydown', function (e) {
      e.stopPropagation();
      if (!xs) return;
      if (e.key === 'Enter') { e.preventDefault(); goToRef(ref.value); }
      else if (e.key === 'Escape') { e.preventDefault(); ref.value = C.cellRef(fxCell.ri, fxCell.ci); focusGrid(); }
    });
    ref.addEventListener('blur', function () { if (xs) ref.value = C.cellRef(fxCell.ri, fxCell.ci); });

    // 수식 입력줄
    var fx = $('#fxInput');
    // 키보드(Tab)로 들어와도 그리드 단축키가 입력줄 글자를 가로채지 않게
    fx.addEventListener('focus', function () { if (xs && xs.sheet) xs.sheet.focusing = false; });
    fx.addEventListener('keydown', function (e) {
      e.stopPropagation();
      if (!xs) return;
      if (e.key === 'Enter') { e.preventDefault(); commitFx(); fx.blur(); }
      else if (e.key === 'Escape') { e.preventDefault(); setFxBlurred(); fx.blur(); }
    });
    fx.addEventListener('change', function () { if (xs) commitFx(); });
    function setFxBlurred() { var c = xs.sheet.data.getCell(fxCell.ri, fxCell.ci); fx.value = c && c.text != null ? String(c.text) : ''; }

    // 복사: 시스템 클립보드에도 탭 구분 텍스트(화면 값)를 넣어 엑셀·구글 시트로 붙여넣을 수 있게
    window.addEventListener('keydown', function (e) {
      if (!xs || !xs.sheet.focusing || isEditingCell()) return;
      var k = (e.key || '').toLowerCase();
      if ((e.ctrlKey || e.metaKey) && !e.altKey && k === 's') { e.preventDefault(); flushSave({ persist: true }); return; }
      if (!(e.ctrlKey || e.metaKey) || e.altKey || (k !== 'c' && k !== 'x')) return;
      var tsv = selectionTSV();
      lastCopyText = normClip(tsv);
      try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(tsv).catch(function () {}); } catch (er) { /* ignore */ }
    }, true);
    // 붙여넣기: 마지막으로 이 그리드에서 복사한 것과 다른 텍스트면(=엑셀·구글 시트 등 외부) 외부 텍스트를 우선
    window.addEventListener('paste', function (e) {
      if (!xs || !xs.sheet.focusing || isEditingCell()) return;
      var txt = (e.clipboardData && e.clipboardData.getData('text/plain')) || '';
      if (txt && normClip(txt) !== lastCopyText) xs.sheet.data.clearClipboard();
    }, true);
    // Ctrl+S (그리드 밖에서도)
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && !e.altKey && (e.key || '').toLowerCase() === 's') { e.preventDefault(); flushSave({ persist: true }); }
    });

    // x-spreadsheet 는 열 너비·행 높이 조절, 시트 이름 변경, 되돌리기/다시하기 때 change 를 내지 않는다 →
    // 그리드에서 손을 뗄 때마다 저장 예약(실제 저장은 JSON 이 달라졌을 때만)
    ['mouseup', 'touchend', 'keyup', 'focusout'].forEach(function (ev) {
      $('#grid').addEventListener(ev, function () { if (xs) scheduleSave(); }, true);
    });

    // 파일 끌어다 놓기
    var frame = $('#gridFrame'), drop = $('#dropHint'), depth = 0;
    var hasFiles = function (e) { return e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types || [], 'Files') >= 0; };
    frame.addEventListener('dragenter', function (e) { if (!hasFiles(e)) return; e.preventDefault(); depth++; drop.hidden = false; });
    frame.addEventListener('dragover', function (e) { if (hasFiles(e)) e.preventDefault(); });
    frame.addEventListener('dragleave', function () { if (--depth <= 0) { depth = 0; drop.hidden = true; } });
    frame.addEventListener('drop', function (e) { if (!hasFiles(e)) return; e.preventDefault(); depth = 0; drop.hidden = true; var f = e.dataTransfer.files[0]; ready.then(function () { importFile(f); }); });

    // x-spreadsheet 안내 창의 'Tip' 제목 현지화
    try {
      new MutationObserver(function (muts) {
        muts.forEach(function (m) {
          m.addedNodes.forEach(function (n) {
            if (n.nodeType !== 1 || !n.classList || !n.classList.contains('x-spreadsheet-toast')) return;
            var head = n.querySelector('.x-spreadsheet-toast-header');
            if (head) head.childNodes.forEach(function (c) { if (c.nodeType === 3 && c.nodeValue.trim() === 'Tip') c.nodeValue = t('xsTip'); });
          });
        });
      }).observe(document.body, { childList: true });
    } catch (e) { /* ignore */ }

    // 저장 놓치지 않기 — IndexedDB 쓰기는 비동기라 새로고침·같은 탭 이동 때 끝나지 못할 수 있다 →
    // 먼저 localStorage 에 동기식 임시 사본을 남기고(다음에 열 때 복구) 그다음 평소처럼 저장
    window.addEventListener('pagehide', function () { writePending(); flushSave(); });
    window.addEventListener('beforeunload', function (e) {
      if (!xs || !book) return;
      if (!(saveTimer || isDirty() || inflight.length || saveErr)) return;
      var kept = writePending();
      flushSave();
      if (!kept || saveErr) { e.preventDefault(); e.returnValue = ''; return ''; }   // 저장 실패 중 → 떠나기 전에 확인
    });
    var lastFocusPull = Date.now();
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') { writePending(); flushSave(); return; }
      // 다른 PC 에서 고친 내용을 탭으로 돌아올 때 내려받는다(최대 30초에 한 번)
      if (syncOn() && syncEngine && Date.now() - lastFocusPull > 30000) { lastFocusPull = Date.now(); syncEngine.syncNow(); }
    });
    window.addEventListener('storage', onStorage);
    window.addEventListener('online', function () { renderStatus(); if (syncOn() && syncEngine) syncEngine.syncNow(); });
    window.addEventListener('offline', renderStatus);
    setInterval(function () { if (saveErr && !saveTimer) flushSave(); renderStatus(); }, 20000);
  }

  /* ================================================================ 시작 */
  function boot() {
    applyStaticI18n();
    buildLangSelect();
    bindUi();
    renderSyncUi();
    renderStatus();
    var gridLib = Promise.all([loadScript(CDN.xs, 'x_spreadsheet'), loadCss(CDN.xsCss)]);
    S.idbBackend('broodev-excel').then(function (be) { return S.createStore(be); }, function () {
      toast(t('tNoStorage'), 'warn');
      return S.createStore(S.memoryBackend());
    }).then(function (s) {
      store = s;
      return recoverPending();
    }).then(function () {
      return pickInitialBook();
    }).then(function (b) {
      book = b;
      if (persisted) lsSet(LS.current, b.id);
      renderBookTitle(); renderStatus();       // 그리드 라이브러리(CDN)를 기다리지 않고 현지화된 제목·상태
      return gridLib;
    }).then(function () {
      createGrid();
      loadBookIntoGrid(book);
      if (CLIENT_ID) {
        ensureGis().catch(function () { /* 오프라인 등 — 연결 시 다시 시도 */ });
        if (syncOn()) ensureEngine().syncNow();      // 이전에 연결했으면 조용히 토큰 재요청 → 내려받아 병합
      }
      document.documentElement.setAttribute('data-ready', '1');
      readyResolve(true);
    }).catch(function (err) {
      toast(t('tImportFail', { msg: (err && err.message) || 'x-spreadsheet' }), 'err', 0);
      if (window.console) console.warn('[sheet] boot failed', err);
    });
  }

  // 검증·자동화용 훅 (화면 동작과 같은 함수를 그대로 호출)
  window.SheetApp = {
    ready: ready,
    makeXlsxBlob: function () { return makeXlsxBlob(); },
    makeCsvBlob: function () { return makeCsvBlob(); },
    makePdfBlob: function (o) { return makePdfBlob(o); },
    pdfPages: function () { return P.countPages(currentData()[activeSheetIndex()]); },
    goTo: function (ref) { return goToRef(ref); },
    exportAs: function (kind) { return doExport(kind); },
    importFile: function (f) { return importFile(f); },
    getData: function () { return currentData(); },
    getBook: function () { return book && { id: book.id, name: book.name, updatedAt: book.updatedAt, persisted: persisted }; },
    activeSheetIndex: function () { return activeSheetIndex(); },
    setCell: function (ri, ci, text, sheetIndex) {
      if (sheetIndex != null) switchSheet(sheetIndex);
      var d = xs.sheet.data;
      d.changeData(function () { d.rows.setCellText(ri, ci, String(text)); });
      xs.reRender();
    },
    loadSheets: function (sheets) { xs.loadData(clone(sheets)); scheduleSave(); },
    flushSave: function () { return flushSave({ persist: true }); },
    listBooks: function () { return store.listBooks(); },
    newBook: function () { return newBook(); },
    openBook: function (id) { return openBook(id); },
    syncNow: function () { return syncEngine ? syncEngine.syncNow() : Promise.resolve(null); },
    syncState: function () { return syncState; },
    status: function () { return { local: localState, text: $('#statusText').textContent, state: $('#status').getAttribute('data-state'), dirty: isDirty(), saveErr: saveErr }; },
    lang: function () { return lang; }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
