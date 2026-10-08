// 사무라이 택틱스 2 검증 v2 (레포 보존판) — 문법·i18n 완전성·13언어 부팅·전투·튜토리얼 스모크
// node scripts/verify-st2.mjs
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const R = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const html = readFileSync(`${R}/games/samurai/index.html`, 'utf8')
const code = html.match(/<script>([^]*?)<\/script>/)[1]
let fail = 0
const ok = (n, c, x = '') => { console.log((c ? '  ✅ ' : '  ❌ ') + n + (x ? ' — ' + x : '')); if (!c) fail++ }
const fmt1 = (t, v) => String(t).split('{0}').join(v)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

try { new Function(code); ok('문법', true) } catch (e) { ok('문법', false, e.message); process.exit(1) }

function boot(search, navLang) {
  const noop = () => {}
  const mkEl = () => ({ dataset: {}, style: {}, set innerHTML(v) { this._h = v }, get innerHTML() { return this._h || '' }, querySelectorAll: () => [], onclick: null })
  const gameEl = mkEl()
  /* 헤더·푸터 고정 요소와 <head> 메타 — 부팅 IIFE 가 언어별로 덮어쓰는 값을 수집한다 */
  const chrome = { brandname: mkEl(), brandtag: mkEl(), footnote: mkEl(), devlink: mkEl() }
  for (const el of Object.values(chrome)) el.textContent = '사무라이 택틱스'
  const metas = {}
  for (const sel of ['meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[property="og:image:alt"]', 'meta[name="twitter:title"]'])
    metas[sel] = { content: '한글 원본', setAttribute(k, v) { if (k === 'content') this.content = v } }
  const document_ = {
    title: '사무라이 택틱스 2 — 턴제 검술 로그라이크 | broodev games',
    documentElement: { lang: 'ko' },
    getElementById: (id) => (id === 'game' ? gameEl : chrome[id] || null),
    querySelector: (sel) => metas[sel] || null,
    addEventListener: noop, querySelectorAll: () => [],
  }
  const ls = { _m: {}, getItem(k) { return this._m[k] ?? null }, setItem(k, v) { this._m[k] = String(v) }, removeItem(k) { delete this._m[k] } }
  const location = { search, href: 'https://samurai.broodev.com/' + search, hash: '', hostname: 'samurai.broodev.com' }
  const f = new Function('document', 'window', 'localStorage', 'navigator', 'location',
    code + '; return { G: window.__ST2__, I18N: I18N, LANGS: LANGS, L: L, LANG: LANG };')
  const env = f(document_, { addEventListener: noop, location }, ls, { language: navLang || 'ko' }, location)
  return { ...env, gameEl, ls, chrome, metas, doc: document_ }
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
  const same = pk && keysOf(pk).join('|') === koKeys
  ok('팩 완전성 ' + lc, same, same ? '' : pk ? '키 불일치' : '팩 없음')
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

/* 13언어 제목·푸터·document.title·<html lang>·메타 — ko 외 12언어에서 한글이 남지 않음 */
const HANGUL = /[가-힣]/
const EN_HUD = /\b(STAGE|WAVE|TURN|SCORE|BEST)\b/
for (const lc of base.LANGS) {
  const b = boot('?lang=' + lc, 'ko')
  const h = b.gameEl.innerHTML
  const h1 = (h.match(/<h1[^>]*>([^]*?)<\/h1>/) || [])[1] || ''
  const parts = {
    'h1': h1.replace(/<[^>]+>/g, ''),
    '.brand': b.chrome.brandname.textContent + ' ' + b.chrome.brandtag.textContent,
    '푸터 링크': b.chrome.devlink.textContent,
    '푸터 문구': b.chrome.footnote.textContent,
    'document.title': b.doc.title,
    'meta': Object.values(b.metas).map((m) => m.content).join(' | '),
    '시작 화면(언어 선택 자국어 이름 제외)': h.replace(/<select id="langsel"[^]*?<\/select>/, ''),
  }
  const expectLang = lc === 'zh' ? 'zh-Hans' : lc
  ok('<html lang> ' + lc, b.doc.documentElement.lang === expectLang, b.doc.documentElement.lang)
  const tFull = b.I18N[lc].title || '(title 키 없음)', tBase = tFull.replace(/\s*2$/, '')
  ok('제목 현지화 ' + lc, !!b.I18N[lc].title && h1.includes(tBase) && b.doc.title.startsWith(tFull) && b.chrome.brandname.textContent === tBase,
    h1 + ' / ' + b.doc.title)
  if (lc === 'ko') continue
  const bad = Object.entries(parts).filter(([, v]) => HANGUL.test(v) || /딜/.test(v)).map(([k, v]) => k + '«' + (v.match(/.{0,12}[가-힣]+.{0,12}/) || [''])[0] + '»')
  ok('제목·푸터·document.title·메타 한글 없음 ' + lc, bad.length === 0, bad.join(' · '))
  ok('시작 화면 영어 고정 라벨 없음 ' + lc, !EN_HUD.test(h) && (lc === 'en' || !/aria-label="Language"/.test(h)), (h.match(EN_HUD) || [''])[0])
}

/* 사전: 신규 키가 en 복붙이 아님 (게임 이름은 라틴 문자권 공통 'Samurai Tactics 2', fr/nl 'Score' 는 해당 언어 고유어) */
/* comboL: es·fr·de·it·pt·nl 은 각 팩 본문(튜토리얼·규칙·업적)이 이미 쓰는 외래어 'Combo' 와 일치시킨 값 */
const SAME_OK = { title: ['es', 'fr', 'de', 'it', 'pt', 'nl'], scoreL: ['fr', 'nl'], comboL: ['es', 'fr', 'de', 'it', 'pt', 'nl'] }
for (const k of ['title', 'desc', 'devLink', 'langLabel', 'dmgBadge', 'hud', 'scoreL', 'bestL', 'bestScore', 'kills', 'comboL', 'stShort']) {
  const norm = (v) => String(JSON.stringify(v)).toLowerCase()
  const dup = base.LANGS.filter((lc) => base.I18N[lc][k] == null || (lc !== 'en' && norm(base.I18N[lc][k]) === norm(base.I18N.en[k]) && !(SAME_OK[k] || []).includes(lc)))
  ok('사전 미번역 없음 ' + k, dup.length === 0, dup.join(','))
}

/* 13언어 전투 HUD·기술패 배지·콤보 라벨·종료 화면·리더보드 — 한글(ko 외)·영어 고정 라벨(STAGE/WAVE/TURN/SCORE/BEST/COMBO, 'S5' 약어) 없음 */
const EN_PLAY = /(STAGE|WAVE|TURN|SCORE|BEST)|>Sd+</
const runs = base.LANGS.map((lc) => {
  const b = boot('?lang=' + lc, 'ko')
  /* 미클리어 기록 1건을 심어 리더보드 '도달' 칸(스테이지 약어)이 렌더되게 한다 */
  b.ls.setItem('st2:board', JSON.stringify([{ s: 7, st: 3, k: 2, w: 0, d: '2026-01-01' }]))
  b.G.newRun(); return [lc, b]
})
await sleep(650)
for (const [lc, b] of runs) {
  const play = b.gameEl.innerHTML
  const st = b.G.state()
  st.over = true; st.lock = false
  b.G.hover(null)
  const end = b.gameEl.innerHTML
  const both = play + end
  const badH = lc !== 'ko' && HANGUL.test(both.replace(/<[^>]+>/g, ' '))
  const stCell = fmt1(b.I18N[lc].stShort, 3)
  ok('전투·종료 화면 ' + lc, !badH && !EN_PLAY.test(both) && (lc === 'en' || !/>COMBO</.test(play)) && play.includes('>' + b.I18N[lc].comboL + '<') && end.includes('>' + stCell + '<') && play.includes('t-dmg') && end.includes(b.I18N[lc].scoreL || '(scoreL 키 없음)') && !/undefined|NaN|\{\d\}/.test(both),
    badH ? (both.replace(/<[^>]+>/g, ' ').match(/.{0,15}[가-힣]+.{0,15}/) || [''])[0] : (both.match(EN_PLAY) || both.match(/>COMBO</) || ['도달 칸 ' + stCell + ' 없음'])[0])
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
