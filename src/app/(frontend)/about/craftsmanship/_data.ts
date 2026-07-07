import { brandImages } from '@/lib/brand/images'

/**
 * Content for the /about/craftsmanship page — the long-form "how a Kawai piano
 * is made" narrative (factories, materials, artisans). The server page reads
 * from here so it stays composition-only; all copy lives in this file.
 *
 * FACT DISCIPLINE: every specific figure below is verified against Kawai's own
 * pages (kawaius.com, shigerukawai.com) or the brief. Where a number could not
 * be verified — soundboard seasoning duration, total build time, parts counts —
 * the copy stays deliberately qualitative. Do not add unverified figures.
 */

export type CraftFeature = {
  /** Tracked uppercase category label above the heading. */
  category: string
  /** Serif section heading (renders as <h2>). */
  title: string
  /** Lead paragraph. */
  description: string
  /** Supporting points (bulleted). */
  points: string[]
  /** Optional "learn more" link. */
  link?: { label: string; href: string }
  /** Large feature image (R2 or /public). Falls back to a labelled placeholder. */
  image?: string
  imageAlt?: string
  /** Quiet label shown on the placeholder until art is delivered. */
  mediaLabel: string
}

export type Faq = { q: string; a: string }

export const heroImage = brandImages.soundboard

export const SEO = {
  title: 'How Kawai Pianos Are Made — Craftsmanship & Materials | Kawai',
  description:
    'How Kawai pianos are made: the Ryuyo factory in Japan, solid spruce soundboards, the Millennium III action, Neotex key surfaces, and the Master Piano Artisans who hand-build every Shigeru Kawai concert grand.',
  keywords: [
    'how Kawai pianos are made',
    'where are Kawai pianos made',
    'Kawai soundboard',
    'Neotex key surface',
    'Master Piano Artisans',
    'Ryuyo factory',
    'Shigeru Kawai handmade',
    'Kawai craftsmanship',
    'Kawai piano materials',
  ],
}

/**
 * Hero copy. Exactly one <h1> on the page lives here (rendered in page.tsx).
 */
export const hero = {
  eyebrow: 'Craftsmanship',
  title: 'How a Kawai Piano Is Made',
  lede: 'A piano is thousands of parts asked to move as one — and to keep moving, in tune with the hand, for a lifetime. This is how Kawai builds one: where our pianos are made, the materials chosen for tone and stability, and the artisans who finish every instrument by hand before it earns the name.',
  cta: { label: 'Begin with the workshop', href: '#the-workshop' },
} as const

/**
 * Opening statement under the hero image.
 */
export const intro = {
  title: 'Made to be played for a lifetime',
  body: 'Kawai has built musical instruments in Hamamatsu, Japan since 1927. Nearly a century of piano making has settled into a single conviction: that tone is the product of materials, and materials are the product of patience. A great piano is not assembled so much as grown into — wood is chosen and left to settle, parts are fitted and re-fitted, and the final voice is coaxed out by ear rather than dialed in by machine. Every choice on the pages that follow — the spruce in the soundboard, the composite in the action, the surface under your fingers, the hand that voices the final note — exists to make an instrument that sounds true the day it ships and stays true for decades.',
} as const

/**
 * By-the-numbers band. Every figure is verified:
 *  - 1927  founding year (Wikidata Q1425561, kawai-global.com/company/history)
 *  - 1980  Ryuyo Grand Piano Factory opened (kawaius.com/company/ryuyo-grand-piano-factory)
 *  - <20   SK-EX concert grands produced each year (kawaius.com/shigeru)
 *  - 50+   years of composite action R&D (Kawai's own ABS-Carbon pages, since ~1971)
 */
export const craftStats = [
  { value: '1927', label: 'Piano making in Hamamatsu' },
  { value: '1980', label: 'Ryuyo Grand Piano Factory' },
  { value: 'Under 20', label: 'SK-EX built each year' },
  { value: '50+ yrs', label: 'Refining the action' },
] as const

/**
 * "Where are Kawai pianos made" — the two-factory transparency section.
 * Facts per the brief (verified from kawaius.com FAQ). Ryuyo opened 1980.
 */
export const factories = {
  eyebrow: 'Where Kawai Pianos Are Made',
  title: 'Two factories, one standard',
  intro:
    'The most common question buyers ask is a fair one: where is my Kawai actually built? We answer it plainly, because both answers are a point of pride — and because transparency about where and how a piano is made is part of what a serious instrument owes its owner.',
  places: [
    {
      name: 'Ryuyo Grand Piano Factory — Hamamatsu, Japan',
      body: 'Opened in 1980 near Hamamatsu, the Ryuyo Grand Piano Factory builds Kawai’s finest grands: the entire GX series, the GL-30, GL-40 and GL-50, and every Shigeru Kawai concert instrument. It is the marriage of advanced tooling and hand craft — computer-precise where consistency matters, and unapologetically manual where tone is decided. It is staffed by some of the most experienced piano makers in the industry, the kind of specialists who select tone materials by ear and voice each grand by hand before it is allowed to leave.',
    },
    {
      name: 'Karawang, Indonesia',
      body: 'The GL-10 and GL-20 sold in North America are built at Kawai’s facility in Karawang, Indonesia — a plant purpose-designed to replicate Ryuyo’s tooling, culture, and process so a Kawai carries the same standard whichever line it comes from. It is not an outsourced factory buying its way to a badge; it is a Kawai factory, built in Ryuyo’s image, staffed and trained to Kawai’s methods so that an entry-level grand is recognisably part of the same family as the concert instruments.',
    },
  ],
} as const

/**
 * The material / process features, alternating image and text down the page.
 * The two "signature" material stories: the soundboard, and the action + Neotex.
 */
export const features: CraftFeature[] = [
  {
    category: 'The Heart of the Instrument',
    title: 'The soundboard, in solid spruce',
    description:
      'The soundboard is the heart of a piano — the large wooden diaphragm that turns a vibrating string into sound you can feel across a room. Kawai builds its grand soundboards from solid, straight-grained, quarter-sawn spruce, and tapers them: thicker at the centre, gradually thinner toward the rim, so the board flexes freely where the tone is born and stays rigid where it must anchor. This is slow, exacting work — spruce is prized for the highest strength-to-weight ratio of any tonewood, but only certain boards ring the way a Kawai must. Only those that meet the demanding resonance standard are selected; the rest never become instruments.',
    points: [
      'Solid spruce — chosen for the highest strength-to-weight ratio of any tonewood',
      'Tapered thickness for a freer, more responsive vibrating surface',
      'Straight-grained and quarter-sawn for even, predictable resonance',
      'Selected by tonal response, not by yield',
    ],
    mediaLabel: 'Solid Spruce Soundboard',
  },
  {
    category: 'What You Touch',
    title: 'The Millennium III action and Neotex key surfaces',
    description:
      'Under every key is the action — thousands of moving parts that carry the intent of your finger to the string. Kawai builds its grand action from ABS-Carbon composite in the Millennium III design: parts over 50% stronger than conventional wood that make the action roughly 25% faster, and that never swell or shrink with humidity, so a Kawai holds its regulation season after season where an all-wood action drifts out of adjustment. It is the reason a Kawai feels the same in a dry winter studio and a humid summer stage. What you actually touch is different again — the keys are surfaced in Neotex, Kawai’s exclusive cellulose-fibre finish with the understated texture of ivory and ebony, engineered for grip rather than gloss.',
    points: [
      'ABS-Carbon action parts: stronger, faster, and impervious to humidity',
      'Independently tested at Cal Poly; over 50 years of composite refinement',
      'Neotex surfaces on naturals and sharps, with an ivory-and-ebony feel',
      'A semi-porous, silica-filled finish that absorbs moisture for a secure grip',
    ],
    link: { label: 'Inside the piano action', href: '/technology/piano-action' },
    image: brandImages.warmPianist,
    imageAlt: 'A pianist’s hands on Kawai keys',
    mediaLabel: 'Neotex Key Surfaces',
  },
]

/**
 * The single dark, full-bleed moment: the Master Piano Artisans and the
 * hand-building of Shigeru Kawai concert grands. "Fewer than 20 SK-EX per year"
 * is verified (kawaius.com/shigeru). Seasoning duration stays qualitative.
 */
export const artisans = {
  eyebrow: 'The Hand That Finishes',
  title: 'Master Piano Artisans and the Shigeru Kawai',
  body: 'At the top of the range, craft becomes the whole story. Every Shigeru Kawai concert grand is hand-built in Japan by Kawai’s Master Piano Artisans — the small circle of makers who have earned the program’s highest designation, and who put their own reputation behind each instrument they complete. Their soundboards are seasoned naturally by the traditional kigarashi method, which uses only time and air to bring the spruce into tonal balance rather than forcing it dry. Each instrument is then voiced by hand, note by note, hammer by hammer, until all eighty-eight speak with a single unified voice. Fewer than twenty SK-EX concert grands are made each year for the entire world — and the relationship does not end at the factory door: within the first two years of ownership, an elite Master Piano Artisan travels to the owner’s home or studio to perform a concert-level tuning, voicing, and regulation in person.',
  links: [
    { label: 'Explore Shigeru Kawai', href: '/pianos/shigeru-kawai' },
    { label: 'Our heritage', href: '/about/heritage' },
  ],
} as const

/**
 * FAQ — mirrored into FAQPage JSON-LD. Covers where-made / handmade / Neotex.
 */
export const faqs: Faq[] = [
  {
    q: 'Where are Kawai pianos made?',
    a: 'Kawai’s finest grands — the entire GX series, the GL-30/40/50, and every Shigeru Kawai concert grand — are built at the Ryuyo Grand Piano Factory near Hamamatsu, Japan, which opened in 1980. The GL-10 and GL-20 sold in North America are built at Kawai’s Karawang, Indonesia facility, which was purpose-designed to replicate Ryuyo’s tooling, culture, and process.',
  },
  {
    q: 'Are Shigeru Kawai pianos really handmade?',
    a: 'Yes. Every Shigeru Kawai concert grand is hand-built in Japan by Kawai’s Master Piano Artisans, who select tone materials, hand-voice each instrument, and finish it individually before it leaves Ryuyo. Fewer than twenty SK-EX concert grands are produced each year for the entire world.',
  },
  {
    q: 'What is a Neotex key surface?',
    a: 'Neotex is Kawai’s exclusive keytop material, made of cellulose fibre, with the understated texture of natural ivory and ebony. Its semi-porous, silica-filled surface absorbs the hand’s oils and perspiration for a secure grip, and it resists cracking, fading, and static. It is used on both the naturals and the sharps of GX grands, K-series uprights, and Shigeru Kawai.',
  },
  {
    q: 'Is a composite action as good as an all-wood one?',
    a: 'For the things that matter in playing, it is stronger and more stable. Kawai’s ABS-Carbon action parts are over 50% stronger than conventional wood, make the grand action about 25% faster, and — because they do not absorb moisture — hold their factory regulation where wooden parts swell and drift. The composite is inside the action; the surface under your fingers is Neotex.',
  },
]

/**
 * Closing cross-links and CTA.
 */
export const closing = {
  title: 'Hear the difference craft makes',
  body: 'Specifications describe a piano. Only playing one explains it. Find a Kawai near you, or explore the full range of grands, uprights, and concert instruments.',
} as const
