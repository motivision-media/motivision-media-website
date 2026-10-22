/* ============================================
   NAV · scrolled state (only if a hero is present)
============================================ */
const nav = document.getElementById('nav');
if (nav && !nav.classList.contains('solid')) {
  const onScroll = () => {
    if (window.scrollY > 60) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ============================================
   ORDER MODAL (Aryeo embed)
============================================ */
const orderModal = document.getElementById('orderModal');
if (orderModal) {
  const orderModalClose = document.getElementById('orderModalClose');
  let aryeoLoaded = false;

  const openOrderModal = () => {
    orderModal.classList.add('active');
    orderModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (!aryeoLoaded) {
      const s = document.createElement('script');
      s.src = 'https://listings.motivision.media/embeds/motivision-media-llc';
      s.async = true;
      document.getElementById('aryeoEmbed').appendChild(s);
      aryeoLoaded = true;
    }
  };
  const closeOrderModal = () => {
    orderModal.classList.remove('active');
    orderModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  document.querySelectorAll('[data-order-open]').forEach(btn => {
    btn.addEventListener('click', (e) => { e.preventDefault(); openOrderModal(); });
  });
  if (orderModalClose) orderModalClose.addEventListener('click', closeOrderModal);
  orderModal.addEventListener('click', (e) => { if (e.target === orderModal) closeOrderModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && orderModal.classList.contains('active')) closeOrderModal();
  });
}

/* ============================================
   MOBILE MENU
============================================ */
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
if (navToggle && mobileMenu) {
  const toggleMenu = () => {
    const open = document.body.classList.toggle('menu-open');
    navToggle.setAttribute('aria-expanded', open);
    mobileMenu.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  navToggle.addEventListener('click', toggleMenu);
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (document.body.classList.contains('menu-open')) toggleMenu();
    });
  });
}

/* ============================================
   SCROLL REVEAL
============================================ */
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ============================================
   PORTFOLIO FILTER
============================================ */
const filters = document.querySelectorAll('.portfolio-filter');
if (filters.length) {
  const items = document.querySelectorAll('.pf-item');
  filters.forEach(f => {
    f.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      f.classList.add('active');
      const cat = f.dataset.filter;
      items.forEach(it => {
        const match = cat === 'all' || it.dataset.category === cat;
        if (match) {
          it.style.display = '';
          requestAnimationFrame(() => it.style.opacity = '1');
        } else {
          it.style.opacity = '0';
          setTimeout(() => { it.style.display = 'none'; }, 250);
        }
      });
    });
  });
}

/* ============================================
   LIGHTBOX (image portfolio items only)
============================================ */
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const lbImage = document.getElementById('lbImage');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  let lbIndex = 0;
  let lbList = [];

  const imageItems = () => Array.from(document.querySelectorAll('.pf-item:not(.video)'))
    .filter(el => el.style.display !== 'none');

  const showLightbox = () => {
    const el = lbList[lbIndex];
    lbImage.src = el.dataset.src;
    lbImage.alt = el.dataset.label || '';
  };
  const openLightbox = (el) => {
    lbList = imageItems();
    lbIndex = lbList.indexOf(el);
    if (lbIndex < 0) return;
    showLightbox();
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  const navLightbox = (dir) => {
    lbIndex = (lbIndex + dir + lbList.length) % lbList.length;
    showLightbox();
  };

  document.querySelectorAll('.pf-item:not(.video)').forEach((item) => {
    item.addEventListener('click', () => openLightbox(item));
  });
  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => navLightbox(-1));
  lbNext.addEventListener('click', () => navLightbox(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navLightbox(-1);
    if (e.key === 'ArrowRight') navLightbox(1);
  });
}

/* ============================================
   FAQ ACCORDION
============================================ */
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-question');
  const a = item.querySelector('.faq-answer');
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(other => {
      if (other !== item) {
        other.classList.remove('open');
        other.querySelector('.faq-answer').style.maxHeight = '0';
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      }
    });
    if (isOpen) {
      item.classList.remove('open');
      a.style.maxHeight = '0';
      q.setAttribute('aria-expanded', 'false');
    } else {
      item.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px';
      q.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ============================================
   SMOOTH SCROLL (in-page anchors)
============================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = a.getAttribute('href');
    if (target.length > 1 && document.querySelector(target)) {
      e.preventDefault();
      document.querySelector(target).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ============================================
   YOUTUBE EMBEDS (thumbnail first, iframe on click)
============================================ */
document.querySelectorAll('.yt[data-yt]').forEach(el => {
  const play = () => {
    if (el.classList.contains('playing')) return;
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${el.dataset.yt}?autoplay=1&rel=0&playsinline=1`;
    iframe.title = el.getAttribute('aria-label') || 'Listing video';
    iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    el.appendChild(iframe);
    el.classList.add('playing');
  };
  el.addEventListener('click', play);
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); }
  });
});

/* ============================================
   LEAD FORMS (post to the Motivision CRM lead-intake;
   the lead lands in the CRM and Kerby gets an email)
============================================ */
document.querySelectorAll('form.lead-form').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (form.dataset.source) data.message = `[${form.dataset.source}] ${data.message || ''}`.trim();
    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
    let ok = false;
    try {
      const res = await fetch('https://aytqefdwhkkfdwwxlzra.supabase.co/functions/v1/lead-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      ok = res.ok;
    } catch { ok = false; }
    const msg = document.createElement('p');
    msg.className = 'lead-form-msg';
    msg.innerHTML = ok
      ? 'Thanks. Kerby will get back to you within one business day. Need it faster? Call or text <a href="tel:18455360539">(845) 536-0539</a>.'
      : 'Something went wrong sending that. Please call or text <a href="tel:18455360539">(845) 536-0539</a> or email <a href="mailto:kerby@motivision.media">kerby@motivision.media</a>.';
    form.replaceWith(msg);
  });
});
