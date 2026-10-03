# home — broodev.com 앱 포털 (2026-10-03)

**기술 스택:** 순수 정적 HTML/CSS/JS (무빌드) · AIXOR V1.0 템플릿(다크 · Arapey + Urbanist) · jQuery 3.7.1 · Bootstrap 5 bundle · GSAP + ScrollTrigger · split-type · AOS · jarallax · Line Awesome · EmailJS(브라우저 SDK v4) · 자체 `catalog.js`(앱 카탈로그 데이터) + `portal.js`(전체화면 카테고리 모달 · 페이지네이션 · 카운터 · 연락 폼). React·i18n·AdSense 스크립트 없음(루트 `ads.txt` 만 유지).

> **broodev.com 루트 = 이 포털.** 2026-10-03 부터 루트는 비트코인 앱(`apps/btc`)이 아니라 이 폴더를 서빙한다(Pages `broodev-web` Root directory → `apps/home`). 비트코인 정본은 **btc.broodev.com** 으로 이전. 개발자 소개 사이트(구 `apps/home/home1·2·3`)는 **`apps/dev`(dev.broodev.com)** 로 이동.

## 무엇인가
- `apps/` 안의 **모든 공개 앱을 카테고리별로 나열**하는 관문. 히어로·소개·카테고리·대표 앱·사이트맵(전체 앱)·연락 섹션으로 구성된 원페이지.
- 헤더의 **Apps (N)** · 사이드바 "전체 앱" · 히어로 "모든 앱 보기" · 카테고리 행 · 푸터 Apps 링크 등 `[data-open-apps]` 요소를 누르면 **화면 전체를 덮는 모달**(`#apps-modal`)이 열리고, 카테고리 카드가 격자로 나온다.
- 카테고리 카드 1장 = **앱 5개 + 페이지네이션**. 앱이 5개 이하라 1페이지로 끝나는 카테고리도 페이지네이션을 **비활성 상태로 표시**(`.is-single`, 버튼 전부 `disabled`) — 앱이 늘어나도 카드 높이가 흔들리지 않게 빈 행(`li.is-empty`)으로 5행을 채운다.
- 해시 딥링크: `/#apps` 전체 모달, `/#apps=crypto` 해당 카테고리로 스크롤·강조. 닫기: ✕ · Esc · 배경 클릭. 열려 있는 동안 포커스 트랩 + `body.apps-modal-open`(스크롤 잠금).

## 앱 추가 방법 (이 파일만 고치면 됨)
[`assets/js/catalog.js`](assets/js/catalog.js) 의 `APPS` 배열에 한 줄 추가:
```js
{ id: 'foo', cat: 'work', name: '푸 도구', en: 'FOO_TOOL', status: 'live', url: 'https://foo.broodev.com/', desc: '한 줄 설명' },
```
- `cat` 은 `CATEGORIES` 의 id 중 하나(`crypto` 코인 시그널 · `panel` 생활 인포패널 · `learn` 학습 · `work` 업무 도구 · `game` 게임 · `dev` 개발자). 새 카테고리는 `CATEGORIES` 에 `{ id, name, en, numeral }` 추가 — 모달·카테고리 섹션·카운터가 전부 데이터에서 그려진다.
- 코인 앱은 `coin(sub, ko, ticker, en)` 헬퍼로 한 줄. `featured: true` 를 주면 `BROODEV_CATALOG.featured` 에 들어간다(대표 앱 섹션의 카드 3장은 `index.html` 에 정적으로 박혀 있으니 바꾸려면 거기도 수정).
- 헤더 `Apps (N)`·히어로 문구의 "지금 N개"·소개 숫자(`[data-count]`)는 자동. **OG 썸네일의 "33 apps" 태그는 수동** — `scripts/og/gen_og.mjs` 의 `home` 항목을 맞추고 `node scripts/og/gen_og.mjs home` 재생성.
- `admin`(관리자, noindex)·`voca-backup` 같은 비공개/백업 앱은 넣지 않는다.

## 파일
| 경로 | 역할 |
| --- | --- |
| `index.html` | 원페이지 전체(히어로 · #about · #categories · #featured · #sitemap · #contact · 푸터 · 모달 마크업) · JSON-LD WebSite. `#sitemap` 은 2026-10-03 "원칙 4종"(템플릿 service 레이아웃) 섹션을 대체 — `portal.js` 가 카탈로그를 카테고리별로 **전부** 펼쳐 그린다(모달과 달리 페이지네이션 없음, CSS 3단 다단) |
| `assets/js/catalog.js` | `window.BROODEV_CATALOG = { categories, apps, total, languages, featured }` — **유일한 데이터 소스** |
| `assets/js/portal.js` | 카운터 채우기 · 카테고리 리스트 렌더 · 사이트맵 섹션 렌더(`#sitemap-list`) · 모달 빌드/페이지네이션(`PER_PAGE = 5`) · 열기/닫기/포커스 트랩 · 해시 라우팅 · EmailJS 연락 폼 |
| `assets/css/portal.css` | 템플릿 위에 얹는 포털 전용 스타일(워드마크 `.brand-mark` · `.nav-apps` · 모달 · 카드 · 페이지네이션 · 폼 상태 · 푸터 `.footer-legal`) |
| `assets/js/main.js` | 템플릿 JS(프리로더 · 커서 · 사이드바 · GSAP 리빌). web3forms 문의 블록만 제거 |
| `assets/css/style.css` `responsive.css` | 템플릿 원본 CSS(수정 없음) |
| `assets/images/featured-*.png` | 대표 앱 3종 카드(각 앱 og-image 1200×630 복사본): `btc` · `utils`(2026-10-03 사무라이 택틱스 2 → 업무 도구 모음으로 교체) · `voca`(2026-10-03 앱 기본 테마 BROODEV 에 맞춘 흑백 OG 로 교체 — `node scripts/og/gen_og.mjs voca` 뒤 복사) |
| `assets/images/contact.png` | 템플릿 원본 비주얼 — 확장자는 .png 지만 **AVIF 컨테이너**(브라우저 렌더 정상, 일부 도구는 못 읽음). `service1-4.png`·`service-icon1-4.svg`·`arrow-down.svg` 는 원칙 섹션과 함께 제거 |
| `404.html` | 템플릿 error-page 레이아웃 · "전체 앱 보기" → `/#apps` · 하단 `.footer-legal` 법적 링크 |
| `premium.html` | **전 앱 프리미엄 총람**(Stripe 심사용 판매 페이지) — 앱별 카드(`.plan-grid`, 가격은 `legal/biz.js` `PLANS.*` 에서 `data-price="utils.yearly"` 식으로 채움, 「準備中」 카드 `.soon`) · 공통 조건(税込 · 자동 갱신/해지 · 3대 · Stripe) · 「ご購入前にご確認ください」 · FAQ. ja/ko/en 3개 `<article data-lang-block>` |
| `legal/tokushoho.html` `terms.html` `privacy.html` `refund.html` | **Y Systems 전체 앱 공통 법적 문서**(일본어 正文 + ko·en) — 特定商取引法に基づく表記(개인사업자: 주소·전화 「請求があれば遅滞なく開示」, 氏名 표기, 등록번호 행은 자리표시자면 자동 숨김) · 利用規約 17조 · プライバシーポリシー(브라우저 내 처리 · Stripe/Cloudflare/Google(AdSense·Gmail)/EmailJS 위탁 · 코인 앱 외부 API · 보존 기간 · 개시 청구) · 返金・解約ポリシー. utils 등 각 앱은 여기로 링크만 건다 |
| `legal/biz.js` | **사업자 정보·앱별 가격의 정본**(`window.BIZ` 屋号 `Y Systems`·대표자·메일·`invoice_no`, `window.PLANS.{utils…}` name/url/yearly/lifetime). 앱 추가 시 `PLANS` 에 한 줄 + `premium.html` 카드 1장 |
| `legal/legal.js` `legal/legal.css` | 언어 전환(`?lang=` → `localStorage broodev:legal-lang` → 브라우저 언어) · `data-title/data-desc` 로 `<title>`·meta 교체 · `[data-biz]`/`[data-price]`/`[data-price-monthly]`/`[data-plan-url]` 채움 / 포털 다크 룩 위의 문서·표·플랜 카드 레이아웃 |
| `favicon.svg/.ico` `favicon-96x96.png` `apple-touch-icon.png` | 검정 라운드 사각 + 이탤릭 세리프 "b" |
| `robots.txt` `sitemap.xml` `og-image.png` `ads.txt` | 루트 도메인 보조 파일. `sitemap.xml` 은 루트 + `premium.html` + `legal/*` 4종. `ads.txt` 는 **루트 도메인에만 의미가 있어** 여기(루트)에 둔다(btc 것과 동일 pub ID) |

## 사업자 표기 · Stripe (2026-10-03)
- Stripe 계정의 **Business name = `Y Systems`(하이픈 없음) · Website = `https://broodev.com/`**. 포털이 사업 사이트이므로 심사가 보는 것(상품·税込 가격·特商法·약관·개인정보·환불·연락처)은 전부 여기 — `premium.html` + `legal/*` + 푸터 `.footer-legal`(사업자명·메일·법적 링크 5개). 헤더·사이드바에 「Premium」 메뉴. 절차는 [`docs/stripe-setup.md`](../../docs/stripe-setup.md).
- 앱에 프리미엄을 추가할 때(btc 등): Stripe 에 Product/Payment Link 추가 → `legal/biz.js` `PLANS` 에 항목 → `premium.html` 카드 → 해당 앱의 요금 페이지는 법적 링크를 `https://broodev.com/legal/…` 로. 계정·심사는 다시 하지 않는다.
- 표기 통일: 포털 전체 `Y Systems`(JSON-LD publisher 포함). 코인 앱·voca 공통 푸터의 `made by Y-Systems` 는 아직 옛 표기(별도 일괄 수정 대상).
- URL: Cloudflare Pages 가 `/premium.html` → `/premium` 으로 308 하므로 **canonical · og:url · sitemap · 외부에 적는 URL 은 확장자 없이**(`https://broodev.com/premium`, `/legal/tokushoho` …). 사이트 안 상대 링크는 로컬 서버(python http.server)에서도 열리게 `.html` 그대로 둔다(라이브에선 한 번 308).

## 연락 폼 — EmailJS
`portal.js` 하단. 설정값은 voca·dev3 와 동일(public key `u-DIwFmmMVFWrxJMX` · service `broodev_service` · template `broodev_template`). 전송 파라미터 `{ subject, kind: '포털 (broodev.com)', name, email, reply_to, message, page, time, env, ua, shots }` — 제목은 `BROODEV에서 사용자 문의가 왔습니다. — 포털 · <이름>`, `env` 는 OS·브라우저·화면 요약(2026-10-03). **메일 레이아웃은 EmailJS 대시보드 템플릿이 정하며 정본은 [`docs/emailjs-template.md`](../../docs/emailjs-template.md)**. SDK 로드 실패 시 `mailto:jsontyper@gmail.com` 으로 폴백. 상태는 `#result` 에 `is-sending / is-ok / is-err`.

## 템플릿에서 버린 것
`iconoir.css`(2.7 MB) · `all.min.css`(Font Awesome) · `mailer.php` · `documentation/` · 부속 페이지(about/blog/portfolio 등) · 회색 플레이스홀더 이미지(`fun-fact*.png` `award-bg*.png` → CSS 그라데이션으로 대체) · AIXOR 로고(텍스트 워드마크 `.brand-mark` 로 교체). 템플릿의 `.header-menu-wrap` 은 1440px 미만에서 메뉴를 숨기는데 포털에서는 `.nav-apps`(Apps 버튼)만 항상 보이게 예외 처리.

## 검증
```bash
node scripts/cdp-shot.mjs --url http://127.0.0.1:8766/apps/home/index.html --out /tmp/portal.png --wait 5000
node scripts/cdp-shot.mjs --url http://127.0.0.1:8766/apps/home/index.html --out /tmp/modal.png --wait 5000 --eval "BROODEV_openApps('crypto')"
node scripts/og/gen_og.mjs home
```
2026-10-03 헤드리스 확인: 데스크톱·모바일 히어로 렌더, 모달 6카드(코인 15개 → 3페이지 · 인포패널 12개 → 3페이지 · 나머지 1페이지 비활성 페이지네이션), JS 예외 0.

## AdSense 메모
루트가 "얇은 포털"이라 2026-07 "가치 없는 콘텐츠" 판정을 받았던 이력이 있다(`docs/adsense-compliance.md`). 2026-08-31 AdSense 추진은 중단 상태라 당장 심사 영향은 없지만, 재심사를 하게 되면 **루트가 다시 포털**이라는 점을 감안할 것 — 이 포털은 그때와 달리 소개·카테고리·대표 앱·사이트맵(앱 33종 전체 링크)·연락 섹션을 갖춘 콘텐츠형 페이지로 만들었다.
