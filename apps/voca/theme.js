/* VOCA DECK 테마 초기화 — <head> 에서 CSS 보다 먼저 동기 실행(첫 페인트 전에 html[data-theme] 확정 → 깜빡임 없음).
   index.html(앱)과 콘텐츠 페이지(content.css)가 같이 쓴다. 테마 풀다운은 index.html 헤더에만 있고, 선택은 localStorage voca:theme 로 전 페이지 공유.
   - 'broodev'(기본): btc.broodev.com 계열 네온 그린 터미널(바탕 #05080a · 글자 #c8ffe6 · 강조 #00ff9c — 2026-10-05 흑백 모노톤에서 교정) · 'original': 원래의 남색+노랑 · Win95 회색 제어판 · 초록 LED
   - 최초 1회 마이그레이션: 테마 도입(2026-10-03) 전부터 쓰던 사용자의 voca:cfg 표시색이 옛 기본값(배경 #000040 · 글자 #ffff00) 그대로면
     '테마 기본색 따름'(null) 으로 바꾼다. 직접 고른 다른 색은 건드리지 않는다. voca:theme 가 저장되면 다시는 돌지 않는다. */
(function () {
  var THEMES = ['broodev', 'original'], KEY = 'voca:theme', t = null
  try { t = JSON.parse(localStorage.getItem(KEY) || 'null') } catch (e) {}
  if (THEMES.indexOf(t) < 0) {
    t = 'broodev'
    try {
      var cfg = JSON.parse(localStorage.getItem('voca:cfg') || 'null')
      if (cfg && cfg.bg === '#000040' && cfg.fontColor === '#ffff00') { cfg.bg = null; cfg.fontColor = null; localStorage.setItem('voca:cfg', JSON.stringify(cfg)) }
      localStorage.setItem(KEY, JSON.stringify(t))
    } catch (e) {}
  }
  document.documentElement.setAttribute('data-theme', t)
  var m = document.querySelector('meta[name="theme-color"]')
  if (m) m.setAttribute('content', t === 'original' ? '#000040' : '#05080a')
})()
