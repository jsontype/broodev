/* Utils (구 Megahouse) — 사진 → 엑셀 / PPT / Illustrator / Photoshop 격자 배열
   공통 레이아웃(용지·방향·가로×세로 개수 → 셀 좌표, px@96dpi) 위에
   xlsx 빌더(ExcelJS) · pptx 빌더(PptxGenJS) · pdf 빌더(pdf-lib → .ai, 2026-10-05) · psd 빌더(ag-psd, 2026-10-05)가 같은 좌표를 쓴다.
   DOM 의존이 없는 부분(PAPERS·layout·naturalCompare·build*)은 Node 에서도 그대로 돌아가므로 검증 스크립트에 재사용한다
   (buildPsd 는 캔버스 팩토리를 env 로 받는다). 브라우저 전용은 readImage()·decodeImage() 뿐. */
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
    wb.creator = 'Y Systems';
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
    pptx.author = 'Y Systems';
    pptx.company = 'Y Systems';
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

  /* ---------- 공통: 캡션 래스터 · dataURL ---------- */
  var CAP_FONT_PX = 12;   // 9pt @96dpi — xlsx/pptx 캡션(Calibri 9)과 같은 크기
  var CAP_FAMILY = 'system-ui, -apple-system, "Segoe UI", Roboto, "Hiragino Sans", "Yu Gothic UI", "Malgun Gothic", "Noto Sans CJK JP", sans-serif';
  var CAP_COLOR = '#444444';

  // 폰트가 설정된 2D 컨텍스트 기준으로 maxW 에 맞게 말줄임
  function ellipsize(ctx, text, maxW) {
    if (ctx.measureText(text).width <= maxW) return text;
    var s = text;
    while (s.length > 1) { s = s.slice(0, -1); if (ctx.measureText(s + '…').width <= maxW) return s + '…'; }
    return '…';
  }
  // 투명 캔버스(w×h px)에 캡션을 가운데 그린다 — PSD 캡션 레이어 · PDF 의 비(非)WinAnsi 캡션 폴백 공통. scale = 글자 크기 배율(dpi/96 등)
  function drawCaption(canvas, text, scale) {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = Math.round(CAP_FONT_PX * scale) + 'px ' + CAP_FAMILY;
    ctx.fillStyle = CAP_COLOR; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(ellipsize(ctx, text, canvas.width - 6 * scale), canvas.width / 2, canvas.height / 2);
    return canvas;
  }
  // data:…;base64,… → Uint8Array (브라우저 atob · Node Buffer)
  function dataUrlBytes(dataUrl) {
    var i = dataUrl.indexOf(','), b64 = i >= 0 ? dataUrl.slice(i + 1) : dataUrl;
    if (typeof atob === 'function') {
      var bin = atob(b64), out = new Uint8Array(bin.length);
      for (var j = 0; j < bin.length; j++) out[j] = bin.charCodeAt(j);
      return out;
    }
    return new Uint8Array(Buffer.from(b64, 'base64'));
  }

  /* ---------- pdf → .ai (Illustrator) ---------- */
  /** Illustrator 의 네이티브 .ai 는 PDF 기반 — 페이지 = 아트보드인 PDF 를 만들어 .ai 로 내려준다
   *  (Illustrator 가 그대로 열고, 사진은 각각 배치된 이미지 오브젝트 · 캡션은 텍스트. 여러 페이지는 아트보드 여러 장).
   *  images: readImage() 결과 [{ name, base64, extension('jpeg'|'png'), width, height }] — gif 는 PDF 에 못 넣으므로 호출 쪽이 PDF_PASSTHROUGH 로 readImage 해 jpeg 로 바꿔 둔다
   *  opts: layout 옵션 + { renderCaption(text, wPx, hPx) → PNG dataURL | null } — 표준 Helvetica(WinAnsi)로 못 쓰는 캡션(일본어·한국어 등)을 캔버스로 그려 넣기 위한 훅. 없으면 그 캡션은 생략
   *  반환: Promise<Uint8Array> */
  var PDF_PASSTHROUGH = /^image\/(jpeg|png)$/;
  function buildPdf(PDFLib, images, opts) {
    var L = layout(opts);
    var PT = 72 / DPI;                                   // px@96 → pt
    var pageWpt = L.pageWin * 72, pageHpt = L.pageHin * 72;
    var renderCaption = opts && typeof opts.renderCaption === 'function' ? opts.renderCaption : null;
    var CAP_PT = 9, GRAY = PDFLib.rgb(0.267, 0.267, 0.267);
    var offX = (L.pageW - L.usedW) / 2, offY = L.marginPx;
    var pages = pageCount(images.length, L);
    var doc, font;
    return PDFLib.PDFDocument.create().then(function (d) {
      doc = d;
      doc.setTitle(L.cols + 'x' + L.rows + ' photo grid'); doc.setAuthor('Y Systems');
      doc.setCreator('Y Systems Utils (utils.broodev.com)'); doc.setProducer('pdf-lib');
      return doc.embedFont(PDFLib.StandardFonts.Helvetica);
    }).then(function (f) {
      font = f;
      var chain = Promise.resolve();
      for (var p = 0; p < pages; p++) chain = chain.then(pageStep(p));
      return chain;
    }).then(function () { return doc.save(); });

    function pageStep(p) {
      return function () {
        var page = doc.addPage([pageWpt, pageHpt]);
        var seq = Promise.resolve();
        for (var r = 0; r < L.rows; r++) for (var c = 0; c < L.cols; c++) {
          var idx = p * L.perPage + r * L.cols + c;
          if (idx < images.length) seq = seq.then(cellStep(page, images[idx], r, c));
        }
        return seq;
      };
    }
    function cellStep(page, im, r, c) {
      return function () {
        var sz = fit(im.width, im.height, L.cellW, L.imgH);
        var cx = offX + c * (L.cellW + L.gap), cy = offY + r * (L.cellH + L.gap);
        var bytes = dataUrlBytes(im.base64);
        var embed = im.extension === 'png' ? doc.embedPng(bytes) : doc.embedJpg(bytes);
        return embed.then(function (img) {
          var x = (cx + (L.cellW - sz.w) / 2) * PT, yTop = (cy + (L.imgH - sz.h) / 2) * PT;
          page.drawImage(img, { x: x, y: pageHpt - yTop - sz.h * PT, width: sz.w * PT, height: sz.h * PT });
          if (L.caption) return caption(page, im.name, cx, cy + L.imgH, L.cellW, L.capH);
        });
      };
    }
    // 캡션: Helvetica 로 쓸 수 있으면 텍스트(편집 가능), 아니면 renderCaption 훅의 PNG
    function caption(page, text, xPx, yPx, wPx, hPx) {
      var x = xPx * PT, w = wPx * PT, h = hPx * PT, yTop = pageHpt - yPx * PT;
      var s = fitText(text, w - 4);
      if (s != null) {
        var tw = font.widthOfTextAtSize(s, CAP_PT);
        page.drawText(s, { x: x + (w - tw) / 2, y: yTop - h / 2 - CAP_PT * 0.35, size: CAP_PT, font: font, color: GRAY });
        return;
      }
      if (!renderCaption) return;
      return Promise.resolve(renderCaption(text, wPx, hPx)).then(function (png) {
        if (!png) return;
        return doc.embedPng(dataUrlBytes(png)).then(function (img) { page.drawImage(img, { x: x, y: yTop - h, width: w, height: h }); });
      });
    }
    // Helvetica(WinAnsi) 로 쓸 수 있으면 폭에 맞춰 말줄임한 문자열, 못 쓰는 글자가 있으면(인코딩 예외) null
    function fitText(text, maxW) {
      try {
        if (font.widthOfTextAtSize(text, CAP_PT) <= maxW) return text;
        var s = text;
        while (s.length > 1) { s = s.slice(0, -1); if (font.widthOfTextAtSize(s + '…', CAP_PT) <= maxW) return s + '…'; }
        return '…';
      } catch (e) { return null; }
    }
  }

  /* ---------- psd (Photoshop) ---------- */
  /** Photoshop 은 페이지 개념이 없어 페이지마다 PSD 1개(여러 장이면 호출 쪽이 ZIP). 문서 픽셀 = 용지 × dpi.
   *  맨 아래 흰 「Background」, 그 위에 사진마다 그룹 「01 파일명」(캡션 래스터 레이어 + 사진 레이어).
   *  캡션을 텍스트 레이어로 쓰면 Photoshop 이 열 때마다 「텍스트 레이어 업데이트」 경고를 띄우므로(ag-psd 제약) 래스터로 넣는다.
   *  images: [{ name, load() → Promise<drawable(ImageBitmap·Image·Canvas)>, release(drawable)? }]
   *          — 문서 해상도에 맞춰 다시 그려야 하므로 base64 가 아니라 그릴 수 있는 원본을 셀마다 느리게 받아 메모리를 아낀다
   *  env: { createCanvas(w, h), dpi(기본 300), thumbnail(기본 false — 브라우저에서 true), onPage(i, n) }
   *  반환: Promise<ArrayBuffer[]> (페이지 순) */
  function buildPsd(agPsd, images, opts, env) {
    env = env || {};
    var L = layout(opts);
    var dpi = env.dpi || 300, k = dpi / DPI;
    var W = Math.round(L.pageWin * dpi), H = Math.round(L.pageHin * dpi);   // 용지 치수(인치)에서 바로 — A4 300dpi = 2480×3508
    var create = env.createCanvas;
    var offX = (W / k - L.usedW) / 2, offY = L.marginPx;                    // 가로 중앙(px@96 단위 · 셀 좌표계)
    var pages = pageCount(images.length, L);
    var out = [];
    var chain = Promise.resolve();
    for (var p = 0; p < pages; p++) chain = chain.then(pageStep(p));
    return chain.then(function () { return out; });

    function pad2(n) { return (n < 10 ? '0' : '') + n; }
    function imageData(canvas) { return canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height); }
    function white(w, h) { var cv = create(w, h), ctx = cv.getContext('2d'); ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h); return cv; }
    function pageStep(p) {
      return function () {
        if (env.onPage) env.onPage(p + 1, pages);
        var comp = white(W, H), cctx = comp.getContext('2d');
        var groups = [];
        var seq = Promise.resolve();
        for (var r = 0; r < L.rows; r++) for (var c = 0; c < L.cols; c++) {
          var idx = p * L.perPage + r * L.cols + c;
          if (idx < images.length) seq = seq.then(cellStep(images[idx], idx, r, c, cctx, groups));
        }
        return seq.then(function () {
          /* ag-psd 의 children 은 PSD 레이어 레코드 순서 그대로 = 아래→위 (children[0] 이 맨 아래). 예전엔 Background 를 마지막에 넣어
             맨 위 레이어가 되는 바람에 사진이 전부 가려진 PSD 가 저장됐다(2026-10-09 수정). Background 를 맨 앞(맨 아래)에, 그룹은 역순으로
             넣어 Photoshop 레이어 패널에서 01 그룹이 맨 위에 오게 한다 */
          var background = { name: 'Background', left: 0, top: 0, imageData: imageData(white(W, H)) };
          var psd = {
            width: W, height: H, channels: 3, bitsPerChannel: 8, colorMode: 3,
            imageResources: { resolutionInfo: { horizontalResolution: dpi, horizontalResolutionUnit: 'PPI', widthUnit: 'Centimeters', verticalResolution: dpi, verticalResolutionUnit: 'PPI', heightUnit: 'Centimeters' } },
            children: [background].concat(groups.slice().reverse())   // 아래→위: Background · N … 02 · 01
          };
          if (env.thumbnail) psd.canvas = comp; else psd.imageData = imageData(comp);
          out.push(agPsd.writePsd(psd, { generateThumbnail: !!env.thumbnail }));
        });
      };
    }
    function cellStep(im, idx, r, c, cctx, groups) {
      return function () {
        return Promise.resolve(im.load()).then(function (src) {
          var w0 = src.naturalWidth || src.width, h0 = src.naturalHeight || src.height;
          var sz = fit(w0, h0, L.cellW, L.imgH);
          var cx = offX + c * (L.cellW + L.gap), cy = offY + r * (L.cellH + L.gap);
          var x = Math.round((cx + (L.cellW - sz.w) / 2) * k), y = Math.round((cy + (L.imgH - sz.h) / 2) * k);
          var w = Math.max(1, Math.round(sz.w * k)), h = Math.max(1, Math.round(sz.h * k));
          var cv = create(w, h), ctx = cv.getContext('2d');
          ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(src, 0, 0, w, h);
          if (im.release) im.release(src);
          cctx.drawImage(cv, x, y);
          var children = [];
          if (L.caption) {
            var capW = Math.round(L.cellW * k), capH = Math.round(L.capH * k), capX = Math.round(cx * k), capY = Math.round((cy + L.imgH) * k);
            var cap = drawCaption(create(capW, capH), im.name, k);
            cctx.drawImage(cap, capX, capY);
            children.push({ name: 'caption', left: capX, top: capY, imageData: imageData(cap) });
          }
          children.push({ name: im.name, left: x, top: y, imageData: imageData(cv) });
          groups.push({ name: pad2(idx + 1) + ' ' + im.name, opened: false, children: children });
        });
      };
    }
  }

  /* ---------- 브라우저 전용 ---------- */

  // File → { name, base64, extension, width, height }. maxPx=0 이면 원본 바이트 그대로(passRe 에 맞는 형식만 · 기본 jpeg/png/gif, PDF 는 PDF_PASSTHROUGH).
  function readImage(file, maxPx, passRe) {
    var type = (file.type || '').toLowerCase();
    var passthrough = maxPx === 0 && (passRe || /^image\/(jpeg|png|gif)$/).test(type);
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
    PAPERS: PAPERS, PAPER_ORDER: PAPER_ORDER, MIN_N: MIN_N, MAX_N: MAX_N, PDF_PASSTHROUGH: PDF_PASSTHROUGH,
    layout: layout, pageCount: pageCount, naturalCompare: naturalCompare, fit: fit,
    buildWorkbook: buildWorkbook, buildPptx: buildPptx, buildPdf: buildPdf, buildPsd: buildPsd,
    drawCaption: drawCaption, ellipsize: ellipsize, dataUrlBytes: dataUrlBytes,
    readImage: readImage, decodeImage: decode, releaseImage: release
  };
}));
