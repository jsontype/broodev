/* Utils — 문의 · 제안 폼 (contact.html) → EmailJS → 운영자 메일
   포털(apps/home/assets/js/portal.js) · dev3 · voca 와 같은 서비스/템플릿/변수 규격. 메일 레이아웃 정본: docs/emailjs-template.md
   변수: subject · kind(출처) · name · email · reply_to · message · page · time · env · ua · shots
   SDK 미로드(광고 차단기·오프라인)면 mailto: 폴백. 상태 문구는 i18n(ct_*). */
(function () {
  'use strict';
  var I = window.MH_I18N, BIZ = window.BIZ || {};
  var EMAILJS_PUBLIC_KEY = 'u-DIwFmmMVFWrxJMX';
  var EMAILJS_SERVICE_ID = 'broodev_service';
  var EMAILJS_TEMPLATE_ID = 'broodev_template';
  var FALLBACK_MAIL = BIZ.email || 'support@broodev.com';
  var MAIL_SUBJECT = 'BROODEV에서 사용자 문의가 왔습니다.'; // 뒤에 "— 출처 · 이름" (같은 제목이면 Gmail 이 한 스레드로 묶음)
  var APP = 'utils', HOST = 'utils.broodev.com';
  var KIND_KO = { bug: '버그 신고', idea: '개선 제안', other: '기타 문의' }; // 운영자(한국어) 메일(EmailJS)의 출처 구분 — mailto 폴백은 사용자 언어(ct_kind_*)
  var KIND_ICON = { bug: '🚨', idea: '💡', other: '💬' };

  function t(k, v) { return I ? I.t(k, v) : k; }
  function envSummary() {
    var ua = navigator.userAgent, m;
    var os = /Windows/.test(ua) ? 'Windows' : /Android/.test(ua) ? 'Android' : /iPhone|iPad|iPod/.test(ua) ? 'iOS' : /Mac OS X/.test(ua) ? 'macOS' : /CrOS/.test(ua) ? 'ChromeOS' : /Linux/.test(ua) ? 'Linux' : 'OS?';
    var br = (m = /Edg\/(\d+)/.exec(ua)) ? 'Edge ' + m[1] : (m = /OPR\/(\d+)/.exec(ua)) ? 'Opera ' + m[1] : (m = /SamsungBrowser\/(\d+)/.exec(ua)) ? 'Samsung ' + m[1]
      : (m = /(?:Chrome|CriOS)\/(\d+)/.exec(ua)) ? 'Chrome ' + m[1] : (m = /(?:Firefox|FxiOS)\/(\d+)/.exec(ua)) ? 'Firefox ' + m[1] : (m = /Version\/(\d+).*Safari/.exec(ua)) ? 'Safari ' + m[1] : '브라우저?';
    var touch = window.matchMedia && matchMedia('(pointer: coarse)').matches;
    var lang = (I ? I.lang() : navigator.language);
    return os + ' · ' + br + ' · ' + (touch ? '터치(모바일)' : '데스크톱') + ' · 화면 ' + screen.width + '×' + screen.height + ' · 창 ' + innerWidth + '×' + innerHeight + ' · ' + navigator.language + ' · UI ' + lang;
  }
  function nowJST() { try { return new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Tokyo', hour12: false }) + ' (JST)'; } catch (e) { return String(new Date()); } }

  var form = document.getElementById('contactForm');
  var result = document.getElementById('result');
  if (!form || !result) return;
  var btn = form.querySelector('button[type="submit"]');
  var configured = !!(window.emailjs && EMAILJS_PUBLIC_KEY);
  if (configured) emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  function status(kind, text) { result.className = 'pg-result' + (kind ? ' is-' + kind : ''); result.textContent = text || ''; }
  // 언어가 바뀌면 떠 있는 상태 문구는 지운다(다른 언어로 남는 것 방지)
  document.addEventListener('mh:lang', function () { status('', ''); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var kindVal = form.kind.value, name = form.name.value.trim(), email = form.email.value.trim(), msg = form.message.value.trim();
    if (!msg) { status('err', t('ct_need_msg')); form.message.focus(); return; }
    var validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    var kindKo = KIND_KO[kindVal] || KIND_KO.other;
    if (!configured) {
      // 메일 앱 폴백 — 보내는 사람 시점의 제목(사용자 본인의 메일 앱에 뜨므로 사용자 언어의 구분 라벨 · ct_kind_*)
      var kindLabel = t('ct_kind_' + (KIND_KO[kindVal] ? kindVal : 'other'));
      var subj = '[' + HOST + '] ' + kindLabel + (name ? ' — ' + name : '');
      location.href = 'mailto:' + FALLBACK_MAIL + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(msg + '\n\n— ' + (name || '') + (email ? ' <' + email + '>' : ''));
      return;
    }
    if (btn) btn.disabled = true;
    status('sending', t('ct_sending'));
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      subject: MAIL_SUBJECT + ' — ' + (KIND_ICON[kindVal] || '💬') + ' ' + APP + ' ' + kindKo + ' · ' + (name || '무기명'),
      kind: APP + ' (' + HOST + ') · ' + kindKo,
      name: name || '(무기명)', email: email || '(회신 주소 없음)', reply_to: validEmail ? email : '',
      message: msg, page: location.href, time: nowJST(), env: envSummary(), ua: navigator.userAgent, shots: '(없음)'
    }).then(function () {
      status('ok', t('ct_ok'));
      form.reset();
    }).catch(function (err) {
      if (window.console) console.warn('utils contact: emailjs failed', err);
      status('err', t('ct_err', { mail: FALLBACK_MAIL }));
    }).then(function () { if (btn) btn.disabled = false; });
  });
}());
