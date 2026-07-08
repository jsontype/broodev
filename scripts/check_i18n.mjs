/**
 * i18n 번들 전수 검증 — 언어별 키 누락/여분 검사
 *   node scripts/check_i18n.mjs
 * 대상: voca(T·DOC_TITLE·seo-i18n·_middleware), voca-tutorial(T), contact.html(C), dev(i18n.js KO + i18n/<lang>.js)
 */
import { readFileSync, readdirSync } from 'node:fs'

const EXPECTED = ['en', 'ja', 'ko', 'zh', 'zh-Hant', 'th', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'nl']
let failures = 0

/* marker 뒤 첫 { 부터 균형 잡힌 객체 리터럴 텍스트 추출 (문자열/템플릿 내 중괄호 무시) */
function extractObject(src, marker) {
  const i = src.indexOf(marker)
  if (i < 0) throw new Error('마커 없음: ' + marker)
  const start = src.indexOf('{', i)
  let depth = 0, inStr = null, esc = false
  for (let j = start; j < src.length; j++) {
    const ch = src[j]
    if (esc) { esc = false; continue }
    if (ch === '\\') { esc = true; continue }
    if (inStr) { if (ch === inStr) inStr = null; continue }
    if (ch === "'" || ch === '"' || ch === '`') { inStr = ch; continue }
    if (ch === '{') depth++
    else if (ch === '}') { depth--; if (depth === 0) return src.slice(start, j + 1) }
  }
  throw new Error('중괄호 불균형: ' + marker)
}

const evalObj = (text) => new Function('return (' + text + ')')()

/* 중첩 키 경로 집합 (배열은 길이까지만 비교, 함수/문자열은 리프) */
function deepKeys(obj, prefix = '') {
  const out = []
  for (const k of Object.keys(obj)) {
    const v = obj[k], p = prefix ? prefix + '.' + k : k
    if (Array.isArray(v)) out.push(p + '[' + v.length + ']')
    else if (v && typeof v === 'object') out.push(...deepKeys(v, p))
    else out.push(p)
  }
  return out
}

function compareLangs(label, bundles, refLang = 'ko') {
  const langs = Object.keys(bundles)
  const missing = EXPECTED.filter((l) => !langs.includes(l))
  if (missing.length) { console.log(`✖ ${label}: 언어 자체 누락 → ${missing.join(', ')}`); failures++ }
  const ref = new Set(deepKeys(bundles[refLang] || bundles[langs[0]]))
  for (const l of langs) {
    if (l === refLang) continue
    const keys = new Set(deepKeys(bundles[l]))
    const miss = [...ref].filter((k) => !keys.has(k))
    const extra = [...keys].filter((k) => !ref.has(k))
    if (miss.length || extra.length) {
      failures++
      console.log(`✖ ${label} [${l}]` + (miss.length ? ` 누락: ${miss.join(', ')}` : '') + (extra.length ? ` 여분: ${extra.join(', ')}` : ''))
    }
  }
  console.log(`  ${label}: ${langs.length}개 언어, 기준 키 ${ref.size}개 검사 완료`)
}

/* ── voca ── */
{
  const src = readFileSync('apps/voca/index.html', 'utf8')
  compareLangs('voca T', evalObj(extractObject(src, 'const T = {')))
  const dt = evalObj(extractObject(src, 'const DOC_TITLE = {'))
  const miss = EXPECTED.filter((l) => !(l in dt))
  if (miss.length) { console.log(`✖ voca DOC_TITLE 누락: ${miss.join(', ')}`); failures++ } else console.log('  voca DOC_TITLE: 13개 언어 OK')
}
{
  const src = readFileSync('apps/voca/seo-i18n.js', 'utf8')
  compareLangs('voca seo-i18n', evalObj(extractObject(src, 'var SEO = {')))
}
{
  const src = readFileSync('apps/voca/functions/_middleware.js', 'utf8')
  const m = evalObj(extractObject(src, 'const M = {'))
  const miss = EXPECTED.filter((l) => l !== 'ko' && !(l in m)) // ko는 원본 HTML이 담당(설계)
  if (miss.length) { console.log(`✖ voca _middleware M 누락: ${miss.join(', ')}`); failures++ } else console.log('  voca _middleware M: 12개 언어 OK (ko=원본)')
}

/* ── voca-tutorial ── */
{
  const src = readFileSync('apps/voca-tutorial/index.html', 'utf8')
  compareLangs('voca-tutorial T', evalObj(extractObject(src, 'const T = {')))
}

/* ── contact.html ── */
{
  const src = readFileSync('apps/voca/contact.html', 'utf8')
  compareLangs('contact C', evalObj(extractObject(src, 'var C = {')))
}

/* ── dev 포털 ── */
{
  const core = readFileSync('apps/dev/i18n.js', 'utf8')
  const bundles = { ko: evalObj(extractObject(core, 'var KO = {')) }
  for (const f of readdirSync('apps/dev/i18n')) {
    const lang = f.replace(/\.js$/, '')
    const win = { __WEB: {} }
    new Function('window', readFileSync('apps/dev/i18n/' + f, 'utf8'))(win)
    bundles[lang] = win.__WEB[lang]
    if (!bundles[lang]) { console.log(`✖ dev i18n/${f}: window.__WEB['${lang}'] 등록 안 됨`); failures++ }
  }
  compareLangs('dev i18n', bundles)
}

console.log(failures ? `\n✖ 총 ${failures}건 문제 발견` : '\n✔ 전체 i18n 검증 통과')
process.exit(failures ? 1 : 0)
