// 생성 파일 — 손으로 고치지 말 것. 재생성: python scripts/gen_coin.py meta (코인 앱까지: python scripts/gen_coin.py all)
// 원본: apps/btc/app.jsx 의 DOC_TITLE·DOC_DESC(루트) · apps/btc/i18n/<doc>.<lang>.html 의 data-title·data-desc(콘텐츠 페이지)
//       · COIN_META = 같은 값을 gen_coin.py 의 코인 변환(이름·브랜드·지표 7개)에 통과시킨 것(+ scripts/coins.json 의 seoMeta 덮어쓰기)
// 쓰는 곳: functions/_middleware.js → _lib/seo-lang.js (packages/seo/README.md L3)
export const META = {
 "/": {
  "en": {
   "t": "Bitcoin Fear & Greed Index & Buy-Timing Score | BTC_SIGNAL",
   "d": "Real-time Bitcoin Fear & Greed Index plus RSI, MACD, Mayer Multiple and more — 8 indicators in one 0–100 buy-timing score. Free, no install.",
   "img": "https://btc.broodev.com/og-en.png"
  },
  "ja": {
   "t": "ビットコイン 恐怖・強欲指数＆買い時スコア | BTC_SIGNAL",
   "d": "ビットコインの恐怖・強欲指数にRSI・MACD・マイヤー倍率など8指標を合成し、買い時を0〜100で示す無料ダッシュボード。インストール不要。",
   "img": "https://btc.broodev.com/og-ja.png"
  },
  "zh": {
   "t": "比特币恐惧与贪婪指数·买入时机评分 | BTC_SIGNAL",
   "d": "实时比特币恐惧与贪婪指数，结合RSI、MACD、梅耶倍数等8项指标，合成0–100买入时机评分。免费，无需安装。",
   "img": "https://btc.broodev.com/og-en.png"
  },
  "zh-Hant": {
   "t": "比特幣恐懼與貪婪指數·買入時機評分 | BTC_SIGNAL",
   "d": "即時比特幣恐懼與貪婪指數，結合RSI、MACD、梅耶倍數等8項指標，合成0–100買入時機評分。免費，免安裝。",
   "img": "https://btc.broodev.com/og-en.png"
  },
  "th": {
   "t": "ดัชนีความกลัว-ความโลภบิตคอยน์ · คะแนนจังหวะซื้อ | BTC_SIGNAL",
   "d": "ดัชนีความกลัว-ความโลภบิตคอยน์แบบเรียลไทม์ พร้อม RSI, MACD, Mayer Multiple และอื่นๆ รวม 8 ตัวชี้วัดเป็นคะแนนจังหวะซื้อ 0–100 ฟรี ไม่ต้องติดตั้ง",
   "img": "https://btc.broodev.com/og-en.png"
  },
  "es": {
   "t": "Miedo y Codicia de Bitcoin · Timing de Compra | BTC_SIGNAL",
   "d": "Índice de miedo y codicia de Bitcoin en tiempo real con RSI, MACD, múltiplo de Mayer y más: 8 indicadores en una puntuación 0–100. Gratis, sin instalación.",
   "img": "https://btc.broodev.com/og-en.png"
  },
  "fr": {
   "t": "Indice Peur & Avidité Bitcoin · Timing d’Achat | BTC_SIGNAL",
   "d": "Indice de peur et d'avidité Bitcoin en temps réel avec RSI, MACD, multiple de Mayer et plus : 8 indicateurs en un score 0–100. Gratuit, sans installation.",
   "img": "https://btc.broodev.com/og-en.png"
  },
  "de": {
   "t": "Bitcoin Angst-&-Gier-Index · Kauf-Timing-Score | BTC_SIGNAL",
   "d": "Echtzeit Bitcoin Angst- & Gier-Index mit RSI, MACD, Mayer-Multiple und mehr — 8 Indikatoren als 0–100 Kaufzeitpunkt-Score. Kostenlos, ohne Installation.",
   "img": "https://btc.broodev.com/og-en.png"
  },
  "it": {
   "t": "Paura e Avidità Bitcoin · Timing d’Acquisto | BTC_SIGNAL",
   "d": "Indice paura e avidità di Bitcoin in tempo reale con RSI, MACD, multiplo di Mayer e altro: 8 indicatori in un punteggio 0–100. Gratis, senza installare.",
   "img": "https://btc.broodev.com/og-en.png"
  },
  "pt": {
   "t": "Medo e Ganância do Bitcoin · Timing de Compra | BTC_SIGNAL",
   "d": "Índice de medo e ganância do Bitcoin em tempo real com RSI, MACD, múltiplo de Mayer e mais: 8 indicadores numa pontuação 0–100. Grátis, sem instalação.",
   "img": "https://btc.broodev.com/og-en.png"
  },
  "ru": {
   "t": "Страх и жадность Bitcoin · тайминг покупки | BTC_SIGNAL",
   "d": "Индекс страха и жадности биткоина в реальном времени плюс RSI, MACD, мультипликатор Майера и др. — 8 индикаторов в оценке 0–100. Бесплатно, без установки.",
   "img": "https://btc.broodev.com/og-en.png"
  },
  "nl": {
   "t": "Bitcoin Angst-&-Hebzucht-index · Koop-timing | BTC_SIGNAL",
   "d": "Realtime Bitcoin Angst- & Hebzucht-index met RSI, MACD, Mayer Multiple en meer — 8 indicatoren in één 0–100 koopmoment-score. Gratis, geen installatie.",
   "img": "https://btc.broodev.com/og-en.png"
  }
 },
 "/methodology": {
  "en": {
   "t": "How the Buy-Timing Score Is Calculated | broodev",
   "d": "The design doc for the broodev 0–100 buy-timing score: how 8 indicators, incl. MVRV Z and Thermocap Z, are normalized and weighted, plus bands and limits."
  },
  "ja": {
   "t": "買いタイミングスコアの計算方法 — 8指標の合成 | broodev",
   "d": "broodev買い時スコア（0〜100）の設計文書。MVRV Z・Thermocap Zを含む8指標の正規化と短期・長期ウェイト、判定バンド、モデルの限界を公開。"
  },
  "zh": {
   "t": "买入时机评分如何计算 — 8项指标合成方法 | broodev",
   "d": "broodev买入时机评分（0–100）的设计文档：含MVRV Z、Thermocap Z在内的8项指标如何归一化与加权，以及判定区间和模型局限。"
  },
  "zh-Hant": {
   "t": "買入時機評分如何計算 — 8項指標合成方法 | broodev",
   "d": "broodev買入時機評分（0–100）的設計文件：含MVRV Z、Thermocap Z在內的8項指標如何正規化與加權，以及判定區間和模型限制。"
  },
  "th": {
   "t": "คะแนนจังหวะซื้อคำนวณอย่างไร — รวม 8 ตัวชี้วัด | broodev",
   "d": "เอกสารออกแบบคะแนนจังหวะซื้อ 0–100 ของ broodev: การปรับมาตรฐานและถ่วงน้ำหนัก 8 ตัวชี้วัด รวม MVRV Z และ Thermocap Z พร้อมช่วงผลประเมินและข้อจำกัด"
  },
  "es": {
   "t": "Cómo se calcula la puntuación de compra | broodev",
   "d": "Documento de diseño de la puntuación 0–100 de broodev: cómo se normalizan y ponderan 8 indicadores, con MVRV Z y Thermocap Z, sus bandas y límites."
  },
  "fr": {
   "t": "Comment est calculé le score de timing d’achat | broodev",
   "d": "Le document de conception du score d’achat 0–100 de broodev : normalisation et pondération de 8 indicateurs, dont MVRV Z et Thermocap Z, bandes et limites."
  },
  "de": {
   "t": "Wie der Kaufzeitpunkt-Score berechnet wird | broodev",
   "d": "Das Designdokument des broodev-Kaufscores (0–100): wie 8 Indikatoren inkl. MVRV Z und Thermocap Z normiert und gewichtet werden, Bänder und Grenzen."
  },
  "it": {
   "t": "Come si calcola il punteggio di timing d’acquisto | broodev",
   "d": "Il documento di progetto del punteggio 0–100 di broodev: come 8 indicatori, inclusi MVRV Z e Thermocap Z, sono normalizzati e pesati; fasce e limiti."
  },
  "pt": {
   "t": "Como é calculada a pontuação de timing de compra | broodev",
   "d": "O documento de design da pontuação 0–100 da broodev: como 8 indicadores, incluindo MVRV Z e Thermocap Z, são normalizados e ponderados; faixas e limites."
  },
  "ru": {
   "t": "Как рассчитывается оценка тайминга покупки | broodev",
   "d": "Проектный документ оценки покупки broodev (0–100): как 8 индикаторов, включая MVRV Z и Thermocap Z, нормируются и взвешиваются; зоны и ограничения."
  },
  "nl": {
   "t": "Hoe de koop-timing-score wordt berekend | broodev",
   "d": "Ontwerpdocument van de broodev-koopscore (0–100): hoe 8 indicatoren, incl. MVRV Z en Thermocap Z, worden genormaliseerd en gewogen; banden en grenzen."
  }
 },
 "/indicators": {
  "en": {
   "t": "8 Crypto Indicators in Depth — RSI to Thermocap | broodev",
   "d": "The 8 indicators behind the buy-timing score, incl. on-chain MVRV Z-Score and Thermocap Z: formulas, how to read them, strengths and when each one fails."
  },
  "ja": {
   "t": "暗号資産8指標の徹底解説 — RSIからThermocapまで | broodev",
   "d": "買い時スコアを構成する8指標を解説。オンチェーンのMVRV Z-Score・Thermocap Zを含め、計算式・読み方・強み・裏切る場面まで。"
  },
  "zh": {
   "t": "加密货币8大指标深度解读 — 从RSI到Thermocap | broodev",
   "d": "逐一解读买入时机评分的8项指标，含链上MVRV Z-Score与Thermocap Z：计算公式、读法、优势，以及各指标何时失灵。"
  },
  "zh-Hant": {
   "t": "加密貨幣8大指標深度解讀 — 從RSI到Thermocap | broodev",
   "d": "逐一解讀買入時機評分的8項指標，含鏈上MVRV Z-Score與Thermocap Z：計算公式、讀法、優勢，以及各指標何時失靈。"
  },
  "th": {
   "t": "เจาะลึก 8 ตัวชี้วัดคริปโต — จาก RSI ถึง Thermocap | broodev",
   "d": "อธิบาย 8 ตัวชี้วัดในคะแนนจังหวะซื้อ รวม MVRV Z-Score และ Thermocap Z แบบออนเชน: สูตร วิธีอ่าน จุดแข็ง และเมื่อไหร่ที่แต่ละตัวพลาด"
  },
  "es": {
   "t": "Los 8 indicadores cripto, de RSI a Thermocap | broodev",
   "d": "Los 8 indicadores de la puntuación de compra, con MVRV Z-Score y Thermocap Z on-chain: fórmulas, cómo leerlos, fortalezas y cuándo falla cada uno."
  },
  "fr": {
   "t": "Les 8 indicateurs crypto, du RSI au Thermocap | broodev",
   "d": "Les 8 indicateurs du score d’achat, dont MVRV Z-Score et Thermocap Z on-chain : formules, lecture, points forts et moments où chacun échoue."
  },
  "de": {
   "t": "8 Krypto-Indikatoren im Detail: RSI bis Thermocap | broodev",
   "d": "Die 8 Indikatoren des Kaufscores, inkl. On-Chain-MVRV-Z-Score und Thermocap Z: Formeln, Lesart, Stärken und wann jeder einzelne versagt."
  },
  "it": {
   "t": "Gli 8 indicatori crypto, dall’RSI al Thermocap | broodev",
   "d": "Gli 8 indicatori del punteggio d’acquisto, inclusi MVRV Z-Score e Thermocap Z on-chain: formule, lettura, punti di forza e quando ciascuno sbaglia."
  },
  "pt": {
   "t": "Os 8 indicadores cripto, do RSI ao Thermocap | broodev",
   "d": "Os 8 indicadores da pontuação de compra, incluindo MVRV Z-Score e Thermocap Z on-chain: fórmulas, leitura, pontos fortes e quando cada um falha."
  },
  "ru": {
   "t": "8 криптоиндикаторов подробно: от RSI до Thermocap | broodev",
   "d": "8 индикаторов оценки покупки, включая ончейн-метрики MVRV Z-Score и Thermocap Z: формулы, как их читать, сильные стороны и когда каждый подводит."
  },
  "nl": {
   "t": "8 crypto-indicatoren: van RSI tot Thermocap | broodev",
   "d": "De 8 indicatoren achter de koopscore, inclusief on-chain MVRV Z-Score en Thermocap Z: formules, hoe je ze leest, sterke punten en wanneer ze falen."
  }
 },
 "/bitcoin-bottom": {
  "en": {
   "t": "Bitcoin Bottoms: Market Cap vs Average Cost Basis | broodev",
   "d": "Bitcoin bottoms come when market cap drops below realized cap: live charts of MVRV under 1 at five bottoms since 2011, plus every BOTTOM RADAR formula."
  },
  "ja": {
   "t": "ビットコインの底値の見極め方 — 時価総額vs平均取得単価 | broodev",
   "d": "ビットコインの底は時価総額が実現時価総額を下回る時に現れます。過去5回の底でMVRVが1を割った記録をライブチャートで再現し、ボトムスコアの式を公開。"
  },
  "zh": {
   "t": "如何判断比特币底部 — 市值 vs 平均持仓成本 | broodev",
   "d": "当市值跌破实现市值时，比特币才算见底。用实时图表重现2011–2022年五次底部MVRV跌破1的记录，并公开底部评分的全部公式。"
  },
  "zh-Hant": {
   "t": "如何判斷比特幣底部 — 市值 vs 平均持倉成本 | broodev",
   "d": "當市值跌破實現市值時，比特幣才算見底。以即時圖表重現2011–2022年五次底部MVRV跌破1的紀錄，並公開底部評分的全部公式。"
  },
  "th": {
   "t": "วิธีจับก้นบิตคอยน์ — มูลค่าตลาด vs ต้นทุนเฉลี่ย | broodev",
   "d": "ก้นของบิตคอยน์เกิดเมื่อมูลค่าตลาดต่ำกว่ามูลค่าตลาดที่รับรู้แล้ว ดูกราฟสด MVRV ที่หลุด 1 ในก้น 5 ครั้งตั้งแต่ปี 2011 พร้อมสูตร BOTTOM RADAR ทั้งหมด"
  },
  "es": {
   "t": "El suelo de Bitcoin: capitalización vs coste medio | broodev",
   "d": "Bitcoin toca suelo cuando su capitalización cae bajo la realizada: MVRV bajo 1 en cinco suelos desde 2011, en gráficos en vivo, y fórmula del BOTTOM RADAR."
  },
  "fr": {
   "t": "Plancher du Bitcoin : capitalisation vs coût moyen | broodev",
   "d": "Un plancher survient quand la capitalisation passe sous la cap. réalisée : MVRV sous 1 à cinq planchers depuis 2011 en direct, et formule du BOTTOM RADAR."
  },
  "de": {
   "t": "Bitcoin-Boden: Marktwert vs. Ø-Einstandskurs | broodev",
   "d": "Bitcoin-Böden entstehen, wenn der Marktwert unter den realisierten fällt: MVRV unter 1 an fünf Böden seit 2011 im Live-Chart und alle BOTTOM-RADAR-Formeln."
  },
  "it": {
   "t": "Il minimo del Bitcoin: market cap vs costo medio | broodev",
   "d": "Il minimo arriva quando la market cap scende sotto quella realizzata: MVRV sotto 1 in cinque minimi dal 2011 in grafici live e formule del BOTTOM RADAR."
  },
  "pt": {
   "t": "O fundo do Bitcoin: capitalização vs custo médio | broodev",
   "d": "O fundo surge quando a capitalização cai abaixo da realizada: MVRV abaixo de 1 em cinco fundos desde 2011, em gráficos ao vivo, e fórmula do BOTTOM RADAR."
  },
  "ru": {
   "t": "Дно биткоина: капитализация vs средняя цена входа | broodev",
   "d": "Дно биткоина — когда капитализация падает ниже реализованной: MVRV ниже 1 на пяти днах с 2011 года на живых графиках и все формулы BOTTOM RADAR."
  },
  "nl": {
   "t": "Bitcoinbodem: marktwaarde vs gem. aankoopprijs | broodev",
   "d": "Een bodem ontstaat als de marktwaarde onder de gerealiseerde zakt: MVRV onder 1 bij vijf bodems sinds 2011 in live grafieken, plus de BOTTOM RADAR-formule."
  }
 },
 "/guide-fear-greed": {
  "en": {
   "t": "How to Use the Fear & Greed Index in Practice | broodev",
   "d": "Using the Fear & Greed Index in practice: staged buying (DCA) in extreme fear, indicators to confirm with, 5 beginner mistakes and when not to trust it."
  },
  "ja": {
   "t": "恐怖・強欲指数の実践的な使い方 — 分割買いと失敗例 | broodev",
   "d": "恐怖指数は実際にどう使うのか。極端な恐怖で分割買い（DCA）する手順、必ず併せて見るべき確認指標、初心者が繰り返す5つの失敗、そしてこの指標を絶対に信じてはいけない状況を解説します。"
  },
  "zh": {
   "t": "恐惧与贪婪指数实战用法 — 恐惧区间分批买入与常见错误 | broodev",
   "d": "恐惧指数到底该怎么用？在极度恐惧时分批买入（DCA）的步骤、必须一并查看的确认指标、新手反复犯的5个错误，以及绝对不能相信这个指标的情况。"
  },
  "zh-Hant": {
   "t": "恐懼與貪婪指數實戰用法 — 恐懼區間分批買進與常見錯誤 | broodev",
   "d": "恐懼指數到底該怎麼用？在極度恐懼時分批買進（DCA）的步驟、必須一併查看的確認指標、新手反覆犯的5個錯誤，以及絕對不能相信這個指標的情況。"
  },
  "th": {
   "t": "ใช้ดัชนีความกลัว-ความโลภในทางปฏิบัติ | broodev",
   "d": "ใช้ดัชนีความกลัว-ความโลภจริงอย่างไร: ทยอยซื้อ (DCA) ตอนกลัวสุดขีด ตัวชี้วัดที่ต้องดูประกอบ 5 ข้อผิดพลาดของมือใหม่ และเมื่อไหร่ที่ไม่ควรเชื่อ"
  },
  "es": {
   "t": "Usar el Índice de Miedo y Codicia en la práctica | broodev",
   "d": "Cómo usar el índice en la práctica: compras escalonadas (DCA) en miedo extremo, indicadores de confirmación, 5 errores de principiante y cuándo no fiarse."
  },
  "fr": {
   "t": "Utiliser l’Indice Peur & Avidité en pratique | broodev",
   "d": "Utiliser l’indice en pratique : achats fractionnés (DCA) en peur extrême, indicateurs de confirmation, 5 erreurs de débutant et quand ne pas s’y fier."
  },
  "de": {
   "t": "Den Angst-&-Gier-Index richtig nutzen | broodev",
   "d": "Den Index in der Praxis nutzen: gestaffelte Käufe (DCA) bei extremer Angst, Bestätigungsindikatoren, 5 Anfängerfehler und wann man ihm nicht trauen sollte."
  },
  "it": {
   "t": "Usare davvero l’Indice Paura e Avidità | broodev",
   "d": "Usare l’indice nella pratica: acquisti frazionati (DCA) nella paura estrema, indicatori di conferma, 5 errori da principiante e quando non fidarsi."
  },
  "pt": {
   "t": "Como usar o Índice de Medo e Ganância na prática | broodev",
   "d": "Como usar o índice na prática: compras escalonadas (DCA) no medo extremo, indicadores de confirmação, 5 erros de iniciante e quando não confiar nele."
  },
  "ru": {
   "t": "Индекс страха и жадности на практике | broodev",
   "d": "Как применять индекс: поэтапные покупки (DCA) при крайнем страхе, подтверждающие индикаторы, 5 ошибок новичков и когда ему нельзя доверять."
  },
  "nl": {
   "t": "De Angst-&-Hebzucht-index in de praktijk | broodev",
   "d": "De index in de praktijk: gespreid kopen (DCA) bij extreme angst, bevestigende indicatoren, 5 beginnersfouten en wanneer je hem niet moet vertrouwen."
  }
 },
 "/rsi-guide": {
  "en": {
   "t": "When RSI Got It Wrong — An RSI Failure Post-Mortem | broodev",
   "d": "Where RSI went badly wrong: weeks above 70 in bull markets, long stays below 30 in bears, real vs fake divergences, and a 59-point phantom signal."
  },
  "ja": {
   "t": "RSIが外れた瞬間 — 相対力指数の失敗を解剖する | broodev",
   "d": "RSIが大きく外れた局面を解剖。強気相場での70超え滞在、弱気相場での30割れ滞在、本物と偽物のダイバージェンス、平滑化の違いが生む59ポイントの幽霊シグナル。"
  },
  "zh": {
   "t": "RSI 失灵的时刻 — 相对强弱指数失败剖析 | broodev",
   "d": "剖析RSI严重失灵的阶段：牛市中长期高于70、熊市中长期低于30、真假背离，以及平滑方式差异造成的59点幽灵信号。"
  },
  "zh-Hant": {
   "t": "RSI 失靈的時刻 — 相對強弱指數失敗解剖 | broodev",
   "d": "剖析RSI嚴重失靈的階段：牛市中長期高於70、熊市中長期低於30、真假背離，以及平滑方式差異造成的59點幽靈訊號。"
  },
  "th": {
   "t": "ช่วงเวลาที่ RSI พลาด — ผ่าความล้มเหลวของ RSI | broodev",
   "d": "ผ่าช่วงที่ RSI พลาดหนัก: ค้างเหนือ 70 นานในตลาดกระทิง ค้างใต้ 30 ในตลาดหมี ไดเวอร์เจนซ์จริงกับหลอก และสัญญาณผี 59 จุดจากวิธีปรับเรียบที่ต่างกัน"
  },
  "es": {
   "t": "Cuando el RSI se equivocó: autopsia de sus fallos | broodev",
   "d": "Dónde falló el RSI: semanas sobre 70 en alcistas, largas rachas bajo 30 en bajistas, divergencias reales y falsas, y una señal fantasma de 59 puntos."
  },
  "fr": {
   "t": "Quand le RSI s’est trompé : autopsie de ses échecs | broodev",
   "d": "Où le RSI s’est trompé : des semaines au-dessus de 70 en haussier, sous 30 en baissier, vraies et fausses divergences, et un signal fantôme de 59 points."
  },
  "de": {
   "t": "Wann der RSI falsch lag: eine Fehleranalyse | broodev",
   "d": "Wo der RSI danebenlag: wochenlang über 70 im Bullenmarkt, lange unter 30 im Bärenmarkt, echte und falsche Divergenzen und ein 59-Punkte-Phantomsignal."
  },
  "it": {
   "t": "Quando l’RSI ha sbagliato: autopsia degli errori | broodev",
   "d": "Dove l’RSI ha sbagliato: settimane sopra 70 nei rialzi, a lungo sotto 30 nei ribassi, divergenze vere e false, e un segnale fantasma da 59 punti."
  },
  "pt": {
   "t": "Quando o RSI falhou: autópsia das suas falhas | broodev",
   "d": "Onde o RSI errou: semanas acima de 70 em alta, longos períodos abaixo de 30 em baixa, divergências reais e falsas e um sinal fantasma de 59 pontos."
  },
  "ru": {
   "t": "Когда RSI ошибался: разбор провалов индикатора | broodev",
   "d": "Где RSI ошибался: недели выше 70 на бычьем рынке, долго ниже 30 на медвежьем, настоящие и ложные дивергенции и фантомный сигнал на 59 пунктов."
  },
  "nl": {
   "t": "Wanneer de RSI het mis had: een autopsie | broodev",
   "d": "Waar de RSI faalde: wekenlang boven 70 in een bullmarkt, lang onder 30 in een bearmarkt, echte en valse divergenties en een spooksignaal van 59 punten."
  }
 },
 "/macd-guide": {
  "en": {
   "t": "Calculating MACD by Hand with 42 Closing Prices | broodev",
   "d": "EMA12, EMA26, MACD line, signal and histogram computed bar by bar from 42 closes: why 30 bars give no histogram, why EMA, and why we score direction."
  },
  "ja": {
   "t": "MACDを手計算 — 終値42本で追うウォークスルー | broodev",
   "d": "終値42本でEMA12・EMA26・MACD線・シグナル線・ヒストグラムを1本ずつ計算。30本ではヒストグラムが出ない理由、EMAを使う理由、方向を見る理由まで。"
  },
  "zh": {
   "t": "手算MACD — 用42根收盘价走完全过程 | broodev",
   "d": "用42根收盘价逐根计算EMA12、EMA26、MACD线、信号线和柱状图：为何30根算不出柱状图、为何用EMA，以及为何看方向。"
  },
  "zh-Hant": {
   "t": "親手計算 MACD — 用42根收盤價走完全程 | broodev",
   "d": "用42根收盤價逐根計算EMA12、EMA26、MACD線、訊號線與柱狀圖：為何30根算不出柱狀圖、為何用EMA，以及為何看方向。"
  },
  "th": {
   "t": "คำนวณ MACD ด้วยมือจากราคาปิด 42 แท่ง | broodev",
   "d": "คำนวณ EMA12, EMA26, เส้น MACD, เส้นสัญญาณ และฮิสโทแกรมทีละแท่งจากราคาปิด 42 แท่ง: ทำไม 30 แท่งไม่มีฮิสโทแกรม ทำไมใช้ EMA และทำไมดูทิศทาง"
  },
  "es": {
   "t": "Calcular el MACD a mano con 42 cierres | broodev",
   "d": "EMA12, EMA26, línea MACD, señal e histograma vela a vela con 42 cierres: por qué 30 velas no dan histograma, por qué EMA y por qué puntuamos la dirección."
  },
  "fr": {
   "t": "Calculer le MACD à la main sur 42 clôtures | broodev",
   "d": "EMA12, EMA26, ligne MACD, signal et histogramme bougie par bougie sur 42 clôtures : pourquoi 30 bougies ne suffisent pas, pourquoi l’EMA et la direction."
  },
  "de": {
   "t": "MACD von Hand berechnen – mit 42 Schlusskursen | broodev",
   "d": "EMA12, EMA26, MACD-Linie, Signallinie und Histogramm Kerze für Kerze aus 42 Schlusskursen: warum 30 Kerzen nicht reichen, warum EMA, warum die Richtung."
  },
  "it": {
   "t": "Calcolare il MACD a mano su 42 chiusure | broodev",
   "d": "EMA12, EMA26, linea MACD, segnale e istogramma barra per barra su 42 chiusure: perché 30 barre non bastano, perché l’EMA e perché conta la direzione."
  },
  "pt": {
   "t": "Calcular o MACD à mão com 42 fechos | broodev",
   "d": "EMA12, EMA26, linha MACD, sinal e histograma barra a barra com 42 fechos: porque 30 barras não dão histograma, porquê a EMA e porquê a direção."
  },
  "ru": {
   "t": "Считаем MACD вручную на 42 ценах закрытия | broodev",
   "d": "EMA12, EMA26, линия MACD, сигнальная линия и гистограмма бар за баром по 42 закрытиям: почему 30 баров мало, зачем EMA и почему важно направление."
  },
  "nl": {
   "t": "MACD met de hand berekenen met 42 slotkoersen | broodev",
   "d": "EMA12, EMA26, MACD-lijn, signaallijn en histogram per candle uit 42 slotkoersen: waarom 30 candles te weinig zijn, waarom EMA en waarom de richting telt."
  }
 },
 "/mayer-multiple": {
  "en": {
   "t": "The Mayer Multiple Through Every Bitcoin Cycle | broodev",
   "d": "Why did Trace Mayer pick 2.4? The multiple at the 2013–2024 tops and 2015–2022 bottoms, and why our model weights it so differently short vs long."
  },
  "ja": {
   "t": "マイヤー倍率の歴史 — 200日線が語ったこと | broodev",
   "d": "トレース・マイヤーはなぜ2.4を選んだのか。2013〜2024年の天井と2015〜2022年の底の実際の倍率をたどり、短期と長期でウェイトが大きく違う理由を示します。"
  },
  "zh": {
   "t": "Mayer 倍数的历史 — 200日均线的周期启示 | broodev",
   "d": "Trace Mayer 为何选择2.4？回顾2013–2024年顶部与2015–2022年底部的实际 Mayer 倍数，并说明短期与长期权重差异很大的原因。"
  },
  "zh-Hant": {
   "t": "Mayer 倍數的歷史 — 200日均線的週期啟示 | broodev",
   "d": "Trace Mayer 為何選擇2.4？回顧2013–2024年頂部與2015–2022年底部的實際 Mayer 倍數，並說明短期與長期權重差異很大的原因。"
  },
  "th": {
   "t": "ประวัติ Mayer Multiple — เส้น 200 วันในแต่ละรอบ | broodev",
   "d": "ทำไม Trace Mayer เลือก 2.4? ดูค่า Mayer Multiple จริงที่ยอดปี 2013–2024 และก้นปี 2015–2022 และเหตุที่น้ำหนักระยะสั้นกับระยะยาวต่างกันมาก"
  },
  "es": {
   "t": "El Múltiplo de Mayer en cada ciclo de Bitcoin | broodev",
   "d": "¿Por qué Trace Mayer eligió 2,4? El múltiplo real en los techos de 2013–2024 y suelos de 2015–2022, y por qué pesa tan distinto a corto y a largo plazo."
  },
  "fr": {
   "t": "Le multiple de Mayer à chaque cycle du bitcoin | broodev",
   "d": "Pourquoi 2,4 ? Le multiple de Mayer aux sommets de 2013–2024 et aux planchers de 2015–2022, et pourquoi son poids diffère tant à court et à long terme."
  },
  "de": {
   "t": "Das Mayer Multiple in jedem Bitcoin-Zyklus | broodev",
   "d": "Warum wählte Trace Mayer 2,4? Das Multiple an den Hochs 2013–2024 und Tiefs 2015–2022 – und warum es kurz- und langfristig so anders gewichtet wird."
  },
  "it": {
   "t": "Il Multiplo di Mayer in ogni ciclo del bitcoin | broodev",
   "d": "Perché Trace Mayer scelse 2,4? Il multiplo reale ai massimi 2013–2024 e ai minimi 2015–2022, e perché pesa in modo così diverso a breve e a lungo termine."
  },
  "pt": {
   "t": "O Múltiplo de Mayer em cada ciclo do Bitcoin | broodev",
   "d": "Por que Trace Mayer escolheu 2,4? O múltiplo real nos topos de 2013–2024 e nos fundos de 2015–2022, e por que pesa tão diferente no curto e no longo prazo."
  },
  "ru": {
   "t": "Множитель Майера в каждом цикле биткоина | broodev",
   "d": "Почему Трейс Майер выбрал 2,4? Фактический множитель на вершинах 2013–2024 и днах 2015–2022 и почему его вес так различается в коротком и длинном режимах."
  },
  "nl": {
   "t": "De Mayer Multiple in elke bitcoincyclus | broodev",
   "d": "Waarom koos Trace Mayer 2,4? De werkelijke multiple bij de toppen van 2013–2024 en bodems van 2015–2022, en waarom hij kort en lang zo anders weegt."
  }
 },
 "/fear-greed-index": {
  "en": {
   "t": "What Is the Fear & Greed Index Made Of? | broodev",
   "d": "The Alternative.me index by component: volatility 25%, momentum/volume 25%, social 15%, dominance 10%, Google Trends 10%, and why it is really a BTC index."
  },
  "ja": {
   "t": "恐怖・強欲指数の解剖 — その数字は何でできているのか | broodev",
   "d": "Alternative.meの恐怖・強欲指数を分解。ボラティリティ25%・モメンタム/出来高25%・ソーシャル15%・ドミナンス10%・トレンド10%と、事実上BTC指数である理由。"
  },
  "zh": {
   "t": "解剖恐惧与贪婪指数 — 这个数字究竟由什么构成 | broodev",
   "d": "拆解Alternative.me恐惧与贪婪指数：波动率25%、动量/成交量25%、社交15%、主导率10%、谷歌趋势10%，以及它为何实为BTC指数。"
  },
  "zh-Hant": {
   "t": "解剖恐懼與貪婪指數 — 這個數字究竟由什麼構成 | broodev",
   "d": "拆解Alternative.me恐懼與貪婪指數：波動率25%、動能/成交量25%、社群15%、主導率10%、Google趨勢10%，以及它為何實為BTC指數。"
  },
  "th": {
   "t": "ผ่าดัชนีความกลัว-ความโลภ — ตัวเลขนี้มาจากอะไร | broodev",
   "d": "แยกส่วนดัชนีของ Alternative.me: ความผันผวน 25% โมเมนตัม/วอลุ่ม 25% โซเชียล 15% ดอมิแนนซ์ 10% เทรนด์ 10% และทำไมจริงๆ แล้วคือดัชนี BTC"
  },
  "es": {
   "t": "Anatomía del índice de miedo y codicia | broodev",
   "d": "El índice de Alternative.me por partes: volatilidad 25%, momento/volumen 25%, social 15%, dominancia 10%, tendencias 10%; en la práctica, un índice de BTC."
  },
  "fr": {
   "t": "Anatomie de l’indice de peur et d’avidité | broodev",
   "d": "L’indice d’Alternative.me décomposé : volatilité 25 %, momentum/volume 25 %, social 15 %, dominance 10 %, tendances 10 % — en fait, un indice BTC."
  },
  "de": {
   "t": "Anatomie des Angst-&-Gier-Index | broodev",
   "d": "Der Index von Alternative.me zerlegt: Volatilität 25 %, Momentum/Volumen 25 %, Social 15 %, Dominanz 10 %, Trends 10 % – faktisch ein BTC-Index."
  },
  "it": {
   "t": "Anatomia dell’Indice Paura e Avidità | broodev",
   "d": "L’indice di Alternative.me scomposto: volatilità 25%, momentum/volume 25%, social 15%, dominance 10%, trend 10%, e perché è di fatto un indice BTC."
  },
  "pt": {
   "t": "Anatomia do Índice de Medo e Ganância | broodev",
   "d": "O índice da Alternative.me decomposto: volatilidade 25%, momentum/volume 25%, social 15%, dominância 10%, tendências 10% — na prática, um índice de BTC."
  },
  "ru": {
   "t": "Анатомия индекса страха и жадности | broodev",
   "d": "Индекс Alternative.me по частям: волатильность 25%, импульс/объём 25%, соцсети 15%, доминирование 10%, тренды 10% — и почему это фактически индекс BTC."
  },
  "nl": {
   "t": "Anatomie van de Angst- & Hebzucht-index | broodev",
   "d": "De index van Alternative.me ontleed: volatiliteit 25%, momentum/volume 25%, social 15%, dominantie 10%, trends 10% — feitelijk een BTC-index."
  }
 },
 "/golden-cross": {
  "en": {
   "t": "5 Myths About the Golden Cross | broodev",
   "d": "The golden cross is not a buy signal. Five myths refuted with the 4-tier score table from our code and a worked example of why it carries a low weight."
  },
  "ja": {
   "t": "ゴールデンクロスにまつわる5つの誤解 | broodev",
   "d": "ゴールデンクロスは買いシグナルではありません。5つの通説を実際のコードの4段階スコア表と計算例で反証し、この指標のウェイトが低い理由を示します。"
  },
  "zh": {
   "t": "关于金叉的5个误解 — 为什么它是趋势过滤器而不是买入信号 | broodev",
   "d": "金叉不是买入信号。用实际代码中的4档评分表和计算演示逐一反驳5个常见误解，并说明这个指标权重偏低的原因。"
  },
  "zh-Hant": {
   "t": "關於黃金交叉的5個誤解 — 為什麼它是趨勢過濾器而不是買入訊號 | broodev",
   "d": "黃金交叉不是買入訊號。用實際程式碼的4級評分表與計算示範逐一反駁5個常見誤解，並說明這個指標權重偏低的原因。"
  },
  "th": {
   "t": "5 ความเข้าใจผิดเกี่ยวกับ Golden Cross | broodev",
   "d": "Golden Cross ไม่ใช่สัญญาณซื้อ หักล้าง 5 ความเชื่อผิดด้วยตารางคะแนน 4 ระดับจากโค้ดจริงและตัวอย่างการคำนวณ พร้อมเหตุที่ตัวชี้วัดนี้มีน้ำหนักต่ำ"
  },
  "es": {
   "t": "5 malentendidos sobre el cruce dorado | broodev",
   "d": "El cruce dorado no es una señal de compra. Refutamos 5 mitos con la tabla de 4 niveles de nuestro código y un cálculo paso a paso de por qué pesa poco."
  },
  "fr": {
   "t": "5 idées reçues sur la croix dorée | broodev",
   "d": "La croix dorée n’est pas un signal d’achat. Cinq idées reçues réfutées avec la grille à 4 niveaux de notre code et un calcul détaillé de son faible poids."
  },
  "de": {
   "t": "5 Irrtümer über das Golden Cross | broodev",
   "d": "Das Golden Cross ist kein Kaufsignal: fünf Irrtümer, widerlegt mit der 4-stufigen Punktetabelle unseres Codes und einer Rechnung zum geringen Gewicht."
  },
  "it": {
   "t": "5 equivoci sul golden cross | broodev",
   "d": "Il golden cross non è un segnale d’acquisto. Cinque equivoci smontati con la tabella a 4 livelli del nostro codice e un calcolo sul perché pesa poco."
  },
  "pt": {
   "t": "5 equívocos sobre o cruzamento dourado | broodev",
   "d": "O cruzamento dourado não é sinal de compra. Cinco equívocos refutados com a tabela de 4 níveis do nosso código e um cálculo de por que pesa pouco."
  },
  "ru": {
   "t": "5 заблуждений о золотом кресте | broodev",
   "d": "Золотой крест — не сигнал к покупке. Пять заблуждений, опровергнутых 4-уровневой таблицей баллов из нашего кода и расчётом, почему у него малый вес."
  },
  "nl": {
   "t": "5 misverstanden over de golden cross | broodev",
   "d": "De golden cross is geen koopsignaal. Vijf misverstanden weerlegd met de 4-traps scoretabel uit onze code en een berekening van waarom hij weinig weegt."
  }
 },
 "/drawdown-dca": {
  "en": {
   "t": "Drawdowns and Staged Buying: −50% Needs +100% | broodev",
   "d": "Loss recovery is asymmetric: lump sum vs 4 equal tranches vs drawdown-weighted buys in three declines, running out of cash, and assets that go to zero."
  },
  "ja": {
   "t": "下落率と分割買いの数学 — −50%を取り戻すには+100%が必要 | broodev",
   "d": "損失回復の非対称性を表で計算。一括・均等4分割・下落率加重の3方式を3つの下落シナリオで比べ、弾薬切れの算数とゼロへ向かう資産の罠まで。"
  },
  "zh": {
   "t": "回撤与分批买入的数学 — 跌−50%要涨+100%才能回本 | broodev",
   "d": "用表格计算亏损回本的不对称性：一次性、均等4份、按回撤加权三种买法在三种下跌情景下的表现，以及弹药耗尽和归零资产的陷阱。"
  },
  "zh-Hant": {
   "t": "回撤與分批買入的數學 — 跌−50%要漲+100%才能回本 | broodev",
   "d": "用表格計算虧損回本的不對稱性：一次性、均等4份、依回撤加權三種買法在三種下跌情境下的表現，以及彈藥耗盡與歸零資產的陷阱。"
  },
  "th": {
   "t": "คณิตศาสตร์ของการย่อตัวและการทยอยซื้อ | broodev",
   "d": "การคืนทุนไม่สมมาตร: ซื้อก้อนเดียว แบ่ง 4 เท่ากัน หรือถ่วงตามการย่อตัว ใน 3 สถานการณ์ขาลง คณิตศาสตร์ของกระสุนหมด และสินทรัพย์ที่ไปสู่ศูนย์"
  },
  "es": {
   "t": "Caídas y compra escalonada: −50% exige +100% | broodev",
   "d": "Recuperar pérdidas es asimétrico: compra única, 4 tramos iguales o según la caída en tres escenarios, quedarse sin munición y activos que van a cero."
  },
  "fr": {
   "t": "Replis et achats fractionnés : −50 % exige +100 % | broodev",
   "d": "Récupérer une perte est asymétrique : achat unique, 4 tranches égales ou selon le repli dans trois scénarios, munitions épuisées, actifs allant à zéro."
  },
  "de": {
   "t": "Rückgang und Staffelkauf: −50 % braucht +100 % | broodev",
   "d": "Verluste aufholen ist asymmetrisch: Einmalkauf, 4 gleiche oder rückgangsgewichtete Tranchen in drei Szenarien, leere Munition, Assets auf dem Weg zu null."
  },
  "it": {
   "t": "Ribassi e acquisti scaglionati: −50% chiede +100% | broodev",
   "d": "Il recupero delle perdite è asimmetrico: acquisto unico, 4 tranche uguali o pesate sul ribasso in tre scenari, munizioni esaurite e asset che vanno a zero."
  },
  "pt": {
   "t": "Quedas e compra fracionada: −50% exige +100% | broodev",
   "d": "A recuperação de perdas é assimétrica: compra única, 4 parcelas iguais ou pesadas pela queda em três cenários, munição esgotada e ativos que vão a zero."
  },
  "ru": {
   "t": "Просадка и покупка частями: −50% требует +100% | broodev",
   "d": "Отыгрыш убытков асимметричен: разовая покупка, 4 равные части или части по просадке в трёх сценариях, кончившиеся деньги и активы, идущие к нулю."
  },
  "nl": {
   "t": "Daling en gespreid kopen: −50% vraagt +100% | broodev",
   "d": "Verliesherstel is asymmetrisch: in één keer, 4 gelijke delen of naar daling gewogen delen in drie scenario’s, munitie die opraakt en activa richting nul."
  }
 },
 "/glossary": {
  "en": {
   "t": "Crypto Indicator Glossary: Fear Index, RSI, MACD | broodev",
   "d": "Beginner-friendly definitions of crypto buy-timing terms: Fear & Greed Index, RSI, MACD, Mayer Multiple, drawdown, golden cross, moving averages and DCA."
  },
  "ja": {
   "t": "暗号資産指標の用語集 — 恐怖指数・RSI・MACD | broodev",
   "d": "暗号資産の買い時分析で使う用語を初心者向けに解説。恐怖・強欲指数、RSI、MACD、マイヤー倍率、下落率、ゴールデンクロス、移動平均、DCAなど。"
  },
  "zh": {
   "t": "加密货币指标术语表 — 恐惧指数·RSI·MACD·Mayer 倍数·金叉 | broodev",
   "d": "用新手也能看懂的方式整理了加密货币买入时机分析中常用的术语：恐惧与贪婪指数、RSI、MACD、Mayer 倍数、回撤、金叉、移动平均线、超卖、逆向投资、定投（DCA）等。"
  },
  "zh-Hant": {
   "t": "加密貨幣指標術語表 — 恐懼指數·RSI·MACD | broodev",
   "d": "以新手也能看懂的方式整理加密貨幣買進時機分析中常用的術語：恐懼與貪婪指數、RSI、MACD、Mayer 倍數、回撤、黃金交叉、移動平均線、超賣、逆向投資、定期定額（DCA）等。"
  },
  "th": {
   "t": "อภิธานศัพท์คริปโต — ดัชนีความกลัว·RSI·MACD | broodev",
   "d": "ศัพท์วิเคราะห์จังหวะซื้อคริปโตแบบเข้าใจง่าย: ดัชนีความกลัว-ความโลภ RSI MACD Mayer Multiple การย่อตัว Golden Cross เส้นค่าเฉลี่ย DCA และอื่นๆ"
  },
  "es": {
   "t": "Glosario cripto: índice de miedo, RSI, MACD | broodev",
   "d": "Definiciones sencillas de términos del análisis de compra cripto: índice de miedo y codicia, RSI, MACD, múltiplo de Mayer, caída, cruce dorado, DCA y más."
  },
  "fr": {
   "t": "Glossaire crypto : indice de peur, RSI, MACD | broodev",
   "d": "Définitions simples des termes de l’analyse d’achat crypto : indice de peur et d’avidité, RSI, MACD, multiple de Mayer, repli, croix dorée, DCA et plus."
  },
  "de": {
   "t": "Krypto-Glossar: Angstindex, RSI, MACD, Mayer | broodev",
   "d": "Einsteigerfreundliche Begriffe der Krypto-Kaufanalyse: Angst-&-Gier-Index, RSI, MACD, Mayer Multiple, Rückgang, Golden Cross, Durchschnitte, DCA u. a."
  },
  "it": {
   "t": "Glossario crypto: indice di paura, RSI, MACD | broodev",
   "d": "Definizioni semplici dei termini dell’analisi d’acquisto crypto: indice paura e avidità, RSI, MACD, multiplo di Mayer, ribasso, golden cross, DCA e altro."
  },
  "pt": {
   "t": "Glossário cripto: índice de medo, RSI, MACD | broodev",
   "d": "Definições simples dos termos da análise de compra cripto: índice de medo e ganância, RSI, MACD, múltiplo de Mayer, queda, cruzamento dourado, DCA e mais."
  },
  "ru": {
   "t": "Глоссарий: индекс страха, RSI, MACD, Майер | broodev",
   "d": "Простые определения терминов анализа покупки криптовалют: индекс страха и жадности, RSI, MACD, множитель Майера, просадка, золотой крест, DCA и др."
  },
  "nl": {
   "t": "Crypto-woordenlijst: angstindex, RSI, MACD | broodev",
   "d": "Eenvoudige uitleg van termen uit crypto-koopanalyse: angst-en-hebzuchtindex, RSI, MACD, Mayer Multiple, daling, golden cross, gemiddelden, DCA en meer."
  }
 },
 "/about": {
  "en": {
   "t": "About the Operator and Editorial Principles | broodev",
   "d": "Who runs broodev (Y-Systems) and how: why every score formula is public, data sources, revenue model, conflicts of interest and corrections policy."
  },
  "ja": {
   "t": "運営者情報・編集方針 — 誰が作り、なぜ信頼できるのか | broodev",
   "d": "broodev（運営：Y-Systems）の運営者情報と編集方針。買い時スコアの計算式をすべて公開する理由、データの出典、収益モデル、利益相反の開示、誤り訂正のポリシー。"
  },
  "zh": {
   "t": "运营者介绍 · 编辑原则 — 谁做的，为什么值得信任 | broodev",
   "d": "broodev（运营：Y-Systems）运营者介绍与编辑原则。买入时机评分的计算公式为何全部公开、数据来源、盈利模式、利益冲突声明及勘误政策。"
  },
  "zh-Hant": {
   "t": "營運者介紹 · 編輯原則 — 誰做的，為什麼值得信任 | broodev",
   "d": "broodev（營運方：Y-Systems）營運者介紹與編輯原則。買入時機評分的計算公式為何全部公開、資料來源、獲利模式、利益衝突聲明及勘誤政策。"
  },
  "th": {
   "t": "เกี่ยวกับผู้ดูแลและหลักการด้านเนื้อหา | broodev",
   "d": "ผู้ดูแล broodev (Y-Systems) และหลักการ: ทำไมสูตรคะแนนเปิดเผยทั้งหมด แหล่งข้อมูล รูปแบบรายได้ ผลประโยชน์ทับซ้อน และนโยบายแก้ไขข้อผิดพลาด"
  },
  "es": {
   "t": "Sobre el operador y principios editoriales | broodev",
   "d": "Quién gestiona broodev (Y-Systems) y cómo: por qué las fórmulas son públicas, fuentes de datos, modelo de ingresos, conflictos de interés y correcciones."
  },
  "fr": {
   "t": "À propos de l’éditeur et principes éditoriaux | broodev",
   "d": "Qui gère broodev (Y-Systems) et comment : pourquoi les formules sont publiques, sources, modèle de revenus, conflits d’intérêts et corrections."
  },
  "de": {
   "t": "Über den Betreiber und redaktionelle Grundsätze | broodev",
   "d": "Wer broodev (Y-Systems) betreibt und wie: warum alle Formeln offen sind, Datenquellen, Erlösmodell, Interessenkonflikte und Korrekturrichtlinie."
  },
  "it": {
   "t": "Chi gestisce il sito e principi editoriali | broodev",
   "d": "Chi gestisce broodev (Y-Systems) e come: perché tutte le formule sono pubbliche, fonti dei dati, modello di ricavi, conflitti d’interesse e correzioni."
  },
  "pt": {
   "t": "Sobre o responsável e princípios editoriais | broodev",
   "d": "Quem gere a broodev (Y-Systems) e como: porque todas as fórmulas são públicas, fontes de dados, modelo de receita, conflitos de interesse e correções."
  },
  "ru": {
   "t": "Об авторе и редакционных принципах | broodev",
   "d": "Кто ведёт broodev (Y-Systems) и как: почему все формулы открыты, источники данных, модель дохода, конфликт интересов и политика исправлений."
  },
  "nl": {
   "t": "Over de beheerder en redactionele principes | broodev",
   "d": "Wie broodev (Y-Systems) beheert en hoe: waarom alle formules openbaar zijn, databronnen, verdienmodel, belangenconflicten en correctiebeleid."
  }
 },
 "/privacy": {
  "en": {
   "t": "Privacy Policy | broodev",
   "d": "broodev (operated by Y-Systems) Privacy Policy — data collected, cookies and Google AdSense advertising, third-party data, user rights, and contact."
  },
  "ja": {
   "t": "プライバシーポリシー | broodev",
   "d": "broodev（運営：Y-Systems）のプライバシーポリシー — 取得する情報、Cookie と Google AdSense 広告、第三者データ、利用者の権利、お問い合わせ。"
  },
  "zh": {
   "t": "隐私政策 | broodev",
   "d": "broodev（运营方：Y-Systems）隐私政策 — 收集的信息、Cookie 与 Google AdSense 广告、第三方数据、用户权利及联系方式。"
  },
  "zh-Hant": {
   "t": "隱私權政策 | broodev",
   "d": "broodev（營運方：Y-Systems）隱私權政策 — 蒐集的資訊、Cookie 與 Google AdSense 廣告、第三方資料、使用者權利及聯絡方式。"
  },
  "th": {
   "t": "นโยบายความเป็นส่วนตัว | broodev",
   "d": "นโยบายความเป็นส่วนตัวของ broodev (Y-Systems): ข้อมูลที่เก็บ คุกกี้และโฆษณา Google AdSense ข้อมูลจากบุคคลที่สาม สิทธิ์ของผู้ใช้ และการติดต่อ"
  },
  "es": {
   "t": "Política de privacidad | broodev",
   "d": "Política de privacidad de broodev (Y-Systems): datos recogidos, cookies y anuncios de Google AdSense, datos de terceros, derechos y contacto."
  },
  "fr": {
   "t": "Politique de confidentialité | broodev",
   "d": "Politique de confidentialité de broodev (Y-Systems) : données collectées, cookies et annonces Google AdSense, données tierces, droits et contact."
  },
  "de": {
   "t": "Datenschutzerklärung | broodev",
   "d": "Datenschutzerklärung von broodev (betrieben von Y-Systems) – erhobene Daten, Cookies und Google-AdSense-Werbung, Daten Dritter, Nutzerrechte und Kontakt."
  },
  "it": {
   "t": "Informativa sulla privacy | broodev",
   "d": "Informativa privacy di broodev (Y-Systems): dati raccolti, cookie e annunci Google AdSense, dati di terzi, diritti degli utenti e contatti."
  },
  "pt": {
   "t": "Política de privacidade | broodev",
   "d": "Política de privacidade da broodev (Y-Systems): dados recolhidos, cookies e anúncios Google AdSense, dados de terceiros, direitos e contacto."
  },
  "ru": {
   "t": "Политика конфиденциальности | broodev",
   "d": "Политика конфиденциальности broodev (Y-Systems): собираемые данные, cookie и реклама Google AdSense, сторонние данные, права и контакты."
  },
  "nl": {
   "t": "Privacybeleid | broodev",
   "d": "Privacybeleid van broodev (Y-Systems): verzamelde gegevens, cookies en Google AdSense-advertenties, gegevens van derden, rechten en contact."
  }
 },
 "/terms": {
  "en": {
   "t": "Terms of Service | broodev",
   "d": "broodev (Y-Systems) Terms of Service: nature of the service, disclaimers (not investment advice), intellectual property, governing law and contact."
  },
  "ja": {
   "t": "利用規約 | broodev",
   "d": "broodev（運営：Y-Systems）の利用規約 — サービスの性格、投資助言ではないことを含む免責、知的財産権、準拠法およびお問い合わせ。"
  },
  "zh": {
   "t": "使用条款 | broodev",
   "d": "broodev（运营方：Y-Systems）使用条款 — 服务性质、包括“非投资建议”在内的免责声明、知识产权、适用法律及联系方式。"
  },
  "zh-Hant": {
   "t": "使用條款 | broodev",
   "d": "broodev（營運方：Y-Systems）使用條款 — 服務性質、包括「非投資建議」在內的免責聲明、智慧財產權、準據法及聯絡方式。"
  },
  "th": {
   "t": "ข้อกำหนดการใช้งาน | broodev",
   "d": "ข้อกำหนดการใช้งาน broodev (Y-Systems): ลักษณะบริการ ข้อจำกัดความรับผิดซึ่งรวมถึงการไม่ใช่คำแนะนำการลงทุน ทรัพย์สินทางปัญญา กฎหมาย และการติดต่อ"
  },
  "es": {
   "t": "Términos de uso | broodev",
   "d": "Términos de uso de broodev (Y-Systems): naturaleza del servicio, exenciones (no es asesoría de inversión), propiedad intelectual, ley aplicable y contacto."
  },
  "fr": {
   "t": "Conditions d’utilisation | broodev",
   "d": "CGU de broodev (Y-Systems) : nature du service, avertissements (pas un conseil en investissement), propriété intellectuelle, droit applicable et contact."
  },
  "de": {
   "t": "Nutzungsbedingungen | broodev",
   "d": "Nutzungsbedingungen von broodev (Y-Systems): Art des Dienstes, Haftungsausschlüsse (keine Anlageberatung), geistiges Eigentum, anwendbares Recht, Kontakt."
  },
  "it": {
   "t": "Termini di utilizzo | broodev",
   "d": "Termini di utilizzo di broodev (Y-Systems): natura del servizio, esclusioni (non è consulenza d’investimento), proprietà intellettuale, legge e contatti."
  },
  "pt": {
   "t": "Termos de uso | broodev",
   "d": "Termos de uso da broodev (Y-Systems): natureza do serviço, isenções (não é aconselhamento de investimento), propriedade intelectual, lei e contacto."
  },
  "ru": {
   "t": "Условия использования | broodev",
   "d": "Условия использования broodev (Y-Systems): характер сервиса, отказ от ответственности (не инвестсовет), интеллектуальная собственность, право и контакты."
  },
  "nl": {
   "t": "Gebruiksvoorwaarden | broodev",
   "d": "Gebruiksvoorwaarden van broodev (Y-Systems): aard van de dienst, disclaimers (geen beleggingsadvies), intellectueel eigendom, recht en contact."
  }
 }
};
export const COIN_META = {
 "eth": {
  "/": {
   "en": {
    "t": "Ethereum Fear & Greed Index & Buy Timing | ETH_SIGNAL",
    "d": "Free 0–100 buy-timing score for Ethereum (ETH) from 7 indicators incl. RSI, MACD, Mayer Multiple and MVRV. Fear & Greed is the market-wide index.",
    "img": "https://eth.broodev.com/og-en.png"
   },
   "ja": {
    "t": "イーサリアム 恐怖・強欲指数と買い時 | ETH_SIGNAL",
    "d": "イーサリアム(ETH)の買い時をRSI・MACD・マイヤー倍率・MVRVなど7指標で0〜100点に。恐怖・強欲指数は市場全体の値。無料。",
    "img": "https://eth.broodev.com/og-ja.png"
   },
   "ko": {
    "t": "이더리움 공포·탐욕 지수·매수 타이밍 | ETH_SIGNAL",
    "d": "이더리움(ETH) 매수 타이밍을 RSI·MACD·Mayer Multiple·MVRV 등 7개 지표로 0~100점 평가. 공포·탐욕 지수는 시장 전체 기준. 무료."
   },
   "zh": {
    "t": "以太坊恐惧与贪婪指数·买入时机 | ETH_SIGNAL",
    "d": "用RSI、MACD、梅耶倍数、MVRV等7项指标为以太坊(ETH)给出0–100买入时机评分。恐惧与贪婪指数为全市场指数。免费。",
    "img": "https://eth.broodev.com/og-en.png"
   },
   "zh-Hant": {
    "t": "以太幣恐懼與貪婪指數·買入時機 | ETH_SIGNAL",
    "d": "以RSI、MACD、梅耶倍數、MVRV等7項指標為以太幣(ETH)給出0–100買入時機評分。恐懼與貪婪指數為全市場指數。免費。",
    "img": "https://eth.broodev.com/og-en.png"
   },
   "th": {
    "t": "ดัชนีความกลัว-ความโลภอีเธอเรียม · จังหวะซื้อ | ETH_SIGNAL",
    "d": "คะแนนจังหวะซื้ออีเธอเรียม (ETH) 0–100 จาก 7 ตัวชี้วัด เช่น RSI, MACD, Mayer Multiple และ MVRV ดัชนีความกลัว-ความโลภเป็นค่าของทั้งตลาด ใช้ฟรี",
    "img": "https://eth.broodev.com/og-en.png"
   },
   "es": {
    "t": "Miedo y codicia de Ethereum y momento de compra | ETH_SIGNAL",
    "d": "Puntuación gratuita de 0 a 100 para comprar Ethereum (ETH) con 7 indicadores: RSI, MACD, múltiplo de Mayer, MVRV… El miedo y codicia es de todo el mercado.",
    "img": "https://eth.broodev.com/og-en.png"
   },
   "fr": {
    "t": "Ethereum : peur et avidité, timing d’achat | ETH_SIGNAL",
    "d": "Score gratuit 0–100 pour acheter de l’Ethereum (ETH), sur 7 indicateurs : RSI, MACD, multiple de Mayer, MVRV… Indice peur/avidité du marché entier.",
    "img": "https://eth.broodev.com/og-en.png"
   },
   "de": {
    "t": "Ethereum Angst-&-Gier-Index & Kauf-Timing | ETH_SIGNAL",
    "d": "Kostenloser Kauf-Timing-Score 0–100 für Ethereum (ETH) aus 7 Indikatoren wie RSI, MACD, Mayer-Multiple und MVRV. Angst & Gier gilt für den Gesamtmarkt.",
    "img": "https://eth.broodev.com/og-en.png"
   },
   "it": {
    "t": "Ethereum: paura e avidità e timing d’acquisto | ETH_SIGNAL",
    "d": "Punteggio gratuito 0–100 per comprare Ethereum (ETH) con 7 indicatori: RSI, MACD, multiplo di Mayer, MVRV… L’indice paura/avidità è di tutto il mercato.",
    "img": "https://eth.broodev.com/og-en.png"
   },
   "pt": {
    "t": "Ethereum: medo e ganância e hora de comprar | ETH_SIGNAL",
    "d": "Pontuação gratuita de 0 a 100 para comprar Ethereum (ETH) com 7 indicadores: RSI, MACD, múltiplo de Mayer, MVRV… O medo e ganância é do mercado todo.",
    "img": "https://eth.broodev.com/og-en.png"
   },
   "ru": {
    "t": "Эфириум: страх и жадность, время покупки | ETH_SIGNAL",
    "d": "Бесплатная оценка момента покупки Эфириума (ETH) от 0 до 100 по 7 индикаторам: RSI, MACD, множитель Майера, MVRV… Индекс страха и жадности — общерыночный.",
    "img": "https://eth.broodev.com/og-en.png"
   },
   "nl": {
    "t": "Ethereum angst- en hebzuchtindex & koopmoment | ETH_SIGNAL",
    "d": "Gratis koopmoment-score 0–100 voor Ethereum (ETH) op basis van 7 indicatoren zoals RSI, MACD, Mayer Multiple en MVRV. Angst & hebzucht geldt marktbreed.",
    "img": "https://eth.broodev.com/og-en.png"
   }
  }
 },
 "xrp": {
  "/": {
   "en": {
    "t": "XRP Fear & Greed Index & Buy Timing | XRP_SIGNAL",
    "d": "XRP buy-timing score (0–100) built from 7 price, sentiment and on-chain indicators: RSI, MACD, 200-day average and more. Fear & Greed is market-wide. Free.",
    "img": "https://xrp.broodev.com/og-en.png"
   },
   "ja": {
    "t": "リップル 恐怖・強欲指数と買い時 | XRP_SIGNAL",
    "d": "リップル(XRP)の価格から計算したRSI・MACD・200日線など7指標を合成し、0〜100の買い時スコアで表示。恐怖・強欲は市場全体の指数。無料。",
    "img": "https://xrp.broodev.com/og-ja.png"
   },
   "ko": {
    "t": "리플 공포·탐욕 지수·매수 타이밍 | XRP_SIGNAL",
    "d": "리플(XRP) 가격으로 계산한 RSI·MACD·200일선 등 7개 지표를 합쳐 0~100 매수 타이밍 점수로 표시. 공포·탐욕은 시장 전체 지수. 무료."
   },
   "zh": {
    "t": "瑞波恐惧与贪婪指数·买入时机 | XRP_SIGNAL",
    "d": "根据瑞波(XRP)价格计算RSI、MACD、200日均线等7项指标，合成0–100买入时机评分。恐惧与贪婪为全市场指数。免费。",
    "img": "https://xrp.broodev.com/og-en.png"
   },
   "zh-Hant": {
    "t": "瑞波恐懼與貪婪指數·買入時機 | XRP_SIGNAL",
    "d": "根據瑞波(XRP)價格計算RSI、MACD、200日均線等7項指標，合成0–100買入時機評分。恐懼與貪婪為全市場指數。免費。",
    "img": "https://xrp.broodev.com/og-en.png"
   },
   "th": {
    "t": "ดัชนีความกลัว-ความโลภริปเปิล · จังหวะซื้อ | XRP_SIGNAL",
    "d": "คะแนนจังหวะซื้อริปเปิล (XRP) 0–100 รวมจาก 7 ตัวชี้วัด เช่น RSI, MACD และเส้นเฉลี่ย 200 วัน ความกลัว-ความโลภเป็นดัชนีทั้งตลาด ใช้ฟรี",
    "img": "https://xrp.broodev.com/og-en.png"
   },
   "es": {
    "t": "XRP: miedo y codicia y momento de compra | XRP_SIGNAL",
    "d": "Puntuación 0–100 para comprar XRP con 7 indicadores de precio, sentimiento y on-chain: RSI, MACD, media 200 días… Miedo y codicia: todo el mercado. Gratis.",
    "img": "https://xrp.broodev.com/og-en.png"
   },
   "fr": {
    "t": "XRP : peur et avidité, timing d’achat | XRP_SIGNAL",
    "d": "Score 0–100 pour acheter du XRP, sur 7 indicateurs de prix, de sentiment et on-chain : RSI, MACD, moyenne 200 jours… Peur/avidité : marché entier. Gratuit.",
    "img": "https://xrp.broodev.com/og-en.png"
   },
   "de": {
    "t": "XRP Angst-&-Gier-Index & Kauf-Timing | XRP_SIGNAL",
    "d": "Kauf-Timing-Score 0–100 für XRP aus 7 Kurs-, Stimmungs- und On-Chain-Indikatoren: RSI, MACD, 200-Tage-Linie u. a. Angst & Gier gilt marktweit. Kostenlos.",
    "img": "https://xrp.broodev.com/og-en.png"
   },
   "it": {
    "t": "XRP: paura e avidità e timing d’acquisto | XRP_SIGNAL",
    "d": "Punteggio 0–100 per comprare XRP da 7 indicatori di prezzo, sentiment e on-chain: RSI, MACD, media a 200 giorni… Paura e avidità: tutto il mercato. Gratis.",
    "img": "https://xrp.broodev.com/og-en.png"
   },
   "pt": {
    "t": "XRP: medo e ganância e hora de comprar | XRP_SIGNAL",
    "d": "Pontuação 0–100 para comprar XRP com 7 indicadores de preço, sentimento e on-chain: RSI, MACD, média de 200 dias… Medo e ganância: mercado todo. Grátis.",
    "img": "https://xrp.broodev.com/og-en.png"
   },
   "ru": {
    "t": "Рипл (XRP): страх и жадность, время покупки | XRP_SIGNAL",
    "d": "Оценка момента покупки Рипл (XRP) от 0 до 100 по 7 ценовым, рыночным и ончейн-индикаторам: RSI, MACD, 200-дневная средняя… Индекс страха общерыночный.",
    "img": "https://xrp.broodev.com/og-en.png"
   },
   "nl": {
    "t": "XRP angst- en hebzuchtindex & koopmoment | XRP_SIGNAL",
    "d": "Koopmoment-score 0–100 voor XRP uit 7 koers-, sentiment- en on-chain-indicatoren: RSI, MACD, 200-daags gemiddelde… Angst & hebzucht is marktbreed. Gratis.",
    "img": "https://xrp.broodev.com/og-en.png"
   }
  }
 },
 "doge": {
  "/": {
   "en": {
    "t": "Dogecoin Fear & Greed Index & Buy Timing | DOGE_SIGNAL",
    "d": "0–100 buy-timing score for Dogecoin (DOGE) from 7 price, sentiment and on-chain indicators (RSI, MACD, Mayer, MVRV). Fear & Greed is market-wide. Free.",
    "img": "https://doge.broodev.com/og-en.png"
   },
   "ja": {
    "t": "ドージコイン 恐怖・強欲指数と買い時 | DOGE_SIGNAL",
    "d": "ドージコイン(DOGE)の価格・心理・オンチェーンの7指標（RSI、MACD、マイヤー倍率、MVRVなど）で出す0〜100の買い時スコア。恐怖・強欲は市場全体の値。無料。",
    "img": "https://doge.broodev.com/og-ja.png"
   },
   "ko": {
    "t": "도지코인 공포·탐욕 지수·매수 타이밍 | DOGE_SIGNAL",
    "d": "도지코인(DOGE) 가격·심리·온체인 7개 지표(RSI·MACD·Mayer·MVRV 등)로 매긴 0~100 매수 타이밍 점수. 공포·탐욕은 시장 전체 값. 무료."
   },
   "zh": {
    "t": "狗狗币恐惧与贪婪指数·买入时机 | DOGE_SIGNAL",
    "d": "以价格、情绪与链上共7项指标（RSI、MACD、梅耶倍数、MVRV等）为狗狗币(DOGE)给出0–100买入时机评分。恐惧与贪婪为全市场数值。免费。",
    "img": "https://doge.broodev.com/og-en.png"
   },
   "zh-Hant": {
    "t": "狗狗幣恐懼與貪婪指數·買入時機 | DOGE_SIGNAL",
    "d": "以價格、情緒與鏈上共7項指標（RSI、MACD、梅耶倍數、MVRV等）為狗狗幣(DOGE)給出0–100買入時機評分。恐懼與貪婪為全市場數值。免費。",
    "img": "https://doge.broodev.com/og-en.png"
   },
   "th": {
    "t": "ดัชนีความกลัว-ความโลภดอจคอยน์ · จังหวะซื้อ | DOGE_SIGNAL",
    "d": "คะแนนจังหวะซื้อดอจคอยน์ (DOGE) 0–100 จาก 7 ตัวชี้วัดด้านราคา อารมณ์ตลาด และออนเชน เช่น RSI, MACD และ MVRV ความกลัว-ความโลภเป็นค่าทั้งตลาด ใช้ฟรี",
    "img": "https://doge.broodev.com/og-en.png"
   },
   "es": {
    "t": "Dogecoin: miedo y codicia y momento de compra | DOGE_SIGNAL",
    "d": "Puntuación 0–100 para comprar Dogecoin (DOGE): 7 indicadores de precio, sentimiento y on-chain (RSI, MACD, Mayer, MVRV). Miedo y codicia: todo el mercado.",
    "img": "https://doge.broodev.com/og-en.png"
   },
   "fr": {
    "t": "Dogecoin : peur et avidité, timing d’achat | DOGE_SIGNAL",
    "d": "Score 0–100 pour acheter du Dogecoin (DOGE), sur 7 indicateurs de prix, de sentiment et on-chain (RSI, MACD, Mayer, MVRV). Peur/avidité : marché entier.",
    "img": "https://doge.broodev.com/og-en.png"
   },
   "de": {
    "t": "Dogecoin Angst-&-Gier-Index & Kauf-Timing | DOGE_SIGNAL",
    "d": "Kauf-Timing-Score 0–100 für Dogecoin (DOGE) aus 7 Kurs-, Stimmungs- und On-Chain-Indikatoren (RSI, MACD, Mayer, MVRV). Angst & Gier: Gesamtmarkt. Gratis.",
    "img": "https://doge.broodev.com/og-en.png"
   },
   "it": {
    "t": "Dogecoin: paura e avidità e timing d’acquisto | DOGE_SIGNAL",
    "d": "Punteggio 0–100 per comprare Dogecoin (DOGE) da 7 indicatori di prezzo, sentiment e on-chain (RSI, MACD, Mayer, MVRV). Paura e avidità: tutto il mercato.",
    "img": "https://doge.broodev.com/og-en.png"
   },
   "pt": {
    "t": "Dogecoin: medo e ganância e hora de comprar | DOGE_SIGNAL",
    "d": "Pontuação 0–100 para comprar Dogecoin (DOGE) com 7 indicadores de preço, sentimento e on-chain (RSI, MACD, Mayer, MVRV). Medo e ganância: mercado todo.",
    "img": "https://doge.broodev.com/og-en.png"
   },
   "ru": {
    "t": "Догикоин: страх и жадность, время покупки | DOGE_SIGNAL",
    "d": "Оценка момента покупки Догикоина (DOGE) от 0 до 100 по 7 ценовым, рыночным и ончейн-индикаторам (RSI, MACD, Майер, MVRV). Индекс страха — общерыночный.",
    "img": "https://doge.broodev.com/og-en.png"
   },
   "nl": {
    "t": "Dogecoin angst- en hebzuchtindex & koopmoment | DOGE_SIGNAL",
    "d": "Koopmoment-score 0–100 voor Dogecoin (DOGE) uit 7 koers-, sentiment- en on-chain-indicatoren (RSI, MACD, Mayer, MVRV). Angst & hebzucht is marktbreed.",
    "img": "https://doge.broodev.com/og-en.png"
   }
  }
 },
 "bch": {
  "/": {
   "en": {
    "t": "Bitcoin Cash Fear & Greed, Buy Timing | BCH_SIGNAL",
    "d": "Free live buy-timing score (0–100) for Bitcoin Cash (BCH), built from 7 indicators: RSI, MACD, Fear & Greed, Mayer Multiple, MVRV and more.",
    "img": "https://bch.broodev.com/og-en.png"
   },
   "ja": {
    "t": "ビットコインキャッシュ恐怖・強欲指数と買い時 | BCH_SIGNAL",
    "d": "ビットコインキャッシュ（BCH）の買い時を0〜100で表示。RSI・MACD・恐怖・強欲指数・Mayer Multiple・MVRVなど7指標をリアルタイム合成する無料ツール。",
    "img": "https://bch.broodev.com/og-ja.png"
   },
   "ko": {
    "t": "비트코인캐시 공포·탐욕 지수·매수 타이밍 | BCH_SIGNAL",
    "d": "비트코인캐시(BCH) 매수 타이밍 0~100 점수. RSI·MACD·공포·탐욕 지수·Mayer Multiple·MVRV 등 7개 지표 실시간 합성, 무료."
   },
   "zh": {
    "t": "比特币现金恐惧与贪婪指数·买入时机 | BCH_SIGNAL",
    "d": "比特币现金（BCH）买入时机评分0~100。实时综合RSI、MACD、恐惧与贪婪指数、Mayer Multiple、MVRV等7项指标的免费看板。",
    "img": "https://bch.broodev.com/og-en.png"
   },
   "zh-Hant": {
    "t": "比特幣現金恐懼與貪婪指數·買入時機 | BCH_SIGNAL",
    "d": "比特幣現金（BCH）買入時機評分0~100。即時綜合RSI、MACD、恐懼與貪婪指數、Mayer Multiple、MVRV等7項指標的免費看板。",
    "img": "https://bch.broodev.com/og-en.png"
   },
   "th": {
    "t": "บิตคอยน์แคช ดัชนีกลัว-โลภ · จังหวะซื้อ | BCH_SIGNAL",
    "d": "คะแนนจังหวะซื้อบิตคอยน์แคช (BCH) 0–100 แบบเรียลไทม์ รวม 7 ตัวชี้วัด เช่น RSI, MACD, ดัชนีความกลัวและความโลภ, Mayer Multiple และ MVRV ใช้ฟรี",
    "img": "https://bch.broodev.com/og-en.png"
   },
   "es": {
    "t": "Bitcoin Cash: Miedo y Codicia y compra | BCH_SIGNAL",
    "d": "Puntuación gratuita de 0 a 100 para saber si es momento de comprar Bitcoin Cash (BCH): RSI, MACD, Miedo y Codicia, Mayer Multiple, MVRV y más.",
    "img": "https://bch.broodev.com/og-en.png"
   },
   "fr": {
    "t": "Bitcoin Cash : Peur & Avidité, timing d’achat | BCH_SIGNAL",
    "d": "Score de timing d’achat gratuit (0 à 100) pour Bitcoin Cash (BCH), calculé en direct à partir de 7 indicateurs : RSI, MACD, Peur et Avidité, MVRV…",
    "img": "https://bch.broodev.com/og-en.png"
   },
   "de": {
    "t": "Bitcoin Cash Angst-&-Gier-Index & Kauf-Timing | BCH_SIGNAL",
    "d": "Kostenloser Live-Kauf-Timing-Score (0–100) für Bitcoin Cash (BCH) aus 7 Indikatoren: RSI, MACD, Angst-&-Gier-Index, Mayer Multiple, MVRV u. a.",
    "img": "https://bch.broodev.com/og-en.png"
   },
   "it": {
    "t": "Bitcoin Cash: Paura e Avidità, quando comprare | BCH_SIGNAL",
    "d": "Punteggio gratuito in tempo reale (0–100) sul momento d’acquisto di Bitcoin Cash (BCH), da 7 indicatori: RSI, MACD, Paura e Avidità, MVRV e altri.",
    "img": "https://bch.broodev.com/og-en.png"
   },
   "pt": {
    "t": "Bitcoin Cash: Medo e Ganância e hora de comprar | BCH_SIGNAL",
    "d": "Pontuação gratuita em tempo real (0–100) do momento de compra do Bitcoin Cash (BCH), com 7 indicadores: RSI, MACD, Medo e Ganância, MVRV e mais.",
    "img": "https://bch.broodev.com/og-en.png"
   },
   "ru": {
    "t": "Биткоин-кэш: индекс страха и жадности | BCH_SIGNAL",
    "d": "Бесплатная оценка момента покупки Биткоин-кэша (BCH) от 0 до 100 в реальном времени по 7 индикаторам: RSI, MACD, страх и жадность, MVRV и др.",
    "img": "https://bch.broodev.com/og-en.png"
   },
   "nl": {
    "t": "Bitcoin Cash: Angst & Hebzucht en koopmoment | BCH_SIGNAL",
    "d": "Gratis live koop-timingscore (0–100) voor Bitcoin Cash (BCH) op basis van 7 indicatoren: RSI, MACD, Angst & Hebzucht, Mayer Multiple, MVRV e.a.",
    "img": "https://bch.broodev.com/og-en.png"
   }
  }
 },
 "link": {
  "/": {
   "en": {
    "t": "Chainlink Fear & Greed, Buy Timing | LINK_SIGNAL",
    "d": "Free live 0–100 buy-timing score for Chainlink (LINK), the oracle token: RSI, MACD, Fear & Greed, Mayer Multiple, MVRV and more — 7 indicators.",
    "img": "https://link.broodev.com/og-en.png"
   },
   "ja": {
    "t": "チェーンリンク恐怖・強欲指数と買い時 | LINK_SIGNAL",
    "d": "チェーンリンク（LINK）の買い時を0〜100で表示。オラクルトークンLINKにRSI・MACD・恐怖・強欲指数・MVRVなど7指標を適用する無料ツール。",
    "img": "https://link.broodev.com/og-ja.png"
   },
   "ko": {
    "t": "체인링크 공포·탐욕 지수·매수 타이밍 | LINK_SIGNAL",
    "d": "체인링크(LINK) 매수 타이밍 0~100 점수. 오라클 토큰 LINK에 RSI·MACD·공포·탐욕 지수·MVRV 등 7개 지표 적용, 무료 실시간."
   },
   "zh": {
    "t": "Chainlink恐惧与贪婪指数·买入时机 | LINK_SIGNAL",
    "d": "Chainlink（LINK）买入时机评分0~100。对预言机代币LINK实时应用RSI、MACD、恐惧与贪婪指数、MVRV等7项指标，免费使用。",
    "img": "https://link.broodev.com/og-en.png"
   },
   "zh-Hant": {
    "t": "Chainlink恐懼與貪婪指數·買入時機 | LINK_SIGNAL",
    "d": "Chainlink（LINK）買入時機評分0~100。對預言機代幣LINK即時套用RSI、MACD、恐懼與貪婪指數、MVRV等7項指標，免費使用。",
    "img": "https://link.broodev.com/og-en.png"
   },
   "th": {
    "t": "เชนลิงก์ ดัชนีกลัว-โลภ · จังหวะซื้อ | LINK_SIGNAL",
    "d": "คะแนนจังหวะซื้อเชนลิงก์ (LINK) 0–100 แบบเรียลไทม์ ใช้ 7 ตัวชี้วัด เช่น RSI, MACD, ดัชนีความกลัวและความโลภ และ MVRV กับโทเคนออราเคิล LINK ใช้ฟรี",
    "img": "https://link.broodev.com/og-en.png"
   },
   "es": {
    "t": "Chainlink: Miedo y Codicia y momento de compra | LINK_SIGNAL",
    "d": "Puntuación gratuita en vivo (0–100) del momento de compra de Chainlink (LINK), el token de oráculos: RSI, MACD, Miedo y Codicia, MVRV y más.",
    "img": "https://link.broodev.com/og-en.png"
   },
   "fr": {
    "t": "Chainlink : Peur & Avidité, timing d’achat | LINK_SIGNAL",
    "d": "Score gratuit et en direct (0 à 100) du moment d’achat de Chainlink (LINK), le jeton des oracles : RSI, MACD, Peur et Avidité, MVRV, etc.",
    "img": "https://link.broodev.com/og-en.png"
   },
   "de": {
    "t": "Chainlink Angst-&-Gier-Index & Kauf-Timing | LINK_SIGNAL",
    "d": "Kostenloser Live-Kauf-Timing-Score (0–100) für Chainlink (LINK), den Oracle-Token: RSI, MACD, Angst & Gier, Mayer Multiple, MVRV u. a.",
    "img": "https://link.broodev.com/og-en.png"
   },
   "it": {
    "t": "Chainlink: Paura e Avidità, quando comprare | LINK_SIGNAL",
    "d": "Punteggio gratuito in tempo reale (0–100) sul momento d’acquisto di Chainlink (LINK), il token degli oracoli: RSI, MACD, Paura e Avidità, MVRV.",
    "img": "https://link.broodev.com/og-en.png"
   },
   "pt": {
    "t": "Chainlink: Medo e Ganância e hora de comprar | LINK_SIGNAL",
    "d": "Pontuação gratuita em tempo real (0–100) do momento de compra da Chainlink (LINK), o token de oráculos: RSI, MACD, Medo e Ganância, MVRV e mais.",
    "img": "https://link.broodev.com/og-en.png"
   },
   "ru": {
    "t": "Чейнлинк: индекс страха и жадности | LINK_SIGNAL",
    "d": "Бесплатная оценка момента покупки Чейнлинка (LINK), токена оракулов, от 0 до 100 в реальном времени: RSI, MACD, страх и жадность, MVRV и др.",
    "img": "https://link.broodev.com/og-en.png"
   },
   "nl": {
    "t": "Chainlink: Angst & Hebzucht en koopmoment | LINK_SIGNAL",
    "d": "Gratis live koop-timingscore (0–100) voor Chainlink (LINK), de oracle-token: RSI, MACD, Angst & Hebzucht, Mayer Multiple, MVRV en meer.",
    "img": "https://link.broodev.com/og-en.png"
   }
  }
 },
 "xlm": {
  "/": {
   "en": {
    "t": "Stellar (XLM) Fear & Greed, Buy Timing | XLM_SIGNAL",
    "d": "Free live 0–100 buy-timing score for Stellar (XLM), the payments network’s native asset: RSI, MACD, Fear & Greed, MVRV and more — 7 indicators.",
    "img": "https://xlm.broodev.com/og-en.png"
   },
   "ja": {
    "t": "ステラルーメン恐怖・強欲指数と買い時 | XLM_SIGNAL",
    "d": "ステラルーメン（XLM）の買い時を0〜100で表示。送金ネットワークStellarのXLMにRSI・MACD・恐怖・強欲指数・MVRVなど7指標を適用、無料。",
    "img": "https://xlm.broodev.com/og-ja.png"
   },
   "ko": {
    "t": "스텔라루멘 공포·탐욕 지수·매수 타이밍 | XLM_SIGNAL",
    "d": "스텔라루멘(XLM) 매수 타이밍 0~100 점수. 송금 네트워크 스텔라의 XLM에 RSI·MACD·공포·탐욕 지수·MVRV 등 7개 지표 적용, 무료."
   },
   "zh": {
    "t": "恒星币恐惧与贪婪指数·买入时机 | XLM_SIGNAL",
    "d": "恒星币（XLM）买入时机评分0~100。对跨境支付网络Stellar的XLM实时应用RSI、MACD、恐惧与贪婪指数、MVRV等7项指标，免费使用。",
    "img": "https://xlm.broodev.com/og-en.png"
   },
   "zh-Hant": {
    "t": "恆星幣恐懼與貪婪指數·買入時機 | XLM_SIGNAL",
    "d": "恆星幣（XLM）買入時機評分0~100。對跨境支付網路Stellar的XLM即時套用RSI、MACD、恐懼與貪婪指數、MVRV等7項指標，免費使用。",
    "img": "https://xlm.broodev.com/og-en.png"
   },
   "th": {
    "t": "สเตลลาร์ ดัชนีกลัว-โลภ · จังหวะซื้อ | XLM_SIGNAL",
    "d": "คะแนนจังหวะซื้อสเตลลาร์ (XLM) 0–100 แบบเรียลไทม์ ใช้ 7 ตัวชี้วัด เช่น RSI, MACD, ดัชนีความกลัวและความโลภ และ MVRV กับ XLM ของเครือข่ายโอนเงิน ใช้ฟรี",
    "img": "https://xlm.broodev.com/og-en.png"
   },
   "es": {
    "t": "Stellar (XLM): Miedo y Codicia y compra | XLM_SIGNAL",
    "d": "Puntuación gratuita en vivo (0–100) del momento de compra de Stellar (XLM), activo nativo de la red de pagos: RSI, MACD, Miedo y Codicia, MVRV.",
    "img": "https://xlm.broodev.com/og-en.png"
   },
   "fr": {
    "t": "Stellar (XLM) : Peur & Avidité, timing d’achat | XLM_SIGNAL",
    "d": "Score gratuit et en direct (0 à 100) du moment d’achat de Stellar (XLM), actif natif du réseau de paiement : RSI, MACD, Peur et Avidité, MVRV…",
    "img": "https://xlm.broodev.com/og-en.png"
   },
   "de": {
    "t": "Stellar (XLM) Angst & Gier und Kauf-Timing | XLM_SIGNAL",
    "d": "Kostenloser Live-Kauf-Timing-Score (0–100) für Stellar (XLM), das native Asset des Zahlungsnetzwerks: RSI, MACD, Angst & Gier, MVRV u. a.",
    "img": "https://xlm.broodev.com/og-en.png"
   },
   "it": {
    "t": "Stellar (XLM): Paura e Avidità, quando comprare | XLM_SIGNAL",
    "d": "Punteggio gratuito in tempo reale (0–100) sul momento d’acquisto di Stellar (XLM), asset nativo della rete di pagamenti: RSI, MACD, MVRV e altri.",
    "img": "https://xlm.broodev.com/og-en.png"
   },
   "pt": {
    "t": "Stellar (XLM): Medo e Ganância, hora de comprar | XLM_SIGNAL",
    "d": "Pontuação gratuita em tempo real (0–100) do momento de compra da Stellar (XLM), ativo nativo da rede de pagamentos: RSI, MACD, MVRV e mais.",
    "img": "https://xlm.broodev.com/og-en.png"
   },
   "ru": {
    "t": "Стеллар (XLM): индекс страха и жадности | XLM_SIGNAL",
    "d": "Бесплатная оценка момента покупки Стеллара (XLM), нативного актива платёжной сети, от 0 до 100 в реальном времени: RSI, MACD, MVRV и др.",
    "img": "https://xlm.broodev.com/og-en.png"
   },
   "nl": {
    "t": "Stellar (XLM): Angst & Hebzucht en koopmoment | XLM_SIGNAL",
    "d": "Gratis live koop-timingscore (0–100) voor Stellar (XLM), het native asset van het betaalnetwerk: RSI, MACD, Angst & Hebzucht, MVRV en meer.",
    "img": "https://xlm.broodev.com/og-en.png"
   }
  }
 },
 "ltc": {
  "/": {
   "en": {
    "t": "Litecoin Fear & Greed & Buy-Timing Score | LTC_SIGNAL",
    "d": "A 0–100 Litecoin (LTC) buy-timing score built from RSI, MACD, Mayer Multiple, MVRV and 3 more indicators. Fear & Greed is market-wide. Free, no install.",
    "img": "https://ltc.broodev.com/og-en.png"
   },
   "ja": {
    "t": "ライトコイン 恐怖・強欲指数・買い時スコア | LTC_SIGNAL",
    "d": "ライトコイン(LTC)の買い時をRSI・MACD・マイヤー倍率・MVRVなど7指標で0〜100点に。恐怖・強欲指数は市場全体の値。無料・インストール不要。",
    "img": "https://ltc.broodev.com/og-ja.png"
   },
   "ko": {
    "t": "라이트코인 공포·탐욕 지수·매수 타이밍 | LTC_SIGNAL",
    "d": "라이트코인(LTC) 매수 타이밍을 RSI·MACD·마이어 배수·MVRV 등 7개 지표로 합성한 0~100 점수. 공포·탐욕은 시장 전체 지수. 무료·설치 불필요."
   },
   "zh": {
    "t": "莱特币恐惧与贪婪指数·买入时机评分 | LTC_SIGNAL",
    "d": "用RSI、MACD、梅耶倍数、MVRV等7项指标合成0–100的莱特币(LTC)买入时机评分。恐惧与贪婪指数为全市场指标。免费，无需安装。",
    "img": "https://ltc.broodev.com/og-en.png"
   },
   "zh-Hant": {
    "t": "萊特幣恐懼與貪婪指數·買入時機評分 | LTC_SIGNAL",
    "d": "以RSI、MACD、梅耶倍數、MVRV等7項指標合成0–100的萊特幣(LTC)買入時機評分。恐懼與貪婪指數為全市場指標。免費，免安裝。",
    "img": "https://ltc.broodev.com/og-en.png"
   },
   "th": {
    "t": "ดัชนีกลัว-โลภไลต์คอยน์ · จังหวะซื้อ | LTC_SIGNAL",
    "d": "คะแนนจังหวะซื้อไลต์คอยน์ (LTC) 0–100 จาก 7 ตัวชี้วัด เช่น RSI, MACD, Mayer Multiple และ MVRV ดัชนีความกลัว-ความโลภเป็นค่าของทั้งตลาด ใช้ฟรี",
    "img": "https://ltc.broodev.com/og-en.png"
   },
   "es": {
    "t": "Miedo y codicia de Litecoin · cuándo comprar | LTC_SIGNAL",
    "d": "Puntuación de compra 0–100 de Litecoin (LTC) con RSI, MACD, múltiplo de Mayer, MVRV y 3 indicadores más. Miedo y codicia: índice global. Gratis.",
    "img": "https://ltc.broodev.com/og-en.png"
   },
   "fr": {
    "t": "Litecoin : peur et avidité, moment d'achat | LTC_SIGNAL",
    "d": "Score d'achat 0–100 de Litecoin (LTC) issu du RSI, du MACD, du multiple de Mayer, du MVRV et de 3 autres indicateurs. Peur et avidité : indice global.",
    "img": "https://ltc.broodev.com/og-en.png"
   },
   "de": {
    "t": "Litecoin Angst & Gier · Kaufzeitpunkt-Score | LTC_SIGNAL",
    "d": "Kaufzeitpunkt-Score 0–100 für Litecoin (LTC) aus RSI, MACD, Mayer-Multiple, MVRV und 3 weiteren Indikatoren. Angst & Gier gilt marktweit. Kostenlos.",
    "img": "https://ltc.broodev.com/og-en.png"
   },
   "it": {
    "t": "Litecoin: paura e avidità, quando comprare | LTC_SIGNAL",
    "d": "Punteggio 0–100 sul momento d'acquisto di Litecoin (LTC) da RSI, MACD, multiplo di Mayer, MVRV e altri 3 indicatori. Paura e avidità: indice di mercato.",
    "img": "https://ltc.broodev.com/og-en.png"
   },
   "pt": {
    "t": "Litecoin: medo e ganância, hora de comprar | LTC_SIGNAL",
    "d": "Pontuação 0–100 do momento de compra da Litecoin (LTC) com RSI, MACD, múltiplo de Mayer, MVRV e mais 3 indicadores. Medo e ganância: índice do mercado.",
    "img": "https://ltc.broodev.com/og-en.png"
   },
   "ru": {
    "t": "Лайткоин: страх и жадность, время покупки | LTC_SIGNAL",
    "d": "Оценка момента покупки Лайткоина (LTC) от 0 до 100 по RSI, MACD, мультипликатору Майера, MVRV и ещё 3 индикаторам. Индекс страха и жадности — общерыночный.",
    "img": "https://ltc.broodev.com/og-en.png"
   },
   "nl": {
    "t": "Litecoin angst en hebzucht · koopmoment | LTC_SIGNAL",
    "d": "Koopmoment-score van 0 tot 100 voor Litecoin (LTC) op basis van RSI, MACD, Mayer Multiple, MVRV en nog 3 indicatoren. Angst & hebzucht geldt marktbreed.",
    "img": "https://ltc.broodev.com/og-en.png"
   }
  }
 },
 "avax": {
  "/": {
   "en": {
    "t": "Avalanche Fear & Greed & Buy-Timing Score | AVAX_SIGNAL",
    "d": "A 0–100 Avalanche (AVAX) buy-timing score from RSI, MACD, Mayer Multiple, drawdown and more. MVRV is N/A (no data); Fear & Greed is market-wide. Free.",
    "img": "https://avax.broodev.com/og-en.png"
   },
   "ja": {
    "t": "アバランチ 恐怖・強欲指数・買い時スコア | AVAX_SIGNAL",
    "d": "アバランチ(AVAX)の買い時をRSI・MACD・マイヤー倍率・下落率などで0〜100点に。MVRVはデータがなくN/A、恐怖・強欲指数は市場全体の値。無料。",
    "img": "https://avax.broodev.com/og-ja.png"
   },
   "ko": {
    "t": "아발란체 공포·탐욕 지수·매수 타이밍 | AVAX_SIGNAL",
    "d": "아발란체(AVAX) 매수 타이밍을 RSI·MACD·마이어 배수·낙폭 등으로 매긴 0~100 점수. MVRV는 데이터 없음(N/A), 공포·탐욕은 시장 전체 지수."
   },
   "zh": {
    "t": "雪崩币恐惧与贪婪指数·买入时机评分 | AVAX_SIGNAL",
    "d": "用RSI、MACD、梅耶倍数、回撤等指标合成0–100的雪崩币(AVAX)买入时机评分。MVRV因无数据显示N/A，恐惧与贪婪为全市场指数。免费。",
    "img": "https://avax.broodev.com/og-en.png"
   },
   "zh-Hant": {
    "t": "雪崩幣恐懼與貪婪指數·買入時機評分 | AVAX_SIGNAL",
    "d": "以RSI、MACD、梅耶倍數、回檔幅度等指標合成0–100的雪崩幣(AVAX)買入時機評分。MVRV因無資料顯示N/A，恐懼與貪婪為全市場指數。免費。",
    "img": "https://avax.broodev.com/og-en.png"
   },
   "th": {
    "t": "ดัชนีกลัว-โลภอาวาแลนช์ · จังหวะซื้อ | AVAX_SIGNAL",
    "d": "คะแนนจังหวะซื้ออาวาแลนช์ (AVAX) 0–100 จาก RSI, MACD, Mayer Multiple, การย่อตัว และอื่นๆ MVRV ไม่มีข้อมูล (N/A) ส่วนดัชนีกลัว-โลภเป็นค่าของทั้งตลาด",
    "img": "https://avax.broodev.com/og-en.png"
   },
   "es": {
    "t": "Miedo y codicia de Avalanche · cuándo comprar | AVAX_SIGNAL",
    "d": "Puntuación de compra 0–100 de Avalanche (AVAX) con RSI, MACD, múltiplo de Mayer, caída y más. MVRV sin datos (N/A); miedo y codicia: índice global.",
    "img": "https://avax.broodev.com/og-en.png"
   },
   "fr": {
    "t": "Avalanche : peur et avidité, moment d'achat | AVAX_SIGNAL",
    "d": "Score d'achat 0–100 d'Avalanche (AVAX) : RSI, MACD, multiple de Mayer, repli, etc. MVRV indisponible (N/A) ; peur et avidité : indice global.",
    "img": "https://avax.broodev.com/og-en.png"
   },
   "de": {
    "t": "Avalanche Angst & Gier · Kaufzeitpunkt-Score | AVAX_SIGNAL",
    "d": "Kaufzeitpunkt-Score 0–100 für Avalanche (AVAX) aus RSI, MACD, Mayer-Multiple, Rückgang u. a. MVRV ohne Daten (N/A); Angst & Gier gilt marktweit.",
    "img": "https://avax.broodev.com/og-en.png"
   },
   "it": {
    "t": "Avalanche: paura e avidità, quando comprare | AVAX_SIGNAL",
    "d": "Punteggio d'acquisto 0–100 di Avalanche (AVAX) da RSI, MACD, multiplo di Mayer, calo e altro. MVRV senza dati (N/A); paura e avidità: indice di mercato.",
    "img": "https://avax.broodev.com/og-en.png"
   },
   "pt": {
    "t": "Avalanche: medo e ganância, hora de comprar | AVAX_SIGNAL",
    "d": "Pontuação de compra 0–100 da Avalanche (AVAX) com RSI, MACD, múltiplo de Mayer, queda e mais. MVRV sem dados (N/A); medo e ganância: índice do mercado.",
    "img": "https://avax.broodev.com/og-en.png"
   },
   "ru": {
    "t": "Аваланч: страх и жадность, время покупки | AVAX_SIGNAL",
    "d": "Оценка момента покупки Аваланча (AVAX) 0–100 по RSI, MACD, мультипликатору Майера, просадке и др. Данных MVRV нет (N/A); страх и жадность — весь рынок.",
    "img": "https://avax.broodev.com/og-en.png"
   },
   "nl": {
    "t": "Avalanche angst en hebzucht · koopmoment | AVAX_SIGNAL",
    "d": "Koopmoment-score van 0 tot 100 voor Avalanche (AVAX) uit RSI, MACD, Mayer Multiple, daling en meer. MVRV zonder data (N/A); angst & hebzucht is marktbreed.",
    "img": "https://avax.broodev.com/og-en.png"
   }
  }
 },
 "shib": {
  "/": {
   "en": {
    "t": "Shiba Inu Fear & Greed & Buy-Timing Score | SHIB_SIGNAL",
    "d": "A 0–100 Shiba Inu (SHIB) buy-timing score from RSI, MACD, Mayer Multiple, drawdown and more. Fear & Greed is market-wide; MVRV is N/A. Free to use.",
    "img": "https://shib.broodev.com/og-en.png"
   },
   "ja": {
    "t": "シバイヌ 恐怖・強欲指数・買い時スコア | SHIB_SIGNAL",
    "d": "シバイヌ(SHIB)の買い時をRSI・MACD・マイヤー倍率・下落率などで0〜100点に。恐怖・強欲指数は市場全体の値、MVRVはN/A。無料・インストール不要。",
    "img": "https://shib.broodev.com/og-ja.png"
   },
   "ko": {
    "t": "시바이누 공포·탐욕 지수·매수 타이밍 | SHIB_SIGNAL",
    "d": "시바이누(SHIB) 매수 타이밍을 RSI·MACD·마이어 배수·낙폭 등으로 본 0~100 점수. 공포·탐욕은 시장 전체 값, MVRV는 N/A. 무료."
   },
   "zh": {
    "t": "柴犬币恐惧与贪婪指数·买入时机评分 | SHIB_SIGNAL",
    "d": "用RSI、MACD、梅耶倍数、回撤等指标给出0–100的柴犬币(SHIB)买入时机评分。恐惧与贪婪为全市场指数，MVRV显示N/A。免费，无需安装。",
    "img": "https://shib.broodev.com/og-en.png"
   },
   "zh-Hant": {
    "t": "柴犬幣恐懼與貪婪指數·買入時機評分 | SHIB_SIGNAL",
    "d": "以RSI、MACD、梅耶倍數、回檔幅度等指標給出0–100的柴犬幣(SHIB)買入時機評分。恐懼與貪婪為全市場指數，MVRV顯示N/A。免費，免安裝。",
    "img": "https://shib.broodev.com/og-en.png"
   },
   "th": {
    "t": "ดัชนีกลัว-โลภชิบะอินุ · จังหวะซื้อ | SHIB_SIGNAL",
    "d": "คะแนนจังหวะซื้อชิบะอินุ (SHIB) 0–100 จาก RSI, MACD, Mayer Multiple, การย่อตัว และอื่นๆ ดัชนีกลัว-โลภเป็นค่าของทั้งตลาด ส่วน MVRV เป็น N/A ใช้ฟรี",
    "img": "https://shib.broodev.com/og-en.png"
   },
   "es": {
    "t": "Miedo y codicia de Shiba Inu · cuándo comprar | SHIB_SIGNAL",
    "d": "Puntuación de compra 0–100 de Shiba Inu (SHIB) con RSI, MACD, múltiplo de Mayer, caída y más. Miedo y codicia: índice global; MVRV: N/A. Gratis.",
    "img": "https://shib.broodev.com/og-en.png"
   },
   "fr": {
    "t": "Shiba Inu : peur et avidité, moment d'achat | SHIB_SIGNAL",
    "d": "Score d'achat 0–100 de Shiba Inu (SHIB) : RSI, MACD, multiple de Mayer, repli, etc. Peur et avidité : indice global ; MVRV : N/A. Gratuit.",
    "img": "https://shib.broodev.com/og-en.png"
   },
   "de": {
    "t": "Shiba Inu Angst & Gier · Kaufzeitpunkt-Score | SHIB_SIGNAL",
    "d": "Kaufzeitpunkt-Score 0–100 für Shiba Inu (SHIB) aus RSI, MACD, Mayer-Multiple, Rückgang u. a. Angst & Gier gilt marktweit; MVRV: N/A. Kostenlos.",
    "img": "https://shib.broodev.com/og-en.png"
   },
   "it": {
    "t": "Shiba Inu: paura e avidità, quando comprare | SHIB_SIGNAL",
    "d": "Punteggio d'acquisto 0–100 di Shiba Inu (SHIB) da RSI, MACD, multiplo di Mayer, calo e altro. Paura e avidità: indice di mercato; MVRV: N/A. Gratis.",
    "img": "https://shib.broodev.com/og-en.png"
   },
   "pt": {
    "t": "Shiba Inu: medo e ganância, hora de comprar | SHIB_SIGNAL",
    "d": "Pontuação de compra 0–100 da Shiba Inu (SHIB) com RSI, MACD, múltiplo de Mayer, queda e mais. Medo e ganância: índice do mercado; MVRV: N/A. Grátis.",
    "img": "https://shib.broodev.com/og-en.png"
   },
   "ru": {
    "t": "Шиба-ину: страх и жадность, время покупки | SHIB_SIGNAL",
    "d": "Оценка момента покупки Шиба-ину (SHIB) 0–100 по RSI, MACD, мультипликатору Майера, просадке и др. Страх и жадность — весь рынок; MVRV — N/A. Бесплатно.",
    "img": "https://shib.broodev.com/og-en.png"
   },
   "nl": {
    "t": "Shiba Inu angst en hebzucht · koopmoment | SHIB_SIGNAL",
    "d": "Koopmoment-score van 0 tot 100 voor Shiba Inu (SHIB) uit RSI, MACD, Mayer Multiple, daling en meer. Angst & hebzucht is marktbreed; MVRV: N/A. Gratis.",
    "img": "https://shib.broodev.com/og-en.png"
   }
  }
 },
 "dot": {
  "/": {
   "en": {
    "t": "Polkadot Fear & Greed · Buy-Timing Score | DOT_SIGNAL",
    "d": "Polkadot (DOT) buy-timing score from 0 to 100, built from RSI, MACD, Mayer Multiple, drawdown and the market-wide Fear & Greed Index. Free.",
    "img": "https://dot.broodev.com/og-en.png"
   },
   "ja": {
    "t": "ポルカドット 恐怖・強欲指数 · 買い時 | DOT_SIGNAL",
    "d": "ポルカドット(DOT)の価格にRSI・MACD・マイヤー倍率・下落率などの指標を当てはめた0〜100の買い時スコアと、市場全体の恐怖・強欲指数。無料。",
    "img": "https://dot.broodev.com/og-ja.png"
   },
   "ko": {
    "t": "폴카닷 공포·탐욕 지수 · 매수 타이밍 | DOT_SIGNAL",
    "d": "폴카닷(DOT) 가격에 RSI·MACD·마이어 배수·낙폭 등을 적용한 0~100 매수 타이밍 점수와 시장 전체 공포·탐욕 지수. 무료."
   },
   "zh": {
    "t": "波卡恐惧与贪婪指数 · 买入时机评分 | DOT_SIGNAL",
    "d": "将RSI、MACD、梅耶倍数、回撤等指标应用于波卡(DOT)价格，给出0–100买入时机评分，并显示全市场恐惧与贪婪指数。免费使用。",
    "img": "https://dot.broodev.com/og-en.png"
   },
   "zh-Hant": {
    "t": "波卡恐懼與貪婪指數 · 買入時機評分 | DOT_SIGNAL",
    "d": "將RSI、MACD、梅耶倍數、回撤等指標套用於波卡(DOT)價格，給出0–100買入時機評分，並顯示全市場恐懼與貪婪指數。免費使用。",
    "img": "https://dot.broodev.com/og-en.png"
   },
   "th": {
    "t": "ดัชนีความกลัว-ความโลภ โพลคาดอต · จังหวะซื้อ | DOT_SIGNAL",
    "d": "คะแนนจังหวะซื้อ 0–100 ของโพลคาดอต (DOT) จาก RSI, MACD, Mayer Multiple, การย่อตัว และดัชนีความกลัว-ความโลภของทั้งตลาด ใช้ฟรี",
    "img": "https://dot.broodev.com/og-en.png"
   },
   "es": {
    "t": "Polkadot miedo y codicia · Puntuación de compra | DOT_SIGNAL",
    "d": "Puntuación de compra 0–100 para Polkadot (DOT) con RSI, MACD, múltiplo de Mayer, caída desde máximos y el índice de miedo y codicia del mercado. Gratis.",
    "img": "https://dot.broodev.com/og-en.png"
   },
   "fr": {
    "t": "Polkadot peur et avidité · Score d’achat | DOT_SIGNAL",
    "d": "Score de timing d’achat 0–100 pour Polkadot (DOT) : RSI, MACD, multiple de Mayer, repli depuis le sommet et indice de peur et d’avidité du marché. Gratuit.",
    "img": "https://dot.broodev.com/og-en.png"
   },
   "de": {
    "t": "Polkadot Angst & Gier · Kaufzeitpunkt-Score | DOT_SIGNAL",
    "d": "Kaufzeitpunkt-Score von 0 bis 100 für Polkadot (DOT) aus RSI, MACD, Mayer-Multiple, Rückgang vom Hoch und dem marktweiten Angst- & Gier-Index. Kostenlos.",
    "img": "https://dot.broodev.com/og-en.png"
   },
   "it": {
    "t": "Polkadot paura e avidità · Timing d’acquisto | DOT_SIGNAL",
    "d": "Punteggio d’acquisto 0–100 per Polkadot (DOT) con RSI, MACD, multiplo di Mayer, ribasso dai massimi e indice di paura e avidità del mercato. Gratis.",
    "img": "https://dot.broodev.com/og-en.png"
   },
   "pt": {
    "t": "Polkadot medo e ganância · Pontuação de compra | DOT_SIGNAL",
    "d": "Pontuação de compra de 0 a 100 da Polkadot (DOT) com RSI, MACD, múltiplo de Mayer, queda desde a máxima e o índice de medo e ganância do mercado. Grátis.",
    "img": "https://dot.broodev.com/og-en.png"
   },
   "ru": {
    "t": "Полкадот: страх и жадность · оценка покупки | DOT_SIGNAL",
    "d": "Оценка момента покупки Полкадота (DOT) от 0 до 100 по RSI, MACD, мультипликатору Майера, просадке от максимума и общерыночному индексу страха и жадности.",
    "img": "https://dot.broodev.com/og-en.png"
   },
   "nl": {
    "t": "Polkadot Angst & Hebzucht · Koopmoment-score | DOT_SIGNAL",
    "d": "Koopmoment-score van 0 tot 100 voor Polkadot (DOT) met RSI, MACD, Mayer Multiple, daling vanaf de top en de marktbrede Angst- & Hebzucht-index. Gratis.",
    "img": "https://dot.broodev.com/og-en.png"
   }
  }
 },
 "pepe": {
  "/": {
   "en": {
    "t": "Pepe Fear & Greed · Buy-Timing Score | PEPE_SIGNAL",
    "d": "A 0–100 buy-timing score for the Pepe (PEPE) meme coin from RSI, MACD, Mayer Multiple and more, plus the market-wide Fear & Greed Index. Free.",
    "img": "https://pepe.broodev.com/og-en.png"
   },
   "ja": {
    "t": "ペペ 恐怖・強欲指数 · 買い時スコア | PEPE_SIGNAL",
    "d": "ミームコインのペペ(PEPE)にRSI・MACD・マイヤー倍率などの指標を当てはめ、0〜100の買い時スコアに。市場全体の恐怖・強欲指数も表示する無料ツール。",
    "img": "https://pepe.broodev.com/og-ja.png"
   },
   "ko": {
    "t": "페페 공포·탐욕 지수 · 매수 타이밍 | PEPE_SIGNAL",
    "d": "밈코인 페페(PEPE)의 가격에 RSI·MACD·마이어 배수 등을 적용해 0~100 매수 타이밍 점수로 정리. 시장 전체 공포·탐욕 지수 포함, 무료."
   },
   "zh": {
    "t": "佩佩币恐惧与贪婪指数 · 买入时机评分 | PEPE_SIGNAL",
    "d": "将RSI、MACD、梅耶倍数等指标应用于迷因币佩佩币(PEPE)价格，汇总为0–100买入时机评分，并显示全市场恐惧与贪婪指数。免费。",
    "img": "https://pepe.broodev.com/og-en.png"
   },
   "zh-Hant": {
    "t": "佩佩幣恐懼與貪婪指數 · 買入時機評分 | PEPE_SIGNAL",
    "d": "將RSI、MACD、梅耶倍數等指標套用於迷因幣佩佩幣(PEPE)價格，彙整為0–100買入時機評分，並顯示全市場恐懼與貪婪指數。免費。",
    "img": "https://pepe.broodev.com/og-en.png"
   },
   "th": {
    "t": "ดัชนีความกลัว-ความโลภ เปเป้ · จังหวะซื้อ | PEPE_SIGNAL",
    "d": "คะแนนจังหวะซื้อ 0–100 ของเหรียญมีมเปเป้ (PEPE) จาก RSI, MACD, Mayer Multiple และตัวชี้วัดอื่น พร้อมดัชนีความกลัว-ความโลภของทั้งตลาด ใช้ฟรี",
    "img": "https://pepe.broodev.com/og-en.png"
   },
   "es": {
    "t": "Pepe miedo y codicia · Puntuación de compra | PEPE_SIGNAL",
    "d": "Puntuación de compra 0–100 para la memecoin Pepe (PEPE) con RSI, MACD, múltiplo de Mayer y más, junto al índice de miedo y codicia del mercado. Gratis.",
    "img": "https://pepe.broodev.com/og-en.png"
   },
   "fr": {
    "t": "Pepe peur et avidité · Score d’achat | PEPE_SIGNAL",
    "d": "Score de timing d’achat 0–100 pour le memecoin Pepe (PEPE) : RSI, MACD, multiple de Mayer et plus, avec l’indice de peur et d’avidité du marché. Gratuit.",
    "img": "https://pepe.broodev.com/og-en.png"
   },
   "de": {
    "t": "Pepe Angst & Gier · Kaufzeitpunkt-Score | PEPE_SIGNAL",
    "d": "Kaufzeitpunkt-Score von 0 bis 100 für den Memecoin Pepe (PEPE) aus RSI, MACD, Mayer-Multiple und mehr, dazu der marktweite Angst- & Gier-Index. Kostenlos.",
    "img": "https://pepe.broodev.com/og-en.png"
   },
   "it": {
    "t": "Pepe paura e avidità · Timing d’acquisto | PEPE_SIGNAL",
    "d": "Punteggio d’acquisto 0–100 per la memecoin Pepe (PEPE) con RSI, MACD, multiplo di Mayer e altro, più l’indice di paura e avidità del mercato. Gratis.",
    "img": "https://pepe.broodev.com/og-en.png"
   },
   "pt": {
    "t": "Pepe medo e ganância · Pontuação de compra | PEPE_SIGNAL",
    "d": "Pontuação de compra de 0 a 100 da memecoin Pepe (PEPE) com RSI, MACD, múltiplo de Mayer e mais, junto do índice de medo e ganância do mercado. Grátis.",
    "img": "https://pepe.broodev.com/og-en.png"
   },
   "ru": {
    "t": "Пепе: страх и жадность · оценка покупки | PEPE_SIGNAL",
    "d": "Оценка покупки мемкоина Пепе (PEPE) от 0 до 100 по RSI, MACD, мультипликатору Майера и другим индикаторам плюс общерыночный индекс страха и жадности.",
    "img": "https://pepe.broodev.com/og-en.png"
   },
   "nl": {
    "t": "Pepe Angst & Hebzucht · Koopmoment-score | PEPE_SIGNAL",
    "d": "Koopmoment-score van 0 tot 100 voor de memecoin Pepe (PEPE) met RSI, MACD, Mayer Multiple en meer, plus de marktbrede Angst- & Hebzucht-index. Gratis.",
    "img": "https://pepe.broodev.com/og-en.png"
   }
  }
 },
 "grt": {
  "/": {
   "en": {
    "t": "The Graph Fear & Greed · Buy-Timing Score | GRT_SIGNAL",
    "d": "The Graph (GRT) buy-timing score from 0 to 100 using RSI, MACD, Mayer Multiple and more, alongside the market-wide Fear & Greed Index. Free, no install.",
    "img": "https://grt.broodev.com/og-en.png"
   },
   "ja": {
    "t": "ザ・グラフ 恐怖・強欲指数 · 買い時 | GRT_SIGNAL",
    "d": "ザ・グラフ(GRT)の価格にRSI・MACD・マイヤー倍率などの指標を当てはめた0〜100の買い時スコアと、市場全体の恐怖・強欲指数。インストール不要・無料。",
    "img": "https://grt.broodev.com/og-ja.png"
   },
   "ko": {
    "t": "더그래프 공포·탐욕 지수 · 매수 타이밍 | GRT_SIGNAL",
    "d": "더그래프(GRT) 가격에 RSI·MACD·마이어 배수 등을 적용한 0~100 매수 타이밍 점수와 시장 전체 공포·탐욕 지수. 설치 없이 무료."
   },
   "zh": {
    "t": "The Graph恐惧贪婪指数 · 买入时机 | GRT_SIGNAL",
    "d": "将RSI、MACD、梅耶倍数等指标应用于The Graph(GRT)价格，给出0–100买入时机评分，并显示全市场恐惧与贪婪指数。免费，无需安装。",
    "img": "https://grt.broodev.com/og-en.png"
   },
   "zh-Hant": {
    "t": "The Graph恐懼貪婪指數 · 買入時機 | GRT_SIGNAL",
    "d": "將RSI、MACD、梅耶倍數等指標套用於The Graph(GRT)價格，給出0–100買入時機評分，並顯示全市場恐懼與貪婪指數。免費，免安裝。",
    "img": "https://grt.broodev.com/og-en.png"
   },
   "th": {
    "t": "ดัชนีความกลัว-ความโลภ เดอะกราฟ · จังหวะซื้อ | GRT_SIGNAL",
    "d": "คะแนนจังหวะซื้อ 0–100 ของเดอะกราฟ (GRT) จาก RSI, MACD, Mayer Multiple และตัวชี้วัดอื่น พร้อมดัชนีความกลัว-ความโลภทั้งตลาด ใช้ฟรี ไม่ต้องติดตั้ง",
    "img": "https://grt.broodev.com/og-en.png"
   },
   "es": {
    "t": "The Graph miedo y codicia · Momento de compra | GRT_SIGNAL",
    "d": "Puntuación de compra 0–100 para The Graph (GRT) con RSI, MACD, múltiplo de Mayer y más, junto al índice de miedo y codicia del mercado. Gratis.",
    "img": "https://grt.broodev.com/og-en.png"
   },
   "fr": {
    "t": "The Graph peur et avidité · Score d’achat | GRT_SIGNAL",
    "d": "Score de timing d’achat 0–100 pour The Graph (GRT) : RSI, MACD, multiple de Mayer et plus, avec l’indice de peur et d’avidité du marché. Gratuit.",
    "img": "https://grt.broodev.com/og-en.png"
   },
   "de": {
    "t": "The Graph Angst & Gier · Kaufzeitpunkt-Score | GRT_SIGNAL",
    "d": "Kaufzeitpunkt-Score von 0 bis 100 für The Graph (GRT) aus RSI, MACD, Mayer-Multiple und mehr, dazu der marktweite Angst- & Gier-Index. Kostenlos.",
    "img": "https://grt.broodev.com/og-en.png"
   },
   "it": {
    "t": "The Graph paura e avidità · Timing d’acquisto | GRT_SIGNAL",
    "d": "Punteggio d’acquisto 0–100 per The Graph (GRT) con RSI, MACD, multiplo di Mayer e altro, più l’indice di paura e avidità del mercato. Gratis.",
    "img": "https://grt.broodev.com/og-en.png"
   },
   "pt": {
    "t": "The Graph medo/ganância · Pontuação de compra | GRT_SIGNAL",
    "d": "Pontuação de compra de 0 a 100 do The Graph (GRT) com RSI, MACD, múltiplo de Mayer e mais, junto do índice de medo e ganância do mercado. Grátis.",
    "img": "https://grt.broodev.com/og-en.png"
   },
   "ru": {
    "t": "The Graph: страх и жадность · оценка покупки | GRT_SIGNAL",
    "d": "Оценка покупки The Graph (GRT) от 0 до 100 по RSI, MACD, мультипликатору Майера и другим индикаторам плюс общерыночный индекс страха и жадности. Бесплатно.",
    "img": "https://grt.broodev.com/og-en.png"
   },
   "nl": {
    "t": "The Graph Angst & Hebzucht · Koopmoment | GRT_SIGNAL",
    "d": "Koopmoment-score van 0 tot 100 voor The Graph (GRT) met RSI, MACD, Mayer Multiple en meer, plus de marktbrede Angst- & Hebzucht-index. Gratis.",
    "img": "https://grt.broodev.com/og-en.png"
   }
  }
 },
 "sand": {
  "/": {
   "en": {
    "t": "The Sandbox Buy-Timing Score & Fear/Greed | SAND_SIGNAL",
    "d": "Free SAND buy-timing score (0–100) from RSI, MACD, Mayer Multiple and more. Fear & Greed here is the market-wide index; MVRV has no data for SAND.",
    "img": "https://sand.broodev.com/og-en.png"
   },
   "ja": {
    "t": "サンドボックス 恐怖・強欲と買い時スコア | SAND_SIGNAL",
    "d": "サンドボックス(SAND)の買い時をRSI・MACD・メイヤー倍率などの指標で0〜100点に。恐怖・強欲指数は市場全体の値、MVRVはデータなし。無料。",
    "img": "https://sand.broodev.com/og-ja.png"
   },
   "ko": {
    "t": "샌드박스 공포·탐욕·매수 타이밍 | SAND_SIGNAL",
    "d": "샌드박스(SAND) 매수 타이밍을 RSI·MACD 등의 지표로 0~100점 평가. 공포·탐욕은 시장 전체 지수, MVRV는 데이터 없음. 무료."
   },
   "zh": {
    "t": "沙盒(SAND)买入时机评分·恐惧与贪婪 | SAND_SIGNAL",
    "d": "用RSI、MACD、梅耶倍数等指标为沙盒(SAND)买入时机打0–100分。恐惧与贪婪为全市场指数，SAND暂无MVRV数据。免费使用。",
    "img": "https://sand.broodev.com/og-en.png"
   },
   "zh-Hant": {
    "t": "沙盒(SAND)買入時機評分·恐懼與貪婪 | SAND_SIGNAL",
    "d": "以RSI、MACD、梅耶倍數等指標為沙盒(SAND)買入時機打0–100分。恐懼與貪婪為全市場指數，SAND暫無MVRV資料。免費使用。",
    "img": "https://sand.broodev.com/og-en.png"
   },
   "th": {
    "t": "แซนด์บ็อกซ์ คะแนนจังหวะซื้อ · ความกลัว-โลภ | SAND_SIGNAL",
    "d": "คะแนนจังหวะซื้อ SAND ฟรี 0–100 จากตัวชี้วัด เช่น RSI, MACD, Mayer Multiple ดัชนีความกลัว-ความโลภเป็นของทั้งตลาด และ SAND ไม่มีข้อมูล MVRV",
    "img": "https://sand.broodev.com/og-en.png"
   },
   "es": {
    "t": "The Sandbox: Timing de Compra y Miedo/Codicia | SAND_SIGNAL",
    "d": "Puntuación gratuita 0–100 del momento de compra de SAND con RSI, MACD, múltiplo de Mayer y más. Miedo y Codicia es del mercado entero; SAND no tiene MVRV.",
    "img": "https://sand.broodev.com/og-en.png"
   },
   "fr": {
    "t": "The Sandbox : timing d’achat et Peur/Avidité | SAND_SIGNAL",
    "d": "Score gratuit 0–100 du moment d’achat de SAND via RSI, MACD, multiple de Mayer et plus. L’indice Peur & Avidité est global ; pas de MVRV pour SAND.",
    "img": "https://sand.broodev.com/og-en.png"
   },
   "de": {
    "t": "The Sandbox: Kauf-Timing-Score & Angst/Gier | SAND_SIGNAL",
    "d": "Kostenloser SAND-Kauf-Timing-Score (0–100) aus RSI, MACD, Mayer Multiple u. a. Der Angst-&-Gier-Index gilt für den Gesamtmarkt; für SAND gibt es kein MVRV.",
    "img": "https://sand.broodev.com/og-en.png"
   },
   "it": {
    "t": "The Sandbox: timing d’acquisto e Paura/Avidità | SAND_SIGNAL",
    "d": "Punteggio gratis 0–100 del momento d’acquisto di SAND con RSI, MACD, multiplo di Mayer e altro. Paura e Avidità è l’indice del mercato; SAND non ha MVRV.",
    "img": "https://sand.broodev.com/og-en.png"
   },
   "pt": {
    "t": "The Sandbox: timing de compra e Medo/Ganância | SAND_SIGNAL",
    "d": "Pontuação grátis de 0–100 do momento de compra de SAND com RSI, MACD, múltiplo de Mayer e mais. Medo e Ganância é do mercado todo; SAND não tem MVRV.",
    "img": "https://sand.broodev.com/og-en.png"
   },
   "ru": {
    "t": "Сэндбокс: тайминг покупки и страх/жадность | SAND_SIGNAL",
    "d": "Бесплатная оценка момента покупки SAND (0–100) по RSI, MACD, множителю Майера и др. Индекс страха и жадности — общий для рынка; MVRV для SAND нет.",
    "img": "https://sand.broodev.com/og-en.png"
   },
   "nl": {
    "t": "The Sandbox: koop-timing en Angst/Hebzucht | SAND_SIGNAL",
    "d": "Gratis koop-timingscore (0–100) voor SAND op basis van RSI, MACD, Mayer Multiple en meer. De Angst-&-Hebzucht-index is marktbreed; geen MVRV voor SAND.",
    "img": "https://sand.broodev.com/og-en.png"
   }
  }
 },
 "mana": {
  "/": {
   "en": {
    "t": "Decentraland Buy-Timing Score & Fear/Greed | MANA_SIGNAL",
    "d": "Free MANA buy-timing score (0–100) from 7 indicators incl. RSI, MACD and MVRV. Fear & Greed here is the market-wide index, not a MANA-only one.",
    "img": "https://mana.broodev.com/og-en.png"
   },
   "ja": {
    "t": "ディセントラランド 恐怖・強欲と買い時 | MANA_SIGNAL",
    "d": "ディセントラランド(MANA)の買い時をRSI・MACD・MVRVなど7指標で0〜100点に。恐怖・強欲指数は市場全体の値。当日のスコアは無料。",
    "img": "https://mana.broodev.com/og-ja.png"
   },
   "ko": {
    "t": "디센트럴랜드 공포·탐욕·매수 타이밍 | MANA_SIGNAL",
    "d": "디센트럴랜드(MANA) 매수 타이밍을 RSI·MACD·MVRV 등 7개 지표로 0~100점 평가. 공포·탐욕은 시장 전체 지수. 오늘의 점수는 무료."
   },
   "zh": {
    "t": "Decentraland买入时机与恐惧贪婪 | MANA_SIGNAL",
    "d": "用RSI、MACD、MVRV等7项指标为Decentraland(MANA)买入时机打0–100分。恐惧与贪婪为全市场指数。当日评分免费。",
    "img": "https://mana.broodev.com/og-en.png"
   },
   "zh-Hant": {
    "t": "Decentraland買入時機與恐懼貪婪 | MANA_SIGNAL",
    "d": "以RSI、MACD、MVRV等7項指標為Decentraland(MANA)買入時機打0–100分。恐懼與貪婪為全市場指數。當日評分免費。",
    "img": "https://mana.broodev.com/og-en.png"
   },
   "th": {
    "t": "ดีเซนทราแลนด์ คะแนนจังหวะซื้อ · กลัว-โลภ | MANA_SIGNAL",
    "d": "คะแนนจังหวะซื้อ MANA ฟรี 0–100 จาก 7 ตัวชี้วัด รวม RSI, MACD และ MVRV ดัชนีความกลัว-ความโลภในหน้านี้เป็นของทั้งตลาด ไม่ใช่ของ MANA โดยเฉพาะ",
    "img": "https://mana.broodev.com/og-en.png"
   },
   "es": {
    "t": "Decentraland: timing de compra y Miedo/Codicia | MANA_SIGNAL",
    "d": "Puntuación gratuita 0–100 del momento de compra de MANA con 7 indicadores, incluidos RSI, MACD y MVRV. Miedo y Codicia es del mercado entero, no de MANA.",
    "img": "https://mana.broodev.com/og-en.png"
   },
   "fr": {
    "t": "Decentraland : timing d’achat, Peur/Avidité | MANA_SIGNAL",
    "d": "Score gratuit 0–100 du moment d’achat de MANA sur 7 indicateurs dont RSI, MACD et MVRV. L’indice Peur & Avidité est celui du marché entier, pas de MANA.",
    "img": "https://mana.broodev.com/og-en.png"
   },
   "de": {
    "t": "Decentraland: Kauf-Timing-Score & Angst/Gier | MANA_SIGNAL",
    "d": "Kostenloser MANA-Kauf-Timing-Score (0–100) aus 7 Indikatoren, darunter RSI, MACD und MVRV. Der Angst-&-Gier-Index gilt für den Gesamtmarkt, nicht nur MANA.",
    "img": "https://mana.broodev.com/og-en.png"
   },
   "it": {
    "t": "Decentraland: timing d’acquisto, Paura/Avidità | MANA_SIGNAL",
    "d": "Punteggio gratis 0–100 del momento d’acquisto di MANA da 7 indicatori tra cui RSI, MACD e MVRV. Paura e Avidità è un indice di mercato, non di MANA.",
    "img": "https://mana.broodev.com/og-en.png"
   },
   "pt": {
    "t": "Decentraland: timing de compra e Medo/Ganância | MANA_SIGNAL",
    "d": "Pontuação grátis de 0–100 do momento de compra de MANA com 7 indicadores, entre eles RSI, MACD e MVRV. Medo e Ganância é do mercado todo, não só de MANA.",
    "img": "https://mana.broodev.com/og-en.png"
   },
   "ru": {
    "t": "Децентраленд: тайминг покупки и страх/жадность | MANA_SIGNAL",
    "d": "Бесплатная оценка момента покупки MANA (0–100) по 7 индикаторам, включая RSI, MACD и MVRV. Индекс страха и жадности — общерыночный, не только MANA.",
    "img": "https://mana.broodev.com/og-en.png"
   },
   "nl": {
    "t": "Decentraland: koop-timing en Angst/Hebzucht | MANA_SIGNAL",
    "d": "Gratis koop-timingscore (0–100) voor MANA uit 7 indicatoren, waaronder RSI, MACD en MVRV. De Angst-&-Hebzucht-index is marktbreed, niet alleen voor MANA.",
    "img": "https://mana.broodev.com/og-en.png"
   }
  }
 }
};
