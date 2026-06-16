/* =============================================================================
   broodev.com — 회사 포털 (사이드바 SPA · 해시 라우팅 · 빌드 불필요)
   - 기본 랜딩: 회사 소개(#/about)
   - 사이드바 "유용한 앱들"(#/apps): 전체 앱 목록 (페이지네이션 테이블) — #5
   - 그 외 통상 부모도메인 기능(소식/멤버십/문의/약관) — #6 (목업, ***! TODO 표기)
   ========================================================================== */
const { useState, useEffect, useCallback } = React;

/* ---- 회사 정보 ---------------------------------------------------------- */
const COMPANY = {
  name: 'broodev',
  operator: 'Y-Systems',
  ceo: 'jsontype',
  email: 'jsontyper@gmail.com',
  tagline: '쓸모있는 웹앱을, 무료로.',
};

/* ---- 앱 카탈로그 (유용한 앱들 목록의 원본) -------------------------------
   새 앱을 추가하면 #/apps 목록에 자동 반영된다. (#5에서 테이블로 렌더) */
const APPS = [
  {
    slug: 'btc', name: 'BTC_SIGNAL', url: 'https://btc.broodev.com',
    category: '금융', status: 'live',
    desc: '비트코인 공포·탐욕 지수와 6개 지표를 합성한 매수 타이밍 점수(0~100).',
    tags: ['비트코인', '공포지수', '실시간'], since: '2026-06',
  },
];

/* ---- 내비게이션 --------------------------------------------------------- */
const NAV = [
  { group: '회사', items: [
    { id: 'about', icon: '▸', label: '회사 소개' },
    { id: 'apps',  icon: '▦', label: '유용한 앱들' },
  ]},
  { group: '더보기', items: [
    { id: 'news',       icon: '✷', label: '소식' },
    { id: 'membership', icon: '★', label: '멤버십' },
    { id: 'contact',    icon: '✉', label: '문의' },
  ]},
  { group: '정책', items: [
    { id: 'privacy', icon: '§', label: '개인정보처리방침' },
    { id: 'terms',   icon: '§', label: '이용약관' },
  ]},
];
const FLAT_NAV = NAV.flatMap(g => g.items);

/* ---- 공용 훅/컴포넌트 --------------------------------------------------- */
function useHashRoute(def) {
  const get = () => (location.hash.replace(/^#\/?/, '') || def);
  const [route, setRoute] = useState(get());
  useEffect(() => {
    const on = () => { setRoute(get()); window.scrollTo(0, 0); };
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

/* ---- 회사 소개 (기본 랜딩) --------------------------------------------- */
function AboutPage({ go }) {
  return (
    <div className="prose">
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
        <span style={{ fontSize: 40, color: 'var(--neon)', textShadow: '0 0 18px var(--neon)' }}>&gt;_</span>
        <h1 style={{ margin: 0 }}>brood<span className="muted">ev</span></h1>
      </div>
      <p className="lead">{COMPANY.tagline} 설치 없이 브라우저에서 바로 쓰는, 일상에 도움 되는 무료 웹앱들을 한곳에 모았습니다.</p>

      <div className="row" style={{ margin: '18px 0 8px' }}>
        <a className="btn" onClick={() => go('apps')}>▦ 유용한 앱들 보기</a>
        <a className="btn ghost" onClick={() => go('contact')}>✉ 문의하기</a>
      </div>

      <h2>우리가 하는 일</h2>
      <p>
        <strong>{COMPANY.operator}</strong>는 “양보다 질”을 원칙으로, 실제로 쓸모 있는 웹앱을 만들어 무료로 제공합니다.
        모든 앱은 광고(Google AdSense)로 운영되어 누구나 비용 없이 사용할 수 있습니다.
      </p>

      <h2>broodev 앱의 특징</h2>
      <div className="cards" style={{ margin: '12px 0' }}>
        <div className="card"><div className="k">설치 불필요</div><div className="v" style={{ fontSize: 18 }}>브라우저로 즉시</div><div className="sub">앱 설치·가입 없이 링크 하나로 실행</div></div>
        <div className="card"><div className="k">실시간 데이터</div><div className="v" style={{ fontSize: 18 }}>공개 API 합성</div><div className="sub">신뢰할 수 있는 출처에서 실시간 수집</div></div>
        <div className="card"><div className="k">다국어 · 모바일</div><div className="v" style={{ fontSize: 18 }}>어디서나</div><div className="sub">여러 언어 지원 + 반응형 모바일 대응</div></div>
        <div className="card"><div className="k">투명함</div><div className="v" style={{ fontSize: 18 }}>참고용 명시</div><div className="sub">데이터 출처·한계를 분명히 안내</div></div>
      </div>

      <h2>대표 앱</h2>
      <div className="table-wrap" style={{ margin: '12px 0' }}>
        <table className="tbl">
          <tbody>
            <tr className="clickable" onClick={() => window.open(APPS[0].url, '_blank', 'noopener')}>
              <td className="t-name">BTC_SIGNAL <span className="tag live">live</span></td>
              <td className="t-muted">비트코인 공포·탐욕 지수 &amp; 매수 타이밍 점수</td>
              <td style={{ textAlign: 'right' }} className="neon">btc.broodev.com ↗</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>회사 정보</h2>
      <ul>
        <li>운영: <strong>{COMPANY.operator}</strong> (대표 {COMPANY.ceo})</li>
        <li>문의: <a href={'mailto:' + COMPANY.email}>{COMPANY.email}</a></li>
        {/* ***! TODO: 사업자등록번호·설립연도·주소 등 공식 회사 정보 확정 후 기재 */}
        <li className="muted">사업자 정보: 준비 중</li>
      </ul>

      <hr className="divider" />
      <p className="muted" style={{ fontSize: 12 }}>© {COMPANY.operator} · broodev — 모든 앱은 참고용 도구이며, 이용에 따른 판단과 책임은 이용자 본인에게 있습니다.</p>
    </div>
  );
}

/* ---- (#5에서 구현) 유용한 앱들 ----------------------------------------- */
function AppsPage() {
  return (<><PageHead title="유용한 앱들" desc="broodev가 만든 앱 모음" /><div className="empty">목록 준비 중…</div></>);
}

/* ---- (#6에서 구현) 통상 부모도메인 기능 (목업) -------------------------- */
function NewsPage()       { return (<><PageHead title="소식" /><div className="empty">준비 중…</div></>); }
function MembershipPage() { return (<><PageHead title="멤버십" /><div className="empty">준비 중…</div></>); }
function ContactPage()    { return (<><PageHead title="문의" /><div className="empty">준비 중…</div></>); }
function PrivacyPage()    { return (<><PageHead title="개인정보처리방침" /><div className="empty">준비 중…</div></>); }
function TermsPage()      { return (<><PageHead title="이용약관" /><div className="empty">준비 중…</div></>); }

const SECTIONS = {
  about: AboutPage, apps: AppsPage, news: NewsPage,
  membership: MembershipPage, contact: ContactPage, privacy: PrivacyPage, terms: TermsPage,
};

/* ---- 앱 셸 ------------------------------------------------------------- */
function App() {
  const [route, go] = useHashRoute('about');
  const [navOpen, setNavOpen] = useState(false);
  useEffect(() => { setNavOpen(false); }, [route]);
  const Section = SECTIONS[route] || AboutPage;
  const current = FLAT_NAV.find(n => n.id === route);

  return (
    <>
      <div className={'scrim' + (navOpen ? ' show' : '')} onClick={() => setNavOpen(false)} />
      <div className="layout">
        <aside className={'sidebar' + (navOpen ? ' open' : '')}>
          <div className="side-brand">
            <span className="side-logo">&gt;_</span>
            <span className="side-title">brood<span className="dim">ev</span></span>
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
          <div className="side-foot">© {COMPANY.operator} · broodev<br />모든 앱 무료 · 광고로 운영</div>
        </aside>

        <main className="main">
          <header className="topbar">
            <button className="nav-toggle" onClick={() => setNavOpen(o => !o)} aria-label="메뉴">≡</button>
            <span className="topbar-title">{current ? current.label : 'broodev'}</span>
            <div className="topbar-right">
              <a className="chip" href="https://btc.broodev.com" target="_blank" rel="noopener">btc ↗</a>
              <Clock />
            </div>
          </header>
          <div className="content"><Section go={go} /></div>
        </main>
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
