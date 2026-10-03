# broodev

> **broodev는 Google AdSense 수익화를 목표로, 실제로 쓸모 있는 웹앱들을 한 도메인 아래 모아 운영하는 앱 포트폴리오 회사입니다.** (운영: **Y-Systems**)
>
> 각 앱은 `xxx.broodev.com` 서브도메인으로 배포되고, 부모 도메인 **broodev.com** 루트는 **전체 앱 포털**(`apps/home`)을 서빙합니다. 대표 앱(코인 시그널)은 **btc.broodev.com**, 개발자 소개는 **dev.broodev.com** (2026-10-03 전환 — [docs/deploy-cloudflare.md §1-D](docs/deploy-cloudflare.md)).
> **"양보다 질" — 이 원칙을 실제로 지킬 것.** 코인 15종을 템플릿 복제해 서브도메인에 뿌린 것이 AdSense 탈락의 직접 원인이었습니다.
> **같은 앱을 파라미터만 바꿔 복제하지 마세요.** 변형은 **한 앱 안의 옵션**(`?coin=`)으로 처리하고, 새 앱은 **본질적으로 다른 기능**일 때만 추가합니다.

![monorepo](https://img.shields.io/badge/monorepo-broodev-00ff9c) ![host](https://img.shields.io/badge/host-Cloudflare%20Pages-f38020) ![ads](https://img.shields.io/badge/monetize-AdSense-4285f4)

> **⚠ AdSense 심사 대응 (2026-07) — 2차: 코인 복제본 통합**
>
> 1차로 루트를 btc 앱으로 전환했으나 **또 “가치가 별로 없는 콘텐츠”로 탈락**했다. 원인은 루트가 아니라 **property 전체**였다:
> 코인 15종 앱이 **전부 2277줄, 서로 91% 동일**(코인 이름만 치환)한 채 **전부 `index,follow` + AdSense 게재** 상태로 서브도메인에 뿌려져 있었다.
> 이는 AdSense **“복제된 콘텐츠가 있는 화면”**(부가 가치 없이 복사된 콘텐츠)과 **“가치가 별로 없는 콘텐츠”** 에 정면으로 해당한다.
>
> **조치:** 코인 앱을 **루트 1개로 통합**했다.
> - 루트(`apps/btc`)에 **코인 선택기** 추가 → `broodev.com/?coin=eth` 로 15종 전부 서빙 (앱 1개가 전 코인 담당)
> - 코인 서브도메인 14개: **`noindex`** + **canonical→루트** + **AdSense 스크립트 제거** + sitemap 삭제 + 상호링크 제거
>   - ⚠️ `noindex` 는 *검색 색인* 지시일 뿐이라 그것만으로는 부족하다. AdSense 정책은 **광고가 게재되는 화면**에 적용되므로, **광고 재고에서 빼는 것(스크립트 제거)** 이 핵심이다.
> - 마무리 권장: Cloudflare에서 `<coin>.broodev.com` → `broodev.com/?coin=<coin>` **301 리다이렉트** ([docs/deploy-cloudflare.md](docs/deploy-cloudflare.md))
>
> 결과: 색인·광고 게재되는 코인 페이지가 **15개 → 1개(루트)**. 다음 단계는 **고유 원본 콘텐츠 보강**(방법론 해설·용어집·정기 논평)이다.

## 🧱 모노레포 구조

```text
broodev/
├─ apps/
│  ├─ home/       →  broodev.com (루트)              전체 앱 포털 — AIXOR 템플릿 · 헤더 Apps → 전체화면 카테고리 모달(5개+페이지네이션) · assets/js/catalog.js 가 앱 목록 (2026-10-03)
│  ├─ btc/        →  btc.broodev.com                  비트코인 매수 타이밍 시그널 (대표앱 · 2026-10-03 루트에서 이전)
│  ├─ <coin>/     →  <coin>.broodev.com               14종 코인 앱 (btc 복제 — scripts/gen_coin.py 로 생성 · 직접 수정 금지)
│  ├─ dev/        →  dev.broodev.com                  개발자 소개 3종을 Pages 프로젝트 하나로 — functions/_middleware.js 의 ACTIVE 가 루트에 띄울 홈 선택 (현재 dev3 · 구 home/home1·2·3)
│  │  ├─ dev1/                                       개발자 소개 + 앱 목록 (구 dev → home1 · 터미널 테마)
│  │  ├─ dev2/                                       업적 포트폴리오 (Photollax 템플릿 · 구 y-systems 레포 home/)
│  │  └─ dev3/                                       업적 포트폴리오 v3 (Davies 템플릿 · 13개 언어 · EmailJS) ← 현재 활성
│  ├─ admin/      →  admin.broodev.com                관리자(데이터 수집·운영) — Google SSO 단독 접근
│  └─ utils/      →  utils.broodev.com                업무 유틸 모음 (구 megahouse) — 현재: 사진 → 엑셀·PPT 격자 배열 다운로드 (구 y-systems 레포 apps/megahouse/)
├─ games/
│  └─ samurai/    →  samurai.broodev.com              사무라이 택틱스 2 (구 apps/games/st2 · 2026-10-02 이동 — Pages Root 는 games/samurai)
├─ packages/
│  └─ ui-terminal/   공통 "터미널/해킹" 테마(theme.css) — 모든 앱이 같은 룩 공유
├─ scripts/
│  ├─ gen_coin.py    코인 앱 생성기 (apps/btc → apps/<coin> 정밀 파라미터화)
│  ├─ coins.json     코인 14종 데이터(id·심볼·13언어 코인명)
│  ├─ og/gen_og.mjs  공유 썸네일(og-image.png 1200×630) 생성기 — 19개 사이트 설정 내장
│  └─ cdp-shot.mjs   실제 시간 렌더 검증 하니스(헤드리스 + DevTools 프로토콜 · 모바일/느린 회선 에뮬레이션)
└─ .github/workflows/   배포 파이프라인
```

## 📦 앱 목록

| 앱 | 도메인 | 설명 | 스택 | 상태 |
| --- | --- | --- | --- | --- |
| [home](apps/home/) | **broodev.com** (루트) | **전체 앱 포털** — 히어로·소개·카테고리·대표 앱·원칙·연락 + 헤더 `Apps (N)` → 전체화면 카테고리 모달(카테고리마다 앱 5개 + 페이지네이션). 앱 목록은 `assets/js/catalog.js` | 정적 HTML · AIXOR 템플릿 · jQuery · Bootstrap 5 · GSAP · AOS · EmailJS | 🟡 Root directory 전환 대기 |
| [btc](apps/btc/) | **btc.broodev.com** (2026-10-03 루트에서 이전) | 비트코인 공포·탐욕 지수 & 매수 타이밍 점수 (대표앱) | React 18 (CDN) · 무빌드 | 🟢 라이브 |
| 코인 14종 | ~~`<coin>.broodev.com`~~ → **`broodev.com/?coin=<coin>`** | eth·xrp·doge·bch·link·xlm·ltc·avax·shib·dot·pepe·grt·sand·mana — **루트 앱으로 통합됨**(코인 선택기). 서브도메인 복제본은 noindex·광고 제거 상태로 잔존, 301 예정 | React 18 (CDN) · 무빌드 | ⚪ 통합됨 |
| [voca](apps/voca/) | voca.broodev.com | 깜빡이 단어암기장 (CSV 자동 반복 암기·13개국어) | React 18 (CDN) · 무빌드 | 🟢 라이브 |
| [voca-tutorial](apps/voca-tutorial/) | voca-tutorial.broodev.com | 깜빡이 사용법 10단계 인터랙티브 튜토리얼 | React 18 (CDN) · 무빌드 | 🟡 배포 대기 |
| [dev](apps/dev/) | **dev.broodev.com** | **개발자 소개 3종을 한 프로젝트로** — `functions/_middleware.js` 의 `ACTIVE` 가 루트(/)에 띄울 홈을 고른다(현재 `dev3`). `/dev1/` `/dev2/` `/dev3/` 로 각각 미리보기(noindex). 구 `apps/home/home1·2·3`(2026-10-03 이동, home.broodev.com 폐기) | Pages Function 1개 + 정적 | 🟢 라이브(푸시 시 전환) |
| ├ [dev1](apps/dev/dev1/) | dev.broodev.com/dev1/ | 개발자 소개 + 앱 목록 (구 `dev` → `home1`) | React 18(CDN) · 정적 | — |
| ├ [dev2](apps/dev/dev2/) | dev.broodev.com/dev2/ | 양동화 업적 포트폴리오 — Photollax 템플릿 (텍스트 교체 완료, 사진은 템플릿 원본) — 구 y-systems 레포 `home/` | 정적 HTML · Bootstrap 3 · jQuery | — |
| └ [dev3](apps/dev/dev3/) | dev.broodev.com (루트 = 현재 활성) | 양동화 업적 포트폴리오 v3 — Davies 템플릿 (텍스트 교체 완료, 사진은 AI 생성, 프리로더·히어로 JSONTYPE, GitHub 버튼) | 정적 HTML · Bootstrap 5 · GSAP · Swiper · **13개 언어 i18n** · EmailJS · OG 썸네일 | — |
| [admin](apps/admin/) | admin.broodev.com | 데이터 수집·운영 관리자 | React 18(CDN) · Google Identity | 🟡 개발 중 |
| [samurai](games/samurai/) | samurai.broodev.com | 사무라이 택틱스 2 — 한 줄 전장 턴제 검술 로그라이크 (구 `apps/games/st2`, 2026-10-02 `games/samurai` 로 이동) | 자기완결형 · 13개국어 | 🟢 라이브 |
| [utils](apps/utils/) | utils.broodev.com | **업무 유틸 모음**(구 `megahouse`, 2026-10-02 개명 — 일에 필요한 도구를 계속 추가). 현재 도구: 사진 업로드 → 용지(A4·A3·A5·B4·B5·Letter·Legal)·세로/가로·가로×세로 각 1~5 격자로 배열한 엑셀(.xlsx) / 파워포인트(.pptx) 다운로드 (브라우저 내 처리) — 구 y-systems 레포 `apps/megahouse/` | 정적 HTML · Bootstrap 5 · jQuery · ExcelJS·PptxGenJS(CDN) · ko·ja·en | 🟡 배포 대기 |

### 🪙 코인 시그널 패밀리 (15종) — `scripts/gen_coin.py`
btc를 템플릿으로 **동일 구조·기능**의 코인 앱을 찍어낸다. 코인 추가/재생성:
```bash
python3 scripts/gen_coin.py eth          # 하나
python3 scripts/gen_coin.py all          # 전체(14종)
```
데이터는 [`scripts/coins.json`](scripts/coins.json)(id·Binance 심볼·13언어 코인명). 자기참조 URL·API·브랜드·티커·코인명·푸터 현재코인 마커를 **앵커 기반 정밀 치환**(공통 자매 푸터의 코인 링크열은 보호). 광고버전 `index.html`만 생성(member/·adsense/ 제외). ⚠ og 썸네일 PNG는 btc 것 복사 상태 → 코인별 재생성 필요(TODO).

## 🎨 공통 디자인

모든 앱은 [`packages/ui-terminal/theme.css`](packages/ui-terminal/theme.css) 의 **네온 그린 터미널 테마**(JetBrains Mono · 스캔라인 · 패널 · 터미널 · 반응형)를 공유해 일관된 룩을 가집니다. 새 앱은 이 테마를 복사해 시작합니다.

## 🚀 배포 (Cloudflare Pages)

레포 1개를 연결하고 **앱마다 Pages 프로젝트**를 만들어 각자 서브도메인에 배포합니다.

| Pages 프로젝트 | Root directory | 도메인 |
| --- | --- | --- |
| broodev (구 broodev-web) | **`apps/home`** ⭐(2026-10-03 포털로 전환 — 대시보드에서 Root directory 변경 필요) | broodev.com |
| broodev-btc | `apps/btc` (유일한 btc 배포) | btc.broodev.com |
| broodev-`<coin>` | `apps/<coin>` | `<coin>.broodev.com` (14종) |
| broodev-voca | `apps/voca` | voca.broodev.com |
| broodev-voca-tutorial | `apps/voca-tutorial` | voca-tutorial.broodev.com |
| broodev-dev | `apps/dev` (dev1·dev2·dev3 + 스위치 Function) | dev.broodev.com |
| ~~broodev-home~~ | ~~`apps/home`~~ | ~~home.broodev.com~~ 2026-10-03 폐기(삭제 또는 dev 로 301) |
| broodev-admin | `apps/admin` | admin.broodev.com |
| broodev-utils | `apps/utils` | utils.broodev.com |

> 모두 Cloudflare Pages 무빌드(정적) 배포. 자세한 절차는 [docs/deploy-cloudflare.md](docs/deploy-cloudflare.md).
> **코인 14종은 각각 Pages 프로젝트(Root `apps/<coin>`) + 커스텀 도메인 `<coin>.broodev.com` 을 수동 추가**해야 한다(코드는 준비 완료). AdSense는 도메인(broodev.com) 승인이 서브도메인까지 커버.

## 📁 앱 추가 규칙

1. `apps/<name>/` 폴더 생성, `packages/ui-terminal/theme.css` 복사.
2. **각 앱 `README.md` 최상단에 기술 스택을 명시한다.** (필수 규칙)
3. Cloudflare Pages에 프로젝트 추가 → `<name>.broodev.com` 연결.
4. AdSense `ads.txt`(루트) + 개인정보처리방침 링크 확보 후 사이트 승인 요청.

---

© Y-Systems · broodev
