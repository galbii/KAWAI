import { brandImages } from '@/lib/brand/images'

/**
 * Content for /about/heritage/shigeru-kawai — a heritage biography of SHIGERU
 * KAWAI THE MAN (1922–2006), the second-generation president of Kawai. This is
 * NOT the "Shigeru Kawai" namesake piano line (that line, launched 1999, is
 * only referenced as the company honouring him).
 *
 * FACT DISCIPLINE — accuracy over richness. Every date, number, and quote below
 * is drawn from the brief's verified-facts list and cross-checks against Kawai's
 * own English pages (kawai-global.com/company/history, shigerukawai.com). No
 * specific figure has been invented. Where a detail could not be verified, the
 * copy stays qualitative. Two framing rules are enforced throughout:
 *   1. He is referred to as Koichi Kawai's SON / the second generation, mirroring
 *      Kawai's own public English convention (never "son-in-law" / "mukoyoshi").
 *   2. ABS composite action parts are credited to the COMPANY / his engineers
 *      under his leadership (beginning 1968) — never to him personally as inventor.
 */

export type CrossLink = { label: string; href: string }

export type Milestone = {
  /** Year or year range, e.g. "1963" or "1976–1979". Rendered tabular. */
  year: string
  /** Milestone name — rendered as text, NOT a heading. */
  title: string
  /** One-sentence description. */
  body: string
}

export type ParadoxPanel = {
  /** Small tracked kicker, e.g. "The Craftsman". */
  kicker: string
  /** Panel heading (renders as <h3>). */
  heading: string
  /** A verified line in his own words, shown as the panel's epigraph. */
  quote: string
  /** Supporting paragraph. */
  body: string
}

export const PATH = '/about/heritage/shigeru-kawai'

export const SEO = {
  title: 'Shigeru Kawai — The Scientist Who Modernized a Craft | Kawai',
  description:
    "Who was Shigeru Kawai? The second-generation president of Kawai (1955–1989) — a hands-on craftsman who brought a scientific approach to piano making, founded Kawai America, and built the Ryuyo research factory.",
  keywords: [
    'Shigeru Kawai',
    'who was Shigeru Kawai',
    'Shigeru Kawai president',
    'Kawai second generation',
    'Shigeru Kawai history',
    'Shigeru Kawai biography',
    'Kawai second president',
  ],
} as const

/**
 * Hero. The page's single <h1> ("Shigeru Kawai") is rendered from here.
 */
export const hero = {
  eyebrow: 'Heritage · The Second Generation',
  title: 'Shigeru Kawai',
  subtitle: 'The scientist who modernized a craft',
  tenure: 'Second President of Kawai · 1955–1989',
  lede: "He joined the company his father founded in 1946. In 1955 — at just thirty-three, following the death of founder Koichi Kawai — he became its second president. Over the thirty-five years that followed, Shigeru Kawai did something quietly radical: he kept the hand at the centre of the piano, and rebuilt almost everything around it with the discipline of science.",
} as const

/**
 * Portrait slot. No verified portrait of Shigeru Kawai the man is available, so
 * this renders a quiet, labelled technical placeholder — a plate a real
 * Kawai-supplied portrait can drop straight into. `image` is intentionally
 * omitted; do NOT substitute a brand atmosphere image here.
 */
export const portrait = {
  label: 'Portrait — Shigeru Kawai',
  caption: 'Shigeru Kawai · 1922–2006',
  note: 'Official portrait to be supplied by Kawai.',
} as const

/**
 * Tenure figures for the StatStrip. Every value is verified:
 *  - 1922–2006     lifespan (b. 28 Jul 1922, Maisaka-cho, Shizuoka; d. 20 Aug 2006)
 *  - President at 33  became president in 1955 at age 33
 *  - 35 years      president 1955–1989
 *  - 1963          Kawai America, the first overseas subsidiary
 *  - 1980          Ryuyo Grand Piano Factory & Research Laboratory
 */
export const stats = [
  { value: '1922–2006', label: 'A Life in Pianos' },
  { value: '33', label: 'His Age at President, 1955' },
  { value: '35 yrs', label: 'At the Helm' },
  { value: '1963', label: 'Kawai America Founded' },
  { value: '1980', label: 'Ryuyo Research Factory' },
] as const

/**
 * The thesis: the paradox of a hands-on craftsman who was also the great
 * industrial modernizer. The two verified epigraphs frame the two halves.
 */
export const paradox = {
  eyebrow: 'The Paradox',
  title: 'One man, two convictions',
  intro:
    'The story of Shigeru Kawai is best understood as a held tension. He was, at once, the most hands-on of craftsmen and the most far-sighted of modernizers — a maker who insisted a piano must be built by hand, and a leader who spent his presidency bringing science, engineering, and the wider world to bear on how it was built.',
  panels: [
    {
      kicker: 'The Craftsman',
      heading: 'Made by hand, on principle',
      quote: 'Pianos are made of wood, so they must be made by hand.',
      body: "He had come up from the factory floor, and he never let the workshop out of his sight. To him the hand was not nostalgia but necessity — wood is a living material, and only a trained ear and a practised hand could coax a true voice out of it. That conviction stayed fixed at the centre of everything he changed.",
    },
    {
      kicker: 'The Modernizer',
      heading: 'Refined by science',
      quote: 'Combine hand-craftsmanship with the finest technology.',
      body: "Around that fixed centre, he changed almost everything else. His guiding aim was to marry the hand to the laboratory — to measure what had only been felt, to test what had only been assumed, and to carry the result out to the world. Under his leadership a regional workshop became a global maker.",
    },
  ] satisfies ParadoxPanel[],
} as const

/**
 * The character hook: total immersion in the craft. Anecdote is verified.
 */
export const immersion = {
  eyebrow: 'The Factory Floor',
  title: 'He learned the piano by living inside it',
  body: [
    "Shigeru Kawai joined the family firm in 1946 and gave himself to it completely. As a young worker he would stand on the factory floor for the length of a working day, and there were nights he simply slept in the factory rather than leave the work unfinished. In those early years he and his co-workers even bathed together using a steel drum can for a bathtub — a life lived, quite literally, inside the making of the piano.",
    "That immersion is the key to the man. It is why, decades later and running the whole company, he still trusted the hand and the ear above any instrument on a bench — because he had felt, in his own hands, what a piano is and what it asks of the people who build it.",
  ],
  quote: "If you don't like the piano that you build, build it again.",
  figureLabel: 'The Workshop',
  figureAlt: 'A Kawai upright piano in a quiet drawing room',
} as const

/**
 * The scientific approach — and the careful framing of the ABS breakthrough.
 * ABS composite action parts are credited to Kawai's engineers under his
 * leadership, beginning in 1968. He is NOT described as the inventor.
 */
export const science = {
  eyebrow: 'A Scientific Approach',
  title: 'Bringing the laboratory to the workshop',
  body: [
    "What Shigeru Kawai added to his father's craft was method. He believed the qualities pianists prize — stability, consistency, evenness of touch — could be studied, measured, and engineered without ever surrendering the hand that finishes the instrument. He set out to combine hand-craftsmanship with the finest technology, and he built the culture that could actually do it.",
    "That culture produced a genuine breakthrough. Beginning in 1968, under his leadership, Kawai's engineers pioneered the use of ABS composite parts in the piano action — components that resist the swelling and shrinking that plague wood in changing humidity, holding their regulation where all-wood actions drift. It was not the work of one man's hands but of a company organised, at last, to innovate — which was precisely his intent.",
  ],
  figureLabel: 'Action & Soundboard',
  figureAlt: 'Macro detail of a Kawai piano soundboard and action',
} as const

/**
 * The modernizer, in dates. Every milestone here falls within his presidency
 * (1955–1989) and is verified. The namesake line (1999) is deliberately NOT
 * here — it came after his presidency and belongs to the legacy section.
 */
export const expansion = {
  eyebrow: 'The Modernizer',
  title: 'A regional workshop becomes a global maker',
  intro:
    'Under Shigeru Kawai the company reached outward — into education, into new materials, and across the world. The dates tell the story of a modernizer at work.',
  milestones: [
    {
      year: '1956',
      title: 'The Kawai Music School',
      body: "He founded the Kawai Music School, extending the company from making instruments to teaching the people who would play them.",
    },
    {
      year: '1963',
      title: 'Kawai America, Los Angeles',
      body: "He established Kawai America in Los Angeles — the company's first overseas subsidiary, and the beginning of its life as a global maker.",
    },
    {
      year: '1968',
      title: 'ABS composite action parts',
      body: "Beginning in the late 1960s, Kawai's engineers pioneered ABS composite parts in the piano action under his leadership.",
    },
    {
      year: '1975',
      title: 'Kawai Canada',
      body: 'The company established its Canadian presence, continuing the outward expansion across North America.',
    },
    {
      year: '1976–1979',
      title: 'Into Germany & Europe',
      body: 'Kawai extended into Germany and the wider European market, carrying the brand to the heart of the classical piano world.',
    },
    {
      year: '1980',
      title: 'Ryuyo Grand Piano Factory & Research Laboratory',
      body: 'He opened the Ryuyo facility near Hamamatsu — conceived not merely as a factory but as a research centre for grand-piano making.',
    },
    {
      year: '1981',
      title: 'The EX Concert Grand',
      body: 'The EX concert grand was completed — a flagship instrument built to compete on the world stage.',
    },
    {
      year: '1985',
      title: 'The concert stage & national honour',
      body: "Kawai's EX was used at the International Chopin Piano Competition, and Shigeru Kawai received the Blue Ribbon Medal.",
    },
  ] satisfies Milestone[],
} as const

/**
 * Ryuyo as a research centre, and the EX. Framed as a laboratory, not a factory.
 */
export const ryuyo = {
  eyebrow: 'Ryuyo · 1980',
  title: 'A factory built as a laboratory',
  body: [
    "The Ryuyo Grand Piano Factory, opened in 1980, was the fullest expression of his method. Its very name carries a research laboratory, because that is what he intended: a place where the finest grands could be built by hand and, at the same time, studied and refined — where tone could be measured as well as heard.",
    "It was in this culture that the EX concert grand, completed in 1981, took shape — an instrument built to stand on the world's stages. In 1985 the EX was chosen for the International Chopin Piano Competition, one of the most demanding proving grounds a concert piano can face.",
  ],
  figureLabel: 'The Grand Piano',
  figureAlt: 'A Kawai grand piano in a refined interior',
} as const

/**
 * Recognition, later years, and the namesake line — the company honouring him.
 */
export const legacy = {
  eyebrow: 'Recognition & Legacy',
  title: 'His name on the world’s finest pianos',
  body: [
    "In 1985 the Japanese government awarded Shigeru Kawai the Blue Ribbon Medal, a national Medal of Honour recognising distinguished contribution. He led Kawai as president until 1989, then served as chairman and later as a consultant to the company until his death in 2006, at the age of eighty-four.",
    "In 1999 — a decade after he stepped down as president — Kawai launched a namesake line of hand-built concert grands, the Shigeru Kawai, in his honour. It was the company's answer to the aspiration that had driven his whole career: to build the world's finest pianos. The instruments carry his name; the method behind them carries his mind.",
  ],
  quote: 'Creating pianos is the greatest job I have ever had!',
} as const

/**
 * Closing coda — thesis restated, cross-links, and CTAs.
 */
export const closing = {
  eyebrow: 'The Second Generation',
  title: "A craftsman's hands, a scientist's mind",
  body: "Shigeru Kawai inherited a workshop and left a modern piano maker — without ever letting go of the hand that made the workshop worth inheriting. The paradox was the point, and it is still audible in every Kawai built today.",
  links: [
    { label: 'Koichi Kawai — the founder', href: '/about/heritage/koichi-kawai' },
    { label: 'Hirotaka Kawai — his successor', href: '/about/heritage/hirotaka-kawai' },
    { label: 'The technology he began', href: '/technology' },
    { label: 'The Shigeru Kawai line', href: '/pianos/shigeru-kawai' },
    { label: 'All of Kawai heritage', href: '/about/heritage' },
  ] satisfies CrossLink[],
} as const

/**
 * Quiet sources footnote — Kawai's own public pages. Optional, for E-E-A-T.
 */
export const sources: CrossLink[] = [
  { label: 'Kawai — Company History', href: 'https://www.kawai-global.com/company/history/' },
  { label: 'Shigeru Kawai', href: 'https://www.shigerukawai.com/' },
]

/** Atmosphere imagery (used with scrims — never as a portrait). */
export const atmosphere = {
  workshop: brandImages.upright,
  action: brandImages.soundboard,
  grand: brandImages.luxeRoom,
} as const
