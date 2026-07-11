// 문의 폼 스크린샷 업로드 (Cloudflare Pages Function + KV)
// EmailJS 무료 플랜은 첨부 미지원·요청 50KB 제한이고, Gmail은 본문 내 base64
// 이미지를 제거하므로 — 이미지를 KV에 올리고 메일엔 https 링크만 넣는다.
// 필요 설정: Pages 프로젝트에 KV 네임스페이스를 "SHOTS" 이름으로 바인딩.

const MAX_BYTES = 2 * 1024 * 1024; // 2MB
const TTL_SEC = 60 * 60 * 24 * 90; // 90일 후 자동 삭제

const json = (obj, status) =>
  new Response(JSON.stringify(obj), { status: status || 200, headers: { 'content-type': 'application/json' } });

export async function onRequestPost({ request, env }) {
  if (!env.SHOTS) return json({ error: 'kv-not-bound' }, 500);

  // 최소한의 도용 방지 — 우리 도메인(또는 로컬 개발)에서 온 요청만
  const ref = request.headers.get('origin') || request.headers.get('referer') || '';
  if (!/broodev\.com|localhost|127\.0\.0\.1/.test(ref)) return json({ error: 'forbidden' }, 403);

  const ct = request.headers.get('content-type') || '';
  if (!/^image\/(png|jpeg|webp|gif)$/.test(ct)) return json({ error: 'unsupported-type' }, 415);

  const buf = await request.arrayBuffer();
  if (buf.byteLength === 0 || buf.byteLength > MAX_BYTES) return json({ error: 'bad-size' }, 413);

  const id = crypto.randomUUID().replace(/-/g, '');
  await env.SHOTS.put('shot:' + id, buf, { expirationTtl: TTL_SEC, metadata: { ct } });
  return json({ url: new URL('/api/shot/' + id, request.url).href });
}
