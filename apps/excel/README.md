# SHEET — 엑셀 에디터 (excel.broodev.com)

설치 없이 브라우저에서 쓰는 무료 스프레드시트 편집기. 여러 시트 · 수식 · 서식 · 병합 · 자동 저장/자동 불러오기 ·
.xlsx/.csv 가져오기 · .xlsx/.csv/.pdf 내보내기 · 인쇄 · Google 계정(Drive appDataFolder) 동기화. 13개 언어.

- Cloudflare Pages 프로젝트 Root = `apps/excel`, 빌드 없음(정적). 도메인 `excel.broodev.com` (Pages 의 Custom domains 에서 추가하면 DNS 레코드가 자동 생성된다).
- 자기완결형 바닐라 JS — React/Babel 없음. 라이브러리는 CDN(jsDelivr)만:
  - 그리드: [x-data-spreadsheet 1.1.9](https://github.com/myliang/x-spreadsheet) (MIT) — `app.js` 가 화면 문구를 먼저 현지화한 뒤 JS·CSS 를 붙인다(head 에 preload).
  - xlsx: ExcelJS 4.4.0 (MIT) — 가져오기/내보내기 때만 지연 로드.
  - PDF: pdf-lib 1.17.1 (MIT) — PDF 내보내기 때만 지연 로드.
  - Google 로그인: Google Identity Services 토큰 클라이언트 — `GOOGLE_CLIENT_ID` 가 있을 때만 로드.
- 「Excel」은 설명적 표현(Excel 호환·.xlsx)으로만 쓴다. 로고·브랜드는 `SHEET` + 글자 아이콘 S(`favicon.svg`).

## 파일

| 파일 | 역할 |
|---|---|
| `index.html` | 셸 · SEO(head, hreflang 13 + x-default, OG/Twitter, JSON-LD) · `#root` 바깥 정적 사용법/FAQ |
| `css/app.css` | ui-terminal 네온 그린 테마 + 그리드(종이처럼 밝게) + 반응형 + 인쇄용 CSS(격자만) |
| `config.js` | `GOOGLE_CLIENT_ID` (빈 값 = 「Google 동기화 — 준비 중」) |
| `js/i18n.js` | 13개 언어 사전: 화면 문구(U) · x-spreadsheet 툴바/메뉴(XS) · 사용법/FAQ(SEO) · JSON-LD 생성 |
| `js/store.js` | IndexedDB 작은 래퍼 + 통합문서 저장소(묘비 · 단조 증가 updatedAt). 메모리 백엔드(테스트·비상용) |
| `js/sync.js` | Drive appDataFolder 동기화 엔진 + 병합(LWW · 충돌 사본 · 묘비 · 401 재시도). DOM 없음 |
| `js/convert.js` | 수식 계산기 · x-spreadsheet ⇄ ExcelJS(값·수식·병합·열 너비·행 높이·서식·틀 고정) · CSV. DOM 없음 |
| `js/pdf.js` | 시트를 canvas 에 브라우저 글꼴로 그려 A4 가로 페이지로 나눔 → pdf-lib 이미지 PDF · 인쇄용 표 |
| `js/app.js` | 화면 · 자동 저장 · 탭 간 충돌 방지 · 가져오기/내보내기 · 동기화 연결 |
| `favicon.svg/.ico`, `favicon-96x96.png`, `apple-touch-icon.png` | 파비콘 4종 |
| `sitemap.xml` · `robots.txt` · `ads.txt` · `_redirects` · `404.html` | 정적 SEO/광고/라우팅 파일 |
| `../../scripts/verify-excel.mjs` | Node 검증(아래) |

`og-image.png`(1200×630)는 `node scripts/og/gen_og.mjs excel` 로 만든다(head 는 이미 이 경로를 가리킨다). 포털 카탈로그(`apps/home/assets/js/catalog.js`)는 도메인 연결 전이라 `status: 'soon'` — 공개 뒤 `'live'` 로.

## 저장 · 불러오기

- 편집하면 600ms 뒤 **IndexedDB**(`broodev-excel` → `books`, `meta`)에 자동 저장, 다시 열면 마지막 통합문서를 자동으로 연다.
  사용자는 「쿠키」라고 부르지만 쿠키는 4KB 한도라 시트를 담을 수 없다 → 브라우저 저장소를 쓰고, 화면에 「이 브라우저에만 저장됩니다(쿠키처럼 기기별)」라고 안내한다.
- 처음 열면 빈 통합문서는 **초안**(아직 저장 안 함)으로 시작 — 첫 입력 때 저장된다(빈 통합문서가 쌓이지 않게).
- localStorage 는 작은 값만: `excel:lang` · `excel:current`(마지막으로 연 통합문서 id) · `excel:sync`(동기화를 켰는지) · `excel:ping`(탭 간 알림) · `excel:hint-off`.
- **다른 탭**: 저장할 때마다 `excel:ping` 을 쓰고 `storage` 이벤트로 받는다. 같은 통합문서를 다른 탭이 고쳤으면 최신 것을 반영하고 알림.
  이 탭에도 저장 전 편집이 있었다면 다른 탭의 판을 「(충돌 사본)」으로 남기고 이 탭의 편집을 저장한다(덮어쓰기 사고 없음).
- 삭제는 묘비 `{id, deleted:true, updatedAt}` 로 남겨 동기화로 다른 기기에 전파한다.
- **떠나는 순간**(새로고침·같은 탭 이동·닫기): IndexedDB 쓰기는 비동기라 끝나기 전에 문서가 사라질 수 있다 →
  `pagehide` · 탭 숨김 · `beforeunload` 에서 아직 확인되지 않은 내용을 `localStorage` 의 `excel:pending:<id>` 에 **동기식으로** 남기고,
  다음에 열 때 IndexedDB 보다 새것이면 복구(「저장되지 않은 변경 내용을 복구했습니다」). 그사이 다른 탭이 고쳤으면 복구분은 「(충돌 사본)」.
  저장은 get→put 을 한 트랜잭션으로 한다(`backend.update`).
- **저장 실패**(용량 초과 `QuotaExceededError` 등): 내용은 화면에 남고 「저장 안 됨」 상태 + 전용 안내 토스트(「.xlsx 백업 내려받기」 버튼).
  다음 편집 · Ctrl+S · 20초 주기로 다시 저장하고, 저장되기 전에는 다른 통합문서로 넘어가지 않으며 떠날 때 확인 창을 띄운다.

## Google 동기화 (다른 PC 연동)

- Google Identity Services 토큰 클라이언트 + Drive REST v3 **appDataFolder**(앱 전용 숨김 폴더)의 `sheet-workbooks.json` 하나.
  scope 는 `https://www.googleapis.com/auth/drive.appdata` 하나뿐 — 사용자의 다른 Drive 파일에는 접근할 수 없다. 서버·DB 없음.
- 「Google 계정으로 동기화」 → 토큰 → 파일 찾기/만들기 → 병합 → 이후 편집마다 3초 디바운스 업로드.
  앱을 다시 열면(이전에 연결했으면) `prompt: ''` 로 조용히 토큰을 받아 내려받아 병합. 팝업이 막히면 버튼이 「다시 연결」로 바뀐다.
  탭으로 돌아올 때도(30초에 한 번까지) 내려받는다.
- 액세스 토큰은 **메모리에만** 둔다. 401 → 토큰 재요청 후 1회 재시도. 오프라인/실패 → 로컬 저장은 계속, 상태 표시줄 「동기화 대기 중」/「오프라인」, 자동 재시도.
- 병합: 통합문서 단위 LWW(최신 updatedAt 승리). 마지막 동기화 이후 두 기기가 같은 통합문서를 함께 고쳤으면 진 쪽을 「(충돌 사본)」 새 통합문서로 보존,
  삭제 vs 수정이 겹치면 수정본을 살린다 — 데이터 유실 0. 「바뀜」은 기준점(마지막 동기화 때의 updatedAt)보다 **엄격히 새로울 때만** —
  다른 기기가 늦게 올린 낡은 사본은 새 판을 이기지 못한다.
- 동시 쓰기: Drive v3 파일에는 ETag/If-Match 가 없다 → ① 올리기 직전 `version` 이 내려받을 때와 같은지 확인(다르면 다시 받아 병합, 412 도 같은 처리)
  ② 올린 뒤 20초에 한 번 `version` 을 확인해 그사이 다른 기기가 덮어썼으면 곧바로 다시 동기화(낡은 덮어쓰기 복구)
  ③ 동기화가 내려받는 동안 이 기기에서 저장된 통합문서는 덮어쓰지 않고(같은 트랜잭션에서 updatedAt 확인) 다음 병합에서 충돌 사본으로 처리
  ④ 두 기기가 동시에 처음 연결해 파일이 둘 생기면 가장 오래된 파일로 합치고 나머지는 지운다.
- 「연결 해제」 = `google.accounts.oauth2.revoke` + 플래그 삭제. 이 브라우저와 Drive 의 데이터는 지우지 않는다.

### 운영자 설정 (켜는 방법 · Google OAuth 설정)

> 쿠키 메모장(`apps/memo`)과 엑셀 에디터(`apps/excel`)는 **Google Cloud 프로젝트 하나 · OAuth 클라이언트 ID 하나**를 같이 쓴다 — 아래를 한 번만 하고 같은 ID 를 두 앱의 `config.js` 에 넣는다.
> 같은 프로젝트라 Drive appDataFolder 도 공유되지만 파일 이름이 `memo-notes.json` / `sheet-workbooks.json` 으로 달라 섞이지 않는다. 서버·DB·클라이언트 보안 비밀은 쓰지 않는다.

1. **콘솔** — <https://console.cloud.google.com/> → 프로젝트 만들기(예: `broodev`) 또는 선택.
   Search Console 에서 `broodev.com` 소유권이 확인된 Google 계정으로 하면 2번의 승인된 도메인 확인이 바로 통과한다.
2. **OAuth 동의 화면** (새 콘솔 이름: 「Google 인증 플랫폼」 → 브랜딩 · 대상 · 데이터 액세스)
   - 브랜딩: 앱 이름 `broodev` (동의 창에 「broodev 에서 액세스를 요청합니다」로 보인다) · 사용자 지원 이메일 `support@broodev.com` ·
     앱 홈페이지 `https://broodev.com/` · 개인정보처리방침 `https://broodev.com/legal/privacy` (2-(8) 「Google 계정 연동」 절이 이 앱들 설명) ·
     서비스 약관 `https://broodev.com/legal/terms` · **승인된 도메인 `broodev.com`** · 개발자 연락처 `support@broodev.com`.
     로고는 비워 둔다(로고를 올리면 브랜드 확인 심사가 생긴다).
   - 대상: 사용자 유형 **외부** → **프로덕션으로 게시**. 「테스트」 상태로 두면 등록한 테스트 사용자만 연결할 수 있다.
   - 데이터 액세스(범위): **`https://www.googleapis.com/auth/drive.appdata` 하나만** 추가. 비민감 범위라 보통 앱 검증 심사 없이 게시된다.
3. **사용자 인증 정보 → 사용자 인증 정보 만들기 → OAuth 클라이언트 ID** (새 콘솔: 「클라이언트 → 클라이언트 만들기」) → 유형 **웹 애플리케이션**, 이름 예: `broodev-drive-sync`
   - 승인된 JavaScript 원본: `https://memo.broodev.com` · `https://excel.broodev.com` ·
     로컬 테스트용 `http://127.0.0.1:8931`(memo) · `http://127.0.0.1:8947`(excel) — 로컬 서버 포트와 정확히 같아야 하고, `localhost` 와 `127.0.0.1` 은 서로 다른 출처다.
     `*.pages.dev` 미리보기에서 시험하려면 그 주소(예: `https://<프로젝트>.pages.dev`)도 추가.
   - 승인된 리디렉션 URI: **비움**(GIS 토큰 클라이언트 팝업 방식이라 필요 없다).
4. **Drive API 사용 설정** — 「API 및 서비스 → 라이브러리 → Google Drive API → 사용」. 안 켜면 연결 직후 Drive 호출이 403(`accessNotConfigured`)으로 실패한다.
5. **config.js 에 붙여넣기** — 발급된 `…apps.googleusercontent.com` 를 `apps/memo/config.js` 와 `apps/excel/config.js` 의 `GOOGLE_CLIENT_ID` 에 똑같이 넣고 커밋·배포.
   클라이언트 ID 는 공개돼도 되는 값이다(비밀 키 아님).
6. **확인** — 배포 뒤 https://excel.broodev.com 에서 「Google 계정으로 동기화」 → 동의 창의 요청 권한이 「Google Drive 의 자체 구성 데이터 보기·만들기·삭제」 한 줄뿐인지 →
   다른 브라우저(또는 시크릿 창)에서 같은 계정으로 연결해 데이터가 넘어오는지 → 「연결 해제」 뒤 <https://myaccount.google.com/permissions> 에서 앱이 빠졌는지.

## 가져오기 · 내보내기 · 인쇄

- 가져오기: `.xlsx`(ExcelJS — 값, 문자열 수식(공유 수식은 칸별로 풀어서), 병합, 열 너비/숨김, 행 높이/숨김, 기본 서식, 틀 고정, 날짜·링크·서식 있는 글자),
  `.csv/.tsv/.txt`(구분자 자동 감지, UTF-8 BOM, UTF-8 이 아니면 UI 언어의 레거시 인코딩 — ko: EUC-KR, ja: Shift_JIS, zh: GBK, zh-Hant: Big5 …). 파일을 그리드에 끌어다 놓아도 된다.
- 내보내기: `.xlsx`(값·수식+계산된 캐시값·병합·열 너비·행 높이·서식·틀 고정, `fullCalcOnLoad`), `.csv`(현재 시트, 화면 값, UTF-8 BOM),
  `.pdf`(현재 시트를 canvas 에 브라우저 글꼴로 그려 A4 가로 페이지로 나눠 pdf-lib 로 이미지 PDF — 한국어·일본어·중국어·태국어·키릴 문자 OK. 표가 페이지보다 조금 넓으면 폭에 맞춰 축소, 많이 넓으면 아래→오른쪽 순서로 나눔).
- 큰 PDF(30쪽 초과): 먼저 쪽수를 알려 주고 「선택한 셀만 / 빠르게(작은 파일) / 원본 화질」 중에서 고르게 한다. 만드는 동안 토스트에 「n / 전체쪽」 진행률과 취소 버튼.
  canvas 를 불투명(`alpha:false`)으로 그려 RGB PNG 의 압축 데이터를 **풀지 않고 그대로** PDF 이미지(Flate + PNG 예측자)로 넣는다 —
  pdf-lib `embedPng` 의 디코딩·재압축을 건너뛰어 500행×100열(180쪽)이 약 107초·힙 2GB → 약 6초·힙 160MB.
- 인쇄: 같은 값으로 HTML 표를 만들어 `#print-area` 에 넣고 브라우저 인쇄(`@media print` 가 격자만 남김, A4 가로). Ctrl+P 도 같은 표를 쓴다. 인쇄 창의 「PDF로 저장」도 가능.
- 복사/붙여넣기: 그리드에서 Ctrl+C 하면 화면 값이 탭 구분 텍스트로 시스템 클립보드에도 들어가 엑셀·구글 시트에 붙일 수 있다.
  엑셀(`\r\n`)·구글 시트(`\n`, 따옴표 안 줄바꿈) 에서 복사한 표를 붙이면 칸에 맞게 들어가고, 범위가 모자라면 행/열이 늘어난다.

## x-spreadsheet 보정 (app.js `patchXs`)

- 라이브러리 내부 `Element.html()` 이 innerHTML 을 쓰므로 textContent 로 교체 — 셀 값·시트 이름이 HTML 로 해석되지 않는다.
- 붙여넣기 파서 교체(위) · 내부 클립보드가 남아 있어도 바깥 텍스트를 우선.
- 새 시트 이름 현지화(시트/Sheet/シート…), 시트 추가·삭제·이름 변경·열 너비 변경도 자동 저장(변경 감지는 JSON 비교).
- 320~480px 에서 라이브러리 CSS 가 툴바를 숨기면서 높이만 빼던 문제 → 휴대폰에서도 툴바 표시(넘치는 버튼은 「더보기」).
- 모바일에서는 셀 편집이 어려워 표 위에 **수식 입력줄**(선택 칸 주소 + 값/수식)을 두었다. 그리드는 손가락으로 가로·세로 스크롤.
- **키보드만으로**: 이름 상자(`#fxRef`)에 `B5` · `A1:C3` 을 입력하고 Enter → 그 칸/범위 선택 후 그리드로 포커스.
  그리드(`.x-spreadsheet-overlayer`)는 Tab 으로 들어갈 수 있고(화살표 · Enter · F2 · 바로 입력), 키보드로 들어온 경우 Tab/Shift+Tab 은 그리드 밖으로(갇히지 않음 —
  마우스로 고른 칸에서는 엑셀처럼 오른쪽 칸으로). 툴바는 Tab 한 번 + ←/→/Home/End(ARIA toolbar), Enter/Space 로 실행, 드롭다운(색 팔레트 등)은 화살표 · Esc.
  시트 탭: Enter 열기 · F2 이름 바꾸기 · Shift+F10 메뉴, ＋ 시트 추가도 Tab 으로 닿는다. 셀을 옮기면 화면 읽기 프로그램에 「B5 값」을 알린다.
- 라이브러리에 남은 영어(인쇄 미리보기 「Print settings」 · 데이터 유효성 「E3 or E3:F12」)는 그리드를 만들 때 13개 언어로 바꾼다.
- 화면의 수식 계산은 x-spreadsheet 가 한다(SUM·AVERAGE·MAX·MIN·IF·AND·OR·CONCAT·사칙연산·참조·범위). CSV·PDF·인쇄·xlsx 캐시값은 `convert.js` 계산기가 같은 결과를 낸다
  (그 밖에 COUNT·COUNTA·ROUND·ABS·LEN 등과 시트 간 참조 `시트2!A1` 도 계산).

## 검증

```bash
node scripts/verify-excel.mjs              # 저장소·병합·충돌·묘비·401·오프라인·동시성(낡은 업로드·동기화 중 저장·중복 파일·version)·xlsx/CSV 왕복·PDF·정적 SEO=사전
node scripts/verify-excel.mjs --fix-static # js/i18n.js 의 ko 사용법/FAQ 를 고친 뒤 index.html 정적 본문·JSON-LD 다시 쓰기
python -m http.server 8947 --bind 127.0.0.1 --directory apps/excel
node scripts/i18n-scan.mjs --url http://127.0.0.1:8947/ --set qs:lang --langs all --wait 6000
node scripts/cdp-shot.mjs --url "http://127.0.0.1:8947/?lang=de" --out de.png [--mobile]
```

`window.SheetApp` (검증용 훅): `makeXlsxBlob()` · `makeCsvBlob()` · `makePdfBlob(opts)` · `pdfPages()` · `goTo('B5')` · `getData()` · `setCell(r, c, text)` · `importFile(file)` · `listBooks()` · `status()` …

## 알려진 한계

- 차트·매크로·피벗·조건부 서식·이미지는 지원하지 않는다(가져올 때 무시, 값과 수식은 보존).
- 화면(x-spreadsheet)은 시트 간 참조 수식을 계산하지 못한다(문자열은 보존되고 내보내기 계산값은 정상).
- 동기화 단위는 통합문서 — 같은 통합문서를 두 PC 에서 동시에 고치면 칸 단위 병합이 아니라 「충돌 사본」으로 나뉜다.
