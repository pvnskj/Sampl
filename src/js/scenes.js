import { projects } from './data.js';

const ATMOSPHERE_SETTINGS = {
  aurora: { motion: 0.52, pointSize: 7.5 },
  halo: { motion: 0.4, pointSize: 6.5 },
  ion: { motion: 0.68, pointSize: 7.5 },
  pulse: { motion: 0.72, pointSize: 8.2 },
  lumen: { motion: 0.6, pointSize: 7.8 },
  drift: { motion: 0.45, pointSize: 6.8 },
  echo: { motion: 0.5, pointSize: 7 }
};

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

function applyAtmosphere(section) {
  const spectrum = section.dataset.spectrum;
  if (spectrum) {
    section.style.setProperty('--scene-spectrum', spectrum);
  }
}

function handleTheme(section, particles) {
  const atmosphere = section.dataset.atmosphere;
  if (atmosphere) {
    document.body.dataset.theme = atmosphere;
  }
  const spectrum = section.dataset.spectrum;
  if (spectrum) {
    particles?.setTint(spectrum);
  }

  const settings = ATMOSPHERE_SETTINGS[atmosphere] || { motion: 0.5, pointSize: 7 };
  const project = projects.find((p) => p.id === section.dataset.projectId);
  if (project) {
    const motionLevel = Math.min(1, settings.motion + project.particleBias * 0.35);
    const pointSize = settings.pointSize + project.particleBias * 3;
    particles?.setInteractivity({ motionLevel, pointSize });
  } else {
    particles?.setInteractivity({ motionLevel: settings.motion, pointSize: settings.pointSize });
  }
}

export function setupScenes({ particles, reducedMotion }) {
  if (!window.gsap || !window.ScrollTrigger) return;
  const { gsap } = window;
  const ScrollTrigger = window.ScrollTrigger;
  const sections = Array.from(document.querySelectorAll('.scene'));

  if (sections.length) {
    applyAtmosphere(sections[0]);
    handleTheme(sections[0], particles);
    sections[0].classList.add('scene--accent');
  }

  sections.forEach((section) => {
    applyAtmosphere(section);

    const items = section.querySelectorAll('.scene__inner > *');

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: reducedMotion ? 'bottom top' : '+=160%',
      pin: reducedMotion ? false : true,
      pinSpacing: reducedMotion ? false : true,
      scrub: reducedMotion ? false : 0.4,
      onEnter: () => {
        section.classList.add('scene--accent');
        handleTheme(section, particles);
      },
      onEnterBack: () => {
        section.classList.add('scene--accent');
        handleTheme(section, particles);
      },
      onLeave: () => {
        section.classList.remove('scene--accent');
      },
      onLeaveBack: () => {
        section.classList.remove('scene--accent');
      }
    });

    if (!reducedMotion && items.length) {
      gsap.from(items, {
        opacity: 0,
        y: 36,
        duration: 0.9,
        stagger: 0.18,
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
