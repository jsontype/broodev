/* POST /api/license/admin — 운영자 전용(헤더 Authorization: Bearer <LICENSE_ADMIN_TOKEN>)
   Pages 변수 LICENSE_ADMIN_TOKEN(Secret · 32자 이상 난수)이 없으면 엔드포인트 자체가 404 처럼 닫힌다.
   { action, ... }:
     lookup        { key } | { email }                     → 라이선스 전체(마스킹 없음)
     issue         { email, plan:'yearly'|'lifetime', name?, expires?(ISO), note?, lang?('ja'|'ko'|'en'), send?(기본 true) }
                   → 수동 발급(웹훅 누락·은행 송금 등) + 메일
     resend        { key, lang? }                           → 그 키의 안내 메일 재송
     revoke        { key, status?('revoked'|'refunded'|'canceled'), note? }
     restore       { key, expires?(ISO|null) }              → status active 로
     extend        { key, expires(ISO|null) }               → 만료일 변경(null = 무기한)
     reset_devices { key }                                  → 기기 목록 비움(고객이 PC 를 바꿨을 때)
   예(PowerShell):
     Invoke-RestMethod -Method Post https://btc.broodev.com/api/license/admin -Headers @{Authorization="Bearer $tok"} -ContentType 'application/json' -Body '{"action":"lookup","email":"x@y.z"}' */

import { json, err, readJson, timingSafeEqual, nowIso } from '../../_lib/http.js';
import { newKey, normalizeKey } from '../../_lib/keys.js';
import { Store, VALID_STATUS, normEmail } from '../../_lib/store.js';
import { sendLicenseMail } from '../../_lib/mail.js';

export async function onRequest(ctx) {
  if (ctx.request.method !== 'POST') return err('method-not-allowed', 405);
  return admin(ctx);
}

export async function admin({ request, env }) {
  if (!env.LICENSE_ADMIN_TOKEN) return err('not-found', 404);
  if (!env.BTC_LICENSES) return err('kv-not-bound', 500);
  const auth = request.headers.get('authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  if (!token || !timingSafeEqual(token, env.LICENSE_ADMIN_TOKEN)) return err('unauthorized', 401);

  const body = await readJson(request, 64 * 1024);
  if (!body || !body.action) return err('bad-request', 400);
  const store = new Store(env.BTC_LICENSES);

  switch (body.action) {
    case 'lookup': {
      if (body.key) { const lic = await store.getLicense(normalizeKey(body.key)); return lic ? json({ ok: true, licenses: [lic] }) : err('invalid', 404); }
      if (body.email) return json({ ok: true, licenses: await store.licensesByEmail(body.email) });
      return err('bad-request', 400);
    }
    case 'issue': {
      const email = normEmail(body.email);
      const plan = body.plan === 'yearly' || body.plan === 'lifetime' ? body.plan : null;
      if (!email || !plan) return err('bad-request', 400);
      const expires = body.expires ? isoOrNull(body.expires) : (plan === 'yearly' ? new Date(Date.now() + 368 * 24 * 3600 * 1000).toISOString() : null);
      const lang = ['ja', 'ko', 'en'].indexOf(body.lang) >= 0 ? body.lang : 'ja';
      const lic = { key: newKey(), email, name: body.name || '', plan, status: 'active', expires, locale: lang, devices: [], manual: true, note: body.note || '', issued_by: 'admin' };
      await store.createLicense(lic);
      let mail = { ok: false, error: 'not-sent' };
      if (body.send !== false) {
        mail = await sendLicenseMail(env, { to: email, lang, name: lic.name, items: [{ key: lic.key, plan, expires }] });
        if (mail.ok) lic.mail_sent = nowIso(); else lic.mail_error = mail.error;
        await store.putLicense(lic);
      }
      return json({ ok: true, license: lic, mail: mail.ok ? 'sent' : mail.error });
    }
    case 'resend': {
      const lic = await store.getLicense(normalizeKey(body.key));
      if (!lic) return err('invalid', 404);
      const lang = ['ja', 'ko', 'en'].indexOf(body.lang) >= 0 ? body.lang : (lic.locale || 'ja');
      const mail = await sendLicenseMail(env, { to: lic.email, lang, name: lic.name, resend: true, items: [{ key: lic.key, plan: lic.plan, expires: lic.expires }] });
      if (mail.ok) { lic.mail_sent = nowIso(); delete lic.mail_error; } else lic.mail_error = mail.error;
      await store.putLicense(lic);
      return json({ ok: mail.ok, mail: mail.ok ? 'sent' : mail.error });
    }
    case 'revoke': {
      const lic = await store.getLicense(normalizeKey(body.key));
      if (!lic) return err('invalid', 404);
      lic.status = VALID_STATUS.indexOf(body.status) >= 0 && body.status !== 'active' ? body.status : 'revoked';
      if (body.note) lic.note = body.note;
      await store.putLicense(lic);
      return json({ ok: true, license: lic });
    }
    case 'restore': {
      const lic = await store.getLicense(normalizeKey(body.key));
      if (!lic) return err('invalid', 404);
      lic.status = 'active';
      if ('expires' in body) lic.expires = isoOrNull(body.expires);
      await store.putLicense(lic);
      return json({ ok: true, license: lic });
    }
    case 'extend': {
      const lic = await store.getLicense(normalizeKey(body.key));
      if (!lic) return err('invalid', 404);
      if (!('expires' in body)) return err('bad-request', 400);
      lic.expires = isoOrNull(body.expires);
      await store.putLicense(lic);
      return json({ ok: true, license: lic });
    }
    case 'reset_devices': {
      const lic = await store.getLicense(normalizeKey(body.key));
      if (!lic) return err('invalid', 404);
      lic.devices = [];
      await store.putLicense(lic);
      return json({ ok: true, license: lic });
    }
    default: return err('unknown-action', 400);
  }
}

function isoOrNull(v) {
  if (v == null || v === '') return null;
  const t = Date.parse(v);
  return isNaN(t) ? null : new Date(t).toISOString();
}
