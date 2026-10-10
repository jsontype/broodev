/* 하단 SEO 본문 다국어 데이터 + 렌더러. index.html(광고) / member/index.html(구독자) 공유.
   언어 전환 시 window.renderSEO(lang) 호출 → section.seo 를 해당 언어로 다시 그림.
   기본 정적 HTML(한국어)은 무JS 크롤러용 폴백으로 남겨두고, JS 실행 시 현재 언어로 교체. */
(function () {
  var SEO = {
    ko: {
      title: '도지코인 공포·탐욕 지수 & 매수 타이밍 점수',
      intro: '도지코인 공포지수(공포·탐욕 지수, Fear & Greed Index)를 포함한 7개 실시간 지표를 합성해 “지금이 매수 타이밍인가?”를 0~100 점수로 보여주는 무료 대시보드입니다. 설치 없이 브라우저에서 바로 실행되며 13개 언어를 지원합니다.',
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
        { q: '공포지수가 낮으면 도지코인을 사야 하나요?', a: '극단적 공포는 역사적으로 분할 매수 기회였던 경우가 많지만, 공포지수 하나만 보면 “떨어지는 칼날”을 잡을 위험이 있습니다. 본 점수는 RSI·MACD·마이어 배수·낙폭·이동평균 크로스를 함께 보고, 하락 추세에서는 점수를 보수적으로 낮춥니다.' },
        { q: '매수 타이밍 점수는 어떻게 계산되나요?', a: '7개 지표를 각각 0~100 부분점수로 환산해 가중 합성합니다. 결과는 0~100이며 5단계 밴드로 표시됩니다.' },
        { q: '무료인가요? 설치가 필요한가요?', a: '완전 무료이며 설치가 필요 없습니다. CoinGecko·Binance·Alternative.me 공개 API에서 실시간 데이터를 가져옵니다.' },
        { q: '공포지수와 매수 타이밍 점수는 무엇이 다른가요?', a: '공포지수는 심리 한 가지 지표(0~100)이고, 매수 타이밍 점수는 공포지수를 포함한 7개 지표를 합성한 종합 점수(0~100)입니다.' },
        { q: '공포지수 데이터는 어디서 가져오나요? 얼마나 자주 갱신되나요?', a: '공포·탐욕 지수는 Alternative.me, 가격·일봉은 CoinGecko·Binance, 온체인 지표는 CoinMetrics 공개 API에서 실시간으로 가져옵니다. 화면은 약 1분 주기로 자동 갱신됩니다.' },
        { q: '도지코인 지금 사도 되나요?', a: '정답은 없지만, 매수 타이밍 점수(0~100)로 현재 시장이 과매도·공포 구간인지 과열·탐욕 구간인지 객관적으로 가늠할 수 있습니다. 장기(역발상) 탭 기준 점수가 높을수록 공포·저평가가 겹친 분할 매수 우호 구간, 낮을수록 과열 경계 구간입니다. 참고 신호일 뿐 투자 자문이 아닙니다.' },
        { q: '단기와 장기 매수 타이밍은 어떻게 다른가요?', a: '점수는 단기·장기 두 탭으로 나뉩니다. 단기(모멘텀)는 약 1~3개월 추세추종 관점으로 상승 추세가 강할수록 높고, 장기(역발상)는 약 1년 이상 사이클 관점으로 공포·저평가일수록 높습니다. 2017년 이후 백테스트에서 단기는 모멘텀, 장기는 역발상 방향이 더 잘 맞았습니다.' },
        { q: 'BOTTOM RADAR(바닥 점수)는 무엇인가요?', a: 'MVRV Z-점수 같은 온체인 지표로 시가총액이 투자자 평균 매수원가 대비 어디에 있는지 재서, 역사적 바닥 구간과의 근접도를 0~100으로 보여주는 보조 게이지입니다. 계산 근거는 “비트코인 바닥” 해설 페이지에 공개되어 있습니다.' }
      ],
      disclaimer: '⚠ 본 점수는 공개 지표를 합성한 참고 신호이며 투자 자문이 아닙니다. 모든 투자 판단과 책임은 이용자 본인에게 있습니다.'
    },
    en: {
      title: 'Dogecoin Fear & Greed Index & Buy-Timing Score',
      intro: 'A free dashboard that synthesizes 7 real-time indicators — including the Dogecoin Fear & Greed Index — into a 0–100 “is now a good time to buy?” score. Runs in your browser with no install, in 13 languages.',
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
        { q: 'Should I buy Dogecoin when the index is low?', a: 'Extreme fear has often been an accumulation opportunity, but relying on the index alone risks catching a falling knife. This score also weighs RSI, MACD, Mayer Multiple, drawdown and moving-average crosses, and lowers the score conservatively in downtrends.' },
        { q: 'How is the buy-timing score calculated?', a: 'Each of the 7 indicators is converted to a 0–100 sub-score and weighted together. The result is 0–100, shown in 5 bands.' },
        { q: 'Is it free? Do I need to install anything?', a: 'It is completely free with no install. Real-time data comes from CoinGecko, Binance and Alternative.me public APIs.' },
        { q: 'How is the index different from the buy-timing score?', a: 'The index is a single sentiment metric (0–100); the buy-timing score is a composite of 7 indicators including the index (0–100).' },
        { q: 'Where does the data come from, and how often does it refresh?', a: 'The Fear & Greed Index comes from Alternative.me, prices and daily candles from the CoinGecko and Binance public APIs, and on-chain metrics from CoinMetrics. The screen auto-refreshes roughly every minute.' },
        { q: 'Should I buy Dogecoin right now?', a: 'There is no single answer, but the buy-timing score (0–100) gives an objective read on whether the market is in an oversold/fear zone or an overheated/greed zone. On the long-term (contrarian) tab, higher scores mark zones where fear and undervaluation overlap — historically favorable for DCA — while lower scores warn of overheating. It is a reference signal, not investment advice.' },
        { q: 'How do short-term and long-term buy timing differ?', a: 'The score is split into two tabs. Short-term (momentum) takes a 1–3 month trend-following view and rises with strong uptrends; long-term (contrarian) takes a 1-year-plus cycle view and rises with fear and undervaluation. In backtests since 2017, momentum worked better short-term and contrarian worked better long-term.' },
        { q: 'What is the BOTTOM RADAR (bottom score)?', a: 'A secondary gauge that uses on-chain metrics such as the MVRV Z-Score to measure where market cap sits relative to investors’ average cost basis, showing proximity to historic bottom zones on a 0–100 scale. The full calculation is published on the “Bitcoin bottom” guide page.' }
      ],
      disclaimer: '⚠ This score is a reference signal built from public indicators, not investment advice. All decisions and responsibility are your own.'
    },
    ja: {
      title: 'ドージコイン 恐怖・強欲指数 & 買い時スコア',
      intro: 'ドージコインの恐怖・強欲指数（Fear & Greed Index）を含む7つのリアルタイム指標を合成し、「今が買い時か？」を0〜100のスコアで示す無料ダッシュボードです。インストール不要でブラウザから即実行、13言語対応。',
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
        { q: '指数が低ければドージコインを買うべき？', a: '極端な恐怖は歴史的に分割買いの好機だったことが多いですが、指数だけに頼ると「落ちるナイフ」を掴む危険があります。本スコアはRSI・MACD・マイヤー倍率・下落率・移動平均クロスも合わせて見て、下落トレンドでは保守的にスコアを下げます。' },
        { q: '買い時スコアはどう計算される？', a: '7指標をそれぞれ0〜100の部分スコアに換算し加重合成します。結果は0〜100で、5段階バンドで表示します。' },
        { q: '無料？インストールは必要？', a: '完全無料・インストール不要です。CoinGecko・Binance・Alternative.me の公開APIからリアルタイムデータを取得します。' },
        { q: '指数と買い時スコアの違いは？', a: '指数は心理1指標(0〜100)、買い時スコアは指数を含む7指標を合成した総合スコア(0〜100)です。' },
        { q: 'データはどこから？更新頻度は？', a: '恐怖・強欲指数はAlternative.me、価格・日足はCoinGecko・Binance、オンチェーン指標はCoinMetricsの公開APIからリアルタイムで取得します。画面は約1分ごとに自動更新されます。' },
        { q: 'ドージコインは今買ってもいい？', a: '正解はありませんが、買い時スコア(0〜100)で現在の市場が売られすぎ・恐怖圏か、過熱・強欲圏かを客観的に測れます。長期（逆張り）タブではスコアが高いほど恐怖と割安が重なる分割買いに有利な圏、低いほど過熱警戒圏です。参考シグナルであり投資助言ではありません。' },
        { q: '短期と長期の買い時はどう違う？', a: 'スコアは短期・長期の2タブに分かれます。短期（モメンタム）は約1〜3か月のトレンドフォロー視点で上昇トレンドが強いほど高く、長期（逆張り）は約1年以上のサイクル視点で恐怖・割安なほど高くなります。2017年以降のバックテストでは、短期はモメンタム、長期は逆張りの方向がより有効でした。' },
        { q: 'BOTTOM RADAR（底値スコア）とは？', a: 'MVRV Zスコアなどのオンチェーン指標で、時価総額が投資家の平均取得単価に対してどの位置にあるかを測り、歴史的な底値圏への近さを0〜100で示す補助ゲージです。計算根拠は「ビットコインの底」解説ページで公開しています。' }
      ],
      disclaimer: '⚠ 本スコアは公開指標を合成した参考シグナルであり、投資助言ではありません。すべての判断と責任は利用者ご自身にあります。'
    },
    zh: {
      title: '狗狗币恐惧与贪婪指数 & 买入时机评分',
      intro: '一个免费仪表板，将包括狗狗币恐惧与贪婪指数（Fear & Greed Index）在内的7个实时指标合成为0–100的“现在是买入时机吗？”评分。无需安装，浏览器即开即用，支持13种语言。',
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
        { q: '指数低就该买狗狗币吗？', a: '极度恐惧在历史上常是分批买入良机，但只看指数有“接飞刀”的风险。本评分同时参考RSI、MACD、梅耶倍数、回撤与均线交叉，并在下跌趋势中保守下调评分。' },
        { q: '买入时机评分如何计算？', a: '将7个指标各自换算为0–100分项评分并加权合成。结果为0–100，以5档显示。' },
        { q: '免费吗？需要安装吗？', a: '完全免费、无需安装。实时数据来自 CoinGecko、Binance、Alternative.me 公开API。' },
        { q: '指数与买入时机评分有何不同？', a: '指数是单一情绪指标(0–100)；买入时机评分是包含该指数在内的7指标综合评分(0–100)。' },
        { q: '数据来自哪里？多久更新一次？', a: '恐惧与贪婪指数来自Alternative.me，价格与日K来自CoinGecko和Binance公开API，链上指标来自CoinMetrics。页面约每1分钟自动刷新。' },
        { q: '现在可以买狗狗币吗？', a: '没有标准答案，但买入时机评分(0–100)能客观判断当前市场处于超卖·恐惧区还是过热·贪婪区。在长期（逆向）标签页中，评分越高代表恐惧与低估重叠、历史上利于分批买入的区间；越低则是过热警戒区。仅供参考，并非投资建议。' },
        { q: '短期和长期买入时机有何不同？', a: '评分分为短期、长期两个标签页。短期（动量）以约1–3个月的趋势跟随视角，上升趋势越强评分越高；长期（逆向）以约1年以上的周期视角，越恐惧、越低估评分越高。2017年以来的回测显示，短期动量、长期逆向的方向更有效。' },
        { q: 'BOTTOM RADAR（底部评分）是什么？', a: '一个辅助仪表，利用MVRV Z分数等链上指标衡量市值相对投资者平均持仓成本的位置，以0–100显示与历史底部区间的接近程度。计算依据在“比特币底部”解读页面公开。' }
      ],
      disclaimer: '⚠ 本评分由公开指标合成，仅供参考，并非投资建议。一切投资决定与责任由用户自负。'
    },
    'zh-Hant': {
      title: '狗狗幣恐懼與貪婪指數 & 買入時機評分',
      intro: '一個免費儀表板，將包括狗狗幣恐懼與貪婪指數（Fear & Greed Index）在內的7個即時指標合成為0–100的「現在是買入時機嗎？」評分。免安裝、瀏覽器即開即用，支援13種語言。',
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
        { q: '指數低就該買狗狗幣嗎？', a: '極度恐懼在歷史上常是分批買入良機，但只看指數有「接飛刀」的風險。本評分同時參考RSI、MACD、梅耶倍數、回撤與均線交叉，並在下跌趨勢中保守下調評分。' },
        { q: '買入時機評分如何計算？', a: '將7個指標各自換算為0–100分項評分並加權合成。結果為0–100，以5檔顯示。' },
        { q: '免費嗎？需要安裝嗎？', a: '完全免費、免安裝。即時資料來自 CoinGecko、Binance、Alternative.me 公開API。' },
        { q: '指數與買入時機評分有何不同？', a: '指數是單一情緒指標(0–100)；買入時機評分是包含該指數在內的7指標綜合評分(0–100)。' },
        { q: '資料來自哪裡？多久更新一次？', a: '恐懼與貪婪指數來自Alternative.me，價格與日K來自CoinGecko和Binance公開API，鏈上指標來自CoinMetrics。頁面約每1分鐘自動重新整理。' },
        { q: '現在可以買狗狗幣嗎？', a: '沒有標準答案，但買入時機評分(0–100)能客觀判斷當前市場處於超賣·恐懼區還是過熱·貪婪區。在長期（逆向）分頁中，評分越高代表恐懼與低估重疊、歷史上利於分批買入的區間；越低則是過熱警戒區。僅供參考，並非投資建議。' },
        { q: '短期和長期買入時機有何不同？', a: '評分分為短期、長期兩個分頁。短期（動量）以約1–3個月的趨勢跟隨視角，上升趨勢越強評分越高；長期（逆向）以約1年以上的週期視角，越恐懼、越低估評分越高。2017年以來的回測顯示，短期動量、長期逆向的方向更有效。' },
        { q: 'BOTTOM RADAR（底部評分）是什麼？', a: '一個輔助儀表，利用MVRV Z分數等鏈上指標衡量市值相對投資者平均持倉成本的位置，以0–100顯示與歷史底部區間的接近程度。計算依據在「比特幣底部」解說頁面公開。' }
      ],
      disclaimer: '⚠ 本評分由公開指標合成，僅供參考，並非投資建議。一切投資決定與責任由用戶自負。'
    },
    es: {
      title: 'Índice de miedo y codicia de Dogecoin y puntuación de momento de compra',
      intro: 'Un panel gratuito que sintetiza 7 indicadores en tiempo real —incluido el índice de miedo y codicia de Dogecoin— en una puntuación de 0 a 100 sobre «¿es buen momento para comprar?». Funciona en el navegador sin instalación, en 13 idiomas.',
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
        { q: '¿Debo comprar Dogecoin cuando el índice está bajo?', a: 'El miedo extremo ha sido a menudo una oportunidad de acumulación, pero fiarse solo del índice arriesga «atrapar un cuchillo que cae». Esta puntuación también pondera RSI, MACD, múltiplo de Mayer, caída y cruces de medias, y la reduce de forma conservadora en tendencias bajistas.' },
        { q: '¿Cómo se calcula la puntuación de compra?', a: 'Cada uno de los 7 indicadores se convierte en una subpuntuación de 0 a 100 y se pondera. El resultado es 0–100, mostrado en 5 bandas.' },
        { q: '¿Es gratis? ¿Necesito instalar algo?', a: 'Es totalmente gratis y sin instalación. Los datos en tiempo real provienen de las API públicas de CoinGecko, Binance y Alternative.me.' },
        { q: '¿En qué se diferencia el índice de la puntuación de compra?', a: 'El índice es una sola métrica de sentimiento (0–100); la puntuación de compra es un compuesto de 7 indicadores que incluye el índice (0–100).' },
        { q: '¿De dónde vienen los datos y con qué frecuencia se actualizan?', a: 'El índice de miedo y codicia viene de Alternative.me; los precios y velas diarias, de las API públicas de CoinGecko y Binance; y las métricas on-chain, de CoinMetrics. La pantalla se actualiza automáticamente cada minuto aproximadamente.' },
        { q: '¿Debería comprar Dogecoin ahora mismo?', a: 'No hay una respuesta única, pero la puntuación de compra (0–100) permite valorar objetivamente si el mercado está en zona de sobreventa/miedo o de recalentamiento/codicia. En la pestaña de largo plazo (contraria), puntuaciones altas marcan zonas donde coinciden miedo e infravaloración —históricamente favorables al DCA—, y las bajas avisan de recalentamiento. Es una señal de referencia, no asesoramiento de inversión.' },
        { q: '¿En qué se diferencian el timing de corto y de largo plazo?', a: 'La puntuación se divide en dos pestañas. El corto plazo (momentum) adopta una visión de seguimiento de tendencia de 1–3 meses y sube con tendencias alcistas fuertes; el largo plazo (contrario) adopta una visión de ciclo de más de un año y sube con miedo e infravaloración. En backtests desde 2017, el momentum funcionó mejor a corto y lo contrario a largo.' },
        { q: '¿Qué es el BOTTOM RADAR (puntuación de suelo)?', a: 'Un indicador auxiliar que usa métricas on-chain como el MVRV Z-Score para medir dónde está la capitalización respecto al coste medio de los inversores, mostrando la cercanía a zonas de suelo históricas en una escala de 0 a 100. El cálculo completo está publicado en la guía «suelo de Bitcoin».' }
      ],
      disclaimer: '⚠ Esta puntuación es una señal de referencia a partir de indicadores públicos, no asesoramiento de inversión. Todas las decisiones y la responsabilidad son tuyas.'
    },
    fr: {
      title: 'Indice de peur et d’avidité Dogecoin et score de timing d’achat',
      intro: 'Un tableau de bord gratuit qui synthétise 7 indicateurs en temps réel — dont l’indice de peur et d’avidité Dogecoin — en un score de 0 à 100 « est-ce le bon moment pour acheter ? ». Fonctionne dans le navigateur sans installation, en 13 langues.',
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
        { q: 'Dois-je acheter du Dogecoin quand l’indice est bas ?', a: 'La peur extrême a souvent été une opportunité d’accumulation, mais se fier au seul indice risque d’« attraper un couteau qui tombe ». Ce score pondère aussi RSI, MACD, multiple de Mayer, repli et croisements de moyennes, et le réduit prudemment en tendance baissière.' },
        { q: 'Comment le score de timing d’achat est-il calculé ?', a: 'Chacun des 7 indicateurs est converti en sous-score de 0 à 100 puis pondéré. Le résultat est 0–100, affiché en 5 bandes.' },
        { q: 'Est-ce gratuit ? Faut-il installer quelque chose ?', a: 'C’est entièrement gratuit et sans installation. Les données en temps réel proviennent des API publiques de CoinGecko, Binance et Alternative.me.' },
        { q: 'Quelle différence entre l’indice et le score de timing d’achat ?', a: 'L’indice est une seule mesure de sentiment (0–100) ; le score de timing d’achat est un composite de 7 indicateurs incluant l’indice (0–100).' },
        { q: 'D’où viennent les données et à quelle fréquence sont-elles actualisées ?', a: 'L’indice de peur et d’avidité vient d’Alternative.me ; les prix et bougies journalières, des API publiques de CoinGecko et Binance ; et les métriques on-chain, de CoinMetrics. L’écran se rafraîchit automatiquement environ chaque minute.' },
        { q: 'Dois-je acheter du Dogecoin maintenant ?', a: 'Il n’y a pas de réponse unique, mais le score de timing d’achat (0–100) permet d’évaluer objectivement si le marché est en zone de survente/peur ou de surchauffe/avidité. Dans l’onglet long terme (contrarian), des scores élevés marquent des zones où peur et sous-évaluation se recoupent — historiquement favorables au DCA — tandis que des scores bas signalent la surchauffe. C’est un signal de référence, pas un conseil en investissement.' },
        { q: 'Quelle différence entre le timing court terme et long terme ?', a: 'Le score est divisé en deux onglets. Le court terme (momentum) adopte une vue de suivi de tendance sur 1 à 3 mois et monte avec les tendances haussières fortes ; le long terme (contrarian) adopte une vue de cycle d’un an et plus et monte avec la peur et la sous-évaluation. Dans les backtests depuis 2017, le momentum a mieux fonctionné à court terme et le contrarian à long terme.' },
        { q: 'Qu’est-ce que le BOTTOM RADAR (score de plancher) ?', a: 'Une jauge auxiliaire qui utilise des métriques on-chain comme le MVRV Z-Score pour mesurer où se situe la capitalisation par rapport au coût moyen des investisseurs, en montrant la proximité des zones de plancher historiques sur une échelle de 0 à 100. Le calcul complet est publié sur la page « plancher du Bitcoin ».' }
      ],
      disclaimer: '⚠ Ce score est un signal de référence issu d’indicateurs publics, pas un conseil en investissement. Toutes les décisions et la responsabilité vous appartiennent.'
    },
    de: {
      title: 'Dogecoin Angst- & Gier-Index & Kaufzeitpunkt-Score',
      intro: 'Ein kostenloses Dashboard, das 7 Echtzeit-Indikatoren — inkl. Dogecoin Angst- & Gier-Index — zu einem 0–100-Score „Ist jetzt ein guter Kaufzeitpunkt?“ zusammenführt. Läuft im Browser ohne Installation, in 13 Sprachen.',
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
        { q: 'Soll ich Dogecoin kaufen, wenn der Index niedrig ist?', a: 'Extreme Angst war historisch oft eine Akkumulationschance, doch sich allein auf den Index zu verlassen, birgt das Risiko, „ins fallende Messer zu greifen“. Dieser Score gewichtet auch RSI, MACD, Mayer-Multiple, Rückgang und MA-Kreuzungen und senkt den Wert in Abwärtstrends konservativ.' },
        { q: 'Wie wird der Kaufzeitpunkt-Score berechnet?', a: 'Jeder der 7 Indikatoren wird in einen 0–100-Teil-Score umgerechnet und gewichtet. Das Ergebnis ist 0–100, in 5 Bändern dargestellt.' },
        { q: 'Ist es kostenlos? Muss ich etwas installieren?', a: 'Es ist völlig kostenlos und ohne Installation. Echtzeitdaten stammen aus den öffentlichen APIs von CoinGecko, Binance und Alternative.me.' },
        { q: 'Wie unterscheidet sich der Index vom Kaufzeitpunkt-Score?', a: 'Der Index ist eine einzelne Stimmungskennzahl (0–100); der Kaufzeitpunkt-Score ist ein Verbund aus 7 Indikatoren inkl. Index (0–100).' },
        { q: 'Woher stammen die Daten und wie oft werden sie aktualisiert?', a: 'Der Angst- & Gier-Index stammt von Alternative.me, Preise und Tageskerzen von den öffentlichen APIs von CoinGecko und Binance, On-Chain-Metriken von CoinMetrics. Der Bildschirm aktualisiert sich etwa jede Minute automatisch.' },
        { q: 'Sollte ich Dogecoin jetzt kaufen?', a: 'Eine eindeutige Antwort gibt es nicht, aber der Kaufzeitpunkt-Score (0–100) zeigt objektiv, ob der Markt in einer überverkauften Angst-Zone oder einer überhitzten Gier-Zone steckt. Auf dem Langfrist-Tab (antizyklisch) markieren hohe Werte Zonen, in denen Angst und Unterbewertung zusammenfallen — historisch günstig für DCA —, niedrige warnen vor Überhitzung. Ein Referenzsignal, keine Anlageberatung.' },
        { q: 'Wie unterscheiden sich kurz- und langfristiges Kauftiming?', a: 'Der Score ist in zwei Tabs geteilt. Kurzfristig (Momentum) folgt einer Trendfolge-Sicht von 1–3 Monaten und steigt mit starken Aufwärtstrends; langfristig (antizyklisch) folgt einer Zyklus-Sicht von über einem Jahr und steigt mit Angst und Unterbewertung. In Backtests seit 2017 funktionierte kurzfristig Momentum und langfristig die antizyklische Richtung besser.' },
        { q: 'Was ist der BOTTOM RADAR (Boden-Score)?', a: 'Eine Zusatzanzeige, die mit On-Chain-Metriken wie den MVRV Z-Score misst, wo die Marktkapitalisierung relativ zum durchschnittlichen Einstandskurs der Anleger liegt, und die Nähe zu historischen Bodenzonen auf einer Skala von 0–100 zeigt. Die vollständige Berechnung ist auf der Seite „Bitcoin-Boden“ veröffentlicht.' }
      ],
      disclaimer: '⚠ Dieser Score ist ein Referenzsignal aus öffentlichen Indikatoren, keine Anlageberatung. Alle Entscheidungen und die Verantwortung liegen bei Ihnen.'
    },
    it: {
      title: 'Indice di paura e avidità Dogecoin e punteggio di timing d’acquisto',
      intro: 'Una dashboard gratuita che sintetizza 7 indicatori in tempo reale — incluso l’indice di paura e avidità di Dogecoin — in un punteggio 0–100 «è il momento giusto per comprare?». Funziona nel browser senza installazione, in 13 lingue.',
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
        { q: 'Dovrei comprare Dogecoin quando l’indice è basso?', a: 'La paura estrema è stata spesso un’occasione di accumulo, ma affidarsi solo all’indice rischia di «prendere un coltello che cade». Questo punteggio pesa anche RSI, MACD, multiplo di Mayer, ribasso e incroci di medie, e lo riduce in modo prudente nei trend ribassisti.' },
        { q: 'Come si calcola il punteggio d’acquisto?', a: 'Ciascuno dei 7 indicatori è convertito in un sotto-punteggio 0–100 e ponderato. Il risultato è 0–100, mostrato in 5 bande.' },
        { q: 'È gratis? Serve installare qualcosa?', a: 'È completamente gratis e senza installazione. I dati in tempo reale provengono dalle API pubbliche di CoinGecko, Binance e Alternative.me.' },
        { q: 'Che differenza c’è tra l’indice e il punteggio d’acquisto?', a: 'L’indice è una singola misura di sentiment (0–100); il punteggio d’acquisto è un composito dei 7 indicatori incluso l’indice (0–100).' },
        { q: 'Da dove vengono i dati e con che frequenza si aggiornano?', a: 'L’indice di paura e avidità viene da Alternative.me; prezzi e candele giornaliere dalle API pubbliche di CoinGecko e Binance; le metriche on-chain da CoinMetrics. Lo schermo si aggiorna automaticamente circa ogni minuto.' },
        { q: 'Dovrei comprare Dogecoin adesso?', a: 'Non c’è una risposta unica, ma il punteggio d’acquisto (0–100) permette di valutare oggettivamente se il mercato è in zona ipervenduto/paura o surriscaldato/avidità. Nella scheda a lungo termine (contrarian), punteggi alti indicano zone in cui paura e sottovalutazione coincidono — storicamente favorevoli al PAC — mentre punteggi bassi avvertono del surriscaldamento. È un segnale di riferimento, non consulenza d’investimento.' },
        { q: 'Che differenza c’è tra timing a breve e a lungo termine?', a: 'Il punteggio è diviso in due schede. Il breve termine (momentum) adotta una visione trend-following di 1–3 mesi e sale con trend rialzisti forti; il lungo termine (contrarian) adotta una visione di ciclo oltre l’anno e sale con paura e sottovalutazione. Nei backtest dal 2017, il momentum ha funzionato meglio nel breve e il contrarian nel lungo.' },
        { q: 'Cos’è il BOTTOM RADAR (punteggio di minimo)?', a: 'Un indicatore ausiliario che usa metriche on-chain come l’MVRV Z-Score per misurare dove si trova la capitalizzazione rispetto al costo medio degli investitori, mostrando la vicinanza alle zone di minimo storiche su una scala 0–100. Il calcolo completo è pubblicato nella guida «minimo di Bitcoin».' }
      ],
      disclaimer: '⚠ Questo punteggio è un segnale di riferimento da indicatori pubblici, non consulenza d’investimento. Ogni decisione e responsabilità è tua.'
    },
    pt: {
      title: 'Índice de medo e ganância do Dogecoin e pontuação de momento de compra',
      intro: 'Um painel gratuito que sintetiza 7 indicadores em tempo real — incluindo o índice de medo e ganância do Dogecoin — numa pontuação de 0 a 100 «é uma boa hora para comprar?». Roda no navegador sem instalação, em 13 idiomas.',
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
        { q: 'Devo comprar Dogecoin quando o índice está baixo?', a: 'O medo extremo foi muitas vezes uma oportunidade de acumulação, mas confiar só no índice arrisca «pegar uma faca caindo». Esta pontuação também pondera RSI, MACD, múltiplo de Mayer, queda e cruzamentos de médias, e a reduz de forma conservadora em tendências de baixa.' },
        { q: 'Como a pontuação de compra é calculada?', a: 'Cada um dos 7 indicadores é convertido numa subpontuação de 0 a 100 e ponderado. O resultado é 0–100, em 5 faixas.' },
        { q: 'É grátis? Preciso instalar algo?', a: 'É totalmente grátis e sem instalação. Os dados em tempo real vêm das APIs públicas da CoinGecko, Binance e Alternative.me.' },
        { q: 'Qual a diferença entre o índice e a pontuação de compra?', a: 'O índice é uma única métrica de sentimento (0–100); a pontuação de compra é um composto de 7 indicadores incluindo o índice (0–100).' },
        { q: 'De onde vêm os dados e com que frequência são atualizados?', a: 'O índice de medo e ganância vem da Alternative.me; preços e velas diárias, das APIs públicas da CoinGecko e da Binance; e as métricas on-chain, da CoinMetrics. A tela atualiza automaticamente a cada minuto, aproximadamente.' },
        { q: 'Devo comprar Dogecoin agora?', a: 'Não há resposta única, mas a pontuação de compra (0–100) permite avaliar objetivamente se o mercado está em zona de sobrevenda/medo ou de superaquecimento/ganância. Na aba de longo prazo (contrária), pontuações altas marcam zonas onde medo e subvalorização coincidem — historicamente favoráveis ao DCA —, e as baixas alertam para superaquecimento. É um sinal de referência, não consultoria de investimento.' },
        { q: 'Qual a diferença entre o timing de curto e de longo prazo?', a: 'A pontuação divide-se em duas abas. O curto prazo (momentum) adota uma visão de seguimento de tendência de 1–3 meses e sobe com tendências de alta fortes; o longo prazo (contrário) adota uma visão de ciclo de mais de um ano e sobe com medo e subvalorização. Em backtests desde 2017, o momentum funcionou melhor no curto e o contrário no longo.' },
        { q: 'O que é o BOTTOM RADAR (pontuação de fundo)?', a: 'Um medidor auxiliar que usa métricas on-chain como o MVRV Z-Score para medir onde a capitalização está em relação ao custo médio dos investidores, mostrando a proximidade de zonas de fundo históricas numa escala de 0 a 100. O cálculo completo está publicado no guia «fundo do Bitcoin».' }
      ],
      disclaimer: '⚠ Esta pontuação é um sinal de referência a partir de indicadores públicos, não é consultoria de investimento. Todas as decisões e a responsabilidade são suas.'
    },
    ru: {
      title: 'Индекс страха и жадности догикоина и оценка времени покупки',
      intro: 'Бесплатная панель, которая объединяет 7 индикаторов в реальном времени — включая индекс страха и жадности догикоина — в оценку от 0 до 100 «подходящее ли сейчас время для покупки?». Работает в браузере без установки, на 13 языках.',
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
        { q: 'Покупать ли догикоин, когда индекс низкий?', a: 'Крайний страх исторически часто был возможностью накопления, но полагаться только на индекс рискованно — можно «поймать падающий нож». Эта оценка также учитывает RSI, MACD, множитель Майера, просадку и пересечения средних и консервативно снижается в нисходящих трендах.' },
        { q: 'Как рассчитывается оценка покупки?', a: 'Каждый из 7 индикаторов переводится в частную оценку 0–100 и взвешивается. Результат — 0–100, в 5 диапазонах.' },
        { q: 'Это бесплатно? Нужно ли что-то устанавливать?', a: 'Полностью бесплатно и без установки. Данные в реальном времени берутся из публичных API CoinGecko, Binance и Alternative.me.' },
        { q: 'Чем индекс отличается от оценки покупки?', a: 'Индекс — одна метрика настроения (0–100); оценка покупки — составной показатель из 7 индикаторов, включая индекс (0–100).' },
        { q: 'Откуда берутся данные и как часто они обновляются?', a: 'Индекс страха и жадности — с Alternative.me; цены и дневные свечи — из публичных API CoinGecko и Binance; ончейн-метрики — из CoinMetrics. Экран автоматически обновляется примерно раз в минуту.' },
        { q: 'Стоит ли покупать догикоин прямо сейчас?', a: 'Единственно верного ответа нет, но оценка покупки (0–100) объективно показывает, находится ли рынок в зоне перепроданности/страха или перегрева/жадности. На вкладке долгосрочного (контртрендового) взгляда высокие значения отмечают зоны, где совпадают страх и недооценка — исторически благоприятные для усреднения, — а низкие предупреждают о перегреве. Это справочный сигнал, а не инвестиционная рекомендация.' },
        { q: 'Чем отличаются краткосрочный и долгосрочный тайминг?', a: 'Оценка разделена на две вкладки. Краткосрочная (моментум) использует трендследящий взгляд на 1–3 месяца и растёт при сильных восходящих трендах; долгосрочная (контртренд) — циклический взгляд от года и растёт при страхе и недооценке. В бэктестах с 2017 года на коротком горизонте лучше работал моментум, на длинном — контртренд.' },
        { q: 'Что такое BOTTOM RADAR (оценка дна)?', a: 'Вспомогательный индикатор, который с помощью ончейн-метрик, таких как MVRV Z-оценка, измеряет положение капитализации относительно средней цены входа инвесторов и показывает близость к историческим зонам дна по шкале 0–100. Полный расчёт опубликован на странице «дно биткоина».' }
      ],
      disclaimer: '⚠ Эта оценка — справочный сигнал на основе публичных индикаторов, а не инвестиционная рекомендация. Все решения и ответственность — на вас.'
    },
    nl: {
      title: 'Dogecoin Angst- & Hebzucht-index en koopmoment-score',
      intro: 'Een gratis dashboard dat 7 realtime indicatoren — inclusief de Dogecoin Angst- & Hebzucht-index — samenvoegt tot een score van 0–100 voor «is het nu een goed moment om te kopen?». Draait in de browser zonder installatie, in 13 talen.',
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
        { q: 'Moet ik Dogecoin kopen als de index laag is?', a: 'Extreme angst was vaak een accumulatiekans, maar alleen op de index vertrouwen riskeert «een vallend mes te vangen». Deze score weegt ook RSI, MACD, Mayer Multiple, daling en gemiddelde-kruisingen mee, en verlaagt de score behoudend in dalende trends.' },
        { q: 'Hoe wordt de koopmoment-score berekend?', a: 'Elk van de 7 indicatoren wordt omgezet naar een deelscore van 0–100 en gewogen. Het resultaat is 0–100, in 5 banden.' },
        { q: 'Is het gratis? Moet ik iets installeren?', a: 'Het is volledig gratis en zonder installatie. Realtime data komt van de publieke API’s van CoinGecko, Binance en Alternative.me.' },
        { q: 'Wat is het verschil tussen de index en de koopmoment-score?', a: 'De index is één sentimentmaatstaf (0–100); de koopmoment-score is een samenstelling van 7 indicatoren inclusief de index (0–100).' },
        { q: 'Waar komen de gegevens vandaan en hoe vaak worden ze ververst?', a: 'De Angst- & Hebzucht-index komt van Alternative.me; prijzen en dagcandles van de publieke API’s van CoinGecko en Binance; on-chain-metrieken van CoinMetrics. Het scherm ververst ongeveer elke minuut automatisch.' },
        { q: 'Moet ik nu Dogecoin kopen?', a: 'Er is geen eenduidig antwoord, maar de koopmoment-score (0–100) geeft een objectief beeld of de markt in een oversold/angst-zone of een oververhitte/hebzucht-zone zit. Op het langetermijn-tabblad (tegendraads) markeren hoge scores zones waar angst en onderwaardering samenvallen — historisch gunstig voor DCA — terwijl lage scores waarschuwen voor oververhitting. Het is een referentiesignaal, geen beleggingsadvies.' },
        { q: 'Hoe verschillen korte- en langetermijn-kooptiming?', a: 'De score is verdeeld over twee tabbladen. Korte termijn (momentum) hanteert een trendvolgende blik van 1–3 maanden en stijgt bij sterke opwaartse trends; lange termijn (tegendraads) hanteert een cyclusblik van ruim een jaar en stijgt bij angst en onderwaardering. In backtests sinds 2017 werkte momentum beter op korte termijn en tegendraads beter op lange termijn.' },
        { q: 'Wat is de BOTTOM RADAR (bodemscore)?', a: 'Een hulpmeter die met on-chain-metrieken zoals de MVRV Z-score meet waar de marktkapitalisatie staat ten opzichte van de gemiddelde kostprijs van beleggers, en de nabijheid van historische bodemzones toont op een schaal van 0–100. De volledige berekening staat op de pagina «Bitcoin-bodem».' }
      ],
      disclaimer: '⚠ Deze score is een referentiesignaal uit publieke indicatoren, geen beleggingsadvies. Alle beslissingen en verantwoordelijkheid zijn van uzelf.'
    },
    th: {
      title: 'ดัชนีความกลัวและความโลภดอจคอยน์ และคะแนนจังหวะซื้อ',
      intro: 'แดชบอร์ดฟรีที่รวม 7 ตัวชี้วัดแบบเรียลไทม์ — รวมถึงดัชนีความกลัวและความโลภของดอจคอยน์ — เป็นคะแนน 0–100 ว่า “ตอนนี้เป็นจังหวะซื้อหรือไม่?” ใช้งานในเบราว์เซอร์ได้ทันที ไม่ต้องติดตั้ง รองรับ 13 ภาษา',
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
        { q: 'ถ้าดัชนีต่ำควรซื้อดอจคอยน์ไหม?', a: 'ความกลัวสุดขีดในอดีตมักเป็นโอกาสทยอยซื้อ แต่ดูเพียงดัชนีอย่างเดียวเสี่ยง “รับมีดที่กำลังตก” คะแนนนี้ยังพิจารณา RSI, MACD, Mayer Multiple, การย่อ และการตัดกันของเส้นเฉลี่ย และลดคะแนนอย่างระมัดระวังในแนวโน้มขาลง' },
        { q: 'คะแนนจังหวะซื้อคำนวณอย่างไร?', a: 'แปลงแต่ละตัวชี้วัดทั้ง 7 เป็นคะแนนย่อย 0–100 แล้วถ่วงน้ำหนักรวมกัน ผลลัพธ์คือ 0–100 แสดงเป็น 5 ระดับ' },
        { q: 'ฟรีไหม? ต้องติดตั้งไหม?', a: 'ฟรีทั้งหมดและไม่ต้องติดตั้ง ข้อมูลเรียลไทม์มาจาก API สาธารณะของ CoinGecko, Binance และ Alternative.me' },
        { q: 'ดัชนีกับคะแนนจังหวะซื้อต่างกันอย่างไร?', a: 'ดัชนีเป็นตัวชี้วัดอารมณ์เดียว (0–100); คะแนนจังหวะซื้อเป็นคะแนนรวมจาก 7 ตัวชี้วัดรวมถึงดัชนี (0–100)' },
        { q: 'ข้อมูลมาจากไหน อัปเดตบ่อยแค่ไหน?', a: 'ดัชนีความกลัว-ความโลภมาจาก Alternative.me ราคาและแท่งเทียนรายวันมาจาก API สาธารณะของ CoinGecko และ Binance ส่วนตัวชี้วัดออนเชนมาจาก CoinMetrics หน้าจออัปเดตอัตโนมัติราวทุก 1 นาที' },
        { q: 'ตอนนี้ควรซื้อดอจคอยน์ไหม?', a: 'ไม่มีคำตอบตายตัว แต่คะแนนจังหวะซื้อ (0–100) ช่วยประเมินอย่างเป็นกลางว่าตลาดอยู่ในโซนขายมากเกิน/ความกลัว หรือโซนร้อนแรง/ความโลภ ในแท็บระยะยาว (สวนตลาด) คะแนนยิ่งสูงหมายถึงโซนที่ความกลัวและราคาต่ำกว่ามูลค่าทับซ้อนกัน ซึ่งในอดีตเอื้อต่อ DCA ส่วนคะแนนต่ำเตือนถึงความร้อนแรง เป็นเพียงสัญญาณอ้างอิง ไม่ใช่คำแนะนำการลงทุน' },
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
  /* 푸터 설명 문단(.foot-desc) — 도지코인 언급이 있어 공통 foot-i18n.js 가 아니라 여기에 둔다 */
  var FOOT_DESC = {
    ko: 'broodev는 설치 없이 브라우저에서 바로 쓰는 무료 웹앱을 만드는 앱 포트폴리오입니다. 이 페이지의 도지코인 공포·탐욕 지수와 매수 타이밍 점수는 공개 지표를 합성한 참고 정보이며 투자 자문이 아닙니다. 광고는 Google AdSense를 통해 게재될 수 있습니다.',
    en: 'broodev is a portfolio of free web apps that run right in your browser with no install. The Dogecoin Fear & Greed Index and buy-timing score on this page are reference information synthesized from public indicators, not investment advice. Ads may be served through Google AdSense.',
    ja: 'broodevは、インストール不要でブラウザからすぐ使える無料Webアプリを作るアプリポートフォリオです。このページのドージコイン恐怖・強欲指数と買い時スコアは公開指標を合成した参考情報であり、投資助言ではありません。広告はGoogle AdSenseを通じて掲載される場合があります。',
    zh: 'broodev 是一个应用作品集，制作无需安装、在浏览器中即可直接使用的免费网页应用。本页的狗狗币恐惧与贪婪指数和买入时机评分是综合公开指标得出的参考信息，不构成投资建议。广告可能通过 Google AdSense 投放。',
    'zh-Hant': 'broodev 是一個應用作品集，製作無需安裝、在瀏覽器中即可直接使用的免費網頁應用。本頁的狗狗幣恐懼與貪婪指數和買入時機評分是綜合公開指標得出的參考資訊，不構成投資建議。廣告可能透過 Google AdSense 刊登。',
    th: 'broodev คือพอร์ตโฟลิโอแอปที่สร้างเว็บแอปฟรีซึ่งใช้งานได้ทันทีในเบราว์เซอร์โดยไม่ต้องติดตั้ง ดัชนีความกลัว-ความโลภดอจคอยน์และคะแนนจังหวะซื้อในหน้านี้เป็นข้อมูลอ้างอิงที่สังเคราะห์จากตัวชี้วัดสาธารณะ ไม่ใช่คำแนะนำการลงทุน โฆษณาอาจแสดงผ่าน Google AdSense',
    es: 'broodev es un portafolio de aplicaciones web gratuitas que funcionan directamente en el navegador, sin instalación. El Índice de Miedo y Codicia de Dogecoin y la puntuación de momento de compra de esta página son información de referencia elaborada a partir de indicadores públicos, no asesoramiento de inversión. Los anuncios pueden mostrarse a través de Google AdSense.',
    fr: 'broodev est un portfolio d’applications web gratuites qui s’utilisent directement dans le navigateur, sans installation. L’indice Peur & Avidité du Dogecoin et le score de timing d’achat de cette page sont des informations de référence issues d’indicateurs publics, et non un conseil en investissement. Des annonces peuvent être diffusées via Google AdSense.',
    de: 'broodev ist ein Portfolio kostenloser Web-Apps, die ohne Installation direkt im Browser laufen. Der Dogecoin-Angst-und-Gier-Index und der Kauf-Timing-Score auf dieser Seite sind aus öffentlichen Indikatoren zusammengesetzte Referenzinformationen und keine Anlageberatung. Werbung kann über Google AdSense ausgeliefert werden.',
    it: 'broodev è un portfolio di web app gratuite che funzionano direttamente nel browser, senza installazione. L’Indice di Paura e Avidità di Dogecoin e il punteggio di timing d’acquisto in questa pagina sono informazioni di riferimento ricavate da indicatori pubblici, non una consulenza di investimento. Gli annunci possono essere pubblicati tramite Google AdSense.',
    pt: 'O broodev é um portefólio de aplicações web gratuitas que funcionam diretamente no navegador, sem instalação. O Índice de Medo e Ganância do Dogecoin e a pontuação de momento de compra desta página são informação de referência sintetizada a partir de indicadores públicos, não aconselhamento de investimento. Os anúncios podem ser apresentados através do Google AdSense.',
    ru: 'broodev — это портфолио бесплатных веб-приложений, которые работают прямо в браузере без установки. Индекс страха и жадности догикоина и оценка момента покупки на этой странице — справочная информация, собранная из открытых индикаторов, а не инвестиционная рекомендация. Реклама может показываться через Google AdSense.',
    nl: 'broodev is een portfolio van gratis webapps die zonder installatie direct in je browser werken. De Dogecoin Angst- en Hebzuchtindex en de koop-timingscore op deze pagina zijn referentie-informatie samengesteld uit openbare indicatoren, geen beleggingsadvies. Advertenties kunnen via Google AdSense worden getoond.'
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
    "title": "Dogecoin (DOGE) buy-timing score explained",
    "intro": "The Dogecoin page derives RSI(14), MACD(12·26·9), the Mayer Multiple (price/200-day average), drawdown from the 365-day high and the 50/200 golden/death cross from DOGE’s dollar price, then adds the market-wide Fear & Greed Index and the MVRV Z-Score — seven indicators in total, scored from 0 to 100. The score falls into five bands from STRONG BUY to OVERHEATED, and the overall score is free to view.",
    "coinH": "What is Dogecoin (DOGE)?",
    "coinP": [
     "Dogecoin is a cryptocurrency that Billy Markus and Jackson Palmer created in December 2013 as a joke, based on the Shiba Inu “Doge” meme. It started from Litecoin-family code and uses Scrypt-based proof of work (PoW); since 2014 it has been merge-mined with Litecoin.",
     "A block is produced roughly every minute and the block reward is fixed at 10,000 DOGE, so about 5.2 billion new DOGE are issued each year and there is no total supply cap. Early on it was used for tipping on social media, and in 2014 it became known for a fundraiser for the Jamaican bobsled team competing at the Sochi Winter Olympics."
    ],
    "applyH": "Applying the indicators to Dogecoin",
    "apply": [
     "Volatility and social buzz: DOGE has risen or fallen by tens or even hundreds of percent within days on celebrity comments or social-media hype. RSI sometimes stays above 70 for long stretches or plunges below 30, so don’t lean on overbought/oversold signals from any single indicator.",
     "Slow trend indicators: the 200-day average and the 50/200 cross react late to rallies that are over within days. Right after a spike the Mayer Multiple can easily blow far past 2.4, and a cross signal may only appear once the rise has already turned.",
     "Drawdown benchmarks: DOGE fell more than 90% from its May 2021 peak by June 2022. The −30% and −50% zones calibrated on Bitcoin can be ordinary pullbacks for Dogecoin.",
     "Fear & Greed Index: Dogecoin has no sentiment index of its own; the value shown is the Bitcoin-centric, market-wide index. Even on days when only DOGE rises or falls sharply, this value may barely change.",
     "MVRV Z-Score: like Bitcoin, Dogecoin is a UTXO-based proof-of-work chain, and CoinMetrics provides its MVRV, so the indicator is shown. Keep in mind, though, that a fixed amount is issued every year, so supply keeps growing."
    ],
    "histH": "Dogecoin price cycles at a glance",
    "hist": [
     "2013–2014: Soon after its December launch, Dogecoin gained attention through its community’s tipping culture and charity drives, and merged mining with Litecoin began in 2014.",
     "2017–2018: Riding the crypto bull market, DOGE set a then-record high in January 2018 and later gave back most of the gains.",
     "2021: It surged in January amid Reddit-driven hype and repeated mentions by Elon Musk, and hit its all-time high of about $0.73 in May, around Musk’s appearance on the US show SNL.",
     "2022–2023: By June 2022 it was down more than 90% from the peak. Short-lived rallies followed Musk’s takeover of Twitter that October and, in April 2023, Twitter’s logo briefly being changed to the Doge image."
    ],
    "faq": [
     {
      "q": "Does Dogecoin have its own Fear & Greed Index?",
      "a": "There is no Dogecoin-specific index. The page uses the single market-wide index that Alternative.me publishes daily, and that index gives heavy weight to Bitcoin-related data."
     },
     {
      "q": "Is MVRV calculated for Dogecoin as well?",
      "a": "Yes. The CoinMetrics community API has MVRV data for DOGE, from which the Z-Score is derived. On days when the data can’t be retrieved, the card switches to N/A and the score is produced from the other six indicators."
     },
     {
      "q": "Would it be wise to buy Dogecoin right now?",
      "a": "We don’t tell you to buy or sell. A high score on the long-term (contrarian) tab means fear and undervaluation signals have gathered, and on the short-term (momentum) tab the score climbs as the uptrend becomes clearer. Dogecoin’s situation can change within a day on social-media news, so use the score for reference only."
     },
     {
      "q": "Do news items like Elon Musk’s comments go into the score?",
      "a": "Not directly. The score is calculated only from price, the market-wide Fear & Greed Index and MVRV, so news is reflected in the indicators after the price has moved."
     },
     {
      "q": "With no supply cap, do indicators like the Mayer Multiple still mean anything?",
      "a": "The Mayer Multiple, RSI, MACD, drawdown and moving-average cross are computed from price alone, so they can be calculated regardless of the supply structure. Their reference lines come from Bitcoin’s experience, however, so expect more extreme readings to show up often for DOGE."
     }
    ]
   },
   "ja": {
    "title": "ドージコイン（DOGE）買い時スコアの解説",
    "intro": "ドージコインの画面では、DOGEのドル建て価格からRSI(14)、MACD(12・26・9)、マイヤー倍率（価格/200日平均）、365日高値からの下落率、50/200ゴールデン/デッドクロスを求め、市場全体の恐怖・強欲指数とMVRV Zスコアを加えた計7指標で0〜100のスコアを付けます。スコアはSTRONG BUYからOVERHEATEDまでの5段階に分かれ、総合スコアは無料で確認できます。",
    "coinH": "ドージコイン（DOGE）とは？",
    "coinP": [
     "ドージコインは2013年12月、ビリー・マーカスとジャクソン・パーマーが柴犬の「Doge（ドージ）」ミームをもとに冗談半分で作った暗号資産です。ライトコイン系のコードから派生し、Scryptベースのプルーフ・オブ・ワーク（PoW）を採用しており、2014年からはライトコインとのマージマイニング（併合マイニング）が行われています。",
     "ブロックは約1分ごとに生成され、ブロック報酬は10,000 DOGEで固定されているため、毎年約52億枚が新たに発行され、総発行上限はありません。初期にはSNSで投げ銭（チップ）として使われ、2014年にはソチ冬季五輪に出場するジャマイカのボブスレーチームへの募金で知られるようになりました。"
    ],
    "applyH": "ドージコインに指標を当てはめるときの注意",
    "apply": [
     "ボラティリティとSNSの話題：DOGEは著名人の発言やSNSでの話題によって、数日で数十〜数百％上下したことがあります。RSIが70を超えたまま長く張り付いたり、30を割り込んだりすることも珍しくないため、単一指標の買われすぎ・売られすぎシグナルに頼らないでください。",
     "遅れて動くトレンド指標：200日平均や50/200クロスは、数日で終わる急騰を遅れて反映します。急騰直後はマイヤー倍率が2.4を大きく超えやすく、クロスのシグナルは上昇がすでに失速した後に出ることもあります。",
     "下落率の目安：DOGEは2021年5月の高値から2022年6月までに90%以上下落しました。ビットコインを基準にした−30%・−50%の水準は、ドージコインではよくある調整幅にすぎないこともあります。",
     "恐怖・強欲指数：ドージコイン独自のセンチメント指数はなく、表示される値はビットコイン中心の市場全体の指数です。DOGEだけが大きく上げ下げした日でも、この値はほとんど変わらないことがあります。",
     "MVRV Zスコア：ドージコインはビットコインと同じUTXO型のプルーフ・オブ・ワークのチェーンで、CoinMetricsがMVRVを提供しているため、この指標が表示されます。ただし毎年一定量が新規発行され、供給が増え続ける点は考慮が必要です。"
    ],
    "histH": "ドージコインの価格サイクルの概要",
    "hist": [
     "2013〜2014年：12月の公開直後から、コミュニティの投げ銭文化や支援活動で知名度を上げ、2014年にはライトコインとのマージマイニングが始まりました。",
     "2017〜2018年：暗号資産の上昇相場に乗って2018年1月に当時の最高値をつけ、その後は上昇分の大半を失いました。",
     "2021年：1月にRedditでの盛り上がりとイーロン・マスク氏の度重なる言及で急騰し、5月、マスク氏が米番組SNLに出演した頃に約0.73ドルの最高値をつけました。",
     "2022〜2023年：2022年6月には高値から90%以上下落していました。同年10月のマスク氏によるTwitter買収や、2023年4月にTwitterのロゴが一時ドージの画像に変わった際には、短期的な急騰がありました。"
    ],
    "faq": [
     {
      "q": "ドージコイン独自の恐怖・強欲指数はありますか？",
      "a": "ドージコイン専用の指数はありません。Alternative.meが毎日発表する市場全体の指数を1つだけ使っており、この指数はビットコイン関連データの比重が大きいものです。"
     },
     {
      "q": "ドージコインでもMVRVは計算されますか？",
      "a": "されます。CoinMetricsのコミュニティAPIにDOGEのMVRVデータがあり、そこからZスコアを求めます。データを取得できなかった日はカードがN/Aになり、ほかの6指標でスコアを出します。"
     },
     {
      "q": "ドージコインは今買うべきでしょうか？",
      "a": "買え・売れといった答えはお出ししていません。長期（逆張り）タブの高スコアは恐怖と割安のシグナルが集まっていることを、短期（モメンタム）タブは上昇トレンドがはっきりするほどスコアが上がることを意味します。ドージコインはSNSの話題で1日のうちに状況が変わることもあるため、スコアは参考程度にとどめてください。"
     },
     {
      "q": "イーロン・マスク氏の発言のようなニュースもスコアに入りますか？",
      "a": "直接は入りません。スコアは価格、市場全体の恐怖・強欲指数、MVRVだけで計算するため、ニュースは価格が動いた後に指標へ反映されます。"
     },
     {
      "q": "発行上限がないのに、マイヤー倍率のような指標に意味はありますか？",
      "a": "マイヤー倍率、RSI、MACD、下落率、移動平均クロスは価格だけで計算するので、供給の仕組みに関係なく求められます。ただし基準線はビットコインの経験から来た値なので、DOGEではより極端な値が頻繁に出うることを念頭に置いてください。"
     }
    ]
   },
   "ko": {
    "title": "도지코인(DOGE) 매수 타이밍 점수 해설",
    "intro": "도지코인 화면은 DOGE의 달러 가격에서 RSI(14), MACD(12·26·9), Mayer Multiple(가격/200일선), 365일 고점 대비 낙폭, 50/200 골든·데드 크로스를 구하고, 시장 전체 공포·탐욕 지수와 MVRV Z-Score를 더해 모두 7개 지표로 0~100 점수를 매깁니다. 점수 구간은 STRONG BUY에서 OVERHEATED까지 5단계이고, 종합 점수는 무료로 볼 수 있습니다.",
    "coinH": "도지코인(DOGE)이란?",
    "coinP": [
     "도지코인은 2013년 12월 빌리 마커스와 잭슨 팔머가 시바견 '도지(Doge)' 밈을 바탕으로 장난처럼 만든 암호화폐입니다. 라이트코인 계열 코드에서 출발해 Scrypt 기반 작업증명(PoW)을 쓰며, 2014년부터 라이트코인과 병합 채굴(merged mining)을 하고 있습니다.",
     "블록은 약 1분마다 만들어지고 블록 보상은 10,000 DOGE로 고정돼 있어, 해마다 약 52억 개가 새로 발행되며 총발행 한도가 없습니다. 초기에는 소셜미디어에서 팁을 주고받는 용도로 쓰였고, 2014년 소치 동계올림픽에 출전한 자메이카 봅슬레이팀을 위한 모금으로 이름을 알렸습니다."
    ],
    "applyH": "도지코인에 지표를 적용할 때",
    "apply": [
     "변동성과 소셜 이슈: DOGE는 유명인의 발언이나 소셜미디어 화제에 따라 며칠 사이 수십~수백 % 오르내린 적이 있습니다. RSI가 70을 넘긴 채 오래 머물거나 30 아래로 급락하는 일이 종종 나타나므로, 단일 지표의 과매수·과매도 신호에 기대지 마세요.",
     "느린 추세 지표: 200일선과 50/200 크로스는 며칠 만에 끝나는 급등을 뒤늦게 반영합니다. 급등 직후에는 Mayer Multiple이 2.4를 크게 넘기기 쉽고, 크로스 신호는 상승이 이미 꺾인 뒤에 나올 수도 있습니다.",
     "낙폭 기준: DOGE는 2021년 5월 고점에서 2022년 6월까지 90% 넘게 떨어졌습니다. 비트코인을 기준으로 한 -30%·-50% 구간은 도지코인에서는 흔한 조정 폭일 수 있습니다.",
     "공포·탐욕 지수: 도지코인만의 심리 지수는 없으며, 표시값은 비트코인 중심의 시장 전체 지수입니다. DOGE만 크게 오르거나 내리는 날에도 이 값은 거의 변하지 않을 수 있습니다.",
     "MVRV Z-Score: 도지코인은 비트코인처럼 UTXO 방식의 작업증명 체인이고 CoinMetrics가 MVRV를 제공하므로 이 지표가 표시됩니다. 다만 매년 고정된 양이 새로 발행돼 공급이 계속 늘어난다는 점은 감안해야 합니다."
    ],
    "histH": "도지코인 가격 사이클 요약",
    "hist": [
     "2013~2014년: 12월 출시 직후 커뮤니티의 팁 문화와 후원 활동으로 이름을 알렸고, 2014년 라이트코인과의 병합 채굴이 시작됐습니다.",
     "2017~2018년: 암호화폐 강세장을 타고 2018년 1월 당시 최고가를 기록했다가, 이후 상승분 대부분을 반납했습니다.",
     "2021년: 1월 레딧 커뮤니티 열풍과 일론 머스크의 잇단 언급으로 급등했고, 5월 머스크가 미국 프로그램 SNL에 출연할 무렵 약 0.73달러로 최고가를 기록했습니다.",
     "2022~2023년: 2022년 6월에는 고점 대비 90% 넘게 떨어져 있었습니다. 같은 해 10월 머스크의 트위터 인수, 2023년 4월 트위터 로고가 잠시 도지 그림으로 바뀐 일에 맞춰 단기 급등이 있었습니다."
    ],
    "faq": [
     {
      "q": "도지코인만의 공포·탐욕 지수가 있나요?",
      "a": "도지코인 전용 지수는 없습니다. Alternative.me가 매일 발표하는 하나의 시장 전체 지수를 쓰며, 이 지수는 비트코인 관련 데이터 비중이 큽니다."
     },
     {
      "q": "도지코인도 MVRV가 계산되나요?",
      "a": "계산됩니다. CoinMetrics 커뮤니티 API에 DOGE의 MVRV 데이터가 있어 Z-Score를 구합니다. 데이터를 받지 못한 날에는 카드가 N/A로 바뀌고 다른 6개 지표로 점수를 냅니다."
     },
     {
      "q": "도지코인을 지금 사는 게 좋을까요?",
      "a": "사라거나 팔라는 답은 드리지 않습니다. 장기(역발상) 탭의 높은 점수는 공포와 저평가 신호가 모였다는 뜻이고, 단기(모멘텀) 탭은 상승 추세가 뚜렷할수록 점수가 올라갑니다. 도지코인은 소셜미디어 이슈로 하루 만에 상황이 바뀌기도 하므로 점수는 참고용으로만 쓰세요."
     },
     {
      "q": "일론 머스크 발언 같은 뉴스도 점수에 들어가나요?",
      "a": "직접 들어가지는 않습니다. 점수는 가격, 시장 전체 공포·탐욕 지수, MVRV로만 계산하므로 뉴스는 가격이 움직인 다음에 지표에 반영됩니다."
     },
     {
      "q": "발행 한도가 없는데 Mayer Multiple 같은 지표가 의미가 있나요?",
      "a": "Mayer Multiple, RSI, MACD, 낙폭, 이동평균 크로스는 가격만으로 계산하므로 공급 구조와 상관없이 구할 수 있습니다. 다만 기준선은 비트코인 경험에서 나온 값이라, DOGE에서는 더 극단적인 값이 자주 나올 수 있다는 점을 염두에 두세요."
     }
    ]
   },
   "zh": {
    "title": "狗狗币（DOGE）买入时机评分解读",
    "intro": "狗狗币页面从DOGE的美元价格求出RSI(14)、MACD(12·26·9)、梅耶倍数（价格/200日均线）、距365日高点回撤和50/200金叉/死叉，再加上全市场恐惧与贪婪指数和MVRV Z分数，以共7项指标给出0–100的评分。评分分为STRONG BUY到OVERHEATED共5档，综合评分可免费查看。",
    "coinH": "什么是狗狗币（DOGE）？",
    "coinP": [
     "狗狗币是比利·马库斯和杰克逊·帕尔默于2013年12月以柴犬“Doge”表情包为灵感、半开玩笑地创建的加密货币。它源自莱特币系代码，采用基于Scrypt的工作量证明（PoW），自2014年起与莱特币进行联合挖矿（合并挖矿）。",
     "狗狗币约每1分钟产生一个区块，区块奖励固定为10,000 DOGE，因此每年新增约52亿枚，且没有总量上限。早期它被用来在社交媒体上打赏，2014年又因为替参加索契冬奥会的牙买加雪车队募款而广为人知。"
    ],
    "applyH": "将指标用于狗狗币时的注意事项",
    "apply": [
     "波动与社交话题：DOGE曾因名人言论或社交媒体热议在几天内涨跌数十甚至数百个百分点。RSI长时间停留在70以上或急跌到30以下的情况并不少见，因此不要依赖单一指标的超买、超卖信号。",
     "反应迟缓的趋势指标：200日均线和50/200交叉对几天内就结束的暴涨反应滞后。暴涨刚发生时梅耶倍数很容易远超2.4，而交叉信号可能在涨势已经转弱之后才出现。",
     "回撤基准：DOGE从2021年5月的高点到2022年6月下跌了90%以上。以比特币为基准的−30%、−50%区间，对狗狗币来说可能只是常见的回调幅度。",
     "恐惧与贪婪指数：狗狗币没有自己的情绪指数，显示的是以比特币为中心的全市场指数。即使只有DOGE大涨或大跌的日子，这个数值也可能几乎不变。",
     "MVRV Z分数：狗狗币和比特币一样是UTXO模式的工作量证明链，CoinMetrics也提供其MVRV，所以会显示这项指标。不过它每年都会固定新增发行，供应量持续增加，这一点需要考虑。"
    ],
    "histH": "狗狗币价格周期概览",
    "hist": [
     "2013–2014年：12月推出后不久，便凭借社区的打赏文化和公益活动打响名气；2014年开始与莱特币联合挖矿。",
     "2017–2018年：乘着加密牛市在2018年1月创下当时最高价，之后回吐了大部分涨幅。",
     "2021年：1月在Reddit热潮和埃隆·马斯克多次提及的推动下暴涨，5月马斯克登上美国节目SNL前后，以约0.73美元创下历史最高价。",
     "2022–2023年：到2022年6月已较高点下跌逾90%。同年10月马斯克收购Twitter，以及2023年4月Twitter标志一度换成Doge图像时，都出现过短暂急涨。"
    ],
    "faq": [
     {
      "q": "狗狗币有自己的恐惧与贪婪指数吗？",
      "a": "没有狗狗币专属的指数。本页面使用Alternative.me每天发布的唯一一个全市场指数，该指数中比特币相关数据的比重很大。"
     },
     {
      "q": "狗狗币也会计算MVRV吗？",
      "a": "会。CoinMetrics社区API中有DOGE的MVRV数据，本页面据此求出Z分数。当天如果没能取得数据，卡片会变为N/A，评分改由其他6项指标得出。"
     },
     {
      "q": "狗狗币现在值得买吗？",
      "a": "我们不会告诉您该买还是该卖。长期（逆向）标签的高分代表恐惧与低估信号聚集；短期（动量）标签则是上升趋势越明确，分数越高。狗狗币的局面可能因社交媒体话题在一天之内改变，评分仅供参考。"
     },
     {
      "q": "埃隆·马斯克的发言之类的新闻会计入评分吗？",
      "a": "不会直接计入。评分只用价格、全市场恐惧与贪婪指数和MVRV计算，因此新闻要在价格变动之后才会反映到指标上。"
     },
     {
      "q": "没有发行上限，梅耶倍数这类指标还有意义吗？",
      "a": "梅耶倍数、RSI、MACD、回撤和均线交叉都只用价格计算，与供应结构无关，照样可以求出。不过参考线来自比特币的经验，在DOGE上可能更常出现极端数值，请留意这一点。"
     }
    ]
   },
   "zh-Hant": {
    "title": "狗狗幣（DOGE）買入時機評分解讀",
    "intro": "狗狗幣頁面從DOGE的美元價格求出RSI(14)、MACD(12·26·9)、梅耶倍數（價格/200日均線）、距365日高點回撤與50/200黃金/死亡交叉，再加上全市場恐懼與貪婪指數和MVRV Z分數，以共7項指標給出0–100的評分。評分分為STRONG BUY到OVERHEATED共5級，綜合評分可免費查看。",
    "coinH": "什麼是狗狗幣（DOGE）？",
    "coinP": [
     "狗狗幣是比利·馬庫斯與傑克森·帕爾默於2013年12月，以柴犬「Doge」迷因為靈感、半開玩笑地創造的加密貨幣。它源自萊特幣系的程式碼，採用以Scrypt為基礎的工作量證明（PoW），自2014年起與萊特幣進行合併挖礦。",
     "狗狗幣約每1分鐘產生一個區塊，區塊獎勵固定為10,000 DOGE，因此每年新增約52億枚，且沒有總量上限。早期它被用來在社群媒體上打賞，2014年又因為替參加索契冬奧的牙買加雪車隊募款而廣為人知。"
    ],
    "applyH": "將指標用於狗狗幣時的注意事項",
    "apply": [
     "波動與社群話題：DOGE曾因名人發言或社群媒體熱議，在幾天內漲跌數十甚至數百個百分點。RSI長時間停在70以上或急跌到30以下的情況並不少見，因此不要依賴單一指標的超買、超賣訊號。",
     "反應遲緩的趨勢指標：200日均線與50/200交叉對幾天內就結束的暴漲反應落後。暴漲剛發生時梅耶倍數很容易遠超過2.4，而交叉訊號可能在漲勢已經轉弱之後才出現。",
     "回撤基準：DOGE從2021年5月的高點到2022年6月下跌了90%以上。以比特幣為基準的−30%、−50%區間，對狗狗幣來說可能只是常見的拉回幅度。",
     "恐懼與貪婪指數：狗狗幣沒有自己的情緒指數，顯示的是以比特幣為中心的全市場指數。即使是只有DOGE大漲或大跌的日子，這個數值也可能幾乎不變。",
     "MVRV Z分數：狗狗幣和比特幣一樣是UTXO模式的工作量證明鏈，CoinMetrics也提供其MVRV，所以會顯示這項指標。不過它每年都會固定新增發行，供給量持續增加，這一點需要考量。"
    ],
    "histH": "狗狗幣價格週期概覽",
    "hist": [
     "2013–2014年：12月推出後不久，便憑藉社群的打賞文化與公益活動打響名氣；2014年開始與萊特幣合併挖礦。",
     "2017–2018年：搭上加密多頭市場，在2018年1月創下當時最高價，之後回吐了大部分漲幅。",
     "2021年：1月在Reddit熱潮與伊隆·馬斯克多次提及的推動下暴漲，5月馬斯克登上美國節目SNL前後，以約0.73美元創下歷史最高價。",
     "2022–2023年：到2022年6月已較高點下跌逾90%。同年10月馬斯克收購Twitter，以及2023年4月Twitter標誌一度換成Doge圖像時，都曾出現短暫急漲。"
    ],
    "faq": [
     {
      "q": "狗狗幣有自己的恐懼與貪婪指數嗎？",
      "a": "沒有狗狗幣專屬的指數。本頁面使用Alternative.me每天發布的唯一一個全市場指數，該指數中比特幣相關資料的比重很大。"
     },
     {
      "q": "狗狗幣也會計算MVRV嗎？",
      "a": "會。CoinMetrics社群API中有DOGE的MVRV資料，本頁面據此求出Z分數。當天如果沒能取得資料，卡片會變成N/A，評分改由其他6項指標得出。"
     },
     {
      "q": "狗狗幣現在值得買嗎？",
      "a": "我們不會告訴您該買還是該賣。長期（逆向）分頁的高分代表恐懼與低估訊號聚集；短期（動能）分頁則是上升趨勢越明確，分數越高。狗狗幣的局面可能因社群媒體話題在一天之內改變，評分僅供參考。"
     },
     {
      "q": "伊隆·馬斯克的發言這類新聞會計入評分嗎？",
      "a": "不會直接計入。評分只用價格、全市場恐懼與貪婪指數和MVRV計算，因此新聞要在價格變動之後才會反映到指標上。"
     },
     {
      "q": "沒有發行上限，梅耶倍數這類指標還有意義嗎？",
      "a": "梅耶倍數、RSI、MACD、回撤與均線交叉都只用價格計算，與供給結構無關，照樣可以求出。不過參考線來自比特幣的經驗，在DOGE上可能更常出現極端數值，請留意這一點。"
     }
    ]
   },
   "th": {
    "title": "อธิบายคะแนนจังหวะซื้อดอจคอยน์ (DOGE)",
    "intro": "หน้าดอจคอยน์หาค่า RSI(14), MACD(12·26·9), Mayer Multiple (ราคา/เส้นเฉลี่ย 200 วัน), การย่อจากจุดสูงสุด 365 วัน และ Golden/Death Cross 50/200 จากราคา DOGE เทียบดอลลาร์ แล้วเพิ่มดัชนีความกลัว-ความโลภของทั้งตลาดและ MVRV Z-Score รวมเป็น 7 ตัวชี้วัดเพื่อให้คะแนน 0–100 คะแนนแบ่งเป็น 5 ช่วงตั้งแต่ STRONG BUY ถึง OVERHEATED และดูคะแนนรวมได้ฟรี",
    "coinH": "ดอจคอยน์ (DOGE) คืออะไร?",
    "coinP": [
     "ดอจคอยน์เป็นคริปโตที่บิลลี มาร์คัส และแจ็กสัน พาล์มเมอร์ สร้างขึ้นแบบขำ ๆ ในเดือนธันวาคม 2013 โดยอิงมีม “Doge” สุนัขพันธุ์ชิบะ ตัวโค้ดแตกแขนงมาจากตระกูลไลต์คอยน์ ใช้ Proof of Work (PoW) แบบ Scrypt และตั้งแต่ปี 2014 ก็ขุดร่วมกับไลต์คอยน์",
     "บล็อกถูกสร้างราวทุก 1 นาที และรางวัลบล็อกคงที่ที่ 10,000 DOGE จึงมีเหรียญใหม่ออกมาราว 5,200 ล้านเหรียญต่อปี และไม่มีเพดานอุปทานรวม ช่วงแรกใช้เป็นทิปบนโซเชียลมีเดีย และในปี 2014 เป็นที่รู้จักจากการระดมทุนช่วยทีมบอบสเลดจาเมกาที่ไปแข่งโอลิมปิกฤดูหนาวที่โซชิ"
    ],
    "applyH": "ข้อควรรู้เมื่อใช้ตัวชี้วัดกับดอจคอยน์",
    "apply": [
     "ความผันผวนและกระแสโซเชียล: DOGE เคยขึ้นลงหลายสิบถึงหลายร้อยเปอร์เซ็นต์ภายในไม่กี่วันจากคำพูดของคนดังหรือกระแสบนโซเชียลมีเดีย RSI อาจค้างอยู่เหนือ 70 นาน ๆ หรือดิ่งต่ำกว่า 30 ได้บ่อย ๆ จึงไม่ควรพึ่งสัญญาณซื้อมากเกิน/ขายมากเกินจากตัวชี้วัดตัวเดียว",
     "ตัวชี้วัดเทรนด์ที่ตอบสนองช้า: เส้นเฉลี่ย 200 วันและครอส 50/200 สะท้อนการพุ่งขึ้นที่จบภายในไม่กี่วันได้ช้า ทันทีหลังราคาพุ่ง Mayer Multiple มักทะลุ 2.4 ไปไกล และสัญญาณครอสอาจโผล่มาหลังจากแรงขึ้นหมดไปแล้ว",
     "เกณฑ์การย่อตัว: DOGE ร่วงกว่า 90% จากจุดสูงสุดในเดือนพฤษภาคม 2021 จนถึงเดือนมิถุนายน 2022 โซน −30% และ −50% ที่อิงบิตคอยน์ อาจเป็นแค่การย่อตามปกติของดอจคอยน์",
     "ดัชนีความกลัว-ความโลภ: ดอจคอยน์ไม่มีดัชนีอารมณ์ตลาดของตัวเอง ค่าที่แสดงคือดัชนีทั้งตลาดที่เน้นบิตคอยน์ แม้ในวันที่ DOGE ขึ้นหรือลงแรงอยู่ตัวเดียว ค่านี้ก็อาจแทบไม่ขยับ",
     "MVRV Z-Score: ดอจคอยน์เป็นเชน Proof of Work แบบ UTXO เหมือนบิตคอยน์ และ CoinMetrics มีข้อมูล MVRV ให้ ตัวชี้วัดนี้จึงแสดงผล แต่ต้องคำนึงว่ามีการออกเหรียญใหม่ในปริมาณคงที่ทุกปี อุปทานจึงเพิ่มขึ้นเรื่อย ๆ"
    ],
    "histH": "สรุปวัฏจักรราคาดอจคอยน์",
    "hist": [
     "2013–2014: ไม่นานหลังเปิดตัวในเดือนธันวาคม ดอจคอยน์เป็นที่รู้จักจากวัฒนธรรมการให้ทิปและกิจกรรมการกุศลของชุมชน และเริ่มขุดร่วมกับไลต์คอยน์ในปี 2014",
     "2017–2018: ราคาขึ้นตามตลาดกระทิงคริปโตจนทำจุดสูงสุดในขณะนั้นเมื่อเดือนมกราคม 2018 ก่อนจะคืนกำไรส่วนใหญ่ในเวลาต่อมา",
     "2021: ราคาพุ่งในเดือนมกราคมจากกระแสบน Reddit และการพูดถึงซ้ำ ๆ ของอีลอน มัสก์ แล้วทำจุดสูงสุดตลอดกาลราว 0.73 ดอลลาร์ในเดือนพฤษภาคม ช่วงที่มัสก์ไปออกรายการ SNL ของสหรัฐฯ",
     "2022–2023: ถึงเดือนมิถุนายน 2022 ราคาลดลงกว่า 90% จากจุดสูงสุด มีการพุ่งขึ้นระยะสั้นตอนที่มัสก์ซื้อ Twitter ในเดือนตุลาคมปีนั้น และตอนที่โลโก้ Twitter ถูกเปลี่ยนเป็นรูป Doge ชั่วคราวในเดือนเมษายน 2023"
    ],
    "faq": [
     {
      "q": "ดอจคอยน์มีดัชนีความกลัว-ความโลภของตัวเองไหม?",
      "a": "ไม่มีดัชนีเฉพาะของดอจคอยน์ หน้านี้ใช้ดัชนีทั้งตลาดเพียงตัวเดียวที่ Alternative.me เผยแพร่ทุกวัน และดัชนีนี้ให้น้ำหนักข้อมูลที่เกี่ยวกับบิตคอยน์มาก"
     },
     {
      "q": "ดอจคอยน์มีการคำนวณ MVRV ด้วยไหม?",
      "a": "มี API ชุมชนของ CoinMetrics มีข้อมูล MVRV ของ DOGE หน้านี้จึงหาค่า Z-Score ได้ วันที่ดึงข้อมูลไม่ได้ การ์ดจะเปลี่ยนเป็น N/A และคะแนนจะคำนวณจากตัวชี้วัดอีก 6 ตัว"
     },
     {
      "q": "ดอจคอยน์น่าซื้อตอนนี้หรือเปล่า?",
      "a": "เราไม่บอกให้ซื้อหรือขาย คะแนนสูงในแท็บระยะยาว (สวนตลาด) แปลว่าสัญญาณความกลัวและราคาต่ำกว่ามูลค่ามารวมตัวกัน ส่วนแท็บระยะสั้น (โมเมนตัม) คะแนนจะสูงขึ้นเมื่อเทรนด์ขาขึ้นชัดเจน สถานการณ์ของดอจคอยน์อาจเปลี่ยนได้ภายในวันเดียวจากกระแสโซเชียล จึงควรใช้คะแนนเพื่ออ้างอิงเท่านั้น"
     },
     {
      "q": "ข่าวอย่างคำพูดของอีลอน มัสก์ถูกนับรวมในคะแนนไหม?",
      "a": "ไม่ได้นับโดยตรง คะแนนคำนวณจากราคา ดัชนีความกลัว-ความโลภของทั้งตลาด และ MVRV เท่านั้น ข่าวจึงสะท้อนในตัวชี้วัดหลังจากราคาขยับแล้ว"
     },
     {
      "q": "ไม่มีเพดานอุปทาน แล้วตัวชี้วัดอย่าง Mayer Multiple ยังมีความหมายไหม?",
      "a": "Mayer Multiple, RSI, MACD, การย่อตัว และครอสเส้นเฉลี่ยคำนวณจากราคาอย่างเดียว จึงหาค่าได้ไม่ว่าโครงสร้างอุปทานจะเป็นแบบใด แต่เส้นอ้างอิงมาจากประสบการณ์ของบิตคอยน์ ควรระลึกไว้ว่ากับ DOGE อาจเห็นค่าสุดขั้วบ่อยกว่า"
     }
    ]
   },
   "es": {
    "title": "La puntuación de compra de Dogecoin (DOGE), explicada",
    "intro": "La página de Dogecoin obtiene del precio de DOGE en dólares el RSI(14), el MACD(12·26·9), el múltiplo de Mayer (precio/media de 200 días), la caída desde el máximo de 365 días y el cruce dorado/de la muerte 50/200, y añade el índice de miedo y codicia de todo el mercado y el MVRV Z-Score: siete indicadores en total para puntuar de 0 a 100. La puntuación se divide en cinco tramos, de STRONG BUY a OVERHEATED, y la global puede consultarse gratis.",
    "coinH": "¿Qué es Dogecoin (DOGE)?",
    "coinP": [
     "Dogecoin es una criptomoneda que Billy Markus y Jackson Palmer crearon en diciembre de 2013, medio en broma, a partir del meme «Doge» del perro shiba inu. Parte de código de la familia de Litecoin, usa prueba de trabajo (PoW) basada en Scrypt y desde 2014 se mina de forma combinada (merged mining) con Litecoin.",
     "Se genera un bloque aproximadamente cada minuto y la recompensa está fijada en 10.000 DOGE, de modo que cada año se emiten unos 5.200 millones de DOGE nuevos y no hay límite total de oferta. Al principio se usaba para dar propinas en redes sociales, y en 2014 se hizo conocida por una colecta para el equipo jamaicano de bobsleigh que compitió en los Juegos Olímpicos de Invierno de Sochi."
    ],
    "applyH": "Cómo aplicar los indicadores a Dogecoin",
    "apply": [
     "Volatilidad y redes sociales: DOGE ha subido o bajado decenas e incluso cientos de puntos porcentuales en pocos días por comentarios de famosos o modas en redes sociales. No es raro que el RSI se quede mucho tiempo por encima de 70 o se desplome por debajo de 30, así que no te apoyes en las señales de sobrecompra o sobreventa de un único indicador.",
     "Indicadores de tendencia lentos: la media de 200 días y el cruce 50/200 reflejan tarde las subidas que terminan en pocos días. Justo después de un pico, el múltiplo de Mayer supera con facilidad y por mucho el 2,4, y la señal de cruce puede llegar cuando la subida ya se ha agotado.",
     "Referencias de caída: DOGE cayó más de un 90 % desde su máximo de mayo de 2021 hasta junio de 2022. Las zonas de −30 % y −50 % pensadas para Bitcoin pueden ser simples correcciones habituales en Dogecoin.",
     "Índice de miedo y codicia: Dogecoin no tiene un índice de sentimiento propio; el valor mostrado es el índice de todo el mercado, centrado en Bitcoin. Incluso los días en que solo DOGE sube o baja con fuerza, ese valor puede apenas moverse.",
     "MVRV Z-Score: al igual que Bitcoin, Dogecoin es una cadena de prueba de trabajo basada en UTXO, y CoinMetrics ofrece su MVRV, por lo que el indicador se muestra. Eso sí, ten en cuenta que cada año se emite una cantidad fija, así que la oferta no deja de crecer."
    ],
    "histH": "Resumen de los ciclos de precio de Dogecoin",
    "hist": [
     "2013–2014: poco después de su lanzamiento en diciembre, se dio a conocer por la cultura de propinas y las campañas solidarias de su comunidad; en 2014 comenzó la minería combinada con Litecoin.",
     "2017–2018: impulsado por el mercado alcista cripto, marcó en enero de 2018 el máximo de entonces y después devolvió la mayor parte de lo ganado.",
     "2021: se disparó en enero con el furor de Reddit y las repetidas menciones de Elon Musk, y en mayo, en torno a la aparición de Musk en el programa estadounidense SNL, alcanzó su máximo histórico de unos 0,73 dólares.",
     "2022–2023: en junio de 2022 ya acumulaba una caída de más del 90 % desde el máximo. Hubo repuntes breves con la compra de Twitter por parte de Musk en octubre de ese año y, en abril de 2023, cuando el logotipo de Twitter se cambió temporalmente por la imagen de Doge."
    ],
    "faq": [
     {
      "q": "¿Dogecoin tiene su propio índice de miedo y codicia?",
      "a": "No hay un índice exclusivo de Dogecoin. La página usa el único índice de todo el mercado que Alternative.me publica a diario, y ese índice da mucho peso a los datos relacionados con Bitcoin."
     },
     {
      "q": "¿Se calcula también el MVRV de Dogecoin?",
      "a": "Sí. La API comunitaria de CoinMetrics tiene datos de MVRV de DOGE, a partir de los cuales se obtiene el Z-Score. Los días en que no se pueden obtener, la tarjeta pasa a N/A y la puntuación se calcula con los otros seis indicadores."
     },
     {
      "q": "¿Conviene comprar Dogecoin en este momento?",
      "a": "No te diremos que compres ni que vendas. Una puntuación alta en la pestaña de largo plazo (contraria) significa que se han acumulado señales de miedo e infravaloración, y en la de corto plazo (momentum) la puntuación sube a medida que la tendencia alcista se hace más clara. La situación de Dogecoin puede cambiar en un día por lo que pase en redes sociales, así que usa la puntuación solo como referencia."
     },
     {
      "q": "¿Entran en la puntuación noticias como los comentarios de Elon Musk?",
      "a": "No directamente. La puntuación se calcula solo con el precio, el índice de miedo y codicia de todo el mercado y el MVRV, así que las noticias se reflejan en los indicadores después de que se mueva el precio."
     },
     {
      "q": "Sin límite de emisión, ¿tienen sentido indicadores como el múltiplo de Mayer?",
      "a": "El múltiplo de Mayer, el RSI, el MACD, la caída y el cruce de medias se calculan solo con el precio, así que pueden obtenerse sea cual sea la estructura de la oferta. Eso sí, sus líneas de referencia proceden de la experiencia de Bitcoin, por lo que conviene tener presente que en DOGE pueden aparecer con frecuencia valores más extremos."
     }
    ]
   },
   "fr": {
    "title": "Le score d’achat Dogecoin (DOGE) expliqué",
    "intro": "La page Dogecoin tire du prix du DOGE en dollars le RSI(14), le MACD(12·26·9), le multiple de Mayer (prix/moyenne sur 200 jours), le repli depuis le plus haut sur 365 jours et le croisement doré/de la mort 50/200, puis ajoute l’indice de peur et d’avidité du marché entier et le MVRV Z-Score : sept indicateurs au total pour une note de 0 à 100. Le score se répartit en cinq tranches, de STRONG BUY à OVERHEATED, et le score global se consulte gratuitement.",
    "coinH": "Qu’est-ce que le Dogecoin (DOGE) ?",
    "coinP": [
     "Le Dogecoin est une cryptomonnaie créée en décembre 2013 par Billy Markus et Jackson Palmer, à moitié pour plaisanter, à partir du mème « Doge » du shiba inu. Issu d’un code de la famille Litecoin, il utilise une preuve de travail (PoW) basée sur Scrypt et, depuis 2014, il est miné conjointement avec le Litecoin (merged mining).",
     "Un bloc est produit environ toutes les minutes et la récompense est fixée à 10 000 DOGE ; environ 5,2 milliards de DOGE nouveaux sont donc émis chaque année, sans plafond total. À ses débuts, il servait à donner des pourboires sur les réseaux sociaux, et il s’est fait connaître en 2014 grâce à une collecte pour l’équipe jamaïcaine de bobsleigh engagée aux Jeux olympiques d’hiver de Sotchi."
    ],
    "applyH": "Appliquer les indicateurs au Dogecoin",
    "apply": [
     "Volatilité et buzz social : le DOGE a déjà monté ou chuté de dizaines, voire de centaines de pour cent en quelques jours à la suite de propos de célébrités ou d’engouements sur les réseaux sociaux. Il n’est pas rare que le RSI reste longtemps au-dessus de 70 ou plonge sous 30 ; ne vous fiez donc pas aux signaux de surachat ou de survente d’un seul indicateur.",
     "Indicateurs de tendance lents : la moyenne sur 200 jours et le croisement 50/200 réagissent tardivement aux envolées qui s’achèvent en quelques jours. Juste après un pic, le multiple de Mayer dépasse facilement et largement 2,4, et le signal de croisement peut n’apparaître qu’une fois la hausse déjà essoufflée.",
     "Repères de repli : le DOGE a perdu plus de 90 % entre son sommet de mai 2021 et juin 2022. Les zones de −30 % et −50 % calibrées sur le bitcoin peuvent n’être que des corrections ordinaires pour le Dogecoin.",
     "Indice de peur et d’avidité : le Dogecoin n’a pas d’indice de sentiment propre ; la valeur affichée est l’indice du marché entier, centré sur le bitcoin. Même les jours où seul le DOGE monte ou baisse fortement, cette valeur peut à peine bouger.",
     "MVRV Z-Score : comme le bitcoin, le Dogecoin est une chaîne à preuve de travail fondée sur des UTXO, et CoinMetrics fournit son MVRV ; l’indicateur est donc affiché. Gardez toutefois à l’esprit qu’une quantité fixe est émise chaque année et que l’offre ne cesse d’augmenter."
    ],
    "histH": "Les cycles de prix du Dogecoin en bref",
    "hist": [
     "2013–2014 : peu après son lancement en décembre, le Dogecoin se fait connaître par la culture du pourboire et les actions caritatives de sa communauté ; le minage conjoint avec le Litecoin débute en 2014.",
     "2017–2018 : porté par le marché haussier crypto, il atteint en janvier 2018 son record d’alors, puis rend l’essentiel de ses gains.",
     "2021 : il s’envole en janvier sur fond d’effervescence sur Reddit et de mentions répétées d’Elon Musk, puis atteint en mai son record historique d’environ 0,73 dollar, au moment du passage de Musk dans l’émission américaine SNL.",
     "2022–2023 : en juin 2022, il a perdu plus de 90 % depuis son sommet. De brefs rebonds suivent le rachat de Twitter par Musk en octobre de cette année-là puis, en avril 2023, le remplacement temporaire du logo de Twitter par l’image de Doge."
    ],
    "faq": [
     {
      "q": "Le Dogecoin a-t-il son propre indice de peur et d’avidité ?",
      "a": "Il n’existe pas d’indice spécifique au Dogecoin. La page utilise l’unique indice du marché entier publié chaque jour par Alternative.me, et cet indice accorde un poids important aux données liées au bitcoin."
     },
     {
      "q": "Le MVRV est-il calculé pour le Dogecoin aussi ?",
      "a": "Oui. L’API communautaire de CoinMetrics dispose des données MVRV du DOGE, dont on tire le Z-Score. Les jours où elles ne peuvent pas être récupérées, la carte passe à N/A et le score est établi à partir des six autres indicateurs."
     },
     {
      "q": "Vaut-il la peine d’acheter du Dogecoin en ce moment ?",
      "a": "Nous ne vous dirons ni d’acheter ni de vendre. Un score élevé dans l’onglet long terme (contrarian) signifie que des signaux de peur et de sous-évaluation se sont accumulés ; dans l’onglet court terme (momentum), le score monte à mesure que la tendance haussière se précise. La situation du Dogecoin peut changer en une journée au gré des réseaux sociaux : servez-vous du score uniquement comme repère."
     },
     {
      "q": "Des actualités comme les déclarations d’Elon Musk entrent-elles dans le score ?",
      "a": "Pas directement. Le score est calculé uniquement à partir du prix, de l’indice de peur et d’avidité du marché entier et du MVRV ; les actualités ne se reflètent donc dans les indicateurs qu’après un mouvement de prix."
     },
     {
      "q": "Sans plafond d’émission, des indicateurs comme le multiple de Mayer ont-ils un sens ?",
      "a": "Le multiple de Mayer, le RSI, le MACD, le repli et le croisement de moyennes se calculent à partir du seul prix ; on peut donc les obtenir quelle que soit la structure de l’offre. Leurs repères proviennent toutefois de l’expérience du bitcoin : attendez-vous à voir plus souvent des valeurs extrêmes sur le DOGE."
     }
    ]
   },
   "de": {
    "title": "Der Kauf-Timing-Score für Dogecoin (DOGE) erklärt",
    "intro": "Die Dogecoin-Seite leitet aus dem Dollarkurs von DOGE den RSI(14), den MACD(12·26·9), das Mayer-Multiple (Kurs/200-Tage-Durchschnitt), den Rückgang vom 365-Tage-Hoch und das Golden/Death Cross 50/200 ab und nimmt den marktweiten Angst-&-Gier-Index sowie den MVRV Z-Score hinzu – insgesamt sieben Indikatoren für eine Bewertung von 0 bis 100. Der Score ist in fünf Stufen von STRONG BUY bis OVERHEATED unterteilt; den Gesamtscore sehen Sie kostenlos.",
    "coinH": "Was ist Dogecoin (DOGE)?",
    "coinP": [
     "Dogecoin ist eine Kryptowährung, die Billy Markus und Jackson Palmer im Dezember 2013 halb im Scherz auf Basis des „Doge“-Memes mit dem Shiba Inu schufen. Sie geht auf Code aus der Litecoin-Familie zurück, nutzt ein Scrypt-basiertes Proof of Work (PoW) und wird seit 2014 gemeinsam mit Litecoin gemined (Merged Mining).",
     "Etwa jede Minute entsteht ein Block, die Blockbelohnung ist auf 10.000 DOGE festgelegt – so kommen jedes Jahr rund 5,2 Milliarden neue DOGE hinzu, eine Obergrenze für die Gesamtmenge gibt es nicht. Anfangs wurde Dogecoin für Trinkgelder in sozialen Medien genutzt; bekannt wurde es 2014 durch eine Spendenaktion für das jamaikanische Bobteam bei den Olympischen Winterspielen in Sotschi."
    ],
    "applyH": "Indikatoren auf Dogecoin anwenden",
    "apply": [
     "Volatilität und Social-Media-Hypes: DOGE ist nach Äußerungen von Prominenten oder Hypes in sozialen Medien schon binnen weniger Tage um Dutzende, ja Hunderte Prozent gestiegen oder gefallen. Nicht selten bleibt der RSI lange über 70 oder stürzt unter 30 – verlassen Sie sich daher nicht auf Überkauft- oder Überverkauft-Signale eines einzelnen Indikators.",
     "Träge Trendindikatoren: Die 200-Tage-Linie und das 50/200-Kreuz bilden Rallys, die nach wenigen Tagen vorbei sind, erst verspätet ab. Direkt nach einem Ausschlag liegt das Mayer-Multiple schnell weit über 2,4, und ein Kreuzsignal kann erst erscheinen, wenn der Anstieg bereits gekippt ist.",
     "Maßstäbe für Rückgänge: DOGE verlor vom Hoch im Mai 2021 bis Juni 2022 mehr als 90 %. Die an Bitcoin ausgerichteten Zonen von −30 % und −50 % können bei Dogecoin ganz gewöhnliche Korrekturen sein.",
     "Angst-&-Gier-Index: Dogecoin hat keinen eigenen Stimmungsindex; angezeigt wird der auf Bitcoin ausgerichtete Index für den Gesamtmarkt. Selbst an Tagen, an denen nur DOGE stark steigt oder fällt, bewegt sich dieser Wert womöglich kaum.",
     "MVRV Z-Score: Wie Bitcoin ist Dogecoin eine UTXO-basierte Proof-of-Work-Chain, und CoinMetrics stellt das MVRV bereit, daher wird der Indikator angezeigt. Bedenken Sie aber, dass jedes Jahr eine feste Menge neu ausgegeben wird und das Angebot somit stetig wächst."
    ],
    "histH": "Dogecoins Preiszyklen im Überblick",
    "hist": [
     "2013–2014: Kurz nach dem Start im Dezember wurde Dogecoin durch die Trinkgeldkultur und die Spendenaktionen seiner Community bekannt; 2014 begann das Merged Mining mit Litecoin.",
     "2017–2018: Getragen vom Krypto-Bullenmarkt erreichte DOGE im Januar 2018 sein damaliges Rekordhoch und gab die Gewinne danach größtenteils wieder ab.",
     "2021: Im Januar schoss der Kurs im Reddit-Hype und nach wiederholten Erwähnungen durch Elon Musk nach oben; im Mai, rund um Musks Auftritt in der US-Show SNL, erreichte DOGE mit etwa 0,73 Dollar sein Allzeithoch.",
     "2022–2023: Bis Juni 2022 lag DOGE mehr als 90 % unter dem Hoch. Kurze Kurssprünge gab es bei Musks Übernahme von Twitter im Oktober desselben Jahres und im April 2023, als das Twitter-Logo vorübergehend durch das Doge-Bild ersetzt wurde."
    ],
    "faq": [
     {
      "q": "Hat Dogecoin einen eigenen Angst-&-Gier-Index?",
      "a": "Einen Dogecoin-spezifischen Index gibt es nicht. Die Seite nutzt den einen marktweiten Index, den Alternative.me täglich veröffentlicht, und dieser gewichtet Bitcoin-bezogene Daten stark."
     },
     {
      "q": "Wird das MVRV auch für Dogecoin berechnet?",
      "a": "Ja. Die Community-API von CoinMetrics hat MVRV-Daten für DOGE, aus denen der Z-Score gewonnen wird. An Tagen, an denen die Daten nicht abrufbar sind, wechselt die Karte auf N/A, und der Score ergibt sich aus den übrigen sechs Indikatoren."
     },
     {
      "q": "Lohnt es sich, gerade jetzt Dogecoin zu kaufen?",
      "a": "Wir sagen Ihnen nicht, ob Sie kaufen oder verkaufen sollen. Ein hoher Score im Tab Langfristig (antizyklisch) bedeutet, dass sich Signale für Angst und Unterbewertung gehäuft haben; im Tab Kurzfristig (Momentum) steigt der Score, je deutlicher der Aufwärtstrend wird. Die Lage bei Dogecoin kann sich durch Social-Media-Themen binnen eines Tages ändern – nutzen Sie den Score daher nur als Anhaltspunkt."
     },
     {
      "q": "Fließen Nachrichten wie Äußerungen von Elon Musk in den Score ein?",
      "a": "Nicht direkt. Der Score wird nur aus dem Kurs, dem marktweiten Angst-&-Gier-Index und MVRV berechnet; Nachrichten schlagen sich daher erst nach einer Kursbewegung in den Indikatoren nieder."
     },
     {
      "q": "Ergeben Indikatoren wie das Mayer-Multiple ohne Mengenobergrenze überhaupt Sinn?",
      "a": "Mayer-Multiple, RSI, MACD, Rückgang und Durchschnittskreuz werden allein aus dem Kurs berechnet und lassen sich daher unabhängig von der Angebotsstruktur ermitteln. Ihre Referenzlinien stammen allerdings aus der Bitcoin-Erfahrung – rechnen Sie bei DOGE also häufiger mit extremeren Werten."
     }
    ]
   },
   "it": {
    "title": "Il punteggio d’acquisto di Dogecoin (DOGE) spiegato",
    "intro": "La pagina Dogecoin ricava dal prezzo in dollari di DOGE l’RSI(14), il MACD(12·26·9), il multiplo di Mayer (prezzo/media a 200 giorni), il ribasso dal massimo a 365 giorni e il golden/death cross 50/200, e aggiunge l’indice di paura e avidità dell’intero mercato e il MVRV Z-Score: sette indicatori in tutto per un voto da 0 a 100. Il punteggio è suddiviso in cinque fasce, da STRONG BUY a OVERHEATED, e quello complessivo si consulta gratis.",
    "coinH": "Che cos’è Dogecoin (DOGE)?",
    "coinP": [
     "Dogecoin è una criptovaluta creata nel dicembre 2013 da Billy Markus e Jackson Palmer, quasi per scherzo, a partire dal meme «Doge» dello shiba inu. Deriva da codice della famiglia di Litecoin, usa una proof of work (PoW) basata su Scrypt e dal 2014 viene minata insieme a Litecoin (merged mining).",
     "Viene prodotto un blocco circa ogni minuto e la ricompensa è fissata a 10.000 DOGE, per cui ogni anno si aggiungono circa 5,2 miliardi di nuovi DOGE e non esiste un tetto all’offerta totale. Agli inizi era usata per le mance sui social network e nel 2014 si fece conoscere con una raccolta fondi per la squadra giamaicana di bob in gara alle Olimpiadi invernali di Sochi."
    ],
    "applyH": "Applicare gli indicatori a Dogecoin",
    "apply": [
     "Volatilità e clamore sui social: DOGE è salito o sceso di decine, persino centinaia di punti percentuali in pochi giorni per dichiarazioni di personaggi famosi o mode sui social. Non è raro che l’RSI resti a lungo sopra 70 o crolli sotto 30, quindi non affidarti ai segnali di ipercomprato o ipervenduto di un singolo indicatore.",
     "Indicatori di trend lenti: la media a 200 giorni e l’incrocio 50/200 recepiscono in ritardo i rialzi che si esauriscono in pochi giorni. Subito dopo un picco il multiplo di Mayer supera facilmente e di molto 2,4, e il segnale di incrocio può arrivare quando la salita si è già esaurita.",
     "Parametri di ribasso: DOGE ha perso oltre il 90% dal massimo di maggio 2021 a giugno 2022. Le zone di −30% e −50% tarate su Bitcoin possono essere per Dogecoin semplici correzioni ordinarie.",
     "Indice di paura e avidità: Dogecoin non ha un indice di sentiment proprio; il valore mostrato è l’indice dell’intero mercato, centrato su Bitcoin. Anche nei giorni in cui solo DOGE sale o scende con forza, questo valore può muoversi appena.",
     "MVRV Z-Score: come Bitcoin, Dogecoin è una catena proof of work basata su UTXO e CoinMetrics ne fornisce l’MVRV, perciò l’indicatore viene mostrato. Tieni però presente che ogni anno viene emessa una quantità fissa, quindi l’offerta continua a crescere."
    ],
    "histH": "I cicli di prezzo di Dogecoin in sintesi",
    "hist": [
     "2013–2014: poco dopo il lancio di dicembre si fa conoscere grazie alla cultura delle mance e alle iniziative benefiche della sua community; nel 2014 inizia il merged mining con Litecoin.",
     "2017–2018: sull’onda del mercato rialzista delle cripto tocca a gennaio 2018 il massimo di allora, per poi restituire gran parte dei guadagni.",
     "2021: a gennaio vola sull’entusiasmo di Reddit e sulle ripetute citazioni di Elon Musk; a maggio, in coincidenza con la partecipazione di Musk al programma statunitense SNL, raggiunge il massimo storico di circa 0,73 dollari.",
     "2022–2023: a giugno 2022 è oltre il 90% sotto il massimo. Brevi impennate arrivano con l’acquisizione di Twitter da parte di Musk nell’ottobre di quell’anno e, ad aprile 2023, quando il logo di Twitter viene sostituito per breve tempo dall’immagine di Doge."
    ],
    "faq": [
     {
      "q": "Dogecoin ha un proprio indice di paura e avidità?",
      "a": "Non esiste un indice dedicato a Dogecoin. La pagina usa l’unico indice dell’intero mercato pubblicato ogni giorno da Alternative.me, che dà molto peso ai dati legati a Bitcoin."
     },
     {
      "q": "L’MVRV viene calcolato anche per Dogecoin?",
      "a": "Sì. L’API della community di CoinMetrics contiene i dati MVRV di DOGE, da cui si ricava lo Z-Score. Nei giorni in cui non si riescono a ottenere, la scheda passa a N/A e il punteggio si basa sugli altri sei indicatori."
     },
     {
      "q": "Vale la pena comprare Dogecoin in questo momento?",
      "a": "Non ti diremo di comprare o di vendere. Un punteggio alto nella scheda lungo termine (contrarian) significa che si sono accumulati segnali di paura e sottovalutazione; nella scheda breve termine (momentum) il punteggio sale man mano che il trend rialzista diventa più netto. La situazione di Dogecoin può cambiare nel giro di un giorno per un tema social, quindi usa il punteggio solo come riferimento."
     },
     {
      "q": "Notizie come le dichiarazioni di Elon Musk entrano nel punteggio?",
      "a": "Non direttamente. Il punteggio si calcola solo con il prezzo, l’indice di paura e avidità dell’intero mercato e l’MVRV, quindi le notizie si riflettono negli indicatori dopo che il prezzo si è mosso."
     },
     {
      "q": "Senza un tetto all’emissione, indicatori come il multiplo di Mayer hanno senso?",
      "a": "Multiplo di Mayer, RSI, MACD, ribasso e incrocio delle medie si calcolano solo dal prezzo, quindi si possono ottenere qualunque sia la struttura dell’offerta. Le loro linee di riferimento vengono però dall’esperienza di Bitcoin: tieni conto che su DOGE possono comparire spesso valori più estremi."
     }
    ]
   },
   "pt": {
    "title": "A pontuação de compra do Dogecoin (DOGE), explicada",
    "intro": "A página do Dogecoin extrai do preço do DOGE em dólar o RSI(14), o MACD(12·26·9), o múltiplo de Mayer (preço/média de 200 dias), a queda desde a máxima de 365 dias e o cruzamento dourado/da morte 50/200, e acrescenta o índice de medo e ganância do mercado todo e o MVRV Z-Score — sete indicadores ao todo para uma nota de 0 a 100. A pontuação se divide em cinco faixas, de STRONG BUY a OVERHEATED, e a geral pode ser consultada de graça.",
    "coinH": "O que é Dogecoin (DOGE)?",
    "coinP": [
     "Dogecoin é uma criptomoeda criada em dezembro de 2013 por Billy Markus e Jackson Palmer, meio de brincadeira, a partir do meme “Doge” do cachorro shiba inu. Ela deriva de código da família do Litecoin, usa prova de trabalho (PoW) baseada em Scrypt e, desde 2014, é minerada em conjunto com o Litecoin (merged mining).",
     "Um bloco é gerado mais ou menos a cada minuto e a recompensa é fixa em 10.000 DOGE, então cerca de 5,2 bilhões de novos DOGE são emitidos por ano, sem limite total de oferta. No começo era usada para dar gorjetas nas redes sociais e, em 2014, ficou conhecida por uma vaquinha para a equipe jamaicana de bobsled que disputou os Jogos Olímpicos de Inverno de Sochi."
    ],
    "applyH": "Como aplicar os indicadores ao Dogecoin",
    "apply": [
     "Volatilidade e redes sociais: o DOGE já subiu ou caiu dezenas e até centenas de pontos percentuais em poucos dias por causa de comentários de celebridades ou modismos nas redes sociais. Não é raro o RSI ficar muito tempo acima de 70 ou despencar abaixo de 30, então não se apoie nos sinais de sobrecompra ou sobrevenda de um único indicador.",
     "Indicadores de tendência lentos: a média de 200 dias e o cruzamento 50/200 refletem com atraso as altas que acabam em poucos dias. Logo depois de um pico, o múltiplo de Mayer passa com facilidade e por larga margem de 2,4, e o sinal de cruzamento pode surgir só quando a alta já perdeu força.",
     "Referências de queda: o DOGE caiu mais de 90% entre a máxima de maio de 2021 e junho de 2022. As zonas de −30% e −50% calibradas no Bitcoin podem ser simples correções comuns no Dogecoin.",
     "Índice de medo e ganância: o Dogecoin não tem índice de sentimento próprio; o valor exibido é o índice do mercado todo, centrado no Bitcoin. Mesmo nos dias em que só o DOGE sobe ou cai forte, esse valor pode quase não se mexer.",
     "MVRV Z-Score: assim como o Bitcoin, o Dogecoin é uma rede de prova de trabalho baseada em UTXO, e a CoinMetrics fornece o MVRV dele, por isso o indicador aparece. Lembre-se, porém, de que uma quantidade fixa é emitida todo ano, então a oferta não para de crescer."
    ],
    "histH": "Resumo dos ciclos de preço do Dogecoin",
    "hist": [
     "2013–2014: pouco depois do lançamento, em dezembro, ficou conhecido pela cultura de gorjetas e pelas ações beneficentes da comunidade; em 2014 começou a mineração conjunta com o Litecoin.",
     "2017–2018: embalado pelo mercado de alta das criptomoedas, marcou em janeiro de 2018 a máxima de então e depois devolveu a maior parte dos ganhos.",
     "2021: disparou em janeiro com a euforia no Reddit e as repetidas menções de Elon Musk e, em maio, perto da participação de Musk no programa americano SNL, atingiu a máxima histórica de cerca de US$ 0,73.",
     "2022–2023: em junho de 2022 já acumulava queda de mais de 90% desde o topo. Houve altas rápidas quando Musk comprou o Twitter, em outubro daquele ano, e em abril de 2023, quando o logotipo do Twitter foi trocado temporariamente pela imagem do Doge."
    ],
    "faq": [
     {
      "q": "O Dogecoin tem um índice de medo e ganância próprio?",
      "a": "Não há um índice exclusivo do Dogecoin. A página usa o único índice do mercado todo que a Alternative.me publica diariamente, e esse índice dá muito peso a dados ligados ao Bitcoin."
     },
     {
      "q": "O MVRV é calculado também para o Dogecoin?",
      "a": "Sim. A API comunitária da CoinMetrics tem dados de MVRV do DOGE, dos quais se obtém o Z-Score. Nos dias em que não for possível obtê-los, o cartão passa para N/A e a pontuação sai dos outros seis indicadores."
     },
     {
      "q": "Vale a pena comprar Dogecoin neste momento?",
      "a": "Não vamos dizer para você comprar ou vender. Uma pontuação alta na aba de longo prazo (contrária) significa que sinais de medo e subvalorização se acumularam; na aba de curto prazo (momentum), a pontuação sobe conforme a tendência de alta fica mais clara. A situação do Dogecoin pode mudar em um dia por causa das redes sociais, então use a pontuação só como referência."
     },
     {
      "q": "Notícias como comentários do Elon Musk entram na pontuação?",
      "a": "Não diretamente. A pontuação é calculada apenas com o preço, o índice de medo e ganância do mercado todo e o MVRV, então as notícias só se refletem nos indicadores depois que o preço se move."
     },
     {
      "q": "Sem limite de emissão, indicadores como o múltiplo de Mayer fazem sentido?",
      "a": "Múltiplo de Mayer, RSI, MACD, queda e cruzamento de médias são calculados só com o preço, então podem ser obtidos seja qual for a estrutura da oferta. As linhas de referência deles, porém, vêm da experiência do Bitcoin; conte com valores mais extremos aparecendo com frequência no DOGE."
     }
    ]
   },
   "ru": {
    "title": "Оценка момента покупки Догикоина (DOGE): разбор",
    "intro": "Страница Догикоина вычисляет по долларовой цене DOGE индикаторы RSI(14), MACD(12·26·9), множитель Майера (цена/200-дневная средняя), просадку от 365-дневного максимума и золотой/мёртвый крест 50/200, а также добавляет общерыночный индекс страха и жадности и MVRV Z-оценку — всего семь индикаторов для оценки от 0 до 100. Оценка делится на пять уровней от STRONG BUY до OVERHEATED, итоговую можно смотреть бесплатно.",
    "coinH": "Что такое Догикоин (DOGE)?",
    "coinP": [
     "Догикоин — криптовалюта, которую Билли Маркус и Джексон Палмер создали в декабре 2013 года полушутя, на основе мема «Doge» с собакой породы сиба-ину. Его код восходит к семейству Лайткоина; он использует доказательство работы (PoW) на алгоритме Scrypt и с 2014 года добывается совместно с Лайткоином (объединённый майнинг).",
     "Блок создаётся примерно раз в минуту, награда за блок зафиксирована на уровне 10 000 DOGE, поэтому ежегодно выпускается около 5,2 млрд новых монет, а общего лимита эмиссии нет. Поначалу монету использовали для чаевых в соцсетях, а в 2014 году она прославилась сбором средств для ямайской команды по бобслею, выступавшей на зимней Олимпиаде в Сочи."
    ],
    "applyH": "Как применять индикаторы к Догикоину",
    "apply": [
     "Волатильность и соцсети: DOGE уже не раз за несколько дней дорожал или дешевел на десятки и даже сотни процентов после высказываний знаменитостей или ажиотажа в соцсетях. RSI нередко подолгу держится выше 70 или обваливается ниже 30, поэтому не полагайтесь на сигналы перекупленности и перепроданности одного индикатора.",
     "Медленные трендовые индикаторы: 200-дневная средняя и крест 50/200 с опозданием отражают взлёты, которые заканчиваются за несколько дней. Сразу после всплеска множитель Майера легко уходит далеко за 2,4, а сигнал креста может появиться, когда рост уже выдохся.",
     "Ориентиры просадки: с пика в мае 2021 года до июня 2022 года DOGE подешевел более чем на 90%. Зоны −30% и −50%, рассчитанные на биткоин, для Догикоина могут быть обычной коррекцией.",
     "Индекс страха и жадности: собственного индекса настроений у Догикоина нет; показывается общерыночный индекс с упором на биткоин. Даже в дни, когда сильно растёт или падает только DOGE, это значение может почти не меняться.",
     "MVRV Z-оценка: как и биткоин, Догикоин — сеть с доказательством работы на модели UTXO, а CoinMetrics предоставляет его MVRV, поэтому индикатор отображается. Учитывайте, однако, что каждый год выпускается фиксированный объём монет и предложение постоянно растёт."
    ],
    "histH": "Ценовые циклы Догикоина вкратце",
    "hist": [
     "2013–2014: вскоре после запуска в декабре Догикоин стал известен благодаря культуре чаевых и благотворительным акциям сообщества; в 2014 году начался объединённый майнинг с Лайткоином.",
     "2017–2018: на волне бычьего рынка криптовалют DOGE в январе 2018 года установил тогдашний рекорд, а затем растерял большую часть роста.",
     "2021: в январе курс взлетел на ажиотаже в Reddit и после неоднократных упоминаний Илоном Маском, а в мае, около выступления Маска в американском шоу SNL, достиг исторического максимума — около 0,73 доллара.",
     "2022–2023: к июню 2022 года DOGE был более чем на 90% ниже пика. Кратковременные скачки случились после покупки Маском Twitter в октябре того же года и в апреле 2023 года, когда логотип Twitter временно заменили изображением Doge."
    ],
    "faq": [
     {
      "q": "Есть ли у Догикоина собственный индекс страха и жадности?",
      "a": "Индекса специально для Догикоина нет. Страница использует единственный общерыночный индекс, который Alternative.me публикует ежедневно, и в нём велик вес данных, связанных с биткоином."
     },
     {
      "q": "Рассчитывается ли MVRV и для Догикоина?",
      "a": "Да. В общедоступном API CoinMetrics есть данные MVRV по DOGE, из них выводится Z-оценка. В дни, когда данные получить не удаётся, карточка переходит в N/A, а оценка считается по остальным шести индикаторам."
     },
     {
      "q": "Имеет ли смысл покупать Догикоин прямо сейчас?",
      "a": "Мы не говорим, покупать или продавать. Высокая оценка на долгосрочной вкладке (контртренд) означает, что накопились сигналы страха и недооценки, а на краткосрочной вкладке (моментум) оценка растёт по мере того, как восходящий тренд становится отчётливее. Ситуация с Догикоином может измениться за день из-за темы в соцсетях, поэтому используйте оценку только как ориентир."
     },
     {
      "q": "Учитываются ли в оценке новости вроде высказываний Илона Маска?",
      "a": "Не напрямую. Оценка рассчитывается только по цене, общерыночному индексу страха и жадности и MVRV, поэтому новости отражаются в индикаторах уже после движения цены."
     },
     {
      "q": "Если лимита эмиссии нет, имеют ли смысл индикаторы вроде множителя Майера?",
      "a": "Множитель Майера, RSI, MACD, просадка и пересечение средних считаются только по цене, поэтому их можно получить при любой структуре предложения. Но их ориентиры взяты из опыта биткоина, так что будьте готовы к тому, что у DOGE чаще появляются более экстремальные значения."
     }
    ]
   },
   "nl": {
    "title": "De koopmoment-score van Dogecoin (DOGE) uitgelegd",
    "intro": "De Dogecoin-pagina leidt uit de dollarkoers van DOGE de RSI(14), de MACD(12·26·9), de Mayer Multiple (koers/200-daags gemiddelde), de daling vanaf de 365-daagse top en de golden/death cross 50/200 af, en voegt de marktbrede angst- en hebzuchtindex en de MVRV Z-score toe – in totaal zeven indicatoren voor een score van 0 tot 100. De score is verdeeld in vijf banden van STRONG BUY tot OVERHEATED; de totaalscore is gratis in te zien.",
    "coinH": "Wat is Dogecoin (DOGE)?",
    "coinP": [
     "Dogecoin is een cryptomunt die Billy Markus en Jackson Palmer in december 2013 half als grap maakten, gebaseerd op de ‘Doge’-meme met de shiba inu. De code stamt uit de Litecoin-familie, de munt gebruikt Scrypt-gebaseerde proof of work (PoW) en wordt sinds 2014 samen met Litecoin gemined (merged mining).",
     "Ongeveer elke minuut wordt een blok gemaakt en de blokbeloning staat vast op 10.000 DOGE, waardoor er elk jaar zo’n 5,2 miljard nieuwe DOGE bijkomen en er geen totaal maximum is. In het begin werd de munt gebruikt voor fooien op sociale media, en in 2014 werd hij bekend door een inzamelingsactie voor het Jamaicaanse bobsleeteam op de Olympische Winterspelen in Sotsji."
    ],
    "applyH": "De indicatoren toepassen op Dogecoin",
    "apply": [
     "Volatiliteit en socialemediahypes: DOGE is al binnen enkele dagen tientallen en zelfs honderden procenten gestegen of gedaald na uitspraken van beroemdheden of hypes op sociale media. Het komt geregeld voor dat de RSI lang boven 70 blijft hangen of onder 30 duikt, dus vertrouw niet op overbought- of oversold-signalen van één enkele indicator.",
     "Trage trendindicatoren: het 200-daags gemiddelde en de 50/200-kruising verwerken rally’s die na een paar dagen voorbij zijn pas laat. Direct na een piek komt de Mayer Multiple al snel ver boven 2,4, en een kruisingssignaal kan pas verschijnen als de stijging al is gekeerd.",
     "Maatstaven voor dalingen: DOGE verloor van de top in mei 2021 tot juni 2022 meer dan 90%. De zones van −30% en −50% die op Bitcoin zijn afgestemd, kunnen voor Dogecoin gewone correcties zijn.",
     "Angst- en hebzuchtindex: Dogecoin heeft geen eigen sentimentindex; de getoonde waarde is de marktbrede index die om Bitcoin draait. Zelfs op dagen waarop alleen DOGE hard stijgt of daalt, kan deze waarde nauwelijks bewegen.",
     "MVRV Z-score: net als Bitcoin is Dogecoin een UTXO-gebaseerde proof-of-workchain, en CoinMetrics levert de MVRV ervan, dus de indicator wordt getoond. Houd er wel rekening mee dat er elk jaar een vaste hoeveelheid bijkomt, zodat het aanbod blijft groeien."
    ],
    "histH": "De koerscycli van Dogecoin in het kort",
    "hist": [
     "2013–2014: kort na de lancering in december werd Dogecoin bekend door de fooiencultuur en liefdadigheidsacties van de community; in 2014 begon het merged mining met Litecoin.",
     "2017–2018: meegedragen door de cryptobullmarkt bereikte DOGE in januari 2018 zijn toenmalige record en gaf daarna het grootste deel van de winst weer prijs.",
     "2021: in januari schoot de koers omhoog door de Reddit-hype en herhaalde vermeldingen door Elon Musk, en in mei, rond Musks optreden in de Amerikaanse show SNL, bereikte DOGE zijn recordkoers van ongeveer 0,73 dollar.",
     "2022–2023: in juni 2022 stond DOGE meer dan 90% onder de top. Korte koerssprongen volgden op Musks overname van Twitter in oktober van dat jaar en in april 2023, toen het Twitter-logo tijdelijk door het Doge-plaatje werd vervangen."
    ],
    "faq": [
     {
      "q": "Heeft Dogecoin een eigen angst- en hebzuchtindex?",
      "a": "Een index specifiek voor Dogecoin bestaat niet. De pagina gebruikt de ene marktbrede index die Alternative.me dagelijks publiceert, en die geeft veel gewicht aan Bitcoin-gerelateerde data."
     },
     {
      "q": "Wordt de MVRV ook voor Dogecoin berekend?",
      "a": "Ja. De community-API van CoinMetrics heeft MVRV-data voor DOGE, waaruit de Z-score wordt afgeleid. Op dagen dat de data niet op te halen zijn, springt de kaart op N/A en komt de score uit de zes overige indicatoren."
     },
     {
      "q": "Is het verstandig om nu Dogecoin te kopen?",
      "a": "We zeggen je niet of je moet kopen of verkopen. Een hoge score op het tabblad lange termijn (tegendraads) betekent dat signalen van angst en onderwaardering zich hebben opgestapeld; op het tabblad korte termijn (momentum) stijgt de score naarmate de opwaartse trend duidelijker wordt. De situatie bij Dogecoin kan door socialemedianieuws binnen een dag omslaan, dus gebruik de score alleen als richtpunt."
     },
     {
      "q": "Tellen nieuwsfeiten zoals uitspraken van Elon Musk mee in de score?",
      "a": "Niet rechtstreeks. De score wordt alleen berekend uit de koers, de marktbrede angst- en hebzuchtindex en MVRV, dus nieuws komt pas in de indicatoren terecht nadat de koers is bewogen."
     },
     {
      "q": "Hebben indicatoren als de Mayer Multiple zin zonder maximale uitgifte?",
      "a": "Mayer Multiple, RSI, MACD, daling en de kruising van gemiddelden worden alleen uit de koers berekend en zijn dus te bepalen ongeacht de aanbodstructuur. Hun referentielijnen komen echter uit de Bitcoin-ervaring, dus reken erop dat je bij DOGE vaker extremere waarden ziet."
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
