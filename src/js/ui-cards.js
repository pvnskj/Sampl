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
          const current = (numberTarget * eased).toFixed(value.includes('%') ? 0 : 1);
          span.textContent = `${current}${suffix}`;
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            metricEl.classList.add('is-energized');
            particles?.burstFlower({ strength: 0.6 });
            setTimeout(() => metricEl.classList.remove('is-energized'), 800);
          }
        };
        requestAnimationFrame(animate);
        observer.disconnect();
      }
    });
  }, { threshold: 0.6 });
  observer.observe(metricEl);
}

function createTabs(content) {
  const tabIds = Object.keys(content);
  const tabGroup = document.createElement('div');
  tabGroup.className = 'tab-group';
  tabGroup.setAttribute('role', 'tablist');

  const panels = document.createElement('div');
  panels.className = 'tab-panels';

  tabIds.forEach((key, index) => {
    const tab = document.createElement('button');
    tab.className = 'tab';
    tab.type = 'button';
    tab.id = `tab-${key}-${Math.random().toString(36).slice(2, 7)}`;
    tab.role = 'tab';
    tab.textContent = key.charAt(0).toUpperCase() + key.slice(1);
    tab.setAttribute('aria-selected', index === 0);
    tab.setAttribute('aria-controls', `${tab.id}-panel`);
    tabGroup.appendChild(tab);

    const panel = document.createElement('div');
    panel.className = 'tab-panel';
    panel.id = `${tab.id}-panel`;
    panel.role = 'tabpanel';
    panel.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
    panel.innerHTML = content[key];
    panels.appendChild(panel);
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
      particles?.waveSwell(0.25, 900);
    });
  });
}

function renderProjectScene(project, particles, reducedMotion) {
  const section = document.querySelector(`#scene-${project.id}`);
  if (!section) return;
  const card = document.createElement('article');
  card.className = 'glass-card project-card';
  card.tabIndex = 0;

  const header = document.createElement('header');
  header.innerHTML = `
    <p class="scene__eyebrow">${project.id.toUpperCase()}</p>
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

  const { tabGroup, panels } = createTabs({
    overview: project.content.overview,
    methodology: project.content.methodology,
    analysis: project.content.analysis,
    results: project.content.results,
    media: project.content.media
  });

  const body = document.createElement('div');
  body.className = 'scene__content';
  body.append(metricGrid, tabGroup, panels);

  card.append(header, body);
  section.querySelector('.scene__inner').appendChild(card);
  enableTabs(card, particles);
}

function renderAboutScene() {
  const section = document.querySelector('#scene-porch .scene__inner');
  if (!section) return;
  const title = document.createElement('h1');
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
  section.append(title, subtitle, lines, tags);
}

function renderHomeScene() {
  const section = document.querySelector('#scene-house .scene__inner');
  if (!section) return;
  section.innerHTML = `
    <h1 class="scene__title">Magnolia Rivera</h1>
    <p class="scene__subtitle">Narrative Product Designer guiding experiences from dawn to midnight.</p>
    <div class="scene__content">
      <p>Scroll to step into the story.</p>
    </div>
  `;
}

function renderSkillsScene() {
  const section = document.querySelector('#scene-return .scene__inner');
  if (!section) return;
  const headline = document.createElement('h2');
  headline.className = 'scene__title';
  headline.textContent = 'Skills & Contact';

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
    <h3>Let\'s co-create</h3>
    <p>Email <a href="mailto:hello@magnoliarivera.design">hello@magnoliarivera.design</a></p>
    <p>Based in Santa Cruz, collaborating globally.</p>
  `;

  section.append(headline, skillsGrid, contactCard);
}

function renderTestimonialsScene(particles) {
  const section = document.querySelector('#scene-guests .scene__inner');
  if (!section) return;
  const title = document.createElement('h2');
  title.className = 'scene__title';
  title.textContent = 'Guests & Reflections';
  const subtitle = document.createElement('p');
  subtitle.className = 'scene__subtitle';
  subtitle.textContent = 'Voices from collaborators along the shore.';

  const track = document.createElement('div');
  track.className = 'testimonial-track';

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

  let index = 0;
  const cards = Array.from(track.children);

  const updateCarousel = () => {
    if (!cards.length) return;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || '24');
    const cardWidth = cards[0].offsetWidth;
    const offset = -index * (cardWidth + gap);
    track.style.transform = `translateX(${offset}px)`;
  };

  const advance = () => {
    index = (index + 1) % cards.length;
    updateCarousel();
    particles?.burstFlower({ strength: 0.4 });
  };

  updateCarousel();

  let interval = setInterval(advance, 6000);

  track.addEventListener('pointerenter', () => clearInterval(interval));
  track.addEventListener('pointerleave', () => {
    interval = setInterval(advance, 6000);
  });

  window.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(interval);
    } else {
      interval = setInterval(advance, 6000);
    }
  });
}

export function renderUI({ particles, reducedMotion }) {
  renderHomeScene();
  renderAboutScene();
  projects.forEach((project) => renderProjectScene(project, particles, reducedMotion));
  renderSkillsScene();
  renderTestimonialsScene(particles);
}
