#!/usr/bin/env node
// OG 공유 썸네일(1200×630 PNG) 생성기 — 카카오톡·LINE·X 미리보기용
//   node scripts/og/gen_og.mjs            # 전부
//   node scripts/og/gen_og.mjs utils dev3  # 일부
//   node scripts/og/gen_og.mjs --list
// 방식: 아래 SITES 설정 → 템플릿 HTML(renderHtml) → Edge/Chrome 헤드리스 --screenshot → <app>/og-image.png
// 외부 의존성 없음(설치된 Edge 또는 Chrome 필요). 폰트는 Google Fonts(Inter·JetBrains Mono) + 시스템 한글(Malgun Gothic) 폴백.
// 메타태그(og:image 등)는 각 앱 index.html 에 이미 들어 있고 URL 은 https://<domain>/og-image.png 로 고정이다.
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync, statSync, readFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';

const R = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const BROWSERS = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
];

// 테마 프리셋
const TERM = (bg, accent, glow = accent) => ({ bg, glow, accent, text: '#f2f7f4', dim: '#9fb3a8', font: 'mono', scan: true });

export const SITES = [
  // ── 홈 · 유틸 · 공사중 · 게임
  { id: 'utils', out: 'apps/utils/og-image.png', domain: 'utils.broodev.com',
    theme: { bg: '#0E0E14', glow: '#31F8A3', accent: '#31F8A3', text: '#FFFFFF', dim: '#A3A8B8', font: 'sans' },
    badge: 'Y SYSTEMS · UTILS', title: '사진 → <b>엑셀 · PPT</b><br>격자 배열',
    sub: 'Photos → Excel · PowerPoint grid — 용지 7종 · 세로/가로 · 가로×세로 1~5 · 브라우저에서만 처리',
    tags: ['XLSX', 'PPTX', 'A4 · A3 · B4 · Letter', 'ko · ja · en'], deco: 'grid' },
  // 포털(broodev.com 루트 · AIXOR 템플릿) — 2026-10-03 신설
  { id: 'home', out: 'apps/home/og-image.png', domain: 'broodev.com',
    theme: { bg: '#000000', glow: '#ffffff', accent: '#FFFFFF', text: '#FFFFFF', dim: '#999999', font: 'sans' },
    badge: 'BROODEV · APP PORTAL', titleSize: 170,
    title: '<i style="font-family:Georgia,\'Times New Roman\',serif;font-weight:400;font-style:italic;letter-spacing:-.03em">broo</i><b>dev</b><span style="color:#666">.</span>',
    sub: '쓸모 있는 웹앱 포털 — 코인 시그널 15 · 생활 인포패널 12 · 학습 · 업무 도구 · 게임 · 설치 없이, 13개 언어로',
    tags: ['33 apps', '6 categories', '13 languages', 'no install'], deco: 'none' }, // 앱 수는 apps/home/assets/js/catalog.js 와 맞출 것
  // 개발자 소개 사이트 3종 (2026-10-03 apps/home/home1~3 → apps/dev/dev1~3)
  { id: 'dev3', out: 'apps/dev/dev3/og-image.png', domain: 'dev.broodev.com',
    theme: { bg: '#000000', glow: '#07C42C', accent: '#07C42C', text: '#FFFFFF', dim: '#A6A6A6', font: 'sans' },
    badge: 'Y-SYSTEMS · PORTFOLIO', title: 'JSONTYPE<b>_</b>', titleSize: 150,
    sub: '양동화 (@jsontype) — Frontend · Full-cycle Engineer · Tokyo',
    tags: ['15 projects', '15 web apps', '13 languages', '10 developers trained'], deco: 'none' },
  { id: 'dev1', out: 'apps/dev/dev1/og-image.png', domain: 'dev.broodev.com/dev1/',
    theme: TERM('#050807', '#00ff88'),
    badge: '>_ COSMIC COMPILER', title: 'Yang Donghwa<br><b>@jsontype</b>',
    sub: '도쿄의 프론트엔드 개발자 · broodev 우주 — 15개 무료 웹앱 · 13개 언어 · 스크롤 = 엔터키',
    tags: ['React', '13 languages', 'Tokyo'], deco: 'ring', glyph: '>_' },
  { id: 'dev2', out: 'apps/dev/dev2/og-image.png', domain: 'dev.broodev.com/dev2/',
    theme: { bg: '#141414', glow: '#8a8a8a', accent: '#FFFFFF', text: '#FFFFFF', dim: '#B0B0B0', font: 'sans' },
    badge: 'Y-SYSTEMS · PORTFOLIO v2', title: '양동화 <b>(@jsontype)</b><br>업적 포트폴리오',
    sub: '핀테크·AI·에듀테크·리걸테크·통신 15건 · broodev 웹앱 15개 · 개발자 10명 배출',
    tags: ['Tokyo', 'Full-cycle', '2019 –'], deco: 'none' },
  { id: 'samurai', out: 'games/samurai/og-image.png', domain: 'samurai.broodev.com',
    theme: { bg: '#12100d', glow: '#c9432f', accent: '#d9a441', text: '#e8ddc8', dim: '#8f8474', font: 'sans' },
    badge: '⚔ BROODEV GAMES', title: '사무라이 택틱스 <b>2</b>',
    sub: '턴제 검술 로그라이크 — 기술패를 쌓고, 한 호흡에 발동한다. 적의 예고를 읽는 한 줄 전장 두뇌 싸움.',
    tags: ['턴제', '로그라이크', '한 줄 전장', '업적 30종'], deco: 'ring', glyph: '⚔' },
  // ── 생활 인포패널 12종 (각 앱의 팔레트)
  { id: 'africa', out: 'apps/africa/og-image.png', domain: 'africa.broodev.com', theme: TERM('#140f08', '#ffb648'),
    badge: '▎AFRICA DAILY UTILITY', title: 'Africa Daily <b>Utility</b>',
    sub: 'Load shedding · live FX & remittance cost · JAMB / WAEC / SASSA / NIN portals · verified USSD codes — one fast page',
    tags: ['power', 'money', 'status', 'USSD'], deco: 'ring', glyph: '🌍' },
  { id: 'bangladesh', out: 'apps/bangladesh/og-image.png', domain: 'bangladesh.broodev.com', theme: TERM('#06150e', '#7de8a8', '#f42a41'),
    badge: '▎BANGLA PANEL', title: 'Bangla <b>Panel</b>',
    sub: 'Cyclone signals 1–11 in plain language · FFWC flood levels · load-shedding · live taka rates · SSC/HSC results',
    tags: ['pani', 'bidyut', 'taka', 'results'], deco: 'ring', glyph: '🌊' },
  { id: 'caribbean', out: 'apps/caribbean/og-image.png', domain: 'caribbean.broodev.com', theme: TERM('#04191c', '#4dd8c0', '#ff7f66'),
    badge: '▎CARIB PANEL', title: 'Carib <b>Panel</b>',
    sub: 'Hurricane playbooks · outage links · live JMD / TTD / BBD / BSD rates · remittance true cost · official portals',
    tags: ['storm', 'power', 'money', 'status'], deco: 'ring', glyph: '🌀' },
  { id: 'greenland', out: 'apps/greenland/og-image.png', domain: 'greenland.broodev.com', theme: TERM('#06101c', '#7fd8ff', '#4ce0a0'),
    badge: '▎NUNATTA PAASISSUTISSAI', title: 'Grønland <b>infopanel</b>',
    sub: 'Vejr · hav · tidevand · flyvejr · fangstlog — alt i ét panel, by for by',
    tags: ['vejr', 'hav', 'transport', 'fangst'], deco: 'ring', glyph: '❄' },
  { id: 'mongolia', out: 'apps/mongolia/og-image.png', domain: 'mongolia.broodev.com', theme: TERM('#0a0f1c', '#4a9fe8', '#f2c14e'),
    badge: '▎MONGOL PANEL', title: 'Mongol <b>Panel</b>',
    sub: 'Ulaanbaatar PM2.5 by district · weather & wind chill · USD/MNT · herder livestock log · dzud & IBLI guides',
    tags: ['agaar', 'tsag', 'tugrug', 'mal'], deco: 'ring', glyph: '🐎' },
  { id: 'nepal', out: 'apps/nepal/og-image.png', domain: 'nepal.broodev.com', theme: TERM('#140608', '#e8455f', '#5b9bd5'),
    badge: '▎NEPAL PANEL', title: 'Nepal <b>Panel</b>',
    sub: 'Bikram Sambat converter · live NPR rates · remittance true cost · mountain weather · earthquake feed · official portals',
    tags: ['patro', 'paisa', 'mausam', 'results'], deco: 'ring', glyph: '🏔' },
  { id: 'nunavut', out: 'apps/nunavut/og-image.png', domain: 'nunavut.broodev.com', theme: TERM('#12100a', '#f0b429', '#d5442e'),
    badge: '▎ᓄᓇᕗᑦ NUNAVUT PANEL', title: 'Nunavut <b>Panel</b>',
    sub: 'Weather · wind chill · aurora · sealift · hunting · Inuktitut — one panel for 10 Nunavut communities',
    tags: ['sila', 'travel', 'hunt', 'language'], deco: 'ring', glyph: '🧊' },
  { id: 'pacific', out: 'apps/pacific/og-image.png', domain: 'pacific.broodev.com', theme: TERM('#031525', '#6fe3c1', '#ff8a70'),
    badge: '▎PACIFIC PANEL', title: 'Pacific <b>Panel</b>',
    sub: 'Cyclone season status · live waves & tides · FJD / WST / TOP / VUV rates · remittance cost · PALM / RSE seasonal work',
    tags: ['cyclone', 'ocean', 'money', 'work'], deco: 'ring', glyph: '🌴' },
  { id: 'pakistan', out: 'apps/pakistan/og-image.png', domain: 'pakistan.broodev.com', theme: TERM('#07130b', '#37d67a', '#ffd166'),
    badge: '▎PAK PANEL', title: 'Pakistan Daily <b>Utility</b>',
    sub: 'Load-shedding · live PKR rates · board results · NADRA fees · verified USSD codes — English & Urdu',
    tags: ['bijli', 'paisa', 'results', 'USSD'], deco: 'ring', glyph: '⚡' },
  { id: 'philippines', out: 'apps/philippines/og-image.png', domain: 'philippines.broodev.com', theme: TERM('#0a1220', '#ffd54a', '#6db9ff'),
    badge: '▎PINAS PANEL', title: 'Pinas <b>Panel</b>',
    sub: 'Wind Signal #1–#5 action guides · live USD/PHP & remittance cost · SSS / PhilHealth / Pag-IBIG · Meralco outages',
    tags: ['bagyo', 'pera', 'status', 'brownout'], deco: 'ring', glyph: '☀' },
  { id: 'srilanka', out: 'apps/srilanka/og-image.png', domain: 'srilanka.broodev.com', theme: TERM('#1a0a0c', '#f2c14e', '#58c98a'),
    badge: '▎LANKA PANEL', title: 'Lanka <b>Panel</b>',
    sub: 'CEB power-cut groups · railway lines & booking · live LKR rates · A/L Z-score explained · NIC & passport links',
    tags: ['power', 'train', 'rupee', 'results'], deco: 'ring', glyph: '🚂' },
  { id: 'stans', out: 'apps/stans/og-image.png', domain: 'stans.broodev.com', theme: TERM('#0a1420', '#e8b64c', '#7fc4ff'),
    badge: '▎STAN PANEL', title: 'Stan <b>Panel</b>',
    sub: 'Узбекистан · Кыргызстан · Таджикистан — деньги, документы, свет и USSD в одной панели',
    tags: ['деньги', 'документы', 'свет', 'USSD'], deco: 'ring', glyph: '🏜' },
];

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

export function renderHtml(c) {
  const t = c.theme;
  const sans = "'Inter', 'Segoe UI', 'Malgun Gothic', 'Yu Gothic UI', 'Meiryo', 'Segoe UI Emoji', sans-serif";
  const mono = "'JetBrains Mono', 'Consolas', 'Malgun Gothic', 'Yu Gothic UI', 'Segoe UI Emoji', monospace";
  const font = t.font === 'mono' ? mono : sans;
  const titleSize = c.titleSize || 76;
  const deco = c.deco === 'ring'
    ? `<div class="ring"><span class="glyph">${c.glyph || ''}</span></div>`
    : c.deco === 'grid'
      ? `<svg class="gridsvg" viewBox="0 0 300 400" fill="none"><rect x="6" y="6" width="288" height="388" rx="18" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.18)" stroke-width="2"/>${[0, 1].flatMap(cx => [0, 1, 2].map(ry => `<rect x="${26 + cx * 132}" y="${26 + ry * 118}" width="116" height="102" rx="10" fill="${t.accent}" fill-opacity="${0.14 + ((cx + ry) % 2) * 0.1}" stroke="${t.accent}" stroke-opacity=".7" stroke-width="2"/><path d="M${40 + cx * 132} ${110 + ry * 118} l26 -30 l20 22 l16 -14 l30 32 z" fill="${t.accent}" fill-opacity=".55"/><circle cx="${118 + cx * 132}" cy="${50 + ry * 118}" r="8" fill="${t.accent}" fill-opacity=".7"/>`)).join('')}</svg>`
      : '';
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&family=JetBrains+Mono:wght@400;700;800&display=swap');
*{margin:0;box-sizing:border-box}
html,body{width:1200px;height:630px;overflow:hidden}
body{background:${t.bg};color:${t.text};font-family:${font};position:relative}
.glow{position:absolute;inset:0;background:radial-gradient(760px 520px at 78% 50%, ${t.glow}26 0%, transparent 62%),radial-gradient(900px 600px at 10% 100%, ${t.glow}14 0%, transparent 55%)}
.wrap{position:absolute;inset:0;padding:64px 72px;display:flex;flex-direction:column;justify-content:center;max-width:${c.deco === 'none' ? 1200 : 860}px}
.badge{display:inline-flex;align-items:center;gap:10px;font-family:${mono};font-size:22px;font-weight:700;letter-spacing:1px;color:${t.accent};border:1px solid ${t.accent}66;border-radius:8px;padding:8px 16px;width:max-content;text-shadow:0 0 12px ${t.accent}66}
.title{font-size:${titleSize}px;font-weight:800;line-height:1.08;margin-top:28px;letter-spacing:-.01em;word-break:keep-all}
.title b{color:${t.accent};text-shadow:0 0 26px ${t.accent}55}
.sub{font-size:27px;line-height:1.4;color:${t.dim};margin-top:22px;word-break:keep-all}
.tags{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px;font-family:${mono};font-size:18px;color:${t.dim}}
.tag{border:1px solid ${t.accent}40;border-radius:6px;padding:5px 12px;white-space:nowrap}
.ring{position:absolute;right:84px;top:50%;transform:translateY(-50%);width:270px;height:270px;border-radius:50%;border:7px solid ${t.accent};box-shadow:0 0 36px ${t.accent}66, inset 0 0 36px ${t.accent}22;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.25)}
.ring::before{content:'';position:absolute;inset:-22px;border-radius:50%;border:1px solid ${t.accent}33}
.glyph{font-size:118px;line-height:1;color:${t.accent};font-family:${mono};font-weight:800;text-shadow:0 0 18px ${t.accent}88}
.gridsvg{position:absolute;right:88px;top:50%;transform:translateY(-50%);width:240px;height:320px;filter:drop-shadow(0 0 22px ${t.accent}44)}
.domain{position:absolute;right:72px;bottom:40px;font-family:${mono};font-size:20px;color:${t.dim};letter-spacing:.5px}
.scan{position:absolute;inset:0;background:repeating-linear-gradient(to bottom,transparent 0 3px,rgba(0,0,0,.16) 4px,transparent 5px);pointer-events:none}
</style></head><body>
<div class="glow"></div>
<div class="wrap">
  <div class="badge">${esc(c.badge)}</div>
  <div class="title">${c.title}</div>
  <div class="sub">${esc(c.sub)}</div>
  <div class="tags">${(c.tags || []).map(x => `<span class="tag">${esc(x)}</span>`).join('')}</div>
</div>
${deco}
<div class="domain">${esc(c.domain)}</div>
${t.scan ? '<div class="scan"></div>' : ''}
</body></html>`;
}

function findBrowser() { return BROWSERS.find(p => existsSync(p)); }

export function generate(ids) {
  const browser = findBrowser();
  if (!browser) throw new Error('Edge/Chrome 을 찾지 못했습니다: ' + BROWSERS.join(' | '));
  const tmp = join(tmpdir(), 'broodev-og'); mkdirSync(tmp, { recursive: true });
  const list = ids && ids.length ? SITES.filter(s => ids.includes(s.id)) : SITES;
  const unknown = (ids || []).filter(id => !SITES.some(s => s.id === id));
  if (unknown.length) throw new Error('모르는 id: ' + unknown.join(', '));
  const results = [];
  for (const c of list) {
    const html = join(tmp, c.id + '.html'), out = resolve(R, c.out);
    writeFileSync(html, renderHtml(c));
    mkdirSync(dirname(out), { recursive: true });
    const r = spawnSync(browser, [
      '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--mute-audio',
      `--user-data-dir=${join(tmp, 'profile')}`, '--window-size=1200,630', '--force-device-scale-factor=1',
      '--virtual-time-budget=6000', '--run-all-compositor-stages-before-draw',
      `--screenshot=${out}`, pathToFileURL(html).href,
    ], { stdio: 'ignore', timeout: 60000 });
    const ok = existsSync(out) && statSync(out).size > 8000;
    const png = ok ? readFileSync(out) : null;
    const dims = png ? `${png.readUInt32BE(16)}x${png.readUInt32BE(20)}` : '-';
    results.push({ id: c.id, out: c.out, ok, bytes: ok ? statSync(out).size : 0, dims });
    console.log((ok ? 'ok   ' : 'FAIL ') + c.id.padEnd(12) + c.out.padEnd(36) + dims.padEnd(10) + (ok ? statSync(out).size + ' B' : 'status ' + r.status));
  }
  return results;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.includes('--list')) { SITES.forEach(s => console.log(s.id.padEnd(12), s.out.padEnd(36), s.domain)); process.exit(0); }
  const res = generate(args);
  if (res.some(r => !r.ok)) process.exit(1);
}
