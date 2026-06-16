/* =============================================================================
   admin.broodev.com — 운영 관리자 콘솔 (사이드바 SPA · 빌드 불필요)
   - #7 셸 스캐폴드(현재): 레이아웃 + 메뉴 + 빈 섹션
   - #8 Google SSO 게이트(jsontyper@gmail.com 단독)
   - #9 대시보드/앱/수집/조회/애널리틱스/설정 (목업)
   - #10 터미널 패널
   ⚠ 관리자 콘솔은 데이터 수집/운영용. 검색엔진 비노출(noindex).
   ========================================================================== */
const { useState, useEffect, useCallback, useRef } = React;

const ADMIN = { brand: 'broodev', sub: 'admin', operator: 'Y-Systems' };

/* ---- 내비게이션 --------------------------------------------------------- */
const NAV = [
  { group: '운영', items: [
    { id: 'dashboard', icon: '▣', label: '대시보드' },
    { id: 'apps',      icon: '▦', label: '앱' },
  ]},
  { group: '데이터', items: [
    { id: 'collect',   icon: '⇩', label: '데이터 수집' },
    { id: 'queries',   icon: '⌕', label: '조회 / 로그' },
    { id: 'analytics', icon: '∿', label: '애널리틱스' },
  ]},
  { group: '도구', items: [
    { id: 'terminal',  icon: '▸', label: '터미널' },
    { id: 'settings',  icon: '⚙', label: '설정' },
  ]},
];
const FLAT_NAV = NAV.flatMap(g => g.items);

/* ---- 공용 훅/컴포넌트 --------------------------------------------------- */
function useHashRoute(def) {
  const get = () => (location.hash.replace(/^#\/?/, '') || def);
  const [route, setRoute] = useState(get());
  useEffect(() => {
    const on = () => setRoute(get());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  const go = useCallback((id) => { location.hash = '#/' + id; }, []);
  return [route, go];
}

function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const p = (n) => String(n).padStart(2, '0');
  return (
    <div className="clock">
      <span className="clock-time">{p(now.getHours())}:{p(now.getMinutes())}:{p(now.getSeconds())}</span>
      <span className="clock-date">{now.getFullYear()}.{p(now.getMonth() + 1)}.{p(now.getDate())}</span>
    </div>
  );
}

function PageHead({ title, desc }) {
  return <div className="page-head"><h1>{title}</h1>{desc && <p>{desc}</p>}</div>;
}

/* ---- 섹션 (#9/#10에서 구현) -------------------------------------------- */
function DashboardPage() { return (<><PageHead title="대시보드" /><div className="empty">준비 중…</div></>); }
function AppsPage()      { return (<><PageHead title="앱" /><div className="empty">준비 중…</div></>); }
function CollectPage()   { return (<><PageHead title="데이터 수집" /><div className="empty">준비 중…</div></>); }
function QueriesPage()   { return (<><PageHead title="조회 / 로그" /><div className="empty">준비 중…</div></>); }
function AnalyticsPage() { return (<><PageHead title="애널리틱스" /><div className="empty">준비 중…</div></>); }
function TerminalPage()  { return (<><PageHead title="터미널" /><div className="empty">준비 중…</div></>); }
function SettingsPage()  { return (<><PageHead title="설정" /><div className="empty">준비 중…</div></>); }

const SECTIONS = {
  dashboard: DashboardPage, apps: AppsPage, collect: CollectPage,
  queries: QueriesPage, analytics: AnalyticsPage, terminal: TerminalPage, settings: SettingsPage,
};

/* ---- Google SSO 게이트 (운영자 단독) -----------------------------------
   ***! TODO: GOOGLE_CLIENT_ID 를 Google Cloud Console에서 발급한 OAuth 2.0
   클라이언트 ID로 교체하고, "승인된 자바스크립트 원본"에 https://admin.broodev.com
   (+ CF Pages 프리뷰 도메인)을 등록하세요.
   ⚠ 클라이언트측 검증은 "진짜 보안"이 아닙니다 — 실제 보호는 백엔드 토큰 검증 필요. */
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com';
const ALLOWED_EMAIL = 'jsontyper@gmail.com';
const NEEDS_SETUP = !GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.startsWith('YOUR_');

function decodeJwt(token) {
  try {
    const b = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(escape(atob(b))));
  } catch (e) { return null; }
}

function CenterCard({ children }) {
  return (
    <div style={{ position: 'relative', zIndex: 2, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="panel" style={{ width: '100%', maxWidth: 380, textAlign: 'center' }}>
        <span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" />
        {children}
      </div>
    </div>
  );
}

function LoginScreen({ onCredential, onDevLogin }) {
  const ref = useRef(null);
  useEffect(() => {
    if (NEEDS_SETUP) return;
    let tries = 0;
    const t = setInterval(() => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        clearInterval(t);
        window.google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: (r) => onCredential(r.credential) });
        if (ref.current) window.google.accounts.id.renderButton(ref.current, { theme: 'filled_black', size: 'large', shape: 'pill', text: 'signin_with', logo_alignment: 'center' });
      } else if (++tries > 50) { clearInterval(t); }
    }, 100);
    return () => clearInterval(t);
  }, []);
  return (
    <CenterCard>
      <div style={{ fontSize: 34, color: 'var(--neon)', textShadow: '0 0 18px var(--neon)' }}>⚙</div>
      <h2 style={{ color: 'var(--neon)', margin: '8px 0 4px', fontSize: 18 }}>broodev · admin</h2>
      <p className="muted" style={{ fontSize: 12, marginTop: 0 }}>관리자 전용 — Google 계정으로 로그인</p>
      {NEEDS_SETUP ? (
        <div style={{ textAlign: 'left', marginTop: 14 }}>
          <div className="mock-note"><b>⚠ 설정 필요</b><span>Google OAuth 클라이언트 ID가 아직 설정되지 않았습니다.</span></div>
          <ol className="muted" style={{ fontSize: 11.5, lineHeight: 1.7, paddingLeft: 18, margin: '0 0 10px' }}>
            <li>Google Cloud Console → 사용자 인증 정보 → OAuth 클라이언트 ID 생성</li>
            <li>승인된 JS 원본에 <span className="kbd">https://admin.broodev.com</span> 등록</li>
            <li>발급된 ID를 <span className="kbd">app.jsx</span> 의 GOOGLE_CLIENT_ID에 입력</li>
          </ol>
          <button className="btn ghost block" onClick={onDevLogin}>개발용으로 콘솔 미리보기 →</button>
        </div>
      ) : (
        <div ref={ref} style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }} />
      )}
      <p className="muted" style={{ fontSize: 10, marginTop: 16 }}>회원가입 없음 · 허용 계정만 접근</p>
    </CenterCard>
  );
}

function DeniedScreen({ user, onSignOut }) {
  return (
    <CenterCard>
      <div style={{ fontSize: 30, color: 'var(--crit)' }}>✕</div>
      <h2 style={{ color: 'var(--crit)', margin: '8px 0 4px', fontSize: 18 }}>접근 권한 없음</h2>
      <p className="muted" style={{ fontSize: 12 }}><b>{user.email}</b> 계정은 이 콘솔에 접근할 수 없습니다.</p>
      <button className="btn ghost block" style={{ marginTop: 12 }} onClick={onSignOut}>다른 계정으로 로그인</button>
    </CenterCard>
  );
}

function AuthGate({ children }) {
  const [user, setUser] = useState(null);
  const onCredential = (cred) => { const p = decodeJwt(cred); if (p && p.email) setUser({ email: p.email, name: p.name, picture: p.picture }); };
  const onDevLogin = () => setUser({ email: ALLOWED_EMAIL, name: '관리자 (개발)', picture: null, dev: true });
  const signOut = () => { try { window.google && window.google.accounts && window.google.accounts.id.disableAutoSelect(); } catch (e) {} setUser(null); };
  if (!user) return <LoginScreen onCredential={onCredential} onDevLogin={onDevLogin} />;
  if (user.email !== ALLOWED_EMAIL) return <DeniedScreen user={user} onSignOut={signOut} />;
  return children(user, signOut);
}

function UserChip({ user, onSignOut }) {
  return (
    <span className="row" style={{ gap: 8 }}>
      {user.picture
        ? <img src={user.picture} alt="" referrerPolicy="no-referrer" style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid var(--line)' }} />
        : <span style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid var(--line)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--neon)', fontSize: 12 }}>{(user.name || 'A')[0]}</span>}
      <span className="muted" style={{ fontSize: 11, maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}{user.dev ? ' (dev)' : ''}</span>
      <button className="chip" onClick={onSignOut}>로그아웃</button>
    </span>
  );
}

/* ---- 관리자 셸 --------------------------------------------------------- */
function AdminApp({ user, onSignOut }) {
  const [route, go] = useHashRoute('dashboard');
  const [navOpen, setNavOpen] = useState(false);
  useEffect(() => { setNavOpen(false); }, [route]);
  const Section = SECTIONS[route] || DashboardPage;
  const current = FLAT_NAV.find(n => n.id === route);

  return (
    <>
      <div className={'scrim' + (navOpen ? ' show' : '')} onClick={() => setNavOpen(false)} />
      <div className="layout">
        <aside className={'sidebar' + (navOpen ? ' open' : '')}>
          <div className="side-brand">
            <span className="side-logo">⚙</span>
            <span className="side-title">{ADMIN.brand}<span className="dim"> · {ADMIN.sub}</span></span>
          </div>
          <div className="side-nav">
            {NAV.map(group => (
              <React.Fragment key={group.group}>
                <div className="nav-label">{group.group}</div>
                {group.items.map(it => (
                  <a key={it.id} className={'nav-link' + (route === it.id ? ' active' : '')} onClick={() => go(it.id)}>
                    <span className="nico">{it.icon}</span>{it.label}
                  </a>
                ))}
              </React.Fragment>
            ))}
          </div>
          <div className="side-foot">© {ADMIN.operator}<br />운영 콘솔 · 내부용</div>
        </aside>

        <main className="main">
          <header className="topbar">
            <button className="nav-toggle" onClick={() => setNavOpen(o => !o)} aria-label="메뉴">≡</button>
            <span className="topbar-title">{current ? current.label : '관리자'}</span>
            <div className="topbar-right">
              <span className="sys-status status-ok"><span className="pulse" />ONLINE</span>
              <UserChip user={user} onSignOut={onSignOut} />
              <Clock />
            </div>
          </header>
          <div className="content"><Section go={go} /></div>
        </main>
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthGate>{(user, signOut) => <AdminApp user={user} onSignOut={signOut} />}</AuthGate>
);
