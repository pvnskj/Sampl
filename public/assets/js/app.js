import { theme } from './theme.js';
import { MagnoliaParticles } from './particles.js';
import { setupScenes, setupSmoothScroll } from './scenes.js';
import { renderUI } from './ui-cards.js';

function registerPlugins() {
  if (window.gsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
  }
}

function init() {
  registerPlugins();
  theme.init();

  const canvas = document.getElementById('particle-canvas');
  const particles = new MagnoliaParticles({ canvas, reducedMotion: theme.isReducedMotion });
  particles.init();

  renderUI({ particles, reducedMotion: theme.isReducedMotion });
  setupScenes({ particles, reducedMotion: theme.isReducedMotion });
  if (!theme.isReducedMotion) {
    setupSmoothScroll();
  }
}

document.addEventListener('DOMContentLoaded', init);
