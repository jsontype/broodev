#!/usr/bin/env node
// voca · voca-tutorial 의 언어별 서버 메타와 sitemap 을 앱 사전에서 생성한다(packages/seo/README.md L3 · L4 · L5 — 손으로 베끼지 않기).
//   node scripts/seo-meta-voca.mjs           생성(바뀐 파일만 덮어씀)
//   node scripts/seo-meta-voca.mjs --check   생성 결과와 파일이 다르면 목록 + exit 1 (사전·조각을 고친 뒤 생성을 잊었는지)
// 원천 → 결과
//   apps/voca/index.html(DOC_TITLE · T[lang].metaDesc) + apps/voca/seo-i18n.js(SEO[lang].faq) + apps/voca/i18n/<doc>.<lang>.html(<main data-title data-desc>)
//     → apps/voca/functions/_lib/seo-meta.js · apps/voca/sitemap.xml · apps/voca/index.html 의 정적 FAQPage(JSON-LD, 한국어 = 화면의 SEO.ko.faq)
//   apps/voca-tutorial/index.html(DOC_TITLE · LANGS · T[lang]: metaDesc · tutName · steps · stepsH/whoH/who/faqH/faq · foot*) + apps/voca-tutorial/i18n/<doc>.<lang>.html
//     → apps/voca-tutorial/functions/_lib/seo-meta.js(TUT = 루트 본문·메타 13개 언어 · default = privacy/terms 메타) · apps/voca-tutorial/sitemap.xml
//       · apps/voca-tutorial/index.html 의 정적 한국어 section.seo · footer.site-foot · JSON-LD(functions/_lib/tut-seo.js 로 만든다 — 서버 ?lang 버전과 같은 구조)
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');
const LANGS = ['en', 'ja', 'ko', 'zh', 'zh-Hant', 'th', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'nl'];
const OTHER = LANGS.filter((l) => l !== 'ko');
const HL = { zh: 'zh-Hans' };
let diff = 0;

const rd = (rel) => readFileSync(join(ROOT, rel), 'utf8');
function out(rel, content) {
  let cur = null;
  try { cur = rd(rel); } catch (e) { cur = null; }
  if (cur && cur.includes('\r\n')) content = content.replace(/\r?\n/g, '\r\n'); // 기존 줄바꿈 유지
  if (cur === content) return;
  if (check) { console.log('다름 ' + rel); diff++; return; }
  writeFileSync(join(ROOT, rel), content);
  console.log('생성 ' + rel);
}
// 소스 안의 `const NAME = {…}` / `var NAME = […]` 리터럴을 잘라 평가(문자열·템플릿 안의 괄호는 건너뜀)
function grab(src, decl) {
  const i = src.indexOf(decl);
  if (i < 0) throw new Error('없음: ' + decl);
  let k = i + decl.length;
  while (src[k] !== '{' && src[k] !== '[') k++;
  const a = k; let d = 0;
  for (; k < src.length; k++) {
    const c = src[k];
    if (c === '"' || c === "'" || c === '`') { const q = c; for (k++; k < src.length && src[k] !== q; k++) if (src[k] === '\\') k++; continue; }
    if (c === '{' || c === '[') d++;
    else if (c === '}' || c === ']') { d--; if (!d) return new Function('return (' + src.slice(a, k + 1) + ')')(); }
  }
  throw new Error('닫는 괄호 없음: ' + decl);
}
const unesc = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
function frag(app, doc, lang) {
  const s = rd(`apps/${app}/i18n/${doc}.${lang}.html`);
  const m = /<main\b[^>]*>/.exec(s);
  const attr = (n) => { const r = new RegExp('\\s' + n + '="([^"]*)"').exec(m ? m[0] : ''); if (!r) throw new Error(`${app}/i18n/${doc}.${lang}.html: ${n} 없음`); return unesc(r[1]); };
  return { t: attr('data-title'), d: attr('data-desc') };
}
const line = (v) => JSON.stringify(v);
function metaModule(head, obj, extra = '') {
  let s = head + extra + 'export default {\n';
  for (const p of Object.keys(obj)) {
    s += '  ' + line(p) + ': {\n';
    for (const l of Object.keys(obj[p])) s += '    ' + line(l) + ': ' + line(obj[p][l]) + ',\n';
    s += '  },\n';
  }
  return s + '};\n';
}
function sitemap(origin, pages) {
  let s = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
  for (const pg of pages) {
    const u = (l) => origin + pg.path + (l === 'ko' ? '' : '?lang=' + l);
    const links = LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${HL[l] || l}" href="${u(l)}" />\n`).join('') +
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${u('en')}" />\n`;
    for (const l of ['ko'].concat(OTHER)) {
      s += `  <url>\n    <loc>${u(l).replace(/&/g, '&amp;')}</loc>\n    <lastmod>${l === 'ko' ? pg.mod : pg.modLang || pg.mod}</lastmod>\n` +
        `    <changefreq>${pg.freq}</changefreq>\n    <priority>${pg.pri}</priority>\n` + links + '  </url>\n';
    }
  }
  return s + '</urlset>\n';
}
const HEAD = (src) => `// 자동 생성 — node scripts/seo-meta-voca.mjs (손으로 고치지 말 것 · 원천: ${src})\n// functions/_middleware.js 가 ?lang=xx 응답의 title·description·OG·canonical 등을 이 값으로 바꾼다(packages/seo/README.md L3).\n`;

/* ======================= voca ======================= */
{
  const html = rd('apps/voca/index.html');
  const DOC_TITLE = grab(html, 'const DOC_TITLE = ');
  const T = grab(html, 'const T = ');
  const SEO = grab(rd('apps/voca/seo-i18n.js'), 'var SEO = ');
  // [경로, i18n 조각 이름, lastmod(ko), lastmod(언어 버전), changefreq, priority] — 내용이 바뀌면 날짜를 고친다. /contact 는 noindex 라 제외.
  const PAGES = [
    { path: '/', doc: null, mod: '2026-10-10', freq: 'weekly', pri: '1.0' },
    { path: '/method', doc: 'method', mod: '2026-10-09', freq: 'monthly', pri: '0.9' },
    { path: '/study-guide', doc: 'study-guide', mod: '2026-10-09', freq: 'monthly', pri: '0.9' },
    { path: '/csv-guide', doc: 'csv-guide', mod: '2026-10-09', freq: 'monthly', pri: '0.9' },
    { path: '/spaced-repetition', doc: 'spaced-repetition', mod: '2026-10-09', freq: 'monthly', pri: '0.8' },
    { path: '/tts-pronunciation', doc: 'tts-pronunciation', mod: '2026-10-09', freq: 'monthly', pri: '0.8' },
    { path: '/exam-vocabulary', doc: 'exam-vocabulary', mod: '2026-10-09', freq: 'monthly', pri: '0.8' },
    { path: '/about', doc: 'about', mod: '2026-10-09', freq: 'monthly', pri: '0.7' },
    { path: '/privacy', doc: 'privacy', mod: '2026-10-09', freq: 'yearly', pri: '0.3' },
    { path: '/terms', doc: 'terms', mod: '2026-10-09', freq: 'yearly', pri: '0.3' },
  ];
  const META = {};
  for (const pg of PAGES) {
    META[pg.path] = {};
    for (const l of OTHER) {
      if (!pg.doc) {
        const t = DOC_TITLE[l], d = T[l] && T[l].metaDesc, faq = SEO[l] && SEO[l].faq;
        if (!t || !d || !faq) throw new Error('voca 루트 사전 누락: ' + l);
        // an = 앱 이름(og:image:alt · WebApplication.name — React 가 docTitle.split(' · ')[0] 로 만드는 값과 같게)
        META[pg.path][l] = { t, d, an: t.split(' · ')[0], faq: faq.map((x) => [x.q, x.a]) };
      } else META[pg.path][l] = frag('voca', pg.doc, l);
    }
  }
  out('apps/voca/functions/_lib/seo-meta.js', metaModule(HEAD('apps/voca/index.html DOC_TITLE·T · seo-i18n.js SEO.faq · i18n/<doc>.<lang>.html'), META));
  out('apps/voca/sitemap.xml', sitemap('https://voca.broodev.com', PAGES));

  // 정적 JSON-LD 의 FAQPage = 화면에 보이는 한국어 FAQ(SEO.ko.faq) — 구조화 데이터는 화면 문구와 같아야 한다
  const re = /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/;
  const m = re.exec(html);
  const ld = JSON.parse(m[2]);
  const fq = ld['@graph'].find((x) => x['@type'] === 'FAQPage');
  fq.mainEntity = SEO.ko.faq.map((x) => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a } }));
  const ind = /\n( *)<script type="application\/ld\+json">/.exec(html)[1];
  const body = '\n' + JSON.stringify(ld, null, 2).replace(/</g, '\\u003c').split('\n').map((x) => ind + '  ' + x).join('\n') + '\n' + ind;
  out('apps/voca/index.html', html.replace(re, (a, o, _b, c) => o + body + c));
}

/* ======================= voca-tutorial ======================= */
{
  const html = rd('apps/voca-tutorial/index.html');
  const DOC_TITLE = grab(html, 'const DOC_TITLE = ');
  const T = grab(html, 'const T = ');
  const LOC = Object.fromEntries(grab(html, 'const LANGS = ').map((x) => [x.code, x.locale.replace('-', '_')]));
  const TUT = {};
  for (const l of LANGS) {
    const t = T[l];
    for (const k of ['metaDesc', 'tutName', 'steps', 'stepsH', 'whoH', 'who', 'faqH', 'faq', 'footAria', 'footDesc']) if (!t || !t[k]) throw new Error(`voca-tutorial T.${l}.${k} 없음`);
    TUT[l] = {
      t: DOC_TITLE[l], d: t.metaDesc, l: LOC[l], a: t.tutName,
      s: t.steps.map((x) => [x.t, x.b]), sh: t.stepsH, wh: t.whoH, w: t.who, fh: t.faqH, q: t.faq.map((x) => [x.q, x.a]),
      f: [t.footAria, t.footHome, t.footApp, t.footPrivacy, t.footTerms, t.footContact, t.footMadeBy, t.footDesc],
    };
  }
  const PAGES = [
    { path: '/', doc: null, mod: '2026-10-10', freq: 'monthly', pri: '1.0' },
    { path: '/privacy', doc: 'privacy', mod: '2026-10-09', freq: 'yearly', pri: '0.3' },
    { path: '/terms', doc: 'terms', mod: '2026-10-09', freq: 'yearly', pri: '0.3' },
  ];
  const META = {};
  for (const pg of PAGES) if (pg.doc) { META[pg.path] = {}; for (const l of OTHER) META[pg.path][l] = frag('voca-tutorial', pg.doc, l); }
  let tut = '// TUT = 튜토리얼 본체(/) 13개 언어: t 제목 · d 설명 · l og:locale · a tutName · s 단계[제목, 설명] · sh/wh/w/fh/q 본문(소제목·이런 분께·FAQ) · f 푸터\nexport const TUT = {\n';
  for (const l of LANGS) tut += '  ' + line(l) + ': ' + line(TUT[l]) + ',\n';
  tut += '};\n\n';
  out('apps/voca-tutorial/functions/_lib/seo-meta.js', metaModule(HEAD('apps/voca-tutorial/index.html DOC_TITLE·LANGS·T · i18n/<doc>.<lang>.html'), META, tut));
  out('apps/voca-tutorial/sitemap.xml', sitemap('https://voca-tutorial.broodev.com', PAGES));

  // 정적 한국어 본문·푸터·JSON-LD — 서버(?lang 버전)·React 와 같은 함수/구조
  const { seoHtml, footHtml, ldData } = await import(pathToFileURL(join(ROOT, 'apps/voca-tutorial/functions/_lib/tut-seo.js')).href);
  const ko = TUT.ko;
  const pretty = (h, ind) => h
    .replace(/(<\/h1>|<\/h2>|<\/p>|<\/ol>|<\/ul>|<\/dl>|<\/nav>)(?=<)/g, '$1\n' + ind)
    .replace(/(<ol>|<ul>|<dl>|<\/li>|<\/dd>)(?=<(?:li|dt))/g, '$1\n' + ind + '  ')
    .replace(/(<\/li>|<\/dd>)(<\/ol>|<\/ul>|<\/dl>)/g, '$1\n' + ind + '$2');
  let h = html;
  h = h.replace(/(<section class="seo")[^>]*>[\s\S]*?(<\/section>)/, (a, o, c) => `${o} aria-label="${ko.a}">\n      ${pretty(seoHtml('ko', ko), '      ')}\n    ${c}`);
  h = h.replace(/(<footer class="site-foot")[^>]*>[\s\S]*?(<\/footer>)/, (a, o, c) => `${o} aria-label="${ko.f[0]}">\n      ${pretty(footHtml('ko', ko), '      ')}\n    ${c}`);
  const re = /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/;
  const ind = /\n( *)<script type="application\/ld\+json">/.exec(h)[1];
  const body = '\n' + JSON.stringify(ldData('ko', ko), null, 2).replace(/</g, '\\u003c').split('\n').map((x) => ind + '  ' + x).join('\n') + '\n' + ind;
  h = h.replace(re, (a, o, _b, c) => o + body + c);
  out('apps/voca-tutorial/index.html', h);
}

console.log(check ? (diff ? '검사 — 다름 ' + diff : '검사 — 모두 최신') : '완료');
process.exit(check && diff ? 1 : 0);
