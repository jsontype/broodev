/* broodev.com — 사업자 정보 · 프리미엄 가격 (법적 페이지의 단일 소스)
   legal/tokushoho · terms · privacy · refund · ../premium.html 이 [data-biz="키"] · [data-price="utils.yearly"] 로 읽는다(legal.js).
   각 앱의 판매 페이지(예: apps/utils/js/biz.js 의 PLANS)와 가격을 반드시 같게 유지할 것.

   ★ Stripe 신청 전에 확인 ★
   - owner_name : 住民票(在留カード) 표기와 글자까지 일치(特商法은 屋号만으로는 불가)
   - invoice_no : 적격청구서 발행사업자 등록번호 'T' + 13자리. 자리표시자(T0000000000000)면 해당 행은 자동으로 숨겨진다
   - email      : Stripe 계정의 サポートメール 과 같은 주소 */
window.BIZ = {
  trade_name: 'Y Systems',                          // 屋号(상호) — Stripe 의 Business name 과 동일 표기(하이픈 없음)
  owner_name: 'Yang Donghwa（ヤン・ドンファ）',        // 販売業者・運営責任者 — 住民票 표기와 일치시킬 것
  owner_name_ko: '양동화 (Yang Donghwa)',
  owner_name_en: 'Donghwa Yang',
  location: '東京都',                               // 소재지(도도부현). 상세 주소·전화는 「請求があれば遅滞なく開示」
  location_ko: '일본 도쿄도',
  location_en: 'Tokyo, Japan',
  email: 'jsontyper@gmail.com',
  invoice_no: 'T0000000000000',                     // ★ 실제 번호로 교체
  site: 'https://broodev.com/',
  updated: '2026-10-03',
  updated_ja: '2026年10月3日',
};

/* 프리미엄을 파는 앱과 税込 가격 — 특상법 販売価格 행 · premium.html 표에 쓰인다. 앱이 늘면 항목 추가 */
window.PLANS = {
  utils: { name: 'Utils Premium', url: 'https://utils.broodev.com/pricing', yearly: 3980, lifetime: 9800 },
};
