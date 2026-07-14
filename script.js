/* =====================================================================
   김석준 포트폴리오 — 인터랙션
   1) 스크롤 등장 애니메이션 (IntersectionObserver)
   2) 현재 섹션 네비 하이라이트 (스크롤 스파이)
   ===================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1. 등장 애니메이션 ---- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    reveals.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---- 2. 스크롤 스파이 (네비 하이라이트) ---- */
  var links = Array.prototype.slice.call(document.querySelectorAll('[data-navlink]'));
  var sections = links
    .map(function (link) { return document.getElementById(link.getAttribute('data-navlink')); })
    .filter(Boolean);

  function setActive(id) {
    links.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('data-navlink') === id);
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { setActive(entry.target.id); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (section) { spyObserver.observe(section); });
  }
})();
