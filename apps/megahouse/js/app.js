/* Megahouse — DOM 연결. 로직은 photo-grid.js (PhotoGrid), 문구는 i18n.js (MH_I18N) 에 있다. */
(function () {
  'use strict';
  var PG = window.PhotoGrid, I = window.MH_I18N;
  var t = I.t;
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

  function render() {
    urls.forEach(function (u) { URL.revokeObjectURL(u); }); urls = [];
    $pages.innerHTML = '';
    var n = files.length, pages = Math.ceil(n / PG.PER_PAGE);
    $summary.textContent = n ? t('summary', { n: n, p: pages }) : t('no_photos');
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

  function defaultName() {
    var d = new Date(), pad = function (x) { return (x < 10 ? '0' : '') + x; };
    return 'photos-2x3-' + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + '.xlsx';
  }

  function generate() {
    if (busy) return;
    if (!files.length) { setStatus('st_need', null, true); return; }
    if (!window.ExcelJS) { setStatus('st_noexcel', null, true); return; }
    busy = true;
    var maxPx = parseInt($maxPx.value, 10) || 0;
    var images = [];
    var chain = Promise.resolve();
    files.forEach(function (f, i) {
      chain = chain.then(function () {
        setStatus('st_processing', { i: i + 1, n: files.length, name: f.name });
        return PG.readImage(f, maxPx).then(function (im) { images.push(im); });
      });
    });
    chain.then(function () {
      setStatus('st_building');
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
      setStatus('st_done', { name: name, n: images.length, p: Math.ceil(images.length / PG.PER_PAGE) });
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
  $download.addEventListener('click', function (e) { e.preventDefault(); generate(); });
  $form.addEventListener('submit', function (e) { e.preventDefault(); generate(); });
  $name.placeholder = defaultName();

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
  // 언어가 바뀌면 동적으로 그린 부분(요약·페이지 라벨·제외 버튼·상태 문구)도 다시 번역
  document.addEventListener('mh:lang', function () {
    render();
    if (lastStatus) setStatus(lastStatus.key, lastStatus.vars, lastStatus.isError);
  });

  I.apply();
  render();
}());
