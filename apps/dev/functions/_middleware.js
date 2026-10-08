// Cloudflare Pages Function (엣지) — dev.broodev.com 의 "현재 개발자 사이트" 스위치
//
//   apps/dev/                       (2026-10-03 apps/home → apps/dev 로 이동, home1·2·3 → dev1·2·3)
//   ├─ dev1/   개발자 소개 + 앱 포털 (터미널 테마 · React 18 CDN)
//   ├─ dev2/   업적 포트폴리오 (Photollax 템플릿)
//   ├─ dev3/   업적 포트폴리오 v3 (Davies 템플릿)
//   └─ functions/_middleware.js   ← 이 파일. ACTIVE 한 줄로 루트(/)에 띄울 사이트를 고른다.
//
//   /            → /<ACTIVE>/            (주소창 URL 은 그대로, 내부 재작성)
//   /foo.css     → /<ACTIVE>/foo.css      (각 사이트의 상대경로 자산이 그대로 동작)
//   /dev1/… /dev2/… /dev3/…              → 그대로 서빙 (미리보기용 · noindex)
//
// 전환: ACTIVE 수정 → 푸시. 커밋 없이 바꾸려면 Pages 대시보드 환경변수 DEV_ACTIVE=dev2 (상수보다 우선).

const ACTIVE = 'dev3'
const SITES = ['dev1', 'dev2', 'dev3']

// dev3 공유 썸네일(OG) 다국어화 — 크롤러는 JS 를 돌리지 않으므로 ?lang= 에 따라 응답 직전에 메타를 갈아끼운다(btc 와 같은 방식).
// 값은 dev3/assets/js/i18n-data.js 의 meta_title·meta_desc 와 같아야 한다. ko·미지원 lang → 원본(한국어) 그대로.
const OG3 = {
  en: { t: "Yang Donghwa (@jsontype) — Portfolio · Y-Systems", d: "Portfolio of Yang Donghwa (@jsontype), a frontend & full-cycle engineer in Tokyo: 15 projects across fintech, AI, edtech, legaltech and telecom, 15 broodev web apps, 10 developers trained.", l: 'en_US' },
  ja: { t: "ヤン・ドンファ (@jsontype) — ポートフォリオ · Y-Systems", d: "東京のフロントエンド・フルサイクルエンジニア、ヤン・ドンファ(@jsontype)のポートフォリオ。フィンテック・AI・エドテック・リーガルテック・通信のプロジェクト15件、broodev ウェブアプリ15本、開発者10名を輩出。", l: 'ja_JP' },
  zh: { t: "Yang Donghwa (@jsontype) — 作品集 · Y-Systems", d: "东京前端·全周期工程师 Yang Donghwa (@jsontype) 的作品集：横跨金融科技、AI、教育科技、法律科技与电信的 15 个项目，15 款 broodev 网页应用，培养出 10 名开发者。", l: 'zh_CN' },
  'zh-Hant': { t: "Yang Donghwa (@jsontype) — 作品集 · Y-Systems", d: "東京前端·全週期工程師 Yang Donghwa (@jsontype) 的作品集：橫跨金融科技、AI、教育科技、法律科技與電信的 15 個專案，15 款 broodev 網頁應用程式，培育出 10 名開發者。", l: 'zh_TW' },
  th: { t: "ยัง ดงฮวา (@jsontype) — ผลงาน · Y-Systems", d: "ผลงานของ ยัง ดงฮวา (@jsontype) วิศวกรฟรอนต์เอนด์และฟูลไซเคิลในโตเกียว: 15 โปรเจกต์ในสายฟินเทค AI เอ็ดเทค ลีกัลเทค และโทรคมนาคม, เว็บแอป broodev 15 ตัว, ปั้นนักพัฒนา 10 คน", l: 'th_TH' },
  es: { t: "Yang Donghwa (@jsontype) — Portafolio · Y-Systems", d: "Portafolio de Yang Donghwa (@jsontype), ingeniero frontend y full-cycle en Tokio: 15 proyectos en fintech, IA, edtech, legaltech y telecomunicaciones, 15 aplicaciones web broodev y 10 desarrolladores formados.", l: 'es_ES' },
  fr: { t: "Yang Donghwa (@jsontype) — Portfolio · Y-Systems", d: "Portfolio de Yang Donghwa (@jsontype), ingénieur frontend et full-cycle à Tokyo : 15 projets en fintech, IA, edtech, legaltech et télécoms, 15 applications web broodev, 10 développeurs formés.", l: 'fr_FR' },
  de: { t: "Yang Donghwa (@jsontype) — Portfolio · Y-Systems", d: "Portfolio von Yang Donghwa (@jsontype), Frontend- und Full-Cycle-Engineer in Tokio: 15 Projekte in Fintech, KI, Edtech, Legaltech und Telekommunikation, 15 broodev-Web-Apps, 10 ausgebildete Entwickler.", l: 'de_DE' },
  it: { t: "Yang Donghwa (@jsontype) — Portfolio · Y-Systems", d: "Portfolio di Yang Donghwa (@jsontype), ingegnere frontend e full-cycle a Tokyo: 15 progetti tra fintech, IA, edtech, legaltech e telecomunicazioni, 15 web app broodev, 10 sviluppatori formati.", l: 'it_IT' },
  pt: { t: "Yang Donghwa (@jsontype) — Portefólio · Y-Systems", d: "Portefólio de Yang Donghwa (@jsontype), engenheiro frontend e full-cycle em Tóquio: 15 projetos em fintech, IA, edtech, legaltech e telecomunicações, 15 aplicações web broodev, 10 programadores formados.", l: 'pt_PT' },
  ru: { t: "Ян Донхва (@jsontype) — Портфолио · Y-Systems", d: "Портфолио Яна Донхва (@jsontype), frontend- и full-cycle-инженера в Токио: 15 проектов в финтехе, AI, edtech, legaltech и телекоме, 15 веб-приложений broodev, 10 подготовленных разработчиков.", l: 'ru_RU' },
  nl: { t: "Yang Donghwa (@jsontype) — Portfolio · Y-Systems", d: "Portfolio van Yang Donghwa (@jsontype), frontend- en full-cycle-engineer in Tokio: 15 projecten in fintech, AI, edtech, legaltech en telecom, 15 broodev-webapps, 10 opgeleide developers.", l: 'nl_NL' },
}

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url)
  const active = SITES.includes(env && env.DEV_ACTIVE) ? env.DEV_ACTIVE : ACTIVE
  const path = url.pathname
  const preview = url.hostname.endsWith('.pages.dev') // *.pages.dev 는 커스텀 도메인의 복제본 → 색인 금지

  // 1) /devN/… 직접 접근 — 그대로 서빙하되 루트와 중복 콘텐츠라 색인 금지
  const direct = path.match(/^\/(dev\d+)(\/|$)/)
  if (direct && SITES.includes(direct[1])) {
    return withHeaders(await next(), { 'X-Robots-Tag': 'noindex, nofollow' })
  }

  // 2) 루트 → 현재 사이트로 내부 재작성
  url.pathname = '/' + active + path
  const res = await env.ASSETS.fetch(new Request(url.toString(), request))

  // 자산 서버가 /dev3/sub → /dev3/sub/ 같은 리다이렉트를 주면 Location 에서 내부 접두어를 벗긴다
  const loc = res.headers.get('location')
  if (loc && res.status >= 300 && res.status < 400) {
    const stripped = loc.replace(new RegExp('^(https?://[^/]+)?/' + active + '(?=/|$)'), '$1') || '/'
    return withHeaders(res, { location: stripped })
  }

  // 없는 경로 → 현재 사이트의 404.html (상태 404 유지)
  if (res.status === 404) {
    const nf = await env.ASSETS.fetch(new Request(new URL('/' + active + '/404.html', url).toString()))
    if (nf.ok) return withHeaders(new Response(nf.body, { status: 404, headers: nf.headers }), preview ? { 'X-Robots-Tag': 'noindex, nofollow' } : {})
  }

  const out = active === 'dev3' && (path === '/' || path === '/index.html') ? ogLocalize(res, url) : res
  return preview ? withHeaders(out, { 'X-Robots-Tag': 'noindex, nofollow' }) : out
}

class AttrSetter { constructor(v) { this.v = v } element(el) { el.setAttribute(this.a || 'content', this.v) } }
class TextSetter { constructor(v) { this.v = v } element(el) { el.setInnerContent(this.v) } }

function ogLocalize(res, url) {
  try {
    const lang = url.searchParams.get('lang')
    const m = lang && OG3[lang]
    if (!m || typeof HTMLRewriter === 'undefined') return res
    if (!(res.headers.get('content-type') || '').includes('text/html')) return res
    const langAttr = new AttrSetter(lang); langAttr.a = 'lang'
    return new HTMLRewriter()
      .on('html', langAttr)
      .on('title', new TextSetter(m.t))
      .on('meta[name="description"]', new AttrSetter(m.d))
      .on('meta[property="og:title"]', new AttrSetter(m.t))
      .on('meta[property="og:description"]', new AttrSetter(m.d))
      .on('meta[property="og:image:alt"]', new AttrSetter(m.t))
      .on('meta[property="og:locale"]', new AttrSetter(m.l))
      .on('meta[name="twitter:title"]', new AttrSetter(m.t))
      .on('meta[name="twitter:description"]', new AttrSetter(m.d))
      .transform(res)
  } catch (e) {
    return res
  }
}

function withHeaders(res, headers) {
  const r = new Response(res.body, res)
  for (const k in headers) r.headers.set(k, headers[k])
  return r
}
