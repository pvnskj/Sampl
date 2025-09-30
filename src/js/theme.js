const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

export const theme = {
  isReducedMotion: prefersReducedMotion.matches,
  init() {
    if (this.isReducedMotion) {
      document.body.classList.add('is-reduced-motion');
    }
    prefersReducedMotion.addEventListener('change', (event) => {
      this.isReducedMotion = event.matches;
      document.body.classList.toggle('is-reduced-motion', this.isReducedMotion);
      this.handleMotionToggle?.();
    });
    this.injectCursorAura();
    this.handleMotionToggle?.();
  },
  injectCursorAura() {
    const aura = document.createElement('div');
    aura.className = 'cursor-aura';
    document.body.appendChild(aura);
    const ripple = document.createElement('div');
    ripple.className = 'cursor-ripple';
    document.body.appendChild(ripple);

    let raf = 0;
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    aura.style.transform = `translate(${pointer.x}px, ${pointer.y}px)`;

    const updateAccent = () => {
      const accent = getComputedStyle(document.body).getPropertyValue('--accent-active');
      if (accent) {
        aura.style.setProperty('--cursor-accent', accent.trim());
        ripple.style.setProperty('--cursor-accent', accent.trim());
      }
    };

    const moveAura = () => {
      aura.style.transform = `translate(${pointer.x}px, ${pointer.y}px)`;
      raf = requestAnimationFrame(moveAura);
    };

    const handleMotionToggle = () => {
      if (this.isReducedMotion && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!this.isReducedMotion && !raf && aura.style.opacity !== '0') {
        raf = requestAnimationFrame(moveAura);
      }
    };
    this.handleMotionToggle = handleMotionToggle;

    document.addEventListener('pointermove', (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      aura.style.opacity = '1';
      if (!raf && !this.isReducedMotion) {
        raf = requestAnimationFrame(moveAura);
      }
      if (this.isReducedMotion) {
        aura.style.transform = `translate(${pointer.x}px, ${pointer.y}px)`;
      }
    });

    document.addEventListener('pointerleave', () => {
      aura.style.opacity = '0';
      cancelAnimationFrame(raf);
      raf = 0;
    });

    document.addEventListener('click', (event) => {
      ripple.style.left = `${event.clientX}px`;
      ripple.style.top = `${event.clientY}px`;
      ripple.classList.add('is-active');
      setTimeout(() => ripple.classList.remove('is-active'), 450);
    });

    const interactiveSelector = 'a, button, [role="button"], .glass-card, .skill-card, .tab';
    const toggleFocus = (state) => {
      aura.classList.toggle('is-focused', state);
    };

    document.addEventListener('pointerover', (event) => {
      if (event.target.closest(interactiveSelector)) {
        toggleFocus(true);
      }
    });

    document.addEventListener('pointerout', (event) => {
      if (!event.relatedTarget || !event.relatedTarget.closest(interactiveSelector)) {
        toggleFocus(false);
      }
    });

    document.addEventListener('focusin', (event) => {
      if (event.target.closest(interactiveSelector)) {
        toggleFocus(true);
      }
    });

    document.addEventListener('focusout', () => {
      toggleFocus(false);
    });

    const observer = new MutationObserver(updateAccent);
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
    updateAccent();
    handleMotionToggle();
  }
};
