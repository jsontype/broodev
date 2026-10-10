/* 하단 SEO 본문 다국어 데이터 + 렌더러. index.html(광고) / member/index.html(구독자) 공유.
   언어 전환 시 window.renderSEO(lang) 호출 → section.seo 를 해당 언어로 다시 그림.
   기본 정적 HTML(한국어)은 무JS 크롤러용 폴백으로 남겨두고, JS 실행 시 현재 언어로 교체. */
(function () {
  var SEO = {
    ko: {
      title: '페페 공포·탐욕 지수 & 매수 타이밍 점수',
      intro: '페페 공포지수(공포·탐욕 지수, Fear & Greed Index)를 포함한 7개 실시간 지표를 합성해 “지금이 매수 타이밍인가?”를 0~100 점수로 보여주는 무료 대시보드입니다. 설치 없이 브라우저에서 바로 실행되며 13개 언어를 지원합니다.',
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
        { q: '공포지수가 낮으면 페페을 사야 하나요?', a: '극단적 공포는 역사적으로 분할 매수 기회였던 경우가 많지만, 공포지수 하나만 보면 “떨어지는 칼날”을 잡을 위험이 있습니다. 본 점수는 RSI·MACD·마이어 배수·낙폭·이동평균 크로스를 함께 보고, 하락 추세에서는 점수를 보수적으로 낮춥니다.' },
        { q: '매수 타이밍 점수는 어떻게 계산되나요?', a: '7개 지표를 각각 0~100 부분점수로 환산해 가중 합성합니다. 결과는 0~100이며 5단계 밴드로 표시됩니다.' },
        { q: '무료인가요? 설치가 필요한가요?', a: '완전 무료이며 설치가 필요 없습니다. CoinGecko·Binance·Alternative.me 공개 API에서 실시간 데이터를 가져옵니다.' },
        { q: '공포지수와 매수 타이밍 점수는 무엇이 다른가요?', a: '공포지수는 심리 한 가지 지표(0~100)이고, 매수 타이밍 점수는 공포지수를 포함한 7개 지표를 합성한 종합 점수(0~100)입니다.' },
        { q: '공포지수 데이터는 어디서 가져오나요? 얼마나 자주 갱신되나요?', a: '공포·탐욕 지수는 Alternative.me, 가격·일봉은 CoinGecko·Binance, 온체인 지표는 CoinMetrics 공개 API에서 실시간으로 가져옵니다. 화면은 약 1분 주기로 자동 갱신됩니다.' },
        { q: '페페 지금 사도 되나요?', a: '정답은 없지만, 매수 타이밍 점수(0~100)로 현재 시장이 과매도·공포 구간인지 과열·탐욕 구간인지 객관적으로 가늠할 수 있습니다. 장기(역발상) 탭 기준 점수가 높을수록 공포·저평가가 겹친 분할 매수 우호 구간, 낮을수록 과열 경계 구간입니다. 참고 신호일 뿐 투자 자문이 아닙니다.' },
        { q: '단기와 장기 매수 타이밍은 어떻게 다른가요?', a: '점수는 단기·장기 두 탭으로 나뉩니다. 단기(모멘텀)는 약 1~3개월 추세추종 관점으로 상승 추세가 강할수록 높고, 장기(역발상)는 약 1년 이상 사이클 관점으로 공포·저평가일수록 높습니다. 2017년 이후 백테스트에서 단기는 모멘텀, 장기는 역발상 방향이 더 잘 맞았습니다.' },
        { q: 'BOTTOM RADAR(바닥 점수)는 무엇인가요?', a: 'MVRV Z-점수 같은 온체인 지표로 시가총액이 투자자 평균 매수원가 대비 어디에 있는지 재서, 역사적 바닥 구간과의 근접도를 0~100으로 보여주는 보조 게이지입니다. 계산 근거는 “비트코인 바닥” 해설 페이지에 공개되어 있습니다.' }
      ],
      disclaimer: '⚠ 본 점수는 공개 지표를 합성한 참고 신호이며 투자 자문이 아닙니다. 모든 투자 판단과 책임은 이용자 본인에게 있습니다.'
    },
    en: {
      title: 'Pepe Fear & Greed Index & Buy-Timing Score',
      intro: 'A free dashboard that synthesizes 7 real-time indicators — including the Pepe Fear & Greed Index — into a 0–100 “is now a good time to buy?” score. Runs in your browser with no install, in 13 languages.',
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
        { q: 'Should I buy Pepe when the index is low?', a: 'Extreme fear has often been an accumulation opportunity, but relying on the index alone risks catching a falling knife. This score also weighs RSI, MACD, Mayer Multiple, drawdown and moving-average crosses, and lowers the score conservatively in downtrends.' },
        { q: 'How is the buy-timing score calculated?', a: 'Each of the 7 indicators is converted to a 0–100 sub-score and weighted together. The result is 0–100, shown in 5 bands.' },
        { q: 'Is it free? Do I need to install anything?', a: 'It is completely free with no install. Real-time data comes from CoinGecko, Binance and Alternative.me public APIs.' },
        { q: 'How is the index different from the buy-timing score?', a: 'The index is a single sentiment metric (0–100); the buy-timing score is a composite of 7 indicators including the index (0–100).' },
        { q: 'Where does the data come from, and how often does it refresh?', a: 'The Fear & Greed Index comes from Alternative.me, prices and daily candles from the CoinGecko and Binance public APIs, and on-chain metrics from CoinMetrics. The screen auto-refreshes roughly every minute.' },
        { q: 'Should I buy Pepe right now?', a: 'There is no single answer, but the buy-timing score (0–100) gives an objective read on whether the market is in an oversold/fear zone or an overheated/greed zone. On the long-term (contrarian) tab, higher scores mark zones where fear and undervaluation overlap — historically favorable for DCA — while lower scores warn of overheating. It is a reference signal, not investment advice.' },
        { q: 'How do short-term and long-term buy timing differ?', a: 'The score is split into two tabs. Short-term (momentum) takes a 1–3 month trend-following view and rises with strong uptrends; long-term (contrarian) takes a 1-year-plus cycle view and rises with fear and undervaluation. In backtests since 2017, momentum worked better short-term and contrarian worked better long-term.' },
        { q: 'What is the BOTTOM RADAR (bottom score)?', a: 'A secondary gauge that uses on-chain metrics such as the MVRV Z-Score to measure where market cap sits relative to investors’ average cost basis, showing proximity to historic bottom zones on a 0–100 scale. The full calculation is published on the “Bitcoin bottom” guide page.' }
      ],
      disclaimer: '⚠ This score is a reference signal built from public indicators, not investment advice. All decisions and responsibility are your own.'
    },
    ja: {
      title: 'ペペ 恐怖・強欲指数 & 買い時スコア',
      intro: 'ペペの恐怖・強欲指数（Fear & Greed Index）を含む7つのリアルタイム指標を合成し、「今が買い時か？」を0〜100のスコアで示す無料ダッシュボードです。インストール不要でブラウザから即実行、13言語対応。',
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
        { q: '指数が低ければペペを買うべき？', a: '極端な恐怖は歴史的に分割買いの好機だったことが多いですが、指数だけに頼ると「落ちるナイフ」を掴む危険があります。本スコアはRSI・MACD・マイヤー倍率・下落率・移動平均クロスも合わせて見て、下落トレンドでは保守的にスコアを下げます。' },
        { q: '買い時スコアはどう計算される？', a: '7指標をそれぞれ0〜100の部分スコアに換算し加重合成します。結果は0〜100で、5段階バンドで表示します。' },
        { q: '無料？インストールは必要？', a: '完全無料・インストール不要です。CoinGecko・Binance・Alternative.me の公開APIからリアルタイムデータを取得します。' },
        { q: '指数と買い時スコアの違いは？', a: '指数は心理1指標(0〜100)、買い時スコアは指数を含む7指標を合成した総合スコア(0〜100)です。' },
        { q: 'データはどこから？更新頻度は？', a: '恐怖・強欲指数はAlternative.me、価格・日足はCoinGecko・Binance、オンチェーン指標はCoinMetricsの公開APIからリアルタイムで取得します。画面は約1分ごとに自動更新されます。' },
        { q: 'ペペは今買ってもいい？', a: '正解はありませんが、買い時スコア(0〜100)で現在の市場が売られすぎ・恐怖圏か、過熱・強欲圏かを客観的に測れます。長期（逆張り）タブではスコアが高いほど恐怖と割安が重なる分割買いに有利な圏、低いほど過熱警戒圏です。参考シグナルであり投資助言ではありません。' },
        { q: '短期と長期の買い時はどう違う？', a: 'スコアは短期・長期の2タブに分かれます。短期（モメンタム）は約1〜3か月のトレンドフォロー視点で上昇トレンドが強いほど高く、長期（逆張り）は約1年以上のサイクル視点で恐怖・割安なほど高くなります。2017年以降のバックテストでは、短期はモメンタム、長期は逆張りの方向がより有効でした。' },
        { q: 'BOTTOM RADAR（底値スコア）とは？', a: 'MVRV Zスコアなどのオンチェーン指標で、時価総額が投資家の平均取得単価に対してどの位置にあるかを測り、歴史的な底値圏への近さを0〜100で示す補助ゲージです。計算根拠は「ビットコインの底」解説ページで公開しています。' }
      ],
      disclaimer: '⚠ 本スコアは公開指標を合成した参考シグナルであり、投資助言ではありません。すべての判断と責任は利用者ご自身にあります。'
    },
    zh: {
      title: '佩佩币恐惧与贪婪指数 & 买入时机评分',
      intro: '一个免费仪表板，将包括佩佩币恐惧与贪婪指数（Fear & Greed Index）在内的7个实时指标合成为0–100的“现在是买入时机吗？”评分。无需安装，浏览器即开即用，支持13种语言。',
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
        { q: '指数低就该买佩佩币吗？', a: '极度恐惧在历史上常是分批买入良机，但只看指数有“接飞刀”的风险。本评分同时参考RSI、MACD、梅耶倍数、回撤与均线交叉，并在下跌趋势中保守下调评分。' },
        { q: '买入时机评分如何计算？', a: '将7个指标各自换算为0–100分项评分并加权合成。结果为0–100，以5档显示。' },
        { q: '免费吗？需要安装吗？', a: '完全免费、无需安装。实时数据来自 CoinGecko、Binance、Alternative.me 公开API。' },
        { q: '指数与买入时机评分有何不同？', a: '指数是单一情绪指标(0–100)；买入时机评分是包含该指数在内的7指标综合评分(0–100)。' },
        { q: '数据来自哪里？多久更新一次？', a: '恐惧与贪婪指数来自Alternative.me，价格与日K来自CoinGecko和Binance公开API，链上指标来自CoinMetrics。页面约每1分钟自动刷新。' },
        { q: '现在可以买佩佩币吗？', a: '没有标准答案，但买入时机评分(0–100)能客观判断当前市场处于超卖·恐惧区还是过热·贪婪区。在长期（逆向）标签页中，评分越高代表恐惧与低估重叠、历史上利于分批买入的区间；越低则是过热警戒区。仅供参考，并非投资建议。' },
        { q: '短期和长期买入时机有何不同？', a: '评分分为短期、长期两个标签页。短期（动量）以约1–3个月的趋势跟随视角，上升趋势越强评分越高；长期（逆向）以约1年以上的周期视角，越恐惧、越低估评分越高。2017年以来的回测显示，短期动量、长期逆向的方向更有效。' },
        { q: 'BOTTOM RADAR（底部评分）是什么？', a: '一个辅助仪表，利用MVRV Z分数等链上指标衡量市值相对投资者平均持仓成本的位置，以0–100显示与历史底部区间的接近程度。计算依据在“比特币底部”解读页面公开。' }
      ],
      disclaimer: '⚠ 本评分由公开指标合成，仅供参考，并非投资建议。一切投资决定与责任由用户自负。'
    },
    'zh-Hant': {
      title: '佩佩幣恐懼與貪婪指數 & 買入時機評分',
      intro: '一個免費儀表板，將包括佩佩幣恐懼與貪婪指數（Fear & Greed Index）在內的7個即時指標合成為0–100的「現在是買入時機嗎？」評分。免安裝、瀏覽器即開即用，支援13種語言。',
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
        { q: '指數低就該買佩佩幣嗎？', a: '極度恐懼在歷史上常是分批買入良機，但只看指數有「接飛刀」的風險。本評分同時參考RSI、MACD、梅耶倍數、回撤與均線交叉，並在下跌趨勢中保守下調評分。' },
        { q: '買入時機評分如何計算？', a: '將7個指標各自換算為0–100分項評分並加權合成。結果為0–100，以5檔顯示。' },
        { q: '免費嗎？需要安裝嗎？', a: '完全免費、免安裝。即時資料來自 CoinGecko、Binance、Alternative.me 公開API。' },
        { q: '指數與買入時機評分有何不同？', a: '指數是單一情緒指標(0–100)；買入時機評分是包含該指數在內的7指標綜合評分(0–100)。' },
        { q: '資料來自哪裡？多久更新一次？', a: '恐懼與貪婪指數來自Alternative.me，價格與日K來自CoinGecko和Binance公開API，鏈上指標來自CoinMetrics。頁面約每1分鐘自動重新整理。' },
        { q: '現在可以買佩佩幣嗎？', a: '沒有標準答案，但買入時機評分(0–100)能客觀判斷當前市場處於超賣·恐懼區還是過熱·貪婪區。在長期（逆向）分頁中，評分越高代表恐懼與低估重疊、歷史上利於分批買入的區間；越低則是過熱警戒區。僅供參考，並非投資建議。' },
        { q: '短期和長期買入時機有何不同？', a: '評分分為短期、長期兩個分頁。短期（動量）以約1–3個月的趨勢跟隨視角，上升趨勢越強評分越高；長期（逆向）以約1年以上的週期視角，越恐懼、越低估評分越高。2017年以來的回測顯示，短期動量、長期逆向的方向更有效。' },
        { q: 'BOTTOM RADAR（底部評分）是什麼？', a: '一個輔助儀表，利用MVRV Z分數等鏈上指標衡量市值相對投資者平均持倉成本的位置，以0–100顯示與歷史底部區間的接近程度。計算依據在「比特幣底部」解說頁面公開。' }
      ],
      disclaimer: '⚠ 本評分由公開指標合成，僅供參考，並非投資建議。一切投資決定與責任由用戶自負。'
    },
    es: {
      title: 'Índice de miedo y codicia de Pepe y puntuación de momento de compra',
      intro: 'Un panel gratuito que sintetiza 7 indicadores en tiempo real —incluido el índice de miedo y codicia de Pepe— en una puntuación de 0 a 100 sobre «¿es buen momento para comprar?». Funciona en el navegador sin instalación, en 13 idiomas.',
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
        { q: '¿Debo comprar Pepe cuando el índice está bajo?', a: 'El miedo extremo ha sido a menudo una oportunidad de acumulación, pero fiarse solo del índice arriesga «atrapar un cuchillo que cae». Esta puntuación también pondera RSI, MACD, múltiplo de Mayer, caída y cruces de medias, y la reduce de forma conservadora en tendencias bajistas.' },
        { q: '¿Cómo se calcula la puntuación de compra?', a: 'Cada uno de los 7 indicadores se convierte en una subpuntuación de 0 a 100 y se pondera. El resultado es 0–100, mostrado en 5 bandas.' },
        { q: '¿Es gratis? ¿Necesito instalar algo?', a: 'Es totalmente gratis y sin instalación. Los datos en tiempo real provienen de las API públicas de CoinGecko, Binance y Alternative.me.' },
        { q: '¿En qué se diferencia el índice de la puntuación de compra?', a: 'El índice es una sola métrica de sentimiento (0–100); la puntuación de compra es un compuesto de 7 indicadores que incluye el índice (0–100).' },
        { q: '¿De dónde vienen los datos y con qué frecuencia se actualizan?', a: 'El índice de miedo y codicia viene de Alternative.me; los precios y velas diarias, de las API públicas de CoinGecko y Binance; y las métricas on-chain, de CoinMetrics. La pantalla se actualiza automáticamente cada minuto aproximadamente.' },
        { q: '¿Debería comprar Pepe ahora mismo?', a: 'No hay una respuesta única, pero la puntuación de compra (0–100) permite valorar objetivamente si el mercado está en zona de sobreventa/miedo o de recalentamiento/codicia. En la pestaña de largo plazo (contraria), puntuaciones altas marcan zonas donde coinciden miedo e infravaloración —históricamente favorables al DCA—, y las bajas avisan de recalentamiento. Es una señal de referencia, no asesoramiento de inversión.' },
        { q: '¿En qué se diferencian el timing de corto y de largo plazo?', a: 'La puntuación se divide en dos pestañas. El corto plazo (momentum) adopta una visión de seguimiento de tendencia de 1–3 meses y sube con tendencias alcistas fuertes; el largo plazo (contrario) adopta una visión de ciclo de más de un año y sube con miedo e infravaloración. En backtests desde 2017, el momentum funcionó mejor a corto y lo contrario a largo.' },
        { q: '¿Qué es el BOTTOM RADAR (puntuación de suelo)?', a: 'Un indicador auxiliar que usa métricas on-chain como el MVRV Z-Score para medir dónde está la capitalización respecto al coste medio de los inversores, mostrando la cercanía a zonas de suelo históricas en una escala de 0 a 100. El cálculo completo está publicado en la guía «suelo de Bitcoin».' }
      ],
      disclaimer: '⚠ Esta puntuación es una señal de referencia a partir de indicadores públicos, no asesoramiento de inversión. Todas las decisiones y la responsabilidad son tuyas.'
    },
    fr: {
      title: 'Indice de peur et d’avidité Pepe et score de timing d’achat',
      intro: 'Un tableau de bord gratuit qui synthétise 7 indicateurs en temps réel — dont l’indice de peur et d’avidité Pepe — en un score de 0 à 100 « est-ce le bon moment pour acheter ? ». Fonctionne dans le navigateur sans installation, en 13 langues.',
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
        { q: 'Dois-je acheter du Pepe quand l’indice est bas ?', a: 'La peur extrême a souvent été une opportunité d’accumulation, mais se fier au seul indice risque d’« attraper un couteau qui tombe ». Ce score pondère aussi RSI, MACD, multiple de Mayer, repli et croisements de moyennes, et le réduit prudemment en tendance baissière.' },
        { q: 'Comment le score de timing d’achat est-il calculé ?', a: 'Chacun des 7 indicateurs est converti en sous-score de 0 à 100 puis pondéré. Le résultat est 0–100, affiché en 5 bandes.' },
        { q: 'Est-ce gratuit ? Faut-il installer quelque chose ?', a: 'C’est entièrement gratuit et sans installation. Les données en temps réel proviennent des API publiques de CoinGecko, Binance et Alternative.me.' },
        { q: 'Quelle différence entre l’indice et le score de timing d’achat ?', a: 'L’indice est une seule mesure de sentiment (0–100) ; le score de timing d’achat est un composite de 7 indicateurs incluant l’indice (0–100).' },
        { q: 'D’où viennent les données et à quelle fréquence sont-elles actualisées ?', a: 'L’indice de peur et d’avidité vient d’Alternative.me ; les prix et bougies journalières, des API publiques de CoinGecko et Binance ; et les métriques on-chain, de CoinMetrics. L’écran se rafraîchit automatiquement environ chaque minute.' },
        { q: 'Dois-je acheter du Pepe maintenant ?', a: 'Il n’y a pas de réponse unique, mais le score de timing d’achat (0–100) permet d’évaluer objectivement si le marché est en zone de survente/peur ou de surchauffe/avidité. Dans l’onglet long terme (contrarian), des scores élevés marquent des zones où peur et sous-évaluation se recoupent — historiquement favorables au DCA — tandis que des scores bas signalent la surchauffe. C’est un signal de référence, pas un conseil en investissement.' },
        { q: 'Quelle différence entre le timing court terme et long terme ?', a: 'Le score est divisé en deux onglets. Le court terme (momentum) adopte une vue de suivi de tendance sur 1 à 3 mois et monte avec les tendances haussières fortes ; le long terme (contrarian) adopte une vue de cycle d’un an et plus et monte avec la peur et la sous-évaluation. Dans les backtests depuis 2017, le momentum a mieux fonctionné à court terme et le contrarian à long terme.' },
        { q: 'Qu’est-ce que le BOTTOM RADAR (score de plancher) ?', a: 'Une jauge auxiliaire qui utilise des métriques on-chain comme le MVRV Z-Score pour mesurer où se situe la capitalisation par rapport au coût moyen des investisseurs, en montrant la proximité des zones de plancher historiques sur une échelle de 0 à 100. Le calcul complet est publié sur la page « plancher du Bitcoin ».' }
      ],
      disclaimer: '⚠ Ce score est un signal de référence issu d’indicateurs publics, pas un conseil en investissement. Toutes les décisions et la responsabilité vous appartiennent.'
    },
    de: {
      title: 'Pepe Angst- & Gier-Index & Kaufzeitpunkt-Score',
      intro: 'Ein kostenloses Dashboard, das 7 Echtzeit-Indikatoren — inkl. Pepe Angst- & Gier-Index — zu einem 0–100-Score „Ist jetzt ein guter Kaufzeitpunkt?“ zusammenführt. Läuft im Browser ohne Installation, in 13 Sprachen.',
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
        { q: 'Soll ich Pepe kaufen, wenn der Index niedrig ist?', a: 'Extreme Angst war historisch oft eine Akkumulationschance, doch sich allein auf den Index zu verlassen, birgt das Risiko, „ins fallende Messer zu greifen“. Dieser Score gewichtet auch RSI, MACD, Mayer-Multiple, Rückgang und MA-Kreuzungen und senkt den Wert in Abwärtstrends konservativ.' },
        { q: 'Wie wird der Kaufzeitpunkt-Score berechnet?', a: 'Jeder der 7 Indikatoren wird in einen 0–100-Teil-Score umgerechnet und gewichtet. Das Ergebnis ist 0–100, in 5 Bändern dargestellt.' },
        { q: 'Ist es kostenlos? Muss ich etwas installieren?', a: 'Es ist völlig kostenlos und ohne Installation. Echtzeitdaten stammen aus den öffentlichen APIs von CoinGecko, Binance und Alternative.me.' },
        { q: 'Wie unterscheidet sich der Index vom Kaufzeitpunkt-Score?', a: 'Der Index ist eine einzelne Stimmungskennzahl (0–100); der Kaufzeitpunkt-Score ist ein Verbund aus 7 Indikatoren inkl. Index (0–100).' },
        { q: 'Woher stammen die Daten und wie oft werden sie aktualisiert?', a: 'Der Angst- & Gier-Index stammt von Alternative.me, Preise und Tageskerzen von den öffentlichen APIs von CoinGecko und Binance, On-Chain-Metriken von CoinMetrics. Der Bildschirm aktualisiert sich etwa jede Minute automatisch.' },
        { q: 'Sollte ich Pepe jetzt kaufen?', a: 'Eine eindeutige Antwort gibt es nicht, aber der Kaufzeitpunkt-Score (0–100) zeigt objektiv, ob der Markt in einer überverkauften Angst-Zone oder einer überhitzten Gier-Zone steckt. Auf dem Langfrist-Tab (antizyklisch) markieren hohe Werte Zonen, in denen Angst und Unterbewertung zusammenfallen — historisch günstig für DCA —, niedrige warnen vor Überhitzung. Ein Referenzsignal, keine Anlageberatung.' },
        { q: 'Wie unterscheiden sich kurz- und langfristiges Kauftiming?', a: 'Der Score ist in zwei Tabs geteilt. Kurzfristig (Momentum) folgt einer Trendfolge-Sicht von 1–3 Monaten und steigt mit starken Aufwärtstrends; langfristig (antizyklisch) folgt einer Zyklus-Sicht von über einem Jahr und steigt mit Angst und Unterbewertung. In Backtests seit 2017 funktionierte kurzfristig Momentum und langfristig die antizyklische Richtung besser.' },
        { q: 'Was ist der BOTTOM RADAR (Boden-Score)?', a: 'Eine Zusatzanzeige, die mit On-Chain-Metriken wie den MVRV Z-Score misst, wo die Marktkapitalisierung relativ zum durchschnittlichen Einstandskurs der Anleger liegt, und die Nähe zu historischen Bodenzonen auf einer Skala von 0–100 zeigt. Die vollständige Berechnung ist auf der Seite „Bitcoin-Boden“ veröffentlicht.' }
      ],
      disclaimer: '⚠ Dieser Score ist ein Referenzsignal aus öffentlichen Indikatoren, keine Anlageberatung. Alle Entscheidungen und die Verantwortung liegen bei Ihnen.'
    },
    it: {
      title: 'Indice di paura e avidità Pepe e punteggio di timing d’acquisto',
      intro: 'Una dashboard gratuita che sintetizza 7 indicatori in tempo reale — incluso l’indice di paura e avidità di Pepe — in un punteggio 0–100 «è il momento giusto per comprare?». Funziona nel browser senza installazione, in 13 lingue.',
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
        { q: 'Dovrei comprare Pepe quando l’indice è basso?', a: 'La paura estrema è stata spesso un’occasione di accumulo, ma affidarsi solo all’indice rischia di «prendere un coltello che cade». Questo punteggio pesa anche RSI, MACD, multiplo di Mayer, ribasso e incroci di medie, e lo riduce in modo prudente nei trend ribassisti.' },
        { q: 'Come si calcola il punteggio d’acquisto?', a: 'Ciascuno dei 7 indicatori è convertito in un sotto-punteggio 0–100 e ponderato. Il risultato è 0–100, mostrato in 5 bande.' },
        { q: 'È gratis? Serve installare qualcosa?', a: 'È completamente gratis e senza installazione. I dati in tempo reale provengono dalle API pubbliche di CoinGecko, Binance e Alternative.me.' },
        { q: 'Che differenza c’è tra l’indice e il punteggio d’acquisto?', a: 'L’indice è una singola misura di sentiment (0–100); il punteggio d’acquisto è un composito dei 7 indicatori incluso l’indice (0–100).' },
        { q: 'Da dove vengono i dati e con che frequenza si aggiornano?', a: 'L’indice di paura e avidità viene da Alternative.me; prezzi e candele giornaliere dalle API pubbliche di CoinGecko e Binance; le metriche on-chain da CoinMetrics. Lo schermo si aggiorna automaticamente circa ogni minuto.' },
        { q: 'Dovrei comprare Pepe adesso?', a: 'Non c’è una risposta unica, ma il punteggio d’acquisto (0–100) permette di valutare oggettivamente se il mercato è in zona ipervenduto/paura o surriscaldato/avidità. Nella scheda a lungo termine (contrarian), punteggi alti indicano zone in cui paura e sottovalutazione coincidono — storicamente favorevoli al PAC — mentre punteggi bassi avvertono del surriscaldamento. È un segnale di riferimento, non consulenza d’investimento.' },
        { q: 'Che differenza c’è tra timing a breve e a lungo termine?', a: 'Il punteggio è diviso in due schede. Il breve termine (momentum) adotta una visione trend-following di 1–3 mesi e sale con trend rialzisti forti; il lungo termine (contrarian) adotta una visione di ciclo oltre l’anno e sale con paura e sottovalutazione. Nei backtest dal 2017, il momentum ha funzionato meglio nel breve e il contrarian nel lungo.' },
        { q: 'Cos’è il BOTTOM RADAR (punteggio di minimo)?', a: 'Un indicatore ausiliario che usa metriche on-chain come l’MVRV Z-Score per misurare dove si trova la capitalizzazione rispetto al costo medio degli investitori, mostrando la vicinanza alle zone di minimo storiche su una scala 0–100. Il calcolo completo è pubblicato nella guida «minimo di Bitcoin».' }
      ],
      disclaimer: '⚠ Questo punteggio è un segnale di riferimento da indicatori pubblici, non consulenza d’investimento. Ogni decisione e responsabilità è tua.'
    },
    pt: {
      title: 'Índice de medo e ganância do Pepe e pontuação de momento de compra',
      intro: 'Um painel gratuito que sintetiza 7 indicadores em tempo real — incluindo o índice de medo e ganância do Pepe — numa pontuação de 0 a 100 «é uma boa hora para comprar?». Roda no navegador sem instalação, em 13 idiomas.',
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
        { q: 'Devo comprar Pepe quando o índice está baixo?', a: 'O medo extremo foi muitas vezes uma oportunidade de acumulação, mas confiar só no índice arrisca «pegar uma faca caindo». Esta pontuação também pondera RSI, MACD, múltiplo de Mayer, queda e cruzamentos de médias, e a reduz de forma conservadora em tendências de baixa.' },
        { q: 'Como a pontuação de compra é calculada?', a: 'Cada um dos 7 indicadores é convertido numa subpontuação de 0 a 100 e ponderado. O resultado é 0–100, em 5 faixas.' },
        { q: 'É grátis? Preciso instalar algo?', a: 'É totalmente grátis e sem instalação. Os dados em tempo real vêm das APIs públicas da CoinGecko, Binance e Alternative.me.' },
        { q: 'Qual a diferença entre o índice e a pontuação de compra?', a: 'O índice é uma única métrica de sentimento (0–100); a pontuação de compra é um composto de 7 indicadores incluindo o índice (0–100).' },
        { q: 'De onde vêm os dados e com que frequência são atualizados?', a: 'O índice de medo e ganância vem da Alternative.me; preços e velas diárias, das APIs públicas da CoinGecko e da Binance; e as métricas on-chain, da CoinMetrics. A tela atualiza automaticamente a cada minuto, aproximadamente.' },
        { q: 'Devo comprar Pepe agora?', a: 'Não há resposta única, mas a pontuação de compra (0–100) permite avaliar objetivamente se o mercado está em zona de sobrevenda/medo ou de superaquecimento/ganância. Na aba de longo prazo (contrária), pontuações altas marcam zonas onde medo e subvalorização coincidem — historicamente favoráveis ao DCA —, e as baixas alertam para superaquecimento. É um sinal de referência, não consultoria de investimento.' },
        { q: 'Qual a diferença entre o timing de curto e de longo prazo?', a: 'A pontuação divide-se em duas abas. O curto prazo (momentum) adota uma visão de seguimento de tendência de 1–3 meses e sobe com tendências de alta fortes; o longo prazo (contrário) adota uma visão de ciclo de mais de um ano e sobe com medo e subvalorização. Em backtests desde 2017, o momentum funcionou melhor no curto e o contrário no longo.' },
        { q: 'O que é o BOTTOM RADAR (pontuação de fundo)?', a: 'Um medidor auxiliar que usa métricas on-chain como o MVRV Z-Score para medir onde a capitalização está em relação ao custo médio dos investidores, mostrando a proximidade de zonas de fundo históricas numa escala de 0 a 100. O cálculo completo está publicado no guia «fundo do Bitcoin».' }
      ],
      disclaimer: '⚠ Esta pontuação é um sinal de referência a partir de indicadores públicos, não é consultoria de investimento. Todas as decisões e a responsabilidade são suas.'
    },
    ru: {
      title: 'Индекс страха и жадности пепеа и оценка времени покупки',
      intro: 'Бесплатная панель, которая объединяет 7 индикаторов в реальном времени — включая индекс страха и жадности пепеа — в оценку от 0 до 100 «подходящее ли сейчас время для покупки?». Работает в браузере без установки, на 13 языках.',
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
        { q: 'Покупать ли пепе, когда индекс низкий?', a: 'Крайний страх исторически часто был возможностью накопления, но полагаться только на индекс рискованно — можно «поймать падающий нож». Эта оценка также учитывает RSI, MACD, множитель Майера, просадку и пересечения средних и консервативно снижается в нисходящих трендах.' },
        { q: 'Как рассчитывается оценка покупки?', a: 'Каждый из 7 индикаторов переводится в частную оценку 0–100 и взвешивается. Результат — 0–100, в 5 диапазонах.' },
        { q: 'Это бесплатно? Нужно ли что-то устанавливать?', a: 'Полностью бесплатно и без установки. Данные в реальном времени берутся из публичных API CoinGecko, Binance и Alternative.me.' },
        { q: 'Чем индекс отличается от оценки покупки?', a: 'Индекс — одна метрика настроения (0–100); оценка покупки — составной показатель из 7 индикаторов, включая индекс (0–100).' },
        { q: 'Откуда берутся данные и как часто они обновляются?', a: 'Индекс страха и жадности — с Alternative.me; цены и дневные свечи — из публичных API CoinGecko и Binance; ончейн-метрики — из CoinMetrics. Экран автоматически обновляется примерно раз в минуту.' },
        { q: 'Стоит ли покупать пепе прямо сейчас?', a: 'Единственно верного ответа нет, но оценка покупки (0–100) объективно показывает, находится ли рынок в зоне перепроданности/страха или перегрева/жадности. На вкладке долгосрочного (контртрендового) взгляда высокие значения отмечают зоны, где совпадают страх и недооценка — исторически благоприятные для усреднения, — а низкие предупреждают о перегреве. Это справочный сигнал, а не инвестиционная рекомендация.' },
        { q: 'Чем отличаются краткосрочный и долгосрочный тайминг?', a: 'Оценка разделена на две вкладки. Краткосрочная (моментум) использует трендследящий взгляд на 1–3 месяца и растёт при сильных восходящих трендах; долгосрочная (контртренд) — циклический взгляд от года и растёт при страхе и недооценке. В бэктестах с 2017 года на коротком горизонте лучше работал моментум, на длинном — контртренд.' },
        { q: 'Что такое BOTTOM RADAR (оценка дна)?', a: 'Вспомогательный индикатор, который с помощью ончейн-метрик, таких как MVRV Z-оценка, измеряет положение капитализации относительно средней цены входа инвесторов и показывает близость к историческим зонам дна по шкале 0–100. Полный расчёт опубликован на странице «дно биткоина».' }
      ],
      disclaimer: '⚠ Эта оценка — справочный сигнал на основе публичных индикаторов, а не инвестиционная рекомендация. Все решения и ответственность — на вас.'
    },
    nl: {
      title: 'Pepe Angst- & Hebzucht-index en koopmoment-score',
      intro: 'Een gratis dashboard dat 7 realtime indicatoren — inclusief de Pepe Angst- & Hebzucht-index — samenvoegt tot een score van 0–100 voor «is het nu een goed moment om te kopen?». Draait in de browser zonder installatie, in 13 talen.',
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
        { q: 'Moet ik Pepe kopen als de index laag is?', a: 'Extreme angst was vaak een accumulatiekans, maar alleen op de index vertrouwen riskeert «een vallend mes te vangen». Deze score weegt ook RSI, MACD, Mayer Multiple, daling en gemiddelde-kruisingen mee, en verlaagt de score behoudend in dalende trends.' },
        { q: 'Hoe wordt de koopmoment-score berekend?', a: 'Elk van de 7 indicatoren wordt omgezet naar een deelscore van 0–100 en gewogen. Het resultaat is 0–100, in 5 banden.' },
        { q: 'Is het gratis? Moet ik iets installeren?', a: 'Het is volledig gratis en zonder installatie. Realtime data komt van de publieke API’s van CoinGecko, Binance en Alternative.me.' },
        { q: 'Wat is het verschil tussen de index en de koopmoment-score?', a: 'De index is één sentimentmaatstaf (0–100); de koopmoment-score is een samenstelling van 7 indicatoren inclusief de index (0–100).' },
        { q: 'Waar komen de gegevens vandaan en hoe vaak worden ze ververst?', a: 'De Angst- & Hebzucht-index komt van Alternative.me; prijzen en dagcandles van de publieke API’s van CoinGecko en Binance; on-chain-metrieken van CoinMetrics. Het scherm ververst ongeveer elke minuut automatisch.' },
        { q: 'Moet ik nu Pepe kopen?', a: 'Er is geen eenduidig antwoord, maar de koopmoment-score (0–100) geeft een objectief beeld of de markt in een oversold/angst-zone of een oververhitte/hebzucht-zone zit. Op het langetermijn-tabblad (tegendraads) markeren hoge scores zones waar angst en onderwaardering samenvallen — historisch gunstig voor DCA — terwijl lage scores waarschuwen voor oververhitting. Het is een referentiesignaal, geen beleggingsadvies.' },
        { q: 'Hoe verschillen korte- en langetermijn-kooptiming?', a: 'De score is verdeeld over twee tabbladen. Korte termijn (momentum) hanteert een trendvolgende blik van 1–3 maanden en stijgt bij sterke opwaartse trends; lange termijn (tegendraads) hanteert een cyclusblik van ruim een jaar en stijgt bij angst en onderwaardering. In backtests sinds 2017 werkte momentum beter op korte termijn en tegendraads beter op lange termijn.' },
        { q: 'Wat is de BOTTOM RADAR (bodemscore)?', a: 'Een hulpmeter die met on-chain-metrieken zoals de MVRV Z-score meet waar de marktkapitalisatie staat ten opzichte van de gemiddelde kostprijs van beleggers, en de nabijheid van historische bodemzones toont op een schaal van 0–100. De volledige berekening staat op de pagina «Bitcoin-bodem».' }
      ],
      disclaimer: '⚠ Deze score is een referentiesignaal uit publieke indicatoren, geen beleggingsadvies. Alle beslissingen en verantwoordelijkheid zijn van uzelf.'
    },
    th: {
      title: 'ดัชนีความกลัวและความโลภเปเป้ และคะแนนจังหวะซื้อ',
      intro: 'แดชบอร์ดฟรีที่รวม 7 ตัวชี้วัดแบบเรียลไทม์ — รวมถึงดัชนีความกลัวและความโลภของเปเป้ — เป็นคะแนน 0–100 ว่า “ตอนนี้เป็นจังหวะซื้อหรือไม่?” ใช้งานในเบราว์เซอร์ได้ทันที ไม่ต้องติดตั้ง รองรับ 13 ภาษา',
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
        { q: 'ถ้าดัชนีต่ำควรซื้อเปเป้ไหม?', a: 'ความกลัวสุดขีดในอดีตมักเป็นโอกาสทยอยซื้อ แต่ดูเพียงดัชนีอย่างเดียวเสี่ยง “รับมีดที่กำลังตก” คะแนนนี้ยังพิจารณา RSI, MACD, Mayer Multiple, การย่อ และการตัดกันของเส้นเฉลี่ย และลดคะแนนอย่างระมัดระวังในแนวโน้มขาลง' },
        { q: 'คะแนนจังหวะซื้อคำนวณอย่างไร?', a: 'แปลงแต่ละตัวชี้วัดทั้ง 7 เป็นคะแนนย่อย 0–100 แล้วถ่วงน้ำหนักรวมกัน ผลลัพธ์คือ 0–100 แสดงเป็น 5 ระดับ' },
        { q: 'ฟรีไหม? ต้องติดตั้งไหม?', a: 'ฟรีทั้งหมดและไม่ต้องติดตั้ง ข้อมูลเรียลไทม์มาจาก API สาธารณะของ CoinGecko, Binance และ Alternative.me' },
        { q: 'ดัชนีกับคะแนนจังหวะซื้อต่างกันอย่างไร?', a: 'ดัชนีเป็นตัวชี้วัดอารมณ์เดียว (0–100); คะแนนจังหวะซื้อเป็นคะแนนรวมจาก 7 ตัวชี้วัดรวมถึงดัชนี (0–100)' },
        { q: 'ข้อมูลมาจากไหน อัปเดตบ่อยแค่ไหน?', a: 'ดัชนีความกลัว-ความโลภมาจาก Alternative.me ราคาและแท่งเทียนรายวันมาจาก API สาธารณะของ CoinGecko และ Binance ส่วนตัวชี้วัดออนเชนมาจาก CoinMetrics หน้าจออัปเดตอัตโนมัติราวทุก 1 นาที' },
        { q: 'ตอนนี้ควรซื้อเปเป้ไหม?', a: 'ไม่มีคำตอบตายตัว แต่คะแนนจังหวะซื้อ (0–100) ช่วยประเมินอย่างเป็นกลางว่าตลาดอยู่ในโซนขายมากเกิน/ความกลัว หรือโซนร้อนแรง/ความโลภ ในแท็บระยะยาว (สวนตลาด) คะแนนยิ่งสูงหมายถึงโซนที่ความกลัวและราคาต่ำกว่ามูลค่าทับซ้อนกัน ซึ่งในอดีตเอื้อต่อ DCA ส่วนคะแนนต่ำเตือนถึงความร้อนแรง เป็นเพียงสัญญาณอ้างอิง ไม่ใช่คำแนะนำการลงทุน' },
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
  /* 푸터 설명 문단(.foot-desc) — 페페 언급이 있어 공통 foot-i18n.js 가 아니라 여기에 둔다 */
  var FOOT_DESC = {
    ko: 'broodev는 설치 없이 브라우저에서 바로 쓰는 무료 웹앱을 만드는 앱 포트폴리오입니다. 이 페이지의 페페 공포·탐욕 지수와 매수 타이밍 점수는 공개 지표를 합성한 참고 정보이며 투자 자문이 아닙니다. 광고는 Google AdSense를 통해 게재될 수 있습니다.',
    en: 'broodev is a portfolio of free web apps that run right in your browser with no install. The Pepe Fear & Greed Index and buy-timing score on this page are reference information synthesized from public indicators, not investment advice. Ads may be served through Google AdSense.',
    ja: 'broodevは、インストール不要でブラウザからすぐ使える無料Webアプリを作るアプリポートフォリオです。このページのペペ恐怖・強欲指数と買い時スコアは公開指標を合成した参考情報であり、投資助言ではありません。広告はGoogle AdSenseを通じて掲載される場合があります。',
    zh: 'broodev 是一个应用作品集，制作无需安装、在浏览器中即可直接使用的免费网页应用。本页的佩佩币恐惧与贪婪指数和买入时机评分是综合公开指标得出的参考信息，不构成投资建议。广告可能通过 Google AdSense 投放。',
    'zh-Hant': 'broodev 是一個應用作品集，製作無需安裝、在瀏覽器中即可直接使用的免費網頁應用。本頁的佩佩幣恐懼與貪婪指數和買入時機評分是綜合公開指標得出的參考資訊，不構成投資建議。廣告可能透過 Google AdSense 刊登。',
    th: 'broodev คือพอร์ตโฟลิโอแอปที่สร้างเว็บแอปฟรีซึ่งใช้งานได้ทันทีในเบราว์เซอร์โดยไม่ต้องติดตั้ง ดัชนีความกลัว-ความโลภเปเป้และคะแนนจังหวะซื้อในหน้านี้เป็นข้อมูลอ้างอิงที่สังเคราะห์จากตัวชี้วัดสาธารณะ ไม่ใช่คำแนะนำการลงทุน โฆษณาอาจแสดงผ่าน Google AdSense',
    es: 'broodev es un portafolio de aplicaciones web gratuitas que funcionan directamente en el navegador, sin instalación. El Índice de Miedo y Codicia de Pepe y la puntuación de momento de compra de esta página son información de referencia elaborada a partir de indicadores públicos, no asesoramiento de inversión. Los anuncios pueden mostrarse a través de Google AdSense.',
    fr: 'broodev est un portfolio d’applications web gratuites qui s’utilisent directement dans le navigateur, sans installation. L’indice Peur & Avidité du Pepe et le score de timing d’achat de cette page sont des informations de référence issues d’indicateurs publics, et non un conseil en investissement. Des annonces peuvent être diffusées via Google AdSense.',
    de: 'broodev ist ein Portfolio kostenloser Web-Apps, die ohne Installation direkt im Browser laufen. Der Pepe-Angst-und-Gier-Index und der Kauf-Timing-Score auf dieser Seite sind aus öffentlichen Indikatoren zusammengesetzte Referenzinformationen und keine Anlageberatung. Werbung kann über Google AdSense ausgeliefert werden.',
    it: 'broodev è un portfolio di web app gratuite che funzionano direttamente nel browser, senza installazione. L’Indice di Paura e Avidità di Pepe e il punteggio di timing d’acquisto in questa pagina sono informazioni di riferimento ricavate da indicatori pubblici, non una consulenza di investimento. Gli annunci possono essere pubblicati tramite Google AdSense.',
    pt: 'O broodev é um portefólio de aplicações web gratuitas que funcionam diretamente no navegador, sem instalação. O Índice de Medo e Ganância do Pepe e a pontuação de momento de compra desta página são informação de referência sintetizada a partir de indicadores públicos, não aconselhamento de investimento. Os anúncios podem ser apresentados através do Google AdSense.',
    ru: 'broodev — это портфолио бесплатных веб-приложений, которые работают прямо в браузере без установки. Индекс страха и жадности пепеа и оценка момента покупки на этой странице — справочная информация, собранная из открытых индикаторов, а не инвестиционная рекомендация. Реклама может показываться через Google AdSense.',
    nl: 'broodev is een portfolio van gratis webapps die zonder installatie direct in je browser werken. De Pepe Angst- en Hebzuchtindex en de koop-timingscore op deze pagina zijn referentie-informatie samengesteld uit openbare indicatoren, geen beleggingsadvies. Advertenties kunnen via Google AdSense worden getoond.'
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
    "title": "Pepe (PEPE) Meme Coin Buy-Timing Score and Market Fear & Greed",
    "intro": "This page reads the price action of Pepe (PEPE), a meme coin on Ethereum, through seven indicators and condenses them into a 0–100 buy-timing score. RSI(14), MACD(12·26·9), the Mayer Multiple, the drawdown from the 365-day high and the 50/200 moving-average cross are calculated on PEPE’s own price, while the Fear & Greed Index is the reading for the whole crypto market. The MVRV Z-Score shows N/A because no data exists for PEPE. It is free to use with no install.",
    "coinH": "What is Pepe (PEPE)?",
    "coinP": [
     "Pepe is a meme coin launched in April 2023 as an ERC-20 token on Ethereum, themed on Pepe the Frog, the cartoon character created by Matt Furie. Its team is anonymous, and the official website states that the token has no intrinsic value or expectation of financial return, is for entertainment only and is not affiliated with Matt Furie. It has no blockchain of its own — it trades on Ethereum’s proof-of-stake (PoS) network — and offers no staking or governance features.",
     "Total supply is fixed at about 420.69 trillion tokens, with no further minting. At launch, 93.1% of the tokens went into a Uniswap liquidity pool and the LP tokens were burned; the remaining 6.9% was kept in a multisig wallet for future exchange listings and liquidity. There is no transaction tax, and contract ownership has been renounced. That enormous supply is why a single PEPE is worth only a tiny fraction of a cent."
    ],
    "applyH": "Applying the indicators to Pepe",
    "apply": [
     "Volatility: double-digit percentage moves in a single day are not unusual for PEPE, so RSI frequently crosses the overbought and oversold lines. On its own, RSI is noisy here; filter it with MACD and the 50/200 moving-average trend.",
     "Fear & Greed: this is a market-wide index with heavy Bitcoin weighting. Meme-coin hype and social-media buzz are not measured separately, so read it only as market background.",
     "MVRV: the CoinMetrics community API does not provide MVRV for PEPE, so it always shows N/A and the score reweights the indicators that remain.",
     "Mayer Multiple and drawdown: the thresholds come from more than a decade of Bitcoin history, but PEPE’s price record only starts in April 2023, so it has been through very few cycles. Meme coins often suffer far deeper drawdowns than Bitcoin, so a −50% drawdown should not be read as a ‘strong buy’ at face value.",
     "Price units: the indicators work on ratios (RSI, price ÷ 200-day average, % below the high), and MACD is also scaled to price, so a price with many leading zeros does not distort the score."
    ],
    "histH": "Pepe price cycles at a glance",
    "hist": [
     "April 2023: Rode a meme-coin frenzy right after launch, passing a $1 billion market cap within weeks.",
     "May 2023: Listed on Binance and other major exchanges, then gave back much of its surge.",
     "2024: Climbed again with the crypto bull market and set a new all-time high in December.",
     "2025: Amid a market correction, fell more than 70% from its peak at one point in the first half of the year."
    ],
    "faq": [
     {
      "q": "Is there a Pepe-only Fear & Greed Index?",
      "a": "The Fear & Greed Index from Alternative.me covers the crypto market as a whole, with heavy Bitcoin weighting, rather than individual coins. That is why the Pepe page labels it as a market-wide index. To judge whether PEPE itself is overheated, look at the RSI and Mayer Multiple calculated from PEPE’s price."
     },
     {
      "q": "Why is there no MVRV value for Pepe?",
      "a": "MVRV needs the average on-chain cost basis (realized cap), and the CoinMetrics community API used here has no PEPE data. The card shows N/A and the indicator is left out of the score."
     },
     {
      "q": "Does a high score mean I should buy Pepe now?",
      "a": "No. This page does not give investment advice; the score is a reference that summarizes indicator conditions. Meme coins move on demand and attention rather than fundamentals such as cash flow, so further declines are entirely possible even in the STRONG BUY band. Check which indicators produced the band and whether the market-wide Fear & Greed Index points the same way."
     },
     {
      "q": "The price has so many zeros — is the calculation still accurate?",
      "a": "Yes. RSI is a ratio of gains to losses, the Mayer Multiple divides price by its 200-day average, drawdown is a percentage, and MACD is converted to a ratio of price before scoring. However small the unit price, the result is the same."
     },
     {
      "q": "PEPE is young — can I trust the 200-day average and 365-day drawdown?",
      "a": "Data since April 2023 is enough to calculate them. But with so few cycles behind it, there is little evidence that thresholds proven on Bitcoin mean the same thing for PEPE. They are better used to read the direction of the trend than as hard lines to cross."
     }
    ]
   },
   "ja": {
    "title": "ペペ(PEPE)ミームコインの買い時スコアと市場の恐怖・強欲指数",
    "intro": "このページは、イーサリアム上のミームコインであるペペ(PEPE)の値動きを7つの指標で読み解き、0〜100の買い時スコアにまとめます。RSI(14)、MACD(12・26・9)、マイヤー倍率、365日高値からの下落率、50/200移動平均のクロスはPEPEの価格で計算し、恐怖・強欲指数は暗号資産市場全体の値を使います。MVRV ZスコアはPEPEのデータがないためN/A表示です。インストール不要、無料で使えます。",
    "coinH": "ペペ(PEPE)とは？",
    "coinP": [
     "ペペは2023年4月にイーサリアム上のERC-20トークンとして発行されたミームコインで、マット・フューリー(Matt Furie)が描いた漫画キャラクター「カエルのペペ」をモチーフにしています。開発チームは匿名で、公式サイトはこのトークンに本質的な価値も収益の見込みもなく娯楽目的であり、マット・フューリーとは無関係だと明記しています。独自のブロックチェーンはなくイーサリアムのプルーフ・オブ・ステーク(PoS)ネットワーク上で取引され、ステーキングやガバナンスの機能もありません。",
     "総供給量は約420兆6,900億枚で固定されており、追加発行はありません。ローンチ時に93.1%をUniswapの流動性プールに入れてLPトークンをバーンし、残る6.9%は将来の取引所上場と流動性供給のためマルチシグウォレットで保管されました。取引税はなく、コントラクトの所有権も放棄されています。1枚あたりの価格が1セントのごく一部にとどまるのは、この膨大な供給量のためです。"
    ],
    "applyH": "ペペに指標を当てはめるときの注意点",
    "apply": [
     "ボラティリティ：PEPEは1日で2桁パーセント動くことも珍しくなく、RSIが買われすぎ・売られすぎのラインを頻繁にまたぎます。RSI単体ではノイズが多いので、MACDや50/200移動平均のトレンドでふるいにかけてください。",
     "恐怖・強欲指数：ビットコインの比重が大きい市場全体の指数です。ミームコイン人気やSNSでの話題性は個別に測っていないため、相場の背景として読む程度にとどめましょう。",
     "MVRV：CoinMetricsコミュニティAPIはPEPEのMVRVを提供していないため常にN/Aとなり、スコアは残りの指標で重みを調整し直して算出します。",
     "マイヤー倍率と下落率：基準値は10年以上にわたるビットコインの歴史から導かれていますが、PEPEの価格履歴は2023年4月からで、経験したサイクルはごくわずかです。ミームコインはビットコインよりはるかに深く下落することが多く、−50%の下落率をそのまま「強い買い」と読むべきではありません。",
     "価格の単位：指標は比率(RSI、価格÷200日線、高値からの%)で計算され、MACDも価格に対する比率に換算するので、ゼロが多く並ぶ価格でもスコアはゆがみません。"
    ],
    "histH": "ペペの価格サイクルの要約",
    "hist": [
     "2023年4月：ローンチ直後のミームコインブームに乗り、数週間で時価総額が10億ドルを突破しました。",
     "2023年5月：Binanceなど大手取引所に相次いで上場した後、急騰分のかなりの部分を失いました。",
     "2024年：暗号資産の上昇相場とともに再び上昇し、12月に史上最高値を更新しました。",
     "2025年：相場調整のなか、上半期には一時高値から70%以上下落しました。"
    ],
    "faq": [
     {
      "q": "ペペ専用の恐怖・強欲指数はありますか？",
      "a": "Alternative.meの恐怖・強欲指数は個別コインではなく暗号資産市場全体を対象としており、ビットコインの比重が大きい指数です。そのためペペのページでも市場全体の指数として表示しています。PEPE自体の過熱感は、PEPEの価格から計算したRSIとマイヤー倍率で確認してください。"
     },
     {
      "q": "ペペのMVRVが表示されないのはなぜですか？",
      "a": "MVRVの計算にはオンチェーンの平均取得単価(実現時価総額)が必要ですが、このページが使うCoinMetricsコミュニティAPIにはPEPEのデータがありません。カードはN/Aとなり、スコアの計算からも外れます。"
     },
     {
      "q": "スコアが高ければ、今ペペを買ってもいいということですか？",
      "a": "そうではありません。このページは投資を勧めるものではなく、スコアは指標の状態をまとめた参考値です。ミームコインはキャッシュフローのようなファンダメンタルズではなく需要と話題性で動くため、STRONG BUYの帯でもさらに下がることは十分あり得ます。どの指標がその帯を生んだのか、市場全体の恐怖・強欲指数と向きが一致しているかもあわせて確認してください。"
     },
     {
      "q": "価格にゼロが多いのですが、計算は正確ですか？",
      "a": "正確です。RSIは上昇幅と下落幅の比率、マイヤー倍率は価格を200日線で割った値、下落率はパーセントで、MACDも価格に対する比率に変換してからスコア化します。価格の単位がどれほど小さくても結果は変わりません。"
     },
     {
      "q": "誕生から日が浅いのに、200日線や365日下落率は信頼できますか？",
      "a": "2023年4月以降のデータがあるので、計算そのものは可能です。ただし経験したサイクルが少なく、ビットコインで実績のある基準値がPEPEでも同じ意味を持つ根拠は乏しいのが実情です。基準線を超えたかどうかより、トレンドの向きを見る用途に使うのがおすすめです。"
     }
    ]
   },
   "ko": {
    "title": "페페(PEPE) 밈코인 매수 타이밍 점수와 시장 공포·탐욕 지수",
    "intro": "이더리움 기반 밈코인 페페(PEPE)의 가격 흐름을 7개 지표로 읽어 0~100 매수 타이밍 점수로 정리하는 화면입니다. RSI(14), MACD(12·26·9), 마이어 배수, 365일 고점 대비 낙폭, 50/200 이동평균 크로스는 PEPE 가격으로 계산하고, 공포·탐욕 지수는 암호화폐 시장 전체 값을 씁니다. MVRV Z-점수는 PEPE 데이터가 없어 N/A로 표시되며, 설치 없이 무료로 볼 수 있습니다.",
    "coinH": "페페(PEPE)란?",
    "coinP": [
     "페페는 2023년 4월 이더리움 위에서 ERC-20 토큰으로 발행된 밈코인으로, 맷 퓨리(Matt Furie)의 만화 캐릭터 ‘개구리 페페’를 모티프로 삼았습니다. 개발팀은 익명이며, 공식 사이트는 이 토큰이 내재 가치나 수익 기대가 없는 오락용이고 맷 퓨리와는 관련이 없다고 밝힙니다. 자체 블록체인이 없어 이더리움의 지분증명(PoS) 네트워크 위에서 거래되고, 스테이킹이나 거버넌스 같은 기능도 없습니다.",
     "총발행량은 약 420조 6,900억 개로 고정돼 있으며 추가 발행이 없습니다. 출시 때 물량의 93.1%를 유니스왑 유동성 풀에 넣고 LP 토큰을 소각했고, 나머지 6.9%는 향후 거래소 상장과 유동성 공급용으로 멀티시그 지갑에 보관했습니다. 거래 세금이 붙지 않고 컨트랙트 소유권도 포기된 상태입니다. 개당 가격이 1센트의 아주 작은 일부에 불과한 것은 이처럼 발행량이 매우 많기 때문입니다."
    ],
    "applyH": "페페에 지표를 적용할 때",
    "apply": [
     "변동성: PEPE는 하루에도 두 자릿수 퍼센트가 움직이는 일이 드물지 않아 RSI가 과매수·과매도 경계를 자주 넘나듭니다. RSI 하나만으로는 잡음이 많으니 MACD와 50/200 이동평균 추세로 걸러 보세요.",
     "공포·탐욕 지수: 비트코인 비중이 큰 시장 전체 지수입니다. 밈코인 테마의 열기나 소셜 미디어 화제성은 따로 측정되지 않으므로 시장 배경 정도로만 해석하세요.",
     "MVRV: CoinMetrics 커뮤니티 API가 PEPE의 MVRV를 제공하지 않아 항상 N/A로 표시되며, 점수는 남은 지표로 가중치를 재조정해 냅니다.",
     "마이어 배수·낙폭: 기준값은 10년 넘는 비트코인 역사에서 나왔지만, PEPE의 가격 이력은 2023년 4월부터라 겪은 사이클이 매우 적습니다. 밈코인은 고점 대비 낙폭이 비트코인보다 훨씬 깊어지는 경우가 많아, -50% 낙폭을 ‘강한 매수’로 그대로 읽으면 안 됩니다.",
     "가격 단위: 지표는 비율(RSI, 가격÷200일선, 고점 대비 %)로 계산되고 MACD도 가격 대비로 환산하므로, 0이 많은 가격 단위가 점수를 왜곡하지는 않습니다."
    ],
    "histH": "페페 가격 사이클 요약",
    "hist": [
     "2023년 4월: 출시 직후 밈코인 열풍을 타고 몇 주 만에 시가총액이 10억 달러를 넘었습니다.",
     "2023년 5월: 바이낸스 등 대형 거래소에 잇따라 상장된 뒤 급등분의 상당 부분을 반납했습니다.",
     "2024년: 암호화폐 상승장과 함께 다시 올라 12월에 사상 최고가를 새로 썼습니다.",
     "2025년: 시장 조정 속에 상반기 한때 고점 대비 70% 넘게 하락했습니다."
    ],
    "faq": [
     {
      "q": "페페 전용 공포·탐욕 지수가 있나요?",
      "a": "Alternative.me가 내는 공포·탐욕 지수는 코인별이 아니라 암호화폐 시장 전체를 대상으로 하며, 비트코인 비중이 큽니다. 그래서 페페 화면에서도 시장 전체 지수로 표시합니다. PEPE만의 과열 여부는 PEPE 가격으로 계산한 RSI와 마이어 배수에서 확인하세요."
     },
     {
      "q": "페페 MVRV 값은 왜 표시되지 않나요?",
      "a": "MVRV를 계산하려면 온체인 평균 매수원가(실현 시가총액)가 필요한데, 이 화면이 쓰는 CoinMetrics 커뮤니티 API에는 PEPE 데이터가 없습니다. 카드는 N/A로 표시되고 점수 계산에서 빠집니다."
     },
     {
      "q": "점수가 높으면 지금 페페를 사도 된다는 뜻인가요?",
      "a": "그렇지 않습니다. 이 화면은 투자를 권유하지 않으며, 점수는 지표 상태를 요약한 참고값입니다. 밈코인은 현금흐름 같은 펀더멘털이 아니라 수요와 화제성에 따라 움직이므로, 점수가 STRONG BUY 구간이어도 추가 하락이 얼마든지 가능합니다. 어떤 지표가 그 구간을 만들었는지, 시장 전체 공포·탐욕 지수와 방향이 같은지 함께 보세요."
     },
     {
      "q": "가격에 0이 너무 많은데 계산이 정확한가요?",
      "a": "정확합니다. RSI는 상승 폭과 하락 폭의 비율, 마이어 배수는 가격을 200일선으로 나눈 값, 낙폭은 퍼센트이고, MACD도 가격 대비 비율로 바꿔 점수화합니다. 가격 단위가 아무리 작아도 결과는 달라지지 않습니다."
     },
     {
      "q": "출시된 지 오래되지 않았는데 200일선과 365일 낙폭을 믿을 수 있나요?",
      "a": "2023년 4월 이후 데이터가 쌓여 계산 자체는 가능합니다. 다만 겪은 사이클이 짧아, 비트코인에서 검증된 기준값이 PEPE에서도 같은 의미를 가진다는 근거는 부족합니다. 기준선 돌파 여부보다 추세의 방향을 보는 용도로 쓰는 편이 낫습니다."
     }
    ]
   },
   "zh": {
    "title": "佩佩币(PEPE)迷因币买入时机评分与全市场恐惧与贪婪指数",
    "intro": "本页用7项指标解读以太坊上的迷因币佩佩币(PEPE)的价格走势，并汇总为0–100买入时机评分。RSI(14)、MACD(12·26·9)、梅耶倍数、距365日高点回撤和50/200均线交叉均基于PEPE自身价格计算，恐惧与贪婪指数则采用整个加密市场的数值。由于没有PEPE的数据，MVRV Z分数显示为N/A。无需安装，免费使用。",
    "coinH": "什么是佩佩币(PEPE)？",
    "coinP": [
     "佩佩币是2023年4月在以太坊上以ERC-20代币形式发行的迷因币，灵感来自马特·弗里(Matt Furie)创作的漫画角色“青蛙佩佩”。开发团队匿名，官网明确表示该代币没有内在价值，也不提供收益预期，仅供娱乐，且与马特·弗里无关。它没有自己的区块链，在以太坊的权益证明(PoS)网络上交易，也没有质押或治理功能。",
     "总供应量固定为约420.69万亿枚，不再增发。上线时，93.1%的代币被注入Uniswap流动性池，相应的LP代币已销毁；其余6.9%存放在多签钱包中，用于未来的交易所上市和流动性供应。交易不收税，合约所有权也已放弃。正因为供应量极其庞大，单枚PEPE的价格只有一美分的极小一部分。"
    ],
    "applyH": "将指标用于佩佩币时的注意事项",
    "apply": [
     "波动性：PEPE单日涨跌两位数百分比并不罕见，RSI经常穿越超买和超卖线。单看RSI噪音较多，建议结合MACD与50/200均线趋势进行过滤。",
     "恐惧与贪婪指数：这是比特币权重很高的全市场指数，迷因币热度和社交媒体话题度并未单独衡量，只宜作为市场背景参考。",
     "MVRV：CoinMetrics社区API不提供PEPE的MVRV，因此始终显示N/A，评分会用剩余指标重新调整权重。",
     "梅耶倍数与回撤：这些阈值来自比特币十多年的历史，而PEPE的价格记录始于2023年4月，经历的周期极少。迷因币的回撤往往远深于比特币，−50%的回撤不能直接解读为“强烈买入”。",
     "价格单位：指标按比率计算(RSI、价格÷200日均线、距高点百分比)，MACD也换算为相对价格的比例，因此价格小数点后有很多零并不会扭曲评分。"
    ],
    "histH": "佩佩币价格周期概览",
    "hist": [
     "2023年4月：上线后乘着迷因币热潮，数周内市值突破10亿美元。",
     "2023年5月：陆续登陆币安等大型交易所后，回吐了相当一部分涨幅。",
     "2024年：随着加密牛市再度上涨，并于12月创下历史新高。",
     "2025年：在市场调整中，上半年一度较高点下跌超过70%。"
    ],
    "faq": [
     {
      "q": "佩佩币有专属的恐惧与贪婪指数吗？",
      "a": "Alternative.me的恐惧与贪婪指数针对的是整个加密市场而非单个币种，且比特币权重很高，所以佩佩币页面也将其标示为全市场指数。要判断PEPE本身是否过热，请看基于PEPE价格计算的RSI和梅耶倍数。"
     },
     {
      "q": "为什么佩佩币没有MVRV数值？",
      "a": "计算MVRV需要链上平均持仓成本(已实现市值)，而本页使用的CoinMetrics社区API没有PEPE的数据。卡片显示N/A，该指标也不计入评分。"
     },
     {
      "q": "评分高是否意味着现在可以买佩佩币？",
      "a": "并不是。本页不构成投资建议，评分只是汇总指标状态的参考值。迷因币的涨跌取决于需求和话题热度，而非现金流等基本面，即使处于STRONG BUY区间，也完全可能继续下跌。请同时查看是哪些指标形成了该区间，以及全市场恐惧与贪婪指数的方向是否一致。"
     },
     {
      "q": "价格里有那么多零，计算还准确吗？",
      "a": "准确。RSI是涨幅与跌幅之比，梅耶倍数是价格除以200日均线，回撤是百分比，MACD也会先换算成相对价格的比例再计分。无论单价多小，结果都一样。"
     },
     {
      "q": "佩佩币上线时间不长，200日均线和365日回撤可信吗？",
      "a": "2023年4月以来的数据已足够完成计算。但它经历的周期太少，没有足够证据表明在比特币上验证过的阈值对PEPE具有同样含义。与其看是否突破阈值，不如用来判断趋势方向。"
     }
    ]
   },
   "zh-Hant": {
    "title": "佩佩幣(PEPE)迷因幣買入時機評分與全市場恐懼與貪婪指數",
    "intro": "本頁以7項指標解讀以太坊上的迷因幣佩佩幣(PEPE)的價格走勢，並彙整為0–100買入時機評分。RSI(14)、MACD(12·26·9)、梅耶倍數、距365日高點回撤和50/200均線交叉皆以PEPE本身的價格計算，恐懼與貪婪指數則採用整體加密市場的數值。由於沒有PEPE的資料，MVRV Z分數顯示為N/A。免安裝，免費使用。",
    "coinH": "什麼是佩佩幣(PEPE)？",
    "coinP": [
     "佩佩幣是2023年4月在以太坊上以ERC-20代幣形式發行的迷因幣，靈感來自馬特·弗里(Matt Furie)創作的漫畫角色「青蛙佩佩」。開發團隊匿名，官網明確表示此代幣沒有內在價值，也不提供收益預期，僅供娛樂，且與馬特·弗里無關。它沒有自己的區塊鏈，在以太坊的權益證明(PoS)網路上交易，也沒有質押或治理功能。",
     "總供應量固定為約420.69兆枚，不再增發。上線時，93.1%的代幣被注入Uniswap流動性池，對應的LP代幣已銷毀；其餘6.9%存放在多簽錢包中，用於未來的交易所上架與流動性供應。交易不收稅，合約所有權也已放棄。正因為供應量極其龐大，單枚PEPE的價格只有一美分的極小一部分。"
    ],
    "applyH": "將指標用於佩佩幣時的注意事項",
    "apply": [
     "波動性：PEPE單日漲跌兩位數百分比並不罕見，RSI經常穿越超買與超賣線。單看RSI雜訊較多，建議搭配MACD與50/200均線趨勢進行過濾。",
     "恐懼與貪婪指數：這是比特幣權重很高的全市場指數，迷因幣熱度與社群媒體話題度並未單獨衡量，只適合作為市場背景參考。",
     "MVRV：CoinMetrics社群API不提供PEPE的MVRV，因此始終顯示N/A，評分會以剩餘指標重新調整權重。",
     "梅耶倍數與回撤：這些門檻來自比特幣十多年的歷史，而PEPE的價格紀錄始於2023年4月，經歷的週期極少。迷因幣的回撤往往遠深於比特幣，−50%的回撤不能直接解讀為「強烈買入」。",
     "價格單位：指標以比率計算(RSI、價格÷200日均線、距高點百分比)，MACD也換算為相對價格的比例，因此價格小數點後有許多零並不會扭曲評分。"
    ],
    "histH": "佩佩幣價格週期概覽",
    "hist": [
     "2023年4月：上線後搭上迷因幣熱潮，數週內市值突破10億美元。",
     "2023年5月：陸續登上幣安等大型交易所後，回吐了相當一部分漲幅。",
     "2024年：隨著加密牛市再度上漲，並於12月創下歷史新高。",
     "2025年：在市場修正中，上半年一度自高點下跌超過70%。"
    ],
    "faq": [
     {
      "q": "佩佩幣有專屬的恐懼與貪婪指數嗎？",
      "a": "Alternative.me的恐懼與貪婪指數針對的是整體加密市場而非個別幣種，且比特幣權重很高，所以佩佩幣頁面也將其標示為全市場指數。要判斷PEPE本身是否過熱，請看以PEPE價格計算的RSI與梅耶倍數。"
     },
     {
      "q": "為什麼佩佩幣沒有MVRV數值？",
      "a": "計算MVRV需要鏈上平均持倉成本(已實現市值)，而本頁使用的CoinMetrics社群API沒有PEPE的資料。卡片顯示N/A，該指標也不計入評分。"
     },
     {
      "q": "評分高是否代表現在可以買佩佩幣？",
      "a": "並不是。本頁不構成投資建議，評分只是彙整指標狀態的參考值。迷因幣的漲跌取決於需求與話題熱度，而非現金流等基本面，即使處於STRONG BUY區間，也完全可能繼續下跌。請同時查看是哪些指標形成了該區間，以及全市場恐懼與貪婪指數的方向是否一致。"
     },
     {
      "q": "價格裡有那麼多零，計算還準確嗎？",
      "a": "準確。RSI是漲幅與跌幅之比，梅耶倍數是價格除以200日均線，回撤是百分比，MACD也會先換算成相對價格的比例再計分。無論單價多小，結果都一樣。"
     },
     {
      "q": "佩佩幣上線時間不長，200日均線與365日回撤可信嗎？",
      "a": "2023年4月以來的資料已足夠完成計算。但它經歷的週期太少，沒有足夠證據顯示在比特幣上驗證過的門檻對PEPE具有同樣意義。與其看是否突破門檻，不如用來判斷趨勢方向。"
     }
    ]
   },
   "th": {
    "title": "คะแนนจังหวะซื้อเหรียญมีมเปเป้ (PEPE) และดัชนีความกลัว-ความโลภของตลาด",
    "intro": "หน้านี้อ่านความเคลื่อนไหวของราคาเปเป้ (PEPE) เหรียญมีมบนอีเธอเรียม ผ่าน 7 ตัวชี้วัด แล้วสรุปเป็นคะแนนจังหวะซื้อ 0–100 โดย RSI(14), MACD(12·26·9), Mayer Multiple, การย่อจากจุดสูงสุด 365 วัน และการตัดกันของเส้นเฉลี่ย 50/200 คำนวณจากราคาของ PEPE เอง ส่วนดัชนีความกลัว-ความโลภใช้ค่าของตลาดคริปโตทั้งหมด MVRV Z-Score แสดงเป็น N/A เพราะไม่มีข้อมูลของ PEPE ใช้งานฟรีโดยไม่ต้องติดตั้ง",
    "coinH": "เปเป้ (PEPE) คืออะไร?",
    "coinP": [
     "เปเป้เป็นเหรียญมีมที่ออกในเดือนเมษายน 2023 ในรูปแบบโทเคน ERC-20 บนอีเธอเรียม โดยใช้ตัวการ์ตูน “กบเปเป้” ของแมตต์ ฟิวรี (Matt Furie) เป็นแรงบันดาลใจ ทีมพัฒนาไม่เปิดเผยตัวตน และเว็บไซต์ทางการระบุว่าโทเคนนี้ไม่มีมูลค่าในตัว ไม่มีการคาดหวังผลตอบแทน ใช้เพื่อความบันเทิงเท่านั้น และไม่เกี่ยวข้องกับแมตต์ ฟิวรี เปเป้ไม่มีบล็อกเชนของตัวเอง แต่ซื้อขายบนเครือข่าย Proof of Stake (PoS) ของอีเธอเรียม และไม่มีฟังก์ชันสเตกหรือกำกับดูแล",
     "อุปทานทั้งหมดคงที่ราว 420.69 ล้านล้านเหรียญ และไม่มีการออกเพิ่ม ตอนเปิดตัว 93.1% ของโทเคนถูกใส่ในพูลสภาพคล่องของ Uniswap และโทเคน LP ถูกเผาทิ้ง ส่วนอีก 6.9% เก็บไว้ในกระเป๋ามัลติซิกสำหรับการลิสต์บนกระดานเทรดและสภาพคล่องในอนาคต ไม่มีภาษีการซื้อขาย และสละสิทธิ์ความเป็นเจ้าของสัญญาแล้ว อุปทานมหาศาลนี้คือเหตุผลที่ราคาต่อเหรียญมีค่าเพียงเศษเสี้ยวเล็กๆ ของหนึ่งเซนต์"
    ],
    "applyH": "ข้อควรรู้เมื่อใช้ตัวชี้วัดกับเปเป้",
    "apply": [
     "ความผันผวน: PEPE ขยับสองหลักเปอร์เซ็นต์ภายในวันเดียวได้ไม่ยาก RSI จึงข้ามเส้นซื้อมากเกินและขายมากเกินบ่อย RSI อย่างเดียวมีสัญญาณรบกวนมาก ควรกรองด้วย MACD และเทรนด์เส้นเฉลี่ย 50/200",
     "ดัชนีความกลัว-ความโลภ: เป็นดัชนีทั้งตลาดที่ให้น้ำหนักบิตคอยน์สูง กระแสเหรียญมีมและความนิยมบนโซเชียลมีเดียไม่ได้ถูกวัดแยก จึงควรอ่านเป็นเพียงฉากหลังของตลาด",
     "MVRV: CoinMetrics community API ไม่มีค่า MVRV ของ PEPE จึงแสดง N/A เสมอ และคะแนนจะปรับน้ำหนักใหม่จากตัวชี้วัดที่เหลือ",
     "Mayer Multiple และการย่อตัว: เกณฑ์เหล่านี้มาจากประวัติบิตคอยน์กว่าสิบปี แต่ประวัติราคาของ PEPE เริ่มเมื่อเมษายน 2023 จึงผ่านวัฏจักรมาน้อยมาก เหรียญมีมมักย่อตัวลึกกว่าบิตคอยน์มาก การย่อตัว −50% จึงไม่ควรอ่านตรงๆ ว่าเป็น “ซื้อแรง”",
     "หน่วยราคา: ตัวชี้วัดคำนวณเป็นอัตราส่วน (RSI, ราคา ÷ เส้นเฉลี่ย 200 วัน, % ต่ำกว่าจุดสูงสุด) และ MACD ก็ปรับเทียบกับราคา ราคาที่มีเลขศูนย์นำหน้าจำนวนมากจึงไม่ทำให้คะแนนบิดเบือน"
    ],
    "histH": "สรุปวัฏจักรราคาเปเป้",
    "hist": [
     "เมษายน 2023: หลังเปิดตัวได้แรงหนุนจากกระแสเหรียญมีม มูลค่าตลาดทะลุ 1 พันล้านดอลลาร์ภายในไม่กี่สัปดาห์",
     "พฤษภาคม 2023: หลังลิสต์บน Binance และกระดานเทรดใหญ่อื่นๆ ราคาก็ย่อลงคืนส่วนที่พุ่งขึ้นไปไม่น้อย",
     "2024: ปรับตัวขึ้นอีกครั้งพร้อมตลาดกระทิงคริปโต และทำจุดสูงสุดตลอดกาลใหม่ในเดือนธันวาคม",
     "2025: ท่ามกลางการปรับฐานของตลาด ช่วงครึ่งปีแรกเคยร่วงกว่า 70% จากจุดสูงสุด"
    ],
    "faq": [
     {
      "q": "เปเป้มีดัชนีความกลัว-ความโลภเฉพาะของตัวเองไหม?",
      "a": "ดัชนีความกลัว-ความโลภของ Alternative.me ครอบคลุมตลาดคริปโตทั้งหมด ไม่ได้แยกรายเหรียญ และให้น้ำหนักบิตคอยน์สูง หน้าเปเป้จึงแสดงเป็นดัชนีทั้งตลาด หากต้องการดูว่า PEPE ร้อนแรงเกินไปหรือไม่ ให้ดู RSI และ Mayer Multiple ที่คำนวณจากราคา PEPE"
     },
     {
      "q": "ทำไมเปเป้ไม่มีค่า MVRV?",
      "a": "การคำนวณ MVRV ต้องใช้ต้นทุนเฉลี่ยบนเชน (realized cap) แต่ CoinMetrics community API ที่หน้านี้ใช้ไม่มีข้อมูลของ PEPE การ์ดจึงแสดง N/A และไม่นำมารวมในคะแนน"
     },
     {
      "q": "คะแนนสูงแปลว่าควรซื้อเปเป้ตอนนี้เลยไหม?",
      "a": "ไม่ใช่ หน้านี้ไม่ใช่คำแนะนำการลงทุน คะแนนเป็นเพียงค่าอ้างอิงที่สรุปสภาพของตัวชี้วัด เหรียญมีมเคลื่อนไหวตามความต้องการและกระแส ไม่ได้อิงปัจจัยพื้นฐานอย่างกระแสเงินสด แม้อยู่ในช่วง STRONG BUY ราคาก็ยังร่วงต่อได้เสมอ ควรดูว่าตัวชี้วัดใดทำให้เกิดช่วงคะแนนนั้น และดัชนีความกลัว-ความโลภทั้งตลาดชี้ไปทางเดียวกันหรือไม่"
     },
     {
      "q": "ราคามีเลขศูนย์เยอะมาก การคำนวณยังแม่นยำไหม?",
      "a": "แม่นยำ RSI คืออัตราส่วนของช่วงขึ้นต่อช่วงลง Mayer Multiple คือราคาหารด้วยเส้นเฉลี่ย 200 วัน การย่อตัวคิดเป็นเปอร์เซ็นต์ และ MACD ก็แปลงเป็นสัดส่วนต่อราคาก่อนให้คะแนน ไม่ว่าราคาต่อหน่วยจะเล็กแค่ไหน ผลลัพธ์ก็เหมือนเดิม"
     },
     {
      "q": "เปเป้เพิ่งเปิดตัวไม่นาน เส้นเฉลี่ย 200 วันและการย่อตัว 365 วันเชื่อถือได้ไหม?",
      "a": "ข้อมูลตั้งแต่เมษายน 2023 เพียงพอสำหรับการคำนวณแล้ว แต่เพราะผ่านวัฏจักรมาน้อย จึงยังมีหลักฐานไม่มากว่าเกณฑ์ที่พิสูจน์แล้วกับบิตคอยน์จะมีความหมายเดียวกันกับ PEPE ควรใช้ดูทิศทางของเทรนด์มากกว่าใช้เป็นเส้นตัดสินตายตัว"
     }
    ]
   },
   "es": {
    "title": "Pepe (PEPE): puntuación de compra de la memecoin e índice de miedo y codicia",
    "intro": "Esta página analiza el precio de Pepe (PEPE), una memecoin de Ethereum, con siete indicadores y los resume en una puntuación de compra de 0 a 100. El RSI(14), el MACD(12·26·9), el múltiplo de Mayer, la caída desde el máximo de 365 días y el cruce de medias 50/200 se calculan sobre el precio de PEPE, mientras que el índice de miedo y codicia es el de todo el mercado cripto. El MVRV Z-Score aparece como N/A porque no hay datos de PEPE. Es gratuita y no requiere instalación.",
    "coinH": "¿Qué es Pepe (PEPE)?",
    "coinP": [
     "Pepe es una memecoin lanzada en abril de 2023 como token ERC-20 en Ethereum, inspirada en la rana Pepe, el personaje de cómic creado por Matt Furie. Su equipo es anónimo y la web oficial afirma que el token no tiene valor intrínseco ni expectativa de rentabilidad, que es solo para entretenimiento y que no está vinculado a Matt Furie. No tiene blockchain propia —se negocia en la red de prueba de participación (PoS) de Ethereum— y no ofrece staking ni gobernanza.",
     "El suministro total está fijado en unos 420,69 billones de tokens y no se emiten más. En el lanzamiento, el 93,1 % de los tokens se depositó en un pool de liquidez de Uniswap y los tokens LP se quemaron; el 6,9 % restante se guardó en un monedero multifirma para futuros listados en exchanges y liquidez. No hay impuesto por transacción y se renunció a la propiedad del contrato. Ese suministro enorme explica que cada PEPE valga una fracción diminuta de céntimo."
    ],
    "applyH": "Cómo aplicar los indicadores a Pepe",
    "apply": [
     "Volatilidad: en PEPE no son raros los movimientos de dos dígitos porcentuales en un solo día, así que el RSI cruza a menudo las líneas de sobrecompra y sobreventa. Por sí solo, el RSI tiene mucho ruido; fíltralo con el MACD y la tendencia de las medias 50/200.",
     "Miedo y codicia: es un índice de todo el mercado con mucho peso de Bitcoin. El entusiasmo por las memecoins y el ruido en redes sociales no se miden por separado, así que tómalo solo como contexto del mercado.",
     "MVRV: la API comunitaria de CoinMetrics no ofrece MVRV para PEPE, por lo que siempre aparece N/A y la puntuación reajusta los pesos de los indicadores que quedan.",
     "Múltiplo de Mayer y caída: los umbrales salen de más de una década de historia de Bitcoin, pero el historial de precios de PEPE empieza en abril de 2023 y ha vivido muy pocos ciclos. Las memecoins suelen sufrir caídas mucho más profundas que Bitcoin, así que una caída del −50 % no debe leerse sin más como «compra fuerte».",
     "Unidades de precio: los indicadores trabajan con proporciones (RSI, precio ÷ media de 200 días, % por debajo del máximo) y el MACD también se escala al precio, de modo que un precio con muchos ceros no distorsiona la puntuación."
    ],
    "histH": "Resumen de los ciclos de precio de Pepe",
    "hist": [
     "Abril de 2023: impulsada por la fiebre de las memecoins justo tras su lanzamiento, superó los 1.000 millones de dólares de capitalización en pocas semanas.",
     "Mayo de 2023: tras llegar a Binance y otros grandes exchanges, devolvió buena parte de la subida.",
     "2024: volvió a subir con el mercado alcista cripto y marcó un nuevo máximo histórico en diciembre.",
     "2025: en plena corrección del mercado, llegó a caer más de un 70 % desde su máximo durante el primer semestre."
    ],
    "faq": [
     {
      "q": "¿Existe un índice de miedo y codicia exclusivo de Pepe?",
      "a": "El índice de miedo y codicia de Alternative.me abarca el mercado cripto en su conjunto, con mucho peso de Bitcoin, y no monedas sueltas. Por eso la página de Pepe lo presenta como índice de todo el mercado. Para saber si PEPE en sí está sobrecalentada, mira el RSI y el múltiplo de Mayer calculados con su precio."
     },
     {
      "q": "¿Por qué Pepe no muestra valor de MVRV?",
      "a": "El MVRV necesita el coste medio de adquisición on-chain (capitalización realizada), y la API comunitaria de CoinMetrics que usa esta página no tiene datos de PEPE. La tarjeta muestra N/A y el indicador queda fuera de la puntuación."
     },
     {
      "q": "¿Una puntuación alta significa que debo comprar Pepe ya?",
      "a": "No. Esta página no ofrece asesoramiento de inversión; la puntuación es una referencia que resume el estado de los indicadores. Las memecoins se mueven por demanda y atención, no por fundamentales como el flujo de caja, así que incluso en la franja STRONG BUY pueden seguir cayendo. Comprueba qué indicadores generan esa franja y si el índice de miedo y codicia del mercado apunta en la misma dirección."
     },
     {
      "q": "El precio tiene muchísimos ceros: ¿el cálculo sigue siendo exacto?",
      "a": "Sí. El RSI es una proporción entre subidas y bajadas, el múltiplo de Mayer divide el precio por su media de 200 días, la caída es un porcentaje y el MACD se convierte en proporción del precio antes de puntuarlo. Por pequeño que sea el precio unitario, el resultado no cambia."
     },
     {
      "q": "Pepe es reciente: ¿son fiables la media de 200 días y la caída de 365 días?",
      "a": "Los datos desde abril de 2023 bastan para calcularlos. Pero con tan pocos ciclos a sus espaldas, hay poca evidencia de que los umbrales probados en Bitcoin signifiquen lo mismo en PEPE. Conviene usarlos para leer la dirección de la tendencia más que como líneas rígidas."
     }
    ]
   },
   "fr": {
    "title": "Pepe (PEPE) : score de timing d’achat du memecoin et indice de peur et d’avidité",
    "intro": "Cette page analyse le cours de Pepe (PEPE), un memecoin de l’écosystème Ethereum, à travers sept indicateurs résumés en un score de timing d’achat de 0 à 100. Le RSI(14), le MACD(12·26·9), le multiple de Mayer, le repli depuis le plus haut sur 365 jours et le croisement des moyennes 50/200 sont calculés sur le prix du PEPE, tandis que l’indice de peur et d’avidité est celui de tout le marché crypto. Le MVRV Z-Score affiche N/A faute de données pour PEPE. Gratuit et sans installation.",
    "coinH": "Qu’est-ce que Pepe (PEPE) ?",
    "coinP": [
     "Pepe est un memecoin lancé en avril 2023 sous forme de jeton ERC-20 sur Ethereum, inspiré de Pepe la grenouille, le personnage de bande dessinée créé par Matt Furie. Son équipe est anonyme, et le site officiel précise que le jeton n’a ni valeur intrinsèque ni perspective de rendement, qu’il sert uniquement au divertissement et qu’il n’est pas lié à Matt Furie. Il n’a pas de blockchain propre — il s’échange sur le réseau en preuve d’enjeu (PoS) d’Ethereum — et ne propose ni staking ni gouvernance.",
     "L’offre totale est fixée à environ 420 690 milliards de jetons, sans nouvelle émission. Au lancement, 93,1 % des jetons ont été placés dans un pool de liquidité Uniswap et les jetons LP ont été brûlés ; les 6,9 % restants ont été conservés dans un portefeuille multisignature pour de futures cotations et de la liquidité. Aucune taxe ne s’applique aux transactions et la propriété du contrat a été abandonnée. Cette offre colossale explique qu’un PEPE ne vaille qu’une infime fraction de centime."
    ],
    "applyH": "Appliquer les indicateurs à Pepe",
    "apply": [
     "Volatilité : des variations à deux chiffres en une seule journée n’ont rien d’exceptionnel pour le PEPE ; le RSI franchit donc souvent les seuils de surachat et de survente. Seul, le RSI est très bruité : filtrez-le avec le MACD et la tendance des moyennes 50/200.",
     "Peur et avidité : c’est un indice de marché global, fortement pondéré par le Bitcoin. L’engouement pour les memecoins et le bruit sur les réseaux sociaux n’y sont pas mesurés à part ; lisez-le seulement comme toile de fond du marché.",
     "MVRV : l’API communautaire de CoinMetrics ne fournit pas de MVRV pour le PEPE ; il affiche donc toujours N/A et le score réajuste les pondérations des indicateurs restants.",
     "Multiple de Mayer et repli : les seuils proviennent de plus de dix ans d’historique du Bitcoin, alors que l’historique de prix du PEPE ne commence qu’en avril 2023 et ne couvre que très peu de cycles. Les memecoins subissent souvent des replis bien plus profonds que le Bitcoin : un repli de −50 % ne doit pas être lu tel quel comme un « achat fort ».",
     "Unités de prix : les indicateurs reposent sur des ratios (RSI, prix ÷ moyenne à 200 jours, % sous le plus haut) et le MACD est lui aussi rapporté au prix ; un cours avec beaucoup de zéros ne fausse donc pas le score."
    ],
    "histH": "Les cycles de prix de Pepe en bref",
    "hist": [
     "Avril 2023 : porté par la frénésie des memecoins dès son lancement, il dépasse 1 milliard de dollars de capitalisation en quelques semaines.",
     "Mai 2023 : après son arrivée sur Binance et d’autres grandes plateformes, il rend une bonne partie de sa flambée.",
     "2024 : nouvelle hausse avec le marché haussier crypto et nouveau record historique en décembre.",
     "2025 : dans un marché en correction, il recule à un moment de plus de 70 % par rapport à son sommet au premier semestre."
    ],
    "faq": [
     {
      "q": "Existe-t-il un indice de peur et d’avidité propre à Pepe ?",
      "a": "L’indice de peur et d’avidité d’Alternative.me couvre le marché crypto dans son ensemble, avec un fort poids du Bitcoin, et non chaque crypto séparément. C’est pourquoi la page Pepe le présente comme un indice de marché global. Pour juger si le PEPE lui-même est en surchauffe, regardez le RSI et le multiple de Mayer calculés sur son prix."
     },
     {
      "q": "Pourquoi Pepe n’a-t-il pas de valeur MVRV ?",
      "a": "Le MVRV nécessite le coût d’acquisition moyen on-chain (capitalisation réalisée), et l’API communautaire de CoinMetrics utilisée ici ne contient pas de données sur le PEPE. La carte affiche N/A et l’indicateur est exclu du score."
     },
     {
      "q": "Un score élevé signifie-t-il qu’il faut acheter du Pepe maintenant ?",
      "a": "Non. Cette page ne donne pas de conseil en investissement ; le score est un repère qui résume l’état des indicateurs. Les memecoins évoluent au gré de la demande et de l’attention, et non de fondamentaux comme les flux de trésorerie : même dans la zone STRONG BUY, une nouvelle baisse reste tout à fait possible. Vérifiez quels indicateurs produisent cette zone et si l’indice de peur et d’avidité du marché va dans le même sens."
     },
     {
      "q": "Le prix comporte énormément de zéros : le calcul reste-t-il exact ?",
      "a": "Oui. Le RSI est un rapport entre hausses et baisses, le multiple de Mayer divise le prix par sa moyenne à 200 jours, le repli est un pourcentage et le MACD est converti en proportion du prix avant notation. Aussi petit que soit le prix unitaire, le résultat est identique."
     },
     {
      "q": "Pepe est récent : la moyenne à 200 jours et le repli sur 365 jours sont-ils fiables ?",
      "a": "Les données disponibles depuis avril 2023 suffisent pour les calculer. Mais avec si peu de cycles derrière lui, rien ne prouve vraiment que des seuils validés sur le Bitcoin aient le même sens pour le PEPE. Mieux vaut s’en servir pour lire la direction de la tendance que comme des lignes à franchir."
     }
    ]
   },
   "de": {
    "title": "Pepe (PEPE): Kaufzeitpunkt-Score für den Memecoin und Angst- & Gier-Index",
    "intro": "Diese Seite wertet den Kursverlauf von Pepe (PEPE), einem Memecoin auf Ethereum, mit sieben Indikatoren aus und fasst sie zu einem Kaufzeitpunkt-Score von 0 bis 100 zusammen. RSI(14), MACD(12·26·9), Mayer-Multiple, Rückgang vom 365-Tage-Hoch und das 50/200-Durchschnittskreuz werden auf Basis des PEPE-Kurses berechnet; der Angst- & Gier-Index ist der Wert für den gesamten Kryptomarkt. Der MVRV Z-Score zeigt N/A, weil es für PEPE keine Daten gibt. Kostenlos und ohne Installation.",
    "coinH": "Was ist Pepe (PEPE)?",
    "coinP": [
     "Pepe ist ein Memecoin, der im April 2023 als ERC-20-Token auf Ethereum herausgegeben wurde; Vorbild ist Pepe der Frosch, die Comicfigur von Matt Furie. Das Team ist anonym, und die offizielle Website erklärt, dass der Token keinen inneren Wert und keine Renditeerwartung hat, nur der Unterhaltung dient und nicht mit Matt Furie verbunden ist. Eine eigene Blockchain gibt es nicht – gehandelt wird auf dem Proof-of-Stake-Netzwerk (PoS) von Ethereum –, und Staking- oder Governance-Funktionen fehlen.",
     "Das Gesamtangebot ist auf rund 420,69 Billionen Token festgelegt; neue werden nicht geschaffen. Beim Start flossen 93,1 % der Token in einen Liquiditätspool auf Uniswap, und die LP-Token wurden verbrannt; die übrigen 6,9 % liegen in einer Multisig-Wallet für künftige Börsenlistings und Liquidität. Eine Transaktionssteuer gibt es nicht, und auf die Eigentümerschaft am Vertrag wurde verzichtet. Wegen dieses riesigen Angebots kostet ein einzelner PEPE nur einen winzigen Bruchteil eines Cents."
    ],
    "applyH": "Indikatoren auf Pepe anwenden",
    "apply": [
     "Volatilität: Zweistellige Prozentbewegungen an einem einzigen Tag sind bei PEPE keine Seltenheit, daher überschreitet der RSI häufig die Grenzen für überkauft und überverkauft. Allein ist der RSI hier sehr verrauscht; filtern Sie ihn mit dem MACD und dem 50/200-Trend.",
     "Angst & Gier: Es handelt sich um einen marktweiten Index mit hohem Bitcoin-Gewicht. Memecoin-Euphorie und Social-Media-Hype werden nicht gesondert erfasst; lesen Sie ihn nur als Markthintergrund.",
     "MVRV: Die Community-API von CoinMetrics liefert kein MVRV für PEPE, daher steht dort immer N/A, und der Score gewichtet die verbleibenden Indikatoren neu.",
     "Mayer-Multiple und Rückgang: Die Schwellen stammen aus über zehn Jahren Bitcoin-Geschichte, die Kurshistorie von PEPE beginnt aber erst im April 2023 und umfasst nur sehr wenige Zyklen. Memecoins fallen oft weit tiefer als Bitcoin, deshalb sollte ein Rückgang von −50 % nicht einfach als „starker Kauf“ gelesen werden.",
     "Preiseinheiten: Die Indikatoren arbeiten mit Verhältnissen (RSI, Preis ÷ 200-Tage-Durchschnitt, % unter dem Hoch), und auch der MACD wird auf den Preis skaliert – ein Kurs mit vielen Nullen verzerrt den Score also nicht."
    ],
    "histH": "Die Preiszyklen von Pepe im Überblick",
    "hist": [
     "April 2023: Getragen vom Memecoin-Rausch direkt nach dem Start überschritt die Marktkapitalisierung binnen weniger Wochen 1 Milliarde US-Dollar.",
     "Mai 2023: Nach Listings bei Binance und anderen großen Börsen gab der Kurs einen guten Teil seines Anstiegs wieder ab.",
     "2024: Mit dem Krypto-Bullenmarkt ging es erneut aufwärts, im Dezember folgte ein neues Allzeithoch.",
     "2025: In der Marktkorrektur lag der Kurs im ersten Halbjahr zeitweise mehr als 70 % unter dem Hoch."
    ],
    "faq": [
     {
      "q": "Gibt es einen eigenen Angst- & Gier-Index für Pepe?",
      "a": "Der Angst- & Gier-Index von Alternative.me bezieht sich auf den Kryptomarkt als Ganzes, mit hohem Bitcoin-Gewicht, nicht auf einzelne Coins. Deshalb weist die Pepe-Seite ihn als marktweiten Index aus. Ob PEPE selbst überhitzt ist, zeigen RSI und Mayer-Multiple, die aus dem PEPE-Kurs berechnet werden."
     },
     {
      "q": "Warum gibt es für Pepe keinen MVRV-Wert?",
      "a": "Für MVRV braucht man den durchschnittlichen On-Chain-Einstandspreis (realisierte Kapitalisierung), und die hier genutzte Community-API von CoinMetrics enthält keine PEPE-Daten. Die Karte zeigt N/A, und der Indikator fließt nicht in den Score ein."
     },
     {
      "q": "Heißt ein hoher Score, dass ich jetzt Pepe kaufen sollte?",
      "a": "Nein. Diese Seite ist keine Anlageberatung; der Score ist ein Richtwert, der den Zustand der Indikatoren zusammenfasst. Memecoins bewegen sich nach Nachfrage und Aufmerksamkeit statt nach Fundamentaldaten wie Cashflow, sodass selbst im STRONG-BUY-Band weitere Verluste durchaus möglich sind. Prüfen Sie, welche Indikatoren dieses Band erzeugen und ob der marktweite Angst- & Gier-Index in dieselbe Richtung zeigt."
     },
     {
      "q": "Der Kurs hat extrem viele Nullen – ist die Berechnung trotzdem genau?",
      "a": "Ja. Der RSI ist ein Verhältnis von Gewinnen zu Verlusten, das Mayer-Multiple teilt den Preis durch seinen 200-Tage-Durchschnitt, der Rückgang ist ein Prozentwert, und der MACD wird vor der Bewertung in ein Verhältnis zum Preis umgerechnet. Wie klein der Stückpreis auch ist, das Ergebnis bleibt gleich."
     },
     {
      "q": "Pepe ist noch jung – sind 200-Tage-Durchschnitt und 365-Tage-Rückgang verlässlich?",
      "a": "Die Daten seit April 2023 reichen für die Berechnung aus. Bei so wenigen durchlaufenen Zyklen gibt es aber kaum Belege dafür, dass an Bitcoin erprobte Schwellen für PEPE dasselbe bedeuten. Nutzen Sie sie eher, um die Trendrichtung zu lesen, als als feste Marken."
     }
    ]
   },
   "it": {
    "title": "Pepe (PEPE): punteggio di acquisto della memecoin e indice di paura e avidità",
    "intro": "Questa pagina analizza l’andamento di Pepe (PEPE), una memecoin su Ethereum, con sette indicatori riassunti in un punteggio di acquisto da 0 a 100. RSI(14), MACD(12·26·9), multiplo di Mayer, ribasso dal massimo a 365 giorni e incrocio delle medie 50/200 si calcolano sul prezzo di PEPE, mentre l’indice di paura e avidità è quello dell’intero mercato cripto. L’MVRV Z-Score mostra N/A perché per PEPE non ci sono dati. Gratuita e senza installazione.",
    "coinH": "Che cos’è Pepe (PEPE)?",
    "coinP": [
     "Pepe è una memecoin lanciata nell’aprile 2023 come token ERC-20 su Ethereum, ispirata a Pepe la rana, il personaggio a fumetti creato da Matt Furie. Il team è anonimo e il sito ufficiale dichiara che il token non ha valore intrinseco né aspettative di rendimento, che serve solo per divertimento e che non è collegato a Matt Furie. Non ha una blockchain propria — viene scambiato sulla rete proof of stake (PoS) di Ethereum — e non offre staking né governance.",
     "L’offerta totale è fissata a circa 420.690 miliardi di token, senza nuove emissioni. Al lancio il 93,1% dei token è stato immesso in un pool di liquidità su Uniswap e i token LP sono stati bruciati; il restante 6,9% è stato custodito in un wallet multisig per futuri listing sugli exchange e per la liquidità. Non ci sono tasse sulle transazioni e si è rinunciato alla proprietà del contratto. È proprio questa offerta enorme a far valere un singolo PEPE una minuscola frazione di centesimo."
    ],
    "applyH": "Applicare gli indicatori a Pepe",
    "apply": [
     "Volatilità: per PEPE non sono rari movimenti a due cifre percentuali in un solo giorno, quindi l’RSI attraversa spesso le soglie di ipercomprato e ipervenduto. Da solo l’RSI è molto rumoroso: filtralo con il MACD e con il trend delle medie 50/200.",
     "Paura e avidità: è un indice dell’intero mercato con un forte peso del Bitcoin. L’euforia per le memecoin e il clamore sui social non vengono misurati a parte, quindi leggilo solo come sfondo del mercato.",
     "MVRV: l’API community di CoinMetrics non fornisce l’MVRV di PEPE, perciò compare sempre N/A e il punteggio ricalibra i pesi degli indicatori rimanenti.",
     "Multiplo di Mayer e ribasso: le soglie derivano da oltre dieci anni di storia del Bitcoin, ma lo storico dei prezzi di PEPE parte solo da aprile 2023 e copre pochissimi cicli. Le memecoin subiscono spesso ribassi molto più profondi del Bitcoin, quindi un ribasso del −50% non va letto alla lettera come «acquisto forte».",
     "Unità di prezzo: gli indicatori lavorano su rapporti (RSI, prezzo ÷ media a 200 giorni, % sotto il massimo) e anche il MACD è rapportato al prezzo, per cui un prezzo con molti zeri non falsa il punteggio."
    ],
    "histH": "I cicli di prezzo di Pepe in sintesi",
    "hist": [
     "Aprile 2023: sull’onda della febbre per le memecoin subito dopo il lancio, supera 1 miliardo di dollari di capitalizzazione in poche settimane.",
     "Maggio 2023: dopo il listing su Binance e su altri grandi exchange, restituisce buona parte dell’impennata.",
     "2024: risale insieme al mercato rialzista delle cripto e a dicembre segna un nuovo massimo storico.",
     "2025: nella correzione del mercato arriva a perdere oltre il 70% dal massimo nel primo semestre."
    ],
    "faq": [
     {
      "q": "Esiste un indice di paura e avidità solo per Pepe?",
      "a": "L’indice di paura e avidità di Alternative.me copre il mercato cripto nel suo complesso, con un forte peso del Bitcoin, e non le singole monete. Per questo la pagina di Pepe lo presenta come indice dell’intero mercato. Per capire se PEPE in sé è surriscaldata, guarda l’RSI e il multiplo di Mayer calcolati sul suo prezzo."
     },
     {
      "q": "Per Pepe c’è un valore MVRV?",
      "a": "No. L’MVRV richiede il costo medio di acquisto on-chain (capitalizzazione realizzata), e l’API community di CoinMetrics usata qui non ha dati su PEPE. La scheda mostra N/A e l’indicatore resta fuori dal punteggio."
     },
     {
      "q": "Un punteggio alto vuol dire che conviene comprare Pepe adesso?",
      "a": "No. Questa pagina non offre consulenza sugli investimenti; il punteggio è un riferimento che riassume lo stato degli indicatori. Le memecoin si muovono in base a domanda e attenzione, non a fondamentali come i flussi di cassa, quindi anche nella fascia STRONG BUY ulteriori cali sono del tutto possibili. Verifica quali indicatori generano quella fascia e se l’indice di paura e avidità del mercato va nella stessa direzione."
     },
     {
      "q": "Il prezzo ha tantissimi zeri: il calcolo resta preciso?",
      "a": "Sì. L’RSI è un rapporto tra rialzi e ribassi, il multiplo di Mayer divide il prezzo per la media a 200 giorni, il ribasso è una percentuale e il MACD viene convertito in rapporto al prezzo prima del punteggio. Per quanto piccolo sia il prezzo unitario, il risultato non cambia."
     },
     {
      "q": "Pepe è giovane: media a 200 giorni e ribasso a 365 giorni sono affidabili?",
      "a": "I dati da aprile 2023 bastano per calcolarli. Ma con così pochi cicli alle spalle ci sono poche prove che soglie collaudate sul Bitcoin abbiano lo stesso significato per PEPE. Meglio usarli per leggere la direzione del trend che come linee rigide da superare."
     }
    ]
   },
   "pt": {
    "title": "Pepe (PEPE): pontuação de compra da memecoin e índice de medo e ganância",
    "intro": "Esta página analisa a evolução do preço da Pepe (PEPE), uma memecoin na Ethereum, com sete indicadores resumidos numa pontuação de compra de 0 a 100. O RSI(14), o MACD(12·26·9), o múltiplo de Mayer, a queda desde a máxima de 365 dias e o cruzamento das médias 50/200 são calculados sobre o preço da PEPE, enquanto o índice de medo e ganância é o de todo o mercado cripto. O MVRV Z-Score aparece como N/A porque não há dados da PEPE. É gratuita e não precisa de instalação.",
    "coinH": "O que é a Pepe (PEPE)?",
    "coinP": [
     "A Pepe é uma memecoin lançada em abril de 2023 como token ERC-20 na Ethereum, inspirada no sapo Pepe, a personagem de banda desenhada criada por Matt Furie. A equipa é anónima e o site oficial afirma que o token não tem valor intrínseco nem expectativa de retorno, que serve apenas para entretenimento e que não está associado a Matt Furie. Não tem blockchain própria — é negociada na rede de prova de participação (PoS) da Ethereum — e não oferece staking nem governança.",
     "A oferta total está fixada em cerca de 420,69 biliões de tokens, sem novas emissões. No lançamento, 93,1% dos tokens foram colocados num pool de liquidez da Uniswap e os tokens LP foram queimados; os restantes 6,9% ficaram numa carteira multisig para futuras listagens em corretoras e liquidez. Não há taxa sobre as transações e a propriedade do contrato foi renunciada. É esta oferta gigantesca que faz com que cada PEPE valha uma fração ínfima de cêntimo."
    ],
    "applyH": "Como aplicar os indicadores à Pepe",
    "apply": [
     "Volatilidade: na PEPE não são raros movimentos de dois dígitos percentuais num só dia, por isso o RSI cruza com frequência as linhas de sobrecompra e sobrevenda. Sozinho, o RSI tem muito ruído; filtre-o com o MACD e a tendência das médias 50/200.",
     "Medo e ganância: é um índice de todo o mercado com grande peso do Bitcoin. O entusiasmo com memecoins e o burburinho nas redes sociais não são medidos à parte, por isso leia-o apenas como pano de fundo do mercado.",
     "MVRV: a API comunitária da CoinMetrics não fornece MVRV para a PEPE, pelo que aparece sempre N/A e a pontuação reajusta os pesos dos indicadores restantes.",
     "Múltiplo de Mayer e queda: os limiares vêm de mais de uma década de história do Bitcoin, mas o histórico de preços da PEPE só começa em abril de 2023 e cobre muito poucos ciclos. As memecoins sofrem muitas vezes quedas bem mais profundas do que o Bitcoin, por isso uma queda de −50% não deve ser lida à letra como «compra forte».",
     "Unidades de preço: os indicadores trabalham com rácios (RSI, preço ÷ média de 200 dias, % abaixo da máxima) e o MACD também é ajustado ao preço, pelo que um preço com muitos zeros não distorce a pontuação."
    ],
    "histH": "Resumo dos ciclos de preço da Pepe",
    "hist": [
     "Abril de 2023: impulsionada pela febre das memecoins logo após o lançamento, ultrapassou mil milhões de dólares de capitalização em poucas semanas.",
     "Maio de 2023: depois de chegar à Binance e a outras grandes corretoras, devolveu boa parte da subida.",
     "2024: voltou a subir com o mercado em alta das criptomoedas e marcou uma nova máxima histórica em dezembro.",
     "2025: em plena correção do mercado, chegou a cair mais de 70% desde a máxima durante o primeiro semestre."
    ],
    "faq": [
     {
      "q": "Existe um índice de medo e ganância exclusivo da Pepe?",
      "a": "O índice de medo e ganância da Alternative.me abrange o mercado cripto no seu conjunto, com grande peso do Bitcoin, e não moedas individuais. Por isso a página da Pepe apresenta-o como índice de todo o mercado. Para saber se a própria PEPE está sobreaquecida, veja o RSI e o múltiplo de Mayer calculados com o seu preço."
     },
     {
      "q": "Porque é que a Pepe não tem valor de MVRV?",
      "a": "O MVRV precisa do custo médio de aquisição on-chain (capitalização realizada), e a API comunitária da CoinMetrics usada nesta página não tem dados da PEPE. O cartão mostra N/A e o indicador fica fora da pontuação."
     },
     {
      "q": "Uma pontuação alta quer dizer que devo comprar Pepe agora?",
      "a": "Não. Esta página não presta aconselhamento de investimento; a pontuação é uma referência que resume o estado dos indicadores. As memecoins movem-se pela procura e pela atenção, não por fundamentais como o fluxo de caixa, por isso mesmo na faixa STRONG BUY novas quedas são perfeitamente possíveis. Verifique que indicadores geram essa faixa e se o índice de medo e ganância do mercado aponta no mesmo sentido."
     },
     {
      "q": "O preço tem imensos zeros: o cálculo continua exato?",
      "a": "Sim. O RSI é uma razão entre subidas e descidas, o múltiplo de Mayer divide o preço pela média de 200 dias, a queda é uma percentagem e o MACD é convertido numa proporção do preço antes da pontuação. Por mais pequeno que seja o preço unitário, o resultado é o mesmo."
     },
     {
      "q": "A Pepe é recente: a média de 200 dias e a queda de 365 dias são fiáveis?",
      "a": "Os dados desde abril de 2023 chegam para os calcular. Mas, com tão poucos ciclos para trás, há pouca evidência de que limiares comprovados no Bitcoin signifiquem o mesmo para a PEPE. É melhor usá-los para ler a direção da tendência do que como linhas rígidas a ultrapassar."
     }
    ]
   },
   "ru": {
    "title": "Пепе (PEPE): оценка момента покупки мемкоина и индекс страха и жадности",
    "intro": "Эта страница разбирает динамику цены Пепе (PEPE) — мемкоина в сети Ethereum — с помощью семи индикаторов и сводит их в оценку момента покупки от 0 до 100. RSI(14), MACD(12·26·9), мультипликатор Майера, просадка от 365-дневного максимума и пересечение средних 50/200 считаются по цене PEPE, а индекс страха и жадности берётся для всего крипторынка. MVRV Z-оценка показывает N/A, потому что данных по PEPE нет. Бесплатно и без установки.",
    "coinH": "Что такое Пепе (PEPE)?",
    "coinP": [
     "Пепе — мемкоин, выпущенный в апреле 2023 года как токен ERC-20 в сети Ethereum; его образ взят у лягушонка Пепе, персонажа комиксов Мэтта Фьюри (Matt Furie). Команда анонимна, а официальный сайт прямо указывает, что у токена нет внутренней ценности и ожидаемой доходности, он создан лишь для развлечения и не связан с Мэттом Фьюри. Собственного блокчейна у него нет — он торгуется в сети Ethereum на доказательстве доли (PoS) — и функций стейкинга или управления тоже нет.",
     "Общее предложение зафиксировано на уровне около 420,69 трлн токенов, дополнительный выпуск не предусмотрен. При запуске 93,1% токенов поместили в пул ликвидности Uniswap, а LP-токены сожгли; оставшиеся 6,9% хранятся в мультиподписном кошельке для будущих листингов на биржах и ликвидности. Налога на транзакции нет, от прав владельца контракта отказались. Именно из-за огромного предложения один PEPE стоит ничтожную долю цента."
    ],
    "applyH": "Как применять индикаторы к Пепе",
    "apply": [
     "Волатильность: для PEPE движения на двузначные проценты за один день не редкость, поэтому RSI часто пересекает границы перекупленности и перепроданности. Сам по себе RSI здесь сильно шумит — отфильтруйте его с помощью MACD и тренда по средним 50/200.",
     "Страх и жадность: это общерыночный индекс с большим весом биткоина. Ажиотаж вокруг мемкоинов и шум в соцсетях отдельно не измеряются, поэтому воспринимайте его лишь как рыночный фон.",
     "MVRV: общедоступный API CoinMetrics не даёт MVRV для PEPE, поэтому там всегда N/A, а оценка перераспределяет веса между оставшимися индикаторами.",
     "Мультипликатор Майера и просадка: пороги выведены из более чем десятилетней истории биткоина, а ценовая история PEPE начинается лишь в апреле 2023 года и охватывает совсем мало циклов. Мемкоины часто проседают гораздо глубже биткоина, поэтому просадку −50% не стоит понимать буквально как «сильную покупку».",
     "Единицы цены: индикаторы работают с соотношениями (RSI, цена ÷ 200-дневная средняя, % ниже максимума), а MACD тоже нормируется на цену, так что цена с множеством нулей не искажает оценку."
    ],
    "histH": "Ценовые циклы Пепе вкратце",
    "hist": [
     "Апрель 2023: на волне ажиотажа вокруг мемкоинов сразу после запуска капитализация за несколько недель превысила 1 млрд долларов.",
     "Май 2023: после листинга на Binance и других крупных биржах токен отдал значительную часть роста.",
     "2024: снова вырос вместе с бычьим крипторынком и в декабре обновил исторический максимум.",
     "2025: на фоне рыночной коррекции в первом полугодии в какой-то момент опустился более чем на 70% от пика."
    ],
    "faq": [
     {
      "q": "Есть ли отдельный индекс страха и жадности для Пепе?",
      "a": "Индекс страха и жадности Alternative.me охватывает крипторынок целиком, с большим весом биткоина, а не отдельные монеты. Поэтому на странице Пепе он обозначен как общерыночный. Чтобы понять, перегрет ли сам PEPE, смотрите на RSI и мультипликатор Майера, рассчитанные по его цене."
     },
     {
      "q": "Есть ли у Пепе значение MVRV?",
      "a": "Нет. Для MVRV нужна средняя ончейн-цена приобретения (реализованная капитализация), а в общедоступном API CoinMetrics, который использует эта страница, данных по PEPE нет. На карточке стоит N/A, и индикатор не входит в оценку."
     },
     {
      "q": "Высокая оценка означает, что пора покупать Пепе?",
      "a": "Нет. Эта страница не даёт инвестиционных советов; оценка — лишь ориентир, обобщающий состояние индикаторов. Мемкоины движутся под влиянием спроса и внимания, а не фундаментальных факторов вроде денежного потока, поэтому даже в зоне STRONG BUY дальнейшее падение вполне возможно. Проверьте, какие индикаторы сформировали эту зону и совпадает ли с ней направление общерыночного индекса страха и жадности."
     },
     {
      "q": "В цене очень много нулей — расчёт остаётся точным?",
      "a": "Да. RSI — это соотношение роста и падения, мультипликатор Майера делит цену на 200-дневную среднюю, просадка выражается в процентах, а MACD перед оценкой переводится в долю от цены. Каким бы малым ни был номинал, результат не меняется."
     },
     {
      "q": "Пепе — молодая монета. Можно ли доверять 200-дневной средней и 365-дневной просадке?",
      "a": "Данных с апреля 2023 года достаточно, чтобы их рассчитать. Но циклов позади слишком мало, и почти нет подтверждений того, что пороги, проверенные на биткоине, значат для PEPE то же самое. Лучше использовать их для оценки направления тренда, а не как жёсткие рубежи."
     }
    ]
   },
   "nl": {
    "title": "Pepe (PEPE): koopmoment-score voor de memecoin en Angst- & Hebzucht-index",
    "intro": "Deze pagina analyseert het koersverloop van Pepe (PEPE), een memecoin op Ethereum, met zeven indicatoren en vat die samen in een koopmoment-score van 0 tot 100. RSI(14), MACD(12·26·9), de Mayer Multiple, de daling vanaf de 365-daagse top en de kruising van de 50/200-gemiddelden worden berekend op de koers van PEPE, terwijl de Angst- & Hebzucht-index de waarde voor de hele cryptomarkt is. De MVRV Z-score toont N/A omdat er geen gegevens voor PEPE zijn. Gratis en zonder installatie.",
    "coinH": "Wat is Pepe (PEPE)?",
    "coinP": [
     "Pepe is een memecoin die in april 2023 als ERC-20-token op Ethereum werd uitgegeven, geïnspireerd op Pepe de Kikker, het stripfiguurtje van Matt Furie. Het team is anoniem, en de officiële website stelt dat de token geen intrinsieke waarde heeft en geen rendement belooft, alleen voor vermaak is bedoeld en niet gelieerd is aan Matt Furie. Een eigen blockchain heeft Pepe niet — de token wordt verhandeld op het proof-of-stake-netwerk (PoS) van Ethereum — en staking of governance ontbreekt.",
     "Het totale aanbod ligt vast op ongeveer 420,69 biljoen tokens; er komen er geen bij. Bij de lancering ging 93,1% van de tokens naar een liquiditeitspool op Uniswap en werden de LP-tokens verbrand; de overige 6,9% staat in een multisig-wallet voor toekomstige beursnoteringen en liquiditeit. Er geldt geen transactiebelasting en het eigenaarschap van het contract is opgegeven. Door dat gigantische aanbod is één PEPE slechts een piepklein deel van een cent waard."
    ],
    "applyH": "Indicatoren toepassen op Pepe",
    "apply": [
     "Volatiliteit: koersbewegingen van dubbele cijfers in procenten op één dag zijn bij PEPE niet ongewoon, waardoor de RSI vaak de grenzen voor overbought en oversold passeert. Op zichzelf is de RSI hier erg ruizig; filter hem met de MACD en de trend van de 50/200-gemiddelden.",
     "Angst & hebzucht: dit is een marktbrede index met een zwaar gewicht voor Bitcoin. Memecoin-hypes en ophef op sociale media worden niet apart gemeten, dus lees hem alleen als achtergrond van de markt.",
     "MVRV: de community-API van CoinMetrics levert geen MVRV voor PEPE, waardoor er altijd N/A staat en de score de gewichten van de resterende indicatoren opnieuw verdeelt.",
     "Mayer Multiple en daling: de drempels komen uit meer dan tien jaar Bitcoin-geschiedenis, maar de koersgeschiedenis van PEPE begint pas in april 2023 en beslaat maar heel weinig cycli. Memecoins dalen vaak veel dieper dan Bitcoin, dus een daling van −50% moet je niet zomaar lezen als ‘sterk kopen’.",
     "Prijseenheden: de indicatoren werken met verhoudingen (RSI, prijs ÷ 200-daags gemiddelde, % onder de top) en ook de MACD wordt op de prijs geschaald, dus een koers met veel nullen vertekent de score niet."
    ],
    "histH": "De prijscycli van Pepe in het kort",
    "hist": [
     "April 2023: meegesleept door de memecoin-gekte direct na de lancering passeerde de marktkapitalisatie binnen enkele weken 1 miljard dollar.",
     "Mei 2023: na noteringen op Binance en andere grote beurzen gaf de koers een flink deel van de stijging weer prijs.",
     "2024: steeg opnieuw met de crypto-bullmarkt en zette in december een nieuwe recordkoers neer.",
     "2025: tijdens de marktcorrectie stond de koers in de eerste jaarhelft op enig moment meer dan 70% onder de top."
    ],
    "faq": [
     {
      "q": "Bestaat er een eigen Angst- & Hebzucht-index voor Pepe?",
      "a": "De Angst- & Hebzucht-index van Alternative.me gaat over de cryptomarkt als geheel, met een zwaar gewicht voor Bitcoin, en niet over afzonderlijke munten. Daarom presenteert de Pepe-pagina hem als marktbrede index. Of PEPE zelf oververhit is, lees je af aan de RSI en de Mayer Multiple die op de koers van PEPE zijn berekend."
     },
     {
      "q": "Heeft Pepe een MVRV-waarde?",
      "a": "Nee. Voor MVRV is de gemiddelde on-chain-aankoopprijs (gerealiseerde kapitalisatie) nodig, en de community-API van CoinMetrics die deze pagina gebruikt, heeft geen gegevens over PEPE. De kaart toont N/A en de indicator telt niet mee in de score."
     },
     {
      "q": "Betekent een hoge score dat ik nu Pepe moet kopen?",
      "a": "Nee. Deze pagina geeft geen beleggingsadvies; de score is een richtpunt dat de stand van de indicatoren samenvat. Memecoins bewegen op vraag en aandacht, niet op fundamentals zoals kasstromen, dus zelfs in de STRONG BUY-band is een verdere daling heel goed mogelijk. Kijk welke indicatoren die band opleveren en of de marktbrede Angst- & Hebzucht-index dezelfde kant op wijst."
     },
     {
      "q": "De koers heeft ontzettend veel nullen: klopt de berekening nog?",
      "a": "Ja. De RSI is een verhouding tussen stijgingen en dalingen, de Mayer Multiple deelt de prijs door het 200-daags gemiddelde, de daling is een percentage en de MACD wordt vóór de score omgezet in een verhouding tot de prijs. Hoe klein de prijs per stuk ook is, de uitkomst blijft gelijk."
     },
     {
      "q": "Pepe is nog jong: zijn het 200-daags gemiddelde en de 365-daagse daling betrouwbaar?",
      "a": "De gegevens sinds april 2023 volstaan om ze te berekenen. Maar met zo weinig cycli achter de rug is er weinig bewijs dat drempels die bij Bitcoin hun waarde bewezen, voor PEPE hetzelfde betekenen. Gebruik ze liever om de richting van de trend te lezen dan als harde grenzen."
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
