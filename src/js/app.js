import { theme, onMotionPreferenceChange } from './theme.js';
import { MagnoliaParticles } from './particles.js';
import { setupScenes, setupSmoothScroll } from './scenes.js';
import { renderUI } from './ui-cards.js';

function registerPlugins() {
  if (window.gsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
  }
}

let particlesInstance = null;
let lenisController = null;
let sceneControls = null;
let scrollTriggers = [];
let unsubscribeMotionPreference = null;
let currentReducedMotion = null;

function refreshScenes(reducedMotion) {
  if (sceneControls?.cleanup) {
    sceneControls.cleanup();
  }
  sceneControls = setupScenes({ particles: particlesInstance, reducedMotion });
  scrollTriggers = sceneControls?.triggers ?? [];
  if (typeof window !== 'undefined') {
    window.__scrollTriggers = scrollTriggers;
  }
}

function stopSmoothScroll() {
  if (!lenisController) return;
  lenisController.destroy?.();
  lenisController = null;
}

function startSmoothScroll() {
  if (lenisController) {
    lenisController.start?.();
    return;
  }
  lenisController = setupSmoothScroll();
}

function init() {
  registerPlugins();
  theme.init();

  const canvas = document.getElementById('particle-canvas');
  particlesInstance = new MagnoliaParticles({ canvas, reducedMotion: theme.isReducedMotion });
  particlesInstance.init();

  renderUI({ particles: particlesInstance, reducedMotion: theme.isReducedMotion });

  unsubscribeMotionPreference = onMotionPreferenceChange((isReducedMotion) => {
    if (!particlesInstance) return;
    if (currentReducedMotion === isReducedMotion) return;
    currentReducedMotion = isReducedMotion;

    particlesInstance.setReducedMotion(isReducedMotion);
    refreshScenes(isReducedMotion);

    if (isReducedMotion) {
      stopSmoothScroll();
    } else {
      startSmoothScroll();
    }
  });

  window.addEventListener('beforeunload', () => {
    unsubscribeMotionPreference?.();
    stopSmoothScroll();
    sceneControls?.cleanup?.();
  }, { once: true });
}

document.addEventListener('DOMContentLoaded', init);
