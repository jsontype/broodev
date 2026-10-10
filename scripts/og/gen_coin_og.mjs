#!/usr/bin/env node
// 코인 앱 OG 공유 썸네일(1200×630 PNG) — apps/<코인>/og-image.html(gen_coin.py 가 btc 템플릿을 코인명·티커로 바꾼 것)을 언어별로 찍는다
//   node scripts/og/gen_coin_og.mjs            # 코인 14종 전부(scripts/coins.json)
//   node scripts/og/gen_coin_og.mjs eth pepe   # 일부
// 결과: apps/<코인>/og-image.png(ko — index.html 의 og:image) · og-en.png · og-ja.png(?lang 판 — functions/_lib/seo-meta.js 의 COIN_META img)
// 순서: python scripts/gen_coin.py all → 이 스크립트. gen_coin.py 는 재생성할 때 btc 것과 다른 코인 썸네일을 보존한다.
// 방식: Edge/Chrome 헤드리스 + DevTools 프로토콜(scripts/cdp-shot.mjs 와 같은 방식) — 진짜 시간으로 웹폰트 로드와 제목 맞춤(body[data-fit])을 기다린 뒤 캡처.
// 외부 의존성 없음(Node 22+ 전역 WebSocket). 폰트는 Google Fonts(JetBrains Mono) — 네트워크 필요.
import { spawn } from 'node:child_process'
import { writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { tmpdir } from 'node:os'

const R = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const COINS = JSON.parse(readFileSync(join(R, 'scripts/coins.json'), 'utf8')).coins
const SHOTS = [['ko', 'og-image.png'], ['en', 'og-en.png'], ['ja', 'og-ja.png']]
const BROWSERS = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
]
const BROWSER = BROWSERS.find((p) => existsSync(p))
if (!BROWSER) { console.error('Edge/Chrome 을 찾지 못함'); process.exit(2) }

const args = process.argv.slice(2).map((a) => a.toLowerCase())
const picks = args.length ? args.map((a) => COINS.find((c) => c.sub === a) || (console.error('모르는 코인: ' + a), process.exit(2))) : COINS
for (const c of picks) {
  const html = join(R, 'apps', c.sub, 'og-image.html')
  if (!existsSync(html)) { console.error(`apps/${c.sub}/og-image.html 없음 — 먼저 python scripts/gen_coin.py ${c.sub}`); process.exit(2) }
  if (readFileSync(html, 'utf8').includes('₿')) { console.error(`apps/${c.sub}/og-image.html 에 ₿ — gen_coin.py v4 로 재생성할 것`); process.exit(2) }
}

const profile = join(tmpdir(), `broodev-coin-og-${process.pid}`)
const edge = spawn(BROWSER, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--mute-audio', '--allow-file-access-from-files', 'about:blank'], { stdio: ['ignore', 'pipe', 'pipe'] })
const wsUrl = await new Promise((res, rej) => {
  let buf = ''
  const t = setTimeout(() => rej(new Error('no devtools url: ' + buf)), 20000)
  edge.stderr.on('data', (d) => { buf += d; const m = /DevTools listening on (ws:\/\/[^\s]+)/.exec(buf); if (m) { clearTimeout(t); res(m[1]) } })
})
const port = new URL(wsUrl).port
const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json()
const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((r) => (ws.onopen = r))
let id = 0
const pending = new Map()
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result) } }
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })) })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const evalJs = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })).result.value

await send('Page.enable')
await send('Runtime.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false })

let bad = 0
for (const c of picks) {
  const file = pathToFileURL(join(R, 'apps', c.sub, 'og-image.html')).href
  for (const [lang, out] of SHOTS) {
    // 웹폰트 로드 + 제목 맞춤(og-image.html 이 body[data-fit] 을 붙임)까지 — 시도마다 최대 15초, 3번(첫 실행은 폰트 받느라 늦을 때가 있다)
    let fit = null
    for (let attempt = 0; attempt < 3 && !fit; attempt++) {
      await send('Page.navigate', { url: `${file}?lang=${lang}` })
      for (let i = 0; i < 150 && !fit; i++) { await sleep(100); fit = await evalJs("document.readyState === 'complete' && document.body && document.body.getAttribute('data-fit')").catch(() => null) }
    }
    await sleep(300)
    const info = await evalJs(`(() => { const t = document.getElementById('title'); return { title: t.textContent, h: t.scrollHeight, font: document.fonts && [...document.fonts].some(f => f.family.includes('JetBrains') && f.status === 'loaded'), ring: document.querySelector('svg text').textContent } })()`)
    const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 } })
    writeFileSync(join(R, 'apps', c.sub, out), Buffer.from(shot.data, 'base64'))
    const warn = !fit ? ' ⚠ data-fit 없음(제목 맞춤 미완)' : !info.font ? ' ⚠ 웹폰트 미로드' : ''
    if (warn) bad++
    console.log(`  apps/${c.sub}/${out}  [${lang}] fit=${fit} h=${info.h} ring=${info.ring} «${info.title}»${warn}`)
  }
}
ws.close()
edge.kill()
await sleep(500)
try { rmSync(profile, { recursive: true, force: true }) } catch {}
console.log(bad ? `경고 ${bad}건` : `done — ${picks.length}개 코인 × ${SHOTS.length}장`)
process.exit(bad ? 1 : 0)
