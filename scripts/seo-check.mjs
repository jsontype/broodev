#!/usr/bin/env node
// broodev SEO 정책 검사기 — packages/seo/README.md 의 L1~L6 을 앱 폴더 단위로 검사한다. 외부 의존성 없음(Node 22+).
//
//   node scripts/seo-check.mjs <앱 폴더…> [--server wrangler|none] [--render] [--port 8700] [--env K=V]… [--json out.json]
//        [--allow-noindex] [--single|--multi] [--langs ru,en] [--origin https://x.broodev.com] [--verbose]
//        [--wrangler <wrangler.js|.bin/wrangler>] [--persist <dir>] [--log-dir <dir>] [--render-wait 9000] [--render-limit N] [--render-par 3]
//   node scripts/seo-check.mjs --selftest [--port 8700] [--selftest-dir <dir>] [--wrangler …]
//
//   예) node scripts/seo-check.mjs apps/btc apps/voca-tutorial                       정적 검사만
//       node scripts/seo-check.mjs apps/utils --server wrangler                       + wrangler pages dev 로 띄워 ?lang=xx 응답(미들웨어) 검사
//       node scripts/seo-check.mjs apps/eth --server wrangler --env SEO_HOST=eth.broodev.com    (--env 는 wrangler --binding 으로 전달)
//       node scripts/seo-check.mjs apps/btc --render --render-limit 2                 + 구글봇/일본어 사용자 렌더(scripts/seo-render.mjs · --render 는 서버를 자동으로 켬)
//
// 단계
//   정적(항상)  sitemap.xml 의 색인 주소 → 각 페이지 파일: <html lang>(=기준 언어) · canonical(=origin+확장자 없는 경로) · robots meta(noindex FAIL, --allow-noindex 면 WARN)
//              · 정적 <h1> ≥1 · title/description 길이(라틴 60/155 · CJK 35/90 초과 WARN) · hreflang 묶음(L4) · JSON-LD 파싱 · og:url · .html 내부 링크(WARN)
//              · lang-suggest.js 참조(data-base = 기준 언어) · 표시 언어 결정에 navigator.language(s) 사용(휴리스틱 WARN + 위치)
//              · robots.txt(Sitemap 줄 · 색인 경로 Disallow) · sitemap 구조(L5) · 404.html · 공용 파일 사본 = packages/seo 원본 · _routes.json(Functions 있으면)
//   서버       --server wrangler: 앱을 wrangler pages dev 로 띄우고(종료·workerd·.wrangler 정리까지 이 스크립트가 함) P 와 P?lang=xx(12개)를 GET —
//              200 · text/html · canonical/og:url = 자기 자신 · <html lang>(zh→zh-Hans) · title/description 이 그 언어 문자 체계 · 기준 title 과 다름 · og:locale(WARN)
//              · ?lang=<기준> 은 기준 canonical · /__seo-check-404__ → 404
//   렌더       --render: 구글봇(en-US · 저장값 없음)으로 P → htmlLang = 기준 · 렌더 title = 서버 원본 title · 제안 바 없음 · 본문 글자가 기준 언어 쪽
//              · 구글봇으로 P?lang=ja → htmlLang ja · 렌더 title = 서버가 준 ja title(다르면 앱 사전과 seo-meta 불일치)
//              · 일본어 사용자(ja-JP)로 P → 제안 바 일본어 · [表示] 클릭 → ?lang=ja · 저장 키에 ja  (기준 언어가 ja 인 앱은 ja 대신 en)
//   출력       앱별 FAIL/WARN 표(같은 검사는 5줄까지, --verbose 면 PASS 까지 전부) + 합계. 종료 코드: FAIL 있으면 1 · 사용법 오류 2.
//
// 단일 언어 앱(지역 패널 등): hreflang·?lang 사이트맵·lang-suggest·seo-lang·i18n/ 이 하나도 없으면 자동으로 단일 언어로 보고 L4·서버 ?lang 검사를 건너뛴다(--single/--multi 로 강제).
// wrangler 위치: --wrangler > 환경변수 SEO_CHECK_WRANGLER > <repo>/node_modules/wrangler. 포트 N 과 N+600(인스펙터)이 비어 있어야 한다.
// --selftest: 임시 Pages 프로젝트(seo-lang 미들웨어 + lang-suggest)를 만들어 PASS 가 나는지, 일부러 망가뜨린 사본(hreflang 누락 · canonical 루트 고정 ·
//             navigator 감지)에 FAIL 이 나는지 확인한다.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync, rmSync, statSync, openSync, closeSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import net from 'node:net';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LANGS = ['en', 'ja', 'ko', 'zh', 'zh-Hant', 'th', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'nl'];
const HV = (l) => (l === 'zh' ? 'zh-Hans' : l);
const LOCALE = { en: 'en_US', ja: 'ja_JP', ko: 'ko_KR', zh: 'zh_CN', 'zh-Hant': 'zh_TW', th: 'th_TH', es: 'es_ES', fr: 'fr_FR', de: 'de_DE', it: 'it_IT', pt: 'pt_BR', ru: 'ru_RU', nl: 'nl_NL' };
const IS_WIN = process.platform === 'win32';

// ───────────────────────── 인자 ─────────────────────────
const argv = process.argv.slice(2);
const opt = { apps: [], env: [] };
const FLAGS = new Set(['render', 'allow-noindex', 'single', 'multi', 'verbose', 'selftest', 'keep-fixture']);
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (!a.startsWith('--')) { opt.apps.push(a); continue; }
  const k = a.slice(2);
  if (FLAGS.has(k)) { opt[k] = true; continue; }
  const v = argv[i + 1];
  if (v == null || v.startsWith('--')) { console.error('값이 필요: ' + a); process.exit(2); }
  i++;
  if (k === 'env') opt.env.push(v); else opt[k] = v;
}
opt.port = +(opt.port || 8700);
opt.server = opt.render ? 'wrangler' : (opt.server || 'none');
opt.renderWait = +(opt['render-wait'] || 9000);
opt.renderPar = +(opt['render-par'] || 3);
opt.renderLimit = opt['render-limit'] ? +opt['render-limit'] : Infinity;
opt.persist = opt.persist || join(tmpdir(), 'broodev-seo-check-state');
opt.logDir = opt['log-dir'] || tmpdir();
if (!['wrangler', 'none'].includes(opt.server)) { console.error('--server wrangler|none'); process.exit(2); }

// ───────────────────────── 공통 유틸 ─────────────────────────
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0' };
const dec = (s) => String(s == null ? '' : s).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) =>
  e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : (ENT[e.toLowerCase()] ?? m));
const squash = (s) => dec(s).replace(/\s+/g, ' ').trim();
function normLang(x) {
  x = String(x == null ? '' : x).trim().toLowerCase();
  if (!x) return null;
  if (x === 'zh-hant' || /^zh[-_](tw|hk|mo|hant)/.test(x)) return 'zh-Hant';
  const b = x.split(/[-_]/)[0];
  if (b === 'zh') return 'zh';
  return LANGS.includes(b) ? b : null;
}
const TAG_RE = (name) => new RegExp('<' + name + '\\b((?:[^>"\']|"[^"]*"|\'[^\']*\')*)>', 'gi');
function attrs(s) {
  const o = {}; const re = /([^\s=\/>"']+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g; let m;
  while ((m = re.exec(s))) o[m[1].toLowerCase()] = dec(m[2] ?? m[3] ?? m[4] ?? '');
  return o;
}
const tags = (name, src) => [...src.matchAll(TAG_RE(name))].map((m) => attrs(m[1]));
function counts(t) {
  const c = (re) => (String(t).match(re) || []).length;
  return { hangul: c(/[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/g), kana: c(/[\u3040-\u30FF]/g), han: c(/[\u4E00-\u9FFF\u3400-\u4DBF]/g),
    cyr: c(/[\u0400-\u04FF]/g), thai: c(/[\u0E00-\u0E7F]/g), latin: c(/[A-Za-z\u00C0-\u024F]/g), letters: c(/\p{L}/gu) };
}
function isCJK(t) { const c = counts(t); return c.letters > 0 && (c.hangul + c.kana + c.han) / c.letters >= 0.3; }
// 검색 결과 폭 기준 길이: CJK(한글·가나·한자·전각) 글자는 라틴 한도/CJK 한도 배로 친다(title 60/35 · description 155/90) → 라틴 기준 글자 수
function width(t, latin, cjk) {
  let n = 0;
  for (const ch of String(t)) n += /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\u3040-\u30FF\u4E00-\u9FFF\u3400-\u4DBF\uFF00-\uFFEF\u3000-\u303F]/.test(ch) ? latin / cjk : 1;
  return Math.round(n);
}
// 그 언어 문자 체계인지(title+description 기준) — 이유 문자열 또는 null
function scriptMismatch(l, t) {
  // 의도된 외국어 고유명사는 빼고 센다 — i18n-scan.mjs 기본 허용과 같은 기준(법령 정식 명칭 「特定商取引法」은 모든 언어 판 제목에 원문 병기)
  const c = counts(String(t).replace(/特定商取引法/g, ''));
  const has = (k) => c[k] > 0;
  if (l === 'ko') return has('hangul') ? null : '한글 없음';
  if (l === 'ja') return has('hangul') ? '한글 섞임' : (has('kana') || has('han')) ? null : '가나/한자 없음';
  if (l === 'zh' || l === 'zh-Hant') return has('hangul') || has('kana') ? '한글/가나 섞임' : has('han') ? null : '한자 없음';
  if (l === 'ru') return has('cyr') ? null : '키릴 문자 없음';
  if (l === 'th') return has('thai') ? null : '타이 문자 없음';
  if (has('hangul') || has('kana')) return '한글/가나 섞임';
  if (has('han') || has('cyr') || has('thai')) return '라틴 외 문자 섞임';
  return has('latin') ? null : '라틴 문자 없음';
}

// HTML → 필요한 것만(정규식 · 스크립트/주석 제거 후)
function parseHtml(html) {
  const scripts = [];
  for (const m of html.matchAll(/<script\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/script\s*>/gi)) scripts.push({ a: attrs(m[1]), body: m[2], at: m.index + m[0].indexOf('>') + 1 });
  const noScript = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<script\b(?:[^>"']|"[^"]*"|'[^']*')*>[\s\S]*?<\/script\s*>/gi, '');
  const bodyAt = noScript.search(/<body\b/i);
  const head = bodyAt >= 0 ? noScript.slice(0, bodyAt) : noScript.split(/<\/head>/i)[0];
  const body = bodyAt >= 0 ? noScript.slice(bodyAt) : '';
  const visible = body.replace(/<(style|template|noscript)\b[\s\S]*?<\/\1\s*>/gi, '');
  const htmlTag = tags('html', noScript)[0] || {};
  const links = tags('link', head);
  const metas = tags('meta', head);
  const meta = (k, v) => { const x = metas.find((m) => (m[k] || '').toLowerCase() === v); return x ? x.content ?? '' : null; };
  const rel = (l) => (l.rel || '').toLowerCase().split(/\s+/);
  const tm = /<title\b[^>]*>([\s\S]*?)<\/title\s*>/i.exec(head);
  return {
    lang: htmlTag.lang ?? null,
    title: tm ? squash(tm[1]) : null,
    desc: meta('name', 'description'),
    robots: [meta('name', 'robots'), meta('name', 'googlebot')].filter((x) => x != null).join(','),
    canon: links.filter((l) => rel(l).includes('canonical')).map((l) => l.href),
    alts: links.filter((l) => rel(l).includes('alternate') && l.hreflang != null).map((l) => [l.hreflang, l.href]),
    ogUrl: meta('property', 'og:url'), ogLocale: meta('property', 'og:locale'),
    h1: [...visible.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1\s*>/gi)].map((m) => squash(m[1].replace(/<[^>]+>/g, ' '))),
    ld: scripts.filter((s) => (s.a.type || '').toLowerCase() === 'application/ld+json').map((s) => s.body),
    scripts,
    hrefs: tags('a', visible).map((a) => a.href).filter(Boolean),
  };
}

// ───────────────────────── 결과 ─────────────────────────
class Report {
  constructor(app) { this.app = app; this.rows = []; this.info = {}; }
  add(sev, page, id, msg) { this.rows.push({ sev, page, id, msg }); }
  pass(page, id, msg = '') { this.add('PASS', page, id, msg); }
  warn(page, id, msg) { this.add('WARN', page, id, msg); }
  fail(page, id, msg) { this.add('FAIL', page, id, msg); }
  n(sev) { return this.rows.filter((r) => r.sev === sev).length; }
}

// ───────────────────────── 정적 ─────────────────────────
function pageFile(dir, p) {
  const cands = p === '/' ? ['index.html'] : p.endsWith('/') ? [p.slice(1) + 'index.html'] : [p.slice(1) + '.html', p.slice(1) + '/index.html', p.slice(1)];
  for (const c of cands) { const f = join(dir, c); if (existsSync(f) && statSync(f).isFile()) return c; }
  return null;
}
function parseSitemap(xml) {
  const urls = [];
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/gi)) {
    const b = m[1];
    const loc = (/<loc>\s*([\s\S]*?)\s*<\/loc>/i.exec(b) || [])[1];
    const lastmod = (/<lastmod>\s*([\s\S]*?)\s*<\/lastmod>/i.exec(b) || [])[1];
    const alts = tags('xhtml:link', b).filter((a) => (a.rel || '') === 'alternate').map((a) => [a.hreflang, a.href]);
    urls.push({ loc: loc ? dec(loc) : null, lastmod: lastmod ? dec(lastmod) : null, alts });
  }
  return urls;
}
function expectedAlts(origin, P, base, langs = LANGS) {
  const m = new Map();
  for (const l of langs) m.set(HV(l), l === base ? origin + P : origin + P + '?lang=' + encodeURIComponent(l));
  m.set('x-default', base === 'en' ? origin + P : origin + P + '?lang=en');
  return m;
}
// 실제 [hreflang, href][] 와 기대 Map 비교 → 문제 문자열[]
function diffAlts(actual, exp) {
  if (!actual.length) return ['hreflang 없음 — ' + exp.size + '개 전부 누락'];
  const out = []; const seen = new Map();
  for (const [h, href] of actual) {
    if (seen.has(h)) { out.push('중복 ' + h); continue; }
    seen.set(h, href);
    if (!exp.has(h)) out.push('기대에 없는 값 ' + h + ' → ' + href);
    else if (href !== exp.get(h)) out.push(h + ' → ' + href + ' (기대 ' + exp.get(h) + ')');
  }
  for (const h of exp.keys()) if (!seen.has(h)) out.push('누락 ' + h);
  return out;
}
const short = (arr, n = 4) => arr.slice(0, n).join(' · ') + (arr.length > n ? ' … 외 ' + (arr.length - n) + '건' : '');
const lineOf = (s, i) => s.slice(0, i).split('\n').length;

function navScan(src, file, R, seen) {
  if (seen.has(file)) return; seen.add(file);
  const re = /navigator\s*\.\s*languages?\b/g; let m; const hits = []; const fmt = [];
  while ((m = re.exec(src))) {
    const ln = lineOf(src, m.index);
    const line = src.split('\n')[ln - 1] || '';
    const t = line.trim();
    if (t.startsWith('//') || t.startsWith('*') || t.startsWith('/*')) continue;
    if (/Intl\.|toLocale/.test(line)) { fmt.push(ln); continue; }
    // 명시적 예외 표시 — packages/seo README L1 의 지역 패널 예외(기준 en · 13개 언어 밖 지역어만 navigator 로) 또는 표시 언어와 무관한 사용(진단 정보 등)
    if (/seo-allow-navigator/.test(line)) { fmt.push(ln); continue; }
    if (!hits.includes(ln)) hits.push(ln);
  }
  if (hits.length) R.warn('-', 'nav-detect', file + ':' + hits.join(',') + ' navigator.language(s) — 표시 언어 결정에 쓰이면 L1 위반(구글봇 en-US 로 렌더 → 영어판 색인). 제안 바(lang-suggest.js)로 옮길 것');
  if (fmt.length) R.pass('-', 'nav-detect', file + ':' + fmt.join(',') + ' 숫자/날짜 형식용(Intl/toLocale) — 무시');
}

function staticCheck(appArg, R) {
  const dir = resolve(appArg);
  const ctx = { dir, pages: [], origin: opt.origin || null, multi: false, sitemap: [] };
  if (!existsSync(dir)) { R.fail('-', 'app', '폴더 없음: ' + dir); return null; }
  // sitemap
  const smf = join(dir, 'sitemap.xml');
  let sm = [];
  if (!existsSync(smf)) R.fail('-', 'sitemap', 'sitemap.xml 없음');
  else {
    const xml = readFileSync(smf, 'utf8');
    sm = parseSitemap(xml);
    if (!sm.length) R.fail('-', 'sitemap', '<url> 없음');
    if (sm.some((u) => u.alts.length) && !/xmlns:xhtml\s*=\s*["']http:\/\/www\.w3\.org\/1999\/xhtml["']/.test(xml)) R.fail('-', 'sitemap', 'xhtml:link 를 쓰는데 xmlns:xhtml 선언 없음');
  }
  ctx.sitemap = sm;
  if (!ctx.origin) {
    const first = sm.find((u) => u.loc && /^https?:\/\//.test(u.loc));
    if (first) ctx.origin = new URL(first.loc).origin;
  }
  if (!ctx.origin) {
    const ix = existsSync(join(dir, 'index.html')) ? parseHtml(readFileSync(join(dir, 'index.html'), 'utf8')) : null;
    if (ix && ix.canon[0]) ctx.origin = new URL(ix.canon[0]).origin;
  }
  if (!ctx.origin) { R.fail('-', 'origin', 'origin 을 알 수 없음(sitemap/canonical 없음) — --origin 지정'); return null; }
  const origin = ctx.origin;

  // 사이트맵 항목 → 페이지(확장자 없는 경로) 목록
  const paths = []; const locSeen = new Set();
  for (const u of sm) {
    if (!u.loc) { R.fail('-', 'sitemap', '<loc> 없는 <url>'); continue; }
    if (locSeen.has(u.loc)) R.fail('-', 'sitemap', '중복 <loc> ' + u.loc);
    locSeen.add(u.loc);
    let url; try { url = new URL(u.loc); } catch { R.fail('-', 'sitemap', '잘못된 URL ' + u.loc); continue; }
    if (url.origin !== origin) { R.fail('-', 'sitemap', '다른 origin ' + u.loc); continue; }
    if (/\.html$/.test(url.pathname)) R.fail(url.pathname, 'sitemap', '.html 주소 ' + u.loc + ' — 확장자 없는 정본 경로로(L6)');
    const P = url.pathname.replace(/\/index(\.html)?$/, '/').replace(/\.html$/, '') || '/';
    const extra = [...url.searchParams.keys()].filter((k) => k !== 'lang');
    if (extra.length) R.warn(P, 'sitemap', '쿼리 ' + extra.join(',') + ' 가 붙은 주소 ' + u.loc);
    if (!paths.includes(P)) paths.push(P);
  }

  for (const P of paths) {
    const f = pageFile(dir, P);
    if (!f) { R.fail(P, 'page.file', '사이트맵 주소에 해당하는 파일 없음'); continue; }
    const html = readFileSync(join(dir, f), 'utf8');
    const h = parseHtml(html);
    const base = normLang(h.lang);
    ctx.pages.push({ P, file: f, html, h, base: base || 'ko' });
  }

  // 다국어 여부
  const signals = [];
  if (ctx.pages.some((p) => p.h.alts.length)) signals.push('hreflang');
  if (sm.some((u) => /[?&]lang=/.test(u.loc || '') || u.alts.length)) signals.push('sitemap ?lang/xhtml:link');
  if (existsSync(join(dir, 'lang-suggest.js'))) signals.push('lang-suggest.js');
  if (existsSync(join(dir, 'functions/_lib/seo-lang.js'))) signals.push('seo-lang.js');
  if (existsSync(join(dir, 'i18n')) && statSync(join(dir, 'i18n')).isDirectory()) signals.push('i18n/');
  ctx.multi = opt.single ? false : opt.multi ? true : signals.length > 0;
  // 앱의 언어 집합: --langs a,b 또는 첫 페이지 hreflang 묶음(x-default 제외)이 2~12개면 그 집합(예: stans ru/en), 아니면 13개 전부
  {
    const declared = [...new Set(((ctx.pages[0] && ctx.pages[0].h.alts) || []).map(([hl]) => hl).filter((hl) => hl && hl !== 'x-default').map((hl) => normLang(hl)).filter(Boolean))];
    ctx.langs = opt.langs ? String(opt.langs).split(',').map((x) => normLang(x.trim())).filter(Boolean) : (declared.length >= 2 && declared.length < LANGS.length ? declared : LANGS);
    if (ctx.langs.length < LANGS.length) signals.push('언어 ' + ctx.langs.join('/'));
  }
  R.info = { origin, multi: ctx.multi, signals, pages: ctx.pages.length };

  // robots.txt
  const rf = join(dir, 'robots.txt');
  if (!existsSync(rf)) R.fail('-', 'robots.txt', 'robots.txt 없음');
  else {
    const rt = readFileSync(rf, 'utf8');
    const want = origin + '/sitemap.xml';
    const sml = [...rt.matchAll(/^\s*sitemap\s*:\s*(\S+)/gim)].map((m) => m[1]);
    if (!sml.includes(want)) R.fail('-', 'robots.txt', 'Sitemap: ' + want + ' 줄 없음' + (sml.length ? ' (있는 것: ' + sml.join(', ') + ')' : ''));
    else R.pass('-', 'robots.txt', 'Sitemap 줄');
    // User-agent: * (또는 Googlebot) 그룹의 Disallow 가 색인 경로를 막는지
    let ua = []; let inGroup = false; const dis = []; const allow = [];
    for (const raw of rt.split(/\r?\n/)) {
      const line = raw.replace(/#.*/, '').trim(); if (!line) continue;
      const m = /^([a-z-]+)\s*:\s*(.*)$/i.exec(line); if (!m) continue;
      const k = m[1].toLowerCase(), v = m[2].trim();
      if (k === 'user-agent') { if (!inGroup) ua = []; ua.push(v.toLowerCase()); inGroup = true; continue; }
      inGroup = false;
      const applies = ua.includes('*') || ua.includes('googlebot');
      if (!applies) continue;
      if (k === 'disallow' && v) dis.push(v); if (k === 'allow' && v) allow.push(v);
    }
    const toRe = (p) => new RegExp('^' + p.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\\\$$/, '$'));
    for (const pg of ctx.pages) {
      const d = dis.filter((x) => toRe(x).test(pg.P)).sort((a, b) => b.length - a.length)[0];
      const a = allow.filter((x) => toRe(x).test(pg.P)).sort((a, b) => b.length - a.length)[0];
      if (d && (!a || a.length < d.length)) R.fail(pg.P, 'robots.txt', 'Disallow: ' + d + ' 가 색인 경로를 막음');
    }
  }
  // 404
  if (existsSync(join(dir, '404.html'))) R.pass('-', '404', '404.html 있음');
  else R.fail('-', '404', '404.html 없음 — 없는 주소가 200 홈으로 응답(소프트 404 · L5)');

  // 공용 파일 사본
  for (const [src, to, id] of [['packages/seo/lang-suggest.js', 'lang-suggest.js', 'copy.lang-suggest'], ['packages/seo/seo-lang.js', 'functions/_lib/seo-lang.js', 'copy.seo-lang']]) {
    const t = join(dir, to);
    if (!existsSync(t)) continue;
    if (readFileSync(t, 'utf8') === readFileSync(join(ROOT, src), 'utf8')) R.pass('-', id, to + ' = 원본');
    else R.fail('-', id, to + ' 이(가) ' + src + ' 와 다름 — node scripts/seo-sync.mjs');
  }
  const hasFn = existsSync(join(dir, 'functions'));
  if (ctx.multi) {
    if (!existsSync(join(dir, 'functions/_lib/seo-lang.js'))) {
      if (hasFn && existsSync(join(dir, 'functions/_middleware.js'))) R.warn('-', 'copy.seo-lang', 'functions/_lib/seo-lang.js 없음 — 자체 미들웨어(_middleware.js)로 ?lang 메타를 처리하는지 --server wrangler 로 확인');
      else R.fail('-', 'copy.seo-lang', '다국어 앱인데 ?lang 응답 메타를 바꿀 Functions 가 없음(L3) — seo-sync --add <app> --fn');
    }
    if (!existsSync(join(dir, 'lang-suggest.js')) && ctx.langs.length === LANGS.length) R.warn('-', 'copy.lang-suggest', 'lang-suggest.js 사본 없음(L2) — seo-sync --add <app> --suggest');
  }
  if (hasFn && !existsSync(join(dir, '_routes.json'))) R.warn('-', 'routes', 'functions/ 가 있는데 _routes.json 없음 — 모든 요청이 함수를 탐(L3 · 무료 한도)');

  // 페이지별
  const navSeen = new Set();
  const today = new Date().toISOString().slice(0, 10);
  for (const pg of ctx.pages) {
    const { P, h, file } = pg;
    if (!h.lang) R.fail(P, 'html.lang', '<html lang> 없음');
    else if (!normLang(h.lang)) R.fail(P, 'html.lang', '<html lang="' + h.lang + '"> 이 13개 언어가 아님');
    else R.pass(P, 'html.lang', h.lang);
    const base = pg.base;
    const self = origin + P;
    // canonical
    if (!h.canon.length) R.fail(P, 'canonical', 'canonical 없음');
    else if (h.canon.length > 1) R.fail(P, 'canonical', 'canonical ' + h.canon.length + '개');
    else if (h.canon[0] !== self) R.fail(P, 'canonical', h.canon[0] + ' (기대 ' + self + ')' + (/\.html$/.test(h.canon[0]) ? ' — 확장자 빼기' : ''));
    else R.pass(P, 'canonical', self);
    if (h.ogUrl != null && h.ogUrl !== self) R.fail(P, 'og:url', h.ogUrl + ' (기대 ' + self + ')');
    // robots
    if (/noindex/i.test(h.robots)) (opt['allow-noindex'] ? R.warn : R.fail).call(R, P, 'robots', 'meta robots "' + h.robots + '"' + (opt['allow-noindex'] ? ' (--allow-noindex)' : ' — 색인 차단'));
    else R.pass(P, 'robots', h.robots || '(없음)');
    // h1
    if (!h.h1.length) R.fail(P, 'h1', '정적 <h1> 없음(L6) — JS 로만 그리면 렌더 전 크롤러·스크린리더가 못 봄');
    else if (h.h1.length > 1) R.warn(P, 'h1', '정적 <h1> ' + h.h1.length + '개: ' + short(h.h1.map((x) => '"' + x.slice(0, 40) + '"'), 3));
    else R.pass(P, 'h1', h.h1[0].slice(0, 60));
    // title / description
    lenCheck(R, P, h.title, h.desc, '');
    // JSON-LD
    ldCheck(R, P, h.ld, '');
    // hreflang
    if (ctx.multi) {
      const d = diffAlts(h.alts, expectedAlts(origin, P, base, ctx.langs));
      if (d.length) R.fail(P, 'hreflang', short(d, 5));
      else R.pass(P, 'hreflang', '14개 일치');
      for (const [hl, href] of h.alts) if (!/^https?:\/\//.test(href || '')) { R.fail(P, 'hreflang', hl + ' 상대 주소 ' + href); break; }
    } else if (h.alts.length) R.warn(P, 'hreflang', '단일 언어로 판정했는데 hreflang ' + h.alts.length + '개');
    // lang-suggest 참조
    const ls = h.scripts.find((s) => /(^|\/)lang-suggest\.js(\?|$)/.test(s.a.src || ''));
    if (ctx.multi) {
      if (!ls && ctx.langs.length < LANGS.length) R.pass(P, 'lang-suggest', '13개 언어 앱이 아님(' + ctx.langs.join('/') + ') — 13개 언어 제안 바 대상 아님');
      else if (!ls) R.warn(P, 'lang-suggest', 'lang-suggest.js 를 불러오지 않음(L2) — 다른 언어 사용자에게 언어 제안 없음');
      else {
        const db = normLang(ls.a['data-base'] || h.lang);
        if (!existsSync(join(dir, 'lang-suggest.js'))) R.fail(P, 'lang-suggest', '참조하지만 앱 루트에 lang-suggest.js 없음');
        if (db !== base) R.fail(P, 'lang-suggest', 'data-base=' + (ls.a['data-base'] || '(없음)') + ' ≠ 기준 언어 ' + base);
        else if (!ls.a['data-key']) R.warn(P, 'lang-suggest', 'data-key 없음 — 앱이 고른 언어를 몰라 저장값이 있어도 바가 뜸');
        else R.pass(P, 'lang-suggest', 'data-key=' + ls.a['data-key'] + ' data-base=' + base);
      }
    }
    // navigator 휴리스틱 — 인라인 + 같은 앱의 로컬 스크립트(lang-suggest.js · 서드파티 제외)
    const inl = pg.html; // 줄 번호를 원본 파일 기준으로
    const blocks = h.scripts.filter((s) => !s.a.src && !/json/i.test(s.a.type || ''));
    if (blocks.some((s) => /navigator\s*\.\s*languages?\b/.test(s.body))) {
      // 인라인 스크립트 범위만 남긴 사본(나머지는 줄바꿈만 유지)
      let masked = inl.replace(/[^\n]/g, ' ').split('');
      for (const s of blocks) for (let i = 0; i < s.body.length; i++) masked[s.at + i] = inl[s.at + i];
      navScan(masked.join(''), file, R, navSeen);
    }
    for (const s of h.scripts.filter((s) => s.a.src)) {
      const src = s.a.src;
      if (/^(https?:)?\/\//.test(src) && !src.startsWith(origin)) continue;
      const rel = src.startsWith(origin) ? new URL(src).pathname : src;
      const clean = rel.split(/[?#]/)[0];
      if (/(^|\/)lang-suggest\.js$/.test(clean) || /\.min\.js$/.test(clean) || /(^|\/)(vendor|vendors|lib|libs|node_modules|third[-_]?party)\//.test(clean)) continue;
      const fp = clean.startsWith('/') ? join(dir, clean) : join(dir, dirname(file), clean);
      if (existsSync(fp) && statSync(fp).isFile()) navScan(readFileSync(fp, 'utf8'), relative(dir, fp).replace(/\\/g, '/'), R, navSeen);
    }
    // .html 내부 링크
    const host = new URL(origin).host;
    const bad = [...new Set(h.hrefs.filter((x) => {
      if (/^(#|mailto:|tel:|javascript:|data:)/i.test(x)) return false;
      let u; try { u = new URL(x, origin + P); } catch { return false; }
      return u.host === host && /\.html$/.test(u.pathname);
    }))];
    if (bad.length) R.warn(P, 'links.html', '.html 내부 링크 ' + bad.length + '개(308 홉 · L6): ' + short(bad, 3));
  }

  // sitemap 구조(L5)
  const byLoc = new Map(sm.filter((u) => u.loc).map((u) => [u.loc, u]));
  for (const pg of ctx.pages) {
    const { P, base } = pg;
    if (ctx.multi) {
      const exp = expectedAlts(origin, P, base, ctx.langs);
      const want = [...new Set([...exp.entries()].filter(([k]) => k !== 'x-default').map(([, v]) => v))];
      const miss = want.filter((w) => !byLoc.has(w));
      if (miss.length) R.fail(P, 'sitemap.urls', '언어 버전 <url> 누락 ' + miss.length + '/' + want.length + ': ' + short(miss.map((m) => m.replace(origin, '')), 4));
      else R.pass(P, 'sitemap.urls', want.length + '개');
      const badAlt = []; let noAlt = 0;
      for (const w of want) {
        const u = byLoc.get(w); if (!u) continue;
        if (!u.alts.length) { noAlt++; continue; }
        const d = diffAlts(u.alts, exp);
        if (d.length) badAlt.push(w.replace(origin, '') + ': ' + short(d, 2));
      }
      if (noAlt) R.fail(P, 'sitemap.xhtml', noAlt + '개 <url> 에 xhtml:link 없음');
      if (badAlt.length) R.fail(P, 'sitemap.xhtml', short(badAlt, 2));
      if (!noAlt && !badAlt.length && !miss.length) R.pass(P, 'sitemap.xhtml', 'HTML hreflang 과 일치');
      const lb = byLoc.get(origin + P + '?lang=' + base);
      if (lb) R.fail(P, 'sitemap.urls', '기준 언어 주소가 ?lang=' + base + ' 로도 있음 — 기준은 ' + P + ' 하나');
    } else if (!byLoc.has(origin + P)) R.fail(P, 'sitemap.urls', origin + P + ' 항목 없음');
  }
  for (const u of sm) {
    if (!u.loc) continue;
    let url; try { url = new URL(u.loc); } catch { continue; }
    const lp = url.searchParams.get('lang');
    if (lp != null && !LANGS.includes(lp)) R.fail(url.pathname, 'sitemap.urls', '지원하지 않는 lang 값 ' + u.loc);
    if (!u.lastmod) R.warn(url.pathname + url.search, 'sitemap.lastmod', 'lastmod 없음');
    else if (!/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2}))?$/.test(u.lastmod)) R.fail(url.pathname + url.search, 'sitemap.lastmod', '형식 오류 ' + u.lastmod);
    else if (u.lastmod.slice(0, 10) > today) R.warn(url.pathname + url.search, 'sitemap.lastmod', '미래 날짜 ' + u.lastmod);
  }
  return ctx;
}
function lenCheck(R, P, title, desc, pre) {
  if (!title) R.fail(P, pre + 'title', 'title 없음/빈 값');
  else {
    const n = width(title, 60, 35);
    if (n > 60) R.warn(P, pre + 'title', '라틴 기준 ' + n + '자 > 60(CJK 35) — 검색 결과에서 잘림: "' + title.slice(0, 80) + '"');
    else R.pass(P, pre + 'title', '라틴 기준 ' + n + '자');
  }
  if (desc == null || !desc.trim()) R.fail(P, pre + 'description', 'meta description 없음/빈 값');
  else {
    const n = width(squash(desc), 155, 90);
    if (n > 155) R.warn(P, pre + 'description', '라틴 기준 ' + n + '자 > 155(CJK 90) — 검색 결과에서 잘림');
    else R.pass(P, pre + 'description', '라틴 기준 ' + n + '자');
  }
}
function ldCheck(R, P, lds, pre) {
  lds.forEach((b, i) => {
    try { const j = JSON.parse(b); if (!j['@context'] && !(Array.isArray(j) && j.every((x) => x['@context']))) R.warn(P, pre + 'jsonld', '#' + (i + 1) + ' @context 없음'); else R.pass(P, pre + 'jsonld', '#' + (i + 1)); }
    catch (e) { R.fail(P, pre + 'jsonld', '#' + (i + 1) + ' JSON 파싱 실패: ' + e.message.slice(0, 80)); }
  });
}

// ───────────────────────── wrangler ─────────────────────────
function wranglerJs() {
  const c = [opt.wrangler, process.env.SEO_CHECK_WRANGLER, join(ROOT, 'node_modules/wrangler')].filter(Boolean);
  for (let p of c) {
    p = resolve(p);
    if (/[\\/]\.bin[\\/]wrangler(\.cmd|\.ps1)?$/i.test(p)) p = join(dirname(p), '../wrangler/bin/wrangler.js');
    else if (existsSync(p) && statSync(p).isDirectory()) p = existsSync(join(p, 'bin/wrangler.js')) ? join(p, 'bin/wrangler.js') : join(p, 'node_modules/wrangler/bin/wrangler.js');
    if (existsSync(p)) return p;
  }
  return null;
}
const portBusy = (port) => new Promise((res) => {
  const s = net.connect({ port, host: '127.0.0.1' });
  s.once('connect', () => { s.destroy(); res(true); });
  s.once('error', () => res(false));
  s.setTimeout(800, () => { s.destroy(); res(false); });
});
function killTree(pid) {
  if (!pid) return;
  if (IS_WIN) spawnSync('taskkill', ['/PID', String(pid), '/F', '/T'], { stdio: 'ignore' });
  else { try { process.kill(-pid, 'SIGKILL'); } catch { try { process.kill(pid, 'SIGKILL'); } catch { /* */ } } }
}
// wrangler 는 workerd 를 2개 띄운다(entry=127.0.0.1:<port> 하나 + entry=127.0.0.1:0 하나) → 포트 또는 부모 PID(죽은 뒤에도 기록이 남음)로 찾는다
function killWorkerd(port, parent) {
  if (!IS_WIN) { spawnSync('pkill', ['-f', 'workerd.*[:=]' + port + '\\b'], { stdio: 'ignore' }); if (parent) spawnSync('pkill', ['-P', String(parent)], { stdio: 'ignore' }); return; }
  const ps = `Get-CimInstance Win32_Process -Filter "Name='workerd.exe'" | Where-Object { $_.ParentProcessId -eq ${parent || -1} -or $_.CommandLine -match '[:=]${port}\\b' -or $_.CommandLine -match '[:=]${port + 600}\\b' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }`;
  spawnSync('powershell', ['-NoProfile', '-NonInteractive', '-Command', ps], { stdio: 'ignore' });
}
async function startServer(dir, port) {
  const wj = wranglerJs();
  if (!wj) throw new Error('wrangler 를 찾지 못함 — --wrangler <…/node_modules/wrangler> 또는 SEO_CHECK_WRANGLER');
  for (const p of [port, port + 600]) if (await portBusy(p)) throw new Error('포트 ' + p + ' 사용 중');
  const hadWr = existsSync(join(dir, '.wrangler'));
  mkdirSync(opt.persist, { recursive: true }); mkdirSync(opt.logDir, { recursive: true });
  const log = join(opt.logDir, 'wr-' + port + '.log');
  const fd = openSync(log, 'w');
  const a = [wj, 'pages', 'dev', '.', '--port', String(port), '--ip', '127.0.0.1', '--inspector-port', String(port + 600),
    '--compatibility-date', '2026-01-01', '--persist-to', opt.persist, ...opt.env.flatMap((e) => ['--binding', e])];
  const child = spawn(process.execPath, a, { cwd: dir, stdio: ['ignore', fd, fd], detached: !IS_WIN, windowsHide: true,
    env: { ...process.env, WRANGLER_SEND_METRICS: 'false', NO_COLOR: '1', FORCE_COLOR: '0' } });
  let exited = null; child.on('exit', (c) => { exited = c; });
  const srv = {
    url: 'http://127.0.0.1:' + port, log, stopped: false,
    stop() {
      if (this.stopped) return; this.stopped = true;
      killTree(child.pid); killWorkerd(port, child.pid);
      try { closeSync(fd); } catch { /* */ }
      if (!hadWr) { try { rmSync(join(dir, '.wrangler'), { recursive: true, force: true }); } catch { /* 잠금 */ } }
    },
  };
  CLEANUP.add(srv);
  const t0 = Date.now();
  while (Date.now() - t0 < 120000) {
    if (exited !== null) { srv.stop(); CLEANUP.delete(srv); throw new Error('wrangler 종료(코드 ' + exited + ') — 로그 ' + log + '\n' + tail(log)); }
    try { const r = await fetch(srv.url + '/', { redirect: 'manual', signal: AbortSignal.timeout(3000) }); await r.arrayBuffer(); if (r.status) return srv; } catch { /* 아직 */ }
    await sleep(700);
  }
  srv.stop(); CLEANUP.delete(srv);
  throw new Error('wrangler 준비 시간 초과 — 로그 ' + log + '\n' + tail(log));
}
const tail = (f) => { try { return readFileSync(f, 'utf8').split('\n').slice(-15).join('\n'); } catch { return ''; } };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const CLEANUP = new Set();
const cleanupAll = () => { for (const s of CLEANUP) { try { s.stop(); } catch { /* */ } } CLEANUP.clear(); };
process.on('exit', cleanupAll);
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sig, () => { cleanupAll(); process.exit(130); });

async function get(srv, path) {
  try {
    const r = await fetch(srv.url + path, { redirect: 'manual', signal: AbortSignal.timeout(30000) });
    const body = await r.text();
    return { status: r.status, ct: r.headers.get('content-type') || '', xrobots: r.headers.get('x-robots-tag') || '', loc: r.headers.get('location'), body };
  } catch (e) { return { status: 0, ct: '', body: '', err: String(e.message || e) }; }
}
async function pool(items, n, fn) {
  const out = new Array(items.length); let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); } }));
  return out;
}

async function serverCheck(ctx, srv, R) {
  const { origin } = ctx;
  for (const pg of ctx.pages) {
    const { P, base } = pg;
    pg.srv = {};
    const r0 = await get(srv, P);
    if (r0.status !== 200) { R.fail(P, 'srv.status', P + ' → ' + (r0.status || r0.err) + (r0.loc ? ' → ' + r0.loc : '')); continue; }
    if (!/text\/html/i.test(r0.ct)) R.fail(P, 'srv.type', 'Content-Type ' + r0.ct);
    if (/noindex/i.test(r0.xrobots)) R.fail(P, 'srv.robots', 'X-Robots-Tag: ' + r0.xrobots + ' (로컬 호스트인데 noindex)');
    const h0 = parseHtml(r0.body);
    pg.srv[base] = h0;
    const s0 = [];
    if (h0.canon[0] !== origin + P) s0.push('canonical ' + h0.canon[0]);
    if (h0.ogUrl != null && h0.ogUrl !== origin + P) s0.push('og:url ' + h0.ogUrl);
    if (normLang(h0.lang) !== base) s0.push('<html lang="' + h0.lang + '">');
    if (s0.length) R.fail(P, 'srv.base', short(s0) + ' (기대 ' + origin + P + ' · ' + HV(base) + ')'); else R.pass(P, 'srv.base', '기준 주소 정본');
    if (!ctx.multi) continue;
    // ?lang=<기준> → 기준 canonical
    const rb = await get(srv, P + '?lang=' + encodeURIComponent(base));
    if (rb.status === 200) {
      const hb = parseHtml(rb.body);
      if (hb.canon[0] !== origin + P) R.fail(P, 'srv.base-lang', '?lang=' + base + ' canonical ' + hb.canon[0] + ' (기대 ' + origin + P + ')');
      else R.pass(P, 'srv.base-lang', '?lang=' + base + ' → 기준 canonical');
    } else R.fail(P, 'srv.base-lang', '?lang=' + base + ' → ' + (rb.status || rb.err));
    // 12개 언어
    const others = ctx.langs.filter((l) => l !== base);
    const res = await pool(others, 6, (l) => get(srv, P + '?lang=' + encodeURIComponent(l)));
    const bad = {}; const push = (id, l, why) => { (bad[id] = bad[id] || []).push(l + ': ' + why); };
    others.forEach((l, i) => {
      const r = res[i];
      const self = origin + P + '?lang=' + encodeURIComponent(l);
      if (r.status !== 200) { push('srv.status', l, String(r.status || r.err) + (r.loc ? ' → ' + r.loc : '')); return; }
      if (!/text\/html/i.test(r.ct)) push('srv.type', l, r.ct);
      const h = parseHtml(r.body);
      pg.srv[l] = h;
      if (h.canon.length !== 1 || h.canon[0] !== self) push('srv.canonical', l, (h.canon.join(', ') || '없음') + (h.canon[0] === origin + P ? ' (기준 주소로 고정)' : ''));
      if (h.ogUrl != null && h.ogUrl !== self) push('srv.og:url', l, h.ogUrl);
      if (h.lang !== HV(l)) push('srv.html-lang', l, '<html lang="' + h.lang + '"> (기대 ' + HV(l) + ')');
      if (!h.title) push('srv.title', l, '빈 title');
      else if (h0.title && h.title === h0.title) push('srv.title', l, '기준 언어 title 그대로');
      if (!h.desc || !h.desc.trim()) push('srv.description', l, '빈 description');
      else if (h0.desc && squash(h.desc) === squash(h0.desc)) push('srv.description', l, '기준 언어 description 그대로');
      const why = scriptMismatch(l, (h.title || '') + ' ' + (h.desc || ''));
      if (why) push('srv.script', l, why + ' — "' + (h.title || '').slice(0, 50) + '"');
      if (h.ogLocale != null && h.ogLocale !== LOCALE[l]) push('srv.og:locale', l, h.ogLocale + ' (기대 ' + LOCALE[l] + ')');
      if (/noindex/i.test(h.robots + ' ' + r.xrobots)) push('srv.robots', l, 'noindex');
      const d = diffAlts(h.alts, expectedAlts(origin, P, base, ctx.langs));
      if (d.length) push('srv.hreflang', l, short(d, 1));
      for (const [k, b] of h.ld.entries()) { try { JSON.parse(b); } catch (e) { push('srv.jsonld', l, '#' + (k + 1) + ' ' + e.message.slice(0, 60)); } }
      if (h.title && width(h.title, 60, 35) > 60) push('srv.title-len', l, '라틴 기준 ' + width(h.title, 60, 35) + '자 > 60');
    });
    const WARN_IDS = new Set(['srv.og:locale', 'srv.title-len']);
    const ALL = ['srv.status', 'srv.type', 'srv.canonical', 'srv.og:url', 'srv.html-lang', 'srv.title', 'srv.description', 'srv.script', 'srv.robots', 'srv.hreflang', 'srv.jsonld', 'srv.og:locale', 'srv.title-len'];
    for (const id of ALL) {
      if (bad[id]) R.add(WARN_IDS.has(id) ? 'WARN' : 'FAIL', P, id, bad[id].length + '/12 — ' + short(bad[id], 3));
      else R.pass(P, id, '12개 언어');
    }
  }
  const r4 = await get(srv, '/__seo-check-404__');
  if (r4.status === 404) R.pass('-', 'srv.404', '404');
  else R.fail('-', 'srv.404', '/__seo-check-404__ → ' + (r4.status || r4.err) + ' (소프트 404 — 404.html 필요)');
}

// ───────────────────────── 렌더 ─────────────────────────
function render(url, extra) {
  return new Promise((res) => {
    const c = spawn(process.execPath, [join(ROOT, 'scripts/seo-render.mjs'), '--url', url, '--wait', String(opt.renderWait), '--json', ...extra], { stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
    let out = '', err = '';
    c.stdout.on('data', (d) => (out += d)); c.stderr.on('data', (d) => (err += d));
    const t = setTimeout(() => killTree(c.pid), opt.renderWait * 3 + 45000);
    c.on('close', () => {
      clearTimeout(t);
      const line = out.split('\n').map((x) => x.trim()).filter((x) => x.startsWith('{')).pop();
      try { res({ ok: true, d: JSON.parse(line) }); } catch { res({ ok: false, err: (err || out || 'no output').trim().slice(-300) }); }
    });
  });
}
async function renderCheck(ctx, srv, R) {
  const pages = ctx.pages.filter((p) => p.srv && p.srv[p.base]).slice(0, opt.renderLimit);
  const jobs = [];
  for (const pg of pages) {
    const S = pg.base === 'ja' ? 'en' : 'ja';
    jobs.push({ pg, kind: 'bot', url: srv.url + pg.P, extra: [] });
    if (ctx.multi) {
      jobs.push({ pg, kind: 'bot-lang', S, url: srv.url + pg.P + '?lang=' + S, extra: [] });
      jobs.push({ pg, kind: 'user', S, url: srv.url + pg.P, extra: ['--as', 'user', '--lang', S === 'ja' ? 'ja-JP' : 'en-US', '--click-lsg'] });
    }
  }
  const results = await pool(jobs, opt.renderPar, (j) => render(j.url, j.extra));
  jobs.forEach((j, i) => {
    const r = results[i]; const { pg } = j; const P = pg.P;
    if (!r.ok) { R.warn(P, 'render.' + j.kind, '렌더 실패: ' + r.err); return; }
    const d = r.d;
    if (j.kind === 'bot') {
      const hl = normLang(d.htmlLang);
      if (hl !== pg.base) R.fail(P, 'render.htmlLang', '구글봇(en-US) 렌더 <html lang="' + d.htmlLang + '"> ≠ 기준 ' + pg.base + ' — 표시 언어를 navigator 로 정함(L1)');
      else R.pass(P, 'render.htmlLang', d.htmlLang);
      const want = pg.srv[pg.base].title;
      if (squash(d.title) !== want) R.fail(P, 'render.title', '구글봇 렌더 title "' + String(d.title).slice(0, 60) + '" ≠ 원본 "' + String(want).slice(0, 60) + '"');
      else R.pass(P, 'render.title', '원본과 같음');
      if (d.lsg && d.lsg.shown) R.fail(P, 'render.lsg-bot', '구글봇에게 제안 바가 보임');
      else R.pass(P, 'render.lsg-bot', '없음');
      if (!d.h1 || !d.h1.length) R.warn(P, 'render.h1', '렌더 후 <h1> 없음');
      const s = d.script || {};
      const share = pg.base === 'ko' ? s.hangul : pg.base === 'ja' ? s.kana + s.han : (pg.base === 'zh' || pg.base === 'zh-Hant') ? s.han : pg.base === 'ru' ? s.cyrillic : pg.base === 'th' ? s.thai : s.latin;
      const msg = '본문 글자 중 기준 언어(' + pg.base + ') 문자 ' + share + '% (한글 ' + s.hangul + ' · 가나 ' + s.kana + ' · 한자 ' + s.han + ' · 라틴 ' + s.latin + ')';
      if (!(share >= 20)) R.fail(P, 'render.script', msg + ' — 구글봇이 다른 언어판을 봄');
      else if (share < 40) R.warn(P, 'render.script', msg);
      else R.pass(P, 'render.script', msg);
      if (d.consoleErrors && d.consoleErrors.length) R.warn(P, 'render.errors', d.consoleErrors.length + '건: ' + d.consoleErrors[0].slice(0, 120));
    } else if (j.kind === 'bot-lang') {
      if (d.htmlLang !== HV(j.S)) R.fail(P, 'render.lang-htmlLang', '구글봇 ?lang=' + j.S + ' 렌더 <html lang="' + d.htmlLang + '"> (기대 ' + HV(j.S) + ')');
      else R.pass(P, 'render.lang-htmlLang', d.htmlLang);
      const want = pg.srv[j.S] && pg.srv[j.S].title;
      if (want == null) R.warn(P, 'render.lang-title', '서버 ?lang=' + j.S + ' 응답 없음 — 비교 생략');
      else if (squash(d.title) !== want) R.fail(P, 'render.lang-title', '?lang=' + j.S + ' 렌더 title "' + String(d.title).slice(0, 60) + '" ≠ 서버 원본 "' + String(want).slice(0, 60) + '" — 앱 사전과 seo-meta 불일치');
      else R.pass(P, 'render.lang-title', '서버 원본과 같음');
    } else {
      const hasLs = /lang-suggest\.js/.test(pg.html);
      if (!hasLs) { R.warn(P, 'render.lsg-user', 'lang-suggest.js 미사용 — 제안 바 검사 생략'); return; }
      if (!d.lsg || !d.lsg.shown) { R.fail(P, 'render.lsg-user', (j.S === 'ja' ? 'ja-JP' : 'en-US') + ' 사용자에게 제안 바가 안 뜸' +
        (normLang(d.htmlLang) !== pg.base ? ' — 화면이 이미 <html lang="' + d.htmlLang + '"> (표시 언어를 navigator 로 정했을 가능성 · L1)' : '')); return; }
      if (d.lsg.lang !== HV(j.S)) R.fail(P, 'render.lsg-user', '제안 바 언어 ' + d.lsg.lang + ' (기대 ' + HV(j.S) + ')');
      else R.pass(P, 'render.lsg-user', d.lsg.text.slice(0, 60));
      const a = d.after || {};
      let u = null; try { u = new URL(a.url); } catch { /* */ }
      if (!u || u.searchParams.get('lang') !== j.S || u.pathname !== new URL(srv.url + P).pathname) R.fail(P, 'render.lsg-click', '[보기] 후 주소 ' + a.url + ' (기대 ' + P + '?lang=' + j.S + ')');
      else if (a.htmlLang !== HV(j.S)) R.fail(P, 'render.lsg-click', '[보기] 후 <html lang="' + a.htmlLang + '">');
      else R.pass(P, 'render.lsg-click', a.url.replace(srv.url, ''));
      const kv = a.lsgKey && a.lsgKey.value;
      if (a.lsgKey && a.lsgKey.key && !(kv === j.S || kv === JSON.stringify(j.S))) R.warn(P, 'render.lsg-store', '[보기] 후 ' + a.lsgKey.key + ' = ' + kv + ' (기대 ' + j.S + ')');
    }
  });
}

// ───────────────────────── 출력 ─────────────────────────
function printReport(R, label) {
  const i = R.info || {};
  console.log('\n== ' + label + '  (' + [i.origin, i.multi === undefined ? null : i.multi ? '다국어[' + (i.signals || []).join(', ') + ']' : '단일 언어', i.pages != null ? '페이지 ' + i.pages : null].filter(Boolean).join(' · ') + ')');
  const show = R.rows.filter((r) => opt.verbose || r.sev !== 'PASS');
  const order = { FAIL: 0, WARN: 1, PASS: 2 };
  show.sort((a, b) => order[a.sev] - order[b.sev]);
  const per = new Map(); let hidden = 0;
  const w = Math.min(28, Math.max(4, ...show.map((r) => r.page.length)));
  for (const r of show) {
    const k = r.sev + '|' + r.id; const c = (per.get(k) || 0) + 1; per.set(k, c);
    if (!opt.verbose && c > 5) { hidden++; continue; }
    const m = !opt.verbose && r.msg.length > 320 ? r.msg.slice(0, 317) + '…' : r.msg; // 전문은 --verbose / --json
    console.log(' ' + r.sev.padEnd(4) + '  ' + r.page.padEnd(w) + '  ' + r.id.padEnd(20) + ' ' + m);
  }
  if (hidden) console.log('  … 같은 검사 ' + hidden + '줄 더(--verbose / --json)');
  console.log(' → PASS ' + R.n('PASS') + ' · WARN ' + R.n('WARN') + ' · FAIL ' + R.n('FAIL'));
}

async function checkApp(appArg) {
  const rel = relative(process.cwd(), resolve(appArg)).replace(/\\/g, '/');
  const label = !rel ? appArg : rel.startsWith('..') ? '…/' + resolve(appArg).replace(/\\/g, '/').split('/').slice(-2).join('/') : rel;
  const R = new Report(label);
  const ctx = staticCheck(appArg, R);
  if (ctx && opt.server === 'wrangler' && ctx.pages.length) {
    let srv = null;
    try {
      srv = await startServer(ctx.dir, opt.port);
      await serverCheck(ctx, srv, R);
      if (opt.render) await renderCheck(ctx, srv, R);
    } catch (e) {
      R.fail('-', 'server', String(e.message || e).split('\n').slice(0, 6).join(' | '));
    } finally {
      if (srv) { srv.stop(); CLEANUP.delete(srv); }
    }
  }
  return R;
}

// ───────────────────────── selftest ─────────────────────────
const ST = {
  t: { en: 'Sample page', ja: 'サンプルページ', ko: '샘플 페이지', zh: '示例页面', 'zh-Hant': '範例頁面', th: 'หน้าตัวอย่าง', es: 'Página de ejemplo', fr: "Page d'exemple", de: 'Beispielseite', it: 'Pagina di esempio', pt: 'Página de exemplo', ru: 'Пример страницы', nl: 'Voorbeeldpagina' },
  g: { en: 'Guide', ja: 'ガイド', ko: '안내', zh: '指南', 'zh-Hant': '指南', th: 'คู่มือ', es: 'Guía', fr: 'Guide', de: 'Anleitung', it: 'Guida', pt: 'Guia', ru: 'Руководство', nl: 'Handleiding' },
  p: { en: 'This page is used to test the language rules.', ja: 'このページは言語ルールのテストに使います。', ko: '이 페이지는 언어 규칙을 시험하는 데 씁니다.', zh: '此页面用于测试语言规则。', 'zh-Hant': '此頁面用於測試語言規則。', th: 'หน้านี้ใช้ทดสอบกฎด้านภาษา', es: 'Esta página sirve para probar las reglas de idioma.', fr: 'Cette page sert à tester les règles de langue.', de: 'Diese Seite dient zum Testen der Sprachregeln.', it: 'Questa pagina serve a testare le regole della lingua.', pt: 'Esta página serve para testar as regras de idioma.', ru: 'Эта страница нужна для проверки языковых правил.', nl: 'Deze pagina dient om de taalregels te testen.' },
};
const ST_ORIGIN = 'https://seo-selftest.broodev.com';
function stDict(P) {
  const o = {};
  for (const l of LANGS) o[l] = P === '/' ? { t: ST.t[l] + ' | SEO_SELFTEST', h: ST.t[l], d: ST.p[l] } : { t: ST.g[l] + ' · ' + ST.t[l] + ' | SEO_SELFTEST', h: ST.g[l], d: ST.g[l] + ': ' + ST.p[l] };
  return o;
}
function stPage(P, { navigator = false } = {}) {
  const D = stDict(P); const k = D.ko; const self = ST_ORIGIN + P;
  const alts = [...expectedAlts(ST_ORIGIN, P, 'ko').entries()].map(([h, u]) => `    <link rel="alternate" hreflang="${h}" href="${u}" />`).join('\n');
  const pick = navigator
    ? `var c = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language]; for (var i = 0; i < c.length && !l; i++) { var b = String(c[i]).toLowerCase().split('-')[0]; if (L.indexOf(b) >= 0) l = b; } l = l || 'en';`
    : `l = l || 'ko';`;
  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${k.t}</title>
    <meta name="description" content="${k.d}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${self}" />
${alts}
    <meta property="og:url" content="${self}" />
    <meta property="og:title" content="${k.t}" />
    <meta property="og:description" content="${k.d}" />
    <meta property="og:locale" content="ko_KR" />
    <script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":${JSON.stringify(k.h)},"url":"${self}"}</script>
    <style>body{font:16px/1.6 system-ui,sans-serif;margin:0;padding:24px;background:#fff;color:#111}</style>
  </head>
  <body>
    <h1 id="h">${k.h}</h1>
    <p id="p">${k.d}</p>
    <p><a href="/">${ST.t.ko}</a> · <a href="/guide">${ST.g.ko}</a></p>
    <script>
      (function () {
        var D = ${JSON.stringify(D)};
        var L = ${JSON.stringify(LANGS)};
        var l = null;
        try { var q = new URLSearchParams(location.search).get('lang'); if (L.indexOf(q) >= 0) l = q; } catch (e) {}
        if (!l) { try { var s = localStorage.getItem('st:lang'); if (L.indexOf(s) >= 0) l = s; } catch (e) {} }
        ${pick}
        if (l !== 'ko') {
          document.documentElement.lang = l === 'zh' ? 'zh-Hans' : l;
          document.title = D[l].t;
          document.getElementById('h').textContent = D[l].h;
          document.getElementById('p').textContent = D[l].d;
        }
      })();
    </script>
    <script src="/lang-suggest.js" data-key="st:lang" data-base="ko" defer></script>
  </body>
</html>
`;
}
function buildFixture(dir, variant) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(join(dir, 'functions/_lib'), { recursive: true });
  const pages = { '/': 'index.html', '/guide': 'guide.html' };
  for (const [P, f] of Object.entries(pages)) writeFileSync(join(dir, f), stPage(P, { navigator: variant === 'navigator' }));
  writeFileSync(join(dir, '404.html'), '<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>404 | SEO_SELFTEST</title><meta name="robots" content="noindex"></head><body><h1>404</h1></body></html>\n');
  writeFileSync(join(dir, 'robots.txt'), 'User-agent: *\nAllow: /\n\nSitemap: ' + ST_ORIGIN + '/sitemap.xml\n');
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
  for (const P of Object.keys(pages)) {
    const exp = expectedAlts(ST_ORIGIN, P, 'ko');
    const links = [...exp.entries()].map(([h, u]) => `    <xhtml:link rel="alternate" hreflang="${h}" href="${u}" />`).join('\n');
    for (const loc of new Set([...exp.entries()].filter(([h]) => h !== 'x-default').map(([, u]) => u))) xml += `  <url>\n    <loc>${loc}</loc>\n    <lastmod>2026-10-10</lastmod>\n${links}\n  </url>\n`;
  }
  writeFileSync(join(dir, 'sitemap.xml'), xml + '</urlset>\n');
  writeFileSync(join(dir, 'lang-suggest.js'), readFileSync(join(ROOT, 'packages/seo/lang-suggest.js'), 'utf8'));
  writeFileSync(join(dir, 'functions/_lib/seo-lang.js'), readFileSync(join(ROOT, 'packages/seo/seo-lang.js'), 'utf8'));
  const META = {};
  for (const P of Object.keys(pages)) { const D = stDict(P); META[P] = {}; for (const l of LANGS) if (l !== 'ko') META[P][l] = { t: D[l].t, d: D[l].d }; }
  writeFileSync(join(dir, 'functions/_lib/seo-meta.js'), '// selftest — stDict 에서 생성\nexport default ' + JSON.stringify(META, null, 1) + ';\n');
  writeFileSync(join(dir, 'functions/_middleware.js'), variant === 'canonical-root'
    // 예전 방식: ?lang 이면 title/description/lang 만 바꾸고 canonical 은 그대로(루트 고정)
    ? `import META from './_lib/seo-meta.js';
class A { constructor(n, v) { this.n = n; this.v = v; } element(e) { e.setAttribute(this.n, this.v); } }
class T { constructor(v) { this.v = v; } element(e) { e.setInnerContent(this.v); } }
export async function onRequest(ctx) {
  const res = await ctx.next(); const u = new URL(ctx.request.url); const l = u.searchParams.get('lang');
  const p = u.pathname.replace(/\\.html$/, '') || '/'; const m = l && META[p] && META[p][l];
  if (!m || !(res.headers.get('content-type') || '').includes('text/html')) return res;
  return new HTMLRewriter().on('html', new A('lang', l)).on('title', new T(m.t)).on('meta[name="description"]', new A('content', m.d)).transform(res);
}
`
    : `import { seoLang } from './_lib/seo-lang.js';
import META from './_lib/seo-meta.js';
export const onRequest = seoLang({ origin: '${ST_ORIGIN}', base: 'ko', meta: META });
`);
  writeFileSync(join(dir, '_routes.json'), JSON.stringify({ version: 1, include: ['/*'], exclude: ['/lang-suggest.js', '/robots.txt', '/sitemap.xml'] }, null, 2) + '\n');
  if (variant === 'canonical-root') {
    rmSync(join(dir, 'functions/_lib/seo-lang.js'));
    const f = join(dir, 'guide.html');
    writeFileSync(f, readFileSync(f, 'utf8').replace(`<link rel="canonical" href="${ST_ORIGIN}/guide" />`, `<link rel="canonical" href="${ST_ORIGIN}/" />`));
  }
  if (variant === 'hreflang-missing') {
    const f = join(dir, 'guide.html');
    writeFileSync(f, readFileSync(f, 'utf8').replace(/\n\s*<link rel="alternate" hreflang="th"[^\n]*/, ''));
  }
}
async function selftest() {
  const root = resolve(opt['selftest-dir'] || join(tmpdir(), 'broodev-seo-selftest'));
  mkdirSync(root, { recursive: true });
  const cases = [
    { v: 'good', args: ['--server', 'wrangler', '--render'], expectFail: [], expectWarn: [], noFail: true },
    { v: 'hreflang-missing', args: ['--server', 'wrangler'], expectFail: ['hreflang', 'srv.hreflang'] },
    { v: 'canonical-root', args: ['--server', 'wrangler'], expectFail: ['canonical', 'srv.canonical', 'srv.html-lang'] },
    { v: 'navigator', args: ['--server', 'wrangler', '--render'], expectFail: ['render.htmlLang', 'render.title', 'render.script'], expectWarn: ['nav-detect'] },
  ];
  let ok = true;
  for (const c of cases) {
    const dir = join(root, c.v);
    buildFixture(dir, c.v);
    const jf = join(root, c.v + '.json');
    const pass = ['--port', String(opt.port), '--json', jf, '--persist', opt.persist, '--log-dir', opt.logDir, ...(opt.wrangler ? ['--wrangler', opt.wrangler] : []), '--render-wait', String(Math.min(opt.renderWait, 6000))];
    const t0 = Date.now();
    const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), dir, ...c.args, ...pass], { encoding: 'utf8', windowsHide: true });
    let j = null; try { j = JSON.parse(readFileSync(jf, 'utf8')); } catch { /* */ }
    const rows = j ? j.apps[0].rows : [];
    const fails = new Set(rows.filter((x) => x.sev === 'FAIL').map((x) => x.id));
    const warns = new Set(rows.filter((x) => x.sev === 'WARN').map((x) => x.id));
    const problems = [];
    if (!j) problems.push('JSON 없음: ' + (r.stderr || r.stdout || '').slice(-300));
    if (c.noFail && fails.size) problems.push('FAIL 이 나면 안 됨: ' + [...fails].join(', ') + ' — ' + rows.filter((x) => x.sev === 'FAIL').map((x) => x.page + ' ' + x.id + ' ' + x.msg).join(' | ').slice(0, 600));
    if (c.noFail && r.status !== 0) problems.push('종료 코드 ' + r.status);
    if (!c.noFail && r.status !== 1) problems.push('종료 코드 ' + r.status + ' (기대 1)');
    for (const id of c.expectFail) if (!fails.has(id)) problems.push('FAIL 기대 ' + id + ' — 없음');
    for (const id of c.expectWarn || []) if (!warns.has(id)) problems.push('WARN 기대 ' + id + ' — 없음');
    if (c.noFail && warns.size) console.log('   (good WARN: ' + rows.filter((x) => x.sev === 'WARN').map((x) => x.page + ' ' + x.id + ' ' + x.msg).join(' | ').slice(0, 400) + ')');
    console.log((problems.length ? 'FAIL' : 'PASS') + '  selftest ' + c.v.padEnd(18) + ' ' + ((Date.now() - t0) / 1000).toFixed(0) + 's  FAIL[' + [...fails].join(', ') + '] WARN[' + [...warns].join(', ') + ']');
    for (const p of problems) console.log('      ' + p);
    if (problems.length) ok = false;
  }
  if (!opt['keep-fixture']) { try { rmSync(root, { recursive: true, force: true }); } catch { /* */ } }
  console.log(ok ? '\nselftest PASS' : '\nselftest FAIL');
  process.exit(ok ? 0 : 1);
}

// ───────────────────────── main ─────────────────────────
if (opt.selftest) await selftest();
if (!opt.apps.length) {
  console.error('usage: node scripts/seo-check.mjs <앱 폴더…> [--server wrangler|none] [--render] [--port N] [--env K=V] [--json out] [--allow-noindex] [--single|--multi] [--verbose]\n       node scripts/seo-check.mjs --selftest');
  process.exit(2);
}
const reports = [];
for (const a of opt.apps) { const R = await checkApp(a); reports.push(R); printReport(R, R.app); }
const tot = (s) => reports.reduce((n, R) => n + R.n(s), 0);
if (reports.length > 1) {
  console.log('\n== 요약');
  for (const R of reports) console.log(' ' + (R.n('FAIL') ? 'FAIL' : R.n('WARN') ? 'WARN' : 'PASS').padEnd(4) + '  ' + R.app.padEnd(28) + ' FAIL ' + R.n('FAIL') + ' · WARN ' + R.n('WARN') + ' · PASS ' + R.n('PASS'));
}
if (opt.json) {
  mkdirSync(dirname(resolve(opt.json)), { recursive: true });
  writeFileSync(opt.json, JSON.stringify({ when: new Date().toISOString(), options: { server: opt.server, render: !!opt.render, env: opt.env }, apps: reports.map((R) => ({ app: R.app, ...R.info, pass: R.n('PASS'), warn: R.n('WARN'), fail: R.n('FAIL'), rows: R.rows })) }, null, 1));
}
cleanupAll();
process.exit(tot('FAIL') ? 1 : 0);
