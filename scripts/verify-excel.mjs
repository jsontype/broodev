#!/usr/bin/env node
// apps/excel (SHEET · excel.broodev.com) 검증 — 브라우저 없이 Node 에서 순수 모듈을 그대로 읽어 돌린다.
//   node scripts/verify-excel.mjs              전체 검사 (실패 시 exit 1)
//   node scripts/verify-excel.mjs --fix-static index.html 의 정적 SEO 본문·JSON-LD 를 js/i18n.js 의 ko 원문으로 다시 써 넣는다
// 검사 항목: i18n 13개 언어 키 · SEO/FAQ 정적본=사전 · 저장소(IndexedDB 래퍼 로직, 메모리 백엔드 · 한 번에 읽고 쓰기 · 조건부 쓰기)
//            · 병합(LWW·충돌 사본·묘비·삭제 vs 수정 · 기준점보다 낡은 원격은 지지 않음)
//            · 가짜 Google Drive(fetch 목 — version·중복 파일·DELETE)로 두 기기 동기화 · 401 재시도 · 오프라인 · 손상 파일 · 404 재생성
//            · 동시성: 늦게 도착한 낡은 업로드 복구 · 동기화 도중 로컬 저장 보존 · 동시 첫 연결로 생긴 중복 파일 합치기 · 올리기 직전 version 확인
//            · 수식 계산 · xlsx 왕복(값·수식·병합·열 너비·행 높이·서식·틀 고정 — ExcelJS 는 앱과 같은 CDN 빌드) · CSV 왕복 · PDF 페이지 나누기
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const APP = join(ROOT, 'apps', 'excel');
const EXCELJS_URL = 'https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js';
const args = process.argv.slice(2);

for (const f of ['i18n.js', 'store.js', 'sync.js', 'convert.js', 'pdf.js']) vm.runInThisContext(readFileSync(join(APP, 'js', f), 'utf8'), { filename: f });
const { SheetI18n: I, SheetStore: Store, SheetSync: Sync, SheetConvert: C, SheetPdf: P } = globalThis;

let pass = 0, fail = 0;
const failures = [];
function ok(cond, name, extra) {
  if (cond) { pass++; } else { fail++; failures.push(name + (extra !== undefined ? ' → ' + (typeof extra === 'string' ? extra : JSON.stringify(extra)).slice(0, 400) : '')); }
}
function eq(a, b, name) { const x = canon(a), y = canon(b); ok(x === y, name, x === y ? undefined : `got ${x.slice(0, 200)} / want ${y.slice(0, 200)}`); }
function canon(v) { return JSON.stringify(v, (k, val) => (val && typeof val === 'object' && !Array.isArray(val) ? Object.keys(val).sort().reduce((o, kk) => (o[kk] = val[kk], o), {}) : val)); }
const section = (s) => console.log('\n■ ' + s);

/* ============================================================== 정적 SEO 본문 · JSON-LD (ko) */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function staticSeo() {
  const s = I.seo('ko'), pad = '        ';
  const out = [pad + `<h2 id="seo-title">${esc(I.t('ko', 'appName'))} — SHEET</h2>`, pad + `<p class="lead">${esc(s.intro)}</p>`, pad + `<h2>${esc(s.howTitle)}</h2>`, pad + '<ol>'];
  s.steps.forEach((x) => out.push(pad + `  <li>${esc(x)}</li>`));
  out.push(pad + '</ol>', pad + `<h2>${esc(s.faqTitle)}</h2>`);
  s.faq.forEach(([q, a]) => out.push(pad + `<h3>${esc(q)}</h3>`, pad + `<p>${esc(a)}</p>`));
  return out.join('\n');
}
function staticLd() {
  const json = JSON.stringify(I.ldJson('ko'), null, 2).replace(/</g, '\\u003c');
  return '    <script type="application/ld+json" id="ld-json">\n' + json.split('\n').map((l) => '      ' + l).join('\n') + '\n    </script>';
}
function replaceBlock(html, name, body) {
  const re = new RegExp(`(<!--${name}:START-->)[\\s\\S]*?(\\s*<!--${name}:END-->)`);
  return html.replace(re, (m, a, b) => a + '\n' + body + b);
}
const indexPath = join(APP, 'index.html');
let html = readFileSync(indexPath, 'utf8');
if (args.includes('--fix-static')) {
  html = replaceBlock(replaceBlock(html, 'SEO', staticSeo()), 'LD', staticLd());
  writeFileSync(indexPath, html);
  console.log('index.html 정적 SEO·JSON-LD 갱신 완료');
}

section('i18n · SEO');
{
  const enKeys = Object.keys(I.U.en);
  for (const l of I.LANGS) {
    const miss = enKeys.filter((k) => !(k in I.U[l]));
    ok(!miss.length, `U[${l}] 키 누락 없음`, miss);
    ok(!!I.XS[l], `XS[${l}] 존재`);
    const xl = I.xsLocale(l);
    ok(xl.toolbar.undo && xl.contextmenu.insertRow && xl.calendar.months.length === 12, `xsLocale(${l}) 완전`);
    const s = I.SEO[l];
    ok(s && s.steps.length === 5 && s.faq.length === 6, `SEO[${l}] 사용법 5 + FAQ 6`);
    const d = I.t(l, 'desc');
    const cjk = /^(ko|ja|zh|zh-Hant)$/.test(l);
    ok(d.length <= 155 && d.length >= (cjk ? 60 : 120), `meta description(${l}) 길이 ${d.length}`);
  }
  ok(I.normLang('zh-TW') === 'zh-Hant' && I.normLang('zh-CN') === 'zh' && I.normLang('pt-BR') === 'pt' && I.normLang('xx') === null, 'normLang 매핑');
  ok(I.detectLang({ search: '?lang=ja' }, { getItem: () => 'ko' }, { languages: ['de'] }) === 'ja', 'detectLang: ?lang 우선');
  ok(I.detectLang({ search: '' }, { getItem: () => 'ko' }, { languages: ['de'] }) === 'ko', 'detectLang: localStorage 다음');
  ok(I.detectLang({ search: '' }, { getItem: () => null }, { languages: ['fr-CA', 'en'] }) === 'fr', 'detectLang: navigator.languages');
  ok(I.detectLang({ search: '' }, { getItem: () => null }, { languages: ['sv'] }) === 'en', 'detectLang: en 폴백');
  ok(I.t('ko', 'nope-key') === 'nope-key' && I.t('xx', 'appName') === I.U.en.appName, 'en 폴백');
  const seoBlock = (/<!--SEO:START-->\n([\s\S]*?)\n\s*<!--SEO:END-->/.exec(html) || [])[1];
  ok(seoBlock === staticSeo(), '정적 SEO 본문 = i18n ko 원문 (--fix-static 으로 갱신)');
  const ldBlock = (/<!--LD:START-->\n([\s\S]*?)\n\s*<!--LD:END-->/.exec(html) || [])[1];
  ok(ldBlock === staticLd(), '정적 JSON-LD = i18n ko 원문');
  let ld = null; try { ld = JSON.parse((/<script type="application\/ld\+json" id="ld-json">([\s\S]*?)<\/script>/.exec(html) || [])[1]); } catch (e) { /* */ }
  ok(ld && ld['@graph'][0]['@type'] === 'WebApplication' && ld['@graph'][0].offers.price === '0', 'JSON-LD WebApplication(무료) 파싱');
  const faqLd = ld ? ld['@graph'][1].mainEntity.map((q) => [q.name, q.acceptedAnswer.text]) : [];
  eq(faqLd, I.SEO.ko.faq, 'JSON-LD FAQPage = 화면 FAQ 텍스트');
  ok((html.match(/hreflang="/g) || []).length === 14, 'hreflang 13개 + x-default');
  ok(html.includes('ca-pub-5511225478572825') && existsSync(join(APP, 'ads.txt')), 'AdSense 인증 메타 + ads.txt');
}

/* ============================================================== 저장소 */
function clock(start = 1000) { let t = start; return { now: () => t, set: (v) => { t = v; }, tick: (d = 1) => (t += d) }; }
const sheetWith = (name, cells) => { const sh = C.blankSheet(name); Object.entries(cells).forEach(([ref, text]) => { const r = C.parseRef(ref); (sh.rows[r.ri] = sh.rows[r.ri] || { cells: {} }).cells[r.ci] = { text }; }); return sh; };

section('저장소 (store.js · 메모리 백엔드로 같은 로직 검증)');
{
  const ck = clock(5000);
  const st = Store.createStore(Store.memoryBackend(), { now: ck.now });
  const a = await st.createBook({ name: '가계부', sheets: [sheetWith('시트1', { A1: '1' })] });
  ok(a.id && a.updatedAt === 5000 && a.createdAt === 5000, 'createBook: id·시각');
  ck.set(4000); // 시계가 뒤로 가도
  const a2 = await st.saveBook({ ...a, sheets: [sheetWith('시트1', { A1: '2' })] });
  ok(a2.updatedAt === 5001, 'saveBook: updatedAt 단조 증가(시계 역행에도)', a2.updatedAt);
  ck.set(9000);
  const b = await st.createBook({ name: '예산', sheets: [C.blankSheet('S')] });
  const list = await st.listBooks();
  ok(list.length === 2 && list[0].id === b.id, 'listBooks: 최근 수정 순');
  const ren = await st.renameBook(a.id, '가계부 2026');
  ok(ren.name === '가계부 2026' && ren.updatedAt > a2.updatedAt, 'renameBook');
  const tomb = await st.deleteBook(b.id);
  ok(tomb.deleted === true && !tomb.sheets && tomb.updatedAt > b.updatedAt, 'deleteBook → 묘비(내용 없음, 시각 증가)');
  ok((await st.getBook(b.id)) === null && (await st.listBooks()).length === 1, '삭제 후 목록·조회에서 제외');
  ok((await st.allRecords()).length === 2, '묘비는 동기화용으로 남음');
  await st.putRecords([{ id: 'x1', name: '원격', sheets: [], updatedAt: 123, createdAt: 100 }]);
  ok((await st.getRecord('x1')).updatedAt === 123, 'putRecords: updatedAt 보존');
  await st.setMeta('syncBase', { x1: 123 });
  eq(await st.getMeta('syncBase'), { x1: 123 }, 'meta get/set');
  const got = await st.getBook(a.id); got.name = 'mutated';
  ok((await st.getBook(a.id)).name === '가계부 2026', '반환값 수정이 저장소를 오염시키지 않음(복사본)');
  // 동기화 반영용 조건부 쓰기: 읽어 간 뒤 바뀐 레코드는 건너뛴다
  const cur = await st.getRecord(a.id);
  ck.tick(10); await st.saveBook({ ...cur, sheets: [sheetWith('시트1', { A1: '동기화 도중 저장' })] });
  const res = await st.putRecords([{ ...cur, name: '원격판', updatedAt: cur.updatedAt + 1 }, { id: 'new1', name: '새 원격', sheets: [], updatedAt: 7, createdAt: 7 }], { [a.id]: cur.updatedAt, new1: null });
  ok(res.skipped.length === 1 && res.skipped[0] === a.id, 'putRecords(expect): 그사이 바뀐 레코드는 건너뜀', res);
  ok((await st.getBook(a.id)).sheets[0].rows[0].cells[0].text === '동기화 도중 저장' && (await st.getRecord('new1')).name === '새 원격', '건너뛴 레코드는 로컬 그대로 · 나머지는 기록');
  const res2 = await st.putRecords([{ id: 'new1', name: '덮어쓰기?', updatedAt: 9 }], { new1: null });
  ok(res2.skipped[0] === 'new1' && (await st.getRecord('new1')).name === '새 원격', 'expect=null(없어야 함)인데 이미 있으면 건너뜀');
  // backend.update 는 읽기-쓰기를 한 번에(예외 시 쓰지 않음)
  let threw = false; try { await st.backend.update('books', a.id, () => { throw new Error('boom'); }); } catch (e) { threw = e.message === 'boom'; }
  ok(threw && (await st.getBook(a.id)).sheets[0].rows[0].cells[0].text === '동기화 도중 저장', 'update: fn 예외 → 원래 오류로 reject, 기록 안 함');
}

/* ============================================================== 병합 */
section('병합 (sync.js mergeRecords)');
{
  const rec = (id, name, ts, extra) => ({ id, name, sheets: [sheetWith('S', { A1: name })], createdAt: 1, updatedAt: ts, ...extra });
  const cn = (n) => n + ' (충돌 사본)';
  let m = Sync.mergeRecords({}, { r1: rec('r1', 'R', 10) }, {}, { conflictName: cn });
  ok(m.toLocal.length === 1 && !m.remoteDirty, '원격에만 있음 → 로컬로');
  m = Sync.mergeRecords({ l1: rec('l1', 'L', 10) }, {}, {}, { conflictName: cn });
  ok(m.remoteDirty && !m.toLocal.length, '로컬에만 있음 → 업로드');
  m = Sync.mergeRecords({ a: rec('a', 'old', 10) }, { a: rec('a', 'new', 20) }, { a: 10 }, { conflictName: cn });
  ok(m.merged.a.name === 'new' && m.toLocal.length === 1 && !m.conflicts.length, '로컬 그대로·원격 변경 → 원격 반영(LWW)');
  m = Sync.mergeRecords({ a: rec('a', 'mine', 30) }, { a: rec('a', 'base', 10) }, { a: 10 }, { conflictName: cn });
  ok(m.merged.a.name === 'mine' && m.remoteDirty && !m.conflicts.length, '원격 그대로·로컬 변경 → 업로드');
  m = Sync.mergeRecords({ a: rec('a', 'A편집', 20) }, { a: rec('a', 'B편집', 30) }, { a: 10 }, { conflictName: cn });
  const copy = m.merged[m.conflicts[0] && m.conflicts[0].copyId];
  ok(m.merged.a.name === 'B편집' && m.conflicts.length === 1 && copy && copy.name === 'A편집 (충돌 사본)' && copy.conflictOf === 'a', '양쪽 수정 → 최신 승리 + 진 쪽 「(충돌 사본)」 보존');
  ok(copy && copy.sheets[0].rows[0].cells[0].text === 'A편집', '충돌 사본에 진 쪽 내용이 그대로');
  const m2 = Sync.mergeRecords({ a: rec('a', 'B편집', 30) }, { a: rec('a', 'A편집', 20) }, { a: 10 }, { conflictName: cn });
  ok(m2.conflicts[0] && m2.conflicts[0].copyId === m.conflicts[0].copyId, '충돌 사본 id 결정적(두 기기에서 같은 id)');
  m = Sync.mergeRecords({ a: { id: 'a', deleted: true, updatedAt: 40 } }, { a: rec('a', 'x', 10) }, { a: 10 }, { conflictName: cn });
  ok(m.merged.a.deleted && m.remoteDirty, '묘비(최신) → 원격으로 삭제 전파');
  m = Sync.mergeRecords({ a: rec('a', 'x', 10) }, { a: { id: 'a', deleted: true, updatedAt: 40 } }, { a: 10 }, { conflictName: cn });
  ok(m.merged.a.deleted && m.toLocal[0].deleted, '원격 묘비 → 로컬 삭제');
  m = Sync.mergeRecords({ a: rec('a', '고친 내용', 50) }, { a: { id: 'a', deleted: true, updatedAt: 40 } }, { a: 10 }, { conflictName: cn });
  ok(!m.merged.a.deleted && m.merged.a.name === '고친 내용' && m.merged.a.updatedAt > 50 && m.remoteDirty, '삭제 vs 수정 → 수정 보존(유실 0)');
  m = Sync.mergeRecords({ a: rec('a', 'same', 10) }, { a: rec('a', 'same', 10) }, { a: 10 }, { conflictName: cn });
  ok(!m.remoteDirty && !m.toLocal.length, '같으면 아무것도 안 함');
  // 다른 기기가 낡은 사본으로 Drive 를 덮어씀(원격 < 기준점) → 로컬의 새 판이 이기고 다시 올린다
  m = Sync.mergeRecords({ a: rec('a', '새 판', 30) }, { a: rec('a', '낡은 판', 10) }, { a: 30 }, { conflictName: cn });
  ok(m.merged.a.name === '새 판' && m.remoteDirty && !m.toLocal.length && !m.conflicts.length, '원격이 기준점보다 낡음 → 로컬 새 판 유지 + 재업로드');
  m = Sync.mergeRecords({ a: rec('a', '낡은 판', 10) }, { a: rec('a', '새 판', 30) }, { a: 30 }, { conflictName: cn });
  ok(m.merged.a.name === '새 판' && m.toLocal.length === 1 && !m.conflicts.length, '로컬이 기준점보다 낡음 → 원격 새 판으로');
  m = Sync.mergeRecords({ a: rec('a', '로컬', 40) }, { a: rec('a', '낡은 원격', 10) }, { a: 30 }, { conflictName: cn });
  ok(m.merged.a.name === '로컬' && m.remoteDirty && !m.conflicts.length, '로컬만 바뀌고 원격은 낡음 → 로컬');
}

/* ============================================================== 가짜 Google Drive + 두 기기 */
function fakeDrive() {
  const files = new Map(); let seq = 0, tokSeq = 1, clockT = 0;
  const valid = new Set(['tok-1']);
  const d = { files, offline: false, rejectAll: false, requests: [], badScope: [] };
  const res = (status, body, isText) => ({ status, ok: status >= 200 && status < 300, json: async () => (isText ? JSON.parse(body) : body), text: async () => (isText ? body : JSON.stringify(body)) });
  d.issueToken = () => { const tk = 'tok-' + (++tokSeq); valid.add(tk); return tk; };
  d.revokeAll = () => valid.clear();
  d.fetch = async (url, init = {}) => {
    if (d.offline) throw new TypeError('Failed to fetch');
    const method = init.method || 'GET', tok = String((init.headers || {}).Authorization || '').replace(/^Bearer /, '');
    d.requests.push({ method, url, tok });
    if (d.rejectAll || !valid.has(tok)) return res(401, { error: { code: 401 } });
    const u = new URL(url);
    if (method === 'GET' && u.pathname === '/drive/v3/files') {
      if (u.searchParams.get('spaces') !== 'appDataFolder') d.badScope.push(url);
      const name = (/name='([^']+)'/.exec(u.searchParams.get('q') || '') || [])[1];
      return res(200, { files: [...files.values()].filter((f) => f.name === name && f.parents.includes('appDataFolder')).map((f) => ({ id: f.id, name: f.name, createdTime: f.createdTime, version: String(f.version) })) });
    }
    if (method === 'GET' && u.pathname.startsWith('/drive/v3/files/') && u.searchParams.get('alt') === 'media') {
      const f = files.get(decodeURIComponent(u.pathname.split('/').pop()));
      if (d.onDownload) await d.onDownload(f);
      return f ? res(200, f.content, true) : res(404, {});
    }
    if (method === 'GET' && u.pathname.startsWith('/drive/v3/files/')) {           // 메타데이터(version)
      const f = files.get(decodeURIComponent(u.pathname.split('/').pop()));
      return f ? res(200, { id: f.id, version: String(f.version) }) : res(404, {});
    }
    if (method === 'DELETE' && u.pathname.startsWith('/drive/v3/files/')) {
      const id = decodeURIComponent(u.pathname.split('/').pop());
      return files.delete(id) ? res(204, {}) : res(404, {});
    }
    if (method === 'POST' && u.pathname === '/upload/drive/v3/files') {
      const boundary = /boundary=(.+)$/.exec(init.headers['Content-Type'])[1];
      const parts = init.body.split('--' + boundary).slice(1, -1).map((p) => p.replace(/^\r\n/, '').split('\r\n\r\n').slice(1).join('\r\n\r\n').replace(/\r\n$/, ''));
      const meta = JSON.parse(parts[0]);
      if (!meta.parents || meta.parents[0] !== 'appDataFolder') d.badScope.push('create outside appDataFolder');
      const id = 'f' + (++seq);
      files.set(id, { id, name: meta.name, parents: meta.parents, content: parts[1], version: 1, createdTime: new Date(Date.UTC(2026, 0, 1, 0, 0, ++clockT)).toISOString() });
      return res(200, { id, version: '1' });
    }
    if (method === 'PATCH' && u.pathname.startsWith('/upload/drive/v3/files/')) {
      const f = files.get(decodeURIComponent(u.pathname.split('/').pop()));
      if (!f) return res(404, {});
      if (d.beforePatch) await d.beforePatch(f);
      f.content = init.body; f.version++;
      return res(200, { id: f.id, version: String(f.version) });
    }
    return res(400, { error: 'unexpected ' + method + ' ' + url });
  };
  d.remoteItems = () => { const f = [...files.values()][0]; return f ? JSON.parse(f.content).items : null; };
  d.writeRaw = (items) => { const f = [...files.values()][0]; f.content = JSON.stringify({ app: 'broodev-sheet', v: 1, items }); f.version++; };
  return d;
}
function device(drive, ck) {
  const store = Store.createStore(Store.memoryBackend(), { now: ck.now });
  const dev = { store, token: 'tok-1', refreshes: 0, statuses: [] };
  dev.engine = Sync.createSyncEngine({
    fetch: drive.fetch,
    getToken: async ({ refresh }) => { if (refresh) { dev.refreshes++; dev.token = drive.issueToken(); } return dev.token; },
    load: async () => ({ items: await store.allRecordsMap(), base: (await store.getMeta('syncBase')) || {} }),
    apply: (recs, m, ctx) => store.putRecords(recs, ctx && ctx.expect),   // 앱과 같게: 동기화 도중 바뀐 로컬은 건너뜀
    saveBase: (b) => store.setMeta('syncBase', b),
    conflictName: (n) => n + ' (충돌 사본)',
    onStatus: (s) => dev.statuses.push(s.state),
    debounceMs: 0, retryBaseMs: 1,
    setTimeout: () => 0, clearTimeout: () => {}       // 테스트에서는 자동 재시도 타이머를 돌리지 않는다
  });
  return dev;
}
const bodyOf = async (st, id) => { const r = await st.getRecord(id); return r && r.sheets ? r.sheets[0].rows[0].cells[0].text : (r && r.deleted ? '<deleted>' : null); };

section('동기화 엔진 + 가짜 Drive (두 기기)');
{
  ok(Sync.SCOPE === 'https://www.googleapis.com/auth/drive.appdata', 'scope = drive.appdata 하나만');
  const drive = fakeDrive(), ck = clock(10000);
  const A = device(drive, ck), B = device(drive, ck);
  const book = await A.store.createBook({ name: '매출', sheets: [sheetWith('시트1', { A1: '첫 내용', B2: '=SUM(1,2)' })] });
  let r = await A.engine.syncNow();
  ok(r.ok && drive.files.size === 1 && drive.remoteItems()[book.id], 'A 첫 동기화 → appDataFolder 에 파일 생성·업로드');
  ok(!drive.badScope.length, 'Drive 접근은 appDataFolder 안에서만', drive.badScope);
  r = await B.engine.syncNow();
  ok(r.ok && (await B.store.listBooks()).length === 1 && (await bodyOf(B.store, book.id)) === '첫 내용', 'B 동기화 → A 의 통합문서를 내려받음(다른 PC 연동)');

  ck.tick(100);
  const bb = await B.store.getBook(book.id);
  await B.store.saveBook({ ...bb, sheets: [sheetWith('시트1', { A1: 'B가 고침' })] });
  await B.engine.syncNow(); await A.engine.syncNow();
  ok((await bodyOf(A.store, book.id)) === 'B가 고침', '한쪽만 고침 → 다른 기기에 그대로 반영');

  const up0 = A.engine.stats.uploads;
  r = await A.engine.syncNow();
  ok(r.ok && A.engine.stats.uploads === up0, '바뀐 것 없으면 업로드 안 함');

  // 동시 수정 → 충돌 사본
  ck.tick(100); const a1 = await A.store.getBook(book.id); await A.store.saveBook({ ...a1, sheets: [sheetWith('시트1', { A1: 'A의 수정' })] });
  ck.tick(100); const b1 = await B.store.getBook(book.id); await B.store.saveBook({ ...b1, sheets: [sheetWith('시트1', { A1: 'B의 수정' })] });
  await A.engine.syncNow();               // A 가 먼저 올림
  r = await B.engine.syncNow();           // B: 양쪽 모두 바뀜 → B(최신) 승리, A 판은 사본
  ok(r.ok && r.merge.conflicts.length === 1, 'B 병합에서 충돌 1건 감지');
  await A.engine.syncNow();
  const listA = await A.store.listBooks(), listB = await B.store.listBooks();
  const copyA = listA.find((x) => x.conflictOf === book.id);
  ok(listA.length === 2 && listB.length === 2, '양쪽 모두 원본 + 충돌 사본 2개');
  ok((await bodyOf(A.store, book.id)) === 'B의 수정' && copyA && copyA.sheets[0].rows[0].cells[0].text === 'A의 수정' && /\(충돌 사본\)$/.test(copyA.name), '최신(B)은 원본, A 의 수정은 「(충돌 사본)」으로 — 유실 0');
  eq(await A.store.allRecordsMap(), await B.store.allRecordsMap(), '두 기기의 최종 상태 동일');

  // 묘비 전파
  ck.tick(100); await A.store.deleteBook(copyA.id);
  await A.engine.syncNow(); await B.engine.syncNow();
  ok((await B.store.listBooks()).length === 1 && (await B.store.getRecord(copyA.id)).deleted === true, '삭제(묘비) → 다른 기기에서도 사라짐');
  ok(drive.remoteItems()[copyA.id].deleted === true, 'Drive 파일에도 묘비가 남아 늦게 접속한 기기에 전파');

  // 삭제 vs 수정
  ck.tick(100); await A.store.deleteBook(book.id);
  ck.tick(100); const b2 = await B.store.getBook(book.id); await B.store.saveBook({ ...b2, sheets: [sheetWith('시트1', { A1: '지우는 동안 고친 내용' })] });
  await A.engine.syncNow(); await B.engine.syncNow(); await A.engine.syncNow();
  ok((await bodyOf(A.store, book.id)) === '지우는 동안 고친 내용' && (await bodyOf(B.store, book.id)) === '지우는 동안 고친 내용', '삭제 vs 동시 수정 → 수정본이 살아남음(유실 0)');

  // 401 → 토큰 재요청 후 1회 재시도
  drive.revokeAll();
  ck.tick(100); const a3 = await A.store.getBook(book.id); await A.store.saveBook({ ...a3, sheets: [sheetWith('시트1', { A1: '토큰 만료 후 수정' })] });
  const ref0 = A.refreshes, retry0 = A.engine.stats.retries401;
  r = await A.engine.syncNow();
  ok(r.ok && A.refreshes === ref0 + 1 && A.engine.stats.retries401 >= retry0 + 1, '401 → 새 토큰으로 재시도 후 성공', { refreshes: A.refreshes, retries: A.engine.stats.retries401 });
  ok(drive.remoteItems()[book.id].sheets[0].rows[0].cells[0].text === '토큰 만료 후 수정', '재시도 후 업로드 반영');

  // 계속 401 → 'auth' (다시 연결 필요), 로컬은 그대로
  drive.rejectAll = true;
  ck.tick(100); const a4 = await A.store.getBook(book.id); await A.store.saveBook({ ...a4, sheets: [sheetWith('시트1', { A1: '인증 실패 중 수정' })] });
  r = await A.engine.syncNow();
  ok(!r.ok && r.code === 'auth' && A.engine.status.state === 'auth', '재시도도 401 → 상태 auth (「다시 연결」)');
  ok((await bodyOf(A.store, book.id)) === '인증 실패 중 수정', '인증 실패여도 로컬 저장은 유지');
  drive.rejectAll = false;

  // 오프라인 → 대기, 복귀 후 업로드
  drive.offline = true;
  r = await A.engine.syncNow();
  ok(!r.ok && r.code === 'network' && A.engine.status.state === 'pending', '오프라인 → 「동기화 대기 중」');
  drive.offline = false;
  r = await A.engine.syncNow();
  ok(r.ok && drive.remoteItems()[book.id].sheets[0].rows[0].cells[0].text === '인증 실패 중 수정', '온라인 복귀 → 밀린 변경 업로드');

  // 손상된 원격 파일 → 로컬로 복구
  const f = [...drive.files.values()][0]; f.content = '{broken json';
  r = await B.engine.syncNow();
  ok(r.ok && drive.remoteItems() && drive.remoteItems()[book.id], '손상된 Drive 파일 → 로컬 데이터로 다시 기록');

  // 원격 파일이 사라짐(404) → 새로 만든다
  drive.files.clear(); A.engine.resetFile();
  r = await A.engine.syncNow();
  ok(r.ok && drive.files.size === 1 && drive.remoteItems()[book.id], 'Drive 파일 삭제됨 → 다시 생성');
  ok(A.statuses.includes('syncing') && A.statuses.includes('synced'), '상태 콜백 syncing → synced');
}

section('동기화 동시성 (늦은 낡은 업로드 · 동기화 도중 저장 · 중복 파일 · version 확인)');
{
  const text = (r) => (r && r.sheets ? r.sheets[0].rows[0].cells[0].text : null);
  // E1: B 의 낡은 업로드가 A 의 새 판을 덮어씀 → A 가 확인(verify)에서 알아채고 복구, 편집 유실 0
  {
    const drive = fakeDrive(), ck = clock(20000);
    const A = device(drive, ck), B = device(drive, ck);
    const bk = await A.store.createBook({ name: '예산', sheets: [sheetWith('S', { A1: 'v1' })] });
    await A.engine.syncNow(); await B.engine.syncNow();
    const stale = JSON.parse(JSON.stringify(drive.remoteItems()));      // B 가 내려받아 둔 판(v1)
    ck.tick(100); const a1 = await A.store.getBook(bk.id); await A.store.saveBook({ ...a1, sheets: [sheetWith('S', { A1: 'A 의 중요한 편집' })] });
    await A.engine.syncNow();
    drive.writeRaw(stale);                                                // 지연된 낡은 업로드가 나중에 도착
    ok(text(drive.remoteItems()[bk.id]) === 'v1', '재현: Drive 가 낡은 판으로 덮어써짐');
    const healed = await A.engine.verify();
    ok(healed === true && text(drive.remoteItems()[bk.id]) === 'A 의 중요한 편집', '올린 기기의 확인(verify) → 덮어쓰기 감지 후 새 판 재업로드');
    await B.engine.syncNow();
    ok(text(await B.store.getRecord(bk.id)) === 'A 의 중요한 편집' && text(await A.store.getRecord(bk.id)) === 'A 의 중요한 편집', '모든 기기가 새 판으로 수렴(유실 0)');
    ok((await A.engine.verify()) === false, '바뀐 것 없으면 verify 는 아무것도 안 함');
  }
  // E1b: 확인 전이라도 다음 동기화에서 낡은 원격은 지지 않는다
  {
    const drive = fakeDrive(), ck = clock(30000);
    const A = device(drive, ck), B = device(drive, ck);
    const bk = await A.store.createBook({ name: '예산', sheets: [sheetWith('S', { A1: 'v1' })] });
    await A.engine.syncNow(); await B.engine.syncNow();
    const stale = JSON.parse(JSON.stringify(drive.remoteItems()));
    ck.tick(100); const a1 = await A.store.getBook(bk.id); await A.store.saveBook({ ...a1, sheets: [sheetWith('S', { A1: '새 판' })] });
    await A.engine.syncNow(); drive.writeRaw(stale);
    await B.engine.syncNow(); await A.engine.syncNow(); await B.engine.syncNow();
    ok(text(drive.remoteItems()[bk.id]) === '새 판' && text(await B.store.getRecord(bk.id)) === '새 판', '낡은 원격(기준점 미만)은 다음 동기화에서 새 판에 진다');
  }
  // E2: 내려받는 동안 로컬에 저장된 편집은 apply 가 덮어쓰지 않고, 다음 병합에서 다른 기기 편집과 함께 보존
  {
    const drive = fakeDrive(), ck = clock(40000);
    const A = device(drive, ck), B = device(drive, ck);
    const bk = await A.store.createBook({ name: '예산', sheets: [sheetWith('S', { A1: 'v1' })] });
    await A.engine.syncNow(); await B.engine.syncNow();
    ck.tick(100); const b1 = await B.store.getBook(bk.id); await B.store.saveBook({ ...b1, sheets: [sheetWith('S', { A1: 'B 편집' })] }); await B.engine.syncNow();
    drive.onDownload = async () => { drive.onDownload = null; ck.tick(100); const a1 = await A.store.getBook(bk.id); await A.store.saveBook({ ...a1, sheets: [sheetWith('S', { A1: '동기화 도중 A 입력' })] }); };
    const r = await A.engine.syncNow();
    ok(r.ok && r.skipped.length === 1 && text(await A.store.getRecord(bk.id)) === '동기화 도중 A 입력', '동기화 도중 저장된 로컬 → 덮어쓰지 않고 건너뜀', { skipped: r.skipped, now: text(await A.store.getRecord(bk.id)) });
    await A.engine.syncNow(); await B.engine.syncNow(); await A.engine.syncNow();
    const names = async (st) => (await st.listBooks()).map((x) => x.name + '=' + text(x)).sort().join(' | ');
    const na = await names(A.store), nb = await names(B.store);
    ok(na === nb && /동기화 도중 A 입력/.test(na) && /B 편집/.test(na) && /충돌 사본/.test(na), '다음 병합: 두 편집 모두 보존(진 쪽은 충돌 사본) · 두 기기 동일', na);
  }
  // E3: 두 기기가 동시에 처음 연결 → 파일 2개 → 다음 동기화에서 가장 오래된 파일로 합치고 나머지 삭제
  {
    const drive = fakeDrive(), ck = clock(50000);
    const A = device(drive, ck), B = device(drive, ck);
    await A.store.createBook({ name: 'A 만', sheets: [sheetWith('S', { A1: 'a' })] });
    await B.store.createBook({ name: 'B 만', sheets: [sheetWith('S', { A1: 'b' })] });
    await Promise.all([A.engine.syncNow(), B.engine.syncNow()]);
    ok(drive.files.size === 2, '재현: 동시 첫 연결로 파일 2개');
    await A.engine.syncNow(); await B.engine.syncNow();
    const la = (await A.store.listBooks()).map((x) => x.name).sort().join(','), lb = (await B.store.listBooks()).map((x) => x.name).sort().join(',');
    ok(drive.files.size === 1 && la === 'A 만,B 만' && lb === la, '중복 파일 합침 → 파일 1개 · 두 기기 모두 양쪽 통합문서', { files: drive.files.size, la, lb });
    ok(A.engine.fileId === B.engine.fileId && A.engine.fileId === [...drive.files.keys()][0], '두 기기가 같은(가장 오래된) 파일을 사용');
  }
  // version 확인: 내려받은 뒤 다른 기기가 올리면 덮어쓰지 않고 다시 받아 병합
  {
    const drive = fakeDrive(), ck = clock(60000);
    const A = device(drive, ck), B = device(drive, ck);
    const bk = await A.store.createBook({ name: '예산', sheets: [sheetWith('S', { A1: 'v1' })] });
    const other = await A.store.createBook({ name: '다른', sheets: [sheetWith('S', { A1: 'o1' })] });
    await A.engine.syncNow(); await B.engine.syncNow();
    ck.tick(100); const a1 = await A.store.getBook(other.id); await A.store.saveBook({ ...a1, sheets: [sheetWith('S', { A1: 'A 가 고침' })] });
    drive.onDownload = async () => { drive.onDownload = null; ck.tick(100); const b1 = await B.store.getBook(bk.id); await B.store.saveBook({ ...b1, sheets: [sheetWith('S', { A1: 'B 가 끼어듦' })] }); await B.engine.syncNow(); };
    const st0 = A.engine.stats.staleRetries;
    const r = await A.engine.syncNow();
    const items = drive.remoteItems();
    ok(r.ok && A.engine.stats.staleRetries === st0 + 1, '올리기 직전 version 이 바뀜 → 다시 받아 병합(재시도 1회)', A.engine.stats);
    ok(text(items[bk.id]) === 'B 가 끼어듦' && text(items[other.id]) === 'A 가 고침', '끼어든 B 의 편집과 A 의 편집이 둘 다 Drive 에 남음');
  }
}

/* ============================================================== 변환: 수식 · xlsx · CSV */
section('수식 계산 (convert.js createCalc)');
{
  const s1 = sheetWith('시트1', { A1: '10', A2: '20', A3: '30', A4: '=SUM(A1:A3)', A5: '=AVERAGE(A1:A3)', A6: '=IF(A4>50,"많음","적음")', A7: '=CONCAT("합계:",A4)', A8: '=A1/0', A9: '=A9+1', A10: '=0.1+0.2', A11: '=MAX(A1:A3)-MIN(A1:A3)', A12: '=ROUND(2.345,2)', A13: '=시트2!A1*2', A14: "='My Sheet'!A1+1", A15: '=-2^2', A16: '=LEN("한글")', A17: '=NOPE(1)', A18: '=COUNT(A1:A3,"x")', A19: '=AND(A1>5,A2<30)', A20: '=A1&"%"' });
  const s2 = sheetWith('시트2', { A1: '7' }), s3 = sheetWith('My Sheet', { A1: '1' });
  const calc = C.createCalc([s1, s2, s3]);
  const want = { A4: '60', A5: '20', A6: '많음', A7: '합계:60', A8: '#DIV/0!', A9: '#REF!', A10: '0.3', A11: '20', A12: '2.35', A13: '14', A14: '2', A15: '4', A16: '2', A17: '#NAME?', A18: '3', A19: 'TRUE', A20: '10%' };
  for (const [ref, v] of Object.entries(want)) { const r = C.parseRef(ref); eq(calc.display(0, r.ri, r.ci), v, `${ref} = ${v}`); }
}

async function loadExcelJS() {
  try { const m = await import('exceljs'); if (m && (m.default || m).Workbook) return m.default || m; } catch (e) { /* 레포에 없으면 CDN 빌드 */ }
  const dir = join(tmpdir(), 'broodev-verify-cache'), file = join(dir, 'exceljs-4.4.0.min.js');
  if (!existsSync(file)) { mkdirSync(dir, { recursive: true }); const r = await fetch(EXCELJS_URL); if (!r.ok) throw new Error('ExcelJS 다운로드 실패 ' + r.status); writeFileSync(file, Buffer.from(await r.arrayBuffer())); }
  const mod = { exports: {} };
  new Function('module', 'exports', 'require', readFileSync(file, 'utf8'))(mod, mod.exports, undefined);
  return mod.exports;
}

section('xlsx 왕복 (x-spreadsheet ⇄ ExcelJS — 앱과 같은 CDN 빌드)');
{
  const ExcelJS = await loadExcelJS();
  ok(typeof ExcelJS.Workbook === 'function', 'ExcelJS 로드');
  const sh = C.blankSheet('매출 시트');
  sh.styles = [
    { font: { bold: true, size: 12 }, bgcolor: '#ffff00', align: 'center', border: { top: ['thin', '#000000'], bottom: ['medium', '#ff0000'], left: ['thin', '#000000'], right: ['dashed', '#0000ff'] } },
    { format: 'percent' },
    { font: { italic: true, name: 'Courier New' }, color: '#ff0000', underline: true, strike: true, valign: 'top', textwrap: true },
    { format: 'number', align: 'right' }
  ];
  const put = (ref, text, style) => { const r = C.parseRef(ref); const row = sh.rows[r.ri] = sh.rows[r.ri] || { cells: {} }; row.cells = row.cells || {}; row.cells[r.ci] = { text }; if (style != null) row.cells[r.ci].style = style; };
  put('A1', '품목', 0); put('B1', '수량', 0); put('C1', '단가', 0); put('D1', '금액', 0);
  put('A2', '사과'); put('B2', '3'); put('C2', '1200'); put('D2', '=B2*C2', 3);
  put('A3', 'りんご'); put('B3', '2'); put('C3', '800.5'); put('D3', '=B3*C3', 3);
  put('A4', 'แอปเปิล'); put('B4', '1'); put('C4', '-50'); put('D4', '=B4*C4', 3);
  put('A5', '합계'); put('D5', '=SUM(D2:D4)', 3);
  put('A6', '007'); put('B6', '12345678901234567890'); put('C6', '12.5', 1); put('D6', '줄1\n줄2', 2);
  put('A7', 'TRUE'); put('B7', '=IF(D5>4000,"OK","NG")'); put('C7', "='Data 2'!A1*2");
  sh.rows[4].cells[0].merge = [0, 2]; sh.merges = ['A5:C5'];
  sh.rows[0].height = 40; sh.rows[5].height = 60;
  sh.cols = { 0: { width: 150 }, 3: { width: 120 }, 5: { width: 42 }, len: 26 };
  sh.freeze = 'B2';
  const s2 = C.blankSheet('Data 2'); s2.rows[0] = { cells: { 0: { text: '21' }, 1: { text: '=A1+1' } } };
  s2.merges = ['B3:C6']; s2.rows[2] = { cells: { 1: { text: '병합 큰 칸', merge: [3, 1] } } };
  const book = { name: '왕복 테스트', sheets: [sh, s2], createdAt: Date.now(), updatedAt: Date.now() };

  const buf = await C.exportXlsx(book, ExcelJS);
  const bytes = new Uint8Array(buf);
  ok(bytes.length > 3000 && bytes[0] === 0x50 && bytes[1] === 0x4b, 'xlsx = ZIP(PK) 생성', bytes.length);
  // ExcelJS 로 다시 열어 원시 확인
  const wb = new ExcelJS.Workbook(); await wb.xlsx.load(buf);
  const ws = wb.getWorksheet('매출 시트');
  ok(ws && ws.getCell('D2').formula === 'B2*C2', '수식이 문자열 수식으로 저장', ws && ws.getCell('D2').formula);
  ok(ws && ws.getCell('D5').value && ws.getCell('D5').value.result === 3600 + 1601 - 50, '수식 캐시값(result)도 함께 저장', ws && ws.getCell('D5').value);
  ok(ws && ws.getCell('B2').value === 3 && typeof ws.getCell('C3').value === 'number', '숫자는 숫자로');
  ok(ws && ws.getCell('A6').value === '007' && ws.getCell('B6').value === '12345678901234567890', '앞자리 0·15자리 초과는 글자로');
  ok(ws && Math.abs(ws.getCell('C6').value - 0.125) < 1e-12 && /%/.test(ws.getCell('C6').numFmt), '백분율 → 0.125 + % 서식');
  ok(ws && ws.views[0] && ws.views[0].state === 'frozen' && ws.views[0].xSplit === 1 && ws.views[0].ySplit === 1, '틀 고정');
  ok(ws && ws.getCell('A1').font.bold && ws.getCell('A1').fill.fgColor.argb === 'FFFFFF00', '서식(굵게·배경)');

  const back = await C.importXlsx(buf, ExcelJS);
  ok(back.length === 2 && back[0].name === '매출 시트' && back[1].name === 'Data 2', '시트 2개·이름 유지');
  const texts = (s) => { const o = {}; C.eachCell(s, (ri, ci, c) => { if (c.text != null && c.text !== '') o[C.cellRef(ri, ci)] = c.text; }); return o; };
  eq(texts(back[0]), texts(sh), '값·수식 문자열 전부 동일(시트1)');
  eq(texts(back[1]), texts(s2), '값·수식 문자열 전부 동일(시트2)');
  eq(back[0].merges, sh.merges, '병합 범위 동일');
  ok(back[0].rows[4].cells[0].merge && back[0].rows[4].cells[0].merge.join() === '0,2', '병합 master 의 merge=[행,열] 복원');
  eq(back[1].merges, s2.merges, '병합 범위 동일(시트2)');
  const widths = (s) => Object.fromEntries(Object.entries(s.cols).filter(([k, v]) => /^\d+$/.test(k) && v.width).map(([k, v]) => [k, v.width]));
  eq(widths(back[0]), widths(sh), '열 너비 동일(px)');
  ok(back[0].rows[0].height === 40 && back[0].rows[5].height === 60, '행 높이 동일', [back[0].rows[0].height, back[0].rows[5].height]);
  ok(back[0].freeze === 'B2', '틀 고정 동일', back[0].freeze);
  const styleAt = (s, ref) => { const r = C.parseRef(ref); return C.styleOf(s, C.cellAt(s, r.ri, r.ci)); };
  eq(styleAt(back[0], 'A1'), sh.styles[0], '서식 동일: 굵게·크기·배경·가운데·테두리 4면');
  eq(styleAt(back[0], 'C6'), sh.styles[1], '서식 동일: 백분율');
  eq(styleAt(back[0], 'D6'), sh.styles[2], '서식 동일: 기울임·글꼴·글자색·밑줄·취소선·위쪽·줄바꿈');
  eq(styleAt(back[0], 'D2'), sh.styles[3], '서식 동일: 숫자 형식·오른쪽');

  // 엑셀이 만든 "공유 수식"도 문자열 수식으로
  const wb2 = new ExcelJS.Workbook(), w2 = wb2.addWorksheet('S');
  w2.getCell('A1').value = 1; w2.getCell('A2').value = 2; w2.getCell('A3').value = 3;
  w2.getCell('B1').value = { formula: 'A1*2', result: 2 };
  w2.getCell('B2').value = { sharedFormula: 'B1', result: 4 };
  w2.getCell('B3').value = { sharedFormula: 'B1', result: 6 };
  w2.getCell('C1').value = { richText: [{ text: '굵' }, { text: '은 글자' }] };
  w2.getCell('C2').value = { text: '링크', hyperlink: 'https://example.com' };
  w2.getCell('C3').value = new Date(Date.UTC(2026, 9, 10));
  w2.getCell('C4').value = true;
  const back2 = await C.importXlsx(await wb2.xlsx.writeBuffer(), ExcelJS);
  const t2 = texts(back2[0]);
  ok(t2.B1 === '=A1*2' && t2.B2 === '=A2*2' && t2.B3 === '=A3*2', '공유 수식 → 칸별 문자열 수식', t2);
  ok(t2.C1 === '굵은 글자' && t2.C2 === '링크' && t2.C3 === '2026-10-10' && t2.C4 === 'TRUE', '서식 있는 글자·링크·날짜·논리값', t2);
}

section('CSV');
{
  const m = [['이름', '메모, 쉼표', '따옴표 "x"'], ['줄\n바꿈', ' 앞뒤 공백 ', 'ไทย'], ['=1+1', '', 'end']];
  eq(C.parseCSV(C.toCSV(m)), m, 'CSV 왕복(쉼표·따옴표·줄바꿈·공백·유니코드)');
  eq(C.parseCSV('﻿a;b\n1;2\n'), [['a', 'b'], ['1', '2']], 'BOM 제거 + 세미콜론 자동 감지');
  eq(C.parseTSV('a\tb\r\n1\t2\r\n'), [['a', 'b'], ['1', '2']], '엑셀 붙여넣기(\\r\\n, 끝 줄바꿈)');
  eq(C.parseTSV('a\tb\n"x\ny"\t2'), [['a', 'b'], ['x\ny', '2']], '구글 시트 붙여넣기(\\n, 따옴표 안 줄바꿈)');
  const sh = sheetWith('S', { A1: '수량', B1: '단가', C1: '금액', A2: '3', B2: '1,200', C2: '=A2*2', A3: '"인용"' });
  eq(C.parseCSV(C.sheetToCSV([sh], 0)), [['수량', '단가', '금액'], ['3', '1,200', '6'], ['"인용"', '', '']], '현재 시트 CSV = 화면 값(수식 결과)');
  const euckr = new Uint8Array([0xc7, 0xd1, 0xb1, 0xdb, 0x2c, 0x41]); // "한글,A" (EUC-KR)
  ok(C.decodeText(euckr, 'ko') === '한글,A', 'UTF-8 아닌 CSV → 언어별 레거시 인코딩(EUC-KR)');
  ok(C.decodeText(new TextEncoder().encode('日本語'), 'ko') === '日本語', 'UTF-8 은 그대로');
}

section('PDF 페이지 나누기 (pdf.js planPages)');
{
  const wide = C.blankSheet('W');
  for (let r = 0; r < 80; r++) { wide.rows[r] = { cells: {} }; for (let c = 0; c < 30; c++) wide.rows[r].cells[c] = { text: 'x' }; }
  let p = P.planPages(wide);
  ok(p.scale === 1 && p.pages.length === 9 && p.pages[0].c0 === 0 && p.pages[1].r0 > 0 && p.pages[1].c0 === 0, 'A4 가로: 30열×80행 → 9쪽(아래로 먼저)', { n: p.pages.length, scale: p.scale, second: p.pages[1] });
  const slightly = C.blankSheet('S');
  slightly.rows[0] = { cells: {} }; for (let c = 0; c < 11; c++) slightly.rows[0].cells[c] = { text: 'y' };
  p = P.planPages(slightly);
  ok(p.pages.length === 1 && p.scale < 1 && p.scale > 0.9, '조금 넓은 표 → 한 쪽에 맞춰 축소', { n: p.pages.length, scale: p.scale });
  p = P.planPages(C.blankSheet('E'));
  ok(p.pages.length === 1 && p.empty, '빈 시트 → 빈 페이지 1쪽');
  const big = C.blankSheet('B');
  for (let r = 0; r < 500; r++) { big.rows[r] = { cells: {} }; for (let c = 0; c < 100; c++) big.rows[r].cells[c] = { text: String(r * 100 + c) }; }
  ok(P.countPages(big) === 180, '500행×100열 → 180쪽(큰 PDF 안내 기준 계산)', P.countPages(big));
  const sel = P.planPages(big, { range: { sri: 0, sci: 0, eri: 39, eci: 9 } });
  ok(sel.pages.length === 2 && sel.pages[0].c0 === 0 && sel.pages[sel.pages.length - 1].r1 === 39 && sel.pages.every((pg) => pg.c1 <= 9), '선택 영역 PDF: 범위 안만 페이지로', sel.pages);
  const mid = P.planPages(big, { range: { sri: 100, sci: 20, eri: 120, eci: 25 } });
  ok(mid.pages.length === 1 && mid.pages[0].r0 === 100 && mid.pages[0].c0 === 20 && mid.pages[0].r1 === 120 && mid.pages[0].c1 === 25, '중간 범위도 그 칸부터 시작', mid.pages);
  // PNG 그대로 넣기: 8bit RGB 만 통과(그 밖은 pdf-lib 의 embedPng 로)
  const { deflateSync } = await import('node:zlib');
  const crc = (buf) => { let c, crcv = 0xffffffff; for (let n = 0; n < buf.length; n++) { c = (crcv ^ buf[n]) & 0xff; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crcv = (crcv >>> 8) ^ c; } return (crcv ^ 0xffffffff) >>> 0; };
  const chunk = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]); };
  const mkPng = (colorType) => { const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(3, 0); ihdr.writeUInt32BE(2, 4); ihdr[8] = 8; ihdr[9] = colorType; const bpp = colorType === 6 ? 4 : 3; const raw = Buffer.alloc((3 * bpp + 1) * 2, 0xff); raw[0] = 0; raw[3 * bpp + 1] = 0; const z = deflateSync(raw); return new Uint8Array(Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', z.subarray(0, 5)), chunk('IDAT', z.subarray(5)), chunk('IEND', Buffer.alloc(0))])); };
  const info = P.pngInfo(mkPng(2));
  ok(info && info.w === 3 && info.h === 2 && Buffer.from(info.idat).equals(deflateSync(Buffer.from((() => { const r = Buffer.alloc(20, 0xff); r[0] = 0; r[10] = 0; return r; })()))), 'pngInfo: RGB PNG → 크기 + 이어 붙인 IDAT');
  ok(P.pngInfo(mkPng(6)) === null && P.pngInfo(new Uint8Array([1, 2, 3])) === null, 'pngInfo: RGBA·손상 PNG 는 null(일반 경로로)');
  ok(/Malgun Gothic/.test(P.fontStack('ko')) && /Leelawadee/.test(P.fontStack('ko')) && P.fontStack('ja').indexOf('Yu Gothic') < P.fontStack('ja').indexOf('Malgun'), '글꼴 목록: UI 언어 우선 + 모든 문자 체계 받침');
}

console.log(`\n${fail ? '✗' : '✓'} verify-excel: ${pass} passed, ${fail} failed`);
if (fail) { failures.forEach((f) => console.log('  - ' + f)); process.exit(1); }
