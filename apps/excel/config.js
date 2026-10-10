/* SHEET 운영 설정 — 비밀값이 아니다(OAuth 웹 클라이언트 ID 는 공개되어도 안전).
   GOOGLE_CLIENT_ID 가 빈 값이면 「Google 동기화 — 준비 중」 버튼만 보이고, 로컬 자동 저장만 동작한다.
   켜는 방법(README.md 「Google 동기화 설정」):
     1) Google Cloud 콘솔 → 새 프로젝트 → 「API 및 서비스 → 라이브러리」에서 Google Drive API 사용 설정
     2) 「OAuth 동의 화면」 구성(범위: .../auth/drive.appdata 하나만)
     3) 「사용자 인증 정보 → OAuth 클라이언트 ID → 웹 애플리케이션」, 승인된 JavaScript 원본에 https://excel.broodev.com
     4) 발급된 클라이언트 ID(…apps.googleusercontent.com)를 아래에 넣고 배포 */
var GOOGLE_CLIENT_ID = '';
