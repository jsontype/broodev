// samurai.broodev.com — 언어별 주소의 서버 메타(packages/seo/README.md L3)
//   /?lang=xx(ko 아님) 응답의 canonical·og:url = 자기 자신, <html lang>, title·description·og/twitter = 그 언어(functions/_lib/seo-meta.js — 게임 사전에서 생성),
//   FAQPage(data-ld="faq", 한국어 화면 문구)는 뺀다. *.pages.dev 는 X-Robots-Tag: noindex. 정적 자산은 _routes.json 으로 함수를 타지 않는다.
//   VideoGame JSON-LD 는 언어판에서 name·description 을 같은 seo-meta 값(게임 제목 · d)으로 갈아끼운다 — 한국어 구조화 데이터가 영어판 등에 남지 않게.
//   (표시 속성 없이 @type 으로 찾는다 — scripts/verify-st2.mjs 가 ld+json 태그를 data-ld="faq" 유무로만 읽는다)
import { seoLang, normPath, LANGS } from './_lib/seo-lang.js';
import META from './_lib/seo-meta.js';

const BASE = 'ko';
const lang = seoLang({ origin: 'https://samurai.broodev.com', base: BASE, meta: META });

// ld+json 본문(여러 청크로 올 수 있음)을 모아 마지막 청크에서 한 번에 다시 쓴다. VideoGame 이 아니거나 파싱 실패면 원문 그대로.
class GameLd {
  constructor(name, desc) { this.name = name; this.desc = desc; this.buf = ''; }
  text(t) {
    this.buf += t.text;
    if (!t.lastInTextNode) { t.remove(); return; }
    let out = this.buf;
    this.buf = '';
    try {
      const j = JSON.parse(out);
      if (j && j['@type'] === 'VideoGame') {
        j.name = this.name;
        j.description = this.desc;
        out = JSON.stringify(j).replace(/</g, '\\u003c');
      }
    } catch (e) { /* 원문 유지 */ }
    t.replace(out, { html: true });
  }
}

export async function onRequest(context) {
  const res = await lang(context);
  const url = new URL(context.request.url);
  const l = url.searchParams.get('lang');
  const page = META[normPath(url.pathname)];
  const m = l && l !== BASE && LANGS.includes(l) && page && page[l];
  if (!m || res.status !== 200 || !(res.headers.get('content-type') || '').includes('text/html')) return res;
  // seo-meta 의 ot = `${제목} — ${태그}`(scripts/samurai-seo-meta.mjs) → 게임 이름은 ' — ' 앞부분
  const cut = (m.ot || '').indexOf(' — ');
  const name = cut > 0 ? m.ot.slice(0, cut) : 'Samurai Tactics 2';
  try {
    return new HTMLRewriter().on('script[type="application/ld+json"]', new GameLd(name, m.d)).transform(res);
  } catch (e) {
    return res;
  }
}
