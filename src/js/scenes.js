import { projects } from './data.js';

export function setupSmoothScroll() {
  if (!window.Lenis) return null;
  const lenis = new Lenis({
    lerp: 0.12,
    smoothWheel: true,
    smoothTouch: false
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  return lenis;
}

export function setupScenes({ particles, reducedMotion }) {
  if (!window.gsap) return;
  const ScrollTrigger = window.ScrollTrigger;
  const sections = Array.from(document.querySelectorAll('.scene'));
  sections.forEach((section) => {
    const tint = section.dataset.sceneHex;
    window.gsap.set(section, { backgroundColor: 'transparent' });

    ScrollTrigger?.create({
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

    if (!reducedMotion) {
      const inner = section.querySelector('.scene__inner');
      const items = inner ? inner.querySelectorAll(':scope > *') : [];
      window.gsap.from(items, {
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
    }
  });
}
