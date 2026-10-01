# home1 (구 dev)

> **기술 스택:** React 18 UMD(CDN) + framer-motion UMD + `@babel/standalone@7`(브라우저 Babel) · Canvas 2D · 무빌드 정적. 분리형(`index.html` + `app.jsx` + `styles.css`). i18n 없음(한국어 단일), AdSense 없음.

`home1.broodev.com`(미생성, 구 dev.broodev.com) — **개발자 소개 + 전체 앱 포털** (">_ COSMIC COMPILER" 스크롤 연출).

2026-10-01 `apps/dev` 의 내용을 `apps/home1` 로 **이동**했다(코드 무변경). `apps/dev` 에는 공사중 페이지 + 404 만 남아 dev.broodev.com 은 공사중 안내를 서빙한다. 이 폴더의 `404.html` 은 터미널 테마 단독 페이지. `home2`(Photollax 템플릿 기반 업적 포트폴리오)가 다음 버전 홈.

배포: 이 폴더는 아직 Pages 프로젝트가 없다. 살리려면 새 프로젝트 `broodev-home1`(Root `apps/home1`) 또는 `broodev-dev` 의 Root 를 `apps/home1` 로 — [`docs/deploy-cloudflare.md`](../../docs/deploy-cloudflare.md) §2-B 0번.

## 파일

| 경로 | 설명 |
|---|---|
| `index.html` | 셸 + 크롤러용 정적 폴백 + 네이버 서치어드바이저 소유확인 메타(dev.broodev.com) |
| `app.jsx` | 앱 전체(섹션 6개: boot · whoami · stack · apps · services · ssh). `PROJECTS` 배열이 앱 포털 목록 |
| `styles.css` | 스타일 |
| `assets/` | `blackhole.webm`, `skills-bg.webm` (MIT, `LICENSE-assets.txt`) |
| `robots.txt`, 파비콘 4종 | SEO 정적 파일 |
