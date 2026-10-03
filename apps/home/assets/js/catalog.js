/* broodev 포털 — 앱 카탈로그 (단일 진실 공급원)
   - 새 앱을 만들면 여기에 한 줄 추가한다. 카테고리는 CATEGORIES 순서대로 모달·카테고리 섹션·푸터에 나온다.
   - 모달은 카테고리당 5개씩 페이지네이션(portal.js PER_PAGE). 100개가 넘어도 구조는 그대로.
   - url 은 반드시 절대 URL(서브도메인). status: 'live' | 'beta' | 'soon' (soon 은 링크는 살리되 "준비 중" 표시).
   - 관리자(admin.broodev.com)는 Google SSO 전용이라 포털에 싣지 않는다. */
(function () {
  'use strict';

  var CATEGORIES = [
    { id: 'crypto', name: '코인 시그널', en: 'CRYPTO SIGNALS', numeral: 'I',
      desc: '공포·탐욕 지수에 RSI·MACD·마이어 배수 등 8개 지표를 합성한 0~100 매수 타이밍 점수. 15종 코인, 13개 언어.' },
    { id: 'panel', name: '생활 인포패널', en: 'DAILY INFO PANELS', numeral: 'II',
      desc: '정전·환율·재난 경보·행정 조회를 나라별로 한 화면에. 그 나라 말로, 가볍게.' },
    { id: 'learn', name: '학습', en: 'LEARNING', numeral: 'III',
      desc: '설치 없이 링크 하나로 쓰는 암기 도구와 사용법 튜토리얼.' },
    { id: 'work', name: '업무 도구', en: 'WORK TOOLS', numeral: 'IV',
      desc: '일에 필요한 작은 도구들 — 브라우저 안에서만 처리, 서버로 올리지 않는다.' },
    { id: 'game', name: '게임', en: 'GAMES', numeral: 'V',
      desc: '한 판에 몰입하는 브라우저 게임.' },
    { id: 'dev', name: '개발자', en: 'DEVELOPER', numeral: 'VI',
      desc: 'broodev 를 만드는 사람 — 포트폴리오·소스코드·연락처.' }
  ];

  var coin = function (sub, ko, ticker, en) {
    return { id: sub, cat: 'crypto', name: ko + ' 시그널', en: ticker + '_SIGNAL', status: 'live',
      url: 'https://' + sub + '.broodev.com/',
      desc: en + '(' + ticker + ') 공포·탐욕 지수 · 8개 지표 합성 매수 타이밍 점수' };
  };

  var APPS = [
    // ── 코인 시그널 15종 (btc 가 원본, 나머지는 scripts/gen_coin.py 로 생성)
    { id: 'btc', cat: 'crypto', name: '비트코인 시그널', en: 'BTC_SIGNAL', status: 'live', featured: true,
      url: 'https://btc.broodev.com/',
      desc: '비트코인 공포·탐욕 지수 + RSI·MACD·마이어 배수 등 8개 지표 → 0~100 매수 타이밍 점수. 지표 해설·용어집·방법론 포함.' },
    coin('eth', '이더리움', 'ETH', 'Ethereum'),
    coin('xrp', '리플', 'XRP', 'XRP'),
    coin('doge', '도지코인', 'DOGE', 'Dogecoin'),
    coin('bch', '비트코인캐시', 'BCH', 'Bitcoin Cash'),
    coin('link', '체인링크', 'LINK', 'Chainlink'),
    coin('xlm', '스텔라루멘', 'XLM', 'Stellar'),
    coin('ltc', '라이트코인', 'LTC', 'Litecoin'),
    coin('avax', '아발란체', 'AVAX', 'Avalanche'),
    coin('shib', '시바이누', 'SHIB', 'Shiba Inu'),
    coin('dot', '폴카닷', 'DOT', 'Polkadot'),
    coin('pepe', '페페', 'PEPE', 'Pepe'),
    coin('grt', '더그래프', 'GRT', 'The Graph'),
    coin('sand', '샌드박스', 'SAND', 'The Sandbox'),
    coin('mana', '디센트럴랜드', 'MANA', 'Decentraland'),

    // ── 생활 인포패널 12종
    { id: 'greenland', cat: 'panel', name: '그린란드 인포패널', en: 'GREENLAND_INFO', status: 'live',
      url: 'https://greenland.broodev.com/',
      desc: '15개 마을의 날씨·파도·조석·오로라(Kp)·극야 카운트다운·결항 리스크 + 그린란드어 도구.' },
    { id: 'nunavut', cat: 'panel', name: '누나부트 패널', en: 'NUNAVUT_PANEL', status: 'live',
      url: 'https://nunavut.broodev.com/',
      desc: '캐나다 북극권 10개 커뮤니티 — 체감온도·블리자드 주의·오로라·실리프트 시즌·이눅티투트.' },
    { id: 'mongolia', cat: 'panel', name: '몽골 패널', en: 'MONGOL_PANEL', status: 'live',
      url: 'https://mongolia.broodev.com/',
      desc: '울란바토르 구역별 PM2.5·아이막 날씨·투그릭 환율·유목 도구.' },
    { id: 'nepal', cat: 'panel', name: '네팔 패널', en: 'NEPAL_PANEL', status: 'live',
      url: 'https://nepal.broodev.com/',
      desc: '비크람 삼바트 ↔ 서력 변환·루피 환율·송금 실효비용·산악 날씨.' },
    { id: 'philippines', cat: 'panel', name: '필리핀 패널', en: 'PINAS_PANEL', status: 'live',
      url: 'https://philippines.broodev.com/',
      desc: 'PAGASA 태풍 시그널 행동 가이드·USD/PHP·OFW 송금 비용·정부 포털 상태·브라운아웃.' },
    { id: 'bangladesh', cat: 'panel', name: '방글라데시 패널', en: 'BANGLA_PANEL', status: 'live',
      url: 'https://bangladesh.broodev.com/',
      desc: '해상 폭풍 시그널·FFWC 홍수 수위·로드셰딩 링크·타카 환율·SSC/HSC 결과.' },
    { id: 'pakistan', cat: 'panel', name: '파키스탄 데일리 유틸', en: 'PAKISTAN_UTILITY', status: 'live',
      url: 'https://pakistan.broodev.com/',
      desc: 'DISCO 로드셰딩·PKR 환율·송금 실효비용·교육위원회 결과·NADRA·USSD 코드.' },
    { id: 'srilanka', cat: 'panel', name: '스리랑카 패널', en: 'LANKA_PANEL', status: 'live',
      url: 'https://srilanka.broodev.com/',
      desc: 'CEB 정전 그룹 조회·철도 노선·LKR 환율·A/L·O/L 결과 포털.' },
    { id: 'stans', cat: 'panel', name: '스탄 패널', en: 'STAN_PANEL', status: 'live',
      url: 'https://stans.broodev.com/',
      desc: '우즈베키스탄·키르기스스탄·타지키스탄 — 환율·송금·러시아 노동 서류·USSD.' },
    { id: 'africa', cat: 'panel', name: '아프리카 데일리 유틸', en: 'AFRICA_UTILITY', status: 'live',
      url: 'https://africa.broodev.com/',
      desc: '나이지리아·케냐·가나·남아공 — 정전·환율·송금 실효비용·JAMB/WAEC/SASSA/NIN 조회·USSD.' },
    { id: 'caribbean', cat: 'panel', name: '카리브 패널', en: 'CARIB_PANEL', status: 'live',
      url: 'https://caribbean.broodev.com/',
      desc: '자메이카·트리니다드·바베이도스·바하마 — 허리케인 플레이북·정전·환율·공식 포털.' },
    { id: 'pacific', cat: 'panel', name: '태평양 패널', en: 'PACIFIC_PANEL', status: 'live',
      url: 'https://pacific.broodev.com/',
      desc: '피지·사모아·통가·바누아투 — 사이클론 시즌·파도와 조석·환율·계절 노동.' },

    // ── 학습
    { id: 'voca', cat: 'learn', name: '깜빡이 단어암기장', en: 'VOCA_DECK', status: 'live', featured: true,
      url: 'https://voca.broodev.com/',
      desc: 'CSV 를 올리면 3초마다 자동으로 넘어가는 깜빡이 암기장. TTS·즐겨찾기·13개 언어. 설치 없이 링크 하나로.' },
    { id: 'voca-tutorial', cat: 'learn', name: '깜빡이 사용법 튜토리얼', en: 'VOCA_TUTORIAL', status: 'live',
      url: 'https://voca-tutorial.broodev.com/',
      desc: '깜빡이 단어암기장을 10단계로 따라 하는 인터랙티브 튜토리얼.' },

    // ── 업무 도구
    { id: 'utils', cat: 'work', name: '업무 도구 모음 — 사진 나란히 (写真ならべ) Excel · PowerPoint', en: 'UTILS', status: 'live', featured: true,
      url: 'https://utils.broodev.com/',
      desc: '사진을 올리면 용지(A4·A3·B4·Letter…)와 가로×세로 격자에 맞춰 배열한 .xlsx(Excel 앱) / .pptx(PowerPoint 앱, /pptx)를 내려받는다. 브라우저 안에서만 처리. Illustrator · Photoshop 출력은 준비 중.' },

    // ── 게임
    { id: 'samurai', cat: 'game', name: '사무라이 택틱스 2', en: 'SAMURAI_TACTICS_2', status: 'live',
      url: 'https://samurai.broodev.com/',
      desc: '한 줄 전장 턴제 검술 로그라이크 — 기술패를 쌓고 한 호흡에 발동한다. 4단계 난이도·업적 30종·13개 언어.' },

    // ── 개발자
    { id: 'dev', cat: 'dev', name: '개발자 소개 · 포트폴리오', en: 'JSONTYPE_', status: 'live',
      url: 'https://dev.broodev.com/',
      desc: '양동화(@jsontype) — 도쿄의 프론트엔드·풀사이클 엔지니어. 업적 15건, 하는 일, 연락처.' },
    { id: 'github', cat: 'dev', name: 'GitHub — 소스코드', en: 'GITHUB', status: 'live',
      url: 'https://github.com/jsontype/broodev',
      desc: 'broodev 모노레포 전체 소스. 무빌드 정적 사이트 + Cloudflare Pages.' }
  ];

  var byCat = {};
  APPS.forEach(function (a) { (byCat[a.cat] = byCat[a.cat] || []).push(a); });
  CATEGORIES.forEach(function (c) { c.apps = byCat[c.id] || []; c.count = c.apps.length; });

  window.BROODEV_CATALOG = {
    categories: CATEGORIES,
    apps: APPS,
    total: APPS.length,
    languages: 13,
    featured: APPS.filter(function (a) { return a.featured; })
  };
})();
