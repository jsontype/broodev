// Cloudflare Pages Function (엣지) — 공유 메타(OG) 다국어화 (voca와 동일 컨벤션)
// 크롤러는 JS를 안 돌리므로 ?lang= 에 따라 title/description/OG 메타를 갈아끼운다.
// 기본(ko) 또는 미지원 lang → 원본 HTML 그대로(한국어).

const M = {
  en: { t: 'How to use the Flashing Vocabulary Memorizer · 10-step tutorial | VOCA_TUTORIAL', d: 'Learn the flashing vocabulary memorizer in 10 interactive steps: screen navigation, CSV decks, auto play, memorized marks, random order and TTS.', l: 'en_US' },
  ja: { t: '点滅式単語帳の使い方 · 10ステップチュートリアル | VOCA_TUTORIAL', d: '点滅式単語帳の使い方を10ステップの対話型デモで学べます。画面操作、CSV単語帳、自動再生、暗記マーク、ランダム順、TTSまで。', l: 'ja_JP' },
  zh: { t: '闪示单词记忆使用教程 · 10步 | VOCA_TUTORIAL', d: '通过10步交互式演示学习闪示单词记忆工具：画面操作、CSV单词本、自动播放、已记标记、随机顺序与TTS。', l: 'zh_CN' },
  'zh-Hant': { t: '閃示單字記憶使用教學 · 10步 | VOCA_TUTORIAL', d: '透過10步互動式示範學習閃示單字記憶工具：畫面操作、CSV單字本、自動播放、已記標記、隨機順序與TTS。', l: 'zh_TW' },
  th: { t: 'วิธีใช้แอปท่องศัพท์แบบแฟลช · บทช่วยสอน 10 ขั้น | VOCA_TUTORIAL', d: 'เรียนรู้วิธีใช้แอปท่องศัพท์แบบแฟลชผ่านการสาธิตแบบโต้ตอบ 10 ขั้นตอน: การควบคุม, CSV, เล่นอัตโนมัติ, เครื่องหมายจำ และ TTS', l: 'th_TH' },
  es: { t: 'Cómo usar el memorizador de vocabulario · Tutorial en 10 pasos | VOCA_TUTORIAL', d: 'Aprende el memorizador de vocabulario en 10 pasos interactivos: navegación, mazos CSV, reproducción automática, marcas, orden aleatorio y TTS.', l: 'es_ES' },
  fr: { t: 'Guide de la mémorisation de vocabulaire · Tutoriel en 10 étapes | VOCA_TUTORIAL', d: 'Apprenez la mémorisation de vocabulaire en 10 étapes interactives : navigation, paquets CSV, lecture auto, marques, ordre aléatoire et TTS.', l: 'fr_FR' },
  de: { t: 'Vokabeltrainer-Anleitung · 10-Schritte-Tutorial | VOCA_TUTORIAL', d: 'Lerne den Vokabeltrainer in 10 interaktiven Schritten: Bedienung, CSV-Decks, Autoplay, Markierungen, Zufallsreihenfolge und TTS.', l: 'de_DE' },
  it: { t: 'Come usare il memorizzatore di vocaboli · Tutorial in 10 passi | VOCA_TUTORIAL', d: 'Impara il memorizzatore di vocaboli in 10 passi interattivi: navigazione, mazzi CSV, riproduzione automatica, contrassegni, ordine casuale e TTS.', l: 'it_IT' },
  pt: { t: 'Como usar o memorizador de vocabulário · Tutorial em 10 passos | VOCA_TUTORIAL', d: 'Aprende o memorizador de vocabulário em 10 passos interativos: navegação, baralhos CSV, reprodução automática, marcas, ordem aleatória e TTS.', l: 'pt_PT' },
  ru: { t: 'Как пользоваться тренажёром слов · Обучение из 10 шагов | VOCA_TUTORIAL', d: 'Освойте тренажёр слов за 10 интерактивных шагов: управление, CSV-наборы, автоповтор, отметки, случайный порядок и озвучка.', l: 'ru_RU' },
  nl: { t: 'Zo gebruik je de woordjestrainer · Tutorial in 10 stappen | VOCA_TUTORIAL', d: 'Leer de woordjestrainer in 10 interactieve stappen: bediening, CSV-decks, autoplay, markeringen, willekeurige volgorde en TTS.', l: 'nl_NL' },
};

class AttrSetter { constructor(v) { this.v = v; } element(el) { el.setAttribute('content', this.v); } }
class TextSetter { constructor(v) { this.v = v; } element(el) { el.setInnerContent(this.v); } }
class LangSetter { constructor(v) { this.v = v; } element(el) { el.setAttribute('lang', this.v); } }

export async function onRequest(context) {
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
