#!/usr/bin/env python3
"""
코인 앱 생성기 v5 (2026-10-10) — apps/btc(현행 템플릿)를 복제해 apps/<sub>에 코인 앱 14종을 채우고,
btc 의 SEO 생성물(functions/_lib/seo-meta.js · sitemap.xml)도 만든다. (v1 은 broodev.com 루트 시절 앵커라 폐기 · v2 = 2026-08-07 · v3 = 2026-10-10 1단계)
v4: 코인 고유 본문(scripts/coin-content/<sub>.json — 13개 언어)을 넣는다 — 아래 「코인 고유 본문」.
v5: 앱 JSX 가 index.html 밖(apps/btc/app.jsx → 미리 컴파일한 app.js)으로 나갔다 — 아래 「app.jsx」.

사용법:
  python scripts/gen_coin.py meta           # btc 만: functions/_lib/seo-meta.js + sitemap.xml 재생성(코인 메타 포함)
  python scripts/gen_coin.py eth            # meta + 코인 한 개
  python scripts/gen_coin.py all            # meta + 전부(14종)
  GEN_COIN_REPORT=1 python scripts/gen_coin.py eth   # 코인 문구 고침(지표 수 8→7 등)을 한 줄씩 출력
  node scripts/og/gen_coin_og.mjs [sub...]   # 코인 OG 썸네일(og-image.png=ko · og-en.png · og-ja.png) — apps/<sub>/og-image.html 을 찍는다
검증: node scripts/verify-coins.mjs
필요: node(코인마다 app.jsx → app.js 컴파일 — scripts/build-jsx.mjs · @babel/standalone)

현행 템플릿 전제:
 - 자기참조 도메인이 https://btc.broodev.com (2026-10-03: 루트 broodev.com 은 포털(apps/home))
 - 런타임 코인 레지스트리(const COINS)·호스트 인식(window.__SUBCOIN)·서브도메인 푸터 내비·미들웨어 COIN_HOSTS 가 존재한다.

원칙: 블라인드 치환 금지.
 - 보호구역(PROTECT)은 플레이스홀더로 빼놓고 치환 후 복원한다: 코인명 목록(푸터 내비·COINS·COIN_NAMES·COIN_HOSTS),
   비트코인 앱으로 가는 링크, 그리고 **비트코인 고유 서술**(공포·탐욕 지수의 정의 「비트코인 투자 심리」, Alternative.me 지수의 「BTC 중심」,
   비트코인 전용 글의 이름·소개 — 해설 글 목록 · DEEP 링크 이름 · 「비트코인 바닥」 해설 페이지). 이런 문장은 코인 사이트에서도 비트코인 그대로가 사실이다.
 - 자기참조 호스트(btc.broodev.com)만 <sub>.broodev.com 으로. 포털(https://broodev.com/)·dev.broodev.com 링크는 그대로.
 - 비트코인 전용 해설 페이지(BTC_ONLY)는 복제하지 않는다. 그 글로 가는 상대 링크(정적 HTML · JSON-LD · JS 문자열)는 https://btc.broodev.com/<경로>
   절대 링크로 바꾸고, 코인 _redirects 에 그 경로들 → btc 301 을 둔다(404 catch-all 앞).
 - 코인 지표는 7개(THERM = Thermocap 은 btc 전용 — index.html INDICATOR_META). 코인 문구의 「8개 지표」는 7 로, Thermocap 언급은 뺀다(13개 언어 · COIN_FIXES).
 - btc 의 검색엔진 소유확인 토큰(naver-site-verification)은 코인 호스트에 복사하지 않는다(코인 호스트는 별도 사이트).
 - sitemap: 핵심 3 URL(/ · /privacy · /terms) × 13개 언어 버전 + hreflang(xhtml:link) 전체.

코인 고유 본문(v4) — scripts/coin-content/<sub>.json: { slug, ticker, updated, mvrv, langs: { <13개 언어>: { meta{t,d}, title, intro,
  coinH, coinP[], applyH, apply[], histH, hist[], faq[{q,a}] } } }. 없거나 깨졌으면 중단(지어내지 않는다).
 - index.html 정적 section.seo(ko): h1·소개 = title·intro, 그 뒤에 coinH/coinP · applyH/apply · histH/hist, FAQ(dl) = 코인 faq(공통 FAQ 대체 —
   공통 FAQ 는 15개 사이트가 같은 문장이라 중복 본문의 큰 몫이었다). section 에 data-coin="<sub>"(?coin= 이름 바꾸기 스크립트가 건너뜀).
 - seo-i18n.js: var COIN_SEO(13개 언어) → SEO[lang] 에 덮어쓴다(title·intro·faq 교체 + 새 키). 렌더러(btc seo-i18n.js build)는 새 키가 있으면 그린다.
 - JSON-LD FAQPage(data-ld="faq") = 코인 ko faq(화면 FAQ 와 같은 문구). ?lang 판에서는 미들웨어가 뺀다(번역판 FAQPage 는 없음).
 - <title>·description·og/twitter 제목·설명·og:image:alt = ko meta, DOC_TITLE·DOC_DESC(13개 언어) = 각 언어 meta → build_meta 가 COIN_META['/'] 로.
 - 「비트코인 공포지수란?」 제목(13개 언어)은 비트코인 그대로(보호구역 WHATISH) — 지수가 비트코인 중심 시장 전체 지수라서(코인 FAQ 「○○ 공포지수가 따로 있나요? — 없습니다」와 맞춤).
 - og-image.html: ₿ 기호 대신 티커, 긴 코인명은 제목 글자 크기를 줄여 2줄 안에. PNG 는 scripts/og/gen_coin_og.mjs 가 만들고, 재생성 때 btc 것과 다르면 보존한다.
 - 코인 sitemap lastmod = max(LASTMOD, 콘텐츠 updated).

app.jsx(v5 · 2026-10-10 브라우저 Babel 제거): btc 의 앱 본체는 apps/btc/app.jsx(원문)이고 index.html 에는 <script src="app.js?v=<해시>" defer> 한 줄만 있다.
 - 변환은 예전처럼 「index.html 한 덩어리」에 한다: join_index() 가 그 한 줄 자리에 app.jsx 본문을 예전 <script type="text/babel"> 블록 모양
   (6칸 들여쓰기)으로 끼워 넣고 → transform()(보호구역·문구 고침·개수 검사 그대로) → split_index() 가 다시 index.html 과 app.jsx 로 나눈다.
   그래서 PROTECT · COIN_FIXES · COUNT_EXPECT 의 index.html 개수는 JSX 를 포함한 값이다(나눌 필요 없음).
 - 코인 app.jsx 머리에는 「생성 파일」 주석, 그 뒤 node scripts/build-jsx.mjs <코인...> 로 app.js 컴파일 + index.html ?v= 갱신(btc 도 같이 다시 빌드).
 - build_meta 의 DOC_TITLE·DOC_DESC 도 합친 텍스트에서 읽는다(값은 app.jsx 에 있다).

SEO 메타(packages/seo/README.md L3) — functions/_lib/seo-meta.js 는 이 스크립트의 build_meta() 가 만든다(손으로 고치지 말 것):
 - META['/'][lang]     = app.jsx 의 DOC_TITLE[lang] · DOC_DESC[lang] (+ og 이미지) — 화면(App)이 언어 전환 때 쓰는 값과 같다
 - META['/<doc>'][lang] = i18n/<doc>.<lang>.html 조각의 data-title · data-desc — content-i18n.js 가 화면에 쓰는 값과 같다
 - COIN_META[sub]      = 위와 같은 값을 코인 변환(이름·브랜드·지표 수)을 거친 문구로. '/' 는 ko 포함 13개 언어(ko = 코인 루트 기본 제목/설명).
   privacy·terms 는 btc 와 다를 때만 들어간다. 코인별로 덮어쓰려면 scripts/coins.json 의 코인 항목에
   "seoMeta": { "/": { "en": { "t": "...", "d": "..." } } } 를 넣는다(2단계 코인별 본문 메타용 — 화면의 DOC_TITLE/DOC_DESC 도 같이 맞출 것).
"""
import html as htmllib
import json, os, re, shutil, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "apps", "btc")
DATA = json.load(open(os.path.join(ROOT, "scripts", "coins.json"), encoding="utf-8"))["coins"]
REPORT = os.environ.get("GEN_COIN_REPORT") == "1"
CONTENT_DIR = os.path.join(ROOT, "scripts", "coin-content")

SRC_HOST = "btc.broodev.com"
SITE = "https://" + SRC_HOST
LANGS = ["en", "ja", "ko", "zh", "zh-Hant", "th", "es", "fr", "de", "it", "pt", "ru", "nl"]
LANGS12 = [l for l in LANGS if l != "ko"]
HREFLANG = {"zh": "zh-Hans"}
CONTENT_KEYS = ["meta", "title", "intro", "coinH", "coinP", "applyH", "apply", "histH", "hist", "faq"]
CONTENT_LISTS = ["coinP", "apply", "hist", "faq"]
LASTMOD = "2026-10-10"  # 2026-10-10: 전 페이지 hreflang · 언어별 주소 정본화(canonical 자기 자신) · 콘텐츠 title/description 길이 · 지표 수(v2 8개) 정정 — 바뀐 날

NAME_SRC = {
    "en": "Bitcoin", "ko": "비트코인", "ja": "ビットコイン",
    "zh": "比特币", "zhHant": "比特幣", "th": "บิตคอยน์", "ru": "биткоин",
}

# 비트코인 전용 콘텐츠 — 코인 앱에 복제하지 않는다
BTC_ONLY = [
    "member", "adsense", "about.html", "bitcoin-bottom.html", "drawdown-dca.html",
    "fear-greed-index.html", "glossary.html", "golden-cross.html", "guide-fear-greed.html",
    "indicators.html", "macd-guide.html", "mayer-multiple.html", "methodology.html",
    "rsi-guide.html",
]
BTC_ONLY_PATHS = [f[:-5] for f in BTC_ONLY if f.endswith(".html")]

# btc 색인 페이지(sitemap · seo-meta) — (경로, i18n 조각 이름, changefreq, priority)
BTC_PAGES = [
    ("/", None, "daily", "1.0"),
    ("/methodology", "methodology", "monthly", "0.9"),
    ("/indicators", "indicators", "monthly", "0.9"),
    ("/bitcoin-bottom", "bitcoin-bottom", "monthly", "0.9"),
    ("/guide-fear-greed", "guide-fear-greed", "monthly", "0.9"),
    ("/rsi-guide", "rsi-guide", "monthly", "0.8"),
    ("/macd-guide", "macd-guide", "monthly", "0.8"),
    ("/mayer-multiple", "mayer-multiple", "monthly", "0.8"),
    ("/fear-greed-index", "fear-greed-index", "monthly", "0.8"),
    ("/golden-cross", "golden-cross", "monthly", "0.8"),
    ("/drawdown-dca", "drawdown-dca", "monthly", "0.8"),
    ("/glossary", "glossary", "monthly", "0.7"),
    ("/about", "about", "monthly", "0.7"),
    ("/privacy", "privacy", "yearly", "0.3"),
    ("/terms", "terms", "yearly", "0.3"),
]
COIN_PAGES = [p for p in BTC_PAGES if p[0] in ("/", "/privacy", "/terms")]

# ---------------------------------------------------------------- app.jsx(v5) — index.html 과 합쳐서 변환하고 다시 나눈다
APP_TAG_RE = r'<script src="app\.js\?v=[0-9a-f]*" defer></script>'
APP_TAG = '<script src="app.js?v=0000000000" defer></script>'   # ?v= 는 build-jsx.mjs 가 채운다
JSX_OPEN = '<script type="text/babel" data-presets="react">'      # 합친 텍스트 안에서만 쓰는 옛 블록 모양(브라우저로 나가지 않음)
JSX_INDENT = "      "
COIN_JSX_HEAD = ("/* 생성 파일 — python scripts/gen_coin.py 가 apps/btc/app.jsx 를 이 코인용으로 바꾼 것(호스트·브랜드·코인명·지표 7개·고유 본문 메타). 손으로 고치지 말 것.\n"
                 " * 원본(apps/btc/app.jsx)을 고친 뒤 python scripts/gen_coin.py all → 코인마다 app.js 까지 컴파일된다(node scripts/build-jsx.mjs).\n"
                 " */\n")


def jsx_body(jsx):
    """app.jsx → 머리 주석(첫 /* … */)을 뗀 본문(LF)."""
    jsx = jsx.replace("\r\n", "\n")
    if jsx.startswith("/*"):
        jsx = jsx[jsx.index("*/\n") + 3:]
    return jsx


def join_index(html, jsx):
    """index.html 의 app.js 태그 자리에 app.jsx 본문을 옛 text/babel 블록 모양으로 끼운다(변환 전용 텍스트)."""
    body = re.sub(r"(?m)^(?=.)", JSX_INDENT, jsx_body(jsx))
    out, k = re.subn(APP_TAG_RE, lambda m: JSX_OPEN + "\n" + body + "    </script>", html.replace("\r\n", "\n"))
    if k != 1:
        raise SystemExit(f"index.html 의 app.js 태그 앵커 실패 — 기대 1, 실제 {k}")
    return out


def split_index(text):
    """join_index 의 반대 — (index.html, app.jsx 본문)."""
    ms = list(re.finditer(re.escape(JSX_OPEN) + r"\n(.*?\n)    </script>", text, re.S))
    if len(ms) != 1:
        raise SystemExit(f"JSX 블록 나누기 실패 — 기대 1, 실제 {len(ms)}")
    m = ms[0]
    lines = m.group(1).split("\n")
    bad = [l for l in lines if l and not l.startswith(JSX_INDENT)]
    if bad:
        raise SystemExit(f"JSX 블록 들여쓰기 깨짐: {bad[0][:60]!r}")
    body = "\n".join(l[len(JSX_INDENT):] for l in lines)
    return text[:m.start()] + APP_TAG + text[m.end():], body


def read_index(d):
    """앱 폴더의 index.html + app.jsx → 합친 변환용 텍스트."""
    return join_index(read(os.path.join(d, "index.html")), read(os.path.join(d, "app.jsx")))


def build_jsx(subs):
    """app.jsx → app.js 컴파일 + index.html ?v= 갱신(scripts/build-jsx.mjs)."""
    r = subprocess.run(["node", os.path.join(ROOT, "scripts", "build-jsx.mjs"), *subs, "--quiet"], cwd=ROOT)
    if r.returncode != 0:
        raise SystemExit(f"build-jsx 실패(exit {r.returncode}) — node scripts/build-jsx.mjs {' '.join(subs)}")


# ---------------------------------------------------------------- 보호구역
# (태그, 정규식, 기대 개수) — 개수가 다르면 중단(템플릿이 바뀐 것)
BTC_NAME_RE = r"(?:Bitcoin|비트코인|ビットコイン|比特币|比特幣|บิตคอยน์|биткоин)"
PROTECT = {
    "index.html": [
        ("FOOTNAV", r'<nav class="foot-fam".*?</nav>', 1),
        ("REGISTRY", r"const COINS = \[.*?\]", 1),
        ("COINNAMES", r"var COIN_NAMES = \{.*?\};", 1),
        # 비트코인 앱으로 가는 링크 — 코인 호스트로 바뀌면 안 됨
        ("BTCLINK1", r"btcLink\.href = 'https://btc\.broodev\.com/'", 1),
        ("BTCLINK2", r"v === 'btc' \? 'https://btc\.broodev\.com/'", 1),
        # 비트코인 고유 서술(코인 사이트에서도 사실 그대로)
        ("SEOGUIDES", r'<ul class="seo-guides">.*?</ul>', 2),          # 비트코인 전용 글 목록(이름·소개)
        ("FNGDEF", r"공포·탐욕 지수는 비트코인 투자 심리를", 1),          # 공포·탐욕 지수 정의(정적 본문)
        ("FNGDEFLD", r"비트코인 투자자들의 심리를", 1),                  # 〃 (FAQPage JSON-LD)
        ("BTCCENTER", r"\(BTC 중심\)", 1),                              # Alternative.me 지수 = 시장 전체(BTC 중심)
        ("WHATISH", r"<h2>비트코인 공포지수란\?</h2>", 1),                # 「비트코인 공포지수란?」 — 코인 전용 지수는 없다(v4)
        ("BOTTOMPAGE", r"[“']비트코인 바닥[”']", 2),                    # 「비트코인 바닥」 해설 페이지 이름
    ],
    "seo-i18n.js": [
        ("WHATISP", r"whatIsP: '(?:[^'\\]|\\.)*'", 13),                  # 공포·탐욕 지수 정의(13개 언어)
        ("WHATISH", r"whatIsH: '(?:[^'\\]|\\.)*'", 13),                  # 〃 제목(13개 언어) — 코인 전용 지수는 없다(v4)
        ("DEEP", r"var DEEP = \{.*?\n  \};", 1),                        # 비트코인 전용 글 링크 이름(13개 언어)
        ("BOTTOMPAGE", r'[“「«„"] ?[^”」»“"\n]{0,30}?' + BTC_NAME_RE + r'[^”」»“"\n]{0,30}? ?[”」»“"]', 13),
    ],
    "functions/_middleware.js": [
        ("COINHOSTS", r"const COIN_HOSTS = \{.*?\};", 1),
        ("BTCHOST", r"const BTC_HOST = '[^']*';", 1),
    ],
}

# ---------------------------------------------------------------- 코인 문구 고침(지표 7개 · Thermocap 없음)
# (옛 문구, 새 문구, 기대 개수) — 이름·브랜드 치환 뒤, 보호구역 복원 전에 적용
COIN_FIXES = {
    "index.html": [
        ("        <li><strong>Thermocap Z-점수</strong> — 시가총액 ÷ 누적 채굴자 수익, 사이클 과열·저평가 온체인 지표</li>\n", "", 1),
        ("(시총 vs 평균 매수원가)·Thermocap Z를 더한", "(시총 vs 평균 매수원가)를 더한", 1),
        ("·MVRV·Thermocap)", "·MVRV)", 1),
        ("MVRV Z-점수·Thermocap Z-점수 같은", "MVRV Z-점수 같은", 2),
        ("(MVRV·Thermocap)", "(MVRV)", 10),    # BOTTOM RADAR 설명(한국어·라틴·태국·러시아어)
        ("（MVRV·Thermocap）", "（MVRV）", 3),   # 〃 (일본어·중국어 간체/번체)
        (", THERM·Z", "", 10),                 # 프리미엄 안내(PREM_UI)의 고급 지표 목록 — 한국어·라틴·태국·러시아어 (2026-10-10)
        ("、THERM·Z", "", 3),                  # 〃 (일본어·중국어 간체/번체)
    ],
    "seo-i18n.js": [
        ("MVRV Z-점수·Thermocap Z-점수 같은", "MVRV Z-점수 같은", 1),
        ("such as the MVRV Z-Score and Thermocap Z-Score", "such as the MVRV Z-Score", 1),
        ("MVRV ZスコアやThermocap Zスコアなどの", "MVRV Zスコアなどの", 1),
        ("利用MVRV Z分数、Thermocap Z分数等", "利用MVRV Z分数等", 1),
        ("利用MVRV Z分數、Thermocap Z分數等", "利用MVRV Z分數等", 1),
        ("como el MVRV Z-Score y el Thermocap Z-Score", "como el MVRV Z-Score", 1),
        ("comme le MVRV Z-Score et le Thermocap Z-Score", "comme le MVRV Z-Score", 1),
        ("wie MVRV Z-Score und Thermocap Z-Score", "wie den MVRV Z-Score", 1),
        ("come MVRV Z-Score e Thermocap Z-Score", "come l’MVRV Z-Score", 1),
        ("como o MVRV Z-Score e o Thermocap Z-Score", "como o MVRV Z-Score", 1),
        ("таких как MVRV Z-оценка и Thermocap Z-оценка", "таких как MVRV Z-оценка", 1),
        ("zoals de MVRV Z-score en Thermocap Z-score", "zoals de MVRV Z-score", 1),
        ("อย่าง MVRV Z-Score และ Thermocap Z-Score", "อย่าง MVRV Z-Score", 1),
    ],
}
# 정규식 고침: (패턴, 바꿈, 기대 개수)
COIN_FIXES_RE = {
    "seo-i18n.js": [
        (r", '[^'\n]*Thermocap[^'\n]*'(?=\])", "", 13),   # 「매수 타이밍 점수 — 지표」 목록에서 Thermocap 항목
    ],
}
# 지표 수 8 → 7 (보호구역 밖 · 13개 언어) — (패턴, 바꿈). 파일별 총 개수는 COUNT_EXPECT 와 같아야 한다(템플릿 문구가 바뀌면 중단)
COUNT_RE = [
    (r"\bgli 8 (indicatori)", r"i 7 \1"),                                  # 이탈리아어 관사: gli/degli 8 → i/dei 7
    (r"\bdegli 8 (indicatori)", r"dei 7 \1"),
    (r"\bGli 8 (sotto-punteggi)", r"I 7 \1"),
    (r"(?<![\d/.,:])8/8(?![\d])", "7/7"),                                    # 지표 커버리지 8/8
    (r"(?<![\d/.,:])8(?=개 (?:실시간 )?(?:지표|부분점수))", "7"),               # 한국어
    (r"(?<=지표 )8(?=종)", "7"),
    (r"(?<![\d/.,:])8(?=つの|指標)", "7"),                                    # 일본어
    (r"(?<=指標)8(?=種)", "7"),
    (r"(?<![\d/.,:])8(?=\s?(?:个|個|项|項|指标))", "7"),                         # 중국어 간체/번체
    (r"(?<![\d/.,:])8(?= ตัว)", "7"),                                         # 태국어
    (r"(?<=จาก )8(?= )", "7"),
    (r"(?<=ทั้ง )8(?= )", "7"),
    (r"(?<![\d/.,:])8(?=\s(?:[\w\-]+\s){0,2}[\w\-]*(?:[Ii]ndica[td]|Indikat|индикатор))", "7"),   # 라틴·러시아어
    (r"(?<![\d/.,:])8(?= (?:sub|sous|Teil|sotto|deel|частичн)[\w\-]*)", "7"),
]
COUNT_EXPECT = {"index.html": 78, "seo-i18n.js": 63, "og-image.html": 3}


def rehost(text, c):
    """자기참조 호스트 치환 — https:// 유무와 무관하게(본문 표기 포함)."""
    return text.replace(SRC_HOST, f"{c['sub']}.broodev.com")


def apply_names(text, names):
    for lang, src in sorted(NAME_SRC.items(), key=lambda kv: -len(kv[1])):
        text = text.replace(src, names[lang])
    return text


def protect(text, zones, rel):
    saved = {}
    for tag, pat, n in zones:
        ms = list(re.finditer(pat, text, re.S))
        if len(ms) != n:
            raise SystemExit(f"보호구역 앵커 실패: {rel} {tag} — 기대 {n}, 실제 {len(ms)}")
        for i, m in reversed(list(enumerate(ms))):
            key = f"@@{tag}{i}@@"
            saved[key] = m.group(0)
            text = text[: m.start()] + key + text[m.end():]
    return text, saved


def restore(text, saved):
    for key, block in saved.items():
        if text.count(key) != 1:
            raise SystemExit(f"보호구역 복원 실패: {key}")
        text = text.replace(key, block)
    return text


def brand(text, c):
    text = text.replace("BTC_SIGNAL", f"{c['ticker']}_SIGNAL")
    # 티커는 ASCII 경계로 — 「BTC指標」처럼 CJK 가 바로 붙은 경우도 바꾼다(\b 는 CJK 를 단어 문자로 봐서 놓쳤다)
    return re.sub(r"(?<![A-Za-z0-9_])BTC(?![A-Za-z0-9_])", c["ticker"], text)


def coin_fix(rel, text, c):
    """코인 문구 고침 — 지표 7개(THERM 없음). 보호구역이 빠진 상태에서 돈다."""
    for old, new, n in COIN_FIXES.get(rel, []):
        k = text.count(old)
        if k != n:
            raise SystemExit(f"코인 문구 앵커 실패: {rel} {old[:40]!r} — 기대 {n}, 실제 {k}")
        text = text.replace(old, new)
    for pat, new, n in COIN_FIXES_RE.get(rel, []):
        text, k = re.subn(pat, new, text)
        if k != n:
            raise SystemExit(f"코인 문구 앵커 실패: {rel} {pat!r} — 기대 {n}, 실제 {k}")
    if rel in COUNT_EXPECT:
        total = 0
        for pat, new in COUNT_RE:
            def sub(m, pat=pat, new=new, src=text):
                out = m.expand(new)
                if REPORT:
                    a = max(0, m.start() - 40)
                    print(f"    [8→7] {c['sub']} {rel}: …{src[a:m.start()]}⟦{m.group(0)}→{out}⟧{src[m.end():m.end() + 30]}…".replace("\n", " "))
                return out
            text, k = re.subn(pat, sub, text)
            total += k
        want = COUNT_EXPECT[rel]
        if want is not None and total != want:
            raise SystemExit(f"지표 수 8→7 개수 불일치: {rel} — 기대 {want}, 실제 {total} (GEN_COIN_REPORT=1 로 확인)")
    return text


def absolutize(text):
    """비트코인 전용 글로 가는 상대 링크 → https://btc.broodev.com/<경로> (href · JSON-LD · JS 문자열)."""
    pat = r"""(["'])/(""" + "|".join(map(re.escape, BTC_ONLY_PATHS)) + r""")(?=["'#?])"""
    return re.sub(pat, lambda m: m.group(1) + SITE + "/" + m.group(2), text)


NAVER_RE = r'[ \t]*<meta name="naver-site-verification" content="[^"]*" />\r?\n'


def transform(rel, text, c):
    """btc 파일 한 개 → 코인 파일 텍스트."""
    sub, names = c["sub"], c["names"]
    if rel == "robots.txt":
        return rehost(text, c)
    text, saved = protect(text, PROTECT.get(rel, []), rel)
    text = rehost(text, c)
    text = brand(text, c)
    text = apply_names(text, names)
    if rel == "index.html":
        text = text.replace("bitcoin fear and greed index", f"{names['en'].lower()} fear and greed index")
    text = coin_fix(rel, text, c)
    text = restore(text, saved)
    if rel == "index.html":
        # 푸터 내비 현재 마커: btc 스팬 → 링크, 자기 코인 링크 → 스팬
        text = text.replace('<span class="cur" data-coin="btc" aria-current="page">비트코인</span>',
                            '<a data-coin="btc" href="https://btc.broodev.com/">비트코인</a>')
        own = re.search(rf'<a data-coin="{sub}" href="https://{re.escape(sub)}\.broodev\.com/">(.*?)</a>', text)
        if not own:
            raise SystemExit(f"푸터 자기 코인 링크 앵커 실패: {sub}")
        text = text.replace(own.group(0), f'<span class="cur" data-coin="{sub}" aria-current="page">{own.group(1)}</span>')
        # btc 의 검색엔진 소유확인 토큰은 코인 호스트에 복사하지 않는다
        text, k = re.subn(NAVER_RE, "", text)
        if k != 1:
            raise SystemExit("naver-site-verification 앵커 실패")
    if rel == "functions/_middleware.js":
        text, k = re.subn(r"^const SELF = '[a-z]+';", f"const SELF = '{sub}';", text, flags=re.M)
        if k != 1:
            raise SystemExit("미들웨어 SELF 앵커 실패")
    text = absolutize(text)
    # 코인 고유 본문(v4) — 치환이 끝난 뒤에 넣는다(본문의 「비트코인과 달리」 같은 비교 문장이 코인명으로 바뀌면 안 됨)
    if rel == "index.html":
        text = coin_index(text, c, content_of(c))
    elif rel == "seo-i18n.js":
        text = coin_seo_js(text, content_of(c))
    elif rel == "og-image.html":
        text = coin_og_html(text, c)
    return text


# ---------------------------------------------------------------- 코인 고유 본문(v4)
_CONTENT = {}


def content_of(c):
    """scripts/coin-content/<sub>.json — 형식 검사(13개 언어 · 키 · 언어별 항목 수 = ko). 없거나 깨졌으면 중단."""
    sub = c["sub"]
    if sub in _CONTENT:
        return _CONTENT[sub]
    p = os.path.join(CONTENT_DIR, sub + ".json")
    if not os.path.exists(p):
        raise SystemExit(f"코인 본문 없음: scripts/coin-content/{sub}.json")
    try:
        k = json.load(open(p, encoding="utf-8"))
    except ValueError as e:
        raise SystemExit(f"코인 본문 JSON 오류: {sub}.json — {e}")
    if k.get("slug") != sub or k.get("ticker") != c["ticker"]:
        raise SystemExit(f"코인 본문 slug/ticker 불일치: {sub}.json")
    langs = k.get("langs") or {}
    if sorted(langs) != sorted(LANGS):
        raise SystemExit(f"코인 본문 언어 불일치: {sub}.json — {sorted(langs)}")
    ko = langs["ko"]
    for l in LANGS:
        d = langs[l]
        miss = [x for x in CONTENT_KEYS if not d.get(x)]
        if miss or not d["meta"].get("t") or not d["meta"].get("d"):
            raise SystemExit(f"코인 본문 키 누락: {sub}.json {l} — {miss or 'meta.t/d'}")
        for x in CONTENT_LISTS:
            if len(d[x]) != len(ko[x]):
                raise SystemExit(f"코인 본문 항목 수 불일치: {sub}.json {l}.{x} — {len(d[x])} ≠ ko {len(ko[x])}")
        if any(not q.get("q") or not q.get("a") for q in d["faq"]):
            raise SystemExit(f"코인 본문 faq 형식: {sub}.json {l}")
    _CONTENT[sub] = k
    return k


def h(s):
    """HTML 텍스트·큰따옴표 속성값 이스케이프(& < > " — 작은따옴표는 그대로)."""
    return htmllib.escape(s, quote=False).replace('"', "&quot;")


def js_str(s):
    return "'" + s.replace("\\", "\\\\").replace("'", "\\'") + "'"


def subn1(pat, repl, text, what, flags=re.S):
    """정규식 치환 — 정확히 1곳(repl 은 함수: 치환 문자열의 역슬래시 해석을 피한다)."""
    out, k = re.subn(pat, repl, text, flags=flags)
    if k != 1:
        raise SystemExit(f"코인 본문 앵커 실패: {what} — 기대 1, 실제 {k}")
    return out


def coin_index(text, c, k):
    """index.html — 정적 메타·DOC_TITLE/DOC_DESC·FAQPage·section.seo 를 코인 본문으로."""
    L = k["langs"]
    ko = L["ko"]
    t, d = ko["meta"]["t"], ko["meta"]["d"]
    text = subn1(r"<title>[^<]*</title>", lambda m: f"<title>{h(t)}</title>", text, "<title>")
    text = subn1(r'(<meta\s+name="description"\s+content=")[^"]*(")', lambda m: m.group(1) + h(d) + m.group(2), text, "description")
    for sel, v in (('property="og:title"', t), ('property="og:description"', d), ('name="twitter:title"', t),
                   ('name="twitter:description"', d), ('property="og:image:alt"', t)):
        text = subn1(r'(<meta ' + re.escape(sel) + r' content=")[^"]*(")', lambda m, v=v: m.group(1) + h(v) + m.group(2), text, sel)
    # DOC_TITLE · DOC_DESC (13개 언어 — 화면 언어 전환 · build_meta → COIN_META)
    for name, key in (("DOC_TITLE", "t"), ("DOC_DESC", "d")):
        body = "\n".join(f"        {(js_str(l) if '-' in l else l)}: {js_str(L[l]['meta'][key])}," for l in LANGS)
        text = subn1(r"(const " + name + r" = \{\n).*?(\n\s*\}\n)", lambda m, body=body: m.group(1) + body + m.group(2), text, name)
    # FAQPage(ko) = 화면 FAQ
    ld = {"@context": "https://schema.org", "@type": "FAQPage",
          "mainEntity": [{"@type": "Question", "name": q["q"], "acceptedAnswer": {"@type": "Answer", "text": q["a"]}} for q in ko["faq"]]}
    js = json.dumps(ld, ensure_ascii=False, indent=2).replace("</", "<\\/")
    js = "\n".join("      " + x for x in js.split("\n"))
    text = subn1(r'(<script type="application/ld\+json" data-ld="faq">\n).*?(\n\s*</script>)', lambda m: m.group(1) + js + m.group(2), text, "FAQPage")
    # section.seo — 제목·소개 + 코인 블록, FAQ
    text = subn1(r'<section class="seo" aria-label="[^"]*">', lambda m: f'<section class="seo" data-coin="{c["sub"]}" aria-label="{h(ko["title"])}">', text, "section.seo")
    blk = [f"<h1>{h(ko['title'])}</h1>", "", f"<p>{h(ko['intro'])}</p>", "", f"<h2>{h(ko['coinH'])}</h2>"]
    blk += [f"<p>{h(x)}</p>" for x in ko["coinP"]]
    blk += ["", f"<h2>{h(ko['applyH'])}</h2>", "<ul>"] + [f"  <li>{h(x)}</li>" for x in ko["apply"]] + ["</ul>"]
    blk += ["", f"<h2>{h(ko['histH'])}</h2>", "<ul>"] + [f"  <li>{h(x)}</li>" for x in ko["hist"]] + ["</ul>"]
    blk = "\n".join(("      " + x) if x else "" for x in blk).lstrip()
    text = subn1(r'(<section class="seo" data-coin="[a-z]+" aria-label="[^"]*">\n\s*)<h1>.*?</h1>\s*<p>.*?</p>', lambda m: m.group(1) + blk, text, "h1·소개")
    dl = "<dl>\n" + "".join(f"        <dt>{h(q['q'])}</dt>\n        <dd>{h(q['a'])}</dd>\n" for q in ko["faq"]) + "      </dl>"
    text = subn1(r"(<h2>자주 묻는 질문</h2>\s*)<dl>.*?</dl>", lambda m: m.group(1) + dl, text, "FAQ dl")
    return text


def coin_seo_js(text, k):
    """seo-i18n.js — COIN_SEO(13개 언어)를 SEO 에 덮어쓴다(title·intro·faq 교체 + coinH 등 새 키)."""
    data = {l: {x: k["langs"][l][x] for x in CONTENT_KEYS if x != "meta"} for l in LANGS}
    js = ("  /* 코인 고유 본문 — 생성: python scripts/gen_coin.py (원본 scripts/coin-content/<코인>.json · 손으로 고치지 말 것).\n"
          "     title·intro·faq 는 공통 문구를 갈아끼우고 coinH·coinP·applyH·apply·histH·hist 는 새 키(build 가 그린다) */\n"
          "  var COIN_SEO = " + json.dumps(data, ensure_ascii=False, indent=1).replace("\n", "\n  ") + ";\n"
          "  Object.keys(COIN_SEO).forEach(function (l) { if (SEO[l]) for (var key in COIN_SEO[l]) SEO[l][key] = COIN_SEO[l][key]; });\n\n")
    anchor = "  window.SEO_I18N = SEO;\n"
    if text.count(anchor) != 1:
        raise SystemExit("seo-i18n.js SEO_I18N 앵커 실패")
    return text.replace(anchor, js + anchor)


def coin_og_html(text, c):
    """og-image.html — ₿(비트코인 기호) 대신 티커, 긴 코인명은 제목 글자 크기를 줄인다(2줄 안)."""
    tk = c["ticker"]
    text = subn1(r'<div class="badge">₿ ', lambda m: '<div class="badge">', text, "OG badge ₿")
    fs, y = (26, 59) if len(tk) <= 3 else (21, 57.5)
    text = subn1(r'<text x="50" y="60" font-size="34" (text-anchor="middle" fill="#00ff9c" font-family=")monospace(">)₿(</text>)',
                 lambda m: f'<text x="50" y="{y}" font-size="{fs}" font-weight="700" {m.group(1)}JetBrains Mono, monospace{m.group(2)}{tk}{m.group(3)}',
                 text, "OG ring ₿")
    fit = ("      document.getElementById('sub').textContent = m.s;\n"
           "      // 긴 코인명(코인 앱): 제목이 2줄을 넘으면 글자 크기를 줄인다(폰트 로드 뒤 — scripts/og/gen_coin_og.mjs 가 body[data-fit] 을 기다린다)\n"
           "      (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () {\n"
           "        var el = document.getElementById('title'), fs = 74;\n"
           "        if (lang === 'ko') el.style.wordBreak = 'keep-all'; // 한국어는 어절 단위로만 줄바꿈(「지|수」처럼 낱자에서 끊기지 않게 · 2026-10-10)\n"
           "        while (el.scrollHeight > 180 && fs > 40) { fs -= 2; el.style.fontSize = fs + 'px'; }\n"
           "        document.body.setAttribute('data-fit', fs);\n"
           "      });\n")
    text = subn1(r"      document\.getElementById\('sub'\)\.textContent = m\.s;\n", lambda m: fit, text, "OG fit")
    # 글 상자가 오른쪽 링(left 814px)과 겹치지 않게(짧은 코인명은 한 줄이 길어져 겹쳤다) · 강조 구절(<b>)은 줄 중간에서 끊지 않는다(「恐|怖」)
    text = subn1(r"(\.title \{[^}]*?max-width: )770px", lambda m: m.group(1) + "700px", text, "OG title width")
    text = subn1(r"(\.sub \{[^}]*?max-width: )770px", lambda m: m.group(1) + "700px", text, "OG sub width")
    text = subn1(r"\.title b \{ ", lambda m: ".title b { white-space: nowrap; ", text, "OG title b nowrap")
    # MVRV 데이터가 없는 코인(coin-content mvrv = none · stale)은 실시간 지표가 6개(MVRV 칸은 N/A) — 썸네일 부제도 6 으로(2026-10-10)
    if content_of(c).get("mvrv") != "available":
        for old, new in (("7 live indicators", "6 live indicators"), ("7つのリアルタイム指標", "6つのリアルタイム指標"), ("실시간 7개 지표", "실시간 6개 지표")):
            text = subn1(re.escape(old), lambda m, new=new: new, text, "OG live " + old)
    return text


TRANSFORMS = [
    "index.html", "functions/_middleware.js", "seo-i18n.js", "foot-i18n.js",
    "privacy.html", "terms.html", "og-image.html", "404.html", "robots.txt",
]
OG_FILES = ["og-image.png", "og-en.png", "og-ja.png"]
# 그대로 복사: ads.txt(동일 pub ID), 파비콘, content.css, content-i18n.js, lang-suggest.js, og-*.png(코인 썸네일이 있으면 보존 — gen() · gen_coin_og.mjs),
#              functions/_lib/*(seo-lang.js · seo-meta.js — seo-meta.js 는 코인 메타를 모두 담고 미들웨어가 호스트로 고른다)


# ---------------------------------------------------------------- SEO 메타 · sitemap
def read(p):
    with open(p, encoding="utf-8", newline="") as f:
        return f.read()


def write(p, text):
    """기존 파일의 줄바꿈(CRLF/LF)을 유지해서 쓴다(새 파일은 LF)."""
    crlf = False
    if os.path.exists(p):
        with open(p, "rb") as f:
            crlf = b"\r\n" in f.read()
    text = text.replace("\r\n", "\n")
    if crlf:
        text = text.replace("\n", "\r\n")
    with open(p, "w", encoding="utf-8", newline="") as f:
        f.write(text)


def js_dict(text, name):
    m = re.search(r"const " + name + r" = \{\n(.*?)\n\s*\}\n", text, re.S)
    if not m:
        raise SystemExit(f"{name} 앵커 실패")
    out = {}
    for mm in re.finditer(r"^\s+'?([\w-]+)'?: '((?:[^'\\]|\\.)*)',?\s*$", m.group(1), re.M):
        out[mm.group(1)] = re.sub(r"\\(.)", r"\1", mm.group(2))
    missing = [l for l in LANGS if l not in out]
    if missing:
        raise SystemExit(f"{name} 언어 누락: {missing}")
    return out


def static_meta(index_html):
    t = htmllib.unescape(re.search(r"<title>([^<]*)</title>", index_html).group(1))
    d = htmllib.unescape(re.search(r'<meta\s+name="description"\s+content="([^"]*)"', index_html).group(1))
    return t, d


def root_meta(index_html, origin, with_ko):
    dt, dd = js_dict(index_html, "DOC_TITLE"), js_dict(index_html, "DOC_DESC")
    st, sd = static_meta(index_html)
    if dt["ko"] != st or dd["ko"] != sd:
        raise SystemExit(f"DOC_TITLE.ko/DOC_DESC.ko 가 정적 <title>/description 과 다름({origin}) — index.html 을 맞출 것")
    out = {}
    for l in (LANGS if with_ko else LANGS12):
        m = {"t": dt[l], "d": dd[l]}
        if l != "ko":
            m["img"] = origin + ("/og-ja.png" if l == "ja" else "/og-en.png")
        out[l] = m
    return out


def frag_meta(text):
    m = re.search(r"<main\b[^>]*>", text)
    if not m:
        raise SystemExit("조각 <main> 없음")
    tag = m.group(0)
    t = re.search(r'data-title="([^"]*)"', tag)
    d = re.search(r'data-desc="([^"]*)"', tag)
    if not t or not d:
        raise SystemExit("조각 data-title/data-desc 없음")
    return {"t": htmllib.unescape(t.group(1)), "d": htmllib.unescape(d.group(1))}


def build_meta():
    index_html = read_index(SRC)   # index.html + app.jsx(DOC_TITLE·DOC_DESC 는 app.jsx 에 있다)
    META = {"/": root_meta(index_html, SITE, False)}
    frags = {}
    for path, doc, _, _ in BTC_PAGES:
        if not doc:
            continue
        META[path] = {}
        for l in LANGS12:
            txt = read(os.path.join(SRC, "i18n", f"{doc}.{l}.html"))
            frags[(doc, l)] = txt
            META[path][l] = frag_meta(txt)
    COIN_META = {}
    for c in DATA:
        origin = f"https://{c['sub']}.broodev.com"
        cm = {"/": root_meta(transform("index.html", index_html, c), origin, True)}
        for path, doc, _, _ in COIN_PAGES:
            if not doc:
                continue
            per = {l: frag_meta(transform_frag(frags[(doc, l)], c)) for l in LANGS12}
            if per != META[path]:
                cm[path] = per
        for path, per in (c.get("seoMeta") or {}).items():  # 코인별 덮어쓰기(2단계)
            for l, v in per.items():
                cm.setdefault(path, {}).setdefault(l, {}).update(v)
        COIN_META[c["sub"]] = cm
    js = ("// 생성 파일 — 손으로 고치지 말 것. 재생성: python scripts/gen_coin.py meta (코인 앱까지: python scripts/gen_coin.py all)\n"
          "// 원본: apps/btc/app.jsx 의 DOC_TITLE·DOC_DESC(루트) · apps/btc/i18n/<doc>.<lang>.html 의 data-title·data-desc(콘텐츠 페이지)\n"
          "//       · COIN_META = 같은 값을 gen_coin.py 의 코인 변환(이름·브랜드·지표 7개)에 통과시킨 것(+ scripts/coins.json 의 seoMeta 덮어쓰기)\n"
          "// 쓰는 곳: functions/_middleware.js → _lib/seo-lang.js (packages/seo/README.md L3)\n"
          "export const META = " + json.dumps(META, ensure_ascii=False, indent=1) + ";\n"
          "export const COIN_META = " + json.dumps(COIN_META, ensure_ascii=False, indent=1) + ";\n")
    write(os.path.join(SRC, "functions", "_lib", "seo-meta.js"), js)
    write(os.path.join(SRC, "sitemap.xml"), sitemap(SITE, BTC_PAGES))
    print(f"  wrote apps/btc/functions/_lib/seo-meta.js ({len(META)} paths · {len(COIN_META)} coins) + sitemap.xml")


def sitemap(origin, pages, lastmod=LASTMOD):
    def loc(path, l):
        u = origin + path
        return u if l == "ko" else u + "?lang=" + l
    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           "<!-- 생성 파일: python scripts/gen_coin.py meta|all — 페이지마다 13개 언어 주소(한국어 = 기준 주소, 나머지 ?lang=xx) + hreflang 묶음(packages/seo L4·L5) -->",
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for path, _, freq, prio in pages:
        alts = [f'    <xhtml:link rel="alternate" hreflang="{HREFLANG.get(l, l)}" href="{htmllib.escape(loc(path, l))}" />' for l in LANGS]
        alts.append(f'    <xhtml:link rel="alternate" hreflang="x-default" href="{htmllib.escape(loc(path, "en"))}" />')
        for l in LANGS:
            out.append("  <url>")
            out.append(f"    <loc>{htmllib.escape(loc(path, l))}</loc>")
            out.append(f"    <lastmod>{lastmod}</lastmod>")
            out.append(f"    <changefreq>{freq}</changefreq>")
            out.append(f"    <priority>{prio}</priority>")
            out.extend(alts)
            out.append("  </url>")
    out.append("</urlset>")
    return "\n".join(out) + "\n"


def transform_frag(txt, c):
    return absolutize(apply_names(brand(rehost(txt, c), c), c["names"]))


# ---------------------------------------------------------------- 코인 앱
def gen(c):
    sub = c["sub"]
    base = f"https://{sub}.broodev.com"
    dst = os.path.join(ROOT, "apps", sub)
    k = content_of(c)
    # 코인 OG 썸네일(scripts/og/gen_coin_og.mjs 생성물)은 btc 것과 다르면 보존한다(재생성이 btc 썸네일로 덮지 않게)
    keep = {}
    for fn_ in OG_FILES:
        p = os.path.join(dst, fn_)
        if os.path.exists(p):
            b = open(p, "rb").read()
            if b != open(os.path.join(SRC, fn_), "rb").read():
                keep[fn_] = b
    shutil.rmtree(dst, ignore_errors=True)
    shutil.copytree(SRC, dst, ignore=shutil.ignore_patterns(".wrangler"))
    for fn_, b in keep.items():
        with open(os.path.join(dst, fn_), "wb") as f:
            f.write(b)
    if len(keep) != len(OG_FILES):
        print(f"  ! {sub}: 코인 OG 썸네일 없음({len(keep)}/{len(OG_FILES)}) — node scripts/og/gen_coin_og.mjs {sub}")
    for junk in BTC_ONLY:
        p = os.path.join(dst, junk)
        if os.path.isdir(p):
            shutil.rmtree(p)
        elif os.path.exists(p):
            os.remove(p)
    # 콘텐츠 페이지 번역 조각(i18n/<doc>.<lang>.html — content-i18n.js 가 읽음, 2026-10-09): 비트코인 전용 페이지의 조각은 지우고,
    # 남는 것(privacy·terms·404)은 본문 HTML 과 같은 치환(호스트·브랜드·13언어 코인명 · btc 전용 글 링크 절대화)을 거친다
    i18n_dir = os.path.join(dst, "i18n")
    if os.path.isdir(i18n_dir):
        for fn_ in sorted(os.listdir(i18n_dir)):
            p = os.path.join(i18n_dir, fn_)
            if fn_.split(".")[0] + ".html" in BTC_ONLY:
                os.remove(p)
                continue
            write(p, transform_frag(read(p), c))
    for rel in TRANSFORMS:
        p = os.path.join(dst, rel)
        if not os.path.exists(p):
            continue
        if rel == "index.html":   # v5: index.html + app.jsx 를 한 덩어리로 변환한 뒤 다시 나눈다(컴파일은 main 이 한 번에)
            html, body = split_index(transform(rel, read_index(dst), c))
            write(p, html)
            write(os.path.join(dst, "app.jsx"), COIN_JSX_HEAD + body)
            continue
        write(p, transform(rel, read(p), c))
    write(os.path.join(dst, "sitemap.xml"), sitemap(base, COIN_PAGES, max(LASTMOD, k.get("updated") or LASTMOD)))
    # 비트코인 전용 글 → btc 의 같은 글로 301(코인 사이트에는 없음) · 나머지 없는 주소 → 404
    lines = ["# 생성 파일(scripts/gen_coin.py) — 비트코인 전용 글은 btc.broodev.com 의 같은 글로 301, 나머지 없는 주소는 404"]
    for p in BTC_ONLY_PATHS:
        lines.append(f"/{p}  {SITE}/{p}  301")
        lines.append(f"/{p}.html  {SITE}/{p}  301")
    lines.append("/*  /404.html  404")
    write(os.path.join(dst, "_redirects"), "\n".join(lines) + "\n")
    print(f"  generated apps/{sub}  ({c['ticker']} / {c['id']})")


def main():
    args = sys.argv[1:]
    if not args:
        print("usage: gen_coin.py meta | <sub...> | all")
        sys.exit(1)
    by_sub = {c["sub"]: c for c in DATA}
    build_meta()
    if args == ["meta"]:
        return
    picks = DATA if args == ["all"] else [by_sub[a.lower()] for a in args]
    print(f"generating {len(picks)} coin app(s) from apps/btc ...")
    for c in picks:
        gen(c)
    # app.jsx → app.js(btc 원본 + 생성한 코인) · index.html ?v=
    build_jsx(["btc"] + [c["sub"] for c in picks])
    print("done.")


if __name__ == "__main__":
    main()
