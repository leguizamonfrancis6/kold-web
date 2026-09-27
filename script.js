const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const contactForm = document.querySelector('#contact-form');
const queryField = document.querySelector('#contact-form textarea');
const counter = document.querySelector('#counter');
const formStatus = document.querySelector('#form-status');
const heroVideo = document.querySelector('.hero-video');
const heroSection = document.querySelector('.hero');
const shouldLoadHeroVideo = !window.matchMedia('(max-width: 760px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!shouldLoadHeroVideo && heroVideo) {
  heroVideo.remove();
}

const loadHeroVideo = () => {
  if (!heroVideo || heroVideo.dataset.loaded === 'true') return;

  const source = document.createElement('source');
  source.src = heroVideo.dataset.src;
  source.type = 'video/mp4';
  heroVideo.appendChild(source);
  heroVideo.dataset.loaded = 'true';
  heroVideo.load();
};

if (heroVideo) {
  heroVideo.addEventListener('loadeddata', () => {
    heroVideo.classList.add('is-visible');
  });

  if ('IntersectionObserver' in window && heroSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadHeroVideo();
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px 0px' }
    );

    observer.observe(heroSection);
  } else {
    window.addEventListener('load', loadHeroVideo, { once: true });
  }
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

if (queryField && counter) {
  queryField.addEventListener('input', () => {
    counter.textContent = `${queryField.value.length}/500`;
  });
}

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    formStatus.textContent = 'Enviando consulta...';
    formStatus.className = 'form-status';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('No se pudo enviar');
      contactForm.reset();
      counter.textContent = '0/500';
      formStatus.textContent = 'Gracias. Recibimos tu consulta y te contactaremos pronto.';
      formStatus.className = 'form-status success';
    } catch {
      formStatus.textContent = 'No pudimos enviar el mensaje. Escribinos directamente por email o WhatsApp.';
      formStatus.className = 'form-status error';
    }
  });
}

const clientGrid = document.querySelector('.client-grid');
const carouselButtons = document.querySelectorAll('[data-carousel-direction]');

if (clientGrid && carouselButtons.length) {
  const updateCarouselButtons = () => {
    const maxScroll = clientGrid.scrollWidth - clientGrid.clientWidth;
    carouselButtons.forEach((button) => {
      const direction = Number(button.dataset.carouselDirection);
      button.disabled = direction < 0 ? clientGrid.scrollLeft <= 1 : clientGrid.scrollLeft >= maxScroll - 1;
    });
  };

  carouselButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const firstCard = clientGrid.querySelector('.client-card');
      if (!firstCard) return;

      const gap = parseFloat(getComputedStyle(clientGrid).columnGap) || 0;
      const distance = firstCard.getBoundingClientRect().width + gap;
      const direction = Number(button.dataset.carouselDirection);
      clientGrid.scrollBy({ left: direction * distance, behavior: 'auto' });
    });
  });

  clientGrid.addEventListener('scroll', updateCarouselButtons, { passive: true });
  window.addEventListener('resize', updateCarouselButtons);
  updateCarouselButtons();
}
