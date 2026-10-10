// broodev.com 포털 — 언어별 주소(?lang=xx) 서버 메타 (packages/seo/README.md L3)
//   / 는 기준 언어 ko, /premium · /legal/* 는 기준 언어 ja(JS 없이 보이는 正文이 일본어). ?lang=xx(기준 언어 제외 12개) 응답의
//   canonical·og:url = 자기 자신, <html lang>(zh → zh-Hans), title·description·og/twitter 를 그 언어로. *.pages.dev 는 X-Robots-Tag: noindex.
//   메타 값 = functions/_lib/seo-meta.js — i18n-data.js · 각 문서의 <article data-title/data-desc> 에서 생성(node scripts/seo-meta-gen.mjs home). 손으로 고치지 말 것.
//   이 미들웨어는 _routes.json 의 include(HTML 정본 경로)에만 돈다. 옛 비트코인 주소 301(_redirects)은 자산 쪽이 처리한다.
import { seoLang, normPath } from './_lib/seo-lang.js';
import META from './_lib/seo-meta.js';

const ORIGIN = 'https://broodev.com';
const legalMeta = {};
for (const k of Object.keys(META)) if (k !== '/') legalMeta[k] = META[k];
const home = seoLang({ origin: ORIGIN, base: 'ko', meta: { '/': META['/'] }, remove: '' });
const legal = seoLang({ origin: ORIGIN, base: 'ja', meta: legalMeta, remove: '' });

export async function onRequest(context) {
  const path = normPath(new URL(context.request.url).pathname);
  return path === '/' ? home(context) : legal(context);
}
