// Pages Functions 실행 검증 — _middleware.js(noindex) + shot.js(Turnstile)
const repo = new URL('..', import.meta.url).href.replace(/\/$/, '');
let fail = 0;
const ok = (name, cond, extra = '') => {
  console.log((cond ? '  ✅ ' : '  ❌ ') + name + (extra ? ' — ' + extra : ''));
  if (!cond) fail++;
};

// HTMLRewriter 스텁 (lang 변환 경로 확인용 — 원본 res 를 그대로 통과시킴)
globalThis.HTMLRewriter = class {
  on() { return this; }
  transform(res) { return new Response('[transformed]', res); }
};

const htmlRes = () => new Response('<html>x</html>', { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } });

for (const app of ['btc', 'voca']) {
  console.log(`\n=== ${app}/_middleware.js ===`);
  const { onRequest } = await import(`${repo}/apps/${app}/functions/_middleware.js`);

  // 1) 커스텀 도메인 → 헤더 없음
  let res = await onRequest({ request: new Request('https://broodev.com/'), next: async () => htmlRes() });
  ok('custom domain: no X-Robots-Tag', res.headers.get('x-robots-tag') === null);

  // 2) pages.dev → noindex
  res = await onRequest({ request: new Request('https://broodev-web.pages.dev/about'), next: async () => htmlRes() });
  ok('pages.dev: X-Robots-Tag=noindex,nofollow', res.headers.get('x-robots-tag') === 'noindex, nofollow');
  ok('pages.dev: status preserved', res.status === 200);
  ok('pages.dev: content-type preserved', (res.headers.get('content-type') || '').includes('text/html'));

  // 3) pages.dev + 프리뷰 해시 서브도메인
  res = await onRequest({ request: new Request('https://abc123.broodev-web.pages.dev/x.png'), next: async () => new Response('img', { headers: { 'content-type': 'image/png' } }) });
  ok('preview hash subdomain + non-HTML: noindex', res.headers.get('x-robots-tag') === 'noindex, nofollow');

  // 4) ?lang=en 변환 경로도 여전히 동작 + pages.dev 헤더 결합
  res = await onRequest({ request: new Request('https://broodev-web.pages.dev/?lang=en'), next: async () => htmlRes() });
  const body = await res.text();
  ok('lang rewrite still runs', body === '[transformed]');
  ok('lang rewrite + noindex both applied', res.headers.get('x-robots-tag') === 'noindex, nofollow');

  // 5) 커스텀 도메인 + lang 변환 → 헤더 없음
  res = await onRequest({ request: new Request('https://broodev.com/?lang=ja'), next: async () => htmlRes() });
  ok('custom domain + lang: no header', res.headers.get('x-robots-tag') === null);
}

console.log('\n=== voca/functions/api/shot.js ===');
const { onRequestPost } = await import(`${repo}/apps/voca/functions/api/shot.js`);

const kv = { store: new Map(), async put(k, v, o) { this.store.set(k, { v, o }); } };
const mkReq = (headers, body = new Uint8Array([1, 2, 3]).buffer) =>
  new Request('https://voca.broodev.com/api/shot', { method: 'POST', headers, body });
const baseHeaders = { origin: 'https://voca.broodev.com', 'content-type': 'image/png' };

// 1) 시크릿 미설정 → 기존 동작 (origin OK → 업로드 성공)
let r = await onRequestPost({ request: mkReq(baseHeaders), env: { SHOTS: kv } });
let j = await r.json();
ok('no secret: upload works (200 + url)', r.status === 200 && !!j.url, JSON.stringify(j));

// 2) 시크릿 미설정 + 위조 origin → 403 (기존 방어 유지)
r = await onRequestPost({ request: mkReq({ origin: 'https://evil.com', 'content-type': 'image/png' }), env: { SHOTS: kv } });
ok('no secret + bad origin: 403', r.status === 403);

// 3) 시크릿 설정 + 토큰 없음 → 403 turnstile-required
r = await onRequestPost({ request: mkReq(baseHeaders), env: { SHOTS: kv, TURNSTILE_SECRET: 's3cret' } });
j = await r.json();
ok('secret + no token: 403 turnstile-required', r.status === 403 && j.error === 'turnstile-required', JSON.stringify(j));

// 4) 시크릿 설정 + 토큰 → siteverify 호출 (fetch 모킹)
let verifyCalled = null;
const realFetch = globalThis.fetch;
globalThis.fetch = async (url, opts) => {
  verifyCalled = { url: String(url), secret: opts.body.get('secret'), response: opts.body.get('response'), remoteip: opts.body.get('remoteip') };
  return new Response(JSON.stringify({ success: verifyCalled.response === 'good-token' }), { headers: { 'content-type': 'application/json' } });
};

r = await onRequestPost({ request: mkReq({ ...baseHeaders, 'x-turnstile-token': 'good-token', 'cf-connecting-ip': '1.2.3.4' }), env: { SHOTS: kv, TURNSTILE_SECRET: 's3cret' } });
j = await r.json();
ok('secret + valid token: 200 + url', r.status === 200 && !!j.url, JSON.stringify(j));
ok('siteverify called with secret/response/remoteip',
  verifyCalled && verifyCalled.url.includes('challenges.cloudflare.com/turnstile/v0/siteverify')
  && verifyCalled.secret === 's3cret' && verifyCalled.response === 'good-token' && verifyCalled.remoteip === '1.2.3.4');

// 5) 시크릿 설정 + 나쁜 토큰 → 403 turnstile-failed
r = await onRequestPost({ request: mkReq({ ...baseHeaders, 'x-turnstile-token': 'bad-token' }), env: { SHOTS: kv, TURNSTILE_SECRET: 's3cret' } });
j = await r.json();
ok('secret + bad token: 403 turnstile-failed', r.status === 403 && j.error === 'turnstile-failed', JSON.stringify(j));

// 6) siteverify 네트워크 실패 → 403 (fail-closed)
globalThis.fetch = async () => { throw new Error('network down'); };
r = await onRequestPost({ request: mkReq({ ...baseHeaders, 'x-turnstile-token': 'tok' }), env: { SHOTS: kv, TURNSTILE_SECRET: 's3cret' } });
ok('siteverify network error: fail-closed 403', r.status === 403);
globalThis.fetch = realFetch;

console.log(fail === 0 ? '\n전부 통과' : `\n실패 ${fail}건`);
process.exit(fail === 0 ? 0 : 1);
