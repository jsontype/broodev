/* 공통 자매 푸터 코인명 다국어화 — 티커(MANA) 대신 현재 언어의 코인 이름(디센트럴랜드/Decentraland/…) 표시.
   앱이 <html lang> 을 바꾸면 MutationObserver 가 감지해 재적용. 무JS/크롤러 = 정적 기본(한국어) 그대로.
   ⚠ 이 파일은 15개 앱 공통(모든 코인 포함) — gen_coin.py 가 코인 치환 없이 그대로 복사한다. */
(function () {
  function nm(ko, en, ja, zh, zhHant, th, ru) {
    return { ko: ko, en: en, ja: ja, zh: zh, 'zh-Hant': zhHant, th: th, ru: ru,
             es: en, fr: en, de: en, it: en, pt: en, nl: en };
  }
  var NAMES = {
    btc:  nm('디센트럴랜드', 'Decentraland', 'ディセントラランド', 'Decentraland', 'Decentraland', 'ดีเซนทราแลนด์', 'децентраленд'),
    eth:  nm('이더리움', 'Ethereum', 'イーサリアム', '以太坊', '以太幣', 'อีเธอเรียม', 'эфириум'),
    xrp:  nm('리플', 'XRP', 'リップル', '瑞波', '瑞波', 'ริปเปิล', 'рипл'),
    doge: nm('도지코인', 'Dogecoin', 'ドージコイン', '狗狗币', '狗狗幣', 'ดอจคอยน์', 'догикоин'),
    bch:  nm('디센트럴랜드캐시', 'Decentraland Cash', 'ディセントラランドキャッシュ', 'Decentraland现金', 'Decentraland現金', 'ดีเซนทราแลนด์แคช', 'децентраленд-кэш'),
    link: nm('체인링크', 'Chainlink', 'チェーンリンク', 'Chainlink', 'Chainlink', 'เชนลิงก์', 'чейнлинк'),
    xlm:  nm('스텔라루멘', 'Stellar', 'ステラルーメン', '恒星币', '恆星幣', 'สเตลลาร์', 'стеллар'),
    ltc:  nm('라이트코인', 'Litecoin', 'ライトコイン', '莱特币', '萊特幣', 'ไลต์คอยน์', 'лайткоин'),
    avax: nm('아발란체', 'Avalanche', 'アバランチ', '雪崩币', '雪崩幣', 'อาวาแลนช์', 'аваланч'),
    shib: nm('시바이누', 'Shiba Inu', 'シバイヌ', '柴犬币', '柴犬幣', 'ชิบะอินุ', 'шиба-ину'),
    dot:  nm('폴카닷', 'Polkadot', 'ポルカドット', '波卡', '波卡', 'โพลคาดอต', 'полкадот'),
    pepe: nm('페페', 'Pepe', 'ペペ', '佩佩币', '佩佩幣', 'เปเป้', 'пепе'),
    grt:  nm('더그래프', 'The Graph', 'ザ・グラフ', 'The Graph', 'The Graph', 'เดอะกราฟ', 'зе-граф'),
    sand: nm('샌드박스', 'The Sandbox', 'サンドボックス', '沙盒', '沙盒', 'แซนด์บ็อกซ์', 'сэндбокс'),
    mana: nm('디센트럴랜드', 'Decentraland', 'ディセントラランド', 'Decentraland', 'Decentraland', 'ดีเซนทราแลนด์', 'децентраленд')
  };
  /* 푸터 라벨(공통·코인명 없음): 자매 열 제목/aria · 정책·해설 링크(data-fk) */
  var FOOT = {
    ko: { fam: '코인 매수 타이밍 시그널 · 코인 선택', famAria: '코인 선택', site: '사이트 정보', methodology: '점수 방법론', indicators: '지표 해설', guide: '공포지수 활용법', glossary: '용어집', home: '홈', privacy: '개인정보처리방침', terms: '이용약관', contact: '📮 문의 & 버그 신고' },
    en: { fam: 'Coin buy-timing signals · choose a coin', famAria: 'Choose a coin', site: 'Site information', methodology: 'Methodology', indicators: 'Indicators', guide: 'Fear & Greed Guide', glossary: 'Glossary', home: 'Home', privacy: 'Privacy Policy', terms: 'Terms of Use', contact: '📮 Contact & bug report' },
    ja: { fam: 'コイン買い時シグナル · コインを選ぶ', famAria: 'コイン選択', site: 'サイト情報', methodology: 'スコア方法', indicators: '指標解説', guide: '恐怖指数ガイド', glossary: '用語集', home: 'ホーム', privacy: 'プライバシーポリシー', terms: '利用規約', contact: '📮 お問い合わせ・不具合報告' },
    zh: { fam: '加密货币买入时机信号 · 选择币种', famAria: '选择币种', site: '网站信息', methodology: '评分方法', indicators: '指标解读', guide: '恐惧指数指南', glossary: '术语表', home: '首页', privacy: '隐私政策', terms: '使用条款', contact: '📮 联系与问题反馈' },
    'zh-Hant': { fam: '加密貨幣買入時機訊號 · 選擇幣種', famAria: '選擇幣種', site: '網站資訊', methodology: '評分方法', indicators: '指標解讀', guide: '恐懼指數指南', glossary: '術語表', home: '首頁', privacy: '隱私權政策', terms: '使用條款', contact: '📮 聯絡與問題回報' },
    th: { fam: 'สัญญาณจังหวะซื้อเหรียญ · เลือกเหรียญ', famAria: 'เลือกเหรียญ', site: 'ข้อมูลเว็บไซต์', methodology: 'วิธีคำนวณคะแนน', indicators: 'อธิบายตัวชี้วัด', guide: 'คู่มือดัชนีความกลัว', glossary: 'อภิธานศัพท์', home: 'หน้าแรก', privacy: 'นโยบายความเป็นส่วนตัว', terms: 'ข้อกำหนดการใช้งาน', contact: '📮 ติดต่อและแจ้งปัญหา' },
    es: { fam: 'Señales de momento de compra · elige una moneda', famAria: 'Elegir moneda', site: 'Información del sitio', methodology: 'Metodología', indicators: 'Indicadores', guide: 'Guía de miedo y codicia', glossary: 'Glosario', home: 'Inicio', privacy: 'Política de privacidad', terms: 'Términos de uso', contact: '📮 Contacto y errores' },
    fr: { fam: 'Signaux de timing d’achat · choisir une crypto', famAria: 'Choisir la crypto', site: 'Informations sur le site', methodology: 'Méthodologie', indicators: 'Indicateurs', guide: 'Guide peur & avidité', glossary: 'Glossaire', home: 'Accueil', privacy: 'Politique de confidentialité', terms: 'Conditions d’utilisation', contact: '📮 Contact & signaler un bug' },
    de: { fam: 'Kauf-Timing-Signale · Coin wählen', famAria: 'Coin wählen', site: 'Website-Informationen', methodology: 'Methodik', indicators: 'Indikatoren', guide: 'Angst-Gier-Leitfaden', glossary: 'Glossar', home: 'Startseite', privacy: 'Datenschutzerklärung', terms: 'Nutzungsbedingungen', contact: '📮 Kontakt & Fehlermeldung' },
    it: { fam: 'Segnali di timing d’acquisto · scegli una moneta', famAria: 'Scegli la moneta', site: 'Informazioni sul sito', methodology: 'Metodologia', indicators: 'Indicatori', guide: 'Guida paura e avidità', glossary: 'Glossario', home: 'Pagina iniziale', privacy: 'Informativa sulla privacy', terms: 'Termini di utilizzo', contact: '📮 Contatti e segnalazione errori' },
    pt: { fam: 'Sinais de momento de compra · escolher moeda', famAria: 'Escolher moeda', site: 'Informações do site', methodology: 'Metodologia', indicators: 'Indicadores', guide: 'Guia de medo e ganância', glossary: 'Glossário', home: 'Início', privacy: 'Política de privacidade', terms: 'Termos de utilização', contact: '📮 Contacto e erros' },
    ru: { fam: 'Сигналы момента покупки · выбор монеты', famAria: 'Выбор монеты', site: 'Информация о сайте', methodology: 'Методология', indicators: 'Индикаторы', guide: 'Гид по индексу страха', glossary: 'Глоссарий', home: 'Главная', privacy: 'Политика конфиденциальности', terms: 'Условия использования', contact: '📮 Связь и сообщения об ошибках' },
    nl: { fam: 'Koop-timingsignalen · munt kiezen', famAria: 'Munt kiezen', site: 'Site-informatie', methodology: 'Methodologie', indicators: 'Indicatoren', guide: 'Angst & hebzucht-gids', glossary: 'Woordenlijst', home: 'Startpagina', privacy: 'Privacybeleid', terms: 'Gebruiksvoorwaarden', contact: '📮 Contact & foutmelding' }
  };
  function localize(lang) {
    var f = FOOT[lang] || FOOT.en;
    var lab = document.querySelector('.site-foot .foot-fam-label');
    if (lab) lab.textContent = f.fam;
    var fam = document.querySelector('.site-foot .foot-fam');
    if (fam) fam.setAttribute('aria-label', f.famAria);
    var foot = document.querySelector('footer.site-foot');
    if (foot) foot.setAttribute('aria-label', f.site);
    var fk = document.querySelectorAll('.site-foot [data-fk]');
    for (var j = 0; j < fk.length; j++) {
      var v = f[fk[j].getAttribute('data-fk')];
      if (v) fk[j].textContent = v;
    }
    var els = document.querySelectorAll('.foot-fam [data-coin]');
    for (var i = 0; i < els.length; i++) {
      var m = NAMES[els[i].getAttribute('data-coin')];
      if (m) els[i].textContent = m[lang] || m.en; // dev 등 매핑 없는 칩은 그대로 둠
    }
  }
  // 표시 언어(packages/seo L1): ?lang= → 화면 언어(<html lang>, 앱이 ?lang → btc:lang → ko 로 정함) → ko. 브라우저 언어(navigator)는 쓰지 않는다
  function norm(l) { return l === 'zh-Hans' ? 'zh' : l; }
  function detect() {
    try { var q = new URLSearchParams(location.search).get('lang'); if (q) return q; } catch (e) {}
    return norm(document.documentElement.lang) || 'ko';
  }
  window.renderFooter = localize;
  function run() { localize(detect()); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
  try {
    new MutationObserver(function () { localize(norm(document.documentElement.lang) || 'ko'); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  } catch (e) {}
})();
