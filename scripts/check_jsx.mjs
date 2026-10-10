/**
 * JSX 컴파일 검증(문법) — 사전 컴파일 앱의 원문 app.jsx, 또는 무빌드 앱 index.html 안의 <script type="text/babel"> 블록
 *   node scripts/check_jsx.mjs                      # apps/<앱>/app.jsx 전부(btc + 코인 14종 — 2026-10-10 부터 btc 는 app.jsx → app.js)
 *   node scripts/check_jsx.mjs apps/btc/app.jsx     # 파일 하나(.jsx)
 *   node scripts/check_jsx.mjs apps/voca/index.html # text/babel 블록이 있는 HTML
 * app.js 가 app.jsx 의 최신 빌드인지는 node scripts/build-jsx.mjs --check (verify-coins.mjs 도 검사).
 * 의존성: %TEMP%\babel-lint 의 @babel/core + @babel/preset-react, 없으면 @babel/standalone(레포 node_modules · npm i --no-save @babel/standalone).
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const R = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const OPTS = { sourceType: 'script', presets: [['react', { runtime: 'classic' }]] };

function loadTransform() {
  const base = join(process.env.TEMP || '', 'babel-lint', 'node_modules', '@babel');
  try {
    const core = require(join(base, 'core'));
    const preset = join(base, 'preset-react');
    return (code, filename) => core.transformSync(code, { ...OPTS, presets: [[preset, { runtime: 'classic' }]], filename, babelrc: false, configFile: false });
  } catch (e) { /* standalone 으로 */ }
  for (const c of [join(R, 'node_modules', '@babel', 'standalone'), '@babel/standalone']) {
    try { const B = require(c); return (code, filename) => B.transform(code, { ...OPTS, filename }); } catch (e) { /* 다음 */ }
  }
  console.error('Babel 을 찾지 못했습니다. 레포 루트에서 1회 실행: npm i --no-save @babel/standalone');
  process.exit(2);
}

const targets = process.argv.slice(2);
if (!targets.length) {
  for (const d of readdirSync(join(R, 'apps'), { withFileTypes: true })) {
    const idx = join(R, 'apps', d.name, 'index.html');
    // 사전 컴파일 앱(index.html 에 <script src="app.js?v=…" defer>)만 — admin 처럼 브라우저 Babel 로 app.jsx 를 읽는 앱은 경로로 직접 줄 것
    if (d.isDirectory() && existsSync(join(R, 'apps', d.name, 'app.jsx')) && existsSync(idx) && /<script src="app\.js\?v=[0-9a-f]*" defer><\/script>/.test(readFileSync(idx, 'utf8'))) targets.push(join('apps', d.name, 'app.jsx'));
  }
  if (!targets.length) { console.error('app.jsx 가 있는 앱이 없습니다 — 사용법: node scripts/check_jsx.mjs [<app.jsx | index.html> ...]'); process.exit(1); }
}
const transform = loadTransform();
let fail = 0;
for (const target of targets) {
  const src = readFileSync(resolve(R, target), 'utf8');
  const blocks = /\.jsx$/i.test(target) ? [src] : [...src.matchAll(/<script type="text\/babel"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (!blocks.length) { console.error(`${target}: text/babel 스크립트 블록 없음`); fail++; continue; }
  for (const [i, code] of blocks.entries()) {
    const label = blocks.length > 1 ? `${target} 블록 ${i + 1}/${blocks.length}` : target;
    try {
      transform(code, /\.jsx$/i.test(target) ? target : `block${i}.jsx`);
      console.log(`${label}: JSX OK`);
    } catch (e) {
      console.error(`${label}: JSX FAIL — ${String(e.message).split('\n')[0]}`);
      fail++;
    }
  }
}
process.exit(fail ? 1 : 0);
