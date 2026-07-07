/**
 * 무빌드 앱(index.html 내 <script type="text/babel">) JSX 컴파일 검증
 *   node scripts/check_jsx.mjs apps/voca/index.html
 * 사전 준비: %TEMP%\babel-lint 에 @babel/core, @babel/preset-react 설치
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const base = process.env.TEMP + '\\babel-lint\\node_modules\\@babel\\';
const babel = require(base + 'core');
const target = process.argv[2];
if (!target) { console.error('사용법: node scripts/check_jsx.mjs <index.html 경로>'); process.exit(1); }

const html = readFileSync(target, 'utf8');
const blocks = [...html.matchAll(/<script type="text\/babel"[^>]*>([\s\S]*?)<\/script>/g)];
if (!blocks.length) { console.error('text/babel 스크립트 블록 없음'); process.exit(1); }
for (const [i, m] of blocks.entries()) {
  try {
    babel.transformSync(m[1], { presets: [[base + 'preset-react', {}]], filename: `block${i}.jsx` });
    console.log(`블록 ${i + 1}/${blocks.length}: JSX OK`);
  } catch (e) {
    console.error(`블록 ${i + 1}: JSX FAIL — ${e.message.split('\n')[0]}`);
    process.exit(1);
  }
}
