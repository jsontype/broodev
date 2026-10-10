#!/usr/bin/env node
// functions/_lib/seo-meta.js 생성기 — 앱 사전(js/i18n.js 의 13개 언어 D)에서 페이지별 title_<page> · desc_<page> 를 뽑아 seo-lang 메타로 쓴다.
//   node apps/utils/functions/_lib/seo-meta.gen.mjs          seo-meta.js 다시 쓰기
//   node apps/utils/functions/_lib/seo-meta.gen.mjs --check  사전과 다르면 exit 1 (쓰지 않음)
// js/i18n.js 의 title_* / desc_* 를 고치면 반드시 다시 돌린다(손으로 seo-meta.js 를 고치지 말 것).
// Node 전용 스크립트 — onRequest 를 내보내지 않으므로 Pages Functions 라우트가 되지 않는다(_middleware.js 도 import 하지 않음).
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = join(HERE, '..', '..');
const OUT = join(HERE, 'seo-meta.js');
const BASE = 'ko';
// 정본 경로(확장자 없음) → <body data-page> 값(= 사전 키 접미사)
const PAGES = { '/': 'xlsx', '/pptx': 'pptx', '/ai': 'ai', '/psd': 'psd', '/pricing': 'pricing', '/contact': 'contact' };

// js/i18n.js 의 `var D = { … };` 객체 리터럴만 잘라 평가(사전은 순수 데이터 — 함수·변수 참조 없음)
const src = readFileSync(join(APP, 'js', 'i18n.js'), 'utf8');
const a = src.indexOf('var D = {');
const b = src.indexOf('\n  };\n', a);
if (a < 0 || b < 0) { console.error('js/i18n.js 에서 var D = { … }; 를 찾지 못함'); process.exit(2); }
const D = (0, eval)('(' + src.slice(a + 'var D = '.length, b + 4) + ')');

const meta = {};
for (const [path, page] of Object.entries(PAGES)) {
  meta[path] = {};
  for (const lang of Object.keys(D)) {
    if (lang === BASE) continue;
    const t = D[lang]['title_' + page], d = D[lang]['desc_' + page];
    if (t == null || d == null) { console.error('사전 키 없음: ' + lang + ' title_/desc_' + page); process.exit(2); }
    meta[path][lang] = { t, d };
  }
}

const body =
  '// 자동 생성 — 직접 고치지 말 것. 원본: js/i18n.js 의 title_<page> · desc_<page> (13개 언어 사전)\n' +
  '// 생성: node apps/utils/functions/_lib/seo-meta.gen.mjs  (검사만: --check) — 사전의 제목·설명을 고치면 다시 돌린다.\n' +
  '// 형식: { 정본 경로: { 언어: { t: title, d: description } } } — 기준 언어(' + BASE + ')는 HTML 원본 그대로라 없음. functions/_middleware.js → seo-lang.js 가 사용.\n' +
  'export default ' + JSON.stringify(meta, null, 2) + ';\n';

if (process.argv.includes('--check')) {
  let cur = '';
  try { cur = readFileSync(OUT, 'utf8'); } catch (e) { cur = ''; }
  if (cur !== body) { console.log('다름 — node apps/utils/functions/_lib/seo-meta.gen.mjs 로 다시 생성'); process.exit(1); }
  console.log('seo-meta.js = 사전과 같음');
} else {
  writeFileSync(OUT, body);
  console.log('썼음 ' + OUT + ' — 페이지 ' + Object.keys(meta).length + ' × 언어 ' + Object.keys(meta['/']).length);
}
