# packages/seo — 검색 노출 공통 정책 · 공용 파일 (2026-10-10)

broodev 의 모든 공개 앱(포털 · btc + 코인 14종 · utils · voca · voca-tutorial · samurai · memo · excel · dev · 지역 패널)이 따르는 SEO 규칙과,
각 앱에 **복사해서** 쓰는 공용 파일 2개. 런타임 공유가 아니라 사본이다(앱마다 Pages 프로젝트가 따로라서). 원본만 고치고 `node scripts/seo-sync.mjs` 로 퍼뜨린다.

| 파일 | 복사 위치 | 역할 |
|---|---|---|
| `lang-suggest.js` | 앱 루트 `/lang-suggest.js` | 브라우저 언어가 기준 언어와 다르면 「이 페이지는 ○○로도 볼 수 있습니다 [보기] [×]」 바 |
| `seo-lang.js` | 앱 `functions/_lib/seo-lang.js` | `?lang=xx` 응답의 canonical·`<html lang>`·title·description·OG 를 그 언어로(서버 측) + `*.pages.dev` noindex |

```
node scripts/seo-sync.mjs          # 사본이 있는 앱 전부를 원본으로 갱신
node scripts/seo-sync.mjs --check  # 사본이 원본과 다르면 exit 1
node scripts/seo-sync.mjs --add <app> [--suggest] [--fn]   # 새 앱에 사본 추가
node scripts/seo-check.mjs ...     # 아래 규칙 검사(정적 · wrangler · 렌더)
```

## 왜 바꿨나 (2026-10-10 전수 점검)

- 표시 언어를 `navigator.languages` 로 자동 전환하고 있었다. 구글은 **미국 영어 환경**으로 렌더하므로 한국어가 기준인 루트가 **영어판으로 색인**됐다.
- 언어별 주소(`?lang=xx`)의 canonical 이 모두 루트를 가리켜 **hreflang 이 무효**였다(구글은 canonical 이 다른 주소의 hreflang 을 버린다).

## 규칙

### L1. 표시 언어 결정 — navigator 금지
`?lang=`(13개 중 하나, zh-TW/HK/MO → zh-Hant) → 앱 저장 키(사용자가 고른 언어) → **페이지 기준 언어**(정적 `<html lang>`).
`navigator.*` 는 표시 언어를 정하는 데 쓰지 않는다. 쓰는 곳은 `lang-suggest.js`(제안 바) 하나뿐.
→ 구글봇(저장값 없음 · en-US)이 보는 렌더 결과 = 원본 HTML 언어 = canonical 언어.
- **예외(지역 패널):** 기준 언어가 en 이고 13개 언어 밖의 지역어(greenland 의 da 등)만 navigator 로 고르는 것은 허용한다 —
  구글봇(en-US)은 그 지역어에 해당하지 않으므로 항상 기준 영어를 본다(이 규칙의 목적은 그대로). 그 줄에 `seo-allow-navigator` 표시를 단다(seo-check 가 건너뜀).
  진단 정보처럼 표시 언어와 무관한 navigator 사용도 같은 표시.

### L2. 언어 제안 바 — `lang-suggest.js`
`<script src="/lang-suggest.js" data-key="<앱 저장 키>" [data-json="1"] data-base="<기준 언어>" defer></script>` 를 `</body>` 앞에.
?lang 없음 · 저장값 없음 · 안 닫음 · 봇 아님 · 브라우저 언어(13개 중 첫 매치) ≠ 기준 언어일 때만 그 언어로 표시. [보기] = 같은 주소 + `?lang=xx` 로 이동 + 저장 키에 저장.

### L3. 언어별 주소와 서버 메타 — `seo-lang.js`
- 페이지 P(확장자 없는 정본 경로)마다 기준 언어 주소 = `P`, 나머지 12개 = `P?lang=xx`.
- 모든 버전의 **원본 HTML**(Pages Functions 가 응답 직전에 고침): canonical·og:url = **자기 자신**(기준 언어는 `?lang` 없는 주소),
  `<html lang>`(zh → `zh-Hans`), `<title>` · description · og:title/description · twitter:title/description = 그 언어, og:locale = 그 로캘.
- 번역되지 않은 구조화 데이터는 언어 버전에서 뺀다(FAQPage 등 화면 문구와 같아야 하는 것 — `data-ld="faq"` 표시 후 seo-lang 이 제거). 번역해서 갈아끼우면 더 좋다.
- 메타 값은 앱 사전(i18n 데이터)에서 **생성**한다(`functions/_lib/seo-meta.js`). 손으로 베끼면 화면 제목과 어긋난다 — `seo-check` 가 원본 메타와 렌더 제목을 비교.
- 새로 Functions 를 붙이는 앱은 `_routes.json` 으로 HTML 경로만 함수를 타게(자산 디렉터리 exclude) — 무료 요청 한도 절약. `/api/*` 가 있으면 계속 include.
- `*.pages.dev` 는 `X-Robots-Tag: noindex, nofollow`.

### L4. hreflang 묶음 (HTML 과 sitemap 이 같아야 함)
모든 버전의 `<head>` 에 같은 묶음: 기준 언어 → `P`, 다른 12개 → `P?lang=xx`, **x-default → 영어 버전**(`P?lang=en`, 기준 언어가 en 이면 `P`).
hreflang 값: `en ja ko zh-Hans zh-Hant th es fr de it pt ru nl`(zh 는 `zh-Hans`). 언어가 하나뿐인 앱(지역 패널 대부분)은 hreflang 을 두지 않는다.

### L5. sitemap.xml · robots.txt · 404
- sitemap: 색인할 모든 주소(기준 + `?lang=xx` 버전 각각 `<url>`) · 각 `<url>` 에 L4 와 같은 `xhtml:link` 전체 · `lastmod`(내용이 바뀐 날).
- robots.txt: `Sitemap: <origin>/sitemap.xml`. 색인할 경로를 Disallow 하지 않는다.
- 앱 루트에 `404.html`(없는 주소가 200 홈으로 응답하는 소프트 404 방지 — Pages 는 404.html 이 있으면 404 로 응답).

### L6. 페이지 골격
- 색인 페이지마다 보이는 정적 `<h1>` 1개(기준 언어 · 런타임 번역).
- title 은 대략 60자(라틴) / 35자(CJK) 이내, description 은 155자 / 90자 안팎 — 길면 검색 결과에서 잘린다.
- 내부 링크는 확장자 없는 정본 경로(`/privacy`, `.html` 아님 — 308 홉 제거). canonical 도 확장자 없이.
- JS 없이 읽히는 본문(`section.seo` 등)이 실제 화면 기능을 정확히 설명(다른 앱 복붙 금지 · 사실만).
