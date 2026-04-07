/**
 * Gushwork Assignment - Product Page
 * Vanilla JS: Carousel, FAQ Accordion, Sticky Header, Zoom
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initImageCarousel();
  initZoom();
  initMobileNav();
  initCarousel();
  initProcessTabs();
  initFaqAccordion();
  initCatalogueForm();
  initModals();
});

/* ============================================
   STICKY HEADER
   Shows when scrolling DOWN past first fold (hero section),
   hides when scrolling back UP.
   Positioned above the navbar.
   ============================================ */
function initStickyHeader() {
  const stickyHeader = document.getElementById('stickyHeader');
  const heroSection = document.getElementById('heroSection');
  if (!stickyHeader || !heroSection) return;

  let lastScrollY = 0;
  let ticking = false;

  function update() {
    const currentScrollY = window.scrollY;
    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
    const scrollingDown = currentScrollY > lastScrollY;

    /* Show sticky header only when:
       1. Scrolled past the first fold (hero section)
       2. Scrolling DOWN */
    if (currentScrollY > heroBottom && scrollingDown) {
      stickyHeader.classList.add('sticky-header--visible');
    } else if (!scrollingDown || currentScrollY <= heroBottom) {
      stickyHeader.classList.remove('sticky-header--visible');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================
   PRODUCT IMAGE CAROUSEL
   Arrow navigation + thumbnail clicks
   ============================================ */
function initImageCarousel() {
  const mainImage = document.getElementById('mainImage');
  const thumbs = document.querySelectorAll('.carousel__thumb');
  const prevBtn = document.getElementById('imgPrevBtn');
  const nextBtn = document.getElementById('imgNextBtn');
  if (!mainImage || !thumbs.length) return;

  const imageSrc = 'assets/process-image.jpg';
  const images = [
    { src: imageSrc, alt: 'HDPE Pipe Installation' },
    { src: imageSrc, alt: 'HDPE Pipe Close-up' },
    { src: imageSrc, alt: 'HDPE Manufacturing' },
    { src: imageSrc, alt: 'HDPE Pipe Coils' },
    { src: imageSrc, alt: 'Infrastructure Project' }
  ];

  let current = 0;

  function goTo(index) {
    current = index;
    mainImage.src = images[index].src;
    mainImage.alt = images[index].alt;
    thumbs.forEach((t, i) => {
      t.classList.toggle('carousel__thumb--active', i === index);
      t.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
  }

  thumbs.forEach(t => t.addEventListener('click', () => goTo(parseInt(t.dataset.index, 10))));
  if (prevBtn) prevBtn.addEventListener('click', () => goTo((current - 1 + images.length) % images.length));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo((current + 1) % images.length));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
    if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
  });
}

/* ============================================
   ZOOM ON HOVER
   Uses background-image on the preview panel
   for reliable zoom positioning.
   ============================================ */
function initZoom() {
  const carouselMain = document.getElementById('carouselMain');
  const mainImage = document.getElementById('mainImage');
  const lens = document.getElementById('zoomLens');
  const preview = document.getElementById('zoomPreview');
  if (!carouselMain || !mainImage || !lens || !preview) return;

  const ZOOM = 2.5;
  const LENS_SIZE = 120;

  carouselMain.addEventListener('mouseenter', () => {
    /* Set the preview to use background-image for reliable zoom */
    preview.style.backgroundImage = 'url(' + mainImage.src + ')';
    const rect = carouselMain.getBoundingClientRect();
    preview.style.backgroundSize = (rect.width * ZOOM) + 'px ' + (rect.height * ZOOM) + 'px';
    preview.classList.add('carousel__zoom-preview--visible');
  });

  carouselMain.addEventListener('mouseleave', () => {
    preview.classList.remove('carousel__zoom-preview--visible');
  });

  carouselMain.addEventListener('mousemove', (e) => {
    const rect = carouselMain.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    /* Position lens (clamped to bounds) */
    const lx = Math.max(0, Math.min(x - LENS_SIZE / 2, rect.width - LENS_SIZE));
    const ly = Math.max(0, Math.min(y - LENS_SIZE / 2, rect.height - LENS_SIZE));
    lens.style.left = lx + 'px';
    lens.style.top = ly + 'px';

    /* Calculate percentage position */
    const percX = x / rect.width;
    const percY = y / rect.height;

    /* Move background in preview, clamped to avoid black edges */
    const zoomW = rect.width * ZOOM;
    const zoomH = rect.height * ZOOM;
    const previewRect = preview.getBoundingClientRect();

    let bgX = (percX * zoomW) - (previewRect.width / 2);
    let bgY = (percY * zoomH) - (previewRect.height / 2);

    /* Clamp so background never goes past image edges */
    bgX = Math.max(0, Math.min(bgX, zoomW - previewRect.width));
    bgY = Math.max(0, Math.min(bgY, zoomH - previewRect.height));

    preview.style.backgroundPosition = '-' + bgX + 'px -' + bgY + 'px';
  });
}

/* ============================================
   MOBILE NAV (hamburger toggle)
   ============================================ */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });
}

/* ============================================
   CAROUSEL
   Horizontal scrolling with arrow navigation.
   Cards peek from edges for visual depth.
   ============================================ */
function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  if (!track || !prevBtn || !nextBtn) return;

  /* Calculate scroll amount based on one card width + gap */
  function getScrollAmount() {
    const card = track.querySelector('.carousel-card');
    if (!card) return 300;
    const style = getComputedStyle(track);
    const gap = parseInt(style.gap) || 24;
    return card.offsetWidth + gap;
  }

  /* Start carousel in the middle so user can scroll both left and right */
  function scrollToMiddle() {
    const totalScroll = track.scrollWidth - track.clientWidth;
    track.scrollLeft = totalScroll / 2;
  }

  /* Wait for images to load before centering */
  const images = track.querySelectorAll('img');
  let loaded = 0;
  if (images.length === 0) {
    scrollToMiddle();
  } else {
    images.forEach((img) => {
      if (img.complete) {
        loaded++;
        if (loaded === images.length) scrollToMiddle();
      } else {
        img.addEventListener('load', () => {
          loaded++;
          if (loaded === images.length) scrollToMiddle();
        });
      }
    });
    /* Fallback: center after short delay in case images are cached */
    setTimeout(scrollToMiddle, 100);
  }

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
  });

  /* Touch/drag support for mobile */
  let isDown = false;
  let startX;
  let scrollLeft;

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    track.style.cursor = 'grabbing';
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener('mouseleave', () => {
    isDown = false;
    track.style.cursor = 'grab';
  });

  track.addEventListener('mouseup', () => {
    isDown = false;
    track.style.cursor = 'grab';
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeft - walk;
  });
}

/* ============================================
   MANUFACTURING PROCESS TABS
   Desktop: click tabs. Tablet/Mobile: prev/next.
   ============================================ */
function initProcessTabs() {
  const tabs = document.querySelectorAll('.process__tab');
  const badge = document.getElementById('processStepBadge');
  const title = document.getElementById('processCardTitle');
  const desc = document.getElementById('processCardDesc');
  const bullets = document.getElementById('processCardBullets');
  const prevBtn = document.getElementById('processPrev');
  const nextBtn = document.getElementById('processNext');

  if (!tabs.length || !badge) return;

  /* Step data for all 8 manufacturing stages */
  const steps = [
    {
      name: 'Raw Material',
      title: 'High-Grade Raw Material Selection',
      desc: 'Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.',
      bullets: ['PE100 grade material', 'Optimal molecular weight distribution']
    },
    {
      name: 'Extrusion',
      title: 'Precision Extrusion Process',
      desc: 'State-of-the-art single and twin screw extruders heat and shape the raw HDPE material into continuous pipe profiles with precise wall thickness.',
      bullets: ['Temperature-controlled zones', 'Consistent melt flow rate']
    },
    {
      name: 'Cooling',
      title: 'Controlled Cooling System',
      desc: 'Multi-stage cooling tanks gradually reduce pipe temperature to prevent warping and ensure dimensional stability throughout the length.',
      bullets: ['Spray and immersion cooling', 'Uniform crystallization']
    },
    {
      name: 'Sizing',
      title: 'Vacuum Sizing Calibration',
      desc: 'Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.',
      bullets: ['Tight tolerance control', 'Automated diameter monitoring']
    },
    {
      name: 'Quality Control',
      title: 'Rigorous Quality Testing',
      desc: 'Every pipe undergoes comprehensive quality checks including hydrostatic testing, dimensional verification, and material property analysis.',
      bullets: ['100% pressure testing', 'ISO 4427 compliance']
    },
    {
      name: 'Marking',
      title: 'Permanent Product Marking',
      desc: 'Laser and inkjet marking systems apply essential product information including size, pressure rating, manufacturing date, and batch traceability codes.',
      bullets: ['Full traceability', 'BIS marking standards']
    },
    {
      name: 'Cutting',
      title: 'Precision Cutting & Finishing',
      desc: 'Automated planetary saws deliver clean, burr-free cuts at specified lengths while maintaining pipe end squareness for reliable joint connections.',
      bullets: ['Chip-free cutting technology', 'Custom length capability']
    },
    {
      name: 'Packaging',
      title: 'Secure Packaging & Dispatch',
      desc: 'Pipes are carefully bundled, strapped, and loaded using proper handling equipment to prevent damage during transportation and storage.',
      bullets: ['Protective bundling', 'Safe logistics handling']
    }
  ];

  let current = 0;

  function goToStep(index) {
    current = index;
    const step = steps[index];

    /* Update tabs (desktop) */
    tabs.forEach((tab, i) => {
      tab.classList.toggle('process__tab--active', i === index);
      tab.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });

    /* Update badge (tablet/mobile) */
    badge.textContent = `Step ${index + 1}/${steps.length}: ${step.name}`;

    /* Update card content */
    title.textContent = step.title;
    desc.textContent = step.desc;
    bullets.innerHTML = step.bullets
      .map(b => `<li><span class="dot dot--blue" aria-hidden="true"></span>${b}</li>`)
      .join('');
  }

  /* Tab click handlers */
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      goToStep(parseInt(tab.dataset.step, 10));
    });
  });

  /* Prev / Next (mobile) */
  prevBtn.addEventListener('click', () => {
    goToStep((current - 1 + steps.length) % steps.length);
  });

  nextBtn.addEventListener('click', () => {
    goToStep((current + 1) % steps.length);
  });
}

/* ============================================
   FAQ ACCORDION
   Toggle open/close with smooth animation.
   Only one item open at a time.
   ============================================ */
function initFaqAccordion() {
  const accordion = document.getElementById('faqAccordion');
  if (!accordion) return;

  const items = accordion.querySelectorAll('.faq__item');

  items.forEach((item) => {
    const btn = item.querySelector('.faq__question');

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('faq__item--active');

      /* Close all items first */
      items.forEach((i) => {
        i.classList.remove('faq__item--active');
        i.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      });

      /* If clicked item wasn't active, open it */
      if (!isActive) {
        item.classList.add('faq__item--active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ============================================
   CATALOGUE FORM
   Basic form submit handler (prevents default)
   ============================================ */
function initCatalogueForm() {
  const form = document.getElementById('catalogueForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.querySelector('.catalogue-cta__input').value;
    if (email) {
      alert('Thank you! The catalogue will be sent to ' + email);
      form.reset();
    }
  });
}

/* ============================================
   MODALS
   Open/close with data-modal triggers.
   Modal 1 (catalogueModal): "Download Full Technical Datasheet"
   Modal 2 (callbackModal): Quote / Contact buttons
   ============================================ */
function initModals() {
  /* Open modal: any button with data-modal attribute */
  document.querySelectorAll('[data-modal]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('modal-overlay--active');
        document.body.style.overflow = 'hidden';
        /* Focus first input */
        const firstInput = modal.querySelector('.modal__input');
        if (firstInput) setTimeout(() => firstInput.focus(), 300);
      }
    });
  });

  /* Close modal: close button */
  document.querySelectorAll('.modal__close').forEach((btn) => {
    btn.addEventListener('click', () => {
      closeAllModals();
    });
  });

  /* Close modal: click overlay background */
  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeAllModals();
    });
  });

  /* Close modal: Escape key */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  /* Form submissions */
  const catForm = document.getElementById('catalogueModalForm');
  if (catForm) {
    catForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you! The catalogue will be emailed to you shortly.');
      catForm.reset();
      closeAllModals();
    });
  }

  const cbForm = document.getElementById('callbackModalForm');
  if (cbForm) {
    cbForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you! We will call you back shortly.');
      cbForm.reset();
      closeAllModals();
    });
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach((m) => {
    m.classList.remove('modal-overlay--active');
  });
  document.body.style.overflow = '';
}
