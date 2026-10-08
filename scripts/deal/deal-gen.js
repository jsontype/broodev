// 요금 문구 생성기 — 월간·연간·買い切り 플랜의 13개 언어 문구를 단일 소스(deal-i18n.json)에서 각 타깃에 채운다 (멱등: 마커/앵커 기준으로 재생성)
//   node scripts/deal/deal-gen.js        → 바뀐 파일만 기록. 끝나면 node scripts/deal/deal-verify.js · btc 가 바뀌면 python scripts/gen_coin.py all
// 타깃: apps/utils/js/i18n.js (promo_* 키) · apps/utils/pricing.html + i18n/pricing.{lang}.html (월간 카드 생성 · 연간/買い切り 카드 이름·이득 문구) ·
//       apps/home/premium.html + legal/i18n/premium.{lang}.html (utils·btc·voca 카드의 가격 블록) · apps/home/legal/tokushoho.html + i18n (販売価格 행 · 販売 URL 행) ·
//       apps/btc/index.html (PREM_DEAL · PREM_LEGAL) · apps/voca/index.html (PLAN_LBL · PLAN_DEAL · PREM_LEGAL)
// 금액의 정본은 apps/home/legal/biz.js PLANS.utils (monthly · yearly · lifetime · lifetime_list). 각 앱 설정(utils biz.js · btc PREM_PLANS · voca PREMIUM.plans)과 같은 값이어야 한다(deal-verify 가 검사)
// 비교 가격(lifetime_list)이 null 이면(2026-10-07 결정: 가공 정가 금지) 할인 장치를 넣지 않는다. 월액 대비 이득(%)은 실제 플랜끼리의 비교라 항상 넣는다(2026-10-08).
const fs = require('fs');
const path = require('path');
const R = path.resolve(__dirname, '..', '..').replace(/\\/g, '/') + '/';
const LANGS = ['en', 'ja', 'ko', 'zh', 'zh-Hant', 'th', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'nl'];
const CORE = ['en', 'ja', 'ko'];

const D = JSON.parse(fs.readFileSync(path.join(__dirname, 'deal-i18n.json'), 'utf8'));
for (const sec of ['deal', 'vocaPlan', 'premiumCards', 'tokushohoPrices', 'legal']) for (const l of LANGS) if (!D[sec][l]) throw new Error('deal-i18n.json: ' + sec + '.' + l + ' missing');
const deal = (l) => D.deal[l];
const vplan = (l) => D.vocaPlan[l];
const cards = (l) => D.premiumCards[l];
const tkPrices = (l) => D.tokushohoPrices[l];
const legal = (l) => D.legal[l];

// ── 금액(정본: 포털 legal/biz.js)
const bizSrc = fs.readFileSync(R + 'apps/home/legal/biz.js', 'utf8');
const num = (k) => { const m = new RegExp('utils: \\{[^\\n]*?' + k + ': (\\d+|null)').exec(bizSrc); if (!m) throw new Error('legal/biz.js: utils.' + k + ' 를 못 찾음'); return m[1] === 'null' ? null : +m[1]; };
const MONTHLY = num('monthly'), YEARLY = num('yearly'), PRICE = num('lifetime'), LIST = num('lifetime_list');
const YEARS = 50;                                   // 買い切り 를 월액과 비교하는 기준 연수(문구에 명기)
const DEAL = LIST != null;                          // 비교 가격 표시 여부(현재 false)
const SAVE = DEAL ? LIST - PRICE : 0, OFF = DEAL ? Math.round((1 - PRICE / LIST) * 100) : 0;
const yen = (n) => '¥' + Number(n).toLocaleString('en-US');
const ratio = (Math.round(PRICE / YEARLY * 10) / 10).toString();
const V = { list: DEAL ? yen(LIST) : '', price: yen(PRICE), save: yen(SAVE), off: OFF, monthly: yen(MONTHLY), yearly: yen(YEARLY), lifetime: yen(PRICE),
  mYear: yen(MONTHLY * 12), mTotal: yen(MONTHLY * 12 * YEARS), years: YEARS, ratio,
  offY: Math.floor((1 - YEARLY / (MONTHLY * 12)) * 100), offL: Math.floor((1 - PRICE / (MONTHLY * 12 * YEARS)) * 100) };
const sub = (s, v) => String(s).replace(/\{(\w+)\}/g, (_, k) => v[k] != null ? v[k] : '');
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

// ── A. utils i18n.js — 각 언어 블록의 prem_cta: 줄 뒤에 promo_* 키 (기존 promo_* 줄은 제거 후 재삽입) — 할인 장치용(현재 숨김)
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

// ── B. utils pricing.html + i18n/pricing.{lang}.html — 월간 카드(연간 카드를 복제해 생성) · 카드 이름 · 이득 문구 · (DEAL 일 때만) 할인 요소
const cardRe = (marker) => new RegExp(`^([ \\t]*)<div class="pricing-box(?: featured)?">\\r?\\n(?:(?!^\\1</div>)[\\s\\S])*?${marker}(?:(?!^\\1</div>)[\\s\\S])*?^\\1</div>\\r?\\n`, 'm');
function patchPricingBlock(html, lang) {
  const d = deal(lang), eol = eolOf(html);
  // 0) 이전 생성물 제거: 월간 카드 · 할인 요소 · 이득 문구
  html = html.replace(cardRe('data-price="monthly"'), '');
  html = html.replace(/[ \t]*<div class="pg-deal" data-deal="lifetime"[^>]*>[\s\S]*?<\/div>\r?\n/g, '')
    .replace(/<s class="pg-was" data-price-list="lifetime"[^>]*>[^<]*<\/s>/g, '')
    .replace(/[ \t]*<p class="pg-save" data-promo="promo_save"[^>]*>[^<]*<\/p>\r?\n/g, '')
    .replace(/[ \t]*<p class="pg-value">[^<]*<\/p>\r?\n/g, '')
    .replace(/[ \t]*<p class="pg-fine" data-promo="promo_after"[^>]*>[^<]*<\/p>\r?\n/g, '');
  // 0.5) 무료 카드는 격자 밖의 가로 띠(.pg-free)로 — 유료 3장(월간·연간·買い切り)이 한 줄에 들어가게(860px 컨테이너에 250px 카드 4장은 안 들어가 추천 카드가 홀로 둘째 줄로 떨어졌다)
  if (!/<div class="pg-free">/.test(html)) {
    const fm = cardRe('<div class="price">¥0</div>').exec(html); if (!fm) throw new Error('pricing free card: ' + lang);
    html = html.replace(fm[0], '');
    const gridOpen = /^([ \t]*)<div class="pg-plans">\r?\n/m.exec(html); if (!gridOpen) throw new Error('pricing .pg-plans: ' + lang);
    html = html.replace(gridOpen[0], `${gridOpen[1]}<div class="pg-free">${eol}${fm[0]}${gridOpen[1]}</div>${eol}${gridOpen[0]}`);
  }
  // 1) 연간 카드: 이름 · per 줄(월액 대비 이득 + 자동 갱신)
  const ym = cardRe('data-price="yearly"').exec(html); if (!ym) throw new Error('pricing yearly card: ' + lang);
  let yearlyCard = ym[0];
  yearlyCard = yearlyCard.replace(/(<div class="plan-name">)[^<]*(<\/div>)/, `$1${esc(d.prem)} · ${esc(d.py)}$2`);
  yearlyCard = yearlyCard.replace(/(<p class="per">)[\s\S]*?(<\/p>)/, `$1<span class="pg-value">${esc(sub(d.valueY, V))}</span> · ${esc(d.perM)}$2`);
  html = html.replace(ym[0], yearlyCard);
  // 2) 월간 카드 = 연간 카드 복제(같은 기능 목록) + 이름·가격·단위·per·버튼 치환 → 연간 카드 앞에
  const unitRe = /(<div class="price"><span data-price=")yearly(">)[^<]*(<\/span><small>)[^<]*(<\/small><\/div>)/;
  let monthlyCard = yearlyCard
    .replace(/(<div class="plan-name">)[^<]*(<\/div>)/, `$1${esc(d.prem)} · ${esc(d.pm)}$2`)
    .replace(unitRe, `$1monthly$2${yen(MONTHLY)}$3${esc(d.unitM)}$4`)
    .replace(/(<p class="per">)[\s\S]*?(<\/p>)/, `$1${esc(d.perM)}$2`)
    .replace(/data-checkout="yearly"/, 'data-checkout="monthly"')
    .replace(/(<span class="when-live" hidden>)[^<]*(<\/span>)/, `$1${esc(d.buyM)}$2`);
  if (!/data-price="monthly"/.test(monthlyCard) || !/data-checkout="monthly"/.test(monthlyCard)) throw new Error('monthly card build: ' + lang);
  html = html.replace(yearlyCard, monthlyCard + yearlyCard);
  // 3) 연간 카드 금액 표시값 · 買い切り 카드 이름/금액/이득 문구
  html = html.replace(/(<span data-price="yearly">)[^<]*(<\/span>)/, `$1${yen(YEARLY)}$2`);
  const re = /(<div class="pricing-box featured">\r?\n)([ \t]*)(<div class="plan-name">)([^<]*)(<span class="pg-badge">[^<]*<\/span><\/div>\r?\n)([ \t]*<div class="price">)(<span data-price="lifetime">)[^<]*(<\/span>[^\n]*\r?\n)/;
  const m = re.exec(html);
  if (!m) throw new Error('pricing lifetime card anchor failed: ' + lang);
  const ind = /[ \t]*/.exec(m[6])[0] || m[2];
  const dealDiv = DEAL ? `${ind}<div class="pg-deal" data-deal="lifetime" hidden><span class="pg-deal-tag" data-promo="tag">-${OFF}%</span><span data-promo="promo_label">${esc(d.label)}</span><span class="pg-deal-limited" data-promo="promo_limited">${esc(d.limited)}</span></div>${eol}` : '';
  const was = DEAL ? `<s class="pg-was" data-price-list="lifetime" hidden>${yen(LIST)}</s>` : '';
  const save = DEAL ? `${ind}<p class="pg-save" data-promo="promo_save" hidden>${esc(sub(d.save, V))}</p>${eol}` : '';
  const value = `${ind}<p class="pg-value">${esc(sub(d.value, V))}</p>${eol}`;   // 항상: 월액 {years}년 대비 이득 · 연간 {ratio}년분
  html = html.replace(re, (all, open, _i, nameOpen, _name, badgeClose, priceOpen, priceSpan, priceRest) =>
    open + ind + nameOpen + `${esc(d.prem)} · ${esc(d.pl)} ` + badgeClose + dealDiv + priceOpen + was + priceSpan + yen(PRICE) + priceRest + save + value);
  const re2 = /(data-checkout="lifetime"[^\n]*\r?\n)([ \t]*)(<p class="pg-soon">[^\n]*<\/p>\r?\n)/;
  if (!re2.test(html)) throw new Error('pricing pg-soon anchor failed: ' + lang);
  if (DEAL) html = html.replace(re2, (all, a, ind2, soon) => a + ind2 + soon + `${ind2}<p class="pg-fine" data-promo="promo_after" hidden>${esc(sub(d.after, V))}</p>${eol}`);
  return html;
}
perLang(R + 'apps/utils/pricing.html', (l) => R + 'apps/utils/i18n/pricing.' + l + '.html', patchPricingBlock);

// ── C. premium.html + legal/i18n/premium.{lang}.html — 세 카드의 가격 블록(.prices) 전체를 생성 (<!-- @prices:app --> 마커)
function priceRows(lang, app) {
  const d = deal(lang), cm = cards(lang).common;
  const lifetimeRow = DEAL
    ? `<span class="deal-row"><span class="deal"><span class="deal-tag">-${OFF}%</span>${esc(d.label)} · ${esc(d.limited)}</span><br>${esc(d.pl)} <s class="was" title="${esc(d.was)}" data-price="${app}.lifetime_list">${yen(LIST)}</s> <b class="now" data-price="${app}.lifetime">${yen(PRICE)}</b>${fw(cm.lifetime_unit)}${esc(cm.lifetime_unit)}<br><small class="fine">${esc(sub(d.save, V))} · ${esc(sub(d.after, V))}</small><br><small class="value">${esc(sub(d.value, V))}</small></span>`
    : `<span class="deal-row"><span>${esc(d.pl)} <b class="now" data-price="${app}.lifetime">${yen(PRICE)}</b>${fw(cm.lifetime_unit)}${esc(cm.lifetime_unit)}</span><br><small class="value">${esc(sub(d.value, V))}</small></span>`;
  return [
    `<!-- @prices:${app} --><span>${esc(d.pm)} <b data-price="${app}.monthly">${yen(MONTHLY)}</b>${fw(cm.monthly_unit)}${esc(cm.monthly_unit)}</span>`,
    `<span>${esc(d.py)} <b data-price="${app}.yearly">${yen(YEARLY)}</b>${fw(cm.yearly_unit)}${esc(cm.yearly_unit)}<br><small class="value">${esc(sub(d.valueY, V))}</small></span>`,
    `${lifetimeRow}<!-- @/prices -->`,
  ];
}
function patchPremiumBlock(html, lang) {
  const eol = eolOf(html), c = cards(lang);
  // utils 카드: .prices 안을 통째로 재생성(구 마커 @deal:utils · 손으로 쓴 연간 줄 포함)
  const pr = /(<div class="prices">\r?\n)([ \t]*)([\s\S]*?)(\r?\n[ \t]*<\/div>)/;
  const m = pr.exec(html); if (!m) throw new Error('premium utils prices div: ' + lang);
  html = html.replace(m[0], m[1] + priceRows(lang, 'utils').map((r) => m[2] + r).join(eol) + m[4]);
  const card = (app) => {
    const x = c[app];
    return [
      `        <div class="plan-card">`,
      `            <span class="app">${esc(x.app)}</span>`,
      `            <h2 class="name" style="margin:0;font-size:22px">${esc(x.name)}</h2>`,
      `            <p style="margin:0">${esc(x.desc)}</p>`,
      `            <div class="prices">`,
      ...priceRows(lang, app).map((r) => `                ${r}`),
      `            </div>`,
      `            <a class="theme-btn" data-plan-url="${app}.url" href="${app === 'btc' ? 'https://btc.broodev.com/#premium' : 'https://voca.broodev.com/#premium'}">${esc(x.btn)} <img src="/assets/images/btn-arrow.svg" alt=""></a>`,
      `        </div>`,
    ].join(eol);
  };
  const gen = `<!-- @plan-cards -->${eol}${card('btc')}${eol}${card('voca')}${eol}        <!-- @/plan-cards -->`;
  if (!/<!-- @plan-cards -->[\s\S]*?<!-- @\/plan-cards -->/.test(html)) throw new Error('premium plan-cards marker: ' + lang);
  html = html.replace(/<!-- @plan-cards -->[\s\S]*?<!-- @\/plan-cards -->/, gen);
  return html;
}
perLang(R + 'apps/home/premium.html', (l) => R + 'apps/home/legal/i18n/premium.' + l + '.html', patchPremiumBlock);

// ── D. tokushoho — 販売価格 행의 본문(첫 문장 뒤)을 3 앱 공통 문장으로 · 販売 URL 행에 앱 내 구매 URL 2개
function patchTokushoho(html, lang) {
  const txt = esc(tkPrices(lang))
    .replace('{monthly}', `<span class="hl" data-price="utils.monthly">${yen(MONTHLY)}</span>`)
    .replace('{yearly}', `<span class="hl" data-price="utils.yearly">${yen(YEARLY)}</span>`)
    .replace('{lifetime}', `<span class="hl" data-price="utils.lifetime">${yen(PRICE)}</span>`);
  // 행 찾기: utils.lifetime 가격이 있는 <tr> 하나만 잘라서(다른 행을 삼키지 않게) <td> 의 첫 <br> 이후를 교체
  const rows = html.split(/(?=<tr>)/);
  const ri = rows.findIndex((r) => /data-price="utils\.lifetime"/.test(r));
  if (ri < 0) throw new Error('tokushoho price row: ' + lang);
  const m = /^(<tr><th>[^<]*<\/th><td>[^<]*(?:<b>[^<]*<\/b>[^<]*)?)<br>[\s\S]*?(<\/td><\/tr>[\s\S]*)$/.exec(rows[ri]);
  if (!m) throw new Error('tokushoho price row shape: ' + lang);
  rows[ri] = `${m[1]}<br><span data-tk-prices>${txt}</span>${m[2]}`;
  html = rows.join('');
  // 販売 URL 행
  html = html.replace(/<br><span class="deal-note" data-tk-urls>[\s\S]*?<\/span>(?=<\/td>)/, '');
  const re2 = /(<a data-plan-url="utils\.url"[^>]*>[^<]*<\/a>)(<\/td>)/;
  if (!re2.test(html)) throw new Error('tokushoho sales url row: ' + lang);
  const c = cards(lang);
  const link = (app) => `<a data-plan-url="${app}.url" href="https://${app}.broodev.com/#premium">https://${app}.broodev.com/#premium</a>`;
  html = html.replace(re2, (all, a, b) => a + `<br><span class="deal-note" data-tk-urls>${esc(c.btc.name)}: ${link('btc')} · ${esc(c.voca.name)}: ${link('voca')}</span>` + b);
  return html;
}
perLang(R + 'apps/home/legal/tokushoho.html', (l) => R + 'apps/home/legal/i18n/tokushoho.' + l + '.html', patchTokushoho);

// ── E. btc PREM_DEAL · voca PLAN_LBL/PLAN_DEAL · PREM_LEGAL — 마커 사이 재생성 (btc 가 바뀌면 python scripts/gen_coin.py all 로 코인 14종 재생성)
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
const DEAL_KEYS = ['label', 'limited', 'was', 'save', 'best', 'two', 'after', 'days', 'buy', 'peryear', 'once', 'tax', 'value', 'pm', 'py', 'pl', 'permonth', 'cancel', 'soon', 'valueY'];
patchMarkers(R + 'apps/btc/index.html', 'PREM_DEAL', DEAL_KEYS, deal, 'deal-i18n');
patchMarkers(R + 'apps/voca/index.html', 'PLAN_DEAL', DEAL_KEYS, deal, 'deal-i18n');
patchMarkers(R + 'apps/voca/index.html', 'PLAN_LBL', ['m', 'y', 'l', 'due', 'note'], vplan, 'plan-lbl');
patchMarkers(R + 'apps/btc/index.html', 'PREM_LEGAL', ['seller', 'tokushoho', 'refund', 'terms'], legal, 'prem-legal');
patchMarkers(R + 'apps/voca/index.html', 'PREM_LEGAL', ['seller', 'tokushoho', 'refund', 'terms'], legal, 'prem-legal');

console.log(report.join('\n'));
const changed = report.filter(r => r.startsWith('updated'));
console.log(changed.length + ' file(s) updated' + (changed.some(r => r.includes('apps/btc/')) ? ' — apps/btc 가 바뀜: python scripts/gen_coin.py all 을 실행할 것' : ''));
console.log(`prices: monthly ${MONTHLY} · yearly ${YEARLY} (${V.offY}% vs monthly) · lifetime ${PRICE} (${V.offL}% vs ${YEARS}y monthly · ${ratio}× yearly) · list ${LIST}`);
