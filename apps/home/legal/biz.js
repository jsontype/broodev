/* broodev.com — 사업자 정보 · 프리미엄 가격 (법적 페이지의 단일 소스)
   legal/tokushoho · terms · privacy · refund · ../premium.html 이 [data-biz="키"] · [data-price="utils.yearly"] 로 읽는다(legal.js).
   각 앱의 판매 페이지(예: apps/utils/js/biz.js 의 PLANS)와 가격을 반드시 같게 유지할 것.

   ★ 운영자 개인정보(氏名·주소·전화)는 레포·사이트 어디에도 싣지 않는다(2026-10-03 결정) ★
   - 사이트에 보이는 사업자 표기는 屋号 'Y Systems' + 都道府県 + 메일뿐. 氏名·상세 주소·전화는 特商法 페이지에
     「個人事業主のため掲載を省略 — 請求があれば遅滞なく開示」 로 처리(법적 문서·요금 페이지의 「(個人事業主)」 표기도 여기 값이 아니라 HTML 고정 문구)
   - Stripe 계정 쪽(본인확인·은행 명의·請求書 発行者)은 Stripe 대시보드에만 입력 — docs/stripe-setup.md
   - invoice_no : 적격청구서 발행사업자 등록번호 'T' + 13자리. 자리표시자(T0000000000000)면 해당 행은 자동으로 숨겨진다
   - email      : Stripe 계정의 サポートメール 과 같은 주소 */
window.BIZ = {
  trade_name: 'Y Systems',                          // 屋号(상호) — Stripe 의 Business name 과 동일 표기(하이픈 없음)
  location: '東京都',                               // 소재지(도도부현). 상세 주소·전화·氏名은 「請求があれば遅滞なく開示」
  location_ko: '일본 도쿄도',
  location_en: 'Tokyo, Japan',
  email: 'support@broodev.com',
  invoice_no: 'T5810420183858',                     // 適格請求書発行事業者 登録番号(2026-10-04 기입) — Stripe 의 Account tax ID(JP TRN)와 동일
  site: 'https://broodev.com/',
  updated: '2026-10-07',
  updated_ja: '2026年10月7日',
};

/* 프리미엄을 파는 앱과 税込 가격 — 특상법 販売価格 행 · premium.html 표에 쓰인다. 앱이 늘면 항목 추가
   ★ 2026-10-08 개정: 월간 ¥100(신설) · 연간 ¥800 · 買い切り ¥2,000 — 세 앱 공통. 여기가 금액의 정본이고 scripts/deal/deal-gen.js 가 13언어 문구(월액 대비 이득 %)를 여기서 읽어 생성한다.
   각 앱 설정(utils js/biz.js · btc PREM_PLANS · voca PREMIUM.plans)과 Stripe Price 도 같은 값으로(deal-verify.js 가 앞의 셋을 비교)
   ★ 2026-10-08 개정: 월간 ¥100(신설) · 연간 ¥800 · 買い切り ¥2,000 — 세 앱 공통. 여기가 금액의 정본이고 scripts/deal/deal-gen.js 가 13언어 문구(월액 대비 이득 %)를 여기서 읽어 생성한다.
   각 앱 설정(utils js/biz.js · btc PREM_PLANS · voca PREMIUM.plans)과 Stripe Price 도 같은 값으로(deal-verify.js 가 앞의 셋을 비교)
   ★ 2026-10-08 개정: 월간 ¥100(신설) · 연간 ¥800 · 買い切り ¥2,000 — 세 앱 공통. 여기가 금액의 정본이고 scripts/deal/deal-gen.js 가 13언어 문구(월액 대비 이득 %)를 여기서 읽어 생성한다.
   각 앱 설정(utils js/biz.js · btc PREM_PLANS · voca PREMIUM.plans)과 Stripe Price 도 같은 값으로(deal-verify.js 가 앞의 셋을 비교)
   ★ 2026-10-08 개정: 월간 ¥100(신설) · 연간 ¥800 · 買い切り ¥2,000 — 세 앱 공통. 여기가 금액의 정본이고 scripts/deal/deal-gen.js 가 13언어 문구(월액 대비 이득 %)를 여기서 읽어 생성한다.
   각 앱 설정(utils js/biz.js · btc PREM_PLANS · voca PREMIUM.plans)과 Stripe Price 도 같은 값으로(deal-verify.js 가 앞의 셋을 비교)
   ★ 2026-10-08 개정: 월간 ¥100(신설) · 연간 ¥800 · 買い切り ¥2,000 — 세 앱 공통. 여기가 금액의 정본이고 scripts/deal/deal-gen.js 가 13언어 문구(월액 대비 이득 %)를 여기서 읽어 생성한다.
   각 앱 설정(utils js/biz.js · btc PREM_PLANS · voca PREMIUM.plans)과 Stripe Price 도 같은 값으로(deal-verify.js 가 앞의 셋을 비교)
   ★ 2026-10-08 개정: 월간 ¥100(신설) · 연간 ¥800 · 買い切り ¥2,000 — 세 앱 공통. 여기가 금액의 정본이고 scripts/deal/deal-gen.js 가 13언어 문구(월액 대비 이득 %)를 여기서 읽어 생성한다.
   각 앱 설정(utils js/biz.js · btc PREM_PLANS · voca PREMIUM.plans)과 Stripe Price 도 같은 값으로(deal-verify.js 가 앞의 셋을 비교)
   lifetime_list: 평생(買い切り) 플랜의 비교 가격(정가). ★ 2026-10-07 결정으로 null — 영구 ¥2,000(2026-10-08 개정) 이라 「정가 ¥10,000」 은 판 적도 받을 계획도 없는 가공 가격(景品表示法 有利誤認).
   null 이면 생성 스크립트(scripts/deal/deal-gen.js)가 총람 카드에 할인 장치 없이 가치 문구(「年額 2 年分で、ずっと」)만 넣고, legal.js 도 할인 요소를 만들지 않는다.
   숫자를 넣으면(실제로 그 가격에 판 기간이 있을 때만) 세 앱(utils js/biz.js PLANS.lifetime.list · btc PREM_PLANS · voca PREMIUM.plans)과 같은 값으로 맞추고 deal-gen.js 를 다시 돌린다 — docs/stripe-setup.md §13 */
window.PLANS = {
  utils: { name: 'Utils Premium',          url: 'https://utils.broodev.com/pricing', monthly: 100, yearly: 800, lifetime: 2000, lifetime_list: null },
  btc:   { name: 'Crypto Signals Premium', url: 'https://btc.broodev.com/#premium',  monthly: 100, yearly: 800, lifetime: 2000, lifetime_list: null },  // 코인 사이트 15개 공통 라이선스 — #premium 이면 앱이 PREMIUM 모달을 바로 연다
  voca:  { name: 'VOCA DECK Premium',      url: 'https://voca.broodev.com/#premium', monthly: 100, yearly: 800, lifetime: 2000, lifetime_list: null },  // #premium → 앱의 프리미엄 모달
};
