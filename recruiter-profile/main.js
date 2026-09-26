/**
 * main.js — Rafiul Biswas Recruiter Profile
 *
 * Sections:
 *   1. Asset injection (photo + MARSAD screenshot from assets.js)
 *   2. Navigation: active link highlighting via IntersectionObserver
 *   3. Navigation: mobile hamburger drawer
 *   4. Dark mode toggle
 *   5. Smooth scroll offset correction for sticky nav
 */

/* ── 1. ASSET INJECTION ──────────────────────────────────────
 * assets.js defines window.ASSETS = { profilePhoto, marsadDashboard }
 * We inject them after the DOM is ready so HTML stays clean.
 * To replace images: update assets.js (see instructions at top of that file).
 * ─────────────────────────────────────────────────────────── */
function injectAssets() {
  if (typeof ASSETS === 'undefined') {
    console.warn('assets.js not loaded — images will not appear.');
    return;
  }

  // Profile photo
  const photoEl = document.getElementById('hero-photo');
  if (photoEl && ASSETS.profilePhoto) {
    photoEl.src = ASSETS.profilePhoto;
    photoEl.alt = 'Dr. Md. Rafiul Biswas';
  }

  // MARSAD dashboard screenshot
  const marsadEl = document.getElementById('marsad-screenshot');
  if (marsadEl && ASSETS.marsadDashboard) {
    marsadEl.src = ASSETS.marsadDashboard;
    marsadEl.alt = 'MARSAD AI Dashboard — Sentiment & Propaganda Analysis';
  }
}

/* ── 2. ACTIVE NAV LINK (IntersectionObserver) ───────────────
 * Watches each <section id="..."> and marks the matching nav
 * link as .active when the section is in the viewport.
 * ─────────────────────────────────────────────────────────── */
function initActiveNav() {
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"], .nav-drawer a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  if (!sections.length || !navLinks.length) return;

  const navHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '60',
    10
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            const matches = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', matches);
          });
        }
      });
    },
    {
      rootMargin: `-${navHeight + 8}px 0px -60% 0px`,
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ── 3. MOBILE HAMBURGER DRAWER ──────────────────────────────
 * Toggles .open on the drawer; closes on link click or outside tap.
 * ─────────────────────────────────────────────────────────── */
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const drawer = document.getElementById('nav-drawer');

  if (!toggle || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.textContent = '✕';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = '☰';
  }

  toggle.addEventListener('click', () => {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });

  // Close when a drawer link is clicked
  drawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  // Close when clicking outside the nav
  document.addEventListener('click', (e) => {
    const nav = document.querySelector('.topnav');
    if (!nav) return;
    if (!nav.contains(e.target) && !drawer.contains(e.target)) {
      closeDrawer();
    }
  });
}

/* ── 4. DARK MODE TOGGLE ─────────────────────────────────────
 * Reads localStorage preference; respects system preference as default.
 * Toggles data-theme="dark" / data-theme="light" on <html>.
 * ─────────────────────────────────────────────────────────── */
function initDarkMode() {
  const btn = document.getElementById('dark-toggle');
  if (!btn) return;

  const root = document.documentElement;

  // Load saved preference or fall back to system preference
  const saved = localStorage.getItem('theme');
  if (saved) {
    root.setAttribute('data-theme', saved);
  }

  function currentTheme() {
    const explicit = root.getAttribute('data-theme');
    if (explicit) return explicit;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function updateBtn(theme) {
    btn.textContent = theme === 'dark' ? '☀' : '◑';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  updateBtn(currentTheme());

  btn.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateBtn(next);
  });
}

/* ── 5. SMOOTH SCROLL OFFSET ─────────────────────────────────
 * CSS scroll-margin-top handles most cases, but anchor clicks from
 * external sources may still land off. This corrects them.
 * ─────────────────────────────────────────────────────────── */
function initScrollOffset() {
  const navHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '60',
    10
  );

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ── INIT ────────────────────────────────────────────────────
 * Run everything after the DOM is fully parsed.
 * ─────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  injectAssets();
  initActiveNav();
  initMobileNav();
  initDarkMode();
  initScrollOffset();
});
