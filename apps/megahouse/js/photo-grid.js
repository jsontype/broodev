/* Megahouse — 사진 → 엑셀 2×3 배열
   핵심 로직. DOM 의존이 없는 부분(layout·naturalCompare·buildWorkbook)은
   Node 에서도 그대로 돌아가므로 scripts/ 검증에 재사용한다.
   브라우저 전용은 readImage() 뿐. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PhotoGrid = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var COLS = 2, ROWS = 3, PER_PAGE = COLS * ROWS;
  var DPI = 96, EMU_PER_PX = 9525;
  // A4 세로(96dpi): 794×1123px. 여백 0.4in. Excel 은 100% 배율에서 1px = 1/96in 로 인쇄한다.
  var PAGE_W = 794, PAGE_H = 1123, MARGIN_IN = 0.4;
  var GAP = 16, CAPTION_H = 22;
  // 열폭(문자→px)·행높이(pt→px) 변환이 근사치라 페이지 밖으로 밀리지 않게 여유를 둔다
  var SLACK_W = 8, SLACK_H = 10;

  function pxToColWidth(px) { return (px - 5) / 7; }  // Calibri 11: 최대 숫자폭 7px, 패딩 5px
  function pxToRowHeight(px) { return px * 0.75; }    // 1px = 0.75pt
  function colLetter(n) { return String.fromCharCode(64 + n); }

  function layout(caption) {
    var printW = Math.floor(PAGE_W - 2 * MARGIN_IN * DPI) - SLACK_W;
    var printH = Math.floor(PAGE_H - 2 * MARGIN_IN * DPI) - SLACK_H;
    var cellW = Math.floor((printW - GAP * (COLS - 1)) / COLS);
    var cellH = Math.floor((printH - GAP * (ROWS - 1)) / ROWS);
    var capH = caption ? CAPTION_H : 0;
    return { cellW: cellW, cellH: cellH, imgH: cellH - capH, capH: capH };
  }

  // 1.jpg, 2.jpg, 10.jpg 순서가 되도록 숫자 인식 정렬
  function naturalCompare(a, b) {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  }

  function fit(w, h, boxW, boxH) {
    var s = Math.min(boxW / w, boxH / h);
    return { w: Math.max(1, Math.round(w * s)), h: Math.max(1, Math.round(h * s)) };
  }

  /**
   * images: [{ name, base64, extension('jpeg'|'png'|'gif'), width, height }] — 이미 정렬된 순서
   * opts:   { caption: true, sheetName: 'Photos' }
   * ExcelJS: 브라우저 전역 ExcelJS 또는 require('exceljs')
   */
  function buildWorkbook(ExcelJS, images, opts) {
    opts = opts || {};
    var caption = opts.caption !== false;
    var L = layout(caption);
    var wb = new ExcelJS.Workbook();
    wb.creator = 'Megahouse';
    var ws = wb.addWorksheet(opts.sheetName || 'Photos', {
      pageSetup: {
        paperSize: 9, orientation: 'portrait', horizontalCentered: true,
        // 열폭 근사 오차로 가로가 넘쳐도 2페이지로 쪼개지지 않게 — 가로만 1페이지 맞춤(세로는 수동 나눔)
        fitToPage: true, fitToWidth: 1, fitToHeight: 0,
        margins: { left: MARGIN_IN, right: MARGIN_IN, top: MARGIN_IN, bottom: MARGIN_IN, header: 0.2, footer: 0.2 }
      },
      views: [{ showGridLines: false }]
    });

    // 열: [셀][간격][셀]
    var colPx = [];
    for (var c = 0; c < COLS; c++) { colPx.push(L.cellW); if (c < COLS - 1) colPx.push(GAP); }
    colPx.forEach(function (px, i) { ws.getColumn(i + 1).width = pxToColWidth(px); });

    var pages = Math.ceil(images.length / PER_PAGE);
    var row = 1; // 1-based
    for (var p = 0; p < pages; p++) {
      for (var r = 0; r < ROWS; r++) {
        var imgRow = row, capRow = row + 1;
        ws.getRow(imgRow).height = pxToRowHeight(L.imgH);
        if (caption) ws.getRow(capRow).height = pxToRowHeight(L.capH);
        for (var c2 = 0; c2 < COLS; c2++) {
          var idx = p * PER_PAGE + r * COLS + c2;
          if (idx >= images.length) continue;
          var im = images[idx];
          var colIdx = c2 * 2; // 0-based, 간격열 건너뜀
          var sz = fit(im.width, im.height, L.cellW, L.imgH);
          var offX = Math.floor((L.cellW - sz.w) / 2), offY = Math.floor((L.imgH - sz.h) / 2);
          var id = wb.addImage({ base64: im.base64, extension: im.extension || 'jpeg' });
          // nativeCol/Off 를 직접 주면 EMU 단위로 정확히 놓인다 (분수 col 은 ExcelJS 내부 단위가 달라 어긋남)
          ws.addImage(id, {
            tl: { nativeCol: colIdx, nativeColOff: offX * EMU_PER_PX, nativeRow: imgRow - 1, nativeRowOff: offY * EMU_PER_PX },
            ext: { width: sz.w, height: sz.h },
            editAs: 'oneCell'
          });
          if (caption) {
            var cell = ws.getCell(capRow, colIdx + 1);
            cell.value = im.name;
            cell.alignment = { horizontal: 'center', vertical: 'middle', shrinkToFit: true };
            cell.font = { name: 'Calibri', size: 9, color: { argb: 'FF444444' } };
          }
        }
        row += caption ? 2 : 1;
        if (r < ROWS - 1) { ws.getRow(row).height = pxToRowHeight(GAP); row += 1; }
      }
      // 페이지의 마지막 행 뒤에서 강제 나눔 (brk id = 그 행 번호)
      if (p < pages - 1) ws.getRow(row - 1).addPageBreak();
    }
    ws.pageSetup.printArea = 'A1:' + colLetter(colPx.length) + (row - 1);
    return wb;
  }

  /* ---------- 브라우저 전용 ---------- */

  // File → { name, base64, extension, width, height }. maxPx=0 이면 원본 바이트 그대로(jpeg/png/gif 한정).
  function readImage(file, maxPx) {
    var type = (file.type || '').toLowerCase();
    var passthrough = maxPx === 0 && /^image\/(jpeg|png|gif)$/.test(type);
    return decode(file).then(function (bmp) {
      var w = bmp.width, h = bmp.height;
      if (passthrough) {
        return readDataURL(file).then(function (dataUrl) {
          release(bmp);
          return { name: file.name, base64: dataUrl, extension: type.replace('image/', ''), width: w, height: h };
        });
      }
      var scale = maxPx > 0 ? Math.min(1, maxPx / Math.max(w, h)) : 1;
      var cw = Math.max(1, Math.round(w * scale)), ch = Math.max(1, Math.round(h * scale));
      var canvas = document.createElement('canvas');
      canvas.width = cw; canvas.height = ch;
      canvas.getContext('2d').drawImage(bmp, 0, 0, cw, ch);
      release(bmp);
      var png = type === 'image/png';
      var dataUrl = png ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.9);
      return { name: file.name, base64: dataUrl, extension: png ? 'png' : 'jpeg', width: cw, height: ch };
    });
  }

  // EXIF 회전을 반영해 디코드. createImageBitmap 미지원/실패 시 <img> 폴백.
  function decode(file) {
    if (typeof createImageBitmap === 'function') {
      return createImageBitmap(file, { imageOrientation: 'from-image' }).catch(function () { return decodeViaImg(file); });
    }
    return decodeViaImg(file);
  }
  function decodeViaImg(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('이미지를 열 수 없습니다: ' + file.name)); };
      img.src = url;
    });
  }
  function release(bmp) { if (bmp && typeof bmp.close === 'function') bmp.close(); }
  function readDataURL(file) {
    return new Promise(function (resolve, reject) {
      var fr = new FileReader();
      fr.onload = function () { resolve(fr.result); };
      fr.onerror = function () { reject(fr.error); };
      fr.readAsDataURL(file);
    });
  }

  return {
    COLS: COLS, ROWS: ROWS, PER_PAGE: PER_PAGE,
    layout: layout, naturalCompare: naturalCompare, fit: fit,
    buildWorkbook: buildWorkbook, readImage: readImage
  };
}));
