// 할인 표시 생성 결과 검증 — node scripts/deal/deal-verify.js (deal-gen.js 뒤, 또는 마커 블록을 손으로 고친 뒤)
//   utils i18n promo 키 13개 언어(t() 로 실제 치환) · btc/voca 객체 13개 언어·키 수·자리표시자 · HTML 마커/앵커 수 · 금액 일치 ·
//   포털 카드의 플랜 이름이 utils 카드와 같은지 · ja 에 「通常価格」 없음(景表法) · 전각 괄호 앞 공백 없음 · 카운트다운이 JST 로 계산되는지
const fs = require('fs');
const path = require('path');
const R = path.resolve(__dirname, '..', '..').replace(/\\/g, '/') + '/';
const LANGS = ['en', 'ja', 'ko', 'zh', 'zh-Hant', 'th', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'nl'];
const CORE = ['en', 'ja', 'ko'];
const DEAL = (() => { const m = /lifetime_list: (\d+|null)/.exec(fs.readFileSync(path.resolve(__dirname, '..', '..', 'apps/home/legal/biz.js'), 'utf8')); return !!(m && m[1] !== 'null'); })();   // 비교 가격 표시 중인가(현재 false)
let bad = 0;
const fail = (m) => { bad++; console.log('FAIL', m); };
const read = (f) => fs.readFileSync(R + f, 'utf8');

// utils i18n.js: 브라우저 전역으로 로드해 t() 로 확인
{
  const w = { location: { search: '' }, navigator: { language: 'ko' } };
  global.localStorage = { getItem: () => null, setItem() {} };
  global.document = { documentElement: { setAttribute() {}, classList: { toggle() {}, add() {}, remove() {} } }, querySelector: () => null, querySelectorAll: () => [], getElementById: () => null, addEventListener() {}, dispatchEvent() {}, title: '', body: null };
  global.CustomEvent = class {};
  new Function('window', 'document', 'localStorage', read('apps/utils/js/i18n.js'))(w, global.document, global.localStorage);
  const I = w.MH_I18N;
  const keys = ['promo_label', 'promo_limited', 'promo_days', 'promo_was', 'promo_save', 'promo_best', 'promo_two', 'promo_after', 'promo_buy'];
  for (const l of LANGS) {
    I.set ? I.set(l) : null;
    for (const k of keys) { const v = I.t(k, { list: '¥10,000', save: '¥5,000', d: 3 }); if (!v || v === k) fail('i18n ' + l + ' ' + k + ' = ' + v); }
    const after = I.t('promo_after', { list: '¥10,000' }); if (!/¥10,000/.test(after)) fail('promo_after placeholder ' + l + ': ' + after);
    const save = I.t('promo_save', { save: '¥5,000' }); if (!/¥5,000/.test(save)) fail('promo_save placeholder ' + l + ': ' + save);
    const days = I.t('promo_days', { d: 3 }); if (!/3/.test(days)) fail('promo_days placeholder ' + l + ': ' + days);
    if (l === 'ja' && /通常価格/.test(I.t('promo_was') + I.t('promo_after', { list: '' }))) fail('ja promo_was/after 에 「通常価格」 — 将来の販売価格 문구로(§13)');
  }
  console.log('utils i18n promo_* ok for', LANGS.length, 'langs');
}
// btc / voca 객체
for (const [f, name, keys] of [['apps/btc/index.html', 'PREM_DEAL', 13], ['apps/voca/index.html', 'PLAN_DEAL', 13], ['apps/voca/index.html', 'PLAN_LBL', 4], ['apps/btc/index.html', 'PREM_LEGAL', 4], ['apps/voca/index.html', 'PREM_LEGAL', 4]]) {
  const s = read(f);
  const m = new RegExp('const ' + name + ' = \\{\\n([\\s\\S]*?)\\n\\s*\\}').exec(s);
  if (!m) { fail(name + ' not found in ' + f); continue; }
  const rows = m[1].split('\n').filter(l => /^\s+(?:'[\w-]+'|"[\w-]+"|\w+): \{/.test(l));
  if (rows.length !== 13) fail(name + ' langs ' + rows.length);
  for (const r of rows) { const n = (r.match(/\w+: "/g) || []).length; if (n !== keys) fail(name + ' keys ' + n + ' in: ' + r.slice(0, 60)); }
  const obj = new Function(m[0] + '; return ' + name)();
  for (const l of LANGS) if (!obj[l]) fail(name + ' missing ' + l);
  if (name !== 'PLAN_LBL' && name !== 'PREM_LEGAL') {
    for (const l of LANGS) { if (!/\{save\}/.test(obj[l].save) || !/\{list\}/.test(obj[l].after) || !/\{d\}/.test(obj[l].days) || !obj[l].value) fail(name + ' placeholders/value ' + l); }
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
  const pf = core ? 'apps/utils/pricing.html' : 'apps/utils/i18n/pricing.' + l + '.html';
  const dn = DEAL ? n : 0;
  checkFile(pf, [['deal', /data-deal="lifetime"/g, dn], ['was', /data-price-list="lifetime"/g, dn], ['save', /data-promo="promo_save"/g, dn], ['fine', /data-promo="promo_after"/g, dn], ['tag', /data-promo="tag"/g, dn + (core ? 1 : 0)], ['value', /<p class="pg-value">/g, n]]);
  const prf = core ? 'apps/home/premium.html' : 'apps/home/legal/i18n/premium.' + l + '.html';
  const ps = checkFile(prf, [['utils deal', /@deal:utils/g, n], ['btc', /data-price="btc\.lifetime"/g, n], ['voca', /data-price="voca\.lifetime"/g, n], ['soon card gone', /plan-card soon/g, 0], ['list', /lifetime_list/g, DEAL ? n * 3 : 0], ['value', /<small class="value">/g, n * 3], ['-50% text', /-50%/g, DEAL ? n * 3 : 0], ['deep link', /href="https:\/\/(btc|voca)\.broodev\.com\/#premium"/g, n * 2], ['space before 全角 paren', / （/g, 0]]);
  // 같은 블록 안에서 utils 카드와 btc/voca 카드의 플랜 이름이 같은지(언어 블록 단위로 비교)
  const blocks = ps.split(/(?=<article data-lang-block=)/).filter(b => /<article data-lang-block=/.test(b));
  for (const b of blocks) {
    const yU = textBefore(b, '<b data-price="utils.yearly">'), yB = textBefore(b, '<b data-price="btc.yearly">'), yV = textBefore(b, '<b data-price="voca.yearly">');
    const mk = (app) => DEAL ? '<s class="was" title' : '<b class="now" data-price="' + app + '.lifetime">';
    const lU = textBefore(b, mk('utils')), seg = b.split('<!-- @deal:btc -->')[1] || '', lB = textBefore(seg, mk('btc'));
    if (yU !== yB || yU !== yV) fail(prf + ' yearly term differs: utils「' + yU + '」 btc「' + yB + '」 voca「' + yV + '」');
    if (lU !== lB) fail(prf + ' lifetime term differs: utils「' + lU + '」 btc「' + lB + '」');
  }
  const tf = core ? 'apps/home/legal/tokushoho.html' : 'apps/home/legal/i18n/tokushoho.' + l + '.html';
  checkFile(tf, [['append', /data-tk-append/g, n], ['btc.yearly', /data-price="btc\.yearly"/g, n], ['sales urls', /data-tk-urls/g, n], ['btc.url', /data-plan-url="btc\.url"/g, n], ['voca.url', /data-plan-url="voca\.url"/g, n]]);
}
// ja 의 사용자 노출 문구에 「通常価格」 가 남아 있지 않은지(utils pricing ja 블록 · premium ja 블록)
for (const [f, re] of [['apps/utils/pricing.html', /<article data-lang-block="ja"[\s\S]*?<\/article>/], ['apps/home/premium.html', /<article data-lang-block="ja"[\s\S]*?<\/article>/]]) {
  const m = re.exec(read(f)); if (!m) { fail(f + ' ja block'); continue; }
  if (/通常価格/.test(m[0])) fail(f + ' ja 블록에 「通常価格」');
}
// 들여쓰기 복구 확인(plan-name 줄이 열 0 에서 시작하지 않음)
for (const l of LANGS.filter(x => !CORE.includes(x))) { if (/\n<div class="plan-name">/.test(read('apps/utils/i18n/pricing.' + l + '.html'))) fail('indent lost ' + l); }
// 금액 일치: utils biz · legal biz · btc · voca
const ub = read('apps/utils/js/biz.js'), lb = read('apps/home/legal/biz.js'), bt = read('apps/btc/index.html'), vo = read('apps/voca/index.html');
const lv = DEAL ? '10000' : 'null';   // 네 곳의 비교 가격이 같은 상태(숫자/ null)인지
if (!new RegExp('lifetime: \\{ price: 5000, list: ' + lv + ',').test(ub)) fail('utils biz lifetime(list ' + lv + ')');
if ((lb.match(new RegExp('lifetime: 5000, lifetime_list: ' + lv, 'g')) || []).length !== 3) fail('legal biz 3 plans(lifetime_list ' + lv + ')');
if (!new RegExp('lifetime: \\{ price: 5000, list: ' + lv + ', url:').test(bt)) fail('btc PREM_PLANS(list ' + lv + ')');
if (!new RegExp('lifetime: \\{ price: 5000, list: ' + lv + ' \\}').test(vo)) fail('voca PREMIUM.plans(list ' + lv + ')');
// 정적 내비 배지의 -50% 꼬리는 비어 있고 hidden(JS 가 할인 중일 때만 채움) · 모달 플랜 카드에 가치 문구
for (const f of ['apps/btc/index.html', 'apps/voca/index.html', 'apps/eth/index.html']) {
  if (!/data-prem-off hidden><\/span>/.test(read(f))) fail(f + ': 정적 내비 배지에 -50% 텍스트가 박혀 있음');
  if (!/<div className="prm-value">/.test(read(f))) fail(f + ': prm-value 없음');
}
// 프리미엄 모달의 법적 링크 컴포넌트가 모달에 들어가 있는지(btc · voca · 코인 1종)
for (const f of ['apps/btc/index.html', 'apps/voca/index.html', 'apps/eth/index.html']) if (!/<PremLegal lang=\{lang\} \/>/.test(read(f))) fail(f + ': <PremLegal> 없음');
// utils 7 페이지의 정적 할인 요소(메뉴 배지 · pptx/ai/psd 잠금 안내)는 비어 있어야 한다 — promo.js 가 할인 중일 때만 글자를 채운다(크롤러 노출 방지)
for (const f of ['apps/utils/index.html', 'apps/utils/pptx.html', 'apps/utils/ai.html', 'apps/utils/psd.html', 'apps/utils/pricing.html', 'apps/utils/contact.html', 'apps/utils/404.html']) {
  const s = read(f);
  if (!/data-promo="tag" hidden><\/span>/.test(s)) fail(f + ': 메뉴 배지가 비어 있지 않음');
  const m = /<span class="pg-deal" data-deal hidden>([\s\S]*?)<\/span><\/span>/.exec(s);
  if (m && />[^<]+</.test(m[1])) fail(f + ': 잠금 안내 pg-deal 에 정적 문자열이 남아 있음');
  if (/>-50%</.test(s.replace(/<script[\s\S]*?<\/script>/g, ''))) fail(f + ': HTML 에 -50% 텍스트');
}
// 포털 legal.js: lifetime_list 가 null 이면 deal-row 를 숨기는 코드 + CSS
if (!/deal-off/.test(read('apps/home/legal/legal.js')) || !/deal-off/.test(read('apps/home/legal/legal.css'))) fail('legal.js/css 에 deal-off 처리 없음');
console.log(bad ? bad + ' PROBLEM(S)' : 'ALL CHECKS PASSED');
process.exit(bad ? 1 : 0);
