/* SHEET — 변환 모듈 (DOM 없음)
   1) 수식 계산기 createCalc(sheets) — CSV·PDF·인쇄·xlsx 캐시값에 쓰는 화면 값(=SUM 등 결과). 시트 간 참조(Sheet2!A1)도 계산.
   2) x-spreadsheet 데이터 ⇄ ExcelJS 통합문서 — 값·수식(문자열 그대로)·병합·열 너비·행 높이·기본 서식·틀 고정.
   3) CSV 파서/생성기 (RFC 4180, 구분자 자동 감지, UTF-8 BOM, 인코딩 폴백).
   ExcelJS 는 인자로 받는다(브라우저는 CDN 전역, Node 검증은 같은 CDN 빌드를 읽어서 전달). */
(function (root) {
  'use strict';

  /* =========================================================== A1 표기 */
  function colName(ci) { var s = '', n = ci + 1; while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; }
  function colIndex(name) { var n = 0, up = String(name).toUpperCase(); for (var i = 0; i < up.length; i++) n = n * 26 + (up.charCodeAt(i) - 64); return n - 1; }
  function parseRef(s) { var m = /^\$?([A-Za-z]{1,3})\$?([1-9]\d*)$/.exec(String(s).trim()); return m ? { ri: +m[2] - 1, ci: colIndex(m[1]) } : null; }
  function parseRange(s) {
    var p = String(s).split(':'), a = parseRef(p[0]), b = parseRef(p[1] || p[0]);
    if (!a || !b) return null;
    return { sri: Math.min(a.ri, b.ri), sci: Math.min(a.ci, b.ci), eri: Math.max(a.ri, b.ri), eci: Math.max(a.ci, b.ci) };
  }
  function cellRef(ri, ci) { return colName(ci) + (ri + 1); }
  function rangeRef(r) { return cellRef(r.sri, r.sci) + ':' + cellRef(r.eri, r.eci); }

  /* =========================================================== 시트 헬퍼 */
  var DEF_COL_W = 100, DEF_ROW_H = 25;
  function blankSheet(name) { return { name: name || 'Sheet1', freeze: 'A1', styles: [], merges: [], rows: { len: 200 }, cols: { len: 26 }, validations: [], autofilter: {} }; }
  function cellAt(sheet, ri, ci) { var row = sheet && sheet.rows && sheet.rows[ri]; return row && row.cells ? row.cells[ci] : undefined; }
  function eachCell(sheet, fn) {
    var rows = (sheet && sheet.rows) || {};
    Object.keys(rows).forEach(function (rk) {
      if (!/^\d+$/.test(rk)) return;
      var cells = (rows[rk] && rows[rk].cells) || {};
      Object.keys(cells).forEach(function (ck) { if (/^\d+$/.test(ck)) fn(+rk, +ck, cells[ck]); });
    });
  }
  function hasText(c) { return !!(c && c.text != null && String(c.text) !== ''); }
  function styleOf(sheet, cell) { return cell && cell.style != null && sheet.styles ? sheet.styles[cell.style] || null : null; }
  function styleVisible(st) { return !!(st && ((st.bgcolor && !/^#?f{3}(f{3})?$/i.test(st.bgcolor)) || st.border)); }
  /** 사용 범위(0-based, 끝 포함). textOnly 면 글자가 있는 칸만 */
  function usedRange(sheet, opts) {
    var textOnly = opts && opts.textOnly, eri = -1, eci = -1;
    eachCell(sheet, function (ri, ci, c) {
      if (hasText(c) || (!textOnly && styleVisible(styleOf(sheet, c)))) { if (ri > eri) eri = ri; if (ci > eci) eci = ci; }
    });
    if (!textOnly) (sheet.merges || []).forEach(function (m) { var r = parseRange(m); if (r) { if (r.eri > eri) eri = r.eri; if (r.eci > eci) eci = r.eci; } });
    return { eri: eri, eci: eci };
  }
  function isSheetEmpty(sheet) { var any = false; eachCell(sheet, function (r, c, cell) { if (hasText(cell)) any = true; }); return !any; }
  function isBookEmpty(sheets) { return !sheets || sheets.every(isSheetEmpty); }
  function colWidth(sheet, ci) { var c = sheet.cols && sheet.cols[ci]; return c && c.hide ? 0 : (c && c.width) || DEF_COL_W; }
  function rowHeight(sheet, ri) { var r = sheet.rows && sheet.rows[ri]; return r && r.hide ? 0 : (r && r.height) || DEF_ROW_H; }
  /** 병합 지도: master 'ri:ci' → range, covered 'ri:ci'(master 제외) → master range */
  function mergeMap(sheet) {
    var masters = {}, covered = {};
    (sheet.merges || []).forEach(function (m) {
      var r = parseRange(m); if (!r) return;
      masters[r.sri + ':' + r.sci] = r;
      for (var ri = r.sri; ri <= r.eri; ri++) for (var ci = r.sci; ci <= r.eci; ci++) if (ri !== r.sri || ci !== r.sci) covered[ri + ':' + ci] = r;
    });
    return { masters: masters, covered: covered };
  }

  /* =========================================================== 숫자 · 서식 */
  var NUM_RE = /^[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?$/;
  function fmtNum(n) {
    if (!isFinite(n)) return '#NUM!';
    if (Number.isInteger(n)) return String(n);
    return String(parseFloat(n.toPrecision(15)));
  }
  function groupNum(v) {
    var s = Number(v).toFixed(2), neg = s[0] === '-';
    if (neg) s = s.slice(1);
    var p = s.split('.');
    return (neg ? '-' : '') + p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + p[1];
  }
  // x-spreadsheet 의 format 렌더와 같은 규칙(화면과 PDF/인쇄가 같은 글자로 보이게)
  function applyFormat(fmt, text) {
    if (!NUM_RE.test(String(text).trim())) return text;
    switch (fmt) {
      case 'number': return groupNum(text);
      case 'percent': return text + '%';
      case 'rmb': return '￥' + groupNum(text);
      case 'usd': return '$' + groupNum(text);
      case 'eur': return '€' + groupNum(text);
      default: return text;
    }
  }

  /* =========================================================== 수식 계산기 */
  var ERR = function (code) { return { err: code }; };
  var isErr = function (v) { return !!(v && typeof v === 'object' && 'err' in v); };
  var isRange = function (v) { return !!(v && typeof v === 'object' && v.range === true); };

  function tokenize(src) {
    var out = [], i = 0, n = src.length, m;
    while (i < n) {
      var c = src[i];
      if (c === ' ' || c === '\t' || c === '\n' || c === '\r') { i++; continue; }
      if (c === '"') {
        var j = i + 1, s = '';
        for (;;) {
          if (j >= n) throw ERR('#ERROR!');
          if (src[j] === '"') { if (src[j + 1] === '"') { s += '"'; j += 2; continue; } break; }
          s += src[j++];
        }
        out.push({ t: 'str', v: s }); i = j + 1; continue;
      }
      var rest = src.slice(i);
      if ((m = /^(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/.exec(rest))) { out.push({ t: 'num', v: parseFloat(m[0]) }); i += m[0].length; continue; }
      if ((m = /^(?:'((?:[^']|'')+)'|([A-Za-z0-9_ -￿][A-Za-z0-9_. -￿]*))!(\$?[A-Za-z]{1,3}\$?\d+(?::\$?[A-Za-z]{1,3}\$?\d+)?)/.exec(rest))) {
        out.push({ t: 'ref', sheet: m[1] != null ? m[1].replace(/''/g, "'") : m[2], ref: m[3] }); i += m[0].length; continue;
      }
      if ((m = /^\$?[A-Za-z]{1,3}\$?\d+(?::\$?[A-Za-z]{1,3}\$?\d+)?(?![A-Za-z0-9_(])/.exec(rest))) { out.push({ t: 'ref', sheet: null, ref: m[0] }); i += m[0].length; continue; }
      if ((m = /^[A-Za-z_][A-Za-z0-9_.]*/.exec(rest))) {
        var name = m[0].toUpperCase(); i += m[0].length;
        var k = i; while (src[k] === ' ') k++;
        if (src[k] === '(') { out.push({ t: 'fn', v: name }); i = k; } else out.push({ t: 'name', v: name });
        continue;
      }
      if ((m = /^(<=|>=|<>|[-+*/^&=<>%(),;])/.exec(rest))) { out.push({ t: 'op', v: m[0] === ';' ? ',' : m[0] }); i += m[0].length; continue; }
      throw ERR('#ERROR!');
    }
    return out;
  }

  function parseFormula(src) {
    var toks = tokenize(src), p = 0;
    var peek = function () { return toks[p]; };
    var isOp = function (v) { var t = toks[p]; return !!(t && t.t === 'op' && t.v === v); };
    var BIN = { '=': 1, '<>': 1, '<': 1, '>': 1, '<=': 1, '>=': 1, '&': 2, '+': 3, '-': 3, '*': 4, '/': 4, '^': 5 };
    function expr(minBp) {
      var left = unary();
      for (;;) {
        var tk = peek();
        if (!tk || tk.t !== 'op') break;
        if (tk.v === '%') { p++; left = { k: 'pct', a: left }; continue; }
        var bp = BIN[tk.v];
        if (!bp || bp < minBp) break;
        p++;
        left = { k: 'bin', op: tk.v, a: left, b: expr(bp + 1) };
      }
      return left;
    }
    function unary() {
      var tk = peek();
      if (tk && tk.t === 'op' && (tk.v === '-' || tk.v === '+')) { p++; var a = unary(); return tk.v === '-' ? { k: 'neg', a: a } : a; }
      return primary();
    }
    function primary() {
      var tk = toks[p++];
      if (!tk) throw ERR('#ERROR!');
      if (tk.t === 'num') return { k: 'lit', v: tk.v };
      if (tk.t === 'str') return { k: 'lit', v: tk.v };
      if (tk.t === 'ref') return { k: 'ref', sheet: tk.sheet, ref: tk.ref };
      if (tk.t === 'name') {
        if (tk.v === 'TRUE') return { k: 'lit', v: true };
        if (tk.v === 'FALSE') return { k: 'lit', v: false };
        return { k: 'lit', v: ERR('#NAME?') };
      }
      if (tk.t === 'fn') {
        p++; // (
        var args = [];
        if (isOp(')')) { p++; return { k: 'fn', name: tk.v, args: args }; }
        for (;;) {
          if (isOp(',')) { args.push({ k: 'empty' }); p++; continue; }
          if (isOp(')')) { args.push({ k: 'empty' }); p++; break; }
          args.push(expr(1));
          if (isOp(',')) { p++; if (isOp(')')) { args.push({ k: 'empty' }); p++; break; } continue; }
          if (isOp(')')) { p++; break; }
          throw ERR('#ERROR!');
        }
        return { k: 'fn', name: tk.v, args: args };
      }
      if (tk.t === 'op' && tk.v === '(') {
        var e = expr(1);
        if (!isOp(')')) throw ERR('#ERROR!');
        p++;
        return e;
      }
      throw ERR('#ERROR!');
    }
    var ast = expr(1);
    if (p < toks.length) throw ERR('#ERROR!');
    return ast;
  }

  function literal(t) {
    if (t === '') return null;
    var s = t.trim();
    if (NUM_RE.test(s)) return parseFloat(s);
    var u = s.toUpperCase();
    if (u === 'TRUE') return true;
    if (u === 'FALSE') return false;
    return t;
  }
  function toNum(v) {
    if (isErr(v)) return v;
    if (v === null || v === undefined || v === '') return 0;
    if (typeof v === 'number') return v;
    if (typeof v === 'boolean') return v ? 1 : 0;
    var s = String(v).trim();
    return NUM_RE.test(s) ? parseFloat(s) : ERR('#VALUE!');
  }
  function toStr(v) {
    if (v === null || v === undefined) return '';
    if (typeof v === 'number') return fmtNum(v);
    if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
    if (isErr(v)) return v.err;
    return String(v);
  }
  function toBool(v) {
    if (isErr(v)) return v;
    if (typeof v === 'boolean') return v;
    if (v === null || v === undefined || v === '') return false;
    if (typeof v === 'number') return v !== 0;
    var u = String(v).trim().toUpperCase();
    if (u === 'TRUE') return true;
    if (u === 'FALSE') return false;
    var n = toNum(v);
    return isErr(n) ? ERR('#VALUE!') : n !== 0;
  }
  function cmp(a, b) {
    var na = a === null ? (typeof b === 'string' ? '' : 0) : a;
    var nb = b === null ? (typeof a === 'string' ? '' : 0) : b;
    var rank = function (x) { return typeof x === 'number' ? 0 : typeof x === 'string' ? 1 : 2; };
    if (rank(na) !== rank(nb)) return rank(na) - rank(nb);
    if (typeof na === 'string') { var x = na.toLowerCase(), y = nb.toLowerCase(); return x < y ? -1 : x > y ? 1 : 0; }
    if (typeof na === 'boolean') return (na ? 1 : 0) - (nb ? 1 : 0);
    return na < nb ? -1 : na > nb ? 1 : 0;
  }

  function createCalc(sheets) {
    sheets = sheets || [];
    var byName = {};
    sheets.forEach(function (s, i) { byName[String((s && s.name) || '').toLowerCase()] = i; });
    var cache = {}, busy = {}, astCache = {};

    function raw(si, ri, ci) { var c = cellAt(sheets[si], ri, ci); return c && c.text != null ? String(c.text) : ''; }
    function value(si, ri, ci) {
      var key = si + ':' + ri + ':' + ci;
      if (key in cache) return cache[key];
      var t = raw(si, ri, ci), v;
      if (t.length > 1 && t[0] === '=') {
        if (busy[key]) return ERR('#REF!');
        busy[key] = true;
        try {
          var src = t.slice(1);
          var ast = astCache[src] || (astCache[src] = parseFormula(src));
          v = scalar(evalNode(ast, si));
          if (v === null) v = 0;
        } catch (e) { v = isErr(e) ? e : ERR('#ERROR!'); }
        delete busy[key];
      } else v = literal(t);
      cache[key] = v;
      return v;
    }
    function rangeVal(si, r) { return { range: true, si: si, r: r }; }
    function scalar(v) {
      if (!isRange(v)) return v;
      if (v.r.sri === v.r.eri && v.r.sci === v.r.eci) return value(v.si, v.r.sri, v.r.sci);
      return ERR('#VALUE!');
    }
    function eachInRange(v, fn) { for (var ri = v.r.sri; ri <= v.r.eri; ri++) for (var ci = v.r.sci; ci <= v.r.eci; ci++) fn(value(v.si, ri, ci)); }

    function evalNode(n, si) {
      switch (n.k) {
        case 'lit': return n.v;
        case 'empty': return null;
        case 'ref': {
          var sx = si;
          if (n.sheet != null) { var idx = byName[String(n.sheet).toLowerCase()]; if (idx === undefined) return ERR('#REF!'); sx = idx; }
          var r = parseRange(n.ref);
          return r ? rangeVal(sx, r) : ERR('#REF!');
        }
        case 'neg': { var a = toNum(scalar(evalNode(n.a, si))); return isErr(a) ? a : -a; }
        case 'pct': { var b = toNum(scalar(evalNode(n.a, si))); return isErr(b) ? b : b / 100; }
        case 'bin': {
          var x = scalar(evalNode(n.a, si)), y = scalar(evalNode(n.b, si));
          if (isErr(x)) return x;
          if (isErr(y)) return y;
          if (n.op === '&') return toStr(x) + toStr(y);
          if (n.op === '=' || n.op === '<>' || n.op === '<' || n.op === '>' || n.op === '<=' || n.op === '>=') {
            var c = cmp(x, y);
            return n.op === '=' ? c === 0 : n.op === '<>' ? c !== 0 : n.op === '<' ? c < 0 : n.op === '>' ? c > 0 : n.op === '<=' ? c <= 0 : c >= 0;
          }
          var p = toNum(x), q = toNum(y);
          if (isErr(p)) return p;
          if (isErr(q)) return q;
          switch (n.op) {
            case '+': return p + q;
            case '-': return p - q;
            case '*': return p * q;
            case '/': return q === 0 ? ERR('#DIV/0!') : p / q;
            case '^': { var w = Math.pow(p, q); return isFinite(w) ? w : ERR('#NUM!'); }
          }
          return ERR('#ERROR!');
        }
        case 'fn': {
          var f = FN[n.name];
          return f ? f(n.args, si) : ERR('#NAME?');
        }
      }
      return ERR('#ERROR!');
    }

    // 인수 펼치기: 범위(참조) 안의 글자·빈칸은 숫자 함수에서 무시, 직접 쓴 값은 변환
    function flat(args, si) {
      var out = [];
      for (var i = 0; i < args.length; i++) {
        var v = evalNode(args[i], si);
        if (isRange(v)) eachInRange(v, function (x) { out.push({ v: x, ref: true }); });
        else out.push({ v: v, ref: false });
      }
      return out;
    }
    function nums(args, si) {
      var list = flat(args, si), out = [];
      for (var i = 0; i < list.length; i++) {
        var it = list[i];
        if (isErr(it.v)) return it.v;
        if (it.ref) { if (typeof it.v === 'number') out.push(it.v); }
        else if (it.v !== null) { var n = toNum(it.v); if (isErr(n)) return n; out.push(n); }
      }
      return out;
    }
    function one(args, i, si) { return args[i] ? scalar(evalNode(args[i], si)) : null; }
    var num1 = function (fn) { return function (args, si) { var a = toNum(one(args, 0, si)); return isErr(a) ? a : fn(a); }; };
    var str1 = function (fn) { return function (args, si) { var a = one(args, 0, si); return isErr(a) ? a : fn(toStr(a)); }; };
    var round = function (x, d, mode) {
      var f = Math.pow(10, d), y = Math.abs(x) * f;
      y = mode === 'up' ? Math.ceil(y - 1e-9) : mode === 'down' ? Math.floor(y + 1e-9) : Math.round(y + 1e-9);
      return Math.sign(x) * y / f;
    };
    var FN = {
      SUM: function (a, si) { var l = nums(a, si); return isErr(l) ? l : l.reduce(function (s, x) { return s + x; }, 0); },
      PRODUCT: function (a, si) { var l = nums(a, si); return isErr(l) ? l : l.reduce(function (s, x) { return s * x; }, 1); },
      AVERAGE: function (a, si) { var l = nums(a, si); if (isErr(l)) return l; return l.length ? l.reduce(function (s, x) { return s + x; }, 0) / l.length : ERR('#DIV/0!'); },
      MIN: function (a, si) { var l = nums(a, si); return isErr(l) ? l : (l.length ? Math.min.apply(null, l) : 0); },
      MAX: function (a, si) { var l = nums(a, si); return isErr(l) ? l : (l.length ? Math.max.apply(null, l) : 0); },
      COUNT: function (a, si) { return flat(a, si).filter(function (it) { return typeof it.v === 'number' || (!it.ref && !isErr(toNum(it.v)) && it.v !== null); }).length; },
      COUNTA: function (a, si) { return flat(a, si).filter(function (it) { return it.v !== null && it.v !== ''; }).length; },
      IF: function (a, si) {
        var c = toBool(one(a, 0, si));
        if (isErr(c)) return c;
        if (c) return a.length > 1 ? (a[1].k === 'empty' ? 0 : scalar(evalNode(a[1], si))) : true;
        return a.length > 2 ? (a[2].k === 'empty' ? 0 : scalar(evalNode(a[2], si))) : false;
      },
      AND: function (a, si) { var l = flat(a, si), any = false; for (var i = 0; i < l.length; i++) { var v = l[i].v; if (isErr(v)) return v; if (v === null || (l[i].ref && typeof v === 'string')) continue; var b = toBool(v); if (isErr(b)) return b; any = true; if (!b) return false; } return any ? true : ERR('#VALUE!'); },
      OR: function (a, si) { var l = flat(a, si), any = false; for (var i = 0; i < l.length; i++) { var v = l[i].v; if (isErr(v)) return v; if (v === null || (l[i].ref && typeof v === 'string')) continue; var b = toBool(v); if (isErr(b)) return b; any = true; if (b) return true; } return any ? false : ERR('#VALUE!'); },
      NOT: function (a, si) { var b = toBool(one(a, 0, si)); return isErr(b) ? b : !b; },
      CONCAT: function (a, si) { var l = flat(a, si), s = ''; for (var i = 0; i < l.length; i++) { if (isErr(l[i].v)) return l[i].v; s += toStr(l[i].v); } return s; },
      ROUND: function (a, si) { var x = toNum(one(a, 0, si)), d = toNum(one(a, 1, si)); if (isErr(x)) return x; if (isErr(d)) return d; return round(x, Math.trunc(d)); },
      ROUNDUP: function (a, si) { var x = toNum(one(a, 0, si)), d = toNum(one(a, 1, si)); if (isErr(x)) return x; if (isErr(d)) return d; return round(x, Math.trunc(d), 'up'); },
      ROUNDDOWN: function (a, si) { var x = toNum(one(a, 0, si)), d = toNum(one(a, 1, si)); if (isErr(x)) return x; if (isErr(d)) return d; return round(x, Math.trunc(d), 'down'); },
      ABS: num1(Math.abs),
      INT: num1(Math.floor),
      SQRT: num1(function (x) { return x < 0 ? ERR('#NUM!') : Math.sqrt(x); }),
      MOD: function (a, si) { var x = toNum(one(a, 0, si)), y = toNum(one(a, 1, si)); if (isErr(x)) return x; if (isErr(y)) return y; return y === 0 ? ERR('#DIV/0!') : x - y * Math.floor(x / y); },
      POWER: function (a, si) { var x = toNum(one(a, 0, si)), y = toNum(one(a, 1, si)); if (isErr(x)) return x; if (isErr(y)) return y; var w = Math.pow(x, y); return isFinite(w) ? w : ERR('#NUM!'); },
      LEN: str1(function (s) { return Array.from(s).length; }),
      UPPER: str1(function (s) { return s.toUpperCase(); }),
      LOWER: str1(function (s) { return s.toLowerCase(); }),
      TRIM: str1(function (s) { return s.trim().replace(/ {2,}/g, ' '); })
    };
    FN.CONCATENATE = FN.CONCAT;
    FN.AVG = FN.AVERAGE;

    /** 화면에 보이는 글자 (수식 결과 + 표시 형식) */
    function display(si, ri, ci) {
      var sheet = sheets[si], c = cellAt(sheet, ri, ci);
      if (!c) return '';
      var t = c.text != null ? String(c.text) : '', out;
      if (t.length > 1 && t[0] === '=') { var v = value(si, ri, ci); out = toStr(v); }
      else out = t;
      var st = styleOf(sheet, c);
      return st && st.format ? applyFormat(st.format, out) : out;
    }
    return { value: value, display: display, isErr: isErr };
  }

  /* =========================================================== CSV */
  function detectDelimiter(text) {
    var sample = text.slice(0, 20000), counts = { ',': 0, ';': 0, '\t': 0 }, inQ = false, lines = 0;
    for (var i = 0; i < sample.length && lines < 20; i++) {
      var c = sample[i];
      if (c === '"') inQ = !inQ;
      else if (!inQ && (c === '\n')) lines++;
      else if (!inQ && c in counts) counts[c]++;
    }
    var best = ',', n = 0;
    Object.keys(counts).forEach(function (k) { if (counts[k] > n) { n = counts[k]; best = k; } });
    return best;
  }
  /** RFC 4180 파서 — 따옴표 안 줄바꿈·구분자·"" 이스케이프 지원. 끝의 빈 줄 하나는 버린다 */
  function parseCSV(text, delim) {
    text = String(text || '');
    if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
    var d = delim || detectDelimiter(text);
    var rows = [], row = [], field = '', i = 0, n = text.length, inQ = false;
    while (i < n) {
      var c = text[i];
      if (inQ) {
        if (c === '"') { if (text[i + 1] === '"') { field += '"'; i += 2; continue; } inQ = false; i++; continue; }
        field += c; i++; continue;
      }
      if (c === '"' && field === '') { inQ = true; i++; continue; }
      if (c === d) { row.push(field); field = ''; i++; continue; }
      if (c === '\r' || c === '\n') { row.push(field); rows.push(row); row = []; field = ''; i += (c === '\r' && text[i + 1] === '\n') ? 2 : 1; continue; }
      field += c; i++;
    }
    if (field !== '' || row.length) { row.push(field); rows.push(row); }
    return rows;
  }
  function csvField(s) { s = String(s == null ? '' : s); return /[",\r\n]/.test(s) || /^\s|\s$/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
  function toCSV(matrix) { return matrix.map(function (r) { return r.map(csvField).join(','); }).join('\r\n'); }
  /** 현재 시트를 화면 값(수식 결과) 기준 CSV 로 — BOM 은 호출하는 쪽에서 붙인다 */
  function sheetToCSV(sheets, si) {
    var sheet = sheets[si], calc = createCalc(sheets), ur = usedRange(sheet, { textOnly: true }), mm = mergeMap(sheet), out = [];
    for (var ri = 0; ri <= ur.eri; ri++) {
      var row = [];
      for (var ci = 0; ci <= ur.eci; ci++) row.push(mm.covered[ri + ':' + ci] ? '' : calc.display(si, ri, ci));
      out.push(row);
    }
    return toCSV(out);
  }
  function sheetFromMatrix(matrix, name) {
    var sh = blankSheet(name), maxC = 0;
    matrix.forEach(function (r, ri) {
      var cells = {};
      r.forEach(function (v, ci) { if (v !== '' && v != null) { cells[ci] = { text: String(v) }; if (ci > maxC) maxC = ci; } });
      if (Object.keys(cells).length) sh.rows[ri] = { cells: cells };
    });
    sh.rows.len = Math.max(200, matrix.length + 50);
    sh.cols.len = Math.max(26, maxC + 6);
    return sh;
  }
  /** 바이트 → 글자: UTF-8 이 아니면 UI 언어에 맞는 레거시 인코딩으로 */
  var LEGACY = { ko: 'euc-kr', ja: 'shift_jis', zh: 'gbk', 'zh-Hant': 'big5', th: 'windows-874', ru: 'windows-1251' };
  function decodeText(buf, lang) {
    var bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
    try { return new TextDecoder('utf-8', { fatal: true }).decode(bytes); } catch (e) { /* not utf-8 */ }
    try { return new TextDecoder(LEGACY[lang] || 'windows-1252').decode(bytes); } catch (e) { return new TextDecoder('utf-8').decode(bytes); }
  }
  /** 붙여넣기용 TSV(엑셀·구글 시트) — \r\n / \n 모두, 따옴표 안 줄바꿈, 끝 줄바꿈 무시 */
  function parseTSV(text) {
    text = String(text || '').replace(/\r\n?/g, '\n');
    if (text.endsWith('\n')) text = text.slice(0, -1);
    return parseCSV(text, '\t');
  }

  /* =========================================================== 색 · 서식 변환 */
  function toHex(c) {
    if (!c) return null;
    var s = String(c).trim(), m;
    if ((m = /^#([0-9a-f]{3})$/i.exec(s))) return '#' + m[1].split('').map(function (x) { return x + x; }).join('').toLowerCase();
    if ((m = /^#([0-9a-f]{6})$/i.exec(s))) return '#' + m[1].toLowerCase();
    if ((m = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i.exec(s))) return '#' + [m[1], m[2], m[3]].map(function (x) { return ('0' + Math.min(255, +x).toString(16)).slice(-2); }).join('');
    return null;
  }
  var argb = function (hex) { return 'FF' + hex.slice(1).toUpperCase(); };
  var fromArgb = function (a) { return a && /^[0-9a-f]{6,8}$/i.test(a) ? '#' + String(a).slice(-6).toLowerCase() : null; };
  var BORDER_TO_X = { thin: 'thin', hair: 'thin', medium: 'medium', thick: 'thick', dotted: 'dotted', double: 'double', dashed: 'dashed', dashDot: 'dashed', dashDotDot: 'dashed', mediumDashed: 'dashed', mediumDashDot: 'dashed', mediumDashDotDot: 'dashed', slantDashDot: 'dashed' };
  var FORMAT_TO_X = { number: '#,##0.00', percent: '0.00%', usd: '"$"#,##0.00', eur: '"€"#,##0.00', rmb: '"¥"#,##0.00' };
  var X_FONTS = ['Helvetica', 'Source Sans Pro', 'Comic Sans MS', 'Courier New', 'Verdana', 'Lato'];

  function xStyleToExcel(st) {
    var out = {}, f = st.font || {}, font = {};
    if (f.bold) font.bold = true;
    if (f.italic) font.italic = true;
    if (st.underline) font.underline = true;
    if (st.strike) font.strike = true;
    if (f.size) font.size = f.size;
    if (f.name) font.name = f.name;
    var col = toHex(st.color);
    if (col && col !== '#0a0a0a' && col !== '#000000') font.color = { argb: argb(col) };
    if (Object.keys(font).length) out.font = font;
    var bg = toHex(st.bgcolor);
    if (bg && bg !== '#ffffff') out.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: argb(bg) } };
    var al = {};
    if (st.align) al.horizontal = st.align;
    if (st.valign) al.vertical = st.valign;
    if (st.textwrap) al.wrapText = true;
    if (Object.keys(al).length) out.alignment = al;
    if (st.border) {
      var b = {};
      ['top', 'right', 'bottom', 'left'].forEach(function (side) {
        var v = st.border[side];
        if (v && v[0]) b[side] = { style: v[0], color: { argb: argb(toHex(v[1]) || '#000000') } };
      });
      if (Object.keys(b).length) out.border = b;
    }
    if (st.format && FORMAT_TO_X[st.format]) out.numFmt = FORMAT_TO_X[st.format];
    return out;
  }
  function excelStyleToX(s) {
    if (!s) return null;
    var out = {}, f = s.font || {};
    var font = {};
    if (f.bold) font.bold = true;
    if (f.italic) font.italic = true;
    if (f.size && f.size !== 11) font.size = f.size;
    if (f.name && X_FONTS.indexOf(f.name) >= 0) font.name = f.name;
    if (Object.keys(font).length) out.font = font;
    if (f.underline) out.underline = true;
    if (f.strike) out.strike = true;
    var fc = f.color && fromArgb(f.color.argb);
    if (fc && fc !== '#000000') out.color = fc;
    var fill = s.fill;
    if (fill && fill.type === 'pattern' && fill.pattern === 'solid' && fill.fgColor) { var bg = fromArgb(fill.fgColor.argb); if (bg && bg !== '#ffffff') out.bgcolor = bg; }
    var al = s.alignment || {};
    if (al.horizontal === 'left' || al.horizontal === 'right' || al.horizontal === 'center') out.align = al.horizontal;
    else if (al.horizontal === 'centerContinuous') out.align = 'center';
    if (al.vertical === 'top' || al.vertical === 'middle' || al.vertical === 'bottom') out.valign = al.vertical;
    else if (al.vertical === 'center') out.valign = 'middle';
    if (al.wrapText) out.textwrap = true;
    if (s.border) {
      var bd = {};
      ['top', 'right', 'bottom', 'left'].forEach(function (side) {
        var v = s.border[side];
        if (v && v.style) bd[side] = [BORDER_TO_X[v.style] || 'thin', (v.color && fromArgb(v.color.argb)) || '#000000'];
      });
      if (Object.keys(bd).length) out.border = bd;
    }
    var nf = s.numFmt ? String(s.numFmt) : '';
    if (nf) {
      if (/%/.test(nf)) out.format = 'percent';
      else if (/\$/.test(nf)) out.format = 'usd';
      else if (/€/.test(nf)) out.format = 'eur';
      else if (/[¥￥]/.test(nf)) out.format = 'rmb';
      else if (/^#,##0\.00$/.test(nf)) out.format = 'number';
    }
    return Object.keys(out).length ? out : null;
  }

  /* =========================================================== xlsx 내보내기 */
  var pxToChars = function (px) { return Math.round(((px - 5) / 7) * 100) / 100; };
  var charsToPx = function (w) { return Math.round(w * 7 + 5); };
  var pxToPt = function (px) { return Math.round(px * 0.75 * 100) / 100; };
  var ptToPx = function (pt) { return Math.round(pt / 0.75); };
  /** 숫자로 저장할 글자인지 — 앞자리 0(우편번호·코드), 15자리 초과(정밀도 손실)는 글자로 둔다 */
  function isNumericText(t) {
    var s = String(t);
    if (!NUM_RE.test(s) || s !== s.trim()) return false;
    if (/^[-+]?0\d/.test(s) || /^\+/.test(s)) return false;
    return s.replace(/[^0-9]/g, '').replace(/^0+/, '').length <= 15;
  }
  function safeSheetName(name, used, i) {
    var s = String(name || '').replace(/[\[\]:*?\/\\]/g, '_').replace(/^'+|'+$/g, '').slice(0, 31).trim() || ('Sheet' + (i + 1));
    var base = s, k = 2;
    while (used[s.toLowerCase()]) { var suf = ' (' + k++ + ')'; s = base.slice(0, 31 - suf.length) + suf; }
    used[s.toLowerCase()] = true;
    return s;
  }
  function excelDate(d) { return Object.prototype.toString.call(d) === '[object Date]'; }

  function buildWorkbook(book, ExcelJS) {
    var wb = new ExcelJS.Workbook();
    wb.creator = 'SHEET (excel.broodev.com)';
    wb.created = new Date(book.createdAt || Date.now());
    wb.modified = new Date(book.updatedAt || Date.now());
    try { wb.calcProperties.fullCalcOnLoad = true; } catch (e) { /* ignore */ }
    var sheets = book.sheets || [], calc = createCalc(sheets), used = {};
    sheets.forEach(function (sh, si) {
      var fz = parseRef(sh.freeze || 'A1');
      var views = fz && (fz.ri > 0 || fz.ci > 0) ? [{ state: 'frozen', xSplit: fz.ci, ySplit: fz.ri }] : [];
      var ws = wb.addWorksheet(safeSheetName(sh.name, used, si), { views: views });
      var ur = usedRange(sh), mm = mergeMap(sh);
      // 열 너비 (사용 범위 전체 + 너비를 지정한 열)
      var maxC = ur.eci;
      Object.keys(sh.cols || {}).forEach(function (k) { if (/^\d+$/.test(k) && +k > maxC) maxC = +k; });
      for (var ci = 0; ci <= maxC; ci++) {
        var cd = (sh.cols || {})[ci] || {}, col = ws.getColumn(ci + 1);
        col.width = pxToChars(cd.width || DEF_COL_W);
        if (cd.hide) col.hidden = true;
      }
      // 행 높이 · 숨김
      Object.keys(sh.rows || {}).forEach(function (rk) {
        if (!/^\d+$/.test(rk)) return;
        var rd = sh.rows[rk];
        if (rd.height || rd.hide) { var row = ws.getRow(+rk + 1); if (rd.height) row.height = pxToPt(rd.height); if (rd.hide) row.hidden = true; }
      });
      // 병합 먼저 (병합 안쪽 칸에 값을 쓰면 ExcelJS 가 master 를 덮어쓰므로 master 만 쓴다)
      (sh.merges || []).forEach(function (m) { var r = parseRange(m); if (r && (r.eri > r.sri || r.eci > r.sci)) { try { ws.mergeCells(rangeRef(r)); } catch (e) { /* 겹치는 병합 무시 */ } } });
      eachCell(sh, function (ri, ci, c) {
        if (mm.covered[ri + ':' + ci]) return;
        var cell = ws.getCell(ri + 1, ci + 1);
        var st = styleOf(sh, c);
        var text = c.text != null ? String(c.text) : '';
        if (text.length > 1 && text[0] === '=') {
          var res = calc.value(si, ri, ci), fv = { formula: text.slice(1) };
          if (typeof res === 'number' || typeof res === 'boolean' || (typeof res === 'string' && res !== '')) fv.result = res;
          cell.value = fv;
        } else if (text !== '') {
          if (isNumericText(text)) { var n = parseFloat(text); if (st && st.format === 'percent') n = n / 100; cell.value = n; }
          else cell.value = text;
        }
        if (st) { var xs = xStyleToExcel(st); Object.keys(xs).forEach(function (k) { cell[k] = xs[k]; }); }
      });
    });
    if (!sheets.length) wb.addWorksheet('Sheet1');
    return wb;
  }
  function exportXlsx(book, ExcelJS) { return buildWorkbook(book, ExcelJS).xlsx.writeBuffer(); }

  /* =========================================================== xlsx 가져오기 */
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function dateText(d) {
    var s = d.getUTCFullYear() + '-' + pad2(d.getUTCMonth() + 1) + '-' + pad2(d.getUTCDate());
    var h = d.getUTCHours(), mi = d.getUTCMinutes(), se = d.getUTCSeconds();
    if (h || mi || se) s += ' ' + pad2(h) + ':' + pad2(mi) + (se ? ':' + pad2(se) : '');
    return s;
  }
  function richText(v) { return v && v.richText ? v.richText.map(function (r) { return r.text || ''; }).join('') : null; }
  function cellText(cell, ExcelJS, pct) {
    var VT = ExcelJS.ValueType || {};
    var type = cell.type, v = cell.value;
    if (type === VT.Formula || (v && typeof v === 'object' && (v.formula || v.sharedFormula))) {
      var f = cell.formula || (v && v.formula);
      if (f) return '=' + String(f).replace(/^=/, '');
      if (v && v.result != null) v = v.result; else return '';
    }
    if (v === null || v === undefined) return '';
    if (typeof v === 'number') return fmtNum(pct ? v * 100 : v);
    if (typeof v === 'string') return v;
    if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
    if (excelDate(v)) return dateText(v);
    var rt = richText(v); if (rt != null) return rt;
    if (v.text != null) return typeof v.text === 'object' ? (richText(v.text) || '') : String(v.text);
    if (v.error) return String(v.error);
    return String(v);
  }
  function importWorkbook(wb, ExcelJS) {
    var VT = ExcelJS.ValueType || {};
    var out = [];
    (wb.worksheets || []).forEach(function (ws, wi) {
      var sh = blankSheet(ws.name || ('Sheet' + (wi + 1)));
      var styleKeys = {};
      var addStyle = function (st) { var k = JSON.stringify(st); if (!(k in styleKeys)) { styleKeys[k] = sh.styles.length; sh.styles.push(st); } return styleKeys[k]; };
      var merges = [];
      try { merges = (ws.model && ws.model.merges) || []; } catch (e) { merges = []; }
      var maxR = -1, maxC = -1;
      var defH = (ws.properties && ws.properties.defaultRowHeight) || 15;
      ws.eachRow({ includeEmpty: true }, function (row, rn) {
        var ri = rn - 1, cells = {}, rd = {};
        if (row.height && Math.abs(row.height - defH) > 0.01) { var px = ptToPx(row.height); if (px !== DEF_ROW_H) rd.height = px; }
        if (row.hidden) rd.hide = true;
        row.eachCell({ includeEmpty: true }, function (cell, cn) {
          if (cell.type === VT.Merge) return;
          var ci = cn - 1;
          var nf = cell.numFmt ? String(cell.numFmt) : '';
          var text = cellText(cell, ExcelJS, /%/.test(nf) && typeof cell.value === 'number');
          var st = excelStyleToX(cell.style);
          if (text === '' && !st) return;
          var c = {};
          if (text !== '') c.text = text;
          if (st) c.style = addStyle(st);
          cells[ci] = c;
          if (ci > maxC) maxC = ci;
        });
        if (Object.keys(cells).length) { rd.cells = cells; if (ri > maxR) maxR = ri; }
        if (Object.keys(rd).length) sh.rows[ri] = rd;
      });
      merges.forEach(function (m) {
        var r = parseRange(m); if (!r) return;
        sh.merges.push(rangeRef(r));
        var row = sh.rows[r.sri] || (sh.rows[r.sri] = {});
        row.cells = row.cells || {};
        var mc = row.cells[r.sci] || (row.cells[r.sci] = {});
        mc.merge = [r.eri - r.sri, r.eci - r.sci];
        if (r.eri > maxR) maxR = r.eri;
        if (r.eci > maxC) maxC = r.eci;
      });
      var defined = 0;
      try { defined = (ws.columns || []).length; } catch (e) { defined = 0; }
      var colCount = Math.min(16384, Math.max(ws.columnCount || 0, defined, maxC + 1));
      for (var ci = 0; ci < colCount; ci++) {
        var col = ws.getColumn(ci + 1), cd = {};
        if (col.width) { var px = charsToPx(col.width); if (px !== DEF_COL_W) cd.width = px; }
        if (col.hidden) cd.hide = true;
        if (Object.keys(cd).length) sh.cols[ci] = cd;
      }
      var view = (ws.views || [])[0];
      if (view && view.state === 'frozen' && (view.xSplit || view.ySplit)) sh.freeze = cellRef(view.ySplit || 0, view.xSplit || 0);
      sh.rows.len = Math.max(200, maxR + 51);
      sh.cols.len = Math.max(26, maxC + 6, colCount);
      out.push(sh);
    });
    if (!out.length) out.push(blankSheet('Sheet1'));
    return out;
  }
  function importXlsx(buffer, ExcelJS) {
    var wb = new ExcelJS.Workbook();
    return wb.xlsx.load(buffer).then(function () { return importWorkbook(wb, ExcelJS); });
  }

  root.SheetConvert = {
    colName: colName, colIndex: colIndex, parseRef: parseRef, parseRange: parseRange, cellRef: cellRef, rangeRef: rangeRef,
    blankSheet: blankSheet, cellAt: cellAt, eachCell: eachCell, usedRange: usedRange, isSheetEmpty: isSheetEmpty, isBookEmpty: isBookEmpty,
    colWidth: colWidth, rowHeight: rowHeight, mergeMap: mergeMap, styleOf: styleOf, DEF_COL_W: DEF_COL_W, DEF_ROW_H: DEF_ROW_H,
    createCalc: createCalc, parseFormula: parseFormula, fmtNum: fmtNum, applyFormat: applyFormat,
    parseCSV: parseCSV, parseTSV: parseTSV, toCSV: toCSV, sheetToCSV: sheetToCSV, sheetFromMatrix: sheetFromMatrix, decodeText: decodeText, detectDelimiter: detectDelimiter,
    toHex: toHex, xStyleToExcel: xStyleToExcel, excelStyleToX: excelStyleToX, isNumericText: isNumericText,
    pxToChars: pxToChars, charsToPx: charsToPx, pxToPt: pxToPt, ptToPx: ptToPx,
    buildWorkbook: buildWorkbook, exportXlsx: exportXlsx, importWorkbook: importWorkbook, importXlsx: importXlsx, safeSheetName: safeSheetName
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
