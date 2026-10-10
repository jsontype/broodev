/* 하단 SEO 본문 다국어 데이터 + 렌더러. index.html(광고) / member/index.html(구독자) 공유.
   언어 전환 시 window.renderSEO(lang) 호출 → section.seo 를 해당 언어로 다시 그림.
   기본 정적 HTML(한국어)은 무JS 크롤러용 폴백으로 남겨두고, JS 실행 시 현재 언어로 교체. */
(function () {
  var SEO = {
    ko: {
      title: '체인링크 공포·탐욕 지수 & 매수 타이밍 점수',
      intro: '체인링크 공포지수(공포·탐욕 지수, Fear & Greed Index)를 포함한 7개 실시간 지표를 합성해 “지금이 매수 타이밍인가?”를 0~100 점수로 보여주는 무료 대시보드입니다. 설치 없이 브라우저에서 바로 실행되며 13개 언어를 지원합니다.',
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
        { q: '공포지수가 낮으면 체인링크을 사야 하나요?', a: '극단적 공포는 역사적으로 분할 매수 기회였던 경우가 많지만, 공포지수 하나만 보면 “떨어지는 칼날”을 잡을 위험이 있습니다. 본 점수는 RSI·MACD·마이어 배수·낙폭·이동평균 크로스를 함께 보고, 하락 추세에서는 점수를 보수적으로 낮춥니다.' },
        { q: '매수 타이밍 점수는 어떻게 계산되나요?', a: '7개 지표를 각각 0~100 부분점수로 환산해 가중 합성합니다. 결과는 0~100이며 5단계 밴드로 표시됩니다.' },
        { q: '무료인가요? 설치가 필요한가요?', a: '완전 무료이며 설치가 필요 없습니다. CoinGecko·Binance·Alternative.me 공개 API에서 실시간 데이터를 가져옵니다.' },
        { q: '공포지수와 매수 타이밍 점수는 무엇이 다른가요?', a: '공포지수는 심리 한 가지 지표(0~100)이고, 매수 타이밍 점수는 공포지수를 포함한 7개 지표를 합성한 종합 점수(0~100)입니다.' },
        { q: '공포지수 데이터는 어디서 가져오나요? 얼마나 자주 갱신되나요?', a: '공포·탐욕 지수는 Alternative.me, 가격·일봉은 CoinGecko·Binance, 온체인 지표는 CoinMetrics 공개 API에서 실시간으로 가져옵니다. 화면은 약 1분 주기로 자동 갱신됩니다.' },
        { q: '체인링크 지금 사도 되나요?', a: '정답은 없지만, 매수 타이밍 점수(0~100)로 현재 시장이 과매도·공포 구간인지 과열·탐욕 구간인지 객관적으로 가늠할 수 있습니다. 장기(역발상) 탭 기준 점수가 높을수록 공포·저평가가 겹친 분할 매수 우호 구간, 낮을수록 과열 경계 구간입니다. 참고 신호일 뿐 투자 자문이 아닙니다.' },
        { q: '단기와 장기 매수 타이밍은 어떻게 다른가요?', a: '점수는 단기·장기 두 탭으로 나뉩니다. 단기(모멘텀)는 약 1~3개월 추세추종 관점으로 상승 추세가 강할수록 높고, 장기(역발상)는 약 1년 이상 사이클 관점으로 공포·저평가일수록 높습니다. 2017년 이후 백테스트에서 단기는 모멘텀, 장기는 역발상 방향이 더 잘 맞았습니다.' },
        { q: 'BOTTOM RADAR(바닥 점수)는 무엇인가요?', a: 'MVRV Z-점수 같은 온체인 지표로 시가총액이 투자자 평균 매수원가 대비 어디에 있는지 재서, 역사적 바닥 구간과의 근접도를 0~100으로 보여주는 보조 게이지입니다. 계산 근거는 “비트코인 바닥” 해설 페이지에 공개되어 있습니다.' }
      ],
      disclaimer: '⚠ 본 점수는 공개 지표를 합성한 참고 신호이며 투자 자문이 아닙니다. 모든 투자 판단과 책임은 이용자 본인에게 있습니다.'
    },
    en: {
      title: 'Chainlink Fear & Greed Index & Buy-Timing Score',
      intro: 'A free dashboard that synthesizes 7 real-time indicators — including the Chainlink Fear & Greed Index — into a 0–100 “is now a good time to buy?” score. Runs in your browser with no install, in 13 languages.',
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
        { q: 'Should I buy Chainlink when the index is low?', a: 'Extreme fear has often been an accumulation opportunity, but relying on the index alone risks catching a falling knife. This score also weighs RSI, MACD, Mayer Multiple, drawdown and moving-average crosses, and lowers the score conservatively in downtrends.' },
        { q: 'How is the buy-timing score calculated?', a: 'Each of the 7 indicators is converted to a 0–100 sub-score and weighted together. The result is 0–100, shown in 5 bands.' },
        { q: 'Is it free? Do I need to install anything?', a: 'It is completely free with no install. Real-time data comes from CoinGecko, Binance and Alternative.me public APIs.' },
        { q: 'How is the index different from the buy-timing score?', a: 'The index is a single sentiment metric (0–100); the buy-timing score is a composite of 7 indicators including the index (0–100).' },
        { q: 'Where does the data come from, and how often does it refresh?', a: 'The Fear & Greed Index comes from Alternative.me, prices and daily candles from the CoinGecko and Binance public APIs, and on-chain metrics from CoinMetrics. The screen auto-refreshes roughly every minute.' },
        { q: 'Should I buy Chainlink right now?', a: 'There is no single answer, but the buy-timing score (0–100) gives an objective read on whether the market is in an oversold/fear zone or an overheated/greed zone. On the long-term (contrarian) tab, higher scores mark zones where fear and undervaluation overlap — historically favorable for DCA — while lower scores warn of overheating. It is a reference signal, not investment advice.' },
        { q: 'How do short-term and long-term buy timing differ?', a: 'The score is split into two tabs. Short-term (momentum) takes a 1–3 month trend-following view and rises with strong uptrends; long-term (contrarian) takes a 1-year-plus cycle view and rises with fear and undervaluation. In backtests since 2017, momentum worked better short-term and contrarian worked better long-term.' },
        { q: 'What is the BOTTOM RADAR (bottom score)?', a: 'A secondary gauge that uses on-chain metrics such as the MVRV Z-Score to measure where market cap sits relative to investors’ average cost basis, showing proximity to historic bottom zones on a 0–100 scale. The full calculation is published on the “Bitcoin bottom” guide page.' }
      ],
      disclaimer: '⚠ This score is a reference signal built from public indicators, not investment advice. All decisions and responsibility are your own.'
    },
    ja: {
      title: 'チェーンリンク 恐怖・強欲指数 & 買い時スコア',
      intro: 'チェーンリンクの恐怖・強欲指数（Fear & Greed Index）を含む7つのリアルタイム指標を合成し、「今が買い時か？」を0〜100のスコアで示す無料ダッシュボードです。インストール不要でブラウザから即実行、13言語対応。',
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
        { q: '指数が低ければチェーンリンクを買うべき？', a: '極端な恐怖は歴史的に分割買いの好機だったことが多いですが、指数だけに頼ると「落ちるナイフ」を掴む危険があります。本スコアはRSI・MACD・マイヤー倍率・下落率・移動平均クロスも合わせて見て、下落トレンドでは保守的にスコアを下げます。' },
        { q: '買い時スコアはどう計算される？', a: '7指標をそれぞれ0〜100の部分スコアに換算し加重合成します。結果は0〜100で、5段階バンドで表示します。' },
        { q: '無料？インストールは必要？', a: '完全無料・インストール不要です。CoinGecko・Binance・Alternative.me の公開APIからリアルタイムデータを取得します。' },
        { q: '指数と買い時スコアの違いは？', a: '指数は心理1指標(0〜100)、買い時スコアは指数を含む7指標を合成した総合スコア(0〜100)です。' },
        { q: 'データはどこから？更新頻度は？', a: '恐怖・強欲指数はAlternative.me、価格・日足はCoinGecko・Binance、オンチェーン指標はCoinMetricsの公開APIからリアルタイムで取得します。画面は約1分ごとに自動更新されます。' },
        { q: 'チェーンリンクは今買ってもいい？', a: '正解はありませんが、買い時スコア(0〜100)で現在の市場が売られすぎ・恐怖圏か、過熱・強欲圏かを客観的に測れます。長期（逆張り）タブではスコアが高いほど恐怖と割安が重なる分割買いに有利な圏、低いほど過熱警戒圏です。参考シグナルであり投資助言ではありません。' },
        { q: '短期と長期の買い時はどう違う？', a: 'スコアは短期・長期の2タブに分かれます。短期（モメンタム）は約1〜3か月のトレンドフォロー視点で上昇トレンドが強いほど高く、長期（逆張り）は約1年以上のサイクル視点で恐怖・割安なほど高くなります。2017年以降のバックテストでは、短期はモメンタム、長期は逆張りの方向がより有効でした。' },
        { q: 'BOTTOM RADAR（底値スコア）とは？', a: 'MVRV Zスコアなどのオンチェーン指標で、時価総額が投資家の平均取得単価に対してどの位置にあるかを測り、歴史的な底値圏への近さを0〜100で示す補助ゲージです。計算根拠は「ビットコインの底」解説ページで公開しています。' }
      ],
      disclaimer: '⚠ 本スコアは公開指標を合成した参考シグナルであり、投資助言ではありません。すべての判断と責任は利用者ご自身にあります。'
    },
    zh: {
      title: 'Chainlink恐惧与贪婪指数 & 买入时机评分',
      intro: '一个免费仪表板，将包括Chainlink恐惧与贪婪指数（Fear & Greed Index）在内的7个实时指标合成为0–100的“现在是买入时机吗？”评分。无需安装，浏览器即开即用，支持13种语言。',
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
        { q: '指数低就该买Chainlink吗？', a: '极度恐惧在历史上常是分批买入良机，但只看指数有“接飞刀”的风险。本评分同时参考RSI、MACD、梅耶倍数、回撤与均线交叉，并在下跌趋势中保守下调评分。' },
        { q: '买入时机评分如何计算？', a: '将7个指标各自换算为0–100分项评分并加权合成。结果为0–100，以5档显示。' },
        { q: '免费吗？需要安装吗？', a: '完全免费、无需安装。实时数据来自 CoinGecko、Binance、Alternative.me 公开API。' },
        { q: '指数与买入时机评分有何不同？', a: '指数是单一情绪指标(0–100)；买入时机评分是包含该指数在内的7指标综合评分(0–100)。' },
        { q: '数据来自哪里？多久更新一次？', a: '恐惧与贪婪指数来自Alternative.me，价格与日K来自CoinGecko和Binance公开API，链上指标来自CoinMetrics。页面约每1分钟自动刷新。' },
        { q: '现在可以买Chainlink吗？', a: '没有标准答案，但买入时机评分(0–100)能客观判断当前市场处于超卖·恐惧区还是过热·贪婪区。在长期（逆向）标签页中，评分越高代表恐惧与低估重叠、历史上利于分批买入的区间；越低则是过热警戒区。仅供参考，并非投资建议。' },
        { q: '短期和长期买入时机有何不同？', a: '评分分为短期、长期两个标签页。短期（动量）以约1–3个月的趋势跟随视角，上升趋势越强评分越高；长期（逆向）以约1年以上的周期视角，越恐惧、越低估评分越高。2017年以来的回测显示，短期动量、长期逆向的方向更有效。' },
        { q: 'BOTTOM RADAR（底部评分）是什么？', a: '一个辅助仪表，利用MVRV Z分数等链上指标衡量市值相对投资者平均持仓成本的位置，以0–100显示与历史底部区间的接近程度。计算依据在“比特币底部”解读页面公开。' }
      ],
      disclaimer: '⚠ 本评分由公开指标合成，仅供参考，并非投资建议。一切投资决定与责任由用户自负。'
    },
    'zh-Hant': {
      title: 'Chainlink恐懼與貪婪指數 & 買入時機評分',
      intro: '一個免費儀表板，將包括Chainlink恐懼與貪婪指數（Fear & Greed Index）在內的7個即時指標合成為0–100的「現在是買入時機嗎？」評分。免安裝、瀏覽器即開即用，支援13種語言。',
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
        { q: '指數低就該買Chainlink嗎？', a: '極度恐懼在歷史上常是分批買入良機，但只看指數有「接飛刀」的風險。本評分同時參考RSI、MACD、梅耶倍數、回撤與均線交叉，並在下跌趨勢中保守下調評分。' },
        { q: '買入時機評分如何計算？', a: '將7個指標各自換算為0–100分項評分並加權合成。結果為0–100，以5檔顯示。' },
        { q: '免費嗎？需要安裝嗎？', a: '完全免費、免安裝。即時資料來自 CoinGecko、Binance、Alternative.me 公開API。' },
        { q: '指數與買入時機評分有何不同？', a: '指數是單一情緒指標(0–100)；買入時機評分是包含該指數在內的7指標綜合評分(0–100)。' },
        { q: '資料來自哪裡？多久更新一次？', a: '恐懼與貪婪指數來自Alternative.me，價格與日K來自CoinGecko和Binance公開API，鏈上指標來自CoinMetrics。頁面約每1分鐘自動重新整理。' },
        { q: '現在可以買Chainlink嗎？', a: '沒有標準答案，但買入時機評分(0–100)能客觀判斷當前市場處於超賣·恐懼區還是過熱·貪婪區。在長期（逆向）分頁中，評分越高代表恐懼與低估重疊、歷史上利於分批買入的區間；越低則是過熱警戒區。僅供參考，並非投資建議。' },
        { q: '短期和長期買入時機有何不同？', a: '評分分為短期、長期兩個分頁。短期（動量）以約1–3個月的趨勢跟隨視角，上升趨勢越強評分越高；長期（逆向）以約1年以上的週期視角，越恐懼、越低估評分越高。2017年以來的回測顯示，短期動量、長期逆向的方向更有效。' },
        { q: 'BOTTOM RADAR（底部評分）是什麼？', a: '一個輔助儀表，利用MVRV Z分數等鏈上指標衡量市值相對投資者平均持倉成本的位置，以0–100顯示與歷史底部區間的接近程度。計算依據在「比特幣底部」解說頁面公開。' }
      ],
      disclaimer: '⚠ 本評分由公開指標合成，僅供參考，並非投資建議。一切投資決定與責任由用戶自負。'
    },
    es: {
      title: 'Índice de miedo y codicia de Chainlink y puntuación de momento de compra',
      intro: 'Un panel gratuito que sintetiza 7 indicadores en tiempo real —incluido el índice de miedo y codicia de Chainlink— en una puntuación de 0 a 100 sobre «¿es buen momento para comprar?». Funciona en el navegador sin instalación, en 13 idiomas.',
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
        { q: '¿Debo comprar Chainlink cuando el índice está bajo?', a: 'El miedo extremo ha sido a menudo una oportunidad de acumulación, pero fiarse solo del índice arriesga «atrapar un cuchillo que cae». Esta puntuación también pondera RSI, MACD, múltiplo de Mayer, caída y cruces de medias, y la reduce de forma conservadora en tendencias bajistas.' },
        { q: '¿Cómo se calcula la puntuación de compra?', a: 'Cada uno de los 7 indicadores se convierte en una subpuntuación de 0 a 100 y se pondera. El resultado es 0–100, mostrado en 5 bandas.' },
        { q: '¿Es gratis? ¿Necesito instalar algo?', a: 'Es totalmente gratis y sin instalación. Los datos en tiempo real provienen de las API públicas de CoinGecko, Binance y Alternative.me.' },
        { q: '¿En qué se diferencia el índice de la puntuación de compra?', a: 'El índice es una sola métrica de sentimiento (0–100); la puntuación de compra es un compuesto de 7 indicadores que incluye el índice (0–100).' },
        { q: '¿De dónde vienen los datos y con qué frecuencia se actualizan?', a: 'El índice de miedo y codicia viene de Alternative.me; los precios y velas diarias, de las API públicas de CoinGecko y Binance; y las métricas on-chain, de CoinMetrics. La pantalla se actualiza automáticamente cada minuto aproximadamente.' },
        { q: '¿Debería comprar Chainlink ahora mismo?', a: 'No hay una respuesta única, pero la puntuación de compra (0–100) permite valorar objetivamente si el mercado está en zona de sobreventa/miedo o de recalentamiento/codicia. En la pestaña de largo plazo (contraria), puntuaciones altas marcan zonas donde coinciden miedo e infravaloración —históricamente favorables al DCA—, y las bajas avisan de recalentamiento. Es una señal de referencia, no asesoramiento de inversión.' },
        { q: '¿En qué se diferencian el timing de corto y de largo plazo?', a: 'La puntuación se divide en dos pestañas. El corto plazo (momentum) adopta una visión de seguimiento de tendencia de 1–3 meses y sube con tendencias alcistas fuertes; el largo plazo (contrario) adopta una visión de ciclo de más de un año y sube con miedo e infravaloración. En backtests desde 2017, el momentum funcionó mejor a corto y lo contrario a largo.' },
        { q: '¿Qué es el BOTTOM RADAR (puntuación de suelo)?', a: 'Un indicador auxiliar que usa métricas on-chain como el MVRV Z-Score para medir dónde está la capitalización respecto al coste medio de los inversores, mostrando la cercanía a zonas de suelo históricas en una escala de 0 a 100. El cálculo completo está publicado en la guía «suelo de Bitcoin».' }
      ],
      disclaimer: '⚠ Esta puntuación es una señal de referencia a partir de indicadores públicos, no asesoramiento de inversión. Todas las decisiones y la responsabilidad son tuyas.'
    },
    fr: {
      title: 'Indice de peur et d’avidité Chainlink et score de timing d’achat',
      intro: 'Un tableau de bord gratuit qui synthétise 7 indicateurs en temps réel — dont l’indice de peur et d’avidité Chainlink — en un score de 0 à 100 « est-ce le bon moment pour acheter ? ». Fonctionne dans le navigateur sans installation, en 13 langues.',
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
        { q: 'Dois-je acheter du Chainlink quand l’indice est bas ?', a: 'La peur extrême a souvent été une opportunité d’accumulation, mais se fier au seul indice risque d’« attraper un couteau qui tombe ». Ce score pondère aussi RSI, MACD, multiple de Mayer, repli et croisements de moyennes, et le réduit prudemment en tendance baissière.' },
        { q: 'Comment le score de timing d’achat est-il calculé ?', a: 'Chacun des 7 indicateurs est converti en sous-score de 0 à 100 puis pondéré. Le résultat est 0–100, affiché en 5 bandes.' },
        { q: 'Est-ce gratuit ? Faut-il installer quelque chose ?', a: 'C’est entièrement gratuit et sans installation. Les données en temps réel proviennent des API publiques de CoinGecko, Binance et Alternative.me.' },
        { q: 'Quelle différence entre l’indice et le score de timing d’achat ?', a: 'L’indice est une seule mesure de sentiment (0–100) ; le score de timing d’achat est un composite de 7 indicateurs incluant l’indice (0–100).' },
        { q: 'D’où viennent les données et à quelle fréquence sont-elles actualisées ?', a: 'L’indice de peur et d’avidité vient d’Alternative.me ; les prix et bougies journalières, des API publiques de CoinGecko et Binance ; et les métriques on-chain, de CoinMetrics. L’écran se rafraîchit automatiquement environ chaque minute.' },
        { q: 'Dois-je acheter du Chainlink maintenant ?', a: 'Il n’y a pas de réponse unique, mais le score de timing d’achat (0–100) permet d’évaluer objectivement si le marché est en zone de survente/peur ou de surchauffe/avidité. Dans l’onglet long terme (contrarian), des scores élevés marquent des zones où peur et sous-évaluation se recoupent — historiquement favorables au DCA — tandis que des scores bas signalent la surchauffe. C’est un signal de référence, pas un conseil en investissement.' },
        { q: 'Quelle différence entre le timing court terme et long terme ?', a: 'Le score est divisé en deux onglets. Le court terme (momentum) adopte une vue de suivi de tendance sur 1 à 3 mois et monte avec les tendances haussières fortes ; le long terme (contrarian) adopte une vue de cycle d’un an et plus et monte avec la peur et la sous-évaluation. Dans les backtests depuis 2017, le momentum a mieux fonctionné à court terme et le contrarian à long terme.' },
        { q: 'Qu’est-ce que le BOTTOM RADAR (score de plancher) ?', a: 'Une jauge auxiliaire qui utilise des métriques on-chain comme le MVRV Z-Score pour mesurer où se situe la capitalisation par rapport au coût moyen des investisseurs, en montrant la proximité des zones de plancher historiques sur une échelle de 0 à 100. Le calcul complet est publié sur la page « plancher du Bitcoin ».' }
      ],
      disclaimer: '⚠ Ce score est un signal de référence issu d’indicateurs publics, pas un conseil en investissement. Toutes les décisions et la responsabilité vous appartiennent.'
    },
    de: {
      title: 'Chainlink Angst- & Gier-Index & Kaufzeitpunkt-Score',
      intro: 'Ein kostenloses Dashboard, das 7 Echtzeit-Indikatoren — inkl. Chainlink Angst- & Gier-Index — zu einem 0–100-Score „Ist jetzt ein guter Kaufzeitpunkt?“ zusammenführt. Läuft im Browser ohne Installation, in 13 Sprachen.',
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
        { q: 'Soll ich Chainlink kaufen, wenn der Index niedrig ist?', a: 'Extreme Angst war historisch oft eine Akkumulationschance, doch sich allein auf den Index zu verlassen, birgt das Risiko, „ins fallende Messer zu greifen“. Dieser Score gewichtet auch RSI, MACD, Mayer-Multiple, Rückgang und MA-Kreuzungen und senkt den Wert in Abwärtstrends konservativ.' },
        { q: 'Wie wird der Kaufzeitpunkt-Score berechnet?', a: 'Jeder der 7 Indikatoren wird in einen 0–100-Teil-Score umgerechnet und gewichtet. Das Ergebnis ist 0–100, in 5 Bändern dargestellt.' },
        { q: 'Ist es kostenlos? Muss ich etwas installieren?', a: 'Es ist völlig kostenlos und ohne Installation. Echtzeitdaten stammen aus den öffentlichen APIs von CoinGecko, Binance und Alternative.me.' },
        { q: 'Wie unterscheidet sich der Index vom Kaufzeitpunkt-Score?', a: 'Der Index ist eine einzelne Stimmungskennzahl (0–100); der Kaufzeitpunkt-Score ist ein Verbund aus 7 Indikatoren inkl. Index (0–100).' },
        { q: 'Woher stammen die Daten und wie oft werden sie aktualisiert?', a: 'Der Angst- & Gier-Index stammt von Alternative.me, Preise und Tageskerzen von den öffentlichen APIs von CoinGecko und Binance, On-Chain-Metriken von CoinMetrics. Der Bildschirm aktualisiert sich etwa jede Minute automatisch.' },
        { q: 'Sollte ich Chainlink jetzt kaufen?', a: 'Eine eindeutige Antwort gibt es nicht, aber der Kaufzeitpunkt-Score (0–100) zeigt objektiv, ob der Markt in einer überverkauften Angst-Zone oder einer überhitzten Gier-Zone steckt. Auf dem Langfrist-Tab (antizyklisch) markieren hohe Werte Zonen, in denen Angst und Unterbewertung zusammenfallen — historisch günstig für DCA —, niedrige warnen vor Überhitzung. Ein Referenzsignal, keine Anlageberatung.' },
        { q: 'Wie unterscheiden sich kurz- und langfristiges Kauftiming?', a: 'Der Score ist in zwei Tabs geteilt. Kurzfristig (Momentum) folgt einer Trendfolge-Sicht von 1–3 Monaten und steigt mit starken Aufwärtstrends; langfristig (antizyklisch) folgt einer Zyklus-Sicht von über einem Jahr und steigt mit Angst und Unterbewertung. In Backtests seit 2017 funktionierte kurzfristig Momentum und langfristig die antizyklische Richtung besser.' },
        { q: 'Was ist der BOTTOM RADAR (Boden-Score)?', a: 'Eine Zusatzanzeige, die mit On-Chain-Metriken wie den MVRV Z-Score misst, wo die Marktkapitalisierung relativ zum durchschnittlichen Einstandskurs der Anleger liegt, und die Nähe zu historischen Bodenzonen auf einer Skala von 0–100 zeigt. Die vollständige Berechnung ist auf der Seite „Bitcoin-Boden“ veröffentlicht.' }
      ],
      disclaimer: '⚠ Dieser Score ist ein Referenzsignal aus öffentlichen Indikatoren, keine Anlageberatung. Alle Entscheidungen und die Verantwortung liegen bei Ihnen.'
    },
    it: {
      title: 'Indice di paura e avidità Chainlink e punteggio di timing d’acquisto',
      intro: 'Una dashboard gratuita che sintetizza 7 indicatori in tempo reale — incluso l’indice di paura e avidità di Chainlink — in un punteggio 0–100 «è il momento giusto per comprare?». Funziona nel browser senza installazione, in 13 lingue.',
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
        { q: 'Dovrei comprare Chainlink quando l’indice è basso?', a: 'La paura estrema è stata spesso un’occasione di accumulo, ma affidarsi solo all’indice rischia di «prendere un coltello che cade». Questo punteggio pesa anche RSI, MACD, multiplo di Mayer, ribasso e incroci di medie, e lo riduce in modo prudente nei trend ribassisti.' },
        { q: 'Come si calcola il punteggio d’acquisto?', a: 'Ciascuno dei 7 indicatori è convertito in un sotto-punteggio 0–100 e ponderato. Il risultato è 0–100, mostrato in 5 bande.' },
        { q: 'È gratis? Serve installare qualcosa?', a: 'È completamente gratis e senza installazione. I dati in tempo reale provengono dalle API pubbliche di CoinGecko, Binance e Alternative.me.' },
        { q: 'Che differenza c’è tra l’indice e il punteggio d’acquisto?', a: 'L’indice è una singola misura di sentiment (0–100); il punteggio d’acquisto è un composito dei 7 indicatori incluso l’indice (0–100).' },
        { q: 'Da dove vengono i dati e con che frequenza si aggiornano?', a: 'L’indice di paura e avidità viene da Alternative.me; prezzi e candele giornaliere dalle API pubbliche di CoinGecko e Binance; le metriche on-chain da CoinMetrics. Lo schermo si aggiorna automaticamente circa ogni minuto.' },
        { q: 'Dovrei comprare Chainlink adesso?', a: 'Non c’è una risposta unica, ma il punteggio d’acquisto (0–100) permette di valutare oggettivamente se il mercato è in zona ipervenduto/paura o surriscaldato/avidità. Nella scheda a lungo termine (contrarian), punteggi alti indicano zone in cui paura e sottovalutazione coincidono — storicamente favorevoli al PAC — mentre punteggi bassi avvertono del surriscaldamento. È un segnale di riferimento, non consulenza d’investimento.' },
        { q: 'Che differenza c’è tra timing a breve e a lungo termine?', a: 'Il punteggio è diviso in due schede. Il breve termine (momentum) adotta una visione trend-following di 1–3 mesi e sale con trend rialzisti forti; il lungo termine (contrarian) adotta una visione di ciclo oltre l’anno e sale con paura e sottovalutazione. Nei backtest dal 2017, il momentum ha funzionato meglio nel breve e il contrarian nel lungo.' },
        { q: 'Cos’è il BOTTOM RADAR (punteggio di minimo)?', a: 'Un indicatore ausiliario che usa metriche on-chain come l’MVRV Z-Score per misurare dove si trova la capitalizzazione rispetto al costo medio degli investitori, mostrando la vicinanza alle zone di minimo storiche su una scala 0–100. Il calcolo completo è pubblicato nella guida «minimo di Bitcoin».' }
      ],
      disclaimer: '⚠ Questo punteggio è un segnale di riferimento da indicatori pubblici, non consulenza d’investimento. Ogni decisione e responsabilità è tua.'
    },
    pt: {
      title: 'Índice de medo e ganância do Chainlink e pontuação de momento de compra',
      intro: 'Um painel gratuito que sintetiza 7 indicadores em tempo real — incluindo o índice de medo e ganância do Chainlink — numa pontuação de 0 a 100 «é uma boa hora para comprar?». Roda no navegador sem instalação, em 13 idiomas.',
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
        { q: 'Devo comprar Chainlink quando o índice está baixo?', a: 'O medo extremo foi muitas vezes uma oportunidade de acumulação, mas confiar só no índice arrisca «pegar uma faca caindo». Esta pontuação também pondera RSI, MACD, múltiplo de Mayer, queda e cruzamentos de médias, e a reduz de forma conservadora em tendências de baixa.' },
        { q: 'Como a pontuação de compra é calculada?', a: 'Cada um dos 7 indicadores é convertido numa subpontuação de 0 a 100 e ponderado. O resultado é 0–100, em 5 faixas.' },
        { q: 'É grátis? Preciso instalar algo?', a: 'É totalmente grátis e sem instalação. Os dados em tempo real vêm das APIs públicas da CoinGecko, Binance e Alternative.me.' },
        { q: 'Qual a diferença entre o índice e a pontuação de compra?', a: 'O índice é uma única métrica de sentimento (0–100); a pontuação de compra é um composto de 7 indicadores incluindo o índice (0–100).' },
        { q: 'De onde vêm os dados e com que frequência são atualizados?', a: 'O índice de medo e ganância vem da Alternative.me; preços e velas diárias, das APIs públicas da CoinGecko e da Binance; e as métricas on-chain, da CoinMetrics. A tela atualiza automaticamente a cada minuto, aproximadamente.' },
        { q: 'Devo comprar Chainlink agora?', a: 'Não há resposta única, mas a pontuação de compra (0–100) permite avaliar objetivamente se o mercado está em zona de sobrevenda/medo ou de superaquecimento/ganância. Na aba de longo prazo (contrária), pontuações altas marcam zonas onde medo e subvalorização coincidem — historicamente favoráveis ao DCA —, e as baixas alertam para superaquecimento. É um sinal de referência, não consultoria de investimento.' },
        { q: 'Qual a diferença entre o timing de curto e de longo prazo?', a: 'A pontuação divide-se em duas abas. O curto prazo (momentum) adota uma visão de seguimento de tendência de 1–3 meses e sobe com tendências de alta fortes; o longo prazo (contrário) adota uma visão de ciclo de mais de um ano e sobe com medo e subvalorização. Em backtests desde 2017, o momentum funcionou melhor no curto e o contrário no longo.' },
        { q: 'O que é o BOTTOM RADAR (pontuação de fundo)?', a: 'Um medidor auxiliar que usa métricas on-chain como o MVRV Z-Score para medir onde a capitalização está em relação ao custo médio dos investidores, mostrando a proximidade de zonas de fundo históricas numa escala de 0 a 100. O cálculo completo está publicado no guia «fundo do Bitcoin».' }
      ],
      disclaimer: '⚠ Esta pontuação é um sinal de referência a partir de indicadores públicos, não é consultoria de investimento. Todas as decisões e a responsabilidade são suas.'
    },
    ru: {
      title: 'Индекс страха и жадности чейнлинка и оценка времени покупки',
      intro: 'Бесплатная панель, которая объединяет 7 индикаторов в реальном времени — включая индекс страха и жадности чейнлинка — в оценку от 0 до 100 «подходящее ли сейчас время для покупки?». Работает в браузере без установки, на 13 языках.',
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
        { q: 'Покупать ли чейнлинк, когда индекс низкий?', a: 'Крайний страх исторически часто был возможностью накопления, но полагаться только на индекс рискованно — можно «поймать падающий нож». Эта оценка также учитывает RSI, MACD, множитель Майера, просадку и пересечения средних и консервативно снижается в нисходящих трендах.' },
        { q: 'Как рассчитывается оценка покупки?', a: 'Каждый из 7 индикаторов переводится в частную оценку 0–100 и взвешивается. Результат — 0–100, в 5 диапазонах.' },
        { q: 'Это бесплатно? Нужно ли что-то устанавливать?', a: 'Полностью бесплатно и без установки. Данные в реальном времени берутся из публичных API CoinGecko, Binance и Alternative.me.' },
        { q: 'Чем индекс отличается от оценки покупки?', a: 'Индекс — одна метрика настроения (0–100); оценка покупки — составной показатель из 7 индикаторов, включая индекс (0–100).' },
        { q: 'Откуда берутся данные и как часто они обновляются?', a: 'Индекс страха и жадности — с Alternative.me; цены и дневные свечи — из публичных API CoinGecko и Binance; ончейн-метрики — из CoinMetrics. Экран автоматически обновляется примерно раз в минуту.' },
        { q: 'Стоит ли покупать чейнлинк прямо сейчас?', a: 'Единственно верного ответа нет, но оценка покупки (0–100) объективно показывает, находится ли рынок в зоне перепроданности/страха или перегрева/жадности. На вкладке долгосрочного (контртрендового) взгляда высокие значения отмечают зоны, где совпадают страх и недооценка — исторически благоприятные для усреднения, — а низкие предупреждают о перегреве. Это справочный сигнал, а не инвестиционная рекомендация.' },
        { q: 'Чем отличаются краткосрочный и долгосрочный тайминг?', a: 'Оценка разделена на две вкладки. Краткосрочная (моментум) использует трендследящий взгляд на 1–3 месяца и растёт при сильных восходящих трендах; долгосрочная (контртренд) — циклический взгляд от года и растёт при страхе и недооценке. В бэктестах с 2017 года на коротком горизонте лучше работал моментум, на длинном — контртренд.' },
        { q: 'Что такое BOTTOM RADAR (оценка дна)?', a: 'Вспомогательный индикатор, который с помощью ончейн-метрик, таких как MVRV Z-оценка, измеряет положение капитализации относительно средней цены входа инвесторов и показывает близость к историческим зонам дна по шкале 0–100. Полный расчёт опубликован на странице «дно биткоина».' }
      ],
      disclaimer: '⚠ Эта оценка — справочный сигнал на основе публичных индикаторов, а не инвестиционная рекомендация. Все решения и ответственность — на вас.'
    },
    nl: {
      title: 'Chainlink Angst- & Hebzucht-index en koopmoment-score',
      intro: 'Een gratis dashboard dat 7 realtime indicatoren — inclusief de Chainlink Angst- & Hebzucht-index — samenvoegt tot een score van 0–100 voor «is het nu een goed moment om te kopen?». Draait in de browser zonder installatie, in 13 talen.',
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
        { q: 'Moet ik Chainlink kopen als de index laag is?', a: 'Extreme angst was vaak een accumulatiekans, maar alleen op de index vertrouwen riskeert «een vallend mes te vangen». Deze score weegt ook RSI, MACD, Mayer Multiple, daling en gemiddelde-kruisingen mee, en verlaagt de score behoudend in dalende trends.' },
        { q: 'Hoe wordt de koopmoment-score berekend?', a: 'Elk van de 7 indicatoren wordt omgezet naar een deelscore van 0–100 en gewogen. Het resultaat is 0–100, in 5 banden.' },
        { q: 'Is het gratis? Moet ik iets installeren?', a: 'Het is volledig gratis en zonder installatie. Realtime data komt van de publieke API’s van CoinGecko, Binance en Alternative.me.' },
        { q: 'Wat is het verschil tussen de index en de koopmoment-score?', a: 'De index is één sentimentmaatstaf (0–100); de koopmoment-score is een samenstelling van 7 indicatoren inclusief de index (0–100).' },
        { q: 'Waar komen de gegevens vandaan en hoe vaak worden ze ververst?', a: 'De Angst- & Hebzucht-index komt van Alternative.me; prijzen en dagcandles van de publieke API’s van CoinGecko en Binance; on-chain-metrieken van CoinMetrics. Het scherm ververst ongeveer elke minuut automatisch.' },
        { q: 'Moet ik nu Chainlink kopen?', a: 'Er is geen eenduidig antwoord, maar de koopmoment-score (0–100) geeft een objectief beeld of de markt in een oversold/angst-zone of een oververhitte/hebzucht-zone zit. Op het langetermijn-tabblad (tegendraads) markeren hoge scores zones waar angst en onderwaardering samenvallen — historisch gunstig voor DCA — terwijl lage scores waarschuwen voor oververhitting. Het is een referentiesignaal, geen beleggingsadvies.' },
        { q: 'Hoe verschillen korte- en langetermijn-kooptiming?', a: 'De score is verdeeld over twee tabbladen. Korte termijn (momentum) hanteert een trendvolgende blik van 1–3 maanden en stijgt bij sterke opwaartse trends; lange termijn (tegendraads) hanteert een cyclusblik van ruim een jaar en stijgt bij angst en onderwaardering. In backtests sinds 2017 werkte momentum beter op korte termijn en tegendraads beter op lange termijn.' },
        { q: 'Wat is de BOTTOM RADAR (bodemscore)?', a: 'Een hulpmeter die met on-chain-metrieken zoals de MVRV Z-score meet waar de marktkapitalisatie staat ten opzichte van de gemiddelde kostprijs van beleggers, en de nabijheid van historische bodemzones toont op een schaal van 0–100. De volledige berekening staat op de pagina «Bitcoin-bodem».' }
      ],
      disclaimer: '⚠ Deze score is een referentiesignaal uit publieke indicatoren, geen beleggingsadvies. Alle beslissingen en verantwoordelijkheid zijn van uzelf.'
    },
    th: {
      title: 'ดัชนีความกลัวและความโลภเชนลิงก์ และคะแนนจังหวะซื้อ',
      intro: 'แดชบอร์ดฟรีที่รวม 7 ตัวชี้วัดแบบเรียลไทม์ — รวมถึงดัชนีความกลัวและความโลภของเชนลิงก์ — เป็นคะแนน 0–100 ว่า “ตอนนี้เป็นจังหวะซื้อหรือไม่?” ใช้งานในเบราว์เซอร์ได้ทันที ไม่ต้องติดตั้ง รองรับ 13 ภาษา',
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
        { q: 'ถ้าดัชนีต่ำควรซื้อเชนลิงก์ไหม?', a: 'ความกลัวสุดขีดในอดีตมักเป็นโอกาสทยอยซื้อ แต่ดูเพียงดัชนีอย่างเดียวเสี่ยง “รับมีดที่กำลังตก” คะแนนนี้ยังพิจารณา RSI, MACD, Mayer Multiple, การย่อ และการตัดกันของเส้นเฉลี่ย และลดคะแนนอย่างระมัดระวังในแนวโน้มขาลง' },
        { q: 'คะแนนจังหวะซื้อคำนวณอย่างไร?', a: 'แปลงแต่ละตัวชี้วัดทั้ง 7 เป็นคะแนนย่อย 0–100 แล้วถ่วงน้ำหนักรวมกัน ผลลัพธ์คือ 0–100 แสดงเป็น 5 ระดับ' },
        { q: 'ฟรีไหม? ต้องติดตั้งไหม?', a: 'ฟรีทั้งหมดและไม่ต้องติดตั้ง ข้อมูลเรียลไทม์มาจาก API สาธารณะของ CoinGecko, Binance และ Alternative.me' },
        { q: 'ดัชนีกับคะแนนจังหวะซื้อต่างกันอย่างไร?', a: 'ดัชนีเป็นตัวชี้วัดอารมณ์เดียว (0–100); คะแนนจังหวะซื้อเป็นคะแนนรวมจาก 7 ตัวชี้วัดรวมถึงดัชนี (0–100)' },
        { q: 'ข้อมูลมาจากไหน อัปเดตบ่อยแค่ไหน?', a: 'ดัชนีความกลัว-ความโลภมาจาก Alternative.me ราคาและแท่งเทียนรายวันมาจาก API สาธารณะของ CoinGecko และ Binance ส่วนตัวชี้วัดออนเชนมาจาก CoinMetrics หน้าจออัปเดตอัตโนมัติราวทุก 1 นาที' },
        { q: 'ตอนนี้ควรซื้อเชนลิงก์ไหม?', a: 'ไม่มีคำตอบตายตัว แต่คะแนนจังหวะซื้อ (0–100) ช่วยประเมินอย่างเป็นกลางว่าตลาดอยู่ในโซนขายมากเกิน/ความกลัว หรือโซนร้อนแรง/ความโลภ ในแท็บระยะยาว (สวนตลาด) คะแนนยิ่งสูงหมายถึงโซนที่ความกลัวและราคาต่ำกว่ามูลค่าทับซ้อนกัน ซึ่งในอดีตเอื้อต่อ DCA ส่วนคะแนนต่ำเตือนถึงความร้อนแรง เป็นเพียงสัญญาณอ้างอิง ไม่ใช่คำแนะนำการลงทุน' },
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
  /* 푸터 설명 문단(.foot-desc) — 체인링크 언급이 있어 공통 foot-i18n.js 가 아니라 여기에 둔다 */
  var FOOT_DESC = {
    ko: 'broodev는 설치 없이 브라우저에서 바로 쓰는 무료 웹앱을 만드는 앱 포트폴리오입니다. 이 페이지의 체인링크 공포·탐욕 지수와 매수 타이밍 점수는 공개 지표를 합성한 참고 정보이며 투자 자문이 아닙니다. 광고는 Google AdSense를 통해 게재될 수 있습니다.',
    en: 'broodev is a portfolio of free web apps that run right in your browser with no install. The Chainlink Fear & Greed Index and buy-timing score on this page are reference information synthesized from public indicators, not investment advice. Ads may be served through Google AdSense.',
    ja: 'broodevは、インストール不要でブラウザからすぐ使える無料Webアプリを作るアプリポートフォリオです。このページのチェーンリンク恐怖・強欲指数と買い時スコアは公開指標を合成した参考情報であり、投資助言ではありません。広告はGoogle AdSenseを通じて掲載される場合があります。',
    zh: 'broodev 是一个应用作品集，制作无需安装、在浏览器中即可直接使用的免费网页应用。本页的Chainlink恐惧与贪婪指数和买入时机评分是综合公开指标得出的参考信息，不构成投资建议。广告可能通过 Google AdSense 投放。',
    'zh-Hant': 'broodev 是一個應用作品集，製作無需安裝、在瀏覽器中即可直接使用的免費網頁應用。本頁的Chainlink恐懼與貪婪指數和買入時機評分是綜合公開指標得出的參考資訊，不構成投資建議。廣告可能透過 Google AdSense 刊登。',
    th: 'broodev คือพอร์ตโฟลิโอแอปที่สร้างเว็บแอปฟรีซึ่งใช้งานได้ทันทีในเบราว์เซอร์โดยไม่ต้องติดตั้ง ดัชนีความกลัว-ความโลภเชนลิงก์และคะแนนจังหวะซื้อในหน้านี้เป็นข้อมูลอ้างอิงที่สังเคราะห์จากตัวชี้วัดสาธารณะ ไม่ใช่คำแนะนำการลงทุน โฆษณาอาจแสดงผ่าน Google AdSense',
    es: 'broodev es un portafolio de aplicaciones web gratuitas que funcionan directamente en el navegador, sin instalación. El Índice de Miedo y Codicia de Chainlink y la puntuación de momento de compra de esta página son información de referencia elaborada a partir de indicadores públicos, no asesoramiento de inversión. Los anuncios pueden mostrarse a través de Google AdSense.',
    fr: 'broodev est un portfolio d’applications web gratuites qui s’utilisent directement dans le navigateur, sans installation. L’indice Peur & Avidité du Chainlink et le score de timing d’achat de cette page sont des informations de référence issues d’indicateurs publics, et non un conseil en investissement. Des annonces peuvent être diffusées via Google AdSense.',
    de: 'broodev ist ein Portfolio kostenloser Web-Apps, die ohne Installation direkt im Browser laufen. Der Chainlink-Angst-und-Gier-Index und der Kauf-Timing-Score auf dieser Seite sind aus öffentlichen Indikatoren zusammengesetzte Referenzinformationen und keine Anlageberatung. Werbung kann über Google AdSense ausgeliefert werden.',
    it: 'broodev è un portfolio di web app gratuite che funzionano direttamente nel browser, senza installazione. L’Indice di Paura e Avidità di Chainlink e il punteggio di timing d’acquisto in questa pagina sono informazioni di riferimento ricavate da indicatori pubblici, non una consulenza di investimento. Gli annunci possono essere pubblicati tramite Google AdSense.',
    pt: 'O broodev é um portefólio de aplicações web gratuitas que funcionam diretamente no navegador, sem instalação. O Índice de Medo e Ganância do Chainlink e a pontuação de momento de compra desta página são informação de referência sintetizada a partir de indicadores públicos, não aconselhamento de investimento. Os anúncios podem ser apresentados através do Google AdSense.',
    ru: 'broodev — это портфолио бесплатных веб-приложений, которые работают прямо в браузере без установки. Индекс страха и жадности чейнлинка и оценка момента покупки на этой странице — справочная информация, собранная из открытых индикаторов, а не инвестиционная рекомендация. Реклама может показываться через Google AdSense.',
    nl: 'broodev is een portfolio van gratis webapps die zonder installatie direct in je browser werken. De Chainlink Angst- en Hebzuchtindex en de koop-timingscore op deze pagina zijn referentie-informatie samengesteld uit openbare indicatoren, geen beleggingsadvies. Advertenties kunnen via Google AdSense worden getoond.'
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
    "title": "How to Read the Chainlink (LINK) Buy-Timing Score",
    "intro": "The Chainlink (LINK) page uses LINK’s price and on-chain data to calculate RSI(14), MACD(12·26·9), the Fear & Greed Index, the Mayer Multiple, drawdown from the 365-day high, the 50/200 golden/death cross and the MVRV Z-Score, then combines them into one 0–100 score. The score falls into five zones — STRONG BUY, ACCUMULATE, NEUTRAL, CAUTION and OVERHEATED — and is free to view with nothing to install. Because LINK is an oracle token, a few of these indicators need to be read differently than on Bitcoin.",
    "coinH": "What is Chainlink (LINK)?",
    "coinP": [
     "Chainlink is a decentralized oracle network that delivers off-chain data, such as asset prices or event outcomes, to smart contracts. It was built by SmartContract, the company founded by Sergey Nazarov and Steve Ellis; after a 2017 white paper and token sale, it went live on Ethereum mainnet in May 2019. Its best-known product is Price Feeds, which DeFi lending and derivatives protocols use to value collateral.",
     "LINK is not the coin of its own blockchain but an ERC-677 token (an extension of ERC-20) issued on Ethereum, so it has no consensus mechanism of its own such as proof of work or proof of stake. It is used to pay oracle node operators and for staking, and total supply is fixed at 1 billion. At the token sale, 35% went to sale buyers, 35% to node operators and ecosystem incentives, and 30% to the company. Staking launched in December 2022, and CCIP, a protocol for cross-chain messages and token transfers, went live on mainnet in 2023."
    ],
    "applyH": "Applying the indicators to Chainlink",
    "apply": [
     "LINK tends to move with Ethereum and the DeFi sector, so there are stretches when ETH and DeFi tokens matter more to it than BTC does. An RSI of 30 means more when you also check whether the whole sector is weak.",
     "The Fear & Greed Index does not measure Chainlink sentiment. It is Alternative.me’s market-wide index, driven mostly by BTC, so LINK-only news such as a major partnership or a CCIP announcement does not show up in it.",
     "The MVRV Z-Score is shown because CoinMetrics has data for LINK. However, tokens held back for the company and the ecosystem have been released to the market over time, steadily raising circulating supply, and that supply change can blur how the realized cap is read.",
     "After its May 2021 peak, LINK spent long periods with a 365-day drawdown well beyond -50%. Reading Bitcoin-derived drawdown levels (-30%/-50%) and Mayer Multiple thresholds (0.8/2.4) as bottom signals can lead to calls that are too early.",
     "The score uses only LINK’s dollar price; relative prices such as LINK/BTC or LINK/ETH are not calculated. When the whole market is rising, the short-term (momentum) score can be high even if LINK is lagging other coins."
    ],
    "histH": "Chainlink price cycles at a glance",
    "hist": [
     "2017 — Raised about $32 million in its September token sale (ICO).",
     "2019 — After the May Ethereum mainnet launch, the price multiplied several times over by summer and drew wide attention.",
     "2020 — Demand for price feeds grew with the DeFi boom, and LINK set a run of then-record highs in August.",
     "2021 — Hit its all-time high above $50 in May.",
     "2022 — Fell more than 80% from the peak in the bear market; staking (v0.1) launched in December."
    ],
    "faq": [
     {
      "q": "Is there a separate Fear & Greed Index for Chainlink?",
      "a": "No. The Fear & Greed Index on this page is Alternative.me’s reading for the whole crypto market, and there is no LINK-only version. To see how LINK itself is behaving, look at the indicators calculated directly from LINK’s price on the same page, such as RSI, MACD and the 50/200 cross."
     },
     {
      "q": "Does Chainlink get an MVRV Z-Score too?",
      "a": "Yes. CoinMetrics’ public data includes LINK, so it can be calculated. Since LINK is an Ethereum token, the value is based on the movement history of LINK tokens on Ethereum. If the data is temporarily missing, the card shows N/A and the score is calculated from the other indicators."
     },
     {
      "q": "Should I buy Chainlink now?",
      "a": "This page does not make that call for you. The score summarizes whether the indicators lean toward oversold or overheated by historical standards. The short-term (momentum) tab rises with trend strength and the long-term (contrarian) tab rises with fear and drawdown, so when the two tabs point in different directions, it pays not to rush to a conclusion."
     },
     {
      "q": "Does the Chainlink score include fundamentals such as oracle usage?",
      "a": "No. The score uses only technical indicators calculated from LINK’s price, the market-wide Fear & Greed Index and CoinMetrics’ MVRV. Usage metrics such as the number of price feeds, CCIP volume or the size of staking are not included, so check them separately if you need them."
     },
     {
      "q": "If total supply is fixed at 1 billion, can I ignore supply growth?",
      "a": "Total supply is fixed, but circulating supply is not. When reserved tokens reach the market, circulating supply rises, which can affect market cap and how MVRV is read. You can follow circulating supply on price-tracking sites or through on-chain wallet records."
     },
     {
      "q": "Which blockchains is Chainlink used on?",
      "a": "The LINK token was issued on Ethereum, but Chainlink’s oracle services run on many blockchains and layer-2 networks, and LINK can be bridged for use on other chains. Prices on this page are based on LINK’s dollar (USDT) price on exchanges."
     }
    ]
   },
   "ja": {
    "title": "チェーンリンク（LINK）買い時スコアの読み方",
    "intro": "チェーンリンク（LINK）の画面は、LINKの価格とオンチェーンデータからRSI(14)、MACD(12·26·9)、恐怖・強欲指数、Mayer Multiple、365日高値からの下落率、50/200ゴールデンクロス・デッドクロス、MVRV Z-Scoreを計算し、一つの0〜100スコアにまとめます。スコアはSTRONG BUY・ACCUMULATE・NEUTRAL・CAUTION・OVERHEATEDの5ゾーンに分かれ、インストール不要・無料で見られます。LINKはオラクルトークンという性格上、いくつかの指標はビットコインとは違う読み方が必要です。",
    "coinH": "チェーンリンク（LINK）とは？",
    "coinP": [
     "チェーンリンクは、資産価格やイベントの結果といったブロックチェーンの外にあるデータをスマートコントラクトに届ける分散型オラクルネットワークです。セルゲイ・ナザロフとスティーブ・エリスが設立したSmartContract社が開発し、2017年のホワイトペーパー公開とトークンセールを経て、2019年5月にイーサリアムのメインネットで稼働を始めました。代表的な用途は、DeFiのレンディングやデリバティブのプロトコルが担保価値の計算に使う価格フィード（Price Feeds）です。",
     "LINKは独自ブロックチェーンのコインではなく、イーサリアム上で発行されたERC-677トークン（ERC-20の拡張）なので、プルーフ・オブ・ワークやプルーフ・オブ・ステークのような独自のコンセンサス方式はありません。オラクルノード運営者への報酬支払いとステーキングに使われ、総発行量は10億枚で固定されています。トークンセール時には35%が販売分、35%がノード運営者とエコシステムへのインセンティブ、30%が会社分として配分されました。2022年12月にステーキングが始まり、2023年にはチェーン間のメッセージやトークン移転を担うプロトコルCCIPがメインネットで公開されました。"
    ],
    "applyH": "チェーンリンクに指標を当てはめるときの注意",
    "apply": [
     "LINKはイーサリアムやDeFiセクターと連動しやすく、BTCよりもETHやDeFiトークンの動きに大きく左右される時期があります。同じRSI 30でも、セクター全体が弱いかどうかを合わせて確認すると判断しやすくなります。",
     "恐怖・強欲指数はチェーンリンク固有のセンチメントを測るものではありません。Alternative.meの市場全体（BTC中心）の指数なので、大型提携やCCIP関連の発表といったLINKだけに関わるニュースはこの値に表れません。",
     "MVRV Z-ScoreはCoinMetricsにデータがあるため表示されます。ただし、会社やエコシステム向けに保管されていたトークンが時間とともに市場へ放出され流通量が増えてきたため、こうした供給の変化が実現時価総額の解釈に混ざることがあります。",
     "LINKは2021年5月の高値以降、365日下落率が-50%を大きく超える期間が長く続きました。ビットコイン由来の下落率（-30%・-50%）やMayer Multiple（0.8・2.4）の基準をそのまま底のシグナルとして読むと、判断が早すぎる可能性があります。",
     "スコアはドル建てのLINK価格だけを使い、LINK/BTCやLINK/ETHといった相対価格は計算しません。市場全体が上昇している局面では、LINKが他のコインより弱くても短期（モメンタム）スコアが高く出ることがあります。"
    ],
    "histH": "チェーンリンクの価格サイクル",
    "hist": [
     "2017年 — 9月のトークンセール（ICO）で約3,200万ドルを調達しました。",
     "2019年 — 5月のイーサリアムメインネット公開後、夏にかけて価格が数倍に跳ね上がり注目を集めました。",
     "2020年 — DeFiブームで価格フィードの需要が増え、8月には当時の最高値を次々と更新しました。",
     "2021年 — 5月に50ドルを超える史上最高値を付けました。",
     "2022年 — 弱気相場で高値から80%以上下落し、12月にステーキング（v0.1）が始まりました。"
    ],
    "faq": [
     {
      "q": "チェーンリンク専用の恐怖・強欲指数はありますか？",
      "a": "ありません。画面に出る恐怖・強欲指数はAlternative.meが暗号資産市場全体を対象に出している値で、LINK専用の版はありません。LINK自体の動きを見たいときは、同じ画面のRSI・MACD・50/200クロスのようにLINKの価格から直接計算する指標を確認してください。"
     },
     {
      "q": "チェーンリンクでもMVRV Z-Scoreは表示されますか？",
      "a": "はい。CoinMetricsの公開データにLINKが含まれているため計算できます。LINKはイーサリアムのトークンなので、この値はイーサリアム上でのLINKトークンの移動履歴に基づいています。データが一時的に欠けるとカードはN/Aになり、スコアは残りの指標で計算されます。"
     },
     {
      "q": "今チェーンリンクを買ってもいいですか？",
      "a": "買うかどうかをこの画面が判断することはありません。スコアは、各指標が過去の基準で売られすぎ寄りか過熱寄りかを要約したものです。短期（モメンタム）タブはトレンドが強いほど、長期（逆張り）タブは恐怖と下落が大きいほど高くなるため、2つのタブが逆方向を示すときは結論を急がないほうが賢明です。"
     },
     {
      "q": "チェーンリンクのスコアにオラクル利用量などのファンダメンタルズは反映されますか？",
      "a": "いいえ。スコアに使うのは、LINKの価格から計算したテクニカル指標、市場全体の恐怖・強欲指数、CoinMetricsのMVRVだけです。価格フィードの数、CCIPの利用量、ステーキング規模といった利用指標は含まれないため、必要に応じて別途確認してください。"
     },
     {
      "q": "総発行量が10億枚で固定なら、供給の増加は気にしなくていいですか？",
      "a": "総量は固定ですが、流通量は固定ではありません。保管されていたトークンが市場に出ると流通量が増え、時価総額やMVRVの解釈に影響することがあります。流通量の推移は相場情報サイトの流通供給量の項目やオンチェーンのウォレット記録で確認できます。"
     },
     {
      "q": "チェーンリンクはどのブロックチェーンで使われていますか？",
      "a": "LINKトークンはイーサリアムで発行されましたが、チェーンリンクのオラクルサービスは多くのブロックチェーンやレイヤー2で提供されており、LINKもブリッジを通じて他のチェーンで使えます。この画面の価格は取引所でのLINKのドル（USDT）建て相場に基づいています。"
     }
    ]
   },
   "ko": {
    "title": "체인링크(LINK) 매수 타이밍 점수 읽는 법",
    "intro": "체인링크(LINK) 화면은 LINK 시세와 온체인 데이터로 RSI(14), MACD(12·26·9), 공포·탐욕 지수, Mayer Multiple, 365일 고점 대비 낙폭, 50/200 골든·데드 크로스, MVRV Z-Score를 계산해 하나의 0~100 점수로 묶습니다. 점수는 STRONG BUY·ACCUMULATE·NEUTRAL·CAUTION·OVERHEATED 다섯 구간으로 나뉘며, 따로 설치할 것 없이 무료로 볼 수 있습니다. 오라클 토큰이라는 LINK의 성격 때문에 몇몇 지표는 비트코인과 다르게 읽어야 합니다.",
    "coinH": "체인링크(LINK)란?",
    "coinP": [
     "체인링크는 자산 가격이나 이벤트 결과처럼 블록체인 밖에 있는 데이터를 스마트 컨트랙트에 전달하는 탈중앙 오라클 네트워크입니다. 세르게이 나자로프와 스티브 엘리스가 세운 SmartContract가 개발했고, 2017년 백서 발표와 토큰 판매를 거쳐 2019년 5월 이더리움 메인넷에서 서비스를 시작했습니다. 디파이(DeFi) 대출·파생상품 프로토콜이 담보 가치를 계산할 때 쓰는 가격 피드(Price Feeds)가 대표적인 용도입니다.",
     "LINK는 자체 블록체인의 코인이 아니라 이더리움 위에서 발행된 ERC-677 토큰(ERC-20 확장)이라, 작업증명이나 지분증명 같은 자체 합의 방식이 없습니다. 오라클 노드 운영자에게 지급하는 수수료와 스테이킹에 쓰이며, 총발행량은 10억 개로 고정돼 있습니다. 토큰 판매 당시 35%는 판매분, 35%는 노드 운영자·생태계 보상, 30%는 회사 몫으로 배분됐습니다. 2022년 12월 스테이킹이 시작됐고, 2023년에는 체인 간 메시지·토큰 전송 프로토콜인 CCIP가 메인넷에 출시됐습니다."
    ],
    "applyH": "체인링크에 지표를 적용할 때",
    "apply": [
     "LINK는 이더리움·디파이 업종과 함께 움직이는 경향이 있어, BTC보다 ETH와 디파이 토큰 흐름의 영향을 크게 받는 구간이 있습니다. 같은 RSI 30이라도 업종 전체가 약세인지 함께 확인하는 것이 좋습니다.",
     "공포·탐욕 지수는 체인링크만의 심리를 재지 않습니다. Alternative.me의 시장 전체(BTC 중심) 지수라서, 대형 제휴나 CCIP 관련 발표처럼 LINK에만 해당하는 소식은 이 값에 나타나지 않습니다.",
     "MVRV Z-Score는 CoinMetrics 데이터가 있어 표시됩니다. 다만 회사·생태계 몫으로 보관돼 있던 물량이 시간이 지나며 시장에 풀려 유통량이 늘어 왔으므로, 이런 공급 변화가 실현시가총액 해석에 섞일 수 있습니다.",
     "LINK는 2021년 5월 고점 이후 365일 낙폭이 -50%를 크게 넘는 기간이 길었습니다. 비트코인에서 나온 낙폭(-30%·-50%)과 Mayer Multiple(0.8·2.4) 기준을 그대로 바닥 신호로 읽으면 너무 이르게 판단할 수 있습니다.",
     "점수는 달러 기준 LINK 가격만 사용하며 LINK/BTC나 LINK/ETH 같은 상대 가격은 계산하지 않습니다. 시장 전체가 오를 때는 LINK가 다른 코인보다 약하더라도 단기(모멘텀) 점수가 높게 나올 수 있습니다."
    ],
    "histH": "체인링크 가격 사이클 요약",
    "hist": [
     "2017년 — 9월 토큰 판매(ICO)로 약 3,200만 달러를 모았습니다.",
     "2019년 — 5월 이더리움 메인넷 출시 후 여름까지 가격이 몇 배로 뛰며 시장의 주목을 받았습니다.",
     "2020년 — 디파이 붐으로 가격 피드 수요가 늘면서 8월 당시 사상 최고가를 연이어 경신했습니다.",
     "2021년 — 5월 50달러를 넘는 사상 최고가를 기록했습니다.",
     "2022년 — 약세장에서 고점 대비 80% 넘게 하락했고, 12월 스테이킹(v0.1)이 시작됐습니다."
    ],
    "faq": [
     {
      "q": "체인링크 공포·탐욕 지수가 따로 있나요?",
      "a": "따로 없습니다. 화면에 나오는 공포·탐욕 지수는 Alternative.me가 암호화폐 시장 전체를 대상으로 내는 값이고, LINK만을 위한 버전은 없습니다. LINK 자체의 움직임을 보려면 같은 화면의 RSI·MACD·50/200 크로스처럼 LINK 시세에서 직접 계산하는 지표를 보면 됩니다."
     },
     {
      "q": "체인링크에도 MVRV Z-Score가 나오나요?",
      "a": "네. CoinMetrics 공개 데이터에 LINK가 포함돼 있어 계산할 수 있습니다. LINK는 이더리움 토큰이므로 이 값은 이더리움 위 LINK 토큰의 이동 기록을 바탕으로 합니다. 데이터가 일시적으로 비면 카드가 N/A로 표시되고, 점수는 나머지 지표로 계산됩니다."
     },
     {
      "q": "지금 체인링크를 사도 되나요?",
      "a": "매수 여부는 이 화면이 판단해 드리지 않습니다. 점수는 여러 지표가 과거 기준으로 과매도 쪽인지 과열 쪽인지를 요약한 것입니다. 단기(모멘텀) 탭은 추세가 강할수록, 장기(역발상) 탭은 공포와 낙폭이 클수록 높게 나오므로, 두 탭이 서로 다른 방향을 가리킬 때는 결론을 서두르지 않는 편이 좋습니다."
     },
     {
      "q": "체인링크 점수에 오라클 사용량 같은 펀더멘털도 반영되나요?",
      "a": "아니요. 점수는 LINK 가격으로 계산한 기술 지표, 시장 전체 공포·탐욕 지수, CoinMetrics의 MVRV만 씁니다. 가격 피드 수, CCIP 이용량, 스테이킹 규모 같은 사용 지표는 반영하지 않으므로 필요하면 따로 확인해야 합니다."
     },
     {
      "q": "총발행량이 10억 개로 고정이면 공급 증가는 신경 쓰지 않아도 되나요?",
      "a": "총량은 고정이지만 유통량은 그렇지 않습니다. 보관 중이던 물량이 시장에 나오면 유통량이 늘고, 이는 시가총액과 MVRV 해석에 영향을 줄 수 있습니다. 유통량 변화는 시세 사이트의 유통 공급 항목이나 온체인 지갑 기록으로 확인할 수 있습니다."
     },
     {
      "q": "체인링크는 어느 블록체인에서 쓰이나요?",
      "a": "LINK 토큰은 이더리움에서 발행됐지만, 체인링크 오라클 서비스는 여러 블록체인과 레이어2에서 제공되며 LINK도 브리지를 거쳐 다른 체인에서 쓸 수 있습니다. 이 화면의 가격은 거래소의 LINK 달러(USDT) 시세 기준입니다."
     }
    ]
   },
   "zh": {
    "title": "如何解读Chainlink（LINK）买入时机评分",
    "intro": "Chainlink（LINK）页面利用LINK价格和链上数据计算RSI(14)、MACD(12·26·9)、恐惧与贪婪指数、Mayer Multiple、距365日高点回撤、50/200金叉·死叉和MVRV Z-Score，并合成为一个0~100的评分。评分分为STRONG BUY、ACCUMULATE、NEUTRAL、CAUTION、OVERHEATED五个区间，无需安装即可免费查看。由于LINK是预言机代币，其中几项指标的解读方式与比特币不同。",
    "coinH": "什么是Chainlink（LINK）？",
    "coinP": [
     "Chainlink是一个去中心化预言机网络，负责把资产价格、事件结果等区块链之外的数据传递给智能合约。它由谢尔盖·纳扎罗夫和史蒂夫·埃利斯创立的SmartContract公司开发，经过2017年发布白皮书和代币销售后，于2019年5月在以太坊主网上线。最具代表性的用途是价格喂价（Price Feeds），DeFi借贷和衍生品协议用它来计算抵押品价值。",
     "LINK不是某条独立区块链的原生币，而是在以太坊上发行的ERC-677代币（ERC-20的扩展），因此没有工作量证明或权益证明之类的自有共识机制。它用于向预言机节点运营者支付费用以及质押，总量固定为10亿枚。代币销售时，35%用于出售，35%用于节点运营者和生态激励，30%归公司所有。2022年12月推出质押，2023年用于跨链消息和代币转移的协议CCIP在主网上线。"
    ],
    "applyH": "将指标用于Chainlink时的注意事项",
    "apply": [
     "LINK往往与以太坊和DeFi板块同步波动，有些阶段受ETH和DeFi代币走势的影响比受BTC更大。同样是RSI 30，最好同时确认整个板块是否走弱。",
     "恐惧与贪婪指数并不衡量Chainlink自身的情绪。它是Alternative.me发布的全市场（以BTC为主）指数，大型合作、CCIP相关公告等只与LINK有关的消息不会体现在这个数值中。",
     "由于CoinMetrics有LINK的数据，因此可以显示MVRV Z-Score。但为公司和生态预留的代币随着时间陆续释放到市场，流通量一直在增加，这种供应变化可能会混入对已实现市值的解读。",
     "LINK在2021年5月见顶后，有很长一段时间365日回撤远超-50%。如果把源自比特币的回撤标准（-30%、-50%）和Mayer Multiple阈值（0.8、2.4）直接当作见底信号，可能会判断过早。",
     "评分只使用以美元计价的LINK价格，不计算LINK/BTC或LINK/ETH等相对价格。在整个市场上涨时，即使LINK比其他币种弱，短期（动量）评分也可能偏高。"
    ],
    "histH": "Chainlink价格周期回顾",
    "hist": [
     "2017年 — 9月通过代币销售（ICO）募集约3,200万美元。",
     "2019年 — 5月以太坊主网上线后，到夏季价格翻了数倍，引起市场关注。",
     "2020年 — DeFi热潮带动喂价需求增长，8月接连刷新当时的历史最高价。",
     "2021年 — 5月创下超过50美元的历史最高价。",
     "2022年 — 熊市中较高点下跌超过80%，12月推出质押（v0.1）。"
    ],
    "faq": [
     {
      "q": "Chainlink有单独的恐惧与贪婪指数吗？",
      "a": "没有。页面上显示的恐惧与贪婪指数是Alternative.me针对整个加密市场发布的数值，没有LINK专属版本。想了解LINK本身的走势，可以看同一页面上直接用LINK价格计算的指标，例如RSI、MACD和50/200交叉。"
     },
     {
      "q": "Chainlink也能显示MVRV Z-Score吗？",
      "a": "可以。CoinMetrics的公开数据包含LINK，因此可以计算。LINK是以太坊上的代币，所以这个数值基于以太坊上LINK代币的转移记录。数据暂时缺失时，卡片显示N/A，评分则用其余指标计算。"
     },
     {
      "q": "现在可以买Chainlink吗？",
      "a": "本页面不会替您做买入决定。评分概括的是各项指标按历史标准偏向超卖还是过热。短期（动量）标签趋势越强分数越高，长期（逆向）标签恐慌和回撤越大分数越高，两个标签方向相反时，不妨先别急着下结论。"
     },
     {
      "q": "Chainlink的评分会反映预言机使用量等基本面吗？",
      "a": "不会。评分只使用由LINK价格计算的技术指标、全市场恐惧与贪婪指数以及CoinMetrics的MVRV。喂价数量、CCIP使用量、质押规模等使用指标没有纳入，如有需要请另行查看。"
     },
     {
      "q": "总量固定为10亿枚，是否就不用担心供应增加？",
      "a": "总量固定，但流通量并不固定。预留的代币进入市场后流通量会增加，可能影响市值和MVRV的解读。流通量的变化可以在行情网站的流通供应量栏目或链上钱包记录中查看。"
     },
     {
      "q": "Chainlink在哪些区块链上使用？",
      "a": "LINK代币在以太坊上发行，但Chainlink的预言机服务覆盖多条区块链和二层网络，LINK也可以通过跨链桥在其他链上使用。本页面的价格以交易所LINK的美元（USDT）行情为准。"
     }
    ]
   },
   "zh-Hant": {
    "title": "如何解讀Chainlink（LINK）買入時機評分",
    "intro": "Chainlink（LINK）頁面利用LINK價格與鏈上資料計算RSI(14)、MACD(12·26·9)、恐懼與貪婪指數、Mayer Multiple、距365日高點回檔幅度、50/200黃金交叉·死亡交叉與MVRV Z-Score，並合成為一個0~100的評分。評分分為STRONG BUY、ACCUMULATE、NEUTRAL、CAUTION、OVERHEATED五個區間，不必安裝即可免費查看。由於LINK是預言機代幣，其中幾項指標的解讀方式與比特幣不同。",
    "coinH": "什麼是Chainlink（LINK）？",
    "coinP": [
     "Chainlink是一個去中心化預言機網路，負責把資產價格、事件結果等區塊鏈之外的資料傳遞給智慧合約。它由謝爾蓋·納扎羅夫與史蒂夫·埃利斯創立的SmartContract公司開發，經過2017年發布白皮書與代幣銷售後，於2019年5月在以太坊主網上線。最具代表性的用途是價格餵價（Price Feeds），DeFi借貸與衍生品協定用它來計算抵押品價值。",
     "LINK不是某條獨立區塊鏈的原生幣，而是在以太坊上發行的ERC-677代幣（ERC-20的擴充），因此沒有工作量證明或權益證明之類的自有共識機制。它用於向預言機節點營運者支付費用以及質押，總量固定為10億枚。代幣銷售時，35%用於出售，35%用於節點營運者與生態激勵，30%歸公司所有。2022年12月推出質押，2023年用於跨鏈訊息與代幣轉移的協定CCIP在主網上線。"
    ],
    "applyH": "將指標用於Chainlink時的注意事項",
    "apply": [
     "LINK往往與以太坊和DeFi板塊同步波動，有些階段受ETH和DeFi代幣走勢的影響比受BTC更大。同樣是RSI 30，最好同時確認整個板塊是否轉弱。",
     "恐懼與貪婪指數並不衡量Chainlink本身的情緒。它是Alternative.me發布的全市場（以BTC為主）指數，大型合作、CCIP相關公告等只與LINK有關的消息不會反映在這個數值中。",
     "由於CoinMetrics有LINK的資料，因此可以顯示MVRV Z-Score。但為公司與生態預留的代幣隨著時間陸續釋放到市場，流通量一直在增加，這種供給變化可能會混入對已實現市值的解讀。",
     "LINK在2021年5月見頂後，有很長一段時間365日回檔幅度遠超-50%。如果把源自比特幣的回檔標準（-30%、-50%）和Mayer Multiple門檻（0.8、2.4）直接當作見底訊號，可能會判斷過早。",
     "評分只使用以美元計價的LINK價格，不計算LINK/BTC或LINK/ETH等相對價格。在整個市場上漲時，即使LINK比其他幣種弱，短期（動能）評分也可能偏高。"
    ],
    "histH": "Chainlink價格週期回顧",
    "hist": [
     "2017年 — 9月透過代幣銷售（ICO）募集約3,200萬美元。",
     "2019年 — 5月以太坊主網上線後，到夏季價格翻了數倍，引起市場關注。",
     "2020年 — DeFi熱潮帶動餵價需求成長，8月接連刷新當時的歷史最高價。",
     "2021年 — 5月創下超過50美元的歷史最高價。",
     "2022年 — 熊市中較高點下跌超過80%，12月推出質押（v0.1）。"
    ],
    "faq": [
     {
      "q": "Chainlink有單獨的恐懼與貪婪指數嗎？",
      "a": "沒有。頁面上顯示的恐懼與貪婪指數是Alternative.me針對整個加密市場發布的數值，沒有LINK專屬版本。想了解LINK本身的走勢，可以看同一頁面上直接以LINK價格計算的指標，例如RSI、MACD與50/200交叉。"
     },
     {
      "q": "Chainlink也能顯示MVRV Z-Score嗎？",
      "a": "可以。CoinMetrics的公開資料包含LINK，因此可以計算。LINK是以太坊上的代幣，所以這個數值以以太坊上LINK代幣的轉移紀錄為基礎。資料暫時缺漏時，卡片顯示N/A，評分則以其餘指標計算。"
     },
     {
      "q": "現在可以買Chainlink嗎？",
      "a": "本頁面不會替您做買入決定。評分概括的是各項指標按歷史標準偏向超賣還是過熱。短期（動能）分頁趨勢越強分數越高，長期（逆勢）分頁恐慌與回檔越大分數越高，兩個分頁方向相反時，不妨先別急著下結論。"
     },
     {
      "q": "Chainlink的評分會反映預言機使用量等基本面嗎？",
      "a": "不會。評分只使用由LINK價格計算的技術指標、全市場恐懼與貪婪指數以及CoinMetrics的MVRV。餵價數量、CCIP使用量、質押規模等使用指標沒有納入，如有需要請另行查看。"
     },
     {
      "q": "總量固定為10億枚，是否就不必擔心供給增加？",
      "a": "總量固定，但流通量並不固定。預留的代幣進入市場後流通量會增加，可能影響市值與MVRV的解讀。流通量的變化可以在行情網站的流通供給量欄位或鏈上錢包紀錄中查看。"
     },
     {
      "q": "Chainlink在哪些區塊鏈上使用？",
      "a": "LINK代幣在以太坊上發行，但Chainlink的預言機服務涵蓋多條區塊鏈與第二層網路，LINK也可以透過跨鏈橋在其他鏈上使用。本頁面的價格以交易所LINK的美元（USDT）行情為準。"
     }
    ]
   },
   "th": {
    "title": "วิธีอ่านคะแนนจังหวะซื้อเชนลิงก์ (LINK)",
    "intro": "หน้าเชนลิงก์ (LINK) ใช้ราคา LINK และข้อมูลออนเชนคำนวณ RSI(14), MACD(12·26·9), ดัชนีความกลัวและความโลภ, Mayer Multiple, การย่อตัวจากจุดสูงสุด 365 วัน, โกลเดนครอส/เดธครอส 50/200 และ MVRV Z-Score แล้วรวมเป็นคะแนนเดียว 0–100 คะแนนแบ่งเป็น 5 โซน ได้แก่ STRONG BUY, ACCUMULATE, NEUTRAL, CAUTION และ OVERHEATED ดูได้ฟรีโดยไม่ต้องติดตั้งอะไร เนื่องจาก LINK เป็นโทเคนออราเคิล ตัวชี้วัดบางตัวจึงต้องอ่านต่างจากบิตคอยน์",
    "coinH": "เชนลิงก์ (LINK) คืออะไร?",
    "coinP": [
     "เชนลิงก์คือเครือข่ายออราเคิลแบบกระจายศูนย์ที่ส่งข้อมูลนอกบล็อกเชน เช่น ราคาสินทรัพย์หรือผลของเหตุการณ์ ไปให้สมาร์ตคอนแทรกต์ พัฒนาโดยบริษัท SmartContract ซึ่งก่อตั้งโดยเซอร์เกย์ นาซารอฟ และสตีฟ เอลลิส หลังเผยแพร่ไวต์เปเปอร์และขายโทเคนในปี 2017 ก็เริ่มให้บริการบนเมนเน็ตของอีเธอเรียมในเดือนพฤษภาคม 2019 การใช้งานที่รู้จักมากที่สุดคือ Price Feeds ที่โปรโตคอลกู้ยืมและอนุพันธ์ใน DeFi ใช้คำนวณมูลค่าหลักประกัน",
     "LINK ไม่ใช่เหรียญของบล็อกเชนตัวเอง แต่เป็นโทเคน ERC-677 (ส่วนขยายของ ERC-20) ที่ออกบนอีเธอเรียม จึงไม่มีกลไกฉันทามติของตัวเองอย่าง Proof of Work หรือ Proof of Stake ใช้จ่ายค่าตอบแทนให้ผู้ดูแลโหนดออราเคิลและใช้ในการสเตก อุปทานรวมคงที่ 1,000 ล้านโทเคน ตอนขายโทเคน 35% เป็นส่วนที่ขาย 35% เป็นรางวัลสำหรับผู้ดูแลโหนดและระบบนิเวศ และ 30% เป็นของบริษัท การสเตกเริ่มในเดือนธันวาคม 2022 และในปี 2023 โปรโตคอล CCIP สำหรับส่งข้อความและโอนโทเคนข้ามเชนได้เปิดใช้บนเมนเน็ต"
    ],
    "applyH": "ข้อควรรู้เมื่อใช้ตัวชี้วัดกับเชนลิงก์",
    "apply": [
     "LINK มักเคลื่อนไหวไปกับอีเธอเรียมและกลุ่ม DeFi บางช่วงจึงได้รับผลจากทิศทางของ ETH และโทเคน DeFi มากกว่า BTC แม้ RSI จะอยู่ที่ 30 เท่ากัน ก็ควรดูด้วยว่าทั้งกลุ่มกำลังอ่อนแรงหรือไม่",
     "ดัชนีความกลัวและความโลภไม่ได้วัดอารมณ์ตลาดของเชนลิงก์โดยเฉพาะ เป็นดัชนีทั้งตลาด (เน้น BTC) ของ Alternative.me ข่าวที่เกี่ยวกับ LINK เท่านั้น เช่น ความร่วมมือรายใหญ่หรือประกาศเกี่ยวกับ CCIP จึงไม่ปรากฏในค่านี้",
     "MVRV Z-Score แสดงได้เพราะ CoinMetrics มีข้อมูลของ LINK แต่โทเคนที่เก็บไว้เป็นส่วนของบริษัทและระบบนิเวศถูกปล่อยออกสู่ตลาดเรื่อย ๆ ทำให้อุปทานหมุนเวียนเพิ่มขึ้นตลอด การเปลี่ยนแปลงของอุปทานนี้อาจปะปนอยู่ในการตีความมูลค่าตลาดที่รับรู้แล้ว",
     "หลังจุดสูงสุดเดือนพฤษภาคม 2021 LINK มีช่วงเวลายาวนานที่การย่อตัวจากจุดสูงสุด 365 วันลึกเกิน -50% ไปมาก หากนำเกณฑ์การย่อตัว (-30%/-50%) และ Mayer Multiple (0.8/2.4) ที่มาจากบิตคอยน์มาอ่านเป็นสัญญาณจุดต่ำสุดตรง ๆ อาจตัดสินใจเร็วเกินไป",
     "คะแนนใช้เฉพาะราคา LINK ที่คิดเป็นดอลลาร์ ไม่ได้คำนวณราคาเทียบอย่าง LINK/BTC หรือ LINK/ETH เมื่อทั้งตลาดกำลังขึ้น คะแนนระยะสั้น (โมเมนตัม) อาจสูงได้แม้ LINK จะอ่อนกว่าเหรียญอื่น"
    ],
    "histH": "สรุปวัฏจักรราคาเชนลิงก์",
    "hist": [
     "2017 — ระดมทุนได้ราว 32 ล้านดอลลาร์จากการขายโทเคน (ICO) ในเดือนกันยายน",
     "2019 — หลังเปิดเมนเน็ตบนอีเธอเรียมในเดือนพฤษภาคม ราคาพุ่งขึ้นหลายเท่าภายในฤดูร้อนและเป็นที่จับตาของตลาด",
     "2020 — ความต้องการ Price Feeds เพิ่มขึ้นตามกระแส DeFi และในเดือนสิงหาคมราคาทำสถิติสูงสุดในเวลานั้นต่อเนื่องหลายครั้ง",
     "2021 — ทำจุดสูงสุดตลอดกาลเหนือ 50 ดอลลาร์ในเดือนพฤษภาคม",
     "2022 — ร่วงจากจุดสูงสุดมากกว่า 80% ในตลาดหมี และเริ่มการสเตก (v0.1) ในเดือนธันวาคม"
    ],
    "faq": [
     {
      "q": "เชนลิงก์มีดัชนีความกลัวและความโลภแยกต่างหากไหม?",
      "a": "ไม่มี ดัชนีความกลัวและความโลภในหน้านี้เป็นค่าที่ Alternative.me เผยแพร่สำหรับตลาดคริปโททั้งหมด ไม่มีเวอร์ชันสำหรับ LINK โดยเฉพาะ หากต้องการดูความเคลื่อนไหวของ LINK เอง ให้ดูตัวชี้วัดในหน้าเดียวกันที่คำนวณจากราคา LINK โดยตรง เช่น RSI, MACD และครอส 50/200"
     },
     {
      "q": "เชนลิงก์มี MVRV Z-Score ด้วยไหม?",
      "a": "มี ข้อมูลสาธารณะของ CoinMetrics ครอบคลุม LINK จึงคำนวณได้ เนื่องจาก LINK เป็นโทเคนบนอีเธอเรียม ค่านี้จึงอิงประวัติการเคลื่อนย้ายโทเคน LINK บนอีเธอเรียม หากข้อมูลขาดหายชั่วคราว การ์ดจะแสดง N/A และคะแนนจะคำนวณจากตัวชี้วัดที่เหลือ"
     },
     {
      "q": "ตอนนี้ควรซื้อเชนลิงก์ไหม?",
      "a": "หน้านี้ไม่ได้ตัดสินใจแทนคุณว่าควรซื้อหรือไม่ คะแนนเป็นการสรุปว่าตัวชี้วัดต่าง ๆ เอียงไปทางขายมากเกินหรือร้อนแรงเกินไปเมื่อเทียบกับเกณฑ์ในอดีต แท็บระยะสั้น (โมเมนตัม) จะสูงขึ้นเมื่อแนวโน้มแข็งแรง ส่วนแท็บระยะยาว (สวนกระแส) จะสูงขึ้นเมื่อความกลัวและการย่อตัวมาก เมื่อสองแท็บชี้คนละทาง อย่าเพิ่งรีบสรุป"
     },
     {
      "q": "คะแนนของเชนลิงก์รวมปัจจัยพื้นฐานอย่างปริมาณการใช้ออราเคิลด้วยไหม?",
      "a": "ไม่รวม คะแนนใช้เพียงตัวชี้วัดทางเทคนิคที่คำนวณจากราคา LINK ดัชนีความกลัวและความโลภของทั้งตลาด และ MVRV จาก CoinMetrics ตัวชี้วัดการใช้งาน เช่น จำนวน Price Feeds ปริมาณการใช้ CCIP หรือขนาดการสเตก ไม่ได้นำมาคิด หากต้องการควรตรวจสอบแยกต่างหาก"
     },
     {
      "q": "ถ้าอุปทานรวมคงที่ 1,000 ล้านโทเคน ก็ไม่ต้องสนใจการเพิ่มของอุปทานใช่ไหม?",
      "a": "อุปทานรวมคงที่ แต่อุปทานหมุนเวียนไม่คงที่ เมื่อโทเคนที่เก็บสำรองไว้เข้าสู่ตลาด อุปทานหมุนเวียนจะเพิ่มขึ้น ซึ่งอาจกระทบมูลค่าตลาดและการตีความ MVRV ติดตามการเปลี่ยนแปลงของอุปทานหมุนเวียนได้จากหัวข้ออุปทานหมุนเวียนบนเว็บไซต์ราคาคริปโทหรือบันทึกกระเป๋าเงินบนเชน"
     },
     {
      "q": "เชนลิงก์ใช้งานบนบล็อกเชนใดบ้าง?",
      "a": "โทเคน LINK ออกบนอีเธอเรียม แต่บริการออราเคิลของเชนลิงก์มีให้ใช้บนหลายบล็อกเชนและเลเยอร์ 2 และ LINK ก็ย้ายไปใช้บนเชนอื่นผ่านบริดจ์ได้ ราคาในหน้านี้อิงราคา LINK เป็นดอลลาร์ (USDT) บนกระดานเทรด"
     }
    ]
   },
   "es": {
    "title": "Cómo leer la puntuación de momento de compra de Chainlink (LINK)",
    "intro": "La página de Chainlink (LINK) usa el precio de LINK y datos on-chain para calcular el RSI(14), el MACD(12·26·9), el Índice de Miedo y Codicia, el Mayer Multiple, la caída desde el máximo de 365 días, el cruce dorado/de la muerte 50/200 y el MVRV Z-Score, y los combina en una sola puntuación de 0 a 100. La puntuación se divide en cinco zonas —STRONG BUY, ACCUMULATE, NEUTRAL, CAUTION y OVERHEATED— y se consulta gratis, sin instalar nada. Como LINK es un token de oráculos, algunos de estos indicadores deben leerse de forma distinta que en Bitcoin.",
    "coinH": "¿Qué es Chainlink (LINK)?",
    "coinP": [
     "Chainlink es una red descentralizada de oráculos que lleva a los contratos inteligentes datos que están fuera de la blockchain, como precios de activos o resultados de eventos. La desarrolló SmartContract, la empresa fundada por Sergey Nazarov y Steve Ellis; tras publicar su white paper y vender tokens en 2017, empezó a funcionar en la mainnet de Ethereum en mayo de 2019. Su producto más conocido son los Price Feeds, que los protocolos DeFi de préstamos y derivados usan para valorar las garantías.",
     "LINK no es la moneda de una blockchain propia, sino un token ERC-677 (una extensión de ERC-20) emitido en Ethereum, así que no tiene un mecanismo de consenso propio como la prueba de trabajo o la prueba de participación. Sirve para pagar a los operadores de nodos de oráculos y para el staking, y su suministro total está fijado en 1.000 millones. En la venta de tokens, el 35 % se destinó a los compradores, el 35 % a incentivos para operadores de nodos y el ecosistema, y el 30 % a la empresa. El staking llegó en diciembre de 2022, y en 2023 se lanzó en mainnet CCIP, un protocolo para mensajes y transferencias de tokens entre cadenas."
    ],
    "applyH": "Cómo aplicar los indicadores a Chainlink",
    "apply": [
     "LINK suele moverse junto a Ethereum y al sector DeFi, así que hay etapas en las que le influyen más ETH y los tokens DeFi que BTC. Un RSI de 30 se interpreta mejor si también se comprueba si todo el sector está débil.",
     "El Índice de Miedo y Codicia no mide el sentimiento sobre Chainlink. Es el índice de todo el mercado de Alternative.me, centrado en BTC, así que las noticias que solo afectan a LINK, como una gran alianza o un anuncio sobre CCIP, no aparecen en él.",
     "El MVRV Z-Score se muestra porque CoinMetrics tiene datos de LINK. Sin embargo, los tokens reservados para la empresa y el ecosistema se han ido liberando al mercado con el tiempo y la oferta circulante no ha dejado de crecer; ese cambio de oferta puede mezclarse en la lectura de la capitalización realizada.",
     "Tras el máximo de mayo de 2021, LINK pasó largos periodos con una caída desde el máximo de 365 días muy superior al -50 %. Leer como señales de suelo los niveles de caída (-30 %/-50 %) y los umbrales del Mayer Multiple (0,8/2,4) heredados de Bitcoin puede llevar a conclusiones prematuras.",
     "La puntuación solo usa el precio de LINK en dólares; no calcula precios relativos como LINK/BTC o LINK/ETH. Cuando todo el mercado sube, la puntuación de corto plazo (momentum) puede ser alta aunque LINK vaya por detrás de otras monedas."
    ],
    "histH": "Resumen de los ciclos de precio de Chainlink",
    "hist": [
     "2017 — Recaudó unos 32 millones de dólares en su venta de tokens (ICO) de septiembre.",
     "2019 — Tras el lanzamiento en la mainnet de Ethereum en mayo, el precio se multiplicó varias veces hasta el verano y atrajo la atención del mercado.",
     "2020 — La demanda de Price Feeds creció con el auge DeFi, y en agosto encadenó varios máximos históricos de aquel momento.",
     "2021 — Marcó su máximo histórico por encima de 50 dólares en mayo.",
     "2022 — Cayó más de un 80 % desde el máximo en el mercado bajista; en diciembre arrancó el staking (v0.1)."
    ],
    "faq": [
     {
      "q": "¿Existe un Índice de Miedo y Codicia propio de Chainlink?",
      "a": "No. El Índice de Miedo y Codicia de esta página es el valor que publica Alternative.me para todo el mercado cripto, y no hay una versión solo para LINK. Para ver cómo se comporta LINK en sí, mira los indicadores de la misma página calculados directamente con su precio, como el RSI, el MACD o el cruce 50/200."
     },
     {
      "q": "¿Chainlink también tiene MVRV Z-Score?",
      "a": "Sí. Los datos públicos de CoinMetrics incluyen LINK, así que se puede calcular. Como LINK es un token de Ethereum, el valor se basa en el historial de movimientos de los tokens LINK en Ethereum. Si faltan datos temporalmente, la tarjeta muestra N/A y la puntuación se calcula con los demás indicadores."
     },
     {
      "q": "¿Debería comprar Chainlink ahora?",
      "a": "Esta página no toma esa decisión por ti. La puntuación resume si los indicadores se inclinan hacia la sobreventa o el sobrecalentamiento según los estándares históricos. La pestaña de corto plazo (momentum) sube cuanto más fuerte es la tendencia y la de largo plazo (contraria) cuanto mayores son el miedo y la caída; cuando ambas apuntan en direcciones opuestas, conviene no precipitarse."
     },
     {
      "q": "¿La puntuación de Chainlink incluye fundamentales como el uso de los oráculos?",
      "a": "No. La puntuación usa solo indicadores técnicos calculados con el precio de LINK, el Índice de Miedo y Codicia de todo el mercado y el MVRV de CoinMetrics. Métricas de uso como el número de Price Feeds, el volumen de CCIP o el tamaño del staking no se incluyen, así que consúltalas por separado si las necesitas."
     },
     {
      "q": "Si el suministro total está fijado en 1.000 millones, ¿puedo ignorar el aumento de la oferta?",
      "a": "El total es fijo, pero la oferta circulante no. Cuando los tokens reservados llegan al mercado, la oferta circulante aumenta, y eso puede afectar a la capitalización y a la lectura del MVRV. Puedes seguir la oferta circulante en las webs de cotizaciones o en los registros on-chain de las carteras."
     },
     {
      "q": "¿En qué blockchains se usa Chainlink?",
      "a": "El token LINK se emitió en Ethereum, pero los servicios de oráculos de Chainlink funcionan en muchas blockchains y redes de capa 2, y LINK puede llevarse a otras cadenas mediante puentes. Los precios de esta página se basan en la cotización de LINK en dólares (USDT) en los exchanges."
     }
    ]
   },
   "fr": {
    "title": "Comment lire le score de timing d’achat de Chainlink (LINK)",
    "intro": "La page Chainlink (LINK) utilise le prix de LINK et des données on-chain pour calculer le RSI(14), le MACD(12·26·9), l’indice Peur et Avidité, le Mayer Multiple, la baisse depuis le plus haut sur 365 jours, le golden cross / death cross 50/200 et le MVRV Z-Score, puis les combine en un score unique de 0 à 100. Ce score se répartit en cinq zones — STRONG BUY, ACCUMULATE, NEUTRAL, CAUTION et OVERHEATED — et se consulte gratuitement, sans rien installer. LINK étant un jeton d’oracles, certains indicateurs se lisent autrement que sur Bitcoin.",
    "coinH": "Qu’est-ce que Chainlink (LINK) ?",
    "coinP": [
     "Chainlink est un réseau d’oracles décentralisé qui transmet aux smart contracts des données situées hors de la blockchain, comme le prix d’un actif ou le résultat d’un événement. Il a été développé par SmartContract, la société fondée par Sergey Nazarov et Steve Ellis ; après un livre blanc et une vente de jetons en 2017, il a été lancé sur le mainnet d’Ethereum en mai 2019. Son produit le plus connu, les Price Feeds, sert aux protocoles DeFi de prêt et de dérivés pour évaluer les garanties.",
     "LINK n’est pas la monnaie d’une blockchain propre, mais un jeton ERC-677 (extension de l’ERC-20) émis sur Ethereum ; il n’a donc pas de mécanisme de consensus à lui, ni preuve de travail ni preuve d’enjeu. Il sert à rémunérer les opérateurs de nœuds d’oracles et au staking, et son offre totale est fixée à 1 milliard. Lors de la vente de jetons, 35 % sont allés aux acheteurs, 35 % aux incitations des opérateurs de nœuds et de l’écosystème, et 30 % à la société. Le staking a démarré en décembre 2022 et CCIP, un protocole de messages et de transferts de jetons entre chaînes, a été lancé sur le mainnet en 2023."
    ],
    "applyH": "Appliquer les indicateurs à Chainlink",
    "apply": [
     "LINK évolue souvent avec Ethereum et le secteur DeFi : à certaines périodes, ETH et les jetons DeFi pèsent davantage sur son cours que BTC. Un RSI à 30 se lit mieux si l’on vérifie aussi que tout le secteur est en repli.",
     "L’indice Peur et Avidité ne mesure pas le sentiment propre à Chainlink. C’est l’indice de marché global d’Alternative.me, centré sur BTC : les nouvelles qui ne concernent que LINK, comme un grand partenariat ou une annonce liée à CCIP, n’y apparaissent pas.",
     "Le MVRV Z-Score s’affiche car CoinMetrics dispose de données sur LINK. Toutefois, les jetons réservés à la société et à l’écosystème ont été libérés sur le marché au fil du temps, ce qui a fait grimper l’offre en circulation ; ce changement d’offre peut brouiller la lecture de la capitalisation réalisée.",
     "Après son sommet de mai 2021, LINK a connu de longues périodes avec une baisse depuis le plus haut sur 365 jours bien au-delà de -50 %. Lire comme des signaux de plancher les niveaux de baisse (-30 %/-50 %) et les seuils du Mayer Multiple (0,8/2,4) hérités de Bitcoin peut conduire à des conclusions prématurées.",
     "Le score n’utilise que le prix de LINK en dollars ; les prix relatifs comme LINK/BTC ou LINK/ETH ne sont pas calculés. Quand tout le marché monte, le score court terme (momentum) peut être élevé même si LINK fait moins bien que d’autres cryptos."
    ],
    "histH": "Les cycles de prix de Chainlink en bref",
    "hist": [
     "2017 — Environ 32 millions de dollars levés lors de la vente de jetons (ICO) de septembre.",
     "2019 — Après le lancement sur le mainnet d’Ethereum en mai, le prix a été multiplié plusieurs fois avant la fin de l’été et a attiré l’attention du marché.",
     "2020 — Portée par l’essor de la DeFi et la demande de Price Feeds, LINK enchaîne en août les records de l’époque.",
     "2021 — Record historique au-dessus de 50 dollars en mai.",
     "2022 — Chute de plus de 80 % depuis le sommet pendant le marché baissier ; lancement du staking (v0.1) en décembre."
    ],
    "faq": [
     {
      "q": "Existe-t-il un indice Peur et Avidité propre à Chainlink ?",
      "a": "Non. L’indice Peur et Avidité de cette page est la valeur publiée par Alternative.me pour l’ensemble du marché crypto, et il n’en existe pas de version réservée à LINK. Pour suivre le comportement de LINK lui-même, regardez sur la même page les indicateurs calculés directement à partir de son prix, comme le RSI, le MACD ou le croisement 50/200."
     },
     {
      "q": "Chainlink a-t-il aussi un MVRV Z-Score ?",
      "a": "Oui. Les données publiques de CoinMetrics couvrent LINK, ce qui permet le calcul. LINK étant un jeton Ethereum, la valeur repose sur l’historique des mouvements des jetons LINK sur Ethereum. Si les données manquent temporairement, la carte affiche N/A et le score est calculé avec les autres indicateurs."
     },
     {
      "q": "Faut-il acheter du Chainlink maintenant ?",
      "a": "Cette page ne prend pas cette décision à votre place. Le score résume si les indicateurs penchent vers la survente ou la surchauffe au regard de l’historique. L’onglet court terme (momentum) monte avec la force de la tendance, l’onglet long terme (à contre-courant) avec la peur et l’ampleur de la baisse ; quand les deux divergent, mieux vaut ne pas conclure trop vite."
     },
     {
      "q": "Le score de Chainlink tient-il compte de fondamentaux comme l’usage des oracles ?",
      "a": "Non. Le score n’utilise que des indicateurs techniques calculés à partir du prix de LINK, l’indice Peur et Avidité du marché global et le MVRV de CoinMetrics. Les indicateurs d’usage, comme le nombre de Price Feeds, le volume de CCIP ou le montant du staking, n’y figurent pas : consultez-les séparément si besoin."
     },
     {
      "q": "Si l’offre totale est fixée à 1 milliard, peut-on ignorer la hausse de l’offre ?",
      "a": "L’offre totale est fixe, mais pas l’offre en circulation. Lorsque des jetons mis en réserve arrivent sur le marché, l’offre en circulation augmente, ce qui peut influer sur la capitalisation et la lecture du MVRV. On peut suivre l’offre en circulation sur les sites de cotation ou dans les historiques on-chain des portefeuilles."
     },
     {
      "q": "Sur quelles blockchains Chainlink est-il utilisé ?",
      "a": "Le jeton LINK a été émis sur Ethereum, mais les services d’oracles de Chainlink fonctionnent sur de nombreuses blockchains et réseaux de couche 2, et LINK peut être transféré vers d’autres chaînes via des ponts. Les prix de cette page reposent sur le cours de LINK en dollars (USDT) sur les plateformes d’échange."
     }
    ]
   },
   "de": {
    "title": "So liest man den Kauf-Timing-Score von Chainlink (LINK)",
    "intro": "Die Chainlink-Seite (LINK) berechnet aus dem LINK-Kurs und On-Chain-Daten RSI(14), MACD(12·26·9), den Angst-und-Gier-Index, das Mayer Multiple, den Rückgang vom 365-Tage-Hoch, das Golden/Death Cross 50/200 und den MVRV Z-Score und bündelt sie zu einem einzigen Score von 0 bis 100. Der Score fällt in fünf Zonen – STRONG BUY, ACCUMULATE, NEUTRAL, CAUTION und OVERHEATED – und ist kostenlos ohne Installation abrufbar. Weil LINK ein Oracle-Token ist, sind einige Indikatoren anders zu lesen als bei Bitcoin.",
    "coinH": "Was ist Chainlink (LINK)?",
    "coinP": [
     "Chainlink ist ein dezentrales Oracle-Netzwerk, das Daten von außerhalb der Blockchain – etwa Kurse von Vermögenswerten oder Ergebnisse von Ereignissen – an Smart Contracts liefert. Entwickelt wurde es von SmartContract, dem von Sergey Nazarov und Steve Ellis gegründeten Unternehmen; nach Whitepaper und Token-Verkauf 2017 ging es im Mai 2019 im Ethereum-Mainnet an den Start. Das bekannteste Produkt sind die Price Feeds, mit denen DeFi-Kredit- und Derivateprotokolle Sicherheiten bewerten.",
     "LINK ist nicht die Münze einer eigenen Blockchain, sondern ein auf Ethereum ausgegebener ERC-677-Token (eine Erweiterung von ERC-20) und hat daher keinen eigenen Konsensmechanismus wie Proof of Work oder Proof of Stake. Er dient zur Bezahlung von Oracle-Node-Betreibern und zum Staking; das Gesamtangebot ist auf 1 Milliarde festgelegt. Beim Token-Verkauf gingen 35 % an Käufer, 35 % an Anreize für Node-Betreiber und das Ökosystem und 30 % an das Unternehmen. Staking startete im Dezember 2022, und 2023 ging CCIP, ein Protokoll für kettenübergreifende Nachrichten und Token-Transfers, im Mainnet live."
    ],
    "applyH": "Indikatoren auf Chainlink anwenden",
    "apply": [
     "LINK bewegt sich oft mit Ethereum und dem DeFi-Sektor, sodass es Phasen gibt, in denen ETH und DeFi-Token mehr Einfluss haben als BTC. Ein RSI von 30 lässt sich besser einordnen, wenn man zugleich prüft, ob der ganze Sektor schwächelt.",
     "Der Angst-und-Gier-Index misst nicht die Stimmung zu Chainlink. Er ist der marktweite, BTC-lastige Index von Alternative.me; Nachrichten, die nur LINK betreffen, etwa eine große Partnerschaft oder eine CCIP-Ankündigung, tauchen darin nicht auf.",
     "Der MVRV Z-Score wird angezeigt, weil CoinMetrics Daten zu LINK hat. Allerdings wurden für das Unternehmen und das Ökosystem zurückgehaltene Token im Lauf der Zeit an den Markt abgegeben, wodurch das umlaufende Angebot stetig gestiegen ist; diese Angebotsveränderung kann die Deutung der realisierten Kapitalisierung verzerren.",
     "Nach dem Hoch im Mai 2021 lag der 365-Tage-Rückgang von LINK lange deutlich jenseits von -50 %. Wer die aus Bitcoin abgeleiteten Rückgangsmarken (-30 %/-50 %) und Mayer-Multiple-Schwellen (0,8/2,4) direkt als Bodensignal liest, urteilt womöglich zu früh.",
     "Der Score nutzt nur den Dollarkurs von LINK; relative Kurse wie LINK/BTC oder LINK/ETH werden nicht berechnet. Steigt der gesamte Markt, kann der Kurzfrist-Score (Momentum) hoch ausfallen, selbst wenn LINK hinter anderen Coins zurückbleibt."
    ],
    "histH": "Die Preiszyklen von Chainlink im Überblick",
    "hist": [
     "2017 – Rund 32 Millionen US-Dollar beim Token-Verkauf (ICO) im September eingesammelt.",
     "2019 – Nach dem Start im Ethereum-Mainnet im Mai vervielfachte sich der Kurs bis zum Sommer und rückte LINK in den Fokus des Marktes.",
     "2020 – Mit dem DeFi-Boom wuchs die Nachfrage nach Price Feeds, und im August folgten mehrere damalige Rekordhochs in Serie.",
     "2021 – Allzeithoch über 50 US-Dollar im Mai.",
     "2022 – Im Bärenmarkt mehr als 80 % unter dem Hoch; im Dezember startete das Staking (v0.1)."
    ],
    "faq": [
     {
      "q": "Gibt es einen eigenen Angst-und-Gier-Index für Chainlink?",
      "a": "Nein. Der Angst-und-Gier-Index auf dieser Seite ist der Wert, den Alternative.me für den gesamten Kryptomarkt veröffentlicht; eine reine LINK-Version gibt es nicht. Wie sich LINK selbst verhält, zeigen die Indikatoren auf derselben Seite, die direkt aus dem LINK-Kurs berechnet werden, etwa RSI, MACD und das 50/200-Kreuz."
     },
     {
      "q": "Gibt es für Chainlink auch einen MVRV Z-Score?",
      "a": "Ja. Die öffentlichen Daten von CoinMetrics umfassen LINK, daher lässt er sich berechnen. Da LINK ein Ethereum-Token ist, beruht der Wert auf der Bewegungshistorie der LINK-Token auf Ethereum. Fehlen die Daten vorübergehend, zeigt die Karte N/A, und der Score wird aus den übrigen Indikatoren berechnet."
     },
     {
      "q": "Sollte ich jetzt Chainlink kaufen?",
      "a": "Diese Entscheidung nimmt Ihnen die Seite nicht ab. Der Score fasst zusammen, ob die Indikatoren gemessen an der Historie eher Richtung überverkauft oder überhitzt tendieren. Der Kurzfrist-Tab (Momentum) steigt mit der Trendstärke, der Langfrist-Tab (antizyklisch) mit Angst und Rückgang; zeigen beide in verschiedene Richtungen, sollte man nichts überstürzen."
     },
     {
      "q": "Berücksichtigt der Chainlink-Score Fundamentaldaten wie die Oracle-Nutzung?",
      "a": "Nein. Der Score verwendet nur technische Indikatoren aus dem LINK-Kurs, den marktweiten Angst-und-Gier-Index und den MVRV von CoinMetrics. Nutzungskennzahlen wie die Zahl der Price Feeds, das CCIP-Volumen oder der Umfang des Stakings fließen nicht ein und müssen bei Bedarf separat geprüft werden."
     },
     {
      "q": "Wenn das Gesamtangebot auf 1 Milliarde festgelegt ist, kann ich das Angebotswachstum ignorieren?",
      "a": "Das Gesamtangebot ist fix, das umlaufende Angebot nicht. Gelangen zurückgehaltene Token an den Markt, steigt das umlaufende Angebot, was Marktkapitalisierung und MVRV-Deutung beeinflussen kann. Das umlaufende Angebot lässt sich auf Kursportalen oder anhand der On-Chain-Wallet-Daten verfolgen."
     },
     {
      "q": "Auf welchen Blockchains wird Chainlink genutzt?",
      "a": "Der LINK-Token wurde auf Ethereum ausgegeben, doch die Oracle-Dienste von Chainlink laufen auf vielen Blockchains und Layer-2-Netzwerken, und LINK lässt sich über Bridges auf andere Chains übertragen. Die Kurse auf dieser Seite beruhen auf dem Dollarkurs (USDT) von LINK an Börsen."
     }
    ]
   },
   "it": {
    "title": "Come leggere il punteggio di timing d’acquisto di Chainlink (LINK)",
    "intro": "La pagina di Chainlink (LINK) usa il prezzo di LINK e i dati on-chain per calcolare RSI(14), MACD(12·26·9), l’Indice Paura e Avidità, il Mayer Multiple, il calo dal massimo a 365 giorni, il golden cross/death cross 50/200 e l’MVRV Z-Score, e li combina in un unico punteggio da 0 a 100. Il punteggio rientra in cinque zone — STRONG BUY, ACCUMULATE, NEUTRAL, CAUTION e OVERHEATED — ed è consultabile gratis, senza installare nulla. Poiché LINK è un token di oracoli, alcuni indicatori vanno letti in modo diverso rispetto a Bitcoin.",
    "coinH": "Che cos’è Chainlink (LINK)?",
    "coinP": [
     "Chainlink è una rete di oracoli decentralizzata che porta agli smart contract dati esterni alla blockchain, come i prezzi degli asset o l’esito di eventi. L’ha sviluppata SmartContract, la società fondata da Sergey Nazarov e Steve Ellis; dopo il white paper e la vendita di token del 2017, è partita sulla mainnet di Ethereum nel maggio 2019. Il prodotto più noto sono i Price Feeds, che i protocolli DeFi di prestito e derivati usano per valutare le garanzie.",
     "LINK non è la moneta di una blockchain propria, ma un token ERC-677 (un’estensione di ERC-20) emesso su Ethereum, quindi non ha un meccanismo di consenso suo come la proof of work o la proof of stake. Serve a pagare gli operatori dei nodi oracolo e per lo staking, e l’offerta totale è fissata a 1 miliardo. Nella vendita di token il 35% è andato agli acquirenti, il 35% agli incentivi per operatori dei nodi ed ecosistema e il 30% alla società. Lo staking è partito a dicembre 2022 e nel 2023 è stato lanciato sulla mainnet CCIP, un protocollo per messaggi e trasferimenti di token tra catene."
    ],
    "applyH": "Come applicare gli indicatori a Chainlink",
    "apply": [
     "LINK tende a muoversi insieme a Ethereum e al settore DeFi, perciò in alcune fasi ETH e i token DeFi contano per lui più di BTC. Un RSI a 30 si interpreta meglio se si verifica anche che l’intero settore sia debole.",
     "L’Indice Paura e Avidità non misura il sentiment su Chainlink. È l’indice dell’intero mercato di Alternative.me, centrato su BTC, quindi le notizie che riguardano solo LINK, come una grande partnership o un annuncio su CCIP, non vi compaiono.",
     "L’MVRV Z-Score viene mostrato perché CoinMetrics ha i dati di LINK. Tuttavia i token riservati alla società e all’ecosistema sono stati immessi sul mercato nel tempo e l’offerta circolante è cresciuta di continuo; questo cambiamento dell’offerta può confondere la lettura della capitalizzazione realizzata.",
     "Dopo il massimo di maggio 2021, LINK ha trascorso lunghi periodi con un calo dal massimo a 365 giorni ben oltre il -50%. Leggere come segnali di minimo i livelli di calo (-30%/-50%) e le soglie del Mayer Multiple (0,8/2,4) ricavati da Bitcoin può portare a conclusioni premature.",
     "Il punteggio usa solo il prezzo di LINK in dollari; i prezzi relativi come LINK/BTC o LINK/ETH non vengono calcolati. Quando tutto il mercato sale, il punteggio di breve periodo (momentum) può essere alto anche se LINK resta indietro rispetto ad altre monete."
    ],
    "histH": "I cicli di prezzo di Chainlink in breve",
    "hist": [
     "2017 — Raccoglie circa 32 milioni di dollari con la vendita di token (ICO) di settembre.",
     "2019 — Dopo il lancio sulla mainnet di Ethereum a maggio, il prezzo si moltiplica più volte entro l’estate e attira l’attenzione del mercato.",
     "2020 — Con il boom della DeFi cresce la domanda di Price Feeds e ad agosto arrivano diversi massimi storici dell’epoca uno dopo l’altro.",
     "2021 — Tocca il massimo storico sopra i 50 dollari a maggio.",
     "2022 — Nel mercato ribassista perde oltre l’80% dal massimo; a dicembre parte lo staking (v0.1)."
    ],
    "faq": [
     {
      "q": "Esiste un Indice Paura e Avidità solo per Chainlink?",
      "a": "No. L’Indice Paura e Avidità di questa pagina è il valore che Alternative.me pubblica per l’intero mercato cripto e non ne esiste una versione dedicata a LINK. Per vedere come si comporta LINK in sé, guarda gli indicatori della stessa pagina calcolati direttamente sul suo prezzo, come RSI, MACD e incrocio 50/200."
     },
     {
      "q": "Anche Chainlink ha l’MVRV Z-Score?",
      "a": "Sì. I dati pubblici di CoinMetrics includono LINK, quindi il calcolo è possibile. Poiché LINK è un token di Ethereum, il valore si basa sulla cronologia dei movimenti dei token LINK su Ethereum. Se i dati mancano temporaneamente, la scheda mostra N/A e il punteggio viene calcolato con gli altri indicatori."
     },
     {
      "q": "Conviene comprare Chainlink adesso?",
      "a": "Questa pagina non prende la decisione al posto tuo. Il punteggio riassume se gli indicatori pendono verso l’ipervenduto o il surriscaldamento rispetto agli standard storici. La scheda di breve periodo (momentum) sale con la forza del trend, quella di lungo periodo (contrarian) con la paura e l’entità del calo; quando le due indicano direzioni opposte, meglio non avere fretta di concludere."
     },
     {
      "q": "Il punteggio di Chainlink tiene conto di fondamentali come l’uso degli oracoli?",
      "a": "No. Il punteggio usa solo indicatori tecnici calcolati sul prezzo di LINK, l’Indice Paura e Avidità dell’intero mercato e l’MVRV di CoinMetrics. Metriche d’uso come il numero di Price Feeds, il volume di CCIP o l’entità dello staking non sono incluse: se servono, vanno controllate a parte."
     },
     {
      "q": "Se l’offerta totale è fissata a 1 miliardo, posso ignorare l’aumento dell’offerta?",
      "a": "Il totale è fisso, l’offerta circolante no. Quando i token tenuti in riserva arrivano sul mercato, l’offerta circolante aumenta e ciò può influire sulla capitalizzazione e sulla lettura dell’MVRV. L’offerta circolante si può seguire sui siti di quotazioni o nei registri on-chain dei wallet."
     },
     {
      "q": "Su quali blockchain si usa Chainlink?",
      "a": "Il token LINK è stato emesso su Ethereum, ma i servizi di oracoli di Chainlink funzionano su molte blockchain e reti layer 2, e LINK può essere trasferito su altre catene tramite bridge. I prezzi di questa pagina si basano sulla quotazione di LINK in dollari (USDT) sugli exchange."
     }
    ]
   },
   "pt": {
    "title": "Como ler a pontuação de momento de compra da Chainlink (LINK)",
    "intro": "A página da Chainlink (LINK) usa o preço do LINK e dados on-chain para calcular RSI(14), MACD(12·26·9), o Índice de Medo e Ganância, o Mayer Multiple, a queda desde a máxima de 365 dias, o cruzamento dourado/da morte 50/200 e o MVRV Z-Score, e os combina numa única pontuação de 0 a 100. A pontuação se divide em cinco zonas — STRONG BUY, ACCUMULATE, NEUTRAL, CAUTION e OVERHEATED — e pode ser consultada de graça, sem instalar nada. Como o LINK é um token de oráculos, alguns indicadores precisam ser lidos de forma diferente do Bitcoin.",
    "coinH": "O que é a Chainlink (LINK)?",
    "coinP": [
     "A Chainlink é uma rede descentralizada de oráculos que leva aos contratos inteligentes dados que estão fora da blockchain, como preços de ativos ou resultados de eventos. Foi desenvolvida pela SmartContract, empresa fundada por Sergey Nazarov e Steve Ellis; depois do white paper e da venda de tokens em 2017, entrou em operação na mainnet do Ethereum em maio de 2019. Seu produto mais conhecido são os Price Feeds, que protocolos DeFi de empréstimo e derivativos usam para avaliar garantias.",
     "O LINK não é a moeda de uma blockchain própria, e sim um token ERC-677 (uma extensão do ERC-20) emitido no Ethereum; por isso não tem mecanismo de consenso próprio, como prova de trabalho ou prova de participação. Ele serve para pagar os operadores de nós de oráculos e para staking, e a oferta total é fixa em 1 bilhão. Na venda de tokens, 35% ficaram com os compradores, 35% com incentivos para operadores de nós e o ecossistema e 30% com a empresa. O staking começou em dezembro de 2022 e, em 2023, o CCIP, protocolo de mensagens e transferências de tokens entre cadeias, foi lançado na mainnet."
    ],
    "applyH": "Como aplicar os indicadores à Chainlink",
    "apply": [
     "O LINK costuma se mover junto com o Ethereum e o setor DeFi, então há fases em que ETH e os tokens DeFi pesam mais sobre ele do que o BTC. Um RSI de 30 é mais bem interpretado quando se verifica também se o setor inteiro está fraco.",
     "O Índice de Medo e Ganância não mede o sentimento sobre a Chainlink. É o índice de todo o mercado da Alternative.me, centrado no BTC, então notícias que afetam só o LINK, como uma grande parceria ou um anúncio sobre o CCIP, não aparecem nele.",
     "O MVRV Z-Score aparece porque a CoinMetrics tem dados do LINK. Porém, tokens reservados para a empresa e o ecossistema foram liberados ao mercado ao longo do tempo e a oferta circulante não parou de crescer; essa mudança de oferta pode se misturar à leitura da capitalização realizada.",
     "Depois da máxima de maio de 2021, o LINK passou longos períodos com queda desde a máxima de 365 dias bem além de -50%. Ler como sinais de fundo os níveis de queda (-30%/-50%) e os limites do Mayer Multiple (0,8/2,4) herdados do Bitcoin pode levar a conclusões precipitadas.",
     "A pontuação usa apenas o preço do LINK em dólar; preços relativos como LINK/BTC ou LINK/ETH não são calculados. Quando o mercado todo sobe, a pontuação de curto prazo (momentum) pode ficar alta mesmo que o LINK esteja atrás de outras moedas."
    ],
    "histH": "Resumo dos ciclos de preço da Chainlink",
    "hist": [
     "2017 — Levantou cerca de 32 milhões de dólares na venda de tokens (ICO) de setembro.",
     "2019 — Depois do lançamento na mainnet do Ethereum em maio, o preço se multiplicou várias vezes até o meio do ano e chamou a atenção do mercado.",
     "2020 — Com o boom DeFi, a demanda por Price Feeds cresceu e, em agosto, vieram várias máximas históricas da época em sequência.",
     "2021 — Marcou a máxima histórica acima de 50 dólares em maio.",
     "2022 — Caiu mais de 80% desde a máxima no mercado de baixa; em dezembro começou o staking (v0.1)."
    ],
    "faq": [
     {
      "q": "Existe um Índice de Medo e Ganância só da Chainlink?",
      "a": "Não. O Índice de Medo e Ganância desta página é o valor que a Alternative.me publica para todo o mercado cripto, e não há uma versão só para o LINK. Para ver como o próprio LINK está se comportando, olhe os indicadores da mesma página calculados diretamente com o preço dele, como RSI, MACD e o cruzamento 50/200."
     },
     {
      "q": "A Chainlink também tem MVRV Z-Score?",
      "a": "Sim. Os dados públicos da CoinMetrics incluem o LINK, então o cálculo é possível. Como o LINK é um token do Ethereum, o valor se baseia no histórico de movimentação dos tokens LINK no Ethereum. Se os dados faltarem temporariamente, o cartão mostra N/A e a pontuação é calculada com os demais indicadores."
     },
     {
      "q": "Devo comprar Chainlink agora?",
      "a": "Esta página não toma essa decisão por você. A pontuação resume se os indicadores pendem para sobrevenda ou superaquecimento segundo os padrões históricos. A aba de curto prazo (momentum) sobe com a força da tendência, e a de longo prazo (contrária) com o medo e o tamanho da queda; quando as duas apontam para lados opostos, é melhor não tirar conclusões apressadas."
     },
     {
      "q": "A pontuação da Chainlink inclui fundamentos como o uso dos oráculos?",
      "a": "Não. A pontuação usa apenas indicadores técnicos calculados com o preço do LINK, o Índice de Medo e Ganância do mercado todo e o MVRV da CoinMetrics. Métricas de uso como número de Price Feeds, volume do CCIP ou tamanho do staking não entram, então consulte-as à parte se precisar."
     },
     {
      "q": "Se a oferta total é fixa em 1 bilhão, posso ignorar o aumento da oferta?",
      "a": "O total é fixo, mas a oferta circulante não. Quando tokens guardados em reserva chegam ao mercado, a oferta circulante aumenta, o que pode afetar a capitalização e a leitura do MVRV. Dá para acompanhar a oferta circulante em sites de cotação ou nos registros on-chain das carteiras."
     },
     {
      "q": "Em quais blockchains a Chainlink é usada?",
      "a": "O token LINK foi emitido no Ethereum, mas os serviços de oráculos da Chainlink funcionam em muitas blockchains e redes de camada 2, e o LINK pode ser levado a outras cadeias por meio de pontes. Os preços desta página se baseiam na cotação do LINK em dólar (USDT) nas corretoras."
     }
    ]
   },
   "ru": {
    "title": "Как читать оценку момента покупки Чейнлинка (LINK)",
    "intro": "Страница Чейнлинка (LINK) по цене LINK и ончейн-данным рассчитывает RSI(14), MACD(12·26·9), индекс страха и жадности, Mayer Multiple, просадку от 365-дневного максимума, золотой крест / крест смерти 50/200 и MVRV Z-Score и объединяет их в одну оценку от 0 до 100. Оценка попадает в одну из пяти зон — STRONG BUY, ACCUMULATE, NEUTRAL, CAUTION и OVERHEATED — и доступна бесплатно, без установки. Поскольку LINK — токен оракулов, некоторые индикаторы нужно читать иначе, чем для биткоина.",
    "coinH": "Что такое Чейнлинк (LINK)?",
    "coinP": [
     "Чейнлинк — децентрализованная сеть оракулов, которая передаёт смарт-контрактам данные из-за пределов блокчейна, например цены активов или итоги событий. Её разработала компания SmartContract, основанная Сергеем Назаровым и Стивом Эллисом; после публикации white paper и продажи токенов в 2017 году сеть заработала в основной сети Эфириума в мае 2019 года. Самый известный продукт — Price Feeds: протоколы кредитования и деривативов в DeFi используют их для оценки залога.",
     "LINK — не монета собственного блокчейна, а токен стандарта ERC-677 (расширение ERC-20), выпущенный в сети Эфириум, поэтому собственного механизма консенсуса вроде доказательства работы или доказательства доли у него нет. Он служит для оплаты операторам узлов-оракулов и для стейкинга; общее предложение зафиксировано на уровне 1 млрд токенов. При продаже токенов 35% получили покупатели, 35% выделено на вознаграждения операторам узлов и развитие экосистемы, 30% — компании. Стейкинг запущен в декабре 2022 года, а в 2023 году в основной сети заработал CCIP — протокол для межсетевых сообщений и переводов токенов."
    ],
    "applyH": "Как применять индикаторы к Чейнлинку",
    "apply": [
     "LINK часто движется вместе с Эфириумом и сектором DeFi, поэтому бывают периоды, когда ETH и DeFi-токены влияют на него сильнее, чем BTC. RSI на уровне 30 легче оценить, если заодно проверить, слаб ли весь сектор.",
     "Индекс страха и жадности не измеряет настроения именно вокруг Чейнлинка. Это общерыночный индекс Alternative.me с упором на BTC, поэтому новости, касающиеся только LINK, например крупное партнёрство или анонс по CCIP, в нём не видны.",
     "MVRV Z-Score отображается, потому что у CoinMetrics есть данные по LINK. Однако токены, зарезервированные для компании и экосистемы, со временем поступали на рынок, и циркулирующее предложение постоянно росло; это изменение предложения может искажать трактовку реализованной капитализации.",
     "После пика мая 2021 года LINK долго находился в просадке от 365-дневного максимума намного глубже -50%. Если воспринимать пришедшие из биткоина уровни просадки (-30%/-50%) и пороги Mayer Multiple (0,8/2,4) как сигнал дна, можно сделать вывод слишком рано.",
     "Оценка использует только долларовую цену LINK; относительные цены вроде LINK/BTC или LINK/ETH не рассчитываются. Когда растёт весь рынок, краткосрочная оценка (моментум) может быть высокой, даже если LINK отстаёт от других монет."
    ],
    "histH": "Ценовые циклы Чейнлинка кратко",
    "hist": [
     "2017 — На сентябрьской продаже токенов (ICO) привлечено около 32 млн долларов.",
     "2019 — После запуска в основной сети Эфириума в мае цена к лету выросла в несколько раз и привлекла внимание рынка.",
     "2020 — На волне DeFi спрос на Price Feeds вырос, и в августе LINK несколько раз подряд обновлял тогдашние исторические максимумы.",
     "2021 — В мае установлен исторический максимум выше 50 долларов.",
     "2022 — На медвежьем рынке падение от пика превысило 80%; в декабре запущен стейкинг (v0.1)."
    ],
    "faq": [
     {
      "q": "Есть ли отдельный индекс страха и жадности для Чейнлинка?",
      "a": "Нет. Индекс страха и жадности на этой странице — значение, которое Alternative.me публикует для всего криптовалютного рынка; отдельной версии для LINK не существует. Чтобы увидеть поведение самого LINK, смотрите на той же странице индикаторы, рассчитанные непосредственно по его цене: RSI, MACD, пересечение 50/200."
     },
     {
      "q": "Показывается ли MVRV Z-Score для Чейнлинка?",
      "a": "Да. В открытых данных CoinMetrics есть LINK, поэтому расчёт возможен. Так как LINK — токен Эфириума, значение основано на истории перемещений токенов LINK в сети Эфириум. Если данные временно отсутствуют, карточка показывает N/A, а оценка рассчитывается по остальным индикаторам."
     },
     {
      "q": "Стоит ли покупать Чейнлинк сейчас?",
      "a": "Эта страница не принимает такое решение за вас. Оценка обобщает, куда склоняются индикаторы по историческим меркам — к перепроданности или к перегреву. Краткосрочная вкладка (моментум) растёт вместе с силой тренда, долгосрочная (контрарианская) — вместе со страхом и глубиной просадки; если они указывают в разные стороны, лучше не спешить с выводами."
     },
     {
      "q": "Учитывает ли оценка Чейнлинка фундаментальные данные, например использование оракулов?",
      "a": "Нет. Оценка использует только технические индикаторы по цене LINK, общерыночный индекс страха и жадности и MVRV от CoinMetrics. Показатели использования — число Price Feeds, объём CCIP, размер стейкинга — не учитываются, при необходимости их стоит проверять отдельно."
     },
     {
      "q": "Если общее предложение зафиксировано на 1 млрд, можно не следить за ростом предложения?",
      "a": "Общее предложение фиксировано, а циркулирующее — нет. Когда зарезервированные токены выходят на рынок, циркулирующее предложение растёт, что может влиять на капитализацию и трактовку MVRV. Следить за ним можно на сайтах с котировками или по ончейн-записям кошельков."
     },
     {
      "q": "В каких блокчейнах используется Чейнлинк?",
      "a": "Токен LINK выпущен в сети Эфириум, но оракулы Чейнлинка работают во многих блокчейнах и сетях второго уровня, а сам LINK можно перенести в другие сети через мосты. Цены на этой странице основаны на долларовом (USDT) курсе LINK на биржах."
     }
    ]
   },
   "nl": {
    "title": "Zo lees je de koop-timingscore van Chainlink (LINK)",
    "intro": "De Chainlink-pagina (LINK) berekent uit de LINK-koers en on-chaindata de RSI(14), MACD(12·26·9), de Angst-en-hebzuchtindex, de Mayer Multiple, de daling vanaf de 365-daagse top, de golden/death cross 50/200 en de MVRV Z-Score, en voegt ze samen tot één score van 0 tot 100. De score valt in vijf zones — STRONG BUY, ACCUMULATE, NEUTRAL, CAUTION en OVERHEATED — en is gratis te bekijken zonder installatie. Omdat LINK een oracle-token is, moet je een aantal indicatoren anders lezen dan bij Bitcoin.",
    "coinH": "Wat is Chainlink (LINK)?",
    "coinP": [
     "Chainlink is een gedecentraliseerd oraclenetwerk dat gegevens van buiten de blockchain, zoals koersen van activa of uitkomsten van gebeurtenissen, aan smart contracts levert. Het werd ontwikkeld door SmartContract, het bedrijf dat Sergey Nazarov en Steve Ellis oprichtten; na een whitepaper en een tokenverkoop in 2017 ging het in mei 2019 live op het Ethereum-mainnet. Het bekendste product zijn de Price Feeds, waarmee DeFi-leen- en derivatenprotocollen onderpand waarderen.",
     "LINK is geen munt van een eigen blockchain, maar een ERC-677-token (een uitbreiding van ERC-20) die op Ethereum is uitgegeven; er is dus geen eigen consensusmechanisme zoals proof of work of proof of stake. De token wordt gebruikt om operators van oracle-nodes te betalen en voor staking, en het totale aanbod ligt vast op 1 miljard. Bij de tokenverkoop ging 35% naar kopers, 35% naar beloningen voor node-operators en het ecosysteem en 30% naar het bedrijf. Staking begon in december 2022 en in 2023 ging CCIP, een protocol voor berichten en tokenoverdrachten tussen chains, live op het mainnet."
    ],
    "applyH": "Indicatoren toepassen op Chainlink",
    "apply": [
     "LINK beweegt vaak mee met Ethereum en de DeFi-sector, waardoor ETH en DeFi-tokens in sommige periodes meer invloed hebben dan BTC. Een RSI van 30 zegt meer als je ook nagaat of de hele sector zwak staat.",
     "De Angst-en-hebzuchtindex meet niet het sentiment rond Chainlink. Het is de marktbrede index van Alternative.me met BTC als zwaartepunt, dus nieuws dat alleen LINK raakt, zoals een groot partnerschap of een CCIP-aankondiging, zie je er niet in terug.",
     "De MVRV Z-Score wordt getoond omdat CoinMetrics data over LINK heeft. Tokens die voor het bedrijf en het ecosysteem waren achtergehouden, zijn echter in de loop der tijd op de markt gekomen, waardoor het circulerende aanbod gestaag is gegroeid; die aanbodverandering kan de lezing van de gerealiseerde kapitalisatie vertroebelen.",
     "Na de top van mei 2021 zat LINK lange tijd op een daling vanaf de 365-daagse top van ruim meer dan -50%. Wie de van Bitcoin afgeleide dalingsniveaus (-30%/-50%) en Mayer Multiple-drempels (0,8/2,4) direct als bodemsignaal leest, trekt mogelijk te vroeg conclusies.",
     "De score gebruikt alleen de dollarkoers van LINK; relatieve koersen zoals LINK/BTC of LINK/ETH worden niet berekend. Als de hele markt stijgt, kan de kortetermijnscore (momentum) hoog uitvallen, zelfs als LINK achterblijft bij andere munten."
    ],
    "histH": "De prijscycli van Chainlink in het kort",
    "hist": [
     "2017 — Haalde ongeveer 32 miljoen dollar op met de tokenverkoop (ICO) in september.",
     "2019 — Na de lancering op het Ethereum-mainnet in mei vermenigvuldigde de koers zich tegen de zomer meerdere keren en trok LINK de aandacht van de markt.",
     "2020 — Met de DeFi-boom groeide de vraag naar Price Feeds, en in augustus volgden meerdere toenmalige recordkoersen op rij.",
     "2021 — Bereikte in mei de recordkoers boven 50 dollar.",
     "2022 — Zakte in de bearmarkt meer dan 80% onder de top; in december begon staking (v0.1)."
    ],
    "faq": [
     {
      "q": "Bestaat er een aparte Angst-en-hebzuchtindex voor Chainlink?",
      "a": "Nee. De Angst-en-hebzuchtindex op deze pagina is de waarde die Alternative.me voor de hele cryptomarkt publiceert; een versie alleen voor LINK bestaat niet. Wil je zien hoe LINK zelf zich gedraagt, kijk dan op dezelfde pagina naar de indicatoren die direct uit de LINK-koers worden berekend, zoals RSI, MACD en de 50/200-kruising."
     },
     {
      "q": "Krijgt Chainlink ook een MVRV Z-Score?",
      "a": "Ja. De openbare data van CoinMetrics bevatten LINK, dus de berekening is mogelijk. Omdat LINK een Ethereum-token is, is de waarde gebaseerd op de bewegingsgeschiedenis van LINK-tokens op Ethereum. Ontbreekt de data tijdelijk, dan toont de kaart N/A en wordt de score met de overige indicatoren berekend."
     },
     {
      "q": "Moet ik nu Chainlink kopen?",
      "a": "Die beslissing neemt deze pagina niet voor je. De score vat samen of de indicatoren volgens historische maatstaven richting oversold of oververhit neigen. Het tabblad korte termijn (momentum) stijgt met de kracht van de trend, het tabblad lange termijn (contrair) met angst en de omvang van de daling; wijzen ze verschillende kanten op, trek dan niet te snel conclusies."
     },
     {
      "q": "Houdt de Chainlink-score rekening met fundamentals zoals het gebruik van de oracles?",
      "a": "Nee. De score gebruikt alleen technische indicatoren uit de LINK-koers, de marktbrede Angst-en-hebzuchtindex en de MVRV van CoinMetrics. Gebruikscijfers zoals het aantal Price Feeds, het CCIP-volume of de omvang van staking tellen niet mee; controleer die apart als je ze nodig hebt."
     },
     {
      "q": "Als het totale aanbod vastligt op 1 miljard, kan ik aanbodgroei dan negeren?",
      "a": "Het totaal ligt vast, het circulerende aanbod niet. Als achtergehouden tokens op de markt komen, stijgt het circulerende aanbod, wat de marktkapitalisatie en de lezing van de MVRV kan beïnvloeden. Je kunt het circulerende aanbod volgen op koerssites of via on-chain walletgegevens."
     },
     {
      "q": "Op welke blockchains wordt Chainlink gebruikt?",
      "a": "De LINK-token is op Ethereum uitgegeven, maar de oracle-diensten van Chainlink draaien op veel blockchains en layer-2-netwerken, en LINK kan via bridges naar andere chains worden overgezet. De koersen op deze pagina zijn gebaseerd op de dollarkoers (USDT) van LINK op beurzen."
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
