# home3

> **기술 스택:** 순수 정적 HTML · Bootstrap 5 · jQuery · GSAP(ScrollTrigger · SplitText · ScrollSmoother) · Swiper · Slick · Odometer · SCSS(수동 컴파일). React·Babel·i18n·터미널 테마·AdSense **없음**.

`home.broodev.com` (루트 = 현재 활성 홈, 스위치는 [`../README.md`](../README.md)) — **양동화(@jsontype) 업적 포트폴리오 v3.** `home2`(Photollax)의 다음 버전.

Davies 템플릿(themesflat · v0.1.0 · 2025-10)을 2026-10-02 통합한 뒤 **텍스트만 전부 교체**했다. 사진·영상은 템플릿 원본 그대로(추후 교체 예정). 템플릿의 `documentation/`, 블로그 4종, `landing.html`, `version-2.html`, 아이콘 데모, `images/{blog,demo}` 는 가져오지 않았다.

## 내용 구성

| 섹션 | 내용 | 출처 |
|---|---|---|
| 히어로 | `JSONTYPE_` · 역할 3줄 · 한 줄 소개 · OPEN FOR COLLABORATION | home1 `WHOAMI_TEXT` |
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

## 파일

| 경로 | 설명 |
|---|---|
| `index.html` | 원페이지 (상단 `<style>` 에 템플릿 보정 4줄: 히어로 이름 크기 · 한글 줄바꿈 · 앱 링크 색) |
| `404.html` | 같은 셸의 404 (Pages 커스텀 404 · home 스위치가 404 로 반환) |
| `assets/css/` | bootstrap · swiper · slick · animate · odometer · `styles.css`(템플릿, 원본 `assets/scss/`) |
| `assets/js/` | jquery · bootstrap · swiper · slick · gsap 계열 · `carousel.js`(슬라이더 초기화) · `gsapAnimation.js` · `main.js`(시계·커서·카운터) |
| `assets/images/`, `assets/images/video/` | 템플릿 이미지·영상(**교체 대상**) |
| `assets/fonts/`, `assets/icon/` | 템플릿 폰트 · icomoon 아이콘 |

## 알려진 문제

- 연락 폼은 백엔드가 없어 **mailto 링크를 여는 방식**(브라우저 기본 메일 앱). 실제 수신 폼이 필요하면 Pages Function 또는 외부 폼 서비스.
- 히어로·소개 영상, 작품·하이라이트 사진은 템플릿 원본. 단 **Cloudflare Pages 는 파일당 25 MiB 제한**이라 히어로 `corridor.webm` 은 1600×900 VP8 26 MB → 1280w VP9 ~1 Mbps 3.9 MB 로 재인코딩했고(ffmpeg-static), 미참조 영상 `wave-bg.mp4`(67 MB)·`nexbot.mp4`(29 MB)는 삭제. 25 MiB 를 넘는 자산을 넣으면 배포가 실패한다.
- 템플릿 디스플레이 폰트에 한글 글리프가 없어 한글은 시스템 폰트로 폴백된다(`word-break: keep-all` 로 어절 단위 줄바꿈).
- 로고는 템플릿 아이콘 대신 인라인 SVG 텍스트 `Y`. 파비콘은 템플릿 것.

## 배포

`apps/home` 전체가 Pages 프로젝트 `broodev-home` 하나로 배포된다(Root `apps/home`). 이 폴더는 `/home3/` 로 미리보기되고, 현재 루트(/)에 떠 있다. 절차는 [`docs/deploy-cloudflare.md`](../../../docs/deploy-cloudflare.md) §2-B.
