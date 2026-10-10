/* 하단 SEO 본문 다국어 데이터 + 렌더러. index.html(광고) / member/index.html(구독자) 공유.
   언어 전환 시 window.renderSEO(lang) 호출 → section.seo 를 해당 언어로 다시 그림.
   기본 정적 HTML(한국어)은 무JS 크롤러용 폴백으로 남겨두고, JS 실행 시 현재 언어로 교체. */
(function () {
  var SEO = {
    ko: {
      title: '라이트코인 공포·탐욕 지수 & 매수 타이밍 점수',
      intro: '라이트코인 공포지수(공포·탐욕 지수, Fear & Greed Index)를 포함한 7개 실시간 지표를 합성해 “지금이 매수 타이밍인가?”를 0~100 점수로 보여주는 무료 대시보드입니다. 설치 없이 브라우저에서 바로 실행되며 13개 언어를 지원합니다.',
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
        { q: '공포지수가 낮으면 라이트코인을 사야 하나요?', a: '극단적 공포는 역사적으로 분할 매수 기회였던 경우가 많지만, 공포지수 하나만 보면 “떨어지는 칼날”을 잡을 위험이 있습니다. 본 점수는 RSI·MACD·마이어 배수·낙폭·이동평균 크로스를 함께 보고, 하락 추세에서는 점수를 보수적으로 낮춥니다.' },
        { q: '매수 타이밍 점수는 어떻게 계산되나요?', a: '7개 지표를 각각 0~100 부분점수로 환산해 가중 합성합니다. 결과는 0~100이며 5단계 밴드로 표시됩니다.' },
        { q: '무료인가요? 설치가 필요한가요?', a: '완전 무료이며 설치가 필요 없습니다. CoinGecko·Binance·Alternative.me 공개 API에서 실시간 데이터를 가져옵니다.' },
        { q: '공포지수와 매수 타이밍 점수는 무엇이 다른가요?', a: '공포지수는 심리 한 가지 지표(0~100)이고, 매수 타이밍 점수는 공포지수를 포함한 7개 지표를 합성한 종합 점수(0~100)입니다.' },
        { q: '공포지수 데이터는 어디서 가져오나요? 얼마나 자주 갱신되나요?', a: '공포·탐욕 지수는 Alternative.me, 가격·일봉은 CoinGecko·Binance, 온체인 지표는 CoinMetrics 공개 API에서 실시간으로 가져옵니다. 화면은 약 1분 주기로 자동 갱신됩니다.' },
        { q: '라이트코인 지금 사도 되나요?', a: '정답은 없지만, 매수 타이밍 점수(0~100)로 현재 시장이 과매도·공포 구간인지 과열·탐욕 구간인지 객관적으로 가늠할 수 있습니다. 장기(역발상) 탭 기준 점수가 높을수록 공포·저평가가 겹친 분할 매수 우호 구간, 낮을수록 과열 경계 구간입니다. 참고 신호일 뿐 투자 자문이 아닙니다.' },
        { q: '단기와 장기 매수 타이밍은 어떻게 다른가요?', a: '점수는 단기·장기 두 탭으로 나뉩니다. 단기(모멘텀)는 약 1~3개월 추세추종 관점으로 상승 추세가 강할수록 높고, 장기(역발상)는 약 1년 이상 사이클 관점으로 공포·저평가일수록 높습니다. 2017년 이후 백테스트에서 단기는 모멘텀, 장기는 역발상 방향이 더 잘 맞았습니다.' },
        { q: 'BOTTOM RADAR(바닥 점수)는 무엇인가요?', a: 'MVRV Z-점수 같은 온체인 지표로 시가총액이 투자자 평균 매수원가 대비 어디에 있는지 재서, 역사적 바닥 구간과의 근접도를 0~100으로 보여주는 보조 게이지입니다. 계산 근거는 “비트코인 바닥” 해설 페이지에 공개되어 있습니다.' }
      ],
      disclaimer: '⚠ 본 점수는 공개 지표를 합성한 참고 신호이며 투자 자문이 아닙니다. 모든 투자 판단과 책임은 이용자 본인에게 있습니다.'
    },
    en: {
      title: 'Litecoin Fear & Greed Index & Buy-Timing Score',
      intro: 'A free dashboard that synthesizes 7 real-time indicators — including the Litecoin Fear & Greed Index — into a 0–100 “is now a good time to buy?” score. Runs in your browser with no install, in 13 languages.',
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
        { q: 'Should I buy Litecoin when the index is low?', a: 'Extreme fear has often been an accumulation opportunity, but relying on the index alone risks catching a falling knife. This score also weighs RSI, MACD, Mayer Multiple, drawdown and moving-average crosses, and lowers the score conservatively in downtrends.' },
        { q: 'How is the buy-timing score calculated?', a: 'Each of the 7 indicators is converted to a 0–100 sub-score and weighted together. The result is 0–100, shown in 5 bands.' },
        { q: 'Is it free? Do I need to install anything?', a: 'It is completely free with no install. Real-time data comes from CoinGecko, Binance and Alternative.me public APIs.' },
        { q: 'How is the index different from the buy-timing score?', a: 'The index is a single sentiment metric (0–100); the buy-timing score is a composite of 7 indicators including the index (0–100).' },
        { q: 'Where does the data come from, and how often does it refresh?', a: 'The Fear & Greed Index comes from Alternative.me, prices and daily candles from the CoinGecko and Binance public APIs, and on-chain metrics from CoinMetrics. The screen auto-refreshes roughly every minute.' },
        { q: 'Should I buy Litecoin right now?', a: 'There is no single answer, but the buy-timing score (0–100) gives an objective read on whether the market is in an oversold/fear zone or an overheated/greed zone. On the long-term (contrarian) tab, higher scores mark zones where fear and undervaluation overlap — historically favorable for DCA — while lower scores warn of overheating. It is a reference signal, not investment advice.' },
        { q: 'How do short-term and long-term buy timing differ?', a: 'The score is split into two tabs. Short-term (momentum) takes a 1–3 month trend-following view and rises with strong uptrends; long-term (contrarian) takes a 1-year-plus cycle view and rises with fear and undervaluation. In backtests since 2017, momentum worked better short-term and contrarian worked better long-term.' },
        { q: 'What is the BOTTOM RADAR (bottom score)?', a: 'A secondary gauge that uses on-chain metrics such as the MVRV Z-Score to measure where market cap sits relative to investors’ average cost basis, showing proximity to historic bottom zones on a 0–100 scale. The full calculation is published on the “Bitcoin bottom” guide page.' }
      ],
      disclaimer: '⚠ This score is a reference signal built from public indicators, not investment advice. All decisions and responsibility are your own.'
    },
    ja: {
      title: 'ライトコイン 恐怖・強欲指数 & 買い時スコア',
      intro: 'ライトコインの恐怖・強欲指数（Fear & Greed Index）を含む7つのリアルタイム指標を合成し、「今が買い時か？」を0〜100のスコアで示す無料ダッシュボードです。インストール不要でブラウザから即実行、13言語対応。',
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
        { q: '指数が低ければライトコインを買うべき？', a: '極端な恐怖は歴史的に分割買いの好機だったことが多いですが、指数だけに頼ると「落ちるナイフ」を掴む危険があります。本スコアはRSI・MACD・マイヤー倍率・下落率・移動平均クロスも合わせて見て、下落トレンドでは保守的にスコアを下げます。' },
        { q: '買い時スコアはどう計算される？', a: '7指標をそれぞれ0〜100の部分スコアに換算し加重合成します。結果は0〜100で、5段階バンドで表示します。' },
        { q: '無料？インストールは必要？', a: '完全無料・インストール不要です。CoinGecko・Binance・Alternative.me の公開APIからリアルタイムデータを取得します。' },
        { q: '指数と買い時スコアの違いは？', a: '指数は心理1指標(0〜100)、買い時スコアは指数を含む7指標を合成した総合スコア(0〜100)です。' },
        { q: 'データはどこから？更新頻度は？', a: '恐怖・強欲指数はAlternative.me、価格・日足はCoinGecko・Binance、オンチェーン指標はCoinMetricsの公開APIからリアルタイムで取得します。画面は約1分ごとに自動更新されます。' },
        { q: 'ライトコインは今買ってもいい？', a: '正解はありませんが、買い時スコア(0〜100)で現在の市場が売られすぎ・恐怖圏か、過熱・強欲圏かを客観的に測れます。長期（逆張り）タブではスコアが高いほど恐怖と割安が重なる分割買いに有利な圏、低いほど過熱警戒圏です。参考シグナルであり投資助言ではありません。' },
        { q: '短期と長期の買い時はどう違う？', a: 'スコアは短期・長期の2タブに分かれます。短期（モメンタム）は約1〜3か月のトレンドフォロー視点で上昇トレンドが強いほど高く、長期（逆張り）は約1年以上のサイクル視点で恐怖・割安なほど高くなります。2017年以降のバックテストでは、短期はモメンタム、長期は逆張りの方向がより有効でした。' },
        { q: 'BOTTOM RADAR（底値スコア）とは？', a: 'MVRV Zスコアなどのオンチェーン指標で、時価総額が投資家の平均取得単価に対してどの位置にあるかを測り、歴史的な底値圏への近さを0〜100で示す補助ゲージです。計算根拠は「ビットコインの底」解説ページで公開しています。' }
      ],
      disclaimer: '⚠ 本スコアは公開指標を合成した参考シグナルであり、投資助言ではありません。すべての判断と責任は利用者ご自身にあります。'
    },
    zh: {
      title: '莱特币恐惧与贪婪指数 & 买入时机评分',
      intro: '一个免费仪表板，将包括莱特币恐惧与贪婪指数（Fear & Greed Index）在内的7个实时指标合成为0–100的“现在是买入时机吗？”评分。无需安装，浏览器即开即用，支持13种语言。',
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
        { q: '指数低就该买莱特币吗？', a: '极度恐惧在历史上常是分批买入良机，但只看指数有“接飞刀”的风险。本评分同时参考RSI、MACD、梅耶倍数、回撤与均线交叉，并在下跌趋势中保守下调评分。' },
        { q: '买入时机评分如何计算？', a: '将7个指标各自换算为0–100分项评分并加权合成。结果为0–100，以5档显示。' },
        { q: '免费吗？需要安装吗？', a: '完全免费、无需安装。实时数据来自 CoinGecko、Binance、Alternative.me 公开API。' },
        { q: '指数与买入时机评分有何不同？', a: '指数是单一情绪指标(0–100)；买入时机评分是包含该指数在内的7指标综合评分(0–100)。' },
        { q: '数据来自哪里？多久更新一次？', a: '恐惧与贪婪指数来自Alternative.me，价格与日K来自CoinGecko和Binance公开API，链上指标来自CoinMetrics。页面约每1分钟自动刷新。' },
        { q: '现在可以买莱特币吗？', a: '没有标准答案，但买入时机评分(0–100)能客观判断当前市场处于超卖·恐惧区还是过热·贪婪区。在长期（逆向）标签页中，评分越高代表恐惧与低估重叠、历史上利于分批买入的区间；越低则是过热警戒区。仅供参考，并非投资建议。' },
        { q: '短期和长期买入时机有何不同？', a: '评分分为短期、长期两个标签页。短期（动量）以约1–3个月的趋势跟随视角，上升趋势越强评分越高；长期（逆向）以约1年以上的周期视角，越恐惧、越低估评分越高。2017年以来的回测显示，短期动量、长期逆向的方向更有效。' },
        { q: 'BOTTOM RADAR（底部评分）是什么？', a: '一个辅助仪表，利用MVRV Z分数等链上指标衡量市值相对投资者平均持仓成本的位置，以0–100显示与历史底部区间的接近程度。计算依据在“比特币底部”解读页面公开。' }
      ],
      disclaimer: '⚠ 本评分由公开指标合成，仅供参考，并非投资建议。一切投资决定与责任由用户自负。'
    },
    'zh-Hant': {
      title: '萊特幣恐懼與貪婪指數 & 買入時機評分',
      intro: '一個免費儀表板，將包括萊特幣恐懼與貪婪指數（Fear & Greed Index）在內的7個即時指標合成為0–100的「現在是買入時機嗎？」評分。免安裝、瀏覽器即開即用，支援13種語言。',
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
        { q: '指數低就該買萊特幣嗎？', a: '極度恐懼在歷史上常是分批買入良機，但只看指數有「接飛刀」的風險。本評分同時參考RSI、MACD、梅耶倍數、回撤與均線交叉，並在下跌趨勢中保守下調評分。' },
        { q: '買入時機評分如何計算？', a: '將7個指標各自換算為0–100分項評分並加權合成。結果為0–100，以5檔顯示。' },
        { q: '免費嗎？需要安裝嗎？', a: '完全免費、免安裝。即時資料來自 CoinGecko、Binance、Alternative.me 公開API。' },
        { q: '指數與買入時機評分有何不同？', a: '指數是單一情緒指標(0–100)；買入時機評分是包含該指數在內的7指標綜合評分(0–100)。' },
        { q: '資料來自哪裡？多久更新一次？', a: '恐懼與貪婪指數來自Alternative.me，價格與日K來自CoinGecko和Binance公開API，鏈上指標來自CoinMetrics。頁面約每1分鐘自動重新整理。' },
        { q: '現在可以買萊特幣嗎？', a: '沒有標準答案，但買入時機評分(0–100)能客觀判斷當前市場處於超賣·恐懼區還是過熱·貪婪區。在長期（逆向）分頁中，評分越高代表恐懼與低估重疊、歷史上利於分批買入的區間；越低則是過熱警戒區。僅供參考，並非投資建議。' },
        { q: '短期和長期買入時機有何不同？', a: '評分分為短期、長期兩個分頁。短期（動量）以約1–3個月的趨勢跟隨視角，上升趨勢越強評分越高；長期（逆向）以約1年以上的週期視角，越恐懼、越低估評分越高。2017年以來的回測顯示，短期動量、長期逆向的方向更有效。' },
        { q: 'BOTTOM RADAR（底部評分）是什麼？', a: '一個輔助儀表，利用MVRV Z分數等鏈上指標衡量市值相對投資者平均持倉成本的位置，以0–100顯示與歷史底部區間的接近程度。計算依據在「比特幣底部」解說頁面公開。' }
      ],
      disclaimer: '⚠ 本評分由公開指標合成，僅供參考，並非投資建議。一切投資決定與責任由用戶自負。'
    },
    es: {
      title: 'Índice de miedo y codicia de Litecoin y puntuación de momento de compra',
      intro: 'Un panel gratuito que sintetiza 7 indicadores en tiempo real —incluido el índice de miedo y codicia de Litecoin— en una puntuación de 0 a 100 sobre «¿es buen momento para comprar?». Funciona en el navegador sin instalación, en 13 idiomas.',
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
        { q: '¿Debo comprar Litecoin cuando el índice está bajo?', a: 'El miedo extremo ha sido a menudo una oportunidad de acumulación, pero fiarse solo del índice arriesga «atrapar un cuchillo que cae». Esta puntuación también pondera RSI, MACD, múltiplo de Mayer, caída y cruces de medias, y la reduce de forma conservadora en tendencias bajistas.' },
        { q: '¿Cómo se calcula la puntuación de compra?', a: 'Cada uno de los 7 indicadores se convierte en una subpuntuación de 0 a 100 y se pondera. El resultado es 0–100, mostrado en 5 bandas.' },
        { q: '¿Es gratis? ¿Necesito instalar algo?', a: 'Es totalmente gratis y sin instalación. Los datos en tiempo real provienen de las API públicas de CoinGecko, Binance y Alternative.me.' },
        { q: '¿En qué se diferencia el índice de la puntuación de compra?', a: 'El índice es una sola métrica de sentimiento (0–100); la puntuación de compra es un compuesto de 7 indicadores que incluye el índice (0–100).' },
        { q: '¿De dónde vienen los datos y con qué frecuencia se actualizan?', a: 'El índice de miedo y codicia viene de Alternative.me; los precios y velas diarias, de las API públicas de CoinGecko y Binance; y las métricas on-chain, de CoinMetrics. La pantalla se actualiza automáticamente cada minuto aproximadamente.' },
        { q: '¿Debería comprar Litecoin ahora mismo?', a: 'No hay una respuesta única, pero la puntuación de compra (0–100) permite valorar objetivamente si el mercado está en zona de sobreventa/miedo o de recalentamiento/codicia. En la pestaña de largo plazo (contraria), puntuaciones altas marcan zonas donde coinciden miedo e infravaloración —históricamente favorables al DCA—, y las bajas avisan de recalentamiento. Es una señal de referencia, no asesoramiento de inversión.' },
        { q: '¿En qué se diferencian el timing de corto y de largo plazo?', a: 'La puntuación se divide en dos pestañas. El corto plazo (momentum) adopta una visión de seguimiento de tendencia de 1–3 meses y sube con tendencias alcistas fuertes; el largo plazo (contrario) adopta una visión de ciclo de más de un año y sube con miedo e infravaloración. En backtests desde 2017, el momentum funcionó mejor a corto y lo contrario a largo.' },
        { q: '¿Qué es el BOTTOM RADAR (puntuación de suelo)?', a: 'Un indicador auxiliar que usa métricas on-chain como el MVRV Z-Score para medir dónde está la capitalización respecto al coste medio de los inversores, mostrando la cercanía a zonas de suelo históricas en una escala de 0 a 100. El cálculo completo está publicado en la guía «suelo de Bitcoin».' }
      ],
      disclaimer: '⚠ Esta puntuación es una señal de referencia a partir de indicadores públicos, no asesoramiento de inversión. Todas las decisiones y la responsabilidad son tuyas.'
    },
    fr: {
      title: 'Indice de peur et d’avidité Litecoin et score de timing d’achat',
      intro: 'Un tableau de bord gratuit qui synthétise 7 indicateurs en temps réel — dont l’indice de peur et d’avidité Litecoin — en un score de 0 à 100 « est-ce le bon moment pour acheter ? ». Fonctionne dans le navigateur sans installation, en 13 langues.',
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
        { q: 'Dois-je acheter du Litecoin quand l’indice est bas ?', a: 'La peur extrême a souvent été une opportunité d’accumulation, mais se fier au seul indice risque d’« attraper un couteau qui tombe ». Ce score pondère aussi RSI, MACD, multiple de Mayer, repli et croisements de moyennes, et le réduit prudemment en tendance baissière.' },
        { q: 'Comment le score de timing d’achat est-il calculé ?', a: 'Chacun des 7 indicateurs est converti en sous-score de 0 à 100 puis pondéré. Le résultat est 0–100, affiché en 5 bandes.' },
        { q: 'Est-ce gratuit ? Faut-il installer quelque chose ?', a: 'C’est entièrement gratuit et sans installation. Les données en temps réel proviennent des API publiques de CoinGecko, Binance et Alternative.me.' },
        { q: 'Quelle différence entre l’indice et le score de timing d’achat ?', a: 'L’indice est une seule mesure de sentiment (0–100) ; le score de timing d’achat est un composite de 7 indicateurs incluant l’indice (0–100).' },
        { q: 'D’où viennent les données et à quelle fréquence sont-elles actualisées ?', a: 'L’indice de peur et d’avidité vient d’Alternative.me ; les prix et bougies journalières, des API publiques de CoinGecko et Binance ; et les métriques on-chain, de CoinMetrics. L’écran se rafraîchit automatiquement environ chaque minute.' },
        { q: 'Dois-je acheter du Litecoin maintenant ?', a: 'Il n’y a pas de réponse unique, mais le score de timing d’achat (0–100) permet d’évaluer objectivement si le marché est en zone de survente/peur ou de surchauffe/avidité. Dans l’onglet long terme (contrarian), des scores élevés marquent des zones où peur et sous-évaluation se recoupent — historiquement favorables au DCA — tandis que des scores bas signalent la surchauffe. C’est un signal de référence, pas un conseil en investissement.' },
        { q: 'Quelle différence entre le timing court terme et long terme ?', a: 'Le score est divisé en deux onglets. Le court terme (momentum) adopte une vue de suivi de tendance sur 1 à 3 mois et monte avec les tendances haussières fortes ; le long terme (contrarian) adopte une vue de cycle d’un an et plus et monte avec la peur et la sous-évaluation. Dans les backtests depuis 2017, le momentum a mieux fonctionné à court terme et le contrarian à long terme.' },
        { q: 'Qu’est-ce que le BOTTOM RADAR (score de plancher) ?', a: 'Une jauge auxiliaire qui utilise des métriques on-chain comme le MVRV Z-Score pour mesurer où se situe la capitalisation par rapport au coût moyen des investisseurs, en montrant la proximité des zones de plancher historiques sur une échelle de 0 à 100. Le calcul complet est publié sur la page « plancher du Bitcoin ».' }
      ],
      disclaimer: '⚠ Ce score est un signal de référence issu d’indicateurs publics, pas un conseil en investissement. Toutes les décisions et la responsabilité vous appartiennent.'
    },
    de: {
      title: 'Litecoin Angst- & Gier-Index & Kaufzeitpunkt-Score',
      intro: 'Ein kostenloses Dashboard, das 7 Echtzeit-Indikatoren — inkl. Litecoin Angst- & Gier-Index — zu einem 0–100-Score „Ist jetzt ein guter Kaufzeitpunkt?“ zusammenführt. Läuft im Browser ohne Installation, in 13 Sprachen.',
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
        { q: 'Soll ich Litecoin kaufen, wenn der Index niedrig ist?', a: 'Extreme Angst war historisch oft eine Akkumulationschance, doch sich allein auf den Index zu verlassen, birgt das Risiko, „ins fallende Messer zu greifen“. Dieser Score gewichtet auch RSI, MACD, Mayer-Multiple, Rückgang und MA-Kreuzungen und senkt den Wert in Abwärtstrends konservativ.' },
        { q: 'Wie wird der Kaufzeitpunkt-Score berechnet?', a: 'Jeder der 7 Indikatoren wird in einen 0–100-Teil-Score umgerechnet und gewichtet. Das Ergebnis ist 0–100, in 5 Bändern dargestellt.' },
        { q: 'Ist es kostenlos? Muss ich etwas installieren?', a: 'Es ist völlig kostenlos und ohne Installation. Echtzeitdaten stammen aus den öffentlichen APIs von CoinGecko, Binance und Alternative.me.' },
        { q: 'Wie unterscheidet sich der Index vom Kaufzeitpunkt-Score?', a: 'Der Index ist eine einzelne Stimmungskennzahl (0–100); der Kaufzeitpunkt-Score ist ein Verbund aus 7 Indikatoren inkl. Index (0–100).' },
        { q: 'Woher stammen die Daten und wie oft werden sie aktualisiert?', a: 'Der Angst- & Gier-Index stammt von Alternative.me, Preise und Tageskerzen von den öffentlichen APIs von CoinGecko und Binance, On-Chain-Metriken von CoinMetrics. Der Bildschirm aktualisiert sich etwa jede Minute automatisch.' },
        { q: 'Sollte ich Litecoin jetzt kaufen?', a: 'Eine eindeutige Antwort gibt es nicht, aber der Kaufzeitpunkt-Score (0–100) zeigt objektiv, ob der Markt in einer überverkauften Angst-Zone oder einer überhitzten Gier-Zone steckt. Auf dem Langfrist-Tab (antizyklisch) markieren hohe Werte Zonen, in denen Angst und Unterbewertung zusammenfallen — historisch günstig für DCA —, niedrige warnen vor Überhitzung. Ein Referenzsignal, keine Anlageberatung.' },
        { q: 'Wie unterscheiden sich kurz- und langfristiges Kauftiming?', a: 'Der Score ist in zwei Tabs geteilt. Kurzfristig (Momentum) folgt einer Trendfolge-Sicht von 1–3 Monaten und steigt mit starken Aufwärtstrends; langfristig (antizyklisch) folgt einer Zyklus-Sicht von über einem Jahr und steigt mit Angst und Unterbewertung. In Backtests seit 2017 funktionierte kurzfristig Momentum und langfristig die antizyklische Richtung besser.' },
        { q: 'Was ist der BOTTOM RADAR (Boden-Score)?', a: 'Eine Zusatzanzeige, die mit On-Chain-Metriken wie den MVRV Z-Score misst, wo die Marktkapitalisierung relativ zum durchschnittlichen Einstandskurs der Anleger liegt, und die Nähe zu historischen Bodenzonen auf einer Skala von 0–100 zeigt. Die vollständige Berechnung ist auf der Seite „Bitcoin-Boden“ veröffentlicht.' }
      ],
      disclaimer: '⚠ Dieser Score ist ein Referenzsignal aus öffentlichen Indikatoren, keine Anlageberatung. Alle Entscheidungen und die Verantwortung liegen bei Ihnen.'
    },
    it: {
      title: 'Indice di paura e avidità Litecoin e punteggio di timing d’acquisto',
      intro: 'Una dashboard gratuita che sintetizza 7 indicatori in tempo reale — incluso l’indice di paura e avidità di Litecoin — in un punteggio 0–100 «è il momento giusto per comprare?». Funziona nel browser senza installazione, in 13 lingue.',
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
        { q: 'Dovrei comprare Litecoin quando l’indice è basso?', a: 'La paura estrema è stata spesso un’occasione di accumulo, ma affidarsi solo all’indice rischia di «prendere un coltello che cade». Questo punteggio pesa anche RSI, MACD, multiplo di Mayer, ribasso e incroci di medie, e lo riduce in modo prudente nei trend ribassisti.' },
        { q: 'Come si calcola il punteggio d’acquisto?', a: 'Ciascuno dei 7 indicatori è convertito in un sotto-punteggio 0–100 e ponderato. Il risultato è 0–100, mostrato in 5 bande.' },
        { q: 'È gratis? Serve installare qualcosa?', a: 'È completamente gratis e senza installazione. I dati in tempo reale provengono dalle API pubbliche di CoinGecko, Binance e Alternative.me.' },
        { q: 'Che differenza c’è tra l’indice e il punteggio d’acquisto?', a: 'L’indice è una singola misura di sentiment (0–100); il punteggio d’acquisto è un composito dei 7 indicatori incluso l’indice (0–100).' },
        { q: 'Da dove vengono i dati e con che frequenza si aggiornano?', a: 'L’indice di paura e avidità viene da Alternative.me; prezzi e candele giornaliere dalle API pubbliche di CoinGecko e Binance; le metriche on-chain da CoinMetrics. Lo schermo si aggiorna automaticamente circa ogni minuto.' },
        { q: 'Dovrei comprare Litecoin adesso?', a: 'Non c’è una risposta unica, ma il punteggio d’acquisto (0–100) permette di valutare oggettivamente se il mercato è in zona ipervenduto/paura o surriscaldato/avidità. Nella scheda a lungo termine (contrarian), punteggi alti indicano zone in cui paura e sottovalutazione coincidono — storicamente favorevoli al PAC — mentre punteggi bassi avvertono del surriscaldamento. È un segnale di riferimento, non consulenza d’investimento.' },
        { q: 'Che differenza c’è tra timing a breve e a lungo termine?', a: 'Il punteggio è diviso in due schede. Il breve termine (momentum) adotta una visione trend-following di 1–3 mesi e sale con trend rialzisti forti; il lungo termine (contrarian) adotta una visione di ciclo oltre l’anno e sale con paura e sottovalutazione. Nei backtest dal 2017, il momentum ha funzionato meglio nel breve e il contrarian nel lungo.' },
        { q: 'Cos’è il BOTTOM RADAR (punteggio di minimo)?', a: 'Un indicatore ausiliario che usa metriche on-chain come l’MVRV Z-Score per misurare dove si trova la capitalizzazione rispetto al costo medio degli investitori, mostrando la vicinanza alle zone di minimo storiche su una scala 0–100. Il calcolo completo è pubblicato nella guida «minimo di Bitcoin».' }
      ],
      disclaimer: '⚠ Questo punteggio è un segnale di riferimento da indicatori pubblici, non consulenza d’investimento. Ogni decisione e responsabilità è tua.'
    },
    pt: {
      title: 'Índice de medo e ganância do Litecoin e pontuação de momento de compra',
      intro: 'Um painel gratuito que sintetiza 7 indicadores em tempo real — incluindo o índice de medo e ganância do Litecoin — numa pontuação de 0 a 100 «é uma boa hora para comprar?». Roda no navegador sem instalação, em 13 idiomas.',
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
        { q: 'Devo comprar Litecoin quando o índice está baixo?', a: 'O medo extremo foi muitas vezes uma oportunidade de acumulação, mas confiar só no índice arrisca «pegar uma faca caindo». Esta pontuação também pondera RSI, MACD, múltiplo de Mayer, queda e cruzamentos de médias, e a reduz de forma conservadora em tendências de baixa.' },
        { q: 'Como a pontuação de compra é calculada?', a: 'Cada um dos 7 indicadores é convertido numa subpontuação de 0 a 100 e ponderado. O resultado é 0–100, em 5 faixas.' },
        { q: 'É grátis? Preciso instalar algo?', a: 'É totalmente grátis e sem instalação. Os dados em tempo real vêm das APIs públicas da CoinGecko, Binance e Alternative.me.' },
        { q: 'Qual a diferença entre o índice e a pontuação de compra?', a: 'O índice é uma única métrica de sentimento (0–100); a pontuação de compra é um composto de 7 indicadores incluindo o índice (0–100).' },
        { q: 'De onde vêm os dados e com que frequência são atualizados?', a: 'O índice de medo e ganância vem da Alternative.me; preços e velas diárias, das APIs públicas da CoinGecko e da Binance; e as métricas on-chain, da CoinMetrics. A tela atualiza automaticamente a cada minuto, aproximadamente.' },
        { q: 'Devo comprar Litecoin agora?', a: 'Não há resposta única, mas a pontuação de compra (0–100) permite avaliar objetivamente se o mercado está em zona de sobrevenda/medo ou de superaquecimento/ganância. Na aba de longo prazo (contrária), pontuações altas marcam zonas onde medo e subvalorização coincidem — historicamente favoráveis ao DCA —, e as baixas alertam para superaquecimento. É um sinal de referência, não consultoria de investimento.' },
        { q: 'Qual a diferença entre o timing de curto e de longo prazo?', a: 'A pontuação divide-se em duas abas. O curto prazo (momentum) adota uma visão de seguimento de tendência de 1–3 meses e sobe com tendências de alta fortes; o longo prazo (contrário) adota uma visão de ciclo de mais de um ano e sobe com medo e subvalorização. Em backtests desde 2017, o momentum funcionou melhor no curto e o contrário no longo.' },
        { q: 'O que é o BOTTOM RADAR (pontuação de fundo)?', a: 'Um medidor auxiliar que usa métricas on-chain como o MVRV Z-Score para medir onde a capitalização está em relação ao custo médio dos investidores, mostrando a proximidade de zonas de fundo históricas numa escala de 0 a 100. O cálculo completo está publicado no guia «fundo do Bitcoin».' }
      ],
      disclaimer: '⚠ Esta pontuação é um sinal de referência a partir de indicadores públicos, não é consultoria de investimento. Todas as decisões e a responsabilidade são suas.'
    },
    ru: {
      title: 'Индекс страха и жадности лайткоина и оценка времени покупки',
      intro: 'Бесплатная панель, которая объединяет 7 индикаторов в реальном времени — включая индекс страха и жадности лайткоина — в оценку от 0 до 100 «подходящее ли сейчас время для покупки?». Работает в браузере без установки, на 13 языках.',
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
        { q: 'Покупать ли лайткоин, когда индекс низкий?', a: 'Крайний страх исторически часто был возможностью накопления, но полагаться только на индекс рискованно — можно «поймать падающий нож». Эта оценка также учитывает RSI, MACD, множитель Майера, просадку и пересечения средних и консервативно снижается в нисходящих трендах.' },
        { q: 'Как рассчитывается оценка покупки?', a: 'Каждый из 7 индикаторов переводится в частную оценку 0–100 и взвешивается. Результат — 0–100, в 5 диапазонах.' },
        { q: 'Это бесплатно? Нужно ли что-то устанавливать?', a: 'Полностью бесплатно и без установки. Данные в реальном времени берутся из публичных API CoinGecko, Binance и Alternative.me.' },
        { q: 'Чем индекс отличается от оценки покупки?', a: 'Индекс — одна метрика настроения (0–100); оценка покупки — составной показатель из 7 индикаторов, включая индекс (0–100).' },
        { q: 'Откуда берутся данные и как часто они обновляются?', a: 'Индекс страха и жадности — с Alternative.me; цены и дневные свечи — из публичных API CoinGecko и Binance; ончейн-метрики — из CoinMetrics. Экран автоматически обновляется примерно раз в минуту.' },
        { q: 'Стоит ли покупать лайткоин прямо сейчас?', a: 'Единственно верного ответа нет, но оценка покупки (0–100) объективно показывает, находится ли рынок в зоне перепроданности/страха или перегрева/жадности. На вкладке долгосрочного (контртрендового) взгляда высокие значения отмечают зоны, где совпадают страх и недооценка — исторически благоприятные для усреднения, — а низкие предупреждают о перегреве. Это справочный сигнал, а не инвестиционная рекомендация.' },
        { q: 'Чем отличаются краткосрочный и долгосрочный тайминг?', a: 'Оценка разделена на две вкладки. Краткосрочная (моментум) использует трендследящий взгляд на 1–3 месяца и растёт при сильных восходящих трендах; долгосрочная (контртренд) — циклический взгляд от года и растёт при страхе и недооценке. В бэктестах с 2017 года на коротком горизонте лучше работал моментум, на длинном — контртренд.' },
        { q: 'Что такое BOTTOM RADAR (оценка дна)?', a: 'Вспомогательный индикатор, который с помощью ончейн-метрик, таких как MVRV Z-оценка, измеряет положение капитализации относительно средней цены входа инвесторов и показывает близость к историческим зонам дна по шкале 0–100. Полный расчёт опубликован на странице «дно биткоина».' }
      ],
      disclaimer: '⚠ Эта оценка — справочный сигнал на основе публичных индикаторов, а не инвестиционная рекомендация. Все решения и ответственность — на вас.'
    },
    nl: {
      title: 'Litecoin Angst- & Hebzucht-index en koopmoment-score',
      intro: 'Een gratis dashboard dat 7 realtime indicatoren — inclusief de Litecoin Angst- & Hebzucht-index — samenvoegt tot een score van 0–100 voor «is het nu een goed moment om te kopen?». Draait in de browser zonder installatie, in 13 talen.',
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
        { q: 'Moet ik Litecoin kopen als de index laag is?', a: 'Extreme angst was vaak een accumulatiekans, maar alleen op de index vertrouwen riskeert «een vallend mes te vangen». Deze score weegt ook RSI, MACD, Mayer Multiple, daling en gemiddelde-kruisingen mee, en verlaagt de score behoudend in dalende trends.' },
        { q: 'Hoe wordt de koopmoment-score berekend?', a: 'Elk van de 7 indicatoren wordt omgezet naar een deelscore van 0–100 en gewogen. Het resultaat is 0–100, in 5 banden.' },
        { q: 'Is het gratis? Moet ik iets installeren?', a: 'Het is volledig gratis en zonder installatie. Realtime data komt van de publieke API’s van CoinGecko, Binance en Alternative.me.' },
        { q: 'Wat is het verschil tussen de index en de koopmoment-score?', a: 'De index is één sentimentmaatstaf (0–100); de koopmoment-score is een samenstelling van 7 indicatoren inclusief de index (0–100).' },
        { q: 'Waar komen de gegevens vandaan en hoe vaak worden ze ververst?', a: 'De Angst- & Hebzucht-index komt van Alternative.me; prijzen en dagcandles van de publieke API’s van CoinGecko en Binance; on-chain-metrieken van CoinMetrics. Het scherm ververst ongeveer elke minuut automatisch.' },
        { q: 'Moet ik nu Litecoin kopen?', a: 'Er is geen eenduidig antwoord, maar de koopmoment-score (0–100) geeft een objectief beeld of de markt in een oversold/angst-zone of een oververhitte/hebzucht-zone zit. Op het langetermijn-tabblad (tegendraads) markeren hoge scores zones waar angst en onderwaardering samenvallen — historisch gunstig voor DCA — terwijl lage scores waarschuwen voor oververhitting. Het is een referentiesignaal, geen beleggingsadvies.' },
        { q: 'Hoe verschillen korte- en langetermijn-kooptiming?', a: 'De score is verdeeld over twee tabbladen. Korte termijn (momentum) hanteert een trendvolgende blik van 1–3 maanden en stijgt bij sterke opwaartse trends; lange termijn (tegendraads) hanteert een cyclusblik van ruim een jaar en stijgt bij angst en onderwaardering. In backtests sinds 2017 werkte momentum beter op korte termijn en tegendraads beter op lange termijn.' },
        { q: 'Wat is de BOTTOM RADAR (bodemscore)?', a: 'Een hulpmeter die met on-chain-metrieken zoals de MVRV Z-score meet waar de marktkapitalisatie staat ten opzichte van de gemiddelde kostprijs van beleggers, en de nabijheid van historische bodemzones toont op een schaal van 0–100. De volledige berekening staat op de pagina «Bitcoin-bodem».' }
      ],
      disclaimer: '⚠ Deze score is een referentiesignaal uit publieke indicatoren, geen beleggingsadvies. Alle beslissingen en verantwoordelijkheid zijn van uzelf.'
    },
    th: {
      title: 'ดัชนีความกลัวและความโลภไลต์คอยน์ และคะแนนจังหวะซื้อ',
      intro: 'แดชบอร์ดฟรีที่รวม 7 ตัวชี้วัดแบบเรียลไทม์ — รวมถึงดัชนีความกลัวและความโลภของไลต์คอยน์ — เป็นคะแนน 0–100 ว่า “ตอนนี้เป็นจังหวะซื้อหรือไม่?” ใช้งานในเบราว์เซอร์ได้ทันที ไม่ต้องติดตั้ง รองรับ 13 ภาษา',
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
        { q: 'ถ้าดัชนีต่ำควรซื้อไลต์คอยน์ไหม?', a: 'ความกลัวสุดขีดในอดีตมักเป็นโอกาสทยอยซื้อ แต่ดูเพียงดัชนีอย่างเดียวเสี่ยง “รับมีดที่กำลังตก” คะแนนนี้ยังพิจารณา RSI, MACD, Mayer Multiple, การย่อ และการตัดกันของเส้นเฉลี่ย และลดคะแนนอย่างระมัดระวังในแนวโน้มขาลง' },
        { q: 'คะแนนจังหวะซื้อคำนวณอย่างไร?', a: 'แปลงแต่ละตัวชี้วัดทั้ง 7 เป็นคะแนนย่อย 0–100 แล้วถ่วงน้ำหนักรวมกัน ผลลัพธ์คือ 0–100 แสดงเป็น 5 ระดับ' },
        { q: 'ฟรีไหม? ต้องติดตั้งไหม?', a: 'ฟรีทั้งหมดและไม่ต้องติดตั้ง ข้อมูลเรียลไทม์มาจาก API สาธารณะของ CoinGecko, Binance และ Alternative.me' },
        { q: 'ดัชนีกับคะแนนจังหวะซื้อต่างกันอย่างไร?', a: 'ดัชนีเป็นตัวชี้วัดอารมณ์เดียว (0–100); คะแนนจังหวะซื้อเป็นคะแนนรวมจาก 7 ตัวชี้วัดรวมถึงดัชนี (0–100)' },
        { q: 'ข้อมูลมาจากไหน อัปเดตบ่อยแค่ไหน?', a: 'ดัชนีความกลัว-ความโลภมาจาก Alternative.me ราคาและแท่งเทียนรายวันมาจาก API สาธารณะของ CoinGecko และ Binance ส่วนตัวชี้วัดออนเชนมาจาก CoinMetrics หน้าจออัปเดตอัตโนมัติราวทุก 1 นาที' },
        { q: 'ตอนนี้ควรซื้อไลต์คอยน์ไหม?', a: 'ไม่มีคำตอบตายตัว แต่คะแนนจังหวะซื้อ (0–100) ช่วยประเมินอย่างเป็นกลางว่าตลาดอยู่ในโซนขายมากเกิน/ความกลัว หรือโซนร้อนแรง/ความโลภ ในแท็บระยะยาว (สวนตลาด) คะแนนยิ่งสูงหมายถึงโซนที่ความกลัวและราคาต่ำกว่ามูลค่าทับซ้อนกัน ซึ่งในอดีตเอื้อต่อ DCA ส่วนคะแนนต่ำเตือนถึงความร้อนแรง เป็นเพียงสัญญาณอ้างอิง ไม่ใช่คำแนะนำการลงทุน' },
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
  /* 푸터 설명 문단(.foot-desc) — 라이트코인 언급이 있어 공통 foot-i18n.js 가 아니라 여기에 둔다 */
  var FOOT_DESC = {
    ko: 'broodev는 설치 없이 브라우저에서 바로 쓰는 무료 웹앱을 만드는 앱 포트폴리오입니다. 이 페이지의 라이트코인 공포·탐욕 지수와 매수 타이밍 점수는 공개 지표를 합성한 참고 정보이며 투자 자문이 아닙니다. 광고는 Google AdSense를 통해 게재될 수 있습니다.',
    en: 'broodev is a portfolio of free web apps that run right in your browser with no install. The Litecoin Fear & Greed Index and buy-timing score on this page are reference information synthesized from public indicators, not investment advice. Ads may be served through Google AdSense.',
    ja: 'broodevは、インストール不要でブラウザからすぐ使える無料Webアプリを作るアプリポートフォリオです。このページのライトコイン恐怖・強欲指数と買い時スコアは公開指標を合成した参考情報であり、投資助言ではありません。広告はGoogle AdSenseを通じて掲載される場合があります。',
    zh: 'broodev 是一个应用作品集，制作无需安装、在浏览器中即可直接使用的免费网页应用。本页的莱特币恐惧与贪婪指数和买入时机评分是综合公开指标得出的参考信息，不构成投资建议。广告可能通过 Google AdSense 投放。',
    'zh-Hant': 'broodev 是一個應用作品集，製作無需安裝、在瀏覽器中即可直接使用的免費網頁應用。本頁的萊特幣恐懼與貪婪指數和買入時機評分是綜合公開指標得出的參考資訊，不構成投資建議。廣告可能透過 Google AdSense 刊登。',
    th: 'broodev คือพอร์ตโฟลิโอแอปที่สร้างเว็บแอปฟรีซึ่งใช้งานได้ทันทีในเบราว์เซอร์โดยไม่ต้องติดตั้ง ดัชนีความกลัว-ความโลภไลต์คอยน์และคะแนนจังหวะซื้อในหน้านี้เป็นข้อมูลอ้างอิงที่สังเคราะห์จากตัวชี้วัดสาธารณะ ไม่ใช่คำแนะนำการลงทุน โฆษณาอาจแสดงผ่าน Google AdSense',
    es: 'broodev es un portafolio de aplicaciones web gratuitas que funcionan directamente en el navegador, sin instalación. El Índice de Miedo y Codicia de Litecoin y la puntuación de momento de compra de esta página son información de referencia elaborada a partir de indicadores públicos, no asesoramiento de inversión. Los anuncios pueden mostrarse a través de Google AdSense.',
    fr: 'broodev est un portfolio d’applications web gratuites qui s’utilisent directement dans le navigateur, sans installation. L’indice Peur & Avidité du Litecoin et le score de timing d’achat de cette page sont des informations de référence issues d’indicateurs publics, et non un conseil en investissement. Des annonces peuvent être diffusées via Google AdSense.',
    de: 'broodev ist ein Portfolio kostenloser Web-Apps, die ohne Installation direkt im Browser laufen. Der Litecoin-Angst-und-Gier-Index und der Kauf-Timing-Score auf dieser Seite sind aus öffentlichen Indikatoren zusammengesetzte Referenzinformationen und keine Anlageberatung. Werbung kann über Google AdSense ausgeliefert werden.',
    it: 'broodev è un portfolio di web app gratuite che funzionano direttamente nel browser, senza installazione. L’Indice di Paura e Avidità di Litecoin e il punteggio di timing d’acquisto in questa pagina sono informazioni di riferimento ricavate da indicatori pubblici, non una consulenza di investimento. Gli annunci possono essere pubblicati tramite Google AdSense.',
    pt: 'O broodev é um portefólio de aplicações web gratuitas que funcionam diretamente no navegador, sem instalação. O Índice de Medo e Ganância do Litecoin e a pontuação de momento de compra desta página são informação de referência sintetizada a partir de indicadores públicos, não aconselhamento de investimento. Os anúncios podem ser apresentados através do Google AdSense.',
    ru: 'broodev — это портфолио бесплатных веб-приложений, которые работают прямо в браузере без установки. Индекс страха и жадности лайткоина и оценка момента покупки на этой странице — справочная информация, собранная из открытых индикаторов, а не инвестиционная рекомендация. Реклама может показываться через Google AdSense.',
    nl: 'broodev is een portfolio van gratis webapps die zonder installatie direct in je browser werken. De Litecoin Angst- en Hebzuchtindex en de koop-timingscore op deze pagina zijn referentie-informatie samengesteld uit openbare indicatoren, geen beleggingsadvies. Advertenties kunnen via Google AdSense worden getoond.'
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
    "title": "Litecoin (LTC) Buy-Timing Score — Where 7 Indicators Stand Now",
    "intro": "LTC_SIGNAL computes RSI(14), MACD(12·26·9), the Mayer Multiple, the drawdown from the 365-day high, the 50/200 golden/death cross and the MVRV Z-Score from Litecoin's daily prices and on-chain data, then adds the market-wide Fear & Greed Index to produce a 0–100 buy-timing score. The score is shown in five bands: STRONG BUY, ACCUMULATE, NEUTRAL, CAUTION and OVERHEATED. Today's score is free and runs in your browser with no install.",
    "coinH": "What is Litecoin (LTC)?",
    "coinP": [
     "Litecoin is a cryptocurrency that former Google engineer Charlie Lee built from Bitcoin's codebase and released in October 2011. It uses proof of work, but with the Scrypt hashing algorithm instead of SHA-256, and targets a block roughly every 2.5 minutes versus about 10 for Bitcoin. It has long been used for payments and transfers, and is often nicknamed the “silver” to Bitcoin's “gold.”",
     "Supply is capped at 84 million coins — four times Bitcoin's — and the block reward halves every 840,000 blocks, or roughly every four years. Halvings took place in August 2015, 2019 and 2023. Litecoin activated SegWit in May 2017, ahead of Bitcoin, and in May 2022 added MWEB (MimbleWimble Extension Blocks), an opt-in feature for confidential transactions. Since 2014 it has also been merge-mined with Dogecoin."
    ],
    "applyH": "Applying the indicators to Litecoin",
    "apply": [
     "The Fear & Greed Index is not a Litecoin-specific reading: it is a market-wide index published daily by Alternative.me and weighted heavily toward Bitcoin. The LTC screen therefore shows the same value as the BTC screen, and Litecoin's own behavior comes through in the price-based indicators.",
     "Litecoin is one of the coins for which CoinMetrics' community data carries up-to-date MVRV, so the MVRV Z-Score is calculated normally. Like Bitcoin, Litecoin uses a UTXO model, so realized cap — each coin valued at the price when it last moved — applies in exactly the same way.",
     "The Mayer Multiple thresholds (below 0.8 strong buy, above 2.4 overheated) and the drawdown thresholds (−30% watch, −50% strong buy) come from Bitcoin's history. Litecoin has fallen more than 90% from a peak, as in 2018, so passing −50% does not by itself mean a bottom is near.",
     "Litecoin usually moves in the same direction as Bitcoin, but with wider swings. In sideways markets the 50-day and 200-day averages can tangle and flip the cross signal at short intervals, so look at where several indicators point together rather than at a single cross.",
     "Halvings are not an input to the score. In 2019 the price rose in the months before the halving and fell after it; patterns like that show up only indirectly, through price indicators such as RSI, MACD and the Mayer Multiple."
    ],
    "histH": "Litecoin price cycles at a glance",
    "hist": [
     "2011 — Mainnet launched in October, one of the earliest altcoins built on Bitcoin's code.",
     "2017 — After activating SegWit in May, LTC hit its cycle high in December during the year-end crypto rally. That same month Charlie Lee said he had sold or donated all of his LTC, citing a conflict of interest.",
     "2018 — Fell more than 90% from the 2017 high during the bear market.",
     "2019 — Rallied strongly in the first half ahead of the second halving in August, then declined after the halving.",
     "2021 — Set an all-time high in May, then fell sharply again in the 2022 bear market. The MWEB upgrade followed in May 2022 and the third halving in August 2023."
    ],
    "faq": [
     {
      "q": "Is the fear index on this page specific to Litecoin?",
      "a": "No. It is Alternative.me's market-wide crypto sentiment index, not a Litecoin-only measure. That is why the card is labelled “market-wide,” and the Bitcoin screen uses the same value."
     },
     {
      "q": "Does Litecoin get an MVRV reading?",
      "a": "Yes. The CoinMetrics community API provides current MVRV for Litecoin, so the MVRV Z-Score feeds into the score. It shows how far market cap sits above realized cap (holders' aggregate cost basis), measured in standard deviations; the detailed values on the indicator card are a premium feature."
     },
     {
      "q": "Does the score rise as a halving approaches?",
      "a": "No. The halving schedule is not an input. The score is built only from five price indicators, the market-wide Fear & Greed Index and MVRV, so halving expectations affect it only once they show up in the price. Based on block height, the next halving is expected around 2027."
     },
     {
      "q": "Why do the Bitcoin and Litecoin scores differ?",
      "a": "The method is the same, but RSI, MACD, the Mayer Multiple, drawdown, the moving-average cross and MVRV are all calculated from Litecoin's own price and on-chain data. Only the market-wide Fear & Greed Index is shared. The Thermocap indicator appears on the Bitcoin screen only."
     },
     {
      "q": "Should I buy Litecoin now?",
      "a": "This site does not recommend buying or selling. The score is a reference for where the market stands. On the long-term (contrarian) tab, a higher score means more oversold, fear and undervaluation signals are lining up, and a lower score means overheating signals are; the short-term (momentum) tab works the other way and scores higher the stronger the trend. Decisions and their consequences are your own."
     },
     {
      "q": "Where does the Litecoin data come from?",
      "a": "Prices and daily candles come from the public CoinGecko and Binance (LTC/USDT) APIs, the Fear & Greed Index from Alternative.me, and MVRV from CoinMetrics. Prices refresh automatically about once a minute."
     }
    ]
   },
   "ja": {
    "title": "ライトコイン(LTC)買い時スコア — 7つの指標で見る現在地",
    "intro": "LTC_SIGNALは、ライトコインの日足価格とオンチェーンデータからRSI(14)・MACD(12·26·9)・マイヤー倍率・365日高値からの下落率・50/200日線のゴールデンクロス/デッドクロス・MVRV Zスコアを計算し、暗号資産市場全体の恐怖・強欲指数を加えて0〜100の買い時スコアにまとめます。スコアはSTRONG BUY・ACCUMULATE・NEUTRAL・CAUTION・OVERHEATEDの5段階で表示されます。今日のスコアは無料で、インストールなしでブラウザからすぐに見られます。",
    "coinH": "ライトコイン(LTC)とは?",
    "coinP": [
     "ライトコインは、元Googleエンジニアのチャーリー・リー(Charlie Lee)がビットコインのコードをもとに開発し、2011年10月に公開した暗号資産です。プルーフ・オブ・ワーク(PoW)を採用していますが、ハッシュ関数にはSHA-256ではなくScryptを使い、ブロック生成間隔はビットコイン(約10分)より短い約2.5分に設定されています。送金・決済向けに長く使われてきたコインで、ビットコインを「金」とするなら「銀」にあたる、と呼ばれることもあります。",
     "発行上限はビットコインの4倍にあたる8,400万枚で、84万ブロック(約4年)ごとにマイニング報酬が半減します。半減期は2015年・2019年・2023年のいずれも8月に実施されました。2017年5月にはビットコインより先にSegWitを有効化し、2022年5月には任意で使える秘匿取引機能MWEB(MimbleWimble拡張ブロック)を導入しました。2014年からはドージコインとのマージマイニングも行われています。"
    ],
    "applyH": "ライトコインに指標を当てはめるときの注意",
    "apply": [
     "恐怖・強欲指数はライトコイン固有の値ではなく、Alternative.meが毎日発表する暗号資産市場全体の指数で、ビットコインの比重が大きいものです。そのためLTC画面にもBTC画面と同じ値が入り、ライトコイン独自の動きは残りの価格指標に表れます。",
     "ライトコインはCoinMetricsのコミュニティデータでMVRVが最新まで提供されているため、MVRV Zスコアが通常どおり計算されます。ビットコインと同じUTXO型なので、各コインを最後に動いた時点の価格で評価する実現時価総額の考え方がそのまま当てはまります。",
     "マイヤー倍率の基準(0.8未満で強い買い、2.4超で過熱)や下落率の基準(−30%で注目、−50%で強い買い)は、ビットコインの歴史から導いた値です。ライトコインは2018年のように高値から90%以上下げたことがあり、−50%を超えたからといって底が近いとは限りません。",
     "ライトコインはおおむねビットコインと同じ方向に動きますが、値幅はより大きくなりがちです。横ばい局面では50日線と200日線が絡み合い、クロスのシグナルが短い間隔で入れ替わることがあるため、クロス単体より複数の指標がそろって示す方向を見てください。",
     "半減期はスコアの入力値ではありません。2019年には半減期の数か月前に価格が先に上がり、半減期後に下落しましたが、こうした動きはRSI・MACD・マイヤー倍率などの価格指標を通じて間接的に表れるだけです。"
    ],
    "histH": "ライトコインの価格サイクル概要",
    "hist": [
     "2011年 — 10月にメインネットを公開。ビットコインのコードをもとにした初期のアルトコインの一つとして始まりました。",
     "2017年 — 5月のSegWit有効化の後、年末の暗号資産上昇相場の中で12月にサイクル高値をつけました。同じ月、チャーリー・リーは利益相反を理由に、保有するLTCをすべて売却または寄付したと公表しました。",
     "2018年 — 弱気相場の中で2017年の高値から90%以上下落しました。",
     "2019年 — 8月の2回目の半減期を前に上半期に大きく上昇し、半減期後は下落しました。",
     "2021年 — 5月に史上最高値を記録した後、2022年の弱気相場で再び大きく下げました。その後、2022年5月にMWEBアップグレード、2023年8月に3回目の半減期が続きました。"
    ],
    "faq": [
     {
      "q": "この画面の恐怖指数はライトコイン専用ですか?",
      "a": "いいえ。Alternative.meが発表する暗号資産市場全体の心理指数で、ライトコインだけを測った値ではありません。そのためカードには「市場全体」と表示しており、ビットコイン画面でも同じ値を使っています。"
     },
     {
      "q": "ライトコインでもMVRVは表示されますか?",
      "a": "はい。CoinMetricsのコミュニティAPIがライトコインの最新MVRVを提供しているため、MVRV Zスコアがスコア計算に入ります。時価総額が実現時価総額(保有者の取得原価の合計)をどれだけ上回っているかを標準偏差で表した値で、指標カードの詳細な数値はプレミアム機能です。"
     },
     {
      "q": "半減期が近づくとスコアは上がりますか?",
      "a": "いいえ。半減期の日程は入力値ではありません。スコアは5つの価格指標、市場全体の恐怖・強欲指数、MVRVだけで決まるため、半減期への期待は価格に表れたときに限り間接的に影響します。ブロック高から見ると、次の半減期は2027年ごろの見込みです。"
     },
     {
      "q": "ビットコインとライトコインでスコアが違うのはなぜですか?",
      "a": "計算方法は同じですが、RSI・MACD・マイヤー倍率・下落率・移動平均クロス・MVRVはすべてライトコイン自身の価格とオンチェーンデータから計算されます。共通なのは市場全体の恐怖・強欲指数だけです。Thermocap指標はビットコイン画面にしかありません。"
     },
     {
      "q": "今ライトコインを買ってもいいですか?",
      "a": "当サイトは売買を勧めません。スコアは相場の現在地を測るための参考値です。長期(逆張り)タブでは、スコアが高いほど売られ過ぎ・恐怖・割安のシグナルが重なり、低いほど過熱のシグナルが重なっていることを示します。短期(モメンタム)タブは逆に、トレンドが強いほど高くなります。判断と責任はご自身にあります。"
     },
     {
      "q": "ライトコインのデータはどこから取得していますか?",
      "a": "価格と日足はCoinGeckoとBinance(LTC/USDT)の公開API、恐怖・強欲指数はAlternative.me、MVRVはCoinMetricsから取得しています。価格は約1分ごとに自動更新されます。"
     }
    ]
   },
   "ko": {
    "title": "라이트코인(LTC) 매수 타이밍 점수 — 지표 7개로 보는 지금 위치",
    "intro": "LTC_SIGNAL은 라이트코인의 일봉 가격과 온체인 데이터로 RSI(14)·MACD(12·26·9)·마이어 배수·365일 고점 대비 낙폭·50/200 골든·데드 크로스·MVRV Z-Score를 계산하고, 암호화폐 시장 전체의 공포·탐욕 지수를 더해 0~100 매수 타이밍 점수로 합성합니다. 점수는 STRONG BUY·ACCUMULATE·NEUTRAL·CAUTION·OVERHEATED 5단계로 표시됩니다. 오늘의 점수는 무료이며 설치 없이 브라우저에서 바로 볼 수 있습니다.",
    "coinH": "라이트코인(LTC)이란?",
    "coinP": [
     "라이트코인은 전 구글 엔지니어 찰리 리(Charlie Lee)가 비트코인 코드를 바탕으로 만들어 2011년 10월에 공개한 암호화폐입니다. 작업증명(PoW) 방식이지만 해시 알고리즘으로 SHA-256 대신 스크립트(Scrypt)를 쓰고, 블록 생성 간격을 약 2.5분으로 비트코인(약 10분)보다 짧게 잡았습니다. 송금·결제용으로 오래 쓰여 왔고, 비트코인을 ‘금’에 빗댈 때 ‘은’이라는 별칭으로 불리기도 합니다.",
     "최대 발행량은 비트코인의 4배인 8,400만 개이며, 84만 블록(약 4년)마다 채굴 보상이 절반으로 줄어듭니다. 반감기는 2015년·2019년·2023년 8월에 있었습니다. 2017년 5월에는 비트코인보다 먼저 세그윗(SegWit)을 활성화했고, 2022년 5월에는 선택형 기밀 거래 기능인 MWEB(MimbleWimble 확장 블록)을 도입했습니다. 2014년부터는 도지코인과 병합 채굴(merged mining)도 이뤄지고 있습니다."
    ],
    "applyH": "라이트코인에 지표를 적용할 때",
    "apply": [
     "공포·탐욕 지수는 라이트코인만의 심리가 아니라 Alternative.me가 매일 내는 암호화폐 시장 전체 지수이고, 비트코인 비중이 큽니다. 그래서 LTC 화면에도 BTC 화면과 같은 값이 들어가며, 라이트코인 고유의 움직임은 나머지 가격 지표가 반영합니다.",
     "라이트코인은 CoinMetrics 커뮤니티 데이터에 MVRV가 최신으로 제공되는 코인이라 MVRV Z-Score가 정상적으로 계산됩니다. 비트코인과 같은 UTXO 구조여서, 각 코인을 마지막으로 움직인 시점의 가격으로 평가하는 실현 시가총액 개념이 그대로 적용됩니다.",
     "마이어 배수 기준(0.8 미만 강한 매수, 2.4 초과 과열)과 낙폭 기준(-30% 관심, -50% 강한 매수)은 비트코인 역사에서 나온 값입니다. 라이트코인은 2018년처럼 고점 대비 90% 넘게 빠진 적이 있어, -50%를 지났다고 해서 바닥이 가깝다는 뜻은 아닙니다.",
     "라이트코인은 대체로 비트코인과 같은 방향으로 움직이지만 오르내림 폭이 더 큰 편입니다. 횡보 구간에서는 50일선과 200일선이 엉켜 크로스 신호가 짧은 간격으로 뒤바뀔 수 있으니, 크로스 하나보다 여러 지표가 함께 가리키는 방향을 보세요.",
     "반감기는 점수의 입력값이 아닙니다. 2019년에는 반감기 몇 달 전에 가격이 먼저 오르고 반감기 뒤에 내려갔는데, 이런 흐름은 RSI·MACD·마이어 배수 같은 가격 지표를 통해서만 간접적으로 드러납니다."
    ],
    "histH": "라이트코인 가격 사이클 요약",
    "hist": [
     "2011년 — 10월 메인넷 공개. 비트코인 코드를 바탕으로 한 초기 알트코인 가운데 하나로 출발했습니다.",
     "2017년 — 5월 세그윗 활성화 뒤 연말 암호화폐 강세장 속에 12월 사이클 고점을 찍었습니다. 같은 달 찰리 리는 이해 충돌을 이유로 보유한 LTC를 모두 팔거나 기부했다고 밝혔습니다.",
     "2018년 — 약세장에서 2017년 고점 대비 90% 넘게 하락했습니다.",
     "2019년 — 8월 두 번째 반감기를 앞두고 상반기에 크게 올랐다가 반감기 이후 하락했습니다.",
     "2021년 — 5월 사상 최고가를 기록한 뒤 2022년 약세장에서 다시 큰 폭으로 내렸습니다. 이후 2022년 5월 MWEB 업그레이드, 2023년 8월 세 번째 반감기가 이어졌습니다."
    ],
    "faq": [
     {
      "q": "이 화면의 공포지수는 라이트코인 전용인가요?",
      "a": "아닙니다. Alternative.me가 발표하는 암호화폐 시장 전체 심리 지수로, 라이트코인만 따로 측정한 값이 아닙니다. 그래서 해당 카드에 ‘시장 전체’라고 표시하며, 비트코인 화면도 같은 값을 씁니다."
     },
     {
      "q": "라이트코인에도 MVRV가 나오나요?",
      "a": "네. CoinMetrics 커뮤니티 API가 라이트코인의 MVRV를 최신 값으로 제공하므로 MVRV Z-Score가 점수 계산에 들어갑니다. 시가총액이 실현 시가총액(보유자 평균 매수원가의 합)보다 얼마나 높은지를 표준편차 단위로 나타낸 값이며, 지표 카드의 세부 수치는 프리미엄 기능입니다."
     },
     {
      "q": "반감기가 다가오면 점수가 올라가나요?",
      "a": "아닙니다. 반감기 일정은 입력값이 아닙니다. 점수는 가격 지표 5개, 시장 전체 공포·탐욕 지수, MVRV로만 정해지므로 반감기 기대감은 가격에 반영될 때에만 간접적으로 영향을 줍니다. 블록 높이로 따지면 다음 반감기는 2027년 무렵으로 예상됩니다."
     },
     {
      "q": "비트코인 점수와 라이트코인 점수는 왜 다르게 나오나요?",
      "a": "계산 방식은 같지만 RSI·MACD·마이어 배수·낙폭·이동평균 크로스·MVRV가 모두 라이트코인 자체의 가격과 온체인 데이터로 계산되기 때문입니다. 공통으로 들어가는 것은 시장 전체 공포·탐욕 지수 하나뿐입니다. Thermocap 지표는 비트코인 화면에만 있습니다."
     },
     {
      "q": "지금 라이트코인 사도 되나요?",
      "a": "이 사이트는 매수나 매도를 권하지 않습니다. 점수는 시장의 현재 위치를 가늠하는 참고값입니다. 장기(역발상) 탭에서는 점수가 높을수록 과매도·공포·저평가 신호가 겹쳐 있고, 낮을수록 과열 신호가 겹쳐 있다는 뜻입니다. 단기(모멘텀) 탭은 반대로 추세가 강할수록 높게 나옵니다. 판단과 책임은 본인에게 있습니다."
     },
     {
      "q": "라이트코인 데이터는 어디서 가져오나요?",
      "a": "가격과 일봉은 CoinGecko와 바이낸스(LTC/USDT) 공개 API, 공포·탐욕 지수는 Alternative.me, MVRV는 CoinMetrics에서 가져옵니다. 가격은 약 1분마다 자동으로 갱신됩니다."
     }
    ]
   },
   "zh": {
    "title": "莱特币(LTC)买入时机评分——用7项指标看当前位置",
    "intro": "LTC_SIGNAL根据莱特币的日线价格和链上数据计算RSI(14)、MACD(12·26·9)、梅耶倍数、距365日高点的回撤、50/200日均线金叉/死叉以及MVRV Z分数，再加上加密货币全市场的恐惧与贪婪指数，合成0–100的买入时机评分。评分分为STRONG BUY、ACCUMULATE、NEUTRAL、CAUTION、OVERHEATED五个档位。今日评分可免费查看，无需安装，在浏览器中即可使用。",
    "coinH": "莱特币(LTC)是什么？",
    "coinP": [
     "莱特币由前谷歌工程师李启威(Charlie Lee)基于比特币代码开发，于2011年10月发布。它采用工作量证明(PoW)，但哈希算法使用Scrypt而非SHA-256，出块间隔约2.5分钟，比比特币(约10分钟)更短。莱特币长期用于转账和支付；如果把比特币比作“数字黄金”，莱特币常被称为“数字白银”。",
     "莱特币总量上限为8,400万枚，是比特币的4倍；每84万个区块(约4年)挖矿奖励减半，已在2015年、2019年和2023年的8月完成三次减半。2017年5月，莱特币先于比特币激活隔离见证(SegWit)；2022年5月又引入可选的隐私交易功能MWEB(MimbleWimble扩展区块)。自2014年起，莱特币还与狗狗币进行合并挖矿。"
    ],
    "applyH": "将指标用于莱特币时的要点",
    "apply": [
     "恐惧与贪婪指数并非莱特币专属，而是Alternative.me每日发布的加密货币全市场指数，比特币权重很高。因此LTC页面与BTC页面显示的是同一个数值，莱特币自身的走势体现在其余价格指标中。",
     "在CoinMetrics社区数据中，莱特币的MVRV持续更新，因此MVRV Z分数可以正常计算。莱特币与比特币同为UTXO模型，“按每枚币最后一次转移时的价格计值”的已实现市值算法可以直接套用。",
     "梅耶倍数的阈值(低于0.8为强烈买入，高于2.4为过热)和回撤阈值(−30%关注，−50%强烈买入)都来自比特币的历史。莱特币曾像2018年那样从高点下跌超过90%，因此跌破−50%并不意味着底部已近。",
     "莱特币大多与比特币同向波动，但幅度往往更大。在横盘行情中，50日线与200日线容易缠绕，交叉信号可能在短时间内反复切换，因此与其看单次交叉，不如看多项指标是否指向同一方向。",
     "减半本身不是评分的输入项。2019年莱特币在减半前几个月先行上涨、减半后回落，这类走势只会通过RSI、MACD、梅耶倍数等价格指标间接体现。"
    ],
    "histH": "莱特币价格周期概览",
    "hist": [
     "2011年——10月主网上线，是最早基于比特币代码的山寨币之一。",
     "2017年——5月激活隔离见证后，在年底的加密货币牛市中于12月创下周期高点。同月，李启威以利益冲突为由，宣布已卖出或捐出所持全部LTC。",
     "2018年——熊市中从2017年高点下跌超过90%。",
     "2019年——在8月第二次减半前，上半年大幅上涨，减半后转跌。",
     "2021年——5月创下历史最高价，随后在2022年熊市中再度大幅下跌。之后又经历了2022年5月的MWEB升级和2023年8月的第三次减半。"
    ],
    "faq": [
     {
      "q": "本页的恐惧指数是莱特币专属的吗？",
      "a": "不是。它是Alternative.me发布的加密货币全市场情绪指数，并非只针对莱特币测算。因此卡片上标注了“全市场”，比特币页面使用的也是同一数值。"
     },
     {
      "q": "莱特币也有MVRV吗？",
      "a": "有。CoinMetrics社区API提供莱特币的最新MVRV，因此MVRV Z分数会计入评分。它以标准差衡量市值高出已实现市值(持有者成本总和)多少；指标卡片上的详细数值属于高级版功能。"
     },
     {
      "q": "临近减半时评分会上升吗？",
      "a": "不会。减半时间表不是输入项。评分仅由5项价格指标、全市场恐惧与贪婪指数和MVRV决定，减半预期只有反映到价格上时才会间接产生影响。按区块高度推算，下一次减半预计在2027年前后。"
     },
     {
      "q": "比特币和莱特币的评分为什么不同？",
      "a": "计算方法相同，但RSI、MACD、梅耶倍数、回撤、均线交叉和MVRV都基于莱特币自身的价格和链上数据计算。两者共用的只有全市场恐惧与贪婪指数。Thermocap指标只出现在比特币页面。"
     },
     {
      "q": "现在可以买莱特币吗？",
      "a": "本站不提供买卖建议。评分只是衡量市场所处位置的参考。在长期(逆向)标签下，分数越高，说明超卖、恐惧和低估信号越集中；分数越低，说明过热信号越集中。短期(动量)标签则相反，趋势越强分数越高。决策及其后果由您自行承担。"
     },
     {
      "q": "莱特币的数据来自哪里？",
      "a": "价格和日K线来自CoinGecko和币安(LTC/USDT)的公开API，恐惧与贪婪指数来自Alternative.me，MVRV来自CoinMetrics。价格约每分钟自动刷新一次。"
     }
    ]
   },
   "zh-Hant": {
    "title": "萊特幣(LTC)買入時機評分——用7項指標看目前位置",
    "intro": "LTC_SIGNAL根據萊特幣的日線價格與鏈上資料計算RSI(14)、MACD(12·26·9)、梅耶倍數、距365日高點的回檔幅度、50/200日均線黃金交叉/死亡交叉以及MVRV Z分數，再加上加密貨幣全市場的恐懼與貪婪指數，合成0–100的買入時機評分。評分分為STRONG BUY、ACCUMULATE、NEUTRAL、CAUTION、OVERHEATED五個等級。今日評分可免費查看，免安裝，直接在瀏覽器中使用。",
    "coinH": "萊特幣(LTC)是什麼？",
    "coinP": [
     "萊特幣由前Google工程師李啟威(Charlie Lee)以比特幣程式碼為基礎開發，於2011年10月發布。它採用工作量證明(PoW)，但雜湊演算法使用Scrypt而非SHA-256，出塊間隔約2.5分鐘，比比特幣(約10分鐘)更短。萊特幣長期用於轉帳與支付；若把比特幣比作「數位黃金」，萊特幣常被稱為「數位白銀」。",
     "萊特幣總量上限為8,400萬枚，是比特幣的4倍；每84萬個區塊(約4年)挖礦獎勵減半，已在2015年、2019年與2023年的8月完成三次減半。2017年5月，萊特幣早於比特幣啟用隔離見證(SegWit)；2022年5月又導入可選用的隱私交易功能MWEB(MimbleWimble擴充區塊)。自2014年起，萊特幣也與狗狗幣進行合併挖礦。"
    ],
    "applyH": "將指標套用在萊特幣時的重點",
    "apply": [
     "恐懼與貪婪指數並非萊特幣專屬，而是Alternative.me每天發布的加密貨幣全市場指數，比特幣權重很高。因此LTC頁面與BTC頁面顯示的是同一個數值，萊特幣自身的走勢則反映在其餘價格指標中。",
     "在CoinMetrics社群資料中，萊特幣的MVRV持續更新，因此MVRV Z分數可以正常計算。萊特幣與比特幣同為UTXO模型，「以每枚幣最後一次轉移時的價格計值」的已實現市值算法可以直接套用。",
     "梅耶倍數的門檻(低於0.8為強烈買入，高於2.4為過熱)與回檔門檻(−30%關注，−50%強烈買入)都來自比特幣的歷史。萊特幣曾像2018年那樣從高點下跌超過90%，因此跌破−50%並不代表底部已近。",
     "萊特幣多半與比特幣同向波動，但幅度往往更大。在盤整行情中，50日線與200日線容易糾結，交叉訊號可能在短時間內反覆切換，因此與其看單次交叉，不如看多項指標是否指向同一方向。",
     "減半本身不是評分的輸入項。2019年萊特幣在減半前幾個月先行上漲、減半後回落，這類走勢只會透過RSI、MACD、梅耶倍數等價格指標間接呈現。"
    ],
    "histH": "萊特幣價格週期概覽",
    "hist": [
     "2011年——10月主網上線，是最早以比特幣程式碼為基礎的山寨幣之一。",
     "2017年——5月啟用隔離見證後，在年底的加密貨幣多頭行情中於12月創下週期高點。同月，李啟威以利益衝突為由，宣布已賣出或捐出所持全部LTC。",
     "2018年——空頭市場中從2017年高點下跌超過90%。",
     "2019年——在8月第二次減半前，上半年大幅上漲，減半後轉跌。",
     "2021年——5月創下歷史新高，隨後在2022年空頭市場中再度大幅下跌。之後又經歷2022年5月的MWEB升級與2023年8月的第三次減半。"
    ],
    "faq": [
     {
      "q": "本頁的恐懼指數是萊特幣專屬的嗎？",
      "a": "不是。它是Alternative.me發布的加密貨幣全市場情緒指數，並非只針對萊特幣計算。因此卡片上標示「全市場」，比特幣頁面使用的也是同一數值。"
     },
     {
      "q": "萊特幣也有MVRV嗎？",
      "a": "有。CoinMetrics社群API提供萊特幣的最新MVRV，因此MVRV Z分數會納入評分。它以標準差衡量市值高出已實現市值(持有者成本總和)多少；指標卡片上的詳細數值屬於進階版功能。"
     },
     {
      "q": "接近減半時評分會上升嗎？",
      "a": "不會。減半時程不是輸入項。評分只由5項價格指標、全市場恐懼與貪婪指數及MVRV決定，減半預期只有反映到價格上時才會間接產生影響。依區塊高度推算，下一次減半預計在2027年前後。"
     },
     {
      "q": "比特幣與萊特幣的評分為什麼不同？",
      "a": "計算方法相同，但RSI、MACD、梅耶倍數、回檔幅度、均線交叉與MVRV都以萊特幣自身的價格與鏈上資料計算。兩者共用的只有全市場恐懼與貪婪指數。Thermocap指標只出現在比特幣頁面。"
     },
     {
      "q": "現在可以買萊特幣嗎？",
      "a": "本站不提供買賣建議。評分只是衡量市場位置的參考。在長期(逆勢)分頁中，分數越高，代表超賣、恐懼與低估訊號越集中；分數越低，代表過熱訊號越集中。短期(動能)分頁則相反，趨勢越強分數越高。決策與後果由您自行承擔。"
     },
     {
      "q": "萊特幣的資料來自哪裡？",
      "a": "價格與日K線來自CoinGecko與幣安(LTC/USDT)的公開API，恐懼與貪婪指數來自Alternative.me，MVRV來自CoinMetrics。價格約每分鐘自動更新一次。"
     }
    ]
   },
   "th": {
    "title": "คะแนนจังหวะซื้อไลต์คอยน์ (LTC) — ดูตำแหน่งตอนนี้ด้วย 7 ตัวชี้วัด",
    "intro": "LTC_SIGNAL คำนวณ RSI(14), MACD(12·26·9), Mayer Multiple, การย่อตัวจากจุดสูงสุดรอบ 365 วัน, สัญญาณ Golden/Death Cross ของเส้น 50/200 วัน และ MVRV Z-Score จากราคารายวันและข้อมูลออนเชนของไลต์คอยน์ แล้วรวมกับดัชนีความกลัว-ความโลภของตลาดคริปโตทั้งหมดเป็นคะแนนจังหวะซื้อ 0–100 คะแนนแบ่งเป็น 5 ระดับ ได้แก่ STRONG BUY, ACCUMULATE, NEUTRAL, CAUTION และ OVERHEATED คะแนนของวันนี้ดูได้ฟรีบนเบราว์เซอร์โดยไม่ต้องติดตั้ง",
    "coinH": "ไลต์คอยน์ (LTC) คืออะไร?",
    "coinP": [
     "ไลต์คอยน์เป็นคริปโตเคอร์เรนซีที่ชาร์ลี ลี (Charlie Lee) อดีตวิศวกรของ Google พัฒนาจากโค้ดของบิตคอยน์ และเปิดตัวในเดือนตุลาคม 2011 ใช้กลไกพิสูจน์การทำงาน (PoW) แต่ใช้อัลกอริทึมแฮช Scrypt แทน SHA-256 และตั้งเวลาสร้างบล็อกไว้ราว 2.5 นาที สั้นกว่าบิตคอยน์ที่ราว 10 นาที ไลต์คอยน์ถูกใช้โอนเงินและชำระเงินมานาน และมักถูกเรียกว่าเป็น “เงิน” หากเปรียบบิตคอยน์เป็น “ทองคำ”",
     "ไลต์คอยน์มีอุปทานสูงสุด 84 ล้านเหรียญ หรือ 4 เท่าของบิตคอยน์ และรางวัลการขุดลดลงครึ่งหนึ่งทุก 840,000 บล็อก (ราว 4 ปี) โดยฮาล์วิงไปแล้วในเดือนสิงหาคมของปี 2015, 2019 และ 2023 ในเดือนพฤษภาคม 2017 ไลต์คอยน์เปิดใช้ SegWit ก่อนบิตคอยน์ และในเดือนพฤษภาคม 2022 ได้เพิ่ม MWEB (MimbleWimble Extension Blocks) ซึ่งเป็นฟีเจอร์ธุรกรรมแบบปกปิดข้อมูลที่เลือกใช้ได้ นอกจากนี้ตั้งแต่ปี 2014 ยังมีการขุดร่วม (merged mining) กับดอจคอยน์ด้วย"
    ],
    "applyH": "ข้อควรรู้เมื่อใช้ตัวชี้วัดกับไลต์คอยน์",
    "apply": [
     "ดัชนีความกลัว-ความโลภไม่ใช่ค่าเฉพาะของไลต์คอยน์ แต่เป็นดัชนีของตลาดคริปโตทั้งหมดที่ Alternative.me เผยแพร่ทุกวัน และให้น้ำหนักกับบิตคอยน์มาก หน้าจอ LTC จึงแสดงค่าเดียวกับหน้าจอ BTC ส่วนความเคลื่อนไหวเฉพาะของไลต์คอยน์จะสะท้อนอยู่ในตัวชี้วัดราคาที่เหลือ",
     "ข้อมูลชุมชนของ CoinMetrics มี MVRV ของไลต์คอยน์ที่อัปเดตล่าสุด จึงคำนวณ MVRV Z-Score ได้ตามปกติ และเพราะไลต์คอยน์ใช้โมเดล UTXO แบบเดียวกับบิตคอยน์ แนวคิดมูลค่าตลาดที่รับรู้แล้ว (realized cap) ซึ่งตีราคาแต่ละเหรียญตามราคา ณ ตอนที่ถูกโอนครั้งล่าสุด จึงใช้ได้โดยตรง",
     "เกณฑ์ของ Mayer Multiple (ต่ำกว่า 0.8 ซื้อแรง, สูงกว่า 2.4 ร้อนแรงเกินไป) และเกณฑ์การย่อตัว (−30% น่าจับตา, −50% ซื้อแรง) มาจากประวัติของบิตคอยน์ ไลต์คอยน์เคยร่วงจากจุดสูงสุดเกิน 90% เช่นในปี 2018 การย่อตัวเกิน −50% จึงไม่ได้แปลว่าใกล้จุดต่ำสุดเสมอไป",
     "ไลต์คอยน์มักเคลื่อนไหวไปทางเดียวกับบิตคอยน์ แต่แกว่งแรงกว่า ในช่วงตลาดไซด์เวย์ เส้น 50 วันกับ 200 วันอาจพันกันจนสัญญาณครอสสลับไปมาในเวลาสั้นๆ จึงควรดูว่าตัวชี้วัดหลายตัวชี้ไปทางเดียวกันหรือไม่ มากกว่าดูครอสเพียงครั้งเดียว",
     "การฮาล์วิงไม่ใช่ข้อมูลนำเข้าของคะแนน ในปี 2019 ราคาขึ้นนำหน้าหลายเดือนก่อนฮาล์วิงแล้วปรับลงหลังฮาล์วิง รูปแบบเช่นนี้จะสะท้อนออกมาทางอ้อมผ่านตัวชี้วัดราคาอย่าง RSI, MACD และ Mayer Multiple เท่านั้น"
    ],
    "histH": "สรุปวัฏจักรราคาไลต์คอยน์",
    "hist": [
     "2011 — เปิดเมนเน็ตในเดือนตุลาคม เป็นหนึ่งในอัลต์คอยน์ยุคแรกที่สร้างจากโค้ดของบิตคอยน์",
     "2017 — หลังเปิดใช้ SegWit ในเดือนพฤษภาคม ราคาทำจุดสูงสุดของรอบในเดือนธันวาคมช่วงตลาดคริปโตขาขึ้นปลายปี เดือนเดียวกันนั้นชาร์ลี ลีประกาศว่าได้ขายหรือบริจาค LTC ที่ถือไว้ทั้งหมดแล้ว โดยให้เหตุผลเรื่องผลประโยชน์ทับซ้อน",
     "2018 — ในตลาดขาลง ราคาร่วงลงกว่า 90% จากจุดสูงสุดปี 2017",
     "2019 — ราคาพุ่งแรงในครึ่งปีแรกก่อนฮาล์วิงครั้งที่สองในเดือนสิงหาคม แล้วปรับลงหลังฮาล์วิง",
     "2021 — ทำราคาสูงสุดตลอดกาลในเดือนพฤษภาคม ก่อนร่วงหนักอีกครั้งในตลาดขาลงปี 2022 ตามด้วยการอัปเกรด MWEB ในเดือนพฤษภาคม 2022 และฮาล์วิงครั้งที่สามในเดือนสิงหาคม 2023"
    ],
    "faq": [
     {
      "q": "ดัชนีความกลัวในหน้านี้เป็นของไลต์คอยน์โดยเฉพาะหรือไม่?",
      "a": "ไม่ใช่ เป็นดัชนีความรู้สึกของตลาดคริปโตทั้งหมดจาก Alternative.me ไม่ได้วัดเฉพาะไลต์คอยน์ การ์ดจึงมีป้ายว่า “ทั้งตลาด” และหน้าจอบิตคอยน์ก็ใช้ค่าเดียวกัน"
     },
     {
      "q": "ไลต์คอยน์มีค่า MVRV ด้วยหรือไม่?",
      "a": "มี CoinMetrics community API ให้ข้อมูล MVRV ล่าสุดของไลต์คอยน์ MVRV Z-Score จึงถูกนำมาคิดในคะแนน ค่านี้บอกว่ามูลค่าตลาดสูงกว่ามูลค่าที่รับรู้แล้ว (ต้นทุนรวมของผู้ถือ) อยู่กี่ส่วนเบี่ยงเบนมาตรฐาน ส่วนตัวเลขละเอียดบนการ์ดตัวชี้วัดเป็นฟีเจอร์พรีเมียม"
     },
     {
      "q": "คะแนนจะสูงขึ้นเมื่อใกล้ฮาล์วิงหรือไม่?",
      "a": "ไม่ ตารางฮาล์วิงไม่ใช่ข้อมูลนำเข้า คะแนนมาจากตัวชี้วัดราคา 5 ตัว ดัชนีความกลัว-ความโลภของทั้งตลาด และ MVRV เท่านั้น ความคาดหวังต่อฮาล์วิงจึงมีผลทางอ้อมก็ต่อเมื่อสะท้อนลงในราคาแล้ว หากคำนวณจากความสูงบล็อก ฮาล์วิงครั้งถัดไปคาดว่าจะเกิดราวปี 2027"
     },
     {
      "q": "ทำไมคะแนนของบิตคอยน์กับไลต์คอยน์จึงไม่เท่ากัน?",
      "a": "วิธีคำนวณเหมือนกัน แต่ RSI, MACD, Mayer Multiple, การย่อตัว, ครอสของเส้นค่าเฉลี่ย และ MVRV ล้วนคำนวณจากราคาและข้อมูลออนเชนของไลต์คอยน์เอง ส่วนที่ใช้ร่วมกันมีเพียงดัชนีความกลัว-ความโลภของทั้งตลาด และตัวชี้วัด Thermocap มีเฉพาะในหน้าจอบิตคอยน์"
     },
     {
      "q": "ตอนนี้ซื้อไลต์คอยน์ได้ไหม?",
      "a": "เว็บไซต์นี้ไม่แนะนำให้ซื้อหรือขาย คะแนนเป็นเพียงค่าอ้างอิงว่าตลาดอยู่ตรงไหน ในแท็บระยะยาว (สวนกระแส) คะแนนยิ่งสูงยิ่งหมายถึงสัญญาณขายมากเกินไป ความกลัว และราคาต่ำกว่ามูลค่ากำลังซ้อนกัน คะแนนยิ่งต่ำยิ่งหมายถึงสัญญาณร้อนแรงเกินไปกำลังซ้อนกัน ส่วนแท็บระยะสั้น (โมเมนตัม) กลับกัน คือยิ่งเทรนด์แรงคะแนนยิ่งสูง การตัดสินใจและผลที่ตามมาเป็นความรับผิดชอบของคุณเอง"
     },
     {
      "q": "ข้อมูลไลต์คอยน์มาจากไหน?",
      "a": "ราคาและแท่งเทียนรายวันมาจาก API สาธารณะของ CoinGecko และ Binance (LTC/USDT) ดัชนีความกลัว-ความโลภมาจาก Alternative.me และ MVRV มาจาก CoinMetrics ราคาจะอัปเดตอัตโนมัติประมาณทุก 1 นาที"
     }
    ]
   },
   "es": {
    "title": "Puntuación de compra de Litecoin (LTC): 7 indicadores para ver dónde está",
    "intro": "LTC_SIGNAL calcula el RSI(14), el MACD(12·26·9), el múltiplo de Mayer, la caída desde el máximo de 365 días, el cruce dorado/de la muerte de las medias de 50 y 200 días y el MVRV Z-Score a partir de los precios diarios y los datos on-chain de Litecoin, y les suma el índice de miedo y codicia de todo el mercado cripto para obtener una puntuación de compra de 0 a 100. La puntuación se muestra en cinco franjas: STRONG BUY, ACCUMULATE, NEUTRAL, CAUTION y OVERHEATED. La puntuación del día es gratuita y funciona en el navegador sin instalar nada.",
    "coinH": "¿Qué es Litecoin (LTC)?",
    "coinP": [
     "Litecoin es una criptomoneda que Charlie Lee, exingeniero de Google, creó a partir del código de Bitcoin y lanzó en octubre de 2011. Usa prueba de trabajo, pero con el algoritmo de hash Scrypt en lugar de SHA-256, y genera un bloque cada 2,5 minutos aproximadamente, frente a unos 10 en Bitcoin. Se ha usado sobre todo para pagos y transferencias, y a menudo se la llama la «plata» frente al «oro» de Bitcoin.",
     "Su emisión máxima es de 84 millones de monedas, cuatro veces la de Bitcoin, y la recompensa por bloque se reduce a la mitad cada 840.000 bloques, es decir, cada cuatro años aproximadamente. Los halvings se produjeron en agosto de 2015, 2019 y 2023. Litecoin activó SegWit en mayo de 2017, antes que Bitcoin, y en mayo de 2022 incorporó MWEB (MimbleWimble Extension Blocks), una función opcional de transacciones confidenciales. Desde 2014 se mina además de forma combinada (merged mining) con Dogecoin."
    ],
    "applyH": "Cómo leer los indicadores en Litecoin",
    "apply": [
     "El índice de miedo y codicia no mide solo Litecoin: es un índice de todo el mercado cripto que Alternative.me publica a diario y en el que Bitcoin pesa mucho. Por eso la pantalla de LTC muestra el mismo valor que la de BTC, y el comportamiento propio de Litecoin se refleja en los indicadores de precio.",
     "Litecoin es una de las monedas con MVRV actualizado en los datos comunitarios de CoinMetrics, así que el MVRV Z-Score se calcula con normalidad. Como Bitcoin, usa un modelo UTXO, de modo que la capitalización realizada —cada moneda valorada al precio de su último movimiento— se aplica exactamente igual.",
     "Los umbrales del múltiplo de Mayer (por debajo de 0,8, compra fuerte; por encima de 2,4, sobrecalentamiento) y de la caída (−30 %, atención; −50 %, compra fuerte) proceden de la historia de Bitcoin. Litecoin ha llegado a caer más de un 90 % desde un máximo, como en 2018, así que superar el −50 % no significa por sí solo que el suelo esté cerca.",
     "Litecoin suele moverse en la misma dirección que Bitcoin, pero con oscilaciones más amplias. En mercados laterales, las medias de 50 y 200 días pueden entrelazarse y el cruce puede cambiar de signo en poco tiempo, así que conviene fijarse en hacia dónde apuntan varios indicadores a la vez y no en un único cruce.",
     "Los halvings no forman parte de la puntuación. En 2019 el precio subió en los meses previos al halving y bajó después; ese tipo de movimientos solo aparece de forma indirecta, a través de indicadores de precio como el RSI, el MACD o el múltiplo de Mayer."
    ],
    "histH": "Ciclos de precio de Litecoin en resumen",
    "hist": [
     "2011 — Lanzamiento de la red principal en octubre, como una de las primeras altcoins basadas en el código de Bitcoin.",
     "2017 — Tras activar SegWit en mayo, marcó su máximo de ciclo en diciembre, en pleno rally cripto de fin de año. Ese mismo mes, Charlie Lee anunció que había vendido o donado todos sus LTC, alegando un conflicto de intereses.",
     "2018 — En el mercado bajista cayó más de un 90 % desde el máximo de 2017.",
     "2019 — Subió con fuerza en el primer semestre, antes del segundo halving de agosto, y bajó después de él.",
     "2021 — Alcanzó su máximo histórico en mayo y volvió a caer con fuerza en el mercado bajista de 2022. Después llegaron la actualización MWEB en mayo de 2022 y el tercer halving en agosto de 2023."
    ],
    "faq": [
     {
      "q": "¿El índice de miedo de esta página es específico de Litecoin?",
      "a": "No. Es el índice de sentimiento de todo el mercado cripto que publica Alternative.me, no una medida solo de Litecoin. Por eso la tarjeta lleva la etiqueta «todo el mercado» y la pantalla de Bitcoin usa el mismo valor."
     },
     {
      "q": "¿Litecoin tiene lectura de MVRV?",
      "a": "Sí. La API comunitaria de CoinMetrics ofrece el MVRV actual de Litecoin, así que el MVRV Z-Score entra en la puntuación. Indica cuánto supera la capitalización de mercado a la capitalización realizada (el coste total de los tenedores), medido en desviaciones estándar; los valores detallados de la tarjeta son una función premium."
     },
     {
      "q": "¿Sube la puntuación al acercarse un halving?",
      "a": "No. El calendario de halvings no es un dato de entrada. La puntuación se basa solo en cinco indicadores de precio, el índice de miedo y codicia de todo el mercado y el MVRV, así que las expectativas del halving solo influyen cuando ya se reflejan en el precio. Según la altura de bloque, el próximo halving se espera hacia 2027."
     },
     {
      "q": "¿Por qué difieren las puntuaciones de Bitcoin y de Litecoin?",
      "a": "El método es el mismo, pero el RSI, el MACD, el múltiplo de Mayer, la caída, el cruce de medias y el MVRV se calculan con el precio y los datos on-chain del propio Litecoin. Lo único compartido es el índice de miedo y codicia de todo el mercado. El indicador Thermocap solo aparece en la pantalla de Bitcoin."
     },
     {
      "q": "¿Debo comprar Litecoin ahora?",
      "a": "Este sitio no recomienda comprar ni vender. La puntuación es una referencia de en qué punto está el mercado. En la pestaña de largo plazo (contraria), cuanto más alta es la puntuación, más coinciden señales de sobreventa, miedo e infravaloración, y cuanto más baja, más señales de sobrecalentamiento; la pestaña de corto plazo (momentum) funciona al revés y puntúa más cuanto más fuerte es la tendencia. Las decisiones y sus consecuencias son tuyas."
     },
     {
      "q": "¿De dónde salen los datos de Litecoin?",
      "a": "Los precios y las velas diarias proceden de las API públicas de CoinGecko y Binance (LTC/USDT); el índice de miedo y codicia, de Alternative.me, y el MVRV, de CoinMetrics. Los precios se actualizan solos aproximadamente cada minuto."
     }
    ]
   },
   "fr": {
    "title": "Score de timing d'achat Litecoin (LTC) : 7 indicateurs pour situer le marché",
    "intro": "LTC_SIGNAL calcule le RSI(14), le MACD(12·26·9), le multiple de Mayer, le repli depuis le plus haut sur 365 jours, le croisement doré ou croisement de la mort des moyennes 50/200 jours et le MVRV Z-Score à partir des cours journaliers et des données on-chain de Litecoin, puis y ajoute l'indice de peur et d'avidité de l'ensemble du marché crypto pour obtenir un score d'achat de 0 à 100. Le score est classé en cinq zones : STRONG BUY, ACCUMULATE, NEUTRAL, CAUTION et OVERHEATED. Le score du jour est gratuit et s'affiche dans le navigateur, sans installation.",
    "coinH": "Qu'est-ce que Litecoin (LTC) ?",
    "coinP": [
     "Litecoin est une cryptomonnaie créée par Charlie Lee, ancien ingénieur de Google, à partir du code de Bitcoin et lancée en octobre 2011. Elle repose sur la preuve de travail, mais avec l'algorithme de hachage Scrypt au lieu de SHA-256, et vise un bloc toutes les 2,5 minutes environ, contre une dizaine pour Bitcoin. Utilisée de longue date pour les paiements et les transferts, elle est souvent surnommée « l'argent » face à « l'or » que serait Bitcoin.",
     "L'offre est plafonnée à 84 millions d'unités, soit quatre fois celle de Bitcoin, et la récompense de bloc est divisée par deux tous les 840 000 blocs, soit environ tous les quatre ans. Les halvings ont eu lieu en août 2015, 2019 et 2023. Litecoin a activé SegWit en mai 2017, avant Bitcoin, puis ajouté en mai 2022 MWEB (MimbleWimble Extension Blocks), une fonction facultative de transactions confidentielles. Depuis 2014, Litecoin est aussi miné conjointement avec Dogecoin (merged mining)."
    ],
    "applyH": "Lire les indicateurs sur Litecoin",
    "apply": [
     "L'indice de peur et d'avidité ne mesure pas Litecoin seul : c'est un indice de l'ensemble du marché crypto publié chaque jour par Alternative.me, où Bitcoin pèse lourd. L'écran LTC affiche donc la même valeur que l'écran BTC, et le comportement propre de Litecoin se lit dans les indicateurs de prix.",
     "Litecoin fait partie des actifs dont le MVRV est à jour dans les données communautaires de CoinMetrics : le MVRV Z-Score est donc calculé normalement. Comme Bitcoin, Litecoin suit un modèle UTXO, si bien que la capitalisation réalisée — chaque pièce valorisée au prix de son dernier mouvement — s'applique exactement de la même façon.",
     "Les seuils du multiple de Mayer (sous 0,8, achat fort ; au-dessus de 2,4, surchauffe) et ceux du repli (−30 %, à surveiller ; −50 %, achat fort) viennent de l'historique de Bitcoin. Litecoin a déjà chuté de plus de 90 % depuis un sommet, comme en 2018 : franchir −50 % ne signifie donc pas à lui seul que le creux est proche.",
     "Litecoin évolue le plus souvent dans le même sens que Bitcoin, mais avec des variations plus amples. En marché sans tendance, les moyennes 50 et 200 jours peuvent s'entremêler et le croisement changer de sens à intervalles rapprochés : mieux vaut regarder vers où pointent plusieurs indicateurs ensemble qu'un croisement isolé.",
     "Les halvings ne font pas partie du calcul. En 2019, le cours a grimpé dans les mois précédant le halving puis reculé ensuite ; ce genre de mouvement n'apparaît qu'indirectement, à travers des indicateurs de prix comme le RSI, le MACD ou le multiple de Mayer."
    ],
    "histH": "Les cycles de prix de Litecoin en bref",
    "hist": [
     "2011 — Lancement du réseau principal en octobre, l'un des tout premiers altcoins bâtis sur le code de Bitcoin.",
     "2017 — Après l'activation de SegWit en mai, sommet de cycle en décembre, en pleine envolée crypto de fin d'année. Le même mois, Charlie Lee annonce avoir vendu ou donné tous ses LTC, invoquant un conflit d'intérêts.",
     "2018 — Pendant le marché baissier, chute de plus de 90 % depuis le sommet de 2017.",
     "2019 — Forte hausse au premier semestre avant le deuxième halving d'août, puis repli après celui-ci.",
     "2021 — Plus haut historique en mai, puis nouvelle forte baisse pendant le marché baissier de 2022. Suivent la mise à niveau MWEB en mai 2022 et le troisième halving en août 2023."
    ],
    "faq": [
     {
      "q": "L'indice de peur de cette page est-il propre à Litecoin ?",
      "a": "Non. Il s'agit de l'indice de sentiment de l'ensemble du marché crypto publié par Alternative.me, et non d'une mesure de Litecoin seul. C'est pourquoi la carte porte la mention « marché global » et que l'écran Bitcoin utilise la même valeur."
     },
     {
      "q": "Litecoin a-t-il une valeur MVRV ?",
      "a": "Oui. L'API communautaire de CoinMetrics fournit le MVRV à jour de Litecoin : le MVRV Z-Score entre donc dans le score. Il exprime, en écarts-types, de combien la capitalisation de marché dépasse la capitalisation réalisée (le coût de revient total des détenteurs) ; les valeurs détaillées de la carte sont réservées à la version premium."
     },
     {
      "q": "Le score monte-t-il à l'approche d'un halving ?",
      "a": "Non. Le calendrier des halvings n'est pas une donnée d'entrée. Le score repose uniquement sur cinq indicateurs de prix, l'indice de peur et d'avidité global et le MVRV : les attentes liées au halving ne comptent qu'une fois reflétées dans le cours. D'après la hauteur de bloc, le prochain halving est attendu vers 2027."
     },
     {
      "q": "Pourquoi les scores de Bitcoin et de Litecoin diffèrent-ils ?",
      "a": "La méthode est la même, mais le RSI, le MACD, le multiple de Mayer, le repli, le croisement des moyennes et le MVRV sont calculés à partir du cours et des données on-chain de Litecoin lui-même. Seul l'indice de peur et d'avidité global est commun. L'indicateur Thermocap n'apparaît que sur l'écran Bitcoin."
     },
     {
      "q": "Faut-il acheter du Litecoin maintenant ?",
      "a": "Ce site ne recommande ni d'acheter ni de vendre. Le score sert de repère pour situer le marché. Dans l'onglet long terme (contrarien), plus le score est élevé, plus les signaux de survente, de peur et de sous-évaluation se cumulent, et plus il est bas, plus les signaux de surchauffe se cumulent ; l'onglet court terme (momentum) fonctionne à l'inverse et monte avec la force de la tendance. Les décisions et leurs conséquences vous appartiennent."
     },
     {
      "q": "D'où viennent les données de Litecoin ?",
      "a": "Les cours et les bougies journalières proviennent des API publiques de CoinGecko et de Binance (LTC/USDT), l'indice de peur et d'avidité d'Alternative.me et le MVRV de CoinMetrics. Les prix se mettent à jour automatiquement environ toutes les minutes."
     }
    ]
   },
   "de": {
    "title": "Litecoin (LTC) Kaufzeitpunkt-Score: 7 Indikatoren zeigen, wo der Markt steht",
    "intro": "LTC_SIGNAL berechnet aus den Tageskursen und On-Chain-Daten von Litecoin den RSI(14), den MACD(12·26·9), das Mayer-Multiple, den Rückgang vom 365-Tage-Hoch, das Golden/Death Cross der 50- und 200-Tage-Linie sowie den MVRV-Z-Score, ergänzt den marktweiten Angst- & Gier-Index und fasst alles zu einem Kaufzeitpunkt-Score von 0 bis 100 zusammen. Der Score wird in fünf Stufen angezeigt: STRONG BUY, ACCUMULATE, NEUTRAL, CAUTION und OVERHEATED. Der heutige Score ist kostenlos und läuft ohne Installation im Browser.",
    "coinH": "Was ist Litecoin (LTC)?",
    "coinP": [
     "Litecoin ist eine Kryptowährung, die der frühere Google-Ingenieur Charlie Lee auf Basis des Bitcoin-Codes entwickelt und im Oktober 2011 veröffentlicht hat. Sie nutzt Proof of Work, allerdings mit dem Hash-Algorithmus Scrypt statt SHA-256, und erzeugt etwa alle 2,5 Minuten einen Block – bei Bitcoin sind es rund 10. Litecoin wird seit Langem für Zahlungen und Überweisungen genutzt und oft als „Silber“ zum „Gold“ Bitcoin bezeichnet.",
     "Das Angebot ist auf 84 Millionen Coins begrenzt, viermal so viel wie bei Bitcoin, und die Blockbelohnung halbiert sich alle 840.000 Blöcke, also etwa alle vier Jahre. Halvings fanden im August 2015, 2019 und 2023 statt. Im Mai 2017 aktivierte Litecoin SegWit noch vor Bitcoin, im Mai 2022 kam MWEB (MimbleWimble Extension Blocks) hinzu, eine optionale Funktion für vertrauliche Transaktionen. Seit 2014 wird Litecoin zudem gemeinsam mit Dogecoin gemint (Merged Mining)."
    ],
    "applyH": "Indikatoren bei Litecoin richtig lesen",
    "apply": [
     "Der Angst- & Gier-Index misst nicht Litecoin allein: Er ist ein marktweiter Krypto-Index, den Alternative.me täglich veröffentlicht und in dem Bitcoin stark gewichtet ist. Die LTC-Ansicht zeigt deshalb denselben Wert wie die BTC-Ansicht; das Eigenverhalten von Litecoin spiegeln die Preisindikatoren wider.",
     "Für Litecoin liefern die Community-Daten von CoinMetrics aktuelle MVRV-Werte, daher wird der MVRV-Z-Score normal berechnet. Wie Bitcoin nutzt Litecoin ein UTXO-Modell, sodass die Realized Cap – jeder Coin bewertet zum Kurs seiner letzten Bewegung – genauso greift.",
     "Die Schwellen des Mayer-Multiples (unter 0,8 starker Kauf, über 2,4 überhitzt) und des Rückgangs (−30 % beobachten, −50 % starker Kauf) stammen aus der Bitcoin-Historie. Litecoin ist schon mehr als 90 % unter ein Hoch gefallen, etwa 2018 – ein Rückgang über −50 % bedeutet also nicht automatisch, dass der Boden nahe ist.",
     "Litecoin bewegt sich meist in dieselbe Richtung wie Bitcoin, schwankt aber stärker. In Seitwärtsphasen können sich 50- und 200-Tage-Linie verschlingen und das Kreuzsignal in kurzen Abständen wechseln. Achten Sie deshalb eher darauf, wohin mehrere Indikatoren gemeinsam zeigen, als auf ein einzelnes Kreuz.",
     "Halvings fließen nicht in den Score ein. 2019 stieg der Kurs in den Monaten vor dem Halving und fiel danach; solche Muster zeigen sich nur indirekt über Preisindikatoren wie RSI, MACD und Mayer-Multiple."
    ],
    "histH": "Litecoins Preiszyklen im Überblick",
    "hist": [
     "2011 – Start des Mainnets im Oktober, als einer der ersten Altcoins auf Basis des Bitcoin-Codes.",
     "2017 – Nach der SegWit-Aktivierung im Mai erreichte LTC im Dezember während der Krypto-Rally zum Jahresende sein Zyklushoch. Im selben Monat gab Charlie Lee bekannt, wegen eines Interessenkonflikts alle seine LTC verkauft oder gespendet zu haben.",
     "2018 – Im Bärenmarkt fiel der Kurs um mehr als 90 % vom Hoch des Jahres 2017.",
     "2019 – Starker Anstieg im ersten Halbjahr vor dem zweiten Halving im August, danach Rückgang.",
     "2021 – Allzeithoch im Mai, dann erneut kräftige Verluste im Bärenmarkt 2022. Es folgten das MWEB-Upgrade im Mai 2022 und das dritte Halving im August 2023."
    ],
    "faq": [
     {
      "q": "Ist der Angstindex auf dieser Seite speziell für Litecoin?",
      "a": "Nein. Es ist der marktweite Krypto-Stimmungsindex von Alternative.me, kein reines Litecoin-Maß. Deshalb trägt die Karte den Hinweis „marktweit“, und die Bitcoin-Ansicht nutzt denselben Wert."
     },
     {
      "q": "Gibt es für Litecoin einen MVRV-Wert?",
      "a": "Ja. Die Community-API von CoinMetrics liefert aktuelle MVRV-Daten für Litecoin, daher fließt der MVRV-Z-Score in den Score ein. Er zeigt in Standardabweichungen, wie weit die Marktkapitalisierung über der Realized Cap (den gesamten Einstandskosten der Halter) liegt; die Detailwerte auf der Indikatorkarte sind eine Premium-Funktion."
     },
     {
      "q": "Steigt der Score, wenn ein Halving näher rückt?",
      "a": "Nein. Der Halving-Termin ist keine Eingangsgröße. Der Score beruht nur auf fünf Preisindikatoren, dem marktweiten Angst- & Gier-Index und dem MVRV; Halving-Erwartungen wirken sich also erst aus, wenn sie sich im Kurs niederschlagen. Nach Blockhöhe gerechnet wird das nächste Halving um 2027 erwartet."
     },
     {
      "q": "Warum unterscheiden sich die Scores von Bitcoin und Litecoin?",
      "a": "Die Methode ist dieselbe, aber RSI, MACD, Mayer-Multiple, Rückgang, Durchschnittskreuz und MVRV werden aus Litecoins eigenem Kurs und eigenen On-Chain-Daten berechnet. Gemeinsam ist nur der marktweite Angst- & Gier-Index. Der Thermocap-Indikator erscheint nur in der Bitcoin-Ansicht."
     },
     {
      "q": "Sollte ich jetzt Litecoin kaufen?",
      "a": "Diese Seite empfiehlt weder Kauf noch Verkauf. Der Score ist ein Anhaltspunkt dafür, wo der Markt steht. Im Langfrist-Tab (antizyklisch) gilt: Je höher der Score, desto mehr Signale für Überverkauf, Angst und Unterbewertung treffen zusammen, je niedriger, desto mehr Überhitzungssignale. Der Kurzfrist-Tab (Momentum) funktioniert umgekehrt und steigt mit der Stärke des Trends. Entscheidungen und ihre Folgen liegen bei Ihnen."
     },
     {
      "q": "Woher stammen die Litecoin-Daten?",
      "a": "Kurse und Tageskerzen kommen aus den öffentlichen APIs von CoinGecko und Binance (LTC/USDT), der Angst- & Gier-Index von Alternative.me und der MVRV von CoinMetrics. Die Kurse aktualisieren sich etwa einmal pro Minute automatisch."
     }
    ]
   },
   "it": {
    "title": "Punteggio d'acquisto Litecoin (LTC): 7 indicatori per capire dove siamo",
    "intro": "LTC_SIGNAL calcola RSI(14), MACD(12·26·9), multiplo di Mayer, calo dal massimo a 365 giorni, golden/death cross delle medie a 50 e 200 giorni e MVRV Z-Score dai prezzi giornalieri e dai dati on-chain di Litecoin, poi aggiunge l'indice di paura e avidità dell'intero mercato cripto e sintetizza il tutto in un punteggio d'acquisto da 0 a 100. Il punteggio è suddiviso in cinque fasce: STRONG BUY, ACCUMULATE, NEUTRAL, CAUTION e OVERHEATED. Il punteggio di oggi è gratuito e si consulta nel browser senza installare nulla.",
    "coinH": "Che cos'è Litecoin (LTC)?",
    "coinP": [
     "Litecoin è una criptovaluta creata da Charlie Lee, ex ingegnere di Google, a partire dal codice di Bitcoin e lanciata nell'ottobre 2011. Usa la proof of work, ma con l'algoritmo di hash Scrypt invece di SHA-256, e produce un blocco ogni 2,5 minuti circa, contro i circa 10 di Bitcoin. Da tempo è usata per pagamenti e trasferimenti ed è spesso chiamata l'«argento» accanto all'«oro» di Bitcoin.",
     "L'offerta massima è di 84 milioni di monete, quattro volte quella di Bitcoin, e la ricompensa per blocco si dimezza ogni 840.000 blocchi, cioè circa ogni quattro anni. Gli halving sono avvenuti nell'agosto del 2015, del 2019 e del 2023. Nel maggio 2017 Litecoin ha attivato SegWit prima di Bitcoin e nel maggio 2022 ha introdotto MWEB (MimbleWimble Extension Blocks), una funzione facoltativa per transazioni riservate. Dal 2014 viene inoltre minata in modo congiunto con Dogecoin (merged mining)."
    ],
    "applyH": "Come leggere gli indicatori su Litecoin",
    "apply": [
     "L'indice di paura e avidità non misura solo Litecoin: è un indice dell'intero mercato cripto pubblicato ogni giorno da Alternative.me, in cui Bitcoin ha un peso elevato. La schermata LTC mostra quindi lo stesso valore di quella BTC, mentre l'andamento specifico di Litecoin emerge dagli indicatori di prezzo.",
     "Litecoin è tra le monete con MVRV aggiornato nei dati community di CoinMetrics, quindi l'MVRV Z-Score viene calcolato normalmente. Come Bitcoin, Litecoin adotta un modello UTXO: la capitalizzazione realizzata, che valuta ogni moneta al prezzo del suo ultimo spostamento, si applica esattamente allo stesso modo.",
     "Le soglie del multiplo di Mayer (sotto 0,8 acquisto forte, sopra 2,4 surriscaldamento) e del calo (−30% attenzione, −50% acquisto forte) derivano dalla storia di Bitcoin. Litecoin è già sceso di oltre il 90% da un massimo, come nel 2018: superare il −50% non significa di per sé che il minimo sia vicino.",
     "Litecoin di solito si muove nella stessa direzione di Bitcoin, ma con oscillazioni più ampie. Nelle fasi laterali le medie a 50 e 200 giorni possono intrecciarsi e il segnale di incrocio cambiare a breve distanza: conviene guardare dove puntano insieme più indicatori, più che un singolo incrocio.",
     "Gli halving non entrano nel punteggio. Nel 2019 il prezzo è salito nei mesi prima dell'halving ed è sceso dopo; movimenti del genere emergono solo indirettamente, tramite indicatori di prezzo come RSI, MACD e multiplo di Mayer."
    ],
    "histH": "I cicli di prezzo di Litecoin in sintesi",
    "hist": [
     "2011 — Avvio della mainnet a ottobre: una delle prime altcoin basate sul codice di Bitcoin.",
     "2017 — Dopo l'attivazione di SegWit a maggio, massimo di ciclo a dicembre, durante il rally cripto di fine anno. Nello stesso mese Charlie Lee annunciò di aver venduto o donato tutti i suoi LTC, citando un conflitto di interessi.",
     "2018 — Nel mercato ribassista il prezzo è sceso di oltre il 90% dal massimo del 2017.",
     "2019 — Forte rialzo nel primo semestre, prima del secondo halving di agosto, seguito da un calo dopo l'halving.",
     "2021 — Massimo storico a maggio, poi un nuovo forte calo nel mercato ribassista del 2022. Sono seguiti l'aggiornamento MWEB a maggio 2022 e il terzo halving ad agosto 2023."
    ],
    "faq": [
     {
      "q": "L'indice di paura di questa pagina è specifico per Litecoin?",
      "a": "No. È l'indice di sentiment dell'intero mercato cripto pubblicato da Alternative.me, non una misura del solo Litecoin. Per questo la scheda riporta la dicitura «mercato complessivo» e la schermata di Bitcoin usa lo stesso valore."
     },
     {
      "q": "Litecoin ha un valore MVRV?",
      "a": "Sì. L'API community di CoinMetrics fornisce l'MVRV aggiornato di Litecoin, quindi l'MVRV Z-Score rientra nel punteggio. Indica, in deviazioni standard, di quanto la capitalizzazione di mercato supera la capitalizzazione realizzata (il costo complessivo dei detentori); i valori dettagliati sulla scheda sono una funzione premium."
     },
     {
      "q": "Il punteggio sale quando si avvicina un halving?",
      "a": "No. Il calendario degli halving non è un dato in ingresso. Il punteggio si basa solo su cinque indicatori di prezzo, sull'indice di paura e avidità di mercato e sull'MVRV, quindi le attese per l'halving contano solo quando si riflettono nel prezzo. In base all'altezza dei blocchi, il prossimo halving è atteso intorno al 2027."
     },
     {
      "q": "Perché i punteggi di Bitcoin e Litecoin sono diversi?",
      "a": "Il metodo è lo stesso, ma RSI, MACD, multiplo di Mayer, calo, incrocio delle medie e MVRV si calcolano sul prezzo e sui dati on-chain di Litecoin stesso. In comune c'è solo l'indice di paura e avidità di mercato. L'indicatore Thermocap compare solo nella schermata di Bitcoin."
     },
     {
      "q": "Conviene comprare Litecoin adesso?",
      "a": "Questo sito non consiglia di comprare né di vendere. Il punteggio è un riferimento per capire dove si trova il mercato. Nella scheda di lungo periodo (contrarian), più il punteggio è alto, più si sommano segnali di ipervenduto, paura e sottovalutazione; più è basso, più si sommano segnali di surriscaldamento. La scheda di breve periodo (momentum) funziona al contrario e sale con la forza del trend. Decisioni e conseguenze restano a tuo carico."
     },
     {
      "q": "Da dove arrivano i dati di Litecoin?",
      "a": "Prezzi e candele giornaliere provengono dalle API pubbliche di CoinGecko e Binance (LTC/USDT), l'indice di paura e avidità da Alternative.me e l'MVRV da CoinMetrics. I prezzi si aggiornano automaticamente circa ogni minuto."
     }
    ]
   },
   "pt": {
    "title": "Pontuação de compra da Litecoin (LTC): 7 indicadores para ver onde está o mercado",
    "intro": "O LTC_SIGNAL calcula o RSI(14), o MACD(12·26·9), o múltiplo de Mayer, a queda desde o máximo de 365 dias, o cruzamento dourado/da morte das médias de 50 e 200 dias e o MVRV Z-Score a partir dos preços diários e dos dados on-chain da Litecoin, junta o índice de medo e ganância de todo o mercado cripto e sintetiza tudo numa pontuação de compra de 0 a 100. A pontuação é apresentada em cinco faixas: STRONG BUY, ACCUMULATE, NEUTRAL, CAUTION e OVERHEATED. A pontuação de hoje é gratuita e funciona no navegador, sem instalação.",
    "coinH": "O que é a Litecoin (LTC)?",
    "coinP": [
     "A Litecoin é uma criptomoeda criada por Charlie Lee, antigo engenheiro da Google, a partir do código da Bitcoin e lançada em outubro de 2011. Usa prova de trabalho, mas com o algoritmo de hash Scrypt em vez do SHA-256, e gera um bloco a cada 2,5 minutos, aproximadamente, contra cerca de 10 na Bitcoin. É usada há muito tempo para pagamentos e transferências e costuma ser chamada a «prata» ao lado do «ouro» da Bitcoin.",
     "A oferta máxima é de 84 milhões de moedas, quatro vezes a da Bitcoin, e a recompensa por bloco cai para metade a cada 840 000 blocos, ou seja, de quatro em quatro anos, aproximadamente. Os halvings ocorreram em agosto de 2015, 2019 e 2023. Em maio de 2017 a Litecoin ativou o SegWit antes da Bitcoin e, em maio de 2022, introduziu o MWEB (MimbleWimble Extension Blocks), uma funcionalidade opcional de transações confidenciais. Desde 2014 é também minerada em conjunto com a Dogecoin (merged mining)."
    ],
    "applyH": "Como ler os indicadores na Litecoin",
    "apply": [
     "O índice de medo e ganância não mede só a Litecoin: é um índice de todo o mercado cripto publicado diariamente pela Alternative.me, com grande peso da Bitcoin. Por isso o ecrã de LTC mostra o mesmo valor que o de BTC, e o comportamento próprio da Litecoin reflete-se nos indicadores de preço.",
     "A Litecoin é uma das moedas com MVRV atualizado nos dados comunitários da CoinMetrics, pelo que o MVRV Z-Score é calculado normalmente. Tal como a Bitcoin, usa um modelo UTXO, e a capitalização realizada — cada moeda avaliada ao preço do seu último movimento — aplica-se exatamente da mesma forma.",
     "Os limiares do múltiplo de Mayer (abaixo de 0,8, compra forte; acima de 2,4, sobreaquecimento) e da queda (−30%, atenção; −50%, compra forte) vêm do histórico da Bitcoin. A Litecoin já caiu mais de 90% desde um máximo, como em 2018, por isso ultrapassar −50% não significa, por si só, que o fundo esteja perto.",
     "A Litecoin costuma mover-se no mesmo sentido da Bitcoin, mas com oscilações maiores. Em mercados laterais, as médias de 50 e 200 dias podem entrelaçar-se e o sinal de cruzamento trocar em pouco tempo; vale mais observar para onde apontam vários indicadores em conjunto do que um cruzamento isolado.",
     "Os halvings não entram na pontuação. Em 2019 o preço subiu nos meses anteriores ao halving e desceu depois; padrões assim só aparecem de forma indireta, através de indicadores de preço como o RSI, o MACD e o múltiplo de Mayer."
    ],
    "histH": "Resumo dos ciclos de preço da Litecoin",
    "hist": [
     "2011 — Lançamento da rede principal em outubro, como uma das primeiras altcoins baseadas no código da Bitcoin.",
     "2017 — Depois de ativar o SegWit em maio, atingiu o máximo do ciclo em dezembro, durante a subida cripto de fim de ano. No mesmo mês, Charlie Lee anunciou que tinha vendido ou doado todas as suas LTC, alegando conflito de interesses.",
     "2018 — No mercado em baixa, caiu mais de 90% face ao máximo de 2017.",
     "2019 — Subiu com força no primeiro semestre, antes do segundo halving em agosto, e desceu depois dele.",
     "2021 — Máximo histórico em maio, seguido de nova queda acentuada no mercado em baixa de 2022. Vieram depois a atualização MWEB, em maio de 2022, e o terceiro halving, em agosto de 2023."
    ],
    "faq": [
     {
      "q": "O índice de medo desta página é específico da Litecoin?",
      "a": "Não. É o índice de sentimento de todo o mercado cripto publicado pela Alternative.me, e não uma medida só da Litecoin. Por isso o cartão indica «mercado global» e o ecrã da Bitcoin usa o mesmo valor."
     },
     {
      "q": "A Litecoin tem leitura de MVRV?",
      "a": "Sim. A API comunitária da CoinMetrics fornece o MVRV atual da Litecoin, pelo que o MVRV Z-Score entra na pontuação. Mostra, em desvios-padrão, quanto a capitalização de mercado está acima da capitalização realizada (o custo total dos detentores); os valores detalhados do cartão são uma funcionalidade premium."
     },
     {
      "q": "A pontuação sobe quando se aproxima um halving?",
      "a": "Não. O calendário dos halvings não é um dado de entrada. A pontuação assenta apenas em cinco indicadores de preço, no índice de medo e ganância do mercado e no MVRV, por isso as expectativas do halving só pesam quando já se refletem no preço. Pela altura dos blocos, o próximo halving é esperado por volta de 2027."
     },
     {
      "q": "Porque é que as pontuações da Bitcoin e da Litecoin são diferentes?",
      "a": "O método é o mesmo, mas o RSI, o MACD, o múltiplo de Mayer, a queda, o cruzamento de médias e o MVRV são calculados com o preço e os dados on-chain da própria Litecoin. Só o índice de medo e ganância do mercado é partilhado. O indicador Thermocap aparece apenas no ecrã da Bitcoin."
     },
     {
      "q": "Devo comprar Litecoin agora?",
      "a": "Este site não recomenda comprar nem vender. A pontuação é uma referência para perceber onde está o mercado. No separador de longo prazo (contrário), quanto mais alta a pontuação, mais se acumulam sinais de sobrevenda, medo e subvalorização; quanto mais baixa, mais sinais de sobreaquecimento. O separador de curto prazo (momentum) funciona ao contrário e sobe com a força da tendência. As decisões e as suas consequências são suas."
     },
     {
      "q": "De onde vêm os dados da Litecoin?",
      "a": "Os preços e as velas diárias vêm das API públicas da CoinGecko e da Binance (LTC/USDT), o índice de medo e ganância da Alternative.me e o MVRV da CoinMetrics. Os preços atualizam-se automaticamente cerca de uma vez por minuto."
     }
    ]
   },
   "ru": {
    "title": "Оценка момента покупки Лайткоина (LTC): где рынок по 7 индикаторам",
    "intro": "LTC_SIGNAL рассчитывает RSI(14), MACD(12·26·9), мультипликатор Майера, просадку от 365-дневного максимума, золотой и мёртвый крест 50- и 200-дневной средних и MVRV Z-Score по дневным ценам и ончейн-данным Лайткоина, добавляет индекс страха и жадности всего криптовалютного рынка и сводит всё в оценку момента покупки от 0 до 100. Оценка показывается в пяти диапазонах: STRONG BUY, ACCUMULATE, NEUTRAL, CAUTION и OVERHEATED. Сегодняшняя оценка бесплатна и открывается в браузере без установки.",
    "coinH": "Что такое Лайткоин (LTC)?",
    "coinP": [
     "Лайткоин — криптовалюта, которую бывший инженер Google Чарли Ли (Charlie Lee) создал на основе кода Биткоина и выпустил в октябре 2011 года. Она работает на доказательстве работы (PoW), но с алгоритмом хеширования Scrypt вместо SHA-256, а блоки выходят примерно раз в 2,5 минуты — у Биткоина около 10. Лайткоин давно используют для платежей и переводов, и его часто называют «серебром» рядом с «золотом» Биткоина.",
     "Эмиссия ограничена 84 миллионами монет — вчетверо больше, чем у Биткоина, — а награда за блок уменьшается вдвое каждые 840 000 блоков, то есть примерно раз в четыре года. Халвинги прошли в августе 2015, 2019 и 2023 годов. В мае 2017 года Лайткоин активировал SegWit раньше Биткоина, а в мае 2022 года добавил MWEB (MimbleWimble Extension Blocks) — необязательную функцию конфиденциальных транзакций. С 2014 года его также добывают совместно с Догикоином (merged mining)."
    ],
    "applyH": "Как читать индикаторы для Лайткоина",
    "apply": [
     "Индекс страха и жадности измеряет не только Лайткоин: это общерыночный криптоиндекс, который Alternative.me публикует ежедневно и в котором велик вес Биткоина. Поэтому на экране LTC то же значение, что и на экране BTC, а собственное поведение Лайткоина отражают ценовые индикаторы.",
     "Для Лайткоина в общедоступных данных CoinMetrics есть актуальный MVRV, поэтому MVRV Z-Score рассчитывается в обычном режиме. Как и Биткоин, Лайткоин построен на модели UTXO, так что реализованная капитализация — каждая монета по цене её последнего перемещения — применима без поправок.",
     "Пороги мультипликатора Майера (ниже 0,8 — сильная покупка, выше 2,4 — перегрев) и просадки (−30% — внимание, −50% — сильная покупка) взяты из истории Биткоина. Лайткоин уже падал от максимума более чем на 90%, как в 2018 году, так что просадка глубже −50% сама по себе не означает близкого дна.",
     "Лайткоин обычно движется в ту же сторону, что и Биткоин, но с бо́льшим размахом. В боковике 50- и 200-дневная средние могут переплетаться, а сигнал креста — меняться через короткие промежутки, поэтому смотрите, куда указывают сразу несколько индикаторов, а не на отдельный крест.",
     "Халвинги не входят в расчёт оценки. В 2019 году цена росла за несколько месяцев до халвинга и снижалась после него; такие движения проявляются лишь косвенно — через ценовые индикаторы вроде RSI, MACD и мультипликатора Майера."
    ],
    "histH": "Ценовые циклы Лайткоина вкратце",
    "hist": [
     "2011 — запуск основной сети в октябре; один из первых альткоинов на основе кода Биткоина.",
     "2017 — после активации SegWit в мае цена достигла циклического максимума в декабре, на волне криптовалютного ралли в конце года. В том же месяце Чарли Ли сообщил, что продал или пожертвовал все свои LTC, сославшись на конфликт интересов.",
     "2018 — на медвежьем рынке цена упала более чем на 90% от максимума 2017 года.",
     "2019 — сильный рост в первом полугодии перед вторым халвингом в августе и снижение после него.",
     "2021 — исторический максимум в мае, затем новое сильное падение на медвежьем рынке 2022 года. Далее последовали обновление MWEB в мае 2022 года и третий халвинг в августе 2023 года."
    ],
    "faq": [
     {
      "q": "Индекс страха на этой странице относится только к Лайткоину?",
      "a": "Нет. Это общерыночный индекс настроений криптовалютного рынка от Alternative.me, а не отдельная мера для Лайткоина. Поэтому на карточке стоит пометка «весь рынок», а экран Биткоина использует то же значение."
     },
     {
      "q": "Есть ли у Лайткоина показатель MVRV?",
      "a": "Да. Общедоступный API CoinMetrics выдаёт актуальный MVRV Лайткоина, поэтому MVRV Z-Score входит в оценку. Он показывает в стандартных отклонениях, насколько рыночная капитализация выше реализованной (совокупной себестоимости держателей); подробные значения на карточке индикатора доступны в премиум-версии."
     },
     {
      "q": "Растёт ли оценка по мере приближения халвинга?",
      "a": "Нет. График халвингов не входит в исходные данные. Оценка строится только на пяти ценовых индикаторах, общерыночном индексе страха и жадности и MVRV, так что ожидания халвинга влияют на неё лишь тогда, когда уже отражены в цене. Судя по высоте блоков, следующий халвинг ожидается около 2027 года."
     },
     {
      "q": "Почему оценки Биткоина и Лайткоина различаются?",
      "a": "Метод тот же, но RSI, MACD, мультипликатор Майера, просадка, пересечение средних и MVRV рассчитываются по собственной цене и ончейн-данным Лайткоина. Общий у них только общерыночный индекс страха и жадности. Индикатор Thermocap есть только на экране Биткоина."
     },
     {
      "q": "Стоит ли покупать Лайткоин сейчас?",
      "a": "Сайт не советует ни покупать, ни продавать. Оценка — ориентир, показывающий, где сейчас рынок. На долгосрочной (контртрендовой) вкладке чем выше оценка, тем больше совпадает сигналов перепроданности, страха и недооценённости, чем ниже — тем больше сигналов перегрева. Краткосрочная (моментум) вкладка работает наоборот и растёт вместе с силой тренда. Решения и их последствия — на вас."
     },
     {
      "q": "Откуда берутся данные по Лайткоину?",
      "a": "Цены и дневные свечи — из открытых API CoinGecko и Binance (LTC/USDT), индекс страха и жадности — от Alternative.me, MVRV — от CoinMetrics. Цены обновляются автоматически примерно раз в минуту."
     }
    ]
   },
   "nl": {
    "title": "Koopmoment-score voor Litecoin (LTC): 7 indicatoren tonen waar de markt staat",
    "intro": "LTC_SIGNAL berekent op basis van de dagkoersen en on-chaindata van Litecoin de RSI(14), de MACD(12·26·9), de Mayer Multiple, de daling vanaf de 365-daagse top, de golden/death cross van de 50- en 200-daagse gemiddelden en de MVRV Z-Score, voegt daar de Angst- & Hebzucht-index van de hele cryptomarkt aan toe en combineert alles tot een koopmoment-score van 0 tot 100. De score wordt getoond in vijf zones: STRONG BUY, ACCUMULATE, NEUTRAL, CAUTION en OVERHEATED. De score van vandaag is gratis en werkt in de browser, zonder installatie.",
    "coinH": "Wat is Litecoin (LTC)?",
    "coinP": [
     "Litecoin is een cryptomunt die voormalig Google-engineer Charlie Lee op basis van de Bitcoin-code ontwikkelde en in oktober 2011 lanceerde. Het netwerk werkt met proof of work, maar gebruikt het hash-algoritme Scrypt in plaats van SHA-256 en maakt ongeveer elke 2,5 minuten een blok, tegenover zo'n 10 minuten bij Bitcoin. Litecoin wordt al lang gebruikt voor betalingen en overboekingen en wordt vaak het ‘zilver’ naast het ‘goud’ van Bitcoin genoemd.",
     "Het aanbod is begrensd op 84 miljoen munten, vier keer zoveel als bij Bitcoin, en de blokbeloning halveert elke 840.000 blokken, ongeveer om de vier jaar. Halvings vonden plaats in augustus 2015, 2019 en 2023. In mei 2017 activeerde Litecoin SegWit nog vóór Bitcoin, en in mei 2022 kwam MWEB (MimbleWimble Extension Blocks) erbij, een optionele functie voor vertrouwelijke transacties. Sinds 2014 wordt Litecoin bovendien samen met Dogecoin gemined (merged mining)."
    ],
    "applyH": "Indicatoren lezen bij Litecoin",
    "apply": [
     "De Angst- & Hebzucht-index meet niet alleen Litecoin: het is een marktbrede crypto-index die Alternative.me dagelijks publiceert en waarin Bitcoin zwaar weegt. Het LTC-scherm toont daarom dezelfde waarde als het BTC-scherm; het eigen gedrag van Litecoin zie je terug in de prijsindicatoren.",
     "Voor Litecoin bevatten de communitygegevens van CoinMetrics actuele MVRV-waarden, dus de MVRV Z-Score wordt normaal berekend. Net als Bitcoin werkt Litecoin met een UTXO-model, waardoor de realized cap — elke munt gewaardeerd tegen de koers van zijn laatste verplaatsing — precies zo toepasbaar is.",
     "De drempels van de Mayer Multiple (onder 0,8 sterk kopen, boven 2,4 oververhit) en van de daling (−30% opletten, −50% sterk kopen) komen uit de geschiedenis van Bitcoin. Litecoin is al eens meer dan 90% gedaald vanaf een top, zoals in 2018; een daling voorbij −50% betekent dus niet vanzelf dat de bodem dichtbij is.",
     "Litecoin beweegt meestal dezelfde kant op als Bitcoin, maar met grotere uitslagen. In zijwaartse markten kunnen het 50- en 200-daags gemiddelde door elkaar lopen en kan het kruissignaal snel omslaan; kijk daarom liever waar meerdere indicatoren samen naartoe wijzen dan naar één kruising.",
     "Halvings tellen niet mee in de score. In 2019 steeg de koers in de maanden vóór de halving en daalde daarna; zulke patronen zie je alleen indirect terug, via prijsindicatoren als RSI, MACD en de Mayer Multiple."
    ],
    "histH": "Prijscycli van Litecoin in het kort",
    "hist": [
     "2011 — Lancering van het mainnet in oktober, als een van de eerste altcoins op basis van de Bitcoin-code.",
     "2017 — Na de activering van SegWit in mei bereikte LTC in december de cyclustop, tijdens de cryptorally aan het eind van het jaar. Diezelfde maand maakte Charlie Lee bekend dat hij al zijn LTC had verkocht of weggegeven, vanwege belangenverstrengeling.",
     "2018 — In de berenmarkt daalde de koers meer dan 90% vanaf de top van 2017.",
     "2019 — Sterke stijging in het eerste halfjaar, vóór de tweede halving in augustus, en daarna een daling.",
     "2021 — All-time high in mei, daarna opnieuw een forse daling in de berenmarkt van 2022. Vervolgens kwamen de MWEB-upgrade in mei 2022 en de derde halving in augustus 2023."
    ],
    "faq": [
     {
      "q": "Is de angstindex op deze pagina specifiek voor Litecoin?",
      "a": "Nee. Het is de marktbrede sentimentindex voor crypto van Alternative.me, geen maatstaf voor alleen Litecoin. Daarom staat er ‘hele markt’ op de kaart en gebruikt het Bitcoin-scherm dezelfde waarde."
     },
     {
      "q": "Heeft Litecoin een MVRV-waarde?",
      "a": "Ja. De community-API van CoinMetrics levert actuele MVRV-gegevens voor Litecoin, dus de MVRV Z-Score telt mee in de score. Die geeft in standaarddeviaties aan hoe ver de marktwaarde boven de realized cap (de totale aankoopkosten van houders) ligt; de detailwaarden op de indicatorkaart zijn een premiumfunctie."
     },
     {
      "q": "Stijgt de score als een halving nadert?",
      "a": "Nee. Het halvingschema is geen invoer. De score steunt alleen op vijf prijsindicatoren, de marktbrede Angst- & Hebzucht-index en de MVRV; verwachtingen rond de halving tellen dus pas mee als ze in de koers zichtbaar worden. Op basis van de blokhoogte wordt de volgende halving rond 2027 verwacht."
     },
     {
      "q": "Waarom verschillen de scores van Bitcoin en Litecoin?",
      "a": "De methode is dezelfde, maar RSI, MACD, Mayer Multiple, daling, kruising van gemiddelden en MVRV worden berekend uit de eigen koers en on-chaindata van Litecoin. Alleen de marktbrede Angst- & Hebzucht-index is gedeeld. De Thermocap-indicator staat alleen op het Bitcoin-scherm."
     },
     {
      "q": "Moet ik nu Litecoin kopen?",
      "a": "Deze site raadt niet aan om te kopen of te verkopen. De score is een houvast om te zien waar de markt staat. Op het tabblad lange termijn (contrair) geldt: hoe hoger de score, hoe meer signalen van oververkocht, angst en onderwaardering samenvallen; hoe lager, hoe meer signalen van oververhitting. Het tabblad korte termijn (momentum) werkt andersom en stijgt naarmate de trend sterker is. Beslissingen en de gevolgen ervan liggen bij jou."
     },
     {
      "q": "Waar komen de Litecoin-gegevens vandaan?",
      "a": "Koersen en dagcandles komen uit de openbare API's van CoinGecko en Binance (LTC/USDT), de Angst- & Hebzucht-index van Alternative.me en de MVRV van CoinMetrics. De koersen verversen automatisch ongeveer elke minuut."
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
