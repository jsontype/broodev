# home2

> **기술 스택:** 순수 정적 HTML · Bootstrap 3.3.6 · jQuery 2.2.1 · Font Awesome · Owl Carousel · SCSS(Compass, 수동 컴파일). React·Babel·i18n·터미널 테마·AdSense **없음**.

`home2.broodev.com` — **양동화(@jsontype) 업적 포트폴리오.** `home1`(구 `dev`, dev.broodev.com)의 다음 버전 홈.

구 `jsontype/y-systems` 레포 `home/html/`(Photollax 템플릿)을 2026-10-01 통합한 뒤 **텍스트만 전부 교체**했다. 사진·이미지는 템플릿 원본 그대로(추후 비슷한 사진으로 교체 예정). 템플릿 설명서 `home/documentation/`과 `wrangler.toml`은 가져오지 않았다.

## 내용 구성

| 섹션 | 내용 | 출처 |
|---|---|---|
| 히어로 슬라이드 0 | 인사 + 한 줄 소개 | home1(dev) |
| 슬라이드 1–12 | **업적 12건**(최신순, 제목만) — 회사·분야·시기 / 공헌도·임팩트·키워드 | 스킬시트 |
| `#about-me` 소개 | 자기소개 2문단 | home1(dev) `WHOAMI_TEXT` + 스킬시트 |
| `#services` 하는 일 | WEB BUILD · GLOBAL SHIP · TEACH & SHARE | home1(dev) `SERVICES` |
| `#pricing` broodev 앱 | 15개 앱 링크 3카드(id는 템플릿 CSS 때문에 `pricing` 유지) | home1(dev) `PROJECTS` |
| `#contact` 연락 | 이메일 · GitHub · X · YouTube · LinkedIn | home1(dev) `LINKS` |
| `blog.html` (Blog 모달) | **업적 전체 15건** 목록 + 연도별 앵커 | 스킬시트 |
| `blog-detail.html` | N사 프로젝트 상세(가장 긴 서술) | 스킬시트 |

**익명화 규칙:** 회사명은 이니셜 + 사(N사·Z사·S사 …), 같은 이니셜은 업종으로 구분(S사(통신)/S사(HR)/S사(인슈어테크)). 회사를 특정하는 제품명·납품처 실명도 기능 설명으로 대체. 스킬시트의 Miidas(단기 재직), 동료 개인사, 연봉 수치는 **제외**.

## 파일

| 경로 | 설명 |
|---|---|
| `index.html` | 메인(원페이지: 슬라이드 13장 · 소개 · 하는 일 · broodev 앱 · 연락) |
| `blog.html`, `blog-detail.html` | 업적 전체 목록 / N사 상세 (Blog 모달 iframe) |
| `404.html` | 템플릿 룩의 404 페이지(`iframe-page` 레이아웃, Pages 커스텀 404) |
| `assets/bootstrap/` | Bootstrap 3.3.6 |
| `assets/css/`, `assets/js/` | 템플릿 스타일(`style.css`)·스크립트(`custom.js`) + 플러그인 |
| `assets/fonts/` | Font Awesome · Elegant Icons |
| `assets/img/` | 템플릿 이미지(**교체 대상**) |
| `assets/scss/` | `style.css` 원본(Compass). `assets/config.rb` 가 Compass 설정 |
| `assets/php/email.php` | 템플릿 문의 폼 백엔드 — **Pages 는 PHP 를 실행하지 않으므로 동작 안 함** |

## 알려진 문제

- 문의 폼(`custom.js` → `assets/php/email.php` POST)은 정적 호스팅에서 동작하지 않는다. 쓰려면 Cloudflare Pages Function 이나 외부 폼 서비스로 교체.
- `#contact` 의 Google Maps 는 API 키 없이 로드되어 워터마크/오류가 날 수 있다(템플릿 원형). 좌표는 도쿄로 바꿔 둠.
- 템플릿의 가짜 댓글/답글 폼(blog-detail)은 제거했다. `assets/img/person-02~04.jpg` 는 파일만 남아 있다.

## 배포

Cloudflare Pages 프로젝트 `broodev-home2` — Root directory `apps/home2`, 빌드 없음, output `.`. 절차는 [`docs/deploy-cloudflare.md`](../../docs/deploy-cloudflare.md) §2-B.
