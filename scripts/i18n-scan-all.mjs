#!/usr/bin/env node
// 전 앱 i18n 일괄 스캔 — scripts/i18n-scan.mjs 를 모든 앱·페이지(모달 포함)에 13개 언어로 돌려 요약한다. UI 문자열을 바꾼 뒤 푸시 전에.
//   node scripts/i18n-scan-all.mjs                 → 전부 (동시 5개)
//   node scripts/i18n-scan-all.mjs btc voca        → 이름에 btc·voca 가 들어간 항목만
//   node scripts/i18n-scan-all.mjs --jobs 3
// 앱마다 루트 폴더를 정적 서버(127.0.0.1:8930~)로 띄우고, 언어는 각 앱 방식(?lang= · localStorage 키)으로 심는다.
// 결과: 항목별 언어당 불일치 수 · 불일치 줄(앞 몇 개) · 전체 CLEAN 여부(아니면 exit 1). 원본 JSON 은 $TEMP/broodev-i18n-scan-all/ 에.
// 허용(allow): 게임 아이콘 한자(사무라이 魂·一閃·落命)처럼 전 언어 공통인 디자인 요소만. UI 라벨·제목·푸터는 허용하지 않는다.
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import net from 'node:net';

const R = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(process.env.TEMP || process.env.TMPDIR || '/tmp', 'broodev-i18n-scan-all');
mkdirSync(OUT, { recursive: true });

const EXAMPLES_ALLOW = '[\u3040-\u30FF\u4E00-\u9FFF\u0400-\u04FF]';   // 예시 단어: 일본어·중국어·러시아어
const SAMURAI_ALLOW = '\\(魂\\)|\\(一閃\\)|^魂 |魂 ●|\\(落命\\)';
const BTC_CONTENT = ['404', 'about', 'bitcoin-bottom', 'drawdown-dca', 'fear-greed-index', 'glossary', 'golden-cross', 'guide-fear-greed', 'indicators', 'macd-guide', 'mayer-multiple', 'methodology', 'privacy', 'rsi-guide', 'terms'];
const VOCA_CONTENT = ['404', 'about', 'csv-guide', 'exam-vocabulary', 'method', 'privacy', 'spaced-repetition', 'study-guide', 'terms', 'tts-pronunciation'];
const REGIONAL_EN = ['africa', 'bangladesh', 'caribbean', 'mongolia', 'nepal', 'nunavut', 'pacific', 'pakistan', 'philippines', 'srilanka'];

// { name, root, page, set[], wait, langs?, pre?, allow? }
const JOBS = [
  { name: 'samurai', root: 'games/samurai', page: 'index.html', set: ['qs:lang'], wait: 2500, allow: SAMURAI_ALLOW },
  { name: 'btc', root: 'apps/btc', page: 'index.html', set: ['lsjson:btc:lang'], wait: 9000 },
  { name: 'btc+premium', root: 'apps/btc', page: 'index.html', set: ['lsjson:btc:lang'], wait: 9000, pre: "document.querySelector('button.pg-prem, .prem-strip, .chip.prm-on').click()" },
  ...BTC_CONTENT.map((d) => ({ name: 'btc/' + d, root: 'apps/btc', page: d + '.html', set: ['lsjson:btc:lang'], wait: 3000 })),
  { name: 'eth(coin)', root: 'apps/eth', page: 'index.html', set: ['lsjson:btc:lang'], wait: 9000 },
  ...['privacy', 'terms', '404'].map((d) => ({ name: 'eth(coin)/' + d, root: 'apps/eth', page: d + '.html', set: ['lsjson:btc:lang'], wait: 3000 })),
  { name: 'voca', root: 'apps/voca', page: 'index.html', set: ['lsjson:voca:lang'], wait: 10000 },
  { name: 'voca+premium', root: 'apps/voca', page: 'index.html', set: ['lsjson:voca:lang'], wait: 10000, pre: "(document.querySelector('button.hdr-prem')||document.querySelector('button.prm-chip')).click()" },
  { name: 'voca/contact', root: 'apps/voca', page: 'contact.html', set: ['qs:lang', 'lsjson:voca:lang'], wait: 3500 },
  // exam-vocabulary·tts-pronunciation 은 중국어·일본어 예시 단어(妈·美しい·あいうえお 등)가 원문부터 들어 있는 글 — 가나·한자는 허용, 한글 잔존은 그대로 검사
  ...VOCA_CONTENT.map((d) => ({ name: 'voca/' + d, root: 'apps/voca', page: d + '.html', set: ['lsjson:voca:lang'], wait: 3000, allow: /^(exam-vocabulary|tts-pronunciation)$/.test(d) ? EXAMPLES_ALLOW : undefined })),
  { name: 'voca-tutorial', root: 'apps/voca-tutorial', page: 'index.html', set: ['lsjson:vocatut:lang'], wait: 15000 },
  ...['privacy', 'terms'].map((d) => ({ name: 'voca-tutorial/' + d, root: 'apps/voca-tutorial', page: d + '.html', set: ['lsjson:vocatut:lang'], wait: 3000 })),
  // 写真ならべ = utils 제품의 일본어 브랜드명 — 모든 언어에서 번역명 뒤 괄호로 병기(의도)
  ...['index', '404', 'premium', 'legal/tokushoho', 'legal/terms', 'legal/privacy', 'legal/refund'].map((d) => ({ name: 'home/' + d, root: 'apps/home', page: d + '.html', set: ['qs:lang'], wait: 4500, allow: '写真ならべ' })),
  // dev.broodev.com 은 미들웨어가 활성 홈(dev3)을 루트로 서빙한다 — 404 페이지가 /assets/… 절대경로를 쓰므로 dev3 폴더를 루트로
  ...['index', '404'].map((d) => ({ name: 'dev/dev3/' + d, root: 'apps/dev/dev3', page: d + '.html', set: ['qs:lang'], wait: 4500 })),
  // dev1 · dev2(2026-10-10 13개 언어) — 미리보기 경로 /dev1/ · /dev2/ 와 같은 구조로(상대 경로 자산) apps/dev 를 루트로
  ...['index', '404'].map((d) => ({ name: 'dev/dev1/' + d, root: 'apps/dev', page: 'dev1/' + d + '.html', set: ['qs:lang', 'ls:home:lang'], wait: 6000 })),
  ...['index', 'blog', 'blog-detail', '404'].map((d) => ({ name: 'dev/dev2/' + d, root: 'apps/dev', page: 'dev2/' + d + '.html', set: ['qs:lang', 'ls:home:lang'], wait: 5000 })),
  // 2026-10-10 SEO 로 새로 생긴 404(13개 언어)
  { name: 'samurai/404', root: 'games/samurai', page: '404.html', set: ['qs:lang'], wait: 2500, allow: SAMURAI_ALLOW },
  { name: 'voca-tutorial/404', root: 'apps/voca-tutorial', page: '404.html', set: ['lsjson:vocatut:lang'], wait: 3000 },
  { name: 'admin', root: 'apps/admin', page: 'index.html', set: ['ls:broodev:lang'], wait: 7000 },
  ...['index', 'pptx', 'ai', 'psd', 'pricing', 'contact', '404'].map((d) => ({ name: 'utils/' + d, root: 'apps/utils', page: d + '.html', set: ['qs:lang'], wait: d === 'psd' ? 9000 : 5000 })),
  // 엑셀 에디터(SHEET) · 쿠키 메모장(MEMO) — 2026-10-10. 엑셀은 CDN(x-spreadsheet·ExcelJS·pdf-lib) 로딩이 있어 대기를 길게
  ...['index', '404'].map((d) => ({ name: 'excel/' + d, root: 'apps/excel', page: d + '.html', set: ['qs:lang'], wait: d === 'index' ? 6000 : 3000 })),
  ...['index', '404'].map((d) => ({ name: 'memo/' + d, root: 'apps/memo', page: d + '.html', set: ['qs:lang'], wait: d === 'index' ? 4000 : 3000 })),
  // 지역 앱은 현지어 + 영어 설계 — 영어 화면에 남은 외국 문자만 본다(몽골의 зуд(조드) 같은 현지어 용어 병기는 의도)
  ...REGIONAL_EN.map((a) => ({ name: a + '(en)', root: 'apps/' + a, page: 'index.html', set: ['qs:x'], langs: 'en', wait: 3500, allow: a === 'mongolia' ? '[\u0400-\u04FF]' : undefined })),
  { name: 'greenland(en)', root: 'apps/greenland', page: 'index.html', set: ['lsjson:gl:lang'], langs: 'en', wait: 3500 },
  { name: 'stans(en)', root: 'apps/stans', page: 'index.html', set: ['lsjson:st:lang'], langs: 'en', wait: 3500 },
];

const argv = process.argv.slice(2);
const ji = argv.indexOf('--jobs');
const PAR = ji >= 0 ? +argv[ji + 1] : 5;
const filt = argv.filter((a, i) => !a.startsWith('--') && !(i > 0 && argv[i - 1] === '--jobs'));
const jobs = JOBS.filter((j) => !filt.length || filt.some((f) => j.name.includes(f))).filter((j) => existsSync(join(R, j.root, j.page)));

// 루트 폴더마다 정적 서버 하나
const freePort = () => new Promise((res) => { const s = net.createServer(); s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => res(p)); }); });
const servers = {};
const ready = (port) => new Promise((res) => { const t0 = Date.now(); const tick = () => { const c = net.connect(port, '127.0.0.1'); c.on('connect', () => { c.destroy(); res(true); }); c.on('error', () => { c.destroy(); Date.now() - t0 > 8000 ? res(false) : setTimeout(tick, 150); }); }; tick(); });
for (const root of [...new Set(jobs.map((j) => j.root))]) {
  const port = await freePort();
  const py = process.platform === 'win32' ? 'python' : 'python3';
  servers[root] = { port, proc: spawn(py, ['-m', 'http.server', String(port), '--bind', '127.0.0.1', '--directory', join(R, root)], { stdio: 'ignore' }) };
  await ready(port);
}
const stopAll = () => { for (const s of Object.values(servers)) { try { s.proc.kill(); } catch (e) {} } };
process.on('exit', stopAll); process.on('SIGINT', () => { stopAll(); process.exit(130); });

const results = [];
const run = (j) => new Promise((res) => {
  const out = join(OUT, j.name.replace(/[^a-z0-9._-]+/gi, '_') + '.json');
  const args = [join(R, 'scripts', 'i18n-scan.mjs'), '--url', `http://127.0.0.1:${servers[j.root].port}/${j.page}`, '--wait', String(j.wait), '--json', out, '--langs', j.langs || 'all'];
  for (const s of j.set) args.push('--set', s);
  if (j.pre) args.push('--pre', j.pre);
  if (j.allow) args.push('--allow', j.allow);
  const p = spawn(process.execPath, args, { stdio: ['ignore', 'pipe', 'pipe'] });
  let log = '';
  p.stdout.on('data', (d) => { log += d; }); p.stderr.on('data', (d) => { log += d; });
  p.on('close', (code) => {
    let data = null; try { data = JSON.parse(readFileSync(out, 'utf8')); } catch (e) {}
    const per = data ? Object.entries(data.results).map(([l, r]) => [l, r.mismatches.length, r.htmlLang, r.jsExceptions.length]) : [];
    const bad = per.filter((x) => x[1]);
    results.push({ j, code, per, bad, data, log });
    const sum = data ? (bad.length ? 'FAIL ' + bad.map((b) => `${b[0]}:${b[1]}`).join(' ') : 'clean') : 'ERROR ' + log.split('\n').slice(-3).join(' | ');
    console.log(`${(bad.length || !data ? '✗' : '✓')} ${j.name.padEnd(26)} ${sum}`);
    res();
  });
});
const queue = jobs.slice();
await Promise.all(Array.from({ length: Math.max(1, PAR) }, async () => { while (queue.length) await run(queue.shift()); }));

const failed = results.filter((r) => r.bad.length || !r.data);
if (failed.length) {
  console.log('\n── 불일치 상세 (항목별 앞 6줄) ──');
  for (const r of failed) {
    console.log('▶ ' + r.j.name);
    if (!r.data) { console.log('   ' + r.log.trim().split('\n').slice(-4).join('\n   ')); continue; }
    let n = 0;
    for (const [l, x] of Object.entries(r.data.results)) for (const m of x.mismatches) { if (n++ < 6) console.log(`   [${l}] ${m.kind} ${m.scripts.join('+')} ${m.where} «${m.text.slice(0, 90)}»`); }
  }
}
const exc = results.filter((r) => r.per.some((x) => x[3]));
if (exc.length) console.log('\nJS 예외가 난 항목: ' + exc.map((r) => r.j.name).join(', '));
console.log(`\n${results.length}개 항목 · ${failed.length ? failed.length + '개 불일치' : 'ALL CLEAN'} · 원본 ${OUT}`);
stopAll();
process.exit(failed.length ? 1 : 0);
