/* SHEET — 로컬 저장소 (IndexedDB 작은 래퍼 + 메모리 백엔드)
   통합문서 레코드: { id, name, sheets:[x-spreadsheet 시트 데이터], createdAt, updatedAt, conflictOf? }
   삭제 = 묘비(tombstone) { id, deleted:true, updatedAt } — 동기화로 다른 기기에 삭제를 전파하기 위해 지우지 않고 남긴다.
   updatedAt 은 같은 id 안에서 항상 단조 증가(LWW 병합의 기준).
   DOM 에 의존하지 않음 — 브라우저(window.SheetStore)와 Node 검증(vm, memoryBackend) 양쪽에서 쓴다. */
(function (root) {
  'use strict';

  var BOOKS = 'books', META = 'meta';
  var clone = function (v) { return v === undefined ? undefined : JSON.parse(JSON.stringify(v)); };

  function defaultId() {
    try { if (root.crypto && root.crypto.randomUUID) return 'b' + root.crypto.randomUUID().replace(/-/g, '').slice(0, 20); } catch (e) { /* ignore */ }
    return 'b' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }

  function casOk(cur, expect, id) {
    if (!expect || !Object.prototype.hasOwnProperty.call(expect, id) || expect[id] === undefined) return true;
    var want = expect[id];
    if (want === null) return !cur;
    return !!cur && (+cur.updatedAt || 0) === want;
  }

  // ---------- 백엔드: 메모리 (테스트 · IndexedDB 를 못 쓰는 브라우저의 비상용)
  function memoryBackend() {
    var d = { books: new Map(), meta: new Map() };
    return {
      kind: 'memory',
      getAll: function (s) { return Promise.resolve(Array.from(d[s].values()).map(clone)); },
      get: function (s, k) { return Promise.resolve(clone(d[s].get(k))); },
      put: function (s, k, v) { d[s].set(k, clone(v)); return Promise.resolve(); },
      putMany: function (s, pairs) { pairs.forEach(function (p) { d[s].set(p[0], clone(p[1])); }); return Promise.resolve(); },
      /** 읽고 고쳐 쓰기를 한 번에(IndexedDB 에서는 같은 트랜잭션) — fn(prev) 가 undefined 를 돌려주면 쓰지 않는다 */
      update: function (s, k, fn) {
        try { var nv = fn(clone(d[s].get(k))); if (nv !== undefined) d[s].set(k, clone(nv)); return Promise.resolve(clone(nv)); }
        catch (e) { return Promise.reject(e); }
      },
      /** 조건부 일괄 쓰기 — expect[id] 와 지금 레코드의 updatedAt 이 같을 때만(null = 없어야 함). 건너뛴 id 목록을 돌려준다 */
      putIf: function (s, pairs, expect) {
        var skipped = [];
        pairs.forEach(function (p) { if (casOk(d[s].get(p[0]), expect, p[0])) d[s].set(p[0], clone(p[1])); else skipped.push(p[0]); });
        return Promise.resolve(skipped);
      },
      del: function (s, k) { d[s].delete(k); return Promise.resolve(); }
    };
  }

  // ---------- 백엔드: IndexedDB
  function idbBackend(name) {
    return new Promise(function (resolve, reject) {
      if (!root.indexedDB) { reject(new Error('indexedDB unavailable')); return; }
      var req;
      try { req = root.indexedDB.open(name || 'broodev-excel', 1); } catch (e) { reject(e); return; }
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains(BOOKS)) db.createObjectStore(BOOKS);
        if (!db.objectStoreNames.contains(META)) db.createObjectStore(META);
      };
      req.onblocked = function () { reject(new Error('indexedDB blocked')); };
      req.onerror = function () { reject(req.error || new Error('indexedDB open failed')); };
      req.onsuccess = function () {
        var db = req.result;
        db.onversionchange = function () { try { db.close(); } catch (e) { /* ignore */ } };
        var tx = function (store, mode, body) {
          return new Promise(function (res, rej) {
            var out;
            var t = db.transaction(store, mode);
            var st = t.objectStore(store);
            body(st, function (v) { out = v; }, t);
            t.oncomplete = function () { res(out); };
            t.onerror = function () { rej(t.error); };
            t.onabort = function () { rej(t.error || (out instanceof Error ? out : new Error('transaction aborted'))); };
          });
        };
        resolve({
          kind: 'idb',
          getAll: function (s) { return tx(s, 'readonly', function (st, set) { var r = st.getAll(); r.onsuccess = function () { set(r.result || []); }; }); },
          get: function (s, k) { return tx(s, 'readonly', function (st, set) { var r = st.get(k); r.onsuccess = function () { set(r.result); }; }); },
          put: function (s, k, v) { return tx(s, 'readwrite', function (st) { st.put(v, k); }); },
          putMany: function (s, pairs) { return tx(s, 'readwrite', function (st) { pairs.forEach(function (p) { st.put(p[1], p[0]); }); }); },
          // get → put 을 한 트랜잭션 안에서(페이지를 떠나는 순간에도 쓰기가 이미 예약된 상태가 되도록 비동기 단계를 줄인다)
          update: function (s, k, fn) {
            return tx(s, 'readwrite', function (st, set, t) {
              var r = st.get(k);
              r.onsuccess = function () {
                var nv;
                try { nv = fn(r.result); } catch (e) { set(e); try { t.abort(); } catch (er) { /* ignore */ } return; }
                try { if (nv !== undefined) st.put(nv, k); } catch (e2) { set(e2); try { t.abort(); } catch (er) { /* ignore */ } return; }   // QuotaExceededError 등 원래 오류를 그대로
                set(nv);
              };
            });
          },
          putIf: function (s, pairs, expect) {
            return tx(s, 'readwrite', function (st, set) {
              var skipped = []; set(skipped);
              pairs.forEach(function (p) {
                var r = st.get(p[0]);
                r.onsuccess = function () { if (casOk(r.result, expect, p[0])) st.put(p[1], p[0]); else skipped.push(p[0]); };
              });
            });
          },
          del: function (s, k) { return tx(s, 'readwrite', function (st) { st.delete(k); }); }
        });
      };
    });
  }

  // ---------- 저장소 API
  function createStore(backend, opts) {
    opts = opts || {};
    var now = opts.now || function () { return Date.now(); };
    var newId = opts.newId || defaultId;
    var stamp = function (prev) { return Math.max(now(), (prev || 0) + 1); };

    var api = {
      backend: backend,
      newId: newId,
      /** 묘비 포함 전체 레코드 (동기화용) */
      allRecords: function () { return backend.getAll(BOOKS); },
      allRecordsMap: function () {
        return backend.getAll(BOOKS).then(function (list) { var m = {}; list.forEach(function (r) { if (r && r.id) m[r.id] = r; }); return m; });
      },
      /** 살아 있는 통합문서 목록 — 최근 수정 순 */
      listBooks: function () {
        return backend.getAll(BOOKS).then(function (list) {
          return list.filter(function (r) { return r && !r.deleted; }).sort(function (a, b) { return (b.updatedAt || 0) - (a.updatedAt || 0); });
        });
      },
      getRecord: function (id) { return backend.get(BOOKS, id); },
      getBook: function (id) { return backend.get(BOOKS, id).then(function (r) { return r && !r.deleted ? r : null; }); },
      createBook: function (book) {
        var t0 = now();
        var rec = { id: book.id || newId(), name: String(book.name || ''), sheets: clone(book.sheets || []), createdAt: book.createdAt || t0, updatedAt: stamp(book.updatedAt || 0) };
        if (book.conflictOf) rec.conflictOf = book.conflictOf;
        return backend.put(BOOKS, rec.id, rec).then(function () { return rec; });
      },
      /** 내용 저장 — updatedAt 을 기존 값보다 반드시 크게 */
      saveBook: function (book) {
        var sheets = clone(book.sheets || []);
        return backend.update(BOOKS, book.id, function (prev) {
          var rec = {
            id: book.id,
            name: String(book.name || ''),
            sheets: sheets,
            createdAt: book.createdAt || (prev && prev.createdAt) || now(),
            updatedAt: stamp(Math.max(prev ? prev.updatedAt || 0 : 0, book.updatedAt || 0))
          };
          var conflictOf = book.conflictOf || (prev && !prev.deleted && prev.conflictOf);
          if (conflictOf) rec.conflictOf = conflictOf;
          return rec;
        });
      },
      renameBook: function (id, name) {
        return backend.update(BOOKS, id, function (prev) {
          if (!prev || prev.deleted) return undefined;
          prev.name = String(name || '');
          prev.updatedAt = stamp(prev.updatedAt);
          return prev;
        }).then(function (r) { return r || null; });
      },
      /** 삭제 → 묘비로 교체 */
      deleteBook: function (id) {
        return backend.update(BOOKS, id, function (prev) { return { id: id, deleted: true, updatedAt: stamp(prev ? prev.updatedAt : 0) }; });
      },
      /** 동기화 병합 결과를 그대로 기록(updatedAt 을 건드리지 않는다).
       *  expect({id: updatedAt|null}) 를 주면 동기화가 읽어 간 뒤에 이 기기에서 바뀐 레코드는 덮어쓰지 않고 건너뛴다 → {skipped:[id]} */
      putRecords: function (records, expect) {
        if (!records || !records.length) return Promise.resolve({ skipped: [] });
        var pairs = records.map(function (r) { return [r.id, r]; });
        if (expect) return backend.putIf(BOOKS, pairs, expect).then(function (sk) { return { skipped: sk || [] }; });
        return backend.putMany(BOOKS, pairs).then(function () { return { skipped: [] }; });
      },
      getMeta: function (k) { return backend.get(META, k); },
      setMeta: function (k, v) { return backend.put(META, k, v); }
    };
    return api;
  }

  root.SheetStore = { createStore: createStore, memoryBackend: memoryBackend, idbBackend: idbBackend, newId: defaultId, BOOKS: BOOKS, META: META };
})(typeof globalThis !== 'undefined' ? globalThis : this);
