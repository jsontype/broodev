// Cloudflare Pages Function (엣지) — 공유 썸네일(OG) 다국어화
// 카톡/페북 등 크롤러는 JS를 안 돌리고 URL의 HTML만 읽는다. 그래서 ?lang= 에 따라
// 응답 직전에 OG 메타(title/description/locale/image)를 해당 언어로 갈아끼운다.
// 기본(ko) 또는 미지원 lang → 원본 HTML 그대로(한국어).

const IMG = 'https://ltc.broodev.com';
const M = {
  en: { t: 'Litecoin Fear & Greed Index · Buy-Timing Score | LTC_SIGNAL', d: 'Real-time Litecoin Fear & Greed Index plus RSI, MACD, Mayer Multiple and more — 8 indicators in one 0–100 buy-timing score. Free, no install.', l: 'en_US', img: IMG + '/og-en.png' },
  ja: { t: 'ライトコイン 恐怖・強欲指数 · 買い時スコア | LTC_SIGNAL', d: 'ライトコインの恐怖・強欲指数にRSI・MACD・マイヤー倍率など8指標を合成し、買い時を0〜100で示す無料ダッシュボード。インストール不要。', l: 'ja_JP', img: IMG + '/og-ja.png' },
  zh: { t: '莱特币恐惧与贪婪指数 · 买入时机评分 | LTC_SIGNAL', d: '实时莱特币恐惧与贪婪指数，结合RSI、MACD、梅耶倍数等8项指标，合成0–100买入时机评分。免费，无需安装。', l: 'zh_CN', img: IMG + '/og-en.png' },
  'zh-Hant': { t: '萊特幣恐懼與貪婪指數 · 買入時機評分 | LTC_SIGNAL', d: '即時萊特幣恐懼與貪婪指數，結合RSI、MACD、梅耶倍數等8項指標，合成0–100買入時機評分。免費，免安裝。', l: 'zh_TW', img: IMG + '/og-en.png' },
  es: { t: 'Índice de miedo y codicia de Litecoin · Puntuación de compra | LTC_SIGNAL', d: 'Índice de miedo y codicia de Litecoin en tiempo real con RSI, MACD, múltiplo de Mayer y más: 8 indicadores en una puntuación 0–100. Gratis, sin instalación.', l: 'es_ES', img: IMG + '/og-en.png' },
  fr: { t: "Indice de peur et d'avidité Litecoin · Score de timing d'achat | LTC_SIGNAL", d: "Indice de peur et d'avidité Litecoin en temps réel avec RSI, MACD, multiple de Mayer et plus : 8 indicateurs en un score 0–100. Gratuit, sans installation.", l: 'fr_FR', img: IMG + '/og-en.png' },
  de: { t: 'Litecoin Angst- & Gier-Index · Kaufzeitpunkt-Score | LTC_SIGNAL', d: 'Echtzeit Litecoin Angst- & Gier-Index mit RSI, MACD, Mayer-Multiple und mehr — 8 Indikatoren als 0–100 Kaufzeitpunkt-Score. Kostenlos, ohne Installation.', l: 'de_DE', img: IMG + '/og-en.png' },
  it: { t: "Indice di paura e avidità Litecoin · Punteggio di acquisto | LTC_SIGNAL", d: "Indice di paura e avidità di Litecoin in tempo reale con RSI, MACD, multiplo di Mayer e altro: 8 indicatori in un punteggio 0–100. Gratis, nessuna installazione.", l: 'it_IT', img: IMG + '/og-en.png' },
  pt: { t: 'Índice de medo e ganância do Litecoin · Pontuação de compra | LTC_SIGNAL', d: 'Índice de medo e ganância do Litecoin em tempo real com RSI, MACD, múltiplo de Mayer e mais: 8 indicadores numa pontuação 0–100. Grátis, sem instalação.', l: 'pt_PT', img: IMG + '/og-en.png' },
  ru: { t: 'Индекс страха и жадности лайткоина · Оценка времени покупки | LTC_SIGNAL', d: 'Индекс страха и жадности лайткоина в реальном времени плюс RSI, MACD, мультипликатор Майера и другое — 8 индикаторов в оценке 0–100. Бесплатно, без установки.', l: 'ru_RU', img: IMG + '/og-en.png' },
  nl: { t: 'Litecoin Angst- & Hebzucht-index · Koopmoment-score | LTC_SIGNAL', d: 'Realtime Litecoin Angst- & Hebzucht-index met RSI, MACD, Mayer Multiple en meer — 8 indicatoren in één 0–100 koopmoment-score. Gratis, geen installatie.', l: 'nl_NL', img: IMG + '/og-en.png' },
  th: { t: 'ดัชนีความกลัวและความโลภไลต์คอยน์ · คะแนนจังหวะซื้อ | LTC_SIGNAL', d: 'ดัชนีความกลัว-ความโลภไลต์คอยน์แบบเรียลไทม์ พร้อม RSI, MACD, Mayer Multiple และอื่นๆ รวม 8 ตัวชี้วัดเป็นคะแนนจังหวะซื้อ 0–100 ฟรี ไม่ต้องติดตั้ง', l: 'th_TH', img: IMG + '/og-en.png' },
};

const COIN_HOSTS = {
  eth: ['이더리움', 'ETH'], xrp: ['리플', 'XRP'], doge: ['도지코인', 'DOGE'],
  bch: ['비트코인캐시', 'BCH'], link: ['체인링크', 'LINK'], xlm: ['스텔라루멘', 'XLM'],
  ltc: ['라이트코인', 'LTC'], avax: ['아발란체', 'AVAX'], shib: ['시바이누', 'SHIB'],
  dot: ['폴카닷', 'DOT'], pepe: ['페페', 'PEPE'], grt: ['더그래프', 'GRT'],
  sand: ['샌드박스', 'SAND'], mana: ['디센트럴랜드', 'MANA'],
};
class AttrSetter { constructor(v) { this.v = v; } element(el) { el.setAttribute('content', this.v); } }
class HrefSetter { constructor(v) { this.v = v; } element(el) { el.setAttribute('href', this.v); } }
class TextSetter { constructor(v) { this.v = v; } element(el) { el.setInnerContent(this.v); } }
class LangSetter { constructor(v) { this.v = v; } element(el) { el.setAttribute('lang', this.v); } }

export async function onRequest(context) {
  // 2026-08-07 구조 전환: btc.broodev.com 이 이 앱의 정본 도메인이 됐다 (루트는 VOCA).
  // 과거의 btc→루트 301 통합 리다이렉트는 제거 — 남아 있으면 정본이 보카로 튕긴다.
  const res = await ogRewrite(context);
  // *.pages.dev(프리뷰/기본 도메인)는 broodev.com 정본의 복제본 — 색인 금지로 중복 콘텐츠 차단
  try {
    if (new URL(context.request.url).hostname.endsWith('.pages.dev')) {
      const r = new Response(res.body, res);
      r.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return r;
    }
  } catch (e) {}
  return res;
}

async function ogRewrite(context) {
  const { request, next } = context;
  const res = await next();
  try {
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('text/html')) return res;
    const u = new URL(request.url);
    const lang = u.searchParams.get('lang');
    const m = lang && M[lang];
    /* 코인 서브도메인: 호스트별 canonical/og:url 로 중복 색인 차단 + (ko 기본) 코인 제목/설명 */
    const sub = u.hostname.split('.')[0];
    const coin = COIN_HOSTS[sub];
    if (!m && !coin) return res; // 루트(btc)·ko → 원본 그대로

    let rw = new HTMLRewriter();
    if (coin) {
      const base = 'https://' + sub + '.broodev.com';
      rw = rw
        .on('link[rel="canonical"]', new HrefSetter(base + '/'))
        .on('meta[property="og:url"]', new AttrSetter(base + '/'));
      if (!m) {
        const t = coin[0] + ' 공포·탐욕 지수 · 매수 타이밍 실시간 | ' + coin[1] + '_SIGNAL';
        const d = coin[0] + '(' + coin[1] + ') 공포·탐욕 지수와 RSI·MACD 등 지표를 합성해 매수 타이밍을 0~100 점수로 보여주는 무료 대시보드. 설치 없음.';
        rw = rw
          .on('title', new TextSetter(t))
          .on('meta[name="description"]', new AttrSetter(d))
          .on('meta[property="og:title"]', new AttrSetter(t))
          .on('meta[property="og:description"]', new AttrSetter(d))
          .on('meta[name="twitter:title"]', new AttrSetter(t))
          .on('meta[name="twitter:description"]', new AttrSetter(d));
      }
    }
    if (!m) return rw.transform(res);

    return rw
      .on('html', new LangSetter(lang))
      .on('title', new TextSetter(m.t))
      .on('meta[name="description"]', new AttrSetter(m.d))
      .on('meta[property="og:title"]', new AttrSetter(m.t))
      .on('meta[property="og:description"]', new AttrSetter(m.d))
      .on('meta[property="og:locale"]', new AttrSetter(m.l))
      .on('meta[property="og:image"]', new AttrSetter(m.img))
      .on('meta[name="twitter:title"]', new AttrSetter(m.t))
      .on('meta[name="twitter:description"]', new AttrSetter(m.d))
      .on('meta[name="twitter:image"]', new AttrSetter(m.img))
      .transform(res);
  } catch (e) {
    return res;
  }
}
