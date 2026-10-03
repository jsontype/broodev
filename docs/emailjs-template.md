# EmailJS 템플릿 `broodev_template` — 운영자 수신 메일 (2026-10-03)

연락 폼 3곳이 **같은** EmailJS 서비스 `broodev_service` · 템플릿 `broodev_template`(공개키 `u-DIwFmmMVFWrxJMX`) 으로 보내고, `jsontyper@gmail.com` 이 받는다.

| 폼 | 코드 | `kind`(출처) 값 |
|---|---|---|
| 포털 broodev.com | `apps/home/assets/js/portal.js` | `포털 (broodev.com)` |
| 개발자 소개 dev.broodev.com | `apps/dev/dev3/index.html` | `개발자 소개 (dev.broodev.com)` |
| voca 문의·버그 신고(`?app=` 로 다른 앱도) | `apps/voca/contact.html` | `voca (voca.broodev.com) · 버그 신고` 등 |

**메일의 제목·레이아웃은 EmailJS 대시보드의 템플릿이 정한다(레포 밖).** 코드는 변수만 보낸다. 이 문서가 템플릿의 정본이므로 바꿀 때는 대시보드와 이 파일을 같이 갱신한다.

## 1. 대시보드 설정 — Email Templates → `broodev_template`

**Settings 탭**

| 항목 | 값 |
|---|---|
| Subject | `{{subject}}` |
| From Name | `BROODEV 문의` |
| Reply To | `{{reply_to}}` (보낸 사람이 유효한 이메일을 남겼을 때만 값이 들어온다 — 비어 있으면 Reply-To 없음) |
| To Email | `jsontyper@gmail.com` |

**Content 탭** → `Edit Content` → 코드 편집(`</>`) → 기존 내용을 지우고 §3 의 HTML 전체를 붙여넣기 → Save.

## 2. 변수 (코드 → 템플릿)

| 변수 | 내용 | 예 |
|---|---|---|
| `subject` | `BROODEV에서 사용자 문의가 왔습니다. — <출처> · <이름>` — 뒤를 다르게 두는 이유: 제목이 완전히 같으면 Gmail 이 한 스레드로 묶어 새 문의가 묻힌다 | `BROODEV에서 사용자 문의가 왔습니다. — 포털 · 홍길동` |
| `kind` | 출처(앱 · 도메인 · voca 는 구분까지) | `voca (voca.broodev.com) · 버그 신고` |
| `name` | 이름 / `(무기명)` | `홍길동` |
| `email` | 회신 주소 / `(회신 주소 없음)` | `a@b.com` |
| `reply_to` | 유효한 이메일이면 그 값, 아니면 빈 문자열 | `a@b.com` |
| `message` | 문의 본문(줄바꿈 그대로) | |
| `page` | 보낸 페이지 URL | `https://broodev.com/#contact` |
| `time` | 접수 시각 JST | `2026. 10. 3. 16:29:05 (JST)` |
| `env` | OS · 브라우저 · 입력 방식 · 화면/창 크기 · 언어 | `Windows · Chrome 154 · 데스크톱 · 화면 1920×1080 · 창 1536×864 · ko-KR` |
| `ua` | 전체 User-Agent(작게 회색) | |
| `shots` | voca 스크린샷 링크(줄 단위) / `(없음)` | `스크린샷 1: https://…` |

`{{변수}}` 는 EmailJS 가 HTML 이스케이프하므로 본문에 태그를 넣어도 글자로만 나온다. `message` 는 `<pre>` 안에 두어 줄바꿈·공백이 그대로 보이고, 박스를 드래그하면 서식 없는 텍스트로 복사된다.

**Test It 예시**

```json
{ "subject": "BROODEV에서 사용자 문의가 왔습니다. — 포털 · 홍길동", "kind": "포털 (broodev.com)", "name": "홍길동", "email": "hong@example.com", "reply_to": "hong@example.com",
  "message": "안녕하세요.\n\n사진 12장을 올렸는데 3장이 빠집니다.\n- 파일명: 1.jpg ~ 12.jpg\n- 용지: A4 세로 2×3", "page": "https://broodev.com/#contact",
  "time": "2026. 10. 3. 16:29:05 (JST)", "env": "Windows · Chrome 154 · 데스크톱 · 화면 1920×1080 · 창 1536×864 · ko-KR",
  "ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36", "shots": "(없음)" }
```

## 3. Content HTML (전체 붙여넣기)

인라인 스타일만 사용(Gmail 이 `<style>` 을 자주 버린다). 폭 640px, 밝은 배경 — 헤더만 BROODEV 흑백.

```html
<div style="margin:0;padding:24px 12px;background:#f3f4f6;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Malgun Gothic','Apple SD Gothic Neo',Roboto,Helvetica,Arial,sans-serif;color:#111827;">
  <tr>
    <td style="padding:0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#000000;border-radius:10px 10px 0 0;">
        <tr>
          <td style="padding:15px 22px;color:#ffffff;font-size:15px;font-weight:700;letter-spacing:.6px;white-space:nowrap;">
            <span style="display:inline-block;width:4px;height:15px;background:#ffffff;vertical-align:-2px;margin-right:10px;"></span>BROODEV<span style="font-weight:400;color:#9ca3af;margin-left:10px;">사용자 문의</span>
          </td>
          <td align="right" style="padding:15px 22px;color:#9ca3af;font-size:12px;white-space:nowrap;">{{time}}</td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:16px 22px 4px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;line-height:1.55;">
        <tr><td width="88" style="padding:7px 0;color:#6b7280;vertical-align:top;white-space:nowrap;">출처</td><td style="padding:7px 0;font-weight:700;">{{kind}}</td></tr>
        <tr><td style="padding:7px 0;color:#6b7280;vertical-align:top;">보낸 사람</td><td style="padding:7px 0;">{{name}}</td></tr>
        <tr><td style="padding:7px 0;color:#6b7280;vertical-align:top;">이메일</td><td style="padding:7px 0;"><a href="mailto:{{email}}" style="color:#111827;">{{email}}</a></td></tr>
        <tr><td style="padding:7px 0;color:#6b7280;vertical-align:top;">페이지</td><td style="padding:7px 0;word-break:break-all;"><a href="{{page}}" style="color:#111827;">{{page}}</a></td></tr>
        <tr><td style="padding:7px 0;color:#6b7280;vertical-align:top;">환경</td><td style="padding:7px 0;">{{env}}<div style="margin-top:3px;font-size:11px;line-height:1.5;color:#9ca3af;word-break:break-all;">{{ua}}</div></td></tr>
        <tr><td style="padding:7px 0;color:#6b7280;vertical-align:top;">스크린샷</td><td style="padding:7px 0;white-space:pre-line;word-break:break-all;">{{shots}}</td></tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:14px 22px 22px;">
      <div style="font-size:12px;font-weight:700;color:#6b7280;letter-spacing:.6px;margin:0 0 8px;">문의 내용</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #d1d5db;border-radius:8px;background:#f9fafb;">
        <tr><td style="padding:7px 14px;border-bottom:1px solid #e5e7eb;font-family:Consolas,'Courier New',monospace;font-size:11px;color:#9ca3af;">message.txt — 박스를 드래그해서 복사</td></tr>
        <tr><td style="padding:14px 16px;"><pre style="margin:0;white-space:pre-wrap;word-wrap:break-word;font-family:Consolas,'Courier New',monospace;font-size:14px;line-height:1.65;color:#111827;">{{message}}</pre></td></tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:12px 22px;background:#f9fafb;border-top:1px solid #e5e7eb;border-radius:0 0 10px 10px;font-size:11px;line-height:1.5;color:#9ca3af;">
      broodev.com · dev.broodev.com · voca.broodev.com 연락 폼 → EmailJS. 보낸 사람이 이메일을 남겼으면 이 메일에 그대로 답장하면 됩니다(Reply-To).
    </td>
  </tr>
</table>
</div>
```

## 4. 참고

- EmailJS 무료 플랜 월 200통. 남용되면 대시보드에서 도메인 허용 목록(broodev.com · dev.broodev.com · voca.broodev.com)을 켠다.
- SDK 로드 실패(광고 차단기·오프라인) 시 세 폼 모두 `mailto:` 폴백 — 그 제목은 보내는 사람 시점(`[broodev.com] OO 님의 메시지` 등)으로 유지한다.
- 변수 이름을 바꾸면 세 폼의 코드와 이 템플릿을 같이 바꿔야 한다. 템플릿에 없는 변수는 무시되고, 코드가 안 보내는 변수는 빈칸으로 나온다.
