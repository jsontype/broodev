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
  email: 'jsontyper@gmail.com',
  invoice_no: 'T5810420183858',                     // 適格請求書発行事業者 登録番号(2026-10-04 기입) — Stripe 의 Account tax ID(JP TRN)와 동일
  site: 'https://broodev.com/',
  updated: '2026-10-03',
  updated_ja: '2026年10月3日',
};

/* 프리미엄을 파는 앱과 税込 가격 — 특상법 販売価格 행 · premium.html 표에 쓰인다. 앱이 늘면 항목 추가 */
window.PLANS = {
  utils: { name: 'Utils Premium', url: 'https://utils.broodev.com/pricing', yearly: 2500, lifetime: 5000 },
};
