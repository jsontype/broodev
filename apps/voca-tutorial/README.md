# voca-tutorial — VOCA_TUTORIAL (깜빡이 사용법 10단계 튜토리얼)

> **기술 스택**: React 18 UMD(CDN unpkg) + `@babel/standalone@7`(브라우저 런타임 JSX 컴파일) · 무빌드 정적 · 자기완결형 단일 `index.html` · localStorage 영속 · Cloudflare Pages 배포

**voca-tutorial.broodev.com** — 깜빡이 단어암기장 [VOCA_DECK](https://voca.broodev.com/)(`apps/voca`)의 사용법을 **10단계 선형 다이얼로그**로 안내하는 인터랙티브 튜토리얼. 각 단계마다 본 앱과 동일한 룩의 **동작하는 미니 데모**(미니 깜빡이 화면 + 클래식 제어 위젯)를 직접 눌러보며 익히고, 완료하면 본 앱으로 이동하는 CTA를 제공한다.

## 설계 노트 (⚠ 복제 아님)

- **voca 본체를 복제하지 않는다.** 기능 로직은 튜토리얼 전용 축소판(미니 깜빡이·3단어 데모 덱)이며, voca와는 룩(테마 CSS)만 공유한다. voca UI가 크게 바뀌면 해당 단계의 미니 목업만 갱신하면 된다.
- **고유 콘텐츠(사용법 가이드)**이므로 noindex가 아니라 **색인 대상**이다. JSON-LD는 `HowTo` 스키마 사용.
- voca ↔ tutorial **상호 토글**: voca 헤더의 "튜토리얼" ↔ 본 앱 헤더의 "◀ 앱으로 돌아가기" + 완료 화면 CTA. 이동 시 `?lang=` 유지.

## 10단계 구성
1. 깜빡이 암기법 소개 (자동 데모 재생)
2. 탭/스페이스로 진행 (인터랙티브)
3. 뒤로 가기 — ← 키·우스와이프·휠업 (인터랙티브)
4. CSV 암기장 만들기·열기 (CSV 예시 카드 + 데모 열기)
5. 수동/자동 + 지연시간 (LED 라디오 동작)
6. 순서(순·역·무작위) + 시작번호
7. 암기 표시 + 표시 범위 (카운트 반영)
8. A↔B 방향 전환
9. TTS / 음성만 (실제 Web Speech 재생)
10. 글꼴·배경 스와치 + 제어판 숨기기 → 완료 화면(CTA)

진행 상태는 `localStorage(vocatut:step)`에 저장되어 이탈 후 재방문 시 이어한다. "건너뛰기"는 완료 화면으로 직행.

## 다국어 (i18n · 13개국어)
- `en, ko, ja, zh, zh-Hant, th, es, fr, de, it, pt, ru, nl` — 헤더 🌐 드롭다운. 감지 우선순위는 voca와 동일(`localStorage` → `?lang=` → `navigator.language` → `en`).
- 데모 덱(3단어)도 언어별 번역: A면은 영어 단어, B면은 현재 언어 뜻 (TTS는 A=en-US, B=현재 언어 로케일).
- 하단 정적 SEO 본문은 튜토리얼 문자열(`T`)을 재사용해 렌더 — 별도 seo-i18n.js 없음.
- OG 메타는 [`functions/_middleware.js`](functions/_middleware.js)가 `?lang=` 별로 엣지에서 현지화.

## 구조
| 파일 | 역할 |
| --- | --- |
| `index.html` | 앱 본체 (튜토리얼 엔진·미니 데모·i18n 13개국어 인라인, 자기완결형) |
| `functions/_middleware.js` | Cloudflare Pages Function: `?lang` 별 title/OG 메타 현지화 |
| `privacy.html` / `terms.html` | 정적 정책 페이지 (AdSense 필수) |
| `ads.txt` / `robots.txt` / `sitemap.xml` | AdSense·SEO 실제 파일 |
| `favicon.ico`·`favicon.svg`·`favicon-96x96.png`·`apple-touch-icon.png` | 파비콘 4종 (voca와 공용 디자인) |
| `og-image.png` | 공유 썸네일 (voca 사본 — TODO: 튜토리얼 전용 재생성) |

## 주의 (하드 규칙)
- Babel은 `@babel/standalone@7` 고정 (v8 업글 시 흑화면)
- React 훅은 조건부 early-return 앞에 전부 호출
- 정적 SEO 본문·푸터는 `#root` 바깥
- 모바일: 터치 타깃 확대·`100dvh`·safe-area — voca와 동일 규칙

## 로컬 확인
```bash
python3 -m http.server 8789 -d apps/voca-tutorial
# → http://localhost:8789
```

## 배포
Cloudflare Pages 프로젝트 `broodev-voca-tutorial` (Root directory `apps/voca-tutorial`, 빌드 없음) + 커스텀 도메인 `voca-tutorial.broodev.com`.
