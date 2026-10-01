# megahouse

> **기술 스택:** 순수 정적 HTML · Bootstrap 5.0.2 · jQuery · **ExcelJS 4.4.0(CDN, 버전 고정)** · 자체 i18n(**ko · ja · en**, `js/i18n.js`) · SCSS(수동 컴파일). React·Babel·broodev 13개국어 체계·터미널 테마·AdSense **없음**. 서버 없음 — 전부 브라우저 안에서 처리.

`megahouse.broodev.com` — **사진 → 엑셀 2×3 배열.**
`1.jpg, 2.jpg, …` 를 올리면 파일명 순(숫자 인식: 1, 2, 10)으로 **A4 세로 한 페이지에 2열×3행**으로 배열된 `.xlsx` 를 바로 내려받는다. 7장이면 2페이지(6 + 1), 페이지마다 강제 페이지 나눔.

구 `jsontype/y-systems` 레포 `apps/megahouse/`(AIZOX 템플릿의 AI Image Enhancer 화면)를 2026-10-01 통합한 뒤, 셸(사이드바·헤더·다크/라이트)만 남기고 본문을 이 앱으로 교체했다. 원래 있던 `wrangler.toml` 은 broodev 관례(Pages 대시보드 Root directory)에 맞춰 제거.

## 동작

1. 업로드(드래그&드롭 또는 선택, 여러 번 나눠 올려도 합쳐짐) → 파일명 자연 정렬 → 페이지별 2×3 미리보기(×로 개별 제외)
2. 각 사진을 EXIF 회전 반영해 디코드 → 긴 변 기준 축소(기본 1600px, 선택 1200/2400/원본) → JPEG(PNG는 PNG 유지)
3. ExcelJS 로 워크북 생성: 열 `[셀][간격][셀]`, 행 `[이미지][캡션][간격]`×3 / 페이지. 이미지는 셀 안에 비율 유지(contain)·중앙 정렬, `nativeColOff/nativeRowOff`(EMU)로 정확히 배치
4. `pageSetup`: A4 세로, 여백 0.4in, 가로 1페이지 맞춤(열폭 근사 오차 보호), 페이지마다 `rowBreaks`
5. `.xlsx` Blob 다운로드

## i18n · 로고

- **언어 감지**: `localStorage(mh:lang)` → `?lang=` → `navigator.language`(일본어→ja, 한국어→ko, 그 외→en). 헤더 우측 🌐 풀다운으로 바꾸면 저장된다.
- 마크업은 `data-i18n="key"`(텍스트) · `data-i18n-html`(드롭존처럼 태그 포함) · `data-i18n-title/placeholder/aria-label`(속성). 동적 문구(요약·페이지 라벨·상태)는 `app.js` 가 `MH_I18N.t()` 로 그리고, 언어가 바뀌면 `mh:lang` 이벤트로 다시 그린다. 세 사전의 키는 동일해야 한다(검증 스크립트 참고).
- **로고**: 템플릿의 Aizox 로고를 **Y Systems**(인라인 SVG 마크 + 텍스트)로 교체. 인라인이라 dark/light 는 CSS 변수(`--OnSurface`)로 자동 — `dark-light.js` 의 `#logo_header` 이미지 스왑은 요소가 없어 no-op. `images/logo/*.svg` 도 Y Systems 워드마크로 바꿔 둠(현재 미사용). `images/favicon.png` 와 CSS/SCSS 상단 템플릿 크레딧 주석은 그대로.

## 파일

| 경로 | 설명 |
|---|---|
| `index.html` | 화면(템플릿 셸 + 앱 마크업 + 앱 전용 `<style>`) |
| `js/i18n.js` | ko·ja·en 사전 + 감지 + `apply()`/`set()` (`window.MH_I18N`) |
| `js/photo-grid.js` | **핵심 로직** — `layout`·`naturalCompare`·`buildWorkbook`(DOM 무관, Node 에서도 동작)·`readImage`(브라우저). UMD 라 `require()` 가능 |
| `js/app.js` | DOM 연결(업로드·미리보기·생성·다운로드·언어 풀다운) |
| `css/`, `scss/`, `font/`, `icon/`, `images/`, `js/*.min.js` `main.js` `dark-light.js` | AIZOX 템플릿 자산 |

## 검증

브라우저 렌더 없이도 핵심 로직은 Node 로 검증할 수 있다(ExcelJS 는 devDependency 로 두지 않으므로 임시 폴더에서):

```bash
mkdir /tmp/pg && cd /tmp/pg && npm i exceljs
node -e "const PG=require('<repo>/apps/megahouse/js/photo-grid.js'), X=require('exceljs'); PG.buildWorkbook(X,[{name:'1.jpg',base64:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',extension:'png',width:1600,height:1200}],{caption:true}).xlsx.writeFile('out.xlsx').then(()=>console.log('ok'))"
```

## SCSS 컴파일

```
sass scss/app.scss css/styles.css --watch
```

## 배포

Cloudflare Pages 프로젝트 `broodev-megahouse` — Root directory `apps/megahouse`, 빌드 없음, output `.`. 절차는 [`docs/deploy-cloudflare.md`](../../docs/deploy-cloudflare.md) §2-B.
