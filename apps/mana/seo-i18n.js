/* 하단 SEO 본문 다국어 데이터 + 렌더러. index.html(광고) / member/index.html(구독자) 공유.
   언어 전환 시 window.renderSEO(lang) 호출 → section.seo 를 해당 언어로 다시 그림.
   기본 정적 HTML(한국어)은 무JS 크롤러용 폴백으로 남겨두고, JS 실행 시 현재 언어로 교체. */
(function () {
  var SEO = {
    ko: {
      title: '디센트럴랜드 공포·탐욕 지수 & 매수 타이밍 점수',
      intro: '디센트럴랜드 공포지수(공포·탐욕 지수, Fear & Greed Index)를 포함한 7개 실시간 지표를 합성해 “지금이 매수 타이밍인가?”를 0~100 점수로 보여주는 무료 대시보드입니다. 설치 없이 브라우저에서 바로 실행되며 13개 언어를 지원합니다.',
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
        { q: '공포지수가 낮으면 디센트럴랜드을 사야 하나요?', a: '극단적 공포는 역사적으로 분할 매수 기회였던 경우가 많지만, 공포지수 하나만 보면 “떨어지는 칼날”을 잡을 위험이 있습니다. 본 점수는 RSI·MACD·마이어 배수·낙폭·이동평균 크로스를 함께 보고, 하락 추세에서는 점수를 보수적으로 낮춥니다.' },
        { q: '매수 타이밍 점수는 어떻게 계산되나요?', a: '7개 지표를 각각 0~100 부분점수로 환산해 가중 합성합니다. 결과는 0~100이며 5단계 밴드로 표시됩니다.' },
        { q: '무료인가요? 설치가 필요한가요?', a: '완전 무료이며 설치가 필요 없습니다. CoinGecko·Binance·Alternative.me 공개 API에서 실시간 데이터를 가져옵니다.' },
        { q: '공포지수와 매수 타이밍 점수는 무엇이 다른가요?', a: '공포지수는 심리 한 가지 지표(0~100)이고, 매수 타이밍 점수는 공포지수를 포함한 7개 지표를 합성한 종합 점수(0~100)입니다.' },
        { q: '공포지수 데이터는 어디서 가져오나요? 얼마나 자주 갱신되나요?', a: '공포·탐욕 지수는 Alternative.me, 가격·일봉은 CoinGecko·Binance, 온체인 지표는 CoinMetrics 공개 API에서 실시간으로 가져옵니다. 화면은 약 1분 주기로 자동 갱신됩니다.' },
        { q: '디센트럴랜드 지금 사도 되나요?', a: '정답은 없지만, 매수 타이밍 점수(0~100)로 현재 시장이 과매도·공포 구간인지 과열·탐욕 구간인지 객관적으로 가늠할 수 있습니다. 장기(역발상) 탭 기준 점수가 높을수록 공포·저평가가 겹친 분할 매수 우호 구간, 낮을수록 과열 경계 구간입니다. 참고 신호일 뿐 투자 자문이 아닙니다.' },
        { q: '단기와 장기 매수 타이밍은 어떻게 다른가요?', a: '점수는 단기·장기 두 탭으로 나뉩니다. 단기(모멘텀)는 약 1~3개월 추세추종 관점으로 상승 추세가 강할수록 높고, 장기(역발상)는 약 1년 이상 사이클 관점으로 공포·저평가일수록 높습니다. 2017년 이후 백테스트에서 단기는 모멘텀, 장기는 역발상 방향이 더 잘 맞았습니다.' },
        { q: 'BOTTOM RADAR(바닥 점수)는 무엇인가요?', a: 'MVRV Z-점수 같은 온체인 지표로 시가총액이 투자자 평균 매수원가 대비 어디에 있는지 재서, 역사적 바닥 구간과의 근접도를 0~100으로 보여주는 보조 게이지입니다. 계산 근거는 “비트코인 바닥” 해설 페이지에 공개되어 있습니다.' }
      ],
      disclaimer: '⚠ 본 점수는 공개 지표를 합성한 참고 신호이며 투자 자문이 아닙니다. 모든 투자 판단과 책임은 이용자 본인에게 있습니다.'
    },
    en: {
      title: 'Decentraland Fear & Greed Index & Buy-Timing Score',
      intro: 'A free dashboard that synthesizes 7 real-time indicators — including the Decentraland Fear & Greed Index — into a 0–100 “is now a good time to buy?” score. Runs in your browser with no install, in 13 languages.',
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
        { q: 'Should I buy Decentraland when the index is low?', a: 'Extreme fear has often been an accumulation opportunity, but relying on the index alone risks catching a falling knife. This score also weighs RSI, MACD, Mayer Multiple, drawdown and moving-average crosses, and lowers the score conservatively in downtrends.' },
        { q: 'How is the buy-timing score calculated?', a: 'Each of the 7 indicators is converted to a 0–100 sub-score and weighted together. The result is 0–100, shown in 5 bands.' },
        { q: 'Is it free? Do I need to install anything?', a: 'It is completely free with no install. Real-time data comes from CoinGecko, Binance and Alternative.me public APIs.' },
        { q: 'How is the index different from the buy-timing score?', a: 'The index is a single sentiment metric (0–100); the buy-timing score is a composite of 7 indicators including the index (0–100).' },
        { q: 'Where does the data come from, and how often does it refresh?', a: 'The Fear & Greed Index comes from Alternative.me, prices and daily candles from the CoinGecko and Binance public APIs, and on-chain metrics from CoinMetrics. The screen auto-refreshes roughly every minute.' },
        { q: 'Should I buy Decentraland right now?', a: 'There is no single answer, but the buy-timing score (0–100) gives an objective read on whether the market is in an oversold/fear zone or an overheated/greed zone. On the long-term (contrarian) tab, higher scores mark zones where fear and undervaluation overlap — historically favorable for DCA — while lower scores warn of overheating. It is a reference signal, not investment advice.' },
        { q: 'How do short-term and long-term buy timing differ?', a: 'The score is split into two tabs. Short-term (momentum) takes a 1–3 month trend-following view and rises with strong uptrends; long-term (contrarian) takes a 1-year-plus cycle view and rises with fear and undervaluation. In backtests since 2017, momentum worked better short-term and contrarian worked better long-term.' },
        { q: 'What is the BOTTOM RADAR (bottom score)?', a: 'A secondary gauge that uses on-chain metrics such as the MVRV Z-Score to measure where market cap sits relative to investors’ average cost basis, showing proximity to historic bottom zones on a 0–100 scale. The full calculation is published on the “Bitcoin bottom” guide page.' }
      ],
      disclaimer: '⚠ This score is a reference signal built from public indicators, not investment advice. All decisions and responsibility are your own.'
    },
    ja: {
      title: 'ディセントラランド 恐怖・強欲指数 & 買い時スコア',
      intro: 'ディセントラランドの恐怖・強欲指数（Fear & Greed Index）を含む7つのリアルタイム指標を合成し、「今が買い時か？」を0〜100のスコアで示す無料ダッシュボードです。インストール不要でブラウザから即実行、13言語対応。',
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
        { q: '指数が低ければディセントラランドを買うべき？', a: '極端な恐怖は歴史的に分割買いの好機だったことが多いですが、指数だけに頼ると「落ちるナイフ」を掴む危険があります。本スコアはRSI・MACD・マイヤー倍率・下落率・移動平均クロスも合わせて見て、下落トレンドでは保守的にスコアを下げます。' },
        { q: '買い時スコアはどう計算される？', a: '7指標をそれぞれ0〜100の部分スコアに換算し加重合成します。結果は0〜100で、5段階バンドで表示します。' },
        { q: '無料？インストールは必要？', a: '完全無料・インストール不要です。CoinGecko・Binance・Alternative.me の公開APIからリアルタイムデータを取得します。' },
        { q: '指数と買い時スコアの違いは？', a: '指数は心理1指標(0〜100)、買い時スコアは指数を含む7指標を合成した総合スコア(0〜100)です。' },
        { q: 'データはどこから？更新頻度は？', a: '恐怖・強欲指数はAlternative.me、価格・日足はCoinGecko・Binance、オンチェーン指標はCoinMetricsの公開APIからリアルタイムで取得します。画面は約1分ごとに自動更新されます。' },
        { q: 'ディセントラランドは今買ってもいい？', a: '正解はありませんが、買い時スコア(0〜100)で現在の市場が売られすぎ・恐怖圏か、過熱・強欲圏かを客観的に測れます。長期（逆張り）タブではスコアが高いほど恐怖と割安が重なる分割買いに有利な圏、低いほど過熱警戒圏です。参考シグナルであり投資助言ではありません。' },
        { q: '短期と長期の買い時はどう違う？', a: 'スコアは短期・長期の2タブに分かれます。短期（モメンタム）は約1〜3か月のトレンドフォロー視点で上昇トレンドが強いほど高く、長期（逆張り）は約1年以上のサイクル視点で恐怖・割安なほど高くなります。2017年以降のバックテストでは、短期はモメンタム、長期は逆張りの方向がより有効でした。' },
        { q: 'BOTTOM RADAR（底値スコア）とは？', a: 'MVRV Zスコアなどのオンチェーン指標で、時価総額が投資家の平均取得単価に対してどの位置にあるかを測り、歴史的な底値圏への近さを0〜100で示す補助ゲージです。計算根拠は「ビットコインの底」解説ページで公開しています。' }
      ],
      disclaimer: '⚠ 本スコアは公開指標を合成した参考シグナルであり、投資助言ではありません。すべての判断と責任は利用者ご自身にあります。'
    },
    zh: {
      title: 'Decentraland恐惧与贪婪指数 & 买入时机评分',
      intro: '一个免费仪表板，将包括Decentraland恐惧与贪婪指数（Fear & Greed Index）在内的7个实时指标合成为0–100的“现在是买入时机吗？”评分。无需安装，浏览器即开即用，支持13种语言。',
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
        { q: '指数低就该买Decentraland吗？', a: '极度恐惧在历史上常是分批买入良机，但只看指数有“接飞刀”的风险。本评分同时参考RSI、MACD、梅耶倍数、回撤与均线交叉，并在下跌趋势中保守下调评分。' },
        { q: '买入时机评分如何计算？', a: '将7个指标各自换算为0–100分项评分并加权合成。结果为0–100，以5档显示。' },
        { q: '免费吗？需要安装吗？', a: '完全免费、无需安装。实时数据来自 CoinGecko、Binance、Alternative.me 公开API。' },
        { q: '指数与买入时机评分有何不同？', a: '指数是单一情绪指标(0–100)；买入时机评分是包含该指数在内的7指标综合评分(0–100)。' },
        { q: '数据来自哪里？多久更新一次？', a: '恐惧与贪婪指数来自Alternative.me，价格与日K来自CoinGecko和Binance公开API，链上指标来自CoinMetrics。页面约每1分钟自动刷新。' },
        { q: '现在可以买Decentraland吗？', a: '没有标准答案，但买入时机评分(0–100)能客观判断当前市场处于超卖·恐惧区还是过热·贪婪区。在长期（逆向）标签页中，评分越高代表恐惧与低估重叠、历史上利于分批买入的区间；越低则是过热警戒区。仅供参考，并非投资建议。' },
        { q: '短期和长期买入时机有何不同？', a: '评分分为短期、长期两个标签页。短期（动量）以约1–3个月的趋势跟随视角，上升趋势越强评分越高；长期（逆向）以约1年以上的周期视角，越恐惧、越低估评分越高。2017年以来的回测显示，短期动量、长期逆向的方向更有效。' },
        { q: 'BOTTOM RADAR（底部评分）是什么？', a: '一个辅助仪表，利用MVRV Z分数等链上指标衡量市值相对投资者平均持仓成本的位置，以0–100显示与历史底部区间的接近程度。计算依据在“比特币底部”解读页面公开。' }
      ],
      disclaimer: '⚠ 本评分由公开指标合成，仅供参考，并非投资建议。一切投资决定与责任由用户自负。'
    },
    'zh-Hant': {
      title: 'Decentraland恐懼與貪婪指數 & 買入時機評分',
      intro: '一個免費儀表板，將包括Decentraland恐懼與貪婪指數（Fear & Greed Index）在內的7個即時指標合成為0–100的「現在是買入時機嗎？」評分。免安裝、瀏覽器即開即用，支援13種語言。',
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
        { q: '指數低就該買Decentraland嗎？', a: '極度恐懼在歷史上常是分批買入良機，但只看指數有「接飛刀」的風險。本評分同時參考RSI、MACD、梅耶倍數、回撤與均線交叉，並在下跌趨勢中保守下調評分。' },
        { q: '買入時機評分如何計算？', a: '將7個指標各自換算為0–100分項評分並加權合成。結果為0–100，以5檔顯示。' },
        { q: '免費嗎？需要安裝嗎？', a: '完全免費、免安裝。即時資料來自 CoinGecko、Binance、Alternative.me 公開API。' },
        { q: '指數與買入時機評分有何不同？', a: '指數是單一情緒指標(0–100)；買入時機評分是包含該指數在內的7指標綜合評分(0–100)。' },
        { q: '資料來自哪裡？多久更新一次？', a: '恐懼與貪婪指數來自Alternative.me，價格與日K來自CoinGecko和Binance公開API，鏈上指標來自CoinMetrics。頁面約每1分鐘自動重新整理。' },
        { q: '現在可以買Decentraland嗎？', a: '沒有標準答案，但買入時機評分(0–100)能客觀判斷當前市場處於超賣·恐懼區還是過熱·貪婪區。在長期（逆向）分頁中，評分越高代表恐懼與低估重疊、歷史上利於分批買入的區間；越低則是過熱警戒區。僅供參考，並非投資建議。' },
        { q: '短期和長期買入時機有何不同？', a: '評分分為短期、長期兩個分頁。短期（動量）以約1–3個月的趨勢跟隨視角，上升趨勢越強評分越高；長期（逆向）以約1年以上的週期視角，越恐懼、越低估評分越高。2017年以來的回測顯示，短期動量、長期逆向的方向更有效。' },
        { q: 'BOTTOM RADAR（底部評分）是什麼？', a: '一個輔助儀表，利用MVRV Z分數等鏈上指標衡量市值相對投資者平均持倉成本的位置，以0–100顯示與歷史底部區間的接近程度。計算依據在「比特幣底部」解說頁面公開。' }
      ],
      disclaimer: '⚠ 本評分由公開指標合成，僅供參考，並非投資建議。一切投資決定與責任由用戶自負。'
    },
    es: {
      title: 'Índice de miedo y codicia de Decentraland y puntuación de momento de compra',
      intro: 'Un panel gratuito que sintetiza 7 indicadores en tiempo real —incluido el índice de miedo y codicia de Decentraland— en una puntuación de 0 a 100 sobre «¿es buen momento para comprar?». Funciona en el navegador sin instalación, en 13 idiomas.',
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
        { q: '¿Debo comprar Decentraland cuando el índice está bajo?', a: 'El miedo extremo ha sido a menudo una oportunidad de acumulación, pero fiarse solo del índice arriesga «atrapar un cuchillo que cae». Esta puntuación también pondera RSI, MACD, múltiplo de Mayer, caída y cruces de medias, y la reduce de forma conservadora en tendencias bajistas.' },
        { q: '¿Cómo se calcula la puntuación de compra?', a: 'Cada uno de los 7 indicadores se convierte en una subpuntuación de 0 a 100 y se pondera. El resultado es 0–100, mostrado en 5 bandas.' },
        { q: '¿Es gratis? ¿Necesito instalar algo?', a: 'Es totalmente gratis y sin instalación. Los datos en tiempo real provienen de las API públicas de CoinGecko, Binance y Alternative.me.' },
        { q: '¿En qué se diferencia el índice de la puntuación de compra?', a: 'El índice es una sola métrica de sentimiento (0–100); la puntuación de compra es un compuesto de 7 indicadores que incluye el índice (0–100).' },
        { q: '¿De dónde vienen los datos y con qué frecuencia se actualizan?', a: 'El índice de miedo y codicia viene de Alternative.me; los precios y velas diarias, de las API públicas de CoinGecko y Binance; y las métricas on-chain, de CoinMetrics. La pantalla se actualiza automáticamente cada minuto aproximadamente.' },
        { q: '¿Debería comprar Decentraland ahora mismo?', a: 'No hay una respuesta única, pero la puntuación de compra (0–100) permite valorar objetivamente si el mercado está en zona de sobreventa/miedo o de recalentamiento/codicia. En la pestaña de largo plazo (contraria), puntuaciones altas marcan zonas donde coinciden miedo e infravaloración —históricamente favorables al DCA—, y las bajas avisan de recalentamiento. Es una señal de referencia, no asesoramiento de inversión.' },
        { q: '¿En qué se diferencian el timing de corto y de largo plazo?', a: 'La puntuación se divide en dos pestañas. El corto plazo (momentum) adopta una visión de seguimiento de tendencia de 1–3 meses y sube con tendencias alcistas fuertes; el largo plazo (contrario) adopta una visión de ciclo de más de un año y sube con miedo e infravaloración. En backtests desde 2017, el momentum funcionó mejor a corto y lo contrario a largo.' },
        { q: '¿Qué es el BOTTOM RADAR (puntuación de suelo)?', a: 'Un indicador auxiliar que usa métricas on-chain como el MVRV Z-Score para medir dónde está la capitalización respecto al coste medio de los inversores, mostrando la cercanía a zonas de suelo históricas en una escala de 0 a 100. El cálculo completo está publicado en la guía «suelo de Bitcoin».' }
      ],
      disclaimer: '⚠ Esta puntuación es una señal de referencia a partir de indicadores públicos, no asesoramiento de inversión. Todas las decisiones y la responsabilidad son tuyas.'
    },
    fr: {
      title: 'Indice de peur et d’avidité Decentraland et score de timing d’achat',
      intro: 'Un tableau de bord gratuit qui synthétise 7 indicateurs en temps réel — dont l’indice de peur et d’avidité Decentraland — en un score de 0 à 100 « est-ce le bon moment pour acheter ? ». Fonctionne dans le navigateur sans installation, en 13 langues.',
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
        { q: 'Dois-je acheter du Decentraland quand l’indice est bas ?', a: 'La peur extrême a souvent été une opportunité d’accumulation, mais se fier au seul indice risque d’« attraper un couteau qui tombe ». Ce score pondère aussi RSI, MACD, multiple de Mayer, repli et croisements de moyennes, et le réduit prudemment en tendance baissière.' },
        { q: 'Comment le score de timing d’achat est-il calculé ?', a: 'Chacun des 7 indicateurs est converti en sous-score de 0 à 100 puis pondéré. Le résultat est 0–100, affiché en 5 bandes.' },
        { q: 'Est-ce gratuit ? Faut-il installer quelque chose ?', a: 'C’est entièrement gratuit et sans installation. Les données en temps réel proviennent des API publiques de CoinGecko, Binance et Alternative.me.' },
        { q: 'Quelle différence entre l’indice et le score de timing d’achat ?', a: 'L’indice est une seule mesure de sentiment (0–100) ; le score de timing d’achat est un composite de 7 indicateurs incluant l’indice (0–100).' },
        { q: 'D’où viennent les données et à quelle fréquence sont-elles actualisées ?', a: 'L’indice de peur et d’avidité vient d’Alternative.me ; les prix et bougies journalières, des API publiques de CoinGecko et Binance ; et les métriques on-chain, de CoinMetrics. L’écran se rafraîchit automatiquement environ chaque minute.' },
        { q: 'Dois-je acheter du Decentraland maintenant ?', a: 'Il n’y a pas de réponse unique, mais le score de timing d’achat (0–100) permet d’évaluer objectivement si le marché est en zone de survente/peur ou de surchauffe/avidité. Dans l’onglet long terme (contrarian), des scores élevés marquent des zones où peur et sous-évaluation se recoupent — historiquement favorables au DCA — tandis que des scores bas signalent la surchauffe. C’est un signal de référence, pas un conseil en investissement.' },
        { q: 'Quelle différence entre le timing court terme et long terme ?', a: 'Le score est divisé en deux onglets. Le court terme (momentum) adopte une vue de suivi de tendance sur 1 à 3 mois et monte avec les tendances haussières fortes ; le long terme (contrarian) adopte une vue de cycle d’un an et plus et monte avec la peur et la sous-évaluation. Dans les backtests depuis 2017, le momentum a mieux fonctionné à court terme et le contrarian à long terme.' },
        { q: 'Qu’est-ce que le BOTTOM RADAR (score de plancher) ?', a: 'Une jauge auxiliaire qui utilise des métriques on-chain comme le MVRV Z-Score pour mesurer où se situe la capitalisation par rapport au coût moyen des investisseurs, en montrant la proximité des zones de plancher historiques sur une échelle de 0 à 100. Le calcul complet est publié sur la page « plancher du Bitcoin ».' }
      ],
      disclaimer: '⚠ Ce score est un signal de référence issu d’indicateurs publics, pas un conseil en investissement. Toutes les décisions et la responsabilité vous appartiennent.'
    },
    de: {
      title: 'Decentraland Angst- & Gier-Index & Kaufzeitpunkt-Score',
      intro: 'Ein kostenloses Dashboard, das 7 Echtzeit-Indikatoren — inkl. Decentraland Angst- & Gier-Index — zu einem 0–100-Score „Ist jetzt ein guter Kaufzeitpunkt?“ zusammenführt. Läuft im Browser ohne Installation, in 13 Sprachen.',
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
        { q: 'Soll ich Decentraland kaufen, wenn der Index niedrig ist?', a: 'Extreme Angst war historisch oft eine Akkumulationschance, doch sich allein auf den Index zu verlassen, birgt das Risiko, „ins fallende Messer zu greifen“. Dieser Score gewichtet auch RSI, MACD, Mayer-Multiple, Rückgang und MA-Kreuzungen und senkt den Wert in Abwärtstrends konservativ.' },
        { q: 'Wie wird der Kaufzeitpunkt-Score berechnet?', a: 'Jeder der 7 Indikatoren wird in einen 0–100-Teil-Score umgerechnet und gewichtet. Das Ergebnis ist 0–100, in 5 Bändern dargestellt.' },
        { q: 'Ist es kostenlos? Muss ich etwas installieren?', a: 'Es ist völlig kostenlos und ohne Installation. Echtzeitdaten stammen aus den öffentlichen APIs von CoinGecko, Binance und Alternative.me.' },
        { q: 'Wie unterscheidet sich der Index vom Kaufzeitpunkt-Score?', a: 'Der Index ist eine einzelne Stimmungskennzahl (0–100); der Kaufzeitpunkt-Score ist ein Verbund aus 7 Indikatoren inkl. Index (0–100).' },
        { q: 'Woher stammen die Daten und wie oft werden sie aktualisiert?', a: 'Der Angst- & Gier-Index stammt von Alternative.me, Preise und Tageskerzen von den öffentlichen APIs von CoinGecko und Binance, On-Chain-Metriken von CoinMetrics. Der Bildschirm aktualisiert sich etwa jede Minute automatisch.' },
        { q: 'Sollte ich Decentraland jetzt kaufen?', a: 'Eine eindeutige Antwort gibt es nicht, aber der Kaufzeitpunkt-Score (0–100) zeigt objektiv, ob der Markt in einer überverkauften Angst-Zone oder einer überhitzten Gier-Zone steckt. Auf dem Langfrist-Tab (antizyklisch) markieren hohe Werte Zonen, in denen Angst und Unterbewertung zusammenfallen — historisch günstig für DCA —, niedrige warnen vor Überhitzung. Ein Referenzsignal, keine Anlageberatung.' },
        { q: 'Wie unterscheiden sich kurz- und langfristiges Kauftiming?', a: 'Der Score ist in zwei Tabs geteilt. Kurzfristig (Momentum) folgt einer Trendfolge-Sicht von 1–3 Monaten und steigt mit starken Aufwärtstrends; langfristig (antizyklisch) folgt einer Zyklus-Sicht von über einem Jahr und steigt mit Angst und Unterbewertung. In Backtests seit 2017 funktionierte kurzfristig Momentum und langfristig die antizyklische Richtung besser.' },
        { q: 'Was ist der BOTTOM RADAR (Boden-Score)?', a: 'Eine Zusatzanzeige, die mit On-Chain-Metriken wie den MVRV Z-Score misst, wo die Marktkapitalisierung relativ zum durchschnittlichen Einstandskurs der Anleger liegt, und die Nähe zu historischen Bodenzonen auf einer Skala von 0–100 zeigt. Die vollständige Berechnung ist auf der Seite „Bitcoin-Boden“ veröffentlicht.' }
      ],
      disclaimer: '⚠ Dieser Score ist ein Referenzsignal aus öffentlichen Indikatoren, keine Anlageberatung. Alle Entscheidungen und die Verantwortung liegen bei Ihnen.'
    },
    it: {
      title: 'Indice di paura e avidità Decentraland e punteggio di timing d’acquisto',
      intro: 'Una dashboard gratuita che sintetizza 7 indicatori in tempo reale — incluso l’indice di paura e avidità di Decentraland — in un punteggio 0–100 «è il momento giusto per comprare?». Funziona nel browser senza installazione, in 13 lingue.',
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
        { q: 'Dovrei comprare Decentraland quando l’indice è basso?', a: 'La paura estrema è stata spesso un’occasione di accumulo, ma affidarsi solo all’indice rischia di «prendere un coltello che cade». Questo punteggio pesa anche RSI, MACD, multiplo di Mayer, ribasso e incroci di medie, e lo riduce in modo prudente nei trend ribassisti.' },
        { q: 'Come si calcola il punteggio d’acquisto?', a: 'Ciascuno dei 7 indicatori è convertito in un sotto-punteggio 0–100 e ponderato. Il risultato è 0–100, mostrato in 5 bande.' },
        { q: 'È gratis? Serve installare qualcosa?', a: 'È completamente gratis e senza installazione. I dati in tempo reale provengono dalle API pubbliche di CoinGecko, Binance e Alternative.me.' },
        { q: 'Che differenza c’è tra l’indice e il punteggio d’acquisto?', a: 'L’indice è una singola misura di sentiment (0–100); il punteggio d’acquisto è un composito dei 7 indicatori incluso l’indice (0–100).' },
        { q: 'Da dove vengono i dati e con che frequenza si aggiornano?', a: 'L’indice di paura e avidità viene da Alternative.me; prezzi e candele giornaliere dalle API pubbliche di CoinGecko e Binance; le metriche on-chain da CoinMetrics. Lo schermo si aggiorna automaticamente circa ogni minuto.' },
        { q: 'Dovrei comprare Decentraland adesso?', a: 'Non c’è una risposta unica, ma il punteggio d’acquisto (0–100) permette di valutare oggettivamente se il mercato è in zona ipervenduto/paura o surriscaldato/avidità. Nella scheda a lungo termine (contrarian), punteggi alti indicano zone in cui paura e sottovalutazione coincidono — storicamente favorevoli al PAC — mentre punteggi bassi avvertono del surriscaldamento. È un segnale di riferimento, non consulenza d’investimento.' },
        { q: 'Che differenza c’è tra timing a breve e a lungo termine?', a: 'Il punteggio è diviso in due schede. Il breve termine (momentum) adotta una visione trend-following di 1–3 mesi e sale con trend rialzisti forti; il lungo termine (contrarian) adotta una visione di ciclo oltre l’anno e sale con paura e sottovalutazione. Nei backtest dal 2017, il momentum ha funzionato meglio nel breve e il contrarian nel lungo.' },
        { q: 'Cos’è il BOTTOM RADAR (punteggio di minimo)?', a: 'Un indicatore ausiliario che usa metriche on-chain come l’MVRV Z-Score per misurare dove si trova la capitalizzazione rispetto al costo medio degli investitori, mostrando la vicinanza alle zone di minimo storiche su una scala 0–100. Il calcolo completo è pubblicato nella guida «minimo di Bitcoin».' }
      ],
      disclaimer: '⚠ Questo punteggio è un segnale di riferimento da indicatori pubblici, non consulenza d’investimento. Ogni decisione e responsabilità è tua.'
    },
    pt: {
      title: 'Índice de medo e ganância do Decentraland e pontuação de momento de compra',
      intro: 'Um painel gratuito que sintetiza 7 indicadores em tempo real — incluindo o índice de medo e ganância do Decentraland — numa pontuação de 0 a 100 «é uma boa hora para comprar?». Roda no navegador sem instalação, em 13 idiomas.',
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
        { q: 'Devo comprar Decentraland quando o índice está baixo?', a: 'O medo extremo foi muitas vezes uma oportunidade de acumulação, mas confiar só no índice arrisca «pegar uma faca caindo». Esta pontuação também pondera RSI, MACD, múltiplo de Mayer, queda e cruzamentos de médias, e a reduz de forma conservadora em tendências de baixa.' },
        { q: 'Como a pontuação de compra é calculada?', a: 'Cada um dos 7 indicadores é convertido numa subpontuação de 0 a 100 e ponderado. O resultado é 0–100, em 5 faixas.' },
        { q: 'É grátis? Preciso instalar algo?', a: 'É totalmente grátis e sem instalação. Os dados em tempo real vêm das APIs públicas da CoinGecko, Binance e Alternative.me.' },
        { q: 'Qual a diferença entre o índice e a pontuação de compra?', a: 'O índice é uma única métrica de sentimento (0–100); a pontuação de compra é um composto de 7 indicadores incluindo o índice (0–100).' },
        { q: 'De onde vêm os dados e com que frequência são atualizados?', a: 'O índice de medo e ganância vem da Alternative.me; preços e velas diárias, das APIs públicas da CoinGecko e da Binance; e as métricas on-chain, da CoinMetrics. A tela atualiza automaticamente a cada minuto, aproximadamente.' },
        { q: 'Devo comprar Decentraland agora?', a: 'Não há resposta única, mas a pontuação de compra (0–100) permite avaliar objetivamente se o mercado está em zona de sobrevenda/medo ou de superaquecimento/ganância. Na aba de longo prazo (contrária), pontuações altas marcam zonas onde medo e subvalorização coincidem — historicamente favoráveis ao DCA —, e as baixas alertam para superaquecimento. É um sinal de referência, não consultoria de investimento.' },
        { q: 'Qual a diferença entre o timing de curto e de longo prazo?', a: 'A pontuação divide-se em duas abas. O curto prazo (momentum) adota uma visão de seguimento de tendência de 1–3 meses e sobe com tendências de alta fortes; o longo prazo (contrário) adota uma visão de ciclo de mais de um ano e sobe com medo e subvalorização. Em backtests desde 2017, o momentum funcionou melhor no curto e o contrário no longo.' },
        { q: 'O que é o BOTTOM RADAR (pontuação de fundo)?', a: 'Um medidor auxiliar que usa métricas on-chain como o MVRV Z-Score para medir onde a capitalização está em relação ao custo médio dos investidores, mostrando a proximidade de zonas de fundo históricas numa escala de 0 a 100. O cálculo completo está publicado no guia «fundo do Bitcoin».' }
      ],
      disclaimer: '⚠ Esta pontuação é um sinal de referência a partir de indicadores públicos, não é consultoria de investimento. Todas as decisões e a responsabilidade são suas.'
    },
    ru: {
      title: 'Индекс страха и жадности децентраленда и оценка времени покупки',
      intro: 'Бесплатная панель, которая объединяет 7 индикаторов в реальном времени — включая индекс страха и жадности децентраленда — в оценку от 0 до 100 «подходящее ли сейчас время для покупки?». Работает в браузере без установки, на 13 языках.',
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
        { q: 'Покупать ли децентраленд, когда индекс низкий?', a: 'Крайний страх исторически часто был возможностью накопления, но полагаться только на индекс рискованно — можно «поймать падающий нож». Эта оценка также учитывает RSI, MACD, множитель Майера, просадку и пересечения средних и консервативно снижается в нисходящих трендах.' },
        { q: 'Как рассчитывается оценка покупки?', a: 'Каждый из 7 индикаторов переводится в частную оценку 0–100 и взвешивается. Результат — 0–100, в 5 диапазонах.' },
        { q: 'Это бесплатно? Нужно ли что-то устанавливать?', a: 'Полностью бесплатно и без установки. Данные в реальном времени берутся из публичных API CoinGecko, Binance и Alternative.me.' },
        { q: 'Чем индекс отличается от оценки покупки?', a: 'Индекс — одна метрика настроения (0–100); оценка покупки — составной показатель из 7 индикаторов, включая индекс (0–100).' },
        { q: 'Откуда берутся данные и как часто они обновляются?', a: 'Индекс страха и жадности — с Alternative.me; цены и дневные свечи — из публичных API CoinGecko и Binance; ончейн-метрики — из CoinMetrics. Экран автоматически обновляется примерно раз в минуту.' },
        { q: 'Стоит ли покупать децентраленд прямо сейчас?', a: 'Единственно верного ответа нет, но оценка покупки (0–100) объективно показывает, находится ли рынок в зоне перепроданности/страха или перегрева/жадности. На вкладке долгосрочного (контртрендового) взгляда высокие значения отмечают зоны, где совпадают страх и недооценка — исторически благоприятные для усреднения, — а низкие предупреждают о перегреве. Это справочный сигнал, а не инвестиционная рекомендация.' },
        { q: 'Чем отличаются краткосрочный и долгосрочный тайминг?', a: 'Оценка разделена на две вкладки. Краткосрочная (моментум) использует трендследящий взгляд на 1–3 месяца и растёт при сильных восходящих трендах; долгосрочная (контртренд) — циклический взгляд от года и растёт при страхе и недооценке. В бэктестах с 2017 года на коротком горизонте лучше работал моментум, на длинном — контртренд.' },
        { q: 'Что такое BOTTOM RADAR (оценка дна)?', a: 'Вспомогательный индикатор, который с помощью ончейн-метрик, таких как MVRV Z-оценка, измеряет положение капитализации относительно средней цены входа инвесторов и показывает близость к историческим зонам дна по шкале 0–100. Полный расчёт опубликован на странице «дно биткоина».' }
      ],
      disclaimer: '⚠ Эта оценка — справочный сигнал на основе публичных индикаторов, а не инвестиционная рекомендация. Все решения и ответственность — на вас.'
    },
    nl: {
      title: 'Decentraland Angst- & Hebzucht-index en koopmoment-score',
      intro: 'Een gratis dashboard dat 7 realtime indicatoren — inclusief de Decentraland Angst- & Hebzucht-index — samenvoegt tot een score van 0–100 voor «is het nu een goed moment om te kopen?». Draait in de browser zonder installatie, in 13 talen.',
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
        { q: 'Moet ik Decentraland kopen als de index laag is?', a: 'Extreme angst was vaak een accumulatiekans, maar alleen op de index vertrouwen riskeert «een vallend mes te vangen». Deze score weegt ook RSI, MACD, Mayer Multiple, daling en gemiddelde-kruisingen mee, en verlaagt de score behoudend in dalende trends.' },
        { q: 'Hoe wordt de koopmoment-score berekend?', a: 'Elk van de 7 indicatoren wordt omgezet naar een deelscore van 0–100 en gewogen. Het resultaat is 0–100, in 5 banden.' },
        { q: 'Is het gratis? Moet ik iets installeren?', a: 'Het is volledig gratis en zonder installatie. Realtime data komt van de publieke API’s van CoinGecko, Binance en Alternative.me.' },
        { q: 'Wat is het verschil tussen de index en de koopmoment-score?', a: 'De index is één sentimentmaatstaf (0–100); de koopmoment-score is een samenstelling van 7 indicatoren inclusief de index (0–100).' },
        { q: 'Waar komen de gegevens vandaan en hoe vaak worden ze ververst?', a: 'De Angst- & Hebzucht-index komt van Alternative.me; prijzen en dagcandles van de publieke API’s van CoinGecko en Binance; on-chain-metrieken van CoinMetrics. Het scherm ververst ongeveer elke minuut automatisch.' },
        { q: 'Moet ik nu Decentraland kopen?', a: 'Er is geen eenduidig antwoord, maar de koopmoment-score (0–100) geeft een objectief beeld of de markt in een oversold/angst-zone of een oververhitte/hebzucht-zone zit. Op het langetermijn-tabblad (tegendraads) markeren hoge scores zones waar angst en onderwaardering samenvallen — historisch gunstig voor DCA — terwijl lage scores waarschuwen voor oververhitting. Het is een referentiesignaal, geen beleggingsadvies.' },
        { q: 'Hoe verschillen korte- en langetermijn-kooptiming?', a: 'De score is verdeeld over twee tabbladen. Korte termijn (momentum) hanteert een trendvolgende blik van 1–3 maanden en stijgt bij sterke opwaartse trends; lange termijn (tegendraads) hanteert een cyclusblik van ruim een jaar en stijgt bij angst en onderwaardering. In backtests sinds 2017 werkte momentum beter op korte termijn en tegendraads beter op lange termijn.' },
        { q: 'Wat is de BOTTOM RADAR (bodemscore)?', a: 'Een hulpmeter die met on-chain-metrieken zoals de MVRV Z-score meet waar de marktkapitalisatie staat ten opzichte van de gemiddelde kostprijs van beleggers, en de nabijheid van historische bodemzones toont op een schaal van 0–100. De volledige berekening staat op de pagina «Bitcoin-bodem».' }
      ],
      disclaimer: '⚠ Deze score is een referentiesignaal uit publieke indicatoren, geen beleggingsadvies. Alle beslissingen en verantwoordelijkheid zijn van uzelf.'
    },
    th: {
      title: 'ดัชนีความกลัวและความโลภดีเซนทราแลนด์ และคะแนนจังหวะซื้อ',
      intro: 'แดชบอร์ดฟรีที่รวม 7 ตัวชี้วัดแบบเรียลไทม์ — รวมถึงดัชนีความกลัวและความโลภของดีเซนทราแลนด์ — เป็นคะแนน 0–100 ว่า “ตอนนี้เป็นจังหวะซื้อหรือไม่?” ใช้งานในเบราว์เซอร์ได้ทันที ไม่ต้องติดตั้ง รองรับ 13 ภาษา',
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
        { q: 'ถ้าดัชนีต่ำควรซื้อดีเซนทราแลนด์ไหม?', a: 'ความกลัวสุดขีดในอดีตมักเป็นโอกาสทยอยซื้อ แต่ดูเพียงดัชนีอย่างเดียวเสี่ยง “รับมีดที่กำลังตก” คะแนนนี้ยังพิจารณา RSI, MACD, Mayer Multiple, การย่อ และการตัดกันของเส้นเฉลี่ย และลดคะแนนอย่างระมัดระวังในแนวโน้มขาลง' },
        { q: 'คะแนนจังหวะซื้อคำนวณอย่างไร?', a: 'แปลงแต่ละตัวชี้วัดทั้ง 7 เป็นคะแนนย่อย 0–100 แล้วถ่วงน้ำหนักรวมกัน ผลลัพธ์คือ 0–100 แสดงเป็น 5 ระดับ' },
        { q: 'ฟรีไหม? ต้องติดตั้งไหม?', a: 'ฟรีทั้งหมดและไม่ต้องติดตั้ง ข้อมูลเรียลไทม์มาจาก API สาธารณะของ CoinGecko, Binance และ Alternative.me' },
        { q: 'ดัชนีกับคะแนนจังหวะซื้อต่างกันอย่างไร?', a: 'ดัชนีเป็นตัวชี้วัดอารมณ์เดียว (0–100); คะแนนจังหวะซื้อเป็นคะแนนรวมจาก 7 ตัวชี้วัดรวมถึงดัชนี (0–100)' },
        { q: 'ข้อมูลมาจากไหน อัปเดตบ่อยแค่ไหน?', a: 'ดัชนีความกลัว-ความโลภมาจาก Alternative.me ราคาและแท่งเทียนรายวันมาจาก API สาธารณะของ CoinGecko และ Binance ส่วนตัวชี้วัดออนเชนมาจาก CoinMetrics หน้าจออัปเดตอัตโนมัติราวทุก 1 นาที' },
        { q: 'ตอนนี้ควรซื้อดีเซนทราแลนด์ไหม?', a: 'ไม่มีคำตอบตายตัว แต่คะแนนจังหวะซื้อ (0–100) ช่วยประเมินอย่างเป็นกลางว่าตลาดอยู่ในโซนขายมากเกิน/ความกลัว หรือโซนร้อนแรง/ความโลภ ในแท็บระยะยาว (สวนตลาด) คะแนนยิ่งสูงหมายถึงโซนที่ความกลัวและราคาต่ำกว่ามูลค่าทับซ้อนกัน ซึ่งในอดีตเอื้อต่อ DCA ส่วนคะแนนต่ำเตือนถึงความร้อนแรง เป็นเพียงสัญญาณอ้างอิง ไม่ใช่คำแนะนำการลงทุน' },
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
  /* 푸터 설명 문단(.foot-desc) — 디센트럴랜드 언급이 있어 공통 foot-i18n.js 가 아니라 여기에 둔다 */
  var FOOT_DESC = {
    ko: 'broodev는 설치 없이 브라우저에서 바로 쓰는 무료 웹앱을 만드는 앱 포트폴리오입니다. 이 페이지의 디센트럴랜드 공포·탐욕 지수와 매수 타이밍 점수는 공개 지표를 합성한 참고 정보이며 투자 자문이 아닙니다. 광고는 Google AdSense를 통해 게재될 수 있습니다.',
    en: 'broodev is a portfolio of free web apps that run right in your browser with no install. The Decentraland Fear & Greed Index and buy-timing score on this page are reference information synthesized from public indicators, not investment advice. Ads may be served through Google AdSense.',
    ja: 'broodevは、インストール不要でブラウザからすぐ使える無料Webアプリを作るアプリポートフォリオです。このページのディセントラランド恐怖・強欲指数と買い時スコアは公開指標を合成した参考情報であり、投資助言ではありません。広告はGoogle AdSenseを通じて掲載される場合があります。',
    zh: 'broodev 是一个应用作品集，制作无需安装、在浏览器中即可直接使用的免费网页应用。本页的Decentraland恐惧与贪婪指数和买入时机评分是综合公开指标得出的参考信息，不构成投资建议。广告可能通过 Google AdSense 投放。',
    'zh-Hant': 'broodev 是一個應用作品集，製作無需安裝、在瀏覽器中即可直接使用的免費網頁應用。本頁的Decentraland恐懼與貪婪指數和買入時機評分是綜合公開指標得出的參考資訊，不構成投資建議。廣告可能透過 Google AdSense 刊登。',
    th: 'broodev คือพอร์ตโฟลิโอแอปที่สร้างเว็บแอปฟรีซึ่งใช้งานได้ทันทีในเบราว์เซอร์โดยไม่ต้องติดตั้ง ดัชนีความกลัว-ความโลภดีเซนทราแลนด์และคะแนนจังหวะซื้อในหน้านี้เป็นข้อมูลอ้างอิงที่สังเคราะห์จากตัวชี้วัดสาธารณะ ไม่ใช่คำแนะนำการลงทุน โฆษณาอาจแสดงผ่าน Google AdSense',
    es: 'broodev es un portafolio de aplicaciones web gratuitas que funcionan directamente en el navegador, sin instalación. El Índice de Miedo y Codicia de Decentraland y la puntuación de momento de compra de esta página son información de referencia elaborada a partir de indicadores públicos, no asesoramiento de inversión. Los anuncios pueden mostrarse a través de Google AdSense.',
    fr: 'broodev est un portfolio d’applications web gratuites qui s’utilisent directement dans le navigateur, sans installation. L’indice Peur & Avidité du Decentraland et le score de timing d’achat de cette page sont des informations de référence issues d’indicateurs publics, et non un conseil en investissement. Des annonces peuvent être diffusées via Google AdSense.',
    de: 'broodev ist ein Portfolio kostenloser Web-Apps, die ohne Installation direkt im Browser laufen. Der Decentraland-Angst-und-Gier-Index und der Kauf-Timing-Score auf dieser Seite sind aus öffentlichen Indikatoren zusammengesetzte Referenzinformationen und keine Anlageberatung. Werbung kann über Google AdSense ausgeliefert werden.',
    it: 'broodev è un portfolio di web app gratuite che funzionano direttamente nel browser, senza installazione. L’Indice di Paura e Avidità di Decentraland e il punteggio di timing d’acquisto in questa pagina sono informazioni di riferimento ricavate da indicatori pubblici, non una consulenza di investimento. Gli annunci possono essere pubblicati tramite Google AdSense.',
    pt: 'O broodev é um portefólio de aplicações web gratuitas que funcionam diretamente no navegador, sem instalação. O Índice de Medo e Ganância do Decentraland e a pontuação de momento de compra desta página são informação de referência sintetizada a partir de indicadores públicos, não aconselhamento de investimento. Os anúncios podem ser apresentados através do Google AdSense.',
    ru: 'broodev — это портфолио бесплатных веб-приложений, которые работают прямо в браузере без установки. Индекс страха и жадности децентраленда и оценка момента покупки на этой странице — справочная информация, собранная из открытых индикаторов, а не инвестиционная рекомендация. Реклама может показываться через Google AdSense.',
    nl: 'broodev is een portfolio van gratis webapps die zonder installatie direct in je browser werken. De Decentraland Angst- en Hebzuchtindex en de koop-timingscore op deze pagina zijn referentie-informatie samengesteld uit openbare indicatoren, geen beleggingsadvies. Advertenties kunnen via Google AdSense worden getoond.'
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
    "title": "Decentraland (MANA) buy-timing score and Fear & Greed Index",
    "intro": "The Decentraland (MANA) page scores buy timing from 0 to 100 using seven indicators: five price indicators (RSI(14), MACD(12·26·9), the Mayer Multiple, the drawdown from the 365-day high and the 50/200 moving-average cross), the on-chain MVRV Z-Score and the market-wide Fear & Greed Index. The score falls into five bands from STRONG BUY to OVERHEATED, and today's score is free.",
    "coinH": "What is Decentraland (MANA)?",
    "coinP": [
     "Decentraland is a 3D virtual world where users own virtual land called LAND and build scenes, games and exhibition spaces on it. The project was started by Ari Meilich and Esteban Ordano, sold MANA in a 2017 ICO and opened to the public in February 2020. MANA is an ERC-20 token on Ethereum, so it has no consensus mechanism of its own and relies on the security of the Ethereum network, which has run on proof of stake since the 2022 Merge.",
     "MANA is used on the marketplace to buy and sell NFTs such as avatar wearables, NAMEs and LAND, and MANA and LAND holders vote in the Decentraland DAO on policies and the use of its funds. The MANA paid in the first LAND auction (the Terraform Event) in December 2017 was burned, so today's total supply is smaller than the amount originally issued. LAND consists of roughly 90,000 parcels on the Genesis City map."
    ],
    "applyH": "Applying the indicators to Decentraland",
    "apply": [
     "MVRV is available: CoinMetrics community data includes MVRV for MANA, so the MVRV Z-Score is calculated. Its thresholds, z below 0 (under the average cost basis) and z above 5 (overheated), come from Bitcoin's history, so treat them as a rough guide for MANA; if the data is delayed or missing, the card switches to N/A.",
     "Market-wide sentiment: the Fear & Greed Index does not measure the mood of MANA holders. It is Alternative.me's Bitcoin-centric index for the whole market, so trends limited to MANA, such as the metaverse theme, do not show up in it.",
     "Big swings, thin liquidity: MANA trades far less volume than Bitcoin, so its price can jump sharply in a short time and RSI and MACD often flip direction within a day or two. Look at the direction over several days rather than a single day's signal.",
     "The 200-day yardstick: the Mayer Multiple's 0.8 and 2.4 levels (price ÷ 200-day average) were set for Bitcoin. After several boom-and-bust swings, MANA often trades much farther from its 200-day average, so the same number carries less weight.",
     "Sector moves: MANA has often risen and fallen around the same time as other metaverse tokens such as The Sandbox (SAND). When the two scores move together, consider that it may be a sector-wide trend rather than MANA-specific news."
    ],
    "histH": "Decentraland price cycle summary",
    "hist": [
     "2017 — MANA was sold in an ICO, and the MANA paid in December's first LAND auction was burned.",
     "2020 — the virtual world opened to the public in February, and the Decentraland DAO launched the same year.",
     "November 2021 — as metaverse tokens surged after Facebook renamed itself Meta, MANA also set its all-time high.",
     "2022 — losses continued through the bear market, and by year-end MANA was more than 90% below its all-time high."
    ],
    "faq": [
     {
      "q": "Is there a separate fear index for Decentraland?",
      "a": "MANA has no Fear & Greed Index of its own. The value on the page is the market-wide sentiment index that Alternative.me calculates around Bitcoin and publishes daily, and every coin page shows the same number. Judge MANA's own movement from the price indicators and MVRV."
     },
     {
      "q": "Does Decentraland show MVRV?",
      "a": "Yes. The CoinMetrics community API provides MVRV for MANA, so the MVRV Z-Score card is calculated. MVRV is a premium indicator: on the free view you see its name but the value is hidden. If CoinMetrics does not respond, it switches to N/A and the score uses the remaining indicators."
     },
     {
      "q": "Should I buy Decentraland now?",
      "a": "Whether to buy is your own decision; this page does not give investment advice. A score of 80 or more (STRONG BUY) means several oversold, fear and undervaluation signals overlap, while below 25 (OVERHEATED) means overheating signals overlap. Because MANA is volatile, a band may not last long."
     },
     {
      "q": "Do MANA burns affect the score?",
      "a": "Not directly. The score is calculated only from price, market sentiment and MVRV; supply or governance changes such as burns or DAO decisions show up only indirectly, to the extent they move the price or on-chain values."
     },
     {
      "q": "Why do The Sandbox and Decentraland scores often look alike?",
      "a": "Both tokens are grouped under the metaverse theme and have often moved at similar times, and they share the same Fear & Greed input. Differences can come from MVRV: it is calculated for MANA but shows N/A on the SAND page, so the weighting differs."
     },
     {
      "q": "Does a Mayer Multiple below 0.8 mean MANA is undervalued?",
      "a": "That is hard to say. The 0.8 level treats a price 20% below the 200-day moving average as a strong-buy zone, and it was derived from Bitcoin. MANA has had long downtrends spent below its 200-day average, so check it alongside the other indicators."
     }
    ]
   },
   "ja": {
    "title": "ディセントラランド(MANA)の買い時スコアと恐怖・強欲指数",
    "intro": "ディセントラランド(MANA)の画面では、価格指標5つ(RSI(14)、MACD(12・26・9)、メイヤー倍率、365日高値からの下落率、50/200移動平均クロス)に、オンチェーン指標のMVRV Zスコアと市場全体の恐怖・強欲指数を加えた7指標で、買い時を0〜100点で評価します。スコアはSTRONG BUYからOVERHEATEDまでの5段階に分かれ、当日のスコアは無料です。",
    "coinH": "ディセントラランド(MANA)とは?",
    "coinP": [
     "ディセントラランド(Decentraland)は、ユーザーが仮想土地LANDを所有し、その上にシーンやゲーム、展示空間を作って運営する3D仮想世界です。Ari MeilichとEsteban Ordanoが始めたプロジェクトで、2017年のICOでMANAを販売し、2020年2月に一般公開されました。MANAはイーサリアムのERC-20トークンなので独自のコンセンサス方式を持たず、イーサリアムネットワーク(2022年のマージ以降はプルーフ・オブ・ステーク)のセキュリティをそのまま利用しています。",
     "MANAはマーケットプレイスでアバターの衣装(ウェアラブル)、名前(NAME)、LANDといったNFTを売買するのに使われ、MANAやLANDの保有者はディセントラランドDAOの投票に参加して方針や資金の使い道を決めます。2017年12月の最初のLANDオークション(テラフォームイベント)で支払われたMANAは焼却されたため、現在の総供給量は当初の発行量より少なくなっています。LANDはGenesis Cityの地図上の約9万区画で構成されています。"
    ],
    "applyH": "ディセントラランドに指標を当てはめるとき",
    "apply": [
     "MVRVが使える：MANAはCoinMetricsのコミュニティデータにMVRVがあるため、MVRV Zスコアが計算されます。ただしz<0(平均取得原価を下回る)、z>5(過熱)という基準はビットコインの歴史から来た値なので、MANAでは目安程度に見るのがよく、データが遅れたり途切れたりするとカードはN/Aになります。",
     "市場全体の心理：恐怖・強欲指数はMANA保有者だけの心理ではなく、Alternative.meがビットコイン中心に算出する市場全体の指数です。メタバース関連の話題のように、MANAに限られた流れはこの値には表れません。",
     "大きな値動きと薄い流動性：MANAは出来高がビットコインよりはるかに小さく、短期間で価格が大きく跳ねやすいうえ、RSIやMACDも1〜2日で向きが変わりがちです。1日分のシグナルより、数日間の方向を確認してください。",
     "200日線の基準：メイヤー倍率(価格÷200日線)の0.8と2.4という基準はビットコインに合わせた数字です。急騰と急落を何度も経験したMANAは200日線から大きく離れることが多く、同じ数字でも重みが違います。",
     "セクターの連動：MANAはサンドボックス(SAND)など他のメタバース系トークンと同じ時期に上下することが多くありました。2つの画面のスコアが一緒に動くときは、個別材料よりセクター全体の流れである可能性を考えてください。"
    ],
    "histH": "ディセントラランドの価格サイクルの要約",
    "hist": [
     "2017年 — ICOでMANAが販売され、12月の最初のLANDオークションで支払われたMANAが焼却されました。",
     "2020年 — 2月に仮想世界が一般公開され、同じ年にディセントラランドDAOが発足しました。",
     "2021年11月 — FacebookがMetaに社名を変えた後、メタバース系トークンが軒並み急騰するなか、MANAも史上最高値を付けました。",
     "2022年 — 弱気相場で下落が続き、年末には史上最高値から90%以上低い水準まで下がりました。"
    ],
    "faq": [
     {
      "q": "ディセントラランド専用の恐怖指数はありますか?",
      "a": "MANAだけの恐怖・強欲指数はありません。画面に出る値はAlternative.meがビットコインを中心に算出し毎日公開している市場全体の心理指数で、どのコインの画面にも同じ数字が入ります。MANA個別の動きは価格指標とMVRVで判断します。"
     },
     {
      "q": "ディセントラランドでもMVRVは表示されますか?",
      "a": "はい。CoinMetricsのコミュニティAPIがMANAのMVRVを提供しているため、MVRV Zスコアのカードが計算されます。MVRVはプレミアム指標なので、無料画面では名前だけが見え、値は隠されます。CoinMetricsから応答がない場合はN/Aになり、スコアは残りの指標で計算されます。"
     },
     {
      "q": "今ディセントラランドを買ってもいいですか?",
      "a": "買うかどうかはご自身の判断で、この画面は投資助言を行いません。スコアが80以上(STRONG BUY)なら売られすぎ・恐怖・割安のシグナルが複数重なっている状態、25未満(OVERHEATED)なら過熱のシグナルが重なっている状態です。MANAは値動きが大きいため、同じ段階が長く続かないこともあります。"
     },
     {
      "q": "MANAの焼却はスコアに影響しますか?",
      "a": "直接の影響はありません。スコアは価格、市場心理、MVRVだけで計算され、焼却やDAOの決定といった供給・ガバナンスの変化は、価格やオンチェーンの値に表れた分だけ間接的に反映されます。"
     },
     {
      "q": "サンドボックスとディセントラランドのスコアが似るのはなぜですか?",
      "a": "2つのトークンはメタバース銘柄としてまとめて扱われ、同じ時期に動くことが多かったうえ、恐怖・強欲指数の入力も同じです。違いはMVRVから生じることがあります。MANAではMVRVが計算されますが、SANDの画面はN/Aなので重みの構成が異なります。"
     },
     {
      "q": "メイヤー倍率が0.8を下回ればMANAは割安ですか?",
      "a": "そうとは言い切れません。0.8は価格が200日移動平均より20%低い状態を強い買いゾーンとみなす基準で、ビットコインから導かれた値です。MANAには200日線の下に長くとどまった下落局面があったため、ほかの指標と合わせて確認してください。"
     }
    ]
   },
   "ko": {
    "title": "디센트럴랜드(MANA) 매수 타이밍 점수와 공포·탐욕 지수",
    "intro": "디센트럴랜드(MANA) 화면은 가격 지표 5개(RSI(14), MACD(12·26·9), 마이어 배수, 365일 고점 대비 낙폭, 50/200 이동평균 크로스)에 온체인 지표 MVRV Z-Score와 시장 전체 공포·탐욕 지수를 더해, 7개 지표로 매수 타이밍을 0~100점으로 매깁니다. 점수 구간은 STRONG BUY부터 OVERHEATED까지 5단계이며, 오늘의 점수는 무료입니다.",
    "coinH": "디센트럴랜드(MANA)란?",
    "coinP": [
     "디센트럴랜드(Decentraland)는 이용자가 가상 토지 LAND를 소유하고 그 위에 장면·게임·전시 공간을 지어 운영하는 3D 가상 세계입니다. 아리 메일리치(Ari Meilich)와 에스테반 오르다노(Esteban Ordano)가 시작한 프로젝트로, 2017년 ICO에서 MANA를 판매했고 2020년 2월 일반 이용자에게 문을 열었습니다. MANA는 이더리움의 ERC-20 토큰이어서 독자적인 합의 방식이 없으며, 이더리움 네트워크(2022년 머지 이후 지분증명)의 보안을 그대로 이용합니다.",
     "MANA는 마켓플레이스에서 아바타 의상(웨어러블)·이름(NAME)·LAND 같은 NFT를 사고팔 때 쓰이고, MANA와 LAND 보유자는 디센트럴랜드 DAO 투표에 참여해 정책과 기금 사용을 결정합니다. 2017년 12월 첫 LAND 경매(테라폼 이벤트)에서 지불된 MANA는 소각돼, 현재 총공급량은 최초 발행량보다 적습니다. LAND는 Genesis City 지도 위 약 9만 필지로 이뤄져 있습니다."
    ],
    "applyH": "디센트럴랜드에 지표를 적용할 때",
    "apply": [
     "MVRV 사용 가능: MANA는 CoinMetrics 커뮤니티 데이터에 MVRV가 있어 MVRV Z-Score가 계산됩니다. 다만 z<0(평균 매수원가 아래)·z>5(과열) 기준은 비트코인 역사에서 나온 값이므로 MANA에서는 참고 범위로 보는 편이 좋고, 데이터가 늦거나 끊기면 카드는 N/A로 바뀝니다.",
     "시장 전체 심리: 공포·탐욕 지수는 MANA 투자자만의 심리가 아니라 Alternative.me가 비트코인 중심으로 산출하는 시장 전체 지수입니다. 메타버스 테마처럼 MANA에 국한된 흐름은 이 값에 드러나지 않습니다.",
     "큰 등락과 얕은 유동성: MANA는 거래량이 비트코인보다 훨씬 작아 짧은 기간에 가격이 크게 튀기 쉽고, RSI·MACD도 하루 이틀 사이에 방향이 뒤집히곤 합니다. 하루치 신호보다 며칠에 걸친 방향을 확인하세요.",
     "200일선 기준: 마이어 배수(가격 ÷ 200일선)의 0.8·2.4 기준은 비트코인에 맞춘 숫자입니다. 급등락을 여러 번 겪은 MANA는 가격이 200일선에서 훨씬 멀리 벗어나는 일이 잦아, 같은 숫자라도 무게가 다릅니다.",
     "섹터 동조: MANA는 샌드박스(SAND) 등 다른 메타버스 토큰과 비슷한 시기에 오르내린 경우가 많았습니다. 두 화면 점수가 함께 움직이면 개별 재료보다 섹터 전체 흐름일 가능성을 염두에 두세요."
    ],
    "histH": "디센트럴랜드 가격 사이클 요약",
    "hist": [
     "2017년 — ICO로 MANA를 판매했고, 12월 첫 LAND 경매에서 지불된 MANA가 소각됐습니다.",
     "2020년 — 2월 가상 세계가 일반에 공개됐고, 같은 해 디센트럴랜드 DAO가 출범했습니다.",
     "2021년 11월 — 페이스북의 메타(Meta) 사명 변경 뒤 메타버스 토큰 전반이 급등하는 가운데 MANA도 사상 최고가를 기록했습니다.",
     "2022년 — 약세장 속에 하락이 이어져, 연말에는 사상 최고가 대비 90% 이상 낮은 수준까지 내려갔습니다."
    ],
    "faq": [
     {
      "q": "디센트럴랜드 공포지수가 따로 있나요?",
      "a": "MANA만의 공포·탐욕 지수는 없습니다. 화면에 나오는 값은 Alternative.me가 비트코인을 중심으로 산출해 매일 공개하는 시장 전체 심리 지수이며, 모든 코인 화면에 같은 숫자가 들어갑니다. MANA 개별 흐름은 가격 지표와 MVRV로 판단합니다."
     },
     {
      "q": "디센트럴랜드에도 MVRV가 나오나요?",
      "a": "네. CoinMetrics 커뮤니티 API가 MANA의 MVRV를 제공해 MVRV Z-Score 카드가 계산됩니다. MVRV는 프리미엄 지표라 무료 화면에서는 이름만 보이고 값은 가려집니다. CoinMetrics 응답이 없으면 N/A로 바뀌고, 점수는 나머지 지표로 계산됩니다."
     },
     {
      "q": "지금 디센트럴랜드 사도 되나요?",
      "a": "매수 여부는 스스로 판단할 일이며, 이 화면은 투자 조언을 하지 않습니다. 점수가 80 이상(STRONG BUY)이면 과매도·공포·저평가 신호가 여럿 겹쳤다는 뜻이고, 25 미만(OVERHEATED)이면 과열 신호가 겹쳤다는 뜻입니다. MANA는 변동성이 커서 같은 구간이 오래 유지되지 않을 수 있습니다."
     },
     {
      "q": "MANA 소각이 점수에 영향을 주나요?",
      "a": "직접 영향은 없습니다. 점수는 가격·시장 심리·MVRV로만 계산되며, 소각이나 DAO 결정 같은 공급·거버넌스 변화는 가격이나 온체인 값에 반영된 만큼만 간접적으로 드러납니다."
     },
     {
      "q": "샌드박스와 디센트럴랜드 점수가 비슷하게 나오는 이유는?",
      "a": "두 토큰은 메타버스 테마로 묶여 비슷한 시기에 움직인 경우가 많고, 공포·탐욕 지수 입력도 같습니다. 차이는 MVRV에서 생길 수 있습니다. MANA는 MVRV가 계산되지만 SAND 화면은 N/A라 가중치 구성이 다릅니다."
     },
     {
      "q": "마이어 배수가 0.8 아래면 MANA가 저평가라는 뜻인가요?",
      "a": "그렇게 단정하기 어렵습니다. 0.8은 가격이 200일 이동평균보다 20% 낮은 상태를 강한 매수 구간으로 보는 기준으로, 비트코인에서 나온 값입니다. MANA는 200일선 아래에 오래 머문 하락 구간이 있었으므로 다른 지표와 함께 확인해야 합니다."
     }
    ]
   },
   "zh": {
    "title": "Decentraland(MANA)买入时机评分与恐惧与贪婪指数",
    "intro": "Decentraland(MANA)页面用7项指标为买入时机打0–100分：5项价格指标(RSI(14)、MACD(12·26·9)、梅耶倍数、距365日高点回撤、50/200均线交叉)，加上链上指标MVRV Z分数和全市场恐惧与贪婪指数。评分分为STRONG BUY至OVERHEATED五档，当日评分免费。",
    "coinH": "Decentraland(MANA)是什么？",
    "coinP": [
     "Decentraland是一个3D虚拟世界，用户拥有名为LAND的虚拟土地，并在上面搭建场景、游戏和展示空间。项目由Ari Meilich和Esteban Ordano发起，2017年通过ICO出售MANA，2020年2月向公众开放。MANA是以太坊上的ERC-20代币，没有独立的共识机制，直接依靠以太坊网络(2022年合并后采用权益证明)的安全性。",
     "MANA用于在市场中买卖头像服饰(可穿戴物品)、名称(NAME)和LAND等NFT；MANA和LAND持有者可参与Decentraland DAO投票，决定政策和资金用途。2017年12月首次LAND拍卖(Terraform活动)中支付的MANA已被销毁，因此目前的总供应量少于最初发行量。LAND由Genesis City地图上约9万块地块组成。"
    ],
    "applyH": "将指标用于Decentraland时",
    "apply": [
     "可使用MVRV：CoinMetrics社区数据提供MANA的MVRV，因此可以计算MVRV Z分数。不过z<0(低于平均持仓成本)和z>5(过热)的阈值来自比特币的历史，对MANA只宜作为大致参考；数据延迟或中断时，卡片会变为N/A。",
     "全市场情绪：恐惧与贪婪指数反映的不是MANA持有者的情绪，而是Alternative.me以比特币为中心计算的全市场指数。元宇宙题材等只涉及MANA的走势不会体现在这个数值里。",
     "大幅波动与流动性不足：MANA的成交量远小于比特币，价格容易在短时间内大幅跳动，RSI和MACD也常在一两天内反转。与其看单日信号，不如确认几天内的方向。",
     "200日均线标准：梅耶倍数(价格÷200日均线)的0.8和2.4是按比特币设定的数字。经历过多轮暴涨暴跌的MANA经常远离200日均线，同样的数字分量并不相同。",
     "板块联动：MANA过去常与沙盒(SAND)等其他元宇宙代币在相近时间涨跌。两个页面的评分同步变化时，要考虑这可能是整个板块的走势，而不是MANA自身的消息。"
    ],
    "histH": "Decentraland价格周期概要",
    "hist": [
     "2017年 — 通过ICO出售MANA，12月首次LAND拍卖中支付的MANA被销毁。",
     "2020年 — 2月虚拟世界向公众开放，同年Decentraland DAO成立。",
     "2021年11月 — Facebook更名为Meta后元宇宙代币普遍暴涨，MANA也创下历史最高价。",
     "2022年 — 熊市中持续下跌，到年底已比历史最高价低90%以上。"
    ],
    "faq": [
     {
      "q": "Decentraland有单独的恐惧指数吗？",
      "a": "MANA没有自己的恐惧与贪婪指数。页面上的数值是Alternative.me以比特币为中心计算、每日公布的全市场情绪指数，所有币种页面显示的都是同一个数字。MANA自身的走势要靠价格指标和MVRV判断。"
     },
     {
      "q": "Decentraland也会显示MVRV吗？",
      "a": "会。CoinMetrics社区API提供MANA的MVRV，因此会计算MVRV Z分数卡片。MVRV属于高级(Premium)指标，免费页面只显示名称，数值会被遮挡。CoinMetrics没有响应时显示N/A，评分由其余指标计算。"
     },
     {
      "q": "现在可以买Decentraland吗？",
      "a": "是否买入需要你自己决定，本页面不提供投资建议。评分在80以上(STRONG BUY)表示超卖、恐惧和低估信号同时出现多个，低于25(OVERHEATED)则表示过热信号叠加。MANA波动大，同一档位可能维持不久。"
     },
     {
      "q": "MANA销毁会影响评分吗？",
      "a": "不会直接影响。评分只根据价格、市场情绪和MVRV计算；销毁或DAO决议等供应与治理变化，只有在反映到价格或链上数值时才会间接体现。"
     },
     {
      "q": "为什么沙盒和Decentraland的评分常常相近？",
      "a": "这两种代币同属元宇宙题材，过去常在相近时间波动，而且恐惧与贪婪指数的输入也相同。差异可能来自MVRV：MANA可以计算MVRV，而SAND页面显示N/A，因此权重构成不同。"
     },
     {
      "q": "梅耶倍数低于0.8就说明MANA被低估了吗？",
      "a": "很难这样断定。0.8这一标准把价格比200日移动平均线低20%的状态视为强烈买入区，它源自比特币。MANA曾长期处于200日均线下方的下跌阶段，因此需要结合其他指标一起确认。"
     }
    ]
   },
   "zh-Hant": {
    "title": "Decentraland(MANA)買入時機評分與恐懼與貪婪指數",
    "intro": "Decentraland(MANA)頁面以7項指標為買入時機打0–100分：5項價格指標(RSI(14)、MACD(12·26·9)、梅耶倍數、距365日高點回檔幅度、50/200均線交叉)，再加上鏈上指標MVRV Z分數和全市場恐懼與貪婪指數。評分分為STRONG BUY至OVERHEATED五個等級，當日評分免費。",
    "coinH": "Decentraland(MANA)是什麼？",
    "coinP": [
     "Decentraland是一個3D虛擬世界，使用者擁有名為LAND的虛擬土地，並在上面打造場景、遊戲和展覽空間。專案由Ari Meilich和Esteban Ordano發起，2017年透過ICO出售MANA，2020年2月對大眾開放。MANA是以太坊上的ERC-20代幣，沒有獨立的共識機制，直接仰賴以太坊網路(2022年合併後採用權益證明)的安全性。",
     "MANA用於在市集中買賣頭像服飾(穿戴物品)、名稱(NAME)和LAND等NFT；MANA和LAND持有者可參與Decentraland DAO投票，決定政策與資金用途。2017年12月首次LAND拍賣(Terraform活動)中支付的MANA已被銷毀，因此目前的總供給量少於最初發行量。LAND由Genesis City地圖上約9萬塊土地組成。"
    ],
    "applyH": "將指標用於Decentraland時",
    "apply": [
     "可使用MVRV：CoinMetrics社群資料提供MANA的MVRV，因此能計算MVRV Z分數。不過z<0(低於平均持有成本)和z>5(過熱)的門檻來自比特幣的歷史，對MANA只適合當作大致參考；資料延遲或中斷時，卡片會變成N/A。",
     "全市場情緒：恐懼與貪婪指數反映的不是MANA持有者的情緒，而是Alternative.me以比特幣為中心計算的全市場指數。元宇宙題材等只與MANA有關的走勢不會出現在這個數值中。",
     "大幅波動與流動性偏低：MANA的成交量遠小於比特幣，價格容易在短時間內大幅跳動，RSI和MACD也常在一兩天內翻轉。與其看單日訊號，不如確認幾天內的方向。",
     "200日均線標準：梅耶倍數(價格÷200日均線)的0.8和2.4是依比特幣設定的數字。經歷多輪暴漲暴跌的MANA經常遠離200日均線，同樣的數字份量並不相同。",
     "類股連動：MANA過去常與沙盒(SAND)等其他元宇宙代幣在相近時間漲跌。兩個頁面的評分同步變化時，要考慮這可能是整個類股的走勢，而非MANA本身的消息。"
    ],
    "histH": "Decentraland價格週期概要",
    "hist": [
     "2017年 — 透過ICO出售MANA，12月首次LAND拍賣中支付的MANA遭到銷毀。",
     "2020年 — 2月虛擬世界對大眾開放，同年Decentraland DAO成立。",
     "2021年11月 — Facebook更名為Meta後元宇宙代幣普遍暴漲，MANA也創下歷史最高價。",
     "2022年 — 空頭市場中持續下跌，到年底已比歷史最高價低90%以上。"
    ],
    "faq": [
     {
      "q": "Decentraland有專屬的恐懼指數嗎？",
      "a": "MANA沒有自己的恐懼與貪婪指數。頁面上的數值是Alternative.me以比特幣為中心計算、每天公布的全市場情緒指數，所有幣種頁面顯示的都是同一個數字。MANA本身的走勢要靠價格指標和MVRV判斷。"
     },
     {
      "q": "Decentraland也會顯示MVRV嗎？",
      "a": "會。CoinMetrics社群API提供MANA的MVRV，因此會計算MVRV Z分數卡片。MVRV屬於進階(Premium)指標，免費頁面只顯示名稱，數值會被遮住。CoinMetrics沒有回應時顯示N/A，評分由其餘指標計算。"
     },
     {
      "q": "現在可以買Decentraland嗎？",
      "a": "是否買進需要你自己決定，本頁面不提供投資建議。評分在80以上(STRONG BUY)代表超賣、恐懼和低估訊號同時出現多個，低於25(OVERHEATED)則代表過熱訊號疊加。MANA波動大，同一個等級可能維持不久。"
     },
     {
      "q": "MANA銷毀會影響評分嗎？",
      "a": "不會直接影響。評分只根據價格、市場情緒和MVRV計算；銷毀或DAO決議等供給與治理變化，只有在反映到價格或鏈上數值時才會間接呈現。"
     },
     {
      "q": "為什麼沙盒和Decentraland的評分常常相近？",
      "a": "這兩種代幣同屬元宇宙題材，過去常在相近時間波動，而且恐懼與貪婪指數的輸入也相同。差異可能來自MVRV：MANA可以計算MVRV，而SAND頁面顯示N/A，因此權重組成不同。"
     },
     {
      "q": "梅耶倍數低於0.8就代表MANA被低估嗎？",
      "a": "很難這樣斷定。0.8這個標準把價格比200日移動平均線低20%的狀態視為強烈買入區，它源自比特幣。MANA曾長期處於200日均線下方的下跌階段，因此需要搭配其他指標一起確認。"
     }
    ]
   },
   "th": {
    "title": "คะแนนจังหวะซื้อดีเซนทราแลนด์ (MANA) และดัชนีความกลัว-ความโลภ",
    "intro": "หน้าดีเซนทราแลนด์ (MANA) ให้คะแนนจังหวะซื้อ 0–100 จาก 7 ตัวชี้วัด ได้แก่ ตัวชี้วัดราคา 5 ตัว (RSI(14), MACD(12·26·9), Mayer Multiple, การย่อตัวจากจุดสูงสุด 365 วัน และการตัดกันของเส้นค่าเฉลี่ย 50/200) ตัวชี้วัดออนเชน MVRV Z-Score และดัชนีความกลัว-ความโลภของทั้งตลาด คะแนนแบ่งเป็น 5 ระดับตั้งแต่ STRONG BUY ถึง OVERHEATED และคะแนนของวันนี้ดูได้ฟรี",
    "coinH": "ดีเซนทราแลนด์ (MANA) คืออะไร?",
    "coinP": [
     "ดีเซนทราแลนด์ (Decentraland) เป็นโลกเสมือนสามมิติที่ผู้ใช้เป็นเจ้าของที่ดินเสมือนที่เรียกว่า LAND และสร้างฉาก เกม หรือพื้นที่จัดแสดงบนที่ดินนั้น โปรเจกต์นี้เริ่มโดย Ari Meilich และ Esteban Ordano ขาย MANA ผ่าน ICO ในปี 2017 และเปิดให้คนทั่วไปใช้งานในเดือนกุมภาพันธ์ 2020 MANA เป็นโทเคน ERC-20 บนอีเธอเรียม จึงไม่มีกลไกฉันทามติของตัวเอง และใช้ความปลอดภัยของเครือข่ายอีเธอเรียม ซึ่งเปลี่ยนมาใช้ Proof of Stake หลัง The Merge ปี 2022",
     "MANA ใช้ซื้อขาย NFT ในมาร์เก็ตเพลส เช่น ชุดอวาตาร์ (Wearables) ชื่อ (NAME) และ LAND ผู้ถือ MANA และ LAND สามารถโหวตใน Decentraland DAO เพื่อกำหนดนโยบายและการใช้เงินทุน MANA ที่จ่ายในการประมูล LAND ครั้งแรก (Terraform Event) เมื่อเดือนธันวาคม 2017 ถูกเผาทิ้ง อุปทานรวมในปัจจุบันจึงน้อยกว่าจำนวนที่ออกครั้งแรก LAND ประกอบด้วยแปลงที่ดินราว 90,000 แปลงบนแผนที่ Genesis City"
    ],
    "applyH": "ข้อควรรู้เมื่อใช้ตัวชี้วัดกับดีเซนทราแลนด์",
    "apply": [
     "ใช้ MVRV ได้: ข้อมูลชุมชนของ CoinMetrics มี MVRV ของ MANA จึงคำนวณ MVRV Z-Score ได้ แต่เกณฑ์ z<0 (ต่ำกว่าต้นทุนเฉลี่ย) และ z>5 (ร้อนแรงเกิน) มาจากประวัติของบิตคอยน์ สำหรับ MANA จึงควรใช้เป็นแนวทางคร่าว ๆ เท่านั้น หากข้อมูลล่าช้าหรือขาดหาย การ์ดจะเปลี่ยนเป็น N/A",
     "อารมณ์ของทั้งตลาด: ดัชนีความกลัว-ความโลภไม่ได้วัดอารมณ์ของผู้ถือ MANA โดยเฉพาะ แต่เป็นดัชนีของทั้งตลาดที่ Alternative.me คำนวณโดยมีบิตคอยน์เป็นศูนย์กลาง กระแสที่จำกัดอยู่กับ MANA เช่น ธีมเมตาเวิร์ส จึงไม่ปรากฏในค่านี้",
     "แกว่งแรงและสภาพคล่องต่ำ: ปริมาณซื้อขาย MANA น้อยกว่าบิตคอยน์มาก ราคาจึงกระโดดแรงได้ในเวลาสั้น ๆ และ RSI กับ MACD ก็มักกลับทิศภายในวันหรือสองวัน ควรดูทิศทางตลอดหลายวันมากกว่าสัญญาณของวันเดียว",
     "เกณฑ์เส้น 200 วัน: ระดับ 0.8 และ 2.4 ของ Mayer Multiple (ราคา ÷ เส้นค่าเฉลี่ย 200 วัน) ตั้งขึ้นสำหรับบิตคอยน์ MANA ที่ผ่านรอบขึ้นแรงลงแรงมาหลายครั้งมักห่างจากเส้น 200 วันมากกว่า ตัวเลขเดียวกันจึงมีน้ำหนักต่างกัน",
     "การเคลื่อนไหวตามกลุ่ม: MANA มักขึ้นลงในช่วงเวลาใกล้เคียงกับโทเคนเมตาเวิร์สอื่น เช่น แซนด์บ็อกซ์ (SAND) หากคะแนนของสองหน้าขยับไปด้วยกัน ให้คิดถึงความเป็นไปได้ว่าเป็นกระแสของทั้งกลุ่ม ไม่ใช่ข่าวเฉพาะของ MANA"
    ],
    "histH": "สรุปวัฏจักรราคาดีเซนทราแลนด์",
    "hist": [
     "2017 — ขาย MANA ผ่าน ICO และ MANA ที่จ่ายในการประมูล LAND ครั้งแรกเดือนธันวาคมถูกเผาทิ้ง",
     "2020 — โลกเสมือนเปิดให้คนทั่วไปใช้งานในเดือนกุมภาพันธ์ และ Decentraland DAO เริ่มดำเนินงานในปีเดียวกัน",
     "พฤศจิกายน 2021 — หลัง Facebook เปลี่ยนชื่อเป็น Meta โทเคนเมตาเวิร์สพากันพุ่งขึ้น และ MANA ก็ทำราคาสูงสุดตลอดกาล",
     "2022 — ราคาลดลงต่อเนื่องในตลาดหมี จนถึงปลายปีต่ำกว่าราคาสูงสุดตลอดกาลมากกว่า 90%"
    ],
    "faq": [
     {
      "q": "ดีเซนทราแลนด์มีดัชนีความกลัวของตัวเองไหม?",
      "a": "MANA ไม่มีดัชนีความกลัว-ความโลภของตัวเอง ค่าที่เห็นในหน้านี้คือดัชนีอารมณ์ของทั้งตลาดที่ Alternative.me คำนวณโดยยึดบิตคอยน์เป็นหลักและเผยแพร่ทุกวัน ทุกหน้าของเหรียญจึงแสดงตัวเลขเดียวกัน การเคลื่อนไหวของ MANA เองให้ตัดสินจากตัวชี้วัดราคาและ MVRV"
     },
     {
      "q": "ดีเซนทราแลนด์มี MVRV แสดงไหม?",
      "a": "มี CoinMetrics Community API ให้ข้อมูล MVRV ของ MANA การ์ด MVRV Z-Score จึงถูกคำนวณ MVRV เป็นตัวชี้วัดพรีเมียม ในหน้าฟรีจะเห็นแค่ชื่อแต่ค่าจะถูกซ่อน หาก CoinMetrics ไม่ตอบกลับ การ์ดจะเป็น N/A และคะแนนจะใช้ตัวชี้วัดที่เหลือ"
     },
     {
      "q": "ตอนนี้ควรซื้อดีเซนทราแลนด์ไหม?",
      "a": "การตัดสินใจซื้อเป็นของคุณเอง หน้านี้ไม่ได้ให้คำแนะนำการลงทุน คะแนน 80 ขึ้นไป (STRONG BUY) หมายถึงสัญญาณขายมากเกิน ความกลัว และราคาต่ำกว่ามูลค่าซ้อนกันหลายตัว ส่วนต่ำกว่า 25 (OVERHEATED) หมายถึงสัญญาณร้อนแรงเกินซ้อนกัน เนื่องจาก MANA ผันผวนสูง ระดับเดิมอาจอยู่ได้ไม่นาน"
     },
     {
      "q": "การเผา MANA มีผลต่อคะแนนไหม?",
      "a": "ไม่มีผลโดยตรง คะแนนคำนวณจากราคา อารมณ์ตลาด และ MVRV เท่านั้น การเปลี่ยนแปลงด้านอุปทานหรือการกำกับดูแล เช่น การเผาเหรียญหรือมติของ DAO จะสะท้อนทางอ้อมเฉพาะเมื่อส่งผลต่อราคาหรือค่าออนเชน"
     },
     {
      "q": "ทำไมคะแนนแซนด์บ็อกซ์กับดีเซนทราแลนด์มักใกล้กัน?",
      "a": "ทั้งสองโทเคนถูกจัดอยู่ในธีมเมตาเวิร์สและมักเคลื่อนไหวในช่วงเวลาใกล้เคียงกัน อีกทั้งใช้ค่าความกลัว-ความโลภชุดเดียวกัน ความต่างอาจมาจาก MVRV เพราะ MANA คำนวณ MVRV ได้ แต่หน้า SAND แสดง N/A น้ำหนักของตัวชี้วัดจึงต่างกัน"
     },
     {
      "q": "Mayer Multiple ต่ำกว่า 0.8 แปลว่า MANA ถูกเกินไปหรือเปล่า?",
      "a": "ตัดสินเช่นนั้นได้ยาก เกณฑ์ 0.8 มองว่าราคาที่ต่ำกว่าเส้นค่าเฉลี่ย 200 วันอยู่ 20% เป็นโซนซื้อแรง และได้มาจากบิตคอยน์ MANA เคยอยู่ใต้เส้น 200 วันเป็นเวลานานในช่วงขาลง จึงควรตรวจสอบร่วมกับตัวชี้วัดอื่น"
     }
    ]
   },
   "es": {
    "title": "Puntuación de timing de compra y Miedo y Codicia de Decentraland (MANA)",
    "intro": "La página de Decentraland (MANA) puntúa el momento de compra de 0 a 100 con siete indicadores: cinco de precio (RSI(14), MACD(12·26·9), múltiplo de Mayer, caída desde el máximo de 365 días y cruce de medias 50/200), el indicador on-chain MVRV Z-Score y el Índice de Miedo y Codicia de todo el mercado. La puntuación se reparte en cinco bandas de STRONG BUY a OVERHEATED, y la del día es gratuita.",
    "coinH": "¿Qué es Decentraland (MANA)?",
    "coinP": [
     "Decentraland es un mundo virtual en 3D donde los usuarios poseen terrenos virtuales llamados LAND y construyen en ellos escenas, juegos y espacios de exposición. El proyecto lo iniciaron Ari Meilich y Esteban Ordano; vendió MANA en una ICO en 2017 y abrió al público en febrero de 2020. MANA es un token ERC-20 de Ethereum, así que no tiene un mecanismo de consenso propio y se apoya en la seguridad de la red Ethereum, que funciona con prueba de participación desde The Merge de 2022.",
     "MANA se usa en el marketplace para comprar y vender NFT como prendas para avatares (wearables), nombres (NAME) y LAND, y quienes tienen MANA y LAND votan en la DAO de Decentraland sobre sus políticas y el uso de sus fondos. El MANA pagado en la primera subasta de LAND (el Terraform Event) de diciembre de 2017 se quemó, por lo que el suministro total actual es menor que la emisión original. LAND está formado por unas 90.000 parcelas en el mapa de Genesis City."
    ],
    "applyH": "Cómo aplicar los indicadores a Decentraland",
    "apply": [
     "MVRV disponible: los datos comunitarios de CoinMetrics incluyen el MVRV de MANA, así que se calcula el MVRV Z-Score. Aun así, sus umbrales —z por debajo de 0 (bajo el coste medio) y z por encima de 5 (sobrecalentamiento)— vienen de la historia de Bitcoin, por lo que en MANA conviene tomarlos solo como orientación; si los datos se retrasan o faltan, la tarjeta pasa a N/A.",
     "Sentimiento de todo el mercado: el Índice de Miedo y Codicia no mide el ánimo de quienes tienen MANA, sino que es el índice de Alternative.me para todo el mercado, centrado en Bitcoin. Las tendencias propias de MANA, como el tema del metaverso, no aparecen en él.",
     "Grandes oscilaciones y poca liquidez: MANA mueve mucho menos volumen que Bitcoin, así que su precio puede dar saltos bruscos en poco tiempo y el RSI y el MACD cambian de dirección a menudo en uno o dos días. Mira la dirección de varios días en lugar de la señal de una sola jornada.",
     "La referencia de 200 días: los niveles 0,8 y 2,4 del múltiplo de Mayer (precio ÷ media de 200 días) se fijaron para Bitcoin. Tras varios ciclos de subidas y desplomes, MANA suele alejarse mucho más de su media de 200 días, de modo que la misma cifra pesa menos.",
     "Movimientos del sector: MANA ha subido y bajado a menudo al mismo tiempo que otros tokens del metaverso como The Sandbox (SAND). Cuando ambas puntuaciones se mueven juntas, ten en cuenta que puede tratarse de una tendencia de todo el sector y no de noticias propias de MANA."
    ],
    "histH": "Resumen de los ciclos de precio de Decentraland",
    "hist": [
     "2017 — se vendió MANA en una ICO, y el MANA pagado en la primera subasta de LAND, en diciembre, se quemó.",
     "2020 — el mundo virtual abrió al público en febrero y la DAO de Decentraland se puso en marcha ese mismo año.",
     "Noviembre de 2021 — mientras los tokens del metaverso se disparaban tras el cambio de nombre de Facebook a Meta, MANA también alcanzó su máximo histórico.",
     "2022 — las caídas continuaron durante el mercado bajista y, a final de año, MANA estaba más de un 90% por debajo de su máximo histórico."
    ],
    "faq": [
     {
      "q": "¿Tiene Decentraland su propio índice de miedo?",
      "a": "MANA no tiene un Índice de Miedo y Codicia propio. El valor de la página es el índice de sentimiento de todo el mercado que Alternative.me calcula en torno a Bitcoin y publica a diario, y todas las páginas de monedas muestran la misma cifra. El movimiento propio de MANA se juzga con los indicadores de precio y el MVRV."
     },
     {
      "q": "¿Muestra Decentraland el MVRV?",
      "a": "Sí. La API comunitaria de CoinMetrics ofrece el MVRV de MANA, así que se calcula la tarjeta del MVRV Z-Score. El MVRV es un indicador premium: en la vista gratuita se ve su nombre, pero el valor está oculto. Si CoinMetrics no responde, pasa a N/A y la puntuación usa los indicadores restantes."
     },
     {
      "q": "¿Debo comprar Decentraland ahora?",
      "a": "Comprar o no es decisión tuya; esta página no ofrece asesoramiento de inversión. Una puntuación de 80 o más (STRONG BUY) indica que coinciden varias señales de sobreventa, miedo e infravaloración, y una por debajo de 25 (OVERHEATED), que coinciden señales de sobrecalentamiento. Como MANA es volátil, una banda puede durar poco."
     },
     {
      "q": "¿Las quemas de MANA afectan a la puntuación?",
      "a": "No de forma directa. La puntuación se calcula solo con el precio, el sentimiento del mercado y el MVRV; los cambios de suministro o de gobernanza, como quemas o decisiones de la DAO, solo aparecen indirectamente, en la medida en que muevan el precio o los valores on-chain."
     },
     {
      "q": "¿Por qué las puntuaciones de The Sandbox y Decentraland se parecen tanto?",
      "a": "Ambos tokens se agrupan bajo el tema del metaverso y a menudo se han movido en momentos parecidos, además de compartir el mismo dato de Miedo y Codicia. Las diferencias pueden venir del MVRV: se calcula para MANA, pero en la página de SAND aparece N/A, así que la ponderación es distinta."
     },
     {
      "q": "¿Un múltiplo de Mayer por debajo de 0,8 significa que MANA está infravalorado?",
      "a": "Es difícil afirmarlo. El nivel 0,8 considera zona de compra fuerte un precio un 20% por debajo de la media móvil de 200 días, y procede de Bitcoin. MANA ha pasado largas fases bajistas por debajo de su media de 200 días, así que conviene comprobarlo junto con los demás indicadores."
     }
    ]
   },
   "fr": {
    "title": "Score de timing d’achat et indice Peur & Avidité de Decentraland (MANA)",
    "intro": "La page Decentraland (MANA) note le moment d’achat de 0 à 100 à partir de sept indicateurs : cinq indicateurs de prix (RSI(14), MACD(12·26·9), multiple de Mayer, baisse depuis le plus haut sur 365 jours et croisement des moyennes 50/200), l’indicateur on-chain MVRV Z-Score et l’indice Peur & Avidité de l’ensemble du marché. Le score se répartit en cinq niveaux de STRONG BUY à OVERHEATED, et celui du jour est gratuit.",
    "coinH": "Qu’est-ce que Decentraland (MANA) ?",
    "coinP": [
     "Decentraland est un monde virtuel en 3D où les utilisateurs possèdent des terrains virtuels appelés LAND et y construisent des scènes, des jeux et des espaces d’exposition. Lancé par Ari Meilich et Esteban Ordano, le projet a vendu du MANA lors d’une ICO en 2017 et s’est ouvert au public en février 2020. MANA est un jeton ERC-20 sur Ethereum : il n’a pas de mécanisme de consensus propre et s’appuie sur la sécurité du réseau Ethereum, qui fonctionne en preuve d’enjeu depuis The Merge en 2022.",
     "MANA sert sur la place de marché à acheter et vendre des NFT comme des vêtements d’avatar (wearables), des noms (NAME) et des LAND ; les détenteurs de MANA et de LAND votent au sein de la DAO de Decentraland sur ses règles et l’usage de ses fonds. Le MANA payé lors de la première vente aux enchères de LAND (le Terraform Event), en décembre 2017, a été brûlé : l’offre totale actuelle est donc inférieure à l’émission initiale. LAND compte environ 90 000 parcelles sur la carte de Genesis City."
    ],
    "applyH": "Appliquer les indicateurs à Decentraland",
    "apply": [
     "MVRV disponible : les données communautaires de CoinMetrics comprennent le MVRV de MANA, le MVRV Z-Score est donc calculé. Ses seuils, z inférieur à 0 (sous le coût moyen) et z supérieur à 5 (surchauffe), viennent toutefois de l’histoire du Bitcoin : pour MANA, mieux vaut les prendre comme simple repère. Si les données sont en retard ou absentes, la carte passe à N/A.",
     "Sentiment du marché entier : l’indice Peur & Avidité ne mesure pas l’humeur des détenteurs de MANA ; c’est l’indice d’Alternative.me pour tout le marché, centré sur le Bitcoin. Les tendances propres à MANA, comme le thème du métavers, n’y apparaissent pas.",
     "Fortes variations, faible liquidité : MANA s’échange en volumes bien plus faibles que le Bitcoin, si bien que son prix peut bondir brutalement en peu de temps et que le RSI et le MACD changent souvent de sens en un ou deux jours. Regardez la direction sur plusieurs jours plutôt que le signal d’une seule séance.",
     "Le repère des 200 jours : les niveaux 0,8 et 2,4 du multiple de Mayer (prix ÷ moyenne sur 200 jours) ont été fixés pour le Bitcoin. Après plusieurs cycles d’envolées et d’effondrements, MANA s’écarte souvent bien plus de sa moyenne sur 200 jours : le même chiffre pèse donc moins.",
     "Mouvements du secteur : MANA a souvent monté et baissé en même temps que d’autres jetons du métavers comme The Sandbox (SAND). Quand les deux scores évoluent ensemble, pensez qu’il peut s’agir d’une tendance de tout le secteur plutôt que d’une actualité propre à MANA."
    ],
    "histH": "Résumé des cycles de prix de Decentraland",
    "hist": [
     "2017 — vente de MANA lors d’une ICO ; le MANA payé lors de la première vente aux enchères de LAND, en décembre, est brûlé.",
     "2020 — le monde virtuel ouvre au public en février et la DAO de Decentraland est lancée la même année.",
     "Novembre 2021 — alors que les jetons du métavers s’envolent après le changement de nom de Facebook en Meta, MANA atteint lui aussi son plus haut historique.",
     "2022 — la baisse se poursuit pendant le marché baissier et, en fin d’année, MANA se situe à plus de 90 % sous son plus haut historique."
    ],
    "faq": [
     {
      "q": "Decentraland a-t-il son propre indice de peur ?",
      "a": "MANA n’a pas d’indice Peur & Avidité à lui. La valeur affichée est l’indice de sentiment de tout le marché, calculé autour du Bitcoin et publié chaque jour par Alternative.me ; toutes les pages de cryptos affichent le même chiffre. Le mouvement propre de MANA se juge avec les indicateurs de prix et le MVRV."
     },
     {
      "q": "Decentraland affiche-t-il le MVRV ?",
      "a": "Oui. L’API communautaire de CoinMetrics fournit le MVRV de MANA, la carte MVRV Z-Score est donc calculée. Le MVRV est un indicateur premium : la version gratuite affiche son nom mais masque sa valeur. Si CoinMetrics ne répond pas, la carte passe à N/A et le score utilise les indicateurs restants."
     },
     {
      "q": "Faut-il acheter Decentraland maintenant ?",
      "a": "La décision d’acheter vous appartient ; cette page ne donne pas de conseil en investissement. Un score de 80 ou plus (STRONG BUY) signifie que plusieurs signaux de survente, de peur et de sous-évaluation se cumulent, et un score inférieur à 25 (OVERHEATED), que des signaux de surchauffe se cumulent. MANA étant volatil, un niveau peut ne pas durer."
     },
     {
      "q": "Les brûlages de MANA influencent-ils le score ?",
      "a": "Pas directement. Le score est calculé uniquement à partir du prix, du sentiment de marché et du MVRV ; les changements d’offre ou de gouvernance, comme les brûlages ou les décisions de la DAO, n’apparaissent qu’indirectement, dans la mesure où ils font bouger le prix ou les valeurs on-chain."
     },
     {
      "q": "Pourquoi les scores de The Sandbox et de Decentraland se ressemblent-ils ?",
      "a": "Les deux jetons sont rangés sous le thème du métavers et ont souvent évolué aux mêmes moments ; ils partagent aussi la même donnée Peur & Avidité. Les écarts peuvent venir du MVRV : il est calculé pour MANA mais affiche N/A sur la page SAND, la pondération diffère donc."
     },
     {
      "q": "Un multiple de Mayer sous 0,8 signifie-t-il que MANA est sous-évalué ?",
      "a": "Difficile de l’affirmer. Le seuil de 0,8 considère un prix inférieur de 20 % à la moyenne mobile sur 200 jours comme une zone d’achat fort, et il est tiré du Bitcoin. MANA a connu de longues phases baissières sous sa moyenne sur 200 jours : vérifiez donc avec les autres indicateurs."
     }
    ]
   },
   "de": {
    "title": "Kauf-Timing-Score und Angst-&-Gier-Index für Decentraland (MANA)",
    "intro": "Die Decentraland-Seite (MANA) bewertet das Kauf-Timing von 0 bis 100 anhand von sieben Indikatoren: fünf Preisindikatoren (RSI(14), MACD(12·26·9), Mayer Multiple, Rückgang vom 365-Tage-Hoch und 50/200-Durchschnittskreuz), dem On-Chain-Indikator MVRV-Z-Score und dem Angst-&-Gier-Index des Gesamtmarkts. Der Score fällt in fünf Stufen von STRONG BUY bis OVERHEATED; der heutige Score ist kostenlos.",
    "coinH": "Was ist Decentraland (MANA)?",
    "coinP": [
     "Decentraland ist eine virtuelle 3D-Welt, in der Nutzer virtuelles Land namens LAND besitzen und darauf Szenen, Spiele und Ausstellungsräume bauen. Gestartet wurde das Projekt von Ari Meilich und Esteban Ordano; 2017 verkaufte es MANA in einem ICO, im Februar 2020 öffnete es für die Allgemeinheit. MANA ist ein ERC-20-Token auf Ethereum, hat also keinen eigenen Konsensmechanismus und stützt sich auf die Sicherheit des Ethereum-Netzwerks, das seit dem Merge 2022 Proof of Stake nutzt.",
     "Mit MANA werden auf dem Marktplatz NFTs wie Avatar-Kleidung (Wearables), Namen (NAME) und LAND gekauft und verkauft; MANA- und LAND-Inhaber stimmen in der Decentraland-DAO über Regeln und die Verwendung der Mittel ab. Das bei der ersten LAND-Auktion (dem Terraform Event) im Dezember 2017 gezahlte MANA wurde verbrannt, daher ist das heutige Gesamtangebot kleiner als die ursprüngliche Ausgabe. LAND umfasst rund 90.000 Parzellen auf der Karte von Genesis City."
    ],
    "applyH": "Indikatoren auf Decentraland anwenden",
    "apply": [
     "MVRV verfügbar: Die Community-Daten von CoinMetrics enthalten den MVRV von MANA, daher wird der MVRV-Z-Score berechnet. Seine Schwellen – z unter 0 (unter dem durchschnittlichen Einstandspreis) und z über 5 (überhitzt) – stammen allerdings aus der Bitcoin-Geschichte und taugen bei MANA nur als grobe Orientierung. Sind die Daten verspätet oder fehlen sie, zeigt die Karte N/A.",
     "Stimmung des Gesamtmarkts: Der Angst-&-Gier-Index misst nicht die Stimmung der MANA-Anleger, sondern ist der Bitcoin-zentrierte Index von Alternative.me für den ganzen Markt. Entwicklungen, die nur MANA betreffen, etwa das Metaverse-Thema, tauchen darin nicht auf.",
     "Große Ausschläge, dünne Liquidität: MANA wird mit weit weniger Volumen gehandelt als Bitcoin, sodass der Kurs in kurzer Zeit stark springen kann und RSI und MACD oft binnen ein, zwei Tagen die Richtung wechseln. Achten Sie auf die Richtung über mehrere Tage statt auf das Signal eines einzelnen Tages.",
     "Der 200-Tage-Maßstab: Die Marken 0,8 und 2,4 des Mayer Multiple (Preis ÷ 200-Tage-Durchschnitt) wurden für Bitcoin festgelegt. Nach mehreren Zyklen aus Höhenflügen und Abstürzen entfernt sich MANA oft viel weiter von seinem 200-Tage-Durchschnitt, sodass dieselbe Zahl weniger Gewicht hat.",
     "Sektorbewegungen: MANA ist oft zur gleichen Zeit gestiegen und gefallen wie andere Metaverse-Token, etwa The Sandbox (SAND). Bewegen sich beide Scores gemeinsam, kann das ein Trend des ganzen Sektors sein statt einer MANA-eigenen Nachricht."
    ],
    "histH": "Die Preiszyklen von Decentraland im Überblick",
    "hist": [
     "2017 – Verkauf von MANA in einem ICO; das bei der ersten LAND-Auktion im Dezember gezahlte MANA wird verbrannt.",
     "2020 – Im Februar öffnet die virtuelle Welt für alle, im selben Jahr startet die Decentraland-DAO.",
     "November 2021 – Während Metaverse-Token nach der Umbenennung von Facebook in Meta stark steigen, erreicht auch MANA sein Allzeithoch.",
     "2022 – Im Bärenmarkt geht es weiter abwärts; zum Jahresende liegt MANA mehr als 90 % unter seinem Allzeithoch."
    ],
    "faq": [
     {
      "q": "Hat Decentraland einen eigenen Angstindex?",
      "a": "MANA hat keinen eigenen Angst-&-Gier-Index. Der angezeigte Wert ist der Stimmungsindex des Gesamtmarkts, den Alternative.me rund um Bitcoin berechnet und täglich veröffentlicht – alle Coin-Seiten zeigen dieselbe Zahl. Die eigene Bewegung von MANA beurteilen Sie anhand der Preisindikatoren und des MVRV."
     },
     {
      "q": "Zeigt Decentraland den MVRV an?",
      "a": "Ja. Die Community-API von CoinMetrics liefert den MVRV von MANA, deshalb wird die MVRV-Z-Score-Karte berechnet. MVRV ist ein Premium-Indikator: In der kostenlosen Ansicht ist sein Name sichtbar, der Wert aber verdeckt. Antwortet CoinMetrics nicht, wechselt die Karte auf N/A und der Score nutzt die übrigen Indikatoren."
     },
     {
      "q": "Sollte ich Decentraland jetzt kaufen?",
      "a": "Ob Sie kaufen, entscheiden Sie selbst; diese Seite gibt keine Anlageberatung. Ein Score ab 80 (STRONG BUY) bedeutet, dass mehrere Überverkauft-, Angst- und Unterbewertungssignale zusammenkommen, unter 25 (OVERHEATED) treffen Überhitzungssignale zusammen. Da MANA volatil ist, hält eine Stufe womöglich nicht lange."
     },
     {
      "q": "Beeinflussen MANA-Verbrennungen den Score?",
      "a": "Nicht direkt. Der Score wird nur aus Preis, Marktstimmung und MVRV berechnet; Angebots- oder Governance-Änderungen wie Verbrennungen oder DAO-Beschlüsse zeigen sich nur indirekt, soweit sie den Preis oder die On-Chain-Werte bewegen."
     },
     {
      "q": "Warum ähneln sich die Scores von The Sandbox und Decentraland?",
      "a": "Beide Token werden dem Metaverse-Thema zugerechnet und haben sich oft zu ähnlichen Zeiten bewegt; zudem teilen sie denselben Angst-&-Gier-Wert. Unterschiede können vom MVRV kommen: Für MANA wird er berechnet, auf der SAND-Seite steht N/A, daher ist die Gewichtung anders."
     },
     {
      "q": "Heißt ein Mayer Multiple unter 0,8, dass MANA unterbewertet ist?",
      "a": "Das lässt sich so nicht sagen. Die Marke 0,8 wertet einen Preis 20 % unter dem gleitenden 200-Tage-Durchschnitt als Zone für starken Kauf und ist aus Bitcoin abgeleitet. MANA hat lange Abwärtsphasen unter seinem 200-Tage-Durchschnitt verbracht – prüfen Sie den Wert daher zusammen mit den anderen Indikatoren."
     }
    ]
   },
   "it": {
    "title": "Punteggio di timing d’acquisto e indice Paura e Avidità di Decentraland (MANA)",
    "intro": "La pagina di Decentraland (MANA) valuta il momento d’acquisto da 0 a 100 con sette indicatori: cinque di prezzo (RSI(14), MACD(12·26·9), multiplo di Mayer, calo dal massimo a 365 giorni e incrocio delle medie 50/200), l’indicatore on-chain MVRV Z-Score e l’indice Paura e Avidità dell’intero mercato. Il punteggio rientra in cinque fasce da STRONG BUY a OVERHEATED, e quello del giorno è gratuito.",
    "coinH": "Che cos’è Decentraland (MANA)?",
    "coinP": [
     "Decentraland è un mondo virtuale in 3D in cui gli utenti possiedono terreni virtuali chiamati LAND e vi costruiscono scene, giochi e spazi espositivi. Avviato da Ari Meilich ed Esteban Ordano, il progetto ha venduto MANA con una ICO nel 2017 e si è aperto al pubblico nel febbraio 2020. MANA è un token ERC-20 su Ethereum, quindi non ha un meccanismo di consenso proprio e si affida alla sicurezza della rete Ethereum, che dal Merge del 2022 funziona con la proof of stake.",
     "MANA serve nel marketplace per comprare e vendere NFT come capi per avatar (wearable), nomi (NAME) e LAND, e chi possiede MANA e LAND vota nella DAO di Decentraland su regole e uso dei fondi. Il MANA pagato nella prima asta di LAND (il Terraform Event) del dicembre 2017 è stato bruciato, perciò l’offerta totale attuale è inferiore all’emissione iniziale. LAND comprende circa 90.000 lotti sulla mappa di Genesis City."
    ],
    "applyH": "Applicare gli indicatori a Decentraland",
    "apply": [
     "MVRV disponibile: i dati della community di CoinMetrics includono l’MVRV di MANA, quindi l’MVRV Z-Score viene calcolato. Le sue soglie, z sotto 0 (sotto il costo medio) e z sopra 5 (surriscaldamento), derivano però dalla storia di Bitcoin: per MANA è meglio usarle solo come riferimento indicativo. Se i dati arrivano in ritardo o mancano, la scheda passa a N/A.",
     "Sentiment dell’intero mercato: l’indice Paura e Avidità non misura l’umore di chi detiene MANA, ma è l’indice di Alternative.me per tutto il mercato, centrato su Bitcoin. Le tendenze che riguardano solo MANA, come il tema del metaverso, non vi compaiono.",
     "Forti oscillazioni, liquidità scarsa: MANA scambia volumi molto inferiori a Bitcoin, perciò il prezzo può fare balzi bruschi in poco tempo e RSI e MACD cambiano spesso direzione nel giro di uno o due giorni. Guarda la direzione su più giorni anziché il segnale di una sola seduta.",
     "Il riferimento dei 200 giorni: i livelli 0,8 e 2,4 del multiplo di Mayer (prezzo ÷ media a 200 giorni) sono stati fissati per Bitcoin. Dopo diversi cicli di impennate e crolli, MANA si allontana spesso molto di più dalla sua media a 200 giorni, quindi lo stesso numero pesa meno.",
     "Movimenti di settore: MANA è spesso salito e sceso negli stessi periodi di altri token del metaverso come The Sandbox (SAND). Quando i due punteggi si muovono insieme, considera che può trattarsi di una tendenza dell’intero settore e non di notizie proprie di MANA."
    ],
    "histH": "Sintesi dei cicli di prezzo di Decentraland",
    "hist": [
     "2017 — vendita di MANA tramite ICO; il MANA pagato nella prima asta di LAND, a dicembre, viene bruciato.",
     "2020 — a febbraio il mondo virtuale apre al pubblico e nello stesso anno nasce la DAO di Decentraland.",
     "Novembre 2021 — mentre i token del metaverso volano dopo che Facebook cambia nome in Meta, anche MANA tocca il suo massimo storico.",
     "2022 — i ribassi proseguono nel mercato orso e a fine anno MANA si trova oltre il 90% sotto il suo massimo storico."
    ],
    "faq": [
     {
      "q": "Decentraland ha un proprio indice della paura?",
      "a": "MANA non ha un indice Paura e Avidità tutto suo. Il valore mostrato è l’indice del sentiment dell’intero mercato che Alternative.me calcola attorno a Bitcoin e pubblica ogni giorno, e tutte le pagine delle monete riportano lo stesso numero. Il movimento proprio di MANA si valuta con gli indicatori di prezzo e l’MVRV."
     },
     {
      "q": "Decentraland mostra l’MVRV?",
      "a": "Sì. L’API della community di CoinMetrics fornisce l’MVRV di MANA, quindi la scheda dell’MVRV Z-Score viene calcolata. L’MVRV è un indicatore premium: nella versione gratuita se ne vede il nome, ma il valore è nascosto. Se CoinMetrics non risponde, la scheda passa a N/A e il punteggio usa gli indicatori rimanenti."
     },
     {
      "q": "Conviene comprare Decentraland adesso?",
      "a": "Se comprare spetta a te deciderlo; questa pagina non offre consulenza d’investimento. Un punteggio di 80 o più (STRONG BUY) indica che si sommano diversi segnali di ipervenduto, paura e sottovalutazione, mentre sotto 25 (OVERHEATED) si sommano segnali di surriscaldamento. Dato che MANA è volatile, una fascia può durare poco."
     },
     {
      "q": "I burn di MANA influiscono sul punteggio?",
      "a": "Non direttamente. Il punteggio si calcola solo con prezzo, sentiment di mercato e MVRV; i cambiamenti di offerta o di governance, come i burn o le decisioni della DAO, emergono solo indirettamente, nella misura in cui muovono il prezzo o i valori on-chain."
     },
     {
      "q": "Perché i punteggi di The Sandbox e Decentraland si somigliano?",
      "a": "I due token rientrano nel tema del metaverso e si sono spesso mossi negli stessi momenti; inoltre condividono lo stesso dato di Paura e Avidità. Le differenze possono venire dall’MVRV: per MANA viene calcolato, mentre nella pagina di SAND risulta N/A, quindi la ponderazione cambia."
     },
     {
      "q": "Un multiplo di Mayer sotto 0,8 significa che MANA è sottovalutato?",
      "a": "Difficile affermarlo. La soglia di 0,8 considera zona di acquisto forte un prezzo inferiore del 20% alla media mobile a 200 giorni, e deriva da Bitcoin. MANA ha attraversato lunghe fasi ribassiste sotto la sua media a 200 giorni, quindi va verificato insieme agli altri indicatori."
     }
    ]
   },
   "pt": {
    "title": "Pontuação de timing de compra e Índice de Medo e Ganância do Decentraland (MANA)",
    "intro": "A página do Decentraland (MANA) avalia o momento de compra de 0 a 100 com sete indicadores: cinco de preço (RSI(14), MACD(12·26·9), múltiplo de Mayer, queda desde a máxima de 365 dias e cruzamento das médias 50/200), o indicador on-chain MVRV Z-Score e o Índice de Medo e Ganância de todo o mercado. A pontuação se divide em cinco faixas de STRONG BUY a OVERHEATED, e a do dia é gratuita.",
    "coinH": "O que é Decentraland (MANA)?",
    "coinP": [
     "O Decentraland é um mundo virtual em 3D em que os usuários possuem terrenos virtuais chamados LAND e constroem neles cenas, jogos e espaços de exposição. Iniciado por Ari Meilich e Esteban Ordano, o projeto vendeu MANA numa ICO em 2017 e foi aberto ao público em fevereiro de 2020. O MANA é um token ERC-20 na Ethereum, então não tem mecanismo de consenso próprio e conta com a segurança da rede Ethereum, que usa prova de participação desde o Merge de 2022.",
     "O MANA é usado no marketplace para comprar e vender NFTs como roupas de avatar (wearables), nomes (NAME) e LAND, e quem tem MANA e LAND vota na DAO do Decentraland sobre regras e uso dos recursos. O MANA pago no primeiro leilão de LAND (o Terraform Event), em dezembro de 2017, foi queimado, por isso a oferta total atual é menor que a emissão original. O LAND é formado por cerca de 90.000 lotes no mapa de Genesis City."
    ],
    "applyH": "Como aplicar os indicadores ao Decentraland",
    "apply": [
     "MVRV disponível: os dados comunitários da CoinMetrics incluem o MVRV do MANA, então o MVRV Z-Score é calculado. Ainda assim, seus limites — z abaixo de 0 (abaixo do custo médio) e z acima de 5 (superaquecimento) — vêm da história do Bitcoin, por isso no MANA vale usá-los só como referência aproximada. Se os dados atrasarem ou faltarem, o cartão passa a N/A.",
     "Sentimento do mercado todo: o Índice de Medo e Ganância não mede o humor de quem tem MANA; é o índice da Alternative.me para o mercado inteiro, centrado no Bitcoin. Tendências restritas ao MANA, como o tema metaverso, não aparecem nele.",
     "Grandes oscilações, pouca liquidez: o MANA negocia volumes muito menores que o Bitcoin, então o preço pode dar saltos bruscos em pouco tempo e o RSI e o MACD costumam mudar de direção em um ou dois dias. Observe a direção ao longo de vários dias em vez do sinal de um único dia.",
     "A régua de 200 dias: os níveis 0,8 e 2,4 do múltiplo de Mayer (preço ÷ média de 200 dias) foram definidos para o Bitcoin. Depois de vários ciclos de disparadas e quedas, o MANA costuma se afastar muito mais da sua média de 200 dias, então o mesmo número pesa menos.",
     "Movimentos do setor: o MANA muitas vezes subiu e caiu na mesma época que outros tokens de metaverso, como o The Sandbox (SAND). Quando as duas pontuações se movem juntas, considere que pode ser uma tendência do setor inteiro, e não uma notícia específica do MANA."
    ],
    "histH": "Resumo dos ciclos de preço do Decentraland",
    "hist": [
     "2017 — o MANA foi vendido numa ICO, e o MANA pago no primeiro leilão de LAND, em dezembro, foi queimado.",
     "2020 — o mundo virtual abriu ao público em fevereiro, e a DAO do Decentraland começou a funcionar no mesmo ano.",
     "Novembro de 2021 — enquanto os tokens de metaverso disparavam depois que o Facebook mudou de nome para Meta, o MANA também atingiu sua máxima histórica.",
     "2022 — as quedas continuaram no mercado de baixa e, no fim do ano, o MANA estava mais de 90% abaixo da sua máxima histórica."
    ],
    "faq": [
     {
      "q": "O Decentraland tem um índice de medo próprio?",
      "a": "O MANA não tem um Índice de Medo e Ganância só seu. O valor exibido é o índice de sentimento do mercado todo que a Alternative.me calcula em torno do Bitcoin e publica diariamente, e todas as páginas de moedas mostram o mesmo número. O movimento próprio do MANA é avaliado pelos indicadores de preço e pelo MVRV."
     },
     {
      "q": "O Decentraland mostra MVRV?",
      "a": "Sim. A API comunitária da CoinMetrics fornece o MVRV do MANA, então o cartão do MVRV Z-Score é calculado. O MVRV é um indicador premium: na versão gratuita aparece o nome, mas o valor fica oculto. Se a CoinMetrics não responder, o cartão passa a N/A e a pontuação usa os indicadores restantes."
     },
     {
      "q": "Devo comprar Decentraland agora?",
      "a": "Comprar ou não é decisão sua; esta página não oferece aconselhamento de investimento. Uma pontuação de 80 ou mais (STRONG BUY) indica que vários sinais de sobrevenda, medo e subvalorização se somam, e abaixo de 25 (OVERHEATED), que sinais de superaquecimento se somam. Como o MANA é volátil, uma faixa pode durar pouco."
     },
     {
      "q": "As queimas de MANA afetam a pontuação?",
      "a": "Não diretamente. A pontuação é calculada apenas com preço, sentimento do mercado e MVRV; mudanças de oferta ou de governança, como queimas ou decisões da DAO, só aparecem indiretamente, na medida em que movem o preço ou os valores on-chain."
     },
     {
      "q": "Por que as pontuações do The Sandbox e do Decentraland são parecidas?",
      "a": "Os dois tokens são agrupados no tema metaverso e muitas vezes se moveram em momentos parecidos; além disso, usam o mesmo dado de Medo e Ganância. As diferenças podem vir do MVRV: ele é calculado para o MANA, mas aparece como N/A na página do SAND, então a ponderação muda."
     },
     {
      "q": "Um múltiplo de Mayer abaixo de 0,8 significa que o MANA está subvalorizado?",
      "a": "É difícil afirmar isso. O nível 0,8 trata um preço 20% abaixo da média móvel de 200 dias como zona de compra forte e vem do Bitcoin. O MANA passou longas fases de baixa abaixo da sua média de 200 dias, então confira junto com os outros indicadores."
     }
    ]
   },
   "ru": {
    "title": "Оценка момента покупки и индекс страха и жадности для Децентраленд (MANA)",
    "intro": "Страница Децентраленд (MANA) оценивает момент покупки от 0 до 100 по семи индикаторам: пяти ценовым (RSI(14), MACD(12·26·9), множитель Майера, просадка от 365-дневного максимума и пересечение средних 50/200), ончейн-индикатору MVRV Z-Score и общерыночному индексу страха и жадности. Оценка делится на пять уровней от STRONG BUY до OVERHEATED, а сегодняшняя оценка бесплатна.",
    "coinH": "Что такое Децентраленд (MANA)?",
    "coinP": [
     "Децентраленд (Decentraland) — трёхмерный виртуальный мир, где пользователи владеют виртуальной землёй LAND и строят на ней сцены, игры и выставочные пространства. Проект запустили Ари Мейлич (Ari Meilich) и Эстебан Ордано (Esteban Ordano); в 2017 году он продал MANA на ICO, а в феврале 2020 года открылся для всех. MANA — токен стандарта ERC-20 в сети Ethereum, поэтому собственного механизма консенсуса у него нет: он опирается на безопасность сети Ethereum, которая с The Merge 2022 года работает на доказательстве доли.",
     "MANA используется на маркетплейсе для покупки и продажи NFT — одежды для аватаров (wearables), имён (NAME) и LAND, а держатели MANA и LAND голосуют в DAO Децентраленд по правилам и расходованию средств. MANA, уплаченные на первом аукционе LAND (Terraform Event) в декабре 2017 года, были сожжены, поэтому нынешнее общее предложение меньше первоначального выпуска. LAND состоит примерно из 90 000 участков на карте Genesis City."
    ],
    "applyH": "Как применять индикаторы к Децентраленд",
    "apply": [
     "MVRV доступен: в данных сообщества CoinMetrics есть MVRV для MANA, поэтому MVRV Z-Score рассчитывается. Но его пороги — z ниже 0 (ниже средней цены покупки) и z выше 5 (перегрев) — взяты из истории биткоина, так что для MANA их лучше считать лишь ориентиром. Если данные задерживаются или пропадают, карточка переходит в N/A.",
     "Настроение всего рынка: индекс страха и жадности измеряет не настроение держателей MANA, а настроение всего рынка — это индекс Alternative.me с упором на биткоин. Тренды, касающиеся только MANA, например тема метавселенных, в нём не видны.",
     "Резкие колебания и низкая ликвидность: объёмы торгов MANA намного меньше, чем у биткоина, поэтому цена может резко скакнуть за короткое время, а RSI и MACD нередко меняют направление за день-два. Смотрите на направление за несколько дней, а не на сигнал одного дня.",
     "Ориентир в 200 дней: уровни 0,8 и 2,4 множителя Майера (цена ÷ 200-дневная средняя) задавались для биткоина. После нескольких циклов взлётов и обвалов MANA часто уходит от своей 200-дневной средней гораздо дальше, так что то же число весит меньше.",
     "Движения сектора: MANA нередко росла и падала одновременно с другими токенами метавселенных, например Сэндбокс (SAND). Если обе оценки движутся вместе, учитывайте, что это может быть тренд всего сектора, а не новости самой MANA."
    ],
    "histH": "Краткая история ценовых циклов Децентраленд",
    "hist": [
     "2017 — продажа MANA на ICO; MANA, уплаченные на первом аукционе LAND в декабре, сожжены.",
     "2020 — в феврале виртуальный мир открылся для всех, в том же году заработала DAO Децентраленд.",
     "Ноябрь 2021 — на фоне взлёта токенов метавселенных после переименования Facebook в Meta MANA тоже обновила исторический максимум.",
     "2022 — снижение продолжилось на медвежьем рынке, и к концу года MANA была более чем на 90% ниже исторического максимума."
    ],
    "faq": [
     {
      "q": "Есть ли у Децентраленд собственный индекс страха?",
      "a": "Собственного индекса страха и жадности у MANA нет. Показанное значение — индекс настроений всего рынка, который Alternative.me рассчитывает с опорой на биткоин и публикует ежедневно; на страницах всех монет стоит одно и то же число. Собственное движение MANA оценивайте по ценовым индикаторам и MVRV."
     },
     {
      "q": "Показывается ли MVRV для Децентраленд?",
      "a": "Да. Community API CoinMetrics отдаёт MVRV для MANA, поэтому карточка MVRV Z-Score рассчитывается. MVRV — премиум-индикатор: в бесплатной версии видно его название, но значение скрыто. Если CoinMetrics не отвечает, карточка переходит в N/A, а оценка строится по оставшимся индикаторам."
     },
     {
      "q": "Стоит ли покупать Децентраленд сейчас?",
      "a": "Решение о покупке остаётся за вами; эта страница не даёт инвестиционных советов. Оценка 80 и выше (STRONG BUY) означает, что совпали несколько сигналов перепроданности, страха и недооценки, ниже 25 (OVERHEATED) — что совпали сигналы перегрева. Из-за высокой волатильности MANA уровень может продержаться недолго."
     },
     {
      "q": "Влияют ли сжигания MANA на оценку?",
      "a": "Напрямую — нет. Оценка рассчитывается только по цене, настроению рынка и MVRV; изменения предложения или управления, например сжигания или решения DAO, проявляются лишь косвенно — в той мере, в какой они двигают цену или ончейн-показатели."
     },
     {
      "q": "Почему оценки Сэндбокс и Децентраленд похожи?",
      "a": "Оба токена относят к теме метавселенных, и они часто двигались в одни и те же периоды; к тому же у них общий вход индекса страха и жадности. Различия могут возникать из-за MVRV: для MANA он рассчитывается, а на странице SAND стоит N/A, поэтому веса распределены иначе."
     },
     {
      "q": "Если множитель Майера ниже 0,8, значит MANA недооценена?",
      "a": "Утверждать так сложно. Порог 0,8 считает цену на 20% ниже 200-дневной скользящей средней зоной сильной покупки и выведен из биткоина. У MANA были долгие нисходящие фазы под 200-дневной средней, поэтому проверяйте его вместе с другими индикаторами."
     }
    ]
   },
   "nl": {
    "title": "Koop-timingscore en Angst-&-Hebzucht-index voor Decentraland (MANA)",
    "intro": "De Decentraland-pagina (MANA) beoordeelt het koopmoment van 0 tot 100 met zeven indicatoren: vijf prijsindicatoren (RSI(14), MACD(12·26·9), Mayer Multiple, daling vanaf de 365-daagse top en de 50/200-kruising van gemiddelden), de on-chain-indicator MVRV Z-Score en de marktbrede Angst-&-Hebzucht-index. De score valt in vijf niveaus van STRONG BUY tot OVERHEATED, en de score van vandaag is gratis.",
    "coinH": "Wat is Decentraland (MANA)?",
    "coinP": [
     "Decentraland is een virtuele 3D-wereld waarin gebruikers virtueel land, LAND genoemd, bezitten en daarop scènes, games en expositieruimtes bouwen. Het project werd opgezet door Ari Meilich en Esteban Ordano, verkocht MANA in 2017 via een ICO en ging in februari 2020 open voor het publiek. MANA is een ERC-20-token op Ethereum en heeft dus geen eigen consensusmechanisme; het leunt op de beveiliging van het Ethereum-netwerk, dat sinds The Merge in 2022 proof of stake gebruikt.",
     "Met MANA koop en verkoop je op de marktplaats NFT's zoals avatarkleding (wearables), namen (NAME) en LAND, en houders van MANA en LAND stemmen in de Decentraland-DAO over regels en de besteding van middelen. De MANA die bij de eerste LAND-veiling (het Terraform Event) in december 2017 werd betaald, is verbrand; het huidige totale aanbod is daardoor kleiner dan de oorspronkelijke uitgifte. LAND bestaat uit ongeveer 90.000 percelen op de kaart van Genesis City."
    ],
    "applyH": "Indicatoren toepassen op Decentraland",
    "apply": [
     "MVRV beschikbaar: de communitydata van CoinMetrics bevatten de MVRV van MANA, dus de MVRV Z-Score wordt berekend. De drempels – z onder 0 (onder de gemiddelde kostprijs) en z boven 5 (oververhit) – komen wel uit de geschiedenis van bitcoin, dus gebruik ze bij MANA alleen als ruwe richtlijn. Zijn de gegevens vertraagd of ontbreken ze, dan toont de kaart N/A.",
     "Sentiment van de hele markt: de Angst-&-Hebzucht-index meet niet de stemming van MANA-houders, maar is de op bitcoin gerichte index van Alternative.me voor de hele markt. Ontwikkelingen die alleen MANA raken, zoals het metaverse-thema, zie je er niet in terug.",
     "Grote uitslagen, dunne liquiditeit: MANA wordt met veel minder volume verhandeld dan bitcoin, waardoor de koers in korte tijd flink kan springen en RSI en MACD vaak binnen een à twee dagen omslaan. Kijk naar de richting over meerdere dagen in plaats van naar het signaal van één dag.",
     "De 200-dagenmaatstaf: de niveaus 0,8 en 2,4 van de Mayer Multiple (prijs ÷ 200-daags gemiddelde) zijn voor bitcoin vastgesteld. Na meerdere cycli van pieken en crashes staat MANA vaak veel verder van zijn 200-daags gemiddelde, zodat hetzelfde getal minder zwaar weegt.",
     "Sectorbewegingen: MANA steeg en daalde vaak tegelijk met andere metaverse-tokens zoals The Sandbox (SAND). Bewegen beide scores samen, houd er dan rekening mee dat het om een trend van de hele sector kan gaan en niet om nieuws over MANA zelf."
    ],
    "histH": "Overzicht van de prijscycli van Decentraland",
    "hist": [
     "2017 — verkoop van MANA via een ICO; de MANA die bij de eerste LAND-veiling in december werd betaald, wordt verbrand.",
     "2020 — in februari gaat de virtuele wereld open voor het publiek en in hetzelfde jaar start de Decentraland-DAO.",
     "November 2021 — terwijl metaverse-tokens na de naamswijziging van Facebook naar Meta hard stijgen, bereikt ook MANA zijn hoogste koers ooit.",
     "2022 — de daling zet door in de berenmarkt en eind dat jaar staat MANA meer dan 90% onder zijn hoogste koers ooit."
    ],
    "faq": [
     {
      "q": "Heeft Decentraland een eigen angstindex?",
      "a": "MANA heeft geen eigen Angst-&-Hebzucht-index. De getoonde waarde is de sentimentindex van de hele markt die Alternative.me rond bitcoin berekent en dagelijks publiceert; alle muntpagina's tonen hetzelfde getal. De eigen beweging van MANA beoordeel je met de prijsindicatoren en de MVRV."
     },
     {
      "q": "Toont Decentraland de MVRV?",
      "a": "Ja. De community-API van CoinMetrics levert de MVRV van MANA, dus de kaart met de MVRV Z-Score wordt berekend. MVRV is een premium-indicator: in de gratis weergave zie je de naam, maar de waarde is verborgen. Reageert CoinMetrics niet, dan toont de kaart N/A en gebruikt de score de overige indicatoren."
     },
     {
      "q": "Moet ik Decentraland nu kopen?",
      "a": "Of je koopt, beslis je zelf; deze pagina geeft geen beleggingsadvies. Een score van 80 of hoger (STRONG BUY) betekent dat meerdere signalen van oversold, angst en onderwaardering samenvallen, onder 25 (OVERHEATED) vallen signalen van oververhitting samen. Omdat MANA volatiel is, houdt een niveau misschien niet lang stand."
     },
     {
      "q": "Hebben MANA-verbrandingen invloed op de score?",
      "a": "Niet direct. De score wordt alleen berekend uit prijs, marktsentiment en MVRV; aanbod- of governancewijzigingen zoals verbrandingen of DAO-besluiten zie je alleen indirect terug, voor zover ze de prijs of on-chain-waarden bewegen."
     },
     {
      "q": "Waarom lijken de scores van The Sandbox en Decentraland op elkaar?",
      "a": "Beide tokens vallen onder het metaverse-thema en bewogen vaak op vergelijkbare momenten; bovendien delen ze dezelfde Angst-&-Hebzucht-waarde. Verschillen kunnen uit de MVRV komen: die wordt voor MANA berekend, maar op de SAND-pagina staat N/A, dus de weging verschilt."
     },
     {
      "q": "Betekent een Mayer Multiple onder 0,8 dat MANA ondergewaardeerd is?",
      "a": "Dat valt moeilijk te zeggen. De drempel van 0,8 ziet een koers 20% onder het 200-daags voortschrijdend gemiddelde als zone voor sterk kopen en is afgeleid van bitcoin. MANA heeft lange dalende fases onder zijn 200-daags gemiddelde gekend, dus controleer het samen met de andere indicatoren."
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
