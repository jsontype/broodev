# dev1 (구 dev)

> **기술 스택:** React 18 UMD(CDN) + framer-motion UMD + `@babel/standalone@7`(브라우저 Babel) · Canvas 2D · 무빌드 정적. 분리형(`index.html` + `i18n.js` + `app.jsx` + `styles.css`). **13개 언어**(en·ja·ko·zh·zh-Hant·th·es·fr·de·it·pt·ru·nl — 2026-10-10), AdSense 없음.

`dev.broodev.com/dev1/`(구 dev.broodev.com · 루트 활성은 dev3) — **개발자 소개 + 전체 앱 포털** (">_ COSMIC COMPILER" 스크롤 연출).

2026-10-01 `apps/dev` 의 내용을 `apps/dev1` 로 **이동**했고(코드 무변경), 2026-10-02 홈 3종을 모으면서 `apps/dev/dev1` 로 다시 옮겼다. `apps/dev` 에는 공사중 페이지 + 404 만 남아 dev.broodev.com 은 공사중 안내를 서빙한다. 이 폴더의 `404.html` 은 터미널 테마 단독 페이지. `dev2`(Photollax)·`dev3`(Davies)가 다음 버전 홈(현재 활성 dev3).

배포: `apps/dev` 전체가 Pages 프로젝트 `broodev-dev` 하나로 배포된다. 루트(/)에 띄울 홈은 [`../README.md`](../README.md)의 스위치(`../functions/_middleware.js` 의 `ACTIVE`), 이 폴더는 `/dev1/` 로 미리보기. 절차는 [`docs/deploy-cloudflare.md`](../../../docs/deploy-cloudflare.md) §2-B.

## 파일

| 경로 | 설명 |
|---|---|
| `index.html` | 셸 + 크롤러용 정적 폴백 + 네이버 서치어드바이저 소유확인 메타(dev.broodev.com) |
| `i18n.js` | 13개 언어 사전(`D`, 키 57개) + 감지·저장. `<head>` 끝에서 동기 실행 → title·description·og·`<html lang>`(zh → `zh-Hans`) 갱신, `window.DEV1_I18N` 공개 |
| `app.jsx` | 앱 전체(섹션 6개: boot · whoami · stack · apps · services · ssh). `PROJECTS` 배열이 앱 포털 목록. 문구는 전부 `T('key')`, 빌드바 오른쪽 🌐 언어 풀다운(`LangMenu`) |
| `styles.css` | 스타일 |
| `assets/` | `blackhole.webm`, `skills-bg.webm` (MIT, `LICENSE-assets.txt`) |
| `404.html` | 터미널 테마 단독 페이지. 13개 언어 사전을 인라인 스크립트로 내장(외부 파일 없이 동작) |
| `robots.txt`, 파비콘 4종 | SEO 정적 파일 |

## 다국어

- 감지 순서는 dev3 와 같다: `localStorage['home:lang']` → `?lang=` → `navigator.languages` → `en`. 저장 키를 dev3 와 공유하므로 활성 홈을 바꿔 끼워도, 404 로 가도 언어가 유지된다.
- 풀다운에서 고르면 저장 후 `?lang=xx` 로 새로고침한다(스크롤 스크럽 연출이 모듈 상수를 읽으므로 다시 그리는 편이 안전).
- 사전 문법: `**굵게**` → `<b>`, `\n` → 줄바꿈(`app.jsx` 의 `rich()`). 문구를 고치면 13개 언어를 함께 고친다(키 누락 시 en → ko 순서로 폴백).
- 번역하지 않는 것: 브랜드·앱 이름(broodev · Y-Systems · BTC_SIGNAL …), 기술명, 터미널 연출용 영문(명령어 · 빌드 로그 · 챕터 라벨 · Ship/Solve/Scale · 서비스 모듈명 WEB BUILD 등 · 대형 장식 타이포 Contact·STACK) — 원래 한국어판에서도 영문 디자인 요소.
- 사람이 읽는 문구는 전부 번역: 히어로 칩 · 카운터 라벨 · 피날레 제목 · 이메일 복사 버튼 · 상태 줄 · OLD PORTFOLIO 링크 · 모바일 "+N more in orbit" · 캡션 꼬리(6 sections · 0 errors).
- 정적 HTML(크롤러·무JS)은 원문 한국어. 폴백 문단(`data-i18n`)은 `#root` 바로 뒤 인라인 스크립트가 즉시 번역한다(DOMContentLoaded 는 하단 CDN ~3MB 를 기다려 느린 회선에서 한국어가 보였음). 공유 썸네일(OG) 언어별 치환은 `functions/_middleware.js` 의 `OG3` 가 dev3 만 한다 — dev1 을 활성 홈으로 바꾸면 그쪽도 추가 필요.
- 일본어·중국어·태국어는 `.kr` 의 `word-break: keep-all` 을 `normal` 로 되돌린다(띄어쓰기 없는 문장 줄바꿈).
- 검증: `node scripts/i18n-scan.mjs --url http://127.0.0.1:<포트>/dev1/ --set qs:lang --set ls:home:lang --langs all --wait 6000` (404.html 도 같은 방식).
