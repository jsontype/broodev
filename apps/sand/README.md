# SAND_SIGNAL // buy-timing terminal ₿

실시간 샌드박스 지표 6종을 합성해 **"지금이 살 타이밍인가?"**를 0~100 점수로 보여주는 해커 감성 대시보드 (React · 빌드 불필요).

![stack](https://img.shields.io/badge/react-18-149eca) ![stack](https://img.shields.io/badge/build-none-00ff9c) ![data](https://img.shields.io/badge/data-live-00ff9c)

**기술 스택:** React 18 (CDN UMD) · 브라우저 Babel (빌드 불필요) · 순수 JS 지표 엔진(RSI·MACD·Mayer 등) · i18n 13개 언어 · 데이터: CoinGecko · Binance · Alternative.me 공개 API · 배포: Cloudflare Pages (무빌드)

> [!WARNING]
> **⚠️ 투자 유의 · 면책 고지**
>
> 이 대시보드와 점수는 공개 지표를 합성한 **참고 자료일 뿐, 어떤 형태의 투자 자문·매수/매도 권유도 아닙니다.**
> 점수는 미래 가격을 보장하지 않으며, 암호화폐 투자는 **원금 전액 손실** 위험이 있습니다.
> **모든 투자 판단과 그 결과(손익)에 대한 책임은 전적으로 이용자 본인에게 있습니다.** 반드시 스스로 조사하세요 (DYOR).

## 구조 (라우팅, SEO-safe)

루트 `index.html`이 **광고 버전(기본)** 이자 SEO 랜딩입니다. 비구독자·크롤러는 루트에 그대로 머물러 **검색 노출이 루트(btc.broodev.com)에 유지**되고, **구독자만** 광고 없는 `member/`로 리다이렉트됩니다.

| 경로 | 역할 |
| --- | --- |
| [`index.html`](index.html) | **광고 버전 (비구독자 기본)** — AdSense + 점수 계산 게이트 + 전체 SEO. 구독자면 `member/`로 이동 |
| [`member/`](member/) | **구독자 전용 (광고 없음)** — `noindex`, 유료 결제자만 |

- 비구독자/크롤러 → 루트(광고 버전) 그대로 (리다이렉트 없음 → SEO 유지)
- 구독자 → `member/`
- 구독 판정은 **임시 클라이언트 플래그**(`localStorage 'btc:member'`, `?member=1/0`); **실제 검증은 결제+인증 백엔드 연동 후**(`***! TODO`).

## 배포
Cloudflare Pages. `master` push 시 자동 재배포. 프로젝트 = Root `apps/btc` · **Build command 없음** · Output `/`. (라이브: https://btc.broodev.com/)
- 모든 HTML은 빌드 불필요(CDN React + 브라우저 Babel, 인라인). 로컬은 정적 서버로 열어야 함.

## 데이터 소스 (전부 키 없이 브라우저 직접 호출 · CORS 허용 확인)

| 데이터 | 1차 | 폴백 |
| --- | --- | --- |
| 현재가 / 24h | CoinGecko `simple/price` | Binance `ticker/24hr` |
| 일봉 히스토리 | Binance `klines` (1000일) | CoinGecko `market_chart` (365일) |
| 공포·탐욕 지수 | Alternative.me `fng` | localStorage 캐시 |

한 소스가 죽어도 나머지로 동작(부분 실패 허용), 마지막 성공값은 localStorage에 캐시됩니다.

## 매수 타이밍 점수 (0~100, 높을수록 매수 우호)

6개 지표의 0~100 부분점수를 가중 합성합니다. (결측 지표는 제외하고 가중치 자동 재정규화)

| 지표 | 가중 | 매수 신호 | 성격 |
| --- | --- | --- | --- |
| **RSI(14, Wilder)** | 22% | <30 과매도 | 역추세 |
| **공포·탐욕 합성** | 22% | 극공포 | 역발상 |
| **Mayer Multiple** (가격/200일선) | 18% | <0.8 | 역발상 밸류 |
| **MACD(12·26·9)** 히스토그램 | 18% | 바닥 상향전환 | 모멘텀 |
| **365일 고점대비 낙폭** | 12% | -50% | 역발상 |
| **50/200 골든·데드 크로스** | 8% | 골든크로스 | 추세 필터 |

**판정 밴드:** `80+` STRONG BUY · `65~80` ACCUMULATE · `45~65` NEUTRAL · `25~45` CAUTION · `0~25` OVERHEATED

> 지표 공식은 멀티에이전트 워크플로로 도출하고, RSI Wilder 정준 테스트벡터(70.46 / 66.25)와
> 라이브 데이터로 검증했습니다.

## 화면

- **중앙 대형 게이지** = 매수 타이밍 점수(밴드 색: 녹=매수 / 황=중립 / 적=과열)
- SAND 현재가·24h·거래량·시총 + 가격 스파크라인 + 점수 추이
- 지표 6종 카드: 원시값 + 추이(미니차트) + 0~100 부분점수 막대
- 소스 상태 배지(live / fallback / cached / offline), 데이터 오래되면 `STALE`
- **다국어(i18n)**: 헤더 좌측 🌐 풀다운으로 **13개 언어** 전체 UI 전환 (지표·터미널·용어설명·부팅까지). 첫 방문 시 **브라우저 언어 자동 감지**(미지원 언어는 English 폴백, `zh-TW/HK`는 번체로 라우팅), 선택값은 `btc:lang`에 영속
  - English · 日本語 · 한국어 · 简体中文 · 繁體中文 · ไทย · Español · Français · Deutsch · Italiano · Português · Русский · Nederlands
- **용어 설명(툴팁)**: 헤더 `용어 설명 ON/OFF` 토글 — 어려운 용어에 마우스/포커스 시 초보자용 쉬운 설명을 띄움
- 매트릭스 레인 · CRT 스캔라인 · 부팅 시퀀스 · 내장 터미널

## 내장 터미널 명령어

`help` 입력으로 시작.

| 명령 | 설명 |
| --- | --- |
| `score` | 현재 점수 + 판정 + coverage |
| `why` | 무엇이 점수를 끌어올리/내리는지(가중 기여도) |
| `show <ind>` | 지표 상세 (`rsi`\|`macd`\|`fng`\|`mayer`\|`dd`\|`cross`) |
| `bands` | 5단계 판정 밴드 표 |
| `sources` | 데이터 소스 상태/신선도 |
| `refresh` | 전체 재조회 |
| `theme <green\|cyan\|amber\|red>` · `matrix <on\|off>` | 외형 |
| `clear` · `help` · `whoami` | 화면 지우기 · 도움말 · 정체 |

## 한계

- 합성 점수/가중치는 일반적 해석에 기반한 **출발점**이며, 실제 운용 전 샌드박스 일봉 백테스트로 보정 필요.
- RSI/MACD는 강추세장에서 오래 과매수/과매도에 머물 수 있음(단독 진입 위험).
- 일부 지역에서 `api.binance.com` 차단 시 히스토리가 CoinGecko(365일, 라인차트)로 강등됩니다.
