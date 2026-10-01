# home1 (구 dev)

> **기술 스택:** React 18 UMD(CDN) + framer-motion UMD + `@babel/standalone@7`(브라우저 Babel) · Canvas 2D · 무빌드 정적. 분리형(`index.html` + `app.jsx` + `styles.css`). i18n 없음(한국어 단일), AdSense 없음.

`home.broodev.com/home1/`(구 dev.broodev.com · 루트 활성은 home3) — **개발자 소개 + 전체 앱 포털** (">_ COSMIC COMPILER" 스크롤 연출).

2026-10-01 `apps/dev` 의 내용을 `apps/home1` 로 **이동**했고(코드 무변경), 2026-10-02 홈 3종을 모으면서 `apps/home/home1` 로 다시 옮겼다. `apps/dev` 에는 공사중 페이지 + 404 만 남아 dev.broodev.com 은 공사중 안내를 서빙한다. 이 폴더의 `404.html` 은 터미널 테마 단독 페이지. `home2`(Photollax)·`home3`(Davies)가 다음 버전 홈(현재 활성 home3).

배포: `apps/home` 전체가 Pages 프로젝트 `broodev-home` 하나로 배포된다. 루트(/)에 띄울 홈은 [`../README.md`](../README.md)의 스위치(`../functions/_middleware.js` 의 `ACTIVE`), 이 폴더는 `/home1/` 로 미리보기. 절차는 [`docs/deploy-cloudflare.md`](../../../docs/deploy-cloudflare.md) §2-B.

## 파일

| 경로 | 설명 |
|---|---|
| `index.html` | 셸 + 크롤러용 정적 폴백 + 네이버 서치어드바이저 소유확인 메타(dev.broodev.com) |
| `app.jsx` | 앱 전체(섹션 6개: boot · whoami · stack · apps · services · ssh). `PROJECTS` 배열이 앱 포털 목록 |
| `styles.css` | 스타일 |
| `assets/` | `blackhole.webm`, `skills-bg.webm` (MIT, `LICENSE-assets.txt`) |
| `robots.txt`, 파비콘 4종 | SEO 정적 파일 |
