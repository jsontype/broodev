// 브라우저와 동일한 조건(classic JSX runtime)으로 앱을 실제 실행해
// 런타임 에러(TDZ/ReferenceError 등)를 잡는다.
// ※ Babel 이 "컴파일 OK" 라고 해도 런타임에 죽으면 #root 가 비어 화면이 백지가 된다.
let B;
try { B = require('@babel/standalone'); }
catch { console.error('필요한 의존성이 없습니다. 레포 루트에서 1회 실행: npm i --no-save @babel/standalone'); process.exit(2); }
const fs = require('fs');
const R = require('path').resolve(__dirname, '..');

const noop = () => {};
const stubEl = () => ({ setAttribute: noop, appendChild: noop, style: {}, replaceWith: noop, textContent: '', className: '' });

function run(app, search) {
  const html = fs.readFileSync(`${R}/apps/${app}/index.html`, 'utf8');
  const m = html.match(/<script type="text\/babel"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) return { ok: true, note: 'babel 스크립트 없음' };

  const code = B.transform(m[1], { presets: [['react', { runtime: 'classic' }]] }).code;

  const React = {
    createElement: (...a) => ({ type: a[0] }), Fragment: 'F',
    useState: (v) => [typeof v === 'function' ? v() : v, noop],
    useEffect: noop, useRef: (v) => ({ current: v }), useMemo: (f) => f(),
    useCallback: (f) => f, useContext: () => ({}), createContext: () => ({ Provider: noop }),
  };
  const document = {
    getElementById: () => stubEl(), querySelector: () => null, querySelectorAll: () => [],
    createElement: stubEl, createTreeWalker: () => ({ nextNode: () => null }),
    head: { appendChild: noop }, addEventListener: noop, documentElement: {}, title: '',
  };
  const localStorage = { getItem: () => null, setItem: noop, removeItem: noop };
  const location = { search, href: 'https://broodev.com/' + search, hash: '' };

  try {
    const f = new Function(
      'React', 'ReactDOM', 'document', 'window', 'location', 'localStorage', 'navigator',
      'fetch', 'URLSearchParams', 'NodeFilter', 'setTimeout', 'setInterval', 'clearInterval',
      'clearTimeout', 'requestAnimationFrame', 'AbortController', code
    );
    f(React, { createRoot: () => ({ render: noop }) }, document,
      { addEventListener: noop, location, localStorage, matchMedia: () => ({ matches: false, addEventListener: noop }), scrollTo: noop },
      location, localStorage, { language: 'ko' },
      () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }),
      URLSearchParams, { SHOW_TEXT: 4 }, noop, noop, noop, noop, noop,
      function () { return { signal: {}, abort: noop }; });
    return { ok: true };
  } catch (e) {
    return { ok: false, err: `${e.name}: ${e.message}` };
  }
}

let bad = 0;
const cases = [
  ['btc', ''], ['btc', '?coin=eth'], ['btc', '?coin=pepe'], ['btc', '?coin=BOGUS'],
  ['voca', ''],
];
for (const [app, search] of cases) {
  const r = run(app, search);
  const label = `${app}${search || ' (기본)'}`;
  if (r.ok) console.log(`  ✅ ${label.padEnd(20)} 실행 OK${r.note ? ' — ' + r.note : ''}`);
  else { bad = 1; console.log(`  ❌ ${label.padEnd(20)} ${r.err}`); }
}
process.exit(bad);
