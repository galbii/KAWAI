import { brandImages } from '@/lib/brand/images'

/**
 * Content for the /technology page. Copy is preserved verbatim from the original
 * page — only presentation changes. `page.tsx` reads from here so the server
 * component stays composition-only.
 */

export type Technology = {
  name: string
  category: string
  description: string
  features: string[]
  benefits: string[]
  detailPath: string
  /** When present, the media renders this YouTube embed. */
  videoId?: string
  /** Large feature image (R2 or /public). Falls back to a quiet placeholder. */
  image?: string
  imageAlt?: string
}

export type ResearchHighlight = {
  title: string
  description: string
  results: string[]
}

export type Pillar = {
  title: string
  description: string
}

export const heroImage = brandImages.soundboard

export const SEO = {
  title: 'Piano Technology & Innovation | Kawai Pianos',
  description:
    'Discover the engineering behind Kawai pianos — the Millennium III Action, ABS-Carbon composite, Progressive Harmonic Imaging, Grand Feel III, and more. Scientifically tested, competition-proven.',
  keywords: [
    'Kawai piano technology',
    'Millennium III Action',
    'ABS-Carbon composite',
    'Progressive Harmonic Imaging',
    'Grand Feel III action',
    'carbon fiber piano action',
    'Kawai innovation',
    'piano action technology',
    'SK-EX rendering',
  ],
}

export const technologies: Technology[] = [
  {
    name: 'Millennium III Action',
    category: 'Mechanical Innovation',
    description:
      'The pinnacle of composite action technology, featuring extended key length, carbon fiber reinforcement, and precision engineering for ultimate control and expression.',
    features: [
      'ABS-Carbon composite construction',
      'Extended key length for enhanced leverage',
      'Carbon fiber reinforced hammers',
      'Precision-weighted keys',
      'Competition-grade repetition speed',
    ],
    benefits: [
      'Unmatched consistency across all 88 keys',
      'Superior repetition capability',
      'Enhanced dynamic range and control',
      'Resistance to environmental changes',
      'Decades of maintenance-free performance',
    ],
    detailPath: '/technology/millennium-iii',
    videoId: 'yQyYVcIiuMg',
  },
  {
    name: 'ABS-Carbon Composite',
    category: 'Material Science',
    description:
      'Revolutionary composite material that surpasses traditional wood in durability, consistency, and resistance to environmental factors. Scientifically proven at Cal Poly.',
    features: [
      'ABS polymer base with carbon fiber reinforcement',
      'Scientifically tested at Cal Poly University',
      '10x more resistant to humidity than wood',
      'Consistent weight and density',
      'No seasonal maintenance required',
    ],
    benefits: [
      "Eliminates wood's natural inconsistencies",
      'No warping, cracking, or seasonal movement',
      'Consistent touch response over decades',
      'Reduced maintenance requirements',
      'Superior long-term stability',
    ],
    detailPath: '/technology/abs-carbon',
  },
  {
    name: 'Progressive Harmonic Imaging',
    category: 'Digital Sound Technology',
    description:
      'Advanced sound sampling technology that captures the complete harmonic spectrum of Shigeru Kawai concert grands, providing unprecedented realism in digital pianos.',
    features: [
      '88-key individual sampling',
      'Multiple velocity layers per key',
      'Complete harmonic overtone capture',
      'String resonance modeling',
      'Sympathetic string vibration simulation',
    ],
    benefits: [
      'Authentic concert grand sound',
      'Realistic dynamic response',
      'Natural harmonic resonance',
      'Enhanced musical expression',
      'Studio-quality audio reproduction',
    ],
    detailPath: '/technology/phi',
  },
  {
    name: 'Grand Feel III Action',
    category: 'Digital Piano Innovation',
    description:
      'Wooden-key action technology that brings the authentic feel of a concert grand piano to digital instruments, featuring let-off simulation and triple-sensor detection.',
    features: [
      'Full-length wooden keys',
      'Let-off mechanism simulation',
      'Triple-sensor key detection',
      'Individual key weighting',
      'Escapement feel reproduction',
    ],
    benefits: [
      'Authentic grand piano touch',
      'Enhanced expression and control',
      'Smooth transition between acoustic and digital',
      'Professional-level training capability',
      'Concert preparation readiness',
    ],
    detailPath: '/technology/grand-feel-iii',
  },
  {
    name: 'Spatial Headphone Sound',
    category: 'Audio Innovation',
    description:
      'Revolutionary 3D audio technology that creates an immersive concert hall experience through headphones, making practice sessions more engaging and realistic.',
    features: [
      'Binaural 3D audio processing',
      'Concert hall ambience simulation',
      'Multiple virtual room types',
      'Distance and positioning effects',
      'Crossfeed adjustment controls',
    ],
    benefits: [
      'Immersive practice experience',
      'Reduced listening fatigue',
      'Natural spatial perception',
      'Enhanced musical enjoyment',
      'Professional monitoring quality',
    ],
    detailPath: '/technology/shs',
  },
  {
    name: 'SK-EX Rendering',
    category: 'Sound Modeling',
    description:
      'Detailed sound modeling of the flagship Shigeru Kawai SK-EX concert grand, capturing every nuance of this world-renowned instrument used in international competitions.',
    features: [
      'Complete SK-EX piano modeling',
      'Advanced resonance algorithms',
      'Pedal noise and mechanism sounds',
      'Damper resonance simulation',
      'Competition-quality sound reproduction',
    ],
    benefits: [
      'Access to world-class concert grand sound',
      'Competition-level audio quality',
      'Authentic playing experience',
      'Professional recording capabilities',
      'Artist-approved sound reproduction',
    ],
    detailPath: '/technology/sk-ex-rendering',
  },
]

export const researchHighlights: ResearchHighlight[] = [
  {
    title: 'Cal Poly University Testing',
    description:
      "Independent scientific testing at California Polytechnic State University proved that Kawai's ABS-Carbon composite materials are significantly more stable and consistent than traditional wood.",
    results: [
      '10x more humidity resistant',
      'Superior dimensional stability',
      'Consistent density throughout',
      'No seasonal maintenance required',
    ],
  },
  {
    title: 'Competition Performance Analysis',
    description:
      'Data from 61+ international piano competition victories shows that Shigeru Kawai pianos consistently deliver the precision and reliability demanded by world-class pianists.',
    results: [
      '61+ competition victories',
      'Preferred by competition winners',
      'Consistent performance under pressure',
      'World-renowned reliability',
    ],
  },
  {
    title: 'Long-term Durability Studies',
    description:
      "Decades of real-world testing demonstrate that Kawai's composite actions maintain their precision and responsiveness far longer than traditional wooden actions.",
    results: [
      'Decades of consistent performance',
      'Minimal maintenance requirements',
      'Stable regulation over time',
      'Superior longevity',
    ],
  },
]

/**
 * Millennium III — treated as Kawai's named signature technology (the way
 * Bösendorfer owns "Resonance Case" or Fazioli its fourth pedal). Every figure
 * is taken verbatim from Kawai's own ABS-Carbon / carbon-fiber detail pages.
 */
export const millenniumSignature = {
  eyebrow: 'The Kawai Signature',
  name: 'Millennium III Action',
  lede: 'The heart of a Kawai is its action — and Kawai builds it differently. The Millennium III action is engineered from ABS-Carbon composite: the same class of material trusted in the Boeing 787, Formula 1, and elite bicycles, chosen for one reason — more strength and stiffness at less weight. The result is a touch that is faster, more durable, and more stable than any wooden action, season after season.',
  stats: [
    { value: '25%', label: 'Faster repetition than a wood action' },
    { value: '50%+', label: 'Stronger than conventional wood parts' },
    { value: '90%', label: 'Strength gained from carbon-fiber infusion' },
    { value: '50+ yrs', label: 'Of composite action R&D' },
  ],
  videoId: 'yQyYVcIiuMg',
  links: [
    { label: 'How a piano action works', href: '/technology/piano-action' },
    { label: 'Inside ABS-Carbon & carbon fiber', href: '/technology/carbon-fiber-technology' },
  ],
} as const

/**
 * Neotex — Kawai's premium key surface. Surfaced here because it answers a
 * common research question ("are Kawai keys plastic / ivory?") and distinguishes
 * what a player actually touches from the internal ABS-Carbon parts.
 * Facts per Kawai (cellulose-fiber, silica-filled, moisture-absorbing).
 */
export const neotex = {
  eyebrow: 'What You Touch',
  name: 'Neotex Key Surfaces',
  description:
    'The ABS-Carbon composite is inside the action. The keys under your fingers are finished in Neotex — Kawai’s exclusive cellulose-fiber key surface with the understated texture of natural ivory and ebony. Its semi-porous, silica-filled finish absorbs the hand’s natural oils and perspiration for a secure grip through the most demanding passages, resists cracking and fading over decades, and stays static-free to shed dust.',
  points: [
    'Ivory-and-ebony feel, on both naturals and sharps',
    'Absorbs moisture for a secure, slip-free touch',
    'Resists cracking, fading, and static over years of play',
  ],
} as const

/**
 * Feel-reassurance FAQ. Forum research shows the objection is never "does
 * composite work" (technicians praise it) — it's "does it feel different" and
 * "is "plastic" as good as wood." These answers reframe the material and are
 * mirrored into FAQPage JSON-LD. Every figure is from Kawai's own pages.
 */
export const techFaqs = [
  {
    q: 'Is a composite piano action as good as a wooden one?',
    a: 'Better, in the ways that matter for playing. Kawai’s ABS-Carbon action parts are over 50% stronger and more durable than conventional wood, transfer more energy to the hammer, and make the Millennium III grand action about 25% faster. Because they don’t absorb moisture, they hold their precise regulation season after season — where wooden parts swell, shrink, and drift out of adjustment.',
  },
  {
    q: 'Will a Kawai action feel like plastic?',
    a: 'No. Pianists consistently describe the Millennium III touch as fast, even, and grand-like. "ABS-Carbon" refers to what the internal action parts are engineered from — not the playing surface. The keys you actually touch are finished in Neotex, a cellulose-fiber surface with the understated texture of ivory and ebony that absorbs moisture for a secure grip.',
  },
  {
    q: 'Does the composite action hold up in humidity?',
    a: 'Yes — that is one of its biggest advantages. Traditional wooden action parts expand and contract with humidity, altering the fine geometry of the action. ABS-Carbon does not shrink or swell, so a Kawai keeps its factory-set touch and repetition in climates and seasons that force frequent regulation on all-wood actions. The stability was independently confirmed in testing at Cal Poly.',
  },
  {
    q: 'Is carbon fiber in a piano just marketing?',
    a: 'It is the same reasoning that put carbon fiber in the Boeing 787, Formula 1 cars, and elite bicycles: more strength and stiffness at lower weight. Infusing carbon fiber into Kawai’s ABS-Styran increased part strength by 90%, letting the action move faster with less effort. Kawai has refined composite action design for more than 50 years — longer than anyone in the industry.',
  },
] as const

export const pillars: Pillar[] = [
  { title: 'Research', description: 'Rigorous scientific investigation and material testing' },
  {
    title: 'Innovation',
    description: 'Breakthrough technologies that advance the art of piano making',
  },
  { title: 'Validation', description: 'Proven performance in competitions and professional use' },
]
