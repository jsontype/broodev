/* =============================================================================
   broodev dev2 — ">_ COSMIC COMPILER"
   스크롤 = 엔터키. 페이지 전체 = 한 번의 빌드.
   Yang Donghwa(@jsontype) · Y-Systems · broodev
   - React 18 UMD + framer-motion UMD + Canvas 2D (빌드 불필요, three.js 없음)
   - 모든 연출은 scroll-LINKED(스크럽): 되감으면 정확히 역재생된다
   ========================================================================== */
const { useState, useEffect, useRef, useCallback } = React;
const M = window.Motion;

/* ---- Motion 로드 실패 시 정적 폴백 --------------------------------------- */
if (!M) document.documentElement.classList.add('static-fallback');
const { motion, useScroll, useTransform, useSpring, useMotionValueEvent, useReducedMotion } = M || {};

const EMAIL = 'jsontyper@gmail.com';
const LINKS = {
  github: 'https://github.com/jsontype',
  youtube: 'https://www.youtube.com/c/CodingCafe1',
  linkedin: 'https://www.linkedin.com/in/donghwa-yang-b73a57216/',
  x: 'https://x.com/jsontype',
  old: 'https://jsontype.github.io/home',
};

/* ---- 전역 파티클 필드 상태 (React 리렌더 0회 원칙: rAF가 직접 읽음) ------ */
const FIELD = { warp: 0, converge: 0, mouseX: 0.5, mouseY: 0.5, reduce: false, mobile: false };

/* ---- 데이터 -------------------------------------------------------------- */
const DEVI = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/';
const ORBITS = [
  { // 내궤도: 언어
    speed: 120, frac: 0.36,
    nodes: [
      ['HTML5', 'html5/html5-original'], ['CSS', 'css3/css3-original'],
      ['JS', 'javascript/javascript-original'], ['TS', 'typescript/typescript-original'],
      ['JAVA', 'java/java-original'], ['PY', 'python/python-original'],
      ['PHP', 'php/php-original'], ['GO', 'go/go-original'],
    ],
  },
  { // 중궤도: 프레임워크 (역방향)
    speed: -192, frac: 0.6,
    nodes: [
      ['REACT', 'react/react-original'], ['NEXT', 'nextjs/nextjs-original', 1],
      ['REDUX', 'redux/redux-original'], ['R-QUERY', null], ['VUE', 'vuejs/vuejs-original'],
      ['NUXT', 'nuxtjs/nuxtjs-original'], ['TAILWIND', 'tailwindcss/tailwindcss-original'],
      ['MUI', 'materialui/materialui-original'], ['GRAPHQL', 'graphql/graphql-plain'],
      ['NODE', 'nodejs/nodejs-original'], ['EXPRESS', 'express/express-original', 1],
    ],
  },
  { // 외궤도: DB·인프라·QA·디자인
    speed: 288, frac: 0.85,
    nodes: [
      ['MONGO', 'mongodb/mongodb-original'], ['POSTGRES', 'postgresql/postgresql-original'],
      ['MYSQL', 'mysql/mysql-original'], ['DOCKER', 'docker/docker-original'],
      ['AWS', 'amazonwebservices/amazonwebservices-original-wordmark', 1],
      ['GCP', 'googlecloud/googlecloud-original'], ['JEST', 'jest/jest-plain'],
      ['CYPRESS', 'cypressio/cypressio-original', 1], ['FIGMA', 'figma/figma-original'],
    ],
  },
];

const PROJECTS = [
  { hash: 'a3f9c21', name: 'BTC_SIGNAL', status: 'live', statusLabel: 'LIVE · IN PRODUCTION',
    desc: '15종 코인의 공포·탐욕 지수와 6개 지표(RSI·MACD·마이어 배수·낙폭·이동평균)를 합성해 매수 타이밍 점수(0~100)를 계산하는 시그널 대시보드.',
    tags: ['Vanilla JS', '공개 API 합성', '실시간'], metric: '13개 언어 · 15종 코인 서비스 중',
    url: 'https://broodev.com', link: 'broodev.com' },
  { hash: '7be02d4', name: 'VOCA_DECK', status: 'live', statusLabel: 'LIVE · IN PRODUCTION',
    desc: '단어와 뜻을 큰 글자로 번갈아 보여주는 깜빡이 단어암기장. CSV 암기장 임포트, 3초 자동 반복, TTS 발음까지 — 설치 없이 링크 하나로.',
    tags: ['React', 'CSV Import', 'Web TTS'], metric: '설치 0초 · 100% 무료',
    url: 'https://voca.broodev.com', link: 'voca.broodev.com' },
  { hash: 'c51ffa9', name: 'GREENLAND_INFO', status: 'orbit', statusLabel: 'IN ORBIT · LAUNCH READY',
    desc: '그린란드 15개 마을의 날씨·파고·조석·오로라·극야 카운트다운, 노선별 결항 리스크, 사냥 신고 안내 — 36개 명령의 해커 터미널까지 담은 극지 인포패널.',
    tags: ['Vanilla JS', 'Open-Meteo · NOAA', 'Terminal'], metric: '북위 77° Qaanaaq까지 15개 정착지',
    url: null, link: null },
  { hash: 'd72e9a5', name: 'AFRICA_UTILITY', status: 'orbit', statusLabel: 'IN ORBIT · LAUNCH READY',
    desc: '나이지리아·케냐·가나·남아공의 정전 정보, 실시간 환율·송금 실효비용 계산기, 정부/시험 조회 포털, 검증된 USSD 코드 — 32개 명령 터미널 포함 일상 유틸.',
    tags: ['Vanilla JS', 'Live FX', '4 Countries'], metric: '저사양·저대역폭 최적화 단일 파일',
    url: null, link: null },
  { hash: 'f04ac88', name: 'CODINGCAFE1', status: 'live', statusLabel: 'LIVE · YOUTUBE',
    desc: '코딩을 배우는 사람들을 위한 유튜브 채널. 만드는 법뿐 아니라 "왜 그렇게 만드는가"를 나눕니다.',
    tags: ['YouTube', '강의', '멘토링'], metric: '지식은 나눌수록 컴파일된다',
    url: LINKS.youtube, link: 'youtube.com/c/CodingCafe1' },
];

const SERVICES = [
  { no: '01', name: 'WEB BUILD', desc: 'React·Next·Vue·Nuxt 풀사이클 — 기획에서 배포·운영까지. 도쿄 프로덕션 현장에서 검증된 프론트엔드 아키텍처로 만듭니다.' },
  { no: '02', name: 'GLOBAL SHIP', desc: '13개 언어 다국어·현지화 운영 노하우. 국가별 생활 데이터 서비스 설계 — 국경 없는 웹앱을 만듭니다.' },
  { no: '03', name: 'TEACH & SHARE', desc: 'YouTube CodingCafe1 운영. 코딩 강의·멘토링 — 만드는 법과 함께 "왜"를 가르칩니다.' },
];

const WHOAMI_TEXT = `$ cat ./about.md

# Yang Donghwa — @jsontype
도쿄에서 일하는 한국인 프론트엔드 개발자.
낮에는 도쿄의 프로덕션 코드를 만들고,
밤에는 broodev 우주에 무료 웹앱들을
쏘아 올립니다.

원칙은 하나 — "양보다 질".
설치 없이. 국경 없이. 무료로.`;

const CHAPTERS = [
  ['boot', '00 boot'], ['whoami', '01 whoami'], ['stack', '02 stack'],
  ['log', '03 log'], ['svc', '04 services'], ['ssh', '05 ssh'],
];

/* ========================================================================== */
/* 글리프 파티클 필드 — 전 페이지 단일 캔버스·단일 rAF                        */
/* ========================================================================== */
/* 단어형 글리프('null','=>')는 본문 텍스트와 시각 충돌 → 단문자만 사용 */
const GLYPHS = ['{', '}', '[', ']', ':', ',', '"', ';', '0', '1'];
const TIERS = [
  { scale: 0.62, par: -8, alpha: 0.2 },
  { scale: 1.0, par: -20, alpha: 0.34 },
  { scale: 1.55, par: -45, alpha: 0.5 },
];

function makeSprites() {
  const colors = { base: 'rgba(210,232,220,0.92)', neon: '#00ff88', blue: '#9bd8ff', orange: '#ff7a2f' };
  const out = {};
  for (const key in colors) {
    out[key] = GLYPHS.map(g => {
      const c = document.createElement('canvas');
      const s = 44; c.width = s * 2; c.height = s;
      const x = c.getContext('2d');
      x.font = '700 26px "JetBrains Mono", monospace';
      x.textAlign = 'center'; x.textBaseline = 'middle';
      x.fillStyle = colors[key];
      x.fillText(g, s, s / 2 + 1);
      return c;
    });
  }
  return out;
}

function GlyphField() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current, ctx = canvas.getContext('2d');
    let raf = 0, W = 0, H = 0, parts = [], targets = [], running = true;
    const dpr = Math.min(window.devicePixelRatio || 1, FIELD.mobile ? 1.5 : 2);
    const sprites = makeSprites();
    const lerp = (a, b, t) => a + (b - a) * t;
    const easeOut = t => 1 - Math.pow(1 - t, 3);

    const sampleTargets = () => {
      // 피날레 역-빅뱅 목표 좌표: 'CONTACT' 외곽 샘플링
      const off = document.createElement('canvas');
      off.width = 980; off.height = 220;
      const ox = off.getContext('2d');
      ox.font = '800 150px "JetBrains Mono", monospace';
      ox.textAlign = 'center'; ox.textBaseline = 'middle';
      ox.fillText('CONTACT', 490, 118);
      const img = ox.getImageData(0, 0, 980, 220).data;
      const pts = [];
      for (let y = 0; y < 220; y += 6) for (let x = 0; x < 980; x += 6) {
        if (img[(y * 980 + x) * 4 + 3] > 120) pts.push([x, y]);
      }
      const scale = Math.min(W * 0.88, 980) / 980;
      targets = pts.map(([x, y]) => [W / 2 + (x - 490) * scale, H * 0.4 + (y - 110) * scale]);
    };

    const init = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = FIELD.mobile ? 140 : Math.min(420, Math.floor(W * H / 3400));
      parts = Array.from({ length: count }, (_, i) => {
        const tier = TIERS[i % 3 === 2 && FIELD.mobile ? 1 : i % 3];
        return {
          x: Math.random() * W, y: Math.random() * H,
          g: (Math.random() * GLYPHS.length) | 0,
          t: tier, vy: 0.04 + Math.random() * 0.16,
          tw: Math.random() * Math.PI * 2, sp: 0.4 + Math.random() * 1.2,
          tgt: 0, delay: Math.random() * 0.45,
        };
      });
      sampleTargets();
      parts.forEach((p, i) => { p.tgt = targets.length ? i % targets.length : 0; });
    };

    let parX = [0, 0, 0], parY = [0, 0, 0];
    const draw = (t) => {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      const warp = FIELD.warp, conv = FIELD.converge;
      // 마우스 시차: lerp 0.06 감쇠 (즉발 반응 금지)
      TIERS.forEach((tier, i) => {
        const px = (FIELD.mouseX - 0.5) * tier.par, py = (FIELD.mouseY - 0.5) * tier.par * 0.7;
        parX[i] = lerp(parX[i], px, 0.06); parY[i] = lerp(parY[i], py, 0.06);
      });
      for (const p of parts) {
        const ti = TIERS.indexOf(p.t);
        let x = p.x + parX[ti], y = p.y + parY[ti];
        let alpha = p.t.alpha * (FIELD.reduce ? 0.8 : (0.55 + 0.45 * Math.sin(t * 0.0005 * p.sp + p.tw)));
        let set = 'base', scale = p.t.scale;

        if (conv > 0 && targets.length) {
          // 역-빅뱅: 목표 좌표로 per-particle lerp
          const cp = easeOut(Math.max(0, Math.min(1, (conv - p.delay) / (1 - p.delay))));
          const [tx, ty] = targets[p.tgt];
          x = lerp(x, tx, cp); y = lerp(y, ty, cp);
          if (cp > 0.55) set = 'neon';
          alpha = Math.max(alpha, cp * 0.95); scale = lerp(scale, 0.5, cp * 0.5);
        } else if (warp > 0.01) {
          // 워프: 방사 가속 + 도플러 streak
          const dx = x - cx, dy = y - cy;
          const f = 1 + warp * warp * 3.2;
          const nx = cx + dx * f, ny = cy + dy * f;
          const sx = cx + dx * (f - warp * 0.7), sy = cy + dy * (f - warp * 0.7);
          ctx.globalAlpha = Math.min(0.85, warp * 0.9) * p.t.alpha;
          ctx.strokeStyle = x < cx ? '#9bd8ff' : '#ff7a2f';
          ctx.lineWidth = p.t.scale;
          ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(nx, ny); ctx.stroke();
          x = nx; y = ny; alpha *= (1 - warp * 0.75);
        }

        if (alpha > 0.02) {
          const sp = sprites[set][p.g];
          const w = 44 * scale, h = 22 * scale;
          ctx.globalAlpha = alpha;
          ctx.drawImage(sp, x - w / 2, y - h / 2, w, h);
        }
        if (!FIELD.reduce && conv === 0) {
          p.y += p.vy * p.t.scale; if (p.y > H + 14) { p.y = -14; p.x = Math.random() * W; }
        }
      }
      ctx.globalAlpha = 1;
      if (!FIELD.reduce) raf = requestAnimationFrame(draw);
    };

    init();
    if (FIELD.reduce) draw(0); else raf = requestAnimationFrame(draw);
    let rto = 0;
    const onResize = () => { clearTimeout(rto); rto = setTimeout(() => { init(); if (FIELD.reduce) draw(0); }, 150); };
    const onMouse = e => { FIELD.mouseX = e.clientX / W; FIELD.mouseY = e.clientY / H; };
    const onVis = () => {
      running = !document.hidden;
      cancelAnimationFrame(raf);
      if (running && !FIELD.reduce) raf = requestAnimationFrame(draw);
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouse, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    return () => {
      running = false; cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouse);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);
  return <canvas id="glyphfield" ref={ref} aria-hidden="true" />;
}

/* ========================================================================== */
/* 상단 빌드 프로그레스 바 + HUD 챕터 내비게이션                              */
/* ========================================================================== */
function BuildBar() {
  const barRef = useRef(null);
  const { scrollYProgress } = useScroll();
  useMotionValueEvent(scrollYProgress, 'change', v => {
    if (!barRef.current) return;
    const filled = Math.round(v * 10);
    barRef.current.textContent = `[${'#'.repeat(filled)}${'·'.repeat(10 - filled)}] ${String(Math.round(v * 100)).padStart(3, ' ')}%  compiling universe...`;
  });
  return (
    <div className="buildbar" aria-hidden="true">
      <span className="bb-logo">&gt;_ broodev</span>
      <span className="bb-track" ref={barRef}>[··········]   0%  compiling universe...</span>
    </div>
  );
}

function Hud({ active }) {
  return (
    <nav className="hud" aria-label="챕터 이동">
      {CHAPTERS.map(([id, label]) => (
        <a key={id} href={'#' + id} className={active === id ? 'on' : ''}>
          [{label.slice(0, 2)}<span className="hud-label"> {label.slice(3)}</span>]
        </a>
      ))}
    </nav>
  );
}

/* ========================================================================== */
/* 01 BOOT — 히어로 (260vh 핀): 컴파일 채움 → 워프 줌                          */
/* ========================================================================== */
function Boot({ reduce }) {
  const ref = useRef(null);
  const nameRef = useRef(null);
  const lineRefs = useRef([]);
  const subRef = useRef(null);
  const promptRef = useRef(null);
  const chipRef = useRef(null);
  const bhRef = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  /* framer의 네이티브 타임라인 최적화가 opacity/filter를 고착시키는 문제 →
     모든 스크럽을 rAF 직접 쓰기로 통일 (Stack/DeepLog와 동일 패턴) */
  const seg = (v, a, b) => Math.max(0, Math.min(1, (v - a) / (b - a)));
  const apply = useCallback(v => {
    const name = nameRef.current; if (!name) return;
    const fills = [seg(v, 0, 0.1), seg(v, 0.04, 0.14), seg(v, 0.08, 0.18)];
    const grow = seg(v, 0.12, 0.32);
    const fade = seg(v, 0.24, 0.32);
    const sub = 1 - seg(v, 0.1, 0.2);
    name.style.transform = `scale(${1 + grow * (FIELD.mobile ? 0.9 : 1.5)})`;
    name.style.opacity = 1 - fade;
    name.style.filter = FIELD.mobile ? 'none' : `blur(${fade * 14}px)`;
    lineRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.backgroundPositionX = `${(1 - fills[i]) * 100}%`;
      el.style.letterSpacing = `${0.02 + grow * 0.3}em`;
    });
    if (subRef.current) subRef.current.style.opacity = sub;
    if (promptRef.current) promptRef.current.style.opacity = sub;
    if (chipRef.current) chipRef.current.style.opacity = sub;
    if (bhRef.current) { // 블랙홀: 워프 진입 시 확대되며 소멸
      bhRef.current.style.opacity = 0.85 * (1 - fade);
      bhRef.current.style.transform = `translateX(-50%) rotate(180deg) scale(${1 + grow * 0.12})`;
    }
    // 워프 강도: 0.1→0.24 상승, 0.3→0.42 하강 (종형)
    FIELD.warp = reduce ? 0 : seg(v, 0.1, 0.24) * (1 - seg(v, 0.3, 0.42));
    // 워프 중에는 HUD가 확대 타이포에 깔리므로 숨김
    document.documentElement.classList.toggle('warp-on', FIELD.warp > 0.08);
  }, [reduce]);

  useMotionValueEvent(p, 'change', v => { if (!reduce) apply(v); });
  useEffect(() => { apply(reduce ? 0 : p.get()); }, [apply, reduce]);

  return (
    <section className="track" id="boot" ref={ref} style={{ height: reduce ? 'auto' : '260vh' }} aria-label="인트로">
      <div className="pin boot-inner">
        {/* 이벤트 호라이즌 — space-portfolio(MIT) 자산, assets/LICENSE-assets.txt */}
        <video className="blackhole" ref={bhRef} src="assets/blackhole.webm"
          autoPlay loop muted playsInline aria-hidden="true" />
        <span className="hero-chip" ref={chipRef}>✦ FRONTEND DEVELOPER — TOKYO</span>
        <div className="boot-name" ref={nameRef}>
          <span className="boot-line" ref={el => lineRefs.current[0] = el} style={reduce ? { backgroundPositionX: '0%' } : {}}>Yang Donghwa</span>
          <span className="boot-line l2" ref={el => lineRefs.current[1] = el} style={reduce ? { backgroundPositionX: '0%' } : {}}>Jsontype</span>
          <span className="boot-line l3" ref={el => lineRefs.current[2] = el} style={reduce ? { backgroundPositionX: '0%' } : {}}><span className="l3-prompt">&gt;_&nbsp;</span>Broodev<span className="boot-cursor" /></span>
          <p className="boot-sub kr" ref={subRef}>
            도쿄의 프론트엔드 개발자 <b>양동화</b> — 설치 없는 웹앱들의 우주 <b>broodev</b>를 만듭니다
          </p>
        </div>
        <div className="boot-prompt" ref={promptRef}>
          $ scroll --to-explore <span className="t-caret">▊</span>
        </div>
      </div>
    </section>
  );
}

/* ========================================================================== */
/* 02 WHOAMI — 스크롤 타이핑 스크럽 + 역방향 키워드                            */
/* ========================================================================== */
function Whoami({ reduce }) {
  const ref = useRef(null);
  const typeRef = useRef(null);
  const { scrollYProgress: pt } = useScroll({ target: ref, offset: ['start 0.92', 'start 0.18'] });
  const { scrollYProgress: pm } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  useMotionValueEvent(pt, 'change', v => {
    if (!typeRef.current) return;
    const n = Math.floor(v * WHOAMI_TEXT.length);
    typeRef.current.textContent = WHOAMI_TEXT.slice(0, n) + (n < WHOAMI_TEXT.length ? '▊' : '\n\n$ ▊');
  });

  const x1 = useTransform(pm, [0, 1], ['12%', '-14%']);
  const x2 = useTransform(pm, [0, 1], ['-10%', '16%']);
  const x3 = useTransform(pm, [0, 1], ['14%', '-12%']);

  return (
    <section className="whoami" id="whoami" ref={ref} aria-label="소개">
      <div className="wrap whoami-grid">
        <div className="term">
          <div className="term-bar"><i /><i /><i className="g" /><span>jsontype@tokyo: ~/universe</span></div>
          <div className="term-body" ref={typeRef} aria-label="양동화 소개">{reduce ? WHOAMI_TEXT : '▊'}</div>
        </div>
        <div className="kw-stack" aria-hidden="true">
          <motion.div className="kw" style={reduce ? {} : { x: x1 }}><span className="fill">01</span>Ship</motion.div>
          <motion.div className="kw" style={reduce ? {} : { x: x2 }}><span className="fill">02</span>Solve</motion.div>
          <motion.div className="kw" style={reduce ? {} : { x: x3 }}><span className="fill">03</span>Scale</motion.div>
          <p className="kw-desc">만들면 끝까지 배포한다. 사소하지만 절실한 문제를 푼다. 13개 언어로 국경을 넘는다.</p>
        </div>
      </div>
    </section>
  );
}

/* ========================================================================== */
/* 03 STACK — 기술 항성계 (320vh 핀): 차등 회전 → Syzygy 행성 직렬            */
/* ========================================================================== */
function Stack({ reduce }) {
  const ref = useRef(null);
  const fieldRef = useRef(null);
  const ringRefs = useRef([]);
  const nodeRefs = useRef([]);
  const coreRef = useRef(null);
  const flashRef = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const allNodes = [];
  ORBITS.forEach((o, oi) => o.nodes.forEach((n, ni) => allNodes.push({ oi, ni, name: n[0], icon: n[1], inv: n[2] })));
  // 모바일: 과밀 방지를 위해 절반만 궤도에 올린다
  const NODES = FIELD.mobile ? allNodes.filter((_, i) => i % 2 === 0) : allNodes;

  const layout = useCallback((v) => {
    const field = fieldRef.current;
    if (!field) return;
    const rect = { w: field.offsetWidth, h: field.offsetHeight };
    const R = Math.min(rect.w, rect.h) / 2;
    const expand = 0.7 + 0.3 * Math.min(v / 0.8, 1);
    const s = Math.max(0, Math.min(1, (v - 0.82) / 0.13)); // Syzygy 진행률 (0.95에 완성 후 유지)
    // 궤도 링
    ORBITS.forEach((o, i) => {
      const el = ringRefs.current[i]; if (!el) return;
      const d = R * o.frac * 2 * expand;
      el.style.width = d + 'px'; el.style.height = d + 'px';
      el.style.transform = `translate(-50%,-50%) rotate(${v * o.speed * 0.5}deg)`;
      el.style.opacity = 1 - s * 0.85;
    });
    if (coreRef.current) coreRef.current.style.opacity = 1 - s; // 직렬 중 중앙 카피 퇴장
    // 노드: 원궤도(깊이 위계 포함) → Syzygy 수직 직렬로 lerp
    const total = NODES.length;
    NODES.forEach((n, idx) => {
      const el = nodeRefs.current[idx]; if (!el) return;
      const orbit = ORBITS[n.oi];
      const base = (n.ni / orbit.nodes.length) * 360 + n.oi * 40;
      const ang = (base + v * orbit.speed) * Math.PI / 180;
      const r = R * orbit.frac * expand;
      const cx = Math.cos(ang) * r, cy = Math.sin(ang) * r;
      // 깊이 위계: 아래(가까움)=크고 선명, 위(멂)=작고 흐림 → 겹침이 질서로 읽힌다
      const dep = (Math.sin(ang) + 1) / 2;
      // 6시 방향 ±15° 창 통과 시 강조
      const deg = ((base + v * orbit.speed) % 360 + 360) % 360;
      const nearGate = Math.max(0, 1 - Math.abs(deg - 90) / 15);
      // Syzygy 목표: 수직 1열
      const ty = (idx / (total - 1) - 0.5) * rect.h * 0.78;
      const x = cx * (1 - s), y = cy * (1 - s) + ty * s;
      const sc = (0.82 + dep * 0.3 + nearGate * 0.28) * (1 - s * 0.12);
      el.style.transform = `translate(-50%,-50%) translate(${x}px,${y}px) scale(${sc})`;
      el.style.opacity = (0.4 + dep * 0.6) * (1 - s) + s;
      el.style.borderColor = nearGate > 0.4 || s > 0.8 ? 'rgba(0,255,136,0.55)' : 'rgba(232,245,238,0.1)';
      el.style.zIndex = nearGate > 0.4 ? 20 : 2 + Math.round(dep * 10);
    });
    if (flashRef.current) {
      const f = s > 0.62 ? (s - 0.62) / 0.38 : 0;
      flashRef.current.style.transform = `scaleY(${f})`;
      flashRef.current.style.opacity = f;
    }
  }, []);

  useMotionValueEvent(p, 'change', layout);
  useEffect(() => { layout(reduce ? 0.5 : 0); const t = setTimeout(() => layout(reduce ? 0.5 : p.get()), 300); return () => clearTimeout(t); }, [layout, reduce]);

  return (
    <section className="track" id="stack" ref={ref} style={{ height: reduce ? 'auto' : '320vh' }} aria-label="기술 스택">
      <div className="pin stack-inner">
        <div className="stack-head">
          <div className="h-cmd"><span className="cmd">$</span> ls ./stack <span className="out" style={{ color: 'var(--faint)' }}>--orbit</span></div>
          <div className="h-sub">스크롤 = 공전. 28개의 기술이 세 개의 궤도를 돕니다. 끝까지 돌리면 — 직렬(Syzygy).</div>
        </div>
        <div className="orbit-field" ref={fieldRef}>
          <video className="orbit-bg" src="assets/skills-bg.webm" autoPlay loop muted playsInline aria-hidden="true" />
          <div className="orbit-watermark" aria-hidden="true">STACK</div>
          {ORBITS.map((o, i) => <div className={'orbit-ring r' + i} key={i} ref={el => ringRefs.current[i] = el} />)}
          <div className="orbit-core" ref={coreRef}>
            <div className="oc-sig">&gt;_</div>
            <div className="oc-txt kr">프론트엔드를 축으로<br />백엔드·인프라까지 —<br />혼자서 궤도 전체를 돕니다.</div>
          </div>
          {NODES.map((n, idx) => (
            <div className="orbit-node" key={n.name} ref={el => nodeRefs.current[idx] = el}>
              {n.icon && <img src={DEVI + n.icon + '.svg'} alt="" className={n.inv ? 'inv' : ''} loading="lazy" />}
              {n.name}
            </div>
          ))}
          <div className="syzygy-flash" ref={flashRef} style={{ transform: 'scaleY(0)', opacity: 0 }} aria-hidden="true" />
          {FIELD.mobile && <div className="orbit-more">+{allNodes.length - NODES.length} more in orbit</div>}
        </div>
      </div>
    </section>
  );
}

/* ========================================================================== */
/* 04 LOG — 딥스페이스 수평 스크럽 + 조준창 도킹 (420vh 핀)                    */
/* ========================================================================== */
function DeepLog({ reduce }) {
  const ref = useRef(null);
  const railRef = useRef(null);
  const cardRefs = useRef([]);
  const dockRefs = useRef([]);
  const geom = useRef({ offsets: [], widths: [], max: 0 });
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const sp = useSpring(p, { stiffness: 90, damping: 28, mass: 0.6 });

  const measure = useCallback(() => {
    const rail = railRef.current; if (!rail) return;
    geom.current.offsets = cardRefs.current.map(el => el ? el.offsetLeft : 0);
    geom.current.widths = cardRefs.current.map(el => el ? el.offsetWidth : 0);
    geom.current.max = Math.max(0, rail.scrollWidth - window.innerWidth + 40);
  }, []);

  const apply = useCallback((v) => {
    const rail = railRef.current; if (!rail) return;
    const raw = Math.max(0, Math.min(1, (v - 0.03) / 0.9));
    // 자석 스냅: 어느 지점에서 멈춰도 카드 1장이 조준창에 도킹되도록 인력 적용
    const N = PROJECTS.length;
    const snap = Math.round(raw * (N - 1)) / (N - 1);
    const t = raw + (snap - raw) * 0.6;
    const x = -t * geom.current.max;
    rail.style.transform = `translateX(${x}px)`;
    const vw = window.innerWidth;
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const cx = geom.current.offsets[i] + geom.current.widths[i] / 2 + x;
      const d = Math.min(1, Math.abs(cx - vw / 2) / (vw / 2));
      el.style.transform = `scale(${1 - d * 0.13})`;
      el.style.filter = `brightness(${0.55 + 0.45 * (1 - d)})`;
      el.style.opacity = 0.45 + 0.55 * (1 - d);
      // 조준창(중앙 ±10%): 상세 패널 도킹 스크럽
      const dockP = Math.max(0, 1 - d / 0.22);
      const dk = dockRefs.current[i];
      if (dk) {
        dk.style.clipPath = `inset(0 0 ${(1 - dockP) * 100}% 0)`;
        dk.style.opacity = 0.25 + dockP * 0.75;
      }
    });
  }, []);

  useMotionValueEvent(sp, 'change', apply);
  useEffect(() => {
    measure(); apply(reduce ? 0.5 : 0);
    const t = setTimeout(() => { measure(); apply(reduce ? 0.5 : sp.get()); }, 350);
    let rto = 0;
    const onR = () => { clearTimeout(rto); rto = setTimeout(() => { measure(); apply(sp.get()); }, 150); };
    window.addEventListener('resize', onR);
    return () => { clearTimeout(t); window.removeEventListener('resize', onR); };
  }, [measure, apply, reduce]);

  return (
    <section className="track" id="log" ref={ref} style={{ height: reduce ? 'auto' : '420vh' }} aria-label="프로젝트">
      <div className="pin">
        <div className="log-head">
          <div className="h-cmd"><span className="cmd">$</span> git log --projects</div>
          <div className="h-sub">스크롤이 우주선을 민다 — 카드가 조준창(화면 중앙)에 들어오면 상세 데이터가 도킹된다.</div>
        </div>
        <div className="rail-wrap">
          <div className="rail" ref={railRef} style={reduce ? { flexWrap: 'wrap', transform: 'none', paddingRight: 24 } : {}}>
            {PROJECTS.map((pr, i) => (
              <React.Fragment key={pr.hash}>
                <article className="pcard" ref={el => cardRefs.current[i] = el}>
                  <div className="p-hash">commit <em>{pr.hash}</em> — universe/{pr.name.toLowerCase()}</div>
                  <h3 className="p-name">{pr.name}</h3>
                  <div className={'p-status ' + pr.status}>{pr.statusLabel}</div>
                  <p className="p-desc">{pr.desc}</p>
                  <div className="p-dock" ref={el => dockRefs.current[i] = el}>
                    <div className="d-row">{pr.tags.map(tg => <span className="p-tag" key={tg}>{tg}</span>)}</div>
                    <div className="p-metric kr">▸ <b>{pr.metric}</b></div>
                    {pr.url && <a className="p-link" href={pr.url} target="_blank" rel="noopener">$ open {pr.link} ↗</a>}
                  </div>
                </article>
                {i < PROJECTS.length - 1 && <div className="branchline" aria-hidden="true" />}
              </React.Fragment>
            ))}
          </div>
        </div>
        {/* 조준창 프레임 — 빈 순간에도 콘셉트가 읽히도록 상시 렌더 */}
        <div className="aim-frame" aria-hidden="true"><i className="tl" /><i className="tr" /><i className="bl" /><i className="br" /></div>
        <div className="hint-aim" aria-hidden="true">◎ AIM WITH SCROLL</div>
      </div>
    </section>
  );
}

/* ========================================================================== */
/* 05 SERVICES — 마키 + 서비스 카드 + 스크럽 카운터                            */
/* ========================================================================== */
function Counter({ to, suffix, p, range }) {
  const ref = useRef(null);
  useMotionValueEvent(p, 'change', v => {
    if (!ref.current) return;
    const t = Math.max(0, Math.min(1, (v - range[0]) / (range[1] - range[0])));
    ref.current.textContent = Math.round(to * (1 - Math.pow(1 - t, 3)));
  });
  return <span ref={ref}>0</span>;
}

function Services({ reduce }) {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const mx1 = useTransform(p, [0, 1], ['2%', '-16%']);
  const mx2 = useTransform(p, [0, 1], ['-14%', '4%']);
  const fadeUp = { initial: reduce ? {} : { opacity: 0, y: 26 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } };

  return (
    <section className="services" id="svc" ref={ref} aria-label="서비스">
      <div className="wrap svc-head">
        <div className="h-cmd"><span className="cmd">$</span> cat ./services</div>
        <div className="h-sub kr">만드는 것, 배포하는 것, 나누는 것 — 세 개의 모듈</div>
      </div>
      <motion.div className="marquee" style={reduce ? {} : { x: mx1 }} aria-hidden="true">
        <span className="giant">Web Build — Global Ship — Teach &amp; Share — </span>
      </motion.div>
      <motion.div className="marquee m2" style={reduce ? {} : { x: mx2 }} aria-hidden="true">
        <span className="giant">React · Next · Vue · Nuxt · Node · 13 Languages — </span>
      </motion.div>
      <div className="wrap">
        <div className="svc-grid">
          {SERVICES.map((s, i) => (
            <motion.div className="svc" key={s.no} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.09 }}>
              <div className="s-no">[{s.no}]</div>
              <div className="s-name">{s.name}</div>
              <p className="s-desc">{s.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="counters">
          <div className="counter"><div className="c-num"><Counter to={14} p={p} range={[0.35, 0.7]} /><b>+</b></div><div className="c-label">Apps Shipped</div></div>
          <div className="counter"><div className="c-num"><Counter to={13} p={p} range={[0.38, 0.72]} /></div><div className="c-label">Languages</div></div>
          <div className="counter"><div className="c-num"><Counter to={28} p={p} range={[0.4, 0.74]} /></div><div className="c-label">Tech Stack</div></div>
          <div className="counter"><div className="c-num"><Counter to={12} p={p} range={[0.42, 0.76]} /></div><div className="c-label">Countries Next</div></div>
        </div>
      </div>
    </section>
  );
}

/* ========================================================================== */
/* 06 SSH — 피날레 (300vh 핀): 역-빅뱅 → build succeeded → 순백 반전 → 별자리  */
/* ========================================================================== */
const BUILD_LINE = '$ npm run deploy:universe  ...  build succeeded — 0 errors ✓';

function Finale({ reduce }) {
  const ref = useRef(null);
  const termRef = useRef(null);
  const giantRef = useRef(null);
  const paperRef = useRef(null);
  const pfRef = useRef(null);
  const constelRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const seg = (v, a, b) => Math.max(0, Math.min(1, (v - a) / (b - a)));
  const apply = useCallback(v => {
    FIELD.converge = reduce ? 0 : Math.max(0, Math.min(1, v / 0.55));
    if (termRef.current) {
      const t = seg(v, 0.4, 0.56);
      const n = Math.floor(t * BUILD_LINE.length);
      termRef.current.innerHTML = BUILD_LINE.slice(0, n).replace('✓', '<span class="ok">✓</span>') + (n > 0 && n < BUILD_LINE.length ? '▊' : '');
    }
    if (giantRef.current) {
      const g = giantRef.current;
      const glow = seg(v, 0.44, 0.56);
      g.style.opacity = seg(v, 0.3, 0.52);
      g.style.webkitTextStrokeColor = glow > 0.5 ? 'rgba(0,255,136,0.95)' : 'rgba(232,245,238,0.35)';
      g.style.textShadow = `0 0 ${glow * 46}px rgba(0,255,136,${glow * 0.55})`;
    }
    if (paperRef.current) paperRef.current.style.clipPath = `circle(${seg(v, 0.58, 0.8) * 142}% at 50% 58%)`;
    document.documentElement.classList.toggle('paper-on', seg(v, 0.58, 0.8) > 0.55);
    /* blur 스크럽은 정지 위치에 따라 CTA가 흐린 채 고착될 수 있어 제거 —
       clip-path 원형 확장 + opacity 크로스페이드만으로 전환 */
    if (pfRef.current) pfRef.current.style.opacity = seg(v, 0.62, 0.78);
    if (constelRef.current) constelRef.current.style.strokeDashoffset = 1 - seg(v, 0.82, 0.98);
  }, [reduce]);

  useMotionValueEvent(p, 'change', v => { if (!reduce) apply(v); });
  useEffect(() => {
    apply(reduce ? 1 : p.get());
    return () => { FIELD.converge = 0; };
  }, [apply, reduce]);

  const copyEmail = () => {
    const done = () => { setCopied(true); setTimeout(() => setCopied(false), 2200); };
    if (navigator.clipboard) navigator.clipboard.writeText(EMAIL).then(done).catch(done);
    else done();
  };

  const CONSTEL_PTS = [[10, 46], [58, 14], [116, 40], [178, 10], [236, 44], [290, 20]];
  const pathD = 'M' + CONSTEL_PTS.map(pt => pt.join(' ')).join(' L ');

  return (
    <section className="track" id="ssh" ref={ref} style={{ height: reduce ? 'auto' : '300vh' }} aria-label="연락하기">
      <div className="pin finale-inner">
        <div className="f-term" ref={termRef} aria-hidden="true">{reduce ? BUILD_LINE : ''}</div>
        <div className="f-giant" ref={giantRef} style={reduce ? { opacity: 1 } : { opacity: 0 }}>
          Contact
        </div>

        {/* 순백 반전면 — "빌드가 끝나면 라이트 모드로 배포된다" */}
        <div className="paper-face" ref={paperRef} style={reduce ? {} : { clipPath: 'circle(0% at 50% 58%)' }}>
          <div ref={pfRef} style={reduce ? {} : { opacity: 0 }}>
            <div className="pf-build">$ deploy — <span className="ok">build succeeded · 0 errors ✓</span></div>
            <h2 className="pf-title">Let's Build<br />The Next Orbit</h2>
            <p className="pf-sub kr">다음 궤도를 함께 설계할 사람을 찾습니다.<br />프로젝트, 협업, 강의 — 어떤 신호든 환영합니다.</p>
            <div className="pf-ctas">
              <button className="pf-btn primary" onClick={copyEmail}>{copied ? 'COPIED ✓' : 'COPY EMAIL — ' + EMAIL}</button>
              <a className="pf-btn" href={LINKS.github} target="_blank" rel="noopener">GITHUB</a>
              <a className="pf-btn" href={LINKS.linkedin} target="_blank" rel="noopener">LINKEDIN</a>
              <a className="pf-btn" href={LINKS.youtube} target="_blank" rel="noopener">YOUTUBE</a>
            </div>
            <div className="pf-status"><span className="dot" />status: open for collaboration — tokyo · seoul · remote</div>
            <div className="pf-constellation" aria-hidden="true">
              <svg width="300" height="56" viewBox="0 0 300 56" fill="none">
                <path d={pathD} stroke="#111512" strokeWidth="1.2" pathLength="1" ref={constelRef}
                  style={{ strokeDasharray: 1, strokeDashoffset: reduce ? 0 : 1 }} />
                {CONSTEL_PTS.map((pt, i) => <circle key={i} cx={pt[0]} cy={pt[1]} r="2.6" fill={i === CONSTEL_PTS.length - 1 ? '#00c46a' : '#111512'} />)}
              </svg>
              <div className="pf-caption">당신은 방금 한 사람의 우주를 컴파일했습니다 — 6 sections · 0 errors</div>
            </div>
          </div>
          <div className="pf-footer">
            © Y-SYSTEMS · BROODEV — YANG DONGHWA (@JSONTYPE) · <a href={LINKS.old} target="_blank" rel="noopener">OLD PORTFOLIO</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========================================================================== */
/* 커스텀 커서 — 도트는 즉발, 링은 lerp 추적 (pointer:fine 전용)               */
/* ========================================================================== */
function Cursor({ reduce }) {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  useEffect(() => {
    if (reduce || !window.matchMedia('(pointer: fine)').matches) return;
    document.documentElement.classList.add('cursor-on');
    let raf, mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    const onMove = e => {
      mx = e.clientX; my = e.clientY;
      if (dotRef.current) dotRef.current.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
      const hov = e.target.closest && e.target.closest('a, button, .pcard, .nav-logo');
      if (ringRef.current) ringRef.current.classList.toggle('hov', !!hov);
    };
    const loop = () => {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      document.documentElement.classList.remove('cursor-on');
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);
  if (reduce) return null;
  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  );
}

/* 마그네틱 버튼 — 커서를 향해 미세하게 끌려온다 */
function useMagnetic(reduce) {
  useEffect(() => {
    if (reduce || !window.matchMedia('(pointer: fine)').matches) return;
    const els = Array.from(document.querySelectorAll('.pf-btn, .nav-cta'));
    const hs = els.map(el => {
      const mv = e => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * 0.16}px, ${dy * 0.2}px)`;
      };
      const lv = () => { el.style.transform = ''; };
      el.addEventListener('mousemove', mv); el.addEventListener('mouseleave', lv);
      return { el, mv, lv };
    });
    return () => hs.forEach(h => { h.el.removeEventListener('mousemove', h.mv); h.el.removeEventListener('mouseleave', h.lv); });
  }, [reduce]);
}

/* ========================================================================== */
/* 루트                                                                        */
/* ========================================================================== */
function App() {
  const reduce = M ? useReducedMotion() : true;
  const [active, setActive] = useState('boot');
  FIELD.reduce = !!reduce;
  FIELD.mobile = window.innerWidth < 720;

  useMagnetic(reduce);
  useEffect(() => {
    if (reduce) document.documentElement.classList.add('static-mode');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-42% 0px -42% 0px' });
    CHAPTERS.forEach(([id]) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [reduce]);

  return (
    <>
      <GlyphField />
      <div className="glow-a" aria-hidden="true" />
      <div className="glow-b" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <Cursor reduce={reduce} />
      <BuildBar />
      <Hud active={active} />
      <main>
        <Boot reduce={reduce} />
        <Whoami reduce={reduce} />
        <Stack reduce={reduce} />
        <DeepLog reduce={reduce} />
        <Services reduce={reduce} />
        <Finale reduce={reduce} />
      </main>
    </>
  );
}

/* Motion 로드 실패 시: 콘텐츠만이라도 정적으로 완독 가능하게 */
function StaticApp() {
  return (
    <main className="wrap kr" style={{ padding: '80px 24px', maxWidth: 760 }}>
      <h1 style={{ fontFamily: 'var(--mono)' }}>&gt;_ Yang Donghwa — @jsontype</h1>
      <p style={{ whiteSpace: 'pre-wrap' }}>{WHOAMI_TEXT}</p>
      <h2>Projects</h2>
      {PROJECTS.map(pr => <p key={pr.hash}><b>{pr.name}</b> — {pr.desc} {pr.url && <a href={pr.url}>{pr.link}</a>}</p>)}
      <h2>Services</h2>
      {SERVICES.map(s => <p key={s.no}><b>{s.name}</b> — {s.desc}</p>)}
      <p><a href={'mailto:' + EMAIL}>{EMAIL}</a> · <a href={LINKS.github}>GitHub</a> · <a href={LINKS.youtube}>YouTube</a> · <a href={LINKS.linkedin}>LinkedIn</a></p>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(M ? <App /> : <StaticApp />);
