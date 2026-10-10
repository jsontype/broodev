/* 하단 SEO 본문 다국어 데이터 + 렌더러. index.html(광고) / member/index.html(구독자) 공유.
   언어 전환 시 window.renderSEO(lang) 호출 → section.seo 를 해당 언어로 다시 그림.
   기본 정적 HTML(한국어)은 무JS 크롤러용 폴백으로 남겨두고, JS 실행 시 현재 언어로 교체. */
(function () {
  var SEO = {
    ko: {
      title: '리플 공포·탐욕 지수 & 매수 타이밍 점수',
      intro: '리플 공포지수(공포·탐욕 지수, Fear & Greed Index)를 포함한 7개 실시간 지표를 합성해 “지금이 매수 타이밍인가?”를 0~100 점수로 보여주는 무료 대시보드입니다. 설치 없이 브라우저에서 바로 실행되며 13개 언어를 지원합니다.',
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
        { q: '공포지수가 낮으면 리플을 사야 하나요?', a: '극단적 공포는 역사적으로 분할 매수 기회였던 경우가 많지만, 공포지수 하나만 보면 “떨어지는 칼날”을 잡을 위험이 있습니다. 본 점수는 RSI·MACD·마이어 배수·낙폭·이동평균 크로스를 함께 보고, 하락 추세에서는 점수를 보수적으로 낮춥니다.' },
        { q: '매수 타이밍 점수는 어떻게 계산되나요?', a: '7개 지표를 각각 0~100 부분점수로 환산해 가중 합성합니다. 결과는 0~100이며 5단계 밴드로 표시됩니다.' },
        { q: '무료인가요? 설치가 필요한가요?', a: '완전 무료이며 설치가 필요 없습니다. CoinGecko·Binance·Alternative.me 공개 API에서 실시간 데이터를 가져옵니다.' },
        { q: '공포지수와 매수 타이밍 점수는 무엇이 다른가요?', a: '공포지수는 심리 한 가지 지표(0~100)이고, 매수 타이밍 점수는 공포지수를 포함한 7개 지표를 합성한 종합 점수(0~100)입니다.' },
        { q: '공포지수 데이터는 어디서 가져오나요? 얼마나 자주 갱신되나요?', a: '공포·탐욕 지수는 Alternative.me, 가격·일봉은 CoinGecko·Binance, 온체인 지표는 CoinMetrics 공개 API에서 실시간으로 가져옵니다. 화면은 약 1분 주기로 자동 갱신됩니다.' },
        { q: '리플 지금 사도 되나요?', a: '정답은 없지만, 매수 타이밍 점수(0~100)로 현재 시장이 과매도·공포 구간인지 과열·탐욕 구간인지 객관적으로 가늠할 수 있습니다. 장기(역발상) 탭 기준 점수가 높을수록 공포·저평가가 겹친 분할 매수 우호 구간, 낮을수록 과열 경계 구간입니다. 참고 신호일 뿐 투자 자문이 아닙니다.' },
        { q: '단기와 장기 매수 타이밍은 어떻게 다른가요?', a: '점수는 단기·장기 두 탭으로 나뉩니다. 단기(모멘텀)는 약 1~3개월 추세추종 관점으로 상승 추세가 강할수록 높고, 장기(역발상)는 약 1년 이상 사이클 관점으로 공포·저평가일수록 높습니다. 2017년 이후 백테스트에서 단기는 모멘텀, 장기는 역발상 방향이 더 잘 맞았습니다.' },
        { q: 'BOTTOM RADAR(바닥 점수)는 무엇인가요?', a: 'MVRV Z-점수 같은 온체인 지표로 시가총액이 투자자 평균 매수원가 대비 어디에 있는지 재서, 역사적 바닥 구간과의 근접도를 0~100으로 보여주는 보조 게이지입니다. 계산 근거는 “비트코인 바닥” 해설 페이지에 공개되어 있습니다.' }
      ],
      disclaimer: '⚠ 본 점수는 공개 지표를 합성한 참고 신호이며 투자 자문이 아닙니다. 모든 투자 판단과 책임은 이용자 본인에게 있습니다.'
    },
    en: {
      title: 'XRP Fear & Greed Index & Buy-Timing Score',
      intro: 'A free dashboard that synthesizes 7 real-time indicators — including the XRP Fear & Greed Index — into a 0–100 “is now a good time to buy?” score. Runs in your browser with no install, in 13 languages.',
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
        { q: 'Should I buy XRP when the index is low?', a: 'Extreme fear has often been an accumulation opportunity, but relying on the index alone risks catching a falling knife. This score also weighs RSI, MACD, Mayer Multiple, drawdown and moving-average crosses, and lowers the score conservatively in downtrends.' },
        { q: 'How is the buy-timing score calculated?', a: 'Each of the 7 indicators is converted to a 0–100 sub-score and weighted together. The result is 0–100, shown in 5 bands.' },
        { q: 'Is it free? Do I need to install anything?', a: 'It is completely free with no install. Real-time data comes from CoinGecko, Binance and Alternative.me public APIs.' },
        { q: 'How is the index different from the buy-timing score?', a: 'The index is a single sentiment metric (0–100); the buy-timing score is a composite of 7 indicators including the index (0–100).' },
        { q: 'Where does the data come from, and how often does it refresh?', a: 'The Fear & Greed Index comes from Alternative.me, prices and daily candles from the CoinGecko and Binance public APIs, and on-chain metrics from CoinMetrics. The screen auto-refreshes roughly every minute.' },
        { q: 'Should I buy XRP right now?', a: 'There is no single answer, but the buy-timing score (0–100) gives an objective read on whether the market is in an oversold/fear zone or an overheated/greed zone. On the long-term (contrarian) tab, higher scores mark zones where fear and undervaluation overlap — historically favorable for DCA — while lower scores warn of overheating. It is a reference signal, not investment advice.' },
        { q: 'How do short-term and long-term buy timing differ?', a: 'The score is split into two tabs. Short-term (momentum) takes a 1–3 month trend-following view and rises with strong uptrends; long-term (contrarian) takes a 1-year-plus cycle view and rises with fear and undervaluation. In backtests since 2017, momentum worked better short-term and contrarian worked better long-term.' },
        { q: 'What is the BOTTOM RADAR (bottom score)?', a: 'A secondary gauge that uses on-chain metrics such as the MVRV Z-Score to measure where market cap sits relative to investors’ average cost basis, showing proximity to historic bottom zones on a 0–100 scale. The full calculation is published on the “Bitcoin bottom” guide page.' }
      ],
      disclaimer: '⚠ This score is a reference signal built from public indicators, not investment advice. All decisions and responsibility are your own.'
    },
    ja: {
      title: 'リップル 恐怖・強欲指数 & 買い時スコア',
      intro: 'リップルの恐怖・強欲指数（Fear & Greed Index）を含む7つのリアルタイム指標を合成し、「今が買い時か？」を0〜100のスコアで示す無料ダッシュボードです。インストール不要でブラウザから即実行、13言語対応。',
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
        { q: '指数が低ければリップルを買うべき？', a: '極端な恐怖は歴史的に分割買いの好機だったことが多いですが、指数だけに頼ると「落ちるナイフ」を掴む危険があります。本スコアはRSI・MACD・マイヤー倍率・下落率・移動平均クロスも合わせて見て、下落トレンドでは保守的にスコアを下げます。' },
        { q: '買い時スコアはどう計算される？', a: '7指標をそれぞれ0〜100の部分スコアに換算し加重合成します。結果は0〜100で、5段階バンドで表示します。' },
        { q: '無料？インストールは必要？', a: '完全無料・インストール不要です。CoinGecko・Binance・Alternative.me の公開APIからリアルタイムデータを取得します。' },
        { q: '指数と買い時スコアの違いは？', a: '指数は心理1指標(0〜100)、買い時スコアは指数を含む7指標を合成した総合スコア(0〜100)です。' },
        { q: 'データはどこから？更新頻度は？', a: '恐怖・強欲指数はAlternative.me、価格・日足はCoinGecko・Binance、オンチェーン指標はCoinMetricsの公開APIからリアルタイムで取得します。画面は約1分ごとに自動更新されます。' },
        { q: 'リップルは今買ってもいい？', a: '正解はありませんが、買い時スコア(0〜100)で現在の市場が売られすぎ・恐怖圏か、過熱・強欲圏かを客観的に測れます。長期（逆張り）タブではスコアが高いほど恐怖と割安が重なる分割買いに有利な圏、低いほど過熱警戒圏です。参考シグナルであり投資助言ではありません。' },
        { q: '短期と長期の買い時はどう違う？', a: 'スコアは短期・長期の2タブに分かれます。短期（モメンタム）は約1〜3か月のトレンドフォロー視点で上昇トレンドが強いほど高く、長期（逆張り）は約1年以上のサイクル視点で恐怖・割安なほど高くなります。2017年以降のバックテストでは、短期はモメンタム、長期は逆張りの方向がより有効でした。' },
        { q: 'BOTTOM RADAR（底値スコア）とは？', a: 'MVRV Zスコアなどのオンチェーン指標で、時価総額が投資家の平均取得単価に対してどの位置にあるかを測り、歴史的な底値圏への近さを0〜100で示す補助ゲージです。計算根拠は「ビットコインの底」解説ページで公開しています。' }
      ],
      disclaimer: '⚠ 本スコアは公開指標を合成した参考シグナルであり、投資助言ではありません。すべての判断と責任は利用者ご自身にあります。'
    },
    zh: {
      title: '瑞波恐惧与贪婪指数 & 买入时机评分',
      intro: '一个免费仪表板，将包括瑞波恐惧与贪婪指数（Fear & Greed Index）在内的7个实时指标合成为0–100的“现在是买入时机吗？”评分。无需安装，浏览器即开即用，支持13种语言。',
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
        { q: '指数低就该买瑞波吗？', a: '极度恐惧在历史上常是分批买入良机，但只看指数有“接飞刀”的风险。本评分同时参考RSI、MACD、梅耶倍数、回撤与均线交叉，并在下跌趋势中保守下调评分。' },
        { q: '买入时机评分如何计算？', a: '将7个指标各自换算为0–100分项评分并加权合成。结果为0–100，以5档显示。' },
        { q: '免费吗？需要安装吗？', a: '完全免费、无需安装。实时数据来自 CoinGecko、Binance、Alternative.me 公开API。' },
        { q: '指数与买入时机评分有何不同？', a: '指数是单一情绪指标(0–100)；买入时机评分是包含该指数在内的7指标综合评分(0–100)。' },
        { q: '数据来自哪里？多久更新一次？', a: '恐惧与贪婪指数来自Alternative.me，价格与日K来自CoinGecko和Binance公开API，链上指标来自CoinMetrics。页面约每1分钟自动刷新。' },
        { q: '现在可以买瑞波吗？', a: '没有标准答案，但买入时机评分(0–100)能客观判断当前市场处于超卖·恐惧区还是过热·贪婪区。在长期（逆向）标签页中，评分越高代表恐惧与低估重叠、历史上利于分批买入的区间；越低则是过热警戒区。仅供参考，并非投资建议。' },
        { q: '短期和长期买入时机有何不同？', a: '评分分为短期、长期两个标签页。短期（动量）以约1–3个月的趋势跟随视角，上升趋势越强评分越高；长期（逆向）以约1年以上的周期视角，越恐惧、越低估评分越高。2017年以来的回测显示，短期动量、长期逆向的方向更有效。' },
        { q: 'BOTTOM RADAR（底部评分）是什么？', a: '一个辅助仪表，利用MVRV Z分数等链上指标衡量市值相对投资者平均持仓成本的位置，以0–100显示与历史底部区间的接近程度。计算依据在“比特币底部”解读页面公开。' }
      ],
      disclaimer: '⚠ 本评分由公开指标合成，仅供参考，并非投资建议。一切投资决定与责任由用户自负。'
    },
    'zh-Hant': {
      title: '瑞波恐懼與貪婪指數 & 買入時機評分',
      intro: '一個免費儀表板，將包括瑞波恐懼與貪婪指數（Fear & Greed Index）在內的7個即時指標合成為0–100的「現在是買入時機嗎？」評分。免安裝、瀏覽器即開即用，支援13種語言。',
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
        { q: '指數低就該買瑞波嗎？', a: '極度恐懼在歷史上常是分批買入良機，但只看指數有「接飛刀」的風險。本評分同時參考RSI、MACD、梅耶倍數、回撤與均線交叉，並在下跌趨勢中保守下調評分。' },
        { q: '買入時機評分如何計算？', a: '將7個指標各自換算為0–100分項評分並加權合成。結果為0–100，以5檔顯示。' },
        { q: '免費嗎？需要安裝嗎？', a: '完全免費、免安裝。即時資料來自 CoinGecko、Binance、Alternative.me 公開API。' },
        { q: '指數與買入時機評分有何不同？', a: '指數是單一情緒指標(0–100)；買入時機評分是包含該指數在內的7指標綜合評分(0–100)。' },
        { q: '資料來自哪裡？多久更新一次？', a: '恐懼與貪婪指數來自Alternative.me，價格與日K來自CoinGecko和Binance公開API，鏈上指標來自CoinMetrics。頁面約每1分鐘自動重新整理。' },
        { q: '現在可以買瑞波嗎？', a: '沒有標準答案，但買入時機評分(0–100)能客觀判斷當前市場處於超賣·恐懼區還是過熱·貪婪區。在長期（逆向）分頁中，評分越高代表恐懼與低估重疊、歷史上利於分批買入的區間；越低則是過熱警戒區。僅供參考，並非投資建議。' },
        { q: '短期和長期買入時機有何不同？', a: '評分分為短期、長期兩個分頁。短期（動量）以約1–3個月的趨勢跟隨視角，上升趨勢越強評分越高；長期（逆向）以約1年以上的週期視角，越恐懼、越低估評分越高。2017年以來的回測顯示，短期動量、長期逆向的方向更有效。' },
        { q: 'BOTTOM RADAR（底部評分）是什麼？', a: '一個輔助儀表，利用MVRV Z分數等鏈上指標衡量市值相對投資者平均持倉成本的位置，以0–100顯示與歷史底部區間的接近程度。計算依據在「比特幣底部」解說頁面公開。' }
      ],
      disclaimer: '⚠ 本評分由公開指標合成，僅供參考，並非投資建議。一切投資決定與責任由用戶自負。'
    },
    es: {
      title: 'Índice de miedo y codicia de XRP y puntuación de momento de compra',
      intro: 'Un panel gratuito que sintetiza 7 indicadores en tiempo real —incluido el índice de miedo y codicia de XRP— en una puntuación de 0 a 100 sobre «¿es buen momento para comprar?». Funciona en el navegador sin instalación, en 13 idiomas.',
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
        { q: '¿Debo comprar XRP cuando el índice está bajo?', a: 'El miedo extremo ha sido a menudo una oportunidad de acumulación, pero fiarse solo del índice arriesga «atrapar un cuchillo que cae». Esta puntuación también pondera RSI, MACD, múltiplo de Mayer, caída y cruces de medias, y la reduce de forma conservadora en tendencias bajistas.' },
        { q: '¿Cómo se calcula la puntuación de compra?', a: 'Cada uno de los 7 indicadores se convierte en una subpuntuación de 0 a 100 y se pondera. El resultado es 0–100, mostrado en 5 bandas.' },
        { q: '¿Es gratis? ¿Necesito instalar algo?', a: 'Es totalmente gratis y sin instalación. Los datos en tiempo real provienen de las API públicas de CoinGecko, Binance y Alternative.me.' },
        { q: '¿En qué se diferencia el índice de la puntuación de compra?', a: 'El índice es una sola métrica de sentimiento (0–100); la puntuación de compra es un compuesto de 7 indicadores que incluye el índice (0–100).' },
        { q: '¿De dónde vienen los datos y con qué frecuencia se actualizan?', a: 'El índice de miedo y codicia viene de Alternative.me; los precios y velas diarias, de las API públicas de CoinGecko y Binance; y las métricas on-chain, de CoinMetrics. La pantalla se actualiza automáticamente cada minuto aproximadamente.' },
        { q: '¿Debería comprar XRP ahora mismo?', a: 'No hay una respuesta única, pero la puntuación de compra (0–100) permite valorar objetivamente si el mercado está en zona de sobreventa/miedo o de recalentamiento/codicia. En la pestaña de largo plazo (contraria), puntuaciones altas marcan zonas donde coinciden miedo e infravaloración —históricamente favorables al DCA—, y las bajas avisan de recalentamiento. Es una señal de referencia, no asesoramiento de inversión.' },
        { q: '¿En qué se diferencian el timing de corto y de largo plazo?', a: 'La puntuación se divide en dos pestañas. El corto plazo (momentum) adopta una visión de seguimiento de tendencia de 1–3 meses y sube con tendencias alcistas fuertes; el largo plazo (contrario) adopta una visión de ciclo de más de un año y sube con miedo e infravaloración. En backtests desde 2017, el momentum funcionó mejor a corto y lo contrario a largo.' },
        { q: '¿Qué es el BOTTOM RADAR (puntuación de suelo)?', a: 'Un indicador auxiliar que usa métricas on-chain como el MVRV Z-Score para medir dónde está la capitalización respecto al coste medio de los inversores, mostrando la cercanía a zonas de suelo históricas en una escala de 0 a 100. El cálculo completo está publicado en la guía «suelo de Bitcoin».' }
      ],
      disclaimer: '⚠ Esta puntuación es una señal de referencia a partir de indicadores públicos, no asesoramiento de inversión. Todas las decisiones y la responsabilidad son tuyas.'
    },
    fr: {
      title: 'Indice de peur et d’avidité XRP et score de timing d’achat',
      intro: 'Un tableau de bord gratuit qui synthétise 7 indicateurs en temps réel — dont l’indice de peur et d’avidité XRP — en un score de 0 à 100 « est-ce le bon moment pour acheter ? ». Fonctionne dans le navigateur sans installation, en 13 langues.',
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
        { q: 'Dois-je acheter du XRP quand l’indice est bas ?', a: 'La peur extrême a souvent été une opportunité d’accumulation, mais se fier au seul indice risque d’« attraper un couteau qui tombe ». Ce score pondère aussi RSI, MACD, multiple de Mayer, repli et croisements de moyennes, et le réduit prudemment en tendance baissière.' },
        { q: 'Comment le score de timing d’achat est-il calculé ?', a: 'Chacun des 7 indicateurs est converti en sous-score de 0 à 100 puis pondéré. Le résultat est 0–100, affiché en 5 bandes.' },
        { q: 'Est-ce gratuit ? Faut-il installer quelque chose ?', a: 'C’est entièrement gratuit et sans installation. Les données en temps réel proviennent des API publiques de CoinGecko, Binance et Alternative.me.' },
        { q: 'Quelle différence entre l’indice et le score de timing d’achat ?', a: 'L’indice est une seule mesure de sentiment (0–100) ; le score de timing d’achat est un composite de 7 indicateurs incluant l’indice (0–100).' },
        { q: 'D’où viennent les données et à quelle fréquence sont-elles actualisées ?', a: 'L’indice de peur et d’avidité vient d’Alternative.me ; les prix et bougies journalières, des API publiques de CoinGecko et Binance ; et les métriques on-chain, de CoinMetrics. L’écran se rafraîchit automatiquement environ chaque minute.' },
        { q: 'Dois-je acheter du XRP maintenant ?', a: 'Il n’y a pas de réponse unique, mais le score de timing d’achat (0–100) permet d’évaluer objectivement si le marché est en zone de survente/peur ou de surchauffe/avidité. Dans l’onglet long terme (contrarian), des scores élevés marquent des zones où peur et sous-évaluation se recoupent — historiquement favorables au DCA — tandis que des scores bas signalent la surchauffe. C’est un signal de référence, pas un conseil en investissement.' },
        { q: 'Quelle différence entre le timing court terme et long terme ?', a: 'Le score est divisé en deux onglets. Le court terme (momentum) adopte une vue de suivi de tendance sur 1 à 3 mois et monte avec les tendances haussières fortes ; le long terme (contrarian) adopte une vue de cycle d’un an et plus et monte avec la peur et la sous-évaluation. Dans les backtests depuis 2017, le momentum a mieux fonctionné à court terme et le contrarian à long terme.' },
        { q: 'Qu’est-ce que le BOTTOM RADAR (score de plancher) ?', a: 'Une jauge auxiliaire qui utilise des métriques on-chain comme le MVRV Z-Score pour mesurer où se situe la capitalisation par rapport au coût moyen des investisseurs, en montrant la proximité des zones de plancher historiques sur une échelle de 0 à 100. Le calcul complet est publié sur la page « plancher du Bitcoin ».' }
      ],
      disclaimer: '⚠ Ce score est un signal de référence issu d’indicateurs publics, pas un conseil en investissement. Toutes les décisions et la responsabilité vous appartiennent.'
    },
    de: {
      title: 'XRP Angst- & Gier-Index & Kaufzeitpunkt-Score',
      intro: 'Ein kostenloses Dashboard, das 7 Echtzeit-Indikatoren — inkl. XRP Angst- & Gier-Index — zu einem 0–100-Score „Ist jetzt ein guter Kaufzeitpunkt?“ zusammenführt. Läuft im Browser ohne Installation, in 13 Sprachen.',
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
        { q: 'Soll ich XRP kaufen, wenn der Index niedrig ist?', a: 'Extreme Angst war historisch oft eine Akkumulationschance, doch sich allein auf den Index zu verlassen, birgt das Risiko, „ins fallende Messer zu greifen“. Dieser Score gewichtet auch RSI, MACD, Mayer-Multiple, Rückgang und MA-Kreuzungen und senkt den Wert in Abwärtstrends konservativ.' },
        { q: 'Wie wird der Kaufzeitpunkt-Score berechnet?', a: 'Jeder der 7 Indikatoren wird in einen 0–100-Teil-Score umgerechnet und gewichtet. Das Ergebnis ist 0–100, in 5 Bändern dargestellt.' },
        { q: 'Ist es kostenlos? Muss ich etwas installieren?', a: 'Es ist völlig kostenlos und ohne Installation. Echtzeitdaten stammen aus den öffentlichen APIs von CoinGecko, Binance und Alternative.me.' },
        { q: 'Wie unterscheidet sich der Index vom Kaufzeitpunkt-Score?', a: 'Der Index ist eine einzelne Stimmungskennzahl (0–100); der Kaufzeitpunkt-Score ist ein Verbund aus 7 Indikatoren inkl. Index (0–100).' },
        { q: 'Woher stammen die Daten und wie oft werden sie aktualisiert?', a: 'Der Angst- & Gier-Index stammt von Alternative.me, Preise und Tageskerzen von den öffentlichen APIs von CoinGecko und Binance, On-Chain-Metriken von CoinMetrics. Der Bildschirm aktualisiert sich etwa jede Minute automatisch.' },
        { q: 'Sollte ich XRP jetzt kaufen?', a: 'Eine eindeutige Antwort gibt es nicht, aber der Kaufzeitpunkt-Score (0–100) zeigt objektiv, ob der Markt in einer überverkauften Angst-Zone oder einer überhitzten Gier-Zone steckt. Auf dem Langfrist-Tab (antizyklisch) markieren hohe Werte Zonen, in denen Angst und Unterbewertung zusammenfallen — historisch günstig für DCA —, niedrige warnen vor Überhitzung. Ein Referenzsignal, keine Anlageberatung.' },
        { q: 'Wie unterscheiden sich kurz- und langfristiges Kauftiming?', a: 'Der Score ist in zwei Tabs geteilt. Kurzfristig (Momentum) folgt einer Trendfolge-Sicht von 1–3 Monaten und steigt mit starken Aufwärtstrends; langfristig (antizyklisch) folgt einer Zyklus-Sicht von über einem Jahr und steigt mit Angst und Unterbewertung. In Backtests seit 2017 funktionierte kurzfristig Momentum und langfristig die antizyklische Richtung besser.' },
        { q: 'Was ist der BOTTOM RADAR (Boden-Score)?', a: 'Eine Zusatzanzeige, die mit On-Chain-Metriken wie den MVRV Z-Score misst, wo die Marktkapitalisierung relativ zum durchschnittlichen Einstandskurs der Anleger liegt, und die Nähe zu historischen Bodenzonen auf einer Skala von 0–100 zeigt. Die vollständige Berechnung ist auf der Seite „Bitcoin-Boden“ veröffentlicht.' }
      ],
      disclaimer: '⚠ Dieser Score ist ein Referenzsignal aus öffentlichen Indikatoren, keine Anlageberatung. Alle Entscheidungen und die Verantwortung liegen bei Ihnen.'
    },
    it: {
      title: 'Indice di paura e avidità XRP e punteggio di timing d’acquisto',
      intro: 'Una dashboard gratuita che sintetizza 7 indicatori in tempo reale — incluso l’indice di paura e avidità di XRP — in un punteggio 0–100 «è il momento giusto per comprare?». Funziona nel browser senza installazione, in 13 lingue.',
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
        { q: 'Dovrei comprare XRP quando l’indice è basso?', a: 'La paura estrema è stata spesso un’occasione di accumulo, ma affidarsi solo all’indice rischia di «prendere un coltello che cade». Questo punteggio pesa anche RSI, MACD, multiplo di Mayer, ribasso e incroci di medie, e lo riduce in modo prudente nei trend ribassisti.' },
        { q: 'Come si calcola il punteggio d’acquisto?', a: 'Ciascuno dei 7 indicatori è convertito in un sotto-punteggio 0–100 e ponderato. Il risultato è 0–100, mostrato in 5 bande.' },
        { q: 'È gratis? Serve installare qualcosa?', a: 'È completamente gratis e senza installazione. I dati in tempo reale provengono dalle API pubbliche di CoinGecko, Binance e Alternative.me.' },
        { q: 'Che differenza c’è tra l’indice e il punteggio d’acquisto?', a: 'L’indice è una singola misura di sentiment (0–100); il punteggio d’acquisto è un composito dei 7 indicatori incluso l’indice (0–100).' },
        { q: 'Da dove vengono i dati e con che frequenza si aggiornano?', a: 'L’indice di paura e avidità viene da Alternative.me; prezzi e candele giornaliere dalle API pubbliche di CoinGecko e Binance; le metriche on-chain da CoinMetrics. Lo schermo si aggiorna automaticamente circa ogni minuto.' },
        { q: 'Dovrei comprare XRP adesso?', a: 'Non c’è una risposta unica, ma il punteggio d’acquisto (0–100) permette di valutare oggettivamente se il mercato è in zona ipervenduto/paura o surriscaldato/avidità. Nella scheda a lungo termine (contrarian), punteggi alti indicano zone in cui paura e sottovalutazione coincidono — storicamente favorevoli al PAC — mentre punteggi bassi avvertono del surriscaldamento. È un segnale di riferimento, non consulenza d’investimento.' },
        { q: 'Che differenza c’è tra timing a breve e a lungo termine?', a: 'Il punteggio è diviso in due schede. Il breve termine (momentum) adotta una visione trend-following di 1–3 mesi e sale con trend rialzisti forti; il lungo termine (contrarian) adotta una visione di ciclo oltre l’anno e sale con paura e sottovalutazione. Nei backtest dal 2017, il momentum ha funzionato meglio nel breve e il contrarian nel lungo.' },
        { q: 'Cos’è il BOTTOM RADAR (punteggio di minimo)?', a: 'Un indicatore ausiliario che usa metriche on-chain come l’MVRV Z-Score per misurare dove si trova la capitalizzazione rispetto al costo medio degli investitori, mostrando la vicinanza alle zone di minimo storiche su una scala 0–100. Il calcolo completo è pubblicato nella guida «minimo di Bitcoin».' }
      ],
      disclaimer: '⚠ Questo punteggio è un segnale di riferimento da indicatori pubblici, non consulenza d’investimento. Ogni decisione e responsabilità è tua.'
    },
    pt: {
      title: 'Índice de medo e ganância do XRP e pontuação de momento de compra',
      intro: 'Um painel gratuito que sintetiza 7 indicadores em tempo real — incluindo o índice de medo e ganância do XRP — numa pontuação de 0 a 100 «é uma boa hora para comprar?». Roda no navegador sem instalação, em 13 idiomas.',
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
        { q: 'Devo comprar XRP quando o índice está baixo?', a: 'O medo extremo foi muitas vezes uma oportunidade de acumulação, mas confiar só no índice arrisca «pegar uma faca caindo». Esta pontuação também pondera RSI, MACD, múltiplo de Mayer, queda e cruzamentos de médias, e a reduz de forma conservadora em tendências de baixa.' },
        { q: 'Como a pontuação de compra é calculada?', a: 'Cada um dos 7 indicadores é convertido numa subpontuação de 0 a 100 e ponderado. O resultado é 0–100, em 5 faixas.' },
        { q: 'É grátis? Preciso instalar algo?', a: 'É totalmente grátis e sem instalação. Os dados em tempo real vêm das APIs públicas da CoinGecko, Binance e Alternative.me.' },
        { q: 'Qual a diferença entre o índice e a pontuação de compra?', a: 'O índice é uma única métrica de sentimento (0–100); a pontuação de compra é um composto de 7 indicadores incluindo o índice (0–100).' },
        { q: 'De onde vêm os dados e com que frequência são atualizados?', a: 'O índice de medo e ganância vem da Alternative.me; preços e velas diárias, das APIs públicas da CoinGecko e da Binance; e as métricas on-chain, da CoinMetrics. A tela atualiza automaticamente a cada minuto, aproximadamente.' },
        { q: 'Devo comprar XRP agora?', a: 'Não há resposta única, mas a pontuação de compra (0–100) permite avaliar objetivamente se o mercado está em zona de sobrevenda/medo ou de superaquecimento/ganância. Na aba de longo prazo (contrária), pontuações altas marcam zonas onde medo e subvalorização coincidem — historicamente favoráveis ao DCA —, e as baixas alertam para superaquecimento. É um sinal de referência, não consultoria de investimento.' },
        { q: 'Qual a diferença entre o timing de curto e de longo prazo?', a: 'A pontuação divide-se em duas abas. O curto prazo (momentum) adota uma visão de seguimento de tendência de 1–3 meses e sobe com tendências de alta fortes; o longo prazo (contrário) adota uma visão de ciclo de mais de um ano e sobe com medo e subvalorização. Em backtests desde 2017, o momentum funcionou melhor no curto e o contrário no longo.' },
        { q: 'O que é o BOTTOM RADAR (pontuação de fundo)?', a: 'Um medidor auxiliar que usa métricas on-chain como o MVRV Z-Score para medir onde a capitalização está em relação ao custo médio dos investidores, mostrando a proximidade de zonas de fundo históricas numa escala de 0 a 100. O cálculo completo está publicado no guia «fundo do Bitcoin».' }
      ],
      disclaimer: '⚠ Esta pontuação é um sinal de referência a partir de indicadores públicos, não é consultoria de investimento. Todas as decisões e a responsabilidade são suas.'
    },
    ru: {
      title: 'Индекс страха и жадности рипла и оценка времени покупки',
      intro: 'Бесплатная панель, которая объединяет 7 индикаторов в реальном времени — включая индекс страха и жадности рипла — в оценку от 0 до 100 «подходящее ли сейчас время для покупки?». Работает в браузере без установки, на 13 языках.',
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
        { q: 'Покупать ли рипл, когда индекс низкий?', a: 'Крайний страх исторически часто был возможностью накопления, но полагаться только на индекс рискованно — можно «поймать падающий нож». Эта оценка также учитывает RSI, MACD, множитель Майера, просадку и пересечения средних и консервативно снижается в нисходящих трендах.' },
        { q: 'Как рассчитывается оценка покупки?', a: 'Каждый из 7 индикаторов переводится в частную оценку 0–100 и взвешивается. Результат — 0–100, в 5 диапазонах.' },
        { q: 'Это бесплатно? Нужно ли что-то устанавливать?', a: 'Полностью бесплатно и без установки. Данные в реальном времени берутся из публичных API CoinGecko, Binance и Alternative.me.' },
        { q: 'Чем индекс отличается от оценки покупки?', a: 'Индекс — одна метрика настроения (0–100); оценка покупки — составной показатель из 7 индикаторов, включая индекс (0–100).' },
        { q: 'Откуда берутся данные и как часто они обновляются?', a: 'Индекс страха и жадности — с Alternative.me; цены и дневные свечи — из публичных API CoinGecko и Binance; ончейн-метрики — из CoinMetrics. Экран автоматически обновляется примерно раз в минуту.' },
        { q: 'Стоит ли покупать рипл прямо сейчас?', a: 'Единственно верного ответа нет, но оценка покупки (0–100) объективно показывает, находится ли рынок в зоне перепроданности/страха или перегрева/жадности. На вкладке долгосрочного (контртрендового) взгляда высокие значения отмечают зоны, где совпадают страх и недооценка — исторически благоприятные для усреднения, — а низкие предупреждают о перегреве. Это справочный сигнал, а не инвестиционная рекомендация.' },
        { q: 'Чем отличаются краткосрочный и долгосрочный тайминг?', a: 'Оценка разделена на две вкладки. Краткосрочная (моментум) использует трендследящий взгляд на 1–3 месяца и растёт при сильных восходящих трендах; долгосрочная (контртренд) — циклический взгляд от года и растёт при страхе и недооценке. В бэктестах с 2017 года на коротком горизонте лучше работал моментум, на длинном — контртренд.' },
        { q: 'Что такое BOTTOM RADAR (оценка дна)?', a: 'Вспомогательный индикатор, который с помощью ончейн-метрик, таких как MVRV Z-оценка, измеряет положение капитализации относительно средней цены входа инвесторов и показывает близость к историческим зонам дна по шкале 0–100. Полный расчёт опубликован на странице «дно биткоина».' }
      ],
      disclaimer: '⚠ Эта оценка — справочный сигнал на основе публичных индикаторов, а не инвестиционная рекомендация. Все решения и ответственность — на вас.'
    },
    nl: {
      title: 'XRP Angst- & Hebzucht-index en koopmoment-score',
      intro: 'Een gratis dashboard dat 7 realtime indicatoren — inclusief de XRP Angst- & Hebzucht-index — samenvoegt tot een score van 0–100 voor «is het nu een goed moment om te kopen?». Draait in de browser zonder installatie, in 13 talen.',
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
        { q: 'Moet ik XRP kopen als de index laag is?', a: 'Extreme angst was vaak een accumulatiekans, maar alleen op de index vertrouwen riskeert «een vallend mes te vangen». Deze score weegt ook RSI, MACD, Mayer Multiple, daling en gemiddelde-kruisingen mee, en verlaagt de score behoudend in dalende trends.' },
        { q: 'Hoe wordt de koopmoment-score berekend?', a: 'Elk van de 7 indicatoren wordt omgezet naar een deelscore van 0–100 en gewogen. Het resultaat is 0–100, in 5 banden.' },
        { q: 'Is het gratis? Moet ik iets installeren?', a: 'Het is volledig gratis en zonder installatie. Realtime data komt van de publieke API’s van CoinGecko, Binance en Alternative.me.' },
        { q: 'Wat is het verschil tussen de index en de koopmoment-score?', a: 'De index is één sentimentmaatstaf (0–100); de koopmoment-score is een samenstelling van 7 indicatoren inclusief de index (0–100).' },
        { q: 'Waar komen de gegevens vandaan en hoe vaak worden ze ververst?', a: 'De Angst- & Hebzucht-index komt van Alternative.me; prijzen en dagcandles van de publieke API’s van CoinGecko en Binance; on-chain-metrieken van CoinMetrics. Het scherm ververst ongeveer elke minuut automatisch.' },
        { q: 'Moet ik nu XRP kopen?', a: 'Er is geen eenduidig antwoord, maar de koopmoment-score (0–100) geeft een objectief beeld of de markt in een oversold/angst-zone of een oververhitte/hebzucht-zone zit. Op het langetermijn-tabblad (tegendraads) markeren hoge scores zones waar angst en onderwaardering samenvallen — historisch gunstig voor DCA — terwijl lage scores waarschuwen voor oververhitting. Het is een referentiesignaal, geen beleggingsadvies.' },
        { q: 'Hoe verschillen korte- en langetermijn-kooptiming?', a: 'De score is verdeeld over twee tabbladen. Korte termijn (momentum) hanteert een trendvolgende blik van 1–3 maanden en stijgt bij sterke opwaartse trends; lange termijn (tegendraads) hanteert een cyclusblik van ruim een jaar en stijgt bij angst en onderwaardering. In backtests sinds 2017 werkte momentum beter op korte termijn en tegendraads beter op lange termijn.' },
        { q: 'Wat is de BOTTOM RADAR (bodemscore)?', a: 'Een hulpmeter die met on-chain-metrieken zoals de MVRV Z-score meet waar de marktkapitalisatie staat ten opzichte van de gemiddelde kostprijs van beleggers, en de nabijheid van historische bodemzones toont op een schaal van 0–100. De volledige berekening staat op de pagina «Bitcoin-bodem».' }
      ],
      disclaimer: '⚠ Deze score is een referentiesignaal uit publieke indicatoren, geen beleggingsadvies. Alle beslissingen en verantwoordelijkheid zijn van uzelf.'
    },
    th: {
      title: 'ดัชนีความกลัวและความโลภริปเปิล และคะแนนจังหวะซื้อ',
      intro: 'แดชบอร์ดฟรีที่รวม 7 ตัวชี้วัดแบบเรียลไทม์ — รวมถึงดัชนีความกลัวและความโลภของริปเปิล — เป็นคะแนน 0–100 ว่า “ตอนนี้เป็นจังหวะซื้อหรือไม่?” ใช้งานในเบราว์เซอร์ได้ทันที ไม่ต้องติดตั้ง รองรับ 13 ภาษา',
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
        { q: 'ถ้าดัชนีต่ำควรซื้อริปเปิลไหม?', a: 'ความกลัวสุดขีดในอดีตมักเป็นโอกาสทยอยซื้อ แต่ดูเพียงดัชนีอย่างเดียวเสี่ยง “รับมีดที่กำลังตก” คะแนนนี้ยังพิจารณา RSI, MACD, Mayer Multiple, การย่อ และการตัดกันของเส้นเฉลี่ย และลดคะแนนอย่างระมัดระวังในแนวโน้มขาลง' },
        { q: 'คะแนนจังหวะซื้อคำนวณอย่างไร?', a: 'แปลงแต่ละตัวชี้วัดทั้ง 7 เป็นคะแนนย่อย 0–100 แล้วถ่วงน้ำหนักรวมกัน ผลลัพธ์คือ 0–100 แสดงเป็น 5 ระดับ' },
        { q: 'ฟรีไหม? ต้องติดตั้งไหม?', a: 'ฟรีทั้งหมดและไม่ต้องติดตั้ง ข้อมูลเรียลไทม์มาจาก API สาธารณะของ CoinGecko, Binance และ Alternative.me' },
        { q: 'ดัชนีกับคะแนนจังหวะซื้อต่างกันอย่างไร?', a: 'ดัชนีเป็นตัวชี้วัดอารมณ์เดียว (0–100); คะแนนจังหวะซื้อเป็นคะแนนรวมจาก 7 ตัวชี้วัดรวมถึงดัชนี (0–100)' },
        { q: 'ข้อมูลมาจากไหน อัปเดตบ่อยแค่ไหน?', a: 'ดัชนีความกลัว-ความโลภมาจาก Alternative.me ราคาและแท่งเทียนรายวันมาจาก API สาธารณะของ CoinGecko และ Binance ส่วนตัวชี้วัดออนเชนมาจาก CoinMetrics หน้าจออัปเดตอัตโนมัติราวทุก 1 นาที' },
        { q: 'ตอนนี้ควรซื้อริปเปิลไหม?', a: 'ไม่มีคำตอบตายตัว แต่คะแนนจังหวะซื้อ (0–100) ช่วยประเมินอย่างเป็นกลางว่าตลาดอยู่ในโซนขายมากเกิน/ความกลัว หรือโซนร้อนแรง/ความโลภ ในแท็บระยะยาว (สวนตลาด) คะแนนยิ่งสูงหมายถึงโซนที่ความกลัวและราคาต่ำกว่ามูลค่าทับซ้อนกัน ซึ่งในอดีตเอื้อต่อ DCA ส่วนคะแนนต่ำเตือนถึงความร้อนแรง เป็นเพียงสัญญาณอ้างอิง ไม่ใช่คำแนะนำการลงทุน' },
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
  /* 푸터 설명 문단(.foot-desc) — 리플 언급이 있어 공통 foot-i18n.js 가 아니라 여기에 둔다 */
  var FOOT_DESC = {
    ko: 'broodev는 설치 없이 브라우저에서 바로 쓰는 무료 웹앱을 만드는 앱 포트폴리오입니다. 이 페이지의 리플 공포·탐욕 지수와 매수 타이밍 점수는 공개 지표를 합성한 참고 정보이며 투자 자문이 아닙니다. 광고는 Google AdSense를 통해 게재될 수 있습니다.',
    en: 'broodev is a portfolio of free web apps that run right in your browser with no install. The XRP Fear & Greed Index and buy-timing score on this page are reference information synthesized from public indicators, not investment advice. Ads may be served through Google AdSense.',
    ja: 'broodevは、インストール不要でブラウザからすぐ使える無料Webアプリを作るアプリポートフォリオです。このページのリップル恐怖・強欲指数と買い時スコアは公開指標を合成した参考情報であり、投資助言ではありません。広告はGoogle AdSenseを通じて掲載される場合があります。',
    zh: 'broodev 是一个应用作品集，制作无需安装、在浏览器中即可直接使用的免费网页应用。本页的瑞波恐惧与贪婪指数和买入时机评分是综合公开指标得出的参考信息，不构成投资建议。广告可能通过 Google AdSense 投放。',
    'zh-Hant': 'broodev 是一個應用作品集，製作無需安裝、在瀏覽器中即可直接使用的免費網頁應用。本頁的瑞波恐懼與貪婪指數和買入時機評分是綜合公開指標得出的參考資訊，不構成投資建議。廣告可能透過 Google AdSense 刊登。',
    th: 'broodev คือพอร์ตโฟลิโอแอปที่สร้างเว็บแอปฟรีซึ่งใช้งานได้ทันทีในเบราว์เซอร์โดยไม่ต้องติดตั้ง ดัชนีความกลัว-ความโลภริปเปิลและคะแนนจังหวะซื้อในหน้านี้เป็นข้อมูลอ้างอิงที่สังเคราะห์จากตัวชี้วัดสาธารณะ ไม่ใช่คำแนะนำการลงทุน โฆษณาอาจแสดงผ่าน Google AdSense',
    es: 'broodev es un portafolio de aplicaciones web gratuitas que funcionan directamente en el navegador, sin instalación. El Índice de Miedo y Codicia de XRP y la puntuación de momento de compra de esta página son información de referencia elaborada a partir de indicadores públicos, no asesoramiento de inversión. Los anuncios pueden mostrarse a través de Google AdSense.',
    fr: 'broodev est un portfolio d’applications web gratuites qui s’utilisent directement dans le navigateur, sans installation. L’indice Peur & Avidité du XRP et le score de timing d’achat de cette page sont des informations de référence issues d’indicateurs publics, et non un conseil en investissement. Des annonces peuvent être diffusées via Google AdSense.',
    de: 'broodev ist ein Portfolio kostenloser Web-Apps, die ohne Installation direkt im Browser laufen. Der XRP-Angst-und-Gier-Index und der Kauf-Timing-Score auf dieser Seite sind aus öffentlichen Indikatoren zusammengesetzte Referenzinformationen und keine Anlageberatung. Werbung kann über Google AdSense ausgeliefert werden.',
    it: 'broodev è un portfolio di web app gratuite che funzionano direttamente nel browser, senza installazione. L’Indice di Paura e Avidità di XRP e il punteggio di timing d’acquisto in questa pagina sono informazioni di riferimento ricavate da indicatori pubblici, non una consulenza di investimento. Gli annunci possono essere pubblicati tramite Google AdSense.',
    pt: 'O broodev é um portefólio de aplicações web gratuitas que funcionam diretamente no navegador, sem instalação. O Índice de Medo e Ganância do XRP e a pontuação de momento de compra desta página são informação de referência sintetizada a partir de indicadores públicos, não aconselhamento de investimento. Os anúncios podem ser apresentados através do Google AdSense.',
    ru: 'broodev — это портфолио бесплатных веб-приложений, которые работают прямо в браузере без установки. Индекс страха и жадности рипла и оценка момента покупки на этой странице — справочная информация, собранная из открытых индикаторов, а не инвестиционная рекомендация. Реклама может показываться через Google AdSense.',
    nl: 'broodev is een portfolio van gratis webapps die zonder installatie direct in je browser werken. De XRP Angst- en Hebzuchtindex en de koop-timingscore op deze pagina zijn referentie-informatie samengesteld uit openbare indicatoren, geen beleggingsadvies. Advertenties kunnen via Google AdSense worden getoond.'
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
    "title": "XRP buy-timing score: where seven indicators put the price now",
    "intro": "The XRP page computes RSI(14), MACD(12·26·9), the Mayer Multiple, drawdown from the 365-day high and the 50/200 cross from the dollar price of XRP, then adds the market-wide Fear & Greed Index and CoinMetrics’ MVRV Z-Score to produce a 0–100 score. The result is shown as STRONG BUY, ACCUMULATE, NEUTRAL, CAUTION or OVERHEATED, and the overall score is free to view.",
    "coinH": "What is XRP?",
    "coinP": [
     "XRP is the native asset of the XRP Ledger (XRPL). The ledger was built by David Schwartz, Jed McCaleb and Arthur Britto and went live in 2012; the company founded that same year is today’s Ripple. XRP is often called “Ripple” after the company, but strictly speaking Ripple is the company and XRP is the asset.",
     "Instead of mining or staking, the XRP Ledger reaches consensus among validators that rely on trusted lists (UNLs), and a new ledger closes every few seconds. All 100 billion XRP were created at launch and no new XRP is issued; the XRP spent on transaction fees is destroyed. In 2017 Ripple placed 55 billion of its XRP in escrow, releasing at most 1 billion per month. Ripple has promoted XRP as a bridge asset for cross-border payments and settlement."
    ],
    "applyH": "Applying the indicators to XRP",
    "apply": [
     "News-driven jumps: XRP has moved by tens of percent in a single day on court rulings or on exchange listing and suspension news. On days like that RSI and MACD spike to extremes, so check them against the 50/200 trend rather than trusting a one- or two-day signal.",
     "Long ranges and drawdown: the 365-day drawdown is measured only against the past year’s high, so during a long sideways stretch it can look small even while the price sits far below its all-time high. Conversely, after a sharp spike a −50% reading arrives quickly — be careful about treating it straight away as a “strong buy” zone.",
     "Fear & Greed Index: there is no XRP-specific sentiment index. The value shown is Alternative.me’s market-wide index, which is weighted toward Bitcoin, so good or bad news that affects only XRP is not reflected in it.",
     "Mayer Multiple: the 0.8 and 2.4 thresholds relative to the 200-day average are rules of thumb from Bitcoin. For an asset like XRP that can surge within a short period, the 200-day average lags well behind, so the Mayer value can briefly shoot up right after a rally.",
     "MVRV Z-Score: CoinMetrics community data includes XRP’s MVRV, so it can be calculated. But all XRP was issued up front without mining and a large share sits in Ripple’s holdings and escrow, which makes it hard to read MVRV as an “average cost basis” the way you would for Bitcoin."
    ],
    "histH": "XRP price cycles at a glance",
    "hist": [
     "2012–2013: The XRP Ledger went live and 100 billion XRP were created; in 2013 the company changed its name from OpenCoin to Ripple Labs.",
     "2017–2018: XRP surged during the crypto bull market, hitting a then-record of about $3.40 in early January 2018, and spent most of that year falling.",
     "2020–2021: In December 2020 the US SEC sued Ripple and two of its executives over alleged unregistered securities sales, after which major US exchanges suspended XRP trading.",
     "2023: In July a US court ruled that XRP sold by Ripple on exchanges, where buyers did not know who the seller was, did not constitute investment contracts. The price jumped sharply that day, and some exchanges that had suspended XRP relisted it.",
     "2024–2025: XRP surged in November–December 2024, topping $2 for the first time since early 2018, and in 2025 the SEC dropped its appeal."
    ],
    "faq": [
     {
      "q": "Doesn’t XRP have its own Fear & Greed Index?",
      "a": "There isn’t. Alternative.me’s index covers the entire crypto market and leans heavily on Bitcoin data. To make that clear, the XRP page adds a “market-wide” tag next to the index name."
     },
     {
      "q": "Is MVRV shown for XRP too?",
      "a": "Yes. The CoinMetrics community API provides XRP’s MVRV, from which the Z-Score is calculated. Because of the pre-issued supply and escrow structure, though, it is better used to support the other indicators than read against Bitcoin’s reference lines. When no data is available it shows N/A and the score is recalculated from the remaining indicators."
     },
     {
      "q": "Is now a good time to buy XRP?",
      "a": "This page does not make investment decisions for you. A high score on the long-term (contrarian) tab means oversold, fear and undervaluation signals have lined up, while the short-term (momentum) tab rises with the strength of an uptrend. Lawsuit or regulatory news can flip XRP’s indicators within a day, so treat the score only as a snapshot of current conditions."
     },
     {
      "q": "Are escrow releases or court outcomes factored into the score?",
      "a": "No. The score is calculated only from five price-based indicators, the Fear & Greed Index and MVRV. The impact of news shows up in indicators such as RSI and MACD only after the price has moved."
     },
     {
      "q": "Are Ripple and XRP the same thing?",
      "a": "Strictly speaking, no. Ripple is a US company, while XRP is the native asset of the XRP Ledger. What this page analyzes is the price of XRP as traded on exchanges."
     }
    ]
   },
   "ja": {
    "title": "リップル（XRP）の買い時スコア：7指標で見る現在地",
    "intro": "XRPの画面では、ドル建てのXRP価格からRSI(14)・MACD(12・26・9)・マイヤー倍率・365日高値からの下落率・50/200クロスを計算し、市場全体の恐怖・強欲指数とCoinMetricsのMVRV Zスコアを加えて0〜100のスコアを出します。結果はSTRONG BUY・ACCUMULATE・NEUTRAL・CAUTION・OVERHEATEDのいずれかで表示され、総合スコアは無料で見られます。",
    "coinH": "リップル（XRP）とは？",
    "coinP": [
     "XRPはXRPレジャー（XRPL）の基軸資産です。XRPレジャーはデビッド・シュワルツ、ジェド・マケーレブ、アーサー・ブリットが開発して2012年に稼働し、同じ年に設立された会社が現在のRipple社です。XRPは社名にちなんで「リップル」と呼ばれることが多いものの、厳密にはRippleは会社の名前、XRPは資産の名前です。",
     "XRPレジャーはマイニングやステーキングではなく、信頼リスト（UNL）をもとにバリデーターが合意する仕組みで、数秒ごとに台帳が確定します。XRPは最初に1,000億枚がまとめて発行され、新たに増えることはなく、取引手数料として使われたXRPは消滅します。2017年、Ripple社は保有分のうち550億XRPをエスクローに預け、毎月最大10億枚ずつ解放される形にしました。Ripple社はXRPを国際送金・決済のブリッジ資産として打ち出してきました。"
    ],
    "applyH": "リップルに指標を当てはめるときの注意",
    "apply": [
     "ニュースによる急変：XRPは訴訟の判決や取引所の上場・取引停止のニュースで、1日に数十％動いたことがあります。こうした日はRSIやMACDが一時的に極端な値をつけるため、1〜2日のシグナルより50/200のトレンドと合わせて確認するほうが安全です。",
     "長いレンジと下落率：365日下落率は直近1年の高値だけを基準にするため、長い横ばいの間は下落率が小さく見えても、過去最高値からは大きく離れていることがあります。逆に急騰直後の下げでは−50%にすぐ達するので、それをそのまま「強い買い」圏と読むのは慎重にすべきです。",
     "恐怖・強欲指数：XRP専用のセンチメント指数はありません。表示される値はビットコインの比重が大きいAlternative.meの市場全体の指数なので、XRPだけに関わる好材料・悪材料は反映されません。",
     "マイヤー倍率：200日平均に対する0.8・2.4の基準はビットコインから生まれた経験則です。XRPのように短期間で急騰しうる資産では200日平均がかなり遅れて追いつくため、急騰直後にマイヤー倍率が一時的に大きく跳ね上がることがあります。",
     "MVRV Zスコア：CoinMetricsのコミュニティデータにXRPのMVRVがあるため計算自体はできます。しかしXRPはマイニングなしで全量が事前に発行され、その多くがRipple社の保有分やエスクローにあるため、「平均取得単価」という解釈をビットコインと同じように当てはめるのは難しいです。"
    ],
    "histH": "リップルの価格サイクルの概要",
    "hist": [
     "2012〜2013年：XRPレジャーが稼働して1,000億XRPが発行され、2013年に社名がOpenCoinからRipple Labsに変わりました。",
     "2017〜2018年：暗号資産の上昇相場で急騰し、2018年1月初めに約3.4ドルと当時の最高値をつけた後、その年の大半は下落基調でした。",
     "2020〜2021年：2020年12月、米証券取引委員会（SEC）がRipple社と経営陣2人を未登録の証券販売の疑いで提訴し、その後米国の主要取引所がXRPの取引を停止しました。",
     "2023年：7月、米国の裁判所が、Ripple社が取引所で買い手に売り手が分からない形で販売したXRPは投資契約に当たらないと判断し、価格はその日のうちに大きく上昇しました。取引を停止していた一部の取引所もXRPを再上場しました。",
     "2024〜2025年：2024年11〜12月に急騰して2018年初め以来初めて2ドルを超え、2025年にはSECが控訴を取り下げました。"
    ],
    "faq": [
     {
      "q": "リップル専用の恐怖・強欲指数はないのですか？",
      "a": "ありません。Alternative.meの指数は暗号資産市場全体を対象としており、ビットコインのデータの比重が大きい指数です。XRPの画面ではそのことを示すため、指数名の横に「市場全体」と付けています。"
     },
     {
      "q": "リップルの画面にもMVRVは出ますか？",
      "a": "はい。CoinMetricsのコミュニティAPIがXRPのMVRVを提供しており、そこからZスコアを計算します。ただし全量事前発行・エスクローという構造のため、ビットコインと同じ基準線で読むより、ほかの指標を補う目的で見るのがよいでしょう。データがないときはN/Aになり、残りの指標でスコアを計算し直します。"
     },
     {
      "q": "今リップルを買っても大丈夫ですか？",
      "a": "この画面は投資判断を代わりに行うものではありません。長期（逆張り）タブのスコアが高ければ売られすぎ・恐怖・割安のシグナルがそろったことを示し、短期（モメンタム）タブは上昇トレンドが強いほど高くなります。XRPは訴訟や規制のニュースで指標が1日で反転することもあるため、スコアは現状を要約した値としてだけ使ってください。"
     },
     {
      "q": "エスクローの解放量や訴訟の結果もスコアに反映されますか？",
      "a": "反映されません。スコアは価格ベースの5指標と恐怖・強欲指数、MVRVだけで計算します。ニュースの影響は、価格が動いた後になってRSIやMACDなどの指標に表れます。"
     },
     {
      "q": "リップルとXRPは同じものですか？",
      "a": "厳密には違います。Rippleは米国の企業で、XRPはXRPレジャーの基軸資産です。この画面が分析しているのは、取引所で売買されているXRPの価格です。"
     }
    ]
   },
   "ko": {
    "title": "리플(XRP) 매수 타이밍 점수 — 7개 지표로 보는 현재 위치",
    "intro": "XRP 화면은 달러 기준 XRP 가격으로 RSI(14)·MACD(12·26·9)·Mayer Multiple·365일 고점 대비 낙폭·50/200 크로스를 계산하고, 여기에 시장 전체 공포·탐욕 지수와 CoinMetrics의 MVRV Z-Score를 더해 0~100 점수를 냅니다. 결과는 STRONG BUY·ACCUMULATE·NEUTRAL·CAUTION·OVERHEATED 중 하나로 표시되며, 종합 점수는 무료로 볼 수 있습니다.",
    "coinH": "리플(XRP)이란?",
    "coinP": [
     "XRP는 XRP 레저(XRPL)의 기본 자산입니다. XRP 레저는 데이비드 슈워츠, 제드 맥케일럽, 아서 브리토가 개발해 2012년에 가동됐고, 같은 해 세워진 회사가 지금의 Ripple입니다. 한국에서는 회사 이름을 따 XRP를 흔히 '리플'이라고 부르지만, 엄밀히 Ripple은 회사 이름이고 XRP는 자산 이름입니다.",
     "XRP 레저는 채굴이나 스테이킹 대신 검증자들이 신뢰 목록(UNL)을 바탕으로 합의하는 방식을 쓰며, 몇 초마다 원장이 확정됩니다. XRP는 처음에 1,000억 개가 한꺼번에 발행돼 새로 늘어나지 않고, 거래 수수료로 쓰인 XRP는 소각됩니다. 2017년 Ripple은 보유 물량 중 550억 XRP를 에스크로에 넣어 매달 최대 10억 개씩 풀리도록 했습니다. Ripple은 XRP를 국제 송금·결제의 중개 자산으로 내세워 왔습니다."
    ],
    "applyH": "리플에 지표를 적용할 때",
    "apply": [
     "뉴스에 따른 급변: XRP는 소송 판결이나 거래소 상장·거래 중단 소식에 하루 만에 수십 % 움직인 적이 있습니다. 이런 날에는 RSI와 MACD가 순간적으로 극단값을 찍기 때문에, 하루 이틀의 신호보다 50/200 추세와 함께 확인하는 편이 안전합니다.",
     "긴 횡보와 낙폭: 365일 고점 대비 낙폭은 최근 1년 고점만 기준으로 삼기 때문에, 오랜 횡보 중에는 낙폭이 작아 보여도 역대 최고가와는 거리가 멀 수 있습니다. 반대로 급등 직후의 하락에서는 -50%가 금방 찍히므로, 이를 곧바로 '강한 매수' 구간으로 읽는 것은 조심해야 합니다.",
     "공포·탐욕 지수: XRP 전용 심리 지수는 없습니다. 표시되는 값은 비트코인 비중이 큰 Alternative.me의 시장 전체 지수라서, XRP에만 해당하는 호재나 악재는 반영되지 않습니다.",
     "Mayer Multiple: 200일선 대비 0.8·2.4 기준은 비트코인에서 나온 경험칙입니다. XRP처럼 짧은 기간에 급등할 수 있는 자산은 200일선이 한참 늦게 따라오므로, 급등 직후 Mayer 값이 일시적으로 크게 튈 수 있습니다.",
     "MVRV Z-Score: CoinMetrics 커뮤니티 데이터에 XRP의 MVRV가 있어 계산은 됩니다. 하지만 XRP는 채굴 없이 전량이 미리 발행됐고 상당량이 Ripple 보유분과 에스크로에 있어, '평균 매수원가'라는 해석을 비트코인처럼 그대로 적용하기 어렵습니다."
    ],
    "histH": "리플 가격 사이클 요약",
    "hist": [
     "2012~2013년: XRP 레저가 가동되며 1,000억 XRP가 발행됐고, 2013년 회사 이름이 OpenCoin에서 Ripple Labs로 바뀌었습니다.",
     "2017~2018년: 암호화폐 강세장에서 급등해 2018년 1월 초 약 3.4달러로 당시 최고가를 기록한 뒤, 그해 대부분 하락세를 보였습니다.",
     "2020~2021년: 2020년 12월 미국 SEC가 Ripple과 경영진 두 명을 미등록 증권 판매 혐의로 제소했고, 이후 미국 주요 거래소들이 XRP 거래를 중단했습니다.",
     "2023년: 7월 미국 법원이 Ripple이 거래소에서 매수자가 상대를 알 수 없는 방식으로 판매한 XRP는 투자계약에 해당하지 않는다고 판단하자 가격이 하루 만에 크게 올랐고, 거래를 중단했던 일부 거래소가 XRP를 다시 상장했습니다.",
     "2024~2025년: 2024년 11~12월 급등해 2018년 초 이후 처음으로 2달러를 넘었고, 2025년에는 SEC가 항소를 철회했습니다."
    ],
    "faq": [
     {
      "q": "리플 공포·탐욕 지수는 따로 없나요?",
      "a": "따로 없습니다. Alternative.me 지수는 암호화폐 시장 전체를 대상으로 하며 비트코인 데이터 비중이 큽니다. XRP 화면에서는 이 점을 알리려고 지수 이름 옆에 '시장 전체'라는 표시를 붙입니다."
     },
     {
      "q": "리플에도 MVRV가 표시되나요?",
      "a": "네. CoinMetrics 커뮤니티 API가 XRP의 MVRV를 제공해 Z-Score를 계산합니다. 다만 전량 선발행·에스크로 구조 때문에 비트코인과 같은 기준선으로 읽기보다 다른 지표를 보조하는 용도로 보는 편이 좋습니다. 데이터가 없을 때는 N/A가 되고 나머지 지표로 점수를 다시 계산합니다."
     },
     {
      "q": "지금 리플을 사도 될까요?",
      "a": "이 화면은 투자 판단을 대신하지 않습니다. 장기(역발상) 탭 점수가 높으면 과매도·공포·저평가 신호가 겹쳤다는 뜻이고, 단기(모멘텀) 탭은 상승 추세가 강할수록 높아집니다. XRP는 소송·규제 뉴스로 지표가 하루 만에 뒤집힐 수 있으니 점수는 현재 상태를 요약한 값으로만 쓰세요."
     },
     {
      "q": "에스크로 해제 물량이나 소송 결과도 점수에 반영되나요?",
      "a": "반영되지 않습니다. 점수는 가격 기반 지표 5개와 공포·탐욕 지수, MVRV만으로 계산합니다. 뉴스의 영향은 가격이 움직인 뒤에야 RSI·MACD 같은 지표에 나타납니다."
     },
     {
      "q": "리플과 XRP는 같은 것인가요?",
      "a": "엄밀히는 다릅니다. Ripple은 미국 기업이고 XRP는 XRP 레저의 기본 자산입니다. 이 화면이 분석하는 대상은 거래소에서 거래되는 XRP의 가격입니다."
     }
    ]
   },
   "zh": {
    "title": "瑞波（XRP）买入时机评分：用7项指标看当前位置",
    "intro": "XRP页面以美元计价的XRP价格计算RSI(14)、MACD(12·26·9)、梅耶倍数、距365日高点回撤和50/200交叉，再加上全市场恐惧与贪婪指数及CoinMetrics的MVRV Z分数，得出0–100的评分。结果以STRONG BUY、ACCUMULATE、NEUTRAL、CAUTION、OVERHEATED之一显示，综合评分可免费查看。",
    "coinH": "什么是瑞波（XRP）？",
    "coinP": [
     "XRP是XRP账本（XRPL）的原生资产。XRP账本由大卫·施瓦茨、杰德·麦卡勒布和亚瑟·布里托开发，于2012年上线；同年成立的公司就是现在的Ripple。XRP常因公司名而被称为“瑞波”或“瑞波币”，但严格来说，Ripple是公司名称，XRP才是资产名称。",
     "XRP账本不靠挖矿或质押，而是由验证者依据各自的信任名单（UNL）达成共识，每隔几秒确认一次账本。XRP在创建之初就一次性发行了1000亿枚，此后不再增发；用作交易手续费的XRP会被销毁。2017年，Ripple将所持XRP中的550亿枚存入托管账户，每月最多释放10亿枚。Ripple一直将XRP定位为跨境汇款与结算的桥梁资产。"
    ],
    "applyH": "将指标用于瑞波时的注意事项",
    "apply": [
     "新闻引发的剧烈波动：XRP曾因诉讼判决或交易所上架、暂停交易的消息在一天内涨跌数十个百分点。这种日子里RSI和MACD会瞬间出现极端值，与其相信一两天的信号，不如结合50/200趋势确认。",
     "长期横盘与回撤：365日回撤只以最近一年的高点为基准，长期横盘时回撤看起来可能不大，价格却可能离历史最高价很远。反过来，急涨之后的下跌很快就会出现−50%，不宜直接把它当作“强烈买入”区间。",
     "恐惧与贪婪指数：不存在XRP专属的情绪指数。显示的是比特币占比很大的Alternative.me全市场指数，只与XRP有关的利好或利空不会反映在其中。",
     "梅耶倍数：相对200日均线的0.8、2.4阈值来自比特币的经验法则。像XRP这样可能在短时间内暴涨的资产，200日均线会明显滞后，暴涨刚结束时梅耶倍数可能短暂大幅跳升。",
     "MVRV Z分数：CoinMetrics社区数据中有XRP的MVRV，因此可以计算。但XRP未经挖矿就全部预先发行，且相当一部分在Ripple持有的份额和托管账户中，很难像比特币那样把MVRV解读为“平均持仓成本”。"
    ],
    "histH": "瑞波价格周期概览",
    "hist": [
     "2012–2013年：XRP账本上线，1000亿枚XRP被创建；2013年公司由OpenCoin更名为Ripple Labs。",
     "2017–2018年：XRP在加密牛市中暴涨，2018年1月初创下约3.4美元的当时最高价，此后当年大部分时间都在下跌。",
     "2020–2021年：2020年12月，美国证券交易委员会（SEC）以涉嫌未注册证券销售为由起诉Ripple及其两名高管，随后美国主要交易所暂停了XRP交易。",
     "2023年：7月，美国法院裁定Ripple在交易所以买方无从得知卖方身份的方式出售的XRP不构成投资合同，价格当天大幅上涨，部分此前暂停交易的交易所也重新上架了XRP。",
     "2024–2025年：2024年11至12月大幅上涨，自2018年初以来首次突破2美元；2025年SEC撤回了上诉。"
    ],
    "faq": [
     {
      "q": "没有单独的瑞波恐惧与贪婪指数吗？",
      "a": "没有。Alternative.me的指数覆盖整个加密市场，比特币数据所占比重很大。为说明这一点，XRP页面在指数名称旁加注了“全市场”。"
     },
     {
      "q": "瑞波页面也显示MVRV吗？",
      "a": "显示。CoinMetrics社区API提供XRP的MVRV，本页面据此计算Z分数。但由于全部预先发行和托管账户的结构，与其按比特币的参考线解读，不如把它当作其他指标的辅助。没有数据时显示N/A，并用其余指标重新计算评分。"
     },
     {
      "q": "现在买瑞波合适吗？",
      "a": "本页面不会替您做投资决定。长期（逆向）标签分数高，表示超卖、恐惧与低估信号已经叠加；短期（动量）标签则是上升趋势越强分数越高。XRP的指标可能因诉讼或监管消息在一天内反转，请仅把评分当作当前状况的概括。"
     },
     {
      "q": "托管释放量或诉讼结果会计入评分吗？",
      "a": "不会。评分只根据5项价格类指标、恐惧与贪婪指数和MVRV计算。新闻的影响要等价格变动之后，才会体现在RSI、MACD等指标上。"
     },
     {
      "q": "Ripple和XRP是同一个东西吗？",
      "a": "严格来说不是。Ripple是一家美国公司，XRP则是XRP账本的原生资产。本页面分析的是在交易所交易的XRP价格。"
     }
    ]
   },
   "zh-Hant": {
    "title": "瑞波（XRP）買入時機評分：用7項指標看目前位置",
    "intro": "XRP頁面以美元計價的XRP價格計算RSI(14)、MACD(12·26·9)、梅耶倍數、距365日高點回撤與50/200交叉，再加上全市場恐懼與貪婪指數及CoinMetrics的MVRV Z分數，得出0–100的評分。結果以STRONG BUY、ACCUMULATE、NEUTRAL、CAUTION、OVERHEATED其中之一顯示，綜合評分可免費查看。",
    "coinH": "什麼是瑞波（XRP）？",
    "coinP": [
     "XRP是XRP帳本（XRPL）的原生資產。XRP帳本由大衛·施瓦茨、傑德·麥卡勒布與亞瑟·布里托開發，於2012年上線；同年成立的公司就是現在的Ripple。XRP常因公司名稱而被稱為「瑞波」或「瑞波幣」，但嚴格來說，Ripple是公司名稱，XRP才是資產名稱。",
     "XRP帳本不靠挖礦或質押，而是由驗證者依據各自的信任名單（UNL）達成共識，每隔幾秒確認一次帳本。XRP在建立之初就一次發行了1000億枚，之後不再增發；用來支付交易手續費的XRP會被銷毀。2017年，Ripple將持有的XRP中的550億枚存入託管帳戶，每月最多釋出10億枚。Ripple一直將XRP定位為跨境匯款與結算的橋接資產。"
    ],
    "applyH": "將指標用於瑞波時的注意事項",
    "apply": [
     "新聞引發的劇烈波動：XRP曾因訴訟判決或交易所上架、暫停交易的消息，在一天內漲跌數十個百分點。這種日子裡RSI與MACD會瞬間出現極端值，與其相信一兩天的訊號，不如搭配50/200趨勢確認。",
     "長期盤整與回撤：365日回撤只以最近一年的高點為基準，長期盤整時回撤看起來可能不大，價格卻可能離歷史最高價很遠。反過來說，急漲之後的下跌很快就會出現−50%，不宜直接把它當成「強烈買入」區間。",
     "恐懼與貪婪指數：並沒有XRP專屬的情緒指數。顯示的是比特幣佔比很大的Alternative.me全市場指數，只與XRP有關的利多或利空不會反映在其中。",
     "梅耶倍數：相對200日均線的0.8、2.4門檻來自比特幣的經驗法則。像XRP這樣可能在短時間內暴漲的資產，200日均線會明顯落後，暴漲剛結束時梅耶倍數可能短暫大幅跳升。",
     "MVRV Z分數：CoinMetrics社群資料中有XRP的MVRV，因此可以計算。但XRP未經挖礦就全部預先發行，且相當一部分在Ripple持有的部位與託管帳戶中，很難像比特幣那樣把MVRV解讀為「平均持倉成本」。"
    ],
    "histH": "瑞波價格週期概覽",
    "hist": [
     "2012–2013年：XRP帳本上線，1000億枚XRP被建立；2013年公司由OpenCoin更名為Ripple Labs。",
     "2017–2018年：XRP在加密多頭市場中暴漲，2018年1月初創下約3.4美元的當時最高價，之後當年大部分時間都在下跌。",
     "2020–2021年：2020年12月，美國證券交易委員會（SEC）以涉嫌未註冊證券銷售為由起訴Ripple及其兩名高階主管，隨後美國主要交易所暫停了XRP交易。",
     "2023年：7月，美國法院裁定Ripple在交易所以買方無從得知賣方身分的方式出售的XRP不構成投資契約，價格當天大幅上漲，部分先前暫停交易的交易所也重新上架XRP。",
     "2024–2025年：2024年11至12月大幅上漲，自2018年初以來首次突破2美元；2025年SEC撤回了上訴。"
    ],
    "faq": [
     {
      "q": "沒有單獨的瑞波恐懼與貪婪指數嗎？",
      "a": "沒有。Alternative.me的指數涵蓋整個加密市場，比特幣資料所佔比重很大。為了說明這一點，XRP頁面在指數名稱旁加註了「全市場」。"
     },
     {
      "q": "瑞波頁面也會顯示MVRV嗎？",
      "a": "會。CoinMetrics社群API提供XRP的MVRV，本頁面據此計算Z分數。但由於全部預先發行與託管帳戶的結構，與其依比特幣的參考線解讀，不如把它當作其他指標的輔助。沒有資料時會顯示N/A，並以其餘指標重新計算評分。"
     },
     {
      "q": "現在買瑞波適合嗎？",
      "a": "本頁面不會替您做投資決定。長期（逆向）分頁分數高，代表超賣、恐懼與低估訊號已經疊加；短期（動能）分頁則是上升趨勢越強分數越高。XRP的指標可能因訴訟或監管消息在一天內反轉，請只把評分當作目前狀況的概括。"
     },
     {
      "q": "託管釋出量或訴訟結果會計入評分嗎？",
      "a": "不會。評分只根據5項價格類指標、恐懼與貪婪指數和MVRV計算。新聞的影響要等價格變動之後，才會反映在RSI、MACD等指標上。"
     },
     {
      "q": "Ripple和XRP是同一個東西嗎？",
      "a": "嚴格來說不是。Ripple是一家美國公司，XRP則是XRP帳本的原生資產。本頁面分析的是在交易所交易的XRP價格。"
     }
    ]
   },
   "th": {
    "title": "คะแนนจังหวะซื้อริปเปิล (XRP): ดูตำแหน่งราคาตอนนี้ด้วย 7 ตัวชี้วัด",
    "intro": "หน้า XRP คำนวณ RSI(14), MACD(12·26·9), Mayer Multiple, การย่อจากจุดสูงสุด 365 วัน และครอส 50/200 จากราคา XRP เทียบดอลลาร์ แล้วเพิ่มดัชนีความกลัว-ความโลภของทั้งตลาดและ MVRV Z-Score จาก CoinMetrics เพื่อให้ได้คะแนน 0–100 ผลลัพธ์แสดงเป็น STRONG BUY, ACCUMULATE, NEUTRAL, CAUTION หรือ OVERHEATED และดูคะแนนรวมได้ฟรี",
    "coinH": "ริปเปิล (XRP) คืออะไร?",
    "coinP": [
     "XRP เป็นสินทรัพย์หลักของ XRP Ledger (XRPL) ซึ่งพัฒนาโดยเดวิด ชวาร์ตซ์, เจด แมคเคเลบ และอาเธอร์ บริตโต และเริ่มทำงานในปี 2012 บริษัทที่ก่อตั้งในปีเดียวกันคือ Ripple ในปัจจุบัน คนมักเรียก XRP ว่า “ริปเปิล” ตามชื่อบริษัท แต่ถ้าพูดให้ถูก Ripple คือชื่อบริษัท ส่วน XRP คือชื่อสินทรัพย์",
     "XRP Ledger ไม่ได้ใช้การขุดหรือการสเตก แต่ให้ผู้ตรวจสอบความถูกต้องหาฉันทามติโดยอิงรายชื่อที่เชื่อถือ (UNL) และยืนยันบัญชีแยกประเภทชุดใหม่ทุก ๆ ไม่กี่วินาที XRP ทั้งหมด 1 แสนล้านเหรียญถูกสร้างขึ้นครั้งเดียวตั้งแต่แรกและไม่มีการออกเพิ่ม ส่วน XRP ที่ใช้จ่ายเป็นค่าธรรมเนียมจะถูกทำลายทิ้ง ในปี 2017 บริษัท Ripple นำ XRP ที่ถือไว้ 55,000 ล้านเหรียญเข้าบัญชีเอสโครว์ และปล่อยออกได้ไม่เกินเดือนละ 1,000 ล้านเหรียญ Ripple วางตำแหน่ง XRP เป็นสินทรัพย์ตัวกลางสำหรับการโอนเงินและชำระเงินข้ามประเทศ"
    ],
    "applyH": "ข้อควรรู้เมื่อใช้ตัวชี้วัดกับริปเปิล",
    "apply": [
     "ความผันผวนจากข่าว: XRP เคยขึ้นลงหลายสิบเปอร์เซ็นต์ภายในวันเดียวจากคำตัดสินคดีหรือข่าวการลิสต์และระงับการซื้อขายบนกระดานเทรด ในวันแบบนั้น RSI และ MACD จะพุ่งไปที่ค่าสุดขั้วชั่วคราว จึงควรตรวจสอบคู่กับเทรนด์ 50/200 มากกว่าจะเชื่อสัญญาณเพียงวันสองวัน",
     "ช่วงไซด์เวย์ยาวและการย่อตัว: การย่อจากจุดสูงสุด 365 วันวัดเทียบกับจุดสูงสุดในรอบปีที่ผ่านมาเท่านั้น ระหว่างไซด์เวย์นาน ๆ ตัวเลขอาจดูไม่ลึก ทั้งที่ราคายังห่างจากจุดสูงสุดตลอดกาลมาก กลับกัน หลังราคาพุ่งแรงแล้วร่วง ค่า −50% จะมาถึงเร็ว จึงไม่ควรตีความทันทีว่าเป็นโซน “ซื้อแรง”",
     "ดัชนีความกลัว-ความโลภ: ไม่มีดัชนีอารมณ์ตลาดเฉพาะของ XRP ค่าที่แสดงคือดัชนีทั้งตลาดของ Alternative.me ซึ่งให้น้ำหนักบิตคอยน์มาก ข่าวดีหรือข่าวร้ายที่เกี่ยวกับ XRP อย่างเดียวจึงไม่สะท้อนในค่านี้",
     "Mayer Multiple: เกณฑ์ 0.8 และ 2.4 เทียบเส้นเฉลี่ย 200 วันเป็นหลักจากประสบการณ์ของบิตคอยน์ สำหรับสินทรัพย์อย่าง XRP ที่พุ่งขึ้นได้ในเวลาสั้น ๆ เส้นเฉลี่ย 200 วันจะตามมาช้ามาก ค่า Mayer จึงอาจกระโดดสูงชั่วคราวทันทีหลังราคาพุ่ง",
     "MVRV Z-Score: ข้อมูลชุมชนของ CoinMetrics มี MVRV ของ XRP จึงคำนวณได้ แต่ XRP ถูกออกทั้งหมดล่วงหน้าโดยไม่มีการขุด และจำนวนมากยังอยู่ในการถือครองของ Ripple และบัญชีเอสโครว์ การตีความ MVRV ว่าเป็น “ต้นทุนเฉลี่ย” แบบบิตคอยน์จึงทำได้ยาก"
    ],
    "histH": "สรุปวัฏจักรราคาริปเปิล",
    "hist": [
     "2012–2013: XRP Ledger เริ่มทำงานและมีการสร้าง XRP 1 แสนล้านเหรียญ ในปี 2013 บริษัทเปลี่ยนชื่อจาก OpenCoin เป็น Ripple Labs",
     "2017–2018: XRP พุ่งแรงในตลาดกระทิงคริปโต ทำจุดสูงสุดในขณะนั้นราว 3.4 ดอลลาร์ช่วงต้นเดือนมกราคม 2018 จากนั้นปรับตัวลงเกือบทั้งปี",
     "2020–2021: ในเดือนธันวาคม 2020 ก.ล.ต.สหรัฐฯ (SEC) ฟ้อง Ripple และผู้บริหาร 2 คนในข้อหาขายหลักทรัพย์ที่ไม่ได้จดทะเบียน หลังจากนั้นกระดานเทรดรายใหญ่ในสหรัฐฯ ระงับการซื้อขาย XRP",
     "2023: เดือนกรกฎาคม ศาลสหรัฐฯ ตัดสินว่า XRP ที่ Ripple ขายผ่านกระดานเทรดในแบบที่ผู้ซื้อไม่รู้ว่าใครเป็นผู้ขาย ไม่ถือเป็นสัญญาการลงทุน ราคาพุ่งขึ้นแรงในวันนั้น และกระดานเทรดบางแห่งที่เคยระงับก็กลับมาลิสต์ XRP อีกครั้ง",
     "2024–2025: ราคาพุ่งขึ้นในช่วงพฤศจิกายน–ธันวาคม 2024 จนเกิน 2 ดอลลาร์เป็นครั้งแรกนับตั้งแต่ต้นปี 2018 และในปี 2025 SEC ถอนอุทธรณ์"
    ],
    "faq": [
     {
      "q": "ไม่มีดัชนีความกลัว-ความโลภของริปเปิลแยกต่างหากเลยหรือ?",
      "a": "ไม่มี ดัชนีของ Alternative.me ครอบคลุมตลาดคริปโตทั้งหมดและให้น้ำหนักข้อมูลบิตคอยน์มาก หน้า XRP จึงติดคำว่า “ทั้งตลาด” ไว้ข้างชื่อดัชนีเพื่อให้รู้ข้อนี้"
     },
     {
      "q": "ริปเปิลมีค่า MVRV ให้ดูด้วยหรือเปล่า?",
      "a": "แสดง API ชุมชนของ CoinMetrics มี MVRV ของ XRP หน้านี้จึงคำนวณ Z-Score ได้ แต่ด้วยโครงสร้างที่ออกเหรียญล่วงหน้าทั้งหมดและมีเอสโครว์ จึงควรใช้เป็นตัวเสริมตัวชี้วัดอื่นมากกว่าจะอ่านด้วยเส้นอ้างอิงแบบบิตคอยน์ เมื่อไม่มีข้อมูลจะแสดง N/A และคำนวณคะแนนใหม่จากตัวชี้วัดที่เหลือ"
     },
     {
      "q": "ตอนนี้ซื้อริปเปิลได้ไหม?",
      "a": "หน้านี้ไม่ได้ตัดสินใจลงทุนแทนคุณ คะแนนสูงในแท็บระยะยาว (สวนตลาด) หมายถึงสัญญาณขายมากเกิน ความกลัว และราคาต่ำกว่ามูลค่ามาบรรจบกัน ส่วนแท็บระยะสั้น (โมเมนตัม) จะสูงขึ้นตามความแรงของเทรนด์ขาขึ้น ตัวชี้วัดของ XRP อาจพลิกได้ในวันเดียวจากข่าวคดีความหรือกฎระเบียบ จึงควรใช้คะแนนเป็นเพียงภาพสรุปสถานการณ์ปัจจุบัน"
     },
     {
      "q": "ปริมาณที่ปล่อยจากเอสโครว์หรือผลคดีถูกนับรวมในคะแนนไหม?",
      "a": "ไม่ถูกนับ คะแนนคำนวณจากตัวชี้วัดที่อิงราคา 5 ตัว ดัชนีความกลัว-ความโลภ และ MVRV เท่านั้น ผลของข่าวจะปรากฏในตัวชี้วัดอย่าง RSI และ MACD ก็ต่อเมื่อราคาขยับไปแล้ว"
     },
     {
      "q": "ริปเปิลกับ XRP เป็นสิ่งเดียวกันไหม?",
      "a": "ถ้าพูดให้ถูกคือไม่ใช่ Ripple เป็นบริษัทสัญชาติอเมริกัน ส่วน XRP เป็นสินทรัพย์หลักของ XRP Ledger สิ่งที่หน้านี้วิเคราะห์คือราคาของ XRP ที่ซื้อขายบนกระดานเทรด"
     }
    ]
   },
   "es": {
    "title": "Puntuación de compra de XRP: dónde sitúan el precio siete indicadores",
    "intro": "La página de XRP calcula, a partir del precio de XRP en dólares, el RSI(14), el MACD(12·26·9), el múltiplo de Mayer, la caída desde el máximo de 365 días y el cruce 50/200, y les suma el índice de miedo y codicia de todo el mercado y el MVRV Z-Score de CoinMetrics para obtener una puntuación de 0 a 100. El resultado aparece como STRONG BUY, ACCUMULATE, NEUTRAL, CAUTION u OVERHEATED, y la puntuación global se puede ver gratis.",
    "coinH": "¿Qué es XRP?",
    "coinP": [
     "XRP es el activo nativo de XRP Ledger (XRPL). Este registro lo desarrollaron David Schwartz, Jed McCaleb y Arthur Britto y entró en funcionamiento en 2012; la empresa fundada ese mismo año es la actual Ripple. A XRP se le suele llamar «Ripple» por el nombre de la empresa, pero en rigor Ripple es la compañía y XRP es el activo.",
     "En lugar de minería o staking, XRP Ledger alcanza el consenso entre validadores que se apoyan en listas de confianza (UNL), y cada pocos segundos se cierra un nuevo registro. Los 100.000 millones de XRP se crearon de una vez al principio y no se emiten más; el XRP gastado en comisiones se destruye. En 2017, Ripple depositó en custodia (escrow) 55.000 millones de sus XRP, con liberaciones de hasta 1.000 millones al mes. Ripple ha promocionado XRP como activo puente para pagos y liquidaciones internacionales."
    ],
    "applyH": "Cómo aplicar los indicadores a XRP",
    "apply": [
     "Saltos por noticias: XRP se ha movido decenas de puntos porcentuales en un solo día por sentencias judiciales o por noticias de cotización y suspensión en exchanges. En días así, el RSI y el MACD se disparan a valores extremos, de modo que conviene contrastarlos con la tendencia 50/200 en vez de fiarse de una señal de uno o dos días.",
     "Rangos largos y caída: la caída de 365 días solo se mide frente al máximo del último año, así que durante un lateral prolongado puede parecer pequeña aunque el precio esté muy lejos de su máximo histórico. Al revés, tras una subida brusca el −50 % llega rápido; cuidado con leerlo de inmediato como zona de «compra fuerte».",
     "Índice de miedo y codicia: no existe un índice de sentimiento propio de XRP. El valor mostrado es el índice de todo el mercado de Alternative.me, con mucho peso de Bitcoin, así que las noticias buenas o malas que afectan solo a XRP no se reflejan en él.",
     "Múltiplo de Mayer: los umbrales de 0,8 y 2,4 respecto a la media de 200 días son reglas empíricas de Bitcoin. En un activo como XRP, capaz de dispararse en poco tiempo, la media de 200 días va muy rezagada, por lo que el múltiplo de Mayer puede saltar con fuerza justo después de una subida.",
     "MVRV Z-Score: los datos comunitarios de CoinMetrics incluyen el MVRV de XRP, así que se puede calcular. Pero todo el XRP se emitió por adelantado sin minería y una gran parte está en manos de Ripple o en custodia, lo que dificulta leer el MVRV como «coste medio de compra» igual que en Bitcoin."
    ],
    "histH": "Resumen de los ciclos de precio de XRP",
    "hist": [
     "2012–2013: XRP Ledger empezó a funcionar y se crearon 100.000 millones de XRP; en 2013 la empresa pasó de llamarse OpenCoin a Ripple Labs.",
     "2017–2018: XRP se disparó en el mercado alcista cripto, marcó a principios de enero de 2018 el entonces récord de unos 3,40 dólares y pasó la mayor parte de ese año a la baja.",
     "2020–2021: en diciembre de 2020 la SEC de EE. UU. demandó a Ripple y a dos de sus directivos por supuesta venta de valores no registrados; después, los principales exchanges estadounidenses suspendieron la negociación de XRP.",
     "2023: en julio, un tribunal de EE. UU. dictaminó que las ventas de XRP que Ripple hizo en exchanges sin que los compradores supieran quién vendía no eran contratos de inversión. El precio subió con fuerza ese día y algunos exchanges que lo habían suspendido volvieron a listar XRP.",
     "2024–2025: XRP se disparó en noviembre y diciembre de 2024 y superó los 2 dólares por primera vez desde principios de 2018; en 2025 la SEC retiró su apelación."
    ],
    "faq": [
     {
      "q": "¿No hay un índice de miedo y codicia propio de XRP?",
      "a": "No lo hay. El índice de Alternative.me abarca todo el mercado cripto y da mucho peso a los datos de Bitcoin. Para dejarlo claro, la página de XRP añade la etiqueta «todo el mercado» junto al nombre del índice."
     },
     {
      "q": "¿También se muestra el MVRV para XRP?",
      "a": "Sí. La API comunitaria de CoinMetrics proporciona el MVRV de XRP y con él se calcula el Z-Score. Sin embargo, por la emisión anticipada y la estructura de custodia, es mejor usarlo como apoyo de los demás indicadores que leerlo con las líneas de referencia de Bitcoin. Si no hay datos, aparece N/A y la puntuación se recalcula con los indicadores restantes."
     },
     {
      "q": "¿Es buen momento para comprar XRP?",
      "a": "Esta página no toma decisiones de inversión por ti. Una puntuación alta en la pestaña de largo plazo (contraria) significa que se han alineado señales de sobreventa, miedo e infravaloración, mientras que la de corto plazo (momentum) sube con la fuerza de la tendencia alcista. Las noticias judiciales o regulatorias pueden dar la vuelta a los indicadores de XRP en un día, así que usa la puntuación solo como foto de la situación actual."
     },
     {
      "q": "¿Se tienen en cuenta las liberaciones del escrow o los resultados judiciales?",
      "a": "No. La puntuación se calcula solo con cinco indicadores basados en el precio, el índice de miedo y codicia y el MVRV. El efecto de las noticias aparece en indicadores como el RSI o el MACD únicamente después de que el precio se haya movido."
     },
     {
      "q": "¿Ripple y XRP son lo mismo?",
      "a": "En sentido estricto, no. Ripple es una empresa estadounidense, mientras que XRP es el activo nativo de XRP Ledger. Lo que analiza esta página es el precio de XRP tal como se negocia en los exchanges."
     }
    ]
   },
   "fr": {
    "title": "Score d’achat XRP : où sept indicateurs situent le prix aujourd’hui",
    "intro": "La page XRP calcule, à partir du prix du XRP en dollars, le RSI(14), le MACD(12·26·9), le multiple de Mayer, le repli depuis le plus haut sur 365 jours et le croisement 50/200, puis y ajoute l’indice de peur et d’avidité du marché entier et le MVRV Z-Score de CoinMetrics pour obtenir un score de 0 à 100. Le résultat s’affiche en STRONG BUY, ACCUMULATE, NEUTRAL, CAUTION ou OVERHEATED, et le score global est consultable gratuitement.",
    "coinH": "Qu’est-ce que le XRP ?",
    "coinP": [
     "Le XRP est l’actif natif du XRP Ledger (XRPL). Ce registre, développé par David Schwartz, Jed McCaleb et Arthur Britto, fonctionne depuis 2012 ; l’entreprise fondée la même année est l’actuelle Ripple. On appelle souvent le XRP « Ripple » d’après le nom de la société, mais à proprement parler Ripple est l’entreprise et XRP l’actif.",
     "Plutôt que le minage ou le staking, le XRP Ledger repose sur un consensus entre validateurs qui s’appuient sur des listes de confiance (UNL), et un nouvel état du registre est validé toutes les quelques secondes. Les 100 milliards de XRP ont tous été créés au lancement et aucun n’est émis ensuite ; le XRP dépensé en frais de transaction est détruit. En 2017, Ripple a placé 55 milliards de ses XRP sous séquestre (escrow), avec au plus 1 milliard libéré par mois. Ripple présente le XRP comme un actif passerelle pour les paiements et règlements internationaux."
    ],
    "applyH": "Appliquer les indicateurs au XRP",
    "apply": [
     "Sauts liés à l’actualité : le XRP a déjà varié de plusieurs dizaines de pour cent en une seule journée après des décisions de justice ou des annonces de cotation et de suspension sur des plateformes. Ces jours-là, le RSI et le MACD atteignent des extrêmes ; mieux vaut les confronter à la tendance 50/200 que se fier à un signal d’un ou deux jours.",
     "Longs ranges et repli : le repli sur 365 jours ne se mesure que par rapport au plus haut de l’année écoulée ; pendant une longue phase latérale, il peut sembler faible alors que le prix reste très loin de son record historique. À l’inverse, après une flambée, le −50 % arrive vite : prudence avant d’y voir immédiatement une zone « d’achat fort ».",
     "Indice de peur et d’avidité : il n’existe pas d’indice de sentiment propre au XRP. La valeur affichée est l’indice du marché entier d’Alternative.me, fortement pondéré par le bitcoin ; les bonnes ou mauvaises nouvelles qui ne concernent que le XRP n’y apparaissent donc pas.",
     "Multiple de Mayer : les seuils de 0,8 et 2,4 par rapport à la moyenne sur 200 jours sont des règles empiriques issues du bitcoin. Pour un actif comme le XRP, capable de s’envoler en peu de temps, la moyenne sur 200 jours suit avec beaucoup de retard, si bien que le multiple de Mayer peut bondir juste après une hausse.",
     "MVRV Z-Score : les données communautaires de CoinMetrics comprennent le MVRV du XRP, qui peut donc être calculé. Mais tout le XRP a été émis d’avance sans minage et une part importante se trouve chez Ripple ou sous séquestre, ce qui rend difficile de lire le MVRV comme un « coût moyen d’acquisition » à la manière du bitcoin."
    ],
    "histH": "Les cycles de prix du XRP en bref",
    "hist": [
     "2012–2013 : le XRP Ledger est mis en service et 100 milliards de XRP sont créés ; en 2013, l’entreprise passe du nom d’OpenCoin à celui de Ripple Labs.",
     "2017–2018 : porté par le marché haussier crypto, le XRP atteint début janvier 2018 un record d’alors d’environ 3,40 dollars, puis recule pendant la majeure partie de l’année.",
     "2020–2021 : en décembre 2020, la SEC américaine poursuit Ripple et deux de ses dirigeants pour vente présumée de titres non enregistrés ; les grandes plateformes américaines suspendent ensuite la négociation du XRP.",
     "2023 : en juillet, un tribunal américain juge que les XRP vendus par Ripple sur des plateformes, sans que les acheteurs sachent qui vendait, ne constituaient pas des contrats d’investissement. Le cours bondit le jour même et certaines plateformes qui l’avaient suspendu remettent le XRP en cotation.",
     "2024–2025 : le XRP s’envole en novembre-décembre 2024 et repasse 2 dollars pour la première fois depuis début 2018 ; en 2025, la SEC abandonne son appel."
    ],
    "faq": [
     {
      "q": "N’existe-t-il pas d’indice de peur et d’avidité propre au XRP ?",
      "a": "Non. L’indice d’Alternative.me couvre tout le marché crypto et accorde un poids important aux données du bitcoin. Pour le signaler, la page XRP ajoute la mention « marché entier » à côté du nom de l’indice."
     },
     {
      "q": "Le MVRV est-il aussi affiché pour le XRP ?",
      "a": "Oui. L’API communautaire de CoinMetrics fournit le MVRV du XRP, à partir duquel le Z-Score est calculé. Toutefois, en raison de l’émission anticipée et du séquestre, mieux vaut s’en servir en appui des autres indicateurs que le lire avec les repères du bitcoin. En l’absence de données, il affiche N/A et le score est recalculé avec les indicateurs restants."
     },
     {
      "q": "Est-ce le bon moment pour acheter du XRP ?",
      "a": "Cette page ne prend pas de décision d’investissement à votre place. Un score élevé dans l’onglet long terme (contrarian) signifie que des signaux de survente, de peur et de sous-évaluation se sont alignés, tandis que l’onglet court terme (momentum) monte avec la vigueur de la tendance haussière. Une actualité judiciaire ou réglementaire peut retourner les indicateurs du XRP en une journée : considérez le score uniquement comme un instantané de la situation."
     },
     {
      "q": "Les déblocages du séquestre ou les décisions de justice sont-ils pris en compte ?",
      "a": "Non. Le score est calculé uniquement à partir de cinq indicateurs fondés sur le prix, de l’indice de peur et d’avidité et du MVRV. L’effet d’une actualité n’apparaît dans des indicateurs comme le RSI ou le MACD qu’une fois que le prix a bougé."
     },
     {
      "q": "Ripple et XRP, est-ce la même chose ?",
      "a": "Strictement parlant, non. Ripple est une entreprise américaine, tandis que le XRP est l’actif natif du XRP Ledger. Cette page analyse le prix du XRP tel qu’il s’échange sur les plateformes."
     }
    ]
   },
   "de": {
    "title": "XRP-Kauf-Timing-Score: Wo sieben Indikatoren den Kurs gerade sehen",
    "intro": "Die XRP-Seite berechnet aus dem Dollarkurs von XRP den RSI(14), den MACD(12·26·9), das Mayer-Multiple, den Rückgang vom 365-Tage-Hoch und das 50/200-Kreuz, ergänzt den marktweiten Angst-&-Gier-Index sowie den MVRV Z-Score von CoinMetrics und ermittelt daraus einen Score von 0 bis 100. Das Ergebnis erscheint als STRONG BUY, ACCUMULATE, NEUTRAL, CAUTION oder OVERHEATED; den Gesamtscore können Sie kostenlos einsehen.",
    "coinH": "Was ist XRP?",
    "coinP": [
     "XRP ist der native Vermögenswert des XRP Ledger (XRPL). Entwickelt von David Schwartz, Jed McCaleb und Arthur Britto, läuft der Ledger seit 2012; das im selben Jahr gegründete Unternehmen ist das heutige Ripple. XRP wird nach der Firma oft „Ripple“ genannt, genau genommen ist Ripple aber das Unternehmen und XRP der Vermögenswert.",
     "Statt Mining oder Staking nutzt der XRP Ledger einen Konsens zwischen Validatoren, die sich auf Vertrauenslisten (UNL) stützen; alle paar Sekunden wird ein neuer Ledger-Stand bestätigt. Alle 100 Milliarden XRP wurden zum Start auf einmal erzeugt, neue werden nicht ausgegeben, und für Transaktionsgebühren verwendetes XRP wird vernichtet. 2017 legte Ripple 55 Milliarden seiner XRP auf Treuhandkonten (Escrow), aus denen monatlich höchstens 1 Milliarde freigegeben wird. Ripple vermarktet XRP als Brückenwährung für internationale Zahlungen und Abwicklungen."
    ],
    "applyH": "Indikatoren auf XRP anwenden",
    "apply": [
     "Nachrichtengetriebene Sprünge: XRP hat sich schon an einem einzigen Tag um mehrere zehn Prozent bewegt – nach Gerichtsentscheidungen oder Meldungen über Listings und Handelsaussetzungen an Börsen. An solchen Tagen schießen RSI und MACD in Extremwerte; gleichen Sie sie daher mit dem 50/200-Trend ab, statt einem Signal von ein, zwei Tagen zu vertrauen.",
     "Lange Seitwärtsphasen und Rückgang: Der 365-Tage-Rückgang bezieht sich nur auf das Hoch des letzten Jahres. In einer langen Seitwärtsphase kann er klein wirken, obwohl der Kurs weit unter dem Allzeithoch liegt. Umgekehrt ist nach einem steilen Anstieg schnell ein Wert von −50 % erreicht – den sollten Sie nicht vorschnell als Zone für „starken Kauf“ deuten.",
     "Angst-&-Gier-Index: Einen eigenen Stimmungsindex für XRP gibt es nicht. Angezeigt wird der marktweite Index von Alternative.me mit starkem Bitcoin-Gewicht; gute oder schlechte Nachrichten, die nur XRP betreffen, spiegeln sich darin nicht wider.",
     "Mayer-Multiple: Die Schwellen 0,8 und 2,4 gegenüber der 200-Tage-Linie sind Faustregeln aus dem Bitcoin-Markt. Bei einem Vermögenswert wie XRP, der in kurzer Zeit stark steigen kann, hinkt die 200-Tage-Linie weit hinterher, sodass das Mayer-Multiple direkt nach einer Rally kurzzeitig stark ausschlagen kann.",
     "MVRV Z-Score: Die Community-Daten von CoinMetrics enthalten das MVRV von XRP, es lässt sich also berechnen. Da aber sämtliche XRP ohne Mining vorab ausgegeben wurden und ein großer Teil bei Ripple oder in Treuhand liegt, lässt sich MVRV kaum wie bei Bitcoin als „durchschnittlicher Einstandspreis“ lesen."
    ],
    "histH": "XRPs Preiszyklen im Überblick",
    "hist": [
     "2012–2013: Der XRP Ledger ging in Betrieb und 100 Milliarden XRP wurden erzeugt; 2013 benannte sich das Unternehmen von OpenCoin in Ripple Labs um.",
     "2017–2018: Im Krypto-Bullenmarkt stieg XRP steil und erreichte Anfang Januar 2018 mit rund 3,40 Dollar ein damaliges Rekordhoch; den Großteil des Jahres ging es danach abwärts.",
     "2020–2021: Im Dezember 2020 verklagte die US-Börsenaufsicht SEC Ripple und zwei Führungskräfte wegen mutmaßlichen Verkaufs nicht registrierter Wertpapiere; daraufhin setzten große US-Börsen den XRP-Handel aus.",
     "2023: Im Juli entschied ein US-Gericht, dass XRP-Verkäufe von Ripple über Börsen, bei denen die Käufer den Verkäufer nicht kannten, keine Investmentverträge waren. Der Kurs sprang am selben Tag deutlich an, und einige Börsen, die den Handel ausgesetzt hatten, nahmen XRP wieder auf.",
     "2024–2025: Im November und Dezember 2024 stieg XRP kräftig und überschritt erstmals seit Anfang 2018 wieder 2 Dollar; 2025 zog die SEC ihre Berufung zurück."
    ],
    "faq": [
     {
      "q": "Gibt es keinen eigenen Angst-&-Gier-Index für XRP?",
      "a": "Nein. Der Index von Alternative.me deckt den gesamten Kryptomarkt ab und gewichtet Bitcoin-Daten stark. Um das deutlich zu machen, steht auf der XRP-Seite neben dem Indexnamen der Hinweis „Gesamtmarkt“."
     },
     {
      "q": "Zeigt die XRP-Seite MVRV an?",
      "a": "Ja. Die Community-API von CoinMetrics liefert das MVRV von XRP, daraus wird der Z-Score berechnet. Wegen der vorab ausgegebenen Menge und der Treuhandstruktur eignet er sich aber eher als Ergänzung zu den anderen Indikatoren als zum Vergleich mit den Bitcoin-Referenzlinien. Ohne Daten erscheint N/A, und der Score wird aus den übrigen Indikatoren neu berechnet."
     },
     {
      "q": "Ist jetzt ein guter Zeitpunkt, XRP zu kaufen?",
      "a": "Diese Seite nimmt Ihnen keine Anlageentscheidung ab. Ein hoher Score im Tab Langfristig (antizyklisch) bedeutet, dass Signale für überverkaufte Kurse, Angst und Unterbewertung zusammentreffen; der Tab Kurzfristig (Momentum) steigt mit der Stärke des Aufwärtstrends. Gerichts- oder Regulierungsnachrichten können die XRP-Indikatoren binnen eines Tages drehen – nutzen Sie den Score daher nur als Momentaufnahme."
     },
     {
      "q": "Fließen Escrow-Freigaben oder Gerichtsurteile in den Score ein?",
      "a": "Nein. Der Score wird nur aus fünf kursbasierten Indikatoren, dem Angst-&-Gier-Index und MVRV berechnet. Die Wirkung von Nachrichten zeigt sich in Indikatoren wie RSI und MACD erst, nachdem sich der Kurs bewegt hat."
     },
     {
      "q": "Sind Ripple und XRP dasselbe?",
      "a": "Genau genommen nicht. Ripple ist ein US-Unternehmen, XRP der native Vermögenswert des XRP Ledger. Analysiert wird auf dieser Seite der Kurs von XRP, wie er an Börsen gehandelt wird."
     }
    ]
   },
   "it": {
    "title": "Punteggio d’acquisto XRP: dove sette indicatori collocano il prezzo oggi",
    "intro": "La pagina XRP calcola dal prezzo in dollari di XRP l’RSI(14), il MACD(12·26·9), il multiplo di Mayer, il ribasso dal massimo a 365 giorni e l’incrocio 50/200, poi aggiunge l’indice di paura e avidità dell’intero mercato e il MVRV Z-Score di CoinMetrics per ottenere un punteggio da 0 a 100. Il risultato compare come STRONG BUY, ACCUMULATE, NEUTRAL, CAUTION o OVERHEATED e il punteggio complessivo è consultabile gratis.",
    "coinH": "Che cos’è XRP?",
    "coinP": [
     "XRP è l’asset nativo di XRP Ledger (XRPL). Il registro, sviluppato da David Schwartz, Jed McCaleb e Arthur Britto, è operativo dal 2012; la società fondata nello stesso anno è l’attuale Ripple. XRP viene spesso chiamato «Ripple» dal nome dell’azienda, ma a rigore Ripple è la società e XRP l’asset.",
     "Invece di mining o staking, XRP Ledger usa un consenso tra validatori che si basano su liste di fiducia (UNL), e ogni pochi secondi viene chiuso un nuovo registro. Tutti i 100 miliardi di XRP sono stati creati in un colpo solo all’avvio e non ne vengono emessi altri; gli XRP spesi in commissioni vengono distrutti. Nel 2017 Ripple ha vincolato in escrow 55 miliardi dei suoi XRP, con sblocchi massimi di 1 miliardo al mese. Ripple ha promosso XRP come asset ponte per pagamenti e regolamenti internazionali."
    ],
    "applyH": "Applicare gli indicatori a XRP",
    "apply": [
     "Balzi legati alle notizie: XRP si è mosso anche di decine di punti percentuali in un solo giorno per sentenze o notizie di quotazione e sospensione sugli exchange. In giornate così RSI e MACD schizzano a valori estremi: conviene confrontarli con il trend 50/200 invece di fidarsi di un segnale di uno o due giorni.",
     "Lunghe fasi laterali e ribasso: il ribasso a 365 giorni si misura solo rispetto al massimo dell’ultimo anno, quindi durante una lunga fase laterale può sembrare contenuto anche se il prezzo è molto lontano dal massimo storico. Al contrario, dopo un’impennata il −50% arriva in fretta: attenzione a leggerlo subito come zona di «acquisto forte».",
     "Indice di paura e avidità: non esiste un indice di sentiment specifico per XRP. Il valore mostrato è l’indice dell’intero mercato di Alternative.me, con un forte peso di Bitcoin, quindi le notizie buone o cattive che riguardano solo XRP non vi si riflettono.",
     "Multiplo di Mayer: le soglie 0,8 e 2,4 rispetto alla media a 200 giorni sono regole empiriche nate su Bitcoin. Per un asset come XRP, che può impennarsi in poco tempo, la media a 200 giorni insegue con molto ritardo e il multiplo di Mayer può schizzare in alto subito dopo un rialzo.",
     "MVRV Z-Score: i dati della community di CoinMetrics includono l’MVRV di XRP, quindi si può calcolare. Però tutti gli XRP sono stati emessi in anticipo senza mining e una parte consistente è detenuta da Ripple o in escrow: per questo è difficile leggere l’MVRV come «costo medio d’acquisto» come si fa con Bitcoin."
    ],
    "histH": "I cicli di prezzo di XRP in sintesi",
    "hist": [
     "2012–2013: XRP Ledger entra in funzione e vengono creati 100 miliardi di XRP; nel 2013 la società cambia nome da OpenCoin a Ripple Labs.",
     "2017–2018: nel mercato rialzista delle cripto XRP vola fino a un allora record di circa 3,40 dollari all’inizio di gennaio 2018, per poi scendere per gran parte dell’anno.",
     "2020–2021: nel dicembre 2020 la SEC statunitense fa causa a Ripple e a due suoi dirigenti per presunta vendita di titoli non registrati; in seguito i principali exchange statunitensi sospendono le negoziazioni di XRP.",
     "2023: a luglio un tribunale statunitense stabilisce che gli XRP venduti da Ripple sugli exchange, senza che gli acquirenti sapessero chi vendeva, non erano contratti d’investimento. Quel giorno il prezzo sale con forza e alcuni exchange che lo avevano sospeso tornano a quotare XRP.",
     "2024–2025: tra novembre e dicembre 2024 XRP sale con forza e supera i 2 dollari per la prima volta dall’inizio del 2018; nel 2025 la SEC ritira il suo appello."
    ],
    "faq": [
     {
      "q": "Non esiste un indice di paura e avidità specifico per XRP?",
      "a": "No. L’indice di Alternative.me copre l’intero mercato cripto e dà molto peso ai dati di Bitcoin. Per chiarirlo, la pagina XRP aggiunge l’etichetta «intero mercato» accanto al nome dell’indice."
     },
     {
      "q": "La pagina XRP mostra l’MVRV?",
      "a": "Sì. L’API della community di CoinMetrics fornisce l’MVRV di XRP, da cui si calcola lo Z-Score. Per via dell’emissione anticipata e della struttura in escrow, però, conviene usarlo a supporto degli altri indicatori più che leggerlo con le linee di riferimento di Bitcoin. Se mancano i dati compare N/A e il punteggio viene ricalcolato con gli indicatori rimanenti."
     },
     {
      "q": "È il momento giusto per comprare XRP?",
      "a": "Questa pagina non prende decisioni d’investimento al posto tuo. Un punteggio alto nella scheda lungo termine (contrarian) indica che segnali di ipervenduto, paura e sottovalutazione si sono allineati, mentre la scheda breve termine (momentum) sale con la forza del trend rialzista. Le notizie giudiziarie o normative possono ribaltare gli indicatori di XRP in un giorno: usa il punteggio solo come istantanea della situazione attuale."
     },
     {
      "q": "Gli sblocchi dall’escrow o gli esiti giudiziari entrano nel punteggio?",
      "a": "No. Il punteggio si calcola solo con cinque indicatori basati sul prezzo, l’indice di paura e avidità e l’MVRV. L’effetto delle notizie compare in indicatori come RSI e MACD solo dopo che il prezzo si è mosso."
     },
     {
      "q": "Ripple e XRP sono la stessa cosa?",
      "a": "A rigore no. Ripple è un’azienda statunitense, mentre XRP è l’asset nativo di XRP Ledger. Questa pagina analizza il prezzo di XRP così come viene scambiato sugli exchange."
     }
    ]
   },
   "pt": {
    "title": "Pontuação de compra do XRP: onde sete indicadores colocam o preço agora",
    "intro": "A página do XRP calcula, a partir do preço do XRP em dólar, o RSI(14), o MACD(12·26·9), o múltiplo de Mayer, a queda desde a máxima de 365 dias e o cruzamento 50/200, e soma a eles o índice de medo e ganância do mercado todo e o MVRV Z-Score da CoinMetrics para chegar a uma pontuação de 0 a 100. O resultado aparece como STRONG BUY, ACCUMULATE, NEUTRAL, CAUTION ou OVERHEATED, e a pontuação geral pode ser vista de graça.",
    "coinH": "O que é XRP?",
    "coinP": [
     "XRP é o ativo nativo do XRP Ledger (XRPL). O registro foi desenvolvido por David Schwartz, Jed McCaleb e Arthur Britto e entrou em operação em 2012; a empresa fundada no mesmo ano é a atual Ripple. O XRP costuma ser chamado de “Ripple” por causa do nome da empresa, mas, a rigor, Ripple é a companhia e XRP é o ativo.",
     "Em vez de mineração ou staking, o XRP Ledger chega a consenso entre validadores que se apoiam em listas de confiança (UNL), e um novo registro é fechado a cada poucos segundos. Os 100 bilhões de XRP foram todos criados de uma vez no início e não há nova emissão; o XRP gasto em taxas de transação é destruído. Em 2017, a Ripple colocou 55 bilhões de seus XRP em custódia (escrow), com liberação de no máximo 1 bilhão por mês. A Ripple tem promovido o XRP como ativo-ponte para remessas e liquidações internacionais."
    ],
    "applyH": "Como aplicar os indicadores ao XRP",
    "apply": [
     "Saltos causados por notícias: o XRP já se moveu dezenas de pontos percentuais em um único dia por decisões judiciais ou notícias de listagem e suspensão em corretoras. Nesses dias, RSI e MACD disparam para valores extremos; por isso, confira-os com a tendência 50/200 em vez de confiar num sinal de um ou dois dias.",
     "Lateralizações longas e queda: a queda de 365 dias só é medida em relação à máxima do último ano, então numa lateralização longa ela pode parecer pequena mesmo com o preço muito abaixo da máxima histórica. Por outro lado, depois de uma disparada o −50% chega rápido — cuidado ao lê-lo de imediato como zona de “compra forte”.",
     "Índice de medo e ganância: não existe um índice de sentimento próprio do XRP. O valor exibido é o índice do mercado todo da Alternative.me, com grande peso do Bitcoin, então notícias boas ou ruins que afetam só o XRP não aparecem nele.",
     "Múltiplo de Mayer: os limites de 0,8 e 2,4 em relação à média de 200 dias são regras práticas vindas do Bitcoin. Num ativo como o XRP, que pode disparar em pouco tempo, a média de 200 dias fica bem para trás, e o múltiplo de Mayer pode saltar logo depois de uma alta.",
     "MVRV Z-Score: os dados comunitários da CoinMetrics incluem o MVRV do XRP, então ele pode ser calculado. Mas todo o XRP foi emitido antecipadamente, sem mineração, e uma grande parte está com a Ripple ou em custódia, o que dificulta ler o MVRV como “custo médio de compra” do jeito que se faz com o Bitcoin."
    ],
    "histH": "Resumo dos ciclos de preço do XRP",
    "hist": [
     "2012–2013: o XRP Ledger entrou em operação e 100 bilhões de XRP foram criados; em 2013 a empresa mudou de nome, de OpenCoin para Ripple Labs.",
     "2017–2018: o XRP disparou no mercado de alta das criptomoedas, marcou no início de janeiro de 2018 o então recorde de cerca de US$ 3,40 e passou a maior parte daquele ano em queda.",
     "2020–2021: em dezembro de 2020, a SEC dos EUA processou a Ripple e dois de seus executivos por suposta venda de valores mobiliários não registrados; em seguida, as principais corretoras americanas suspenderam a negociação do XRP.",
     "2023: em julho, um tribunal dos EUA decidiu que os XRP vendidos pela Ripple em corretoras, sem que os compradores soubessem quem vendia, não eram contratos de investimento. O preço subiu forte naquele dia, e algumas corretoras que tinham suspendido o XRP voltaram a listá-lo.",
     "2024–2025: o XRP disparou em novembro e dezembro de 2024 e passou de US$ 2 pela primeira vez desde o início de 2018; em 2025 a SEC retirou seu recurso."
    ],
    "faq": [
     {
      "q": "Não existe um índice de medo e ganância próprio do XRP?",
      "a": "Não existe. O índice da Alternative.me cobre todo o mercado cripto e dá muito peso aos dados do Bitcoin. Para deixar isso claro, a página do XRP traz a marcação “mercado todo” ao lado do nome do índice."
     },
     {
      "q": "O MVRV também aparece para o XRP?",
      "a": "Sim. A API comunitária da CoinMetrics fornece o MVRV do XRP, e com ele se calcula o Z-Score. Por causa da emissão antecipada e da estrutura de custódia, porém, é melhor usá-lo como apoio aos outros indicadores do que lê-lo pelas linhas de referência do Bitcoin. Sem dados, aparece N/A e a pontuação é recalculada com os indicadores restantes."
     },
     {
      "q": "É uma boa hora para comprar XRP?",
      "a": "Esta página não toma decisões de investimento por você. Uma pontuação alta na aba de longo prazo (contrária) indica que sinais de sobrevenda, medo e subvalorização se alinharam, enquanto a aba de curto prazo (momentum) sobe com a força da tendência de alta. Notícias judiciais ou regulatórias podem virar os indicadores do XRP em um dia, então use a pontuação apenas como retrato da situação atual."
     },
     {
      "q": "Liberações do escrow ou decisões judiciais entram na pontuação?",
      "a": "Não. A pontuação é calculada apenas com cinco indicadores baseados em preço, o índice de medo e ganância e o MVRV. O efeito das notícias só aparece em indicadores como RSI e MACD depois que o preço já se moveu."
     },
     {
      "q": "Ripple e XRP são a mesma coisa?",
      "a": "A rigor, não. A Ripple é uma empresa americana, enquanto o XRP é o ativo nativo do XRP Ledger. O que esta página analisa é o preço do XRP negociado nas corretoras."
     }
    ]
   },
   "ru": {
    "title": "Оценка покупки Рипл (XRP): где сейчас цена по семи индикаторам",
    "intro": "Страница XRP рассчитывает по долларовой цене XRP индикаторы RSI(14), MACD(12·26·9), множитель Майера, просадку от 365-дневного максимума и крест 50/200, затем добавляет общерыночный индекс страха и жадности и MVRV Z-оценку от CoinMetrics и выводит оценку от 0 до 100. Результат отображается как STRONG BUY, ACCUMULATE, NEUTRAL, CAUTION или OVERHEATED; итоговую оценку можно смотреть бесплатно.",
    "coinH": "Что такое Рипл (XRP)?",
    "coinP": [
     "XRP — собственный актив реестра XRP Ledger (XRPL). Его разработали Дэвид Шварц, Джед Маккалеб и Артур Бритто, и он работает с 2012 года; основанная в том же году компания — нынешняя Ripple. XRP часто называют «Рипл» по имени компании, но, строго говоря, Ripple — это компания, а XRP — актив.",
     "Вместо майнинга или стейкинга XRP Ledger использует консенсус валидаторов, опирающихся на списки доверенных узлов (UNL), и новая версия реестра подтверждается каждые несколько секунд. Все 100 млрд XRP были созданы сразу при запуске, новые не выпускаются, а XRP, потраченные на комиссии, уничтожаются. В 2017 году Ripple поместила 55 млрд своих XRP на эскроу-счета, откуда ежемесячно может высвобождаться не более 1 млрд. Ripple продвигает XRP как промежуточный актив для международных переводов и расчётов."
    ],
    "applyH": "Как применять индикаторы к Рипл (XRP)",
    "apply": [
     "Скачки на новостях: XRP уже менялся в цене на десятки процентов за один день после судебных решений или новостей о листинге и приостановке торгов на биржах. В такие дни RSI и MACD резко уходят в экстремальные значения, поэтому сверяйте их с трендом 50/200, а не доверяйте сигналу одного-двух дней.",
     "Долгие боковики и просадка: просадка за 365 дней считается только от максимума последнего года, поэтому во время долгого бокового движения она может казаться небольшой, хотя цена очень далека от исторического максимума. И наоборот, после резкого взлёта отметка −50% достигается быстро — не спешите сразу считать её зоной «сильной покупки».",
     "Индекс страха и жадности: отдельного индекса настроений для XRP нет. Показывается общерыночный индекс Alternative.me с большим весом биткоина, поэтому хорошие или плохие новости, касающиеся только XRP, в нём не отражаются.",
     "Множитель Майера: пороги 0,8 и 2,4 относительно 200-дневной средней — эмпирические правила, пришедшие из биткоина. У актива вроде XRP, способного взлететь за короткий срок, 200-дневная средняя сильно запаздывает, и множитель Майера сразу после ралли может кратковременно резко подскочить.",
     "MVRV Z-оценка: в общедоступных данных CoinMetrics есть MVRV для XRP, так что её можно рассчитать. Но все XRP были выпущены заранее без майнинга, и значительная их часть находится у Ripple или на эскроу, поэтому трактовать MVRV как «среднюю цену покупки», как у биткоина, затруднительно."
    ],
    "histH": "Ценовые циклы Рипл (XRP) вкратце",
    "hist": [
     "2012–2013: заработал XRP Ledger и было создано 100 млрд XRP; в 2013 году компания сменила название с OpenCoin на Ripple Labs.",
     "2017–2018: на бычьем рынке криптовалют XRP резко вырос и в начале января 2018 года установил тогдашний рекорд — около 3,4 доллара, после чего большую часть года снижался.",
     "2020–2021: в декабре 2020 года Комиссия по ценным бумагам и биржам США (SEC) подала иск против Ripple и двух её руководителей из-за предполагаемой продажи незарегистрированных ценных бумаг; после этого крупные американские биржи приостановили торги XRP.",
     "2023: в июле суд США постановил, что XRP, которые Ripple продавала на биржах так, что покупатели не знали продавца, не являлись инвестиционными контрактами. В тот же день цена резко выросла, а часть бирж, приостановивших торги, снова добавила XRP.",
     "2024–2025: в ноябре–декабре 2024 года XRP резко вырос и впервые с начала 2018 года превысил 2 доллара; в 2025 году SEC отозвала свою апелляцию."
    ],
    "faq": [
     {
      "q": "Разве нет отдельного индекса страха и жадности для Рипл (XRP)?",
      "a": "Нет. Индекс Alternative.me охватывает весь криптовалютный рынок и придаёт большой вес данным биткоина. Чтобы это было понятно, на странице XRP рядом с названием индекса стоит пометка «весь рынок»."
     },
     {
      "q": "Показывается ли MVRV на странице XRP?",
      "a": "Да. Общедоступный API CoinMetrics даёт MVRV для XRP, по нему рассчитывается Z-оценка. Однако из-за заранее выпущенного объёма и эскроу её лучше использовать как дополнение к другим индикаторам, а не читать по ориентирам биткоина. Если данных нет, отображается N/A, и оценка пересчитывается по оставшимся индикаторам."
     },
     {
      "q": "Стоит ли сейчас покупать Рипл (XRP)?",
      "a": "Эта страница не принимает инвестиционных решений за вас. Высокая оценка на долгосрочной вкладке (контртренд) означает, что сошлись сигналы перепроданности, страха и недооценки, а на краткосрочной вкладке (моментум) оценка растёт вместе с силой восходящего тренда. Судебные или регуляторные новости могут развернуть индикаторы XRP за один день, поэтому используйте оценку лишь как снимок текущего положения."
     },
     {
      "q": "Учитываются ли в оценке разблокировки из эскроу или судебные решения?",
      "a": "Нет. Оценка рассчитывается только по пяти ценовым индикаторам, индексу страха и жадности и MVRV. Влияние новостей проявляется в таких индикаторах, как RSI и MACD, лишь после того, как цена уже сдвинулась."
     },
     {
      "q": "Ripple и XRP — это одно и то же?",
      "a": "Строго говоря, нет. Ripple — американская компания, а XRP — собственный актив XRP Ledger. На этой странице анализируется цена XRP, по которой он торгуется на биржах."
     }
    ]
   },
   "nl": {
    "title": "XRP koopmoment-score: waar zeven indicatoren de koers nu plaatsen",
    "intro": "De XRP-pagina berekent uit de dollarkoers van XRP de RSI(14), de MACD(12·26·9), de Mayer Multiple, de daling vanaf de 365-daagse top en de 50/200-kruising, voegt daar de marktbrede angst- en hebzuchtindex en de MVRV Z-score van CoinMetrics aan toe en komt zo tot een score van 0 tot 100. Het resultaat verschijnt als STRONG BUY, ACCUMULATE, NEUTRAL, CAUTION of OVERHEATED; de totaalscore is gratis te bekijken.",
    "coinH": "Wat is XRP?",
    "coinP": [
     "XRP is de eigen munt van de XRP Ledger (XRPL). Die ledger is ontwikkeld door David Schwartz, Jed McCaleb en Arthur Britto en draait sinds 2012; het bedrijf dat datzelfde jaar werd opgericht, is het huidige Ripple. XRP wordt naar het bedrijf vaak ‘Ripple’ genoemd, maar strikt genomen is Ripple het bedrijf en XRP de munt.",
     "In plaats van mining of staking gebruikt de XRP Ledger consensus tussen validators die steunen op vertrouwde lijsten (UNL’s), en om de paar seconden wordt een nieuwe ledgerstand bevestigd. Alle 100 miljard XRP zijn bij de start in één keer aangemaakt en er komen er geen bij; XRP die aan transactiekosten wordt besteed, wordt vernietigd. In 2017 zette Ripple 55 miljard van zijn XRP in escrow, waaruit per maand maximaal 1 miljard vrijkomt. Ripple profileert XRP als brugmunt voor internationale betalingen en afwikkeling."
    ],
    "applyH": "De indicatoren toepassen op XRP",
    "apply": [
     "Sprongen door nieuws: XRP is al eens tientallen procenten op één dag bewogen na rechterlijke uitspraken of nieuws over noteringen en handelsstops op beurzen. Op zulke dagen schieten RSI en MACD naar extreme waarden; leg ze daarom naast de 50/200-trend in plaats van te vertrouwen op een signaal van een of twee dagen.",
     "Lange zijwaartse fases en daling: de 365-daagse daling wordt alleen gemeten ten opzichte van de top van het afgelopen jaar. Tijdens een lange zijwaartse fase kan die klein lijken terwijl de koers ver onder de recordkoers staat. Omgekeerd is na een steile stijging −50% snel bereikt – lees dat niet meteen als een zone voor ‘sterk kopen’.",
     "Angst- en hebzuchtindex: een aparte sentimentindex voor XRP bestaat niet. De getoonde waarde is de marktbrede index van Alternative.me, waarin Bitcoin zwaar weegt; goed of slecht nieuws dat alleen XRP raakt, zie je er dus niet in terug.",
     "Mayer Multiple: de drempels 0,8 en 2,4 ten opzichte van het 200-daags gemiddelde zijn vuistregels uit de Bitcoinmarkt. Bij een munt als XRP, die in korte tijd hard kan stijgen, loopt het 200-daags gemiddelde ver achter, waardoor de Mayer Multiple vlak na een rally kortstondig sterk kan uitschieten.",
     "MVRV Z-score: de communitydata van CoinMetrics bevatten de MVRV van XRP, dus die kan worden berekend. Maar alle XRP is vooraf zonder mining uitgegeven en een groot deel zit bij Ripple of in escrow, waardoor je MVRV moeilijk als ‘gemiddelde aankoopprijs’ kunt lezen zoals bij Bitcoin."
    ],
    "histH": "De koerscycli van XRP in het kort",
    "hist": [
     "2012–2013: de XRP Ledger ging live en er werden 100 miljard XRP aangemaakt; in 2013 veranderde het bedrijf zijn naam van OpenCoin in Ripple Labs.",
     "2017–2018: in de cryptobullmarkt schoot XRP omhoog naar een toenmalig record van ongeveer 3,40 dollar begin januari 2018, waarna de koers het grootste deel van dat jaar daalde.",
     "2020–2021: in december 2020 klaagde de Amerikaanse SEC Ripple en twee bestuurders aan wegens vermeende verkoop van niet-geregistreerde effecten; daarna schortten grote Amerikaanse beurzen de handel in XRP op.",
     "2023: in juli oordeelde een Amerikaanse rechter dat XRP die Ripple via beurzen verkocht zonder dat kopers wisten wie de verkoper was, geen beleggingscontracten waren. De koers schoot die dag flink omhoog en enkele beurzen die de handel hadden stilgelegd, namen XRP weer op.",
     "2024–2025: in november en december 2024 steeg XRP sterk en ging voor het eerst sinds begin 2018 weer boven 2 dollar; in 2025 trok de SEC haar hoger beroep in."
    ],
    "faq": [
     {
      "q": "Is er geen aparte angst- en hebzuchtindex voor XRP?",
      "a": "Nee. De index van Alternative.me beslaat de hele cryptomarkt en geeft veel gewicht aan Bitcoindata. Om dat duidelijk te maken, staat op de XRP-pagina naast de indexnaam het label ‘hele markt’."
     },
     {
      "q": "Toont de XRP-pagina MVRV?",
      "a": "Ja. De community-API van CoinMetrics levert de MVRV van XRP, waaruit de Z-score wordt berekend. Door de vooraf uitgegeven voorraad en de escrowstructuur kun je hem wel beter gebruiken als aanvulling op de andere indicatoren dan hem af te zetten tegen de Bitcoin-referentielijnen. Zonder data staat er N/A en wordt de score opnieuw berekend met de overige indicatoren."
     },
     {
      "q": "Is het nu een goed moment om XRP te kopen?",
      "a": "Deze pagina neemt geen beleggingsbeslissingen voor je. Een hoge score op het tabblad lange termijn (tegendraads) betekent dat signalen van oversold, angst en onderwaardering op één lijn liggen, terwijl het tabblad korte termijn (momentum) stijgt met de kracht van de opwaartse trend. Nieuws over rechtszaken of regelgeving kan de indicatoren van XRP binnen een dag doen omslaan, dus gebruik de score alleen als momentopname."
     },
     {
      "q": "Tellen vrijgaven uit escrow of rechterlijke uitspraken mee in de score?",
      "a": "Nee. De score wordt alleen berekend uit vijf koersgebaseerde indicatoren, de angst- en hebzuchtindex en MVRV. Het effect van nieuws verschijnt pas in indicatoren als RSI en MACD nadat de koers al is bewogen."
     },
     {
      "q": "Zijn Ripple en XRP hetzelfde?",
      "a": "Strikt genomen niet. Ripple is een Amerikaans bedrijf, XRP de eigen munt van de XRP Ledger. Deze pagina analyseert de koers van XRP zoals die op beurzen wordt verhandeld."
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
