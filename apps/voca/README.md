# voca — VOCA_DECK (깜빡이 단어암기장)

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

## 조작
- **스페이스바/클릭/다음/휠**: 한 번 누르면 단어가 위쪽에, 또 누르면 아래쪽에 의미, 또 누르면 그다음 단어(아래는 빈칸) — 원본과 동일한 진행 방식. ←/휠업은 뒤로.
- **모바일**: 탭 = 다음, 좌스와이프 = 다음, 우스와이프 = 이전. 제어판은 최대 화면 절반 높이(내부 스크롤)로 제한되고 터치 타깃·폼 컨트롤이 확대됨(iOS 포커스 줌 방지 16px). 글꼴/배경 팝오버는 하단 고정 시트로 표시.
- **자동 모드**: 지연시간(기본 3초) 간격으로 같은 진행을 자동 반복.
- **TTS**: Web Speech API. A면은 괄호（）안 요미가나만 일본어로, B면은 한국어로 읽음. ‘음성만’은 글자 숨김.

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
