/* Megahouse — 사진 → 엑셀 / PPT 격자 배열
   공통 레이아웃(용지·방향·가로×세로 개수 → 셀 좌표, px@96dpi) 위에
   xlsx 빌더(ExcelJS)와 pptx 빌더(PptxGenJS)가 같은 좌표를 쓴다.
   DOM 의존이 없는 부분(PAPERS·layout·naturalCompare·buildWorkbook·buildPptx)은
   Node 에서도 그대로 돌아가므로 검증 스크립트에 재사용한다. 브라우저 전용은 readImage() 뿐. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PhotoGrid = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var DPI = 96, EMU_PER_PX = 9525, MM_PER_IN = 25.4;
  // 용지(mm, 세로 기준) + Excel paperSize 코드(ECMA-376 pageSetup)
  var PAPERS = {
    A4:     { w: 210,   h: 297,   excel: 9 },
    A3:     { w: 297,   h: 420,   excel: 8 },
    A5:     { w: 148,   h: 210,   excel: 11 },
    B4:     { w: 257,   h: 364,   excel: 12 },   // JIS B4
    B5:     { w: 182,   h: 257,   excel: 13 },   // JIS B5
    Letter: { w: 215.9, h: 279.4, excel: 1 },
    Legal:  { w: 215.9, h: 355.6, excel: 5 }
  };
  var PAPER_ORDER = ['A4', 'A3', 'A5', 'B4', 'B5', 'Letter', 'Legal'];
  var MARGIN_IN = 0.4, GAP = 16, CAPTION_H = 22;
  var SLACK_W = 8, SLACK_H = 10;   // 열폭(문자)·행높이(pt) 변환이 근사치라 페이지 밖으로 밀리지 않게 여유
  var MAX_ROW_PT = 400;            // Excel 행 높이 상한 409.5pt — 넘으면 이미지 행을 서브행으로 쪼갠다
  var MIN_N = 1, MAX_N = 5;

  function pxToColWidth(px) { return (px - 5) / 7; }  // Calibri 11: 최대 숫자폭 7px, 패딩 5px
  function pxToRowHeight(px) { return px * 0.75; }    // 1px = 0.75pt
  function mmToPx(mm) { return mm / MM_PER_IN * DPI; }
  function inch(px) { return Math.round(px / DPI * 10000) / 10000; }
  function colLetter(n) { var s = ''; while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; }
  function clampN(n) { n = parseInt(n, 10); if (!(n >= MIN_N)) n = MIN_N; if (n > MAX_N) n = MAX_N; return n; }

  function normalize(o) {
    o = o || {};
    return {
      paper: PAPERS[o.paper] ? o.paper : 'A4',
      orientation: o.orientation === 'landscape' ? 'landscape' : 'portrait',
      cols: clampN(o.cols != null ? o.cols : 2),
      rows: clampN(o.rows != null ? o.rows : 3),
      caption: o.caption !== false,
      sheetName: o.sheetName
    };
  }

  /** 용지·방향·격자 → 페이지/셀 치수(px@96dpi). 두 빌더와 미리보기가 전부 이 값만 쓴다. */
  function layout(o) {
    o = normalize(o);
    var p = PAPERS[o.paper], land = o.orientation === 'landscape';
    var wMm = land ? p.h : p.w, hMm = land ? p.w : p.h;
    var pageW = Math.floor(mmToPx(wMm)), pageH = Math.floor(mmToPx(hMm));
    var marginPx = MARGIN_IN * DPI;
    var printW = Math.floor(pageW - 2 * marginPx) - SLACK_W;
    var printH = Math.floor(pageH - 2 * marginPx) - SLACK_H;
    var cellW = Math.floor((printW - GAP * (o.cols - 1)) / o.cols);
    var cellH = Math.floor((printH - GAP * (o.rows - 1)) / o.rows);
    var capH = o.caption ? CAPTION_H : 0;
    return {
      paper: o.paper, orientation: o.orientation, cols: o.cols, rows: o.rows, perPage: o.cols * o.rows,
      caption: o.caption, sheetName: o.sheetName,
      pageW: pageW, pageH: pageH, pageWin: wMm / MM_PER_IN, pageHin: hMm / MM_PER_IN,
      marginIn: MARGIN_IN, marginPx: marginPx, gap: GAP,
      cellW: cellW, cellH: cellH, imgH: cellH - capH, capH: capH,
      usedW: o.cols * cellW + (o.cols - 1) * GAP, usedH: o.rows * cellH + (o.rows - 1) * GAP,
      excelPaper: p.excel
    };
  }

  function pageCount(n, L) { return Math.ceil(n / L.perPage); }

  // 1.jpg, 2.jpg, 10.jpg 순서가 되도록 숫자 인식 정렬
  function naturalCompare(a, b) {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  }

  function fit(w, h, boxW, boxH) {
    var s = Math.min(boxW / w, boxH / h);
    return { w: Math.max(1, Math.round(w * s)), h: Math.max(1, Math.round(h * s)) };
  }

  /* ---------- xlsx ---------- */
  /**
   * images: [{ name, base64, extension('jpeg'|'png'|'gif'), width, height }] — 이미 정렬된 순서
   * opts:   { paper, orientation, cols, rows, caption, sheetName }
   */
  function buildWorkbook(ExcelJS, images, opts) {
    var L = layout(opts);
    var wb = new ExcelJS.Workbook();
    wb.creator = 'Megahouse';
    var ws = wb.addWorksheet(L.sheetName || 'Photos', {
      pageSetup: {
        paperSize: L.excelPaper, orientation: L.orientation, horizontalCentered: true,
        // 열폭 근사 오차로 가로가 넘쳐도 2페이지로 쪼개지지 않게 — 가로만 1페이지 맞춤(세로는 수동 나눔)
        fitToPage: true, fitToWidth: 1, fitToHeight: 0,
        margins: { left: L.marginIn, right: L.marginIn, top: L.marginIn, bottom: L.marginIn, header: 0.2, footer: 0.2 }
      },
      views: [{ showGridLines: false }]
    });

    // 열: [셀][간격][셀]… (최대 5열이면 9개 — A3 가로 1열도 213자 < Excel 상한 255자)
    var colPx = [];
    for (var c = 0; c < L.cols; c++) { colPx.push(L.cellW); if (c < L.cols - 1) colPx.push(GAP); }
    colPx.forEach(function (px, i) { ws.getColumn(i + 1).width = pxToColWidth(px); });

    // 이미지 행: 높이가 상한을 넘으면 같은 높이의 서브행 여러 개로 (이미지는 첫 서브행에 앵커, ext 로 걸쳐 그려짐)
    var subN = Math.max(1, Math.ceil(pxToRowHeight(L.imgH) / MAX_ROW_PT));
    var subPx = L.imgH / subN;

    var pages = pageCount(images.length, L);
    var row = 1; // 1-based
    for (var p = 0; p < pages; p++) {
      for (var r = 0; r < L.rows; r++) {
        var imgRow = row;
        for (var s = 0; s < subN; s++) ws.getRow(row + s).height = pxToRowHeight(subPx);
        row += subN;
        var capRow = row;
        if (L.caption) { ws.getRow(capRow).height = pxToRowHeight(L.capH); row += 1; }
        for (var c2 = 0; c2 < L.cols; c2++) {
          var idx = p * L.perPage + r * L.cols + c2;
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
          if (L.caption) {
            var cell = ws.getCell(capRow, colIdx + 1);
            cell.value = im.name;
            cell.alignment = { horizontal: 'center', vertical: 'middle', shrinkToFit: true };
            cell.font = { name: 'Calibri', size: 9, color: { argb: 'FF444444' } };
          }
        }
        if (r < L.rows - 1) { ws.getRow(row).height = pxToRowHeight(GAP); row += 1; }
      }
      // 페이지의 마지막 행 뒤에서 강제 나눔 (brk id = 그 행 번호)
      if (p < pages - 1) ws.getRow(row - 1).addPageBreak();
    }
    ws.pageSetup.printArea = 'A1:' + colLetter(colPx.length) + (row - 1);
    return wb;
  }

  /* ---------- pptx ---------- */
  /** 슬라이드 크기 = 용지 크기(인치). 페이지당 슬라이드 1장, 셀 좌표는 xlsx 와 동일(가로 중앙, 위 여백부터). */
  function buildPptx(PptxGenJS, images, opts) {
    var L = layout(opts);
    var pptx = new PptxGenJS();
    var lname = 'MH_' + L.paper + '_' + L.orientation;
    pptx.defineLayout({ name: lname, width: Math.round(L.pageWin * 10000) / 10000, height: Math.round(L.pageHin * 10000) / 10000 });
    pptx.layout = lname;
    pptx.author = 'Megahouse';
    pptx.company = 'Y-Systems';
    pptx.title = L.cols + 'x' + L.rows + ' photo grid';

    var offX = (L.pageW - L.usedW) / 2, offY = L.marginPx;
    var pages = pageCount(images.length, L);
    for (var p = 0; p < pages; p++) {
      var slide = pptx.addSlide();
      for (var r = 0; r < L.rows; r++) {
        for (var c = 0; c < L.cols; c++) {
          var idx = p * L.perPage + r * L.cols + c;
          if (idx >= images.length) continue;
          var im = images[idx], sz = fit(im.width, im.height, L.cellW, L.imgH);
          var cx = offX + c * (L.cellW + L.gap), cy = offY + r * (L.cellH + L.gap);
          slide.addImage({
            data: im.base64,
            x: inch(cx + (L.cellW - sz.w) / 2), y: inch(cy + (L.imgH - sz.h) / 2), w: inch(sz.w), h: inch(sz.h)
          });
          if (L.caption) {
            slide.addText(im.name, {
              x: inch(cx), y: inch(cy + L.imgH), w: inch(L.cellW), h: inch(L.capH),
              fontSize: 9, fontFace: 'Calibri', color: '444444', align: 'center', valign: 'middle', margin: 0, fit: 'shrink'
            });
          }
        }
      }
    }
    return pptx;
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
      img.onerror = function () {
        URL.revokeObjectURL(url);
        var err = new Error('Cannot open image: ' + file.name);
        err.code = 'decode'; err.file = file.name;   // UI 가 언어별 메시지로 바꿔 보여준다
        reject(err);
      };
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
    PAPERS: PAPERS, PAPER_ORDER: PAPER_ORDER, MIN_N: MIN_N, MAX_N: MAX_N,
    layout: layout, pageCount: pageCount, naturalCompare: naturalCompare, fit: fit,
    buildWorkbook: buildWorkbook, buildPptx: buildPptx, readImage: readImage
  };
}));
