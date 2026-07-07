/**
 * voca 샘플 덱 매트릭스 CSV 검증기
 *   node scripts/validate_samples.mjs
 *
 * 검사 항목
 *   1. 헤더가 정확히 13개 언어 코드(en,ja,ko,zh,zh-Hant,th,es,fr,de,it,pt,ru,nl)인가
 *   2. 모든 행이 정확히 13셀이고 빈 셀이 없는가
 *   3. en 컬럼이 파일 내부 + 전체 파일 교차로 유일한가 (오류)
 *   4. 각 언어 컬럼 내부의 완전 중복 문자열 (경고 — 동철이의어는 허용)
 *   5. en 셀에 괄호 금지 (TTS가 괄호 안을 읽기 발음으로 오인 — ja 후리가나 전용)
 *   6. index.html의 TIERS/SAMPLE_DECKS가 참조하는 파일 존재 + count 일치 (오류)
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, 'apps', 'voca', 'samples');
const HEADER = ['en', 'ja', 'ko', 'zh', 'zh-Hant', 'th', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'nl'];

let errors = 0, warnings = 0;
const err = (m) => { errors++; console.error('  [오류] ' + m); };
const warn = (m) => { warnings++; console.warn('  [경고] ' + m); };

const globalEn = new Map(); // en 단어 → 파일명 (교차 중복 검출)
const counts = {};          // 파일명 → 데이터 행 수

for (const f of readdirSync(DIR).filter((x) => x.endsWith('.csv')).sort()) {
  console.log('▶ ' + f);
  const lines = readFileSync(join(DIR, f), 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/).filter((l) => l.trim());
  const header = lines[0].split(',').map((s) => s.trim());
  if (header.join('|') !== HEADER.join('|')) err(`헤더 불일치: ${lines[0]}`);

  const cols = HEADER.map(() => new Map());
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(',');
    if (cells.length !== HEADER.length) { err(`${i + 1}행: 셀 ${cells.length}개 (13개 필요) — ${lines[i].slice(0, 60)}`); continue; }
    cells.forEach((c, j) => {
      const v = c.trim();
      if (!v) { err(`${i + 1}행 ${HEADER[j]}: 빈 셀`); return; }
      if (j === 0 && /[()（）]/.test(v)) err(`${i + 1}행 en: 괄호 금지 — ${v}`);
      if (cols[j].has(v)) {
        const msg = `${HEADER[j]} 컬럼 중복 "${v}" (${cols[j].get(v)}행 ↔ ${i + 1}행)`;
        j === 0 ? err(msg) : warn(msg);
      } else cols[j].set(v, i + 1);
    });
    const en = cells[0].trim();
    if (en && globalEn.has(en) && globalEn.get(en) !== f) err(`en "${en}" 이 ${globalEn.get(en)} 와 교차 중복`);
    else if (en) globalEn.set(en, f);
  }
  counts[f] = lines.length - 1;
  console.log(`  행 수: ${counts[f]}`);
}

/* index.html 의 file/count 참조 검증 */
const html = readFileSync(join(ROOT, 'apps', 'voca', 'index.html'), 'utf8');
for (const m of html.matchAll(/file:\s*'samples\/([^']+)'\s*,\s*count:\s*(\d+)/g)) {
  const [, file, cnt] = m;
  if (!existsSync(join(DIR, file))) err(`index.html 참조 파일 없음: samples/${file}`);
  else if (counts[file] !== Number(cnt)) err(`count 불일치: samples/${file} 실제 ${counts[file]} ≠ 명시 ${cnt}`);
}

console.log(`\n합계 — 파일 ${Object.keys(counts).length}개 · 총 ${Object.values(counts).reduce((a, b) => a + b, 0)}행 · 오류 ${errors} · 경고 ${warnings}`);
process.exit(errors ? 1 : 0);
