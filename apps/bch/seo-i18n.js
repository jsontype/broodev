/* 하단 SEO 본문 다국어 데이터 + 렌더러. index.html(광고) / member/index.html(구독자) 공유.
   언어 전환 시 window.renderSEO(lang) 호출 → section.seo 를 해당 언어로 다시 그림.
   기본 정적 HTML(한국어)은 무JS 크롤러용 폴백으로 남겨두고, JS 실행 시 현재 언어로 교체. */
(function () {
  var SEO = {
    ko: {
      title: '비트코인캐시 공포·탐욕 지수 & 매수 타이밍 점수',
      intro: '비트코인캐시 공포지수(공포·탐욕 지수, Fear & Greed Index)를 포함한 7개 실시간 지표를 합성해 “지금이 매수 타이밍인가?”를 0~100 점수로 보여주는 무료 대시보드입니다. 설치 없이 브라우저에서 바로 실행되며 13개 언어를 지원합니다.',
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
        { q: '공포지수가 낮으면 비트코인캐시을 사야 하나요?', a: '극단적 공포는 역사적으로 분할 매수 기회였던 경우가 많지만, 공포지수 하나만 보면 “떨어지는 칼날”을 잡을 위험이 있습니다. 본 점수는 RSI·MACD·마이어 배수·낙폭·이동평균 크로스를 함께 보고, 하락 추세에서는 점수를 보수적으로 낮춥니다.' },
        { q: '매수 타이밍 점수는 어떻게 계산되나요?', a: '7개 지표를 각각 0~100 부분점수로 환산해 가중 합성합니다. 결과는 0~100이며 5단계 밴드로 표시됩니다.' },
        { q: '무료인가요? 설치가 필요한가요?', a: '완전 무료이며 설치가 필요 없습니다. CoinGecko·Binance·Alternative.me 공개 API에서 실시간 데이터를 가져옵니다.' },
        { q: '공포지수와 매수 타이밍 점수는 무엇이 다른가요?', a: '공포지수는 심리 한 가지 지표(0~100)이고, 매수 타이밍 점수는 공포지수를 포함한 7개 지표를 합성한 종합 점수(0~100)입니다.' },
        { q: '공포지수 데이터는 어디서 가져오나요? 얼마나 자주 갱신되나요?', a: '공포·탐욕 지수는 Alternative.me, 가격·일봉은 CoinGecko·Binance, 온체인 지표는 CoinMetrics 공개 API에서 실시간으로 가져옵니다. 화면은 약 1분 주기로 자동 갱신됩니다.' },
        { q: '비트코인캐시 지금 사도 되나요?', a: '정답은 없지만, 매수 타이밍 점수(0~100)로 현재 시장이 과매도·공포 구간인지 과열·탐욕 구간인지 객관적으로 가늠할 수 있습니다. 장기(역발상) 탭 기준 점수가 높을수록 공포·저평가가 겹친 분할 매수 우호 구간, 낮을수록 과열 경계 구간입니다. 참고 신호일 뿐 투자 자문이 아닙니다.' },
        { q: '단기와 장기 매수 타이밍은 어떻게 다른가요?', a: '점수는 단기·장기 두 탭으로 나뉩니다. 단기(모멘텀)는 약 1~3개월 추세추종 관점으로 상승 추세가 강할수록 높고, 장기(역발상)는 약 1년 이상 사이클 관점으로 공포·저평가일수록 높습니다. 2017년 이후 백테스트에서 단기는 모멘텀, 장기는 역발상 방향이 더 잘 맞았습니다.' },
        { q: 'BOTTOM RADAR(바닥 점수)는 무엇인가요?', a: 'MVRV Z-점수 같은 온체인 지표로 시가총액이 투자자 평균 매수원가 대비 어디에 있는지 재서, 역사적 바닥 구간과의 근접도를 0~100으로 보여주는 보조 게이지입니다. 계산 근거는 “비트코인 바닥” 해설 페이지에 공개되어 있습니다.' }
      ],
      disclaimer: '⚠ 본 점수는 공개 지표를 합성한 참고 신호이며 투자 자문이 아닙니다. 모든 투자 판단과 책임은 이용자 본인에게 있습니다.'
    },
    en: {
      title: 'Bitcoin Cash Fear & Greed Index & Buy-Timing Score',
      intro: 'A free dashboard that synthesizes 7 real-time indicators — including the Bitcoin Cash Fear & Greed Index — into a 0–100 “is now a good time to buy?” score. Runs in your browser with no install, in 13 languages.',
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
        { q: 'Should I buy Bitcoin Cash when the index is low?', a: 'Extreme fear has often been an accumulation opportunity, but relying on the index alone risks catching a falling knife. This score also weighs RSI, MACD, Mayer Multiple, drawdown and moving-average crosses, and lowers the score conservatively in downtrends.' },
        { q: 'How is the buy-timing score calculated?', a: 'Each of the 7 indicators is converted to a 0–100 sub-score and weighted together. The result is 0–100, shown in 5 bands.' },
        { q: 'Is it free? Do I need to install anything?', a: 'It is completely free with no install. Real-time data comes from CoinGecko, Binance and Alternative.me public APIs.' },
        { q: 'How is the index different from the buy-timing score?', a: 'The index is a single sentiment metric (0–100); the buy-timing score is a composite of 7 indicators including the index (0–100).' },
        { q: 'Where does the data come from, and how often does it refresh?', a: 'The Fear & Greed Index comes from Alternative.me, prices and daily candles from the CoinGecko and Binance public APIs, and on-chain metrics from CoinMetrics. The screen auto-refreshes roughly every minute.' },
        { q: 'Should I buy Bitcoin Cash right now?', a: 'There is no single answer, but the buy-timing score (0–100) gives an objective read on whether the market is in an oversold/fear zone or an overheated/greed zone. On the long-term (contrarian) tab, higher scores mark zones where fear and undervaluation overlap — historically favorable for DCA — while lower scores warn of overheating. It is a reference signal, not investment advice.' },
        { q: 'How do short-term and long-term buy timing differ?', a: 'The score is split into two tabs. Short-term (momentum) takes a 1–3 month trend-following view and rises with strong uptrends; long-term (contrarian) takes a 1-year-plus cycle view and rises with fear and undervaluation. In backtests since 2017, momentum worked better short-term and contrarian worked better long-term.' },
        { q: 'What is the BOTTOM RADAR (bottom score)?', a: 'A secondary gauge that uses on-chain metrics such as the MVRV Z-Score to measure where market cap sits relative to investors’ average cost basis, showing proximity to historic bottom zones on a 0–100 scale. The full calculation is published on the “Bitcoin bottom” guide page.' }
      ],
      disclaimer: '⚠ This score is a reference signal built from public indicators, not investment advice. All decisions and responsibility are your own.'
    },
    ja: {
      title: 'ビットコインキャッシュ 恐怖・強欲指数 & 買い時スコア',
      intro: 'ビットコインキャッシュの恐怖・強欲指数（Fear & Greed Index）を含む7つのリアルタイム指標を合成し、「今が買い時か？」を0〜100のスコアで示す無料ダッシュボードです。インストール不要でブラウザから即実行、13言語対応。',
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
        { q: '指数が低ければビットコインキャッシュを買うべき？', a: '極端な恐怖は歴史的に分割買いの好機だったことが多いですが、指数だけに頼ると「落ちるナイフ」を掴む危険があります。本スコアはRSI・MACD・マイヤー倍率・下落率・移動平均クロスも合わせて見て、下落トレンドでは保守的にスコアを下げます。' },
        { q: '買い時スコアはどう計算される？', a: '7指標をそれぞれ0〜100の部分スコアに換算し加重合成します。結果は0〜100で、5段階バンドで表示します。' },
        { q: '無料？インストールは必要？', a: '完全無料・インストール不要です。CoinGecko・Binance・Alternative.me の公開APIからリアルタイムデータを取得します。' },
        { q: '指数と買い時スコアの違いは？', a: '指数は心理1指標(0〜100)、買い時スコアは指数を含む7指標を合成した総合スコア(0〜100)です。' },
        { q: 'データはどこから？更新頻度は？', a: '恐怖・強欲指数はAlternative.me、価格・日足はCoinGecko・Binance、オンチェーン指標はCoinMetricsの公開APIからリアルタイムで取得します。画面は約1分ごとに自動更新されます。' },
        { q: 'ビットコインキャッシュは今買ってもいい？', a: '正解はありませんが、買い時スコア(0〜100)で現在の市場が売られすぎ・恐怖圏か、過熱・強欲圏かを客観的に測れます。長期（逆張り）タブではスコアが高いほど恐怖と割安が重なる分割買いに有利な圏、低いほど過熱警戒圏です。参考シグナルであり投資助言ではありません。' },
        { q: '短期と長期の買い時はどう違う？', a: 'スコアは短期・長期の2タブに分かれます。短期（モメンタム）は約1〜3か月のトレンドフォロー視点で上昇トレンドが強いほど高く、長期（逆張り）は約1年以上のサイクル視点で恐怖・割安なほど高くなります。2017年以降のバックテストでは、短期はモメンタム、長期は逆張りの方向がより有効でした。' },
        { q: 'BOTTOM RADAR（底値スコア）とは？', a: 'MVRV Zスコアなどのオンチェーン指標で、時価総額が投資家の平均取得単価に対してどの位置にあるかを測り、歴史的な底値圏への近さを0〜100で示す補助ゲージです。計算根拠は「ビットコインの底」解説ページで公開しています。' }
      ],
      disclaimer: '⚠ 本スコアは公開指標を合成した参考シグナルであり、投資助言ではありません。すべての判断と責任は利用者ご自身にあります。'
    },
    zh: {
      title: '比特币现金恐惧与贪婪指数 & 买入时机评分',
      intro: '一个免费仪表板，将包括比特币现金恐惧与贪婪指数（Fear & Greed Index）在内的7个实时指标合成为0–100的“现在是买入时机吗？”评分。无需安装，浏览器即开即用，支持13种语言。',
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
        { q: '指数低就该买比特币现金吗？', a: '极度恐惧在历史上常是分批买入良机，但只看指数有“接飞刀”的风险。本评分同时参考RSI、MACD、梅耶倍数、回撤与均线交叉，并在下跌趋势中保守下调评分。' },
        { q: '买入时机评分如何计算？', a: '将7个指标各自换算为0–100分项评分并加权合成。结果为0–100，以5档显示。' },
        { q: '免费吗？需要安装吗？', a: '完全免费、无需安装。实时数据来自 CoinGecko、Binance、Alternative.me 公开API。' },
        { q: '指数与买入时机评分有何不同？', a: '指数是单一情绪指标(0–100)；买入时机评分是包含该指数在内的7指标综合评分(0–100)。' },
        { q: '数据来自哪里？多久更新一次？', a: '恐惧与贪婪指数来自Alternative.me，价格与日K来自CoinGecko和Binance公开API，链上指标来自CoinMetrics。页面约每1分钟自动刷新。' },
        { q: '现在可以买比特币现金吗？', a: '没有标准答案，但买入时机评分(0–100)能客观判断当前市场处于超卖·恐惧区还是过热·贪婪区。在长期（逆向）标签页中，评分越高代表恐惧与低估重叠、历史上利于分批买入的区间；越低则是过热警戒区。仅供参考，并非投资建议。' },
        { q: '短期和长期买入时机有何不同？', a: '评分分为短期、长期两个标签页。短期（动量）以约1–3个月的趋势跟随视角，上升趋势越强评分越高；长期（逆向）以约1年以上的周期视角，越恐惧、越低估评分越高。2017年以来的回测显示，短期动量、长期逆向的方向更有效。' },
        { q: 'BOTTOM RADAR（底部评分）是什么？', a: '一个辅助仪表，利用MVRV Z分数等链上指标衡量市值相对投资者平均持仓成本的位置，以0–100显示与历史底部区间的接近程度。计算依据在“比特币底部”解读页面公开。' }
      ],
      disclaimer: '⚠ 本评分由公开指标合成，仅供参考，并非投资建议。一切投资决定与责任由用户自负。'
    },
    'zh-Hant': {
      title: '比特幣現金恐懼與貪婪指數 & 買入時機評分',
      intro: '一個免費儀表板，將包括比特幣現金恐懼與貪婪指數（Fear & Greed Index）在內的7個即時指標合成為0–100的「現在是買入時機嗎？」評分。免安裝、瀏覽器即開即用，支援13種語言。',
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
        { q: '指數低就該買比特幣現金嗎？', a: '極度恐懼在歷史上常是分批買入良機，但只看指數有「接飛刀」的風險。本評分同時參考RSI、MACD、梅耶倍數、回撤與均線交叉，並在下跌趨勢中保守下調評分。' },
        { q: '買入時機評分如何計算？', a: '將7個指標各自換算為0–100分項評分並加權合成。結果為0–100，以5檔顯示。' },
        { q: '免費嗎？需要安裝嗎？', a: '完全免費、免安裝。即時資料來自 CoinGecko、Binance、Alternative.me 公開API。' },
        { q: '指數與買入時機評分有何不同？', a: '指數是單一情緒指標(0–100)；買入時機評分是包含該指數在內的7指標綜合評分(0–100)。' },
        { q: '資料來自哪裡？多久更新一次？', a: '恐懼與貪婪指數來自Alternative.me，價格與日K來自CoinGecko和Binance公開API，鏈上指標來自CoinMetrics。頁面約每1分鐘自動重新整理。' },
        { q: '現在可以買比特幣現金嗎？', a: '沒有標準答案，但買入時機評分(0–100)能客觀判斷當前市場處於超賣·恐懼區還是過熱·貪婪區。在長期（逆向）分頁中，評分越高代表恐懼與低估重疊、歷史上利於分批買入的區間；越低則是過熱警戒區。僅供參考，並非投資建議。' },
        { q: '短期和長期買入時機有何不同？', a: '評分分為短期、長期兩個分頁。短期（動量）以約1–3個月的趨勢跟隨視角，上升趨勢越強評分越高；長期（逆向）以約1年以上的週期視角，越恐懼、越低估評分越高。2017年以來的回測顯示，短期動量、長期逆向的方向更有效。' },
        { q: 'BOTTOM RADAR（底部評分）是什麼？', a: '一個輔助儀表，利用MVRV Z分數等鏈上指標衡量市值相對投資者平均持倉成本的位置，以0–100顯示與歷史底部區間的接近程度。計算依據在「比特幣底部」解說頁面公開。' }
      ],
      disclaimer: '⚠ 本評分由公開指標合成，僅供參考，並非投資建議。一切投資決定與責任由用戶自負。'
    },
    es: {
      title: 'Índice de miedo y codicia de Bitcoin Cash y puntuación de momento de compra',
      intro: 'Un panel gratuito que sintetiza 7 indicadores en tiempo real —incluido el índice de miedo y codicia de Bitcoin Cash— en una puntuación de 0 a 100 sobre «¿es buen momento para comprar?». Funciona en el navegador sin instalación, en 13 idiomas.',
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
        { q: '¿Debo comprar Bitcoin Cash cuando el índice está bajo?', a: 'El miedo extremo ha sido a menudo una oportunidad de acumulación, pero fiarse solo del índice arriesga «atrapar un cuchillo que cae». Esta puntuación también pondera RSI, MACD, múltiplo de Mayer, caída y cruces de medias, y la reduce de forma conservadora en tendencias bajistas.' },
        { q: '¿Cómo se calcula la puntuación de compra?', a: 'Cada uno de los 7 indicadores se convierte en una subpuntuación de 0 a 100 y se pondera. El resultado es 0–100, mostrado en 5 bandas.' },
        { q: '¿Es gratis? ¿Necesito instalar algo?', a: 'Es totalmente gratis y sin instalación. Los datos en tiempo real provienen de las API públicas de CoinGecko, Binance y Alternative.me.' },
        { q: '¿En qué se diferencia el índice de la puntuación de compra?', a: 'El índice es una sola métrica de sentimiento (0–100); la puntuación de compra es un compuesto de 7 indicadores que incluye el índice (0–100).' },
        { q: '¿De dónde vienen los datos y con qué frecuencia se actualizan?', a: 'El índice de miedo y codicia viene de Alternative.me; los precios y velas diarias, de las API públicas de CoinGecko y Binance; y las métricas on-chain, de CoinMetrics. La pantalla se actualiza automáticamente cada minuto aproximadamente.' },
        { q: '¿Debería comprar Bitcoin Cash ahora mismo?', a: 'No hay una respuesta única, pero la puntuación de compra (0–100) permite valorar objetivamente si el mercado está en zona de sobreventa/miedo o de recalentamiento/codicia. En la pestaña de largo plazo (contraria), puntuaciones altas marcan zonas donde coinciden miedo e infravaloración —históricamente favorables al DCA—, y las bajas avisan de recalentamiento. Es una señal de referencia, no asesoramiento de inversión.' },
        { q: '¿En qué se diferencian el timing de corto y de largo plazo?', a: 'La puntuación se divide en dos pestañas. El corto plazo (momentum) adopta una visión de seguimiento de tendencia de 1–3 meses y sube con tendencias alcistas fuertes; el largo plazo (contrario) adopta una visión de ciclo de más de un año y sube con miedo e infravaloración. En backtests desde 2017, el momentum funcionó mejor a corto y lo contrario a largo.' },
        { q: '¿Qué es el BOTTOM RADAR (puntuación de suelo)?', a: 'Un indicador auxiliar que usa métricas on-chain como el MVRV Z-Score para medir dónde está la capitalización respecto al coste medio de los inversores, mostrando la cercanía a zonas de suelo históricas en una escala de 0 a 100. El cálculo completo está publicado en la guía «suelo de Bitcoin».' }
      ],
      disclaimer: '⚠ Esta puntuación es una señal de referencia a partir de indicadores públicos, no asesoramiento de inversión. Todas las decisiones y la responsabilidad son tuyas.'
    },
    fr: {
      title: 'Indice de peur et d’avidité Bitcoin Cash et score de timing d’achat',
      intro: 'Un tableau de bord gratuit qui synthétise 7 indicateurs en temps réel — dont l’indice de peur et d’avidité Bitcoin Cash — en un score de 0 à 100 « est-ce le bon moment pour acheter ? ». Fonctionne dans le navigateur sans installation, en 13 langues.',
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
        { q: 'Dois-je acheter du Bitcoin Cash quand l’indice est bas ?', a: 'La peur extrême a souvent été une opportunité d’accumulation, mais se fier au seul indice risque d’« attraper un couteau qui tombe ». Ce score pondère aussi RSI, MACD, multiple de Mayer, repli et croisements de moyennes, et le réduit prudemment en tendance baissière.' },
        { q: 'Comment le score de timing d’achat est-il calculé ?', a: 'Chacun des 7 indicateurs est converti en sous-score de 0 à 100 puis pondéré. Le résultat est 0–100, affiché en 5 bandes.' },
        { q: 'Est-ce gratuit ? Faut-il installer quelque chose ?', a: 'C’est entièrement gratuit et sans installation. Les données en temps réel proviennent des API publiques de CoinGecko, Binance et Alternative.me.' },
        { q: 'Quelle différence entre l’indice et le score de timing d’achat ?', a: 'L’indice est une seule mesure de sentiment (0–100) ; le score de timing d’achat est un composite de 7 indicateurs incluant l’indice (0–100).' },
        { q: 'D’où viennent les données et à quelle fréquence sont-elles actualisées ?', a: 'L’indice de peur et d’avidité vient d’Alternative.me ; les prix et bougies journalières, des API publiques de CoinGecko et Binance ; et les métriques on-chain, de CoinMetrics. L’écran se rafraîchit automatiquement environ chaque minute.' },
        { q: 'Dois-je acheter du Bitcoin Cash maintenant ?', a: 'Il n’y a pas de réponse unique, mais le score de timing d’achat (0–100) permet d’évaluer objectivement si le marché est en zone de survente/peur ou de surchauffe/avidité. Dans l’onglet long terme (contrarian), des scores élevés marquent des zones où peur et sous-évaluation se recoupent — historiquement favorables au DCA — tandis que des scores bas signalent la surchauffe. C’est un signal de référence, pas un conseil en investissement.' },
        { q: 'Quelle différence entre le timing court terme et long terme ?', a: 'Le score est divisé en deux onglets. Le court terme (momentum) adopte une vue de suivi de tendance sur 1 à 3 mois et monte avec les tendances haussières fortes ; le long terme (contrarian) adopte une vue de cycle d’un an et plus et monte avec la peur et la sous-évaluation. Dans les backtests depuis 2017, le momentum a mieux fonctionné à court terme et le contrarian à long terme.' },
        { q: 'Qu’est-ce que le BOTTOM RADAR (score de plancher) ?', a: 'Une jauge auxiliaire qui utilise des métriques on-chain comme le MVRV Z-Score pour mesurer où se situe la capitalisation par rapport au coût moyen des investisseurs, en montrant la proximité des zones de plancher historiques sur une échelle de 0 à 100. Le calcul complet est publié sur la page « plancher du Bitcoin ».' }
      ],
      disclaimer: '⚠ Ce score est un signal de référence issu d’indicateurs publics, pas un conseil en investissement. Toutes les décisions et la responsabilité vous appartiennent.'
    },
    de: {
      title: 'Bitcoin Cash Angst- & Gier-Index & Kaufzeitpunkt-Score',
      intro: 'Ein kostenloses Dashboard, das 7 Echtzeit-Indikatoren — inkl. Bitcoin Cash Angst- & Gier-Index — zu einem 0–100-Score „Ist jetzt ein guter Kaufzeitpunkt?“ zusammenführt. Läuft im Browser ohne Installation, in 13 Sprachen.',
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
        { q: 'Soll ich Bitcoin Cash kaufen, wenn der Index niedrig ist?', a: 'Extreme Angst war historisch oft eine Akkumulationschance, doch sich allein auf den Index zu verlassen, birgt das Risiko, „ins fallende Messer zu greifen“. Dieser Score gewichtet auch RSI, MACD, Mayer-Multiple, Rückgang und MA-Kreuzungen und senkt den Wert in Abwärtstrends konservativ.' },
        { q: 'Wie wird der Kaufzeitpunkt-Score berechnet?', a: 'Jeder der 7 Indikatoren wird in einen 0–100-Teil-Score umgerechnet und gewichtet. Das Ergebnis ist 0–100, in 5 Bändern dargestellt.' },
        { q: 'Ist es kostenlos? Muss ich etwas installieren?', a: 'Es ist völlig kostenlos und ohne Installation. Echtzeitdaten stammen aus den öffentlichen APIs von CoinGecko, Binance und Alternative.me.' },
        { q: 'Wie unterscheidet sich der Index vom Kaufzeitpunkt-Score?', a: 'Der Index ist eine einzelne Stimmungskennzahl (0–100); der Kaufzeitpunkt-Score ist ein Verbund aus 7 Indikatoren inkl. Index (0–100).' },
        { q: 'Woher stammen die Daten und wie oft werden sie aktualisiert?', a: 'Der Angst- & Gier-Index stammt von Alternative.me, Preise und Tageskerzen von den öffentlichen APIs von CoinGecko und Binance, On-Chain-Metriken von CoinMetrics. Der Bildschirm aktualisiert sich etwa jede Minute automatisch.' },
        { q: 'Sollte ich Bitcoin Cash jetzt kaufen?', a: 'Eine eindeutige Antwort gibt es nicht, aber der Kaufzeitpunkt-Score (0–100) zeigt objektiv, ob der Markt in einer überverkauften Angst-Zone oder einer überhitzten Gier-Zone steckt. Auf dem Langfrist-Tab (antizyklisch) markieren hohe Werte Zonen, in denen Angst und Unterbewertung zusammenfallen — historisch günstig für DCA —, niedrige warnen vor Überhitzung. Ein Referenzsignal, keine Anlageberatung.' },
        { q: 'Wie unterscheiden sich kurz- und langfristiges Kauftiming?', a: 'Der Score ist in zwei Tabs geteilt. Kurzfristig (Momentum) folgt einer Trendfolge-Sicht von 1–3 Monaten und steigt mit starken Aufwärtstrends; langfristig (antizyklisch) folgt einer Zyklus-Sicht von über einem Jahr und steigt mit Angst und Unterbewertung. In Backtests seit 2017 funktionierte kurzfristig Momentum und langfristig die antizyklische Richtung besser.' },
        { q: 'Was ist der BOTTOM RADAR (Boden-Score)?', a: 'Eine Zusatzanzeige, die mit On-Chain-Metriken wie den MVRV Z-Score misst, wo die Marktkapitalisierung relativ zum durchschnittlichen Einstandskurs der Anleger liegt, und die Nähe zu historischen Bodenzonen auf einer Skala von 0–100 zeigt. Die vollständige Berechnung ist auf der Seite „Bitcoin-Boden“ veröffentlicht.' }
      ],
      disclaimer: '⚠ Dieser Score ist ein Referenzsignal aus öffentlichen Indikatoren, keine Anlageberatung. Alle Entscheidungen und die Verantwortung liegen bei Ihnen.'
    },
    it: {
      title: 'Indice di paura e avidità Bitcoin Cash e punteggio di timing d’acquisto',
      intro: 'Una dashboard gratuita che sintetizza 7 indicatori in tempo reale — incluso l’indice di paura e avidità di Bitcoin Cash — in un punteggio 0–100 «è il momento giusto per comprare?». Funziona nel browser senza installazione, in 13 lingue.',
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
        { q: 'Dovrei comprare Bitcoin Cash quando l’indice è basso?', a: 'La paura estrema è stata spesso un’occasione di accumulo, ma affidarsi solo all’indice rischia di «prendere un coltello che cade». Questo punteggio pesa anche RSI, MACD, multiplo di Mayer, ribasso e incroci di medie, e lo riduce in modo prudente nei trend ribassisti.' },
        { q: 'Come si calcola il punteggio d’acquisto?', a: 'Ciascuno dei 7 indicatori è convertito in un sotto-punteggio 0–100 e ponderato. Il risultato è 0–100, mostrato in 5 bande.' },
        { q: 'È gratis? Serve installare qualcosa?', a: 'È completamente gratis e senza installazione. I dati in tempo reale provengono dalle API pubbliche di CoinGecko, Binance e Alternative.me.' },
        { q: 'Che differenza c’è tra l’indice e il punteggio d’acquisto?', a: 'L’indice è una singola misura di sentiment (0–100); il punteggio d’acquisto è un composito dei 7 indicatori incluso l’indice (0–100).' },
        { q: 'Da dove vengono i dati e con che frequenza si aggiornano?', a: 'L’indice di paura e avidità viene da Alternative.me; prezzi e candele giornaliere dalle API pubbliche di CoinGecko e Binance; le metriche on-chain da CoinMetrics. Lo schermo si aggiorna automaticamente circa ogni minuto.' },
        { q: 'Dovrei comprare Bitcoin Cash adesso?', a: 'Non c’è una risposta unica, ma il punteggio d’acquisto (0–100) permette di valutare oggettivamente se il mercato è in zona ipervenduto/paura o surriscaldato/avidità. Nella scheda a lungo termine (contrarian), punteggi alti indicano zone in cui paura e sottovalutazione coincidono — storicamente favorevoli al PAC — mentre punteggi bassi avvertono del surriscaldamento. È un segnale di riferimento, non consulenza d’investimento.' },
        { q: 'Che differenza c’è tra timing a breve e a lungo termine?', a: 'Il punteggio è diviso in due schede. Il breve termine (momentum) adotta una visione trend-following di 1–3 mesi e sale con trend rialzisti forti; il lungo termine (contrarian) adotta una visione di ciclo oltre l’anno e sale con paura e sottovalutazione. Nei backtest dal 2017, il momentum ha funzionato meglio nel breve e il contrarian nel lungo.' },
        { q: 'Cos’è il BOTTOM RADAR (punteggio di minimo)?', a: 'Un indicatore ausiliario che usa metriche on-chain come l’MVRV Z-Score per misurare dove si trova la capitalizzazione rispetto al costo medio degli investitori, mostrando la vicinanza alle zone di minimo storiche su una scala 0–100. Il calcolo completo è pubblicato nella guida «minimo di Bitcoin».' }
      ],
      disclaimer: '⚠ Questo punteggio è un segnale di riferimento da indicatori pubblici, non consulenza d’investimento. Ogni decisione e responsabilità è tua.'
    },
    pt: {
      title: 'Índice de medo e ganância do Bitcoin Cash e pontuação de momento de compra',
      intro: 'Um painel gratuito que sintetiza 7 indicadores em tempo real — incluindo o índice de medo e ganância do Bitcoin Cash — numa pontuação de 0 a 100 «é uma boa hora para comprar?». Roda no navegador sem instalação, em 13 idiomas.',
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
        { q: 'Devo comprar Bitcoin Cash quando o índice está baixo?', a: 'O medo extremo foi muitas vezes uma oportunidade de acumulação, mas confiar só no índice arrisca «pegar uma faca caindo». Esta pontuação também pondera RSI, MACD, múltiplo de Mayer, queda e cruzamentos de médias, e a reduz de forma conservadora em tendências de baixa.' },
        { q: 'Como a pontuação de compra é calculada?', a: 'Cada um dos 7 indicadores é convertido numa subpontuação de 0 a 100 e ponderado. O resultado é 0–100, em 5 faixas.' },
        { q: 'É grátis? Preciso instalar algo?', a: 'É totalmente grátis e sem instalação. Os dados em tempo real vêm das APIs públicas da CoinGecko, Binance e Alternative.me.' },
        { q: 'Qual a diferença entre o índice e a pontuação de compra?', a: 'O índice é uma única métrica de sentimento (0–100); a pontuação de compra é um composto de 7 indicadores incluindo o índice (0–100).' },
        { q: 'De onde vêm os dados e com que frequência são atualizados?', a: 'O índice de medo e ganância vem da Alternative.me; preços e velas diárias, das APIs públicas da CoinGecko e da Binance; e as métricas on-chain, da CoinMetrics. A tela atualiza automaticamente a cada minuto, aproximadamente.' },
        { q: 'Devo comprar Bitcoin Cash agora?', a: 'Não há resposta única, mas a pontuação de compra (0–100) permite avaliar objetivamente se o mercado está em zona de sobrevenda/medo ou de superaquecimento/ganância. Na aba de longo prazo (contrária), pontuações altas marcam zonas onde medo e subvalorização coincidem — historicamente favoráveis ao DCA —, e as baixas alertam para superaquecimento. É um sinal de referência, não consultoria de investimento.' },
        { q: 'Qual a diferença entre o timing de curto e de longo prazo?', a: 'A pontuação divide-se em duas abas. O curto prazo (momentum) adota uma visão de seguimento de tendência de 1–3 meses e sobe com tendências de alta fortes; o longo prazo (contrário) adota uma visão de ciclo de mais de um ano e sobe com medo e subvalorização. Em backtests desde 2017, o momentum funcionou melhor no curto e o contrário no longo.' },
        { q: 'O que é o BOTTOM RADAR (pontuação de fundo)?', a: 'Um medidor auxiliar que usa métricas on-chain como o MVRV Z-Score para medir onde a capitalização está em relação ao custo médio dos investidores, mostrando a proximidade de zonas de fundo históricas numa escala de 0 a 100. O cálculo completo está publicado no guia «fundo do Bitcoin».' }
      ],
      disclaimer: '⚠ Esta pontuação é um sinal de referência a partir de indicadores públicos, não é consultoria de investimento. Todas as decisões e a responsabilidade são suas.'
    },
    ru: {
      title: 'Индекс страха и жадности биткоин-кэша и оценка времени покупки',
      intro: 'Бесплатная панель, которая объединяет 7 индикаторов в реальном времени — включая индекс страха и жадности биткоин-кэша — в оценку от 0 до 100 «подходящее ли сейчас время для покупки?». Работает в браузере без установки, на 13 языках.',
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
        { q: 'Покупать ли биткоин-кэш, когда индекс низкий?', a: 'Крайний страх исторически часто был возможностью накопления, но полагаться только на индекс рискованно — можно «поймать падающий нож». Эта оценка также учитывает RSI, MACD, множитель Майера, просадку и пересечения средних и консервативно снижается в нисходящих трендах.' },
        { q: 'Как рассчитывается оценка покупки?', a: 'Каждый из 7 индикаторов переводится в частную оценку 0–100 и взвешивается. Результат — 0–100, в 5 диапазонах.' },
        { q: 'Это бесплатно? Нужно ли что-то устанавливать?', a: 'Полностью бесплатно и без установки. Данные в реальном времени берутся из публичных API CoinGecko, Binance и Alternative.me.' },
        { q: 'Чем индекс отличается от оценки покупки?', a: 'Индекс — одна метрика настроения (0–100); оценка покупки — составной показатель из 7 индикаторов, включая индекс (0–100).' },
        { q: 'Откуда берутся данные и как часто они обновляются?', a: 'Индекс страха и жадности — с Alternative.me; цены и дневные свечи — из публичных API CoinGecko и Binance; ончейн-метрики — из CoinMetrics. Экран автоматически обновляется примерно раз в минуту.' },
        { q: 'Стоит ли покупать биткоин-кэш прямо сейчас?', a: 'Единственно верного ответа нет, но оценка покупки (0–100) объективно показывает, находится ли рынок в зоне перепроданности/страха или перегрева/жадности. На вкладке долгосрочного (контртрендового) взгляда высокие значения отмечают зоны, где совпадают страх и недооценка — исторически благоприятные для усреднения, — а низкие предупреждают о перегреве. Это справочный сигнал, а не инвестиционная рекомендация.' },
        { q: 'Чем отличаются краткосрочный и долгосрочный тайминг?', a: 'Оценка разделена на две вкладки. Краткосрочная (моментум) использует трендследящий взгляд на 1–3 месяца и растёт при сильных восходящих трендах; долгосрочная (контртренд) — циклический взгляд от года и растёт при страхе и недооценке. В бэктестах с 2017 года на коротком горизонте лучше работал моментум, на длинном — контртренд.' },
        { q: 'Что такое BOTTOM RADAR (оценка дна)?', a: 'Вспомогательный индикатор, который с помощью ончейн-метрик, таких как MVRV Z-оценка, измеряет положение капитализации относительно средней цены входа инвесторов и показывает близость к историческим зонам дна по шкале 0–100. Полный расчёт опубликован на странице «дно биткоина».' }
      ],
      disclaimer: '⚠ Эта оценка — справочный сигнал на основе публичных индикаторов, а не инвестиционная рекомендация. Все решения и ответственность — на вас.'
    },
    nl: {
      title: 'Bitcoin Cash Angst- & Hebzucht-index en koopmoment-score',
      intro: 'Een gratis dashboard dat 7 realtime indicatoren — inclusief de Bitcoin Cash Angst- & Hebzucht-index — samenvoegt tot een score van 0–100 voor «is het nu een goed moment om te kopen?». Draait in de browser zonder installatie, in 13 talen.',
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
        { q: 'Moet ik Bitcoin Cash kopen als de index laag is?', a: 'Extreme angst was vaak een accumulatiekans, maar alleen op de index vertrouwen riskeert «een vallend mes te vangen». Deze score weegt ook RSI, MACD, Mayer Multiple, daling en gemiddelde-kruisingen mee, en verlaagt de score behoudend in dalende trends.' },
        { q: 'Hoe wordt de koopmoment-score berekend?', a: 'Elk van de 7 indicatoren wordt omgezet naar een deelscore van 0–100 en gewogen. Het resultaat is 0–100, in 5 banden.' },
        { q: 'Is het gratis? Moet ik iets installeren?', a: 'Het is volledig gratis en zonder installatie. Realtime data komt van de publieke API’s van CoinGecko, Binance en Alternative.me.' },
        { q: 'Wat is het verschil tussen de index en de koopmoment-score?', a: 'De index is één sentimentmaatstaf (0–100); de koopmoment-score is een samenstelling van 7 indicatoren inclusief de index (0–100).' },
        { q: 'Waar komen de gegevens vandaan en hoe vaak worden ze ververst?', a: 'De Angst- & Hebzucht-index komt van Alternative.me; prijzen en dagcandles van de publieke API’s van CoinGecko en Binance; on-chain-metrieken van CoinMetrics. Het scherm ververst ongeveer elke minuut automatisch.' },
        { q: 'Moet ik nu Bitcoin Cash kopen?', a: 'Er is geen eenduidig antwoord, maar de koopmoment-score (0–100) geeft een objectief beeld of de markt in een oversold/angst-zone of een oververhitte/hebzucht-zone zit. Op het langetermijn-tabblad (tegendraads) markeren hoge scores zones waar angst en onderwaardering samenvallen — historisch gunstig voor DCA — terwijl lage scores waarschuwen voor oververhitting. Het is een referentiesignaal, geen beleggingsadvies.' },
        { q: 'Hoe verschillen korte- en langetermijn-kooptiming?', a: 'De score is verdeeld over twee tabbladen. Korte termijn (momentum) hanteert een trendvolgende blik van 1–3 maanden en stijgt bij sterke opwaartse trends; lange termijn (tegendraads) hanteert een cyclusblik van ruim een jaar en stijgt bij angst en onderwaardering. In backtests sinds 2017 werkte momentum beter op korte termijn en tegendraads beter op lange termijn.' },
        { q: 'Wat is de BOTTOM RADAR (bodemscore)?', a: 'Een hulpmeter die met on-chain-metrieken zoals de MVRV Z-score meet waar de marktkapitalisatie staat ten opzichte van de gemiddelde kostprijs van beleggers, en de nabijheid van historische bodemzones toont op een schaal van 0–100. De volledige berekening staat op de pagina «Bitcoin-bodem».' }
      ],
      disclaimer: '⚠ Deze score is een referentiesignaal uit publieke indicatoren, geen beleggingsadvies. Alle beslissingen en verantwoordelijkheid zijn van uzelf.'
    },
    th: {
      title: 'ดัชนีความกลัวและความโลภบิตคอยน์แคช และคะแนนจังหวะซื้อ',
      intro: 'แดชบอร์ดฟรีที่รวม 7 ตัวชี้วัดแบบเรียลไทม์ — รวมถึงดัชนีความกลัวและความโลภของบิตคอยน์แคช — เป็นคะแนน 0–100 ว่า “ตอนนี้เป็นจังหวะซื้อหรือไม่?” ใช้งานในเบราว์เซอร์ได้ทันที ไม่ต้องติดตั้ง รองรับ 13 ภาษา',
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
        { q: 'ถ้าดัชนีต่ำควรซื้อบิตคอยน์แคชไหม?', a: 'ความกลัวสุดขีดในอดีตมักเป็นโอกาสทยอยซื้อ แต่ดูเพียงดัชนีอย่างเดียวเสี่ยง “รับมีดที่กำลังตก” คะแนนนี้ยังพิจารณา RSI, MACD, Mayer Multiple, การย่อ และการตัดกันของเส้นเฉลี่ย และลดคะแนนอย่างระมัดระวังในแนวโน้มขาลง' },
        { q: 'คะแนนจังหวะซื้อคำนวณอย่างไร?', a: 'แปลงแต่ละตัวชี้วัดทั้ง 7 เป็นคะแนนย่อย 0–100 แล้วถ่วงน้ำหนักรวมกัน ผลลัพธ์คือ 0–100 แสดงเป็น 5 ระดับ' },
        { q: 'ฟรีไหม? ต้องติดตั้งไหม?', a: 'ฟรีทั้งหมดและไม่ต้องติดตั้ง ข้อมูลเรียลไทม์มาจาก API สาธารณะของ CoinGecko, Binance และ Alternative.me' },
        { q: 'ดัชนีกับคะแนนจังหวะซื้อต่างกันอย่างไร?', a: 'ดัชนีเป็นตัวชี้วัดอารมณ์เดียว (0–100); คะแนนจังหวะซื้อเป็นคะแนนรวมจาก 7 ตัวชี้วัดรวมถึงดัชนี (0–100)' },
        { q: 'ข้อมูลมาจากไหน อัปเดตบ่อยแค่ไหน?', a: 'ดัชนีความกลัว-ความโลภมาจาก Alternative.me ราคาและแท่งเทียนรายวันมาจาก API สาธารณะของ CoinGecko และ Binance ส่วนตัวชี้วัดออนเชนมาจาก CoinMetrics หน้าจออัปเดตอัตโนมัติราวทุก 1 นาที' },
        { q: 'ตอนนี้ควรซื้อบิตคอยน์แคชไหม?', a: 'ไม่มีคำตอบตายตัว แต่คะแนนจังหวะซื้อ (0–100) ช่วยประเมินอย่างเป็นกลางว่าตลาดอยู่ในโซนขายมากเกิน/ความกลัว หรือโซนร้อนแรง/ความโลภ ในแท็บระยะยาว (สวนตลาด) คะแนนยิ่งสูงหมายถึงโซนที่ความกลัวและราคาต่ำกว่ามูลค่าทับซ้อนกัน ซึ่งในอดีตเอื้อต่อ DCA ส่วนคะแนนต่ำเตือนถึงความร้อนแรง เป็นเพียงสัญญาณอ้างอิง ไม่ใช่คำแนะนำการลงทุน' },
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
  /* 푸터 설명 문단(.foot-desc) — 비트코인캐시 언급이 있어 공통 foot-i18n.js 가 아니라 여기에 둔다 */
  var FOOT_DESC = {
    ko: 'broodev는 설치 없이 브라우저에서 바로 쓰는 무료 웹앱을 만드는 앱 포트폴리오입니다. 이 페이지의 비트코인캐시 공포·탐욕 지수와 매수 타이밍 점수는 공개 지표를 합성한 참고 정보이며 투자 자문이 아닙니다. 광고는 Google AdSense를 통해 게재될 수 있습니다.',
    en: 'broodev is a portfolio of free web apps that run right in your browser with no install. The Bitcoin Cash Fear & Greed Index and buy-timing score on this page are reference information synthesized from public indicators, not investment advice. Ads may be served through Google AdSense.',
    ja: 'broodevは、インストール不要でブラウザからすぐ使える無料Webアプリを作るアプリポートフォリオです。このページのビットコインキャッシュ恐怖・強欲指数と買い時スコアは公開指標を合成した参考情報であり、投資助言ではありません。広告はGoogle AdSenseを通じて掲載される場合があります。',
    zh: 'broodev 是一个应用作品集，制作无需安装、在浏览器中即可直接使用的免费网页应用。本页的比特币现金恐惧与贪婪指数和买入时机评分是综合公开指标得出的参考信息，不构成投资建议。广告可能通过 Google AdSense 投放。',
    'zh-Hant': 'broodev 是一個應用作品集，製作無需安裝、在瀏覽器中即可直接使用的免費網頁應用。本頁的比特幣現金恐懼與貪婪指數和買入時機評分是綜合公開指標得出的參考資訊，不構成投資建議。廣告可能透過 Google AdSense 刊登。',
    th: 'broodev คือพอร์ตโฟลิโอแอปที่สร้างเว็บแอปฟรีซึ่งใช้งานได้ทันทีในเบราว์เซอร์โดยไม่ต้องติดตั้ง ดัชนีความกลัว-ความโลภบิตคอยน์แคชและคะแนนจังหวะซื้อในหน้านี้เป็นข้อมูลอ้างอิงที่สังเคราะห์จากตัวชี้วัดสาธารณะ ไม่ใช่คำแนะนำการลงทุน โฆษณาอาจแสดงผ่าน Google AdSense',
    es: 'broodev es un portafolio de aplicaciones web gratuitas que funcionan directamente en el navegador, sin instalación. El Índice de Miedo y Codicia de Bitcoin Cash y la puntuación de momento de compra de esta página son información de referencia elaborada a partir de indicadores públicos, no asesoramiento de inversión. Los anuncios pueden mostrarse a través de Google AdSense.',
    fr: 'broodev est un portfolio d’applications web gratuites qui s’utilisent directement dans le navigateur, sans installation. L’indice Peur & Avidité du Bitcoin Cash et le score de timing d’achat de cette page sont des informations de référence issues d’indicateurs publics, et non un conseil en investissement. Des annonces peuvent être diffusées via Google AdSense.',
    de: 'broodev ist ein Portfolio kostenloser Web-Apps, die ohne Installation direkt im Browser laufen. Der Bitcoin Cash-Angst-und-Gier-Index und der Kauf-Timing-Score auf dieser Seite sind aus öffentlichen Indikatoren zusammengesetzte Referenzinformationen und keine Anlageberatung. Werbung kann über Google AdSense ausgeliefert werden.',
    it: 'broodev è un portfolio di web app gratuite che funzionano direttamente nel browser, senza installazione. L’Indice di Paura e Avidità di Bitcoin Cash e il punteggio di timing d’acquisto in questa pagina sono informazioni di riferimento ricavate da indicatori pubblici, non una consulenza di investimento. Gli annunci possono essere pubblicati tramite Google AdSense.',
    pt: 'O broodev é um portefólio de aplicações web gratuitas que funcionam diretamente no navegador, sem instalação. O Índice de Medo e Ganância do Bitcoin Cash e a pontuação de momento de compra desta página são informação de referência sintetizada a partir de indicadores públicos, não aconselhamento de investimento. Os anúncios podem ser apresentados através do Google AdSense.',
    ru: 'broodev — это портфолио бесплатных веб-приложений, которые работают прямо в браузере без установки. Индекс страха и жадности биткоин-кэша и оценка момента покупки на этой странице — справочная информация, собранная из открытых индикаторов, а не инвестиционная рекомендация. Реклама может показываться через Google AdSense.',
    nl: 'broodev is een portfolio van gratis webapps die zonder installatie direct in je browser werken. De Bitcoin Cash Angst- en Hebzuchtindex en de koop-timingscore op deze pagina zijn referentie-informatie samengesteld uit openbare indicatoren, geen beleggingsadvies. Advertenties kunnen via Google AdSense worden getoond.'
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
    "title": "Bitcoin Cash (BCH) Buy-Timing Score and Indicator Guide",
    "intro": "This page applies seven indicators to Bitcoin Cash (BCH) daily prices — RSI(14), MACD(12·26·9), the Fear & Greed Index, the Mayer Multiple, drawdown from the 365-day high, the 50/200 golden/death cross and the MVRV Z-Score — and turns them into a 0–100 buy-timing score with five bands from STRONG BUY to OVERHEATED. It is free and opens straight in your browser with nothing to install. Below is what to read differently when you use these indicators on Bitcoin Cash.",
    "coinH": "What is Bitcoin Cash (BCH)?",
    "coinP": [
     "Bitcoin Cash split from Bitcoin in a hard fork on August 1, 2017, after a long dispute over raising the block size. It is mined with the same SHA-256 proof of work as Bitcoin and aims to be peer-to-peer electronic cash, using bigger blocks to keep payments fast and cheap. There was no single founder: the fork was led by developers and miners who backed larger blocks, and the first node implementation was Bitcoin ABC. Anyone who held BTC at the fork received the same amount of BCH.",
     "Maximum supply is 21 million coins, the same as Bitcoin, and the block reward halves every 210,000 blocks. The block size limit started at 8 MB and was raised to 32 MB in May 2018. Bitcoin SV (BSV) split off in November 2018, the chain that later became eCash (XEC) followed in November 2020, and the May 2023 upgrade introduced native tokens called CashTokens."
    ],
    "applyH": "Applying the indicators to Bitcoin Cash",
    "apply": [
     "BCH tends to move with Bitcoin, but its swings are usually larger. RSI therefore drops below 30 or climbs above 70 more often than on BTC, and each individual signal deserves less weight.",
     "The Fear & Greed Index is not a Bitcoin Cash index. It is Alternative.me’s sentiment gauge for the whole crypto market, driven mostly by BTC, so BCH-specific news such as a network upgrade or a chain split does not show up in it.",
     "The MVRV Z-Score is calculated from CoinMetrics data. Keep in mind that most of the BCH supply was handed out 1:1 to BTC holders at the 2017 fork, so reading it as the market’s average cost basis is less clean than for an asset that was bought and sold on the market from day one.",
     "The Mayer Multiple thresholds (below 0.8 strong buy, above 2.4 overheated) and the drawdown levels (-30% watch, -50% strong buy) come from Bitcoin’s past cycles. BCH spent years below its December 2017 peak and has lost value against BTC over the long run, so a deep drawdown alone does not mean a bottom.",
     "Trading volume and liquidity are far smaller than BTC’s, so a single large order or an exchange-specific issue can move the daily candle sharply. The 50/200 cross can flip back and forth within short periods, so treat it as a secondary trend check."
    ],
    "histH": "Bitcoin Cash price cycles at a glance",
    "hist": [
     "2017 — Began trading after splitting from Bitcoin on August 1 and set its all-time high above $4,000 at the peak of the December bull run.",
     "2018 — Fell sharply around the November split from Bitcoin SV (the so-called hash war) and dropped below $100 in December.",
     "2020 — A dispute over a developer-funding rule at the November upgrade split off the Bitcoin ABC side, which renamed itself eCash (XEC) in 2021.",
     "2021 — Climbed back above $1,000 in the bull market but stayed well short of the 2017 peak.",
     "2023–2024 — CashTokens arrived in May 2023, and the April 2024 halving cut the block reward to 3.125 BCH."
    ],
    "faq": [
     {
      "q": "Is there a separate Fear & Greed Index for Bitcoin Cash?",
      "a": "No. The Alternative.me Fear & Greed Index used here is a single reading for the whole crypto market, and no BCH-only value is published. That is why the card labels it as a market-wide index. BCH’s own behavior shows up in the indicators calculated from its price, such as RSI, MACD and drawdown."
     },
     {
      "q": "Does Bitcoin Cash get an MVRV Z-Score too?",
      "a": "Yes. CoinMetrics’ public data includes BCH market cap and realized cap, so it can be calculated. On days when the data does not arrive, the card shows N/A and the score is rebuilt from the remaining indicators with reweighted inputs."
     },
     {
      "q": "Should I buy Bitcoin Cash now?",
      "a": "This page is not built to tell you to buy or sell Bitcoin Cash. The score only shows which historical zone current conditions resemble. A high long-term (contrarian) score means oversold readings, fear and a deep drawdown are lining up; a low one means overheating signals dominate. Because BCH is more volatile than BTC, the trend over several days says more than a single day’s score."
     },
     {
      "q": "Can I read it with the same thresholds as Bitcoin?",
      "a": "The formulas are the same, but the thresholds mean something different. Levels such as Mayer 0.8/2.4 and drawdowns of -30%/-50% come from Bitcoin’s history, so on BCH — which has fallen further and recovered more slowly than BTC — buy-side signals can light up more often. A high score alone is not proof of a bottom."
     },
     {
      "q": "Does the BCH halving happen on the same day as Bitcoin’s?",
      "a": "No. Both halve every 210,000 blocks, but blocks have been produced at different speeds since the fork, so the dates drift apart. In 2024 BCH halved in early April and BTC around April 20."
     },
     {
      "q": "How is Bitcoin Cash different from Bitcoin SV and eCash?",
      "a": "All three share the same roots but are separate chains. Bitcoin SV split off in November 2018 over the protocol’s direction, and the chain that became eCash split off in November 2020 over a developer-funding rule. This page covers only Bitcoin Cash, ticker BCH."
     }
    ]
   },
   "ja": {
    "title": "ビットコインキャッシュ（BCH）の買い時スコアと指標の読み方",
    "intro": "この画面はビットコインキャッシュ（BCH）の日足にRSI(14)、MACD(12·26·9)、恐怖・強欲指数、Mayer Multiple、365日高値からの下落率、50/200ゴールデンクロス・デッドクロス、MVRV Z-Scoreの7指標を当てはめ、0〜100の買い時スコアとSTRONG BUYからOVERHEATEDまでの5段階で示します。無料で、インストール不要のままブラウザですぐ開けます。以下では、同じ指標をビットコインキャッシュに使うときに何を読み替えるべきかをまとめました。",
    "coinH": "ビットコインキャッシュ（BCH）とは？",
    "coinP": [
     "ビットコインキャッシュは、ブロックサイズ拡大をめぐる長い論争の末、2017年8月1日にビットコインからハードフォークで分岐した暗号資産です。ビットコインと同じSHA-256のプルーフ・オブ・ワーク（PoW）で採掘され、ブロックを大きくして送金を速く安く処理するP2P電子マネーを目指しています。特定の創設者がいるわけではなく、大きなブロックを支持する開発者と採掘者の陣営が分岐を主導し、最初のノード実装はBitcoin ABCでした。分岐時点でBTCを保有していた人には同じ数量のBCHが付与されました。",
     "最大供給量はビットコインと同じ2,100万枚で、21万ブロックごとに採掘報酬が半減します。ブロックサイズの上限は当初8MBで、2018年5月に32MBへ引き上げられました。2018年11月にはBitcoin SV（BSV）が、2020年11月には後にeCash（XEC）となるチェーンがさらに分岐し、2023年5月のアップグレードではネイティブトークン機能のCashTokensが導入されました。"
    ],
    "applyH": "ビットコインキャッシュに指標を当てはめるときの注意",
    "apply": [
     "BCHはビットコインと連動しやすい一方、値動きの幅はおおむね大きくなります。そのためRSIが30を割ったり70を超えたりする場面はBTCより多く、一つひとつのシグナルは軽めに受け止める必要があります。",
     "恐怖・強欲指数はビットコインキャッシュ専用の指数ではありません。Alternative.meが公表する暗号資産市場全体（BTC中心）のセンチメント指数なので、ネットワークのアップグレードやチェーン分岐といったBCH固有のニュースは反映されません。",
     "MVRV Z-ScoreはCoinMetricsのデータで計算します。ただしBCHの供給の大半は2017年の分岐時にBTC保有者へ1:1で配られたコインのため、市場参加者の平均取得コストとして読む解釈は、最初から市場で売買されてきた資産ほどすっきりしない場合があります。",
     "Mayer Multiple（0.8未満で強い買い・2.4超で過熱）と下落率の基準（-30%で注目・-50%で強い買い）は、ビットコインの過去のサイクルから導かれた値です。BCHは2017年12月の高値を長く超えられず、対BTCの価値も長期的に下がってきたため、下落が深いというだけで底とは言えません。",
     "出来高と流動性はBTCよりはるかに小さく、大口注文や特定の取引所の問題だけで日足が大きく揺れることがあります。50/200のゴールデンクロス・デッドクロスも短期間で反転しやすいので、トレンド確認の補助シグナルとして扱うのが無難です。"
    ],
    "histH": "ビットコインキャッシュの価格サイクル",
    "hist": [
     "2017年 — 8月1日にビットコインから分岐して取引が始まり、12月の強気相場のピークで4,000ドルを超える史上最高値を記録しました。",
     "2018年 — 11月のBitcoin SVとのチェーン分岐（いわゆるハッシュ戦争）前後に急落し、12月には100ドルを割り込みました。",
     "2020年 — 11月のアップグレードで開発資金ルールをめぐる対立からBitcoin ABC側のチェーンが分岐し、このチェーンは2021年にeCash（XEC）へ改称しました。",
     "2021年 — 強気相場で再び1,000ドルを超えたものの、2017年の高値には届きませんでした。",
     "2023〜2024年 — 2023年5月にCashTokensが導入され、2024年4月の半減期でブロック報酬は3.125 BCHになりました。"
    ],
    "faq": [
     {
      "q": "ビットコインキャッシュ専用の恐怖・強欲指数はありますか？",
      "a": "ありません。この画面で使うAlternative.meの恐怖・強欲指数は暗号資産市場全体を対象にした一つの値だけで、BCH専用の値は公表されていません。そのためカードにも市場全体の指数と表示しています。BCH自体の動きは、BCHの価格から計算するRSI・MACD・下落率などで確認できます。"
     },
     {
      "q": "ビットコインキャッシュでもMVRV Z-Scoreは表示されますか？",
      "a": "はい。CoinMetricsの公開データにBCHの時価総額と実現時価総額があるため計算できます。データが取得できない日はカードがN/Aになり、残りの指標の重みを付け直してスコアを出します。"
     },
     {
      "q": "今ビットコインキャッシュを買ってもいいですか？",
      "a": "この画面は売買を勧めるものではありません。スコアは、現在の状態が過去の基準でどのゾーンに近いかを示すだけです。長期（逆張り）タブのスコアが高ければ売られすぎ・恐怖・大きな下落が重なっていること、低ければ過熱のシグナルが多いことを意味します。BCHはBTCより値動きが大きいため、1日分のスコアより数日間の推移を合わせて見るほうが参考になります。"
     },
     {
      "q": "ビットコインと同じ基準で読んでもいいですか？",
      "a": "計算式は同じですが、基準線の意味は異なります。Mayer Multipleの0.8・2.4や下落率の-30%・-50%はビットコインの過去のサイクルから来た値なので、BTCより下げ幅が大きく回復も遅かったBCHでは、買い側のシグナルがより頻繁に点灯することがあります。スコアが高いことだけを根拠に底と決めつけないでください。"
     },
     {
      "q": "BCHの半減期はビットコインと同じ日ですか？",
      "a": "違います。どちらも21万ブロックごとに報酬が半減しますが、分岐後のブロック生成ペースが異なるため日付がずれます。2024年はBCHが4月上旬、BTCが4月20日前後に半減期を迎えました。"
     },
     {
      "q": "ビットコインキャッシュとBitcoin SV、eCashは何が違いますか？",
      "a": "3つとも同じ源流から生まれた別々のチェーンです。2018年11月にプロトコルの方向性の違いからBitcoin SVが、2020年11月に開発資金ルールの問題からeCashの前身となるチェーンが分岐しました。この画面はティッカーBCHのビットコインキャッシュだけを扱います。"
     }
    ]
   },
   "ko": {
    "title": "비트코인캐시(BCH) 매수 타이밍 점수와 지표 해설",
    "intro": "이 화면은 비트코인캐시(BCH) 일봉에 RSI(14), MACD(12·26·9), 공포·탐욕 지수, Mayer Multiple, 365일 고점 대비 낙폭, 50/200 골든·데드 크로스, MVRV Z-Score 등 7개 지표를 적용해 0~100 매수 타이밍 점수와 STRONG BUY부터 OVERHEATED까지 5단계 밴드로 보여줍니다. 무료이고 설치 없이 브라우저에서 바로 열립니다. 아래에는 같은 지표를 비트코인캐시에 쓸 때 무엇을 다르게 읽어야 하는지 정리했습니다.",
    "coinH": "비트코인캐시(BCH)란?",
    "coinP": [
     "비트코인캐시는 블록 크기 확대를 둘러싼 오랜 논쟁 끝에 2017년 8월 1일 비트코인에서 하드포크로 갈라져 나온 암호화폐입니다. 비트코인과 같은 SHA-256 작업증명(PoW)으로 채굴되며, 블록을 키워 결제를 빠르고 저렴하게 처리하는 P2P 전자화폐를 목표로 합니다. 특정 창시자 한 명이 아니라 큰 블록을 지지한 개발자·채굴자 진영이 포크를 주도했고, 첫 노드 구현은 Bitcoin ABC였습니다. 포크 시점에 BTC를 보유한 사람은 같은 수량의 BCH를 받았습니다.",
     "최대 공급량은 비트코인과 같은 2,100만 개이며, 21만 블록마다 채굴 보상이 절반으로 줄어듭니다. 블록 크기 한도는 출범 당시 8MB였고 2018년 5월 32MB로 늘었습니다. 2018년 11월에는 Bitcoin SV(BSV)가, 2020년 11월에는 훗날 eCash(XEC)가 되는 체인이 다시 갈라져 나갔으며, 2023년 5월 업그레이드로 네이티브 토큰 기능인 CashTokens가 도입됐습니다."
    ],
    "applyH": "비트코인캐시에 지표를 적용할 때",
    "apply": [
     "BCH는 비트코인과 함께 움직이는 경향이 강하지만 변동 폭은 대체로 더 큽니다. 그래서 RSI가 30 아래나 70 위로 벗어나는 일이 BTC보다 잦은 편이고, 신호 하나하나의 무게는 그만큼 가볍게 봐야 합니다.",
     "공포·탐욕 지수는 비트코인캐시 전용 지수가 아닙니다. Alternative.me가 발표하는 암호화폐 시장 전체(BTC 중심) 심리 지수라서, 네트워크 업그레이드나 체인 분리처럼 BCH에만 해당하는 소식은 반영되지 않습니다.",
     "MVRV Z-Score는 CoinMetrics 데이터로 계산됩니다. 다만 BCH 공급의 대부분은 2017년 포크 때 BTC 보유자에게 1:1로 배분된 코인이라, 이 지표를 시장 참여자의 평균 매수원가로 읽는 해석은 처음부터 시장에서 사고판 자산보다 덜 깔끔할 수 있습니다.",
     "Mayer Multiple(0.8 미만 강한 매수·2.4 초과 과열)과 낙폭 기준(-30% 관심·-50% 강한 매수)은 비트코인의 과거 사이클에서 나온 값입니다. BCH는 2017년 12월 고점을 오랫동안 넘지 못했고 BTC 대비 가치도 장기적으로 낮아져 왔기 때문에, 낙폭이 깊다는 사실만으로 바닥이라고 보기 어렵습니다.",
     "거래량과 유동성이 BTC보다 훨씬 작아 큰 주문이나 특정 거래소 이슈만으로 일봉이 크게 흔들릴 수 있습니다. 50/200 골든·데드 크로스도 짧은 간격으로 뒤집힐 수 있으니 추세를 확인하는 보조 신호로 보는 편이 안전합니다."
    ],
    "histH": "비트코인캐시 가격 사이클 요약",
    "hist": [
     "2017년 — 8월 1일 비트코인에서 분리돼 거래가 시작됐고, 12월 강세장 정점에서 4,000달러를 넘는 사상 최고가를 기록했습니다.",
     "2018년 — 11월 Bitcoin SV와의 체인 분리(이른바 해시 전쟁)를 전후해 급락했고, 12월에는 100달러 아래까지 내려갔습니다.",
     "2020년 — 11월 업그레이드 때 개발 자금 규칙을 둘러싼 갈등으로 Bitcoin ABC 쪽 체인이 분리됐고, 이 체인은 2021년 eCash(XEC)로 이름을 바꿨습니다.",
     "2021년 — 강세장에서 다시 1,000달러를 넘었지만 2017년 고점에는 미치지 못했습니다.",
     "2023~2024년 — 2023년 5월 CashTokens가 도입됐고, 2024년 4월 반감기로 블록 보상이 3.125 BCH로 줄었습니다."
    ],
    "faq": [
     {
      "q": "비트코인캐시 공포·탐욕 지수가 따로 있나요?",
      "a": "아니요. 이 화면이 쓰는 Alternative.me 공포·탐욕 지수는 암호화폐 시장 전체를 대상으로 한 값 하나뿐이고, BCH 전용 값은 발표되지 않습니다. 그래서 카드에도 시장 전체 지수라고 표시합니다. BCH만의 움직임은 BCH 가격으로 계산하는 RSI·MACD·낙폭 같은 지표에서 확인할 수 있습니다."
     },
     {
      "q": "비트코인캐시에도 MVRV Z-Score가 나오나요?",
      "a": "네. CoinMetrics 공개 데이터에 BCH의 시가총액과 실현시가총액이 있어 계산할 수 있습니다. 데이터를 받지 못한 날에는 카드가 N/A로 바뀌고, 나머지 지표의 가중치를 다시 맞춰 점수를 냅니다."
     },
     {
      "q": "지금 비트코인캐시를 사도 되나요?",
      "a": "이 화면은 비트코인캐시를 사라거나 팔라고 알려 주는 도구가 아닙니다. 점수는 현재 상태가 과거 기준으로 어느 구간에 가까운지를 보여줄 뿐입니다. 장기(역발상) 탭 점수가 높으면 과매도·공포·큰 낙폭이 겹쳐 있다는 뜻이고, 낮으면 과열 신호가 많다는 뜻입니다. BCH는 BTC보다 변동이 크므로 하루치 점수보다 며칠간의 흐름을 함께 보는 편이 낫습니다."
     },
     {
      "q": "비트코인과 같은 기준으로 읽어도 되나요?",
      "a": "계산식은 같지만 기준선의 의미는 다릅니다. Mayer Multiple 0.8·2.4, 낙폭 -30%·-50% 같은 값은 비트코인의 과거 사이클에서 나온 것이라, BTC보다 하락 폭이 크고 회복이 느렸던 BCH에서는 매수 쪽 신호가 더 자주 켜질 수 있습니다. 점수가 높다는 것만으로 바닥이라고 단정하지 마세요."
     },
     {
      "q": "BCH 반감기는 비트코인과 같은 날인가요?",
      "a": "아닙니다. 둘 다 21만 블록마다 보상이 절반이 되지만, 포크 이후 블록이 쌓인 속도가 달라 날짜가 어긋납니다. 2024년에는 BCH가 4월 초, BTC가 4월 20일 전후에 반감기를 맞았습니다."
     },
     {
      "q": "비트코인캐시와 Bitcoin SV, eCash는 무엇이 다른가요?",
      "a": "셋 다 같은 뿌리에서 나온 별개의 체인입니다. 2018년 11월 프로토콜 방향 차이로 Bitcoin SV가, 2020년 11월 개발 자금 규칙 문제로 eCash의 전신이 된 체인이 분리됐습니다. 이 화면은 시세 기호 BCH인 비트코인캐시만 다룹니다."
     }
    ]
   },
   "zh": {
    "title": "比特币现金（BCH）买入时机评分与指标解读",
    "intro": "本页面将RSI(14)、MACD(12·26·9)、恐惧与贪婪指数、Mayer Multiple、距365日高点回撤、50/200金叉·死叉、MVRV Z-Score共7项指标应用于比特币现金（BCH）日线，给出0~100的买入时机评分，并分为STRONG BUY至OVERHEATED五个区间。完全免费，无需安装，打开浏览器即可使用。下文说明把这些指标用在比特币现金上时，哪些地方需要换个角度解读。",
    "coinH": "什么是比特币现金（BCH）？",
    "coinP": [
     "比特币现金是在围绕扩大区块容量的长期争论之后，于2017年8月1日通过硬分叉从比特币分离出来的加密货币。它与比特币一样采用SHA-256工作量证明（PoW）挖矿，目标是用更大的区块实现快速、低成本的点对点电子现金支付。它没有单一的创始人，分叉由支持大区块的开发者和矿工阵营主导，最早的节点实现是Bitcoin ABC。分叉时持有BTC的用户获得了等量的BCH。",
     "最大供应量与比特币相同，为2,100万枚，每21万个区块挖矿奖励减半。区块大小上限最初为8MB，2018年5月提高到32MB。2018年11月Bitcoin SV（BSV）分出，2020年11月后来更名为eCash（XEC）的链再次分出；2023年5月的升级引入了原生代币功能CashTokens。"
    ],
    "applyH": "将指标用于比特币现金时的注意事项",
    "apply": [
     "BCH通常与比特币同向波动，但幅度一般更大。因此RSI跌破30或升破70的情况比BTC更常见，单个信号的分量应相应打折。",
     "恐惧与贪婪指数并非比特币现金专属指数，而是Alternative.me发布的整个加密市场（以BTC为主）情绪指数，网络升级、链分叉等只与BCH有关的消息不会体现在其中。",
     "MVRV Z-Score使用CoinMetrics数据计算。但BCH的大部分供应是2017年分叉时按1:1分给BTC持有者的币，把它理解为市场参与者的平均持仓成本，不如一开始就在市场上买卖的资产那样清晰。",
     "Mayer Multiple的阈值（低于0.8为强烈买入、高于2.4为过热）和回撤标准（-30%关注、-50%强烈买入）都来自比特币以往的周期。BCH长期未能突破2017年12月的高点，相对BTC的价值也长期走低，因此仅凭回撤很深并不能断定见底。",
     "成交量和流动性远小于BTC，一笔大额订单或某家交易所的问题就可能让日线大幅波动。50/200金叉·死叉也可能在短时间内反复切换，宜作为确认趋势的辅助信号。"
    ],
    "histH": "比特币现金价格周期回顾",
    "hist": [
     "2017年 — 8月1日从比特币分叉后开始交易，并在12月牛市顶点创下超过4,000美元的历史最高价。",
     "2018年 — 11月与Bitcoin SV分链（即所谓的算力战）前后大幅下跌，12月跌破100美元。",
     "2020年 — 11月升级时因开发资金规则的分歧，Bitcoin ABC一方的链分离出去，该链于2021年更名为eCash（XEC）。",
     "2021年 — 牛市中重新站上1,000美元，但远未回到2017年的高点。",
     "2023~2024年 — 2023年5月引入CashTokens，2024年4月减半后区块奖励降至3.125 BCH。"
    ],
    "faq": [
     {
      "q": "比特币现金有单独的恐惧与贪婪指数吗？",
      "a": "没有。本页使用的Alternative.me恐惧与贪婪指数只有一个面向整个加密市场的数值，没有发布BCH专属数值，所以卡片上也标注为全市场指数。BCH自身的走势可以通过用BCH价格计算的RSI、MACD、回撤等指标查看。"
     },
     {
      "q": "比特币现金也能显示MVRV Z-Score吗？",
      "a": "可以。CoinMetrics公开数据中有BCH的市值和已实现市值，因此可以计算。某天取不到数据时，卡片会显示N/A，评分则由其余指标重新分配权重后得出。"
     },
     {
      "q": "现在可以买比特币现金吗？",
      "a": "本页面不提供买卖建议。评分只表示当前状态按历史标准更接近哪个区间。长期（逆向）标签评分高，说明超卖、恐慌和深度回撤同时出现；评分低，说明过热信号居多。BCH波动大于BTC，看几天的变化趋势比只看某一天的评分更有参考价值。"
     },
     {
      "q": "可以用和比特币相同的标准来解读吗？",
      "a": "计算公式相同，但阈值的含义不同。Mayer Multiple 0.8/2.4、回撤-30%/-50%等数值来自比特币的历史周期，而BCH跌幅更大、恢复更慢，买入一侧的信号可能更频繁地亮起。不要仅凭评分高就断定已经见底。"
     },
     {
      "q": "BCH减半和比特币是同一天吗？",
      "a": "不是。两者都是每21万个区块减半，但分叉后的出块速度不同，日期因此错开。2024年BCH在4月初减半，BTC则在4月20日前后。"
     },
     {
      "q": "比特币现金与Bitcoin SV、eCash有什么区别？",
      "a": "三者同源，但是彼此独立的链。2018年11月因协议发展方向不同分出了Bitcoin SV，2020年11月因开发资金规则问题分出了后来成为eCash的链。本页面只涉及代码为BCH的比特币现金。"
     }
    ]
   },
   "zh-Hant": {
    "title": "比特幣現金（BCH）買入時機評分與指標解讀",
    "intro": "本頁面將RSI(14)、MACD(12·26·9)、恐懼與貪婪指數、Mayer Multiple、距365日高點回檔幅度、50/200黃金交叉·死亡交叉、MVRV Z-Score共7項指標套用在比特幣現金（BCH）日線上，給出0~100的買入時機評分，並分為STRONG BUY到OVERHEATED五個區間。完全免費，不必安裝，用瀏覽器即可開啟。下文說明把這些指標用在比特幣現金上時，哪些地方需要換個角度解讀。",
    "coinH": "什麼是比特幣現金（BCH）？",
    "coinP": [
     "比特幣現金是在圍繞擴大區塊容量的長期爭論之後，於2017年8月1日透過硬分叉從比特幣分離出來的加密貨幣。它與比特幣一樣採用SHA-256工作量證明（PoW）挖礦，目標是以更大的區塊實現快速、低成本的點對點電子現金支付。它沒有單一的創辦人，分叉由支持大區塊的開發者與礦工陣營主導，最早的節點實作是Bitcoin ABC。分叉時持有BTC的使用者獲得了等量的BCH。",
     "最大供給量與比特幣相同，為2,100萬枚，每21萬個區塊挖礦獎勵減半。區塊大小上限最初為8MB，2018年5月提高到32MB。2018年11月Bitcoin SV（BSV）分出，2020年11月後來更名為eCash（XEC）的鏈再度分出；2023年5月的升級導入了原生代幣功能CashTokens。"
    ],
    "applyH": "將指標用於比特幣現金時的注意事項",
    "apply": [
     "BCH通常與比特幣同向波動，但幅度一般更大。因此RSI跌破30或升破70的情況比BTC更常見，單一訊號的分量應相應打折。",
     "恐懼與貪婪指數並非比特幣現金專屬指數，而是Alternative.me發布的整個加密市場（以BTC為主）情緒指數，網路升級、鏈分叉等只與BCH有關的消息不會反映在其中。",
     "MVRV Z-Score使用CoinMetrics資料計算。但BCH的大部分供給是2017年分叉時按1:1分配給BTC持有者的幣，把它理解為市場參與者的平均持有成本，不如一開始就在市場上買賣的資產那樣清楚。",
     "Mayer Multiple的門檻（低於0.8為強烈買入、高於2.4為過熱）和回檔標準（-30%關注、-50%強烈買入）都來自比特幣過去的週期。BCH長期未能突破2017年12月的高點，相對BTC的價值也長期走低，因此僅憑回檔很深並不能斷定見底。",
     "成交量與流動性遠小於BTC，一筆大額訂單或某家交易所的問題就可能讓日線大幅波動。50/200黃金交叉·死亡交叉也可能在短時間內反覆切換，宜作為確認趨勢的輔助訊號。"
    ],
    "histH": "比特幣現金價格週期回顧",
    "hist": [
     "2017年 — 8月1日從比特幣分叉後開始交易，並在12月牛市頂點創下超過4,000美元的歷史最高價。",
     "2018年 — 11月與Bitcoin SV分鏈（即所謂的算力戰）前後大幅下跌，12月跌破100美元。",
     "2020年 — 11月升級時因開發資金規則的分歧，Bitcoin ABC一方的鏈分離出去，該鏈於2021年更名為eCash（XEC）。",
     "2021年 — 牛市中重新站上1,000美元，但遠未回到2017年的高點。",
     "2023~2024年 — 2023年5月導入CashTokens，2024年4月減半後區塊獎勵降至3.125 BCH。"
    ],
    "faq": [
     {
      "q": "比特幣現金有單獨的恐懼與貪婪指數嗎？",
      "a": "沒有。本頁使用的Alternative.me恐懼與貪婪指數只有一個針對整個加密市場的數值，沒有發布BCH專屬數值，所以卡片上也標示為全市場指數。BCH本身的走勢可以透過以BCH價格計算的RSI、MACD、回檔幅度等指標查看。"
     },
     {
      "q": "比特幣現金也能顯示MVRV Z-Score嗎？",
      "a": "可以。CoinMetrics公開資料中有BCH的市值與已實現市值，因此可以計算。某天取不到資料時，卡片會顯示N/A，評分則由其餘指標重新分配權重後得出。"
     },
     {
      "q": "現在可以買比特幣現金嗎？",
      "a": "本頁面不提供買賣建議。評分只表示目前狀態按歷史標準較接近哪個區間。長期（逆勢）分頁評分高，代表超賣、恐慌與深度回檔同時出現；評分低，代表過熱訊號居多。BCH波動大於BTC，看幾天的變化趨勢比只看某一天的評分更有參考價值。"
     },
     {
      "q": "可以用和比特幣相同的標準來解讀嗎？",
      "a": "計算公式相同，但門檻的意義不同。Mayer Multiple 0.8/2.4、回檔-30%/-50%等數值來自比特幣的歷史週期，而BCH跌幅更大、恢復更慢，買入一側的訊號可能更頻繁亮起。不要只因評分高就斷定已經見底。"
     },
     {
      "q": "BCH減半和比特幣是同一天嗎？",
      "a": "不是。兩者都是每21萬個區塊減半，但分叉後的出塊速度不同，日期因此錯開。2024年BCH在4月初減半，BTC則在4月20日前後。"
     },
     {
      "q": "比特幣現金與Bitcoin SV、eCash有什麼不同？",
      "a": "三者同源，但是彼此獨立的鏈。2018年11月因協定發展方向不同分出了Bitcoin SV，2020年11月因開發資金規則問題分出了後來成為eCash的鏈。本頁面只涵蓋代號為BCH的比特幣現金。"
     }
    ]
   },
   "th": {
    "title": "คะแนนจังหวะซื้อบิตคอยน์แคช (BCH) และวิธีอ่านตัวชี้วัด",
    "intro": "หน้านี้นำตัวชี้วัด 7 ตัว ได้แก่ RSI(14), MACD(12·26·9), ดัชนีความกลัวและความโลภ, Mayer Multiple, การย่อตัวจากจุดสูงสุด 365 วัน, โกลเดนครอส/เดธครอส 50/200 และ MVRV Z-Score มาใช้กับกราฟรายวันของบิตคอยน์แคช (BCH) แล้วสรุปเป็นคะแนนจังหวะซื้อ 0–100 แบ่งเป็น 5 ระดับตั้งแต่ STRONG BUY ถึง OVERHEATED ใช้ได้ฟรีและเปิดในเบราว์เซอร์ได้ทันทีโดยไม่ต้องติดตั้ง ด้านล่างสรุปว่าเมื่อใช้ตัวชี้วัดเหล่านี้กับบิตคอยน์แคช ควรอ่านต่างไปจากเดิมอย่างไร",
    "coinH": "บิตคอยน์แคช (BCH) คืออะไร?",
    "coinP": [
     "บิตคอยน์แคชคือคริปโทเคอร์เรนซีที่แยกออกจากบิตคอยน์ด้วยการฮาร์ดฟอร์กเมื่อวันที่ 1 สิงหาคม 2017 หลังการถกเถียงยาวนานเรื่องการขยายขนาดบล็อก ใช้การขุดแบบ Proof of Work ด้วยอัลกอริทึม SHA-256 เช่นเดียวกับบิตคอยน์ และมุ่งเป็นเงินสดอิเล็กทรอนิกส์แบบ P2P ที่ใช้บล็อกขนาดใหญ่เพื่อให้ชำระเงินได้เร็วและค่าธรรมเนียมต่ำ ไม่มีผู้ก่อตั้งคนเดียว แต่กลุ่มนักพัฒนาและนักขุดที่สนับสนุนบล็อกขนาดใหญ่เป็นผู้ผลักดันการฟอร์ก โดยซอฟต์แวร์โหนดตัวแรกคือ Bitcoin ABC ผู้ที่ถือ BTC ณ เวลาฟอร์กได้รับ BCH ในจำนวนเท่ากัน",
     "อุปทานสูงสุดคือ 21 ล้านเหรียญเท่ากับบิตคอยน์ และรางวัลการขุดลดลงครึ่งหนึ่งทุก 210,000 บล็อก เพดานขนาดบล็อกเริ่มที่ 8MB และเพิ่มเป็น 32MB ในเดือนพฤษภาคม 2018 ต่อมา Bitcoin SV (BSV) แยกตัวออกไปในเดือนพฤศจิกายน 2018 และเชนที่ภายหลังกลายเป็น eCash (XEC) แยกออกไปในเดือนพฤศจิกายน 2020 ส่วนการอัปเกรดเดือนพฤษภาคม 2023 ได้เพิ่มฟีเจอร์โทเคนในตัวชื่อ CashTokens"
    ],
    "applyH": "ข้อควรรู้เมื่อใช้ตัวชี้วัดกับบิตคอยน์แคช",
    "apply": [
     "BCH มักเคลื่อนไหวไปทางเดียวกับบิตคอยน์ แต่โดยทั่วไปแกว่งแรงกว่า RSI จึงหลุดต่ำกว่า 30 หรือทะลุเหนือ 70 บ่อยกว่า BTC และควรให้น้ำหนักกับสัญญาณแต่ละครั้งน้อยลง",
     "ดัชนีความกลัวและความโลภไม่ใช่ดัชนีเฉพาะของบิตคอยน์แคช แต่เป็นดัชนีอารมณ์ตลาดคริปโททั้งตลาด (เน้น BTC) ของ Alternative.me ข่าวที่เกี่ยวกับ BCH โดยตรง เช่น การอัปเกรดเครือข่ายหรือการแยกเชน จึงไม่สะท้อนอยู่ในดัชนีนี้",
     "MVRV Z-Score คำนวณจากข้อมูลของ CoinMetrics แต่อุปทาน BCH ส่วนใหญ่เป็นเหรียญที่แจกให้ผู้ถือ BTC ในอัตรา 1:1 ตอนฟอร์กปี 2017 การตีความว่าเป็นต้นทุนเฉลี่ยของผู้เล่นในตลาดจึงชัดเจนน้อยกว่าสินทรัพย์ที่ซื้อขายในตลาดมาตั้งแต่แรก",
     "เกณฑ์ Mayer Multiple (ต่ำกว่า 0.8 ซื้อแรง สูงกว่า 2.4 ร้อนแรงเกินไป) และเกณฑ์การย่อตัว (-30% น่าจับตา, -50% ซื้อแรง) มาจากวัฏจักรในอดีตของบิตคอยน์ BCH อยู่ต่ำกว่าจุดสูงสุดเดือนธันวาคม 2017 มาเป็นเวลานาน และมูลค่าเมื่อเทียบกับ BTC ก็ลดลงในระยะยาว การย่อตัวลึกเพียงอย่างเดียวจึงไม่ได้แปลว่าถึงจุดต่ำสุด",
     "ปริมาณการซื้อขายและสภาพคล่องน้อยกว่า BTC มาก คำสั่งซื้อขายขนาดใหญ่เพียงรายการเดียวหรือปัญหาของกระดานเทรดบางแห่งก็อาจทำให้แท่งเทียนรายวันแกว่งแรงได้ โกลเดนครอส/เดธครอส 50/200 ก็อาจกลับทิศในเวลาสั้น ๆ จึงควรใช้เป็นสัญญาณเสริมเพื่อยืนยันแนวโน้ม"
    ],
    "histH": "สรุปวัฏจักรราคาบิตคอยน์แคช",
    "hist": [
     "2017 — เริ่มซื้อขายหลังแยกจากบิตคอยน์เมื่อ 1 สิงหาคม และทำจุดสูงสุดตลอดกาลเหนือ 4,000 ดอลลาร์ช่วงพีกของตลาดกระทิงเดือนธันวาคม",
     "2018 — ร่วงหนักช่วงการแยกเชนกับ Bitcoin SV ในเดือนพฤศจิกายน (ที่เรียกกันว่าสงครามแฮช) และลงไปต่ำกว่า 100 ดอลลาร์ในเดือนธันวาคม",
     "2020 — ความขัดแย้งเรื่องกฎการจัดสรรเงินทุนนักพัฒนาในการอัปเกรดเดือนพฤศจิกายนทำให้เชนฝั่ง Bitcoin ABC แยกออกไป และเชนนั้นเปลี่ยนชื่อเป็น eCash (XEC) ในปี 2021",
     "2021 — กลับขึ้นไปเหนือ 1,000 ดอลลาร์ในตลาดกระทิง แต่ยังห่างจากจุดสูงสุดปี 2017 อยู่มาก",
     "2023–2024 — เปิดใช้ CashTokens ในเดือนพฤษภาคม 2023 และการฮาล์ฟวิ่งเดือนเมษายน 2024 ทำให้รางวัลบล็อกลดเหลือ 3.125 BCH"
    ],
    "faq": [
     {
      "q": "บิตคอยน์แคชมีดัชนีความกลัวและความโลภแยกต่างหากไหม?",
      "a": "ไม่มี ดัชนีของ Alternative.me ที่หน้านี้ใช้มีเพียงค่าเดียวสำหรับตลาดคริปโททั้งหมด และไม่มีการเผยแพร่ค่าเฉพาะของ BCH การ์ดจึงระบุว่าเป็นดัชนีทั้งตลาด ส่วนความเคลื่อนไหวของ BCH เองดูได้จากตัวชี้วัดที่คำนวณจากราคา BCH เช่น RSI, MACD และการย่อตัว"
     },
     {
      "q": "บิตคอยน์แคชมี MVRV Z-Score ด้วยไหม?",
      "a": "มี ข้อมูลสาธารณะของ CoinMetrics มีมูลค่าตลาดและมูลค่าตลาดที่รับรู้แล้ว (realized cap) ของ BCH จึงคำนวณได้ วันที่ดึงข้อมูลไม่ได้ การ์ดจะแสดง N/A และคะแนนจะคำนวณจากตัวชี้วัดที่เหลือโดยปรับน้ำหนักใหม่"
     },
     {
      "q": "ตอนนี้ควรซื้อบิตคอยน์แคชไหม?",
      "a": "หน้านี้ไม่แนะนำให้ซื้อหรือขาย คะแนนบอกเพียงว่าสภาพปัจจุบันใกล้กับโซนใดตามเกณฑ์ในอดีต ถ้าคะแนนแท็บระยะยาว (สวนกระแส) สูง แปลว่าภาวะขายมากเกิน ความกลัว และการย่อตัวลึกเกิดพร้อมกัน ถ้าต่ำแปลว่าสัญญาณร้อนแรงเกินไปมีมาก BCH ผันผวนกว่า BTC การดูแนวโน้มหลายวันจึงให้ข้อมูลมากกว่าคะแนนของวันเดียว"
     },
     {
      "q": "อ่านด้วยเกณฑ์เดียวกับบิตคอยน์ได้ไหม?",
      "a": "สูตรคำนวณเหมือนกัน แต่ความหมายของเส้นเกณฑ์ต่างกัน ค่าอย่าง Mayer 0.8/2.4 หรือการย่อตัว -30%/-50% มาจากประวัติของบิตคอยน์ สำหรับ BCH ที่ร่วงลึกกว่าและฟื้นช้ากว่า BTC สัญญาณฝั่งซื้ออาจขึ้นบ่อยกว่า อย่าสรุปว่าถึงจุดต่ำสุดเพียงเพราะคะแนนสูง"
     },
     {
      "q": "ฮาล์ฟวิ่งของ BCH ตรงกับวันเดียวกับบิตคอยน์ไหม?",
      "a": "ไม่ตรง ทั้งสองลดรางวัลลงครึ่งหนึ่งทุก 210,000 บล็อก แต่หลังฟอร์กความเร็วในการผลิตบล็อกต่างกัน วันที่จึงคลาดกัน ในปี 2024 BCH ฮาล์ฟวิ่งช่วงต้นเดือนเมษายน ส่วน BTC ราววันที่ 20 เมษายน"
     },
     {
      "q": "บิตคอยน์แคชต่างจาก Bitcoin SV และ eCash อย่างไร?",
      "a": "ทั้งสามมีรากเดียวกันแต่เป็นเชนแยกกัน Bitcoin SV แยกออกไปในเดือนพฤศจิกายน 2018 เพราะเห็นต่างเรื่องทิศทางของโปรโตคอล และเชนที่กลายเป็น eCash แยกออกไปในเดือนพฤศจิกายน 2020 เพราะปัญหากฎเงินทุนนักพัฒนา หน้านี้ครอบคลุมเฉพาะบิตคอยน์แคชที่ใช้สัญลักษณ์ BCH"
     }
    ]
   },
   "es": {
    "title": "Bitcoin Cash (BCH): puntuación de momento de compra y guía de indicadores",
    "intro": "Esta página aplica siete indicadores al gráfico diario de Bitcoin Cash (BCH) —RSI(14), MACD(12·26·9), el Índice de Miedo y Codicia, el Mayer Multiple, la caída desde el máximo de 365 días, el cruce dorado/de la muerte 50/200 y el MVRV Z-Score— y los resume en una puntuación de 0 a 100 con cinco bandas, de STRONG BUY a OVERHEATED. Es gratis y se abre directamente en el navegador, sin instalar nada. Más abajo explicamos qué conviene leer de otra manera cuando estos indicadores se aplican a Bitcoin Cash.",
    "coinH": "¿Qué es Bitcoin Cash (BCH)?",
    "coinP": [
     "Bitcoin Cash se separó de Bitcoin mediante un hard fork el 1 de agosto de 2017, tras un largo debate sobre ampliar el tamaño de bloque. Se mina con la misma prueba de trabajo SHA-256 que Bitcoin y aspira a ser efectivo electrónico entre pares, con bloques más grandes para que los pagos sean rápidos y baratos. No tuvo un único fundador: el fork lo impulsaron desarrolladores y mineros partidarios de bloques grandes, y la primera implementación de nodo fue Bitcoin ABC. Quien tenía BTC en el momento del fork recibió la misma cantidad de BCH.",
     "El suministro máximo es de 21 millones de monedas, igual que Bitcoin, y la recompensa por bloque se reduce a la mitad cada 210.000 bloques. El límite de tamaño de bloque empezó en 8 MB y subió a 32 MB en mayo de 2018. Bitcoin SV (BSV) se escindió en noviembre de 2018 y la cadena que después se convertiría en eCash (XEC) lo hizo en noviembre de 2020; la actualización de mayo de 2023 añadió tokens nativos llamados CashTokens."
    ],
    "applyH": "Cómo aplicar los indicadores a Bitcoin Cash",
    "apply": [
     "BCH suele moverse en la misma dirección que Bitcoin, pero con oscilaciones normalmente más amplias. Por eso el RSI baja de 30 o supera 70 con más frecuencia que en BTC, y cada señal aislada merece menos peso.",
     "El Índice de Miedo y Codicia no es un índice propio de Bitcoin Cash: es el indicador de sentimiento de todo el mercado cripto (centrado en BTC) que publica Alternative.me. Las noticias que afectan solo a BCH, como una actualización de red o una división de cadena, no se reflejan en él.",
     "El MVRV Z-Score se calcula con datos de CoinMetrics. Pero la mayor parte de la oferta de BCH se repartió 1:1 entre los tenedores de BTC en el fork de 2017, así que interpretarlo como el coste medio de compra del mercado es menos limpio que en un activo comprado y vendido en el mercado desde el primer día.",
     "Los umbrales del Mayer Multiple (por debajo de 0,8 compra fuerte, por encima de 2,4 sobrecalentado) y los niveles de caída (-30 % vigilar, -50 % compra fuerte) proceden de los ciclos pasados de Bitcoin. BCH pasó años por debajo de su máximo de diciembre de 2017 y ha perdido valor frente a BTC a largo plazo, así que una caída profunda no basta para hablar de suelo.",
     "El volumen y la liquidez son muy inferiores a los de BTC, de modo que una sola orden grande o un problema en un exchange concreto puede mover con fuerza la vela diaria. El cruce 50/200 puede darse la vuelta en poco tiempo, así que conviene usarlo como confirmación secundaria de tendencia."
    ],
    "histH": "Resumen de los ciclos de precio de Bitcoin Cash",
    "hist": [
     "2017 — Empezó a cotizar tras separarse de Bitcoin el 1 de agosto y marcó su máximo histórico por encima de 4.000 dólares en el pico alcista de diciembre.",
     "2018 — Cayó con fuerza en torno a la división con Bitcoin SV de noviembre (la llamada guerra de hash) y bajó de 100 dólares en diciembre.",
     "2020 — Una disputa sobre una regla de financiación de desarrolladores en la actualización de noviembre separó la cadena del lado de Bitcoin ABC, que en 2021 pasó a llamarse eCash (XEC).",
     "2021 — Volvió a superar los 1.000 dólares en el mercado alcista, aunque lejos del máximo de 2017.",
     "2023–2024 — CashTokens llegó en mayo de 2023 y el halving de abril de 2024 redujo la recompensa por bloque a 3,125 BCH."
    ],
    "faq": [
     {
      "q": "¿Existe un Índice de Miedo y Codicia propio de Bitcoin Cash?",
      "a": "No. El índice de Alternative.me que usa esta página es un único valor para todo el mercado cripto y no se publica ninguna cifra exclusiva de BCH; por eso la tarjeta lo señala como índice de todo el mercado. El comportamiento propio de BCH se ve en los indicadores calculados con su precio, como el RSI, el MACD o la caída desde máximos."
     },
     {
      "q": "¿Bitcoin Cash también tiene MVRV Z-Score?",
      "a": "Sí. Los datos públicos de CoinMetrics incluyen la capitalización de mercado y la capitalización realizada de BCH, así que se puede calcular. Los días en que no llegan los datos, la tarjeta muestra N/A y la puntuación se recalcula con los demás indicadores reponderados."
     },
     {
      "q": "¿Debería comprar Bitcoin Cash ahora?",
      "a": "Esta página no está pensada para decirte que compres o vendas Bitcoin Cash. La puntuación solo indica a qué zona histórica se parecen las condiciones actuales. Una puntuación alta en la pestaña de largo plazo (contraria) significa que coinciden sobreventa, miedo y una caída profunda; una baja, que predominan las señales de sobrecalentamiento. Como BCH es más volátil que BTC, la evolución de varios días dice más que la cifra de un solo día."
     },
     {
      "q": "¿Puedo leerlo con los mismos umbrales que Bitcoin?",
      "a": "Las fórmulas son las mismas, pero los umbrales significan otra cosa. Niveles como Mayer 0,8/2,4 o caídas del -30 %/-50 % vienen de la historia de Bitcoin, y en BCH —que ha caído más y se ha recuperado más despacio que BTC— las señales de compra pueden encenderse con más frecuencia. Una puntuación alta no demuestra por sí sola que se haya tocado fondo."
     },
     {
      "q": "¿El halving de BCH coincide con el de Bitcoin?",
      "a": "No. Ambos reducen la recompensa a la mitad cada 210.000 bloques, pero desde el fork los bloques se han generado a ritmos distintos y las fechas se separan. En 2024, BCH tuvo su halving a principios de abril y BTC hacia el 20 de abril."
     },
     {
      "q": "¿En qué se diferencia Bitcoin Cash de Bitcoin SV y eCash?",
      "a": "Las tres comparten origen, pero son cadenas distintas. Bitcoin SV se separó en noviembre de 2018 por diferencias sobre el rumbo del protocolo, y la cadena que acabó siendo eCash lo hizo en noviembre de 2020 por una regla de financiación de desarrolladores. Esta página trata solo de Bitcoin Cash, con ticker BCH."
     }
    ]
   },
   "fr": {
    "title": "Bitcoin Cash (BCH) : score de timing d’achat et lecture des indicateurs",
    "intro": "Cette page applique sept indicateurs au graphique journalier de Bitcoin Cash (BCH) — RSI(14), MACD(12·26·9), l’indice Peur et Avidité, le Mayer Multiple, la baisse depuis le plus haut sur 365 jours, le golden cross / death cross 50/200 et le MVRV Z-Score — et les résume en un score de 0 à 100 réparti en cinq zones, de STRONG BUY à OVERHEATED. Gratuit, il s’ouvre directement dans le navigateur, sans installation. Vous trouverez ci-dessous ce qu’il faut lire autrement lorsqu’on applique ces indicateurs à Bitcoin Cash.",
    "coinH": "Qu’est-ce que Bitcoin Cash (BCH) ?",
    "coinP": [
     "Bitcoin Cash s’est séparé de Bitcoin par un hard fork le 1er août 2017, au terme d’un long débat sur l’augmentation de la taille des blocs. Il est miné avec la même preuve de travail SHA-256 que Bitcoin et vise à servir de monnaie électronique de pair à pair, avec des blocs plus grands pour des paiements rapides et peu coûteux. Il n’a pas de fondateur unique : le fork a été porté par des développeurs et des mineurs favorables aux gros blocs, et la première implémentation de nœud était Bitcoin ABC. Toute personne détenant des BTC au moment du fork a reçu la même quantité de BCH.",
     "L’offre maximale est de 21 millions d’unités, comme Bitcoin, et la récompense de bloc est divisée par deux tous les 210 000 blocs. La limite de taille de bloc, fixée à 8 Mo au départ, est passée à 32 Mo en mai 2018. Bitcoin SV (BSV) a fait sécession en novembre 2018, puis la chaîne devenue plus tard eCash (XEC) en novembre 2020 ; la mise à jour de mai 2023 a ajouté des jetons natifs appelés CashTokens."
    ],
    "applyH": "Appliquer les indicateurs à Bitcoin Cash",
    "apply": [
     "BCH évolue généralement dans le sillage de Bitcoin, mais avec des variations le plus souvent plus amples. Le RSI passe donc plus fréquemment sous 30 ou au-dessus de 70 que sur BTC, et chaque signal isolé mérite moins de poids.",
     "L’indice Peur et Avidité n’est pas propre à Bitcoin Cash : c’est l’indicateur de sentiment de l’ensemble du marché crypto (centré sur BTC) publié par Alternative.me. Les nouvelles qui ne concernent que BCH, comme une mise à jour du réseau ou une scission de chaîne, n’y apparaissent pas.",
     "Le MVRV Z-Score est calculé à partir des données de CoinMetrics. Mais l’essentiel de l’offre de BCH a été distribué 1:1 aux détenteurs de BTC lors du fork de 2017 : le lire comme le prix de revient moyen du marché est donc moins net que pour un actif acheté et vendu sur le marché dès le premier jour.",
     "Les seuils du Mayer Multiple (sous 0,8 achat fort, au-dessus de 2,4 surchauffe) et les niveaux de baisse (-30 % à surveiller, -50 % achat fort) proviennent des cycles passés de Bitcoin. BCH est resté des années sous son sommet de décembre 2017 et a perdu de la valeur face à BTC sur le long terme ; une baisse profonde ne suffit donc pas à signaler un plancher.",
     "Le volume et la liquidité sont très inférieurs à ceux de BTC : un seul gros ordre ou un incident sur une plateforme peut faire bondir la bougie journalière. Le croisement 50/200 peut s’inverser en peu de temps ; mieux vaut le traiter comme une confirmation secondaire de tendance."
    ],
    "histH": "Les cycles de prix de Bitcoin Cash en bref",
    "hist": [
     "2017 — Début des échanges après la séparation d’avec Bitcoin le 1er août, puis record historique au-dessus de 4 000 dollars au sommet de la hausse de décembre.",
     "2018 — Forte chute autour de la scission avec Bitcoin SV en novembre (la « guerre du hash »), puis passage sous 100 dollars en décembre.",
     "2020 — Un désaccord sur une règle de financement des développeurs lors de la mise à jour de novembre sépare la chaîne du camp Bitcoin ABC, rebaptisée eCash (XEC) en 2021.",
     "2021 — Retour au-dessus de 1 000 dollars pendant le marché haussier, mais bien en deçà du sommet de 2017.",
     "2023–2024 — Arrivée des CashTokens en mai 2023 ; le halving d’avril 2024 ramène la récompense de bloc à 3,125 BCH."
    ],
    "faq": [
     {
      "q": "Existe-t-il un indice Peur et Avidité propre à Bitcoin Cash ?",
      "a": "Non. L’indice d’Alternative.me utilisé ici est une valeur unique pour tout le marché crypto, et aucun chiffre spécifique à BCH n’est publié ; c’est pourquoi la carte l’indique comme un indice de marché global. Le comportement propre de BCH se lit dans les indicateurs calculés à partir de son prix, comme le RSI, le MACD ou la baisse depuis le plus haut."
     },
     {
      "q": "Bitcoin Cash a-t-il aussi un MVRV Z-Score ?",
      "a": "Oui. Les données publiques de CoinMetrics comprennent la capitalisation et la capitalisation réalisée de BCH, ce qui permet le calcul. Les jours où les données n’arrivent pas, la carte affiche N/A et le score est recalculé avec les autres indicateurs repondérés."
     },
     {
      "q": "Faut-il acheter du Bitcoin Cash maintenant ?",
      "a": "Cette page ne recommande ni achat ni vente. Le score indique seulement à quelle zone historique ressemblent les conditions actuelles. Un score élevé dans l’onglet long terme (à contre-courant) signifie que survente, peur et forte baisse se cumulent ; un score faible, que les signaux de surchauffe dominent. BCH étant plus volatil que BTC, l’évolution sur plusieurs jours en dit plus que le chiffre d’une seule journée."
     },
     {
      "q": "Peut-on le lire avec les mêmes seuils que Bitcoin ?",
      "a": "Les formules sont identiques, mais les seuils n’ont pas le même sens. Des niveaux comme Mayer 0,8/2,4 ou des baisses de -30 %/-50 % viennent de l’histoire de Bitcoin ; sur BCH, qui a davantage chuté et s’est redressé plus lentement que BTC, les signaux d’achat peuvent s’allumer plus souvent. Un score élevé ne prouve pas à lui seul qu’un plancher est atteint."
     },
     {
      "q": "Le halving de BCH a-t-il lieu le même jour que celui de Bitcoin ?",
      "a": "Non. Les deux réduisent la récompense de moitié tous les 210 000 blocs, mais depuis le fork les blocs ne sont pas produits au même rythme, si bien que les dates divergent. En 2024, BCH a connu son halving début avril, et BTC vers le 20 avril."
     },
     {
      "q": "Quelle différence entre Bitcoin Cash, Bitcoin SV et eCash ?",
      "a": "Les trois ont une origine commune mais sont des chaînes distinctes. Bitcoin SV s’est séparé en novembre 2018 sur l’orientation du protocole, et la chaîne devenue eCash en novembre 2020 à cause d’une règle de financement des développeurs. Cette page ne traite que de Bitcoin Cash, ticker BCH."
     }
    ]
   },
   "de": {
    "title": "Bitcoin Cash (BCH): Kauf-Timing-Score und Indikatoren richtig lesen",
    "intro": "Diese Seite wendet sieben Indikatoren auf den Tageschart von Bitcoin Cash (BCH) an – RSI(14), MACD(12·26·9), den Angst-und-Gier-Index, das Mayer Multiple, den Rückgang vom 365-Tage-Hoch, das Golden/Death Cross 50/200 und den MVRV Z-Score – und fasst sie zu einem Score von 0 bis 100 mit fünf Stufen von STRONG BUY bis OVERHEATED zusammen. Sie ist kostenlos und öffnet sich ohne Installation direkt im Browser. Unten steht, was man anders lesen sollte, wenn man diese Indikatoren auf Bitcoin Cash anwendet.",
    "coinH": "Was ist Bitcoin Cash (BCH)?",
    "coinP": [
     "Bitcoin Cash hat sich am 1. August 2017 nach einem langen Streit über größere Blöcke per Hard Fork von Bitcoin abgespalten. Es wird mit demselben SHA-256-Proof-of-Work wie Bitcoin gemined und soll als Peer-to-Peer-Bargeld dienen, wobei größere Blöcke Zahlungen schnell und günstig halten. Einen einzelnen Gründer gibt es nicht: Den Fork trieben Entwickler und Miner voran, die größere Blöcke befürworteten, und die erste Node-Implementierung war Bitcoin ABC. Wer zum Zeitpunkt des Forks BTC besaß, erhielt die gleiche Menge BCH.",
     "Das maximale Angebot liegt wie bei Bitcoin bei 21 Millionen Coins, und die Blockbelohnung halbiert sich alle 210.000 Blöcke. Das Blockgrößenlimit begann bei 8 MB und wurde im Mai 2018 auf 32 MB angehoben. Im November 2018 spaltete sich Bitcoin SV (BSV) ab, im November 2020 die Chain, aus der später eCash (XEC) wurde; das Upgrade vom Mai 2023 brachte native Token namens CashTokens."
    ],
    "applyH": "Indikatoren auf Bitcoin Cash anwenden",
    "apply": [
     "BCH bewegt sich meist im Gleichschritt mit Bitcoin, schwankt aber in der Regel stärker. Der RSI fällt daher häufiger unter 30 oder steigt über 70 als bei BTC, und ein einzelnes Signal verdient entsprechend weniger Gewicht.",
     "Der Angst-und-Gier-Index ist kein Bitcoin-Cash-Index, sondern der Stimmungsindikator von Alternative.me für den gesamten Kryptomarkt (BTC-lastig). Nachrichten, die nur BCH betreffen, etwa ein Netzwerk-Upgrade oder eine Chain-Spaltung, schlagen sich darin nicht nieder.",
     "Der MVRV Z-Score wird aus CoinMetrics-Daten berechnet. Allerdings wurde der Großteil des BCH-Angebots beim Fork 2017 im Verhältnis 1:1 an BTC-Halter verteilt; ihn als durchschnittlichen Einstandspreis des Marktes zu lesen, ist daher weniger sauber als bei einem Asset, das von Anfang an am Markt gekauft und verkauft wurde.",
     "Die Schwellen des Mayer Multiple (unter 0,8 starker Kauf, über 2,4 überhitzt) und die Rückgangsmarken (-30 % beobachten, -50 % starker Kauf) stammen aus früheren Bitcoin-Zyklen. BCH lag jahrelang unter seinem Hoch vom Dezember 2017 und hat gegenüber BTC langfristig an Wert verloren – ein tiefer Rückgang allein ist also noch kein Boden.",
     "Handelsvolumen und Liquidität sind weit geringer als bei BTC, sodass schon eine große Order oder ein Problem an einer einzelnen Börse die Tageskerze kräftig bewegen kann. Das 50/200-Kreuz kann innerhalb kurzer Zeit hin- und herspringen und taugt eher als zusätzliche Trendbestätigung."
    ],
    "histH": "Die Preiszyklen von Bitcoin Cash im Überblick",
    "hist": [
     "2017 – Handelsstart nach der Abspaltung von Bitcoin am 1. August; Allzeithoch über 4.000 US-Dollar auf dem Höhepunkt der Rally im Dezember.",
     "2018 – Starker Einbruch rund um die Spaltung von Bitcoin SV im November (der sogenannte Hash War) und im Dezember ein Rutsch unter 100 US-Dollar.",
     "2020 – Streit über eine Regel zur Entwicklerfinanzierung beim November-Upgrade trennte die Chain der Bitcoin-ABC-Seite ab, die sich 2021 in eCash (XEC) umbenannte.",
     "2021 – Im Bullenmarkt wieder über 1.000 US-Dollar, aber weit unter dem Hoch von 2017.",
     "2023–2024 – CashTokens kamen im Mai 2023, und das Halving im April 2024 senkte die Blockbelohnung auf 3,125 BCH."
    ],
    "faq": [
     {
      "q": "Gibt es einen eigenen Angst-und-Gier-Index für Bitcoin Cash?",
      "a": "Nein. Der hier verwendete Index von Alternative.me ist ein einziger Wert für den gesamten Kryptomarkt; einen BCH-eigenen Wert gibt es nicht. Deshalb kennzeichnet die Karte ihn als marktweiten Index. Das Eigenleben von BCH zeigt sich in den Indikatoren, die aus seinem Kurs berechnet werden, etwa RSI, MACD und Rückgang vom Hoch."
     },
     {
      "q": "Gibt es für Bitcoin Cash auch einen MVRV Z-Score?",
      "a": "Ja. Die öffentlichen Daten von CoinMetrics enthalten Marktkapitalisierung und realisierte Kapitalisierung von BCH, daher lässt er sich berechnen. An Tagen ohne Daten zeigt die Karte N/A, und der Score wird aus den übrigen Indikatoren mit neu verteilten Gewichten gebildet."
     },
     {
      "q": "Sollte ich jetzt Bitcoin Cash kaufen?",
      "a": "Diese Seite gibt keine Kauf- oder Verkaufsempfehlung. Der Score zeigt nur, welcher historischen Zone die aktuelle Lage ähnelt. Ein hoher Wert im Langfrist-Tab (antizyklisch) bedeutet, dass Überverkauft-Signale, Angst und ein tiefer Rückgang zusammenfallen; ein niedriger, dass Überhitzungssignale überwiegen. Da BCH volatiler ist als BTC, sagt der Verlauf über mehrere Tage mehr als der Wert eines einzelnen Tages."
     },
     {
      "q": "Kann ich ihn mit denselben Schwellen wie Bitcoin lesen?",
      "a": "Die Formeln sind gleich, die Schwellen bedeuten aber etwas anderes. Werte wie Mayer 0,8/2,4 oder Rückgänge von -30 %/-50 % stammen aus der Bitcoin-Historie; bei BCH, das tiefer gefallen ist und sich langsamer erholt hat als BTC, können Kaufsignale häufiger aufleuchten. Ein hoher Score allein beweist keinen Boden."
     },
     {
      "q": "Findet das BCH-Halving am selben Tag statt wie bei Bitcoin?",
      "a": "Nein. Beide halbieren die Belohnung alle 210.000 Blöcke, doch seit dem Fork wurden Blöcke unterschiedlich schnell erzeugt, sodass die Termine auseinanderliegen. 2024 halbierte BCH Anfang April, BTC um den 20. April."
     },
     {
      "q": "Worin unterscheiden sich Bitcoin Cash, Bitcoin SV und eCash?",
      "a": "Alle drei haben dieselben Wurzeln, sind aber getrennte Chains. Bitcoin SV spaltete sich im November 2018 wegen der Ausrichtung des Protokolls ab, die spätere eCash-Chain im November 2020 wegen einer Regel zur Entwicklerfinanzierung. Diese Seite behandelt nur Bitcoin Cash mit dem Ticker BCH."
     }
    ]
   },
   "it": {
    "title": "Bitcoin Cash (BCH): punteggio di timing d’acquisto e guida agli indicatori",
    "intro": "Questa pagina applica sette indicatori al grafico giornaliero di Bitcoin Cash (BCH) — RSI(14), MACD(12·26·9), l’Indice Paura e Avidità, il Mayer Multiple, il calo dal massimo a 365 giorni, il golden cross/death cross 50/200 e l’MVRV Z-Score — e li riassume in un punteggio da 0 a 100 con cinque fasce, da STRONG BUY a OVERHEATED. È gratuita e si apre direttamente nel browser, senza installare nulla. Qui sotto spieghiamo cosa leggere in modo diverso quando questi indicatori si applicano a Bitcoin Cash.",
    "coinH": "Che cos’è Bitcoin Cash (BCH)?",
    "coinP": [
     "Bitcoin Cash si è separato da Bitcoin con un hard fork il 1º agosto 2017, dopo un lungo scontro sull’aumento della dimensione dei blocchi. Viene minato con la stessa proof of work SHA-256 di Bitcoin e punta a essere contante elettronico peer-to-peer, con blocchi più grandi per pagamenti rapidi ed economici. Non ha un unico fondatore: il fork è stato promosso da sviluppatori e miner favorevoli ai blocchi grandi, e la prima implementazione del nodo è stata Bitcoin ABC. Chi possedeva BTC al momento del fork ha ricevuto la stessa quantità di BCH.",
     "L’offerta massima è di 21 milioni di monete, come per Bitcoin, e la ricompensa per blocco si dimezza ogni 210.000 blocchi. Il limite di dimensione del blocco è partito da 8 MB ed è salito a 32 MB nel maggio 2018. Bitcoin SV (BSV) si è separato a novembre 2018 e la catena poi diventata eCash (XEC) a novembre 2020; l’aggiornamento di maggio 2023 ha introdotto token nativi chiamati CashTokens."
    ],
    "applyH": "Come applicare gli indicatori a Bitcoin Cash",
    "apply": [
     "BCH tende a muoversi insieme a Bitcoin, ma di solito con oscillazioni più ampie. Per questo l’RSI scende sotto 30 o sale sopra 70 più spesso che su BTC, e ogni singolo segnale va pesato di meno.",
     "L’Indice Paura e Avidità non è un indice dedicato a Bitcoin Cash: è l’indicatore di sentiment dell’intero mercato cripto (centrato su BTC) pubblicato da Alternative.me. Le notizie che riguardano solo BCH, come un aggiornamento di rete o una scissione della catena, non vi compaiono.",
     "L’MVRV Z-Score si calcola con i dati di CoinMetrics. Però gran parte dell’offerta di BCH è stata distribuita 1:1 ai possessori di BTC con il fork del 2017, quindi leggerlo come costo medio d’acquisto del mercato è meno pulito che per un asset comprato e venduto sul mercato fin dal primo giorno.",
     "Le soglie del Mayer Multiple (sotto 0,8 acquisto forte, sopra 2,4 surriscaldato) e i livelli di calo (-30% da osservare, -50% acquisto forte) derivano dai cicli passati di Bitcoin. BCH è rimasto per anni sotto il massimo di dicembre 2017 e nel lungo periodo ha perso valore rispetto a BTC: un calo profondo da solo non indica un minimo.",
     "Volumi e liquidità sono molto inferiori a quelli di BTC, quindi un solo ordine grande o un problema su un singolo exchange può muovere con forza la candela giornaliera. L’incrocio 50/200 può invertirsi in poco tempo: meglio usarlo come conferma secondaria del trend."
    ],
    "histH": "I cicli di prezzo di Bitcoin Cash in breve",
    "hist": [
     "2017 — Inizia a essere scambiato dopo la separazione da Bitcoin del 1º agosto e tocca il massimo storico sopra i 4.000 dollari al culmine del rialzo di dicembre.",
     "2018 — Crolla attorno alla scissione da Bitcoin SV di novembre (la cosiddetta guerra dell’hash) e a dicembre scende sotto i 100 dollari.",
     "2020 — Un contrasto su una regola di finanziamento degli sviluppatori all’aggiornamento di novembre separa la catena del fronte Bitcoin ABC, ribattezzata eCash (XEC) nel 2021.",
     "2021 — Torna sopra i 1.000 dollari nel mercato rialzista, ma resta lontano dal massimo del 2017.",
     "2023–2024 — A maggio 2023 arrivano i CashTokens e l’halving di aprile 2024 porta la ricompensa per blocco a 3,125 BCH."
    ],
    "faq": [
     {
      "q": "Esiste un Indice Paura e Avidità solo per Bitcoin Cash?",
      "a": "No. L’indice di Alternative.me usato qui è un unico valore per tutto il mercato cripto e non viene pubblicato alcun dato specifico per BCH; per questo la scheda lo indica come indice dell’intero mercato. L’andamento proprio di BCH si vede negli indicatori calcolati sul suo prezzo, come RSI, MACD e calo dal massimo."
     },
     {
      "q": "Anche Bitcoin Cash ha l’MVRV Z-Score?",
      "a": "Sì. I dati pubblici di CoinMetrics includono la capitalizzazione e la capitalizzazione realizzata di BCH, quindi il calcolo è possibile. Nei giorni in cui i dati non arrivano, la scheda mostra N/A e il punteggio viene ricalcolato con gli altri indicatori ripesati."
     },
     {
      "q": "Conviene comprare Bitcoin Cash adesso?",
      "a": "Questa pagina non nasce per dirti di comprare o vendere Bitcoin Cash. Il punteggio indica solo a quale zona storica somigliano le condizioni attuali. Un punteggio alto nella scheda di lungo periodo (contrarian) significa che ipervenduto, paura e un calo profondo si sommano; uno basso, che prevalgono i segnali di surriscaldamento. Poiché BCH è più volatile di BTC, l’andamento su più giorni dice più del valore di un solo giorno."
     },
     {
      "q": "Posso leggerlo con le stesse soglie di Bitcoin?",
      "a": "Le formule sono le stesse, ma le soglie hanno un significato diverso. Livelli come Mayer 0,8/2,4 o cali del -30%/-50% vengono dalla storia di Bitcoin; su BCH, che è sceso di più e si è ripreso più lentamente di BTC, i segnali d’acquisto possono accendersi più spesso. Un punteggio alto da solo non prova che si sia toccato il fondo."
     },
     {
      "q": "L’halving di BCH avviene lo stesso giorno di quello di Bitcoin?",
      "a": "No. Entrambi dimezzano la ricompensa ogni 210.000 blocchi, ma dal fork i blocchi sono stati prodotti a ritmi diversi e le date si sono distanziate. Nel 2024 BCH ha avuto l’halving all’inizio di aprile, BTC intorno al 20 aprile."
     },
     {
      "q": "Che differenza c’è tra Bitcoin Cash, Bitcoin SV ed eCash?",
      "a": "Hanno la stessa origine ma sono catene distinte. Bitcoin SV si è separato a novembre 2018 per divergenze sulla direzione del protocollo, la catena diventata eCash a novembre 2020 per una regola di finanziamento degli sviluppatori. Questa pagina tratta solo Bitcoin Cash, ticker BCH."
     }
    ]
   },
   "pt": {
    "title": "Bitcoin Cash (BCH): pontuação de momento de compra e guia dos indicadores",
    "intro": "Esta página aplica sete indicadores ao gráfico diário do Bitcoin Cash (BCH) — RSI(14), MACD(12·26·9), o Índice de Medo e Ganância, o Mayer Multiple, a queda desde a máxima de 365 dias, o cruzamento dourado/da morte 50/200 e o MVRV Z-Score — e os resume numa pontuação de 0 a 100 com cinco faixas, de STRONG BUY a OVERHEATED. É gratuita e abre direto no navegador, sem instalar nada. Abaixo explicamos o que deve ser lido de outra forma quando esses indicadores são aplicados ao Bitcoin Cash.",
    "coinH": "O que é o Bitcoin Cash (BCH)?",
    "coinP": [
     "O Bitcoin Cash separou-se do Bitcoin num hard fork em 1º de agosto de 2017, depois de um longo debate sobre aumentar o tamanho dos blocos. É minerado com a mesma prova de trabalho SHA-256 do Bitcoin e pretende ser dinheiro eletrônico ponto a ponto, usando blocos maiores para manter os pagamentos rápidos e baratos. Não teve um fundador único: o fork foi conduzido por desenvolvedores e mineradores favoráveis a blocos grandes, e a primeira implementação de nó foi o Bitcoin ABC. Quem tinha BTC no momento do fork recebeu a mesma quantidade de BCH.",
     "A oferta máxima é de 21 milhões de moedas, igual à do Bitcoin, e a recompensa por bloco cai pela metade a cada 210.000 blocos. O limite de tamanho de bloco começou em 8 MB e passou a 32 MB em maio de 2018. O Bitcoin SV (BSV) separou-se em novembro de 2018 e a cadeia que mais tarde viraria eCash (XEC), em novembro de 2020; a atualização de maio de 2023 trouxe tokens nativos chamados CashTokens."
    ],
    "applyH": "Como aplicar os indicadores ao Bitcoin Cash",
    "apply": [
     "O BCH costuma acompanhar o Bitcoin, mas geralmente com oscilações maiores. Por isso o RSI cai abaixo de 30 ou passa de 70 com mais frequência do que no BTC, e cada sinal isolado merece menos peso.",
     "O Índice de Medo e Ganância não é um índice exclusivo do Bitcoin Cash: é o termômetro de sentimento de todo o mercado cripto (centrado no BTC) publicado pela Alternative.me. Notícias que afetam só o BCH, como uma atualização de rede ou uma divisão de cadeia, não aparecem nele.",
     "O MVRV Z-Score é calculado com dados da CoinMetrics. Mas a maior parte da oferta de BCH foi distribuída 1:1 aos detentores de BTC no fork de 2017, então lê-lo como o custo médio de compra do mercado é menos limpo do que num ativo comprado e vendido no mercado desde o primeiro dia.",
     "Os limites do Mayer Multiple (abaixo de 0,8 compra forte, acima de 2,4 superaquecido) e os níveis de queda (-30% observar, -50% compra forte) vêm dos ciclos passados do Bitcoin. O BCH passou anos abaixo da máxima de dezembro de 2017 e perdeu valor frente ao BTC no longo prazo, então uma queda profunda, sozinha, não indica fundo.",
     "Volume e liquidez são muito menores que os do BTC, de modo que uma única ordem grande ou um problema numa corretora específica pode mexer com força no candle diário. O cruzamento 50/200 pode se inverter em pouco tempo, por isso é melhor usá-lo como confirmação secundária de tendência."
    ],
    "histH": "Resumo dos ciclos de preço do Bitcoin Cash",
    "hist": [
     "2017 — Começou a ser negociado após se separar do Bitcoin em 1º de agosto e marcou a máxima histórica acima de 4.000 dólares no pico da alta de dezembro.",
     "2018 — Caiu forte em torno da divisão com o Bitcoin SV em novembro (a chamada guerra de hash) e ficou abaixo de 100 dólares em dezembro.",
     "2020 — Uma disputa sobre uma regra de financiamento de desenvolvedores na atualização de novembro separou a cadeia do lado do Bitcoin ABC, que em 2021 passou a se chamar eCash (XEC).",
     "2021 — Voltou a superar 1.000 dólares no mercado de alta, mas ficou bem abaixo da máxima de 2017.",
     "2023–2024 — Os CashTokens chegaram em maio de 2023 e o halving de abril de 2024 reduziu a recompensa por bloco para 3,125 BCH."
    ],
    "faq": [
     {
      "q": "Existe um Índice de Medo e Ganância só do Bitcoin Cash?",
      "a": "Não. O índice da Alternative.me usado aqui é um único valor para todo o mercado cripto, e nenhum número exclusivo do BCH é publicado; por isso o cartão o identifica como índice do mercado inteiro. O comportamento próprio do BCH aparece nos indicadores calculados a partir do seu preço, como RSI, MACD e queda desde a máxima."
     },
     {
      "q": "O Bitcoin Cash também tem MVRV Z-Score?",
      "a": "Sim. Os dados públicos da CoinMetrics incluem a capitalização de mercado e a capitalização realizada do BCH, então o cálculo é possível. Nos dias em que os dados não chegam, o cartão mostra N/A e a pontuação é refeita com os demais indicadores, com pesos redistribuídos."
     },
     {
      "q": "Devo comprar Bitcoin Cash agora?",
      "a": "Esta página não recomenda compra nem venda. A pontuação mostra apenas a qual zona histórica as condições atuais se parecem. Uma pontuação alta na aba de longo prazo (contrária) significa que sobrevenda, medo e queda profunda estão se somando; uma baixa, que predominam sinais de superaquecimento. Como o BCH é mais volátil que o BTC, a evolução de vários dias diz mais do que o número de um único dia."
     },
     {
      "q": "Posso ler com os mesmos limites do Bitcoin?",
      "a": "As fórmulas são as mesmas, mas os limites significam outra coisa. Níveis como Mayer 0,8/2,4 ou quedas de -30%/-50% vêm da história do Bitcoin; no BCH, que caiu mais e se recuperou mais devagar que o BTC, os sinais de compra podem acender com mais frequência. Uma pontuação alta, sozinha, não prova que o fundo chegou."
     },
     {
      "q": "O halving do BCH acontece no mesmo dia que o do Bitcoin?",
      "a": "Não. Os dois cortam a recompensa pela metade a cada 210.000 blocos, mas desde o fork os blocos foram produzidos em ritmos diferentes e as datas se afastaram. Em 2024, o BCH teve o halving no início de abril e o BTC por volta de 20 de abril."
     },
     {
      "q": "Qual a diferença entre Bitcoin Cash, Bitcoin SV e eCash?",
      "a": "Os três têm a mesma origem, mas são cadeias separadas. O Bitcoin SV separou-se em novembro de 2018 por divergências sobre o rumo do protocolo, e a cadeia que virou eCash, em novembro de 2020, por causa de uma regra de financiamento de desenvolvedores. Esta página trata apenas do Bitcoin Cash, ticker BCH."
     }
    ]
   },
   "ru": {
    "title": "Биткоин-кэш (BCH): оценка момента покупки и как читать индикаторы",
    "intro": "Эта страница применяет к дневному графику Биткоин-кэша (BCH) семь индикаторов — RSI(14), MACD(12·26·9), индекс страха и жадности, Mayer Multiple, просадку от 365-дневного максимума, золотой крест / крест смерти 50/200 и MVRV Z-Score — и сводит их в оценку от 0 до 100 с пятью зонами, от STRONG BUY до OVERHEATED. Она бесплатна и открывается прямо в браузере без установки. Ниже — что стоит читать иначе, когда эти индикаторы применяются к Биткоин-кэшу.",
    "coinH": "Что такое Биткоин-кэш (BCH)?",
    "coinP": [
     "Биткоин-кэш отделился от биткоина в результате хардфорка 1 августа 2017 года после долгого спора об увеличении размера блока. Он добывается на том же алгоритме доказательства работы SHA-256, что и биткоин, и задуман как одноранговые электронные деньги: более крупные блоки должны делать платежи быстрыми и дешёвыми. Единственного основателя у него нет — форк продвигали разработчики и майнеры, выступавшие за большие блоки, а первой реализацией узла была Bitcoin ABC. Все, кто владел BTC в момент форка, получили столько же BCH.",
     "Максимальная эмиссия — 21 млн монет, как у биткоина, а награда за блок уменьшается вдвое каждые 210 000 блоков. Лимит размера блока сначала составлял 8 МБ, а в мае 2018 года был поднят до 32 МБ. В ноябре 2018 года отделилась сеть Bitcoin SV (BSV), в ноябре 2020 года — цепочка, позже ставшая eCash (XEC); обновление мая 2023 года добавило нативные токены CashTokens."
    ],
    "applyH": "Как применять индикаторы к Биткоин-кэшу",
    "apply": [
     "BCH обычно движется вслед за биткоином, но, как правило, с большей амплитудой. Поэтому RSI чаще, чем у BTC, опускается ниже 30 или поднимается выше 70, и каждому отдельному сигналу стоит придавать меньший вес.",
     "Индекс страха и жадности — не индекс Биткоин-кэша, а показатель настроений всего криптовалютного рынка (с упором на BTC), который публикует Alternative.me. Новости, касающиеся только BCH, например обновление сети или разделение цепочки, в нём не отражаются.",
     "MVRV Z-Score рассчитывается по данным CoinMetrics. Однако большая часть предложения BCH была распределена держателям BTC в пропорции 1:1 при форке 2017 года, поэтому трактовать его как среднюю цену покупки участников рынка не так корректно, как для актива, который с первого дня покупали и продавали на рынке.",
     "Пороги Mayer Multiple (ниже 0,8 — сильная покупка, выше 2,4 — перегрев) и уровни просадки (-30% — повод присмотреться, -50% — сильная покупка) выведены из прошлых циклов биткоина. BCH годами оставался ниже максимума декабря 2017 года и в долгосрочной перспективе дешевел относительно BTC, так что одна лишь глубокая просадка ещё не означает дна.",
     "Объём торгов и ликвидность у BCH намного ниже, чем у BTC: одна крупная заявка или проблема на отдельной бирже может сильно сдвинуть дневную свечу. Пересечение 50/200 способно быстро разворачиваться туда и обратно, поэтому его лучше использовать как дополнительное подтверждение тренда."
    ],
    "histH": "Ценовые циклы Биткоин-кэша кратко",
    "hist": [
     "2017 — Торги начались после отделения от биткоина 1 августа; на пике декабрьского ралли установлен исторический максимум выше 4000 долларов.",
     "2018 — Резкое падение вокруг ноябрьского разделения с Bitcoin SV (так называемая хеш-война), в декабре цена опустилась ниже 100 долларов.",
     "2020 — Спор о правиле финансирования разработчиков при ноябрьском обновлении отделил цепочку сторонников Bitcoin ABC, которая в 2021 году была переименована в eCash (XEC).",
     "2021 — На бычьем рынке цена снова превысила 1000 долларов, но осталась далеко от максимума 2017 года.",
     "2023–2024 — В мае 2023 года появились CashTokens, а халвинг в апреле 2024 года снизил награду за блок до 3,125 BCH."
    ],
    "faq": [
     {
      "q": "Есть ли отдельный индекс страха и жадности для Биткоин-кэша?",
      "a": "Нет. Индекс Alternative.me, используемый здесь, — одно значение для всего криптовалютного рынка, отдельного значения для BCH не публикуется. Поэтому на карточке он помечен как общерыночный. Собственная динамика BCH видна в индикаторах, рассчитанных по его цене: RSI, MACD, просадке от максимума."
     },
     {
      "q": "Показывается ли MVRV Z-Score для Биткоин-кэша?",
      "a": "Да. В открытых данных CoinMetrics есть рыночная и реализованная капитализация BCH, поэтому расчёт возможен. В дни, когда данные не приходят, карточка показывает N/A, а оценка пересчитывается по остальным индикаторам с перераспределёнными весами."
     },
     {
      "q": "Стоит ли покупать Биткоин-кэш сейчас?",
      "a": "Эта страница не призывает покупать или продавать Биткоин-кэш. Оценка лишь показывает, на какую историческую зону похожа текущая ситуация. Высокий балл на вкладке долгосрочной (контрарианской) оценки означает, что совпали перепроданность, страх и глубокая просадка; низкий — что преобладают признаки перегрева. BCH волатильнее BTC, поэтому динамика за несколько дней говорит больше, чем значение за один день."
     },
     {
      "q": "Можно ли читать её по тем же порогам, что и для биткоина?",
      "a": "Формулы те же, но пороги значат другое. Уровни вроде Mayer 0,8/2,4 или просадок -30%/-50% взяты из истории биткоина; у BCH, который падал глубже и восстанавливался медленнее, чем BTC, сигналы на покупку могут загораться чаще. Высокий балл сам по себе не доказывает, что дно пройдено."
     },
     {
      "q": "Халвинг BCH происходит в тот же день, что и у биткоина?",
      "a": "Нет. У обоих награда уменьшается вдвое каждые 210 000 блоков, но после форка блоки создавались с разной скоростью, и даты разошлись. В 2024 году халвинг BCH прошёл в начале апреля, а BTC — около 20 апреля."
     },
     {
      "q": "Чем Биткоин-кэш отличается от Bitcoin SV и eCash?",
      "a": "У всех трёх общие корни, но это отдельные цепочки. Bitcoin SV отделился в ноябре 2018 года из-за разногласий о развитии протокола, а цепочка, ставшая eCash, — в ноябре 2020 года из-за правила финансирования разработчиков. Эта страница посвящена только Биткоин-кэшу с тикером BCH."
     }
    ]
   },
   "nl": {
    "title": "Bitcoin Cash (BCH): koop-timingscore en de indicatoren goed lezen",
    "intro": "Deze pagina past zeven indicatoren toe op de daggrafiek van Bitcoin Cash (BCH) — RSI(14), MACD(12·26·9), de Angst-en-hebzuchtindex, de Mayer Multiple, de daling vanaf de 365-daagse top, de golden/death cross 50/200 en de MVRV Z-Score — en vat ze samen in een score van 0 tot 100 met vijf zones, van STRONG BUY tot OVERHEATED. Hij is gratis en opent direct in de browser, zonder installatie. Hieronder staat wat je anders moet lezen als je deze indicatoren op Bitcoin Cash toepast.",
    "coinH": "Wat is Bitcoin Cash (BCH)?",
    "coinP": [
     "Bitcoin Cash splitste zich op 1 augustus 2017 via een hard fork af van Bitcoin, na een lang conflict over het vergroten van de blokgrootte. Het wordt gemined met hetzelfde SHA-256-proof-of-work als Bitcoin en wil peer-to-peer elektronisch geld zijn, met grotere blokken om betalingen snel en goedkoop te houden. Er is geen enkele oprichter: de fork werd gedreven door ontwikkelaars en miners die grotere blokken steunden, en de eerste node-implementatie was Bitcoin ABC. Wie op het moment van de fork BTC had, kreeg dezelfde hoeveelheid BCH.",
     "Het maximale aanbod is 21 miljoen munten, net als bij Bitcoin, en de blokbeloning halveert elke 210.000 blokken. De blokgroottelimiet begon op 8 MB en ging in mei 2018 naar 32 MB. In november 2018 splitste Bitcoin SV (BSV) zich af en in november 2020 de chain die later eCash (XEC) werd; de upgrade van mei 2023 voegde native tokens toe onder de naam CashTokens."
    ],
    "applyH": "Indicatoren toepassen op Bitcoin Cash",
    "apply": [
     "BCH beweegt meestal mee met Bitcoin, maar doorgaans met grotere uitslagen. De RSI zakt daardoor vaker onder 30 of stijgt vaker boven 70 dan bij BTC, en elk afzonderlijk signaal verdient minder gewicht.",
     "De Angst-en-hebzuchtindex is geen Bitcoin Cash-index, maar de sentimentmeter van Alternative.me voor de hele cryptomarkt (met BTC als zwaartepunt). Nieuws dat alleen BCH raakt, zoals een netwerkupgrade of een chainsplitsing, zie je er niet in terug.",
     "De MVRV Z-Score wordt berekend met data van CoinMetrics. Het grootste deel van het BCH-aanbod werd bij de fork van 2017 echter 1:1 aan BTC-houders uitgedeeld, dus hem lezen als de gemiddelde aankoopprijs van de markt is minder zuiver dan bij een asset dat vanaf dag één op de markt is gekocht en verkocht.",
     "De drempels van de Mayer Multiple (onder 0,8 sterk kopen, boven 2,4 oververhit) en de dalingsniveaus (-30% in de gaten houden, -50% sterk kopen) komen uit eerdere Bitcoin-cycli. BCH bleef jarenlang onder de top van december 2017 en verloor op lange termijn waarde ten opzichte van BTC; een diepe daling alleen betekent dus nog geen bodem.",
     "Handelsvolume en liquiditeit zijn veel kleiner dan bij BTC, waardoor één grote order of een probleem bij één beurs de dagcandle flink kan laten uitschieten. De 50/200-kruising kan binnen korte tijd heen en weer springen; gebruik hem liever als extra trendbevestiging."
    ],
    "histH": "De prijscycli van Bitcoin Cash in het kort",
    "hist": [
     "2017 — Handel begon na de afsplitsing van Bitcoin op 1 augustus; op het hoogtepunt van de rally in december volgde een recordkoers boven 4.000 dollar.",
     "2018 — Sterke daling rond de splitsing met Bitcoin SV in november (de zogeheten hash war) en in december een val tot onder 100 dollar.",
     "2020 — Onenigheid over een regel voor ontwikkelaarsfinanciering bij de upgrade van november splitste de chain van het Bitcoin ABC-kamp af, die in 2021 werd hernoemd tot eCash (XEC).",
     "2021 — In de bullmarkt weer boven 1.000 dollar, maar ver onder de top van 2017.",
     "2023–2024 — In mei 2023 kwamen CashTokens en de halvering van april 2024 verlaagde de blokbeloning naar 3,125 BCH."
    ],
    "faq": [
     {
      "q": "Bestaat er een aparte Angst-en-hebzuchtindex voor Bitcoin Cash?",
      "a": "Nee. De index van Alternative.me die hier wordt gebruikt, is één waarde voor de hele cryptomarkt; een aparte BCH-waarde wordt niet gepubliceerd. Daarom vermeldt de kaart dat het om een marktbrede index gaat. Het eigen gedrag van BCH zie je in de indicatoren die uit de BCH-koers worden berekend, zoals RSI, MACD en de daling vanaf de top."
     },
     {
      "q": "Krijgt Bitcoin Cash ook een MVRV Z-Score?",
      "a": "Ja. De openbare data van CoinMetrics bevatten de marktkapitalisatie en de gerealiseerde kapitalisatie van BCH, dus de berekening is mogelijk. Op dagen zonder data toont de kaart N/A en wordt de score opnieuw opgebouwd uit de overige indicatoren met aangepaste gewichten."
     },
     {
      "q": "Moet ik nu Bitcoin Cash kopen?",
      "a": "Deze pagina geeft geen koop- of verkoopadvies. De score laat alleen zien op welke historische zone de huidige situatie lijkt. Een hoge score op het tabblad lange termijn (contrair) betekent dat oversold-signalen, angst en een diepe daling samenvallen; een lage dat signalen van oververhitting overheersen. Omdat BCH volatieler is dan BTC, zegt het verloop over meerdere dagen meer dan de score van één dag."
     },
     {
      "q": "Kan ik hem lezen met dezelfde drempels als Bitcoin?",
      "a": "De formules zijn gelijk, maar de drempels betekenen iets anders. Niveaus als Mayer 0,8/2,4 of dalingen van -30%/-50% komen uit de geschiedenis van Bitcoin; bij BCH, dat dieper is gevallen en trager is hersteld dan BTC, kunnen koopsignalen vaker oplichten. Een hoge score alleen bewijst geen bodem."
     },
     {
      "q": "Valt de BCH-halvering op dezelfde dag als die van Bitcoin?",
      "a": "Nee. Beide halveren de beloning elke 210.000 blokken, maar sinds de fork zijn blokken in verschillend tempo gemaakt, waardoor de data uit elkaar liggen. In 2024 halveerde BCH begin april en BTC rond 20 april."
     },
     {
      "q": "Wat is het verschil tussen Bitcoin Cash, Bitcoin SV en eCash?",
      "a": "Alle drie hebben dezelfde oorsprong, maar het zijn aparte chains. Bitcoin SV splitste zich in november 2018 af vanwege de koers van het protocol, en de chain die eCash werd in november 2020 vanwege een regel voor ontwikkelaarsfinanciering. Deze pagina gaat alleen over Bitcoin Cash, ticker BCH."
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
