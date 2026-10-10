/* 하단 SEO 본문 다국어 데이터 + 렌더러. index.html(광고) / member/index.html(구독자) 공유.
   언어 전환 시 window.renderSEO(lang) 호출 → section.seo 를 해당 언어로 다시 그림.
   기본 정적 HTML(한국어)은 무JS 크롤러용 폴백으로 남겨두고, JS 실행 시 현재 언어로 교체. */
(function () {
  var SEO = {
    ko: {
      title: '더그래프 공포·탐욕 지수 & 매수 타이밍 점수',
      intro: '더그래프 공포지수(공포·탐욕 지수, Fear & Greed Index)를 포함한 7개 실시간 지표를 합성해 “지금이 매수 타이밍인가?”를 0~100 점수로 보여주는 무료 대시보드입니다. 설치 없이 브라우저에서 바로 실행되며 13개 언어를 지원합니다.',
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
        { q: '공포지수가 낮으면 더그래프을 사야 하나요?', a: '극단적 공포는 역사적으로 분할 매수 기회였던 경우가 많지만, 공포지수 하나만 보면 “떨어지는 칼날”을 잡을 위험이 있습니다. 본 점수는 RSI·MACD·마이어 배수·낙폭·이동평균 크로스를 함께 보고, 하락 추세에서는 점수를 보수적으로 낮춥니다.' },
        { q: '매수 타이밍 점수는 어떻게 계산되나요?', a: '7개 지표를 각각 0~100 부분점수로 환산해 가중 합성합니다. 결과는 0~100이며 5단계 밴드로 표시됩니다.' },
        { q: '무료인가요? 설치가 필요한가요?', a: '완전 무료이며 설치가 필요 없습니다. CoinGecko·Binance·Alternative.me 공개 API에서 실시간 데이터를 가져옵니다.' },
        { q: '공포지수와 매수 타이밍 점수는 무엇이 다른가요?', a: '공포지수는 심리 한 가지 지표(0~100)이고, 매수 타이밍 점수는 공포지수를 포함한 7개 지표를 합성한 종합 점수(0~100)입니다.' },
        { q: '공포지수 데이터는 어디서 가져오나요? 얼마나 자주 갱신되나요?', a: '공포·탐욕 지수는 Alternative.me, 가격·일봉은 CoinGecko·Binance, 온체인 지표는 CoinMetrics 공개 API에서 실시간으로 가져옵니다. 화면은 약 1분 주기로 자동 갱신됩니다.' },
        { q: '더그래프 지금 사도 되나요?', a: '정답은 없지만, 매수 타이밍 점수(0~100)로 현재 시장이 과매도·공포 구간인지 과열·탐욕 구간인지 객관적으로 가늠할 수 있습니다. 장기(역발상) 탭 기준 점수가 높을수록 공포·저평가가 겹친 분할 매수 우호 구간, 낮을수록 과열 경계 구간입니다. 참고 신호일 뿐 투자 자문이 아닙니다.' },
        { q: '단기와 장기 매수 타이밍은 어떻게 다른가요?', a: '점수는 단기·장기 두 탭으로 나뉩니다. 단기(모멘텀)는 약 1~3개월 추세추종 관점으로 상승 추세가 강할수록 높고, 장기(역발상)는 약 1년 이상 사이클 관점으로 공포·저평가일수록 높습니다. 2017년 이후 백테스트에서 단기는 모멘텀, 장기는 역발상 방향이 더 잘 맞았습니다.' },
        { q: 'BOTTOM RADAR(바닥 점수)는 무엇인가요?', a: 'MVRV Z-점수 같은 온체인 지표로 시가총액이 투자자 평균 매수원가 대비 어디에 있는지 재서, 역사적 바닥 구간과의 근접도를 0~100으로 보여주는 보조 게이지입니다. 계산 근거는 “비트코인 바닥” 해설 페이지에 공개되어 있습니다.' }
      ],
      disclaimer: '⚠ 본 점수는 공개 지표를 합성한 참고 신호이며 투자 자문이 아닙니다. 모든 투자 판단과 책임은 이용자 본인에게 있습니다.'
    },
    en: {
      title: 'The Graph Fear & Greed Index & Buy-Timing Score',
      intro: 'A free dashboard that synthesizes 7 real-time indicators — including the The Graph Fear & Greed Index — into a 0–100 “is now a good time to buy?” score. Runs in your browser with no install, in 13 languages.',
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
        { q: 'Should I buy The Graph when the index is low?', a: 'Extreme fear has often been an accumulation opportunity, but relying on the index alone risks catching a falling knife. This score also weighs RSI, MACD, Mayer Multiple, drawdown and moving-average crosses, and lowers the score conservatively in downtrends.' },
        { q: 'How is the buy-timing score calculated?', a: 'Each of the 7 indicators is converted to a 0–100 sub-score and weighted together. The result is 0–100, shown in 5 bands.' },
        { q: 'Is it free? Do I need to install anything?', a: 'It is completely free with no install. Real-time data comes from CoinGecko, Binance and Alternative.me public APIs.' },
        { q: 'How is the index different from the buy-timing score?', a: 'The index is a single sentiment metric (0–100); the buy-timing score is a composite of 7 indicators including the index (0–100).' },
        { q: 'Where does the data come from, and how often does it refresh?', a: 'The Fear & Greed Index comes from Alternative.me, prices and daily candles from the CoinGecko and Binance public APIs, and on-chain metrics from CoinMetrics. The screen auto-refreshes roughly every minute.' },
        { q: 'Should I buy The Graph right now?', a: 'There is no single answer, but the buy-timing score (0–100) gives an objective read on whether the market is in an oversold/fear zone or an overheated/greed zone. On the long-term (contrarian) tab, higher scores mark zones where fear and undervaluation overlap — historically favorable for DCA — while lower scores warn of overheating. It is a reference signal, not investment advice.' },
        { q: 'How do short-term and long-term buy timing differ?', a: 'The score is split into two tabs. Short-term (momentum) takes a 1–3 month trend-following view and rises with strong uptrends; long-term (contrarian) takes a 1-year-plus cycle view and rises with fear and undervaluation. In backtests since 2017, momentum worked better short-term and contrarian worked better long-term.' },
        { q: 'What is the BOTTOM RADAR (bottom score)?', a: 'A secondary gauge that uses on-chain metrics such as the MVRV Z-Score to measure where market cap sits relative to investors’ average cost basis, showing proximity to historic bottom zones on a 0–100 scale. The full calculation is published on the “Bitcoin bottom” guide page.' }
      ],
      disclaimer: '⚠ This score is a reference signal built from public indicators, not investment advice. All decisions and responsibility are your own.'
    },
    ja: {
      title: 'ザ・グラフ 恐怖・強欲指数 & 買い時スコア',
      intro: 'ザ・グラフの恐怖・強欲指数（Fear & Greed Index）を含む7つのリアルタイム指標を合成し、「今が買い時か？」を0〜100のスコアで示す無料ダッシュボードです。インストール不要でブラウザから即実行、13言語対応。',
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
        { q: '指数が低ければザ・グラフを買うべき？', a: '極端な恐怖は歴史的に分割買いの好機だったことが多いですが、指数だけに頼ると「落ちるナイフ」を掴む危険があります。本スコアはRSI・MACD・マイヤー倍率・下落率・移動平均クロスも合わせて見て、下落トレンドでは保守的にスコアを下げます。' },
        { q: '買い時スコアはどう計算される？', a: '7指標をそれぞれ0〜100の部分スコアに換算し加重合成します。結果は0〜100で、5段階バンドで表示します。' },
        { q: '無料？インストールは必要？', a: '完全無料・インストール不要です。CoinGecko・Binance・Alternative.me の公開APIからリアルタイムデータを取得します。' },
        { q: '指数と買い時スコアの違いは？', a: '指数は心理1指標(0〜100)、買い時スコアは指数を含む7指標を合成した総合スコア(0〜100)です。' },
        { q: 'データはどこから？更新頻度は？', a: '恐怖・強欲指数はAlternative.me、価格・日足はCoinGecko・Binance、オンチェーン指標はCoinMetricsの公開APIからリアルタイムで取得します。画面は約1分ごとに自動更新されます。' },
        { q: 'ザ・グラフは今買ってもいい？', a: '正解はありませんが、買い時スコア(0〜100)で現在の市場が売られすぎ・恐怖圏か、過熱・強欲圏かを客観的に測れます。長期（逆張り）タブではスコアが高いほど恐怖と割安が重なる分割買いに有利な圏、低いほど過熱警戒圏です。参考シグナルであり投資助言ではありません。' },
        { q: '短期と長期の買い時はどう違う？', a: 'スコアは短期・長期の2タブに分かれます。短期（モメンタム）は約1〜3か月のトレンドフォロー視点で上昇トレンドが強いほど高く、長期（逆張り）は約1年以上のサイクル視点で恐怖・割安なほど高くなります。2017年以降のバックテストでは、短期はモメンタム、長期は逆張りの方向がより有効でした。' },
        { q: 'BOTTOM RADAR（底値スコア）とは？', a: 'MVRV Zスコアなどのオンチェーン指標で、時価総額が投資家の平均取得単価に対してどの位置にあるかを測り、歴史的な底値圏への近さを0〜100で示す補助ゲージです。計算根拠は「ビットコインの底」解説ページで公開しています。' }
      ],
      disclaimer: '⚠ 本スコアは公開指標を合成した参考シグナルであり、投資助言ではありません。すべての判断と責任は利用者ご自身にあります。'
    },
    zh: {
      title: 'The Graph恐惧与贪婪指数 & 买入时机评分',
      intro: '一个免费仪表板，将包括The Graph恐惧与贪婪指数（Fear & Greed Index）在内的7个实时指标合成为0–100的“现在是买入时机吗？”评分。无需安装，浏览器即开即用，支持13种语言。',
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
        { q: '指数低就该买The Graph吗？', a: '极度恐惧在历史上常是分批买入良机，但只看指数有“接飞刀”的风险。本评分同时参考RSI、MACD、梅耶倍数、回撤与均线交叉，并在下跌趋势中保守下调评分。' },
        { q: '买入时机评分如何计算？', a: '将7个指标各自换算为0–100分项评分并加权合成。结果为0–100，以5档显示。' },
        { q: '免费吗？需要安装吗？', a: '完全免费、无需安装。实时数据来自 CoinGecko、Binance、Alternative.me 公开API。' },
        { q: '指数与买入时机评分有何不同？', a: '指数是单一情绪指标(0–100)；买入时机评分是包含该指数在内的7指标综合评分(0–100)。' },
        { q: '数据来自哪里？多久更新一次？', a: '恐惧与贪婪指数来自Alternative.me，价格与日K来自CoinGecko和Binance公开API，链上指标来自CoinMetrics。页面约每1分钟自动刷新。' },
        { q: '现在可以买The Graph吗？', a: '没有标准答案，但买入时机评分(0–100)能客观判断当前市场处于超卖·恐惧区还是过热·贪婪区。在长期（逆向）标签页中，评分越高代表恐惧与低估重叠、历史上利于分批买入的区间；越低则是过热警戒区。仅供参考，并非投资建议。' },
        { q: '短期和长期买入时机有何不同？', a: '评分分为短期、长期两个标签页。短期（动量）以约1–3个月的趋势跟随视角，上升趋势越强评分越高；长期（逆向）以约1年以上的周期视角，越恐惧、越低估评分越高。2017年以来的回测显示，短期动量、长期逆向的方向更有效。' },
        { q: 'BOTTOM RADAR（底部评分）是什么？', a: '一个辅助仪表，利用MVRV Z分数等链上指标衡量市值相对投资者平均持仓成本的位置，以0–100显示与历史底部区间的接近程度。计算依据在“比特币底部”解读页面公开。' }
      ],
      disclaimer: '⚠ 本评分由公开指标合成，仅供参考，并非投资建议。一切投资决定与责任由用户自负。'
    },
    'zh-Hant': {
      title: 'The Graph恐懼與貪婪指數 & 買入時機評分',
      intro: '一個免費儀表板，將包括The Graph恐懼與貪婪指數（Fear & Greed Index）在內的7個即時指標合成為0–100的「現在是買入時機嗎？」評分。免安裝、瀏覽器即開即用，支援13種語言。',
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
        { q: '指數低就該買The Graph嗎？', a: '極度恐懼在歷史上常是分批買入良機，但只看指數有「接飛刀」的風險。本評分同時參考RSI、MACD、梅耶倍數、回撤與均線交叉，並在下跌趨勢中保守下調評分。' },
        { q: '買入時機評分如何計算？', a: '將7個指標各自換算為0–100分項評分並加權合成。結果為0–100，以5檔顯示。' },
        { q: '免費嗎？需要安裝嗎？', a: '完全免費、免安裝。即時資料來自 CoinGecko、Binance、Alternative.me 公開API。' },
        { q: '指數與買入時機評分有何不同？', a: '指數是單一情緒指標(0–100)；買入時機評分是包含該指數在內的7指標綜合評分(0–100)。' },
        { q: '資料來自哪裡？多久更新一次？', a: '恐懼與貪婪指數來自Alternative.me，價格與日K來自CoinGecko和Binance公開API，鏈上指標來自CoinMetrics。頁面約每1分鐘自動重新整理。' },
        { q: '現在可以買The Graph嗎？', a: '沒有標準答案，但買入時機評分(0–100)能客觀判斷當前市場處於超賣·恐懼區還是過熱·貪婪區。在長期（逆向）分頁中，評分越高代表恐懼與低估重疊、歷史上利於分批買入的區間；越低則是過熱警戒區。僅供參考，並非投資建議。' },
        { q: '短期和長期買入時機有何不同？', a: '評分分為短期、長期兩個分頁。短期（動量）以約1–3個月的趨勢跟隨視角，上升趨勢越強評分越高；長期（逆向）以約1年以上的週期視角，越恐懼、越低估評分越高。2017年以來的回測顯示，短期動量、長期逆向的方向更有效。' },
        { q: 'BOTTOM RADAR（底部評分）是什麼？', a: '一個輔助儀表，利用MVRV Z分數等鏈上指標衡量市值相對投資者平均持倉成本的位置，以0–100顯示與歷史底部區間的接近程度。計算依據在「比特幣底部」解說頁面公開。' }
      ],
      disclaimer: '⚠ 本評分由公開指標合成，僅供參考，並非投資建議。一切投資決定與責任由用戶自負。'
    },
    es: {
      title: 'Índice de miedo y codicia de The Graph y puntuación de momento de compra',
      intro: 'Un panel gratuito que sintetiza 7 indicadores en tiempo real —incluido el índice de miedo y codicia de The Graph— en una puntuación de 0 a 100 sobre «¿es buen momento para comprar?». Funciona en el navegador sin instalación, en 13 idiomas.',
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
        { q: '¿Debo comprar The Graph cuando el índice está bajo?', a: 'El miedo extremo ha sido a menudo una oportunidad de acumulación, pero fiarse solo del índice arriesga «atrapar un cuchillo que cae». Esta puntuación también pondera RSI, MACD, múltiplo de Mayer, caída y cruces de medias, y la reduce de forma conservadora en tendencias bajistas.' },
        { q: '¿Cómo se calcula la puntuación de compra?', a: 'Cada uno de los 7 indicadores se convierte en una subpuntuación de 0 a 100 y se pondera. El resultado es 0–100, mostrado en 5 bandas.' },
        { q: '¿Es gratis? ¿Necesito instalar algo?', a: 'Es totalmente gratis y sin instalación. Los datos en tiempo real provienen de las API públicas de CoinGecko, Binance y Alternative.me.' },
        { q: '¿En qué se diferencia el índice de la puntuación de compra?', a: 'El índice es una sola métrica de sentimiento (0–100); la puntuación de compra es un compuesto de 7 indicadores que incluye el índice (0–100).' },
        { q: '¿De dónde vienen los datos y con qué frecuencia se actualizan?', a: 'El índice de miedo y codicia viene de Alternative.me; los precios y velas diarias, de las API públicas de CoinGecko y Binance; y las métricas on-chain, de CoinMetrics. La pantalla se actualiza automáticamente cada minuto aproximadamente.' },
        { q: '¿Debería comprar The Graph ahora mismo?', a: 'No hay una respuesta única, pero la puntuación de compra (0–100) permite valorar objetivamente si el mercado está en zona de sobreventa/miedo o de recalentamiento/codicia. En la pestaña de largo plazo (contraria), puntuaciones altas marcan zonas donde coinciden miedo e infravaloración —históricamente favorables al DCA—, y las bajas avisan de recalentamiento. Es una señal de referencia, no asesoramiento de inversión.' },
        { q: '¿En qué se diferencian el timing de corto y de largo plazo?', a: 'La puntuación se divide en dos pestañas. El corto plazo (momentum) adopta una visión de seguimiento de tendencia de 1–3 meses y sube con tendencias alcistas fuertes; el largo plazo (contrario) adopta una visión de ciclo de más de un año y sube con miedo e infravaloración. En backtests desde 2017, el momentum funcionó mejor a corto y lo contrario a largo.' },
        { q: '¿Qué es el BOTTOM RADAR (puntuación de suelo)?', a: 'Un indicador auxiliar que usa métricas on-chain como el MVRV Z-Score para medir dónde está la capitalización respecto al coste medio de los inversores, mostrando la cercanía a zonas de suelo históricas en una escala de 0 a 100. El cálculo completo está publicado en la guía «suelo de Bitcoin».' }
      ],
      disclaimer: '⚠ Esta puntuación es una señal de referencia a partir de indicadores públicos, no asesoramiento de inversión. Todas las decisiones y la responsabilidad son tuyas.'
    },
    fr: {
      title: 'Indice de peur et d’avidité The Graph et score de timing d’achat',
      intro: 'Un tableau de bord gratuit qui synthétise 7 indicateurs en temps réel — dont l’indice de peur et d’avidité The Graph — en un score de 0 à 100 « est-ce le bon moment pour acheter ? ». Fonctionne dans le navigateur sans installation, en 13 langues.',
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
        { q: 'Dois-je acheter du The Graph quand l’indice est bas ?', a: 'La peur extrême a souvent été une opportunité d’accumulation, mais se fier au seul indice risque d’« attraper un couteau qui tombe ». Ce score pondère aussi RSI, MACD, multiple de Mayer, repli et croisements de moyennes, et le réduit prudemment en tendance baissière.' },
        { q: 'Comment le score de timing d’achat est-il calculé ?', a: 'Chacun des 7 indicateurs est converti en sous-score de 0 à 100 puis pondéré. Le résultat est 0–100, affiché en 5 bandes.' },
        { q: 'Est-ce gratuit ? Faut-il installer quelque chose ?', a: 'C’est entièrement gratuit et sans installation. Les données en temps réel proviennent des API publiques de CoinGecko, Binance et Alternative.me.' },
        { q: 'Quelle différence entre l’indice et le score de timing d’achat ?', a: 'L’indice est une seule mesure de sentiment (0–100) ; le score de timing d’achat est un composite de 7 indicateurs incluant l’indice (0–100).' },
        { q: 'D’où viennent les données et à quelle fréquence sont-elles actualisées ?', a: 'L’indice de peur et d’avidité vient d’Alternative.me ; les prix et bougies journalières, des API publiques de CoinGecko et Binance ; et les métriques on-chain, de CoinMetrics. L’écran se rafraîchit automatiquement environ chaque minute.' },
        { q: 'Dois-je acheter du The Graph maintenant ?', a: 'Il n’y a pas de réponse unique, mais le score de timing d’achat (0–100) permet d’évaluer objectivement si le marché est en zone de survente/peur ou de surchauffe/avidité. Dans l’onglet long terme (contrarian), des scores élevés marquent des zones où peur et sous-évaluation se recoupent — historiquement favorables au DCA — tandis que des scores bas signalent la surchauffe. C’est un signal de référence, pas un conseil en investissement.' },
        { q: 'Quelle différence entre le timing court terme et long terme ?', a: 'Le score est divisé en deux onglets. Le court terme (momentum) adopte une vue de suivi de tendance sur 1 à 3 mois et monte avec les tendances haussières fortes ; le long terme (contrarian) adopte une vue de cycle d’un an et plus et monte avec la peur et la sous-évaluation. Dans les backtests depuis 2017, le momentum a mieux fonctionné à court terme et le contrarian à long terme.' },
        { q: 'Qu’est-ce que le BOTTOM RADAR (score de plancher) ?', a: 'Une jauge auxiliaire qui utilise des métriques on-chain comme le MVRV Z-Score pour mesurer où se situe la capitalisation par rapport au coût moyen des investisseurs, en montrant la proximité des zones de plancher historiques sur une échelle de 0 à 100. Le calcul complet est publié sur la page « plancher du Bitcoin ».' }
      ],
      disclaimer: '⚠ Ce score est un signal de référence issu d’indicateurs publics, pas un conseil en investissement. Toutes les décisions et la responsabilité vous appartiennent.'
    },
    de: {
      title: 'The Graph Angst- & Gier-Index & Kaufzeitpunkt-Score',
      intro: 'Ein kostenloses Dashboard, das 7 Echtzeit-Indikatoren — inkl. The Graph Angst- & Gier-Index — zu einem 0–100-Score „Ist jetzt ein guter Kaufzeitpunkt?“ zusammenführt. Läuft im Browser ohne Installation, in 13 Sprachen.',
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
        { q: 'Soll ich The Graph kaufen, wenn der Index niedrig ist?', a: 'Extreme Angst war historisch oft eine Akkumulationschance, doch sich allein auf den Index zu verlassen, birgt das Risiko, „ins fallende Messer zu greifen“. Dieser Score gewichtet auch RSI, MACD, Mayer-Multiple, Rückgang und MA-Kreuzungen und senkt den Wert in Abwärtstrends konservativ.' },
        { q: 'Wie wird der Kaufzeitpunkt-Score berechnet?', a: 'Jeder der 7 Indikatoren wird in einen 0–100-Teil-Score umgerechnet und gewichtet. Das Ergebnis ist 0–100, in 5 Bändern dargestellt.' },
        { q: 'Ist es kostenlos? Muss ich etwas installieren?', a: 'Es ist völlig kostenlos und ohne Installation. Echtzeitdaten stammen aus den öffentlichen APIs von CoinGecko, Binance und Alternative.me.' },
        { q: 'Wie unterscheidet sich der Index vom Kaufzeitpunkt-Score?', a: 'Der Index ist eine einzelne Stimmungskennzahl (0–100); der Kaufzeitpunkt-Score ist ein Verbund aus 7 Indikatoren inkl. Index (0–100).' },
        { q: 'Woher stammen die Daten und wie oft werden sie aktualisiert?', a: 'Der Angst- & Gier-Index stammt von Alternative.me, Preise und Tageskerzen von den öffentlichen APIs von CoinGecko und Binance, On-Chain-Metriken von CoinMetrics. Der Bildschirm aktualisiert sich etwa jede Minute automatisch.' },
        { q: 'Sollte ich The Graph jetzt kaufen?', a: 'Eine eindeutige Antwort gibt es nicht, aber der Kaufzeitpunkt-Score (0–100) zeigt objektiv, ob der Markt in einer überverkauften Angst-Zone oder einer überhitzten Gier-Zone steckt. Auf dem Langfrist-Tab (antizyklisch) markieren hohe Werte Zonen, in denen Angst und Unterbewertung zusammenfallen — historisch günstig für DCA —, niedrige warnen vor Überhitzung. Ein Referenzsignal, keine Anlageberatung.' },
        { q: 'Wie unterscheiden sich kurz- und langfristiges Kauftiming?', a: 'Der Score ist in zwei Tabs geteilt. Kurzfristig (Momentum) folgt einer Trendfolge-Sicht von 1–3 Monaten und steigt mit starken Aufwärtstrends; langfristig (antizyklisch) folgt einer Zyklus-Sicht von über einem Jahr und steigt mit Angst und Unterbewertung. In Backtests seit 2017 funktionierte kurzfristig Momentum und langfristig die antizyklische Richtung besser.' },
        { q: 'Was ist der BOTTOM RADAR (Boden-Score)?', a: 'Eine Zusatzanzeige, die mit On-Chain-Metriken wie den MVRV Z-Score misst, wo die Marktkapitalisierung relativ zum durchschnittlichen Einstandskurs der Anleger liegt, und die Nähe zu historischen Bodenzonen auf einer Skala von 0–100 zeigt. Die vollständige Berechnung ist auf der Seite „Bitcoin-Boden“ veröffentlicht.' }
      ],
      disclaimer: '⚠ Dieser Score ist ein Referenzsignal aus öffentlichen Indikatoren, keine Anlageberatung. Alle Entscheidungen und die Verantwortung liegen bei Ihnen.'
    },
    it: {
      title: 'Indice di paura e avidità The Graph e punteggio di timing d’acquisto',
      intro: 'Una dashboard gratuita che sintetizza 7 indicatori in tempo reale — incluso l’indice di paura e avidità di The Graph — in un punteggio 0–100 «è il momento giusto per comprare?». Funziona nel browser senza installazione, in 13 lingue.',
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
        { q: 'Dovrei comprare The Graph quando l’indice è basso?', a: 'La paura estrema è stata spesso un’occasione di accumulo, ma affidarsi solo all’indice rischia di «prendere un coltello che cade». Questo punteggio pesa anche RSI, MACD, multiplo di Mayer, ribasso e incroci di medie, e lo riduce in modo prudente nei trend ribassisti.' },
        { q: 'Come si calcola il punteggio d’acquisto?', a: 'Ciascuno dei 7 indicatori è convertito in un sotto-punteggio 0–100 e ponderato. Il risultato è 0–100, mostrato in 5 bande.' },
        { q: 'È gratis? Serve installare qualcosa?', a: 'È completamente gratis e senza installazione. I dati in tempo reale provengono dalle API pubbliche di CoinGecko, Binance e Alternative.me.' },
        { q: 'Che differenza c’è tra l’indice e il punteggio d’acquisto?', a: 'L’indice è una singola misura di sentiment (0–100); il punteggio d’acquisto è un composito dei 7 indicatori incluso l’indice (0–100).' },
        { q: 'Da dove vengono i dati e con che frequenza si aggiornano?', a: 'L’indice di paura e avidità viene da Alternative.me; prezzi e candele giornaliere dalle API pubbliche di CoinGecko e Binance; le metriche on-chain da CoinMetrics. Lo schermo si aggiorna automaticamente circa ogni minuto.' },
        { q: 'Dovrei comprare The Graph adesso?', a: 'Non c’è una risposta unica, ma il punteggio d’acquisto (0–100) permette di valutare oggettivamente se il mercato è in zona ipervenduto/paura o surriscaldato/avidità. Nella scheda a lungo termine (contrarian), punteggi alti indicano zone in cui paura e sottovalutazione coincidono — storicamente favorevoli al PAC — mentre punteggi bassi avvertono del surriscaldamento. È un segnale di riferimento, non consulenza d’investimento.' },
        { q: 'Che differenza c’è tra timing a breve e a lungo termine?', a: 'Il punteggio è diviso in due schede. Il breve termine (momentum) adotta una visione trend-following di 1–3 mesi e sale con trend rialzisti forti; il lungo termine (contrarian) adotta una visione di ciclo oltre l’anno e sale con paura e sottovalutazione. Nei backtest dal 2017, il momentum ha funzionato meglio nel breve e il contrarian nel lungo.' },
        { q: 'Cos’è il BOTTOM RADAR (punteggio di minimo)?', a: 'Un indicatore ausiliario che usa metriche on-chain come l’MVRV Z-Score per misurare dove si trova la capitalizzazione rispetto al costo medio degli investitori, mostrando la vicinanza alle zone di minimo storiche su una scala 0–100. Il calcolo completo è pubblicato nella guida «minimo di Bitcoin».' }
      ],
      disclaimer: '⚠ Questo punteggio è un segnale di riferimento da indicatori pubblici, non consulenza d’investimento. Ogni decisione e responsabilità è tua.'
    },
    pt: {
      title: 'Índice de medo e ganância do The Graph e pontuação de momento de compra',
      intro: 'Um painel gratuito que sintetiza 7 indicadores em tempo real — incluindo o índice de medo e ganância do The Graph — numa pontuação de 0 a 100 «é uma boa hora para comprar?». Roda no navegador sem instalação, em 13 idiomas.',
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
        { q: 'Devo comprar The Graph quando o índice está baixo?', a: 'O medo extremo foi muitas vezes uma oportunidade de acumulação, mas confiar só no índice arrisca «pegar uma faca caindo». Esta pontuação também pondera RSI, MACD, múltiplo de Mayer, queda e cruzamentos de médias, e a reduz de forma conservadora em tendências de baixa.' },
        { q: 'Como a pontuação de compra é calculada?', a: 'Cada um dos 7 indicadores é convertido numa subpontuação de 0 a 100 e ponderado. O resultado é 0–100, em 5 faixas.' },
        { q: 'É grátis? Preciso instalar algo?', a: 'É totalmente grátis e sem instalação. Os dados em tempo real vêm das APIs públicas da CoinGecko, Binance e Alternative.me.' },
        { q: 'Qual a diferença entre o índice e a pontuação de compra?', a: 'O índice é uma única métrica de sentimento (0–100); a pontuação de compra é um composto de 7 indicadores incluindo o índice (0–100).' },
        { q: 'De onde vêm os dados e com que frequência são atualizados?', a: 'O índice de medo e ganância vem da Alternative.me; preços e velas diárias, das APIs públicas da CoinGecko e da Binance; e as métricas on-chain, da CoinMetrics. A tela atualiza automaticamente a cada minuto, aproximadamente.' },
        { q: 'Devo comprar The Graph agora?', a: 'Não há resposta única, mas a pontuação de compra (0–100) permite avaliar objetivamente se o mercado está em zona de sobrevenda/medo ou de superaquecimento/ganância. Na aba de longo prazo (contrária), pontuações altas marcam zonas onde medo e subvalorização coincidem — historicamente favoráveis ao DCA —, e as baixas alertam para superaquecimento. É um sinal de referência, não consultoria de investimento.' },
        { q: 'Qual a diferença entre o timing de curto e de longo prazo?', a: 'A pontuação divide-se em duas abas. O curto prazo (momentum) adota uma visão de seguimento de tendência de 1–3 meses e sobe com tendências de alta fortes; o longo prazo (contrário) adota uma visão de ciclo de mais de um ano e sobe com medo e subvalorização. Em backtests desde 2017, o momentum funcionou melhor no curto e o contrário no longo.' },
        { q: 'O que é o BOTTOM RADAR (pontuação de fundo)?', a: 'Um medidor auxiliar que usa métricas on-chain como o MVRV Z-Score para medir onde a capitalização está em relação ao custo médio dos investidores, mostrando a proximidade de zonas de fundo históricas numa escala de 0 a 100. O cálculo completo está publicado no guia «fundo do Bitcoin».' }
      ],
      disclaimer: '⚠ Esta pontuação é um sinal de referência a partir de indicadores públicos, não é consultoria de investimento. Todas as decisões e a responsabilidade são suas.'
    },
    ru: {
      title: 'Индекс страха и жадности зе-графа и оценка времени покупки',
      intro: 'Бесплатная панель, которая объединяет 7 индикаторов в реальном времени — включая индекс страха и жадности зе-графа — в оценку от 0 до 100 «подходящее ли сейчас время для покупки?». Работает в браузере без установки, на 13 языках.',
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
        { q: 'Покупать ли зе-граф, когда индекс низкий?', a: 'Крайний страх исторически часто был возможностью накопления, но полагаться только на индекс рискованно — можно «поймать падающий нож». Эта оценка также учитывает RSI, MACD, множитель Майера, просадку и пересечения средних и консервативно снижается в нисходящих трендах.' },
        { q: 'Как рассчитывается оценка покупки?', a: 'Каждый из 7 индикаторов переводится в частную оценку 0–100 и взвешивается. Результат — 0–100, в 5 диапазонах.' },
        { q: 'Это бесплатно? Нужно ли что-то устанавливать?', a: 'Полностью бесплатно и без установки. Данные в реальном времени берутся из публичных API CoinGecko, Binance и Alternative.me.' },
        { q: 'Чем индекс отличается от оценки покупки?', a: 'Индекс — одна метрика настроения (0–100); оценка покупки — составной показатель из 7 индикаторов, включая индекс (0–100).' },
        { q: 'Откуда берутся данные и как часто они обновляются?', a: 'Индекс страха и жадности — с Alternative.me; цены и дневные свечи — из публичных API CoinGecko и Binance; ончейн-метрики — из CoinMetrics. Экран автоматически обновляется примерно раз в минуту.' },
        { q: 'Стоит ли покупать зе-граф прямо сейчас?', a: 'Единственно верного ответа нет, но оценка покупки (0–100) объективно показывает, находится ли рынок в зоне перепроданности/страха или перегрева/жадности. На вкладке долгосрочного (контртрендового) взгляда высокие значения отмечают зоны, где совпадают страх и недооценка — исторически благоприятные для усреднения, — а низкие предупреждают о перегреве. Это справочный сигнал, а не инвестиционная рекомендация.' },
        { q: 'Чем отличаются краткосрочный и долгосрочный тайминг?', a: 'Оценка разделена на две вкладки. Краткосрочная (моментум) использует трендследящий взгляд на 1–3 месяца и растёт при сильных восходящих трендах; долгосрочная (контртренд) — циклический взгляд от года и растёт при страхе и недооценке. В бэктестах с 2017 года на коротком горизонте лучше работал моментум, на длинном — контртренд.' },
        { q: 'Что такое BOTTOM RADAR (оценка дна)?', a: 'Вспомогательный индикатор, который с помощью ончейн-метрик, таких как MVRV Z-оценка, измеряет положение капитализации относительно средней цены входа инвесторов и показывает близость к историческим зонам дна по шкале 0–100. Полный расчёт опубликован на странице «дно биткоина».' }
      ],
      disclaimer: '⚠ Эта оценка — справочный сигнал на основе публичных индикаторов, а не инвестиционная рекомендация. Все решения и ответственность — на вас.'
    },
    nl: {
      title: 'The Graph Angst- & Hebzucht-index en koopmoment-score',
      intro: 'Een gratis dashboard dat 7 realtime indicatoren — inclusief de The Graph Angst- & Hebzucht-index — samenvoegt tot een score van 0–100 voor «is het nu een goed moment om te kopen?». Draait in de browser zonder installatie, in 13 talen.',
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
        { q: 'Moet ik The Graph kopen als de index laag is?', a: 'Extreme angst was vaak een accumulatiekans, maar alleen op de index vertrouwen riskeert «een vallend mes te vangen». Deze score weegt ook RSI, MACD, Mayer Multiple, daling en gemiddelde-kruisingen mee, en verlaagt de score behoudend in dalende trends.' },
        { q: 'Hoe wordt de koopmoment-score berekend?', a: 'Elk van de 7 indicatoren wordt omgezet naar een deelscore van 0–100 en gewogen. Het resultaat is 0–100, in 5 banden.' },
        { q: 'Is het gratis? Moet ik iets installeren?', a: 'Het is volledig gratis en zonder installatie. Realtime data komt van de publieke API’s van CoinGecko, Binance en Alternative.me.' },
        { q: 'Wat is het verschil tussen de index en de koopmoment-score?', a: 'De index is één sentimentmaatstaf (0–100); de koopmoment-score is een samenstelling van 7 indicatoren inclusief de index (0–100).' },
        { q: 'Waar komen de gegevens vandaan en hoe vaak worden ze ververst?', a: 'De Angst- & Hebzucht-index komt van Alternative.me; prijzen en dagcandles van de publieke API’s van CoinGecko en Binance; on-chain-metrieken van CoinMetrics. Het scherm ververst ongeveer elke minuut automatisch.' },
        { q: 'Moet ik nu The Graph kopen?', a: 'Er is geen eenduidig antwoord, maar de koopmoment-score (0–100) geeft een objectief beeld of de markt in een oversold/angst-zone of een oververhitte/hebzucht-zone zit. Op het langetermijn-tabblad (tegendraads) markeren hoge scores zones waar angst en onderwaardering samenvallen — historisch gunstig voor DCA — terwijl lage scores waarschuwen voor oververhitting. Het is een referentiesignaal, geen beleggingsadvies.' },
        { q: 'Hoe verschillen korte- en langetermijn-kooptiming?', a: 'De score is verdeeld over twee tabbladen. Korte termijn (momentum) hanteert een trendvolgende blik van 1–3 maanden en stijgt bij sterke opwaartse trends; lange termijn (tegendraads) hanteert een cyclusblik van ruim een jaar en stijgt bij angst en onderwaardering. In backtests sinds 2017 werkte momentum beter op korte termijn en tegendraads beter op lange termijn.' },
        { q: 'Wat is de BOTTOM RADAR (bodemscore)?', a: 'Een hulpmeter die met on-chain-metrieken zoals de MVRV Z-score meet waar de marktkapitalisatie staat ten opzichte van de gemiddelde kostprijs van beleggers, en de nabijheid van historische bodemzones toont op een schaal van 0–100. De volledige berekening staat op de pagina «Bitcoin-bodem».' }
      ],
      disclaimer: '⚠ Deze score is een referentiesignaal uit publieke indicatoren, geen beleggingsadvies. Alle beslissingen en verantwoordelijkheid zijn van uzelf.'
    },
    th: {
      title: 'ดัชนีความกลัวและความโลภเดอะกราฟ และคะแนนจังหวะซื้อ',
      intro: 'แดชบอร์ดฟรีที่รวม 7 ตัวชี้วัดแบบเรียลไทม์ — รวมถึงดัชนีความกลัวและความโลภของเดอะกราฟ — เป็นคะแนน 0–100 ว่า “ตอนนี้เป็นจังหวะซื้อหรือไม่?” ใช้งานในเบราว์เซอร์ได้ทันที ไม่ต้องติดตั้ง รองรับ 13 ภาษา',
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
        { q: 'ถ้าดัชนีต่ำควรซื้อเดอะกราฟไหม?', a: 'ความกลัวสุดขีดในอดีตมักเป็นโอกาสทยอยซื้อ แต่ดูเพียงดัชนีอย่างเดียวเสี่ยง “รับมีดที่กำลังตก” คะแนนนี้ยังพิจารณา RSI, MACD, Mayer Multiple, การย่อ และการตัดกันของเส้นเฉลี่ย และลดคะแนนอย่างระมัดระวังในแนวโน้มขาลง' },
        { q: 'คะแนนจังหวะซื้อคำนวณอย่างไร?', a: 'แปลงแต่ละตัวชี้วัดทั้ง 7 เป็นคะแนนย่อย 0–100 แล้วถ่วงน้ำหนักรวมกัน ผลลัพธ์คือ 0–100 แสดงเป็น 5 ระดับ' },
        { q: 'ฟรีไหม? ต้องติดตั้งไหม?', a: 'ฟรีทั้งหมดและไม่ต้องติดตั้ง ข้อมูลเรียลไทม์มาจาก API สาธารณะของ CoinGecko, Binance และ Alternative.me' },
        { q: 'ดัชนีกับคะแนนจังหวะซื้อต่างกันอย่างไร?', a: 'ดัชนีเป็นตัวชี้วัดอารมณ์เดียว (0–100); คะแนนจังหวะซื้อเป็นคะแนนรวมจาก 7 ตัวชี้วัดรวมถึงดัชนี (0–100)' },
        { q: 'ข้อมูลมาจากไหน อัปเดตบ่อยแค่ไหน?', a: 'ดัชนีความกลัว-ความโลภมาจาก Alternative.me ราคาและแท่งเทียนรายวันมาจาก API สาธารณะของ CoinGecko และ Binance ส่วนตัวชี้วัดออนเชนมาจาก CoinMetrics หน้าจออัปเดตอัตโนมัติราวทุก 1 นาที' },
        { q: 'ตอนนี้ควรซื้อเดอะกราฟไหม?', a: 'ไม่มีคำตอบตายตัว แต่คะแนนจังหวะซื้อ (0–100) ช่วยประเมินอย่างเป็นกลางว่าตลาดอยู่ในโซนขายมากเกิน/ความกลัว หรือโซนร้อนแรง/ความโลภ ในแท็บระยะยาว (สวนตลาด) คะแนนยิ่งสูงหมายถึงโซนที่ความกลัวและราคาต่ำกว่ามูลค่าทับซ้อนกัน ซึ่งในอดีตเอื้อต่อ DCA ส่วนคะแนนต่ำเตือนถึงความร้อนแรง เป็นเพียงสัญญาณอ้างอิง ไม่ใช่คำแนะนำการลงทุน' },
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
  /* 푸터 설명 문단(.foot-desc) — 더그래프 언급이 있어 공통 foot-i18n.js 가 아니라 여기에 둔다 */
  var FOOT_DESC = {
    ko: 'broodev는 설치 없이 브라우저에서 바로 쓰는 무료 웹앱을 만드는 앱 포트폴리오입니다. 이 페이지의 더그래프 공포·탐욕 지수와 매수 타이밍 점수는 공개 지표를 합성한 참고 정보이며 투자 자문이 아닙니다. 광고는 Google AdSense를 통해 게재될 수 있습니다.',
    en: 'broodev is a portfolio of free web apps that run right in your browser with no install. The The Graph Fear & Greed Index and buy-timing score on this page are reference information synthesized from public indicators, not investment advice. Ads may be served through Google AdSense.',
    ja: 'broodevは、インストール不要でブラウザからすぐ使える無料Webアプリを作るアプリポートフォリオです。このページのザ・グラフ恐怖・強欲指数と買い時スコアは公開指標を合成した参考情報であり、投資助言ではありません。広告はGoogle AdSenseを通じて掲載される場合があります。',
    zh: 'broodev 是一个应用作品集，制作无需安装、在浏览器中即可直接使用的免费网页应用。本页的The Graph恐惧与贪婪指数和买入时机评分是综合公开指标得出的参考信息，不构成投资建议。广告可能通过 Google AdSense 投放。',
    'zh-Hant': 'broodev 是一個應用作品集，製作無需安裝、在瀏覽器中即可直接使用的免費網頁應用。本頁的The Graph恐懼與貪婪指數和買入時機評分是綜合公開指標得出的參考資訊，不構成投資建議。廣告可能透過 Google AdSense 刊登。',
    th: 'broodev คือพอร์ตโฟลิโอแอปที่สร้างเว็บแอปฟรีซึ่งใช้งานได้ทันทีในเบราว์เซอร์โดยไม่ต้องติดตั้ง ดัชนีความกลัว-ความโลภเดอะกราฟและคะแนนจังหวะซื้อในหน้านี้เป็นข้อมูลอ้างอิงที่สังเคราะห์จากตัวชี้วัดสาธารณะ ไม่ใช่คำแนะนำการลงทุน โฆษณาอาจแสดงผ่าน Google AdSense',
    es: 'broodev es un portafolio de aplicaciones web gratuitas que funcionan directamente en el navegador, sin instalación. El Índice de Miedo y Codicia de The Graph y la puntuación de momento de compra de esta página son información de referencia elaborada a partir de indicadores públicos, no asesoramiento de inversión. Los anuncios pueden mostrarse a través de Google AdSense.',
    fr: 'broodev est un portfolio d’applications web gratuites qui s’utilisent directement dans le navigateur, sans installation. L’indice Peur & Avidité du The Graph et le score de timing d’achat de cette page sont des informations de référence issues d’indicateurs publics, et non un conseil en investissement. Des annonces peuvent être diffusées via Google AdSense.',
    de: 'broodev ist ein Portfolio kostenloser Web-Apps, die ohne Installation direkt im Browser laufen. Der The Graph-Angst-und-Gier-Index und der Kauf-Timing-Score auf dieser Seite sind aus öffentlichen Indikatoren zusammengesetzte Referenzinformationen und keine Anlageberatung. Werbung kann über Google AdSense ausgeliefert werden.',
    it: 'broodev è un portfolio di web app gratuite che funzionano direttamente nel browser, senza installazione. L’Indice di Paura e Avidità di The Graph e il punteggio di timing d’acquisto in questa pagina sono informazioni di riferimento ricavate da indicatori pubblici, non una consulenza di investimento. Gli annunci possono essere pubblicati tramite Google AdSense.',
    pt: 'O broodev é um portefólio de aplicações web gratuitas que funcionam diretamente no navegador, sem instalação. O Índice de Medo e Ganância do The Graph e a pontuação de momento de compra desta página são informação de referência sintetizada a partir de indicadores públicos, não aconselhamento de investimento. Os anúncios podem ser apresentados através do Google AdSense.',
    ru: 'broodev — это портфолио бесплатных веб-приложений, которые работают прямо в браузере без установки. Индекс страха и жадности зе-графа и оценка момента покупки на этой странице — справочная информация, собранная из открытых индикаторов, а не инвестиционная рекомендация. Реклама может показываться через Google AdSense.',
    nl: 'broodev is een portfolio van gratis webapps die zonder installatie direct in je browser werken. De The Graph Angst- en Hebzuchtindex en de koop-timingscore op deze pagina zijn referentie-informatie samengesteld uit openbare indicatoren, geen beleggingsadvies. Advertenties kunnen via Google AdSense worden getoond.'
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
    "title": "The Graph (GRT) Buy-Timing Score — an Indicator Dashboard",
    "intro": "Using the daily price of The Graph (GRT), the blockchain data-indexing protocol, this page calculates RSI(14), MACD(12·26·9), the Mayer Multiple, the drawdown from the 365-day high and the 50/200 golden/death cross, then adds the market-wide Fear & Greed Index and an MVRV Z-Score slot to bring seven indicators together on one screen. GRT has no MVRV data, so the 0–100 score is built from the other indicators. It is free and ready to use.",
    "coinH": "What is The Graph (GRT)?",
    "coinP": [
     "The Graph is a decentralized indexing protocol that organizes blockchain data so it can be queried with GraphQL. Yaniv Tal, Brandon Ramirez and Jannis Pohlmann started the project in 2018, and its mainnet and the GRT token launched on Ethereum in December 2020. Developers define ‘subgraphs’ that specify which on-chain data to index and how, and applications such as decentralized finance (DeFi) apps use them to fetch the data they need quickly.",
     "The Graph is not a blockchain of its own but a protocol running on Ethereum-based chains, and GRT is an ERC-20 token. Indexers stake GRT and process queries to earn fees and indexing rewards, and part of their stake can be slashed if they serve incorrect data. Curators signal useful subgraphs with GRT, and delegators entrust GRT to indexers to share in their rewards. Core protocol functions such as indexing rewards had moved to Arbitrum, an Ethereum layer 2, by 2024. The initial supply was 10 billion GRT; indexing rewards add new tokens each year, while a share of query fees and other charges is burned."
    ],
    "applyH": "Applying the indicators to The Graph",
    "apply": [
     "Volatility and correlation: GRT is an altcoin with a far smaller market cap than Bitcoin, so it swings harder when the whole market moves and generally travels in the same direction as Bitcoin. Even when RSI flags oversold, check whether Bitcoin’s trend has turned.",
     "Fear & Greed: this is not a GRT-specific value but Alternative.me’s market-wide index. Protocol-specific factors such as query demand or indexer participation are not captured in it.",
     "MVRV: the CoinMetrics community API has no GRT data, so the MVRV Z-Score is N/A and the buy-timing score is produced by rebalancing the weights of the other indicators.",
     "Mayer Multiple and drawdown: the drawdown is measured against the past 365 days only, so the long slide since the all-time high of February 2021 may not show up in it. Do not read the Bitcoin-derived thresholds (0.8 and 2.4; −30% and −50%) as undervaluation signals for GRT at face value.",
     "Rising supply: because indexing rewards keep adding new GRT, the dilution effect cannot be seen in indicators that look only at price."
    ],
    "histH": "The Graph price cycles at a glance",
    "hist": [
     "December 2020: GRT was listed on major exchanges, including Coinbase, as the mainnet launched.",
     "February 2021: Hit an all-time high of about $2.8 during the altcoin rally.",
     "2022: Dropped more than 95% from its peak in the bear market.",
     "Early 2023: Rebounded sharply over a short period as interest piled into AI-related coins.",
     "2024: The centralized hosted service shut down in June, moving subgraphs to the decentralized network. Even in that year’s bull market, the price stayed far below its 2021 peak."
    ],
    "faq": [
     {
      "q": "Doesn’t The Graph have its own Fear & Greed Index?",
      "a": "Alternative.me does not publish separate indexes for each coin. The value on this page is a crypto-market-wide index calculated with Bitcoin at its centre, and it is labelled “market-wide” on screen. For GRT’s own overheating or slump, look at RSI, MACD and the moving averages calculated from GRT’s price."
     },
     {
      "q": "Why is the MVRV Z-Score empty on the GRT page?",
      "a": "Because the CoinMetrics community API used by this page does not provide MVRV for GRT. The card shows N/A, and the buy-timing score is calculated from the remaining indicators only."
     },
     {
      "q": "If the score says STRONG BUY, should I buy GRT?",
      "a": "Investment decisions are yours, and this page does not recommend buying. In the default ‘Long · Contrarian’ mode, 80 or above (STRONG BUY) means several indicators point to oversold and undervalued conditions at once, and below 25 (OVERHEATED) means overheating signals are stacking up. GRT has been through a long decline since its 2021 peak, so rather than relying on the score alone, also watch for a change in direction in trend indicators such as the 50/200 moving-average cross."
     },
     {
      "q": "Are protocol metrics such as query demand or indexer staking included?",
      "a": "No. The score uses only GRT price data (CoinGecko, Binance) and the market-wide Fear & Greed Index. Usage metrics such as query fees, the number of subgraphs and the amount staked need to be checked in separate sources such as Graph Explorer."
     },
     {
      "q": "GRT is an Ethereum token — should I look at the Ethereum score instead?",
      "a": "GRT is an ERC-20 token, but it trades at its own price, so this page calculates the indicators from GRT’s price alone. Ethereum gas fees and network activity are not part of the score; the score for Ethereum itself is on the Ethereum page."
     },
     {
      "q": "Why can the GRT score point in opposite directions in short-term and long-term mode?",
      "a": "The ‘Short · Momentum’ mode scores higher when the trend is strong and RSI is high, while the ‘Long · Contrarian’ mode scores higher with fear, oversold readings and deep drawdowns. The same GRT price data can therefore produce conflicting scores in the two modes, so use the one that matches your time horizon."
     }
    ]
   },
   "ja": {
    "title": "ザ・グラフ(GRT)の買い時スコア — 指標ダッシュボード",
    "intro": "ブロックチェーンのデータ・インデックス・プロトコルであるザ・グラフ(GRT)の日足価格から、RSI(14)、MACD(12・26・9)、マイヤー倍率、365日高値からの下落率、50/200のゴールデン/デッドクロスを計算し、市場全体の恐怖・強欲指数とMVRV Zスコアの枠を加えて7指標を1画面にまとめました。GRTにはMVRVデータがないため、0〜100のスコアは他の指標で算出します。無料ですぐに使えます。",
    "coinH": "ザ・グラフ(GRT)とは？",
    "coinP": [
     "ザ・グラフは、ブロックチェーンのデータをインデックス化してGraphQLで照会できるようにする分散型インデックス・プロトコルです。ヤニフ・タル、ブランドン・ラミレス、ヤニス・ポールマンが2018年にプロジェクトを始め、2020年12月にイーサリアム上でメインネットとGRTトークンを公開しました。開発者は「サブグラフ」でどのオンチェーンデータをどうインデックス化するかを定義し、分散型金融(DeFi)アプリなどはそれを通じて必要なデータをすばやく取得します。",
     "ザ・グラフは独自のブロックチェーンではなくイーサリアム系チェーン上で動くプロトコルで、GRTはERC-20トークンです。インデクサーはGRTをステーキングしてクエリを処理し、手数料とインデックス報酬を得ますが、誤ったデータを返すとステークの一部が削減(スラッシング)されることがあります。キュレーターは有用なサブグラフにGRTでシグナルを送り、デリゲーターはインデクサーにGRTを預けて報酬を分け合います。インデックス報酬などプロトコルの主要機能は、2024年までにイーサリアムのレイヤー2であるArbitrumへ移されました。初期供給量は100億GRTで、インデックス報酬として毎年新しいGRTが発行される一方、クエリ手数料などの一部はバーンされます。"
    ],
    "applyH": "ザ・グラフに指標を当てはめるときの注意点",
    "apply": [
     "ボラティリティと相関：GRTはビットコインよりはるかに時価総額の小さいアルトコインなので、市場全体が動くとより大きく揺れ、おおむねビットコインと同じ方向に動きます。RSIが売られすぎを示しても、ビットコインのトレンドが転換したかどうかをあわせて確認しましょう。",
     "恐怖・強欲指数：GRT専用の値ではなく、Alternative.meの市場全体の指数です。クエリ需要やインデクサーの参加状況といったプロトコル固有の要因は含まれていません。",
     "MVRV：CoinMetricsコミュニティAPIにGRTのデータがないためMVRV ZスコアはN/Aとなり、買い時スコアは他の指標の重みを調整し直して算出されます。",
     "マイヤー倍率と下落率：下落率は直近365日だけを基準にするため、2021年2月の史上最高値以来の長期下落はこの数値に表れないことがあります。ビットコインのサイクルから決めた基準(0.8と2.4、−30%と−50%)を、GRTの割安シグナルとしてそのまま読まないでください。",
     "供給の増加：インデックス報酬で新しいGRTが増え続ける仕組みなので、価格だけを見る指標では希薄化の影響をつかめません。"
    ],
    "histH": "ザ・グラフの価格サイクルの要約",
    "hist": [
     "2020年12月：メインネットの公開と同時に、Coinbaseなど主要取引所にGRTが上場しました。",
     "2021年2月：アルトコインの上昇相場のなか、約2.8ドルの史上最高値を付けました。",
     "2022年：弱気相場で高値から95%以上下落しました。",
     "2023年初め：AI関連コインに関心が集まり、短期間で大きく反発しました。",
     "2024年：6月に中央集権型のホステッドサービスが終了し、サブグラフは分散型ネットワークへ移行しました。同年の上昇相場でも、価格は2021年の高値に遠く及びませんでした。"
    ],
    "faq": [
     {
      "q": "ザ・グラフ独自の恐怖・強欲指数はないのですか？",
      "a": "Alternative.meはコインごとに個別の指数を出していません。このページの値はビットコインを中心に算出される暗号資産市場全体の指数で、画面上でも「市場全体」と表記しています。GRT自体の過熱や低迷は、GRTの価格から計算するRSI・MACD・移動平均で確認してください。"
     },
     {
      "q": "GRTのページでMVRV Zスコアが空欄なのはなぜですか？",
      "a": "このページが使うCoinMetricsコミュニティAPIが、GRTのMVRVを提供していないためです。カードにはN/Aが表示され、買い時スコアは残りの指標だけで計算されます。"
     },
     {
      "q": "スコアがSTRONG BUYなら、GRTを買うべきですか？",
      "a": "投資判断はご自身で行うものであり、このページは購入を勧めていません。初期設定の「長期 · 逆張り」モードでは、80以上(STRONG BUY)は複数の指標が同時に売られすぎ・割安を示していること、25未満(OVERHEATED)は過熱シグナルが重なっていることを意味します。GRTは2021年の高値から長く下落してきたので、スコアだけに頼らず、50/200移動平均クロスなどトレンド指標の向きの変化もあわせて確認してください。"
     },
     {
      "q": "クエリ需要やインデクサーのステーキングといったプロトコル指標も反映されますか？",
      "a": "反映されません。スコアに使うのはGRTの価格データ(CoinGecko・Binance)と市場全体の恐怖・強欲指数だけです。クエリ手数料、サブグラフの数、ステーキング量といった利用状況の指標は、Graph Explorerなど別の情報源で確認する必要があります。"
     },
     {
      "q": "GRTはイーサリアムのトークンですが、イーサリアムのスコアを見るべきですか？",
      "a": "GRTはERC-20トークンですが独自の価格で取引されているため、このページはGRTの価格だけで指標を計算します。イーサリアムのガス代やネットワーク利用状況はスコアに含まれず、イーサリアム自体のスコアはイーサリアムのページで確認できます。"
     },
     {
      "q": "短期モードと長期モードでGRTのスコアが逆になるのはなぜですか？",
      "a": "「短期 · モメンタム」モードはトレンドが強くRSIが高いほどスコアを高くし、「長期 · 逆張り」モードは恐怖・売られすぎ・深い下落ほどスコアを高くします。同じGRTの価格データでも2つのモードでスコアが食い違うことがあるので、ご自身の投資期間に合うほうを見てください。"
     }
    ]
   },
   "ko": {
    "title": "더그래프(GRT) 매수 타이밍 점수 — 지표 대시보드",
    "intro": "블록체인 데이터 인덱싱 프로토콜 더그래프(GRT)의 일봉 가격으로 RSI(14), MACD(12·26·9), 마이어 배수, 365일 고점 대비 낙폭, 50/200 골든·데드 크로스를 계산하고, 시장 전체 공포·탐욕 지수와 MVRV Z-점수 칸을 더해 7개 지표를 한 화면에 모았습니다. GRT는 MVRV 데이터가 없어 나머지 지표로 0~100 점수를 매기며, 무료로 바로 쓸 수 있습니다.",
    "coinH": "더그래프(GRT)란?",
    "coinP": [
     "더그래프는 블록체인 데이터를 색인해 GraphQL로 조회할 수 있게 해 주는 탈중앙 인덱싱 프로토콜입니다. 야니브 탈, 브랜든 라미레즈, 야니스 폴만이 2018년 프로젝트를 시작했고, 2020년 12월 이더리움에서 메인넷과 GRT 토큰을 내놓았습니다. 개발자는 ‘서브그래프’로 어떤 온체인 데이터를 어떻게 색인할지 정의하고, 탈중앙 금융(DeFi) 앱 등은 이를 통해 필요한 데이터를 빠르게 불러옵니다.",
     "더그래프는 자체 블록체인이 아니라 이더리움 계열 체인 위에서 동작하는 프로토콜이며, GRT는 ERC-20 토큰입니다. 인덱서는 GRT를 스테이킹하고 쿼리를 처리해 수수료와 인덱싱 보상을 받으며, 잘못된 데이터를 내면 스테이킹 일부가 삭감(슬래싱)될 수 있습니다. 큐레이터는 유용한 서브그래프에 GRT로 신호를 보내고, 위임자는 인덱서에게 GRT를 맡겨 보상을 나눠 받습니다. 인덱싱 보상 등 프로토콜의 주요 기능은 2024년까지 이더리움 레이어 2인 Arbitrum으로 옮겨졌습니다. 초기 공급량은 100억 개이며, 인덱싱 보상으로 해마다 새 GRT가 발행되는 한편 쿼리 수수료 등의 일부는 소각됩니다."
    ],
    "applyH": "더그래프에 지표를 적용할 때",
    "apply": [
     "변동성·상관관계: GRT는 비트코인보다 시가총액이 훨씬 작은 알트코인이라 시장 전체가 움직일 때 더 크게 흔들리고, 대체로 비트코인과 같은 방향으로 움직입니다. RSI가 과매도를 가리켜도 비트코인 추세가 돌아섰는지 함께 확인하는 것이 좋습니다.",
     "공포·탐욕 지수: GRT 전용 값이 아니라 Alternative.me의 시장 전체 지수입니다. 쿼리 수요나 인덱서 참여 같은 프로토콜 고유 요인은 여기에 담기지 않습니다.",
     "MVRV: CoinMetrics 커뮤니티 API에 GRT 데이터가 없어 MVRV Z-점수는 N/A이고, 매수 타이밍 점수는 나머지 지표의 가중치를 다시 맞춰 산출됩니다.",
     "마이어 배수·낙폭: 낙폭은 최근 365일만 기준으로 삼기 때문에, 2021년 2월 사상 최고가 이후의 장기 하락은 이 수치에 드러나지 않을 수 있습니다. 비트코인 사이클로 정한 기준(0.8과 2.4, -30%와 -50%)을 GRT의 저평가 신호로 그대로 읽지 마세요.",
     "공급 증가: 인덱싱 보상으로 새 GRT가 계속 늘어나는 구조여서, 가격만 보는 지표로는 희석 효과를 파악할 수 없습니다."
    ],
    "histH": "더그래프 가격 사이클 요약",
    "hist": [
     "2020년 12월: 메인넷 출시와 함께 GRT가 코인베이스 등 주요 거래소에 상장됐습니다.",
     "2021년 2월: 알트코인 강세장 속에 약 2.8달러로 사상 최고가를 기록했습니다.",
     "2022년: 약세장에서 고점 대비 95% 넘게 떨어졌습니다.",
     "2023년 초: 인공지능(AI) 관련 코인에 관심이 몰리면서 짧은 기간에 크게 반등했습니다.",
     "2024년: 6월 중앙화 호스티드 서비스가 종료되며 서브그래프가 탈중앙 네트워크로 옮겨졌습니다. 그해 상승장에서도 가격은 2021년 고점에 크게 못 미쳤습니다."
    ],
    "faq": [
     {
      "q": "더그래프만의 공포·탐욕 지수는 없나요?",
      "a": "Alternative.me는 코인마다 지수를 따로 내지 않습니다. 이 화면에 나오는 값은 비트코인을 중심으로 산출되는 암호화폐 시장 전체 지수이며, 화면에도 ‘시장 전체’로 표기됩니다. GRT 자체의 과열이나 침체는 GRT 가격으로 계산하는 RSI·MACD·이동평균에서 살펴보세요."
     },
     {
      "q": "GRT 화면의 MVRV Z-점수가 비어 있는 이유는 무엇인가요?",
      "a": "이 화면이 쓰는 CoinMetrics 커뮤니티 API가 GRT의 MVRV를 제공하지 않기 때문입니다. 카드에는 N/A가 표시되고, 매수 타이밍 점수는 나머지 지표만으로 계산됩니다."
     },
     {
      "q": "점수가 STRONG BUY면 GRT를 사야 하나요?",
      "a": "투자 판단은 본인의 몫이며, 이 화면은 매수를 권하지 않습니다. 기본값인 ‘장기 · 역발상’ 모드에서 80 이상(STRONG BUY)은 여러 지표가 동시에 과매도·저평가 쪽을 가리킨다는 뜻이고, 25 미만(OVERHEATED)은 과열 신호가 겹쳤다는 뜻입니다. GRT는 2021년 고점 이후 긴 하락을 겪었으므로, 점수 하나에 기대기보다 50/200 이동평균 크로스 같은 추세 지표의 방향 변화도 함께 확인하세요."
     },
     {
      "q": "쿼리 수요나 인덱서 스테이킹 같은 프로토콜 지표도 반영되나요?",
      "a": "반영되지 않습니다. 점수는 GRT 가격 데이터(CoinGecko·Binance)와 시장 전체 공포·탐욕 지수만 사용합니다. 쿼리 수수료, 서브그래프 수, 스테이킹 규모 같은 사용량 지표는 Graph Explorer 같은 별도 자료에서 확인해야 합니다."
     },
     {
      "q": "GRT는 이더리움 토큰인데 이더리움 점수를 봐야 하나요?",
      "a": "GRT는 ERC-20 토큰이지만 독자적인 가격으로 거래되므로, 이 화면은 GRT 가격만으로 지표를 계산합니다. 이더리움 가스비나 네트워크 사용량은 점수에 들어가지 않으며, 이더리움 자체의 점수는 이더리움 화면에서 따로 볼 수 있습니다."
     },
     {
      "q": "단기 모드와 장기 모드에서 GRT 점수가 반대로 나오는 이유는 무엇인가요?",
      "a": "‘단기 · 모멘텀’ 모드는 추세가 강하고 RSI가 높을수록 점수를 높게, ‘장기 · 역발상’ 모드는 공포·과매도·깊은 낙폭일수록 점수를 높게 매깁니다. 같은 GRT 가격 데이터라도 두 모드의 점수가 엇갈릴 수 있으니, 자신의 투자 기간에 맞는 쪽을 보세요."
     }
    ]
   },
   "zh": {
    "title": "The Graph(GRT)买入时机评分——指标仪表板",
    "intro": "本页根据区块链数据索引协议The Graph(GRT)的日线价格，计算RSI(14)、MACD(12·26·9)、梅耶倍数、距365日高点回撤和50/200金叉/死叉，再加上全市场恐惧与贪婪指数和MVRV Z分数栏位，把7项指标集中在一个页面。GRT没有MVRV数据，因此0–100评分由其余指标得出。免费，即开即用。",
    "coinH": "什么是The Graph(GRT)？",
    "coinP": [
     "The Graph是一种去中心化索引协议，它为区块链数据建立索引，使其可以通过GraphQL查询。Yaniv Tal、Brandon Ramirez和Jannis Pohlmann于2018年启动该项目，2020年12月在以太坊上推出主网和GRT代币。开发者通过“子图”定义要索引哪些链上数据以及如何索引，去中心化金融(DeFi)应用等则借此快速获取所需数据。",
     "The Graph不是独立的区块链，而是运行在以太坊系链上的协议，GRT是ERC-20代币。索引者质押GRT并处理查询，以获得手续费和索引奖励；如果提供错误数据，部分质押可能被罚没。策展人用GRT为有用的子图发出信号，委托人则把GRT委托给索引者以分享奖励。索引奖励等协议核心功能已在2024年前迁移到以太坊二层网络Arbitrum。初始供应量为100亿枚，索引奖励每年带来新增GRT，同时部分查询费用等会被销毁。"
    ],
    "applyH": "将指标用于The Graph时的注意事项",
    "apply": [
     "波动性与相关性：GRT是市值远小于比特币的山寨币，整体市场波动时摆动更大，走势也大体与比特币同向。即使RSI显示超卖，也最好确认比特币的趋势是否已经转向。",
     "恐惧与贪婪指数：这不是GRT专属数值，而是Alternative.me的全市场指数，查询需求、索引者参与度等协议自身因素并未包含在内。",
     "MVRV：CoinMetrics社区API没有GRT数据，因此MVRV Z分数为N/A，买入时机评分通过重新平衡其他指标的权重得出。",
     "梅耶倍数与回撤：回撤只以最近365天为基准，2021年2月创下历史最高价以来的长期下跌可能不会反映在这个数值里。不要把依据比特币周期设定的阈值(0.8与2.4、−30%与−50%)直接当作GRT的低估信号。",
     "供应增加：索引奖励不断带来新增GRT，只看价格的指标无法体现稀释效应。"
    ],
    "histH": "The Graph价格周期概览",
    "hist": [
     "2020年12月：主网上线的同时，GRT登陆Coinbase等主要交易所。",
     "2021年2月：在山寨币牛市中创下约2.8美元的历史最高价。",
     "2022年：熊市中较高点下跌超过95%。",
     "2023年初：随着资金涌向AI相关币种，短期内大幅反弹。",
     "2024年：6月中心化托管服务关闭，子图迁移到去中心化网络。即便在当年的牛市中，价格也远低于2021年高点。"
    ],
    "faq": [
     {
      "q": "The Graph没有自己的恐惧与贪婪指数吗？",
      "a": "Alternative.me不会为每个币种单独发布指数。本页显示的是以比特币为中心计算的全加密市场指数，页面上也标注为“全市场”。GRT本身是否过热或低迷，请查看基于GRT价格计算的RSI、MACD和均线。"
     },
     {
      "q": "为什么GRT页面的MVRV Z分数是空的？",
      "a": "因为本页使用的CoinMetrics社区API不提供GRT的MVRV。卡片显示N/A，买入时机评分仅用其余指标计算。"
     },
     {
      "q": "评分显示STRONG BUY，就该买GRT吗？",
      "a": "投资决定由您自己做出，本页不建议买入。在默认的“长期 · 逆向”模式下，80分以上(STRONG BUY)表示多项指标同时指向超卖和低估，低于25分(OVERHEATED)则表示过热信号叠加。GRT自2021年高点以来经历了长期下跌，因此不要只看评分，也要留意50/200均线交叉等趋势指标的方向变化。"
     },
     {
      "q": "查询需求、索引者质押等协议指标也会纳入吗？",
      "a": "不会。评分只使用GRT价格数据(CoinGecko、Binance)和全市场恐惧与贪婪指数。查询费用、子图数量、质押规模等使用情况指标，需要在Graph Explorer等其他来源中查看。"
     },
     {
      "q": "GRT是以太坊上的代币，应该看以太坊的评分吗？",
      "a": "GRT虽然是ERC-20代币，但有自己独立的交易价格，因此本页只用GRT价格计算指标。以太坊的Gas费和网络使用情况不计入评分，以太坊本身的评分可在以太坊页面查看。"
     },
     {
      "q": "为什么GRT在短期模式和长期模式下的评分会相反？",
      "a": "“短期 · 动量”模式在趋势强、RSI高时给出更高分，“长期 · 逆向”模式则在恐惧、超卖和深度回撤时给出更高分。同样的GRT价格数据在两种模式下可能得出相互矛盾的评分，请选择与自己投资周期相符的模式。"
     }
    ]
   },
   "zh-Hant": {
    "title": "The Graph(GRT)買入時機評分——指標儀表板",
    "intro": "本頁根據區塊鏈資料索引協定The Graph(GRT)的日線價格，計算RSI(14)、MACD(12·26·9)、梅耶倍數、距365日高點回撤與50/200黃金/死亡交叉，再加上全市場恐懼與貪婪指數和MVRV Z分數欄位，把7項指標集中在一個頁面。GRT沒有MVRV資料，因此0–100評分由其餘指標得出。免費，開啟即可使用。",
    "coinH": "什麼是The Graph(GRT)？",
    "coinP": [
     "The Graph是一種去中心化索引協定，為區塊鏈資料建立索引，使其能以GraphQL查詢。Yaniv Tal、Brandon Ramirez與Jannis Pohlmann於2018年啟動此專案，2020年12月在以太坊上推出主網與GRT代幣。開發者透過「子圖」定義要索引哪些鏈上資料以及如何索引，去中心化金融(DeFi)應用等則藉此快速取得所需資料。",
     "The Graph不是獨立的區塊鏈，而是運行在以太坊系鏈上的協定，GRT是ERC-20代幣。索引者質押GRT並處理查詢，以獲得手續費與索引獎勵；若提供錯誤資料，部分質押可能遭罰沒。策展人以GRT為有用的子圖發出訊號，委託人則把GRT委託給索引者以分享獎勵。索引獎勵等協定核心功能已在2024年前遷移至以太坊第二層網路Arbitrum。初始供應量為100億枚，索引獎勵每年帶來新增GRT，同時部分查詢費用等會被銷毀。"
    ],
    "applyH": "將指標用於The Graph時的注意事項",
    "apply": [
     "波動性與相關性：GRT是市值遠小於比特幣的山寨幣，整體市場波動時擺盪更大，走勢也大致與比特幣同向。即使RSI顯示超賣，也最好確認比特幣的趨勢是否已經轉向。",
     "恐懼與貪婪指數：這不是GRT專屬數值，而是Alternative.me的全市場指數，查詢需求、索引者參與度等協定本身的因素並未包含在內。",
     "MVRV：CoinMetrics社群API沒有GRT資料，因此MVRV Z分數為N/A，買入時機評分透過重新平衡其他指標的權重得出。",
     "梅耶倍數與回撤：回撤只以最近365天為基準，2021年2月創下歷史最高價以來的長期下跌可能不會反映在這個數值中。不要把依比特幣週期設定的門檻(0.8與2.4、−30%與−50%)直接當作GRT的低估訊號。",
     "供應增加：索引獎勵不斷帶來新增GRT，只看價格的指標無法呈現稀釋效應。"
    ],
    "histH": "The Graph價格週期概覽",
    "hist": [
     "2020年12月：主網上線的同時，GRT登上Coinbase等主要交易所。",
     "2021年2月：在山寨幣牛市中創下約2.8美元的歷史最高價。",
     "2022年：熊市中自高點下跌超過95%。",
     "2023年初：隨著資金湧向AI相關幣種，短期內大幅反彈。",
     "2024年：6月中心化託管服務關閉，子圖遷移至去中心化網路。即便在當年的牛市中，價格也遠低於2021年高點。"
    ],
    "faq": [
     {
      "q": "The Graph沒有自己的恐懼與貪婪指數嗎？",
      "a": "Alternative.me不會為每個幣種單獨發布指數。本頁顯示的是以比特幣為中心計算的全加密市場指數，頁面上也標示為「全市場」。GRT本身是否過熱或低迷，請查看以GRT價格計算的RSI、MACD與均線。"
     },
     {
      "q": "為什麼GRT頁面的MVRV Z分數是空的？",
      "a": "因為本頁使用的CoinMetrics社群API不提供GRT的MVRV。卡片顯示N/A，買入時機評分僅以其餘指標計算。"
     },
     {
      "q": "評分顯示STRONG BUY，就該買GRT嗎？",
      "a": "投資決定由您自己做出，本頁不建議買入。在預設的「長期 · 逆向」模式下，80分以上(STRONG BUY)代表多項指標同時指向超賣與低估，低於25分(OVERHEATED)則代表過熱訊號疊加。GRT自2021年高點以來經歷了長期下跌，因此不要只看評分，也要留意50/200均線交叉等趨勢指標的方向變化。"
     },
     {
      "q": "查詢需求、索引者質押等協定指標也會納入嗎？",
      "a": "不會。評分只使用GRT價格資料(CoinGecko、Binance)與全市場恐懼與貪婪指數。查詢費用、子圖數量、質押規模等使用情況指標，需要在Graph Explorer等其他來源查看。"
     },
     {
      "q": "GRT是以太坊上的代幣，應該看以太幣的評分嗎？",
      "a": "GRT雖然是ERC-20代幣，但有自己獨立的交易價格，因此本頁只用GRT價格計算指標。以太坊的Gas費與網路使用情況不計入評分，以太幣本身的評分可在以太幣頁面查看。"
     },
     {
      "q": "為什麼GRT在短期模式和長期模式下的評分會相反？",
      "a": "「短期 · 動能」模式在趨勢強、RSI高時給出較高分，「長期 · 逆向」模式則在恐懼、超賣與深度回撤時給出較高分。同樣的GRT價格資料在兩種模式下可能得出相互矛盾的評分，請選擇符合自己投資週期的模式。"
     }
    ]
   },
   "th": {
    "title": "คะแนนจังหวะซื้อเดอะกราฟ (GRT) — แดชบอร์ดตัวชี้วัด",
    "intro": "หน้านี้ใช้ราคารายวันของเดอะกราฟ (GRT) โปรโตคอลจัดทำดัชนีข้อมูลบล็อกเชน มาคำนวณ RSI(14), MACD(12·26·9), Mayer Multiple, การย่อจากจุดสูงสุด 365 วัน และ Golden/Death Cross 50/200 แล้วเพิ่มดัชนีความกลัว-ความโลภทั้งตลาดและช่อง MVRV Z-Score รวม 7 ตัวชี้วัดไว้ในหน้าเดียว GRT ไม่มีข้อมูล MVRV คะแนน 0–100 จึงคำนวณจากตัวชี้วัดอื่น ใช้ได้ฟรีทันที",
    "coinH": "เดอะกราฟ (GRT) คืออะไร?",
    "coinP": [
     "เดอะกราฟเป็นโปรโตคอลจัดทำดัชนีแบบกระจายศูนย์ ที่จัดระเบียบข้อมูลบล็อกเชนให้เรียกค้นได้ด้วย GraphQL โปรเจกต์เริ่มต้นในปี 2018 โดย Yaniv Tal, Brandon Ramirez และ Jannis Pohlmann และเปิดตัวเมนเน็ตพร้อมโทเคน GRT บนอีเธอเรียมในเดือนธันวาคม 2020 นักพัฒนากำหนด “ซับกราฟ” ว่าจะทำดัชนีข้อมูลบนเชนใดและอย่างไร แล้วแอปอย่างการเงินแบบกระจายศูนย์ (DeFi) ก็ใช้ซับกราฟเหล่านี้ดึงข้อมูลที่ต้องการได้อย่างรวดเร็ว",
     "เดอะกราฟไม่ใช่บล็อกเชนของตัวเอง แต่เป็นโปรโตคอลที่ทำงานบนเชนตระกูลอีเธอเรียม และ GRT เป็นโทเคน ERC-20 อินเด็กเซอร์ (Indexer) สเตก GRT และประมวลผลคำค้นเพื่อรับค่าธรรมเนียมและรางวัลการทำดัชนี หากส่งข้อมูลผิดอาจถูกตัดเงินสเตกบางส่วน (slashing) ภัณฑารักษ์ (Curator) ใช้ GRT ส่งสัญญาณให้ซับกราฟที่มีประโยชน์ ส่วนผู้มอบสิทธิ์ (Delegator) ฝาก GRT ไว้กับอินเด็กเซอร์เพื่อแบ่งรางวัล ฟังก์ชันหลักของโปรโตคอลอย่างรางวัลการทำดัชนีย้ายไปอยู่บน Arbitrum ซึ่งเป็นเลเยอร์ 2 ของอีเธอเรียมภายในปี 2024 อุปทานเริ่มต้นคือ 1 หมื่นล้าน GRT รางวัลการทำดัชนีทำให้มี GRT ใหม่ทุกปี ขณะที่ค่าธรรมเนียมคำค้นบางส่วนถูกเผาทิ้ง"
    ],
    "applyH": "ข้อควรรู้เมื่อใช้ตัวชี้วัดกับเดอะกราฟ",
    "apply": [
     "ความผันผวนและความสัมพันธ์: GRT เป็นอัลต์คอยน์ที่มีมูลค่าตลาดเล็กกว่าบิตคอยน์มาก จึงแกว่งแรงกว่าเมื่อตลาดทั้งหมดเคลื่อนไหว และโดยทั่วไปเคลื่อนไปทางเดียวกับบิตคอยน์ แม้ RSI จะบอกว่าขายมากเกิน ก็ควรตรวจดูด้วยว่าเทรนด์ของบิตคอยน์กลับตัวแล้วหรือยัง",
     "ดัชนีความกลัว-ความโลภ: ไม่ใช่ค่าเฉพาะของ GRT แต่เป็นดัชนีทั้งตลาดของ Alternative.me ปัจจัยเฉพาะของโปรโตคอล เช่น ความต้องการคำค้นหรือการมีส่วนร่วมของอินเด็กเซอร์ ไม่ได้รวมอยู่ในดัชนีนี้",
     "MVRV: CoinMetrics community API ไม่มีข้อมูลของ GRT ค่า MVRV Z-Score จึงเป็น N/A และคะแนนจังหวะซื้อคำนวณโดยปรับสมดุลน้ำหนักของตัวชี้วัดอื่นใหม่",
     "Mayer Multiple และการย่อตัว: การย่อตัวอิงเฉพาะ 365 วันล่าสุด ขาลงยาวนานนับจากจุดสูงสุดตลอดกาลเมื่อกุมภาพันธ์ 2021 จึงอาจไม่ปรากฏในตัวเลขนี้ อย่าอ่านเกณฑ์ที่ได้จากวัฏจักรบิตคอยน์ (0.8 และ 2.4, −30% และ −50%) เป็นสัญญาณราคาต่ำกว่ามูลค่าของ GRT ตรงๆ",
     "อุปทานที่เพิ่มขึ้น: รางวัลการทำดัชนีเพิ่ม GRT ใหม่อย่างต่อเนื่อง ตัวชี้วัดที่ดูแต่ราคาจึงจับผลของการเจือจางไม่ได้"
    ],
    "histH": "สรุปวัฏจักรราคาเดอะกราฟ",
    "hist": [
     "ธันวาคม 2020: GRT เข้าลิสต์บนกระดานเทรดหลักอย่าง Coinbase พร้อมกับการเปิดตัวเมนเน็ต",
     "กุมภาพันธ์ 2021: ทำจุดสูงสุดตลอดกาลราว 2.8 ดอลลาร์ในช่วงตลาดกระทิงของอัลต์คอยน์",
     "2022: ร่วงกว่า 95% จากจุดสูงสุดในตลาดหมี",
     "ต้นปี 2023: ดีดตัวแรงในช่วงสั้นๆ เมื่อความสนใจหลั่งไหลไปที่เหรียญเกี่ยวกับ AI",
     "2024: บริการโฮสต์แบบรวมศูนย์ปิดตัวในเดือนมิถุนายน ซับกราฟจึงย้ายไปยังเครือข่ายกระจายศูนย์ และแม้ตลาดปีนั้นจะเป็นขาขึ้น ราคาก็ยังต่ำกว่าจุดสูงสุดปี 2021 อยู่มาก"
    ],
    "faq": [
     {
      "q": "เดอะกราฟไม่มีดัชนีความกลัว-ความโลภของตัวเองหรือ?",
      "a": "Alternative.me ไม่ได้ออกดัชนีแยกตามเหรียญ ค่าในหน้านี้คือดัชนีของตลาดคริปโตทั้งหมดที่คำนวณโดยมีบิตคอยน์เป็นศูนย์กลาง และบนหน้าจอก็ระบุว่า “ทั้งตลาด” หากต้องการดูว่า GRT ร้อนแรงหรือซบเซาแค่ไหน ให้ดู RSI, MACD และเส้นเฉลี่ยที่คำนวณจากราคา GRT"
     },
     {
      "q": "ทำไมช่อง MVRV Z-Score ในหน้า GRT จึงว่าง?",
      "a": "เพราะ CoinMetrics community API ที่หน้านี้ใช้ไม่มีค่า MVRV ของ GRT การ์ดจึงแสดง N/A และคะแนนจังหวะซื้อคำนวณจากตัวชี้วัดที่เหลือเท่านั้น"
     },
     {
      "q": "ถ้าคะแนนขึ้น STRONG BUY ควรซื้อ GRT ไหม?",
      "a": "การตัดสินใจลงทุนเป็นของคุณเอง และหน้านี้ไม่ได้แนะนำให้ซื้อ ในโหมดเริ่มต้น “ยาว · สวนทาง” คะแนน 80 ขึ้นไป (STRONG BUY) หมายถึงหลายตัวชี้วัดชี้ไปที่ภาวะขายมากเกินและราคาต่ำกว่ามูลค่าพร้อมกัน ส่วนต่ำกว่า 25 (OVERHEATED) หมายถึงสัญญาณร้อนแรงเกินซ้อนกันอยู่ GRT ผ่านขาลงยาวนานนับจากจุดสูงสุดปี 2021 จึงไม่ควรดูแค่คะแนน แต่ควรดูการเปลี่ยนทิศของตัวชี้วัดเทรนด์อย่างการตัดกันของเส้นเฉลี่ย 50/200 ด้วย"
     },
     {
      "q": "ตัวชี้วัดของโปรโตคอล เช่น ความต้องการคำค้นหรือการสเตกของอินเด็กเซอร์ นับรวมด้วยไหม?",
      "a": "ไม่นับ คะแนนใช้เฉพาะข้อมูลราคา GRT (CoinGecko, Binance) และดัชนีความกลัว-ความโลภทั้งตลาด ตัวชี้วัดการใช้งานอย่างค่าธรรมเนียมคำค้น จำนวนซับกราฟ และปริมาณการสเตก ต้องดูจากแหล่งอื่น เช่น Graph Explorer"
     },
     {
      "q": "GRT เป็นโทเคนบนอีเธอเรียม ควรดูคะแนนของอีเธอเรียมแทนไหม?",
      "a": "GRT เป็นโทเคน ERC-20 แต่มีราคาซื้อขายของตัวเอง หน้านี้จึงคำนวณตัวชี้วัดจากราคา GRT เท่านั้น ค่าแก๊สและการใช้งานเครือข่ายอีเธอเรียมไม่ได้อยู่ในคะแนน ส่วนคะแนนของอีเธอเรียมเองดูได้ในหน้าอีเธอเรียม"
     },
     {
      "q": "ทำไมคะแนน GRT ในโหมดสั้นและโหมดยาวจึงออกมาสวนทางกันได้?",
      "a": "โหมด “สั้น · โมเมนตัม” ให้คะแนนสูงเมื่อเทรนด์แข็งแรงและ RSI สูง ส่วนโหมด “ยาว · สวนทาง” ให้คะแนนสูงเมื่อมีความกลัว ภาวะขายมากเกิน และการย่อตัวลึก ข้อมูลราคา GRT ชุดเดียวกันจึงอาจได้คะแนนที่ขัดกันในสองโหมด ควรเลือกดูโหมดที่ตรงกับกรอบเวลาการลงทุนของคุณ"
     }
    ]
   },
   "es": {
    "title": "The Graph (GRT): puntuación de compra y panel de indicadores",
    "intro": "Con el precio diario de The Graph (GRT), el protocolo de indexación de datos blockchain, esta página calcula el RSI(14), el MACD(12·26·9), el múltiplo de Mayer, la caída desde el máximo de 365 días y el cruce dorado/de la muerte 50/200, y suma el índice de miedo y codicia de todo el mercado y una casilla de MVRV Z-Score para reunir siete indicadores en una pantalla. GRT no tiene datos de MVRV, así que la puntuación de 0 a 100 se obtiene con los demás indicadores. Es gratuita y está lista para usar.",
    "coinH": "¿Qué es The Graph (GRT)?",
    "coinP": [
     "The Graph es un protocolo de indexación descentralizado que organiza los datos de las blockchains para poder consultarlos con GraphQL. Yaniv Tal, Brandon Ramirez y Jannis Pohlmann iniciaron el proyecto en 2018, y la red principal y el token GRT se lanzaron en Ethereum en diciembre de 2020. Los desarrolladores definen «subgrafos» que indican qué datos on-chain indexar y cómo, y aplicaciones como las de finanzas descentralizadas (DeFi) los usan para obtener rápidamente los datos que necesitan.",
     "The Graph no es una blockchain propia, sino un protocolo que funciona sobre cadenas del ecosistema Ethereum, y GRT es un token ERC-20. Los indexadores hacen staking de GRT y procesan consultas para cobrar comisiones y recompensas de indexación; si sirven datos incorrectos, parte de su stake puede ser recortada (slashing). Los curadores señalan con GRT los subgrafos útiles y los delegadores confían GRT a los indexadores para compartir sus recompensas. Funciones centrales del protocolo, como las recompensas de indexación, se trasladaron a Arbitrum, una capa 2 de Ethereum, a más tardar en 2024. El suministro inicial fue de 10.000 millones de GRT; las recompensas de indexación añaden tokens cada año, mientras que una parte de las comisiones de consulta y otros cargos se quema."
    ],
    "applyH": "Cómo aplicar los indicadores a The Graph",
    "apply": [
     "Volatilidad y correlación: GRT es una altcoin con una capitalización muy inferior a la de Bitcoin, así que oscila con más fuerza cuando se mueve todo el mercado y, en general, sigue la misma dirección que Bitcoin. Aunque el RSI marque sobreventa, comprueba también si la tendencia de Bitcoin ha cambiado.",
     "Miedo y codicia: no es un valor propio de GRT, sino el índice de todo el mercado de Alternative.me. Los factores propios del protocolo, como la demanda de consultas o la participación de los indexadores, no se recogen en él.",
     "MVRV: la API comunitaria de CoinMetrics no tiene datos de GRT, de modo que el MVRV Z-Score figura como N/A y la puntuación de compra se obtiene reequilibrando los pesos de los demás indicadores.",
     "Múltiplo de Mayer y caída: la caída se mide solo frente a los últimos 365 días, así que el largo descenso desde el máximo histórico de febrero de 2021 puede no reflejarse en ella. No interpretes los umbrales derivados de Bitcoin (0,8 y 2,4; −30 % y −50 %) como señales de infravaloración de GRT sin más.",
     "Suministro creciente: como las recompensas de indexación siguen añadiendo GRT nuevos, los indicadores que solo miran el precio no captan el efecto de dilución."
    ],
    "histH": "Resumen de los ciclos de precio de The Graph",
    "hist": [
     "Diciembre de 2020: con el lanzamiento de la red principal, GRT empezó a cotizar en grandes exchanges como Coinbase.",
     "Febrero de 2021: marcó un máximo histórico de unos 2,8 $ en pleno rally de las altcoins.",
     "2022: cayó más de un 95 % desde su máximo en el mercado bajista.",
     "Principios de 2023: rebotó con fuerza en poco tiempo, cuando el interés se volcó en las monedas relacionadas con la IA.",
     "2024: el servicio alojado centralizado cerró en junio y los subgrafos pasaron a la red descentralizada. Ni siquiera en el mercado alcista de ese año se acercó el precio a su máximo de 2021."
    ],
    "faq": [
     {
      "q": "¿The Graph no tiene su propio índice de miedo y codicia?",
      "a": "Alternative.me no publica índices separados para cada moneda. El valor de esta página es un índice de todo el mercado cripto calculado con Bitcoin como eje, y en pantalla aparece como «de todo el mercado». Para ver si GRT en sí está recalentada o estancada, consulta el RSI, el MACD y las medias móviles calculados con su precio."
     },
     {
      "q": "¿Por qué el MVRV Z-Score está vacío en la página de GRT?",
      "a": "Porque la API comunitaria de CoinMetrics que usa esta página no ofrece MVRV para GRT. La tarjeta muestra N/A y la puntuación de compra se calcula solo con los demás indicadores."
     },
     {
      "q": "Si la puntuación marca STRONG BUY, ¿debo comprar GRT?",
      "a": "Las decisiones de inversión son tuyas y esta página no recomienda comprar. En el modo predeterminado «Largo · Contrario», 80 o más (STRONG BUY) significa que varios indicadores apuntan a la vez a sobreventa e infravaloración, y menos de 25 (OVERHEATED), que se acumulan señales de sobrecalentamiento. GRT arrastra una larga caída desde su máximo de 2021, así que no te fíes solo de la puntuación: vigila también los cambios de dirección en indicadores de tendencia como el cruce de medias 50/200."
     },
     {
      "q": "¿Se incluyen métricas del protocolo como la demanda de consultas o el staking de los indexadores?",
      "a": "No. La puntuación solo usa los datos de precio de GRT (CoinGecko, Binance) y el índice de miedo y codicia del mercado. Las métricas de uso, como las comisiones de consulta, el número de subgrafos o el volumen en staking, hay que consultarlas en otras fuentes, como Graph Explorer."
     },
     {
      "q": "GRT es un token de Ethereum: ¿debería mirar la puntuación de Ethereum?",
      "a": "GRT es un token ERC-20, pero cotiza a su propio precio, así que esta página calcula los indicadores solo con el precio de GRT. Las comisiones de gas y la actividad de la red Ethereum no forman parte de la puntuación; la de Ethereum se puede ver en su propia página."
     },
     {
      "q": "¿Por qué la puntuación de GRT puede ir en sentidos opuestos en el modo corto y en el largo?",
      "a": "El modo «Corto · Momentum» puntúa más alto cuando la tendencia es fuerte y el RSI está alto, mientras que el modo «Largo · Contrario» puntúa más alto con miedo, sobreventa y caídas profundas. Por eso los mismos precios de GRT pueden dar puntuaciones contradictorias en los dos modos; usa el que encaje con tu horizonte temporal."
     }
    ]
   },
   "fr": {
    "title": "The Graph (GRT) : score de timing d’achat et tableau d’indicateurs",
    "intro": "À partir du cours quotidien de The Graph (GRT), le protocole d’indexation de données blockchain, cette page calcule le RSI(14), le MACD(12·26·9), le multiple de Mayer, le repli depuis le plus haut sur 365 jours et le croisement doré/de la mort 50/200, puis ajoute l’indice de peur et d’avidité de tout le marché et un emplacement MVRV Z-Score pour réunir sept indicateurs sur un écran. GRT n’ayant pas de données MVRV, le score de 0 à 100 repose sur les autres indicateurs. Gratuit et prêt à l’emploi.",
    "coinH": "Qu’est-ce que The Graph (GRT) ?",
    "coinP": [
     "The Graph est un protocole d’indexation décentralisé qui organise les données des blockchains pour qu’on puisse les interroger en GraphQL. Yaniv Tal, Brandon Ramirez et Jannis Pohlmann ont lancé le projet en 2018, et le réseau principal ainsi que le jeton GRT ont été lancés sur Ethereum en décembre 2020. Les développeurs définissent des « subgraphs » qui précisent quelles données on-chain indexer et comment, et des applications comme celles de la finance décentralisée (DeFi) s’en servent pour récupérer rapidement les données dont elles ont besoin.",
     "The Graph n’est pas une blockchain à part entière mais un protocole qui fonctionne sur des chaînes de l’écosystème Ethereum, et le GRT est un jeton ERC-20. Les indexeurs stakent du GRT et traitent les requêtes pour toucher des frais et des récompenses d’indexation ; s’ils fournissent des données erronées, une partie de leur mise peut être confisquée (slashing). Les curateurs signalent les subgraphs utiles avec du GRT, et les délégateurs confient du GRT aux indexeurs pour partager leurs récompenses. Les fonctions centrales du protocole, comme les récompenses d’indexation, avaient été transférées vers Arbitrum, une couche 2 d’Ethereum, en 2024. L’offre initiale était de 10 milliards de GRT ; les récompenses d’indexation ajoutent de nouveaux jetons chaque année, tandis qu’une partie des frais de requête et d’autres prélèvements est brûlée."
    ],
    "applyH": "Appliquer les indicateurs à The Graph",
    "apply": [
     "Volatilité et corrélation : le GRT est un altcoin dont la capitalisation est bien plus faible que celle du Bitcoin ; il oscille donc plus fort quand tout le marché bouge et évolue en général dans le même sens que le Bitcoin. Même si le RSI signale une survente, vérifiez aussi si la tendance du Bitcoin s’est retournée.",
     "Peur et avidité : il ne s’agit pas d’une valeur propre au GRT mais de l’indice de marché global d’Alternative.me. Les facteurs propres au protocole, comme la demande de requêtes ou la participation des indexeurs, n’y figurent pas.",
     "MVRV : l’API communautaire de CoinMetrics n’a pas de données sur le GRT ; le MVRV Z-Score est donc N/A et le score de timing d’achat est obtenu en rééquilibrant les pondérations des autres indicateurs.",
     "Multiple de Mayer et repli : le repli n’est mesuré que sur les 365 derniers jours ; la longue baisse depuis le record historique de février 2021 peut donc ne pas y apparaître. Ne lisez pas tels quels les seuils tirés du Bitcoin (0,8 et 2,4 ; −30 % et −50 %) comme des signaux de sous-évaluation du GRT.",
     "Offre croissante : comme les récompenses d’indexation ajoutent sans cesse de nouveaux GRT, les indicateurs fondés uniquement sur le prix ne captent pas l’effet de dilution."
    ],
    "histH": "Les cycles de prix de The Graph en bref",
    "hist": [
     "Décembre 2020 : avec le lancement du réseau principal, le GRT est coté sur de grandes plateformes comme Coinbase.",
     "Février 2021 : record historique d’environ 2,8 $ en pleine envolée des altcoins.",
     "2022 : chute de plus de 95 % depuis le sommet dans le marché baissier.",
     "Début 2023 : fort rebond en peu de temps, alors que l’intérêt se porte sur les cryptos liées à l’IA.",
     "2024 : le service hébergé centralisé ferme en juin et les subgraphs passent sur le réseau décentralisé. Même pendant le marché haussier de cette année-là, le cours reste très loin de son sommet de 2021."
    ],
    "faq": [
     {
      "q": "The Graph n’a-t-il pas son propre indice de peur et d’avidité ?",
      "a": "Alternative.me ne publie pas d’indice distinct pour chaque crypto. La valeur affichée ici est un indice de l’ensemble du marché crypto, calculé autour du Bitcoin, et elle est signalée comme « marché global » à l’écran. Pour savoir si le GRT lui-même surchauffe ou s’essouffle, regardez le RSI, le MACD et les moyennes mobiles calculés sur son prix."
     },
     {
      "q": "Pourquoi le MVRV Z-Score est-il vide sur la page GRT ?",
      "a": "Parce que l’API communautaire de CoinMetrics utilisée par cette page ne fournit pas de MVRV pour le GRT. La carte affiche N/A et le score de timing d’achat est calculé uniquement avec les autres indicateurs."
     },
     {
      "q": "Si le score affiche STRONG BUY, faut-il acheter du GRT ?",
      "a": "Les décisions d’investissement vous appartiennent et cette page ne recommande pas d’acheter. En mode par défaut « Long · Contrarian », un score de 80 ou plus (STRONG BUY) signifie que plusieurs indicateurs pointent à la fois vers la survente et la sous-évaluation, et un score inférieur à 25 (OVERHEATED) que les signaux de surchauffe s’accumulent. Le GRT a connu une longue baisse depuis son sommet de 2021 : ne vous fiez pas au seul score et surveillez aussi les changements de direction des indicateurs de tendance, comme le croisement des moyennes 50/200."
     },
     {
      "q": "Les métriques du protocole, comme la demande de requêtes ou le staking des indexeurs, sont-elles prises en compte ?",
      "a": "Non. Le score n’utilise que les données de prix du GRT (CoinGecko, Binance) et l’indice de peur et d’avidité du marché. Les métriques d’usage, comme les frais de requête, le nombre de subgraphs ou le montant staké, sont à consulter dans d’autres sources, par exemple Graph Explorer."
     },
     {
      "q": "Le GRT est un jeton Ethereum : faut-il plutôt regarder le score d’Ethereum ?",
      "a": "Le GRT est un jeton ERC-20, mais il s’échange à son propre prix ; cette page calcule donc les indicateurs à partir du seul cours du GRT. Les frais de gaz et l’activité du réseau Ethereum n’entrent pas dans le score ; celui d’Ethereum se consulte sur sa propre page."
     },
     {
      "q": "Pourquoi le score du GRT peut-il s’inverser entre le mode court et le mode long ?",
      "a": "Le mode « Court · Momentum » note plus haut quand la tendance est forte et le RSI élevé, tandis que le mode « Long · Contrarian » note plus haut en cas de peur, de survente et de repli profond. Les mêmes cours du GRT peuvent donc donner des scores contradictoires selon le mode : choisissez celui qui correspond à votre horizon d’investissement."
     }
    ]
   },
   "de": {
    "title": "The Graph (GRT): Kaufzeitpunkt-Score und Indikator-Dashboard",
    "intro": "Auf Basis des Tageskurses von The Graph (GRT), dem Protokoll zur Indexierung von Blockchain-Daten, berechnet diese Seite RSI(14), MACD(12·26·9), Mayer-Multiple, den Rückgang vom 365-Tage-Hoch und das 50/200-Golden/Death-Cross und ergänzt den marktweiten Angst- & Gier-Index sowie ein Feld für den MVRV Z-Score – so stehen sieben Indikatoren auf einer Seite. Für GRT gibt es keine MVRV-Daten, daher entsteht der Score von 0 bis 100 aus den übrigen Indikatoren. Kostenlos und sofort nutzbar.",
    "coinH": "Was ist The Graph (GRT)?",
    "coinP": [
     "The Graph ist ein dezentrales Indexierungsprotokoll, das Blockchain-Daten so aufbereitet, dass sie sich per GraphQL abfragen lassen. Yaniv Tal, Brandon Ramirez und Jannis Pohlmann starteten das Projekt 2018; Mainnet und GRT-Token gingen im Dezember 2020 auf Ethereum an den Start. Entwickler definieren „Subgraphs“, die festlegen, welche On-Chain-Daten wie indexiert werden, und Anwendungen wie DeFi-Apps rufen darüber schnell die benötigten Daten ab.",
     "The Graph ist keine eigene Blockchain, sondern ein Protokoll auf Ethereum-basierten Chains; GRT ist ein ERC-20-Token. Indexer staken GRT und bearbeiten Abfragen, wofür sie Gebühren und Indexierungsbelohnungen erhalten; liefern sie falsche Daten, kann ein Teil ihres Stakes gekürzt werden (Slashing). Kuratoren signalisieren nützliche Subgraphs mit GRT, und Delegatoren vertrauen Indexern GRT an, um an deren Belohnungen teilzuhaben. Zentrale Protokollfunktionen wie die Indexierungsbelohnungen wurden bis 2024 auf Arbitrum verlagert, ein Layer-2-Netzwerk von Ethereum. Das Anfangsangebot betrug 10 Milliarden GRT; Indexierungsbelohnungen bringen jedes Jahr neue Token hinzu, während ein Teil der Abfragegebühren und anderer Abgaben verbrannt wird."
    ],
    "applyH": "Indikatoren auf The Graph anwenden",
    "apply": [
     "Volatilität und Korrelation: GRT ist ein Altcoin mit weit geringerer Marktkapitalisierung als Bitcoin, schwankt deshalb stärker, wenn sich der Gesamtmarkt bewegt, und läuft meist in dieselbe Richtung wie Bitcoin. Auch wenn der RSI „überverkauft“ meldet, sollten Sie prüfen, ob der Bitcoin-Trend gedreht hat.",
     "Angst & Gier: Das ist kein GRT-eigener Wert, sondern der marktweite Index von Alternative.me. Protokollspezifische Faktoren wie Abfragenachfrage oder Indexer-Beteiligung fließen nicht ein.",
     "MVRV: Die Community-API von CoinMetrics hat keine GRT-Daten, daher steht der MVRV Z-Score auf N/A, und der Kaufzeitpunkt-Score entsteht durch Neugewichtung der übrigen Indikatoren.",
     "Mayer-Multiple und Rückgang: Der Rückgang bezieht sich nur auf die letzten 365 Tage, sodass der lange Abstieg seit dem Allzeithoch im Februar 2021 darin womöglich nicht sichtbar ist. Lesen Sie die aus Bitcoin abgeleiteten Schwellen (0,8 und 2,4; −30 % und −50 %) nicht ungeprüft als Unterbewertungssignale für GRT.",
     "Wachsendes Angebot: Da Indexierungsbelohnungen laufend neue GRT hinzufügen, erfassen rein preisbasierte Indikatoren den Verwässerungseffekt nicht."
    ],
    "histH": "Die Preiszyklen von The Graph im Überblick",
    "hist": [
     "Dezember 2020: Mit dem Mainnet-Start wurde GRT an großen Börsen wie Coinbase gelistet.",
     "Februar 2021: Allzeithoch von rund 2,8 US-Dollar mitten in der Altcoin-Rally.",
     "2022: Im Bärenmarkt fiel der Kurs um mehr als 95 % vom Hoch.",
     "Anfang 2023: Kräftige Erholung binnen kurzer Zeit, als sich das Interesse auf KI-nahe Coins richtete.",
     "2024: Im Juni wurde der zentrale Hosted Service eingestellt, und die Subgraphs zogen ins dezentrale Netzwerk um. Selbst im Bullenmarkt dieses Jahres blieb der Kurs weit unter dem Hoch von 2021."
    ],
    "faq": [
     {
      "q": "Hat The Graph keinen eigenen Angst- & Gier-Index?",
      "a": "Alternative.me veröffentlicht keine separaten Indizes für einzelne Coins. Der Wert auf dieser Seite ist ein Index für den gesamten Kryptomarkt, berechnet mit Bitcoin als Zentrum, und auf dem Bildschirm als „marktweit“ gekennzeichnet. Ob GRT selbst heißläuft oder schwächelt, zeigen RSI, MACD und gleitende Durchschnitte auf Basis des GRT-Kurses."
     },
     {
      "q": "Warum ist der MVRV Z-Score auf der GRT-Seite leer?",
      "a": "Weil die Community-API von CoinMetrics, die diese Seite nutzt, kein MVRV für GRT liefert. Die Karte zeigt N/A, und der Kaufzeitpunkt-Score wird nur aus den übrigen Indikatoren berechnet."
     },
     {
      "q": "Zeigt der Score STRONG BUY – sollte ich dann GRT kaufen?",
      "a": "Anlageentscheidungen treffen Sie selbst, und diese Seite empfiehlt keinen Kauf. Im voreingestellten Modus „Lang · Antizyklisch“ bedeutet ein Wert ab 80 (STRONG BUY), dass mehrere Indikatoren gleichzeitig auf überverkauft und unterbewertet deuten, ein Wert unter 25 (OVERHEATED), dass sich Überhitzungssignale häufen. GRT hat seit dem Hoch von 2021 einen langen Abschwung hinter sich; verlassen Sie sich daher nicht allein auf den Score, sondern achten Sie auch auf Richtungswechsel bei Trendindikatoren wie dem 50/200-Kreuz."
     },
     {
      "q": "Fließen Protokollkennzahlen wie Abfragenachfrage oder Indexer-Staking ein?",
      "a": "Nein. Der Score nutzt nur GRT-Kursdaten (CoinGecko, Binance) und den marktweiten Angst- & Gier-Index. Nutzungskennzahlen wie Abfragegebühren, Zahl der Subgraphs oder Staking-Volumen müssen Sie in anderen Quellen wie dem Graph Explorer nachsehen."
     },
     {
      "q": "GRT ist ein Ethereum-Token – sollte ich lieber auf den Ethereum-Score schauen?",
      "a": "GRT ist zwar ein ERC-20-Token, wird aber zu einem eigenen Preis gehandelt; diese Seite berechnet die Indikatoren daher allein aus dem GRT-Kurs. Gasgebühren und Netzwerkaktivität von Ethereum gehen nicht in den Score ein; den Score für Ethereum selbst finden Sie auf der Ethereum-Seite."
     },
     {
      "q": "Warum kann der GRT-Score im kurzen und im langen Modus gegensätzlich ausfallen?",
      "a": "Der Modus „Kurz · Momentum“ vergibt höhere Werte bei starkem Trend und hohem RSI, der Modus „Lang · Antizyklisch“ dagegen bei Angst, überverkauften Werten und tiefen Rückgängen. Dieselben GRT-Kursdaten können in beiden Modi daher widersprüchliche Scores ergeben; nutzen Sie den, der zu Ihrem Anlagehorizont passt."
     }
    ]
   },
   "it": {
    "title": "The Graph (GRT): punteggio di acquisto e cruscotto degli indicatori",
    "intro": "Partendo dal prezzo giornaliero di The Graph (GRT), il protocollo di indicizzazione dei dati blockchain, questa pagina calcola RSI(14), MACD(12·26·9), multiplo di Mayer, ribasso dal massimo a 365 giorni e Golden/Death Cross 50/200, poi aggiunge l’indice di paura e avidità dell’intero mercato e uno spazio per l’MVRV Z-Score, riunendo sette indicatori in un’unica schermata. GRT non ha dati MVRV, quindi il punteggio da 0 a 100 si basa sugli altri indicatori. Gratuita e pronta all’uso.",
    "coinH": "Che cos’è The Graph (GRT)?",
    "coinP": [
     "The Graph è un protocollo di indicizzazione decentralizzato che organizza i dati delle blockchain per renderli interrogabili con GraphQL. Yaniv Tal, Brandon Ramirez e Jannis Pohlmann hanno avviato il progetto nel 2018, e la mainnet e il token GRT sono stati lanciati su Ethereum nel dicembre 2020. Gli sviluppatori definiscono dei «subgraph» che stabiliscono quali dati on-chain indicizzare e come, e applicazioni come quelle di finanza decentralizzata (DeFi) li usano per recuperare rapidamente i dati di cui hanno bisogno.",
     "The Graph non è una blockchain a sé, ma un protocollo che funziona su catene dell’ecosistema Ethereum, e GRT è un token ERC-20. Gli indexer mettono in staking GRT ed elaborano le query per ottenere commissioni e ricompense di indicizzazione; se forniscono dati errati, parte del loro stake può essere tagliata (slashing). I curator segnalano con GRT i subgraph utili e i delegator affidano GRT agli indexer per condividerne le ricompense. Funzioni centrali del protocollo, come le ricompense di indicizzazione, sono state trasferite entro il 2024 su Arbitrum, un layer 2 di Ethereum. L’offerta iniziale era di 10 miliardi di GRT; le ricompense di indicizzazione aggiungono nuovi token ogni anno, mentre una parte delle commissioni sulle query e di altri oneri viene bruciata."
    ],
    "applyH": "Applicare gli indicatori a The Graph",
    "apply": [
     "Volatilità e correlazione: GRT è un’altcoin con una capitalizzazione molto inferiore a quella del Bitcoin, quindi oscilla di più quando si muove tutto il mercato e in genere va nella stessa direzione del Bitcoin. Anche se l’RSI segnala ipervenduto, controlla se il trend del Bitcoin si è invertito.",
     "Paura e avidità: non è un valore specifico di GRT, ma l’indice dell’intero mercato di Alternative.me. I fattori propri del protocollo, come la domanda di query o la partecipazione degli indexer, non vi rientrano.",
     "MVRV: l’API community di CoinMetrics non ha dati su GRT, perciò l’MVRV Z-Score è N/A e il punteggio di acquisto si ottiene ribilanciando i pesi degli altri indicatori.",
     "Multiplo di Mayer e ribasso: il ribasso si misura solo sugli ultimi 365 giorni, quindi il lungo calo dal massimo storico di febbraio 2021 potrebbe non comparire. Non leggere alla lettera le soglie derivate dal Bitcoin (0,8 e 2,4; −30% e −50%) come segnali di sottovalutazione di GRT.",
     "Offerta in crescita: dato che le ricompense di indicizzazione continuano ad aggiungere nuovi GRT, gli indicatori basati solo sul prezzo non colgono l’effetto di diluizione."
    ],
    "histH": "I cicli di prezzo di The Graph in sintesi",
    "hist": [
     "Dicembre 2020: con il lancio della mainnet, GRT arriva sui principali exchange, tra cui Coinbase.",
     "Febbraio 2021: tocca un massimo storico di circa 2,8 dollari nel pieno del rally delle altcoin.",
     "2022: nel mercato ribassista perde oltre il 95% dal massimo.",
     "Inizio 2023: forte rimbalzo in poco tempo, quando l’interesse si concentra sulle monete legate all’IA.",
     "2024: a giugno chiude l’hosted service centralizzato e i subgraph passano alla rete decentralizzata. Nemmeno nel mercato rialzista di quell’anno il prezzo si avvicina al massimo del 2021."
    ],
    "faq": [
     {
      "q": "The Graph non ha un proprio indice di paura e avidità?",
      "a": "Alternative.me non pubblica indici separati per ogni moneta. Il valore in questa pagina è un indice dell’intero mercato cripto, calcolato con il Bitcoin al centro, e sullo schermo è indicato come «intero mercato». Per capire se GRT in sé è surriscaldata o in affanno, guarda RSI, MACD e medie mobili calcolati sul suo prezzo."
     },
     {
      "q": "Perché l’MVRV Z-Score è vuoto nella pagina di GRT?",
      "a": "Perché l’API community di CoinMetrics usata da questa pagina non fornisce l’MVRV di GRT. La scheda mostra N/A e il punteggio di acquisto si calcola solo con gli altri indicatori."
     },
     {
      "q": "Se il punteggio segna STRONG BUY, devo comprare GRT?",
      "a": "Le decisioni di investimento spettano a te e questa pagina non consiglia di comprare. Nella modalità predefinita «Lungo · Contrarian», 80 o più (STRONG BUY) significa che più indicatori indicano insieme ipervenduto e sottovalutazione, mentre sotto 25 (OVERHEATED) si sommano segnali di surriscaldamento. GRT viene da un lungo calo dal massimo del 2021: non affidarti solo al punteggio e osserva anche i cambi di direzione degli indicatori di trend, come l’incrocio delle medie 50/200."
     },
     {
      "q": "Le metriche del protocollo, come la domanda di query o lo staking degli indexer, sono incluse?",
      "a": "No. Il punteggio usa solo i dati di prezzo di GRT (CoinGecko, Binance) e l’indice di paura e avidità del mercato. Le metriche d’uso, come le commissioni sulle query, il numero di subgraph o l’importo in staking, vanno verificate in altre fonti, per esempio Graph Explorer."
     },
     {
      "q": "GRT è un token di Ethereum: dovrei guardare il punteggio di Ethereum?",
      "a": "GRT è un token ERC-20, ma si scambia a un prezzo proprio, quindi questa pagina calcola gli indicatori solo dal prezzo di GRT. Le commissioni gas e l’attività della rete Ethereum non entrano nel punteggio; quello di Ethereum si trova nella sua pagina."
     },
     {
      "q": "Perché il punteggio di GRT può essere opposto tra modalità breve e lunga?",
      "a": "La modalità «Breve · Momentum» assegna punteggi più alti con trend forte e RSI elevato, mentre la modalità «Lungo · Contrarian» li assegna con paura, ipervenduto e ribassi profondi. Gli stessi prezzi di GRT possono quindi dare punteggi contrastanti nelle due modalità: usa quella adatta al tuo orizzonte temporale."
     }
    ]
   },
   "pt": {
    "title": "The Graph (GRT): pontuação de compra e painel de indicadores",
    "intro": "A partir do preço diário do The Graph (GRT), o protocolo de indexação de dados de blockchain, esta página calcula o RSI(14), o MACD(12·26·9), o múltiplo de Mayer, a queda desde a máxima de 365 dias e o cruzamento dourado/da morte 50/200, e junta o índice de medo e ganância de todo o mercado e um espaço para o MVRV Z-Score, reunindo sete indicadores num só ecrã. O GRT não tem dados de MVRV, por isso a pontuação de 0 a 100 assenta nos restantes indicadores. É gratuita e está pronta a usar.",
    "coinH": "O que é o The Graph (GRT)?",
    "coinP": [
     "O The Graph é um protocolo de indexação descentralizado que organiza os dados das blockchains para poderem ser consultados com GraphQL. Yaniv Tal, Brandon Ramirez e Jannis Pohlmann iniciaram o projeto em 2018, e a rede principal e o token GRT foram lançados na Ethereum em dezembro de 2020. Os programadores definem «subgraphs» que indicam que dados on-chain indexar e como, e aplicações como as de finanças descentralizadas (DeFi) usam-nos para obter rapidamente os dados de que precisam.",
     "O The Graph não é uma blockchain própria, mas um protocolo que funciona sobre cadeias do ecossistema Ethereum, e o GRT é um token ERC-20. Os indexadores fazem staking de GRT e processam consultas para receber comissões e recompensas de indexação; se fornecerem dados incorretos, parte do stake pode ser cortada (slashing). Os curadores sinalizam com GRT os subgraphs úteis e os delegadores confiam GRT aos indexadores para partilhar as recompensas. Funções centrais do protocolo, como as recompensas de indexação, foram transferidas até 2024 para a Arbitrum, uma camada 2 da Ethereum. A oferta inicial foi de 10 mil milhões de GRT; as recompensas de indexação acrescentam novos tokens todos os anos, enquanto parte das comissões de consulta e de outros encargos é queimada."
    ],
    "applyH": "Como aplicar os indicadores ao The Graph",
    "apply": [
     "Volatilidade e correlação: o GRT é uma altcoin com uma capitalização muito inferior à do Bitcoin, por isso oscila com mais força quando todo o mercado se move e, em geral, segue a mesma direção do Bitcoin. Mesmo que o RSI indique sobrevenda, confirme também se a tendência do Bitcoin já virou.",
     "Medo e ganância: não é um valor próprio do GRT, mas o índice de todo o mercado da Alternative.me. Fatores próprios do protocolo, como a procura de consultas ou a participação dos indexadores, não estão refletidos nele.",
     "MVRV: a API comunitária da CoinMetrics não tem dados do GRT, pelo que o MVRV Z-Score fica N/A e a pontuação de compra é obtida reequilibrando os pesos dos outros indicadores.",
     "Múltiplo de Mayer e queda: a queda é medida apenas face aos últimos 365 dias, por isso a longa descida desde a máxima histórica de fevereiro de 2021 pode não aparecer nela. Não leia à letra os limiares derivados do Bitcoin (0,8 e 2,4; −30% e −50%) como sinais de subvalorização do GRT.",
     "Oferta crescente: como as recompensas de indexação continuam a acrescentar GRT novos, os indicadores que só olham para o preço não captam o efeito de diluição."
    ],
    "histH": "Resumo dos ciclos de preço do The Graph",
    "hist": [
     "Dezembro de 2020: com o lançamento da rede principal, o GRT foi listado em grandes corretoras, como a Coinbase.",
     "Fevereiro de 2021: atingiu uma máxima histórica de cerca de 2,8 dólares em plena subida das altcoins.",
     "2022: caiu mais de 95% desde o pico no mercado em baixa.",
     "Início de 2023: recuperou com força em pouco tempo, quando o interesse se virou para as moedas ligadas à IA.",
     "2024: o serviço alojado centralizado encerrou em junho e os subgraphs passaram para a rede descentralizada. Nem no mercado em alta desse ano o preço se aproximou da máxima de 2021."
    ],
    "faq": [
     {
      "q": "O The Graph não tem um índice de medo e ganância próprio?",
      "a": "A Alternative.me não publica índices separados para cada moeda. O valor desta página é um índice de todo o mercado cripto, calculado com o Bitcoin como eixo, e aparece no ecrã identificado como «mercado global». Para saber se o próprio GRT está sobreaquecido ou em marasmo, veja o RSI, o MACD e as médias móveis calculados com o seu preço."
     },
     {
      "q": "Porque é que o MVRV Z-Score está vazio na página do GRT?",
      "a": "Porque a API comunitária da CoinMetrics usada por esta página não fornece MVRV para o GRT. O cartão mostra N/A e a pontuação de compra é calculada apenas com os restantes indicadores."
     },
     {
      "q": "Se a pontuação indicar STRONG BUY, devo comprar GRT?",
      "a": "As decisões de investimento são suas e esta página não recomenda comprar. No modo predefinido «Longo · Contrário», 80 ou mais (STRONG BUY) significa que vários indicadores apontam ao mesmo tempo para sobrevenda e subvalorização, e menos de 25 (OVERHEATED) significa que os sinais de sobreaquecimento se acumulam. O GRT vem de uma longa queda desde a máxima de 2021, por isso não confie apenas na pontuação e acompanhe também as mudanças de direção em indicadores de tendência, como o cruzamento das médias 50/200."
     },
     {
      "q": "As métricas do protocolo, como a procura de consultas ou o staking dos indexadores, são incluídas?",
      "a": "Não. A pontuação usa apenas os dados de preço do GRT (CoinGecko, Binance) e o índice de medo e ganância do mercado. Métricas de utilização, como as comissões de consulta, o número de subgraphs ou o montante em staking, têm de ser consultadas noutras fontes, como o Graph Explorer."
     },
     {
      "q": "O GRT é um token da Ethereum: devo olhar antes para a pontuação da Ethereum?",
      "a": "O GRT é um token ERC-20, mas é negociado a um preço próprio, por isso esta página calcula os indicadores apenas com o preço do GRT. As taxas de gas e a atividade da rede Ethereum não entram na pontuação; a da própria Ethereum pode ser vista na respetiva página."
     },
     {
      "q": "Porque é que a pontuação do GRT pode ser oposta nos modos curto e longo?",
      "a": "O modo «Curto · Momentum» dá pontuações mais altas quando a tendência é forte e o RSI está alto, enquanto o modo «Longo · Contrário» as dá com medo, sobrevenda e quedas profundas. Os mesmos preços do GRT podem, por isso, gerar pontuações contraditórias nos dois modos; use o que corresponde ao seu horizonte de investimento."
     }
    ]
   },
   "ru": {
    "title": "The Graph (GRT): оценка момента покупки и панель индикаторов",
    "intro": "По дневной цене The Graph (GRT) — протокола индексации блокчейн-данных — эта страница рассчитывает RSI(14), MACD(12·26·9), мультипликатор Майера, просадку от 365-дневного максимума и золотой/мёртвый крест 50/200, а затем добавляет общерыночный индекс страха и жадности и ячейку MVRV Z-оценки, собирая семь индикаторов на одном экране. Данных MVRV для GRT нет, поэтому оценка от 0 до 100 строится по остальным индикаторам. Бесплатно и сразу готово к работе.",
    "coinH": "Что такое The Graph (GRT)?",
    "coinP": [
     "The Graph — децентрализованный протокол индексации, который упорядочивает данные блокчейнов, чтобы к ним можно было обращаться через GraphQL. Проект в 2018 году начали Янив Таль, Брэндон Рамирес и Яннис Польман, а в декабре 2020 года в сети Ethereum запустились основная сеть и токен GRT. Разработчики описывают «сабграфы» — какие ончейн-данные индексировать и как, — а приложения, например сервисы децентрализованных финансов (DeFi), через них быстро получают нужные данные.",
     "The Graph — не самостоятельный блокчейн, а протокол, работающий на сетях экосистемы Ethereum; GRT — токен стандарта ERC-20. Индексаторы стейкают GRT и обрабатывают запросы, получая комиссии и награды за индексацию; за выдачу неверных данных часть их стейка может быть списана (слэшинг). Кураторы сигнализируют о полезных сабграфах с помощью GRT, а делегаторы доверяют GRT индексаторам, чтобы делить с ними награды. Ключевые функции протокола, в том числе награды за индексацию, к 2024 году перенесли в Arbitrum — сеть второго уровня Ethereum. Начальное предложение составляло 10 млрд GRT; награды за индексацию ежегодно добавляют новые токены, а часть комиссий за запросы и других сборов сжигается."
    ],
    "applyH": "Как применять индикаторы к The Graph",
    "apply": [
     "Волатильность и корреляция: GRT — альткоин с капитализацией намного меньше, чем у биткоина, поэтому при движении всего рынка он колеблется сильнее и, как правило, идёт в ту же сторону, что и биткоин. Даже если RSI показывает перепроданность, проверьте, развернулся ли тренд биткоина.",
     "Страх и жадность: это не показатель GRT, а общерыночный индекс Alternative.me. Факторы самого протокола — спрос на запросы или активность индексаторов — в нём не учитываются.",
     "MVRV: в общедоступном API CoinMetrics нет данных по GRT, поэтому MVRV Z-оценка равна N/A, а оценка момента покупки получается перебалансировкой весов остальных индикаторов.",
     "Мультипликатор Майера и просадка: просадка считается только за последние 365 дней, поэтому долгое снижение после исторического максимума февраля 2021 года может в ней не отражаться. Не воспринимайте пороги, выведенные из биткоина (0,8 и 2,4; −30% и −50%), как прямые сигналы недооценки GRT.",
     "Растущее предложение: награды за индексацию постоянно добавляют новые GRT, и индикаторы, смотрящие только на цену, эффект размывания не улавливают."
    ],
    "histH": "Ценовые циклы The Graph вкратце",
    "hist": [
     "Декабрь 2020: вместе с запуском основной сети GRT появился на крупных биржах, включая Coinbase.",
     "Февраль 2021: исторический максимум около 2,8 доллара на волне роста альткоинов.",
     "2022: на медвежьем рынке цена упала более чем на 95% от пика.",
     "Начало 2023: резкий отскок за короткий срок, когда интерес инвесторов сместился к монетам, связанным с ИИ.",
     "2024: в июне закрылся централизованный хостинговый сервис, и сабграфы перешли в децентрализованную сеть. Даже на бычьем рынке того года цена оставалась далеко ниже максимума 2021 года."
    ],
    "faq": [
     {
      "q": "Разве у The Graph нет собственного индекса страха и жадности?",
      "a": "Alternative.me не публикует отдельные индексы для каждой монеты. На этой странице показан индекс всего крипторынка, рассчитанный с биткоином в центре, и на экране он помечен как «весь рынок». Перегрет ли или угнетён сам GRT, смотрите по RSI, MACD и скользящим средним, рассчитанным по его цене."
     },
     {
      "q": "Почему на странице GRT пустует MVRV Z-оценка?",
      "a": "Потому что общедоступный API CoinMetrics, который использует эта страница, не даёт MVRV для GRT. На карточке стоит N/A, а оценка момента покупки рассчитывается только по остальным индикаторам."
     },
     {
      "q": "Если оценка показывает STRONG BUY, нужно покупать GRT?",
      "a": "Инвестиционные решения принимаете вы сами, и эта страница не рекомендует покупку. В режиме по умолчанию «Долго · Контртренд» значение 80 и выше (STRONG BUY) означает, что сразу несколько индикаторов указывают на перепроданность и недооценку, а ниже 25 (OVERHEATED) — что накапливаются сигналы перегрева. После пика 2021 года GRT пережил долгое падение, поэтому не полагайтесь только на оценку и следите за сменой направления трендовых индикаторов, например пересечения средних 50/200."
     },
     {
      "q": "Учитываются ли метрики протокола — спрос на запросы или стейкинг индексаторов?",
      "a": "Нет. Оценка использует только ценовые данные GRT (CoinGecko, Binance) и общерыночный индекс страха и жадности. Метрики использования — комиссии за запросы, число сабграфов, объём стейкинга — нужно смотреть в других источниках, например в Graph Explorer."
     },
     {
      "q": "GRT — токен Ethereum. Может, стоит смотреть на оценку Эфириума?",
      "a": "GRT — токен стандарта ERC-20, но торгуется по собственной цене, поэтому эта страница считает индикаторы только по цене GRT. Комиссии за газ и активность сети Ethereum в оценку не входят; оценку самого Эфириума можно посмотреть на его странице."
     },
     {
      "q": "Почему оценка GRT в краткосрочном и долгосрочном режимах может быть противоположной?",
      "a": "Режим «Кратко · Моментум» ставит более высокие оценки при сильном тренде и высоком RSI, а режим «Долго · Контртренд» — при страхе, перепроданности и глубокой просадке. Поэтому одни и те же цены GRT могут дать противоречащие друг другу оценки в двух режимах; выбирайте тот, что соответствует вашему инвестиционному горизонту."
     }
    ]
   },
   "nl": {
    "title": "The Graph (GRT): koopmoment-score en indicatorendashboard",
    "intro": "Op basis van de dagkoers van The Graph (GRT), het protocol voor het indexeren van blockchaindata, berekent deze pagina RSI(14), MACD(12·26·9), de Mayer Multiple, de daling vanaf de 365-daagse top en de 50/200 Golden/Death Cross, en voegt de marktbrede Angst- & Hebzucht-index en een vak voor de MVRV Z-score toe, zodat zeven indicatoren op één scherm staan. Voor GRT zijn er geen MVRV-gegevens, dus de score van 0 tot 100 komt uit de overige indicatoren. Gratis en direct te gebruiken.",
    "coinH": "Wat is The Graph (GRT)?",
    "coinP": [
     "The Graph is een gedecentraliseerd indexeringsprotocol dat blockchaindata zo ordent dat je ze met GraphQL kunt opvragen. Yaniv Tal, Brandon Ramirez en Jannis Pohlmann begonnen het project in 2018, en het mainnet en de GRT-token werden in december 2020 op Ethereum gelanceerd. Ontwikkelaars definiëren ‘subgraphs’ die vastleggen welke on-chaindata hoe worden geïndexeerd, en toepassingen zoals apps voor gedecentraliseerde financiën (DeFi) halen daarmee snel de data op die ze nodig hebben.",
     "The Graph is geen eigen blockchain, maar een protocol dat draait op chains binnen het Ethereum-ecosysteem; GRT is een ERC-20-token. Indexers staken GRT en verwerken query’s, waarvoor ze vergoedingen en indexeringsbeloningen krijgen; leveren ze foutieve data, dan kan een deel van hun stake worden ingehouden (slashing). Curators geven met GRT aan welke subgraphs nuttig zijn, en delegators vertrouwen GRT toe aan indexers om mee te delen in hun beloningen. Kernfuncties van het protocol, zoals de indexeringsbeloningen, waren in 2024 overgezet naar Arbitrum, een layer 2 van Ethereum. Het beginaanbod was 10 miljard GRT; indexeringsbeloningen voegen elk jaar nieuwe tokens toe, terwijl een deel van de queryvergoedingen en andere heffingen wordt verbrand."
    ],
    "applyH": "Indicatoren toepassen op The Graph",
    "apply": [
     "Volatiliteit en correlatie: GRT is een altcoin met een veel kleinere marktkapitalisatie dan Bitcoin, dus hij schommelt harder wanneer de hele markt beweegt en gaat doorgaans dezelfde kant op als Bitcoin. Ook als de RSI oversold aangeeft, kun je beter nagaan of de trend van Bitcoin al gekeerd is.",
     "Angst & hebzucht: dit is geen GRT-specifieke waarde, maar de marktbrede index van Alternative.me. Protocolfactoren zoals de vraag naar query’s of de deelname van indexers zitten er niet in.",
     "MVRV: de community-API van CoinMetrics heeft geen gegevens over GRT, dus de MVRV Z-score staat op N/A en de koopmoment-score ontstaat door de gewichten van de andere indicatoren opnieuw te verdelen.",
     "Mayer Multiple en daling: de daling wordt alleen gemeten ten opzichte van de laatste 365 dagen, waardoor de lange neergang sinds de recordkoers van februari 2021 er mogelijk niet in zichtbaar is. Lees de van Bitcoin afgeleide drempels (0,8 en 2,4; −30% en −50%) niet zomaar als signalen van onderwaardering voor GRT.",
     "Groeiend aanbod: omdat indexeringsbeloningen steeds nieuwe GRT toevoegen, vangen indicatoren die alleen naar de prijs kijken het verwateringseffect niet op."
    ],
    "histH": "De prijscycli van The Graph in het kort",
    "hist": [
     "December 2020: met de lancering van het mainnet kwam GRT op grote beurzen zoals Coinbase.",
     "Februari 2021: recordkoers van ongeveer 2,8 dollar midden in de altcoinrally.",
     "2022: in de bearmarkt meer dan 95% gedaald vanaf de top.",
     "Begin 2023: in korte tijd sterk hersteld, toen de belangstelling zich richtte op munten die met AI te maken hebben.",
     "2024: in juni stopte de gecentraliseerde hosted service en verhuisden de subgraphs naar het gedecentraliseerde netwerk. Zelfs in de bullmarkt van dat jaar bleef de koers ver onder de top van 2021."
    ],
    "faq": [
     {
      "q": "Heeft The Graph geen eigen Angst- & Hebzucht-index?",
      "a": "Alternative.me publiceert geen aparte index per munt. De waarde op deze pagina is een index voor de hele cryptomarkt, berekend met Bitcoin als middelpunt, en staat op het scherm aangeduid als ‘hele markt’. Of GRT zelf oververhit raakt of wegzakt, zie je aan de RSI, de MACD en de voortschrijdende gemiddelden die op de koers van GRT zijn berekend."
     },
     {
      "q": "Waarom is de MVRV Z-score leeg op de GRT-pagina?",
      "a": "Omdat de community-API van CoinMetrics die deze pagina gebruikt geen MVRV voor GRT levert. De kaart toont N/A en de koopmoment-score wordt alleen met de overige indicatoren berekend."
     },
     {
      "q": "Als de score STRONG BUY aangeeft, moet ik dan GRT kopen?",
      "a": "Beleggingsbeslissingen neem je zelf, en deze pagina raadt niet aan om te kopen. In de standaardmodus ‘Lang · Contrair’ betekent 80 of hoger (STRONG BUY) dat meerdere indicatoren tegelijk wijzen op oversold en onderwaardering, en onder 25 (OVERHEATED) dat signalen van oververhitting zich opstapelen. GRT heeft sinds de top van 2021 een lange daling achter de rug; vertrouw daarom niet alleen op de score en let ook op richtingsveranderingen in trendindicatoren zoals de kruising van de 50/200-gemiddelden."
     },
     {
      "q": "Worden protocolcijfers zoals de vraag naar query’s of het staken door indexers meegenomen?",
      "a": "Nee. De score gebruikt alleen koersgegevens van GRT (CoinGecko, Binance) en de marktbrede Angst- & Hebzucht-index. Gebruikscijfers zoals queryvergoedingen, het aantal subgraphs of het gestakete bedrag moet je in andere bronnen nagaan, bijvoorbeeld Graph Explorer."
     },
     {
      "q": "GRT is een Ethereum-token: moet ik dan naar de Ethereum-score kijken?",
      "a": "GRT is weliswaar een ERC-20-token, maar wordt tegen een eigen prijs verhandeld, dus deze pagina berekent de indicatoren alleen op de koers van GRT. Gaskosten en netwerkactiviteit van Ethereum tellen niet mee in de score; de score van Ethereum zelf staat op de Ethereum-pagina."
     },
     {
      "q": "Waarom kan de GRT-score in de korte en de lange modus tegengesteld uitvallen?",
      "a": "De modus ‘Kort · Momentum’ geeft hogere scores bij een sterke trend en een hoge RSI, terwijl de modus ‘Lang · Contrair’ dat doet bij angst, oversold-waarden en diepe dalingen. Dezelfde GRT-koersen kunnen in beide modi dus tegenstrijdige scores opleveren; gebruik de modus die bij je beleggingshorizon past."
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
