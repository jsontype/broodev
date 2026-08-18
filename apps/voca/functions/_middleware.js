// Cloudflare Pages Function (엣지) — 공유 메타(OG) 다국어화 (btc의 _middleware.js 컨벤션)
// 카톡/페북 등 크롤러는 JS를 안 돌리고 URL의 HTML만 읽는다. 그래서 ?lang= 에 따라
// 응답 직전에 title/description/OG 메타를 해당 언어로 갈아끼운다.
// 기본(ko) 또는 미지원 lang → 원본 HTML 그대로(한국어).

const M = {
  en: { t: 'Flashing Vocabulary Memorizer · Auto-repeat CSV decks | VOCA DECK', d: 'Free flashing vocabulary memorizer that alternates words and meanings in large type. Open a CSV deck for 3-second auto play, memorized marks, random order and TTS. No install.', l: 'en_US' },
  ja: { t: '点滅式単語暗記 · CSV自動リピート | VOCA DECK', d: '単語と意味を大きな文字で交互に表示する無料の点滅式単語暗記ツール。CSVを開くと3秒間隔の自動再生、暗記マーク、ランダム順、TTS読み上げに対応。インストール不要。', l: 'ja_JP' },
  zh: { t: '闪示单词记忆 · CSV自动循环 | VOCA DECK', d: '免费闪示单词记忆工具，以大字交替显示单词与释义。打开CSV即可每3秒自动播放、标记已记、随机顺序与TTS朗读。无需安装。', l: 'zh_CN' },
  'zh-Hant': { t: '閃示單字記憶 · CSV自動循環 | VOCA DECK', d: '免費閃示單字記憶工具，以大字交替顯示單字與釋義。開啟CSV即可每3秒自動播放、標記已記、隨機順序與TTS朗讀。免安裝。', l: 'zh_TW' },
  th: { t: 'ท่องศัพท์แบบแฟลช · เล่นซ้ำอัตโนมัติจาก CSV | VOCA DECK', d: 'โปรแกรมท่องศัพท์ฟรี สลับคำและความหมายด้วยตัวอักษรขนาดใหญ่ เปิดไฟล์ CSV เล่นซ้ำอัตโนมัติทุก 3 วินาที ทำเครื่องหมายจำ สุ่มลำดับ และ TTS', l: 'th_TH' },
  es: { t: 'Memorizador de vocabulario · Repetición automática CSV | VOCA DECK', d: 'Memorizador de vocabulario gratuito que alterna palabras y significados en letras grandes. Abre un CSV: reproducción automática cada 3 s, marcas, orden aleatorio y TTS. Sin instalación.', l: 'es_ES' },
  fr: { t: 'Mémorisation de vocabulaire · Répétition auto CSV | VOCA DECK', d: 'Mémorisation de vocabulaire gratuite : mots et sens alternent en grands caractères. Ouvrez un CSV : lecture auto toutes les 3 s, marques, ordre aléatoire, TTS. Sans installation.', l: 'fr_FR' },
  de: { t: 'Vokabeltrainer mit Blitzanzeige · CSV-Autowiederholung | VOCA DECK', d: 'Kostenloser Vokabeltrainer: Wörter und Bedeutungen erscheinen abwechselnd in großer Schrift. CSV öffnen – Autoplay alle 3 s, Markierungen, Zufallsreihenfolge, TTS. Ohne Installation.', l: 'de_DE' },
  it: { t: 'Memorizzatore di vocaboli · Ripetizione automatica CSV | VOCA DECK', d: 'Memorizzatore di vocaboli gratuito: parole e significati si alternano a caratteri grandi. Apri un CSV: riproduzione automatica ogni 3 s, contrassegni, ordine casuale e TTS. Senza installazione.', l: 'it_IT' },
  pt: { t: 'Memorizador de vocabulário · Repetição automática CSV | VOCA DECK', d: 'Memorizador de vocabulário gratuito: palavras e significados alternam em letras grandes. Abra um CSV: reprodução automática a cada 3 s, marcas, ordem aleatória e TTS. Sem instalação.', l: 'pt_PT' },
  ru: { t: 'Тренажёр слов · Автоповтор из CSV | VOCA DECK', d: 'Бесплатный тренажёр слов: слова и значения поочерёдно показываются крупным шрифтом. Откройте CSV — автоповтор каждые 3 с, отметки, случайный порядок и озвучка. Без установки.', l: 'ru_RU' },
  nl: { t: 'Woordjes stampen · Automatisch herhalen uit CSV | VOCA DECK', d: 'Gratis woordjestrainer: woorden en betekenissen wisselen elkaar af in grote letters. Open een CSV: elke 3 s automatisch verder, markeringen, willekeurige volgorde en TTS. Geen installatie.', l: 'nl_NL' },
};

class AttrSetter { constructor(v) { this.v = v; } element(el) { el.setAttribute('content', this.v); } }
class TextSetter { constructor(v) { this.v = v; } element(el) { el.setInnerContent(this.v); } }
class LangSetter { constructor(v) { this.v = v; } element(el) { el.setAttribute('lang', this.v); } }

export async function onRequest(context) {
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
    const lang = new URL(request.url).searchParams.get('lang');
    const m = lang && M[lang];
    if (!m) return res; // ko/미지정/미지원 → 원본(한국어) 그대로

    return new HTMLRewriter()
      .on('html', new LangSetter(lang))
      .on('title', new TextSetter(m.t))
      .on('meta[name="description"]', new AttrSetter(m.d))
      .on('meta[property="og:title"]', new AttrSetter(m.t))
      .on('meta[property="og:description"]', new AttrSetter(m.d))
      .on('meta[property="og:locale"]', new AttrSetter(m.l))
      .on('meta[name="twitter:title"]', new AttrSetter(m.t))
      .on('meta[name="twitter:description"]', new AttrSetter(m.d))
      .transform(res);
  } catch (e) {
    return res;
  }
}
