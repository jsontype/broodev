/* 하단 SEO 본문 다국어 데이터 + 렌더러. index.html(광고) / member/index.html(구독자) 공유.
   언어 전환 시 window.renderSEO(lang) 호출 → section.seo 를 해당 언어로 다시 그림.
   기본 정적 HTML(한국어)은 무JS 크롤러용 폴백으로 남겨두고, JS 실행 시 현재 언어로 교체. */
(function () {
  var SEO = {
    ko: {
      title: '샌드박스 공포·탐욕 지수 & 매수 타이밍 점수',
      intro: '샌드박스 공포지수(공포·탐욕 지수, Fear & Greed Index)를 포함한 7개 실시간 지표를 합성해 “지금이 매수 타이밍인가?”를 0~100 점수로 보여주는 무료 대시보드입니다. 설치 없이 브라우저에서 바로 실행되며 13개 언어를 지원합니다.',
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
        { q: '공포지수가 낮으면 샌드박스을 사야 하나요?', a: '극단적 공포는 역사적으로 분할 매수 기회였던 경우가 많지만, 공포지수 하나만 보면 “떨어지는 칼날”을 잡을 위험이 있습니다. 본 점수는 RSI·MACD·마이어 배수·낙폭·이동평균 크로스를 함께 보고, 하락 추세에서는 점수를 보수적으로 낮춥니다.' },
        { q: '매수 타이밍 점수는 어떻게 계산되나요?', a: '7개 지표를 각각 0~100 부분점수로 환산해 가중 합성합니다. 결과는 0~100이며 5단계 밴드로 표시됩니다.' },
        { q: '무료인가요? 설치가 필요한가요?', a: '완전 무료이며 설치가 필요 없습니다. CoinGecko·Binance·Alternative.me 공개 API에서 실시간 데이터를 가져옵니다.' },
        { q: '공포지수와 매수 타이밍 점수는 무엇이 다른가요?', a: '공포지수는 심리 한 가지 지표(0~100)이고, 매수 타이밍 점수는 공포지수를 포함한 7개 지표를 합성한 종합 점수(0~100)입니다.' },
        { q: '공포지수 데이터는 어디서 가져오나요? 얼마나 자주 갱신되나요?', a: '공포·탐욕 지수는 Alternative.me, 가격·일봉은 CoinGecko·Binance, 온체인 지표는 CoinMetrics 공개 API에서 실시간으로 가져옵니다. 화면은 약 1분 주기로 자동 갱신됩니다.' },
        { q: '샌드박스 지금 사도 되나요?', a: '정답은 없지만, 매수 타이밍 점수(0~100)로 현재 시장이 과매도·공포 구간인지 과열·탐욕 구간인지 객관적으로 가늠할 수 있습니다. 장기(역발상) 탭 기준 점수가 높을수록 공포·저평가가 겹친 분할 매수 우호 구간, 낮을수록 과열 경계 구간입니다. 참고 신호일 뿐 투자 자문이 아닙니다.' },
        { q: '단기와 장기 매수 타이밍은 어떻게 다른가요?', a: '점수는 단기·장기 두 탭으로 나뉩니다. 단기(모멘텀)는 약 1~3개월 추세추종 관점으로 상승 추세가 강할수록 높고, 장기(역발상)는 약 1년 이상 사이클 관점으로 공포·저평가일수록 높습니다. 2017년 이후 백테스트에서 단기는 모멘텀, 장기는 역발상 방향이 더 잘 맞았습니다.' },
        { q: 'BOTTOM RADAR(바닥 점수)는 무엇인가요?', a: 'MVRV Z-점수 같은 온체인 지표로 시가총액이 투자자 평균 매수원가 대비 어디에 있는지 재서, 역사적 바닥 구간과의 근접도를 0~100으로 보여주는 보조 게이지입니다. 계산 근거는 “비트코인 바닥” 해설 페이지에 공개되어 있습니다.' }
      ],
      disclaimer: '⚠ 본 점수는 공개 지표를 합성한 참고 신호이며 투자 자문이 아닙니다. 모든 투자 판단과 책임은 이용자 본인에게 있습니다.'
    },
    en: {
      title: 'The Sandbox Fear & Greed Index & Buy-Timing Score',
      intro: 'A free dashboard that synthesizes 7 real-time indicators — including the The Sandbox Fear & Greed Index — into a 0–100 “is now a good time to buy?” score. Runs in your browser with no install, in 13 languages.',
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
        { q: 'Should I buy The Sandbox when the index is low?', a: 'Extreme fear has often been an accumulation opportunity, but relying on the index alone risks catching a falling knife. This score also weighs RSI, MACD, Mayer Multiple, drawdown and moving-average crosses, and lowers the score conservatively in downtrends.' },
        { q: 'How is the buy-timing score calculated?', a: 'Each of the 7 indicators is converted to a 0–100 sub-score and weighted together. The result is 0–100, shown in 5 bands.' },
        { q: 'Is it free? Do I need to install anything?', a: 'It is completely free with no install. Real-time data comes from CoinGecko, Binance and Alternative.me public APIs.' },
        { q: 'How is the index different from the buy-timing score?', a: 'The index is a single sentiment metric (0–100); the buy-timing score is a composite of 7 indicators including the index (0–100).' },
        { q: 'Where does the data come from, and how often does it refresh?', a: 'The Fear & Greed Index comes from Alternative.me, prices and daily candles from the CoinGecko and Binance public APIs, and on-chain metrics from CoinMetrics. The screen auto-refreshes roughly every minute.' },
        { q: 'Should I buy The Sandbox right now?', a: 'There is no single answer, but the buy-timing score (0–100) gives an objective read on whether the market is in an oversold/fear zone or an overheated/greed zone. On the long-term (contrarian) tab, higher scores mark zones where fear and undervaluation overlap — historically favorable for DCA — while lower scores warn of overheating. It is a reference signal, not investment advice.' },
        { q: 'How do short-term and long-term buy timing differ?', a: 'The score is split into two tabs. Short-term (momentum) takes a 1–3 month trend-following view and rises with strong uptrends; long-term (contrarian) takes a 1-year-plus cycle view and rises with fear and undervaluation. In backtests since 2017, momentum worked better short-term and contrarian worked better long-term.' },
        { q: 'What is the BOTTOM RADAR (bottom score)?', a: 'A secondary gauge that uses on-chain metrics such as the MVRV Z-Score to measure where market cap sits relative to investors’ average cost basis, showing proximity to historic bottom zones on a 0–100 scale. The full calculation is published on the “Bitcoin bottom” guide page.' }
      ],
      disclaimer: '⚠ This score is a reference signal built from public indicators, not investment advice. All decisions and responsibility are your own.'
    },
    ja: {
      title: 'サンドボックス 恐怖・強欲指数 & 買い時スコア',
      intro: 'サンドボックスの恐怖・強欲指数（Fear & Greed Index）を含む7つのリアルタイム指標を合成し、「今が買い時か？」を0〜100のスコアで示す無料ダッシュボードです。インストール不要でブラウザから即実行、13言語対応。',
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
        { q: '指数が低ければサンドボックスを買うべき？', a: '極端な恐怖は歴史的に分割買いの好機だったことが多いですが、指数だけに頼ると「落ちるナイフ」を掴む危険があります。本スコアはRSI・MACD・マイヤー倍率・下落率・移動平均クロスも合わせて見て、下落トレンドでは保守的にスコアを下げます。' },
        { q: '買い時スコアはどう計算される？', a: '7指標をそれぞれ0〜100の部分スコアに換算し加重合成します。結果は0〜100で、5段階バンドで表示します。' },
        { q: '無料？インストールは必要？', a: '完全無料・インストール不要です。CoinGecko・Binance・Alternative.me の公開APIからリアルタイムデータを取得します。' },
        { q: '指数と買い時スコアの違いは？', a: '指数は心理1指標(0〜100)、買い時スコアは指数を含む7指標を合成した総合スコア(0〜100)です。' },
        { q: 'データはどこから？更新頻度は？', a: '恐怖・強欲指数はAlternative.me、価格・日足はCoinGecko・Binance、オンチェーン指標はCoinMetricsの公開APIからリアルタイムで取得します。画面は約1分ごとに自動更新されます。' },
        { q: 'サンドボックスは今買ってもいい？', a: '正解はありませんが、買い時スコア(0〜100)で現在の市場が売られすぎ・恐怖圏か、過熱・強欲圏かを客観的に測れます。長期（逆張り）タブではスコアが高いほど恐怖と割安が重なる分割買いに有利な圏、低いほど過熱警戒圏です。参考シグナルであり投資助言ではありません。' },
        { q: '短期と長期の買い時はどう違う？', a: 'スコアは短期・長期の2タブに分かれます。短期（モメンタム）は約1〜3か月のトレンドフォロー視点で上昇トレンドが強いほど高く、長期（逆張り）は約1年以上のサイクル視点で恐怖・割安なほど高くなります。2017年以降のバックテストでは、短期はモメンタム、長期は逆張りの方向がより有効でした。' },
        { q: 'BOTTOM RADAR（底値スコア）とは？', a: 'MVRV Zスコアなどのオンチェーン指標で、時価総額が投資家の平均取得単価に対してどの位置にあるかを測り、歴史的な底値圏への近さを0〜100で示す補助ゲージです。計算根拠は「ビットコインの底」解説ページで公開しています。' }
      ],
      disclaimer: '⚠ 本スコアは公開指標を合成した参考シグナルであり、投資助言ではありません。すべての判断と責任は利用者ご自身にあります。'
    },
    zh: {
      title: '沙盒恐惧与贪婪指数 & 买入时机评分',
      intro: '一个免费仪表板，将包括沙盒恐惧与贪婪指数（Fear & Greed Index）在内的7个实时指标合成为0–100的“现在是买入时机吗？”评分。无需安装，浏览器即开即用，支持13种语言。',
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
        { q: '指数低就该买沙盒吗？', a: '极度恐惧在历史上常是分批买入良机，但只看指数有“接飞刀”的风险。本评分同时参考RSI、MACD、梅耶倍数、回撤与均线交叉，并在下跌趋势中保守下调评分。' },
        { q: '买入时机评分如何计算？', a: '将7个指标各自换算为0–100分项评分并加权合成。结果为0–100，以5档显示。' },
        { q: '免费吗？需要安装吗？', a: '完全免费、无需安装。实时数据来自 CoinGecko、Binance、Alternative.me 公开API。' },
        { q: '指数与买入时机评分有何不同？', a: '指数是单一情绪指标(0–100)；买入时机评分是包含该指数在内的7指标综合评分(0–100)。' },
        { q: '数据来自哪里？多久更新一次？', a: '恐惧与贪婪指数来自Alternative.me，价格与日K来自CoinGecko和Binance公开API，链上指标来自CoinMetrics。页面约每1分钟自动刷新。' },
        { q: '现在可以买沙盒吗？', a: '没有标准答案，但买入时机评分(0–100)能客观判断当前市场处于超卖·恐惧区还是过热·贪婪区。在长期（逆向）标签页中，评分越高代表恐惧与低估重叠、历史上利于分批买入的区间；越低则是过热警戒区。仅供参考，并非投资建议。' },
        { q: '短期和长期买入时机有何不同？', a: '评分分为短期、长期两个标签页。短期（动量）以约1–3个月的趋势跟随视角，上升趋势越强评分越高；长期（逆向）以约1年以上的周期视角，越恐惧、越低估评分越高。2017年以来的回测显示，短期动量、长期逆向的方向更有效。' },
        { q: 'BOTTOM RADAR（底部评分）是什么？', a: '一个辅助仪表，利用MVRV Z分数等链上指标衡量市值相对投资者平均持仓成本的位置，以0–100显示与历史底部区间的接近程度。计算依据在“比特币底部”解读页面公开。' }
      ],
      disclaimer: '⚠ 本评分由公开指标合成，仅供参考，并非投资建议。一切投资决定与责任由用户自负。'
    },
    'zh-Hant': {
      title: '沙盒恐懼與貪婪指數 & 買入時機評分',
      intro: '一個免費儀表板，將包括沙盒恐懼與貪婪指數（Fear & Greed Index）在內的7個即時指標合成為0–100的「現在是買入時機嗎？」評分。免安裝、瀏覽器即開即用，支援13種語言。',
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
        { q: '指數低就該買沙盒嗎？', a: '極度恐懼在歷史上常是分批買入良機，但只看指數有「接飛刀」的風險。本評分同時參考RSI、MACD、梅耶倍數、回撤與均線交叉，並在下跌趨勢中保守下調評分。' },
        { q: '買入時機評分如何計算？', a: '將7個指標各自換算為0–100分項評分並加權合成。結果為0–100，以5檔顯示。' },
        { q: '免費嗎？需要安裝嗎？', a: '完全免費、免安裝。即時資料來自 CoinGecko、Binance、Alternative.me 公開API。' },
        { q: '指數與買入時機評分有何不同？', a: '指數是單一情緒指標(0–100)；買入時機評分是包含該指數在內的7指標綜合評分(0–100)。' },
        { q: '資料來自哪裡？多久更新一次？', a: '恐懼與貪婪指數來自Alternative.me，價格與日K來自CoinGecko和Binance公開API，鏈上指標來自CoinMetrics。頁面約每1分鐘自動重新整理。' },
        { q: '現在可以買沙盒嗎？', a: '沒有標準答案，但買入時機評分(0–100)能客觀判斷當前市場處於超賣·恐懼區還是過熱·貪婪區。在長期（逆向）分頁中，評分越高代表恐懼與低估重疊、歷史上利於分批買入的區間；越低則是過熱警戒區。僅供參考，並非投資建議。' },
        { q: '短期和長期買入時機有何不同？', a: '評分分為短期、長期兩個分頁。短期（動量）以約1–3個月的趨勢跟隨視角，上升趨勢越強評分越高；長期（逆向）以約1年以上的週期視角，越恐懼、越低估評分越高。2017年以來的回測顯示，短期動量、長期逆向的方向更有效。' },
        { q: 'BOTTOM RADAR（底部評分）是什麼？', a: '一個輔助儀表，利用MVRV Z分數等鏈上指標衡量市值相對投資者平均持倉成本的位置，以0–100顯示與歷史底部區間的接近程度。計算依據在「比特幣底部」解說頁面公開。' }
      ],
      disclaimer: '⚠ 本評分由公開指標合成，僅供參考，並非投資建議。一切投資決定與責任由用戶自負。'
    },
    es: {
      title: 'Índice de miedo y codicia de The Sandbox y puntuación de momento de compra',
      intro: 'Un panel gratuito que sintetiza 7 indicadores en tiempo real —incluido el índice de miedo y codicia de The Sandbox— en una puntuación de 0 a 100 sobre «¿es buen momento para comprar?». Funciona en el navegador sin instalación, en 13 idiomas.',
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
        { q: '¿Debo comprar The Sandbox cuando el índice está bajo?', a: 'El miedo extremo ha sido a menudo una oportunidad de acumulación, pero fiarse solo del índice arriesga «atrapar un cuchillo que cae». Esta puntuación también pondera RSI, MACD, múltiplo de Mayer, caída y cruces de medias, y la reduce de forma conservadora en tendencias bajistas.' },
        { q: '¿Cómo se calcula la puntuación de compra?', a: 'Cada uno de los 7 indicadores se convierte en una subpuntuación de 0 a 100 y se pondera. El resultado es 0–100, mostrado en 5 bandas.' },
        { q: '¿Es gratis? ¿Necesito instalar algo?', a: 'Es totalmente gratis y sin instalación. Los datos en tiempo real provienen de las API públicas de CoinGecko, Binance y Alternative.me.' },
        { q: '¿En qué se diferencia el índice de la puntuación de compra?', a: 'El índice es una sola métrica de sentimiento (0–100); la puntuación de compra es un compuesto de 7 indicadores que incluye el índice (0–100).' },
        { q: '¿De dónde vienen los datos y con qué frecuencia se actualizan?', a: 'El índice de miedo y codicia viene de Alternative.me; los precios y velas diarias, de las API públicas de CoinGecko y Binance; y las métricas on-chain, de CoinMetrics. La pantalla se actualiza automáticamente cada minuto aproximadamente.' },
        { q: '¿Debería comprar The Sandbox ahora mismo?', a: 'No hay una respuesta única, pero la puntuación de compra (0–100) permite valorar objetivamente si el mercado está en zona de sobreventa/miedo o de recalentamiento/codicia. En la pestaña de largo plazo (contraria), puntuaciones altas marcan zonas donde coinciden miedo e infravaloración —históricamente favorables al DCA—, y las bajas avisan de recalentamiento. Es una señal de referencia, no asesoramiento de inversión.' },
        { q: '¿En qué se diferencian el timing de corto y de largo plazo?', a: 'La puntuación se divide en dos pestañas. El corto plazo (momentum) adopta una visión de seguimiento de tendencia de 1–3 meses y sube con tendencias alcistas fuertes; el largo plazo (contrario) adopta una visión de ciclo de más de un año y sube con miedo e infravaloración. En backtests desde 2017, el momentum funcionó mejor a corto y lo contrario a largo.' },
        { q: '¿Qué es el BOTTOM RADAR (puntuación de suelo)?', a: 'Un indicador auxiliar que usa métricas on-chain como el MVRV Z-Score para medir dónde está la capitalización respecto al coste medio de los inversores, mostrando la cercanía a zonas de suelo históricas en una escala de 0 a 100. El cálculo completo está publicado en la guía «suelo de Bitcoin».' }
      ],
      disclaimer: '⚠ Esta puntuación es una señal de referencia a partir de indicadores públicos, no asesoramiento de inversión. Todas las decisiones y la responsabilidad son tuyas.'
    },
    fr: {
      title: 'Indice de peur et d’avidité The Sandbox et score de timing d’achat',
      intro: 'Un tableau de bord gratuit qui synthétise 7 indicateurs en temps réel — dont l’indice de peur et d’avidité The Sandbox — en un score de 0 à 100 « est-ce le bon moment pour acheter ? ». Fonctionne dans le navigateur sans installation, en 13 langues.',
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
        { q: 'Dois-je acheter du The Sandbox quand l’indice est bas ?', a: 'La peur extrême a souvent été une opportunité d’accumulation, mais se fier au seul indice risque d’« attraper un couteau qui tombe ». Ce score pondère aussi RSI, MACD, multiple de Mayer, repli et croisements de moyennes, et le réduit prudemment en tendance baissière.' },
        { q: 'Comment le score de timing d’achat est-il calculé ?', a: 'Chacun des 7 indicateurs est converti en sous-score de 0 à 100 puis pondéré. Le résultat est 0–100, affiché en 5 bandes.' },
        { q: 'Est-ce gratuit ? Faut-il installer quelque chose ?', a: 'C’est entièrement gratuit et sans installation. Les données en temps réel proviennent des API publiques de CoinGecko, Binance et Alternative.me.' },
        { q: 'Quelle différence entre l’indice et le score de timing d’achat ?', a: 'L’indice est une seule mesure de sentiment (0–100) ; le score de timing d’achat est un composite de 7 indicateurs incluant l’indice (0–100).' },
        { q: 'D’où viennent les données et à quelle fréquence sont-elles actualisées ?', a: 'L’indice de peur et d’avidité vient d’Alternative.me ; les prix et bougies journalières, des API publiques de CoinGecko et Binance ; et les métriques on-chain, de CoinMetrics. L’écran se rafraîchit automatiquement environ chaque minute.' },
        { q: 'Dois-je acheter du The Sandbox maintenant ?', a: 'Il n’y a pas de réponse unique, mais le score de timing d’achat (0–100) permet d’évaluer objectivement si le marché est en zone de survente/peur ou de surchauffe/avidité. Dans l’onglet long terme (contrarian), des scores élevés marquent des zones où peur et sous-évaluation se recoupent — historiquement favorables au DCA — tandis que des scores bas signalent la surchauffe. C’est un signal de référence, pas un conseil en investissement.' },
        { q: 'Quelle différence entre le timing court terme et long terme ?', a: 'Le score est divisé en deux onglets. Le court terme (momentum) adopte une vue de suivi de tendance sur 1 à 3 mois et monte avec les tendances haussières fortes ; le long terme (contrarian) adopte une vue de cycle d’un an et plus et monte avec la peur et la sous-évaluation. Dans les backtests depuis 2017, le momentum a mieux fonctionné à court terme et le contrarian à long terme.' },
        { q: 'Qu’est-ce que le BOTTOM RADAR (score de plancher) ?', a: 'Une jauge auxiliaire qui utilise des métriques on-chain comme le MVRV Z-Score pour mesurer où se situe la capitalisation par rapport au coût moyen des investisseurs, en montrant la proximité des zones de plancher historiques sur une échelle de 0 à 100. Le calcul complet est publié sur la page « plancher du Bitcoin ».' }
      ],
      disclaimer: '⚠ Ce score est un signal de référence issu d’indicateurs publics, pas un conseil en investissement. Toutes les décisions et la responsabilité vous appartiennent.'
    },
    de: {
      title: 'The Sandbox Angst- & Gier-Index & Kaufzeitpunkt-Score',
      intro: 'Ein kostenloses Dashboard, das 7 Echtzeit-Indikatoren — inkl. The Sandbox Angst- & Gier-Index — zu einem 0–100-Score „Ist jetzt ein guter Kaufzeitpunkt?“ zusammenführt. Läuft im Browser ohne Installation, in 13 Sprachen.',
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
        { q: 'Soll ich The Sandbox kaufen, wenn der Index niedrig ist?', a: 'Extreme Angst war historisch oft eine Akkumulationschance, doch sich allein auf den Index zu verlassen, birgt das Risiko, „ins fallende Messer zu greifen“. Dieser Score gewichtet auch RSI, MACD, Mayer-Multiple, Rückgang und MA-Kreuzungen und senkt den Wert in Abwärtstrends konservativ.' },
        { q: 'Wie wird der Kaufzeitpunkt-Score berechnet?', a: 'Jeder der 7 Indikatoren wird in einen 0–100-Teil-Score umgerechnet und gewichtet. Das Ergebnis ist 0–100, in 5 Bändern dargestellt.' },
        { q: 'Ist es kostenlos? Muss ich etwas installieren?', a: 'Es ist völlig kostenlos und ohne Installation. Echtzeitdaten stammen aus den öffentlichen APIs von CoinGecko, Binance und Alternative.me.' },
        { q: 'Wie unterscheidet sich der Index vom Kaufzeitpunkt-Score?', a: 'Der Index ist eine einzelne Stimmungskennzahl (0–100); der Kaufzeitpunkt-Score ist ein Verbund aus 7 Indikatoren inkl. Index (0–100).' },
        { q: 'Woher stammen die Daten und wie oft werden sie aktualisiert?', a: 'Der Angst- & Gier-Index stammt von Alternative.me, Preise und Tageskerzen von den öffentlichen APIs von CoinGecko und Binance, On-Chain-Metriken von CoinMetrics. Der Bildschirm aktualisiert sich etwa jede Minute automatisch.' },
        { q: 'Sollte ich The Sandbox jetzt kaufen?', a: 'Eine eindeutige Antwort gibt es nicht, aber der Kaufzeitpunkt-Score (0–100) zeigt objektiv, ob der Markt in einer überverkauften Angst-Zone oder einer überhitzten Gier-Zone steckt. Auf dem Langfrist-Tab (antizyklisch) markieren hohe Werte Zonen, in denen Angst und Unterbewertung zusammenfallen — historisch günstig für DCA —, niedrige warnen vor Überhitzung. Ein Referenzsignal, keine Anlageberatung.' },
        { q: 'Wie unterscheiden sich kurz- und langfristiges Kauftiming?', a: 'Der Score ist in zwei Tabs geteilt. Kurzfristig (Momentum) folgt einer Trendfolge-Sicht von 1–3 Monaten und steigt mit starken Aufwärtstrends; langfristig (antizyklisch) folgt einer Zyklus-Sicht von über einem Jahr und steigt mit Angst und Unterbewertung. In Backtests seit 2017 funktionierte kurzfristig Momentum und langfristig die antizyklische Richtung besser.' },
        { q: 'Was ist der BOTTOM RADAR (Boden-Score)?', a: 'Eine Zusatzanzeige, die mit On-Chain-Metriken wie den MVRV Z-Score misst, wo die Marktkapitalisierung relativ zum durchschnittlichen Einstandskurs der Anleger liegt, und die Nähe zu historischen Bodenzonen auf einer Skala von 0–100 zeigt. Die vollständige Berechnung ist auf der Seite „Bitcoin-Boden“ veröffentlicht.' }
      ],
      disclaimer: '⚠ Dieser Score ist ein Referenzsignal aus öffentlichen Indikatoren, keine Anlageberatung. Alle Entscheidungen und die Verantwortung liegen bei Ihnen.'
    },
    it: {
      title: 'Indice di paura e avidità The Sandbox e punteggio di timing d’acquisto',
      intro: 'Una dashboard gratuita che sintetizza 7 indicatori in tempo reale — incluso l’indice di paura e avidità di The Sandbox — in un punteggio 0–100 «è il momento giusto per comprare?». Funziona nel browser senza installazione, in 13 lingue.',
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
        { q: 'Dovrei comprare The Sandbox quando l’indice è basso?', a: 'La paura estrema è stata spesso un’occasione di accumulo, ma affidarsi solo all’indice rischia di «prendere un coltello che cade». Questo punteggio pesa anche RSI, MACD, multiplo di Mayer, ribasso e incroci di medie, e lo riduce in modo prudente nei trend ribassisti.' },
        { q: 'Come si calcola il punteggio d’acquisto?', a: 'Ciascuno dei 7 indicatori è convertito in un sotto-punteggio 0–100 e ponderato. Il risultato è 0–100, mostrato in 5 bande.' },
        { q: 'È gratis? Serve installare qualcosa?', a: 'È completamente gratis e senza installazione. I dati in tempo reale provengono dalle API pubbliche di CoinGecko, Binance e Alternative.me.' },
        { q: 'Che differenza c’è tra l’indice e il punteggio d’acquisto?', a: 'L’indice è una singola misura di sentiment (0–100); il punteggio d’acquisto è un composito dei 7 indicatori incluso l’indice (0–100).' },
        { q: 'Da dove vengono i dati e con che frequenza si aggiornano?', a: 'L’indice di paura e avidità viene da Alternative.me; prezzi e candele giornaliere dalle API pubbliche di CoinGecko e Binance; le metriche on-chain da CoinMetrics. Lo schermo si aggiorna automaticamente circa ogni minuto.' },
        { q: 'Dovrei comprare The Sandbox adesso?', a: 'Non c’è una risposta unica, ma il punteggio d’acquisto (0–100) permette di valutare oggettivamente se il mercato è in zona ipervenduto/paura o surriscaldato/avidità. Nella scheda a lungo termine (contrarian), punteggi alti indicano zone in cui paura e sottovalutazione coincidono — storicamente favorevoli al PAC — mentre punteggi bassi avvertono del surriscaldamento. È un segnale di riferimento, non consulenza d’investimento.' },
        { q: 'Che differenza c’è tra timing a breve e a lungo termine?', a: 'Il punteggio è diviso in due schede. Il breve termine (momentum) adotta una visione trend-following di 1–3 mesi e sale con trend rialzisti forti; il lungo termine (contrarian) adotta una visione di ciclo oltre l’anno e sale con paura e sottovalutazione. Nei backtest dal 2017, il momentum ha funzionato meglio nel breve e il contrarian nel lungo.' },
        { q: 'Cos’è il BOTTOM RADAR (punteggio di minimo)?', a: 'Un indicatore ausiliario che usa metriche on-chain come l’MVRV Z-Score per misurare dove si trova la capitalizzazione rispetto al costo medio degli investitori, mostrando la vicinanza alle zone di minimo storiche su una scala 0–100. Il calcolo completo è pubblicato nella guida «minimo di Bitcoin».' }
      ],
      disclaimer: '⚠ Questo punteggio è un segnale di riferimento da indicatori pubblici, non consulenza d’investimento. Ogni decisione e responsabilità è tua.'
    },
    pt: {
      title: 'Índice de medo e ganância do The Sandbox e pontuação de momento de compra',
      intro: 'Um painel gratuito que sintetiza 7 indicadores em tempo real — incluindo o índice de medo e ganância do The Sandbox — numa pontuação de 0 a 100 «é uma boa hora para comprar?». Roda no navegador sem instalação, em 13 idiomas.',
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
        { q: 'Devo comprar The Sandbox quando o índice está baixo?', a: 'O medo extremo foi muitas vezes uma oportunidade de acumulação, mas confiar só no índice arrisca «pegar uma faca caindo». Esta pontuação também pondera RSI, MACD, múltiplo de Mayer, queda e cruzamentos de médias, e a reduz de forma conservadora em tendências de baixa.' },
        { q: 'Como a pontuação de compra é calculada?', a: 'Cada um dos 7 indicadores é convertido numa subpontuação de 0 a 100 e ponderado. O resultado é 0–100, em 5 faixas.' },
        { q: 'É grátis? Preciso instalar algo?', a: 'É totalmente grátis e sem instalação. Os dados em tempo real vêm das APIs públicas da CoinGecko, Binance e Alternative.me.' },
        { q: 'Qual a diferença entre o índice e a pontuação de compra?', a: 'O índice é uma única métrica de sentimento (0–100); a pontuação de compra é um composto de 7 indicadores incluindo o índice (0–100).' },
        { q: 'De onde vêm os dados e com que frequência são atualizados?', a: 'O índice de medo e ganância vem da Alternative.me; preços e velas diárias, das APIs públicas da CoinGecko e da Binance; e as métricas on-chain, da CoinMetrics. A tela atualiza automaticamente a cada minuto, aproximadamente.' },
        { q: 'Devo comprar The Sandbox agora?', a: 'Não há resposta única, mas a pontuação de compra (0–100) permite avaliar objetivamente se o mercado está em zona de sobrevenda/medo ou de superaquecimento/ganância. Na aba de longo prazo (contrária), pontuações altas marcam zonas onde medo e subvalorização coincidem — historicamente favoráveis ao DCA —, e as baixas alertam para superaquecimento. É um sinal de referência, não consultoria de investimento.' },
        { q: 'Qual a diferença entre o timing de curto e de longo prazo?', a: 'A pontuação divide-se em duas abas. O curto prazo (momentum) adota uma visão de seguimento de tendência de 1–3 meses e sobe com tendências de alta fortes; o longo prazo (contrário) adota uma visão de ciclo de mais de um ano e sobe com medo e subvalorização. Em backtests desde 2017, o momentum funcionou melhor no curto e o contrário no longo.' },
        { q: 'O que é o BOTTOM RADAR (pontuação de fundo)?', a: 'Um medidor auxiliar que usa métricas on-chain como o MVRV Z-Score para medir onde a capitalização está em relação ao custo médio dos investidores, mostrando a proximidade de zonas de fundo históricas numa escala de 0 a 100. O cálculo completo está publicado no guia «fundo do Bitcoin».' }
      ],
      disclaimer: '⚠ Esta pontuação é um sinal de referência a partir de indicadores públicos, não é consultoria de investimento. Todas as decisões e a responsabilidade são suas.'
    },
    ru: {
      title: 'Индекс страха и жадности сэндбокса и оценка времени покупки',
      intro: 'Бесплатная панель, которая объединяет 7 индикаторов в реальном времени — включая индекс страха и жадности сэндбокса — в оценку от 0 до 100 «подходящее ли сейчас время для покупки?». Работает в браузере без установки, на 13 языках.',
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
        { q: 'Покупать ли сэндбокс, когда индекс низкий?', a: 'Крайний страх исторически часто был возможностью накопления, но полагаться только на индекс рискованно — можно «поймать падающий нож». Эта оценка также учитывает RSI, MACD, множитель Майера, просадку и пересечения средних и консервативно снижается в нисходящих трендах.' },
        { q: 'Как рассчитывается оценка покупки?', a: 'Каждый из 7 индикаторов переводится в частную оценку 0–100 и взвешивается. Результат — 0–100, в 5 диапазонах.' },
        { q: 'Это бесплатно? Нужно ли что-то устанавливать?', a: 'Полностью бесплатно и без установки. Данные в реальном времени берутся из публичных API CoinGecko, Binance и Alternative.me.' },
        { q: 'Чем индекс отличается от оценки покупки?', a: 'Индекс — одна метрика настроения (0–100); оценка покупки — составной показатель из 7 индикаторов, включая индекс (0–100).' },
        { q: 'Откуда берутся данные и как часто они обновляются?', a: 'Индекс страха и жадности — с Alternative.me; цены и дневные свечи — из публичных API CoinGecko и Binance; ончейн-метрики — из CoinMetrics. Экран автоматически обновляется примерно раз в минуту.' },
        { q: 'Стоит ли покупать сэндбокс прямо сейчас?', a: 'Единственно верного ответа нет, но оценка покупки (0–100) объективно показывает, находится ли рынок в зоне перепроданности/страха или перегрева/жадности. На вкладке долгосрочного (контртрендового) взгляда высокие значения отмечают зоны, где совпадают страх и недооценка — исторически благоприятные для усреднения, — а низкие предупреждают о перегреве. Это справочный сигнал, а не инвестиционная рекомендация.' },
        { q: 'Чем отличаются краткосрочный и долгосрочный тайминг?', a: 'Оценка разделена на две вкладки. Краткосрочная (моментум) использует трендследящий взгляд на 1–3 месяца и растёт при сильных восходящих трендах; долгосрочная (контртренд) — циклический взгляд от года и растёт при страхе и недооценке. В бэктестах с 2017 года на коротком горизонте лучше работал моментум, на длинном — контртренд.' },
        { q: 'Что такое BOTTOM RADAR (оценка дна)?', a: 'Вспомогательный индикатор, который с помощью ончейн-метрик, таких как MVRV Z-оценка, измеряет положение капитализации относительно средней цены входа инвесторов и показывает близость к историческим зонам дна по шкале 0–100. Полный расчёт опубликован на странице «дно биткоина».' }
      ],
      disclaimer: '⚠ Эта оценка — справочный сигнал на основе публичных индикаторов, а не инвестиционная рекомендация. Все решения и ответственность — на вас.'
    },
    nl: {
      title: 'The Sandbox Angst- & Hebzucht-index en koopmoment-score',
      intro: 'Een gratis dashboard dat 7 realtime indicatoren — inclusief de The Sandbox Angst- & Hebzucht-index — samenvoegt tot een score van 0–100 voor «is het nu een goed moment om te kopen?». Draait in de browser zonder installatie, in 13 talen.',
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
        { q: 'Moet ik The Sandbox kopen als de index laag is?', a: 'Extreme angst was vaak een accumulatiekans, maar alleen op de index vertrouwen riskeert «een vallend mes te vangen». Deze score weegt ook RSI, MACD, Mayer Multiple, daling en gemiddelde-kruisingen mee, en verlaagt de score behoudend in dalende trends.' },
        { q: 'Hoe wordt de koopmoment-score berekend?', a: 'Elk van de 7 indicatoren wordt omgezet naar een deelscore van 0–100 en gewogen. Het resultaat is 0–100, in 5 banden.' },
        { q: 'Is het gratis? Moet ik iets installeren?', a: 'Het is volledig gratis en zonder installatie. Realtime data komt van de publieke API’s van CoinGecko, Binance en Alternative.me.' },
        { q: 'Wat is het verschil tussen de index en de koopmoment-score?', a: 'De index is één sentimentmaatstaf (0–100); de koopmoment-score is een samenstelling van 7 indicatoren inclusief de index (0–100).' },
        { q: 'Waar komen de gegevens vandaan en hoe vaak worden ze ververst?', a: 'De Angst- & Hebzucht-index komt van Alternative.me; prijzen en dagcandles van de publieke API’s van CoinGecko en Binance; on-chain-metrieken van CoinMetrics. Het scherm ververst ongeveer elke minuut automatisch.' },
        { q: 'Moet ik nu The Sandbox kopen?', a: 'Er is geen eenduidig antwoord, maar de koopmoment-score (0–100) geeft een objectief beeld of de markt in een oversold/angst-zone of een oververhitte/hebzucht-zone zit. Op het langetermijn-tabblad (tegendraads) markeren hoge scores zones waar angst en onderwaardering samenvallen — historisch gunstig voor DCA — terwijl lage scores waarschuwen voor oververhitting. Het is een referentiesignaal, geen beleggingsadvies.' },
        { q: 'Hoe verschillen korte- en langetermijn-kooptiming?', a: 'De score is verdeeld over twee tabbladen. Korte termijn (momentum) hanteert een trendvolgende blik van 1–3 maanden en stijgt bij sterke opwaartse trends; lange termijn (tegendraads) hanteert een cyclusblik van ruim een jaar en stijgt bij angst en onderwaardering. In backtests sinds 2017 werkte momentum beter op korte termijn en tegendraads beter op lange termijn.' },
        { q: 'Wat is de BOTTOM RADAR (bodemscore)?', a: 'Een hulpmeter die met on-chain-metrieken zoals de MVRV Z-score meet waar de marktkapitalisatie staat ten opzichte van de gemiddelde kostprijs van beleggers, en de nabijheid van historische bodemzones toont op een schaal van 0–100. De volledige berekening staat op de pagina «Bitcoin-bodem».' }
      ],
      disclaimer: '⚠ Deze score is een referentiesignaal uit publieke indicatoren, geen beleggingsadvies. Alle beslissingen en verantwoordelijkheid zijn van uzelf.'
    },
    th: {
      title: 'ดัชนีความกลัวและความโลภแซนด์บ็อกซ์ และคะแนนจังหวะซื้อ',
      intro: 'แดชบอร์ดฟรีที่รวม 7 ตัวชี้วัดแบบเรียลไทม์ — รวมถึงดัชนีความกลัวและความโลภของแซนด์บ็อกซ์ — เป็นคะแนน 0–100 ว่า “ตอนนี้เป็นจังหวะซื้อหรือไม่?” ใช้งานในเบราว์เซอร์ได้ทันที ไม่ต้องติดตั้ง รองรับ 13 ภาษา',
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
        { q: 'ถ้าดัชนีต่ำควรซื้อแซนด์บ็อกซ์ไหม?', a: 'ความกลัวสุดขีดในอดีตมักเป็นโอกาสทยอยซื้อ แต่ดูเพียงดัชนีอย่างเดียวเสี่ยง “รับมีดที่กำลังตก” คะแนนนี้ยังพิจารณา RSI, MACD, Mayer Multiple, การย่อ และการตัดกันของเส้นเฉลี่ย และลดคะแนนอย่างระมัดระวังในแนวโน้มขาลง' },
        { q: 'คะแนนจังหวะซื้อคำนวณอย่างไร?', a: 'แปลงแต่ละตัวชี้วัดทั้ง 7 เป็นคะแนนย่อย 0–100 แล้วถ่วงน้ำหนักรวมกัน ผลลัพธ์คือ 0–100 แสดงเป็น 5 ระดับ' },
        { q: 'ฟรีไหม? ต้องติดตั้งไหม?', a: 'ฟรีทั้งหมดและไม่ต้องติดตั้ง ข้อมูลเรียลไทม์มาจาก API สาธารณะของ CoinGecko, Binance และ Alternative.me' },
        { q: 'ดัชนีกับคะแนนจังหวะซื้อต่างกันอย่างไร?', a: 'ดัชนีเป็นตัวชี้วัดอารมณ์เดียว (0–100); คะแนนจังหวะซื้อเป็นคะแนนรวมจาก 7 ตัวชี้วัดรวมถึงดัชนี (0–100)' },
        { q: 'ข้อมูลมาจากไหน อัปเดตบ่อยแค่ไหน?', a: 'ดัชนีความกลัว-ความโลภมาจาก Alternative.me ราคาและแท่งเทียนรายวันมาจาก API สาธารณะของ CoinGecko และ Binance ส่วนตัวชี้วัดออนเชนมาจาก CoinMetrics หน้าจออัปเดตอัตโนมัติราวทุก 1 นาที' },
        { q: 'ตอนนี้ควรซื้อแซนด์บ็อกซ์ไหม?', a: 'ไม่มีคำตอบตายตัว แต่คะแนนจังหวะซื้อ (0–100) ช่วยประเมินอย่างเป็นกลางว่าตลาดอยู่ในโซนขายมากเกิน/ความกลัว หรือโซนร้อนแรง/ความโลภ ในแท็บระยะยาว (สวนตลาด) คะแนนยิ่งสูงหมายถึงโซนที่ความกลัวและราคาต่ำกว่ามูลค่าทับซ้อนกัน ซึ่งในอดีตเอื้อต่อ DCA ส่วนคะแนนต่ำเตือนถึงความร้อนแรง เป็นเพียงสัญญาณอ้างอิง ไม่ใช่คำแนะนำการลงทุน' },
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
  /* 푸터 설명 문단(.foot-desc) — 샌드박스 언급이 있어 공통 foot-i18n.js 가 아니라 여기에 둔다 */
  var FOOT_DESC = {
    ko: 'broodev는 설치 없이 브라우저에서 바로 쓰는 무료 웹앱을 만드는 앱 포트폴리오입니다. 이 페이지의 샌드박스 공포·탐욕 지수와 매수 타이밍 점수는 공개 지표를 합성한 참고 정보이며 투자 자문이 아닙니다. 광고는 Google AdSense를 통해 게재될 수 있습니다.',
    en: 'broodev is a portfolio of free web apps that run right in your browser with no install. The The Sandbox Fear & Greed Index and buy-timing score on this page are reference information synthesized from public indicators, not investment advice. Ads may be served through Google AdSense.',
    ja: 'broodevは、インストール不要でブラウザからすぐ使える無料Webアプリを作るアプリポートフォリオです。このページのサンドボックス恐怖・強欲指数と買い時スコアは公開指標を合成した参考情報であり、投資助言ではありません。広告はGoogle AdSenseを通じて掲載される場合があります。',
    zh: 'broodev 是一个应用作品集，制作无需安装、在浏览器中即可直接使用的免费网页应用。本页的沙盒恐惧与贪婪指数和买入时机评分是综合公开指标得出的参考信息，不构成投资建议。广告可能通过 Google AdSense 投放。',
    'zh-Hant': 'broodev 是一個應用作品集，製作無需安裝、在瀏覽器中即可直接使用的免費網頁應用。本頁的沙盒恐懼與貪婪指數和買入時機評分是綜合公開指標得出的參考資訊，不構成投資建議。廣告可能透過 Google AdSense 刊登。',
    th: 'broodev คือพอร์ตโฟลิโอแอปที่สร้างเว็บแอปฟรีซึ่งใช้งานได้ทันทีในเบราว์เซอร์โดยไม่ต้องติดตั้ง ดัชนีความกลัว-ความโลภแซนด์บ็อกซ์และคะแนนจังหวะซื้อในหน้านี้เป็นข้อมูลอ้างอิงที่สังเคราะห์จากตัวชี้วัดสาธารณะ ไม่ใช่คำแนะนำการลงทุน โฆษณาอาจแสดงผ่าน Google AdSense',
    es: 'broodev es un portafolio de aplicaciones web gratuitas que funcionan directamente en el navegador, sin instalación. El Índice de Miedo y Codicia de The Sandbox y la puntuación de momento de compra de esta página son información de referencia elaborada a partir de indicadores públicos, no asesoramiento de inversión. Los anuncios pueden mostrarse a través de Google AdSense.',
    fr: 'broodev est un portfolio d’applications web gratuites qui s’utilisent directement dans le navigateur, sans installation. L’indice Peur & Avidité du The Sandbox et le score de timing d’achat de cette page sont des informations de référence issues d’indicateurs publics, et non un conseil en investissement. Des annonces peuvent être diffusées via Google AdSense.',
    de: 'broodev ist ein Portfolio kostenloser Web-Apps, die ohne Installation direkt im Browser laufen. Der The Sandbox-Angst-und-Gier-Index und der Kauf-Timing-Score auf dieser Seite sind aus öffentlichen Indikatoren zusammengesetzte Referenzinformationen und keine Anlageberatung. Werbung kann über Google AdSense ausgeliefert werden.',
    it: 'broodev è un portfolio di web app gratuite che funzionano direttamente nel browser, senza installazione. L’Indice di Paura e Avidità di The Sandbox e il punteggio di timing d’acquisto in questa pagina sono informazioni di riferimento ricavate da indicatori pubblici, non una consulenza di investimento. Gli annunci possono essere pubblicati tramite Google AdSense.',
    pt: 'O broodev é um portefólio de aplicações web gratuitas que funcionam diretamente no navegador, sem instalação. O Índice de Medo e Ganância do The Sandbox e a pontuação de momento de compra desta página são informação de referência sintetizada a partir de indicadores públicos, não aconselhamento de investimento. Os anúncios podem ser apresentados através do Google AdSense.',
    ru: 'broodev — это портфолио бесплатных веб-приложений, которые работают прямо в браузере без установки. Индекс страха и жадности сэндбокса и оценка момента покупки на этой странице — справочная информация, собранная из открытых индикаторов, а не инвестиционная рекомендация. Реклама может показываться через Google AdSense.',
    nl: 'broodev is een portfolio van gratis webapps die zonder installatie direct in je browser werken. De The Sandbox Angst- en Hebzuchtindex en de koop-timingscore op deze pagina zijn referentie-informatie samengesteld uit openbare indicatoren, geen beleggingsadvies. Advertenties kunnen via Google AdSense worden getoond.'
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
    "title": "The Sandbox (SAND) buy-timing score and Fear & Greed Index",
    "intro": "This page takes The Sandbox (SAND) daily prices, computes RSI(14), MACD(12·26·9), the Mayer Multiple, the drawdown from the 365-day high and the 50/200 golden/death cross, and combines them with the market-wide Fear & Greed Index into a 0–100 buy-timing score shown in five bands from STRONG BUY to OVERHEATED. The seventh indicator, MVRV Z-Score, shows N/A because CoinMetrics has no SAND data, so the score is built from the remaining indicators. Today's score is free to view.",
    "coinH": "What is The Sandbox (SAND)?",
    "coinP": [
     "The Sandbox is a metaverse gaming platform where users build and trade voxel avatars, items and games. It began as a 2012 mobile game by Pixowl and was rebuilt on the blockchain after Animoca Brands acquired Pixowl in 2018. SAND is an ERC-20 token on Ethereum, so it has no consensus mechanism of its own; its transactions are secured by Ethereum, which has used proof of stake since the September 2022 Merge.",
     "SAND has a fixed maximum supply of 3 billion tokens and reached the market through a Binance Launchpad sale in August 2020. It is used to buy and sell LAND parcels and items on the platform, and for staking and governance votes. LAND is capped at 166,464 parcels. Tokens allocated to the team, the company and other holders unlock on a set vesting schedule, which has steadily increased the circulating supply."
    ],
    "applyH": "Applying the indicators to The Sandbox",
    "apply": [
     "Volatility: SAND's daily swings are far larger than Bitcoin's, so RSI often drops below 30 or climbs above 70. Rather than acting on a single oversold or overbought reading, check it against the MACD turn and the 50/200 trend.",
     "Fear & Greed: there is no SAND-specific index. The value shown is Alternative.me's Bitcoin-centric gauge of the whole crypto market, so news that only affects SAND, such as metaverse or gaming-sector headlines, is not reflected in it.",
     "MVRV Z-Score: CoinMetrics community data does not cover SAND, so this card shows N/A. The score reweights the other six indicators, which means you cannot confirm an on-chain cost-basis bottom on this page.",
     "Mayer Multiple and drawdown: thresholds such as below 0.8 for a strong buy, above 2.4 for overheating and a -50% drawdown come from Bitcoin's history. In a long downtrend the 365-day drawdown can stay deeper than -50% for months, so a deep drawdown alone does not make SAND cheap.",
     "Supply changes: the buy-timing score uses price only. Scheduled vesting unlocks that add to the circulating supply never appear in the indicators, so check them separately."
    ],
    "histH": "The Sandbox price cycle summary",
    "hist": [
     "August 2020 — SAND began trading after its Binance Launchpad sale.",
     "October–November 2021 — after Facebook renamed itself Meta, the metaverse theme took off and SAND hit its all-time high in late November. Alpha Season 1 opened on the 29th of that month.",
     "2022 — in the crypto bear market SAND fell more than 90% from its peak.",
     "2023–2024 — even during market-wide rebounds, the price stayed far below its 2021 high."
    ],
    "faq": [
     {
      "q": "Is there a separate Fear & Greed Index for The Sandbox?",
      "a": "No. There is no Fear & Greed Index built just for The Sandbox. The value on this page is the market-wide, Bitcoin-centric index that Alternative.me publishes daily, which is why the screen labels it as market-wide. Use price indicators such as RSI and MACD to read SAND's own movement."
     },
     {
      "q": "Does The Sandbox show MVRV?",
      "a": "No. MVRV Z-Score relies on CoinMetrics community data, which had no SAND entry as of October 2026. The card shows N/A and the buy-timing score is calculated from the indicators that remain."
     },
     {
      "q": "Should I buy The Sandbox now?",
      "a": "This page makes no buy or sell call on SAND. The score only shows where the current mix of indicators sits against historical thresholds. On the default long-term (contrarian) tab it rises as fear, oversold readings and deep drawdowns stack up; on the short-term (momentum) tab it rises with a stronger uptrend. If the two tabs disagree, the reading depends on your time horizon."
     },
     {
      "q": "Does a drawdown deeper than -50% mean SAND is cheap?",
      "a": "Not necessarily. The drawdown is just the gap between the highest price of the last 365 days and today's price, and it can keep deepening while a downtrend lasts. For a volatile token like SAND, read it together with MACD and the 50/200 trend."
     },
     {
      "q": "Are token unlocks and other supply changes reflected in the score?",
      "a": "No. The score is calculated only from daily prices and the market-wide Fear & Greed Index, so vesting unlock dates and project news need to be checked separately."
     },
     {
      "q": "Why does the SAND score often move like the Bitcoin score?",
      "a": "Both pages use the same Fear & Greed input, and SAND's price often follows Bitcoin and the wider market. Differences come mainly from indicators calculated on SAND's own price, such as RSI, MACD and the Mayer Multiple."
     }
    ]
   },
   "ja": {
    "title": "サンドボックス(SAND)の買い時スコアと恐怖・強欲指数",
    "intro": "この画面では、サンドボックス(SAND)の日足価格からRSI(14)、MACD(12・26・9)、メイヤー倍率、365日高値からの下落率、50/200ゴールデン・デッドクロスを計算し、暗号資産市場全体の恐怖・強欲指数と合わせて、0〜100の買い時スコアとSTRONG BUY〜OVERHEATEDの5段階で表示します。7つ目の指標MVRV Zスコアは、SANDのCoinMetricsデータがないためN/Aとなり、スコアは残りの指標で計算されます。当日のスコアは無料で見られます。",
    "coinH": "サンドボックス(SAND)とは?",
    "coinP": [
     "サンドボックス(The Sandbox)は、ユーザーがボクセルのアバターやアイテム、ゲームを自分で作り、売買できるメタバースゲームプラットフォームです。2012年にPixowlが出したモバイルゲームが始まりで、2018年にAnimoca BrandsがPixowlを買収した後、ブロックチェーン基盤に作り直されました。SANDはイーサリアム上のERC-20トークンのため独自のコンセンサス方式を持たず、取引の安全性はイーサリアム(2022年9月のマージ以降はプルーフ・オブ・ステーク)に依存しています。",
     "SANDの最大供給量は30億枚で固定されており、2020年8月のBinance Launchpadでの販売を経て市場に出ました。プラットフォーム内で仮想土地LANDやアイテムを売買する際に使われるほか、ステーキングやガバナンス投票にも使われます。LANDは全166,464区画に限られています。チームや運営会社などに割り当てられた分は決められたベスティング日程に沿って段階的にロック解除され、流通量は増え続けてきました。"
    ],
    "applyH": "サンドボックスに指標を当てはめるときの注意",
    "apply": [
     "ボラティリティ：SANDはビットコインより1日の値動きがはるかに大きく、RSIが30を下回ったり70を上回ったりする場面が頻繁にあります。売られすぎ・買われすぎのシグナル1つで判断せず、MACDの転換や50/200のトレンドと合わせて確認してください。",
     "恐怖・強欲指数：SAND専用の指数は存在しません。表示される値はAlternative.meがビットコイン中心に算出する暗号資産市場全体の心理指数なので、メタバースやゲーム分野のニュースなど、SANDだけに関わる材料は反映されません。",
     "MVRV Zスコア：CoinMetricsのコミュニティデータにSANDが含まれていないため、このカードはN/Aです。スコアは残り6指標の重みを付け直して計算されるので、オンチェーンの取得原価から見た底値確認はこの画面ではできません。",
     "メイヤー倍率と下落率：0.8未満で強い買い、2.4超で過熱、下落率-50%といった基準はビットコインの歴史から導かれた値です。下落トレンドが長引くと365日下落率は何か月も-50%より深いままになり得るため、下落が深いことだけでSANDが割安とは言えません。",
     "供給の変化：買い時スコアは価格だけで計算されます。ベスティング解除のように流通量が増える予定は指標に表れないため、別途確認が必要です。"
    ],
    "histH": "サンドボックスの価格サイクルの要約",
    "hist": [
     "2020年8月 — Binance Launchpadでの販売を経てSANDの取引が始まりました。",
     "2021年10〜11月 — FacebookがMetaへ社名を変更したことでメタバースが注目され、SANDは11月下旬に史上最高値を付けました。同月29日にはアルファシーズン1が公開されました。",
     "2022年 — 暗号資産の弱気相場で、高値から90%以上下落しました。",
     "2023〜2024年 — 市場全体が反発した時期でも、価格は2021年の高値を大きく下回ったままでした。"
    ],
    "faq": [
     {
      "q": "サンドボックス専用の恐怖指数はありますか?",
      "a": "ありません。この画面の恐怖・強欲の値は、Alternative.meが毎日発表するビットコイン中心の暗号資産市場全体の指数で、画面にも「市場全体」と表示しています。SAND固有の動きはRSIやMACDなどの価格指標で確認してください。"
     },
     {
      "q": "サンドボックスでもMVRVは表示されますか?",
      "a": "表示されません。MVRV ZスコアはCoinMetricsのコミュニティデータを使いますが、2026年10月時点でSANDの項目がありません。カードはN/Aとなり、買い時スコアはMVRVを除いた指標で計算されます。"
     },
     {
      "q": "今サンドボックスを買ってもいいですか?",
      "a": "当サイトは売買を勧めません。スコアは、現在の指標の組み合わせが過去の基準に照らしてどの水準にあるかを示すだけです。標準の長期(逆張り)タブでは恐怖・売られすぎ・深い下落が重なるほど高く、短期(モメンタム)タブでは上昇トレンドが強いほど高くなります。2つのタブの結果が食い違う場合は、見る期間によって解釈が変わるということです。"
     },
     {
      "q": "下落率が-50%より深ければ割安ということですか?",
      "a": "そうとは限りません。下落率は直近365日の最高値と現在値の差にすぎず、下落トレンドが続けばさらに深くなり得ます。値動きの大きいSANDでは、MACDや50/200のトレンドと合わせて読むほうが安全です。"
     },
     {
      "q": "トークンのロック解除など、供給の変化はスコアに反映されますか?",
      "a": "反映されません。スコアは日足価格と市場全体の恐怖・強欲指数だけで計算するため、ベスティング解除の日程やプロジェクトのニュースは別途確認が必要です。"
     },
     {
      "q": "SANDのスコアがビットコインのスコアと似た動きをするのはなぜですか?",
      "a": "どちらの画面も恐怖・強欲指数の入力が同じで、SANDの価格もビットコインや市場全体の流れに沿って動く日が多いためです。差は主にRSI、MACD、メイヤー倍率など、SAND自体の価格で計算する指標から生まれます。"
     }
    ]
   },
   "ko": {
    "title": "샌드박스(SAND) 매수 타이밍 점수와 공포·탐욕 지수",
    "intro": "이 화면은 샌드박스(SAND)의 일봉 가격으로 RSI(14)·MACD(12·26·9)·마이어 배수·365일 고점 대비 낙폭·50/200 골든·데드 크로스를 계산하고, 암호화폐 시장 전체의 공포·탐욕 지수와 합쳐 0~100 매수 타이밍 점수와 STRONG BUY~OVERHEATED 5단계로 보여줍니다. 7번째 지표인 MVRV Z-Score는 SAND의 CoinMetrics 데이터가 없어 N/A로 표시되고, 점수는 나머지 지표로 계산됩니다. 오늘의 점수는 무료로 볼 수 있습니다.",
    "coinH": "샌드박스(SAND)란?",
    "coinP": [
     "샌드박스(The Sandbox)는 이용자가 복셀(voxel) 아바타·아이템·게임을 직접 만들고 거래하는 메타버스 게임 플랫폼입니다. 2012년 Pixowl이 내놓은 모바일 게임에서 출발했고, 2018년 애니모카 브랜즈(Animoca Brands)가 Pixowl을 인수한 뒤 블록체인 기반으로 다시 만들어졌습니다. SAND는 이더리움 위의 ERC-20 토큰이라 자체 합의 방식이 없고, 거래의 안전성은 이더리움(2022년 9월 머지 이후 지분증명)에 의존합니다.",
     "SAND의 최대 공급량은 30억 개로 고정돼 있으며, 2020년 8월 바이낸스 런치패드 판매를 거쳐 시장에 나왔습니다. 플랫폼 안에서 가상 토지 LAND와 아이템을 사고팔 때 쓰이고, 스테이킹과 거버넌스 투표에도 쓰입니다. LAND는 총 166,464필지로 한정돼 있습니다. 팀·회사 등에 배정된 물량은 정해진 베스팅 일정에 따라 단계적으로 풀려, 유통량이 꾸준히 늘어 왔습니다."
    ],
    "applyH": "샌드박스에 지표를 적용할 때",
    "apply": [
     "변동성: SAND는 비트코인보다 하루 변동 폭이 훨씬 커서 RSI가 30 아래나 70 위로 자주 넘나듭니다. 과매도·과매수 신호 하나만으로 판단하기보다 MACD 전환과 50/200 추세를 함께 보세요.",
     "공포·탐욕 지수: SAND 전용 지수는 존재하지 않습니다. 화면의 값은 Alternative.me가 BTC 중심으로 산출하는 암호화폐 시장 전체 심리이므로, 메타버스·게임 섹터 소식처럼 SAND에만 해당하는 재료는 반영되지 않습니다.",
     "MVRV Z-Score: CoinMetrics 커뮤니티 데이터에 SAND가 없어 이 카드는 N/A입니다. 점수는 나머지 6개 지표의 가중치를 다시 맞춰 계산하므로, 온체인 원가 기준의 바닥 확인은 이 화면에서 할 수 없습니다.",
     "마이어 배수·낙폭: 0.8 미만 강한 매수, 2.4 초과 과열, 낙폭 -50% 같은 기준은 비트코인 역사에서 나온 값입니다. 하락 추세가 길어지면 365일 낙폭이 몇 달씩 -50%보다 깊은 상태로 머물 수 있어, 낙폭이 깊다는 사실만으로 SAND가 싸다고 볼 수는 없습니다.",
     "공급 변화: 매수 타이밍 점수는 가격만으로 계산합니다. 베스팅 물량 해제처럼 유통량이 늘어나는 일정은 지표에 나타나지 않으니 따로 확인해야 합니다."
    ],
    "histH": "샌드박스 가격 사이클 요약",
    "hist": [
     "2020년 8월 — 바이낸스 런치패드 판매를 거쳐 SAND 거래가 시작됐습니다.",
     "2021년 10~11월 — 페이스북이 사명을 메타(Meta)로 바꾼 뒤 메타버스 테마가 주목받으며 급등해, 11월 말 사상 최고가를 기록했습니다. 같은 달 29일에는 알파 시즌 1이 공개됐습니다.",
     "2022년 — 암호화폐 약세장 속에 고점 대비 90% 넘게 하락했습니다.",
     "2023~2024년 — 시장 전체가 반등한 시기에도 가격은 2021년 고점에 크게 못 미쳤습니다."
    ],
    "faq": [
     {
      "q": "샌드박스 공포지수가 따로 있나요?",
      "a": "아니요. 샌드박스만을 위한 공포·탐욕 지수는 없습니다. 이 화면의 공포·탐욕 값은 Alternative.me가 매일 발표하는 암호화폐 시장 전체 지수(비트코인 중심)이며, 그래서 화면에도 ‘시장 전체’라고 표시합니다. SAND 고유의 흐름은 RSI·MACD 같은 가격 지표로 확인해야 합니다."
     },
     {
      "q": "샌드박스에도 MVRV가 나오나요?",
      "a": "나오지 않습니다. MVRV Z-Score는 CoinMetrics 커뮤니티 데이터를 쓰는데, 2026년 10월 확인 기준 SAND 항목이 없습니다. 카드는 N/A로 표시되고 매수 타이밍 점수는 MVRV를 뺀 나머지 지표로 계산됩니다."
     },
     {
      "q": "지금 샌드박스 사도 되나요?",
      "a": "이 사이트는 매수·매도를 권하지 않습니다. 점수는 현재 지표 조합이 과거 기준에 비춰 어느 구간에 있는지 보여줄 뿐입니다. 기본인 장기(역발상) 탭에서는 공포·과매도·깊은 낙폭이 겹칠수록 점수가 높고, 단기(모멘텀) 탭에서는 상승 추세가 강할수록 높습니다. 두 탭의 결과가 다르면 보는 기간에 따라 해석이 갈린다는 뜻입니다."
     },
     {
      "q": "365일 낙폭이 -50%보다 깊으면 싸다는 뜻인가요?",
      "a": "그렇게 단정할 수 없습니다. 낙폭은 최근 365일 최고가와 현재가의 차이일 뿐이고, 하락 추세가 이어지면 이 값은 계속 깊어질 수 있습니다. 변동성이 큰 SAND에서는 낙폭을 MACD·50/200 추세와 함께 읽는 편이 안전합니다."
     },
     {
      "q": "토큰 언락 같은 공급 변화도 점수에 반영되나요?",
      "a": "반영되지 않습니다. 매수 타이밍 점수는 일봉 가격과 시장 전체 공포·탐욕 지수만으로 계산하므로, 베스팅 물량 해제 일정이나 프로젝트 소식은 따로 확인해야 합니다."
     },
     {
      "q": "샌드박스 점수가 비트코인 화면 점수와 비슷하게 움직이는 이유는?",
      "a": "공포·탐욕 지수 입력값이 두 화면에서 같고, SAND 가격도 비트코인과 시장 전체 흐름을 따라 움직이는 날이 많기 때문입니다. 차이는 주로 RSI·MACD·마이어 배수처럼 SAND 자체 가격으로 계산하는 지표에서 생깁니다."
     }
    ]
   },
   "zh": {
    "title": "沙盒(SAND)买入时机评分与恐惧与贪婪指数",
    "intro": "本页根据沙盒(SAND)的日线价格计算RSI(14)、MACD(12·26·9)、梅耶倍数、距365日高点回撤以及50/200金叉·死叉，再结合加密货币全市场的恐惧与贪婪指数，给出0–100的买入时机评分，并分为STRONG BUY至OVERHEATED五个档位。第七项指标MVRV Z分数因CoinMetrics没有SAND数据而显示N/A，评分由其余指标计算。当日评分可免费查看。",
    "coinH": "沙盒(SAND)是什么？",
    "coinP": [
     "沙盒(The Sandbox)是一个元宇宙游戏平台，用户可以自己制作并交易体素风格的头像、道具和游戏。它起源于Pixowl在2012年推出的手机游戏，2018年Animoca Brands收购Pixowl后改造为基于区块链的平台。SAND是以太坊上的ERC-20代币，没有自己的共识机制，交易安全依赖以太坊(2022年9月合并后采用权益证明)。",
     "SAND的最大供应量固定为30亿枚，2020年8月通过币安Launchpad发售后进入市场。它用于在平台内买卖虚拟土地LAND和道具，也用于质押和治理投票。LAND总数限定为166,464块。分配给团队、公司等的份额按既定的归属(vesting)计划分批解锁，流通量因此持续增加。"
    ],
    "applyH": "将指标用于沙盒时需注意",
    "apply": [
     "波动性：SAND的日内波动远大于比特币，RSI经常跌破30或升破70。不要只凭一次超卖或超买信号判断，应结合MACD拐点和50/200趋势一起看。",
     "恐惧与贪婪指数：并不存在SAND专属的指数。页面显示的是Alternative.me以比特币为中心计算的全市场情绪指数，元宇宙或游戏板块新闻等只影响SAND的因素不会体现在其中。",
     "MVRV Z分数：CoinMetrics社区数据未覆盖SAND，因此该卡片显示N/A。评分会重新分配其余6项指标的权重，所以无法在本页用链上成本确认底部。",
     "梅耶倍数与回撤：低于0.8为强烈买入、高于2.4为过热、回撤-50%等阈值都来自比特币的历史。下跌趋势持续时，365日回撤可能连续数月比-50%更深，因此仅凭回撤很深并不能说明SAND便宜。",
     "供应变化：买入时机评分只用价格计算。归属解锁等会增加流通量的安排不会出现在指标中，需要另行确认。"
    ],
    "histH": "沙盒价格周期概要",
    "hist": [
     "2020年8月 — 经币安Launchpad发售后，SAND开始交易。",
     "2021年10–11月 — Facebook更名为Meta后，元宇宙概念受到追捧，SAND在11月下旬创下历史最高价。同月29日，Alpha第一季开放。",
     "2022年 — 在加密货币熊市中，SAND从高点下跌超过90%。",
     "2023–2024年 — 即使在全市场反弹期间，价格仍远低于2021年的高点。"
    ],
    "faq": [
     {
      "q": "沙盒有单独的恐惧指数吗？",
      "a": "没有。本页的恐惧与贪婪数值是Alternative.me每日发布的、以比特币为中心的加密货币全市场指数，页面上也标注为“全市场”。SAND自身的走势请通过RSI、MACD等价格指标判断。"
     },
     {
      "q": "沙盒也会显示MVRV吗？",
      "a": "不会。MVRV Z分数使用CoinMetrics社区数据，截至2026年10月其中没有SAND。该卡片显示N/A，买入时机评分由去掉MVRV后的指标计算。"
     },
     {
      "q": "现在可以买沙盒吗？",
      "a": "本站不推荐买入或卖出。评分只显示当前指标组合相对于历史阈值处于哪个区间。在默认的长期(逆向)标签中，恐惧、超卖和深度回撤叠加越多，分数越高；在短期(动量)标签中，上升趋势越强，分数越高。两个标签结论不一致时，说明判断取决于你的持有周期。"
     },
     {
      "q": "回撤超过-50%就代表SAND便宜吗？",
      "a": "不一定。回撤只是过去365天最高价与当前价格之间的差距，下跌趋势延续时还会继续加深。对于波动很大的SAND，最好结合MACD和50/200趋势一起解读。"
     },
     {
      "q": "代币解锁等供应变化会反映在评分里吗？",
      "a": "不会。评分只根据日线价格和全市场恐惧与贪婪指数计算，归属解锁时间表和项目消息需要另行确认。"
     },
     {
      "q": "为什么SAND的评分常常和比特币评分走势相似？",
      "a": "两个页面使用相同的恐惧与贪婪指数输入，而且SAND价格经常跟随比特币和整体市场波动。差异主要来自用SAND自身价格计算的指标，如RSI、MACD和梅耶倍数。"
     }
    ]
   },
   "zh-Hant": {
    "title": "沙盒(SAND)買入時機評分與恐懼與貪婪指數",
    "intro": "本頁依據沙盒(SAND)的日線價格計算RSI(14)、MACD(12·26·9)、梅耶倍數、距365日高點回檔幅度以及50/200黃金交叉·死亡交叉，再結合加密貨幣全市場的恐懼與貪婪指數，給出0–100的買入時機評分，並分為STRONG BUY至OVERHEATED五個等級。第七項指標MVRV Z分數因CoinMetrics沒有SAND資料而顯示N/A，評分由其餘指標計算。當日評分可免費查看。",
    "coinH": "沙盒(SAND)是什麼？",
    "coinP": [
     "沙盒(The Sandbox)是一個元宇宙遊戲平台，使用者可以自行製作並交易體素風格的頭像、道具和遊戲。它起源於Pixowl在2012年推出的手機遊戲，2018年Animoca Brands收購Pixowl後改造為區塊鏈平台。SAND是以太坊上的ERC-20代幣，沒有自己的共識機制，交易安全仰賴以太坊(2022年9月合併後採用權益證明)。",
     "SAND的最大供給量固定為30億枚，2020年8月透過幣安Launchpad發售後進入市場。它用於在平台內買賣虛擬土地LAND和道具，也用於質押和治理投票。LAND總數限定為166,464塊。分配給團隊、公司等的份額依既定的歸屬(vesting)時程分批解鎖，流通量因此持續增加。"
    ],
    "applyH": "將指標用於沙盒時的注意事項",
    "apply": [
     "波動性：SAND的單日波動遠大於比特幣，RSI經常跌破30或突破70。不要只憑一次超賣或超買訊號判斷，應搭配MACD轉折和50/200趨勢一起看。",
     "恐懼與貪婪指數：並不存在SAND專屬的指數。頁面顯示的是Alternative.me以比特幣為中心計算的全市場情緒指數，元宇宙或遊戲類股新聞等只影響SAND的因素不會反映在其中。",
     "MVRV Z分數：CoinMetrics社群資料未涵蓋SAND，因此這張卡片顯示N/A。評分會重新分配其餘6項指標的權重，所以無法在本頁用鏈上成本確認底部。",
     "梅耶倍數與回檔：低於0.8為強烈買入、高於2.4為過熱、回檔-50%等門檻都來自比特幣的歷史。下跌趨勢持續時，365日回檔可能連續數月比-50%更深，因此光憑回檔很深並不能說明SAND便宜。",
     "供給變化：買入時機評分只用價格計算。歸屬解鎖等會增加流通量的安排不會出現在指標中，需要另行確認。"
    ],
    "histH": "沙盒價格週期概要",
    "hist": [
     "2020年8月 — 經幣安Launchpad發售後，SAND開始交易。",
     "2021年10–11月 — Facebook更名為Meta後，元宇宙題材受到追捧，SAND在11月下旬創下歷史最高價。同月29日，Alpha第一季開放。",
     "2022年 — 在加密貨幣空頭市場中，SAND從高點下跌超過90%。",
     "2023–2024年 — 即使在全市場反彈期間，價格仍遠低於2021年的高點。"
    ],
    "faq": [
     {
      "q": "沙盒有專屬的恐懼指數嗎？",
      "a": "沒有。本頁的恐懼與貪婪數值是Alternative.me每天發布、以比特幣為中心的加密貨幣全市場指數，頁面上也標示為「全市場」。SAND本身的走勢請透過RSI、MACD等價格指標判斷。"
     },
     {
      "q": "沙盒也會顯示MVRV嗎？",
      "a": "不會。MVRV Z分數使用CoinMetrics社群資料，截至2026年10月其中沒有SAND。這張卡片顯示N/A，買入時機評分由去掉MVRV後的指標計算。"
     },
     {
      "q": "現在可以買沙盒嗎？",
      "a": "本站不建議買進或賣出。評分只顯示目前指標組合相對於歷史門檻落在哪個區間。在預設的長期(逆向)分頁中，恐懼、超賣和深度回檔疊加越多，分數越高；在短期(動能)分頁中，上升趨勢越強，分數越高。兩個分頁結論不一致時，代表判斷取決於你的持有週期。"
     },
     {
      "q": "回檔超過-50%就代表SAND便宜嗎？",
      "a": "不一定。回檔只是過去365天最高價與目前價格的差距，下跌趨勢延續時還會繼續加深。對於波動很大的SAND，最好搭配MACD和50/200趨勢一起解讀。"
     },
     {
      "q": "代幣解鎖等供給變化會反映在評分裡嗎？",
      "a": "不會。評分只根據日線價格和全市場恐懼與貪婪指數計算，歸屬解鎖時程和專案消息需要另行確認。"
     },
     {
      "q": "為什麼SAND的評分常常和比特幣評分走勢相似？",
      "a": "兩個頁面使用相同的恐懼與貪婪指數輸入，而且SAND價格經常跟隨比特幣和整體市場波動。差異主要來自用SAND本身價格計算的指標，例如RSI、MACD和梅耶倍數。"
     }
    ]
   },
   "th": {
    "title": "คะแนนจังหวะซื้อแซนด์บ็อกซ์ (SAND) และดัชนีความกลัว-ความโลภ",
    "intro": "หน้านี้ใช้ราคารายวันของแซนด์บ็อกซ์ (SAND) คำนวณ RSI(14), MACD(12·26·9), Mayer Multiple, การย่อตัวจากจุดสูงสุด 365 วัน และสัญญาณ Golden/Death Cross 50/200 แล้วรวมกับดัชนีความกลัว-ความโลภของตลาดคริปโตทั้งหมด เป็นคะแนนจังหวะซื้อ 0–100 แบ่ง 5 ระดับตั้งแต่ STRONG BUY ถึง OVERHEATED ตัวชี้วัดที่ 7 คือ MVRV Z-Score แสดงเป็น N/A เพราะ CoinMetrics ไม่มีข้อมูล SAND คะแนนจึงคำนวณจากตัวชี้วัดที่เหลือ ดูคะแนนของวันนี้ได้ฟรี",
    "coinH": "แซนด์บ็อกซ์ (SAND) คืออะไร?",
    "coinP": [
     "แซนด์บ็อกซ์ (The Sandbox) เป็นแพลตฟอร์มเกมเมตาเวิร์สที่ผู้ใช้สร้างและซื้อขายอวาตาร์ ไอเทม และเกมแบบวอกเซลได้เอง เริ่มต้นจากเกมมือถือของ Pixowl ในปี 2012 และถูกสร้างใหม่บนบล็อกเชนหลังจาก Animoca Brands เข้าซื้อ Pixowl ในปี 2018 SAND เป็นโทเคน ERC-20 บนอีเธอเรียม จึงไม่มีกลไกฉันทามติของตัวเอง ความปลอดภัยของธุรกรรมอาศัยอีเธอเรียม ซึ่งใช้ Proof of Stake ตั้งแต่ The Merge ในเดือนกันยายน 2022",
     "SAND มีอุปทานสูงสุดคงที่ 3 พันล้านเหรียญ และเข้าสู่ตลาดผ่านการขายบน Binance Launchpad ในเดือนสิงหาคม 2020 ใช้ซื้อขายที่ดินเสมือน LAND และไอเทมในแพลตฟอร์ม รวมถึงใช้ Staking และโหวตกำกับดูแล LAND มีจำกัดทั้งหมด 166,464 แปลง ส่วนที่จัดสรรให้ทีม บริษัท และผู้ถืออื่น ๆ ถูกปลดล็อกตามตาราง Vesting ที่กำหนดไว้ ทำให้อุปทานหมุนเวียนเพิ่มขึ้นเรื่อย ๆ"
    ],
    "applyH": "ข้อควรรู้เมื่อใช้ตัวชี้วัดกับแซนด์บ็อกซ์",
    "apply": [
     "ความผันผวน: SAND แกว่งตัวต่อวันมากกว่าบิตคอยน์มาก RSI จึงหลุดต่ำกว่า 30 หรือทะลุเหนือ 70 บ่อยครั้ง อย่าตัดสินจากสัญญาณขายมากเกินหรือซื้อมากเกินเพียงครั้งเดียว ให้ดูร่วมกับการกลับตัวของ MACD และแนวโน้ม 50/200",
     "ดัชนีความกลัว-ความโลภ: ไม่มีดัชนีเฉพาะของ SAND ค่าที่แสดงคือดัชนีอารมณ์ตลาดคริปโตทั้งหมดที่ Alternative.me คำนวณโดยมีบิตคอยน์เป็นศูนย์กลาง ข่าวที่กระทบเฉพาะ SAND เช่น ข่าวกลุ่มเมตาเวิร์สหรือเกม จึงไม่สะท้อนในค่านี้",
     "MVRV Z-Score: ข้อมูลชุมชนของ CoinMetrics ไม่ครอบคลุม SAND การ์ดนี้จึงแสดง N/A คะแนนจะปรับน้ำหนักของตัวชี้วัดที่เหลือ 6 ตัวใหม่ จึงไม่สามารถยืนยันจุดต่ำสุดจากต้นทุนบนเชนได้ในหน้านี้",
     "Mayer Multiple และการย่อตัว: เกณฑ์อย่างต่ำกว่า 0.8 คือซื้อแรง สูงกว่า 2.4 คือร้อนแรงเกิน และย่อตัว -50% มาจากประวัติของบิตคอยน์ ในช่วงขาลงที่ยาวนาน การย่อตัว 365 วันอาจอยู่ลึกกว่า -50% ได้นานหลายเดือน การย่อตัวลึกเพียงอย่างเดียวจึงไม่ได้แปลว่า SAND ถูก",
     "การเปลี่ยนแปลงอุปทาน: คะแนนจังหวะซื้อคำนวณจากราคาเท่านั้น กำหนดการปลดล็อก Vesting ที่เพิ่มอุปทานหมุนเวียนจะไม่ปรากฏในตัวชี้วัด ต้องตรวจสอบแยกต่างหาก"
    ],
    "histH": "สรุปวัฏจักรราคาแซนด์บ็อกซ์",
    "hist": [
     "สิงหาคม 2020 — SAND เริ่มซื้อขายหลังการขายบน Binance Launchpad",
     "ตุลาคม–พฤศจิกายน 2021 — หลัง Facebook เปลี่ยนชื่อเป็น Meta กระแสเมตาเวิร์สพุ่งขึ้น SAND ทำราคาสูงสุดตลอดกาลในปลายเดือนพฤศจิกายน และเปิด Alpha Season 1 ในวันที่ 29 ของเดือนเดียวกัน",
     "2022 — ในตลาดหมีคริปโต SAND ร่วงลงมากกว่า 90% จากจุดสูงสุด",
     "2023–2024 — แม้ในช่วงที่ตลาดโดยรวมฟื้นตัว ราคายังต่ำกว่าจุดสูงสุดปี 2021 อยู่มาก"
    ],
    "faq": [
     {
      "q": "แซนด์บ็อกซ์มีดัชนีความกลัวแยกต่างหากไหม?",
      "a": "ไม่มี ค่าความกลัว-ความโลภในหน้านี้คือดัชนีของตลาดคริปโตทั้งหมดที่ Alternative.me เผยแพร่ทุกวันโดยมีบิตคอยน์เป็นศูนย์กลาง หน้าจอจึงระบุว่าเป็นค่าของทั้งตลาด การเคลื่อนไหวของ SAND เองให้ดูจากตัวชี้วัดราคาอย่าง RSI และ MACD"
     },
     {
      "q": "แซนด์บ็อกซ์มี MVRV แสดงด้วยไหม?",
      "a": "ไม่มี MVRV Z-Score ใช้ข้อมูลชุมชนของ CoinMetrics ซึ่ง ณ เดือนตุลาคม 2026 ไม่มีรายการ SAND การ์ดจึงแสดง N/A และคะแนนจังหวะซื้อคำนวณจากตัวชี้วัดที่เหลือ"
     },
     {
      "q": "ตอนนี้ควรซื้อแซนด์บ็อกซ์ไหม?",
      "a": "เว็บไซต์นี้ไม่แนะนำให้ซื้อหรือขาย คะแนนเพียงบอกว่าชุดตัวชี้วัดปัจจุบันอยู่ตรงไหนเมื่อเทียบกับเกณฑ์ในอดีต ในแท็บระยะยาว (สวนกระแส) ซึ่งเป็นค่าเริ่มต้น คะแนนจะสูงขึ้นเมื่อความกลัว ภาวะขายมากเกิน และการย่อตัวลึกเกิดซ้อนกัน ส่วนแท็บระยะสั้น (โมเมนตัม) คะแนนจะสูงเมื่อแนวโน้มขาขึ้นแข็งแรง หากสองแท็บให้ผลต่างกัน แปลว่าการตีความขึ้นอยู่กับกรอบเวลาที่คุณถือ"
     },
     {
      "q": "ย่อตัวลึกกว่า -50% แปลว่า SAND ถูกหรือเปล่า?",
      "a": "ไม่จำเป็น การย่อตัวเป็นเพียงส่วนต่างระหว่างราคาสูงสุดใน 365 วันที่ผ่านมากับราคาปัจจุบัน และอาจลึกลงอีกหากขาลงยังดำเนินต่อ สำหรับ SAND ที่ผันผวนสูง ควรอ่านร่วมกับ MACD และแนวโน้ม 50/200"
     },
     {
      "q": "การปลดล็อกโทเคนและการเปลี่ยนแปลงอุปทานสะท้อนในคะแนนไหม?",
      "a": "ไม่สะท้อน คะแนนคำนวณจากราคารายวันและดัชนีความกลัว-ความโลภของทั้งตลาดเท่านั้น ตาราง Vesting และข่าวของโปรเจกต์ต้องตรวจสอบแยกต่างหาก"
     },
     {
      "q": "ทำไมคะแนน SAND มักเคลื่อนไหวคล้ายคะแนนบิตคอยน์?",
      "a": "ทั้งสองหน้าใช้ค่าความกลัว-ความโลภชุดเดียวกัน และราคา SAND ก็มักเคลื่อนตามบิตคอยน์และตลาดโดยรวม ความต่างส่วนใหญ่มาจากตัวชี้วัดที่คำนวณจากราคา SAND เอง เช่น RSI, MACD และ Mayer Multiple"
     }
    ]
   },
   "es": {
    "title": "Puntuación de timing de compra y Miedo y Codicia de The Sandbox (SAND)",
    "intro": "Esta página toma los precios diarios de The Sandbox (SAND), calcula el RSI(14), el MACD(12·26·9), el múltiplo de Mayer, la caída desde el máximo de 365 días y el cruce dorado/de la muerte 50/200, y los combina con el Índice de Miedo y Codicia de todo el mercado cripto en una puntuación de timing de compra de 0 a 100, con cinco bandas de STRONG BUY a OVERHEATED. El séptimo indicador, el MVRV Z-Score, aparece como N/A porque CoinMetrics no tiene datos de SAND, así que la puntuación se calcula con los demás. La puntuación del día se consulta gratis.",
    "coinH": "¿Qué es The Sandbox (SAND)?",
    "coinP": [
     "The Sandbox es una plataforma de juegos del metaverso donde los usuarios crean y comercian avatares, objetos y juegos de estilo vóxel. Nació en 2012 como un juego para móviles de Pixowl y se rehízo sobre blockchain después de que Animoca Brands comprara Pixowl en 2018. SAND es un token ERC-20 de Ethereum, por lo que no tiene mecanismo de consenso propio: sus transacciones dependen de la seguridad de Ethereum, que usa prueba de participación desde The Merge de septiembre de 2022.",
     "SAND tiene un suministro máximo fijo de 3.000 millones de tokens y llegó al mercado con una venta en Binance Launchpad en agosto de 2020. Sirve para comprar y vender parcelas LAND y objetos en la plataforma, además de para staking y votaciones de gobernanza. El total de LAND está limitado a 166.464 parcelas. Los tokens asignados al equipo, a la empresa y a otros titulares se desbloquean según un calendario de vesting fijado, lo que ha ido aumentando el suministro circulante."
    ],
    "applyH": "Cómo leer los indicadores en The Sandbox",
    "apply": [
     "Volatilidad: las oscilaciones diarias de SAND son mucho mayores que las de Bitcoin, así que el RSI baja de 30 o supera 70 con frecuencia. En lugar de actuar por una sola lectura de sobreventa o sobrecompra, contrástala con el giro del MACD y la tendencia 50/200.",
     "Miedo y Codicia: no existe un índice propio de SAND. El valor mostrado es el termómetro de Alternative.me para todo el mercado cripto, centrado en Bitcoin, así que las noticias que solo afectan a SAND, como las del sector del metaverso o los videojuegos, no se reflejan en él.",
     "MVRV Z-Score: los datos comunitarios de CoinMetrics no incluyen SAND, por lo que esta tarjeta muestra N/A. La puntuación redistribuye el peso entre los otros seis indicadores, de modo que en esta página no se puede confirmar un suelo basado en el coste on-chain.",
     "Múltiplo de Mayer y caída: umbrales como menos de 0,8 para compra fuerte, más de 2,4 para sobrecalentamiento o una caída del -50% proceden de la historia de Bitcoin. En una tendencia bajista larga, la caída de 365 días puede seguir por debajo del -50% durante meses, así que una caída profunda por sí sola no significa que SAND esté barato.",
     "Cambios de suministro: la puntuación solo usa el precio. Los desbloqueos de vesting programados que amplían el suministro circulante no aparecen en los indicadores, así que conviene revisarlos aparte."
    ],
    "histH": "Resumen de los ciclos de precio de The Sandbox",
    "hist": [
     "Agosto de 2020 — SAND empezó a cotizar tras su venta en Binance Launchpad.",
     "Octubre–noviembre de 2021 — tras el cambio de nombre de Facebook a Meta, el metaverso se puso de moda y SAND marcó su máximo histórico a finales de noviembre. El día 29 de ese mismo mes abrió la Alpha Season 1.",
     "2022 — en el mercado bajista cripto, SAND cayó más de un 90% desde su máximo.",
     "2023–2024 — incluso en los rebotes de todo el mercado, el precio se mantuvo muy por debajo del máximo de 2021."
    ],
    "faq": [
     {
      "q": "¿Hay un Índice de Miedo y Codicia propio de The Sandbox?",
      "a": "No. No existe un índice de Miedo y Codicia exclusivo de The Sandbox. El valor de esta página es el índice de todo el mercado, centrado en Bitcoin, que Alternative.me publica cada día; por eso la pantalla lo marca como de mercado general. Para el movimiento propio de SAND, fíjate en indicadores de precio como el RSI y el MACD."
     },
     {
      "q": "¿The Sandbox muestra MVRV?",
      "a": "No. El MVRV Z-Score depende de los datos comunitarios de CoinMetrics, que en octubre de 2026 no incluían SAND. La tarjeta muestra N/A y la puntuación de timing se calcula con los indicadores restantes."
     },
     {
      "q": "¿Debo comprar The Sandbox ahora?",
      "a": "Esta página no indica si comprar o vender SAND. La puntuación solo indica dónde se sitúa la combinación actual de indicadores respecto a umbrales históricos. En la pestaña predeterminada de largo plazo (contraria) sube cuando se acumulan miedo, sobreventa y caídas profundas; en la de corto plazo (momentum) sube cuanto más fuerte es la tendencia alcista. Si las dos pestañas no coinciden, la lectura depende de tu horizonte temporal."
     },
     {
      "q": "¿Una caída superior al -50% significa que SAND está barato?",
      "a": "No necesariamente. La caída es solo la distancia entre el precio más alto de los últimos 365 días y el actual, y puede seguir ampliándose mientras dure la tendencia bajista. En un token tan volátil como SAND, conviene leerla junto con el MACD y la tendencia 50/200."
     },
     {
      "q": "¿Los desbloqueos de tokens y otros cambios de suministro se reflejan en la puntuación?",
      "a": "No. La puntuación se calcula solo con precios diarios y el Índice de Miedo y Codicia del mercado, así que las fechas de desbloqueo y las noticias del proyecto hay que consultarlas aparte."
     },
     {
      "q": "¿Por qué la puntuación de SAND suele moverse como la de Bitcoin?",
      "a": "Ambas páginas usan el mismo dato de Miedo y Codicia, y el precio de SAND suele seguir a Bitcoin y al mercado en general. Las diferencias vienen sobre todo de los indicadores calculados con el propio precio de SAND, como el RSI, el MACD y el múltiplo de Mayer."
     }
    ]
   },
   "fr": {
    "title": "Score de timing d’achat et indice Peur & Avidité de The Sandbox (SAND)",
    "intro": "Cette page part des cours quotidiens de The Sandbox (SAND) pour calculer le RSI(14), le MACD(12·26·9), le multiple de Mayer, la baisse depuis le plus haut sur 365 jours et le croisement doré/mortel 50/200, puis les combine avec l’indice Peur & Avidité de l’ensemble du marché crypto en un score de timing d’achat de 0 à 100, réparti en cinq niveaux de STRONG BUY à OVERHEATED. Le septième indicateur, le MVRV Z-Score, affiche N/A faute de données CoinMetrics pour SAND : le score est donc calculé avec les autres. Le score du jour est consultable gratuitement.",
    "coinH": "Qu’est-ce que The Sandbox (SAND) ?",
    "coinP": [
     "The Sandbox est une plateforme de jeu du métavers où les utilisateurs créent et échangent des avatars, des objets et des jeux en voxels. Le projet est né en 2012 sous la forme d’un jeu mobile de Pixowl, puis a été reconstruit sur la blockchain après le rachat de Pixowl par Animoca Brands en 2018. SAND est un jeton ERC-20 sur Ethereum : il n’a pas de mécanisme de consensus propre et ses transactions reposent sur la sécurité d’Ethereum, passé à la preuve d’enjeu avec The Merge en septembre 2022.",
     "L’offre maximale de SAND est fixée à 3 milliards de jetons, mis sur le marché via une vente sur Binance Launchpad en août 2020. Le jeton sert à acheter et vendre des parcelles LAND et des objets sur la plateforme, ainsi qu’au staking et aux votes de gouvernance. Le nombre de LAND est plafonné à 166 464 parcelles. Les jetons attribués à l’équipe, à la société et à d’autres détenteurs sont débloqués selon un calendrier de vesting établi, ce qui a fait progressivement augmenter l’offre en circulation."
    ],
    "applyH": "Lire les indicateurs sur The Sandbox",
    "apply": [
     "Volatilité : les variations quotidiennes de SAND sont bien plus fortes que celles du Bitcoin, si bien que le RSI passe souvent sous 30 ou au-dessus de 70. Plutôt que d’agir sur un seul signal de survente ou de surachat, confrontez-le au retournement du MACD et à la tendance 50/200.",
     "Peur & Avidité : il n’existe pas d’indice propre à SAND. La valeur affichée est le baromètre d’Alternative.me pour tout le marché crypto, centré sur le Bitcoin ; les nouvelles qui ne concernent que SAND, comme celles du métavers ou du jeu vidéo, n’y apparaissent pas.",
     "MVRV Z-Score : les données communautaires de CoinMetrics ne couvrent pas SAND, cette carte affiche donc N/A. Le score répartit à nouveau les poids entre les six autres indicateurs ; impossible, sur cette page, de confirmer un creux fondé sur le coût on-chain.",
     "Multiple de Mayer et baisse : des seuils comme moins de 0,8 pour un achat fort, plus de 2,4 pour la surchauffe ou une baisse de -50 % viennent de l’histoire du Bitcoin. Dans une longue tendance baissière, la baisse sur 365 jours peut rester au-delà de -50 % pendant des mois : une forte baisse ne suffit donc pas à dire que SAND est bon marché.",
     "Évolution de l’offre : le score n’utilise que le prix. Les déblocages de vesting programmés, qui augmentent l’offre en circulation, n’apparaissent pas dans les indicateurs ; vérifiez-les séparément."
    ],
    "histH": "Résumé des cycles de prix de The Sandbox",
    "hist": [
     "Août 2020 — SAND commence à s’échanger après sa vente sur Binance Launchpad.",
     "Octobre–novembre 2021 — après le changement de nom de Facebook en Meta, le thème du métavers s’envole et SAND atteint son plus haut historique fin novembre. L’Alpha Season 1 ouvre le 29 du même mois.",
     "2022 — dans le marché baissier crypto, SAND perd plus de 90 % depuis son sommet.",
     "2023–2024 — même lors des rebonds de l’ensemble du marché, le prix reste très loin de son sommet de 2021."
    ],
    "faq": [
     {
      "q": "Existe-t-il un indice Peur & Avidité propre à The Sandbox ?",
      "a": "Non. Aucun indice Peur & Avidité n’est calculé spécialement pour The Sandbox. La valeur de cette page est l’indice de l’ensemble du marché, centré sur le Bitcoin, publié chaque jour par Alternative.me ; c’est pourquoi l’écran le présente comme un indice de marché global. Pour le mouvement propre de SAND, regardez les indicateurs de prix comme le RSI et le MACD."
     },
     {
      "q": "The Sandbox affiche-t-il le MVRV ?",
      "a": "Non. Le MVRV Z-Score s’appuie sur les données communautaires de CoinMetrics, qui ne comportaient pas SAND en octobre 2026. La carte affiche N/A et le score de timing est calculé avec les indicateurs restants."
     },
     {
      "q": "Faut-il acheter The Sandbox maintenant ?",
      "a": "Cette page ne dit pas s’il faut acheter ou vendre du SAND. Le score indique seulement où se situe la combinaison actuelle d’indicateurs par rapport à des seuils historiques. Dans l’onglet long terme (contrarien), proposé par défaut, il monte quand peur, survente et forte baisse se cumulent ; dans l’onglet court terme (momentum), il monte avec la force de la tendance haussière. Si les deux onglets divergent, la lecture dépend de votre horizon."
     },
     {
      "q": "Une baisse de plus de -50 % signifie-t-elle que SAND est bon marché ?",
      "a": "Pas forcément. La baisse n’est que l’écart entre le plus haut des 365 derniers jours et le prix actuel, et elle peut encore se creuser tant que la tendance baissière dure. Pour un jeton aussi volatil que SAND, mieux vaut la lire avec le MACD et la tendance 50/200."
     },
     {
      "q": "Les déblocages de jetons et autres variations de l’offre sont-ils pris en compte ?",
      "a": "Non. Le score est calculé uniquement à partir des cours quotidiens et de l’indice Peur & Avidité du marché ; le calendrier de vesting et l’actualité du projet sont à suivre séparément."
     },
     {
      "q": "Pourquoi le score de SAND évolue-t-il souvent comme celui du Bitcoin ?",
      "a": "Les deux pages utilisent la même donnée Peur & Avidité, et le prix de SAND suit souvent le Bitcoin et le marché dans son ensemble. Les écarts viennent surtout des indicateurs calculés sur le prix propre de SAND, comme le RSI, le MACD et le multiple de Mayer."
     }
    ]
   },
   "de": {
    "title": "Kauf-Timing-Score und Angst-&-Gier-Index für The Sandbox (SAND)",
    "intro": "Diese Seite berechnet aus den Tageskursen von The Sandbox (SAND) RSI(14), MACD(12·26·9), Mayer Multiple, den Rückgang vom 365-Tage-Hoch sowie das 50/200-Golden-/Death-Cross und verbindet sie mit dem Angst-&-Gier-Index des gesamten Kryptomarkts zu einem Kauf-Timing-Score von 0 bis 100 in fünf Stufen von STRONG BUY bis OVERHEATED. Der siebte Indikator, der MVRV-Z-Score, steht auf N/A, weil CoinMetrics keine SAND-Daten hat; der Score wird daher aus den übrigen Indikatoren gebildet. Der heutige Score ist kostenlos einsehbar.",
    "coinH": "Was ist The Sandbox (SAND)?",
    "coinP": [
     "The Sandbox ist eine Metaverse-Spieleplattform, auf der Nutzer Voxel-Avatare, Gegenstände und Spiele selbst bauen und handeln. Sie begann 2012 als Handyspiel von Pixowl und wurde auf der Blockchain neu aufgebaut, nachdem Animoca Brands Pixowl 2018 übernommen hatte. SAND ist ein ERC-20-Token auf Ethereum und hat daher keinen eigenen Konsensmechanismus; die Transaktionen sind durch Ethereum abgesichert, das seit dem Merge im September 2022 Proof of Stake nutzt.",
     "Das Maximalangebot von SAND ist auf 3 Milliarden Token festgelegt; an den Markt kam der Token im August 2020 über einen Verkauf auf Binance Launchpad. Er dient zum Kauf und Verkauf von LAND-Parzellen und Gegenständen auf der Plattform sowie für Staking und Governance-Abstimmungen. LAND ist auf 166.464 Parzellen begrenzt. Token für das Team, das Unternehmen und weitere Empfänger werden nach einem festen Vesting-Plan freigegeben, wodurch das umlaufende Angebot stetig gewachsen ist."
    ],
    "applyH": "Indikatoren bei The Sandbox richtig lesen",
    "apply": [
     "Volatilität: SAND schwankt täglich weit stärker als Bitcoin, daher fällt der RSI häufig unter 30 oder steigt über 70. Handeln Sie nicht auf ein einzelnes Überverkauft- oder Überkauft-Signal, sondern prüfen Sie es gegen die MACD-Wende und den 50/200-Trend.",
     "Angst & Gier: Einen eigenen SAND-Index gibt es nicht. Angezeigt wird der Bitcoin-zentrierte Stimmungsindex von Alternative.me für den gesamten Kryptomarkt; Nachrichten, die nur SAND betreffen, etwa aus dem Metaverse- oder Gaming-Sektor, fließen nicht ein.",
     "MVRV-Z-Score: Die Community-Daten von CoinMetrics enthalten SAND nicht, deshalb zeigt diese Karte N/A. Der Score gewichtet die übrigen sechs Indikatoren neu – einen Boden auf Basis der On-Chain-Kosten kann man auf dieser Seite also nicht bestätigen.",
     "Mayer Multiple und Rückgang: Schwellen wie unter 0,8 für starken Kauf, über 2,4 für Überhitzung oder ein Rückgang von -50 % stammen aus der Geschichte von Bitcoin. In einem langen Abwärtstrend kann der 365-Tage-Rückgang monatelang tiefer als -50 % bleiben; ein tiefer Rückgang allein macht SAND also nicht günstig.",
     "Angebotsänderungen: Der Score nutzt nur den Preis. Geplante Vesting-Freigaben, die das umlaufende Angebot erhöhen, tauchen in den Indikatoren nicht auf und sollten separat geprüft werden."
    ],
    "histH": "Die Preiszyklen von The Sandbox im Überblick",
    "hist": [
     "August 2020 – Nach dem Verkauf auf Binance Launchpad beginnt der Handel mit SAND.",
     "Oktober–November 2021 – Nach der Umbenennung von Facebook in Meta rückt das Metaverse in den Fokus; SAND erreicht Ende November sein Allzeithoch. Am 29. desselben Monats startet Alpha Season 1.",
     "2022 – Im Krypto-Bärenmarkt verliert SAND mehr als 90 % gegenüber dem Hoch.",
     "2023–2024 – Selbst bei Erholungen des Gesamtmarkts bleibt der Kurs weit unter dem Hoch von 2021."
    ],
    "faq": [
     {
      "q": "Gibt es einen eigenen Angst-&-Gier-Index für The Sandbox?",
      "a": "Nein. Ein Angst-&-Gier-Index nur für The Sandbox existiert nicht. Der Wert auf dieser Seite ist der Bitcoin-zentrierte Index für den gesamten Markt, den Alternative.me täglich veröffentlicht – deshalb kennzeichnet ihn die Oberfläche als Gesamtmarkt-Wert. Die eigene Bewegung von SAND lesen Sie an Preisindikatoren wie RSI und MACD ab."
     },
     {
      "q": "Zeigt The Sandbox einen MVRV an?",
      "a": "Nein. Der MVRV-Z-Score beruht auf Community-Daten von CoinMetrics, die im Oktober 2026 keinen SAND-Eintrag hatten. Die Karte zeigt N/A, und der Kauf-Timing-Score wird aus den verbleibenden Indikatoren berechnet."
     },
     {
      "q": "Sollte ich The Sandbox jetzt kaufen?",
      "a": "Diese Seite sagt nicht, ob Sie SAND kaufen oder verkaufen sollten. Der Score zeigt nur, wo die aktuelle Kombination der Indikatoren im Vergleich zu historischen Schwellen liegt. Im standardmäßigen Langfrist-Tab (antizyklisch) steigt er, wenn Angst, Überverkauft-Signale und tiefe Rückgänge zusammenkommen; im Kurzfrist-Tab (Momentum) steigt er mit der Stärke des Aufwärtstrends. Weichen beide Tabs voneinander ab, hängt die Deutung von Ihrem Anlagehorizont ab."
     },
     {
      "q": "Bedeutet ein Rückgang von mehr als -50 %, dass SAND günstig ist?",
      "a": "Nicht unbedingt. Der Rückgang ist nur der Abstand zwischen dem höchsten Kurs der letzten 365 Tage und dem aktuellen Kurs und kann sich vertiefen, solange der Abwärtstrend anhält. Bei einem so volatilen Token wie SAND liest man ihn besser zusammen mit MACD und dem 50/200-Trend."
     },
     {
      "q": "Fließen Token-Freigaben und andere Angebotsänderungen in den Score ein?",
      "a": "Nein. Der Score wird nur aus Tageskursen und dem Angst-&-Gier-Index des Gesamtmarkts berechnet; Vesting-Termine und Projektnachrichten müssen Sie separat verfolgen."
     },
     {
      "q": "Warum bewegt sich der SAND-Score oft ähnlich wie der Bitcoin-Score?",
      "a": "Beide Seiten nutzen denselben Angst-&-Gier-Wert, und der SAND-Kurs folgt häufig Bitcoin und dem Gesamtmarkt. Unterschiede entstehen vor allem bei Indikatoren, die auf dem eigenen SAND-Kurs beruhen, etwa RSI, MACD und Mayer Multiple."
     }
    ]
   },
   "it": {
    "title": "Punteggio di timing d’acquisto e indice Paura e Avidità di The Sandbox (SAND)",
    "intro": "Questa pagina usa i prezzi giornalieri di The Sandbox (SAND) per calcolare RSI(14), MACD(12·26·9), multiplo di Mayer, calo dal massimo a 365 giorni e incrocio dorato/della morte 50/200, poi li combina con l’indice Paura e Avidità dell’intero mercato cripto in un punteggio di timing d’acquisto da 0 a 100, suddiviso in cinque fasce da STRONG BUY a OVERHEATED. Il settimo indicatore, l’MVRV Z-Score, risulta N/A perché CoinMetrics non ha dati su SAND, quindi il punteggio si basa sugli altri. Il punteggio del giorno è consultabile gratis.",
    "coinH": "Che cos’è The Sandbox (SAND)?",
    "coinP": [
     "The Sandbox è una piattaforma di gioco nel metaverso in cui gli utenti creano e scambiano avatar, oggetti e giochi in stile voxel. È nata nel 2012 come gioco per smartphone di Pixowl ed è stata ricostruita su blockchain dopo che Animoca Brands ha acquisito Pixowl nel 2018. SAND è un token ERC-20 su Ethereum, quindi non ha un meccanismo di consenso proprio: le transazioni si affidano alla sicurezza di Ethereum, che dal Merge di settembre 2022 usa la proof of stake.",
     "L’offerta massima di SAND è fissata a 3 miliardi di token, arrivati sul mercato con una vendita su Binance Launchpad nell’agosto 2020. Il token serve a comprare e vendere lotti LAND e oggetti sulla piattaforma, oltre che per lo staking e le votazioni di governance. I LAND sono limitati a 166.464 lotti. I token assegnati al team, alla società e ad altri destinatari vengono sbloccati secondo un calendario di vesting prestabilito, e ciò ha fatto crescere via via l’offerta in circolazione."
    ],
    "applyH": "Come leggere gli indicatori su The Sandbox",
    "apply": [
     "Volatilità: le oscillazioni giornaliere di SAND sono molto più ampie di quelle di Bitcoin, perciò l’RSI scende sotto 30 o sale sopra 70 di frequente. Invece di agire su un singolo segnale di ipervenduto o ipercomprato, confrontalo con l’inversione del MACD e con il trend 50/200.",
     "Paura e Avidità: non esiste un indice specifico per SAND. Il valore mostrato è il barometro di Alternative.me per l’intero mercato cripto, centrato su Bitcoin; le notizie che riguardano solo SAND, come quelle sul metaverso o sul gaming, non vi compaiono.",
     "MVRV Z-Score: i dati della community di CoinMetrics non coprono SAND, quindi questa scheda mostra N/A. Il punteggio ridistribuisce i pesi tra gli altri sei indicatori: su questa pagina non si può confermare un minimo basato sul costo on-chain.",
     "Multiplo di Mayer e calo: soglie come sotto 0,8 per un acquisto forte, sopra 2,4 per il surriscaldamento o un calo del -50% derivano dalla storia di Bitcoin. In un lungo trend ribassista il calo a 365 giorni può restare oltre il -50% per mesi, quindi un calo profondo da solo non rende SAND conveniente.",
     "Variazioni dell’offerta: il punteggio usa solo il prezzo. Gli sblocchi di vesting programmati, che aumentano l’offerta in circolazione, non compaiono negli indicatori e vanno verificati a parte."
    ],
    "histH": "Sintesi dei cicli di prezzo di The Sandbox",
    "hist": [
     "Agosto 2020 — SAND inizia a essere scambiato dopo la vendita su Binance Launchpad.",
     "Ottobre–novembre 2021 — dopo che Facebook cambia nome in Meta, il tema del metaverso esplode e SAND tocca il massimo storico a fine novembre. Il 29 dello stesso mese apre l’Alpha Season 1.",
     "2022 — nel mercato ribassista delle cripto SAND perde oltre il 90% dal massimo.",
     "2023–2024 — anche durante i rimbalzi dell’intero mercato, il prezzo resta molto al di sotto del massimo del 2021."
    ],
    "faq": [
     {
      "q": "Esiste un indice Paura e Avidità specifico per The Sandbox?",
      "a": "No. Non esiste un indice Paura e Avidità dedicato a The Sandbox. Il valore di questa pagina è l’indice dell’intero mercato, centrato su Bitcoin, che Alternative.me pubblica ogni giorno; per questo la schermata lo indica come valore di mercato generale. Per il movimento proprio di SAND guarda indicatori di prezzo come RSI e MACD."
     },
     {
      "q": "The Sandbox mostra l’MVRV?",
      "a": "No. L’MVRV Z-Score si basa sui dati della community di CoinMetrics, che a ottobre 2026 non includevano SAND. La scheda mostra N/A e il punteggio di timing viene calcolato con gli indicatori rimanenti."
     },
     {
      "q": "Conviene comprare The Sandbox adesso?",
      "a": "Questo sito non consiglia né di comprare né di vendere. Il punteggio indica solo dove si colloca l’attuale combinazione di indicatori rispetto a soglie storiche. Nella scheda predefinita di lungo periodo (contrarian) sale quando paura, ipervenduto e cali profondi si sommano; in quella di breve periodo (momentum) sale con la forza del trend rialzista. Se le due schede non concordano, la lettura dipende dal tuo orizzonte temporale."
     },
     {
      "q": "Un calo oltre il -50% significa che SAND è a buon prezzo?",
      "a": "Non per forza. Il calo è solo la distanza tra il prezzo più alto degli ultimi 365 giorni e quello attuale, e può aumentare finché dura il trend ribassista. Con un token volatile come SAND conviene leggerlo insieme al MACD e al trend 50/200."
     },
     {
      "q": "Gli sblocchi di token e le altre variazioni dell’offerta entrano nel punteggio?",
      "a": "No. Il punteggio si calcola solo con i prezzi giornalieri e l’indice Paura e Avidità del mercato; le date di vesting e le notizie sul progetto vanno seguite separatamente."
     },
     {
      "q": "Perché il punteggio di SAND si muove spesso come quello di Bitcoin?",
      "a": "Le due pagine usano lo stesso dato di Paura e Avidità, e il prezzo di SAND segue spesso Bitcoin e il mercato nel suo complesso. Le differenze nascono soprattutto dagli indicatori calcolati sul prezzo di SAND, come RSI, MACD e multiplo di Mayer."
     }
    ]
   },
   "pt": {
    "title": "Pontuação de timing de compra e Índice de Medo e Ganância do The Sandbox (SAND)",
    "intro": "Esta página usa os preços diários do The Sandbox (SAND) para calcular RSI(14), MACD(12·26·9), múltiplo de Mayer, queda desde a máxima de 365 dias e o cruzamento dourado/da morte 50/200, e os combina com o Índice de Medo e Ganância de todo o mercado cripto numa pontuação de timing de compra de 0 a 100, em cinco faixas de STRONG BUY a OVERHEATED. O sétimo indicador, o MVRV Z-Score, aparece como N/A porque a CoinMetrics não tem dados de SAND, então a pontuação é calculada com os demais. A pontuação do dia pode ser vista de graça.",
    "coinH": "O que é The Sandbox (SAND)?",
    "coinP": [
     "O The Sandbox é uma plataforma de jogos no metaverso em que os usuários criam e negociam avatares, itens e jogos em estilo voxel. Começou em 2012 como um jogo para celular da Pixowl e foi reconstruído em blockchain depois que a Animoca Brands comprou a Pixowl em 2018. O SAND é um token ERC-20 na Ethereum, então não tem mecanismo de consenso próprio: as transações dependem da segurança da Ethereum, que usa prova de participação desde o Merge de setembro de 2022.",
     "O SAND tem oferta máxima fixa de 3 bilhões de tokens e chegou ao mercado por meio de uma venda na Binance Launchpad em agosto de 2020. É usado para comprar e vender lotes LAND e itens na plataforma, além de staking e votações de governança. O total de LAND é limitado a 166.464 lotes. Os tokens destinados à equipe, à empresa e a outros detentores são liberados conforme um cronograma de vesting definido, o que vem aumentando a oferta em circulação."
    ],
    "applyH": "Como ler os indicadores no The Sandbox",
    "apply": [
     "Volatilidade: as oscilações diárias do SAND são muito maiores que as do Bitcoin, por isso o RSI cai abaixo de 30 ou passa de 70 com frequência. Em vez de agir com base em um único sinal de sobrevenda ou sobrecompra, confira-o com a virada do MACD e a tendência 50/200.",
     "Medo e Ganância: não existe um índice próprio do SAND. O valor exibido é o termômetro da Alternative.me para todo o mercado cripto, centrado no Bitcoin; notícias que afetam só o SAND, como as do setor de metaverso ou de games, não aparecem nele.",
     "MVRV Z-Score: os dados comunitários da CoinMetrics não incluem o SAND, então este cartão mostra N/A. A pontuação redistribui os pesos entre os outros seis indicadores; nesta página não dá para confirmar um fundo baseado no custo on-chain.",
     "Múltiplo de Mayer e queda: limites como abaixo de 0,8 para compra forte, acima de 2,4 para superaquecimento ou uma queda de -50% vêm da história do Bitcoin. Numa tendência de baixa longa, a queda de 365 dias pode ficar além de -50% por meses, então uma queda profunda sozinha não torna o SAND barato.",
     "Mudanças de oferta: a pontuação usa apenas o preço. Liberações programadas de vesting, que aumentam a oferta em circulação, não aparecem nos indicadores e devem ser verificadas à parte."
    ],
    "histH": "Resumo dos ciclos de preço do The Sandbox",
    "hist": [
     "Agosto de 2020 — o SAND começou a ser negociado após a venda na Binance Launchpad.",
     "Outubro–novembro de 2021 — depois que o Facebook mudou de nome para Meta, o tema metaverso disparou e o SAND atingiu sua máxima histórica no fim de novembro. No dia 29 do mesmo mês, a Alpha Season 1 foi aberta.",
     "2022 — no mercado de baixa das criptos, o SAND caiu mais de 90% desde o topo.",
     "2023–2024 — mesmo nas recuperações do mercado como um todo, o preço ficou muito abaixo da máxima de 2021."
    ],
    "faq": [
     {
      "q": "Existe um Índice de Medo e Ganância próprio do The Sandbox?",
      "a": "Não. Não há um Índice de Medo e Ganância feito só para o The Sandbox. O valor desta página é o índice de todo o mercado, centrado no Bitcoin, que a Alternative.me publica diariamente; por isso a tela o identifica como índice do mercado geral. Para o movimento próprio do SAND, observe indicadores de preço como RSI e MACD."
     },
     {
      "q": "O The Sandbox mostra MVRV?",
      "a": "Não. O MVRV Z-Score depende dos dados comunitários da CoinMetrics, que em outubro de 2026 não tinham o SAND. O cartão mostra N/A e a pontuação de timing é calculada com os indicadores restantes."
     },
     {
      "q": "Devo comprar The Sandbox agora?",
      "a": "Esta página não diz se você deve comprar ou vender SAND. A pontuação só mostra onde a combinação atual de indicadores está em relação a limites históricos. Na aba padrão de longo prazo (contrária), ela sobe quando medo, sobrevenda e quedas profundas se somam; na aba de curto prazo (momentum), sobe conforme a tendência de alta se fortalece. Se as duas abas discordarem, a leitura depende do seu horizonte de tempo."
     },
     {
      "q": "Uma queda maior que -50% significa que o SAND está barato?",
      "a": "Não necessariamente. A queda é apenas a distância entre o maior preço dos últimos 365 dias e o atual, e pode aumentar enquanto a tendência de baixa durar. Num token tão volátil quanto o SAND, vale lê-la junto com o MACD e a tendência 50/200."
     },
     {
      "q": "Liberações de tokens e outras mudanças de oferta entram na pontuação?",
      "a": "Não. A pontuação é calculada apenas com preços diários e o Índice de Medo e Ganância do mercado; o cronograma de vesting e as notícias do projeto precisam ser acompanhados à parte."
     },
     {
      "q": "Por que a pontuação do SAND costuma se mover como a do Bitcoin?",
      "a": "As duas páginas usam o mesmo dado de Medo e Ganância, e o preço do SAND costuma acompanhar o Bitcoin e o mercado em geral. As diferenças vêm principalmente dos indicadores calculados com o próprio preço do SAND, como RSI, MACD e múltiplo de Mayer."
     }
    ]
   },
   "ru": {
    "title": "Оценка момента покупки и индекс страха и жадности для Сэндбокс (SAND)",
    "intro": "Эта страница берёт дневные цены Сэндбокс (SAND), рассчитывает RSI(14), MACD(12·26·9), множитель Майера, просадку от 365-дневного максимума и золотой/мёртвый крест 50/200 и объединяет их с индексом страха и жадности всего криптовалютного рынка в оценку момента покупки от 0 до 100 с пятью уровнями от STRONG BUY до OVERHEATED. Седьмой индикатор, MVRV Z-Score, показывает N/A, так как у CoinMetrics нет данных по SAND, поэтому оценка строится по остальным индикаторам. Сегодняшнюю оценку можно смотреть бесплатно.",
    "coinH": "Что такое Сэндбокс (SAND)?",
    "coinP": [
     "Сэндбокс (The Sandbox) — игровая платформа метавселенной, где пользователи сами создают воксельные аватары, предметы и игры и торгуют ими. Проект начинался в 2012 году как мобильная игра студии Pixowl и был перестроен на блокчейне после того, как в 2018 году Pixowl купила компания Animoca Brands. SAND — токен стандарта ERC-20 в сети Ethereum, поэтому собственного механизма консенсуса у него нет: транзакции защищает Ethereum, который после The Merge в сентябре 2022 года работает на доказательстве доли (Proof of Stake).",
     "Максимальное предложение SAND зафиксировано на уровне 3 млрд токенов; на рынок токен вышел через продажу на Binance Launchpad в августе 2020 года. Он нужен для покупки и продажи участков LAND и предметов на платформе, а также для стейкинга и голосований по управлению. Число LAND ограничено 166 464 участками. Токены команды, компании и других получателей разблокируются по заранее установленному графику вестинга, из-за чего объём в обращении постепенно растёт."
    ],
    "applyH": "Как читать индикаторы для Сэндбокс",
    "apply": [
     "Волатильность: дневные колебания SAND гораздо сильнее, чем у биткоина, поэтому RSI часто опускается ниже 30 или поднимается выше 70. Не действуйте по одному сигналу перепроданности или перекупленности — сверяйте его с разворотом MACD и трендом 50/200.",
     "Страх и жадность: отдельного индекса для SAND не существует. На экране — индекс настроений всего криптовалютного рынка от Alternative.me с упором на биткоин; новости, касающиеся только SAND, например из сектора метавселенных или игр, в нём не отражаются.",
     "MVRV Z-Score: в данных сообщества CoinMetrics нет SAND, поэтому эта карточка показывает N/A. Оценка перераспределяет вес между шестью оставшимися индикаторами, так что подтвердить дно по ончейн-себестоимости на этой странице нельзя.",
     "Множитель Майера и просадка: пороги вроде «ниже 0,8 — сильная покупка», «выше 2,4 — перегрев» или просадки −50% взяты из истории биткоина. При затяжном нисходящем тренде 365-дневная просадка может месяцами оставаться глубже −50%, поэтому сама по себе глубокая просадка не делает SAND дешёвым.",
     "Изменения предложения: оценка учитывает только цену. Плановые разблокировки по вестингу, увеличивающие объём в обращении, в индикаторах не видны — их нужно проверять отдельно."
    ],
    "histH": "Краткая история ценовых циклов Сэндбокс",
    "hist": [
     "Август 2020 — после продажи на Binance Launchpad начались торги SAND.",
     "Октябрь–ноябрь 2021 — после переименования Facebook в Meta тема метавселенных стала популярной, и в конце ноября SAND обновил исторический максимум. 29-го числа того же месяца открылся Alpha Season 1.",
     "2022 — на медвежьем крипторынке SAND упал более чем на 90% от пика.",
     "2023–2024 — даже во время общих отскоков рынка цена оставалась намного ниже максимума 2021 года."
    ],
    "faq": [
     {
      "q": "Есть ли отдельный индекс страха для Сэндбокс?",
      "a": "Нет. Индекса страха и жадности именно для Сэндбокс не существует. Значение на этой странице — ежедневный индекс всего рынка от Alternative.me с упором на биткоин, поэтому на экране он помечен как общерыночный. Собственное движение SAND смотрите по ценовым индикаторам — RSI и MACD."
     },
     {
      "q": "Показывается ли MVRV для Сэндбокс?",
      "a": "Нет. MVRV Z-Score опирается на данные сообщества CoinMetrics, где по состоянию на октябрь 2026 года нет SAND. Карточка показывает N/A, а оценка момента покупки рассчитывается по оставшимся индикаторам."
     },
     {
      "q": "Стоит ли покупать Сэндбокс сейчас?",
      "a": "Эта страница не говорит, покупать SAND или продавать. Оценка лишь показывает, где текущее сочетание индикаторов находится относительно исторических порогов. На вкладке «долгосрочно» (контртренд), которая открыта по умолчанию, она растёт, когда совпадают страх, перепроданность и глубокая просадка; на вкладке «краткосрочно» (моментум) — чем сильнее восходящий тренд. Если вкладки расходятся, вывод зависит от вашего горизонта."
     },
     {
      "q": "Просадка глубже −50% значит, что SAND дёшев?",
      "a": "Не обязательно. Просадка — это лишь разница между максимумом за последние 365 дней и текущей ценой, и пока длится нисходящий тренд, она может углубляться. Для такого волатильного токена, как SAND, её лучше читать вместе с MACD и трендом 50/200."
     },
     {
      "q": "Учитываются ли в оценке разблокировки токенов и другие изменения предложения?",
      "a": "Нет. Оценка рассчитывается только по дневным ценам и общерыночному индексу страха и жадности; график вестинга и новости проекта нужно отслеживать отдельно."
     },
     {
      "q": "Почему оценка SAND часто движется так же, как оценка биткоина?",
      "a": "Обе страницы используют одно и то же значение индекса страха и жадности, а цена SAND часто следует за биткоином и рынком в целом. Различия возникают в основном в индикаторах, рассчитанных по собственной цене SAND: RSI, MACD и множителе Майера."
     }
    ]
   },
   "nl": {
    "title": "Koop-timingscore en Angst-&-Hebzucht-index voor The Sandbox (SAND)",
    "intro": "Deze pagina berekent uit de dagkoersen van The Sandbox (SAND) de RSI(14), MACD(12·26·9), Mayer Multiple, de daling vanaf de 365-daagse top en de 50/200 golden/death cross, en combineert die met de Angst-&-Hebzucht-index van de hele cryptomarkt tot een koop-timingscore van 0 tot 100 in vijf niveaus, van STRONG BUY tot OVERHEATED. De zevende indicator, de MVRV Z-Score, staat op N/A omdat CoinMetrics geen SAND-gegevens heeft; de score wordt dus met de overige indicatoren berekend. De score van vandaag is gratis te bekijken.",
    "coinH": "Wat is The Sandbox (SAND)?",
    "coinP": [
     "The Sandbox is een metaverse-gameplatform waar gebruikers zelf voxel-avatars, items en games bouwen en verhandelen. Het begon in 2012 als mobiele game van Pixowl en werd op de blockchain opnieuw opgebouwd nadat Animoca Brands Pixowl in 2018 had overgenomen. SAND is een ERC-20-token op Ethereum en heeft dus geen eigen consensusmechanisme; transacties leunen op de beveiliging van Ethereum, dat sinds The Merge in september 2022 proof of stake gebruikt.",
     "Het maximale aanbod van SAND ligt vast op 3 miljard tokens; de token kwam in augustus 2020 op de markt via een verkoop op Binance Launchpad. Hij wordt gebruikt om LAND-percelen en items op het platform te kopen en verkopen, en voor staking en governance-stemmingen. Het aantal LAND is beperkt tot 166.464 percelen. Tokens voor het team, het bedrijf en andere ontvangers komen vrij volgens een vast vestingschema, waardoor het circulerende aanbod geleidelijk is gegroeid."
    ],
    "applyH": "Indicatoren lezen bij The Sandbox",
    "apply": [
     "Volatiliteit: SAND beweegt per dag veel sterker dan bitcoin, dus de RSI zakt vaak onder 30 of stijgt boven 70. Handel niet op één oversold- of overbought-signaal, maar toets het aan de MACD-ommekeer en de 50/200-trend.",
     "Angst & Hebzucht: een aparte index voor SAND bestaat niet. Je ziet de op bitcoin gerichte sentimentindex van Alternative.me voor de hele cryptomarkt; nieuws dat alleen SAND raakt, zoals uit de metaverse- of gamingsector, komt er niet in terug.",
     "MVRV Z-Score: de communitydata van CoinMetrics bevatten SAND niet, dus deze kaart toont N/A. De score herverdeelt de gewichten over de overige zes indicatoren; een bodem op basis van on-chain kostprijs kun je op deze pagina dus niet bevestigen.",
     "Mayer Multiple en daling: drempels als onder 0,8 voor sterk kopen, boven 2,4 voor oververhitting of een daling van -50% komen uit de geschiedenis van bitcoin. In een lange neerwaartse trend kan de 365-daagse daling maandenlang dieper dan -50% blijven, dus een diepe daling alleen maakt SAND niet goedkoop.",
     "Aanbodveranderingen: de score gebruikt alleen de prijs. Geplande vesting-vrijgaven die het circulerende aanbod vergroten, zie je niet terug in de indicatoren; controleer die apart."
    ],
    "histH": "Overzicht van de prijscycli van The Sandbox",
    "hist": [
     "Augustus 2020 — na de verkoop op Binance Launchpad begint de handel in SAND.",
     "Oktober–november 2021 — nadat Facebook zich Meta is gaan noemen, raakt de metaverse in trek en bereikt SAND eind november zijn hoogste koers ooit. Op de 29e van die maand opent Alpha Season 1.",
     "2022 — in de crypto-berenmarkt daalt SAND meer dan 90% vanaf de top.",
     "2023–2024 — zelfs tijdens herstel van de hele markt blijft de koers ver onder de top van 2021."
    ],
    "faq": [
     {
      "q": "Bestaat er een aparte Angst-&-Hebzucht-index voor The Sandbox?",
      "a": "Nee. Er is geen Angst-&-Hebzucht-index speciaal voor The Sandbox. De waarde op deze pagina is de op bitcoin gerichte index voor de hele markt die Alternative.me dagelijks publiceert; daarom staat hij op het scherm als marktbrede waarde. Voor de eigen beweging van SAND kijk je naar prijsindicatoren zoals RSI en MACD."
     },
     {
      "q": "Toont The Sandbox een MVRV?",
      "a": "Nee. De MVRV Z-Score steunt op communitydata van CoinMetrics, waarin SAND in oktober 2026 ontbrak. De kaart toont N/A en de koop-timingscore wordt met de overige indicatoren berekend."
     },
     {
      "q": "Moet ik The Sandbox nu kopen?",
      "a": "Deze pagina zegt niet of je SAND moet kopen of verkopen. De score laat alleen zien waar de huidige combinatie van indicatoren staat ten opzichte van historische drempels. Op het standaardtabblad lange termijn (contrair) stijgt hij als angst, oversold-signalen en diepe dalingen samenvallen; op het tabblad korte termijn (momentum) stijgt hij met de kracht van de opwaartse trend. Zijn de twee tabbladen het oneens, dan hangt de uitleg af van je beleggingshorizon."
     },
     {
      "q": "Betekent een daling van meer dan -50% dat SAND goedkoop is?",
      "a": "Niet per se. De daling is alleen het verschil tussen de hoogste koers van de afgelopen 365 dagen en de huidige koers, en kan verder oplopen zolang de neerwaartse trend aanhoudt. Bij een volatiele token als SAND lees je hem beter samen met de MACD en de 50/200-trend."
     },
     {
      "q": "Telt het vrijkomen van tokens of een andere aanbodverandering mee in de score?",
      "a": "Nee. De score wordt alleen berekend uit dagkoersen en de marktbrede Angst-&-Hebzucht-index; vestingdata en projectnieuws moet je apart volgen."
     },
     {
      "q": "Waarom beweegt de SAND-score vaak mee met de bitcoinscore?",
      "a": "Beide pagina's gebruiken dezelfde Angst-&-Hebzucht-waarde, en de SAND-koers volgt vaak bitcoin en de bredere markt. Verschillen ontstaan vooral bij indicatoren die op de eigen SAND-koers zijn gebaseerd, zoals RSI, MACD en Mayer Multiple."
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
