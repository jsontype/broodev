// memo.broodev.com — 언어별 주소(?lang=xx) 서버 메타 (packages/seo/README.md L3)
//   기준 언어 = ko(정적 HTML). ?lang=xx(ko 제외 12개) 응답의 canonical·og:url = 자기 자신, <html lang>, title·description·og/twitter 를 그 언어로.
//   메타 값 = functions/_lib/seo-meta.js — js/i18n.js 사전에서 생성(node scripts/seo-meta-gen.mjs memo). 손으로 고치지 말 것.
//   구조화 데이터(JSON-LD)는 화면 언어에 맞춰 브라우저에서 다시 쓰므로 그대로 둔다. *.pages.dev 는 X-Robots-Tag: noindex.
//   이 미들웨어는 _routes.json 의 include(HTML 정본 경로 /)에만 돈다.
import { seoLang } from './_lib/seo-lang.js';
import META from './_lib/seo-meta.js';

export const onRequest = seoLang({ origin: 'https://memo.broodev.com', base: 'ko', meta: META, remove: '' });
