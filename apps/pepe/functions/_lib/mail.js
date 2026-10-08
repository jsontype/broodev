/* 라이선스 메일 — Resend (https://resend.com · 무료 월 3,000통) · 도메인 broodev.com 인증 후 support@broodev.com 발신
   필요 변수(Pages → Settings → Variables and Secrets): RESEND_API_KEY(Secret) · MAIL_FROM(선택, 기본 'Y Systems Support <support@broodev.com>')
   언어: Checkout 의 locale → 없으면 청구지 국가(JP→ja · KR→ko) → 기본 ja. 그 외 언어는 en.
   같은 템플릿을 발급 메일(키 1개)과 재송 메일(키 n개)에 쓴다. */

const SITE = 'https://btc.broodev.com';
const SUPPORT = 'support@broodev.com';
const PRODUCT = 'Crypto Signals Premium';                     // 앱별 상품명(메일 제목·본문)
const PRICES = { monthly: 100, yearly: 800, lifetime: 2000 };   // 税込 — apps/home/legal/biz.js PLANS 와 같게(2026-10-08 개정). 갱신 안내 금액에 쓰인다
const fy = (n) => '¥' + Number(n).toLocaleString('en-US');
const DEFAULT_PORTAL = 'https://billing.stripe.com/p/login/14A6oJ3Ao8LybQi4sW4wM00';   // apps/utils/js/biz.js PLANS.portal 과 같은 값(env PORTAL_URL 로 덮어쓰기 가능)

export function pickLang(locale, country) {
  const l = String(locale || '').toLowerCase();
  if (l.indexOf('ja') === 0) return 'ja';
  if (l.indexOf('ko') === 0) return 'ko';
  if (l && l !== 'auto') return 'en';
  const c = String(country || '').toUpperCase();
  if (c === 'JP') return 'ja';
  if (c === 'KR') return 'ko';
  return c ? 'en' : 'ja';
}

const T = {
  ja: {
    subject: '【' + PRODUCT + '】ライセンスキーのご案内',
    subject_resend: '【' + PRODUCT + '】ライセンスキーの再送',
    hello: (n) => (n ? `${n} 様` : 'お客様'),
    thanks: PRODUCT + ' をご購入いただきありがとうございます。ライセンスキーは次のとおりです。',
    resend_intro: 'ご依頼により、このメールアドレスで購入されたライセンスキーをお送りします。',
    plan: { monthly: 'プレミアム · 月額', yearly: 'プレミアム · 年額', lifetime: 'プレミアム · 買い切り' },
    how: '■ 有効化の方法',
    step1: (u) => `1. 次のリンクを開く（または ${SITE}/pricing の「ライセンスを有効化」にキーを入力）: ${u}`,
    step2: `2. 同じブラウザで ${SITE} を開くとプレミアム機能が使えます（PREMIUM ボタンからキーを有効化することもできます）`,
    devices: '※ ご本人の端末 3 台まで有効化できます。別の端末では同じキーをもう一度入力してください。',
    monthly: (exp, portal) => `■ 月額プラン: ${exp ? exp + ' まで有効。' : ''}1 か月ごとに ${fy(PRICES.monthly)}（税込）で自動更新され、更新日の前にメールでお知らせします。解約・カード変更はお客様ポータルから: ${portal}`,
    yearly: (exp, portal) => `■ 年額プラン: ${exp ? exp + ' まで有効。' : ''}1 年ごとに ${fy(PRICES.yearly)}（税込）で自動更新され、更新日の前にメールでお知らせします。解約・カード変更はお客様ポータルから: ${portal}`,
    lifetime: '■ 買い切りプラン: 自動更新・追加請求はありません。本サービスの提供期間中ずっとご利用いただけます。',
    receipt: '領収書（適格請求書）は Stripe から別途メールで届きます。',
    help: `ご不明な点は ${SUPPORT} までご連絡ください。`,
    sign: `— Y Systems · Crypto Signals（${SITE}）`,
    legal: '利用規約 https://broodev.com/legal/terms · 返金・解約ポリシー https://broodev.com/legal/refund',
    button: 'ライセンスを有効化する'
  },
  ko: {
    subject: '[' + PRODUCT + '] 라이선스 키 안내',
    subject_resend: '[' + PRODUCT + '] 라이선스 키 재발송',
    hello: (n) => (n ? `${n} 님` : '고객님'),
    thanks: PRODUCT + ' 을 구매해 주셔서 감사합니다. 라이선스 키는 아래와 같습니다.',
    resend_intro: '요청하신 대로 이 이메일 주소로 구매된 라이선스 키를 보내 드립니다.',
    plan: { monthly: '프리미엄 · 월간', yearly: '프리미엄 · 연간', lifetime: '프리미엄 · 평생 이용권' },
    how: '■ 활성화 방법',
    step1: (u) => `1. 아래 링크를 열거나 ${SITE}/pricing 의 「라이선스 활성화」에 키를 입력: ${u}`,
    step2: `2. 같은 브라우저에서 ${SITE} 을 열면 프리미엄 기능을 쓸 수 있습니다(PREMIUM 버튼에서 키를 직접 활성화할 수도 있습니다)`,
    devices: '※ 본인 기기 3대까지 활성화할 수 있습니다. 다른 기기에서는 같은 키를 다시 입력하세요.',
    monthly: (exp, portal) => `■ 월간 플랜: ${exp ? exp + ' 까지 유효. ' : ''}1개월마다 ${fy(PRICES.monthly)}(세금 포함)으로 자동 갱신되며 갱신일 전에 메일로 알려 드립니다. 해지·카드 변경은 고객 포털에서: ${portal}`,
    yearly: (exp, portal) => `■ 연간 플랜: ${exp ? exp + ' 까지 유효. ' : ''}1년마다 ${fy(PRICES.yearly)}(세금 포함)으로 자동 갱신되며 갱신일 전에 메일로 알려 드립니다. 해지·카드 변경은 고객 포털에서: ${portal}`,
    lifetime: '■ 평생 이용권: 자동 갱신·추가 청구가 없습니다. 서비스가 제공되는 동안 계속 이용할 수 있습니다.',
    receipt: '영수증(적격청구서)은 Stripe 에서 별도 메일로 발송됩니다.',
    help: `문의: ${SUPPORT}`,
    sign: `— Y Systems · Crypto Signals (${SITE})`,
    legal: '이용약관 https://broodev.com/legal/terms · 환불·해지 정책 https://broodev.com/legal/refund',
    button: '라이선스 활성화'
  },
  en: {
    subject: 'Your ' + PRODUCT + ' license key',
    subject_resend: 'Your ' + PRODUCT + ' license key (resent)',
    hello: (n) => (n ? `Hello ${n},` : 'Hello,'),
    thanks: 'Thank you for purchasing ' + PRODUCT + '. Here is your license key:',
    resend_intro: 'As requested, here are the license keys purchased with this email address:',
    plan: { monthly: 'Premium · Monthly', yearly: 'Premium · Yearly', lifetime: 'Premium · Lifetime' },
    how: '■ How to activate',
    step1: (u) => `1. Open this link (or paste the key into "Activate license" on ${SITE}/pricing): ${u}`,
    step2: `2. Open ${SITE} in the same browser — Premium features are now enabled (you can also activate the key from the PREMIUM button)`,
    devices: '※ You can activate up to 3 of your own devices. On another device, enter the same key again.',
    monthly: (exp, portal) => `■ Monthly plan: ${exp ? 'valid until ' + exp + '. ' : ''}Renews automatically every month at ${fy(PRICES.monthly)} (tax included); we email you before the renewal date. Cancel or update your card in the customer portal: ${portal}`,
    yearly: (exp, portal) => `■ Yearly plan: ${exp ? 'valid until ' + exp + '. ' : ''}Renews automatically every year at ${fy(PRICES.yearly)} (tax included); we email you before the renewal date. Cancel or update your card in the customer portal: ${portal}`,
    lifetime: '■ Lifetime plan: no renewals, no further charges — valid for as long as the service is offered.',
    receipt: 'Your receipt (qualified invoice) is sent separately by Stripe.',
    help: `Questions? Email ${SUPPORT}.`,
    sign: `— Y Systems · Crypto Signals (${SITE})`,
    legal: 'Terms https://broodev.com/legal/terms · Refund & cancellation https://broodev.com/legal/refund',
    button: 'Activate license'
  }
};

function fmtDate(iso, lang) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d)) return '';
  const y = d.getUTCFullYear(), m = d.getUTCMonth() + 1, day = d.getUTCDate();
  if (lang === 'ja') return `${y}年${m}月${day}日`;
  if (lang === 'ko') return `${y}년 ${m}월 ${day}일`;
  return d.toISOString().slice(0, 10);
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* items: [{ key, plan, expires }] — 1개면 발급 메일, 여러 개(또는 resend=true)면 재송 메일 */
export function buildLicenseMail({ lang, name, items, resend, portal }) {
  const L = T[lang] || T.en;
  const P = portal || DEFAULT_PORTAL;
  const lines = [];
  const html = [];
  lines.push(L.hello(name));
  lines.push('');
  lines.push(resend ? L.resend_intro : L.thanks);
  html.push(`<p>${esc(L.hello(name))}</p><p>${esc(resend ? L.resend_intro : L.thanks)}</p>`);
  for (const it of items) {
    const label = L.plan[it.plan] || it.plan;
    const act = `${SITE}/?license=${encodeURIComponent(it.key)}&lang=${lang}`;
    lines.push('');
    lines.push(`[${label}]`);
    lines.push(`    ${it.key}`);
    lines.push('');
    lines.push(L.how);
    lines.push(L.step1(act));
    lines.push(L.step2);
    lines.push(L.devices);
    const planLine = it.plan === 'lifetime' ? L.lifetime : (it.plan === 'monthly' ? L.monthly : L.yearly)(fmtDate(it.expires, lang), P);
    lines.push(planLine);
    html.push(
      `<p style="margin:18px 0 4px;color:#666;font-size:13px">${esc(label)}</p>` +
      `<p style="margin:0 0 14px;font:700 20px/1.4 Consolas,Menlo,monospace;letter-spacing:1px;padding:12px 16px;border:1px solid #ddd;border-radius:8px;background:#f7f7f7;display:inline-block">${esc(it.key)}</p>` +
      `<p><a href="${esc(act)}" style="display:inline-block;padding:10px 18px;border-radius:8px;background:#111;color:#fff;text-decoration:none;font-weight:700">${esc(L.button)}</a></p>` +
      `<p style="font-size:14px;color:#444">${esc(L.how)}<br>${esc(L.step1(act))}<br>${esc(L.step2)}<br>${esc(L.devices)}</p>` +
      `<p style="font-size:14px;color:#444">${esc(planLine)}</p>`
    );
  }
  lines.push('');
  lines.push(L.receipt);
  lines.push(L.help);
  lines.push('');
  lines.push(L.sign);
  lines.push(L.legal);
  html.push(`<p style="font-size:14px;color:#444">${esc(L.receipt)}<br>${esc(L.help)}</p><p style="font-size:12px;color:#888">${esc(L.sign)}<br>${esc(L.legal)}</p>`);
  return {
    subject: resend ? L.subject_resend : L.subject,
    text: lines.join('\n'),
    html: `<!doctype html><html><body style="font:15px/1.6 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#111;max-width:620px;margin:0 auto;padding:24px">${html.join('')}</body></html>`
  };
}

/* Resend 전송. 반환 { ok, id | error } — 키가 없으면 ok:false/'no-mail-key'(발급은 계속, 관리자가 재송) */
export async function sendMail(env, { to, subject, text, html }, fetchImpl) {
  if (!env || !env.RESEND_API_KEY) return { ok: false, error: 'no-mail-key' };
  if (!to) return { ok: false, error: 'no-recipient' };
  const f = fetchImpl || fetch;
  const body = {
    from: env.MAIL_FROM || 'Y Systems Support <support@broodev.com>',
    to: [to],
    reply_to: env.MAIL_REPLY_TO || SUPPORT,
    subject, text, html
  };
  try {
    const r = await f('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: 'Bearer ' + env.RESEND_API_KEY, 'content-type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) return { ok: false, error: 'resend-' + r.status + ':' + (data && (data.message || data.name) || '') };
    return { ok: true, id: data.id || null };
  } catch (e) {
    return { ok: false, error: 'resend-network:' + (e && e.message || '') };
  }
}

export async function sendLicenseMail(env, { to, lang, name, items, resend }, fetchImpl) {
  const m = buildLicenseMail({ lang, name, items, resend, portal: env && env.PORTAL_URL });
  return sendMail(env, { to, subject: m.subject, text: m.text, html: m.html }, fetchImpl);
}
