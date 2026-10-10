/* =============================================================================
   memo · app.js — 화면 연결(바닐라 JS). 로직은 store.js(로컬) · sync.js(병합·Drive) 에 있다.
   - 메모 본문은 textarea 원문 그대로, 목록·제목은 textContent 로만 그린다(HTML 렌더 없음 → XSS 차단)
   - 자동 저장: 입력 600ms 뒤 localStorage(읽고-병합-쓰기) · 열면 자동 복원 · 다른 탭 변경은 storage 이벤트로 병합
   - Google 동기화: GIS 토큰(메모리에만) + Drive appDataFolder · 저장 3초 뒤 업로드 · 앱을 열 때 조용히 재연결 시도
   ========================================================================== */
(function () {
  'use strict';
  var I = window.MemoI18n, Sync = window.MemoSync, F = window.MemoFormat;
  var CFG = window.MEMO_CONFIG || {};
  var CLIENT_ID = String(CFG.GOOGLE_CLIENT_ID || '').trim();
  var K_LANG = 'memo:lang', K_OPEN = 'memo:open', K_SORT = 'memo:sort', K_GS = 'memo:gsync:v1';
  var SAVE_MS = 600, SYNC_MS = 3000;
  var MAX_NOTE_CHARS = 2000000, STORAGE_BUDGET = 4500000, MAX_IMPORT = 8 * 1024 * 1024; // 글자 수 · 글자 수 · 파일 바이트(UTF-8 한글 1자 = 3바이트)

  /* localStorage 가 막힌 환경(일부 사생활 보호 모드) → 메모리 저장소로 대체(새로고침하면 사라짐) */
  var LS = (function () {
    try { var k = 'memo:__probe'; localStorage.setItem(k, '1'); localStorage.removeItem(k); return localStorage; } catch (e) {}
    var m = {};
    return { getItem: function (k) { return k in m ? m[k] : null; }, setItem: function (k, v) { m[k] = String(v); }, removeItem: function (k) { delete m[k]; } };
  })();
  function lsGet(k) { try { return LS.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { LS.setItem(k, v); } catch (e) {} }

  var $ = function (id) { return document.getElementById(id); };
  var el = {
    root: $('root'), list: $('list'), listEmpty: $('listEmpty'), noResults: $('noResults'), count: $('noteCount'),
    search: $('search'), sort: $('sortSel'), newBtn: $('newBtn'), newBtn2: $('newBtn2'), ta: $('ta'), edEmpty: $('edEmpty'), edFoot: $('edFoot'),
    edTitle: $('edTitle'), backBtn: $('backBtn'), pinBtn: $('pinBtn'), pinText: $('pinText'), txtBtn: $('txtBtn'), mdBtn: $('mdBtn'), delBtn: $('delBtn'),
    cntChars: $('cntChars'), cntWords: $('cntWords'), editedAt: $('editedAt'),
    status: $('status'), statusText: $('statusText'), langSel: $('langSel'), toast: $('toast'),
    whereText: $('whereText'), syncBtn: $('syncBtn'), syncBtnText: $('syncBtnText'), syncNowBtn: $('syncNowBtn'), disconnectBtn: $('disconnectBtn'), syncNote: $('syncNote'),
    importBtn: $('importBtn'), backupBtn: $('backupBtn'), fileIn: $('fileIn')
  };

  var lang = I.detectLang();
  var store = new window.MemoStore({ storage: LS });
  store.load();
  var loadedAt = Date.now();
  var curId = null, view = 'list', query = '', sort = lsGet(K_SORT) || 'updated';
  if (['updated', 'created', 'title'].indexOf(sort) < 0) sort = 'updated';
  var fresh = {};            // 이번 세션에 만든 빈 메모(아무것도 안 쓰고 떠나면 흔적 없이 버림)
  var saveTimer = null, saveErr = false, listRaf = 0, countTimer = null, pushedEditor = false;

  function L(key, vars) { return I.t(lang, key, vars); }
  function loc() { return I.INTL[lang] || lang; }
  function isMobile() { return window.matchMedia && window.matchMedia('(max-width: 760px)').matches; }

  /* ===== 시간 표시 ===== */
  function fmtTime(ts) {
    var d = new Date(ts), n = new Date();
    try {
      if (d.toDateString() === n.toDateString()) return d.toLocaleTimeString(loc(), { hour: '2-digit', minute: '2-digit' });
      if (d.getFullYear() === n.getFullYear()) return d.toLocaleDateString(loc(), { month: 'short', day: 'numeric' });
      return d.toLocaleDateString(loc(), { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) { return d.toISOString().slice(0, 16).replace('T', ' '); }
  }
  function clock(ts) { try { return new Date(ts).toLocaleTimeString(loc(), { hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } }
  function rel(ts) {
    var s = Math.round((Date.now() - ts) / 1000);
    try {
      var rtf = new Intl.RelativeTimeFormat(loc(), { numeric: 'auto' });
      if (s < 45) return rtf.format(0, 'second');
      if (s < 3600) return rtf.format(-Math.max(1, Math.round(s / 60)), 'minute');
    } catch (e) {}
    return fmtTime(ts);
  }

  /* ===== 토스트 ===== */
  var toastTimer = null;
  function toast(msg, action, ms) {
    var t = el.toast;
    t.textContent = '';
    var span = document.createElement('span'); span.textContent = msg; t.appendChild(span);
    if (action) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'btn'; b.textContent = action.label;
      b.addEventListener('click', function () { hideToast(); action.fn(); });
      t.appendChild(b);
    }
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, ms || (action ? 7000 : 3400));
  }
  function hideToast() { el.toast.classList.remove('show'); }
  var lastToastKey = '', lastToastAt = 0;
  function toastOnce(key, msg) { var n = Date.now(); if (key === lastToastKey && n - lastToastAt < 5000) return; lastToastKey = key; lastToastAt = n; toast(msg); }

  /* ===== 언어 ===== */
  function applyLang() {
    document.documentElement.lang = I.HTML_LANG[lang] || lang;
    document.title = L('metaTitle');
    setMeta('meta[name="description"]', L('metaDesc'));
    setMeta('meta[property="og:title"]', L('metaTitle'));
    setMeta('meta[property="og:description"]', L('metaDesc'));
    setMeta('meta[name="twitter:title"]', L('metaTitle'));
    setMeta('meta[name="twitter:description"]', L('metaDesc'));
    setMeta('meta[property="og:image:alt"]', L('appName') + ' MEMO');
    setMeta('meta[property="og:locale"]', I.OG_LOCALE[lang] || 'en_US');
    el.langSel.value = lang;
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = L(nodes[i].getAttribute('data-i18n'));
    each('[data-i18n-ph]', function (n) { n.setAttribute('placeholder', L(n.getAttribute('data-i18n-ph'))); });
    each('[data-i18n-aria]', function (n) { n.setAttribute('aria-label', L(n.getAttribute('data-i18n-aria'))); });
    each('[data-i18n-title]', function (n) { n.setAttribute('title', L(n.getAttribute('data-i18n-title'))); });
    var q = '?lang=' + encodeURIComponent(lang);
    $('lkTerms').href = 'https://broodev.com/legal/terms' + q;
    $('lkPrivacy').href = 'https://broodev.com/legal/privacy' + q;
    $('lkContact').href = 'https://voca.broodev.com/contact?app=memo&lang=' + encodeURIComponent(lang);
    renderSeo();
    renderAll();
    updateSyncUI();
    updateStatus();
  }
  function setMeta(sel, v) { var m = document.querySelector(sel); if (m) m.setAttribute('content', v); }
  function each(sel, fn) { var n = document.querySelectorAll(sel); for (var i = 0; i < n.length; i++) fn(n[i]); }
  function renderSeo() {
    $('seoH2').textContent = L('seoH2');
    $('seoIntro').textContent = L('seoIntro');
    $('seoHowH').textContent = L('seoHowH');
    $('seoFaqH').textContent = L('seoFaqH');
    var ol = $('seoSteps'); ol.textContent = '';
    L('seoSteps').forEach(function (s) { var li = document.createElement('li'); li.textContent = s; ol.appendChild(li); });
    var fq = $('seoFaq'); fq.textContent = '';
    L('faq').forEach(function (qa) {
      var h = document.createElement('h4'); h.textContent = qa[0];
      var p = document.createElement('p'); p.textContent = qa[1];
      fq.appendChild(h); fq.appendChild(p);
    });
    // 구조화 데이터도 화면 FAQ 와 같은 언어·같은 문장으로
    var ld = $('ld-json');
    if (ld) ld.textContent = JSON.stringify(I.ldJson(lang));
  }

  /* ===== 목록 ===== */
  function cmp(a, b) {
    if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
    if (sort === 'created') return (b.createdAt - a.createdAt) || (b.updatedAt - a.updatedAt);
    if (sort === 'title') {
      var ta = F.title(a.text), tb = F.title(b.text);
      if (!ta !== !tb) return ta ? -1 : 1;
      var c = 0; try { c = ta.localeCompare(tb, loc(), { sensitivity: 'base', numeric: true }); } catch (e) { c = ta < tb ? -1 : ta > tb ? 1 : 0; }
      return c || (b.updatedAt - a.updatedAt);
    }
    return b.updatedAt - a.updatedAt;
  }
  function visible() {
    var q = query.trim().toLowerCase();
    return store.alive().filter(function (n) { return !q || n.text.toLowerCase().indexOf(q) >= 0; }).sort(cmp);
  }
  function renderList() {
    listRaf = 0;
    var arr = visible(), total = store.alive().length;
    var frag = document.createDocumentFragment();
    arr.forEach(function (n) {
      var li = document.createElement('li');
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'item' + (n.id === curId ? ' active' : ''); b.setAttribute('data-id', n.id);
      if (n.id === curId) b.setAttribute('aria-current', 'true');
      var title = F.title(n.text);
      var tt = document.createElement('span'); tt.className = 'it-title' + (title ? '' : ' untitled');
      if (n.pinned) { var p = document.createElement('span'); p.className = 'it-pin'; p.textContent = '📌'; p.setAttribute('role', 'img'); p.setAttribute('aria-label', L('pinnedMark')); tt.appendChild(p); }
      if (n.conflictOf) { var tg = document.createElement('span'); tg.className = 'it-tag'; tg.textContent = L('conflictTag'); tt.appendChild(tg); }
      tt.appendChild(document.createTextNode(title || L('untitled')));
      var tm = document.createElement('span'); tm.className = 'it-time'; tm.textContent = fmtTime(n.updatedAt);
      var sn = document.createElement('span'); sn.className = 'it-snip'; sn.textContent = F.snippet(n.text);
      b.appendChild(tt); b.appendChild(tm); b.appendChild(sn);
      li.appendChild(b); frag.appendChild(li);
    });
    el.list.textContent = '';
    el.list.appendChild(frag);
    el.list.hidden = arr.length === 0;
    el.listEmpty.hidden = total !== 0;
    el.noResults.hidden = !(total > 0 && arr.length === 0);
    el.count.textContent = total ? L('noteCount', { n: total }) : '';
  }
  function scheduleList() { if (!listRaf) listRaf = requestAnimationFrame(renderList); }

  /* ===== 편집기 ===== */
  function cur() { var n = curId && store.get(curId); return n && !n.deleted ? n : null; }
  function renderEditor(forceValue) {
    var n = cur();
    el.root.setAttribute('data-view', view);
    var has = !!n;
    el.ta.hidden = !has; el.edFoot.hidden = !has; el.edEmpty.hidden = has;
    [el.pinBtn, el.txtBtn, el.mdBtn, el.delBtn].forEach(function (b) { b.disabled = !has; });
    if (!has) { el.edTitle.textContent = ''; el.pinBtn.setAttribute('aria-pressed', 'false'); el.pinText.textContent = L('pin'); el.pinBtn.title = L('pin'); return; }
    if (forceValue || el.ta.value !== n.text) setTaValue(n.text);
    var title = F.title(n.text);
    el.edTitle.textContent = (n.conflictOf ? L('conflictTag') + ' ' : '') + (title || L('untitled'));
    el.pinBtn.setAttribute('aria-pressed', n.pinned ? 'true' : 'false');
    el.pinText.textContent = n.pinned ? L('unpin') : L('pin');
    el.pinBtn.title = n.pinned ? L('unpin') : L('pin');
    el.pinBtn.setAttribute('aria-label', el.pinBtn.title);
    el.delBtn.setAttribute('aria-label', L('delTip'));
    updateCounts();
  }
  function setTaValue(v) {
    var ta = el.ta, focused = document.activeElement === ta, s = ta.selectionStart, e = ta.selectionEnd;
    ta.value = v;
    if (focused) { try { ta.setSelectionRange(Math.min(s, v.length), Math.min(e, v.length)); } catch (x) {} }
  }
  function updateCounts() {
    var n = cur(); if (!n) return;
    el.cntChars.textContent = L('chars', { n: F.chars(n.text).toLocaleString(loc()) });
    el.cntWords.textContent = L('words', { n: F.words(n.text, loc()).toLocaleString(loc()) });
    el.editedAt.textContent = L('editedAt', { t: fmtTime(n.updatedAt) });
  }
  function renderAll(forceValue) { renderList(); renderEditor(forceValue); }

  function setView(v) {
    view = v;
    el.root.setAttribute('data-view', v);
    if (v === 'editor' && isMobile() && !pushedEditor) { try { history.pushState({ memo: 'editor' }, ''); pushedEditor = true; } catch (e) {} }
    if (v === 'list' && pushedEditor) { pushedEditor = false; try { if (history.state && history.state.memo === 'editor') history.back(); } catch (e) {} }
  }
  function leaveCurrent() {
    if (!curId) return;
    var n = store.get(curId);
    if (n && !n.deleted && fresh[curId] && !n.text.trim()) { store.discard(curId); saveNow(); }
    else if (saveTimer) saveNow();
    delete fresh[curId];
  }
  function openNote(id, focus) {
    if (curId !== id) leaveCurrent();
    curId = id; lsSet(K_OPEN, id);
    setView('editor');
    renderAll(true);
    if (focus && cur()) el.ta.focus();
  }
  function newNote() {
    leaveCurrent();
    if (query) { query = ''; el.search.value = ''; }
    var n = store.create('');
    fresh[n.id] = 1;
    curId = n.id; lsSet(K_OPEN, n.id);
    setView('editor');
    renderAll(true);
    el.ta.focus();
  }
  function backToList() {
    leaveCurrent();
    if (!cur()) curId = null;
    setView('list');
    renderAll();
  }

  /* ===== 저장 ===== */
  function scheduleSave() { clearTimeout(saveTimer); saveTimer = setTimeout(function () { saveNow(); }, SAVE_MS); }
  function saveNow() {
    clearTimeout(saveTimer); saveTimer = null;
    var r, failed = false;
    try { r = store.save(); }
    catch (e) { failed = true; r = e && e.result; }
    setSaveErr(failed);
    if (r && r.conflicts.length) toast(L('conflictToast'));
    if (r && r.external) { refreshFromStore(); }
    if (gs.on) { gs.dirty = true; scheduleSync(SYNC_MS); }
    updateStatus();
    if (failed) { // 이 메모(들)만 저장 실패 — 나머지는 저장됨. 떠나기 전에 경고 + 지금 백업 받기
      var n = Date.now();
      if (!(lastToastKey === 'quota' && n - lastToastAt < 15000)) {
        lastToastKey = 'quota'; lastToastAt = n;
        toast(L('saveFailBackup'), { label: L('backupNow'), fn: doBackup }, 15000);
      }
    }
    return !failed;
  }
  /* 저장 실패 상태: 상태 표시줄(빨강) + 페이지를 떠나려 하면 브라우저 경고(저장 못 한 편집이 메모리에만 있음) */
  function onBeforeUnload(e) { if (!saveErr) return; e.preventDefault(); e.returnValue = ''; return ''; }
  function setSaveErr(v) {
    if (v === saveErr) return;
    saveErr = v;
    if (v) window.addEventListener('beforeunload', onBeforeUnload);
    else window.removeEventListener('beforeunload', onBeforeUnload); // 평소에는 리스너를 두지 않는다(bfcache 유지)
  }
  /* 저장소 쪽(다른 탭 · 동기화 결과)에서 바뀐 내용을 화면에 반영 */
  function refreshFromStore() {
    var n = curId && store.get(curId);
    if (curId && (!n || n.deleted)) { curId = null; if (view === 'editor') setView('list'); }
    renderAll();
  }

  el.ta.addEventListener('input', function () {
    if (!curId) return;
    store.update(curId, { text: el.ta.value });
    if (el.ta.value.trim()) delete fresh[curId];
    scheduleSave();
    scheduleList();
    var n = cur();
    if (n) el.edTitle.textContent = (n.conflictOf ? L('conflictTag') + ' ' : '') + (F.title(n.text) || L('untitled'));
    clearTimeout(countTimer); countTimer = setTimeout(updateCounts, 180);
  });

  /* ===== 상태 표시 ===== */
  function updateStatus() {
    var s, cls = 'ok';
    if (saveErr) { s = L('saveFail'); cls = 'crit'; }
    else if (gs.on) {
      if (typeof navigator !== 'undefined' && navigator.onLine === false) { s = L('offline'); cls = 'crit'; }
      else if (gs.syncing) { s = L('syncing'); cls = 'sync'; }
      else if (gs.state === 'needsAuth' || gs.state === 'error' || gs.dirty || !gs.lastSyncAt) { s = L('pending'); cls = 'warn'; }
      else s = L('syncedAt', { t: clock(gs.lastSyncAt) });
    } else s = L('saved', { t: rel(store.lastSavedAt || loadedAt) });
    el.statusText.textContent = s;
    el.status.className = 'status ' + cls;
    el.status.title = s;
  }

  /* ===== Google 동기화 ===== */
  var gs = { on: false, fileId: null, base: {}, lastSyncAt: 0, token: null, tokenExp: 0, state: 'idle', syncing: false, again: false, dirty: false };
  var syncTimer = null, tokenP = null, gisP = null;
  function loadGs() {
    var o = null; try { o = JSON.parse(lsGet(K_GS) || 'null'); } catch (e) {}
    gs.on = !!(o && o.on) && !!CLIENT_ID;
    gs.fileId = (o && o.fileId) || null;
    gs.base = (o && o.base && typeof o.base === 'object') ? o.base : {};
    gs.lastSyncAt = (o && o.lastSyncAt) || 0;
  }
  function saveGs() { lsSet(K_GS, JSON.stringify({ on: gs.on, fileId: gs.fileId, base: gs.base, lastSyncAt: gs.lastSyncAt })); } // 토큰은 저장하지 않는다
  function err(code) { var e = new Error(String(code)); e.code = code; return e; }
  function loadGis() {
    if (window.google && google.accounts && google.accounts.oauth2) return Promise.resolve(google.accounts.oauth2);
    if (!gisP) gisP = new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client'; s.async = true; s.defer = true;
      s.onload = function () { if (window.google && google.accounts && google.accounts.oauth2) res(google.accounts.oauth2); else { gisP = null; rej(err('gis')); } };
      s.onerror = function () { gisP = null; rej(err('gis')); };
      document.head.appendChild(s);
    });
    return gisP;
  }
  function requestToken() {
    return loadGis().then(function (oauth2) {
      return new Promise(function (res, rej) {
        var done = false;
        var tc = oauth2.initTokenClient({
          client_id: CLIENT_ID, scope: Sync.SCOPE,
          callback: function (resp) {
            done = true;
            if (!resp || resp.error) return rej(err((resp && resp.error) || 'auth'));
            if (oauth2.hasGrantedAllScopes && !oauth2.hasGrantedAllScopes(resp, Sync.SCOPE)) return rej(err('scope'));
            gs.token = resp.access_token;
            gs.tokenExp = Date.now() + (Number(resp.expires_in) || 3600) * 1000;
            res(gs.token);
          },
          error_callback: function (e) { done = true; rej(err((e && e.type) || 'popup')); }
        });
        tc.requestAccessToken({ prompt: '' });
        setTimeout(function () { if (!done) rej(err('timeout')); }, 120000);
      });
    });
  }
  function getToken(force) {
    if (!force && gs.token && Date.now() < gs.tokenExp - 60000) return Promise.resolve(gs.token);
    if (force) gs.token = null;
    if (!tokenP) tokenP = requestToken().then(function (t) { tokenP = null; return t; }, function (e) { tokenP = null; throw e; });
    return tokenP;
  }
  function scheduleSync(ms) {
    if (!gs.on) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(function () { syncNow(); }, ms == null ? SYNC_MS : ms);
  }
  var syncP = null;
  function syncNow() {
    if (!gs.on || !CLIENT_ID) return Promise.resolve();
    clearTimeout(syncTimer); syncTimer = null;
    if (gs.syncing) { gs.again = true; return syncP; }
    if (navigator.onLine === false) { gs.state = 'offline'; updateStatus(); return Promise.resolve(); }
    gs.syncing = true; updateStatus(); updateSyncUI();
    var conflicts = 0;
    function run() {
      clearTimeout(saveTimer); saveTimer = null;
      try { store.save(); setSaveErr(false); } catch (e) { setSaveErr(true); } // 보낼 스냅숏 = 저장소와 같은 상태(쓰지 못한 큰 메모도 메모리 판이 올라간다)
      loadGs(); // 다른 탭이 방금 동기화했을 수 있음 → 최신 base/fileId
      if (!gs.on) return null;
      var snap = store.snapshot();
      var drive = Sync.createDrive({ fetch: function (u, i) { return window.fetch(u, i); }, getToken: getToken });
      return Sync.syncOnce({ drive: drive, local: snap.notes, base: gs.base, fileId: gs.fileId, now: Date.now() }).then(function (r) {
        var mi = store.mergeIn(r.notes, snap.base);
        conflicts = r.conflicts.length + mi.conflicts.length;
        gs.base = r.base; gs.fileId = r.fileId; gs.lastSyncAt = Date.now(); gs.state = 'synced';
        saveGs();
        try { store.save(); setSaveErr(false); } catch (e) { setSaveErr(true); }
        gs.dirty = !Sync.sameSet(store.all(), r.notes); // 동기화 중에 고친 것이 있으면 한 번 더
        if (gs.dirty) gs.again = true;
        if (mi.changed) refreshFromStore();
        if (conflicts) toast(L('conflictToast'));
      });
    }
    var p = (navigator.locks && navigator.locks.request) ? navigator.locks.request('memo-drive-sync', run) : Promise.resolve().then(run);
    syncP = p.catch(onSyncError).then(function () {
      gs.syncing = false; updateStatus(); updateSyncUI();
      if (gs.again && gs.state !== 'needsAuth') { gs.again = false; scheduleSync(800); }
    });
    return syncP;
  }
  function onSyncError(e) {
    var code = e && (e.code || e.status);
    gs.dirty = true;
    if (code === 'popup_failed_to_open') { gs.state = 'needsAuth'; toastOnce('popup', L('popupBlocked')); }
    else if (code === 'scope') { gs.state = 'needsAuth'; toastOnce('scope', L('scopeDenied')); }
    else if (code === 'popup_closed' || code === 'access_denied' || code === 'timeout' || code === 'interaction_required' || code === 'consent_required' || code === 'login_required' || code === 401 || code === 403) { gs.state = 'needsAuth'; }
    else if (code === 'gis' || (e && e.name === 'TypeError') || navigator.onLine === false) { gs.state = navigator.onLine === false ? 'offline' : 'error'; }
    else { gs.state = 'error'; toastOnce('syncfail', L('syncFail')); }
    if (gs.state === 'needsAuth') gs.token = null;
  }
  function connect() {
    if (!CLIENT_ID) return;
    var wasOn = gs.on;
    el.syncBtn.disabled = true;
    getToken(true).then(function () {
      gs.on = true; gs.state = 'idle'; saveGs();
      if (!wasOn) toast(L('connected'));
      updateSyncUI();
      return syncNow();
    }).catch(function (e) {
      var code = e && e.code;
      if (code === 'scope') toast(L('scopeDenied'));
      else if (code === 'popup_failed_to_open') toast(L('popupBlocked'));
      else if (code !== 'popup_closed' && code !== 'access_denied') toast(L('authFail'));
      if (wasOn) gs.state = 'needsAuth';
    }).then(function () { el.syncBtn.disabled = false; updateSyncUI(); updateStatus(); });
  }
  /* 연결 해제 = 이 앱의 Drive 권한을 Google 계정에서 철회(revoke)까지. 유효한 토큰이 없으면(조용한 재연결이 막혔거나
     1시간이 지나 만료) 클릭 제스처 안에서 새 토큰을 받아 철회한다. 그래도 안 되면 해제는 진행하고 Google 계정의
     권한 페이지에서 직접 지우도록 안내한다. 만료된 토큰은 철회에 쓰지 않는다(효과 없음). */
  var PERMS_URL = 'https://myaccount.google.com/permissions';
  function revokeManualToast() {
    toast(L('revokeManual'), { label: L('openPermissions'), fn: function () { try { window.open(PERMS_URL, '_blank', 'noopener'); } catch (e) {} } }, 15000);
  }
  function disconnect() {
    if (!window.confirm(L('confirmDisconnect'))) return;
    var valid = gs.token && Date.now() < gs.tokenExp - 5000 ? gs.token : null;
    gs.token = null; gs.tokenExp = 0;                     // 만료됐거나 곧 버릴 토큰 — 메모리에서 바로 지운다
    var tokP = valid ? Promise.resolve(valid) : (CLIENT_ID ? getToken(true) : Promise.reject(err('noclient')));
    clearTimeout(syncTimer);
    gs.on = false; gs.fileId = null; gs.base = {}; gs.lastSyncAt = 0; gs.state = 'idle'; gs.dirty = false;
    saveGs();
    updateSyncUI(); updateStatus();
    tokP.then(function (tok) {
      gs.token = null; gs.tokenExp = 0;                   // getToken 이 다시 넣은 토큰도 지운다(해제 상태)
      return new Promise(function (res, rej) {
        try {
          google.accounts.oauth2.revoke(tok, function (r) { if (r && r.successful === false) rej(err((r && r.error) || 'revoke')); else res(); });
          setTimeout(function () { rej(err('timeout')); }, 15000);
        } catch (e) { rej(e); }
      });
    }).then(function () { toast(L('disconnected')); }, function () {
      gs.token = null; gs.tokenExp = 0;
      revokeManualToast();
    });
  }
  function updateSyncUI() {
    var on = gs.on && !!CLIENT_ID;
    el.whereText.textContent = on ? L('whereSynced') : L('whereLocal');
    if (!CLIENT_ID) {
      el.syncBtn.hidden = false; el.syncBtn.disabled = true; el.syncBtnText.textContent = L('syncSoon');
      el.syncNowBtn.hidden = true; el.disconnectBtn.hidden = true;
      el.syncNote.textContent = L('syncSoonHelp');
      return;
    }
    el.syncNote.textContent = L('syncScope');
    if (!on) {
      el.syncBtn.hidden = false; el.syncBtnText.textContent = L('syncConnect');
      el.syncNowBtn.hidden = true; el.disconnectBtn.hidden = true;
    } else {
      var needs = gs.state === 'needsAuth';
      el.syncBtn.hidden = !needs; el.syncBtnText.textContent = L('reconnect');
      el.syncNowBtn.hidden = needs; el.syncNowBtn.disabled = gs.syncing;
      el.disconnectBtn.hidden = false;
    }
    if (!el.syncBtn.hidden && !tokenP) el.syncBtn.disabled = false;
  }

  /* ===== 파일: 내보내기 · 백업 · 가져오기 ===== */
  function download(name, text, type) {
    var url = URL.createObjectURL(new Blob([text], { type: type }));
    var a = document.createElement('a'); a.href = url; a.download = name; a.rel = 'noopener';
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1500);
  }
  function readFile(f) {
    if (f.text) return f.text();
    return new Promise(function (res, rej) { var r = new FileReader(); r.onload = function () { res(String(r.result)); }; r.onerror = rej; r.readAsText(f); });
  }
  /* 브라우저 저장소(localStorage)는 출처마다 약 500만 자. 메모마다 키가 따로라 한 메모가 넘쳐도 다른 메모는 저장되지만,
     가져오기는 미리 크기를 확인해 처음부터 들어가지 못할 파일은 받지 않는다 */
  function usedChars() { var c = 0; store.alive().forEach(function (n) { c += n.text.length; }); return c; }
  function importFiles(files) {
    var created = [], merged = 0, conflicts = 0, failed = [], tooBig = [];
    if (saveTimer) saveNow();
    var chain = Promise.resolve();
    Array.prototype.forEach.call(files, function (f) {
      chain = chain.then(function () {
        var kind = F.kind(f.name);
        if (!kind) { failed.push(f.name); return; }
        if (f.size > MAX_IMPORT) { tooBig.push(f.name); return; }
        return readFile(f).then(function (txt) {
          if (kind === 'text') {
            var body = F.fromText(f.name, txt);
            if (body.length > MAX_NOTE_CHARS || usedChars() + body.length > STORAGE_BUDGET) { tooBig.push(f.name); return; }
            created.push(store.create(body).id); return;
          }
          var arr = F.parseBackup(txt, Date.now()), sum = 0, big = false;
          arr.forEach(function (n) { sum += n.text.length; if (n.text.length > MAX_NOTE_CHARS) big = true; });
          if (big || sum > STORAGE_BUDGET) { tooBig.push(f.name); return; }
          var r = store.mergeIn(arr, {}, { preferAlive: true });
          merged += arr.length; conflicts += r.conflicts.length;
        }).catch(function () { failed.push(f.name); });
      });
    });
    return chain.then(function () {
      if (created.length || merged) saveNow();
      if (created.length) { curId = created[created.length - 1]; lsSet(K_OPEN, curId); if (isMobile()) setView('editor'); }
      renderAll(true);
      if (tooBig.length) toast(L('importTooBig', { f: tooBig.join(', '), n: MAX_NOTE_CHARS.toLocaleString(loc()) }), null, 8000);
      else if (failed.length) toast(L('importFail', { f: failed.join(', ') }));
      else if (merged) toast(L('importedMerge', { n: merged + created.length, c: conflicts }));
      else if (created.length) toast(L('imported', { n: created.length }));
    });
  }

  /* ===== 이벤트 ===== */
  el.newBtn.addEventListener('click', newNote);
  el.newBtn2.addEventListener('click', newNote);
  el.list.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.item');
    if (b) openNote(b.getAttribute('data-id'), !isMobile());
  });
  el.search.addEventListener('input', function () { query = el.search.value; renderList(); });
  el.search.addEventListener('keydown', function (e) { if (e.key === 'Escape') { el.search.value = ''; query = ''; renderList(); } });
  el.sort.value = sort;
  el.sort.addEventListener('change', function () { sort = el.sort.value; lsSet(K_SORT, sort); renderList(); });
  el.backBtn.addEventListener('click', backToList);
  window.addEventListener('popstate', function () { if (view === 'editor' && pushedEditor) { pushedEditor = false; leaveCurrent(); if (!cur()) curId = null; view = 'list'; renderAll(); } });
  el.pinBtn.addEventListener('click', function () {
    var n = cur(); if (!n) return;
    store.update(n.id, { pinned: !n.pinned }); saveNow(); renderAll();
  });
  el.delBtn.addEventListener('click', function () {
    var n = cur(); if (!n) return;
    if (fresh[n.id] && !n.text.trim()) { delete fresh[n.id]; store.discard(n.id); curId = null; saveNow(); setView('list'); renderAll(); return; }
    var prev = store.remove(n.id);
    saveNow();
    var next = visible()[0];
    curId = (!isMobile() && next) ? next.id : null;
    if (isMobile() || !next) setView('list');
    renderAll(true);
    toast(L('deleted'), { label: L('undo'), fn: function () {
      store.restore(prev); saveNow(); curId = prev.id; lsSet(K_OPEN, prev.id); setView('editor'); renderAll(true); toast(L('restored'));
    } });
  });
  el.txtBtn.addEventListener('click', function () { var n = cur(); if (n) download(F.fileName(n, 'txt'), F.toTxt(n), 'text/plain;charset=utf-8'); });
  el.mdBtn.addEventListener('click', function () { var n = cur(); if (n) download(F.fileName(n, 'md'), F.toMd(n), 'text/markdown;charset=utf-8'); });
  function doBackup() { // 메모리의 모든 메모(저장에 실패한 큰 메모 포함)를 .json 으로
    clearTimeout(saveTimer); saveTimer = null;
    try { store.save(); setSaveErr(false); } catch (e) { setSaveErr(true); }
    var now = Date.now();
    download(F.backupName(now), F.backup(store.all(), now), 'application/json;charset=utf-8');
    updateStatus();
    toast(L('backupDone'));
  }
  el.backupBtn.addEventListener('click', doBackup);
  el.importBtn.addEventListener('click', function () { el.fileIn.value = ''; el.fileIn.click(); });
  el.fileIn.addEventListener('change', function () { if (el.fileIn.files && el.fileIn.files.length) importFiles(el.fileIn.files); });
  el.syncBtn.addEventListener('click', connect);
  el.syncNowBtn.addEventListener('click', function () { if (saveTimer) saveNow(); syncNow(); });
  el.disconnectBtn.addEventListener('click', disconnect);
  el.langSel.addEventListener('change', function () {
    var v = I.pickFrom(el.langSel.value); if (!v) return;
    lang = v; lsSet(K_LANG, v);
    try { var u = new URL(location.href); if (u.searchParams.has('lang')) { u.searchParams.set('lang', v); history.replaceState(history.state, '', u.toString()); } } catch (e) {}
    applyLang();
  });

  document.addEventListener('keydown', function (e) {
    var mod = e.ctrlKey || e.metaKey, k = (e.key || '').toLowerCase();
    if (mod && !e.shiftKey && !e.altKey && k === 's') {
      e.preventDefault();
      if (saveNow()) { toast(L('savedToast')); if (gs.on) syncNow(); }
    } else if ((mod && !e.shiftKey && !e.altKey && k === 'n') || (e.altKey && !mod && e.code === 'KeyN')) {
      e.preventDefault(); newNote();
    }
  });

  // 다른 탭 · 다른 창: 같은 키가 바뀌면 병합해서 반영(덮어쓰기 사고 방지)
  // 메모마다 키가 따로라 저장 한 번에 이벤트가 여러 개 온다 → 잠깐 모아서 한 번만 병합
  var extTimer = null;
  function onExternal() {
    extTimer = null;
    var r = store.external();
    if (r.changed) { refreshFromStore(); toastOnce('othertab', L('otherTab')); }
    if (r.conflicts.length) toast(L('conflictToast'));
    if (r.needsWrite && !saveTimer) scheduleSave();
  }
  window.addEventListener('storage', function (e) {
    if (e.storageArea && e.storageArea !== LS) return;
    if (e.key === null || store.owns(e.key)) { // null = 다른 탭에서 저장소 전체를 지움
      clearTimeout(extTimer); extTimer = setTimeout(onExternal, 40);
    } else if (e.key === K_GS) {
      var wasOn = gs.on; loadGs();
      if (wasOn && !gs.on) { gs.token = null; gs.tokenExp = 0; clearTimeout(syncTimer); }
      updateSyncUI(); updateStatus();
    }
  });
  window.addEventListener('pagehide', function () { if (saveTimer) saveNow(); });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') { if (saveTimer) saveNow(); }
    else if (gs.on && gs.state !== 'needsAuth' && Date.now() - gs.lastSyncAt > 20000) syncNow();
  });
  window.addEventListener('online', function () { updateStatus(); if (gs.on) syncNow(); });
  window.addEventListener('offline', updateStatus);
  setInterval(function () { updateStatus(); }, 30000);

  /* ===== 시작: 자동 불러오기 ===== */
  loadGs();
  (function pickInitial() {
    var want = lsGet(K_OPEN), n = want && store.get(want);
    if (n && !n.deleted) curId = n.id;
    else { var v = visible()[0]; curId = v ? v.id : null; }
    view = isMobile() ? 'list' : (curId ? 'editor' : 'list');
  })();
  applyLang();
  renderAll(true);
  if (CLIENT_ID) {
    // GIS 를 미리 받아 둔다(클릭 → 팝업이 사용자 제스처 안에서 열리도록). 이전에 연결했으면 조용히 재연결 시도
    loadGis().then(function () { if (gs.on) syncNow(); }, function () { if (gs.on) { gs.state = 'error'; updateStatus(); } });
  }
  // 테스트·디버그용 훅 — 로컬 개발(localhost/127.0.0.1)이거나 ?debug 일 때만. 토큰은 절대 노출하지 않는다(gs 는 사본, token 제외)
  var DEBUG = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || /[?&]debug(=|&|$)/.test(location.search);
  if (DEBUG) {
    window.__memo = {
      store: store,
      gs: function () { return { on: gs.on, state: gs.state, syncing: gs.syncing, dirty: gs.dirty, lastSyncAt: gs.lastSyncAt, fileId: gs.fileId, hasToken: !!gs.token }; },
      state: function () { return { curId: curId, view: view, lang: lang, saveErr: saveErr, failed: store.failed.slice() }; }
    };
  }
})();
