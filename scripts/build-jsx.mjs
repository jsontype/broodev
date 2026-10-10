#!/usr/bin/env node
// JSX 사전 컴파일 — apps/<앱>/app.jsx(원문) → app.js(브라우저가 그대로 실행하는 압축 JS) + index.html 의 <script src="app.js?v=<해시>" defer>
//   node scripts/build-jsx.mjs              # 사전 컴파일 앱 전부(app.jsx + index.html 에 app.js?v= 태그 — btc + 코인 14종)
//   node scripts/build-jsx.mjs btc eth      # 고른 앱만(apps/btc 처럼 경로로 줘도 됨)
//   node scripts/build-jsx.mjs --check      # 쓰지 않고 검사만: app.js 가 app.jsx 의 최신 빌드인지(해시) · index.html ?v= 가 app.js 와 맞는지 → 다르면 exit 1
//
// 왜(2026-10-10): 예전에는 index.html 안의 <script type="text/babel"> 약 2,600줄을 @babel/standalone(약 3MB)이 방문할 때마다 브라우저에서 변환했다
//   → 실측 load 데스크톱 10.5s · 모바일 15.6s(FCP 14.8s). 구글 렌더 지연 · Core Web Vitals 불량. 이제 변환은 여기서 한 번만 한다.
// 변환 규칙 = 예전 브라우저 변환과 같은 JSX 변환(preset-react · classic runtime → React.createElement). 그 밖의 문법은 손대지 않는다(최신 브라우저 그대로).
//   app.js 는 전역 스크립트(모듈 아님)라 최상위 const/function 이 예전처럼 전역이다. defer = 문서 파싱 뒤 · DOMContentLoaded 전에 실행.
// app.js 첫 줄 주석에 원문 해시(src-sha256 = app.jsx 를 LF 로 맞춘 내용의 sha256)를 적는다 — verify-coins.mjs 와 --check 가 이걸로 「최신 빌드인지」 본다.
// ?v= = app.js 내용의 sha256 앞 10자리(캐시 무효화).
// 코인 앱 14종의 app.jsx 는 python scripts/gen_coin.py 가 apps/btc/app.jsx 에서 만들고 이 스크립트로 컴파일까지 한다(코인 쪽을 손으로 고치지 말 것).
//
// 의존성: @babel/standalone(7 또는 8). 찾는 곳: 환경변수 BABEL_STANDALONE(패키지 폴더) → 레포 node_modules → %TEMP%/babel-lint/node_modules → 일반 require 해석.
//   없으면: 레포 루트에서 1회 `npm i --no-save @babel/standalone`
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { resolve, dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const R = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const argv = process.argv.slice(2);
const CHECK = argv.includes('--check');
const QUIET = argv.includes('--quiet');
const picks = argv.filter((a) => !a.startsWith('--'));

export const TAG_RE = /<script src="app\.js\?v=([0-9a-f]*)" defer><\/script>/g;
const HEAD_RE = /^\/\* 생성 파일[^\n]*\| src-sha256=([0-9a-f]{64}) \*\/\n/;
const sha = (s) => createHash('sha256').update(s).digest('hex');
// 원문 해시: 줄바꿈(CRLF/LF)·BOM 과 무관하게
export const srcHash = (jsx) => sha(jsx.replace(/^﻿/, '').replace(/\r\n/g, '\n'));

function loadBabel() {
  const cands = [process.env.BABEL_STANDALONE, join(R, 'node_modules', '@babel', 'standalone'),
    process.env.TEMP && join(process.env.TEMP, 'babel-lint', 'node_modules', '@babel', 'standalone'), '@babel/standalone'].filter(Boolean);
  for (const c of cands) {
    try { return require(c); } catch (e) { /* 다음 후보 */ }
  }
  console.error('@babel/standalone 을 찾지 못했습니다. 레포 루트에서 1회 실행: npm i --no-save @babel/standalone\n' +
    '  (다른 곳에 있으면 BABEL_STANDALONE=<…/node_modules/@babel/standalone> 로 지정)');
  process.exit(2);
}

export function compile(B, jsx, file = 'app.jsx') {
  const code = B.transform(jsx, {
    filename: file,
    sourceType: 'script',
    presets: [['react', { runtime: 'classic' }]],
    compact: true, minified: true, comments: false,
  }).code;
  const head = `/* 생성 파일 — 손으로 고치지 말 것. 원본 app.jsx → node scripts/build-jsx.mjs (@babel/standalone ${B.version} · preset-react classic · minified) | src-sha256=${srcHash(jsx)} */\n`;
  return head + code + '\n';
}

function appsWithJsx() {
  return readdirSync(join(R, 'apps'), { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(R, 'apps', d.name, 'app.jsx')) && existsSync(join(R, 'apps', d.name, 'index.html')))
    .filter((d) => [...readFileSync(join(R, 'apps', d.name, 'index.html'), 'utf8').matchAll(TAG_RE)].length > 0)   // 사전 컴파일 앱만(admin 처럼 브라우저 Babel 로 app.jsx 를 읽는 앱은 제외)
    .map((d) => d.name);
}

// 검사(바벨 불필요): 문제 문자열 배열(비면 통과)
export function checkApp(dir) {
  const bad = [];
  const jsxP = join(dir, 'app.jsx'), jsP = join(dir, 'app.js'), idxP = join(dir, 'index.html');
  if (!existsSync(jsxP)) return ['app.jsx 없음'];
  if (!existsSync(jsP)) return ['app.js 없음 — node scripts/build-jsx.mjs ' + basename(dir)];
  const js = readFileSync(jsP, 'utf8').replace(/\r\n/g, '\n');   // git core.autocrlf 로 CRLF 가 돼도 같은 해시(배포본·저장소는 LF)
  const m = HEAD_RE.exec(js);
  if (!m) bad.push('app.js 머리 주석(src-sha256) 없음');
  else if (m[1] !== srcHash(readFileSync(jsxP, 'utf8'))) bad.push('app.js 가 app.jsx 최신 빌드가 아님 — node scripts/build-jsx.mjs ' + basename(dir));
  const idx = readFileSync(idxP, 'utf8');
  const tags = [...idx.matchAll(TAG_RE)];
  if (tags.length !== 1) bad.push('index.html 의 <script src="app.js?v=…" defer> 가 ' + tags.length + '개');
  else if (tags[0][1] !== sha(js).slice(0, 10)) bad.push('index.html ?v=' + tags[0][1] + ' ≠ app.js 해시 ' + sha(js).slice(0, 10));
  if (/<script type="text\/babel"/.test(idx) || /@babel\/standalone/.test(idx)) bad.push('index.html 에 브라우저 Babel(text/babel · @babel/standalone)이 남아 있음');
  return bad;
}

export function buildApp(B, dir) {
  const jsx = readFileSync(join(dir, 'app.jsx'), 'utf8');
  const js = compile(B, jsx);
  const jsP = join(dir, 'app.js');
  const prev = existsSync(jsP) ? readFileSync(jsP, 'utf8').replace(/\r\n/g, '\n') : null;   // CRLF 체크아웃이어도 내용이 같으면 그대로 둔다(검사·?v= 는 LF 기준 해시)
  if (prev !== js) writeFileSync(jsP, js);
  const idxP = join(dir, 'index.html');
  const idx = readFileSync(idxP, 'utf8');
  const n = [...idx.matchAll(TAG_RE)].length;
  if (n !== 1) throw new Error(`${idxP}: <script src="app.js?v=…" defer></script> 가 ${n}개(1개여야 함)`);
  const v = sha(js).slice(0, 10);
  const out = idx.replace(TAG_RE, `<script src="app.js?v=${v}" defer></script>`);
  if (out !== idx) writeFileSync(idxP, out);
  return { v, bytes: Buffer.byteLength(js), changed: prev !== js || out !== idx };
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const apps = (picks.length ? picks : appsWithJsx()).map((a) => basename(a.replace(/[\\/]+$/, '')));
  if (!apps.length) { console.error('app.jsx 가 있는 앱이 없습니다'); process.exit(1); }
  if (CHECK) {
    let fail = 0;
    for (const a of apps) {
      const bad = checkApp(join(R, 'apps', a));
      if (bad.length) { fail++; console.log(`  ❌ ${a}: ${bad.join(' · ')}`); } else if (!QUIET) console.log(`  ✅ ${a}: app.js = app.jsx 최신 빌드`);
    }
    process.exit(fail ? 1 : 0);
  }
  const B = loadBabel();
  for (const a of apps) {
    const dir = join(R, 'apps', a);
    if (!existsSync(join(dir, 'app.jsx'))) { console.error(`apps/${a}/app.jsx 없음`); process.exit(1); }
    try {
      const r = buildApp(B, dir);
      if (!QUIET || r.changed) console.log(`  ${r.changed ? 'built' : 'same '} apps/${a}/app.js (${(r.bytes / 1024).toFixed(1)} KB · v=${r.v})`);
    } catch (e) {
      console.error(`  ❌ apps/${a}: ${String(e.message).split('\n')[0]}`);
      process.exit(1);
    }
  }
}
