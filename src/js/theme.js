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
    });
    this.injectCursorAura();
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

    const moveAura = () => {
      aura.style.transform = `translate(${pointer.x}px, ${pointer.y}px)`;
      raf = requestAnimationFrame(moveAura);
    };

    document.addEventListener('pointermove', (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      aura.style.opacity = '1';
      if (!raf && !this.isReducedMotion) {
        raf = requestAnimationFrame(moveAura);
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
  }
};
