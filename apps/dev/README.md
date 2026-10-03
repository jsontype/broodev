# dev — dev.broodev.com (개발자 소개 사이트)

개발자 소개 사이트 3종(`dev1`·`dev2`·`dev3`)을 **Pages 프로젝트 하나**(`broodev-dev`, Root directory `apps/dev`)로 배포하고, **루트(/)에 어느 것을 띄울지**는 [`functions/_middleware.js`](functions/_middleware.js) 의 `ACTIVE` 한 줄로 고른다. 현재 **`dev3`**.

> 2026-10-03 — `apps/home/{home1,home2,home3,functions}` 를 통째로 이곳으로 옮기고 `dev1`·`dev2`·`dev3` 로 개명했다. 기존 `apps/dev` 의 공사중 페이지는 삭제. `apps/home` 은 이제 **포털**(broodev.com, AIXOR 템플릿)이다. 역할: **broodev.com = 포털(앱 목록)**, **dev.broodev.com = 개발자(@jsontype) 소개**.

| 폴더 | 내용 | 스택 | 미리보기 |
|---|---|---|---|
| [`dev1/`](dev1/) | 개발자 소개 + 전체 앱 포털 (구 `home1`, 그 전 `dev`) | React 18 CDN · 터미널 테마 | dev.broodev.com/dev1/ |
| [`dev2/`](dev2/) | 업적 포트폴리오 — Photollax 템플릿 (구 `home2`) | 정적 · Bootstrap 3 · jQuery | dev.broodev.com/dev2/ |
| [`dev3/`](dev3/) | 업적 포트폴리오 v3 — Davies 템플릿 (구 `home3`) | 정적 · Bootstrap 5 · GSAP · Swiper · 13개 언어 | dev.broodev.com/dev3/ (= 루트) |

## 전환

1. `functions/_middleware.js` 의 `const ACTIVE = 'dev3'` 를 `'dev1'`·`'dev2'` 로 바꿔 푸시 → 자동 재배포.
2. 커밋 없이 바꾸려면 Pages 대시보드 → `broodev-dev` → Settings → Variables and Secrets → `DEV_ACTIVE` = `dev2` (Production) → Deployments → Retry deployment. 환경변수가 상수보다 우선한다.

## 동작

- `/` 와 모든 하위 경로는 내부적으로 `/<ACTIVE>/…` 로 재작성된다(주소창 URL 은 그대로). 각 사이트가 상대경로(`assets/…`)로 자산을 참조하므로 그대로 동작한다.
- `/dev1/` `/dev2/` `/dev3/` 직접 접근은 그대로 서빙하되 `X-Robots-Tag: noindex, nofollow` (루트와 중복 콘텐츠 방지). `*.pages.dev` 도 noindex.
- 없는 경로 → 현재 사이트의 `404.html` 을 상태 404 로 반환.
- 자산 서버의 디렉터리 리다이렉트(`/sub` → `/sub/`, `/index.html` → `/`)는 Location 에서 내부 접두어를 벗겨 돌려준다.
- 모든 요청이 Function 을 거친다(무료 플랜 10만 요청/일). 포트폴리오 트래픽엔 충분.
- `apps/dev/` 루트에는 index.html 이 없다 — 루트에 둔 파일은 Function 이 `/<ACTIVE>/` 로 재작성하므로 도달하지 못한다. 파비콘·404 는 각 사이트 폴더 안에 둔다.

## 배포

Pages 프로젝트 `broodev-dev` — Root directory `apps/dev`(변경 없음), Build command 비움, Build output `.`. `apps/dev/functions/` 는 Pages 가 자동 인식한다(공사중 페이지 시절엔 Function 이 없었으므로 첫 배포에서 Functions 가 켜지는지 확인). Custom domain `dev.broodev.com`, Build watch paths `apps/dev/*`. 절차는 [`../../docs/deploy-cloudflare.md`](../../docs/deploy-cloudflare.md) §2-B.

## 새 사이트 추가

`apps/dev/dev4/` 를 만들고(상대경로 자산 · 자체 `404.html`), `_middleware.js` 의 `SITES` 에 `'dev4'` 를 추가한다.
