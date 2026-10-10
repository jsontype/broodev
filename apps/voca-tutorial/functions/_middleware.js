// Cloudflare Pages Function (엣지) — 언어별 주소(?lang=xx)의 원본 HTML 을 그 언어의 정본으로 (packages/seo/README.md L3)
// 크롤러는 JS를 안 돌리므로 ?lang= 에 따라 응답 직전에 바꾼다.
//   튜토리얼 본체(/): <html lang> · title/description/OG·트위터 메타 · canonical/og:url(자기 자신) · OG 이미지(og/og-image-<lang>.png) · JSON-LD ·
//                     정적 SEO 본문(section.seo)과 푸터를 그 언어로 — 값은 functions/_lib/seo-meta.js 의 TUT(index.html 사전에서 생성), 모양은 _lib/tut-seo.js.
//   privacy · terms : _lib/seo-lang.js(공용 사본) — canonical·<html lang>·title·description·OG 를 그 언어로(값 = i18n/<doc>.<lang>.html 의 data-title/desc 에서 생성).
//   기본(ko) 또는 미지원 lang → 원본 HTML 그대로(한국어 · canonical = ?lang 없는 주소).
//   *.pages.dev(프리뷰/기본 도메인) → X-Robots-Tag: noindex, nofollow (정본은 voca-tutorial.broodev.com).
// 문구를 고친 뒤: node scripts/seo-meta-voca.mjs (seo-meta.js · sitemap.xml · index.html 정적 한국어 본문 재생성)

import { seoLang, normPath, LANGS, LOCALE } from './_lib/seo-lang.js';
import META, { TUT } from './_lib/seo-meta.js';
import { BASE, BASE_LANG, seoHtml, footHtml, ldJson } from './_lib/tut-seo.js';

const pages = seoLang({ origin: BASE, base: BASE_LANG, meta: META });

class AttrSetter { constructor(v, a = 'content') { this.v = v; this.a = a; } element(el) { el.setAttribute(this.a, this.v); } }
class TextSetter { constructor(v) { this.v = v; } element(el) { el.setInnerContent(this.v); } }
class HtmlSetter { constructor(v, attrs = {}) { this.v = v; this.attrs = attrs; } element(el) { for (const k in this.attrs) el.setAttribute(k, this.attrs[k]); el.setInnerContent(this.v, { html: true }); } }
class LangSetter { constructor(v, tag) { this.v = v; this.tag = tag; } element(el) { el.setAttribute('lang', this.tag); el.setAttribute('data-seo-lang', this.v); } }
// og:locale:alternate 목록에서 현재 언어(이제 og:locale)를 ko_KR 로 바꿔 13개 로캘이 한 번씩만 나오게
class LocaleAltSwap { constructor(cur) { this.cur = cur; } element(el) { if (el.getAttribute('content') === this.cur) el.setAttribute('content', 'ko_KR'); } }

const langOf = (url) => { const l = url.searchParams.get('lang'); return l && l !== BASE_LANG && LANGS.includes(l) && TUT[l] ? l : null; };

function tutorial(res, url) {
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('text/html') || res.status !== 200) return res;
  const lang = langOf(url);
  if (!lang) return res; // ko/미지정/미지원 → 원본(한국어) 그대로
  const m = TUT[lang];
  const loc = LOCALE[lang]; // og:locale = 공용 LOCALE(pt → pt_BR · voca 와 같은 값). TUT.l 은 앱 LANGS.locale(TTS 용 pt-PT)에서 온 값이라 쓰지 않는다

  const self = BASE + '/?lang=' + encodeURIComponent(lang);
  const img = BASE + '/og/og-image-' + lang + '.png';
  const t = new HTMLRewriter()
    .on('html', new LangSetter(lang, lang === 'zh' ? 'zh-Hans' : lang))
    .on('title', new TextSetter(m.t))
    .on('meta[name="description"]', new AttrSetter(m.d))
    .on('link[rel="canonical"]', new AttrSetter(self, 'href'))
    .on('meta[property="og:url"]', new AttrSetter(self))
    .on('meta[property="og:title"]', new AttrSetter(m.t))
    .on('meta[property="og:description"]', new AttrSetter(m.d))
    .on('meta[property="og:locale"]', new AttrSetter(loc))
    .on('meta[property="og:locale:alternate"]', new LocaleAltSwap(loc))
    .on('meta[property="og:image"]', new AttrSetter(img))
    .on('meta[property="og:image:alt"]', new AttrSetter(m.a + ' VOCA_TUTORIAL'))
    .on('meta[name="twitter:title"]', new AttrSetter(m.t))
    .on('meta[name="twitter:description"]', new AttrSetter(m.d))
    .on('meta[name="twitter:image"]', new AttrSetter(img))
    .on('script[type="application/ld+json"]', new HtmlSetter(ldJson(lang, m)))
    .on('section.seo', new HtmlSetter(seoHtml(lang, m), { lang: lang === 'zh' ? 'zh-Hans' : lang, 'aria-label': m.a }))
    .on('footer.site-foot', new HtmlSetter(footHtml(lang, m), { 'aria-label': m.f[0] }))
    .transform(res);
  // 바뀐 본문에 원본 자산의 검증자(ETag)를 붙이지 않는다 — seo-lang.js 와 같은 이유(조건부 요청 → 304 로 옛 언어판이 남음)
  const out = new Response(t.body, t);
  out.headers.delete('etag');
  out.headers.delete('last-modified');
  return out;
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (normPath(url.pathname) !== '/') return pages(context); // privacy · terms · 자산 · 404 (pages.dev noindex 포함)
  // 언어판 요청은 조건부 헤더(If-None-Match 등)를 빼고 받는다 — 원본 자산과 ETag 가 같아 304 가 나면 서버 측 번역이 반영되지 않음
  const rq = context.request;
  let res;
  if (langOf(url) && (rq.headers.has('if-none-match') || rq.headers.has('if-modified-since'))) {
    const h = new Headers(rq.headers);
    h.delete('if-none-match');
    h.delete('if-modified-since');
    res = await context.next(new Request(rq, { headers: h }));
  } else {
    res = await context.next();
  }
  try { res = tutorial(res, url); } catch (e) { /* 원본 그대로 */ }
  if (url.hostname.endsWith('.pages.dev')) {
    res = new Response(res.body, res);
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return res;
}
