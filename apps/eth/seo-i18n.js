/* 하단 SEO 본문 다국어 데이터 + 렌더러. index.html(광고) / member/index.html(구독자) 공유.
   언어 전환 시 window.renderSEO(lang) 호출 → section.seo 를 해당 언어로 다시 그림.
   기본 정적 HTML(한국어)은 무JS 크롤러용 폴백으로 남겨두고, JS 실행 시 현재 언어로 교체. */
(function () {
  var SEO = {
    ko: {
      title: '이더리움 공포·탐욕 지수 & 매수 타이밍 점수',
      intro: '이더리움 공포지수(공포·탐욕 지수, Fear & Greed Index)를 포함한 7개 실시간 지표를 합성해 “지금이 매수 타이밍인가?”를 0~100 점수로 보여주는 무료 대시보드입니다. 설치 없이 브라우저에서 바로 실행되며 13개 언어를 지원합니다.',
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
        { q: '공포지수가 낮으면 이더리움을 사야 하나요?', a: '극단적 공포는 역사적으로 분할 매수 기회였던 경우가 많지만, 공포지수 하나만 보면 “떨어지는 칼날”을 잡을 위험이 있습니다. 본 점수는 RSI·MACD·마이어 배수·낙폭·이동평균 크로스를 함께 보고, 하락 추세에서는 점수를 보수적으로 낮춥니다.' },
        { q: '매수 타이밍 점수는 어떻게 계산되나요?', a: '7개 지표를 각각 0~100 부분점수로 환산해 가중 합성합니다. 결과는 0~100이며 5단계 밴드로 표시됩니다.' },
        { q: '무료인가요? 설치가 필요한가요?', a: '완전 무료이며 설치가 필요 없습니다. CoinGecko·Binance·Alternative.me 공개 API에서 실시간 데이터를 가져옵니다.' },
        { q: '공포지수와 매수 타이밍 점수는 무엇이 다른가요?', a: '공포지수는 심리 한 가지 지표(0~100)이고, 매수 타이밍 점수는 공포지수를 포함한 7개 지표를 합성한 종합 점수(0~100)입니다.' },
        { q: '공포지수 데이터는 어디서 가져오나요? 얼마나 자주 갱신되나요?', a: '공포·탐욕 지수는 Alternative.me, 가격·일봉은 CoinGecko·Binance, 온체인 지표는 CoinMetrics 공개 API에서 실시간으로 가져옵니다. 화면은 약 1분 주기로 자동 갱신됩니다.' },
        { q: '이더리움 지금 사도 되나요?', a: '정답은 없지만, 매수 타이밍 점수(0~100)로 현재 시장이 과매도·공포 구간인지 과열·탐욕 구간인지 객관적으로 가늠할 수 있습니다. 장기(역발상) 탭 기준 점수가 높을수록 공포·저평가가 겹친 분할 매수 우호 구간, 낮을수록 과열 경계 구간입니다. 참고 신호일 뿐 투자 자문이 아닙니다.' },
        { q: '단기와 장기 매수 타이밍은 어떻게 다른가요?', a: '점수는 단기·장기 두 탭으로 나뉩니다. 단기(모멘텀)는 약 1~3개월 추세추종 관점으로 상승 추세가 강할수록 높고, 장기(역발상)는 약 1년 이상 사이클 관점으로 공포·저평가일수록 높습니다. 2017년 이후 백테스트에서 단기는 모멘텀, 장기는 역발상 방향이 더 잘 맞았습니다.' },
        { q: 'BOTTOM RADAR(바닥 점수)는 무엇인가요?', a: 'MVRV Z-점수 같은 온체인 지표로 시가총액이 투자자 평균 매수원가 대비 어디에 있는지 재서, 역사적 바닥 구간과의 근접도를 0~100으로 보여주는 보조 게이지입니다. 계산 근거는 “비트코인 바닥” 해설 페이지에 공개되어 있습니다.' }
      ],
      disclaimer: '⚠ 본 점수는 공개 지표를 합성한 참고 신호이며 투자 자문이 아닙니다. 모든 투자 판단과 책임은 이용자 본인에게 있습니다.'
    },
    en: {
      title: 'Ethereum Fear & Greed Index & Buy-Timing Score',
      intro: 'A free dashboard that synthesizes 7 real-time indicators — including the Ethereum Fear & Greed Index — into a 0–100 “is now a good time to buy?” score. Runs in your browser with no install, in 13 languages.',
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
        { q: 'Should I buy Ethereum when the index is low?', a: 'Extreme fear has often been an accumulation opportunity, but relying on the index alone risks catching a falling knife. This score also weighs RSI, MACD, Mayer Multiple, drawdown and moving-average crosses, and lowers the score conservatively in downtrends.' },
        { q: 'How is the buy-timing score calculated?', a: 'Each of the 7 indicators is converted to a 0–100 sub-score and weighted together. The result is 0–100, shown in 5 bands.' },
        { q: 'Is it free? Do I need to install anything?', a: 'It is completely free with no install. Real-time data comes from CoinGecko, Binance and Alternative.me public APIs.' },
        { q: 'How is the index different from the buy-timing score?', a: 'The index is a single sentiment metric (0–100); the buy-timing score is a composite of 7 indicators including the index (0–100).' },
        { q: 'Where does the data come from, and how often does it refresh?', a: 'The Fear & Greed Index comes from Alternative.me, prices and daily candles from the CoinGecko and Binance public APIs, and on-chain metrics from CoinMetrics. The screen auto-refreshes roughly every minute.' },
        { q: 'Should I buy Ethereum right now?', a: 'There is no single answer, but the buy-timing score (0–100) gives an objective read on whether the market is in an oversold/fear zone or an overheated/greed zone. On the long-term (contrarian) tab, higher scores mark zones where fear and undervaluation overlap — historically favorable for DCA — while lower scores warn of overheating. It is a reference signal, not investment advice.' },
        { q: 'How do short-term and long-term buy timing differ?', a: 'The score is split into two tabs. Short-term (momentum) takes a 1–3 month trend-following view and rises with strong uptrends; long-term (contrarian) takes a 1-year-plus cycle view and rises with fear and undervaluation. In backtests since 2017, momentum worked better short-term and contrarian worked better long-term.' },
        { q: 'What is the BOTTOM RADAR (bottom score)?', a: 'A secondary gauge that uses on-chain metrics such as the MVRV Z-Score to measure where market cap sits relative to investors’ average cost basis, showing proximity to historic bottom zones on a 0–100 scale. The full calculation is published on the “Bitcoin bottom” guide page.' }
      ],
      disclaimer: '⚠ This score is a reference signal built from public indicators, not investment advice. All decisions and responsibility are your own.'
    },
    ja: {
      title: 'イーサリアム 恐怖・強欲指数 & 買い時スコア',
      intro: 'イーサリアムの恐怖・強欲指数（Fear & Greed Index）を含む7つのリアルタイム指標を合成し、「今が買い時か？」を0〜100のスコアで示す無料ダッシュボードです。インストール不要でブラウザから即実行、13言語対応。',
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
        { q: '指数が低ければイーサリアムを買うべき？', a: '極端な恐怖は歴史的に分割買いの好機だったことが多いですが、指数だけに頼ると「落ちるナイフ」を掴む危険があります。本スコアはRSI・MACD・マイヤー倍率・下落率・移動平均クロスも合わせて見て、下落トレンドでは保守的にスコアを下げます。' },
        { q: '買い時スコアはどう計算される？', a: '7指標をそれぞれ0〜100の部分スコアに換算し加重合成します。結果は0〜100で、5段階バンドで表示します。' },
        { q: '無料？インストールは必要？', a: '完全無料・インストール不要です。CoinGecko・Binance・Alternative.me の公開APIからリアルタイムデータを取得します。' },
        { q: '指数と買い時スコアの違いは？', a: '指数は心理1指標(0〜100)、買い時スコアは指数を含む7指標を合成した総合スコア(0〜100)です。' },
        { q: 'データはどこから？更新頻度は？', a: '恐怖・強欲指数はAlternative.me、価格・日足はCoinGecko・Binance、オンチェーン指標はCoinMetricsの公開APIからリアルタイムで取得します。画面は約1分ごとに自動更新されます。' },
        { q: 'イーサリアムは今買ってもいい？', a: '正解はありませんが、買い時スコア(0〜100)で現在の市場が売られすぎ・恐怖圏か、過熱・強欲圏かを客観的に測れます。長期（逆張り）タブではスコアが高いほど恐怖と割安が重なる分割買いに有利な圏、低いほど過熱警戒圏です。参考シグナルであり投資助言ではありません。' },
        { q: '短期と長期の買い時はどう違う？', a: 'スコアは短期・長期の2タブに分かれます。短期（モメンタム）は約1〜3か月のトレンドフォロー視点で上昇トレンドが強いほど高く、長期（逆張り）は約1年以上のサイクル視点で恐怖・割安なほど高くなります。2017年以降のバックテストでは、短期はモメンタム、長期は逆張りの方向がより有効でした。' },
        { q: 'BOTTOM RADAR（底値スコア）とは？', a: 'MVRV Zスコアなどのオンチェーン指標で、時価総額が投資家の平均取得単価に対してどの位置にあるかを測り、歴史的な底値圏への近さを0〜100で示す補助ゲージです。計算根拠は「ビットコインの底」解説ページで公開しています。' }
      ],
      disclaimer: '⚠ 本スコアは公開指標を合成した参考シグナルであり、投資助言ではありません。すべての判断と責任は利用者ご自身にあります。'
    },
    zh: {
      title: '以太坊恐惧与贪婪指数 & 买入时机评分',
      intro: '一个免费仪表板，将包括以太坊恐惧与贪婪指数（Fear & Greed Index）在内的7个实时指标合成为0–100的“现在是买入时机吗？”评分。无需安装，浏览器即开即用，支持13种语言。',
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
        { q: '指数低就该买以太坊吗？', a: '极度恐惧在历史上常是分批买入良机，但只看指数有“接飞刀”的风险。本评分同时参考RSI、MACD、梅耶倍数、回撤与均线交叉，并在下跌趋势中保守下调评分。' },
        { q: '买入时机评分如何计算？', a: '将7个指标各自换算为0–100分项评分并加权合成。结果为0–100，以5档显示。' },
        { q: '免费吗？需要安装吗？', a: '完全免费、无需安装。实时数据来自 CoinGecko、Binance、Alternative.me 公开API。' },
        { q: '指数与买入时机评分有何不同？', a: '指数是单一情绪指标(0–100)；买入时机评分是包含该指数在内的7指标综合评分(0–100)。' },
        { q: '数据来自哪里？多久更新一次？', a: '恐惧与贪婪指数来自Alternative.me，价格与日K来自CoinGecko和Binance公开API，链上指标来自CoinMetrics。页面约每1分钟自动刷新。' },
        { q: '现在可以买以太坊吗？', a: '没有标准答案，但买入时机评分(0–100)能客观判断当前市场处于超卖·恐惧区还是过热·贪婪区。在长期（逆向）标签页中，评分越高代表恐惧与低估重叠、历史上利于分批买入的区间；越低则是过热警戒区。仅供参考，并非投资建议。' },
        { q: '短期和长期买入时机有何不同？', a: '评分分为短期、长期两个标签页。短期（动量）以约1–3个月的趋势跟随视角，上升趋势越强评分越高；长期（逆向）以约1年以上的周期视角，越恐惧、越低估评分越高。2017年以来的回测显示，短期动量、长期逆向的方向更有效。' },
        { q: 'BOTTOM RADAR（底部评分）是什么？', a: '一个辅助仪表，利用MVRV Z分数等链上指标衡量市值相对投资者平均持仓成本的位置，以0–100显示与历史底部区间的接近程度。计算依据在“比特币底部”解读页面公开。' }
      ],
      disclaimer: '⚠ 本评分由公开指标合成，仅供参考，并非投资建议。一切投资决定与责任由用户自负。'
    },
    'zh-Hant': {
      title: '以太幣恐懼與貪婪指數 & 買入時機評分',
      intro: '一個免費儀表板，將包括以太幣恐懼與貪婪指數（Fear & Greed Index）在內的7個即時指標合成為0–100的「現在是買入時機嗎？」評分。免安裝、瀏覽器即開即用，支援13種語言。',
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
        { q: '指數低就該買以太幣嗎？', a: '極度恐懼在歷史上常是分批買入良機，但只看指數有「接飛刀」的風險。本評分同時參考RSI、MACD、梅耶倍數、回撤與均線交叉，並在下跌趨勢中保守下調評分。' },
        { q: '買入時機評分如何計算？', a: '將7個指標各自換算為0–100分項評分並加權合成。結果為0–100，以5檔顯示。' },
        { q: '免費嗎？需要安裝嗎？', a: '完全免費、免安裝。即時資料來自 CoinGecko、Binance、Alternative.me 公開API。' },
        { q: '指數與買入時機評分有何不同？', a: '指數是單一情緒指標(0–100)；買入時機評分是包含該指數在內的7指標綜合評分(0–100)。' },
        { q: '資料來自哪裡？多久更新一次？', a: '恐懼與貪婪指數來自Alternative.me，價格與日K來自CoinGecko和Binance公開API，鏈上指標來自CoinMetrics。頁面約每1分鐘自動重新整理。' },
        { q: '現在可以買以太幣嗎？', a: '沒有標準答案，但買入時機評分(0–100)能客觀判斷當前市場處於超賣·恐懼區還是過熱·貪婪區。在長期（逆向）分頁中，評分越高代表恐懼與低估重疊、歷史上利於分批買入的區間；越低則是過熱警戒區。僅供參考，並非投資建議。' },
        { q: '短期和長期買入時機有何不同？', a: '評分分為短期、長期兩個分頁。短期（動量）以約1–3個月的趨勢跟隨視角，上升趨勢越強評分越高；長期（逆向）以約1年以上的週期視角，越恐懼、越低估評分越高。2017年以來的回測顯示，短期動量、長期逆向的方向更有效。' },
        { q: 'BOTTOM RADAR（底部評分）是什麼？', a: '一個輔助儀表，利用MVRV Z分數等鏈上指標衡量市值相對投資者平均持倉成本的位置，以0–100顯示與歷史底部區間的接近程度。計算依據在「比特幣底部」解說頁面公開。' }
      ],
      disclaimer: '⚠ 本評分由公開指標合成，僅供參考，並非投資建議。一切投資決定與責任由用戶自負。'
    },
    es: {
      title: 'Índice de miedo y codicia de Ethereum y puntuación de momento de compra',
      intro: 'Un panel gratuito que sintetiza 7 indicadores en tiempo real —incluido el índice de miedo y codicia de Ethereum— en una puntuación de 0 a 100 sobre «¿es buen momento para comprar?». Funciona en el navegador sin instalación, en 13 idiomas.',
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
        { q: '¿Debo comprar Ethereum cuando el índice está bajo?', a: 'El miedo extremo ha sido a menudo una oportunidad de acumulación, pero fiarse solo del índice arriesga «atrapar un cuchillo que cae». Esta puntuación también pondera RSI, MACD, múltiplo de Mayer, caída y cruces de medias, y la reduce de forma conservadora en tendencias bajistas.' },
        { q: '¿Cómo se calcula la puntuación de compra?', a: 'Cada uno de los 7 indicadores se convierte en una subpuntuación de 0 a 100 y se pondera. El resultado es 0–100, mostrado en 5 bandas.' },
        { q: '¿Es gratis? ¿Necesito instalar algo?', a: 'Es totalmente gratis y sin instalación. Los datos en tiempo real provienen de las API públicas de CoinGecko, Binance y Alternative.me.' },
        { q: '¿En qué se diferencia el índice de la puntuación de compra?', a: 'El índice es una sola métrica de sentimiento (0–100); la puntuación de compra es un compuesto de 7 indicadores que incluye el índice (0–100).' },
        { q: '¿De dónde vienen los datos y con qué frecuencia se actualizan?', a: 'El índice de miedo y codicia viene de Alternative.me; los precios y velas diarias, de las API públicas de CoinGecko y Binance; y las métricas on-chain, de CoinMetrics. La pantalla se actualiza automáticamente cada minuto aproximadamente.' },
        { q: '¿Debería comprar Ethereum ahora mismo?', a: 'No hay una respuesta única, pero la puntuación de compra (0–100) permite valorar objetivamente si el mercado está en zona de sobreventa/miedo o de recalentamiento/codicia. En la pestaña de largo plazo (contraria), puntuaciones altas marcan zonas donde coinciden miedo e infravaloración —históricamente favorables al DCA—, y las bajas avisan de recalentamiento. Es una señal de referencia, no asesoramiento de inversión.' },
        { q: '¿En qué se diferencian el timing de corto y de largo plazo?', a: 'La puntuación se divide en dos pestañas. El corto plazo (momentum) adopta una visión de seguimiento de tendencia de 1–3 meses y sube con tendencias alcistas fuertes; el largo plazo (contrario) adopta una visión de ciclo de más de un año y sube con miedo e infravaloración. En backtests desde 2017, el momentum funcionó mejor a corto y lo contrario a largo.' },
        { q: '¿Qué es el BOTTOM RADAR (puntuación de suelo)?', a: 'Un indicador auxiliar que usa métricas on-chain como el MVRV Z-Score para medir dónde está la capitalización respecto al coste medio de los inversores, mostrando la cercanía a zonas de suelo históricas en una escala de 0 a 100. El cálculo completo está publicado en la guía «suelo de Bitcoin».' }
      ],
      disclaimer: '⚠ Esta puntuación es una señal de referencia a partir de indicadores públicos, no asesoramiento de inversión. Todas las decisiones y la responsabilidad son tuyas.'
    },
    fr: {
      title: 'Indice de peur et d’avidité Ethereum et score de timing d’achat',
      intro: 'Un tableau de bord gratuit qui synthétise 7 indicateurs en temps réel — dont l’indice de peur et d’avidité Ethereum — en un score de 0 à 100 « est-ce le bon moment pour acheter ? ». Fonctionne dans le navigateur sans installation, en 13 langues.',
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
        { q: 'Dois-je acheter du Ethereum quand l’indice est bas ?', a: 'La peur extrême a souvent été une opportunité d’accumulation, mais se fier au seul indice risque d’« attraper un couteau qui tombe ». Ce score pondère aussi RSI, MACD, multiple de Mayer, repli et croisements de moyennes, et le réduit prudemment en tendance baissière.' },
        { q: 'Comment le score de timing d’achat est-il calculé ?', a: 'Chacun des 7 indicateurs est converti en sous-score de 0 à 100 puis pondéré. Le résultat est 0–100, affiché en 5 bandes.' },
        { q: 'Est-ce gratuit ? Faut-il installer quelque chose ?', a: 'C’est entièrement gratuit et sans installation. Les données en temps réel proviennent des API publiques de CoinGecko, Binance et Alternative.me.' },
        { q: 'Quelle différence entre l’indice et le score de timing d’achat ?', a: 'L’indice est une seule mesure de sentiment (0–100) ; le score de timing d’achat est un composite de 7 indicateurs incluant l’indice (0–100).' },
        { q: 'D’où viennent les données et à quelle fréquence sont-elles actualisées ?', a: 'L’indice de peur et d’avidité vient d’Alternative.me ; les prix et bougies journalières, des API publiques de CoinGecko et Binance ; et les métriques on-chain, de CoinMetrics. L’écran se rafraîchit automatiquement environ chaque minute.' },
        { q: 'Dois-je acheter du Ethereum maintenant ?', a: 'Il n’y a pas de réponse unique, mais le score de timing d’achat (0–100) permet d’évaluer objectivement si le marché est en zone de survente/peur ou de surchauffe/avidité. Dans l’onglet long terme (contrarian), des scores élevés marquent des zones où peur et sous-évaluation se recoupent — historiquement favorables au DCA — tandis que des scores bas signalent la surchauffe. C’est un signal de référence, pas un conseil en investissement.' },
        { q: 'Quelle différence entre le timing court terme et long terme ?', a: 'Le score est divisé en deux onglets. Le court terme (momentum) adopte une vue de suivi de tendance sur 1 à 3 mois et monte avec les tendances haussières fortes ; le long terme (contrarian) adopte une vue de cycle d’un an et plus et monte avec la peur et la sous-évaluation. Dans les backtests depuis 2017, le momentum a mieux fonctionné à court terme et le contrarian à long terme.' },
        { q: 'Qu’est-ce que le BOTTOM RADAR (score de plancher) ?', a: 'Une jauge auxiliaire qui utilise des métriques on-chain comme le MVRV Z-Score pour mesurer où se situe la capitalisation par rapport au coût moyen des investisseurs, en montrant la proximité des zones de plancher historiques sur une échelle de 0 à 100. Le calcul complet est publié sur la page « plancher du Bitcoin ».' }
      ],
      disclaimer: '⚠ Ce score est un signal de référence issu d’indicateurs publics, pas un conseil en investissement. Toutes les décisions et la responsabilité vous appartiennent.'
    },
    de: {
      title: 'Ethereum Angst- & Gier-Index & Kaufzeitpunkt-Score',
      intro: 'Ein kostenloses Dashboard, das 7 Echtzeit-Indikatoren — inkl. Ethereum Angst- & Gier-Index — zu einem 0–100-Score „Ist jetzt ein guter Kaufzeitpunkt?“ zusammenführt. Läuft im Browser ohne Installation, in 13 Sprachen.',
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
        { q: 'Soll ich Ethereum kaufen, wenn der Index niedrig ist?', a: 'Extreme Angst war historisch oft eine Akkumulationschance, doch sich allein auf den Index zu verlassen, birgt das Risiko, „ins fallende Messer zu greifen“. Dieser Score gewichtet auch RSI, MACD, Mayer-Multiple, Rückgang und MA-Kreuzungen und senkt den Wert in Abwärtstrends konservativ.' },
        { q: 'Wie wird der Kaufzeitpunkt-Score berechnet?', a: 'Jeder der 7 Indikatoren wird in einen 0–100-Teil-Score umgerechnet und gewichtet. Das Ergebnis ist 0–100, in 5 Bändern dargestellt.' },
        { q: 'Ist es kostenlos? Muss ich etwas installieren?', a: 'Es ist völlig kostenlos und ohne Installation. Echtzeitdaten stammen aus den öffentlichen APIs von CoinGecko, Binance und Alternative.me.' },
        { q: 'Wie unterscheidet sich der Index vom Kaufzeitpunkt-Score?', a: 'Der Index ist eine einzelne Stimmungskennzahl (0–100); der Kaufzeitpunkt-Score ist ein Verbund aus 7 Indikatoren inkl. Index (0–100).' },
        { q: 'Woher stammen die Daten und wie oft werden sie aktualisiert?', a: 'Der Angst- & Gier-Index stammt von Alternative.me, Preise und Tageskerzen von den öffentlichen APIs von CoinGecko und Binance, On-Chain-Metriken von CoinMetrics. Der Bildschirm aktualisiert sich etwa jede Minute automatisch.' },
        { q: 'Sollte ich Ethereum jetzt kaufen?', a: 'Eine eindeutige Antwort gibt es nicht, aber der Kaufzeitpunkt-Score (0–100) zeigt objektiv, ob der Markt in einer überverkauften Angst-Zone oder einer überhitzten Gier-Zone steckt. Auf dem Langfrist-Tab (antizyklisch) markieren hohe Werte Zonen, in denen Angst und Unterbewertung zusammenfallen — historisch günstig für DCA —, niedrige warnen vor Überhitzung. Ein Referenzsignal, keine Anlageberatung.' },
        { q: 'Wie unterscheiden sich kurz- und langfristiges Kauftiming?', a: 'Der Score ist in zwei Tabs geteilt. Kurzfristig (Momentum) folgt einer Trendfolge-Sicht von 1–3 Monaten und steigt mit starken Aufwärtstrends; langfristig (antizyklisch) folgt einer Zyklus-Sicht von über einem Jahr und steigt mit Angst und Unterbewertung. In Backtests seit 2017 funktionierte kurzfristig Momentum und langfristig die antizyklische Richtung besser.' },
        { q: 'Was ist der BOTTOM RADAR (Boden-Score)?', a: 'Eine Zusatzanzeige, die mit On-Chain-Metriken wie den MVRV Z-Score misst, wo die Marktkapitalisierung relativ zum durchschnittlichen Einstandskurs der Anleger liegt, und die Nähe zu historischen Bodenzonen auf einer Skala von 0–100 zeigt. Die vollständige Berechnung ist auf der Seite „Bitcoin-Boden“ veröffentlicht.' }
      ],
      disclaimer: '⚠ Dieser Score ist ein Referenzsignal aus öffentlichen Indikatoren, keine Anlageberatung. Alle Entscheidungen und die Verantwortung liegen bei Ihnen.'
    },
    it: {
      title: 'Indice di paura e avidità Ethereum e punteggio di timing d’acquisto',
      intro: 'Una dashboard gratuita che sintetizza 7 indicatori in tempo reale — incluso l’indice di paura e avidità di Ethereum — in un punteggio 0–100 «è il momento giusto per comprare?». Funziona nel browser senza installazione, in 13 lingue.',
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
        { q: 'Dovrei comprare Ethereum quando l’indice è basso?', a: 'La paura estrema è stata spesso un’occasione di accumulo, ma affidarsi solo all’indice rischia di «prendere un coltello che cade». Questo punteggio pesa anche RSI, MACD, multiplo di Mayer, ribasso e incroci di medie, e lo riduce in modo prudente nei trend ribassisti.' },
        { q: 'Come si calcola il punteggio d’acquisto?', a: 'Ciascuno dei 7 indicatori è convertito in un sotto-punteggio 0–100 e ponderato. Il risultato è 0–100, mostrato in 5 bande.' },
        { q: 'È gratis? Serve installare qualcosa?', a: 'È completamente gratis e senza installazione. I dati in tempo reale provengono dalle API pubbliche di CoinGecko, Binance e Alternative.me.' },
        { q: 'Che differenza c’è tra l’indice e il punteggio d’acquisto?', a: 'L’indice è una singola misura di sentiment (0–100); il punteggio d’acquisto è un composito dei 7 indicatori incluso l’indice (0–100).' },
        { q: 'Da dove vengono i dati e con che frequenza si aggiornano?', a: 'L’indice di paura e avidità viene da Alternative.me; prezzi e candele giornaliere dalle API pubbliche di CoinGecko e Binance; le metriche on-chain da CoinMetrics. Lo schermo si aggiorna automaticamente circa ogni minuto.' },
        { q: 'Dovrei comprare Ethereum adesso?', a: 'Non c’è una risposta unica, ma il punteggio d’acquisto (0–100) permette di valutare oggettivamente se il mercato è in zona ipervenduto/paura o surriscaldato/avidità. Nella scheda a lungo termine (contrarian), punteggi alti indicano zone in cui paura e sottovalutazione coincidono — storicamente favorevoli al PAC — mentre punteggi bassi avvertono del surriscaldamento. È un segnale di riferimento, non consulenza d’investimento.' },
        { q: 'Che differenza c’è tra timing a breve e a lungo termine?', a: 'Il punteggio è diviso in due schede. Il breve termine (momentum) adotta una visione trend-following di 1–3 mesi e sale con trend rialzisti forti; il lungo termine (contrarian) adotta una visione di ciclo oltre l’anno e sale con paura e sottovalutazione. Nei backtest dal 2017, il momentum ha funzionato meglio nel breve e il contrarian nel lungo.' },
        { q: 'Cos’è il BOTTOM RADAR (punteggio di minimo)?', a: 'Un indicatore ausiliario che usa metriche on-chain come l’MVRV Z-Score per misurare dove si trova la capitalizzazione rispetto al costo medio degli investitori, mostrando la vicinanza alle zone di minimo storiche su una scala 0–100. Il calcolo completo è pubblicato nella guida «minimo di Bitcoin».' }
      ],
      disclaimer: '⚠ Questo punteggio è un segnale di riferimento da indicatori pubblici, non consulenza d’investimento. Ogni decisione e responsabilità è tua.'
    },
    pt: {
      title: 'Índice de medo e ganância do Ethereum e pontuação de momento de compra',
      intro: 'Um painel gratuito que sintetiza 7 indicadores em tempo real — incluindo o índice de medo e ganância do Ethereum — numa pontuação de 0 a 100 «é uma boa hora para comprar?». Roda no navegador sem instalação, em 13 idiomas.',
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
        { q: 'Devo comprar Ethereum quando o índice está baixo?', a: 'O medo extremo foi muitas vezes uma oportunidade de acumulação, mas confiar só no índice arrisca «pegar uma faca caindo». Esta pontuação também pondera RSI, MACD, múltiplo de Mayer, queda e cruzamentos de médias, e a reduz de forma conservadora em tendências de baixa.' },
        { q: 'Como a pontuação de compra é calculada?', a: 'Cada um dos 7 indicadores é convertido numa subpontuação de 0 a 100 e ponderado. O resultado é 0–100, em 5 faixas.' },
        { q: 'É grátis? Preciso instalar algo?', a: 'É totalmente grátis e sem instalação. Os dados em tempo real vêm das APIs públicas da CoinGecko, Binance e Alternative.me.' },
        { q: 'Qual a diferença entre o índice e a pontuação de compra?', a: 'O índice é uma única métrica de sentimento (0–100); a pontuação de compra é um composto de 7 indicadores incluindo o índice (0–100).' },
        { q: 'De onde vêm os dados e com que frequência são atualizados?', a: 'O índice de medo e ganância vem da Alternative.me; preços e velas diárias, das APIs públicas da CoinGecko e da Binance; e as métricas on-chain, da CoinMetrics. A tela atualiza automaticamente a cada minuto, aproximadamente.' },
        { q: 'Devo comprar Ethereum agora?', a: 'Não há resposta única, mas a pontuação de compra (0–100) permite avaliar objetivamente se o mercado está em zona de sobrevenda/medo ou de superaquecimento/ganância. Na aba de longo prazo (contrária), pontuações altas marcam zonas onde medo e subvalorização coincidem — historicamente favoráveis ao DCA —, e as baixas alertam para superaquecimento. É um sinal de referência, não consultoria de investimento.' },
        { q: 'Qual a diferença entre o timing de curto e de longo prazo?', a: 'A pontuação divide-se em duas abas. O curto prazo (momentum) adota uma visão de seguimento de tendência de 1–3 meses e sobe com tendências de alta fortes; o longo prazo (contrário) adota uma visão de ciclo de mais de um ano e sobe com medo e subvalorização. Em backtests desde 2017, o momentum funcionou melhor no curto e o contrário no longo.' },
        { q: 'O que é o BOTTOM RADAR (pontuação de fundo)?', a: 'Um medidor auxiliar que usa métricas on-chain como o MVRV Z-Score para medir onde a capitalização está em relação ao custo médio dos investidores, mostrando a proximidade de zonas de fundo históricas numa escala de 0 a 100. O cálculo completo está publicado no guia «fundo do Bitcoin».' }
      ],
      disclaimer: '⚠ Esta pontuação é um sinal de referência a partir de indicadores públicos, não é consultoria de investimento. Todas as decisões e a responsabilidade são suas.'
    },
    ru: {
      title: 'Индекс страха и жадности эфириума и оценка времени покупки',
      intro: 'Бесплатная панель, которая объединяет 7 индикаторов в реальном времени — включая индекс страха и жадности эфириума — в оценку от 0 до 100 «подходящее ли сейчас время для покупки?». Работает в браузере без установки, на 13 языках.',
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
        { q: 'Покупать ли эфириум, когда индекс низкий?', a: 'Крайний страх исторически часто был возможностью накопления, но полагаться только на индекс рискованно — можно «поймать падающий нож». Эта оценка также учитывает RSI, MACD, множитель Майера, просадку и пересечения средних и консервативно снижается в нисходящих трендах.' },
        { q: 'Как рассчитывается оценка покупки?', a: 'Каждый из 7 индикаторов переводится в частную оценку 0–100 и взвешивается. Результат — 0–100, в 5 диапазонах.' },
        { q: 'Это бесплатно? Нужно ли что-то устанавливать?', a: 'Полностью бесплатно и без установки. Данные в реальном времени берутся из публичных API CoinGecko, Binance и Alternative.me.' },
        { q: 'Чем индекс отличается от оценки покупки?', a: 'Индекс — одна метрика настроения (0–100); оценка покупки — составной показатель из 7 индикаторов, включая индекс (0–100).' },
        { q: 'Откуда берутся данные и как часто они обновляются?', a: 'Индекс страха и жадности — с Alternative.me; цены и дневные свечи — из публичных API CoinGecko и Binance; ончейн-метрики — из CoinMetrics. Экран автоматически обновляется примерно раз в минуту.' },
        { q: 'Стоит ли покупать эфириум прямо сейчас?', a: 'Единственно верного ответа нет, но оценка покупки (0–100) объективно показывает, находится ли рынок в зоне перепроданности/страха или перегрева/жадности. На вкладке долгосрочного (контртрендового) взгляда высокие значения отмечают зоны, где совпадают страх и недооценка — исторически благоприятные для усреднения, — а низкие предупреждают о перегреве. Это справочный сигнал, а не инвестиционная рекомендация.' },
        { q: 'Чем отличаются краткосрочный и долгосрочный тайминг?', a: 'Оценка разделена на две вкладки. Краткосрочная (моментум) использует трендследящий взгляд на 1–3 месяца и растёт при сильных восходящих трендах; долгосрочная (контртренд) — циклический взгляд от года и растёт при страхе и недооценке. В бэктестах с 2017 года на коротком горизонте лучше работал моментум, на длинном — контртренд.' },
        { q: 'Что такое BOTTOM RADAR (оценка дна)?', a: 'Вспомогательный индикатор, который с помощью ончейн-метрик, таких как MVRV Z-оценка, измеряет положение капитализации относительно средней цены входа инвесторов и показывает близость к историческим зонам дна по шкале 0–100. Полный расчёт опубликован на странице «дно биткоина».' }
      ],
      disclaimer: '⚠ Эта оценка — справочный сигнал на основе публичных индикаторов, а не инвестиционная рекомендация. Все решения и ответственность — на вас.'
    },
    nl: {
      title: 'Ethereum Angst- & Hebzucht-index en koopmoment-score',
      intro: 'Een gratis dashboard dat 7 realtime indicatoren — inclusief de Ethereum Angst- & Hebzucht-index — samenvoegt tot een score van 0–100 voor «is het nu een goed moment om te kopen?». Draait in de browser zonder installatie, in 13 talen.',
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
        { q: 'Moet ik Ethereum kopen als de index laag is?', a: 'Extreme angst was vaak een accumulatiekans, maar alleen op de index vertrouwen riskeert «een vallend mes te vangen». Deze score weegt ook RSI, MACD, Mayer Multiple, daling en gemiddelde-kruisingen mee, en verlaagt de score behoudend in dalende trends.' },
        { q: 'Hoe wordt de koopmoment-score berekend?', a: 'Elk van de 7 indicatoren wordt omgezet naar een deelscore van 0–100 en gewogen. Het resultaat is 0–100, in 5 banden.' },
        { q: 'Is het gratis? Moet ik iets installeren?', a: 'Het is volledig gratis en zonder installatie. Realtime data komt van de publieke API’s van CoinGecko, Binance en Alternative.me.' },
        { q: 'Wat is het verschil tussen de index en de koopmoment-score?', a: 'De index is één sentimentmaatstaf (0–100); de koopmoment-score is een samenstelling van 7 indicatoren inclusief de index (0–100).' },
        { q: 'Waar komen de gegevens vandaan en hoe vaak worden ze ververst?', a: 'De Angst- & Hebzucht-index komt van Alternative.me; prijzen en dagcandles van de publieke API’s van CoinGecko en Binance; on-chain-metrieken van CoinMetrics. Het scherm ververst ongeveer elke minuut automatisch.' },
        { q: 'Moet ik nu Ethereum kopen?', a: 'Er is geen eenduidig antwoord, maar de koopmoment-score (0–100) geeft een objectief beeld of de markt in een oversold/angst-zone of een oververhitte/hebzucht-zone zit. Op het langetermijn-tabblad (tegendraads) markeren hoge scores zones waar angst en onderwaardering samenvallen — historisch gunstig voor DCA — terwijl lage scores waarschuwen voor oververhitting. Het is een referentiesignaal, geen beleggingsadvies.' },
        { q: 'Hoe verschillen korte- en langetermijn-kooptiming?', a: 'De score is verdeeld over twee tabbladen. Korte termijn (momentum) hanteert een trendvolgende blik van 1–3 maanden en stijgt bij sterke opwaartse trends; lange termijn (tegendraads) hanteert een cyclusblik van ruim een jaar en stijgt bij angst en onderwaardering. In backtests sinds 2017 werkte momentum beter op korte termijn en tegendraads beter op lange termijn.' },
        { q: 'Wat is de BOTTOM RADAR (bodemscore)?', a: 'Een hulpmeter die met on-chain-metrieken zoals de MVRV Z-score meet waar de marktkapitalisatie staat ten opzichte van de gemiddelde kostprijs van beleggers, en de nabijheid van historische bodemzones toont op een schaal van 0–100. De volledige berekening staat op de pagina «Bitcoin-bodem».' }
      ],
      disclaimer: '⚠ Deze score is een referentiesignaal uit publieke indicatoren, geen beleggingsadvies. Alle beslissingen en verantwoordelijkheid zijn van uzelf.'
    },
    th: {
      title: 'ดัชนีความกลัวและความโลภอีเธอเรียม และคะแนนจังหวะซื้อ',
      intro: 'แดชบอร์ดฟรีที่รวม 7 ตัวชี้วัดแบบเรียลไทม์ — รวมถึงดัชนีความกลัวและความโลภของอีเธอเรียม — เป็นคะแนน 0–100 ว่า “ตอนนี้เป็นจังหวะซื้อหรือไม่?” ใช้งานในเบราว์เซอร์ได้ทันที ไม่ต้องติดตั้ง รองรับ 13 ภาษา',
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
        { q: 'ถ้าดัชนีต่ำควรซื้ออีเธอเรียมไหม?', a: 'ความกลัวสุดขีดในอดีตมักเป็นโอกาสทยอยซื้อ แต่ดูเพียงดัชนีอย่างเดียวเสี่ยง “รับมีดที่กำลังตก” คะแนนนี้ยังพิจารณา RSI, MACD, Mayer Multiple, การย่อ และการตัดกันของเส้นเฉลี่ย และลดคะแนนอย่างระมัดระวังในแนวโน้มขาลง' },
        { q: 'คะแนนจังหวะซื้อคำนวณอย่างไร?', a: 'แปลงแต่ละตัวชี้วัดทั้ง 7 เป็นคะแนนย่อย 0–100 แล้วถ่วงน้ำหนักรวมกัน ผลลัพธ์คือ 0–100 แสดงเป็น 5 ระดับ' },
        { q: 'ฟรีไหม? ต้องติดตั้งไหม?', a: 'ฟรีทั้งหมดและไม่ต้องติดตั้ง ข้อมูลเรียลไทม์มาจาก API สาธารณะของ CoinGecko, Binance และ Alternative.me' },
        { q: 'ดัชนีกับคะแนนจังหวะซื้อต่างกันอย่างไร?', a: 'ดัชนีเป็นตัวชี้วัดอารมณ์เดียว (0–100); คะแนนจังหวะซื้อเป็นคะแนนรวมจาก 7 ตัวชี้วัดรวมถึงดัชนี (0–100)' },
        { q: 'ข้อมูลมาจากไหน อัปเดตบ่อยแค่ไหน?', a: 'ดัชนีความกลัว-ความโลภมาจาก Alternative.me ราคาและแท่งเทียนรายวันมาจาก API สาธารณะของ CoinGecko และ Binance ส่วนตัวชี้วัดออนเชนมาจาก CoinMetrics หน้าจออัปเดตอัตโนมัติราวทุก 1 นาที' },
        { q: 'ตอนนี้ควรซื้ออีเธอเรียมไหม?', a: 'ไม่มีคำตอบตายตัว แต่คะแนนจังหวะซื้อ (0–100) ช่วยประเมินอย่างเป็นกลางว่าตลาดอยู่ในโซนขายมากเกิน/ความกลัว หรือโซนร้อนแรง/ความโลภ ในแท็บระยะยาว (สวนตลาด) คะแนนยิ่งสูงหมายถึงโซนที่ความกลัวและราคาต่ำกว่ามูลค่าทับซ้อนกัน ซึ่งในอดีตเอื้อต่อ DCA ส่วนคะแนนต่ำเตือนถึงความร้อนแรง เป็นเพียงสัญญาณอ้างอิง ไม่ใช่คำแนะนำการลงทุน' },
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
  /* 푸터 설명 문단(.foot-desc) — 이더리움 언급이 있어 공통 foot-i18n.js 가 아니라 여기에 둔다 */
  var FOOT_DESC = {
    ko: 'broodev는 설치 없이 브라우저에서 바로 쓰는 무료 웹앱을 만드는 앱 포트폴리오입니다. 이 페이지의 이더리움 공포·탐욕 지수와 매수 타이밍 점수는 공개 지표를 합성한 참고 정보이며 투자 자문이 아닙니다. 광고는 Google AdSense를 통해 게재될 수 있습니다.',
    en: 'broodev is a portfolio of free web apps that run right in your browser with no install. The Ethereum Fear & Greed Index and buy-timing score on this page are reference information synthesized from public indicators, not investment advice. Ads may be served through Google AdSense.',
    ja: 'broodevは、インストール不要でブラウザからすぐ使える無料Webアプリを作るアプリポートフォリオです。このページのイーサリアム恐怖・強欲指数と買い時スコアは公開指標を合成した参考情報であり、投資助言ではありません。広告はGoogle AdSenseを通じて掲載される場合があります。',
    zh: 'broodev 是一个应用作品集，制作无需安装、在浏览器中即可直接使用的免费网页应用。本页的以太坊恐惧与贪婪指数和买入时机评分是综合公开指标得出的参考信息，不构成投资建议。广告可能通过 Google AdSense 投放。',
    'zh-Hant': 'broodev 是一個應用作品集，製作無需安裝、在瀏覽器中即可直接使用的免費網頁應用。本頁的以太幣恐懼與貪婪指數和買入時機評分是綜合公開指標得出的參考資訊，不構成投資建議。廣告可能透過 Google AdSense 刊登。',
    th: 'broodev คือพอร์ตโฟลิโอแอปที่สร้างเว็บแอปฟรีซึ่งใช้งานได้ทันทีในเบราว์เซอร์โดยไม่ต้องติดตั้ง ดัชนีความกลัว-ความโลภอีเธอเรียมและคะแนนจังหวะซื้อในหน้านี้เป็นข้อมูลอ้างอิงที่สังเคราะห์จากตัวชี้วัดสาธารณะ ไม่ใช่คำแนะนำการลงทุน โฆษณาอาจแสดงผ่าน Google AdSense',
    es: 'broodev es un portafolio de aplicaciones web gratuitas que funcionan directamente en el navegador, sin instalación. El Índice de Miedo y Codicia de Ethereum y la puntuación de momento de compra de esta página son información de referencia elaborada a partir de indicadores públicos, no asesoramiento de inversión. Los anuncios pueden mostrarse a través de Google AdSense.',
    fr: 'broodev est un portfolio d’applications web gratuites qui s’utilisent directement dans le navigateur, sans installation. L’indice Peur & Avidité du Ethereum et le score de timing d’achat de cette page sont des informations de référence issues d’indicateurs publics, et non un conseil en investissement. Des annonces peuvent être diffusées via Google AdSense.',
    de: 'broodev ist ein Portfolio kostenloser Web-Apps, die ohne Installation direkt im Browser laufen. Der Ethereum-Angst-und-Gier-Index und der Kauf-Timing-Score auf dieser Seite sind aus öffentlichen Indikatoren zusammengesetzte Referenzinformationen und keine Anlageberatung. Werbung kann über Google AdSense ausgeliefert werden.',
    it: 'broodev è un portfolio di web app gratuite che funzionano direttamente nel browser, senza installazione. L’Indice di Paura e Avidità di Ethereum e il punteggio di timing d’acquisto in questa pagina sono informazioni di riferimento ricavate da indicatori pubblici, non una consulenza di investimento. Gli annunci possono essere pubblicati tramite Google AdSense.',
    pt: 'O broodev é um portefólio de aplicações web gratuitas que funcionam diretamente no navegador, sem instalação. O Índice de Medo e Ganância do Ethereum e a pontuação de momento de compra desta página são informação de referência sintetizada a partir de indicadores públicos, não aconselhamento de investimento. Os anúncios podem ser apresentados através do Google AdSense.',
    ru: 'broodev — это портфолио бесплатных веб-приложений, которые работают прямо в браузере без установки. Индекс страха и жадности эфириума и оценка момента покупки на этой странице — справочная информация, собранная из открытых индикаторов, а не инвестиционная рекомендация. Реклама может показываться через Google AdSense.',
    nl: 'broodev is een portfolio van gratis webapps die zonder installatie direct in je browser werken. De Ethereum Angst- en Hebzuchtindex en de koop-timingscore op deze pagina zijn referentie-informatie samengesteld uit openbare indicatoren, geen beleggingsadvies. Advertenties kunnen via Google AdSense worden getoond.'
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
    "title": "Ethereum (ETH) buy-timing score and how to read its indicators",
    "intro": "This page takes Ethereum’s (ETH) US-dollar price and computes seven indicators — RSI(14), MACD(12·26·9), the Fear & Greed Index, the Mayer Multiple, drawdown from the 365-day high, the 50/200 golden/death cross and the MVRV Z-Score — then combines them into a 0–100 buy-timing score shown in five bands from STRONG BUY to OVERHEATED. The overall score is free to view in your browser, with nothing to install.",
    "coinH": "What is Ethereum (ETH)?",
    "coinP": [
     "Ethereum is a smart-contract platform proposed by Vitalik Buterin in a late-2013 white paper; its mainnet went live in July 2015. ETH is the network’s native asset and pays for transaction fees (gas). Decentralized finance (DeFi), stablecoins, NFTs and layer-2 networks all run on Ethereum.",
     "Ethereum began on proof of work (PoW) and switched to proof of stake (PoS) with “The Merge” in September 2022. Unlike Bitcoin it has no fixed supply cap, and since the 2021 London upgrade (EIP-1559) the base portion of every transaction fee is burned, so net supply can rise or fall depending on network activity. The 2023 Shanghai upgrade enabled staking withdrawals, and the 2024 Dencun upgrade cut data costs for layer-2 networks."
    ],
    "applyH": "Applying the indicators to Ethereum",
    "apply": [
     "Volatility: ETH usually swings harder than Bitcoin, so RSI drops below 30 or climbs above 70 more often. Don’t call a bottom or top from RSI alone — check it against MACD and the 50/200 trend.",
     "Relationship with Bitcoin: ETH often moves in the same direction as Bitcoin, but the ETH/BTC ratio rises and falls on its own. The score here uses only the dollar price, so it does not tell you whether ETH is outperforming or lagging Bitcoin.",
     "Fear & Greed Index: Alternative.me’s index measures sentiment across the whole crypto market, weighted toward Bitcoin; there is no Ethereum-specific version. The ETH page shows the same value as the Bitcoin page.",
     "Mayer Multiple and drawdown: thresholds such as 0.8 and 2.4 on the Mayer Multiple are rules of thumb drawn from Bitcoin’s price history. In the 2018 and 2022 bear markets ETH fell further from its peak than Bitcoin did, so a −50% drawdown from the 365-day high does not by itself mean a bottom.",
     "MVRV Z-Score: CoinMetrics community data includes Ethereum’s MVRV, so the indicator is calculated on this page. The MVRV Z-Score was originally designed for Bitcoin, though, and there is no guarantee that Bitcoin’s reference lines (below 0 = bottom zone, above 5 = overheated) fit ETH equally well."
    ],
    "histH": "Ethereum price cycles at a glance",
    "hist": [
     "2014–2015: After an ether presale (crowdsale) in 2014, the mainnet launched in July 2015.",
     "2016: Following the hack of The DAO, a hard fork reversed its effects; the chain that rejected the fork continued as Ethereum Classic (ETC).",
     "2017–2018: Amid the ICO boom ETH climbed to about $1,400 in January 2018, then fell below $100 that December — more than 90% off the peak.",
     "2021–2022: ETH set a new all-time high of about $4,800 in November 2021, then slid below $1,000 in June 2022. The Merge was completed that September.",
     "2024: The Dencun upgrade went live in March, and spot Ethereum ETFs began trading in the US in July."
    ],
    "faq": [
     {
      "q": "Is there a separate Ethereum Fear & Greed Index?",
      "a": "No. The Fear & Greed value on this page is Alternative.me’s market-wide crypto index, which leans heavily on Bitcoin. That is why it is labeled “market-wide”; for Ethereum’s own momentum, look at price indicators such as RSI and MACD."
     },
     {
      "q": "Does the Ethereum page show MVRV?",
      "a": "Yes. The CoinMetrics community API provides Ethereum MVRV data, from which the MVRV Z-Score is calculated. If the data can’t be fetched, that card shows N/A and the score is recalculated by redistributing the weights across the remaining indicators."
     },
     {
      "q": "Should I buy Ethereum now?",
      "a": "This site does not recommend buying or selling. The score is a reference summary of where today’s indicators sit relative to history. On the long-term (contrarian) tab, a high score means oversold, fearful and undervalued signals are overlapping; on the short-term (momentum) tab, the score rises with a strong uptrend. Even a high score can be followed by further declines, so decide your own entry plan, time horizon and acceptable loss first."
     },
     {
      "q": "Do staking yields or fee burns affect the score?",
      "a": "No. The score is built only from five price-based indicators (RSI, MACD, Mayer Multiple, 365-day drawdown, 50/200 cross) plus the Fear & Greed Index and the MVRV Z-Score. Ethereum-specific data such as the staking ratio or the amount burned is not included."
     },
     {
      "q": "Why does the Bitcoin page have more indicators?",
      "a": "Thermocap Z, which is based on cumulative mining rewards, appears only on the Bitcoin page, so the Ethereum score uses seven indicators. Ethereum itself has had no mining since The Merge in 2022."
     },
     {
      "q": "Can the score be low while the ETH price is rising?",
      "a": "Yes. On the long-term (contrarian) tab the score falls as the price climbs far above its 200-day average and RSI rises. During a long rally, a low score means “closer to overheated,” not a forecast of a drop."
     }
    ]
   },
   "ja": {
    "title": "イーサリアム（ETH）の買い時スコアと指標の読み方",
    "intro": "この画面はイーサリアム（ETH）のドル建て価格をもとに、RSI(14)、MACD(12・26・9)、恐怖・強欲指数、マイヤー倍率、365日高値からの下落率、50/200ゴールデン/デッドクロス、MVRV Zスコアの7指標を計算し、0〜100の買い時スコアとSTRONG BUYからOVERHEATEDまでの5段階で表示します。総合スコアはインストール不要で、ブラウザから無料で確認できます。",
    "coinH": "イーサリアム（ETH）とは？",
    "coinP": [
     "イーサリアムは、ヴィタリック・ブテリンが2013年末にホワイトペーパーで提案し、2015年7月にメインネットが稼働したスマートコントラクト・プラットフォームです。ETHはこのネットワークの基軸資産で、取引手数料（ガス代）の支払いに使われます。分散型金融（DeFi）、ステーブルコイン、NFT、レイヤー2ネットワークなどがイーサリアム上で動いています。",
     "当初はプルーフ・オブ・ワーク（PoW）でしたが、2022年9月の「マージ（The Merge）」でプルーフ・オブ・ステーク（PoS）へ移行しました。ビットコインと違って発行上限は決まっておらず、2021年のロンドン・アップグレード（EIP-1559）以降は手数料のうち基本料金が焼却されるため、ネットワークの利用状況によって純供給量は増えることも減ることもあります。2023年の上海アップグレードでステーキングの引き出しが可能になり、2024年のDencunアップグレードでレイヤー2のデータコストが下がりました。"
    ],
    "applyH": "イーサリアムに指標を当てはめるときの注意",
    "apply": [
     "ボラティリティ：ETHは一般にビットコインより値動きが大きく、RSIが30を下回ったり70を上回ったりする場面が多くなります。RSIだけで底や天井を判断せず、MACDや50/200のトレンドと合わせて見てください。",
     "ビットコインとの関係：ETHはビットコインと同じ方向に動くことが多い一方、ETH/BTC比率は独自に上下します。この画面のスコアはドル建て価格だけで計算するため、ETHがビットコインより強いか弱いかは反映しません。",
     "恐怖・強欲指数：Alternative.meの指数はビットコイン中心の暗号資産市場全体のセンチメントを示すもので、イーサリアム専用の指数はありません。ETHの画面にもビットコインの画面と同じ値が表示されます。",
     "マイヤー倍率と下落率：マイヤー倍率の0.8や2.4といった基準は、ビットコインの価格の歴史から生まれた経験則です。ETHは2018年と2022年の下落相場で高値からの下げ幅がビットコインより大きかったため、365日高値から−50%というだけで底とは言えません。",
     "MVRV Zスコア：CoinMetricsのコミュニティデータにイーサリアムのMVRVが含まれているため、この画面でも計算されます。ただしMVRV Zスコアはもともとビットコイン向けに考案された指標で、ビットコインの基準線（0未満は底値圏、5超は過熱）がETHにもそのまま当てはまる保証はありません。"
    ],
    "histH": "イーサリアムの価格サイクルの概要",
    "hist": [
     "2014〜2015年：2014年にイーサの先行販売（クラウドセール）が行われ、2015年7月にメインネットが公開されました。",
     "2016年：The DAOのハッキング被害を巻き戻すハードフォークが実施され、フォークに反対したチェーンはイーサリアムクラシック（ETC）として存続しました。",
     "2017〜2018年：ICOブームの中で2018年1月に約1,400ドルまで上昇した後、同年12月には100ドルを割り込み、高値から90%超下落しました。",
     "2021〜2022年：2021年11月に約4,800ドルで最高値を更新した後、2022年6月に1,000ドルを割り込みました。同年9月にはマージが完了しています。",
     "2024年：3月にDencunアップグレードが適用され、7月には米国でイーサリアム現物ETFの取引が始まりました。"
    ],
    "faq": [
     {
      "q": "イーサリアム専用の恐怖・強欲指数はありますか？",
      "a": "ありません。この画面の恐怖・強欲指数はAlternative.meが発表する暗号資産市場全体の指数で、ビットコインの比重が大きいものです。そのためラベルに「市場全体」と表示しています。イーサリアム自体の勢いはRSIやMACDなどの価格指標で確認するのがおすすめです。"
     },
     {
      "q": "イーサリアムでもMVRVは表示されますか？",
      "a": "はい。CoinMetricsのコミュニティAPIがイーサリアムのMVRVデータを提供しており、そこからMVRV Zスコアを計算します。データを取得できない場合、そのカードはN/Aと表示され、残りの指標にウェイトを配分し直してスコアを算出します。"
     },
     {
      "q": "今イーサリアムを買ってもいいですか？",
      "a": "当サイトは売買を勧めていません。スコアは、現在の指標が過去と比べてどの位置にあるかをまとめた参考値です。長期（逆張り）タブで高スコアなら売られすぎ・恐怖・割安のシグナルが重なっていることを示し、短期（モメンタム）タブでは上昇トレンドが強いほどスコアが上がります。高スコアの後にさらに下がることもあるため、買い方、投資期間、許容できる損失を先に自分で決めてから参考にしてください。"
     },
     {
      "q": "ステーキング利回りや手数料の焼却はスコアに含まれますか？",
      "a": "含まれません。スコアは価格から計算する5指標（RSI、MACD、マイヤー倍率、365日下落率、50/200クロス）と、恐怖・強欲指数、MVRV Zスコアだけで構成されます。ステーキング比率や焼却量といったイーサリアム固有のデータは反映していません。"
     },
     {
      "q": "ビットコインの画面と指標の数が違うのはなぜですか？",
      "a": "累積マイニング報酬を基準にするThermocap Zはビットコインの画面にしかない指標のため、イーサリアムのスコアは7指標で計算します。なお、イーサリアムでは2022年のマージ以降マイニングが行われていません。"
     },
     {
      "q": "ETHの価格が上がっているのにスコアが低くなることはありますか？",
      "a": "あります。長期（逆張り）タブでは、価格が200日平均を大きく上回り、RSIが高くなるほどスコアが下がります。上昇が長く続く局面での低スコアは「過熱寄り」という意味で、下落の予告ではありません。"
     }
    ]
   },
   "ko": {
    "title": "이더리움(ETH) 매수 타이밍 점수와 지표 읽는 법",
    "intro": "이 화면은 이더리움(ETH)의 달러 기준 가격으로 RSI(14), MACD(12·26·9), 공포·탐욕 지수, Mayer Multiple, 365일 고점 대비 낙폭, 50/200 골든·데드 크로스, MVRV Z-Score 등 7개 지표를 계산해 0~100 매수 타이밍 점수와 STRONG BUY부터 OVERHEATED까지 5단계로 보여줍니다. 종합 점수는 설치 없이 브라우저에서 무료로 확인할 수 있습니다.",
    "coinH": "이더리움(ETH)이란?",
    "coinP": [
     "이더리움은 비탈릭 부테린이 2013년 말 백서로 제안하고 2015년 7월 메인넷을 연 스마트 계약 플랫폼입니다. ETH는 이 네트워크의 기본 자산으로 거래 수수료(가스)를 내는 데 쓰이며, 탈중앙 금융(DeFi), 스테이블코인, NFT, 레이어2 네트워크 등이 이더리움 위에서 돌아갑니다.",
     "처음에는 작업증명(PoW)으로 운영됐지만 2022년 9월 '머지(The Merge)'로 지분증명(PoS)으로 전환했습니다. 비트코인과 달리 발행 상한이 정해져 있지 않으며, 2021년 런던 업그레이드(EIP-1559) 이후 거래 수수료 중 기본료가 소각되기 때문에 네트워크 사용량에 따라 순공급이 늘기도 하고 줄기도 합니다. 2023년 상하이 업그레이드로 스테이킹 출금이 가능해졌고, 2024년 덴쿤(Dencun) 업그레이드는 레이어2의 데이터 비용을 낮췄습니다."
    ],
    "applyH": "이더리움에 지표를 적용할 때",
    "apply": [
     "변동성: ETH는 대체로 비트코인보다 가격 변동 폭이 커서 RSI가 30 아래로 내려가거나 70 위로 올라가는 일이 더 잦습니다. RSI 하나만으로 바닥이나 고점을 단정하지 말고 MACD와 50/200 추세를 함께 보세요.",
     "비트코인과의 관계: ETH는 비트코인과 같은 방향으로 움직이는 경우가 많지만 ETH/BTC 비율은 따로 오르내립니다. 이 화면의 점수는 달러 가격만으로 계산하므로 ETH가 비트코인보다 강한지 약한지는 반영하지 않습니다.",
     "공포·탐욕 지수: Alternative.me의 지수는 비트코인 중심의 암호화폐 시장 전체 심리를 나타내며, 이더리움 전용 지수는 없습니다. ETH 화면에도 비트코인 화면과 같은 값이 표시됩니다.",
     "Mayer Multiple과 낙폭: Mayer Multiple의 0.8·2.4 같은 기준은 비트코인 가격 역사에서 나온 경험칙입니다. ETH는 2018년과 2022년 하락장에서 고점 대비 낙폭이 비트코인보다 깊었기 때문에, 365일 고점 대비 -50%라는 사실만으로 바닥이라고 보기는 어렵습니다.",
     "MVRV Z-Score: CoinMetrics 커뮤니티 데이터에 이더리움 MVRV가 있어 이 화면에서도 계산됩니다. 다만 MVRV Z-Score는 원래 비트코인을 위해 고안된 지표라, 비트코인에서 쓰던 기준선(0 아래 바닥권, 5 이상 과열)이 ETH에도 그대로 맞는다는 보장은 없습니다."
    ],
    "histH": "이더리움 가격 사이클 요약",
    "hist": [
     "2014~2015년: 2014년 이더 사전 판매(크라우드세일)를 거쳐 2015년 7월 메인넷이 출시됐습니다.",
     "2016년: The DAO 해킹 피해를 되돌리는 하드포크가 이뤄졌고, 포크에 반대한 체인은 이더리움 클래식(ETC)으로 남았습니다.",
     "2017~2018년: ICO 열풍 속에 2018년 1월 약 1,400달러까지 올랐다가 그해 12월 100달러 아래로 떨어져, 고점 대비 90% 넘게 하락했습니다.",
     "2021~2022년: 2021년 11월 약 4,800달러로 최고가를 새로 쓴 뒤 2022년 6월 1,000달러 아래로 내려갔습니다. 같은 해 9월 머지가 완료됐습니다.",
     "2024년: 3월 덴쿤 업그레이드가 적용됐고, 7월 미국에서 이더리움 현물 ETF 거래가 시작됐습니다."
    ],
    "faq": [
     {
      "q": "이더리움 공포지수가 따로 있나요?",
      "a": "없습니다. 이 화면의 공포·탐욕 지수는 Alternative.me가 발표하는 암호화폐 시장 전체 지수로, 비트코인 비중이 큽니다. 그래서 라벨에 '시장 전체'라고 표시합니다. 이더리움 자체의 흐름은 RSI·MACD 같은 가격 지표로 확인하는 편이 좋습니다."
     },
     {
      "q": "이더리움에도 MVRV가 나오나요?",
      "a": "네. CoinMetrics 커뮤니티 API가 이더리움 MVRV 데이터를 제공해 MVRV Z-Score를 계산합니다. 데이터를 받지 못하면 해당 카드는 N/A로 표시되고, 나머지 지표에 가중치를 다시 나눠 점수를 냅니다."
     },
     {
      "q": "지금 이더리움 사도 되나요?",
      "a": "이 사이트는 매수나 매도를 권하지 않습니다. 점수는 현재 지표가 과거와 비교해 어디쯤 있는지 요약한 참고값입니다. 장기(역발상) 탭에서 점수가 높으면 과매도·공포·저평가 신호가 겹쳤다는 뜻이고, 단기(모멘텀) 탭은 상승 추세가 강할수록 점수가 올라갑니다. 높은 점수 뒤에도 하락이 이어질 수 있으니 매수 방식, 투자 기간, 감당할 수 있는 손실 범위를 먼저 스스로 정한 뒤 참고하세요."
     },
     {
      "q": "스테이킹 수익이나 수수료 소각도 점수에 들어가나요?",
      "a": "들어가지 않습니다. 점수는 가격으로 계산하는 지표 5개(RSI, MACD, Mayer Multiple, 365일 낙폭, 50/200 크로스)와 공포·탐욕 지수, MVRV Z-Score로만 만듭니다. 스테이킹 비율이나 소각량 같은 이더리움 고유 데이터는 반영하지 않습니다."
     },
     {
      "q": "비트코인 화면과 지표 개수가 다른 이유는 무엇인가요?",
      "a": "누적 채굴 보상을 기준으로 하는 Thermocap Z는 비트코인 화면에만 있는 지표라, 이더리움 점수는 7개 지표로 계산합니다. 이더리움 자체도 2022년 머지 이후로는 채굴이 없습니다."
     },
     {
      "q": "ETH 가격이 오르는데 점수가 낮게 나올 수 있나요?",
      "a": "그렇습니다. 장기(역발상) 탭에서는 가격이 200일 평균보다 크게 위에 있고 RSI가 높을수록 점수가 내려갑니다. 상승장이 길게 이어질 때 낮은 점수는 '과열 쪽에 가깝다'는 뜻이지 하락을 예고하는 것이 아닙니다."
     }
    ]
   },
   "zh": {
    "title": "以太坊（ETH）买入时机评分与指标解读",
    "intro": "本页面以以太坊（ETH）的美元价格为基础，计算RSI(14)、MACD(12·26·9)、恐惧与贪婪指数、梅耶倍数、距365日高点回撤、50/200金叉/死叉和MVRV Z分数共7项指标，合成为0–100的买入时机评分，并按STRONG BUY到OVERHEATED分5档显示。综合评分无需安装，在浏览器中即可免费查看。",
    "coinH": "什么是以太坊（ETH）？",
    "coinP": [
     "以太坊是维塔利克·布特林于2013年底在白皮书中提出、2015年7月主网上线的智能合约平台。ETH是该网络的原生资产，用于支付交易手续费（Gas）。去中心化金融（DeFi）、稳定币、NFT以及二层网络等都运行在以太坊之上。",
     "以太坊最初采用工作量证明（PoW），2022年9月通过“合并”（The Merge）转为权益证明（PoS）。与比特币不同，以太坊没有固定的发行上限；自2021年伦敦升级（EIP-1559）起，每笔手续费中的基础费用会被销毁，因此净供应量会随网络使用情况增加或减少。2023年的上海升级开放了质押提款，2024年的坎昆（Dencun）升级降低了二层网络的数据成本。"
    ],
    "applyH": "将指标用于以太坊时的注意事项",
    "apply": [
     "波动性：ETH的价格波动通常大于比特币，RSI跌破30或升破70的情况更为常见。不要仅凭RSI判断底部或顶部，应结合MACD和50/200趋势一起看。",
     "与比特币的关系：ETH经常与比特币同向波动，但ETH/BTC汇率会独立涨跌。本页面的评分只用美元价格计算，因此无法反映ETH相对比特币是强是弱。",
     "恐惧与贪婪指数：Alternative.me的指数衡量的是以比特币为主的整个加密市场情绪，并不存在以太坊专属版本。ETH页面显示的数值与比特币页面相同。",
     "梅耶倍数与回撤：梅耶倍数0.8、2.4这类阈值是从比特币价格历史中总结出的经验法则。ETH在2018年和2022年熊市中距高点的跌幅都比比特币更深，因此仅凭距365日高点回撤50%并不能断定已经见底。",
     "MVRV Z分数：CoinMetrics社区数据包含以太坊的MVRV，所以本页面也会计算该指标。不过MVRV Z分数最初是为比特币设计的，比特币的参考线（低于0为底部区、高于5为过热）不一定同样适用于ETH。"
    ],
    "histH": "以太坊价格周期概览",
    "hist": [
     "2014–2015年：2014年进行以太币预售（众筹）后，主网于2015年7月上线。",
     "2016年：The DAO遭黑客攻击后，以太坊通过硬分叉撤销了其影响；反对分叉的链延续为以太坊经典（ETC）。",
     "2017–2018年：在ICO热潮中，ETH于2018年1月涨至约1,400美元，同年12月跌破100美元，较高点下跌逾90%。",
     "2021–2022年：2021年11月以约4,800美元创下历史新高，2022年6月跌破1,000美元。同年9月完成合并。",
     "2024年：3月坎昆升级上线，7月以太坊现货ETF在美国开始交易。"
    ],
    "faq": [
     {
      "q": "有单独的以太坊恐惧与贪婪指数吗？",
      "a": "没有。本页面的恐惧与贪婪指数是Alternative.me发布的全加密市场指数，比特币占比很大，所以标签上注明“全市场”。若要看以太坊自身的走势强弱，建议参考RSI、MACD等价格指标。"
     },
     {
      "q": "以太坊页面会显示MVRV吗？",
      "a": "会。CoinMetrics社区API提供以太坊的MVRV数据，本页面据此计算MVRV Z分数。如果数据获取失败，该卡片显示N/A，评分会把权重重新分配给其余指标后再计算。"
     },
     {
      "q": "现在可以买以太坊吗？",
      "a": "本网站不提供买卖建议。评分只是概括当前各项指标相对历史处于什么位置的参考值。在长期（逆向）标签中，高分表示超卖、恐惧和低估信号同时出现；在短期（动量）标签中，上升趋势越强，分数越高。高分之后仍可能继续下跌，请先自行确定买入方式、投资期限和可承受的亏损，再参考评分。"
     },
     {
      "q": "质押收益或手续费销毁会计入评分吗？",
      "a": "不会。评分只由5项价格指标（RSI、MACD、梅耶倍数、365日回撤、50/200交叉）加上恐惧与贪婪指数和MVRV Z分数构成，质押率、销毁量等以太坊特有数据不在其中。"
     },
     {
      "q": "为什么比特币页面的指标更多？",
      "a": "以累计挖矿奖励为基准的Thermocap Z只出现在比特币页面，因此以太坊的评分使用7项指标。另外，以太坊自2022年合并以来已不再有挖矿。"
     },
     {
      "q": "ETH价格在涨，评分却可能偏低吗？",
      "a": "可能。在长期（逆向）标签中，价格越是远高于200日均线、RSI越高，分数就越低。在持续上涨的行情里，低分的意思是“更接近过热”，并不是下跌预告。"
     }
    ]
   },
   "zh-Hant": {
    "title": "以太幣（ETH）買入時機評分與指標解讀",
    "intro": "本頁面以以太幣（ETH）的美元價格為基礎，計算RSI(14)、MACD(12·26·9)、恐懼與貪婪指數、梅耶倍數、距365日高點回撤、50/200黃金/死亡交叉與MVRV Z分數共7項指標，合成為0–100的買入時機評分，並依STRONG BUY到OVERHEATED分為5級顯示。綜合評分不需安裝，在瀏覽器中即可免費查看。",
    "coinH": "什麼是以太幣（ETH）？",
    "coinP": [
     "以太坊是維塔利克·布特林於2013年底在白皮書中提出、2015年7月主網上線的智慧合約平台。以太幣（ETH）是這個網路的原生資產，用來支付交易手續費（Gas）。去中心化金融（DeFi）、穩定幣、NFT及第二層網路等都在以太坊上運作。",
     "以太坊最初採用工作量證明（PoW），2022年9月透過「合併」（The Merge）轉為權益證明（PoS）。與比特幣不同，以太幣沒有固定的發行上限；自2021年倫敦升級（EIP-1559）起，每筆手續費中的基本費用會被銷毀，因此淨供給量會隨網路使用情況增加或減少。2023年的上海升級開放了質押提領，2024年的坎昆（Dencun）升級降低了第二層網路的資料成本。"
    ],
    "applyH": "將指標用於以太幣時的注意事項",
    "apply": [
     "波動性：ETH的價格波動通常比比特幣大，RSI跌破30或突破70的情況更常見。不要只憑RSI判斷底部或頭部，應搭配MACD與50/200趨勢一起看。",
     "與比特幣的關係：ETH常與比特幣同向波動，但ETH/BTC匯率會獨立漲跌。本頁面的評分只用美元價格計算，因此無法反映ETH相對比特幣是強是弱。",
     "恐懼與貪婪指數：Alternative.me的指數衡量的是以比特幣為主的整個加密市場情緒，並沒有以太幣專屬版本。ETH頁面顯示的數值與比特幣頁面相同。",
     "梅耶倍數與回撤：梅耶倍數0.8、2.4這類門檻，是從比特幣價格歷史歸納出的經驗法則。ETH在2018年與2022年的空頭市場中，距高點的跌幅都比比特幣更深，因此光憑距365日高點回撤50%並不能斷定已經見底。",
     "MVRV Z分數：CoinMetrics社群資料包含以太幣的MVRV，所以本頁面也會計算這項指標。不過MVRV Z分數原本是為比特幣設計的，比特幣的參考線（低於0為底部區、高於5為過熱）不一定同樣適用於ETH。"
    ],
    "histH": "以太幣價格週期概覽",
    "hist": [
     "2014–2015年：2014年進行以太幣預售（群眾募資）後，主網於2015年7月上線。",
     "2016年：The DAO遭駭客攻擊後，以太坊透過硬分叉撤銷其影響；反對分叉的鏈則延續為以太坊經典（ETC）。",
     "2017–2018年：在ICO熱潮中，ETH於2018年1月漲至約1,400美元，同年12月跌破100美元，較高點下跌逾90%。",
     "2021–2022年：2021年11月以約4,800美元創下歷史新高，2022年6月跌破1,000美元。同年9月完成合併。",
     "2024年：3月坎昆升級上線，7月以太幣現貨ETF在美國開始交易。"
    ],
    "faq": [
     {
      "q": "有單獨的以太幣恐懼與貪婪指數嗎？",
      "a": "沒有。本頁面的恐懼與貪婪指數是Alternative.me發布的全加密市場指數，比特幣佔比很大，所以標籤上註明「全市場」。若要看以太幣本身的走勢強弱，建議參考RSI、MACD等價格指標。"
     },
     {
      "q": "以太幣頁面會顯示MVRV嗎？",
      "a": "會。CoinMetrics社群API提供以太幣的MVRV資料，本頁面據此計算MVRV Z分數。如果資料取得失敗，該卡片會顯示N/A，評分則把權重重新分配給其餘指標後再計算。"
     },
     {
      "q": "現在可以買以太幣嗎？",
      "a": "本網站不提供買賣建議。評分只是概括目前各項指標相對歷史位置的參考值。在長期（逆向）分頁中，高分表示超賣、恐懼與低估訊號同時出現；在短期（動能）分頁中，上升趨勢越強，分數越高。高分之後仍可能繼續下跌，請先自行決定買進方式、投資期間與可承受的虧損，再參考評分。"
     },
     {
      "q": "質押收益或手續費銷毀會計入評分嗎？",
      "a": "不會。評分只由5項價格指標（RSI、MACD、梅耶倍數、365日回撤、50/200交叉）加上恐懼與貪婪指數和MVRV Z分數構成，質押比率、銷毀量等以太坊特有資料不在其中。"
     },
     {
      "q": "為什麼比特幣頁面的指標比較多？",
      "a": "以累計挖礦獎勵為基準的Thermocap Z只出現在比特幣頁面，因此以太幣的評分使用7項指標。另外，以太坊自2022年合併以來已不再有挖礦。"
     },
     {
      "q": "ETH價格在漲，評分卻可能偏低嗎？",
      "a": "有可能。在長期（逆向）分頁中，價格越是遠高於200日均線、RSI越高，分數就越低。在持續上漲的行情裡，低分代表「更接近過熱」，並不是下跌預告。"
     }
    ]
   },
   "th": {
    "title": "คะแนนจังหวะซื้ออีเธอเรียม (ETH) และวิธีอ่านตัวชี้วัด",
    "intro": "หน้านี้ใช้ราคาอีเธอเรียม (ETH) เทียบดอลลาร์สหรัฐคำนวณตัวชี้วัด 7 ตัว ได้แก่ RSI(14), MACD(12·26·9), ดัชนีความกลัว-ความโลภ, Mayer Multiple, การย่อจากจุดสูงสุด 365 วัน, Golden/Death Cross 50/200 และ MVRV Z-Score แล้วรวมเป็นคะแนนจังหวะซื้อ 0–100 แบ่งเป็น 5 ระดับตั้งแต่ STRONG BUY ถึง OVERHEATED ดูคะแนนรวมได้ฟรีในเบราว์เซอร์โดยไม่ต้องติดตั้งอะไร",
    "coinH": "อีเธอเรียม (ETH) คืออะไร?",
    "coinP": [
     "อีเธอเรียมเป็นแพลตฟอร์มสมาร์ตคอนแทรกต์ที่วิทาลิก บูเทริน เสนอไว้ในไวต์เปเปอร์ช่วงปลายปี 2013 และเปิดเมนเน็ตเมื่อเดือนกรกฎาคม 2015 ETH เป็นสินทรัพย์หลักของเครือข่าย ใช้จ่ายค่าธรรมเนียมธุรกรรม (ค่าแก๊ส) ทั้งการเงินแบบกระจายศูนย์ (DeFi) สเตเบิลคอยน์ NFT และเครือข่ายเลเยอร์ 2 ต่างทำงานอยู่บนอีเธอเรียม",
     "เดิมอีเธอเรียมใช้กลไก Proof of Work (PoW) ก่อนเปลี่ยนเป็น Proof of Stake (PoS) ผ่าน “The Merge” ในเดือนกันยายน 2022 ต่างจากบิตคอยน์ตรงที่ไม่มีเพดานอุปทานตายตัว และตั้งแต่อัปเกรดลอนดอน (EIP-1559) ในปี 2021 ค่าธรรมเนียมส่วนฐานของทุกธุรกรรมจะถูกเผาทิ้ง อุปทานสุทธิจึงเพิ่มหรือลดได้ตามการใช้งานเครือข่าย อัปเกรดเซี่ยงไฮ้ในปี 2023 เปิดให้ถอน ETH ที่สเตกไว้ได้ และอัปเกรด Dencun ในปี 2024 ช่วยลดต้นทุนข้อมูลของเครือข่ายเลเยอร์ 2"
    ],
    "applyH": "ข้อควรรู้เมื่อใช้ตัวชี้วัดกับอีเธอเรียม",
    "apply": [
     "ความผันผวน: โดยทั่วไป ETH เหวี่ยงแรงกว่าบิตคอยน์ RSI จึงหลุดต่ำกว่า 30 หรือทะลุเหนือ 70 บ่อยกว่า อย่าตัดสินว่าเป็นก้นหรือยอดจาก RSI เพียงตัวเดียว ควรดูคู่กับ MACD และเทรนด์ 50/200",
     "ความสัมพันธ์กับบิตคอยน์: ETH มักเคลื่อนไหวทิศทางเดียวกับบิตคอยน์ แต่อัตราส่วน ETH/BTC ขึ้นลงเป็นอิสระ คะแนนในหน้านี้คำนวณจากราคาดอลลาร์เท่านั้น จึงไม่ได้บอกว่า ETH แข็งหรืออ่อนกว่าบิตคอยน์",
     "ดัชนีความกลัว-ความโลภ: ดัชนีของ Alternative.me วัดอารมณ์ของตลาดคริปโตทั้งหมดโดยเน้นบิตคอยน์ ไม่มีฉบับเฉพาะของอีเธอเรียม หน้า ETH จึงแสดงค่าเดียวกับหน้าบิตคอยน์",
     "Mayer Multiple และการย่อตัว: เกณฑ์อย่าง 0.8 และ 2.4 ของ Mayer Multiple เป็นหลักจากประสบการณ์ที่ได้มาจากประวัติราคาบิตคอยน์ ในตลาดขาลงปี 2018 และ 2022 ETH ร่วงจากจุดสูงสุดลึกกว่าบิตคอยน์ การย่อลง 50% จากจุดสูงสุด 365 วันเพียงอย่างเดียวจึงไม่ได้แปลว่าถึงก้นแล้ว",
     "MVRV Z-Score: ข้อมูลชุมชนของ CoinMetrics มีค่า MVRV ของอีเธอเรียม หน้านี้จึงคำนวณตัวชี้วัดนี้ได้ แต่ MVRV Z-Score ถูกออกแบบมาสำหรับบิตคอยน์ตั้งแต่แรก จึงไม่มีอะไรรับประกันว่าเส้นอ้างอิงของบิตคอยน์ (ต่ำกว่า 0 = โซนก้น, สูงกว่า 5 = ร้อนแรงเกินไป) จะใช้กับ ETH ได้เหมือนกัน"
    ],
    "histH": "สรุปวัฏจักรราคาอีเธอเรียม",
    "hist": [
     "2014–2015: หลังการระดมทุนด้วยการขายอีเธอร์ล่วงหน้าในปี 2014 เมนเน็ตก็เปิดใช้งานเมื่อเดือนกรกฎาคม 2015",
     "2016: หลัง The DAO ถูกแฮก มีการฮาร์ดฟอร์กเพื่อย้อนผลกระทบ ส่วนเชนที่ไม่ยอมรับการฟอร์กดำเนินต่อในชื่ออีเธอเรียมคลาสสิก (ETC)",
     "2017–2018: ท่ามกลางกระแส ICO ราคา ETH ขึ้นไปราว 1,400 ดอลลาร์ในเดือนมกราคม 2018 ก่อนหลุด 100 ดอลลาร์ในเดือนธันวาคมปีเดียวกัน ลดลงกว่า 90% จากจุดสูงสุด",
     "2021–2022: ทำจุดสูงสุดใหม่ราว 4,800 ดอลลาร์ในเดือนพฤศจิกายน 2021 จากนั้นหลุด 1,000 ดอลลาร์ในเดือนมิถุนายน 2022 และ The Merge เสร็จสมบูรณ์ในเดือนกันยายนปีนั้น",
     "2024: อัปเกรด Dencun เปิดใช้ในเดือนมีนาคม และ ETF อีเธอเรียมแบบสปอตเริ่มซื้อขายในสหรัฐฯ เดือนกรกฎาคม"
    ],
    "faq": [
     {
      "q": "มีดัชนีความกลัว-ความโลภของอีเธอเรียมแยกต่างหากไหม?",
      "a": "ไม่มี ค่าความกลัว-ความโลภในหน้านี้เป็นดัชนีของตลาดคริปโตทั้งหมดจาก Alternative.me ซึ่งให้น้ำหนักบิตคอยน์มาก จึงติดป้ายว่า “ทั้งตลาด” ถ้าต้องการดูแรงส่งของอีเธอเรียมเอง ให้ดูตัวชี้วัดราคา เช่น RSI และ MACD"
     },
     {
      "q": "หน้าอีเธอเรียมแสดง MVRV ด้วยไหม?",
      "a": "แสดง API ชุมชนของ CoinMetrics มีข้อมูล MVRV ของอีเธอเรียม หน้านี้จึงคำนวณ MVRV Z-Score ได้ ถ้าดึงข้อมูลไม่ได้ การ์ดนั้นจะขึ้น N/A และคะแนนจะคำนวณใหม่โดยกระจายน้ำหนักไปยังตัวชี้วัดที่เหลือ"
     },
     {
      "q": "ตอนนี้ควรซื้ออีเธอเรียมไหม?",
      "a": "เว็บไซต์นี้ไม่แนะนำให้ซื้อหรือขาย คะแนนเป็นเพียงค่าอ้างอิงที่สรุปว่าตัวชี้วัดตอนนี้อยู่ตรงไหนเมื่อเทียบกับอดีต ในแท็บระยะยาว (สวนตลาด) คะแนนสูงหมายถึงสัญญาณขายมากเกิน ความกลัว และราคาต่ำกว่ามูลค่าเกิดซ้อนกัน ส่วนแท็บระยะสั้น (โมเมนตัม) คะแนนจะสูงขึ้นเมื่อเทรนด์ขาขึ้นแข็งแรง แม้คะแนนสูง ราคาก็ยังลงต่อได้ จึงควรกำหนดวิธีเข้าซื้อ ระยะเวลาลงทุน และขาดทุนที่รับได้ด้วยตัวเองก่อน"
     },
     {
      "q": "ผลตอบแทนจากการสเตกหรือการเผาค่าธรรมเนียมถูกนับในคะแนนไหม?",
      "a": "ไม่ถูกนับ คะแนนประกอบด้วยตัวชี้วัดจากราคา 5 ตัว (RSI, MACD, Mayer Multiple, การย่อ 365 วัน, ครอส 50/200) บวกดัชนีความกลัว-ความโลภและ MVRV Z-Score เท่านั้น ไม่รวมข้อมูลเฉพาะของอีเธอเรียม เช่น สัดส่วนการสเตกหรือปริมาณที่ถูกเผา"
     },
     {
      "q": "ทำไมหน้าบิตคอยน์มีตัวชี้วัดมากกว่า?",
      "a": "Thermocap Z ซึ่งอิงรางวัลการขุดสะสม มีเฉพาะในหน้าบิตคอยน์ คะแนนของอีเธอเรียมจึงใช้ตัวชี้วัด 7 ตัว นอกจากนี้อีเธอเรียมไม่มีการขุดแล้วตั้งแต่ The Merge ในปี 2022"
     },
     {
      "q": "ราคา ETH กำลังขึ้น แต่คะแนนต่ำได้ไหม?",
      "a": "ได้ ในแท็บระยะยาว (สวนตลาด) ยิ่งราคาอยู่สูงเหนือเส้นเฉลี่ย 200 วันมากและ RSI ยิ่งสูง คะแนนก็ยิ่งลดลง ในช่วงขาขึ้นที่ยาวนาน คะแนนต่ำหมายถึง “ใกล้ภาวะร้อนแรงเกินไป” ไม่ใช่คำทำนายว่าราคาจะลง"
     }
    ]
   },
   "es": {
    "title": "Puntuación de momento de compra de Ethereum (ETH) y cómo leer sus indicadores",
    "intro": "Esta página toma el precio de Ethereum (ETH) en dólares y calcula siete indicadores —RSI(14), MACD(12·26·9), el índice de miedo y codicia, el múltiplo de Mayer, la caída desde el máximo de 365 días, el cruce dorado/de la muerte 50/200 y el MVRV Z-Score— para combinarlos en una puntuación de 0 a 100, mostrada en cinco bandas de STRONG BUY a OVERHEATED. La puntuación global se consulta gratis en el navegador, sin instalar nada.",
    "coinH": "¿Qué es Ethereum (ETH)?",
    "coinP": [
     "Ethereum es una plataforma de contratos inteligentes que Vitalik Buterin propuso en un libro blanco a finales de 2013; su red principal se lanzó en julio de 2015. ETH es el activo nativo de la red y sirve para pagar las comisiones de las transacciones (gas). Sobre Ethereum funcionan las finanzas descentralizadas (DeFi), las stablecoins, los NFT y las redes de capa 2.",
     "Ethereum nació con prueba de trabajo (PoW) y pasó a prueba de participación (PoS) con «The Merge» en septiembre de 2022. A diferencia de Bitcoin, no tiene un límite de emisión fijo, y desde la actualización London de 2021 (EIP-1559) se quema la tarifa base de cada transacción, de modo que la oferta neta puede crecer o disminuir según el uso de la red. La actualización Shanghai de 2023 habilitó la retirada de los fondos en staking y Dencun, en 2024, abarató los datos para las redes de capa 2."
    ],
    "applyH": "Cómo aplicar los indicadores a Ethereum",
    "apply": [
     "Volatilidad: ETH suele moverse con más fuerza que Bitcoin, así que el RSI cae por debajo de 30 o supera 70 con más frecuencia. No des por hecho un suelo o un techo solo por el RSI: contrástalo con el MACD y la tendencia 50/200.",
     "Relación con Bitcoin: ETH suele ir en la misma dirección que Bitcoin, pero el ratio ETH/BTC sube y baja por su cuenta. La puntuación de esta página usa solo el precio en dólares, por lo que no indica si ETH lo está haciendo mejor o peor que Bitcoin.",
     "Índice de miedo y codicia: el índice de Alternative.me mide el sentimiento de todo el mercado cripto, con mucho peso de Bitcoin; no existe una versión propia de Ethereum. La página de ETH muestra el mismo valor que la de Bitcoin.",
     "Múltiplo de Mayer y caída: umbrales como 0,8 y 2,4 en el múltiplo de Mayer son reglas empíricas sacadas de la historia de precios de Bitcoin. En los mercados bajistas de 2018 y 2022, ETH cayó más desde su máximo que Bitcoin, así que una caída del 50 % desde el máximo de 365 días no significa por sí sola que se haya tocado fondo.",
     "MVRV Z-Score: los datos comunitarios de CoinMetrics incluyen el MVRV de Ethereum, de modo que esta página lo calcula. Aun así, el MVRV Z-Score se diseñó originalmente para Bitcoin y nada garantiza que sus líneas de referencia (por debajo de 0 = zona de suelo; por encima de 5 = sobrecalentamiento) encajen igual de bien en ETH."
    ],
    "histH": "Resumen de los ciclos de precio de Ethereum",
    "hist": [
     "2014–2015: tras una preventa (crowdsale) de ether en 2014, la red principal se lanzó en julio de 2015.",
     "2016: después del hackeo de The DAO, una bifurcación dura (hard fork) revirtió sus efectos; la cadena que rechazó el cambio siguió como Ethereum Classic (ETC).",
     "2017–2018: en plena fiebre de las ICO, ETH subió a unos 1.400 dólares en enero de 2018 y en diciembre de ese año bajó de 100 dólares, más de un 90 % por debajo del máximo.",
     "2021–2022: marcó un nuevo máximo histórico de unos 4.800 dólares en noviembre de 2021 y cayó por debajo de 1.000 dólares en junio de 2022. The Merge se completó en septiembre de ese año.",
     "2024: la actualización Dencun se activó en marzo y en julio empezaron a cotizar en Estados Unidos los ETF al contado de Ethereum."
    ],
    "faq": [
     {
      "q": "¿Existe un índice de miedo y codicia propio de Ethereum?",
      "a": "No. El valor de miedo y codicia de esta página es el índice de todo el mercado cripto que publica Alternative.me, con mucho peso de Bitcoin; por eso se etiqueta como «todo el mercado». Para ver el impulso propio de Ethereum, fíjate en indicadores de precio como el RSI y el MACD."
     },
     {
      "q": "¿La página de Ethereum muestra el MVRV?",
      "a": "Sí. La API comunitaria de CoinMetrics ofrece datos de MVRV de Ethereum y con ellos se calcula el MVRV Z-Score. Si no se pueden obtener, la tarjeta muestra N/A y la puntuación se recalcula repartiendo los pesos entre los indicadores restantes."
     },
     {
      "q": "¿Debería comprar Ethereum ahora?",
      "a": "Este sitio no recomienda comprar ni vender. La puntuación es un resumen orientativo de dónde se sitúan hoy los indicadores frente a su historia. En la pestaña de largo plazo (contraria), una puntuación alta significa que coinciden señales de sobreventa, miedo e infravaloración; en la de corto plazo (momentum), sube cuanto más fuerte es la tendencia alcista. Incluso tras una puntuación alta el precio puede seguir cayendo, así que define antes tu forma de entrar, tu horizonte y la pérdida que puedes asumir."
     },
     {
      "q": "¿Influyen en la puntuación los rendimientos del staking o la quema de comisiones?",
      "a": "No. La puntuación se construye solo con cinco indicadores de precio (RSI, MACD, múltiplo de Mayer, caída de 365 días y cruce 50/200), más el índice de miedo y codicia y el MVRV Z-Score. No incluye datos propios de Ethereum como la proporción en staking o la cantidad quemada."
     },
     {
      "q": "¿Por qué la página de Bitcoin tiene más indicadores?",
      "a": "Thermocap Z, basado en las recompensas de minería acumuladas, solo aparece en la página de Bitcoin, por lo que la puntuación de Ethereum usa siete indicadores. Además, en Ethereum ya no hay minería desde The Merge de 2022."
     },
     {
      "q": "¿Puede la puntuación ser baja mientras sube el precio de ETH?",
      "a": "Sí. En la pestaña de largo plazo (contraria), la puntuación baja cuanto más se aleja el precio por encima de su media de 200 días y más alto está el RSI. En un rally prolongado, una puntuación baja significa «más cerca del sobrecalentamiento», no que se prevea una caída."
     }
    ]
   },
   "fr": {
    "title": "Score de timing d’achat Ethereum (ETH) et lecture des indicateurs",
    "intro": "Cette page part du prix de l’Ethereum (ETH) en dollars et calcule sept indicateurs — RSI(14), MACD(12·26·9), indice de peur et d’avidité, multiple de Mayer, repli depuis le plus haut sur 365 jours, croisement doré/de la mort 50/200 et MVRV Z-Score — pour les combiner en un score de 0 à 100, affiché selon cinq paliers de STRONG BUY à OVERHEATED. Le score global se consulte gratuitement dans le navigateur, sans rien installer.",
    "coinH": "Qu’est-ce qu’Ethereum (ETH) ?",
    "coinP": [
     "Ethereum est une plateforme de contrats intelligents proposée par Vitalik Buterin dans un livre blanc fin 2013 ; son réseau principal a été lancé en juillet 2015. L’ETH est l’actif natif du réseau et sert à payer les frais de transaction (gas). La finance décentralisée (DeFi), les stablecoins, les NFT et les réseaux de couche 2 fonctionnent sur Ethereum.",
     "Ethereum utilisait au départ la preuve de travail (PoW) et est passé à la preuve d’enjeu (PoS) avec « The Merge » en septembre 2022. Contrairement à Bitcoin, il n’a pas de plafond d’émission fixe, et depuis la mise à jour London de 2021 (EIP-1559), les frais de base de chaque transaction sont brûlés : l’offre nette peut donc augmenter ou diminuer selon l’activité du réseau. La mise à jour Shanghai de 2023 a permis de retirer l’ETH mis en staking, et Dencun, en 2024, a réduit le coût des données pour les réseaux de couche 2."
    ],
    "applyH": "Appliquer les indicateurs à Ethereum",
    "apply": [
     "Volatilité : l’ETH varie généralement plus fortement que le bitcoin, si bien que le RSI passe plus souvent sous 30 ou au-dessus de 70. Ne concluez pas à un creux ou à un sommet sur le seul RSI : croisez-le avec le MACD et la tendance 50/200.",
     "Lien avec le bitcoin : l’ETH évolue souvent dans le même sens que le bitcoin, mais le ratio ETH/BTC monte et descend de façon autonome. Le score de cette page ne repose que sur le prix en dollars ; il n’indique donc pas si l’ETH fait mieux ou moins bien que le bitcoin.",
     "Indice de peur et d’avidité : l’indice d’Alternative.me mesure le sentiment de l’ensemble du marché crypto, avec un fort poids du bitcoin ; il n’en existe pas de version propre à Ethereum. La page ETH affiche la même valeur que la page Bitcoin.",
     "Multiple de Mayer et repli : des seuils comme 0,8 et 2,4 pour le multiple de Mayer sont des règles empiriques tirées de l’historique du bitcoin. Lors des marchés baissiers de 2018 et 2022, l’ETH a reculé plus fortement que le bitcoin depuis son sommet ; un repli de 50 % depuis le plus haut sur 365 jours ne signifie donc pas à lui seul un point bas.",
     "MVRV Z-Score : les données communautaires de CoinMetrics incluent le MVRV d’Ethereum, la page peut donc le calculer. Mais le MVRV Z-Score a été conçu à l’origine pour le bitcoin, et rien ne garantit que ses repères (sous 0 = zone de creux, au-dessus de 5 = surchauffe) conviennent aussi bien à l’ETH."
    ],
    "histH": "Les cycles de prix d’Ethereum en bref",
    "hist": [
     "2014–2015 : après une prévente d’ether (crowdsale) en 2014, le réseau principal a été lancé en juillet 2015.",
     "2016 : après le piratage de The DAO, un hard fork en a annulé les effets ; la chaîne qui a refusé ce fork a continué sous le nom d’Ethereum Classic (ETC).",
     "2017–2018 : porté par l’engouement pour les ICO, l’ETH a atteint environ 1 400 dollars en janvier 2018, puis est passé sous 100 dollars en décembre de la même année, soit une chute de plus de 90 % depuis le sommet.",
     "2021–2022 : nouveau record historique d’environ 4 800 dollars en novembre 2021, puis passage sous 1 000 dollars en juin 2022. The Merge a été achevé en septembre de cette même année.",
     "2024 : la mise à jour Dencun est entrée en vigueur en mars et les ETF Ethereum au comptant ont commencé à se négocier aux États-Unis en juillet."
    ],
    "faq": [
     {
      "q": "Existe-t-il un indice de peur et d’avidité propre à Ethereum ?",
      "a": "Non. La valeur affichée ici est l’indice de l’ensemble du marché crypto publié par Alternative.me, fortement pondéré par le bitcoin ; c’est pourquoi elle porte la mention « marché entier ». Pour la dynamique propre à Ethereum, regardez plutôt les indicateurs de prix comme le RSI et le MACD."
     },
     {
      "q": "La page Ethereum affiche-t-elle le MVRV ?",
      "a": "Oui. L’API communautaire de CoinMetrics fournit les données MVRV d’Ethereum, à partir desquelles le MVRV Z-Score est calculé. Si elles ne peuvent pas être récupérées, la carte indique N/A et le score est recalculé en répartissant les pondérations sur les autres indicateurs."
     },
     {
      "q": "Faut-il acheter de l’Ethereum maintenant ?",
      "a": "Ce site ne recommande ni d’acheter ni de vendre. Le score résume, à titre indicatif, la position actuelle des indicateurs par rapport à leur historique. Dans l’onglet long terme (contrarian), un score élevé signifie que des signaux de survente, de peur et de sous-évaluation se superposent ; dans l’onglet court terme (momentum), il monte avec la force de la tendance haussière. Même après un score élevé, le prix peut continuer à baisser : fixez d’abord votre méthode d’entrée, votre horizon et la perte que vous pouvez accepter."
     },
     {
      "q": "Les rendements du staking ou la combustion des frais entrent-ils dans le score ?",
      "a": "Non. Le score repose uniquement sur cinq indicateurs de prix (RSI, MACD, multiple de Mayer, repli sur 365 jours, croisement 50/200), plus l’indice de peur et d’avidité et le MVRV Z-Score. Les données propres à Ethereum, comme le taux de staking ou la quantité brûlée, n’y figurent pas."
     },
     {
      "q": "Pourquoi la page Bitcoin compte-t-elle plus d’indicateurs ?",
      "a": "Le Thermocap Z, fondé sur les récompenses de minage cumulées, n’apparaît que sur la page Bitcoin ; le score d’Ethereum utilise donc sept indicateurs. Par ailleurs, il n’y a plus de minage sur Ethereum depuis The Merge en 2022."
     },
     {
      "q": "Le score peut-il être bas alors que le prix de l’ETH monte ?",
      "a": "Oui. Dans l’onglet long terme (contrarian), le score baisse à mesure que le prix s’éloigne au-dessus de sa moyenne sur 200 jours et que le RSI grimpe. Pendant une longue hausse, un score bas signifie « plus proche de la surchauffe », et non qu’une baisse est annoncée."
     }
    ]
   },
   "de": {
    "title": "Ethereum (ETH) Kauf-Timing-Score und wie man die Indikatoren liest",
    "intro": "Diese Seite nimmt den Dollarkurs von Ethereum (ETH), berechnet daraus sieben Indikatoren – RSI(14), MACD(12·26·9), Angst-&-Gier-Index, Mayer-Multiple, Rückgang vom 365-Tage-Hoch, Golden/Death Cross 50/200 und MVRV Z-Score – und fasst sie zu einem Score von 0 bis 100 zusammen, der in fünf Stufen von STRONG BUY bis OVERHEATED angezeigt wird. Den Gesamtscore sehen Sie kostenlos im Browser, ohne Installation.",
    "coinH": "Was ist Ethereum (ETH)?",
    "coinP": [
     "Ethereum ist eine Smart-Contract-Plattform, die Vitalik Buterin Ende 2013 in einem Whitepaper vorschlug; das Mainnet ging im Juli 2015 an den Start. ETH ist der native Vermögenswert des Netzwerks und dient zur Bezahlung der Transaktionsgebühren (Gas). Dezentrale Finanzanwendungen (DeFi), Stablecoins, NFTs und Layer-2-Netzwerke laufen auf Ethereum.",
     "Ethereum startete mit Proof of Work (PoW) und wechselte im September 2022 mit „The Merge“ zu Proof of Stake (PoS). Anders als Bitcoin hat es keine feste Obergrenze für die Ausgabe, und seit dem London-Upgrade 2021 (EIP-1559) wird die Grundgebühr jeder Transaktion verbrannt – das Nettoangebot kann daher je nach Netzwerknutzung steigen oder sinken. Das Shanghai-Upgrade 2023 ermöglichte Auszahlungen aus dem Staking, und Dencun senkte 2024 die Datenkosten für Layer-2-Netzwerke."
    ],
    "applyH": "Indikatoren auf Ethereum anwenden",
    "apply": [
     "Volatilität: ETH schwankt meist stärker als Bitcoin, daher fällt der RSI häufiger unter 30 oder steigt über 70. Leiten Sie einen Boden oder ein Top nicht allein aus dem RSI ab, sondern gleichen Sie ihn mit dem MACD und dem 50/200-Trend ab.",
     "Verhältnis zu Bitcoin: ETH bewegt sich oft in dieselbe Richtung wie Bitcoin, das ETH/BTC-Verhältnis steigt und fällt jedoch eigenständig. Der Score auf dieser Seite nutzt nur den Dollarkurs und zeigt daher nicht, ob ETH besser oder schlechter läuft als Bitcoin.",
     "Angst-&-Gier-Index: Der Index von Alternative.me misst die Stimmung im gesamten Kryptomarkt mit starkem Bitcoin-Gewicht; eine eigene Ethereum-Version gibt es nicht. Die ETH-Seite zeigt denselben Wert wie die Bitcoin-Seite.",
     "Mayer-Multiple und Rückgang: Schwellen wie 0,8 und 2,4 beim Mayer-Multiple sind Faustregeln aus der Kursgeschichte von Bitcoin. In den Bärenmärkten 2018 und 2022 fiel ETH vom Hoch aus tiefer als Bitcoin; ein Rückgang von 50 % vom 365-Tage-Hoch bedeutet daher für sich allein noch keinen Boden.",
     "MVRV Z-Score: Die Community-Daten von CoinMetrics enthalten das MVRV von Ethereum, deshalb wird der Indikator hier berechnet. Der MVRV Z-Score wurde jedoch ursprünglich für Bitcoin entwickelt, und es ist nicht gesichert, dass dessen Referenzlinien (unter 0 = Bodenzone, über 5 = Überhitzung) für ETH genauso gut passen."
    ],
    "histH": "Ethereums Preiszyklen im Überblick",
    "hist": [
     "2014–2015: Nach einem Ether-Vorverkauf (Crowdsale) im Jahr 2014 startete das Mainnet im Juli 2015.",
     "2016: Nach dem Hack von The DAO machte eine Hard Fork dessen Folgen rückgängig; die Chain, die den Fork ablehnte, lebt als Ethereum Classic (ETC) weiter.",
     "2017–2018: Im ICO-Boom stieg ETH im Januar 2018 auf rund 1.400 Dollar und fiel im Dezember desselben Jahres unter 100 Dollar – mehr als 90 % unter dem Hoch.",
     "2021–2022: Im November 2021 erreichte ETH mit rund 4.800 Dollar ein neues Allzeithoch und fiel im Juni 2022 unter 1.000 Dollar. Im September desselben Jahres wurde The Merge abgeschlossen.",
     "2024: Im März wurde das Dencun-Upgrade aktiviert, im Juli begann in den USA der Handel mit Spot-Ethereum-ETFs."
    ],
    "faq": [
     {
      "q": "Gibt es einen eigenen Angst-&-Gier-Index für Ethereum?",
      "a": "Nein. Der hier angezeigte Wert ist der Index für den gesamten Kryptomarkt von Alternative.me, in dem Bitcoin stark gewichtet ist; deshalb trägt er den Hinweis „Gesamtmarkt“. Für die Eigendynamik von Ethereum sind Kursindikatoren wie RSI und MACD aussagekräftiger."
     },
     {
      "q": "Zeigt die Ethereum-Seite das MVRV an?",
      "a": "Ja. Die Community-API von CoinMetrics liefert MVRV-Daten für Ethereum, aus denen der MVRV Z-Score berechnet wird. Lassen sich die Daten nicht abrufen, zeigt die Karte N/A, und der Score wird mit auf die übrigen Indikatoren umverteilten Gewichten neu berechnet."
     },
     {
      "q": "Sollte ich jetzt Ethereum kaufen?",
      "a": "Diese Seite empfiehlt weder Kauf noch Verkauf. Der Score fasst zur Orientierung zusammen, wo die Indikatoren heute im Vergleich zu ihrer Geschichte stehen. Im Tab Langfristig (antizyklisch) bedeutet ein hoher Score, dass sich Signale für überverkaufte Kurse, Angst und Unterbewertung überlagern; im Tab Kurzfristig (Momentum) steigt er mit einem starken Aufwärtstrend. Auch nach einem hohen Score kann der Kurs weiter fallen – legen Sie daher zuerst Einstiegsweise, Anlagehorizont und tragbaren Verlust selbst fest."
     },
     {
      "q": "Fließen Staking-Renditen oder verbrannte Gebühren in den Score ein?",
      "a": "Nein. Der Score besteht nur aus fünf Kursindikatoren (RSI, MACD, Mayer-Multiple, 365-Tage-Rückgang, 50/200-Kreuz) sowie dem Angst-&-Gier-Index und dem MVRV Z-Score. Ethereum-spezifische Daten wie die Staking-Quote oder die verbrannte Menge sind nicht enthalten."
     },
     {
      "q": "Warum hat die Bitcoin-Seite mehr Indikatoren?",
      "a": "Thermocap Z, das auf den kumulierten Mining-Belohnungen beruht, gibt es nur auf der Bitcoin-Seite; der Ethereum-Score nutzt daher sieben Indikatoren. Zudem findet auf Ethereum seit The Merge 2022 kein Mining mehr statt."
     },
     {
      "q": "Kann der Score niedrig sein, obwohl der ETH-Kurs steigt?",
      "a": "Ja. Im Tab Langfristig (antizyklisch) sinkt der Score, je weiter der Kurs über dem 200-Tage-Durchschnitt liegt und je höher der RSI steigt. In einer langen Rally bedeutet ein niedriger Score „näher an der Überhitzung“ – keine Prognose eines Kursrückgangs."
     }
    ]
   },
   "it": {
    "title": "Punteggio di timing d’acquisto di Ethereum (ETH) e come leggere gli indicatori",
    "intro": "Questa pagina parte dal prezzo in dollari di Ethereum (ETH) e calcola sette indicatori — RSI(14), MACD(12·26·9), indice di paura e avidità, multiplo di Mayer, ribasso dal massimo a 365 giorni, golden/death cross 50/200 e MVRV Z-Score — combinandoli in un punteggio da 0 a 100 mostrato in cinque fasce, da STRONG BUY a OVERHEATED. Il punteggio complessivo si consulta gratis nel browser, senza installare nulla.",
    "coinH": "Che cos’è Ethereum (ETH)?",
    "coinP": [
     "Ethereum è una piattaforma di smart contract proposta da Vitalik Buterin in un whitepaper alla fine del 2013; la mainnet è stata avviata nel luglio 2015. ETH è l’asset nativo della rete e serve a pagare le commissioni delle transazioni (gas). Su Ethereum funzionano la finanza decentralizzata (DeFi), le stablecoin, gli NFT e le reti di layer 2.",
     "Ethereum è nato con la proof of work (PoW) ed è passato alla proof of stake (PoS) con «The Merge» nel settembre 2022. A differenza di Bitcoin non ha un tetto fisso all’emissione e, dall’aggiornamento London del 2021 (EIP-1559), la commissione base di ogni transazione viene bruciata: l’offerta netta può quindi crescere o diminuire a seconda dell’uso della rete. L’aggiornamento Shanghai del 2023 ha consentito i prelievi dallo staking e Dencun, nel 2024, ha ridotto i costi dei dati per le reti di layer 2."
    ],
    "applyH": "Applicare gli indicatori a Ethereum",
    "apply": [
     "Volatilità: ETH di solito oscilla più di Bitcoin, quindi l’RSI scende sotto 30 o sale sopra 70 più spesso. Non dedurre un minimo o un massimo dal solo RSI: confrontalo con il MACD e con il trend 50/200.",
     "Rapporto con Bitcoin: ETH si muove spesso nella stessa direzione di Bitcoin, ma il rapporto ETH/BTC sale e scende per conto suo. Il punteggio di questa pagina usa solo il prezzo in dollari, quindi non dice se ETH stia facendo meglio o peggio di Bitcoin.",
     "Indice di paura e avidità: l’indice di Alternative.me misura il sentiment dell’intero mercato cripto, con un forte peso di Bitcoin; non esiste una versione specifica per Ethereum. La pagina ETH mostra lo stesso valore della pagina Bitcoin.",
     "Multiplo di Mayer e ribasso: soglie come 0,8 e 2,4 del multiplo di Mayer sono regole empiriche ricavate dalla storia dei prezzi di Bitcoin. Nei mercati ribassisti del 2018 e del 2022 ETH è sceso dal massimo più di Bitcoin, per cui un ribasso del 50% dal massimo a 365 giorni non indica da solo un minimo.",
     "MVRV Z-Score: i dati della community di CoinMetrics includono l’MVRV di Ethereum, quindi la pagina lo calcola. Il MVRV Z-Score però è nato per Bitcoin e non c’è garanzia che le sue linee di riferimento (sotto 0 = zona di minimo, sopra 5 = surriscaldamento) valgano allo stesso modo per ETH."
    ],
    "histH": "I cicli di prezzo di Ethereum in sintesi",
    "hist": [
     "2014–2015: dopo una prevendita di ether (crowdsale) nel 2014, la mainnet è partita nel luglio 2015.",
     "2016: dopo l’attacco a The DAO, un hard fork ne ha annullato gli effetti; la catena che ha rifiutato il fork è proseguita come Ethereum Classic (ETC).",
     "2017–2018: sull’onda della febbre delle ICO, ETH è salito a circa 1.400 dollari nel gennaio 2018 per poi scendere sotto i 100 dollari a dicembre dello stesso anno, oltre il 90% sotto il massimo.",
     "2021–2022: nuovo massimo storico intorno ai 4.800 dollari nel novembre 2021, poi discesa sotto i 1.000 dollari nel giugno 2022. The Merge è stato completato a settembre di quell’anno.",
     "2024: a marzo è entrato in funzione l’aggiornamento Dencun e a luglio sono partite negli Stati Uniti le negoziazioni degli ETF spot su Ethereum."
    ],
    "faq": [
     {
      "q": "Esiste un indice di paura e avidità specifico per Ethereum?",
      "a": "No. Il valore mostrato qui è l’indice dell’intero mercato cripto pubblicato da Alternative.me, in cui Bitcoin pesa molto; per questo è etichettato «intero mercato». Per la dinamica propria di Ethereum conviene guardare indicatori di prezzo come RSI e MACD."
     },
     {
      "q": "La pagina di Ethereum mostra l’MVRV?",
      "a": "Sì. L’API della community di CoinMetrics fornisce i dati MVRV di Ethereum, da cui si calcola il MVRV Z-Score. Se i dati non si possono ottenere, la scheda mostra N/A e il punteggio viene ricalcolato ridistribuendo i pesi sugli indicatori rimanenti."
     },
     {
      "q": "Conviene comprare Ethereum adesso?",
      "a": "Questo sito non consiglia di comprare né di vendere. Il punteggio è un riepilogo indicativo di dove si trovano oggi gli indicatori rispetto alla loro storia. Nella scheda lungo termine (contrarian) un punteggio alto significa che segnali di ipervenduto, paura e sottovalutazione si sovrappongono; nella scheda breve termine (momentum) sale con la forza del trend rialzista. Anche dopo un punteggio alto il prezzo può continuare a scendere: stabilisci prima come entrare, l’orizzonte temporale e la perdita che puoi sostenere."
     },
     {
      "q": "I rendimenti dello staking o le commissioni bruciate entrano nel punteggio?",
      "a": "No. Il punteggio si basa solo su cinque indicatori di prezzo (RSI, MACD, multiplo di Mayer, ribasso a 365 giorni, incrocio 50/200), più l’indice di paura e avidità e il MVRV Z-Score. Dati specifici di Ethereum come la quota in staking o la quantità bruciata non sono inclusi."
     },
     {
      "q": "Perché la pagina di Bitcoin ha più indicatori?",
      "a": "Il Thermocap Z, basato sulle ricompense di mining cumulate, compare solo nella pagina di Bitcoin, quindi il punteggio di Ethereum usa sette indicatori. Inoltre su Ethereum non c’è più mining dal Merge del 2022."
     },
     {
      "q": "Il punteggio può essere basso mentre il prezzo di ETH sale?",
      "a": "Sì. Nella scheda lungo termine (contrarian) il punteggio scende quanto più il prezzo si allontana sopra la media a 200 giorni e quanto più sale l’RSI. In un rialzo prolungato, un punteggio basso significa «più vicino al surriscaldamento», non la previsione di un calo."
     }
    ]
   },
   "pt": {
    "title": "Pontuação de momento de compra do Ethereum (ETH) e como ler os indicadores",
    "intro": "Esta página usa o preço do Ethereum (ETH) em dólar para calcular sete indicadores — RSI(14), MACD(12·26·9), índice de medo e ganância, múltiplo de Mayer, queda desde a máxima de 365 dias, cruzamento dourado/da morte 50/200 e MVRV Z-Score — e combiná-los numa pontuação de 0 a 100, exibida em cinco faixas de STRONG BUY a OVERHEATED. A pontuação geral pode ser vista de graça no navegador, sem instalar nada.",
    "coinH": "O que é Ethereum (ETH)?",
    "coinP": [
     "Ethereum é uma plataforma de contratos inteligentes proposta por Vitalik Buterin em um white paper no fim de 2013; a rede principal entrou no ar em julho de 2015. O ETH é o ativo nativo da rede e paga as taxas das transações (gas). Finanças descentralizadas (DeFi), stablecoins, NFTs e redes de camada 2 funcionam sobre o Ethereum.",
     "O Ethereum começou com prova de trabalho (PoW) e passou para prova de participação (PoS) com o “The Merge”, em setembro de 2022. Ao contrário do Bitcoin, não tem um limite fixo de emissão e, desde a atualização London de 2021 (EIP-1559), a taxa base de cada transação é queimada — por isso a oferta líquida pode aumentar ou diminuir conforme o uso da rede. A atualização Shanghai, de 2023, liberou os saques do staking, e a Dencun, em 2024, reduziu o custo de dados das redes de camada 2."
    ],
    "applyH": "Como aplicar os indicadores ao Ethereum",
    "apply": [
     "Volatilidade: o ETH costuma oscilar mais que o Bitcoin, então o RSI cai abaixo de 30 ou passa de 70 com mais frequência. Não conclua que é fundo ou topo só pelo RSI — compare com o MACD e a tendência 50/200.",
     "Relação com o Bitcoin: o ETH muitas vezes segue na mesma direção do Bitcoin, mas a razão ETH/BTC sobe e desce por conta própria. A pontuação desta página usa só o preço em dólar, portanto não mostra se o ETH está indo melhor ou pior que o Bitcoin.",
     "Índice de medo e ganância: o índice da Alternative.me mede o sentimento de todo o mercado cripto, com grande peso do Bitcoin; não existe uma versão própria do Ethereum. A página do ETH mostra o mesmo valor da página do Bitcoin.",
     "Múltiplo de Mayer e queda: limites como 0,8 e 2,4 no múltiplo de Mayer são regras práticas tiradas da história de preços do Bitcoin. Nos mercados de baixa de 2018 e 2022, o ETH caiu mais a partir do topo do que o Bitcoin, então uma queda de 50% desde a máxima de 365 dias não significa, por si só, que o fundo chegou.",
     "MVRV Z-Score: os dados comunitários da CoinMetrics incluem o MVRV do Ethereum, por isso a página o calcula. Mas o MVRV Z-Score foi criado originalmente para o Bitcoin, e não há garantia de que as linhas de referência dele (abaixo de 0 = zona de fundo, acima de 5 = superaquecimento) sirvam igualmente para o ETH."
    ],
    "histH": "Resumo dos ciclos de preço do Ethereum",
    "hist": [
     "2014–2015: depois de uma pré-venda de ether (crowdsale) em 2014, a rede principal foi lançada em julho de 2015.",
     "2016: após o ataque hacker ao The DAO, um hard fork reverteu seus efeitos; a cadeia que rejeitou o fork seguiu como Ethereum Classic (ETC).",
     "2017–2018: em meio à febre das ICOs, o ETH subiu para cerca de US$ 1.400 em janeiro de 2018 e caiu abaixo de US$ 100 em dezembro do mesmo ano, mais de 90% abaixo do topo.",
     "2021–2022: marcou nova máxima histórica de cerca de US$ 4.800 em novembro de 2021 e caiu abaixo de US$ 1.000 em junho de 2022. O The Merge foi concluído em setembro daquele ano.",
     "2024: a atualização Dencun entrou em vigor em março e, em julho, ETFs à vista de Ethereum começaram a ser negociados nos EUA."
    ],
    "faq": [
     {
      "q": "Existe um índice de medo e ganância só do Ethereum?",
      "a": "Não. O valor de medo e ganância desta página é o índice de todo o mercado cripto publicado pela Alternative.me, com grande peso do Bitcoin; por isso ele vem marcado como “mercado todo”. Para ver o impulso próprio do Ethereum, observe indicadores de preço como RSI e MACD."
     },
     {
      "q": "A página do Ethereum mostra o MVRV?",
      "a": "Sim. A API comunitária da CoinMetrics fornece dados de MVRV do Ethereum, usados para calcular o MVRV Z-Score. Se os dados não puderem ser obtidos, o cartão mostra N/A e a pontuação é recalculada redistribuindo os pesos entre os demais indicadores."
     },
     {
      "q": "Devo comprar Ethereum agora?",
      "a": "Este site não recomenda comprar nem vender. A pontuação é um resumo de referência de onde os indicadores estão hoje em relação ao histórico. Na aba de longo prazo (contrária), uma pontuação alta indica que sinais de sobrevenda, medo e subvalorização estão se somando; na aba de curto prazo (momentum), ela sobe quanto mais forte for a tendência de alta. Mesmo depois de uma pontuação alta o preço pode continuar caindo, então defina antes sua forma de entrada, seu prazo e a perda que você aceita."
     },
     {
      "q": "Rendimentos de staking ou a queima de taxas entram na pontuação?",
      "a": "Não. A pontuação é formada apenas por cinco indicadores de preço (RSI, MACD, múltiplo de Mayer, queda de 365 dias e cruzamento 50/200), mais o índice de medo e ganância e o MVRV Z-Score. Dados próprios do Ethereum, como a proporção em staking ou a quantidade queimada, não entram."
     },
     {
      "q": "Por que a página do Bitcoin tem mais indicadores?",
      "a": "O Thermocap Z, baseado nas recompensas de mineração acumuladas, aparece só na página do Bitcoin; por isso a pontuação do Ethereum usa sete indicadores. Além disso, o Ethereum não tem mais mineração desde o The Merge, em 2022."
     },
     {
      "q": "A pontuação pode ficar baixa com o preço do ETH subindo?",
      "a": "Pode. Na aba de longo prazo (contrária), a pontuação cai à medida que o preço se afasta acima da média de 200 dias e o RSI sobe. Numa alta prolongada, pontuação baixa quer dizer “mais perto do superaquecimento”, e não uma previsão de queda."
     }
    ]
   },
   "ru": {
    "title": "Оценка момента покупки Эфириума (ETH) и как читать индикаторы",
    "intro": "Эта страница берёт долларовую цену Эфириума (ETH) и рассчитывает семь индикаторов — RSI(14), MACD(12·26·9), индекс страха и жадности, множитель Майера, просадку от 365-дневного максимума, золотой/мёртвый крест 50/200 и MVRV Z-оценку, — а затем сводит их в оценку от 0 до 100 с пятью уровнями от STRONG BUY до OVERHEATED. Итоговую оценку можно бесплатно посмотреть в браузере без установки.",
    "coinH": "Что такое Эфириум (ETH)?",
    "coinP": [
     "Эфириум — платформа смарт-контрактов, которую Виталик Бутерин предложил в вайтпейпере в конце 2013 года; основная сеть заработала в июле 2015 года. ETH — собственный актив сети, им оплачиваются комиссии за транзакции (газ). На Эфириуме работают децентрализованные финансы (DeFi), стейблкоины, NFT и сети второго уровня.",
     "Изначально Эфириум работал на доказательстве работы (PoW), а в сентябре 2022 года благодаря The Merge («Слиянию») перешёл на доказательство доли (PoS). В отличие от биткоина, у него нет фиксированного лимита эмиссии, а после обновления London в 2021 году (EIP-1559) базовая часть комиссии каждой транзакции сжигается, поэтому чистое предложение может расти или сокращаться в зависимости от активности сети. Обновление Shanghai в 2023 году открыло вывод средств из стейкинга, а Dencun в 2024 году удешевил данные для сетей второго уровня."
    ],
    "applyH": "Как применять индикаторы к Эфириуму",
    "apply": [
     "Волатильность: ETH обычно колеблется сильнее биткоина, поэтому RSI чаще опускается ниже 30 или поднимается выше 70. Не делайте вывод о дне или вершине по одному RSI — сверяйте его с MACD и трендом 50/200.",
     "Связь с биткоином: ETH часто движется в ту же сторону, что и биткоин, но соотношение ETH/BTC растёт и падает само по себе. Оценка на этой странице считается только по долларовой цене, поэтому не показывает, сильнее или слабее ETH, чем биткоин.",
     "Индекс страха и жадности: индекс Alternative.me отражает настроения всего криптовалютного рынка с большим весом биткоина; отдельной версии для Эфириума нет. На странице ETH отображается то же значение, что и на странице биткоина.",
     "Множитель Майера и просадка: пороги вроде 0,8 и 2,4 для множителя Майера — эмпирические правила, выведенные из истории цены биткоина. На медвежьих рынках 2018 и 2022 годов ETH падал от максимума сильнее биткоина, поэтому просадка на 50% от 365-дневного максимума сама по себе ещё не означает дна.",
     "MVRV Z-оценка: в общедоступных данных CoinMetrics есть MVRV Эфириума, поэтому страница его рассчитывает. Однако MVRV Z-оценка изначально создавалась для биткоина, и нет гарантии, что её ориентиры (ниже 0 — зона дна, выше 5 — перегрев) так же хорошо подходят для ETH."
    ],
    "histH": "Ценовые циклы Эфириума вкратце",
    "hist": [
     "2014–2015: после предпродажи эфира (краудсейла) в 2014 году основная сеть запустилась в июле 2015 года.",
     "2016: после взлома The DAO хардфорк отменил его последствия; цепочка, не принявшая форк, продолжила существование как Ethereum Classic (ETC).",
     "2017–2018: на волне бума ICO ETH в январе 2018 года поднялся примерно до 1400 долларов, а в декабре того же года опустился ниже 100 долларов — более чем на 90% ниже пика.",
     "2021–2022: в ноябре 2021 года ETH обновил исторический максимум — около 4800 долларов, а в июне 2022 года опустился ниже 1000 долларов. В сентябре того же года переход The Merge был завершён.",
     "2024: в марте заработало обновление Dencun, а в июле в США начались торги спотовыми ETF на Эфириум."
    ],
    "faq": [
     {
      "q": "Есть ли отдельный индекс страха и жадности для Эфириума?",
      "a": "Нет. Значение на этой странице — общерыночный криптоиндекс Alternative.me, в котором велик вес биткоина; поэтому у него стоит пометка «весь рынок». Собственную динамику Эфириума лучше оценивать по ценовым индикаторам, например RSI и MACD."
     },
     {
      "q": "Показывается ли MVRV для Эфириума?",
      "a": "Да. Общедоступный API CoinMetrics даёт данные MVRV по Эфириуму, по ним рассчитывается MVRV Z-оценка. Если данные получить не удалось, карточка показывает N/A, а оценка пересчитывается с перераспределением весов на остальные индикаторы."
     },
     {
      "q": "Стоит ли покупать Эфириум сейчас?",
      "a": "Сайт не рекомендует ни покупать, ни продавать. Оценка — справочная сводка того, где сейчас находятся индикаторы относительно своей истории. На долгосрочной вкладке (контртренд) высокая оценка означает, что совпали сигналы перепроданности, страха и недооценки; на краткосрочной вкладке (моментум) она растёт вместе с силой восходящего тренда. Даже после высокой оценки цена может продолжить падать, поэтому сначала сами определите способ входа, горизонт и допустимый убыток."
     },
     {
      "q": "Учитываются ли в оценке доходность стейкинга и сжигание комиссий?",
      "a": "Нет. Оценка строится только на пяти ценовых индикаторах (RSI, MACD, множитель Майера, просадка за 365 дней, крест 50/200), а также на индексе страха и жадности и MVRV Z-оценке. Специфические данные Эфириума, такие как доля в стейкинге или объём сожжённых монет, не используются."
     },
     {
      "q": "Почему на странице биткоина больше индикаторов?",
      "a": "Thermocap Z, основанный на накопленных наградах майнеров, есть только на странице биткоина, поэтому оценка Эфириума строится по семи индикаторам. К тому же после The Merge в 2022 году майнинга в Эфириуме больше нет."
     },
     {
      "q": "Может ли оценка быть низкой, когда цена ETH растёт?",
      "a": "Да. На долгосрочной вкладке (контртренд) оценка снижается тем сильнее, чем выше цена уходит над 200-дневной средней и чем выше RSI. Во время затяжного роста низкая оценка означает «ближе к перегреву», а не прогноз падения."
     }
    ]
   },
   "nl": {
    "title": "Ethereum (ETH) koopmoment-score en zo lees je de indicatoren",
    "intro": "Deze pagina neemt de dollarkoers van Ethereum (ETH), berekent daaruit zeven indicatoren – RSI(14), MACD(12·26·9), de angst- en hebzuchtindex, de Mayer Multiple, de daling vanaf de 365-daagse top, de golden/death cross 50/200 en de MVRV Z-score – en combineert die tot een score van 0 tot 100, weergegeven in vijf banden van STRONG BUY tot OVERHEATED. De totaalscore bekijk je gratis in de browser, zonder iets te installeren.",
    "coinH": "Wat is Ethereum (ETH)?",
    "coinP": [
     "Ethereum is een smart-contractplatform dat Vitalik Buterin eind 2013 in een whitepaper voorstelde; het mainnet ging in juli 2015 live. ETH is de eigen munt van het netwerk en betaalt de transactiekosten (gas). Gedecentraliseerde financiën (DeFi), stablecoins, NFT’s en layer-2-netwerken draaien allemaal op Ethereum.",
     "Ethereum begon met proof of work (PoW) en stapte in september 2022 met ‘The Merge’ over op proof of stake (PoS). Anders dan bij Bitcoin is er geen vast maximum aan de uitgifte, en sinds de London-upgrade van 2021 (EIP-1559) wordt de basisvergoeding van elke transactie verbrand, waardoor het netto-aanbod kan stijgen of dalen afhankelijk van het netwerkgebruik. De Shanghai-upgrade van 2023 maakte opnames uit staking mogelijk en Dencun verlaagde in 2024 de datakosten voor layer-2-netwerken."
    ],
    "applyH": "De indicatoren toepassen op Ethereum",
    "apply": [
     "Volatiliteit: ETH beweegt doorgaans heftiger dan Bitcoin, waardoor de RSI vaker onder 30 zakt of boven 70 uitkomt. Trek geen conclusie over een bodem of top op basis van alleen de RSI, maar leg hem naast de MACD en de 50/200-trend.",
     "Relatie met Bitcoin: ETH beweegt vaak dezelfde kant op als Bitcoin, maar de ETH/BTC-verhouding stijgt en daalt op eigen kracht. De score op deze pagina gebruikt alleen de dollarkoers en laat dus niet zien of ETH het beter of slechter doet dan Bitcoin.",
     "Angst- en hebzuchtindex: de index van Alternative.me meet het sentiment in de hele cryptomarkt, met veel gewicht voor Bitcoin; een aparte Ethereum-versie bestaat niet. De ETH-pagina toont dezelfde waarde als de Bitcoin-pagina.",
     "Mayer Multiple en daling: drempels als 0,8 en 2,4 voor de Mayer Multiple zijn vuistregels uit de koersgeschiedenis van Bitcoin. In de bearmarkten van 2018 en 2022 zakte ETH dieper vanaf de top dan Bitcoin, dus een daling van 50% vanaf de 365-daagse top betekent op zichzelf nog geen bodem.",
     "MVRV Z-score: de communitydata van CoinMetrics bevatten de MVRV van Ethereum, dus deze pagina berekent hem. De MVRV Z-score is echter oorspronkelijk voor Bitcoin bedacht en het is niet zeker dat de referentielijnen daarvan (onder 0 = bodemzone, boven 5 = oververhitting) even goed passen bij ETH."
    ],
    "histH": "De koerscycli van Ethereum in het kort",
    "hist": [
     "2014–2015: na een voorverkoop (crowdsale) van ether in 2014 ging het mainnet in juli 2015 live.",
     "2016: na de hack van The DAO draaide een hard fork de gevolgen terug; de chain die de fork afwees, ging verder als Ethereum Classic (ETC).",
     "2017–2018: tijdens de ICO-hype steeg ETH in januari 2018 tot ongeveer 1.400 dollar en zakte in december van dat jaar onder 100 dollar, meer dan 90% onder de top.",
     "2021–2022: in november 2021 zette ETH een nieuwe recordkoers neer van ongeveer 4.800 dollar en in juni 2022 zakte de koers onder 1.000 dollar. In september van dat jaar werd The Merge afgerond.",
     "2024: in maart werd de Dencun-upgrade geactiveerd en in juli begon in de VS de handel in spot-ETF’s op Ethereum."
    ],
    "faq": [
     {
      "q": "Bestaat er een aparte angst- en hebzuchtindex voor Ethereum?",
      "a": "Nee. De waarde op deze pagina is de marktbrede crypto-index van Alternative.me, waarin Bitcoin zwaar weegt; daarom staat er ‘hele markt’ bij. Voor de eigen dynamiek van Ethereum kun je beter kijken naar koersindicatoren zoals RSI en MACD."
     },
     {
      "q": "Toont de Ethereum-pagina ook MVRV?",
      "a": "Ja. De community-API van CoinMetrics levert MVRV-data voor Ethereum, waarmee de MVRV Z-score wordt berekend. Lukt het ophalen niet, dan toont de kaart N/A en wordt de score opnieuw berekend met de gewichten verdeeld over de overige indicatoren."
     },
     {
      "q": "Moet ik nu Ethereum kopen?",
      "a": "Deze site raadt kopen noch verkopen aan. De score is een samenvatting ter referentie van waar de indicatoren nu staan ten opzichte van hun geschiedenis. Op het tabblad lange termijn (tegendraads) betekent een hoge score dat signalen van oversold, angst en onderwaardering samenvallen; op het tabblad korte termijn (momentum) stijgt hij naarmate de opwaartse trend sterker is. Ook na een hoge score kan de koers verder dalen, dus bepaal eerst zelf hoe je instapt, wat je beleggingshorizon is en welk verlies je kunt dragen."
     },
     {
      "q": "Tellen stakingrendementen of verbrande transactiekosten mee in de score?",
      "a": "Nee. De score bestaat alleen uit vijf koersindicatoren (RSI, MACD, Mayer Multiple, daling over 365 dagen, 50/200-kruising) plus de angst- en hebzuchtindex en de MVRV Z-score. Ethereum-specifieke gegevens zoals het stakingpercentage of de verbrande hoeveelheid zitten er niet in."
     },
     {
      "q": "Waarom heeft de Bitcoin-pagina meer indicatoren?",
      "a": "Thermocap Z, gebaseerd op de opgetelde miningbeloningen, staat alleen op de Bitcoin-pagina; de Ethereum-score gebruikt daarom zeven indicatoren. Bovendien wordt er op Ethereum sinds The Merge in 2022 niet meer gemined."
     },
     {
      "q": "Kan de score laag zijn terwijl de ETH-koers stijgt?",
      "a": "Ja. Op het tabblad lange termijn (tegendraads) daalt de score naarmate de koers verder boven het 200-daags gemiddelde komt en de RSI hoger wordt. In een lange rally betekent een lage score ‘dichter bij oververhitting’, niet dat een daling wordt voorspeld."
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
