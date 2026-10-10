/* 하단 SEO 본문 다국어 데이터 + 렌더러. index.html(광고) / member/index.html(구독자) 공유.
   언어 전환 시 window.renderSEO(lang) 호출 → section.seo 를 해당 언어로 다시 그림.
   기본 정적 HTML(한국어)은 무JS 크롤러용 폴백으로 남겨두고, JS 실행 시 현재 언어로 교체. */
(function () {
  var SEO = {
    ko: {
      title: '아발란체 공포·탐욕 지수 & 매수 타이밍 점수',
      intro: '아발란체 공포지수(공포·탐욕 지수, Fear & Greed Index)를 포함한 7개 실시간 지표를 합성해 “지금이 매수 타이밍인가?”를 0~100 점수로 보여주는 무료 대시보드입니다. 설치 없이 브라우저에서 바로 실행되며 13개 언어를 지원합니다.',
      whatIsH: '비트코인 공포지수란?',
      whatIsP: '공포·탐욕 지수는 비트코인 투자 심리를 0~100으로 나타낸 지표입니다. 0에 가까우면 극단적 공포, 100에 가까우면 극단적 탐욕을 뜻합니다. 흔히 “남들이 공포에 팔 때가 기회”라는 역발상 신호로 쓰이며, 데이터 출처는 Alternative.me입니다.',
      scoreH: '매수 타이밍 점수 — 7개 지표',
      score: ['공포·탐욕 지수 — 극단적 공포 = 매수 기회(역발상)', 'RSI(14) — 과매도(<30) 시 매수 우호', 'MACD(12·26·9) — 바닥에서 상향 전환 시 매수 모멘텀', '마이어 배수 — 가격 ÷ 200일선, 1 미만이면 저평가', '365일 고점 대비 낙폭 — 깊은 하락일수록 분할 매수 구간', '골든·데드 크로스 — 50/200 이동평균 추세 필터', 'MVRV Z-점수 — 시가총액 ÷ 실현시가총액(평균 매수원가), 역사적 바닥·고점 온체인 지표'],
      scoreNote: '7개 부분점수를 가중 합성해 0~100 점수와 STRONG BUY·ACCUMULATE·NEUTRAL·CAUTION·OVERHEATED 5단계로 표시합니다.',
      fngH: '공포·탐욕 지수 5단계',
      fng: ['0~25 극단적 공포(Extreme Fear) — 투매·패닉, 역사적 분할 매수 관심 구간', '25~45 공포(Fear) — 약세 심리', '45~55 중립(Neutral) — 방향성 불분명', '55~75 탐욕(Greed) — 과열 초입', '75~100 극단적 탐욕(Extreme Greed) — 과열·고점 경계'],
      bandsH: '매수 타이밍 점수 5단계 밴드',
      bands: ['80~100 STRONG BUY — 과매도+공포+저평가 다중 합류', '65~80 ACCUMULATE — 분할 적립 우호', '45~65 NEUTRAL — 관망', '25~45 CAUTION — 추격 매수 자제', '0~25 OVERHEATED — 과열, 신규 매수 금지'],
      faqH: '자주 묻는 질문',
      faq: [
        { q: '공포지수가 낮으면 아발란체을 사야 하나요?', a: '극단적 공포는 역사적으로 분할 매수 기회였던 경우가 많지만, 공포지수 하나만 보면 “떨어지는 칼날”을 잡을 위험이 있습니다. 본 점수는 RSI·MACD·마이어 배수·낙폭·이동평균 크로스를 함께 보고, 하락 추세에서는 점수를 보수적으로 낮춥니다.' },
        { q: '매수 타이밍 점수는 어떻게 계산되나요?', a: '7개 지표를 각각 0~100 부분점수로 환산해 가중 합성합니다. 결과는 0~100이며 5단계 밴드로 표시됩니다.' },
        { q: '무료인가요? 설치가 필요한가요?', a: '완전 무료이며 설치가 필요 없습니다. CoinGecko·Binance·Alternative.me 공개 API에서 실시간 데이터를 가져옵니다.' },
        { q: '공포지수와 매수 타이밍 점수는 무엇이 다른가요?', a: '공포지수는 심리 한 가지 지표(0~100)이고, 매수 타이밍 점수는 공포지수를 포함한 7개 지표를 합성한 종합 점수(0~100)입니다.' },
        { q: '공포지수 데이터는 어디서 가져오나요? 얼마나 자주 갱신되나요?', a: '공포·탐욕 지수는 Alternative.me, 가격·일봉은 CoinGecko·Binance, 온체인 지표는 CoinMetrics 공개 API에서 실시간으로 가져옵니다. 화면은 약 1분 주기로 자동 갱신됩니다.' },
        { q: '아발란체 지금 사도 되나요?', a: '정답은 없지만, 매수 타이밍 점수(0~100)로 현재 시장이 과매도·공포 구간인지 과열·탐욕 구간인지 객관적으로 가늠할 수 있습니다. 장기(역발상) 탭 기준 점수가 높을수록 공포·저평가가 겹친 분할 매수 우호 구간, 낮을수록 과열 경계 구간입니다. 참고 신호일 뿐 투자 자문이 아닙니다.' },
        { q: '단기와 장기 매수 타이밍은 어떻게 다른가요?', a: '점수는 단기·장기 두 탭으로 나뉩니다. 단기(모멘텀)는 약 1~3개월 추세추종 관점으로 상승 추세가 강할수록 높고, 장기(역발상)는 약 1년 이상 사이클 관점으로 공포·저평가일수록 높습니다. 2017년 이후 백테스트에서 단기는 모멘텀, 장기는 역발상 방향이 더 잘 맞았습니다.' },
        { q: 'BOTTOM RADAR(바닥 점수)는 무엇인가요?', a: 'MVRV Z-점수 같은 온체인 지표로 시가총액이 투자자 평균 매수원가 대비 어디에 있는지 재서, 역사적 바닥 구간과의 근접도를 0~100으로 보여주는 보조 게이지입니다. 계산 근거는 “비트코인 바닥” 해설 페이지에 공개되어 있습니다.' }
      ],
      disclaimer: '⚠ 본 점수는 공개 지표를 합성한 참고 신호이며 투자 자문이 아닙니다. 모든 투자 판단과 책임은 이용자 본인에게 있습니다.'
    },
    en: {
      title: 'Avalanche Fear & Greed Index & Buy-Timing Score',
      intro: 'A free dashboard that synthesizes 7 real-time indicators — including the Avalanche Fear & Greed Index — into a 0–100 “is now a good time to buy?” score. Runs in your browser with no install, in 13 languages.',
      whatIsH: 'What is the Bitcoin Fear & Greed Index?',
      whatIsP: 'The Fear & Greed Index expresses Bitcoin investor sentiment from 0 to 100. Near 0 means extreme fear; near 100 means extreme greed. It is often used as a contrarian signal — “be greedy when others are fearful.” Data source: Alternative.me.',
      scoreH: 'Buy-timing score — 7 indicators',
      score: ['Fear & Greed Index — extreme fear = buying opportunity (contrarian)', 'RSI(14) — oversold (<30) favors buying', 'MACD(12·26·9) — upturn from the bottom = buy momentum', 'Mayer Multiple — price ÷ 200-day MA; below 1 is undervalued', 'Drawdown from 365-day high — deeper drops = accumulation zone', 'Golden/Death Cross — 50/200 moving-average trend filter', 'MVRV Z-Score — market cap ÷ realized cap (average cost basis); on-chain gauge of historic bottoms and tops'],
      scoreNote: 'The 7 sub-scores are weighted into a 0–100 score, shown in 5 bands: STRONG BUY · ACCUMULATE · NEUTRAL · CAUTION · OVERHEATED.',
      fngH: 'Fear & Greed — 5 levels',
      fng: ['0–25 Extreme Fear — panic selling; historically an accumulation-interest zone', '25–45 Fear — bearish sentiment', '45–55 Neutral — unclear direction', '55–75 Greed — early overheating', '75–100 Extreme Greed — overheated, watch for tops'],
      bandsH: 'Buy-timing score — 5 bands',
      bands: ['80–100 STRONG BUY — oversold + fear + undervaluation converge', '65–80 ACCUMULATE — favorable for DCA', '45–65 NEUTRAL — wait and see', '25–45 CAUTION — avoid chasing', '0–25 OVERHEATED — overheated, no new buys'],
      faqH: 'FAQ',
      faq: [
        { q: 'Should I buy Avalanche when the index is low?', a: 'Extreme fear has often been an accumulation opportunity, but relying on the index alone risks catching a falling knife. This score also weighs RSI, MACD, Mayer Multiple, drawdown and moving-average crosses, and lowers the score conservatively in downtrends.' },
        { q: 'How is the buy-timing score calculated?', a: 'Each of the 7 indicators is converted to a 0–100 sub-score and weighted together. The result is 0–100, shown in 5 bands.' },
        { q: 'Is it free? Do I need to install anything?', a: 'It is completely free with no install. Real-time data comes from CoinGecko, Binance and Alternative.me public APIs.' },
        { q: 'How is the index different from the buy-timing score?', a: 'The index is a single sentiment metric (0–100); the buy-timing score is a composite of 7 indicators including the index (0–100).' },
        { q: 'Where does the data come from, and how often does it refresh?', a: 'The Fear & Greed Index comes from Alternative.me, prices and daily candles from the CoinGecko and Binance public APIs, and on-chain metrics from CoinMetrics. The screen auto-refreshes roughly every minute.' },
        { q: 'Should I buy Avalanche right now?', a: 'There is no single answer, but the buy-timing score (0–100) gives an objective read on whether the market is in an oversold/fear zone or an overheated/greed zone. On the long-term (contrarian) tab, higher scores mark zones where fear and undervaluation overlap — historically favorable for DCA — while lower scores warn of overheating. It is a reference signal, not investment advice.' },
        { q: 'How do short-term and long-term buy timing differ?', a: 'The score is split into two tabs. Short-term (momentum) takes a 1–3 month trend-following view and rises with strong uptrends; long-term (contrarian) takes a 1-year-plus cycle view and rises with fear and undervaluation. In backtests since 2017, momentum worked better short-term and contrarian worked better long-term.' },
        { q: 'What is the BOTTOM RADAR (bottom score)?', a: 'A secondary gauge that uses on-chain metrics such as the MVRV Z-Score to measure where market cap sits relative to investors’ average cost basis, showing proximity to historic bottom zones on a 0–100 scale. The full calculation is published on the “Bitcoin bottom” guide page.' }
      ],
      disclaimer: '⚠ This score is a reference signal built from public indicators, not investment advice. All decisions and responsibility are your own.'
    },
    ja: {
      title: 'アバランチ 恐怖・強欲指数 & 買い時スコア',
      intro: 'アバランチの恐怖・強欲指数（Fear & Greed Index）を含む7つのリアルタイム指標を合成し、「今が買い時か？」を0〜100のスコアで示す無料ダッシュボードです。インストール不要でブラウザから即実行、13言語対応。',
      whatIsH: 'ビットコイン恐怖指数とは？',
      whatIsP: '恐怖・強欲指数はビットコイン投資家心理を0〜100で表す指標です。0に近いほど極端な恐怖、100に近いほど極端な強欲を意味します。「他人が恐怖で売る時こそ好機」という逆張りシグナルとしてよく使われます。データ出典：Alternative.me。',
      scoreH: '買い時スコア — 7指標',
      score: ['恐怖・強欲指数 — 極端な恐怖＝買い機会（逆張り）', 'RSI(14) — 売られすぎ(<30)で買い優位', 'MACD(12・26・9) — 底からの上昇転換で買いモメンタム', 'マイヤー倍率 — 価格÷200日線、1未満は割安', '365日高値からの下落率 — 深い下落ほど分割買い圏', 'ゴールデン/デッドクロス — 50/200移動平均のトレンドフィルター', 'MVRV Zスコア — 時価総額÷実現時価総額（平均取得単価）、歴史的な底・天井のオンチェーン指標'],
      scoreNote: '7つの部分スコアを加重合成し0〜100のスコアと、STRONG BUY・ACCUMULATE・NEUTRAL・CAUTION・OVERHEATED の5段階で表示します。',
      fngH: '恐怖・強欲指数 5段階',
      fng: ['0〜25 極端な恐怖(Extreme Fear) — 投げ売り・パニック、歴史的な分割買い注目圏', '25〜45 恐怖(Fear) — 弱気心理', '45〜55 中立(Neutral) — 方向感なし', '55〜75 強欲(Greed) — 過熱の入り口', '75〜100 極端な強欲(Extreme Greed) — 過熱・天井警戒'],
      bandsH: '買い時スコア 5段階バンド',
      bands: ['80〜100 STRONG BUY — 売られすぎ+恐怖+割安の多重合流', '65〜80 ACCUMULATE — 積立に有利', '45〜65 NEUTRAL — 様子見', '25〜45 CAUTION — 追随買いを控える', '0〜25 OVERHEATED — 過熱、新規買い禁物'],
      faqH: 'よくある質問',
      faq: [
        { q: '指数が低ければアバランチを買うべき？', a: '極端な恐怖は歴史的に分割買いの好機だったことが多いですが、指数だけに頼ると「落ちるナイフ」を掴む危険があります。本スコアはRSI・MACD・マイヤー倍率・下落率・移動平均クロスも合わせて見て、下落トレンドでは保守的にスコアを下げます。' },
        { q: '買い時スコアはどう計算される？', a: '7指標をそれぞれ0〜100の部分スコアに換算し加重合成します。結果は0〜100で、5段階バンドで表示します。' },
        { q: '無料？インストールは必要？', a: '完全無料・インストール不要です。CoinGecko・Binance・Alternative.me の公開APIからリアルタイムデータを取得します。' },
        { q: '指数と買い時スコアの違いは？', a: '指数は心理1指標(0〜100)、買い時スコアは指数を含む7指標を合成した総合スコア(0〜100)です。' },
        { q: 'データはどこから？更新頻度は？', a: '恐怖・強欲指数はAlternative.me、価格・日足はCoinGecko・Binance、オンチェーン指標はCoinMetricsの公開APIからリアルタイムで取得します。画面は約1分ごとに自動更新されます。' },
        { q: 'アバランチは今買ってもいい？', a: '正解はありませんが、買い時スコア(0〜100)で現在の市場が売られすぎ・恐怖圏か、過熱・強欲圏かを客観的に測れます。長期（逆張り）タブではスコアが高いほど恐怖と割安が重なる分割買いに有利な圏、低いほど過熱警戒圏です。参考シグナルであり投資助言ではありません。' },
        { q: '短期と長期の買い時はどう違う？', a: 'スコアは短期・長期の2タブに分かれます。短期（モメンタム）は約1〜3か月のトレンドフォロー視点で上昇トレンドが強いほど高く、長期（逆張り）は約1年以上のサイクル視点で恐怖・割安なほど高くなります。2017年以降のバックテストでは、短期はモメンタム、長期は逆張りの方向がより有効でした。' },
        { q: 'BOTTOM RADAR（底値スコア）とは？', a: 'MVRV Zスコアなどのオンチェーン指標で、時価総額が投資家の平均取得単価に対してどの位置にあるかを測り、歴史的な底値圏への近さを0〜100で示す補助ゲージです。計算根拠は「ビットコインの底」解説ページで公開しています。' }
      ],
      disclaimer: '⚠ 本スコアは公開指標を合成した参考シグナルであり、投資助言ではありません。すべての判断と責任は利用者ご自身にあります。'
    },
    zh: {
      title: '雪崩币恐惧与贪婪指数 & 买入时机评分',
      intro: '一个免费仪表板，将包括雪崩币恐惧与贪婪指数（Fear & Greed Index）在内的7个实时指标合成为0–100的“现在是买入时机吗？”评分。无需安装，浏览器即开即用，支持13种语言。',
      whatIsH: '什么是比特币恐惧指数？',
      whatIsP: '恐惧与贪婪指数用0–100表示比特币投资者情绪。接近0为极度恐惧，接近100为极度贪婪。常作为逆向信号——“别人恐惧时贪婪”。数据来源：Alternative.me。',
      scoreH: '买入时机评分 — 7个指标',
      score: ['恐惧与贪婪指数 — 极度恐惧＝买入机会（逆向）', 'RSI(14) — 超卖(<30)利于买入', 'MACD(12·26·9) — 底部上行转折＝买入动能', '梅耶倍数 — 价格÷200日均线，低于1为低估', '距365日高点回撤 — 跌得越深越是分批买入区', '金叉/死叉 — 50/200均线趋势过滤', 'MVRV Z分数 — 市值÷已实现市值（平均持仓成本），衡量历史底部与顶部的链上指标'],
      scoreNote: '将7个分项评分加权合成为0–100评分，并以 STRONG BUY·ACCUMULATE·NEUTRAL·CAUTION·OVERHEATED 五档显示。',
      fngH: '恐惧与贪婪指数 5档',
      fng: ['0–25 极度恐惧(Extreme Fear) — 抛售恐慌，历史上的分批买入关注区', '25–45 恐惧(Fear) — 偏空情绪', '45–55 中性(Neutral) — 方向不明', '55–75 贪婪(Greed) — 过热初期', '75–100 极度贪婪(Extreme Greed) — 过热、警惕顶部'],
      bandsH: '买入时机评分 5档',
      bands: ['80–100 STRONG BUY — 超卖+恐惧+低估多重共振', '65–80 ACCUMULATE — 利于定投', '45–65 NEUTRAL — 观望', '25–45 CAUTION — 避免追高', '0–25 OVERHEATED — 过热，勿新建仓'],
      faqH: '常见问题',
      faq: [
        { q: '指数低就该买雪崩币吗？', a: '极度恐惧在历史上常是分批买入良机，但只看指数有“接飞刀”的风险。本评分同时参考RSI、MACD、梅耶倍数、回撤与均线交叉，并在下跌趋势中保守下调评分。' },
        { q: '买入时机评分如何计算？', a: '将7个指标各自换算为0–100分项评分并加权合成。结果为0–100，以5档显示。' },
        { q: '免费吗？需要安装吗？', a: '完全免费、无需安装。实时数据来自 CoinGecko、Binance、Alternative.me 公开API。' },
        { q: '指数与买入时机评分有何不同？', a: '指数是单一情绪指标(0–100)；买入时机评分是包含该指数在内的7指标综合评分(0–100)。' },
        { q: '数据来自哪里？多久更新一次？', a: '恐惧与贪婪指数来自Alternative.me，价格与日K来自CoinGecko和Binance公开API，链上指标来自CoinMetrics。页面约每1分钟自动刷新。' },
        { q: '现在可以买雪崩币吗？', a: '没有标准答案，但买入时机评分(0–100)能客观判断当前市场处于超卖·恐惧区还是过热·贪婪区。在长期（逆向）标签页中，评分越高代表恐惧与低估重叠、历史上利于分批买入的区间；越低则是过热警戒区。仅供参考，并非投资建议。' },
        { q: '短期和长期买入时机有何不同？', a: '评分分为短期、长期两个标签页。短期（动量）以约1–3个月的趋势跟随视角，上升趋势越强评分越高；长期（逆向）以约1年以上的周期视角，越恐惧、越低估评分越高。2017年以来的回测显示，短期动量、长期逆向的方向更有效。' },
        { q: 'BOTTOM RADAR（底部评分）是什么？', a: '一个辅助仪表，利用MVRV Z分数等链上指标衡量市值相对投资者平均持仓成本的位置，以0–100显示与历史底部区间的接近程度。计算依据在“比特币底部”解读页面公开。' }
      ],
      disclaimer: '⚠ 本评分由公开指标合成，仅供参考，并非投资建议。一切投资决定与责任由用户自负。'
    },
    'zh-Hant': {
      title: '雪崩幣恐懼與貪婪指數 & 買入時機評分',
      intro: '一個免費儀表板，將包括雪崩幣恐懼與貪婪指數（Fear & Greed Index）在內的7個即時指標合成為0–100的「現在是買入時機嗎？」評分。免安裝、瀏覽器即開即用，支援13種語言。',
      whatIsH: '什麼是比特幣恐懼指數？',
      whatIsP: '恐懼與貪婪指數以0–100表示比特幣投資者情緒。接近0為極度恐懼，接近100為極度貪婪。常作為逆向訊號——「別人恐懼時貪婪」。資料來源：Alternative.me。',
      scoreH: '買入時機評分 — 7個指標',
      score: ['恐懼與貪婪指數 — 極度恐懼＝買入機會（逆向）', 'RSI(14) — 超賣(<30)利於買入', 'MACD(12·26·9) — 底部上行轉折＝買入動能', '梅耶倍數 — 價格÷200日均線，低於1為低估', '距365日高點回撤 — 跌得越深越是分批買入區', '黃金/死亡交叉 — 50/200均線趨勢過濾', 'MVRV Z分數 — 市值÷已實現市值（平均持倉成本），衡量歷史底部與頂部的鏈上指標'],
      scoreNote: '將7個分項評分加權合成為0–100評分，並以 STRONG BUY·ACCUMULATE·NEUTRAL·CAUTION·OVERHEATED 五檔顯示。',
      fngH: '恐懼與貪婪指數 5檔',
      fng: ['0–25 極度恐懼(Extreme Fear) — 拋售恐慌，歷史上的分批買入關注區', '25–45 恐懼(Fear) — 偏空情緒', '45–55 中性(Neutral) — 方向不明', '55–75 貪婪(Greed) — 過熱初期', '75–100 極度貪婪(Extreme Greed) — 過熱、警惕頂部'],
      bandsH: '買入時機評分 5檔',
      bands: ['80–100 STRONG BUY — 超賣+恐懼+低估多重共振', '65–80 ACCUMULATE — 利於定投', '45–65 NEUTRAL — 觀望', '25–45 CAUTION — 避免追高', '0–25 OVERHEATED — 過熱，勿新建倉'],
      faqH: '常見問題',
      faq: [
        { q: '指數低就該買雪崩幣嗎？', a: '極度恐懼在歷史上常是分批買入良機，但只看指數有「接飛刀」的風險。本評分同時參考RSI、MACD、梅耶倍數、回撤與均線交叉，並在下跌趨勢中保守下調評分。' },
        { q: '買入時機評分如何計算？', a: '將7個指標各自換算為0–100分項評分並加權合成。結果為0–100，以5檔顯示。' },
        { q: '免費嗎？需要安裝嗎？', a: '完全免費、免安裝。即時資料來自 CoinGecko、Binance、Alternative.me 公開API。' },
        { q: '指數與買入時機評分有何不同？', a: '指數是單一情緒指標(0–100)；買入時機評分是包含該指數在內的7指標綜合評分(0–100)。' },
        { q: '資料來自哪裡？多久更新一次？', a: '恐懼與貪婪指數來自Alternative.me，價格與日K來自CoinGecko和Binance公開API，鏈上指標來自CoinMetrics。頁面約每1分鐘自動重新整理。' },
        { q: '現在可以買雪崩幣嗎？', a: '沒有標準答案，但買入時機評分(0–100)能客觀判斷當前市場處於超賣·恐懼區還是過熱·貪婪區。在長期（逆向）分頁中，評分越高代表恐懼與低估重疊、歷史上利於分批買入的區間；越低則是過熱警戒區。僅供參考，並非投資建議。' },
        { q: '短期和長期買入時機有何不同？', a: '評分分為短期、長期兩個分頁。短期（動量）以約1–3個月的趨勢跟隨視角，上升趨勢越強評分越高；長期（逆向）以約1年以上的週期視角，越恐懼、越低估評分越高。2017年以來的回測顯示，短期動量、長期逆向的方向更有效。' },
        { q: 'BOTTOM RADAR（底部評分）是什麼？', a: '一個輔助儀表，利用MVRV Z分數等鏈上指標衡量市值相對投資者平均持倉成本的位置，以0–100顯示與歷史底部區間的接近程度。計算依據在「比特幣底部」解說頁面公開。' }
      ],
      disclaimer: '⚠ 本評分由公開指標合成，僅供參考，並非投資建議。一切投資決定與責任由用戶自負。'
    },
    es: {
      title: 'Índice de miedo y codicia de Avalanche y puntuación de momento de compra',
      intro: 'Un panel gratuito que sintetiza 7 indicadores en tiempo real —incluido el índice de miedo y codicia de Avalanche— en una puntuación de 0 a 100 sobre «¿es buen momento para comprar?». Funciona en el navegador sin instalación, en 13 idiomas.',
      whatIsH: '¿Qué es el índice de miedo y codicia de Bitcoin?',
      whatIsP: 'El índice de miedo y codicia expresa el sentimiento del inversor de Bitcoin de 0 a 100. Cerca de 0 es miedo extremo; cerca de 100, codicia extrema. Suele usarse como señal contraria: «sé codicioso cuando otros tienen miedo». Fuente: Alternative.me.',
      scoreH: 'Puntuación de compra — 7 indicadores',
      score: ['Índice de miedo y codicia — miedo extremo = oportunidad de compra (contraria)', 'RSI(14) — sobreventa (<30) favorece comprar', 'MACD(12·26·9) — giro al alza desde el fondo = impulso de compra', 'Múltiplo de Mayer — precio ÷ media de 200 días; por debajo de 1, infravalorado', 'Caída desde el máximo de 365 días — caídas más profundas = zona de acumulación', 'Cruce dorado/de la muerte — filtro de tendencia con medias 50/200', 'MVRV Z-Score — capitalización ÷ capitalización realizada (coste medio); indicador on-chain de suelos y techos históricos'],
      scoreNote: 'Las 7 subpuntuaciones se ponderan en una puntuación de 0 a 100, mostrada en 5 bandas: STRONG BUY · ACCUMULATE · NEUTRAL · CAUTION · OVERHEATED.',
      fngH: 'Miedo y codicia — 5 niveles',
      fng: ['0–25 Miedo extremo (Extreme Fear) — pánico vendedor; históricamente zona de acumulación', '25–45 Miedo (Fear) — sentimiento bajista', '45–55 Neutral — dirección poco clara', '55–75 Codicia (Greed) — recalentamiento inicial', '75–100 Codicia extrema (Extreme Greed) — recalentado, ojo con techos'],
      bandsH: 'Puntuación de compra — 5 bandas',
      bands: ['80–100 STRONG BUY — convergen sobreventa + miedo + infravaloración', '65–80 ACCUMULATE — favorable para DCA', '45–65 NEUTRAL — esperar', '25–45 CAUTION — evita perseguir el precio', '0–25 OVERHEATED — recalentado, sin nuevas compras'],
      faqH: 'Preguntas frecuentes',
      faq: [
        { q: '¿Debo comprar Avalanche cuando el índice está bajo?', a: 'El miedo extremo ha sido a menudo una oportunidad de acumulación, pero fiarse solo del índice arriesga «atrapar un cuchillo que cae». Esta puntuación también pondera RSI, MACD, múltiplo de Mayer, caída y cruces de medias, y la reduce de forma conservadora en tendencias bajistas.' },
        { q: '¿Cómo se calcula la puntuación de compra?', a: 'Cada uno de los 7 indicadores se convierte en una subpuntuación de 0 a 100 y se pondera. El resultado es 0–100, mostrado en 5 bandas.' },
        { q: '¿Es gratis? ¿Necesito instalar algo?', a: 'Es totalmente gratis y sin instalación. Los datos en tiempo real provienen de las API públicas de CoinGecko, Binance y Alternative.me.' },
        { q: '¿En qué se diferencia el índice de la puntuación de compra?', a: 'El índice es una sola métrica de sentimiento (0–100); la puntuación de compra es un compuesto de 7 indicadores que incluye el índice (0–100).' },
        { q: '¿De dónde vienen los datos y con qué frecuencia se actualizan?', a: 'El índice de miedo y codicia viene de Alternative.me; los precios y velas diarias, de las API públicas de CoinGecko y Binance; y las métricas on-chain, de CoinMetrics. La pantalla se actualiza automáticamente cada minuto aproximadamente.' },
        { q: '¿Debería comprar Avalanche ahora mismo?', a: 'No hay una respuesta única, pero la puntuación de compra (0–100) permite valorar objetivamente si el mercado está en zona de sobreventa/miedo o de recalentamiento/codicia. En la pestaña de largo plazo (contraria), puntuaciones altas marcan zonas donde coinciden miedo e infravaloración —históricamente favorables al DCA—, y las bajas avisan de recalentamiento. Es una señal de referencia, no asesoramiento de inversión.' },
        { q: '¿En qué se diferencian el timing de corto y de largo plazo?', a: 'La puntuación se divide en dos pestañas. El corto plazo (momentum) adopta una visión de seguimiento de tendencia de 1–3 meses y sube con tendencias alcistas fuertes; el largo plazo (contrario) adopta una visión de ciclo de más de un año y sube con miedo e infravaloración. En backtests desde 2017, el momentum funcionó mejor a corto y lo contrario a largo.' },
        { q: '¿Qué es el BOTTOM RADAR (puntuación de suelo)?', a: 'Un indicador auxiliar que usa métricas on-chain como el MVRV Z-Score para medir dónde está la capitalización respecto al coste medio de los inversores, mostrando la cercanía a zonas de suelo históricas en una escala de 0 a 100. El cálculo completo está publicado en la guía «suelo de Bitcoin».' }
      ],
      disclaimer: '⚠ Esta puntuación es una señal de referencia a partir de indicadores públicos, no asesoramiento de inversión. Todas las decisiones y la responsabilidad son tuyas.'
    },
    fr: {
      title: 'Indice de peur et d’avidité Avalanche et score de timing d’achat',
      intro: 'Un tableau de bord gratuit qui synthétise 7 indicateurs en temps réel — dont l’indice de peur et d’avidité Avalanche — en un score de 0 à 100 « est-ce le bon moment pour acheter ? ». Fonctionne dans le navigateur sans installation, en 13 langues.',
      whatIsH: 'Qu’est-ce que l’indice de peur et d’avidité Bitcoin ?',
      whatIsP: 'L’indice de peur et d’avidité exprime le sentiment des investisseurs Bitcoin de 0 à 100. Proche de 0 = peur extrême ; proche de 100 = avidité extrême. Souvent utilisé comme signal à contre-courant : « soyez avide quand les autres ont peur ». Source : Alternative.me.',
      scoreH: 'Score de timing d’achat — 7 indicateurs',
      score: ['Indice de peur et d’avidité — peur extrême = opportunité d’achat (contrarian)', 'RSI(14) — survente (<30) favorable à l’achat', 'MACD(12·26·9) — retournement haussier depuis le bas = momentum d’achat', 'Multiple de Mayer — prix ÷ MM 200 jours ; sous 1, sous-évalué', 'Repli depuis le plus haut sur 365 jours — plus la baisse est forte, plus c’est une zone d’accumulation', 'Croisement doré/de la mort — filtre de tendance MM 50/200', 'MVRV Z-Score — capitalisation ÷ capitalisation réalisée (coût moyen) ; indicateur on-chain des creux et sommets historiques'],
      scoreNote: 'Les 7 sous-scores sont pondérés en un score de 0 à 100, affiché en 5 bandes : STRONG BUY · ACCUMULATE · NEUTRAL · CAUTION · OVERHEATED.',
      fngH: 'Peur et avidité — 5 niveaux',
      fng: ['0–25 Peur extrême (Extreme Fear) — vente panique ; historiquement une zone d’accumulation', '25–45 Peur (Fear) — sentiment baissier', '45–55 Neutre (Neutral) — direction incertaine', '55–75 Avidité (Greed) — début de surchauffe', '75–100 Avidité extrême (Extreme Greed) — surchauffe, méfiance des sommets'],
      bandsH: 'Score de timing d’achat — 5 bandes',
      bands: ['80–100 STRONG BUY — survente + peur + sous-évaluation convergent', '65–80 ACCUMULATE — favorable au DCA', '45–65 NEUTRAL — attentisme', '25–45 CAUTION — éviter de courir après le prix', '0–25 OVERHEATED — surchauffe, pas de nouvel achat'],
      faqH: 'FAQ',
      faq: [
        { q: 'Dois-je acheter du Avalanche quand l’indice est bas ?', a: 'La peur extrême a souvent été une opportunité d’accumulation, mais se fier au seul indice risque d’« attraper un couteau qui tombe ». Ce score pondère aussi RSI, MACD, multiple de Mayer, repli et croisements de moyennes, et le réduit prudemment en tendance baissière.' },
        { q: 'Comment le score de timing d’achat est-il calculé ?', a: 'Chacun des 7 indicateurs est converti en sous-score de 0 à 100 puis pondéré. Le résultat est 0–100, affiché en 5 bandes.' },
        { q: 'Est-ce gratuit ? Faut-il installer quelque chose ?', a: 'C’est entièrement gratuit et sans installation. Les données en temps réel proviennent des API publiques de CoinGecko, Binance et Alternative.me.' },
        { q: 'Quelle différence entre l’indice et le score de timing d’achat ?', a: 'L’indice est une seule mesure de sentiment (0–100) ; le score de timing d’achat est un composite de 7 indicateurs incluant l’indice (0–100).' },
        { q: 'D’où viennent les données et à quelle fréquence sont-elles actualisées ?', a: 'L’indice de peur et d’avidité vient d’Alternative.me ; les prix et bougies journalières, des API publiques de CoinGecko et Binance ; et les métriques on-chain, de CoinMetrics. L’écran se rafraîchit automatiquement environ chaque minute.' },
        { q: 'Dois-je acheter du Avalanche maintenant ?', a: 'Il n’y a pas de réponse unique, mais le score de timing d’achat (0–100) permet d’évaluer objectivement si le marché est en zone de survente/peur ou de surchauffe/avidité. Dans l’onglet long terme (contrarian), des scores élevés marquent des zones où peur et sous-évaluation se recoupent — historiquement favorables au DCA — tandis que des scores bas signalent la surchauffe. C’est un signal de référence, pas un conseil en investissement.' },
        { q: 'Quelle différence entre le timing court terme et long terme ?', a: 'Le score est divisé en deux onglets. Le court terme (momentum) adopte une vue de suivi de tendance sur 1 à 3 mois et monte avec les tendances haussières fortes ; le long terme (contrarian) adopte une vue de cycle d’un an et plus et monte avec la peur et la sous-évaluation. Dans les backtests depuis 2017, le momentum a mieux fonctionné à court terme et le contrarian à long terme.' },
        { q: 'Qu’est-ce que le BOTTOM RADAR (score de plancher) ?', a: 'Une jauge auxiliaire qui utilise des métriques on-chain comme le MVRV Z-Score pour mesurer où se situe la capitalisation par rapport au coût moyen des investisseurs, en montrant la proximité des zones de plancher historiques sur une échelle de 0 à 100. Le calcul complet est publié sur la page « plancher du Bitcoin ».' }
      ],
      disclaimer: '⚠ Ce score est un signal de référence issu d’indicateurs publics, pas un conseil en investissement. Toutes les décisions et la responsabilité vous appartiennent.'
    },
    de: {
      title: 'Avalanche Angst- & Gier-Index & Kaufzeitpunkt-Score',
      intro: 'Ein kostenloses Dashboard, das 7 Echtzeit-Indikatoren — inkl. Avalanche Angst- & Gier-Index — zu einem 0–100-Score „Ist jetzt ein guter Kaufzeitpunkt?“ zusammenführt. Läuft im Browser ohne Installation, in 13 Sprachen.',
      whatIsH: 'Was ist der Bitcoin Angst-Index?',
      whatIsP: 'Der Angst- & Gier-Index drückt die Stimmung der Bitcoin-Anleger von 0 bis 100 aus. Nahe 0 = extreme Angst; nahe 100 = extreme Gier. Oft als antizyklisches Signal genutzt: „Sei gierig, wenn andere ängstlich sind.“ Quelle: Alternative.me.',
      scoreH: 'Kaufzeitpunkt-Score — 7 Indikatoren',
      score: ['Angst- & Gier-Index — extreme Angst = Kaufgelegenheit (antizyklisch)', 'RSI(14) — überverkauft (<30) begünstigt Käufe', 'MACD(12·26·9) — Aufwärtswende vom Boden = Kaufmomentum', 'Mayer-Multiple — Preis ÷ 200-Tage-Linie; unter 1 unterbewertet', 'Rückgang vom 365-Tage-Hoch — tiefere Einbrüche = Akkumulationszone', 'Golden/Death Cross — 50/200-Trendfilter', 'MVRV Z-Score — Marktkapitalisierung ÷ realisierte Kapitalisierung (durchschnittlicher Einstandskurs); On-Chain-Indikator historischer Böden und Tops'],
      scoreNote: 'Die 7 Teil-Scores werden zu einem 0–100-Score gewichtet, gezeigt in 5 Bändern: STRONG BUY · ACCUMULATE · NEUTRAL · CAUTION · OVERHEATED.',
      fngH: 'Angst & Gier — 5 Stufen',
      fng: ['0–25 Extreme Angst (Extreme Fear) — Panikverkäufe; historisch eine Akkumulationszone', '25–45 Angst (Fear) — bärische Stimmung', '45–55 Neutral — unklare Richtung', '55–75 Gier (Greed) — beginnende Überhitzung', '75–100 Extreme Gier (Extreme Greed) — überhitzt, Vorsicht vor Tops'],
      bandsH: 'Kaufzeitpunkt-Score — 5 Bänder',
      bands: ['80–100 STRONG BUY — überverkauft + Angst + Unterbewertung treffen zusammen', '65–80 ACCUMULATE — günstig für DCA', '45–65 NEUTRAL — abwarten', '25–45 CAUTION — Preis nicht hinterherjagen', '0–25 OVERHEATED — überhitzt, keine Neukäufe'],
      faqH: 'Häufige Fragen',
      faq: [
        { q: 'Soll ich Avalanche kaufen, wenn der Index niedrig ist?', a: 'Extreme Angst war historisch oft eine Akkumulationschance, doch sich allein auf den Index zu verlassen, birgt das Risiko, „ins fallende Messer zu greifen“. Dieser Score gewichtet auch RSI, MACD, Mayer-Multiple, Rückgang und MA-Kreuzungen und senkt den Wert in Abwärtstrends konservativ.' },
        { q: 'Wie wird der Kaufzeitpunkt-Score berechnet?', a: 'Jeder der 7 Indikatoren wird in einen 0–100-Teil-Score umgerechnet und gewichtet. Das Ergebnis ist 0–100, in 5 Bändern dargestellt.' },
        { q: 'Ist es kostenlos? Muss ich etwas installieren?', a: 'Es ist völlig kostenlos und ohne Installation. Echtzeitdaten stammen aus den öffentlichen APIs von CoinGecko, Binance und Alternative.me.' },
        { q: 'Wie unterscheidet sich der Index vom Kaufzeitpunkt-Score?', a: 'Der Index ist eine einzelne Stimmungskennzahl (0–100); der Kaufzeitpunkt-Score ist ein Verbund aus 7 Indikatoren inkl. Index (0–100).' },
        { q: 'Woher stammen die Daten und wie oft werden sie aktualisiert?', a: 'Der Angst- & Gier-Index stammt von Alternative.me, Preise und Tageskerzen von den öffentlichen APIs von CoinGecko und Binance, On-Chain-Metriken von CoinMetrics. Der Bildschirm aktualisiert sich etwa jede Minute automatisch.' },
        { q: 'Sollte ich Avalanche jetzt kaufen?', a: 'Eine eindeutige Antwort gibt es nicht, aber der Kaufzeitpunkt-Score (0–100) zeigt objektiv, ob der Markt in einer überverkauften Angst-Zone oder einer überhitzten Gier-Zone steckt. Auf dem Langfrist-Tab (antizyklisch) markieren hohe Werte Zonen, in denen Angst und Unterbewertung zusammenfallen — historisch günstig für DCA —, niedrige warnen vor Überhitzung. Ein Referenzsignal, keine Anlageberatung.' },
        { q: 'Wie unterscheiden sich kurz- und langfristiges Kauftiming?', a: 'Der Score ist in zwei Tabs geteilt. Kurzfristig (Momentum) folgt einer Trendfolge-Sicht von 1–3 Monaten und steigt mit starken Aufwärtstrends; langfristig (antizyklisch) folgt einer Zyklus-Sicht von über einem Jahr und steigt mit Angst und Unterbewertung. In Backtests seit 2017 funktionierte kurzfristig Momentum und langfristig die antizyklische Richtung besser.' },
        { q: 'Was ist der BOTTOM RADAR (Boden-Score)?', a: 'Eine Zusatzanzeige, die mit On-Chain-Metriken wie den MVRV Z-Score misst, wo die Marktkapitalisierung relativ zum durchschnittlichen Einstandskurs der Anleger liegt, und die Nähe zu historischen Bodenzonen auf einer Skala von 0–100 zeigt. Die vollständige Berechnung ist auf der Seite „Bitcoin-Boden“ veröffentlicht.' }
      ],
      disclaimer: '⚠ Dieser Score ist ein Referenzsignal aus öffentlichen Indikatoren, keine Anlageberatung. Alle Entscheidungen und die Verantwortung liegen bei Ihnen.'
    },
    it: {
      title: 'Indice di paura e avidità Avalanche e punteggio di timing d’acquisto',
      intro: 'Una dashboard gratuita che sintetizza 7 indicatori in tempo reale — incluso l’indice di paura e avidità di Avalanche — in un punteggio 0–100 «è il momento giusto per comprare?». Funziona nel browser senza installazione, in 13 lingue.',
      whatIsH: 'Cos’è l’indice di paura di Bitcoin?',
      whatIsP: 'L’indice di paura e avidità esprime il sentiment degli investitori Bitcoin da 0 a 100. Vicino a 0 = paura estrema; vicino a 100 = avidità estrema. Spesso usato come segnale contrarian: «sii avido quando gli altri hanno paura». Fonte: Alternative.me.',
      scoreH: 'Punteggio d’acquisto — 7 indicatori',
      score: ['Indice di paura e avidità — paura estrema = opportunità d’acquisto (contrarian)', 'RSI(14) — ipervenduto (<30) favorisce l’acquisto', 'MACD(12·26·9) — inversione rialzista dal fondo = momentum d’acquisto', 'Multiplo di Mayer — prezzo ÷ media 200 giorni; sotto 1 sottovalutato', 'Ribasso dal massimo a 365 giorni — cali più profondi = zona di accumulo', 'Golden/Death Cross — filtro di trend medie 50/200', 'MVRV Z-Score — capitalizzazione ÷ capitalizzazione realizzata (costo medio); indicatore on-chain di minimi e massimi storici'],
      scoreNote: 'I 7 sotto-punteggi sono ponderati in un punteggio 0–100, mostrato in 5 bande: STRONG BUY · ACCUMULATE · NEUTRAL · CAUTION · OVERHEATED.',
      fngH: 'Paura e avidità — 5 livelli',
      fng: ['0–25 Paura estrema (Extreme Fear) — vendite di panico; storicamente zona di accumulo', '25–45 Paura (Fear) — sentiment ribassista', '45–55 Neutrale (Neutral) — direzione incerta', '55–75 Avidità (Greed) — surriscaldamento iniziale', '75–100 Avidità estrema (Extreme Greed) — surriscaldato, attenzione ai massimi'],
      bandsH: 'Punteggio d’acquisto — 5 bande',
      bands: ['80–100 STRONG BUY — ipervenduto + paura + sottovalutazione convergono', '65–80 ACCUMULATE — favorevole al PAC', '45–65 NEUTRAL — attendere', '25–45 CAUTION — evitare di inseguire il prezzo', '0–25 OVERHEATED — surriscaldato, nessun nuovo acquisto'],
      faqH: 'Domande frequenti',
      faq: [
        { q: 'Dovrei comprare Avalanche quando l’indice è basso?', a: 'La paura estrema è stata spesso un’occasione di accumulo, ma affidarsi solo all’indice rischia di «prendere un coltello che cade». Questo punteggio pesa anche RSI, MACD, multiplo di Mayer, ribasso e incroci di medie, e lo riduce in modo prudente nei trend ribassisti.' },
        { q: 'Come si calcola il punteggio d’acquisto?', a: 'Ciascuno dei 7 indicatori è convertito in un sotto-punteggio 0–100 e ponderato. Il risultato è 0–100, mostrato in 5 bande.' },
        { q: 'È gratis? Serve installare qualcosa?', a: 'È completamente gratis e senza installazione. I dati in tempo reale provengono dalle API pubbliche di CoinGecko, Binance e Alternative.me.' },
        { q: 'Che differenza c’è tra l’indice e il punteggio d’acquisto?', a: 'L’indice è una singola misura di sentiment (0–100); il punteggio d’acquisto è un composito dei 7 indicatori incluso l’indice (0–100).' },
        { q: 'Da dove vengono i dati e con che frequenza si aggiornano?', a: 'L’indice di paura e avidità viene da Alternative.me; prezzi e candele giornaliere dalle API pubbliche di CoinGecko e Binance; le metriche on-chain da CoinMetrics. Lo schermo si aggiorna automaticamente circa ogni minuto.' },
        { q: 'Dovrei comprare Avalanche adesso?', a: 'Non c’è una risposta unica, ma il punteggio d’acquisto (0–100) permette di valutare oggettivamente se il mercato è in zona ipervenduto/paura o surriscaldato/avidità. Nella scheda a lungo termine (contrarian), punteggi alti indicano zone in cui paura e sottovalutazione coincidono — storicamente favorevoli al PAC — mentre punteggi bassi avvertono del surriscaldamento. È un segnale di riferimento, non consulenza d’investimento.' },
        { q: 'Che differenza c’è tra timing a breve e a lungo termine?', a: 'Il punteggio è diviso in due schede. Il breve termine (momentum) adotta una visione trend-following di 1–3 mesi e sale con trend rialzisti forti; il lungo termine (contrarian) adotta una visione di ciclo oltre l’anno e sale con paura e sottovalutazione. Nei backtest dal 2017, il momentum ha funzionato meglio nel breve e il contrarian nel lungo.' },
        { q: 'Cos’è il BOTTOM RADAR (punteggio di minimo)?', a: 'Un indicatore ausiliario che usa metriche on-chain come l’MVRV Z-Score per misurare dove si trova la capitalizzazione rispetto al costo medio degli investitori, mostrando la vicinanza alle zone di minimo storiche su una scala 0–100. Il calcolo completo è pubblicato nella guida «minimo di Bitcoin».' }
      ],
      disclaimer: '⚠ Questo punteggio è un segnale di riferimento da indicatori pubblici, non consulenza d’investimento. Ogni decisione e responsabilità è tua.'
    },
    pt: {
      title: 'Índice de medo e ganância do Avalanche e pontuação de momento de compra',
      intro: 'Um painel gratuito que sintetiza 7 indicadores em tempo real — incluindo o índice de medo e ganância do Avalanche — numa pontuação de 0 a 100 «é uma boa hora para comprar?». Roda no navegador sem instalação, em 13 idiomas.',
      whatIsH: 'O que é o índice de medo do Bitcoin?',
      whatIsP: 'O índice de medo e ganância expressa o sentimento do investidor de Bitcoin de 0 a 100. Perto de 0 = medo extremo; perto de 100 = ganância extrema. Muito usado como sinal contrário: «seja ganancioso quando outros têm medo». Fonte: Alternative.me.',
      scoreH: 'Pontuação de compra — 7 indicadores',
      score: ['Índice de medo e ganância — medo extremo = oportunidade de compra (contrário)', 'RSI(14) — sobrevendido (<30) favorece comprar', 'MACD(12·26·9) — virada de alta no fundo = momentum de compra', 'Múltiplo de Mayer — preço ÷ média de 200 dias; abaixo de 1 está subvalorizado', 'Queda desde a máxima de 365 dias — quedas mais profundas = zona de acumulação', 'Cruzamento dourado/da morte — filtro de tendência médias 50/200', 'MVRV Z-Score — capitalização ÷ capitalização realizada (custo médio); indicador on-chain de fundos e topos históricos'],
      scoreNote: 'As 7 subpontuações são ponderadas numa pontuação de 0 a 100, em 5 faixas: STRONG BUY · ACCUMULATE · NEUTRAL · CAUTION · OVERHEATED.',
      fngH: 'Medo e ganância — 5 níveis',
      fng: ['0–25 Medo extremo (Extreme Fear) — venda em pânico; historicamente zona de acumulação', '25–45 Medo (Fear) — sentimento de baixa', '45–55 Neutro (Neutral) — direção incerta', '55–75 Ganância (Greed) — superaquecimento inicial', '75–100 Ganância extrema (Extreme Greed) — superaquecido, atenção a topos'],
      bandsH: 'Pontuação de compra — 5 faixas',
      bands: ['80–100 STRONG BUY — sobrevenda + medo + subvalorização convergem', '65–80 ACCUMULATE — favorável a DCA', '45–65 NEUTRAL — aguardar', '25–45 CAUTION — evite perseguir o preço', '0–25 OVERHEATED — superaquecido, sem novas compras'],
      faqH: 'Perguntas frequentes',
      faq: [
        { q: 'Devo comprar Avalanche quando o índice está baixo?', a: 'O medo extremo foi muitas vezes uma oportunidade de acumulação, mas confiar só no índice arrisca «pegar uma faca caindo». Esta pontuação também pondera RSI, MACD, múltiplo de Mayer, queda e cruzamentos de médias, e a reduz de forma conservadora em tendências de baixa.' },
        { q: 'Como a pontuação de compra é calculada?', a: 'Cada um dos 7 indicadores é convertido numa subpontuação de 0 a 100 e ponderado. O resultado é 0–100, em 5 faixas.' },
        { q: 'É grátis? Preciso instalar algo?', a: 'É totalmente grátis e sem instalação. Os dados em tempo real vêm das APIs públicas da CoinGecko, Binance e Alternative.me.' },
        { q: 'Qual a diferença entre o índice e a pontuação de compra?', a: 'O índice é uma única métrica de sentimento (0–100); a pontuação de compra é um composto de 7 indicadores incluindo o índice (0–100).' },
        { q: 'De onde vêm os dados e com que frequência são atualizados?', a: 'O índice de medo e ganância vem da Alternative.me; preços e velas diárias, das APIs públicas da CoinGecko e da Binance; e as métricas on-chain, da CoinMetrics. A tela atualiza automaticamente a cada minuto, aproximadamente.' },
        { q: 'Devo comprar Avalanche agora?', a: 'Não há resposta única, mas a pontuação de compra (0–100) permite avaliar objetivamente se o mercado está em zona de sobrevenda/medo ou de superaquecimento/ganância. Na aba de longo prazo (contrária), pontuações altas marcam zonas onde medo e subvalorização coincidem — historicamente favoráveis ao DCA —, e as baixas alertam para superaquecimento. É um sinal de referência, não consultoria de investimento.' },
        { q: 'Qual a diferença entre o timing de curto e de longo prazo?', a: 'A pontuação divide-se em duas abas. O curto prazo (momentum) adota uma visão de seguimento de tendência de 1–3 meses e sobe com tendências de alta fortes; o longo prazo (contrário) adota uma visão de ciclo de mais de um ano e sobe com medo e subvalorização. Em backtests desde 2017, o momentum funcionou melhor no curto e o contrário no longo.' },
        { q: 'O que é o BOTTOM RADAR (pontuação de fundo)?', a: 'Um medidor auxiliar que usa métricas on-chain como o MVRV Z-Score para medir onde a capitalização está em relação ao custo médio dos investidores, mostrando a proximidade de zonas de fundo históricas numa escala de 0 a 100. O cálculo completo está publicado no guia «fundo do Bitcoin».' }
      ],
      disclaimer: '⚠ Esta pontuação é um sinal de referência a partir de indicadores públicos, não é consultoria de investimento. Todas as decisões e a responsabilidade são suas.'
    },
    ru: {
      title: 'Индекс страха и жадности аваланча и оценка времени покупки',
      intro: 'Бесплатная панель, которая объединяет 7 индикаторов в реальном времени — включая индекс страха и жадности аваланча — в оценку от 0 до 100 «подходящее ли сейчас время для покупки?». Работает в браузере без установки, на 13 языках.',
      whatIsH: 'Что такое индекс страха биткоина?',
      whatIsP: 'Индекс страха и жадности выражает настроение инвесторов биткоина от 0 до 100. Около 0 — крайний страх; около 100 — крайняя жадность. Часто используется как контртрендовый сигнал: «будь жадным, когда другие боятся». Источник: Alternative.me.',
      scoreH: 'Оценка покупки — 7 индикаторов',
      score: ['Индекс страха и жадности — крайний страх = возможность покупки (контртренд)', 'RSI(14) — перепроданность (<30) благоприятна для покупки', 'MACD(12·26·9) — разворот вверх от дна = импульс к покупке', 'Множитель Майера — цена ÷ 200-дневная средняя; ниже 1 — недооценка', 'Просадка от 365-дневного максимума — чем глубже падение, тем зона накопления', 'Золотой/мёртвый крест — фильтр тренда по средним 50/200', 'MVRV Z-оценка — капитализация ÷ реализованная капитализация (средняя цена входа); ончейн-индикатор исторических дна и вершин'],
      scoreNote: '8 частных оценок взвешиваются в оценку 0–100 и показываются в 5 диапазонах: STRONG BUY · ACCUMULATE · NEUTRAL · CAUTION · OVERHEATED.',
      fngH: 'Страх и жадность — 5 уровней',
      fng: ['0–25 Крайний страх (Extreme Fear) — паническая распродажа; исторически зона накопления', '25–45 Страх (Fear) — медвежьи настроения', '45–55 Нейтрально (Neutral) — направление неясно', '55–75 Жадность (Greed) — начало перегрева', '75–100 Крайняя жадность (Extreme Greed) — перегрев, осторожно у вершин'],
      bandsH: 'Оценка покупки — 5 диапазонов',
      bands: ['80–100 STRONG BUY — сходятся перепроданность + страх + недооценка', '65–80 ACCUMULATE — выгодно для усреднения (DCA)', '45–65 NEUTRAL — выжидание', '25–45 CAUTION — не гнаться за ценой', '0–25 OVERHEATED — перегрев, без новых покупок'],
      faqH: 'Частые вопросы',
      faq: [
        { q: 'Покупать ли аваланч, когда индекс низкий?', a: 'Крайний страх исторически часто был возможностью накопления, но полагаться только на индекс рискованно — можно «поймать падающий нож». Эта оценка также учитывает RSI, MACD, множитель Майера, просадку и пересечения средних и консервативно снижается в нисходящих трендах.' },
        { q: 'Как рассчитывается оценка покупки?', a: 'Каждый из 7 индикаторов переводится в частную оценку 0–100 и взвешивается. Результат — 0–100, в 5 диапазонах.' },
        { q: 'Это бесплатно? Нужно ли что-то устанавливать?', a: 'Полностью бесплатно и без установки. Данные в реальном времени берутся из публичных API CoinGecko, Binance и Alternative.me.' },
        { q: 'Чем индекс отличается от оценки покупки?', a: 'Индекс — одна метрика настроения (0–100); оценка покупки — составной показатель из 7 индикаторов, включая индекс (0–100).' },
        { q: 'Откуда берутся данные и как часто они обновляются?', a: 'Индекс страха и жадности — с Alternative.me; цены и дневные свечи — из публичных API CoinGecko и Binance; ончейн-метрики — из CoinMetrics. Экран автоматически обновляется примерно раз в минуту.' },
        { q: 'Стоит ли покупать аваланч прямо сейчас?', a: 'Единственно верного ответа нет, но оценка покупки (0–100) объективно показывает, находится ли рынок в зоне перепроданности/страха или перегрева/жадности. На вкладке долгосрочного (контртрендового) взгляда высокие значения отмечают зоны, где совпадают страх и недооценка — исторически благоприятные для усреднения, — а низкие предупреждают о перегреве. Это справочный сигнал, а не инвестиционная рекомендация.' },
        { q: 'Чем отличаются краткосрочный и долгосрочный тайминг?', a: 'Оценка разделена на две вкладки. Краткосрочная (моментум) использует трендследящий взгляд на 1–3 месяца и растёт при сильных восходящих трендах; долгосрочная (контртренд) — циклический взгляд от года и растёт при страхе и недооценке. В бэктестах с 2017 года на коротком горизонте лучше работал моментум, на длинном — контртренд.' },
        { q: 'Что такое BOTTOM RADAR (оценка дна)?', a: 'Вспомогательный индикатор, который с помощью ончейн-метрик, таких как MVRV Z-оценка, измеряет положение капитализации относительно средней цены входа инвесторов и показывает близость к историческим зонам дна по шкале 0–100. Полный расчёт опубликован на странице «дно биткоина».' }
      ],
      disclaimer: '⚠ Эта оценка — справочный сигнал на основе публичных индикаторов, а не инвестиционная рекомендация. Все решения и ответственность — на вас.'
    },
    nl: {
      title: 'Avalanche Angst- & Hebzucht-index en koopmoment-score',
      intro: 'Een gratis dashboard dat 7 realtime indicatoren — inclusief de Avalanche Angst- & Hebzucht-index — samenvoegt tot een score van 0–100 voor «is het nu een goed moment om te kopen?». Draait in de browser zonder installatie, in 13 talen.',
      whatIsH: 'Wat is de Bitcoin Angst-index?',
      whatIsP: 'De Angst- & Hebzucht-index drukt het sentiment van Bitcoin-beleggers uit van 0 tot 100. Dicht bij 0 = extreme angst; dicht bij 100 = extreme hebzucht. Vaak gebruikt als tegendraads signaal: «wees hebzuchtig als anderen bang zijn». Bron: Alternative.me.',
      scoreH: 'Koopmoment-score — 7 indicatoren',
      score: ['Angst- & Hebzucht-index — extreme angst = koopkans (tegendraads)', 'RSI(14) — oversold (<30) is gunstig om te kopen', 'MACD(12·26·9) — omslag omhoog vanaf de bodem = koopmomentum', 'Mayer Multiple — prijs ÷ 200-daags gemiddelde; onder 1 ondergewaardeerd', 'Daling vanaf 365-daagse top — diepere dalingen = accumulatiezone', 'Golden/Death Cross — trendfilter met 50/200-gemiddelden', 'MVRV Z-score — marktkapitalisatie ÷ gerealiseerde kapitalisatie (gemiddelde kostprijs); on-chain-indicator van historische bodems en toppen'],
      scoreNote: 'De 7 deelscores worden gewogen tot een score van 0–100, getoond in 5 banden: STRONG BUY · ACCUMULATE · NEUTRAL · CAUTION · OVERHEATED.',
      fngH: 'Angst & hebzucht — 5 niveaus',
      fng: ['0–25 Extreme angst (Extreme Fear) — paniekverkoop; historisch een accumulatiezone', '25–45 Angst (Fear) — bearish sentiment', '45–55 Neutraal (Neutral) — onduidelijke richting', '55–75 Hebzucht (Greed) — beginnende oververhitting', '75–100 Extreme hebzucht (Extreme Greed) — oververhit, let op toppen'],
      bandsH: 'Koopmoment-score — 5 banden',
      bands: ['80–100 STRONG BUY — oversold + angst + onderwaardering komen samen', '65–80 ACCUMULATE — gunstig voor DCA', '45–65 NEUTRAL — afwachten', '25–45 CAUTION — prijs niet najagen', '0–25 OVERHEATED — oververhit, geen nieuwe aankopen'],
      faqH: 'Veelgestelde vragen',
      faq: [
        { q: 'Moet ik Avalanche kopen als de index laag is?', a: 'Extreme angst was vaak een accumulatiekans, maar alleen op de index vertrouwen riskeert «een vallend mes te vangen». Deze score weegt ook RSI, MACD, Mayer Multiple, daling en gemiddelde-kruisingen mee, en verlaagt de score behoudend in dalende trends.' },
        { q: 'Hoe wordt de koopmoment-score berekend?', a: 'Elk van de 7 indicatoren wordt omgezet naar een deelscore van 0–100 en gewogen. Het resultaat is 0–100, in 5 banden.' },
        { q: 'Is het gratis? Moet ik iets installeren?', a: 'Het is volledig gratis en zonder installatie. Realtime data komt van de publieke API’s van CoinGecko, Binance en Alternative.me.' },
        { q: 'Wat is het verschil tussen de index en de koopmoment-score?', a: 'De index is één sentimentmaatstaf (0–100); de koopmoment-score is een samenstelling van 7 indicatoren inclusief de index (0–100).' },
        { q: 'Waar komen de gegevens vandaan en hoe vaak worden ze ververst?', a: 'De Angst- & Hebzucht-index komt van Alternative.me; prijzen en dagcandles van de publieke API’s van CoinGecko en Binance; on-chain-metrieken van CoinMetrics. Het scherm ververst ongeveer elke minuut automatisch.' },
        { q: 'Moet ik nu Avalanche kopen?', a: 'Er is geen eenduidig antwoord, maar de koopmoment-score (0–100) geeft een objectief beeld of de markt in een oversold/angst-zone of een oververhitte/hebzucht-zone zit. Op het langetermijn-tabblad (tegendraads) markeren hoge scores zones waar angst en onderwaardering samenvallen — historisch gunstig voor DCA — terwijl lage scores waarschuwen voor oververhitting. Het is een referentiesignaal, geen beleggingsadvies.' },
        { q: 'Hoe verschillen korte- en langetermijn-kooptiming?', a: 'De score is verdeeld over twee tabbladen. Korte termijn (momentum) hanteert een trendvolgende blik van 1–3 maanden en stijgt bij sterke opwaartse trends; lange termijn (tegendraads) hanteert een cyclusblik van ruim een jaar en stijgt bij angst en onderwaardering. In backtests sinds 2017 werkte momentum beter op korte termijn en tegendraads beter op lange termijn.' },
        { q: 'Wat is de BOTTOM RADAR (bodemscore)?', a: 'Een hulpmeter die met on-chain-metrieken zoals de MVRV Z-score meet waar de marktkapitalisatie staat ten opzichte van de gemiddelde kostprijs van beleggers, en de nabijheid van historische bodemzones toont op een schaal van 0–100. De volledige berekening staat op de pagina «Bitcoin-bodem».' }
      ],
      disclaimer: '⚠ Deze score is een referentiesignaal uit publieke indicatoren, geen beleggingsadvies. Alle beslissingen en verantwoordelijkheid zijn van uzelf.'
    },
    th: {
      title: 'ดัชนีความกลัวและความโลภอาวาแลนช์ และคะแนนจังหวะซื้อ',
      intro: 'แดชบอร์ดฟรีที่รวม 7 ตัวชี้วัดแบบเรียลไทม์ — รวมถึงดัชนีความกลัวและความโลภของอาวาแลนช์ — เป็นคะแนน 0–100 ว่า “ตอนนี้เป็นจังหวะซื้อหรือไม่?” ใช้งานในเบราว์เซอร์ได้ทันที ไม่ต้องติดตั้ง รองรับ 13 ภาษา',
      whatIsH: 'ดัชนีความกลัวบิตคอยน์คืออะไร?',
      whatIsP: 'ดัชนีความกลัว-ความโลภแสดงอารมณ์ของนักลงทุนบิตคอยน์เป็น 0–100 ใกล้ 0 คือกลัวสุดขีด ใกล้ 100 คือโลภสุดขีด มักใช้เป็นสัญญาณสวนตลาด — “จงโลภเมื่อผู้อื่นกลัว” แหล่งข้อมูล: Alternative.me',
      scoreH: 'คะแนนจังหวะซื้อ — 7 ตัวชี้วัด',
      score: ['ดัชนีความกลัว-ความโลภ — กลัวสุดขีด = โอกาสซื้อ (สวนตลาด)', 'RSI(14) — ขายมากเกิน (<30) เอื้อต่อการซื้อ', 'MACD(12·26·9) — กลับตัวขึ้นจากก้น = โมเมนตัมซื้อ', 'Mayer Multiple — ราคา ÷ เส้นเฉลี่ย 200 วัน; ต่ำกว่า 1 คือราคาต่ำกว่ามูลค่า', 'การย่อจากจุดสูงสุด 365 วัน — ยิ่งลงลึกยิ่งเป็นโซนทยอยซื้อ', 'Golden/Death Cross — ตัวกรองเทรนด์เส้นเฉลี่ย 50/200', 'MVRV Z-Score — มูลค่าตลาด ÷ มูลค่าตลาดที่เกิดขึ้นจริง (ต้นทุนเฉลี่ย); ตัวชี้วัดออนเชนของก้นและยอดในอดีต'],
      scoreNote: 'รวม 8 คะแนนย่อยแบบถ่วงน้ำหนักเป็นคะแนน 0–100 และแสดงเป็น 5 ระดับ: STRONG BUY · ACCUMULATE · NEUTRAL · CAUTION · OVERHEATED',
      fngH: 'ความกลัว-ความโลภ 5 ระดับ',
      fng: ['0–25 กลัวสุดขีด (Extreme Fear) — เทขายตื่นตระหนก; ในอดีตเป็นโซนน่าทยอยซื้อ', '25–45 กลัว (Fear) — อารมณ์ขาลง', '45–55 เป็นกลาง (Neutral) — ทิศทางไม่ชัด', '55–75 โลภ (Greed) — เริ่มร้อนแรง', '75–100 โลภสุดขีด (Extreme Greed) — ร้อนแรง ระวังจุดสูงสุด'],
      bandsH: 'คะแนนจังหวะซื้อ 5 ระดับ',
      bands: ['80–100 STRONG BUY — ขายมากเกิน + กลัว + ราคาต่ำกว่ามูลค่า มาบรรจบกัน', '65–80 ACCUMULATE — เหมาะกับ DCA', '45–65 NEUTRAL — รอดู', '25–45 CAUTION — เลี่ยงไล่ราคา', '0–25 OVERHEATED — ร้อนแรง อย่าเพิ่งซื้อใหม่'],
      faqH: 'คำถามที่พบบ่อย',
      faq: [
        { q: 'ถ้าดัชนีต่ำควรซื้ออาวาแลนช์ไหม?', a: 'ความกลัวสุดขีดในอดีตมักเป็นโอกาสทยอยซื้อ แต่ดูเพียงดัชนีอย่างเดียวเสี่ยง “รับมีดที่กำลังตก” คะแนนนี้ยังพิจารณา RSI, MACD, Mayer Multiple, การย่อ และการตัดกันของเส้นเฉลี่ย และลดคะแนนอย่างระมัดระวังในแนวโน้มขาลง' },
        { q: 'คะแนนจังหวะซื้อคำนวณอย่างไร?', a: 'แปลงแต่ละตัวชี้วัดทั้ง 7 เป็นคะแนนย่อย 0–100 แล้วถ่วงน้ำหนักรวมกัน ผลลัพธ์คือ 0–100 แสดงเป็น 5 ระดับ' },
        { q: 'ฟรีไหม? ต้องติดตั้งไหม?', a: 'ฟรีทั้งหมดและไม่ต้องติดตั้ง ข้อมูลเรียลไทม์มาจาก API สาธารณะของ CoinGecko, Binance และ Alternative.me' },
        { q: 'ดัชนีกับคะแนนจังหวะซื้อต่างกันอย่างไร?', a: 'ดัชนีเป็นตัวชี้วัดอารมณ์เดียว (0–100); คะแนนจังหวะซื้อเป็นคะแนนรวมจาก 7 ตัวชี้วัดรวมถึงดัชนี (0–100)' },
        { q: 'ข้อมูลมาจากไหน อัปเดตบ่อยแค่ไหน?', a: 'ดัชนีความกลัว-ความโลภมาจาก Alternative.me ราคาและแท่งเทียนรายวันมาจาก API สาธารณะของ CoinGecko และ Binance ส่วนตัวชี้วัดออนเชนมาจาก CoinMetrics หน้าจออัปเดตอัตโนมัติราวทุก 1 นาที' },
        { q: 'ตอนนี้ควรซื้ออาวาแลนช์ไหม?', a: 'ไม่มีคำตอบตายตัว แต่คะแนนจังหวะซื้อ (0–100) ช่วยประเมินอย่างเป็นกลางว่าตลาดอยู่ในโซนขายมากเกิน/ความกลัว หรือโซนร้อนแรง/ความโลภ ในแท็บระยะยาว (สวนตลาด) คะแนนยิ่งสูงหมายถึงโซนที่ความกลัวและราคาต่ำกว่ามูลค่าทับซ้อนกัน ซึ่งในอดีตเอื้อต่อ DCA ส่วนคะแนนต่ำเตือนถึงความร้อนแรง เป็นเพียงสัญญาณอ้างอิง ไม่ใช่คำแนะนำการลงทุน' },
        { q: 'จังหวะซื้อระยะสั้นกับระยะยาวต่างกันอย่างไร?', a: 'คะแนนแบ่งเป็นสองแท็บ ระยะสั้น (โมเมนตัม) ใช้มุมมองตามเทรนด์ราว 1–3 เดือน ยิ่งเทรนด์ขึ้นแรงคะแนนยิ่งสูง ส่วนระยะยาว (สวนตลาด) ใช้มุมมองวัฏจักรมากกว่า 1 ปี ยิ่งกลัวและราคาต่ำกว่ามูลค่าคะแนนยิ่งสูง จากการทดสอบย้อนหลังตั้งแต่ปี 2017 ระยะสั้นแบบโมเมนตัมและระยะยาวแบบสวนตลาดแม่นยำกว่า' },
        { q: 'BOTTOM RADAR (คะแนนก้น) คืออะไร?', a: 'มาตรวัดเสริมที่ใช้ตัวชี้วัดออนเชนอย่าง MVRV Z-Score วัดว่ามูลค่าตลาดอยู่ตรงไหนเทียบกับต้นทุนเฉลี่ยของนักลงทุน แล้วแสดงความใกล้เคียงกับโซนก้นในอดีตเป็น 0–100 สูตรคำนวณทั้งหมดเปิดเผยในหน้าอธิบาย "ก้นบิตคอยน์"' }
      ],
      disclaimer: '⚠ คะแนนนี้เป็นสัญญาณอ้างอิงจากตัวชี้วัดสาธารณะ ไม่ใช่คำแนะนำการลงทุน การตัดสินใจและความรับผิดชอบทั้งหมดเป็นของผู้ใช้เอง'
    }
  };

  /* "심층 해설" 링크 목록 라벨 (언어별) */
  var DEEP = {
    ko: { h: '심층 해설', methodology: '점수 방법론', indicators: '8개 지표 해설', mayer: '마이어 배수', fng: '공포·탐욕 지수', gc: '골든크로스', dd: '낙폭과 분할매수', bottom: '비트코인 바닥 · BOTTOM RADAR', guide: '공포지수 활용법', glossary: '용어집', about: '운영자 소개 · 편집 원칙' },
    en: { h: 'Deep dives', methodology: 'Scoring methodology', indicators: 'The 8 indicators explained', mayer: 'Mayer Multiple', fng: 'Fear & Greed Index', gc: 'Golden Cross', dd: 'Drawdown & DCA', bottom: 'Bitcoin bottom · BOTTOM RADAR', guide: 'Fear & Greed practical guide', glossary: 'Glossary', about: 'About · Editorial policy' },
    ja: { h: '詳しい解説', methodology: 'スコアの算出方法', indicators: '8指標の解説', mayer: 'マイヤー倍率', fng: '恐怖・強欲指数', gc: 'ゴールデンクロス', dd: '下落率と積立投資', bottom: 'ビットコインの底 · BOTTOM RADAR', guide: '恐怖指数の実践ガイド', glossary: '用語集', about: '運営者情報・編集方針' },
    zh: { h: '深度解读', methodology: '评分方法', indicators: '8项指标解读', mayer: '梅耶倍数', fng: '恐惧与贪婪指数', gc: '金叉', dd: '回撤与定投', bottom: '比特币底部 · BOTTOM RADAR', guide: '恐惧指数实战指南', glossary: '术语表', about: '关于 · 编辑方针' },
    'zh-Hant': { h: '深度解讀', methodology: '評分方法', indicators: '8項指標解讀', mayer: '梅耶倍數', fng: '恐懼與貪婪指數', gc: '黃金交叉', dd: '回撤與定期定額', bottom: '比特幣底部 · BOTTOM RADAR', guide: '恐懼指數實戰指南', glossary: '術語表', about: '關於 · 編輯方針' },
    th: { h: 'บทความเจาะลึก', methodology: 'วิธีคำนวณคะแนน', indicators: 'อธิบาย 8 ตัวชี้วัด', mayer: 'ตัวคูณเมเยอร์', fng: 'ดัชนีความกลัวและความโลภ', gc: 'โกลเดนครอส', dd: 'การย่อตัวและการทยอยซื้อ', bottom: 'ก้นบิตคอยน์ · BOTTOM RADAR', guide: 'คู่มือใช้ดัชนีความกลัว', glossary: 'อภิธานศัพท์', about: 'เกี่ยวกับเรา · นโยบายบรรณาธิการ' },
    es: { h: 'Análisis en profundidad', methodology: 'Metodología de la puntuación', indicators: 'Los 8 indicadores explicados', mayer: 'Múltiplo de Mayer', fng: 'Índice de miedo y codicia', gc: 'Cruce dorado', dd: 'Caídas y compras periódicas', bottom: 'Suelo de Bitcoin · BOTTOM RADAR', guide: 'Guía práctica de miedo y codicia', glossary: 'Glosario', about: 'Acerca de · Política editorial' },
    fr: { h: 'Pour aller plus loin', methodology: 'Méthodologie du score', indicators: 'Les 8 indicateurs expliqués', mayer: 'Multiple de Mayer', fng: 'Indice peur & avidité', gc: 'Croix dorée', dd: 'Replis et achats programmés', bottom: 'Creux du Bitcoin · BOTTOM RADAR', guide: 'Guide pratique peur & avidité', glossary: 'Glossaire', about: 'À propos · Ligne éditoriale' },
    de: { h: 'Vertiefung', methodology: 'Methodik des Scores', indicators: 'Die 8 Indikatoren erklärt', mayer: 'Mayer-Multiple', fng: 'Angst-und-Gier-Index', gc: 'Goldenes Kreuz', dd: 'Kursrückgang & Sparplan', bottom: 'Bitcoin-Tief · BOTTOM RADAR', guide: 'Praxisleitfaden Angst & Gier', glossary: 'Glossar', about: 'Über uns · Redaktionelle Grundsätze' },
    it: { h: 'Approfondimenti', methodology: 'Metodologia del punteggio', indicators: 'Gli 8 indicatori spiegati', mayer: 'Multiplo di Mayer', fng: 'Indice di paura e avidità', gc: 'Croce d’oro', dd: 'Ribassi e piano di accumulo', bottom: 'Minimo di Bitcoin · BOTTOM RADAR', guide: 'Guida pratica paura e avidità', glossary: 'Glossario', about: 'Chi siamo · Linee editoriali' },
    pt: { h: 'Análises aprofundadas', methodology: 'Metodologia da pontuação', indicators: 'Os 8 indicadores explicados', mayer: 'Múltiplo de Mayer', fng: 'Índice de medo e ganância', gc: 'Cruzamento dourado', dd: 'Quedas e compras periódicas', bottom: 'Fundo do Bitcoin · BOTTOM RADAR', guide: 'Guia prático de medo e ganância', glossary: 'Glossário', about: 'Sobre · Política editorial' },
    ru: { h: 'Подробные разборы', methodology: 'Методология оценки', indicators: 'Разбор 8 индикаторов', mayer: 'Множитель Майера', fng: 'Индекс страха и жадности', gc: 'Золотой крест', dd: 'Просадка и усреднение', bottom: 'Дно биткоина · BOTTOM RADAR', guide: 'Практическое руководство по индексу страха', glossary: 'Глоссарий', about: 'О нас · Редакционная политика' },
    nl: { h: 'Verdieping', methodology: 'Methodologie van de score', indicators: 'De 8 indicatoren uitgelegd', mayer: 'Mayer-multiple', fng: 'Angst- en hebzuchtindex', gc: 'Gouden kruis', dd: 'Koersdaling & periodiek beleggen', bottom: 'Bitcoin-bodem · BOTTOM RADAR', guide: 'Praktijkgids angst & hebzucht', glossary: 'Woordenlijst', about: 'Over ons · Redactioneel beleid' }
  };
  /* 푸터 설명 문단(.foot-desc) — 아발란체 언급이 있어 공통 foot-i18n.js 가 아니라 여기에 둔다 */
  var FOOT_DESC = {
    ko: 'broodev는 설치 없이 브라우저에서 바로 쓰는 무료 웹앱을 만드는 앱 포트폴리오입니다. 이 페이지의 아발란체 공포·탐욕 지수와 매수 타이밍 점수는 공개 지표를 합성한 참고 정보이며 투자 자문이 아닙니다. 광고는 Google AdSense를 통해 게재될 수 있습니다.',
    en: 'broodev is a portfolio of free web apps that run right in your browser with no install. The Avalanche Fear & Greed Index and buy-timing score on this page are reference information synthesized from public indicators, not investment advice. Ads may be served through Google AdSense.',
    ja: 'broodevは、インストール不要でブラウザからすぐ使える無料Webアプリを作るアプリポートフォリオです。このページのアバランチ恐怖・強欲指数と買い時スコアは公開指標を合成した参考情報であり、投資助言ではありません。広告はGoogle AdSenseを通じて掲載される場合があります。',
    zh: 'broodev 是一个应用作品集，制作无需安装、在浏览器中即可直接使用的免费网页应用。本页的雪崩币恐惧与贪婪指数和买入时机评分是综合公开指标得出的参考信息，不构成投资建议。广告可能通过 Google AdSense 投放。',
    'zh-Hant': 'broodev 是一個應用作品集，製作無需安裝、在瀏覽器中即可直接使用的免費網頁應用。本頁的雪崩幣恐懼與貪婪指數和買入時機評分是綜合公開指標得出的參考資訊，不構成投資建議。廣告可能透過 Google AdSense 刊登。',
    th: 'broodev คือพอร์ตโฟลิโอแอปที่สร้างเว็บแอปฟรีซึ่งใช้งานได้ทันทีในเบราว์เซอร์โดยไม่ต้องติดตั้ง ดัชนีความกลัว-ความโลภอาวาแลนช์และคะแนนจังหวะซื้อในหน้านี้เป็นข้อมูลอ้างอิงที่สังเคราะห์จากตัวชี้วัดสาธารณะ ไม่ใช่คำแนะนำการลงทุน โฆษณาอาจแสดงผ่าน Google AdSense',
    es: 'broodev es un portafolio de aplicaciones web gratuitas que funcionan directamente en el navegador, sin instalación. El Índice de Miedo y Codicia de Avalanche y la puntuación de momento de compra de esta página son información de referencia elaborada a partir de indicadores públicos, no asesoramiento de inversión. Los anuncios pueden mostrarse a través de Google AdSense.',
    fr: 'broodev est un portfolio d’applications web gratuites qui s’utilisent directement dans le navigateur, sans installation. L’indice Peur & Avidité du Avalanche et le score de timing d’achat de cette page sont des informations de référence issues d’indicateurs publics, et non un conseil en investissement. Des annonces peuvent être diffusées via Google AdSense.',
    de: 'broodev ist ein Portfolio kostenloser Web-Apps, die ohne Installation direkt im Browser laufen. Der Avalanche-Angst-und-Gier-Index und der Kauf-Timing-Score auf dieser Seite sind aus öffentlichen Indikatoren zusammengesetzte Referenzinformationen und keine Anlageberatung. Werbung kann über Google AdSense ausgeliefert werden.',
    it: 'broodev è un portfolio di web app gratuite che funzionano direttamente nel browser, senza installazione. L’Indice di Paura e Avidità di Avalanche e il punteggio di timing d’acquisto in questa pagina sono informazioni di riferimento ricavate da indicatori pubblici, non una consulenza di investimento. Gli annunci possono essere pubblicati tramite Google AdSense.',
    pt: 'O broodev é um portefólio de aplicações web gratuitas que funcionam diretamente no navegador, sem instalação. O Índice de Medo e Ganância do Avalanche e a pontuação de momento de compra desta página são informação de referência sintetizada a partir de indicadores públicos, não aconselhamento de investimento. Os anúncios podem ser apresentados através do Google AdSense.',
    ru: 'broodev — это портфолио бесплатных веб-приложений, которые работают прямо в браузере без установки. Индекс страха и жадности аваланча и оценка момента покупки на этой странице — справочная информация, собранная из открытых индикаторов, а не инвестиционная рекомендация. Реклама может показываться через Google AdSense.',
    nl: 'broodev is een portfolio van gratis webapps die zonder installatie direct in je browser werken. De Avalanche Angst- en Hebzuchtindex en de koop-timingscore op deze pagina zijn referentie-informatie samengesteld uit openbare indicatoren, geen beleggingsadvies. Advertenties kunnen via Google AdSense worden getoond.'
  };

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function build(d, lang) {
    var g = DEEP[lang] || DEEP.en;
    var a = function (href, label) { return '<a href="' + href + '">' + esc(label) + '</a>'; };
    var li = function (a) { return a.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join(''); };
    var qa = function (a) { return a.map(function (x) { return '<dt>' + esc(x.q) + '</dt><dd>' + esc(x.a) + '</dd>'; }).join(''); };
    var ps = function (a) { return a.map(function (x) { return '<p>' + esc(x) + '</p>'; }).join(''); };
    // 코인 고유 본문(코인 앱만 — scripts/gen_coin.py 가 scripts/coin-content/<코인>.json 을 COIN_SEO 로 넣는다). btc 는 이 키가 없다.
    // 정적 section.seo(index.html)와 같은 순서: 제목 · 소개 · [코인 소개 · 지표 적용 · 가격 사이클] · 공통 해설 · FAQ
    var coin = (d.coinH ? '<h2>' + esc(d.coinH) + '</h2>' + ps(d.coinP || []) : '') +
      (d.applyH ? '<h2>' + esc(d.applyH) + '</h2><ul>' + li(d.apply || []) + '</ul>' : '') +
      (d.histH ? '<h2>' + esc(d.histH) + '</h2><ul>' + li(d.hist || []) + '</ul>' : '');
    return '<h1>' + esc(d.title) + '</h1>' +
      '<p>' + esc(d.intro) + '</p>' + coin +
      '<h2>' + esc(d.whatIsH) + '</h2><p>' + esc(d.whatIsP) + '</p>' +
      '<h2>' + esc(d.scoreH) + '</h2><ul>' + li(d.score) + '</ul><p>' + esc(d.scoreNote) + '</p>' +
      '<h2>' + esc(d.fngH) + '</h2><ul>' + li(d.fng) + '</ul>' +
      '<h2>' + esc(d.bandsH) + '</h2><ul>' + li(d.bands) + '</ul>' +
      '<h2>' + esc(d.faqH) + '</h2><dl>' + qa(d.faq) + '</dl>' +
      '<p class="seo-disclaimer">' + esc(d.disclaimer) + '</p>' +
      '<h2>' + esc(g.h) + '</h2><ul class="seo-guides">' +
        '<li>' + a('https://btc.broodev.com/methodology', g.methodology) + '</li>' +
        '<li>' + a('https://btc.broodev.com/indicators', g.indicators) + '</li>' +
        '<li>' + a('https://btc.broodev.com/rsi-guide', 'RSI') + ' · ' + a('https://btc.broodev.com/macd-guide', 'MACD') + ' · ' + a('https://btc.broodev.com/mayer-multiple', g.mayer) + '</li>' +
        '<li>' + a('https://btc.broodev.com/fear-greed-index', g.fng) + ' · ' + a('https://btc.broodev.com/golden-cross', g.gc) + ' · ' + a('https://btc.broodev.com/drawdown-dca', g.dd) + '</li>' +
        '<li>' + a('https://btc.broodev.com/bitcoin-bottom', g.bottom) + '</li>' +
        '<li>' + a('https://btc.broodev.com/guide-fear-greed', g.guide) + ' · ' + a('https://btc.broodev.com/glossary', g.glossary) + ' · ' + a('https://btc.broodev.com/about', g.about) + '</li>' +
        '</ul>';
  }

  /* 코인 고유 본문 — 생성: python scripts/gen_coin.py (원본 scripts/coin-content/<코인>.json · 손으로 고치지 말 것).
     title·intro·faq 는 공통 문구를 갈아끼우고 coinH·coinP·applyH·apply·histH·hist 는 새 키(build 가 그린다) */
  var COIN_SEO = {
   "en": {
    "title": "Avalanche (AVAX) Buy-Timing Score — Reading the Indicators Without MVRV",
    "intro": "AVAX_SIGNAL calculates RSI(14), MACD(12·26·9), the Mayer Multiple, the drawdown from the 365-day high and the 50/200 golden/death cross from Avalanche's daily prices, then adds the market-wide Fear & Greed Index to form a 0–100 buy-timing score. The seventh indicator, the MVRV Z-Score, shows N/A because the CoinMetrics community API has no AVAX data, and its weight is redistributed across the remaining indicators. Today's score is free to check, with nothing to install.",
    "coinH": "What is Avalanche (AVAX)?",
    "coinP": [
     "Avalanche is a smart-contract platform developed by Ava Labs, whose co-founders include former Cornell professor Emin Gün Sirer; its mainnet went live in September 2020, and AVAX is its native token. It pairs the Avalanche consensus protocol — which reaches agreement quickly by repeatedly polling small random samples of validators — with proof of stake, so validators must stake AVAX.",
     "The primary network consists of the X-Chain for creating and transferring assets, the C-Chain for smart contracts compatible with the Ethereum Virtual Machine (EVM), and the P-Chain, which manages validators and subnetworks. A distinctive feature is that projects can launch their own blockchains with custom rules — originally called subnets and now referred to as Avalanche L1s. AVAX supply is capped at 720 million, and AVAX paid as transaction fees is burned."
    ],
    "applyH": "Applying the indicators to Avalanche",
    "apply": [
     "On the Avalanche screen the MVRV Z-Score is N/A. The CoinMetrics community API does not provide AVAX MVRV, so the score redistributes the weights across the other six indicators. On-chain bottom checks — such as whether market cap has dropped below holders' average cost — are not possible here.",
     "The Fear & Greed value is Alternative.me's market-wide index and is driven largely by Bitcoin. News that only affects the Avalanche ecosystem barely registers in that number, so read it alongside the price indicators.",
     "AVAX has traded only since September 2020, so its price history is far shorter than Bitcoin's, with essentially one complete boom-and-bust cycle (2021–2022). Applying the Mayer Multiple thresholds (0.8 and 2.4), which were set from Bitcoin's history, unchanged may produce misleading signals.",
     "From its November 2021 high, AVAX fell more than 90% by the end of 2022. In other words, the decline can continue long after the drawdown indicator reaches its −50% “strong buy” threshold.",
     "Circulating supply grows over time as staking rewards are issued and tokens from the initial allocation unlock. The score looks only at price, so check supply changes like these separately."
    ],
    "histH": "Avalanche price cycles at a glance",
    "hist": [
     "2018 — Anonymous authors calling themselves “Team Rocket” published the Avalanche consensus paper, and Ava Labs, founded that year, began building on it.",
     "2020 — After a public token sale in July, the mainnet launched in September and AVAX began trading on exchanges.",
     "2021 — Following the August announcement of “Avalanche Rush,” an ecosystem incentive program, the price climbed sharply and set an all-time high in November.",
     "2022 — In the bear market it was down more than 90% from that all-time high by year-end.",
     "2024 — The Avalanche9000 upgrade in December substantially changed the cost of launching an L1 chain."
    ],
    "faq": [
     {
      "q": "Is the Fear & Greed Index on this screen based on Avalanche?",
      "a": "No. It is the market-wide crypto sentiment index that Alternative.me publishes every day, and Bitcoin carries a large weight in it. That is why the AVAX and BTC screens show the same number; the card name includes “market-wide” to make this clear."
     },
     {
      "q": "Why does MVRV show N/A on the Avalanche screen?",
      "a": "MVRV requires realized-cap data (holders' average cost basis), and the CoinMetrics community API this page uses has no MVRV for AVAX. Rather than estimate a value, the page shows N/A and rebalances the composite score across the remaining indicators. For the same reason, the premium BOTTOM RADAR's “is this the bottom?” verdict is withheld."
     },
     {
      "q": "Do staking or Avalanche L1 activity count toward the score?",
      "a": "No. The score uses only five indicators calculated from the AVAX price plus the market-wide Fear & Greed Index. Staking ratios, network usage and token-unlock schedules are not included, so check them separately if they matter to you."
     },
     {
      "q": "AVAX is more volatile than Bitcoin — do the same thresholds still apply?",
      "a": "The formulas are the same as for Bitcoin, so the boundaries — RSI 30/70, Mayer Multiple 0.8/2.4 — are unchanged. A more volatile coin can stay oversold or overbought more often and for longer, so it is safer to check whether several indicators agree than to act on one extreme reading."
     },
     {
      "q": "Should I buy Avalanche now?",
      "a": "We do not tell you to buy or sell. What the score shows is whether the indicators are currently clustered on the oversold-and-fearful side or the overheated side. On the long-term (contrarian) tab, 80 or above is STRONG BUY and below 25 is OVERHEATED; keep in mind that AVAX is scored without MVRV, and treat the result as a reference only."
     }
    ]
   },
   "ja": {
    "title": "アバランチ(AVAX)買い時スコア — MVRVなしで読む指標の見方",
    "intro": "AVAX_SIGNALは、アバランチの日足価格からRSI(14)・MACD(12·26·9)・マイヤー倍率・365日高値からの下落率・50/200日線のゴールデンクロス/デッドクロスを計算し、暗号資産市場全体の恐怖・強欲指数を加えて0〜100の買い時スコアを合成します。7つ目の指標であるMVRV Zスコアは、CoinMetricsのコミュニティAPIにAVAXのデータがないためN/Aと表示され、その分の重みは残りの指標に配分し直されます。今日のスコアは無料で、インストールせずにすぐ確認できます。",
    "coinH": "アバランチ(AVAX)とは?",
    "coinP": [
     "アバランチは、コーネル大学の元教授エミン・ギュン・シラー(Emin Gün Sirer)らが創業したAva Labsが開発し、2020年9月にメインネットを公開したスマートコントラクト基盤で、AVAXはそのネイティブトークンです。ランダムに選んだ少数のバリデーターへの問い合わせを繰り返して素早く合意に達する「アバランチ・コンセンサス」をプルーフ・オブ・ステーク(PoS)と組み合わせており、バリデーターになるにはAVAXのステーキングが必要です。",
     "基盤となるプライマリーネットワークは、資産の発行・送受信を担うXチェーン、イーサリアム仮想マシン(EVM)互換のスマートコントラクト用Cチェーン、バリデーターとサブネットワークを管理するPチェーンで構成されています。プロジェクトが独自ルールのブロックチェーンを立ち上げられる仕組みが特徴で、当初はサブネットと呼ばれ、現在はAvalanche L1と呼ばれています。AVAXの供給上限は7億2,000万枚で、取引手数料として支払われたAVAXはバーン(焼却)されます。"
    ],
    "applyH": "アバランチに指標を当てはめるときの注意",
    "apply": [
     "アバランチ画面のMVRV ZスコアはN/Aです。CoinMetricsのコミュニティAPIがAVAXのMVRVを提供していないためで、スコアは残り6指標に重みを配分し直して計算します。時価総額が保有者の平均取得単価を下回ったかどうかといったオンチェーンでの底判定は、この画面ではできません。",
     "恐怖・強欲の値はAlternative.meが出す市場全体の指数で、ビットコインの動きに大きく左右されます。アバランチのエコシステムだけで起きた好材料や悪材料はこの数字にほとんど表れないため、価格指標とあわせて確認してください。",
     "AVAXの取引開始は2020年9月で、価格の履歴はビットコインよりはるかに短く、高値から安値まで一巡した大きなサイクルは実質的に2021〜2022年の1回だけです。ビットコインの歴史から決めたマイヤー倍率の境界(0.8・2.4)をそのまま当てはめると、シグナルがずれることがあります。",
     "AVAXは2021年11月の高値から2022年末までに90%以上下落しました。下落率指標が「強い買い」の境界である−50%に達した後も、下げが長く続きうるということです。",
     "AVAXはステーキング報酬の発行や初期配分分のロック解除(アンロック)によって、流通量が時間とともに増えます。スコアは価格しか見ないため、こうした供給の変化は別途確認が必要です。"
    ],
    "histH": "アバランチの価格サイクル概要",
    "hist": [
     "2018年 — 「Team Rocket」と名乗る匿名の著者たちがアバランチ・コンセンサスの論文を公開し、同年に設立されたAva Labsがこれをもとに開発を始めました。",
     "2020年 — 7月の公開トークンセールを経て9月にメインネットを公開し、AVAXの取引所での取引が始まりました。",
     "2021年 — 8月にエコシステム向けインセンティブプログラム「Avalanche Rush」が発表された後に価格が大きく上昇し、11月に史上最高値をつけました。",
     "2022年 — 弱気相場の中、年末までに史上最高値から90%以上下落しました。",
     "2024年 — 12月のAvalanche9000アップグレードで、独自のL1チェーンを立ち上げる際のコスト構造が大きく変わりました。"
    ],
    "faq": [
     {
      "q": "画面の恐怖・強欲指数はアバランチが基準ですか?",
      "a": "いいえ。Alternative.meが毎日発表する暗号資産市場全体の心理指数で、ビットコインの比重が大きいものです。AVAX画面とBTC画面に同じ数字が出るのもこのためで、カード名に「市場全体」と付けて区別しています。"
     },
     {
      "q": "アバランチ画面でMVRVがN/Aになるのはなぜですか?",
      "a": "MVRVの計算には実現時価総額(保有者の平均取得単価)のデータが必要ですが、この画面が使うCoinMetricsのコミュニティAPIにはAVAXのMVRVがありません。推定値で埋めずにN/Aとし、合成スコアは残りの指標だけで重みを調整して計算します。同じ理由で、プレミアムのBOTTOM RADARの「今が底か」判定も保留になります。"
     },
     {
      "q": "ステーキングやAvalanche L1の活動もスコアに入りますか?",
      "a": "入りません。スコアに使うのは、AVAXの価格から計算する5つの指標と市場全体の恐怖・強欲指数だけです。ステーキング率、ネットワークの利用状況、トークンのアンロック予定などは反映されないため、必要に応じて別途確認してください。"
     },
     {
      "q": "AVAXはビットコインより値動きが大きいのに、同じ基準でいいのですか?",
      "a": "計算式はビットコインと同じなので、RSIの30/70やマイヤー倍率の0.8/2.4といった境界もそのままです。値動きの大きいコインは売られ過ぎ・買われ過ぎの領域により頻繁に、より長くとどまることがあるため、一つの指標の極端な値より、複数の指標が同じ方向を示しているかを見るほうが安全です。"
     },
     {
      "q": "今アバランチを買ってもいいですか?",
      "a": "買い・売りの指示はしていません。スコアが示すのは、各指標がいま売られ過ぎ・恐怖の側に集まっているのか、過熱の側に集まっているのかです。長期(逆張り)タブでは80以上がSTRONG BUY、25未満がOVERHEATEDの領域です。AVAXはMVRV抜きで計算されている点を踏まえ、参考程度にご覧ください。"
     }
    ]
   },
   "ko": {
    "title": "아발란체(AVAX) 매수 타이밍 점수 — MVRV 없이 읽는 지표 해석",
    "intro": "AVAX_SIGNAL은 아발란체 일봉 가격으로 RSI(14)·MACD(12·26·9)·마이어 배수·365일 고점 대비 낙폭·50/200 골든·데드 크로스를 계산하고, 암호화폐 시장 전체의 공포·탐욕 지수를 더해 0~100 매수 타이밍 점수로 합성합니다. 일곱 번째 지표인 MVRV Z-Score는 AVAX 데이터가 CoinMetrics 커뮤니티 API에 없어 N/A로 표시되며, 그만큼 나머지 지표에 가중치가 다시 배분됩니다. 오늘의 점수는 무료이고 설치 없이 바로 확인할 수 있습니다.",
    "coinH": "아발란체(AVAX)란?",
    "coinP": [
     "아발란체는 코넬대 교수 출신 에민 귄 시레르(Emin Gün Sirer) 등이 공동 창업한 Ava Labs가 개발해 2020년 9월 메인넷을 연 스마트 계약 플랫폼이고, AVAX는 그 네이티브 토큰입니다. 무작위로 고른 소수의 검증자에게 반복해 묻는 방식으로 빠르게 합의에 이르는 ‘아발란체 합의’를 지분증명(PoS)과 결합했으며, 검증자가 되려면 AVAX를 스테이킹해야 합니다.",
     "기본 네트워크는 자산 발행·전송용 X-체인, 이더리움 가상머신(EVM)과 호환되는 스마트 계약용 C-체인, 검증자와 하위 네트워크를 관리하는 P-체인으로 이뤄져 있습니다. 프로젝트가 자체 규칙의 블록체인을 띄울 수 있는 구조가 특징인데, 처음에는 ‘서브넷’이라 불렀고 지금은 ‘Avalanche L1’이라고 부릅니다. AVAX 최대 공급량은 7억 2,000만 개로 정해져 있고, 거래 수수료로 낸 AVAX는 소각됩니다."
    ],
    "applyH": "아발란체에 지표를 적용할 때",
    "apply": [
     "아발란체 화면의 MVRV Z-Score는 N/A입니다. CoinMetrics 커뮤니티 API가 AVAX의 MVRV를 제공하지 않기 때문이며, 점수는 나머지 6개 지표에 가중치를 다시 나눠 계산합니다. 시가총액이 보유자 평균 매수원가 아래로 내려갔는지 같은 온체인 바닥 판단은 이 화면에서 할 수 없습니다.",
     "공포·탐욕 값은 Alternative.me가 내는 시장 전체 지수로, 비트코인 흐름의 영향을 크게 받습니다. 아발란체 생태계에서만 생긴 호재나 악재는 이 숫자에 거의 드러나지 않으므로 가격 지표 쪽을 함께 확인하세요.",
     "AVAX는 2020년 9월부터 거래돼 가격 이력이 비트코인보다 훨씬 짧고, 고점에서 저점까지 완결된 큰 사이클은 사실상 2021~2022년 한 번뿐입니다. 비트코인 역사로 정한 마이어 배수 경계(0.8·2.4)를 그대로 대입하면 신호가 어긋날 수 있습니다.",
     "AVAX는 2021년 11월 고점에서 2022년 말까지 90% 넘게 하락했습니다. 낙폭 지표가 ‘강한 매수’ 경계인 -50%에 닿은 뒤에도 하락이 오래 이어질 수 있다는 뜻입니다.",
     "AVAX는 스테이킹 보상 발행과 초기 배분 물량의 잠금 해제(언락)로 유통량이 시간에 따라 늘어납니다. 점수는 가격만 보므로 이런 공급 변화는 따로 확인해야 합니다."
    ],
    "histH": "아발란체 가격 사이클 요약",
    "hist": [
     "2018년 — ‘Team Rocket’이라는 익명 저자들이 아발란체 합의 프로토콜 논문을 공개했고, 같은 해 설립된 Ava Labs가 이를 바탕으로 개발을 시작했습니다.",
     "2020년 — 7월 공개 토큰 판매를 거쳐 9월 메인넷을 열었고, 이때부터 AVAX가 거래소에서 거래되기 시작했습니다.",
     "2021년 — 8월 생태계 인센티브 프로그램 ‘Avalanche Rush’ 발표 뒤 가격이 크게 올라 11월에 사상 최고가를 기록했습니다.",
     "2022년 — 약세장 속에서 연말까지 사상 최고가 대비 90% 넘게 하락했습니다.",
     "2024년 — 12월 Avalanche9000 업그레이드로 자체 L1 체인을 띄우는 비용 구조가 크게 바뀌었습니다."
    ],
    "faq": [
     {
      "q": "화면의 공포·탐욕 지수는 아발란체 기준인가요?",
      "a": "아닙니다. Alternative.me가 매일 발표하는 암호화폐 시장 전체 심리 지수이며 비트코인 비중이 큽니다. AVAX 화면과 BTC 화면에 같은 숫자가 나오는 것도 이 때문이고, 카드 이름에 ‘시장 전체’를 붙여 구분합니다."
     },
     {
      "q": "아발란체 화면에서 MVRV가 N/A로 나오는 이유는 무엇인가요?",
      "a": "MVRV를 계산하려면 실현 시가총액(보유자 평균 매수원가) 데이터가 필요한데, 이 화면이 쓰는 CoinMetrics 커뮤니티 API에는 AVAX의 MVRV가 없습니다. 값을 추정해 채우지 않고 N/A로 두며, 합성 점수는 나머지 지표만으로 가중치를 맞춰 계산합니다. 프리미엄 BOTTOM RADAR의 ‘지금이 바닥인가’ 판정도 같은 이유로 보류됩니다."
     },
     {
      "q": "스테이킹이나 Avalanche L1 활동도 점수에 들어가나요?",
      "a": "들어가지 않습니다. 점수는 AVAX 가격으로 계산한 5개 지표와 시장 전체 공포·탐욕 지수만 씁니다. 스테이킹 비율, 네트워크 사용량, 토큰 언락 일정 같은 정보는 반영되지 않으니 필요하면 따로 확인하세요."
     },
     {
      "q": "AVAX는 비트코인보다 변동이 큰데 같은 기준을 써도 되나요?",
      "a": "계산식이 비트코인과 같아서 RSI 30/70, 마이어 배수 0.8/2.4 같은 경계선도 그대로입니다. 변동이 큰 코인은 과매도·과매수 구간에 더 자주, 더 오래 머물 수 있으므로 한 지표의 극단값보다 여러 지표가 같은 방향을 가리키는지를 보는 편이 안전합니다."
     },
     {
      "q": "지금 아발란체 사도 되나요?",
      "a": "사라거나 팔라는 답은 드리지 않습니다. 점수가 알려주는 것은 지표들이 지금 과매도·공포 쪽에 모였는지, 과열 쪽에 모였는지입니다. 장기(역발상) 탭 기준 80 이상은 STRONG BUY, 25 미만은 OVERHEATED 구간이며, AVAX는 MVRV가 빠진 채 계산된다는 점을 감안해 참고용으로만 보세요."
     }
    ]
   },
   "zh": {
    "title": "雪崩币(AVAX)买入时机评分——没有MVRV时如何解读指标",
    "intro": "AVAX_SIGNAL根据雪崩币的日线价格计算RSI(14)、MACD(12·26·9)、梅耶倍数、距365日高点的回撤以及50/200日均线金叉/死叉，再加上加密货币全市场的恐惧与贪婪指数，合成0–100的买入时机评分。第七项指标MVRV Z分数因CoinMetrics社区API没有AVAX数据而显示为N/A，其权重会重新分配给其余指标。今日评分免费，无需安装即可查看。",
    "coinH": "雪崩币(AVAX)是什么？",
    "coinP": [
     "Avalanche是由Ava Labs开发、2020年9月主网上线的智能合约平台，雪崩币(AVAX)是其原生代币；Ava Labs的联合创始人之一是前康奈尔大学教授埃明·居恩·西雷尔(Emin Gün Sirer)。它把“雪崩共识”与权益证明(PoS)结合在一起——雪崩共识通过反复向随机抽取的少量验证者询问来快速达成一致——验证者必须质押AVAX。",
     "其主网络由三条链组成：负责资产发行与转账的X链、兼容以太坊虚拟机(EVM)的智能合约链C链，以及管理验证者和子网络的P链。项目方可以按自己的规则启动独立区块链，这种链起初称为子网(Subnet)，现在称为Avalanche L1。AVAX的供应上限为7.2亿枚，作为交易手续费支付的AVAX会被销毁。"
    ],
    "applyH": "将指标用于雪崩币时的要点",
    "apply": [
     "雪崩币页面的MVRV Z分数显示为N/A。原因是CoinMetrics社区API不提供AVAX的MVRV，评分会把权重重新分配给其余6项指标。因此无法在本页进行链上底部判断，例如市值是否已跌破持有者的平均成本。",
     "恐惧与贪婪数值来自Alternative.me的全市场指数，很大程度上受比特币走势影响。只发生在Avalanche生态内的利好或利空几乎不会反映在这个数字上，请结合价格指标一起看。",
     "AVAX自2020年9月才开始交易，价格历史远短于比特币，从高点到低点走完的大周期实际上只有2021–2022年这一轮。直接套用根据比特币历史设定的梅耶倍数界线(0.8与2.4)，信号可能出现偏差。",
     "AVAX从2021年11月的高点到2022年底下跌超过90%。也就是说，即使回撤指标触及“强烈买入”界线−50%，下跌仍可能持续很久。",
     "随着质押奖励的发放和初始分配份额的解锁，AVAX的流通量会逐渐增加。评分只看价格，这类供应变化需要另行确认。"
    ],
    "histH": "雪崩币价格周期概览",
    "hist": [
     "2018年——自称“Team Rocket”的匿名作者发布了雪崩共识协议论文，同年成立的Ava Labs以此为基础开始开发。",
     "2020年——经过7月的公开代币销售，9月主网上线，AVAX开始在交易所交易。",
     "2021年——8月生态激励计划“Avalanche Rush”公布后价格大幅上涨，并于11月创下历史最高价。",
     "2022年——在熊市中，到年底已较历史最高价下跌超过90%。",
     "2024年——12月的Avalanche9000升级大幅改变了启动自有L1链的成本结构。"
    ],
    "faq": [
     {
      "q": "页面上的恐惧与贪婪指数是以雪崩币为准吗？",
      "a": "不是。它是Alternative.me每天发布的加密货币全市场情绪指数，比特币占比很大。AVAX页面和BTC页面显示相同数字也是这个原因，卡片名称中加了“全市场”以示区分。"
     },
     {
      "q": "为什么雪崩币页面的MVRV显示N/A？",
      "a": "计算MVRV需要已实现市值(持有者平均成本)数据，而本页使用的CoinMetrics社区API没有AVAX的MVRV。本页不会用估算值填补，而是显示N/A，并只用其余指标重新调整权重来计算综合评分。出于同样原因，高级版BOTTOM RADAR的“现在是否见底”判断也会暂缓给出。"
     },
     {
      "q": "质押或Avalanche L1的活动会计入评分吗？",
      "a": "不会。评分只使用由AVAX价格计算的5项指标和全市场恐惧与贪婪指数。质押率、网络使用情况、代币解锁时间表等都不在其中，如有需要请另行查看。"
     },
     {
      "q": "AVAX波动比比特币大，用同样的标准合适吗？",
      "a": "计算公式与比特币相同，因此RSI的30/70、梅耶倍数的0.8/2.4等界线也不变。波动大的币可能更频繁、更长时间地停留在超卖或超买区间，所以与其依据单一指标的极端值，不如看多项指标是否指向同一方向更稳妥。"
     },
     {
      "q": "现在可以买雪崩币吗？",
      "a": "我们不会告诉您买入或卖出。评分显示的是各项指标目前聚集在超卖、恐惧一侧，还是过热一侧。在长期(逆向)标签下，80分以上为STRONG BUY，低于25分为OVERHEATED。请注意AVAX的评分不含MVRV，仅作参考。"
     }
    ]
   },
   "zh-Hant": {
    "title": "雪崩幣(AVAX)買入時機評分——沒有MVRV時如何解讀指標",
    "intro": "AVAX_SIGNAL根據雪崩幣的日線價格計算RSI(14)、MACD(12·26·9)、梅耶倍數、距365日高點的回檔幅度以及50/200日均線黃金交叉/死亡交叉，再加上加密貨幣全市場的恐懼與貪婪指數，合成0–100的買入時機評分。第七項指標MVRV Z分數因CoinMetrics社群API沒有AVAX資料而顯示為N/A，其權重會重新分配給其餘指標。今日評分免費，不必安裝即可查看。",
    "coinH": "雪崩幣(AVAX)是什麼？",
    "coinP": [
     "Avalanche是由Ava Labs開發、2020年9月主網上線的智慧合約平台，雪崩幣(AVAX)是其原生代幣；Ava Labs的共同創辦人之一是前康乃爾大學教授埃明·居恩·西雷爾(Emin Gün Sirer)。它把「雪崩共識」與權益證明(PoS)結合在一起——雪崩共識透過反覆向隨機抽取的少數驗證者詢問來快速達成一致——驗證者必須質押AVAX。",
     "其主網路由三條鏈組成：負責資產發行與轉帳的X鏈、相容以太坊虛擬機(EVM)的智慧合約鏈C鏈，以及管理驗證者與子網路的P鏈。專案方可以依自己的規則啟動獨立區塊鏈，這種鏈最初稱為子網(Subnet)，現在稱為Avalanche L1。AVAX的供應上限為7.2億枚，作為交易手續費支付的AVAX會被銷毀。"
    ],
    "applyH": "將指標套用在雪崩幣時的重點",
    "apply": [
     "雪崩幣頁面的MVRV Z分數顯示為N/A。原因是CoinMetrics社群API不提供AVAX的MVRV，評分會把權重重新分配給其餘6項指標。因此無法在本頁進行鏈上底部判斷，例如市值是否已跌破持有者的平均成本。",
     "恐懼與貪婪數值來自Alternative.me的全市場指數，很大程度上受比特幣走勢影響。只發生在Avalanche生態系內的利多或利空幾乎不會反映在這個數字上，請搭配價格指標一起看。",
     "AVAX自2020年9月才開始交易，價格歷史遠短於比特幣，從高點到低點走完的大週期實際上只有2021–2022年這一輪。直接套用根據比特幣歷史設定的梅耶倍數界線(0.8與2.4)，訊號可能出現偏差。",
     "AVAX從2021年11月的高點到2022年底下跌超過90%。也就是說，即使回檔指標觸及「強烈買入」界線−50%，下跌仍可能持續很久。",
     "隨著質押獎勵的發放與初始分配額度的解鎖，AVAX的流通量會逐漸增加。評分只看價格，這類供給變化需要另行確認。"
    ],
    "histH": "雪崩幣價格週期概覽",
    "hist": [
     "2018年——自稱「Team Rocket」的匿名作者發表了雪崩共識協定論文，同年成立的Ava Labs以此為基礎開始開發。",
     "2020年——經過7月的公開代幣銷售，9月主網上線，AVAX開始在交易所交易。",
     "2021年——8月生態系激勵計畫「Avalanche Rush」公布後價格大幅上漲，並於11月創下歷史新高。",
     "2022年——在空頭市場中，到年底已較歷史新高下跌超過90%。",
     "2024年——12月的Avalanche9000升級大幅改變了啟動自有L1鏈的成本結構。"
    ],
    "faq": [
     {
      "q": "頁面上的恐懼與貪婪指數是以雪崩幣為準嗎？",
      "a": "不是。它是Alternative.me每天發布的加密貨幣全市場情緒指數，比特幣占比很大。AVAX頁面與BTC頁面顯示相同數字也是這個原因，卡片名稱中加上「全市場」以示區別。"
     },
     {
      "q": "為什麼雪崩幣頁面的MVRV顯示N/A？",
      "a": "計算MVRV需要已實現市值(持有者平均成本)資料，而本頁使用的CoinMetrics社群API沒有AVAX的MVRV。本頁不以估算值填補，而是顯示N/A，並只用其餘指標重新調整權重來計算綜合評分。基於同樣原因，進階版BOTTOM RADAR的「現在是否見底」判斷也會暫緩。"
     },
     {
      "q": "質押或Avalanche L1的活動會納入評分嗎？",
      "a": "不會。評分只使用由AVAX價格計算的5項指標與全市場恐懼與貪婪指數。質押率、網路使用情況、代幣解鎖時程等都不在其中，如有需要請另行查看。"
     },
     {
      "q": "AVAX波動比比特幣大，用同樣的標準適合嗎？",
      "a": "計算公式與比特幣相同，因此RSI的30/70、梅耶倍數的0.8/2.4等界線也不變。波動大的幣可能更頻繁、更長時間停留在超賣或超買區間，所以與其依據單一指標的極端值，不如看多項指標是否指向同一方向更穩妥。"
     },
     {
      "q": "現在可以買雪崩幣嗎？",
      "a": "我們不會告訴您買進或賣出。評分顯示的是各項指標目前聚集在超賣、恐懼一側，還是過熱一側。在長期(逆勢)分頁中，80分以上為STRONG BUY，低於25分為OVERHEATED。請注意AVAX的評分不含MVRV，僅供參考。"
     }
    ]
   },
   "th": {
    "title": "คะแนนจังหวะซื้ออาวาแลนช์ (AVAX) — อ่านตัวชี้วัดเมื่อไม่มี MVRV",
    "intro": "AVAX_SIGNAL คำนวณ RSI(14), MACD(12·26·9), Mayer Multiple, การย่อตัวจากจุดสูงสุดรอบ 365 วัน และสัญญาณ Golden/Death Cross ของเส้น 50/200 วัน จากราคารายวันของอาวาแลนช์ แล้วรวมกับดัชนีความกลัว-ความโลภของตลาดคริปโตทั้งหมดเป็นคะแนนจังหวะซื้อ 0–100 ตัวชี้วัดตัวที่เจ็ดคือ MVRV Z-Score จะแสดงเป็น N/A เพราะ CoinMetrics community API ไม่มีข้อมูล AVAX และน้ำหนักส่วนนั้นจะถูกกระจายให้ตัวชี้วัดที่เหลือ คะแนนของวันนี้ดูได้ฟรีทันทีโดยไม่ต้องติดตั้งอะไร",
    "coinH": "อาวาแลนช์ (AVAX) คืออะไร?",
    "coinP": [
     "อาวาแลนช์เป็นแพลตฟอร์มสมาร์ตคอนแทรกต์ที่พัฒนาโดย Ava Labs ซึ่งมีเอมิน กึน ซิเรอร์ (Emin Gün Sirer) อดีตศาสตราจารย์มหาวิทยาลัยคอร์เนลล์เป็นหนึ่งในผู้ร่วมก่อตั้ง เมนเน็ตเปิดในเดือนกันยายน 2020 และ AVAX คือโทเคนประจำเครือข่าย ระบบใช้ “ฉันทามติแบบอาวาแลนช์” ซึ่งได้ข้อตกลงอย่างรวดเร็วด้วยการสุ่มถามผู้ตรวจสอบกลุ่มเล็กๆ ซ้ำหลายรอบ ร่วมกับกลไกพิสูจน์การถือครอง (PoS) ผู้ที่จะเป็นผู้ตรวจสอบจึงต้องสเตก AVAX",
     "เครือข่ายหลักประกอบด้วย X-Chain สำหรับออกและโอนสินทรัพย์, C-Chain สำหรับสมาร์ตคอนแทรกต์ที่รองรับ Ethereum Virtual Machine (EVM) และ P-Chain ที่ดูแลผู้ตรวจสอบและเครือข่ายย่อย จุดเด่นคือโปรเจกต์สามารถเปิดบล็อกเชนของตัวเองตามกฎที่กำหนดเองได้ ซึ่งเดิมเรียกว่าซับเน็ต (subnet) และปัจจุบันเรียกว่า Avalanche L1 อุปทานของ AVAX ถูกจำกัดไว้ที่ 720 ล้านเหรียญ และ AVAX ที่จ่ายเป็นค่าธรรมเนียมธุรกรรมจะถูกเผาทิ้ง"
    ],
    "applyH": "ข้อควรรู้เมื่อใช้ตัวชี้วัดกับอาวาแลนช์",
    "apply": [
     "MVRV Z-Score บนหน้าจออาวาแลนช์เป็น N/A เพราะ CoinMetrics community API ไม่มี MVRV ของ AVAX คะแนนจึงกระจายน้ำหนักใหม่ให้ตัวชี้วัดอีก 6 ตัว การดูจุดต่ำสุดจากข้อมูลออนเชน เช่น มูลค่าตลาดลดลงต่ำกว่าต้นทุนเฉลี่ยของผู้ถือแล้วหรือยัง จึงทำไม่ได้ในหน้านี้",
     "ค่าความกลัว-ความโลภมาจากดัชนีของทั้งตลาดของ Alternative.me และได้รับอิทธิพลจากบิตคอยน์เป็นหลัก ข่าวดีหรือข่าวร้ายที่เกิดเฉพาะในระบบนิเวศของอาวาแลนช์แทบไม่ปรากฏในตัวเลขนี้ ควรดูควบคู่กับตัวชี้วัดราคา",
     "AVAX เริ่มซื้อขายเมื่อเดือนกันยายน 2020 ประวัติราคาจึงสั้นกว่าบิตคอยน์มาก และวัฏจักรใหญ่ที่ครบตั้งแต่ยอดถึงก้นมีเพียงรอบเดียวคือปี 2021–2022 หากนำเกณฑ์ Mayer Multiple (0.8 และ 2.4) ที่ตั้งจากประวัติบิตคอยน์มาใช้ตรงๆ สัญญาณอาจคลาดเคลื่อนได้",
     "AVAX ร่วงลงกว่า 90% จากจุดสูงสุดเดือนพฤศจิกายน 2021 จนถึงปลายปี 2022 หมายความว่าแม้ตัวชี้วัดการย่อตัวจะแตะเกณฑ์ “ซื้อแรง” ที่ −50% แล้ว ราคาก็ยังอาจลงต่อได้อีกนาน",
     "ปริมาณหมุนเวียนของ AVAX เพิ่มขึ้นตามเวลาจากการออกรางวัลสเตกกิ้งและการปลดล็อกโทเคนที่จัดสรรไว้ตั้งแต่แรก คะแนนดูแค่ราคา จึงต้องตรวจสอบการเปลี่ยนแปลงด้านอุปทานแยกต่างหาก"
    ],
    "histH": "สรุปวัฏจักรราคาอาวาแลนช์",
    "hist": [
     "2018 — ผู้เขียนนิรนามที่ใช้ชื่อ “Team Rocket” เผยแพร่เอกสารโปรโตคอลฉันทามติแบบอาวาแลนช์ และ Ava Labs ที่ก่อตั้งในปีเดียวกันได้เริ่มพัฒนาต่อจากงานนี้",
     "2020 — หลังการขายโทเคนสาธารณะในเดือนกรกฎาคม เมนเน็ตเปิดในเดือนกันยายน และ AVAX เริ่มซื้อขายบนกระดานเทรด",
     "2021 — หลังประกาศโครงการจูงใจระบบนิเวศ “Avalanche Rush” ในเดือนสิงหาคม ราคาพุ่งขึ้นแรงและทำจุดสูงสุดตลอดกาลในเดือนพฤศจิกายน",
     "2022 — ในตลาดขาลง ราคาร่วงลงกว่า 90% จากจุดสูงสุดตลอดกาลภายในปลายปี",
     "2024 — การอัปเกรด Avalanche9000 ในเดือนธันวาคมเปลี่ยนโครงสร้างต้นทุนในการเปิดเชน L1 ของตัวเองไปอย่างมาก"
    ],
    "faq": [
     {
      "q": "ดัชนีความกลัว-ความโลภบนหน้าจอนี้อิงอาวาแลนช์หรือไม่?",
      "a": "ไม่ใช่ เป็นดัชนีความรู้สึกของตลาดคริปโตทั้งหมดที่ Alternative.me เผยแพร่ทุกวัน โดยบิตคอยน์มีน้ำหนักมาก หน้าจอ AVAX กับ BTC จึงแสดงตัวเลขเดียวกัน และชื่อการ์ดมีคำว่า “ทั้งตลาด” กำกับไว้"
     },
     {
      "q": "ทำไม MVRV บนหน้าจออาวาแลนช์จึงเป็น N/A?",
      "a": "การคำนวณ MVRV ต้องใช้ข้อมูลมูลค่าที่รับรู้แล้ว (ต้นทุนเฉลี่ยของผู้ถือ) แต่ CoinMetrics community API ที่หน้านี้ใช้ไม่มี MVRV ของ AVAX หน้านี้จึงไม่เติมค่าประมาณ แต่แสดง N/A และปรับน้ำหนักคะแนนรวมจากตัวชี้วัดที่เหลือ ด้วยเหตุผลเดียวกัน ผลตัดสิน “ตอนนี้คือก้นหรือยัง” ของ BOTTOM RADAR (พรีเมียม) ก็จะถูกระงับไว้"
     },
     {
      "q": "การสเตกหรือกิจกรรมบน Avalanche L1 ถูกนับรวมในคะแนนหรือไม่?",
      "a": "ไม่ คะแนนใช้เพียงตัวชี้วัด 5 ตัวที่คำนวณจากราคา AVAX กับดัชนีความกลัว-ความโลภของทั้งตลาด อัตราการสเตก การใช้งานเครือข่าย และตารางปลดล็อกโทเคนไม่ได้รวมอยู่ หากสำคัญสำหรับคุณควรตรวจสอบแยกต่างหาก"
     },
     {
      "q": "AVAX ผันผวนกว่าบิตคอยน์ ใช้เกณฑ์เดียวกันได้หรือ?",
      "a": "สูตรคำนวณเหมือนกับบิตคอยน์ เส้นแบ่งอย่าง RSI 30/70 และ Mayer Multiple 0.8/2.4 จึงไม่เปลี่ยน เหรียญที่ผันผวนสูงอาจอยู่ในโซนขายมากเกินไปหรือซื้อมากเกินไปบ่อยกว่าและนานกว่า การดูว่าตัวชี้วัดหลายตัวชี้ไปทางเดียวกันหรือไม่จึงปลอดภัยกว่าการยึดค่าสุดขั้วของตัวชี้วัดเดียว"
     },
     {
      "q": "ตอนนี้ซื้ออาวาแลนช์ดีไหม?",
      "a": "เราไม่บอกให้ซื้อหรือขาย สิ่งที่คะแนนบอกคือตอนนี้ตัวชี้วัดส่วนใหญ่รวมตัวอยู่ฝั่งขายมากเกินไปและความกลัว หรือฝั่งร้อนแรงเกินไป ในแท็บระยะยาว (สวนกระแส) ตั้งแต่ 80 ขึ้นไปคือ STRONG BUY และต่ำกว่า 25 คือ OVERHEATED ทั้งนี้ AVAX ถูกคำนวณโดยไม่มี MVRV จึงควรใช้เป็นข้อมูลอ้างอิงเท่านั้น"
     }
    ]
   },
   "es": {
    "title": "Puntuación de compra de Avalanche (AVAX): cómo leer los indicadores sin MVRV",
    "intro": "AVAX_SIGNAL calcula el RSI(14), el MACD(12·26·9), el múltiplo de Mayer, la caída desde el máximo de 365 días y el cruce dorado/de la muerte de 50/200 días a partir de los precios diarios de Avalanche, y añade el índice de miedo y codicia de todo el mercado cripto para formar una puntuación de compra de 0 a 100. El séptimo indicador, el MVRV Z-Score, aparece como N/A porque la API comunitaria de CoinMetrics no tiene datos de AVAX, y su peso se reparte entre los demás. La puntuación de hoy es gratuita y se consulta al instante, sin instalar nada.",
    "coinH": "¿Qué es Avalanche (AVAX)?",
    "coinP": [
     "Avalanche es una plataforma de contratos inteligentes desarrollada por Ava Labs, entre cuyos cofundadores está Emin Gün Sirer, exprofesor de la Universidad Cornell; su red principal se lanzó en septiembre de 2020 y AVAX es su token nativo. Combina el protocolo de consenso Avalanche —que llega a un acuerdo rápido consultando repetidamente a pequeñas muestras aleatorias de validadores— con la prueba de participación, por lo que los validadores deben hacer staking de AVAX.",
     "La red principal se compone de la X-Chain, para crear y transferir activos; la C-Chain, para contratos inteligentes compatibles con la máquina virtual de Ethereum (EVM), y la P-Chain, que gestiona los validadores y las subredes. Su rasgo distintivo es que cualquier proyecto puede lanzar su propia blockchain con reglas propias: al principio se llamaban subnets y hoy se denominan Avalanche L1. El suministro de AVAX tiene un tope de 720 millones, y los AVAX pagados como comisiones se queman."
    ],
    "applyH": "Cómo leer los indicadores en Avalanche",
    "apply": [
     "En la pantalla de Avalanche, el MVRV Z-Score aparece como N/A. La API comunitaria de CoinMetrics no ofrece el MVRV de AVAX, así que la puntuación reparte los pesos entre los otros seis indicadores. Aquí no es posible hacer comprobaciones on-chain de suelo, como saber si la capitalización ha caído por debajo del coste medio de los tenedores.",
     "El valor de miedo y codicia es el índice de todo el mercado de Alternative.me y depende en gran medida de Bitcoin. Las noticias que solo afectan al ecosistema de Avalanche apenas se notan en esa cifra, así que conviene leerla junto con los indicadores de precio.",
     "AVAX cotiza solo desde septiembre de 2020, por lo que su historial de precios es mucho más corto que el de Bitcoin y, en la práctica, solo ha completado un gran ciclo de subida y caída (2021-2022). Aplicar tal cual los umbrales del múltiplo de Mayer (0,8 y 2,4), fijados a partir de la historia de Bitcoin, puede dar señales engañosas.",
     "Desde su máximo de noviembre de 2021, AVAX cayó más de un 90 % hasta finales de 2022. Es decir, la caída puede prolongarse mucho después de que el indicador llegue al umbral de «compra fuerte» del −50 %.",
     "La oferta en circulación de AVAX crece con el tiempo a medida que se emiten recompensas de staking y se desbloquean tokens de la asignación inicial. La puntuación solo mira el precio, así que esos cambios de oferta hay que revisarlos aparte."
    ],
    "histH": "Ciclos de precio de Avalanche en resumen",
    "hist": [
     "2018 — Unos autores anónimos que firmaban como «Team Rocket» publicaron el artículo del protocolo de consenso Avalanche, y Ava Labs, fundada ese mismo año, empezó a desarrollarlo.",
     "2020 — Tras una venta pública de tokens en julio, la red principal se lanzó en septiembre y AVAX empezó a cotizar en los exchanges.",
     "2021 — Después del anuncio en agosto de «Avalanche Rush», un programa de incentivos para el ecosistema, el precio subió con fuerza y marcó su máximo histórico en noviembre.",
     "2022 — En el mercado bajista, a final de año había caído más de un 90 % desde ese máximo histórico.",
     "2024 — La actualización Avalanche9000 de diciembre cambió de forma notable el coste de lanzar una cadena L1 propia."
    ],
    "faq": [
     {
      "q": "¿El índice de miedo y codicia de esta pantalla se basa en Avalanche?",
      "a": "No. Es el índice de sentimiento de todo el mercado cripto que Alternative.me publica cada día, con un gran peso de Bitcoin. Por eso las pantallas de AVAX y BTC muestran la misma cifra; el nombre de la tarjeta incluye «todo el mercado» para dejarlo claro."
     },
     {
      "q": "¿Por qué el MVRV aparece como N/A en la pantalla de Avalanche?",
      "a": "El MVRV necesita datos de capitalización realizada (el coste medio de los tenedores), y la API comunitaria de CoinMetrics que usa esta página no tiene MVRV de AVAX. En lugar de estimar un valor, la página muestra N/A y reequilibra la puntuación con los indicadores restantes. Por la misma razón, el veredicto «¿es este el suelo?» de BOTTOM RADAR (premium) queda en suspenso."
     },
     {
      "q": "¿Cuentan el staking o la actividad de Avalanche L1 en la puntuación?",
      "a": "No. La puntuación usa solo cinco indicadores calculados con el precio de AVAX y el índice de miedo y codicia de todo el mercado. La tasa de staking, el uso de la red o el calendario de desbloqueos no se incluyen; si te importan, revísalos por separado."
     },
     {
      "q": "AVAX es más volátil que Bitcoin: ¿sirven los mismos umbrales?",
      "a": "Las fórmulas son las mismas que para Bitcoin, así que los límites —RSI 30/70, múltiplo de Mayer 0,8/2,4— no cambian. Una moneda más volátil puede quedarse en sobreventa o sobrecompra con más frecuencia y durante más tiempo, por lo que es más prudente comprobar si varios indicadores coinciden que actuar por una sola lectura extrema."
     },
     {
      "q": "¿Debo comprar Avalanche ahora?",
      "a": "No te decimos que compres ni que vendas. Lo que muestra la puntuación es si los indicadores se agrupan ahora en el lado de sobreventa y miedo o en el de sobrecalentamiento. En la pestaña de largo plazo (contraria), 80 o más es STRONG BUY y menos de 25 es OVERHEATED; ten en cuenta que AVAX se puntúa sin MVRV y toma el resultado solo como referencia."
     }
    ]
   },
   "fr": {
    "title": "Score d'achat Avalanche (AVAX) : lire les indicateurs sans MVRV",
    "intro": "AVAX_SIGNAL calcule le RSI(14), le MACD(12·26·9), le multiple de Mayer, le repli depuis le plus haut sur 365 jours et le croisement doré ou de la mort des moyennes 50/200 jours à partir des cours journaliers d'Avalanche, puis ajoute l'indice de peur et d'avidité de l'ensemble du marché crypto pour former un score d'achat de 0 à 100. Le septième indicateur, le MVRV Z-Score, s'affiche N/A car l'API communautaire de CoinMetrics ne contient pas de données AVAX ; son poids est redistribué entre les autres indicateurs. Le score du jour est gratuit et consultable immédiatement, sans rien installer.",
    "coinH": "Qu'est-ce qu'Avalanche (AVAX) ?",
    "coinP": [
     "Avalanche est une plateforme de contrats intelligents développée par Ava Labs, dont Emin Gün Sirer, ancien professeur à l'université Cornell, est l'un des cofondateurs ; son réseau principal a été lancé en septembre 2020 et AVAX en est le jeton natif. Elle associe le protocole de consensus Avalanche — qui parvient vite à un accord en interrogeant à répétition de petits échantillons aléatoires de validateurs — à la preuve d'enjeu : les validateurs doivent donc staker des AVAX.",
     "Le réseau principal comprend la X-Chain, pour créer et transférer des actifs, la C-Chain, pour les contrats intelligents compatibles avec la machine virtuelle d'Ethereum (EVM), et la P-Chain, qui gère les validateurs et les sous-réseaux. Sa particularité : chaque projet peut lancer sa propre blockchain avec ses propres règles — d'abord appelées subnets, aujourd'hui Avalanche L1. L'offre d'AVAX est plafonnée à 720 millions, et les AVAX payés en frais de transaction sont brûlés."
    ],
    "applyH": "Lire les indicateurs sur Avalanche",
    "apply": [
     "Sur l'écran Avalanche, le MVRV Z-Score est N/A. L'API communautaire de CoinMetrics ne fournit pas le MVRV d'AVAX : le score redistribue donc les poids entre les six autres indicateurs. Les repérages de creux on-chain — savoir par exemple si la capitalisation est passée sous le coût moyen des détenteurs — sont impossibles ici.",
     "La valeur de peur et d'avidité provient de l'indice global d'Alternative.me et dépend surtout de Bitcoin. Une nouvelle qui ne touche que l'écosystème Avalanche s'y voit à peine : lisez-la avec les indicateurs de prix.",
     "AVAX n'est coté que depuis septembre 2020 : son historique de prix est bien plus court que celui de Bitcoin et ne compte, en pratique, qu'un seul grand cycle complet de hausse et de baisse (2021-2022). Appliquer tels quels les seuils du multiple de Mayer (0,8 et 2,4), fixés d'après l'historique de Bitcoin, peut fausser les signaux.",
     "Depuis son sommet de novembre 2021, AVAX a perdu plus de 90 % jusqu'à fin 2022. Autrement dit, la baisse peut se poursuivre longtemps après que l'indicateur de repli a touché son seuil « achat fort » de −50 %.",
     "L'offre en circulation d'AVAX augmente avec le temps, au gré des récompenses de staking émises et des déblocages de jetons de l'allocation initiale. Le score ne regarde que le prix : ces variations d'offre sont à vérifier à part."
    ],
    "histH": "Les cycles de prix d'Avalanche en bref",
    "hist": [
     "2018 — Des auteurs anonymes signant « Team Rocket » publient l'article sur le protocole de consensus Avalanche ; Ava Labs, fondée la même année, commence à le développer.",
     "2020 — Après une vente publique de jetons en juillet, lancement du réseau principal en septembre et début de la cotation d'AVAX sur les plateformes d'échange.",
     "2021 — Après l'annonce en août d'« Avalanche Rush », un programme d'incitations pour l'écosystème, le cours grimpe fortement et atteint son plus haut historique en novembre.",
     "2022 — Dans le marché baissier, recul de plus de 90 % depuis ce plus haut historique à la fin de l'année.",
     "2024 — La mise à niveau Avalanche9000 de décembre modifie nettement le coût de lancement d'une chaîne L1 propre."
    ],
    "faq": [
     {
      "q": "L'indice de peur et d'avidité de cet écran est-il calculé pour Avalanche ?",
      "a": "Non. C'est l'indice de sentiment de l'ensemble du marché crypto qu'Alternative.me publie chaque jour, où Bitcoin pèse lourd. C'est pour cela que les écrans AVAX et BTC affichent le même chiffre ; le nom de la carte précise « marché global »."
     },
     {
      "q": "Pourquoi le MVRV affiche-t-il N/A sur l'écran Avalanche ?",
      "a": "Le MVRV nécessite des données de capitalisation réalisée (le coût moyen des détenteurs), et l'API communautaire de CoinMetrics utilisée par cette page n'a pas de MVRV pour AVAX. Plutôt que d'estimer une valeur, la page affiche N/A et rééquilibre le score avec les indicateurs restants. Pour la même raison, le verdict « est-ce le creux ? » de BOTTOM RADAR (premium) est suspendu."
     },
     {
      "q": "Le staking ou l'activité des Avalanche L1 comptent-ils dans le score ?",
      "a": "Non. Le score n'utilise que cinq indicateurs calculés sur le prix d'AVAX et l'indice de peur et d'avidité global. Le taux de staking, l'utilisation du réseau ou le calendrier de déblocage des jetons n'y figurent pas ; vérifiez-les à part s'ils comptent pour vous."
     },
     {
      "q": "AVAX est plus volatil que Bitcoin : les mêmes seuils s'appliquent-ils ?",
      "a": "Les formules sont celles de Bitcoin, donc les bornes — RSI 30/70, multiple de Mayer 0,8/2,4 — restent identiques. Une crypto plus volatile peut rester en survente ou en surachat plus souvent et plus longtemps : mieux vaut vérifier que plusieurs indicateurs concordent que réagir à une seule valeur extrême."
     },
     {
      "q": "Faut-il acheter de l'Avalanche maintenant ?",
      "a": "Nous ne vous disons ni d'acheter ni de vendre. Le score indique si les indicateurs se regroupent en ce moment du côté survente et peur ou du côté surchauffe. Dans l'onglet long terme (contrarien), 80 et plus correspond à STRONG BUY et moins de 25 à OVERHEATED ; gardez à l'esprit qu'AVAX est noté sans MVRV et prenez le résultat comme simple repère."
     }
    ]
   },
   "de": {
    "title": "Avalanche (AVAX) Kaufzeitpunkt-Score: Indikatoren ohne MVRV richtig lesen",
    "intro": "AVAX_SIGNAL berechnet aus den Tageskursen von Avalanche den RSI(14), den MACD(12·26·9), das Mayer-Multiple, den Rückgang vom 365-Tage-Hoch und das Golden/Death Cross der 50/200-Tage-Linien und nimmt den marktweiten Angst- & Gier-Index hinzu, um einen Kaufzeitpunkt-Score von 0 bis 100 zu bilden. Der siebte Indikator, der MVRV-Z-Score, steht auf N/A, weil die Community-API von CoinMetrics keine AVAX-Daten enthält; sein Gewicht wird auf die übrigen Indikatoren verteilt. Der heutige Score ist kostenlos und sofort abrufbar, ganz ohne Installation.",
    "coinH": "Was ist Avalanche (AVAX)?",
    "coinP": [
     "Avalanche ist eine Smart-Contract-Plattform von Ava Labs, das unter anderem der frühere Cornell-Professor Emin Gün Sirer mitgegründet hat; das Mainnet startete im September 2020, AVAX ist der native Token. Die Plattform kombiniert das Avalanche-Konsensprotokoll – es erzielt rasch Einigkeit, indem es wiederholt kleine, zufällig gewählte Gruppen von Validatoren befragt – mit Proof of Stake; Validatoren müssen daher AVAX staken.",
     "Das Primärnetz besteht aus der X-Chain zum Erstellen und Übertragen von Assets, der C-Chain für Smart Contracts, die mit der Ethereum Virtual Machine (EVM) kompatibel sind, und der P-Chain, die Validatoren und Teilnetze verwaltet. Besonders ist, dass Projekte eigene Blockchains mit eigenen Regeln starten können – anfangs Subnets genannt, heute Avalanche L1. Das AVAX-Angebot ist auf 720 Millionen begrenzt, und als Transaktionsgebühr gezahlte AVAX werden verbrannt."
    ],
    "applyH": "Indikatoren bei Avalanche richtig lesen",
    "apply": [
     "In der Avalanche-Ansicht steht der MVRV-Z-Score auf N/A. Die Community-API von CoinMetrics liefert kein MVRV für AVAX, deshalb verteilt der Score die Gewichte auf die anderen sechs Indikatoren. On-Chain-Bodenprüfungen – etwa ob die Marktkapitalisierung unter den durchschnittlichen Einstand der Halter gefallen ist – sind hier nicht möglich.",
     "Der Angst- & Gier-Wert stammt aus dem marktweiten Index von Alternative.me und hängt stark von Bitcoin ab. Nachrichten, die nur das Avalanche-Ökosystem betreffen, schlagen sich darin kaum nieder; lesen Sie ihn daher zusammen mit den Preisindikatoren.",
     "AVAX wird erst seit September 2020 gehandelt. Die Kurshistorie ist daher viel kürzer als die von Bitcoin und umfasst praktisch nur einen vollständigen großen Zyklus (2021–2022). Wer die aus der Bitcoin-Geschichte abgeleiteten Mayer-Multiple-Grenzen (0,8 und 2,4) unverändert anwendet, kann irreführende Signale erhalten.",
     "Vom Hoch im November 2021 bis Ende 2022 fiel AVAX um mehr als 90 %. Der Abwärtstrend kann also noch lange anhalten, nachdem der Rückgangsindikator seine „Starker Kauf“-Schwelle von −50 % erreicht hat.",
     "Das umlaufende AVAX-Angebot wächst mit der Zeit, weil Staking-Belohnungen ausgegeben und Token aus der Anfangsverteilung freigegeben werden. Der Score betrachtet nur den Kurs – solche Angebotsänderungen müssen Sie gesondert prüfen."
    ],
    "histH": "Avalanches Preiszyklen im Überblick",
    "hist": [
     "2018 – Anonyme Autoren unter dem Namen „Team Rocket“ veröffentlichten das Paper zum Avalanche-Konsensprotokoll; das im selben Jahr gegründete Ava Labs begann darauf aufzubauen.",
     "2020 – Nach einem öffentlichen Token-Verkauf im Juli startete im September das Mainnet, und AVAX wurde an Börsen handelbar.",
     "2021 – Nach der Ankündigung des Ökosystem-Anreizprogramms „Avalanche Rush“ im August stieg der Kurs kräftig und erreichte im November ein Allzeithoch.",
     "2022 – Im Bärenmarkt lag der Kurs zum Jahresende mehr als 90 % unter diesem Allzeithoch.",
     "2024 – Das Avalanche9000-Upgrade im Dezember veränderte die Kosten für den Start einer eigenen L1-Chain deutlich."
    ],
    "faq": [
     {
      "q": "Bezieht sich der Angst- & Gier-Index in dieser Ansicht auf Avalanche?",
      "a": "Nein. Es ist der marktweite Krypto-Stimmungsindex, den Alternative.me täglich veröffentlicht, mit hohem Bitcoin-Gewicht. Darum zeigen die AVAX- und die BTC-Ansicht dieselbe Zahl; der Kartenname enthält zur Klarstellung „marktweit“."
     },
     {
      "q": "Warum zeigt MVRV in der Avalanche-Ansicht N/A?",
      "a": "Für MVRV braucht man Daten zur Realized Cap (dem durchschnittlichen Einstand der Halter), und die hier genutzte Community-API von CoinMetrics enthält kein MVRV für AVAX. Statt einen Wert zu schätzen, zeigt die Seite N/A und gewichtet den Gesamtscore mit den übrigen Indikatoren neu. Aus demselben Grund bleibt das Urteil „Ist das der Boden?“ im Premium-Bereich BOTTOM RADAR ausgesetzt."
     },
     {
      "q": "Zählen Staking oder Aktivität auf Avalanche L1 für den Score?",
      "a": "Nein. Der Score nutzt nur fünf aus dem AVAX-Kurs berechnete Indikatoren und den marktweiten Angst- & Gier-Index. Staking-Quote, Netzwerknutzung und Freigabepläne für Token fließen nicht ein; prüfen Sie diese bei Bedarf separat."
     },
     {
      "q": "AVAX schwankt stärker als Bitcoin – gelten trotzdem dieselben Schwellen?",
      "a": "Die Formeln entsprechen denen für Bitcoin, die Grenzen – RSI 30/70, Mayer-Multiple 0,8/2,4 – bleiben also gleich. Eine volatilere Kryptowährung kann häufiger und länger überverkauft oder überkauft bleiben. Sicherer ist es daher zu prüfen, ob mehrere Indikatoren übereinstimmen, statt auf einen einzelnen Extremwert zu reagieren."
     },
     {
      "q": "Sollte ich jetzt Avalanche kaufen?",
      "a": "Wir sagen Ihnen nicht, ob Sie kaufen oder verkaufen sollen. Der Score zeigt, ob sich die Indikatoren gerade auf der Seite von Überverkauf und Angst oder auf der Seite der Überhitzung sammeln. Im Langfrist-Tab (antizyklisch) bedeuten 80 und mehr STRONG BUY, unter 25 OVERHEATED. Bedenken Sie, dass AVAX ohne MVRV bewertet wird, und nutzen Sie das Ergebnis nur als Orientierung."
     }
    ]
   },
   "it": {
    "title": "Punteggio d'acquisto Avalanche (AVAX): leggere gli indicatori senza MVRV",
    "intro": "AVAX_SIGNAL calcola RSI(14), MACD(12·26·9), multiplo di Mayer, calo dal massimo a 365 giorni e golden/death cross delle medie a 50/200 giorni dai prezzi giornalieri di Avalanche, poi aggiunge l'indice di paura e avidità dell'intero mercato cripto per ottenere un punteggio d'acquisto da 0 a 100. Il settimo indicatore, l'MVRV Z-Score, risulta N/A perché l'API community di CoinMetrics non contiene dati su AVAX, e il suo peso viene ridistribuito sugli altri. Il punteggio di oggi è gratuito e si consulta subito, senza installare nulla.",
    "coinH": "Che cos'è Avalanche (AVAX)?",
    "coinP": [
     "Avalanche è una piattaforma di smart contract sviluppata da Ava Labs, cofondata tra gli altri da Emin Gün Sirer, ex professore della Cornell University; la mainnet è partita nel settembre 2020 e AVAX ne è il token nativo. Combina il protocollo di consenso Avalanche, che raggiunge rapidamente l'accordo interrogando più volte piccoli campioni casuali di validatori, con la proof of stake: per diventare validatori bisogna quindi mettere in staking AVAX.",
     "La rete primaria comprende la X-Chain, per creare e trasferire asset, la C-Chain, per smart contract compatibili con la Ethereum Virtual Machine (EVM), e la P-Chain, che gestisce validatori e sottoreti. La particolarità è che ogni progetto può avviare una propria blockchain con regole proprie: all'inizio si chiamavano subnet, oggi Avalanche L1. L'offerta di AVAX ha un tetto di 720 milioni e gli AVAX pagati come commissioni di transazione vengono bruciati."
    ],
    "applyH": "Come leggere gli indicatori su Avalanche",
    "apply": [
     "Nella schermata di Avalanche l'MVRV Z-Score è N/A. L'API community di CoinMetrics non fornisce l'MVRV di AVAX, quindi il punteggio ridistribuisce i pesi sugli altri sei indicatori. Qui non sono possibili verifiche on-chain del minimo, come capire se la capitalizzazione è scesa sotto il costo medio dei detentori.",
     "Il valore di paura e avidità è l'indice di mercato di Alternative.me e dipende in gran parte da Bitcoin. Le notizie che riguardano solo l'ecosistema Avalanche si vedono appena in quel numero: conviene leggerlo insieme agli indicatori di prezzo.",
     "AVAX è scambiato solo da settembre 2020, quindi il suo storico dei prezzi è molto più breve di quello di Bitcoin e comprende, di fatto, un solo grande ciclo completo di rialzo e ribasso (2021-2022). Applicare così come sono le soglie del multiplo di Mayer (0,8 e 2,4), fissate sulla storia di Bitcoin, può produrre segnali fuorvianti.",
     "Dal massimo di novembre 2021, AVAX ha perso oltre il 90% entro la fine del 2022. In altre parole, il ribasso può proseguire a lungo anche dopo che l'indicatore del calo ha toccato la soglia di «acquisto forte» del −50%.",
     "L'offerta circolante di AVAX cresce nel tempo con l'emissione delle ricompense di staking e lo sblocco dei token dell'allocazione iniziale. Il punteggio guarda solo il prezzo, quindi questi cambiamenti dell'offerta vanno verificati a parte."
    ],
    "histH": "I cicli di prezzo di Avalanche in sintesi",
    "hist": [
     "2018 — Autori anonimi con lo pseudonimo «Team Rocket» pubblicano il paper sul protocollo di consenso Avalanche; Ava Labs, fondata lo stesso anno, inizia a svilupparlo.",
     "2020 — Dopo una vendita pubblica di token a luglio, la mainnet parte a settembre e AVAX inizia a essere scambiato sugli exchange.",
     "2021 — Dopo l'annuncio ad agosto di «Avalanche Rush», un programma di incentivi per l'ecosistema, il prezzo sale con forza e tocca il massimo storico a novembre.",
     "2022 — Nel mercato ribassista, a fine anno il calo dal massimo storico supera il 90%.",
     "2024 — L'aggiornamento Avalanche9000 di dicembre cambia in modo netto i costi per avviare una propria chain L1."
    ],
    "faq": [
     {
      "q": "L'indice di paura e avidità di questa schermata si basa su Avalanche?",
      "a": "No. È l'indice di sentiment dell'intero mercato cripto che Alternative.me pubblica ogni giorno, con un forte peso di Bitcoin. Per questo le schermate AVAX e BTC mostrano lo stesso numero; il nome della scheda include «mercato complessivo» per chiarirlo."
     },
     {
      "q": "Perché l'MVRV risulta N/A nella schermata di Avalanche?",
      "a": "L'MVRV richiede dati sulla capitalizzazione realizzata (il costo medio dei detentori) e l'API community di CoinMetrics usata da questa pagina non ha l'MVRV di AVAX. Invece di stimare un valore, la pagina mostra N/A e ribilancia il punteggio sugli indicatori rimanenti. Per lo stesso motivo il verdetto «è questo il minimo?» di BOTTOM RADAR (premium) resta sospeso."
     },
     {
      "q": "Lo staking o l'attività su Avalanche L1 contano nel punteggio?",
      "a": "No. Il punteggio usa solo cinque indicatori calcolati sul prezzo di AVAX e l'indice di paura e avidità di mercato. Tasso di staking, utilizzo della rete e calendario degli sblocchi non sono inclusi: se ti interessano, controllali a parte."
     },
     {
      "q": "AVAX è più volatile di Bitcoin: valgono le stesse soglie?",
      "a": "Le formule sono le stesse di Bitcoin, quindi i limiti (RSI 30/70, multiplo di Mayer 0,8/2,4) non cambiano. Una moneta più volatile può restare in ipervenduto o ipercomprato più spesso e più a lungo: è più prudente verificare se più indicatori concordano che reagire a un singolo valore estremo."
     },
     {
      "q": "Conviene comprare Avalanche adesso?",
      "a": "Non ti diciamo di comprare o di vendere. Il punteggio mostra se gli indicatori si stanno raggruppando sul lato di ipervenduto e paura o su quello del surriscaldamento. Nella scheda di lungo periodo (contrarian), da 80 in su è STRONG BUY e sotto 25 è OVERHEATED; tieni presente che AVAX viene valutato senza MVRV e considera il risultato solo un riferimento."
     }
    ]
   },
   "pt": {
    "title": "Pontuação de compra da Avalanche (AVAX): ler os indicadores sem MVRV",
    "intro": "O AVAX_SIGNAL calcula o RSI(14), o MACD(12·26·9), o múltiplo de Mayer, a queda desde o máximo de 365 dias e o cruzamento dourado/da morte das médias de 50/200 dias a partir dos preços diários da Avalanche, e acrescenta o índice de medo e ganância de todo o mercado cripto para formar uma pontuação de compra de 0 a 100. O sétimo indicador, o MVRV Z-Score, surge como N/A porque a API comunitária da CoinMetrics não tem dados da AVAX, e o seu peso é redistribuído pelos restantes. A pontuação de hoje é gratuita e pode ser consultada de imediato, sem instalar nada.",
    "coinH": "O que é a Avalanche (AVAX)?",
    "coinP": [
     "A Avalanche é uma plataforma de contratos inteligentes desenvolvida pela Ava Labs, que tem entre os cofundadores Emin Gün Sirer, antigo professor da Universidade Cornell; a rede principal foi lançada em setembro de 2020 e a AVAX é o seu token nativo. Combina o protocolo de consenso Avalanche — que chega rapidamente a acordo consultando repetidamente pequenas amostras aleatórias de validadores — com a prova de participação, pelo que os validadores têm de fazer staking de AVAX.",
     "A rede principal é composta pela X-Chain, para criar e transferir ativos, pela C-Chain, para contratos inteligentes compatíveis com a máquina virtual da Ethereum (EVM), e pela P-Chain, que gere os validadores e as sub-redes. A grande particularidade é que qualquer projeto pode lançar a sua própria blockchain com regras próprias: começaram por chamar-se subnets e hoje chamam-se Avalanche L1. A oferta de AVAX tem um teto de 720 milhões, e as AVAX pagas como taxas de transação são queimadas."
    ],
    "applyH": "Como ler os indicadores na Avalanche",
    "apply": [
     "No ecrã da Avalanche, o MVRV Z-Score aparece como N/A. A API comunitária da CoinMetrics não fornece o MVRV da AVAX, pelo que a pontuação redistribui os pesos pelos outros seis indicadores. Aqui não é possível fazer verificações on-chain de fundo, como saber se a capitalização desceu abaixo do custo médio dos detentores.",
     "O valor de medo e ganância é o índice global da Alternative.me e depende muito da Bitcoin. Notícias que só afetam o ecossistema Avalanche quase não se notam nesse número, por isso convém lê-lo em conjunto com os indicadores de preço.",
     "A AVAX só é negociada desde setembro de 2020, pelo que o seu histórico de preços é muito mais curto do que o da Bitcoin e inclui, na prática, apenas um grande ciclo completo de subida e descida (2021-2022). Aplicar tal e qual os limiares do múltiplo de Mayer (0,8 e 2,4), definidos a partir do histórico da Bitcoin, pode gerar sinais enganadores.",
     "Desde o máximo de novembro de 2021, a AVAX caiu mais de 90% até ao final de 2022. Ou seja, a descida pode prolongar-se muito depois de o indicador de queda atingir o limiar de «compra forte» de −50%.",
     "A oferta em circulação da AVAX cresce ao longo do tempo com a emissão de recompensas de staking e o desbloqueio de tokens da alocação inicial. A pontuação só olha para o preço, por isso estas alterações de oferta devem ser verificadas à parte."
    ],
    "histH": "Resumo dos ciclos de preço da Avalanche",
    "hist": [
     "2018 — Autores anónimos que assinavam «Team Rocket» publicaram o artigo sobre o protocolo de consenso Avalanche, e a Ava Labs, fundada nesse mesmo ano, começou a desenvolvê-lo.",
     "2020 — Depois de uma venda pública de tokens em julho, a rede principal arrancou em setembro e a AVAX começou a ser negociada nas corretoras.",
     "2021 — Após o anúncio, em agosto, do «Avalanche Rush», um programa de incentivos para o ecossistema, o preço subiu com força e atingiu o máximo histórico em novembro.",
     "2022 — No mercado em baixa, no final do ano estava mais de 90% abaixo desse máximo histórico.",
     "2024 — A atualização Avalanche9000, em dezembro, alterou de forma marcada o custo de lançar uma cadeia L1 própria."
    ],
    "faq": [
     {
      "q": "O índice de medo e ganância deste ecrã é calculado para a Avalanche?",
      "a": "Não. É o índice de sentimento de todo o mercado cripto que a Alternative.me publica todos os dias, com grande peso da Bitcoin. É por isso que os ecrãs de AVAX e BTC mostram o mesmo número; o nome do cartão inclui «mercado global» para o deixar claro."
     },
     {
      "q": "Porque é que o MVRV aparece como N/A no ecrã da Avalanche?",
      "a": "O MVRV precisa de dados de capitalização realizada (o custo médio dos detentores), e a API comunitária da CoinMetrics usada por esta página não tem MVRV da AVAX. Em vez de estimar um valor, a página mostra N/A e reequilibra a pontuação com os indicadores restantes. Pela mesma razão, o veredito «isto é o fundo?» do BOTTOM RADAR (premium) fica suspenso."
     },
     {
      "q": "O staking ou a atividade nas Avalanche L1 contam para a pontuação?",
      "a": "Não. A pontuação usa apenas cinco indicadores calculados com o preço da AVAX e o índice de medo e ganância do mercado. A taxa de staking, a utilização da rede e o calendário de desbloqueios de tokens não entram; se forem importantes para si, verifique-os à parte."
     },
     {
      "q": "A AVAX é mais volátil do que a Bitcoin: os mesmos limiares servem?",
      "a": "As fórmulas são as mesmas da Bitcoin, por isso os limites — RSI 30/70, múltiplo de Mayer 0,8/2,4 — não mudam. Uma moeda mais volátil pode ficar em sobrevenda ou sobrecompra com mais frequência e durante mais tempo, pelo que é mais prudente verificar se vários indicadores concordam do que reagir a uma única leitura extrema."
     },
     {
      "q": "Devo comprar Avalanche agora?",
      "a": "Não lhe dizemos para comprar nem para vender. A pontuação mostra se os indicadores estão agora concentrados do lado da sobrevenda e do medo ou do lado do sobreaquecimento. No separador de longo prazo (contrário), 80 ou mais é STRONG BUY e menos de 25 é OVERHEATED; tenha em conta que a AVAX é avaliada sem MVRV e use o resultado apenas como referência."
     }
    ]
   },
   "ru": {
    "title": "Оценка момента покупки Аваланча (AVAX): как читать индикаторы без MVRV",
    "intro": "AVAX_SIGNAL рассчитывает RSI(14), MACD(12·26·9), мультипликатор Майера, просадку от 365-дневного максимума и золотой/мёртвый крест 50- и 200-дневной средних по дневным ценам Аваланча, затем добавляет индекс страха и жадности всего криптовалютного рынка и получает оценку момента покупки от 0 до 100. Седьмой индикатор, MVRV Z-Score, показан как N/A, поскольку в общедоступном API CoinMetrics нет данных по AVAX; его вес перераспределяется между остальными индикаторами. Сегодняшняя оценка бесплатна и доступна сразу, ничего устанавливать не нужно.",
    "coinH": "Что такое Аваланч (AVAX)?",
    "coinP": [
     "Аваланч — платформа смарт-контрактов, которую разработала компания Ava Labs; одним из её сооснователей стал бывший профессор Корнеллского университета Эмин Гюн Сирер (Emin Gün Sirer). Основная сеть заработала в сентябре 2020 года, а AVAX — её собственный токен. Платформа сочетает консенсус Avalanche, который быстро приходит к согласию за счёт многократного опроса небольших случайных групп валидаторов, с доказательством доли (PoS), поэтому валидаторы обязаны стейкать AVAX.",
     "Основная сеть состоит из X-Chain для выпуска и перевода активов, C-Chain для смарт-контрактов, совместимых с виртуальной машиной Ethereum (EVM), и P-Chain, которая управляет валидаторами и подсетями. Особенность платформы в том, что проекты могут запускать собственные блокчейны со своими правилами: сначала их называли подсетями (subnets), теперь — Avalanche L1. Предложение AVAX ограничено 720 миллионами, а AVAX, уплаченные в виде комиссий за транзакции, сжигаются."
    ],
    "applyH": "Как читать индикаторы для Аваланча",
    "apply": [
     "На экране Аваланча MVRV Z-Score показан как N/A. Общедоступный API CoinMetrics не даёт MVRV для AVAX, поэтому оценка перераспределяет веса между шестью остальными индикаторами. Ончейн-проверки дна — например, опустилась ли капитализация ниже средней цены покупки держателей, — здесь невозможны.",
     "Значение страха и жадности берётся из общерыночного индекса Alternative.me и во многом зависит от Биткоина. Новости, касающиеся только экосистемы Аваланча, на этой цифре почти не отражаются, поэтому смотрите на неё вместе с ценовыми индикаторами.",
     "AVAX торгуется только с сентября 2020 года, поэтому его ценовая история намного короче, чем у Биткоина, и фактически включает лишь один полный большой цикл роста и падения (2021–2022). Если применять без изменений пороги мультипликатора Майера (0,8 и 2,4), выведенные из истории Биткоина, сигналы могут вводить в заблуждение.",
     "С максимума ноября 2021 года до конца 2022 года AVAX подешевел более чем на 90%. Иными словами, падение может продолжаться ещё долго после того, как индикатор просадки достигнет порога «сильная покупка» в −50%.",
     "Объём AVAX в обращении со временем растёт: выпускаются награды за стейкинг и разблокируются токены из первоначального распределения. Оценка учитывает только цену, поэтому такие изменения предложения нужно проверять отдельно."
    ],
    "histH": "Ценовые циклы Аваланча вкратце",
    "hist": [
     "2018 — анонимные авторы под именем «Team Rocket» опубликовали работу о протоколе консенсуса Avalanche, и основанная в том же году Ava Labs начала разработку на её основе.",
     "2020 — после публичной продажи токенов в июле основная сеть запустилась в сентябре, и AVAX начал торговаться на биржах.",
     "2021 — после августовского анонса программы стимулов для экосистемы «Avalanche Rush» цена резко выросла и в ноябре достигла исторического максимума.",
     "2022 — на медвежьем рынке к концу года цена была более чем на 90% ниже этого исторического максимума.",
     "2024 — декабрьское обновление Avalanche9000 заметно изменило стоимость запуска собственной L1-сети."
    ],
    "faq": [
     {
      "q": "Индекс страха и жадности на этом экране рассчитан для Аваланча?",
      "a": "Нет. Это общерыночный индекс настроений криптовалютного рынка, который Alternative.me публикует каждый день, и вес Биткоина в нём велик. Поэтому на экранах AVAX и BTC одно и то же число, а в названии карточки для ясности указано «весь рынок»."
     },
     {
      "q": "Почему на экране Аваланча MVRV показан как N/A?",
      "a": "Для MVRV нужны данные о реализованной капитализации (средней цене покупки держателей), а в общедоступном API CoinMetrics, который использует эта страница, нет MVRV для AVAX. Вместо того чтобы подставлять оценочное значение, страница показывает N/A и пересчитывает итоговую оценку по остальным индикаторам. По той же причине вердикт «это дно?» в премиальном BOTTOM RADAR не выносится."
     },
     {
      "q": "Учитываются ли в оценке стейкинг или активность Avalanche L1?",
      "a": "Нет. Оценка использует только пять индикаторов, рассчитанных по цене AVAX, и общерыночный индекс страха и жадности. Доля застейканных монет, нагрузка на сеть и график разблокировки токенов не входят в расчёт; если они для вас важны, проверяйте их отдельно."
     },
     {
      "q": "AVAX волатильнее Биткоина — подходят ли те же пороги?",
      "a": "Формулы те же, что и для Биткоина, поэтому границы — RSI 30/70, мультипликатор Майера 0,8/2,4 — не меняются. Более волатильная монета может чаще и дольше оставаться в зоне перепроданности или перекупленности, так что надёжнее проверять, согласуются ли несколько индикаторов, чем реагировать на одно экстремальное значение."
     },
     {
      "q": "Стоит ли покупать Аваланч сейчас?",
      "a": "Мы не говорим, покупать или продавать. Оценка показывает, где сейчас собираются индикаторы — на стороне перепроданности и страха или на стороне перегрева. На долгосрочной (контртрендовой) вкладке 80 и выше — это STRONG BUY, ниже 25 — OVERHEATED. Учитывайте, что AVAX оценивается без MVRV, и воспринимайте результат только как ориентир."
     }
    ]
   },
   "nl": {
    "title": "Koopmoment-score voor Avalanche (AVAX): indicatoren lezen zonder MVRV",
    "intro": "AVAX_SIGNAL berekent uit de dagkoersen van Avalanche de RSI(14), de MACD(12·26·9), de Mayer Multiple, de daling vanaf de 365-daagse top en de golden/death cross van de 50/200-daagse gemiddelden, en voegt de Angst- & Hebzucht-index van de hele cryptomarkt toe om een koopmoment-score van 0 tot 100 te vormen. De zevende indicator, de MVRV Z-Score, staat op N/A omdat de community-API van CoinMetrics geen AVAX-gegevens bevat; het gewicht ervan wordt over de overige indicatoren verdeeld. De score van vandaag is gratis en meteen te bekijken, zonder iets te installeren.",
    "coinH": "Wat is Avalanche (AVAX)?",
    "coinP": [
     "Avalanche is een smart-contractplatform van Ava Labs, dat onder meer werd opgericht door voormalig Cornell-hoogleraar Emin Gün Sirer; het mainnet ging in september 2020 live en AVAX is de eigen token van het netwerk. Het platform combineert het Avalanche-consensusprotocol — dat snel tot overeenstemming komt door herhaaldelijk kleine, willekeurig gekozen groepjes validators te bevragen — met proof of stake, dus validators moeten AVAX staken.",
     "Het primaire netwerk bestaat uit de X-Chain voor het aanmaken en overdragen van assets, de C-Chain voor smart contracts die compatibel zijn met de Ethereum Virtual Machine (EVM), en de P-Chain, die validators en subnetwerken beheert. Kenmerkend is dat projecten een eigen blockchain met eigen regels kunnen starten: eerst subnets genoemd, nu Avalanche L1's. Het AVAX-aanbod is begrensd op 720 miljoen, en AVAX die als transactiekosten worden betaald, worden verbrand."
    ],
    "applyH": "Indicatoren lezen bij Avalanche",
    "apply": [
     "Op het Avalanche-scherm staat de MVRV Z-Score op N/A. De community-API van CoinMetrics levert geen MVRV voor AVAX, dus de score verdeelt de gewichten over de andere zes indicatoren. On-chain bodemchecks — bijvoorbeeld of de marktwaarde onder de gemiddelde aankoopprijs van houders is gezakt — zijn hier niet mogelijk.",
     "De waarde voor angst en hebzucht komt uit de marktbrede index van Alternative.me en hangt grotendeels af van Bitcoin. Nieuws dat alleen het Avalanche-ecosysteem raakt, is in dat getal nauwelijks terug te zien; lees het daarom samen met de prijsindicatoren.",
     "AVAX wordt pas sinds september 2020 verhandeld. De koershistorie is daardoor veel korter dan die van Bitcoin en bevat in feite maar één volledige grote cyclus van stijging en daling (2021-2022). Wie de Mayer Multiple-grenzen (0,8 en 2,4), die uit de Bitcoin-geschiedenis komen, ongewijzigd toepast, kan misleidende signalen krijgen.",
     "Vanaf de top van november 2021 verloor AVAX tot eind 2022 meer dan 90%. Met andere woorden: de daling kan nog lang doorgaan nadat de dalingsindicator de drempel ‘sterk kopen’ van −50% heeft bereikt.",
     "Het circulerende AVAX-aanbod groeit in de loop van de tijd doordat stakingbeloningen worden uitgegeven en tokens uit de oorspronkelijke verdeling vrijkomen. De score kijkt alleen naar de koers, dus zulke aanbodveranderingen moet je apart controleren."
    ],
    "histH": "Prijscycli van Avalanche in het kort",
    "hist": [
     "2018 — Anonieme auteurs onder de naam ‘Team Rocket’ publiceerden de paper over het Avalanche-consensusprotocol; het datzelfde jaar opgerichte Ava Labs bouwde daarop verder.",
     "2020 — Na een publieke tokenverkoop in juli ging het mainnet in september live en werd AVAX verhandelbaar op beurzen.",
     "2021 — Na de aankondiging van ‘Avalanche Rush’, een stimuleringsprogramma voor het ecosysteem, in augustus steeg de koers flink en werd in november een all-time high bereikt.",
     "2022 — In de berenmarkt stond de koers eind van het jaar meer dan 90% onder die all-time high.",
     "2024 — De Avalanche9000-upgrade in december veranderde de kosten om een eigen L1-chain te starten ingrijpend."
    ],
    "faq": [
     {
      "q": "Is de Angst- & Hebzucht-index op dit scherm gebaseerd op Avalanche?",
      "a": "Nee. Het is de marktbrede sentimentindex voor crypto die Alternative.me elke dag publiceert, met een groot gewicht voor Bitcoin. Daarom tonen het AVAX- en het BTC-scherm hetzelfde getal; de kaartnaam vermeldt ‘hele markt’ om dat duidelijk te maken."
     },
     {
      "q": "Waarom staat MVRV op N/A op het Avalanche-scherm?",
      "a": "Voor MVRV zijn gegevens over de realized cap (de gemiddelde aankoopprijs van houders) nodig, en de community-API van CoinMetrics die deze pagina gebruikt, heeft geen MVRV voor AVAX. In plaats van een waarde te schatten toont de pagina N/A en herverdeelt ze de totaalscore over de overige indicatoren. Om dezelfde reden blijft het oordeel ‘is dit de bodem?’ van BOTTOM RADAR (premium) uit."
     },
     {
      "q": "Tellen staking of activiteit op Avalanche L1's mee in de score?",
      "a": "Nee. De score gebruikt alleen vijf indicatoren die uit de AVAX-koers worden berekend, plus de marktbrede Angst- & Hebzucht-index. Stakingratio, netwerkgebruik en het schema voor tokenvrijgaven tellen niet mee; controleer die apart als ze voor jou belangrijk zijn."
     },
     {
      "q": "AVAX is volatieler dan Bitcoin — gelden dezelfde drempels dan wel?",
      "a": "De formules zijn dezelfde als voor Bitcoin, dus de grenzen — RSI 30/70, Mayer Multiple 0,8/2,4 — veranderen niet. Een volatielere munt kan vaker en langer oververkocht of overgekocht blijven; het is daarom veiliger te controleren of meerdere indicatoren het eens zijn dan te reageren op één extreme waarde."
     },
     {
      "q": "Moet ik nu Avalanche kopen?",
      "a": "We zeggen niet of je moet kopen of verkopen. De score laat zien of de indicatoren zich nu groeperen aan de kant van oververkocht en angst of aan de kant van oververhitting. Op het tabblad lange termijn (contrair) is 80 of hoger STRONG BUY en onder 25 OVERHEATED; houd er rekening mee dat AVAX zonder MVRV wordt beoordeeld en gebruik de uitkomst alleen als richtpunt."
     }
    ]
   }
  };
  Object.keys(COIN_SEO).forEach(function (l) { if (SEO[l]) for (var key in COIN_SEO[l]) SEO[l][key] = COIN_SEO[l][key]; });

  window.SEO_I18N = SEO;
  window.FOOT_DESC_I18N = FOOT_DESC;
  window.renderSEO = function (lang) {
    try {
      var d = SEO[lang] || SEO.en;
      var sec = document.querySelector('section.seo');
      if (sec) { sec.innerHTML = build(d, lang); sec.setAttribute('lang', lang === 'zh' ? 'zh-Hans' : lang); sec.setAttribute('aria-label', d.title); }
      var fd = document.querySelector('.site-foot .foot-desc');
      if (fd) fd.textContent = FOOT_DESC[lang] || FOOT_DESC.en;
    } catch (e) {}
  };
})();
