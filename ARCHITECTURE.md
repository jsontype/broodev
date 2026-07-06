# broodev — 모노레포 아키텍처 가이드

> **이 문서 하나로 broodev 모노레포 전체를 이해할 수 있게 쓴 온보딩/구조 문서다.** (AI 에이전트·신규 기여자용)
> 깊은 설계 배경은 [`docs/new-app.md`](docs/new-app.md), 배포 절차는 [`docs/deploy-cloudflare.md`](docs/deploy-cloudflare.md) 참고.
> 마지막 갱신: 2026-07 · 운영: **Y-Systems**

---

## 0. 한눈에 (TL;DR)

- **broodev**는 Google AdSense 수익화를 목표로 **실사용 웹앱을 한 도메인 아래 모아** 운영하는 앱 포트폴리오다.
- **1 앱 = `apps/<name>/` 폴더 = Cloudflare Pages 프로젝트 1개 = 서브도메인 1개.**
- **무빌드 정적**: 빌드 단계가 **없다.** 각 앱은 CDN React 18 UMD + 브라우저 Babel(`@babel/standalone@7`)로 브라우저에서 JSX를 컴파일한다. `node_modules`·`package.json`·번들러 **없음**.
- 현재 **19개 앱**: `btc`(대표) + **코인 14종** + `voca`(단어암기장) + `voca-tutorial`(voca 사용법 튜토리얼) + `dev`(포털) + `admin`(관리자).
- **코인 앱 14종은 손으로 만들지 않는다** — `apps/btc`를 템플릿으로 [`scripts/gen_coin.py`](scripts/gen_coin.py)가 생성한다.
- **배포**: master 푸시 = Cloudflare Pages 자동 재배포(프로덕션).

### ⚠ 분석 전 반드시 알아야 할 것 (오해 방지)
1. **빌드 시스템이 없다.** `npm install`/`vite`/`webpack` 찾지 말 것. `apps/<name>/index.html`을 정적 서빙할 뿐.
2. **React는 `<script type="text/babel">` 안의 인라인 JSX**로 존재한다(별도 `.jsx`를 `src`로 부르기도 함). 트랜스파일은 **런타임 브라우저 Babel**이 한다.
3. **`apps/btc/index.html`은 ~2,240줄 단일 파일**에 스타일·i18n·로직이 전부 인라인이다(자기완결형). 큰 파일이라고 분리된 게 아니다.
4. **코인 앱(eth·xrp·…)은 btc의 복제본**이다. 직접 수정하지 말고 **btc(템플릿) 수정 → 재생성**한다(아래 §5).
5. **`node_modules` 없음** → import 그래프/의존성 분석 도구가 "의존성 없음"이라 보고해도 정상이다.

---

## 1. 무엇인가 (비즈니스 · 수익 모델)

- **제품군**: 각 앱은 “설치 없이 브라우저에서 바로 쓰는” 단일 목적 무료 도구. 현재는 **암호화폐 매수 타이밍 시그널** 계열이 중심.
- **수익**: Google AdSense (게시자 ID `ca-pub-5511225478572825`). 광고는 각 앱의 광고버전 페이지에 게재.
- **원칙(“양보다 질”)**: 스팸 양산 금지. 단, 코인 14종은 btc 복제라 **scaled-content(양산형 저품질) 리스크**가 있어 코인별 콘텐츠 실질 차별화가 후속 과제(§11).

---

## 2. 기술 스택 & 하드 제약

| 항목 | 내용 |
| --- | --- |
| 런타임 | 브라우저. 서버 로직은 Cloudflare Pages Functions(엣지)만 일부 사용 |
| UI | **React 18 UMD**(CDN unpkg) + **ReactDOM** + **`@babel/standalone@7`**(⚠ **@7 고정 필수** — v8 자동 업글 시 전 앱 흑화면) |
| 빌드 | **없음**(무빌드 정적). 출력 = 앱 폴더 그대로 |
| 스타일 | 공통 **네온 그린 터미널 테마** [`packages/ui-terminal/theme.css`](packages/ui-terminal/theme.css) 를 각 앱이 **복사**해서 사용(런타임 공유 아님) |
| 폰트 | JetBrains Mono / Share Tech Mono (Google Fonts) |
| 라우팅 | 해시 라우팅 SPA(`#/route`) |
| i18n | **13개국어** 자체 구현(§9) |
| 상태 | `useState`/`useEffect`/`useMemo`/`useRef` + `localStorage` 영속. 데이터는 클라이언트 fetch + 폴링 |
| 호스팅 | Cloudflare Pages(정적) + 일부 Pages Functions |
| 레포 공개 | **public**(pub ID·AdSense 코드는 공개돼도 안전) |

**하드 규칙(어기면 사고):**
- Babel은 반드시 `@babel/standalone@7`.
- **React 훅은 조건부 early-return 앞에 전부 호출**(로딩/게이트 화면도 훅 뒤 분기 금지) — 첫 로드 백지 사고 원인.
- 파비콘·robots·sitemap·ads.txt는 **실제 파일**로 둔다(`data:` URI 파비콘은 구글 검색결과 무시).
- 반응형 그리드는 `minmax(0, 1fr)` + 패널 `min-width:0`(안 그러면 모바일 우측 잘림).
- **커밋/푸시는 사용자 지시 시에만.** master push = 프로덕션 직행.

---

## 3. 디렉터리 구조

```text
broodev/
├─ ARCHITECTURE.md          ← (이 문서)
├─ README.md                프로젝트 개요 + 앱 목록 + 배포 표
├─ apps/
│  ├─ btc/                  ★ 대표앱·코인 템플릿 (자기완결형 단일 index.html)
│  │  ├─ index.html         앱 본체(스타일·i18n·6지표 로직·광고 전부 인라인, ~2,240줄)
│  │  ├─ seo-i18n.js        #root 바깥 정적 SEO 본문의 13언어 데이터+렌더러(window.renderSEO)
│  │  ├─ foot-i18n.js       공통 자매 푸터 코인명 13언어화(window.renderFooter, §8)
│  │  ├─ functions/_middleware.js  Cloudflare Pages Function: ?lang 별 OG 메타 현지화(HTMLRewriter)
│  │  ├─ member/index.html  프리미엄(광고 없음·noindex) 버전
│  │  ├─ adsense/index.html 고아 폴더(구 광고버전, 링크 안 됨) — 정리 대상 기술부채
│  │  ├─ privacy.html·terms.html   정적 정책 페이지(AdSense 필수)
│  │  ├─ og-image.png·og-en.png·og-ja.png·og-image.html   공유 썸네일
│  │  ├─ favicon.ico·favicon.svg·favicon-96x96.png·apple-touch-icon.png
│  │  └─ ads.txt·robots.txt·sitemap.xml·README.md
│  ├─ eth/ xrp/ doge/ bch/ link/ xlm/ ltc/ avax/ shib/ dot/ pepe/ grt/ sand/ mana/
│  │                        ← 코인 14종. btc 복제(gen_coin.py 생성). member/·adsense/ 없음.
│  ├─ voca/                 깜빡이 단어암기장 (자기완결형·13개국어·CSV·모바일 대응)
│  ├─ voca-tutorial/        voca 사용법 10단계 튜토리얼 (자기완결형·복제 아님·미니 데모)
│  ├─ dev/                  개발자 소개 + 전체 앱 포털 (분리형: index.html + app.jsx + i18n/)
│  │  ├─ index.html  app.jsx  theme.css  i18n.js  i18n/<lang>.js  foot-i18n.js  robots/sitemap/ads.txt
│  └─ admin/                운영 관리자 콘솔 (분리형, noindex, Google SSO, 광고 없음)
│     ├─ index.html  app.jsx  theme.css  i18n.js  robots.txt(Disallow: /)
├─ packages/
│  └─ ui-terminal/          공통 테마 원본
│     ├─ theme.css          네온 그린 터미널 테마 (각 앱이 복사해 사용)
│     └─ README.md
├─ scripts/
│  ├─ gen_coin.py           코인 앱 생성기 (apps/btc → apps/<coin> 정밀 파라미터화, §5)
│  └─ coins.json            코인 14종 데이터(id·Binance 심볼·13언어 코인명)
├─ docs/
│  ├─ new-app.md            설계 총정리 + 신규 앱 체크리스트(Part 1/2)
│  └─ deploy-cloudflare.md  Cloudflare Pages 배포 절차(앱별·AdSense 루트 전환 §1-B 포함)
└─ .github/
   └─ PULL_REQUEST_TEMPLATE.md
```

> 참고: `.github/workflows/`는 현재 없음(GitHub Pages 은퇴하며 삭제). 배포는 Cloudflare Pages Git 연동이 담당.

---

## 4. 앱 유형 (3가지 패턴)

| 유형 | 예 | 구성 | 언제 |
| --- | --- | --- | --- |
| **자기완결형** | `btc`, 코인 14종 | 단일 `index.html`에 스타일·i18n·로직 전부 인라인 | 단일 파일로 충분한 앱 |
| **분리형** | `dev`, `admin` | `index.html` + `app.jsx` + `theme.css` + `i18n.js` + `i18n/<lang>.js` | 규모 커지거나 다중 페이지 |
| **생성형** | 코인 14종 | 자기완결형 btc를 `gen_coin.py`가 복제·치환 | 동일 구조 반복(코인) |

**새 앱(비코인)은 보통 자기완결형 또는 분리형 중 선택**한다. 코인이 아니면 생성기를 쓰지 않는다.

---

## 5. 코인 생성 시스템 ★중요★

코인 앱(eth·xrp·…)은 **`apps/btc`의 복제본**이다. **개별 코인 파일을 직접 수정하지 말 것** — 재생성 시 덮어써진다.

- 데이터: [`scripts/coins.json`](scripts/coins.json) — 코인마다 `ticker`·`sub`(서브도메인)·`id`(CoinGecko)·`sym`(Binance)·`names`(13언어 코인명).
- 생성기: [`scripts/gen_coin.py`](scripts/gen_coin.py)
  ```bash
  python3 scripts/gen_coin.py eth          # 한 개
  python3 scripts/gen_coin.py eth xrp      # 여러 개
  python3 scripts/gen_coin.py all          # 전체(14종)
  ```
- 동작: `apps/btc`를 통째로 복사 → **앵커 기반 정밀 치환**:
  - API(`ids=bitcoin`, `BTCUSDT`, `coins/bitcoin/market_chart`, 응답키 `j['bitcoin']`)
  - 자기참조 URL(canonical·og·hreflang·JSON-LD·sitemap·robots·middleware) → `<sub>.broodev.com`
  - 브랜드(`BTC_SIGNAL`→`<TICKER>_SIGNAL`)·티커(`\bBTC\b`)·13언어 코인명
  - **공통 자매 푸터의 코인 링크열(`<nav class="foot-fam">`)은 보호구역** — 코인명 치환 제외, 현재 코인만 `.cur` 마커 스왑
  - `member/`·`adsense/`는 **복사 제외**(광고버전 `index.html`만)
  - `foot-i18n.js`·`ads.txt`·파비콘·og PNG는 **무치환 복사**

**코인 공통 로직을 바꾸려면 → `apps/btc`(템플릿)를 고치고 `gen_coin.py all` 재실행 → 커밋.**

> og 썸네일 PNG는 현재 전부 btc 복사본(TODO: 코인별 재생성). 소액코인(SHIB·PEPE) 가격은 `fmtUsd` 자릿수 적응형으로 처리됨.

---

## 6. 앱 상세

### 6.1 btc (대표앱 · 코인 템플릿) — `broodev.com` + `btc.broodev.com`
- **비트코인 공포·탐욕 지수 & 매수 타이밍 점수(0~100)** 대시보드.
- 데이터 출처: **CoinGecko**(가격·시총·365일 차트), **Binance**(24h 티커·일봉 klines), **Alternative.me**(공포·탐욕 지수, 시장 전체값).
- **6개 지표 합성**: 공포·탐욕 지수 · RSI(14) · MACD(12·26·9) · 마이어 배수(가격÷200일선) · 365일 고점 대비 낙폭 · 골든/데드 크로스(50/200 MA).
- 점수 5단계: **STRONG BUY · ACCUMULATE · NEUTRAL · CAUTION · OVERHEATED**.
- 탭: **단기(모멘텀 추세추종)** / **장기(역발상 사이클)**.
- 광고버전(루트, 색인·광고) ↔ `member/`(프리미엄, 광고·게이트 전무 + noindex) 2버전.
- `#root` 바깥 `<section class="seo">`(정적 SEO 본문+FAQ, 크롤러용) + 공통 자매 푸터.

### 6.2 코인 14종 — `<coin>.broodev.com`
btc와 **동일 구조**, 코인만 파라미터화. 목록:
`eth·xrp·doge·bch·link·xlm·ltc·avax·shib·dot·pepe·grt·sand·mana`.
공포·탐욕 지수는 시장 전체값이라 코인별 차별화는 **가격 기반 5개 지표**가 담당.

### 6.3 dev — `dev.broodev.com`
- **개발자 소개 + 전체 앱 포털**(구 `apps/web`, 리네임됨). 분리형(사이드바 SPA · 해시 라우팅).
- `app.jsx`의 `APPS` 배열이 15종 코인 앱 카탈로그(유용한 앱 목록). `#/about #/apps #/privacy #/terms` 등 라우트.
- ⚠ 정책 페이지는 **React 라우트**(`#/privacy`)이지 정적 파일이 아님(코인 앱과 다름).

### 6.4 admin — `admin.broodev.com`
- 운영 관리자 콘솔. **`noindex`**(robots `Disallow: /`), 광고 **없음**, **Google SSO**(운영자만).
- 분리형. 실제 데이터 수집/보안은 백엔드 필요(현재 클라이언트측 임시 보호).
- **자매 푸터/AdSense 태그를 넣지 않는다.**

---

## 7. 공통 테마 (`packages/ui-terminal/theme.css`)
네온 그린 터미널 미학: 다크 배경 `#05080a`, 액센트 `--neon:#00ff9c`, 스캔라인·비네트, 모노스페이스. 각 앱은 이 파일을 **복사**해서 쓴다(자기완결형은 인라인 사본). 원본을 고치면 각 앱 사본에도 반영 필요.

---

## 8. 공통 자매 푸터 + `foot-i18n.js`
- 모든 코인 앱 + `dev` 하단에 **정적 공통 푸터**(`#root` 바깥 → 크롤러 내부링크 + React 렌더에도 유지).
- `<nav class="foot-fam">`에 **BTC + 14코인 + ◈dev** 칩(상호링크). 현재 코인만 `.cur`. **admin은 미포함.**
- 카피라이트: `© 2026 broodev · made by Y-Systems`.
- **다국어**: [`foot-i18n.js`](apps/btc/foot-i18n.js)가 칩의 `data-coin`을 현재 언어 코인명(비트코인/Bitcoin/…)으로 치환. `<html lang>` 변경을 **MutationObserver**로 감지해 자동 반응(앱 코드 무수정). 무JS/크롤러는 정적 한국어 기본.
- ⚠ `foot-i18n.js`는 **15개 앱 공통 파일**(모든 코인 포함) — `gen_coin.py`가 무치환 복사한다.
- **비코인 앱을 추가하면** 이 코인 전용 푸터를 “코인 시그널 / 도구·학습” 구획으로 나눌지 결정 필요(§13).

---

## 9. i18n (13개국어)
언어: `en, ko, ja, zh, zh-Hant, th, es, fr, de, it, pt, ru, nl`. 우측 상단 🌐 드롭다운.
- `detectLang` 우선순위: `localStorage` → URL `?lang=` → `navigator.language` → `en` 폴백.
- **두 구성**:
  - 자기완결형(btc/코인): 인라인 번들 `T` + `seo-i18n.js`(하단 SEO 13언어) + `foot-i18n.js`(푸터).
  - 분리형(dev/admin): `i18n/<lang>.js` 파일 + `i18n.js` 코어.
- 언어 변경 시 앱이 `document.documentElement.lang = lang` 설정 + `window.renderSEO(lang)`/`window.renderFooter` 트리거.
- head에 hreflang 13개 alternate. 새 문자열 추가 시 13개 언어 동시 작성.

---

## 10. SEO 규칙
- **정적 크롤러 콘텐츠는 `#root` 바깥**에 둔다(React가 `#root`를 통째 교체하므로). btc/코인은 `<section class="seo">`.
- head 필수: 키워드 `<title>`·`meta description`(120~155자)·`keywords`·`robots`·`canonical`·OG·JSON-LD(`WebApplication`+`FAQPage`, FAQ 텍스트 일치).
- `sitemap.xml`(+lastmod)·`robots.txt`(+Sitemap)·파비콘 4종을 **실제 파일**로(SPA라 없으면 index.html 반환).

---

## 11. AdSense / 수익화
- pub ID **`ca-pub-5511225478572825`** 일관 사용.
- 광고 도메인 3종 연결: 인증 메타 + `ads.txt`(루트) + Auto Ads 스크립트.
- **AdSense는 도메인(broodev.com) 승인이 서브도메인까지 커버** → 코인별 재심사 불필요.
- **이력**: `broodev.com` 루트가 “가치 없는 콘텐츠”로 미충족 → **루트를 얇은 포털에서 btc 앱으로 전환** + 정적 `privacy.html`/`terms.html` + 게시자 푸터 추가. 재심사 대기.
- 🚫 금지: 광고 자동 새로고침·강제 시청 게이팅·스팸 앱 양산.

---

## 12. 배포 (Cloudflare Pages)
- **1 앱 = 1 Pages 프로젝트.** Root directory = `apps/<name>`, Build command 없음, 정적.
- **master 푸시 = 프로덕션 자동 재배포**(Automatic deployments). 브랜치 푸시 = Preview.
- 커스텀 도메인 연결 시 DNS(CNAME)는 Cloudflare가 자동 생성(도메인이 CF에 있음).

| Pages 프로젝트 | Root | 도메인 | 상태 |
| --- | --- | --- | --- |
| `broodev` (구 broodev-web) | `apps/btc` | **broodev.com** | 라이브(루트=btc로 전환됨) |
| `broodev-btc` | `apps/btc` | btc.broodev.com | 라이브 |
| `broodev-dev` | `apps/dev` | dev.broodev.com | 라이브 |
| `broodev-admin` | `apps/admin` | admin.broodev.com | 라이브 |
| `broodev-voca` | `apps/voca` | voca.broodev.com | 라이브 |
| `broodev-voca-tutorial` | `apps/voca-tutorial` | voca-tutorial.broodev.com | **미생성 — 수동 추가 필요** |
| `broodev-<coin>` | `apps/<coin>` | `<coin>.broodev.com` | **미생성(14종) — 수동 추가 필요** |

절차 상세: [`docs/deploy-cloudflare.md`](docs/deploy-cloudflare.md).

---

## 13. 새 서브도메인 앱 만들기 — 예: 단어암기장

> 다음 작업. **코인이 아니므로 `gen_coin.py`를 쓰지 않는다.** 손으로 스캐폴드한다.

**이름 후보(운영 결정)**: `voca`(한/일 “보카” SEO 강함, 추천) / `flash`(글로벌 플래시카드) / `word`(범용, 브랜드 약함). 폴더·서브도메인 슬러그 동일: `apps/<slug>` ↔ `<slug>.broodev.com`.

**스캐폴드 순서(요약, 상세는 [`docs/new-app.md`](docs/new-app.md) Part 2):**
1. `apps/<slug>/` 생성. 구조는 **자기완결형(단일 index.html)** 권장 — btc를 뼈대로 참고하되 코인 로직 제거, 단어암기(플래시카드·SRS) 로직으로 교체.
2. `packages/ui-terminal/theme.css` 스타일 재사용(인라인 사본).
3. **필수 하드 규칙 준수**: `@babel/standalone@7`, 훅 규칙, `minmax(0,1fr)`.
4. **13개국어** i18n + 🌐 + hreflang. 새 문자열 13언어 동시.
5. **SEO**: `#root` 바깥 `<section class="seo">`(단어암기 키워드+FAQ), head 메타·canonical(`https://<slug>.broodev.com/`)·JSON-LD(`WebApplication`)·`sitemap.xml`·`robots.txt`·파비콘 4종.
6. **AdSense**: 인증 메타 + `ads.txt` + Auto Ads(광고 앱일 때). 정적 `privacy.html`·`terms.html`.
7. **공통 푸터**: 현재 푸터는 코인 전용(`foot-fam`) → 비코인 앱이 생기므로 **푸터를 “코인 시그널 / 도구·학습” 구획으로 확장**할지 먼저 정한다. 정하면 btc 템플릿+`foot-i18n.js` 수정 후 `gen_coin.py all` 재생성으로 전 앱 반영.
8. **dev 포털 등록**: `apps/dev/app.jsx`의 `APPS` 배열 + 정적 폴백 목록에 새 앱 추가(내부링크 = SEO 권위).
9. **배포**: Cloudflare Pages 프로젝트 `broodev-<slug>`(Root `apps/<slug>`) + 커스텀 도메인 `<slug>.broodev.com`.
10. 커밋(사용자 지시 시 푸시). master 머지 = 자동 배포.

---

## 14. 함정 / 주의 (hard-won lessons)
| 함정 | 결과 | 대응 |
| --- | --- | --- |
| Babel 버전 미고정 | v8 자동 업글 → 전 앱 흑화면 | `@babel/standalone@7` 고정 |
| 조건부 early-return **뒤에** 훅 | 첫 로드 백지 | 훅을 분기 앞에 전부 호출 |
| 코인 앱 직접 수정 | 재생성 시 유실 | btc 템플릿 수정 → `gen_coin.py` 재실행 |
| `foot-fam` nav를 코인명 치환 대상에 포함 | 자매 링크 라벨 깨짐 | 생성기에서 nav 보호 유지 |
| `data:` URI 파비콘 | 구글 검색결과 미표시 | 실제 favicon 파일 |
| 그리드 `1fr` | 모바일 우측 잘림 | `minmax(0,1fr)` + `min-width:0` |
| 자동 커밋/푸시 | 버그 프로덕션 직행 | 사용자 지시 시에만 |
| 헤드리스로 렌더 검증 | CDN React/Babel 미실행 → 무효 | 정적 HTML 하니스 스크린샷 / 라이브 fetch로 검증 |

---

## 15. 빠른 참조 (어디에 뭐가 있나)
- 코인 공통 로직·UI → `apps/btc/index.html` (수정 후 `gen_coin.py all`)
- 코인 하단 SEO 본문 → `apps/btc/seo-i18n.js`
- 푸터·코인명 다국어 → `apps/btc/foot-i18n.js` (+ 각 앱 사본)
- 코인 추가/데이터 → `scripts/coins.json` + `scripts/gen_coin.py`
- OG 공유 현지화 → `apps/<app>/functions/_middleware.js`
- 포털 앱 목록 → `apps/dev/app.jsx` (`APPS` 배열)
- 공통 테마 → `packages/ui-terminal/theme.css`
- 배포 절차 → `docs/deploy-cloudflare.md`
- 설계 배경·체크리스트 → `docs/new-app.md`
