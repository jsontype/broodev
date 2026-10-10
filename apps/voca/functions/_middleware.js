// Cloudflare Pages Function (엣지) — 언어별 주소(?lang=xx)의 원본 HTML 을 그 언어의 정본으로 (packages/seo/README.md L3)
// 크롤러는 JS 를 안 돌리고 URL 의 HTML 만 읽는다. 그래서 ?lang= 에 따라 응답 직전에 바꾼다.
//   공통(_lib/seo-lang.js — packages/seo 공용 사본): canonical·og:url = 자기 자신, <html lang>, title·description, og/twitter 제목·설명, og:locale
//   여기서 더: og:image:alt(루트) · JSON-LD 를 그 언어로 — FAQPage = 화면의 FAQ 번역(seo-i18n.js), TechArticle 제목·설명·언어·@id, WebApplication 이름·설명
//   대상 = 루트(/) + 콘텐츠 페이지(가이드·소개·privacy·terms). 값은 _lib/seo-meta.js(앱 사전·i18n 조각에서 생성 — node scripts/seo-meta-voca.mjs).
//   기본(ko) · 미지원 lang · 메타 없는 경로(/contact 등) → 원본 HTML 그대로(한국어 · canonical = ?lang 없는 주소). 200 이 아닌 응답(404 등)도 그대로.
//   *.pages.dev(프리뷰/기본 도메인) → X-Robots-Tag: noindex, nofollow (seo-lang.js 가 붙임 · 정본은 voca.broodev.com)

import { seoLang, normPath, LANGS, HTML_LANG } from './_lib/seo-lang.js';
import META from './_lib/seo-meta.js';

const ORIGIN = 'https://voca.broodev.com';
const BASE = 'ko';
const lang = seoLang({ origin: ORIGIN, base: BASE, meta: META, remove: null });

class AttrSetter { constructor(v) { this.v = v; } element(el) { el.setAttribute('content', this.v); } }

// <script type="application/ld+json"> 본문을 모아 JSON 으로 고친 뒤 한 번에 바꿔 쓴다(텍스트가 여러 조각으로 올 수 있음)
class LdRewrite {
  constructor(fix) { this.fix = fix; this.buf = ''; }
  text(t) {
    this.buf += t.text;
    if (!t.lastInTextNode) { t.remove(); return; }
    let out = this.buf;
    try { out = JSON.stringify(this.fix(JSON.parse(this.buf))).replace(/</g, '\\u003c'); } catch (e) { out = this.buf; }
    this.buf = '';
    t.replace(out, { html: true });
  }
}

function ldFixer(l, path, m) {
  const tag = HTML_LANG[l] || l;
  const self = ORIGIN + path + '?lang=' + encodeURIComponent(l);
  const short = m.t.replace(/ \| VOCA DECK$/, '');
  const fix = (n) => {
    if (!n || typeof n !== 'object') return n;
    const ty = n['@type'];
    if (ty === 'FAQPage') {
      if (!m.faq) return null; // 번역이 없는 FAQ 는 화면 문구와 달라지므로 뺀다
      n.mainEntity = m.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }));
      return n;
    }
    if (ty === 'TechArticle' || ty === 'Article') {
      n.headline = short; n.description = m.d; n.inLanguage = tag;
      if (n.mainEntityOfPage && typeof n.mainEntityOfPage === 'object') n.mainEntityOfPage['@id'] = self;
      return n;
    }
    if (ty === 'WebApplication' && path === '/') { n.name = 'VOCA DECK — ' + (m.an || short); n.description = m.d; n.url = self; return n; }
    return n;
  };
  return (data) => {
    if (Array.isArray(data['@graph'])) { data['@graph'] = data['@graph'].map(fix).filter(Boolean); return data; }
    return fix(data);
  };
}

export async function onRequest(context) {
  const res = await lang(context);
  try {
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('text/html') || res.status !== 200) return res;
    const url = new URL(context.request.url);
    const l = url.searchParams.get('lang');
    const path = normPath(url.pathname);
    const m = l && l !== BASE && LANGS.includes(l) && META[path] && META[path][l];
    if (!m) return res;
    let rw = new HTMLRewriter().on('script[type="application/ld+json"]', new LdRewrite(ldFixer(l, path, m)));
    if (m.an) rw = rw.on('meta[property="og:image:alt"]', new AttrSetter(m.an + ' VOCA DECK'));
    return rw.transform(res);
  } catch (e) {
    return res;
  }
}
