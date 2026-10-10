#!/usr/bin/env node
// apps/memo 의 DOM 없는 로직 검증 — js/sync.js(병합·Drive 동기화) + js/store.js(로컬 저장·탭 간 병합·파일 형식)
//   node scripts/verify-memo.mjs
// 가짜 localStorage 와 가짜 Google Drive(fetch 목: appDataFolder list/get/multipart create/media patch + Bearer 토큰 검사)로
// 저장소 · 병합(LWW) · 충돌 사본 · 묘비 전파/정리 · 401 재시도 · 404 재탐색 · 오프라인 · 가져오기/내보내기 형식을 확인한다. 외부 의존성 없음.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
const appDir = join(here, '..', 'apps', 'memo', 'js');
const ctx = vm.createContext({ console, Intl, crypto: globalThis.crypto, Date, JSON, Math, Promise, Array, Object, String, Number, Error, setTimeout });
for (const f of ['sync.js', 'store.js']) vm.runInContext(readFileSync(join(appDir, f), 'utf8'), ctx, { filename: f });
const { MemoSync: S, MemoStore, MemoFormat: F } = ctx;

let pass = 0, fail = 0;
const ok = (cond, name, extra) => { if (cond) { pass++; console.log('  ok   ' + name); } else { fail++; console.log('  FAIL ' + name + (extra !== undefined ? '  → ' + JSON.stringify(extra) : '')); } };
const section = (t) => console.log('\n# ' + t);
const byId = (arr, id) => arr.find(n => n.id === id);
const alive = (arr) => arr.filter(n => !n.deleted);
const texts = (arr) => alive(arr).map(n => n.text).sort();

// 가짜 localStorage (여러 "탭"이 공유)
function fakeStorage() { const m = new Map(); return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: k => m.delete(k), _m: m }; }
let clock = 1_700_000_000_000;
const now = () => clock;
let idn = 0; const newId = () => 'n' + (++idn);
const mk = (storage) => new MemoStore({ storage, now, newId });

// ───────────────────────── 1. 로컬 저장 · 불러오기
section('local store: autosave → reload restores');
{
  const st = fakeStorage();
  const a = mk(st); a.load();
  const n = a.create('Shopping\nmilk\neggs'); clock += 1000;
  a.update(n.id, { text: 'Shopping list\nmilk\neggs\nbread' }); a.update(n.id, { pinned: true });
  ok(a.dirty(), 'dirty before save');
  a.save();
  ok(!a.dirty(), 'clean after save');
  const b = mk(st); b.load();
  ok(b.alive().length === 1 && byId(b.all(), n.id).text.endsWith('bread') && byId(b.all(), n.id).pinned === true, 'reload restores text + pin');
  const idx = JSON.parse(st.getItem('memo:idx:v2'));
  ok(idx.app === 'broodev-memo' && idx.format === 2 && idx.notes[n.id] === byId(b.all(), n.id).updatedAt && JSON.parse(st.getItem('memo:n:' + n.id)).text.endsWith('bread') && st.getItem('memo:notes:v1') === null,
    'stored per note (memo:n:<id>) + index memo:idx:v2 with app id');
  const before = byId(b.all(), n.id).updatedAt; clock -= 50_000; // 시계가 뒤로 가도
  b.update(n.id, { text: 'x' }); ok(byId(b.all(), n.id).updatedAt === before + 1, 'updatedAt stays monotonic when clock goes backwards'); clock += 60_000;
}

// ───────────────────────── 2. 탭 간 병합 (storage 이벤트)
section('cross-tab: no overwrite, conflict copy');
{
  const st = fakeStorage();
  const A = mk(st); A.load();
  const n1 = A.create('one'); const n2 = A.create('two'); A.save();
  const B = mk(st); B.load();
  clock += 1000; A.update(n1.id, { text: 'one (A)' });
  clock += 1000; B.update(n2.id, { text: 'two (B)' });
  A.save(); B.save(); // B 가 A 의 저장을 모른 채 저장해도
  ok(byId(B.all(), n1.id).text === 'one (A)' && byId(B.all(), n2.id).text === 'two (B)', 'B save keeps A edit of other note');
  A.external();
  ok(byId(A.all(), n2.id).text === 'two (B)', 'A picks up B via storage event');
  // 같은 메모를 두 탭이 동시에
  clock += 1000; A.update(n1.id, { text: 'one — A wins? no' });
  clock += 1000; B.update(n1.id, { text: 'one — B later' });
  A.save(); const r = B.save();
  const all = B.all();
  ok(byId(all, n1.id).text === 'one — B later', 'later edit (B) keeps the id');
  const copy = all.find(n => n.conflictOf === n1.id);
  ok(copy && copy.text === 'one — A wins? no' && r.conflicts.length === 1, 'earlier edit (A) preserved as conflict copy', r.conflicts);
  const ext = A.external();
  ok(texts(A.all()).join('|') === texts(B.all()).join('|') && ext.changed, 'A converges with B (incl. copy)');
  // 삭제(묘비)가 다른 탭으로
  clock += 1000; A.remove(n2.id); A.save(); B.external();
  ok(byId(B.all(), n2.id).deleted === true && !B.alive().some(n => n.id === n2.id), 'tombstone propagates to other tab');
  // 빈 메모 discard 는 흔적 없이
  const e = A.create(''); A.save(); B.external(); ok(!!byId(B.all(), e.id), 'empty note visible to B first');
  A.discard(e.id); A.save(); B.external();
  ok(!B.alive().some(n => n.id === e.id) && !A.alive().some(n => n.id === e.id), 'discarded empty note (already saved) removed everywhere via tombstone');
  const e2 = A.create(''); A.discard(e2.id); A.save();
  ok(!byId(A.all(), e2.id), 'discarding a never-saved empty note leaves no trace');
  // 되돌리기
  clock += 1000; const prev = A.remove(n1.id); clock += 10; A.restore(prev); A.save();
  ok(byId(A.all(), n1.id).text === 'one — B later' && !byId(A.all(), n1.id).deleted, 'undo delete restores text');
  // 용량 초과는 예외로 → 메모리는 그대로
  const full = { getItem: st.getItem, setItem: () => { const e = new Error('quota'); e.name = 'QuotaExceededError'; throw e; } };
  const Q = new MemoStore({ storage: full, now, newId }); Q.load(); Q.create('big');
  let threw = false; try { Q.save(); } catch (er) { threw = er.name === 'QuotaExceededError'; }
  ok(threw && Q.alive().some(n => n.text === 'big'), 'quota error surfaces, memory kept');
}

// ───────────────────────── 2b. 지연된 읽기(Chrome 은 탭마다 localStorage 캐시 — 다른 탭의 쓰기가 늦게 보일 수 있음)
section('cross-tab: stale reads never lose data');
{
  const real = fakeStorage();
  let stale = null; // B 의 getItem 이 한동안 옛 저장소 전체를 돌려주는 상황(쓰기는 실제 저장소로)
  const viewB = { getItem: k => (stale ? (stale.has(k) ? stale.get(k) : null) : real.getItem(k)), setItem: (k, v) => real.setItem(k, v), removeItem: k => real.removeItem(k) };
  const A = mk(real); A.load(); const g = A.create('Groceries'); const x = A.create('Other'); A.save();
  const B = new MemoStore({ storage: viewB, now, newId }); B.load();
  stale = new Map(real._m); // B 는 지금 상태에 머문다
  clock += 1000; A.update(g.id, { text: 'Groceries' + String.fromCharCode(10) + 'butter' }); const fresh = A.create('Brand new from A'); A.save();
  clock += 1000; B.update(x.id, { text: 'Other (B)' }); B.save(); // 낡은 읽기 위에 색인을 써서 A 의 새 메모가 색인에서 빠짐
  ok(!(fresh.id in JSON.parse(real.getItem('memo:idx:v2')).notes) && real.getItem('memo:n:' + g.id).includes('butter'),
    'precondition: stale index write in B dropped A new note from the index (A edit of another note untouched — per-note keys)');
  const r = A.external();
  ok(byId(A.all(), g.id).text.endsWith('butter') && !!byId(A.all(), fresh.id) && byId(A.all(), x.id).text === 'Other (B)', 'A keeps its newer edit + new note, takes B edit');
  ok(r.needsWrite && r.conflicts.length === 0, 'A detects storage is behind (rewrite scheduled), no spurious conflict copy');
  A.save(); stale = null; B.external();
  ok(byId(B.all(), g.id).text.endsWith('butter') && !!byId(B.all(), fresh.id) && texts(A.all()).join('|') === texts(B.all()).join('|'), 'both tabs converge with nothing lost');
  // 낡은 사본이 「바뀐 것」처럼 보여도(base 보다 오래됨) 이기지 못함
  const T = 3_000_000, n = (id, text, t) => ({ id, text, pinned: false, createdAt: 1, updatedAt: t });
  let m = S.mergeNotes([n('a', 'new', T + 9)], [n('a', 'old', T)], { a: T + 9 }, { now: T + 10 });
  ok(m.notes.length === 1 && m.notes[0].text === 'new', 'remote older than base is stale → local kept');
  m = S.mergeNotes([n('a', 'typing', T + 12)], [n('a', 'old', T)], { a: T + 9 }, { now: T + 20 });
  ok(m.notes.length === 1 && m.notes[0].text === 'typing' && m.conflicts.length === 0, 'local edit vs stale remote → no conflict copy');
}

// ───────────────────────── 2c. 용량 초과는 그 메모만 — 다른 메모 편집은 계속 저장 · 옛 형식(v1) 자동 이전 · 묘비 키 정리
section('per-note keys: quota isolation · v1 migration · tombstone GC');
{
  // 실제 브라우저처럼 출처 전체(키+값 글자 수 합) 한도가 있는 localStorage
  function quotaStorage(limit) {
    const m = new Map(); const used = (skip) => { let c = 0; for (const [k, v] of m) if (k !== skip) c += k.length + v.length; return c; };
    return { _m: m, getItem: k => (m.has(k) ? m.get(k) : null), removeItem: k => m.delete(k),
      setItem(k, v) { v = String(v); if (used(k) + k.length + v.length > limit) { const e = new Error('quota'); e.name = 'QuotaExceededError'; throw e; } m.set(k, v); } };
  }
  const st = quotaStorage(50_000);
  const A = mk(st); A.load();
  const small = A.create('small note'); const other = A.create('other note'); A.save();
  clock += 1000; const big = A.create('HUGE\n' + 'z'.repeat(60_000));
  let err = null; try { A.save(); } catch (e) { err = e; }
  ok(err && err.name === 'QuotaExceededError' && err.failed.length === 1 && err.failed[0] === big.id && A.failed[0] === big.id, 'oversized note → save throws with failed=[that note]', err && err.failed);
  ok(A.dirty() && !!byId(A.all(), big.id), 'oversized note kept in memory (dirty → retried, can still be backed up)');
  clock += 1000; A.update(small.id, { text: 'small note EDITED-AFTER-QUOTA' });
  err = null; try { A.save(); } catch (e) { err = e; }
  ok(err && err.failed.length === 1 && err.failed[0] === big.id, 'later save still reports only the oversized note');
  const R = mk(st); R.load();
  ok(byId(R.all(), small.id)?.text === 'small note EDITED-AFTER-QUOTA' && !!byId(R.all(), other.id) && !byId(R.all(), big.id), 'reload: edit to a small note made after the quota error survives');
  const T2 = mk(st); T2.load(); clock += 1000; T2.update(other.id, { text: 'other tab edit' }); T2.save();
  A.external(); ok(byId(A.all(), other.id).text === 'other tab edit' && !!byId(A.all(), big.id), 'other-tab edits still merge while one note cannot be stored');
  // 큰 메모를 줄이면 저장되고 오류가 풀린다
  clock += 1000; A.update(big.id, { text: 'HUGE (trimmed)' });
  let threw = false; try { A.save(); } catch (e) { threw = true; }
  ok(!threw && A.failed.length === 0 && !A.dirty() && (() => { const r = mk(st); r.load(); return byId(r.all(), big.id)?.text === 'HUGE (trimmed)'; })(), 'trimming the note → saved, error cleared');
  // 묘비 → 내용이 비워져 자리를 돌려준다 · TTL 지난 묘비는 키까지 정리
  clock += 1000; A.remove(big.id); A.save();
  ok(JSON.parse(st.getItem('memo:n:' + big.id)).deleted === true && JSON.parse(st.getItem('memo:n:' + big.id)).text === '', 'deleted note key becomes a small tombstone');
  clock += S.TOMBSTONE_TTL + 10_000; A.update(small.id, { text: 'touch' }); A.save();
  ok(st.getItem('memo:n:' + big.id) === null && !(big.id in JSON.parse(st.getItem('memo:idx:v2')).notes), 'expired tombstone: key removed and dropped from the index');

  // 옛 형식(memo:notes:v1 한 키) → 읽기 · 첫 저장에서 메모별 키로 옮기고 옛 키 삭제
  const L1 = fakeStorage();
  L1.setItem('memo:notes:v1', S.serialize([{ id: 'old1', text: 'legacy one', pinned: true, createdAt: 1, updatedAt: 5 }, { id: 'old2', text: 'legacy two', pinned: false, createdAt: 1, updatedAt: 6 }], 7));
  const M = mk(L1); M.load();
  ok(texts(M.all()).join('|') === 'legacy one|legacy two', 'v1 data is loaded');
  M.save();
  ok(L1.getItem('memo:notes:v1') === null && JSON.parse(L1.getItem('memo:n:old1')).pinned === true && Object.keys(JSON.parse(L1.getItem('memo:idx:v2')).notes).length === 2, 'v1 migrated to per-note keys, old key removed');
  // 옛 키가 공간을 다 차지한 상태에서 이전 → 옛 키를 비우고 다시 시도해 성공
  const Q2 = quotaStorage(30_000);
  Q2.setItem('memo:notes:v1', S.serialize([{ id: 'L', text: 'y'.repeat(20_000), createdAt: 1, updatedAt: 5 }], 7));
  const M2 = mk(Q2); M2.load(); let mErr = null; try { M2.save(); } catch (e) { mErr = e; }
  ok(!mErr && Q2.getItem('memo:notes:v1') === null && JSON.parse(Q2.getItem('memo:n:L')).text.length === 20_000, 'migration when the old key fills the quota: old key freed, note moved');
  // 둘 다 들어갈 수 없으면 옛 키를 되살려 둔다(다시 열어도 그대로)
  const Q3 = quotaStorage(30_000);
  Q3.setItem('memo:notes:v1', S.serialize([{ id: 'L', text: 'y'.repeat(20_000), createdAt: 1, updatedAt: 5 }], 7));
  const M3 = mk(Q3); M3.load(); M3.update('L', { text: 'y'.repeat(31_000) }); let m3Err = null; try { M3.save(); } catch (e) { m3Err = e; }
  const M3b = mk(Q3); M3b.load();
  ok(m3Err && M3b.all().length === 1 && M3b.all()[0].text.length === 20_000, 'migration that cannot fit keeps the old v1 data readable');
}

// ───────────────────────── 3. 병합 규칙 (순수 함수)
section('mergeNotes: LWW · conflict · tombstone · GC');
{
  const T = 2_000_000;
  const n = (id, text, t, extra = {}) => ({ id, text, pinned: false, createdAt: 1, updatedAt: t, ...extra });
  let m = S.mergeNotes([n('a', 'A1', T + 5)], [n('a', 'A0', T)], { a: T }, { now: T + 10 });
  ok(m.notes.length === 1 && m.notes[0].text === 'A1' && m.conflicts.length === 0 && m.remoteChanged && !m.localChanged, 'only local changed → local wins');
  m = S.mergeNotes([n('a', 'A0', T)], [n('a', 'A2', T + 3)], { a: T }, { now: T + 10 });
  ok(m.notes[0].text === 'A2' && m.localChanged && !m.remoteChanged, 'only remote changed → remote wins (even if older than now)');
  m = S.mergeNotes([n('a', 'local edit', T + 9)], [n('a', 'remote edit', T + 4)], { a: T }, { now: T + 10 });
  const cp = m.notes.find(x => x.conflictOf === 'a');
  ok(byId(m.notes, 'a').text === 'local edit' && cp && cp.text === 'remote edit' && m.conflicts.length === 1, 'both changed → newer wins, loser copied');
  const m2 = S.mergeNotes([n('a', 'remote edit', T + 4)], [n('a', 'local edit', T + 9)], { a: T }, { now: T + 10 });
  ok(m2.notes.find(x => x.conflictOf === 'a').id === cp.id, 'conflict copy id is deterministic across devices');
  const again = S.mergeNotes(m.notes, m.notes, m.base, { now: T + 11 });
  ok(again.notes.length === m.notes.length && !again.localChanged && !again.remoteChanged && again.conflicts.length === 0, 'merge is idempotent');
  m = S.mergeNotes([n('a', '', T + 5, { deleted: true })], [n('a', 'A0', T)], { a: T }, { now: T + 10 });
  ok(m.notes.length === 1 && m.notes[0].deleted, 'delete vs unchanged → stays deleted (tombstone)');
  m = S.mergeNotes([n('a', '', T + 5, { deleted: true })], [n('a', 'edited elsewhere', T + 3)], { a: T }, { now: T + 10 });
  ok(byId(m.notes, 'a').deleted && m.notes.some(x => x.conflictOf === 'a' && x.text === 'edited elsewhere'), 'delete (newer) vs concurrent edit → edit kept as copy');
  m = S.mergeNotes([n('a', '', T + 2, { deleted: true })], [n('a', 'edited later', T + 6)], { a: T }, { now: T + 10 });
  ok(byId(m.notes, 'a').text === 'edited later' && !byId(m.notes, 'a').deleted && m.conflicts.length === 0, 'edit (newer) vs older delete → edit wins, no copy needed');
  m = S.mergeNotes([n('a', 'A0', T)], [], { a: T }, { now: T + 10 });
  ok(m.notes.length === 0, 'missing on remote + unchanged locally (purged there) → removed');
  m = S.mergeNotes([n('a', 'changed after purge', T + 7)], [], { a: T }, { now: T + 10 });
  ok(m.notes.length === 1, 'missing on remote but changed locally → kept');
  m = S.mergeNotes([n('new', 'local only', T)], [n('r', 'remote only', T)], {}, { now: T + 10 });
  ok(m.notes.length === 2, 'new notes on both sides kept');
  m = S.mergeNotes([n('a', 'same', T + 1)], [n('a', 'different', T + 2)], {}, { now: T + 10 });
  ok(m.notes.length === 2 && byId(m.notes, 'a').text === 'different', 'no base + differing → newer wins, other copied (no loss)');
  const old = T - S.TOMBSTONE_TTL - 5;
  m = S.mergeNotes([n('d', '', old, { deleted: true })], [n('d', '', old, { deleted: true })], { d: old }, { now: T });
  ok(m.notes.length === 0, 'tombstones older than TTL are garbage-collected');
  m = S.mergeNotes([n('a', '', T + 5, { deleted: true })], [n('a', 'backup copy', T)], {}, { now: T + 10, preferAlive: true });
  ok(byId(m.notes, 'a').text === 'backup copy' && !byId(m.notes, 'a').deleted && byId(m.notes, 'a').updatedAt > T + 5, 'import (preferAlive) restores a locally deleted note');
  ok(S.parse('{"notes":[{"id":"x","text":5,"updatedAt":"bad"},{"nope":1}]}', 42).length === 1 && S.parse('{"notes":[{"id":"x","text":5}]}', 42)[0].text === '', 'parse sanitizes garbage fields');
}

// ───────────────────────── 4. 가짜 Google Drive
function fakeDrive() {
  const files = new Map(); let seq = 0; let validToken = 'tok-1'; let issued = 0;
  const calls = []; let offline = false; let failNext = 0; let latency = 0; let tick = 0;
  const res = (status, body) => ({ status, ok: status >= 200 && status < 300, json: async () => (typeof body === 'string' ? JSON.parse(body) : body), text: async () => (typeof body === 'string' ? body : JSON.stringify(body)) });
  async function fetch(url, init = {}) {
    if (latency) await new Promise(r => setTimeout(r, latency)); // 두 기기의 요청이 서로 끼어들게
    if (offline) throw new TypeError('Failed to fetch');
    const u = new URL(url); const method = (init.method || 'GET').toUpperCase();
    calls.push(method + ' ' + u.pathname + (u.searchParams.get('uploadType') ? '?' + u.searchParams.get('uploadType') : ''));
    const auth = (init.headers || {}).Authorization;
    if (auth !== 'Bearer ' + validToken) return res(401, { error: 'invalid_token' });
    if (failNext) { failNext--; return res(500, { error: 'boom' }); }
    if (u.host !== 'www.googleapis.com') return res(400, {});
    if (method === 'GET' && u.pathname === '/drive/v3/files') {
      if (u.searchParams.get('spaces') !== 'appDataFolder') return res(400, { error: 'spaces' });
      const name = /name='([^']+)'/.exec(u.searchParams.get('q') || '')?.[1];
      return res(200, { files: [...files.entries()].filter(([, f]) => f.name === name && f.parents.includes('appDataFolder')).map(([id, f]) => ({ id, name: f.name, createdTime: f.createdTime })).reverse() }); // 일부러 역순 — 클라이언트가 createdTime 으로 정렬해야 함
    }
    let m = /^\/drive\/v3\/files\/([^/]+)$/.exec(u.pathname);
    if (method === 'GET' && m && u.searchParams.get('alt') === 'media') { const f = files.get(m[1]); return f ? res(200, f.content) : res(404, { error: 'notFound' }); }
    if (method === 'POST' && u.pathname === '/upload/drive/v3/files' && u.searchParams.get('uploadType') === 'multipart') {
      const bd = /boundary=(.+)$/.exec(init.headers['Content-Type'])[1];
      const parts = init.body.split('--' + bd).slice(1, -1).map(p => p.split('\r\n\r\n').slice(1).join('\r\n\r\n').replace(/\r\n$/, ''));
      const meta = JSON.parse(parts[0]); const id = 'file' + (++seq);
      files.set(id, { name: meta.name, parents: meta.parents || [], content: parts[1], createdTime: new Date(1_700_000_000_000 + (++tick) * 1000).toISOString() });
      return res(200, { id, name: meta.name });
    }
    if (method === 'DELETE' && m) { if (!files.has(m[1])) return res(404, {}); files.delete(m[1]); return res(204, ''); }
    m = /^\/upload\/drive\/v3\/files\/([^/]+)$/.exec(u.pathname);
    if (method === 'PATCH' && m && u.searchParams.get('uploadType') === 'media') { const f = files.get(m[1]); if (!f) return res(404, {}); f.content = init.body; return res(200, { id: m[1] }); }
    return res(400, { error: 'unhandled ' + method + ' ' + u.pathname });
  }
  return {
    fetch, files, calls,
    expire() { validToken = 'tok-' + (Number(validToken.split('-')[1]) + 1); },
    setOffline(v) { offline = v; }, failOnce() { failNext = 1; }, setLatency(ms) { latency = ms; },
    // 각 기기의 GIS 토큰 클라이언트 흉내: force 면 새 토큰 발급(= 현재 유효 토큰)
    tokenSource() { let cur = null; let forced = 0; const fn = async (force) => { if (force || !cur) { if (force) forced++; issued++; cur = validToken; } return cur; }; fn.forced = () => forced; return fn; },
    issued: () => issued
  };
}

// 한 "기기" = 자기 localStorage + store + syncBase/fileId
function device(drive, name) {
  const st = fakeStorage(); const store = mk(st); store.load();
  const getToken = drive.tokenSource();
  const api = S.createDrive({ fetch: drive.fetch, getToken });
  const dev = { name, st, store, getToken, base: {}, fileId: null,
    async sync() {
      store.save();
      const snap = store.snapshot();
      const r = await S.syncOnce({ drive: api, local: snap.notes, base: dev.base, fileId: dev.fileId, now: now() });
      store.mergeIn(r.notes, snap.base); store.save();
      dev.base = r.base; dev.fileId = r.fileId;
      return r;
    } };
  return dev;
}

section('Drive sync: two devices, appDataFolder');
{
  const drive = fakeDrive();
  const A = device(drive, 'A'), B = device(drive, 'B');
  const a1 = A.store.create('Note from A'); clock += 1000;
  let r = await A.sync();
  ok(drive.files.size === 1 && [...drive.files.values()][0].parents.includes('appDataFolder') && [...drive.files.values()][0].name === S.FILE_NAME, 'first sync creates memo-notes.json in appDataFolder');
  ok(r.uploaded && drive.calls.some(c => c.startsWith('POST /upload') && c.endsWith('multipart')), 'uploaded via multipart create');
  const b1 = B.store.create('Note from B'); clock += 1000;
  r = await B.sync();
  ok(texts(B.store.all()).join('|') === 'Note from A|Note from B', 'B pulls A note and keeps its own');
  ok(drive.calls.some(c => c.startsWith('PATCH /upload') && c.endsWith('media')), 'B uploads merged file via media PATCH');
  await A.sync();
  ok(texts(A.store.all()).join('|') === 'Note from A|Note from B', 'A converges');
  const callsBefore = drive.calls.length; const r2 = await A.sync();
  ok(!r2.uploaded && drive.calls.slice(callsBefore).every(c => c.startsWith('GET')), 'no-op sync does not upload');
  ok(A.fileId && A.fileId === B.fileId, 'fileId cached and shared');

  // 동시 편집 → 충돌 사본
  clock += 1000; A.store.update(a1.id, { text: 'Note from A — edited on A' });
  clock += 1000; B.store.update(a1.id, { text: 'Note from A — edited on B (later)' });
  await A.sync(); r = await B.sync();
  ok(r.conflicts.length === 1, 'B detects the concurrent edit');
  await A.sync();
  for (const d of [A, B]) {
    const all = alive(d.store.all());
    ok(byId(all, a1.id).text.endsWith('(later)') && all.some(n => n.conflictOf === a1.id && n.text.endsWith('edited on A')), d.name + ': newer kept, older preserved as (conflict copy)');
  }
  ok(alive(A.store.all()).length === 3 && alive(B.store.all()).length === 3, 'exactly one conflict copy on both devices');

  // 묘비 전파
  clock += 1000; A.store.remove(b1.id); await A.sync(); await B.sync();
  ok(byId(B.store.all(), b1.id)?.deleted === true && !alive(B.store.all()).some(n => n.id === b1.id), 'deletion propagates as tombstone A → Drive → B');
  // 삭제 vs 동시 수정 → 수정본 보존
  clock += 1000; A.store.remove(a1.id); clock += 1000; B.store.update(a1.id, { text: 'B kept editing' });
  await A.sync(); await B.sync(); await A.sync();
  ok(alive(A.store.all()).some(n => n.text === 'B kept editing') && alive(B.store.all()).some(n => n.text === 'B kept editing'), 'edit made after a remote delete survives on both');

  // 동기화 도중 편집(네트워크 대기 중 입력)
  const c1 = A.store.create('typing during sync'); A.store.save(); await A.sync();
  A.store.save(); const snap = A.store.snapshot();
  const pending = S.syncOnce({ drive: S.createDrive({ fetch: drive.fetch, getToken: A.getToken }), local: snap.notes, base: A.base, fileId: A.fileId, now: now() });
  clock += 500; A.store.update(c1.id, { text: 'typing during sync — more words' });
  const rr = await pending; A.store.mergeIn(rr.notes, snap.base); A.store.save(); A.base = rr.base;
  ok(byId(A.store.all(), c1.id).text.endsWith('more words'), 'edits typed while a sync is in flight are not overwritten');
  await A.sync(); await B.sync();
  ok(alive(B.store.all()).some(n => n.text.endsWith('more words')), 'and reach the other device on the next sync');
}

section('Drive sync: 401 retry · offline · 500 · 404 re-find');
{
  const drive = fakeDrive();
  const A = device(drive, 'A');
  A.store.create('hello'); await A.sync();
  drive.expire(); // 토큰 만료 → 401
  A.store.create('after expiry'); clock += 1000;
  const forcedBefore = A.getToken.forced();
  await A.sync();
  ok(A.getToken.forced() === forcedBefore + 1, '401 → token re-requested once (force)');
  ok(JSON.parse([...drive.files.values()][0].content).notes.some(n => n.text === 'after expiry'), 'request retried and upload succeeded after 401');
  // 영구 401 (토큰 재요청해도 안 됨)
  const bad = S.createDrive({ fetch: drive.fetch, getToken: async () => 'wrong' });
  let st = null; try { await S.syncOnce({ drive: bad, local: [], base: {}, now: now() }); } catch (e) { st = e.status; }
  ok(st === 401, 'persistent 401 surfaces as error.status 401 (UI → reconnect)');
  // 오프라인: 로컬 저장은 계속
  drive.setOffline(true);
  A.store.create('offline note'); A.store.save();
  let offErr = null; try { await A.sync(); } catch (e) { offErr = e; }
  ok(offErr instanceof TypeError || (offErr && offErr.name === 'TypeError'), 'offline → network error thrown (UI shows pending/offline)');
  const reload = mk(A.st); reload.load();
  ok(alive(reload.all()).some(n => n.text === 'offline note'), 'offline: note still saved locally');
  drive.setOffline(false); await A.sync();
  ok(JSON.parse([...drive.files.values()][0].content).notes.some(n => n.text === 'offline note'), 'back online → pending note uploaded');
  drive.failOnce(); let e500 = null; try { await A.sync(); } catch (e) { e500 = e.status; }
  ok(e500 === 500, 'server error surfaces with status (retry later)');
  // 캐시된 fileId 가 지워짐(사용자가 앱 데이터 삭제) → 다시 찾고/만든다
  const aliveBefore = alive(A.store.all()).length;
  drive.files.clear(); A.store.create('after wipe'); clock += 1000;
  await A.sync();
  ok(drive.files.size === 1 && JSON.parse([...drive.files.values()][0].content).notes.some(n => n.text === 'after wipe'), '404 on cached fileId → re-find → create new file');
  ok(alive(A.store.all()).length === aliveBefore + 1, 'remote file wiped → every local note survives (base ignored)', [aliveBefore, alive(A.store.all()).length]);
  // 깨진 원격 파일은 로컬로 덮어쓴다(로컬 유지)
  [...drive.files.values()][0].content = '{not json';
  const r9 = await A.sync();
  ok(r9.uploaded && alive(A.store.all()).length === aliveBefore + 1, 'corrupt remote file → local kept');
  ok(JSON.parse([...drive.files.values()][0].content).notes.length === A.store.all().length, 'corrupt remote file → rewritten from local');
  ok(S.SCOPE === 'https://www.googleapis.com/auth/drive.appdata', 'OAuth scope is drive.appdata only');
}

section('Drive sync: two devices connect at the same moment → one file');
{
  const drive = fakeDrive(); drive.setLatency(2);
  const A = device(drive, 'A'), B = device(drive, 'B');
  A.store.create('A only'); B.store.create('B only');
  await Promise.all([A.sync(), B.sync()]); // 둘 다 「파일 없음」을 보고 동시에 만든다
  ok(drive.calls.filter(c => c.startsWith('POST /upload')).length === 2, 'precondition: both devices created a file concurrently');
  ok(drive.files.size === 1, 'duplicates merged into the oldest file and the extra one deleted', drive.files.size);
  for (let i = 0; i < 2; i++) { clock += 1000; await A.sync(); await B.sync(); }
  ok(texts(A.store.all()).join('|') === 'A only|B only' && texts(B.store.all()).join('|') === 'A only|B only', 'both devices converge on both notes');
  ok(A.fileId === B.fileId && drive.files.has(A.fileId), 'both devices cache the same (surviving) fileId');
  const C = device(drive, 'C'); await C.sync();
  ok(texts(C.store.all()).join('|') === 'A only|B only', 'a new device sees notes from both');
  // 이미 갈라진 상태(옛 버전이 남긴 중복 파일)도 다음 동기화에서 하나로 합쳐진다 · 지운 파일을 캐시한 기기는 다시 찾는다
  drive.setLatency(0);
  const d2 = fakeDrive(); const X = device(d2, 'X'), Y = device(d2, 'Y');
  X.store.create('X note'); await X.sync();
  // Y 가 X 의 파일을 못 보고 따로 만든 상황을 직접 재현
  const bd = 'b'; const body = S.serialize([{ id: 'yy', text: 'Y note', createdAt: 1, updatedAt: now() }], now());
  await d2.fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', { method: 'POST', headers: { Authorization: 'Bearer tok-1', 'Content-Type': 'multipart/related; boundary=' + bd },
    body: '--' + bd + '\r\nContent-Type: application/json\r\n\r\n' + JSON.stringify({ name: S.FILE_NAME, parents: ['appDataFolder'] }) + '\r\n--' + bd + '\r\nContent-Type: application/json\r\n\r\n' + body + '\r\n--' + bd + '--' });
  const yFile = [...d2.files.keys()].find(k => k !== X.fileId);
  Y.store.mergeIn(S.parse(body, now()), {}); Y.store.save(); Y.fileId = yFile; Y.base = { yy: now() };
  ok(d2.files.size === 2, 'precondition: two diverged files exist');
  const newcomer = device(d2, 'N'); const rn = await newcomer.sync();
  ok(d2.files.size === 1 && rn.merged === 1 && texts(newcomer.store.all()).join('|') === 'X note|Y note', 'next device to sync merges the duplicates (oldest kept)');
  clock += 1000; await Y.sync(); await X.sync();
  ok(Y.fileId === X.fileId && texts(Y.store.all()).join('|') === 'X note|Y note' && texts(X.store.all()).join('|') === 'X note|Y note', 'device that cached the deleted duplicate re-finds the kept file; nothing lost');
}

// ───────────────────────── 5. 파일 형식
section('formats: title · .txt · .md · file names · .json backup · import');
{
  ok(F.title('\n\n  # Hello world  \nbody') === 'Hello world' && F.title('   ') === '' && F.snippet('Title\n\nsecond line\nthird') === 'second line', 'title = first non-empty line (md heading stripped) · snippet = next line');
  ok(F.toTxt({ text: 'a\nb' }) === 'a\nb', '.txt = raw text');
  ok(F.toMd({ text: 'Groceries\n\n- milk\n- eggs' }) === '# Groceries\n\n- milk\n- eggs', '.md adds a heading from the first line');
  ok(F.toMd({ text: '## Already\ntext' }) === '## Already\ntext' && F.toMd({ text: 'Only title' }) === '# Only title\n' && F.toMd({ text: '' }) === '', '.md keeps existing heading · single line · empty');
  ok(F.fileName({ text: 'a/b:c*?"<>| d.\n' }, 'txt') === 'a b c d.txt' && F.fileName({ text: '' }, 'md') === 'memo.md' && F.fileName({ text: 'x'.repeat(200) }, 'txt').length === 64, 'file names sanitized and capped');
  ok(/^memo-backup-\d{4}-\d{2}-\d{2}-\d{4}\.json$/.test(F.backupName(clock)), 'backup file name');
  const notes = [{ id: 'k1', text: '한국어 메모\n둘째 줄', pinned: true, createdAt: 1, updatedAt: 5 }, { id: 'k2', text: '', pinned: false, createdAt: 1, updatedAt: 6, deleted: true }, { id: 'k3', text: 'x <script>alert(1)</script>', pinned: false, createdAt: 2, updatedAt: 7, junk: 'drop me' }];
  const json = F.backup(notes, clock);
  const parsed = JSON.parse(json);
  ok(parsed.app === 'broodev-memo' && parsed.format === 1 && parsed.notes.length === 2 && !('junk' in parsed.notes[1]) && json.includes('\n  '), '.json backup: app/format header, alive notes only, unknown fields dropped, pretty');
  const back = F.parseBackup(json, clock);
  ok(back.length === 2 && back[0].text === '한국어 메모\n둘째 줄' && back[0].pinned === true && back[1].text.includes('<script>'), 'backup round-trips text verbatim (no HTML processing)');
  let threw = 0; for (const bad of ['nope', '{"x":1}', '42']) { try { F.parseBackup(bad, clock); } catch (e) { threw++; } }
  ok(threw === 3, 'invalid backup files are rejected');
  ok(F.parseBackup('[{"id":"z","text":"plain array"}]', clock)[0].text === 'plain array', 'plain array backup accepted');
  ok(F.fromText('note.txt', '﻿line1\r\nline2\r') === 'line1\nline2\n' && F.fromText('Empty Title.md', '  ') === 'Empty Title', 'text import strips BOM, normalizes CRLF, empty → file name');
  ok(F.kind('A.TXT') === 'text' && F.kind('b.md') === 'text' && F.kind('c.json') === 'json' && F.kind('d.png') === null, 'import kind by extension');
  ok(F.chars('ab\nc😀') === 4 && F.words('hello world  foo') === 3 && F.words('') === 0 && F.words('今日は良い天気です', 'ja') >= 3, 'char/word counts (code points · Intl.Segmenter for CJK)');

  // 가져오기 병합 (로컬 store 로)
  const st = fakeStorage(); const s = mk(st); s.load();
  const exist = s.create('existing'); s.save();
  clock += 1000; const imp = F.parseBackup(JSON.stringify({ notes: [{ id: exist.id, text: 'existing (older backup)', updatedAt: exist.updatedAt - 100, createdAt: 1 }, { id: 'fresh', text: 'from backup', updatedAt: 10, createdAt: 1 }] }), now());
  const r = s.mergeIn(imp, {}, { preferAlive: true }); s.save();
  ok(alive(s.all()).length === 3 && byId(s.all(), exist.id).text === 'existing' && s.all().some(n => n.conflictOf === exist.id && n.text === 'existing (older backup)') && r.conflicts.length === 1, 'importing a backup merges: newer local kept, differing backup text kept as copy, new notes added');
  const r2 = s.mergeIn(imp, {}, { preferAlive: true });
  ok(r2.conflicts.length === 0 && alive(s.all()).length === 3, 're-importing the same backup adds nothing');
}

console.log(`\n${fail ? 'FAILED' : 'PASSED'} — ${pass} ok, ${fail} failed`);
process.exit(fail ? 1 : 0);
