/* Megahouse — DOM 연결. 로직은 photo-grid.js (PhotoGrid) 에 있다. */
(function () {
  'use strict';
  var PG = window.PhotoGrid;
  var $files = document.getElementById('pg-files');
  var $drop = document.getElementById('pg-drop');
  var $pages = document.getElementById('pg-pages');
  var $summary = document.getElementById('pg-summary');
  var $status = document.getElementById('pg-status');
  var $caption = document.getElementById('pg-caption');
  var $maxPx = document.getElementById('pg-maxpx');
  var $name = document.getElementById('pg-filename');
  var $form = document.getElementById('pg-form');
  var $download = document.getElementById('pg-download');
  var $clear = document.getElementById('pg-clear');

  var files = [];     // 정렬된 File 목록
  var urls = [];      // 미리보기 object URL (지울 때 revoke)
  var busy = false;

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

  function clearAll() { files = []; render(); setStatus(''); }

  function render() {
    urls.forEach(function (u) { URL.revokeObjectURL(u); }); urls = [];
    $pages.innerHTML = '';
    var n = files.length, pages = Math.ceil(n / PG.PER_PAGE);
    $summary.textContent = n ? n + '장 · ' + pages + '페이지 (2×3)' : '사진 없음';
    $download.setAttribute('aria-disabled', n ? 'false' : 'true');
    for (var p = 0; p < pages; p++) {
      var wrap = document.createElement('div'); wrap.className = 'pg-page-wrap';
      var page = document.createElement('div'); page.className = 'pg-page';
      for (var i = 0; i < PG.PER_PAGE; i++) {
        var idx = p * PG.PER_PAGE + i;
        var cell = document.createElement('div');
        if (idx < n) {
          var f = files[idx], url = URL.createObjectURL(f); urls.push(url);
          cell.className = 'pg-cell';
          cell.innerHTML = '<span class="pg-no">' + (idx + 1) + '</span>' +
            '<img alt="" src="' + url + '">' +
            '<span class="pg-cap">' + escapeHtml(f.name) + '</span>' +
            '<button type="button" class="pg-del" title="제외" data-i="' + idx + '">×</button>';
        } else {
          cell.className = 'pg-cell empty';
        }
        page.appendChild(cell);
      }
      var label = document.createElement('div'); label.className = 'pg-page-label text-Secondary';
      label.textContent = 'Page ' + (p + 1) + ' / ' + pages;
      wrap.appendChild(page); wrap.appendChild(label);
      $pages.appendChild(wrap);
    }
  }

  function escapeHtml(s) { return s.replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function setStatus(msg, isError) {
    $status.textContent = msg || '';
    $status.style.color = isError ? '#e5484d' : '';
  }

  function defaultName() {
    var d = new Date(), pad = function (x) { return (x < 10 ? '0' : '') + x; };
    return 'photos-2x3-' + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + '.xlsx';
  }

  function generate() {
    if (busy) return;
    if (!files.length) { setStatus('사진을 먼저 올려 주세요.', true); return; }
    if (!window.ExcelJS) { setStatus('ExcelJS 를 불러오지 못했습니다. 네트워크를 확인해 주세요.', true); return; }
    busy = true;
    var maxPx = parseInt($maxPx.value, 10) || 0;
    var images = [];
    var chain = Promise.resolve();
    files.forEach(function (f, i) {
      chain = chain.then(function () {
        setStatus('이미지 처리 중 ' + (i + 1) + ' / ' + files.length + ' — ' + f.name);
        return PG.readImage(f, maxPx).then(function (im) { images.push(im); });
      });
    });
    chain.then(function () {
      setStatus('엑셀 생성 중…');
      var wb = PG.buildWorkbook(window.ExcelJS, images, { caption: $caption.checked });
      return wb.xlsx.writeBuffer();
    }).then(function (buf) {
      var blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      var name = ($name.value || '').trim() || defaultName();
      if (!/\.xlsx$/i.test(name)) name += '.xlsx';
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = name;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 10000);
      setStatus('완료 — ' + name + ' (' + images.length + '장 · ' + Math.ceil(images.length / PG.PER_PAGE) + '페이지)');
    }).catch(function (err) {
      setStatus('실패: ' + (err && err.message ? err.message : err), true);
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
  $download.addEventListener('click', function (e) { e.preventDefault(); generate(); });
  $form.addEventListener('submit', function (e) { e.preventDefault(); generate(); });
  $name.placeholder = defaultName();

  render();
}());
