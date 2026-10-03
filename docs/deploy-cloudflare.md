# Cloudflare Pages 배포 가이드 (broodev 모노레포)

레포 1개(`jsontype/bitcoin` → 추후 `broodev`)를 Cloudflare Pages에 연결하고, **앱마다 별도 Pages 프로젝트**를 만들어 각자 서브도메인에 배포한다. DNS·도메인이 이미 Cloudflare에 있어 서브도메인 연결이 한 번에 된다.

| Pages 프로젝트 | Root directory | 빌드 | 도메인 |
| --- | --- | --- | --- |
| `broodev-web`   | **`apps/home`** (§1-D · 2026-10-03 포털로 전환) | 없음(정적) | broodev.com (+ www) |
| `broodev-btc` | `apps/btc` (§1-D · 비트코인 정본 호스트) | 없음(정적 + Pages Function) | btc.broodev.com — 2026-07-16 삭제 → 08-31 부활(루트 복제) → **10-03 부터 유일한 btc 배포** |
| `broodev-admin` | `apps/admin` | 없음(정적)        | admin.broodev.com |
| `broodev-dev` | `apps/dev` (dev1·dev2·dev3 + 스위치 Function · 구 home1·2·3) | 없음(정적 + Pages Function) | dev.broodev.com (§1-D) |
| ~~`broodev-home`~~ | ~~`apps/home`~~ | — | ~~home.broodev.com~~ **2026-10-03 폐기** — 내용이 `apps/dev` 로 이동. 프로젝트 삭제 또는 dev.broodev.com 으로 301 (§1-D) |
| `broodev-utils` | `apps/utils` (구 megahouse) | 없음(정적) | utils.broodev.com (§2-B) |

---

## 0. 사전
- Cloudflare 계정에 `broodev.com` 존재(DNS 관리 중) — 완료됨.
- GitHub 레포가 public 이고 master 에 이 모노레포가 머지되어 있을 것.

## 1. web (broodev.com) — 정적
1. Cloudflare 대시보드 → **Workers & Pages → Create → Pages → Connect to Git** → 레포 선택.
2. 프로젝트 이름 `broodev-web`.
3. **Build settings**
   - Framework preset: **None**
   - Build command: *(비움)*
   - Build output directory: `.`
   - **Root directory (advanced): `apps/web`**
4. Save and Deploy → `*.pages.dev` 프리뷰 확인.
5. **Custom domains** 탭 → `broodev.com` 추가 → (원하면 `www.broodev.com` 도) → CF가 DNS 레코드를 자동 생성/검증.

## 1-D. (2026-10-03) 루트 = 앱 포털(`apps/home`) · btc → btc.broodev.com · home → dev ⭐ 현행

> §1-B/§1-C/§2-B 는 **이력**이다. 2026-10-03 기준 구조:
> **broodev.com = 포털**(`apps/home`, AIXOR 템플릿 · 전체 앱 카테고리 모달) · **btc.broodev.com = 비트코인 앱**(`apps/btc`) · **dev.broodev.com = 개발자 소개**(`apps/dev` = 구 `apps/home/home1·2·3` → `dev1·2·3` + 스위치 Function, 활성 `dev3`) · home.broodev.com 은 폐기.

**레포에 이미 반영된 것(코드)** — 커밋·푸시만 하면 된다:
- `apps/btc` 자기참조 URL 전부 `https://broodev.com` → `https://btc.broodev.com`(canonical·hreflang·og·JSON-LD·sitemap·robots·미들웨어 `IMG`·가이드 11장·member) — `scripts/set_root.mjs btc --sub` 와 동일 결과. `apps/home`(포털)의 자기참조는 처음부터 `https://broodev.com/`.
- `scripts/gen_coin.py` 의 원본 호스트가 `btc.broodev.com` 으로 바뀌었고 코인 14종을 재생성(변경은 호스트 참조 10줄뿐 — 코인 앱 안의 "비트코인" 링크가 자기 호스트를 가리키던 버그도 함께 수정). `scripts/verify-coins.mjs` 기대값 갱신.
- 다른 앱이 BTC 앱으로 거는 링크(dev1 `app.jsx` PROJECTS · dev1 404 · dev2 · dev3) → `https://btc.broodev.com`. "broodev.com" 을 **회사/포털**로 가리키는 링크(인포패널 푸터·publisher·utils 404 등)는 그대로 — 이제 실제로 포털이므로 맞다.
- `apps/dev/functions/_middleware.js`(`ACTIVE = 'dev3'`, env `DEV_ACTIVE`) · `apps/dev/README.md` · 구 공사중 페이지 삭제. `ads.txt` 는 루트 도메인에만 의미가 있으므로 `apps/home/ads.txt` 로 복사(동일 pub ID).

**Cloudflare 에서 할 일(순서대로):**
1. **루트 → 포털**: Workers & Pages → `broodev-web` → Settings → Builds & deployments → **Root directory `apps/btc` → `apps/home`** 저장 → Deployments → **Retry deployment**(푸시 전이면 푸시가 곧 재배포). Build watch paths 를 쓰고 있다면 `apps/home/*` 로.
2. **btc 호스트 확보** — `https://btc.broodev.com` 이 현재 200 으로 살아 있다. 어느 프로젝트가 서빙 중인지 확인:
   - `broodev-web` 의 Custom domains 에 `btc.broodev.com` 이 붙어 있다면 → 1번 뒤 그 호스트도 **포털**이 돼 버린다. 거기서 도메인을 **제거**하고, 새 Pages 프로젝트 `broodev-btc`(Connect to Git · 같은 레포 · Framework None · Build command 비움 · output `.` · **Root directory `apps/btc`**)를 만들어 Custom domains 에 `btc.broodev.com` 추가(DNS 는 자동 생성). Functions(`apps/btc/functions/`)는 자동 인식.
   - 이미 별도 프로젝트 `broodev-btc`(Root `apps/btc`)가 서빙 중이면 → 할 일 없음(푸시로 새 canonical 이 배포됨).
3. **www**: `www.broodev.com` 은 현재 미해석(ENOTFOUND). 쓰려면 `broodev-web` Custom domains 에 추가(포털로 감). 안 쓰면 그대로.
4. **dev.broodev.com**: `broodev-dev` 는 Root `apps/dev` 그대로 — 건드릴 것 없음. 푸시 후 `/` 가 dev3(JSONTYPE 프리로더) 로 뜨고 `/dev1/` `/dev2/` `/dev3/` 는 미리보기(noindex) 인지 확인. Functions 가 처음 생기는 프로젝트이므로 배포 로그에 "Functions" 번들이 올라갔는지 확인(Build output `.` 이면 자동). 홈 전환은 `ACTIVE` 수정 또는 Settings → Variables → `DEV_ACTIVE=dev2` + Retry.
5. **home.broodev.com 정리**: `broodev-home` 프로젝트(있다면)는 Root `apps/home` 이라 그대로 두면 **포털 복제본**이 된다 → 둘 중 하나:
   - (권장) Custom domains 에서 `home.broodev.com` 제거 → 프로젝트 **삭제** → DNS 에 남은 `home` CNAME 삭제. 외부에 뿌린 home.broodev.com 링크가 있으면 존 **Redirect Rule**(`home.broodev.com/*` → `https://dev.broodev.com/${1}` 301) 하나 추가(DNS 에 `home` 프록시 레코드가 있어야 룰이 탄다).
   - 또는 프로젝트 유지 + Root directory 를 `apps/dev` 로 바꿔 dev 와 동일 내용 서빙(중복 콘텐츠 — 비권장).
6. **Build watch paths**(선택): `broodev-web` → `apps/home/*`, `broodev-btc` → `apps/btc/*`, `broodev-dev` → `apps/dev/*`.
7. **캐시/공유 썸네일**: 루트가 통째로 바뀌므로 Caching → **Purge Everything** 1회. 카카오톡 미리보기는 `https://developers.kakao.com/tool/debugger/sharing` 에서 `https://broodev.com/` · `https://dev.broodev.com/` 캐시 초기화.
8. **확인**: `https://broodev.com/` 포털 렌더(헤더 Apps (33) → 모달) · `/ads.txt` `/robots.txt` `/sitemap.xml` `/og-image.png` 200 · `https://btc.broodev.com/` 대시보드 + `view-source` 의 canonical 이 `https://btc.broodev.com/` · `https://eth.broodev.com/` 푸터 "비트코인" 링크가 btc.broodev.com · `https://dev.broodev.com/` dev3 · `https://home.broodev.com/` 미해석 또는 301.
9. **Search Console**(선택): `broodev.com` 속성의 사이트맵은 포털 1 URL 로 바뀜. btc 가이드 페이지 색인을 유지하려면 `btc.broodev.com` 속성 추가 + `https://btc.broodev.com/sitemap.xml` 제출. 루트의 옛 btc URL(`/methodology` 등)은 포털에서 404 가 되므로, 유지가 중요하면 존 Redirect Rule `broodev.com/(methodology|indicators|glossary|guide-fear-greed|...)` → `https://btc.broodev.com/$1` 301 을 추가(선택).

> ⚠ AdSense: 2026-07 에 "루트가 얇은 포털"이라 탈락했던 이력이 있다(§1-B). 지금은 AdSense 추진 중단 상태(adsense-compliance.md §0-E)라 당장 영향은 없지만, 재심사를 다시 하게 되면 루트가 포털이라는 점을 감안할 것. 포털은 소개·원칙·카테고리·대표 앱·연락 섹션 + 앱 33종 목록을 가진 콘텐츠형으로 만들었다.

## 1-B. (AdSense 대응) broodev.com 루트 = btc 앱으로 전환 — 🗂 이력(2026-07 ~ 2026-10-03, §1-D 로 대체)
`broodev.com` 루트가 AdSense **“가치 없는 콘텐츠”**로 미충족됨(2026-07). 심사 관문인 루트에 얇은 포털 대신 **콘텐츠가 풍부한 btc 앱을 서빙**한다. 코드 준비(canonical=`https://broodev.com/`, 정적 푸터, `privacy.html`·`terms.html`, sitemap/robots)는 이미 `apps/btc` 에 반영됨 — Cloudflare에서 루트만 재지정하면 된다.

1. Cloudflare → `broodev-web` 프로젝트 → **Settings → Builds & deployments → Root directory** 를 `apps/web` → **`apps/btc`** 로 변경.
2. **Retry deployment**(또는 새 커밋 push)로 재배포.
3. `btc.broodev.com`(`broodev-btc`) 중복 콘텐츠 처리 — 둘 중 하나:
   - (권장) `apps/btc` 의 canonical 이 이미 `https://broodev.com/` 이므로 그대로 둬도 검색엔진이 루트로 통합.
   - 또는 `broodev-btc` 에 `_redirects` 파일 추가로 301: `/*  https://broodev.com/:splat  301`
4. 전파 후 확인: `https://broodev.com/` 이 **대시보드 렌더** + `https://broodev.com/ads.txt`·`/privacy.html`·`/terms.html` 이 **200**.
5. AdSense → 사이트 `broodev.com` **재심사 요청**.

> 회사 포털(`apps/web`)은 심사 통과 후 `broodev.com/about` 서브경로나 별도 서브도메인으로 재배치 예정. 지금은 루트를 btc로 두는 것이 우선.

## 1-C. (AdSense 대응 2차) 코인 복제본 14개 통합 ⭐⭐ — **가장 중요**

§1-B(루트=btc)를 적용했는데도 **또 “가치가 별로 없는 콘텐츠”로 탈락**했다. 원인은 루트가 아니라 **property 전체**였다.

**무엇이 문제였나**
- 코인 앱 15종이 **전부 2277줄, 서로 91% 동일**(코인 이름만 치환)
- 15개 전부 `index, follow` + **AdSense 게재** + 서로를 링크
- → AdSense **“복제된 콘텐츠가 있는 화면”** + **“가치가 별로 없는 콘텐츠”** 직격

**레포에 이미 반영된 조치 (코드)**
- 루트 `apps/btc` 에 **코인 선택기** 추가 → `broodev.com/?coin=eth` 로 15종 전부 서빙
- 코인 서브도메인 14개(`apps/{eth,xrp,...}`): `noindex` + canonical→루트 + **AdSense 스크립트 제거** + `sitemap.xml` 삭제 + 상호링크 제거
  - `robots.txt` 의 `Allow: /` 는 **그대로 둔다** — 크롤이 막히면 `noindex` 를 읽지 못해 색인이 안 빠진다.
  - ⚠️ **`noindex` 만으로는 AdSense가 해결되지 않는다.** `noindex` 는 *검색 색인* 지시일 뿐이고, AdSense 정책은 **광고가 게재되는 화면**에 적용된다. 그래서 **광고 스크립트 제거(= 광고 재고에서 제외)** 가 핵심이다.

**✅ 마무리 완료 (2026-07-16)** — 존 Redirect Rule 대신 **레포의 `apps/<coin>/_redirects`**
(`/* https://broodev.com/?coin=<coin> 301`) 로 처리했고 **라이브 301 작동 확인**
(`curl -I https://eth.broodev.com/` → `301` + `Location: https://broodev.com/?coin=eth`).
`btc.broodev.com` 은 프로젝트·DNS 자체를 삭제해 호스트 소멸.

> ⚠️ **배포 후 유령 캐시 주의** — 옛 배포가 장기 캐시(`s-maxage`) 응답을 남기면
> **Purge Everything·Custom Purge·재배포로도 안 지워지는 경우가 있다** (실제로 `broodev.com/adsense/` 가 그랬다).
> 그때는 존 **Redirect Rule** 로 해당 경로를 앞단에서 301 처리하라 — 룰은 캐시 조회보다 먼저 실행돼 무조건 이긴다.
> 상세: [`adsense-compliance.md`](adsense-compliance.md) §0-B "유령 캐시 사건".

## 2. admin (admin.broodev.com) — 정적
1. 위와 동일하게 새 Pages 프로젝트 `broodev-admin`, Root directory `apps/admin`, 빌드 없음, output `.`.
2. Custom domains → `admin.broodev.com` 추가.
3. **Google OAuth 설정** (로그인 동작용):
   - Google Cloud Console → 사용자 인증 정보 → **OAuth 2.0 클라이언트 ID(웹)** 생성.
   - **승인된 자바스크립트 원본**: `https://admin.broodev.com` + CF 프리뷰 도메인(`https://broodev-admin.pages.dev`).
   - 발급된 ID를 `apps/admin/app.jsx` 의 `GOOGLE_CLIENT_ID` 에 입력 후 커밋.
   - ⚠ admin 은 `noindex` 이고 클라이언트측 로그인은 임시 보호임. 실제 데이터 수집/보안은 백엔드(서버리스 + DB + 서버측 토큰 검증) 필요.

## 2-B. home(home1·home2·home3) · utils(구 megahouse) — dev 리네임 + 구 y-systems 레포 통합 (2026-10-01, 10-02 갱신) — 🗂 home 부분은 이력

> **2026-10-03:** 아래의 `apps/home/home1·2·3` 는 **`apps/dev/dev1·2·3`** 로 이동했고 `broodev-dev`(dev.broodev.com) 가 서빙한다(Root `apps/dev` 그대로, 스위치 Function 은 `apps/dev/functions/_middleware.js` · env `DEV_ACTIVE`). `apps/home` 은 이제 **루트 포털**이다(§1-D). `broodev-home`/home.broodev.com 은 폐기 대상. utils 부분은 그대로 유효.

- `apps/dev` 의 포털 내용 → **`apps/home/home1`** 로 이동. `apps/dev` 는 **공사중 페이지(`index.html`, 200) + `404.html`** 만 남겨 `broodev-dev`(Root `apps/dev`) 프로젝트가 그대로 빌드되고 dev.broodev.com 은 공사중 안내(home.broodev.com 바로가기 포함)를, 그 외 경로는 404 를 서빙한다(Pages 는 루트 `404.html` 을 커스텀 404 로 사용).
  ⚠ 코인 앱·voca 등 **41개 파일의 공통 푸터**(`made by Y-Systems ↗`·`◈ dev`·`다른 앱`)가 dev.broodev.com 을 가리킨다 → 푸시 후 전부 공사중 페이지로 온다.
- 구 `jsontype/y-systems` 레포의 `home/html/` → **`apps/home/home2/`**(업적 포트폴리오), `apps/megahouse/` → `apps/megahouse/`(사진→엑셀·PPT 격자 · 2026-10-02 `apps/utils/` 로 개명) 로 이전. 둘 다 **순수 정적**(React·i18n·AdSense 없음). 원래 있던 `wrangler.toml` 은 broodev 관례(대시보드 Root directory 설정)에 맞춰 제거했다 — wrangler.toml 의 `name` 이 Pages 프로젝트명과 다르면 빌드가 실패하므로 두지 않는다.
- **2026-10-02: 홈 3종(home1·home2·home3)을 `apps/home/` 아래로 모아 Pages 프로젝트 하나(`broodev-home`)로 배포한다.** `apps/home/functions/_middleware.js` 의 `ACTIVE`(현재 `home3`)가 루트(/)에 띄울 홈을 고른다(내부 재작성, URL 그대로). `/home1/`·`/home2/`·`/home3/` 는 미리보기(noindex). home3 는 Davies 템플릿 기반 v3. 상세 [`apps/home/README.md`](../apps/home/README.md).
- 404 페이지: `home1`·`dev` 는 터미널 테마, `home2` 는 Photollax 룩, `home3` 는 Davies 셸, `utils` 는 AIZOX 셸 — 각 폴더 루트의 `404.html`. home 프로젝트는 활성 홈의 404.html 을 Function 이 404 로 돌려준다.

0. `broodev-dev` 는 **건드리지 않는다**(Root `apps/dev` 유지 → 공사중 페이지가 자동 배포). dev.broodev.com 을 홈으로 되돌리고 싶으면 `broodev-dev` 의 Root directory 를 `apps/home` 으로 바꾸면 된다(스위치 포함).
1. 새 Pages 프로젝트 `broodev-home` — Root directory `apps/home`, Build command 비움, output `.` (Functions 는 `apps/home/functions/` 를 자동 인식, 별도 설정 없음) → Custom domains `home.broodev.com`.
2. 새 Pages 프로젝트 `broodev-utils` — Root directory `apps/utils`, Build command 비움, output `.` → Custom domains `utils.broodev.com`
3. **Build watch paths** 를 각각 `apps/home/*`, `apps/utils/*` 로 제한(다른 앱 커밋에 재배포되지 않게). 전부 `*` 로 둬도 동작엔 문제 없음(무료 500빌드/월만 주의).
4. 확인: `https://home.broodev.com/` = home3 렌더 · `/home1/` `/home2/` `/home3/` 각각 렌더 + 응답 헤더 `X-Robots-Tag: noindex` · `/없는경로` → home3 룩의 404(상태 404) · `/index.html` → `/` 리다이렉트 · `broodev-home.pages.dev` 는 noindex.
5. 홈 전환: `_middleware.js` 의 `ACTIVE` 수정 후 푸시, 또는 Pages → Settings → Variables and Secrets → `HOME_ACTIVE=home2` + Retry deployment(커밋 없이).
6. 구 `y-systems-home`·`y-systems-megahouse` Pages 프로젝트는 **존재하지 않음**(2026-10-02 확인, pages.dev 미해석) → 삭제할 것 없음. `jsontype/y-systems` 레포는 아카이브. `y-systems.com` 은 Cloudflare 에 없음(Sav.com 등록 · Afternic 네임서버 · 2027-11 만료) — 쓸 계획이 생기면 Cloudflare 에 사이트 추가 + NS 변경.
7. samurai: `apps/games/st2` → **`games/samurai`** 로 이동(2026-10-02, apps 와 형제 폴더). 해당 Pages 프로젝트의 Root directory 를 `games/samurai` 로 변경(대시보드에서 직접).

> ⚠ `apps/home/home2/assets/js/custom.js` 의 문의 폼은 `assets/php/email.php` 로 POST 한다 — Pages 는 PHP 를 실행하지 않으므로 **동작하지 않는다**(y-systems 레포 시절부터 동일). home3 의 폼은 백엔드 없이 **mailto** 로 연다. 실제 수신 폼이 필요하면 Pages Function 또는 외부 폼 서비스로 교체.

## 3. btc (btc.broodev.com) — 2026-07-16 폐기 → **2026-10-03 유일한 btc 배포로 복귀**

> 2026-07-16 에 "루트와 중복 광고 클론"이라 삭제했고, 08-31 원복 때 루트 복제본으로 부활했다.
> **2026-10-03 부터 루트는 포털(§1-D)이고 `apps/btc` 는 btc.broodev.com 에만 배포된다** — 복제본 문제 없음.
> 같은 디렉터리를 두 호스트에 배포하면 광고 달린 완전 복제본이 생긴다는 원칙은 그대로다: `apps/btc` 를 루트와 btc 양쪽에 두지 말 것.
btc 의 `apps/btc/index.html` 은 자체완결 단일 파일(CDN React + 인라인)이라 **web/admin과 동일하게 빌드가 없다.**

- 프로젝트 `broodev-btc`, **Root directory: `apps/btc`**
- **Build command: 비움**
- **Build output directory: `/`**
- 보조 자산(sitemap/robots/ads.txt/og-image/adsense)은 이미 `apps/btc` 안에 있어 함께 발행됨.
- Custom domains → `btc.broodev.com` 추가.

### btc DNS 재지정 (GitHub Pages → Cloudflare Pages)
현재 `btc` CNAME 레코드는 GitHub Pages(`jsontype.github.io`)를 가리킨다. CF Pages로 옮기려면:
1. CF Pages `broodev-btc` → Custom domains → `btc.broodev.com` 추가 시도.
2. 충돌하면 DNS 탭에서 기존 `btc → jsontype.github.io` 레코드를 **삭제** → CF Pages가 자기 레코드를 생성하게 둔다.
3. 전파 후 `https://btc.broodev.com` 이 CF Pages 본을 가리키는지 확인.

## 4. GitHub Pages 은퇴 (완료)
btc 가 CF Pages(btc.broodev.com)에서 정상 확인되어 GitHub Pages는 은퇴함:
- ✅ `.github/workflows/deploy-pages.yml` 삭제됨
- ✅ `apps/btc/CNAME` 삭제됨
- (남은 수동 작업) GitHub 저장소 **Settings → Pages** 에서 비활성화 + 기존 `btc → jsontype.github.io` DNS 레코드가 남아있으면 삭제.

## 5. 배포 후 체크리스트 (2026-10-03 현행)
- [ ] https://broodev.com — **앱 포털** 렌더(히어로 영상 · 헤더 `Apps (33)` → 전체화면 모달 · 카테고리 6종) + `/ads.txt` `/robots.txt` `/sitemap.xml` `/og-image.png` 200
- [ ] https://btc.broodev.com — **코인 시그널 대시보드** 정상 렌더(백지 아님) + canonical `https://btc.broodev.com/` + `/sitemap.xml` 200
- [ ] `node scripts/verify-runtime.js` — 5경로 "실행 OK" (btc index.html 을 건드린 배포라면 필수) · `node scripts/verify-coins.mjs`
- [ ] https://eth.broodev.com — 코인 앱 렌더 + 푸터 "비트코인" 링크 = btc.broodev.com (코인 서브도메인 전체 동일)
- [ ] https://dev.broodev.com — dev3(JSONTYPE 프리로더) · `/dev1/` `/dev2/` 는 `X-Robots-Tag: noindex`
- [ ] https://home.broodev.com — 미해석 또는 dev.broodev.com 으로 301 (포털 복제본이면 안 됨)
- [ ] (이력) broodev.com/ads.txt · /sitemap.xml — 200
- [ ] broodev.com/adsense/ — 301 (존 Redirect Rule)
- [ ] `*.pages.dev` — `X-Robots-Tag: noindex` / 커스텀 도메인엔 없음
- [ ] https://admin.broodev.com — 로그인 게이트 표시(허용 계정만 진입)
- [ ] (선택) Search Console 색인 추이 확인 + sitemap 제출

전체 라이브 검증 세트: [`adsense-compliance.md`](adsense-compliance.md) 부록 A.

## 메모: 모노레포 자동 빌드 최적화
CF Pages 프로젝트별 **Build watch paths** 를 각 앱 폴더로 좁히면, 해당 앱이 바뀔 때만 재배포된다(예: `broodev-btc` 는 `apps/btc/*`, `broodev-web`(포털) 은 `apps/home/*` 변경 시에만).
