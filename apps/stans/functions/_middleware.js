// STAN PANEL — 언어별 주소 서버 메타(packages/seo/README.md L3). 기준 ru = 루트(정적 HTML), ?lang=en = 영어 정본.
// ?lang=en 응답: canonical·og:url = 자기 주소, <html lang="en">, title·description·OG = 사전(T.en)에서 생성한 seo-meta(seo-lang.js),
//   러시아어 FAQPage(data-ld="faq") 제거(seo-lang.js) → 정적 본문 section.seo 를 영어판으로 교체 + 영어 FAQPage 를 그 뒤에 삽입(아래).
//   WebApplication JSON-LD(data-ld="app")·og:image:alt 도 영어로 교체(아래).
//   화면 UI 는 클라이언트가 ?lang=en 으로 영어 렌더. *.pages.dev 는 noindex.
import { seoLang, langOf } from './_lib/seo-lang.js';
import META from './_lib/seo-meta.js';
import { BODY_EN, FAQ_LD_EN, APP_LD_EN } from './_lib/seo-body-en.js';

const ORIGIN = 'https://stans.broodev.com';
const BASE = 'ru';
const lang = seoLang({ origin: ORIGIN, base: BASE, meta: META });
// JSON-LD 안의 '<' 는 \u003c 로(본문에 '</script' 가 들어와도 태그를 깨지 않게). JS 문자열이라 역슬래시를 두 번 쓴다.
const ld = (o) => JSON.stringify(o).replace(/</g, '\\u003c');
const LD = '<script type="application/ld+json" data-ld="faq">' + ld(FAQ_LD_EN) + '</script>';
const APP_LD = ld(APP_LD_EN);
const IMG_ALT = META['/'].en.ot;

export async function onRequest(context) {
  const res = await lang(context);
  try {
    const ct = res.headers.get('content-type') || '';
    if (res.status !== 200 || !ct.includes('text/html')) return res;
    if (langOf(context.request.url, { base: BASE }) !== 'en') return res;
    return new HTMLRewriter()
      .on('meta[property="og:image:alt"]', { element(el) { el.setAttribute('content', IMG_ALT); } })
      .on('script[data-ld="app"]', { element(el) { el.setInnerContent(APP_LD, { html: true }); } })
      .on('section.seo', {
        element(el) {
          el.setAttribute('lang', 'en');
          el.setAttribute('aria-label', 'About STAN PANEL');
          el.setInnerContent(BODY_EN, { html: true });
          el.after(LD, { html: true });
        },
      })
      .transform(res);
  } catch (e) {
    return res;
  }
}
