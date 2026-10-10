/* =============================================================================
   memo · sync.js — DOM 과 분리된 병합 + Google Drive(appDataFolder) 동기화 모듈
   - 브라우저: window.MemoSync · Node 테스트(scripts/verify-memo.mjs): vm 컨텍스트의 globalThis.MemoSync
   - 항목(메모 1개) = { id, text, pinned, createdAt, updatedAt, deleted?, conflictOf? }
   - 병합 규칙(3-way · base = 마지막으로 양쪽이 합의한 updatedAt 맵)
       한쪽만 바뀜 → 바뀐 쪽 · 둘 다 바뀜 → updatedAt 큰 쪽(LWW) + 진 쪽은 「충돌 사본」으로 보존
       삭제 = 묘비(tombstone, deleted:true) 로 전파 · 오래된 묘비(TOMBSTONE_TTL)는 정리
       base 에는 있는데 한쪽에서 사라짐 = 그쪽에서 정리(삭제)된 것 → 다른 쪽이 그 뒤로 안 바뀌었으면 함께 제거
   - 데이터 유실 0 원칙: 진 쪽이 삭제가 아닌 실제 내용이면 무조건 사본으로 남긴다.
   ========================================================================== */
(function (root, factory) {
  var m = factory();
  if (typeof module === 'object' && module && module.exports) module.exports = m;
  root.MemoSync = m;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var APP_ID = 'broodev-memo';
  var FORMAT = 1;
  var TOMBSTONE_TTL = 90 * 24 * 3600 * 1000; // 90일 지난 묘비는 정리(정리 뒤에도 base 규칙으로 삭제가 유지됨)
  var DRIVE = 'https://www.googleapis.com/drive/v3/files';
  var UPLOAD = 'https://www.googleapis.com/upload/drive/v3/files';
  var SCOPE = 'https://www.googleapis.com/auth/drive.appdata';
  var FILE_NAME = 'memo-notes.json';

  function num(v, d) { return typeof v === 'number' && isFinite(v) ? v : d; }

  /* 저장·전송용으로 항목을 정규화(알 수 없는 필드 제거, 타입 강제) — 손상된 원격/백업 데이터 방어 */
  function cleanNote(n, now) {
    if (!n || typeof n !== 'object' || typeof n.id !== 'string' || !n.id) return null;
    var t = num(n.updatedAt, now || 0);
    var o = { id: n.id.slice(0, 120), text: typeof n.text === 'string' ? n.text : '', pinned: !!n.pinned, createdAt: num(n.createdAt, t), updatedAt: t };
    if (n.deleted) { o.deleted = true; o.text = ''; o.pinned = false; }
    if (typeof n.conflictOf === 'string' && n.conflictOf) o.conflictOf = n.conflictOf.slice(0, 120);
    return o;
  }

  function sameContent(a, b) {
    return !!a.deleted === !!b.deleted && a.text === b.text && !!a.pinned === !!b.pinned && (a.conflictOf || '') === (b.conflictOf || '');
  }

  /* 둘 다 바뀌었을 때 승자: updatedAt 큰 쪽. 같으면 결정적으로(어느 기기에서 계산해도 같은 결과) 고른다 */
  function pickWinner(a, b) {
    if (a.updatedAt !== b.updatedAt) return a.updatedAt > b.updatedAt ? [a, b] : [b, a];
    if (!!a.deleted !== !!b.deleted) return a.deleted ? [b, a] : [a, b]; // 동시각이면 살아 있는 쪽 우선
    return (a.text > b.text) ? [a, b] : [b, a];
  }

  function conflictCopy(lose, winId) {
    return {
      id: winId + '~c' + lose.updatedAt.toString(36) + (lose.text.length).toString(36), // 결정적 id → 두 기기가 같은 충돌을 계산해도 사본은 하나
      text: lose.text, pinned: false, createdAt: lose.createdAt || lose.updatedAt, updatedAt: lose.updatedAt, conflictOf: winId
    };
  }

  function toMap(arr) {
    var m = Object.create(null);
    (arr || []).forEach(function (n) { if (n && n.id) m[n.id] = n; });
    return m;
  }

  /**
   * 3-way 병합.
   * @param local  배열(이 기기)  @param remote 배열(상대: Drive 파일 · 다른 탭 · 백업)
   * @param base   { id: updatedAt } 마지막 합의 시점. 없거나 빈 객체 = 처음 만남(같은 id 가 다르면 충돌로 취급)
   * @param opts   { now, preferAlive(가져오기: 삭제된 로컬 vs 살아 있는 백업 → 백업 복원),
   *                 keepMissing(탭 간 병합: 한쪽에 없다는 것은 아무 뜻도 없음 — 삭제는 묘비로만 전파. 지연된 읽기로 빠진 메모를 지우지 않게) }
   * @returns { notes, base, conflicts: [{id, copyId}], localChanged, remoteChanged }
   */
  function mergeNotes(local, remote, base, opts) {
    opts = opts || {};
    base = base || {};
    var now = num(opts.now, Date.now());
    var L = toMap(local), R = toMap(remote);
    var ids = Object.keys(L);
    Object.keys(R).forEach(function (id) { if (!(id in L)) ids.push(id); });
    var out = [], conflicts = [], seenCopy = Object.create(null);
    function push(n) { if (!seenCopy[n.id]) { seenCopy[n.id] = 1; out.push(n); } }

    ids.forEach(function (id) {
      var l = L[id], r = R[id], b = base[id];
      var hasB = typeof b === 'number';
      if (l && r) {
        if (sameContent(l, r)) { push(l.updatedAt >= r.updatedAt ? l : r); return; }
        // 「바뀜」 = 합의 시점보다 엄격히 새로움. 새 편집은 항상 이전 판보다 큰 updatedAt 을 받으므로(store._stamp),
        // base 보다 오래된 판은 늦게 도착한 낡은 사본(다른 탭의 지연된 읽기 등)일 뿐 → 이기지 못한다.
        var lCh = !hasB || l.updatedAt > b, rCh = !hasB || r.updatedAt > b;
        if (lCh && !rCh) { push(l); return; }
        if (rCh && !lCh) { push(r); return; }
        if (!lCh && !rCh) { push(l.updatedAt >= r.updatedAt ? l : r); return; } // 둘 다 낡음 → 더 새 쪽
        if (opts.preferAlive && l.deleted && !r.deleted) { var rr = Object.assign({}, r); rr.updatedAt = Math.max(now, l.updatedAt + 1); push(rr); return; }
        var wl = pickWinner(l, r), win = wl[0], lose = wl[1];
        push(win);
        if (!lose.deleted && !(win.text === lose.text && !win.deleted)) {
          var c = conflictCopy(lose, id);
          if (!(c.id in L) && !(c.id in R)) { push(c); conflicts.push({ id: id, copyId: c.id }); }
        }
        return;
      }
      if (l) { // 상대에 없음
        if (opts.keepMissing || !hasB || l.updatedAt > b) push(l); // 새로 만들었거나(합의 전), 상대가 정리한 뒤에도 내가 고쳤으면 유지
        return;                                                    // 아니면: 상대가 삭제·정리한 것 → 함께 제거
      }
      if (opts.keepMissing || !hasB || r.updatedAt > b) push(r);
    });

    // 묘비 정리 — TTL 이 지난 삭제 기록은 버린다(이미 양쪽 base 에 반영돼 다시 살아나지 않음)
    out = out.filter(function (n) { return !(n.deleted && now - n.updatedAt > TOMBSTONE_TTL); });
    // 사본 id 가 L/R 어느 한쪽에 이미 있으면 위에서 원본 루프가 그대로 넣었다(중복 없음)

    var nb = {};
    out.forEach(function (n) { nb[n.id] = n.updatedAt; });
    return { notes: out, base: nb, conflicts: conflicts, localChanged: !sameSet(out, local), remoteChanged: !sameSet(out, remote) };
  }

  function sameSet(a, b) {
    a = a || []; b = b || [];
    if (a.length !== b.length) return false;
    var B = toMap(b);
    for (var i = 0; i < a.length; i++) {
      var x = a[i], y = B[x.id];
      if (!y || y.updatedAt !== x.updatedAt || !sameContent(x, y)) return false;
    }
    return true;
  }

  /* Drive 파일 · 백업 공통 직렬화 */
  function serialize(notes, now, opts) {
    var list = (notes || []).map(function (n) { return cleanNote(n, now); }).filter(Boolean);
    if (opts && opts.alive) list = list.filter(function (n) { return !n.deleted; });
    return JSON.stringify({ app: APP_ID, format: FORMAT, savedAt: new Date(num(now, Date.now())).toISOString(), notes: list });
  }

  function parse(text, now) {
    var o = typeof text === 'string' ? JSON.parse(text) : text;
    var arr = Array.isArray(o) ? o : (o && Array.isArray(o.notes) ? o.notes : null);
    if (!arr) throw new Error('bad-format');
    return arr.map(function (n) { return cleanNote(n, now); }).filter(Boolean);
  }

  /* ===== Google Drive REST v3 (appDataFolder) =====
     deps: { fetch, getToken(force:boolean) → Promise<string> }
     401 이면 토큰을 강제로 다시 받아 1회 재시도. 그 밖의 실패는 err.status 를 달아 던진다. */
  function createDrive(deps) {
    var f = deps.fetch, getToken = deps.getToken;
    function fail(status, msg) { var e = new Error(msg || ('http ' + status)); e.status = status; return e; }
    function call(url, init, retried) {
      return Promise.resolve(getToken(!!retried)).then(function (tok) {
        var h = Object.assign({}, (init && init.headers) || {}, { Authorization: 'Bearer ' + tok });
        return f(url, Object.assign({}, init || {}, { headers: h }));
      }).then(function (res) {
        if (res.status === 401 && !retried) return call(url, init, true);
        if (!res.ok) throw fail(res.status);
        return res;
      });
    }
    /* 같은 이름의 파일 전부 — 오래된 것부터(createdTime → id 로 결정적 정렬: 모든 기기가 같은 「기준 파일」을 고른다) */
    function list(name) {
      var q = encodeURIComponent("name='" + name.replace(/'/g, "\\'") + "' and trashed=false");
      return call(DRIVE + '?spaces=appDataFolder&q=' + q + '&orderBy=createdTime&fields=files(id,name,createdTime,modifiedTime)&pageSize=100')
        .then(function (r) { return r.json(); })
        .then(function (j) {
          var fs = ((j && j.files) || []).slice();
          fs.sort(function (a, b) {
            var ta = Date.parse(a.createdTime || '') || 0, tb = Date.parse(b.createdTime || '') || 0;
            return ta !== tb ? ta - tb : (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
          });
          return fs;
        });
    }
    return {
      list: list,
      find: function (name) { return list(name).then(function (fs) { return fs.length ? fs[0] : null; }); },
      remove: function (id) {
        return call(DRIVE + '/' + encodeURIComponent(id), { method: 'DELETE' }).then(function () { return true; }, function (e) {
          if (e && e.status === 404) return true; // 이미 지워짐(다른 기기가 먼저 정리)
          throw e;
        });
      },
      download: function (id) { return call(DRIVE + '/' + encodeURIComponent(id) + '?alt=media').then(function (r) { return r.text(); }); },
      create: function (name, body) {
        var bd = 'memo' + Math.random().toString(36).slice(2);
        var meta = JSON.stringify({ name: name, parents: ['appDataFolder'], mimeType: 'application/json' });
        var payload = '--' + bd + '\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n' + meta + '\r\n--' + bd + '\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n' + body + '\r\n--' + bd + '--';
        return call(UPLOAD + '?uploadType=multipart&fields=id,name', { method: 'POST', headers: { 'Content-Type': 'multipart/related; boundary=' + bd }, body: payload })
          .then(function (r) { return r.json(); });
      },
      update: function (id, body) {
        return call(UPLOAD + '/' + encodeURIComponent(id) + '?uploadType=media&fields=id', { method: 'PATCH', headers: { 'Content-Type': 'application/json; charset=UTF-8' }, body: body })
          .then(function (r) { return r.json(); });
      }
    };
  }

  /**
   * 한 번의 동기화: (파일 찾기/만들기) → 내려받기 → 병합 → 달라졌으면 올리기.
   * 두 기기가 동시에 처음 연결하면 둘 다 「파일 없음」을 보고 각자 만들 수 있다 → 만든 직후 다시 목록을 보고,
   * 같은 이름의 파일이 여럿이면 가장 오래된 파일(모든 기기가 같은 것을 고름)에 나머지 내용을 합친 뒤 나머지를 지운다.
   * @param o { drive, local, base, fileId?, fileName?, now }
   * @returns { notes, base, conflicts, uploaded, fileId, merged(합쳐 지운 중복 파일 수) }
   */
  function syncOnce(o) {
    var drive = o.drive, name = o.fileName || FILE_NAME, now = num(o.now, Date.now());
    var cached = o.fileId || null;
    function read(id) { // → { id, remote, valid } · 404 → null
      return drive.download(id).then(function (txt) {
        var remote = [], valid = false;
        try { if (txt && txt.trim()) { remote = parse(txt, now); valid = true; } } catch (e) { remote = []; } // 깨진 파일 → 로컬로 다시 쓴다
        return { id: id, remote: remote, valid: valid };
      }, function (e) { if (e && e.status === 404) return null; throw e; });
    }
    /* 목록의 파일들 → 기준 파일(가장 오래된 것) 하나의 내용으로. 나머지 내용은 합쳐 두고(extra), 업로드가 끝난 뒤 지운다 */
    function pullAll(files) {
      if (!files.length) return Promise.resolve({ id: null, remote: [], valid: false, extra: [] });
      return Promise.all(files.map(function (f) { return read(f.id); })).then(function (rs) {
        var main = null, extra = [], remote = [];
        rs.forEach(function (r, i) {
          if (!r) return; // 그사이 다른 기기가 지움
          if (!main) { main = r; remote = r.remote; return; }
          extra.push(files[i].id);
          // 중복 파일끼리는 공통 기준이 없다 → 「없음 = 삭제」로 보지 않고(keepMissing) 같은 id 가 다르면 사본으로 보존
          remote = mergeNotes(remote, r.remote, {}, { now: now, keepMissing: true }).notes;
        });
        if (!main) return { id: null, remote: [], valid: false, extra: [] };
        return { id: main.id, remote: remote, valid: main.valid || extra.length > 0, extra: extra };
      });
    }
    function locate() { return drive.list(name).then(pullAll); }
    var start = cached
      ? read(cached).then(function (r) { return r ? { id: r.id, remote: r.remote, valid: r.valid, extra: [] } : locate(); }) // 캐시된 파일이 사라짐 → 다시 찾기
      : locate();
    return start.then(function (p) {
      // ⚠ 원격 파일이 없거나(사용자가 앱 데이터를 지움) 깨졌거나, 지난번과 다른 파일이면(중복 정리 · 재생성) base 를 버린다 —
      //   「원격에서 사라짐 = 삭제」 규칙이 로컬 메모를 지우는 일이 없도록. 이때 로컬 전부가 새 항목으로 올라간다(데이터 유실 0).
      var sameFile = p.valid && !!cached && p.id === cached && !p.extra.length;
      var m = mergeNotes(o.local || [], p.remote, sameFile ? (o.base || {}) : {}, { now: now });
      var body = serialize(m.notes, now);
      var created = false, up;
      if (!p.id) { created = true; up = drive.create(name, body).then(function (j) { return j.id; }); }
      else if (m.remoteChanged || !p.valid || p.extra.length) up = drive.update(p.id, body).then(function () { return p.id; });
      else up = Promise.resolve(p.id);
      return up.then(function (id) {
        var res = { notes: m.notes, base: m.base, conflicts: m.conflicts, uploaded: !p.id || !p.valid || m.remoteChanged || p.extra.length > 0, fileId: id, merged: 0 };
        var cleanup = p.extra.length
          ? Promise.all(p.extra.map(function (x) { return drive.remove(x); })).then(function () { res.merged = p.extra.length; })
          : Promise.resolve();
        return cleanup.then(function () {
          if (!created) return res;
          // 방금 만들었다 → 다른 기기도 동시에 만들었는지 확인. 여럿이면 한 번 더 돌아 기준 파일로 합친다
          return drive.list(name).then(function (fs) {
            if (fs.length < 2) return res;
            return syncOnce({ drive: drive, local: m.notes, base: {}, fileId: null, fileName: name, now: now }).then(function (r2) {
              // 두 번째 결과의 conflicts 에 첫 결과의 것을 더한다(화면 안내용)
              r2.conflicts = m.conflicts.concat(r2.conflicts); r2.uploaded = true;
              return r2;
            });
          });
        });
      });
    });
  }

  return {
    APP_ID: APP_ID, FORMAT: FORMAT, SCOPE: SCOPE, FILE_NAME: FILE_NAME, TOMBSTONE_TTL: TOMBSTONE_TTL,
    cleanNote: cleanNote, mergeNotes: mergeNotes, sameSet: sameSet, serialize: serialize, parse: parse,
    createDrive: createDrive, syncOnce: syncOnce
  };
});
