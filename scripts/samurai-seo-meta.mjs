#!/usr/bin/env node
// samurai.broodev.com 의 functions/_lib/seo-meta.js 를 게임 사전(games/samurai/index.html 의 I18N)에서 생성한다 — 손으로 베끼지 않기 위해(packages/seo/README.md L3).
//   node scripts/samurai-seo-meta.mjs          생성(덮어씀)
//   node scripts/samurai-seo-meta.mjs --check  파일이 사전과 다르면 exit 1 (scripts/verify-st2.mjs 도 같은 비교를 한다)
// 값은 런타임이 document.title·meta 에 쓰는 식과 같다: t = `${title} — ${tag} | broodev games` · ot(og/twitter 제목) = `${title} — ${tag}` · d = desc.
// 기준 언어 ko 는 원본 HTML 그대로라 넣지 않는다.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const R = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = `${R}/games/samurai/index.html`;
const OUT = `${R}/games/samurai/functions/_lib/seo-meta.js`;

export function buildMeta(html = readFileSync(SRC, 'utf8')) {
  const line = html.split('\n').find((l) => /^\s*var I18N = \{ ko: /.test(l));
  if (!line) throw new Error('I18N 사전 줄을 찾지 못함');
  const I18N = new Function('return (' + line.replace(/^\s*var I18N = /, '').replace(/;\s*$/, '') + ')')();
  const page = {};
  for (const lc of Object.keys(I18N)) {
    if (lc === 'ko') continue;
    const p = I18N[lc];
    page[lc] = { t: `${p.title} — ${p.tag} | broodev games`, ot: `${p.title} — ${p.tag}`, d: p.desc };
  }
  return { '/': page };
}
export function render(meta) {
  return '// 자동 생성 — node scripts/samurai-seo-meta.mjs (games/samurai/index.html 의 I18N 사전에서). 손으로 고치지 말 것.\n' +
    '// functions/_middleware.js → seo-lang.js 가 ?lang=xx 응답의 title·description·og/twitter 를 이 값으로 바꾼다.\n' +
    'export default ' + JSON.stringify(meta, null, 2) + ';\n';
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const want = render(buildMeta());
  if (process.argv.includes('--check')) {
    const cur = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
    if (cur !== want) { console.log('다름 — node scripts/samurai-seo-meta.mjs 로 다시 생성'); process.exit(1); }
    console.log('seo-meta.js = 사전과 같음'); process.exit(0);
  }
  writeFileSync(OUT, want);
  console.log('생성 ' + OUT.replace(R + '/', '') + ' (' + Object.keys(buildMeta()['/']).length + '개 언어)');
}
