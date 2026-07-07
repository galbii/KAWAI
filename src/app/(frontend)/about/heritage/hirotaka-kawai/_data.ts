/**
 * Content for the Hirotaka Kawai legacy page
 * (/about/heritage/hirotaka-kawai).
 *
 * Hirotaka Kawai (b. 1947 – d. 23 February 2024) was the third-generation
 * president of Kawai — son of Shigeru Kawai and grandson of founder Koichi
 * Kawai. This is a DIGNIFIED, PAST-TENSE legacy/memorial page. The thesis: the
 * leader who married robotics to handcraft and made Kawai a global company
 * without losing the craft.
 *
 * FACTS: every date, number and honor on this page is drawn from a verified
 * fact list (see the build report). Do not add specifics here without a cited
 * source — Hirotaka Kawai is recently deceased and accuracy is paramount. The
 * one philosophy line ("the quest for perfection…") is treated as a Kawai brand
 * statement of his era, not a confirmed first-person quote.
 *
 * Atmosphere imagery only (no portrait of Hirotaka exists) — the hero portrait
 * slot renders a labelled placeholder for Kawai to fill later.
 */

import { brandImages } from '@/lib/brand/images'

/* ---------------------------------------------------------------------------
 * SEO
 * ------------------------------------------------------------------------ */

export const hirotakaSeo = {
  path: '/about/heritage/hirotaka-kawai',
  title: 'Hirotaka Kawai — The Third President of Kawai (1947–2024) | Kawai',
  description:
    'Hirotaka Kawai (1947–2024), third-generation president of Kawai — the leader who brought robotics into the workshop without surrendering the craft, launched the Shigeru Kawai grand line, and built Kawai into a global piano maker.',
  keywords: [
    'Hirotaka Kawai',
    'Hirotaka Kawai president',
    'Kawai third generation',
    'Hirotaka Kawai legacy',
    'Hirotaka Kawai obituary',
    'third president of Kawai',
    'Shigeru Kawai grand pianos',
    'Kawai Millennium III',
    'Kawai company history',
  ],
  ogImage: brandImages.soundboard,
  ogImageAlt:
    'A Kawai grand piano action — the intersection of engineering and handcraft that defined Hirotaka Kawai’s tenure',
  datePublished: '2026-07-07',
  birthDate: '1947-06-27',
  deathDate: '2024-02-23',
} as const

/* ---------------------------------------------------------------------------
 * Hero — restrained memorial
 * ------------------------------------------------------------------------ */

export const hirotakaHero = {
  eyebrow: 'In Memoriam · 1947–2024',
  name: 'Hirotaka Kawai',
  years: '1947 — 2024',
  role: 'Third President of Kawai · 1989–2024',
  dedication:
    'Hirotaka Kawai · 1947–2024 · Third President of Kawai — the leader who married robotics to handcraft, and carried a family workshop onto the world stage.',
  /** Labelled placeholder for the portrait slot until a Kawai image is supplied. */
  portraitLabel: 'Hirotaka Kawai',
  portraitSub: 'Portrait to follow',
} as const

/* ---------------------------------------------------------------------------
 * Thesis
 * ------------------------------------------------------------------------ */

export const hirotakaThesis = {
  eyebrow: 'A Life’s Work',
  lead: 'The machine and the hand.',
  body: [
    'When Hirotaka Kawai became president in 1989, he inherited a company built by two exacting men — his grandfather Koichi, who had made Japan’s first piano action, and his father Shigeru, who had turned it into an art. What he added was a paradox that would define the next thirty-five years: he brought advanced robotics into the workshop, and used them to protect the work of human hands.',
    'His conviction was simple. A machine should carry every burden a machine could carry perfectly — so that a trained ear and a practised touch could be spent only where they were irreplaceable. It was the longest tenure of any Kawai president, and under it the family workshop became a global manufacturer without ever ceasing to be a workshop.',
  ],
} as const

/* ---------------------------------------------------------------------------
 * Stat band — his era at a glance
 * ------------------------------------------------------------------------ */

export type HirotakaStat = { value: string; label: string }

export const hirotakaStats: HirotakaStat[] = [
  { value: '1947–2024', label: 'A Life in Pianos' },
  { value: '1989', label: 'Became President' },
  { value: '2M', label: 'Pianos by 1990' },
  { value: '1991', label: 'Manufacturing Abroad' },
  { value: '2010', label: 'Poland’s Grand Cross' },
]

/* ---------------------------------------------------------------------------
 * Chapters — the narrative spine
 * ------------------------------------------------------------------------ */

export type ChapterTone = 'pearl' | 'black'

export type Chapter = {
  id: string
  /** Two-digit index shown in the sticky rail. */
  index: string
  /** Small tracked kicker, e.g. an era or theme. */
  kicker: string
  eyebrow: string
  title: string
  /** Serif italic lead line. */
  lead: string
  body: string[]
  tone: ChapterTone
  /** Optional pull-quote. */
  pullquote?: string
  /** Optional attribution line beneath the pull-quote. */
  pullquoteNote?: string
  /** Optional two-up "duality" cards (robotics ↔ hand). */
  duality?: { label: string; heading: string; text: string }[]
  /** Optional labelled media placeholder (atmosphere / to-follow). */
  media?: { image?: string; imageAlt?: string; label: string; caption: string }
  /** Optional inline cross-link. */
  link?: { href: string; label: string }
}

export const chapters: Chapter[] = [
  {
    id: 'robotics-and-handcraft',
    index: '01',
    kicker: 'The Defining Idea · from 1989',
    eyebrow: 'Robotics & Handcraft',
    title: 'Precision for the machine, judgement for the hand',
    lead: 'He invested tens of millions to automate everything a machine could do perfectly — and reserved for people the work no machine could judge.',
    tone: 'pearl',
    body: [
      'On taking the presidency in 1989, Hirotaka Kawai pledged to carry on the commitment to excellence of his father and grandfather. He kept that promise in an unexpected way. Rather than treat automation as a threat to craftsmanship, he treated it as its guardian — the means to remove human error from the tasks that only demanded consistency, and to concentrate human skill on the tasks that demanded a human.',
      'Advanced robotics took on the repeatable, the measurable, the tirelessly precise. What stayed in human hands was everything a trained ear and a practised touch alone could settle: the final voicing, the regulation of an action, the listening that tells a maker when an instrument is finished. It was a philosophy of both/and, not either/or — and it let Kawai raise its scale and its standard at the same time.',
    ],
    duality: [
      {
        label: 'By the machine',
        heading: 'What precision demands',
        text: 'The repeatable and the measurable — cut, formed and finished to a tolerance no hand could hold across thousands of instruments. Consistency, made absolute.',
      },
      {
        label: 'By the hand',
        heading: 'What a piano demands',
        text: 'Voicing, regulation, the final listening — the judgements only a trained ear and a practised touch can make. Character, left to people.',
      },
    ],
    pullquote: 'The quest for perfection is not just an ideal, but a duty.',
    pullquoteNote: 'A guiding statement of the Kawai workshop in his era',
  },
  {
    id: 'a-global-company',
    index: '02',
    kicker: 'Expansion · 1990s onward',
    eyebrow: 'A Company Without Borders',
    title: 'The first to build Kawai beyond Japan',
    lead: 'He was the first Kawai leader to move production outside Japan — and by 1990, Kawai had built its two-millionth piano.',
    tone: 'black',
    body: [
      'Under Hirotaka Kawai, the company that had been born at a single Hamamatsu workbench became a manufacturer on several continents. In 1991 he established Kawai Asia Manufacturing in Malaysia — the first Kawai production ever sited outside Japan. Kawai Finishing followed in the United States in 1995, alongside Kawai America Manufacturing and the acquisition of the Lowrey Organ Company, and manufacturing later reached Indonesia.',
      'Scale, for him, was never the point in itself; it was what allowed the standard to travel. The milestone that opened the decade said it plainly — by 1990 total Kawai piano production had reached two million instruments — but the achievement he cared about was that a piano built anywhere in the Kawai world was still built to one exacting idea of what a piano should be.',
    ],
    pullquote: 'A workshop that became a company — without ever ceasing to be a workshop.',
    media: {
      label: 'Kawai · global manufacturing',
      caption: 'Malaysia 1991 · United States 1995 · Indonesia',
    },
  },
  {
    id: 'shigeru-kawai',
    index: '03',
    kicker: 'The Flagship · 1999',
    eyebrow: 'A Name to Honour a Father',
    title: 'Shigeru Kawai',
    lead: 'In 1999 he launched Kawai’s flagship luxury grand line and gave it his father’s name.',
    tone: 'pearl',
    body: [
      'Some tributes are spoken. This one was built. In 1999, Hirotaka Kawai introduced a new line of hand-built concert and luxury grand pianos and named it Shigeru Kawai — after his father, the second-generation president under whom the modern Kawai grand had come of age. It made the family story audible: a son placing his father’s name on the finest instruments the company knew how to make.',
      'The Shigeru Kawai line became the summit of the range and a fixture on the world’s concert stages — the clearest expression of the both/and philosophy, where the reach of modern manufacturing serves pianos still finished, voiced and judged entirely by hand.',
    ],
    link: { href: '/pianos/shigeru-kawai', label: 'Explore the Shigeru Kawai grand pianos' },
  },
  {
    id: 'the-action',
    index: '04',
    kicker: 'Engineering · 2002 onward',
    eyebrow: 'The Action, Reimagined',
    title: 'Millennium III',
    lead: 'In 2002, the ABS-Carbon action gave a new material to the oldest problem in the piano — and crowned a lineage begun in the 1960s.',
    tone: 'black',
    body: [
      'The touch of a piano begins in its action — the mechanism that carries a pianist’s intention to the string. Kawai had pioneered composite actions since the late 1960s, and under Hirotaka Kawai that lineage reached its capstone: the Millennium III action of 2002, formed from an ABS-Carbon composite that was lighter, stronger and more stable than the wood it replaced. It let players move faster and more precisely, and it held its regulation where timber warps.',
      'It was engineering in service of feel, not for its own sake. His tenure also saw the flagship RX Series artist grands refined into the improved RX-H line in 2008, and — during his leadership — Kawai advanced into hybrid instruments that joined a real acoustic action to digital sound. Each was the same instinct at work: let new means protect an old standard.',
    ],
    link: { href: '/technology', label: 'Inside the Millennium III action' },
  },
]

/* ---------------------------------------------------------------------------
 * Honour — the Grand Cross (distinctive highlight)
 * ------------------------------------------------------------------------ */

export const hirotakaHonour = {
  eyebrow: 'A National Honour',
  year: '2010',
  award: 'Grand Cross of the Order of Merit of the Republic of Poland',
  body: [
    'In 2010, Hirotaka Kawai was personally awarded the Grand Cross of the Order of Merit of the Republic of Poland — one of that nation’s highest honours. It recognised him not as a manufacturer but as a patron, tied to Kawai’s long support of the International Chopin Piano Competition in Warsaw.',
    'For a piano maker, few tributes carry more meaning. It placed the third-generation head of a Hamamatsu workshop among the guardians of a musical tradition, and honoured a lifetime spent in service of the instrument he was raised beside.',
  ],
} as const

/* ---------------------------------------------------------------------------
 * Milestones — a compact era timeline
 * ------------------------------------------------------------------------ */

export type Milestone = { year: string; title: string; description: string }

export const milestones: Milestone[] = [
  {
    year: '1989',
    title: 'The third president',
    description:
      'Hirotaka Kawai became president; his father Shigeru became chairman. The commitment to excellence passed to a third generation.',
  },
  {
    year: '1990',
    title: 'Two million pianos',
    description: 'Total Kawai piano production reached two million instruments.',
  },
  {
    year: '1991',
    title: 'Manufacturing beyond Japan',
    description:
      'Kawai Asia Manufacturing was established in Malaysia — the first Kawai production sited outside Japan.',
  },
  {
    year: '1995',
    title: 'A footprint in America',
    description:
      'Kawai Finishing opened in the United States, alongside Kawai America Manufacturing and the acquisition of the Lowrey Organ Company.',
  },
  {
    year: '1999',
    title: 'The Shigeru Kawai line',
    description:
      'Kawai’s flagship luxury grand line launched, named in honour of his father, Shigeru Kawai.',
  },
  {
    year: '2002',
    title: 'Millennium III',
    description:
      'The ABS-Carbon composite action arrived — the capstone of Kawai’s composite-action lineage.',
  },
  {
    year: '2007',
    title: 'Eighty years of advancement',
    description:
      'Kawai marked its 80th anniversary and opened its first Kawai Music School in Shanghai.',
  },
  {
    year: '2010',
    title: 'Poland’s Grand Cross',
    description:
      'Awarded the Grand Cross of the Order of Merit of the Republic of Poland, tied to Kawai’s support of the Chopin Competition.',
  },
  {
    year: '2015',
    title: 'Chairman and president',
    description:
      'Appointed chairman while retaining the presidency — leading the company he had guided for a quarter century.',
  },
  {
    year: '2017',
    title: 'Ninety years',
    description: 'Kawai celebrated its 90th anniversary as a global piano maker.',
  },
  {
    year: '2024',
    title: 'A tenure remembered',
    description:
      'Hirotaka Kawai died on 23 February 2024 while serving as chairman, president and CEO. Kentaro Kawai became the fourth president.',
  },
]

/* ---------------------------------------------------------------------------
 * Succession
 * ------------------------------------------------------------------------ */

export const hirotakaSuccession = {
  eyebrow: 'The Fourth Generation',
  title: 'The standard carries on',
  body: 'Hirotaka Kawai died on 23 February 2024, having led Kawai for thirty-five years — the longest presidency in the company’s history. In the same month, Kentaro Kawai became the fourth president, inheriting the both/and conviction that had guided his predecessor: that new means exist to protect an old standard, and that a piano is worth building only if it is built better than before.',
  successorHref: '/about/heritage/kentaro-kawai',
  successorLabel: 'Meet Kentaro Kawai, the fourth president',
  predecessorHref: '/about/heritage/shigeru-kawai',
  predecessorLabel: 'Shigeru Kawai, his father',
} as const

/* ---------------------------------------------------------------------------
 * Closing
 * ------------------------------------------------------------------------ */

export const hirotakaClose = {
  eyebrow: 'His Legacy, Played',
  title: 'Hear the instruments he built for the world',
  body: 'Every Kawai grand carries the idea Hirotaka Kawai spent a lifetime refining — the precision of the machine, kept in service of the hand. Play one, and you play his legacy.',
} as const
