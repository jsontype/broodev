/* 라이선스 키 — 형식 BTC-XXXX-XXXX-XXXX-XXXX
   알파벳 32자(0/O/1/I 제외, 대문자) × 16자리 = 80bit 난수 → 추측·열거 불가. 사람이 받아 적기 쉽게 4자리 묶음.
   비교·조회는 normalizeKey() 로 정규화한 뒤(대문자·구분자 제거 → 다시 하이픈) 한다. */

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const KEY_PREFIX = 'BTC';
const BODY_LEN = 16;

export function newKey() {
  const buf = new Uint8Array(BODY_LEN);
  crypto.getRandomValues(buf);
  let body = '';
  for (let i = 0; i < BODY_LEN; i++) body += ALPHABET[buf[i] & 31];   // 32 = 2^5 → 편향 없음
  return KEY_PREFIX + '-' + body.match(/.{4}/g).join('-');
}

/* 입력 → 정규형. 소문자·공백·전각 하이픈·혼동 문자(0→O 가 아니라 알파벳에 없는 글자) 처리.
   형식이 맞지 않으면 null. */
export function normalizeKey(input) {
  let s = String(input || '').toUpperCase().replace(/[\s\u2010-\u2015\u2212\uFF0D_]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (!s) return null;
  if (s.indexOf(KEY_PREFIX + '-') === 0) s = s.slice(KEY_PREFIX.length + 1);
  const body = s.replace(/-/g, '');
  if (body.length !== BODY_LEN) return null;
  for (let i = 0; i < body.length; i++) if (ALPHABET.indexOf(body[i]) < 0) return null;
  return KEY_PREFIX + '-' + body.match(/.{4}/g).join('-');
}

export function isKey(s) { return normalizeKey(s) !== null; }
