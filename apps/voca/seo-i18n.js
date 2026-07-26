/* 하단 SEO 본문 다국어 데이터 + 렌더러 (btc의 seo-i18n.js 컨벤션).
   언어 전환 시 window.renderSEO(lang) 호출 → section.seo 를 해당 언어로 다시 그림.
   기본 정적 HTML(한국어)은 무JS 크롤러용 폴백으로 남겨두고, JS 실행 시 현재 언어로 교체. */
(function () {
  var SEO = {
    ko: {
      title: '깜빡이 단어암기장 — CSV 자동 반복 암기',
      intro: 'VOCA DECK은 어휘와 의미를 화면에 연속적으로 제시해 단기간에 이미지 연상으로 어휘를 암기하게 하는 깜빡이 방식의 무료 단어암기장입니다. 위쪽에는 단어, 아래쪽에는 의미가 큰 글자로 표시되며, 설정한 간격(기본 3초)으로 자동 반복 재생됩니다. 설치·회원가입 없이 브라우저에서 바로 실행됩니다.',
      howH: '사용법',
      how: [
        '암기장 열기 — 직접 만든 CSV 암기장 파일을 엽니다. 한 줄에 "단어,뜻" 형식(2열, 행 수 무제한)이며, 앞뒤 공백은 자동 제거되고 빈 행은 무시됩니다.',
        '글꼴 / 배경 색상 — 시각적으로 확 들어오는 큰 글꼴(노란 굵은 글씨)과 짙은 남색·검정 배경을 권장합니다.',
        '수동/자동 — 자동 모드는 지연시간(초) 간격으로 단어가 흘러가고, 수동 모드는 스페이스바 또는 다음 버튼으로 진행합니다. 한 번 누르면 단어가 위쪽에, 또 한 번 누르면 아래쪽에 의미가 제시되고, 또 누르면 그다음 단어로 넘어갑니다.',
        '제어판 숨기기 — 설정이 끝나면 제어판을 숨기고 화면을 크게 보면서 진행합니다.'
      ],
      featH: '주요 기능',
      feat: [
        '순서 — 순방향·역방향·무작위 출제',
        '표시 범위 — 외운 항목 제외 / 외운 항목만 / 모두',
        '암기 표시 — 외운 단어를 표시해 반복에서 제외하고, 언제든 초기화 가능',
        'A↔B — 단어→뜻, 뜻→단어 방향 전환',
        'TTS — 브라우저 음성 합성으로 단어를 읽어주기(음성만 모드 지원)',
        '시작번호 — 원하는 번호부터 시작'
      ],
      faqH: '자주 묻는 질문',
      faq: [
        { q: '깜빡이 암기란 무엇인가요?', a: '어휘와 의미를 화면에 연속적으로 제시해 단기간에 이미지 연상으로 어휘를 암기하게 하는 방식입니다. 단어가 먼저 크게 표시되고, 이어서 뜻이 표시되는 것을 반복하면서 어휘와 의미 사이의 연결고리를 두껍게 만듭니다.' },
        { q: '암기장 파일은 어떤 형식인가요?', a: "CSV 파일입니다. 한 줄에 '단어,뜻' 형식으로 2열을 쉼표로 구분해 적으며 행 수 제한은 없습니다. 앞뒤 공백은 자동으로 제거(trim)되고 빈 행은 무시됩니다. 엑셀·Numbers·메모장 어디서든 만들 수 있습니다." },
        { q: '자동 재생 간격을 바꿀 수 있나요?', a: '네. 제어판의 지연시간(초)에서 간격을 조절할 수 있으며 기본값은 3초입니다. 수동 모드에서는 스페이스바나 다음 버튼으로 한 단계씩 진행합니다.' },
        { q: 'VOCA DECK은 무료인가요? 데이터는 어디에 저장되나요?', a: '기본 기능은 무료입니다. 나만의 CSV 암기장을 열어 암기하는 핵심 기능은 설치·회원가입 없이 무료로 사용할 수 있고, 샘플 암기장·CSV 편집기·마이 보카덱·광고 제거 등 고급 기능은 프리미엄으로 제공됩니다. 암기장과 암기 표시는 브라우저의 localStorage에만 저장되며 서버로 전송되지 않습니다.' },
        { q: '스마트폰에서도 쓸 수 있나요?', a: '네. 모바일 브라우저에 최적화되어 있습니다. 화면을 좌우로 스와이프해 카드를 넘길 수 있고, 자동 재생 중 화면이 꺼지지 않게 하는 화면 꺼짐 방지 옵션도 제공합니다. 별도 앱 설치는 필요 없습니다.' },
        { q: '어떤 언어를 배울 수 있나요?', a: '단어장 내용에는 제한이 없습니다 — CSV에 적은 어떤 언어든 그대로 표시됩니다. 인터페이스와 샘플 암기장은 한국어·영어·일본어·중국어(간체/번체)·태국어·스페인어·프랑스어·독일어·이탈리아어·포르투갈어·러시아어·네덜란드어의 13개 언어를 지원합니다.' },
        { q: 'TTS 목소리와 속도를 바꿀 수 있나요?', a: '네. 고급 설정에서 A면/B면 각각의 언어와 목소리를 브라우저에 설치된 음성 중에서 고를 수 있고, 읽기 속도(0.5~2.0배)·음량·반복 횟수·읽기 대상(A면만/B면만/둘 다)도 조절할 수 있습니다.' },
        { q: '인터넷 연결 없이도 사용할 수 있나요?', a: '열어둔 암기장과 암기 표시는 브라우저에 저장되므로, 페이지가 이미 열려 있다면 오프라인에서도 암기를 계속할 수 있습니다. 다만 페이지를 새로 여는 데는 인터넷 연결이 필요합니다.' }
      ],
      whoH: '이런 분들께 좋습니다',
      who: [
        '수능·내신 영어 단어를 단기간에 여러 번 회전시키려는 중·고등학생 — 하루 100단어를 훑는 데 10분이면 충분합니다.',
        'TOEIC·TOEFL·JLPT·HSK·DELE 같은 어학시험을 준비하며 시험별 빈출 어휘를 반복해야 하는 수험생',
        '의학·법률·IT 용어처럼 전문 용어나 자격증 기출 용어를 대량으로 외워야 하는 대학생·직장인',
        '통학·통근 자투리 시간에 스마트폰으로 가볍게 복습하고 싶은 학습자 — 모바일 화면과 스와이프 조작에 최적화되어 있습니다.',
        '학생·자녀에게 나눠줄 단어장을 CSV 한 장으로 만들어 배포하려는 교사와 학부모'
      ],
      tipH: '효과를 높이는 학습 팁',
      tips: [
        '한 번에 완벽히 외우려 하지 말고 같은 덱을 하루 3~5회 짧게 반복하세요. 깜빡이는 “여러 번 스치는 것”이 핵심입니다.',
        '외운 단어는 바로 암기 표시를 하고 표시 범위를 “외운 항목 제외”로 두세요. 회차가 거듭될수록 모르는 단어에만 시간이 쓰입니다.',
        'A↔B 전환으로 뜻→단어 방향도 연습하세요. 단어를 보고 뜻을 떠올리는 것과 뜻을 보고 단어를 떠올리는 것은 별개의 능력입니다.',
        '철자와 발음이 어긋나는 언어(영어·프랑스어)나 성조 언어(중국어)는 TTS를 켜고 귀로 함께 외우세요. 목소리와 속도는 고급 설정에서 바꿀 수 있습니다.',
        '자기 전 10분과 일어난 직후 10분 복습이 기억 정착에 가장 효율적입니다. 원리는 아래 “단어 암기 학습 전략” 가이드에서 설명합니다.'
      ],
      sampH: '샘플 암기장과 나만의 단어장',
      sampP: '앱 아래의 샘플 보드에는 CEFR 단계별(A1·A2·B1·B2·고급·학술) 공통 어휘와 TOEIC·JLPT·HSK 등 시험별 어휘 덱이 준비되어 있어, 바로 적용하거나 CSV로 내려받아 수정할 수 있습니다. 13개 언어 어떤 조합으로도 학습할 수 있습니다 — 예를 들어 영어 화자가 일본어를, 한국어 화자가 스페인어를 배우는 식입니다. CSV 편집기에서는 엑셀처럼 2열 시트로 단어장을 직접 만들고 마이 보카덱에 저장해 언제든 다시 불러올 수 있습니다.',
      readH: '더 깊이 읽기 — 원본 해설',
      readP: '깜빡이 암기가 왜 통하는지, 단어장을 어떻게 설계해야 하는지, 하루 몇 개가 적당한지 직접 쓴 가이드를 공개합니다.',
      guides: [
        { href: '/method', t: '깜빡이 암기법의 원리', d: '에빙하우스 망각곡선, 간격 효과, 이중 부호화로 설명하는 반복 노출의 작동 원리. 그리고 깜빡이만으로는 왜 부족한지와 보완법.' },
        { href: '/csv-guide', t: 'CSV 단어장 만드는 법', d: '엑셀·구글시트로 만들기, 한글 깨짐(인코딩) 해결, 뜻에 쉼표가 있을 때, 좋은 카드를 만드는 5가지 원칙.' },
        { href: '/study-guide', t: '단어 암기 학습 전략', d: '하루 몇 개가 적당한가, 복습은 언제, 왜 “다시 읽기”가 시간 낭비인가. 4주 계획 예시 포함.' },
        { href: '/spaced-repetition', t: '간격 반복(Spaced Repetition) 완전 가이드', d: '라이트너 상자 → SM-2(Anki) → FSRS 알고리즘 비교. 깜빡이가 개인화를 포기한 이유와 Anki를 써야 할 때.' },
        { href: '/tts-pronunciation', t: 'TTS로 발음까지 외우기', d: '언어별 온도차: 영어·프랑스어(철자↔발음 불일치), 중국어(성조), 일본어(한자 읽기). 섀도잉 간격 설정.' },
        { href: '/exam-vocabulary', t: '시험별 단어장 설계 전략', d: '수능·토익·토플·HSK는 요구하는 어휘 능력이 다릅니다. 시험마다 카드 앞뒷면이 달라져야 하는 이유.' },
        { href: '/about', t: '운영자 소개 · 만든 이유', d: '누가 만들었는지, 데이터가 서버로 가지 않는 이유, 수익 모델과 이해 상충 고지.' }
      ]
    },
    en: {
      title: 'Flashing Vocabulary Memorizer — Auto-repeat CSV decks',
      intro: 'VOCA DECK is a free “flashing” vocabulary memorizer that presents words and meanings in rapid succession so you memorize them through visual association. The word appears on top and its meaning below, in large type, auto-repeating at your chosen interval (default 3 seconds). Runs in the browser with no install or sign-up.',
      howH: 'How to use',
      how: [
        'Open a deck — open your own CSV deck file. Each line is "word,meaning" (2 columns, unlimited rows); surrounding whitespace is trimmed and empty lines are ignored.',
        'Font / background — a large eye-catching font (bold yellow) on a dark navy or black background is recommended.',
        'Manual/Auto — auto mode advances at the chosen delay (seconds); manual mode advances with the spacebar or the Next button. One press shows the word on top, another reveals the meaning below, and another moves to the next word.',
        'Hide panel — once configured, hide the control panel and study with a maximized display.'
      ],
      featH: 'Features',
      feat: [
        'Order — forward, backward or random',
        'Range — skip memorized / memorized only / all',
        'Memorized marks — mark learned words to exclude them from repetition; reset anytime',
        'A↔B — switch between word→meaning and meaning→word',
        'TTS — read words aloud with browser speech synthesis (voice-only mode supported)',
        'Start number — begin from any position'
      ],
      faqH: 'FAQ',
      faq: [
        { q: 'What is flashing memorization?', a: 'It is a method that presents words and meanings in rapid succession so you memorize vocabulary through visual association in a short time. The word appears large first, then its meaning, and the repetition strengthens the link between them.' },
        { q: 'What format is the deck file?', a: "A CSV file. Each line is 'word,meaning' — two columns separated by a comma, with no row limit. Whitespace is trimmed automatically and empty lines are ignored. You can create it in Excel, Numbers or any text editor." },
        { q: 'Can I change the auto-play interval?', a: 'Yes. Adjust the delay (seconds) in the control panel; the default is 3 seconds. In manual mode, advance one step at a time with the spacebar or the Next button.' },
        { q: 'Is VOCA DECK free? Where is my data stored?', a: 'The core features are free: open your own CSV deck and memorize with no install or sign-up. Advanced features such as sample decks, the CSV editor, My Voca Decks and ad removal are offered as premium. Your deck and memorized marks are stored only in your browser’s localStorage and are never sent to a server.' },
        { q: 'Does it work on smartphones?', a: 'Yes. It is optimized for mobile browsers: swipe left or right to move between cards, and a keep-screen-on option prevents the display from turning off during auto-play. No app installation is required.' },
        { q: 'Which languages can I study?', a: 'There is no limit on deck content — any language you put in the CSV is displayed as is. The interface and sample decks support 13 languages: Korean, English, Japanese, Chinese (Simplified/Traditional), Thai, Spanish, French, German, Italian, Portuguese, Russian and Dutch.' },
        { q: 'Can I change the TTS voice and speed?', a: 'Yes. In Advanced Settings you can pick the language and voice for side A and side B from the voices installed in your browser, and adjust reading speed (0.5–2.0x), volume, repeat count and the reading target (side A only / side B only / both).' },
        { q: 'Can I use it without an internet connection?', a: 'Your open deck and memorized marks are stored in the browser, so if the page is already open you can keep studying offline. An internet connection is only needed to load the page itself.' }
      ],
      whoH: 'Who is it for?',
      who: [
        'Middle and high school students who need to cycle through exam vocabulary quickly — skimming 100 words a day takes about 10 minutes.',
        'Test takers preparing for TOEIC, TOEFL, JLPT, HSK or DELE who need to drill exam-specific high-frequency words.',
        'University students and professionals memorizing large sets of technical terms — medicine, law, IT or certification exams.',
        'Learners who want light review on a phone during a commute — the layout and swipe controls are optimized for mobile.',
        'Teachers and parents who want to build a deck in a single CSV file and hand it out to students or children.'
      ],
      tipH: 'Tips for better results',
      tips: [
        'Don’t try to memorize everything in one sitting; run the same deck 3–5 short times a day. Flashing works through repeated brief exposure.',
        'Mark words as memorized right away and set the range to “skip memorized” — each pass then spends time only on the words you don’t know yet.',
        'Practice the meaning→word direction too with the A↔B switch. Recognizing a word and recalling it are separate skills.',
        'For languages where spelling and sound diverge (English, French) or tonal languages (Chinese), turn on TTS and learn with your ears as well. Voice and speed are adjustable in Advanced Settings.',
        'Ten minutes before bed and ten minutes after waking are the most efficient review slots. The “Study strategy” guide below explains why.'
      ],
      sampH: 'Sample decks and your own decks',
      sampP: 'The samples board below the app offers common vocabulary by CEFR level (A1–B2, advanced, academic) plus exam decks such as TOEIC, JLPT and HSK — apply them instantly or download the CSV and edit it. Any pairing of the 13 languages works: an English speaker studying Japanese, a Korean speaker studying Spanish, and so on. The CSV editor lets you build a deck in a two-column sheet like a spreadsheet and save it to My Voca Decks for later.',
      readH: 'Read deeper — original guides',
      readP: 'Hand-written guides on why flashing works, how to design a deck, and how many words a day is realistic.',
      guides: [
        { href: '/method', t: 'How flash memorization works', d: 'The Ebbinghaus forgetting curve, the spacing effect and dual coding — and why flashing alone is not enough, plus how to compensate.' },
        { href: '/csv-guide', t: 'How to make a CSV deck', d: 'Building decks in Excel or Google Sheets, fixing encoding issues, handling commas inside meanings, and 5 principles of a good card.' },
        { href: '/study-guide', t: 'Vocabulary study strategy', d: 'How many words per day, when to review, and why “re-reading” wastes time. Includes a 4-week plan example.' },
        { href: '/spaced-repetition', t: 'Complete guide to spaced repetition', d: 'Leitner boxes → SM-2 (Anki) → FSRS compared. Why flashing gives up personalization, and when you should use Anki instead.' },
        { href: '/tts-pronunciation', t: 'Memorize pronunciation with TTS', d: 'Per-language differences: English/French (spelling–sound mismatch), Chinese (tones), Japanese (kanji readings). Shadowing interval setup.' },
        { href: '/exam-vocabulary', t: 'Deck design per exam', d: 'CSAT, TOEIC, TOEFL and HSK demand different vocabulary skills — why the front and back of your cards should change per exam.' },
        { href: '/about', t: 'About the operator', d: 'Who built it, why your data never leaves the browser, the revenue model and conflict-of-interest disclosure.' }
      ]
    },
    ja: {
      title: '点滅式単語暗記 — CSV自動リピート',
      intro: 'VOCA DECKは、単語と意味を画面に連続提示し、短期間でイメージ連想により語彙を暗記させる「点滅式」の無料単語暗記ツールです。上に単語、下に意味が大きな文字で表示され、設定した間隔（既定3秒）で自動リピート再生されます。インストール・会員登録不要でブラウザから即実行できます。',
      howH: '使い方',
      how: [
        '単語帳を開く — 自作のCSV単語帳ファイルを開きます。1行に「単語,意味」形式（2列・行数無制限）。前後の空白は自動除去、空行は無視されます。',
        'フォント / 背景色 — 視覚に飛び込む大きなフォント（黄色の太字）と濃紺・黒の背景を推奨します。',
        '手動/自動 — 自動モードは間隔（秒）ごとに単語が流れ、手動モードはスペースキーまたは「次へ」ボタンで進みます。1回押すと上に単語、もう1回で下に意味、さらに押すと次の単語へ進みます。',
        'パネルを隠す — 設定が済んだらパネルを隠し、画面を大きく見ながら進めます。'
      ],
      featH: '主な機能',
      feat: [
        '順序 — 順方向・逆方向・ランダム出題',
        '表示範囲 — 暗記済を除外 / 暗記済のみ / すべて',
        '暗記マーク — 覚えた単語に印を付けて繰り返しから除外、いつでも初期化可能',
        'A↔B — 単語→意味、意味→単語の方向切替',
        'TTS — ブラウザ音声合成による読み上げ（音声のみモード対応）',
        '開始番号 — 好きな番号から開始'
      ],
      faqH: 'よくある質問',
      faq: [
        { q: '点滅式暗記とは？', a: '単語と意味を画面に連続提示し、短期間でイメージ連想により語彙を暗記させる方式です。まず単語が大きく表示され、続いて意味が表示されるのを繰り返し、語彙と意味の結び付きを強化します。' },
        { q: '単語帳ファイルの形式は？', a: 'CSVファイルです。1行に「単語,意味」の2列をカンマ区切りで書き、行数制限はありません。前後の空白は自動除去され、空行は無視されます。Excel・Numbers・メモ帳のどれでも作成できます。' },
        { q: '自動再生の間隔は変えられますか？', a: 'はい。コントロールパネルの間隔（秒）で調整でき、既定値は3秒です。手動モードではスペースキーか「次へ」ボタンで1段階ずつ進みます。' },
        { q: 'VOCA DECKは無料？データはどこに保存されますか？', a: '基本機能は無料です。自作のCSV単語帳を開いて暗記する中核機能はインストール・会員登録なしで無料で使えます。サンプル単語帳・CSVエディタ・マイVOCAデッキ・広告非表示などの高度な機能はプレミアムとして提供されます。単語帳と暗記マークはブラウザのlocalStorageにのみ保存され、サーバーには送信されません。' },
        { q: 'スマートフォンでも使えますか？', a: 'はい。モバイルブラウザに最適化されています。画面を左右にスワイプしてカードを送れるほか、自動再生中に画面が消えないようにするスリープ防止オプションも用意しています。アプリのインストールは不要です。' },
        { q: 'どの言語を学べますか？', a: '単語帳の内容に制限はありません — CSVに書いた言語がそのまま表示されます。インターフェースとサンプル単語帳は、韓国語・英語・日本語・中国語（簡体/繁体）・タイ語・スペイン語・フランス語・ドイツ語・イタリア語・ポルトガル語・ロシア語・オランダ語の13言語に対応しています。' },
        { q: 'TTSの声や速度は変えられますか？', a: 'はい。詳細設定でA面/B面それぞれの言語と声をブラウザにインストールされた音声から選べます。読み上げ速度（0.5〜2.0倍）・音量・繰り返し回数・読み上げ対象（A面のみ/B面のみ/両方）も調整できます。' },
        { q: 'インターネット接続なしでも使えますか？', a: '開いた単語帳と暗記マークはブラウザに保存されるため、ページを開いた状態ならオフラインでも暗記を続けられます。ただしページを新しく開くには接続が必要です。' }
      ],
      whoH: 'こんな方におすすめ',
      who: [
        '受験・定期テストの英単語を短期間で何周も回したい中高生 — 1日100語に目を通すのに10分あれば十分です。',
        'TOEIC・TOEFL・JLPT・HSK・DELEなどの語学試験に向けて頻出語彙を反復したい受験者',
        '医学・法律・ITなどの専門用語や資格試験の頻出用語を大量に覚える必要のある大学生・社会人',
        '通学・通勤のすき間時間にスマホで軽く復習したい学習者 — モバイル画面とスワイプ操作に最適化されています。',
        '生徒や子どもに配る単語帳をCSV一枚で作って配布したい教師・保護者'
      ],
      tipH: '効果を高める学習のコツ',
      tips: [
        '一度で完璧に覚えようとせず、同じデッキを1日3〜5回、短く繰り返しましょう。点滅式は「何度も目に触れること」が核心です。',
        '覚えた単語はすぐ暗記マークを付け、表示範囲を「暗記済を除外」にしましょう。周回を重ねるほど、知らない単語だけに時間が使われます。',
        'A↔B切替で意味→単語の方向も練習しましょう。単語を見て意味を思い出すことと、意味を見て単語を思い出すことは別の能力です。',
        '綴りと発音がずれる言語（英語・フランス語）や声調言語（中国語）はTTSをオンにして耳でも覚えましょう。声と速度は詳細設定で変更できます。',
        '就寝前10分と起床直後10分の復習が記憶の定着に最も効率的です。原理は下の「学習戦略」ガイドで説明しています。'
      ],
      sampH: 'サンプル単語帳と自分だけの単語帳',
      sampP: 'アプリ下部のサンプルボードには、CEFRレベル別（A1・A2・B1・B2・上級・学術）の共通語彙と、TOEIC・JLPT・HSKなど試験別の語彙デッキが用意されており、すぐ適用するか、CSVでダウンロードして編集できます。13言語のどの組み合わせでも学べます — 英語話者が日本語を、韓国語話者がスペイン語を学ぶ、といった形です。CSVエディタではExcelのような2列シートで単語帳を自作し、マイVOCAデッキに保存していつでも呼び出せます。',
      readH: 'さらに深く読む — オリジナル解説',
      readP: 'なぜ点滅式が効くのか、単語帳をどう設計すべきか、1日何語が適切か — 自ら書いたガイドを公開しています。',
      guides: [
        { href: '/method', t: '点滅式暗記法の原理', d: 'エビングハウスの忘却曲線、間隔効果、二重符号化で説明する反復露出の仕組み。点滅式だけでは足りない理由と補い方も。' },
        { href: '/csv-guide', t: 'CSV単語帳の作り方', d: 'Excel・Googleスプレッドシートでの作成、文字化け（エンコーディング）の解決、意味にカンマがある場合、良いカードを作る5原則。' },
        { href: '/study-guide', t: '単語暗記の学習戦略', d: '1日何語が適切か、復習はいつか、なぜ「読み返し」が時間の無駄なのか。4週間プランの例つき。' },
        { href: '/spaced-repetition', t: '間隔反復（Spaced Repetition）完全ガイド', d: 'ライトナーボックス → SM-2（Anki）→ FSRSのアルゴリズム比較。点滅式が個別最適化を捨てた理由と、Ankiを使うべきとき。' },
        { href: '/tts-pronunciation', t: 'TTSで発音まで覚える', d: '言語ごとの温度差：英語・フランス語（綴り↔発音の不一致）、中国語（声調）、日本語（漢字の読み）。シャドーイングの間隔設定。' },
        { href: '/exam-vocabulary', t: '試験別・単語帳設計戦略', d: '大学入試・TOEIC・TOEFL・HSKでは要求される語彙力が異なります。試験ごとにカードの表裏を変えるべき理由。' },
        { href: '/about', t: '運営者紹介・作った理由', d: '誰が作ったのか、データがサーバーに送られない理由、収益モデルと利益相反の開示。' }
      ]
    },
    zh: {
      title: '闪示单词记忆 — CSV自动循环',
      intro: 'VOCA DECK是一款免费的“闪示式”单词记忆工具：将单词与释义连续呈现在屏幕上，让你在短时间内通过图像联想记住词汇。上方显示单词、下方显示释义，均为大字号，并按设定间隔（默认3秒）自动循环播放。无需安装和注册，浏览器即开即用。',
      howH: '使用方法',
      how: [
        '打开单词本 — 打开自制的CSV单词本文件。每行为"单词,释义"格式（2列、行数不限）；首尾空白自动去除，空行忽略。',
        '字体 / 背景颜色 — 建议使用醒目的大字体（黄色粗体）搭配深蓝或黑色背景。',
        '手动/自动 — 自动模式按间隔（秒）自动播放；手动模式用空格键或"下一个"按钮推进。按一次上方出现单词，再按一次下方出现释义，再按进入下一个单词。',
        '隐藏控制面板 — 设置完成后隐藏面板，以最大化画面进行记忆。'
      ],
      featH: '主要功能',
      feat: [
        '顺序 — 正向、反向、随机出题',
        '显示范围 — 排除已记 / 仅已记 / 全部',
        '已记标记 — 标记已记住的单词并从循环中排除，可随时重置',
        'A↔B — 单词→释义、释义→单词方向切换',
        'TTS — 浏览器语音合成朗读（支持仅语音模式）',
        '起始编号 — 从任意编号开始'
      ],
      faqH: '常见问题',
      faq: [
        { q: '什么是闪示记忆？', a: '一种将单词与释义连续呈现在屏幕上、让你在短时间内通过图像联想记忆词汇的方法。单词先以大字显示，随后显示释义，如此反复，强化单词与释义之间的联结。' },
        { q: '单词本文件是什么格式？', a: 'CSV文件。每行以"单词,释义"两列用逗号分隔，行数不限。首尾空白自动去除，空行忽略。Excel、Numbers、记事本都能制作。' },
        { q: '可以更改自动播放间隔吗？', a: '可以。在控制面板的间隔(秒)中调整，默认为3秒。手动模式下用空格键或"下一个"按钮逐步推进。' },
        { q: 'VOCA DECK免费吗？数据保存在哪里？', a: '基础功能免费：打开自制CSV单词本进行背诵，无需安装和注册。示例单词本、CSV编辑器、我的Voca Deck、去广告等高级功能以高级版（Premium）提供。单词本与已记标记只保存在你浏览器的localStorage中，不会发送到服务器。' },
        { q: '手机上能用吗？', a: '可以。已针对移动浏览器优化：左右滑动即可切换卡片，还提供防止自动播放时屏幕熄灭的常亮选项。无需安装任何应用。' },
        { q: '可以学习哪些语言？', a: '单词本内容没有限制 — CSV里写什么语言就显示什么语言。界面和示例单词本支持13种语言：韩语、英语、日语、中文（简体/繁体）、泰语、西班牙语、法语、德语、意大利语、葡萄牙语、俄语和荷兰语。' },
        { q: '可以更换TTS的声音和语速吗？', a: '可以。在高级设置中，可分别为A面/B面从浏览器已安装的语音中选择语言和声音，还能调整朗读速度（0.5~2.0倍）、音量、重复次数和朗读对象（仅A面/仅B面/两面）。' },
        { q: '没有网络也能使用吗？', a: '打开过的单词本和已记标记保存在浏览器中，只要页面已经打开，离线也能继续背诵。但重新打开页面需要网络连接。' }
      ],
      whoH: '适合哪些人',
      who: [
        '需要在短期内多轮滚动考试词汇的初高中生 — 每天过一遍100个单词只需约10分钟。',
        '备考TOEIC、TOEFL、JLPT、HSK、DELE等语言考试、需要反复记忆高频词汇的考生',
        '需要大量记忆医学、法律、IT等专业术语或资格考试用语的大学生和上班族',
        '想在通勤路上用手机轻松复习的学习者 — 界面和滑动操作已针对移动端优化。',
        '想用一张CSV做好单词本分发给学生或孩子的教师和家长'
      ],
      tipH: '提高效果的学习技巧',
      tips: [
        '不要指望一次记牢，同一副卡组每天短时间刷3~5遍。闪示法的核心是“多次快速过眼”。',
        '记住的单词立即标记，并把显示范围设为“排除已记”，这样每一轮都只把时间花在还不会的单词上。',
        '用A↔B切换练习释义→单词的方向。看词想义和看义想词是两种不同的能力。',
        '拼写与发音不一致的语言（英语、法语）或声调语言（中文），请打开TTS用耳朵一起记。声音和语速可在高级设置中更改。',
        '睡前10分钟和起床后10分钟复习对巩固记忆最有效。原理见下方“学习策略”指南。'
      ],
      sampH: '示例单词本与自制单词本',
      sampP: '应用下方的示例板块提供按CEFR等级（A1·A2·B1·B2·高级·学术）整理的通用词汇，以及TOEIC、JLPT、HSK等考试词汇卡组，可以直接应用，也可以下载CSV后修改。13种语言任意组合都能学习 — 例如英语使用者学日语、韩语使用者学西班牙语。在CSV编辑器中可以像Excel一样用两列表格自制单词本，保存到“我的Voca Deck”随时调用。',
      readH: '深入阅读 — 原创解读',
      readP: '闪示记忆为什么有效、单词本该怎么设计、每天背多少合适 — 亲笔撰写的指南全部公开。',
      guides: [
        { href: '/method', t: '闪示记忆法的原理', d: '用艾宾浩斯遗忘曲线、间隔效应和双重编码解释重复曝光的作用机制，以及只靠闪示为何不够、如何补足。' },
        { href: '/csv-guide', t: 'CSV单词本制作方法', d: '用Excel、Google表格制作，解决乱码（编码）问题，释义中含逗号怎么办，做好卡片的5条原则。' },
        { href: '/study-guide', t: '单词记忆学习策略', d: '每天背多少合适、何时复习、为什么“重读”是浪费时间。附4周计划示例。' },
        { href: '/spaced-repetition', t: '间隔重复（Spaced Repetition）完全指南', d: '莱特纳盒子 → SM-2（Anki）→ FSRS算法对比。闪示法放弃个性化的原因，以及什么时候该用Anki。' },
        { href: '/tts-pronunciation', t: '用TTS连发音一起记', d: '各语言差异：英语·法语（拼写与发音不一致）、中文（声调）、日语（汉字读音）。跟读的间隔设置。' },
        { href: '/exam-vocabulary', t: '按考试设计单词本的策略', d: '高考、TOEIC、TOEFL、HSK要求的词汇能力各不相同 — 为什么卡片正反面要因考试而异。' },
        { href: '/about', t: '运营者介绍 · 创建初衷', d: '谁做的、数据为什么不上传服务器、盈利模式与利益冲突披露。' }
      ]
    },
    'zh-Hant': {
      title: '閃示單字記憶 — CSV自動循環',
      intro: 'VOCA DECK是一款免費的「閃示式」單字記憶工具：將單字與釋義連續呈現在螢幕上，讓你在短時間內透過圖像聯想記住詞彙。上方顯示單字、下方顯示釋義，皆為大字級，並依設定間隔（預設3秒）自動循環播放。免安裝、免註冊，瀏覽器即開即用。',
      howH: '使用方法',
      how: [
        '開啟單字本 — 開啟自製的CSV單字本檔案。每行為「單字,釋義」格式（2欄、行數不限）；前後空白自動去除，空行忽略。',
        '字型 / 背景顏色 — 建議使用醒目的大字型（黃色粗體）搭配深藍或黑色背景。',
        '手動/自動 — 自動模式依間隔（秒）自動播放；手動模式用空白鍵或「下一個」按鈕推進。按一次上方出現單字，再按一次下方出現釋義，再按進入下一個單字。',
        '隱藏控制面板 — 設定完成後隱藏面板，以最大化畫面進行記憶。'
      ],
      featH: '主要功能',
      feat: [
        '順序 — 正向、反向、隨機出題',
        '顯示範圍 — 排除已記 / 僅已記 / 全部',
        '已記標記 — 標記已記住的單字並從循環中排除，可隨時重設',
        'A↔B — 單字→釋義、釋義→單字方向切換',
        'TTS — 瀏覽器語音合成朗讀（支援僅語音模式）',
        '起始編號 — 從任意編號開始'
      ],
      faqH: '常見問題',
      faq: [
        { q: '什麼是閃示記憶？', a: '一種將單字與釋義連續呈現在螢幕上、讓你在短時間內透過圖像聯想記憶詞彙的方法。單字先以大字顯示，隨後顯示釋義，如此反覆，強化單字與釋義之間的連結。' },
        { q: '單字本檔案是什麼格式？', a: 'CSV檔案。每行以「單字,釋義」兩欄用逗號分隔，行數不限。前後空白自動去除，空行忽略。Excel、Numbers、記事本都能製作。' },
        { q: '可以更改自動播放間隔嗎？', a: '可以。在控制面板的間隔(秒)中調整，預設為3秒。手動模式下用空白鍵或「下一個」按鈕逐步推進。' },
        { q: 'VOCA DECK免費嗎？資料儲存在哪裡？', a: '基本功能免費：開啟自製CSV單字本進行背誦，免安裝、免註冊。範例單字本、CSV編輯器、我的Voca Deck、移除廣告等進階功能以進階版（Premium）提供。單字本與已記標記只儲存在你瀏覽器的localStorage中，不會傳送到伺服器。' },
        { q: '手機上能用嗎？', a: '可以。已針對行動瀏覽器最佳化：左右滑動即可切換卡片，還提供防止自動播放時螢幕熄滅的常亮選項。無需安裝任何應用程式。' },
        { q: '可以學習哪些語言？', a: '單字本內容沒有限制 — CSV裡寫什麼語言就顯示什麼語言。介面和範例單字本支援13種語言：韓語、英語、日語、中文（簡體/繁體）、泰語、西班牙語、法語、德語、義大利語、葡萄牙語、俄語和荷蘭語。' },
        { q: '可以更換TTS的聲音和語速嗎？', a: '可以。在進階設定中，可分別為A面/B面從瀏覽器已安裝的語音中選擇語言和聲音，還能調整朗讀速度（0.5~2.0倍）、音量、重複次數和朗讀對象（僅A面/僅B面/兩面）。' },
        { q: '沒有網路也能使用嗎？', a: '開啟過的單字本和已記標記儲存在瀏覽器中，只要頁面已經開啟，離線也能繼續背誦。但重新開啟頁面需要網路連線。' }
      ],
      whoH: '適合哪些人',
      who: [
        '需要在短期內多輪滾動考試詞彙的國高中生 — 每天過一遍100個單字只需約10分鐘。',
        '備考TOEIC、TOEFL、JLPT、HSK、DELE等語言考試、需要反覆記憶高頻詞彙的考生',
        '需要大量記憶醫學、法律、IT等專業術語或證照考試用語的大學生和上班族',
        '想在通勤路上用手機輕鬆複習的學習者 — 介面和滑動操作已針對行動裝置最佳化。',
        '想用一張CSV做好單字本發給學生或孩子的教師和家長'
      ],
      tipH: '提高效果的學習技巧',
      tips: [
        '不要指望一次記牢，同一副卡組每天短時間刷3~5遍。閃示法的核心是「多次快速過眼」。',
        '記住的單字立即標記，並把顯示範圍設為「排除已記」，這樣每一輪都只把時間花在還不會的單字上。',
        '用A↔B切換練習釋義→單字的方向。看字想義和看義想字是兩種不同的能力。',
        '拼寫與發音不一致的語言（英語、法語）或聲調語言（中文），請開啟TTS用耳朵一起記。聲音和語速可在進階設定中更改。',
        '睡前10分鐘和起床後10分鐘複習對鞏固記憶最有效。原理見下方「學習策略」指南。'
      ],
      sampH: '範例單字本與自製單字本',
      sampP: '應用程式下方的範例板塊提供按CEFR等級（A1·A2·B1·B2·高級·學術）整理的通用詞彙，以及TOEIC、JLPT、HSK等考試詞彙卡組，可以直接套用，也可以下載CSV後修改。13種語言任意組合都能學習 — 例如英語使用者學日語、韓語使用者學西班牙語。在CSV編輯器中可以像Excel一樣用兩欄表格自製單字本，儲存到「我的Voca Deck」隨時調用。',
      readH: '深入閱讀 — 原創解說',
      readP: '閃示記憶為什麼有效、單字本該怎麼設計、每天背多少合適 — 親筆撰寫的指南全部公開。',
      guides: [
        { href: '/method', t: '閃示記憶法的原理', d: '用艾賓浩斯遺忘曲線、間隔效應和雙重編碼解釋重複曝光的作用機制，以及只靠閃示為何不夠、如何補足。' },
        { href: '/csv-guide', t: 'CSV單字本製作方法', d: '用Excel、Google試算表製作，解決亂碼（編碼）問題，釋義中含逗號怎麼辦，做好卡片的5條原則。' },
        { href: '/study-guide', t: '單字記憶學習策略', d: '每天背多少合適、何時複習、為什麼「重讀」是浪費時間。附4週計畫範例。' },
        { href: '/spaced-repetition', t: '間隔重複（Spaced Repetition）完全指南', d: '萊特納盒子 → SM-2（Anki）→ FSRS演算法比較。閃示法放棄個人化的原因，以及什麼時候該用Anki。' },
        { href: '/tts-pronunciation', t: '用TTS連發音一起記', d: '各語言差異：英語·法語（拼寫與發音不一致）、中文（聲調）、日語（漢字讀音）。跟讀的間隔設定。' },
        { href: '/exam-vocabulary', t: '按考試設計單字本的策略', d: '大學入學考、TOEIC、TOEFL、HSK要求的詞彙能力各不相同 — 為什麼卡片正反面要因考試而異。' },
        { href: '/about', t: '營運者介紹 · 創建初衷', d: '誰做的、資料為什麼不上傳伺服器、獲利模式與利益衝突揭露。' }
      ]
    },
    th: {
      title: 'ท่องศัพท์แบบแฟลช — เล่นซ้ำอัตโนมัติจาก CSV',
      intro: 'VOCA DECK คือเครื่องมือท่องศัพท์ฟรีแบบ “แฟลช” ที่แสดงคำและความหมายต่อเนื่องบนหน้าจอ ให้คุณจดจำคำศัพท์ผ่านการเชื่อมโยงภาพในเวลาสั้นๆ คำอยู่ด้านบน ความหมายอยู่ด้านล่างด้วยตัวอักษรขนาดใหญ่ เล่นซ้ำอัตโนมัติตามช่วงเวลาที่ตั้ง (ค่าเริ่มต้น 3 วินาที) ใช้ในเบราว์เซอร์ได้ทันที ไม่ต้องติดตั้งหรือสมัครสมาชิก',
      howH: 'วิธีใช้',
      how: [
        'เปิดชุดคำศัพท์ — เปิดไฟล์ CSV ที่สร้างเอง หนึ่งบรรทัดคือ "คำ,ความหมาย" (2 คอลัมน์ ไม่จำกัดจำนวนแถว) ช่องว่างหน้าหลังถูกตัดอัตโนมัติ บรรทัดว่างถูกข้าม',
        'ฟอนต์ / สีพื้นหลัง — แนะนำฟอนต์ใหญ่สะดุดตา (เหลืองตัวหนา) บนพื้นหลังน้ำเงินเข้มหรือดำ',
        'มือ/อัตโนมัติ — โหมดอัตโนมัติเลื่อนตามหน่วงเวลา (วินาที) โหมดมือกดสเปซบาร์หรือปุ่มถัดไป กดครั้งแรกคำปรากฏด้านบน กดอีกครั้งความหมายปรากฏด้านล่าง กดอีกครั้งไปคำถัดไป',
        'ซ่อนแผงควบคุม — ตั้งค่าเสร็จแล้วซ่อนแผงเพื่อดูหน้าจอแบบเต็ม'
      ],
      featH: 'ฟีเจอร์หลัก',
      feat: [
        'ลำดับ — ไปข้างหน้า ย้อนกลับ หรือสุ่ม',
        'ขอบเขต — ข้ามที่จำได้ / เฉพาะที่จำได้ / ทั้งหมด',
        'เครื่องหมายจำ — ทำเครื่องหมายคำที่จำได้เพื่อตัดออกจากการวนซ้ำ ล้างได้ทุกเมื่อ',
        'A↔B — สลับทิศทาง คำ→ความหมาย / ความหมาย→คำ',
        'TTS — อ่านออกเสียงด้วยเสียงสังเคราะห์ของเบราว์เซอร์ (มีโหมดเสียงเท่านั้น)',
        'หมายเลขเริ่มต้น — เริ่มจากตำแหน่งใดก็ได้'
      ],
      faqH: 'คำถามที่พบบ่อย',
      faq: [
        { q: 'การท่องแบบแฟลชคืออะไร?', a: 'คือวิธีแสดงคำและความหมายต่อเนื่องบนหน้าจอ ให้จดจำคำศัพท์ผ่านการเชื่อมโยงภาพในเวลาสั้นๆ คำจะแสดงตัวใหญ่ก่อน ตามด้วยความหมาย ทำซ้ำเพื่อเสริมความเชื่อมโยงระหว่างคำกับความหมาย' },
        { q: 'ไฟล์ชุดคำศัพท์เป็นรูปแบบใด?', a: "ไฟล์ CSV หนึ่งบรรทัดคือ 'คำ,ความหมาย' สองคอลัมน์คั่นด้วยจุลภาค ไม่จำกัดจำนวนแถว ช่องว่างถูกตัดอัตโนมัติและข้ามบรรทัดว่าง สร้างได้ทั้งใน Excel, Numbers หรือโปรแกรมแก้ไขข้อความใดก็ได้" },
        { q: 'เปลี่ยนช่วงเวลาเล่นอัตโนมัติได้ไหม?', a: 'ได้ ปรับหน่วงเวลา (วินาที) ในแผงควบคุม ค่าเริ่มต้นคือ 3 วินาที ในโหมดมือใช้สเปซบาร์หรือปุ่มถัดไปเลื่อนทีละขั้น' },
        { q: 'VOCA DECK ฟรีไหม? ข้อมูลเก็บที่ไหน?', a: 'ฟีเจอร์พื้นฐานใช้ฟรี: เปิดชุดคำศัพท์ CSV ของคุณเองเพื่อท่องจำได้โดยไม่ต้องติดตั้งหรือสมัครสมาชิก ส่วนฟีเจอร์ขั้นสูง เช่น ชุดคำศัพท์ตัวอย่าง ตัวแก้ไข CSV, Voca Deck ของฉัน และการปิดโฆษณา มีให้ในแบบพรีเมียม ชุดคำศัพท์และเครื่องหมายจำถูกเก็บใน localStorage ของเบราว์เซอร์ของคุณเท่านั้น ไม่ถูกส่งไปยังเซิร์ฟเวอร์' },
        { q: 'ใช้บนสมาร์ทโฟนได้ไหม?', a: 'ได้ ปรับให้เหมาะกับเบราว์เซอร์มือถือแล้ว: ปัดซ้ายขวาเพื่อเปลี่ยนการ์ด และมีตัวเลือกป้องกันหน้าจอดับระหว่างเล่นอัตโนมัติ ไม่ต้องติดตั้งแอปใดๆ' },
        { q: 'เรียนภาษาอะไรได้บ้าง?', a: 'เนื้อหาชุดคำศัพท์ไม่มีข้อจำกัด — ภาษาใดก็ตามที่พิมพ์ใน CSV จะแสดงตามนั้น ส่วนอินเทอร์เฟซและชุดคำศัพท์ตัวอย่างรองรับ 13 ภาษา: เกาหลี อังกฤษ ญี่ปุ่น จีน (ตัวย่อ/ตัวเต็ม) ไทย สเปน ฝรั่งเศส เยอรมัน อิตาลี โปรตุเกส รัสเซีย และดัตช์' },
        { q: 'เปลี่ยนเสียงและความเร็ว TTS ได้ไหม?', a: 'ได้ ในการตั้งค่าขั้นสูง เลือกภาษาและเสียงของด้าน A และด้าน B จากเสียงที่ติดตั้งในเบราว์เซอร์ได้ และปรับความเร็วการอ่าน (0.5–2.0 เท่า) ระดับเสียง จำนวนครั้งที่อ่านซ้ำ และเป้าหมายการอ่าน (เฉพาะด้าน A / เฉพาะด้าน B / ทั้งสองด้าน) ได้ด้วย' },
        { q: 'ใช้โดยไม่มีอินเทอร์เน็ตได้ไหม?', a: 'ชุดคำศัพท์ที่เปิดไว้และเครื่องหมายจำถูกเก็บในเบราว์เซอร์ ดังนั้นถ้าหน้าเว็บเปิดอยู่แล้วก็ท่องต่อแบบออฟไลน์ได้ แต่การเปิดหน้าเว็บใหม่ต้องมีการเชื่อมต่อ' }
      ],
      whoH: 'เหมาะกับใคร',
      who: [
        'นักเรียนมัธยมที่ต้องวนศัพท์สอบหลายรอบในเวลาสั้นๆ — กวาดตา 100 คำต่อวันใช้เวลาแค่ราว 10 นาที',
        'ผู้เตรียมสอบภาษา เช่น TOEIC, TOEFL, JLPT, HSK, DELE ที่ต้องทวนคำศัพท์ออกสอบบ่อยซ้ำๆ',
        'นักศึกษาและคนทำงานที่ต้องจำศัพท์เทคนิคจำนวนมาก เช่น การแพทย์ กฎหมาย ไอที หรือศัพท์สอบใบรับรอง',
        'ผู้เรียนที่อยากทบทวนเบาๆ บนมือถือระหว่างเดินทาง — หน้าจอและการปัดถูกปรับให้เหมาะกับมือถือ',
        'ครูและผู้ปกครองที่อยากทำชุดคำศัพท์ด้วยไฟล์ CSV แผ่นเดียวแล้วแจกให้นักเรียนหรือลูก'
      ],
      tipH: 'เคล็ดลับเพิ่มประสิทธิภาพ',
      tips: [
        'อย่าพยายามจำให้หมดในครั้งเดียว ให้วนชุดเดิมวันละ 3–5 รอบสั้นๆ หัวใจของแบบแฟลชคือ "ผ่านตาบ่อยๆ"',
        'คำที่จำได้แล้วให้ทำเครื่องหมายทันที และตั้งขอบเขตเป็น "ข้ามที่จำได้" ยิ่งวนหลายรอบ เวลาก็ยิ่งถูกใช้กับคำที่ยังไม่รู้เท่านั้น',
        'ฝึกทิศทาง ความหมาย→คำ ด้วยสวิตช์ A↔B ด้วย การดูคำแล้วนึกความหมายกับการดูความหมายแล้วนึกคำเป็นคนละทักษะกัน',
        'ภาษาที่การสะกดกับการออกเสียงไม่ตรงกัน (อังกฤษ ฝรั่งเศส) หรือภาษามีวรรณยุกต์ (จีน) ให้เปิด TTS แล้วจำด้วยหูไปพร้อมกัน เสียงและความเร็วเปลี่ยนได้ในการตั้งค่าขั้นสูง',
        'ทบทวน 10 นาทีก่อนนอนและ 10 นาทีหลังตื่นมีประสิทธิภาพต่อความจำมากที่สุด อ่านหลักการได้ในไกด์ "กลยุทธ์การเรียน" ด้านล่าง'
      ],
      sampH: 'ชุดคำศัพท์ตัวอย่างและชุดของคุณเอง',
      sampP: 'บอร์ดตัวอย่างใต้แอปมีคำศัพท์พื้นฐานแยกตามระดับ CEFR (A1·A2·B1·B2·ขั้นสูง·วิชาการ) และชุดคำศัพท์ตามข้อสอบ เช่น TOEIC, JLPT, HSK — ใช้ได้ทันทีหรือดาวน์โหลด CSV ไปแก้ไขก็ได้ เรียนได้ทุกคู่ของ 13 ภาษา เช่น ผู้พูดอังกฤษเรียนญี่ปุ่น ผู้พูดเกาหลีเรียนสเปน ในตัวแก้ไข CSV สร้างชุดคำศัพท์ด้วยตาราง 2 คอลัมน์เหมือน Excel แล้วบันทึกลง Voca Deck ของฉันเพื่อเรียกใช้ได้ทุกเมื่อ',
      readH: 'อ่านเชิงลึก — บทความต้นฉบับ',
      readP: 'ทำไมการท่องแบบแฟลชจึงได้ผล ควรออกแบบชุดคำศัพท์อย่างไร วันละกี่คำจึงพอดี — ไกด์ที่เขียนเองทั้งหมดเปิดให้อ่านฟรี',
      guides: [
        { href: '/method', t: 'หลักการของการท่องแบบแฟลช', d: 'อธิบายกลไกของการเปิดรับซ้ำด้วยเส้นโค้งการลืมของเอบบิงเฮาส์ ผลของช่วงห่าง และการเข้ารหัสคู่ พร้อมเหตุผลว่าทำไมแฟลชอย่างเดียวไม่พอและวิธีเสริม' },
        { href: '/csv-guide', t: 'วิธีทำชุดคำศัพท์ CSV', d: 'สร้างด้วย Excel/Google ชีต แก้ปัญหาตัวอักษรเพี้ยน (encoding) กรณีความหมายมีจุลภาค และหลัก 5 ข้อของการ์ดที่ดี' },
        { href: '/study-guide', t: 'กลยุทธ์การท่องศัพท์', d: 'วันละกี่คำจึงพอดี ทบทวนเมื่อไร และทำไม "อ่านซ้ำ" จึงเสียเวลา พร้อมตัวอย่างแผน 4 สัปดาห์' },
        { href: '/spaced-repetition', t: 'คู่มือ Spaced Repetition ฉบับสมบูรณ์', d: 'เปรียบเทียบกล่องไลต์เนอร์ → SM-2 (Anki) → FSRS เหตุผลที่แบบแฟลชสละการปรับให้เฉพาะบุคคล และเมื่อไรควรใช้ Anki' },
        { href: '/tts-pronunciation', t: 'จำการออกเสียงด้วย TTS', d: 'ความต่างของแต่ละภาษา: อังกฤษ·ฝรั่งเศส (สะกดกับเสียงไม่ตรง) จีน (วรรณยุกต์) ญี่ปุ่น (การอ่านคันจิ) และการตั้งช่วงสำหรับ shadowing' },
        { href: '/exam-vocabulary', t: 'กลยุทธ์ออกแบบชุดคำศัพท์ตามข้อสอบ', d: 'ข้อสอบเข้ามหาวิทยาลัย TOEIC TOEFL HSK ต้องการทักษะคำศัพท์ต่างกัน — เหตุผลที่หน้า-หลังการ์ดควรต่างกันตามข้อสอบ' },
        { href: '/about', t: 'แนะนำผู้พัฒนา · เหตุผลที่สร้าง', d: 'ใครเป็นคนทำ ทำไมข้อมูลไม่ถูกส่งไปเซิร์ฟเวอร์ โมเดลรายได้และการเปิดเผยผลประโยชน์ทับซ้อน' }
      ]
    },
    es: {
      title: 'Memorizador de vocabulario — Repetición automática desde CSV',
      intro: 'VOCA DECK es un memorizador de vocabulario gratuito de tipo «destello» que presenta palabras y significados en sucesión rápida para que los memorices por asociación visual. La palabra aparece arriba y el significado abajo, en letras grandes, repitiéndose automáticamente en el intervalo elegido (3 segundos por defecto). Funciona en el navegador sin instalación ni registro.',
      howH: 'Cómo se usa',
      how: [
        'Abrir mazo — abre tu propio archivo CSV. Cada línea es "palabra,significado" (2 columnas, filas ilimitadas); los espacios se recortan automáticamente y las líneas vacías se ignoran.',
        'Fuente / fondo — se recomienda una fuente grande y llamativa (amarillo en negrita) sobre fondo azul marino oscuro o negro.',
        'Manual/Auto — el modo automático avanza según el intervalo (segundos); el manual, con la barra espaciadora o el botón Siguiente. Una pulsación muestra la palabra arriba, otra revela el significado abajo, y otra pasa a la siguiente palabra.',
        'Ocultar panel — una vez configurado, oculta el panel y estudia con la pantalla maximizada.'
      ],
      featH: 'Funciones principales',
      feat: [
        'Orden — hacia delante, hacia atrás o aleatorio',
        'Rango — omitir memorizadas / solo memorizadas / todas',
        'Marcas — marca las palabras aprendidas para excluirlas de la repetición; restablécelas cuando quieras',
        'A↔B — alterna entre palabra→significado y significado→palabra',
        'TTS — lectura en voz alta con síntesis de voz del navegador (modo solo voz)',
        'Número inicial — empieza desde cualquier posición'
      ],
      faqH: 'Preguntas frecuentes',
      faq: [
        { q: '¿Qué es la memorización por destellos?', a: 'Es un método que presenta palabras y significados en sucesión rápida para memorizar vocabulario por asociación visual en poco tiempo. La palabra aparece primero en grande, luego el significado, y la repetición refuerza el vínculo entre ambos.' },
        { q: '¿Qué formato tiene el archivo del mazo?', a: "Un archivo CSV. Cada línea es 'palabra,significado': dos columnas separadas por coma, sin límite de filas. Los espacios se recortan automáticamente y las líneas vacías se ignoran. Puedes crearlo en Excel, Numbers o cualquier editor de texto." },
        { q: '¿Puedo cambiar el intervalo de reproducción automática?', a: 'Sí. Ajusta el intervalo (segundos) en el panel de control; el valor por defecto es 3 segundos. En modo manual, avanza paso a paso con la barra espaciadora o el botón Siguiente.' },
        { q: '¿VOCA DECK es gratis? ¿Dónde se guardan mis datos?', a: 'Las funciones básicas son gratuitas: abre tu propio mazo CSV y memoriza sin instalación ni registro. Las funciones avanzadas como los mazos de ejemplo, el editor CSV, Mis Voca Decks y la eliminación de anuncios se ofrecen como premium. El mazo y las marcas se guardan solo en el localStorage de tu navegador y nunca se envían a un servidor.' },
        { q: '¿Funciona en el móvil?', a: 'Sí. Está optimizado para navegadores móviles: desliza a izquierda o derecha para pasar de tarjeta, y hay una opción para mantener la pantalla encendida durante la reproducción automática. No hace falta instalar ninguna app.' },
        { q: '¿Qué idiomas puedo estudiar?', a: 'El contenido del mazo no tiene límites: cualquier idioma que escribas en el CSV se muestra tal cual. La interfaz y los mazos de ejemplo admiten 13 idiomas: coreano, inglés, japonés, chino (simplificado/tradicional), tailandés, español, francés, alemán, italiano, portugués, ruso y neerlandés.' },
        { q: '¿Puedo cambiar la voz y la velocidad del TTS?', a: 'Sí. En los ajustes avanzados puedes elegir el idioma y la voz de la cara A y la cara B entre las voces instaladas en tu navegador, y ajustar la velocidad de lectura (0,5–2,0x), el volumen, las repeticiones y el objetivo de lectura (solo cara A / solo cara B / ambas).' },
        { q: '¿Puedo usarlo sin conexión a internet?', a: 'El mazo abierto y las marcas se guardan en el navegador, así que si la página ya está abierta puedes seguir estudiando sin conexión. Solo se necesita internet para volver a cargar la página.' }
      ],
      whoH: '¿Para quién es?',
      who: [
        'Estudiantes de secundaria que necesitan repasar el vocabulario de examen varias veces en poco tiempo: recorrer 100 palabras al día lleva unos 10 minutos.',
        'Aspirantes a TOEIC, TOEFL, JLPT, HSK o DELE que deben repetir el vocabulario más frecuente de cada examen.',
        'Universitarios y profesionales que memorizan grandes cantidades de términos técnicos: medicina, derecho, informática u oposiciones.',
        'Quienes quieren repasar en el móvil durante el trayecto: la interfaz y los gestos de deslizamiento están optimizados para móvil.',
        'Profesores y padres que quieren crear un mazo en un solo CSV y repartirlo a alumnos o hijos.'
      ],
      tipH: 'Consejos para mejorar los resultados',
      tips: [
        'No intentes memorizarlo todo de una vez: repasa el mismo mazo 3–5 veces breves al día. La clave del método es la exposición breve y repetida.',
        'Marca las palabras aprendidas de inmediato y pon el rango en «omitir memorizadas»: cada vuelta dedicará el tiempo solo a las que aún no sabes.',
        'Practica también la dirección significado→palabra con el interruptor A↔B. Reconocer una palabra y recordarla son habilidades distintas.',
        'En idiomas donde la ortografía y la pronunciación difieren (inglés, francés) o con tonos (chino), activa el TTS y aprende también de oído. La voz y la velocidad se ajustan en la configuración avanzada.',
        'Diez minutos antes de dormir y diez al despertar son los repasos más eficientes. La guía «Estrategia de estudio» de abajo explica por qué.'
      ],
      sampH: 'Mazos de ejemplo y mazos propios',
      sampP: 'El tablón de ejemplos bajo la app ofrece vocabulario común por nivel CEFR (A1–B2, avanzado, académico) y mazos por examen como TOEIC, JLPT y HSK: aplícalos al instante o descarga el CSV y edítalo. Funciona cualquier combinación de los 13 idiomas: un anglohablante estudiando japonés, un coreanohablante estudiando español, etc. En el editor CSV puedes crear tu mazo en una hoja de dos columnas como en Excel y guardarlo en Mis Voca Decks para usarlo cuando quieras.',
      readH: 'Lectura en profundidad — guías originales',
      readP: 'Guías escritas a mano sobre por qué funciona la memorización por destellos, cómo diseñar un mazo y cuántas palabras al día son realistas.',
      guides: [
        { href: '/method', t: 'Cómo funciona la memorización por destellos', d: 'La curva del olvido de Ebbinghaus, el efecto de espaciado y la doble codificación; por qué los destellos solos no bastan y cómo compensarlo.' },
        { href: '/csv-guide', t: 'Cómo crear un mazo CSV', d: 'Crear en Excel o Google Sheets, resolver problemas de codificación, comas dentro del significado y 5 principios de una buena tarjeta.' },
        { href: '/study-guide', t: 'Estrategia de estudio de vocabulario', d: 'Cuántas palabras al día, cuándo repasar y por qué «releer» es perder el tiempo. Incluye un plan de 4 semanas de ejemplo.' },
        { href: '/spaced-repetition', t: 'Guía completa de la repetición espaciada', d: 'Cajas de Leitner → SM-2 (Anki) → FSRS comparados. Por qué este método renuncia a la personalización y cuándo conviene usar Anki.' },
        { href: '/tts-pronunciation', t: 'Memoriza también la pronunciación con TTS', d: 'Diferencias por idioma: inglés/francés (desajuste ortografía–sonido), chino (tonos), japonés (lecturas de kanji). Configuración del intervalo para shadowing.' },
        { href: '/exam-vocabulary', t: 'Diseño del mazo según el examen', d: 'Selectividad, TOEIC, TOEFL y HSK exigen destrezas léxicas distintas: por qué el anverso y el reverso deben cambiar según el examen.' },
        { href: '/about', t: 'Sobre el operador', d: 'Quién lo creó, por qué tus datos nunca salen del navegador, el modelo de ingresos y la declaración de conflictos de interés.' }
      ]
    },
    fr: {
      title: 'Mémorisation de vocabulaire — Répétition automatique depuis CSV',
      intro: 'VOCA DECK est un outil gratuit de mémorisation de vocabulaire « par flashs » : mots et sens défilent à l’écran pour une mémorisation par association visuelle en peu de temps. Le mot s’affiche en haut, le sens en bas, en grands caractères, avec répétition automatique à l’intervalle choisi (3 secondes par défaut). Fonctionne dans le navigateur, sans installation ni inscription.',
      howH: 'Mode d’emploi',
      how: [
        'Ouvrir un paquet — ouvrez votre fichier CSV. Chaque ligne suit le format « mot,sens » (2 colonnes, lignes illimitées) ; les espaces sont supprimés automatiquement et les lignes vides ignorées.',
        'Police / fond — une grande police bien visible (jaune gras) sur fond bleu marine foncé ou noir est recommandée.',
        'Manuel/Auto — le mode auto avance selon l’intervalle (secondes) ; le mode manuel avec la barre d’espace ou le bouton Suivant. Une pression affiche le mot en haut, une autre révèle le sens en bas, une autre passe au mot suivant.',
        'Masquer le panneau — une fois réglé, masquez le panneau et étudiez en plein écran.'
      ],
      featH: 'Fonctionnalités',
      feat: [
        'Ordre — avant, arrière ou aléatoire',
        'Plage — exclure les mémorisés / mémorisés seuls / tous',
        'Marques — marquez les mots appris pour les exclure de la répétition ; réinitialisable à tout moment',
        'A↔B — bascule mot→sens et sens→mot',
        'TTS — lecture à voix haute par synthèse vocale du navigateur (mode voix seule)',
        'Numéro de départ — commencez à n’importe quelle position'
      ],
      faqH: 'FAQ',
      faq: [
        { q: 'Qu’est-ce que la mémorisation par flashs ?', a: 'C’est une méthode qui présente mots et sens en succession rapide pour mémoriser le vocabulaire par association visuelle en peu de temps. Le mot s’affiche d’abord en grand, puis son sens, et la répétition renforce le lien entre les deux.' },
        { q: 'Quel est le format du fichier ?', a: "Un fichier CSV. Chaque ligne suit le format « mot,sens » : deux colonnes séparées par une virgule, sans limite de lignes. Les espaces sont supprimés automatiquement et les lignes vides ignorées. Créez-le dans Excel, Numbers ou tout éditeur de texte." },
        { q: 'Peut-on changer l’intervalle de lecture automatique ?', a: 'Oui. Réglez l’intervalle (secondes) dans le panneau de contrôle ; la valeur par défaut est 3 secondes. En mode manuel, avancez pas à pas avec la barre d’espace ou le bouton Suivant.' },
        { q: 'VOCA DECK est-il gratuit ? Où sont stockées mes données ?', a: 'Les fonctions de base sont gratuites : ouvrez votre propre paquet CSV et mémorisez sans installation ni inscription. Les fonctions avancées comme les paquets d’exemple, l’éditeur CSV, Mes Voca Decks et la suppression des publicités sont proposées en premium. Le paquet et les marques sont stockés uniquement dans le localStorage de votre navigateur et ne sont jamais envoyés à un serveur.' },
        { q: 'Fonctionne-t-il sur smartphone ?', a: 'Oui. L’outil est optimisé pour les navigateurs mobiles : balayez vers la gauche ou la droite pour changer de carte, et une option garde l’écran allumé pendant la lecture automatique. Aucune application à installer.' },
        { q: 'Quelles langues puis-je étudier ?', a: 'Le contenu du paquet est sans limite : toute langue écrite dans le CSV s’affiche telle quelle. L’interface et les paquets d’exemple prennent en charge 13 langues : coréen, anglais, japonais, chinois (simplifié/traditionnel), thaï, espagnol, français, allemand, italien, portugais, russe et néerlandais.' },
        { q: 'Peut-on changer la voix et la vitesse du TTS ?', a: 'Oui. Dans les réglages avancés, choisissez la langue et la voix des faces A et B parmi les voix installées dans votre navigateur, et ajustez la vitesse de lecture (0,5–2,0x), le volume, le nombre de répétitions et la cible de lecture (face A seule / face B seule / les deux).' },
        { q: 'Peut-on l’utiliser sans connexion internet ?', a: 'Le paquet ouvert et les marques sont stockés dans le navigateur : si la page est déjà ouverte, vous pouvez continuer à réviser hors ligne. La connexion n’est nécessaire que pour recharger la page.' }
      ],
      whoH: 'Pour qui ?',
      who: [
        'Collégiens et lycéens qui doivent faire tourner le vocabulaire d’examen plusieurs fois en peu de temps — parcourir 100 mots par jour prend environ 10 minutes.',
        'Candidats au TOEIC, TOEFL, JLPT, HSK ou DELE qui doivent répéter le vocabulaire le plus fréquent de chaque examen.',
        'Étudiants et professionnels qui mémorisent de grandes quantités de termes techniques : médecine, droit, informatique ou concours.',
        'Ceux qui veulent réviser légèrement sur leur téléphone pendant les trajets — l’interface et les gestes de balayage sont optimisés pour le mobile.',
        'Enseignants et parents qui veulent créer un paquet dans un seul fichier CSV et le distribuer aux élèves ou aux enfants.'
      ],
      tipH: 'Conseils pour de meilleurs résultats',
      tips: [
        'N’essayez pas de tout mémoriser d’un coup : refaites le même paquet 3 à 5 fois par jour, brièvement. La clé de la méthode est l’exposition brève et répétée.',
        'Marquez immédiatement les mots appris et réglez la plage sur « exclure les mémorisés » : chaque passage ne consacre du temps qu’aux mots encore inconnus.',
        'Entraînez aussi le sens→mot avec l’interrupteur A↔B. Reconnaître un mot et s’en souvenir sont deux compétences distinctes.',
        'Pour les langues où orthographe et prononciation divergent (anglais, français) ou à tons (chinois), activez le TTS et apprenez aussi avec les oreilles. Voix et vitesse se règlent dans les paramètres avancés.',
        'Dix minutes avant de dormir et dix minutes au réveil sont les créneaux de révision les plus efficaces. Le guide « Stratégie d’apprentissage » ci-dessous explique pourquoi.'
      ],
      sampH: 'Paquets d’exemple et paquets personnels',
      sampP: 'Le tableau d’exemples sous l’appli propose du vocabulaire commun par niveau CECR (A1–B2, avancé, académique) et des paquets par examen comme TOEIC, JLPT et HSK — appliquez-les instantanément ou téléchargez le CSV pour le modifier. Toute combinaison des 13 langues fonctionne : un anglophone étudiant le japonais, un coréanophone étudiant l’espagnol, etc. L’éditeur CSV permet de créer un paquet dans une feuille à deux colonnes comme un tableur et de l’enregistrer dans Mes Voca Decks pour plus tard.',
      readH: 'Pour aller plus loin — guides originaux',
      readP: 'Des guides rédigés à la main : pourquoi la mémorisation par flashs fonctionne, comment concevoir un paquet, combien de mots par jour est réaliste.',
      guides: [
        { href: '/method', t: 'Le principe de la mémorisation par flashs', d: 'La courbe de l’oubli d’Ebbinghaus, l’effet d’espacement et le double codage — et pourquoi les flashs seuls ne suffisent pas, avec les compléments.' },
        { href: '/csv-guide', t: 'Créer un paquet CSV', d: 'Création dans Excel ou Google Sheets, résolution des problèmes d’encodage, virgules dans les sens, et 5 principes d’une bonne carte.' },
        { href: '/study-guide', t: 'Stratégie d’apprentissage du vocabulaire', d: 'Combien de mots par jour, quand réviser, et pourquoi « relire » est une perte de temps. Avec un exemple de plan sur 4 semaines.' },
        { href: '/spaced-repetition', t: 'Guide complet de la répétition espacée', d: 'Boîtes de Leitner → SM-2 (Anki) → FSRS comparés. Pourquoi la méthode renonce à la personnalisation et quand préférer Anki.' },
        { href: '/tts-pronunciation', t: 'Mémoriser aussi la prononciation avec le TTS', d: 'Différences selon les langues : anglais/français (écart orthographe–son), chinois (tons), japonais (lectures des kanjis). Réglage de l’intervalle pour le shadowing.' },
        { href: '/exam-vocabulary', t: 'Concevoir son paquet selon l’examen', d: 'Bac, TOEIC, TOEFL et HSK exigent des compétences lexicales différentes — pourquoi le recto et le verso doivent changer selon l’examen.' },
        { href: '/about', t: 'À propos de l’opérateur', d: 'Qui l’a créé, pourquoi vos données ne quittent jamais le navigateur, le modèle de revenus et la déclaration de conflits d’intérêts.' }
      ]
    },
    de: {
      title: 'Vokabeltrainer mit Blitzanzeige — CSV-Autowiederholung',
      intro: 'VOCA DECK ist ein kostenloser Vokabeltrainer im „Blitz“-Stil: Wörter und Bedeutungen erscheinen in schneller Folge auf dem Bildschirm, sodass du sie in kurzer Zeit über visuelle Assoziation einprägst. Oben das Wort, unten die Bedeutung in großer Schrift, automatisch wiederholt im gewählten Intervall (Standard 3 Sekunden). Läuft im Browser ohne Installation und Registrierung.',
      howH: 'Bedienung',
      how: [
        'Deck öffnen — öffne deine eigene CSV-Datei. Jede Zeile ist "Wort,Bedeutung" (2 Spalten, unbegrenzte Zeilen); Leerzeichen werden automatisch entfernt, Leerzeilen ignoriert.',
        'Schrift / Hintergrund — empfohlen ist eine große, auffällige Schrift (fettes Gelb) auf dunklem Marineblau oder Schwarz.',
        'Manuell/Auto — der Auto-Modus läuft im gewählten Intervall (Sekunden); manuell geht es mit Leertaste oder Weiter-Button. Ein Druck zeigt das Wort oben, ein weiterer die Bedeutung unten, der nächste springt zum nächsten Wort.',
        'Panel ausblenden — nach der Einrichtung das Panel ausblenden und mit maximierter Anzeige lernen.'
      ],
      featH: 'Funktionen',
      feat: [
        'Reihenfolge — vorwärts, rückwärts oder zufällig',
        'Bereich — Gemerkte auslassen / nur gemerkte / alle',
        'Merk-Markierung — gelernte Wörter markieren und von der Wiederholung ausschließen; jederzeit zurücksetzbar',
        'A↔B — Wechsel zwischen Wort→Bedeutung und Bedeutung→Wort',
        'TTS — Vorlesen per Browser-Sprachsynthese (Nur-Ton-Modus)',
        'Startnummer — an beliebiger Position beginnen'
      ],
      faqH: 'Häufige Fragen',
      faq: [
        { q: 'Was ist Blitz-Memorieren?', a: 'Eine Methode, bei der Wörter und Bedeutungen in schneller Folge gezeigt werden, sodass man Vokabeln in kurzer Zeit über visuelle Assoziation einprägt. Erst erscheint das Wort groß, dann die Bedeutung — die Wiederholung stärkt die Verbindung zwischen beiden.' },
        { q: 'Welches Format hat die Deck-Datei?', a: 'Eine CSV-Datei. Jede Zeile ist "Wort,Bedeutung" — zwei Spalten, durch Komma getrennt, ohne Zeilenlimit. Leerzeichen werden automatisch entfernt, Leerzeilen ignoriert. Erstellbar in Excel, Numbers oder jedem Texteditor.' },
        { q: 'Kann ich das Autoplay-Intervall ändern?', a: 'Ja. Stelle das Intervall (Sekunden) im Bedienfeld ein; Standard sind 3 Sekunden. Im manuellen Modus geht es mit Leertaste oder Weiter-Button Schritt für Schritt voran.' },
        { q: 'Ist VOCA DECK kostenlos? Wo werden meine Daten gespeichert?', a: 'Die Grundfunktionen sind kostenlos: eigenes CSV-Deck öffnen und lernen, ohne Installation und Registrierung. Erweiterte Funktionen wie Beispiel-Decks, der CSV-Editor, Meine Voca Decks und Werbefreiheit werden als Premium angeboten. Dein Deck und die Markierungen liegen nur im localStorage deines Browsers und werden nie an einen Server gesendet.' },
        { q: 'Funktioniert es auf dem Smartphone?', a: 'Ja. Der Trainer ist für mobile Browser optimiert: Wische nach links oder rechts, um die Karte zu wechseln; eine Option hält den Bildschirm während der automatischen Wiedergabe an. Keine App-Installation nötig.' },
        { q: 'Welche Sprachen kann ich lernen?', a: 'Der Deck-Inhalt ist unbegrenzt — jede Sprache, die du in die CSV schreibst, wird so angezeigt. Oberfläche und Beispiel-Decks unterstützen 13 Sprachen: Koreanisch, Englisch, Japanisch, Chinesisch (vereinfacht/traditionell), Thai, Spanisch, Französisch, Deutsch, Italienisch, Portugiesisch, Russisch und Niederländisch.' },
        { q: 'Kann ich Stimme und Tempo der Sprachausgabe ändern?', a: 'Ja. In den erweiterten Einstellungen wählst du für Seite A und Seite B jeweils Sprache und Stimme aus den im Browser installierten Stimmen und stellst Lesetempo (0,5–2,0x), Lautstärke, Wiederholungen und Vorlese-Ziel (nur A / nur B / beide) ein.' },
        { q: 'Geht es auch ohne Internetverbindung?', a: 'Das geöffnete Deck und die Markierungen liegen im Browser — ist die Seite bereits geöffnet, kannst du offline weiterlernen. Nur zum Neuladen der Seite ist eine Verbindung nötig.' }
      ],
      whoH: 'Für wen ist es?',
      who: [
        'Schülerinnen und Schüler, die Prüfungsvokabeln in kurzer Zeit mehrfach durchgehen wollen — 100 Wörter pro Tag zu überfliegen dauert etwa 10 Minuten.',
        'Prüflinge für TOEIC, TOEFL, JLPT, HSK oder DELE, die die häufigsten Prüfungsvokabeln wiederholen müssen.',
        'Studierende und Berufstätige, die große Mengen Fachbegriffe lernen — Medizin, Jura, IT oder Zertifikatsprüfungen.',
        'Lernende, die unterwegs auf dem Handy leicht wiederholen wollen — Layout und Wischgesten sind für Mobilgeräte optimiert.',
        'Lehrkräfte und Eltern, die ein Deck in einer einzigen CSV-Datei erstellen und an Schüler oder Kinder verteilen möchten.'
      ],
      tipH: 'Tipps für bessere Ergebnisse',
      tips: [
        'Versuche nicht, alles auf einmal zu lernen: Gehe dasselbe Deck 3–5 Mal täglich kurz durch. Der Kern der Methode ist die kurze, wiederholte Exposition.',
        'Markiere gelernte Wörter sofort und stelle den Bereich auf „Gemerkte auslassen“ — jede Runde widmet die Zeit nur noch den unbekannten Wörtern.',
        'Übe mit dem A↔B-Schalter auch die Richtung Bedeutung→Wort. Ein Wort erkennen und es abrufen sind zwei verschiedene Fähigkeiten.',
        'Bei Sprachen mit Abweichung von Schrift und Laut (Englisch, Französisch) oder Tonsprachen (Chinesisch) schalte TTS ein und lerne auch mit den Ohren. Stimme und Tempo änderst du in den erweiterten Einstellungen.',
        'Zehn Minuten vor dem Schlafen und zehn nach dem Aufwachen sind die effizientesten Wiederholungszeiten. Warum, erklärt der Guide „Lernstrategie“ unten.'
      ],
      sampH: 'Beispiel-Decks und eigene Decks',
      sampP: 'Das Beispiel-Board unter der App bietet Grundwortschatz nach GER-Niveau (A1–B2, fortgeschritten, akademisch) sowie Prüfungs-Decks wie TOEIC, JLPT und HSK — sofort anwenden oder als CSV herunterladen und bearbeiten. Jede Kombination der 13 Sprachen funktioniert: ein englischer Muttersprachler lernt Japanisch, ein koreanischer lernt Spanisch usw. Im CSV-Editor baust du ein Deck in einer zweispaltigen Tabelle wie in Excel und speicherst es in Meine Voca Decks für später.',
      readH: 'Vertiefende Lektüre — Original-Guides',
      readP: 'Selbst geschriebene Guides: warum Blitz-Memorieren funktioniert, wie man ein Deck gestaltet und wie viele Wörter pro Tag realistisch sind.',
      guides: [
        { href: '/method', t: 'Wie Blitz-Memorieren funktioniert', d: 'Ebbinghaus’ Vergessenskurve, der Spacing-Effekt und duale Codierung — und warum Blitzen allein nicht reicht, samt Ausgleichsstrategien.' },
        { href: '/csv-guide', t: 'Ein CSV-Deck erstellen', d: 'Erstellen in Excel oder Google Sheets, Encoding-Probleme lösen, Kommas in Bedeutungen und 5 Prinzipien einer guten Karte.' },
        { href: '/study-guide', t: 'Lernstrategie für Vokabeln', d: 'Wie viele Wörter pro Tag, wann wiederholen und warum „nochmal lesen“ Zeitverschwendung ist. Mit 4-Wochen-Beispielplan.' },
        { href: '/spaced-repetition', t: 'Kompletter Guide zur Spaced Repetition', d: 'Leitner-Boxen → SM-2 (Anki) → FSRS im Vergleich. Warum die Methode auf Personalisierung verzichtet und wann Anki besser ist.' },
        { href: '/tts-pronunciation', t: 'Mit TTS auch die Aussprache lernen', d: 'Unterschiede je Sprache: Englisch/Französisch (Schrift-Laut-Abweichung), Chinesisch (Töne), Japanisch (Kanji-Lesungen). Intervall-Einstellung fürs Shadowing.' },
        { href: '/exam-vocabulary', t: 'Deck-Design je nach Prüfung', d: 'Abitur, TOEIC, TOEFL und HSK verlangen unterschiedliche Wortschatzfähigkeiten — warum Vorder- und Rückseite je Prüfung anders sein sollten.' },
        { href: '/about', t: 'Über den Betreiber', d: 'Wer es gebaut hat, warum deine Daten den Browser nie verlassen, das Erlösmodell und die Offenlegung von Interessenkonflikten.' }
      ]
    },
    it: {
      title: 'Memorizzatore di vocaboli — Ripetizione automatica da CSV',
      intro: 'VOCA DECK è un memorizzatore di vocaboli gratuito «a lampi»: parole e significati si susseguono sullo schermo per memorizzarli tramite associazione visiva in poco tempo. La parola appare in alto e il significato in basso, a caratteri grandi, con ripetizione automatica all’intervallo scelto (3 secondi di default). Funziona nel browser senza installazione né registrazione.',
      howH: 'Come si usa',
      how: [
        'Apri mazzo — apri il tuo file CSV. Ogni riga è "parola,significato" (2 colonne, righe illimitate); gli spazi vengono rimossi automaticamente e le righe vuote ignorate.',
        'Carattere / sfondo — si consiglia un carattere grande e ben visibile (giallo in grassetto) su sfondo blu scuro o nero.',
        'Manuale/Auto — la modalità auto avanza secondo l’intervallo (secondi); quella manuale con la barra spaziatrice o il pulsante Avanti. Una pressione mostra la parola in alto, un’altra rivela il significato in basso, un’altra passa alla parola successiva.',
        'Nascondi pannello — dopo la configurazione, nascondi il pannello e studia a schermo massimizzato.'
      ],
      featH: 'Funzioni principali',
      feat: [
        'Ordine — in avanti, all’indietro o casuale',
        'Ambito — salta memorizzate / solo memorizzate / tutte',
        'Contrassegni — segna le parole imparate per escluderle dalla ripetizione; azzerabile in qualsiasi momento',
        'A↔B — alterna parola→significato e significato→parola',
        'TTS — lettura ad alta voce con la sintesi vocale del browser (modalità solo voce)',
        'Numero iniziale — inizia da qualsiasi posizione'
      ],
      faqH: 'Domande frequenti',
      faq: [
        { q: 'Che cos’è la memorizzazione a lampi?', a: 'È un metodo che presenta parole e significati in rapida successione per memorizzare il lessico tramite associazione visiva in poco tempo. Prima appare la parola in grande, poi il significato, e la ripetizione rafforza il legame tra i due.' },
        { q: 'Che formato ha il file del mazzo?', a: "Un file CSV. Ogni riga è 'parola,significato': due colonne separate da virgola, senza limite di righe. Gli spazi vengono rimossi automaticamente e le righe vuote ignorate. Puoi crearlo con Excel, Numbers o qualsiasi editor di testo." },
        { q: 'Posso cambiare l’intervallo di riproduzione automatica?', a: 'Sì. Regola l’intervallo (secondi) nel pannello di controllo; il valore predefinito è 3 secondi. In modalità manuale avanzi un passo alla volta con la barra spaziatrice o il pulsante Avanti.' },
        { q: 'VOCA DECK è gratuito? Dove sono salvati i miei dati?', a: 'Le funzioni di base sono gratuite: apri il tuo mazzo CSV e memorizza senza installazione né registrazione. Le funzioni avanzate come i mazzi di esempio, l’editor CSV, I miei Voca Deck e la rimozione della pubblicità sono offerte come premium. Il mazzo e i contrassegni sono salvati solo nel localStorage del tuo browser e non vengono mai inviati a un server.' },
        { q: 'Funziona sullo smartphone?', a: 'Sì. È ottimizzato per i browser mobili: scorri a sinistra o a destra per cambiare scheda, e un’opzione mantiene lo schermo acceso durante la riproduzione automatica. Non serve installare alcuna app.' },
        { q: 'Quali lingue posso studiare?', a: 'Il contenuto del mazzo non ha limiti: qualsiasi lingua scritta nel CSV viene mostrata così com’è. L’interfaccia e i mazzi di esempio supportano 13 lingue: coreano, inglese, giapponese, cinese (semplificato/tradizionale), thailandese, spagnolo, francese, tedesco, italiano, portoghese, russo e olandese.' },
        { q: 'Posso cambiare voce e velocità del TTS?', a: 'Sì. Nelle impostazioni avanzate puoi scegliere lingua e voce per il lato A e il lato B tra le voci installate nel browser, e regolare la velocità di lettura (0,5–2,0x), il volume, le ripetizioni e il bersaglio di lettura (solo lato A / solo lato B / entrambi).' },
        { q: 'Posso usarlo senza connessione a internet?', a: 'Il mazzo aperto e i contrassegni sono salvati nel browser: se la pagina è già aperta puoi continuare a studiare offline. La connessione serve solo per ricaricare la pagina.' }
      ],
      whoH: 'A chi è rivolto?',
      who: [
        'Studenti delle superiori che devono ripassare il lessico d’esame più volte in poco tempo: scorrere 100 parole al giorno richiede circa 10 minuti.',
        'Candidati a TOEIC, TOEFL, JLPT, HSK o DELE che devono ripetere il vocabolario più frequente di ciascun esame.',
        'Universitari e professionisti che memorizzano grandi quantità di termini tecnici: medicina, diritto, informatica o certificazioni.',
        'Chi vuole ripassare in modo leggero sul telefono durante gli spostamenti: layout e gesti di scorrimento sono ottimizzati per il mobile.',
        'Insegnanti e genitori che vogliono creare un mazzo in un solo file CSV e distribuirlo a studenti o figli.'
      ],
      tipH: 'Consigli per risultati migliori',
      tips: [
        'Non cercare di memorizzare tutto in una volta: ripassa lo stesso mazzo 3–5 volte al giorno, brevemente. Il cuore del metodo è l’esposizione breve e ripetuta.',
        'Contrassegna subito le parole imparate e imposta l’ambito su «salta memorizzate»: ogni giro dedicherà tempo solo alle parole che ancora non sai.',
        'Allena anche la direzione significato→parola con l’interruttore A↔B. Riconoscere una parola e richiamarla sono abilità diverse.',
        'Per le lingue in cui grafia e pronuncia divergono (inglese, francese) o tonali (cinese), attiva il TTS e impara anche con le orecchie. Voce e velocità si regolano nelle impostazioni avanzate.',
        'Dieci minuti prima di dormire e dieci al risveglio sono i ripassi più efficienti. La guida «Strategia di studio» qui sotto spiega perché.'
      ],
      sampH: 'Mazzi di esempio e mazzi personali',
      sampP: 'La bacheca degli esempi sotto l’app offre lessico comune per livello QCER (A1–B2, avanzato, accademico) e mazzi per esame come TOEIC, JLPT e HSK: applicali all’istante o scarica il CSV e modificalo. Funziona qualsiasi combinazione delle 13 lingue: un anglofono che studia giapponese, un coreano che studia spagnolo, e così via. Nell’editor CSV crei il mazzo in un foglio a due colonne come in Excel e lo salvi ne I miei Voca Deck per riutilizzarlo.',
      readH: 'Approfondimenti — guide originali',
      readP: 'Guide scritte a mano: perché la memorizzazione a lampi funziona, come progettare un mazzo e quante parole al giorno sono realistiche.',
      guides: [
        { href: '/method', t: 'Come funziona la memorizzazione a lampi', d: 'La curva dell’oblio di Ebbinghaus, l’effetto spaziatura e la doppia codifica — e perché i lampi da soli non bastano, con i rimedi.' },
        { href: '/csv-guide', t: 'Come creare un mazzo CSV', d: 'Creazione in Excel o Google Fogli, soluzione dei problemi di codifica, virgole nei significati e 5 principi di una buona scheda.' },
        { href: '/study-guide', t: 'Strategia di studio del lessico', d: 'Quante parole al giorno, quando ripassare e perché «rileggere» è tempo perso. Include un piano di 4 settimane di esempio.' },
        { href: '/spaced-repetition', t: 'Guida completa alla ripetizione dilazionata', d: 'Scatole di Leitner → SM-2 (Anki) → FSRS a confronto. Perché il metodo rinuncia alla personalizzazione e quando conviene Anki.' },
        { href: '/tts-pronunciation', t: 'Memorizza anche la pronuncia con il TTS', d: 'Differenze per lingua: inglese/francese (scarto grafia–suono), cinese (toni), giapponese (letture dei kanji). Impostazione dell’intervallo per lo shadowing.' },
        { href: '/exam-vocabulary', t: 'Progettare il mazzo secondo l’esame', d: 'Maturità, TOEIC, TOEFL e HSK richiedono abilità lessicali diverse: perché fronte e retro devono cambiare a seconda dell’esame.' },
        { href: '/about', t: 'Chi c’è dietro', d: 'Chi l’ha creato, perché i tuoi dati non lasciano mai il browser, il modello di ricavi e la dichiarazione sui conflitti di interesse.' }
      ]
    },
    pt: {
      title: 'Memorizador de vocabulário — Repetição automática de CSV',
      intro: 'O VOCA DECK é um memorizador de vocabulário gratuito do tipo «flash»: palavras e significados surgem em sucessão rápida no ecrã para memorizares por associação visual em pouco tempo. A palavra aparece em cima e o significado em baixo, em letras grandes, repetindo automaticamente no intervalo escolhido (3 segundos por defeito). Funciona no navegador sem instalação nem registo.',
      howH: 'Como usar',
      how: [
        'Abrir baralho — abre o teu ficheiro CSV. Cada linha é "palavra,significado" (2 colunas, linhas ilimitadas); os espaços são removidos automaticamente e as linhas vazias ignoradas.',
        'Fonte / fundo — recomenda-se uma fonte grande e vistosa (amarelo em negrito) sobre fundo azul-escuro ou preto.',
        'Manual/Auto — o modo automático avança no intervalo (segundos); o manual com a barra de espaço ou o botão Próximo. Uma pressão mostra a palavra em cima, outra revela o significado em baixo, outra passa à palavra seguinte.',
        'Ocultar painel — depois de configurar, oculta o painel e estuda com o ecrã maximizado.'
      ],
      featH: 'Funcionalidades',
      feat: [
        'Ordem — para a frente, para trás ou aleatória',
        'Âmbito — omitir memorizadas / só memorizadas / todas',
        'Marcas — marca as palavras aprendidas para as excluir da repetição; repõe quando quiseres',
        'A↔B — alterna palavra→significado e significado→palavra',
        'TTS — leitura em voz alta com síntese de voz do navegador (modo só voz)',
        'Número inicial — começa em qualquer posição'
      ],
      faqH: 'Perguntas frequentes',
      faq: [
        { q: 'O que é a memorização flash?', a: 'É um método que apresenta palavras e significados em sucessão rápida para memorizar vocabulário por associação visual em pouco tempo. A palavra aparece primeiro em grande, depois o significado, e a repetição reforça a ligação entre ambos.' },
        { q: 'Qual é o formato do ficheiro?', a: "Um ficheiro CSV. Cada linha é 'palavra,significado': duas colunas separadas por vírgula, sem limite de linhas. Os espaços são removidos automaticamente e as linhas vazias ignoradas. Podes criá-lo no Excel, Numbers ou em qualquer editor de texto." },
        { q: 'Posso mudar o intervalo de reprodução automática?', a: 'Sim. Ajusta o intervalo (segundos) no painel de controlo; o valor por defeito é 3 segundos. No modo manual, avanças passo a passo com a barra de espaço ou o botão Próximo.' },
        { q: 'O VOCA DECK é gratuito? Onde ficam os meus dados?', a: 'As funções básicas são gratuitas: abre o teu próprio baralho CSV e memoriza sem instalação nem registo. As funções avançadas como os baralhos de exemplo, o editor CSV, Os meus Voca Decks e a remoção de anúncios são oferecidas como premium. O baralho e as marcas ficam apenas no localStorage do teu navegador e nunca são enviados para um servidor.' },
        { q: 'Funciona no smartphone?', a: 'Sim. Está otimizado para navegadores móveis: desliza para a esquerda ou direita para mudar de cartão, e há uma opção que mantém o ecrã ligado durante a reprodução automática. Não é preciso instalar nenhuma app.' },
        { q: 'Que línguas posso estudar?', a: 'O conteúdo do baralho não tem limites: qualquer língua escrita no CSV é mostrada tal como está. A interface e os baralhos de exemplo suportam 13 línguas: coreano, inglês, japonês, chinês (simplificado/tradicional), tailandês, espanhol, francês, alemão, italiano, português, russo e neerlandês.' },
        { q: 'Posso mudar a voz e a velocidade do TTS?', a: 'Sim. Nas definições avançadas podes escolher a língua e a voz do lado A e do lado B entre as vozes instaladas no navegador, e ajustar a velocidade de leitura (0,5–2,0x), o volume, as repetições e o alvo de leitura (só lado A / só lado B / ambos).' },
        { q: 'Posso usar sem ligação à internet?', a: 'O baralho aberto e as marcas ficam guardados no navegador: se a página já estiver aberta, podes continuar a estudar offline. A ligação só é necessária para voltar a carregar a página.' }
      ],
      whoH: 'Para quem é?',
      who: [
        'Estudantes do secundário que precisam de rever o vocabulário de exame várias vezes em pouco tempo — percorrer 100 palavras por dia leva cerca de 10 minutos.',
        'Candidatos ao TOEIC, TOEFL, JLPT, HSK ou DELE que têm de repetir o vocabulário mais frequente de cada exame.',
        'Universitários e profissionais que memorizam grandes quantidades de termos técnicos: medicina, direito, informática ou certificações.',
        'Quem quer rever de forma leve no telemóvel durante o trajeto — o layout e os gestos de deslize estão otimizados para mobile.',
        'Professores e pais que querem criar um baralho num único CSV e distribuí-lo a alunos ou filhos.'
      ],
      tipH: 'Dicas para melhores resultados',
      tips: [
        'Não tentes memorizar tudo de uma vez: repete o mesmo baralho 3–5 vezes por dia, brevemente. O coração do método é a exposição breve e repetida.',
        'Marca logo as palavras aprendidas e define o âmbito para «omitir memorizadas»: cada volta gasta tempo apenas nas palavras que ainda não sabes.',
        'Treina também a direção significado→palavra com o interruptor A↔B. Reconhecer uma palavra e evocá-la são capacidades diferentes.',
        'Em línguas onde a grafia e a pronúncia divergem (inglês, francês) ou tonais (chinês), liga o TTS e aprende também de ouvido. A voz e a velocidade ajustam-se nas definições avançadas.',
        'Dez minutos antes de dormir e dez ao acordar são as revisões mais eficientes. O guia «Estratégia de estudo» abaixo explica porquê.'
      ],
      sampH: 'Baralhos de exemplo e baralhos próprios',
      sampP: 'O quadro de exemplos por baixo da app oferece vocabulário comum por nível QECR (A1–B2, avançado, académico) e baralhos por exame como TOEIC, JLPT e HSK — aplica-os de imediato ou descarrega o CSV e edita-o. Qualquer combinação das 13 línguas funciona: um anglófono a estudar japonês, um coreano a estudar espanhol, etc. No editor CSV crias o baralho numa folha de duas colunas como no Excel e guarda-lo em Os meus Voca Decks para mais tarde.',
      readH: 'Leitura aprofundada — guias originais',
      readP: 'Guias escritos à mão: porque funciona a memorização flash, como desenhar um baralho e quantas palavras por dia são realistas.',
      guides: [
        { href: '/method', t: 'Como funciona a memorização flash', d: 'A curva do esquecimento de Ebbinghaus, o efeito de espaçamento e a dupla codificação — e porque o flash sozinho não chega, com as compensações.' },
        { href: '/csv-guide', t: 'Como criar um baralho CSV', d: 'Criação no Excel ou Google Sheets, resolução de problemas de codificação, vírgulas nos significados e 5 princípios de um bom cartão.' },
        { href: '/study-guide', t: 'Estratégia de estudo de vocabulário', d: 'Quantas palavras por dia, quando rever e porque «reler» é perda de tempo. Inclui um plano de 4 semanas de exemplo.' },
        { href: '/spaced-repetition', t: 'Guia completo da repetição espaçada', d: 'Caixas de Leitner → SM-2 (Anki) → FSRS comparados. Porque o método abdica da personalização e quando convém usar o Anki.' },
        { href: '/tts-pronunciation', t: 'Memoriza também a pronúncia com TTS', d: 'Diferenças por língua: inglês/francês (desfasamento grafia–som), chinês (tons), japonês (leituras de kanji). Configuração do intervalo para shadowing.' },
        { href: '/exam-vocabulary', t: 'Desenhar o baralho consoante o exame', d: 'Exames de acesso, TOEIC, TOEFL e HSK exigem competências lexicais diferentes — porque a frente e o verso devem mudar consoante o exame.' },
        { href: '/about', t: 'Sobre o operador', d: 'Quem o criou, porque os teus dados nunca saem do navegador, o modelo de receitas e a divulgação de conflitos de interesse.' }
      ]
    },
    ru: {
      title: 'Тренажёр слов — автоповтор из CSV',
      intro: 'VOCA DECK — бесплатный тренажёр слов в стиле «вспышек»: слова и значения быстро сменяют друг друга на экране, и вы запоминаете лексику через зрительные ассоциации за короткое время. Слово показывается сверху, значение — снизу, крупным шрифтом, с автоповтором через выбранный интервал (по умолчанию 3 секунды). Работает в браузере без установки и регистрации.',
      howH: 'Как пользоваться',
      how: [
        'Открыть набор — откройте свой CSV-файл. Каждая строка — «слово,значение» (2 колонки, число строк не ограничено); пробелы по краям убираются автоматически, пустые строки игнорируются.',
        'Шрифт / фон — рекомендуется крупный заметный шрифт (жирный жёлтый) на тёмно-синем или чёрном фоне.',
        'Ручной/Авто — авторежим листает с заданным интервалом (секунды); ручной — пробелом или кнопкой «Далее». Первое нажатие показывает слово сверху, второе — значение снизу, третье — переходит к следующему слову.',
        'Скрыть панель — после настройки скройте панель и занимайтесь на развёрнутом экране.'
      ],
      featH: 'Возможности',
      feat: [
        'Порядок — вперёд, назад или случайно',
        'Диапазон — пропускать выученные / только выученные / все',
        'Отметки — помечайте выученные слова, чтобы исключить их из повторения; сброс в любой момент',
        'A↔B — переключение слово→значение и значение→слово',
        'TTS — озвучка средствами браузера (режим «только звук»)',
        'Начальный номер — начинайте с любой позиции'
      ],
      faqH: 'Частые вопросы',
      faq: [
        { q: 'Что такое запоминание «вспышками»?', a: 'Это метод, при котором слова и значения быстро сменяют друг друга на экране, и лексика запоминается через зрительные ассоциации за короткое время. Сначала крупно показывается слово, затем значение — повторение укрепляет связь между ними.' },
        { q: 'Какой формат у файла набора?', a: 'CSV-файл. Каждая строка — «слово,значение»: две колонки через запятую, без ограничения по числу строк. Пробелы убираются автоматически, пустые строки игнорируются. Создать можно в Excel, Numbers или любом текстовом редакторе.' },
        { q: 'Можно ли изменить интервал автопоказа?', a: 'Да. Настройте интервал (секунды) на панели управления; по умолчанию 3 секунды. В ручном режиме листайте по шагу пробелом или кнопкой «Далее».' },
        { q: 'VOCA DECK бесплатен? Где хранятся мои данные?', a: 'Базовые функции бесплатны: открывайте свой CSV-набор и заучивайте без установки и регистрации. Расширенные функции — примерные наборы, редактор CSV, «Мои Voca Deck» и отключение рекламы — предоставляются в премиум-версии. Набор и отметки хранятся только в localStorage вашего браузера и никогда не отправляются на сервер.' },
        { q: 'Работает ли на смартфоне?', a: 'Да. Тренажёр оптимизирован для мобильных браузеров: листайте карточки свайпом влево-вправо, а специальная опция не даёт экрану гаснуть во время автопоказа. Устанавливать приложение не нужно.' },
        { q: 'Какие языки можно учить?', a: 'Содержимое набора не ограничено — любой язык, записанный в CSV, отображается как есть. Интерфейс и примерные наборы поддерживают 13 языков: корейский, английский, японский, китайский (упрощённый/традиционный), тайский, испанский, французский, немецкий, итальянский, португальский, русский и нидерландский.' },
        { q: 'Можно ли сменить голос и скорость озвучки?', a: 'Да. В расширенных настройках для стороны A и стороны B можно выбрать язык и голос из установленных в браузере, а также настроить скорость чтения (0,5–2,0x), громкость, число повторов и цель озвучки (только A / только B / обе).' },
        { q: 'Можно ли пользоваться без интернета?', a: 'Открытый набор и отметки хранятся в браузере: если страница уже открыта, продолжать заниматься можно офлайн. Подключение нужно только для повторной загрузки страницы.' }
      ],
      whoH: 'Кому подойдёт',
      who: [
        'Школьникам, которым нужно быстро прокручивать экзаменационную лексику по несколько раз — просмотр 100 слов в день занимает около 10 минут.',
        'Готовящимся к TOEIC, TOEFL, JLPT, HSK или DELE, кому нужно повторять частотную лексику конкретного экзамена.',
        'Студентам и специалистам, заучивающим большие объёмы терминов — медицина, право, ИТ, сертификационные экзамены.',
        'Тем, кто хочет легко повторять слова с телефона в дороге — интерфейс и свайпы оптимизированы для мобильных устройств.',
        'Учителям и родителям, которые хотят собрать набор в одном CSV-файле и раздать ученикам или детям.'
      ],
      tipH: 'Советы для лучшего результата',
      tips: [
        'Не пытайтесь выучить всё за один раз: проходите один и тот же набор коротко 3–5 раз в день. Суть метода — краткие повторные показы.',
        'Сразу отмечайте выученные слова и ставьте диапазон «пропускать выученные» — с каждым кругом время тратится только на незнакомые слова.',
        'Тренируйте и направление значение→слово переключателем A↔B. Узнать слово и вспомнить его — разные навыки.',
        'Для языков с расхождением написания и звучания (английский, французский) и тональных (китайский) включайте озвучку и учите также на слух. Голос и скорость настраиваются в расширенных настройках.',
        'Десять минут перед сном и десять после пробуждения — самые эффективные окна для повторения. Почему — объясняет гид «Стратегия обучения» ниже.'
      ],
      sampH: 'Примерные наборы и собственные наборы',
      sampP: 'Доска примеров под приложением содержит базовую лексику по уровням CEFR (A1–B2, продвинутый, академический) и экзаменационные наборы TOEIC, JLPT, HSK — применяйте сразу или скачивайте CSV и редактируйте. Работает любая пара из 13 языков: англоговорящий учит японский, кореец — испанский и так далее. В редакторе CSV набор собирается в двухколоночной таблице, как в Excel, и сохраняется в «Мои Voca Deck» на будущее.',
      readH: 'Читать глубже — авторские гиды',
      readP: 'Собственные гиды: почему метод «вспышек» работает, как проектировать набор и сколько слов в день реально выучить.',
      guides: [
        { href: '/method', t: 'Как работает запоминание «вспышками»', d: 'Кривая забывания Эббингауза, эффект интервалов и двойное кодирование — и почему одних «вспышек» мало, с способами компенсации.' },
        { href: '/csv-guide', t: 'Как сделать CSV-набор', d: 'Создание в Excel и Google Таблицах, решение проблем с кодировкой, запятые внутри значений и 5 принципов хорошей карточки.' },
        { href: '/study-guide', t: 'Стратегия изучения слов', d: 'Сколько слов в день, когда повторять и почему «перечитывание» — потеря времени. С примером плана на 4 недели.' },
        { href: '/spaced-repetition', t: 'Полный гид по интервальному повторению', d: 'Коробки Лейтнера → SM-2 (Anki) → FSRS в сравнении. Почему метод отказался от персонализации и когда стоит взять Anki.' },
        { href: '/tts-pronunciation', t: 'Запоминайте и произношение с TTS', d: 'Различия языков: английский/французский (расхождение письма и звука), китайский (тоны), японский (чтения кандзи). Настройка интервала для шедоуинга.' },
        { href: '/exam-vocabulary', t: 'Дизайн набора под экзамен', d: 'ЕГЭ, TOEIC, TOEFL и HSK требуют разных лексических навыков — почему лицевая и обратная стороны карточек должны меняться под экзамен.' },
        { href: '/about', t: 'О создателе', d: 'Кто это сделал, почему данные не покидают браузер, модель дохода и раскрытие конфликта интересов.' }
      ]
    },
    nl: {
      title: 'Woordjes stampen — automatisch herhalen uit CSV',
      intro: 'VOCA DECK is een gratis «flits»-woordjestrainer: woorden en betekenissen volgen elkaar snel op het scherm op, zodat je ze in korte tijd via visuele associatie onthoudt. Het woord staat boven, de betekenis onder, in grote letters, automatisch herhaald met het gekozen interval (standaard 3 seconden). Werkt in de browser zonder installatie of registratie.',
      howH: 'Zo werkt het',
      how: [
        'Deck openen — open je eigen CSV-bestand. Elke regel is "woord,betekenis" (2 kolommen, onbeperkt aantal regels); spaties worden automatisch verwijderd en lege regels genegeerd.',
        'Lettertype / achtergrond — een groot, opvallend lettertype (vet geel) op donker marineblauw of zwart wordt aanbevolen.',
        'Handmatig/Auto — de automodus gaat verder volgens het interval (seconden); handmatig met de spatiebalk of de knop Volgende. Eén druk toont het woord boven, nog één onthult de betekenis onder, en nog één gaat naar het volgende woord.',
        'Paneel verbergen — verberg na het instellen het paneel en studeer met een gemaximaliseerd scherm.'
      ],
      featH: 'Functies',
      feat: [
        'Volgorde — vooruit, achteruit of willekeurig',
        'Bereik — geleerde overslaan / alleen geleerde / alle',
        'Markeringen — markeer geleerde woorden om ze uit de herhaling te halen; altijd te wissen',
        'A↔B — wissel tussen woord→betekenis en betekenis→woord',
        'TTS — voorlezen met de spraaksynthese van de browser (alleen-geluid-modus)',
        'Startnummer — begin op elke gewenste positie'
      ],
      faqH: 'Veelgestelde vragen',
      faq: [
        { q: 'Wat is flits-memorisatie?', a: 'Een methode waarbij woorden en betekenissen elkaar snel opvolgen op het scherm, zodat je woordenschat in korte tijd via visuele associatie onthoudt. Eerst verschijnt het woord groot, daarna de betekenis — de herhaling versterkt de koppeling tussen beide.' },
        { q: 'Welk formaat heeft het deck-bestand?', a: 'Een CSV-bestand. Elke regel is "woord,betekenis": twee kolommen gescheiden door een komma, zonder regellimiet. Spaties worden automatisch verwijderd en lege regels genegeerd. Te maken in Excel, Numbers of elke teksteditor.' },
        { q: 'Kan ik het afspeelinterval wijzigen?', a: 'Ja. Stel het interval (seconden) in op het bedieningspaneel; de standaard is 3 seconden. In handmatige modus ga je stap voor stap verder met de spatiebalk of de knop Volgende.' },
        { q: 'Is VOCA DECK gratis? Waar worden mijn gegevens opgeslagen?', a: 'De basisfuncties zijn gratis: open je eigen CSV-deck en stamp zonder installatie of registratie. Geavanceerde functies zoals voorbeelddecks, de CSV-editor, Mijn Voca Decks en het verwijderen van advertenties worden als premium aangeboden. Je deck en markeringen staan alleen in de localStorage van je browser en worden nooit naar een server gestuurd.' },
        { q: 'Werkt het op een smartphone?', a: 'Ja. De trainer is geoptimaliseerd voor mobiele browsers: veeg naar links of rechts om van kaart te wisselen, en een optie houdt het scherm aan tijdens automatisch afspelen. Er hoeft geen app geïnstalleerd te worden.' },
        { q: 'Welke talen kan ik leren?', a: 'De inhoud van het deck is onbeperkt — elke taal die je in de CSV zet, wordt zo weergegeven. De interface en voorbeelddecks ondersteunen 13 talen: Koreaans, Engels, Japans, Chinees (vereenvoudigd/traditioneel), Thais, Spaans, Frans, Duits, Italiaans, Portugees, Russisch en Nederlands.' },
        { q: 'Kan ik de stem en snelheid van de TTS wijzigen?', a: 'Ja. In de geavanceerde instellingen kies je per kant (A en B) de taal en stem uit de in je browser geïnstalleerde stemmen, en stel je leessnelheid (0,5–2,0x), volume, aantal herhalingen en het voorleesdoel (alleen A / alleen B / beide) in.' },
        { q: 'Kan ik het zonder internetverbinding gebruiken?', a: 'Je geopende deck en markeringen staan in de browser: als de pagina al open is, kun je offline verder stampen. Alleen om de pagina opnieuw te laden is verbinding nodig.' }
      ],
      whoH: 'Voor wie is het?',
      who: [
        'Scholieren die examenwoorden in korte tijd meerdere keren willen doornemen — 100 woorden per dag scannen kost zo’n 10 minuten.',
        'Kandidaten voor TOEIC, TOEFL, JLPT, HSK of DELE die de meest voorkomende examenwoorden moeten herhalen.',
        'Studenten en professionals die grote hoeveelheden vaktermen stampen — geneeskunde, recht, IT of certificeringsexamens.',
        'Leerlingen die onderweg licht willen herhalen op hun telefoon — de lay-out en veeggebaren zijn geoptimaliseerd voor mobiel.',
        'Docenten en ouders die een deck in één CSV-bestand willen maken en uitdelen aan leerlingen of kinderen.'
      ],
      tipH: 'Tips voor betere resultaten',
      tips: [
        'Probeer niet alles in één keer te onthouden: loop hetzelfde deck 3–5 keer per dag kort door. De kern van de methode is korte, herhaalde blootstelling.',
        'Markeer geleerde woorden meteen en zet het bereik op “geleerde overslaan” — elke ronde besteedt de tijd dan alleen aan woorden die je nog niet kent.',
        'Oefen met de A↔B-schakelaar ook de richting betekenis→woord. Een woord herkennen en het oproepen zijn verschillende vaardigheden.',
        'Bij talen waar spelling en klank uiteenlopen (Engels, Frans) of toontalen (Chinees): zet TTS aan en leer ook op het gehoor. Stem en snelheid stel je in bij de geavanceerde instellingen.',
        'Tien minuten voor het slapen en tien na het opstaan zijn de efficiëntste herhaalmomenten. Waarom, lees je in de gids “Leerstrategie” hieronder.'
      ],
      sampH: 'Voorbeelddecks en eigen decks',
      sampP: 'Het voorbeeldenbord onder de app biedt basiswoordenschat per ERK-niveau (A1–B2, gevorderd, academisch) en examendecks zoals TOEIC, JLPT en HSK — direct toepassen of de CSV downloaden en bewerken. Elke combinatie van de 13 talen werkt: een Engelstalige die Japans leert, een Koreaan die Spaans leert, enzovoort. In de CSV-editor bouw je een deck in een tweekolomsblad zoals in Excel en sla je het op in Mijn Voca Decks voor later.',
      readH: 'Verder lezen — originele gidsen',
      readP: 'Zelfgeschreven gidsen: waarom flits-memorisatie werkt, hoe je een deck ontwerpt en hoeveel woorden per dag realistisch is.',
      guides: [
        { href: '/method', t: 'Hoe flits-memorisatie werkt', d: 'De vergeetcurve van Ebbinghaus, het spreidingseffect en dubbele codering — en waarom flitsen alleen niet genoeg is, met compensaties.' },
        { href: '/csv-guide', t: 'Een CSV-deck maken', d: 'Maken in Excel of Google Spreadsheets, coderingsproblemen oplossen, komma’s in betekenissen en 5 principes van een goede kaart.' },
        { href: '/study-guide', t: 'Leerstrategie voor woordenschat', d: 'Hoeveel woorden per dag, wanneer herhalen en waarom “herlezen” tijdverspilling is. Met een voorbeeldplan van 4 weken.' },
        { href: '/spaced-repetition', t: 'Complete gids voor spaced repetition', d: 'Leitner-dozen → SM-2 (Anki) → FSRS vergeleken. Waarom de methode personalisatie opgeeft en wanneer je beter Anki gebruikt.' },
        { href: '/tts-pronunciation', t: 'Ook de uitspraak onthouden met TTS', d: 'Verschillen per taal: Engels/Frans (kloof spelling–klank), Chinees (tonen), Japans (kanji-lezingen). Interval instellen voor shadowing.' },
        { href: '/exam-vocabulary', t: 'Deckontwerp per examen', d: 'Eindexamen, TOEIC, TOEFL en HSK vragen verschillende woordenschatvaardigheden — waarom voor- en achterkant per examen moeten verschillen.' },
        { href: '/about', t: 'Over de maker', d: 'Wie het bouwde, waarom je gegevens de browser nooit verlaten, het verdienmodel en de belangenverstrengelingsverklaring.' }
      ]
    }
  };

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function build(d) {
    var li = function (a) { return a.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join(''); };
    var qa = function (a) { return a.map(function (x) { return '<dt>' + esc(x.q) + '</dt><dd>' + esc(x.a) + '</dd>'; }).join(''); };
    var gd = function (a) {
      return a.map(function (g) {
        return '<li><a href="' + g.href + '"><strong>' + esc(g.t) + '</strong></a> — ' + esc(g.d) + '</li>';
      }).join('');
    };
    return '<h1>' + esc(d.title) + '</h1>' +
      '<p>' + esc(d.intro) + '</p>' +
      '<h2>' + esc(d.howH) + '</h2><ol>' + li(d.how) + '</ol>' +
      '<h2>' + esc(d.featH) + '</h2><ul>' + li(d.feat) + '</ul>' +
      (d.whoH ? '<h2>' + esc(d.whoH) + '</h2><ul>' + li(d.who) + '</ul>' : '') +
      (d.tipH ? '<h2>' + esc(d.tipH) + '</h2><ul>' + li(d.tips) + '</ul>' : '') +
      (d.sampH ? '<h2>' + esc(d.sampH) + '</h2><p>' + esc(d.sampP) + '</p>' : '') +
      '<h2>' + esc(d.faqH) + '</h2><dl>' + qa(d.faq) + '</dl>' +
      (d.readH ? '<h2>' + esc(d.readH) + '</h2><p>' + esc(d.readP) + '</p><ul class="seo-guides">' + gd(d.guides) + '</ul>' : '');
  }

  window.SEO_I18N = SEO;
  window.renderSEO = function (lang) {
    try {
      var d = SEO[lang] || SEO.en;
      var sec = document.querySelector('section.seo');
      if (sec) { sec.innerHTML = build(d); sec.setAttribute('lang', lang); }
    } catch (e) {}
  };
})();
