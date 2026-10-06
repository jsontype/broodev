// 평생(買い切り) 플랜 할인 표시 — 13개 언어 문구를 단일 소스(deal-i18n.json)에서 각 타깃에 채운다 (멱등: 마커/앵커 기준으로 재생성)
//   node scripts/deal/deal-gen.js        → 바뀐 파일만 기록. 끝나면 node scripts/deal/deal-verify.js · btc 가 바뀌면 python scripts/gen_coin.py all
// 타깃: apps/utils/js/i18n.js (promo_* 키) · apps/utils/pricing.html + i18n/pricing.{lang}.html (평생 카드) ·
//       apps/home/premium.html + legal/i18n/premium.{lang}.html (utils 카드 할인 행 + btc/voca 카드) ·
//       apps/home/legal/tokushoho.html + i18n (販売価格 행 덧붙임 · 販売 URL 행의 앱 내 구매 URL) ·
//       apps/btc/index.html (PREM_DEAL · PREM_LEGAL) · apps/voca/index.html (PLAN_LBL · PLAN_DEAL · PREM_LEGAL)
// 금액(정가 10000 · 판매가 5000)은 각 앱 설정(utils biz.js · btc PREM_PLANS · voca PREMIUM.plans · 포털 legal/biz.js)이 정본이고, 여기서는 정적 문구에 찍는 값만 맞춘다
const fs = require('fs');
const path = require('path');
const R = path.resolve(__dirname, '..', '..').replace(/\\/g, '/') + '/';
const LANGS = ['en', 'ja', 'ko', 'zh', 'zh-Hant', 'th', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'nl'];
const CORE = ['en', 'ja', 'ko'];

const D = JSON.parse(fs.readFileSync(path.join(__dirname, 'deal-i18n.json'), 'utf8'));
for (const sec of ['deal', 'vocaPlan', 'premiumCards', 'tokushohoAppend', 'legal']) for (const l of LANGS) if (!D[sec][l]) throw new Error('deal-i18n.json: ' + sec + '.' + l + ' missing');
const deal = (l) => D.deal[l];
const vplan = (l) => D.vocaPlan[l];
const cards = (l) => D.premiumCards[l];
const tkAppend = (l) => D.tokushohoAppend[l];
const legal = (l) => D.legal[l];

const yen = (n) => '¥' + Number(n).toLocaleString('en-US');
const LIST = 10000, PRICE = 5000, YEARLY = 2500, SAVE = LIST - PRICE, OFF = Math.round((1 - PRICE / LIST) * 100);
const sub = (s, v) => String(s).replace(/\{(\w+)\}/g, (_, k) => v[k] != null ? v[k] : '');
const V = { list: yen(LIST), price: yen(PRICE), save: yen(SAVE), off: OFF };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const jsStr = (s) => JSON.stringify(String(s));
const eolOf = (s) => (s.includes('\r\n') ? '\r\n' : '\n');
const fw = (s) => (/^[（）]/.test(s) ? '' : ' ');   // 전각 괄호 앞에는 공백을 두지 않는다(ja·zh·zh-Hant)
const report = [];
function write(file, next, prev) { if (next !== prev) { fs.writeFileSync(file, next); report.push('updated ' + file.replace(R, '')); } else report.push('unchanged ' + file.replace(R, '')); }
function perLang(file, fragOf, patch) {
  const src = fs.readFileSync(file, 'utf8');
  let html = src;
  for (const lang of CORE) {
    const re = new RegExp(`(<article data-lang-block="${lang}"[\\s\\S]*?<\\/article>)`);
    const m = re.exec(html); if (!m) throw new Error(file.replace(R, '') + ' block ' + lang);
    html = html.replace(m[1], patch(m[1], lang));
  }
  write(file, html, src);
  for (const lang of LANGS.filter(l => !CORE.includes(l))) {
    const f = fragOf(lang);
    const s = fs.readFileSync(f, 'utf8');
    write(f, patch(s, lang), s);
  }
}

// ── A. utils i18n.js — 각 언어 블록의 prem_cta: 줄 뒤에 promo_* 키 (기존 promo_* 줄은 제거 후 재삽입)
{
  const file = R + 'apps/utils/js/i18n.js';
  const src = fs.readFileSync(file, 'utf8'), eol = eolOf(src);
  const lines = src.split(eol).filter(l => !/^\s{6}promo_\w+: /.test(l) && !/^\s{6}\/\/ 평생 플랜 할인 표시\(js\/promo\.js/.test(l));
  let cur = null, n = 0;
  const out = [];
  for (const line of lines) {
    const m = /^    (?:'([\w-]+)'|(\w+)): \{$/.exec(line);
    if (m) cur = m[1] || m[2];
    out.push(line);
    if (/^\s{6}prem_cta: /.test(line) && cur && LANGS.includes(cur)) {
      const d = deal(cur), q = (s) => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
      out.push('      // 평생 플랜 할인 표시(js/promo.js — {list} 정가 · {price} 판매가 · {save} 차액 · {off} 할인율 · {d} 남은 일수) — scripts/deal/deal-gen.js 가 채움');
      for (const [k, key] of [['label', 'promo_label'], ['limited', 'promo_limited'], ['days', 'promo_days'], ['was', 'promo_was'], ['save', 'promo_save'], ['best', 'promo_best'], ['two', 'promo_two'], ['after', 'promo_after'], ['buy', 'promo_buy']]) out.push('      ' + key + ': ' + q(d[k]) + ',');
      n++;
    }
  }
  if (n !== 13) throw new Error('i18n.js: prem_cta anchors ' + n + ' != 13');
  write(file, out.join(eol), src);
}

// ── B. utils pricing.html + i18n/pricing.{lang}.html — 평생 카드에 할인 블록
function patchPricingBlock(html, lang) {
  const d = deal(lang);
  html = html.replace(/[ \t]*<div class="pg-deal" data-deal="lifetime"[^>]*>[\s\S]*?<\/div>\r?\n/g, '')
    .replace(/<s class="pg-was" data-price-list="lifetime"[^>]*>[^<]*<\/s>/g, '')
    .replace(/[ \t]*<p class="pg-save" data-promo="promo_save"[^>]*>[^<]*<\/p>\r?\n/g, '')
    .replace(/[ \t]*<p class="pg-fine" data-promo="promo_after"[^>]*>[^<]*<\/p>\r?\n/g, '');
  const eol = eolOf(html);
  const re = /(<div class="pricing-box featured">\r?\n)([ \t]*)(<div class="plan-name">[^\n]*<\/div>\r?\n)([ \t]*<div class="price">)(<span data-price="lifetime">[^<]*<\/span>[^\n]*\r?\n)/;
  const m = re.exec(html);
  if (!m) throw new Error('pricing block anchor failed: ' + lang);
  const ind = /[ \t]*/.exec(m[4])[0] || m[2];
  const dealDiv = `${ind}<div class="pg-deal" data-deal="lifetime" hidden><span class="pg-deal-tag" data-promo="tag">-${OFF}%</span><span data-promo="promo_label">${esc(d.label)}</span><span class="pg-deal-limited" data-promo="promo_limited">${esc(d.limited)}</span></div>${eol}`;
  const was = `<s class="pg-was" data-price-list="lifetime" hidden>${yen(LIST)}</s>`;
  const save = `${ind}<p class="pg-save" data-promo="promo_save" hidden>${esc(sub(d.save, V))}</p>${eol}`;
  html = html.replace(re, (all, open, _i, name, priceOpen, priceRest) => open + ind + name + dealDiv + priceOpen + was + priceRest + save);
  const re2 = /(data-checkout="lifetime"[^\n]*\r?\n)([ \t]*)(<p class="pg-soon">[^\n]*<\/p>\r?\n)/;
  if (!re2.test(html)) throw new Error('pricing pg-soon anchor failed: ' + lang);
  html = html.replace(re2, (all, a, ind2, soon) => a + ind2 + soon + `${ind2}<p class="pg-fine" data-promo="promo_after" hidden>${esc(sub(d.after, V))}</p>${eol}`);
  return html;
}
perLang(R + 'apps/utils/pricing.html', (l) => R + 'apps/utils/i18n/pricing.' + l + '.html', patchPricingBlock);

// ── C. premium.html + legal/i18n/premium.{lang}.html — utils 카드 할인 행 + btc/voca 카드
//    legal.js 가 lifetime_list 가 null 이면 .deal-row 에 deal-off 를 붙여 태그·취소선·小字를 숨긴다(할인 종료 시 biz.js 만 고치면 됨)
function dealRow(lang, app, prefixText, suffixText) {
  const d = deal(lang);
  return `<!-- @deal:${app} --><span class="deal-row"><span class="deal"><span class="deal-tag">-${OFF}%</span>${esc(d.label)} · ${esc(d.limited)}</span><br>${prefixText}<s class="was" title="${esc(d.was)}" data-price="${app}.lifetime_list">${yen(LIST)}</s> <b class="now" data-price="${app}.lifetime">${yen(PRICE)}</b>${suffixText}<br><small class="fine">${esc(sub(d.save, V))} · ${esc(sub(d.after, V))}</small></span><!-- @/deal -->`;
}
function patchPremiumBlock(html, lang) {
  const eol = eolOf(html), c = cards(lang);
  html = html.replace(/<!-- @deal:utils -->[\s\S]*?<!-- @\/deal -->/, (blk) => {
    const m = /<br>([\s\S]*?)<s class="was"[^>]*>[^<]*<\/s> <b class="now" data-price="utils\.lifetime">[^<]*<\/b>([\s\S]*?)<br>/.exec(blk);
    return `<span>${m[1]}<b data-price="utils.lifetime">${yen(PRICE)}</b>${m[2]}</span>`;
  });
  const re = /<span>([^<]*)<b data-price="utils\.lifetime">[^<]*<\/b>([^<]*)<\/span>/;
  const m = re.exec(html); if (!m) throw new Error('premium utils lifetime line: ' + lang);
  html = html.replace(re, dealRow(lang, 'utils', m[1], m[2]));
  const card = (app) => {
    const x = c[app], cm = c.common;
    return [
      `        <div class="plan-card">`,
      `            <span class="app">${esc(x.app)}</span>`,
      `            <h2 class="name" style="margin:0;font-size:22px">${esc(x.name)}</h2>`,
      `            <p style="margin:0">${esc(x.desc)}</p>`,
      `            <div class="prices">`,
      `                <span>${esc(x.yearly)} <b data-price="${app}.yearly">${yen(YEARLY)}</b>${fw(cm.yearly_unit)}${esc(cm.yearly_unit)}</span>`,
      `                ${dealRow(lang, app, esc(x.lifetime) + ' ', fw(cm.lifetime_unit) + esc(cm.lifetime_unit))}`,
      `            </div>`,
      `            <a class="theme-btn" data-plan-url="${app}.url" href="${app === 'btc' ? 'https://btc.broodev.com/#premium' : 'https://voca.broodev.com/#premium'}">${esc(x.btn)} <img src="/assets/images/btn-arrow.svg" alt=""></a>`,
      `        </div>`,
    ].join(eol);
  };
  const gen = `<!-- @plan-cards -->${eol}${card('btc')}${eol}${card('voca')}${eol}        <!-- @/plan-cards -->`;
  if (/<!-- @plan-cards -->[\s\S]*?<!-- @\/plan-cards -->/.test(html)) html = html.replace(/<!-- @plan-cards -->[\s\S]*?<!-- @\/plan-cards -->/, gen);
  else {
    const soon = /[ \t]*<div class="plan-card soon">[\s\S]*?<\/div>\r?\n[ \t]*<\/div>/;
    if (!soon.test(html)) throw new Error('premium soon card: ' + lang);
    html = html.replace(soon, '        ' + gen);
  }
  return html;
}
perLang(R + 'apps/home/premium.html', (l) => R + 'apps/home/legal/i18n/premium.' + l + '.html', patchPremiumBlock);

// ── D. tokushoho — 販売価格 행 끝에 btc/voca 동액 문장(실제 금액만 · 비교 가격 없음) + 販売 URL 행에 앱 내 구매 URL 2개
function patchTokushoho(html, lang) {
  html = html.replace(/<br><span class="deal-note" data-tk-append>[\s\S]*?<\/span>(?=<\/td>)/, '');
  const re = /(<span class="hl" data-price="utils\.lifetime">[^<]*<\/span>[^<]*)(<\/td>)/;
  if (!re.test(html)) throw new Error('tokushoho price row: ' + lang);
  const txt = esc(tkAppend(lang)).replace('{yearly}', `<span class="hl" data-price="btc.yearly">${yen(YEARLY)}</span>`).replace('{lifetime}', `<span class="hl" data-price="btc.lifetime">${yen(PRICE)}</span>`);
  html = html.replace(re, (all, a, b) => a + `<br><span class="deal-note" data-tk-append>${txt}</span>` + b);
  // 販売 URL 행: utils 판매 페이지 링크 뒤에 코인·VOCA 의 앱 내 구매 URL(#premium → 앱이 프리미엄 모달을 연다)
  html = html.replace(/<br><span class="deal-note" data-tk-urls>[\s\S]*?<\/span>(?=<\/td>)/, '');
  const re2 = /(<a data-plan-url="utils\.url"[^>]*>[^<]*<\/a>)(<\/td>)/;
  if (!re2.test(html)) throw new Error('tokushoho sales url row: ' + lang);
  const c = cards(lang);
  const link = (app) => `<a data-plan-url="${app}.url" href="https://${app}.broodev.com/#premium">https://${app}.broodev.com/#premium</a>`;
  html = html.replace(re2, (all, a, b) => a + `<br><span class="deal-note" data-tk-urls>${esc(c.btc.name)}: ${link('btc')} · ${esc(c.voca.name)}: ${link('voca')}</span>` + b);
  return html;
}
perLang(R + 'apps/home/legal/tokushoho.html', (l) => R + 'apps/home/legal/i18n/tokushoho.' + l + '.html', patchTokushoho);

// ── E. btc PREM_DEAL · voca PLAN_LBL/PLAN_DEAL — 마커 사이 재생성 (btc 가 바뀌면 python scripts/gen_coin.py all 로 코인 14종 재생성)
function objLines(name, obj, keys, indent) {
  const rows = LANGS.map(l => `${indent}  ${/^[a-z]+$/.test(l) ? l : jsStr(l)}: { ${keys.map(k => `${k}: ${jsStr(obj(l)[k])}`).join(', ')} },`);
  return `${indent}const ${name} = {\n${rows.join('\n')}\n${indent}}`;
}
function patchMarkers(file, name, keys, obj, marker) {
  const src = fs.readFileSync(file, 'utf8'), eol = eolOf(src);
  const re = new RegExp(`(/\\* @${marker}[^\\n]*\\n)([\\s\\S]*?)(\\n[ \\t]*/\\* @/${marker} \\*/)`);
  const m = re.exec(src); if (!m) throw new Error(name + ' marker: ' + file);
  const indent = /^[ \t]*/.exec(m[2])[0];
  const body = objLines(name, obj, keys, indent).split('\n').join(eol);
  write(file, src.replace(re, (a, open, _b, close) => open + body + close), src);
}
const DEAL_KEYS = ['label', 'limited', 'was', 'save', 'best', 'two', 'after', 'days', 'buy', 'peryear', 'once', 'tax'];
patchMarkers(R + 'apps/btc/index.html', 'PREM_DEAL', DEAL_KEYS, deal, 'deal-i18n');
patchMarkers(R + 'apps/voca/index.html', 'PLAN_DEAL', DEAL_KEYS, deal, 'deal-i18n');
patchMarkers(R + 'apps/voca/index.html', 'PLAN_LBL', ['y', 'l', 'due', 'note'], vplan, 'plan-lbl');
// 프리미엄 모달 하단의 판매자·법적 링크(特商法: 販売 URL 로 지정된 화면이므로)
patchMarkers(R + 'apps/btc/index.html', 'PREM_LEGAL', ['seller', 'tokushoho', 'refund', 'terms'], legal, 'prem-legal');
patchMarkers(R + 'apps/voca/index.html', 'PREM_LEGAL', ['seller', 'tokushoho', 'refund', 'terms'], legal, 'prem-legal');

console.log(report.join('\n'));
const changed = report.filter(r => r.startsWith('updated'));
console.log(changed.length + ' file(s) updated' + (changed.some(r => r.includes('apps/btc/')) ? ' — apps/btc 가 바뀜: python scripts/gen_coin.py all 을 실행할 것' : ''));
