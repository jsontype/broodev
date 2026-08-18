#!/usr/bin/env python3
"""
코인 앱 생성기 v2 (2026-08-07) — apps/btc(현행 템플릿)를 복제해 apps/<sub>에
실제 코인 앱을 채운다. (v1은 broodev.com 루트 시절 앵커라 폐기)

현행 템플릿 전제:
 - 자기참조 도메인이 https://btc.broodev.com (2026-08-07 구조 전환)
 - 런타임 코인 레지스트리(const COINS)·호스트 인식(window.__SUBCOIN)·
   서브도메인 푸터 내비·미들웨어 COIN_HOSTS 가 존재한다.

사용법:
  python scripts/gen_coin.py eth            # 한 개
  python scripts/gen_coin.py all            # 전부(14종)

원칙: 블라인드 치환 금지.
 - 보호구역(푸터 내비·COINS 레지스트리·COIN_NAMES·COIN_HOSTS)은 플레이스홀더로
   빼놓고 치환 후 복원한다 — 코인명 목록이 깨지면 안 된다.
 - 자기참조 URL 만 <sub>.broodev.com 으로. 비트코인 전용 해설 페이지(BTC_ONLY)는
   복제하지 않으며, 코인 앱 sitemap 은 핵심 3 URL 로 재생성한다.
 - _redirects 는 표준 404 폴백으로 덮어쓴다(과거 301 스텁 제거 — 이게 핵심).
"""
import json, os, re, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "apps", "btc")
DATA = json.load(open(os.path.join(ROOT, "scripts", "coins.json"), encoding="utf-8"))["coins"]

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

# 코인명/티커 치환에서 통째로 보호할 블록 (이름표 목록이 깨지면 안 됨)
PROTECT_INDEX = [
    ("FOOTNAV", r'<nav class="foot-fam".*?</nav>'),
    ("REGISTRY", r'const COINS = \[.*?\]'),
    ("COINNAMES", r'var COIN_NAMES = \{.*?\};'),
]
PROTECT_MW = [("COINHOSTS", r'const COIN_HOSTS = \{.*?\};')]


def apply_names(text, names):
    for lang, src in sorted(NAME_SRC.items(), key=lambda kv: -len(kv[1])):
        text = text.replace(src, names[lang])
    return text


def protect(text, zones):
    saved = {}
    for tag, pat in zones:
        m = re.search(pat, text, re.S)
        if not m:
            raise SystemExit(f"보호구역 앵커 실패: {tag}")
        saved[tag] = m.group(0)
        text = text[: m.start()] + f"@@{tag}@@" + text[m.end():]
    return text, saved


def restore(text, saved):
    for tag, block in saved.items():
        text = text.replace(f"@@{tag}@@", block)
    return text


def brand(text, c):
    text = text.replace("BTC_SIGNAL", f"{c['ticker']}_SIGNAL")
    return re.sub(r"\bBTC\b", c["ticker"], text)


def transform_index(html, c):
    sub, base, names = c["sub"], f"https://{c['sub']}.broodev.com", c["names"]
    html, saved = protect(html, PROTECT_INDEX)
    html = html.replace("https://btc.broodev.com", base)   # 자기참조 전부
    html = brand(html, c)
    html = apply_names(html, names)
    html = html.replace("bitcoin fear and greed index",
                        f"{names['en'].lower()} fear and greed index")
    html = restore(html, saved)
    # 푸터 내비 현재 마커: btc 스팬 → 링크, 자기 코인 링크 → 스팬
    html = html.replace('<span class="cur" data-coin="btc" aria-current="page">비트코인</span>',
                        '<a data-coin="btc" href="https://btc.broodev.com/">비트코인</a>')
    own = re.search(rf'<a data-coin="{sub}" href="https://{re.escape(sub)}\.broodev\.com/">(.*?)</a>', html)
    if not own:
        raise SystemExit(f"푸터 자기 코인 링크 앵커 실패: {sub}")
    html = html.replace(own.group(0),
                        f'<span class="cur" data-coin="{sub}" aria-current="page">{own.group(1)}</span>')
    return html


def transform_middleware(js, c):
    js, saved = protect(js, PROTECT_MW)
    js = js.replace("https://btc.broodev.com", f"https://{c['sub']}.broodev.com")
    js = brand(js, c)
    js = apply_names(js, c["names"])
    return restore(js, saved)


def transform_generic(text, c):
    text = text.replace("https://btc.broodev.com", f"https://{c['sub']}.broodev.com")
    text = brand(text, c)
    return apply_names(text, c["names"])


def transform_url_only(text, c):
    return text.replace("https://btc.broodev.com", f"https://{c['sub']}.broodev.com")


TRANSFORMS = {
    "index.html": transform_index,
    "functions/_middleware.js": transform_middleware,
    "seo-i18n.js": transform_generic,
    "foot-i18n.js": transform_generic,
    "privacy.html": transform_generic,
    "terms.html": transform_generic,
    "og-image.html": transform_generic,
    "404.html": transform_generic,
    "robots.txt": transform_url_only,
}
# 그대로 복사: ads.txt(동일 pub ID), 파비콘, og-*.png(코인별 썸네일은 TODO), content.css


def gen(c):
    sub = c["sub"]
    base = f"https://{sub}.broodev.com"
    dst = os.path.join(ROOT, "apps", sub)
    shutil.rmtree(dst, ignore_errors=True)
    shutil.copytree(SRC, dst)
    for junk in BTC_ONLY:
        p = os.path.join(dst, junk)
        if os.path.isdir(p):
            shutil.rmtree(p)
        elif os.path.exists(p):
            os.remove(p)
    for rel, fn in TRANSFORMS.items():
        p = os.path.join(dst, rel)
        if not os.path.exists(p):
            continue
        with open(p, encoding="utf-8") as f:
            txt = f.read()
        txt = fn(txt, c)
        with open(p, "w", encoding="utf-8", newline="") as f:
            f.write(txt)
    # sitemap: 핵심 3 URL 재생성 (비트코인 가이드 URL 이 코인 도메인에 실리면 안 됨)
    with open(os.path.join(dst, "sitemap.xml"), "w", encoding="utf-8", newline="") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n'
                '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
                f'  <url><loc>{base}/</loc></url>\n'
                f'  <url><loc>{base}/privacy.html</loc></url>\n'
                f'  <url><loc>{base}/terms.html</loc></url>\n'
                '</urlset>\n')
    # 과거 301 스텁 제거 — 표준 404 폴백으로
    with open(os.path.join(dst, "_redirects"), "w", encoding="utf-8", newline="") as f:
        f.write("/*  /404.html  404\n")
    print(f"  generated apps/{sub}  ({c['ticker']} / {c['id']})")


def main():
    args = sys.argv[1:]
    if not args:
        print("usage: gen_coin.py <sub...|all>")
        sys.exit(1)
    by_sub = {c["sub"]: c for c in DATA}
    picks = DATA if args == ["all"] else [by_sub[a.lower()] for a in args]
    print(f"generating {len(picks)} coin app(s) from apps/btc ...")
    for c in picks:
        gen(c)
    print("done.")


if __name__ == "__main__":
    main()
