// Cloudflare Pages Function (엣지) — 언어별 주소 · 코인 호스트 · 공유 썸네일(OG) 메타 (2026-10-10 · packages/seo/README.md L3)
//
// 크롤러(구글·카톡·페북)는 JS 를 안 돌리거나 원본 HTML 의 메타를 믿는다. 그래서 응답 직전에 원본 HTML 을 고친다.
//  · ?lang=xx(ko 아님 · 13개 언어) — 모든 색인 경로(루트 + 콘텐츠 페이지 + privacy/terms): canonical·og:url = 자기 자신,
//    <html lang>(zh → zh-Hans), 그 페이지·그 언어의 title·description·og/twitter, og:locale, (루트) og:image. 번역 안 된 FAQPage([data-ld="faq"]) 제거.
//    나머지 JSON-LD(TechArticle·WebApplication)의 제목·설명·inLanguage·@id 와 og:image:alt 도 그 언어로(langExtra — Organization 의 설명문처럼 번역이 없는 문장은 뺌).
//    값은 functions/_lib/seo-meta.js — `python scripts/gen_coin.py meta` 가 app.jsx 의 DOC_TITLE·DOC_DESC 와 /i18n/<doc>.<lang>.html 조각에서 생성(손으로 고치지 말 것).
//  · ko(기준 언어) · ?lang 없음 · 미지원 lang → 원본 그대로(canonical = 확장자 없는 기준 주소). 200 이 아닌 응답(404 등)도 그대로.
//  · 코인 호스트(eth.broodev.com 등 14종): canonical·og:url·hreflang = 그 호스트 + 정규화 경로(+?lang), ?lang 없을 때 코인 제목/설명 덮기는 루트(/)만,
//    ?lang 버전 제목/설명 = 그 코인 이름의 13개 언어(seo-meta.js COIN_META).
//    로컬 검증용: env.COIN_HOST(예: wrangler pages dev --binding COIN_HOST=eth)가 있으면 그 코인 호스트로 간주(운영에는 없음).
//    요청 헤더로 코인을 바꾸지 않는다(캐시 오염).
//  · sand.broodev.com/?coin=X(X = 코인 14종) → https://X.broodev.com/ 301(?lang 유지). 호스트가 sand.broodev.com 일 때만(로컬 검증: --binding AS_BTC_HOST=1).
//  · *.pages.dev(프리뷰/기본 도메인) → X-Robots-Tag: noindex, nofollow (seo-lang.js).
// 이 파일은 scripts/gen_coin.py 가 코인 앱으로 복사한다(SITE 는 코인 호스트로 바뀌고, BTC_HOST·COIN_HOSTS·SELF 는 보호/설정됨).

import { seoLang, normPath, LANGS, HTML_LANG } from './_lib/seo-lang.js';
import { META, COIN_META } from './_lib/seo-meta.js';

const SITE = 'https://sand.broodev.com';
const BTC_HOST = 'btc.broodev.com';
// 이 앱이 어느 코인의 배포본인지(btc = btc 앱 자신). gen_coin.py 가 코인 앱에서 그 코인으로 바꾼다 — *.pages.dev 처럼 호스트로 코인을 알 수 없을 때의 기본값
const SELF = 'sand';
const COIN_HOSTS = {
  eth: ['이더리움', 'ETH'], xrp: ['리플', 'XRP'], doge: ['도지코인', 'DOGE'],
  bch: ['비트코인캐시', 'BCH'], link: ['체인링크', 'LINK'], xlm: ['스텔라루멘', 'XLM'],
  ltc: ['라이트코인', 'LTC'], avax: ['아발란체', 'AVAX'], shib: ['시바이누', 'SHIB'],
  dot: ['폴카닷', 'DOT'], pepe: ['페페', 'PEPE'], grt: ['더그래프', 'GRT'],
  sand: ['샌드박스', 'SAND'], mana: ['디센트럴랜드', 'MANA'],
};

class Attr { constructor(name, v) { this.n = name; this.v = v; } element(el) { el.setAttribute(this.n, this.v); } }
class Text { constructor(v) { this.v = v; } element(el) { el.setInnerContent(this.v); } }
// hreflang 묶음의 호스트만 코인 호스트로(경로·?lang 은 그대로)
class Rehost {
  constructor(origin) { this.o = origin; }
  element(el) {
    const h = el.getAttribute('href');
    if (!h) return;
    try { const u = new URL(h); el.setAttribute('href', this.o + u.pathname + u.search); } catch (e) { /* 상대 주소 등은 그대로 */ }
  }
}

function coinOf(url, env) {
  const forced = env && typeof env.COIN_HOST === 'string' ? env.COIN_HOST.trim().toLowerCase() : '';
  if (forced && COIN_HOSTS[forced]) return forced;
  const h = url.hostname.toLowerCase();
  if (h.endsWith('.broodev.com')) {
    const sub = h.slice(0, -'.broodev.com'.length);
    if (COIN_HOSTS[sub]) return sub;
    if (h === BTC_HOST) return null;
  }
  return COIN_HOSTS[SELF] ? SELF : null;
}

// 코인 호스트의 기준 처리(언어 무관): canonical·og:url·hreflang 호스트, 루트(/)·기준 언어면 코인 ko 제목/설명.
// req = seo-lang 이 넘긴 요청(언어판이면 조건부 헤더를 뺀 것) — 있으면 그것으로 자산을 받는다
async function coinBase(context, origin, meta, req) {
  const res = await (req ? context.next(req) : context.next());
  try {
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('text/html') || res.status !== 200) return res;
    const url = new URL(context.request.url);
    const path = normPath(url.pathname);
    let rw = new HTMLRewriter()
      .on('link[rel="canonical"]', new Attr('href', origin + path))
      .on('meta[property="og:url"]', new Attr('content', origin + path))
      .on('link[rel="alternate"][hreflang]', new Rehost(origin));
    const ko = path === '/' && meta['/'] && meta['/'].ko;
    if (ko) {
      rw = rw
        .on('title', new Text(ko.t))
        .on('meta[name="description"]', new Attr('content', ko.d))
        .on('meta[property="og:title"]', new Attr('content', ko.ot || ko.t))
        .on('meta[property="og:description"]', new Attr('content', ko.od || ko.d))
        .on('meta[name="twitter:title"]', new Attr('content', ko.ot || ko.t))
        .on('meta[name="twitter:description"]', new Attr('content', ko.od || ko.d));
    }
    const t = rw.transform(res);
    const out = new Response(t.body, t);
    out.headers.delete('etag'); // 고친 본문에 원본 자산 검증자를 붙이지 않는다(seo-lang.js 의 304 주석)
    out.headers.delete('last-modified');
    return out;
  } catch (e) {
    return res;
  }
}

// 번역 안 된 FAQPage: 루트는 <head> 의 [data-ld="faq"], 콘텐츠 페이지(bitcoin-bottom)는 <main> 안의 ld+json(조각과 구조를 맞추느라 표시를 못 붙임)
const REMOVE = '[data-ld="faq"], main script[type="application/ld+json"]';
const btcLang = seoLang({ origin: SITE, base: 'ko', meta: META, remove: REMOVE });
const coinLang = {};

// ?lang 언어판의 나머지 구조화 데이터·og:image:alt 를 그 언어로(L3 — 번역해서 갈아끼움). seo-lang 이 메타를 바꾼 응답에 한 번 더 건다.
//  · Article 류(TechArticle): headline = 그 언어 title(브랜드 꼬리 뗌) · description · inLanguage · mainEntityOfPage/url = 자기 주소
//  · WebApplication: name · description · url = 그 언어 · 자기 주소
//  · 그 밖(Organization 등): 번역이 없는 자유 문장(description)만 뺀다(이름·주소는 언어 무관)
const BRAND_TAIL = / \| (?:broodev|[A-Z]+_SIGNAL)$/;
function ldNode(n, o) {
  if (!n || typeof n !== 'object' || Array.isArray(n)) return n;
  const types = [].concat(n['@type'] || []);
  if (types.includes('FAQPage')) return n; // seo-lang 의 REMOVE 가 뺀다
  if (types.some((x) => /Article$/.test(String(x)))) {
    n.headline = o.m.t.replace(BRAND_TAIL, '');
    n.description = o.m.d;
    n.inLanguage = o.hl;
    if (n.mainEntityOfPage && typeof n.mainEntityOfPage === 'object') n.mainEntityOfPage['@id'] = o.self;
    else if (n.mainEntityOfPage) n.mainEntityOfPage = o.self;
    if (n.url) n.url = o.self;
  } else if (types.includes('WebApplication')) {
    n.name = o.m.ot || o.m.t;
    n.description = o.m.od || o.m.d;
    n.url = o.self;
  } else if ('description' in n) {
    delete n.description;
  }
  if (Array.isArray(n['@graph'])) n['@graph'] = n['@graph'].map((x) => ldNode(x, o));
  return n;
}
class LdLang {
  constructor(o) { this.o = o; this.buf = ''; }
  text(chunk) {
    this.buf += chunk.text;
    if (!chunk.lastInTextNode) { chunk.remove(); return; }
    const src = this.buf;
    this.buf = '';
    let out = src;
    try {
      const j = JSON.parse(src);
      const r = Array.isArray(j) ? j.map((x) => ldNode(x, this.o)) : ldNode(j, this.o);
      out = JSON.stringify(r).replace(/</g, '\\u003c');
    } catch (e) { /* 파싱 못 하면 원문 그대로 */ }
    chunk.replace(out, { html: true });
  }
}
function langExtra(res, url, origin, meta) {
  const lang = url.searchParams.get('lang');
  const path = normPath(url.pathname);
  const m = lang && lang !== 'ko' && LANGS.includes(lang) && meta[path] && meta[path][lang];
  if (!m || res.status !== 200 || !(res.headers.get('content-type') || '').includes('text/html')) return res;
  try {
    const o = { m, hl: HTML_LANG[lang] || lang, self: origin + path + '?lang=' + encodeURIComponent(lang) };
    const alt = m.ot || m.t;
    const t = new HTMLRewriter()
      .on('head script[type="application/ld+json"]', new LdLang(o))
      .on('meta[property="og:image:alt"]', new Attr('content', alt))
      .on('meta[name="twitter:image:alt"]', new Attr('content', alt))
      .transform(res);
    return new Response(t.body, t);
  } catch (e) {
    return res;
  }
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const coin = coinOf(url, context.env);

  // ?coin= 딥링크(구 구조) → 코인 서브도메인 정본으로 301. btc 호스트의 루트에서만
  const env = context.env || {};
  const onBtcHost = url.hostname.toLowerCase() === BTC_HOST || env.AS_BTC_HOST === '1'; // AS_BTC_HOST: 로컬 검증용 바인딩(운영에는 없음)
  if (!coin && onBtcHost && normPath(url.pathname) === '/') {
    const c = String(url.searchParams.get('coin') || '').trim().toLowerCase();
    if (COIN_HOSTS[c]) {
      const to = new URL('https://' + c + '.broodev.com/');
      const l = url.searchParams.get('lang');
      if (l) to.searchParams.set('lang', l);
      return Response.redirect(to.toString(), 301);
    }
  }

  if (!coin) return langExtra(await btcLang(context), url, SITE, META);

  const origin = 'https://' + coin + '.broodev.com';
  const meta = { ...META, ...(COIN_META[coin] || {}) };
  if (!coinLang[coin]) coinLang[coin] = seoLang({ origin, base: 'ko', meta, remove: REMOVE });
  return langExtra(await coinLang[coin]({ ...context, next: (req) => coinBase(context, origin, meta, req) }), url, origin, meta);
}
