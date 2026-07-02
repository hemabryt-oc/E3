/* ═══════════════════════════════════════════════════
   E³ TECHNOLOGIES — APP.JS
   Single unified script for all 7 pages.
   Preloader · Hero Slideshow · Nav · Signal Progress
   Scroll Reveals · Counters · Stagger Animations
   Lazy Images · Scroll Progress · Portfolio Filter
   Lightbox · Category Filter · Newsletter · Contact
   Services Sticky Nav · Insights Modal
═══════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════════════════
   SCROLL PROGRESS BAR (top of every page)
══════════════════════════════════════════════════ */
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ══════════════════════════════════════════════════
   PRELOADER
══════════════════════════════════════════════════ */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  document.body.style.overflow = 'hidden';
  function release() {
    preloader.classList.add('hidden');
    document.body.style.overflow = '';
  }
  window.addEventListener('load', () => setTimeout(release, 1400));
  setTimeout(release, 3500); // safety net
})();

/* ══════════════════════════════════════════════════
   HERO SLIDESHOW (homepage only)
══════════════════════════════════════════════════ */
(function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-slide-dots .dot');
  if (!slides.length) return;

  let current = 0, timer = null;
  const DELAY = 5000;

  function goTo(idx) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }
  function start() { timer = setInterval(() => goTo(current + 1), DELAY); }
  function stop()  { clearInterval(timer); }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      stop(); goTo(parseInt(dot.dataset.index, 10)); start();
    });
  });
  start();

  // Preload non-active slide backgrounds
  slides.forEach((slide, i) => {
    if (i === 0) return;
    setTimeout(() => {
      const bg = getComputedStyle(slide).backgroundImage;
      const match = bg.match(/url\(["']?([^"')]+)["']?\)/);
      if (match) { const img = new Image(); img.src = match[1]; }
    }, i * 2000);
  });
})();

/* ══════════════════════════════════════════════════
   NAVBAR SCROLL EFFECT
══════════════════════════════════════════════════ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  function onScroll() { navbar.classList.toggle('scrolled', window.scrollY > 60); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ══════════════════════════════════════════════════
   HAMBURGER MENU
══════════════════════════════════════════════════ */
(function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ══════════════════════════════════════════════════
   ACTIVE NAV LINK HIGHLIGHT
══════════════════════════════════════════════════ */
(function initActiveNav() {
  const links   = document.querySelectorAll('.nav-links a, .mobile-menu a');
  const current = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const page = href.split('?')[0].split('#')[0];
    link.classList.toggle('active',
      page === current || (current === '' && page === 'index.html'));
  });
})();

/* ══════════════════════════════════════════════════
   SMOOTH ANCHOR SCROLL
══════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 80,
      behavior: 'smooth'
    });
  });
});

/* ══════════════════════════════════════════════════
   SIGNAL PROGRESS INDICATOR (homepage)
══════════════════════════════════════════════════ */
(function initSignalProgress() {
  const sp     = document.getElementById('signalProgress');
  const lines  = document.querySelectorAll('.sp-line');
  const labels = document.querySelectorAll('.sp-labels span');
  if (!sp) return;

  const divs = {
    build:     document.querySelectorAll('[data-div="build"]'),
    ecosystem: document.querySelectorAll('[data-div="ecosystem"]'),
    mission:   document.querySelectorAll('[data-div="mission"]'),
  };

  function getActive() {
    const mid = window.scrollY + window.innerHeight / 2;
    for (const [key, nodes] of Object.entries(divs)) {
      for (const sec of nodes) {
        const top = sec.getBoundingClientRect().top + window.scrollY;
        if (mid >= top && mid <= top + sec.offsetHeight) return key;
      }
    }
    return null;
  }

  function update() {
    sp.classList.toggle('visible', window.scrollY > 300);
    const active = getActive();
    lines.forEach(l  => l.classList.toggle('active', l.dataset.sec === active));
    labels.forEach(l => l.classList.toggle('active', l.dataset.sec === active));
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ══════════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════════ */
(function initReveal() {
  const sections = document.querySelectorAll('.reveal-section');
  if (!sections.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  sections.forEach(s => obs.observe(s));
})();

/* ══════════════════════════════════════════════════
   STAGGER CARD ANIMATIONS
══════════════════════════════════════════════════ */
(function initStagger() {
  const parents = document.querySelectorAll('.stagger-parent');
  if (!parents.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
  parents.forEach(p => obs.observe(p));
})();

/* ══════════════════════════════════════════════════
   PROBLEM BAR ANIMATION (homepage)
══════════════════════════════════════════════════ */
(function initProblemBars() {
  const fills = document.querySelectorAll('.problem-bar-fill');
  if (!fills.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const fill = e.target;
        const w = fill.getAttribute('data-width');
        setTimeout(() => {
          fill.style.setProperty('--target-width', w + '%');
          fill.classList.add('animated');
        }, 200);
        obs.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(f => obs.observe(f));
})();

/* ══════════════════════════════════════════════════
   PROCESS LINE ANIMATION (homepage)
══════════════════════════════════════════════════ */
(function initProcessLine() {
  const section = document.querySelector('.process-section');
  if (!section) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { section.classList.add('counted'); obs.unobserve(section); }
    });
  }, { threshold: 0.3 });
  obs.observe(section);
})();

/* ══════════════════════════════════════════════════
   MOBILE STICKY CTA BAR
══════════════════════════════════════════════════ */
(function initMobileStickyCta() {
  const bar = document.getElementById('mobileStickyCta');
  if (!bar) return;
  function onScroll() { bar.classList.toggle('visible', window.scrollY > 400); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ══════════════════════════════════════════════════
   LAZY IMAGE FADE-IN
══════════════════════════════════════════════════ */
(function initLazyImages() {
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  if (!imgs.length) return;
  imgs.forEach(img => {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load',  () => img.classList.add('loaded'), { once: true });
      img.addEventListener('error', () => {
        img.style.opacity = '0';
        img.style.position = 'absolute';
      }, { once: true });
    }
  });
})();

/* ══════════════════════════════════════════════════
   COUNTER ANIMATION
══════════════════════════════════════════════════ */
(function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const start  = performance.now();
    const dur    = 1800;
    function step(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(easeOut(p) * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
})();

/* ══════════════════════════════════════════════════
   STAT VALUE POP ANIMATION
══════════════════════════════════════════════════ */
(function initStatPop() {
  const stats = document.querySelectorAll('.mission-stat-card');
  if (!stats.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const val = e.target.querySelector('.ms-value');
        if (val && !val.classList.contains('popped')) {
          val.classList.add('popped');
          setTimeout(() => val.classList.remove('popped'), 500);
        }
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(s => obs.observe(s));
})();

/* ══════════════════════════════════════════════════
   ANIMATED BORDER (vision card)
══════════════════════════════════════════════════ */
(function initAnimatedBorder() {
  const cards = document.querySelectorAll('.animated-border');
  if (!cards.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.style.opacity = '1'; });
  }, { threshold: 0.3 });
  cards.forEach(c => obs.observe(c));
})();

/* ══════════════════════════════════════════════════
   IDEA CHIPS KEYBOARD NAV (homepage partnership)
══════════════════════════════════════════════════ */
(function initIdeaChips() {
  document.querySelectorAll('.idea-chip').forEach(chip => {
    chip.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); chip.click(); }
    });
  });
})();

/* ══════════════════════════════════════════════════
   PORTFOLIO — FILTER SYSTEM
══════════════════════════════════════════════════ */
(function initPortfolioFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  if (!btns.length) return;

  // Pre-filter from URL param
  const preFilter = new URLSearchParams(window.location.search).get('filter');
  if (preFilter) applyFilter(preFilter);

  btns.forEach(btn => btn.addEventListener('click', () => applyFilter(btn.dataset.filter)));

  function applyFilter(filter) {
    btns.forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
    items.forEach(item => {
      item.classList.toggle('hidden', filter !== 'all' && item.dataset.filter !== filter);
    });
  }
})();

/* ══════════════════════════════════════════════════
   PORTFOLIO — LIGHTBOX
   BUG FIX: use getComputedStyle for CSS-class backgrounds
══════════════════════════════════════════════════ */
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const backdrop = document.getElementById('lightboxBackdrop');
  const closeBtn = document.getElementById('lightboxClose');
  const items    = document.querySelectorAll('.gallery-item');
  if (!lightbox || !closeBtn) return;

  const tagLabels = {
    web:      'Website',
    mobile:   'Mobile App',
    ai:       'AI Systems',
    software: 'Custom Software'
  };

  function openLightbox(item) {
    // BUG FIX: read computed background (works for CSS class and inline styles)
    const computedBg = getComputedStyle(item).backgroundImage;
    const inlineBg   = item.style.backgroundImage || item.style.background || '';
    const bg = inlineBg || computedBg || '';

    const lbImage = document.getElementById('lbImage');
    if (lbImage) {
      // Apply background to lightbox image side
      lbImage.style.backgroundImage = bg;
      lbImage.style.backgroundSize     = 'cover';
      lbImage.style.backgroundPosition = 'center';
    }

    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val || '';
    };

    set('lbTitle',     item.dataset.title);
    set('lbClient',    item.dataset.client);
    set('lbStatBadge', item.dataset.stat);
    set('lbChallenge', item.dataset.challenge);
    set('lbApproach',  item.dataset.approach);
    set('lbOutcome',   item.dataset.outcome);

    const tagEl = document.getElementById('lbTag');
    if (tagEl) {
      tagEl.textContent = tagLabels[item.dataset.tag] || item.dataset.tag || '';
      tagEl.className   = 'gi-tag tag-' + (item.dataset.tag || '');
    }

    lightbox.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  items.forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(item); }
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
})();

/* ══════════════════════════════════════════════════
   SERVICES — STICKY NAV SCROLL SPY
══════════════════════════════════════════════════ */
(function initStickyServiceNav() {
  const nav = document.getElementById('stickyServiceNav');
  if (!nav) return;

  const links = nav.querySelectorAll('.ssn-link');
  const sectionIds = Array.from(links).map(l => l.getAttribute('href').replace('#', ''));
  const sections   = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  function update() {
    const mid = window.scrollY + 140;
    let activeId = null;
    sections.forEach(sec => {
      if (mid >= sec.offsetTop && mid < sec.offsetTop + sec.offsetHeight) activeId = sec.id;
    });
    links.forEach(link => {
      const isActive = link.getAttribute('href') === '#' + activeId;
      link.style.color      = isActive ? 'var(--white)' : '';
      link.style.background = isActive ? 'rgba(255,255,255,0.1)' : '';
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ══════════════════════════════════════════════════
   INSIGHTS — CATEGORY FILTER
══════════════════════════════════════════════════ */
(function initCategoryFilter() {
  const btns  = document.querySelectorAll('.category-btn');
  const cards = document.querySelectorAll('.article-card');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;
      cards.forEach(card => {
        card.classList.toggle('hidden', cat !== 'all' && card.dataset.category !== cat);
      });
    });
  });
})();

/* ══════════════════════════════════════════════════
   INSIGHTS — ARTICLE PREVIEW MODAL
══════════════════════════════════════════════════ */
(function initArticleModal() {
  const modal    = document.getElementById('articleModal');
  const backdrop = document.getElementById('articleModalBackdrop');
  const closeBtn = document.getElementById('articleModalClose');
  const titleEl  = document.getElementById('articleModalTitle');
  if (!modal || !closeBtn) return;

  document.querySelectorAll('.article-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const card = link.closest('.article-card');
      if (titleEl) titleEl.textContent = card?.querySelector('h3')?.textContent || 'Article';
      const cta = modal.querySelector('.btn-outline');
      if (cta) cta.setAttribute('href', link.getAttribute('href'));
      modal.classList.add('open');
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();

/* ══════════════════════════════════════════════════
   INSIGHTS — NEWSLETTER FORM
══════════════════════════════════════════════════ */
(function initNewsletter() {
  const form    = document.getElementById('newsletterForm');
  const success = document.getElementById('newsletterSuccess');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail');
    if (!email?.value.trim()) return;
    if (success) success.classList.add('show');
    email.value = '';
    setTimeout(() => success?.classList.remove('show'), 5000);
  });
})();

/* ══════════════════════════════════════════════════
   CONTACT — URL PARAM PRE-FILL
══════════════════════════════════════════════════ */
(function initContactPreFill() {
  const serviceSelect = document.getElementById('contactService');
  const messageField  = document.getElementById('contactMessage');
  if (!serviceSelect && !messageField) return;

  const params = new URLSearchParams(window.location.search);
  const serviceParam  = params.get('service');
  const industryParam = params.get('industry');
  const refParam      = params.get('ref');

  const serviceMap = {
    website: 'website', mobile: 'mobile', ai: 'ai',
    software: 'software', intelligence: 'intelligence', brand: 'brand'
  };
  const industryMsg = {
    retail:       'I run a retail/e-commerce business and need help with my digital presence.',
    'real-estate':'I work in real estate and need a website with lead generation tools.',
    beauty:       'I run a beauty/wellness business and need a website with booking.',
    construction: 'I run a construction business and need a website or digital tools.',
    finance:      'I work in finance/fintech and need a custom software solution.',
    ministry:     'I run a ministry or non-profit and need a website.',
    education:    'I work in education and need a learning platform or EdTech solution.',
    food:         'I run a restaurant/food business and need an ordering or menu system.',
    healthcare:   'I work in healthcare and am interested in digital tools including AI.',
  };
  const refMsg = {
    partnership:     'I have an idea/startup I would like to partner with E³ to build.',
    'academy-waitlist': 'I am interested in joining the E³ Academy waitlist.',
    'nurse-ai':      'I am interested in Nurse AI for my healthcare facility.',
    mercury:         'I am interested in Mercury AI for my business.',
    verify:          'I would like to partner with E³ on the Verify product.',
  };
  const ideaMsg = {
    business:'I want to build a business and need help with my digital setup.',
    startup: 'I am building a startup and need a technical partner.',
    app:     'I have an idea for a mobile app and would like to discuss building it.',
    ai:      'I have an AI product idea I would like to develop.',
    website: 'I need a professional website for my business.',
    health:  'I have a healthcare project that needs a digital solution.',
    edtech:  'I have an EdTech concept and need a technical partner.',
    other:   'I have an idea I would like to discuss with E³.',
  };

  if (serviceParam && serviceSelect && serviceMap[serviceParam]) {
    serviceSelect.value = serviceMap[serviceParam];
  }
  if (!messageField) return;
  if (refParam?.startsWith('idea-')) {
    const idea = refParam.replace('idea-', '');
    if (ideaMsg[idea]) messageField.value = ideaMsg[idea];
  } else if (industryParam && industryMsg[industryParam]) {
    messageField.value = industryMsg[industryParam];
  } else if (refParam && refMsg[refParam]) {
    messageField.value = refMsg[refParam];
  }
})();

/* ══════════════════════════════════════════════════
   CONTACT — FORM VALIDATION & SUBMISSION
══════════════════════════════════════════════════ */
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Clear previous errors
    form.querySelectorAll('.field-error').forEach(el => el.remove());
    form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

    const name     = document.getElementById('contactName');
    const email    = document.getElementById('contactEmail');
    const message  = document.getElementById('contactMessage');
    const phone    = document.getElementById('contactPhone');
    const service  = document.getElementById('contactService');
    const business = document.getElementById('contactBusiness');

    let valid = true;
    if (!name?.value.trim())  { showErr(name,    'Please enter your name.');          valid = false; }
    if (!email?.value.trim()) { showErr(email,   'Please enter your email address.'); valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      showErr(email, 'Please enter a valid email address.'); valid = false;
    }
    if (!message?.value.trim()) { showErr(message, 'Please tell us about your project.'); valid = false; }
    if (!valid) return;

    // Build pre-filled WhatsApp message
    const labels = {
      website:'Website Design', mobile:'Mobile App', ai:'AI Automation',
      software:'Custom Software', intelligence:'Business Intelligence',
      brand:'Brand Systems', ecosystem:'E³ Ecosystem Products', other:'Not sure yet'
    };
    let waMsg = `Hi E³ Technologies,\n\nMy name is ${name.value.trim()}.`;
    if (business?.value.trim()) waMsg += `\nBusiness: ${business.value.trim()}`;
    if (service?.value) waMsg += `\nService needed: ${labels[service.value] || service.value}`;
    waMsg += `\n\n${message.value.trim()}`;
    if (phone?.value.trim()) waMsg += `\n\nBest number: ${phone.value.trim()}`;
    waMsg += `\n\nEmail: ${email.value.trim()}`;

    const waLink = success?.querySelector('.fs-wa');
    if (waLink) waLink.href = 'https://wa.me/2347042776167?text=' + encodeURIComponent(waMsg);

    form.style.display = 'none';
    success?.classList.add('show');

    const panel = document.getElementById('contactFormPanel');
    if (panel) {
      window.scrollTo({
        top: panel.getBoundingClientRect().top + window.scrollY - 100,
        behavior: 'smooth'
      });
    }
  });

  function showErr(input, msg) {
    if (!input) return;
    input.classList.add('input-error');
    const err = document.createElement('span');
    err.className = 'field-error';
    err.textContent = msg;
    err.style.cssText = 'display:block;font-size:0.72rem;color:#EF4444;margin-top:0.25rem;font-family:var(--font-ui);';
    input.parentElement.appendChild(err);
    input.focus();
  }
})();
