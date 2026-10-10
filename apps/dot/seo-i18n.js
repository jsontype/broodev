/* 하단 SEO 본문 다국어 데이터 + 렌더러. index.html(광고) / member/index.html(구독자) 공유.
   언어 전환 시 window.renderSEO(lang) 호출 → section.seo 를 해당 언어로 다시 그림.
   기본 정적 HTML(한국어)은 무JS 크롤러용 폴백으로 남겨두고, JS 실행 시 현재 언어로 교체. */
(function () {
  var SEO = {
    ko: {
      title: '폴카닷 공포·탐욕 지수 & 매수 타이밍 점수',
      intro: '폴카닷 공포지수(공포·탐욕 지수, Fear & Greed Index)를 포함한 7개 실시간 지표를 합성해 “지금이 매수 타이밍인가?”를 0~100 점수로 보여주는 무료 대시보드입니다. 설치 없이 브라우저에서 바로 실행되며 13개 언어를 지원합니다.',
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
        { q: '공포지수가 낮으면 폴카닷을 사야 하나요?', a: '극단적 공포는 역사적으로 분할 매수 기회였던 경우가 많지만, 공포지수 하나만 보면 “떨어지는 칼날”을 잡을 위험이 있습니다. 본 점수는 RSI·MACD·마이어 배수·낙폭·이동평균 크로스를 함께 보고, 하락 추세에서는 점수를 보수적으로 낮춥니다.' },
        { q: '매수 타이밍 점수는 어떻게 계산되나요?', a: '7개 지표를 각각 0~100 부분점수로 환산해 가중 합성합니다. 결과는 0~100이며 5단계 밴드로 표시됩니다.' },
        { q: '무료인가요? 설치가 필요한가요?', a: '완전 무료이며 설치가 필요 없습니다. CoinGecko·Binance·Alternative.me 공개 API에서 실시간 데이터를 가져옵니다.' },
        { q: '공포지수와 매수 타이밍 점수는 무엇이 다른가요?', a: '공포지수는 심리 한 가지 지표(0~100)이고, 매수 타이밍 점수는 공포지수를 포함한 7개 지표를 합성한 종합 점수(0~100)입니다.' },
        { q: '공포지수 데이터는 어디서 가져오나요? 얼마나 자주 갱신되나요?', a: '공포·탐욕 지수는 Alternative.me, 가격·일봉은 CoinGecko·Binance, 온체인 지표는 CoinMetrics 공개 API에서 실시간으로 가져옵니다. 화면은 약 1분 주기로 자동 갱신됩니다.' },
        { q: '폴카닷 지금 사도 되나요?', a: '정답은 없지만, 매수 타이밍 점수(0~100)로 현재 시장이 과매도·공포 구간인지 과열·탐욕 구간인지 객관적으로 가늠할 수 있습니다. 장기(역발상) 탭 기준 점수가 높을수록 공포·저평가가 겹친 분할 매수 우호 구간, 낮을수록 과열 경계 구간입니다. 참고 신호일 뿐 투자 자문이 아닙니다.' },
        { q: '단기와 장기 매수 타이밍은 어떻게 다른가요?', a: '점수는 단기·장기 두 탭으로 나뉩니다. 단기(모멘텀)는 약 1~3개월 추세추종 관점으로 상승 추세가 강할수록 높고, 장기(역발상)는 약 1년 이상 사이클 관점으로 공포·저평가일수록 높습니다. 2017년 이후 백테스트에서 단기는 모멘텀, 장기는 역발상 방향이 더 잘 맞았습니다.' },
        { q: 'BOTTOM RADAR(바닥 점수)는 무엇인가요?', a: 'MVRV Z-점수 같은 온체인 지표로 시가총액이 투자자 평균 매수원가 대비 어디에 있는지 재서, 역사적 바닥 구간과의 근접도를 0~100으로 보여주는 보조 게이지입니다. 계산 근거는 “비트코인 바닥” 해설 페이지에 공개되어 있습니다.' }
      ],
      disclaimer: '⚠ 본 점수는 공개 지표를 합성한 참고 신호이며 투자 자문이 아닙니다. 모든 투자 판단과 책임은 이용자 본인에게 있습니다.'
    },
    en: {
      title: 'Polkadot Fear & Greed Index & Buy-Timing Score',
      intro: 'A free dashboard that synthesizes 7 real-time indicators — including the Polkadot Fear & Greed Index — into a 0–100 “is now a good time to buy?” score. Runs in your browser with no install, in 13 languages.',
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
        { q: 'Should I buy Polkadot when the index is low?', a: 'Extreme fear has often been an accumulation opportunity, but relying on the index alone risks catching a falling knife. This score also weighs RSI, MACD, Mayer Multiple, drawdown and moving-average crosses, and lowers the score conservatively in downtrends.' },
        { q: 'How is the buy-timing score calculated?', a: 'Each of the 7 indicators is converted to a 0–100 sub-score and weighted together. The result is 0–100, shown in 5 bands.' },
        { q: 'Is it free? Do I need to install anything?', a: 'It is completely free with no install. Real-time data comes from CoinGecko, Binance and Alternative.me public APIs.' },
        { q: 'How is the index different from the buy-timing score?', a: 'The index is a single sentiment metric (0–100); the buy-timing score is a composite of 7 indicators including the index (0–100).' },
        { q: 'Where does the data come from, and how often does it refresh?', a: 'The Fear & Greed Index comes from Alternative.me, prices and daily candles from the CoinGecko and Binance public APIs, and on-chain metrics from CoinMetrics. The screen auto-refreshes roughly every minute.' },
        { q: 'Should I buy Polkadot right now?', a: 'There is no single answer, but the buy-timing score (0–100) gives an objective read on whether the market is in an oversold/fear zone or an overheated/greed zone. On the long-term (contrarian) tab, higher scores mark zones where fear and undervaluation overlap — historically favorable for DCA — while lower scores warn of overheating. It is a reference signal, not investment advice.' },
        { q: 'How do short-term and long-term buy timing differ?', a: 'The score is split into two tabs. Short-term (momentum) takes a 1–3 month trend-following view and rises with strong uptrends; long-term (contrarian) takes a 1-year-plus cycle view and rises with fear and undervaluation. In backtests since 2017, momentum worked better short-term and contrarian worked better long-term.' },
        { q: 'What is the BOTTOM RADAR (bottom score)?', a: 'A secondary gauge that uses on-chain metrics such as the MVRV Z-Score to measure where market cap sits relative to investors’ average cost basis, showing proximity to historic bottom zones on a 0–100 scale. The full calculation is published on the “Bitcoin bottom” guide page.' }
      ],
      disclaimer: '⚠ This score is a reference signal built from public indicators, not investment advice. All decisions and responsibility are your own.'
    },
    ja: {
      title: 'ポルカドット 恐怖・強欲指数 & 買い時スコア',
      intro: 'ポルカドットの恐怖・強欲指数（Fear & Greed Index）を含む7つのリアルタイム指標を合成し、「今が買い時か？」を0〜100のスコアで示す無料ダッシュボードです。インストール不要でブラウザから即実行、13言語対応。',
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
        { q: '指数が低ければポルカドットを買うべき？', a: '極端な恐怖は歴史的に分割買いの好機だったことが多いですが、指数だけに頼ると「落ちるナイフ」を掴む危険があります。本スコアはRSI・MACD・マイヤー倍率・下落率・移動平均クロスも合わせて見て、下落トレンドでは保守的にスコアを下げます。' },
        { q: '買い時スコアはどう計算される？', a: '7指標をそれぞれ0〜100の部分スコアに換算し加重合成します。結果は0〜100で、5段階バンドで表示します。' },
        { q: '無料？インストールは必要？', a: '完全無料・インストール不要です。CoinGecko・Binance・Alternative.me の公開APIからリアルタイムデータを取得します。' },
        { q: '指数と買い時スコアの違いは？', a: '指数は心理1指標(0〜100)、買い時スコアは指数を含む7指標を合成した総合スコア(0〜100)です。' },
        { q: 'データはどこから？更新頻度は？', a: '恐怖・強欲指数はAlternative.me、価格・日足はCoinGecko・Binance、オンチェーン指標はCoinMetricsの公開APIからリアルタイムで取得します。画面は約1分ごとに自動更新されます。' },
        { q: 'ポルカドットは今買ってもいい？', a: '正解はありませんが、買い時スコア(0〜100)で現在の市場が売られすぎ・恐怖圏か、過熱・強欲圏かを客観的に測れます。長期（逆張り）タブではスコアが高いほど恐怖と割安が重なる分割買いに有利な圏、低いほど過熱警戒圏です。参考シグナルであり投資助言ではありません。' },
        { q: '短期と長期の買い時はどう違う？', a: 'スコアは短期・長期の2タブに分かれます。短期（モメンタム）は約1〜3か月のトレンドフォロー視点で上昇トレンドが強いほど高く、長期（逆張り）は約1年以上のサイクル視点で恐怖・割安なほど高くなります。2017年以降のバックテストでは、短期はモメンタム、長期は逆張りの方向がより有効でした。' },
        { q: 'BOTTOM RADAR（底値スコア）とは？', a: 'MVRV Zスコアなどのオンチェーン指標で、時価総額が投資家の平均取得単価に対してどの位置にあるかを測り、歴史的な底値圏への近さを0〜100で示す補助ゲージです。計算根拠は「ビットコインの底」解説ページで公開しています。' }
      ],
      disclaimer: '⚠ 本スコアは公開指標を合成した参考シグナルであり、投資助言ではありません。すべての判断と責任は利用者ご自身にあります。'
    },
    zh: {
      title: '波卡恐惧与贪婪指数 & 买入时机评分',
      intro: '一个免费仪表板，将包括波卡恐惧与贪婪指数（Fear & Greed Index）在内的7个实时指标合成为0–100的“现在是买入时机吗？”评分。无需安装，浏览器即开即用，支持13种语言。',
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
        { q: '指数低就该买波卡吗？', a: '极度恐惧在历史上常是分批买入良机，但只看指数有“接飞刀”的风险。本评分同时参考RSI、MACD、梅耶倍数、回撤与均线交叉，并在下跌趋势中保守下调评分。' },
        { q: '买入时机评分如何计算？', a: '将7个指标各自换算为0–100分项评分并加权合成。结果为0–100，以5档显示。' },
        { q: '免费吗？需要安装吗？', a: '完全免费、无需安装。实时数据来自 CoinGecko、Binance、Alternative.me 公开API。' },
        { q: '指数与买入时机评分有何不同？', a: '指数是单一情绪指标(0–100)；买入时机评分是包含该指数在内的7指标综合评分(0–100)。' },
        { q: '数据来自哪里？多久更新一次？', a: '恐惧与贪婪指数来自Alternative.me，价格与日K来自CoinGecko和Binance公开API，链上指标来自CoinMetrics。页面约每1分钟自动刷新。' },
        { q: '现在可以买波卡吗？', a: '没有标准答案，但买入时机评分(0–100)能客观判断当前市场处于超卖·恐惧区还是过热·贪婪区。在长期（逆向）标签页中，评分越高代表恐惧与低估重叠、历史上利于分批买入的区间；越低则是过热警戒区。仅供参考，并非投资建议。' },
        { q: '短期和长期买入时机有何不同？', a: '评分分为短期、长期两个标签页。短期（动量）以约1–3个月的趋势跟随视角，上升趋势越强评分越高；长期（逆向）以约1年以上的周期视角，越恐惧、越低估评分越高。2017年以来的回测显示，短期动量、长期逆向的方向更有效。' },
        { q: 'BOTTOM RADAR（底部评分）是什么？', a: '一个辅助仪表，利用MVRV Z分数等链上指标衡量市值相对投资者平均持仓成本的位置，以0–100显示与历史底部区间的接近程度。计算依据在“比特币底部”解读页面公开。' }
      ],
      disclaimer: '⚠ 本评分由公开指标合成，仅供参考，并非投资建议。一切投资决定与责任由用户自负。'
    },
    'zh-Hant': {
      title: '波卡恐懼與貪婪指數 & 買入時機評分',
      intro: '一個免費儀表板，將包括波卡恐懼與貪婪指數（Fear & Greed Index）在內的7個即時指標合成為0–100的「現在是買入時機嗎？」評分。免安裝、瀏覽器即開即用，支援13種語言。',
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
        { q: '指數低就該買波卡嗎？', a: '極度恐懼在歷史上常是分批買入良機，但只看指數有「接飛刀」的風險。本評分同時參考RSI、MACD、梅耶倍數、回撤與均線交叉，並在下跌趨勢中保守下調評分。' },
        { q: '買入時機評分如何計算？', a: '將7個指標各自換算為0–100分項評分並加權合成。結果為0–100，以5檔顯示。' },
        { q: '免費嗎？需要安裝嗎？', a: '完全免費、免安裝。即時資料來自 CoinGecko、Binance、Alternative.me 公開API。' },
        { q: '指數與買入時機評分有何不同？', a: '指數是單一情緒指標(0–100)；買入時機評分是包含該指數在內的7指標綜合評分(0–100)。' },
        { q: '資料來自哪裡？多久更新一次？', a: '恐懼與貪婪指數來自Alternative.me，價格與日K來自CoinGecko和Binance公開API，鏈上指標來自CoinMetrics。頁面約每1分鐘自動重新整理。' },
        { q: '現在可以買波卡嗎？', a: '沒有標準答案，但買入時機評分(0–100)能客觀判斷當前市場處於超賣·恐懼區還是過熱·貪婪區。在長期（逆向）分頁中，評分越高代表恐懼與低估重疊、歷史上利於分批買入的區間；越低則是過熱警戒區。僅供參考，並非投資建議。' },
        { q: '短期和長期買入時機有何不同？', a: '評分分為短期、長期兩個分頁。短期（動量）以約1–3個月的趨勢跟隨視角，上升趨勢越強評分越高；長期（逆向）以約1年以上的週期視角，越恐懼、越低估評分越高。2017年以來的回測顯示，短期動量、長期逆向的方向更有效。' },
        { q: 'BOTTOM RADAR（底部評分）是什麼？', a: '一個輔助儀表，利用MVRV Z分數等鏈上指標衡量市值相對投資者平均持倉成本的位置，以0–100顯示與歷史底部區間的接近程度。計算依據在「比特幣底部」解說頁面公開。' }
      ],
      disclaimer: '⚠ 本評分由公開指標合成，僅供參考，並非投資建議。一切投資決定與責任由用戶自負。'
    },
    es: {
      title: 'Índice de miedo y codicia de Polkadot y puntuación de momento de compra',
      intro: 'Un panel gratuito que sintetiza 7 indicadores en tiempo real —incluido el índice de miedo y codicia de Polkadot— en una puntuación de 0 a 100 sobre «¿es buen momento para comprar?». Funciona en el navegador sin instalación, en 13 idiomas.',
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
        { q: '¿Debo comprar Polkadot cuando el índice está bajo?', a: 'El miedo extremo ha sido a menudo una oportunidad de acumulación, pero fiarse solo del índice arriesga «atrapar un cuchillo que cae». Esta puntuación también pondera RSI, MACD, múltiplo de Mayer, caída y cruces de medias, y la reduce de forma conservadora en tendencias bajistas.' },
        { q: '¿Cómo se calcula la puntuación de compra?', a: 'Cada uno de los 7 indicadores se convierte en una subpuntuación de 0 a 100 y se pondera. El resultado es 0–100, mostrado en 5 bandas.' },
        { q: '¿Es gratis? ¿Necesito instalar algo?', a: 'Es totalmente gratis y sin instalación. Los datos en tiempo real provienen de las API públicas de CoinGecko, Binance y Alternative.me.' },
        { q: '¿En qué se diferencia el índice de la puntuación de compra?', a: 'El índice es una sola métrica de sentimiento (0–100); la puntuación de compra es un compuesto de 7 indicadores que incluye el índice (0–100).' },
        { q: '¿De dónde vienen los datos y con qué frecuencia se actualizan?', a: 'El índice de miedo y codicia viene de Alternative.me; los precios y velas diarias, de las API públicas de CoinGecko y Binance; y las métricas on-chain, de CoinMetrics. La pantalla se actualiza automáticamente cada minuto aproximadamente.' },
        { q: '¿Debería comprar Polkadot ahora mismo?', a: 'No hay una respuesta única, pero la puntuación de compra (0–100) permite valorar objetivamente si el mercado está en zona de sobreventa/miedo o de recalentamiento/codicia. En la pestaña de largo plazo (contraria), puntuaciones altas marcan zonas donde coinciden miedo e infravaloración —históricamente favorables al DCA—, y las bajas avisan de recalentamiento. Es una señal de referencia, no asesoramiento de inversión.' },
        { q: '¿En qué se diferencian el timing de corto y de largo plazo?', a: 'La puntuación se divide en dos pestañas. El corto plazo (momentum) adopta una visión de seguimiento de tendencia de 1–3 meses y sube con tendencias alcistas fuertes; el largo plazo (contrario) adopta una visión de ciclo de más de un año y sube con miedo e infravaloración. En backtests desde 2017, el momentum funcionó mejor a corto y lo contrario a largo.' },
        { q: '¿Qué es el BOTTOM RADAR (puntuación de suelo)?', a: 'Un indicador auxiliar que usa métricas on-chain como el MVRV Z-Score para medir dónde está la capitalización respecto al coste medio de los inversores, mostrando la cercanía a zonas de suelo históricas en una escala de 0 a 100. El cálculo completo está publicado en la guía «suelo de Bitcoin».' }
      ],
      disclaimer: '⚠ Esta puntuación es una señal de referencia a partir de indicadores públicos, no asesoramiento de inversión. Todas las decisiones y la responsabilidad son tuyas.'
    },
    fr: {
      title: 'Indice de peur et d’avidité Polkadot et score de timing d’achat',
      intro: 'Un tableau de bord gratuit qui synthétise 7 indicateurs en temps réel — dont l’indice de peur et d’avidité Polkadot — en un score de 0 à 100 « est-ce le bon moment pour acheter ? ». Fonctionne dans le navigateur sans installation, en 13 langues.',
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
        { q: 'Dois-je acheter du Polkadot quand l’indice est bas ?', a: 'La peur extrême a souvent été une opportunité d’accumulation, mais se fier au seul indice risque d’« attraper un couteau qui tombe ». Ce score pondère aussi RSI, MACD, multiple de Mayer, repli et croisements de moyennes, et le réduit prudemment en tendance baissière.' },
        { q: 'Comment le score de timing d’achat est-il calculé ?', a: 'Chacun des 7 indicateurs est converti en sous-score de 0 à 100 puis pondéré. Le résultat est 0–100, affiché en 5 bandes.' },
        { q: 'Est-ce gratuit ? Faut-il installer quelque chose ?', a: 'C’est entièrement gratuit et sans installation. Les données en temps réel proviennent des API publiques de CoinGecko, Binance et Alternative.me.' },
        { q: 'Quelle différence entre l’indice et le score de timing d’achat ?', a: 'L’indice est une seule mesure de sentiment (0–100) ; le score de timing d’achat est un composite de 7 indicateurs incluant l’indice (0–100).' },
        { q: 'D’où viennent les données et à quelle fréquence sont-elles actualisées ?', a: 'L’indice de peur et d’avidité vient d’Alternative.me ; les prix et bougies journalières, des API publiques de CoinGecko et Binance ; et les métriques on-chain, de CoinMetrics. L’écran se rafraîchit automatiquement environ chaque minute.' },
        { q: 'Dois-je acheter du Polkadot maintenant ?', a: 'Il n’y a pas de réponse unique, mais le score de timing d’achat (0–100) permet d’évaluer objectivement si le marché est en zone de survente/peur ou de surchauffe/avidité. Dans l’onglet long terme (contrarian), des scores élevés marquent des zones où peur et sous-évaluation se recoupent — historiquement favorables au DCA — tandis que des scores bas signalent la surchauffe. C’est un signal de référence, pas un conseil en investissement.' },
        { q: 'Quelle différence entre le timing court terme et long terme ?', a: 'Le score est divisé en deux onglets. Le court terme (momentum) adopte une vue de suivi de tendance sur 1 à 3 mois et monte avec les tendances haussières fortes ; le long terme (contrarian) adopte une vue de cycle d’un an et plus et monte avec la peur et la sous-évaluation. Dans les backtests depuis 2017, le momentum a mieux fonctionné à court terme et le contrarian à long terme.' },
        { q: 'Qu’est-ce que le BOTTOM RADAR (score de plancher) ?', a: 'Une jauge auxiliaire qui utilise des métriques on-chain comme le MVRV Z-Score pour mesurer où se situe la capitalisation par rapport au coût moyen des investisseurs, en montrant la proximité des zones de plancher historiques sur une échelle de 0 à 100. Le calcul complet est publié sur la page « plancher du Bitcoin ».' }
      ],
      disclaimer: '⚠ Ce score est un signal de référence issu d’indicateurs publics, pas un conseil en investissement. Toutes les décisions et la responsabilité vous appartiennent.'
    },
    de: {
      title: 'Polkadot Angst- & Gier-Index & Kaufzeitpunkt-Score',
      intro: 'Ein kostenloses Dashboard, das 7 Echtzeit-Indikatoren — inkl. Polkadot Angst- & Gier-Index — zu einem 0–100-Score „Ist jetzt ein guter Kaufzeitpunkt?“ zusammenführt. Läuft im Browser ohne Installation, in 13 Sprachen.',
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
        { q: 'Soll ich Polkadot kaufen, wenn der Index niedrig ist?', a: 'Extreme Angst war historisch oft eine Akkumulationschance, doch sich allein auf den Index zu verlassen, birgt das Risiko, „ins fallende Messer zu greifen“. Dieser Score gewichtet auch RSI, MACD, Mayer-Multiple, Rückgang und MA-Kreuzungen und senkt den Wert in Abwärtstrends konservativ.' },
        { q: 'Wie wird der Kaufzeitpunkt-Score berechnet?', a: 'Jeder der 7 Indikatoren wird in einen 0–100-Teil-Score umgerechnet und gewichtet. Das Ergebnis ist 0–100, in 5 Bändern dargestellt.' },
        { q: 'Ist es kostenlos? Muss ich etwas installieren?', a: 'Es ist völlig kostenlos und ohne Installation. Echtzeitdaten stammen aus den öffentlichen APIs von CoinGecko, Binance und Alternative.me.' },
        { q: 'Wie unterscheidet sich der Index vom Kaufzeitpunkt-Score?', a: 'Der Index ist eine einzelne Stimmungskennzahl (0–100); der Kaufzeitpunkt-Score ist ein Verbund aus 7 Indikatoren inkl. Index (0–100).' },
        { q: 'Woher stammen die Daten und wie oft werden sie aktualisiert?', a: 'Der Angst- & Gier-Index stammt von Alternative.me, Preise und Tageskerzen von den öffentlichen APIs von CoinGecko und Binance, On-Chain-Metriken von CoinMetrics. Der Bildschirm aktualisiert sich etwa jede Minute automatisch.' },
        { q: 'Sollte ich Polkadot jetzt kaufen?', a: 'Eine eindeutige Antwort gibt es nicht, aber der Kaufzeitpunkt-Score (0–100) zeigt objektiv, ob der Markt in einer überverkauften Angst-Zone oder einer überhitzten Gier-Zone steckt. Auf dem Langfrist-Tab (antizyklisch) markieren hohe Werte Zonen, in denen Angst und Unterbewertung zusammenfallen — historisch günstig für DCA —, niedrige warnen vor Überhitzung. Ein Referenzsignal, keine Anlageberatung.' },
        { q: 'Wie unterscheiden sich kurz- und langfristiges Kauftiming?', a: 'Der Score ist in zwei Tabs geteilt. Kurzfristig (Momentum) folgt einer Trendfolge-Sicht von 1–3 Monaten und steigt mit starken Aufwärtstrends; langfristig (antizyklisch) folgt einer Zyklus-Sicht von über einem Jahr und steigt mit Angst und Unterbewertung. In Backtests seit 2017 funktionierte kurzfristig Momentum und langfristig die antizyklische Richtung besser.' },
        { q: 'Was ist der BOTTOM RADAR (Boden-Score)?', a: 'Eine Zusatzanzeige, die mit On-Chain-Metriken wie den MVRV Z-Score misst, wo die Marktkapitalisierung relativ zum durchschnittlichen Einstandskurs der Anleger liegt, und die Nähe zu historischen Bodenzonen auf einer Skala von 0–100 zeigt. Die vollständige Berechnung ist auf der Seite „Bitcoin-Boden“ veröffentlicht.' }
      ],
      disclaimer: '⚠ Dieser Score ist ein Referenzsignal aus öffentlichen Indikatoren, keine Anlageberatung. Alle Entscheidungen und die Verantwortung liegen bei Ihnen.'
    },
    it: {
      title: 'Indice di paura e avidità Polkadot e punteggio di timing d’acquisto',
      intro: 'Una dashboard gratuita che sintetizza 7 indicatori in tempo reale — incluso l’indice di paura e avidità di Polkadot — in un punteggio 0–100 «è il momento giusto per comprare?». Funziona nel browser senza installazione, in 13 lingue.',
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
        { q: 'Dovrei comprare Polkadot quando l’indice è basso?', a: 'La paura estrema è stata spesso un’occasione di accumulo, ma affidarsi solo all’indice rischia di «prendere un coltello che cade». Questo punteggio pesa anche RSI, MACD, multiplo di Mayer, ribasso e incroci di medie, e lo riduce in modo prudente nei trend ribassisti.' },
        { q: 'Come si calcola il punteggio d’acquisto?', a: 'Ciascuno dei 7 indicatori è convertito in un sotto-punteggio 0–100 e ponderato. Il risultato è 0–100, mostrato in 5 bande.' },
        { q: 'È gratis? Serve installare qualcosa?', a: 'È completamente gratis e senza installazione. I dati in tempo reale provengono dalle API pubbliche di CoinGecko, Binance e Alternative.me.' },
        { q: 'Che differenza c’è tra l’indice e il punteggio d’acquisto?', a: 'L’indice è una singola misura di sentiment (0–100); il punteggio d’acquisto è un composito dei 7 indicatori incluso l’indice (0–100).' },
        { q: 'Da dove vengono i dati e con che frequenza si aggiornano?', a: 'L’indice di paura e avidità viene da Alternative.me; prezzi e candele giornaliere dalle API pubbliche di CoinGecko e Binance; le metriche on-chain da CoinMetrics. Lo schermo si aggiorna automaticamente circa ogni minuto.' },
        { q: 'Dovrei comprare Polkadot adesso?', a: 'Non c’è una risposta unica, ma il punteggio d’acquisto (0–100) permette di valutare oggettivamente se il mercato è in zona ipervenduto/paura o surriscaldato/avidità. Nella scheda a lungo termine (contrarian), punteggi alti indicano zone in cui paura e sottovalutazione coincidono — storicamente favorevoli al PAC — mentre punteggi bassi avvertono del surriscaldamento. È un segnale di riferimento, non consulenza d’investimento.' },
        { q: 'Che differenza c’è tra timing a breve e a lungo termine?', a: 'Il punteggio è diviso in due schede. Il breve termine (momentum) adotta una visione trend-following di 1–3 mesi e sale con trend rialzisti forti; il lungo termine (contrarian) adotta una visione di ciclo oltre l’anno e sale con paura e sottovalutazione. Nei backtest dal 2017, il momentum ha funzionato meglio nel breve e il contrarian nel lungo.' },
        { q: 'Cos’è il BOTTOM RADAR (punteggio di minimo)?', a: 'Un indicatore ausiliario che usa metriche on-chain come l’MVRV Z-Score per misurare dove si trova la capitalizzazione rispetto al costo medio degli investitori, mostrando la vicinanza alle zone di minimo storiche su una scala 0–100. Il calcolo completo è pubblicato nella guida «minimo di Bitcoin».' }
      ],
      disclaimer: '⚠ Questo punteggio è un segnale di riferimento da indicatori pubblici, non consulenza d’investimento. Ogni decisione e responsabilità è tua.'
    },
    pt: {
      title: 'Índice de medo e ganância do Polkadot e pontuação de momento de compra',
      intro: 'Um painel gratuito que sintetiza 7 indicadores em tempo real — incluindo o índice de medo e ganância do Polkadot — numa pontuação de 0 a 100 «é uma boa hora para comprar?». Roda no navegador sem instalação, em 13 idiomas.',
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
        { q: 'Devo comprar Polkadot quando o índice está baixo?', a: 'O medo extremo foi muitas vezes uma oportunidade de acumulação, mas confiar só no índice arrisca «pegar uma faca caindo». Esta pontuação também pondera RSI, MACD, múltiplo de Mayer, queda e cruzamentos de médias, e a reduz de forma conservadora em tendências de baixa.' },
        { q: 'Como a pontuação de compra é calculada?', a: 'Cada um dos 7 indicadores é convertido numa subpontuação de 0 a 100 e ponderado. O resultado é 0–100, em 5 faixas.' },
        { q: 'É grátis? Preciso instalar algo?', a: 'É totalmente grátis e sem instalação. Os dados em tempo real vêm das APIs públicas da CoinGecko, Binance e Alternative.me.' },
        { q: 'Qual a diferença entre o índice e a pontuação de compra?', a: 'O índice é uma única métrica de sentimento (0–100); a pontuação de compra é um composto de 7 indicadores incluindo o índice (0–100).' },
        { q: 'De onde vêm os dados e com que frequência são atualizados?', a: 'O índice de medo e ganância vem da Alternative.me; preços e velas diárias, das APIs públicas da CoinGecko e da Binance; e as métricas on-chain, da CoinMetrics. A tela atualiza automaticamente a cada minuto, aproximadamente.' },
        { q: 'Devo comprar Polkadot agora?', a: 'Não há resposta única, mas a pontuação de compra (0–100) permite avaliar objetivamente se o mercado está em zona de sobrevenda/medo ou de superaquecimento/ganância. Na aba de longo prazo (contrária), pontuações altas marcam zonas onde medo e subvalorização coincidem — historicamente favoráveis ao DCA —, e as baixas alertam para superaquecimento. É um sinal de referência, não consultoria de investimento.' },
        { q: 'Qual a diferença entre o timing de curto e de longo prazo?', a: 'A pontuação divide-se em duas abas. O curto prazo (momentum) adota uma visão de seguimento de tendência de 1–3 meses e sobe com tendências de alta fortes; o longo prazo (contrário) adota uma visão de ciclo de mais de um ano e sobe com medo e subvalorização. Em backtests desde 2017, o momentum funcionou melhor no curto e o contrário no longo.' },
        { q: 'O que é o BOTTOM RADAR (pontuação de fundo)?', a: 'Um medidor auxiliar que usa métricas on-chain como o MVRV Z-Score para medir onde a capitalização está em relação ao custo médio dos investidores, mostrando a proximidade de zonas de fundo históricas numa escala de 0 a 100. O cálculo completo está publicado no guia «fundo do Bitcoin».' }
      ],
      disclaimer: '⚠ Esta pontuação é um sinal de referência a partir de indicadores públicos, não é consultoria de investimento. Todas as decisões e a responsabilidade são suas.'
    },
    ru: {
      title: 'Индекс страха и жадности полкадота и оценка времени покупки',
      intro: 'Бесплатная панель, которая объединяет 7 индикаторов в реальном времени — включая индекс страха и жадности полкадота — в оценку от 0 до 100 «подходящее ли сейчас время для покупки?». Работает в браузере без установки, на 13 языках.',
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
        { q: 'Покупать ли полкадот, когда индекс низкий?', a: 'Крайний страх исторически часто был возможностью накопления, но полагаться только на индекс рискованно — можно «поймать падающий нож». Эта оценка также учитывает RSI, MACD, множитель Майера, просадку и пересечения средних и консервативно снижается в нисходящих трендах.' },
        { q: 'Как рассчитывается оценка покупки?', a: 'Каждый из 7 индикаторов переводится в частную оценку 0–100 и взвешивается. Результат — 0–100, в 5 диапазонах.' },
        { q: 'Это бесплатно? Нужно ли что-то устанавливать?', a: 'Полностью бесплатно и без установки. Данные в реальном времени берутся из публичных API CoinGecko, Binance и Alternative.me.' },
        { q: 'Чем индекс отличается от оценки покупки?', a: 'Индекс — одна метрика настроения (0–100); оценка покупки — составной показатель из 7 индикаторов, включая индекс (0–100).' },
        { q: 'Откуда берутся данные и как часто они обновляются?', a: 'Индекс страха и жадности — с Alternative.me; цены и дневные свечи — из публичных API CoinGecko и Binance; ончейн-метрики — из CoinMetrics. Экран автоматически обновляется примерно раз в минуту.' },
        { q: 'Стоит ли покупать полкадот прямо сейчас?', a: 'Единственно верного ответа нет, но оценка покупки (0–100) объективно показывает, находится ли рынок в зоне перепроданности/страха или перегрева/жадности. На вкладке долгосрочного (контртрендового) взгляда высокие значения отмечают зоны, где совпадают страх и недооценка — исторически благоприятные для усреднения, — а низкие предупреждают о перегреве. Это справочный сигнал, а не инвестиционная рекомендация.' },
        { q: 'Чем отличаются краткосрочный и долгосрочный тайминг?', a: 'Оценка разделена на две вкладки. Краткосрочная (моментум) использует трендследящий взгляд на 1–3 месяца и растёт при сильных восходящих трендах; долгосрочная (контртренд) — циклический взгляд от года и растёт при страхе и недооценке. В бэктестах с 2017 года на коротком горизонте лучше работал моментум, на длинном — контртренд.' },
        { q: 'Что такое BOTTOM RADAR (оценка дна)?', a: 'Вспомогательный индикатор, который с помощью ончейн-метрик, таких как MVRV Z-оценка, измеряет положение капитализации относительно средней цены входа инвесторов и показывает близость к историческим зонам дна по шкале 0–100. Полный расчёт опубликован на странице «дно биткоина».' }
      ],
      disclaimer: '⚠ Эта оценка — справочный сигнал на основе публичных индикаторов, а не инвестиционная рекомендация. Все решения и ответственность — на вас.'
    },
    nl: {
      title: 'Polkadot Angst- & Hebzucht-index en koopmoment-score',
      intro: 'Een gratis dashboard dat 7 realtime indicatoren — inclusief de Polkadot Angst- & Hebzucht-index — samenvoegt tot een score van 0–100 voor «is het nu een goed moment om te kopen?». Draait in de browser zonder installatie, in 13 talen.',
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
        { q: 'Moet ik Polkadot kopen als de index laag is?', a: 'Extreme angst was vaak een accumulatiekans, maar alleen op de index vertrouwen riskeert «een vallend mes te vangen». Deze score weegt ook RSI, MACD, Mayer Multiple, daling en gemiddelde-kruisingen mee, en verlaagt de score behoudend in dalende trends.' },
        { q: 'Hoe wordt de koopmoment-score berekend?', a: 'Elk van de 7 indicatoren wordt omgezet naar een deelscore van 0–100 en gewogen. Het resultaat is 0–100, in 5 banden.' },
        { q: 'Is het gratis? Moet ik iets installeren?', a: 'Het is volledig gratis en zonder installatie. Realtime data komt van de publieke API’s van CoinGecko, Binance en Alternative.me.' },
        { q: 'Wat is het verschil tussen de index en de koopmoment-score?', a: 'De index is één sentimentmaatstaf (0–100); de koopmoment-score is een samenstelling van 7 indicatoren inclusief de index (0–100).' },
        { q: 'Waar komen de gegevens vandaan en hoe vaak worden ze ververst?', a: 'De Angst- & Hebzucht-index komt van Alternative.me; prijzen en dagcandles van de publieke API’s van CoinGecko en Binance; on-chain-metrieken van CoinMetrics. Het scherm ververst ongeveer elke minuut automatisch.' },
        { q: 'Moet ik nu Polkadot kopen?', a: 'Er is geen eenduidig antwoord, maar de koopmoment-score (0–100) geeft een objectief beeld of de markt in een oversold/angst-zone of een oververhitte/hebzucht-zone zit. Op het langetermijn-tabblad (tegendraads) markeren hoge scores zones waar angst en onderwaardering samenvallen — historisch gunstig voor DCA — terwijl lage scores waarschuwen voor oververhitting. Het is een referentiesignaal, geen beleggingsadvies.' },
        { q: 'Hoe verschillen korte- en langetermijn-kooptiming?', a: 'De score is verdeeld over twee tabbladen. Korte termijn (momentum) hanteert een trendvolgende blik van 1–3 maanden en stijgt bij sterke opwaartse trends; lange termijn (tegendraads) hanteert een cyclusblik van ruim een jaar en stijgt bij angst en onderwaardering. In backtests sinds 2017 werkte momentum beter op korte termijn en tegendraads beter op lange termijn.' },
        { q: 'Wat is de BOTTOM RADAR (bodemscore)?', a: 'Een hulpmeter die met on-chain-metrieken zoals de MVRV Z-score meet waar de marktkapitalisatie staat ten opzichte van de gemiddelde kostprijs van beleggers, en de nabijheid van historische bodemzones toont op een schaal van 0–100. De volledige berekening staat op de pagina «Bitcoin-bodem».' }
      ],
      disclaimer: '⚠ Deze score is een referentiesignaal uit publieke indicatoren, geen beleggingsadvies. Alle beslissingen en verantwoordelijkheid zijn van uzelf.'
    },
    th: {
      title: 'ดัชนีความกลัวและความโลภโพลคาดอต และคะแนนจังหวะซื้อ',
      intro: 'แดชบอร์ดฟรีที่รวม 7 ตัวชี้วัดแบบเรียลไทม์ — รวมถึงดัชนีความกลัวและความโลภของโพลคาดอต — เป็นคะแนน 0–100 ว่า “ตอนนี้เป็นจังหวะซื้อหรือไม่?” ใช้งานในเบราว์เซอร์ได้ทันที ไม่ต้องติดตั้ง รองรับ 13 ภาษา',
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
        { q: 'ถ้าดัชนีต่ำควรซื้อโพลคาดอตไหม?', a: 'ความกลัวสุดขีดในอดีตมักเป็นโอกาสทยอยซื้อ แต่ดูเพียงดัชนีอย่างเดียวเสี่ยง “รับมีดที่กำลังตก” คะแนนนี้ยังพิจารณา RSI, MACD, Mayer Multiple, การย่อ และการตัดกันของเส้นเฉลี่ย และลดคะแนนอย่างระมัดระวังในแนวโน้มขาลง' },
        { q: 'คะแนนจังหวะซื้อคำนวณอย่างไร?', a: 'แปลงแต่ละตัวชี้วัดทั้ง 7 เป็นคะแนนย่อย 0–100 แล้วถ่วงน้ำหนักรวมกัน ผลลัพธ์คือ 0–100 แสดงเป็น 5 ระดับ' },
        { q: 'ฟรีไหม? ต้องติดตั้งไหม?', a: 'ฟรีทั้งหมดและไม่ต้องติดตั้ง ข้อมูลเรียลไทม์มาจาก API สาธารณะของ CoinGecko, Binance และ Alternative.me' },
        { q: 'ดัชนีกับคะแนนจังหวะซื้อต่างกันอย่างไร?', a: 'ดัชนีเป็นตัวชี้วัดอารมณ์เดียว (0–100); คะแนนจังหวะซื้อเป็นคะแนนรวมจาก 7 ตัวชี้วัดรวมถึงดัชนี (0–100)' },
        { q: 'ข้อมูลมาจากไหน อัปเดตบ่อยแค่ไหน?', a: 'ดัชนีความกลัว-ความโลภมาจาก Alternative.me ราคาและแท่งเทียนรายวันมาจาก API สาธารณะของ CoinGecko และ Binance ส่วนตัวชี้วัดออนเชนมาจาก CoinMetrics หน้าจออัปเดตอัตโนมัติราวทุก 1 นาที' },
        { q: 'ตอนนี้ควรซื้อโพลคาดอตไหม?', a: 'ไม่มีคำตอบตายตัว แต่คะแนนจังหวะซื้อ (0–100) ช่วยประเมินอย่างเป็นกลางว่าตลาดอยู่ในโซนขายมากเกิน/ความกลัว หรือโซนร้อนแรง/ความโลภ ในแท็บระยะยาว (สวนตลาด) คะแนนยิ่งสูงหมายถึงโซนที่ความกลัวและราคาต่ำกว่ามูลค่าทับซ้อนกัน ซึ่งในอดีตเอื้อต่อ DCA ส่วนคะแนนต่ำเตือนถึงความร้อนแรง เป็นเพียงสัญญาณอ้างอิง ไม่ใช่คำแนะนำการลงทุน' },
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
  /* 푸터 설명 문단(.foot-desc) — 폴카닷 언급이 있어 공통 foot-i18n.js 가 아니라 여기에 둔다 */
  var FOOT_DESC = {
    ko: 'broodev는 설치 없이 브라우저에서 바로 쓰는 무료 웹앱을 만드는 앱 포트폴리오입니다. 이 페이지의 폴카닷 공포·탐욕 지수와 매수 타이밍 점수는 공개 지표를 합성한 참고 정보이며 투자 자문이 아닙니다. 광고는 Google AdSense를 통해 게재될 수 있습니다.',
    en: 'broodev is a portfolio of free web apps that run right in your browser with no install. The Polkadot Fear & Greed Index and buy-timing score on this page are reference information synthesized from public indicators, not investment advice. Ads may be served through Google AdSense.',
    ja: 'broodevは、インストール不要でブラウザからすぐ使える無料Webアプリを作るアプリポートフォリオです。このページのポルカドット恐怖・強欲指数と買い時スコアは公開指標を合成した参考情報であり、投資助言ではありません。広告はGoogle AdSenseを通じて掲載される場合があります。',
    zh: 'broodev 是一个应用作品集，制作无需安装、在浏览器中即可直接使用的免费网页应用。本页的波卡恐惧与贪婪指数和买入时机评分是综合公开指标得出的参考信息，不构成投资建议。广告可能通过 Google AdSense 投放。',
    'zh-Hant': 'broodev 是一個應用作品集，製作無需安裝、在瀏覽器中即可直接使用的免費網頁應用。本頁的波卡恐懼與貪婪指數和買入時機評分是綜合公開指標得出的參考資訊，不構成投資建議。廣告可能透過 Google AdSense 刊登。',
    th: 'broodev คือพอร์ตโฟลิโอแอปที่สร้างเว็บแอปฟรีซึ่งใช้งานได้ทันทีในเบราว์เซอร์โดยไม่ต้องติดตั้ง ดัชนีความกลัว-ความโลภโพลคาดอตและคะแนนจังหวะซื้อในหน้านี้เป็นข้อมูลอ้างอิงที่สังเคราะห์จากตัวชี้วัดสาธารณะ ไม่ใช่คำแนะนำการลงทุน โฆษณาอาจแสดงผ่าน Google AdSense',
    es: 'broodev es un portafolio de aplicaciones web gratuitas que funcionan directamente en el navegador, sin instalación. El Índice de Miedo y Codicia de Polkadot y la puntuación de momento de compra de esta página son información de referencia elaborada a partir de indicadores públicos, no asesoramiento de inversión. Los anuncios pueden mostrarse a través de Google AdSense.',
    fr: 'broodev est un portfolio d’applications web gratuites qui s’utilisent directement dans le navigateur, sans installation. L’indice Peur & Avidité du Polkadot et le score de timing d’achat de cette page sont des informations de référence issues d’indicateurs publics, et non un conseil en investissement. Des annonces peuvent être diffusées via Google AdSense.',
    de: 'broodev ist ein Portfolio kostenloser Web-Apps, die ohne Installation direkt im Browser laufen. Der Polkadot-Angst-und-Gier-Index und der Kauf-Timing-Score auf dieser Seite sind aus öffentlichen Indikatoren zusammengesetzte Referenzinformationen und keine Anlageberatung. Werbung kann über Google AdSense ausgeliefert werden.',
    it: 'broodev è un portfolio di web app gratuite che funzionano direttamente nel browser, senza installazione. L’Indice di Paura e Avidità di Polkadot e il punteggio di timing d’acquisto in questa pagina sono informazioni di riferimento ricavate da indicatori pubblici, non una consulenza di investimento. Gli annunci possono essere pubblicati tramite Google AdSense.',
    pt: 'O broodev é um portefólio de aplicações web gratuitas que funcionam diretamente no navegador, sem instalação. O Índice de Medo e Ganância do Polkadot e a pontuação de momento de compra desta página são informação de referência sintetizada a partir de indicadores públicos, não aconselhamento de investimento. Os anúncios podem ser apresentados através do Google AdSense.',
    ru: 'broodev — это портфолио бесплатных веб-приложений, которые работают прямо в браузере без установки. Индекс страха и жадности полкадота и оценка момента покупки на этой странице — справочная информация, собранная из открытых индикаторов, а не инвестиционная рекомендация. Реклама может показываться через Google AdSense.',
    nl: 'broodev is een portfolio van gratis webapps die zonder installatie direct in je browser werken. De Polkadot Angst- en Hebzuchtindex en de koop-timingscore op deze pagina zijn referentie-informatie samengesteld uit openbare indicatoren, geen beleggingsadvies. Advertenties kunnen via Google AdSense worden getoond.'
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
    "title": "Polkadot (DOT) Buy-Timing Score and Market-Wide Fear & Greed",
    "intro": "This page applies RSI(14), MACD(12·26·9), the Mayer Multiple, the drawdown from the 365-day high and the 50/200 golden/death cross to Polkadot’s daily price, then adds the market-wide Fear & Greed Index and an MVRV Z-Score slot, so all seven indicators sit on one screen. Because there is no current MVRV data for DOT, the 0–100 buy-timing score is built from the remaining indicators. It is free and runs in your browser with no install.",
    "coinH": "What is Polkadot (DOT)?",
    "coinP": [
     "Polkadot is a multichain network conceived by Ethereum co-founder Gavin Wood. Its whitepaper appeared in 2016 and its mainnet launched in May 2020. The Swiss-based Web3 Foundation backs the project, and Parity Technologies built the core software. A central Relay Chain handles security and consensus, while the parachains connected to it share that security and run their own logic. The network uses Nominated Proof of Stake (NPoS), and DOT is used for staking, governance votes and securing blockspace.",
     "From the start DOT had no fixed supply cap: new tokens are issued every year to pay staking rewards. In August 2020 the token was redenominated by a factor of 100 (1 new DOT = 0.01 old DOT). Parachain slot auctions began in late 2021, and in 2024 they gave way to Agile Coretime, under which teams buy blockspace time directly. In 2025 an on-chain referendum approved a supply cap of 2.1 billion DOT."
    ],
    "applyH": "Applying the indicators to Polkadot",
    "apply": [
     "Volatility: DOT swings more than Bitcoin from day to day and tends to fall harder when the market turns. An RSI of 30 can stay oversold for longer on DOT, so it is safer to wait for a MACD turn as confirmation.",
     "Fear & Greed: the Alternative.me index measures sentiment across the whole crypto market, weighted toward Bitcoin. News that only concerns Polkadot barely moves it, so treat it as background on the overall mood.",
     "MVRV: CoinMetrics community data for DOT MVRV has not been updated since June 3, 2022, so it is unavailable here (N/A). The score spreads its weight across the other indicators.",
     "Mayer Multiple and drawdown: the thresholds (0.8 and 2.4; −30% and −50%) come from Bitcoin’s cycles. After its 2021 peak DOT spent long stretches below its 200-day average and far beneath its highs, so these readings do not automatically mark a bottom.",
     "Supply: staking rewards add new DOT every year, but the indicators look only at price, so dilution from issuance does not show up directly in the score."
    ],
    "histH": "Polkadot price cycles at a glance",
    "hist": [
     "2017: Token sale (ICO). That November, a bug in a Parity multisig wallet froze a large share of the funds raised.",
     "2020: Mainnet launched in May. DOT transfers opened in August, major exchanges began trading it, and the redenomination took effect the same month.",
     "2021: All-time high of about $55 in November, the same month the first parachain slot auction opened.",
     "2022: Fell more than 90% from its peak during the crypto bear market.",
     "2024–2025: The rally did not bring back the 2021 high, while structural changes followed, including Agile Coretime and the supply-cap vote."
    ],
    "faq": [
     {
      "q": "Is there a separate Polkadot fear index?",
      "a": "Alternative.me does not publish per-coin indexes; it publishes one Bitcoin-centric index for the whole crypto market. On the Polkadot page it is labelled “market-wide”. DOT’s own sentiment shows up indirectly in price indicators such as RSI and MACD."
     },
     {
      "q": "Does Polkadot get an MVRV reading?",
      "a": "No. CoinMetrics community API data for DOT MVRV stops on June 3, 2022, so the card shows N/A rather than a stale value. The buy-timing score reweights the remaining indicators."
     },
     {
      "q": "Should I buy Polkadot now?",
      "a": "This page does not recommend buying or selling. In the default ‘Long · Contrarian’ mode, a high score only means that contrarian conditions — oversold, fear, a deep drawdown — are showing up across several indicators at once. For a coin like DOT that has been through a long downtrend, ‘cheap’ signals can persist, so check which indicators are pushing the score up."
     },
     {
      "q": "Are staking rewards or inflation part of the score?",
      "a": "No. The score is calculated only from DOT price data (CoinGecko, Binance) and the market-wide Fear & Greed Index. Dilution from newly issued DOT and staking yields need to be checked separately."
     },
     {
      "q": "Is the Polkadot score calculated the same way as Bitcoin’s?",
      "a": "The formulas are the same, but the input is DOT’s own daily price. The two pages share only the Fear & Greed Index, and the Thermocap indicator on the Bitcoin page is not included here. The same score can therefore describe quite different situations for the two coins."
     }
    ]
   },
   "ja": {
    "title": "ポルカドット(DOT)の買い時スコアと市場全体の恐怖・強欲指数",
    "intro": "このページでは、ポルカドット(DOT)の日足価格にRSI(14)、MACD(12・26・9)、マイヤー倍率、365日高値からの下落率、50/200のゴールデン/デッドクロスを適用し、市場全体の恐怖・強欲指数とMVRV Zスコアの枠を加えた7指標をまとめて表示します。DOTには最新のMVRVデータがないため、0〜100の買い時スコアは残りの指標で算出します。インストール不要で、ブラウザから無料で使えます。",
    "coinH": "ポルカドット(DOT)とは？",
    "coinP": [
     "ポルカドットは、イーサリアム共同創業者のギャビン・ウッドが構想したマルチチェーン・ネットワークです。2016年にホワイトペーパーが公開され、2020年5月にメインネットが始動しました。スイスのWeb3財団がプロジェクトを支援し、Parity Technologiesが中核ソフトウェアを開発しました。中心のリレーチェーンがセキュリティと合意形成を担い、接続されたパラチェーンはそのセキュリティを共有しながら独自の機能を動かします。合意方式はノミネーテッド・プルーフ・オブ・ステーク(NPoS)で、DOTはステーキング、ガバナンス投票、ブロックスペースの確保に使われます。",
     "DOTには当初から決まった発行上限がなく、毎年新たに発行される分でステーキング報酬が支払われてきました。2020年8月には単位を100分の1に分けるリデノミネーション(新1 DOT＝旧0.01 DOT)が実施されています。2021年末にパラチェーンのスロットオークションが始まり、2024年にはブロックスペースの利用時間を直接購入するAgile Coretimeに置き換えられました。2025年にはオンチェーン投票で、総供給量の上限を21億DOTとする案が可決されています。"
    ],
    "applyH": "ポルカドットに指標を当てはめるときの注意点",
    "apply": [
     "ボラティリティ：DOTはビットコインより日々の値動きが大きく、相場が崩れるとより大きく下げる傾向があります。同じRSI 30でもDOTでは売られすぎが長引きやすいため、MACDの転換を確認してから判断するほうが安全です。",
     "恐怖・強欲指数：Alternative.meの指数は、ビットコイン中心の暗号資産市場全体のセンチメントです。ポルカドット固有の材料はほとんど反映されないので、相場全体の空気を知る参考程度に見てください。",
     "MVRV：CoinMetricsコミュニティデータのDOT MVRVは2022年6月3日以降更新されておらず、このページでは利用できません(N/A)。スコアはその重みを他の指標に振り分けて計算します。",
     "マイヤー倍率と下落率：基準値(0.8と2.4、−30%と−50%)はビットコインのサイクルから導かれたものです。DOTは2021年の高値以降、200日線を下回り高値から大きく離れた状態が長く続いたため、これらの数値がそのまま底を意味するわけではありません。",
     "供給：ステーキング報酬で毎年DOTが増えますが、指標は価格しか見ないため、新規発行による希薄化はスコアに直接は表れません。"
    ],
    "histH": "ポルカドットの価格サイクルの要約",
    "hist": [
     "2017年：トークンセール(ICO)を実施。同年11月、Parityのマルチシグウォレットのバグにより調達資金のかなりの部分が凍結されました。",
     "2020年：5月にメインネットが始動。8月にDOTの送金が可能になって主要取引所で取引が始まり、同月にリデノミネーションが実施されました。",
     "2021年：11月に約55ドルの史上最高値を記録。同じ月に最初のパラチェーン・スロットオークションが開かれました。",
     "2022年：暗号資産の弱気相場で、高値から90%以上下落しました。",
     "2024〜2025年：上昇相場でも2021年の高値は回復せず、その間にAgile Coretimeの導入や供給上限の投票といった構造的な変化が続きました。"
    ],
    "faq": [
     {
      "q": "ポルカドット専用の恐怖指数はありますか？",
      "a": "Alternative.meはコインごとの指数を出しておらず、発表しているのはビットコイン中心の暗号資産市場全体の指数ひとつです。ポルカドットのページでは「市場全体」と明記しています。DOT自体のセンチメントは、RSIやMACDといった価格指標から間接的に読み取れます。"
     },
     {
      "q": "ポルカドットでもMVRVは表示されますか？",
      "a": "表示されません。CoinMetricsコミュニティAPIのDOT MVRVデータは2022年6月3日で止まっているため、古い値を使わないようN/Aとしています。買い時スコアは残りの指標で重みを付け直して計算します。"
     },
     {
      "q": "今ポルカドットを買ってもいいですか？",
      "a": "このページは売買を勧めるものではありません。初期設定の「長期 · 逆張り」モードでスコアが高いのは、売られすぎ・恐怖・深い下落といった逆張りの条件が複数の指標で同時に出ているという意味にすぎません。DOTのように長い下落トレンドを経たコインでは「割安」シグナルが長く続くことがあるので、どの指標がスコアを押し上げているかを確かめてください。"
     },
     {
      "q": "ステーキング報酬やインフレはスコアに含まれますか？",
      "a": "含まれません。スコアはDOTの価格データ(CoinGecko・Binance)と市場全体の恐怖・強欲指数だけで計算します。新規発行による希薄化やステーキング利回りは別途確認が必要です。"
     },
     {
      "q": "ポルカドットのスコアはビットコインと同じ方法で計算されますか？",
      "a": "計算式は同じですが、入力はDOT自身の日足価格です。2つのページで共通なのは恐怖・強欲指数だけで、ビットコインのページにあるThermocap指標はここにはありません。そのため同じスコアでも、2つのコインの状況はかなり異なることがあります。"
     }
    ]
   },
   "ko": {
    "title": "폴카닷(DOT) 매수 타이밍 점수와 시장 전체 공포·탐욕 지수",
    "intro": "이 화면은 폴카닷(DOT)의 일봉 가격에 RSI(14), MACD(12·26·9), 마이어 배수, 365일 고점 대비 낙폭, 50/200 골든·데드 크로스를 적용하고, 암호화폐 시장 전체의 공포·탐욕 지수와 MVRV Z-점수 칸을 더해 7개 지표를 한눈에 보여 줍니다. DOT는 최신 MVRV 데이터가 없어 0~100 매수 타이밍 점수를 나머지 지표로 계산합니다. 설치 없이 브라우저에서 무료로 쓸 수 있습니다.",
    "coinH": "폴카닷(DOT)이란?",
    "coinP": [
     "폴카닷은 이더리움 공동 창업자 개빈 우드가 구상한 멀티체인 네트워크로, 2016년 백서가 공개됐고 2020년 5월 메인넷이 출범했습니다. 스위스에 있는 웹3 재단(Web3 Foundation)이 프로젝트를 지원하고 Parity Technologies가 핵심 소프트웨어를 개발했습니다. 중앙의 릴레이 체인이 보안과 합의를 맡고, 여기에 연결된 파라체인들은 그 보안을 공유하면서 각자의 기능을 수행합니다. 합의 방식은 지명 지분증명(NPoS)이며, DOT는 스테이킹·거버넌스 투표·블록 공간 확보에 쓰입니다.",
     "DOT는 처음부터 고정된 발행 상한이 없었고, 매년 새로 발행되는 물량으로 스테이킹 보상을 지급해 왔습니다. 2020년 8월에는 단위를 100분의 1로 나누는 리디노미네이션(새 1 DOT = 기존 0.01 DOT)이 시행됐습니다. 2021년 말 파라체인 슬롯 경매가 시작됐고, 2024년에는 블록 공간 사용 시간을 직접 사는 Agile Coretime 방식으로 바뀌었습니다. 2025년에는 온체인 투표에서 총발행량 상한을 21억 DOT로 정하는 안이 통과됐습니다."
    ],
    "applyH": "폴카닷에 지표를 적용할 때",
    "apply": [
     "변동성: DOT는 비트코인보다 하루 변동 폭이 크고, 시장이 꺾일 때 더 크게 떨어지는 경향이 있습니다. 같은 RSI 30이라도 DOT에서는 과매도가 더 오래 이어질 수 있으니 MACD 전환으로 확인한 뒤 판단하는 편이 안전합니다.",
     "공포·탐욕 지수: Alternative.me 지수는 비트코인 중심의 암호화폐 시장 전체 심리입니다. 폴카닷만의 호재·악재는 거의 반영되지 않으므로 시장 분위기를 가늠하는 참고값으로만 보세요.",
     "MVRV: CoinMetrics 커뮤니티 데이터의 DOT MVRV는 2022년 6월 3일 이후 갱신되지 않아 이 화면에서는 쓸 수 없습니다(N/A). 점수는 그 가중치를 다른 지표에 나눠 계산합니다.",
     "마이어 배수·낙폭: 기준값(0.8과 2.4, -30%와 -50%)은 비트코인 사이클에서 나온 것입니다. DOT는 2021년 고점 이후 200일선 아래, 고점에서 멀리 떨어진 상태가 오래 이어졌기 때문에 이런 수치가 곧바로 바닥을 뜻하지는 않습니다.",
     "공급: 스테이킹 보상으로 DOT가 해마다 늘어나지만 지표는 가격만 보므로, 새 발행에 따른 희석 효과는 점수에 직접 나타나지 않습니다."
    ],
    "histH": "폴카닷 가격 사이클 요약",
    "hist": [
     "2017년: 토큰 판매(ICO) 진행. 같은 해 11월 Parity 멀티시그 지갑 버그로 모금액의 상당 부분이 동결됐습니다.",
     "2020년: 5월 메인넷 출범. 8월 DOT 전송이 열리며 주요 거래소 거래가 시작됐고, 같은 달 리디노미네이션이 시행됐습니다.",
     "2021년: 11월 약 55달러로 사상 최고가를 기록했고, 같은 달 첫 파라체인 슬롯 경매가 열렸습니다.",
     "2022년: 암호화폐 약세장 속에 고점 대비 90% 넘게 하락했습니다.",
     "2024~2025년: 상승장에서도 2021년 고점을 되찾지 못했고, 그사이 Agile Coretime 도입과 공급 상한 투표 같은 구조 변화가 이어졌습니다."
    ],
    "faq": [
     {
      "q": "폴카닷 공포지수가 따로 있나요?",
      "a": "Alternative.me는 코인별 지수를 내지 않고, 비트코인 중심의 암호화폐 시장 전체 지수 하나만 발표합니다. 폴카닷 화면에서는 이를 ‘시장 전체’로 표시합니다. DOT 자체의 심리는 RSI·MACD 같은 가격 지표로 간접 확인할 수 있습니다."
     },
     {
      "q": "폴카닷에도 MVRV가 나오나요?",
      "a": "나오지 않습니다. CoinMetrics 커뮤니티 API의 DOT MVRV 데이터가 2022년 6월 3일에서 멈춰 있어, 오래된 값을 쓰지 않도록 N/A로 처리합니다. 매수 타이밍 점수는 나머지 지표로 가중치를 다시 맞춰 계산합니다."
     },
     {
      "q": "지금 폴카닷을 사도 되나요?",
      "a": "이 화면은 매수나 매도를 권하지 않습니다. 기본값인 ‘장기 · 역발상’ 모드에서 점수가 높다는 것은 과매도·공포·깊은 낙폭 같은 역발상 조건이 여러 지표에서 함께 나타났다는 뜻일 뿐입니다. DOT처럼 긴 하락 추세를 겪은 코인은 ‘싸다’는 신호가 오래 이어질 수 있으니, 어떤 지표가 점수를 끌어올렸는지 확인하세요."
     },
     {
      "q": "스테이킹 보상이나 인플레이션도 점수에 들어가나요?",
      "a": "들어가지 않습니다. 점수는 DOT 가격 데이터(CoinGecko·Binance)와 시장 전체 공포·탐욕 지수로만 계산합니다. 새 DOT 발행에 따른 희석이나 스테이킹 수익률은 따로 확인해야 합니다."
     },
     {
      "q": "폴카닷 점수는 비트코인 점수와 같은 방식으로 계산되나요?",
      "a": "계산식은 같지만 입력값은 DOT 자체의 일봉 가격입니다. 두 화면이 공유하는 것은 공포·탐욕 지수뿐이며, 비트코인 화면에 있는 Thermocap 지표는 여기 없습니다. 그래서 같은 점수라도 두 코인의 상황은 크게 다를 수 있습니다."
     }
    ]
   },
   "zh": {
    "title": "波卡(DOT)买入时机评分与全市场恐惧与贪婪指数",
    "intro": "本页将RSI(14)、MACD(12·26·9)、梅耶倍数、距365日高点回撤、50/200金叉/死叉应用于波卡(DOT)的日线价格，再加上全市场恐惧与贪婪指数和MVRV Z分数栏位，共7项指标集中展示。由于DOT没有最新的MVRV数据，0–100买入时机评分由其余指标计算。无需安装，在浏览器中即可免费使用。",
    "coinH": "什么是波卡(DOT)？",
    "coinP": [
     "波卡是由以太坊联合创始人加文·伍德构想的多链网络，2016年发布白皮书，2020年5月主网上线。总部位于瑞士的Web3基金会支持该项目，核心软件由Parity Technologies开发。中央的中继链负责安全与共识，接入的平行链共享这份安全性，同时运行各自的功能。网络采用提名权益证明(NPoS)，DOT用于质押、治理投票以及获取区块空间。",
     "DOT从一开始就没有固定的供应上限，每年新增发行的代币用于支付质押奖励。2020年8月，DOT进行了面额调整，单位缩小为原来的百分之一(1枚新DOT＝0.01枚旧DOT)。2021年底平行链插槽拍卖启动，2024年改为直接购买区块空间使用时间的Agile Coretime模式。2025年，一项将总供应量上限定为21亿枚DOT的提案在链上公投中获得通过。"
    ],
    "applyH": "将指标用于波卡时的注意事项",
    "apply": [
     "波动性：DOT的日内波动大于比特币，市场转弱时往往跌得更深。同样是RSI 30，DOT的超卖状态可能持续更久，等待MACD转向确认会更稳妥。",
     "恐惧与贪婪指数：Alternative.me的指数衡量的是以比特币为主的整个加密市场情绪，波卡自身的利好或利空几乎不会体现在其中，只适合作为了解整体氛围的参考。",
     "MVRV：CoinMetrics社区数据中的DOT MVRV自2022年6月3日起不再更新，因此本页无法使用(N/A)。评分会把这部分权重重新分配给其他指标。",
     "梅耶倍数与回撤：阈值(0.8与2.4、−30%与−50%)源自比特币的周期。DOT在2021年高点之后，长期处于200日均线下方、远低于高点的状态，这些读数并不自动意味着见底。",
     "供应：质押奖励使DOT每年增加，但指标只看价格，新增发行带来的稀释不会直接反映在评分中。"
    ],
    "histH": "波卡价格周期概览",
    "hist": [
     "2017年：进行代币发售(ICO)。同年11月，Parity多签钱包的漏洞导致相当一部分募集资金被冻结。",
     "2020年：5月主网上线；8月开放DOT转账，主要交易所开始交易，同月完成面额调整。",
     "2021年：11月创下约55美元的历史最高价，同月首次平行链插槽拍卖开启。",
     "2022年：在加密熊市中较高点下跌超过90%。",
     "2024–2025年：上涨行情中也未能收复2021年高点，同期还经历了Agile Coretime上线和供应上限投票等结构性变化。"
    ],
    "faq": [
     {
      "q": "波卡有单独的恐惧指数吗？",
      "a": "Alternative.me不提供单个币种的指数，只发布一个以比特币为主的全加密市场指数。在波卡页面上，它会标注为“全市场”。DOT自身的情绪可以通过RSI、MACD等价格指标间接观察。"
     },
     {
      "q": "波卡也能看到MVRV吗？",
      "a": "不能。CoinMetrics社区API的DOT MVRV数据停在2022年6月3日，为避免使用过时数值，卡片显示为N/A。买入时机评分会用其余指标重新分配权重后计算。"
     },
     {
      "q": "现在可以买波卡吗？",
      "a": "本页不提供买卖建议。在默认的“长期 · 逆向”模式下，评分高只表示超卖、恐惧、深度回撤等逆向条件同时出现在多项指标中。像DOT这样经历过长期下跌趋势的币种，“便宜”信号可能持续很久，请查看是哪些指标推高了评分。"
     },
     {
      "q": "质押奖励或通胀会计入评分吗？",
      "a": "不会。评分只使用DOT价格数据(CoinGecko、Binance)和全市场恐惧与贪婪指数计算。新增发行造成的稀释和质押收益率需要另行查看。"
     },
     {
      "q": "波卡评分和比特币评分的算法一样吗？",
      "a": "公式相同，但输入的是DOT自身的日线价格。两个页面共用的只有恐惧与贪婪指数，比特币页面上的Thermocap指标在这里没有。因此同样的分数，在两种币上可能代表截然不同的情况。"
     }
    ]
   },
   "zh-Hant": {
    "title": "波卡(DOT)買入時機評分與全市場恐懼與貪婪指數",
    "intro": "本頁將RSI(14)、MACD(12·26·9)、梅耶倍數、距365日高點回撤、50/200黃金/死亡交叉套用於波卡(DOT)的日線價格，再加上全市場恐懼與貪婪指數和MVRV Z分數欄位，共7項指標集中呈現。由於DOT沒有最新的MVRV資料，0–100買入時機評分以其餘指標計算。免安裝，在瀏覽器中即可免費使用。",
    "coinH": "什麼是波卡(DOT)？",
    "coinP": [
     "波卡是由以太坊共同創辦人加文·伍德構想的多鏈網路，2016年發布白皮書，2020年5月主網上線。總部位於瑞士的Web3基金會支持此專案，核心軟體由Parity Technologies開發。中央的中繼鏈負責安全與共識，接入的平行鏈共享這份安全性，同時執行各自的功能。網路採用提名權益證明(NPoS)，DOT用於質押、治理投票以及取得區塊空間。",
     "DOT從一開始就沒有固定的供應上限，每年新發行的代幣用來支付質押獎勵。2020年8月，DOT進行面額調整，單位縮小為原來的百分之一(1枚新DOT＝0.01枚舊DOT)。2021年底平行鏈插槽拍賣啟動，2024年改為直接購買區塊空間使用時間的Agile Coretime模式。2025年，一項將總供應量上限定為21億枚DOT的提案在鏈上公投中通過。"
    ],
    "applyH": "將指標用於波卡時的注意事項",
    "apply": [
     "波動性：DOT的每日波動大於比特幣，市場轉弱時往往跌得更深。同樣是RSI 30，DOT的超賣狀態可能持續更久，等待MACD轉向確認會更穩妥。",
     "恐懼與貪婪指數：Alternative.me的指數衡量的是以比特幣為主的整體加密市場情緒，波卡本身的利多或利空幾乎不會反映在其中，只適合作為了解整體氛圍的參考。",
     "MVRV：CoinMetrics社群資料中的DOT MVRV自2022年6月3日起不再更新，因此本頁無法使用(N/A)。評分會把這部分權重重新分配給其他指標。",
     "梅耶倍數與回撤：門檻(0.8與2.4、−30%與−50%)來自比特幣的週期。DOT在2021年高點之後，長期處於200日均線下方、遠低於高點的狀態，這些讀數並不代表必然見底。",
     "供應：質押獎勵使DOT每年增加，但指標只看價格，新發行帶來的稀釋不會直接反映在評分中。"
    ],
    "histH": "波卡價格週期概覽",
    "hist": [
     "2017年：進行代幣銷售(ICO)。同年11月，Parity多簽錢包的漏洞導致相當一部分募集資金遭凍結。",
     "2020年：5月主網上線；8月開放DOT轉帳，主要交易所開始交易，同月完成面額調整。",
     "2021年：11月創下約55美元的歷史最高價，同月首次平行鏈插槽拍賣開啟。",
     "2022年：在加密熊市中自高點下跌超過90%。",
     "2024–2025年：上漲行情中也未能收復2021年高點，同期還經歷了Agile Coretime上線與供應上限投票等結構性變化。"
    ],
    "faq": [
     {
      "q": "波卡有單獨的恐懼指數嗎？",
      "a": "Alternative.me不提供個別幣種的指數，只發布一個以比特幣為主的全加密市場指數。在波卡頁面上，它會標示為「全市場」。DOT本身的情緒可透過RSI、MACD等價格指標間接觀察。"
     },
     {
      "q": "波卡也看得到MVRV嗎？",
      "a": "看不到。CoinMetrics社群API的DOT MVRV資料停在2022年6月3日，為避免使用過時數值，卡片顯示為N/A。買入時機評分會以其餘指標重新分配權重後計算。"
     },
     {
      "q": "現在可以買波卡嗎？",
      "a": "本頁不提供買賣建議。在預設的「長期 · 逆向」模式下，評分高只代表超賣、恐懼、深度回撤等逆向條件同時出現在多項指標中。像DOT這樣經歷長期下跌趨勢的幣種，「便宜」訊號可能持續很久，請查看是哪些指標推高了評分。"
     },
     {
      "q": "質押獎勵或通膨會計入評分嗎？",
      "a": "不會。評分只使用DOT價格資料(CoinGecko、Binance)與全市場恐懼與貪婪指數計算。新發行造成的稀釋與質押收益率需要另行查看。"
     },
     {
      "q": "波卡評分和比特幣評分的算法一樣嗎？",
      "a": "公式相同，但輸入的是DOT本身的日線價格。兩個頁面共用的只有恐懼與貪婪指數，比特幣頁面上的Thermocap指標在這裡沒有。因此同樣的分數，在兩種幣上可能代表截然不同的情況。"
     }
    ]
   },
   "th": {
    "title": "คะแนนจังหวะซื้อโพลคาดอต (DOT) และดัชนีความกลัว-ความโลภของทั้งตลาด",
    "intro": "หน้านี้นำ RSI(14), MACD(12·26·9), Mayer Multiple, การย่อจากจุดสูงสุด 365 วัน และ Golden/Death Cross 50/200 มาคำนวณกับราคารายวันของโพลคาดอต (DOT) แล้วเพิ่มดัชนีความกลัว-ความโลภของทั้งตลาดและช่อง MVRV Z-Score รวมเป็น 7 ตัวชี้วัดในหน้าเดียว เนื่องจาก DOT ไม่มีข้อมูล MVRV ล่าสุด คะแนนจังหวะซื้อ 0–100 จึงคำนวณจากตัวชี้วัดที่เหลือ ใช้งานฟรีบนเบราว์เซอร์โดยไม่ต้องติดตั้ง",
    "coinH": "โพลคาดอต (DOT) คืออะไร?",
    "coinP": [
     "โพลคาดอตเป็นเครือข่ายหลายเชนที่ริเริ่มโดยแกวิน วู้ด ผู้ร่วมก่อตั้งอีเธอเรียม ไวท์เปเปอร์เผยแพร่ในปี 2016 และเมนเน็ตเปิดตัวในเดือนพฤษภาคม 2020 โดยมี Web3 Foundation ในสวิตเซอร์แลนด์เป็นผู้สนับสนุน และ Parity Technologies เป็นผู้พัฒนาซอฟต์แวร์หลัก รีเลย์เชนตรงกลางดูแลความปลอดภัยและฉันทามติ ส่วนพาราเชนที่เชื่อมต่อเข้ามาใช้ความปลอดภัยร่วมกันพร้อมทำงานตามฟังก์ชันของตัวเอง เครือข่ายใช้กลไก Nominated Proof of Stake (NPoS) และ DOT ใช้สำหรับการสเตก การโหวตกำกับดูแล และการจองพื้นที่บล็อก",
     "DOT ไม่มีเพดานอุปทานตายตัวมาตั้งแต่แรก โดยมีการออกเหรียญใหม่ทุกปีเพื่อจ่ายเป็นรางวัลการสเตก ในเดือนสิงหาคม 2020 มีการปรับหน่วยเหรียญ (redenomination) 100 เท่า (DOT ใหม่ 1 เหรียญ = DOT เดิม 0.01 เหรียญ) การประมูลสล็อตพาราเชนเริ่มขึ้นช่วงปลายปี 2021 และในปี 2024 ถูกแทนที่ด้วย Agile Coretime ซึ่งให้ทีมต่างๆ ซื้อเวลาใช้พื้นที่บล็อกได้โดยตรง ในปี 2025 การลงประชามติบนเชนได้อนุมัติเพดานอุปทานที่ 2.1 พันล้าน DOT"
    ],
    "applyH": "ข้อควรรู้เมื่อใช้ตัวชี้วัดกับโพลคาดอต",
    "apply": [
     "ความผันผวน: DOT แกว่งรายวันมากกว่าบิตคอยน์ และมักร่วงหนักกว่าเมื่อตลาดกลับตัวลง RSI ที่ 30 เท่ากันอาจค้างอยู่ในภาวะขายมากเกินได้นานกว่าใน DOT จึงควรรอให้ MACD กลับตัวเพื่อยืนยันก่อน",
     "ดัชนีความกลัว-ความโลภ: ดัชนีของ Alternative.me วัดอารมณ์ของตลาดคริปโตทั้งหมดโดยเน้นบิตคอยน์ ข่าวที่เกี่ยวกับโพลคาดอตโดยเฉพาะแทบไม่ทำให้ค่านี้ขยับ จึงควรใช้เป็นเพียงภาพรวมบรรยากาศตลาด",
     "MVRV: ข้อมูล MVRV ของ DOT จาก CoinMetrics เวอร์ชันชุมชนไม่ได้อัปเดตตั้งแต่วันที่ 3 มิถุนายน 2022 จึงใช้ไม่ได้ในหน้านี้ (N/A) คะแนนจะกระจายน้ำหนักส่วนนี้ไปยังตัวชี้วัดอื่น",
     "Mayer Multiple และการย่อตัว: เกณฑ์ (0.8 และ 2.4, −30% และ −50%) มาจากวัฏจักรของบิตคอยน์ หลังจุดสูงสุดปี 2021 DOT อยู่ใต้เส้นเฉลี่ย 200 วันและห่างจากจุดสูงสุดมากเป็นเวลานาน ค่าเหล่านี้จึงไม่ได้หมายถึงจุดต่ำสุดเสมอไป",
     "อุปทาน: รางวัลการสเตกทำให้ DOT เพิ่มขึ้นทุกปี แต่ตัวชี้วัดดูเฉพาะราคา ผลของการเจือจางจากเหรียญที่ออกใหม่จึงไม่ปรากฏในคะแนนโดยตรง"
    ],
    "histH": "สรุปวัฏจักรราคาโพลคาดอต",
    "hist": [
     "2017: จัดขายโทเคน (ICO) ในเดือนพฤศจิกายนปีเดียวกัน บั๊กในกระเป๋ามัลติซิกของ Parity ทำให้เงินที่ระดมได้จำนวนมากถูกแช่แข็ง",
     "2020: เมนเน็ตเปิดตัวในเดือนพฤษภาคม เดือนสิงหาคมเปิดให้โอน DOT ได้และกระดานเทรดหลักเริ่มซื้อขาย พร้อมปรับหน่วยเหรียญในเดือนเดียวกัน",
     "2021: ทำจุดสูงสุดตลอดกาลราว 55 ดอลลาร์ในเดือนพฤศจิกายน ซึ่งเป็นเดือนเดียวกับที่การประมูลสล็อตพาราเชนครั้งแรกเริ่มขึ้น",
     "2022: ร่วงกว่า 90% จากจุดสูงสุดในช่วงตลาดหมีคริปโต",
     "2024–2025: แม้ตลาดเป็นขาขึ้นก็ยังไม่กลับไปถึงจุดสูงสุดปี 2021 ขณะที่มีการเปลี่ยนแปลงเชิงโครงสร้างตามมา เช่น Agile Coretime และการโหวตเพดานอุปทาน"
    ],
    "faq": [
     {
      "q": "โพลคาดอตมีดัชนีความกลัวแยกต่างหากไหม?",
      "a": "Alternative.me ไม่ได้ออกดัชนีรายเหรียญ แต่เผยแพร่ดัชนีเดียวสำหรับตลาดคริปโตทั้งหมดซึ่งเน้นบิตคอยน์ ในหน้าโพลคาดอตจึงระบุว่าเป็นค่า “ทั้งตลาด” อารมณ์ตลาดของ DOT เองดูได้ทางอ้อมจากตัวชี้วัดราคาอย่าง RSI และ MACD"
     },
     {
      "q": "โพลคาดอตมีค่า MVRV ไหม?",
      "a": "ไม่มี ข้อมูล MVRV ของ DOT จาก CoinMetrics community API หยุดอยู่ที่วันที่ 3 มิถุนายน 2022 การ์ดจึงแสดง N/A แทนค่าที่ล้าสมัย และคะแนนจังหวะซื้อจะถ่วงน้ำหนักตัวชี้วัดที่เหลือใหม่"
     },
     {
      "q": "ตอนนี้ควรซื้อโพลคาดอตไหม?",
      "a": "หน้านี้ไม่ได้แนะนำให้ซื้อหรือขาย ในโหมดเริ่มต้น “ยาว · สวนทาง” คะแนนสูงหมายความเพียงว่าเงื่อนไขแบบสวนตลาด เช่น ขายมากเกิน ความกลัว และการย่อตัวลึก ปรากฏพร้อมกันในหลายตัวชี้วัด สำหรับเหรียญที่ผ่านขาลงยาวอย่าง DOT สัญญาณ “ราคาถูก” อาจคงอยู่นาน จึงควรดูว่าตัวชี้วัดใดเป็นตัวดันคะแนนขึ้น"
     },
     {
      "q": "รางวัลการสเตกหรือเงินเฟ้อนับรวมในคะแนนไหม?",
      "a": "ไม่นับ คะแนนคำนวณจากข้อมูลราคา DOT (CoinGecko, Binance) และดัชนีความกลัว-ความโลภทั้งตลาดเท่านั้น การเจือจางจากเหรียญที่ออกใหม่และผลตอบแทนการสเตกต้องตรวจสอบแยกต่างหาก"
     },
     {
      "q": "คะแนนโพลคาดอตคำนวณแบบเดียวกับบิตคอยน์ไหม?",
      "a": "สูตรเหมือนกัน แต่ข้อมูลที่ใช้คือราคารายวันของ DOT เอง สองหน้านี้ใช้ร่วมกันเพียงดัชนีความกลัว-ความโลภ และตัวชี้วัด Thermocap ที่มีในหน้าบิตคอยน์ไม่มีในหน้านี้ คะแนนเท่ากันจึงอาจสะท้อนสถานการณ์ที่ต่างกันมากของสองเหรียญ"
     }
    ]
   },
   "es": {
    "title": "Polkadot (DOT): puntuación de compra e índice de miedo y codicia del mercado",
    "intro": "Esta página aplica el RSI(14), el MACD(12·26·9), el múltiplo de Mayer, la caída desde el máximo de 365 días y el cruce dorado/de la muerte 50/200 al precio diario de Polkadot, y añade el índice de miedo y codicia de todo el mercado y una casilla para el MVRV Z-Score: siete indicadores en una sola vista. Como no hay datos de MVRV actualizados para DOT, la puntuación de compra de 0 a 100 se calcula con los demás indicadores. Es gratuita y funciona en el navegador sin instalar nada.",
    "coinH": "¿Qué es Polkadot (DOT)?",
    "coinP": [
     "Polkadot es una red multicadena ideada por Gavin Wood, cofundador de Ethereum. Su libro blanco se publicó en 2016 y la red principal arrancó en mayo de 2020. La Web3 Foundation, con sede en Suiza, respalda el proyecto, y Parity Technologies desarrolló el software central. Una Relay Chain central se encarga de la seguridad y el consenso, mientras que las parachains conectadas comparten esa seguridad y ejecutan su propia lógica. La red usa prueba de participación nominada (NPoS), y DOT sirve para hacer staking, votar en la gobernanza y asegurarse espacio de bloque.",
     "Desde el principio, DOT no tuvo un límite de suministro fijo: cada año se emiten tokens nuevos para pagar las recompensas de staking. En agosto de 2020 el token se redenominó en un factor de 100 (1 DOT nuevo = 0,01 DOT antiguo). Las subastas de slots de parachain comenzaron a finales de 2021 y en 2024 dieron paso a Agile Coretime, que permite comprar directamente tiempo de espacio de bloque. En 2025, un referéndum en cadena aprobó un límite de suministro de 2.100 millones de DOT."
    ],
    "applyH": "Cómo aplicar los indicadores a Polkadot",
    "apply": [
     "Volatilidad: DOT oscila más que Bitcoin día a día y suele caer con más fuerza cuando el mercado se gira. Un RSI de 30 puede mantenerse en sobreventa más tiempo en DOT, así que es más prudente esperar a que el MACD confirme el giro.",
     "Miedo y codicia: el índice de Alternative.me mide el sentimiento de todo el mercado cripto, con mucho peso de Bitcoin. Las noticias propias de Polkadot apenas lo mueven, así que úsalo solo como referencia del ambiente general.",
     "MVRV: los datos comunitarios de CoinMetrics sobre el MVRV de DOT no se actualizan desde el 3 de junio de 2022, por lo que aquí no está disponible (N/A). La puntuación reparte su peso entre los demás indicadores.",
     "Múltiplo de Mayer y caída: los umbrales (0,8 y 2,4; −30 % y −50 %) proceden de los ciclos de Bitcoin. Tras su máximo de 2021, DOT pasó largas temporadas por debajo de su media de 200 días y muy lejos de sus máximos, así que estas lecturas no implican automáticamente un suelo.",
     "Suministro: las recompensas de staking añaden DOT cada año, pero los indicadores solo miran el precio, de modo que la dilución por emisión no aparece directamente en la puntuación."
    ],
    "histH": "Resumen de los ciclos de precio de Polkadot",
    "hist": [
     "2017: venta de tokens (ICO). En noviembre de ese año, un fallo en un monedero multifirma de Parity congeló una parte importante de los fondos recaudados.",
     "2020: la red principal arranca en mayo; en agosto se habilitan las transferencias de DOT, los grandes exchanges empiezan a negociarlo y ese mismo mes entra en vigor la redenominación.",
     "2021: máximo histórico de unos 55 $ en noviembre, el mismo mes en que se abrió la primera subasta de slots de parachain.",
     "2022: cae más de un 90 % desde su máximo durante el mercado bajista cripto.",
     "2024–2025: el repunte no lo devolvió al máximo de 2021, mientras llegaban cambios estructurales como Agile Coretime y la votación del límite de suministro."
    ],
    "faq": [
     {
      "q": "¿Existe un índice de miedo propio de Polkadot?",
      "a": "Alternative.me no publica índices por moneda, sino uno solo para todo el mercado cripto, centrado en Bitcoin. En la página de Polkadot aparece etiquetado como «de todo el mercado». El sentimiento propio de DOT se refleja de forma indirecta en indicadores de precio como el RSI y el MACD."
     },
     {
      "q": "¿Polkadot tiene lectura de MVRV?",
      "a": "No. Los datos de MVRV de DOT en la API comunitaria de CoinMetrics se detienen el 3 de junio de 2022, así que la tarjeta muestra N/A en lugar de un valor desfasado. La puntuación de compra vuelve a ponderar los indicadores restantes."
     },
     {
      "q": "¿Debería comprar Polkadot ahora?",
      "a": "Esta página no recomienda comprar ni vender. En el modo predeterminado «Largo · Contrario», una puntuación alta solo indica que varias condiciones contrarias —sobreventa, miedo, caída profunda— aparecen a la vez en varios indicadores. En una moneda como DOT, que ha atravesado una larga tendencia bajista, las señales de «barato» pueden prolongarse, así que revisa qué indicadores están empujando la puntuación."
     },
     {
      "q": "¿Las recompensas de staking o la inflación cuentan en la puntuación?",
      "a": "No. La puntuación se calcula solo con los datos de precio de DOT (CoinGecko, Binance) y el índice de miedo y codicia del mercado. La dilución por nuevas emisiones y el rendimiento del staking hay que consultarlos aparte."
     },
     {
      "q": "¿La puntuación de Polkadot se calcula igual que la de Bitcoin?",
      "a": "Las fórmulas son las mismas, pero la entrada es el precio diario de DOT. Las dos páginas solo comparten el índice de miedo y codicia, y el indicador Thermocap de la página de Bitcoin no se incluye aquí. Por eso una misma puntuación puede describir situaciones muy distintas en cada moneda."
     }
    ]
   },
   "fr": {
    "title": "Polkadot (DOT) : score de timing d’achat et indice de peur et d’avidité du marché",
    "intro": "Cette page applique le RSI(14), le MACD(12·26·9), le multiple de Mayer, le repli depuis le plus haut sur 365 jours et le croisement doré/de la mort 50/200 au cours quotidien de Polkadot, puis ajoute l’indice de peur et d’avidité de l’ensemble du marché et un emplacement pour le MVRV Z-Score : sept indicateurs réunis sur un seul écran. Faute de données MVRV à jour pour le DOT, le score de timing d’achat de 0 à 100 est calculé à partir des autres indicateurs. Gratuit, il fonctionne dans le navigateur sans installation.",
    "coinH": "Qu’est-ce que Polkadot (DOT) ?",
    "coinP": [
     "Polkadot est un réseau multichaîne imaginé par Gavin Wood, cofondateur d’Ethereum. Son livre blanc a été publié en 2016 et son réseau principal a démarré en mai 2020. La Web3 Foundation, basée en Suisse, soutient le projet, et Parity Technologies a développé le logiciel de base. Une Relay Chain centrale assure la sécurité et le consensus, tandis que les parachains qui s’y connectent partagent cette sécurité et exécutent leur propre logique. Le réseau repose sur la preuve d’enjeu nominative (NPoS), et le DOT sert au staking, aux votes de gouvernance et à l’obtention d’espace de bloc.",
     "Dès l’origine, le DOT n’avait pas de plafond d’offre fixe : de nouveaux jetons sont émis chaque année pour rémunérer le staking. En août 2020, le jeton a été redénominé d’un facteur 100 (1 nouveau DOT = 0,01 ancien DOT). Les enchères de slots de parachain ont commencé fin 2021, puis ont laissé place en 2024 à Agile Coretime, qui permet d’acheter directement du temps d’espace de bloc. En 2025, un référendum on-chain a approuvé un plafond d’offre de 2,1 milliards de DOT."
    ],
    "applyH": "Appliquer les indicateurs à Polkadot",
    "apply": [
     "Volatilité : le DOT varie davantage que le Bitcoin d’un jour à l’autre et tend à chuter plus fort quand le marché se retourne. Un RSI à 30 peut rester plus longtemps en survente sur le DOT ; mieux vaut attendre qu’un retournement du MACD le confirme.",
     "Peur et avidité : l’indice d’Alternative.me mesure le sentiment de tout le marché crypto, avec un fort poids du Bitcoin. Les nouvelles propres à Polkadot le font à peine bouger ; prenez-le comme un simple repère de l’ambiance générale.",
     "MVRV : les données communautaires de CoinMetrics sur le MVRV du DOT ne sont plus mises à jour depuis le 3 juin 2022 ; il est donc indisponible ici (N/A). Le score redistribue son poids sur les autres indicateurs.",
     "Multiple de Mayer et repli : les seuils (0,8 et 2,4 ; −30 % et −50 %) sont issus des cycles du Bitcoin. Après son sommet de 2021, le DOT est resté longtemps sous sa moyenne à 200 jours et très loin de ses plus hauts : ces valeurs ne signalent donc pas automatiquement un creux.",
     "Offre : les récompenses de staking ajoutent des DOT chaque année, mais les indicateurs ne regardent que le prix ; la dilution liée à l’émission n’apparaît donc pas directement dans le score."
    ],
    "histH": "Les cycles de prix de Polkadot en bref",
    "hist": [
     "2017 : vente de jetons (ICO). En novembre de la même année, un bug dans un portefeuille multisignature Parity a gelé une part importante des fonds levés.",
     "2020 : lancement du réseau principal en mai ; en août, les transferts de DOT s’ouvrent, les grandes plateformes commencent à le coter et la redénomination entre en vigueur le même mois.",
     "2021 : record historique d’environ 55 $ en novembre, le mois même où s’ouvre la première enchère de slot de parachain.",
     "2022 : chute de plus de 90 % depuis le sommet pendant le marché baissier crypto.",
     "2024–2025 : la hausse ne ramène pas le cours au sommet de 2021, tandis que s’enchaînent des changements structurels comme Agile Coretime et le vote sur le plafond d’offre."
    ],
    "faq": [
     {
      "q": "Existe-t-il un indice de peur propre à Polkadot ?",
      "a": "Alternative.me ne publie pas d’indice par crypto, mais un seul indice pour l’ensemble du marché, centré sur le Bitcoin. Sur la page Polkadot, il est signalé comme « marché global ». Le sentiment propre au DOT se lit indirectement dans des indicateurs de prix comme le RSI et le MACD."
     },
     {
      "q": "Polkadot a-t-il une valeur MVRV ?",
      "a": "Non. Les données MVRV du DOT dans l’API communautaire de CoinMetrics s’arrêtent au 3 juin 2022 ; la carte affiche donc N/A plutôt qu’une valeur périmée. Le score de timing d’achat repondère les indicateurs restants."
     },
     {
      "q": "Faut-il acheter du Polkadot maintenant ?",
      "a": "Cette page ne recommande ni d’acheter ni de vendre. En mode par défaut « Long · Contrarian », un score élevé signifie seulement que des conditions à contre-courant — survente, peur, repli profond — apparaissent en même temps sur plusieurs indicateurs. Pour une crypto comme le DOT, marquée par une longue tendance baissière, les signaux « bon marché » peuvent durer ; regardez quels indicateurs font monter le score."
     },
     {
      "q": "Les récompenses de staking ou l’inflation entrent-elles dans le score ?",
      "a": "Non. Le score est calculé uniquement à partir des données de prix du DOT (CoinGecko, Binance) et de l’indice de peur et d’avidité du marché. La dilution liée aux nouvelles émissions et le rendement du staking sont à vérifier séparément."
     },
     {
      "q": "Le score de Polkadot se calcule-t-il comme celui du Bitcoin ?",
      "a": "Les formules sont identiques, mais l’entrée est le cours quotidien du DOT. Les deux pages ne partagent que l’indice de peur et d’avidité, et l’indicateur Thermocap de la page Bitcoin n’est pas repris ici. Un même score peut donc décrire des situations très différentes pour les deux cryptos."
     }
    ]
   },
   "de": {
    "title": "Polkadot (DOT): Kaufzeitpunkt-Score und marktweiter Angst- & Gier-Index",
    "intro": "Diese Seite wendet RSI(14), MACD(12·26·9), das Mayer-Multiple, den Rückgang vom 365-Tage-Hoch und das 50/200-Golden/Death-Cross auf den Tageskurs von Polkadot an und ergänzt den marktweiten Angst- & Gier-Index sowie ein Feld für den MVRV Z-Score – sieben Indikatoren auf einen Blick. Da für DOT keine aktuellen MVRV-Daten vorliegen, wird der Kaufzeitpunkt-Score von 0 bis 100 aus den übrigen Indikatoren berechnet. Kostenlos und ohne Installation im Browser nutzbar.",
    "coinH": "Was ist Polkadot (DOT)?",
    "coinP": [
     "Polkadot ist ein Multichain-Netzwerk, das Ethereum-Mitgründer Gavin Wood konzipiert hat. Das Whitepaper erschien 2016, das Mainnet startete im Mai 2020. Die Web3 Foundation mit Sitz in der Schweiz unterstützt das Projekt, die Kernsoftware entwickelte Parity Technologies. Eine zentrale Relay Chain übernimmt Sicherheit und Konsens, während die angebundenen Parachains diese Sicherheit teilen und ihre eigene Logik ausführen. Das Netzwerk nutzt Nominated Proof of Stake (NPoS); DOT dient zum Staking, für Governance-Abstimmungen und zum Sichern von Blockspace.",
     "Von Anfang an hatte DOT keine feste Angebotsobergrenze: Jedes Jahr werden neue Token ausgegeben, um Staking-Belohnungen zu bezahlen. Im August 2020 wurde der Token im Verhältnis 1:100 redenominiert (1 neuer DOT = 0,01 alter DOT). Ende 2021 begannen die Parachain-Slot-Auktionen; 2024 wurden sie durch Agile Coretime abgelöst, bei dem Teams Blockspace-Zeit direkt kaufen. 2025 billigte ein On-Chain-Referendum eine Obergrenze von 2,1 Milliarden DOT."
    ],
    "applyH": "Indikatoren auf Polkadot anwenden",
    "apply": [
     "Volatilität: DOT schwankt von Tag zu Tag stärker als Bitcoin und fällt meist deutlicher, wenn der Markt dreht. Ein RSI von 30 kann bei DOT länger im überverkauften Bereich verharren – sicherer ist es, eine Wende im MACD als Bestätigung abzuwarten.",
     "Angst & Gier: Der Index von Alternative.me misst die Stimmung im gesamten Kryptomarkt mit starkem Bitcoin-Gewicht. Nachrichten, die nur Polkadot betreffen, bewegen ihn kaum; nutzen Sie ihn nur als Hintergrund zur allgemeinen Marktlage.",
     "MVRV: Die Community-Daten von CoinMetrics zum DOT-MVRV werden seit dem 3. Juni 2022 nicht mehr aktualisiert und sind hier daher nicht verfügbar (N/A). Der Score verteilt dieses Gewicht auf die übrigen Indikatoren.",
     "Mayer-Multiple und Rückgang: Die Schwellen (0,8 und 2,4; −30 % und −50 %) stammen aus den Bitcoin-Zyklen. Nach dem Hoch von 2021 lag DOT lange unter seinem 200-Tage-Durchschnitt und weit unter seinen Höchstständen – solche Werte bedeuten also nicht automatisch einen Boden.",
     "Angebot: Staking-Belohnungen erhöhen die DOT-Menge jedes Jahr, die Indikatoren betrachten aber nur den Preis. Die Verwässerung durch neue Ausgabe zeigt sich daher nicht direkt im Score."
    ],
    "histH": "Die Preiszyklen von Polkadot im Überblick",
    "hist": [
     "2017: Token-Verkauf (ICO). Im November desselben Jahres fror ein Fehler in einer Multisig-Wallet von Parity einen großen Teil der eingesammelten Mittel ein.",
     "2020: Mainnet-Start im Mai; im August wurden DOT-Überweisungen freigeschaltet, große Börsen nahmen den Handel auf, und im selben Monat trat die Redenominierung in Kraft.",
     "2021: Allzeithoch von rund 55 US-Dollar im November – im selben Monat startete die erste Parachain-Slot-Auktion.",
     "2022: Im Krypto-Bärenmarkt fiel der Kurs um mehr als 90 % vom Hoch.",
     "2024–2025: Die Rally brachte das Hoch von 2021 nicht zurück; zugleich folgten strukturelle Änderungen wie Agile Coretime und die Abstimmung über die Angebotsobergrenze."
    ],
    "faq": [
     {
      "q": "Gibt es einen eigenen Angst-Index für Polkadot?",
      "a": "Alternative.me veröffentlicht keine Indizes pro Coin, sondern einen einzigen, Bitcoin-lastigen Index für den gesamten Kryptomarkt. Auf der Polkadot-Seite ist er als „marktweit“ gekennzeichnet. Die Stimmung speziell bei DOT lässt sich indirekt an Preisindikatoren wie RSI und MACD ablesen."
     },
     {
      "q": "Gibt es für Polkadot einen MVRV-Wert?",
      "a": "Nein. Die MVRV-Daten zu DOT in der Community-API von CoinMetrics enden am 3. Juni 2022, daher zeigt die Karte N/A statt eines veralteten Werts. Der Kaufzeitpunkt-Score gewichtet die übrigen Indikatoren neu."
     },
     {
      "q": "Sollte ich jetzt Polkadot kaufen?",
      "a": "Diese Seite empfiehlt weder Kauf noch Verkauf. Im voreingestellten Modus „Lang · Antizyklisch“ bedeutet ein hoher Score nur, dass antizyklische Bedingungen – überverkauft, Angst, tiefer Rückgang – gleichzeitig in mehreren Indikatoren auftreten. Bei einem Coin wie DOT mit langem Abwärtstrend können „günstige“ Signale lange anhalten; prüfen Sie daher, welche Indikatoren den Score nach oben treiben."
     },
     {
      "q": "Fließen Staking-Belohnungen oder Inflation in den Score ein?",
      "a": "Nein. Der Score wird nur aus DOT-Kursdaten (CoinGecko, Binance) und dem marktweiten Angst- & Gier-Index berechnet. Die Verwässerung durch neu ausgegebene DOT und die Staking-Rendite müssen Sie separat prüfen."
     },
     {
      "q": "Wird der Polkadot-Score genauso berechnet wie der von Bitcoin?",
      "a": "Die Formeln sind gleich, als Eingabe dient aber der Tageskurs von DOT. Gemeinsam haben beide Seiten nur den Angst- & Gier-Index, und der Thermocap-Indikator der Bitcoin-Seite fehlt hier. Derselbe Score kann bei beiden Coins daher ganz unterschiedliche Lagen beschreiben."
     }
    ]
   },
   "it": {
    "title": "Polkadot (DOT): punteggio di acquisto e indice di paura e avidità del mercato",
    "intro": "Questa pagina applica RSI(14), MACD(12·26·9), multiplo di Mayer, ribasso dal massimo a 365 giorni e Golden/Death Cross 50/200 al prezzo giornaliero di Polkadot, e aggiunge l’indice di paura e avidità dell’intero mercato e uno spazio per l’MVRV Z-Score: sette indicatori in un’unica schermata. Poiché per DOT non ci sono dati MVRV aggiornati, il punteggio di acquisto da 0 a 100 si basa sugli altri indicatori. È gratuita e funziona nel browser senza installare nulla.",
    "coinH": "Che cos’è Polkadot (DOT)?",
    "coinP": [
     "Polkadot è una rete multichain ideata da Gavin Wood, cofondatore di Ethereum. Il whitepaper è uscito nel 2016 e la mainnet è partita nel maggio 2020. La Web3 Foundation, con sede in Svizzera, sostiene il progetto, mentre Parity Technologies ha sviluppato il software principale. Una Relay Chain centrale gestisce sicurezza e consenso, e le parachain collegate ne condividono la sicurezza eseguendo la propria logica. La rete usa il Nominated Proof of Stake (NPoS) e il DOT serve per lo staking, i voti di governance e l’acquisizione di spazio nei blocchi.",
     "Fin dall’inizio il DOT non ha avuto un tetto fisso all’offerta: ogni anno vengono emessi nuovi token per pagare le ricompense di staking. Ad agosto 2020 il token è stato ridenominato di un fattore 100 (1 nuovo DOT = 0,01 vecchio DOT). Le aste per gli slot delle parachain sono iniziate a fine 2021 e nel 2024 hanno lasciato il posto ad Agile Coretime, con cui si acquista direttamente tempo di spazio nei blocchi. Nel 2025 un referendum on-chain ha approvato un tetto all’offerta di 2,1 miliardi di DOT."
    ],
    "applyH": "Applicare gli indicatori a Polkadot",
    "apply": [
     "Volatilità: il DOT oscilla più del Bitcoin da un giorno all’altro e tende a scendere di più quando il mercato gira. Un RSI a 30 può restare in ipervenduto più a lungo sul DOT, quindi è più prudente attendere la conferma di un’inversione del MACD.",
     "Paura e avidità: l’indice di Alternative.me misura il sentiment dell’intero mercato cripto, con un forte peso del Bitcoin. Le notizie che riguardano solo Polkadot lo muovono appena: usalo solo come riferimento sul clima generale.",
     "MVRV: i dati community di CoinMetrics sull’MVRV del DOT non sono più aggiornati dal 3 giugno 2022, quindi qui non è disponibile (N/A). Il punteggio ridistribuisce il suo peso sugli altri indicatori.",
     "Multiplo di Mayer e ribasso: le soglie (0,8 e 2,4; −30% e −50%) derivano dai cicli del Bitcoin. Dopo il massimo del 2021, il DOT è rimasto a lungo sotto la media a 200 giorni e molto lontano dai massimi, perciò queste letture non indicano automaticamente un minimo.",
     "Offerta: le ricompense di staking aggiungono DOT ogni anno, ma gli indicatori guardano solo il prezzo, quindi la diluizione da nuove emissioni non compare direttamente nel punteggio."
    ],
    "histH": "I cicli di prezzo di Polkadot in sintesi",
    "hist": [
     "2017: vendita di token (ICO). A novembre dello stesso anno, un bug in un wallet multisig di Parity ha congelato una parte consistente dei fondi raccolti.",
     "2020: la mainnet parte a maggio; ad agosto vengono abilitati i trasferimenti di DOT, i principali exchange avviano le negoziazioni e nello stesso mese entra in vigore la ridenominazione.",
     "2021: massimo storico di circa 55 dollari a novembre, lo stesso mese in cui si apre la prima asta per uno slot di parachain.",
     "2022: perde oltre il 90% dal massimo durante il mercato ribassista delle cripto.",
     "2024–2025: il rialzo non riporta il prezzo al massimo del 2021, mentre arrivano cambiamenti strutturali come Agile Coretime e il voto sul tetto all’offerta."
    ],
    "faq": [
     {
      "q": "Esiste un indice della paura specifico per Polkadot?",
      "a": "Alternative.me non pubblica indici per singola moneta, ma un unico indice per l’intero mercato cripto, incentrato sul Bitcoin. Nella pagina di Polkadot è indicato come «intero mercato». Il sentiment proprio del DOT si legge indirettamente da indicatori di prezzo come RSI e MACD."
     },
     {
      "q": "Per Polkadot è disponibile l’MVRV?",
      "a": "No. I dati MVRV del DOT nell’API community di CoinMetrics si fermano al 3 giugno 2022, quindi la scheda mostra N/A invece di un valore superato. Il punteggio di acquisto ripondera gli indicatori rimanenti."
     },
     {
      "q": "Conviene comprare Polkadot adesso?",
      "a": "Questa pagina non consiglia di comprare né di vendere. Nella modalità predefinita «Lungo · Contrarian», un punteggio alto significa solo che condizioni contrarian — ipervenduto, paura, ribasso profondo — compaiono insieme su più indicatori. Per una moneta come il DOT, reduce da un lungo trend ribassista, i segnali di «prezzo basso» possono durare a lungo: controlla quali indicatori stanno spingendo il punteggio."
     },
     {
      "q": "Le ricompense di staking o l’inflazione rientrano nel punteggio?",
      "a": "No. Il punteggio si calcola solo con i dati di prezzo del DOT (CoinGecko, Binance) e l’indice di paura e avidità del mercato. La diluizione dovuta alle nuove emissioni e il rendimento dello staking vanno verificati a parte."
     },
     {
      "q": "Il punteggio di Polkadot si calcola come quello del Bitcoin?",
      "a": "Le formule sono le stesse, ma il dato di partenza è il prezzo giornaliero del DOT. Le due pagine condividono solo l’indice di paura e avidità, e l’indicatore Thermocap della pagina Bitcoin qui non c’è. Lo stesso punteggio può quindi descrivere situazioni molto diverse per le due monete."
     }
    ]
   },
   "pt": {
    "title": "Polkadot (DOT): pontuação de compra e índice de medo e ganância do mercado",
    "intro": "Esta página aplica o RSI(14), o MACD(12·26·9), o múltiplo de Mayer, a queda desde a máxima de 365 dias e o cruzamento dourado/da morte 50/200 ao preço diário da Polkadot, e junta o índice de medo e ganância de todo o mercado e um espaço para o MVRV Z-Score: sete indicadores numa só vista. Como não há dados de MVRV atualizados para o DOT, a pontuação de compra de 0 a 100 é calculada com os restantes indicadores. É gratuita e funciona no navegador sem instalação.",
    "coinH": "O que é a Polkadot (DOT)?",
    "coinP": [
     "A Polkadot é uma rede multichain idealizada por Gavin Wood, cofundador da Ethereum. O whitepaper foi publicado em 2016 e a rede principal arrancou em maio de 2020. A Web3 Foundation, sediada na Suíça, apoia o projeto, e a Parity Technologies desenvolveu o software central. Uma Relay Chain central trata da segurança e do consenso, enquanto as parachains ligadas a ela partilham essa segurança e executam a sua própria lógica. A rede usa prova de participação nomeada (NPoS), e o DOT serve para staking, votações de governança e reserva de espaço de bloco.",
     "Desde o início, o DOT não teve um limite fixo de oferta: todos os anos são emitidos novos tokens para pagar as recompensas de staking. Em agosto de 2020, o token foi redenominado por um fator de 100 (1 DOT novo = 0,01 DOT antigo). Os leilões de slots de parachain começaram no final de 2021 e, em 2024, deram lugar ao Agile Coretime, que permite comprar diretamente tempo de espaço de bloco. Em 2025, um referendo on-chain aprovou um limite de oferta de 2,1 mil milhões de DOT."
    ],
    "applyH": "Como aplicar os indicadores à Polkadot",
    "apply": [
     "Volatilidade: o DOT oscila mais do que o Bitcoin no dia a dia e costuma cair com mais força quando o mercado vira. Um RSI de 30 pode manter-se em sobrevenda durante mais tempo no DOT, por isso é mais prudente esperar que o MACD confirme a viragem.",
     "Medo e ganância: o índice da Alternative.me mede o sentimento de todo o mercado cripto, com grande peso do Bitcoin. As notícias que só dizem respeito à Polkadot quase não o mexem, por isso use-o apenas como referência do ambiente geral.",
     "MVRV: os dados comunitários da CoinMetrics sobre o MVRV do DOT não são atualizados desde 3 de junho de 2022, pelo que aqui não está disponível (N/A). A pontuação redistribui o seu peso pelos outros indicadores.",
     "Múltiplo de Mayer e queda: os limiares (0,8 e 2,4; −30% e −50%) vêm dos ciclos do Bitcoin. Depois do pico de 2021, o DOT passou longos períodos abaixo da média de 200 dias e muito longe das máximas, por isso estas leituras não significam automaticamente um fundo.",
     "Oferta: as recompensas de staking acrescentam DOT todos os anos, mas os indicadores só olham para o preço, pelo que a diluição causada pela emissão não aparece diretamente na pontuação."
    ],
    "histH": "Resumo dos ciclos de preço da Polkadot",
    "hist": [
     "2017: venda de tokens (ICO). Em novembro desse ano, um erro numa carteira multisig da Parity congelou uma parte significativa dos fundos angariados.",
     "2020: a rede principal arranca em maio; em agosto as transferências de DOT são ativadas, as grandes corretoras começam a negociá-lo e, no mesmo mês, entra em vigor a redenominação.",
     "2021: máxima histórica de cerca de 55 dólares em novembro, o mesmo mês em que abriu o primeiro leilão de slots de parachain.",
     "2022: queda de mais de 90% desde o pico durante o mercado em baixa das criptomoedas.",
     "2024–2025: a subida não devolveu o preço à máxima de 2021, enquanto chegavam mudanças estruturais como o Agile Coretime e a votação do limite de oferta."
    ],
    "faq": [
     {
      "q": "Existe um índice de medo próprio da Polkadot?",
      "a": "A Alternative.me não publica índices por moeda, apenas um para todo o mercado cripto, centrado no Bitcoin. Na página da Polkadot, ele aparece identificado como «mercado global». O sentimento específico do DOT nota-se indiretamente em indicadores de preço como o RSI e o MACD."
     },
     {
      "q": "A Polkadot tem leitura de MVRV?",
      "a": "Não. Os dados de MVRV do DOT na API comunitária da CoinMetrics param em 3 de junho de 2022, por isso o cartão mostra N/A em vez de um valor desatualizado. A pontuação de compra volta a ponderar os restantes indicadores."
     },
     {
      "q": "Devo comprar Polkadot agora?",
      "a": "Esta página não recomenda comprar nem vender. No modo predefinido «Longo · Contrário», uma pontuação alta indica apenas que condições contrárias — sobrevenda, medo, queda profunda — surgem ao mesmo tempo em vários indicadores. Numa moeda como o DOT, que atravessou uma longa tendência de queda, os sinais de «barato» podem prolongar-se, por isso veja que indicadores estão a puxar a pontuação para cima."
     },
     {
      "q": "As recompensas de staking ou a inflação entram na pontuação?",
      "a": "Não. A pontuação é calculada apenas com os dados de preço do DOT (CoinGecko, Binance) e o índice de medo e ganância do mercado. A diluição causada por novas emissões e o rendimento do staking têm de ser consultados à parte."
     },
     {
      "q": "A pontuação da Polkadot é calculada como a do Bitcoin?",
      "a": "As fórmulas são iguais, mas a entrada é o preço diário do DOT. As duas páginas só partilham o índice de medo e ganância, e o indicador Thermocap da página do Bitcoin não está incluído aqui. Por isso, a mesma pontuação pode descrever situações bem diferentes em cada moeda."
     }
    ]
   },
   "ru": {
    "title": "Полкадот (DOT): оценка момента покупки и общерыночный индекс страха и жадности",
    "intro": "На этой странице к дневным ценам Полкадота (DOT) применяются RSI(14), MACD(12·26·9), мультипликатор Майера, просадка от 365-дневного максимума и золотой/мёртвый крест 50/200, а также добавлены общерыночный индекс страха и жадности и ячейка MVRV Z-оценки — всего семь индикаторов на одном экране. Актуальных данных MVRV по DOT нет, поэтому оценка момента покупки от 0 до 100 строится по остальным индикаторам. Пользоваться можно бесплатно, прямо в браузере, без установки.",
    "coinH": "Что такое Полкадот (DOT)?",
    "coinP": [
     "Полкадот — мультичейн-сеть, задуманная сооснователем Ethereum Гэвином Вудом. Уайтпейпер вышел в 2016 году, основная сеть запустилась в мае 2020 года. Проект поддерживает швейцарский фонд Web3 Foundation, а основное программное обеспечение разработала Parity Technologies. Центральная Relay Chain отвечает за безопасность и консенсус, а подключённые к ней парачейны пользуются этой общей безопасностью и выполняют собственную логику. Сеть работает на номинированном доказательстве доли (NPoS); DOT используется для стейкинга, голосований по управлению и получения блочного пространства.",
     "С самого начала у DOT не было фиксированного предела эмиссии: каждый год выпускаются новые токены для выплаты наград за стейкинг. В августе 2020 года номинал токена пересчитали: 1 старый DOT стал равен 100 новым. В конце 2021 года начались аукционы слотов для парачейнов, а в 2024 году их сменила модель Agile Coretime, в которой команды покупают время блочного пространства напрямую. В 2025 году ончейн-референдум одобрил потолок предложения в 2,1 млрд DOT."
    ],
    "applyH": "Как применять индикаторы к Полкадоту",
    "apply": [
     "Волатильность: DOT колеблется изо дня в день сильнее биткоина и обычно падает глубже, когда рынок разворачивается вниз. RSI на уровне 30 у DOT может дольше оставаться в зоне перепроданности, поэтому надёжнее дождаться подтверждающего разворота MACD.",
     "Страх и жадность: индекс Alternative.me измеряет настроения всего крипторынка с большим весом биткоина. Новости, касающиеся только Полкадота, его почти не сдвигают, так что воспринимайте его лишь как фон общего настроя.",
     "MVRV: данные сообщества CoinMetrics по MVRV для DOT не обновляются с 3 июня 2022 года, поэтому здесь этот индикатор недоступен (N/A). Его вес распределяется между остальными индикаторами.",
     "Мультипликатор Майера и просадка: пороги (0,8 и 2,4; −30% и −50%) выведены из циклов биткоина. После пика 2021 года DOT подолгу находился ниже 200-дневной средней и далеко от максимумов, поэтому такие значения не означают дно автоматически.",
     "Предложение: награды за стейкинг ежегодно добавляют DOT, но индикаторы смотрят только на цену, поэтому размывание от новой эмиссии напрямую в оценке не отражается."
    ],
    "histH": "Ценовые циклы Полкадота вкратце",
    "hist": [
     "2017: продажа токенов (ICO). В ноябре того же года ошибка в мультиподписном кошельке Parity заморозила значительную часть собранных средств.",
     "2020: основная сеть запущена в мае; в августе открылись переводы DOT, крупные биржи начали торги, и в том же месяце вступил в силу пересчёт номинала.",
     "2021: исторический максимум около 55 долларов в ноябре — в том же месяце открылся первый аукцион слотов для парачейнов.",
     "2022: на медвежьем крипторынке цена упала более чем на 90% от пика.",
     "2024–2025: рост рынка не вернул цену к максимуму 2021 года, а тем временем последовали структурные изменения — Agile Coretime и голосование о потолке предложения."
    ],
    "faq": [
     {
      "q": "Есть ли отдельный индекс страха для Полкадота?",
      "a": "Alternative.me не публикует индексы по отдельным монетам — только один индекс для всего крипторынка с упором на биткоин. На странице Полкадота он помечен как «весь рынок». Настроения именно вокруг DOT косвенно видны по ценовым индикаторам, таким как RSI и MACD."
     },
     {
      "q": "Показывается ли MVRV для Полкадота?",
      "a": "Нет. Данные MVRV по DOT в общедоступном API CoinMetrics обрываются 3 июня 2022 года, поэтому на карточке стоит N/A, а не устаревшее значение. Оценка момента покупки перевзвешивает оставшиеся индикаторы."
     },
     {
      "q": "Стоит ли покупать Полкадот сейчас?",
      "a": "Эта страница не даёт рекомендаций покупать или продавать. В режиме по умолчанию «Долго · Контртренд» высокая оценка лишь означает, что контртрендовые условия — перепроданность, страх, глубокая просадка — одновременно проявляются в нескольких индикаторах. У монеты вроде DOT, пережившей долгий нисходящий тренд, сигналы «дёшево» могут держаться долго, поэтому смотрите, какие индикаторы поднимают оценку."
     },
     {
      "q": "Учитываются ли в оценке награды за стейкинг или инфляция?",
      "a": "Нет. Оценка рассчитывается только по ценовым данным DOT (CoinGecko, Binance) и общерыночному индексу страха и жадности. Размывание от новой эмиссии и доходность стейкинга нужно проверять отдельно."
     },
     {
      "q": "Оценка Полкадота считается так же, как у биткоина?",
      "a": "Формулы те же, но на вход подаётся дневная цена самого DOT. Общий у двух страниц только индекс страха и жадности, а индикатора Thermocap со страницы биткоина здесь нет. Поэтому одинаковая оценка может описывать совершенно разные ситуации для двух монет."
     }
    ]
   },
   "nl": {
    "title": "Polkadot (DOT): koopmoment-score en marktbrede Angst- & Hebzucht-index",
    "intro": "Deze pagina past RSI(14), MACD(12·26·9), de Mayer Multiple, de daling vanaf de 365-daagse top en de 50/200 Golden/Death Cross toe op de dagkoers van Polkadot, en voegt de marktbrede Angst- & Hebzucht-index en een vak voor de MVRV Z-score toe: zeven indicatoren in één overzicht. Omdat er voor DOT geen actuele MVRV-gegevens zijn, wordt de koopmoment-score van 0 tot 100 berekend met de overige indicatoren. Gratis en zonder installatie in de browser te gebruiken.",
    "coinH": "Wat is Polkadot (DOT)?",
    "coinP": [
     "Polkadot is een multichain-netwerk dat is bedacht door Ethereum-medeoprichter Gavin Wood. De whitepaper verscheen in 2016 en het mainnet ging in mei 2020 van start. De Web3 Foundation, gevestigd in Zwitserland, steunt het project, en Parity Technologies ontwikkelde de kernsoftware. Een centrale Relay Chain zorgt voor beveiliging en consensus, terwijl de aangesloten parachains die beveiliging delen en hun eigen logica uitvoeren. Het netwerk gebruikt Nominated Proof of Stake (NPoS); DOT dient voor staking, governance-stemmingen en het vastleggen van blokruimte.",
     "Vanaf het begin had DOT geen vast maximumaanbod: elk jaar worden nieuwe tokens uitgegeven om stakingbeloningen te betalen. In augustus 2020 werd de token met een factor 100 geherdenomineerd (1 nieuwe DOT = 0,01 oude DOT). Eind 2021 begonnen de veilingen voor parachain-slots; in 2024 maakten die plaats voor Agile Coretime, waarbij teams rechtstreeks tijd op blokruimte kopen. In 2025 keurde een on-chain referendum een aanbodplafond van 2,1 miljard DOT goed."
    ],
    "applyH": "Indicatoren toepassen op Polkadot",
    "apply": [
     "Volatiliteit: DOT beweegt van dag tot dag sterker dan Bitcoin en daalt doorgaans harder wanneer de markt omslaat. Een RSI van 30 kan bij DOT langer in de oversold-zone blijven, dus het is verstandiger een kentering van de MACD als bevestiging af te wachten.",
     "Angst & hebzucht: de index van Alternative.me meet het sentiment van de hele cryptomarkt, met een groot gewicht voor Bitcoin. Nieuws dat alleen Polkadot raakt, beweegt hem nauwelijks; gebruik hem dus alleen als achtergrond voor de algemene stemming.",
     "MVRV: de communitygegevens van CoinMetrics over de MVRV van DOT worden sinds 3 juni 2022 niet meer bijgewerkt, dus hier is die niet beschikbaar (N/A). De score verdeelt dat gewicht over de andere indicatoren.",
     "Mayer Multiple en daling: de drempels (0,8 en 2,4; −30% en −50%) komen uit de cycli van Bitcoin. Na de top van 2021 stond DOT lang onder het 200-daags gemiddelde en ver onder de toppen, dus zulke waarden betekenen niet automatisch een bodem.",
     "Aanbod: stakingbeloningen voegen elk jaar DOT toe, maar de indicatoren kijken alleen naar de prijs, waardoor verwatering door nieuwe uitgifte niet direct in de score zichtbaar is."
    ],
    "histH": "De prijscycli van Polkadot in het kort",
    "hist": [
     "2017: tokenverkoop (ICO). In november van dat jaar bevroor een bug in een multisig-wallet van Parity een groot deel van het opgehaalde geld.",
     "2020: het mainnet start in mei; in augustus worden DOT-overboekingen mogelijk, grote beurzen beginnen met de handel en in dezelfde maand gaat de herdenominatie in.",
     "2021: recordkoers van ongeveer 55 dollar in november, dezelfde maand waarin de eerste parachain-slotveiling begon.",
     "2022: tijdens de cryptobearmarkt meer dan 90% gedaald vanaf de top.",
     "2024–2025: de opleving bracht de top van 2021 niet terug, terwijl er structurele veranderingen volgden, zoals Agile Coretime en de stemming over het aanbodplafond."
    ],
    "faq": [
     {
      "q": "Bestaat er een aparte angstindex voor Polkadot?",
      "a": "Alternative.me publiceert geen index per munt, maar één index voor de hele cryptomarkt, met Bitcoin als zwaartepunt. Op de Polkadot-pagina staat die aangeduid als ‘hele markt’. Het sentiment rond DOT zelf is indirect af te lezen aan prijsindicatoren zoals RSI en MACD."
     },
     {
      "q": "Krijgt Polkadot een MVRV-waarde?",
      "a": "Nee. De MVRV-gegevens voor DOT in de community-API van CoinMetrics stoppen op 3 juni 2022, dus de kaart toont N/A in plaats van een verouderde waarde. De koopmoment-score herweegt de overige indicatoren."
     },
     {
      "q": "Moet ik nu Polkadot kopen?",
      "a": "Deze pagina geeft geen advies om te kopen of te verkopen. In de standaardmodus ‘Lang · Contrair’ betekent een hoge score alleen dat tegendraadse signalen — oversold, angst, een diepe daling — tegelijk in meerdere indicatoren opduiken. Bij een munt als DOT, die een lange neerwaartse trend achter de rug heeft, kunnen ‘goedkoop’-signalen lang aanhouden; kijk dus welke indicatoren de score omhoog duwen."
     },
     {
      "q": "Tellen stakingbeloningen of inflatie mee in de score?",
      "a": "Nee. De score wordt alleen berekend met koersgegevens van DOT (CoinGecko, Binance) en de marktbrede Angst- & Hebzucht-index. Verwatering door nieuw uitgegeven DOT en het stakingrendement moet je apart nagaan."
     },
     {
      "q": "Wordt de Polkadot-score op dezelfde manier berekend als die van Bitcoin?",
      "a": "De formules zijn gelijk, maar de invoer is de dagkoers van DOT zelf. Beide pagina’s delen alleen de Angst- & Hebzucht-index, en de Thermocap-indicator van de Bitcoin-pagina ontbreekt hier. Dezelfde score kan dus voor beide munten heel verschillende situaties beschrijven."
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
