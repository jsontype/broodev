# utils (구 megahouse)

> **기술 스택:** 순수 정적 HTML · Bootstrap 5.0.2 · jQuery · **ExcelJS 4.4.0 + PptxGenJS 4.0.1(CDN, 버전 고정)** · 자체 i18n(**ko · ja · en**, `js/i18n.js`) · SCSS(수동 컴파일). React·Babel·broodev 13개국어 체계·터미널 테마·AdSense **없음**. 서버 없음 — 전부 브라우저 안에서 처리.

`utils.broodev.com` — **업무 유틸 모음.** 일에 필요한 도구를 계속 추가하는 사이트(사이드바 그룹 "유틸" + 도구별 메뉴 항목). 2026-10-02 `megahouse` 에서 개명. 현재 도구 1개:

**사진 → 엑셀 · PPT 격자 배열.**
`1.jpg, 2.jpg, …` 를 올리면 파일명 순(숫자 인식: 1, 2, 10)으로 **선택한 용지 한 페이지에 가로×세로 개수대로** 배열한 `.xlsx` 또는 `.pptx` 를 바로 내려받는다. 페이지마다 강제 페이지 나눔(xlsx) / 슬라이드 1장(pptx).

| 설정 | 선택지 | 기본 |
|---|---|---|
| 포맷 | 엑셀(.xlsx) · 파워포인트(.pptx) | xlsx |
| 용지 | A4 · A3 · A5 · B4(JIS) · B5(JIS) · Letter · Legal | A4 |
| 방향 | 세로 · 가로 | 세로 |
| 가로 개수(앞 숫자) × 세로 개수(뒤 숫자) | 각 1~5 | 2×3 |
| 캡션 | 사진 아래 파일명 | 켬 |
| 이미지 최대 크기(긴 변) | 1200 · 1600 · 2400 · 원본 | 1600 |

설정은 `localStorage(mh:settings)` 에 저장된다(키 접두어 `mh:` 는 개명 전 그대로 — 저장된 설정·언어 호환).

구 `jsontype/y-systems` 레포 `apps/megahouse/`(AIZOX 템플릿의 AI Image Enhancer 화면)를 2026-10-01 통합한 뒤, 셸(사이드바·헤더·다크/라이트)만 남기고 본문을 이 앱으로 교체했다. 원래 있던 `wrangler.toml` 은 broodev 관례(Pages 대시보드 Root directory)에 맞춰 제거.

## 동작

1. 업로드(드래그&드롭 또는 선택, 여러 번 나눠 올려도 합쳐짐) → 파일명 자연 정렬 → 설정대로 페이지별 미리보기(용지 비율·격자 그대로, ×로 개별 제외)
2. 각 사진을 EXIF 회전 반영해 디코드 → 긴 변 기준 축소 → JPEG(PNG는 PNG 유지)
3. **공통 레이아웃** `layout({paper, orientation, cols, rows, caption})` 이 페이지/셀 치수(px@96dpi)를 계산하고, 두 빌더가 같은 좌표를 쓴다
   - **xlsx**: 열 `[셀][간격]…`, 행 `[이미지(서브행)][캡션][간격]…`. 이미지는 셀 안에 비율 유지(contain)·중앙, `nativeColOff/nativeRowOff`(EMU)로 정확 배치. `pageSetup` = 용지 코드·방향·여백 0.4in·가로 1페이지 맞춤(열폭 근사 오차 보호), 페이지마다 `rowBreaks`. **Excel 행 높이 상한(409.5pt)** 을 넘는 큰 셀(예: A3 1×1)은 이미지 행을 같은 높이의 서브행 여러 개로 쪼갠다
   - **pptx**: 슬라이드 크기 = 용지(인치), 페이지당 슬라이드 1장, 그림·캡션 텍스트를 같은 좌표(인치)에 배치
4. Blob 다운로드 (`photos-{가로}x{세로}-{날짜}.{xlsx|pptx}`, 입력한 이름의 확장자는 포맷에 맞춰 교정)

## i18n · 로고

- **언어 감지**: `localStorage(mh:lang)` → `?lang=` → `navigator.language`(일본어→ja, 한국어→ko, 그 외→en). 헤더 우측 🌐 풀다운(순서 **日本語 · 한국어 · English**)으로 바꾸면 저장된다.
- 마크업은 `data-i18n="key"`(텍스트) · `data-i18n-html`(드롭존처럼 태그 포함) · `data-i18n-title/placeholder/aria-label`(속성). 동적 문구(요약·페이지 라벨·버튼·상태)는 `app.js` 가 `MH_I18N.t()` 로 그리고, 언어가 바뀌면 `mh:lang` 이벤트로 다시 그린다. 세 사전의 키는 동일해야 한다(검증 스크립트가 확인).
- **로고**: 템플릿의 Aizox 로고를 **Y Systems** 텍스트 워드마크로 교체(2026-10-02 Y 마크 아이콘 제거, 텍스트만). 텍스트라 dark/light 는 CSS 변수(`--OnSurface`)로 자동 — `dark-light.js` 의 `#logo_header` 이미지 스왑은 요소가 없어 no-op. `images/logo/*.svg` 도 Y Systems 워드마크로 바꿔 둠(현재 미사용). `images/favicon.png` 와 CSS/SCSS 상단 템플릿 크레딧 주석은 그대로.
- **공유 썸네일(OG)**: head 에 `og:title/description/url/image` + `twitter:card=summary_large_image`. `og-image.png`(1200×630) 은 [`scripts/og/gen_og.mjs`](../../scripts/og/gen_og.mjs) 의 `utils` 설정으로 생성(`node scripts/og/gen_og.mjs utils`). 카카오톡 캐시는 https://developers.kakao.com/tool/clear/og 에서 지운다.
- **사이드바 그룹명**(`tools_heading`): 유틸 / ユーティリティ / Utils — 2026-10-02 'Megahouse Tools' 에서 사이트명(utils)에 맞춰 변경. 도구를 추가할 때는 `menu_app` 처럼 메뉴 항목 키를 하나씩 늘린다.
- **생성·다운로드 버튼은 오른쪽 설정 패널의 submit 하나뿐.** 미리보기 아래에 있던 `{fmt} 다운로드` 중복 버튼과 i18n `download` 키는 2026-10-02 제거(헷갈린다는 피드백).

## 파일

| 경로 | 설명 |
|---|---|
| `index.html` | 화면(템플릿 셸 + 앱 마크업 + 앱 전용 `<style>`) |
| `404.html` | 같은 셸의 404 페이지(ko/en/ja 정적) |
| `js/i18n.js` | ko·ja·en 사전(44키) + 감지 + `apply()`/`set()` (`window.MH_I18N`) |
| `js/photo-grid.js` | **핵심 로직** — `PAPERS`·`layout`·`pageCount`·`naturalCompare`·`buildWorkbook`·`buildPptx`(DOM 무관, Node 에서도 동작)·`readImage`(브라우저). UMD 라 `require()` 가능 |
| `js/app.js` | DOM 연결(설정·업로드·미리보기·생성·다운로드·언어 풀다운) |
| `css/`, `scss/`, `font/`, `icon/`, `images/`, `js/*.min.js` `main.js` `dark-light.js` | AIZOX 템플릿 자산 |

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
