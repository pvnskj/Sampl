export const projects = [
  {
    id: 'signal',
    codename: 'Mission 01',
    title: 'Signal Array — Telemetry for Orbital Clinics',
    hook: 'Stabilising remote-care constellations with predictive telemetry and empathic triage scripts.',
    outcome: 'Compressed escalation loops to twelve minutes across six outer-orbit stations.',
    images: ['./public/assets/sun.svg'],
    spectrum: '#DFF6FF',
    particleBias: 0.35,
    content: {
      metrics: [
        { value: '12 min', label: 'Escalation loop' },
        { value: '6 stations', label: 'Linked orbitals' },
        { value: '97%', label: 'Operator confidence' }
      ],
      panels: [
        {
          id: 'mission',
          label: 'Mission Brief',
          body: '<p>Rewired telemetry so clinicians receive calm, prioritised context instead of alarm storms. Built bilingual voice rituals that keep patients grounded while satellites align.</p>'
        },
        {
          id: 'system',
          label: 'System Mesh',
          body: '<p>Modelled care loops with bio-signal scientists, resulting in a distributed dashboard where each orbital sees planetary load, queue health, and emergent anomalies.</p>'
        },
        {
          id: 'interface',
          label: 'Interface Rituals',
          body: '<p>Crafted ambient UI with adaptive typography for zero-g tablets, layering haptic cues for gloved responders and high-contrast night ops.</p>'
        },
        {
          id: 'proof',
          label: 'Proof & Telemetry',
          body: '<p>Deployed rolling betas with data guards. Escalation accuracy climbed 31% while distress language decreased 44% in transcripts.</p>'
        }
      ]
    }
  },
  {
    id: 'atlas',
    codename: 'Mission 02',
    title: 'Atlas Commons — Knowledge Streaming for Planetfall Crews',
    hook: 'Turning fragmented research into a living map for crews touching down on new worlds.',
    outcome: 'Enabled crews to compose landing briefs in under five minutes with traceable provenance.',
    images: ['./public/assets/sun.svg'],
    spectrum: '#E9E6FF',
    particleBias: 0.55,
    content: {
      metrics: [
        { value: '5 min', label: 'Landing brief assembly' },
        { value: '420 TB', label: 'Indexed archives' },
        { value: '88%', label: 'Reuse uplift' }
      ],
      panels: [
        {
          id: 'mission',
          label: 'Mission Brief',
          body: '<p>Unified colonial research, field notes, and alien linguistics into a commons that orients crews before atmosphere entry.</p>'
        },
        {
          id: 'cartography',
          label: 'Cartography',
          body: '<p>Introduced wayfinding layers—climate, culture, biosphere—to help crews simulate routes, see risk gradients, and author alternative plans collaboratively.</p>'
        },
        {
          id: 'collaboration',
          label: 'Collaboration Protocols',
          body: '<p>Designed holo-notes and asynchronous rituals that keep anthropologists, tacticians, and medics in sync across light-minutes of delay.</p>'
        },
        {
          id: 'outcomes',
          label: 'Outcomes',
          body: '<p>Decision latency shrank by 62%. Duplicate surveys fell 48% after provenance trails turned into auto-summaries everyone trusts.</p>'
        }
      ]
    }
  },
  {
    id: 'horizon',
    codename: 'Mission 03',
    title: 'Horizon Loom — Negotiation Tools for Multi-Species Councils',
    hook: 'Facilitating shared futures between oceanic, aerial, and terrestrial delegates.',
    outcome: 'Drafted eight binding accords while maintaining cross-biome satisfaction scores above ninety percent.',
    images: ['./public/assets/moon.svg'],
    spectrum: '#F4E9FF',
    particleBias: 0.7,
    content: {
      metrics: [
        { value: '8 accords', label: 'Signed agreements' },
        { value: '93%', label: 'Council resonance' },
        { value: '0', label: 'Accessibility escalations' }
      ],
      panels: [
        {
          id: 'mission',
          label: 'Mission Brief',
          body: '<p>Wove ritual, data, and story so amphibian elders, sky-faring strategists, and human mediators could synthesise intent in one space.</p>'
        },
        {
          id: 'sensory',
          label: 'Sensory Channels',
          body: '<p>Built multi-sensory canvases—luminous tide maps, thermal blooms, aerial drafts—that translate intent without forcing a dominant language.</p>'
        },
        {
          id: 'ethics',
          label: 'Ethics Loop',
          body: '<p>Established mutual-care protocols, fail-safes for emergency retreats, and accessibility buffers tuned per species biology.</p>'
        },
        {
          id: 'impact',
          label: 'Impact',
          body: '<p>After three summits, disputes re-opened 0 times. Delegates reported new empathy metrics up seventeen points quarter over quarter.</p>'
        }
      ]
    }
  }
];

export const about = {
  name: 'Magnolia Rivera',
  title: 'Interstellar Experience Cartographer',
  lines: [
    'Guiding futures where humans, allies, and AI steward shared ecosystems.',
    'Prototyping rituals that turn complex systems into lucid, felt journeys.',
    'Designing with data ethics, accessibility, and emotional safety baked in.'
  ],
  tags: ['Speculative UX', 'Systems Strategy', 'Accessibility Steward', 'Story-driven Research']
};

export const skills = [
  { name: 'Constellation Mapping' },
  { name: 'Ethical Service Design' },
  { name: 'Adaptive Interface Systems' },
  { name: 'Participatory Futures' },
  { name: 'Motion Direction' },
  { name: 'Narrative Facilitation' },
  { name: 'Governance Prototyping' },
  { name: 'Zero-G Accessibility' }
];

export const testimonials = [
  {
    author: 'Dr. Hyejin Park',
    role: 'Chief Medical Officer, Lagrange Clinics',
    quote: 'Signal Array lets our teams breathe again—the telemetry feels alive and compassionate.'
  },
  {
    author: 'Commander Liora Naresh',
    role: 'Planetfall Lead, Atlas Initiative',
    quote: 'Magnolia translated chaos into a commons. We land with clarity instead of guesswork.'
  },
  {
    author: 'Elder Thren',
    role: 'Oceanic Delegate, Horizon Council',
    quote: 'Her loom gives every species a true voice. Accord nights are now songs, not skirmishes.'
  }
];
