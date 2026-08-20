// 사무라이 택틱스 2 검증 v2 (레포 보존판) — 문법·i18n 완전성·13언어 부팅·전투·튜토리얼 스모크
// node scripts/verify-st2.mjs
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const R = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const html = readFileSync(`${R}/apps/games/st2/index.html`, 'utf8')
const code = html.match(/<script>([^]*?)<\/script>/)[1]
let fail = 0
const ok = (n, c, x = '') => { console.log((c ? '  ✅ ' : '  ❌ ') + n + (x ? ' — ' + x : '')); if (!c) fail++ }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

try { new Function(code); ok('문법', true) } catch (e) { ok('문법', false, e.message); process.exit(1) }

function boot(search, navLang) {
  const noop = () => {}
  const mkEl = () => ({ dataset: {}, style: {}, set innerHTML(v) { this._h = v }, get innerHTML() { return this._h || '' }, querySelectorAll: () => [], onclick: null })
  const gameEl = mkEl()
  const document_ = { getElementById: (id) => (id === 'game' ? gameEl : null), addEventListener: noop, querySelectorAll: () => [] }
  const ls = { _m: {}, getItem(k) { return this._m[k] ?? null }, setItem(k, v) { this._m[k] = String(v) }, removeItem(k) { delete this._m[k] } }
  const location = { search, href: 'https://samurai.broodev.com/' + search, hash: '', hostname: 'samurai.broodev.com' }
  const f = new Function('document', 'window', 'localStorage', 'navigator', 'location',
    code + '; return { G: window.__ST2__, I18N: I18N, LANGS: LANGS, L: L, LANG: LANG };')
  const env = f(document_, { addEventListener: noop, location }, ls, { language: navLang || 'ko' }, location)
  return { ...env, gameEl, ls }
}

/* i18n 완전성 — 전 언어 팩이 ko와 같은 키 구조 */
const base = boot('', 'ko')
const keysOf = (o, p = '') => Object.keys(o).sort().flatMap((k) => {
  const v = o[k]
  if (Array.isArray(v)) return [p + k + '[' + v.length + ']']
  if (v && typeof v === 'object') return keysOf(v, p + k + '.')
  return [p + k]
})
const koKeys = keysOf(base.I18N.ko).join('|')
ok('언어 13종 등록', base.LANGS.length === 13 && Object.keys(base.I18N).length === 13, Object.keys(base.I18N).join(','))
for (const lc of base.LANGS) {
  const pk = base.I18N[lc]
  ok('팩 완전성 ' + lc, pk && keysOf(pk).join('|') === koKeys, pk ? '키 불일치' : '팩 없음')
}

/* 언어 감지 */
ok('감지: ?lang 우선', boot('?lang=ja', 'ko').LANG === 'ja')
ok('감지: 브라우저 언어', boot('', 'fr-FR').LANG === 'fr')
ok('감지: zh-TW → zh-Hant', boot('', 'zh-TW').LANG === 'zh-Hant')
ok('감지: 미지원 → en', boot('', 'sw-KE').LANG === 'en')

/* 13언어 부팅 + 타이틀 렌더 + 플레이스홀더 잔존 없음 */
for (const lc of base.LANGS) {
  const b = boot('?lang=' + lc, 'ko')
  const h = b.gameEl.innerHTML
  const okBoot = h.includes('big-btn') && h.includes(b.I18N[lc].diffN[0][0]) && !h.includes('{0}') && !/undefined|NaN/.test(h)
  ok('부팅 ' + lc, okBoot, okBoot ? '' : h.slice(0, 120))
}

/* 전투 스모크 (en — 주입 확인 겸) */
const en = boot('?lang=en', 'ko')
en.G.newRun()
await sleep(650)
let S = en.G.state()
ok('주입: 기술 이름 영어', S.tiles[0].name === en.I18N.en.tileN.seg, S.tiles[0].name)
ok('주입: 적 이름 영어', S.foes.every((f) => !/[가-힣]/.test(f.name)), JSON.stringify(S.foes.map((f) => f.name)))
S.p.pos = 2; S.p.dir = 1
S.foes.length = 0
S.foes.push({ id: 1, type: 'ronin', glyph: '浪', name: en.I18N.en.foeN.ronin, pos: 3, hp: 1, intent: null, cool: 9 })
S.foes.push({ id: 2, type: 'spear', glyph: '槍', name: en.I18N.en.foeN.spear, pos: 8, hp: 9, intent: null, cool: 9 })
S.tiles.forEach((t) => { t.cdLeft = 0 })
en.G.act('queue', 0)
ok('큐 로그 영어', en.G.state().log.includes('ready') || !/[가-힣]/.test(en.G.state().log), en.G.state().log)
en.G.act('strike')
S = en.G.state()
ok('전투: 격파 + 로그 영어(한글 잔존 없음)', S.foes.length === 1 && !/[가-힣]/.test(S.log), S.log)
ok('렌더 플레이스홀더 없음', !en.gameEl.innerHTML.includes('{0}') && !en.gameEl.innerHTML.includes('undefined'))

/* 전투 스모크 (ko) */
const ko = boot('?lang=ko', 'ko')
ko.G.newRun()
await sleep(650)
S = ko.G.state()
ok('ko 부팅·기술 한국어', S.tiles[0].name === '연속 베기')
S.p.pos = 2; S.p.dir = 1
S.foes.length = 0
S.foes.push({ id: 1, type: 'ronin', glyph: '浪', name: '낭인', pos: 3, hp: 1, intent: null, cool: 9 })
S.foes.push({ id: 2, type: 'spear', glyph: '槍', name: '창병', pos: 8, hp: 9, intent: null, cool: 9 })
S.tiles.forEach((t) => { t.cdLeft = 0 })
ko.G.act('queue', 0); ko.G.act('strike')
S = ko.G.state()
ok('ko 전투: 격파 로그', S.foes.length === 1 && S.log.includes('격파'), S.log)

/* 튜토리얼 스모크 (ja) */
const ja = boot('?lang=ja', 'ko')
ja.G.tut()
S = ja.G.state()
ok('튜토리얼 시작(ja)', S.tut && S.tut.step === 0 && ja.gameEl.innerHTML.includes('tut-bar'))
ja.G.act('move', 1); ja.G.act('flip'); ja.G.act('queue', 0); ja.G.act('queue', 1)
S = ja.G.state()
ok('튜토리얼 4단계 진행(ja)', S.tut.step === 4, 'step=' + S.tut.step)
ja.G.cycle(0); ja.G.act('strike')
S = ja.G.state()
ok('튜토리얼 완주(ja)', S.tut.step === 6 && !/[가-힣]/.test(ja.gameEl.innerHTML.match(/tut-bar">([^<]*)/)?.[1] || ''), 'step=' + S.tut.step)

/* 언어 선택기 */
ok('언어 선택기 렌더(13옵션)', (base.gameEl.innerHTML.match(/<option /g) || []).length === 13)

console.log(fail === 0 ? '\n전부 통과' : `\n실패 ${fail}건`)
process.exit(fail ? 1 : 0)
