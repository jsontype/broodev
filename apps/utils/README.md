# utils (구 megahouse)

> **기술 스택:** 순수 정적 HTML · Bootstrap 5.0.2 · jQuery · **ExcelJS 4.4.0(index) / PptxGenJS 4.0.1(pptx) — CDN, 버전 고정, 페이지마다 자기 것만 로드** · 자체 i18n(**13개 언어**, `js/i18n.js` — broodev 공통 언어 집합이지만 btc 식 런타임이 아니라 `data-i18n` 사전 방식) · EmailJS(문의 폼, CDN) · SCSS(수동 컴파일). React·Babel·터미널 테마·AdSense **없음**. 서버 없음 — 전부 브라우저 안에서 처리.

`utils.broodev.com` — **업무 유틸 모음.** 일에 필요한 도구를 계속 추가하는 사이트. 2026-10-02 `megahouse` 에서 개명.

## 「写真ならべ」 시리즈 (2026-10-03 앱 분리)

브랜드명 **写真ならべ**(ja) / **사진 나란히**(ko) / **Photo Layout**(en) — 13개 언어의 시리즈명은 i18n 키 `series`. **출력 형식 1개 = 앱 1개 = 페이지 1개**, 사이드바 첫 그룹(제목 = `series`)에 형식명만 짧게(Excel · PowerPoint · Illustrator · Photoshop — 고유명사라 번역 없음):

| 사이드바 | 페이지 | 공개 URL | 상태 |
|---|---|---|---|
| **X** Excel | `index.html` (`<body data-page="xlsx">`) | `https://utils.broodev.com/` | 무료 |
| **P** PowerPoint | `pptx.html` (`<body data-page="pptx">`) | `https://utils.broodev.com/pptx` | 무료 |
| **Ai** Illustrator | — (`li.menu-item.soon`, 클릭 불가 + 「준비 중」 태그) | — | 준비 중 — 프리미엄 예정 |
| **Ps** Photoshop | — (같음) | — | 준비 중 — 프리미엄 예정 |

둘째 그룹 「기타」(`menu_more`) = 「요금 · 프리미엄」·「문의 · 제안」. 형식 아이콘은 아이콘 폰트에 Excel·PPT 가 없어 글자 배지(`.pg-fmt-xlsx/-pptx/-ai/-psd`, `css/site.css`). `pptx.html` 은 `index.html` 의 복제로, 다른 곳은 **`data-page` · `<title>`/meta/OG/canonical/hreflang(`/pptx?lang=`) · JSON-LD · h4/intro 키(`heading_pptx`/`intro_pptx`) · 스크립트(PptxGenJS 만) · 사이드바 active** 뿐 — index 를 고치면 pptx 도 같이 고친다. `app.js` 는 `data-page` 로 `FORMAT` 을 고정하고(포맷 select 는 없어짐) 나머지 설정은 두 페이지가 `localStorage(mh:settings)` 를 공유한다. 각 페이지는 자기 라이브러리만 로드(index = ExcelJS, pptx = PptxGenJS).

**동작(두 앱 공통).** `1.jpg, 2.jpg, …` 를 올리면 파일명 순(숫자 인식: 1, 2, 10)으로 **선택한 용지 한 페이지에 가로×세로 개수대로** 배열한 `.xlsx` 또는 `.pptx` 를 바로 내려받는다. 페이지마다 강제 페이지 나눔(xlsx) / 슬라이드 1장(pptx).

| 설정 | 선택지 | 기본 |
|---|---|---|
| 용지 | A4 · A3 · A5 · B4(JIS) · B5(JIS) · Letter · Legal | A4 |
| 방향 | 세로 · 가로 | 세로 |
| 가로 개수(앞 숫자) × 세로 개수(뒤 숫자) | 각 1~5 | 2×3 |
| 캡션 | 사진 아래 파일명 | 켬 |
| 이미지 최대 크기(긴 변) | 1200 · 1600 · 2400 · 원본 | 1600 |

설정은 `localStorage(mh:settings)` 에 저장된다(키 접두어 `mh:` 는 개명 전 그대로 — 저장된 설정·언어 호환). 예전에 저장된 `format` 값은 무시된다(페이지가 형식을 정함).

구 `jsontype/y-systems` 레포 `apps/megahouse/`(AIZOX 템플릿의 AI Image Enhancer 화면)를 2026-10-01 통합한 뒤, 셸(사이드바·헤더·다크/라이트)만 남기고 본문을 이 앱으로 교체했다. 원래 있던 `wrangler.toml` 은 broodev 관례(Pages 대시보드 Root directory)에 맞춰 제거.

## 동작

1. 업로드(드래그&드롭 또는 선택, 여러 번 나눠 올려도 합쳐짐) → 파일명 자연 정렬 → 설정대로 페이지별 미리보기(용지 비율·격자 그대로, ×로 개별 제외)
2. 각 사진을 EXIF 회전 반영해 디코드 → 긴 변 기준 축소 → JPEG(PNG는 PNG 유지)
3. **공통 레이아웃** `layout({paper, orientation, cols, rows, caption})` 이 페이지/셀 치수(px@96dpi)를 계산하고, 두 빌더가 같은 좌표를 쓴다
   - **xlsx**: 열 `[셀][간격]…`, 행 `[이미지(서브행)][캡션][간격]…`. 이미지는 셀 안에 비율 유지(contain)·중앙, `nativeColOff/nativeRowOff`(EMU)로 정확 배치. `pageSetup` = 용지 코드·방향·여백 0.4in·가로 1페이지 맞춤(열폭 근사 오차 보호), 페이지마다 `rowBreaks`. **Excel 행 높이 상한(409.5pt)** 을 넘는 큰 셀(예: A3 1×1)은 이미지 행을 같은 높이의 서브행 여러 개로 쪼갠다
   - **pptx**: 슬라이드 크기 = 용지(인치), 페이지당 슬라이드 1장, 그림·캡션 텍스트를 같은 좌표(인치)에 배치
4. Blob 다운로드 (`{가로}x{세로}-{yyyymmdd}-{HHMMSSmmm}.{xlsx|pptx}`, 입력한 이름의 확장자는 페이지 형식에 맞춰 교정)

## i18n · 로고

- **13개 언어**(2026-10-03, ko·ja·en → 13): `en · ja · ko · zh(简体) · es · pt · fr · ru · de · it · th · zh-Hant(繁體) · nl` — broodev 공통 집합. **풀다운 순서 = `LANGS`**: English · 日本語 · 한국어 를 앞에, 나머지 10개는 **인터넷 사용자 수가 많은 순**(简体中文 · Español · Português · Français · Русский · Deutsch · Italiano · ไทย · 繁體中文 · Nederlands). 풀다운 `<ul id="pg-lang-menu">` 는 HTML 에서 비워 두고 `i18n.js` 가 `LANGS` 순서로 채운다(항목 `href="?lang=xx"` — 클릭은 JS 가 가로채고, 크롤러에는 hreflang 변형으로 가는 실제 링크).
- **언어 감지**: `localStorage(mh:lang)` → `?lang=`(`zh-TW`/`zh-HK`/`zh-Hant-*` → zh-Hant, `pt-BR` → pt) → `navigator.languages` 첫 매치 → **en**. 헤더 우측 🌐 풀다운으로 바꾸면 저장된다. `<html lang>` 은 zh 만 `zh-Hans` 로.
- 마크업은 `data-i18n="key"`(텍스트) · `data-i18n-html`(드롭존처럼 태그 포함) · `data-i18n-title/placeholder/aria-label`(속성). 동적 문구(요약·페이지 라벨·버튼·상태)는 `app.js` 가 `MH_I18N.t()` 로 그리고, 언어가 바뀌면 `mh:lang` 이벤트로 다시 그린다. **13개 사전의 키(77개)는 동일**해야 하고 `{n}` 같은 자리표시자·`_html` 키의 태그도 같아야 한다 — 검증은 임시 스크립트(사전을 vm 으로 평가해 키 집합·토큰·태그 비교 + HTML 의 `data-i18n*` 키가 전부 사전에 있는지)로, 새 문자열은 **13개 언어 동시 작성**.
- **`<title>`·meta description 은 `i18n.js apply()` 가 `<body data-page>` 로 고른다**: `title_xlsx/desc_xlsx`(index) · `title_pptx/desc_pptx`(pptx) · `title_pricing/desc_pricing` · `title_contact/desc_contact`, 없으면 공통 `title`/`meta_desc`. h4·소개문도 페이지별 키(`heading_xlsx/intro_xlsx`, `heading_pptx/intro_pptx`).
- **긴 문서(요금 페이지 본문)는 사전 키가 아니라 언어별 `<article data-lang-block="ja|ko|en">`** 로 두고 `site.js` 가 전환한다 — **그 외 10개 언어는 en 블록**을 보여 주고 메뉴·푸터·`<title>`·meta description 만 번역된다(`menu_pricing`·`menu_contact`·`foot_*`·`title_*`·`desc_*`). `[data-biz]` 값도 ja 외 언어는 `_en` 변형으로. 문의 폼(`contact.html`)은 짧은 라벨뿐이라 반대로 **전부 사전 키(`ct_*`)** 로 — placeholder 는 `data-i18n-placeholder`, 개인정보 안내문은 링크가 있어 `data-i18n-html`.
- **로고**: 템플릿의 Aizox 로고를 **Y Systems** 텍스트 워드마크로 교체(2026-10-02 Y 마크 아이콘 제거, 텍스트만). 텍스트라 dark/light 는 CSS 변수(`--OnSurface`)로 자동 — `dark-light.js` 의 `#logo_header` 이미지 스왑은 요소가 없어 no-op. `images/logo/*.svg` 도 Y Systems 워드마크로 바꿔 둠(현재 미사용). `images/favicon.png` 와 CSS/SCSS 상단 템플릿 크레딧 주석은 그대로.
- **공유 썸네일(OG)**: head 에 `og:title/description/url/image` + `twitter:card=summary_large_image`. `og-image.png`(1200×630) 은 [`scripts/og/gen_og.mjs`](../../scripts/og/gen_og.mjs) 의 `utils` 설정으로 생성(`node scripts/og/gen_og.mjs utils`). 카카오톡 캐시는 https://developers.kakao.com/tool/clear/og 에서 지운다.
- **사이드바 그룹명**: 첫 그룹 = 시리즈명 `series`(写真ならべ / 사진 나란히 / Photo Layout …), 둘째 = `menu_more`(その他 / 기타 / More …). 2026-10-02 의 「유틸」(`tools_heading`)·「사진 → 엑셀 · PPT」(`menu_app`) 키는 2026-10-03 앱 분리 때 제거. 새 출력 형식을 추가할 때는 `pptx.html` 처럼 페이지 복제 + `title_/desc_/heading_/intro_{fmt}` 키 4개 × 13 + 사이드바 항목(5개 HTML 모두) + sitemap/hreflang.
- **생성·다운로드 버튼은 오른쪽 설정 패널의 submit 하나뿐.** 미리보기 아래에 있던 `{fmt} 다운로드` 중복 버튼과 i18n `download` 키는 2026-10-02 제거(헷갈린다는 피드백).

## 프리미엄 판매(Stripe) — 2026-10-03

Stripe 계정의 사업 웹사이트는 **broodev.com**(포털) 하나다. 법적 문서(特定商取引法に基づく表記·利用規約·プライバシーポリシー·返金ポリシー)와 전 앱 프리미엄 총람은 **[`apps/home/legal/`](../home/legal/) · [`apps/home/premium.html`](../home/premium.html)** 에 한 벌만 두고, 이 앱에는 **판매 페이지 `pricing.html` 만** 있다(utils 안에 있던 4개 법적 페이지는 같은 날 broodev.com 으로 이전·삭제). 절차·링크는 [`docs/stripe-setup.md`](../../docs/stripe-setup.md).

| 페이지 | 내용 |
|---|---|
| `pricing.html` | 요금(무료 / 프리미엄 年額 / 買い切り, 税込) · 「ご購入前にご確認ください」(特商法 2022 최종확인화면 항목: 지불 시기·제공 시기·자동 갱신·해지·환불 — 링크는 전부 `https://broodev.com/legal/…`) · 기능 비교표 · FAQ. 구매 버튼은 `PLANS.*.checkout`(Payment Link) 이 비어 있으면 「準備中」 비활성 |

- **세 언어가 한 파일 안에** `<article data-lang-block="ja|ko|en">` 로 들어 있고 `js/site.js` 가 현재 언어 블록만 보인다. **일본어가 正文**. JS 없이도 ja 블록은 보인다.
- **사업자 정보·금액은 `js/biz.js`**(`window.BIZ`, `window.PLANS`) — 페이지는 `[data-biz="키"]`·`[data-price="yearly|lifetime"]`·`[data-price-monthly]`·`[data-plan="free_limits.photos"]`·`[data-checkout]`·`[data-portal]` 로 읽는다. **정본은 `apps/home/legal/biz.js`**(BIZ + `PLANS.utils`) — 屋号 `Y Systems`(하이픈 없음)·소재지·메일·금액을 두 파일과 Stripe Price 세 곳에서 같게 유지한다. **운영자 氏名·주소·전화는 어디에도 싣지 않는다**(「個人事業主 — 請求があれば遅滞なく開示」).
- 모든 페이지(index·404 포함) 하단에 `.pg-foot` 법적 링크 6개(요금 → 로컬 `pricing.html`, 特商法·약관·개인정보·환불 → `broodev.com/legal/*`, 문의 → 로컬 `contact.html`). 사이드바 메뉴에 「料金 · プレミアム」·「お問い合わせ · ご提案」. 공통 CSS 는 `css/site.css`(index 의 인라인 로고·언어 풀다운·`.pg-select/.pg-input` CSS 도 여기로 이동).

## 문의 · 제안 폼 — `contact.html` (2026-10-03)

사이드바 「기타」 그룹의 ✉ 「문의 · 제안」(「요금」 아래) → 종류(버그 신고 / 개선 제안 / 기타 문의) · 이름(선택) · 이메일(선택) · 내용 → **EmailJS** 로 운영자 메일(`jsontyper@gmail.com`)에 전달. 포털·dev3·voca 와 **같은 서비스·템플릿·변수 규격**(`broodev_service` / `broodev_template`, 정본 [`docs/emailjs-template.md`](../../docs/emailjs-template.md)) — `kind: 'utils (utils.broodev.com) · 버그 신고'` 식, 제목은 `BROODEV에서 사용자 문의가 왔습니다. — 🚨 utils 버그 신고 · 이름`, `env` 끝에 UI 언어. 이메일이 유효하면 `reply_to` 로 넣어 Gmail 에서 바로 답장. SDK 미로드(광고 차단기)면 `mailto:` 폴백. 내용이 비면 `ct_need_msg`, 성공 `is-ok`/실패 `is-err` 상태 문구는 i18n. 페이지는 `noindex`(검색 유입 불필요). EmailJS 대시보드에서 도메인 허용 목록을 쓰는 경우 `utils.broodev.com` 추가 필요.
- 무료/프리미엄 기능 분리(무료: 1회 20장 · A4·Letter · 3×3 · 1600px)는 **페이지에만 적혀 있고 앱에는 아직 미적용** — 판매 개시 시점에 `app.js` 에 제한 + 라이선스 확인(Pages Functions + KV)을 넣는다.

## 파일

| 경로 | 설명 |
|---|---|
| `index.html` | **写真ならべ Excel** 앱(`data-page="xlsx"`, ExcelJS) — 템플릿 셸 + 앱 마크업 + 앱 전용 `<style>` |
| `pptx.html` | **写真ならべ PowerPoint** 앱(`data-page="pptx"`, PptxGenJS) — index 의 복제(차이는 위 절) |
| `404.html` | 같은 셸의 404 페이지(ko/en/ja 정적, 사이드바도 정적) |
| `pricing.html` | 프리미엄 요금·판매 페이지(위 표) — 같은 셸, `js/site.js` 로 언어 전환. 법적 문서는 broodev.com/legal/ |
| `contact.html` | 문의·제안 폼(위 절) — 같은 셸 + `js/contact.js` + EmailJS SDK(CDN) |
| `js/i18n.js` | 13개 언어 사전(77키 × 13) + 감지 + `apply()`(`data-page` 별 title/meta 포함)/`set()` + 풀다운 항목 생성 (`window.MH_I18N`) |
| `robots.txt`, `sitemap.xml` | 크롤러용 실제 파일 — sitemap 은 `/` · `/pptx` · `/pricing` 세 URL 에 13개 `xhtml:link hreflang` 변형(`?lang=`) 포함, contact 는 `noindex` 라 제외 |
| `js/biz.js` | 이 앱의 사업자 정보·요금(`BIZ` · `PLANS`) — 정본 `apps/home/legal/biz.js` 와 값 일치. `PLANS.*.checkout` 에 Payment Link 를 넣으면 구매 버튼 활성 |
| `js/site.js` | pricing·contact 공통: 언어 풀다운 · `data-lang-block` 전환 · `data-biz`/`data-price`/`data-checkout` 채움 (title/meta 는 i18n.js 가) |
| `js/contact.js` | 문의 폼 송신(EmailJS → 운영자 메일, mailto 폴백, i18n 상태 문구) |
| `js/photo-grid.js` | **핵심 로직** — `PAPERS`·`layout`·`pageCount`·`naturalCompare`·`buildWorkbook`·`buildPptx`(DOM 무관, Node 에서도 동작)·`readImage`(브라우저). UMD 라 `require()` 가능 |
| `js/app.js` | DOM 연결(설정·업로드·미리보기·생성·다운로드·언어 풀다운) — index·pptx 공용, 형식은 `body[data-page]` 로 고정 |
| `css/site.css` | 공통(로고 워드마크 · 언어 풀다운 · 사이드바 형식 배지 `.pg-fmt-*`/준비 중 `.menu-item.soon`·`.pg-soon-tag` · 폼 컨트롤 `.pg-select/.pg-input` · 문의 폼 `.pg-form` · `.pg-foot` · `.pg-doc` 문서 레이아웃 · 요금 카드 · 비교표 · FAQ) — 템플릿 CSS 변수만 써서 dark/light 자동 |
| `css/`, `scss/`, `font/`, `icon/`, `images/`, `js/*.min.js` `main.js` `dark-light.js` | AIZOX 템플릿 자산 |

## SEO (2026-10-03) — 화면에는 안 보이는 신호만

숨긴 텍스트 블록(display:none 키워드)은 Google 스팸 정책 위반이라 쓰지 않는다. 대신 전부 `<head>`·실제 파일로:

- `index.html`(Excel) · `pptx.html`(PowerPoint) head: `<title>`·`meta description`(i18n 이 언어별·페이지별 키로 교체) · `robots`(index,follow,max-image-preview) · `keywords`(한·일·영, 형식별) · `canonical`(`/` · `/pptx`) · **hreflang 13개 + x-default**(`?lang=xx`, pptx 는 `/pptx?lang=xx`) · OG(`og:locale` + alternate 12개) · Twitter 카드 · **JSON-LD `WebApplication`**(페이지별 name/description, 무료 Offer ¥0 · `featureList` 7개 · `inLanguage` 13 · publisher Y Systems · isPartOf broodev · `isRelatedTo` 로 서로 연결).
- `pricing.html` head: robots · canonical `/pricing` · hreflang 13 · **JSON-LD `FAQPage`**(화면의 일본어 FAQ 8문답과 같은 텍스트 — 본문을 고치면 같이 고친다).
- `contact.html`: `noindex, follow` (검색 유입 불필요).
- `robots.txt`(Allow all + Sitemap) · `sitemap.xml`(위 표). 공개 URL 은 확장자 없이(`/pricing`).
- 본문 자체가 크롤 가능한 HTML(React 없음)이라 별도 SEO 섹션은 두지 않는다. Googlebot 은 보통 `en-US` 로 렌더하므로 영어 사전이 색인 기준, `?lang=` 변형이 hreflang 으로 묶인다.
- **Search Console 등록은 `broodev.com` 도메인 속성 하나**(Cloudflare DNS TXT 인증)로 모든 서브도메인을 덮고, 각 호스트의 sitemap URL 을 따로 제출한다 — 절차는 아래 「배포」.

## 검증

브라우저 렌더 없이도 핵심 로직은 Node 로 검증할 수 있다(ExcelJS·PptxGenJS 는 devDependency 로 두지 않으므로 임시 폴더에서):

```bash
mkdir /tmp/pg && cd /tmp/pg && npm i exceljs pptxgenjs
node -e "const PG=require('<repo>/apps/utils/js/photo-grid.js'),X=require('exceljs'),P=require('pptxgenjs');
const img={name:'1.jpg',base64:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',extension:'png',width:1600,height:1200};
const o={paper:'A3',orientation:'landscape',cols:3,rows:2,caption:true};
PG.buildWorkbook(X,[img],o).xlsx.writeFile('out.xlsx').then(()=>PG.buildPptx(P,[img],o).write({outputType:'nodebuffer'})).then(b=>{require('fs').writeFileSync('out.pptx',b);console.log('ok')})"
```

검증 스크립트(용지×방향×격자 전 조합 유효성, xlsx 열폭/행높이/서브행/페이지설정/나눔/앵커, pptx 슬라이드 크기/개수/그림 위치)는 세션 스크래치 `test-photo-grid.js` 참고.

## SCSS 컴파일

```
sass scss/app.scss css/styles.css --watch
```

## 배포

Cloudflare Pages 프로젝트 `broodev-utils` — Root directory `apps/utils`, 빌드 없음, output `.`, Custom domain `utils.broodev.com`. 절차는 [`docs/deploy-cloudflare.md`](../../docs/deploy-cloudflare.md) §2-B.

**Google 검색 등록(Search Console)** — 도메인 속성 1개로 전 서브도메인 커버:
1. https://search.google.com/search-console → 속성 추가 → **도메인** → `broodev.com` → 계속
2. 표시된 TXT 값(`google-site-verification=…`) 복사
3. Cloudflare 대시보드 → broodev.com → **DNS → Records → Add record**: Type `TXT` · Name `@` · Content 붙여넣기 → Save
4. Search Console 로 돌아와 **확인**(몇 분 안에 통과)
5. 좌측 **Sitemaps** → `https://utils.broodev.com/sitemap.xml` 제출 (같은 화면에서 `https://broodev.com/sitemap.xml` 등 호스트별로 각각)
6. **URL 검사** → `https://utils.broodev.com/` → **색인 생성 요청** (`/pptx` · `/pricing` 도). 첫 색인은 보통 수일.
7. (선택) Bing: https://www.bing.com/webmasters → 「Google Search Console 에서 가져오기」 한 번이면 끝.
