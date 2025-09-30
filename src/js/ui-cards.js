import { about, projects, skills, testimonials } from './data.js';

function createMetricElement(metric) {
  const metricEl = document.createElement('div');
  metricEl.className = 'metric';
  metricEl.dataset.counting = metric.value;
  const valueEl = document.createElement('div');
  valueEl.className = 'metric__value';
  valueEl.textContent = metric.value;
  const labelEl = document.createElement('div');
  labelEl.className = 'metric__label';
  labelEl.textContent = metric.label;
  metricEl.append(valueEl, labelEl);
  return metricEl;
}

function setupMetricCounter(metricEl, particles, reducedMotion) {
  if (reducedMotion) return;
  const value = metricEl.dataset.counting;
  const numberTarget = parseFloat(value);
  if (Number.isNaN(numberTarget)) return;
  const span = metricEl.querySelector('.metric__value');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const start = performance.now();
        const duration = 1200;
        const suffix = value.replace(/^[0-9.]+/, '');
        const animate = (time) => {
          const progress = Math.min((time - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = (numberTarget * eased).toFixed(value.includes('%') || Number.isInteger(numberTarget) ? 0 : 1);
          span.textContent = `${current}${suffix}`;
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            metricEl.classList.add('is-energized');
            particles?.burstFlower({ strength: 0.5 });
            setTimeout(() => metricEl.classList.remove('is-energized'), 900);
          }
        };
        requestAnimationFrame(animate);
        observer.disconnect();
      }
    });
  }, { threshold: 0.6 });
  observer.observe(metricEl);
}

function createTabs(panelData = [], idPrefix = 'panel') {
  const tabGroup = document.createElement('div');
  tabGroup.className = 'tab-group';
  tabGroup.setAttribute('role', 'tablist');

  const panels = document.createElement('div');
  panels.className = 'tab-panels';

  panelData.forEach((panel, index) => {
    const uniqueId = `${idPrefix}-${panel.id}-${Math.random().toString(36).slice(2, 7)}`;
    const tab = document.createElement('button');
    tab.className = 'tab';
    tab.type = 'button';
    tab.id = uniqueId;
    tab.role = 'tab';
    tab.textContent = panel.label;
    tab.setAttribute('aria-selected', index === 0);
    tab.setAttribute('aria-controls', `${uniqueId}-panel`);
    tabGroup.appendChild(tab);

    const panelEl = document.createElement('div');
    panelEl.className = 'tab-panel';
    panelEl.id = `${uniqueId}-panel`;
    panelEl.role = 'tabpanel';
    panelEl.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
    panelEl.innerHTML = panel.body;
    panels.appendChild(panelEl);
  });

  return { tabGroup, panels };
}

function enableTabs(container, particles) {
  const tabs = Array.from(container.querySelectorAll('.tab'));
  const panels = Array.from(container.querySelectorAll('.tab-panel'));
  if (!tabs.length) return;

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      tabs.forEach((btn, i) => {
        const selected = i === index;
        btn.setAttribute('aria-selected', selected);
        panels[i].setAttribute('aria-hidden', selected ? 'false' : 'true');
      });
      particles?.waveSwell(0.2, 800);
    });
  });
}

function renderProjectScene(project, particles, reducedMotion) {
  const section = document.querySelector(`#scene-${project.id}`);
  if (!section) return;
  section.style.setProperty('--scene-spectrum', project.spectrum);
  const card = document.createElement('article');
  card.className = 'glass-card project-card';
  card.tabIndex = 0;

  const header = document.createElement('header');
  header.innerHTML = `
    <p class="scene__eyebrow">${project.codename}</p>
    <h2 class="scene__title">${project.title}</h2>
    <p class="scene__subtitle">${project.hook}</p>
    <p>${project.outcome}</p>
  `;

  const metricGrid = document.createElement('div');
  metricGrid.className = 'metric-grid';
  project.content.metrics.forEach((metric) => {
    const metricEl = createMetricElement(metric);
    metricGrid.appendChild(metricEl);
    setupMetricCounter(metricEl, particles, reducedMotion);
  });

  const { tabGroup, panels } = createTabs(project.content.panels, project.id);

  const body = document.createElement('div');
  body.className = 'scene__content';
  body.append(metricGrid, tabGroup, panels);

  card.append(header, body);
  section.querySelector('.scene__inner').appendChild(card);
  enableTabs(card, particles);
}

function renderBriefingScene() {
  const section = document.querySelector('#scene-briefing .scene__inner');
  if (!section) return;
  section.innerHTML = '';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'scene__eyebrow';
  eyebrow.textContent = 'Crew Briefing';

  const title = document.createElement('h2');
  title.className = 'scene__title';
  title.textContent = about.name;

  const subtitle = document.createElement('p');
  subtitle.className = 'scene__subtitle';
  subtitle.textContent = about.title;

  const lines = document.createElement('div');
  lines.className = 'scene__content';
  about.lines.forEach((line) => {
    const p = document.createElement('p');
    p.textContent = line;
    lines.appendChild(p);
  });

  const tags = document.createElement('div');
  tags.className = 'scene__tags';
  about.tags.forEach((tag) => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = tag;
    tags.appendChild(span);
  });

  section.append(eyebrow, title, subtitle, lines, tags);
}

function renderGatewayScene() {
  const section = document.querySelector('#scene-gateway .scene__inner');
  if (!section) return;
  section.innerHTML = `
    <p class="scene__eyebrow">Trajectory Log</p>
    <h1 class="scene__title">Magnolia Rivera</h1>
    <p class="scene__subtitle">Designing luminous journeys where speculative futures become lived systems.</p>
    <div class="scene__content">
      <p>Scroll to sync with the mission timeline. Every scene unlocks a micro-interaction choreographed with the particle field.</p>
    </div>
  `;
}

function renderLabScene() {
  const section = document.querySelector('#scene-lab .scene__inner');
  if (!section) return;
  section.innerHTML = '';

  const headline = document.createElement('h2');
  headline.className = 'scene__title';
  headline.textContent = 'Lab & Availability';

  const preface = document.createElement('p');
  preface.className = 'scene__subtitle';
  preface.textContent = 'Crafting prototypes, frameworks, and alliances for near futures.';

  const skillsGrid = document.createElement('div');
  skillsGrid.className = 'skills-grid';
  skills.forEach((skill) => {
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.tabIndex = 0;
    card.innerHTML = `<strong>${skill.name}</strong>`;
    skillsGrid.appendChild(card);
  });

  const contactCard = document.createElement('div');
  contactCard.className = 'contact-card';
  contactCard.innerHTML = `
    <h3>Open channels</h3>
    <p>Currently guiding two missions and booking collaborations for Q4.</p>
    <p>Email <a href="mailto:hello@magnoliarivera.design">hello@magnoliarivera.design</a></p>
    <p>Based between orbital dock seven and Pacific timezones.</p>
  `;

  section.append(headline, preface, skillsGrid, contactCard);
}

function renderTestimonialsScene(particles) {
  const section = document.querySelector('#scene-allies .scene__inner');
  if (!section) return;
  section.innerHTML = '';

  const title = document.createElement('h2');
  title.className = 'scene__title';
  title.textContent = 'Allies & Signals';

  const subtitle = document.createElement('p');
  subtitle.className = 'scene__subtitle';
  subtitle.textContent = 'Transmission logs from collaborators across the network.';

  const track = document.createElement('div');
  track.className = 'testimonial-track';
  track.setAttribute('aria-live', 'polite');

  testimonials.forEach((testimonial) => {
    const card = document.createElement('article');
    card.className = 'testimonial-card';
    card.tabIndex = 0;
    card.innerHTML = `
      <p>“${testimonial.quote}”</p>
      <p><strong>${testimonial.author}</strong><br /><span class="scene__eyebrow">${testimonial.role}</span></p>
    `;
    track.appendChild(card);
  });

  section.append(title, subtitle, track);

  const cards = Array.from(track.children);
  if (!cards.length) return;

  let index = 0;

  const updateCarousel = () => {
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '24');
    const cardWidth = cards[0].offsetWidth;
    const offset = -index * (cardWidth + gap);
    track.style.transform = `translate3d(${offset}px, 0, 0)`;
  };

  const advance = () => {
    index = (index + 1) % cards.length;
    updateCarousel();
    particles?.burstFlower({ strength: 0.35 });
  };

  updateCarousel();

  let interval = setInterval(advance, 6200);

  track.addEventListener('pointerenter', () => clearInterval(interval));
  track.addEventListener('pointerleave', () => {
    interval = setInterval(advance, 6200);
  });

  window.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(interval);
    } else {
      interval = setInterval(advance, 6200);
    }
  });
}

export function renderUI({ particles, reducedMotion }) {
  renderGatewayScene();
  renderBriefingScene();
  projects.forEach((project) => renderProjectScene(project, particles, reducedMotion));
  renderLabScene();
  renderTestimonialsScene(particles);
}
