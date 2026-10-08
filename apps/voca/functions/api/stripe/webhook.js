/* POST /api/stripe/webhook — Stripe → 라이선스 발급·갱신·무효화 (Cloudflare Pages Functions)
   Stripe 대시보드 → Developers → Webhooks → 엔드포인트 https://voca.broodev.com/api/stripe/webhook 에 아래 이벤트를 선택:
     checkout.session.completed · checkout.session.async_payment_succeeded   → 발급(키 생성 + 메일)
     invoice.paid                                                           → 年額 갱신(만료 연장)
     customer.subscription.updated · customer.subscription.deleted          → 해지 예약·종료 반영
     charge.refunded · charge.dispute.created                               → 무효화
   필요 변수(Pages → Settings → Variables and Secrets):
     STRIPE_WEBHOOK_SECRET (Secret · whsec_…)      서명 검증 — 없으면 500 (열어 두지 않는다)
     STRIPE_SECRET_KEY     (Secret · 제한 키 권장)  구독 기간·상품 조회(없으면 금액·mode 로 플랜 추정 · 만료 = 지금+1개월/1년)
     RESEND_API_KEY        (Secret)                 메일 (없으면 발급만 하고 mail_error 기록 → 관리자 재송)
     PRODUCT_MAP           (선택 · JSON)            {"prod_…":"yearly","prod_…":"lifetime"} — 상품명으로 못 가릴 때
   멱등: evt:<event.id> (7일) + sess:<session.id>. 처리 중 예외 → 500 → Stripe 가 재시도(최대 3일). 한 Stripe 계정을 여러 앱이
   쓰더라도 Utils 상품이 아닌 세션은 무시한다(상품명에 Utils 가 없고 PRODUCT_MAP 에도 없으면). */

import { json, err, nowIso } from '../../_lib/http.js';
import { verifyStripeSignature, stripeGet, subscriptionPeriodEnd, invoiceSubscriptionId, invoicePeriodEnd, idOf } from '../../_lib/stripe.js';
import { Store, GRACE_SEC, secToIso } from '../../_lib/store.js';
import { newKey } from '../../_lib/keys.js';
import { pickLang, sendLicenseMail } from '../../_lib/mail.js';

export async function onRequest(ctx) {
  if (ctx.request.method !== 'POST') return err('method-not-allowed', 405);
  return webhook(ctx);
}

export async function webhook({ request, env }) {
  if (!env.VOCA_LICENSES) return err('kv-not-bound', 500);
  if (!env.STRIPE_WEBHOOK_SECRET) return err('webhook-secret-missing', 500);

  const raw = await request.text();
  const okSig = await verifyStripeSignature(raw, request.headers.get('stripe-signature'), env.STRIPE_WEBHOOK_SECRET);
  if (!okSig) return err('bad-signature', 400);

  let event;
  try { event = JSON.parse(raw); } catch (e) { return err('bad-json', 400); }
  if (!event || !event.id || !event.type) return err('bad-event', 400);

  const store = new Store(env.VOCA_LICENSES);
  if (await store.seenEvent(event.id)) return json({ ok: true, duplicate: true });

  const obj = (event.data && event.data.object) || {};
  let result;
  try {
    result = await handle(event.type, obj, { store, env, livemode: !!event.livemode });
  } catch (e) {
    return err('handler-failed', 500, { detail: String((e && e.message) || e) });
  }
  await store.markEvent(event.id);
  return json({ ok: true, type: event.type, ...result });
}

export async function handle(type, obj, ctx) {
  switch (type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded': return onCheckout(obj, ctx);
    case 'invoice.paid': return onInvoicePaid(obj, ctx);
    case 'customer.subscription.updated': return onSubscriptionUpdated(obj, ctx);
    case 'customer.subscription.deleted': return onSubscriptionDeleted(obj, ctx);
    case 'charge.refunded': return onRefund(obj, ctx);
    case 'charge.dispute.created': return onDispute(obj, ctx);
    default: return { ignored: true };
  }
}

/* ── 발급 ── */
async function onCheckout(session, { store, env, livemode }) {
  if (session.payment_status !== 'paid') return { skipped: 'unpaid' };          // 지연 결제 수단 → async_payment_succeeded 에서
  if (await store.keyBySession(session.id)) return { skipped: 'already-issued' };

  const plan = await resolvePlan(session, env);
  if (!plan) return { skipped: 'not-utils-product' };

  const cd = session.customer_details || {};
  const email = (cd.email || session.customer_email || '').trim();
  const name = cd.name || '';
  const lang = pickLang(session.locale, cd.address && cd.address.country);
  const subId = idOf(session.subscription);

  let expires = null;
  if (plan === 'yearly' || plan === 'monthly') {
    let end = null;
    if (subId) {
      end = subscriptionPeriodEnd(await stripeGet(env, 'subscriptions/' + subId));
      if (!end) end = await store.takeSubPeriod(subId);
    }
    if (!end) end = Math.floor(Date.now() / 1000) + (plan === 'monthly' ? 31 : 365) * 24 * 3600;
    expires = secToIso(end + GRACE_SEC);
  }

  const lic = {
    key: newKey(), email, name, plan, status: 'active', expires,
    customer: idOf(session.customer), subscription: subId, payment_intent: idOf(session.payment_intent), session: session.id,
    locale: lang, livemode, amount_total: session.amount_total, currency: session.currency, devices: []
  };
  await store.createLicense(lic);

  const mail = await sendLicenseMail(env, { to: email, lang, name, items: [{ key: lic.key, plan, expires }] });
  if (mail.ok) lic.mail_sent = nowIso(); else lic.mail_error = mail.error;
  await store.putLicense(lic);
  return { issued: true, plan, mail: mail.ok ? 'sent' : mail.error };
}

/* 플랜 판별: PRODUCT_MAP → 라인 아이템(상품명·유형) → mode. Utils 상품이 아니면 null */
async function resolvePlan(session, env) {
  const map = parseMap(env.PRODUCT_MAP);
  const items = await stripeGet(env, 'checkout/sessions/' + encodeURIComponent(session.id) + '/line_items?limit=10&expand[]=data.price.product');
  if (items && Array.isArray(items.data) && items.data.length) {
    for (const li of items.data) {
      const price = li.price || {};
      const prod = price.product;
      const pid = idOf(prod);
      const pname = (prod && typeof prod === 'object' && prod.name) || li.description || '';
      if (pid && map[pid]) return map[pid];
      if (price.id && map[price.id]) return map[price.id];
      if (/voca/i.test(pname)) {
        const iv = price.recurring && price.recurring.interval;
        if (/月額|monthly/i.test(pname) || iv === 'month') return 'monthly';
        if (/年額|yearly|annual/i.test(pname) || iv === 'year' || price.recurring) return 'yearly';
        if (/買い切り|lifetime|一括|one.?time/i.test(pname) || price.type === 'one_time') return 'lifetime';
      }
    }
    return null;
  }
  // 라인 아이템을 못 받음(STRIPE_SECRET_KEY 없음·오류) → 결제 금액(JPY 는 정수 엔 · 税込 100/800/2000) → 세션 mode 순으로 추정
  const byAmount = { 100: 'monthly', 800: 'yearly', 2000: 'lifetime' }[Number(session.amount_total)];
  if (byAmount) return byAmount;
  if (session.mode === 'subscription') return 'yearly';
  if (session.mode === 'payment') return 'lifetime';
  return null;
}

function parseMap(s) {
  if (!s) return {};
  try { const o = JSON.parse(s); return o && typeof o === 'object' ? o : {}; } catch (e) { return {}; }
}

/* ── 年額 갱신 ── */
async function onInvoicePaid(inv, { store }) {
  const subId = invoiceSubscriptionId(inv);
  if (!subId) return { skipped: 'no-subscription' };
  const end = invoicePeriodEnd(inv);
  const lic = await store.licenseBySubscription(subId);
  if (!lic) { await store.rememberSubPeriod(subId, end); return { skipped: 'license-not-yet', remembered: !!end }; }
  if (['refunded', 'disputed', 'revoked'].indexOf(lic.status) >= 0) return { skipped: lic.status };
  if (end) {
    const exp = secToIso(end + GRACE_SEC);
    if (!lic.expires || Date.parse(exp) > Date.parse(lic.expires)) lic.expires = exp;
  }
  if (lic.status === 'canceled') lic.status = 'active';
  lic.last_invoice = inv.id; lic.last_paid = nowIso();
  await store.putLicense(lic);
  return { extended: true, expires: lic.expires };
}

/* ── 구독 상태 동기화 ── */
async function onSubscriptionUpdated(sub, { store }) {
  const lic = await store.licenseBySubscription(sub.id);
  if (!lic) return { skipped: 'unknown-subscription' };
  if (['refunded', 'disputed', 'revoked'].indexOf(lic.status) >= 0) return { skipped: lic.status };
  lic.cancel_at_period_end = !!sub.cancel_at_period_end;
  lic.stripe_status = sub.status;
  if (['canceled', 'unpaid', 'incomplete_expired'].indexOf(sub.status) >= 0) {
    lic.status = 'canceled';
    lic.expires = minIso(lic.expires, nowIso());
  } else {
    lic.status = 'active';                                  // active · trialing · past_due(재시도 중 — 유예)
    const end = subscriptionPeriodEnd(sub);
    if (end) lic.expires = secToIso(end + GRACE_SEC);
  }
  await store.putLicense(lic);
  return { synced: true, status: lic.status, expires: lic.expires, cancel_at_period_end: lic.cancel_at_period_end };
}

async function onSubscriptionDeleted(sub, { store }) {
  const lic = await store.licenseBySubscription(sub.id);
  if (!lic) return { skipped: 'unknown-subscription' };
  if (['refunded', 'disputed', 'revoked'].indexOf(lic.status) >= 0) return { skipped: lic.status };
  lic.status = 'canceled';
  lic.stripe_status = 'canceled';
  lic.expires = minIso(lic.expires, nowIso());
  await store.putLicense(lic);
  return { canceled: true };
}

/* ── 환불(전액) · 분쟁 → 무효화 ── */
async function onRefund(charge, { store }) {
  if (!charge.refunded) return { skipped: 'partial-refund' };
  const lic = await store.licenseByPaymentOrCustomer(idOf(charge.payment_intent), idOf(charge.customer));
  if (!lic) return { skipped: 'unknown-charge' };
  lic.status = 'refunded';
  lic.expires = minIso(lic.expires, nowIso());
  lic.refund_charge = charge.id;
  await store.putLicense(lic);
  return { revoked: 'refunded' };
}

async function onDispute(dispute, { store, env }) {
  let lic = await store.licenseByPaymentOrCustomer(idOf(dispute.payment_intent), null);
  if (!lic && dispute.charge) {
    const ch = await stripeGet(env, 'charges/' + encodeURIComponent(idOf(dispute.charge)));
    if (ch) lic = await store.licenseByPaymentOrCustomer(idOf(ch.payment_intent), idOf(ch.customer));
  }
  if (!lic) return { skipped: 'unknown-dispute' };
  lic.status = 'disputed';
  lic.expires = minIso(lic.expires, nowIso());
  lic.dispute = dispute.id;
  await store.putLicense(lic);
  return { revoked: 'disputed' };
}

function minIso(a, b) {
  if (!a) return b;
  if (!b) return a;
  return Date.parse(a) < Date.parse(b) ? a : b;
}
