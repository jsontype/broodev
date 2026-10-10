#!/usr/bin/env node
// sitemap.xml 생성기 — 페이지마다 기준 언어 주소 + 12개 언어 주소(?lang=xx)를 각각 <url> 로, 각 <url> 에 같은 xhtml:link 묶음
// (기준 언어 → 기준 주소 · 나머지 → ?lang=xx · x-default → 영어 버전)을 넣는다. packages/seo/README.md L4·L5 — HTML <head> 의 hreflang 과 같은 집합.
//   node scripts/seo-sitemap-gen.mjs <app…|all>          다시 쓰기
//   node scripts/seo-sitemap-gen.mjs <app…|all> --check  다르면 exit 1
// 대상: memo · excel · home(포털 / · /premium · /legal/*) · dev(dev3 를 비롯한 활성 홈이 서빙하는 / — 세 사이트 폴더에 같은 파일)
// lastmod 는 아래 표의 날짜(내용이 실제로 바뀐 날)를 손으로 올린다.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const R = join(dirname(fileURLToPath(import.meta.url)), '..');
const LANGS = ['ko', 'en', 'ja', 'zh', 'zh-Hant', 'th', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'nl'];
const HREFLANG = { zh: 'zh-Hans' };

const APPS = {
  memo: { origin: 'https://memo.broodev.com', out: ['apps/memo/sitemap.xml'], pages: [{ path: '/', base: 'ko', lastmod: '2026-10-10' }] },
  excel: { origin: 'https://excel.broodev.com', out: ['apps/excel/sitemap.xml'], pages: [{ path: '/', base: 'ko', lastmod: '2026-10-10' }] },
  home: {
    origin: 'https://broodev.com', out: ['apps/home/sitemap.xml'],
    pages: [
      { path: '/', base: 'ko', lastmod: '2026-10-10' },
      { path: '/premium', base: 'ja', lastmod: '2026-10-10' },
      { path: '/legal/tokushoho', base: 'ja', lastmod: '2026-10-10' },
      { path: '/legal/terms', base: 'ja', lastmod: '2026-10-10' },
      { path: '/legal/privacy', base: 'ja', lastmod: '2026-10-10' },
      { path: '/legal/refund', base: 'ja', lastmod: '2026-10-10' },
    ],
  },
  dev: {
    origin: 'https://dev.broodev.com', out: ['apps/dev/dev1/sitemap.xml', 'apps/dev/dev2/sitemap.xml', 'apps/dev/dev3/sitemap.xml'],
    pages: [{ path: '/', base: 'ko', lastmod: '2026-10-10' }],
  },
};

const url = (origin, path, lang, base) => origin + path + (lang === base ? '' : '?lang=' + encodeURIComponent(lang));
function build(name, app) {
  const L = ['<?xml version="1.0" encoding="UTF-8"?>',
    '<!-- 자동 생성 — node scripts/seo-sitemap-gen.mjs ' + name + '. 언어 버전마다 <url> + 같은 xhtml:link 묶음(기준 언어 → 기준 주소 · x-default → 영어). packages/seo/README.md L4·L5 -->',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'];
  for (const pg of app.pages) {
    const alts = LANGS.map((l) => '    <xhtml:link rel="alternate" hreflang="' + (HREFLANG[l] || l) + '" href="' + url(app.origin, pg.path, l, pg.base) + '"/>');
    alts.push('    <xhtml:link rel="alternate" hreflang="x-default" href="' + url(app.origin, pg.path, 'en', pg.base) + '"/>');
    const order = [pg.base, ...LANGS.filter((l) => l !== pg.base)];
    for (const l of order) {
      L.push('  <url>', '    <loc>' + url(app.origin, pg.path, l, pg.base) + '</loc>', '    <lastmod>' + pg.lastmod + '</lastmod>', ...alts, '  </url>');
    }
  }
  L.push('</urlset>', '');
  return L.join('\n');
}

const argv = process.argv.slice(2);
const check = argv.includes('--check');
let names = argv.filter((a) => !a.startsWith('--'));
if (!names.length || names.includes('all')) names = Object.keys(APPS);
let bad = 0;
for (const name of names) {
  const app = APPS[name];
  if (!app) { console.error('모르는 앱: ' + name); process.exit(2); }
  const body = build(name, app);
  for (const o of app.out) {
    const f = join(R, o);
    const cur = existsSync(f) ? readFileSync(f, 'utf8').replace(/\r\n/g, '\n') : '';
    if (cur === body) { console.log('같음 ' + o); continue; }
    if (check) { console.log('다름 ' + o); bad++; continue; }
    writeFileSync(f, body);
    console.log('썼음 ' + o + ' — ' + app.pages.length + '쪽 × 13');
  }
}
process.exit(bad ? 1 : 0);
