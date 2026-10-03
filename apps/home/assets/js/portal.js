/* broodev 포털 런타임 — 카탈로그(catalog.js) → 전체화면 앱 모달(카테고리별 5개 + 페이지네이션) · 카테고리 섹션 · 숫자 · 연락 폼
   의존: window.BROODEV_CATALOG (catalog.js 먼저 로드). jQuery/GSAP 불필요. */
(function () {
  'use strict';
  var C = window.BROODEV_CATALOG;
  if (!C) return;

  var PER_PAGE = 5;
  var ARROW = 'assets/images/btn-arrow.svg';

  function h(tag, attrs, children) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') el.className = attrs[k];
      else if (k === 'text') el.textContent = attrs[k];
      else if (k === 'html') el.innerHTML = attrs[k];
      else if (k.indexOf('on') === 0) el.addEventListener(k.slice(2), attrs[k]);
      else el.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) el.appendChild(c); });
    return el;
  }
  function host(url) { try { return new URL(url).host.replace(/^www\./, ''); } catch (e) { return url; } }

  /* ── 숫자 채우기: data-count="total|categories|languages|cat:<id>" ── */
  Array.prototype.forEach.call(document.querySelectorAll('[data-count]'), function (el) {
    var k = el.getAttribute('data-count'), v;
    if (k === 'total') v = C.total;
    else if (k === 'categories') v = C.categories.length;
    else if (k === 'languages') v = C.languages;
    else if (k.indexOf('cat:') === 0) { var cat = C.categories.filter(function (c) { return c.id === k.slice(4); })[0]; v = cat ? cat.count : 0; }
    if (v != null) el.textContent = v;
  });

  /* ── 카테고리 섹션(awards 레이아웃) ── */
  var catList = document.getElementById('category-list');
  if (catList) {
    C.categories.forEach(function (cat, i) {
      var box = h('div', { class: 'awards-box' + (i === 0 ? ' active' : ''), role: 'button', tabindex: '0', 'data-cat': cat.id,
        'aria-label': cat.name + ' — 앱 ' + cat.count + '개 보기' }, [
        h('div', { class: 'awards-inner' }, [
          h('div', { class: 'cat-meta' }, [
            h('h4', { text: cat.numeral + '. ' + cat.name }),
            h('span', { class: 'cat-count', text: cat.count + ' apps' })
          ]),
          h('span', { class: 'cat-open' }, [document.createTextNode('목록 열기 '), h('img', { src: ARROW, alt: '' })])
        ]),
        h('div', { class: 'overlay' })
      ]);
      // 템플릿은 .overlay 를 .awards-inner 앞에 두지만 z-index:-1 이라 순서 무관
      var open = function () { openModal(cat.id); };
      box.addEventListener('click', open);
      box.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
      box.addEventListener('mouseenter', function () {
        Array.prototype.forEach.call(catList.querySelectorAll('.awards-box.active'), function (b) { b.classList.remove('active'); });
      });
      catList.appendChild(box);
    });
  }

  /* ── 사이트맵 섹션(#sitemap-list): 전체 앱을 카테고리별로 전부 펼친다 — 모달과 달리 페이지네이션 없음 ── */
  var sitemap = document.getElementById('sitemap-list');
  if (sitemap) {
    C.categories.forEach(function (cat) {
      var list = h('ul', { class: 'sitemap-list' });
      cat.apps.forEach(function (a) {
        var badge = a.status === 'soon' ? h('span', { class: 'app-badge soon', text: '준비 중' }) : (a.status === 'beta' ? h('span', { class: 'app-badge', text: 'beta' }) : null);
        list.appendChild(h('li', null, [
          h('a', { href: a.url, target: '_blank', rel: 'noopener', title: a.desc }, [
            h('span', { class: 'name' }, [document.createTextNode(a.name), badge]),
            h('span', { class: 'host', text: host(a.url) })
          ])
        ]));
      });
      sitemap.appendChild(h('section', { class: 'sitemap-cat', 'data-cat': cat.id, 'aria-labelledby': 'sitemap-cat-' + cat.id }, [
        h('header', { class: 'sitemap-cat-head' }, [
          h('span', { class: 'numeral', text: cat.numeral }),
          h('h4', { id: 'sitemap-cat-' + cat.id }, [document.createTextNode(cat.name), h('small', { text: cat.count + ' apps' })]),
          h('span', { class: 'en', text: cat.en })
        ]),
        list
      ]));
    });
  }

  /* ── 모달 ── */
  var modal = document.getElementById('apps-modal');
  var grid = modal && modal.querySelector('.apps-grid');
  var lastFocus = null;
  var pages = {}; // cat.id → 현재 페이지(0-base)

  function renderList(cat, listEl, pagerEl) {
    var total = cat.apps.length;
    var pageCount = Math.max(1, Math.ceil(total / PER_PAGE));
    var p = Math.min(pages[cat.id] || 0, pageCount - 1);
    pages[cat.id] = p;
    listEl.innerHTML = '';
    var slice = cat.apps.slice(p * PER_PAGE, p * PER_PAGE + PER_PAGE);
    slice.forEach(function (a) {
      var badge = a.status === 'soon' ? h('span', { class: 'app-badge soon', text: '준비 중' }) : (a.status === 'beta' ? h('span', { class: 'app-badge', text: 'beta' }) : null);
      listEl.appendChild(h('li', null, [
        h('a', { href: a.url, target: '_blank', rel: 'noopener', 'aria-label': a.name + ' — ' + host(a.url) }, [
          h('div', { class: 'app-main' }, [
            h('span', { class: 'app-name' }, [document.createTextNode(a.name), badge]),
            h('span', { class: 'app-desc', text: a.desc })
          ]),
          h('span', { class: 'app-host' }, [document.createTextNode(host(a.url)), h('img', { src: ARROW, alt: '' })])
        ])
      ]));
    });
    for (var i = slice.length; i < PER_PAGE; i++) listEl.appendChild(h('li', { class: 'is-empty', 'aria-hidden': 'true' }));

    // 페이지네이션 — 1페이지뿐이어도 비활성 상태로 표시한다(요구사항)
    pagerEl.innerHTML = '';
    pagerEl.className = 'apps-pager' + (pageCount === 1 ? ' is-single' : '');
    var prev = h('button', { type: 'button', 'aria-label': '이전 페이지', html: '&lsaquo;', onclick: function () { go(cat, p - 1); } });
    var next = h('button', { type: 'button', 'aria-label': '다음 페이지', html: '&rsaquo;', onclick: function () { go(cat, p + 1); } });
    if (p === 0) prev.disabled = true;
    if (p >= pageCount - 1) next.disabled = true;
    var nums = h('div', { class: 'pager-pages' });
    for (var n = 0; n < pageCount; n++) {
      (function (n) {
        var b = h('button', { type: 'button', text: String(n + 1), 'aria-label': (n + 1) + '페이지', onclick: function () { go(cat, n); } });
        if (n === p) { b.classList.add('is-current'); b.setAttribute('aria-current', 'page'); }
        if (pageCount === 1) b.disabled = true;
        nums.appendChild(b);
      })(n);
    }
    var from = total ? p * PER_PAGE + 1 : 0, to = Math.min(total, (p + 1) * PER_PAGE);
    pagerEl.appendChild(h('div', { class: 'pager-pages' }, [prev, nums, next]));
    pagerEl.appendChild(h('span', { class: 'pager-status', text: from + '–' + to + ' / ' + total }));
  }
  function go(cat, p) {
    var card = grid.querySelector('[data-cat="' + cat.id + '"]');
    if (!card) return;
    pages[cat.id] = p;
    renderList(cat, card.querySelector('.apps-list'), card.querySelector('.apps-pager'));
  }

  function buildModal() {
    if (!grid || grid.childElementCount) return;
    C.categories.forEach(function (cat) {
      var list = h('ul', { class: 'apps-list' });
      var pager = h('nav', { class: 'apps-pager', 'aria-label': cat.name + ' 페이지' });
      var card = h('section', { class: 'apps-cat', 'data-cat': cat.id, 'aria-labelledby': 'apps-cat-' + cat.id }, [
        h('header', { class: 'apps-cat-head' }, [
          h('div', null, [
            h('span', { class: 'numeral', text: cat.numeral }),
            h('h3', { id: 'apps-cat-' + cat.id, text: cat.name }),
            h('span', { class: 'en', text: cat.en })
          ]),
          h('span', { class: 'count', html: '<b>' + cat.count + '</b> apps' })
        ]),
        list, pager
      ]);
      grid.appendChild(card);
      renderList(cat, list, pager);
    });
    var totalEl = modal.querySelector('[data-modal-total]');
    if (totalEl) totalEl.textContent = C.total + ' apps · ' + C.categories.length + ' categories';
  }

  function openModal(catId) {
    if (!modal) return;
    buildModal();
    lastFocus = document.activeElement;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('apps-modal-open');
    Array.prototype.forEach.call(grid.querySelectorAll('.apps-cat.is-target'), function (c) { c.classList.remove('is-target'); });
    var target = catId && grid.querySelector('[data-cat="' + catId + '"]');
    var focusEl = target ? target.querySelector('.apps-list a') : modal.querySelector('.apps-modal-close');
    if (target) {
      target.classList.add('is-target');
      setTimeout(function () { target.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, 60);
    } else modal.scrollTop = 0;
    setTimeout(function () { if (focusEl) focusEl.focus({ preventScroll: true }); }, 120);
  }
  function closeModal() {
    if (!modal || !modal.classList.contains('active')) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('apps-modal-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  window.BROODEV_openApps = openModal;

  Array.prototype.forEach.call(document.querySelectorAll('[data-open-apps]'), function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      // 사이드바(햄버거 메뉴)에서 눌렀으면 사이드바도 닫는다
      var sb = document.querySelector('.header-sidebar-wrap.active');
      if (sb) { sb.classList.remove('active'); document.body.style.overflow = 'inherit'; }
      openModal(el.getAttribute('data-open-apps') || null);
    });
  });
  if (modal) {
    Array.prototype.forEach.call(modal.querySelectorAll('[data-close-apps]'), function (el) { el.addEventListener('click', closeModal); });
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('active')) return;
      if (e.key === 'Escape') { closeModal(); return; }
      if (e.key === 'Tab') { // 간단한 포커스 가둠
        var f = modal.querySelectorAll('a[href], button:not([disabled])');
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }
  // #apps 해시로 들어오면 바로 연다 (예: broodev.com/#apps · #apps=crypto)
  function hashOpen() {
    var m = location.hash.match(/^#apps(?:=([\w-]+))?$/);
    if (m) openModal(m[1] || null);
  }
  window.addEventListener('hashchange', hashOpen);
  window.addEventListener('load', function () { setTimeout(hashOpen, 900); });

  /* ── 연락 폼: EmailJS (voca·dev3 과 같은 서비스·템플릿) · SDK 없으면 mailto ── */
  var EMAILJS_PUBLIC_KEY = 'u-DIwFmmMVFWrxJMX';
  var EMAILJS_SERVICE_ID = 'broodev_service';
  var EMAILJS_TEMPLATE_ID = 'broodev_template';
  var FALLBACK_MAIL = 'jsontyper@gmail.com';
  var form = document.getElementById('contactForm');
  var result = document.getElementById('result');
  if (form && result) {
    var configured = !!(window.emailjs && EMAILJS_PUBLIC_KEY);
    if (configured) emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    var btn = form.querySelector('button[type="submit"]');
    function status(kind, text) { result.className = kind ? 'is-' + kind : ''; result.textContent = text || ''; }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim(), email = form.email.value.trim(), msg = form.message.value.trim();
      var subject = '[broodev.com] ' + (name || '방문자') + ' 님의 메시지';
      if (!configured) {
        location.href = 'mailto:' + FALLBACK_MAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(msg + '\n\n— ' + name + ' <' + email + '>');
        return;
      }
      if (btn) btn.disabled = true;
      status('sending', '보내는 중…');
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        subject: subject, kind: 'portal', name: name || '(무기명)', email: email || '(회신 주소 없음)',
        message: msg, page: location.href, ua: navigator.userAgent, shots: '(없음)'
      }).then(function () {
        status('ok', '보냈습니다. 곧 답장드릴게요.');
        form.reset();
      }).catch(function (err) {
        if (window.console) console.warn('portal: emailjs failed', err);
        status('err', '송신에 실패했습니다. ' + FALLBACK_MAIL + ' 로 직접 보내주세요.');
      }).then(function () { if (btn) btn.disabled = false; });
    });
  }
})();
