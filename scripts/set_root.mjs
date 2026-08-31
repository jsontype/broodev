// 루트 앱(broodev.com) 전환 도우미 — 자기참조 URL 만 바꾼다.
//
//   node scripts/set_root.mjs btc          # apps/btc 자기참조 https://btc.broodev.com → https://broodev.com (루트 승격)
//   node scripts/set_root.mjs voca --sub   # apps/voca 자기참조 https://broodev.com → https://voca.broodev.com (서브로 강등)
//
// 루트 앱을 바꾸는 절차(둘 다 필요):
//   1) 저장소: 새 루트 앱은 승격, 이전 루트 앱은 강등 → 커밋·푸시
//      (btc 를 루트로 쓰면 `python scripts/gen_coin.py all` 로 코인 14종도 재생성)
//   2) Cloudflare: broodev.com 을 서빙하는 Pages 프로젝트 → Settings → Build →
//      Root directory 를 apps/<새 루트 앱> 으로 변경 → 재배포
// 주의: 다른 앱이 이 앱을 가리키는 교차 링크(예: btc 의 voca contact 링크)는 여기서 안 건드린다.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const R = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const [app, mode] = process.argv.slice(2)
if (!app) { console.error('usage: node scripts/set_root.mjs <app> [--sub]'); process.exit(1) }
const dir = join(R, 'apps', app)
try { statSync(dir) } catch { console.error('앱 폴더 없음: ' + dir); process.exit(1) }

const [from, to] = mode === '--sub'
  ? ['https://broodev.com', `https://${app}.broodev.com`]
  : [`https://${app}.broodev.com`, 'https://broodev.com']

let n = 0
const walk = (d) => readdirSync(d).forEach((e) => {
  const fp = join(d, e)
  if (statSync(fp).isDirectory()) return walk(fp)
  if (!/\.(html|xml|txt|js)$/.test(fp)) return
  const s = readFileSync(fp, 'utf8'); const c = s.split(from).length - 1
  if (!c) return
  writeFileSync(fp, s.split(from).join(to)); n += c
  console.log('  ' + fp.slice(R.length + 1) + ' ×' + c)
})
walk(dir)
console.log(`${app}: ${from} → ${to} · ${n}건`)
console.log(mode === '--sub'
  ? `다음: 새 루트 앱을 승격하고, Cloudflare 루트 프로젝트 Root directory 를 바꾸세요.`
  : `다음: Cloudflare 루트 프로젝트 Root directory → apps/${app} 로 변경 후 재배포.` + (app === 'btc' ? ' 코인 재생성: python scripts/gen_coin.py all' : ''))
