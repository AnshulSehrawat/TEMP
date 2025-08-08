// Utility: clamp
const clamp = (n, min, max) => Math.max(min, Math.min(n, max));

// Custom cursor
(function customCursor() {
  const cursor = document.getElementById('cursor');
  let x = window.innerWidth / 2, y = window.innerHeight / 2;
  let tx = x, ty = y;

  const move = (e) => {
    x = e.clientX; y = e.clientY;
  };

  const render = () => {
    // ease toward pointer
    tx += (x - tx) * 0.18;
    ty += (y - ty) * 0.18;
    cursor.style.transform = `translate(${tx - 0.5}px, ${ty - 0.5}px)`;
    requestAnimationFrame(render);
  };

  window.addEventListener('mousemove', move, { passive: true });

  // Grow cursor when hovering interactive elements
  const grow = () => cursor.classList.add('cursor-big');
  const shrink = () => cursor.classList.remove('cursor-big');

  const hoverables = [...document.querySelectorAll('.hoverable, a, button, .card')];
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', grow);
    el.addEventListener('mouseleave', shrink);
  });

  // Hide on touch devices
  const isTouch = matchMedia('(hover: none)').matches;
  if (isTouch) cursor.style.display = 'none';

  render();
})();

// Mobile nav toggle
(function navToggle() {
  const btn = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();

// Reveal on scroll
(function revealOnScroll() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
  items.forEach(el => io.observe(el));
})();

// Keyboard navigation for horizontal carousel
(function carouselKeys() {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  const scrollBy = () => {
    const colWidth = carousel.querySelector('.card')?.getBoundingClientRect().width || 400;
    return colWidth + 24; // gap
  };

  const onKey = (e) => {
    if (e.key === 'ArrowRight') {
      carousel.scrollBy({ left: scrollBy(), behavior: 'smooth' });
    } else if (e.key === 'ArrowLeft') {
      carousel.scrollBy({ left: -scrollBy(), behavior: 'smooth' });
    }
  };
  carousel.addEventListener('keydown', onKey);
})();

// Parallax tilt on cards
(function tiltCards() {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    let rect;
    card.addEventListener('mouseenter', () => rect = card.getBoundingClientRect());
    card.addEventListener('mousemove', (e) => {
      if (!rect) rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;  // 0..1
      const py = (e.clientY - rect.top) / rect.height;  // 0..1
      const rx = (0.5 - py) * 6; // rotateX
      const ry = (px - 0.5) * 6; // rotateY
      card.style.transform = `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      rect = null;
    });
  });
})();

// Staggered hero title pop-in
(function heroStagger() {
  const chunks = document.querySelectorAll('.title-chunk, .title-dot');
  chunks.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px) scale(0.98)';
    setTimeout(() => {
      el.style.transition = 'transform 500ms cubic-bezier(.2,.8,.2,1), opacity 500ms ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0) scale(1)';
    }, 100 + i * 120);
  });
})();

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();