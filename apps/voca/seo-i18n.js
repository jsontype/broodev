/* 하단 SEO 본문 다국어 데이터 + 렌더러 (btc의 seo-i18n.js 컨벤션).
   언어 전환 시 window.renderSEO(lang) 호출 → section.seo 를 해당 언어로 다시 그림.
   기본 정적 HTML(한국어)은 무JS 크롤러용 폴백으로 남겨두고, JS 실행 시 현재 언어로 교체. */
(function () {
  var SEO = {
    ko: {
      title: '깜빡이 단어암기장 — CSV 자동 반복 암기',
      intro: 'VOCA_DECK은 어휘와 의미를 화면에 연속적으로 제시해 단기간에 이미지 연상으로 어휘를 암기하게 하는 깜빡이 방식의 무료 단어암기장입니다. 위쪽에는 단어, 아래쪽에는 의미가 큰 글자로 표시되며, 설정한 간격(기본 3초)으로 자동 반복 재생됩니다. 설치·회원가입 없이 브라우저에서 바로 실행됩니다.',
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
        { q: 'VOCA_DECK은 무료인가요? 데이터는 어디에 저장되나요?', a: '완전 무료이며 설치와 회원가입이 필요 없습니다. 열어둔 암기장과 암기 표시는 사용 중인 브라우저의 localStorage에만 저장되며 서버로 전송되지 않습니다.' }
      ]
    },
    en: {
      title: 'Flashing Vocabulary Memorizer — Auto-repeat CSV decks',
      intro: 'VOCA_DECK is a free “flashing” vocabulary memorizer that presents words and meanings in rapid succession so you memorize them through visual association. The word appears on top and its meaning below, in large type, auto-repeating at your chosen interval (default 3 seconds). Runs in the browser with no install or sign-up.',
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
        { q: 'Is VOCA_DECK free? Where is my data stored?', a: 'Completely free, with no install or sign-up. Your open deck and memorized marks are stored only in your browser’s localStorage and are never sent to a server.' }
      ]
    },
    ja: {
      title: '点滅式単語暗記 — CSV自動リピート',
      intro: 'VOCA_DECKは、単語と意味を画面に連続提示し、短期間でイメージ連想により語彙を暗記させる「点滅式」の無料単語暗記ツールです。上に単語、下に意味が大きな文字で表示され、設定した間隔（既定3秒）で自動リピート再生されます。インストール・会員登録不要でブラウザから即実行できます。',
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
        { q: 'VOCA_DECKは無料？データはどこに保存されますか？', a: '完全無料で、インストールも会員登録も不要です。開いた単語帳と暗記マークは使用中のブラウザのlocalStorageにのみ保存され、サーバーには送信されません。' }
      ]
    },
    zh: {
      title: '闪示单词记忆 — CSV自动循环',
      intro: 'VOCA_DECK是一款免费的“闪示式”单词记忆工具：将单词与释义连续呈现在屏幕上，让你在短时间内通过图像联想记住词汇。上方显示单词、下方显示释义，均为大字号，并按设定间隔（默认3秒）自动循环播放。无需安装和注册，浏览器即开即用。',
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
        { q: 'VOCA_DECK免费吗？数据保存在哪里？', a: '完全免费，无需安装和注册。打开的单词本与已记标记只保存在你浏览器的localStorage中，不会发送到服务器。' }
      ]
    },
    'zh-Hant': {
      title: '閃示單字記憶 — CSV自動循環',
      intro: 'VOCA_DECK是一款免費的「閃示式」單字記憶工具：將單字與釋義連續呈現在螢幕上，讓你在短時間內透過圖像聯想記住詞彙。上方顯示單字、下方顯示釋義，皆為大字級，並依設定間隔（預設3秒）自動循環播放。免安裝、免註冊，瀏覽器即開即用。',
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
        { q: 'VOCA_DECK免費嗎？資料儲存在哪裡？', a: '完全免費，免安裝、免註冊。開啟的單字本與已記標記只儲存在你瀏覽器的localStorage中，不會傳送到伺服器。' }
      ]
    },
    th: {
      title: 'ท่องศัพท์แบบแฟลช — เล่นซ้ำอัตโนมัติจาก CSV',
      intro: 'VOCA_DECK คือเครื่องมือท่องศัพท์ฟรีแบบ “แฟลช” ที่แสดงคำและความหมายต่อเนื่องบนหน้าจอ ให้คุณจดจำคำศัพท์ผ่านการเชื่อมโยงภาพในเวลาสั้นๆ คำอยู่ด้านบน ความหมายอยู่ด้านล่างด้วยตัวอักษรขนาดใหญ่ เล่นซ้ำอัตโนมัติตามช่วงเวลาที่ตั้ง (ค่าเริ่มต้น 3 วินาที) ใช้ในเบราว์เซอร์ได้ทันที ไม่ต้องติดตั้งหรือสมัครสมาชิก',
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
        { q: 'VOCA_DECK ฟรีไหม? ข้อมูลเก็บที่ไหน?', a: 'ฟรีทั้งหมด ไม่ต้องติดตั้งหรือสมัครสมาชิก ชุดคำศัพท์และเครื่องหมายจำถูกเก็บใน localStorage ของเบราว์เซอร์ของคุณเท่านั้น ไม่ถูกส่งไปยังเซิร์ฟเวอร์' }
      ]
    },
    es: {
      title: 'Memorizador de vocabulario — Repetición automática desde CSV',
      intro: 'VOCA_DECK es un memorizador de vocabulario gratuito de tipo «destello» que presenta palabras y significados en sucesión rápida para que los memorices por asociación visual. La palabra aparece arriba y el significado abajo, en letras grandes, repitiéndose automáticamente en el intervalo elegido (3 segundos por defecto). Funciona en el navegador sin instalación ni registro.',
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
        { q: '¿VOCA_DECK es gratis? ¿Dónde se guardan mis datos?', a: 'Totalmente gratis, sin instalación ni registro. El mazo abierto y las marcas se guardan solo en el localStorage de tu navegador y nunca se envían a un servidor.' }
      ]
    },
    fr: {
      title: 'Mémorisation de vocabulaire — Répétition automatique depuis CSV',
      intro: 'VOCA_DECK est un outil gratuit de mémorisation de vocabulaire « par flashs » : mots et sens défilent à l’écran pour une mémorisation par association visuelle en peu de temps. Le mot s’affiche en haut, le sens en bas, en grands caractères, avec répétition automatique à l’intervalle choisi (3 secondes par défaut). Fonctionne dans le navigateur, sans installation ni inscription.',
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
        { q: 'VOCA_DECK est-il gratuit ? Où sont stockées mes données ?', a: 'Entièrement gratuit, sans installation ni inscription. Le paquet ouvert et les marques sont stockés uniquement dans le localStorage de votre navigateur et ne sont jamais envoyés à un serveur.' }
      ]
    },
    de: {
      title: 'Vokabeltrainer mit Blitzanzeige — CSV-Autowiederholung',
      intro: 'VOCA_DECK ist ein kostenloser Vokabeltrainer im „Blitz“-Stil: Wörter und Bedeutungen erscheinen in schneller Folge auf dem Bildschirm, sodass du sie in kurzer Zeit über visuelle Assoziation einprägst. Oben das Wort, unten die Bedeutung in großer Schrift, automatisch wiederholt im gewählten Intervall (Standard 3 Sekunden). Läuft im Browser ohne Installation und Registrierung.',
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
        { q: 'Ist VOCA_DECK kostenlos? Wo werden meine Daten gespeichert?', a: 'Völlig kostenlos, ohne Installation und Registrierung. Dein geöffnetes Deck und die Markierungen liegen nur im localStorage deines Browsers und werden nie an einen Server gesendet.' }
      ]
    },
    it: {
      title: 'Memorizzatore di vocaboli — Ripetizione automatica da CSV',
      intro: 'VOCA_DECK è un memorizzatore di vocaboli gratuito «a lampi»: parole e significati si susseguono sullo schermo per memorizzarli tramite associazione visiva in poco tempo. La parola appare in alto e il significato in basso, a caratteri grandi, con ripetizione automatica all’intervallo scelto (3 secondi di default). Funziona nel browser senza installazione né registrazione.',
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
        { q: 'VOCA_DECK è gratuito? Dove sono salvati i miei dati?', a: 'Completamente gratuito, senza installazione né registrazione. Il mazzo aperto e i contrassegni sono salvati solo nel localStorage del tuo browser e non vengono mai inviati a un server.' }
      ]
    },
    pt: {
      title: 'Memorizador de vocabulário — Repetição automática de CSV',
      intro: 'O VOCA_DECK é um memorizador de vocabulário gratuito do tipo «flash»: palavras e significados surgem em sucessão rápida no ecrã para memorizares por associação visual em pouco tempo. A palavra aparece em cima e o significado em baixo, em letras grandes, repetindo automaticamente no intervalo escolhido (3 segundos por defeito). Funciona no navegador sem instalação nem registo.',
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
        { q: 'O VOCA_DECK é gratuito? Onde ficam os meus dados?', a: 'Totalmente gratuito, sem instalação nem registo. O baralho aberto e as marcas ficam apenas no localStorage do teu navegador e nunca são enviados para um servidor.' }
      ]
    },
    ru: {
      title: 'Тренажёр слов — автоповтор из CSV',
      intro: 'VOCA_DECK — бесплатный тренажёр слов в стиле «вспышек»: слова и значения быстро сменяют друг друга на экране, и вы запоминаете лексику через зрительные ассоциации за короткое время. Слово показывается сверху, значение — снизу, крупным шрифтом, с автоповтором через выбранный интервал (по умолчанию 3 секунды). Работает в браузере без установки и регистрации.',
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
        { q: 'VOCA_DECK бесплатен? Где хранятся мои данные?', a: 'Полностью бесплатен, без установки и регистрации. Открытый набор и отметки хранятся только в localStorage вашего браузера и никогда не отправляются на сервер.' }
      ]
    },
    nl: {
      title: 'Woordjes stampen — automatisch herhalen uit CSV',
      intro: 'VOCA_DECK is een gratis «flits»-woordjestrainer: woorden en betekenissen volgen elkaar snel op het scherm op, zodat je ze in korte tijd via visuele associatie onthoudt. Het woord staat boven, de betekenis onder, in grote letters, automatisch herhaald met het gekozen interval (standaard 3 seconden). Werkt in de browser zonder installatie of registratie.',
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
        { q: 'Is VOCA_DECK gratis? Waar worden mijn gegevens opgeslagen?', a: 'Volledig gratis, zonder installatie of registratie. Je geopende deck en markeringen staan alleen in de localStorage van je browser en worden nooit naar een server gestuurd.' }
      ]
    }
  };

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function build(d) {
    var li = function (a) { return a.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join(''); };
    var qa = function (a) { return a.map(function (x) { return '<dt>' + esc(x.q) + '</dt><dd>' + esc(x.a) + '</dd>'; }).join(''); };
    return '<h1>' + esc(d.title) + '</h1>' +
      '<p>' + esc(d.intro) + '</p>' +
      '<h2>' + esc(d.howH) + '</h2><ol>' + li(d.how) + '</ol>' +
      '<h2>' + esc(d.featH) + '</h2><ul>' + li(d.feat) + '</ul>' +
      '<h2>' + esc(d.faqH) + '</h2><dl>' + qa(d.faq) + '</dl>';
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
