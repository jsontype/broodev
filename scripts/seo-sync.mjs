#!/usr/bin/env node
// packages/seo 공용 파일을 각 앱 사본으로 퍼뜨린다(사본 방식 — 앱마다 Pages 프로젝트가 따로라 런타임 공유 불가).
//   node scripts/seo-sync.mjs                          사본이 이미 있는 앱 전부를 원본으로 갱신
//   node scripts/seo-sync.mjs --check                  사본이 원본과 다르면 목록 출력 + exit 1 (갱신 안 함)
//   node scripts/seo-sync.mjs --add <app> [--suggest] [--fn]   새 앱에 사본 추가(앱 = apps/<app> 또는 games/<app>)
// 대상 판별: <앱>/lang-suggest.js 가 있으면 lang-suggest · <앱>/functions/_lib/seo-lang.js 가 있으면 seo-lang.
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = {
  suggest: { from: join(ROOT, 'packages/seo/lang-suggest.js'), to: 'lang-suggest.js' },
  fn: { from: join(ROOT, 'packages/seo/seo-lang.js'), to: 'functions/_lib/seo-lang.js' },
};
const argv = process.argv.slice(2);
const check = argv.includes('--check');
const addAt = argv.indexOf('--add');

function appDirs() {
  const out = [];
  for (const top of ['apps', 'games']) {
    const d = join(ROOT, top);
    if (!existsSync(d)) continue;
    for (const n of readdirSync(d)) {
      const p = join(d, n);
      if (!statSync(p).isDirectory()) continue;
      out.push({ name: n, dir: p, rel: top + '/' + n });
      // 한 단계 아래 사이트 폴더(예: apps/dev/dev1 · dev2 · dev3 — 활성 홈이 / 로 재작성되는 구조)의 사본도 대상
      for (const m of readdirSync(p)) {
        const q = join(p, m);
        if (!m.startsWith('.') && m !== 'functions' && m !== 'node_modules' && statSync(q).isDirectory() && existsSync(join(q, 'lang-suggest.js'))) out.push({ name: n + '/' + m, dir: q, rel: top + '/' + n + '/' + m });
      }
    }
  }
  return out;
}
// 원본의 줄바꿈을 그대로(LF) — 앱 사본도 같은 바이트여야 --check 가 통과
const body = (k) => readFileSync(SRC[k].from, 'utf8');

if (addAt >= 0) {
  const name = argv[addAt + 1];
  const app = appDirs().find((a) => a.name === name);
  if (!app) { console.error('앱 없음: ' + name); process.exit(2); }
  const kinds = ['suggest', 'fn'].filter((k) => argv.includes('--' + k));
  if (!kinds.length) { console.error('--suggest 와/또는 --fn 을 지정'); process.exit(2); }
  for (const k of kinds) {
    const to = join(app.dir, SRC[k].to);
    mkdirSync(dirname(to), { recursive: true });
    writeFileSync(to, body(k));
    console.log('추가 ' + app.rel + '/' + SRC[k].to);
  }
  process.exit(0);
}

let diff = 0, wrote = 0, seen = 0;
for (const app of appDirs()) {
  for (const k of Object.keys(SRC)) {
    const to = join(app.dir, SRC[k].to);
    if (!existsSync(to)) continue;
    seen++;
    const want = body(k);
    if (readFileSync(to, 'utf8') === want) continue;
    if (check) { console.log('다름 ' + app.rel + '/' + SRC[k].to); diff++; }
    else { writeFileSync(to, want); console.log('갱신 ' + app.rel + '/' + SRC[k].to); wrote++; }
  }
}
console.log((check ? '검사' : '동기화') + ' — 사본 ' + seen + '개' + (check ? ', 다름 ' + diff : ', 갱신 ' + wrote));
process.exit(check && diff ? 1 : 0);
