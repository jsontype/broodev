#!/usr/bin/env node
// 언어별 서버 메타(functions/_lib/seo-meta.js) 생성기 — 앱 사전(13개 언어)에서 페이지·언어별 title/description(+og)을 뽑아
// packages/seo/seo-lang.js 가 ?lang=xx 응답에 쓰는 표로 만든다(packages/seo/README.md L3). 손으로 seo-meta.js 를 고치지 말 것.
//   node scripts/seo-meta-gen.mjs <app…|all>          다시 쓰기
//   node scripts/seo-meta-gen.mjs <app…|all> --check  사전과 다르면 exit 1 (쓰지 않음)
// 대상: memo · excel · home(포털 + premium/legal) · dev(dev1·dev2·dev3 — 활성 사이트가 / 에 서빙되므로 사이트별 표)
// 사전을 고치면(메타 제목·설명 문구) 반드시 다시 돌린다. 다른 앱(utils · voca · samurai · btc)은 각자의 생성기를 쓴다(ARCHITECTURE.md SEO 절).
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const R = join(dirname(fileURLToPath(import.meta.url)), '..');
const LANGS = ['en', 'ja', 'ko', 'zh', 'zh-Hant', 'th', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'nl'];
const rd = (p) => readFileSync(join(R, p), 'utf8');

// 브라우저용 IIFE 사전 파일을 Node vm 에서 평가(window/globalThis 에 붙는 전역을 돌려준다)
function loadGlobals(files, extra = {}) {
  const ctx = { console, location: { search: '', href: 'https://example.invalid/' }, navigator: { languages: ['ko'], language: 'ko' }, ...extra };
  ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
  ctx.document = { documentElement: { getAttribute: () => 'ko', setAttribute() {}, lang: 'ko' }, querySelector: () => null, querySelectorAll: () => [], addEventListener() {}, readyState: 'complete' };
  ctx.localStorage = { getItem: () => null, setItem() {} };
  vm.createContext(ctx);
  for (const f of files) vm.runInContext(rd(f), ctx, { filename: f });
  return ctx;
}
const clean = (s) => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
const htmlText = (s) => clean(String(s).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' '));

const APPS = {
  memo: {
    out: 'apps/memo/functions/_lib/seo-meta.js', src: 'apps/memo/js/i18n.js', base: 'ko',
    build() {
      const I = loadGlobals([this.src]).MemoI18n;
      return { '/': perLang(this.base, (l) => ({ t: I.t(l, 'metaTitle'), d: I.t(l, 'metaDesc') })) };
    },
  },
  excel: {
    out: 'apps/excel/functions/_lib/seo-meta.js', src: 'apps/excel/js/i18n.js', base: 'ko',
    build() {
      const I = loadGlobals([this.src]).SheetI18n;
      return { '/': perLang(this.base, (l) => ({ t: I.t(l, 'title'), d: I.t(l, 'desc'), ot: I.t(l, 'ogTitle'), od: I.t(l, 'ogDesc') })) };
    },
  },
  home: {
    out: 'apps/home/functions/_lib/seo-meta.js', base: 'ko', baseNote: 'ko(/) · ja(/premium · /legal/*)',
    srcNote: 'apps/home/assets/js/i18n-data.js(meta_title · meta_desc · og_*) · premium.html · legal/*.html 의 <article data-lang-block data-title data-desc> + legal/i18n/<doc>.<lang>.html',
    build() {
      const D = loadGlobals(['apps/home/assets/js/i18n-data.js']).BROODEV_I18N;
      const meta = { '/': perLang('ko', (l) => ({ t: D[l].meta_title, d: D[l].meta_desc, ot: D[l].og_title, od: D[l].og_desc })) };
      const attr = (tag, name) => { const m = new RegExp(name + '="([^"]*)"').exec(tag || ''); return m ? htmlText(m[1]) : ''; };
      const DOCS = { '/premium': ['apps/home/premium.html', 'premium'], '/legal/tokushoho': ['apps/home/legal/tokushoho.html', 'tokushoho'],
        '/legal/terms': ['apps/home/legal/terms.html', 'terms'], '/legal/privacy': ['apps/home/legal/privacy.html', 'privacy'], '/legal/refund': ['apps/home/legal/refund.html', 'refund'] };
      for (const [path, [file, doc]] of Object.entries(DOCS)) {
        const html = rd(file), art = {};
        for (const m of html.matchAll(/<article[^>]*data-lang-block="([A-Za-z-]+)"[^>]*>/g)) art[m[1]] = m[0];
        meta[path] = perLang('ja', (l) => {
          let tag = art[l];
          if (!tag) { const fr = rd('apps/home/legal/i18n/' + doc + '.' + l + '.html'); const m = /<article[^>]*>/.exec(fr); tag = m && m[0]; }
          return { t: attr(tag, 'data-title'), d: attr(tag, 'data-desc') };
        });
      }
      return meta;
    },
  },
  stans: {
    out: 'apps/stans/functions/_lib/seo-meta.js', base: 'ru', srcNote: 'apps/stans/index.html 의 인라인 사전 T.en(docTitle · metaDesc · ogTitle · ogDesc) — 지역 패널, 기준 ru + en 하나',
    build() {
      const html = rd('apps/stans/index.html');
      const a = html.indexOf('var T = {');
      const m = /\n([ \t]+)en: \{/.exec(html.slice(a));
      if (a < 0 || !m) throw new Error('stans index.html 의 T.en 을 찾지 못함');
      const st = a + m.index, en = html.indexOf('\n' + m[1] + '}', st + 1);
      const blk = html.slice(st, en);
      const get = (k) => { const r = new RegExp(k + ": '((?:[^'\\\\]|\\\\.)*)'").exec(blk); if (!r) throw new Error('stans T.en.' + k + ' 없음'); return r[1].replace(/\\'/g, "'"); };
      const o = { t: clean(get('docTitle')), d: clean(get('metaDesc')), ot: clean(get('ogTitle')), od: clean(get('ogDesc')) };
      if (o.ot === o.t) delete o.ot;
      if (o.od === o.d) delete o.od;
      return { '/': { en: o } };
    },
  },
  dev: {
    out: 'apps/dev/functions/_lib/seo-meta.js', src: 'apps/dev/dev1/i18n.js · dev2/assets/js/i18n-data.js · dev3/assets/js/i18n-data.js (meta_title · meta_desc)', base: 'ko',
    // 활성 사이트(ACTIVE · DEV_ACTIVE)가 / 에 서빙되므로 사이트별 표: { dev1: { '/': {…} }, dev2: …, dev3: … }
    build() {
      const src1 = rd('apps/dev/dev1/i18n.js');
      const a = src1.indexOf('var D = {'), b = src1.indexOf('\n  };', a);
      if (a < 0 || b < 0) throw new Error('dev1/i18n.js 의 var D = { … }; 를 찾지 못함');
      const D1 = (0, eval)('(' + src1.slice(a + 'var D = '.length, b + 4) + ')');
      const D2 = loadGlobals(['apps/dev/dev2/assets/js/i18n-data.js']).HOME2_I18N;
      const D3 = loadGlobals(['apps/dev/dev3/assets/js/i18n-data.js']).HOME3_I18N;
      const site = (D) => ({ '/': perLang(this.base, (l) => ({ t: D[l].meta_title, d: D[l].meta_desc })) });
      return { dev1: site(D1), dev2: site(D2), dev3: site(D3) };
    },
  },
};

function perLang(base, fn) {
  const o = {};
  for (const l of LANGS) {
    if (l === base) continue;
    const m = fn(l);
    for (const k of Object.keys(m)) { m[k] = clean(m[k]); if (!m[k]) delete m[k]; }
    if (!m.t || !m.d) throw new Error('빈 메타: ' + l + ' ' + JSON.stringify(m));
    if (m.ot === m.t) delete m.ot;
    if (m.od === m.d) delete m.od;
    o[l] = m;
  }
  return o;
}

export function register(name, def) { APPS[name] = def; }

function render(name, app, meta) {
  return '// 자동 생성 — 직접 고치지 말 것. 원본: ' + (app.srcNote || app.src) + '\n' +
    '// 생성: node scripts/seo-meta-gen.mjs ' + name + '  (검사만: --check) — 사전의 메타 제목·설명을 고치면 다시 돌린다.\n' +
    '// 형식: { 정본 경로: { 언어: { t, d, ot?, od? } } } — 기준 언어(' + (app.baseNote || app.base) + ')는 HTML 원본 그대로라 없음. functions/_middleware.js → seo-lang.js 가 사용.\n' +
    'export default ' + JSON.stringify(meta, null, 2) + ';\n';
}

const argv = process.argv.slice(2);
const check = argv.includes('--check');
let names = argv.filter((a) => !a.startsWith('--'));
if (!names.length || names.includes('all')) names = Object.keys(APPS);
let bad = 0;
for (const name of names) {
  const app = APPS[name];
  if (!app) { console.error('모르는 앱: ' + name + ' (가능: ' + Object.keys(APPS).join(', ') + ')'); process.exit(2); }
  const body = render(name, app, app.build());
  const out = join(R, app.out);
  const cur = existsSync(out) ? readFileSync(out, 'utf8') : '';
  if (check) {
    if (cur !== body) { console.log('다름 ' + app.out + ' — node scripts/seo-meta-gen.mjs ' + name); bad++; }
    else console.log('같음 ' + app.out);
  } else if (cur !== body) {
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, body);
    console.log('썼음 ' + app.out);
  } else console.log('그대로 ' + app.out);
}
process.exit(bad ? 1 : 0);

export { htmlText, loadGlobals, perLang, LANGS };
