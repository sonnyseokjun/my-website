/* ============================================
   Theme Toggle
   ============================================ */
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

function getTheme() {
  return localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  const icon = themeToggle.querySelector('i');
  icon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  localStorage.setItem('theme', theme);
}

applyTheme(getTheme());

themeToggle.addEventListener('click', () => {
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* ============================================
   Mobile Menu
   ============================================ */
const hamburger = document.getElementById('nav-hamburger');
const mobileMenu = document.getElementById('mobile-menu');

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
}

hamburger.addEventListener('click', () => {
  const opening = !mobileMenu.classList.contains('open');
  mobileMenu.classList.toggle('open', opening);
  hamburger.classList.toggle('open', opening);
  hamburger.setAttribute('aria-expanded', String(opening));
  mobileMenu.setAttribute('aria-hidden', String(!opening));
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

/* ============================================
   Nav: scroll effect + active link
   ============================================ */
const navHeader = document.getElementById('nav-header');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

function onScroll() {
  // Scroll background
  navHeader.classList.toggle('scrolled', window.scrollY > 24);

  // Active link
  const scrollMid = window.scrollY + window.innerHeight / 3;
  let current = '';
  sections.forEach(sec => {
    if (scrollMid >= sec.offsetTop) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ============================================
   Scroll Animations (IntersectionObserver)
   ============================================ */
const fadeEls = document.querySelectorAll('.fade-in');

// Assign stagger delay within each grid/timeline parent
const staggerParents = document.querySelectorAll(
  '.skills-grid, .projects-grid, .timeline, .about-text, .about-meta'
);

staggerParents.forEach(parent => {
  parent.querySelectorAll('.fade-in').forEach((el, i) => {
    el.style.transitionDelay = `${i * 70}ms`;
  });
});

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
);

fadeEls.forEach(el => observer.observe(el));

/* ============================================
   Awards: Photo Carousel
   ============================================ */
const galleryTrack = document.getElementById('gallery-track');

if (galleryTrack) {
  const slides = Array.from(galleryTrack.children);
  const dotsWrap = document.getElementById('gallery-dots');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  let current = 0;
  let autoplayId = null;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'gallery-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `${i + 1}번째 사진으로 이동`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function render() {
    galleryTrack.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  }

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    render();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    stopAutoplay();
    autoplayId = setInterval(next, 4500);
  }

  function stopAutoplay() {
    if (autoplayId) clearInterval(autoplayId);
  }

  nextBtn.addEventListener('click', () => { next(); startAutoplay(); });
  prevBtn.addEventListener('click', () => { prev(); startAutoplay(); });

  const carousel = galleryTrack.closest('.gallery-carousel');
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);

  // Touch swipe
  let touchStartX = 0;
  galleryTrack.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    stopAutoplay();
  }, { passive: true });

  galleryTrack.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (diff > 40) prev();
    else if (diff < -40) next();
    startAutoplay();
  }, { passive: true });

  render();
  startAutoplay();
}
