import { projects } from './data.js';

export function setupSmoothScroll() {
  if (!window.Lenis) return null;
  const lenis = new Lenis({
    lerp: 0.12,
    smoothWheel: true,
    smoothTouch: false
  });

  let rafId = null;
  const raf = (time) => {
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  };

  const start = () => {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(raf);
  };

  const stop = () => {
    if (rafId === null) return;
    cancelAnimationFrame(rafId);
    rafId = null;
  };

  const destroy = () => {
    stop();
    if (typeof lenis.destroy === 'function') {
      lenis.destroy();
    }
  };

  start();

  return { lenis, start, stop, destroy };
}

export function setupScenes({ particles, reducedMotion }) {
  if (!window.gsap) {
    return { cleanup: () => {}, triggers: [], tweens: [] };
  }
  const ScrollTrigger = window.ScrollTrigger;
  const createdTriggers = [];
  const createdTweens = [];
  const sections = Array.from(document.querySelectorAll('.scene'));
  sections.forEach((section) => {
    const tint = section.dataset.sceneHex;
    window.gsap.set(section, { backgroundColor: 'transparent' });

    const trigger = ScrollTrigger?.create({
      trigger: section,
      start: 'top top',
      end: '+=150%',
      pin: true,
      pinSpacing: true,
      scrub: reducedMotion ? false : true,
      onEnter: () => {
        section.classList.add('scene--accent');
        if (tint) {
          particles?.setTint(tint);
        }
        const project = projects.find((p) => p.id === section.dataset.projectId);
        if (project) {
          particles?.setInteractivity({ motionLevel: 0.65 + project.particleBias * 0.2, pointSize: 8 });
        } else {
          particles?.setInteractivity({ motionLevel: 0.5, pointSize: 6 });
        }
      },
      onEnterBack: () => {
        section.classList.add('scene--accent');
        if (tint) {
          particles?.setTint(tint);
        }
      },
      onLeave: () => {
        section.classList.remove('scene--accent');
      },
      onLeaveBack: () => {
        section.classList.remove('scene--accent');
      }
    });
    if (trigger) {
      createdTriggers.push(trigger);
    }

    if (!reducedMotion) {
      const inner = section.querySelector('.scene__inner');
      const items = inner ? inner.querySelectorAll(':scope > *') : [];
      const tween = window.gsap.from(items, {
        opacity: 0,
        y: 32,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top center',
          toggleActions: 'play none none reverse'
        }
      });
      if (tween) {
        createdTweens.push(tween);
      }
    }
  });

  ScrollTrigger?.refresh?.();

  const cleanup = () => {
    createdTweens.splice(0).forEach((tween) => tween?.kill?.());
    createdTriggers.splice(0).forEach((scrollTrigger) => scrollTrigger?.kill?.());
    ScrollTrigger?.refresh?.();
  };

  return { cleanup, triggers: createdTriggers, tweens: createdTweens };
}
