export const heroCopy = {
  eyebrow: 'Kawai America Corporation',
  sinceLabel: 'Since 1927',
  headline: ['Crafting', 'Inspiration'],
  sub: 'Visit an Authorized Dealer or Official Kawai location for best prices and other rebate offers.',
  primaryCta: { label: 'Our Story', href: '#story' },
  secondaryCta: { label: 'Explore Pianos', href: '/pianos' },
}

export const stats = [
  { value: '1927', numeric: 1927, suffix: '', label: 'Founded' },
  { value: '2.4M+', numeric: 2.4, decimals: 1, suffix: 'M+', label: 'Pianos Built' },
  { value: '50+', numeric: 50, suffix: '+', label: 'Awards' },
  { value: '61+', numeric: 61, suffix: '+', label: 'Competition Victories' },
  { value: '3', numeric: 3, suffix: '', label: 'Generations' },
] as const

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
 * Dealer discount offer. Copy shared by the three offer CTAs (Hero, Showrooms,
 * Coda) and the OfferModal they open. Prototype only — the form is not yet
 * wired to a backend; see OfferModal for the stubbed submit flow.
 */
export const offerCopy = {
  eyebrow: 'Exclusive Offer',
  headline: 'Save 20–30% at your local Authorized dealer',
  body: 'Sign up and your nearest Authorized Kawai dealer will reach out with an exclusive 20–30% discount on your next piano.',
  /** CTA button labels per placement. */
  cta: {
    hero: 'Unlock 20–30% Off',
    showrooms: 'Get Your Discount',
    coda: 'Claim 20–30% Off',
  },
  submitLabel: 'Get My Discount',
  zipHelp: "We'll match you to your nearest Authorized Kawai dealer.",
  success: {
    headline: "You're in.",
    body: 'Thanks — your local Authorized Kawai dealer will reach out shortly with your 20–30% discount.',
  },
} as const

/**
 * Six scene windows on master scroll progress (0 → 1).
 * Tuned so each scene gets ~17–19% of scroll plus a ~1.5% crossfade overlap.
 * Order: hero → stats → showrooms → collections → timeline → coda.
 */
export const SCENE_WINDOWS = {
  hero: [0.0, 0.15] as const,
  stats: [0.135, 0.33] as const,
  showrooms: [0.315, 0.5] as const,
  collections: [0.485, 0.66] as const,
  timeline: [0.645, 0.83] as const,
  coda: [0.815, 1.0] as const,
}
