# Stripe 개설 → broodev 프리미엄 판매 개시 절차

> 대상: 운영자 **Y Systems**(個人事業主 · 적격청구서 등록번호 보유)가 broodev.com 의 앱들에서 파는 「프리미엄」. 첫 상품은 `apps/utils`(utils.broodev.com) — **買い切り ¥5,000 / 年額 ¥2,500(税込)**, 카드 결제.
> **Stripe 계정은 하나, 사업 웹사이트는 `https://broodev.com/`(포털).** 심사가 보는 것은 전부 포털에 있다 — [`apps/home/premium.html`](../apps/home/premium.html)(전 앱 프리미엄 총람) · [`apps/home/legal/`](../apps/home/legal/)(特商法 · 약관 · 개인정보 · 환불, 사업자 정보 정본 `legal/biz.js`) · 푸터 법적 링크. 앱별 판매 페이지는 각 앱(utils 는 `pricing.html`). **다른 앱(btc 등)에 프리미엄을 붙일 때는 계정·심사를 다시 하지 않고 §7~§8 의 Product/Payment Link 만 추가한다.**
> 순서대로 하면 된다. **굵은 글씨 = 사람이 입력/결정해야 하는 것.** 링크는 2026-10 기준 Stripe 대시보드 경로(로그인 필요).

---

## 0. 시작 전에 손에 들고 있을 것

| 준비물 | 비고 |
|---|---|
| **본인확인 서류** | 在留カード · 運転免許証 · マイナンバーカード 중 하나(스마트폰 촬영 업로드). 이름 표기가 은행 명의와 같아야 한다 |
| **입금 은행 계좌** | 일본 국내 은행 · **口座名義 = 본인 이름**(屋号 계좌도 이름이 포함되면 OK). 통장/앱 화면 캡처 준비 |
| **적격청구서 등록번호** | `T` + 13자리. [국세청 공표 사이트](https://www.invoice-kohyo.nta.go.jp/)에서 본인 번호·공표 이름 확인 |
| **개인정보 방침** | **운영자 氏名·주소·전화는 사이트·레포에 싣지 않는다**(2026-10-03 결정). 사이트에는 屋号 `Y Systems` + 都道府県 + 메일만, 特商法 페이지의 氏名·주소·전화 행은 「個人事業主のため掲載を省略 — 請求があれば遅滞なく開示」. 본인 정보는 Stripe 대시보드(비공개)에만 입력. ⚠ 소비자청 Q&A 는 個人事業主 의 氏名 표기를 원칙으로 보고([통신판매 Q&A](https://www.no-trouble.caa.go.jp/what/mailorder/)), Stripe 심사에서 「氏名を記載してください」 가 올 수 있다 — 그때 다시 판단(개시 청구가 오면 메일로 지체 없이 알려 주는 운용은 반드시 지킬 것) |
| **연락용 메일** | 현재 `jsontyper@gmail.com`. 권장: Cloudflare **Email Routing**(무료)으로 `support@broodev.com` → Gmail 전달을 만들어 그 주소를 쓰면 심사·고객 신뢰 모두 좋다 → [Email Routing 문서](https://developers.cloudflare.com/email-service/) (만들면 `legal/biz.js` 의 `email` 과 연락 폼의 `To` 는 그대로 두고 Stripe 쪽만 바꿔도 되고, 전부 바꿔도 된다) |
| **전화번호** | Stripe 계정용(비공개). 사이트에는 싣지 않는다(「請求があれば遅滞なく開示」) |
| 사업 설명문 | 아래 §3 에 복붙용 문장 있음 |

---

## 1. 사이트 쪽 마무리 (심사관이 보는 것) — 커밋 전에 값 채우기

Stripe 는 **사이트를 열어 보고** 심사한다. 라이브에 올라가 있어야 하므로 신청 전에 아래를 끝내고 push 한다.

1. [`apps/home/legal/biz.js`](../apps/home/legal/biz.js) (**정본**) 채우기
   - **`invoice_no`** — 실제 `T0000000000000` → 본인 번호. (자리표시자인 동안은 特商法 페이지의 등록번호 행이 자동으로 숨겨진다)
   - **`location`** — `東京都` 그대로(都道府県까지만). 氏名·상세 주소·전화는 싣지 않고 「請求があれば遅滞なく開示」 로 처리됨(§0 개인정보 방침) — `owner_name` 키는 없다(2026-10-03 제거).
   - `trade_name` 은 `Y Systems`(하이픈 없음 — Stripe 의 Business name 과 동일).
   - 앱별 가격·판매 URL 은 `PLANS.utils = { name, url, yearly, lifetime }`. 앱이 늘면 여기 한 줄 + `premium.html` 카드 1장.
2. [`apps/utils/js/biz.js`](../apps/utils/js/biz.js) 의 `BIZ`(屋号·소재지·메일)와 `PLANS.yearly.price` / `PLANS.lifetime.price` 를 정본과 **같은 값**으로(Stripe 의 Price 와도 **반드시 같은 금액**).
3. 결정 사항(페이지에 이미 그렇게 적혀 있음 — 바꾸려면 법적 문서 4종 + premium.html + pricing.html × 3언어 문구를 같이 고친다)
   - **무료/프리미엄 경계 = 출력 형식**(2026-10-04 변경): 무료 = Excel(.xlsx) 전 기능·제한 없음 / 프리미엄 = PowerPoint(.pptx) 출력 + 준비 중인 Illustrator(.ai)·Photoshop(.psd) 출력(공개 시 추가 요금 없음). `PLANS.free_formats` · `PLANS.premium_formats`(utils biz.js). 예전 「20장 · A4·Letter · 3×3 · 1600px」 상한(`free_limits`)은 폐기 — 페이지·앱·문서 어디에도 남기지 않는다
   - 라이선스 1개 = 본인 기기 **3대**
   - 서비스 종료 시: 90일 전 고지 · 買い切り 는 구매 12개월 이내면 잔여 기간 환불
   - 갱신 후 14일 이내 · 미사용이면 갱신분 환불(운용)
4. 로컬 확인 → **커밋 · push** → 2~3분 뒤 https://broodev.com/premium · `/legal/tokushoho` · `/legal/terms` · `/legal/privacy` · `/legal/refund` 과 https://utils.broodev.com/pricing 이 열리고, 포털 푸터·utils 하단의 법적 링크가 모두 동작하는지 확인. (Cloudflare Pages 는 `/x.html` 을 `/x` 로 **308** 리다이렉트한다 — Stripe 에 적는 URL·canonical·sitemap 은 확장자 없는 쪽. 2026-10-03 push 후 6개 URL 전부 200 확인.)
5. (선택) [카카오 OG 캐시](https://developers.kakao.com/tool/clear/og) 는 OG 를 바꾼 게 아니라 불필요.

**심사관 체크리스트(Stripe 공식 "Website checklist")** → https://docs.stripe.com/get-started/checklist/website
사이트에 있어야 하는 것: 사업자명·연락처 · 상품/서비스 설명 · **税込 가격과 통화** · 환불/해지 정책 · 이용약관 · 개인정보 처리방침 · 안전한 결제 안내 · 배송/제공 시기(디지털 → 즉시) · 특정상거래법 표기 — **전부 broodev.com 에 있음**(premium.html + legal/ + 푸터).

---

## 2. 계정 생성

1. https://dashboard.stripe.com/register — 메일 · 이름 · **국가: 日本** · 비밀번호. (국가는 나중에 못 바꾼다)
2. 메일 인증 → 로그인 → 즉시 **2단계 인증** 켜기: https://dashboard.stripe.com/settings/user (認証アプリ 권장, SMS 백업).
3. 처음엔 **テスト環境(샌드박스)** 만 쓸 수 있다. 본番 결제는 §3~§6 의 "有効化" 후.

---

## 3. アカウントを有効化 (사업자 정보 = 심사 입력)

대시보드 좌측 「本番環境の利用を申請」/ 「アカウントを有効化」 → 폼. 또는 https://dashboard.stripe.com/account/onboarding
공식 안내: https://docs.stripe.com/get-started/account/set-up

| 항목 | 입력 |
|---|---|
| 事業の種類 | **個人事業主** |
| 事業の所在地 | 일본 · 주소(住民票 주소) |
| 業種 (MCC) | 「ソフトウェア」 계열 — **Software as a service (SaaS)** 또는 **デジタル商品 / ソフトウェア** |
| 事業のウェブサイト | **`https://broodev.com/`** (포털 — 프리미엄 총람 `/premium` 과 법적 문서 `/legal/…` 이 여기 있다. 앱이 늘어도 이 URL 은 그대로) |
| 商品・サービスの説明 | 아래 복붙 |
| 屋号(店舗名) / Business name | `Y Systems` (하이픈 없음) |
| 氏名 · 生年月日 · 住所 · 電話 | 본인확인 서류와 동일하게 |
| 購入者への商品提供時期 | **即時 / 購入後すぐ** (디지털) |
| 平均注文額 · 年間売上見込 | 솔직하게 소액으로(¥2,500 · 예상 연 매출) — 심사에 불리하지 않다 |

**商品・サービスの説明 (복붙용 · 日本語)**
```
broodev.com (https://broodev.com/) で、ブラウザ上で動作するウェブアプリ(業務ユーティリティ、暗号資産の市場指標、
学習ツールなど)を無料で公開しています。一部のアプリで、追加機能を使える「プレミアム」を、
年額サブスクリプション(税込・自動更新)と買い切り(税込)の 2 種類でオンライン販売します。
最初の対象は業務ユーティリティ「Utils」(https://utils.broodev.com/ — 写真を用紙 1 枚にグリッド配置する「写真ならべ」)で、
Excel 出力は無料のまま、PowerPoint(.pptx)出力(今後 Illustrator・Photoshop 出力も追加予定)をプレミアムとして
年額 2,500 円・買い切り 5,000 円(いずれも税込)で提供します。決済完了後すぐにライセンス情報をメールで送付し、物品の配送はありません。
料金一覧: https://broodev.com/premium / 特定商取引法に基づく表記: https://broodev.com/legal/tokushoho
```

**(English, 필요 시)**
```
broodev.com (https://broodev.com/) publishes free browser-based web apps (productivity utilities, crypto market
indicators, learning tools). Some apps offer "Premium" — lifted limits and extra features — sold online as a yearly
subscription (tax included, auto-renewing) or a one-time lifetime license (tax included). The first is Utils
(https://utils.broodev.com/ — "Photo Layout", photos arranged in a grid on Excel / PowerPoint pages): JPY 2,500 / year or JPY 5,000 one-time.
License details are emailed immediately after payment. No physical goods are shipped.
Pricing: https://broodev.com/premium / Legal notice: https://broodev.com/legal/tokushoho
```

---

## 4. 本人確認 · 顧客向け情報 · 銀行口座

같은 폼 안에서 이어진다.

1. **本人確認**: 서류 촬영 업로드(앞·뒤). 흐림/반사 없이. 필요하면 추가로 **住所確認書類**(公共料金 領収書 등) 요구될 수 있음.
2. **顧客向け情報 (公開情報)** — 나중에도 https://dashboard.stripe.com/settings/public 에서 수정
   - **明細書表記(ステートメント記述子)** — 일본 계정은 3종(漢字·カナ·ローマ字)을 다 넣는다(고객 카드 명세서에 찍힘 → 차지백 예방 핵심). 입력값(2026-10-03):
     - Store / Service name: 漢字(전각) `ブルーデブ ユーティルズ` · カナ(반각) `ﾌﾞﾙｰﾃﾞﾌﾞ ﾕｰﾃｨﾙｽﾞ` · ローマ字 `BROODEV UTILS`
     - Shortened descriptor: `ブルーデブ` · `ﾌﾞﾙｰﾃﾞﾌﾞ` · `BROODEV` (상품별 동적 표기의 접두어 — 다른 앱은 `BROODEV* <APP>`)
     규칙: https://docs.stripe.com/get-started/account/statement-descriptors
   - サポートメール: `jsontyper@gmail.com`(또는 `support@broodev.com`) · サポート電話: 입력하되 「明細書に表示しない」
   - サポートURL: `https://broodev.com/legal/tokushoho` · **利用規約 URL** `https://broodev.com/legal/terms` · **プライバシーポリシー URL** `https://broodev.com/legal/privacy` (→ §8 의 "약관 동의 체크박스"에 쓰임 — 전 앱 공통이라 앱이 늘어도 바꾸지 않는다)
3. **銀行口座** — https://dashboard.stripe.com/settings/payouts : 은행 · 지점 · 계좌번호 · **口座名義(カタカナ)**. 명의가 본인 이름과 다르면 심사가 멈춘다. 입금 주기는 기본 **주 1회**(나중에 월 1회로 바꿔도 됨).
4. **セキュリティ・チェックリストに基づく対策処置状況申告書** (일본 전용, 2024-04~ 신규 가맹점 필수): 폼 안에 체크 항목이 나온다. 우리 구성은 전부 "해당/대응": 카드 정보 비보유(Stripe Checkout 사용) · 사이트 HTTPS(Cloudflare) · 관리 계정 2FA · 소프트웨어 최신(정적 사이트) · 부정 로그인 대책(관리 화면 없음). 참고: [日本クレジット協会 セキュリティ対策](https://www.j-credit.or.jp/security/)
5. 제출 → **審査**. 보통 수 분~2영업일. 메일로 추가 요청이 오면(開業届 사본 · 確定申告書 · 사이트 캡처 · 사업 설명 보강) 48시간 안에 답하면 된다. 대시보드 상단 배너/「要対応」 에서 진행 상황 확인.

**한 번에 통과시키는 포인트**
- 서류 이름 = Stripe 氏名 = 은행 명의 (사이트에는 屋号만 — §0 개인정보 방침. 심사에서 氏名 게재를 요구받으면 그때 판단)
- 사이트 URL(`https://broodev.com/`)이 실제로 열리고(비밀번호 없음) 헤더 「Premium」 → 税込 가격, 푸터에 사업자명·메일·법적 페이지 링크 5개(완료)
- 사업 설명과 사이트 내용이 일치(SaaS/디지털 · 즉시 제공 · 배송 없음)
- 금지/제한 업종 아님 확인: https://stripe.com/jp/legal/restricted-businesses

---

## 5. 有効化 직후 기본 설정 (10분)

| 설정 | 위치 | 값 |
|---|---|---|
| 브랜드(로고·색) | https://dashboard.stripe.com/settings/branding | 아이콘 `apps/home/favicon-96x96.png`(broodev "b"), 색 `#000000`/`#FFFFFF` — Checkout·영수증·포털에 적용(전 앱 공통 브랜드 = broodev) |
| 顧客メール | https://dashboard.stripe.com/settings/emails | **決済成功時に領収書を送信 ON** · 返金時 ON · 失敗時 ON |
| **税務情報(T번호)** | https://dashboard.stripe.com/settings/billing/invoice → 「税 ID」 추가 → 種類 **`JP TRN`** → `T1234567890123` → デフォルト | 請求書·領収書에 등록번호 인쇄 → **적격청구서** 요건. 문서: https://docs.stripe.com/invoicing/taxes/account-tax-ids · ID 종류: https://docs.stripe.com/tax/invoicing/tax-ids |
| 請求書 템플릿 | 같은 화면 | 発行者 표기 `Y Systems`(屋号 — Stripe 계정의 Business name 이 그대로 찍힘), 메모에 「適格請求書発行事業者登録番号: T…」, 支払条件 |
| 支払い方法 | https://dashboard.stripe.com/settings/payment_methods | **カード ON**(Visa/MC/Amex/JCB/Diners/Discover) · Apple Pay/Google Pay(자동) · **コンビニ·銀行振込 OFF**(구독·즉시 제공과 안 맞음) |
| 3D セキュア | 자동 | 일본 3DS 의무화(2025-03) 는 Checkout 이 Radar 규칙으로 자동 처리. 확인: https://docs.stripe.com/payments/3d-secure |
| Radar | https://dashboard.stripe.com/settings/radar | 기본 규칙 그대로(소액 디지털이라 충분) |
| 입금 주기 | https://dashboard.stripe.com/settings/payouts | 週次 → 필요하면 月次 |

---

## 6. Stripe Tax (소비세) — 켜는 것을 권장

https://dashboard.stripe.com/settings/tax → 「税金の自動計算を有効化」
- **登録**: 日本 · 消費税 10% · 등록번호 T… (적격청구서 발행사업자이므로 과세사업자)
- **商品の税コード**: `Software as a service (SaaS) – personal use` 또는 `Digital goods` (Stripe Tax 코드 `txcd_10103001` 계열) — 상품 생성 시 지정(§7)
- **価格の税設定: 税込(内税, inclusive)** — 사이트가 税込 표시이므로 반드시 inclusive. 일본 고객 ¥2,500 = 본체 ¥2,273 + 세 ¥227 로 영수증에 분리 표기됨
- 해외 고객(한국·미국·EU…): 일본 消費税는 **国外取引 不課税**(전기통신이용역무의 국외 제공) → Stripe Tax 가 일본 세금을 빼고 계산. 각국 VAT 는 그 나라에 **등록하지 않는 한 징수하지 않음** — 소규모 동안은 등록 없이 두고, Stripe Tax 의 「しきい値モニタリング」 으로 임계치 접근만 지켜본다
- 비용: 거래당 0.5% 추가. 싫으면 Stripe Tax 를 끄고 Price 를 그냥 税込 금액으로 두어도 되지만, 그 경우 **영수증에 세액 분리 표기(적격청구서 요건)** 를 직접 챙겨야 한다 → 켜는 쪽 권장
- 문서: https://docs.stripe.com/tax · 일본 인보이스 제도와 Stripe: https://docs.stripe.com/tax/supported-countries/asia-pacific/collect-tax?tax-jurisdiction-asia-pacific=japan

---

## 7. 商品 · 価格 만들기

https://dashboard.stripe.com/products → 「商品を追加」 (**본番 환경**에서 만든다. 테스트 환경은 별개)

| | 商品 1 | 商品 2 |
|---|---|---|
| 名前 | `Utils Premium — 年額` | `Utils Premium — 買い切り` |
| 説明(영수증에 표시) | `写真ならべ — PowerPoint（.pptx）出力（Illustrator・Photoshop 出力は公開後に追加）、1 年間（自動更新）` | `写真ならべ — PowerPoint（.pptx）出力（Illustrator・Photoshop 出力は公開後に追加）、買い切り（永久ライセンス）` |
| 価格 | **¥2,500 · 継続(サブスクリプション) · 年ごと** | **¥5,000 · 一括(1 回限り)** |
| 税 | 税込(inclusive) · 税コード SaaS/Digital | 동일 |
| 画像 | `apps/utils/og-image.png` 또는 아이콘 | 동일 |
| 明細書表記(상품별) | 비워 두면 계정 기본 `BROODEV UTILS` | 동일 |

> 가격을 `legal/biz.js` · `utils/js/biz.js` 와 **같은 숫자**로. 1 Product 에 Price 2개로 묶어도 되지만, 영수증·구독 관리가 헷갈리지 않게 상품을 둘로 나누는 쪽을 권장.
> **다른 앱에 프리미엄을 추가할 때**: 같은 계정에서 상품을 `<앱> Premium — 年額 / 買い切り` 로 추가하고(明細書表記는 `BROODEV <APP>`), §8 Payment Link 2개 → 그 앱의 `biz.js` 에 붙이고 → `apps/home/legal/biz.js` `PLANS` + `premium.html` 카드. 계정·심사·약관 URL 은 그대로.

---

## 8. Payment Links (코딩 없이 판매 시작) → `biz.js` 에 붙이기

https://dashboard.stripe.com/payment-links → 「新規」 → 상품 선택. 플랜마다 하나씩 2개.
문서: https://docs.stripe.com/payment-links

링크 설정(두 링크 공통):
- **顧客情報の収集**: メール(필수, 기본) · **請求先住所: 必須**(Stripe Tax 국가 판정) · 電話 OFF
- **利用規約への同意を必須にする 체크** — §4 에서 넣은 利用規約 URL 이 Checkout 에 동의 체크박스로 뜬다 (문서: https://docs.stripe.com/payments/checkout/custom-components)
- **カスタムテキスト(送信ボタンの上)** — 特商法 2022 개정 "最終確認画面" 요건(분량·지불시기·제공시기·해지조건·자동갱신)을 Checkout 화면에 올리는 자리. 복붙:
  - 年額: `年額プランは 1 年ごとに自動更新され、更新日に ¥2,500（税込）が請求されます。解約はいつでも可能で、次回更新日以降は請求されません（日割り返金なし）。ライセンスは決済完了後すぐにメールでお送りします。返金・解約ポリシー: https://broodev.com/legal/refund`
  - 買い切り: `1 回限りのお支払いです（自動更新・追加請求なし）。ライセンスは決済完了後すぐにメールでお送りします。デジタルサービスのため決済後の返金は原則承っておりません。返金ポリシー: https://broodev.com/legal/refund`
- **決済後**: 「確認ページを表示」 + 메시지 `ご購入ありがとうございます。ライセンス情報を {メール} 宛にお送りしました。届かない場合は jsontyper@gmail.com までご連絡ください。` (라이선스 자동 발급 §10 을 만들면 「リダイレクト」 로 활성화 페이지로 보냄)
- 買い切り 링크만: **「決済後に請求書を作成」(invoice_creation) ON** → 一括 결제도 T번호 들어간 적격청구서 PDF 가 자동 발행
- 年額 링크만: 「お客様がプロモーションコードを使用できる」 는 필요 시 · 「無料トライアル」 는 쓰지 않음(환불 정책과 충돌)
- **税 ID の収集(tax_id_collection) ON** — 법인 고객이 자기 T번호를 넣을 수 있게(선택)

만든 뒤 **본番 링크** `https://buy.stripe.com/…` 2개를
```js
// apps/utils/js/biz.js
yearly:   { price: 2500, interval: 'year', checkout: 'https://buy.stripe.com/XXXX' },
lifetime: { price: 5000, checkout: 'https://buy.stripe.com/YYYY' },
```
에 넣으면 요금 페이지 버튼이 「準備中」 → 「購入する」 로 바뀐다(새 탭으로 Checkout). **테스트 링크(`buy.stripe.com/test_…`)를 넣지 않도록 주의.**

---

## 9. 구독 운영 설정 (해지·갱신 알림·실패 처리)

1. **カスタマーポータル** — https://dashboard.stripe.com/settings/billing/portal
   - 사용 ON · **サブスクリプションのキャンセル: 許可 · 「期間終了時にキャンセル」** (즉시 취소 X — 환불 정책과 일치) · 支払い方法の更新 ON · 請求書履歴 ON · プラン変更 OFF(年額 하나뿐)
   - 「リンクを有効化」 로 생기는 **로그인 링크** `https://billing.stripe.com/p/login/…` → `apps/utils/js/biz.js` 의 `PLANS.portal` 에 넣으면 요금 FAQ 에 「お客様ポータルを開く」 가 나타난다(포털 로그인은 계정당 하나 — 다른 앱도 같은 링크). 문서: https://docs.stripe.com/customer-management
2. **更新リマインダー** — https://dashboard.stripe.com/settings/billing/automatic → 「サブスクリプション」 영역 → **「更新前にメールを送信」 ON(7일 전)** — 年額 플랜은 특히 중요(약관·特商法 표기에 "更新日の前にメールでお知らせ" 라고 적어 둠)
3. 같은 화면: **支払い失敗時 — Smart Retries ON · 리트라이 전부 실패 시 「サブスクリプションをキャンセル」** · 失敗 메일 ON (고객이 카드 갱신하게)
4. 領収書 메일에 T번호: 設定 → 顧客メール 에 「税 ID を表示」 옵션이 있으면 ON. 없더라도 영수증 PDF 에 계정 税 ID 가 표시된다(§5). 확인은 §11 실결제 때.

---

## 10. 라이선스 자동 발급 (코딩 단계 — 심사와 무관, 판매 개시 전에)

지금 페이지에는 "決済完了後、ライセンス情報をメールで送付" 라고 적혀 있다. 초기에는 **수동**(Stripe 대시보드 결제 알림 → 손으로 메일)도 가능하지만, 자고 있을 때 결제가 오면 "直ちに" 약속을 못 지키므로 자동화 권장. 구성(모두 `apps/utils` 안, Pages 프로젝트 `broodev-utils` 설정):

| 구성 요소 | 내용 |
|---|---|
| `apps/utils/functions/api/stripe/webhook.js` | Stripe → Cloudflare Pages Functions. `checkout.session.completed`(발급) · `customer.subscription.updated/deleted`(만료) · `invoice.paid`(갱신) · `charge.refunded`(무효화). **서명 검증 필수**(`Stripe-Signature`, 문서 https://docs.stripe.com/webhooks) |
| `apps/utils/functions/api/license/verify.js` | 앱이 라이선스 키 + 기기 ID 로 호출 → KV 조회 → 유효/기기 수(3대) 응답 |
| KV 네임스페이스 `UTILS_LICENSES` | 키: 라이선스 키 → `{ email, plan, status, expires, devices[] }`. Pages 프로젝트 **Settings → Bindings → KV namespace** 에 Production/Preview 모두 바인딩 (https://developers.cloudflare.com/pages/functions/bindings/) |
| Secrets | Pages 프로젝트 **Settings → Variables and Secrets**: `STRIPE_SECRET_KEY`(본番 `sk_live_…`, Preview 에는 `sk_test_…`) · `STRIPE_WEBHOOK_SECRET`(`whsec_…`) · 메일 발송 API 키. **레포에 절대 넣지 않는다** |
| 메일 발송 | 서버에서 보내야 하므로 EmailJS(브라우저용) 대신 **Resend**(무료 월 3,000통, `broodev.com` 도메인 인증) 또는 Cloudflare Email Workers. 내용: 라이선스 키 + 활성화 방법 + 포털 링크 + 영수증은 Stripe 가 따로 보냄 |
| 앱 변경 `js/app.js` · `js/license.js` | 형식 게이팅은 **이미 있음**(2026-10-04: `MH_LICENSE.active()` 가 거짓이면 pptx 다운로드 잠금 → 요금 페이지; Excel 은 항상 무료). 남은 것: 「ライセンスキーを入力」 UI → `verify` 호출 → 유효하면 `MH_LICENSE.set(key, exp)`(`localStorage mh:license`) + 주기적 재검증 |
| Stripe 쪽 | https://dashboard.stripe.com/webhooks → 「エンドポイントを追加」 `https://utils.broodev.com/api/stripe/webhook` · 위 이벤트 선택 → 서명 시크릿을 Secrets 에 |

Cloudflare 에서 **DNS·도메인은 손댈 것 없음**(Functions 는 같은 도메인 `/api/*`). `functions/` 폴더가 생기면 Pages 가 자동 인식.

---

## 11. 테스트 → 실결제 1건 → 판매 개시

1. **テスト環境**(대시보드 우상단 토글)에서 §7~§8 과 같은 상품·링크를 만들고 테스트 카드로 흐름 확인 — `4242 4242 4242 4242`(성공) · `4000 0000 0000 3220`(3DS) · `4000 0000 0000 9995`(잔액 부족). 카드 목록: https://docs.stripe.com/testing
2. 본番 링크를 `biz.js` 에 넣고 → 로컬 확인 → 커밋 · push.
3. **본인 카드로 실결제 1건**(買い切り) → 확인: 명세서 표기 `BROODEV UTILS` · 영수증 메일에 税込/税額/T번호 · (§10 있으면) 라이선스 메일 도착 → 대시보드에서 **返金** → 환불 메일 확인. 수수료는 환불해도 돌아오지 않는다(¥5,000 × 3.6% = ¥180 — 1회 테스트 비용으로 감수).
4. 年額 도 같은 방식으로 1건 → 포털에서 「期間終了時にキャンセル」 가 되는지 확인 → 환불.
5. 개시: 포털(`apps/home`) 카탈로그의 utils 설명에 "프리미엄" 한 줄, `premium.html` 의 utils 카드는 이미 「料金・購入ページへ」 로 연결되어 있음. 필요하면 OG 갱신.

---

## 12. 운영 · 세무 메모

- **수수료**: 국내 카드 3.6% · 구독은 Billing +0.7% · Stripe Tax +0.5% · 차지백 ¥1,500. 입금은 수수료 차감 후 — 장부에는 매출 총액과 수수료(支払手数料)를 따로 적는다(Stripe 「残高 → レポート」 월별 CSV).
- **소비세**: 일본 고객 매출은 과세(10% 내세), 해외 고객은 不課税. 적격청구서 발행사업자이므로 신고 필요 — **2割特例는 2026년분까지**, 2027년분부터는 簡易課税(제5종 50%) 선택 신고를 2026-12-31 까지 검토. 국세청 인보이스 안내: https://www.nta.go.jp/taxes/shiraberu/zeimokubetsu/shohi/keigenzeiritsu/invoice.htm
- **屋号 공표**: 국세청 공표 사이트에 `Y Systems` 가 나오게 하려면 「適格請求書発行事業者の公表事項の公表(変更)申出書」 제출(선택).
- **차지백**: 메일 먼저 받도록 환불 페이지에 적어 둠. 분쟁이 오면 Stripe 대시보드에서 증빙(영수증 · 이용 로그 · 약관 동의 시각 — Checkout 동의 체크박스 기록) 제출.
- **보존**: 결제 기록 7년(개인정보 페이지에 그렇게 적음). Stripe 데이터 + 연 1회 CSV 백업.
- **페이지 갱신 규칙**: 가격·조건을 바꾸면 ① `apps/home/legal/biz.js` + 해당 앱 `biz.js` ② Stripe Price(새로 만들고 옛 Price 는 アーカイブ — 기존 구독자는 옛 가격 유지, 약관 5조) ③ 약관 15조대로 14일 전 공지.
- 영수증·포털·Checkout 의 언어는 고객 브라우저에 맞춰 Stripe 가 자동(日/韓/英 지원).

---

## 부록 A. 입력값 요약 (복사용)

| 항목 | 값 |
|---|---|
| 사이트(Website) | `https://broodev.com/` |
| 프리미엄 총람 | `https://broodev.com/premium` |
| 앱별 판매 페이지 | utils: `https://utils.broodev.com/pricing` |
| 特商法 | `https://broodev.com/legal/tokushoho` |
| 利用規約 / プライバシー / 返金 | `https://broodev.com/legal/terms` · `https://broodev.com/legal/privacy` · `https://broodev.com/legal/refund` |
| 屋号 / Business name | `Y Systems` |
| 明細書表記 / 短縮 | `BROODEV UTILS` / `BROODEV` |
| サポートメール | `jsontyper@gmail.com` (또는 `support@broodev.com`) |
| 상품 · 가격 | `Utils Premium — 年額` ¥2,500/年 税込 · `Utils Premium — 買い切り` ¥5,000 税込 |
| 税 ID 종류 | `JP TRN` (T + 13자리) |
| 웹훅 URL(§10) | `https://utils.broodev.com/api/stripe/webhook` |

## 부록 B. 레포에서 값이 사는 곳

| 무엇 | 어디 |
|---|---|
| 사업자 정보(屋号·소재지(都道府県)·메일·T번호·개정일 — 氏名·주소·전화는 두지 않음) — **정본** | `apps/home/legal/biz.js` → `BIZ` |
| 앱별 가격·판매 URL(프리미엄 총람·特商法 표기용) | `apps/home/legal/biz.js` → `PLANS.{utils,…}` |
| 법적 문서 본문(3언어) | `apps/home/legal/{tokushoho,terms,privacy,refund}.html` 의 `<article data-lang-block>` (전환 `legal/legal.js`, 스타일 `legal/legal.css`) |
| 프리미엄 총람 | `apps/home/premium.html` (앱 카드 · 공통 조건 · FAQ) |
| 포털 푸터 법적 링크 | `apps/home/index.html` `.footer-legal` · `404.html` |
| utils 가격 · Payment Link · 포털 링크 · 무료/프리미엄 출력 형식(`free_formats`·`premium_formats`) | `apps/utils/js/biz.js` → `PLANS` (BIZ 는 정본 사본) |
| utils 판매 페이지 본문(3언어) · 메뉴·푸터·title 번역 | `apps/utils/pricing.html` · `apps/utils/js/i18n.js` (`menu_pricing` · `foot_*` · `title_pricing` · `desc_pricing`) |
| Stripe 비밀키·웹훅 시크릿 | **레포 밖** — Cloudflare Pages 프로젝트(`broodev-utils` 등 앱별) → Settings → Variables and Secrets |
