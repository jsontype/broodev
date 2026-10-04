/* Utils — 프리미엄 라이선스 상태 (브라우저 쪽 · 2026-10-05 서버 연동)
   무료/프리미엄의 경계는 출력 형식(js/biz.js PLANS.premium_formats). 이 파일은 「이 브라우저에 유효한 라이선스가 있는가」를 답하고,
   서버(/api/license/* — apps/utils/functions, Cloudflare Pages Functions + KV)와 활성화·재검증·해제·재송을 주고받는다.

   저장: localStorage 'mh:license' = { key, exp(ISO|null), plan('yearly'|'lifetime'), cancel, devices, max, email(마스킹), at, checked }
         localStorage 'mh:device'  = 이 브라우저의 기기 ID(난수 · 3대 한도 계산용)
     - exp null = 買い切り(만료 없음). 年額은 Stripe 갱신 웹훅이 서버 쪽 만료를 늘리고, 24시간마다의 재검증(refresh)이 받아 온다
   발급: Stripe Payment Link 결제 → 웹훅(functions/api/stripe/webhook.js)이 키를 만들어 메일 → 고객이 요금 페이지 「ライセンスを有効化」에 입력
         (또는 메일의 pricing?license=KEY 링크) → activate() → /api/license/verify → 유효하면 저장 → 'mh:license' 이벤트 → app.js 가 잠금 해제
   ★ 브라우저 쪽 판정은 우회될 수 있다(개발자 도구). 출력물 자체는 브라우저에서 만들어지므로 서버 검증은 「키 발급·활성화 횟수(3대)」에만 둔다 — 정책상 허용 */
(function (root) {
  'use strict';
  var KEY = 'mh:license', DEV = 'mh:device';
  var RECHECK_MS = 24 * 3600 * 1000;           // 서버 재검증 주기
  var API = '/api/license/';
  var FATAL = ['invalid', 'expired', 'canceled', 'refunded', 'disputed', 'revoked', 'device_limit'];   // 이 응답이면 로컬 상태를 지운다
  var ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  function read() {
    try { return JSON.parse(root.localStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
  }
  function write(L) { try { root.localStorage.setItem(KEY, JSON.stringify(L)); } catch (e) { /* 저장 불가(프라이빗 모드 등) */ } }
  function clear() { try { root.localStorage.removeItem(KEY); } catch (e) { /* 무시 */ } }
  function nowIso() { return new Date().toISOString(); }

  // 만료 시각(ms). 날짜만 있는 구형 값('2027-10-04')은 그날 끝까지
  function expMs(exp) {
    if (!exp) return Infinity;
    var s = String(exp); if (s.length === 10) s += 'T23:59:59';
    var t = Date.parse(s); return isNaN(t) ? Infinity : t;
  }
  function active() {
    var L = read();
    if (!L || !L.key) return false;
    return expMs(L.exp) >= Date.now();
  }
  // 하위 호환(set(key, exp)) + 서버 응답 저장
  function set(key, exp, plan) {
    write({ key: String(key), exp: exp || null, plan: plan || null, at: nowIso(), checked: nowIso() });
    emit();
  }
  function emit() { try { document.dispatchEvent(new CustomEvent('mh:license', { detail: read() })); } catch (e) { /* 구형 */ } }

  // 형식(xlsx/pptx/ai/psd)이 프리미엄인지 — biz.js 가 없는 페이지(index/pptx 는 biz.js 를 싣지 않음)를 위해 기본값 내장
  function isPremiumFormat(fmt) {
    var P = root.PLANS && root.PLANS.premium_formats ? root.PLANS.premium_formats : ['pptx', 'ai', 'psd'];
    return P.indexOf(fmt) >= 0;
  }

  // 입력 → 정규형 UTILS-XXXX-XXXX-XXXX-XXXX (서버 functions/_lib/keys.js 와 같은 규칙). 형식이 아니면 null
  function normalize(input) {
    var s = String(input || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (s.indexOf('UTILS') === 0) s = s.slice(5);
    if (s.length !== 16) return null;
    for (var i = 0; i < 16; i++) if (ALPHABET.indexOf(s[i]) < 0) return null;
    return 'UTILS-' + s.match(/.{4}/g).join('-');
  }

  // 기기 ID: 처음 한 번 난수 생성 → 같은 브라우저(프로필)에서 재사용
  function device() {
    var id = null;
    try { id = root.localStorage.getItem(DEV); } catch (e) { /* 무시 */ }
    if (!id || !/^[A-Za-z0-9_-]{8,64}$/.test(id)) {
      id = rand();
      try { root.localStorage.setItem(DEV, id); } catch (e) { /* 무시 */ }
    }
    return id;
  }
  function rand() {
    if (root.crypto && root.crypto.randomUUID) return root.crypto.randomUUID().replace(/-/g, '');
    var a = new Uint8Array(16); if (root.crypto && root.crypto.getRandomValues) root.crypto.getRandomValues(a); else for (var i = 0; i < 16; i++) a[i] = Math.floor(Math.random() * 256);
    var s = ''; for (var j = 0; j < 16; j++) s += (a[j] < 16 ? '0' : '') + a[j].toString(16); return s;
  }
  // 기기 표시용 짧은 이름(서버의 기기 목록에 저장 — 운영자가 문의 대응 때 알아보기 위해)
  function deviceName() {
    var ua = root.navigator ? root.navigator.userAgent || '' : '';
    var os = /Windows/.test(ua) ? 'Windows' : /Mac OS X/.test(ua) && !/iPhone|iPad/.test(ua) ? 'macOS' : /iPhone|iPad/.test(ua) ? 'iOS' : /Android/.test(ua) ? 'Android' : /Linux/.test(ua) ? 'Linux' : 'Other';
    var br = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Browser';
    return os + ' · ' + br;
  }

  function post(path, body) {
    return root.fetch(API + path, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().then(function (j) { j = j || {}; j._status = r.status; return j; }, function () { return { ok: false, error: 'network', _status: r.status }; }); });
  }
  function store(key, j) {
    write({ key: key, exp: j.expires || null, plan: j.plan || null, cancel: !!j.cancel_at_period_end, devices: j.devices, max: j.max_devices, email: j.email || '', at: (read() || {}).at || nowIso(), checked: nowIso() });
  }

  // 활성화. cb(err, state) — err: 'invalid'|'expired'|'canceled'|'refunded'|'disputed'|'revoked'|'device_limit'|'network'|'bad-request'
  function activate(input, cb) {
    var key = normalize(input);
    if (!key) { cb && cb('invalid'); return; }
    post('verify', { key: key, device: device(), name: deviceName() }).then(function (j) {
      if (j.ok) { store(key, j); emit(); cb && cb(null, read()); }
      else cb && cb(j.error || 'network', j);
    }, function () { cb && cb('network'); });
  }

  // 이 기기 해제(서버 기기 목록에서 빼고 로컬도 지움). 서버 실패해도 로컬은 지운다
  function deactivate(cb) {
    var L = read();
    if (!L || !L.key) { cb && cb(null); return; }
    post('deactivate', { key: L.key, device: device() }).then(function () { clear(); emit(); cb && cb(null); }, function () { clear(); emit(); cb && cb('network'); });
  }

  // 24시간마다 서버 재검증 — 해지·환불·만료 연장을 반영. 네트워크 오류·서버 오류면 그대로 둔다
  function refresh(force) {
    var L = read();
    if (!L || !L.key || typeof root.fetch !== 'function') return;
    if (!force && L.checked && Date.now() - Date.parse(L.checked) < RECHECK_MS) return;
    post('verify', { key: L.key, device: device(), name: deviceName() }).then(function (j) {
      if (j.ok) { store(L.key, j); emit(); }
      else if (j.error && FATAL.indexOf(j.error) >= 0) { clear(); emit(); }
    }, function () { /* 오프라인 — 다음에 */ });
  }

  // 구매 메일 주소로 키 재송(서버는 존재 여부를 노출하지 않고 항상 ok)
  function resend(email, lang, cb) {
    post('resend', { email: String(email || '').trim(), lang: lang }).then(function (j) { cb && cb(j.ok ? null : (j.error || 'network')); }, function () { cb && cb('network'); });
  }

  root.MH_LICENSE = { active: active, set: set, clear: clear, read: read, isPremiumFormat: isPremiumFormat, normalize: normalize, activate: activate, deactivate: deactivate, refresh: refresh, resend: resend, device: device };

  setTimeout(function () { refresh(false); }, 0);   // 페이지 스크립트가 다 붙은 뒤 조용히 재검증
}(window));
