#!/usr/bin/env node
// i18n 누락 스캐너 — 실제 브라우저(Edge/Chrome 헤드리스 + CDP)로 페이지를 언어별로 띄우고, 화면에 보이는 글자의 문자 체계(스크립트)가
// 그 언어에 어울리지 않으면(예: 日本語 페이지에 한글, English 페이지에 한자·가나) 전부 찍어 낸다. 사전 키 누락·하드코딩 문자열이 "실제로 보이는지" 를 잡는 마지막 관문.
//   node scripts/i18n-scan.mjs --url http://127.0.0.1:8901/games/samurai/index.html --set qs:lang [--langs all|ja,ko] [--wait 5000]
//        [--set ls:st2:lang] [--set lsjson:btc:lang]   언어를 심는 방법(여러 개 가능): qs:<param> = ?param=xx · ls:<key> = localStorage 원문 · lsjson:<key> = JSON 문자열
//        [--skip "<css>"]   무시할 요소(기본: select·option·[lang]·[data-i18n-skip]·[translate=no]·.notranslate) 에 추가
//        [--allow "<regex>"] 허용 문자열(기본: 13개 언어 자국어 이름 · 特定商取引法) 에 추가 — 브랜드·고유명사 등 의도된 외국어
//        [--pre "<js>"]     스캔 직전에 실행할 JS(모달 열기 등) · [--hidden] 숨은 텍스트도 검사 · [--mobile] · [--json out.json]
// 출력: 언어별 불일치 목록(종류 · 위치 · 텍스트 · 발견된 스크립트) + 요약. 불일치가 있으면 exit 1. 외부 의존성 없음(Node 22+).
import { spawn } from 'node:child_process';
import { writeFileSync, existsSync } from 'node:fs';

const argv = process.argv.slice(2);
const args = {}; const multi = { set: [], skip: [], allow: [] };
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]; if (!a.startsWith('--')) continue;
  const k = a.slice(2), v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
  if (k in multi) multi[k].push(String(v)); else args[k] = v;
}
const ALL = ['en', 'ja', 'ko', 'zh', 'zh-Hant', 'th', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'nl'];
const langs = !args.langs || args.langs === 'all' ? ALL : String(args.langs).split(',').map(s => s.trim()).filter(Boolean);
const BROWSERS = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Google/Chrome/Application/chrome.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'];
const BROWSER = BROWSERS.find(p => existsSync(p));
if (!args.url || !multi.set.length || !BROWSER) { console.error('usage: --url <url> --set qs:lang|ls:<key>|lsjson:<key> [--langs all|a,b] [--wait ms] [--skip css] [--allow regex] [--pre js] [--hidden] [--mobile] [--json out]' + (BROWSER ? '' : '\n(Edge/Chrome 없음)')); process.exit(2); }
const wait = +(args.wait || 5000);
const W = +(args.w || (args.mobile ? 390 : 1440)), H = +(args.h || (args.mobile ? 844 : 900));

// 언어별로 허용되는 문자 체계. Latin 은 어디서나 허용(브랜드·숫자 단위·코드). 그 밖의 스크립트가 섞이면 불일치.
const SCRIPTS = { Hangul: /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/, Kana: /[\u3040-\u30FF\u31F0-\u31FF]/, Han: /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/, Thai: /[\u0E00-\u0E7F]/, Cyrillic: /[\u0400-\u04FF]/ };
const EXPECT = { ko: ['Hangul'], ja: ['Kana', 'Han'], zh: ['Han'], 'zh-Hant': ['Han'], th: ['Thai'], ru: ['Cyrillic'], en: [], es: [], fr: [], de: [], it: [], pt: [], nl: [] };
const AUTONYMS = ['English', '日本語', '한국어', '简体中文', '繁體中文', 'ไทย', 'Español', 'Français', 'Deutsch', 'Italiano', 'Português', 'Русский', 'Nederlands', '中文'];
const allowRe = new RegExp('^(?:' + AUTONYMS.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')$|特定商取引法' + (multi.allow.length ? '|' + multi.allow.join('|') : ''), 'u');
const skipSel = ['select', 'option', '[lang]:not(html)', '[data-i18n-skip]', '[translate="no"]', '.notranslate'].concat(multi.skip).join(',');

const profile = `${process.env.TEMP || process.env.TMPDIR || '/tmp'}/broodev-i18n-scan-${process.pid}`;
const edge = spawn(BROWSER, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--mute-audio', 'about:blank'], { stdio: ['ignore', 'pipe', 'pipe'] });
const wsUrl = await new Promise((res, rej) => { let buf = ''; const t = setTimeout(() => rej(new Error('no devtools url: ' + buf)), 15000); edge.stderr.on('data', d => { buf += d; const m = /DevTools listening on (ws:\/\/[^\s]+)/.exec(buf); if (m) { clearTimeout(t); res(m[1]); } }); });
const port = new URL(wsUrl).port;
const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map(); let events = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result); } else if (m.method) events.push(m); };
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
const sleep = ms => new Promise(r => setTimeout(r, ms));
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: !!args.mobile });
if (args.mobile) await send('Emulation.setUserAgentOverride', { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1', platform: 'iPhone' });

// 페이지 안에서 돌릴 수집기: 보이는 텍스트 노드 + 속성(placeholder·aria-label·title·alt·value) + document.title + meta description/og:title
const COLLECT = `((skipSel, includeHidden) => {
  const out = [];
  const path = (el) => { const parts = []; let e = el, n = 0; while (e && e.nodeType === 1 && n < 4) { let s = e.tagName.toLowerCase(); if (e.id) s += '#' + e.id; else if (e.classList.length) s += '.' + [...e.classList].slice(0, 2).join('.'); parts.unshift(s); e = e.parentElement; n++; } return parts.join('>'); };
  const visible = (el) => { if (includeHidden) return true; if (!el || el.nodeType !== 1) return false; const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') return false; return el.getClientRects().length > 0; };
  const skipped = (el) => { try { return !!(el && el.closest && el.closest(skipSel)); } catch (e) { return false; } };
  const walker = document.createTreeWalker(document.body || document.documentElement, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const t = node.nodeValue.replace(/\\s+/g, ' ').trim(); if (!t) continue;
    const p = node.parentElement; if (!p || /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(p.tagName)) continue;
    if (skipped(p) || !visible(p)) continue;
    out.push({ kind: 'text', where: path(p), text: t.slice(0, 160) });
  }
  for (const el of document.querySelectorAll('[placeholder],[aria-label],[title],img[alt],input[type=button],input[type=submit]')) {
    if (skipped(el) || !visible(el)) continue;
    for (const a of ['placeholder', 'aria-label', 'title', 'alt', 'value']) { const v = el.getAttribute(a); if (v && v.trim() && (a !== 'value' || /^(button|submit)$/i.test(el.type))) out.push({ kind: 'attr:' + a, where: path(el), text: v.trim().slice(0, 160) }); }
  }
  out.push({ kind: 'title', where: 'document.title', text: document.title });
  for (const m of document.querySelectorAll('meta[name="description"],meta[property="og:title"],meta[property="og:description"]')) out.push({ kind: 'meta', where: m.getAttribute('name') || m.getAttribute('property'), text: (m.getAttribute('content') || '').slice(0, 160) });
  return { lang: document.documentElement.lang, items: out };
})(${JSON.stringify(skipSel)}, ${!!args.hidden})`;

const results = {}; let total = 0;
// 예열: 같은 URL 을 한 번 열어 CDN 스크립트(React·Babel 등)를 캐시에 올린다 — 첫 언어만 늦게 그려져 거짓 불일치가 나는 것을 막는다
await send('Page.navigate', { url: args.url }); await sleep(Math.min(wait + 2000, 20000));
for (const lang of langs) {
  events = [];
  let url = args.url;
  const pre = ['try{localStorage.clear();}catch(e){}'];
  for (const s of multi.set) {
    const [mode, ...rest] = s.split(':'); const key = rest.join(':');
    if (mode === 'qs') url += (url.includes('?') ? '&' : '?') + encodeURIComponent(key) + '=' + encodeURIComponent(lang);
    else if (mode === 'ls') pre.push(`try{localStorage.setItem(${JSON.stringify(key)},${JSON.stringify(lang)});}catch(e){}`);
    else if (mode === 'lsjson') pre.push(`try{localStorage.setItem(${JSON.stringify(key)},${JSON.stringify(JSON.stringify(lang))});}catch(e){}`);
    else { console.error('unknown --set ' + s); process.exit(2); }
  }
  const { identifier } = await send('Page.addScriptToEvaluateOnNewDocument', { source: pre.join('') });
  await send('Page.navigate', { url });
  await sleep(wait);
  if (args.pre) { try { await send('Runtime.evaluate', { expression: String(args.pre), awaitPromise: true }); await sleep(800); } catch (e) { console.error('pre failed (' + lang + '): ' + e.message); } }
  const r = (await send('Runtime.evaluate', { expression: COLLECT, returnByValue: true })).result.value;
  await send('Page.removeScriptToEvaluateOnNewDocument', { identifier });
  const allowed = new Set(EXPECT[lang] || []);
  const bad = [];
  for (const it of r.items) {
    if (allowRe.test(it.text)) continue;
    // 한국어 문장의 한자 괄호 병기(예: 신장(伸張))는 한국어 표기 관습 — ko 에서만 괄호 속 한자를 빼고 본다
    const probe = lang === 'ko' ? it.text.replace(/[(（][㐀-䶿一-鿿\s]+[)）]/g, '') : it.text;
    const found = Object.keys(SCRIPTS).filter(s => SCRIPTS[s].test(probe));
    const wrong = found.filter(s => !allowed.has(s));
    if (wrong.length) bad.push({ ...it, scripts: wrong });
  }
  const exc = events.filter(e => e.method === 'Runtime.exceptionThrown').map(e => (e.params.exceptionDetails.exception && e.params.exceptionDetails.exception.description || e.params.exceptionDetails.text || '').split('\n')[0]);
  results[lang] = { htmlLang: r.lang, scanned: r.items.length, mismatches: bad, jsExceptions: exc };
  total += bad.length;
  console.log(`[${lang}] html lang=${r.lang} · scanned ${r.items.length} · mismatches ${bad.length}${exc.length ? ' · JS exceptions ' + exc.length : ''}`);
  for (const b of bad) console.log(`   ${b.kind.padEnd(14)} ${b.scripts.join('+').padEnd(10)} ${b.where}  «${b.text}»`);
}
if (args.json) writeFileSync(String(args.json), JSON.stringify({ url: args.url, set: multi.set, results }, null, 2));
console.log(total ? `TOTAL ${total} mismatch(es)` : 'CLEAN — no script mismatches');
ws.close(); edge.kill();
process.exit(total ? 1 : 0);
