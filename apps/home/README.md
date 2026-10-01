# home — home.broodev.com

홈 3종(`home1`·`home2`·`home3`)을 **Pages 프로젝트 하나**(`broodev-home`, Root directory `apps/home`)로 배포하고, **루트(/)에 어느 홈을 띄울지**는 [`functions/_middleware.js`](functions/_middleware.js) 의 `ACTIVE` 한 줄로 고른다. 현재 **`home3`**.

| 폴더 | 내용 | 스택 | 미리보기 |
|---|---|---|---|
| [`home1/`](home1/) | 개발자 소개 + 전체 앱 포털 (구 `dev`) | React 18 CDN · 터미널 테마 | home.broodev.com/home1/ |
| [`home2/`](home2/) | 업적 포트폴리오 — Photollax 템플릿 | 정적 · Bootstrap 3 · jQuery | home.broodev.com/home2/ |
| [`home3/`](home3/) | 업적 포트폴리오 v3 — Davies 템플릿 | 정적 · Bootstrap 5 · GSAP · Swiper | home.broodev.com/home3/ (= 루트) |

## 전환

1. `functions/_middleware.js` 의 `const ACTIVE = 'home3'` 를 `'home1'`·`'home2'` 로 바꿔 푸시 → 자동 재배포.
2. 커밋 없이 바꾸려면 Pages 대시보드 → `broodev-home` → Settings → Variables and Secrets → `HOME_ACTIVE` = `home2` (Production) → Deployments → Retry deployment. 환경변수가 상수보다 우선한다.

## 동작

- `/` 와 모든 하위 경로는 내부적으로 `/<ACTIVE>/…` 로 재작성된다(주소창 URL 은 그대로). 각 홈이 상대경로(`assets/…`)로 자산을 참조하므로 그대로 동작한다.
- `/home1/` `/home2/` `/home3/` 직접 접근은 그대로 서빙하되 `X-Robots-Tag: noindex, nofollow` (루트와 중복 콘텐츠 방지). `*.pages.dev` 도 noindex.
- 없는 경로 → 현재 홈의 `404.html` 을 상태 404 로 반환.
- 자산 서버의 디렉터리 리다이렉트(`/sub` → `/sub/`, `/index.html` → `/`)는 Location 에서 내부 접두어를 벗겨 돌려준다.
- 모든 요청이 Function 을 거친다(무료 플랜 10만 요청/일). 포트폴리오 트래픽엔 충분.

## 배포

Pages 프로젝트 `broodev-home` — Root directory `apps/home`, Build command 비움, Build output `.`. `apps/home/functions/` 는 Pages 가 자동 인식한다. Custom domain `home.broodev.com`, Build watch paths `apps/home/*`. 절차는 [`../../docs/deploy-cloudflare.md`](../../docs/deploy-cloudflare.md) §2-B.

## 새 홈 추가

`apps/home/home4/` 를 만들고(상대경로 자산 · 자체 `404.html`), `_middleware.js` 의 `HOMES` 에 `'home4'` 를 추가한다.
