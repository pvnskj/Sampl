export const projects = [
  {
    id: 'sunrise',
    title: 'Reinventing the TV Guide',
    hook: 'Designing a companion experience that feels like sunrise for streaming discovery.',
    outcome: 'Increased daily program saves by 36% within the first month.',
    images: ['./public/assets/sun.svg'],
    sceneTint: '#FFD9C7',
    particleBias: 0.25,
    content: {
      metrics: [
        { value: '36%', label: 'More saves' },
        { value: '4.8', label: 'App Store rating' },
        { value: '3x', label: 'Time-on-guide' }
      ],
      overview: '<p>Sunrise invites viewers to browse without friction. It reframes the TV guide into a personal morning ritual.</p>',
      methodology: '<p>Conducted diary studies, heuristic audits, and built rapid prototypes with a focus on accessibility.</p>',
      analysis: '<p>Identified cognitive load issues and surfaced personalized content clusters to reduce decision fatigue.</p>',
      results: '<p>Launched phased rollout with A/B testing; new guide delivered 22% faster path to watch.</p>',
      media: '<p>View interactive prototype and hero screens.</p>'
    }
  },
  {
    id: 'sunset',
    title: 'Gundersen Pharmacy',
    hook: 'Closing the loop on prescription care with a sunset-toned platform.',
    outcome: 'Reduced refill support tickets by 41% after redesign.',
    images: ['./public/assets/sun.svg'],
    sceneTint: '#F9B1C1',
    particleBias: 0.45,
    content: {
      metrics: [
        { value: '41%', label: 'Support ticket drop' },
        { value: '2x', label: 'Faster refills' },
        { value: '96%', label: 'Patient satisfaction' }
      ],
      overview: '<p>A warm pharmacy companion that guides patients from request to pickup with clarity.</p>',
      methodology: '<p>Partnered with clinicians to map workflows and craft empathetic messaging.</p>',
      analysis: '<p>Deployed service blueprints and stress-tested high-risk paths with moderated sessions.</p>',
      results: '<p>Handoff between pharmacists and patients now surfaces in-app notifications with action cards.</p>',
      media: '<p>Case study deck and motion mocks.</p>'
    }
  },
  {
    id: 'midnight',
    title: 'Validating “Live Rooms”',
    hook: 'A midnight study exploring intimacy and presence in live audio.',
    outcome: 'Defined the MVP narrative and shipped exploratory betas in eight weeks.',
    images: ['./public/assets/moon.svg'],
    sceneTint: '#E1D9F6',
    particleBias: 0.65,
    content: {
      metrics: [
        { value: '8 wks', label: 'Beta launch' },
        { value: '5 cohorts', label: 'Participatory research' },
        { value: '92%', label: 'Session completion' }
      ],
      overview: '<p>Live Rooms celebrates the intimacy of late-night conversations through respectful ambient design.</p>',
      methodology: '<p>Co-creation labs, generative storyboards, and multi-device prototyping.</p>',
      analysis: '<p>Mapped emotional peaks and drop-offs to craft adaptive moderation tools.</p>',
      results: '<p>Guided leadership buy-in and expanded roadmap for social presence features.</p>',
      media: '<p>Journey maps, audio scripts, and UI libraries.</p>'
    }
  }
];

export const about = {
  name: 'Magnolia Rivera',
  title: 'Product Designer & Narrative Systems Thinker',
  lines: [
    'Designing interactive stories that feel like seaside dawns.',
    'Crafting immersive product journeys for health, media, and community.',
    'Honoring craft, data, and inclusivity with every decision.'
  ],
  tags: ['Product Strategy', 'Narrative UX', 'Inclusive Research', 'Motion Systems']
};

export const skills = [
  { name: 'Journey Mapping' },
  { name: 'Service Design' },
  { name: 'Design Systems' },
  { name: 'Qualitative Research' },
  { name: 'Story Prototyping' },
  { name: 'Workshop Facilitation' },
  { name: 'Accessibility Audits' },
  { name: 'Motion Guidelines' }
];

export const testimonials = [
  {
    author: 'Casey Patel',
    role: 'Head of Product, StreamNow',
    quote: 'Magnolia choreographs product journeys like films. Every beat respects the audience.'
  },
  {
    author: 'Lena Ortiz',
    role: 'Director of Pharmacy, Gundersen',
    quote: 'She translated complex care pathways into warmth and confidence for patients.'
  },
  {
    author: 'Jordan Lee',
    role: 'VP Research, Chorus',
    quote: 'Live Rooms became a blueprint for respectful social spaces thanks to Magnolia\'s rigor.'
  }
];
