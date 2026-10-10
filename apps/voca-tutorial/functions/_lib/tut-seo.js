// voca-tutorial 정적 본문(section.seo) · 푸터 · JSON-LD 를 언어별로 만드는 함수 — 서버(_middleware.js)와 생성기(scripts/seo-meta-voca.mjs)가 같이 쓴다.
// index.html 의 React renderSEO · renderFooter · renderHeadMeta 가 브라우저에서 같은 구조를 만든다 — 한쪽을 고치면 다른 쪽도 같이 고칠 것.
// m = seo-meta.js 의 TUT[lang]: t(문서 제목) d(metaDesc) a(tutName) s(steps [제목, 설명]) sh(단계 소제목) wh/w(이런 분께) fh/q(FAQ [질문, 답])
//     f = [footAria, footHome, footApp, footPrivacy, footTerms, footContact, footMadeBy({Y}=Y-Systems 링크), footDesc]

export const BASE = 'https://voca-tutorial.broodev.com';
export const APP_URL = 'https://voca.broodev.com/';
export const BASE_LANG = 'ko';

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const shortTitle = (m) => m.t.replace(/ \| VOCA_TUTORIAL$/, '');
// 기준 언어(ko)는 ?lang 없는 주소가 정본
const q = (lang) => (lang === BASE_LANG ? '' : '?lang=' + encodeURIComponent(lang));

export function seoHtml(lang, m) {
  return '<h1>' + esc(shortTitle(m)) + '</h1>' +
    '<p>' + esc(m.d) + '</p>' +
    '<h2>' + esc(m.sh) + '</h2>' +
    '<ol>' + m.s.map((x) => '<li><strong>' + esc(x[0]) + '</strong> — ' + esc(x[1]) + '</li>').join('') + '</ol>' +
    '<h2>' + esc(m.wh) + '</h2>' +
    '<ul>' + m.w.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>' +
    '<h2>' + esc(m.fh) + '</h2>' +
    '<dl>' + m.q.map((x) => '<dt>' + esc(x[0]) + '</dt><dd>' + esc(x[1]) + '</dd>').join('') + '</dl>' +
    '<p><a href="' + APP_URL + q(lang) + '">VOCA_DECK →</a></p>';
}

export function footHtml(lang, m) {
  const [, home, app, privacy, terms, contact, madeBy, desc] = m.f;
  const sep = '<span class="sep"> · </span>';
  const ys = '<a href="https://dev.broodev.com/"><strong>Y-Systems</strong></a> ↗';
  return '<nav class="foot-links">' +
    '<a href="/' + q(lang) + '">' + esc(home) + '</a>' + sep +
    '<a href="' + APP_URL + q(lang) + '">' + esc(app) + '</a>' + sep +
    '<a href="/privacy' + q(lang) + '">' + esc(privacy) + '</a>' + sep +
    '<a href="/terms' + q(lang) + '">' + esc(terms) + '</a>' + sep +
    '<a class="contact-link" href="https://voca.broodev.com/contact?app=voca-tutorial' + (lang === BASE_LANG ? '' : '&amp;lang=' + encodeURIComponent(lang)) + '">📮 ' + esc(contact) + '</a>' +
    '</nav>' +
    '<p style="margin:8px 0 0">© 2026 <strong>broodev</strong> · ' + esc(madeBy).replace('{Y}', ys) + '</p>' +
    '<p class="foot-desc">' + esc(desc) + '</p>';
}

export function ldData(lang, m) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'VOCA_TUTORIAL — ' + m.a,
        url: BASE + '/' + q(lang),
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        isAccessibleForFree: true,
        inLanguage: lang === 'zh' ? 'zh-Hans' : lang,
        description: m.d,
      },
      { '@type': 'HowTo', name: shortTitle(m), step: m.s.map((x, i) => ({ '@type': 'HowToStep', position: i + 1, name: x[0], text: x[1] })) },
      { '@type': 'FAQPage', mainEntity: m.q.map((x) => ({ '@type': 'Question', name: x[0], acceptedAnswer: { '@type': 'Answer', text: x[1] } })) },
    ],
  };
}
export const ldJson = (lang, m) => JSON.stringify(ldData(lang, m)).replace(/</g, '\\u003c');
