#!/usr/bin/env python3
"""
코인 앱 생성기 — apps/btc 템플릿을 복제해 apps/<sub> 를 찍어낸다.

사용법:
  python3 scripts/gen_coin.py eth            # 한 개
  python3 scripts/gen_coin.py eth xrp doge   # 여러 개
  python3 scripts/gen_coin.py all            # 전부

원칙: 블라인드 치환 금지. 앵커 기반 정밀 치환.
 - 자기참조 URL(canonical·og·hreflang·JSON-LD·sitemap·robots·middleware)만 <sub>.broodev.com 으로.
 - 공통 자매 푸터의 <nav class="foot-fam"> 는 보호구역 → 코인명/티커 치환 제외, 현재 코인만 마커 스왑.
 - API(ids/심볼/market_chart/응답키)·브랜드(BTC_SIGNAL)·티커(\\bBTC\\b)·13언어 코인명 치환.
 - og 썸네일 PNG 는 btc 것을 복사(코인별 재생성은 TODO).  ads.txt 는 그대로(같은 pub ID).
"""
import json, os, re, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "apps", "btc")
DATA = json.load(open(os.path.join(ROOT, "scripts", "coins.json"), encoding="utf-8"))["coins"]

# '비트코인' 어간 → 언어별 코인명 (어간 치환이라 러시아어 격변화/파생도 자연 처리)
NAME_SRC = {
    "en": "Bitcoin", "ko": "비트코인", "ja": "ビットコイン",
    "zh": "比特币", "zhHant": "比特幣", "th": "บิตคอยน์", "ru": "биткоин",
}

def apply_names(text, names):
    # 긴 소스부터(zhHant '比特幣' vs zh '比特币' 는 서로 다른 글자라 무관하지만 안전하게 정렬)
    for lang, src in sorted(NAME_SRC.items(), key=lambda kv: -len(kv[1])):
        text = text.replace(src, names[lang])
    return text

def transform_index(html, c):
    sub, tk, cid, sym = c["sub"], c["ticker"], c["id"], c["sym"]
    names = c["names"]
    base = f"https://{sub}.broodev.com"

    # 1) 자매 푸터 nav 보호 (코인명/티커 치환에서 제외)
    m = re.search(r'<nav class="foot-fam".*?</nav>', html, re.S)
    nav = m.group(0)
    html = html[:m.start()] + "@@FOOTNAV@@" + html[m.end():]

    # 2) API 엔드포인트/응답키 (하이픈 id 안전 위해 응답키는 브래킷 표기)
    html = html.replace("ids=bitcoin", f"ids={cid}")
    html = html.replace("coins/bitcoin/market_chart", f"coins/{cid}/market_chart")
    html = html.replace("BTCUSDT", f"{sym}USDT")
    html = html.replace("const b = j.bitcoin", f"const b = j['{cid}']")

    # 3) 자기참조 URL (앵커 기반 — 푸터/딴 링크 안 건드림)
    html = html.replace('<link rel="canonical" href="https://broodev.com/" />',
                        f'<link rel="canonical" href="{base}/" />')
    html = html.replace('hreflang="x-default" href="https://broodev.com/" />',
                        f'hreflang="x-default" href="{base}/" />')
    html = html.replace('href="https://broodev.com/?lang=', f'href="{base}/?lang=')
    html = html.replace('<meta property="og:url" content="https://broodev.com/" />',
                        f'<meta property="og:url" content="{base}/" />')
    html = html.replace('content="https://broodev.com/og-image.png"',
                        f'content="{base}/og-image.png"')
    html = html.replace('"url": "https://broodev.com/",', f'"url": "{base}/",')
    html = html.replace("broodev.com에 접속하면", f"{sub}.broodev.com에 접속하면")

    # 4) 브랜드/티커 (BTC_SIGNAL, BTCUSDT 는 이미 처리됨 → 남은 \bBTC\b 는 티커 라벨)
    html = html.replace("BTC_SIGNAL", f"{tk}_SIGNAL")
    html = re.sub(r"\bBTC\b", tk, html)

    # 5) 13언어 코인명 + 영문 키워드(소문자) 구문
    html = apply_names(html, names)
    html = html.replace("bitcoin fear and greed index",
                        f"{names['en'].lower()} fear and greed index")

    # 6) 푸터 nav 복원 + 현재 코인 마커 스왑
    nav = nav.replace('<span class="cur" aria-current="page">BTC</span>',
                      '<a href="https://broodev.com/">BTC</a>')
    nav = nav.replace(f'<a href="{base}/">{tk}</a>',
                      f'<span class="cur" aria-current="page">{tk}</span>')
    html = html.replace("@@FOOTNAV@@", nav)
    return html

def transform_seo_i18n(js, c):
    return apply_names(js, c["names"])

def transform_middleware(js, c):
    js = js.replace("const IMG = 'https://broodev.com'",
                    f"const IMG = 'https://{c['sub']}.broodev.com'")
    js = js.replace("BTC_SIGNAL", f"{c['ticker']}_SIGNAL")
    return apply_names(js, c["names"])

def transform_url_only(text, c):
    return text.replace("https://broodev.com/", f"https://{c['sub']}.broodev.com/")

def transform_generic(text, c):
    text = transform_url_only(text, c)
    text = text.replace("BTC_SIGNAL", f"{c['ticker']}_SIGNAL")
    text = re.sub(r"\bBTC\b", c["ticker"], text)
    return apply_names(text, c["names"])

# 파일별 변환기 (없는 파일은 그대로 복사)
TRANSFORMS = {
    "index.html": transform_index,
    "seo-i18n.js": transform_seo_i18n,
    "functions/_middleware.js": transform_middleware,
    "robots.txt": transform_url_only,
    "sitemap.xml": transform_url_only,
    "privacy.html": transform_generic,
    "terms.html": transform_generic,
    "og-image.html": transform_generic,
    "README.md": transform_generic,
}
# 손대지 않는 파일(그대로): ads.txt, favicons, og-*.png

def gen(c):
    sub = c["sub"]
    dst = os.path.join(ROOT, "apps", sub)
    shutil.rmtree(dst, ignore_errors=True)
    shutil.copytree(SRC, dst)
    # 광고버전(index.html)만 유지. member/(프리미엄·나중), adsense/(고아) 제외.
    for junk in ("member", "adsense"):
        shutil.rmtree(os.path.join(dst, junk), ignore_errors=True)
    for rel, fn in TRANSFORMS.items():
        p = os.path.join(dst, rel)
        if not os.path.exists(p):
            continue
        with open(p, encoding="utf-8") as f:
            txt = f.read()
        txt = fn(txt, c)
        with open(p, "w", encoding="utf-8") as f:
            f.write(txt)
    print(f"  generated apps/{sub}  ({c['ticker']} · {c['id']} · {c['sym']}USDT)")

def main():
    args = sys.argv[1:]
    if not args:
        print("usage: gen_coin.py <ticker...|all>"); sys.exit(1)
    by_sub = {c["sub"]: c for c in DATA}
    if args == ["all"]:
        picks = DATA
    else:
        picks = []
        for a in args:
            k = a.lower()
            if k not in by_sub:
                print(f"unknown coin: {a}"); sys.exit(1)
            picks.append(by_sub[k])
    print(f"generating {len(picks)} coin app(s) from apps/btc …")
    for c in picks:
        gen(c)
    print("done.")

if __name__ == "__main__":
    main()
