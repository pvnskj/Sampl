import { projects } from './data.js';
import { theme } from './theme.js';

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

function findProject(section) {
  return projects.find((project) => project.id === section.dataset.projectId);
}

function handleSceneEnter(section, particles) {
  const tint = section.dataset.sceneHex;
  section.classList.add('scene--accent');
  if (tint) {
    theme.setSceneGradient(tint);
    particles?.setTint(tint);
  }
  const project = findProject(section);
  if (project) {
    particles?.setInteractivity({ motionLevel: 0.65 + project.particleBias * 0.25, pointSize: 8 });
  } else {
    particles?.setInteractivity({ motionLevel: 0.5, pointSize: 6 });
  }
}

function handleSceneLeave(section) {
  section.classList.remove('scene--accent');
}

function animateScene(section, particles, reducedMotion) {
  const inner = section.querySelector('.scene__inner');
  if (!inner) return null;
  const copy = inner.querySelector('.scene__copy') || inner;
  const visual = inner.querySelector('.scene__visual');
  const timeline = window.gsap.timeline({
    defaults: { ease: 'power2.out' },
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: `+=${reducedMotion ? 120 : 200}%`,
      pin: true,
      pinSpacing: true,
      scrub: reducedMotion ? false : true,
      anticipatePin: 1,
      onEnter: () => handleSceneEnter(section, particles),
      onEnterBack: () => handleSceneEnter(section, particles),
      onLeave: () => handleSceneLeave(section),
      onLeaveBack: () => handleSceneLeave(section)
    }
  });

  const copyChildren = copy ? Array.from(copy.children) : [];
  if (visual) {
    timeline.from(visual, { y: 120, opacity: 0, duration: 0.9 });
  }
  if (copyChildren.length) {
    timeline.from(copyChildren, {
      y: 48,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12
    }, visual ? '-=0.5' : 0);
  }

  switch (section.id) {
    case 'scene-house': {
      timeline.add(() => particles?.waveSwell(0.35, 1000), 0.1);
      const lantern = section.querySelector('.house-visual__lantern');
      if (lantern && !reducedMotion) {
        timeline.fromTo(lantern, { opacity: 0.3 }, { opacity: 1, duration: 1.1, repeat: 1, yoyo: true }, '<');
      }
      break;
    }
    case 'scene-porch': {
      const person = section.querySelector('.porch-visual__person');
      if (person) {
        timeline.from(person, { x: -40, opacity: 0, duration: 0.7 }, '<');
      }
      break;
    }
    case 'scene-sunrise': {
      const metrics = inner.querySelectorAll('.metric');
      if (metrics.length) {
        timeline.from(metrics, { opacity: 0, y: 24, stagger: 0.1, duration: 0.6 }, '-=0.2');
      }
      timeline.add(() => particles?.burstFlower({ strength: 0.6 }), '>-0.1');
      break;
    }
    case 'scene-sunset': {
      const projectCard = inner.querySelector('.project-card');
      if (projectCard) {
        timeline.from(projectCard, { y: 60, opacity: 0, duration: 0.8 }, '<');
      }
      const glow = section.querySelector('.scene__orb-glow');
      if (glow && !reducedMotion) {
        timeline.fromTo(glow, { opacity: 0.3 }, { opacity: 0.8, duration: 0.9, yoyo: true, repeat: 1 }, '<');
      }
      break;
    }
    case 'scene-midnight': {
      const tabs = inner.querySelectorAll('.tab');
      if (tabs.length) {
        timeline.from(tabs, { opacity: 0, y: 16, stagger: 0.08, duration: 0.45 }, '-=0.2');
      }
      timeline.add(() => particles?.setInteractivity({ motionLevel: 0.85, pointSize: 9 }), '<');
      break;
    }
    case 'scene-return': {
      const skillCards = inner.querySelectorAll('.skill-card');
      if (skillCards.length) {
        timeline.from(skillCards, { opacity: 0, y: 28, stagger: 0.08, duration: 0.5 }, '-=0.15');
      }
      timeline.add(() => particles?.burstFlower({ strength: 0.45 }), '>-0.1');
      break;
    }
    case 'scene-guests': {
      const testimonials = inner.querySelectorAll('.testimonial-card');
      if (testimonials.length) {
        timeline.from(testimonials, { opacity: 0, y: 30, stagger: 0.12, duration: 0.6 }, '-=0.15');
      }
      timeline.add(() => particles?.burstFlower({ strength: 0.5 }), '>-0.05');
      break;
    }
    default:
      break;
  }

  return timeline;
}

export function setupScenes({ particles, reducedMotion }) {
  if (!window.gsap) return;
  const sections = Array.from(document.querySelectorAll('.scene'));
  sections.forEach((section) => {
    window.gsap.set(section, { backgroundColor: 'transparent' });
    animateScene(section, particles, reducedMotion);
  });

  if (sections[0]) {
    handleSceneEnter(sections[0], particles);
  }

  window.requestAnimationFrame(() => window.ScrollTrigger?.refresh());
}
