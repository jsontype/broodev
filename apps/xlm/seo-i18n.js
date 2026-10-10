/* 하단 SEO 본문 다국어 데이터 + 렌더러. index.html(광고) / member/index.html(구독자) 공유.
   언어 전환 시 window.renderSEO(lang) 호출 → section.seo 를 해당 언어로 다시 그림.
   기본 정적 HTML(한국어)은 무JS 크롤러용 폴백으로 남겨두고, JS 실행 시 현재 언어로 교체. */
(function () {
  var SEO = {
    ko: {
      title: '스텔라루멘 공포·탐욕 지수 & 매수 타이밍 점수',
      intro: '스텔라루멘 공포지수(공포·탐욕 지수, Fear & Greed Index)를 포함한 7개 실시간 지표를 합성해 “지금이 매수 타이밍인가?”를 0~100 점수로 보여주는 무료 대시보드입니다. 설치 없이 브라우저에서 바로 실행되며 13개 언어를 지원합니다.',
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
        { q: '공포지수가 낮으면 스텔라루멘을 사야 하나요?', a: '극단적 공포는 역사적으로 분할 매수 기회였던 경우가 많지만, 공포지수 하나만 보면 “떨어지는 칼날”을 잡을 위험이 있습니다. 본 점수는 RSI·MACD·마이어 배수·낙폭·이동평균 크로스를 함께 보고, 하락 추세에서는 점수를 보수적으로 낮춥니다.' },
        { q: '매수 타이밍 점수는 어떻게 계산되나요?', a: '7개 지표를 각각 0~100 부분점수로 환산해 가중 합성합니다. 결과는 0~100이며 5단계 밴드로 표시됩니다.' },
        { q: '무료인가요? 설치가 필요한가요?', a: '완전 무료이며 설치가 필요 없습니다. CoinGecko·Binance·Alternative.me 공개 API에서 실시간 데이터를 가져옵니다.' },
        { q: '공포지수와 매수 타이밍 점수는 무엇이 다른가요?', a: '공포지수는 심리 한 가지 지표(0~100)이고, 매수 타이밍 점수는 공포지수를 포함한 7개 지표를 합성한 종합 점수(0~100)입니다.' },
        { q: '공포지수 데이터는 어디서 가져오나요? 얼마나 자주 갱신되나요?', a: '공포·탐욕 지수는 Alternative.me, 가격·일봉은 CoinGecko·Binance, 온체인 지표는 CoinMetrics 공개 API에서 실시간으로 가져옵니다. 화면은 약 1분 주기로 자동 갱신됩니다.' },
        { q: '스텔라루멘 지금 사도 되나요?', a: '정답은 없지만, 매수 타이밍 점수(0~100)로 현재 시장이 과매도·공포 구간인지 과열·탐욕 구간인지 객관적으로 가늠할 수 있습니다. 장기(역발상) 탭 기준 점수가 높을수록 공포·저평가가 겹친 분할 매수 우호 구간, 낮을수록 과열 경계 구간입니다. 참고 신호일 뿐 투자 자문이 아닙니다.' },
        { q: '단기와 장기 매수 타이밍은 어떻게 다른가요?', a: '점수는 단기·장기 두 탭으로 나뉩니다. 단기(모멘텀)는 약 1~3개월 추세추종 관점으로 상승 추세가 강할수록 높고, 장기(역발상)는 약 1년 이상 사이클 관점으로 공포·저평가일수록 높습니다. 2017년 이후 백테스트에서 단기는 모멘텀, 장기는 역발상 방향이 더 잘 맞았습니다.' },
        { q: 'BOTTOM RADAR(바닥 점수)는 무엇인가요?', a: 'MVRV Z-점수 같은 온체인 지표로 시가총액이 투자자 평균 매수원가 대비 어디에 있는지 재서, 역사적 바닥 구간과의 근접도를 0~100으로 보여주는 보조 게이지입니다. 계산 근거는 “비트코인 바닥” 해설 페이지에 공개되어 있습니다.' }
      ],
      disclaimer: '⚠ 본 점수는 공개 지표를 합성한 참고 신호이며 투자 자문이 아닙니다. 모든 투자 판단과 책임은 이용자 본인에게 있습니다.'
    },
    en: {
      title: 'Stellar Fear & Greed Index & Buy-Timing Score',
      intro: 'A free dashboard that synthesizes 7 real-time indicators — including the Stellar Fear & Greed Index — into a 0–100 “is now a good time to buy?” score. Runs in your browser with no install, in 13 languages.',
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
        { q: 'Should I buy Stellar when the index is low?', a: 'Extreme fear has often been an accumulation opportunity, but relying on the index alone risks catching a falling knife. This score also weighs RSI, MACD, Mayer Multiple, drawdown and moving-average crosses, and lowers the score conservatively in downtrends.' },
        { q: 'How is the buy-timing score calculated?', a: 'Each of the 7 indicators is converted to a 0–100 sub-score and weighted together. The result is 0–100, shown in 5 bands.' },
        { q: 'Is it free? Do I need to install anything?', a: 'It is completely free with no install. Real-time data comes from CoinGecko, Binance and Alternative.me public APIs.' },
        { q: 'How is the index different from the buy-timing score?', a: 'The index is a single sentiment metric (0–100); the buy-timing score is a composite of 7 indicators including the index (0–100).' },
        { q: 'Where does the data come from, and how often does it refresh?', a: 'The Fear & Greed Index comes from Alternative.me, prices and daily candles from the CoinGecko and Binance public APIs, and on-chain metrics from CoinMetrics. The screen auto-refreshes roughly every minute.' },
        { q: 'Should I buy Stellar right now?', a: 'There is no single answer, but the buy-timing score (0–100) gives an objective read on whether the market is in an oversold/fear zone or an overheated/greed zone. On the long-term (contrarian) tab, higher scores mark zones where fear and undervaluation overlap — historically favorable for DCA — while lower scores warn of overheating. It is a reference signal, not investment advice.' },
        { q: 'How do short-term and long-term buy timing differ?', a: 'The score is split into two tabs. Short-term (momentum) takes a 1–3 month trend-following view and rises with strong uptrends; long-term (contrarian) takes a 1-year-plus cycle view and rises with fear and undervaluation. In backtests since 2017, momentum worked better short-term and contrarian worked better long-term.' },
        { q: 'What is the BOTTOM RADAR (bottom score)?', a: 'A secondary gauge that uses on-chain metrics such as the MVRV Z-Score to measure where market cap sits relative to investors’ average cost basis, showing proximity to historic bottom zones on a 0–100 scale. The full calculation is published on the “Bitcoin bottom” guide page.' }
      ],
      disclaimer: '⚠ This score is a reference signal built from public indicators, not investment advice. All decisions and responsibility are your own.'
    },
    ja: {
      title: 'ステラルーメン 恐怖・強欲指数 & 買い時スコア',
      intro: 'ステラルーメンの恐怖・強欲指数（Fear & Greed Index）を含む7つのリアルタイム指標を合成し、「今が買い時か？」を0〜100のスコアで示す無料ダッシュボードです。インストール不要でブラウザから即実行、13言語対応。',
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
        { q: '指数が低ければステラルーメンを買うべき？', a: '極端な恐怖は歴史的に分割買いの好機だったことが多いですが、指数だけに頼ると「落ちるナイフ」を掴む危険があります。本スコアはRSI・MACD・マイヤー倍率・下落率・移動平均クロスも合わせて見て、下落トレンドでは保守的にスコアを下げます。' },
        { q: '買い時スコアはどう計算される？', a: '7指標をそれぞれ0〜100の部分スコアに換算し加重合成します。結果は0〜100で、5段階バンドで表示します。' },
        { q: '無料？インストールは必要？', a: '完全無料・インストール不要です。CoinGecko・Binance・Alternative.me の公開APIからリアルタイムデータを取得します。' },
        { q: '指数と買い時スコアの違いは？', a: '指数は心理1指標(0〜100)、買い時スコアは指数を含む7指標を合成した総合スコア(0〜100)です。' },
        { q: 'データはどこから？更新頻度は？', a: '恐怖・強欲指数はAlternative.me、価格・日足はCoinGecko・Binance、オンチェーン指標はCoinMetricsの公開APIからリアルタイムで取得します。画面は約1分ごとに自動更新されます。' },
        { q: 'ステラルーメンは今買ってもいい？', a: '正解はありませんが、買い時スコア(0〜100)で現在の市場が売られすぎ・恐怖圏か、過熱・強欲圏かを客観的に測れます。長期（逆張り）タブではスコアが高いほど恐怖と割安が重なる分割買いに有利な圏、低いほど過熱警戒圏です。参考シグナルであり投資助言ではありません。' },
        { q: '短期と長期の買い時はどう違う？', a: 'スコアは短期・長期の2タブに分かれます。短期（モメンタム）は約1〜3か月のトレンドフォロー視点で上昇トレンドが強いほど高く、長期（逆張り）は約1年以上のサイクル視点で恐怖・割安なほど高くなります。2017年以降のバックテストでは、短期はモメンタム、長期は逆張りの方向がより有効でした。' },
        { q: 'BOTTOM RADAR（底値スコア）とは？', a: 'MVRV Zスコアなどのオンチェーン指標で、時価総額が投資家の平均取得単価に対してどの位置にあるかを測り、歴史的な底値圏への近さを0〜100で示す補助ゲージです。計算根拠は「ビットコインの底」解説ページで公開しています。' }
      ],
      disclaimer: '⚠ 本スコアは公開指標を合成した参考シグナルであり、投資助言ではありません。すべての判断と責任は利用者ご自身にあります。'
    },
    zh: {
      title: '恒星币恐惧与贪婪指数 & 买入时机评分',
      intro: '一个免费仪表板，将包括恒星币恐惧与贪婪指数（Fear & Greed Index）在内的7个实时指标合成为0–100的“现在是买入时机吗？”评分。无需安装，浏览器即开即用，支持13种语言。',
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
        { q: '指数低就该买恒星币吗？', a: '极度恐惧在历史上常是分批买入良机，但只看指数有“接飞刀”的风险。本评分同时参考RSI、MACD、梅耶倍数、回撤与均线交叉，并在下跌趋势中保守下调评分。' },
        { q: '买入时机评分如何计算？', a: '将7个指标各自换算为0–100分项评分并加权合成。结果为0–100，以5档显示。' },
        { q: '免费吗？需要安装吗？', a: '完全免费、无需安装。实时数据来自 CoinGecko、Binance、Alternative.me 公开API。' },
        { q: '指数与买入时机评分有何不同？', a: '指数是单一情绪指标(0–100)；买入时机评分是包含该指数在内的7指标综合评分(0–100)。' },
        { q: '数据来自哪里？多久更新一次？', a: '恐惧与贪婪指数来自Alternative.me，价格与日K来自CoinGecko和Binance公开API，链上指标来自CoinMetrics。页面约每1分钟自动刷新。' },
        { q: '现在可以买恒星币吗？', a: '没有标准答案，但买入时机评分(0–100)能客观判断当前市场处于超卖·恐惧区还是过热·贪婪区。在长期（逆向）标签页中，评分越高代表恐惧与低估重叠、历史上利于分批买入的区间；越低则是过热警戒区。仅供参考，并非投资建议。' },
        { q: '短期和长期买入时机有何不同？', a: '评分分为短期、长期两个标签页。短期（动量）以约1–3个月的趋势跟随视角，上升趋势越强评分越高；长期（逆向）以约1年以上的周期视角，越恐惧、越低估评分越高。2017年以来的回测显示，短期动量、长期逆向的方向更有效。' },
        { q: 'BOTTOM RADAR（底部评分）是什么？', a: '一个辅助仪表，利用MVRV Z分数等链上指标衡量市值相对投资者平均持仓成本的位置，以0–100显示与历史底部区间的接近程度。计算依据在“比特币底部”解读页面公开。' }
      ],
      disclaimer: '⚠ 本评分由公开指标合成，仅供参考，并非投资建议。一切投资决定与责任由用户自负。'
    },
    'zh-Hant': {
      title: '恆星幣恐懼與貪婪指數 & 買入時機評分',
      intro: '一個免費儀表板，將包括恆星幣恐懼與貪婪指數（Fear & Greed Index）在內的7個即時指標合成為0–100的「現在是買入時機嗎？」評分。免安裝、瀏覽器即開即用，支援13種語言。',
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
        { q: '指數低就該買恆星幣嗎？', a: '極度恐懼在歷史上常是分批買入良機，但只看指數有「接飛刀」的風險。本評分同時參考RSI、MACD、梅耶倍數、回撤與均線交叉，並在下跌趨勢中保守下調評分。' },
        { q: '買入時機評分如何計算？', a: '將7個指標各自換算為0–100分項評分並加權合成。結果為0–100，以5檔顯示。' },
        { q: '免費嗎？需要安裝嗎？', a: '完全免費、免安裝。即時資料來自 CoinGecko、Binance、Alternative.me 公開API。' },
        { q: '指數與買入時機評分有何不同？', a: '指數是單一情緒指標(0–100)；買入時機評分是包含該指數在內的7指標綜合評分(0–100)。' },
        { q: '資料來自哪裡？多久更新一次？', a: '恐懼與貪婪指數來自Alternative.me，價格與日K來自CoinGecko和Binance公開API，鏈上指標來自CoinMetrics。頁面約每1分鐘自動重新整理。' },
        { q: '現在可以買恆星幣嗎？', a: '沒有標準答案，但買入時機評分(0–100)能客觀判斷當前市場處於超賣·恐懼區還是過熱·貪婪區。在長期（逆向）分頁中，評分越高代表恐懼與低估重疊、歷史上利於分批買入的區間；越低則是過熱警戒區。僅供參考，並非投資建議。' },
        { q: '短期和長期買入時機有何不同？', a: '評分分為短期、長期兩個分頁。短期（動量）以約1–3個月的趨勢跟隨視角，上升趨勢越強評分越高；長期（逆向）以約1年以上的週期視角，越恐懼、越低估評分越高。2017年以來的回測顯示，短期動量、長期逆向的方向更有效。' },
        { q: 'BOTTOM RADAR（底部評分）是什麼？', a: '一個輔助儀表，利用MVRV Z分數等鏈上指標衡量市值相對投資者平均持倉成本的位置，以0–100顯示與歷史底部區間的接近程度。計算依據在「比特幣底部」解說頁面公開。' }
      ],
      disclaimer: '⚠ 本評分由公開指標合成，僅供參考，並非投資建議。一切投資決定與責任由用戶自負。'
    },
    es: {
      title: 'Índice de miedo y codicia de Stellar y puntuación de momento de compra',
      intro: 'Un panel gratuito que sintetiza 7 indicadores en tiempo real —incluido el índice de miedo y codicia de Stellar— en una puntuación de 0 a 100 sobre «¿es buen momento para comprar?». Funciona en el navegador sin instalación, en 13 idiomas.',
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
        { q: '¿Debo comprar Stellar cuando el índice está bajo?', a: 'El miedo extremo ha sido a menudo una oportunidad de acumulación, pero fiarse solo del índice arriesga «atrapar un cuchillo que cae». Esta puntuación también pondera RSI, MACD, múltiplo de Mayer, caída y cruces de medias, y la reduce de forma conservadora en tendencias bajistas.' },
        { q: '¿Cómo se calcula la puntuación de compra?', a: 'Cada uno de los 7 indicadores se convierte en una subpuntuación de 0 a 100 y se pondera. El resultado es 0–100, mostrado en 5 bandas.' },
        { q: '¿Es gratis? ¿Necesito instalar algo?', a: 'Es totalmente gratis y sin instalación. Los datos en tiempo real provienen de las API públicas de CoinGecko, Binance y Alternative.me.' },
        { q: '¿En qué se diferencia el índice de la puntuación de compra?', a: 'El índice es una sola métrica de sentimiento (0–100); la puntuación de compra es un compuesto de 7 indicadores que incluye el índice (0–100).' },
        { q: '¿De dónde vienen los datos y con qué frecuencia se actualizan?', a: 'El índice de miedo y codicia viene de Alternative.me; los precios y velas diarias, de las API públicas de CoinGecko y Binance; y las métricas on-chain, de CoinMetrics. La pantalla se actualiza automáticamente cada minuto aproximadamente.' },
        { q: '¿Debería comprar Stellar ahora mismo?', a: 'No hay una respuesta única, pero la puntuación de compra (0–100) permite valorar objetivamente si el mercado está en zona de sobreventa/miedo o de recalentamiento/codicia. En la pestaña de largo plazo (contraria), puntuaciones altas marcan zonas donde coinciden miedo e infravaloración —históricamente favorables al DCA—, y las bajas avisan de recalentamiento. Es una señal de referencia, no asesoramiento de inversión.' },
        { q: '¿En qué se diferencian el timing de corto y de largo plazo?', a: 'La puntuación se divide en dos pestañas. El corto plazo (momentum) adopta una visión de seguimiento de tendencia de 1–3 meses y sube con tendencias alcistas fuertes; el largo plazo (contrario) adopta una visión de ciclo de más de un año y sube con miedo e infravaloración. En backtests desde 2017, el momentum funcionó mejor a corto y lo contrario a largo.' },
        { q: '¿Qué es el BOTTOM RADAR (puntuación de suelo)?', a: 'Un indicador auxiliar que usa métricas on-chain como el MVRV Z-Score para medir dónde está la capitalización respecto al coste medio de los inversores, mostrando la cercanía a zonas de suelo históricas en una escala de 0 a 100. El cálculo completo está publicado en la guía «suelo de Bitcoin».' }
      ],
      disclaimer: '⚠ Esta puntuación es una señal de referencia a partir de indicadores públicos, no asesoramiento de inversión. Todas las decisiones y la responsabilidad son tuyas.'
    },
    fr: {
      title: 'Indice de peur et d’avidité Stellar et score de timing d’achat',
      intro: 'Un tableau de bord gratuit qui synthétise 7 indicateurs en temps réel — dont l’indice de peur et d’avidité Stellar — en un score de 0 à 100 « est-ce le bon moment pour acheter ? ». Fonctionne dans le navigateur sans installation, en 13 langues.',
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
        { q: 'Dois-je acheter du Stellar quand l’indice est bas ?', a: 'La peur extrême a souvent été une opportunité d’accumulation, mais se fier au seul indice risque d’« attraper un couteau qui tombe ». Ce score pondère aussi RSI, MACD, multiple de Mayer, repli et croisements de moyennes, et le réduit prudemment en tendance baissière.' },
        { q: 'Comment le score de timing d’achat est-il calculé ?', a: 'Chacun des 7 indicateurs est converti en sous-score de 0 à 100 puis pondéré. Le résultat est 0–100, affiché en 5 bandes.' },
        { q: 'Est-ce gratuit ? Faut-il installer quelque chose ?', a: 'C’est entièrement gratuit et sans installation. Les données en temps réel proviennent des API publiques de CoinGecko, Binance et Alternative.me.' },
        { q: 'Quelle différence entre l’indice et le score de timing d’achat ?', a: 'L’indice est une seule mesure de sentiment (0–100) ; le score de timing d’achat est un composite de 7 indicateurs incluant l’indice (0–100).' },
        { q: 'D’où viennent les données et à quelle fréquence sont-elles actualisées ?', a: 'L’indice de peur et d’avidité vient d’Alternative.me ; les prix et bougies journalières, des API publiques de CoinGecko et Binance ; et les métriques on-chain, de CoinMetrics. L’écran se rafraîchit automatiquement environ chaque minute.' },
        { q: 'Dois-je acheter du Stellar maintenant ?', a: 'Il n’y a pas de réponse unique, mais le score de timing d’achat (0–100) permet d’évaluer objectivement si le marché est en zone de survente/peur ou de surchauffe/avidité. Dans l’onglet long terme (contrarian), des scores élevés marquent des zones où peur et sous-évaluation se recoupent — historiquement favorables au DCA — tandis que des scores bas signalent la surchauffe. C’est un signal de référence, pas un conseil en investissement.' },
        { q: 'Quelle différence entre le timing court terme et long terme ?', a: 'Le score est divisé en deux onglets. Le court terme (momentum) adopte une vue de suivi de tendance sur 1 à 3 mois et monte avec les tendances haussières fortes ; le long terme (contrarian) adopte une vue de cycle d’un an et plus et monte avec la peur et la sous-évaluation. Dans les backtests depuis 2017, le momentum a mieux fonctionné à court terme et le contrarian à long terme.' },
        { q: 'Qu’est-ce que le BOTTOM RADAR (score de plancher) ?', a: 'Une jauge auxiliaire qui utilise des métriques on-chain comme le MVRV Z-Score pour mesurer où se situe la capitalisation par rapport au coût moyen des investisseurs, en montrant la proximité des zones de plancher historiques sur une échelle de 0 à 100. Le calcul complet est publié sur la page « plancher du Bitcoin ».' }
      ],
      disclaimer: '⚠ Ce score est un signal de référence issu d’indicateurs publics, pas un conseil en investissement. Toutes les décisions et la responsabilité vous appartiennent.'
    },
    de: {
      title: 'Stellar Angst- & Gier-Index & Kaufzeitpunkt-Score',
      intro: 'Ein kostenloses Dashboard, das 7 Echtzeit-Indikatoren — inkl. Stellar Angst- & Gier-Index — zu einem 0–100-Score „Ist jetzt ein guter Kaufzeitpunkt?“ zusammenführt. Läuft im Browser ohne Installation, in 13 Sprachen.',
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
        { q: 'Soll ich Stellar kaufen, wenn der Index niedrig ist?', a: 'Extreme Angst war historisch oft eine Akkumulationschance, doch sich allein auf den Index zu verlassen, birgt das Risiko, „ins fallende Messer zu greifen“. Dieser Score gewichtet auch RSI, MACD, Mayer-Multiple, Rückgang und MA-Kreuzungen und senkt den Wert in Abwärtstrends konservativ.' },
        { q: 'Wie wird der Kaufzeitpunkt-Score berechnet?', a: 'Jeder der 7 Indikatoren wird in einen 0–100-Teil-Score umgerechnet und gewichtet. Das Ergebnis ist 0–100, in 5 Bändern dargestellt.' },
        { q: 'Ist es kostenlos? Muss ich etwas installieren?', a: 'Es ist völlig kostenlos und ohne Installation. Echtzeitdaten stammen aus den öffentlichen APIs von CoinGecko, Binance und Alternative.me.' },
        { q: 'Wie unterscheidet sich der Index vom Kaufzeitpunkt-Score?', a: 'Der Index ist eine einzelne Stimmungskennzahl (0–100); der Kaufzeitpunkt-Score ist ein Verbund aus 7 Indikatoren inkl. Index (0–100).' },
        { q: 'Woher stammen die Daten und wie oft werden sie aktualisiert?', a: 'Der Angst- & Gier-Index stammt von Alternative.me, Preise und Tageskerzen von den öffentlichen APIs von CoinGecko und Binance, On-Chain-Metriken von CoinMetrics. Der Bildschirm aktualisiert sich etwa jede Minute automatisch.' },
        { q: 'Sollte ich Stellar jetzt kaufen?', a: 'Eine eindeutige Antwort gibt es nicht, aber der Kaufzeitpunkt-Score (0–100) zeigt objektiv, ob der Markt in einer überverkauften Angst-Zone oder einer überhitzten Gier-Zone steckt. Auf dem Langfrist-Tab (antizyklisch) markieren hohe Werte Zonen, in denen Angst und Unterbewertung zusammenfallen — historisch günstig für DCA —, niedrige warnen vor Überhitzung. Ein Referenzsignal, keine Anlageberatung.' },
        { q: 'Wie unterscheiden sich kurz- und langfristiges Kauftiming?', a: 'Der Score ist in zwei Tabs geteilt. Kurzfristig (Momentum) folgt einer Trendfolge-Sicht von 1–3 Monaten und steigt mit starken Aufwärtstrends; langfristig (antizyklisch) folgt einer Zyklus-Sicht von über einem Jahr und steigt mit Angst und Unterbewertung. In Backtests seit 2017 funktionierte kurzfristig Momentum und langfristig die antizyklische Richtung besser.' },
        { q: 'Was ist der BOTTOM RADAR (Boden-Score)?', a: 'Eine Zusatzanzeige, die mit On-Chain-Metriken wie den MVRV Z-Score misst, wo die Marktkapitalisierung relativ zum durchschnittlichen Einstandskurs der Anleger liegt, und die Nähe zu historischen Bodenzonen auf einer Skala von 0–100 zeigt. Die vollständige Berechnung ist auf der Seite „Bitcoin-Boden“ veröffentlicht.' }
      ],
      disclaimer: '⚠ Dieser Score ist ein Referenzsignal aus öffentlichen Indikatoren, keine Anlageberatung. Alle Entscheidungen und die Verantwortung liegen bei Ihnen.'
    },
    it: {
      title: 'Indice di paura e avidità Stellar e punteggio di timing d’acquisto',
      intro: 'Una dashboard gratuita che sintetizza 7 indicatori in tempo reale — incluso l’indice di paura e avidità di Stellar — in un punteggio 0–100 «è il momento giusto per comprare?». Funziona nel browser senza installazione, in 13 lingue.',
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
        { q: 'Dovrei comprare Stellar quando l’indice è basso?', a: 'La paura estrema è stata spesso un’occasione di accumulo, ma affidarsi solo all’indice rischia di «prendere un coltello che cade». Questo punteggio pesa anche RSI, MACD, multiplo di Mayer, ribasso e incroci di medie, e lo riduce in modo prudente nei trend ribassisti.' },
        { q: 'Come si calcola il punteggio d’acquisto?', a: 'Ciascuno dei 7 indicatori è convertito in un sotto-punteggio 0–100 e ponderato. Il risultato è 0–100, mostrato in 5 bande.' },
        { q: 'È gratis? Serve installare qualcosa?', a: 'È completamente gratis e senza installazione. I dati in tempo reale provengono dalle API pubbliche di CoinGecko, Binance e Alternative.me.' },
        { q: 'Che differenza c’è tra l’indice e il punteggio d’acquisto?', a: 'L’indice è una singola misura di sentiment (0–100); il punteggio d’acquisto è un composito dei 7 indicatori incluso l’indice (0–100).' },
        { q: 'Da dove vengono i dati e con che frequenza si aggiornano?', a: 'L’indice di paura e avidità viene da Alternative.me; prezzi e candele giornaliere dalle API pubbliche di CoinGecko e Binance; le metriche on-chain da CoinMetrics. Lo schermo si aggiorna automaticamente circa ogni minuto.' },
        { q: 'Dovrei comprare Stellar adesso?', a: 'Non c’è una risposta unica, ma il punteggio d’acquisto (0–100) permette di valutare oggettivamente se il mercato è in zona ipervenduto/paura o surriscaldato/avidità. Nella scheda a lungo termine (contrarian), punteggi alti indicano zone in cui paura e sottovalutazione coincidono — storicamente favorevoli al PAC — mentre punteggi bassi avvertono del surriscaldamento. È un segnale di riferimento, non consulenza d’investimento.' },
        { q: 'Che differenza c’è tra timing a breve e a lungo termine?', a: 'Il punteggio è diviso in due schede. Il breve termine (momentum) adotta una visione trend-following di 1–3 mesi e sale con trend rialzisti forti; il lungo termine (contrarian) adotta una visione di ciclo oltre l’anno e sale con paura e sottovalutazione. Nei backtest dal 2017, il momentum ha funzionato meglio nel breve e il contrarian nel lungo.' },
        { q: 'Cos’è il BOTTOM RADAR (punteggio di minimo)?', a: 'Un indicatore ausiliario che usa metriche on-chain come l’MVRV Z-Score per misurare dove si trova la capitalizzazione rispetto al costo medio degli investitori, mostrando la vicinanza alle zone di minimo storiche su una scala 0–100. Il calcolo completo è pubblicato nella guida «minimo di Bitcoin».' }
      ],
      disclaimer: '⚠ Questo punteggio è un segnale di riferimento da indicatori pubblici, non consulenza d’investimento. Ogni decisione e responsabilità è tua.'
    },
    pt: {
      title: 'Índice de medo e ganância do Stellar e pontuação de momento de compra',
      intro: 'Um painel gratuito que sintetiza 7 indicadores em tempo real — incluindo o índice de medo e ganância do Stellar — numa pontuação de 0 a 100 «é uma boa hora para comprar?». Roda no navegador sem instalação, em 13 idiomas.',
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
        { q: 'Devo comprar Stellar quando o índice está baixo?', a: 'O medo extremo foi muitas vezes uma oportunidade de acumulação, mas confiar só no índice arrisca «pegar uma faca caindo». Esta pontuação também pondera RSI, MACD, múltiplo de Mayer, queda e cruzamentos de médias, e a reduz de forma conservadora em tendências de baixa.' },
        { q: 'Como a pontuação de compra é calculada?', a: 'Cada um dos 7 indicadores é convertido numa subpontuação de 0 a 100 e ponderado. O resultado é 0–100, em 5 faixas.' },
        { q: 'É grátis? Preciso instalar algo?', a: 'É totalmente grátis e sem instalação. Os dados em tempo real vêm das APIs públicas da CoinGecko, Binance e Alternative.me.' },
        { q: 'Qual a diferença entre o índice e a pontuação de compra?', a: 'O índice é uma única métrica de sentimento (0–100); a pontuação de compra é um composto de 7 indicadores incluindo o índice (0–100).' },
        { q: 'De onde vêm os dados e com que frequência são atualizados?', a: 'O índice de medo e ganância vem da Alternative.me; preços e velas diárias, das APIs públicas da CoinGecko e da Binance; e as métricas on-chain, da CoinMetrics. A tela atualiza automaticamente a cada minuto, aproximadamente.' },
        { q: 'Devo comprar Stellar agora?', a: 'Não há resposta única, mas a pontuação de compra (0–100) permite avaliar objetivamente se o mercado está em zona de sobrevenda/medo ou de superaquecimento/ganância. Na aba de longo prazo (contrária), pontuações altas marcam zonas onde medo e subvalorização coincidem — historicamente favoráveis ao DCA —, e as baixas alertam para superaquecimento. É um sinal de referência, não consultoria de investimento.' },
        { q: 'Qual a diferença entre o timing de curto e de longo prazo?', a: 'A pontuação divide-se em duas abas. O curto prazo (momentum) adota uma visão de seguimento de tendência de 1–3 meses e sobe com tendências de alta fortes; o longo prazo (contrário) adota uma visão de ciclo de mais de um ano e sobe com medo e subvalorização. Em backtests desde 2017, o momentum funcionou melhor no curto e o contrário no longo.' },
        { q: 'O que é o BOTTOM RADAR (pontuação de fundo)?', a: 'Um medidor auxiliar que usa métricas on-chain como o MVRV Z-Score para medir onde a capitalização está em relação ao custo médio dos investidores, mostrando a proximidade de zonas de fundo históricas numa escala de 0 a 100. O cálculo completo está publicado no guia «fundo do Bitcoin».' }
      ],
      disclaimer: '⚠ Esta pontuação é um sinal de referência a partir de indicadores públicos, não é consultoria de investimento. Todas as decisões e a responsabilidade são suas.'
    },
    ru: {
      title: 'Индекс страха и жадности стеллара и оценка времени покупки',
      intro: 'Бесплатная панель, которая объединяет 7 индикаторов в реальном времени — включая индекс страха и жадности стеллара — в оценку от 0 до 100 «подходящее ли сейчас время для покупки?». Работает в браузере без установки, на 13 языках.',
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
        { q: 'Покупать ли стеллар, когда индекс низкий?', a: 'Крайний страх исторически часто был возможностью накопления, но полагаться только на индекс рискованно — можно «поймать падающий нож». Эта оценка также учитывает RSI, MACD, множитель Майера, просадку и пересечения средних и консервативно снижается в нисходящих трендах.' },
        { q: 'Как рассчитывается оценка покупки?', a: 'Каждый из 7 индикаторов переводится в частную оценку 0–100 и взвешивается. Результат — 0–100, в 5 диапазонах.' },
        { q: 'Это бесплатно? Нужно ли что-то устанавливать?', a: 'Полностью бесплатно и без установки. Данные в реальном времени берутся из публичных API CoinGecko, Binance и Alternative.me.' },
        { q: 'Чем индекс отличается от оценки покупки?', a: 'Индекс — одна метрика настроения (0–100); оценка покупки — составной показатель из 7 индикаторов, включая индекс (0–100).' },
        { q: 'Откуда берутся данные и как часто они обновляются?', a: 'Индекс страха и жадности — с Alternative.me; цены и дневные свечи — из публичных API CoinGecko и Binance; ончейн-метрики — из CoinMetrics. Экран автоматически обновляется примерно раз в минуту.' },
        { q: 'Стоит ли покупать стеллар прямо сейчас?', a: 'Единственно верного ответа нет, но оценка покупки (0–100) объективно показывает, находится ли рынок в зоне перепроданности/страха или перегрева/жадности. На вкладке долгосрочного (контртрендового) взгляда высокие значения отмечают зоны, где совпадают страх и недооценка — исторически благоприятные для усреднения, — а низкие предупреждают о перегреве. Это справочный сигнал, а не инвестиционная рекомендация.' },
        { q: 'Чем отличаются краткосрочный и долгосрочный тайминг?', a: 'Оценка разделена на две вкладки. Краткосрочная (моментум) использует трендследящий взгляд на 1–3 месяца и растёт при сильных восходящих трендах; долгосрочная (контртренд) — циклический взгляд от года и растёт при страхе и недооценке. В бэктестах с 2017 года на коротком горизонте лучше работал моментум, на длинном — контртренд.' },
        { q: 'Что такое BOTTOM RADAR (оценка дна)?', a: 'Вспомогательный индикатор, который с помощью ончейн-метрик, таких как MVRV Z-оценка, измеряет положение капитализации относительно средней цены входа инвесторов и показывает близость к историческим зонам дна по шкале 0–100. Полный расчёт опубликован на странице «дно биткоина».' }
      ],
      disclaimer: '⚠ Эта оценка — справочный сигнал на основе публичных индикаторов, а не инвестиционная рекомендация. Все решения и ответственность — на вас.'
    },
    nl: {
      title: 'Stellar Angst- & Hebzucht-index en koopmoment-score',
      intro: 'Een gratis dashboard dat 7 realtime indicatoren — inclusief de Stellar Angst- & Hebzucht-index — samenvoegt tot een score van 0–100 voor «is het nu een goed moment om te kopen?». Draait in de browser zonder installatie, in 13 talen.',
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
        { q: 'Moet ik Stellar kopen als de index laag is?', a: 'Extreme angst was vaak een accumulatiekans, maar alleen op de index vertrouwen riskeert «een vallend mes te vangen». Deze score weegt ook RSI, MACD, Mayer Multiple, daling en gemiddelde-kruisingen mee, en verlaagt de score behoudend in dalende trends.' },
        { q: 'Hoe wordt de koopmoment-score berekend?', a: 'Elk van de 7 indicatoren wordt omgezet naar een deelscore van 0–100 en gewogen. Het resultaat is 0–100, in 5 banden.' },
        { q: 'Is het gratis? Moet ik iets installeren?', a: 'Het is volledig gratis en zonder installatie. Realtime data komt van de publieke API’s van CoinGecko, Binance en Alternative.me.' },
        { q: 'Wat is het verschil tussen de index en de koopmoment-score?', a: 'De index is één sentimentmaatstaf (0–100); de koopmoment-score is een samenstelling van 7 indicatoren inclusief de index (0–100).' },
        { q: 'Waar komen de gegevens vandaan en hoe vaak worden ze ververst?', a: 'De Angst- & Hebzucht-index komt van Alternative.me; prijzen en dagcandles van de publieke API’s van CoinGecko en Binance; on-chain-metrieken van CoinMetrics. Het scherm ververst ongeveer elke minuut automatisch.' },
        { q: 'Moet ik nu Stellar kopen?', a: 'Er is geen eenduidig antwoord, maar de koopmoment-score (0–100) geeft een objectief beeld of de markt in een oversold/angst-zone of een oververhitte/hebzucht-zone zit. Op het langetermijn-tabblad (tegendraads) markeren hoge scores zones waar angst en onderwaardering samenvallen — historisch gunstig voor DCA — terwijl lage scores waarschuwen voor oververhitting. Het is een referentiesignaal, geen beleggingsadvies.' },
        { q: 'Hoe verschillen korte- en langetermijn-kooptiming?', a: 'De score is verdeeld over twee tabbladen. Korte termijn (momentum) hanteert een trendvolgende blik van 1–3 maanden en stijgt bij sterke opwaartse trends; lange termijn (tegendraads) hanteert een cyclusblik van ruim een jaar en stijgt bij angst en onderwaardering. In backtests sinds 2017 werkte momentum beter op korte termijn en tegendraads beter op lange termijn.' },
        { q: 'Wat is de BOTTOM RADAR (bodemscore)?', a: 'Een hulpmeter die met on-chain-metrieken zoals de MVRV Z-score meet waar de marktkapitalisatie staat ten opzichte van de gemiddelde kostprijs van beleggers, en de nabijheid van historische bodemzones toont op een schaal van 0–100. De volledige berekening staat op de pagina «Bitcoin-bodem».' }
      ],
      disclaimer: '⚠ Deze score is een referentiesignaal uit publieke indicatoren, geen beleggingsadvies. Alle beslissingen en verantwoordelijkheid zijn van uzelf.'
    },
    th: {
      title: 'ดัชนีความกลัวและความโลภสเตลลาร์ และคะแนนจังหวะซื้อ',
      intro: 'แดชบอร์ดฟรีที่รวม 7 ตัวชี้วัดแบบเรียลไทม์ — รวมถึงดัชนีความกลัวและความโลภของสเตลลาร์ — เป็นคะแนน 0–100 ว่า “ตอนนี้เป็นจังหวะซื้อหรือไม่?” ใช้งานในเบราว์เซอร์ได้ทันที ไม่ต้องติดตั้ง รองรับ 13 ภาษา',
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
        { q: 'ถ้าดัชนีต่ำควรซื้อสเตลลาร์ไหม?', a: 'ความกลัวสุดขีดในอดีตมักเป็นโอกาสทยอยซื้อ แต่ดูเพียงดัชนีอย่างเดียวเสี่ยง “รับมีดที่กำลังตก” คะแนนนี้ยังพิจารณา RSI, MACD, Mayer Multiple, การย่อ และการตัดกันของเส้นเฉลี่ย และลดคะแนนอย่างระมัดระวังในแนวโน้มขาลง' },
        { q: 'คะแนนจังหวะซื้อคำนวณอย่างไร?', a: 'แปลงแต่ละตัวชี้วัดทั้ง 7 เป็นคะแนนย่อย 0–100 แล้วถ่วงน้ำหนักรวมกัน ผลลัพธ์คือ 0–100 แสดงเป็น 5 ระดับ' },
        { q: 'ฟรีไหม? ต้องติดตั้งไหม?', a: 'ฟรีทั้งหมดและไม่ต้องติดตั้ง ข้อมูลเรียลไทม์มาจาก API สาธารณะของ CoinGecko, Binance และ Alternative.me' },
        { q: 'ดัชนีกับคะแนนจังหวะซื้อต่างกันอย่างไร?', a: 'ดัชนีเป็นตัวชี้วัดอารมณ์เดียว (0–100); คะแนนจังหวะซื้อเป็นคะแนนรวมจาก 7 ตัวชี้วัดรวมถึงดัชนี (0–100)' },
        { q: 'ข้อมูลมาจากไหน อัปเดตบ่อยแค่ไหน?', a: 'ดัชนีความกลัว-ความโลภมาจาก Alternative.me ราคาและแท่งเทียนรายวันมาจาก API สาธารณะของ CoinGecko และ Binance ส่วนตัวชี้วัดออนเชนมาจาก CoinMetrics หน้าจออัปเดตอัตโนมัติราวทุก 1 นาที' },
        { q: 'ตอนนี้ควรซื้อสเตลลาร์ไหม?', a: 'ไม่มีคำตอบตายตัว แต่คะแนนจังหวะซื้อ (0–100) ช่วยประเมินอย่างเป็นกลางว่าตลาดอยู่ในโซนขายมากเกิน/ความกลัว หรือโซนร้อนแรง/ความโลภ ในแท็บระยะยาว (สวนตลาด) คะแนนยิ่งสูงหมายถึงโซนที่ความกลัวและราคาต่ำกว่ามูลค่าทับซ้อนกัน ซึ่งในอดีตเอื้อต่อ DCA ส่วนคะแนนต่ำเตือนถึงความร้อนแรง เป็นเพียงสัญญาณอ้างอิง ไม่ใช่คำแนะนำการลงทุน' },
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
  /* 푸터 설명 문단(.foot-desc) — 스텔라루멘 언급이 있어 공통 foot-i18n.js 가 아니라 여기에 둔다 */
  var FOOT_DESC = {
    ko: 'broodev는 설치 없이 브라우저에서 바로 쓰는 무료 웹앱을 만드는 앱 포트폴리오입니다. 이 페이지의 스텔라루멘 공포·탐욕 지수와 매수 타이밍 점수는 공개 지표를 합성한 참고 정보이며 투자 자문이 아닙니다. 광고는 Google AdSense를 통해 게재될 수 있습니다.',
    en: 'broodev is a portfolio of free web apps that run right in your browser with no install. The Stellar Fear & Greed Index and buy-timing score on this page are reference information synthesized from public indicators, not investment advice. Ads may be served through Google AdSense.',
    ja: 'broodevは、インストール不要でブラウザからすぐ使える無料Webアプリを作るアプリポートフォリオです。このページのステラルーメン恐怖・強欲指数と買い時スコアは公開指標を合成した参考情報であり、投資助言ではありません。広告はGoogle AdSenseを通じて掲載される場合があります。',
    zh: 'broodev 是一个应用作品集，制作无需安装、在浏览器中即可直接使用的免费网页应用。本页的恒星币恐惧与贪婪指数和买入时机评分是综合公开指标得出的参考信息，不构成投资建议。广告可能通过 Google AdSense 投放。',
    'zh-Hant': 'broodev 是一個應用作品集，製作無需安裝、在瀏覽器中即可直接使用的免費網頁應用。本頁的恆星幣恐懼與貪婪指數和買入時機評分是綜合公開指標得出的參考資訊，不構成投資建議。廣告可能透過 Google AdSense 刊登。',
    th: 'broodev คือพอร์ตโฟลิโอแอปที่สร้างเว็บแอปฟรีซึ่งใช้งานได้ทันทีในเบราว์เซอร์โดยไม่ต้องติดตั้ง ดัชนีความกลัว-ความโลภสเตลลาร์และคะแนนจังหวะซื้อในหน้านี้เป็นข้อมูลอ้างอิงที่สังเคราะห์จากตัวชี้วัดสาธารณะ ไม่ใช่คำแนะนำการลงทุน โฆษณาอาจแสดงผ่าน Google AdSense',
    es: 'broodev es un portafolio de aplicaciones web gratuitas que funcionan directamente en el navegador, sin instalación. El Índice de Miedo y Codicia de Stellar y la puntuación de momento de compra de esta página son información de referencia elaborada a partir de indicadores públicos, no asesoramiento de inversión. Los anuncios pueden mostrarse a través de Google AdSense.',
    fr: 'broodev est un portfolio d’applications web gratuites qui s’utilisent directement dans le navigateur, sans installation. L’indice Peur & Avidité du Stellar et le score de timing d’achat de cette page sont des informations de référence issues d’indicateurs publics, et non un conseil en investissement. Des annonces peuvent être diffusées via Google AdSense.',
    de: 'broodev ist ein Portfolio kostenloser Web-Apps, die ohne Installation direkt im Browser laufen. Der Stellar-Angst-und-Gier-Index und der Kauf-Timing-Score auf dieser Seite sind aus öffentlichen Indikatoren zusammengesetzte Referenzinformationen und keine Anlageberatung. Werbung kann über Google AdSense ausgeliefert werden.',
    it: 'broodev è un portfolio di web app gratuite che funzionano direttamente nel browser, senza installazione. L’Indice di Paura e Avidità di Stellar e il punteggio di timing d’acquisto in questa pagina sono informazioni di riferimento ricavate da indicatori pubblici, non una consulenza di investimento. Gli annunci possono essere pubblicati tramite Google AdSense.',
    pt: 'O broodev é um portefólio de aplicações web gratuitas que funcionam diretamente no navegador, sem instalação. O Índice de Medo e Ganância do Stellar e a pontuação de momento de compra desta página são informação de referência sintetizada a partir de indicadores públicos, não aconselhamento de investimento. Os anúncios podem ser apresentados através do Google AdSense.',
    ru: 'broodev — это портфолио бесплатных веб-приложений, которые работают прямо в браузере без установки. Индекс страха и жадности стеллара и оценка момента покупки на этой странице — справочная информация, собранная из открытых индикаторов, а не инвестиционная рекомендация. Реклама может показываться через Google AdSense.',
    nl: 'broodev is een portfolio van gratis webapps die zonder installatie direct in je browser werken. De Stellar Angst- en Hebzuchtindex en de koop-timingscore op deze pagina zijn referentie-informatie samengesteld uit openbare indicatoren, geen beleggingsadvies. Advertenties kunnen via Google AdSense worden getoond.'
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
    "title": "A Guide to the Stellar (XLM) Buy-Timing Score",
    "intro": "The Stellar (XLM) page brings RSI(14), MACD(12·26·9), the Fear & Greed Index, the Mayer Multiple, drawdown from the 365-day high, the 50/200 golden/death cross and the MVRV Z-Score onto one screen and tells you, as a 0–100 score, which way the current price leans by historical standards. It runs free on the web with no extra software, and the score has five levels from STRONG BUY to OVERHEATED. Because XLM is the native asset of a payments network, a few indicators need careful interpretation.",
    "coinH": "What is Stellar (XLM)?",
    "coinP": [
     "Stellar is an open-source payments network for cross-border transfers and asset issuance, and lumens (XLM) are its native asset. It was created in 2014 by Jed McCaleb, a Ripple co-founder, together with Joyce Kim, and its development is supported by the non-profit Stellar Development Foundation (SDF). Banks, remittance companies and stablecoin issuers use it to issue and exchange assets backed by fiat currencies such as the dollar, while XLM pays transaction fees and covers account minimum balances.",
     "Instead of mining, it finalizes transactions within seconds using the Stellar Consensus Protocol (SCP, federated Byzantine agreement), designed by David Mazières in 2015. It started with 100 billion lumens and 1% annual inflation, but network validators voted to end inflation in October 2019, and in November that year the SDF burned about 55 billion XLM, cutting total supply to about 50 billion. In February 2024 the Soroban smart contract platform arrived on mainnet."
    ],
    "applyH": "Applying the indicators to Stellar",
    "apply": [
     "XLM has often traded much like XRP, which shares the same payments theme. When the score swings sharply, checking XRP news as well as BTC makes the cause easier to find.",
     "The Fear & Greed Index is not a Stellar value but Alternative.me’s index for the entire crypto market, weighted toward BTC. Events that concern only XLM, such as a large remittance partnership or a network upgrade, are not reflected in it.",
     "The MVRV Z-Score is calculated because CoinMetrics has data for XLM. However, the SDF holds a significant part of the supply and spends it gradually on ecosystem support and similar uses, so the metric cannot be read as purely the market’s average cost basis.",
     "After setting its all-time high in January 2018, XLM spent a long time below it, and a pattern of brief spikes followed by deep retracements has repeated. Using Bitcoin’s Mayer Multiple 2.4 overheating line and -50% drawdown buy zone as-is can trigger overheating signals right after a spike or early buy signals in the middle of a downtrend.",
     "Daily trading value is only a fraction of BTC’s, and there have been several days when a single piece of news moved the price by double-digit percentages. On days like that, RSI and MACD hit extremes from one candle alone, so it helps to watch how the indicators settle over the following days."
    ],
    "histH": "Stellar price cycles at a glance",
    "hist": [
     "2014–2015 — Jed McCaleb and Joyce Kim launched Stellar, which moved to a new SCP-based network in 2015.",
     "2018 — Set its all-time high, still below $1, in early January, then fell steeply in the bear market.",
     "2019 — The end of inflation (October) and the SDF’s burn of about 55 billion XLM (November) reshaped the supply.",
     "2021 — Rose strongly in the bull market without beating the 2018 high; in October a USDC settlement partnership with remittance company MoneyGram was announced.",
     "2024 — Soroban smart contracts reached mainnet in February, and in November XLM surged within a short period alongside XRP."
    ],
    "faq": [
     {
      "q": "Is there a Fear & Greed Index just for Stellar?",
      "a": "No. The Fear & Greed Index here is Alternative.me’s market-wide value, and Alternative.me does not publish a separate XLM figure. That is why the card is labeled as a market-wide index. Stellar’s own trend shows up in the other indicators, which are calculated from the XLM price."
     },
     {
      "q": "Does Stellar get an MVRV reading too?",
      "a": "Yes. CoinMetrics’ public data includes XLM, so the MVRV Z-Score is calculated. Because supply that has never traded on the market, such as the SDF’s holdings, may be included, it is hard to treat it as a bottom-and-top indicator the way Bitcoin’s MVRV is used. When there is no data, it shows N/A."
     },
     {
      "q": "Should I buy Stellar now?",
      "a": "This page does not give investment advice. A score of 80 or more (STRONG BUY) only means several oversold, fear and undervaluation signals overlap; below 25 (OVERHEATED) means overheating signals overlap. Since XLM has had frequent short-lived spikes, it helps to read the short-term and long-term tabs separately."
     },
     {
      "q": "Are XLM and XRP the same coin?",
      "a": "No. Jed McCaleb was involved in both projects and both target payments, but Stellar is a separate network backed by a non-profit foundation, with a different consensus protocol (SCP) and a different token supply structure. Each coin has its own page."
     },
     {
      "q": "Will the total supply of XLM grow?",
      "a": "Since inflation ended in 2019, the protocol has not minted new XLM, and total supply has been about 50 billion since the burn in November of that year. Circulating supply can still rise as SDF holdings reach the market, and this page does not add supply changes to the score."
     },
     {
      "q": "Does Stellar network activity feed into the score?",
      "a": "No. Network usage metrics such as payment counts, active accounts or stablecoin issuance are not part of the calculation. The score is built only from indicators derived from the XLM price, market sentiment and MVRV."
     }
    ]
   },
   "ja": {
    "title": "ステラルーメン（XLM）買い時スコアのガイド",
    "intro": "ステラルーメン（XLM）のページは、RSI(14)・MACD(12·26·9)・恐怖・強欲指数・Mayer Multiple・365日高値からの下落率・50/200ゴールデンクロス・デッドクロス・MVRV Z-Scoreを一つの画面に集め、いまの相場が過去の基準でどちらに傾いているかを0〜100のスコアで示します。専用ソフトなしにウェブで無料で使え、スコアはSTRONG BUYからOVERHEATEDまでの5段階です。XLMは送金ネットワークの基軸資産という性格上、いくつかの指標は解釈に注意が必要です。",
    "coinH": "ステラルーメン（XLM）とは？",
    "coinP": [
     "Stellarは国際送金と資産発行のためのオープンソース決済ネットワークで、ステラルーメン（XLM）はその基軸資産です。リップルの共同創業者だったジェド・マケーレブがジョイス・キムとともに2014年に立ち上げ、非営利団体のステラ開発財団（SDF）が開発を支えています。銀行や送金業者、ステーブルコイン発行体がドルなどの法定通貨建て資産をStellar上で発行・送受信するのに使われ、XLMは取引手数料とアカウントの最低残高に使われます。",
     "マイニングの代わりに、2015年にデビッド・マジエールが設計したStellarコンセンサスプロトコル（SCP、連合ビザンチン合意）で数秒以内に取引を確定させます。当初は1,000億枚が発行され毎年1%ずつ増えていましたが、2019年10月にネットワークのバリデーターの投票でインフレが廃止され、同年11月にはSDFが約550億XLMを焼却して総供給量は約500億枚に減りました。2024年2月にはスマートコントラクト基盤のSorobanがメインネットに導入されました。"
    ],
    "applyH": "ステラルーメンに指標を当てはめるときの注意",
    "apply": [
     "XLMは同じ送金テーマに分類されるリップル（XRP）と似た値動きを見せた時期が多くありました。スコアが急変したときは、BTCだけでなくXRP関連のニュースも確認すると原因をつかみやすくなります。",
     "恐怖・強欲指数はStellar専用の値ではなく、Alternative.meによる暗号資産市場全体（BTC中心）の指数です。大型の送金提携やネットワークのアップグレードなど、XLMだけに関わる出来事はこの指数に反映されません。",
     "MVRV Z-ScoreはCoinMetricsにデータがあるため計算されます。ただし供給のかなりの部分をSDFが保有し、エコシステム支援などに段階的に使う仕組みなので、市場参加者の平均取得コストだけを映す指標とはみなしにくい面があります。",
     "XLMは2018年1月に史上最高値を付けたあと長くその水準を下回り、短い急騰のあと大きく押し戻されるパターンを繰り返してきました。ビットコイン基準のMayer Multiple 2.4の過熱ラインや下落率-50%の買いゾーンをそのまま使うと、急騰直後に過熱シグナルが、下落相場の途中で早すぎる買いシグナルが出ることがあります。",
     "1日の売買代金はBTCのごく一部にすぎず、ニュース一つで1日に2桁パーセント動いた日も何度かありました。そうした日はRSIやMACDがローソク足1本だけで極端な値に達するため、数日後に指標がどう落ち着くかも合わせて見ると安心です。"
    ],
    "histH": "ステラルーメンの価格サイクル",
    "hist": [
     "2014〜2015年 — ジェド・マケーレブとジョイス・キムがStellarを立ち上げ、2015年にSCPベースの新ネットワークへ移行しました。",
     "2018年 — 1月初めに1ドルに届かない水準で史上最高値を付けたあと、弱気相場で大きく下落しました。",
     "2019年 — インフレ廃止（10月）とSDFによる約550億XLMの焼却（11月）で供給構造が変わりました。",
     "2021年 — 強気相場で大きく上昇したものの2018年の高値は超えられず、10月には送金業者MoneyGramとのUSDC決済提携が発表されました。",
     "2024年 — 2月にSorobanのスマートコントラクトがメインネットに導入され、11月にはリップル（XRP）とともに短期間で急騰しました。"
    ],
    "faq": [
     {
      "q": "ステラルーメン専用の恐怖指数はありますか？",
      "a": "ありません。この画面の恐怖・強欲指数はAlternative.meが市場全体を対象に出している値で、Alternative.meはXLM専用の値を別途出していません。カードに市場全体の指数と付いているのもそのためです。Stellar固有の動きは、XLMの相場から計算するほかの指標で確認してください。"
     },
     {
      "q": "ステラルーメンでもMVRVは表示されますか？",
      "a": "はい。CoinMetricsの公開データにXLMがあるため、MVRV Z-Scoreを計算します。ただしSDFの保有分のように市場で取引されていない供給が含まれる可能性があり、ビットコインのMVRVのように底と天井を指す指標と言い切るのは難しいところです。データがないときはN/Aと表示されます。"
     },
     {
      "q": "今ステラルーメンを買ってもいいですか？",
      "a": "このページは投資を勧めるものではありません。スコアが80以上（STRONG BUY）なら売られすぎ・恐怖・割安のシグナルがいくつも重なった状態、25未満（OVERHEATED）なら過熱のシグナルが重なった状態という意味にすぎません。短期間の急騰が多かったコインなので、短期タブと長期タブを分けて読むのがおすすめです。"
     },
     {
      "q": "XLMとXRPは同じコインですか？",
      "a": "違います。ジェド・マケーレブが両方のプロジェクトに関わり、送金という目的も似ていますが、Stellarは非営利財団が支える別のネットワークで、コンセンサス方式（SCP）もトークンの供給構造も異なります。2つのコインはそれぞれ別の画面で見られます。"
     },
     {
      "q": "XLMの総供給量は今後増えますか？",
      "a": "2019年にインフレが廃止されて以降、プロトコルが新しいXLMを発行することはありません。同年11月の焼却以降、総供給量は約500億枚です。ただしSDFの保有分が市場に出れば流通量は増えることがあり、この画面は供給の変化をスコアに別途組み込んでいません。"
     },
     {
      "q": "Stellarネットワークの活動もスコアに反映されますか？",
      "a": "いいえ。決済件数、アクティブアカウント数、ステーブルコインの発行規模といったネットワーク利用の指標は計算に入っていません。スコアはXLMの相場から得た指標と市場心理、MVRVだけで作られています。"
     }
    ]
   },
   "ko": {
    "title": "스텔라루멘(XLM) 매수 타이밍 점수 안내",
    "intro": "스텔라루멘(XLM) 페이지는 RSI(14)·MACD(12·26·9)·공포·탐욕 지수·Mayer Multiple·365일 고점 대비 낙폭·50/200 골든·데드 크로스·MVRV Z-Score를 한 화면에 모아, 지금 시세가 과거 기준으로 어느 쪽에 치우쳐 있는지 0~100 점수로 알려 줍니다. 별도 프로그램 없이 웹에서 무료로 쓸 수 있고, 점수 구간은 STRONG BUY에서 OVERHEATED까지 다섯 단계입니다. 송금용 네트워크의 기본 자산이라는 XLM의 특성상 몇 가지 지표는 해석에 주의가 필요합니다.",
    "coinH": "스텔라루멘(XLM)이란?",
    "coinP": [
     "스텔라는 국제 송금과 자산 발행을 위한 오픈소스 결제 네트워크이고, 스텔라루멘(XLM)은 그 기본 자산입니다. 리플 공동 창업자였던 제드 매케일럽이 조이스 김과 함께 2014년에 만들었으며, 비영리 재단인 스텔라 개발 재단(SDF)이 개발을 지원합니다. 은행·송금 업체·스테이블코인 발행사가 달러 같은 법정화폐 기반 자산을 스텔라 위에 발행해 주고받는 데 쓰이고, XLM은 거래 수수료와 계정 최소 잔고에 사용됩니다.",
     "채굴 대신 2015년 데이비드 마지에르가 설계한 스텔라 합의 프로토콜(SCP, 연합 비잔틴 합의)로 몇 초 안에 거래를 확정합니다. 처음에는 1,000억 개가 발행되고 매년 1%씩 늘었지만, 2019년 10월 네트워크 검증자들의 투표로 인플레이션이 폐지됐고 같은 해 11월 SDF가 약 550억 XLM을 소각해 총공급이 약 500억 개로 줄었습니다. 2024년 2월에는 스마트 컨트랙트 플랫폼 Soroban이 메인넷에 도입됐습니다."
    ],
    "applyH": "스텔라루멘에 지표를 적용할 때",
    "apply": [
     "XLM은 같은 송금 테마로 묶이는 리플(XRP)과 비슷한 가격 흐름을 보인 시기가 많았습니다. 점수가 급변할 때는 BTC뿐 아니라 XRP 쪽 뉴스도 함께 확인하면 원인을 파악하기 쉽습니다.",
     "공포·탐욕 지수는 스텔라 전용 값이 아니라 Alternative.me의 암호화폐 시장 전체(BTC 중심) 지수입니다. 대형 송금 제휴나 네트워크 업그레이드처럼 XLM에만 해당하는 사건은 이 지수에 반영되지 않습니다.",
     "MVRV Z-Score는 CoinMetrics 데이터가 있어 계산됩니다. 다만 공급의 상당 부분을 SDF가 보유하다가 생태계 지원 등에 단계적으로 쓰는 구조라, 시장 참여자의 평균 매수원가만 반영하는 지표로 보기는 어렵습니다.",
     "XLM은 2018년 1월 사상 최고가를 기록한 뒤 오랜 기간 그 아래에 머물렀고, 짧은 급등 뒤 크게 되돌리는 패턴이 반복됐습니다. 비트코인 기준인 Mayer Multiple 2.4 과열·낙폭 -50% 매수 구간을 그대로 쓰면, 급등 직후 과열 신호나 하락장 중반의 이른 매수 신호가 나올 수 있습니다.",
     "하루 거래대금이 BTC의 일부에 불과해, 뉴스 하나에 하루 두 자릿수 퍼센트가 움직인 날도 여러 번 있었습니다. 이런 날에는 RSI와 MACD가 캔들 한 개만으로 극단값에 닿으므로, 며칠 뒤 지표가 어떻게 정리되는지 함께 보는 것이 좋습니다."
    ],
    "histH": "스텔라루멘 가격 사이클 요약",
    "hist": [
     "2014~2015년 — 제드 매케일럽과 조이스 김이 스텔라를 출범시켰고, 2015년 SCP 기반의 새 네트워크로 전환했습니다.",
     "2018년 — 1월 초 1달러에 못 미치는 수준에서 사상 최고가를 기록한 뒤 약세장에서 크게 하락했습니다.",
     "2019년 — 인플레이션 폐지(10월)와 SDF의 약 550억 XLM 소각(11월)으로 공급 구조가 바뀌었습니다.",
     "2021년 — 강세장에서 크게 올랐지만 2018년 고점은 넘지 못했고, 10월에는 송금 업체 MoneyGram과의 USDC 정산 제휴가 발표됐습니다.",
     "2024년 — 2월 Soroban 스마트 컨트랙트가 메인넷에 도입됐고, 11월에는 리플(XRP)과 함께 짧은 기간에 급등했습니다."
    ],
    "faq": [
     {
      "q": "스텔라루멘 전용 공포지수가 있나요?",
      "a": "없습니다. 이 화면의 공포·탐욕 지수는 Alternative.me가 시장 전체를 대상으로 내는 값이며, Alternative.me는 XLM 전용 값을 따로 내지 않습니다. 카드에 시장 전체 지수라고 붙어 있는 것도 그 때문입니다. 스텔라 고유의 흐름은 XLM 시세로 계산하는 나머지 지표에서 확인하세요."
     },
     {
      "q": "스텔라루멘에도 MVRV가 나오나요?",
      "a": "네. CoinMetrics 공개 데이터에 XLM이 있어 MVRV Z-Score를 계산합니다. 다만 SDF 보유 물량처럼 시장에서 거래되지 않은 공급이 포함될 수 있어, 비트코인의 MVRV처럼 바닥과 천장을 가리키는 지표로 단정하기는 어렵습니다. 데이터가 없을 때는 N/A로 표시됩니다."
     },
     {
      "q": "지금 스텔라루멘을 사도 되나요?",
      "a": "이 페이지는 투자 권유를 하지 않습니다. 점수가 80 이상(STRONG BUY)이면 과매도·공포·저평가 신호가 여럿 겹친 상태, 25 미만(OVERHEATED)이면 과열 신호가 겹친 상태라는 뜻일 뿐입니다. 짧은 급등이 잦았던 코인인 만큼 단기 탭과 장기 탭을 나눠 읽는 것이 좋습니다."
     },
     {
      "q": "XLM과 XRP는 같은 코인인가요?",
      "a": "아닙니다. 제드 매케일럽이 두 프로젝트에 모두 관여했고 송금이라는 목표도 비슷하지만, 스텔라는 비영리 재단이 지원하는 별도 네트워크이며 합의 방식(SCP)과 토큰 공급 구조도 다릅니다. 두 코인은 각각 별도 화면에서 볼 수 있습니다."
     },
     {
      "q": "XLM 총공급량은 앞으로 늘어나나요?",
      "a": "2019년 인플레이션이 폐지된 뒤로 프로토콜이 새 XLM을 찍어 내지 않습니다. 같은 해 11월 소각 이후 총공급은 약 500억 개입니다. 다만 SDF 보유분이 시장에 풀리면 유통량은 늘 수 있으며, 이 화면은 공급 변화를 점수에 따로 넣지 않습니다."
     },
     {
      "q": "스텔라 네트워크 활동도 점수에 반영되나요?",
      "a": "아니요. 결제 건수, 활성 계정 수, 스테이블코인 발행 규모 같은 네트워크 사용 지표는 계산에 들어가지 않습니다. 점수는 XLM 시세에서 나온 지표와 시장 심리, MVRV만으로 만들어집니다."
     }
    ]
   },
   "zh": {
    "title": "恒星币（XLM）买入时机评分指南",
    "intro": "恒星币（XLM）页面把RSI(14)、MACD(12·26·9)、恐惧与贪婪指数、Mayer Multiple、距365日高点回撤、50/200金叉·死叉和MVRV Z-Score集中在一个画面上，用0~100的评分告诉您当前行情按历史标准偏向哪一边。无需额外软件，在网页上即可免费使用，评分从STRONG BUY到OVERHEATED共五级。由于XLM是支付网络的原生资产，部分指标的解读需要格外留意。",
    "coinH": "什么是恒星币（XLM）？",
    "coinP": [
     "Stellar是面向跨境汇款和资产发行的开源支付网络，恒星币（XLM，又称流明）是其原生资产。它由Ripple联合创始人Jed McCaleb与Joyce Kim于2014年创立，开发由非营利组织恒星发展基金会（SDF）支持。银行、汇款公司和稳定币发行方在Stellar上发行并收发以美元等法币为基础的资产，XLM则用于支付交易手续费和满足账户最低余额要求。",
     "它不靠挖矿，而是采用David Mazières于2015年设计的Stellar共识协议（SCP，联邦拜占庭协议），在几秒内确认交易。最初发行1,000亿枚，每年增发1%；2019年10月网络验证者投票废除了增发，同年11月SDF销毁约550亿枚XLM，总供应量降至约500亿枚。2024年2月，智能合约平台Soroban在主网上线。"
    ],
    "applyH": "将指标用于恒星币时的注意事项",
    "apply": [
     "XLM与同属支付赛道的瑞波（XRP）在很多时期走势相似。评分剧烈变化时，除了BTC，也查看一下XRP方面的消息，更容易找到原因。",
     "恐惧与贪婪指数不是Stellar专属数值，而是Alternative.me发布的整个加密市场（以BTC为主）指数。大型汇款合作、网络升级等只与XLM有关的事件不会体现在该指数中。",
     "由于CoinMetrics有XLM的数据，所以可以计算MVRV Z-Score。但相当一部分供应由SDF持有，并逐步用于生态支持等用途，因此很难把它看作只反映市场参与者平均持仓成本的指标。",
     "XLM在2018年1月创下历史最高价后，长期处于该水平之下，并反复出现短暂暴涨后大幅回落的走势。如果直接套用比特币标准的Mayer Multiple 2.4过热线和-50%回撤买入区，可能在暴涨后立刻出现过热信号，或在下跌途中过早出现买入信号。",
     "每日成交额只有BTC的一小部分，曾多次出现一条消息就让价格单日波动两位数百分比的情况。这种时候，RSI和MACD仅凭一根K线就会触及极值，最好再观察几天后指标如何回稳。"
    ],
    "histH": "恒星币价格周期回顾",
    "hist": [
     "2014~2015年 — Jed McCaleb与Joyce Kim推出Stellar，并于2015年迁移到基于SCP的新网络。",
     "2018年 — 1月初在不到1美元的水平创下历史最高价，随后在熊市中大幅下跌。",
     "2019年 — 废除增发（10月）和SDF销毁约550亿枚XLM（11月）改变了供应结构。",
     "2021年 — 牛市中大幅上涨，但未能突破2018年高点；10月宣布与汇款公司MoneyGram开展USDC结算合作。",
     "2024年 — 2月Soroban智能合约在主网上线，11月与瑞波（XRP）一同在短时间内暴涨。"
    ],
    "faq": [
     {
      "q": "恒星币有专属的恐惧指数吗？",
      "a": "没有。本页的恐惧与贪婪指数是Alternative.me针对整个市场发布的数值，Alternative.me不单独发布XLM的数值，这也是卡片上标注为全市场指数的原因。Stellar自身的走势请通过用XLM行情计算的其他指标查看。"
     },
     {
      "q": "恒星币也能显示MVRV吗？",
      "a": "可以。CoinMetrics公开数据中有XLM，因此会计算MVRV Z-Score。不过其中可能包含SDF持有部分等从未在市场上交易的供应，很难像比特币的MVRV那样把它当作指示底部和顶部的指标。没有数据时显示N/A。"
     },
     {
      "q": "现在可以买恒星币吗？",
      "a": "本页面不提供投资建议。评分在80以上（STRONG BUY）只表示超卖、恐慌、低估等多个信号叠加，低于25（OVERHEATED）只表示过热信号叠加。这枚币短期暴涨较为频繁，建议把短期标签和长期标签分开解读。"
     },
     {
      "q": "XLM和XRP是同一种币吗？",
      "a": "不是。Jed McCaleb参与过这两个项目，目标也都是支付，但Stellar是由非营利基金会支持的独立网络，共识机制（SCP）和代币供应结构都不同。两种币分别有各自的页面。"
     },
     {
      "q": "XLM的总供应量今后会增加吗？",
      "a": "2019年废除增发后，协议不再铸造新的XLM。同年11月销毁之后，总供应量约为500亿枚。不过SDF持有的部分进入市场时，流通量可能增加，本页面也没有把供应变化单独计入评分。"
     },
     {
      "q": "Stellar网络活动会计入评分吗？",
      "a": "不会。支付笔数、活跃账户数、稳定币发行规模等网络使用指标都不参与计算。评分只由XLM行情得出的指标、市场情绪和MVRV构成。"
     }
    ]
   },
   "zh-Hant": {
    "title": "恆星幣（XLM）買入時機評分指南",
    "intro": "恆星幣（XLM）頁面把RSI(14)、MACD(12·26·9)、恐懼與貪婪指數、Mayer Multiple、距365日高點回檔幅度、50/200黃金交叉·死亡交叉與MVRV Z-Score集中在一個畫面上，以0~100的評分告訴您目前行情按歷史標準偏向哪一邊。不需額外軟體，在網頁上即可免費使用，評分從STRONG BUY到OVERHEATED共五級。由於XLM是支付網路的原生資產，部分指標的解讀需要格外留意。",
    "coinH": "什麼是恆星幣（XLM）？",
    "coinP": [
     "Stellar是針對跨境匯款與資產發行的開源支付網路，恆星幣（XLM，又稱流明）是其原生資產。它由Ripple共同創辦人Jed McCaleb與Joyce Kim於2014年創立，開發由非營利組織恆星發展基金會（SDF）支持。銀行、匯款業者與穩定幣發行商在Stellar上發行並收付以美元等法幣為基礎的資產，XLM則用於支付交易手續費與滿足帳戶最低餘額要求。",
     "它不靠挖礦，而是採用David Mazières於2015年設計的Stellar共識協定（SCP，聯邦拜占庭協議），在幾秒內確認交易。最初發行1,000億枚，每年增發1%；2019年10月網路驗證者投票廢除了增發，同年11月SDF銷毀約550億枚XLM，總供給量降至約500億枚。2024年2月，智慧合約平台Soroban在主網上線。"
    ],
    "applyH": "將指標用於恆星幣時的注意事項",
    "apply": [
     "XLM與同屬支付賽道的瑞波（XRP）在許多時期走勢相似。評分劇烈變化時，除了BTC，也查看一下XRP方面的消息，更容易找到原因。",
     "恐懼與貪婪指數不是Stellar專屬數值，而是Alternative.me發布的整個加密市場（以BTC為主）指數。大型匯款合作、網路升級等只與XLM有關的事件不會反映在該指數中。",
     "由於CoinMetrics有XLM的資料，所以可以計算MVRV Z-Score。但相當一部分供給由SDF持有，並逐步用於生態支持等用途，因此很難把它看作只反映市場參與者平均持有成本的指標。",
     "XLM在2018年1月創下歷史最高價後，長期處於該水準之下，並反覆出現短暫暴漲後大幅回落的走勢。如果直接套用比特幣標準的Mayer Multiple 2.4過熱線與-50%回檔買入區，可能在暴漲後立刻出現過熱訊號，或在下跌途中過早出現買入訊號。",
     "每日成交額只有BTC的一小部分，曾多次出現一則消息就讓價格單日波動兩位數百分比的情況。這種時候，RSI與MACD僅憑一根K線就會觸及極值，最好再觀察幾天後指標如何回穩。"
    ],
    "histH": "恆星幣價格週期回顧",
    "hist": [
     "2014~2015年 — Jed McCaleb與Joyce Kim推出Stellar，並於2015年遷移到以SCP為基礎的新網路。",
     "2018年 — 1月初在不到1美元的水準創下歷史最高價，隨後在熊市中大幅下跌。",
     "2019年 — 廢除增發（10月）與SDF銷毀約550億枚XLM（11月）改變了供給結構。",
     "2021年 — 牛市中大幅上漲，但未能突破2018年高點；10月宣布與匯款業者MoneyGram展開USDC結算合作。",
     "2024年 — 2月Soroban智慧合約在主網上線，11月與瑞波（XRP）一同在短時間內暴漲。"
    ],
    "faq": [
     {
      "q": "恆星幣有專屬的恐懼指數嗎？",
      "a": "沒有。本頁的恐懼與貪婪指數是Alternative.me針對整個市場發布的數值，Alternative.me不另外發布XLM的數值，這也是卡片上標示為全市場指數的原因。Stellar本身的走勢請透過以XLM行情計算的其他指標查看。"
     },
     {
      "q": "恆星幣也能顯示MVRV嗎？",
      "a": "可以。CoinMetrics公開資料中有XLM，因此會計算MVRV Z-Score。不過其中可能包含SDF持有部分等從未在市場上交易的供給，很難像比特幣的MVRV那樣把它當作指示底部與頂部的指標。沒有資料時顯示N/A。"
     },
     {
      "q": "現在可以買恆星幣嗎？",
      "a": "本頁面不提供投資建議。評分在80以上（STRONG BUY）只表示超賣、恐慌、低估等多個訊號疊加，低於25（OVERHEATED）只表示過熱訊號疊加。這枚幣短期暴漲較為頻繁，建議把短期分頁與長期分頁分開解讀。"
     },
     {
      "q": "XLM和XRP是同一種幣嗎？",
      "a": "不是。Jed McCaleb參與過這兩個專案，目標也都是支付，但Stellar是由非營利基金會支持的獨立網路，共識機制（SCP）與代幣供給結構都不同。兩種幣分別有各自的頁面。"
     },
     {
      "q": "XLM的總供給量今後會增加嗎？",
      "a": "2019年廢除增發後，協定不再鑄造新的XLM。同年11月銷毀之後，總供給量約為500億枚。不過SDF持有的部分進入市場時，流通量可能增加，本頁面也沒有把供給變化單獨計入評分。"
     },
     {
      "q": "Stellar網路活動會計入評分嗎？",
      "a": "不會。支付筆數、活躍帳戶數、穩定幣發行規模等網路使用指標都不參與計算。評分只由XLM行情得出的指標、市場情緒與MVRV構成。"
     }
    ]
   },
   "th": {
    "title": "คู่มือคะแนนจังหวะซื้อสเตลลาร์ (XLM)",
    "intro": "หน้าสเตลลาร์ (XLM) รวม RSI(14), MACD(12·26·9), ดัชนีความกลัวและความโลภ, Mayer Multiple, การย่อตัวจากจุดสูงสุด 365 วัน, โกลเดนครอส/เดธครอส 50/200 และ MVRV Z-Score ไว้ในหน้าจอเดียว แล้วบอกเป็นคะแนน 0–100 ว่าราคาตอนนี้เอียงไปทางไหนเมื่อเทียบกับเกณฑ์ในอดีต ใช้ได้ฟรีบนเว็บโดยไม่ต้องลงโปรแกรม และคะแนนมี 5 ระดับตั้งแต่ STRONG BUY ถึง OVERHEATED เนื่องจาก XLM เป็นสินทรัพย์หลักของเครือข่ายโอนเงิน ตัวชี้วัดบางตัวจึงต้องตีความอย่างระมัดระวัง",
    "coinH": "สเตลลาร์ (XLM) คืออะไร?",
    "coinP": [
     "สเตลลาร์คือเครือข่ายชำระเงินแบบโอเพนซอร์สสำหรับการโอนเงินข้ามประเทศและการออกสินทรัพย์ โดยลูเมน (XLM) เป็นสินทรัพย์หลักของเครือข่าย ก่อตั้งในปี 2014 โดยเจด แม็กคาเลบ ผู้ร่วมก่อตั้งริปเปิล ร่วมกับจอยซ์ คิม และมีมูลนิธิพัฒนาสเตลลาร์ (SDF) ซึ่งเป็นองค์กรไม่แสวงกำไรสนับสนุนการพัฒนา ธนาคาร บริษัทโอนเงิน และผู้ออกสเตเบิลคอยน์ใช้สเตลลาร์ออกและรับส่งสินทรัพย์ที่อิงเงินตราอย่างดอลลาร์ ส่วน XLM ใช้จ่ายค่าธรรมเนียมธุรกรรมและเป็นยอดคงเหลือขั้นต่ำของบัญชี",
     "แทนการขุด สเตลลาร์ยืนยันธุรกรรมภายในไม่กี่วินาทีด้วย Stellar Consensus Protocol (SCP, ฉันทามติไบแซนไทน์แบบสหพันธ์) ที่เดวิด มาซิแยร์ ออกแบบในปี 2015 เริ่มแรกมีการสร้าง 100,000 ล้านเหรียญและเพิ่มขึ้นปีละ 1% แต่ในเดือนตุลาคม 2019 ผู้ตรวจสอบเครือข่ายลงมติยกเลิกเงินเฟ้อ และในเดือนพฤศจิกายนปีเดียวกัน SDF เผาราว 55,000 ล้าน XLM ทำให้อุปทานรวมลดเหลือราว 50,000 ล้านเหรียญ ในเดือนกุมภาพันธ์ 2024 แพลตฟอร์มสมาร์ตคอนแทรกต์ Soroban ได้เปิดใช้บนเมนเน็ต"
    ],
    "applyH": "ข้อควรรู้เมื่อใช้ตัวชี้วัดกับสเตลลาร์",
    "apply": [
     "XLM มีหลายช่วงที่ราคาเคลื่อนไหวคล้ายริปเปิล (XRP) ซึ่งอยู่ในธีมการโอนเงินเหมือนกัน เมื่อคะแนนเปลี่ยนแรง ลองดูข่าวฝั่ง XRP ควบคู่กับ BTC จะช่วยหาสาเหตุได้ง่ายขึ้น",
     "ดัชนีความกลัวและความโลภไม่ใช่ค่าเฉพาะของสเตลลาร์ แต่เป็นดัชนีทั้งตลาดคริปโท (เน้น BTC) ของ Alternative.me เหตุการณ์ที่เกี่ยวกับ XLM เท่านั้น เช่น ความร่วมมือด้านการโอนเงินรายใหญ่หรือการอัปเกรดเครือข่าย จะไม่สะท้อนในดัชนีนี้",
     "MVRV Z-Score คำนวณได้เพราะ CoinMetrics มีข้อมูลของ XLM แต่ SDF ถืออุปทานส่วนสำคัญไว้และทยอยใช้เพื่อสนับสนุนระบบนิเวศ จึงยากจะมองว่าตัวชี้วัดนี้สะท้อนเฉพาะต้นทุนเฉลี่ยของผู้เล่นในตลาด",
     "หลังทำจุดสูงสุดตลอดกาลในเดือนมกราคม 2018 XLM อยู่ต่ำกว่าระดับนั้นมาเป็นเวลานาน และมีรูปแบบพุ่งขึ้นสั้น ๆ แล้วย่อกลับลึกซ้ำหลายครั้ง หากใช้เส้นร้อนแรงเกินไปที่ Mayer Multiple 2.4 และโซนซื้อที่การย่อตัว -50% ตามเกณฑ์บิตคอยน์ตรง ๆ อาจเกิดสัญญาณร้อนแรงเกินไปทันทีหลังราคาพุ่ง หรือสัญญาณซื้อเร็วเกินไประหว่างขาลง",
     "มูลค่าการซื้อขายต่อวันเป็นเพียงส่วนเล็ก ๆ ของ BTC และเคยมีหลายวันที่ข่าวเดียวทำให้ราคาขยับเป็นตัวเลขสองหลักในวันเดียว ในวันแบบนั้น RSI และ MACD แตะค่าสุดขั้วได้จากแท่งเทียนเพียงแท่งเดียว จึงควรดูว่าตัวชี้วัดกลับมาสงบอย่างไรในอีกไม่กี่วันถัดไป"
    ],
    "histH": "สรุปวัฏจักรราคาสเตลลาร์",
    "hist": [
     "2014–2015 — เจด แม็กคาเลบ และจอยซ์ คิม เปิดตัวสเตลลาร์ และย้ายไปใช้เครือข่ายใหม่ที่อิง SCP ในปี 2015",
     "2018 — ทำจุดสูงสุดตลอดกาลที่ระดับต่ำกว่า 1 ดอลลาร์ในต้นเดือนมกราคม แล้วร่วงหนักในตลาดหมี",
     "2019 — การยกเลิกเงินเฟ้อ (ตุลาคม) และการเผาราว 55,000 ล้าน XLM โดย SDF (พฤศจิกายน) เปลี่ยนโครงสร้างอุปทาน",
     "2021 — ราคาขึ้นแรงในตลาดกระทิงแต่ไม่ผ่านจุดสูงสุดปี 2018 และในเดือนตุลาคมมีการประกาศความร่วมมือด้านการชำระด้วย USDC กับบริษัทโอนเงิน MoneyGram",
     "2024 — สมาร์ตคอนแทรกต์ Soroban เปิดใช้บนเมนเน็ตในเดือนกุมภาพันธ์ และในเดือนพฤศจิกายน XLM พุ่งแรงในเวลาสั้น ๆ พร้อมกับริปเปิล (XRP)"
    ],
    "faq": [
     {
      "q": "สเตลลาร์มีดัชนีความกลัวของตัวเองไหม?",
      "a": "ไม่มี ดัชนีความกลัวและความโลภในหน้านี้เป็นค่าทั้งตลาดของ Alternative.me และ Alternative.me ไม่ได้เผยแพร่ค่าสำหรับ XLM แยกต่างหาก การ์ดจึงระบุว่าเป็นดัชนีทั้งตลาด ความเคลื่อนไหวเฉพาะของสเตลลาร์ให้ดูจากตัวชี้วัดอื่นที่คำนวณจากราคา XLM"
     },
     {
      "q": "สเตลลาร์มี MVRV ด้วยไหม?",
      "a": "มี ข้อมูลสาธารณะของ CoinMetrics มี XLM จึงคำนวณ MVRV Z-Score ได้ แต่อาจรวมอุปทานที่ไม่เคยซื้อขายในตลาด เช่น ส่วนที่ SDF ถือ จึงยากจะใช้เป็นตัวชี้จุดต่ำสุดและจุดสูงสุดแบบเดียวกับ MVRV ของบิตคอยน์ เมื่อไม่มีข้อมูลจะแสดงเป็น N/A"
     },
     {
      "q": "ตอนนี้ควรซื้อสเตลลาร์ไหม?",
      "a": "หน้านี้ไม่ได้แนะนำการลงทุน คะแนน 80 ขึ้นไป (STRONG BUY) หมายความเพียงว่าสัญญาณขายมากเกิน ความกลัว และราคาต่ำกว่ามูลค่าเกิดซ้อนกันหลายตัว ส่วนต่ำกว่า 25 (OVERHEATED) หมายความว่าสัญญาณร้อนแรงเกินไปซ้อนกัน เหรียญนี้พุ่งขึ้นช่วงสั้น ๆ บ่อย จึงควรอ่านแท็บระยะสั้นและระยะยาวแยกกัน"
     },
     {
      "q": "XLM กับ XRP เป็นเหรียญเดียวกันไหม?",
      "a": "ไม่ใช่ เจด แม็กคาเลบ เคยเกี่ยวข้องกับทั้งสองโครงการและทั้งคู่มุ่งเรื่องการโอนเงินเหมือนกัน แต่สเตลลาร์เป็นเครือข่ายแยกที่มูลนิธิไม่แสวงกำไรสนับสนุน และมีกลไกฉันทามติ (SCP) กับโครงสร้างอุปทานโทเคนที่ต่างกัน แต่ละเหรียญมีหน้าของตัวเอง"
     },
     {
      "q": "อุปทานรวมของ XLM จะเพิ่มขึ้นอีกไหม?",
      "a": "ตั้งแต่ยกเลิกเงินเฟ้อในปี 2019 โปรโตคอลไม่ได้สร้าง XLM ใหม่อีก และหลังการเผาในเดือนพฤศจิกายนปีนั้น อุปทานรวมอยู่ที่ราว 50,000 ล้านเหรียญ อย่างไรก็ตาม อุปทานหมุนเวียนอาจเพิ่มขึ้นเมื่อส่วนที่ SDF ถือเข้าสู่ตลาด และหน้านี้ไม่ได้นำการเปลี่ยนแปลงของอุปทานมาคิดในคะแนนแยกต่างหาก"
     },
     {
      "q": "กิจกรรมบนเครือข่ายสเตลลาร์ถูกนำมาคิดในคะแนนด้วยไหม?",
      "a": "ไม่ ตัวชี้วัดการใช้งานเครือข่าย เช่น จำนวนการชำระเงิน จำนวนบัญชีที่ใช้งาน หรือขนาดการออกสเตเบิลคอยน์ ไม่ได้อยู่ในการคำนวณ คะแนนสร้างจากตัวชี้วัดที่ได้จากราคา XLM อารมณ์ตลาด และ MVRV เท่านั้น"
     }
    ]
   },
   "es": {
    "title": "Guía de la puntuación de momento de compra de Stellar (XLM)",
    "intro": "La página de Stellar (XLM) reúne en una sola pantalla el RSI(14), el MACD(12·26·9), el Índice de Miedo y Codicia, el Mayer Multiple, la caída desde el máximo de 365 días, el cruce dorado/de la muerte 50/200 y el MVRV Z-Score, y te dice con una puntuación de 0 a 100 hacia dónde se inclina el precio actual según los estándares históricos. Funciona gratis en la web, sin programas adicionales, y la puntuación tiene cinco niveles, de STRONG BUY a OVERHEATED. Como XLM es el activo nativo de una red de pagos, algunos indicadores requieren una lectura cuidadosa.",
    "coinH": "¿Qué es Stellar (XLM)?",
    "coinP": [
     "Stellar es una red de pagos de código abierto para transferencias internacionales y emisión de activos, y los lúmenes (XLM) son su activo nativo. La crearon en 2014 Jed McCaleb, cofundador de Ripple, y Joyce Kim, y su desarrollo lo respalda la fundación sin ánimo de lucro Stellar Development Foundation (SDF). Bancos, empresas de remesas y emisores de stablecoins la usan para emitir e intercambiar activos respaldados por monedas fiduciarias como el dólar, mientras que XLM paga las comisiones y cubre el saldo mínimo de las cuentas.",
     "En lugar de minería, confirma las transacciones en pocos segundos con el Stellar Consensus Protocol (SCP, acuerdo bizantino federado), diseñado por David Mazières en 2015. Empezó con 100.000 millones de lúmenes y una inflación anual del 1 %, pero en octubre de 2019 los validadores de la red votaron eliminar la inflación, y en noviembre de ese año la SDF quemó unos 55.000 millones de XLM, con lo que el suministro total bajó a unos 50.000 millones. En febrero de 2024 llegó a la mainnet Soroban, la plataforma de contratos inteligentes."
    ],
    "applyH": "Cómo aplicar los indicadores a Stellar",
    "apply": [
     "XLM ha cotizado muchas veces de forma parecida a XRP, que comparte la temática de pagos. Cuando la puntuación cambia bruscamente, revisar las noticias de XRP además de las de BTC ayuda a encontrar la causa.",
     "El Índice de Miedo y Codicia no es un valor de Stellar, sino el índice de Alternative.me para todo el mercado cripto, ponderado hacia BTC. Los acontecimientos que solo afectan a XLM, como una gran alianza de remesas o una actualización de red, no se reflejan en él.",
     "El MVRV Z-Score se calcula porque CoinMetrics tiene datos de XLM. Sin embargo, la SDF posee una parte importante de la oferta y la va usando poco a poco para apoyar el ecosistema, entre otros fines, así que no puede leerse únicamente como el coste medio de compra del mercado.",
     "Tras marcar su máximo histórico en enero de 2018, XLM pasó mucho tiempo por debajo de él, y se ha repetido un patrón de subidas fugaces seguidas de fuertes retrocesos. Aplicar tal cual la línea de sobrecalentamiento de 2,4 del Mayer Multiple y la zona de compra de -50 % de Bitcoin puede generar señales de sobrecalentamiento justo después de un repunte o señales de compra prematuras en plena tendencia bajista.",
     "El volumen diario negociado es solo una fracción del de BTC, y ha habido varios días en que una sola noticia movió el precio en porcentajes de dos dígitos. En días así, el RSI y el MACD llegan a valores extremos con una sola vela, por lo que conviene observar cómo se asientan los indicadores en los días siguientes."
    ],
    "histH": "Resumen de los ciclos de precio de Stellar",
    "hist": [
     "2014–2015 — Jed McCaleb y Joyce Kim lanzaron Stellar, que en 2015 pasó a una nueva red basada en SCP.",
     "2018 — Marcó su máximo histórico, todavía por debajo de 1 dólar, a principios de enero y después cayó con fuerza en el mercado bajista.",
     "2019 — El fin de la inflación (octubre) y la quema de unos 55.000 millones de XLM por parte de la SDF (noviembre) cambiaron la estructura de la oferta.",
     "2021 — Subió con fuerza en el mercado alcista sin superar el máximo de 2018; en octubre se anunció una alianza de liquidación en USDC con la empresa de remesas MoneyGram.",
     "2024 — Los contratos inteligentes de Soroban llegaron a la mainnet en febrero y en noviembre XLM se disparó en poco tiempo junto a XRP."
    ],
    "faq": [
     {
      "q": "¿Hay un Índice de Miedo y Codicia solo para Stellar?",
      "a": "No. El índice que aparece aquí es el valor de todo el mercado de Alternative.me, y Alternative.me no publica una cifra aparte para XLM; por eso la tarjeta lo identifica como índice de todo el mercado. La tendencia propia de Stellar se ve en los demás indicadores, calculados con el precio de XLM."
     },
     {
      "q": "¿Stellar también tiene lectura de MVRV?",
      "a": "Sí. Los datos públicos de CoinMetrics incluyen XLM, así que se calcula el MVRV Z-Score. Como puede incluir oferta que nunca se ha negociado en el mercado, por ejemplo la que posee la SDF, es difícil tratarlo como indicador de suelos y techos al estilo del MVRV de Bitcoin. Si no hay datos, aparece N/A."
     },
     {
      "q": "¿Debería comprar Stellar ahora?",
      "a": "Esta página no ofrece asesoramiento de inversión. Una puntuación de 80 o más (STRONG BUY) solo significa que coinciden varias señales de sobreventa, miedo e infravaloración; por debajo de 25 (OVERHEATED), que coinciden señales de sobrecalentamiento. Como XLM ha tenido subidas fugaces con frecuencia, conviene leer por separado las pestañas de corto y largo plazo."
     },
     {
      "q": "¿XLM y XRP son la misma moneda?",
      "a": "No. Jed McCaleb participó en ambos proyectos y los dos se centran en los pagos, pero Stellar es una red independiente respaldada por una fundación sin ánimo de lucro, con otro protocolo de consenso (SCP) y otra estructura de oferta. Cada moneda tiene su propia página."
     },
     {
      "q": "¿Aumentará el suministro total de XLM?",
      "a": "Desde que se eliminó la inflación en 2019, el protocolo no crea XLM nuevos, y tras la quema de noviembre de ese año el suministro total ronda los 50.000 millones. La oferta circulante sí puede crecer a medida que los fondos de la SDF llegan al mercado, y esta página no incorpora los cambios de oferta a la puntuación."
     },
     {
      "q": "¿La actividad de la red Stellar influye en la puntuación?",
      "a": "No. Las métricas de uso de la red, como el número de pagos, las cuentas activas o el volumen de stablecoins emitidas, no forman parte del cálculo. La puntuación se construye solo con indicadores derivados del precio de XLM, el sentimiento del mercado y el MVRV."
     }
    ]
   },
   "fr": {
    "title": "Guide du score de timing d’achat de Stellar (XLM)",
    "intro": "La page Stellar (XLM) réunit sur un seul écran le RSI(14), le MACD(12·26·9), l’indice Peur et Avidité, le Mayer Multiple, la baisse depuis le plus haut sur 365 jours, le golden cross / death cross 50/200 et le MVRV Z-Score, et indique par un score de 0 à 100 de quel côté penche le cours actuel au regard de l’historique. Elle fonctionne gratuitement sur le web, sans logiciel supplémentaire, et le score compte cinq niveaux, de STRONG BUY à OVERHEATED. XLM étant l’actif natif d’un réseau de paiement, certains indicateurs demandent une lecture prudente.",
    "coinH": "Qu’est-ce que Stellar (XLM) ?",
    "coinP": [
     "Stellar est un réseau de paiement open source destiné aux transferts internationaux et à l’émission d’actifs ; les lumens (XLM) en sont l’actif natif. Il a été créé en 2014 par Jed McCaleb, cofondateur de Ripple, avec Joyce Kim, et son développement est soutenu par la fondation à but non lucratif Stellar Development Foundation (SDF). Banques, sociétés de transfert d’argent et émetteurs de stablecoins l’utilisent pour émettre et échanger des actifs adossés à des monnaies comme le dollar, tandis que XLM sert à payer les frais et à couvrir le solde minimal des comptes.",
     "Plutôt que le minage, il utilise le Stellar Consensus Protocol (SCP, accord byzantin fédéré), conçu par David Mazières en 2015, pour finaliser les transactions en quelques secondes. Il a démarré avec 100 milliards de lumens et une inflation annuelle de 1 %, mais les validateurs du réseau ont voté la fin de l’inflation en octobre 2019 et, en novembre de la même année, la SDF a brûlé environ 55 milliards de XLM, ramenant l’offre totale à environ 50 milliards. En février 2024, la plateforme de smart contracts Soroban est arrivée sur le mainnet."
    ],
    "applyH": "Appliquer les indicateurs à Stellar",
    "apply": [
     "XLM a souvent évolué comme XRP, qui partage le même thème des paiements. Quand le score varie brutalement, consulter l’actualité de XRP en plus de celle de BTC aide à en trouver la cause.",
     "L’indice Peur et Avidité n’est pas une valeur propre à Stellar, mais l’indice d’Alternative.me pour l’ensemble du marché crypto, pondéré vers BTC. Les événements qui ne concernent que XLM, comme un grand partenariat de transfert d’argent ou une mise à jour du réseau, n’y apparaissent pas.",
     "Le MVRV Z-Score est calculé car CoinMetrics dispose de données sur XLM. Mais la SDF détient une part importante de l’offre et l’utilise progressivement, notamment pour soutenir l’écosystème : on ne peut donc pas le lire uniquement comme le prix de revient moyen du marché.",
     "Après son record de janvier 2018, XLM est resté longtemps en dessous, et un schéma de flambées brèves suivies de forts replis s’est répété. Appliquer tels quels la ligne de surchauffe à 2,4 du Mayer Multiple et la zone d’achat à -50 % de Bitcoin peut produire des signaux de surchauffe juste après une flambée ou des signaux d’achat prématurés en pleine tendance baissière.",
     "Les montants échangés chaque jour ne représentent qu’une fraction de ceux de BTC, et plusieurs fois une seule nouvelle a fait varier le cours de plus de 10 % dans la journée. Ces jours-là, le RSI et le MACD atteignent des extrêmes sur une seule bougie ; mieux vaut observer comment les indicateurs se stabilisent les jours suivants."
    ],
    "histH": "Les cycles de prix de Stellar en bref",
    "hist": [
     "2014–2015 — Jed McCaleb et Joyce Kim lancent Stellar, qui passe en 2015 à un nouveau réseau fondé sur le SCP.",
     "2018 — Record historique, encore sous 1 dollar, début janvier, puis forte chute pendant le marché baissier.",
     "2019 — La fin de l’inflation (octobre) et la destruction d’environ 55 milliards de XLM par la SDF (novembre) modifient la structure de l’offre.",
     "2021 — Forte hausse pendant le marché haussier sans dépasser le sommet de 2018 ; en octobre, annonce d’un partenariat de règlement en USDC avec MoneyGram, société de transfert d’argent.",
     "2024 — Les smart contracts Soroban arrivent sur le mainnet en février et, en novembre, XLM s’envole en peu de temps aux côtés de XRP."
    ],
    "faq": [
     {
      "q": "Existe-t-il un indice Peur et Avidité propre à Stellar ?",
      "a": "Non. L’indice affiché ici est la valeur de marché global d’Alternative.me, qui ne publie pas de chiffre distinct pour XLM ; c’est pour cela que la carte le présente comme un indice de l’ensemble du marché. La tendance propre de Stellar se lit dans les autres indicateurs, calculés à partir du cours de XLM."
     },
     {
      "q": "Stellar a-t-il aussi une mesure MVRV ?",
      "a": "Oui. Les données publiques de CoinMetrics incluent XLM, donc le MVRV Z-Score est calculé. Comme il peut intégrer une offre jamais échangée sur le marché, par exemple celle détenue par la SDF, il est difficile de l’utiliser comme indicateur de plancher et de sommet à la manière du MVRV de Bitcoin. En l’absence de données, il affiche N/A."
     },
     {
      "q": "Faut-il acheter du Stellar maintenant ?",
      "a": "Cette page ne donne pas de conseil en investissement. Un score de 80 ou plus (STRONG BUY) signifie seulement que plusieurs signaux de survente, de peur et de sous-évaluation se superposent ; sous 25 (OVERHEATED), que des signaux de surchauffe se superposent. XLM ayant souvent connu des flambées éphémères, mieux vaut lire séparément les onglets court terme et long terme."
     },
     {
      "q": "XLM et XRP sont-ils la même crypto ?",
      "a": "Non. Jed McCaleb a participé aux deux projets et tous deux visent les paiements, mais Stellar est un réseau distinct soutenu par une fondation à but non lucratif, avec un autre protocole de consensus (SCP) et une autre structure d’offre. Chaque crypto a sa propre page."
     },
     {
      "q": "L’offre totale de XLM va-t-elle augmenter ?",
      "a": "Depuis la fin de l’inflation en 2019, le protocole ne crée plus de nouveaux XLM, et depuis la destruction de novembre de cette année-là l’offre totale avoisine 50 milliards. L’offre en circulation peut toutefois augmenter quand des avoirs de la SDF arrivent sur le marché, et cette page n’intègre pas les variations d’offre au score."
     },
     {
      "q": "L’activité du réseau Stellar entre-t-elle dans le score ?",
      "a": "Non. Les indicateurs d’utilisation du réseau, comme le nombre de paiements, les comptes actifs ou le volume de stablecoins émis, ne font pas partie du calcul. Le score repose uniquement sur des indicateurs tirés du cours de XLM, le sentiment du marché et le MVRV."
     }
    ]
   },
   "de": {
    "title": "Leitfaden zum Kauf-Timing-Score von Stellar (XLM)",
    "intro": "Die Stellar-Seite (XLM) bündelt RSI(14), MACD(12·26·9), den Angst-und-Gier-Index, das Mayer Multiple, den Rückgang vom 365-Tage-Hoch, das Golden/Death Cross 50/200 und den MVRV Z-Score auf einem Bildschirm und zeigt mit einem Score von 0 bis 100, wohin der aktuelle Kurs gemessen an der Historie tendiert. Sie läuft kostenlos im Web ohne zusätzliche Software, und der Score hat fünf Stufen von STRONG BUY bis OVERHEATED. Da XLM das native Asset eines Zahlungsnetzwerks ist, verlangen einige Indikatoren eine vorsichtige Deutung.",
    "coinH": "Was ist Stellar (XLM)?",
    "coinP": [
     "Stellar ist ein quelloffenes Zahlungsnetzwerk für grenzüberschreitende Überweisungen und die Ausgabe von Vermögenswerten; Lumens (XLM) sind sein natives Asset. Gegründet wurde es 2014 von Ripple-Mitgründer Jed McCaleb gemeinsam mit Joyce Kim, die Entwicklung unterstützt die gemeinnützige Stellar Development Foundation (SDF). Banken, Überweisungsdienste und Stablecoin-Emittenten geben darauf durch Fiatwährungen wie den Dollar gedeckte Assets aus und tauschen sie, während XLM Transaktionsgebühren bezahlt und das Mindestguthaben von Konten abdeckt.",
     "Statt Mining nutzt es das 2015 von David Mazières entworfene Stellar Consensus Protocol (SCP, föderierte byzantinische Einigung) und bestätigt Transaktionen innerhalb weniger Sekunden. Zu Beginn gab es 100 Milliarden Lumens und eine jährliche Inflation von 1 %, doch im Oktober 2019 stimmten die Validatoren des Netzwerks für das Ende der Inflation, und im November desselben Jahres verbrannte die SDF rund 55 Milliarden XLM, wodurch das Gesamtangebot auf etwa 50 Milliarden sank. Im Februar 2024 kam die Smart-Contract-Plattform Soroban ins Mainnet."
    ],
    "applyH": "Indikatoren auf Stellar anwenden",
    "apply": [
     "XLM verlief oft ähnlich wie XRP, das dasselbe Thema Zahlungen bedient. Schwankt der Score abrupt, hilft es, neben BTC auch die Nachrichten zu XRP zu prüfen, um die Ursache zu finden.",
     "Der Angst-und-Gier-Index ist kein Stellar-Wert, sondern der Index von Alternative.me für den gesamten Kryptomarkt mit Schwerpunkt BTC. Ereignisse, die nur XLM betreffen, etwa eine große Überweisungspartnerschaft oder ein Netzwerk-Upgrade, spiegeln sich darin nicht wider.",
     "Der MVRV Z-Score wird berechnet, weil CoinMetrics Daten zu XLM hat. Allerdings hält die SDF einen erheblichen Teil des Angebots und setzt ihn schrittweise unter anderem zur Förderung des Ökosystems ein, sodass er sich nicht allein als durchschnittlicher Einstandspreis des Marktes lesen lässt.",
     "Nach dem Allzeithoch im Januar 2018 lag XLM lange darunter, und ein Muster aus kurzen Kurssprüngen mit anschließend tiefen Rücksetzern wiederholte sich. Übernimmt man die Überhitzungslinie des Mayer Multiple bei 2,4 und die Kaufzone bei -50 % Rückgang unverändert von Bitcoin, können direkt nach einem Sprung Überhitzungssignale oder mitten im Abwärtstrend verfrühte Kaufsignale entstehen.",
     "Der tägliche Handelsumsatz beträgt nur einen Bruchteil von BTC, und an mehreren Tagen bewegte eine einzige Nachricht den Kurs um zweistellige Prozentsätze. An solchen Tagen erreichen RSI und MACD schon mit einer einzigen Kerze Extremwerte; es lohnt sich zu beobachten, wie sich die Indikatoren in den folgenden Tagen einpendeln."
    ],
    "histH": "Die Preiszyklen von Stellar im Überblick",
    "hist": [
     "2014–2015 – Jed McCaleb und Joyce Kim starteten Stellar, das 2015 auf ein neues SCP-basiertes Netzwerk umzog.",
     "2018 – Allzeithoch Anfang Januar, noch unter 1 US-Dollar, danach starker Absturz im Bärenmarkt.",
     "2019 – Das Ende der Inflation (Oktober) und die Verbrennung von rund 55 Milliarden XLM durch die SDF (November) veränderten die Angebotsstruktur.",
     "2021 – Kräftiger Anstieg im Bullenmarkt, ohne das Hoch von 2018 zu übertreffen; im Oktober wurde eine USDC-Abwicklungspartnerschaft mit dem Überweisungsdienst MoneyGram angekündigt.",
     "2024 – Soroban-Smart-Contracts kamen im Februar ins Mainnet, und im November schoss XLM zusammen mit XRP binnen kurzer Zeit nach oben."
    ],
    "faq": [
     {
      "q": "Gibt es einen Angst-und-Gier-Index nur für Stellar?",
      "a": "Nein. Der hier angezeigte Index ist der marktweite Wert von Alternative.me, und Alternative.me veröffentlicht keine eigene Zahl für XLM; deshalb ist die Karte als marktweiter Index gekennzeichnet. Den eigenen Trend von Stellar zeigen die übrigen Indikatoren, die aus dem XLM-Kurs berechnet werden."
     },
     {
      "q": "Gibt es für Stellar auch einen MVRV-Wert?",
      "a": "Ja. Die öffentlichen Daten von CoinMetrics enthalten XLM, daher wird der MVRV Z-Score berechnet. Da er Angebot enthalten kann, das nie am Markt gehandelt wurde, etwa die Bestände der SDF, lässt er sich kaum wie der MVRV von Bitcoin als Boden- und Hochpunktindikator nutzen. Ohne Daten wird N/A angezeigt."
     },
     {
      "q": "Sollte ich jetzt Stellar kaufen?",
      "a": "Diese Seite gibt keine Anlageberatung. Ein Score von 80 oder mehr (STRONG BUY) bedeutet nur, dass sich mehrere Signale für Überverkauft, Angst und Unterbewertung überlagern; unter 25 (OVERHEATED), dass sich Überhitzungssignale überlagern. Da XLM häufig kurzlebige Kurssprünge hatte, empfiehlt es sich, den Kurzfrist- und den Langfrist-Tab getrennt zu lesen."
     },
     {
      "q": "Sind XLM und XRP dieselbe Kryptowährung?",
      "a": "Nein. Jed McCaleb war an beiden Projekten beteiligt, und beide zielen auf Zahlungen, doch Stellar ist ein eigenständiges Netzwerk, das von einer gemeinnützigen Stiftung getragen wird, mit eigenem Konsensprotokoll (SCP) und anderer Angebotsstruktur. Jede der beiden hat eine eigene Seite."
     },
     {
      "q": "Wird das Gesamtangebot von XLM noch wachsen?",
      "a": "Seit dem Ende der Inflation 2019 erzeugt das Protokoll keine neuen XLM mehr, und seit der Verbrennung im November jenes Jahres liegt das Gesamtangebot bei rund 50 Milliarden. Das umlaufende Angebot kann aber steigen, wenn Bestände der SDF an den Markt gelangen, und diese Seite rechnet Angebotsveränderungen nicht gesondert in den Score ein."
     },
     {
      "q": "Fließt die Aktivität im Stellar-Netzwerk in den Score ein?",
      "a": "Nein. Nutzungskennzahlen des Netzwerks wie die Zahl der Zahlungen, aktive Konten oder das Volumen ausgegebener Stablecoins sind nicht Teil der Berechnung. Der Score beruht ausschließlich auf Indikatoren aus dem XLM-Kurs, der Marktstimmung und dem MVRV."
     }
    ]
   },
   "it": {
    "title": "Guida al punteggio di timing d’acquisto di Stellar (XLM)",
    "intro": "La pagina di Stellar (XLM) riunisce in un’unica schermata RSI(14), MACD(12·26·9), l’Indice Paura e Avidità, il Mayer Multiple, il calo dal massimo a 365 giorni, il golden cross/death cross 50/200 e l’MVRV Z-Score, e indica con un punteggio da 0 a 100 da che parte pende il prezzo attuale rispetto agli standard storici. Funziona gratis sul web senza software aggiuntivi e il punteggio ha cinque livelli, da STRONG BUY a OVERHEATED. Poiché XLM è l’asset nativo di una rete di pagamenti, alcuni indicatori richiedono una lettura attenta.",
    "coinH": "Che cos’è Stellar (XLM)?",
    "coinP": [
     "Stellar è una rete di pagamenti open source per trasferimenti internazionali ed emissione di asset, e i lumen (XLM) ne sono l’asset nativo. È stata creata nel 2014 da Jed McCaleb, cofondatore di Ripple, insieme a Joyce Kim, e il suo sviluppo è sostenuto dalla fondazione non profit Stellar Development Foundation (SDF). Banche, società di rimesse ed emittenti di stablecoin la usano per emettere e scambiare asset garantiti da valute come il dollaro, mentre XLM serve a pagare le commissioni e a coprire il saldo minimo dei conti.",
     "Al posto del mining usa lo Stellar Consensus Protocol (SCP, accordo bizantino federato), progettato da David Mazières nel 2015, per confermare le transazioni in pochi secondi. È partita con 100 miliardi di lumen e un’inflazione annua dell’1%, ma nell’ottobre 2019 i validatori della rete hanno votato per abolire l’inflazione e a novembre dello stesso anno la SDF ha bruciato circa 55 miliardi di XLM, riducendo l’offerta totale a circa 50 miliardi. Nel febbraio 2024 è arrivata sulla mainnet Soroban, la piattaforma di smart contract."
    ],
    "applyH": "Come applicare gli indicatori a Stellar",
    "apply": [
     "XLM ha spesso seguito un andamento simile a XRP, che condivide il tema dei pagamenti. Quando il punteggio cambia bruscamente, controllare le notizie su XRP oltre a quelle su BTC aiuta a trovarne la causa.",
     "L’Indice Paura e Avidità non è un valore di Stellar, ma l’indice di Alternative.me per l’intero mercato cripto, sbilanciato su BTC. Gli eventi che riguardano solo XLM, come una grande partnership per le rimesse o un aggiornamento della rete, non vi si riflettono.",
     "L’MVRV Z-Score viene calcolato perché CoinMetrics ha i dati di XLM. Tuttavia la SDF detiene una parte consistente dell’offerta e la usa gradualmente, tra l’altro per sostenere l’ecosistema, quindi non lo si può leggere solo come costo medio d’acquisto del mercato.",
     "Dopo il massimo storico di gennaio 2018, XLM è rimasto a lungo al di sotto e si è ripetuto uno schema di brevi impennate seguite da forti ritracciamenti. Usare così come sono la linea di surriscaldamento a 2,4 del Mayer Multiple e la zona d’acquisto a -50% di Bitcoin può produrre segnali di surriscaldamento subito dopo un’impennata o segnali d’acquisto prematuri nel mezzo di un trend ribassista.",
     "Il controvalore scambiato ogni giorno è solo una frazione di quello di BTC, e più volte una singola notizia ha mosso il prezzo di percentuali a due cifre in un giorno. In giornate così RSI e MACD toccano valori estremi con una sola candela: conviene osservare come si assestano gli indicatori nei giorni successivi."
    ],
    "histH": "I cicli di prezzo di Stellar in breve",
    "hist": [
     "2014–2015 — Jed McCaleb e Joyce Kim lanciano Stellar, che nel 2015 passa a una nuova rete basata su SCP.",
     "2018 — Tocca il massimo storico, ancora sotto 1 dollaro, all’inizio di gennaio e poi crolla nel mercato ribassista.",
     "2019 — La fine dell’inflazione (ottobre) e la distruzione di circa 55 miliardi di XLM da parte della SDF (novembre) cambiano la struttura dell’offerta.",
     "2021 — Sale con forza nel mercato rialzista senza superare il massimo del 2018; a ottobre viene annunciata una partnership di regolamento in USDC con MoneyGram, società di rimesse.",
     "2024 — A febbraio gli smart contract Soroban arrivano sulla mainnet e a novembre XLM schizza in poco tempo insieme a XRP."
    ],
    "faq": [
     {
      "q": "Esiste un Indice Paura e Avidità solo per Stellar?",
      "a": "No. L’indice mostrato qui è il valore dell’intero mercato di Alternative.me, che non pubblica un dato separato per XLM; per questo la scheda lo indica come indice di tutto il mercato. L’andamento proprio di Stellar si vede negli altri indicatori, calcolati sul prezzo di XLM."
     },
     {
      "q": "Anche Stellar ha un valore MVRV?",
      "a": "Sì. I dati pubblici di CoinMetrics includono XLM, quindi l’MVRV Z-Score viene calcolato. Poiché può includere offerta mai scambiata sul mercato, come quella detenuta dalla SDF, è difficile usarlo come indicatore di minimi e massimi alla maniera dell’MVRV di Bitcoin. Senza dati compare N/A."
     },
     {
      "q": "Conviene comprare Stellar adesso?",
      "a": "Questa pagina non fornisce consulenza sugli investimenti. Un punteggio di 80 o più (STRONG BUY) significa solo che si sovrappongono diversi segnali di ipervenduto, paura e sottovalutazione; sotto 25 (OVERHEATED), che si sovrappongono segnali di surriscaldamento. Poiché XLM ha avuto spesso impennate di breve durata, conviene leggere separatamente le schede di breve e di lungo periodo."
     },
     {
      "q": "XLM e XRP sono la stessa moneta?",
      "a": "No. Jed McCaleb ha partecipato a entrambi i progetti ed entrambi puntano sui pagamenti, ma Stellar è una rete indipendente sostenuta da una fondazione non profit, con un diverso protocollo di consenso (SCP) e una diversa struttura dell’offerta. Ogni moneta ha la sua pagina."
     },
     {
      "q": "L’offerta totale di XLM aumenterà?",
      "a": "Da quando l’inflazione è stata abolita nel 2019, il protocollo non crea nuovi XLM, e dopo la distruzione di novembre di quell’anno l’offerta totale è di circa 50 miliardi. L’offerta circolante però può salire quando i fondi della SDF arrivano sul mercato, e questa pagina non inserisce le variazioni dell’offerta nel punteggio."
     },
     {
      "q": "L’attività della rete Stellar entra nel punteggio?",
      "a": "No. Le metriche d’uso della rete, come il numero di pagamenti, i conti attivi o il volume di stablecoin emesse, non fanno parte del calcolo. Il punteggio si basa solo su indicatori ricavati dal prezzo di XLM, sul sentiment di mercato e sull’MVRV."
     }
    ]
   },
   "pt": {
    "title": "Guia da pontuação de momento de compra da Stellar (XLM)",
    "intro": "A página da Stellar (XLM) reúne numa só tela RSI(14), MACD(12·26·9), o Índice de Medo e Ganância, o Mayer Multiple, a queda desde a máxima de 365 dias, o cruzamento dourado/da morte 50/200 e o MVRV Z-Score, e mostra com uma pontuação de 0 a 100 para que lado o preço atual pende segundo os padrões históricos. Funciona de graça na web, sem programas extras, e a pontuação tem cinco níveis, de STRONG BUY a OVERHEATED. Como o XLM é o ativo nativo de uma rede de pagamentos, alguns indicadores exigem leitura cuidadosa.",
    "coinH": "O que é a Stellar (XLM)?",
    "coinP": [
     "A Stellar é uma rede de pagamentos de código aberto para transferências internacionais e emissão de ativos, e os lumens (XLM) são seu ativo nativo. Foi criada em 2014 por Jed McCaleb, cofundador da Ripple, junto com Joyce Kim, e seu desenvolvimento é apoiado pela fundação sem fins lucrativos Stellar Development Foundation (SDF). Bancos, empresas de remessas e emissores de stablecoins a usam para emitir e trocar ativos lastreados em moedas fiduciárias como o dólar, enquanto o XLM paga as taxas de transação e cobre o saldo mínimo das contas.",
     "Em vez de mineração, ela confirma transações em poucos segundos com o Stellar Consensus Protocol (SCP, acordo bizantino federado), projetado por David Mazières em 2015. Começou com 100 bilhões de lumens e inflação anual de 1%, mas em outubro de 2019 os validadores da rede votaram pelo fim da inflação e, em novembro do mesmo ano, a SDF queimou cerca de 55 bilhões de XLM, reduzindo a oferta total para cerca de 50 bilhões. Em fevereiro de 2024, a plataforma de contratos inteligentes Soroban chegou à mainnet."
    ],
    "applyH": "Como aplicar os indicadores à Stellar",
    "apply": [
     "O XLM muitas vezes se comportou de forma parecida com o XRP, que divide o mesmo tema de pagamentos. Quando a pontuação muda bruscamente, olhar as notícias do XRP além das do BTC ajuda a achar a causa.",
     "O Índice de Medo e Ganância não é um valor da Stellar, e sim o índice da Alternative.me para todo o mercado cripto, com peso maior no BTC. Eventos que dizem respeito só ao XLM, como uma grande parceria de remessas ou uma atualização de rede, não aparecem nele.",
     "O MVRV Z-Score é calculado porque a CoinMetrics tem dados do XLM. Porém, a SDF detém uma parte significativa da oferta e a usa aos poucos, entre outras coisas para apoiar o ecossistema, então ele não pode ser lido apenas como o custo médio de compra do mercado.",
     "Depois de marcar a máxima histórica em janeiro de 2018, o XLM ficou muito tempo abaixo dela, e se repetiu um padrão de altas rápidas seguidas de recuos profundos. Usar sem ajuste a linha de superaquecimento de 2,4 do Mayer Multiple e a zona de compra de -50% do Bitcoin pode gerar sinais de superaquecimento logo após uma disparada ou sinais de compra precoces no meio de uma tendência de baixa.",
     "O volume financeiro diário é só uma fração do BTC, e várias vezes uma única notícia moveu o preço em porcentagens de dois dígitos num só dia. Nesses dias, RSI e MACD atingem valores extremos com um único candle, então vale observar como os indicadores se acomodam nos dias seguintes."
    ],
    "histH": "Resumo dos ciclos de preço da Stellar",
    "hist": [
     "2014–2015 — Jed McCaleb e Joyce Kim lançaram a Stellar, que em 2015 migrou para uma nova rede baseada no SCP.",
     "2018 — Marcou a máxima histórica, ainda abaixo de 1 dólar, no início de janeiro e depois caiu forte no mercado de baixa.",
     "2019 — O fim da inflação (outubro) e a queima de cerca de 55 bilhões de XLM pela SDF (novembro) mudaram a estrutura da oferta.",
     "2021 — Subiu forte no mercado de alta sem superar a máxima de 2018; em outubro foi anunciada uma parceria de liquidação em USDC com a empresa de remessas MoneyGram.",
     "2024 — Os contratos inteligentes Soroban chegaram à mainnet em fevereiro e, em novembro, o XLM disparou em pouco tempo junto com o XRP."
    ],
    "faq": [
     {
      "q": "Existe um Índice de Medo e Ganância só da Stellar?",
      "a": "Não. O índice mostrado aqui é o valor de todo o mercado da Alternative.me, que não publica um número separado para o XLM; por isso o cartão o identifica como índice do mercado inteiro. A tendência própria da Stellar aparece nos demais indicadores, calculados com o preço do XLM."
     },
     {
      "q": "A Stellar também tem leitura de MVRV?",
      "a": "Sim. Os dados públicos da CoinMetrics incluem o XLM, então o MVRV Z-Score é calculado. Como ele pode incluir oferta que nunca foi negociada no mercado, como a que a SDF detém, é difícil usá-lo como indicador de fundos e topos do jeito que se usa o MVRV do Bitcoin. Sem dados, aparece N/A."
     },
     {
      "q": "Devo comprar Stellar agora?",
      "a": "Esta página não oferece recomendação de investimento. Uma pontuação de 80 ou mais (STRONG BUY) significa apenas que vários sinais de sobrevenda, medo e subvalorização se sobrepõem; abaixo de 25 (OVERHEATED), que se sobrepõem sinais de superaquecimento. Como o XLM teve altas passageiras com frequência, vale ler separadamente as abas de curto e de longo prazo."
     },
     {
      "q": "XLM e XRP são a mesma moeda?",
      "a": "Não. Jed McCaleb participou dos dois projetos e ambos miram pagamentos, mas a Stellar é uma rede independente apoiada por uma fundação sem fins lucrativos, com outro protocolo de consenso (SCP) e outra estrutura de oferta. Cada moeda tem sua própria página."
     },
     {
      "q": "A oferta total de XLM vai aumentar?",
      "a": "Desde o fim da inflação em 2019, o protocolo não cria novos XLM, e desde a queima de novembro daquele ano a oferta total gira em torno de 50 bilhões. A oferta circulante, porém, pode crescer quando recursos da SDF chegam ao mercado, e esta página não incorpora mudanças de oferta à pontuação."
     },
     {
      "q": "A atividade da rede Stellar entra na pontuação?",
      "a": "Não. Métricas de uso da rede, como número de pagamentos, contas ativas ou volume de stablecoins emitidas, não fazem parte do cálculo. A pontuação é formada apenas por indicadores derivados do preço do XLM, pelo sentimento do mercado e pelo MVRV."
     }
    ]
   },
   "ru": {
    "title": "Путеводитель по оценке момента покупки Стеллара (XLM)",
    "intro": "Страница Стеллара (XLM) собирает на одном экране RSI(14), MACD(12·26·9), индекс страха и жадности, Mayer Multiple, просадку от 365-дневного максимума, золотой крест / крест смерти 50/200 и MVRV Z-Score и показывает оценкой от 0 до 100, в какую сторону по историческим меркам склоняется текущая цена. Страница работает бесплатно в браузере без дополнительных программ, а у оценки пять уровней — от STRONG BUY до OVERHEATED. Поскольку XLM — нативный актив платёжной сети, некоторые индикаторы нужно толковать осторожно.",
    "coinH": "Что такое Стеллар (XLM)?",
    "coinP": [
     "Стеллар — платёжная сеть с открытым исходным кодом для международных переводов и выпуска активов, а люмены (XLM) — её нативный актив. Сеть создали в 2014 году сооснователь Ripple Джед Маккалеб и Джойс Ким; разработку поддерживает некоммерческий фонд Stellar Development Foundation (SDF). Банки, сервисы денежных переводов и эмитенты стейблкоинов выпускают в ней активы, обеспеченные фиатными валютами вроде доллара, и обмениваются ими, а XLM служит для оплаты комиссий и минимального баланса счетов.",
     "Вместо майнинга сеть подтверждает транзакции за несколько секунд с помощью протокола консенсуса Стеллара (SCP, федеративное византийское соглашение), разработанного Дэвидом Мазьером в 2015 году. Изначально было выпущено 100 млрд люменов с инфляцией 1% в год, но в октябре 2019 года валидаторы сети проголосовали за отмену инфляции, а в ноябре того же года SDF сжёг около 55 млрд XLM, и общее предложение сократилось примерно до 50 млрд. В феврале 2024 года в основной сети появилась платформа смарт-контрактов Soroban."
    ],
    "applyH": "Как применять индикаторы к Стеллару",
    "apply": [
     "XLM нередко двигался похоже на XRP, который относится к той же платёжной теме. Если оценка резко меняется, полезно проверить новости не только по BTC, но и по XRP — так проще найти причину.",
     "Индекс страха и жадности — не показатель Стеллара, а индекс Alternative.me для всего криптовалютного рынка с упором на BTC. События, касающиеся только XLM, например крупное партнёрство в сфере переводов или обновление сети, в нём не отражаются.",
     "MVRV Z-Score рассчитывается, поскольку у CoinMetrics есть данные по XLM. Однако значительная часть предложения принадлежит SDF и постепенно расходуется, в том числе на поддержку экосистемы, поэтому трактовать его только как среднюю цену покупки участников рынка нельзя.",
     "Установив исторический максимум в январе 2018 года, XLM долго оставался ниже него, а сценарий коротких взлётов с последующими глубокими откатами повторялся. Если без поправок брать биткоиновую линию перегрева Mayer Multiple 2,4 и зону покупки при просадке -50%, можно получить сигнал перегрева сразу после взлёта или преждевременный сигнал на покупку посреди нисходящего тренда.",
     "Дневной оборот торгов составляет лишь малую долю оборота BTC, и не раз одна новость сдвигала цену более чем на 10% за день. В такие дни RSI и MACD достигают крайних значений из-за одной-единственной свечи, поэтому стоит посмотреть, как индикаторы успокоятся в следующие дни."
    ],
    "histH": "Ценовые циклы Стеллара кратко",
    "hist": [
     "2014–2015 — Джед Маккалеб и Джойс Ким запустили Стеллар, который в 2015 году перешёл на новую сеть на базе SCP.",
     "2018 — В начале января установлен исторический максимум, всё ещё ниже 1 доллара, после чего цена резко упала на медвежьем рынке.",
     "2019 — Отмена инфляции (октябрь) и сжигание фондом SDF около 55 млрд XLM (ноябрь) изменили структуру предложения.",
     "2021 — Сильный рост на бычьем рынке без обновления максимума 2018 года; в октябре объявлено партнёрство с сервисом переводов MoneyGram по расчётам в USDC.",
     "2024 — В феврале в основной сети заработали смарт-контракты Soroban, а в ноябре XLM вместе с XRP резко взлетел за короткий срок."
    ],
    "faq": [
     {
      "q": "Есть ли индекс страха и жадности только для Стеллара?",
      "a": "Нет. Индекс на этой странице — общерыночное значение Alternative.me, а Alternative.me не публикует отдельную цифру для XLM; поэтому на карточке он помечен как индекс всего рынка. Собственную динамику Стеллара показывают остальные индикаторы, рассчитанные по цене XLM."
     },
     {
      "q": "Есть ли для Стеллара показатель MVRV?",
      "a": "Да. В открытых данных CoinMetrics есть XLM, поэтому MVRV Z-Score рассчитывается. Но в него может входить предложение, которое никогда не торговалось на рынке, например запасы SDF, так что использовать его как индикатор дна и вершины, как MVRV биткоина, сложно. При отсутствии данных отображается N/A."
     },
     {
      "q": "Стоит ли покупать Стеллар сейчас?",
      "a": "Эта страница не даёт инвестиционных рекомендаций. Оценка 80 и выше (STRONG BUY) лишь означает, что совпали несколько сигналов перепроданности, страха и недооценённости, а ниже 25 (OVERHEATED) — что совпали признаки перегрева. Поскольку у XLM часто бывали кратковременные взлёты, краткосрочную и долгосрочную вкладки лучше читать по отдельности."
     },
     {
      "q": "XLM и XRP — одна и та же монета?",
      "a": "Нет. Джед Маккалеб участвовал в обоих проектах, и оба нацелены на платежи, но Стеллар — отдельная сеть, которую поддерживает некоммерческий фонд, с другим протоколом консенсуса (SCP) и другой структурой предложения. У каждой монеты своя страница."
     },
     {
      "q": "Будет ли расти общее предложение XLM?",
      "a": "После отмены инфляции в 2019 году протокол не выпускает новые XLM, а после сжигания в ноябре того же года общее предложение составляет около 50 млрд. Циркулирующее предложение всё же может расти, когда запасы SDF выходят на рынок, а эта страница не учитывает изменения предложения в оценке отдельно."
     },
     {
      "q": "Влияет ли активность сети Стеллар на оценку?",
      "a": "Нет. Показатели использования сети — число платежей, активные счета, объём выпущенных стейблкоинов — в расчёт не входят. Оценка строится только на индикаторах, полученных из цены XLM, рыночных настроениях и MVRV."
     }
    ]
   },
   "nl": {
    "title": "Gids bij de koop-timingscore van Stellar (XLM)",
    "intro": "De Stellar-pagina (XLM) brengt RSI(14), MACD(12·26·9), de Angst-en-hebzuchtindex, de Mayer Multiple, de daling vanaf de 365-daagse top, de golden/death cross 50/200 en de MVRV Z-Score samen op één scherm en laat met een score van 0 tot 100 zien welke kant de huidige koers volgens historische maatstaven op helt. Hij werkt gratis op het web zonder extra software, en de score kent vijf niveaus, van STRONG BUY tot OVERHEATED. Omdat XLM het native asset van een betaalnetwerk is, vragen sommige indicatoren om een voorzichtige interpretatie.",
    "coinH": "Wat is Stellar (XLM)?",
    "coinP": [
     "Stellar is een opensource-betaalnetwerk voor internationale overboekingen en het uitgeven van activa; lumens (XLM) zijn het native asset. Het werd in 2014 opgericht door Ripple-medeoprichter Jed McCaleb samen met Joyce Kim, en de ontwikkeling wordt gesteund door de non-profit Stellar Development Foundation (SDF). Banken, geldoverboekingsdiensten en uitgevers van stablecoins gebruiken het om activa te verhandelen die gedekt zijn door fiatvaluta zoals de dollar, terwijl XLM transactiekosten betaalt en het minimumsaldo van accounts dekt.",
     "In plaats van mining gebruikt het het Stellar Consensus Protocol (SCP, gefedereerde Byzantijnse overeenstemming), dat David Mazières in 2015 ontwierp, om transacties binnen enkele seconden te bevestigen. Het begon met 100 miljard lumens en 1% inflatie per jaar, maar in oktober 2019 stemden de validators van het netwerk voor het afschaffen van de inflatie, en in november van dat jaar verbrandde de SDF ongeveer 55 miljard XLM, waardoor het totale aanbod daalde tot ongeveer 50 miljard. In februari 2024 kwam het smart-contractplatform Soroban op het mainnet."
    ],
    "applyH": "Indicatoren toepassen op Stellar",
    "apply": [
     "XLM bewoog vaak vergelijkbaar met XRP, dat hetzelfde betaalthema deelt. Verandert de score abrupt, dan helpt het om naast BTC ook het nieuws rond XRP te bekijken om de oorzaak te vinden.",
     "De Angst-en-hebzuchtindex is geen Stellar-waarde, maar de index van Alternative.me voor de hele cryptomarkt, met BTC als zwaartepunt. Gebeurtenissen die alleen XLM raken, zoals een groot overboekingspartnerschap of een netwerkupgrade, zie je er niet in terug.",
     "De MVRV Z-Score wordt berekend omdat CoinMetrics data over XLM heeft. De SDF bezit echter een aanzienlijk deel van het aanbod en zet dat geleidelijk in, onder meer voor ondersteuning van het ecosysteem, dus je kunt hem niet puur lezen als de gemiddelde aankoopprijs van de markt.",
     "Na de recordkoers van januari 2018 bleef XLM lange tijd daaronder, en een patroon van korte koerssprongen gevolgd door diepe terugvallen herhaalde zich. Wie de oververhittingslijn van de Mayer Multiple op 2,4 en de koopzone bij -50% daling ongewijzigd van Bitcoin overneemt, kan direct na een sprong oververhittingssignalen krijgen, of midden in een dalende trend te vroege koopsignalen.",
     "De dagelijkse handelswaarde is maar een fractie van die van BTC, en meermaals verschoof één nieuwsbericht de koers op één dag met dubbele-cijferpercentages. Op zulke dagen bereiken RSI en MACD al met één candle extreme waarden; kijk daarom ook hoe de indicatoren zich in de dagen erna stabiliseren."
    ],
    "histH": "De prijscycli van Stellar in het kort",
    "hist": [
     "2014–2015 — Jed McCaleb en Joyce Kim lanceerden Stellar, dat in 2015 overstapte op een nieuw netwerk op basis van SCP.",
     "2018 — Begin januari volgde de recordkoers, nog onder 1 dollar, waarna de koers in de bearmarkt hard daalde.",
     "2019 — Het einde van de inflatie (oktober) en de verbranding van ongeveer 55 miljard XLM door de SDF (november) veranderden de aanbodstructuur.",
     "2021 — Sterke stijging in de bullmarkt zonder de top van 2018 te breken; in oktober werd een USDC-afwikkelingspartnerschap met geldoverboekingsdienst MoneyGram aangekondigd.",
     "2024 — Soroban-smart-contracts kwamen in februari op het mainnet en in november schoot XLM samen met XRP in korte tijd omhoog."
    ],
    "faq": [
     {
      "q": "Bestaat er een Angst-en-hebzuchtindex alleen voor Stellar?",
      "a": "Nee. De index hier is de marktbrede waarde van Alternative.me, en Alternative.me publiceert geen apart cijfer voor XLM; daarom staat er op de kaart dat het een index voor de hele markt is. De eigen trend van Stellar zie je in de overige indicatoren, die uit de XLM-koers worden berekend."
     },
     {
      "q": "Heeft Stellar ook een MVRV-waarde?",
      "a": "Ja. De openbare data van CoinMetrics bevatten XLM, dus de MVRV Z-Score wordt berekend. Omdat er aanbod in kan zitten dat nooit op de markt is verhandeld, zoals de bezittingen van de SDF, is het lastig hem te gebruiken als indicator voor bodems en toppen zoals bij de MVRV van Bitcoin. Zonder data verschijnt N/A."
     },
     {
      "q": "Moet ik nu Stellar kopen?",
      "a": "Deze pagina geeft geen beleggingsadvies. Een score van 80 of hoger (STRONG BUY) betekent alleen dat meerdere signalen van oversold, angst en onderwaardering samenvallen; onder 25 (OVERHEATED) dat signalen van oververhitting samenvallen. Omdat XLM vaak kortstondige koerssprongen had, is het verstandig de tabbladen korte en lange termijn apart te lezen."
     },
     {
      "q": "Zijn XLM en XRP dezelfde munt?",
      "a": "Nee. Jed McCaleb was bij beide projecten betrokken en beide richten zich op betalingen, maar Stellar is een apart netwerk dat door een non-profitstichting wordt gesteund, met een ander consensusprotocol (SCP) en een andere aanbodstructuur. Elke munt heeft een eigen pagina."
     },
     {
      "q": "Gaat het totale aanbod van XLM nog groeien?",
      "a": "Sinds de inflatie in 2019 werd afgeschaft, maakt het protocol geen nieuwe XLM meer aan, en sinds de verbranding in november van dat jaar ligt het totale aanbod rond 50 miljard. Het circulerende aanbod kan wel stijgen als bezittingen van de SDF op de markt komen, en deze pagina verwerkt aanbodveranderingen niet apart in de score."
     },
     {
      "q": "Telt de activiteit op het Stellar-netwerk mee in de score?",
      "a": "Nee. Gebruikscijfers van het netwerk, zoals het aantal betalingen, actieve accounts of het volume uitgegeven stablecoins, maken geen deel uit van de berekening. De score is uitsluitend gebaseerd op indicatoren uit de XLM-koers, het marktsentiment en de MVRV."
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
