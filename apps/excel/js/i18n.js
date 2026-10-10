/* SHEET (excel.broodev.com) — 13개 언어 사전.
   U  = 앱 화면 문구 · XS = x-spreadsheet 툴바/컨텍스트 메뉴 사전 · SEO = 정적 사용법/FAQ 본문(JSON-LD FAQPage 와 같은 원문).
   누락 키는 en 으로 폴백. 브랜드명(SHEET)·파일 확장자·함수 이름(SUM 등)은 번역하지 않는다.
   DOM 에 의존하지 않는 순수 스크립트 — 브라우저(window.SheetI18n)와 Node 검증(vm) 양쪽에서 읽힌다. */
(function (root) {
  'use strict';

  var LANGS = ['en', 'ko', 'ja', 'zh', 'zh-Hant', 'th', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'nl'];
  var NATIVE = { en: 'English', ko: '한국어', ja: '日本語', zh: '简体中文', 'zh-Hant': '繁體中文', th: 'ไทย', es: 'Español', fr: 'Français', de: 'Deutsch', it: 'Italiano', pt: 'Português', ru: 'Русский', nl: 'Nederlands' };
  var HTML_LANG = { zh: 'zh-Hans' };
  var INTL = { zh: 'zh-CN', 'zh-Hant': 'zh-TW' };
  var OG_LOCALE = { en: 'en_US', ko: 'ko_KR', ja: 'ja_JP', zh: 'zh_CN', 'zh-Hant': 'zh_TW', th: 'th_TH', es: 'es_ES', fr: 'fr_FR', de: 'de_DE', it: 'it_IT', pt: 'pt_BR', ru: 'ru_RU', nl: 'nl_NL' };
  var STORAGE_KEY = 'excel:lang';

  /* ===================================================================== 앱 화면 문구 */
  var U = {
    en: {
      appName: 'Spreadsheet Editor (Excel-compatible)', appShort: 'Spreadsheet Editor',
      books: 'Workbooks', booksTitle: 'My workbooks', newBook: 'New', newBookTip: 'Create a new workbook',
      importFile: 'Import', importTip: 'Open an .xlsx or .csv file',
      exportMenu: 'Export', exXlsx: 'Excel workbook (.xlsx)', exCsv: 'CSV — current sheet (.csv)', exPdf: 'PDF — current sheet (.pdf)',
      print: 'Print', printTip: 'Print the grid only — you can also choose “Save as PDF” in the print dialog',
      open: 'Open', rename: 'Rename', del: 'Delete', cancel: 'Cancel', ok: 'OK', close: 'Close',
      untitled: 'Book {n}', sheetWord: 'Sheet', conflictSuffix: '(conflict copy)',
      renameTitle: 'Rename workbook', nameLabel: 'Name', delTitle: 'Delete workbook',
      delConfirm: 'Delete “{name}”? It will be removed from this browser and from every synced device.',
      listEmpty: 'No saved workbooks yet. Type in a cell and it is saved automatically.',
      edited: 'Edited {t}', current: 'Open now', sheetsN: '{n} sheets',
      emptyHint: 'This sheet is empty — click a cell to start typing, or import an .xlsx / .csv file. Everything is saved automatically.',
      dismiss: 'Hide',
      localNote: 'Auto-save: your work is stored only in this browser (per device, like cookies). To continue on another PC, turn on Google account sync.',
      fxLabel: 'Formula bar', fxPh: 'Type a value or formula (e.g. =SUM(A1:A3))', cellRef: 'Selected cell',
      st_ready: 'Auto-save on', st_saving: 'Saving…', st_savedNow: 'Saved · just now', st_savedAt: 'Saved · {t}', st_syncing: 'Syncing…', st_syncedAt: 'Synced · {t}', st_pending: 'Sync pending', st_offline: 'Offline', st_tip: 'Saved automatically in this browser',
      syncConnect: 'Sync with Google account', syncSoon: 'Google sync — coming soon', syncSoonTip: 'Google sync is still being set up by the operator. For now your workbooks are saved in this browser only.', syncOn: 'Google sync on', syncNow: 'Sync now', syncOff: 'Disconnect', syncRe: 'Reconnect', syncHelp: 'Stored only in a hidden app folder in your Google Drive — the app cannot see your other files.',
      tImported: 'Imported “{name}”', tImportFail: 'Could not read the file: {msg}', tUnsupported: 'Unsupported file type (use .xlsx or .csv)', tExported: 'Created {file}', tExportFail: 'Export failed: {msg}', tWorking: 'Preparing…',
      tTabUpdated: 'Applied changes made in another tab', tTabConflict: 'Edited in another tab at the same time — that version was kept as a copy', tTabDeleted: 'This workbook was deleted in another tab', tRemoteUpdated: 'Applied changes from another device', tConflicts: 'Kept {n} simultaneous edit(s) as “conflict copy”', tSynced: 'Synced with Google Drive', tSyncFail: 'Could not sync — your work is still saved in this browser', tPopup: 'The sign-in popup was blocked — press “Reconnect”', tDisconnected: 'Google sync disconnected (data in this browser is kept)', tDeleted: 'Deleted “{name}”', tNoStorage: 'Storage is unavailable in this browser — changes will be lost on reload',
      confirmDisconnect: 'Disconnect Google sync? Data in this browser and in Google Drive will not be deleted.',
      langLabel: 'Language', dropHint: 'Drop to import', xsTip: 'Notice',
      fTerms: 'Terms', fPrivacy: 'Privacy', fContact: 'Contact', fDev: 'About the developer',
      fDesc: 'SHEET is a free spreadsheet editor that runs in your browser with no install. Workbooks are stored only in this browser (and in your own Google Drive if you connect it) — never on our servers. Ads may be served by Google AdSense.',
      fTm: 'Microsoft Excel is a trademark of Microsoft Corporation. SHEET is not affiliated with Microsoft.',
      title: 'Spreadsheet Editor (Excel-compatible) — Free Online · xlsx · csv · pdf | SHEET',
      desc: 'Free spreadsheet editor in your browser: sheets, formulas, merged cells, formatting and auto-save. Import xlsx/csv, export xlsx/csv/pdf, sync via Google.',
      ogTitle: 'Spreadsheet Editor (Excel-compatible) | SHEET', ogDesc: 'Sheets, formulas, merged cells, formatting, auto-save, xlsx/csv/pdf export and Google sync. Free, no install.'
    },
    ko: {
      appName: '엑셀 에디터', appShort: '엑셀 에디터',
      books: '통합문서', booksTitle: '내 통합문서', newBook: '새로 만들기', newBookTip: '새 통합문서 만들기',
      importFile: '가져오기', importTip: '.xlsx 또는 .csv 파일 열기',
      exportMenu: '내보내기', exXlsx: 'Excel 통합문서 (.xlsx)', exCsv: 'CSV — 현재 시트 (.csv)', exPdf: 'PDF — 현재 시트 (.pdf)',
      print: '인쇄', printTip: '격자만 인쇄 — 인쇄 창에서 ‘PDF로 저장’도 고를 수 있습니다',
      open: '열기', rename: '이름 바꾸기', del: '삭제', cancel: '취소', ok: '확인', close: '닫기',
      untitled: '통합문서 {n}', sheetWord: '시트', conflictSuffix: '(충돌 사본)',
      renameTitle: '통합문서 이름 바꾸기', nameLabel: '이름', delTitle: '통합문서 삭제',
      delConfirm: '「{name}」을(를) 삭제할까요? 이 브라우저와 동기화된 모든 기기에서 사라집니다.',
      listEmpty: '아직 저장된 통합문서가 없습니다. 셀에 입력하면 자동으로 저장됩니다.',
      edited: '수정 {t}', current: '열림', sheetsN: '시트 {n}개',
      emptyHint: '빈 시트입니다 — 셀을 클릭해 바로 입력하거나 .xlsx / .csv 파일을 가져오세요. 입력한 내용은 자동 저장됩니다.',
      dismiss: '숨기기',
      localNote: '자동 저장: 이 브라우저에만 저장됩니다(쿠키처럼 기기별). 다른 PC에서 이어 쓰려면 Google 계정 동기화를 켜세요.',
      fxLabel: '수식 입력줄', fxPh: '값 또는 수식 입력 (예: =SUM(A1:A3))', cellRef: '선택한 셀',
      st_ready: '자동 저장 켜짐', st_saving: '저장 중…', st_savedNow: '저장됨 · 방금', st_savedAt: '저장됨 · {t}', st_syncing: '동기화 중…', st_syncedAt: '동기화됨 · {t}', st_pending: '동기화 대기 중', st_offline: '오프라인', st_tip: '이 브라우저에 자동 저장됩니다',
      syncConnect: 'Google 계정으로 동기화', syncSoon: 'Google 동기화 — 준비 중', syncSoonTip: '운영자가 Google 연동을 준비하고 있습니다. 지금은 이 브라우저에만 저장됩니다.', syncOn: 'Google 동기화 켜짐', syncNow: '지금 동기화', syncOff: '연결 해제', syncRe: '다시 연결', syncHelp: '내 Google Drive의 앱 전용 숨김 폴더에만 저장하며, 다른 파일에는 접근하지 않습니다.',
      tImported: '「{name}」을(를) 가져왔습니다', tImportFail: '파일을 읽지 못했습니다: {msg}', tUnsupported: '지원하지 않는 파일 형식입니다 (.xlsx, .csv)', tExported: '{file} 파일을 만들었습니다', tExportFail: '내보내기에 실패했습니다: {msg}', tWorking: '만드는 중…',
      tTabUpdated: '다른 탭에서 바뀐 내용을 반영했습니다', tTabConflict: '다른 탭과 동시에 수정되어 그 탭의 내용을 사본으로 보존했습니다', tTabDeleted: '다른 탭에서 이 통합문서를 삭제했습니다', tRemoteUpdated: '다른 기기에서 바뀐 내용을 반영했습니다', tConflicts: '동시에 수정된 {n}개를 「충돌 사본」으로 보존했습니다', tSynced: 'Google Drive와 동기화했습니다', tSyncFail: '동기화하지 못했습니다 — 이 브라우저에는 계속 저장됩니다', tPopup: '로그인 팝업이 차단되었습니다 — 「다시 연결」을 눌러 주세요', tDisconnected: 'Google 동기화를 해제했습니다 (이 브라우저의 데이터는 그대로입니다)', tDeleted: '「{name}」을(를) 삭제했습니다', tNoStorage: '이 브라우저에서는 저장소를 쓸 수 없어 새로고침하면 사라집니다',
      confirmDisconnect: 'Google 동기화를 해제할까요? 이 브라우저와 Google Drive의 데이터는 지워지지 않습니다.',
      langLabel: '언어', dropHint: '여기에 놓아 가져오기', xsTip: '알림',
      fTerms: '이용약관', fPrivacy: '개인정보처리방침', fContact: '문의', fDev: '개발자 소개',
      fDesc: 'SHEET는 설치 없이 브라우저에서 쓰는 무료 스프레드시트 편집기입니다. 통합문서는 이 브라우저(연결한 경우 내 Google Drive)에만 저장되며 서버로 전송되지 않습니다. 광고는 Google AdSense를 통해 게재될 수 있습니다.',
      fTm: 'Microsoft Excel은 Microsoft Corporation의 상표이며, SHEET는 Microsoft와 관련이 없습니다.',
      title: '엑셀 에디터 — 무료 온라인 스프레드시트 · xlsx · csv · pdf | SHEET',
      desc: '설치 없이 브라우저에서 쓰는 무료 엑셀 에디터. 여러 시트·수식·셀 병합·서식을 지원하고 자동 저장되며, xlsx·csv 가져오기와 xlsx·csv·pdf 내보내기, Google 계정 동기화로 다른 PC에서도 이어서 편집합니다.',
      ogTitle: '엑셀 에디터 — 무료 온라인 스프레드시트 | SHEET', ogDesc: '여러 시트·수식·병합·서식, 자동 저장, xlsx·csv·pdf 내보내기, Google 동기화. 설치 없이 무료.'
    },
    ja: {
      appName: '表計算エディタ（Excel 互換）', appShort: '表計算エディタ',
      books: 'ブック', booksTitle: 'マイブック', newBook: '新規作成', newBookTip: '新しいブックを作成',
      importFile: '読み込み', importTip: '.xlsx または .csv ファイルを開く',
      exportMenu: '書き出し', exXlsx: 'Excel ブック (.xlsx)', exCsv: 'CSV — 現在のシート (.csv)', exPdf: 'PDF — 現在のシート (.pdf)',
      print: '印刷', printTip: '表だけを印刷 — 印刷画面で「PDF に保存」も選べます',
      open: '開く', rename: '名前の変更', del: '削除', cancel: 'キャンセル', ok: 'OK', close: '閉じる',
      untitled: 'ブック {n}', sheetWord: 'シート', conflictSuffix: '（競合コピー）',
      renameTitle: 'ブック名の変更', nameLabel: '名前', delTitle: 'ブックの削除',
      delConfirm: '「{name}」を削除しますか？ このブラウザと同期中のすべての端末から消えます。',
      listEmpty: '保存されたブックはまだありません。セルに入力すると自動で保存されます。',
      edited: '更新 {t}', current: '表示中', sheetsN: '{n} シート',
      emptyHint: '空のシートです — セルをクリックして入力するか、.xlsx / .csv ファイルを読み込んでください。入力内容は自動保存されます。',
      dismiss: '非表示',
      localNote: '自動保存：このブラウザにだけ保存されます（Cookie のように端末ごと）。別の PC で続けるには Google アカウント同期をオンにしてください。',
      fxLabel: '数式バー', fxPh: '値または数式を入力（例: =SUM(A1:A3)）', cellRef: '選択中のセル',
      st_ready: '自動保存オン', st_saving: '保存中…', st_savedNow: '保存済み · たった今', st_savedAt: '保存済み · {t}', st_syncing: '同期中…', st_syncedAt: '同期済み · {t}', st_pending: '同期待ち', st_offline: 'オフライン', st_tip: 'このブラウザに自動保存されます',
      syncConnect: 'Google アカウントで同期', syncSoon: 'Google 同期 — 準備中', syncSoonTip: '運営者が Google 連携を準備中です。現在はこのブラウザにのみ保存されます。', syncOn: 'Google 同期オン', syncNow: '今すぐ同期', syncOff: '連携を解除', syncRe: '再接続', syncHelp: 'Google ドライブのアプリ専用の非表示フォルダにだけ保存し、他のファイルにはアクセスしません。',
      tImported: '「{name}」を読み込みました', tImportFail: 'ファイルを読み込めませんでした: {msg}', tUnsupported: '対応していないファイル形式です（.xlsx, .csv）', tExported: '{file} を作成しました', tExportFail: '書き出しに失敗しました: {msg}', tWorking: '作成中…',
      tTabUpdated: '別のタブでの変更を反映しました', tTabConflict: '別のタブと同時に編集されたため、そのタブの内容をコピーとして保存しました', tTabDeleted: '別のタブでこのブックが削除されました', tRemoteUpdated: '別の端末での変更を反映しました', tConflicts: '同時に編集された {n} 件を「競合コピー」として保存しました', tSynced: 'Google ドライブと同期しました', tSyncFail: '同期できませんでした — このブラウザには引き続き保存されます', tPopup: 'ログインのポップアップがブロックされました — 「再接続」を押してください', tDisconnected: 'Google 同期を解除しました（このブラウザのデータはそのままです）', tDeleted: '「{name}」を削除しました', tNoStorage: 'このブラウザではストレージを使えないため、再読み込みすると消えます',
      confirmDisconnect: 'Google 同期を解除しますか？ このブラウザと Google ドライブのデータは削除されません。',
      langLabel: '言語', dropHint: 'ここにドロップして読み込み', xsTip: 'お知らせ',
      fTerms: '利用規約', fPrivacy: 'プライバシーポリシー', fContact: 'お問い合わせ', fDev: '開発者紹介',
      fDesc: 'SHEET はインストール不要でブラウザから使える無料の表計算エディタです。ブックはこのブラウザ（連携した場合はご自身の Google ドライブ）にのみ保存され、サーバーには送信されません。広告は Google AdSense により配信される場合があります。',
      fTm: 'Microsoft Excel は Microsoft Corporation の商標です。SHEET は Microsoft とは関係ありません。',
      title: '表計算エディタ（Excel 互換）— 無料オンライン · xlsx · csv · pdf | SHEET',
      desc: 'インストール不要の無料オンライン表計算エディタ。複数シート・数式・セル結合・書式に対応し自動保存。xlsx・csv の読み込み、xlsx・csv・pdf への書き出し、Google アカウント同期で別の PC でも続きを編集できます。',
      ogTitle: '表計算エディタ（Excel 互換）| SHEET', ogDesc: '複数シート・数式・結合・書式、自動保存、xlsx・csv・pdf 書き出し、Google 同期。無料・インストール不要。'
    },
    zh: {
      appName: '电子表格编辑器（兼容 Excel）', appShort: '电子表格编辑器',
      books: '工作簿', booksTitle: '我的工作簿', newBook: '新建', newBookTip: '新建工作簿',
      importFile: '导入', importTip: '打开 .xlsx 或 .csv 文件',
      exportMenu: '导出', exXlsx: 'Excel 工作簿 (.xlsx)', exCsv: 'CSV — 当前工作表 (.csv)', exPdf: 'PDF — 当前工作表 (.pdf)',
      print: '打印', printTip: '只打印表格 — 在打印对话框中也可选择“另存为 PDF”',
      open: '打开', rename: '重命名', del: '删除', cancel: '取消', ok: '确定', close: '关闭',
      untitled: '工作簿 {n}', sheetWord: '工作表', conflictSuffix: '（冲突副本）',
      renameTitle: '重命名工作簿', nameLabel: '名称', delTitle: '删除工作簿',
      delConfirm: '删除“{name}”？它将从此浏览器和所有已同步的设备中移除。',
      listEmpty: '还没有保存的工作簿。在单元格中输入内容即可自动保存。',
      edited: '修改于 {t}', current: '当前', sheetsN: '{n} 个工作表',
      emptyHint: '这是一个空白工作表 — 点击单元格直接输入，或导入 .xlsx / .csv 文件。输入的内容会自动保存。',
      dismiss: '隐藏',
      localNote: '自动保存：仅保存在此浏览器中（像 Cookie 一样按设备区分）。要在其他电脑上继续编辑，请开启 Google 账号同步。',
      fxLabel: '编辑栏', fxPh: '输入值或公式（例如 =SUM(A1:A3)）', cellRef: '所选单元格',
      st_ready: '自动保存已开启', st_saving: '正在保存…', st_savedNow: '已保存 · 刚刚', st_savedAt: '已保存 · {t}', st_syncing: '正在同步…', st_syncedAt: '已同步 · {t}', st_pending: '等待同步', st_offline: '离线', st_tip: '自动保存在此浏览器中',
      syncConnect: '使用 Google 账号同步', syncSoon: 'Google 同步 — 即将推出', syncSoonTip: '运营方正在配置 Google 同步。目前工作簿仅保存在此浏览器中。', syncOn: 'Google 同步已开启', syncNow: '立即同步', syncOff: '断开连接', syncRe: '重新连接', syncHelp: '仅保存在你 Google 云端硬盘中的应用专用隐藏文件夹，不会访问你的其他文件。',
      tImported: '已导入“{name}”', tImportFail: '无法读取文件：{msg}', tUnsupported: '不支持的文件类型（请使用 .xlsx 或 .csv）', tExported: '已生成 {file}', tExportFail: '导出失败：{msg}', tWorking: '正在生成…',
      tTabUpdated: '已应用在其他标签页中的修改', tTabConflict: '与其他标签页同时编辑 — 该标签页的版本已另存为副本', tTabDeleted: '此工作簿已在其他标签页中删除', tRemoteUpdated: '已应用来自其他设备的修改', tConflicts: '已将 {n} 个同时编辑的项目保留为“冲突副本”', tSynced: '已与 Google 云端硬盘同步', tSyncFail: '同步失败 — 内容仍保存在此浏览器中', tPopup: '登录弹窗被拦截 — 请点击“重新连接”', tDisconnected: '已断开 Google 同步（此浏览器中的数据保持不变）', tDeleted: '已删除“{name}”', tNoStorage: '此浏览器无法使用存储，刷新后内容将丢失',
      confirmDisconnect: '断开 Google 同步？此浏览器和 Google 云端硬盘中的数据不会被删除。',
      langLabel: '语言', dropHint: '拖放到此处导入', xsTip: '提示',
      fTerms: '服务条款', fPrivacy: '隐私政策', fContact: '联系我们', fDev: '开发者介绍',
      fDesc: 'SHEET 是无需安装、在浏览器中使用的免费电子表格编辑器。工作簿仅保存在此浏览器中（如已连接，也会保存到你自己的 Google 云端硬盘），不会发送到我们的服务器。广告可能由 Google AdSense 投放。',
      fTm: 'Microsoft Excel 是 Microsoft Corporation 的商标。SHEET 与 Microsoft 无关。',
      title: '电子表格编辑器（兼容 Excel）— 免费在线 · xlsx · csv · pdf | SHEET',
      desc: '无需安装的免费在线电子表格编辑器。支持多个工作表、公式、合并单元格和格式，自动保存；可导入 xlsx/csv，导出 xlsx/csv/pdf，并通过 Google 账号同步在其他电脑上继续编辑。',
      ogTitle: '电子表格编辑器（兼容 Excel）| SHEET', ogDesc: '多工作表、公式、合并、格式、自动保存，导出 xlsx/csv/pdf，Google 同步。免费，无需安装。'
    },
    'zh-Hant': {
      appName: '試算表編輯器（相容 Excel）', appShort: '試算表編輯器',
      books: '活頁簿', booksTitle: '我的活頁簿', newBook: '新增', newBookTip: '建立新活頁簿',
      importFile: '匯入', importTip: '開啟 .xlsx 或 .csv 檔案',
      exportMenu: '匯出', exXlsx: 'Excel 活頁簿 (.xlsx)', exCsv: 'CSV — 目前工作表 (.csv)', exPdf: 'PDF — 目前工作表 (.pdf)',
      print: '列印', printTip: '只列印表格 — 列印對話框中也可選擇「另存為 PDF」',
      open: '開啟', rename: '重新命名', del: '刪除', cancel: '取消', ok: '確定', close: '關閉',
      untitled: '活頁簿 {n}', sheetWord: '工作表', conflictSuffix: '（衝突副本）',
      renameTitle: '重新命名活頁簿', nameLabel: '名稱', delTitle: '刪除活頁簿',
      delConfirm: '要刪除「{name}」嗎？它將從此瀏覽器和所有已同步的裝置中移除。',
      listEmpty: '尚無已儲存的活頁簿。在儲存格中輸入內容就會自動儲存。',
      edited: '修改於 {t}', current: '目前', sheetsN: '{n} 個工作表',
      emptyHint: '這是空白工作表 — 點選儲存格直接輸入，或匯入 .xlsx / .csv 檔案。輸入的內容會自動儲存。',
      dismiss: '隱藏',
      localNote: '自動儲存：只會儲存在此瀏覽器中（像 Cookie 一樣依裝置區分）。若要在其他電腦上繼續編輯，請開啟 Google 帳戶同步。',
      fxLabel: '資料編輯列', fxPh: '輸入值或公式（例如 =SUM(A1:A3)）', cellRef: '選取的儲存格',
      st_ready: '自動儲存已開啟', st_saving: '正在儲存…', st_savedNow: '已儲存 · 剛剛', st_savedAt: '已儲存 · {t}', st_syncing: '正在同步…', st_syncedAt: '已同步 · {t}', st_pending: '等待同步', st_offline: '離線', st_tip: '自動儲存在此瀏覽器中',
      syncConnect: '使用 Google 帳戶同步', syncSoon: 'Google 同步 — 即將推出', syncSoonTip: '營運方正在設定 Google 同步。目前活頁簿只會儲存在此瀏覽器中。', syncOn: 'Google 同步已開啟', syncNow: '立即同步', syncOff: '中斷連結', syncRe: '重新連結', syncHelp: '只儲存在你 Google 雲端硬碟的應用程式專用隱藏資料夾，不會存取你的其他檔案。',
      tImported: '已匯入「{name}」', tImportFail: '無法讀取檔案：{msg}', tUnsupported: '不支援的檔案類型（請使用 .xlsx 或 .csv）', tExported: '已產生 {file}', tExportFail: '匯出失敗：{msg}', tWorking: '正在產生…',
      tTabUpdated: '已套用其他分頁中的修改', tTabConflict: '與其他分頁同時編輯 — 該分頁的版本已另存為副本', tTabDeleted: '此活頁簿已在其他分頁中刪除', tRemoteUpdated: '已套用來自其他裝置的修改', tConflicts: '已將 {n} 個同時編輯的項目保留為「衝突副本」', tSynced: '已與 Google 雲端硬碟同步', tSyncFail: '同步失敗 — 內容仍儲存在此瀏覽器中', tPopup: '登入彈出視窗被封鎖 — 請按「重新連結」', tDisconnected: '已中斷 Google 同步（此瀏覽器中的資料保持不變）', tDeleted: '已刪除「{name}」', tNoStorage: '此瀏覽器無法使用儲存空間，重新整理後內容將遺失',
      confirmDisconnect: '要中斷 Google 同步嗎？此瀏覽器和 Google 雲端硬碟中的資料不會被刪除。',
      langLabel: '語言', dropHint: '拖放到此處匯入', xsTip: '提示',
      fTerms: '服務條款', fPrivacy: '隱私權政策', fContact: '聯絡我們', fDev: '開發者介紹',
      fDesc: 'SHEET 是免安裝、在瀏覽器中使用的免費試算表編輯器。活頁簿只會儲存在此瀏覽器中（若已連結，也會儲存到你自己的 Google 雲端硬碟），不會傳送到我們的伺服器。廣告可能由 Google AdSense 刊登。',
      fTm: 'Microsoft Excel 是 Microsoft Corporation 的商標。SHEET 與 Microsoft 無關。',
      title: '試算表編輯器（相容 Excel）— 免費線上 · xlsx · csv · pdf | SHEET',
      desc: '免安裝的免費線上試算表編輯器。支援多個工作表、公式、合併儲存格與格式，自動儲存；可匯入 xlsx/csv、匯出 xlsx/csv/pdf，並透過 Google 帳戶同步在其他電腦上繼續編輯。',
      ogTitle: '試算表編輯器（相容 Excel）| SHEET', ogDesc: '多工作表、公式、合併、格式、自動儲存，匯出 xlsx/csv/pdf，Google 同步。免費、免安裝。'
    },
    th: {
      appName: 'โปรแกรมแก้ไขสเปรดชีต (รองรับ Excel)', appShort: 'แก้ไขสเปรดชีต',
      books: 'เวิร์กบุ๊ก', booksTitle: 'เวิร์กบุ๊กของฉัน', newBook: 'สร้างใหม่', newBookTip: 'สร้างเวิร์กบุ๊กใหม่',
      importFile: 'นำเข้า', importTip: 'เปิดไฟล์ .xlsx หรือ .csv',
      exportMenu: 'ส่งออก', exXlsx: 'เวิร์กบุ๊ก Excel (.xlsx)', exCsv: 'CSV — ชีตปัจจุบัน (.csv)', exPdf: 'PDF — ชีตปัจจุบัน (.pdf)',
      print: 'พิมพ์', printTip: 'พิมพ์เฉพาะตาราง — เลือก “บันทึกเป็น PDF” ในหน้าต่างพิมพ์ได้',
      open: 'เปิด', rename: 'เปลี่ยนชื่อ', del: 'ลบ', cancel: 'ยกเลิก', ok: 'ตกลง', close: 'ปิด',
      untitled: 'เวิร์กบุ๊ก {n}', sheetWord: 'ชีต', conflictSuffix: '(สำเนาที่ขัดแย้ง)',
      renameTitle: 'เปลี่ยนชื่อเวิร์กบุ๊ก', nameLabel: 'ชื่อ', delTitle: 'ลบเวิร์กบุ๊ก',
      delConfirm: 'ลบ “{name}” หรือไม่? จะถูกลบออกจากเบราว์เซอร์นี้และทุกอุปกรณ์ที่ซิงค์ไว้',
      listEmpty: 'ยังไม่มีเวิร์กบุ๊กที่บันทึกไว้ พิมพ์ลงในเซลล์แล้วระบบจะบันทึกให้อัตโนมัติ',
      edited: 'แก้ไข {t}', current: 'กำลังเปิด', sheetsN: '{n} ชีต',
      emptyHint: 'ชีตนี้ว่างอยู่ — คลิกเซลล์เพื่อเริ่มพิมพ์ หรือนำเข้าไฟล์ .xlsx / .csv ทุกอย่างจะถูกบันทึกอัตโนมัติ',
      dismiss: 'ซ่อน',
      localNote: 'บันทึกอัตโนมัติ: เก็บไว้ในเบราว์เซอร์นี้เท่านั้น (แยกตามอุปกรณ์ เหมือนคุกกี้) หากต้องการทำต่อบนพีซีเครื่องอื่น ให้เปิดการซิงค์บัญชี Google',
      fxLabel: 'แถบสูตร', fxPh: 'พิมพ์ค่าหรือสูตร (เช่น =SUM(A1:A3))', cellRef: 'เซลล์ที่เลือก',
      st_ready: 'บันทึกอัตโนมัติเปิดอยู่', st_saving: 'กำลังบันทึก…', st_savedNow: 'บันทึกแล้ว · เมื่อสักครู่', st_savedAt: 'บันทึกแล้ว · {t}', st_syncing: 'กำลังซิงค์…', st_syncedAt: 'ซิงค์แล้ว · {t}', st_pending: 'รอซิงค์', st_offline: 'ออฟไลน์', st_tip: 'บันทึกอัตโนมัติในเบราว์เซอร์นี้',
      syncConnect: 'ซิงค์ด้วยบัญชี Google', syncSoon: 'ซิงค์ Google — เร็ว ๆ นี้', syncSoonTip: 'ผู้ดูแลกำลังตั้งค่าการซิงค์ Google ตอนนี้เวิร์กบุ๊กจะถูกบันทึกในเบราว์เซอร์นี้เท่านั้น', syncOn: 'ซิงค์ Google เปิดอยู่', syncNow: 'ซิงค์ตอนนี้', syncOff: 'ยกเลิกการเชื่อมต่อ', syncRe: 'เชื่อมต่ออีกครั้ง', syncHelp: 'เก็บไว้เฉพาะในโฟลเดอร์ซ่อนของแอปใน Google ไดรฟ์ของคุณ แอปมองไม่เห็นไฟล์อื่นของคุณ',
      tImported: 'นำเข้า “{name}” แล้ว', tImportFail: 'อ่านไฟล์ไม่ได้: {msg}', tUnsupported: 'ไม่รองรับไฟล์ประเภทนี้ (ใช้ .xlsx หรือ .csv)', tExported: 'สร้าง {file} แล้ว', tExportFail: 'ส่งออกไม่สำเร็จ: {msg}', tWorking: 'กำลังสร้าง…',
      tTabUpdated: 'นำการเปลี่ยนแปลงจากแท็บอื่นมาใช้แล้ว', tTabConflict: 'มีการแก้ไขพร้อมกันในแท็บอื่น — เก็บเวอร์ชันนั้นไว้เป็นสำเนาแล้ว', tTabDeleted: 'เวิร์กบุ๊กนี้ถูกลบในแท็บอื่น', tRemoteUpdated: 'นำการเปลี่ยนแปลงจากอุปกรณ์อื่นมาใช้แล้ว', tConflicts: 'เก็บการแก้ไขพร้อมกัน {n} รายการไว้เป็น “สำเนาที่ขัดแย้ง”', tSynced: 'ซิงค์กับ Google ไดรฟ์แล้ว', tSyncFail: 'ซิงค์ไม่สำเร็จ — งานยังคงบันทึกในเบราว์เซอร์นี้', tPopup: 'ป๊อปอัปการลงชื่อเข้าใช้ถูกบล็อก — กด “เชื่อมต่ออีกครั้ง”', tDisconnected: 'ยกเลิกการซิงค์ Google แล้ว (ข้อมูลในเบราว์เซอร์นี้ยังอยู่)', tDeleted: 'ลบ “{name}” แล้ว', tNoStorage: 'เบราว์เซอร์นี้ใช้พื้นที่จัดเก็บไม่ได้ การเปลี่ยนแปลงจะหายไปเมื่อโหลดใหม่',
      confirmDisconnect: 'ยกเลิกการซิงค์ Google หรือไม่? ข้อมูลในเบราว์เซอร์นี้และใน Google ไดรฟ์จะไม่ถูกลบ',
      langLabel: 'ภาษา', dropHint: 'วางที่นี่เพื่อนำเข้า', xsTip: 'แจ้งเตือน',
      fTerms: 'ข้อกำหนดการใช้งาน', fPrivacy: 'นโยบายความเป็นส่วนตัว', fContact: 'ติดต่อ', fDev: 'เกี่ยวกับผู้พัฒนา',
      fDesc: 'SHEET คือโปรแกรมแก้ไขสเปรดชีตฟรีที่ใช้งานในเบราว์เซอร์ได้ทันทีโดยไม่ต้องติดตั้ง เวิร์กบุ๊กจะถูกเก็บไว้ในเบราว์เซอร์นี้เท่านั้น (และใน Google ไดรฟ์ของคุณหากเชื่อมต่อ) ไม่ถูกส่งไปยังเซิร์ฟเวอร์ของเรา อาจมีโฆษณาจาก Google AdSense',
      fTm: 'Microsoft Excel เป็นเครื่องหมายการค้าของ Microsoft Corporation และ SHEET ไม่มีส่วนเกี่ยวข้องกับ Microsoft',
      title: 'โปรแกรมแก้ไขสเปรดชีต (รองรับ Excel) — ฟรีออนไลน์ · xlsx · csv · pdf | SHEET',
      desc: 'โปรแกรมแก้ไขสเปรดชีตฟรีในเบราว์เซอร์ รองรับหลายชีต สูตร ผสานเซลล์ จัดรูปแบบ บันทึกอัตโนมัติ นำเข้า xlsx/csv ส่งออก xlsx/csv/pdf และซิงค์ด้วยบัญชี Google',
      ogTitle: 'โปรแกรมแก้ไขสเปรดชีต (รองรับ Excel) | SHEET', ogDesc: 'หลายชีต สูตร ผสานเซลล์ จัดรูปแบบ บันทึกอัตโนมัติ ส่งออก xlsx/csv/pdf ซิงค์ Google ฟรี ไม่ต้องติดตั้ง'
    },
    es: {
      appName: 'Editor de hojas de cálculo (compatible con Excel)', appShort: 'Editor de hojas',
      books: 'Libros', booksTitle: 'Mis libros', newBook: 'Nuevo', newBookTip: 'Crear un libro nuevo',
      importFile: 'Importar', importTip: 'Abrir un archivo .xlsx o .csv',
      exportMenu: 'Exportar', exXlsx: 'Libro de Excel (.xlsx)', exCsv: 'CSV — hoja actual (.csv)', exPdf: 'PDF — hoja actual (.pdf)',
      print: 'Imprimir', printTip: 'Imprime solo la cuadrícula — en el diálogo puedes elegir “Guardar como PDF”',
      open: 'Abrir', rename: 'Cambiar nombre', del: 'Eliminar', cancel: 'Cancelar', ok: 'Aceptar', close: 'Cerrar',
      untitled: 'Libro {n}', sheetWord: 'Hoja', conflictSuffix: '(copia en conflicto)',
      renameTitle: 'Cambiar nombre del libro', nameLabel: 'Nombre', delTitle: 'Eliminar libro',
      delConfirm: '¿Eliminar “{name}”? Se borrará de este navegador y de todos los dispositivos sincronizados.',
      listEmpty: 'Aún no hay libros guardados. Escribe en una celda y se guardará automáticamente.',
      edited: 'Editado {t}', current: 'Abierto', sheetsN: '{n} hojas',
      emptyHint: 'Esta hoja está vacía — haz clic en una celda para escribir o importa un archivo .xlsx / .csv. Todo se guarda automáticamente.',
      dismiss: 'Ocultar',
      localNote: 'Guardado automático: tu trabajo se guarda solo en este navegador (por dispositivo, como las cookies). Para continuar en otro PC, activa la sincronización con tu cuenta de Google.',
      fxLabel: 'Barra de fórmulas', fxPh: 'Escribe un valor o una fórmula (p. ej. =SUM(A1:A3))', cellRef: 'Celda seleccionada',
      st_ready: 'Guardado automático activo', st_saving: 'Guardando…', st_savedNow: 'Guardado · ahora mismo', st_savedAt: 'Guardado · {t}', st_syncing: 'Sincronizando…', st_syncedAt: 'Sincronizado · {t}', st_pending: 'Sincronización pendiente', st_offline: 'Sin conexión', st_tip: 'Se guarda automáticamente en este navegador',
      syncConnect: 'Sincronizar con cuenta de Google', syncSoon: 'Sincronización con Google — próximamente', syncSoonTip: 'El operador está configurando la sincronización con Google. Por ahora tus libros se guardan solo en este navegador.', syncOn: 'Sincronización con Google activa', syncNow: 'Sincronizar ahora', syncOff: 'Desconectar', syncRe: 'Volver a conectar', syncHelp: 'Se guarda solo en una carpeta oculta de la app en tu Google Drive; la app no puede ver tus demás archivos.',
      tImported: 'Se importó “{name}”', tImportFail: 'No se pudo leer el archivo: {msg}', tUnsupported: 'Tipo de archivo no compatible (usa .xlsx o .csv)', tExported: 'Se creó {file}', tExportFail: 'Error al exportar: {msg}', tWorking: 'Preparando…',
      tTabUpdated: 'Se aplicaron los cambios hechos en otra pestaña', tTabConflict: 'Se editó a la vez en otra pestaña — esa versión se guardó como copia', tTabDeleted: 'Este libro se eliminó en otra pestaña', tRemoteUpdated: 'Se aplicaron los cambios de otro dispositivo', tConflicts: 'Se conservaron {n} ediciones simultáneas como “copia en conflicto”', tSynced: 'Sincronizado con Google Drive', tSyncFail: 'No se pudo sincronizar — tu trabajo sigue guardado en este navegador', tPopup: 'Se bloqueó la ventana de inicio de sesión — pulsa “Volver a conectar”', tDisconnected: 'Sincronización con Google desconectada (los datos de este navegador se conservan)', tDeleted: 'Se eliminó “{name}”', tNoStorage: 'Este navegador no permite almacenamiento — los cambios se perderán al recargar',
      confirmDisconnect: '¿Desconectar la sincronización con Google? No se borrarán los datos de este navegador ni de Google Drive.',
      langLabel: 'Idioma', dropHint: 'Suelta aquí para importar', xsTip: 'Aviso',
      fTerms: 'Términos', fPrivacy: 'Privacidad', fContact: 'Contacto', fDev: 'Sobre el desarrollador',
      fDesc: 'SHEET es un editor de hojas de cálculo gratuito que funciona en el navegador sin instalación. Los libros se guardan solo en este navegador (y en tu propio Google Drive si lo conectas), nunca en nuestros servidores. Es posible que Google AdSense muestre anuncios.',
      fTm: 'Microsoft Excel es una marca comercial de Microsoft Corporation. SHEET no está afiliado a Microsoft.',
      title: 'Editor de hojas de cálculo (compatible con Excel) — gratis en línea | SHEET',
      desc: 'Editor de hojas de cálculo gratis: hojas, fórmulas, celdas combinadas, formato y autoguardado. Importa xlsx/csv, exporta xlsx/csv/pdf y sincroniza.',
      ogTitle: 'Editor de hojas de cálculo (compatible con Excel) | SHEET', ogDesc: 'Hojas, fórmulas, combinar celdas, formato, guardado automático, exportar xlsx/csv/pdf y sincronizar con Google. Gratis.'
    },
    fr: {
      appName: 'Éditeur de tableur (compatible Excel)', appShort: 'Éditeur de tableur',
      books: 'Classeurs', booksTitle: 'Mes classeurs', newBook: 'Nouveau', newBookTip: 'Créer un classeur',
      importFile: 'Importer', importTip: 'Ouvrir un fichier .xlsx ou .csv',
      exportMenu: 'Exporter', exXlsx: 'Classeur Excel (.xlsx)', exCsv: 'CSV — feuille active (.csv)', exPdf: 'PDF — feuille active (.pdf)',
      print: 'Imprimer', printTip: 'Imprime uniquement la grille — choisissez « Enregistrer au format PDF » dans la boîte d’impression',
      open: 'Ouvrir', rename: 'Renommer', del: 'Supprimer', cancel: 'Annuler', ok: 'OK', close: 'Fermer',
      untitled: 'Classeur {n}', sheetWord: 'Feuille', conflictSuffix: '(copie en conflit)',
      renameTitle: 'Renommer le classeur', nameLabel: 'Nom', delTitle: 'Supprimer le classeur',
      delConfirm: 'Supprimer « {name} » ? Il sera retiré de ce navigateur et de tous les appareils synchronisés.',
      listEmpty: 'Aucun classeur enregistré pour l’instant. Tapez dans une cellule : tout est enregistré automatiquement.',
      edited: 'Modifié {t}', current: 'Ouvert', sheetsN: '{n} feuilles',
      emptyHint: 'Cette feuille est vide — cliquez sur une cellule pour saisir, ou importez un fichier .xlsx / .csv. Tout est enregistré automatiquement.',
      dismiss: 'Masquer',
      localNote: 'Enregistrement automatique : votre travail est stocké uniquement dans ce navigateur (par appareil, comme les cookies). Pour continuer sur un autre PC, activez la synchronisation avec votre compte Google.',
      fxLabel: 'Barre de formule', fxPh: 'Saisissez une valeur ou une formule (ex. =SUM(A1:A3))', cellRef: 'Cellule sélectionnée',
      st_ready: 'Enregistrement auto activé', st_saving: 'Enregistrement…', st_savedNow: 'Enregistré · à l’instant', st_savedAt: 'Enregistré · {t}', st_syncing: 'Synchronisation…', st_syncedAt: 'Synchronisé · {t}', st_pending: 'Synchro en attente', st_offline: 'Hors ligne', st_tip: 'Enregistré automatiquement dans ce navigateur',
      syncConnect: 'Synchroniser avec Google', syncSoon: 'Synchro Google — bientôt disponible', syncSoonTip: 'L’opérateur configure la synchronisation Google. Pour l’instant, vos classeurs sont enregistrés uniquement dans ce navigateur.', syncOn: 'Synchro Google activée', syncNow: 'Synchroniser maintenant', syncOff: 'Déconnecter', syncRe: 'Reconnecter', syncHelp: 'Stocké uniquement dans un dossier caché de l’app sur votre Google Drive — l’app ne voit pas vos autres fichiers.',
      tImported: '« {name} » importé', tImportFail: 'Impossible de lire le fichier : {msg}', tUnsupported: 'Type de fichier non pris en charge (utilisez .xlsx ou .csv)', tExported: '{file} créé', tExportFail: 'Échec de l’export : {msg}', tWorking: 'Préparation…',
      tTabUpdated: 'Modifications d’un autre onglet appliquées', tTabConflict: 'Modifié en même temps dans un autre onglet — cette version a été conservée en copie', tTabDeleted: 'Ce classeur a été supprimé dans un autre onglet', tRemoteUpdated: 'Modifications d’un autre appareil appliquées', tConflicts: '{n} modification(s) simultanée(s) conservée(s) en « copie en conflit »', tSynced: 'Synchronisé avec Google Drive', tSyncFail: 'Synchronisation impossible — votre travail reste enregistré dans ce navigateur', tPopup: 'La fenêtre de connexion a été bloquée — cliquez sur « Reconnecter »', tDisconnected: 'Synchro Google déconnectée (les données de ce navigateur sont conservées)', tDeleted: '« {name} » supprimé', tNoStorage: 'Stockage indisponible dans ce navigateur — les modifications seront perdues au rechargement',
      confirmDisconnect: 'Déconnecter la synchronisation Google ? Les données de ce navigateur et de Google Drive ne seront pas supprimées.',
      langLabel: 'Langue', dropHint: 'Déposez ici pour importer', xsTip: 'Info',
      fTerms: 'Conditions', fPrivacy: 'Confidentialité', fContact: 'Contact', fDev: 'À propos du développeur',
      fDesc: 'SHEET est un tableur gratuit qui fonctionne dans le navigateur, sans installation. Les classeurs sont stockés uniquement dans ce navigateur (et dans votre propre Google Drive si vous le connectez), jamais sur nos serveurs. Des annonces peuvent être diffusées par Google AdSense.',
      fTm: 'Microsoft Excel est une marque de Microsoft Corporation. SHEET n’est pas affilié à Microsoft.',
      title: 'Éditeur de tableur (compatible Excel) — gratuit en ligne · xlsx · csv · pdf | SHEET',
      desc: 'Tableur gratuit en ligne : feuilles, formules, fusion de cellules, mise en forme, sauvegarde auto. Import xlsx/csv, export xlsx/csv/pdf et synchro Google.',
      ogTitle: 'Éditeur de tableur (compatible Excel) | SHEET', ogDesc: 'Feuilles, formules, fusion, mise en forme, enregistrement auto, export xlsx/csv/pdf, synchro Google. Gratuit.'
    },
    de: {
      appName: 'Tabelleneditor (Excel-kompatibel)', appShort: 'Tabelleneditor',
      books: 'Arbeitsmappen', booksTitle: 'Meine Arbeitsmappen', newBook: 'Neu', newBookTip: 'Neue Arbeitsmappe erstellen',
      importFile: 'Importieren', importTip: '.xlsx- oder .csv-Datei öffnen',
      exportMenu: 'Exportieren', exXlsx: 'Excel-Arbeitsmappe (.xlsx)', exCsv: 'CSV — aktuelles Blatt (.csv)', exPdf: 'PDF — aktuelles Blatt (.pdf)',
      print: 'Drucken', printTip: 'Druckt nur das Raster — im Druckdialog ist auch „Als PDF speichern“ möglich',
      open: 'Öffnen', rename: 'Umbenennen', del: 'Löschen', cancel: 'Abbrechen', ok: 'OK', close: 'Schließen',
      untitled: 'Mappe {n}', sheetWord: 'Blatt', conflictSuffix: '(Konfliktkopie)',
      renameTitle: 'Arbeitsmappe umbenennen', nameLabel: 'Name', delTitle: 'Arbeitsmappe löschen',
      delConfirm: '„{name}“ löschen? Sie wird aus diesem Browser und von allen synchronisierten Geräten entfernt.',
      listEmpty: 'Noch keine gespeicherten Arbeitsmappen. Tippe in eine Zelle – alles wird automatisch gespeichert.',
      edited: 'Geändert {t}', current: 'Geöffnet', sheetsN: '{n} Blätter',
      emptyHint: 'Dieses Blatt ist leer — klicke in eine Zelle und tippe los oder importiere eine .xlsx- / .csv-Datei. Alles wird automatisch gespeichert.',
      dismiss: 'Ausblenden',
      localNote: 'Automatisch gespeichert: nur in diesem Browser (pro Gerät, wie Cookies). Um auf einem anderen PC weiterzuarbeiten, aktiviere die Synchronisierung mit deinem Google-Konto.',
      fxLabel: 'Bearbeitungsleiste', fxPh: 'Wert oder Formel eingeben (z. B. =SUM(A1:A3))', cellRef: 'Ausgewählte Zelle',
      st_ready: 'Autospeichern an', st_saving: 'Speichern…', st_savedNow: 'Gespeichert · gerade eben', st_savedAt: 'Gespeichert · {t}', st_syncing: 'Synchronisiere…', st_syncedAt: 'Synchronisiert · {t}', st_pending: 'Synchronisierung ausstehend', st_offline: 'Offline', st_tip: 'Wird automatisch in diesem Browser gespeichert',
      syncConnect: 'Mit Google-Konto synchronisieren', syncSoon: 'Google-Sync — demnächst', syncSoonTip: 'Der Betreiber richtet die Google-Synchronisierung gerade ein. Bis dahin werden deine Arbeitsmappen nur in diesem Browser gespeichert.', syncOn: 'Google-Sync aktiv', syncNow: 'Jetzt synchronisieren', syncOff: 'Trennen', syncRe: 'Neu verbinden', syncHelp: 'Wird nur in einem versteckten App-Ordner in deinem Google Drive gespeichert – die App sieht deine anderen Dateien nicht.',
      tImported: '„{name}“ importiert', tImportFail: 'Datei konnte nicht gelesen werden: {msg}', tUnsupported: 'Dateityp nicht unterstützt (.xlsx oder .csv verwenden)', tExported: '{file} erstellt', tExportFail: 'Export fehlgeschlagen: {msg}', tWorking: 'Wird erstellt…',
      tTabUpdated: 'Änderungen aus einem anderen Tab übernommen', tTabConflict: 'Gleichzeitig in einem anderen Tab bearbeitet — diese Version wurde als Kopie behalten', tTabDeleted: 'Diese Arbeitsmappe wurde in einem anderen Tab gelöscht', tRemoteUpdated: 'Änderungen von einem anderen Gerät übernommen', tConflicts: '{n} gleichzeitige Änderung(en) als „Konfliktkopie“ behalten', tSynced: 'Mit Google Drive synchronisiert', tSyncFail: 'Synchronisierung fehlgeschlagen — deine Arbeit bleibt in diesem Browser gespeichert', tPopup: 'Das Anmelde-Pop-up wurde blockiert — klicke auf „Neu verbinden“', tDisconnected: 'Google-Sync getrennt (Daten in diesem Browser bleiben erhalten)', tDeleted: '„{name}“ gelöscht', tNoStorage: 'In diesem Browser ist kein Speicher verfügbar — Änderungen gehen beim Neuladen verloren',
      confirmDisconnect: 'Google-Sync trennen? Daten in diesem Browser und in Google Drive werden nicht gelöscht.',
      langLabel: 'Sprache', dropHint: 'Zum Importieren hier ablegen', xsTip: 'Hinweis',
      fTerms: 'Nutzungsbedingungen', fPrivacy: 'Datenschutz', fContact: 'Kontakt', fDev: 'Über den Entwickler',
      fDesc: 'SHEET ist ein kostenloser Tabelleneditor, der ohne Installation im Browser läuft. Arbeitsmappen werden nur in diesem Browser gespeichert (und in deinem eigenen Google Drive, wenn du es verbindest) – nie auf unseren Servern. Anzeigen können über Google AdSense ausgeliefert werden.',
      fTm: 'Microsoft Excel ist eine Marke der Microsoft Corporation. SHEET steht in keiner Verbindung zu Microsoft.',
      title: 'Tabelleneditor (Excel-kompatibel) — kostenlos online · xlsx · csv · pdf | SHEET',
      desc: 'Kostenloser Tabelleneditor im Browser: Blätter, Formeln, verbundene Zellen, Formatierung, Autospeichern. Import xlsx/csv, Export xlsx/csv/pdf, Google-Sync.',
      ogTitle: 'Tabelleneditor (Excel-kompatibel) | SHEET', ogDesc: 'Blätter, Formeln, Zellen verbinden, Formatierung, Autospeichern, Export xlsx/csv/pdf, Google-Sync. Kostenlos.'
    },
    it: {
      appName: 'Editor di fogli di calcolo (compatibile con Excel)', appShort: 'Editor di fogli',
      books: 'Cartelle', booksTitle: 'Le mie cartelle', newBook: 'Nuova', newBookTip: 'Crea una nuova cartella di lavoro',
      importFile: 'Importa', importTip: 'Apri un file .xlsx o .csv',
      exportMenu: 'Esporta', exXlsx: 'Cartella di Excel (.xlsx)', exCsv: 'CSV — foglio attuale (.csv)', exPdf: 'PDF — foglio attuale (.pdf)',
      print: 'Stampa', printTip: 'Stampa solo la griglia — nella finestra di stampa puoi scegliere “Salva come PDF”',
      open: 'Apri', rename: 'Rinomina', del: 'Elimina', cancel: 'Annulla', ok: 'OK', close: 'Chiudi',
      untitled: 'Cartella {n}', sheetWord: 'Foglio', conflictSuffix: '(copia in conflitto)',
      renameTitle: 'Rinomina cartella di lavoro', nameLabel: 'Nome', delTitle: 'Elimina cartella di lavoro',
      delConfirm: 'Eliminare “{name}”? Verrà rimossa da questo browser e da tutti i dispositivi sincronizzati.',
      listEmpty: 'Nessuna cartella salvata. Scrivi in una cella e verrà salvata automaticamente.',
      edited: 'Modificata {t}', current: 'Aperta', sheetsN: '{n} fogli',
      emptyHint: 'Questo foglio è vuoto — fai clic su una cella per scrivere oppure importa un file .xlsx / .csv. Tutto viene salvato automaticamente.',
      dismiss: 'Nascondi',
      localNote: 'Salvataggio automatico: il lavoro è salvato solo in questo browser (per dispositivo, come i cookie). Per continuare su un altro PC, attiva la sincronizzazione con l’account Google.',
      fxLabel: 'Barra della formula', fxPh: 'Inserisci un valore o una formula (es. =SUM(A1:A3))', cellRef: 'Cella selezionata',
      st_ready: 'Salvataggio automatico attivo', st_saving: 'Salvataggio…', st_savedNow: 'Salvato · ora', st_savedAt: 'Salvato · {t}', st_syncing: 'Sincronizzazione…', st_syncedAt: 'Sincronizzato · {t}', st_pending: 'Sincronizzazione in attesa', st_offline: 'Offline', st_tip: 'Salvato automaticamente in questo browser',
      syncConnect: 'Sincronizza con l’account Google', syncSoon: 'Sincronizzazione Google — in arrivo', syncSoonTip: 'Il gestore sta configurando la sincronizzazione Google. Per ora le cartelle sono salvate solo in questo browser.', syncOn: 'Sincronizzazione Google attiva', syncNow: 'Sincronizza ora', syncOff: 'Disconnetti', syncRe: 'Riconnetti', syncHelp: 'Salvato solo in una cartella nascosta dell’app nel tuo Google Drive: l’app non vede gli altri tuoi file.',
      tImported: '“{name}” importata', tImportFail: 'Impossibile leggere il file: {msg}', tUnsupported: 'Tipo di file non supportato (usa .xlsx o .csv)', tExported: '{file} creato', tExportFail: 'Esportazione non riuscita: {msg}', tWorking: 'Preparazione…',
      tTabUpdated: 'Applicate le modifiche fatte in un’altra scheda', tTabConflict: 'Modificata contemporaneamente in un’altra scheda — quella versione è stata conservata come copia', tTabDeleted: 'Questa cartella è stata eliminata in un’altra scheda', tRemoteUpdated: 'Applicate le modifiche da un altro dispositivo', tConflicts: 'Conservate {n} modifiche simultanee come “copia in conflitto”', tSynced: 'Sincronizzato con Google Drive', tSyncFail: 'Sincronizzazione non riuscita — il lavoro resta salvato in questo browser', tPopup: 'La finestra di accesso è stata bloccata — premi “Riconnetti”', tDisconnected: 'Sincronizzazione Google disconnessa (i dati in questo browser restano)', tDeleted: '“{name}” eliminata', tNoStorage: 'Archiviazione non disponibile in questo browser — le modifiche andranno perse ricaricando',
      confirmDisconnect: 'Disconnettere la sincronizzazione Google? I dati in questo browser e in Google Drive non verranno eliminati.',
      langLabel: 'Lingua', dropHint: 'Rilascia qui per importare', xsTip: 'Avviso',
      fTerms: 'Termini', fPrivacy: 'Privacy', fContact: 'Contatti', fDev: 'Lo sviluppatore',
      fDesc: 'SHEET è un editor di fogli di calcolo gratuito che funziona nel browser senza installazione. Le cartelle sono salvate solo in questo browser (e nel tuo Google Drive se lo colleghi), mai sui nostri server. Gli annunci possono essere pubblicati da Google AdSense.',
      fTm: 'Microsoft Excel è un marchio di Microsoft Corporation. SHEET non è affiliato a Microsoft.',
      title: 'Editor di fogli di calcolo (compatibile con Excel) — gratis online | SHEET',
      desc: 'Editor di fogli di calcolo gratis: fogli, formule, celle unite, formattazione, salvataggio automatico. Importa xlsx/csv, esporta xlsx/csv/pdf, sync Google.',
      ogTitle: 'Editor di fogli di calcolo (compatibile con Excel) | SHEET', ogDesc: 'Fogli, formule, celle unite, formattazione, salvataggio automatico, esporta xlsx/csv/pdf, sincronizzazione Google. Gratis.'
    },
    pt: {
      appName: 'Editor de planilhas (compatível com Excel)', appShort: 'Editor de planilhas',
      books: 'Pastas', booksTitle: 'Minhas pastas de trabalho', newBook: 'Nova', newBookTip: 'Criar uma nova pasta de trabalho',
      importFile: 'Importar', importTip: 'Abrir um arquivo .xlsx ou .csv',
      exportMenu: 'Exportar', exXlsx: 'Pasta de trabalho do Excel (.xlsx)', exCsv: 'CSV — planilha atual (.csv)', exPdf: 'PDF — planilha atual (.pdf)',
      print: 'Imprimir', printTip: 'Imprime só a grade — na janela de impressão você pode escolher “Salvar como PDF”',
      open: 'Abrir', rename: 'Renomear', del: 'Excluir', cancel: 'Cancelar', ok: 'OK', close: 'Fechar',
      untitled: 'Pasta {n}', sheetWord: 'Planilha', conflictSuffix: '(cópia em conflito)',
      renameTitle: 'Renomear pasta de trabalho', nameLabel: 'Nome', delTitle: 'Excluir pasta de trabalho',
      delConfirm: 'Excluir “{name}”? Ela será removida deste navegador e de todos os dispositivos sincronizados.',
      listEmpty: 'Ainda não há pastas salvas. Digite em uma célula e tudo será salvo automaticamente.',
      edited: 'Editada {t}', current: 'Aberta', sheetsN: '{n} planilhas',
      emptyHint: 'Esta planilha está vazia — clique em uma célula para digitar ou importe um arquivo .xlsx / .csv. Tudo é salvo automaticamente.',
      dismiss: 'Ocultar',
      localNote: 'Salvamento automático: seu trabalho fica só neste navegador (por dispositivo, como cookies). Para continuar em outro PC, ative a sincronização com a conta Google.',
      fxLabel: 'Barra de fórmulas', fxPh: 'Digite um valor ou fórmula (ex.: =SUM(A1:A3))', cellRef: 'Célula selecionada',
      st_ready: 'Salvamento automático ativo', st_saving: 'Salvando…', st_savedNow: 'Salvo · agora mesmo', st_savedAt: 'Salvo · {t}', st_syncing: 'Sincronizando…', st_syncedAt: 'Sincronizado · {t}', st_pending: 'Sincronização pendente', st_offline: 'Offline', st_tip: 'Salvo automaticamente neste navegador',
      syncConnect: 'Sincronizar com a conta Google', syncSoon: 'Sincronização Google — em breve', syncSoonTip: 'O operador está configurando a sincronização com o Google. Por enquanto, suas pastas ficam salvas só neste navegador.', syncOn: 'Sincronização Google ativa', syncNow: 'Sincronizar agora', syncOff: 'Desconectar', syncRe: 'Reconectar', syncHelp: 'Armazenado só em uma pasta oculta do app no seu Google Drive — o app não vê seus outros arquivos.',
      tImported: '“{name}” importada', tImportFail: 'Não foi possível ler o arquivo: {msg}', tUnsupported: 'Tipo de arquivo não suportado (use .xlsx ou .csv)', tExported: '{file} criado', tExportFail: 'Falha ao exportar: {msg}', tWorking: 'Preparando…',
      tTabUpdated: 'Alterações feitas em outra aba foram aplicadas', tTabConflict: 'Editada ao mesmo tempo em outra aba — aquela versão foi mantida como cópia', tTabDeleted: 'Esta pasta foi excluída em outra aba', tRemoteUpdated: 'Alterações de outro dispositivo foram aplicadas', tConflicts: '{n} edição(ões) simultânea(s) mantida(s) como “cópia em conflito”', tSynced: 'Sincronizado com o Google Drive', tSyncFail: 'Não foi possível sincronizar — seu trabalho continua salvo neste navegador', tPopup: 'O pop-up de login foi bloqueado — clique em “Reconectar”', tDisconnected: 'Sincronização Google desconectada (os dados deste navegador foram mantidos)', tDeleted: '“{name}” excluída', tNoStorage: 'Armazenamento indisponível neste navegador — as alterações serão perdidas ao recarregar',
      confirmDisconnect: 'Desconectar a sincronização Google? Os dados deste navegador e do Google Drive não serão excluídos.',
      langLabel: 'Idioma', dropHint: 'Solte aqui para importar', xsTip: 'Aviso',
      fTerms: 'Termos', fPrivacy: 'Privacidade', fContact: 'Contato', fDev: 'Sobre o desenvolvedor',
      fDesc: 'SHEET é um editor de planilhas gratuito que funciona no navegador, sem instalação. As pastas ficam só neste navegador (e no seu próprio Google Drive, se você conectar), nunca em nossos servidores. Anúncios podem ser exibidos pelo Google AdSense.',
      fTm: 'Microsoft Excel é uma marca registrada da Microsoft Corporation. SHEET não é afiliado à Microsoft.',
      title: 'Editor de planilhas (compatível com Excel) — grátis online | SHEET',
      desc: 'Editor de planilhas grátis no navegador: abas, fórmulas, células mescladas, formatação, autossalvamento. Importe xlsx/csv, exporte xlsx/csv/pdf.',
      ogTitle: 'Editor de planilhas (compatível com Excel) | SHEET', ogDesc: 'Planilhas, fórmulas, mesclar células, formatação, salvamento automático, exportar xlsx/csv/pdf, sincronização Google. Grátis.'
    },
    ru: {
      appName: 'Редактор таблиц (совместим с Excel)', appShort: 'Редактор таблиц',
      books: 'Книги', booksTitle: 'Мои книги', newBook: 'Создать', newBookTip: 'Создать новую книгу',
      importFile: 'Импорт', importTip: 'Открыть файл .xlsx или .csv',
      exportMenu: 'Экспорт', exXlsx: 'Книга Excel (.xlsx)', exCsv: 'CSV — текущий лист (.csv)', exPdf: 'PDF — текущий лист (.pdf)',
      print: 'Печать', printTip: 'Печать только таблицы — в окне печати можно выбрать «Сохранить как PDF»',
      open: 'Открыть', rename: 'Переименовать', del: 'Удалить', cancel: 'Отмена', ok: 'ОК', close: 'Закрыть',
      untitled: 'Книга {n}', sheetWord: 'Лист', conflictSuffix: '(копия конфликта)',
      renameTitle: 'Переименовать книгу', nameLabel: 'Название', delTitle: 'Удалить книгу',
      delConfirm: 'Удалить «{name}»? Книга будет удалена из этого браузера и со всех синхронизированных устройств.',
      listEmpty: 'Сохранённых книг пока нет. Введите что-нибудь в ячейку — всё сохранится автоматически.',
      edited: 'Изменено {t}', current: 'Открыта', sheetsN: 'Листов: {n}',
      emptyHint: 'Лист пуст — щёлкните ячейку и начните вводить или импортируйте файл .xlsx / .csv. Всё сохраняется автоматически.',
      dismiss: 'Скрыть',
      localNote: 'Автосохранение: данные хранятся только в этом браузере (на каждом устройстве отдельно, как cookie). Чтобы продолжить на другом ПК, включите синхронизацию с аккаунтом Google.',
      fxLabel: 'Строка формул', fxPh: 'Введите значение или формулу (напр. =SUM(A1:A3))', cellRef: 'Выбранная ячейка',
      st_ready: 'Автосохранение вкл.', st_saving: 'Сохранение…', st_savedNow: 'Сохранено · только что', st_savedAt: 'Сохранено · {t}', st_syncing: 'Синхронизация…', st_syncedAt: 'Синхронизировано · {t}', st_pending: 'Ожидает синхронизации', st_offline: 'Офлайн', st_tip: 'Автоматически сохраняется в этом браузере',
      syncConnect: 'Синхронизировать с Google', syncSoon: 'Синхронизация Google — скоро', syncSoonTip: 'Оператор настраивает синхронизацию с Google. Пока книги сохраняются только в этом браузере.', syncOn: 'Синхронизация Google вкл.', syncNow: 'Синхронизировать', syncOff: 'Отключить', syncRe: 'Подключить снова', syncHelp: 'Хранится только в скрытой папке приложения на вашем Google Диске — приложение не видит другие ваши файлы.',
      tImported: 'Импортировано: «{name}»', tImportFail: 'Не удалось прочитать файл: {msg}', tUnsupported: 'Неподдерживаемый тип файла (используйте .xlsx или .csv)', tExported: 'Создан файл {file}', tExportFail: 'Ошибка экспорта: {msg}', tWorking: 'Подготовка…',
      tTabUpdated: 'Применены изменения из другой вкладки', tTabConflict: 'Книгу одновременно правили в другой вкладке — та версия сохранена как копия', tTabDeleted: 'Эта книга удалена в другой вкладке', tRemoteUpdated: 'Применены изменения с другого устройства', tConflicts: 'Одновременные правки ({n}) сохранены как «копия конфликта»', tSynced: 'Синхронизировано с Google Диском', tSyncFail: 'Не удалось синхронизировать — данные по-прежнему сохранены в этом браузере', tPopup: 'Окно входа заблокировано — нажмите «Подключить снова»', tDisconnected: 'Синхронизация Google отключена (данные в этом браузере сохранены)', tDeleted: 'Удалено: «{name}»', tNoStorage: 'В этом браузере хранилище недоступно — изменения пропадут после перезагрузки',
      confirmDisconnect: 'Отключить синхронизацию Google? Данные в этом браузере и на Google Диске не будут удалены.',
      langLabel: 'Язык', dropHint: 'Отпустите здесь для импорта', xsTip: 'Уведомление',
      fTerms: 'Условия', fPrivacy: 'Конфиденциальность', fContact: 'Связаться', fDev: 'О разработчике',
      fDesc: 'SHEET — бесплатный редактор таблиц, который работает в браузере без установки. Книги хранятся только в этом браузере (и на вашем Google Диске, если вы его подключите) и никогда не отправляются на наши серверы. Реклама может показываться через Google AdSense.',
      fTm: 'Microsoft Excel — товарный знак Microsoft Corporation. SHEET не связан с Microsoft.',
      title: 'Редактор таблиц (совместим с Excel) — бесплатно онлайн · xlsx · csv · pdf | SHEET',
      desc: 'Бесплатный редактор таблиц в браузере: листы, формулы, объединение ячеек, формат, автосохранение. Импорт xlsx/csv, экспорт xlsx/csv/pdf, синхронизация.',
      ogTitle: 'Редактор таблиц (совместим с Excel) | SHEET', ogDesc: 'Листы, формулы, объединение ячеек, форматирование, автосохранение, экспорт xlsx/csv/pdf, синхронизация Google. Бесплатно.'
    },
    nl: {
      appName: 'Spreadsheet-editor (Excel-compatibel)', appShort: 'Spreadsheet-editor',
      books: 'Werkmappen', booksTitle: 'Mijn werkmappen', newBook: 'Nieuw', newBookTip: 'Nieuwe werkmap maken',
      importFile: 'Importeren', importTip: 'Een .xlsx- of .csv-bestand openen',
      exportMenu: 'Exporteren', exXlsx: 'Excel-werkmap (.xlsx)', exCsv: 'CSV — huidig blad (.csv)', exPdf: 'PDF — huidig blad (.pdf)',
      print: 'Afdrukken', printTip: 'Drukt alleen het raster af — kies in het afdrukvenster ook “Opslaan als PDF”',
      open: 'Openen', rename: 'Naam wijzigen', del: 'Verwijderen', cancel: 'Annuleren', ok: 'OK', close: 'Sluiten',
      untitled: 'Map {n}', sheetWord: 'Blad', conflictSuffix: '(conflictkopie)',
      renameTitle: 'Naam van werkmap wijzigen', nameLabel: 'Naam', delTitle: 'Werkmap verwijderen',
      delConfirm: '“{name}” verwijderen? De werkmap verdwijnt uit deze browser en van alle gesynchroniseerde apparaten.',
      listEmpty: 'Nog geen opgeslagen werkmappen. Typ in een cel en alles wordt automatisch opgeslagen.',
      edited: 'Bewerkt {t}', current: 'Geopend', sheetsN: '{n} bladen',
      emptyHint: 'Dit blad is leeg — klik op een cel om te typen of importeer een .xlsx- / .csv-bestand. Alles wordt automatisch opgeslagen.',
      dismiss: 'Verbergen',
      localNote: 'Automatisch opslaan: je werk staat alleen in deze browser (per apparaat, zoals cookies). Wil je verder op een andere pc, zet dan synchronisatie met je Google-account aan.',
      fxLabel: 'Formulebalk', fxPh: 'Typ een waarde of formule (bijv. =SUM(A1:A3))', cellRef: 'Geselecteerde cel',
      st_ready: 'Automatisch opslaan aan', st_saving: 'Opslaan…', st_savedNow: 'Opgeslagen · zojuist', st_savedAt: 'Opgeslagen · {t}', st_syncing: 'Synchroniseren…', st_syncedAt: 'Gesynchroniseerd · {t}', st_pending: 'Synchronisatie in wachtrij', st_offline: 'Offline', st_tip: 'Wordt automatisch in deze browser opgeslagen',
      syncConnect: 'Synchroniseren met Google-account', syncSoon: 'Google-synchronisatie — binnenkort', syncSoonTip: 'De beheerder stelt Google-synchronisatie nog in. Voorlopig worden je werkmappen alleen in deze browser opgeslagen.', syncOn: 'Google-synchronisatie aan', syncNow: 'Nu synchroniseren', syncOff: 'Ontkoppelen', syncRe: 'Opnieuw verbinden', syncHelp: 'Wordt alleen opgeslagen in een verborgen app-map in je Google Drive — de app ziet je andere bestanden niet.',
      tImported: '“{name}” geïmporteerd', tImportFail: 'Bestand kon niet worden gelezen: {msg}', tUnsupported: 'Bestandstype niet ondersteund (gebruik .xlsx of .csv)', tExported: '{file} gemaakt', tExportFail: 'Exporteren mislukt: {msg}', tWorking: 'Bezig…',
      tTabUpdated: 'Wijzigingen uit een ander tabblad toegepast', tTabConflict: 'Tegelijk bewerkt in een ander tabblad — die versie is als kopie bewaard', tTabDeleted: 'Deze werkmap is in een ander tabblad verwijderd', tRemoteUpdated: 'Wijzigingen van een ander apparaat toegepast', tConflicts: '{n} gelijktijdige bewerking(en) bewaard als “conflictkopie”', tSynced: 'Gesynchroniseerd met Google Drive', tSyncFail: 'Synchroniseren mislukt — je werk blijft in deze browser opgeslagen', tPopup: 'Het aanmeldvenster is geblokkeerd — klik op “Opnieuw verbinden”', tDisconnected: 'Google-synchronisatie ontkoppeld (gegevens in deze browser blijven bewaard)', tDeleted: '“{name}” verwijderd', tNoStorage: 'Opslag is niet beschikbaar in deze browser — wijzigingen gaan verloren bij herladen',
      confirmDisconnect: 'Google-synchronisatie ontkoppelen? Gegevens in deze browser en in Google Drive worden niet verwijderd.',
      langLabel: 'Taal', dropHint: 'Hier neerzetten om te importeren', xsTip: 'Melding',
      fTerms: 'Voorwaarden', fPrivacy: 'Privacy', fContact: 'Contact', fDev: 'Over de ontwikkelaar',
      fDesc: 'SHEET is een gratis spreadsheet-editor die zonder installatie in je browser werkt. Werkmappen worden alleen in deze browser opgeslagen (en in je eigen Google Drive als je die koppelt), nooit op onze servers. Advertenties kunnen worden weergegeven via Google AdSense.',
      fTm: 'Microsoft Excel is een handelsmerk van Microsoft Corporation. SHEET is niet verbonden aan Microsoft.',
      title: 'Spreadsheet-editor (Excel-compatibel) — gratis online · xlsx · csv · pdf | SHEET',
      desc: 'Gratis spreadsheet-editor in je browser: bladen, formules, samengevoegde cellen, opmaak, autosave. Import xlsx/csv, export xlsx/csv/pdf, sync met Google.',
      ogTitle: 'Spreadsheet-editor (Excel-compatibel) | SHEET', ogDesc: 'Bladen, formules, cellen samenvoegen, opmaak, automatisch opslaan, export xlsx/csv/pdf, Google-synchronisatie. Gratis.'
    }
  };

  /* 저장 실패·복구 · 키보드 접근(이름 상자·그리드·시트 탭) · x-spreadsheet 보충 문구 · 큰 PDF 안내 — 13개 언어 */
  var U_MORE = {
    en: {
      tQuota: 'Browser storage is full — this change is not saved yet. Download an .xlsx backup and delete workbooks you no longer need.',
      tSaveFail: 'Could not save in this browser — the change stays on screen and saving will be retried. Download an .xlsx backup to be safe.',
      st_unsaved: 'Not saved', backupXlsx: 'Download .xlsx backup', tRestored: 'Restored changes that were not saved before the page closed',
      nameBox: 'Go to cell — type B5 or A1:C3 and press Enter', refBad: 'Not a cell reference — try B5 or A1:C3',
      gridLabel: 'Spreadsheet grid. Arrow keys move, Enter or F2 edits, typing replaces the cell, Tab leaves the grid.',
      addSheet: 'Add sheet', moreSheets: 'All sheets', sheetTabTip: 'Enter: open · F2: rename · Shift+F10: menu',
      xsPrintTitle: 'Print settings', xsRangePh: 'E3 or E3:F12',
      pdfBigTitle: 'Large PDF', pdfBigMsg: 'This sheet makes {n} PDF pages. At full quality it can take several minutes and a lot of memory (phones may run out).',
      pdfFast: 'Faster, smaller file', pdfFull: 'Full quality', pdfSel: 'Selected cells only ({n} pages)', pdfProgress: 'Creating PDF… page {i} / {n}', pdfCancelled: 'PDF export cancelled'
    },
    ko: {
      tQuota: '브라우저 저장 공간이 가득 찼습니다 — 이 변경은 아직 저장되지 않았습니다. .xlsx 백업을 내려받고 필요 없는 통합문서를 삭제하세요.',
      tSaveFail: '이 브라우저에 저장하지 못했습니다 — 변경 내용은 화면에 남아 있고 다시 저장을 시도합니다. 안전하게 .xlsx 백업을 내려받아 두세요.',
      st_unsaved: '저장 안 됨', backupXlsx: '.xlsx 백업 내려받기', tRestored: '페이지를 닫기 전에 저장되지 않은 변경 내용을 복구했습니다',
      nameBox: '셀로 이동 — B5 또는 A1:C3 처럼 입력하고 Enter', refBad: '셀 주소가 아닙니다 — B5 또는 A1:C3 처럼 입력하세요',
      gridLabel: '스프레드시트 표. 화살표 키로 이동, Enter 또는 F2로 편집, 바로 입력하면 셀 내용을 바꾸고, Tab으로 표를 벗어납니다.',
      addSheet: '시트 추가', moreSheets: '모든 시트', sheetTabTip: 'Enter: 열기 · F2: 이름 바꾸기 · Shift+F10: 메뉴',
      xsPrintTitle: '인쇄 설정', xsRangePh: 'E3 또는 E3:F12',
      pdfBigTitle: '큰 PDF', pdfBigMsg: '이 시트는 PDF {n}쪽이 됩니다. 원본 화질로 만들면 몇 분이 걸리고 메모리를 많이 씁니다(휴대폰에서는 멈출 수 있음).',
      pdfFast: '빠르게 (작은 파일)', pdfFull: '원본 화질', pdfSel: '선택한 셀만 ({n}쪽)', pdfProgress: 'PDF 만드는 중… {i} / {n}쪽', pdfCancelled: 'PDF 내보내기를 취소했습니다'
    },
    ja: {
      tQuota: 'ブラウザの保存容量がいっぱいです — この変更はまだ保存されていません。.xlsx のバックアップをダウンロードし、不要なブックを削除してください。',
      tSaveFail: 'このブラウザに保存できませんでした — 変更は画面に残っており、保存を再試行します。念のため .xlsx のバックアップをダウンロードしてください。',
      st_unsaved: '未保存', backupXlsx: '.xlsx バックアップをダウンロード', tRestored: 'ページを閉じる前に保存されなかった変更を復元しました',
      nameBox: 'セルへ移動 — B5 や A1:C3 と入力して Enter', refBad: 'セル参照ではありません — B5 や A1:C3 のように入力してください',
      gridLabel: 'スプレッドシートの表。矢印キーで移動、Enter または F2 で編集、そのまま入力するとセルを置き換え、Tab で表から出ます。',
      addSheet: 'シートを追加', moreSheets: 'すべてのシート', sheetTabTip: 'Enter: 開く · F2: 名前の変更 · Shift+F10: メニュー',
      xsPrintTitle: '印刷設定', xsRangePh: 'E3 または E3:F12',
      pdfBigTitle: '大きな PDF', pdfBigMsg: 'このシートは PDF で {n} ページになります。高画質では数分かかり、メモリを多く使います(スマートフォンでは止まることがあります)。',
      pdfFast: '高速・軽量', pdfFull: '高画質', pdfSel: '選択したセルのみ ({n} ページ)', pdfProgress: 'PDF を作成中… {i} / {n} ページ', pdfCancelled: 'PDF の書き出しをキャンセルしました'
    },
    zh: {
      tQuota: '浏览器存储空间已满 — 此更改尚未保存。请下载 .xlsx 备份并删除不再需要的工作簿。',
      tSaveFail: '无法保存到此浏览器 — 更改仍保留在屏幕上，将重试保存。为安全起见，请下载 .xlsx 备份。',
      st_unsaved: '未保存', backupXlsx: '下载 .xlsx 备份', tRestored: '已恢复页面关闭前未保存的更改',
      nameBox: '转到单元格 — 输入 B5 或 A1:C3 后按 Enter', refBad: '不是单元格引用 — 请输入 B5 或 A1:C3',
      gridLabel: '电子表格。方向键移动，Enter 或 F2 编辑，直接输入替换单元格内容，Tab 离开表格。',
      addSheet: '添加工作表', moreSheets: '所有工作表', sheetTabTip: 'Enter：打开 · F2：重命名 · Shift+F10：菜单',
      xsPrintTitle: '打印设置', xsRangePh: 'E3 或 E3:F12',
      pdfBigTitle: '大型 PDF', pdfBigMsg: '此工作表将生成 {n} 页 PDF。高画质可能需要几分钟并占用大量内存（手机上可能卡住）。',
      pdfFast: '更快、文件更小', pdfFull: '高画质', pdfSel: '仅所选单元格（{n} 页）', pdfProgress: '正在生成 PDF… 第 {i} / {n} 页', pdfCancelled: '已取消 PDF 导出'
    },
    'zh-Hant': {
      tQuota: '瀏覽器儲存空間已滿 — 此變更尚未儲存。請下載 .xlsx 備份並刪除不再需要的活頁簿。',
      tSaveFail: '無法儲存到此瀏覽器 — 變更仍保留在畫面上，將重試儲存。為安全起見，請下載 .xlsx 備份。',
      st_unsaved: '未儲存', backupXlsx: '下載 .xlsx 備份', tRestored: '已復原頁面關閉前未儲存的變更',
      nameBox: '移至儲存格 — 輸入 B5 或 A1:C3 後按 Enter', refBad: '不是儲存格參照 — 請輸入 B5 或 A1:C3',
      gridLabel: '試算表。方向鍵移動，Enter 或 F2 編輯，直接輸入會取代儲存格內容，Tab 離開表格。',
      addSheet: '新增工作表', moreSheets: '所有工作表', sheetTabTip: 'Enter：開啟 · F2：重新命名 · Shift+F10：選單',
      xsPrintTitle: '列印設定', xsRangePh: 'E3 或 E3:F12',
      pdfBigTitle: '大型 PDF', pdfBigMsg: '此工作表將產生 {n} 頁 PDF。高畫質可能需要幾分鐘並占用大量記憶體（手機上可能會卡住）。',
      pdfFast: '更快、檔案更小', pdfFull: '高畫質', pdfSel: '僅所選儲存格（{n} 頁）', pdfProgress: '正在產生 PDF… 第 {i} / {n} 頁', pdfCancelled: '已取消 PDF 匯出'
    },
    th: {
      tQuota: 'พื้นที่จัดเก็บของเบราว์เซอร์เต็มแล้ว — การเปลี่ยนแปลงนี้ยังไม่ได้บันทึก ดาวน์โหลดไฟล์สำรอง .xlsx แล้วลบเวิร์กบุ๊กที่ไม่ต้องการ',
      tSaveFail: 'บันทึกในเบราว์เซอร์นี้ไม่ได้ — การเปลี่ยนแปลงยังอยู่บนหน้าจอและจะลองบันทึกอีกครั้ง ดาวน์โหลดไฟล์สำรอง .xlsx ไว้เพื่อความปลอดภัย',
      st_unsaved: 'ยังไม่ได้บันทึก', backupXlsx: 'ดาวน์โหลดไฟล์สำรอง .xlsx', tRestored: 'กู้คืนการเปลี่ยนแปลงที่ยังไม่ได้บันทึกก่อนปิดหน้าแล้ว',
      nameBox: 'ไปที่เซลล์ — พิมพ์ B5 หรือ A1:C3 แล้วกด Enter', refBad: 'ไม่ใช่การอ้างอิงเซลล์ — ลองพิมพ์ B5 หรือ A1:C3',
      gridLabel: 'ตารางสเปรดชีต ใช้ปุ่มลูกศรเพื่อเลื่อน กด Enter หรือ F2 เพื่อแก้ไข พิมพ์เพื่อแทนที่เซลล์ และกด Tab เพื่อออกจากตาราง',
      addSheet: 'เพิ่มชีต', moreSheets: 'ชีตทั้งหมด', sheetTabTip: 'Enter: เปิด · F2: เปลี่ยนชื่อ · Shift+F10: เมนู',
      xsPrintTitle: 'ตั้งค่าการพิมพ์', xsRangePh: 'E3 หรือ E3:F12',
      pdfBigTitle: 'PDF ขนาดใหญ่', pdfBigMsg: 'ชีตนี้จะเป็น PDF {n} หน้า คุณภาพเต็มอาจใช้เวลาหลายนาทีและใช้หน่วยความจำมาก (โทรศัพท์อาจค้าง)',
      pdfFast: 'เร็วกว่า ไฟล์เล็กกว่า', pdfFull: 'คุณภาพเต็ม', pdfSel: 'เฉพาะเซลล์ที่เลือก ({n} หน้า)', pdfProgress: 'กำลังสร้าง PDF… หน้า {i} / {n}', pdfCancelled: 'ยกเลิกการส่งออก PDF แล้ว'
    },
    es: {
      tQuota: 'El almacenamiento del navegador está lleno: este cambio aún no se ha guardado. Descarga una copia .xlsx y elimina los libros que ya no necesites.',
      tSaveFail: 'No se pudo guardar en este navegador: el cambio sigue en pantalla y se volverá a intentar. Por seguridad, descarga una copia .xlsx.',
      st_unsaved: 'Sin guardar', backupXlsx: 'Descargar copia .xlsx', tRestored: 'Se recuperaron cambios que no se guardaron antes de cerrar la página',
      nameBox: 'Ir a celda: escribe B5 o A1:C3 y pulsa Enter', refBad: 'No es una referencia de celda; prueba B5 o A1:C3',
      gridLabel: 'Cuadrícula de la hoja. Las flechas mueven, Enter o F2 edita, escribir reemplaza la celda y Tab sale de la cuadrícula.',
      addSheet: 'Añadir hoja', moreSheets: 'Todas las hojas', sheetTabTip: 'Enter: abrir · F2: cambiar nombre · Mayús+F10: menú',
      xsPrintTitle: 'Configuración de impresión', xsRangePh: 'E3 o E3:F12',
      pdfBigTitle: 'PDF grande', pdfBigMsg: 'Esta hoja genera {n} páginas de PDF. En calidad completa puede tardar varios minutos y usar mucha memoria (los móviles pueden quedarse sin ella).',
      pdfFast: 'Más rápido, archivo más pequeño', pdfFull: 'Calidad completa', pdfSel: 'Solo las celdas seleccionadas ({n} páginas)', pdfProgress: 'Creando PDF… página {i} / {n}', pdfCancelled: 'Exportación a PDF cancelada'
    },
    fr: {
      tQuota: 'Le stockage du navigateur est plein : cette modification n’est pas encore enregistrée. Téléchargez une sauvegarde .xlsx et supprimez les classeurs inutiles.',
      tSaveFail: 'Impossible d’enregistrer dans ce navigateur : la modification reste à l’écran et l’enregistrement sera retenté. Par précaution, téléchargez une sauvegarde .xlsx.',
      st_unsaved: 'Non enregistré', backupXlsx: 'Télécharger une sauvegarde .xlsx', tRestored: 'Modifications non enregistrées avant la fermeture de la page restaurées',
      nameBox: 'Aller à la cellule : tapez B5 ou A1:C3 puis Entrée', refBad: 'Ce n’est pas une référence de cellule : essayez B5 ou A1:C3',
      gridLabel: 'Grille du tableur. Flèches pour se déplacer, Entrée ou F2 pour modifier, la saisie remplace la cellule, Tab quitte la grille.',
      addSheet: 'Ajouter une feuille', moreSheets: 'Toutes les feuilles', sheetTabTip: 'Entrée : ouvrir · F2 : renommer · Maj+F10 : menu',
      xsPrintTitle: 'Paramètres d’impression', xsRangePh: 'E3 ou E3:F12',
      pdfBigTitle: 'PDF volumineux', pdfBigMsg: 'Cette feuille produit {n} pages PDF. En qualité maximale, cela peut prendre plusieurs minutes et beaucoup de mémoire (les téléphones peuvent saturer).',
      pdfFast: 'Plus rapide, fichier plus léger', pdfFull: 'Qualité maximale', pdfSel: 'Cellules sélectionnées uniquement ({n} pages)', pdfProgress: 'Création du PDF… page {i} / {n}', pdfCancelled: 'Export PDF annulé'
    },
    de: {
      tQuota: 'Der Browserspeicher ist voll – diese Änderung ist noch nicht gespeichert. Lade eine .xlsx-Sicherung herunter und lösche nicht mehr benötigte Arbeitsmappen.',
      tSaveFail: 'Speichern in diesem Browser fehlgeschlagen – die Änderung bleibt sichtbar und das Speichern wird erneut versucht. Lade zur Sicherheit eine .xlsx-Sicherung herunter.',
      st_unsaved: 'Nicht gespeichert', backupXlsx: '.xlsx-Sicherung herunterladen', tRestored: 'Vor dem Schließen nicht gespeicherte Änderungen wurden wiederhergestellt',
      nameBox: 'Gehe zu Zelle – B5 oder A1:C3 eingeben und Enter drücken', refBad: 'Kein Zellbezug – versuche B5 oder A1:C3',
      gridLabel: 'Tabellenraster. Pfeiltasten bewegen, Enter oder F2 bearbeitet, Tippen ersetzt die Zelle, Tab verlässt das Raster.',
      addSheet: 'Blatt hinzufügen', moreSheets: 'Alle Blätter', sheetTabTip: 'Enter: öffnen · F2: umbenennen · Umschalt+F10: Menü',
      xsPrintTitle: 'Druckeinstellungen', xsRangePh: 'E3 oder E3:F12',
      pdfBigTitle: 'Großes PDF', pdfBigMsg: 'Dieses Blatt ergibt {n} PDF-Seiten. In voller Qualität kann das mehrere Minuten dauern und viel Speicher brauchen (Handys können abstürzen).',
      pdfFast: 'Schneller, kleinere Datei', pdfFull: 'Volle Qualität', pdfSel: 'Nur ausgewählte Zellen ({n} Seiten)', pdfProgress: 'PDF wird erstellt… Seite {i} / {n}', pdfCancelled: 'PDF-Export abgebrochen'
    },
    it: {
      tQuota: 'Lo spazio di archiviazione del browser è pieno: questa modifica non è ancora salvata. Scarica un backup .xlsx ed elimina le cartelle di lavoro che non ti servono.',
      tSaveFail: 'Impossibile salvare in questo browser: la modifica resta sullo schermo e il salvataggio verrà ritentato. Per sicurezza scarica un backup .xlsx.',
      st_unsaved: 'Non salvato', backupXlsx: 'Scarica backup .xlsx', tRestored: 'Ripristinate le modifiche non salvate prima della chiusura della pagina',
      nameBox: 'Vai alla cella: digita B5 o A1:C3 e premi Invio', refBad: 'Non è un riferimento di cella: prova B5 o A1:C3',
      gridLabel: 'Griglia del foglio. Le frecce spostano, Invio o F2 modifica, digitare sostituisce la cella, Tab esce dalla griglia.',
      addSheet: 'Aggiungi foglio', moreSheets: 'Tutti i fogli', sheetTabTip: 'Invio: apri · F2: rinomina · Maiusc+F10: menu',
      xsPrintTitle: 'Impostazioni di stampa', xsRangePh: 'E3 o E3:F12',
      pdfBigTitle: 'PDF di grandi dimensioni', pdfBigMsg: 'Questo foglio genera {n} pagine PDF. Alla qualità piena può richiedere diversi minuti e molta memoria (i telefoni potrebbero bloccarsi).',
      pdfFast: 'Più veloce, file più piccolo', pdfFull: 'Qualità piena', pdfSel: 'Solo celle selezionate ({n} pagine)', pdfProgress: 'Creazione PDF… pagina {i} / {n}', pdfCancelled: 'Esportazione PDF annullata'
    },
    pt: {
      tQuota: 'O armazenamento do navegador está cheio — esta alteração ainda não foi salva. Baixe um backup .xlsx e exclua as pastas de trabalho de que não precisa.',
      tSaveFail: 'Não foi possível salvar neste navegador — a alteração continua na tela e o salvamento será tentado novamente. Por segurança, baixe um backup .xlsx.',
      st_unsaved: 'Não salvo', backupXlsx: 'Baixar backup .xlsx', tRestored: 'Alterações não salvas antes de fechar a página foram recuperadas',
      nameBox: 'Ir para a célula — digite B5 ou A1:C3 e pressione Enter', refBad: 'Não é uma referência de célula — tente B5 ou A1:C3',
      gridLabel: 'Grade da planilha. As setas movem, Enter ou F2 edita, digitar substitui a célula e Tab sai da grade.',
      addSheet: 'Adicionar planilha', moreSheets: 'Todas as planilhas', sheetTabTip: 'Enter: abrir · F2: renomear · Shift+F10: menu',
      xsPrintTitle: 'Configurações de impressão', xsRangePh: 'E3 ou E3:F12',
      pdfBigTitle: 'PDF grande', pdfBigMsg: 'Esta planilha gera {n} páginas de PDF. Em qualidade total pode levar vários minutos e usar muita memória (celulares podem travar).',
      pdfFast: 'Mais rápido, arquivo menor', pdfFull: 'Qualidade total', pdfSel: 'Somente as células selecionadas ({n} páginas)', pdfProgress: 'Criando PDF… página {i} / {n}', pdfCancelled: 'Exportação para PDF cancelada'
    },
    ru: {
      tQuota: 'Хранилище браузера заполнено — это изменение ещё не сохранено. Скачайте резервную копию .xlsx и удалите ненужные книги.',
      tSaveFail: 'Не удалось сохранить в этом браузере — изменение остаётся на экране, сохранение будет повторено. На всякий случай скачайте резервную копию .xlsx.',
      st_unsaved: 'Не сохранено', backupXlsx: 'Скачать резервную копию .xlsx', tRestored: 'Восстановлены изменения, не сохранённые до закрытия страницы',
      nameBox: 'Перейти к ячейке — введите B5 или A1:C3 и нажмите Enter', refBad: 'Это не адрес ячейки — попробуйте B5 или A1:C3',
      gridLabel: 'Сетка таблицы. Стрелки — перемещение, Enter или F2 — правка, ввод заменяет ячейку, Tab — выход из сетки.',
      addSheet: 'Добавить лист', moreSheets: 'Все листы', sheetTabTip: 'Enter: открыть · F2: переименовать · Shift+F10: меню',
      xsPrintTitle: 'Параметры печати', xsRangePh: 'E3 или E3:F12',
      pdfBigTitle: 'Большой PDF', pdfBigMsg: 'Этот лист займёт {n} страниц PDF. В полном качестве это может занять несколько минут и много памяти (телефон может не справиться).',
      pdfFast: 'Быстрее, файл меньше', pdfFull: 'Полное качество', pdfSel: 'Только выделенные ячейки ({n} стр.)', pdfProgress: 'Создание PDF… страница {i} / {n}', pdfCancelled: 'Экспорт в PDF отменён'
    },
    nl: {
      tQuota: 'De browseropslag is vol — deze wijziging is nog niet opgeslagen. Download een .xlsx-back-up en verwijder werkmappen die je niet meer nodig hebt.',
      tSaveFail: 'Opslaan in deze browser is mislukt — de wijziging blijft zichtbaar en opslaan wordt opnieuw geprobeerd. Download voor de zekerheid een .xlsx-back-up.',
      st_unsaved: 'Niet opgeslagen', backupXlsx: '.xlsx-back-up downloaden', tRestored: 'Wijzigingen die vóór het sluiten van de pagina niet waren opgeslagen, zijn hersteld',
      nameBox: 'Ga naar cel — typ B5 of A1:C3 en druk op Enter', refBad: 'Geen celverwijzing — probeer B5 of A1:C3',
      gridLabel: 'Spreadsheetraster. Pijltjestoetsen verplaatsen, Enter of F2 bewerkt, typen vervangt de cel, Tab verlaat het raster.',
      addSheet: 'Blad toevoegen', moreSheets: 'Alle bladen', sheetTabTip: 'Enter: openen · F2: naam wijzigen · Shift+F10: menu',
      xsPrintTitle: 'Afdrukinstellingen', xsRangePh: 'E3 of E3:F12',
      pdfBigTitle: 'Grote pdf', pdfBigMsg: 'Dit blad levert {n} pdf-pagina’s op. In volle kwaliteit kan dat enkele minuten duren en veel geheugen kosten (telefoons kunnen vastlopen).',
      pdfFast: 'Sneller, kleiner bestand', pdfFull: 'Volle kwaliteit', pdfSel: 'Alleen geselecteerde cellen ({n} pagina’s)', pdfProgress: 'Pdf maken… pagina {i} / {n}', pdfCancelled: 'Pdf-export geannuleerd'
    }
  };
  LANGS.forEach(function (l) { Object.assign(U[l], U_MORE[l]); });

  /* ===================================================================== x-spreadsheet 사전 (en 원본 키 구조) */
  function xsDict(tb, cm, pr, fm, fo, va, er, bt, so, fi, dv) {
    var k = function (keys, vals) { var o = {}; for (var i = 0; i < keys.length; i++) o[keys[i]] = vals[i]; return o; };
    return {
      toolbar: k(['undo', 'redo', 'print', 'paintformat', 'clearformat', 'format', 'fontName', 'fontSize', 'fontBold', 'fontItalic', 'underline', 'strike', 'color', 'bgcolor', 'border', 'merge', 'align', 'valign', 'textwrap', 'freeze', 'autofilter', 'formula', 'more'], tb),
      contextmenu: k(['copy', 'cut', 'paste', 'pasteValue', 'pasteFormat', 'hide', 'insertRow', 'insertColumn', 'deleteSheet', 'deleteRow', 'deleteColumn', 'deleteCell', 'deleteCellText', 'validation', 'cellprintable', 'cellnonprintable', 'celleditable', 'cellnoneditable'], cm),
      print: { size: pr[0], orientation: pr[1], orientations: [pr[2], pr[3]] },
      format: k(['normal', 'text', 'number', 'percent', 'rmb', 'usd', 'eur', 'date', 'time', 'datetime', 'duration'], fm),
      formula: k(['sum', 'average', 'max', 'min', '_if', 'and', 'or', 'concat'], fo),
      validation: k(['required', 'notMatch', 'between', 'notBetween', 'notIn', 'equal', 'notEqual', 'lessThan', 'lessThanEqual', 'greaterThan', 'greaterThanEqual'], va),
      error: { pasteForMergedCell: er },
      button: k(['next', 'cancel', 'remove', 'save', 'ok'], bt),
      sort: { desc: so[0], asc: so[1] },
      filter: { empty: fi },
      dataValidation: {
        mode: dv[0], range: dv[1], criteria: dv[2],
        modeType: k(['cell', 'column', 'row'], dv[3]),
        type: k(['list', 'number', 'date', 'phone', 'email'], dv[4]),
        operator: k(['be', 'nbe', 'lt', 'lte', 'gt', 'gte', 'eq', 'neq'], dv[5])
      }
    };
  }
  var XS = {
    en: xsDict(
      ['Undo', 'Redo', 'Print', 'Paint format', 'Clear format', 'Format', 'Font', 'Font size', 'Bold', 'Italic', 'Underline', 'Strikethrough', 'Text color', 'Fill color', 'Borders', 'Merge cells', 'Horizontal align', 'Vertical align', 'Text wrapping', 'Freeze', 'Filter', 'Functions', 'More'],
      ['Copy', 'Cut', 'Paste', 'Paste values only', 'Paste format only', 'Hide', 'Insert row', 'Insert column', 'Delete', 'Delete row', 'Delete column', 'Delete cell', 'Delete cell text', 'Data validation', 'Enable export', 'Disable export', 'Enable editing', 'Disable editing'],
      ['Paper size', 'Page orientation', 'Landscape', 'Portrait'],
      ['Normal', 'Plain text', 'Number', 'Percent', 'RMB', 'USD', 'EUR', 'Date', 'Time', 'Date time', 'Duration'],
      ['Sum', 'Average', 'Max', 'Min', 'IF', 'AND', 'OR', 'CONCAT'],
      ['This value is required', 'Does not match the validation rule', 'Must be between {} and {}', 'Must not be between {} and {}', 'Not in the list', 'Must equal {}', 'Must not equal {}', 'Must be less than {}', 'Must be less than or equal to {}', 'Must be greater than {}', 'Must be greater than or equal to {}'],
      'Not possible with merged cells',
      ['Next', 'Cancel', 'Remove', 'Save', 'OK'],
      ['Sort Z → A', 'Sort A → Z'], '(empty)',
      ['Mode', 'Cell range', 'Criteria', ['Cell', 'Column', 'Row'], ['List', 'Number', 'Date', 'Phone', 'Email'], ['between', 'not between', 'less than', 'less than or equal to', 'greater than', 'greater than or equal to', 'equal to', 'not equal to']]
    ),
    ko: xsDict(
      ['실행 취소', '다시 실행', '인쇄', '서식 복사', '서식 지우기', '표시 형식', '글꼴', '글꼴 크기', '굵게', '기울임꼴', '밑줄', '취소선', '글자 색', '채우기 색', '테두리', '셀 병합', '가로 정렬', '세로 정렬', '텍스트 줄 바꿈', '틀 고정', '필터', '함수', '더보기'],
      ['복사', '잘라내기', '붙여넣기', '값만 붙여넣기', '서식만 붙여넣기', '숨기기', '행 삽입', '열 삽입', '삭제', '행 삭제', '열 삭제', '셀 삭제', '셀 내용 삭제', '데이터 유효성 검사', '내보내기 허용', '내보내기 제외', '편집 허용', '편집 금지'],
      ['용지 크기', '용지 방향', '가로', '세로'],
      ['일반', '텍스트', '숫자', '백분율', '위안(RMB)', '달러(USD)', '유로(EUR)', '날짜', '시간', '날짜 시간', '경과 시간'],
      ['합계', '평균', '최댓값', '최솟값', 'IF', 'AND', 'OR', 'CONCAT'],
      ['필수 입력입니다', '유효성 규칙과 맞지 않습니다', '{}에서 {} 사이여야 합니다', '{}에서 {} 사이가 아니어야 합니다', '목록에 없는 값입니다', '{}와(과) 같아야 합니다', '{}와(과) 달라야 합니다', '{}보다 작아야 합니다', '{} 이하여야 합니다', '{}보다 커야 합니다', '{} 이상이어야 합니다'],
      '병합된 셀에는 이 작업을 할 수 없습니다',
      ['다음', '취소', '제거', '저장', '확인'],
      ['내림차순 정렬 (Z → A)', '오름차순 정렬 (A → Z)'], '(빈 값)',
      ['모드', '셀 범위', '조건', ['셀', '열', '행'], ['목록', '숫자', '날짜', '전화번호', '이메일'], ['사이', '사이 아님', '미만', '이하', '초과', '이상', '같음', '같지 않음']]
    ),
    ja: xsDict(
      ['元に戻す', 'やり直し', '印刷', '書式のコピー', '書式のクリア', '表示形式', 'フォント', 'フォントサイズ', '太字', '斜体', '下線', '取り消し線', '文字の色', '塗りつぶしの色', '罫線', 'セルを結合', '横位置', '縦位置', '折り返して全体を表示', 'ウィンドウ枠の固定', 'フィルター', '関数', 'その他'],
      ['コピー', '切り取り', '貼り付け', '値のみ貼り付け', '書式のみ貼り付け', '非表示', '行を挿入', '列を挿入', '削除', '行を削除', '列を削除', 'セルを削除', 'セルの内容を削除', 'データの入力規則', '書き出しを有効化', '書き出しを無効化', '編集を有効化', '編集を無効化'],
      ['用紙サイズ', '印刷の向き', '横', '縦'],
      ['標準', '文字列', '数値', 'パーセント', '人民元 (RMB)', '米ドル (USD)', 'ユーロ (EUR)', '日付', '時刻', '日時', '経過時間'],
      ['合計', '平均', '最大', '最小', 'IF', 'AND', 'OR', 'CONCAT'],
      ['入力は必須です', '入力規則に一致しません', '{} から {} の間で入力してください', '{} から {} の間以外で入力してください', 'リストにない値です', '{} と等しい値にしてください', '{} と異なる値にしてください', '{} より小さい値にしてください', '{} 以下にしてください', '{} より大きい値にしてください', '{} 以上にしてください'],
      '結合されたセルではこの操作はできません',
      ['次へ', 'キャンセル', '削除', '保存', 'OK'],
      ['降順で並べ替え (Z → A)', '昇順で並べ替え (A → Z)'], '(空白)',
      ['モード', 'セル範囲', '条件', ['セル', '列', '行'], ['リスト', '数値', '日付', '電話番号', 'メール'], ['次の値の間', '次の値の間以外', '次の値より小さい', '次の値以下', '次の値より大きい', '次の値以上', '次の値に等しい', '次の値に等しくない']]
    ),
    zh: xsDict(
      ['撤销', '恢复', '打印', '格式刷', '清除格式', '数字格式', '字体', '字号', '加粗', '倾斜', '下划线', '删除线', '字体颜色', '填充颜色', '边框', '合并单元格', '水平对齐', '垂直对齐', '自动换行', '冻结', '筛选', '函数', '更多'],
      ['复制', '剪切', '粘贴', '仅粘贴值', '仅粘贴格式', '隐藏', '插入行', '插入列', '删除', '删除行', '删除列', '删除单元格', '删除单元格内容', '数据验证', '允许导出', '禁止导出', '允许编辑', '禁止编辑'],
      ['纸张大小', '纸张方向', '横向', '纵向'],
      ['常规', '文本', '数值', '百分比', '人民币', '美元', '欧元', '日期', '时间', '日期时间', '持续时间'],
      ['求和', '平均值', '最大值', '最小值', '条件判断', '与', '或', '文本拼接'],
      ['此值为必填项', '此值不符合验证规则', '此值应在 {} 和 {} 之间', '此值不应在 {} 和 {} 之间', '此值不在列表中', '此值应等于 {}', '此值不应等于 {}', '此值应小于 {}', '此值应小于或等于 {}', '此值应大于 {}', '此值应大于或等于 {}'],
      '无法对合并的单元格执行此操作',
      ['下一步', '取消', '删除', '保存', '确定'],
      ['降序 (Z → A)', '升序 (A → Z)'], '(空白)',
      ['模式', '单元格区域', '条件', ['单元格', '列', '行'], ['列表', '数字', '日期', '手机号', '电子邮件'], ['介于', '不介于', '小于', '小于或等于', '大于', '大于或等于', '等于', '不等于']]
    ),
    'zh-Hant': xsDict(
      ['復原', '取消復原', '列印', '複製格式', '清除格式', '數值格式', '字型', '字型大小', '粗體', '斜體', '底線', '刪除線', '文字色彩', '填滿色彩', '框線', '合併儲存格', '水平對齊', '垂直對齊', '自動換行', '凍結窗格', '篩選', '函數', '更多'],
      ['複製', '剪下', '貼上', '只貼上值', '只貼上格式', '隱藏', '插入列', '插入欄', '刪除', '刪除列', '刪除欄', '刪除儲存格', '刪除儲存格內容', '資料驗證', '允許匯出', '禁止匯出', '允許編輯', '禁止編輯'],
      ['紙張大小', '列印方向', '橫向', '直向'],
      ['一般', '文字', '數值', '百分比', '人民幣', '美元', '歐元', '日期', '時間', '日期時間', '經過時間'],
      ['加總', '平均值', '最大值', '最小值', '條件判斷', '且', '或', '串接文字'],
      ['此欄位為必填', '不符合驗證規則', '值必須介於 {} 和 {} 之間', '值不可介於 {} 和 {} 之間', '值不在清單中', '值必須等於 {}', '值不可等於 {}', '值必須小於 {}', '值必須小於或等於 {}', '值必須大於 {}', '值必須大於或等於 {}'],
      '無法對合併的儲存格執行此操作',
      ['下一步', '取消', '移除', '儲存', '確定'],
      ['遞減排序 (Z → A)', '遞增排序 (A → Z)'], '(空白)',
      ['模式', '儲存格範圍', '準則', ['儲存格', '欄', '列'], ['清單', '數字', '日期', '電話', '電子郵件'], ['介於', '不介於', '小於', '小於或等於', '大於', '大於或等於', '等於', '不等於']]
    ),
    th: xsDict(
      ['เลิกทำ', 'ทำซ้ำ', 'พิมพ์', 'คัดลอกรูปแบบ', 'ล้างรูปแบบ', 'รูปแบบตัวเลข', 'แบบอักษร', 'ขนาดตัวอักษร', 'ตัวหนา', 'ตัวเอียง', 'ขีดเส้นใต้', 'ขีดฆ่า', 'สีตัวอักษร', 'สีเติม', 'เส้นขอบ', 'ผสานเซลล์', 'จัดแนวนอน', 'จัดแนวตั้ง', 'ตัดข้อความ', 'ตรึงแนว', 'ตัวกรอง', 'ฟังก์ชัน', 'เพิ่มเติม'],
      ['คัดลอก', 'ตัด', 'วาง', 'วางเฉพาะค่า', 'วางเฉพาะรูปแบบ', 'ซ่อน', 'แทรกแถว', 'แทรกคอลัมน์', 'ลบ', 'ลบแถว', 'ลบคอลัมน์', 'ลบเซลล์', 'ลบข้อความในเซลล์', 'การตรวจสอบข้อมูล', 'อนุญาตให้ส่งออก', 'ไม่อนุญาตให้ส่งออก', 'อนุญาตให้แก้ไข', 'ไม่อนุญาตให้แก้ไข'],
      ['ขนาดกระดาษ', 'แนวกระดาษ', 'แนวนอน', 'แนวตั้ง'],
      ['ทั่วไป', 'ข้อความ', 'ตัวเลข', 'เปอร์เซ็นต์', 'หยวน (RMB)', 'ดอลลาร์ (USD)', 'ยูโร (EUR)', 'วันที่', 'เวลา', 'วันที่และเวลา', 'ระยะเวลา'],
      ['ผลรวม', 'ค่าเฉลี่ย', 'ค่าสูงสุด', 'ค่าต่ำสุด', 'IF', 'AND', 'OR', 'CONCAT'],
      ['ต้องกรอกค่านี้', 'ไม่ตรงกับกฎการตรวจสอบ', 'ต้องอยู่ระหว่าง {} ถึง {}', 'ต้องไม่อยู่ระหว่าง {} ถึง {}', 'ไม่อยู่ในรายการ', 'ต้องเท่ากับ {}', 'ต้องไม่เท่ากับ {}', 'ต้องน้อยกว่า {}', 'ต้องน้อยกว่าหรือเท่ากับ {}', 'ต้องมากกว่า {}', 'ต้องมากกว่าหรือเท่ากับ {}'],
      'ทำกับเซลล์ที่ผสานไว้ไม่ได้',
      ['ถัดไป', 'ยกเลิก', 'ลบ', 'บันทึก', 'ตกลง'],
      ['เรียง Z → A', 'เรียง A → Z'], '(ว่าง)',
      ['โหมด', 'ช่วงเซลล์', 'เงื่อนไข', ['เซลล์', 'คอลัมน์', 'แถว'], ['รายการ', 'ตัวเลข', 'วันที่', 'โทรศัพท์', 'อีเมล'], ['ระหว่าง', 'ไม่อยู่ระหว่าง', 'น้อยกว่า', 'น้อยกว่าหรือเท่ากับ', 'มากกว่า', 'มากกว่าหรือเท่ากับ', 'เท่ากับ', 'ไม่เท่ากับ']]
    ),
    es: xsDict(
      ['Deshacer', 'Rehacer', 'Imprimir', 'Copiar formato', 'Borrar formato', 'Formato', 'Fuente', 'Tamaño de fuente', 'Negrita', 'Cursiva', 'Subrayado', 'Tachado', 'Color de texto', 'Color de relleno', 'Bordes', 'Combinar celdas', 'Alineación horizontal', 'Alineación vertical', 'Ajustar texto', 'Inmovilizar', 'Filtro', 'Funciones', 'Más'],
      ['Copiar', 'Cortar', 'Pegar', 'Pegar solo valores', 'Pegar solo formato', 'Ocultar', 'Insertar fila', 'Insertar columna', 'Eliminar', 'Eliminar fila', 'Eliminar columna', 'Eliminar celda', 'Borrar contenido', 'Validación de datos', 'Permitir exportar', 'No exportar', 'Permitir edición', 'Bloquear edición'],
      ['Tamaño del papel', 'Orientación', 'Horizontal', 'Vertical'],
      ['General', 'Texto', 'Número', 'Porcentaje', 'Yuan (RMB)', 'Dólar (USD)', 'Euro (EUR)', 'Fecha', 'Hora', 'Fecha y hora', 'Duración'],
      ['Suma', 'Promedio', 'Máximo', 'Mínimo', 'IF', 'AND', 'OR', 'CONCAT'],
      ['Este valor es obligatorio', 'No cumple la regla de validación', 'Debe estar entre {} y {}', 'No debe estar entre {} y {}', 'No está en la lista', 'Debe ser igual a {}', 'No debe ser igual a {}', 'Debe ser menor que {}', 'Debe ser menor o igual que {}', 'Debe ser mayor que {}', 'Debe ser mayor o igual que {}'],
      'No se puede hacer con celdas combinadas',
      ['Siguiente', 'Cancelar', 'Quitar', 'Guardar', 'Aceptar'],
      ['Ordenar Z → A', 'Ordenar A → Z'], '(vacío)',
      ['Modo', 'Rango de celdas', 'Criterio', ['Celda', 'Columna', 'Fila'], ['Lista', 'Número', 'Fecha', 'Teléfono', 'Correo'], ['entre', 'no entre', 'menor que', 'menor o igual que', 'mayor que', 'mayor o igual que', 'igual a', 'distinto de']]
    ),
    fr: xsDict(
      ['Annuler', 'Rétablir', 'Imprimer', 'Reproduire la mise en forme', 'Effacer la mise en forme', 'Format', 'Police', 'Taille de police', 'Gras', 'Italique', 'Souligné', 'Barré', 'Couleur du texte', 'Couleur de remplissage', 'Bordures', 'Fusionner les cellules', 'Alignement horizontal', 'Alignement vertical', 'Renvoyer à la ligne', 'Figer les volets', 'Filtre', 'Fonctions', 'Plus'],
      ['Copier', 'Couper', 'Coller', 'Coller les valeurs', 'Coller la mise en forme', 'Masquer', 'Insérer une ligne', 'Insérer une colonne', 'Supprimer', 'Supprimer la ligne', 'Supprimer la colonne', 'Supprimer la cellule', 'Effacer le contenu', 'Validation des données', 'Autoriser l’export', 'Exclure de l’export', 'Autoriser la modification', 'Verrouiller la modification'],
      ['Format du papier', 'Orientation', 'Paysage', 'Portrait'],
      ['Standard', 'Texte', 'Nombre', 'Pourcentage', 'Yuan (RMB)', 'Dollar (USD)', 'Euro (EUR)', 'Date', 'Heure', 'Date et heure', 'Durée'],
      ['Somme', 'Moyenne', 'Max', 'Min', 'IF', 'AND', 'OR', 'CONCAT'],
      ['Cette valeur est obligatoire', 'Ne respecte pas la règle de validation', 'Doit être entre {} et {}', 'Ne doit pas être entre {} et {}', 'Ne figure pas dans la liste', 'Doit être égal à {}', 'Ne doit pas être égal à {}', 'Doit être inférieur à {}', 'Doit être inférieur ou égal à {}', 'Doit être supérieur à {}', 'Doit être supérieur ou égal à {}'],
      'Impossible avec des cellules fusionnées',
      ['Suivant', 'Annuler', 'Retirer', 'Enregistrer', 'OK'],
      ['Trier de Z à A', 'Trier de A à Z'], '(vide)',
      ['Mode', 'Plage de cellules', 'Critère', ['Cellule', 'Colonne', 'Ligne'], ['Liste', 'Nombre', 'Date', 'Téléphone', 'E-mail'], ['entre', 'pas entre', 'inférieur à', 'inférieur ou égal à', 'supérieur à', 'supérieur ou égal à', 'égal à', 'différent de']]
    ),
    de: xsDict(
      ['Rückgängig', 'Wiederholen', 'Drucken', 'Format übertragen', 'Formatierung löschen', 'Zahlenformat', 'Schriftart', 'Schriftgröße', 'Fett', 'Kursiv', 'Unterstrichen', 'Durchgestrichen', 'Textfarbe', 'Füllfarbe', 'Rahmen', 'Zellen verbinden', 'Horizontal ausrichten', 'Vertikal ausrichten', 'Zeilenumbruch', 'Fixieren', 'Filter', 'Funktionen', 'Mehr'],
      ['Kopieren', 'Ausschneiden', 'Einfügen', 'Nur Werte einfügen', 'Nur Format einfügen', 'Ausblenden', 'Zeile einfügen', 'Spalte einfügen', 'Löschen', 'Zeile löschen', 'Spalte löschen', 'Zelle löschen', 'Zellinhalt löschen', 'Datenüberprüfung', 'Export erlauben', 'Vom Export ausschließen', 'Bearbeitung erlauben', 'Bearbeitung sperren'],
      ['Papierformat', 'Ausrichtung', 'Querformat', 'Hochformat'],
      ['Standard', 'Text', 'Zahl', 'Prozent', 'Yuan (RMB)', 'US-Dollar (USD)', 'Euro (EUR)', 'Datum', 'Uhrzeit', 'Datum und Uhrzeit', 'Dauer'],
      ['Summe', 'Mittelwert', 'Max', 'Min', 'IF', 'AND', 'OR', 'CONCAT'],
      ['Dieser Wert ist erforderlich', 'Entspricht nicht der Prüfregel', 'Muss zwischen {} und {} liegen', 'Darf nicht zwischen {} und {} liegen', 'Nicht in der Liste', 'Muss gleich {} sein', 'Darf nicht gleich {} sein', 'Muss kleiner als {} sein', 'Muss kleiner oder gleich {} sein', 'Muss größer als {} sein', 'Muss größer oder gleich {} sein'],
      'Bei verbundenen Zellen nicht möglich',
      ['Weiter', 'Abbrechen', 'Entfernen', 'Speichern', 'OK'],
      ['Absteigend sortieren (Z → A)', 'Aufsteigend sortieren (A → Z)'], '(leer)',
      ['Modus', 'Zellbereich', 'Kriterium', ['Zelle', 'Spalte', 'Zeile'], ['Liste', 'Zahl', 'Datum', 'Telefon', 'E-Mail'], ['zwischen', 'nicht zwischen', 'kleiner als', 'kleiner oder gleich', 'größer als', 'größer oder gleich', 'gleich', 'ungleich']]
    ),
    it: xsDict(
      ['Annulla', 'Ripeti', 'Stampa', 'Copia formato', 'Cancella formato', 'Formato', 'Carattere', 'Dimensione carattere', 'Grassetto', 'Corsivo', 'Sottolineato', 'Barrato', 'Colore testo', 'Colore riempimento', 'Bordi', 'Unisci celle', 'Allineamento orizzontale', 'Allineamento verticale', 'Testo a capo', 'Blocca riquadri', 'Filtro', 'Funzioni', 'Altro'],
      ['Copia', 'Taglia', 'Incolla', 'Incolla solo valori', 'Incolla solo formato', 'Nascondi', 'Inserisci riga', 'Inserisci colonna', 'Elimina', 'Elimina riga', 'Elimina colonna', 'Elimina cella', 'Cancella contenuto', 'Convalida dati', 'Consenti esportazione', 'Escludi dall’esportazione', 'Consenti modifica', 'Blocca modifica'],
      ['Formato carta', 'Orientamento', 'Orizzontale', 'Verticale'],
      ['Generale', 'Testo', 'Numero', 'Percentuale', 'Yuan (RMB)', 'Dollaro (USD)', 'Euro (EUR)', 'Data', 'Ora', 'Data e ora', 'Durata'],
      ['Somma', 'Media', 'Max', 'Min', 'IF', 'AND', 'OR', 'CONCAT'],
      ['Questo valore è obbligatorio', 'Non rispetta la regola di convalida', 'Deve essere tra {} e {}', 'Non deve essere tra {} e {}', 'Non è nell’elenco', 'Deve essere uguale a {}', 'Non deve essere uguale a {}', 'Deve essere minore di {}', 'Deve essere minore o uguale a {}', 'Deve essere maggiore di {}', 'Deve essere maggiore o uguale a {}'],
      'Impossibile con celle unite',
      ['Avanti', 'Annulla', 'Rimuovi', 'Salva', 'OK'],
      ['Ordina Z → A', 'Ordina A → Z'], '(vuoto)',
      ['Modalità', 'Intervallo celle', 'Criterio', ['Cella', 'Colonna', 'Riga'], ['Elenco', 'Numero', 'Data', 'Telefono', 'E-mail'], ['tra', 'non tra', 'minore di', 'minore o uguale a', 'maggiore di', 'maggiore o uguale a', 'uguale a', 'diverso da']]
    ),
    pt: xsDict(
      ['Desfazer', 'Refazer', 'Imprimir', 'Pincel de formatação', 'Limpar formatação', 'Formato', 'Fonte', 'Tamanho da fonte', 'Negrito', 'Itálico', 'Sublinhado', 'Tachado', 'Cor do texto', 'Cor de preenchimento', 'Bordas', 'Mesclar células', 'Alinhamento horizontal', 'Alinhamento vertical', 'Quebrar texto', 'Congelar painéis', 'Filtro', 'Funções', 'Mais'],
      ['Copiar', 'Recortar', 'Colar', 'Colar somente valores', 'Colar somente formatação', 'Ocultar', 'Inserir linha', 'Inserir coluna', 'Excluir', 'Excluir linha', 'Excluir coluna', 'Excluir célula', 'Limpar conteúdo', 'Validação de dados', 'Permitir exportação', 'Excluir da exportação', 'Permitir edição', 'Bloquear edição'],
      ['Tamanho do papel', 'Orientação', 'Paisagem', 'Retrato'],
      ['Geral', 'Texto', 'Número', 'Porcentagem', 'Yuan (RMB)', 'Dólar (USD)', 'Euro (EUR)', 'Data', 'Hora', 'Data e hora', 'Duração'],
      ['Soma', 'Média', 'Máximo', 'Mínimo', 'IF', 'AND', 'OR', 'CONCAT'],
      ['Este valor é obrigatório', 'Não atende à regra de validação', 'Deve estar entre {} e {}', 'Não deve estar entre {} e {}', 'Não está na lista', 'Deve ser igual a {}', 'Não deve ser igual a {}', 'Deve ser menor que {}', 'Deve ser menor ou igual a {}', 'Deve ser maior que {}', 'Deve ser maior ou igual a {}'],
      'Não é possível com células mescladas',
      ['Próximo', 'Cancelar', 'Remover', 'Salvar', 'OK'],
      ['Classificar Z → A', 'Classificar A → Z'], '(vazio)',
      ['Modo', 'Intervalo de células', 'Critério', ['Célula', 'Coluna', 'Linha'], ['Lista', 'Número', 'Data', 'Telefone', 'E-mail'], ['entre', 'não entre', 'menor que', 'menor ou igual a', 'maior que', 'maior ou igual a', 'igual a', 'diferente de']]
    ),
    ru: xsDict(
      ['Отменить', 'Повторить', 'Печать', 'Копировать формат', 'Очистить формат', 'Формат', 'Шрифт', 'Размер шрифта', 'Полужирный', 'Курсив', 'Подчёркнутый', 'Зачёркнутый', 'Цвет текста', 'Цвет заливки', 'Границы', 'Объединить ячейки', 'По горизонтали', 'По вертикали', 'Перенос текста', 'Закрепить области', 'Фильтр', 'Функции', 'Ещё'],
      ['Копировать', 'Вырезать', 'Вставить', 'Вставить только значения', 'Вставить только формат', 'Скрыть', 'Вставить строку', 'Вставить столбец', 'Удалить', 'Удалить строку', 'Удалить столбец', 'Удалить ячейку', 'Очистить содержимое', 'Проверка данных', 'Разрешить экспорт', 'Исключить из экспорта', 'Разрешить редактирование', 'Запретить редактирование'],
      ['Размер бумаги', 'Ориентация', 'Альбомная', 'Книжная'],
      ['Общий', 'Текстовый', 'Числовой', 'Процентный', 'Юань (RMB)', 'Доллар (USD)', 'Евро (EUR)', 'Дата', 'Время', 'Дата и время', 'Длительность'],
      ['Сумма', 'Среднее', 'Максимум', 'Минимум', 'IF', 'AND', 'OR', 'CONCAT'],
      ['Это значение обязательно', 'Не соответствует правилу проверки', 'Должно быть между {} и {}', 'Не должно быть между {} и {}', 'Значения нет в списке', 'Должно быть равно {}', 'Не должно быть равно {}', 'Должно быть меньше {}', 'Должно быть не больше {}', 'Должно быть больше {}', 'Должно быть не меньше {}'],
      'Невозможно для объединённых ячеек',
      ['Далее', 'Отмена', 'Удалить', 'Сохранить', 'ОК'],
      ['По убыванию (Z → A)', 'По возрастанию (A → Z)'], '(пусто)',
      ['Режим', 'Диапазон ячеек', 'Условие', ['Ячейка', 'Столбец', 'Строка'], ['Список', 'Число', 'Дата', 'Телефон', 'Эл. почта'], ['между', 'вне диапазона', 'меньше', 'меньше или равно', 'больше', 'больше или равно', 'равно', 'не равно']]
    ),
    nl: xsDict(
      ['Ongedaan maken', 'Opnieuw', 'Afdrukken', 'Opmaak kopiëren', 'Opmaak wissen', 'Getalnotatie', 'Lettertype', 'Tekengrootte', 'Vet', 'Cursief', 'Onderstrepen', 'Doorhalen', 'Tekstkleur', 'Opvulkleur', 'Randen', 'Cellen samenvoegen', 'Horizontaal uitlijnen', 'Verticaal uitlijnen', 'Tekstterugloop', 'Blokkeren', 'Filter', 'Functies', 'Meer'],
      ['Kopiëren', 'Knippen', 'Plakken', 'Alleen waarden plakken', 'Alleen opmaak plakken', 'Verbergen', 'Rij invoegen', 'Kolom invoegen', 'Verwijderen', 'Rij verwijderen', 'Kolom verwijderen', 'Cel verwijderen', 'Inhoud wissen', 'Gegevensvalidatie', 'Export toestaan', 'Uitsluiten van export', 'Bewerken toestaan', 'Bewerken blokkeren'],
      ['Papierformaat', 'Afdrukstand', 'Liggend', 'Staand'],
      ['Standaard', 'Tekst', 'Getal', 'Percentage', 'Yuan (RMB)', 'Dollar (USD)', 'Euro (EUR)', 'Datum', 'Tijd', 'Datum en tijd', 'Duur'],
      ['Som', 'Gemiddelde', 'Max', 'Min', 'IF', 'AND', 'OR', 'CONCAT'],
      ['Deze waarde is verplicht', 'Voldoet niet aan de validatieregel', 'Moet tussen {} en {} liggen', 'Mag niet tussen {} en {} liggen', 'Staat niet in de lijst', 'Moet gelijk zijn aan {}', 'Mag niet gelijk zijn aan {}', 'Moet kleiner zijn dan {}', 'Moet kleiner dan of gelijk aan {} zijn', 'Moet groter zijn dan {}', 'Moet groter dan of gelijk aan {} zijn'],
      'Niet mogelijk bij samengevoegde cellen',
      ['Volgende', 'Annuleren', 'Verwijderen', 'Opslaan', 'OK'],
      ['Sorteren Z → A', 'Sorteren A → Z'], '(leeg)',
      ['Modus', 'Celbereik', 'Criterium', ['Cel', 'Kolom', 'Rij'], ['Lijst', 'Getal', 'Datum', 'Telefoon', 'E-mail'], ['tussen', 'niet tussen', 'kleiner dan', 'kleiner dan of gelijk aan', 'groter dan', 'groter dan of gelijk aan', 'gelijk aan', 'niet gelijk aan']]
    )
  };

  /* ===================================================================== SEO 본문 (사용법 + FAQ) — index.html 의 정적 ko 본문·JSON-LD 와 같은 원문 */
  var SEO = {
    en: {
      intro: 'SHEET is a free online spreadsheet editor that works right in your browser — no install, no sign-up. It supports multiple sheets, formulas such as SUM, AVERAGE and IF, merged cells and formatting. Your work is saved automatically and can be exported to .xlsx, .csv or .pdf.',
      howTitle: 'How to use',
      steps: [
        'Click a cell and type. Start with = to enter a formula, e.g. =SUM(A1:A5). You can also edit in the formula bar above the grid.',
        'Use the toolbar for bold, italic, text and fill colors, borders, alignment and merged cells. Right-click to insert or delete rows and columns.',
        'Add sheets with the + button at the bottom and double-click a sheet tab to rename it.',
        'Open .xlsx or .csv files with Import, and save .xlsx (formulas, merges and column widths kept), .csv or .pdf files with Export.',
        'Edits are saved automatically in this browser and restored when you come back. Turn on Google account sync to continue on another PC.'
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        ['Is it free? Do I need to install anything?', 'Yes, it is free and needs no installation or account. It runs in modern browsers such as Chrome, Edge and Safari, including on phones.'],
        ['Where are my spreadsheets stored?', 'Every edit is saved automatically in this browser’s storage (IndexedDB). Like cookies, it is stored per device and browser and is never sent to our servers. Clearing browser data also removes it, so export important files to .xlsx.'],
        ['Can I continue editing on another PC or phone?', 'Turn on “Sync with Google account” and your workbooks are stored in a hidden app folder in your own Google Drive, then loaded automatically on other devices signed in with the same account. The app cannot access any other files in your Drive.'],
        ['Can I open and save Excel (.xlsx) files?', 'Yes. You can import .xlsx and .csv files and export .xlsx files that keep values, formulas, merged cells, column widths and basic formatting. Advanced features such as charts, macros and pivot tables are not supported.'],
        ['Can I save as PDF or print?', 'Export → PDF splits the current sheet into A4 landscape pages and creates a PDF file; Korean, Japanese, Chinese and Thai text are rendered correctly. Print prints only the grid, and you can also choose “Save as PDF” in the print dialog.'],
        ['Which formulas are supported?', 'Common functions such as SUM, AVERAGE, MIN, MAX, IF, AND, OR and CONCAT, plus arithmetic, cell references (A1) and ranges (A1:B5). Formulas with unsupported functions are kept as text so nothing is lost.']
      ]
    },
    ko: {
      intro: 'SHEET 엑셀 에디터는 설치·회원가입 없이 브라우저에서 바로 쓰는 무료 온라인 스프레드시트입니다. 여러 시트, SUM·AVERAGE·IF 같은 수식, 셀 병합과 서식을 지원하며, 작업 내용은 자동 저장되고 .xlsx·.csv·.pdf 파일로 내보낼 수 있습니다.',
      howTitle: '사용법',
      steps: [
        '셀을 클릭해 값을 입력합니다. =로 시작하면 수식이 됩니다(예: =SUM(A1:A5)). 표 위의 수식 입력줄에서도 고칠 수 있습니다.',
        '툴바로 굵게·기울임·글자색·채우기 색·테두리·정렬·셀 병합을 적용하고, 마우스 오른쪽 버튼으로 행과 열을 삽입·삭제합니다.',
        '아래쪽 + 버튼으로 시트를 추가하고, 시트 탭을 두 번 클릭해 이름을 바꿉니다.',
        '「가져오기」로 .xlsx·.csv 파일을 열고, 「내보내기」로 .xlsx(수식·병합·열 너비 유지)·.csv·.pdf 파일을 저장합니다.',
        '편집 내용은 이 브라우저에 자동 저장되고 다시 열면 자동으로 불러옵니다. 다른 PC에서 이어 쓰려면 Google 계정 동기화를 켜세요.'
      ],
      faqTitle: '자주 묻는 질문',
      faq: [
        ['무료인가요? 설치해야 하나요?', '네, 무료이며 설치나 회원가입이 필요 없습니다. 크롬·엣지·사파리 같은 최신 브라우저에서 바로 동작하고 스마트폰에서도 쓸 수 있습니다.'],
        ['작성한 표는 어디에 저장되나요?', '편집할 때마다 이 브라우저의 저장소(IndexedDB)에 자동 저장됩니다. 쿠키처럼 기기·브라우저별로 저장되며 서버로 전송되지 않습니다. 브라우저 데이터를 지우면 함께 지워지므로 중요한 파일은 .xlsx로 내보내 두세요.'],
        ['다른 PC나 휴대폰에서 이어서 편집할 수 있나요?', '「Google 계정으로 동기화」를 켜면 통합문서가 내 Google Drive의 앱 전용 숨김 폴더에 저장되고, 같은 계정으로 로그인한 다른 기기에서 자동으로 불러옵니다. 앱은 이 폴더 밖의 Drive 파일에는 접근할 수 없습니다.'],
        ['엑셀(.xlsx) 파일을 열고 저장할 수 있나요?', '네. .xlsx와 .csv 파일을 가져올 수 있고, 값·수식·셀 병합·열 너비·기본 서식을 유지한 채 .xlsx로 내보낼 수 있습니다. 차트·매크로·피벗 테이블 같은 고급 기능은 지원하지 않습니다.'],
        ['PDF로 저장하거나 인쇄할 수 있나요?', '「내보내기 → PDF」는 현재 시트를 A4 가로 페이지로 나눠 PDF 파일을 만들며, 한국어·일본어·중국어·태국어도 깨지지 않습니다. 「인쇄」는 격자만 깔끔하게 인쇄하고, 인쇄 창에서 ‘PDF로 저장’도 고를 수 있습니다.'],
        ['어떤 수식을 쓸 수 있나요?', 'SUM, AVERAGE, MIN, MAX, IF, AND, OR, CONCAT 같은 자주 쓰는 함수와 사칙연산, 셀 참조(A1), 범위(A1:B5)를 지원합니다. 지원하지 않는 함수가 든 수식도 문자열 그대로 보존되어 사라지지 않습니다.']
      ]
    },
    ja: {
      intro: 'SHEET の表計算エディタは、インストールも会員登録も不要でブラウザからすぐ使える無料のオンライン表計算ソフトです。複数シート、SUM・AVERAGE・IF などの数式、セルの結合や書式に対応し、作業内容は自動保存され、.xlsx・.csv・.pdf に書き出せます。',
      howTitle: '使い方',
      steps: [
        'セルをクリックして入力します。= で始めると数式になります（例: =SUM(A1:A5)）。表の上の数式バーでも編集できます。',
        'ツールバーで太字・斜体・文字の色・塗りつぶし・罫線・配置・セルの結合を設定し、右クリックで行や列を挿入・削除します。',
        '下の + ボタンでシートを追加し、シート見出しをダブルクリックすると名前を変更できます。',
        '「読み込み」で .xlsx・.csv ファイルを開き、「書き出し」で .xlsx（数式・結合・列幅を保持）・.csv・.pdf を保存します。',
        '編集内容はこのブラウザに自動保存され、次に開いたときに自動で読み込まれます。別の PC で続けるには Google アカウント同期をオンにしてください。'
      ],
      faqTitle: 'よくある質問',
      faq: [
        ['無料ですか？ インストールは必要ですか？', 'はい、無料でインストールや会員登録は不要です。Chrome・Edge・Safari などの最新ブラウザで動作し、スマートフォンでも使えます。'],
        ['作った表はどこに保存されますか？', '編集するたびにこのブラウザのストレージ（IndexedDB）に自動保存されます。Cookie のように端末・ブラウザごとに保存され、サーバーには送信されません。ブラウザのデータを消去すると一緒に消えるため、大切なファイルは .xlsx に書き出しておきましょう。'],
        ['別の PC やスマートフォンで続きを編集できますか？', '「Google アカウントで同期」をオンにすると、ブックはご自身の Google ドライブのアプリ専用の非表示フォルダに保存され、同じアカウントでログインした別の端末で自動的に読み込まれます。アプリはこのフォルダ以外のファイルにはアクセスできません。'],
        ['Excel（.xlsx）ファイルを開いたり保存したりできますか？', 'はい。.xlsx と .csv を読み込めるほか、値・数式・セルの結合・列幅・基本的な書式を保ったまま .xlsx に書き出せます。グラフ・マクロ・ピボットテーブルなどの高度な機能には対応していません。'],
        ['PDF で保存したり印刷したりできますか？', '「書き出し → PDF」は現在のシートを A4 横向きのページに分けて PDF を作成します。日本語・韓国語・中国語・タイ語も文字化けしません。「印刷」は表の部分だけを印刷し、印刷画面で「PDF に保存」も選べます。'],
        ['どんな数式が使えますか？', 'SUM、AVERAGE、MIN、MAX、IF、AND、OR、CONCAT などのよく使う関数と四則演算、セル参照（A1）、範囲（A1:B5）に対応しています。対応していない関数を含む数式も文字列のまま保持されるので失われません。']
      ]
    },
    zh: {
      intro: 'SHEET 电子表格编辑器是一款免费的在线电子表格，无需安装或注册，在浏览器中即可使用。支持多个工作表、SUM、AVERAGE、IF 等公式以及合并单元格和格式设置，内容会自动保存，并可导出为 .xlsx、.csv 或 .pdf 文件。',
      howTitle: '使用方法',
      steps: [
        '点击单元格即可输入。以 = 开头即为公式（例如 =SUM(A1:A5)）。也可以在表格上方的编辑栏中修改。',
        '使用工具栏设置加粗、倾斜、文字颜色、填充颜色、边框、对齐和合并单元格；右键可插入或删除行和列。',
        '点击底部的 + 按钮添加工作表，双击工作表标签即可重命名。',
        '通过“导入”打开 .xlsx 或 .csv 文件，通过“导出”保存为 .xlsx（保留公式、合并和列宽）、.csv 或 .pdf。',
        '编辑内容会自动保存在此浏览器中，再次打开时自动载入。要在其他电脑上继续编辑，请开启 Google 账号同步。'
      ],
      faqTitle: '常见问题',
      faq: [
        ['免费吗？需要安装吗？', '是的，完全免费，无需安装或注册。可在 Chrome、Edge、Safari 等现代浏览器中直接使用，手机上也可以。'],
        ['我的表格保存在哪里？', '每次编辑都会自动保存到此浏览器的存储（IndexedDB）中。它像 Cookie 一样按设备和浏览器分别保存，不会发送到我们的服务器。清除浏览器数据时也会一并删除，重要文件请导出为 .xlsx。'],
        ['可以在其他电脑或手机上继续编辑吗？', '开启“使用 Google 账号同步”后，工作簿会保存在你自己 Google 云端硬盘的应用专用隐藏文件夹中，并在使用同一账号登录的其他设备上自动载入。应用无法访问该文件夹以外的任何文件。'],
        ['可以打开和保存 Excel（.xlsx）文件吗？', '可以。支持导入 .xlsx 和 .csv 文件，并能在保留数值、公式、合并单元格、列宽和基本格式的情况下导出为 .xlsx。不支持图表、宏、数据透视表等高级功能。'],
        ['可以保存为 PDF 或打印吗？', '“导出 → PDF”会将当前工作表分成 A4 横向页面并生成 PDF 文件，中文、日文、韩文和泰文都能正常显示。“打印”只打印表格部分，也可以在打印对话框中选择“另存为 PDF”。'],
        ['支持哪些公式？', '支持 SUM、AVERAGE、MIN、MAX、IF、AND、OR、CONCAT 等常用函数，以及四则运算、单元格引用（A1）和区域（A1:B5）。包含不支持函数的公式也会以文本形式完整保留，不会丢失。']
      ]
    },
    'zh-Hant': {
      intro: 'SHEET 試算表編輯器是免費的線上試算表，免安裝、免註冊，在瀏覽器中即可使用。支援多個工作表、SUM、AVERAGE、IF 等公式，以及合併儲存格與格式設定，內容會自動儲存，並可匯出為 .xlsx、.csv 或 .pdf 檔案。',
      howTitle: '使用方式',
      steps: [
        '點選儲存格即可輸入。以 = 開頭即為公式（例如 =SUM(A1:A5)）。也可以在表格上方的資料編輯列中修改。',
        '使用工具列設定粗體、斜體、文字色彩、填滿色彩、框線、對齊與合併儲存格；按右鍵可插入或刪除列與欄。',
        '按下方的 + 按鈕新增工作表，連按兩下工作表標籤即可重新命名。',
        '透過「匯入」開啟 .xlsx 或 .csv 檔案，透過「匯出」儲存為 .xlsx（保留公式、合併與欄寬）、.csv 或 .pdf。',
        '編輯內容會自動儲存在此瀏覽器中，再次開啟時自動載入。若要在其他電腦上繼續編輯，請開啟 Google 帳戶同步。'
      ],
      faqTitle: '常見問題',
      faq: [
        ['免費嗎？需要安裝嗎？', '是的，完全免費，不需要安裝或註冊。可在 Chrome、Edge、Safari 等新式瀏覽器中直接使用，手機上也可以。'],
        ['我的表格儲存在哪裡？', '每次編輯都會自動儲存到此瀏覽器的儲存空間（IndexedDB）。它像 Cookie 一樣依裝置與瀏覽器分別儲存，不會傳送到我們的伺服器。清除瀏覽器資料時也會一併刪除，重要檔案請匯出為 .xlsx。'],
        ['可以在其他電腦或手機上繼續編輯嗎？', '開啟「使用 Google 帳戶同步」後，活頁簿會儲存在你自己 Google 雲端硬碟的應用程式專用隱藏資料夾中，並在以同一帳戶登入的其他裝置上自動載入。應用程式無法存取該資料夾以外的任何檔案。'],
        ['可以開啟和儲存 Excel（.xlsx）檔案嗎？', '可以。支援匯入 .xlsx 與 .csv 檔案，並能在保留數值、公式、合併儲存格、欄寬與基本格式的情況下匯出為 .xlsx。不支援圖表、巨集、樞紐分析表等進階功能。'],
        ['可以儲存為 PDF 或列印嗎？', '「匯出 → PDF」會將目前工作表分成 A4 橫向頁面並產生 PDF 檔案，中文、日文、韓文與泰文都能正確顯示。「列印」只會列印表格部分，也可以在列印對話框中選擇「另存為 PDF」。'],
        ['支援哪些公式？', '支援 SUM、AVERAGE、MIN、MAX、IF、AND、OR、CONCAT 等常用函數，以及四則運算、儲存格參照（A1）與範圍（A1:B5）。含有不支援函數的公式也會以文字形式完整保留，不會遺失。']
      ]
    },
    th: {
      intro: 'SHEET คือโปรแกรมแก้ไขสเปรดชีตออนไลน์ฟรีที่ใช้งานในเบราว์เซอร์ได้ทันที ไม่ต้องติดตั้งหรือสมัครสมาชิก รองรับหลายชีต สูตรอย่าง SUM, AVERAGE และ IF การผสานเซลล์และการจัดรูปแบบ งานของคุณจะถูกบันทึกอัตโนมัติและส่งออกเป็น .xlsx, .csv หรือ .pdf ได้',
      howTitle: 'วิธีใช้',
      steps: [
        'คลิกเซลล์แล้วพิมพ์ได้เลย ขึ้นต้นด้วย = เพื่อใส่สูตร (เช่น =SUM(A1:A5)) และแก้ไขในแถบสูตรด้านบนตารางได้ด้วย',
        'ใช้แถบเครื่องมือเพื่อทำตัวหนา ตัวเอียง สีตัวอักษร สีเติม เส้นขอบ การจัดแนว และผสานเซลล์ คลิกขวาเพื่อแทรกหรือลบแถวและคอลัมน์',
        'เพิ่มชีตด้วยปุ่ม + ด้านล่าง และดับเบิลคลิกแท็บชีตเพื่อเปลี่ยนชื่อ',
        'เปิดไฟล์ .xlsx หรือ .csv ด้วย “นำเข้า” และบันทึกเป็น .xlsx (คงสูตร การผสานเซลล์ และความกว้างคอลัมน์), .csv หรือ .pdf ด้วย “ส่งออก”',
        'การแก้ไขจะถูกบันทึกอัตโนมัติในเบราว์เซอร์นี้และโหลดกลับมาเมื่อเปิดอีกครั้ง หากต้องการทำต่อบนพีซีเครื่องอื่น ให้เปิดการซิงค์บัญชี Google'
      ],
      faqTitle: 'คำถามที่พบบ่อย',
      faq: [
        ['ใช้ฟรีไหม ต้องติดตั้งหรือเปล่า', 'ใช้ฟรีและไม่ต้องติดตั้งหรือสมัครสมาชิก ทำงานได้ในเบราว์เซอร์รุ่นใหม่อย่าง Chrome, Edge และ Safari รวมถึงบนโทรศัพท์'],
        ['ตารางของฉันถูกเก็บไว้ที่ไหน', 'ทุกการแก้ไขจะถูกบันทึกอัตโนมัติในพื้นที่จัดเก็บของเบราว์เซอร์นี้ (IndexedDB) โดยแยกตามอุปกรณ์และเบราว์เซอร์เหมือนคุกกี้ และไม่ถูกส่งไปยังเซิร์ฟเวอร์ของเรา หากล้างข้อมูลเบราว์เซอร์ข้อมูลจะหายไปด้วย จึงควรส่งออกไฟล์สำคัญเป็น .xlsx'],
        ['แก้ไขต่อบนพีซีหรือโทรศัพท์เครื่องอื่นได้ไหม', 'เปิด “ซิงค์ด้วยบัญชี Google” แล้วเวิร์กบุ๊กจะถูกเก็บในโฟลเดอร์ซ่อนเฉพาะของแอปใน Google ไดรฟ์ของคุณ และโหลดอัตโนมัติบนอุปกรณ์อื่นที่ลงชื่อเข้าใช้ด้วยบัญชีเดียวกัน แอปไม่สามารถเข้าถึงไฟล์อื่นนอกโฟลเดอร์นี้'],
        ['เปิดและบันทึกไฟล์ Excel (.xlsx) ได้ไหม', 'ได้ นำเข้าไฟล์ .xlsx และ .csv ได้ และส่งออกเป็น .xlsx โดยคงค่า สูตร การผสานเซลล์ ความกว้างคอลัมน์ และรูปแบบพื้นฐานไว้ ไม่รองรับฟีเจอร์ขั้นสูงอย่างแผนภูมิ มาโคร และตาราง Pivot'],
        ['บันทึกเป็น PDF หรือพิมพ์ได้ไหม', '“ส่งออก → PDF” จะแบ่งชีตปัจจุบันเป็นหน้า A4 แนวนอนแล้วสร้างไฟล์ PDF โดยภาษาไทย เกาหลี ญี่ปุ่น และจีนแสดงผลได้ถูกต้อง ส่วน “พิมพ์” จะพิมพ์เฉพาะตาราง และเลือก “บันทึกเป็น PDF” ในหน้าต่างพิมพ์ได้ด้วย'],
        ['รองรับสูตรอะไรบ้าง', 'รองรับฟังก์ชันที่ใช้บ่อยอย่าง SUM, AVERAGE, MIN, MAX, IF, AND, OR และ CONCAT รวมถึงการคำนวณพื้นฐาน การอ้างอิงเซลล์ (A1) และช่วง (A1:B5) สูตรที่มีฟังก์ชันที่ไม่รองรับจะถูกเก็บไว้เป็นข้อความจึงไม่สูญหาย']
      ]
    },
    es: {
      intro: 'SHEET es un editor de hojas de cálculo en línea y gratuito que funciona directamente en el navegador, sin instalación ni registro. Admite varias hojas, fórmulas como SUM, AVERAGE e IF, celdas combinadas y formato. Tu trabajo se guarda automáticamente y se puede exportar a .xlsx, .csv o .pdf.',
      howTitle: 'Cómo se usa',
      steps: [
        'Haz clic en una celda y escribe. Empieza con = para introducir una fórmula, p. ej. =SUM(A1:A5). También puedes editar en la barra de fórmulas sobre la cuadrícula.',
        'Usa la barra de herramientas para negrita, cursiva, colores de texto y relleno, bordes, alineación y combinar celdas. Haz clic derecho para insertar o eliminar filas y columnas.',
        'Añade hojas con el botón + de abajo y haz doble clic en la pestaña de una hoja para cambiarle el nombre.',
        'Abre archivos .xlsx o .csv con Importar y guarda .xlsx (con fórmulas, combinaciones y anchos de columna), .csv o .pdf con Exportar.',
        'Los cambios se guardan automáticamente en este navegador y se recuperan al volver. Activa la sincronización con tu cuenta de Google para continuar en otro PC.'
      ],
      faqTitle: 'Preguntas frecuentes',
      faq: [
        ['¿Es gratis? ¿Hay que instalar algo?', 'Sí, es gratis y no requiere instalación ni cuenta. Funciona en navegadores modernos como Chrome, Edge y Safari, también en el móvil.'],
        ['¿Dónde se guardan mis hojas de cálculo?', 'Cada cambio se guarda automáticamente en el almacenamiento de este navegador (IndexedDB). Como las cookies, se guarda por dispositivo y navegador y nunca se envía a nuestros servidores. Si borras los datos del navegador también se borra, así que exporta a .xlsx los archivos importantes.'],
        ['¿Puedo seguir editando en otro PC o en el móvil?', 'Activa “Sincronizar con cuenta de Google” y tus libros se guardarán en una carpeta oculta de la app en tu propio Google Drive, y se cargarán automáticamente en otros dispositivos con la misma cuenta. La app no puede acceder a ningún otro archivo de tu Drive.'],
        ['¿Puedo abrir y guardar archivos de Excel (.xlsx)?', 'Sí. Puedes importar archivos .xlsx y .csv y exportar .xlsx conservando valores, fórmulas, celdas combinadas, anchos de columna y formato básico. No se admiten funciones avanzadas como gráficos, macros o tablas dinámicas.'],
        ['¿Puedo guardar en PDF o imprimir?', 'Exportar → PDF divide la hoja actual en páginas A4 horizontales y crea un archivo PDF; el texto en coreano, japonés, chino y tailandés se muestra correctamente. Imprimir solo imprime la cuadrícula y también puedes elegir “Guardar como PDF” en el diálogo de impresión.'],
        ['¿Qué fórmulas se admiten?', 'Funciones habituales como SUM, AVERAGE, MIN, MAX, IF, AND, OR y CONCAT, además de operaciones aritméticas, referencias de celda (A1) y rangos (A1:B5). Las fórmulas con funciones no compatibles se conservan como texto, así que no se pierde nada.']
      ]
    },
    fr: {
      intro: 'SHEET est un tableur en ligne gratuit qui fonctionne directement dans le navigateur, sans installation ni inscription. Il prend en charge plusieurs feuilles, des formules comme SUM, AVERAGE et IF, la fusion de cellules et la mise en forme. Votre travail est enregistré automatiquement et peut être exporté en .xlsx, .csv ou .pdf.',
      howTitle: 'Mode d’emploi',
      steps: [
        'Cliquez sur une cellule et tapez. Commencez par = pour saisir une formule, par ex. =SUM(A1:A5). Vous pouvez aussi modifier dans la barre de formule au-dessus de la grille.',
        'Utilisez la barre d’outils pour le gras, l’italique, les couleurs de texte et de remplissage, les bordures, l’alignement et la fusion de cellules. Faites un clic droit pour insérer ou supprimer des lignes et des colonnes.',
        'Ajoutez des feuilles avec le bouton + en bas et double-cliquez sur un onglet pour le renommer.',
        'Ouvrez des fichiers .xlsx ou .csv avec Importer, et enregistrez en .xlsx (formules, fusions et largeurs de colonnes conservées), .csv ou .pdf avec Exporter.',
        'Les modifications sont enregistrées automatiquement dans ce navigateur et restaurées à votre retour. Activez la synchronisation avec votre compte Google pour continuer sur un autre PC.'
      ],
      faqTitle: 'Questions fréquentes',
      faq: [
        ['Est-ce gratuit ? Faut-il installer quelque chose ?', 'Oui, c’est gratuit, sans installation ni compte. Il fonctionne dans les navigateurs récents comme Chrome, Edge et Safari, y compris sur mobile.'],
        ['Où sont stockés mes tableaux ?', 'Chaque modification est enregistrée automatiquement dans le stockage de ce navigateur (IndexedDB). Comme les cookies, il est propre à chaque appareil et navigateur et n’est jamais envoyé à nos serveurs. Effacer les données du navigateur le supprime aussi : exportez vos fichiers importants en .xlsx.'],
        ['Puis-je continuer sur un autre PC ou sur mon téléphone ?', 'Activez « Synchroniser avec Google » : vos classeurs sont stockés dans un dossier caché de l’app sur votre propre Google Drive, puis chargés automatiquement sur vos autres appareils connectés au même compte. L’app ne peut accéder à aucun autre fichier de votre Drive.'],
        ['Puis-je ouvrir et enregistrer des fichiers Excel (.xlsx) ?', 'Oui. Vous pouvez importer des fichiers .xlsx et .csv et exporter en .xlsx en conservant valeurs, formules, cellules fusionnées, largeurs de colonnes et mise en forme de base. Les fonctions avancées comme les graphiques, les macros ou les tableaux croisés dynamiques ne sont pas prises en charge.'],
        ['Puis-je enregistrer en PDF ou imprimer ?', 'Exporter → PDF découpe la feuille active en pages A4 paysage et crée un fichier PDF ; le coréen, le japonais, le chinois et le thaï s’affichent correctement. Imprimer n’imprime que la grille, et vous pouvez aussi choisir « Enregistrer au format PDF » dans la boîte d’impression.'],
        ['Quelles formules sont prises en charge ?', 'Les fonctions courantes comme SUM, AVERAGE, MIN, MAX, IF, AND, OR et CONCAT, ainsi que les opérations arithmétiques, les références de cellule (A1) et les plages (A1:B5). Les formules contenant des fonctions non prises en charge sont conservées telles quelles : rien n’est perdu.']
      ]
    },
    de: {
      intro: 'SHEET ist ein kostenloser Online-Tabelleneditor, der direkt im Browser läuft – ohne Installation und ohne Anmeldung. Er unterstützt mehrere Blätter, Formeln wie SUM, AVERAGE und IF, verbundene Zellen und Formatierung. Deine Arbeit wird automatisch gespeichert und lässt sich als .xlsx, .csv oder .pdf exportieren.',
      howTitle: 'So funktioniert es',
      steps: [
        'Klicke in eine Zelle und tippe. Beginne mit =, um eine Formel einzugeben, z. B. =SUM(A1:A5). Du kannst auch in der Bearbeitungsleiste über dem Raster ändern.',
        'Über die Symbolleiste setzt du Fett, Kursiv, Text- und Füllfarben, Rahmen, Ausrichtung und verbundene Zellen. Mit der rechten Maustaste fügst du Zeilen und Spalten ein oder löschst sie.',
        'Füge mit der Schaltfläche + unten Blätter hinzu und doppelklicke auf einen Blattreiter, um ihn umzubenennen.',
        'Öffne .xlsx- oder .csv-Dateien mit „Importieren“ und speichere über „Exportieren“ als .xlsx (Formeln, Verbindungen und Spaltenbreiten bleiben erhalten), .csv oder .pdf.',
        'Änderungen werden automatisch in diesem Browser gespeichert und beim nächsten Öffnen wiederhergestellt. Aktiviere die Synchronisierung mit deinem Google-Konto, um auf einem anderen PC weiterzuarbeiten.'
      ],
      faqTitle: 'Häufige Fragen',
      faq: [
        ['Ist das kostenlos? Muss ich etwas installieren?', 'Ja, es ist kostenlos und braucht weder Installation noch Konto. Es läuft in aktuellen Browsern wie Chrome, Edge und Safari – auch auf dem Smartphone.'],
        ['Wo werden meine Tabellen gespeichert?', 'Jede Änderung wird automatisch im Speicher dieses Browsers (IndexedDB) abgelegt. Wie Cookies gilt das pro Gerät und Browser, und nichts wird an unsere Server gesendet. Beim Löschen der Browserdaten wird es ebenfalls entfernt – exportiere wichtige Dateien daher als .xlsx.'],
        ['Kann ich auf einem anderen PC oder Handy weiterarbeiten?', 'Aktiviere „Mit Google-Konto synchronisieren“: Deine Arbeitsmappen werden in einem versteckten App-Ordner in deinem eigenen Google Drive gespeichert und auf anderen Geräten mit demselben Konto automatisch geladen. Die App kann auf keine anderen Dateien in deinem Drive zugreifen.'],
        ['Kann ich Excel-Dateien (.xlsx) öffnen und speichern?', 'Ja. Du kannst .xlsx- und .csv-Dateien importieren und als .xlsx exportieren – Werte, Formeln, verbundene Zellen, Spaltenbreiten und einfache Formatierung bleiben erhalten. Erweiterte Funktionen wie Diagramme, Makros oder Pivot-Tabellen werden nicht unterstützt.'],
        ['Kann ich als PDF speichern oder drucken?', '„Exportieren → PDF“ teilt das aktuelle Blatt in A4-Querformatseiten auf und erstellt eine PDF-Datei; Koreanisch, Japanisch, Chinesisch und Thai werden korrekt dargestellt. „Drucken“ druckt nur das Raster, und im Druckdialog kannst du auch „Als PDF speichern“ wählen.'],
        ['Welche Formeln werden unterstützt?', 'Gängige Funktionen wie SUM, AVERAGE, MIN, MAX, IF, AND, OR und CONCAT sowie Grundrechenarten, Zellbezüge (A1) und Bereiche (A1:B5). Formeln mit nicht unterstützten Funktionen bleiben als Text erhalten, sodass nichts verloren geht.']
      ]
    },
    it: {
      intro: 'SHEET è un editor di fogli di calcolo online e gratuito che funziona direttamente nel browser, senza installazione né registrazione. Supporta più fogli, formule come SUM, AVERAGE e IF, celle unite e formattazione. Il lavoro viene salvato automaticamente e si può esportare in .xlsx, .csv o .pdf.',
      howTitle: 'Come si usa',
      steps: [
        'Fai clic su una cella e scrivi. Inizia con = per inserire una formula, ad es. =SUM(A1:A5). Puoi modificare anche nella barra della formula sopra la griglia.',
        'Usa la barra degli strumenti per grassetto, corsivo, colori di testo e riempimento, bordi, allineamento e celle unite. Fai clic destro per inserire o eliminare righe e colonne.',
        'Aggiungi fogli con il pulsante + in basso e fai doppio clic sulla scheda di un foglio per rinominarlo.',
        'Apri file .xlsx o .csv con Importa e salva in .xlsx (formule, celle unite e larghezze delle colonne mantenute), .csv o .pdf con Esporta.',
        'Le modifiche vengono salvate automaticamente in questo browser e ripristinate quando torni. Attiva la sincronizzazione con l’account Google per continuare su un altro PC.'
      ],
      faqTitle: 'Domande frequenti',
      faq: [
        ['È gratuito? Devo installare qualcosa?', 'Sì, è gratuito e non richiede installazione né account. Funziona nei browser moderni come Chrome, Edge e Safari, anche su smartphone.'],
        ['Dove vengono salvati i miei fogli?', 'Ogni modifica viene salvata automaticamente nello spazio di archiviazione di questo browser (IndexedDB). Come i cookie, è separato per dispositivo e browser e non viene mai inviato ai nostri server. Cancellando i dati del browser viene eliminato anche questo, quindi esporta in .xlsx i file importanti.'],
        ['Posso continuare a modificare su un altro PC o sul telefono?', 'Attiva “Sincronizza con l’account Google”: le cartelle di lavoro vengono salvate in una cartella nascosta dell’app nel tuo Google Drive e caricate automaticamente sugli altri dispositivi collegati allo stesso account. L’app non può accedere a nessun altro file del tuo Drive.'],
        ['Posso aprire e salvare file Excel (.xlsx)?', 'Sì. Puoi importare file .xlsx e .csv ed esportare in .xlsx mantenendo valori, formule, celle unite, larghezze delle colonne e formattazione di base. Funzioni avanzate come grafici, macro e tabelle pivot non sono supportate.'],
        ['Posso salvare in PDF o stampare?', 'Esporta → PDF divide il foglio attuale in pagine A4 orizzontali e crea un file PDF; coreano, giapponese, cinese e thailandese vengono visualizzati correttamente. Stampa stampa solo la griglia e nella finestra di stampa puoi anche scegliere “Salva come PDF”.'],
        ['Quali formule sono supportate?', 'Funzioni comuni come SUM, AVERAGE, MIN, MAX, IF, AND, OR e CONCAT, oltre a operazioni aritmetiche, riferimenti di cella (A1) e intervalli (A1:B5). Le formule con funzioni non supportate vengono conservate come testo, quindi non si perde nulla.']
      ]
    },
    pt: {
      intro: 'SHEET é um editor de planilhas online e gratuito que funciona direto no navegador, sem instalação nem cadastro. Suporta várias planilhas, fórmulas como SUM, AVERAGE e IF, células mescladas e formatação. Seu trabalho é salvo automaticamente e pode ser exportado para .xlsx, .csv ou .pdf.',
      howTitle: 'Como usar',
      steps: [
        'Clique em uma célula e digite. Comece com = para inserir uma fórmula, por ex. =SUM(A1:A5). Você também pode editar na barra de fórmulas acima da grade.',
        'Use a barra de ferramentas para negrito, itálico, cores de texto e preenchimento, bordas, alinhamento e mesclar células. Clique com o botão direito para inserir ou excluir linhas e colunas.',
        'Adicione planilhas com o botão + embaixo e clique duas vezes na guia de uma planilha para renomeá-la.',
        'Abra arquivos .xlsx ou .csv com Importar e salve em .xlsx (fórmulas, mesclagens e larguras de coluna mantidas), .csv ou .pdf com Exportar.',
        'As alterações são salvas automaticamente neste navegador e restauradas quando você volta. Ative a sincronização com a conta Google para continuar em outro PC.'
      ],
      faqTitle: 'Perguntas frequentes',
      faq: [
        ['É grátis? Preciso instalar algo?', 'Sim, é grátis e não exige instalação nem conta. Funciona em navegadores modernos como Chrome, Edge e Safari, inclusive no celular.'],
        ['Onde minhas planilhas ficam salvas?', 'Cada alteração é salva automaticamente no armazenamento deste navegador (IndexedDB). Como os cookies, fica separado por dispositivo e navegador e nunca é enviado aos nossos servidores. Ao limpar os dados do navegador ele também é apagado, então exporte os arquivos importantes para .xlsx.'],
        ['Posso continuar editando em outro PC ou no celular?', 'Ative “Sincronizar com a conta Google” e suas pastas de trabalho serão guardadas em uma pasta oculta do app no seu próprio Google Drive e carregadas automaticamente em outros dispositivos com a mesma conta. O app não consegue acessar nenhum outro arquivo do seu Drive.'],
        ['Posso abrir e salvar arquivos do Excel (.xlsx)?', 'Sim. Você pode importar arquivos .xlsx e .csv e exportar .xlsx mantendo valores, fórmulas, células mescladas, larguras de coluna e formatação básica. Recursos avançados como gráficos, macros e tabelas dinâmicas não são suportados.'],
        ['Posso salvar em PDF ou imprimir?', 'Exportar → PDF divide a planilha atual em páginas A4 na horizontal e cria um arquivo PDF; textos em coreano, japonês, chinês e tailandês aparecem corretamente. Imprimir imprime só a grade, e na janela de impressão você também pode escolher “Salvar como PDF”.'],
        ['Quais fórmulas são suportadas?', 'Funções comuns como SUM, AVERAGE, MIN, MAX, IF, AND, OR e CONCAT, além de operações aritméticas, referências de célula (A1) e intervalos (A1:B5). Fórmulas com funções não suportadas são mantidas como texto, então nada se perde.']
      ]
    },
    ru: {
      intro: 'SHEET — бесплатный онлайн-редактор таблиц, который работает прямо в браузере, без установки и регистрации. Поддерживаются несколько листов, формулы SUM, AVERAGE, IF и другие, объединение ячеек и форматирование. Работа сохраняется автоматически, и её можно экспортировать в .xlsx, .csv или .pdf.',
      howTitle: 'Как пользоваться',
      steps: [
        'Щёлкните ячейку и вводите текст. Начните с =, чтобы ввести формулу, например =SUM(A1:A5). Изменять можно и в строке формул над таблицей.',
        'На панели инструментов задайте полужирный и курсив, цвет текста и заливки, границы, выравнивание и объединение ячеек. Правой кнопкой мыши вставляйте и удаляйте строки и столбцы.',
        'Добавляйте листы кнопкой + внизу, а двойной щелчок по ярлыку листа позволяет его переименовать.',
        'Открывайте файлы .xlsx и .csv через «Импорт», а через «Экспорт» сохраняйте в .xlsx (с формулами, объединениями и шириной столбцов), .csv или .pdf.',
        'Изменения автоматически сохраняются в этом браузере и восстанавливаются при следующем открытии. Чтобы продолжить на другом ПК, включите синхронизацию с аккаунтом Google.'
      ],
      faqTitle: 'Частые вопросы',
      faq: [
        ['Это бесплатно? Нужно что-то устанавливать?', 'Да, бесплатно, без установки и регистрации. Работает в современных браузерах — Chrome, Edge, Safari, в том числе на телефоне.'],
        ['Где хранятся мои таблицы?', 'Каждое изменение автоматически сохраняется в хранилище этого браузера (IndexedDB). Как и cookie, оно своё для каждого устройства и браузера и никогда не отправляется на наши серверы. При очистке данных браузера оно тоже удаляется, поэтому важные файлы экспортируйте в .xlsx.'],
        ['Можно ли продолжить на другом ПК или телефоне?', 'Включите «Синхронизировать с Google» — книги будут храниться в скрытой папке приложения на вашем собственном Google Диске и автоматически загружаться на других устройствах с тем же аккаунтом. Приложение не имеет доступа к другим файлам на вашем Диске.'],
        ['Можно ли открывать и сохранять файлы Excel (.xlsx)?', 'Да. Можно импортировать файлы .xlsx и .csv и экспортировать в .xlsx с сохранением значений, формул, объединённых ячеек, ширины столбцов и базового форматирования. Диаграммы, макросы и сводные таблицы не поддерживаются.'],
        ['Можно ли сохранить в PDF или распечатать?', '«Экспорт → PDF» разбивает текущий лист на альбомные страницы A4 и создаёт PDF-файл; корейский, японский, китайский и тайский текст отображается правильно. «Печать» выводит только таблицу, а в окне печати можно выбрать «Сохранить как PDF».'],
        ['Какие формулы поддерживаются?', 'Популярные функции SUM, AVERAGE, MIN, MAX, IF, AND, OR и CONCAT, арифметика, ссылки на ячейки (A1) и диапазоны (A1:B5). Формулы с неподдерживаемыми функциями сохраняются как текст, так что ничего не теряется.']
      ]
    },
    nl: {
      intro: 'SHEET is een gratis online spreadsheet-editor die direct in je browser werkt, zonder installatie of account. Hij ondersteunt meerdere bladen, formules zoals SUM, AVERAGE en IF, samengevoegde cellen en opmaak. Je werk wordt automatisch opgeslagen en kan worden geëxporteerd naar .xlsx, .csv of .pdf.',
      howTitle: 'Zo werkt het',
      steps: [
        'Klik op een cel en typ. Begin met = om een formule in te voeren, bijv. =SUM(A1:A5). Je kunt ook bewerken in de formulebalk boven het raster.',
        'Gebruik de werkbalk voor vet, cursief, tekst- en opvulkleur, randen, uitlijning en samengevoegde cellen. Klik met rechts om rijen en kolommen in te voegen of te verwijderen.',
        'Voeg bladen toe met de knop + onderaan en dubbelklik op een bladtab om de naam te wijzigen.',
        'Open .xlsx- of .csv-bestanden met Importeren en sla op als .xlsx (formules, samenvoegingen en kolombreedtes blijven behouden), .csv of .pdf met Exporteren.',
        'Wijzigingen worden automatisch in deze browser opgeslagen en hersteld wanneer je terugkomt. Zet synchronisatie met je Google-account aan om verder te werken op een andere pc.'
      ],
      faqTitle: 'Veelgestelde vragen',
      faq: [
        ['Is het gratis? Moet ik iets installeren?', 'Ja, het is gratis en je hebt geen installatie of account nodig. Het werkt in moderne browsers zoals Chrome, Edge en Safari, ook op je telefoon.'],
        ['Waar worden mijn spreadsheets opgeslagen?', 'Elke wijziging wordt automatisch opgeslagen in de opslag van deze browser (IndexedDB). Net als cookies is dat per apparaat en browser, en het wordt nooit naar onze servers gestuurd. Als je de browsergegevens wist, verdwijnt het ook, dus exporteer belangrijke bestanden naar .xlsx.'],
        ['Kan ik verder werken op een andere pc of telefoon?', 'Zet “Synchroniseren met Google-account” aan: je werkmappen worden opgeslagen in een verborgen app-map in je eigen Google Drive en automatisch geladen op andere apparaten met hetzelfde account. De app heeft geen toegang tot andere bestanden in je Drive.'],
        ['Kan ik Excel-bestanden (.xlsx) openen en opslaan?', 'Ja. Je kunt .xlsx- en .csv-bestanden importeren en exporteren naar .xlsx met behoud van waarden, formules, samengevoegde cellen, kolombreedtes en basisopmaak. Geavanceerde functies zoals grafieken, macro’s en draaitabellen worden niet ondersteund.'],
        ['Kan ik opslaan als PDF of afdrukken?', 'Exporteren → PDF verdeelt het huidige blad over liggende A4-pagina’s en maakt een PDF-bestand; Koreaans, Japans, Chinees en Thai worden correct weergegeven. Afdrukken drukt alleen het raster af, en in het afdrukvenster kun je ook “Opslaan als PDF” kiezen.'],
        ['Welke formules worden ondersteund?', 'Veelgebruikte functies zoals SUM, AVERAGE, MIN, MAX, IF, AND, OR en CONCAT, plus rekenkundige bewerkingen, celverwijzingen (A1) en bereiken (A1:B5). Formules met niet-ondersteunde functies blijven als tekst bewaard, dus er gaat niets verloren.']
      ]
    }
  };

  /* ===================================================================== 함수 */
  function normLang(code) {
    if (!code) return null;
    var c = String(code).trim();
    if (LANGS.indexOf(c) >= 0) return c;
    var low = c.toLowerCase();
    if (low === 'zh-hant' || /^zh[-_](tw|hk|mo)/.test(low) || /^zh[-_]hant/.test(low)) return 'zh-Hant';
    if (/^zh/.test(low)) return 'zh';
    var base = low.split(/[-_]/)[0];
    return LANGS.indexOf(base) >= 0 ? base : null;
  }
  // ?lang= → localStorage('excel:lang') → navigator.languages → en
  function detectLang(loc, storage, nav) {
    try {
      var q = new URLSearchParams((loc || root.location || {}).search || '').get('lang');
      var a = normLang(q); if (a) return a;
    } catch (e) { /* ignore */ }
    try {
      var s = normLang((storage || root.localStorage).getItem(STORAGE_KEY)); if (s) return s;
    } catch (e) { /* ignore */ }
    try {
      var n = nav || root.navigator;
      var list = (n && n.languages && n.languages.length ? n.languages : [n && n.language]);
      for (var i = 0; i < list.length; i++) { var m = normLang(list[i]); if (m) return m; }
    } catch (e) { /* ignore */ }
    return 'en';
  }
  function t(lang, key, vars) {
    var s = U[lang] && U[lang][key];
    if (s == null) s = U.en[key];
    if (s == null) s = key;
    if (vars) s = String(s).replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? String(vars[k]) : m; });
    return s;
  }
  function seo(lang) { return SEO[lang] || SEO.en; }
  function merge(base, over) {
    var out = {};
    Object.keys(base).forEach(function (k) {
      var b = base[k], o = over ? over[k] : undefined;
      if (b && typeof b === 'object' && !Array.isArray(b)) out[k] = merge(b, o);
      else out[k] = (o !== undefined && o !== '') ? o : b;
    });
    return out;
  }
  // x-spreadsheet 에 등록할 완전한 사전(en 으로 빈칸 채움) + 달력 요일·월 이름(Intl)
  function xsLocale(lang) {
    var d = merge(XS.en, XS[lang]);
    var weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    try {
      var loc = INTL[lang] || lang;
      var wf = new Intl.DateTimeFormat(loc, { weekday: 'short', timeZone: 'UTC' });
      var mf = new Intl.DateTimeFormat(loc, { month: 'long', timeZone: 'UTC' });
      weeks = weeks.map(function (_, i) { return wf.format(new Date(Date.UTC(2023, 0, 1 + i))); });
      months = months.map(function (_, i) { return mf.format(new Date(Date.UTC(2023, i, 15))); });
    } catch (e) { /* Intl 미지원 — 영어 유지 */ }
    d.calendar = { weeks: weeks, months: months };
    return d;
  }

  // 구조화 데이터: WebApplication(무료) + FAQPage — 화면의 FAQ 와 같은 원문
  function ldJson(lang) {
    var s = seo(lang);
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication', name: 'SHEET — ' + t(lang, 'appName'), url: 'https://excel.broodev.com/',
          applicationCategory: 'BusinessApplication', operatingSystem: 'Web', browserRequirements: 'Requires JavaScript',
          inLanguage: LANGS.slice(), offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, isAccessibleForFree: true,
          description: t(lang, 'desc')
        },
        {
          '@type': 'FAQPage', inLanguage: HTML_LANG[lang] || lang,
          mainEntity: s.faq.map(function (qa) { return { '@type': 'Question', name: qa[0], acceptedAnswer: { '@type': 'Answer', text: qa[1] } }; })
        }
      ]
    };
  }

  root.SheetI18n = {
    LANGS: LANGS, NATIVE: NATIVE, HTML_LANG: HTML_LANG, INTL: INTL, OG_LOCALE: OG_LOCALE, STORAGE_KEY: STORAGE_KEY,
    U: U, XS: XS, SEO: SEO, normLang: normLang, detectLang: detectLang, t: t, seo: seo, xsLocale: xsLocale, ldJson: ldJson,
    htmlLang: function (lang) { return HTML_LANG[lang] || lang; },
    intlLocale: function (lang) { return INTL[lang] || lang; }
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
