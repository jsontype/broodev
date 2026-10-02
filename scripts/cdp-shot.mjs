#!/usr/bin/env node
// 실제 시간 기준 렌더 검증 하니스 — Edge/Chrome 헤드리스 + DevTools 프로토콜(CDP)
//   node scripts/cdp-shot.mjs --url http://127.0.0.1:8766/apps/home/home3/index.html --out shot.png
//        [--mobile] [--net slow|3g] [--wait 8000] [--w 1440 --h 900] [--ls home:lang=ja] [--eval "expr"]
// 왜 이게 필요한가: `msedge --headless --screenshot --virtual-time-budget` 은 가상 시간이라 window.load·rAF·CDN React/Babel 이
//   끝나기 전에 찍히는 경우가 많다(docs/new-app.md §8). 이 하니스는 진짜 시간으로 기다리며 콘솔 에러·JS 예외·video 상태·
//   요소 가시성(opacity/visibility)·load 시각까지 JSON 으로 뽑고, 모바일(iPhone UA·터치·390×844)과 느린 회선을 에뮬레이션한다.
// 출력: stdout 에 JSON 진단 + --out PNG. 외부 의존성 없음(Node 22+ 전역 WebSocket). 로컬 서버 예: python -m http.server 8766 --directory .
import { spawn } from 'node:child_process';
import { writeFileSync, existsSync } from 'node:fs';

const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, arr) => { if (x.startsWith('--')) a.push([x.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]); return a; }, []));
const BROWSERS = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium',
];
const BROWSER = BROWSERS.find(p => existsSync(p));
if (!args.url || !BROWSER) { console.error('usage: --url <http url> [--out shot.png] [--mobile] [--net slow|3g] [--wait ms] [--ls key=value]... [--eval expr]' + (BROWSER ? '' : '\n(Edge/Chrome 을 찾지 못함)')); process.exit(2); }
const url = args.url, out = args.out || 'shot.png', mobile = !!args.mobile;
const wait = +(args.wait || 8000);
const W = +(args.w || (mobile ? 390 : 1440)), H = +(args.h || (mobile ? 844 : 900));
const profile = `${process.env.TEMP || process.env.TMPDIR || '/tmp'}/broodev-cdp-${process.pid}`;
// --ls 는 여러 번: localStorage 를 네비게이션 전에 심는다 (예: --ls home:lang=ja --ls mh:lang=ja --ls 'btc:lang="ja"')
const lsPairs = process.argv.slice(2).reduce((a, x, i, arr) => (x === '--ls' && arr[i + 1] ? a.concat([arr[i + 1]]) : a), []);

const edge = spawn(BROWSER, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--mute-audio', 'about:blank'], { stdio: ['ignore', 'pipe', 'pipe'] });
const wsUrl = await new Promise((res, rej) => {
  let buf = ''; const t = setTimeout(() => rej(new Error('no devtools url: ' + buf)), 15000);
  edge.stderr.on('data', d => { buf += d; const m = /DevTools listening on (ws:\/\/[^\s]+)/.exec(buf); if (m) { clearTimeout(t); res(m[1]); } });
});
const port = new URL(wsUrl).port;
const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map(); const events = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result); } else if (m.method) events.push(m); };
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
const sleep = ms => new Promise(r => setTimeout(r, ms));

await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable'); await send('Network.enable');
if (mobile) {
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 2, mobile: true });
  await send('Emulation.setUserAgentOverride', { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1', platform: 'iPhone' });
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
} else {
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
}
if (args.net) {
  const slow = args.net === '3g' ? { latency: 300, downloadThroughput: 400 * 1024 / 8, uploadThroughput: 200 * 1024 / 8 } : { latency: 150, downloadThroughput: 1.5 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 };
  await send('Network.emulateNetworkConditions', { offline: false, ...slow });
}
if (lsPairs.length) await send('Page.addScriptToEvaluateOnNewDocument', { source: 'try{' + lsPairs.map(p => { const i = p.indexOf('='); return `localStorage.setItem(${JSON.stringify(p.slice(0, i))},${JSON.stringify(p.slice(i + 1))});`; }).join('') + '}catch(e){}' });

const t0 = Date.now();
let loadAt = null;
await send('Page.navigate', { url });
const deadline = Date.now() + wait;
while (Date.now() < deadline) {
  if (loadAt == null && events.some(e => e.method === 'Page.loadEventFired')) loadAt = Date.now() - t0;
  await sleep(100);
}

const evalJs = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })).result.value;
const diag = await evalJs(`(() => {
  const vis = el => { const cs = getComputedStyle(el); return cs.opacity !== '0' && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const fades = [...document.querySelectorAll('.effectFade')];
  const h1 = document.querySelector('h1');
  return {
    readyState: document.readyState, lang: document.documentElement.lang, title: document.title,
    preloaderInDom: !!document.querySelector('.preloader'),
    loadEventEnd: performance.timing.loadEventEnd ? performance.timing.loadEventEnd - performance.timing.navigationStart : 0,
    rootText: ((document.getElementById('root') || document.body).innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 160),
    h1: h1 ? h1.textContent.trim().slice(0, 80) : null,
    effectFade: fades.length ? { total: fades.length, hidden: fades.filter(el => !vis(el)).length, inViewportHidden: fades.filter(el => { const r = el.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0 && !vis(el); }).length } : null,
    videos: [...document.querySelectorAll('video')].map(v => ({ src: (v.currentSrc || '').split('/').pop(), readyState: v.readyState, networkState: v.networkState, error: v.error ? v.error.code : null, paused: v.paused })),
    bodyScrollHeight: document.body.scrollHeight, innerWidth: innerWidth, innerHeight: innerHeight,
    extra: null
  };
})()`);
if (args.eval) { try { diag.extra = await evalJs(String(args.eval)); } catch (e) { diag.extra = 'eval error: ' + e.message; } }

const errors = events.filter(e => e.method === 'Runtime.exceptionThrown').map(e => (e.params.exceptionDetails.exception && e.params.exceptionDetails.exception.description || e.params.exceptionDetails.text || '').split('\n')[0]);
const consoleErr = events.filter(e => e.method === 'Runtime.consoleAPICalled' && (e.params.type === 'error' || e.params.type === 'warning')).map(e => e.params.type + ': ' + e.params.args.map(a => a.value || a.description || '').join(' ').slice(0, 200));
const logErr = events.filter(e => e.method === 'Log.entryAdded' && e.params.entry.level !== 'info' && e.params.entry.level !== 'verbose').map(e => e.params.entry.level + ': ' + e.params.entry.text.slice(0, 200));
const failed = events.filter(e => e.method === 'Network.loadingFailed').map(e => e.params.errorText + ' ' + (e.params.type || ''));
const reqs = events.filter(e => e.method === 'Network.requestWillBeSent').length;

const shot = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync(out, Buffer.from(shot.data, 'base64'));
console.log(JSON.stringify({ url, mobile, net: args.net || 'none', waitMs: wait, loadEventAfterMs: loadAt, requests: reqs, ...diag, jsExceptions: errors, consoleErrors: consoleErr, logErrors: logErr, loadingFailed: failed, out }, null, 2));
ws.close(); edge.kill();
process.exit(0);
