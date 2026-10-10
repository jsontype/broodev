// broodev 언어별 주소 서버 메타 — 원본: packages/seo/seo-lang.js → 각 앱 functions/_lib/seo-lang.js 로 복사(node scripts/seo-sync.mjs). 앱 사본을 직접 고치지 말 것.
//
// 정책(packages/seo/README.md): 페이지마다 기준 언어 주소(P) + 나머지 12개 언어 주소(P?lang=xx). 각 주소의 원본 HTML 이 그 언어의 정본이 되도록
//   ?lang=xx(기준 언어 아님) 응답에서 canonical·og:url = 자기 자신, <html lang>, title·description, og/twitter 제목·설명, og:locale(+alternate 교체),
//   (선택) og:image 를 그 언어로 바꾸고, 번역되지 않은 구조화 데이터(기본: [data-ld="faq"])는 뺀다.
//   기준 언어 · 미지원 lang · 메타 없는 경로 → 원본 그대로(canonical = 기준 주소). 200 이 아닌 응답(404 등)도 그대로.
//   *.pages.dev(프리뷰/기본 도메인) → X-Robots-Tag: noindex, nofollow.
//
// 사용(앱의 functions/_middleware.js):
//   import { seoLang } from './_lib/seo-lang.js';
//   import META from './_lib/seo-meta.js';          // { '/': { en: { t, d, img? }, ja: {...}, ... }, '/pptx': {...} } — 앱 사전에서 생성(손으로 베끼지 말 것)
//   export const onRequest = seoLang({ origin: 'https://utils.broodev.com', base: 'ko', meta: META });
// 다른 미들웨어와 합칠 때: const lang = seoLang({...}); export async function onRequest(ctx) { ... return lang({ ...ctx, next: (req) => 다른처리(req ? { ...ctx, request: req } : ctx) }) }
//   (next 가 Request 인자를 받으면 언어판 요청에서 조건부 헤더를 뺀 요청이 전달된다 — 아래 ETag/304 주석)

export const LANGS = ['en', 'ja', 'ko', 'zh', 'zh-Hant', 'th', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'nl'];
export const HTML_LANG = { zh: 'zh-Hans' };
export const LOCALE = {
  en: 'en_US', ja: 'ja_JP', ko: 'ko_KR', zh: 'zh_CN', 'zh-Hant': 'zh_TW', th: 'th_TH', es: 'es_ES',
  fr: 'fr_FR', de: 'de_DE', it: 'it_IT', pt: 'pt_BR', ru: 'ru_RU', nl: 'nl_NL',
};

// '/index.html' · '/index' → '/' · '/pptx.html' → '/pptx' (Cloudflare Pages 는 .html 주소를 확장자 없는 주소로 308)
export function normPath(p) {
  let s = String(p || '/');
  s = s.replace(/\/index(\.html)?$/, '/').replace(/\.html$/, '');
  return s || '/';
}

class Attr { constructor(name, v) { this.n = name; this.v = v; } element(el) { el.setAttribute(this.n, this.v); } }
class Text { constructor(v) { this.v = v; } element(el) { el.setInnerContent(this.v); } }
class Remove { element(el) { el.remove(); } }
class LocaleAlt {
  constructor(cur, base) { this.cur = cur; this.base = base; }
  element(el) { if (el.getAttribute('content') === this.cur) el.setAttribute('content', this.base); }
}

export function langOf(url, { base = 'ko', param = 'lang' } = {}) {
  const v = new URL(url).searchParams.get(param);
  return v && v !== base && LANGS.includes(v) ? v : null;
}

export function seoLang({ origin, base = 'ko', meta = {}, param = 'lang', remove = '[data-ld="faq"]' }) {
  return async function onRequest(context) {
    const url = new URL(context.request.url);
    const lang = url.searchParams.get(param);
    const path = normPath(url.pathname);
    const m = lang && lang !== base && LANGS.includes(lang) && meta[path] && meta[path][lang];
    // 언어판은 원본 자산과 ETag 가 같다 → 조건부 요청(If-None-Match)이면 자산 서버가 304 를 줘서, seo-meta 만 바뀐 배포가
    // 브라우저·구글봇에 반영되지 않는다(wrangler 실측: ?lang=ja 에 기준 ETag 그대로 · 조건부 요청 → 304). 언어판 요청은 검증자를 빼고 받는다.
    let res;
    const rq = context.request;
    if (m && (rq.headers.has('if-none-match') || rq.headers.has('if-modified-since'))) {
      const h = new Headers(rq.headers);
      h.delete('if-none-match');
      h.delete('if-modified-since');
      res = await context.next(new Request(rq, { headers: h }));
    } else {
      res = await context.next();
    }
    let out = res;
    try {
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('text/html') && res.status === 200) {
        if (m) {
          const self = origin + path + '?' + param + '=' + encodeURIComponent(lang);
          const loc = LOCALE[lang];
          let rw = new HTMLRewriter()
            .on('html', new Attr('lang', HTML_LANG[lang] || lang))
            .on('link[rel="canonical"]', new Attr('href', self))
            .on('meta[property="og:url"]', new Attr('content', self))
            .on('title', new Text(m.t))
            .on('meta[name="description"]', new Attr('content', m.d))
            .on('meta[property="og:title"]', new Attr('content', m.ot || m.t))
            .on('meta[property="og:description"]', new Attr('content', m.od || m.d))
            .on('meta[name="twitter:title"]', new Attr('content', m.ot || m.t))
            .on('meta[name="twitter:description"]', new Attr('content', m.od || m.d))
            .on('meta[property="og:locale"]', new Attr('content', loc))
            .on('meta[property="og:locale:alternate"]', new LocaleAlt(loc, LOCALE[base]));
          if (m.img) {
            rw = rw.on('meta[property="og:image"]', new Attr('content', m.img))
              .on('meta[name="twitter:image"]', new Attr('content', m.img));
          }
          if (remove) rw = rw.on(remove, new Remove());
          const t = rw.transform(res);
          out = new Response(t.body, t);
          out.headers.delete('etag'); // 바뀐 본문에 원본 자산 검증자를 붙이지 않는다(위 304 문제)
          out.headers.delete('last-modified');
        }
      }
    } catch (e) {
      out = res;
    }
    if (url.hostname.endsWith('.pages.dev')) {
      out = new Response(out.body, out);
      out.headers.set('X-Robots-Tag', 'noindex, nofollow');
    }
    return out;
  };
}
