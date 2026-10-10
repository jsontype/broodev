# dev2

> **기술 스택:** 순수 정적 HTML · Bootstrap 3.3.6 · jQuery 2.2.1 · Font Awesome · Owl Carousel · SCSS(Compass, 수동 컴파일) · **13개 언어 i18n**(자체 런타임, 빌드 없음). React·Babel·터미널 테마·AdSense **없음**.

`dev.broodev.com/dev2/`(루트 활성은 dev3 — 스위치는 [`../README.md`](../README.md)) — **양동화(@jsontype) 업적 포트폴리오.** `dev1`(구 `dev`)의 다음 버전 홈이고, `dev3`(Davies 템플릿)가 그 다음 버전.

구 `jsontype/y-systems` 레포 `home/html/`(Photollax 템플릿)을 2026-10-01 통합한 뒤 **텍스트만 전부 교체**했다. 사진·이미지는 템플릿 원본 그대로(추후 비슷한 사진으로 교체 예정). 템플릿 설명서 `home/documentation/`과 `wrangler.toml`은 가져오지 않았다.

## 내용 구성

| 섹션 | 내용 | 출처 |
|---|---|---|
| 히어로 슬라이드 0 | 인사 + 한 줄 소개 | dev1(dev) |
| 슬라이드 1–12 | **업적 12건**(최신순, 제목만) — 회사·분야·시기 / 공헌도·임팩트·키워드 | 스킬시트 |
| `#about-me` 소개 | 자기소개 2문단 | dev1(dev) `WHOAMI_TEXT` + 스킬시트 |
| `#services` 하는 일 | WEB BUILD · GLOBAL SHIP · TEACH & SHARE | dev1(dev) `SERVICES` |
| `#pricing` broodev 앱 | 15개 앱 링크 3카드(id는 템플릿 CSS 때문에 `pricing` 유지) | dev1(dev) `PROJECTS` |
| `#contact` 연락 | 이메일 · GitHub · X · LinkedIn | dev1(dev) `LINKS` |
| `blog.html` (Blog 모달) | **업적 전체 15건** 목록 + 연도별 앵커 | 스킬시트 |
| `blog-detail.html` | N사 프로젝트 상세(가장 긴 서술) | 스킬시트 |

## 다국어 (13개 언어)

en · ja · ko · zh(간체, `<html lang="zh-Hans">`) · zh-Hant · th · es · fr · de · it · pt · ru · nl. 방식은 `dev3` 와 같다.

- **감지·저장:** `localStorage['home:lang']` → `?lang=` → `navigator.languages` → en. 저장 키가 dev1·dev3 와 같아서 루트 홈을 바꿔 끼워도 언어가 유지된다.
- **풀다운(🌐):** index 는 헤더 오른쪽 위, blog·blog-detail·404 는 페이지 오른쪽 위(자국어 이름 13개, dev3 와 같은 순서). 고르면 저장하고 `?lang=xx` 로 새로고침. Blog 모달(iframe) 안에서는 숨기고, iframe `data-src` 에 `?lang=` 를 붙여 부모와 같은 언어로 연다.
- **사전:** `assets/js/i18n-data.js` 의 `window.HOME2_I18N` (234키 × 13). 업적 제목·회사·분야 태그·공헌도·앱 설명·서비스 설명처럼 **dev3 와 원문이 같은 문장은 dev3 사전의 번역을 그대로 옮겼다** — 고칠 땐 양쪽을 같이.
- **런타임:** `assets/js/i18n.js` — `data-i18n`(textContent) · `data-i18n-aria-label` · `data-i18n-alt` · `data-i18n-placeholder` · `data-i18n-titleattr`(title 속성) · `<html data-i18n-title/desc>`(페이지별 제목·설명 키, 생략 시 `meta_title`/`meta_desc`). og/twitter 메타도 같은 값으로 바꾼다. jquery.validate 기본 메시지도 현재 언어로.
  - ⚠ 스크립트 순서: `jquery` → `bootstrap` → `jquery.validate` → **`i18n-data.js` → `i18n.js`** → … → `custom.js`. custom.js 가 DOM ready 때 오프스크린 섹션 스크롤 위치를 재므로 그 전에 글자를 바꿔야 한다.
- HTML 원문(크롤러·JS 없음)은 한국어 그대로. 각 `data-i18n` 요소의 원문 = 사전 `ko` 값.
- 번역 문체: 각 언어 원어민 포트폴리오 문장. 회사는 번역에서도 익명(en Company N · ja N社 · zh N公司 · th บริษัท N · de Firma N …). 직함·기간·수치는 원문 그대로.
- 검증: `node scripts/i18n-scan.mjs --url http://127.0.0.1:<포트>/dev2/<페이지> --set qs:lang --set ls:home:lang --langs all --wait 5000` (index 는 `--pre` 로 메뉴 열기·빈 폼 제출까지) — 4개 페이지 × 13개 언어 CLEAN.
- 한계: 공유 썸네일(OG)의 언어별 정적 치환은 `functions/_middleware.js` 의 OG3 가 **dev3 전용**이라, dev2 를 루트로 올려도 크롤러는 한국어 메타를 본다(통합 시 같이 처리).

**익명화 규칙:** 회사명은 이니셜 + 사(N사·Z사·S사 …), 같은 이니셜은 업종으로 구분(S사(통신)/S사(HR)/S사(인슈어테크)). 회사를 특정하는 제품명·납품처 실명도 기능 설명으로 대체. 스킬시트의 Miidas(단기 재직), 동료 개인사, 연봉 수치는 **제외**.

## 파일

| 경로 | 설명 |
|---|---|
| `index.html` | 메인(원페이지: 슬라이드 13장 · 소개 · 하는 일 · broodev 앱 · 연락) |
| `blog.html`, `blog-detail.html` | 업적 전체 목록 / N사 상세 (Blog 모달 iframe) |
| `404.html` | 템플릿 룩의 404 페이지(`iframe-page` 레이아웃, Pages 커스텀 404). 미들웨어가 임의 경로에 이 파일을 내보내므로 `<head>` 첫 스크립트가 `<base>` 를 `/dev2/`(미리보기) 또는 `/`(루트 활성) 로 심어 상대경로 자산이 깨지지 않게 한다 |
| `assets/bootstrap/` | Bootstrap 3.3.6 |
| `assets/css/`, `assets/js/` | 템플릿 스타일(`style.css`)·스크립트(`custom.js`) + 플러그인 |
| `assets/js/i18n-data.js`, `assets/js/i18n.js` | 13개 언어 사전 / 런타임 |
| `assets/css/lang.css` | 언어 풀다운 + 긴 번역 대비 슬라이드 설명 오른쪽 여백 |
| `assets/img/favicon.svg` | 파비콘(dev3 와 같은 파일) |
| `assets/fonts/` | Font Awesome · Elegant Icons |
| `assets/img/` | 템플릿 이미지(**교체 대상**) |
| `assets/scss/` | `style.css` 원본(Compass). `assets/config.rb` 가 Compass 설정 |
| `assets/php/email.php` | 템플릿 문의 폼 백엔드 — **Pages 는 PHP 를 실행하지 않으므로 동작 안 함** |

## 알려진 문제

- 문의 폼(`custom.js` → `assets/php/email.php` POST)은 정적 호스팅에서 동작하지 않는다. 쓰려면 Cloudflare Pages Function 이나 외부 폼 서비스로 교체.
- `#contact` 의 Google Maps(API 키 없음 → 콘솔 오류·워터마크)는 i18n 작업 때 **제거**했다(지도 스크립트·`simpleMap` 호출 삭제. `custom.js` 의 `simpleMap` 함수와 `#map` CSS 는 남아 있음).
- 문의 폼 POST 응답(`email.php`)은 번역되지 않는다(정적 호스팅에선 어차피 동작 안 함).
- 템플릿의 가짜 댓글/답글 폼(blog-detail)은 제거했다. `assets/img/person-02~04.jpg` 는 파일만 남아 있다.

## 배포

`apps/dev` 전체가 Pages 프로젝트 `broodev-dev` 하나로 배포된다(Root `apps/dev`). 이 폴더는 `/dev2/` 로 미리보기되고, 루트(/)에 띄우려면 `../functions/_middleware.js` 의 `ACTIVE` 를 `'dev2'` 로. 절차는 [`docs/deploy-cloudflare.md`](../../../docs/deploy-cloudflare.md) §2-B.
