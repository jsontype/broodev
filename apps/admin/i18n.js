/* admin.broodev.com i18n 코어. ko 원본 + i18n/<lang>.js(window.__ADMIN). */
(function () {
  var LANGS = [
    { code: 'en', label: 'English' }, { code: 'ja', label: '日本語' }, { code: 'ko', label: '한국어' },
    { code: 'zh', label: '简体中文' }, { code: 'zh-Hant', label: '繁體中文' }, { code: 'th', label: 'ไทย' },
    { code: 'es', label: 'Español' }, { code: 'fr', label: 'Français' }, { code: 'de', label: 'Deutsch' },
    { code: 'it', label: 'Italiano' }, { code: 'pt', label: 'Português' }, { code: 'ru', label: 'Русский' },
    { code: 'nl', label: 'Nederlands' }
  ];
  function has(c) { for (var i = 0; i < LANGS.length; i++) if (LANGS[i].code === c) return true; return false; }
  // 감지: ?lang= → localStorage(broodev:lang) → navigator.languages 첫 매치(zh-TW/HK/MO → zh-Hant) → en  (home·legal 과 같은 우선순위)
  function norm(tag) {
    tag = String(tag || '').toLowerCase();
    if (!tag) return null;
    if (tag.indexOf('zh') === 0) return /hant|tw|hk|mo/.test(tag) ? 'zh-Hant' : 'zh';
    var b = tag.split('-')[0];
    return has(b) ? b : null;
  }
  function detectLang() {
    try {
      var q = new URLSearchParams(location.search).get('lang');
      var qn = q && (has(q) ? q : norm(q));
      if (qn) { try { localStorage.setItem('broodev:lang', qn); } catch (e) {} return qn; }
      var s = null; try { s = localStorage.getItem('broodev:lang'); } catch (e) {}
      if (s && has(s)) return s;
      var nav = navigator || {};
      var cands = nav.languages && nav.languages.length ? nav.languages : [nav.language];
      for (var i = 0; i < cands.length; i++) { var l = norm(cands[i]); if (l) return l; }
      return 'en';
    } catch (e) { return 'en'; }
  }
  function fmt(s, o) { s = String(s == null ? '' : s); if (o) for (var k in o) s = s.split('{' + k + '}').join(o[k]); return s; }

  var KO = {
    nav: { dashboard: '대시보드', apps: '앱', collect: '데이터 수집', queries: '조회 / 로그', analytics: '애널리틱스', terminal: '터미널', settings: '설정' },
    grp: { ops: '운영', data: '데이터', tools: '도구' },
    foot: '운영 콘솔 · 내부용', online: 'ONLINE', logout: '로그아웃', admin: '관리자', mock: '목업',
    langLabel: '언어 / Language', menu: '메뉴', loading: '관리자 콘솔 불러오는 중…',
    status: { ok: '정상', live: '운영 중', warn: '경고', err: '오류' },
    sso: {
      sub: '관리자 전용 — Google 계정으로 로그인', setup: 'Google OAuth 클라이언트 ID가 아직 설정되지 않았습니다.',
      step1: 'Google Cloud Console → 사용자 인증 정보 → OAuth 클라이언트 ID 생성', step2: '승인된 JavaScript 원본에 {url} 등록',
      step3: '발급된 ID를 {file}의 GOOGLE_CLIENT_ID에 입력', devLogin: '개발용으로 콘솔 미리보기 →',
      noSignup: '회원가입 없음 · 허용 계정만 접근', deniedH: '접근 권한 없음', deniedP: '계정은 이 콘솔에 접근할 수 없습니다.', other: '다른 계정으로 로그인'
    },
    dash: {
      title: '대시보드', desc: 'broodev 운영 요약', mock: '지표·수익은 예시 값입니다. 실데이터는 백엔드 연동 후 표시됩니다.',
      cApps: '앱', cAppsSub: '운영 중', cJobs: '활성 수집 잡', cJobsSub: '1개 경고', cVisit: '오늘 방문', cVisitSub: '어제 대비 +30%', cRev: '추정 수익(월)', cRevSub: 'AdSense 연동 예정',
      recent: '최근 활동', collectStatus: '수집 상태', manageCollect: '수집 관리 →'
    },
    appsP: { title: '앱', desc: '등록된 broodev 앱', mock: '앱 등록/상태는 추후 백엔드와 동기화됩니다.', thApp: '앱', thDomain: '도메인', thJobs: '수집 잡', thSync: '최근 동기화', thStatus: '상태' },
    collect: { title: '데이터 수집', desc: '수집 잡 관리 · 수동 실행', mock: '“지금 수집”은 동작만 흉내냅니다. 실제 트리거는 백엔드 연동 시.', thId: '잡 ID', thApp: '앱', thSource: '소스', thSched: '주기', thLast: '최근', thStatus: '상태', run: '지금 수집', running: '실행 중…' },
    queries: { title: '조회 / 로그', desc: '수집 이벤트 로그', mock: '예시 로그입니다. 실제 조회는 수집 DB 연동 후.', allApps: '전체 앱', allLevels: '전체 레벨', thTime: '시각', thApp: '앱', thEvent: '이벤트', thDetail: '상세', empty: '결과 없음' },
    analytics: { title: '애널리틱스', desc: '트래픽 · 수익', mock: '방문·수익은 예시 값입니다. GA4 / AdSense API 연동 예정.', c7d: '7일 방문', cDwell: '평균 체류', cRpm: '추정 RPM', cRpmSub: 'AdSense 연동 후', visits7d: '최근 7일 방문' },
    term: { title: '터미널', desc: '운영 명령 콘솔', note: '※ collect 등 실제 동작은 백엔드 연동 후입니다. 지금은 목업 응답.',
      welcome: 'broodev 관리자 셸 — 시작하려면 {cmd} 입력', help: '명령어: {list}', statusLine: '앱: {apps} · 수집 잡: {jobs} (경고 {warn})',
      today: '오늘 방문: {visits} · 추정 수익: {rev}', last: '최근', usage: '사용법: {cmd} <잡 ID>', unknownJob: '알 수 없는 잡: {id}',
      triggering: '{id} 실행 중…', done: '✓ {id} 완료 (목업)', notFound: '명령어 없음: {cmd} ({help} 참고)', noUser: '알 수 없음'
    },
    settings: {
      title: '설정', desc: '일반 · 연동 · 테마', mock: '저장은 아직 서버에 반영되지 않습니다(화면용).',
      general: '일반', siteName: '사이트 이름', opEmail: '운영자 이메일',
      adsensePub: 'AdSense 게시자 ID', ga4Id: 'Analytics(GA4) 측정 ID', integ: '연동 (API 키)', notiTheme: '알림 / 테마',
      notiToggle: '수집 실패 시 이메일 알림', themeColor: '테마 강조색', colorGreen: '그린', colorCyan: '시안', colorAmber: '앰버', save: '저장', saved: '✓ 저장됨 (목업)',
      danger: '위험 구역', dangerP: '캐시/수집 데이터를 초기화합니다. (목업 — 동작 안 함)', dangerBtn: '수집 캐시 비우기'
    }
  };

  var warned = {};
  function getT(lang) {
    if (lang === 'ko') return KO;
    var w = window.__ADMIN || {};
    if (w[lang]) return w[lang];
    // 사전 파일이 로드/파싱에 실패하면(예: 문법 오류) 조용히 영어로 떨어지지 않도록 경고를 남긴다
    if (!warned[lang] && typeof console !== 'undefined') { warned[lang] = 1; console.warn('[admin i18n] dictionary missing for "' + lang + '" (i18n/' + lang + '.js) — falling back to en'); }
    return w.en || KO;
  }
  window.ADMIN_I18N = { LANGS: LANGS, detectLang: detectLang, getT: getT, fmt: fmt, has: has };
})();
