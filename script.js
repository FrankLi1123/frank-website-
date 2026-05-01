/* ============================================================
   FRANK // CS-01 — GUNDAM-STYLED PORTFOLIO
   script.js
   ============================================================*/

'use strict';

/* ── State ─────────────────────────────────────────────────── */
let gundamMode   = false;
let musicPlaying = false;
let glitchTimer  = null;
let statusTimer  = null;

/* ── DOM References ─────────────────────────────────────────── */
const gundamCursor   = document.getElementById('gundam-cursor');
const gundamModeBtn  = document.getElementById('gundam-mode-btn');
const musicBtn       = document.getElementById('music-btn');
const musicLabel     = document.getElementById('music-label');
const statusMsg      = document.getElementById('status-msg');
const heroTitle      = document.getElementById('hero-title');
const bgmPlayer      = document.getElementById('bgm-player');
const modeBanner     = document.getElementById('gundam-mode-banner');
const particlesCont  = document.getElementById('particles-container');
const contactForm    = document.getElementById('contact-form');
const formSuccess    = document.getElementById('form-success');

/* ── Utility: clamp ─────────────────────────────────────────── */
function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/* ── Nav Status Messages ────────────────────────────────────── */
(function initStatusCycle() {
  const messages = [
    '● SYSTEM ONLINE',
    '● PILOT SYNCED',
    '● MISSION ACTIVE',
    '● CODE RUNNING'
  ];
  let idx = 0;
  statusTimer = setInterval(() => {
    idx = (idx + 1) % messages.length;
    statusMsg.textContent = messages[idx];
  }, 3000);
})();

/* ── Hero Title Glitch Effect ───────────────────────────────── */
(function initGlitch() {
  glitchTimer = setInterval(() => {
    heroTitle.classList.add('glitch');
    setTimeout(() => heroTitle.classList.remove('glitch'), 80);
  }, 3500);
})();

/* ── Fade-in on Scroll ──────────────────────────────────────── */
(function initFadeIn() {
  const fadeEls = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.08 });
  fadeEls.forEach(el => observer.observe(el));
})();

/* ── Skill Bar Animations ───────────────────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const width  = target.getAttribute('data-width');
        // Small delay so the animation is visible
        setTimeout(() => {
          target.style.width = width + '%';
        }, 120);
        barObserver.unobserve(target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(bar => barObserver.observe(bar));
})();

/* ── Active Nav Link Highlighting ───────────────────────────── */
(function initNavHighlight() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  function onScroll() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 80;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Background Music ───────────────────────────────────────── */
function updateMusicBtn() {
  if (musicPlaying) {
    musicBtn.classList.remove('off');
    musicLabel.textContent = 'MUSIC ON';
  } else {
    musicBtn.classList.add('off');
    musicLabel.textContent = 'MUSIC OFF';
  }
}

function tryAutoPlay() {
  if (!bgmPlayer) return;
  bgmPlayer.volume = 0.55;
  const promise = bgmPlayer.play();
  if (promise !== undefined) {
    promise.then(() => {
      musicPlaying = true;
      updateMusicBtn();
    }).catch(() => {
      // Auto-play blocked — wait for user interaction
      musicPlaying = false;
      updateMusicBtn();
    });
  }
}

musicBtn.addEventListener('click', () => {
  if (!bgmPlayer) return;
  if (bgmPlayer.paused) {
    bgmPlayer.play().then(() => {
      musicPlaying = true;
      updateMusicBtn();
    }).catch(() => {});
  } else {
    bgmPlayer.pause();
    musicPlaying = false;
    updateMusicBtn();
  }
});

// Attempt auto-play on first user gesture (for browsers that block it)
document.addEventListener('click', function firstClick() {
  if (!musicPlaying && bgmPlayer && bgmPlayer.paused) {
    bgmPlayer.volume = 0.55;
    bgmPlayer.play().then(() => {
      musicPlaying = true;
      updateMusicBtn();
    }).catch(() => {});
  }
  document.removeEventListener('click', firstClick);
}, { once: true });

tryAutoPlay();

/* ── Explosion Particles ────────────────────────────────────── */
const PARTICLE_COLORS = ['#00ff88', '#ff6600', '#00ccff', '#ffdd00', '#ff2244', '#8844ff'];

function spawnParticles(x, y, count) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const angle  = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.8;
    const dist   = 40 + Math.random() * 80;
    const dx     = Math.cos(angle) * dist;
    const dy     = Math.sin(angle) * dist;
    const color  = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
    const size   = 4 + Math.random() * 8;

    p.style.cssText = `
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      box-shadow: 0 0 6px ${color};
      --dx: ${dx}px;
      --dy: ${dy}px;
      animation-duration: ${0.4 + Math.random() * 0.4}s;
    `;

    particlesCont.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }
}

/* ── Gundam Cursor Tracking ─────────────────────────────────── */
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;
  if (gundamMode && gundamCursor) {
    gundamCursor.style.left = cursorX + 'px';
    gundamCursor.style.top  = cursorY + 'px';
  }
}, { passive: true });

/* ── Gundam Mode: Destroy Elements on Click ─────────────────── */
const destroyedElements = new WeakSet();

// Elements that must never be destroyed
function isProtected(el) {
  if (!el || el === document.body || el === document.documentElement) return true;
  if (el.tagName === 'NAV' || el.closest('nav')) return true;
  if (el.id === 'gundam-cursor') return true;
  if (el.id === 'particles-container') return true;
  if (el.id === 'gundam-mode-banner') return true;
  if (el.id === 'bgm-player') return true;
  if (el.classList && el.classList.contains('gundam-mode-btn')) return true;
  if (el.classList && el.classList.contains('gundam-cursor')) return true;
  return false;
}

function handleDestroyClick(e) {
  if (!gundamMode) return;

  const target = e.target;
  if (isProtected(target)) return;
  if (destroyedElements.has(target)) return;

  e.stopPropagation();

  destroyedElements.add(target);

  // Spawn explosion particles at click position
  spawnParticles(e.clientX, e.clientY, 14);

  // Animate destruction
  target.classList.add('being-destroyed');

  setTimeout(() => {
    target.style.display = 'none';
  }, 420);
}

/* ── Toggle Gundam Mode ─────────────────────────────────────── */
function enableGundamMode() {
  gundamMode = true;
  document.body.classList.remove('default-cursor');
  document.body.style.cursor = 'none';
  gundamCursor.classList.add('active');
  gundamModeBtn.classList.add('active');
  gundamModeBtn.textContent = '⚔ GUNDAM MODE ON';
  modeBanner.style.display = 'block';
  document.addEventListener('click', handleDestroyClick, true);
}

function disableGundamMode() {
  gundamMode = false;
  document.body.classList.add('default-cursor');
  document.body.style.cursor = '';
  gundamCursor.classList.remove('active');
  gundamModeBtn.classList.remove('active');
  gundamModeBtn.textContent = '⚔ GUNDAM MODE';
  modeBanner.style.display = 'none';
  document.removeEventListener('click', handleDestroyClick, true);
}

gundamModeBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (gundamMode) {
    disableGundamMode();
  } else {
    enableGundamMode();
  }
});

// Default cursor state on load
document.body.classList.add('default-cursor');

/* ── Contact Form ───────────────────────────────────────────── */
if (contactForm) {
  contactForm.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
  e.preventDefault();
  contactForm.style.display = 'none';
  formSuccess.style.display = 'block';
  // Reset after 4 seconds
  setTimeout(() => {
    contactForm.reset();
    contactForm.style.display = 'flex';
    formSuccess.style.display = 'none';
  }, 4000);
}

/* ── Keyboard Shortcut: G = Toggle Gundam Mode ──────────────── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'g' || e.key === 'G') {
    // Don't trigger when typing in inputs
    if (document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA') return;
    if (gundamMode) {
      disableGundamMode();
    } else {
      enableGundamMode();
    }
  }
  // M = Toggle Music
  if (e.key === 'm' || e.key === 'M') {
    if (document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA') return;
    musicBtn.click();
  }
});

/* ── Avatar hover glow effect ───────────────────────────────── */
const avatarImg = document.getElementById('avatar-img');
if (avatarImg) {
  avatarImg.addEventListener('mouseenter', () => {
    avatarImg.parentElement.style.boxShadow =
      '0 0 30px rgba(0,255,136,0.7), 0 0 60px rgba(136,68,255,0.4)';
  });
  avatarImg.addEventListener('mouseleave', () => {
    avatarImg.parentElement.style.boxShadow =
      '0 0 20px rgba(0,255,136,0.4), 0 0 40px rgba(0,255,136,0.15)';
  });
}

/* ── Scanline flicker on hero ───────────────────────────────── */
(function initScanFlicker() {
  const scanlines = document.querySelector('.scanlines');
  if (!scanlines) return;
  setInterval(() => {
    const flicker = Math.random() < 0.06;
    scanlines.style.opacity = flicker ? (0.3 + Math.random() * 0.7).toString() : '1';
  }, 120);
})();

/* ── Smooth scroll for nav links ────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = document.getElementById('main-nav').offsetHeight;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── Console Easter Egg ─────────────────────────────────────── */
console.log('%c⚔ FRANK // CS-01 — GUNDAM PORTFOLIO ONLINE ⚔', 'color:#00ff88;font-size:16px;font-weight:bold;text-shadow:0 0 10px #00ff88;');
console.log('%cPress G to toggle Gundam Mode | Press M to toggle Music', 'color:#ff6600;font-size:12px;');