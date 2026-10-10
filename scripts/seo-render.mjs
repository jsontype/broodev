#!/usr/bin/env node
// 검색엔진처럼 렌더해 보기 — Edge/Chrome 헤드리스 + CDP. 구글봇은 미국 영어 환경·저장값 없음·스마트폰 UA 로 렌더한다.
//   node scripts/seo-render.mjs --url https://btc.broodev.com/ [--as googlebot|user] [--lang en-US] [--wait 8000] [--ls key=value]... [--click-lsg] [--close-lsg]
//                                [--mobile] [--shot out.png] [--json]
//     --as googlebot (기본) : Googlebot 스마트폰 UA · navigator/Accept-Language = --lang(기본 en-US) · 412×732
//     --as user              : 일반 데스크톱 Edge UA · navigator = --lang(예: ja-JP) — 언어 제안 바(lang-suggest.js) 확인용
//     --mobile               : (--as user 와 함께) iPhone UA · 390×844 · 터치 — 제안 바 모바일 넘침 확인용
//     --shot out.png         : 첫 렌더(대기 후) 뷰포트를 PNG 로 저장
//     --click-lsg            : 제안 바 [보기]를 눌러 이동한 뒤의 주소·<html lang>·제목·저장값도 출력(after)
//     --close-lsg            : 제안 바 [×]를 누르고 새로고침한 뒤 바가 다시 뜨는지 출력(afterClose) — --click-lsg 와 같이 쓰면 --click-lsg 만 한다
//     --ls key=value         : 매 문서 시작 전에 localStorage 에 심는다(여러 번 가능 · 새로고침/이동 후에도 다시 심음)
// 출력(JSON): url · htmlLang · title · canonical · ogUrl · desc · h1[] · hreflang[] · lsg{shown,lang,text,href,rect,fg,bg} · lsgKey{key,value}(lang-suggest data-key 저장값)
//            · overflowX(문서 가로 넘침 px) · script{hangul,kana,han,cyrillic,thai,latin}(본문 글자 비율 %) · sample
//            · consoleErrors[] · (click 시) after{url,htmlLang,title,canonical,lsgShown,lsgKey} · (close 시) afterClose{removed,lsgShown,off,url}
// 외부 의존성 없음(Node 22+ 전역 WebSocket). scripts/seo-check.mjs --render 가 이 스크립트를 호출한다.
import { spawn } from 'node:child_process';
import { existsSync, rmSync, writeFileSync } from 'node:fs';

const argv = process.argv.slice(2);
const args = {}; const ls = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]; if (!a.startsWith('--')) continue;
  const k = a.slice(2), v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
  if (k === 'ls') ls.push(String(v)); else args[k] = v;
}
const BROWSERS = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'];
const BROWSER = BROWSERS.find((p) => existsSync(p));
if (!args.url || !BROWSER) { console.error('usage: --url <url> [--as googlebot|user] [--lang en-US] [--wait ms] [--ls k=v] [--click-lsg|--close-lsg] [--mobile] [--shot out.png] [--json]'); process.exit(2); }
const as = args.as === 'user' ? 'user' : 'googlebot';
const lang = String(args.lang || 'en-US');
const wait = +(args.wait || 8000);
const phone = as === 'user' && !!args.mobile;
const UA = as === 'googlebot'
  ? 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
  : phone ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'
  : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0';
const W = as === 'googlebot' ? 412 : phone ? 390 : 1366, H = as === 'googlebot' ? 732 : phone ? 844 : 860;
const isMobile = as === 'googlebot' || phone;
const profile = `${process.env.TEMP || process.env.TMPDIR || '/tmp'}/broodev-seo-${process.pid}`;

const edge = spawn(BROWSER, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0',
  `--user-data-dir=${profile}`, '--mute-audio', `--lang=${lang}`, `--accept-lang=${lang}`, 'about:blank'], { stdio: ['ignore', 'pipe', 'pipe'] });
const wsUrl = await new Promise((res, rej) => {
  let buf = ''; const t = setTimeout(() => rej(new Error('no devtools url: ' + buf)), 15000);
  edge.stderr.on('data', (d) => { buf += d; const m = /DevTools listening on (ws:\/\/[^\s]+)/.exec(buf); if (m) { clearTimeout(t); res(m[1]); } });
});
const port = new URL(wsUrl).port;
const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map(); const errors = [];
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result); return; }
  if (m.method === 'Runtime.exceptionThrown') errors.push('exception: ' + ((m.params.exceptionDetails.exception || {}).description || m.params.exceptionDetails.text || '').slice(0, 300));
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push('console: ' + m.params.args.map((a) => a.value || a.description || '').join(' ').slice(0, 300));
};
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: as === 'googlebot' ? 2.625 : phone ? 3 : 1, mobile: isMobile });
if (phone) await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Emulation.setUserAgentOverride', { userAgent: UA, acceptLanguage: lang, platform: as === 'googlebot' ? 'Android' : phone ? 'iPhone' : 'Win32' });
if (ls.length) await send('Page.addScriptToEvaluateOnNewDocument', { source: 'try{' + ls.map((p) => { const i = p.indexOf('='); return `localStorage.setItem(${JSON.stringify(p.slice(0, i))},${JSON.stringify(p.slice(i + 1))});`; }).join('') + '}catch(e){}' });

const PROBE = `(() => {
  const q = (s) => document.querySelector(s);
  const txt = (document.body ? document.body.innerText : '') || '';
  const count = (re) => (txt.match(re) || []).length;
  const letters = count(/[\\p{L}]/gu) || 1;
  const pct = (n) => Math.round(n * 1000 / letters) / 10;
  const bar = q('.lsg');
  const ks = q('script[src*="lang-suggest.js"]');
  const key = ks && ks.dataset ? ks.dataset.key || null : null;
  let kv = null; try { kv = key ? localStorage.getItem(key) : null; } catch (e) { kv = null; }
  const rr = bar ? bar.getBoundingClientRect() : null;
  const cs = bar ? getComputedStyle(bar) : null;
  return JSON.stringify({
    url: location.href,
    htmlLang: document.documentElement.getAttribute('lang'),
    title: document.title,
    canonical: (q('link[rel="canonical"]') || {}).href || null,
    ogUrl: (q('meta[property="og:url"]') || {}).content || null,
    desc: (q('meta[name="description"]') || {}).content || null,
    h1: [...document.querySelectorAll('h1')].map((e) => (e.innerText || e.textContent || '').trim().slice(0, 120)),
    hreflang: [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map((e) => e.getAttribute('hreflang') + ' ' + e.getAttribute('href')),
    lsg: bar ? { shown: true, lang: bar.getAttribute('lang'), text: bar.innerText.replace(/\\s+/g, ' ').trim(), href: (bar.querySelector('a') || {}).href || null,
      rect: { x: Math.round(rr.left), y: Math.round(rr.top), w: Math.round(rr.width), h: Math.round(rr.height), right: Math.round(innerWidth - rr.right) },
      fg: cs.color, bg: cs.backgroundColor } : { shown: false },
    lsgKey: { key, value: kv },
    overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
    script: { hangul: pct(count(/[\\uAC00-\\uD7AF\\u1100-\\u11FF\\u3130-\\u318F]/g)), kana: pct(count(/[\\u3040-\\u30FF]/g)), han: pct(count(/[\\u4E00-\\u9FFF]/g)),
      cyrillic: pct(count(/[\\u0400-\\u04FF]/g)), thai: pct(count(/[\\u0E00-\\u0E7F]/g)), latin: pct(count(/[A-Za-z\\u00C0-\\u024F]/g)) },
    sample: txt.replace(/\\s+/g, ' ').trim().slice(0, 200),
  });
})()`;
const evalJSON = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); return JSON.parse(r.result.value); };
const evalVal = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value;

await send('Page.navigate', { url: String(args.url) });
await sleep(wait);
const out = await evalJSON(PROBE);
if (args.shot) {
  const r = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(String(args.shot), Buffer.from(r.data, 'base64'));
  out.shot = String(args.shot);
}
if (args['click-lsg'] && out.lsg.shown) {
  await send('Runtime.evaluate', { expression: 'document.querySelector(".lsg a").click()' });
  await sleep(wait);
  const after = await evalJSON(PROBE);
  out.after = { url: after.url, htmlLang: after.htmlLang, title: after.title, canonical: after.canonical, lsgShown: after.lsg.shown, lsgKey: after.lsgKey };
} else if (args['close-lsg'] && out.lsg.shown) {
  await send('Runtime.evaluate', { expression: 'document.querySelector(".lsg .lsg-x").click()' });
  await sleep(300);
  const removed = await evalVal('!document.querySelector(".lsg")');
  await send('Page.reload', {});
  await sleep(wait);
  const again = await evalJSON(PROBE);
  const off = await evalVal('(() => { try { return localStorage.getItem("lang-suggest:off"); } catch (e) { return null; } })()');
  out.afterClose = { removed, lsgShown: again.lsg.shown, off, url: again.url };
}
out.as = as; out.navLang = lang; out.consoleErrors = errors.slice(0, 20);
console.log(JSON.stringify(out, null, args.json ? 0 : 1));
try { await send('Browser.close'); } catch (e) { /* 이미 닫힘 */ }
try { edge.kill(); } catch (e) { /* */ }
await sleep(300);
try { rmSync(profile, { recursive: true, force: true }); } catch (e) { /* 잠금 */ }
process.exit(0);
