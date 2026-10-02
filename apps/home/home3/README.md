# home3

> **기술 스택:** 순수 정적 HTML · Bootstrap 5 · jQuery · GSAP(ScrollTrigger · SplitText · ScrollSmoother) · Swiper · Slick · Odometer · SCSS(수동 컴파일) · **자체 i18n 13개 언어**(`assets/js/i18n-data.js` + `i18n.js`). React·Babel·터미널 테마·AdSense **없음**.

`home.broodev.com` (루트 = 현재 활성 홈, 스위치는 [`../README.md`](../README.md)) — **양동화(@jsontype) 업적 포트폴리오 v3.** `home2`(Photollax)의 다음 버전.

Davies 템플릿(themesflat · v0.1.0 · 2025-10)을 2026-10-02 통합한 뒤 **텍스트만 전부 교체**했다. 사진·영상은 템플릿 원본 그대로(추후 교체 예정). 템플릿의 `documentation/`, 블로그 4종, `landing.html`, `version-2.html`, 아이콘 데모, `images/{blog,demo}` 는 가져오지 않았다.

## 내용 구성

| 섹션 | 내용 | 출처 |
|---|---|---|
| 히어로 | `BROODEV_`(프리로더 사이트명도 BROODEV) · 역할 3줄 · 한 줄 소개 · OPEN FOR COLLABORATION | home1 `WHOAMI_TEXT` |
| SELECTED WORKS (slick) | 대표 업적 3건 — Z사 AI 채용 · N사 결제 부정이용 방지 · C사 AI 교과서 | 스킬시트 |
| 업적 전체 (swiper 카드) | **15건** — 회사(익명)·분야·공헌도·연도 | home2 `blog.html` |
| 하는 일 | WEB BUILD · GLOBAL SHIP · TEACH & SHARE + 세부 5줄씩 | home1 `SERVICES` |
| 일하는 방식 | 설계 → 풀사이클 구현 → 배포·운영 3단계 | home2 `blog-detail.html`(N사 상세) |
| ABOUT ME | 소개 + 경력 6줄 | home2 |
| TECH STACK | React·Next / Vue·Nuxt / TypeScript / GraphQL·Node / Cloud·CI/CD | home1 `ORBITS` |
| FIELDS | 분야별 건수 (AI 5 · 핀테크 2 · 교육·공공 3 · 리걸 2 · HR 2 · 통신·모빌리티 2) | 업적 15건 집계 |
| IMPACT HIGHLIGHTS | 성과 인용 4건 (템플릿 testimonial 재활용 — 추천사 아님) | 스킬시트 |
| 숫자 | 프로젝트 15 · 웹앱 15 · 배출 개발자 10 | — |
| broodev 앱 | 15개 링크 3카드 (템플릿 pricing 재활용) | home2 `#pricing` |
| FAQ | 5문항 | — |
| 연락 | 이름·이메일·메시지 → **mailto** · 소셜 4종 | home1 `LINKS` |

**익명화 규칙:** home2 와 동일 — 회사명은 이니셜 + 사(N사·Z사·S사 …), 같은 이니셜은 업종으로 구분. 회사를 특정하는 제품명·납품처 실명은 기능 설명으로 대체. Miidas·동료 개인사·연봉은 **제외**.

## i18n — 13개 언어 (2026-10-02)

- 언어: `en · ja · ko · zh · zh-Hant · th · es · fr · de · it · pt · ru · nl` (btc 앱과 동일). 헤더 우측 🌐 풀다운 순서는 **English · 日本語 · 한국어**, 그 아래 10개.
- 감지: `localStorage(home:lang)` → `?lang=` → `navigator.languages`(첫 매치, `zh-TW/HK` → zh-Hant) → **en**. `<link hreflang>` 13개는 head 에.
- 사전 [`assets/js/i18n-data.js`](assets/js/i18n-data.js)(`window.HOME3_I18N`, 언어당 **160키**, 세 언어 이상에서 키·`<br>`·`{name}` 자리표시자가 같아야 함) + 런타임 [`assets/js/i18n.js`](assets/js/i18n.js). 마크업은 `data-i18n="key"`(텍스트) · `data-i18n-html`(`<br>` 포함 9개) · `data-i18n-aria-label`. HTML 의 한국어 원문 = `ko` 사전값(폴백).
- **스크립트 순서가 중요**: `i18n.js` 는 jquery 바로 다음, `carousel.js`(slick/swiper 가 슬라이드를 복제)·`gsapAnimation.js`(SplitText 가 글자를 쪼갬) **보다 먼저** 실행된다. 그래서 언어 변경은 저장 후 `?lang=` 으로 **새로고침**한다(동적 교체 아님).
- 영어 대문자 디자인 라벨(SELECTED WORKS · ABOUT ME · TECH STACK · OPEN FOR COLLABORATION · MENU 등)과 브랜드·연도는 번역하지 않는다.
- 검증: `node -e` 로 키 동일성(13개 언어 × 160) + HTML 의 `data-i18n` 키가 전부 사전에 있는지 — 커밋 `feat(home3): 13개 언어 i18n` 메시지의 명령 참고.

## 모바일 — 프리로더 · 영상 (2026-10-02 수정)

**증상:** PC 는 정상인데 폰에서는 검은 화면(프리로더 사이트명만)만 보였다.
**원인(헤드리스 Edge + DevTools 프로토콜로 재현):** 템플릿 원본은 `window.load` 뒤에 GSAP 바 애니메이션을 돌리고 그 끝에야 프리로더를 지웠다. ① 히어로 `corridor.webm`(4 MB)·소개 `davies-video.mp4`(1.5 MB)가 `load` 를 수 초~수십 초 지연(1.5 Mbps 에뮬레이션에서 12초 뒤에도 DOM 파싱조차 미완), ② 캐시가 따뜻하면 반대로 jQuery ready 콜백보다 `load` 가 먼저 떠 핸들러가 영영 안 불림, ③ 백그라운드 탭·절전 모드에선 rAF 가 멈춰 GSAP 이 진행 안 됨.
**수정:**
- `gsapAnimation.js` `loader()`: DOM 준비 즉시 바 애니메이션 시작 + **2초 워치독**(`finishPreloader`, 멱등)으로 무조건 프리로더 제거 → `runAnimations()`(단계별 try/catch — 한 단계가 죽어도 `.effectFade` 표시 단계는 돈다) → `home3:ready` 이벤트.
- `index.html` 영상: `<video preload="none">` + `<source data-src>` — 히어로는 `home3:ready`(또는 2.5초) 뒤, 소개 영상은 뷰포트 400px 안에 들어올 때 src 를 넣어 재생. 히어로는 **`corridor.mp4`(H.264 1280×720 · 2.5 MB, ffmpeg-static 으로 변환)를 먼저**, `corridor.webm` 은 폴백 — 원본은 webm 을 `type="video/mp4"` 로 잘못 선언해 Safari/iOS 가 못 틀었다.
- 자가 치유: 4.5초 뒤에도 뷰포트 안 `.effectFade` 가 숨겨져 있으면 `html.fx-fallback` 으로 전부 표시.
- 검증(모바일 에뮬레이션 390×844, iPhone UA): 일반 회선·1.5 Mbps 모두 프리로더 제거 + 히어로 표시 + JS 예외 0. 실제 폰에서 한 번 더 확인할 것.

## 공유 썸네일 (OG)

`og-image.png`(1200×630) 은 [`scripts/og/gen_og.mjs`](../../../scripts/og/gen_og.mjs) 가 생성(`node scripts/og/gen_og.mjs home3`). 메타태그는 `og:image` = `https://home.broodev.com/og-image.png`(루트 재작성으로 `/home3/og-image.png` 가 서빙됨) + `twitter:card=summary_large_image`. 카카오톡은 캐시가 오래가므로 갱신 뒤 https://developers.kakao.com/tool/clear/og 에서 지운다.

## 파일

| 경로 | 설명 |
|---|---|
| `index.html` | 원페이지 (상단 `<style>` 에 템플릿 보정 + 언어 풀다운 CSS + `fx-fallback`; 하단 인라인 스크립트에 mailto 폼 · 영상 지연 로드 · 자가 치유) |
| `404.html` | 같은 셸의 404 (Pages 커스텀 404 · home 스위치가 404 로 반환) |
| `og-image.png` | 공유 썸네일 (생성: `scripts/og/gen_og.mjs`) |
| `assets/js/i18n-data.js`, `assets/js/i18n.js` | 13개 언어 사전(160키) · 감지/적용/풀다운 런타임 |
| `assets/css/` | bootstrap · swiper · slick · animate · odometer · `styles.css`(템플릿, 원본 `assets/scss/`) |
| `assets/js/` | jquery · bootstrap · swiper · slick · gsap 계열 · `carousel.js`(슬라이더 초기화) · `gsapAnimation.js`(프리로더 수정 포함) · `main.js`(시계·커서·카운터) |
| `assets/images/`, `assets/images/video/` | 템플릿 이미지·영상(**교체 대상**). `corridor.mp4`(히어로, H.264) · `corridor.webm`(폴백) · `davies-video.mp4`(소개) |
| `assets/fonts/`, `assets/icon/` | 템플릿 폰트 · icomoon 아이콘 |

## 알려진 문제

- 연락 폼은 백엔드가 없어 **mailto 링크를 여는 방식**(브라우저 기본 메일 앱). 실제 수신 폼이 필요하면 Pages Function 또는 외부 폼 서비스.
- 히어로·소개 영상, 작품·하이라이트 사진은 템플릿 원본. **Cloudflare Pages 는 파일당 25 MiB 제한** — 히어로 원본(1600×900 VP8 26 MB)은 1280w VP9 3.9 MB webm + H.264 2.5 MB mp4 로 재인코딩했고, 미참조 영상 `wave-bg.mp4`(67 MB)·`nexbot.mp4`(29 MB)는 삭제. 25 MiB 를 넘는 자산을 넣으면 배포가 실패한다.
- 템플릿 디스플레이 폰트에 한글(및 일본어·태국어 등) 글리프가 없어 시스템 폰트로 폴백된다(`word-break: keep-all` 로 어절 단위 줄바꿈).
- 로고는 템플릿 아이콘 대신 인라인 SVG 텍스트 `Y`. 파비콘은 템플릿 것.
- OG 메타(og:title/description)는 한국어 고정. 언어별 OG 가 필요하면 btc 처럼 Pages Function(HTMLRewriter)으로 `?lang` 별 치환.

## 배포

`apps/home` 전체가 Pages 프로젝트 `broodev-home` 하나로 배포된다(Root `apps/home`). 이 폴더는 `/home3/` 로 미리보기되고, 현재 루트(/)에 떠 있다. 절차는 [`docs/deploy-cloudflare.md`](../../../docs/deploy-cloudflare.md) §2-B.
