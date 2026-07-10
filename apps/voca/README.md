# voca — VOCA DECK (깜빡이 단어암기장)

> **기술 스택**: React 18 UMD(CDN unpkg) + `@babel/standalone@7`(브라우저 런타임 JSX 컴파일) · 무빌드 정적 · 자기완결형 단일 `index.html` · localStorage 영속 · Cloudflare Pages 배포

**voca.broodev.com** — 어휘와 의미를 화면에 연속적으로 제시해 단기간에 이미지 연상으로 암기하는 **깜빡이 방식** 단어암기장. 클래식 깜빡이 프로그램(AnyMemory 1.0)의 화면·조작을 웹으로 재현했다.

## 화면 구성 (설계 원본: AnyMemory 스크린샷)
- **표시 영역**: 남색 배경 2분할 — 위쪽 단어(A), 아래쪽 의미(B). 노란 대형 굵은 글씨.
- **제어판**(하단 회색 클래식 UI):
  - 툴바: 암기장 열기 · 다음 · 암기 표시 · TTS(음성만) · 항상 위에(웹 미지원, 비활성) · 제어판 숨기기 · 종료
  - 상태: 총 개수 / 현재 인덱스 / 외울 개수 / 외운 개수
  - 수동/자동 · A↔B(A→B / B→A) · 순서(순방향/역방향/무작위) + 시작번호/적용
  - 표시 범위(외운 항목 제외 / 외운 항목만 / 모두) + 지연시간(초, 기본 3)
  - 글꼴 · 배경 색상 · 암기표시 초기화
- **제어판 숨기기**: 표시 영역 최대화 + 하단 미니바만 유지.
- **튜토리얼 토글**: 헤더 우측 "📖 튜토리얼" → [voca-tutorial.broodev.com](https://voca-tutorial.broodev.com/)(`apps/voca-tutorial`)으로 이동(`?lang=` 유지). 튜토리얼 쪽 "◀ 앱으로 돌아가기"·완료 CTA로 복귀.
- **최초 방문 온보딩**: 방문 기록이 전혀 없으면(`voca:visited`·기존 저장값 모두 없음) **1회만** 튜토리얼로 자동 리다이렉트 후 `voca:visited` 영구 플래그 저장. `<head>` 인라인 스크립트라 깜빡임 없음. 검색엔진 봇 UA·운영 외 도메인(로컬 등)은 제외 — 봇이 리다이렉트되면 voca 색인이 튜토리얼로 넘어가므로 필수 방어.

## 조작
- **스페이스바/클릭/다음/휠**: 한 번 누르면 단어가 위쪽에, 또 누르면 아래쪽에 의미, 또 누르면 그다음 단어(아래는 빈칸) — 원본과 동일한 진행 방식. ←/휠업은 뒤로.
- **모바일**: 탭 = 다음, 좌스와이프 = 다음, 우스와이프 = 이전. 제어판은 최대 화면 절반 높이(내부 스크롤)로 제한되고 터치 타깃·폼 컨트롤이 확대됨(iOS 포커스 줌 방지 16px). 글꼴/배경 팝오버는 하단 고정 시트로 표시.
- **자동 모드**: 지연시간(기본 3초) 간격으로 같은 진행을 자동 반복.
- **TTS**: Web Speech API. A면은 괄호（）안 요미가나만 일본어로, B면은 한국어로 읽음. ‘음성만’은 글자 숨김.

## 샘플 암기장 게시판 (`samples/`)
- 앱 화면 아래 스크롤 영역에 클래식 룩 게시판. 진입점: 툴바 "📚 샘플 암기장" 버튼 + 빈 화면 하단 링크(스크롤 이동).
- **탭 = 학습 타깃 언어 13종**(수요순 정렬) — 현재 UI 언어와 같은 탭은 자동 숨김(한국어 사용자에겐 한국어 탭이 안 보임).
- **13언어 매트릭스 CSV** (`samples/*.csv`, 헤더 = 언어 코드). 적용 시 A면=타깃 언어 컬럼, B면=현재 UI 언어 컬럼(없으면 en 폴백). 미국인이 JLPT를 누르면 日→英, 한국인이 누르면 日→韓.
- **티어 공용 구조**: CEFR급 파일 1개(`tier-a1/a2/b1/b2/adv/academic/business.csv`)가 **13개 타깃의 동급 덱을 전부 커버** — `tier-a1.csv`(586단어) 하나로 초등영어·JLPT N5·HSK 1–2·TOCFL A1·TOPIK 1·DELE/DELF/Goethe/CILS/CAPLE/TORFL A1·NT2/태국어 기초가 동시에 활성화된다. 코드에선 `TIERS`(파일·count) ↔ `SAMPLE_DECKS`(덱→`tier` 참조)로 분리, 티어 파일이 랜딩되면 `TIERS`에 등록만 하면 전 타깃 동시 오픈.
- **시험명은 난이도 근사 라벨**(공식 어휘표 아님 — 저작권·유지보수 문제). 게시판 하단에 13언어 고지(`t.lvlNote`).
- 검증: `node scripts/validate_samples.mjs` — 13열 정합성·빈 셀·en 중복(파일 내+교차)·컬럼 중복 경고·`TIERS` count 일치를 검사. JSX는 `node scripts/check_jsx.mjs apps/voca/index.html`.
- [▶ 적용]: 기존 덱이 있으면 교체 확인 1회 → 적용 + TTS 로케일(`voca:deckLang`)을 타깃/UI 언어로 갱신 + 상단 스크롤. [⬇ CSV]: 현재 언어 조합의 2열 CSV(BOM 포함)로 다운로드 — 수정 후 📂로 다시 열 수 있음.
- 덱 파일은 세션 내 fetch 캐시(`matrixCache`, 키 고정)로 재요청 방지.

## CSV 편집기 + 마이 보카덱 (샘플 게시판 아래)
- **CSV 편집기** (`#editor`): 왼쪽 컨트롤 / 오른쪽 엑셀식 2열 시트(A면·B면) — **jspreadsheet-ce v4 (MIT, CDN)** 기반.
  - 엑셀식 조작: 드래그·Shift+클릭 범위 선택, 행번호 클릭 = 행 전체 선택, Delete 지우기(행 선택 시 행 삭제 확인창 `t.edDelRowsConfirm`), Ctrl+C/V 엑셀 호환 복사·붙여넣기, Ctrl+Z/Y 실행취소, 우클릭 메뉴(행 추가/삭제 — 기존 i18n 키 재사용). 열은 2열 고정(추가/삭제/드래그 차단).
  - 불러오기: 📂 CSV 파일 / ⬇ 현재 덱 / 🗒 새 시트 — 시트에 내용이 있으면 덮어쓰기 확인.
  - **빈칸 검증**: 시트 데이터를 rAF 배칭으로 React 미러(`rows`)에 동기화 → 한쪽만 채운 행의 빈 칸에 `ed-cell-err` 클래스(빨간 칸) + 경고문 + 저장 버튼 3종 비활성화. 양쪽 다 빈 행은 저장 시 무시(에러 아님).
  - 저장: 💾 CSV 다운로드(BOM·쉼표/따옴표 이스케이프) / ⭐ 마이 보카덱 / ▶ 바로 덱 적용.
  - 언어 변경 시 `setHeader`로 열 제목 갱신. 열 폭은 컨테이너 기준 계산 + resize 대응.
- **마이 보카덱** (`#mydecks`): `voca:mydecks`(localStorage)에 `[{id, name, rows, savedAt}]`로 보관. ▶적용 / ✎편집기로 / ⬇CSV / 🗑삭제. 같은 이름 저장은 덮어쓰기 확인, 4.5MB 초과 시 저장 거부 + 사용량 표시. 기기 이동은 CSV 다운로드 → 새 기기 로드로 안내(서버 저장 없음).

## 프리미엄 (평생 이용권 · 1회 결제)

- **켜고 끄기 스위치**: `index.html`의 `PREMIUM` 상수 하나로 유료화 전체를 제어한다.

  ```js
  const PREMIUM = {
    launch: false,     // false = 게이트 완전 비활성(전부 무료, 기존과 100% 동일) / true = 유료화 ON
    price: '¥6,990',   // 표시용 가격 (실제 결제 금액은 Polar 상품 설정)
    checkoutUrl: '',   // Polar 체크아웃 링크 — 상품 개설 후 입력
    trialDays: 3,      // 무료 체험 일수
  }
  ```

  `launch: false`면 프리미엄 관련 UI(헤더 칩·자물쇠·모달)가 아예 렌더되지 않으므로 **언제든 커밋/배포해도 사용자에게 변화 없음**. 문제가 생기면 `true → false`로 되돌리는 것만으로 즉시 전면 무료 상태로 롤백된다.
- **출시 절차**: Polar 대시보드에서 상품(1회 결제 + 라이선스 키) 개설 → `checkoutUrl` 입력 → `launch: true` 커밋.
- **무료 vs 프리미엄**: 내 CSV 열어서 암기(핵심 기능)는 무료. 샘플 암기장·CSV 편집기·마이 보카덱·광고 제거는 프리미엄. 잠금 시 샘플 게시판은 목록을 그대로 보여주되 적용/다운로드 버튼만 🔒로 바뀌고, 편집기·마이 보카덱은 자물쇠 커버로 대체된다.
- **3일 무료 체험**: 프리미엄 모달에서 시작(1회 한정, `voca:trial`에 시작 시각 저장). 만료 시 다시 잠기고 체험 버튼은 사라진다. localStorage 삭제로 리셋 가능한 건 의도적 허용(서버 계정 없는 앱 철학).
- **라이선스 키**: 구매 시 Polar가 키 발급 → 모달의 키 입력란 → `/api/license/activate`(Cloudflare Function, **2차 구현 예정**)가 Polar API로 검증 → 서명 토큰을 `voca:premium`에 저장. 키당 활성화 5대 제한(Polar 측 설정).
- **개발 테스트**: 배포 전 게이트를 미리 보려면 브라우저 콘솔에서 `localStorage.setItem('voca:premiumDev', '1')` 후 새로고침 (`launch` 값과 무관하게 게이트 강제 ON. 해제는 키 삭제).
- 관련 i18n 키는 `prm*` 접두사(13언어 · 모달·칩·잠금 문구 전부).

## 암기장 파일 (CSV)
- 맥 기준 **txt가 아니라 csv**. 양식은 txt와 동일(2열, 무한 행).
- 한 줄에 `단어,뜻` — 구분자는 **쉼표(,)** (세미콜론 아님. 사양상 암기장 구분 문자 설정은 없음).
- **trim 적용**, 아무것도 없는 행은 무시. 뜻에 쉼표가 있어도 첫 쉼표 기준으로 분리되므로 안전. `"..."` 인용도 지원.
- 단어(A열)는 `単語（たんご）`처럼 **한자+요미가나** 포맷 권장 — [`sample.csv`](sample.csv) 참조(첫 방문 시 자동 로드).

## 다국어 (i18n · 13개국어)
- 지원 언어: `en, ko, ja, zh, zh-Hant, th, es, fr, de, it, pt, ru, nl` — 최상단 슬림 헤더(좌: broodev 로고 + 앱 이름, 우: 🌐 드롭다운)에서 전환.
- 감지 우선순위: `localStorage(voca:lang)` → URL `?lang=` → `navigator.language` → `en` 폴백. 언어 변경 시 `<html lang>`·`<title>`·meta description 동기화 + URL `?lang=` 반영.
- 하단 정적 SEO 본문은 [`seo-i18n.js`](seo-i18n.js)(`window.renderSEO`)가 현재 언어로 다시 그림(무JS 크롤러는 정적 한국어 폴백).
- 공유(OG) 메타는 [`functions/_middleware.js`](functions/_middleware.js)가 엣지에서 `?lang=` 별로 현지화(HTMLRewriter, btc와 동일 컨벤션).
- 새 UI 문자열 추가 시 `index.html`의 `T` 번들에 13개 언어를 동시에 작성한다.

## 구조
| 파일 | 역할 |
| --- | --- |
| `index.html` | 앱 본체 (스타일·로직·UI i18n 13개국어 전부 인라인, 자기완결형) |
| `seo-i18n.js` | 하단 SEO 본문 13개국어 데이터 + 렌더러(`window.renderSEO`) |
| `functions/_middleware.js` | Cloudflare Pages Function: `?lang` 별 title/OG 메타 현지화 |
| `sample.csv` | 샘플 암기장 (일본어 어휘 ~380행, 첫 방문 시 자동 로드) |
| `privacy.html` / `terms.html` | 정적 정책 페이지 (AdSense 필수) |
| `ads.txt` / `robots.txt` / `sitemap.xml` | AdSense·SEO 실제 파일 |
| `favicon.ico`·`favicon.svg`·`favicon-96x96.png`·`apple-touch-icon.png` | 파비콘 4종 |
| `og-image.png` | 공유 썸네일 (1200×630, 남색+노랑) |

## 주의 (하드 규칙)
- Babel은 `@babel/standalone@7` 고정 (v8 업글 시 흑화면)
- React 훅은 조건부 early-return 앞에 전부 호출
- 정적 SEO 본문·광고·푸터는 `#root` 바깥 (React 렌더에 안 지워짐)
- 🚫 광고 자동 새로고침·강제 시청 게이팅 금지 (깜빡이 자동 재생은 콘텐츠 갱신이며 광고와 무관)

## 로컬 확인
```bash
python3 -m http.server 8788 -d apps/voca
# → http://localhost:8788
```

## 배포
Cloudflare Pages 프로젝트 `broodev-voca` (Root directory `apps/voca`, 빌드 없음) + 커스텀 도메인 `voca.broodev.com`.
