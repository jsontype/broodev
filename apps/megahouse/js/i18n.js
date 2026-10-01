/* Megahouse i18n — ko · ja · en
   감지 순서: localStorage(mh:lang) → ?lang= → navigator.language → en (일본어면 ja, 한국어면 ko, 그 외 en)
   마크업: data-i18n="key"(textContent) · data-i18n-html="key"(innerHTML, 사전에 있는 내 문자열만) ·
           data-i18n-title / data-i18n-placeholder / data-i18n-aria-label(속성) · data-lang-current(현재 언어명)
   세 사전의 키는 동일해야 한다(검증 스크립트가 확인). */
(function (root) {
  'use strict';

  var LANGS = ['ko', 'ja', 'en'];
  var NAMES = { ko: '한국어', ja: '日本語', en: 'English' };

  var D = {
    ko: {
      title: 'Megahouse — 사진 → 엑셀 · PPT 격자 배열',
      meta_desc: '사진을 올리면 파일명 순서대로 용지 한 페이지에 가로×세로 개수대로 배열된 엑셀(.xlsx) 또는 파워포인트(.pptx)를 바로 내려받습니다. 브라우저에서만 처리, 서버 전송 없음.',
      tools_heading: 'Megahouse Tools',
      menu_app: '사진 → 엑셀 · PPT',
      footer: '©2026 Megahouse · Y-Systems',
      heading: '사진 → 엑셀 · PPT 격자 배열',
      intro: '사진을 올리면 파일명 순서대로, 선택한 용지 한 페이지에 가로×세로 개수대로 배열된 엑셀(.xlsx) 또는 파워포인트(.pptx) 파일을 바로 내려받습니다. 모든 처리는 브라우저 안에서 — 사진은 서버로 전송되지 않습니다.',
      preview: '미리보기:',
      no_photos: '사진 없음',
      summary: '{n}장 · {p}페이지 ({c}×{r} · {paper} {orient})',
      page_label: '{i} / {n} 페이지',
      clear_all: '전부 지우기',
      remove: '제외',
      download: '{fmt} 다운로드',
      settings: '설정',
      upload_label: '사진 업로드 (여러 장)',
      drop_html: '여기에 사진을 끌어다 놓거나 <br> <span class="text-Primary">클릭해서 선택</span>',
      hint: '1.jpg, 2.jpg, 10.jpg … 파일명의 숫자 순으로 배열됩니다. 여러 번 나눠 올려도 합쳐집니다.',
      fmt_label: '포맷',
      fmt_xlsx: '엑셀 (.xlsx)',
      fmt_pptx: '파워포인트 (.pptx)',
      paper_label: '용지',
      orient_label: '방향',
      orient_portrait: '세로',
      orient_landscape: '가로',
      cols_label: '가로 개수 (앞 숫자)',
      rows_label: '세로 개수 (뒤 숫자)',
      caption_label: '캡션',
      caption_check: '사진 아래 파일명 표시',
      maxpx_label: '이미지 최대 크기 (긴 변)',
      opt_1200: '1200px — 가벼움',
      opt_1600: '1600px — 권장 (인쇄 충분)',
      opt_2400: '2400px — 고화질',
      opt_0: '원본 그대로 (jpg·png·gif)',
      filename_label: '파일 이름',
      generate: '생성 · 다운로드',
      lang_label: '언어',
      st_need: '사진을 먼저 올려 주세요.',
      st_nolib: '{lib} 를 불러오지 못했습니다. 네트워크를 확인해 주세요.',
      st_processing: '이미지 처리 중 {i} / {n} — {name}',
      st_building: '{fmt} 생성 중…',
      st_done: '완료 — {name} ({n}장 · {p}페이지 · {c}×{r})',
      st_fail: '실패: {msg}',
      err_decode: '이미지를 열 수 없습니다: {name}'
    },
    ja: {
      title: 'Megahouse — 写真 → Excel · PPT グリッド配置',
      meta_desc: '写真をアップロードすると、ファイル名順に用紙 1 ページへ横×縦の枚数どおりに配置した Excel(.xlsx) または PowerPoint(.pptx) をすぐにダウンロードできます。処理はブラウザ内のみ、サーバー送信なし。',
      tools_heading: 'Megahouse Tools',
      menu_app: '写真 → Excel · PPT',
      footer: '©2026 Megahouse · Y-Systems',
      heading: '写真 → Excel · PPT グリッド配置',
      intro: '写真をアップロードすると、ファイル名順に、選んだ用紙 1 ページへ横×縦の枚数どおりに配置した Excel(.xlsx) または PowerPoint(.pptx) ファイルをすぐにダウンロードできます。処理はすべてブラウザ内で完結し、写真はサーバーに送信されません。',
      preview: 'プレビュー:',
      no_photos: '写真なし',
      summary: '{n}枚 · {p}ページ（{c}×{r} · {paper} {orient}）',
      page_label: '{i} / {n} ページ',
      clear_all: 'すべて削除',
      remove: '除外',
      download: '{fmt} をダウンロード',
      settings: '設定',
      upload_label: '写真をアップロード（複数可）',
      drop_html: 'ここに写真をドラッグ＆ドロップ、または <br> <span class="text-Primary">クリックして選択</span>',
      hint: '1.jpg, 2.jpg, 10.jpg … ファイル名の数字順に並びます。何回かに分けてアップロードしても結合されます。',
      fmt_label: 'フォーマット',
      fmt_xlsx: 'Excel (.xlsx)',
      fmt_pptx: 'PowerPoint (.pptx)',
      paper_label: '用紙',
      orient_label: '向き',
      orient_portrait: '縦',
      orient_landscape: '横',
      cols_label: '横の枚数（前の数字）',
      rows_label: '縦の枚数（後の数字）',
      caption_label: 'キャプション',
      caption_check: '写真の下にファイル名を表示',
      maxpx_label: '画像の最大サイズ（長辺）',
      opt_1200: '1200px — 軽量',
      opt_1600: '1600px — 推奨（印刷に十分）',
      opt_2400: '2400px — 高画質',
      opt_0: '元のまま（jpg·png·gif）',
      filename_label: 'ファイル名',
      generate: '生成してダウンロード',
      lang_label: '言語',
      st_need: '先に写真をアップロードしてください。',
      st_nolib: '{lib} を読み込めませんでした。ネットワークを確認してください。',
      st_processing: '画像を処理中 {i} / {n} — {name}',
      st_building: '{fmt} を生成中…',
      st_done: '完了 — {name}（{n}枚 · {p}ページ · {c}×{r}）',
      st_fail: '失敗: {msg}',
      err_decode: '画像を開けません: {name}'
    },
    en: {
      title: 'Megahouse — Photos → Excel · PPT Grid',
      meta_desc: 'Upload photos and download an Excel (.xlsx) or PowerPoint (.pptx) file with them laid out in a columns × rows grid per page, ordered by file name. Runs entirely in your browser — nothing is uploaded.',
      tools_heading: 'Megahouse Tools',
      menu_app: 'Photos → Excel · PPT',
      footer: '©2026 Megahouse · Y-Systems',
      heading: 'Photos → Excel · PPT grid',
      intro: 'Upload photos and download an Excel (.xlsx) or PowerPoint (.pptx) file with them laid out in your chosen columns × rows per page, on the paper size you pick, ordered by file name. Everything runs in your browser — nothing is sent to a server.',
      preview: 'Preview:',
      no_photos: 'No photos',
      summary: '{n} photos · {p} page(s) ({c}×{r} · {paper} {orient})',
      page_label: 'Page {i} / {n}',
      clear_all: 'Clear all',
      remove: 'Remove',
      download: 'Download {fmt}',
      settings: 'Settings',
      upload_label: 'Upload photos (multiple)',
      drop_html: 'Drag &amp; drop photos here or <br> <span class="text-Primary">click to select</span>',
      hint: 'Ordered by the number in the file name (1.jpg, 2.jpg, 10.jpg …). Uploading in batches merges them.',
      fmt_label: 'Format',
      fmt_xlsx: 'Excel (.xlsx)',
      fmt_pptx: 'PowerPoint (.pptx)',
      paper_label: 'Paper',
      orient_label: 'Orientation',
      orient_portrait: 'Portrait',
      orient_landscape: 'Landscape',
      cols_label: 'Columns (first number)',
      rows_label: 'Rows (second number)',
      caption_label: 'Caption',
      caption_check: 'Show file name under each photo',
      maxpx_label: 'Max image size (long edge)',
      opt_1200: '1200px — light',
      opt_1600: '1600px — recommended (fine for print)',
      opt_2400: '2400px — high quality',
      opt_0: 'Original (jpg·png·gif)',
      filename_label: 'File name',
      generate: 'Generate & download',
      lang_label: 'Language',
      st_need: 'Please upload photos first.',
      st_nolib: 'Could not load {lib}. Check your network connection.',
      st_processing: 'Processing image {i} / {n} — {name}',
      st_building: 'Building {fmt}…',
      st_done: 'Done — {name} ({n} photos · {p} page(s) · {c}×{r})',
      st_fail: 'Failed: {msg}',
      err_decode: 'Cannot open image: {name}'
    }
  };

  // 'ko-KR' → ko, 'ja' → ja, 'en-US' → en, 그 외 → null
  function norm(tag) {
    tag = String(tag || '').toLowerCase();
    if (tag.indexOf('ko') === 0) return 'ko';
    if (tag.indexOf('ja') === 0) return 'ja';
    if (tag.indexOf('en') === 0) return 'en';
    return null;
  }

  function detect() {
    var saved = null;
    try { saved = localStorage.getItem('mh:lang'); } catch (e) { /* 프라이빗 모드 등 */ }
    if (LANGS.indexOf(saved) >= 0) return saved;
    var q = /[?&]lang=([A-Za-z-]+)/.exec(root.location ? root.location.search : '');
    if (q && norm(q[1])) return norm(q[1]);
    // 브라우저 주 언어만 본다: 일본어→ja, 한국어→ko, 그 외→en
    return norm(root.navigator && root.navigator.language) || 'en';
  }

  var cur = detect();

  function t(key, vars) {
    var s = D[cur] && D[cur][key] != null ? D[cur][key] : (D.en[key] != null ? D.en[key] : key);
    if (vars) s = s.replace(/\{(\w+)\}/g, function (_, k) { return vars[k] != null ? vars[k] : ''; });
    return s;
  }

  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }

  function apply() {
    document.documentElement.lang = cur;
    document.title = t('title');
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', t('meta_desc'));
    each('[data-i18n]', function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    each('[data-i18n-html]', function (el) { el.innerHTML = t(el.getAttribute('data-i18n-html')); });
    ['title', 'placeholder', 'aria-label'].forEach(function (attr) {
      each('[data-i18n-' + attr + ']', function (el) { el.setAttribute(attr, t(el.getAttribute('data-i18n-' + attr))); });
    });
    each('[data-lang-current]', function (el) { el.textContent = NAMES[cur]; });
    each('[data-lang]', function (el) { el.classList.toggle('active', el.getAttribute('data-lang') === cur); });
    try { document.dispatchEvent(new CustomEvent('mh:lang', { detail: cur })); } catch (e) { /* 구형 브라우저 */ }
  }

  function set(lang) {
    if (LANGS.indexOf(lang) < 0) return;
    cur = lang;
    try { localStorage.setItem('mh:lang', lang); } catch (e) { /* 저장 못 해도 이번 세션은 적용 */ }
    apply();
  }

  root.MH_I18N = { t: t, apply: apply, set: set, lang: function () { return cur; }, LANGS: LANGS, NAMES: NAMES };
}(window));
