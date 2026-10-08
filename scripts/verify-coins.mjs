// 코인 앱(apps/<sub>) 전수 검증 — gen_coin.py v2 산출물 무결성
// node scripts/verify-coins.mjs
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const R = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const COINS = JSON.parse(readFileSync(`${R}/scripts/coins.json`, 'utf8')).coins
const BTC_ONLY = ['member', 'adsense', 'about.html', 'bitcoin-bottom.html', 'drawdown-dca.html',
  'fear-greed-index.html', 'glossary.html', 'golden-cross.html', 'guide-fear-greed.html',
  'indicators.html', 'macd-guide.html', 'mayer-multiple.html', 'methodology.html', 'rsi-guide.html']

let fail = 0
const ok = (n, c, x = '') => { if (!c) { fail++; console.log('  ❌ ' + n + (x ? ' — ' + x : '')) } }

for (const c of COINS) {
  const sub = c.sub, base = `https://${sub}.broodev.com`
  const dir = `${R}/apps/${sub}`
  const idx = readFileSync(`${dir}/index.html`, 'utf8')
  const mw = readFileSync(`${dir}/functions/_middleware.js`, 'utf8')
  const label = sub.toUpperCase()

  ok(label + ' canonical', idx.includes(`<link rel="canonical" href="${base}/" />`))
  ok(label + ' og:url', idx.includes(`content="${base}/"`))
  ok(label + ' 타이틀 코인명', [...idx.matchAll(/<title>([^<]*)/g)].some((m) => m[1].includes(c.names.ko)))
  ok(label + ' 이중치환(캐시캐시 등) 없음', !idx.includes('캐시캐시') && !idx.includes(c.names.ko + c.names.ko))
  ok(label + ' 브랜드', idx.includes(`${c.ticker}_SIGNAL`))
  ok(label + ' 레지스트리 보호(btc 슬롯·비트코인 라벨)', idx.includes("slug: 'btc'") && idx.includes("ko: '비트코인'"))
  ok(label + ' COIN_NAMES 보호', idx.includes("var COIN_NAMES = {") && idx.includes("['이더리움', 'ETH']"))
  ok(label + ' 푸터: 자기 코인 스팬', idx.includes(`<span class="cur" data-coin="${sub}"`))
  ok(label + ' 푸터: btc 링크', idx.includes('<a data-coin="btc" href="https://btc.broodev.com/">비트코인</a>'))
  ok(label + ' 자기참조 잔존(btc 도메인) 없음', !idx.includes('https://btc.broodev.com/og-image') && !idx.includes(`canonical" href="https://btc.broodev.com/`) && !idx.includes(`canonical" href="https://broodev.com/`))
  ok(label + ' 비트코인 앱 링크 보호(코인 선택 JS)', idx.includes("btcLink.href = 'https://btc.broodev.com/'") && idx.includes("v === 'btc' ? 'https://btc.broodev.com/'"))
  ok(label + ' 호스트 인식 헬퍼', idx.includes('window.__SUBCOIN'))

  ok(label + ' _redirects 404 폴백(301 스텁 제거)', readFileSync(`${dir}/_redirects`, 'utf8').trim() === '/*  /404.html  404')
  const sm = readFileSync(`${dir}/sitemap.xml`, 'utf8')
  ok(label + ' sitemap 자기 도메인', sm.includes(`${base}/`) && !sm.includes('https://broodev.com/'))
  ok(label + ' robots 자기 도메인', readFileSync(`${dir}/robots.txt`, 'utf8').includes(base))
  ok(label + ' 미들웨어 IMG·COIN_HOSTS', mw.includes(`const IMG = '${base}'`) && mw.includes('const COIN_HOSTS') && mw.includes("bch: ['비트코인캐시', 'BCH']"))
  for (const junk of BTC_ONLY) ok(label + ' 제외파일 ' + junk, !existsSync(`${dir}/${junk}`))
  for (const need of ['index.html', 'privacy.html', 'terms.html', 'ads.txt', 'robots.txt', 'sitemap.xml', 'content.css', 'functions/_middleware.js'])
    ok(label + ' 필수파일 ' + need, existsSync(`${dir}/${need}`))
  // 콘텐츠 페이지 13개 언어(2026-10-09): privacy·terms·404 의 12개 언어 조각 + content-i18n.js 가 있고, 비트코인 전용 조각은 없고, 자기참조·브랜드가 코인으로 바뀌었는지
  ok(label + ' content-i18n.js', existsSync(`${dir}/content-i18n.js`))
  const LANGS12 = ['en', 'ja', 'zh', 'zh-Hant', 'th', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'nl']
  for (const doc of ['privacy', 'terms', '404']) {
    ok(label + ' ' + doc + '.html → content-i18n.js', readFileSync(`${dir}/${doc}.html`, 'utf8').includes('src="/content-i18n.js'))
    for (const l of LANGS12) {
      const f = `${dir}/i18n/${doc}.${l}.html`
      if (!existsSync(f)) { ok(label + ' 조각 ' + doc + '.' + l, false, '없음'); continue }
      const t = readFileSync(f, 'utf8')
      ok(label + ' 조각 ' + doc + '.' + l + ' 자기참조', !t.includes('btc.broodev.com') && !t.includes('BTC_SIGNAL'), 'btc 흔적')
    }
  }
  const frags = existsSync(`${dir}/i18n`) ? readdirSync(`${dir}/i18n`) : []
  ok(label + ' 비트코인 전용 조각 없음', !frags.some((f) => BTC_ONLY.includes(f.split('.')[0] + '.html')), frags.filter((f) => BTC_ONLY.includes(f.split('.')[0] + '.html')).slice(0, 3).join(' '))
}
const total = COINS.length
console.log(fail === 0 ? `전부 통과 (${total}개 코인 앱 × ~30검사)` : `실패 ${fail}건`)
process.exit(fail ? 1 : 0)
