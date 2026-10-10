/* =============================================================================
   memo · config.js — 운영자 설정
   GOOGLE_CLIENT_ID: Google Cloud 콘솔 → API 및 서비스 → 사용자 인증 정보 → OAuth 클라이언트 ID(웹 애플리케이션)
     · 승인된 JavaScript 원본: https://memo.broodev.com
     · Google Drive API 사용 설정 · OAuth 동의 화면 범위: .../auth/drive.appdata
   빈 값('')이면 「Google 동기화 — 준비 중」 버튼이 비활성으로 보이고, 메모는 이 브라우저에만 저장된다.
   (클라이언트 ID 는 공개돼도 되는 값 — 비밀 키가 아니다. 자세한 단계는 README.md)
   ========================================================================== */
window.MEMO_CONFIG = {
  GOOGLE_CLIENT_ID: ''
};
