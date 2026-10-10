/* SHEET — Google Drive appDataFolder 동기화 (DOM 과 분리된 순수 모듈)
   - 병합: 통합문서 1개 = 항목 1개 {id, name, sheets, updatedAt, deleted?}. 항목별 최신 updatedAt 우선(LWW).
     삭제는 묘비로 전파. 마지막 동기화 이후 두 기기가 같은 항목을 함께 고쳤으면 진 쪽을 「(충돌 사본)」 새 항목으로 보존(유실 0).
     삭제 vs 수정 충돌은 수정이 이긴다(되살림) — 지워도 되는 데이터를 지우는 쪽보다 남기는 쪽이 안전.
   - 엔진: 토큰 → appDataFolder 에서 파일 찾기/만들기 → 내려받기 → 병합 → 로컬 반영 → (필요하면) 올리기 → 기준점(base) 저장.
     401 이면 토큰을 새로 받아 1회 재시도. 네트워크/서버 오류는 로컬 저장을 막지 않고 「동기화 대기 중」으로 두고 재시도.
   브라우저(window.SheetSync)와 Node 검증(vm + 가짜 fetch) 양쪽에서 쓴다. */
(function (root) {
  'use strict';

  var DRIVE_FILES = 'https://www.googleapis.com/drive/v3/files';
  var DRIVE_UPLOAD = 'https://www.googleapis.com/upload/drive/v3/files';
  var SCOPE = 'https://www.googleapis.com/auth/drive.appdata';
  var FILE_APP = 'broodev-sheet';

  var clone = function (v) { return v === undefined ? undefined : JSON.parse(JSON.stringify(v)); };
  var ts = function (r) { return (r && +r.updatedAt) || 0; };
  var content = function (r) { return JSON.stringify([r.name || '', r.sheets || null, !!r.deleted, r.conflictOf || null]); };
  var same = function (a, b) { return content(a) === content(b); };
  // 결정적 승자 선택 — 두 기기가 따로 병합해도 같은 결과가 나와야 한다
  var newer = function (a, b) {
    if (ts(a) !== ts(b)) return ts(a) > ts(b) ? a : b;
    return content(a) >= content(b) ? a : b;
  };
  var copyIdFor = function (id, loser) { return id + '~c' + ts(loser).toString(36); };

  /**
   * @param {Object<string,Object>} local   이 기기의 레코드 (묘비 포함)
   * @param {Object<string,Object>} remote  Drive 파일의 레코드
   * @param {Object<string,number>} base    마지막으로 성공한 동기화 때 각 항목의 updatedAt
   * @param {{conflictName?:(name:string)=>string}} [opts]
   * @returns {{merged:Object, toLocal:Object[], remoteDirty:boolean, conflicts:{id:string,copyId:string}[], base:Object}}
   */
  function mergeRecords(local, remote, base, opts) {
    local = local || {}; remote = remote || {}; base = base || {}; opts = opts || {};
    var conflictName = opts.conflictName || function (n) { return n + ' (conflict copy)'; };
    var merged = {}, toLocal = [], conflicts = [];
    var remoteDirty = false;
    var ids = Object.keys(local).concat(Object.keys(remote).filter(function (k) { return !(k in local); }));

    ids.forEach(function (id) {
      var L = local[id], R = remote[id];
      if (L && !R) { merged[id] = L; remoteDirty = true; return; }
      if (R && !L) { merged[id] = R; toLocal.push(R); return; }
      if (ts(L) === ts(R) && same(L, R)) { merged[id] = L; return; }
      if (same(L, R)) {                       // 내용은 같고 시각만 다름 → 늦은 쪽으로 맞춘다
        var w0 = newer(L, R); merged[id] = w0;
        if (w0 === L) remoteDirty = true; else toLocal.push(R);
        return;
      }
      var b = base[id];
      // 「바뀜」 = 기준점보다 엄격히 새로움. 편집은 항상 이전보다 큰 updatedAt 을 받으므로(store.stamp),
      // 기준점보다 오래된 판은 다른 기기가 늦게 올린 낡은 사본일 뿐 → 새 판을 이기지 못한다(덮어쓰기 사고 방지).
      var lChanged = b === undefined || ts(L) > b;
      var rChanged = b === undefined || ts(R) > b;
      if (!lChanged && !rChanged) {          // 둘 다 기준점 이하(한쪽이 낡은 사본) → 더 새 쪽으로 맞춘다
        var w2 = newer(L, R); merged[id] = w2;
        if (w2 === L) remoteDirty = true; else toLocal.push(R);
        return;
      }
      if (!rChanged) { merged[id] = L; remoteDirty = true; return; }
      if (!lChanged) { merged[id] = R; toLocal.push(R); return; }

      // ---- 양쪽 모두 바뀜
      if (L.deleted && R.deleted) {
        var w1 = newer(L, R); merged[id] = w1;
        if (w1 === L) remoteDirty = true; else toLocal.push(R);
        return;
      }
      if (L.deleted || R.deleted) {           // 삭제 vs 수정 → 수정을 살린다
        var live = clone(L.deleted ? R : L);
        live.updatedAt = Math.max(ts(L), ts(R)) + 1;
        merged[id] = live; toLocal.push(live); remoteDirty = true;
        return;
      }
      var win = newer(L, R), lose = win === L ? R : L;
      merged[id] = win;
      if (win === L) remoteDirty = true; else toLocal.push(R);
      var cid = copyIdFor(id, lose);
      if (!local[cid] && !remote[cid] && !merged[cid]) {
        var copy = clone(lose);
        copy.id = cid;
        copy.name = conflictName(lose.name || '');
        copy.conflictOf = id;
        copy.createdAt = ts(lose);
        copy.updatedAt = ts(win);
        merged[cid] = copy; toLocal.push(copy); remoteDirty = true;
        conflicts.push({ id: id, copyId: cid });
      }
    });

    var newBase = {};
    Object.keys(merged).forEach(function (id) { newBase[id] = ts(merged[id]); });
    return { merged: merged, toLocal: toLocal, remoteDirty: remoteDirty, conflicts: conflicts, base: newBase };
  }

  function SyncError(code, message, status) {
    var e = new Error(message || code);
    e.name = 'SyncError'; e.code = code; e.status = status || 0;
    return e;
  }

  /**
   * @param {Object} o
   *   fetch(url, init)          — window.fetch 또는 테스트용 가짜
   *   getToken({refresh})       — 액세스 토큰(메모리 보관). refresh=true 면 새로 받기. 실패 시 throw(code 'auth')
   *   load()                    — {items:{id:rec}, base:{id:updatedAt}}
   *   apply(records, merge, ctx) — 병합 결과 중 로컬에 써야 할 레코드. ctx.expect = {id: load() 때의 updatedAt | null}.
   *                               그사이 로컬에서 바뀐 레코드는 쓰지 말고 {skipped:[id]} 로 알려 준다(다음 동기화에서 다시 병합)
   *   saveBase(base)            — 성공한 동기화의 기준점 저장
   *   conflictName(name)        — 충돌 사본 이름
   *   beforeSync()              — (선택) 시작 전 로컬 저장 비우기
   *   onStatus(status)          — {state:'syncing'|'synced'|'pending'|'offline'|'auth', at, ...}
   *   isOnline()                — (선택) navigator.onLine
   *   fileName, debounceMs, retryBaseMs, verifyMs, setTimeout, clearTimeout
   *  Drive v3 에는 파일 ETag/If-Match 가 없어서 동시 쓰기를 이렇게 막는다:
   *   (1) 올리기 직전에 파일 version 이 내려받을 때와 같은지 확인 — 다르면 다시 내려받아 병합 후 재시도(412 도 같은 처리)
   *   (2) 병합은 「기준점보다 새로운 쪽만 바뀐 것」으로 보므로, 누가 낡은 사본으로 덮어써도 새 판을 가진 기기가 다시 올려 복구
   *   (3) 올린 뒤 verifyMs 후 version 을 한 번 더 확인 — 그사이 다른 기기가 덮어썼으면 바로 다시 동기화(복구를 기다리지 않음)
   *   (4) 같은 이름의 파일이 둘 이상 생기면(두 기기가 동시에 처음 연결) 가장 오래된 파일로 합치고 나머지는 지운다
   */
  function createSyncEngine(o) {
    var f = o.fetch;
    var fileName = o.fileName || 'sheet-workbooks.json';
    var debounceMs = o.debounceMs == null ? 3000 : o.debounceMs;
    var retryBase = o.retryBaseMs == null ? 5000 : o.retryBaseMs;
    var setT = o.setTimeout || function (fn, ms) { return setTimeout(fn, ms); };
    var clearT = o.clearTimeout || function (h) { clearTimeout(h); };
    var verifyMs = o.verifyMs == null ? 20000 : o.verifyMs;
    var fileId = null, timer = null, vTimer = null, running = null, again = false, stopped = false, retryMs = 0;
    var lastWrite = null;     // {id, version} — 이 기기가 마지막으로 올린 판
    var status = { state: 'idle', at: 0 };
    var stats = { tokenRequests: 0, retries401: 0, uploads: 0, downloads: 0, staleRetries: 0, dedupes: 0, verifies: 0 };

    function setStatus(s) { status = Object.assign({ at: Date.now() }, s); if (o.onStatus) o.onStatus(status); }

    function token(refresh) {
      stats.tokenRequests++;
      return Promise.resolve().then(function () { return o.getToken({ refresh: !!refresh }); }).then(function (tok) {
        if (!tok) throw SyncError('auth', 'no token');
        return tok;
      }, function (err) { throw SyncError('auth', (err && (err.code || err.message)) || 'token'); });
    }

    function authed(url, init, attempt) {
      init = init || {};
      return token(attempt > 0).then(function (tok) {
        var headers = Object.assign({}, init.headers || {}, { Authorization: 'Bearer ' + tok });
        return Promise.resolve().then(function () { return f(url, Object.assign({}, init, { headers: headers })); })
          .catch(function (e) { throw SyncError('network', (e && e.message) || 'network'); });
      }).then(function (res) {
        if (res.status === 401 && !attempt) { stats.retries401++; return authed(url, init, 1); }
        if (res.status === 401) throw SyncError('auth', 'unauthorized', 401);
        return res;
      });
    }
    function httpErr(res) { return SyncError('http', 'HTTP ' + res.status, res.status); }
    var ver = function (v) { return v == null ? null : String(v); };

    /** 같은 이름의 파일 전부(가장 오래된 것이 먼저) — 매번 다시 확인한다(다른 기기가 만든 중복을 놓치지 않게) */
    function listFiles() {
      var q = encodeURIComponent("name='" + fileName.replace(/'/g, "\\'") + "' and trashed=false");
      return authed(DRIVE_FILES + '?spaces=appDataFolder&q=' + q + '&fields=files(id,name,createdTime,version)&orderBy=createdTime&pageSize=20').then(function (res) {
        if (!res.ok) throw httpErr(res);
        return res.json();
      }).then(function (js) {
        var files = ((js && js.files) || []).map(function (x, i) { return { id: x.id, createdTime: x.createdTime || '', version: ver(x.version), i: i }; });
        // createdTime → 서버 순서로 결정적 정렬(두 기기가 같은 파일을 「주 파일」로 고른다)
        files.sort(function (a, b) { return a.createdTime && b.createdTime && a.createdTime !== b.createdTime ? (a.createdTime < b.createdTime ? -1 : 1) : a.i - b.i; });
        fileId = files.length ? files[0].id : null;
        return files;
      });
    }
    function getVersion(id) {
      return authed(DRIVE_FILES + '/' + encodeURIComponent(id) + '?fields=id,version').then(function (res) {
        if (res.status === 404) return { gone: true };
        if (!res.ok) throw httpErr(res);
        return res.json().then(function (js) { return { version: ver(js && js.version) }; });
      });
    }
    function download(id) {
      stats.downloads++;
      return authed(DRIVE_FILES + '/' + encodeURIComponent(id) + '?alt=media').then(function (res) {
        if (res.status === 404) return null;
        if (!res.ok) throw httpErr(res);
        return res.text();
      }).then(function (txt) {
        if (txt == null) return null;
        if (!txt) return { items: {} };
        try { var js = JSON.parse(txt); return { items: (js && js.items && typeof js.items === 'object') ? js.items : {} }; }
        catch (e) { return { items: {} }; }   // 손상된 파일 — 로컬을 그대로 올려 복구한다
      });
    }
    function serialize(items) { return JSON.stringify({ app: FILE_APP, v: 1, savedAt: new Date().toISOString(), items: items }); }
    function create(body) {
      stats.uploads++;
      var boundary = 'sheet' + Math.random().toString(36).slice(2);
      var meta = JSON.stringify({ name: fileName, parents: ['appDataFolder'], mimeType: 'application/json' });
      var payload = '--' + boundary + '\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n' + meta + '\r\n--' + boundary +
        '\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n' + body + '\r\n--' + boundary + '--';
      return authed(DRIVE_UPLOAD + '?uploadType=multipart&fields=id,version', { method: 'POST', headers: { 'Content-Type': 'multipart/related; boundary=' + boundary }, body: payload }).then(function (res) {
        if (!res.ok) throw httpErr(res);
        return res.json();
      }).then(function (js) { fileId = js.id; return { id: js.id, version: ver(js.version) }; });
    }
    /** @returns {Promise<{id, version}|'stale'>} */
    function update(id, body) {
      stats.uploads++;
      return authed(DRIVE_UPLOAD + '/' + encodeURIComponent(id) + '?uploadType=media&fields=id,version', { method: 'PATCH', headers: { 'Content-Type': 'application/json; charset=UTF-8' }, body: body }).then(function (res) {
        if (res.status === 404) { fileId = null; return create(body); }
        if (res.status === 412) return 'stale';
        if (!res.ok) throw httpErr(res);
        return Promise.resolve().then(function () { return res.json(); }).catch(function () { return null; })
          .then(function (js) { return { id: id, version: ver(js && js.version) }; });
      });
    }
    function removeFile(id) {
      // 실패해도 괜찮다 — 다음 동기화에서 다시 합치고 지운다
      return authed(DRIVE_FILES + '/' + encodeURIComponent(id), { method: 'DELETE' }).then(function () {}, function () {});
    }

    function run() {
      var tries = 0;
      return Promise.resolve(o.beforeSync ? o.beforeSync() : null).then(function () {
        setStatus({ state: 'syncing' });
        return pass();
      });

      function pass() {
        var local, primary = null, dups = [], remote = null, m, skipped = [];
        return Promise.resolve(o.load()).then(function (l) {
          local = l || { items: {}, base: {} };
          local.items = local.items || {};
          local.base = local.base || {};
          return listFiles();
        }).then(function (files) {
          return Promise.all(files.map(function (fl) { return download(fl.id).then(function (d) { return { file: fl, data: d }; }); }));
        }).then(function (got) {
          got.forEach(function (g) {
            if (!g.data) return;                                 // 그사이 지워진 파일
            if (!primary) { primary = g.file; remote = g.data.items; return; }
            dups.push(g.file);                                   // 중복 파일 → 주 파일로 합친다(유실 0)
            remote = mergeRecords(remote, g.data.items, {}, { conflictName: o.conflictName }).merged;
          });
          fileId = primary ? primary.id : null;
          if (dups.length) stats.dedupes++;
          m = mergeRecords(local.items, remote || {}, local.base, { conflictName: o.conflictName });
          // 동기화가 읽어 간 시점의 로컬 판 — 그사이 이 기기에서 저장된 항목은 apply 가 덮어쓰지 않는다
          var expect = {};
          m.toLocal.forEach(function (r) { var cur = local.items[r.id]; expect[r.id] = cur ? ts(cur) : null; });
          return m.toLocal.length ? o.apply(m.toLocal, m, { expect: expect }) : null;
        }).then(function (res) {
          skipped = (res && res.skipped) || [];
          if (!m.remoteDirty && primary && !dups.length) return null;
          var body = serialize(m.merged);
          if (!primary) return create(body);
          var pre = primary.version == null ? Promise.resolve({ version: null }) : getVersion(primary.id);
          return pre.then(function (v) {
            if (v.gone) { fileId = null; return create(body); }
            if (v.version !== primary.version) return 'stale';   // 내려받은 뒤 다른 기기가 올림 → 다시 받아 병합
            return update(primary.id, body).then(function (w) {
              // 확인과 쓰기 사이에 다른 쓰기가 끼어들었으면 곧 다시 맞춘다
              if (w !== 'stale' && w && w.version != null && primary.version != null && +w.version > +primary.version + 1) again = true;
              return w;
            });
          });
        }).then(function (w) {
          if (w === 'stale') {
            stats.staleRetries++;
            if (++tries > 4) throw SyncError('http', 'remote file keeps changing', 412);
            // 원격에서 그대로 받아 쓴 레코드만 기준점에 넣고 처음부터 다시
            var pb = Object.assign({}, local.base);
            m.toLocal.forEach(function (r) { if (skipped.indexOf(r.id) < 0 && remote && remote[r.id] === r) pb[r.id] = ts(r); });
            return Promise.resolve(o.saveBase ? o.saveBase(pb) : null).then(pass);
          }
          if (w && w.id) { lastWrite = { id: w.id, version: w.version }; scheduleVerify(); }
          var nb = m.base;
          // 건너뛴 항목은 기준점을 옮기지 않는다 → 다음 병합에서 「양쪽 모두 바뀜」으로 보고 진 쪽을 사본으로 남긴다
          skipped.forEach(function (id) { if (Object.prototype.hasOwnProperty.call(local.base, id)) nb[id] = local.base[id]; else delete nb[id]; });
          if (skipped.length) again = true;
          return Promise.all(dups.map(function (d) { return removeFile(d.id); })).then(function () {
            return o.saveBase ? o.saveBase(nb) : null;
          }).then(function () {
            retryMs = 0;
            setStatus({ state: 'synced', conflicts: m.conflicts.length, pulled: m.toLocal.length - skipped.length, pushed: !!w });
            return { ok: true, merge: m, skipped: skipped };
          });
        });
      }
    }

    /** 올린 뒤 한 번 더: 그사이 다른 기기가 파일을 덮어썼으면(낡은 사본일 수도 있다) 바로 다시 동기화 */
    function verify() {
      vTimer = null;
      if (stopped || !lastWrite || lastWrite.version == null) return Promise.resolve(false);
      if (running) return Promise.resolve(false);
      stats.verifies++;
      var lw = lastWrite;
      return getVersion(lw.id).then(function (v) {
        if (lastWrite !== lw) return false;
        if (v.gone || v.version !== lw.version) { lastWrite = null; return syncNow().then(function () { return true; }); }
        return false;
      }, function () { return false; });
    }
    function scheduleVerify() {
      if (stopped || !verifyMs) return;
      if (vTimer) clearT(vTimer);
      vTimer = setT(verify, verifyMs);
    }

    function onError(err) {
      var code = (err && err.code) || 'error';
      if (code === 'auth') {
        setStatus({ state: 'auth', error: err.message });
      } else {
        var online = o.isOnline ? o.isOnline() : true;
        setStatus({ state: online ? 'pending' : 'offline', error: err && err.message });
        retryMs = Math.min(retryMs ? retryMs * 2 : retryBase, 60000);
        schedule(retryMs);
      }
      return { ok: false, error: err, code: code };
    }

    function syncNow() {
      if (stopped) return Promise.resolve({ ok: false, code: 'stopped' });
      if (timer) { clearT(timer); timer = null; }
      if (running) { again = true; return running; }
      running = run().catch(onError).then(function (r) {
        running = null;
        if (again && !stopped) { again = false; schedule(Math.min(debounceMs, 1000)); }
        return r;
      });
      return running;
    }
    function schedule(ms) {
      if (stopped) return;
      if (timer) clearT(timer);
      timer = setT(function () { timer = null; syncNow(); }, ms == null ? debounceMs : ms);
    }
    return {
      syncNow: syncNow,
      schedule: schedule,
      verify: verify,
      stop: function () { stopped = true; if (timer) { clearT(timer); timer = null; } if (vTimer) { clearT(vTimer); vTimer = null; } },
      start: function () { stopped = false; },
      get status() { return status; },
      get fileId() { return fileId; },
      get running() { return !!running; },
      stats: stats,
      resetFile: function () { fileId = null; }
    };
  }

  root.SheetSync = { mergeRecords: mergeRecords, createSyncEngine: createSyncEngine, SyncError: SyncError, SCOPE: SCOPE, DRIVE_FILES: DRIVE_FILES, DRIVE_UPLOAD: DRIVE_UPLOAD, FILE_APP: FILE_APP };
})(typeof globalThis !== 'undefined' ? globalThis : this);
