/**
 * Projects page: scroll-trigger transition (Human → AI connection → Projects grid)
 * Uses GSAP ScrollTrigger when available; degrades gracefully without it.
 */
(function () {
  function init() {
    const hero = document.getElementById('projects-hero');
    const listSection = document.getElementById('projects-list');
    if (!hero || !listSection) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      listSection.classList.add('connection-active');
      return;
    }

    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      // Start with list section content ready to reveal (no flash overlay required for simplicity)
      const listInner = listSection.querySelector('.section-inner');
      if (listInner) {
        gsap.set(listInner, { opacity: 0, y: 32 });
      }

      ScrollTrigger.create({
        trigger: hero,
        start: 'bottom 80%',
        end: 'bottom 20%',
        onEnter: function () {
          listSection.classList.add('connection-active');
          if (listInner) {
            gsap.to(listInner, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
          }
        },
        once: true
      });

      // Optional: subtle flash element (brief glow) at the moment of transition
      const flash = document.createElement('div');
      flash.setAttribute('aria-hidden', 'true');
      flash.className = 'projects-connection-flash';
      listSection.appendChild(flash);

      ScrollTrigger.create({
        trigger: hero,
        start: 'bottom 85%',
        onEnter: function () {
          flash.classList.add('active');
          setTimeout(function () {
            flash.classList.remove('active');
          }, 600);
        },
        once: true
      });
    } else {
      listSection.classList.add('connection-active');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
