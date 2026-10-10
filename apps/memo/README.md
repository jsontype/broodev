# MEMO — 쿠키 메모장 (memo.broodev.com)

설치·가입 없이 브라우저에서 바로 쓰는 메모장. 입력 즉시 자동 저장 · 열면 자동 복원 · (선택) Google 계정으로 다른 기기와 동기화.
무빌드 정적 앱(자기완결형 바닐라 JS, 프레임워크·번들러 없음) — Cloudflare Pages 프로젝트 Root = `apps/memo`.

## 구조

```
apps/memo/
  index.html          정적 셸(ko 기본) · SEO head(hreflang 13 · OG · JSON-LD WebApplication+FAQPage) · #root 바깥 정적 SEO 본문 · 푸터
  config.js           운영자 설정 — GOOGLE_CLIENT_ID (빈 값 = 동기화 「준비 중」)
  css/memo.css        ui-terminal 네온 그린 토큰(복사·축약) + 레이아웃(목록|편집기, 760px 이하 한 화면 하나)
  js/i18n.js          13개 언어 사전(UI·토스트·SEO 본문·FAQ) + detectLang(?lang → localStorage memo:lang → navigator.languages → en)
  js/sync.js          DOM 없는 병합(3-way LWW · 충돌 사본 · 묘비) + Drive REST v3(appDataFolder) 클라이언트 · Node 테스트 대상
  js/store.js         DOM 없는 로컬 저장소(localStorage 읽고-병합-쓰기 · 탭 간 병합) + 파일 형식(.txt/.md/.json) · Node 테스트 대상
  js/app.js           화면 연결(목록·편집기·검색·정렬·고정·삭제/되돌리기·내보내기/가져오기·단축키·상태 표시·GIS 토큰)
  favicon.svg/.ico · favicon-96x96.png · apple-touch-icon.png   글자 아이콘 M
  404.html · _redirects(/* → 404) · robots.txt · sitemap.xml · ads.txt
  og-image.png        공유 썸네일 1200×630 — node scripts/og/gen_og.mjs memo
```

## 저장 방식

| 계층 | 위치 | 언제 |
|---|---|---|
| 로컬 | 메모마다 `localStorage['memo:n:<id>']` + 색인 `memo:idx:v2` (이 브라우저·기기에만 — 「쿠키처럼」). 큰 메모 하나가 용량(출처당 약 500만 자)을 넘겨도 그 메모만 실패하고 나머지는 저장 — 실패 중에는 떠날 때 경고 + 「.json 백업 받기」 안내. 옛 형식 `memo:notes:v1` 은 첫 저장 때 자동 이전 | 입력 600ms 뒤 · Ctrl/⌘+S 즉시 · 탭 숨김/닫기 직전 |
| Google | 사용자 본인 Drive 의 **appDataFolder** `memo-notes.json` (앱 전용 숨김 폴더) | 저장 3초 뒤 · 「지금 동기화」/Ctrl/⌘+S · 앱 열 때 · 탭 복귀 · 온라인 복귀 |

- 이름은 「쿠키」지만 쿠키(4KB)가 아니라 localStorage 를 쓴다(화면 도움말에 쉽게 설명).
- 메모 = `{ id, text, pinned, createdAt, updatedAt, deleted?, conflictOf? }`. 본문은 textarea 원문 그대로, 화면에는 textContent 로만 그린다(HTML 렌더 없음).
- **병합(3-way)**: base = 마지막 합의 시점 `{id: updatedAt}`. 한쪽만 바뀜 → 그쪽, 둘 다 바뀜 → 최신(LWW) + 진 쪽은 `(충돌 사본)` 메모로 보존,
  삭제는 묘비(90일 뒤 정리). base 보다 오래된 판은 늦게 도착한 낡은 사본으로 보고 이기지 못한다(탭별 localStorage 캐시 지연 대비).
  원격 파일이 없거나 깨졌으면 base 를 버리고 로컬 전부를 올린다 — **데이터 유실 0** 원칙.
- **다른 탭**: 저장은 항상 「다시 읽고 → 병합 → 쓰기」, `storage` 이벤트로 즉시 반영 + 알림. 탭 사이에서는 「없음」을 삭제로 보지 않는다(삭제는 묘비로만).
- Google 액세스 토큰은 **메모리에만**(storage 에 쓰지 않음). 연결 여부·fileId·base 만 `localStorage['memo:gsync:v1']`.

## Google 동기화 켜기 (운영자 1회 · Google OAuth 설정)

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
6. **확인** — 배포 뒤 https://memo.broodev.com 에서 「Google 계정으로 동기화」 → 동의 창의 요청 권한이 「Google Drive 의 자체 구성 데이터 보기·만들기·삭제」 한 줄뿐인지 →
   다른 브라우저(또는 시크릿 창)에서 같은 계정으로 연결해 데이터가 넘어오는지 → 「연결 해제」 뒤 <https://myaccount.google.com/permissions> 에서 앱이 빠졌는지.

빈 값이면 버튼이 「Google 동기화 — 준비 중」으로 비활성 표시되고 나머지 기능은 모두 정상 동작한다.

동작: 「Google 계정으로 동기화」 → GIS 토큰 클라이언트(`accounts.google.com/gsi/client`) 팝업 → appDataFolder 에서 파일 찾기/만들기 → 병합.
이전에 연결한 브라우저에서 앱을 열면 조용히 토큰을 다시 요청한다. 브라우저가 팝업을 막으면 상태가 「동기화 대기 중」이 되고 「다시 연결」 버튼이 뜬다.
401 → 토큰 재요청 후 1회 재시도. 오프라인/실패 → 로컬 저장은 계속, 나중에 다시 시도. 두 기기가 동시에 처음 연결해 `memo-notes.json` 이 둘 생기면, 다음 동기화에서 가장 오래된 파일(createdTime)에 내용을 합치고 나머지를 지운다.
「연결 해제」 → 유효한 토큰이 없으면(조용한 재연결이 막혔거나 만료) 클릭 안에서 새 토큰을 받아 `google.accounts.oauth2.revoke` + 연결 정보 삭제(메모·Drive 사본은 유지). 철회하지 못하면 Google 권한 페이지 링크를 안내한다.

## 배포 (Cloudflare Pages)

- 새 Pages 프로젝트: Git 연결, **Root directory = `apps/memo`**, 빌드 명령 없음, 출력 디렉터리 = `/`(루트).
- 커스텀 도메인 `memo.broodev.com` (Pages 의 Custom domains 에서 추가하면 DNS 레코드가 자동 생성된다).
- AdSense: 인증 메타 + Auto Ads 스크립트(운영 도메인 *.broodev.com 에서만 로드) + `ads.txt` 포함. 사이트 추가·심사 승인 후 노출. CMP(3버튼)는 AdSense 콘솔에서.
- 배포 후: Search Console 사이트맵 제출(`https://memo.broodev.com/sitemap.xml`). 포털 카탈로그(`apps/home/assets/js/catalog.js`)의 `status: 'soon'` 을 `'live'` 로.

## 검증

```bash
node scripts/verify-memo.mjs          # 저장소 · 탭 간 병합(지연 읽기 포함) · LWW/충돌 사본 · 묘비/정리 · 가짜 Drive(401·404·오프라인·깨진 파일) · 파일 형식
( python -m http.server 8931 --bind 127.0.0.1 --directory apps/memo >/dev/null 2>&1 & )
node scripts/i18n-scan.mjs --url http://127.0.0.1:8931/ --set qs:lang --langs all --wait 4000      # 빈 상태
node scripts/cdp-shot.mjs --url "http://127.0.0.1:8931/?lang=de" --out shot.png [--mobile]
```

## 단축키

`Ctrl/⌘+S` 즉시 저장(+동기화) · `Ctrl/⌘+N` 새 메모(Chrome 등 일부 브라우저는 Ctrl+N 을 새 창으로 가로채므로 `Alt+N` 도 지원).
