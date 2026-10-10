// utils.broodev.com — 언어별 주소(?lang=xx) 서버 메타 (packages/seo/README.md L3)
//   기준 언어 = ko(정적 HTML). ?lang=xx(ko 제외 12개) 응답의 canonical·og:url = 자기 자신, <html lang>, title·description·og/twitter 를 그 언어로,
//   [data-ld="faq"](FAQPage JSON-LD — 한국어 화면 문구와 같음)는 언어 버전에서 뺀다. *.pages.dev 는 X-Robots-Tag: noindex.
//   메타 값 = functions/_lib/seo-meta.js — js/i18n.js 사전에서 생성(node apps/utils/functions/_lib/seo-meta.gen.mjs). 손으로 고치지 말 것.
//   이 미들웨어는 _routes.json 의 include(HTML 정본 경로 + /api/*)에만 돈다. /api/* 의 JSON 응답은 건드리지 않는다(text/html 200 만 변환).
import { seoLang } from './_lib/seo-lang.js';
import META from './_lib/seo-meta.js';

export const onRequest = seoLang({ origin: 'https://utils.broodev.com', base: 'ko', meta: META });
