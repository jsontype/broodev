#!/usr/bin/env node
// 콘텐츠 페이지 번역 검사기 — content-i18n.js 를 쓰는 페이지(가이드·소개·약관·404)마다 12개 언어 조각이 한국어 원문과 같은 구조인지,
// 페이지 스크립트(차트 등)의 문구가 13개 언어로 다 들어갔는지 확인한다.
//   node scripts/content-i18n-check.mjs                         → apps/*/ 전체에서 <script src="/content-i18n.js" data-doc=…> 가 있는 페이지
//   node scripts/content-i18n-check.mjs apps/btc                → 한 앱만
//   node scripts/content-i18n-check.mjs --page apps/btc/macd-guide.html --langs en,ja   → 한 페이지 · 일부 언어만
// 실패(exit 1): 조각 없음 · <main data-title/data-desc> 없음 · 블록 구조(h1~h6·p·ul/ol/li·table·pre·nav·footer…) 순서 불일치 ·
//   링크(href) 불일치 · id/class/data-* 속성 불일치(스크립트·CSS 가 쓰는 훅) · 한글 잔존 · 그 언어의 문자 체계 없음(ja 가나 · zh 한자 · th 태국 문자 · ru 키릴) ·
//   본문 길이 비정상(잘림 의심) · data-doc 이 파일명과 다름 · 페이지 스크립트의 TR({…}) 에 13개 언어가 다 없음 · TR({…}) 밖에 한글 문자열이 남음
// 경고: 숫자 누락 · <code>/<pre> 개수 차이 · 조각 안의 <script>(실행되지 않음)
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname, join, basename, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';

const R = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ALL = ['en', 'ja', 'zh', 'zh-Hant', 'th', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'nl'];   // ko 는 원문(HTML 본문)
const T_KEYS = ['ko'].concat(ALL);
const BLOCK = new Set(['nav', 'main', 'section', 'article', 'aside', 'header', 'footer', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'dl', 'dt', 'dd',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'pre', 'blockquote', 'figure', 'figcaption', 'details', 'summary', 'hr', 'img', 'form', 'label', 'input', 'select', 'textarea', 'button', 'svg', 'canvas']);
const HANGUL = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/;
const NEED = { ja: /[\u3040-\u30FF]/, zh: /[\u4E00-\u9FFF]/, 'zh-Hant': /[\u4E00-\u9FFF]/, th: /[\u0E00-\u0E7F]/, ru: /[\u0400-\u04FF]/ };

const argv = process.argv.slice(2);
const opt = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
const onlyPage = opt('--page'), onlyLangs = opt('--langs');
const LANGS = onlyLangs ? onlyLangs.split(',').map((s) => s.trim()).filter((l) => ALL.includes(l)) : ALL;
const pos = argv.filter((a, i) => !a.startsWith('--') && !(i > 0 && argv[i - 1].startsWith('--')));
const targets = onlyPage ? [dirname(onlyPage)] : pos.length ? pos : readdirSync(join(R, 'apps')).map((d) => 'apps/' + d).filter((d) => statSync(join(R, d)).isDirectory());
const absOf = (p) => (isAbsolute(p) ? p : join(R, p));

const strip = (s) => s.replace(/<!--[\s\S]*?-->/g, '');
const mainOf = (s) => { const m = /<main\b([^>]*)>([\s\S]*?)<\/main>/i.exec(strip(s)); return m ? { attrs: m[1], body: m[2] } : null; };
const attr = (attrs, name) => { const m = new RegExp('\\s' + name + '="([^"]*)"').exec(attrs); return m ? m[1] : null; };
const blocks = (h) => [...h.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g)].filter((m) => BLOCK.has(m[2].toLowerCase())).map((m) => m[1] + m[2].toLowerCase());
const hrefs = (h) => [...h.matchAll(/\shref="([^"]*)"/g)].map((m) => m[1]).sort();
const hooks = (h) => [...h.matchAll(/\s(id|class|data-[a-z0-9-]+)="([^"]*)"/g)].map((m) => m[1] + '=' + m[2]).sort();
const text = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const codes = (h) => [...h.matchAll(/<(code|pre)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map((m) => text(m[2]));
const nums = (t) => (t.match(/\d+(?:[.,]\d+)*/g) || []).map((n) => n.replace(/[.,]/g, ''));
const diff = (a, b) => { const x = a.slice(), out = []; for (const v of b) { const i = x.indexOf(v); if (i >= 0) x.splice(i, 1); else out.push('+' + v); } return out.concat(x.map((v) => '-' + v)); };

let pages = 0, fails = 0, warns = 0;
const fail = (where, msg) => { fails++; console.log('  FAIL ' + where + ' — ' + msg); };
const warn = (where, msg) => { warns++; console.log('  warn ' + where + ' — ' + msg); };

// 페이지 스크립트(차트 등): TR({ ko: '…', en: '…', … }) 마다 13개 언어 · T 밖 한글 문자열 없음
function checkScripts(src, rel) {
  const scripts = [...src.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*ld\+json)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  for (const code0 of scripts) {
    const code = code0.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"\\])\/\/.*$/gm, '$1');
    if (!HANGUL.test(code)) continue;
    if (!/window\.CI18N/.test(code)) { fail(rel, '한글 문구가 있는 페이지 스크립트가 CI18N.ready 로 감싸여 있지 않음'); continue; }
    let rest = code, n = 0;
    for (const m of code.matchAll(/\bTR\(\{([\s\S]*?)\}\)/g)) {
      n++;
      const body = m[1];
      const keys = [...body.matchAll(/(?:^|[,{\s])(?:'([a-zA-Z-]+)'|"([a-zA-Z-]+)"|([a-zA-Z]+))\s*:/g)].map((k) => k[1] || k[2] || k[3]);
      const missing = T_KEYS.filter((k) => !keys.includes(k));
      if (missing.length) fail(rel, `TR({…}) #${n} 에 언어 없음: ${missing.join(',')} «${body.trim().slice(0, 50)}»`);
      const koVal = /(?:^|[,{\s])ko\s*:\s*('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`[^`]*`)/.exec(body);
      const others = koVal ? body.replace(koVal[1], "''") : body;
      if (HANGUL.test(others)) fail(rel, `TR({…}) #${n} 의 ko 밖 값에 한글: «${others.trim().slice(0, 60)}»`);
      rest = rest.replace(m[0], 'TR()');
    }
    const stray = [...rest.matchAll(/'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`([^`]*)`/g)].map((m) => m[1] || m[2] || m[3] || '').filter((s) => HANGUL.test(s));
    for (const s of stray.slice(0, 6)) fail(rel, '페이지 스크립트에 TR({…}) 밖 한글 문자열: «' + s.slice(0, 50) + '»');
  }
}

for (const appDir of targets) {
  const abs = absOf(appDir);
  if (!existsSync(abs)) continue;
  const htmls = [];
  const walk = (d) => { for (const e of readdirSync(d, { withFileTypes: true })) { const p = join(d, e.name); if (e.isDirectory()) { if (!/^(i18n|functions|node_modules|member|adsense)$/.test(e.name)) walk(p); } else if (e.name.endsWith('.html')) htmls.push(p); } };
  walk(abs);
  for (const file of htmls) {
    if (onlyPage && resolve(file) !== resolve(absOf(onlyPage))) continue;
    const src = readFileSync(file, 'utf8');
    const tag = /<script\b[^>]*\bsrc="\/content-i18n\.js[^"]*"[^>]*>/.exec(src);
    if (!tag) continue;
    pages++;
    const rel = (file.startsWith(R) ? file.slice(R.length + 1) : file).replace(/\\/g, '/');
    const doc = attr(tag[0], 'data-doc'), key = attr(tag[0], 'data-key');
    if (!doc || !key) { fail(rel, 'content-i18n.js 태그에 data-doc / data-key 없음'); continue; }
    if (doc !== basename(file, '.html')) fail(rel, `data-doc="${doc}" 가 파일명과 다름`);
    if (!existsSync(join(abs, 'content-i18n.js'))) fail(rel, '앱 루트에 content-i18n.js 없음');
    checkScripts(src, rel);
    // <main> 밖(사이트 메뉴 등)의 한글 — 링크는 _chrome 조각이 같은 href 로 덮어야 하고, 링크가 아닌 글자는 남으면 안 된다
    const outside = strip(src.split(/<body\b/i)[1] || '').replace(/<main\b[\s\S]*?<\/main>/i, '').replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, '');
    const outLinks = [...outside.matchAll(/<a\b[^>]*\shref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].filter((m) => HANGUL.test(text(m[2]))).map((m) => m[1]);
    const outText = text(outside.replace(/<a\b[\s\S]*?<\/a>/g, ' '));
    if (HANGUL.test(outText)) fail(rel, '<main> 밖에 링크가 아닌 한글이 있음(조각으로 못 바꿈): «' + outText.slice(0, 60) + '»');
    if (outLinks.length) {
      if (!/\sdata-chrome\b/.test(tag[0])) fail(rel, '<main> 밖 한글 링크가 있는데 스크립트 태그에 data-chrome 이 없음');
      for (const l of LANGS) {
        const cp = join(abs, 'i18n', '_chrome.' + l + '.html');
        if (!existsSync(cp)) { fail(rel + ' [' + l + ']', '메뉴 조각 없음: i18n/_chrome.' + l + '.html'); continue; }
        const cs = readFileSync(cp, 'utf8');
        const have = new Map([...cs.matchAll(/<a\b[^>]*\shref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => [m[1], text(m[2])]));
        const miss = outLinks.filter((h) => !have.has(h) || !have.get(h) || HANGUL.test(have.get(h)));
        if (miss.length) fail(rel + ' [' + l + ']', '메뉴 조각에 번역이 없는 링크: ' + miss.join(' '));
      }
    }
    const ko = mainOf(src);
    if (!ko) { fail(rel, '한국어 <main> 을 못 찾음'); continue; }
    const koBlocks = blocks(ko.body), koHrefs = hrefs(ko.body).join('\n'), koHooks = hooks(ko.body), koText = text(ko.body), koNums = nums(koText), koCodes = codes(ko.body);
    let ok = 0;
    for (const l of LANGS) {
      const fp = join(abs, 'i18n', doc + '.' + l + '.html');
      const where = rel + ' [' + l + ']';
      if (!existsSync(fp)) { fail(where, '조각 없음: i18n/' + doc + '.' + l + '.html'); continue; }
      const fs = readFileSync(fp, 'utf8');
      const m = mainOf(fs);
      if (!m) { fail(where, '조각에 <main> 없음'); continue; }
      const title = attr(m.attrs, 'data-title'), desc = attr(m.attrs, 'data-desc');
      let bad = 0;
      if (!title || !desc) { fail(where, 'data-title / data-desc 비어 있음'); bad++; }
      const b = blocks(m.body);
      if (b.join() !== koBlocks.join()) {
        let i = 0; while (i < b.length && b[i] === koBlocks[i]) i++;
        fail(where, `블록 구조 불일치 (원문 ${koBlocks.length}개 · 조각 ${b.length}개 · #${i} 원문 <${koBlocks[i] || '끝'}> ↔ 조각 <${b[i] || '끝'}>)`); bad++;
      }
      if (hrefs(m.body).join('\n') !== koHrefs) { fail(where, '링크(href) 목록이 원문과 다름: ' + diff(koHrefs.split('\n'), hrefs(m.body)).slice(0, 4).join(' ')); bad++; }
      const hk = hooks(m.body);
      if (hk.join('\n') !== koHooks.join('\n')) { fail(where, 'id/class/data-* 속성이 원문과 다름: ' + diff(koHooks, hk).slice(0, 4).join(' ')); bad++; }
      const t = text(m.body), all = t + ' ' + (title || '') + ' ' + (desc || '');
      const hg = HANGUL.exec(all);
      if (hg) { const i = all.indexOf(hg[0]); fail(where, '한글 잔존: «' + all.slice(Math.max(0, i - 20), i + 30) + '»'); bad++; }
      if (NEED[l] && !NEED[l].test(t)) { fail(where, l + ' 문자 체계가 본문에 없음(번역 안 됨?)'); bad++; }
      const ratio = t.length / Math.max(1, koText.length);
      if (ratio < 0.45 || ratio > 5) { fail(where, `본문 길이 비정상 (원문 ${koText.length}자 · 조각 ${t.length}자)`); bad++; }
      const fn = nums(t), missing = koNums.filter((n) => { const k = fn.indexOf(n); if (k < 0) return true; fn.splice(k, 1); return false; });
      if (missing.length > Math.max(3, koNums.length * 0.15)) warn(where, `숫자 ${missing.length}개가 조각에 없음: ${missing.slice(0, 8).join(' ')}`);
      const fc = codes(m.body);
      if (fc.length !== koCodes.length) warn(where, `<code>/<pre> 개수 ${koCodes.length} → ${fc.length}`);
      if (/<script\b(?![^>]*ld\+json)/i.test(m.body)) warn(where, '조각 안 <script> 는 실행되지 않음');
      if (!bad) ok++;
    }
    console.log((ok === LANGS.length ? 'ok   ' : 'FAIL ') + rel + ` (${ok}/${LANGS.length})`);
  }
}
console.log(`pages ${pages} · fails ${fails} · warnings ${warns}`);
process.exit(fails || !pages ? 1 : 0);
