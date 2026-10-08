// 요금 문구 생성 결과 검증 — node scripts/deal/deal-verify.js (deal-gen.js 뒤, 또는 마커 블록을 손으로 고친 뒤)
//   utils i18n 키 13개 언어(t() 로 실제 치환) · btc/voca 객체 13개 언어·키 수·자리표시자 · HTML 마커/앵커 수(월간·연간·買い切り) · 네 곳의 금액 일치 ·
//   포털 카드의 플랜 이름 통일 · ja 에 「通常価格」 없음(景表法) · 전각 괄호 앞 공백 없음 · 카운트다운이 JST 로 계산되는지 · utils 정적 할인 요소가 비어 있는지 ·
//   이득(%) 문구가 계산값과 같은지 · 라이선스 서버 3벌이 월간 플랜을 알고 메일 금액이 정본과 같은지
const fs = require('fs');
const path = require('path');
const R = path.resolve(__dirname, '..', '..').replace(/\\/g, '/') + '/';
const LANGS = ['en', 'ja', 'ko', 'zh', 'zh-Hant', 'th', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'nl'];
const CORE = ['en', 'ja', 'ko'];
let bad = 0;
const fail = (m) => { bad++; console.log('FAIL', m); };
const read = (f) => fs.readFileSync(R + f, 'utf8');
// 금액의 정본(포털 legal/biz.js) — 네 곳이 같은지 비교
const lb = read('apps/home/legal/biz.js');
const num = (k) => { const m = new RegExp('utils: \\{[^\\n]*?' + k + ': (\\d+|null)').exec(lb); return m ? (m[1] === 'null' ? null : +m[1]) : undefined; };
const MONTHLY = num('monthly'), YEARLY = num('yearly'), PRICE = num('lifetime'), LIST = num('lifetime_list');
const DEAL = LIST != null;
const yen = (n) => '¥' + Number(n).toLocaleString('en-US');
const esc = (s) => s.replace(/[¥,.]/g, '\\$&');
const OFFY = Math.floor((1 - YEARLY / (MONTHLY * 12)) * 100), OFFL = Math.floor((1 - PRICE / (MONTHLY * 12 * 50)) * 100);
console.log(`prices(legal/biz.js): monthly ${MONTHLY} · yearly ${YEARLY} · lifetime ${PRICE} · list ${LIST} → offY ${OFFY}% · offL ${OFFL}%`);
if (!(MONTHLY > 0 && YEARLY > MONTHLY && PRICE > YEARLY)) fail('legal/biz.js 금액이 이상함');

// utils i18n.js: 브라우저 전역으로 로드해 t() 로 확인
{
  const w = { location: { search: '' }, navigator: { language: 'ko' } };
  global.localStorage = { getItem: () => null, setItem() {} };
  global.document = { documentElement: { setAttribute() {}, classList: { toggle() {}, add() {}, remove() {} } }, querySelector: () => null, querySelectorAll: () => [], getElementById: () => null, addEventListener() {}, dispatchEvent() {}, title: '', body: null };
  global.CustomEvent = class {};
  new Function('window', 'document', 'localStorage', read('apps/utils/js/i18n.js'))(w, global.document, global.localStorage);
  const I = w.MH_I18N;
  const keys = ['promo_label', 'promo_limited', 'promo_days', 'promo_was', 'promo_save', 'promo_best', 'promo_two', 'promo_after', 'promo_buy', 'lic_plan_monthly', 'lic_plan_yearly', 'lic_plan_lifetime', 'foot_dev'];
  for (const l of LANGS) {
    I.set ? I.set(l) : null;
    for (const k of keys) { const v = I.t(k, { list: '¥10,000', save: '¥5,000', d: 3, ratio: '2.5' }); if (!v || v === k) fail('i18n ' + l + ' ' + k + ' = ' + v); }
    if (l === 'ja' && /通常価格/.test(I.t('promo_was') + I.t('promo_after', { list: '' }))) fail('ja promo_was/after 에 「通常価格」 — 将来の販売価格 문구로(§13)');
  }
  console.log('utils i18n promo_*/lic_plan_*/foot_dev ok for', LANGS.length, 'langs');
}
// btc / voca 객체
const DEAL_KEYS = 20, LBL_KEYS = 5, LEGAL_KEYS = 4;
for (const [f, name, keys] of [['apps/btc/index.html', 'PREM_DEAL', DEAL_KEYS], ['apps/voca/index.html', 'PLAN_DEAL', DEAL_KEYS], ['apps/voca/index.html', 'PLAN_LBL', LBL_KEYS], ['apps/btc/index.html', 'PREM_LEGAL', LEGAL_KEYS], ['apps/voca/index.html', 'PREM_LEGAL', LEGAL_KEYS]]) {
  const s = read(f);
  const m = new RegExp('const ' + name + ' = \\{\\n([\\s\\S]*?)\\n\\s*\\}').exec(s);
  if (!m) { fail(name + ' not found in ' + f); continue; }
  const rows = m[1].split('\n').filter(l => /^\s+(?:'[\w-]+'|"[\w-]+"|\w+): \{/.test(l));
  if (rows.length !== 13) fail(name + ' langs ' + rows.length);
  for (const r of rows) { const n = (r.match(/\w+: "/g) || []).length; if (n !== keys) fail(name + ' keys ' + n + ' != ' + keys + ' in: ' + r.slice(0, 60)); }
  const obj = new Function(m[0] + '; return ' + name)();
  for (const l of LANGS) if (!obj[l]) fail(name + ' missing ' + l);
  if (name === 'PREM_DEAL' || name === 'PLAN_DEAL') {
    for (const l of LANGS) {
      const o = obj[l];
      if (!/\{save\}/.test(o.save) || !/\{list\}/.test(o.after) || !/\{d\}/.test(o.days)) fail(name + ' placeholders(deal) ' + l);
      if (!/\{offY\}/.test(o.valueY) || !/\{mYear\}/.test(o.valueY) || !/\{yearly\}/.test(o.valueY)) fail(name + ' valueY placeholders ' + l);
      if (!/\{offL\}/.test(o.value) || !/\{years\}/.test(o.value) || !/\{mTotal\}/.test(o.value) || !/\{lifetime\}/.test(o.value) || !/\{ratio\}/.test(o.value)) fail(name + ' value placeholders ' + l);
      if (!/\{ratio\}/.test(o.two)) fail(name + ' two placeholder ' + l);
      for (const k of ['pm', 'py', 'pl', 'permonth', 'cancel', 'soon']) if (!o[k]) fail(name + ' ' + k + ' empty ' + l);
    }
    if (/通常価格/.test(obj.ja.was + obj.ja.after)) fail(name + ' ja 에 「通常価格」');
  }
  console.log(f, name, 'ok (13 langs)');
}
// 카운트다운 종료 시각은 일본 시간 23:59 — 오프셋 없이 파싱하면 보는 사람의 시간대가 된다
for (const f of ['apps/utils/js/promo.js', 'apps/btc/index.html', 'apps/voca/index.html']) if (!/T23:59:59\+09:00/.test(read(f))) fail(f + ': until 파싱에 +09:00 없음');
// HTML: utils pricing 13 블록 · premium 13 블록 · tokushoho 13 블록
function checkFile(file, tests) {
  const s = read(file);
  for (const [name, re, n] of tests) { const c = (s.match(re) || []).length; if (c !== n) fail(`${file} ${name}: ${c} != ${n}`); }
  return s;
}
const textBefore = (s, marker) => { const i = s.indexOf(marker); if (i < 0) return null; const head = s.slice(0, i); return head.slice(head.lastIndexOf('>') + 1).trim(); };
for (const l of LANGS) {
  const core = CORE.includes(l);
  const n = core ? 3 : 1;
  const dn = DEAL ? n : 0;
  const pf = core ? 'apps/utils/pricing.html' : 'apps/utils/i18n/pricing.' + l + '.html';
  checkFile(pf, [
    ['monthly card', /data-price="monthly"/g, n], ['monthly checkout', /data-checkout="monthly"/g, n], ['yearly', /data-price="yearly"/g, n], ['lifetime', /data-price="lifetime"/g, n],
    ['deal', /data-deal="lifetime"/g, dn], ['was', /data-price-list="lifetime"/g, dn], ['save', /data-promo="promo_save"/g, dn], ['fine', /data-promo="promo_after"/g, dn], ['tag', /data-promo="tag"/g, dn + (core ? 1 : 0)],
    ['value lines', /class="pg-value"/g, n * 2], ['old per-month note', /data-price-monthly=/g, 0],
    ['monthly amount', new RegExp('data-price="monthly">' + esc(yen(MONTHLY)) + '<', 'g'), n], ['yearly amount', new RegExp('data-price="yearly">' + esc(yen(YEARLY)) + '<', 'g'), n], ['lifetime amount', new RegExp('data-price="lifetime">' + esc(yen(PRICE)) + '<', 'g'), n],
    ['offY in text', new RegExp(OFFY + '%', 'g'), n], ['offL in text', new RegExp(OFFL + '%', 'g'), n],
  ]);
  const prf = core ? 'apps/home/premium.html' : 'apps/home/legal/i18n/premium.' + l + '.html';
  const ps = checkFile(prf, [['prices markers', /@prices:(utils|btc|voca)/g, n * 3], ['monthly', /data-price="(utils|btc|voca)\.monthly"/g, n * 3], ['yearly', /data-price="(utils|btc|voca)\.yearly"/g, n * 3], ['lifetime', /data-price="(utils|btc|voca)\.lifetime"/g, n * 3],
    ['soon card gone', /plan-card soon/g, 0], ['list', /lifetime_list/g, DEAL ? n * 3 : 0], ['value', /<small class="value">/g, n * 6], ['-50% text', /-50%/g, DEAL ? n * 3 : 0], ['old per-month', /data-price-monthly=/g, 0], ['deep link', /href="https:\/\/(btc|voca)\.broodev\.com\/#premium"/g, n * 2], ['space before 全角 paren', / （/g, 0]]);
  // 같은 블록 안에서 세 카드의 플랜 이름이 같은지(언어 블록 단위로 비교)
  const blocks = ps.split(/(?=<article data-lang-block=)/).filter(b => /<article data-lang-block=/.test(b));
  for (const b of blocks) {
    for (const plan of ['monthly', 'yearly']) {
      const t = ['utils', 'btc', 'voca'].map(app => textBefore(b, `<b data-price="${app}.${plan}">`));
      if (t[0] !== t[1] || t[0] !== t[2]) fail(prf + ' ' + plan + ' term differs: ' + JSON.stringify(t));
    }
    const mk = (app) => DEAL ? '<s class="was" title' : '<b class="now" data-price="' + app + '.lifetime">';
    const lU = textBefore(b, mk('utils')), seg = b.split('<!-- @prices:btc -->')[1] || '', lB = textBefore(seg, mk('btc'));
    if (lU !== lB) fail(prf + ' lifetime term differs: utils「' + lU + '」 btc「' + lB + '」');
  }
  const tf = core ? 'apps/home/legal/tokushoho.html' : 'apps/home/legal/i18n/tokushoho.' + l + '.html';
  checkFile(tf, [['prices', /data-tk-prices/g, n], ['monthly', /data-price="utils\.monthly"/g, n], ['yearly', /data-price="utils\.yearly"/g, n], ['lifetime', /data-price="utils\.lifetime"/g, n], ['old append', /data-tk-append/g, 0], ['sales urls', /data-tk-urls/g, n], ['btc.url', /data-plan-url="btc\.url"/g, n], ['voca.url', /data-plan-url="voca\.url"/g, n]]);
}
// ja 의 사용자 노출 문구에 「通常価格」 가 남아 있지 않은지(utils pricing ja 블록 · premium ja 블록)
for (const [f, re] of [['apps/utils/pricing.html', /<article data-lang-block="ja"[\s\S]*?<\/article>/], ['apps/home/premium.html', /<article data-lang-block="ja"[\s\S]*?<\/article>/]]) {
  const m = re.exec(read(f)); if (!m) { fail(f + ' ja block'); continue; }
  if (/通常価格/.test(m[0])) fail(f + ' ja 블록에 「通常価格」');
}
// 들여쓰기 복구 확인(plan-name 줄이 열 0 에서 시작하지 않음)
for (const l of LANGS.filter(x => !CORE.includes(x))) { if (/\n<div class="plan-name">/.test(read('apps/utils/i18n/pricing.' + l + '.html'))) fail('indent lost ' + l); }
// 금액 일치: utils biz · legal biz(3 앱) · btc · voca — 월간/연간/買い切り/비교 가격
const ub = read('apps/utils/js/biz.js'), bt = read('apps/btc/index.html'), vo = read('apps/voca/index.html');
const lv = DEAL ? String(LIST) : 'null';
if (!new RegExp('monthly: +\\{ price: ' + MONTHLY + ',').test(ub) || !new RegExp('yearly: +\\{ price: ' + YEARLY + ',').test(ub) || !new RegExp('lifetime: \\{ price: ' + PRICE + ', list: ' + lv + ',').test(ub)) fail('utils biz.js 금액이 legal/biz.js 와 다름');
if ((lb.match(new RegExp('monthly: ' + MONTHLY + ', yearly: ' + YEARLY + ', lifetime: ' + PRICE + ', lifetime_list: ' + lv, 'g')) || []).length !== 3) fail('legal biz.js 3 앱의 금액이 같지 않음');
if (!new RegExp('monthly: +\\{ price: ' + MONTHLY + ', url:').test(bt) || !new RegExp('yearly: +\\{ price: ' + YEARLY + ', url:').test(bt) || !new RegExp('lifetime: \\{ price: ' + PRICE + ', list: ' + lv + ', url:').test(bt)) fail('btc PREM_PLANS 금액이 다름');
if (!new RegExp('monthly: \\{ price: ' + MONTHLY + ' \\}, yearly: \\{ price: ' + YEARLY + ' \\}, lifetime: \\{ price: ' + PRICE + ', list: ' + lv + ' \\}').test(vo)) fail('voca PREMIUM.plans 금액이 다름');
// 정적 내비 배지의 -50% 꼬리는 비어 있고 hidden · 모달 플랜 카드 3장(월간·연간·買い切り) + 가치 문구 + 법적 링크
for (const f of ['apps/btc/index.html', 'apps/voca/index.html', 'apps/eth/index.html']) {
  const s = read(f);
  if (!/data-prem-off hidden><\/span>/.test(s)) fail(f + ': 정적 내비 배지에 -50% 텍스트가 박혀 있음');
  if ((s.match(/<div className="prm-value">/g) || []).length < 2) fail(f + ': prm-value(연간·買い切り) 없음');
  if (!/'pm', v\)/.test(s) || !/'valueY', v\)/.test(s)) fail(f + ': 월간 카드/연간 이득 문구 렌더 없음');
  if (!/<PremLegal lang=\{lang\} \/>/.test(s)) fail(f + ': <PremLegal> 없음');
}
// utils 7 페이지의 정적 할인 요소(메뉴 배지 · pptx/ai/psd 잠금 안내)는 비어 있어야 한다 — promo.js 가 할인 중일 때만 글자를 채운다(크롤러 노출 방지)
for (const f of ['apps/utils/index.html', 'apps/utils/pptx.html', 'apps/utils/ai.html', 'apps/utils/psd.html', 'apps/utils/pricing.html', 'apps/utils/contact.html', 'apps/utils/404.html']) {
  const s = read(f);
  if (!/data-promo="tag" hidden><\/span>/.test(s)) fail(f + ': 메뉴 배지가 비어 있지 않음');
  const m = /<span class="pg-deal" data-deal hidden>([\s\S]*?)<\/span><\/span>/.exec(s);
  if (m && />[^<]+(?=<|$)/.test(m[1])) fail(f + ': 잠금 안내 pg-deal 에 정적 문자열이 남아 있음');
  if (/>-50%</.test(s.replace(/<script[\s\S]*?<\/script>/g, ''))) fail(f + ': HTML 에 -50% 텍스트');
}
// 라이선스 서버(3 벌): 월간 플랜 인식 · 메일 템플릿 금액이 정본과 같은지 · 앱별 상품명
const PRODUCT = { utils: 'Utils Premium', btc: 'Crypto Signals Premium', voca: 'VOCA DECK Premium' };
for (const app of ['utils', 'btc', 'voca']) {
  const wh = read('apps/' + app + '/functions/api/stripe/webhook.js'), ml = read('apps/' + app + '/functions/_lib/mail.js'), ad = read('apps/' + app + '/functions/api/license/admin.js');
  if (!/'monthly'/.test(wh) || !/(iv|interval) === 'month'/.test(wh) || !/plan === 'monthly' \? 31/.test(wh)) fail(app + ' webhook: 월간 플랜 판별/만료 없음');
  if (!new RegExp('monthly: ' + MONTHLY + ', yearly: ' + YEARLY + ', lifetime: ' + PRICE).test(ml)) fail(app + ' mail.js: PRICES 가 정본과 다름');
  if ((ml.match(/^\s+monthly: \(exp, portal\)/gm) || []).length !== 3 || (ml.match(/plan: \{ monthly:/g) || []).length !== 3) fail(app + ' mail.js: 월간 템플릿(3 언어) 없음');
  if (!new RegExp("const PRODUCT = '" + PRODUCT[app] + "'").test(ml)) fail(app + ' mail.js: PRODUCT 가 앱 상품명이 아님');
  if (app !== 'utils' && /Utils Premium|\/pptx|\/pricing/.test(ml)) fail(app + ' mail.js: Utils 문구가 남아 있음');
  if (!/'monthly'/.test(ad)) fail(app + ' admin.js: issue 에 monthly 없음');
}
// 포털 legal.js: lifetime_list 가 null 이면 deal-row 를 숨기는 코드 + CSS
if (!/deal-off/.test(read('apps/home/legal/legal.js')) || !/deal-off/.test(read('apps/home/legal/legal.css'))) fail('legal.js/css 에 deal-off 처리 없음');
console.log(bad ? bad + ' PROBLEM(S)' : 'ALL CHECKS PASSED');
process.exit(bad ? 1 : 0);
