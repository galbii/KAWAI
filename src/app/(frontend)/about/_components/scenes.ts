export const heroCopy = {
  eyebrow: 'Kawai America Corporation',
  sinceLabel: 'Since 1927',
  headline: ['Crafting', 'Inspiration'],
  sub: 'Visit an Authorized Dealer or Official Kawai location for best prices and other rebate offers.',
  primaryCta: { label: 'Our Story', href: '#story' },
  secondaryCta: { label: 'Explore Pianos', href: '/pianos' },
}

export const manifestoCopy =
  'Since 1927, three generations of the Kawai family have dedicated their lives to crafting inspiration through innovative piano technology, scientific research, and an unwavering commitment to quality.'

export const stats = [
  { value: '1927', numeric: 1927, suffix: '', label: 'Founded' },
  { value: '2.4M+', numeric: 2.4, decimals: 1, suffix: 'M+', label: 'Pianos Built' },
  { value: '50+', numeric: 50, suffix: '+', label: 'Awards' },
  { value: '61+', numeric: 61, suffix: '+', label: 'Competition Victories' },
  { value: '3', numeric: 3, suffix: '', label: 'Generations' },
] as const

export const heritageCopy = {
  eyebrow: 'Heritage',
  headline: 'A Family Legacy of Craft',
  body: 'In 1927, Koichi Kawai — a gifted inventor and former apprentice to Torakusu Yamaha — founded Kawai with a singular belief: that exceptional pianos should be within reach of every musician. Three generations later, that founding conviction still guides every instrument we build, marrying traditional Japanese craftsmanship with relentless scientific curiosity.',
  links: [
    { label: 'Our full heritage', href: '/about/heritage' },
    { label: 'Meet our founder, Koichi Kawai', href: '/about/heritage/koichi-kawai' },
    { label: 'Our philosophy', href: '/company/our-philosophy' },
  ],
  plate: { kicker: 'Established', year: '1927' },
}

export const timelineCopy = {
  eyebrow: 'Heritage',
  headline: 'A Legacy of Innovation',
  events: [
    {
      year: '1927',
      title: 'Foundation',
      description:
        'Koichi Kawai, former apprentice to Torakusu Yamaha, establishes Kawai Musical Instruments with a vision to democratize access to quality pianos.',
    },
    {
      year: '1955',
      title: 'Second Generation Leadership',
      description:
        'Shigeru Kawai becomes president, introducing a scientific approach to piano innovation and establishing the foundation for modern Kawai technology.',
    },
    {
      year: '1971',
      title: 'ABS Technology Revolution',
      description:
        'Kawai introduces revolutionary ABS composite materials for piano actions, later proven at Cal Poly to be superior to traditional wood in durability and consistency.',
    },
    {
      year: '1989',
      title: 'Third Generation & Global Expansion',
      description:
        "Hirotaka Kawai takes leadership, introducing robotics in manufacturing and expanding Kawai's global presence while maintaining traditional craftsmanship values.",
    },
    {
      year: '2002',
      title: 'Millennium III Action',
      description:
        'Launch of the revolutionary Millennium III Action, representing the pinnacle of composite action technology and setting new standards for touch and response.',
    },
    {
      year: '2024',
      title: 'Continued Excellence',
      description:
        '97 years later, Kawai continues to lead with 61+ international competition victories and instruments trusted by artists and institutions worldwide.',
    },
  ] as const,
}

export const technologyCopy = {
  eyebrow: 'Innovation',
  headline: 'Engineered by Science',
  body: "Kawai has never treated piano-making as tradition alone. From the introduction of ABS composite actions in 1971 to today's ABS-Carbon and Millennium III mechanisms, our advances are proven in the laboratory and felt under the fingers. The same research drives Progressive Harmonic Imaging, bringing the voice of our concert grands into every digital instrument we make.",
  link: { label: 'Explore our technology', href: '/technology' },
}

export const goDeeperCopy = {
  eyebrow: 'Explore',
  headline: 'Go Deeper',
  cards: [
    {
      index: '01',
      title: 'Awards & Recognition',
      body: 'More than 50 international awards for product design and service excellence.',
      links: [
        { label: 'View our awards', href: '/company/awards', primary: true },
        { label: "The Winner's Choice", href: '/the-winners-choice', primary: false },
      ],
    },
    {
      index: '02',
      title: 'Institutions & Owners',
      body: 'Universities, conservatories, and concert halls worldwide perform on Kawai.',
      links: [
        { label: 'Distinguished owners', href: '/distinguished-owners', primary: true },
        { label: 'The EPIC program', href: '/institutions/epic-program', primary: false },
      ],
    },
  ],
}

export const codaCopy = {
  eyebrow: 'Explore',
  headline: 'Experience 97 Years of Innovation',
  body: "Discover how Kawai's legacy of craftsmanship and innovation can shape your musical journey.",
  primaryCta: { label: 'Explore Pianos', href: '/pianos' },
  secondaryCta: { label: 'Find a Dealer', href: '/find-a-dealer' },
}

/** Primary "browse the full catalog" CTA on the Featured Collections scene. */
export const exploreProductsCta = { label: 'Explore All Products', href: '/pianos' } as const

export const showroomsCopy = {
  eyebrow: 'Where to Play',
  headline: 'Experience Kawai in Person',
  body: 'Play our pianos in person and get expert guidance from an authorized Kawai dealer near you.',
  dealerStat: { numeric: 200, suffix: '+', label: 'Authorized Dealers Nationwide' },
  secondaryCta: { label: 'Find a Dealer', href: '/find-a-dealer' },
} as const

/**
 * Ten scene windows on master scroll progress (0 → 1).
 * Tuned so each scene gets ~10–15% of scroll plus a ~1.5% crossfade overlap.
 * Order: hero → stats → showrooms → collections → manifesto → heritage →
 * timeline → technology → goDeeper → coda. Timeline keeps the longest run.
 */
export const SCENE_WINDOWS = {
  hero: [0.0, 0.1] as const,
  stats: [0.085, 0.2] as const,
  showrooms: [0.185, 0.3] as const,
  collections: [0.285, 0.4] as const,
  manifesto: [0.385, 0.48] as const,
  heritage: [0.465, 0.58] as const,
  timeline: [0.565, 0.7] as const,
  technology: [0.685, 0.78] as const,
  goDeeper: [0.765, 0.86] as const,
  coda: [0.845, 1.0] as const,
}
