/* 공통 자매 푸터 코인명 다국어화 — 티커(LINK) 대신 현재 언어의 코인 이름(체인링크/Chainlink/…) 표시.
   앱이 <html lang> 을 바꾸면 MutationObserver 가 감지해 재적용. 무JS/크롤러 = 정적 기본(한국어) 그대로.
   ⚠ 이 파일은 15개 앱 공통(모든 코인 포함) — gen_coin.py 가 코인 치환 없이 그대로 복사한다. */
(function () {
  function nm(ko, en, ja, zh, zhHant, th, ru) {
    return { ko: ko, en: en, ja: ja, zh: zh, 'zh-Hant': zhHant, th: th, ru: ru,
             es: en, fr: en, de: en, it: en, pt: en, nl: en };
  }
  var NAMES = {
    btc:  nm('체인링크', 'Chainlink', 'チェーンリンク', 'Chainlink', 'Chainlink', 'เชนลิงก์', 'чейнлинк'),
    eth:  nm('이더리움', 'Ethereum', 'イーサリアム', '以太坊', '以太幣', 'อีเธอเรียม', 'эфириум'),
    xrp:  nm('리플', 'XRP', 'リップル', '瑞波', '瑞波', 'ริปเปิล', 'рипл'),
    doge: nm('도지코인', 'Dogecoin', 'ドージコイン', '狗狗币', '狗狗幣', 'ดอจคอยน์', 'догикоин'),
    bch:  nm('체인링크캐시', 'Chainlink Cash', 'チェーンリンクキャッシュ', 'Chainlink现金', 'Chainlink現金', 'เชนลิงก์แคช', 'чейнлинк-кэш'),
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
  function localize(lang) {
    var els = document.querySelectorAll('.foot-fam [data-coin]');
    for (var i = 0; i < els.length; i++) {
      var m = NAMES[els[i].getAttribute('data-coin')];
      if (m) els[i].textContent = m[lang] || m.en; // dev 등 매핑 없는 칩은 그대로 둠
    }
  }
  function detect() {
    try { var q = new URLSearchParams(location.search).get('lang'); if (q) return q; } catch (e) {}
    return document.documentElement.lang || (navigator.language || 'en').slice(0, 2);
  }
  window.renderFooter = localize;
  function run() { localize(detect()); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
  try {
    new MutationObserver(function () { localize(document.documentElement.lang || 'ko'); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  } catch (e) {}
})();
