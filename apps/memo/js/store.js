/* =============================================================================
   memo · store.js — 로컬 자동 저장(localStorage) + 탭 간 병합 + 파일 형식(.txt/.md/.json)
   DOM 을 쓰지 않는다(Node 테스트에서 가짜 storage 로 검증). sync.js(MemoSync) 의 mergeNotes 를 재사용.
   - 저장 형식(v2): 메모마다 키 하나(memo:n:<id>) + 색인 키(memo:idx:v2 = { id: updatedAt }).
     큰 메모 하나가 용량을 넘겨도 그 메모만 실패하고, 다른 메모의 편집은 계속 저장된다.
     옛 형식(memo:notes:v1 — 전체를 키 하나에)은 읽을 때 합쳐 읽고, 새 형식으로 다 옮긴 뒤 지운다(자동 이전).
   - 저장 = 「읽고 → 병합하고 → 바뀐 메모만 쓰기 → 색인 쓰기」: 다른 탭이 그사이 저장한 메모를 덮어쓰지 않는다.
     seen = 이 탭이 마지막으로 본 저장소 상태 { id: updatedAt }. 내가 바꾼 것(seen 과 다름)만 내 것으로 이긴다.
     같은 메모를 두 탭이 동시에 고쳤으면 → 최신이 남고 다른 쪽은 「충돌 사본」(데이터 유실 0).
   ========================================================================== */
(function (root, factory) {
  var m = factory(root.MemoSync);
  if (typeof module === 'object' && module && module.exports) module.exports = m;
  root.MemoStore = m.MemoStore;
  root.MemoFormat = m.MemoFormat;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (Sync) {
  'use strict';

  var KEY = 'memo:idx:v2';        // 색인 키 — 다른 탭은 이 키(와 메모 키)의 storage 이벤트로 변경을 안다
  var NOTE_PREFIX = 'memo:n:';    // 메모 1개 = 키 1개
  var LEGACY_KEY = 'memo:notes:v1';

  function rid() {
    try { if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID().replace(/-/g, '').slice(0, 20); } catch (e) {}
    return (Date.now().toString(36) + Math.random().toString(36).slice(2, 12));
  }
  function mapOf(arr) { var m = {}; (arr || []).forEach(function (n) { m[n.id] = n.updatedAt; }); return m; }
  function same(a, b) {
    return !!a && !!b && a.updatedAt === b.updatedAt && a.createdAt === b.createdAt && !!a.deleted === !!b.deleted &&
      a.text === b.text && !!a.pinned === !!b.pinned && (a.conflictOf || '') === (b.conflictOf || '');
  }

  function MemoStore(o) {
    o = o || {};
    this.storage = o.storage;
    this.key = o.key || KEY;
    this.prefix = o.prefix || NOTE_PREFIX;
    this.legacyKey = o.legacyKey || LEGACY_KEY;
    this.now = o.now || function () { return Date.now(); };
    this.newId = o.newId || rid;
    this.notes = [];
    this.seen = {};
    this.failed = [];       // 마지막 저장에서 용량 때문에 쓰지 못한 메모 id
    this.lastSavedAt = 0;
  }

  MemoStore.prototype._get = function (k) { try { return this.storage.getItem(k); } catch (e) { return null; } };
  /* 이 저장소의 키인가(storage 이벤트 거르기) */
  MemoStore.prototype.owns = function (k) { return k === this.key || k === this.legacyKey || (typeof k === 'string' && k.indexOf(this.prefix) === 0); };

  /* 저장소 → 메모 배열. 색인에 있는 id 의 메모 키를 읽는다(내용은 메모 키가 기준). 옛 형식 키가 남아 있으면 합친다(같은 id 는 최신) */
  MemoStore.prototype.read = function () {
    var now = this.now(), self = this, pos = {}, out = [];
    function add(n) {
      if (!n) return;
      if (!(n.id in pos)) { pos[n.id] = out.length; out.push(n); }
      else if (n.updatedAt > out[pos[n.id]].updatedAt) out[pos[n.id]] = n;
    }
    var idx = null;
    try { var o = JSON.parse(this._get(this.key) || 'null'); idx = o && o.notes && typeof o.notes === 'object' && !Array.isArray(o.notes) ? o.notes : null; } catch (e) {}
    if (idx) Object.keys(idx).forEach(function (id) {
      var raw = self._get(self.prefix + id);
      if (!raw) return; // 색인만 있고 메모 키가 없음(지연된 읽기 등) → 없는 것으로 본다(탭 간 병합은 keepMissing)
      try { add(Sync.cleanNote(JSON.parse(raw), now)); } catch (e) {}
    });
    var legacy = this._get(this.legacyKey);
    if (legacy) { try { Sync.parse(legacy, now).forEach(add); } catch (e) {} }
    return out;
  };

  MemoStore.prototype.load = function () {
    this.notes = this.read();
    this.seen = mapOf(this.notes);
    return this.notes;
  };

  MemoStore.prototype.all = function () { return this.notes.slice(); };
  MemoStore.prototype.alive = function () { return this.notes.filter(function (n) { return !n.deleted; }); };
  MemoStore.prototype.get = function (id) {
    for (var i = 0; i < this.notes.length; i++) if (this.notes[i].id === id) return this.notes[i];
    return null;
  };
  MemoStore.prototype._stamp = function (prev) { var t = this.now(); return prev && t <= prev.updatedAt ? prev.updatedAt + 1 : t; };
  MemoStore.prototype._put = function (n) {
    for (var i = 0; i < this.notes.length; i++) if (this.notes[i].id === n.id) { this.notes[i] = n; return n; }
    this.notes.push(n); return n;
  };
  /* 바뀐 것이 있는지(저장 안 된 편집) — 메모리 vs seen */
  MemoStore.prototype.dirty = function () {
    var s = this.seen, n = this.notes;
    if (Object.keys(s).length !== n.length) return true;
    for (var i = 0; i < n.length; i++) if (s[n[i].id] !== n[i].updatedAt) return true;
    return false;
  };

  MemoStore.prototype.create = function (text) {
    var t = this.now();
    return this._put({ id: this.newId(), text: text || '', pinned: false, createdAt: t, updatedAt: t });
  };
  MemoStore.prototype.update = function (id, patch) {
    var n = this.get(id);
    if (!n || n.deleted) return null;
    var next = Object.assign({}, n);
    var changed = false;
    if (patch && typeof patch.text === 'string' && patch.text !== n.text) { next.text = patch.text; changed = true; }
    if (patch && typeof patch.pinned === 'boolean' && patch.pinned !== !!n.pinned) { next.pinned = patch.pinned; changed = true; }
    if (!changed) return n;
    if (next.conflictOf && patch && typeof patch.text === 'string') delete next.conflictOf; // 사본을 고치면 일반 메모가 된다
    next.updatedAt = this._stamp(n);
    return this._put(next);
  };
  /* 삭제 = 묘비. 되돌리기용으로 이전 상태를 돌려준다 */
  MemoStore.prototype.remove = function (id) {
    var n = this.get(id);
    if (!n || n.deleted) return null;
    this._put({ id: n.id, text: '', pinned: false, createdAt: n.createdAt, updatedAt: this._stamp(n), deleted: true });
    return n;
  };
  MemoStore.prototype.restore = function (prev) {
    if (!prev) return null;
    var cur = this.get(prev.id);
    var n = { id: prev.id, text: prev.text, pinned: !!prev.pinned, createdAt: prev.createdAt, updatedAt: this._stamp(cur || prev) };
    if (prev.conflictOf) n.conflictOf = prev.conflictOf;
    return this._put(n);
  };
  /* 비어 있는 새 메모를 버린다. 아직 저장소에 쓴 적이 없으면 흔적 없이, 이미 쓴 적이 있으면 묘비로
     (탭 간 병합은 「없음」을 삭제로 보지 않으므로 — 삭제는 묘비로만 전파된다) */
  MemoStore.prototype.discard = function (id) {
    if (Object.prototype.hasOwnProperty.call(this.seen, id)) { var n = this.get(id); if (n && !n.deleted) this.remove(id); return; }
    this.notes = this.notes.filter(function (n) { return n.id !== id; });
  };

  /* 저장: 저장소를 다시 읽어 병합한 뒤, 바뀐 메모만 메모별 키에 쓴다(작은 것부터 — 묘비·짧은 메모가 먼저 들어간다).
     한 메모가 용량 초과로 실패해도 나머지는 저장되고, 실패한 메모는 메모리에 남아 다음 저장 때 다시 시도된다(dirty).
     실패가 있으면 { failed:[id], result } 를 단 오류(QuotaExceededError)를 던진다 — 메모리 병합 결과는 이미 반영돼 있다. */
  MemoStore.prototype.save = function () {
    var st = this.storage, self = this, now = this.now();
    var stored = this.read();
    var m = Sync.mergeNotes(this.notes, stored, this.seen, { now: now, keepMissing: true });
    var S = {}; stored.forEach(function (n) { S[n.id] = n; });
    var legacyRaw = this._get(this.legacyKey);
    var inStore = {}, failed = [], firstErr = null, todo = [];
    m.notes.forEach(function (n) {
      if (!legacyRaw && same(S[n.id], n)) { inStore[n.id] = n.updatedAt; return; } // 저장소에 그대로 있음
      var c = Sync.cleanNote(n, now);
      todo.push({ id: n.id, at: c.updatedAt, body: JSON.stringify(c), prev: S[n.id] });
    });
    todo.sort(function (a, b) { return a.body.length - b.body.length; });
    function writeAll(list) {
      var left = [];
      list.forEach(function (w) {
        try { st.setItem(self.prefix + w.id, w.body); inStore[w.id] = w.at; }
        catch (e) { firstErr = firstErr || e; left.push(w); }
      });
      return left;
    }
    var left = writeAll(todo);
    if (left.length && legacyRaw) { // 옛 형식 키가 자리를 차지하고 있으면 비우고 한 번 더
      try { st.removeItem(this.legacyKey); } catch (e) {}
      left = writeAll(left);
    }
    left.forEach(function (w) {
      failed.push(w.id);
      if (w.prev && !legacyRaw) inStore[w.id] = w.prev.updatedAt; // 메모 키에는 이전 판이 그대로 남아 있다
    });
    // 병합 결과에서 빠진 메모(TTL 이 지난 묘비) → 키 정리
    var keep = {}; m.notes.forEach(function (n) { keep[n.id] = 1; });
    stored.forEach(function (n) { if (!keep[n.id]) { try { st.removeItem(self.prefix + n.id); } catch (e) {} } });
    var idxOk = true;
    try { st.setItem(this.key, JSON.stringify({ app: Sync.APP_ID, format: 2, notes: inStore })); }
    catch (e) { idxOk = false; firstErr = firstErr || e; }
    if (legacyRaw) {
      if (!failed.length && idxOk) { try { st.removeItem(this.legacyKey); } catch (e) {} }                      // 이전 끝
      else if (!this._get(this.legacyKey)) { try { st.setItem(this.legacyKey, legacyRaw); } catch (e) {} }     // 다 옮기지 못함 → 옛 키를 되살린다
    }
    this.notes = m.notes;
    this.seen = (failed.length || !idxOk || legacyRaw) ? mapOf(this.read()) : inStore; // = 저장소에 실제로 있는 상태
    this.failed = failed;
    var result = { conflicts: m.conflicts, external: m.localChanged };
    if (failed.length || !idxOk) {
      var err = new Error('quota');
      err.name = (firstErr && firstErr.name) || 'QuotaExceededError';
      err.cause = firstErr; err.failed = failed; err.result = result;
      throw err;
    }
    this.lastSavedAt = now;
    return result;
  };

  /* 다른 탭이 저장함(storage 이벤트) → 저장소를 다시 읽어 병합해서 반영. 내 미저장 편집은 유지 */
  MemoStore.prototype.external = function () {
    var stored = this.read();
    var m = Sync.mergeNotes(this.notes, stored, this.seen, { now: this.now(), keepMissing: true });
    this.notes = m.notes;
    this.seen = mapOf(stored);
    return { conflicts: m.conflicts, changed: m.localChanged, needsWrite: m.remoteChanged };
  };

  /* 동기화 결과·가져온 백업을 메모리에 합친다. base = 그 결과를 만들 때 보낸 스냅숏의 { id: updatedAt }
     (동기화 중에 고친 메모 · 다른 탭에서 바뀐 메모는 「내가 바꾼 것」으로 남고, 원격도 바뀌었으면 충돌 사본) */
  MemoStore.prototype.mergeIn = function (incoming, base, opts) {
    var o = Object.assign({ now: this.now() }, opts || {});
    var m = Sync.mergeNotes(this.notes, incoming, base || {}, o);
    this.notes = m.notes;
    return { conflicts: m.conflicts, changed: m.localChanged };
  };
  MemoStore.prototype.snapshot = function () { var a = this.all(); return { notes: a, base: mapOf(a) }; };

  /* ===== 파일 형식 ===== */
  var MemoFormat = {
    title: function (text) {
      var lines = String(text || '').split('\n');
      for (var i = 0; i < lines.length; i++) {
        var s = lines[i].replace(/^\s*#{1,6}\s+/, '').trim();
        if (s) return s.length > 100 ? s.slice(0, 100) + '…' : s;
      }
      return '';
    },
    snippet: function (text) {
      var lines = String(text || '').split('\n'), found = false;
      for (var i = 0; i < lines.length; i++) {
        var s = lines[i].trim();
        if (!s) continue;
        if (!found) { found = true; continue; }
        return s.length > 140 ? s.slice(0, 140) + '…' : s;
      }
      return '';
    },
    toTxt: function (note) { return String((note && note.text) || ''); },
    toMd: function (note) {
      var text = String((note && note.text) || '');
      var lines = text.split('\n'), i = 0;
      while (i < lines.length && !lines[i].trim()) i++;
      if (i >= lines.length) return '';
      if (/^\s*#{1,6}\s/.test(lines[i])) return text;
      var rest = lines.slice(i + 1);
      while (rest.length && !rest[0].trim()) rest.shift();
      return '# ' + lines[i].trim() + '\n' + (rest.length ? '\n' + rest.join('\n') : '');
    },
    fileName: function (note, ext) {
      var base = MemoFormat.title(note && note.text).replace(/…$/, '')
        .replace(/[\\/:*?"<>|\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60).replace(/[. ]+$/, '');
      return (base || 'memo') + '.' + ext;
    },
    backupName: function (now) {
      var d = new Date(now || Date.now());
      function p(n) { return (n < 10 ? '0' : '') + n; }
      return 'memo-backup-' + d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + '-' + p(d.getHours()) + p(d.getMinutes()) + '.json';
    },
    backup: function (notes, now) { return JSON.stringify(JSON.parse(Sync.serialize(notes, now, { alive: true })), null, 2); },
    parseBackup: function (text, now) {
      var arr = Sync.parse(text, now); // 형식이 아니면 throw
      return arr.filter(function (n) { return !n.deleted; });
    },
    /* .txt/.md 파일 → 메모 본문 (BOM·CRLF 정리, 빈 파일이면 파일 이름) */
    fromText: function (fileName, content) {
      var t = String(content || '').replace(/^﻿/, '').replace(/\r\n?/g, '\n');
      if (!t.trim()) t = String(fileName || '').replace(/\.(txt|md|markdown)$/i, '');
      return t;
    },
    kind: function (fileName) {
      var n = String(fileName || '').toLowerCase();
      if (/\.json$/.test(n)) return 'json';
      if (/\.(txt|md|markdown|text)$/.test(n)) return 'text';
      return null;
    },
    chars: function (text) { return Array.from(String(text || '').replace(/\n/g, '')).length; },
    words: function (text, lang) {
      var s = String(text || '');
      if (!s.trim()) return 0;
      try {
        if (typeof Intl !== 'undefined' && Intl.Segmenter) {
          var c = 0, it = new Intl.Segmenter(lang || undefined, { granularity: 'word' }).segment(s);
          for (var seg of it) if (seg.isWordLike) c++;
          return c;
        }
      } catch (e) {}
      return s.trim().split(/\s+/).length;
    }
  };

  return { MemoStore: MemoStore, MemoFormat: MemoFormat, KEY: KEY, NOTE_PREFIX: NOTE_PREFIX, LEGACY_KEY: LEGACY_KEY };
});
