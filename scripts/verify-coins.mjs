// 코인 앱(apps/<sub>) 전수 검증 — gen_coin.py v4 산출물 무결성 (+ btc 원본의 SEO 정책 L1~L5 일부)
// node scripts/verify-coins.mjs
// v4(2026-10-10): 코인 고유 본문(scripts/coin-content/<sub>.json) — 정적 section.seo · seo-i18n(13개 언어 · 렌더 순서) · FAQPage = 화면 FAQ ·
//   <title>/description/DOC_TITLE/DOC_DESC/COIN_META = 본문 meta · OG 썸네일 3장(1200×630 · btc 와 다름 · ₿ 없음) · sitemap lastmod
// v5(2026-10-10): 앱 JSX 는 app.jsx(원문) → app.js(사전 컴파일). 코드 검사는 index.html + app.jsx 를 합친 텍스트(idx)로,
//   app.js = app.jsx 최신 빌드(머리 주석 src-sha256) · index.html ?v= = app.js 해시 · 브라우저 Babel 없음 · React → ReactDOM → app.js defer 순서
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import vm from 'node:vm'
import { checkApp } from './build-jsx.mjs'

const R = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const COINS = JSON.parse(readFileSync(`${R}/scripts/coins.json`, 'utf8')).coins
const BTC_ONLY = ['member', 'adsense', 'about.html', 'bitcoin-bottom.html', 'drawdown-dca.html',
  'fear-greed-index.html', 'glossary.html', 'golden-cross.html', 'guide-fear-greed.html',
  'indicators.html', 'macd-guide.html', 'mayer-multiple.html', 'methodology.html', 'rsi-guide.html']
const BTC_ONLY_PATHS = BTC_ONLY.filter((f) => f.endsWith('.html')).map((f) => f.slice(0, -5))
const LANGS = ['en', 'ja', 'ko', 'zh', 'zh-Hant', 'th', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'nl']
const LANGS12 = LANGS.filter((l) => l !== 'ko')
const HL = (l) => (l === 'zh' ? 'zh-Hans' : l)
// 상대 링크로 비트코인 전용 글을 가리키는 곳(정적 HTML · JSON-LD · JS 문자열)
const REL_BTC = new RegExp(`["']/(${BTC_ONLY_PATHS.join('|')})(?=["'#?])`, 'g')
// 지표 수 「8」(코인은 7개) — 보호구역(비트코인 전용 글 목록 · DEEP)을 뺀 문구에서 찾는다
const EIGHT = /(?<![\d/.,:])8(?:\/8|(?=개 (?:실시간 )?(?:지표|부분점수)|つの|指標|\s?(?:个|個|项|項|指标)| ตัว|\s(?:[\p{L}\p{N}-]+\s){0,2}[\p{L}\p{N}-]*(?:[Ii]ndica[td]|Indikat|индикатор)| (?:sub|sous|Teil|sotto|deel|частичн)))|(?<=지표 )8(?=종)|(?<=指標)8(?=種)|(?<=(?:จาก|ทั้ง) )8(?= )/u
const BTC_NAMES = /Bitcoin|비트코인|ビットコイン|比特币|比特幣|บิตคอยน์|биткоин/

const OG_FILES = ['og-image.png', 'og-en.png', 'og-ja.png']
const LASTMOD = '2026-10-10' // = scripts/gen_coin.py LASTMOD
// gen_coin.py h() 와 같은 이스케이프(& < > ")
const h = (x) => String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const strip = (x) => x.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
// seo-i18n.js 를 가짜 DOM 에서 실행 → { SEO, render(lang) → section.seo innerHTML }
function loadSeo(file) {
  const sec = { innerHTML: '', attrs: {}, setAttribute(k, v) { this.attrs[k] = v } }
  const fd = { textContent: '' }
  const window = {}
  const document = { querySelector: (q) => (q === 'section.seo' ? sec : q === '.site-foot .foot-desc' ? fd : null) }
  vm.runInNewContext(readFileSync(file, 'utf8'), { window, document })
  return { SEO: window.SEO_I18N, render: (l) => { window.renderSEO(l); return { html: sec.innerHTML, attrs: { ...sec.attrs } } } }
}
function pngSize(file) {
  const b = readFileSync(file)
  if (b.length < 24 || b.readUInt32BE(0) !== 0x89504e47 || b.toString('ascii', 12, 16) !== 'IHDR') return null
  return [b.readUInt32BE(16), b.readUInt32BE(20)]
}
// 순서대로 나오는지(각 조각이 앞 조각 뒤에)
function inOrder(text, parts) {
  let at = 0
  for (const p of parts) { const i = text.indexOf(p, at); if (i < 0) return p; at = i + p.length }
  return ''
}
function jsDict(src, name) {
  const m = new RegExp('const ' + name + ' = \\{\\n([\\s\\S]*?)\\n\\s*\\}\\n').exec(src)
  if (!m) return null
  const out = {}
  for (const mm of m[1].matchAll(/^\s+'?([\w-]+)'?: '((?:[^'\\]|\\.)*)',?\s*$/gm)) out[mm[1]] = mm[2].replace(/\\(.)/g, '$1')
  return out
}
const { COIN_META } = await import(pathToFileURL(`${R}/apps/btc/functions/_lib/seo-meta.js`).href)

let fail = 0
const ok = (n, c, x = '') => { if (!c) { fail++; console.log('  ❌ ' + n + (x ? ' — ' + x : '')) } }
const read = (p) => readFileSync(p, 'utf8')
function walk(d, out = []) {
  for (const n of readdirSync(d)) {
    const p = join(d, n)
    if (n === '.wrangler' || n === 'node_modules') continue
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(html|js|mjs|xml|txt|json)$/.test(n) || n === '_redirects') out.push(p)
  }
  return out
}
// 사전 컴파일(app.jsx → app.js) — 최신 빌드 · ?v= · 브라우저 Babel 없음 · 실행 순서(React → ReactDOM → app.js, 모두 defer · 앞쪽 인라인 스크립트 뒤)
function jsxBuildOk(dir, html) {
  const bad = checkApp(dir)
  const order = ['react@18/umd/react.production.min.js" defer>', 'react-dom@18/umd/react-dom.production.min.js" defer>', '<script src="app.js?v=']
  const pos = order.map((x) => html.indexOf(x))
  if (pos.some((p) => p < 0) || !(pos[0] < pos[1] && pos[1] < pos[2])) bad.push('React → ReactDOM → app.js defer 순서 아님')
  if (html.indexOf('<script src="foot-i18n.js') > pos[2]) bad.push('app.js 가 foot-i18n.js 보다 앞')
  return bad
}
function hreflangOk(html, url) {
  const links = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)" \/>/g)].map((m) => [m[1], m[2]])
  const want = LANGS.map((l) => [HL(l), l === 'ko' ? url : url + '?lang=' + l]).concat([['x-default', url + '?lang=en']])
  return links.length === want.length && want.every(([h, u]) => links.some(([h2, u2]) => h2 === h && u2 === u))
}
function sitemapOk(xml, origin, paths) {
  const urls = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1])
  if (urls.length !== paths.length * LANGS.length) return 'url 개수 ' + urls.length
  for (const u of urls) {
    const loc = (/<loc>([^<]+)<\/loc>/.exec(u) || [])[1]
    if (!loc || !/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/.test(u)) return 'loc/lastmod 없음'
    const alts = [...u.matchAll(/<xhtml:link rel="alternate" hreflang="([^"]+)" href="([^"]+)" \/>/g)]
    if (alts.length !== 14) return loc + ' xhtml:link ' + alts.length
    const base = loc.replace(/&amp;/g, '&').split('?')[0]
    if (!base.startsWith(origin)) return loc + ' 다른 호스트'
    for (const l of LANGS) if (!alts.some((a) => a[1] === HL(l) && a[2] === (l === 'ko' ? base : base + '?lang=' + l))) return loc + ' hreflang ' + l
    if (!alts.some((a) => a[1] === 'x-default' && a[2] === base + '?lang=en')) return loc + ' x-default'
  }
  for (const p of paths) for (const l of LANGS) if (!xml.includes('<loc>' + origin + p + (l === 'ko' ? '' : '?lang=' + l) + '</loc>')) return 'loc 누락 ' + p + ' ' + l
  return ''
}

// ---------------------------------------------------------------- btc 원본 (packages/seo L1·L2·L4·L5)
{
  const B = `${R}/apps/btc`
  const html = read(`${B}/index.html`)
  const idx = html + '\n' + read(`${B}/app.jsx`)   // 코드 검사용(정적 HTML + 앱 JSX 원문)
  const jb = jsxBuildOk(B, html)
  ok('BTC app.js = app.jsx 최신 빌드(해시) · ?v= · 브라우저 Babel 없음 · defer 순서', !jb.length, jb.join(' · '))
  const pages = ['index', 'about', 'bitcoin-bottom', 'drawdown-dca', 'fear-greed-index', 'glossary', 'golden-cross', 'guide-fear-greed',
    'indicators', 'macd-guide', 'mayer-multiple', 'methodology', 'rsi-guide', 'privacy', 'terms']
  for (const f of ['index.html', 'app.jsx', 'foot-i18n.js', 'seo-i18n.js', 'content-i18n.js', '404.html'])
    ok('BTC L1 navigator 로 표시 언어 결정 안 함: ' + f, !/navigator\.languages?\b/.test(read(`${B}/${f}`)))
  ok('BTC L1 ?lang 자동 부착(replaceState) 없음', !/searchParams\.get\('lang'\) !== lang/.test(idx))
  ok('BTC lang-suggest.js 사본', existsSync(`${B}/lang-suggest.js`) && read(`${B}/lang-suggest.js`) === read(`${R}/packages/seo/lang-suggest.js`))
  ok('BTC seo-lang.js 사본', read(`${B}/functions/_lib/seo-lang.js`) === read(`${R}/packages/seo/seo-lang.js`))
  for (const p of pages) {
    const h = read(`${B}/${p}.html`)
    const url = 'https://btc.broodev.com/' + (p === 'index' ? '' : p)
    ok('BTC L2 제안 바 ' + p, h.includes('<script src="/lang-suggest.js" data-key="btc:lang" data-json="1" data-base="ko" defer></script>'))
    ok('BTC L4 hreflang ' + p, hreflangOk(h, url))
    ok('BTC canonical ' + p, h.includes(`<link rel="canonical" href="${url}" />`))
  }
  ok('BTC FAQPage data-ld="faq"', /<script type="application\/ld\+json" data-ld="faq">\s*\{\s*"@context": "https:\/\/schema.org",\s*"@type": "FAQPage"/.test(idx))
  ok('BTC twitter:description 지표 수 8', idx.includes('content="공포·탐욕 지수 포함 8개 지표'))
  ok('BTC 커버리지 분모 = IND_TOTAL(「/8」 하드코딩 없음)', !/\$\{[a-z]\}\/8\b/.test(idx) && idx.includes('const IND_TOTAL = INDICATOR_META.length'))
  ok('BTC MVRV 신선도(10일) 검사', idx.includes('const CHAIN_MAX_AGE = 10 * 86400 * 1000') && idx.includes('chainStale('))
  const sm = sitemapOk(read(`${B}/sitemap.xml`), 'https://btc.broodev.com', pages.map((p) => (p === 'index' ? '/' : '/' + p)))
  ok('BTC L5 sitemap', !sm, sm)
  ok('BTC robots Sitemap', read(`${B}/robots.txt`).includes('Sitemap: https://btc.broodev.com/sitemap.xml'))
  ok('BTC seo-meta.js 생성 파일', read(`${B}/functions/_lib/seo-meta.js`).startsWith('// 생성 파일'))
  // v4: 렌더러는 코인 키를 그릴 줄 알고, btc 자신의 SEO 데이터에는 코인 키가 없다(btc 화면 불변)
  const bs = loadSeo(`${B}/seo-i18n.js`)
  ok('BTC seo-i18n 렌더러: 코인 키(coinH·applyH·histH)', /d\.coinH/.test(read(`${B}/seo-i18n.js`)) && /d\.applyH/.test(read(`${B}/seo-i18n.js`)) && /d\.histH/.test(read(`${B}/seo-i18n.js`)))
  ok('BTC SEO 데이터에 코인 키 없음', LANGS.every((l) => bs.SEO[l] && !bs.SEO[l].coinH && !bs.SEO[l].applyH && !bs.SEO[l].histH) && !read(`${B}/seo-i18n.js`).includes('var COIN_SEO'))
  ok('BTC 렌더 13개 언어(h1 = title)', LANGS.every((l) => bs.render(l).html.startsWith('<h1>' + bs.SEO[l].title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</h1>')))
  ok('BTC ?coin= 이름 바꾸기: 코인 본문(section.seo[data-coin])이면 건너뜀', idx.includes("if (document.querySelector('section.seo[data-coin]')) return;"))
  ok('BTC section.seo 에 data-coin 없음', /<section class="seo" aria-label="/.test(idx))
}

// ---------------------------------------------------------------- 코인 14종
const btcMeta = read(`${R}/apps/btc/functions/_lib/seo-meta.js`)
for (const c of COINS) {
  const sub = c.sub, base = `https://${sub}.broodev.com`
  const dir = `${R}/apps/${sub}`
  const html = read(`${dir}/index.html`)
  const jsx = existsSync(`${dir}/app.jsx`) ? read(`${dir}/app.jsx`) : ''
  const idx = html + '\n' + jsx   // 코드 검사용(정적 HTML + 앱 JSX — gen_coin.py 가 btc app.jsx 에서 변환)
  const seo = read(`${dir}/seo-i18n.js`)
  const mw = read(`${dir}/functions/_middleware.js`)
  const label = sub.toUpperCase()
  const jb = jsxBuildOk(dir, html)
  ok(label + ' app.js = app.jsx 최신 빌드(해시) · ?v= · 브라우저 Babel 없음 · defer 순서', !jb.length, jb.join(' · '))
  ok(label + ' app.jsx = 생성 파일(gen_coin.py) · 코인 브랜드', jsx.startsWith('/* 생성 파일 — python scripts/gen_coin.py') && jsx.includes(`${c.ticker}_SIGNAL`) && !/BTC_SIGNAL/.test(jsx))
  // 코인 고유 본문(scripts/coin-content/<sub>.json)
  const cf = `${R}/scripts/coin-content/${sub}.json`
  let coinContent = null
  try { coinContent = JSON.parse(read(cf)) } catch (e) { ok(label + ' 코인 본문 JSON', false, existsSync(cf) ? e.message : '없음'); continue }
  const K = coinContent.langs || {}
  ok(label + ' 코인 본문 13개 언어', LANGS.every((l) => K[l] && K[l].meta && K[l].title && K[l].coinH && K[l].applyH && K[l].histH && (K[l].faq || []).length))
  const ko = K.ko
  // 코인 본문 문자열(이스케이프된 HTML) — 지표 수·Thermocap 검사에서 뺀다(「Thermocap 은 비트코인 화면에만」 같은 사실 문장)
  const koStrings = [ko.title, ko.intro, ko.coinH, ...ko.coinP, ko.applyH, ...ko.apply, ko.histH, ...ko.hist, ...ko.faq.flatMap((x) => [x.q, x.a])]
  const dropContent = (t) => koStrings.reduce((a, x) => a.split(h(x)).join(''), t)

  ok(label + ' canonical', idx.includes(`<link rel="canonical" href="${base}/" />`))
  ok(label + ' og:url', idx.includes(`content="${base}/"`))
  ok(label + ' 타이틀 코인명', [...idx.matchAll(/<title>([^<]*)/g)].some((m) => m[1].includes(c.names.ko)))
  ok(label + ' 이중치환(캐시캐시 등) 없음', !idx.includes('캐시캐시') && !idx.includes(c.names.ko + c.names.ko))
  ok(label + ' 브랜드', idx.includes(`${c.ticker}_SIGNAL`))
  ok(label + ' 레지스트리 보호(btc 슬롯·비트코인 라벨)', idx.includes("slug: 'btc'") && idx.includes("ko: '비트코인'"))
  ok(label + ' COIN_NAMES 보호', idx.includes('var COIN_NAMES = {') && idx.includes("['이더리움', 'ETH']"))
  ok(label + ' 푸터: 자기 코인 스팬', idx.includes(`<span class="cur" data-coin="${sub}"`))
  ok(label + ' 푸터: btc 링크', idx.includes('<a data-coin="btc" href="https://btc.broodev.com/">비트코인</a>'))
  ok(label + ' 자기참조 잔존(btc 도메인) 없음', !idx.includes('https://btc.broodev.com/og-image') && !idx.includes(`canonical" href="https://btc.broodev.com/`) && !idx.includes(`canonical" href="https://broodev.com/`))
  ok(label + ' 비트코인 앱 링크 보호(코인 선택 JS)', idx.includes("btcLink.href = 'https://btc.broodev.com/'") && idx.includes("v === 'btc' ? 'https://btc.broodev.com/'"))
  ok(label + ' 호스트 인식 헬퍼', idx.includes('window.__SUBCOIN'))
  ok(label + ' 티커 치환(CJK 인접 포함)', !/(?<![A-Za-z0-9_])BTC(?=[指価價])/.test(idx))

  // _redirects: 비트코인 전용 글 → btc 301, 마지막 줄 = 404 catch-all
  const rd = read(`${dir}/_redirects`).trim().split(/\r?\n/).filter((l) => l && !l.startsWith('#'))
  ok(label + ' _redirects 404 catch-all 이 마지막', rd[rd.length - 1] === '/*  /404.html  404')
  for (const p of BTC_ONLY_PATHS) ok(label + ' _redirects /' + p + ' → btc 301', rd.includes(`/${p}  https://btc.broodev.com/${p}  301`))
  // 상대 btc 링크 0 (정적 HTML · JSON-LD · JS 문자열 — 앱 전체)
  const rel = []
  for (const f of walk(dir)) { if (f.endsWith('seo-meta.js')) continue; const m = read(f).match(REL_BTC); if (m) rel.push(f.slice(dir.length + 1) + ':' + m.length) }
  ok(label + ' 상대 btc 전용 글 링크 0', rel.length === 0, rel.slice(0, 4).join(' '))
  // 비트코인 고유 서술 보존
  ok(label + ' 고유 서술: 공포·탐욕 지수 = 비트코인 투자 심리(정적)', idx.includes('공포·탐욕 지수는 비트코인 투자 심리를'))
  ok(label + ' 고유 서술: 「비트코인 공포지수란?」 제목(정적)', idx.includes('<h2>비트코인 공포지수란?</h2>'))
  const whatH = [...seo.matchAll(/whatIsH: '((?:[^'\\]|\\.)*)'/g)].map((m) => m[1])
  ok(label + ' 고유 서술: seo-i18n 13개 언어 「비트코인 공포지수」 제목', whatH.length === 13 && whatH.every((w) => BTC_NAMES.test(w)))
  ok(label + ' 고유 서술: Alternative.me 지수 (BTC 중심)', idx.includes('(BTC 중심)'))
  const whats = [...seo.matchAll(/whatIsP: '((?:[^'\\]|\\.)*)'/g)].map((m) => m[1])
  ok(label + ' 고유 서술: seo-i18n 13개 언어 정의에 비트코인', whats.length === 13 && whats.every((w) => BTC_NAMES.test(w)))
  ok(label + ' 고유 서술: 비트코인 전용 글 목록 이름', idx.includes('비트코인 바닥을 파악하는 방법'))
  // 검색엔진 소유확인 토큰(btc 것) 없음
  ok(label + ' naver-site-verification 없음', !idx.includes('naver-site-verification'))
  // 지표 수 7 · Thermocap 없음(코인 문구 — 보호구역 제외)
  const visible = dropContent(idx.replace(/<ul class="seo-guides">[\s\S]*?<\/ul>/g, '').replace(/<script type="application\/ld\+json" data-ld="faq">[\s\S]*?<\/script>/, ''))
  const seoNoDeep = seo.replace(/var DEEP = \{[\s\S]*?\n {2}\};/, '').replace(/ {2}var COIN_SEO = \{[\s\S]*?\n {2}\};\n/, '')
  const e1 = visible.match(EIGHT), e2 = seoNoDeep.match(EIGHT)
  ok(label + ' 지표 수 8 잔존 없음(index)', !e1, e1 && visible.slice(Math.max(0, e1.index - 30), e1.index + 20))
  ok(label + ' 지표 수 8 잔존 없음(seo-i18n)', !e2, e2 && seoNoDeep.slice(Math.max(0, e2.index - 30), e2.index + 20))
  const seoSec = (/<section class="seo"[\s\S]*?<\/section>/.exec(visible) || [''])[0]
  const lds = [...visible.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n') // FAQPage(= 코인 faq) 제외
  const docDesc = (/const DOC_DESC = \{[\s\S]*?\n\s*\}/.exec(idx) || [''])[0]
  ok(label + ' Thermocap 없음(정적 본문·JSON-LD·DOC_DESC)', !/Thermocap/.test(seoSec + lds + docDesc))
  ok(label + ' Thermocap 없음(seo-i18n 본문)', !/Thermocap/.test(seoNoDeep))
  // THERM·Z 약칭(2026-10-10): 코인 지표 목록의 btc 전용 항목(COIN.slug === 'btc' 조건) 1곳 말고는 없어야 한다 — 프리미엄 안내(PREM_UI) 13개 언어 포함
  const premUi = (/const PREM_UI = \{[\s\S]*?\n\}/.exec(jsx) || [''])[0]
  ok(label + ' THERM 없음(프리미엄 안내 13개 언어)', premUi.length > 0 && !/THERM|Thermocap/.test(premUi))
  const thermShort = [...jsx.matchAll(/THERM·Z/g)].map((m) => jsx.slice(Math.max(0, m.index - 60), m.index))
  ok(label + ' THERM·Z 는 btc 전용 지표 정의뿐', thermShort.length === 1 && thermShort[0].includes("COIN.slug === 'btc'"), thermShort.length + '곳')
  ok(label + ' 7개 지표 문구', idx.includes('7개 지표') && seo.includes('7 indicators'))
  ok(label + ' FAQPage data-ld="faq"', /<script type="application\/ld\+json" data-ld="faq">/.test(idx))

  // ---- v4 코인 고유 본문
  // 정적 section.seo(ko): data-coin · aria-label · h1 · 소개 · 코인 블록 순서 · 공통 해설 · FAQ = 본문 faq
  const sec = (/<section class="seo"[^>]*>[\s\S]*?<\/section>/.exec(idx) || [''])[0]
  ok(label + ' section.seo data-coin · aria-label', sec.startsWith(`<section class="seo" data-coin="${sub}" aria-label="${h(ko.title)}">`))
  const want = ['<h1>' + h(ko.title) + '</h1>', '<p>' + h(ko.intro) + '</p>', '<h2>' + h(ko.coinH) + '</h2>', ...ko.coinP.map((x) => '<p>' + h(x) + '</p>'),
    '<h2>' + h(ko.applyH) + '</h2>', ...ko.apply.map((x) => '<li>' + h(x) + '</li>'), '<h2>' + h(ko.histH) + '</h2>', ...ko.hist.map((x) => '<li>' + h(x) + '</li>'),
    '<h2>비트코인 공포지수란?</h2>', '<h2>자주 묻는 질문</h2>', ...ko.faq.flatMap((x) => ['<dt>' + h(x.q) + '</dt>', '<dd>' + h(x.a) + '</dd>']), 'class="seo-disclaimer"']
  const miss = inOrder(sec, want)
  ok(label + ' 정적 본문 = 코인 본문(순서)', !miss, miss.slice(0, 60))
  const dts = [...sec.matchAll(/<dt>([\s\S]*?)<\/dt>/g)].length
  ok(label + ' 정적 FAQ = 코인 faq 만(' + ko.faq.length + ')', dts === ko.faq.length, 'dt ' + dts)
  ok(label + ' 정적 h1 1개', (sec.match(/<h1>/g) || []).length === 1)
  // JSON-LD FAQPage = 화면 FAQ(ko)
  let ld = null
  try { ld = JSON.parse((/<script type="application\/ld\+json" data-ld="faq">([\s\S]*?)<\/script>/.exec(idx) || [])[1]) } catch (e) { ld = null }
  ok(label + ' FAQPage = 화면 FAQ(질문·답 문구 동일)', ld && ld['@type'] === 'FAQPage' && ld.mainEntity.length === ko.faq.length &&
    ld.mainEntity.every((q, i) => q['@type'] === 'Question' && q.name === ko.faq[i].q && q.acceptedAnswer.text === ko.faq[i].a))
  // seo-i18n: 13개 언어 데이터 = 본문 · 렌더 순서
  const cs = loadSeo(`${dir}/seo-i18n.js`)
  const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b)
  const badLang = LANGS.filter((l) => {
    const d = cs.SEO[l], k = K[l]
    return !d || !['title', 'intro', 'coinH', 'coinP', 'applyH', 'apply', 'histH', 'hist', 'faq'].every((x) => eq(d[x], k[x]))
  })
  ok(label + ' seo-i18n 13개 언어 = 코인 본문(title·intro·faq 교체 + 새 키)', !badLang.length, badLang.join(' '))
  const esc3 = (x) => String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const badRender = LANGS.filter((l) => {
    const d = cs.SEO[l], r = cs.render(l)
    const parts = ['<h1>' + esc3(d.title) + '</h1>', '<p>' + esc3(d.intro) + '</p>', '<h2>' + esc3(d.coinH) + '</h2>', ...d.coinP.map((x) => '<p>' + esc3(x) + '</p>'),
      '<h2>' + esc3(d.applyH) + '</h2>', ...d.apply.map((x) => '<li>' + esc3(x) + '</li>'), '<h2>' + esc3(d.histH) + '</h2>', ...d.hist.map((x) => '<li>' + esc3(x) + '</li>'),
      '<h2>' + esc3(d.whatIsH) + '</h2>', '<h2>' + esc3(d.faqH) + '</h2>', ...d.faq.flatMap((x) => ['<dt>' + esc3(x.q) + '</dt>', '<dd>' + esc3(x.a) + '</dd>']), 'seo-disclaimer']
    return inOrder(r.html, parts) || r.attrs['aria-label'] !== d.title || (r.html.match(/<h1>/g) || []).length !== 1
  })
  ok(label + ' renderSEO 13개 언어(코인 블록 순서 · h1 1개 · aria-label)', !badRender.length, badRender.join(' '))
  // 메타: 정적 ko · DOC_TITLE/DOC_DESC 13개 언어 · COIN_META['/'] = 본문 meta, 이미지 = 코인 자신의 것
  ok(label + ' <title> = 본문 meta.t', idx.includes(`<title>${h(ko.meta.t)}</title>`))
  ok(label + ' description = 본문 meta.d', new RegExp('<meta\\s+name="description"\\s+content="' + h(ko.meta.d).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"').test(idx))
  ok(label + ' og/twitter 제목·설명 = 본문 meta', [['property="og:title"', ko.meta.t], ['property="og:description"', ko.meta.d], ['name="twitter:title"', ko.meta.t], ['name="twitter:description"', ko.meta.d], ['property="og:image:alt"', ko.meta.t]]
    .every(([sel, v]) => idx.includes(`<meta ${sel} content="${h(v)}"`)))
  const DT = jsDict(idx, 'DOC_TITLE') || {}, DD = jsDict(idx, 'DOC_DESC') || {}
  ok(label + ' DOC_TITLE·DOC_DESC 13개 언어 = 본문 meta', LANGS.every((l) => DT[l] === K[l].meta.t && DD[l] === K[l].meta.d))
  const cm = (COIN_META[sub] || {})['/'] || {}
  ok(label + ' COIN_META / 13개 언어 = 본문 meta · 코인 OG', LANGS.every((l) => cm[l] && cm[l].t === K[l].meta.t && cm[l].d === K[l].meta.d &&
    (l === 'ko' ? !cm[l].img : cm[l].img === base + (l === 'ja' ? '/og-ja.png' : '/og-en.png'))))
  ok(label + ' og:image = 코인 자신', idx.includes(`<meta property="og:image" content="${base}/og-image.png" />`) && idx.includes(`<meta name="twitter:image" content="${base}/og-image.png" />`))
  // OG 썸네일: 3장 · 1200×630 · btc 것과 다름(코인 전용) · 템플릿에 ₿ 없음 · 링에 티커
  for (const f of OG_FILES) {
    const p = `${dir}/${f}`
    const sz = existsSync(p) ? pngSize(p) : null
    ok(label + ' OG ' + f + ' 1200×630', sz && sz[0] === 1200 && sz[1] === 630, sz ? sz.join('×') : '없음')
    ok(label + ' OG ' + f + ' 코인 전용(btc 와 다름)', existsSync(p) && !readFileSync(p).equals(readFileSync(`${R}/apps/btc/${f}`)), 'node scripts/og/gen_coin_og.mjs ' + sub)
  }
  const ogh = read(`${dir}/og-image.html`)
  ok(label + ' og-image.html: ₿ 없음 · 링 = 티커 · 제목 맞춤', !ogh.includes('₿') && ogh.includes(`>${c.ticker}</text>`) && ogh.includes("setAttribute('data-fit'"))
  // sitemap lastmod = 본문 갱신일 이후
  const lm = [...read(`${dir}/sitemap.xml`).matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1])
  const wantLm = [LASTMOD, coinContent.updated || LASTMOD].sort().pop()
  ok(label + ' sitemap lastmod = ' + wantLm, lm.length && lm.every((x) => x === wantLm), [...new Set(lm)].join(','))

  // SEO L2·L4·L5
  ok(label + ' L2 제안 바', idx.includes('src="/lang-suggest.js"') && existsSync(`${dir}/lang-suggest.js`))
  ok(label + ' L4 hreflang /', hreflangOk(html, base + '/'))
  for (const doc of ['privacy', 'terms']) ok(label + ' L4 hreflang /' + doc, hreflangOk(read(`${dir}/${doc}.html`), base + '/' + doc))
  const sm = sitemapOk(read(`${dir}/sitemap.xml`), base, ['/', '/privacy', '/terms'])
  ok(label + ' L5 sitemap', !sm, sm)
  ok(label + ' sitemap 자기 도메인', !read(`${dir}/sitemap.xml`).includes('https://broodev.com/') && !read(`${dir}/sitemap.xml`).includes('btc.broodev.com'))
  ok(label + ' robots 자기 도메인', read(`${dir}/robots.txt`).includes(base + '/sitemap.xml'))
  // 미들웨어: 코인 호스트 · btc 호스트 보호 · seo-meta 동일
  ok(label + ' 미들웨어 SITE·SELF·BTC_HOST·COIN_HOSTS', mw.includes(`const SITE = '${base}';`) && mw.includes(`const SELF = '${sub}';`) && mw.includes("const BTC_HOST = 'btc.broodev.com';") && mw.includes("bch: ['비트코인캐시', 'BCH']"))
  ok(label + ' seo-meta.js = btc 생성물', read(`${dir}/functions/_lib/seo-meta.js`) === btcMeta)
  ok(label + ' seo-meta COIN_META 항목', btcMeta.includes(`"${sub}": {`))

  for (const junk of BTC_ONLY) ok(label + ' 제외파일 ' + junk, !existsSync(`${dir}/${junk}`))
  for (const need of ['index.html', 'privacy.html', 'terms.html', 'ads.txt', 'robots.txt', 'sitemap.xml', 'content.css', 'functions/_middleware.js', 'functions/_lib/seo-lang.js', 'functions/_lib/seo-meta.js'])
    ok(label + ' 필수파일 ' + need, existsSync(`${dir}/${need}`))
  // 콘텐츠 페이지 13개 언어(2026-10-09): privacy·terms·404 의 12개 언어 조각 + content-i18n.js 가 있고, 비트코인 전용 조각은 없고, 자기참조·브랜드가 코인으로 바뀌었는지
  ok(label + ' content-i18n.js', existsSync(`${dir}/content-i18n.js`))
  for (const doc of ['privacy', 'terms', '404']) {
    ok(label + ' ' + doc + '.html → content-i18n.js', read(`${dir}/${doc}.html`).includes('src="/content-i18n.js'))
    for (const l of LANGS12) {
      const f = `${dir}/i18n/${doc}.${l}.html`
      if (!existsSync(f)) { ok(label + ' 조각 ' + doc + '.' + l, false, '없음'); continue }
      const t = read(f)
      ok(label + ' 조각 ' + doc + '.' + l + ' 자기참조', !/https:\/\/btc\.broodev\.com\/(?!(?:methodology|indicators|glossary|about|guide-fear-greed)\b)/.test(t) && !t.includes('BTC_SIGNAL'), 'btc 흔적')
    }
  }
  const frags = existsSync(`${dir}/i18n`) ? readdirSync(`${dir}/i18n`) : []
  ok(label + ' 비트코인 전용 조각 없음', !frags.some((f) => BTC_ONLY.includes(f.split('.')[0] + '.html')), frags.filter((f) => BTC_ONLY.includes(f.split('.')[0] + '.html')).slice(0, 3).join(' '))
}
const total = COINS.length
console.log(fail === 0 ? `전부 통과 (btc 원본 + ${total}개 코인 앱 × ~70검사)` : `실패 ${fail}건`)
process.exit(fail ? 1 : 0)
