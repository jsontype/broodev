// 업로드된 문의 스크린샷 서빙 — /api/shot/<id>
export async function onRequestGet({ params, env }) {
  if (!env.SHOTS || !/^[0-9a-f]{32}$/.test(params.id)) return new Response('Not found', { status: 404 });
  const v = await env.SHOTS.getWithMetadata('shot:' + params.id, { type: 'arrayBuffer' });
  if (!v || !v.value) return new Response('Not found', { status: 404 });
  return new Response(v.value, {
    headers: {
      'content-type': (v.metadata && v.metadata.ct) || 'image/jpeg',
      'cache-control': 'public, max-age=31536000, immutable',
    },
  });
}
