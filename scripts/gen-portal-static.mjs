#!/usr/bin/env node
// 포털(apps/home/index.html) 원본 HTML 의 정적 앱 목록 · 숫자 생성기 (packages/seo/README.md L6)
//   node scripts/gen-portal-static.mjs           다시 쓰기
//   node scripts/gen-portal-static.mjs --check   다르면 exit 1
// 왜: 포털은 앱 목록을 JS(portal.js)로만 그려서, JS 를 돌리지 않는 크롤러에겐 앱 링크가 4개뿐이었고 숫자는 'Apps (0)' 였다(2026-10-10 SEO 점검).
//     이제 원본 HTML 의 #sitemap-list 안에 기준 언어(ko) 전체 목록을 넣어 두고(마커 <!-- @static-apps --> 사이), JS 가 돌면 portal.js 가 그 자리를
//     비우고 현재 언어로 다시 그린다. data-count 원본 값도 카탈로그 숫자로 채운다. catalog.js 나 i18n-data.js(ko) 를 고치면 다시 돌린다.
//     status 'soon'(도메인 미연결) 앱은 링크 없이 「준비 중」 카드 — portal.js linkAttrs 와 같은 규칙.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const R = join(dirname(fileURLToPath(import.meta.url)), '..');
const HOME = join(R, 'apps/home');
const ctx = {}; ctx.window = ctx; ctx.globalThis = ctx;
vm.createContext(ctx);
for (const f of ['assets/js/catalog.js', 'assets/js/i18n-data.js']) vm.runInContext(readFileSync(join(HOME, f), 'utf8'), ctx, { filename: f });
const C = ctx.BROODEV_CATALOG, D = ctx.BROODEV_I18N.ko;

// portal.js 의 도우미와 같은 규칙(기준 언어 ko 사전 → 없으면 카탈로그 한국어 원문)
const T = (key, vars, fb) => {
  let s = D[key] != null ? D[key] : (fb != null ? fb : key);
  if (vars) s = String(s).replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? vars[k] : ''));
  return s;
};
const kid = (id) => String(id).replace(/-/g, '_');
const catName = (cat) => T('cat_' + kid(cat.id) + '_name', null, cat.name);
const appName = (a) => (a.ticker && a.coin ? T('coin_name', { coin: T('coin_' + kid(a.id), null, a.coin) }, a.name) : T('app_' + kid(a.id) + '_name', null, a.name));
const appDesc = (a) => (a.ticker && a.coin ? T('coin_desc', { coin: T('coin_' + kid(a.id), null, a.coin), ticker: a.ticker }, a.desc) : T('app_' + kid(a.id) + '_desc', null, a.desc));
const nApps = (n) => T('n_apps', { n }, '앱 ' + n + '개');
const host = (url) => { try { return new URL(url).host.replace(/^www\./, ''); } catch (e) { return url; } };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function staticList(ind) {
  const L = [];
  for (const cat of C.categories) {
    L.push(ind + '<section class="sitemap-cat" data-cat="' + esc(cat.id) + '" aria-labelledby="sitemap-cat-' + esc(cat.id) + '">');
    L.push(ind + '    <header class="sitemap-cat-head"><span class="numeral">' + esc(cat.numeral) + '</span><h4 id="sitemap-cat-' + esc(cat.id) + '">' + esc(catName(cat)) +
      '<small>' + esc(nApps(cat.count)) + '</small></h4><span class="en" translate="no" aria-hidden="true" data-i18n-skip="">' + esc(cat.en) + '</span></header>');
    L.push(ind + '    <ul class="sitemap-list">');
    for (const a of cat.apps) {
      const badge = a.status === 'soon' ? '<span class="app-badge soon">' + esc(T('badge_soon', null, '준비 중')) + '</span>' : (a.status === 'beta' ? '<span class="app-badge">' + esc(T('badge_beta', null, 'beta')) + '</span>' : '');
      const attrs = a.status === 'soon' ? 'role="link" aria-disabled="true" class="is-soon"' : 'href="' + esc(a.url) + '" target="_blank" rel="noopener"';
      L.push(ind + '        <li><a ' + attrs + ' title="' + esc(appDesc(a)) + '"><span class="name">' + esc(appName(a)) + badge + '</span><span class="host">' + esc(host(a.url)) + '</span></a></li>');
    }
    L.push(ind + '    </ul>');
    L.push(ind + '</section>');
  }
  return L;
}

const file = join(HOME, 'index.html');
const src = readFileSync(file, 'utf8');
const eol = src.includes('\r\n') ? '\r\n' : '\n';
let s = src;

// 1) #sitemap-list 안쪽
const open = /(<nav class="sitemap-grid" id="sitemap-list"[^>]*>)([\s\S]*?)(\r?\n[ \t]*<\/nav>)/.exec(s);
if (!open) { console.error('index.html 에서 #sitemap-list 를 찾지 못함'); process.exit(2); }
const ind = (/\n([ \t]*)<nav class="sitemap-grid"/.exec(s) || [, '                '])[1] + '    ';
const inner = [ind + '<!-- @static-apps: node scripts/gen-portal-static.mjs 가 catalog.js(ko)에서 생성 — 크롤러·무JS 용. JS 가 돌면 portal.js 가 비우고 현재 언어로 다시 그린다 -->',
  ...staticList(ind), ind + '<!-- @/static-apps -->'].join(eol);
s = s.replace(open[0], open[1] + eol + inner + open[3]);

// 2) data-count 원본 숫자
const count = (k) => {
  if (k === 'total') return C.total;
  if (k === 'categories') return C.categories.length;
  if (k === 'languages') return C.languages;
  if (k.startsWith('cat:')) { const c = C.categories.find((x) => x.id === k.slice(4)); return c ? c.count : 0; }
  return null;
};
s = s.replace(/(<span data-count="([^"]+)">)(\d+)(<\/span>)/g, (all, a, k, v, b) => { const n = count(k); return n == null ? all : a + n + b; });

if (process.argv.includes('--check')) {
  if (s !== src) { console.log('다름 — node scripts/gen-portal-static.mjs 로 다시 생성'); process.exit(1); }
  console.log('index.html 정적 목록·숫자 = 카탈로그와 같음');
} else if (s !== src) {
  writeFileSync(file, s);
  console.log('썼음 apps/home/index.html — 카테고리 ' + C.categories.length + ' · 앱 ' + C.total + ' (링크 ' + C.apps.filter((a) => a.status !== 'soon').length + ')');
} else console.log('그대로 apps/home/index.html');
