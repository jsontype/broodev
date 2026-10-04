# dev3 (구 home3)

> **기술 스택:** 순수 정적 HTML · Bootstrap 5 · jQuery · GSAP(ScrollTrigger · SplitText · ScrollSmoother) · Swiper · Slick · Odometer · SCSS(수동 컴파일) · **자체 i18n 13개 언어**(`assets/js/i18n-data.js` + `i18n.js`) · **EmailJS**(연락 폼 송신, CDN). React·Babel·터미널 테마·AdSense **없음**.

`dev.broodev.com` (루트 = 현재 활성 사이트, 스위치는 [`../README.md`](../README.md)) — **양동화(@jsontype) 업적 포트폴리오 v3.** `dev2`(Photollax)의 다음 버전. 2026-10-03 `apps/home/home3` → `apps/dev/dev3` 로 이동(폴더·도메인만 바뀜 — JS 전역 `HOME3_I18N`·`HOME3_T`, 이벤트 `home3:ready`, `localStorage(home:lang)` 키는 호환을 위해 그대로).

Davies 템플릿(themesflat · v0.1.0 · 2025-10)을 2026-10-02 통합한 뒤 **텍스트를 전부 교체**했고, 2026-10-03 에 작품·업적·하는 일·분야·하이라이트 **사진 24종을 AI 생성 이미지로 교체**했다(아래 [사진](#사진-2026-10-03)). 히어로·소개 영상과 "하는 일" 배경 3장(`bg-service-*.jpg`, 운동화)은 아직 템플릿 원본. 템플릿의 `documentation/`, 블로그 4종, `landing.html`, `version-2.html`, 아이콘 데모, `images/{blog,demo}` 는 가져오지 않았다.

## 내용 구성

| 섹션 | 내용 | 출처 |
|---|---|---|
| 프리로더 | 사이트명 `JSONTYPE`(2026-10-03, BROODEV 에서 변경) + 진행 바 | — |
| 히어로 | `JSONTYPE_`(2026-10-03 · R 없음 — GitHub 핸들 `jsontype`, R 은 이메일에만) · 역할 3줄 · 한 줄 소개 · OPEN FOR COLLABORATION · 연락하기 + GITHUB 버튼 | dev1 `WHOAMI_TEXT` |
| SELECTED WORKS (slick) | 대표 업적 3건 — Z사 AI 채용 · N사 결제 부정이용 방지 · C사 AI 교과서 | 스킬시트 |
| 업적 전체 (swiper 카드) | **15건** — 회사(익명)·분야·공헌도 (연도는 2026-10-03 제거) | dev2 `blog.html` |
| 하는 일 | WEB BUILD · GLOBAL SHIP · TEACH & SHARE + 세부 5줄씩 | dev1 `SERVICES` |
| 일하는 방식 | 설계 → 풀사이클 구현 → 배포·운영 3단계 | dev2 `blog-detail.html`(N사 상세) |
| ABOUT ME | 본인 흑백 초상(`about-portrait.jpg`, 느린 줌) + 소개 + 경력 6줄(연도 없음) | dev2 |
| TECH STACK | React·Next / Vue·Nuxt / TypeScript / GraphQL·Node / Cloud·CI/CD | dev1 `ORBITS` |
| FIELDS | 분야별 건수 (AI 5 · 핀테크 2 · 교육·공공 3 · 리걸 2 · HR 2 · 통신·모빌리티 2) | 업적 15건 집계 |
| IMPACT HIGHLIGHTS | 성과 인용 4건 (템플릿 testimonial 재활용 — 추천사 아님) | 스킬시트 |
| 숫자 | 프로젝트 15 · 웹앱 15 · 배출 개발자 10 | — |
| broodev 앱 | 15개 링크 3카드 (템플릿 pricing 재활용) | dev2 `#pricing` |
| FAQ | 5문항 | — |
| 연락 | 이름·이메일·메시지 → **EmailJS 송신**(2026-10-03, 아래 [연락 폼](#연락-폼--emailjs-2026-10-03)) · 소셜은 **GitHub 하나**(X·YouTube·LinkedIn 은 2026-10-03 제거 — 푸터·오프캔버스 모두) | dev1 `LINKS` |

**익명화 규칙:** dev2 와 동일 — 회사명은 이니셜 + 사(N사·Z사·S사 …), 같은 이니셜은 업종으로 구분. 회사를 특정하는 제품명·납품처 실명은 기능 설명으로 대체. Miidas·동료 개인사·연봉은 **제외**.

## i18n — 13개 언어 (2026-10-02)

- 언어: `en · ja · ko · zh · zh-Hant · th · es · fr · de · it · pt · ru · nl` (btc 앱과 동일). 헤더 우측 🌐 풀다운 순서는 **English · 日本語 · 한국어**, 그 아래 10개.
- 감지: `localStorage(home:lang)` → `?lang=` → `navigator.languages`(첫 매치, `zh-TW/HK` → zh-Hant) → **en**. `<link hreflang>` 13개는 head 에.
- 사전 [`assets/js/i18n-data.js`](assets/js/i18n-data.js)(`window.HOME3_I18N`, 언어당 **164키**(2026-10-03 `form_sending`·`form_sent`·`form_fail`·`about_portrait_alt` 추가), 세 언어 이상에서 키·`<br>`·`{name}`/`{mail}` 자리표시자가 같아야 함) + 런타임 [`assets/js/i18n.js`](assets/js/i18n.js). 마크업은 `data-i18n="key"`(텍스트) · `data-i18n-html`(`<br>` 포함 9개) · `data-i18n-aria-label` · `data-i18n-alt`(img alt — 새 키 없이 `feat*_name`·`tes*_name`·`field_*` 재사용). HTML 의 한국어 원문 = `ko` 사전값(폴백).
- **스크립트 순서가 중요**: `i18n.js` 는 jquery 바로 다음, `carousel.js`(slick/swiper 가 슬라이드를 복제)·`gsapAnimation.js`(SplitText 가 글자를 쪼갬) **보다 먼저** 실행된다. 그래서 언어 변경은 저장 후 `?lang=` 으로 **새로고침**한다(동적 교체 아님).
- 영어 대문자 디자인 라벨(SELECTED WORKS · ABOUT ME · TECH STACK · OPEN FOR COLLABORATION · MENU 등)과 브랜드·연도는 번역하지 않는다.
- 검증: `node -e` 로 키 동일성(13개 언어 × 163) + HTML 의 `data-i18n` 키가 전부 사전에 있는지 — 커밋 `feat(home3): 13개 언어 i18n` 메시지의 명령 참고.

## 연락 폼 — EmailJS (2026-10-03)

[`apps/voca/contact.html`](../../voca/contact.html) 과 **같은 EmailJS 계정·서비스·템플릿**을 쓴다(공개키 `u-DIwFmmMVFWrxJMX` · 서비스 `broodev_service` · 템플릿 `broodev_template` → 수신 `support@broodev.com`). SDK 는 `https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js`(index.html 하단, `main.js` 다음).

- 템플릿 파라미터는 포털·voca 와 동일 키: `subject`(`BROODEV에서 사용자 문의가 왔습니다. — 개발자 소개 · <이름>`, 한국어 고정 — 운영자용) · `kind`(`개발자 소개 (dev.broodev.com)`) · `name` · `email` · `reply_to` · `message` · `page` · `time`(JST) · `env`(OS·브라우저·화면 요약) · `ua` · `shots`(`(없음)`). `mail_subject` 번역은 mailto 폴백 제목에만 쓴다. 메일 레이아웃(템플릿 HTML)의 정본은 [`docs/emailjs-template.md`](../../../docs/emailjs-template.md).
- 송신 중 버튼 비활성 + `#form-status` 에 `form_sending` → 성공 `form_sent`(폼 리셋) / 실패 `form_fail`(폴백 주소 안내). 세 문구 모두 13개 언어.
- SDK 가 로드되지 않으면(광고 차단기·오프라인) 이전 방식대로 **mailto** 로 메일 앱을 연다.
- EmailJS 무료 플랜은 월 200통. 키는 공개키라 노출돼도 되지만, 남용되면 EmailJS 대시보드에서 도메인 허용 목록(dev.broodev.com · voca.broodev.com)을 켜면 된다.

## 모바일 — 프리로더 · 영상 (2026-10-02 수정)

**증상:** PC 는 정상인데 폰에서는 검은 화면(프리로더 사이트명만)만 보였다.
**원인(헤드리스 Edge + DevTools 프로토콜로 재현):** 템플릿 원본은 `window.load` 뒤에 GSAP 바 애니메이션을 돌리고 그 끝에야 프리로더를 지웠다. ① 히어로 `corridor.webm`(4 MB)·소개 `davies-video.mp4`(1.5 MB)가 `load` 를 수 초~수십 초 지연(1.5 Mbps 에뮬레이션에서 12초 뒤에도 DOM 파싱조차 미완), ② 캐시가 따뜻하면 반대로 jQuery ready 콜백보다 `load` 가 먼저 떠 핸들러가 영영 안 불림, ③ 백그라운드 탭·절전 모드에선 rAF 가 멈춰 GSAP 이 진행 안 됨.
**수정:**
- `gsapAnimation.js` `loader()`: DOM 준비 즉시 바 애니메이션 시작 + **2초 워치독**(`finishPreloader`, 멱등)으로 무조건 프리로더 제거 → `runAnimations()`(단계별 try/catch — 한 단계가 죽어도 `.effectFade` 표시 단계는 돈다) → `home3:ready` 이벤트.
- `index.html` 영상: `<video preload="none">` + `<source data-src>` — 히어로는 `home3:ready`(또는 2.5초) 뒤, 소개 영상은 뷰포트 400px 안에 들어올 때 src 를 넣어 재생. 히어로는 **`corridor.mp4`(H.264 1280×720 · 2.5 MB, ffmpeg-static 으로 변환)를 먼저**, `corridor.webm` 은 폴백 — 원본은 webm 을 `type="video/mp4"` 로 잘못 선언해 Safari/iOS 가 못 틀었다.
- 자가 치유: 4.5초 뒤에도 뷰포트 안 `.effectFade` 가 숨겨져 있으면 `html.fx-fallback` 으로 전부 표시.
- 검증(모바일 에뮬레이션 390×844, iPhone UA): 일반 회선·1.5 Mbps 모두 프리로더 제거 + 히어로 표시 + JS 예외 0. 실제 폰에서 한 번 더 확인할 것.

## 사진 (2026-10-03)

템플릿의 회색 플레이스홀더(`860x645` 같은 치수만 적힌 박스)였던 슬롯을 **AI 생성 이미지 24종**으로 교체했다. 스타일은 전부 동일 — 근검정 배경 · 포인트 컬러 `#07C42C` 그린 · 시네마틱 로우키 · 글자/로고/얼굴 없음(13개 언어라 이미지 안에 텍스트를 넣지 않는다). 가공은 System.Drawing(센터 크롭 → 리사이즈 → JPEG q84).

| 슬롯 | 파일 | 크기 | 내용 |
|---|---|---|---|
| 업적 전체 15건 카드 | `feature-1~15.jpg` | 1152×864 (4:3) | 업적별 콘셉트 1장씩(면접 AI 메시 · 카드+부정 노드 · 청진기+SOAP · 홀로그램 교과서 · 도장→전자서명 · 강의실 · 음성→자막 · 새싹 든 손 · 우산+막대 · 음주측정기 · 매칭 카드 · 미술관 QR · PCB 검사 · 5G 평면도 · 셔터 내린 상점가) |
| SELECTED WORKS | `work-1~3.jpg` | 860×645 | = `feature-1`·`2`·`4` (같은 프로젝트 = 같은 키 비주얼) |
| IMPACT HIGHLIGHTS | `tes-1~4.jpg` | 874×656 | = `feature-2`(N사)·`1`(Z사)·`13`(A사)·`6`(인재 교육). 4번째 슬라이드가 `tes-2` 를 재사용하던 것을 `tes-4` 로 분리 |
| 하는 일 | `service-1~3.jpg` · `service-mini-1~2.jpg` | 636×795 · 424×530 (4:5) | 워크스테이션 · 지구본 · 마이크/화이트보드. mini 는 **다음 카드의 미리보기**(gsapAnimation 이 mini 를 다음 메인으로 확대) → mini-1 = service-2, mini-2 = service-3 |
| FIELDS 플립 스트립 | `award-1~6.jpg` | 600×600 | 분야 순서대로 AI · 핀테크 · 교육·공공 · 리걸 · HR · 통신·모빌리티 |
| ABOUT ME 초상 | `about-portrait.jpg` | 864×1152 (3:4) | **본인 사진 2장 + 템플릿 영상 프레임을 참조해 생성한 흑백 프로필**(검정 터틀넥 · 시계 보는 포즈 · 안경). 템플릿의 `davies-video.mp4`(백인 모델, 1.5 MB) 를 대체 — 영상 생성은 불가해 정지 이미지 + CSS 켄 번즈(16초 1→1.08 줌, `prefers-reduced-motion` 시 정지). 사전 키 `about_portrait_alt` 추가(164 키) |

`alt` 는 한국어 원문 + `data-i18n-alt` 로 13개 언어 적용. 다시 만들 때는 같은 스타일 문구로 생성한 뒤 위 크기로 크롭하면 된다.

## 2026-10-03 (b) — 코딩카페 정리 · 연도 제거
- **YouTube CodingCafe1 전부 삭제**(코딩카페 폐업). 교육은 계속하므로 문구는 **"코딩 레슨 · 코딩 티처"** 로 — 하는 일 3(`svc3_desc`·`svc3_li1`) · IMPACT 4(`tes4_text`) · 숫자 3(`ind3_sub`) · FAQ 5(`faq5_a`) 13개 언어 재작성, 오프캔버스 `MENTOR · CODING LESSONS`, `404.html` 푸터·오프캔버스도 index 와 같이 GitHub 만.
- **실적 일람의 시기·연도 제거**: SELECTED WORKS 태그(`tag_z2`·`tag_c2` 의 연도, N사 `2023 – 2026` 버튼) · 업적 15건 카드의 연도(`.price` 블록 삭제) · IMPACT HIGHLIGHTS duty 앞의 기간(`tes1~4_duty`) · 경력 6줄의 `exp_year` · TECH STACK `SPA · SSR · 2019 –`. 소개문(`about_desc`)·분야 소개(`fields_desc`)·지표(`ind1_sub`)·FAQ(`faq2_a`)의 "2019년부터"도 13개 언어에서 제거(`ind1_sub` 는 `— 일본 현장` 으로 대체). "4년"·"1년 넘게" 같은 기간 길이 표현은 남김. dev1·dev2 도 동일 적용(dev2 는 `시기:` 항목·`fa-calendar` 메타·`연도별` 위젯 제거).

## 공유 썸네일 (OG)

`og-image.png`(1200×630) 은 [`scripts/og/gen_og.mjs`](../../../scripts/og/gen_og.mjs) 가 생성(`node scripts/og/gen_og.mjs dev3`). 메타태그는 `og:image` = `https://dev.broodev.com/og-image.png`(루트 재작성으로 `/dev3/og-image.png` 가 서빙됨) + `twitter:card=summary_large_image`. 카카오톡은 캐시가 오래가므로 갱신 뒤 https://developers.kakao.com/tool/clear/og 에서 지운다.

## 파일

| 경로 | 설명 |
|---|---|
| `index.html` | 원페이지 (상단 `<style>` 에 템플릿 보정 + 언어 풀다운 CSS + 폼 상태 + `fx-fallback`; 하단 인라인 스크립트에 EmailJS 폼(mailto 폴백) · 영상 지연 로드 · 자가 치유) |
| `404.html` | 같은 셸의 404 (Pages 커스텀 404 · dev 스위치가 404 로 반환) |
| `og-image.png` | 공유 썸네일 (생성: `scripts/og/gen_og.mjs`) |
| `assets/js/i18n-data.js`, `assets/js/i18n.js` | 13개 언어 사전(164키) · 감지/적용/풀다운 런타임 |
| `assets/css/` | bootstrap · swiper · slick · animate · odometer · `styles.css`(템플릿, 원본 `assets/scss/`) |
| `assets/js/` | jquery · bootstrap · swiper · slick · gsap 계열 · `carousel.js`(슬라이더 초기화) · `gsapAnimation.js`(프리로더 수정 포함) · `main.js`(시계·커서·카운터) |
| `assets/images/section/` | 작품·업적·하는 일·분야·하이라이트 사진 — **AI 생성(2026-10-03)**. `bg-service-1~3.jpg` 와 `blog-*`·`work-4~6`·`service-4~6`·`tes-v2-*`·`app-*`·`davies-main`·`hero-v2` 는 템플릿 잔여(미참조 다수) |
| `assets/images/item/`, `assets/images/video/` | 템플릿 배경 장식(다크·그린 추상 — 그대로 사용) · 영상(**교체 대상**): `corridor.mp4`(히어로, H.264) · `corridor.webm`(폴백) · `davies-video.mp4`(소개) |
| `assets/fonts/`, `assets/icon/` | 템플릿 폰트 · icomoon 아이콘 |

## 알려진 문제

- 연락 폼은 EmailJS(외부 서비스) 에 의존 — 월 200통 한도, SDK 차단 시 mailto 폴백.
- 히어로·소개 영상과 "하는 일" 배경 3장(운동화)은 템플릿 원본(사진은 교체 완료). **Cloudflare Pages 는 파일당 25 MiB 제한** — 히어로 원본(1600×900 VP8 26 MB)은 1280w VP9 3.9 MB webm + H.264 2.5 MB mp4 로 재인코딩했고, 미참조 영상 `wave-bg.mp4`(67 MB)·`nexbot.mp4`(29 MB)는 삭제. 25 MiB 를 넘는 자산을 넣으면 배포가 실패한다.
- 템플릿 디스플레이 폰트에 한글(및 일본어·태국어 등) 글리프가 없어 시스템 폰트로 폴백된다(`word-break: keep-all` 로 어절 단위 줄바꿈).
- 로고는 템플릿 아이콘 대신 인라인 SVG 텍스트 `Y`. 파비콘은 템플릿 것.
- OG 메타(og:title/description)는 한국어 고정. 언어별 OG 가 필요하면 btc 처럼 Pages Function(HTMLRewriter)으로 `?lang` 별 치환.

## 배포

`apps/dev` 전체가 Pages 프로젝트 `broodev-dev` 하나로 배포된다(Root `apps/dev`). 이 폴더는 `/dev3/` 로 미리보기되고, 현재 루트(/)에 떠 있다. 절차는 [`docs/deploy-cloudflare.md`](../../../docs/deploy-cloudflare.md) §2-B.
