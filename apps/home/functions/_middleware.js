// Cloudflare Pages Function (엣지) — home.broodev.com 의 "현재 홈" 스위치
//
//   apps/home/
//   ├─ home1/   개발자 소개 + 앱 포털 (터미널 테마 · React 18 CDN)
//   ├─ home2/   업적 포트폴리오 (Photollax 템플릿)
//   ├─ home3/   업적 포트폴리오 v3 (Davies 템플릿)
//   └─ functions/_middleware.js   ← 이 파일. ACTIVE 한 줄로 루트(/)에 띄울 홈을 고른다.
//
//   /            → /<ACTIVE>/            (주소창 URL 은 그대로, 내부 재작성)
//   /foo.css     → /<ACTIVE>/foo.css      (각 홈의 상대경로 자산이 그대로 동작)
//   /home1/… /home2/… /home3/…           → 그대로 서빙 (미리보기용 · noindex)
//
// 전환: ACTIVE 수정 → 푸시. 커밋 없이 바꾸려면 Pages 대시보드 환경변수 HOME_ACTIVE=home2 (상수보다 우선).

const ACTIVE = 'home3'
const HOMES = ['home1', 'home2', 'home3']

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url)
  const active = HOMES.includes(env && env.HOME_ACTIVE) ? env.HOME_ACTIVE : ACTIVE
  const path = url.pathname
  const preview = url.hostname.endsWith('.pages.dev') // *.pages.dev 는 커스텀 도메인의 복제본 → 색인 금지

  // 1) /homeN/… 직접 접근 — 그대로 서빙하되 루트와 중복 콘텐츠라 색인 금지
  const direct = path.match(/^\/(home\d+)(\/|$)/)
  if (direct && HOMES.includes(direct[1])) {
    return withHeaders(await next(), { 'X-Robots-Tag': 'noindex, nofollow' })
  }

  // 2) 루트 → 현재 홈으로 내부 재작성
  url.pathname = '/' + active + path
  const res = await env.ASSETS.fetch(new Request(url.toString(), request))

  // 자산 서버가 /home3/sub → /home3/sub/ 같은 리다이렉트를 주면 Location 에서 내부 접두어를 벗긴다
  const loc = res.headers.get('location')
  if (loc && res.status >= 300 && res.status < 400) {
    const stripped = loc.replace(new RegExp('^(https?://[^/]+)?/' + active + '(?=/|$)'), '$1') || '/'
    return withHeaders(res, { location: stripped })
  }

  // 없는 경로 → 현재 홈의 404.html (상태 404 유지)
  if (res.status === 404) {
    const nf = await env.ASSETS.fetch(new Request(new URL('/' + active + '/404.html', url).toString()))
    if (nf.ok) return withHeaders(new Response(nf.body, { status: 404, headers: nf.headers }), preview ? { 'X-Robots-Tag': 'noindex, nofollow' } : {})
  }

  return preview ? withHeaders(res, { 'X-Robots-Tag': 'noindex, nofollow' }) : res
}

function withHeaders(res, headers) {
  const r = new Response(res.body, res)
  for (const k in headers) r.headers.set(k, headers[k])
  return r
}
