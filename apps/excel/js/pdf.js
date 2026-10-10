/* SHEET — PDF 내보내기 · 인쇄용 표
   PDF: 현재 시트를 canvas 에 "브라우저 글꼴"로 직접 그린다(한국어·일본어·중국어·태국어·키릴 문자가 깨지지 않음) →
        A4 가로 페이지로 나눠(아래로 먼저, 그다음 오른쪽 — 엑셀 기본 순서) PNG 로 굳힌 뒤 pdf-lib 로 이미지 페이지 PDF 생성.
   인쇄: 같은 값(수식 결과·병합·서식)으로 HTML 표를 만들어 #print-area 에 넣고 브라우저 인쇄(인쇄용 CSS 가 격자만 남김).
   planPages 는 DOM 없이 동작(Node 검증용). */
(function (root) {
  'use strict';
  var C = function () { return root.SheetConvert; };

  var A4_LANDSCAPE = { w: 1123, h: 794 };              // CSS px @96dpi (297×210mm)
  var PDF_PAGE = [841.89, 595.28];                     // pt
  var FALLBACK = {
    base: "'Segoe UI', 'Noto Sans', Roboto, 'Helvetica Neue', Arial",
    ko: "'Malgun Gothic', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Noto Sans CJK KR'",
    ja: "'Yu Gothic', 'Meiryo', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Noto Sans CJK JP'",
    zh: "'Microsoft YaHei', 'PingFang SC', 'Noto Sans SC', 'Noto Sans CJK SC'",
    'zh-Hant': "'Microsoft JhengHei', 'PingFang TC', 'Noto Sans TC', 'Noto Sans CJK TC'",
    th: "'Leelawadee UI', 'Leelawadee', 'Tahoma', 'Thonburi', 'Noto Sans Thai'"
  };
  /** UI 언어의 글꼴을 앞에 두고 나머지 문자 체계도 모두 받쳐 주는 글꼴 목록 */
  function fontStack(lang) {
    var order = [lang, 'ko', 'ja', 'zh', 'zh-Hant', 'th'].filter(function (x, i, a) { return FALLBACK[x] && a.indexOf(x) === i; });
    return [FALLBACK.base].concat(order.map(function (k) { return FALLBACK[k]; })).concat(['sans-serif']).join(', ');
  }

  /** 페이지 나누기 계획 (DOM 없음). opts.range = {sri, sci, eri, eci} 이면 그 범위만(선택 영역 PDF) */
  function planPages(sheet, opts) {
    opts = opts || {};
    var X = C();
    var page = opts.page || A4_LANDSCAPE, margin = opts.margin == null ? 36 : opts.margin, footer = opts.footer == null ? 22 : opts.footer;
    var ur = X.usedRange(sheet), rg = opts.range;
    var empty = ur.eri < 0;
    var sri = 0, sci = 0, eri = Math.max(ur.eri, 0), eci = Math.max(ur.eci, 0);
    if (rg) { sri = Math.max(0, rg.sri); sci = Math.max(0, rg.sci); eri = Math.max(sri, rg.eri); eci = Math.max(sci, rg.eci); empty = false; }
    var colW = [], rowH = [], ci, ri;
    for (ci = 0; ci <= eci; ci++) colW.push(X.colWidth(sheet, ci));
    for (ri = 0; ri <= eri; ri++) rowH.push(X.rowHeight(sheet, ri));
    var availW = page.w - margin * 2, availH = page.h - margin * 2 - footer;
    var totalW = colW.slice(sci).reduce(function (s, w) { return s + w; }, 0);
    var scale = 1;
    if (totalW > availW && totalW <= availW * 1.5) scale = availW / totalW;   // 조금 넘치면 폭에 맞춰 축소, 많이 넘치면 옆 페이지로
    var chunk = function (sizes, max, from) {
      var out = [], s = from, acc = 0;
      for (var i = from; i < sizes.length; i++) {
        if (acc > 0 && acc + sizes[i] > max) { out.push([s, i - 1]); s = i; acc = 0; }
        acc += sizes[i];
      }
      out.push([s, sizes.length - 1]);
      return out;
    };
    var cols = chunk(colW, availW / scale, sci), rows = chunk(rowH, availH / scale, sri), pages = [];
    cols.forEach(function (cc) { rows.forEach(function (rc) { pages.push({ c0: cc[0], c1: cc[1], r0: rc[0], r1: rc[1] }); }); });
    var colX = [0], rowY = [0];
    colW.forEach(function (w, i) { colX[i + 1] = colX[i] + w; });
    rowH.forEach(function (h, i) { rowY[i + 1] = rowY[i] + h; });
    return { page: page, margin: margin, footer: footer, scale: scale, colW: colW, rowH: rowH, colX: colX, rowY: rowY, eri: eri, eci: eci, empty: empty, pages: pages };
  }

  // ---------- canvas 그리기
  function wrapLines(ctx, text, maxW) {
    var out = [];
    String(text).split('\n').forEach(function (para) {
      if (para === '') { out.push(''); return; }
      var segs;
      try { segs = Array.from(new Intl.Segmenter(undefined, { granularity: 'word' }).segment(para), function (s) { return s.segment; }); }
      catch (e) { segs = para.match(/\s+|[^\s]+/g) || [para]; }
      var line = '';
      segs.forEach(function (seg) {
        var tryLine = line + seg;
        if (ctx.measureText(tryLine).width <= maxW || line === '') {
          if (ctx.measureText(tryLine).width > maxW && line === '') {
            // 한 단어가 칸보다 넓으면 글자 단위로 자른다
            Array.from(seg).forEach(function (ch) {
              if (ctx.measureText(line + ch).width > maxW && line) { out.push(line); line = ch; } else line += ch;
            });
          } else line = tryLine;
        } else { out.push(line.replace(/\s+$/, '')); line = seg.replace(/^\s+/, ''); }
      });
      out.push(line);
    });
    return out;
  }
  function borderDash(ctx, style) {
    if (style === 'dashed') ctx.setLineDash([3, 2]);
    else if (style === 'dotted') ctx.setLineDash([1, 1]);
    else ctx.setLineDash([]);
    ctx.lineWidth = style === 'medium' ? 2 : style === 'thick' ? 3 : 1;
  }
  function drawBorders(ctx, st, x, y, w, h) {
    var b = st && st.border; if (!b) return;
    var sides = { top: [x, y, x + w, y], bottom: [x, y + h, x + w, y + h], left: [x, y, x, y + h], right: [x + w, y, x + w, y + h] };
    Object.keys(sides).forEach(function (k) {
      var v = b[k]; if (!v || !v[0]) return;
      var s = sides[k];
      ctx.save();
      ctx.strokeStyle = v[1] || '#000';
      borderDash(ctx, v[0]);
      ctx.beginPath(); ctx.moveTo(s[0], s[1]); ctx.lineTo(s[2], s[3]); ctx.stroke();
      if (v[0] === 'double') {
        var dx = (k === 'left' || k === 'right') ? (k === 'left' ? 2 : -2) : 0, dy = (k === 'top' || k === 'bottom') ? (k === 'top' ? 2 : -2) : 0;
        ctx.beginPath(); ctx.moveTo(s[0] + dx, s[1] + dy); ctx.lineTo(s[2] + dx, s[3] + dy); ctx.stroke();
      }
      ctx.restore();
    });
  }
  function drawText(ctx, text, st, x, y, w, h, fonts) {
    var f = (st && st.font) || {};
    var px = ((f.size || 10) * 4) / 3;
    var family = (f.name ? "'" + String(f.name).replace(/'/g, '') + "', " : 'Arial, ') + fonts;
    ctx.font = (f.italic ? 'italic ' : '') + (f.bold ? 'bold ' : '') + px.toFixed(2) + 'px ' + family;
    ctx.fillStyle = (st && st.color) || '#0a0a0a';
    var pad = 5, maxW = Math.max(1, w - pad * 2);
    var lines = st && st.textwrap ? wrapLines(ctx, text, maxW) : String(text).split('\n');
    var lh = px * 1.25, total = lines.length * lh;
    var valign = (st && st.valign) || 'middle', align = (st && st.align) || 'left';
    var top = valign === 'top' ? y + 2 : valign === 'bottom' ? y + h - 2 - total : y + (h - total) / 2;
    ctx.textBaseline = 'middle';
    ctx.textAlign = align === 'center' ? 'center' : align === 'right' ? 'right' : 'left';
    var tx = align === 'center' ? x + w / 2 : align === 'right' ? x + w - pad : x + pad;
    lines.forEach(function (ln, i) {
      var ly = top + i * lh + lh / 2;
      ctx.fillText(ln, tx, ly);
      if ((st && st.underline) || (st && st.strike)) {
        var tw = ctx.measureText(ln).width, lx = align === 'center' ? tx - tw / 2 : align === 'right' ? tx - tw : tx;
        ctx.save(); ctx.lineWidth = Math.max(1, px / 14); ctx.strokeStyle = ctx.fillStyle; ctx.setLineDash([]);
        if (st.underline) { ctx.beginPath(); ctx.moveTo(lx, ly + px * 0.45); ctx.lineTo(lx + tw, ly + px * 0.45); ctx.stroke(); }
        if (st.strike) { ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + tw, ly); ctx.stroke(); }
        ctx.restore();
      }
    });
  }

  /** 한 페이지를 canvas 에 그린다 */
  function renderPage(canvas, sheets, si, plan, index, opts) {
    opts = opts || {};
    var X = C(), sheet = sheets[si], calc = opts.calc || X.createCalc(sheets), fonts = opts.fonts || fontStack(opts.lang);
    var R = opts.dpr || 2, page = plan.page, pg = plan.pages[index];
    canvas.width = Math.round(page.w * R); canvas.height = Math.round(page.h * R);
    var ctx = canvas.getContext('2d');
    ctx.setTransform(R, 0, 0, R, 0, 0);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, page.w, page.h);
    var x0 = plan.colX[pg.c0], x1 = plan.colX[pg.c1 + 1], y0 = plan.rowY[pg.r0], y1 = plan.rowY[pg.r1 + 1];
    var mm = X.mergeMap(sheet);
    var colX = plan.colX, rowY = plan.rowY;
    var rx = function (ci) { return ci < colX.length ? colX[ci] : colX[colX.length - 1] + (ci - colX.length + 1) * X.DEF_COL_W; };
    var ry = function (ri) { return ri < rowY.length ? rowY[ri] : rowY[rowY.length - 1] + (ri - rowY.length + 1) * X.DEF_ROW_H; };

    // 이 페이지에 걸치는 칸(병합은 하나의 큰 칸)
    var boxes = [], seen = {};
    Object.keys(mm.masters).forEach(function (k) {
      var r = mm.masters[k];
      if (r.eri < pg.r0 || r.sri > pg.r1 || r.eci < pg.c0 || r.sci > pg.c1) return;
      boxes.push({ ri: r.sri, ci: r.sci, x: rx(r.sci), y: ry(r.sri), w: rx(r.eci + 1) - rx(r.sci), h: ry(r.eri + 1) - ry(r.sri), merged: true });
      seen[k] = true;
    });
    for (var ri = pg.r0; ri <= pg.r1; ri++) {
      if (!plan.rowH[ri]) continue;
      for (var ci = pg.c0; ci <= pg.c1; ci++) {
        var key = ri + ':' + ci;
        if (!plan.colW[ci] || seen[key] || mm.covered[key]) continue;
        boxes.push({ ri: ri, ci: ci, x: colX[ci], y: rowY[ri], w: plan.colW[ci], h: plan.rowH[ri] });
      }
    }

    ctx.save();
    ctx.translate(plan.margin, plan.margin);
    ctx.scale(plan.scale, plan.scale);
    ctx.beginPath(); ctx.rect(0, 0, x1 - x0 + 1, y1 - y0 + 1); ctx.clip();
    ctx.translate(-x0, -y0);
    var styleFor = function (b) { return X.styleOf(sheet, X.cellAt(sheet, b.ri, b.ci)); };
    // 1) 배경  2) 격자  3) 테두리  4) 글자
    boxes.forEach(function (b) { var st = styleFor(b); if (st && st.bgcolor && X.toHex(st.bgcolor) !== '#ffffff') { ctx.fillStyle = st.bgcolor; ctx.fillRect(b.x, b.y, b.w, b.h); } });
    ctx.strokeStyle = '#d4d4d4'; ctx.lineWidth = 1 / plan.scale; ctx.setLineDash([]);
    boxes.forEach(function (b) { ctx.strokeRect(b.x + 0.5, b.y + 0.5, b.w, b.h); });
    boxes.forEach(function (b) { drawBorders(ctx, styleFor(b), b.x + 0.5, b.y + 0.5, b.w, b.h); });
    boxes.forEach(function (b) {
      var text = calc.display(si, b.ri, b.ci);
      if (!text) return;
      ctx.save();
      ctx.beginPath(); ctx.rect(b.x + 1, b.y + 1, b.w - 1, b.h - 1); ctx.clip();
      drawText(ctx, text, styleFor(b), b.x, b.y, b.w, b.h, fonts);
      ctx.restore();
    });
    ctx.restore();

    // 바닥글: 통합문서 · 시트 이름 / 쪽 번호
    ctx.save();
    ctx.font = '10px ' + fonts;
    ctx.fillStyle = '#8a8a8a';
    ctx.textBaseline = 'alphabetic';
    var fy = page.h - plan.margin / 2;
    ctx.textAlign = 'left';
    ctx.fillText(((opts.title ? opts.title + ' — ' : '') + (sheet.name || '')).slice(0, 120), plan.margin, fy);
    ctx.textAlign = 'right';
    ctx.fillText((index + 1) + ' / ' + plan.pages.length, page.w - plan.margin, fy);
    ctx.restore();
    return canvas;
  }

  function canvasBytes(canvas, type, quality) {
    return new Promise(function (resolve, reject) {
      if (canvas.toBlob) canvas.toBlob(function (b) { if (!b) { reject(new Error('toBlob failed')); return; } b.arrayBuffer().then(function (ab) { resolve(new Uint8Array(ab)); }, reject); }, type, quality);
      else { var d = canvas.toDataURL(type, quality).split(',')[1], bin = atob(d), u = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); resolve(u); }
    });
  }
  function canvasPng(canvas) { return canvasBytes(canvas, 'image/png'); }

  /** 불투명 canvas 의 PNG(RGB 8bit · 비인터레이스)에서 압축 데이터(IDAT)만 꺼낸다 — 그 밖의 형식이면 null */
  function pngInfo(u8) {
    if (!u8 || u8.length < 45 || u8[0] !== 0x89 || u8[1] !== 0x50 || u8[2] !== 0x4e || u8[3] !== 0x47) return null;
    var dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength), pos = 8, w = 0, h = 0, parts = [], total = 0;
    while (pos + 12 <= u8.length) {
      var len = dv.getUint32(pos), type = String.fromCharCode(u8[pos + 4], u8[pos + 5], u8[pos + 6], u8[pos + 7]), d = pos + 8;
      if (d + len > u8.length) return null;
      if (type === 'IHDR') {
        w = dv.getUint32(d); h = dv.getUint32(d + 4);
        if (u8[d + 8] !== 8 || u8[d + 9] !== 2 || u8[d + 10] !== 0 || u8[d + 11] !== 0 || u8[d + 12] !== 0) return null;   // 8bit RGB 만
      } else if (type === 'IDAT') { parts.push(u8.subarray(d, d + len)); total += len; }
      else if (type === 'IEND') break;
      else if (type === 'PLTE' || type === 'tRNS') return null;
      pos = d + len + 4;
    }
    if (!w || !h || !parts.length) return null;
    var idat = new Uint8Array(total), o = 0;
    parts.forEach(function (p) { idat.set(p, o); o += p.length; });
    return { w: w, h: h, idat: idat };
  }
  /** PNG 를 풀지 않고 그대로 PDF 이미지로(Flate + PNG 예측자) — pdf-lib embedPng 의 디코딩·재압축(대부분의 시간과 메모리)을 건너뛴다 */
  function drawPngRaw(pdf, PDFLib, page, png) {
    var info = pngInfo(png);
    if (!info || !PDFLib.drawImage || !PDFLib.degrees) return false;
    var ctx = pdf.context;
    var ref = ctx.register(ctx.stream(info.idat, {
      Type: 'XObject', Subtype: 'Image', Width: info.w, Height: info.h, ColorSpace: 'DeviceRGB', BitsPerComponent: 8,
      Filter: 'FlateDecode', DecodeParms: { Predictor: 15, Colors: 3, BitsPerComponent: 8, Columns: info.w }
    }));
    var name = page.node.newXObject('Image', ref);
    page.pushOperators.apply(page, PDFLib.drawImage(name, { x: 0, y: 0, width: PDF_PAGE[0], height: PDF_PAGE[1], rotate: PDFLib.degrees(0), xSkew: PDFLib.degrees(0), ySkew: PDFLib.degrees(0) }));
    return true;
  }

  /** 큰 PDF 를 만들기 전에 쪽수를 미리 알려 주기 위한 계산 */
  function countPages(sheet, opts) { return planPages(sheet, opts).pages.length; }

  /**
   * @param {Object} o  sheets, sheetIndex, PDFLib, title, lang, planOpts({range}),
   *                    dpr(기본 2), format('png' | 'jpeg' — jpeg 는 디코딩 없이 그대로 넣어 훨씬 빠르고 가볍다), quality,
   *                    onProgress(i, n), signal({aborted}) — 취소하면 code 'cancelled' 로 reject
   * @returns {Promise<Uint8Array>} PDF 바이트
   */
  function exportPdf(o) {
    var X = C(), sheets = o.sheets, si = o.sheetIndex || 0, PDFLib = o.PDFLib;
    var plan = planPages(sheets[si], o.planOpts);
    var calc = X.createCalc(sheets), fonts = fontStack(o.lang);
    var canvas = o.canvas || root.document.createElement('canvas');
    var jpeg = o.format === 'jpeg', quality = o.quality || 0.9;
    try { canvas.getContext('2d', { alpha: false }); } catch (e) { /* 불투명 canvas → RGB PNG(그대로 넣을 수 있음) */ }
    var pdf, i = 0;
    return PDFLib.PDFDocument.create().then(function (doc) {
      pdf = doc;
      var title = (o.title || 'SHEET') + ' — ' + (sheets[si].name || '');
      try { pdf.setTitle(title); pdf.setCreator('SHEET · excel.broodev.com'); pdf.setProducer('SHEET (pdf-lib)'); if (o.lang) pdf.setLanguage(o.lang); } catch (e) { /* 메타데이터 실패는 무시 */ }
      if (o.onProgress) o.onProgress(0, plan.pages.length);
      var next = function () {
        if (o.signal && o.signal.aborted) { var ce = new Error('cancelled'); ce.code = 'cancelled'; throw ce; }
        if (i >= plan.pages.length) { canvas.width = canvas.height = 1; return pdf.save(); }
        renderPage(canvas, sheets, si, plan, i, { calc: calc, fonts: fonts, title: o.title, dpr: o.dpr || 2 });
        var place = function (img, p) { (p || pdf.addPage(PDF_PAGE)).drawImage(img, { x: 0, y: 0, width: PDF_PAGE[0], height: PDF_PAGE[1] }); };
        var work = jpeg
          ? canvasBytes(canvas, 'image/jpeg', quality).then(function (b) { return pdf.embedJpg(b); }).then(function (img) { place(img); })
          : canvasPng(canvas).then(function (png) {
            var p = pdf.addPage(PDF_PAGE), raw = false;
            try { raw = drawPngRaw(pdf, PDFLib, p, png); } catch (e) { raw = false; }
            if (!raw) return pdf.embedPng(png).then(function (img) { place(img, p); });
          });
        return work.then(function () {
          i++;
          if (o.onProgress) o.onProgress(i, plan.pages.length);
          return new Promise(function (r) { setTimeout(r, 0); }).then(next);
        });
      };
      return next();
    });
  }

  /** 인쇄용 HTML 표 (값은 textContent 로만 넣는다 — HTML 주입 없음) */
  function buildPrintTable(doc, sheets, si) {
    var X = C(), sheet = sheets[si], calc = X.createCalc(sheets), ur = X.usedRange(sheet), mm = X.mergeMap(sheet);
    var table = doc.createElement('table');
    table.className = 'print-grid';
    if (ur.eri < 0) return table;
    var cg = doc.createElement('colgroup'), ci, ri, total = 0;
    for (ci = 0; ci <= ur.eci; ci++) { var w = X.colWidth(sheet, ci); if (!w) continue; var col = doc.createElement('col'); col.style.width = w + 'px'; cg.appendChild(col); total += w; }
    table.appendChild(cg);
    table.style.width = total + 'px';
    var tb = doc.createElement('tbody');
    var visibleSpan = function (a, b, isRow) { var n = 0; for (var k = a; k <= b; k++) if (isRow ? X.rowHeight(sheet, k) : X.colWidth(sheet, k)) n++; return Math.max(1, n); };
    for (ri = 0; ri <= ur.eri; ri++) {
      var h = X.rowHeight(sheet, ri); if (!h) continue;
      var tr = doc.createElement('tr'); tr.style.height = h + 'px';
      for (ci = 0; ci <= ur.eci; ci++) {
        if (!X.colWidth(sheet, ci) || mm.covered[ri + ':' + ci]) continue;
        var td = doc.createElement('td'), m = mm.masters[ri + ':' + ci];
        if (m) { td.rowSpan = visibleSpan(m.sri, m.eri, true); td.colSpan = visibleSpan(m.sci, m.eci, false); }
        td.textContent = calc.display(si, ri, ci);
        var st = X.styleOf(sheet, X.cellAt(sheet, ri, ci));
        if (st) {
          var f = st.font || {};
          if (f.bold) td.style.fontWeight = '700';
          if (f.italic) td.style.fontStyle = 'italic';
          if (f.size) td.style.fontSize = f.size + 'pt';
          if (st.color) td.style.color = st.color;
          if (st.bgcolor) td.style.background = st.bgcolor;
          if (st.align) td.style.textAlign = st.align;
          if (st.valign) td.style.verticalAlign = st.valign;
          if (st.textwrap) td.style.whiteSpace = 'pre-wrap';
          var deco = [st.underline ? 'underline' : '', st.strike ? 'line-through' : ''].join(' ').trim();
          if (deco) td.style.textDecoration = deco;
          if (st.border) ['top', 'right', 'bottom', 'left'].forEach(function (s) {
            var v = st.border[s]; if (!v || !v[0]) return;
            var wpx = v[0] === 'thick' ? 3 : v[0] === 'medium' ? 2 : 1, ls = v[0] === 'dashed' ? 'dashed' : v[0] === 'dotted' ? 'dotted' : v[0] === 'double' ? 'double' : 'solid';
            td.style['border' + s[0].toUpperCase() + s.slice(1)] = (ls === 'double' ? 3 : wpx) + 'px ' + ls + ' ' + (v[1] || '#000');
          });
        }
        tr.appendChild(td);
      }
      tb.appendChild(tr);
    }
    table.appendChild(tb);
    return table;
  }

  root.SheetPdf = { planPages: planPages, countPages: countPages, pngInfo: pngInfo, renderPage: renderPage, exportPdf: exportPdf, buildPrintTable: buildPrintTable, fontStack: fontStack, A4_LANDSCAPE: A4_LANDSCAPE, PDF_PAGE: PDF_PAGE };
})(typeof globalThis !== 'undefined' ? globalThis : this);
