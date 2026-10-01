# dev (공사중 페이지)

> **기술 스택:** 순수 정적 HTML 2장(`index.html` 공사중 · `404.html`, 인라인 CSS·터미널 테마 토큰 사본) + 파비콘. React·i18n·AdSense **없음**.

`dev.broodev.com` — Cloudflare Pages `broodev-dev`(Root directory `apps/dev`)가 그대로 배포하는 **공사중(Under construction) 페이지**. 포털 내용은 2026-10-01 [`apps/home1`](../home1/) 로 이동했고, 이 폴더는 Pages 프로젝트를 깨뜨리지 않으면서 새 홈이 준비될 때까지 안내를 띄우려고 남겨 둔 것.

- `index.html` = 공사중 안내(200). `404.html` = 그 외 경로(Pages 가 루트 `404.html` 을 커스텀 404 로 사용).
- `naver-site-verification` 메타는 `index.html`(루트 200)에 있어 dev.broodev.com 소유확인이 유지된다. 두 페이지 모두 `noindex`.
- 코인 앱·voca 등 **41개 파일의 공통 푸터**(`made by Y-Systems ↗`, `◈ dev`, voca `다른 앱`)가 dev.broodev.com 을 가리킨다 → 전부 이 공사중 페이지로 온다. 그래서 broodev.com·voca·samurai 바로가기를 둠. 포털을 되살리려면 `broodev-dev` 의 Root directory 를 `apps/home1`(또는 `apps/home2`)로 바꾸거나 푸터 링크를 수정 — [`docs/deploy-cloudflare.md`](../../docs/deploy-cloudflare.md) §2-B.
