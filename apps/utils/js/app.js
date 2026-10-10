/* Utils (구 Megahouse) — DOM 연결. 로직은 photo-grid.js (PhotoGrid), 문구는 i18n.js (MH_I18N) 에 있다.
   출력 형식은 페이지가 정한다: index.html <body data-page="xlsx"> → Excel, pptx.html "pptx" → PowerPoint,
   ai.html "ai" → Illustrator(.ai = PDF 호환 · pdf-lib), psd.html "psd" → Photoshop(.psd · ag-psd, 여러 페이지는 JSZip 으로 ZIP)
   (2026-10-03 「写真ならべ」 시리즈로 앱 분리 — 포맷 select 는 없어짐. 그 외 설정은 네 페이지가 localStorage mh:settings 를 공유. dpi 는 psd 페이지에만 select 가 있다)
   프리미엄(2026-10-04): PowerPoint·Illustrator·Photoshop 출력은 유료(js/license.js). 라이선스가 없으면 미리보기까지는 되고
   생성·다운로드 버튼이 「프리미엄 — 요금 보기」로 바뀌어 /pricing 으로 보낸다. Excel 은 항상 무료·전 기능 */
(function () {
  'use strict';
  var PG = window.PhotoGrid, I = window.MH_I18N, LIC = window.MH_LICENSE;
  var t = I.t;
  var PAGE = document.body.getAttribute('data-page');
  var FORMAT = ['pptx', 'ai', 'psd'].indexOf(PAGE) >= 0 ? PAGE : 'xlsx';
  // 형식별 라이브러리(CDN 전역) · 상태 문구용 표시명 — 없으면 st_nolib
  var LIBS = {
    xlsx: { name: 'ExcelJS', get: function () { return window.ExcelJS; }, label: 'XLSX' },
    pptx: { name: 'PptxGenJS', get: function () { return window.PptxGenJS; }, label: 'PPTX' },
    ai: { name: 'pdf-lib', get: function () { return window.PDFLib; }, label: 'Illustrator (.ai)' },
    psd: { name: 'ag-psd', get: function () { return window.agPsd; }, label: 'PSD' }
  };
  function computeLocked() { return !!(LIC && LIC.isPremiumFormat(FORMAT) && !LIC.active()); }  // 프리미엄 형식인데 라이선스 없음 → 다운로드 잠금
  var LOCKED = computeLocked();
  var $files = document.getElementById('pg-files');
  var $drop = document.getElementById('pg-drop');
  var $pages = document.getElementById('pg-pages');
  var $summary = document.getElementById('pg-summary');
  var $status = document.getElementById('pg-status');
  var $paper = document.getElementById('pg-paper');
  var $caption = document.getElementById('pg-caption');
  var $maxPx = document.getElementById('pg-maxpx');         // psd.html 에는 없음(레이어 픽셀은 dpi 가 정함)
  var $dpi = document.getElementById('pg-dpi');             // psd.html 에만 있음
  var $name = document.getElementById('pg-filename');
  var $form = document.getElementById('pg-form');
  var $clear = document.getElementById('pg-clear');
  var $submit = $form.querySelector('button[type="submit"]');
  var $premNote = document.getElementById('pg-prem-note');   // 프리미엄 페이지(pptx·ai·psd)에만 있음 — 잠금 상태 안내(요금 링크)

  var MIME = {
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ai: 'application/octet-stream',    // 내용은 PDF 지만 확장자 .ai 를 브라우저가 바꾸지 않도록
    psd: 'application/octet-stream',
    zip: 'application/zip'
  };

  // 설정 (localStorage 에 저장, 네 페이지 공유) — 용지·방향·가로×세로·캡션·최대 크기·dpi(psd). format 은 페이지 고정(FORMAT)
  var DEFAULTS = { paper: 'A4', orientation: 'portrait', cols: 2, rows: 3, caption: true, maxPx: 1600, dpi: 300 };
  var S = loadSettings();
  function loadSettings() {
    var s = {};
    try { s = JSON.parse(localStorage.getItem('mh:settings') || '{}') || {}; } catch (e) { s = {}; }
    var o = { format: FORMAT };
    for (var k in DEFAULTS) o[k] = s[k] != null ? s[k] : DEFAULTS[k];
    if (!PG.PAPERS[o.paper]) o.paper = 'A4';
    if (o.orientation !== 'landscape') o.orientation = 'portrait';
    o.cols = clamp(o.cols); o.rows = clamp(o.rows);
    o.caption = !!o.caption;
    o.maxPx = [0, 1200, 1600, 2400].indexOf(+o.maxPx) >= 0 ? +o.maxPx : 1600;
    o.dpi = [150, 200, 300].indexOf(+o.dpi) >= 0 ? +o.dpi : 300;
    return o;
  }
  function clamp(n) { n = parseInt(n, 10); return n >= PG.MIN_N && n <= PG.MAX_N ? n : (n > PG.MAX_N ? PG.MAX_N : PG.MIN_N); }
  function saveSettings() { try { localStorage.setItem('mh:settings', JSON.stringify(S)); } catch (e) { /* 무시 */ } }

  var files = [];     // 정렬된 File 목록
  var urls = [];      // 미리보기 object URL (지울 때 revoke)
  var busy = false;
  var lastStatus = null; // 언어 전환 시 같은 상태 문구를 다시 그리기 위한 {key, vars, isError}

  function isImage(f) { return /^image\//i.test(f.type) || /\.(jpe?g|png|gif|webp|bmp|heic|heif|avif)$/i.test(f.name); }

  function addFiles(list) {
    var seen = {};
    files.forEach(function (f) { seen[f.name] = true; });
    Array.prototype.forEach.call(list, function (f) {
      if (!isImage(f) || seen[f.name]) return;
      seen[f.name] = true; files.push(f);
    });
    files.sort(function (a, b) { return PG.naturalCompare(a.name, b.name); });
    render();
  }

  function removeAt(i) { files.splice(i, 1); render(); }

  function clearAll() { files = []; render(); setStatus(null); }

  // 설정 → 컨트롤 표시 동기화 (칩 active, select value, checkbox)
  function syncControls() {
    $paper.value = S.paper;
    $caption.checked = S.caption;
    if ($maxPx) $maxPx.value = String(S.maxPx);
    if ($dpi) $dpi.value = String(S.dpi);
    Array.prototype.forEach.call(document.querySelectorAll('.pg-chips[data-field]'), function (group) {
      var field = group.getAttribute('data-field'), val = String(S[field]);
      Array.prototype.forEach.call(group.querySelectorAll('.choose-item'), function (chip) {
        chip.classList.toggle('active', chip.getAttribute('data-value') === val);
      });
    });
    updateLabels();
  }

  // 격자에 따라 바뀌는 문구: 파일 이름 placeholder (다운로드 버튼은 설정 패널의 submit 하나뿐)
  // 잠금 상태면 버튼 문구를 「프리미엄 — 요금 보기」로 (i18n apply() 가 generate 로 되돌리므로 언어 전환 때마다 다시)
  function updateLabels() {
    $name.placeholder = defaultName();
    if ($submit) {
      if (LOCKED) { $submit.textContent = t('generate_locked'); $submit.classList.add('pg-locked'); }
      else { $submit.textContent = t('generate'); $submit.classList.remove('pg-locked'); }
    }
    if ($premNote) $premNote.hidden = !LOCKED;
    document.body.classList.toggle('pg-is-locked', LOCKED);
  }
  // 라이선스 상태가 바뀌면(요금 페이지에서 활성화 뒤 돌아옴 · 24시간 재검증에서 해지/환불 확인) 잠금을 다시 계산
  document.addEventListener('mh:license', function () { LOCKED = computeLocked(); updateLabels(); });

  function render() {
    urls.forEach(function (u) { URL.revokeObjectURL(u); }); urls = [];
    $pages.innerHTML = '';
    var L = PG.layout(S);
    var n = files.length, pages = PG.pageCount(n, L);
    $summary.textContent = n
      ? t('summary', { n: n, p: pages, c: L.cols, r: L.rows, paper: L.paper, orient: t('orient_' + L.orientation) })
      : t('no_photos');
    for (var p = 0; p < pages; p++) {
      var wrap = document.createElement('div'); wrap.className = 'pg-page-wrap';
      var page = document.createElement('div'); page.className = 'pg-page';
      // 미리보기 비율·격자 = 실제 용지·설정
      page.style.aspectRatio = L.pageW + ' / ' + L.pageH;
      page.style.gridTemplateColumns = 'repeat(' + L.cols + ', minmax(0, 1fr))';
      page.style.gridTemplateRows = 'repeat(' + L.rows + ', minmax(0, 1fr))';
      for (var i = 0; i < L.perPage; i++) {
        var idx = p * L.perPage + i;
        var cell = document.createElement('div');
        if (idx < n) {
          var f = files[idx], url = URL.createObjectURL(f); urls.push(url);
          cell.className = 'pg-cell';
          cell.innerHTML = '<span class="pg-no">' + (idx + 1) + '</span>' +
            '<img alt="" src="' + url + '">' +
            (S.caption ? '<span class="pg-cap">' + escapeHtml(f.name) + '</span>' : '') +
            '<button type="button" class="pg-del" title="' + escapeHtml(t('remove')) + '" data-i="' + idx + '">×</button>';
        } else {
          cell.className = 'pg-cell empty';
        }
        page.appendChild(cell);
      }
      var label = document.createElement('div'); label.className = 'pg-page-label text-Secondary';
      label.textContent = t('page_label', { i: p + 1, n: pages });
      wrap.appendChild(page); wrap.appendChild(label);
      $pages.appendChild(wrap);
    }
  }

  function escapeHtml(s) { return s.replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  // key=null 이면 비움. 언어가 바뀌면 같은 key/vars 로 다시 번역해 그린다.
  function setStatus(key, vars, isError) {
    lastStatus = key ? { key: key, vars: vars, isError: !!isError } : null;
    $status.textContent = key ? t(key, vars) : '';
    $status.style.color = isError ? '#e5484d' : '';
  }

  // 기본 파일명: {가로}x{세로}-{yyyymmdd}-{HHMMSSmmm}.{ext} — ms 까지 넣어 연속 생성해도 안 겹친다
  function defaultName() {
    var d = new Date(), p2 = function (x) { return (x < 10 ? '0' : '') + x; }, p3 = function (x) { return (x < 10 ? '00' : x < 100 ? '0' : '') + x; };
    return S.cols + 'x' + S.rows + '-' +
      d.getFullYear() + p2(d.getMonth() + 1) + p2(d.getDate()) + '-' +
      p2(d.getHours()) + p2(d.getMinutes()) + p2(d.getSeconds()) + p3(d.getMilliseconds()) + '.' + S.format;
  }

  function createCanvas(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  // PDF(.ai) 캡션 중 표준 폰트로 못 쓰는 글자(일본어·한국어 등) → 3배 해상도 투명 PNG 로 (photo-grid.js buildPdf 의 renderCaption 훅)
  function renderCaptionPng(text, wPx, hPx) {
    var k = 3, cv = createCanvas(Math.round(wPx * k), Math.round(hPx * k));
    PG.drawCaption(cv, text, k);
    return cv.toDataURL('image/png');
  }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  // 사용자가 적은 파일 이름(없으면 기본) — 확장자는 떼어 두고 결과 형식에 맞춰 다시 붙인다
  function baseName() { return (($name.value || '').trim() || defaultName()).replace(/\.(xlsx|pptx|ai|psd|pdf|zip)$/i, ''); }

  function generate() {
    if (busy) return;
    if (LOCKED) { location.href = I.href ? I.href('/pricing') : '/pricing'; return; }   // 프리미엄 형식 · 라이선스 없음 → 요금 페이지(확장자 없는 정본 주소 + 현재 언어)
    if (!files.length) { setStatus('st_need', null, true); return; }
    var fmt = S.format, LB = LIBS[fmt];
    var lib = LB.get();
    if (!lib) { setStatus('st_nolib', { lib: LB.name }, true); return; }
    var opts = { paper: S.paper, orientation: S.orientation, cols: S.cols, rows: S.rows, caption: S.caption };
    var pages = PG.pageCount(files.length, PG.layout(opts));
    if (fmt === 'psd' && pages > 1 && !window.JSZip) { setStatus('st_nolib', { lib: 'JSZip' }, true); return; }
    busy = true;
    var base = baseName();   // 한 번만(기본 이름은 타임스탬프라 ZIP 이름과 안의 PSD 이름이 같아야 함)

    function finish(blob, ext) {
      var name = base + '.' + ext;
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = name;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 10000);
      setStatus('st_done', { name: name, n: files.length, p: pages, c: S.cols, r: S.rows });
    }
    function fail(err) {
      var msg = err && err.code === 'decode' ? t('err_decode', { name: err.file })
              : (err && err.message ? err.message : String(err));
      setStatus('st_fail', { msg: msg }, true);
    }

    if (fmt === 'psd') {
      // PSD: 레이어 픽셀 = 용지 × dpi 라 원본을 셀마다 디코드해 다시 그린다(빌더가 load/release 호출). 페이지마다 PSD 1개 → 여러 장이면 ZIP
      var imgs = files.map(function (f) { return { name: f.name, load: function () { return PG.decodeImage(f); }, release: PG.releaseImage }; });
      PG.buildPsd(lib, imgs, opts, { createCanvas: createCanvas, dpi: S.dpi, thumbnail: true, onPage: function (i, n) { setStatus('st_page', { i: i, n: n }); } })
        .then(function (bufs) {
          if (bufs.length === 1) return finish(new Blob([bufs[0]], { type: MIME.psd }), 'psd');
          setStatus('st_building', { fmt: 'ZIP' });
          var zip = new window.JSZip();
          bufs.forEach(function (b, i) { zip.file(base + '-p' + pad2(i + 1) + '.psd', b); });
          return zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 1 } }).then(function (blob) { finish(blob, 'zip'); });
        }).catch(fail).then(function () { busy = false; });
      return;
    }

    // xlsx · pptx · ai: 이미지를 base64 로 읽어(최대 크기 적용) 빌더에 넘긴다. ai(PDF)는 gif 를 못 넣으므로 원본 통과를 jpeg/png 로 제한
    var images = [];
    var chain = Promise.resolve();
    files.forEach(function (f, i) {
      chain = chain.then(function () {
        setStatus('st_processing', { i: i + 1, n: files.length, name: f.name });
        return PG.readImage(f, S.maxPx, fmt === 'ai' ? PG.PDF_PASSTHROUGH : null).then(function (im) { images.push(im); });
      });
    });
    chain.then(function () {
      setStatus('st_building', { fmt: LB.label });
      if (fmt === 'pptx') return PG.buildPptx(lib, images, opts).write({ outputType: 'blob' });
      if (fmt === 'ai') {
        opts.renderCaption = renderCaptionPng;
        return PG.buildPdf(lib, images, opts).then(function (bytes) { return new Blob([bytes], { type: MIME.ai }); });
      }
      return PG.buildWorkbook(lib, images, opts).xlsx.writeBuffer().then(function (buf) { return new Blob([buf], { type: MIME.xlsx }); });
    }).then(function (blob) { finish(blob, fmt); }).catch(fail).then(function () { busy = false; });
  }

  // 입력
  $files.addEventListener('change', function () { addFiles($files.files); $files.value = ''; });
  ['dragenter', 'dragover'].forEach(function (ev) {
    $drop.addEventListener(ev, function (e) { e.preventDefault(); $drop.classList.add('dragover'); });
  });
  ['dragleave', 'drop'].forEach(function (ev) {
    $drop.addEventListener(ev, function (e) { e.preventDefault(); $drop.classList.remove('dragover'); });
  });
  $drop.addEventListener('drop', function (e) { if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files); });
  $pages.addEventListener('click', function (e) {
    var btn = e.target.closest('.pg-del'); if (btn) removeAt(parseInt(btn.getAttribute('data-i'), 10));
  });
  $clear.addEventListener('click', function (e) { e.preventDefault(); clearAll(); });
  $form.addEventListener('submit', function (e) { e.preventDefault(); generate(); });

  // 설정 컨트롤 → S → 저장 + 미리보기 갱신
  $paper.addEventListener('change', function () { S.paper = PG.PAPERS[$paper.value] ? $paper.value : 'A4'; saveSettings(); render(); });
  $caption.addEventListener('change', function () { S.caption = $caption.checked; saveSettings(); render(); });
  if ($maxPx) $maxPx.addEventListener('change', function () { S.maxPx = parseInt($maxPx.value, 10) || 0; saveSettings(); });
  if ($dpi) $dpi.addEventListener('change', function () { S.dpi = [150, 200, 300].indexOf(parseInt($dpi.value, 10)) >= 0 ? parseInt($dpi.value, 10) : 300; saveSettings(); });
  Array.prototype.forEach.call(document.querySelectorAll('.pg-chips[data-field]'), function (group) {
    var field = group.getAttribute('data-field');
    group.addEventListener('click', function (e) {
      var chip = e.target.closest('.choose-item'); if (!chip) return;
      var v = chip.getAttribute('data-value');
      S[field] = (field === 'cols' || field === 'rows') ? clamp(v) : v;
      saveSettings(); syncControls(); render();
    });
  });

  // 언어 풀다운 (헤더) — 자체 토글(Bootstrap dropdown/Popper 의존 없음). 항목 클릭 → 전환 + 저장
  var $lang = document.getElementById('pg-lang'), $langToggle = document.getElementById('pg-lang-toggle');
  function closeLang() {
    if (!$lang) return;
    $lang.classList.remove('open');
    if ($langToggle) $langToggle.setAttribute('aria-expanded', 'false');
  }
  if ($lang && $langToggle) {
    $langToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = $lang.classList.toggle('open');
      $langToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) { if (!$lang.contains(e.target)) closeLang(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLang(); });
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-lang]'), function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); I.set(el.getAttribute('data-lang')); closeLang(); });
  });
  // broodev.com 법적 문서 링크에 현재 언어를 실어 보냄 — legal.js 가 ?lang= 을 읽어 같은 언어로 연다(ja·ko·en 외는 en 본문 + 그 언어 안내)
  function carryLang(lang) {
    Array.prototype.forEach.call(document.querySelectorAll('a[href^="https://broodev.com/"]'), function (a) {
      try { var u = new URL(a.href); u.searchParams.set('lang', lang); a.href = u.toString(); } catch (e) { /* 구형 브라우저 */ }
    });
  }

  // 언어가 바뀌면 동적으로 그린 부분(요약·페이지 라벨·제외 버튼·버튼 문구·상태 문구)도 다시 번역
  document.addEventListener('mh:lang', function () {
    updateLabels();
    render();
    carryLang(I.lang());
    if (lastStatus) setStatus(lastStatus.key, lastStatus.vars, lastStatus.isError);
  });

  I.apply();
  syncControls();
  render();
}());
