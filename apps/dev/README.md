# dev (404 스텁)

> **기술 스택:** 순수 정적 HTML 1장(`404.html`, 인라인 CSS·터미널 테마 토큰 사본) + 파비콘. React·i18n·AdSense **없음**.

`dev.broodev.com` — Cloudflare Pages `broodev-dev`(Root directory `apps/dev`)가 그대로 배포하는 **404 스텁**. 포털 내용은 2026-10-01 [`apps/home1`](../home1/) 로 이동했고, 이 폴더는 Pages 프로젝트를 깨뜨리지 않으려고 남겨 둔 것.

- Pages 는 루트 `404.html` 을 커스텀 404 페이지로 쓴다. `index.html` 이 없으므로 `/` 를 포함한 **모든 경로가 404 상태 + 이 페이지**.
- `naver-site-verification` 메타는 유지(dev.broodev.com 소유확인). 다만 루트가 404 라 네이버 재검증은 실패할 수 있다.
- ⚠ 코인 앱·voca 등 **41개 파일의 공통 푸터**(`made by Y-Systems ↗`, `◈ dev`, voca `다른 앱`)가 dev.broodev.com 을 가리킨다 → 지금은 전부 이 404 로 떨어진다. 그래서 페이지에 broodev.com·voca·samurai 바로가기를 둠. 포털을 되살리려면 `broodev-dev` 의 Root directory 를 `apps/home1`(또는 `apps/home2`)로 바꾸거나 푸터 링크를 수정 — [`docs/deploy-cloudflare.md`](../../docs/deploy-cloudflare.md) §2-B.
