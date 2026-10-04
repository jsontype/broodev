/* Utils — 사업자 정보 · 요금 (이 앱의 단일 소스)
   pricing.html 이 [data-biz="키"] · [data-price="플랜"] · [data-checkout] 로 이 값을 읽어 채운다(site.js).

   ★ 법적 문서(特商法 · 利用規約 · プライバシー · 返金)는 broodev.com 에 하나만 둔다 → apps/home/legal/*.html
     사업자 정보의 정본은 apps/home/legal/biz.js. 여기의 BIZ 는 그 사본(屋号·소재지·메일)이며, 두 파일의 값을 같게 유지할 것.
   ★ 운영자 개인정보(氏名·주소·전화)는 레포·사이트에 싣지 않는다 — 屋号 + 都道府県 + 메일만. 나머지는 「請求があれば遅滞なく開示」(2026-10-03)
   ★ 금액은 apps/home/legal/biz.js 의 PLANS.utils 와 Stripe 의 Price 와 세 곳이 반드시 같아야 한다(税込 総額). */
window.BIZ = {
  trade_name: 'Y Systems',                         // 屋号(상호) — Stripe 계정의 Business name 과 동일(하이픈 없음)
  location: '東京都',                              // 소재지(도도부현). 상세 주소·전화·氏名은 「請求があれば遅滞なく開示」 방식
  location_ko: '일본 도쿄도',
  location_en: 'Tokyo, Japan',
  email: 'support@broodev.com',                    // 문의·개시 요청·Stripe 서포트 메일
  invoice_no: 'T5810420183858',                    // 적격청구서 등록번호(T+13자리, 정본 apps/home/legal/biz.js 와 동일) — 표시는 broodev.com/legal/tokushoho.html 에서만
  site: 'https://broodev.com/',                    // 사업 웹사이트(Stripe 에 등록한 URL). 이 앱의 주소는 https://utils.broodev.com/
  legal: 'https://broodev.com/legal/',             // 법적 문서 루트
  product: 'Utils Premium',                        // 판매 상품명(Stripe Product 이름과 동일)
  updated: '2026-10-03',                           // 요금 페이지 "최종 개정일"
  updated_ja: '2026年10月3日',
};

/* 요금 — 세금 포함(総額表示). 통화 JPY(0 소수). Stripe 의 Price · apps/home/legal/biz.js 의 PLANS.utils 와 같은 금액으로

   ★ 무료/프리미엄의 경계는 「출력 형식」(2026-10-04 결정) — 장수·용지·격자·화질 제한은 없다
     - 무료      : Excel (.xlsx) — 항상 무료, 전 기능
     - 프리미엄  : PowerPoint (.pptx) 지금 · Illustrator (.ai) · Photoshop (.psd) 는 출시되는 대로(추가 요금 없음)
     app.js 는 premium_formats 에 든 형식의 페이지에서 라이선스(js/license.js)가 없으면 다운로드를 잠그고 요금 페이지로 보낸다 */
window.PLANS = {
  currency: 'JPY',
  yearly:   { price: 2500, interval: 'year', checkout: 'https://buy.stripe.com/14A6oJ3Ao8LybQi4sW4wM00' },  // 年額(자동 갱신) — Payment Link 2026-10-05
  lifetime: { price: 5000, checkout: 'https://buy.stripe.com/28E28tdaYe5S1bEaRk4wM01' },  // 買い切り(1회 결제 · 서비스 제공 기간 중 유효) — Payment Link 2026-10-05, 인보이스 PDF ON
  // checkout: Stripe Payment Link URL(https://buy.stripe.com/…) 을 넣으면 요금 페이지 버튼이 「購入する」로 활성화된다. 빈 문자열이면 「準備中」(비활성)
  free_formats: ['xlsx'],
  premium_formats: ['pptx', 'ai', 'psd'],
  portal: 'https://billing.stripe.com/p/login/14A6oJ3Ao8LybQi4sW4wM00',  // Stripe 고객 포털(구독 해지·카드 변경) — 2026-10-05 활성화(계정당 1개, 다른 앱도 같은 링크). 비어 있으면 메일 안내만
};
