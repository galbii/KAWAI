import { brandImages } from '@/lib/brand/images'

/**
 * Content for the /about/heritage/kentaro-kawai page — a LIGHT, forward-looking
 * "current leadership / the next chapter" page for Kentaro Kawai, the fourth
 * president & CEO of Kawai. This is deliberately short and vision-driven, not a
 * cradle-to-now biography: public personal material is thin, so the page leads
 * with the centennial framing (2024 → 2027) and his own verified words.
 *
 * FACT DISCIPLINE — every fact and every quote below is verified against Kawai's
 * own material (corporate leadership pages + the official 98th-anniversary
 * interview). Nothing here may be expanded without a new cited source.
 *
 *   • Relationship framing follows Kawai's PUBLIC convention: he is described
 *     only as the "fourth-generation leader" / "fourth president" who
 *     "succeeded Hirotaka Kawai." No blood-relationship claim is made — Kawai's
 *     English pages make none.
 *   • NO portrait of Kentaro Kawai is published here. The portrait slot renders
 *     a labelled placeholder for Kawai to supply; no brand/atmosphere image is
 *     ever passed off as his likeness, and the Person JSON-LD carries no image.
 */

export const SEO = {
  path: '/about/heritage/kentaro-kawai',
  title: 'Kentaro Kawai — Leading Kawai Toward Its Second Century | Kawai',
  description:
    'Kentaro Kawai became the fourth president & CEO of Kawai in February 2024, taking the helm three years before the company’s 2027 centennial. His vision: “Let your life resound,” and to make Kawai the world’s leading keyboard instrument manufacturer.',
  keywords: [
    'Kentaro Kawai',
    'Kawai president',
    'Kawai CEO',
    'who leads Kawai',
    'Kawai 4th president',
    'Kawai fourth president',
    'Kawai leadership',
    'Kawai centennial 2027',
  ],
  datePublished: '2026-07-07',
  /**
   * OG card image is atmosphere only (a Kawai grand piano) — explicitly NOT a
   * portrait of Kentaro Kawai, and the alt text says so. No likeness is implied.
   */
  ogImage: brandImages.luxeRoom,
  ogImageAlt: 'A Kawai grand piano — Kawai’s craft under its fourth president',
} as const

export const hero = {
  eyebrow: 'Current Leadership · The Fourth President',
  title: 'Leading Kawai Toward Its Second Century',
  lede: 'In February 2024, Kentaro Kawai became the fourth president of Kawai Musical Instruments — taking the helm three years before the company marks a full century of piano-making in 2027.',
  /** Quiet label shown on the portrait placeholder until Kawai supplies art. */
  portraitLabel: 'Kentaro Kawai',
  portraitNote: 'Official portrait to follow',
} as const

/** By-the-numbers band. Every figure is verified. */
export const stats = [
  { value: '4th', label: 'President of Kawai' },
  { value: '2024', label: 'Took the Helm' },
  { value: '2027', label: 'Kawai’s Centennial' },
  { value: 'Est. 1927', label: 'The Legacy He Leads' },
] as const

export const succession = {
  eyebrow: 'The Succession',
  title: 'A steady hand at a pivotal moment',
  body: 'Kentaro Kawai stepped into the presidency on February 28, 2024, succeeding Hirotaka Kawai. He had spent years preparing for the role — most recently as Executive Vice President — and inherited not only a company but a countdown: a global piano maker three years from its hundredth year.',
} as const

/** His own words. Verified quotes — used as large pull-quotes. */
export const quotes = {
  responsibility: {
    text: 'Every day, I feel the weight of responsibility that comes with leading a company with such a rich history.',
    attribution: 'Kentaro Kawai, President & CEO',
  },
  purpose: {
    text: 'We are not merely manufacturers and sellers of musical instruments. Through our instruments and services, we have the power to accompany people’s emotional lives.',
    attribution: 'Kentaro Kawai',
  },
  essential: {
    text: 'I truly believe that music is essential to human life.',
    attribution: 'Kentaro Kawai',
  },
  yaramaika: {
    text: '“Yaramaika” — meaning something like “Let’s give it a try!” The more we challenge ourselves, the more we grow.',
    attribution: 'On the Hamamatsu spirit that shaped Kawai',
  },
} as const

/** The path to the presidency. A compact chronology, not a full biography. */
export const ascent = {
  eyebrow: 'The Path',
  title: 'From Kobe to the presidency',
  intro:
    'His rise inside Kawai was measured, not sudden — two decades of preparation before he took the fourth chair.',
  steps: [
    { year: '2001', label: 'Graduates Kobe University, Faculty of Economics' },
    { year: '2007', label: 'Joins Kawai Musical Instruments' },
    { year: '2016', label: 'Appointed a division head' },
    { year: '2020', label: 'Named Executive Vice President' },
    { year: '2024', label: 'Becomes the fourth president & CEO' },
  ],
} as const

export const philosophy = {
  eyebrow: 'The Philosophy',
  title: '“Let your life resound”',
  body: 'Under his leadership, Kawai has redefined its guiding philosophy around a single idea — “Let your life resound” — and carries it into the world through the brand message “Instrumental to Life”: the belief that, wherever you are in the world, Kawai is there.',
} as const

export type VisionItem = {
  /** Tracked uppercase category label. */
  category: string
  /** Serif heading — renders as an <h3>. */
  title: string
  body: string
}

export const vision = {
  eyebrow: 'Toward 2027',
  title: 'The vision for a second century',
  intro:
    'His ambition for the centennial is plainly stated: to make Kawai the world’s leading keyboard instrument manufacturer.',
  items: [
    {
      category: 'Growth',
      title: 'Digital pianos at the core',
      body: 'Digital-piano growth anchors the strategy, with an ambition to reach the top global market share. A new factory in Indonesia expands digital-piano production to meet it.',
    },
    {
      category: 'Strategy',
      title: 'One global company',
      body: 'He has integrated domestic and overseas sales into a single operation and formulated both a ten-year vision and a medium-term plan to reach it.',
    },
    {
      category: 'The Instrument',
      title: 'The piano of choice',
      body: 'A stated ambition for Kawai to be the piano chosen by the world’s finest artists — and heard on the stages that matter most.',
    },
    {
      category: 'Beyond the Keys',
      title: 'Education and materials',
      body: 'Looking past the instrument itself, the plan reaches into music education and materials-processing — new ground for a company built on the piano.',
    },
  ] satisfies VisionItem[],
} as const

export const closing = {
  eyebrow: 'The Next Chapter',
  title: 'A century behind, a century ahead',
  body: 'The story that began at a founder’s workbench in 1927 now runs through its fourth president — and toward its second hundred years. The instruments are where that vision becomes something you can hear.',
} as const
