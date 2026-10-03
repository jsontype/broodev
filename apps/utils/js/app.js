/* Utils (구 Megahouse) — DOM 연결. 로직은 photo-grid.js (PhotoGrid), 문구는 i18n.js (MH_I18N) 에 있다.
   출력 형식은 페이지가 정한다: index.html <body data-page="xlsx"> → Excel, pptx.html <body data-page="pptx"> → PowerPoint
   (2026-10-03 「写真ならべ」 시리즈로 앱 분리 — 포맷 select 는 없어짐. 그 외 설정은 두 페이지가 localStorage mh:settings 를 공유)
   프리미엄(2026-10-04): PowerPoint·Illustrator·Photoshop 출력은 유료(js/license.js). 라이선스가 없으면 미리보기까지는 되고
   생성·다운로드 버튼이 「프리미엄 — 요금 보기」로 바뀌어 pricing.html 로 보낸다. Excel 은 항상 무료·전 기능 */
(function () {
  'use strict';
  var PG = window.PhotoGrid, I = window.MH_I18N, LIC = window.MH_LICENSE;
  var t = I.t;
  var FORMAT = document.body.getAttribute('data-page') === 'pptx' ? 'pptx' : 'xlsx';
  var LOCKED = !!(LIC && LIC.isPremiumFormat(FORMAT) && !LIC.active());  // 프리미엄 형식인데 라이선스 없음 → 다운로드 잠금
  var $files = document.getElementById('pg-files');
  var $drop = document.getElementById('pg-drop');
  var $pages = document.getElementById('pg-pages');
  var $summary = document.getElementById('pg-summary');
  var $status = document.getElementById('pg-status');
  var $paper = document.getElementById('pg-paper');
  var $caption = document.getElementById('pg-caption');
  var $maxPx = document.getElementById('pg-maxpx');
  var $name = document.getElementById('pg-filename');
  var $form = document.getElementById('pg-form');
  var $clear = document.getElementById('pg-clear');
  var $submit = $form.querySelector('button[type="submit"]');
  var $premNote = document.getElementById('pg-prem-note');   // pptx.html 에만 있음 — 잠금 상태 안내(요금 링크)

  var MIME = {
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  };

  // 설정 (localStorage 에 저장, Excel·PowerPoint 페이지 공유) — 용지·방향·가로×세로·캡션·최대 크기. format 은 페이지 고정(FORMAT)
  var DEFAULTS = { paper: 'A4', orientation: 'portrait', cols: 2, rows: 3, caption: true, maxPx: 1600 };
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
    $maxPx.value = String(S.maxPx);
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
    if (LOCKED && $submit) { $submit.textContent = t('generate_locked'); $submit.classList.add('pg-locked'); }
    if ($premNote) $premNote.hidden = !LOCKED;
    document.body.classList.toggle('pg-is-locked', LOCKED);
  }

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

  function generate() {
    if (busy) return;
    if (LOCKED) { location.href = 'pricing.html'; return; }   // 프리미엄 형식 · 라이선스 없음 → 요금 페이지
    if (!files.length) { setStatus('st_need', null, true); return; }
    var fmt = S.format, FMT = fmt.toUpperCase();
    var lib = fmt === 'pptx' ? window.PptxGenJS : window.ExcelJS;
    if (!lib) { setStatus('st_nolib', { lib: fmt === 'pptx' ? 'PptxGenJS' : 'ExcelJS' }, true); return; }
    busy = true;
    var opts = { paper: S.paper, orientation: S.orientation, cols: S.cols, rows: S.rows, caption: S.caption };
    var images = [];
    var chain = Promise.resolve();
    files.forEach(function (f, i) {
      chain = chain.then(function () {
        setStatus('st_processing', { i: i + 1, n: files.length, name: f.name });
        return PG.readImage(f, S.maxPx).then(function (im) { images.push(im); });
      });
    });
    chain.then(function () {
      setStatus('st_building', { fmt: FMT });
      if (fmt === 'pptx') {
        return PG.buildPptx(lib, images, opts).write({ outputType: 'blob' });
      }
      return PG.buildWorkbook(lib, images, opts).xlsx.writeBuffer().then(function (buf) { return new Blob([buf], { type: MIME.xlsx }); });
    }).then(function (blob) {
      var name = ($name.value || '').trim() || defaultName();
      name = name.replace(/\.(xlsx|pptx)$/i, '') + '.' + fmt;   // 포맷과 확장자 일치
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = name;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 10000);
      setStatus('st_done', { name: name, n: images.length, p: PG.pageCount(images.length, PG.layout(opts)), c: S.cols, r: S.rows });
    }).catch(function (err) {
      var msg = err && err.code === 'decode' ? t('err_decode', { name: err.file })
              : (err && err.message ? err.message : String(err));
      setStatus('st_fail', { msg: msg }, true);
    }).then(function () { busy = false; });
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
  $maxPx.addEventListener('change', function () { S.maxPx = parseInt($maxPx.value, 10) || 0; saveSettings(); });
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
