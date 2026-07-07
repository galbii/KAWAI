/**
 * Content for the Kawai company heritage page (/about/heritage).
 *
 * This is the COMPANY's story across eras and four generations — founding,
 * succession, technical milestones, global growth, and today. The founder's
 * personal biography lives on /about/heritage/koichi-kawai (the "Spiritoso" film); this
 * page opens on the Torakusu-Yamaha apprentice hook and then links there rather
 * than retelling it.
 *
 * All dated facts are verified against kawai-global.com/company/history and
 * kawaius.com/company/timeline (see the page's final report for the source list).
 */

import { brandImages } from '@/lib/brand/images'

export const heritageImages = brandImages

/* ---------------------------------------------------------------------------
 * SEO
 * ------------------------------------------------------------------------ */

export const heritageSeo = {
  path: '/about/heritage',
  title: 'The History of Kawai — Crafting Pianos Since 1927 | Kawai',
  description:
    'The history of Kawai pianos across four generations — from founder Koichi Kawai, once an apprentice to Torakusu Yamaha, to the founding of Kawai in 1927 in Hamamatsu, and a global piano maker today.',
  keywords: [
    'history of Kawai pianos',
    'Kawai founded 1927',
    'oldest Japanese piano maker',
    'did Kawai work for Yamaha',
    'Kawai vs Yamaha history',
    'Kawai company history',
    'Koichi Kawai',
    'Kawai Musical Instruments history',
    'four generations of Kawai',
  ],
  ogImage: heritageImages.upright,
  ogImageAlt: 'A Kawai upright piano — a century of Japanese piano craftsmanship',
  datePublished: '2026-07-07',
} as const

/* ---------------------------------------------------------------------------
 * Hero
 * ------------------------------------------------------------------------ */

export const heritageHero = {
  eyebrow: 'Heritage · Since 1927',
  title: 'The History of Kawai',
  kicker: 'Est. 1927 · Hamamatsu, Japan',
  lead:
    'Kawai began not in a boardroom but at a workbench — with a craftsman who had helped build Japan’s very first piano. This is the story of how one apprentice’s obsession with the instrument became a company carried across four generations, and one of the most celebrated names in piano making in the world.',
  image: heritageImages.upright,
  imageAlt: 'A Kawai upright piano in a light-filled room',
} as const

/* ---------------------------------------------------------------------------
 * Stat band
 * ------------------------------------------------------------------------ */

export type HeritageStat = { value: string; label: string }

export const heritageStats: HeritageStat[] = [
  { value: '1927', label: 'Founded in Hamamatsu' },
  { value: '3', label: 'Generations of Kawai' },
  { value: '2.4M+', label: 'Pianos Crafted' },
  { value: '61+', label: 'Competition Victories' },
]

/* ---------------------------------------------------------------------------
 * Eras — the narrative spine of the page
 * ------------------------------------------------------------------------ */

export type EraAside = {
  /** Question-style sub-heading (rendered as <h3>) — tuned to search intent. */
  question: string
  answer: string[]
}

export type Era = {
  /** Anchor id + rail marker. */
  id: string
  /** Small years label shown in the rail + eyebrow. */
  years: string
  eyebrow: string
  /** Section heading (rendered as <h2>). */
  title: string
  lead: string
  body: string[]
  /** Optional pull-quote inside the era. */
  pullquote?: string
  /** Optional Q&A asides (each a <h3> + copy). */
  asides?: EraAside[]
  image: string
  imageAlt: string
  imageSide: 'left' | 'right'
  tone: 'pearl' | 'black' | 'white'
}

export const eras: Era[] = [
  {
    id: 'origins',
    years: '1886–1926',
    eyebrow: 'The Origins · 1886–1926',
    title: 'An Apprentice to Torakusu Yamaha',
    lead:
      'Before there was a company called Kawai, there was a boy from Hamamatsu with an unusual gift for machines that make music.',
    body: [
      'Koichi Kawai was born in Hamamatsu in 1886, at the very moment Japan was learning to build the Western instruments it had long imported. As a young man he apprenticed under Torakusu Yamaha, the pioneer of Japanese instrument manufacturing, and joined the team that assembled Japan’s first domestically produced piano. It was rare, exacting work, and Koichi proved to be one of its most inventive minds.',
      'His defining breakthrough came in 1907, when he completed the first entirely Japanese-made piano action — the intricate mechanism of levers, hammers and springs that translates a pianist’s touch into sound. Until then, Japanese piano makers had depended on imported actions. Koichi’s achievement freed a nation’s piano industry from that reliance and marked him, still in his early twenties, as a genuine pioneer of the craft.',
      'For nearly two decades he remained at the heart of early Japanese piano development, refining the mechanism he had helped invent. But a restless conviction was forming: that he could build a better piano his own way, answerable to no standard but his own.',
    ],
    asides: [
      {
        question: 'Did Kawai work for Yamaha?',
        answer: [
          'Yes. Kawai’s founder, Koichi Kawai, apprenticed under Torakusu Yamaha and was part of the team that built Japan’s first piano. The two great names of Japanese piano making share a single origin story — a workshop in Hamamatsu where an entire industry was being invented. Koichi went on to found his own company, Kawai, in 1927.',
        ],
      },
    ],
    image: heritageImages.soundboard,
    imageAlt: 'The inner action and soundboard of a Kawai piano',
    imageSide: 'right',
    tone: 'pearl',
  },
  {
    id: 'founding',
    years: '1927',
    eyebrow: 'The Founding · 1927',
    title: 'Kawai Is Founded in 1927',
    lead:
      'With seven fellow craftsmen and a single ambition — to build the finest pianos in the world — Koichi Kawai set out on his own.',
    body: [
      'In 1927, in Hamamatsu, Koichi Kawai founded the Kawai Musical Instrument Research Laboratory — later incorporated as Kawai Musical Instruments Manufacturing Co., Ltd. He began not with a factory but with a laboratory, a word chosen deliberately: from the first day, Kawai defined itself as a company of inquiry as much as manufacture, forever asking how the piano might be made better.',
      'The seven craftsmen who joined him were master builders in their own right, and the young enterprise placed research and hands-on artistry side by side. Koichi himself never left the bench. It is said he personally inspected every completed instrument, and would sit and play a phrase only once a piano had met his uncompromising standard — a ritual that told the workshop the piano was worthy of the Kawai name.',
      'That founding spirit — craft disciplined by curiosity — became the through-line of everything the company would build over the next century. Kawai’s recognition was not long in coming: in 1953 the Japanese government awarded Koichi the Medal with Blue Ribbon, the first such honour given to anyone in the musical instrument industry.',
    ],
    pullquote:
      'From the first day, Kawai defined itself as a company of inquiry as much as manufacture.',
    asides: [
      {
        question: 'Is Kawai the oldest Japanese piano maker?',
        answer: [
          'Kawai was founded in 1927 and is one of Japan’s oldest and most storied piano makers — though not the first Japanese company to make pianos. What sets its heritage apart is its founder: Koichi Kawai helped build Japan’s very first piano two decades earlier, in the workshop of Torakusu Yamaha, and in 1907 completed the first entirely Japanese-made piano action. Few piano companies can trace their lineage so directly to the origin of an entire nation’s instrument.',
        ],
      },
      {
        question: 'Kawai vs Yamaha: a shared beginning',
        answer: [
          'The history of Kawai and Yamaha is intertwined at the root. Both trace back to the same Hamamatsu workshop where Japan’s piano industry was born, and to the same founding generation of craftsmen. Kawai’s distinction is its unbroken family stewardship — four generations of the Kawai family have led the company — and an engineering culture that repeatedly reinvented the piano action, the instrument’s most critical moving part.',
        ],
      },
    ],
    image: heritageImages.warmPianist,
    imageAlt: 'A pianist at a Kawai grand piano',
    imageSide: 'left',
    tone: 'black',
  },
  {
    id: 'succession',
    years: '1955–1988',
    eyebrow: 'The Second Generation · 1955–1988',
    title: 'A Scientific Approach and a Global Reach',
    lead:
      'When Koichi died in 1955, his son Shigeru Kawai inherited both a company and a question: how do you honour a craft while carrying it into the modern age?',
    body: [
      'Shigeru Kawai became president in 1955 and brought a scientific, systematic mind to his father’s artisan legacy. Where Koichi had built by feel and instinct, Shigeru added measurement, materials research and manufacturing discipline — never replacing the craft, but giving it a rigorous foundation on which to grow.',
      'Under his leadership Kawai reached beyond Japan. In 1963 the company established Kawai America Corporation in Los Angeles, one of its first international subsidiaries, opening the United States to Kawai instruments. Production scaled to meet the world: Kawai built its one-millionth piano in 1978 and its two-millionth by 1990.',
      'This era also produced two of Kawai’s most consequential decisions. In 1971 the company pioneered the use of ABS composite parts in the piano action — a material more stable than wood, immune to the swelling and shrinking that humidity inflicts on traditional mechanisms. And in 1980 Kawai opened the Ryuyo Grand Piano Facility near Hamamatsu, a plant conceived as a marriage of hand craftsmanship and advanced technology, and still the home of its finest grand pianos.',
      'Shigeru’s own name would ultimately grace the company’s pinnacle instruments. In 1999, after nearly half a century at the helm, he lent his name to the Shigeru Kawai series of luxury grand pianos — hand-built by a small circle of master artisans and voiced to the concert stage.',
    ],
    image: heritageImages.luxeRoom,
    imageAlt: 'A Kawai grand piano in a refined interior',
    imageSide: 'right',
    tone: 'pearl',
  },
  {
    id: 'third-generation',
    years: '1989–2024',
    eyebrow: 'The Third Generation · 1989–2024',
    title: 'Where Craft Meets Robotics',
    lead:
      'In 1989 the founder’s grandson, Hirotaka Kawai, became president — and set out to prove that automation and artistry could serve the same instrument.',
    body: [
      'Hirotaka Kawai introduced robotics and precision automation into Kawai’s factories, applying machines to the tasks where consistency matters most while reserving for human hands the work that only a trained ear and touch can judge. It was the third generation’s answer to the founder’s question: technology in service of craft, not in place of it.',
      'That philosophy reached its clearest expression in 2002 with the launch of the Millennium III action, an evolution of the composite mechanism Kawai had pioneered three decades earlier. By infusing its action components with carbon fibre, Kawai produced parts markedly lighter, stronger and faster than wood — enabling quicker repetition and a more responsive touch, while remaining impervious to the humidity that has plagued piano actions for two centuries.',
      'The result is a company that carries its founder’s bench-craft into an age of carbon fibre and robotics without losing the thread that connects them — a continuity of purpose spanning four generations of the Kawai family.',
    ],
    pullquote:
      'Technology in service of craft, not in place of it.',
    image: heritageImages.soundboard,
    imageAlt: 'A close view of a modern Kawai carbon-fibre piano action',
    imageSide: 'left',
    tone: 'black',
  },
  {
    id: 'today',
    years: 'Today',
    eyebrow: 'Kawai Today',
    title: 'A Global Legacy in Every Piano',
    lead:
      'Nearly a century after a craftsman built Japan’s first piano action, Kawai instruments are chosen on the world’s great stages and in homes across every continent.',
    body: [
      'Today Kawai stands among the most decorated names in piano making — with more than 61 international competition victories, over 50 major industry awards, and more than 2.4 million pianos built since 1927. Its instruments span the full arc of the art, from digital and hybrid pianos to the hand-built Shigeru Kawai concert grands that carry the founder’s name.',
      'In 2024, following the passing of Hirotaka Kawai, Kentaro Kawai became the company’s fourth president — taking the helm three years before Kawai’s centennial in 2027, and carrying its founding conviction into a second century.',
      'What has never changed is the conviction Koichi Kawai carried to his workbench in 1907: that a piano is worth building only if it is built better than it has ever been built before. Four generations later, that standard is still the one every Kawai instrument is measured against.',
    ],
    image: heritageImages.location,
    imageAlt: 'A contemporary Kawai piano in a modern setting',
    imageSide: 'right',
    tone: 'pearl',
  },
]

/* ---------------------------------------------------------------------------
 * The four generations (rendered as cards — names are NOT headings)
 * ------------------------------------------------------------------------ */

export type Generation = {
  name: string
  ordinal: string
  tenure: string
  theme: string
  blurb: string
  /** Link to this leader's dedicated heritage page, if one exists. */
  href?: string
}

export const generations: Generation[] = [
  {
    name: 'Koichi Kawai',
    ordinal: 'First Generation',
    tenure: '1927–1955',
    theme: 'The Founder’s Craft',
    blurb:
      'Built Japan’s first piano action in 1907 and founded Kawai in 1927. An inventor who never left the workbench, he set the standard the company still measures itself by.',
    href: '/about/heritage/koichi-kawai',
  },
  {
    name: 'Shigeru Kawai',
    ordinal: 'Second Generation',
    tenure: '1955–1989',
    theme: 'The Scientific Approach',
    blurb:
      'Brought materials research and manufacturing discipline to his father’s craft, pioneered the ABS composite action, and took Kawai global — lending his own name to the company’s finest grand pianos.',
    href: '/about/heritage/shigeru-kawai',
  },
  {
    name: 'Hirotaka Kawai',
    ordinal: 'Third Generation',
    tenure: '1989–2024',
    theme: 'Craft Meets Robotics',
    blurb:
      'Married precision robotics to hand craftsmanship and launched the carbon-fibre Millennium III action — proving that technology and artistry could serve the same instrument. Led Kawai for thirty-five years, until his passing in 2024.',
    href: '/about/heritage/hirotaka-kawai',
  },
  {
    name: 'Kentaro Kawai',
    ordinal: 'Fourth Generation',
    tenure: '2024–present',
    theme: 'The Next Century',
    blurb:
      'Kawai’s fourth president, who took the helm in 2024 — three years before the company’s centennial — with a renewed philosophy, “Let your life resound,” and an ambition to lead piano-making into its second century.',
    href: '/about/heritage/kentaro-kawai',
  },
]

/* ---------------------------------------------------------------------------
 * Milestone timeline
 * ------------------------------------------------------------------------ */

export type Milestone = {
  year: string
  title: string
  description: string
}

export const milestones: Milestone[] = [
  {
    year: '1886',
    title: 'A founder is born',
    description: 'Koichi Kawai is born in Hamamatsu, Japan — soon to become the country’s "City of Music."',
  },
  {
    year: '1907',
    title: 'Japan’s first piano action',
    description: 'Apprenticing under Torakusu Yamaha, Koichi completes the first entirely Japanese-made piano action.',
  },
  {
    year: '1927',
    title: 'Kawai is founded',
    description: 'Koichi founds the Kawai Musical Instrument Research Laboratory in Hamamatsu with seven fellow craftsmen.',
  },
  {
    year: '1953',
    title: 'The Medal with Blue Ribbon',
    description: 'Koichi becomes the first person in the musical instrument industry to receive the honour.',
  },
  {
    year: '1955',
    title: 'The second generation',
    description: 'Shigeru Kawai succeeds his father as president, bringing a scientific approach to the family craft.',
  },
  {
    year: '1963',
    title: 'Kawai reaches America',
    description: 'Kawai America Corporation is established in Los Angeles, one of the company’s first international subsidiaries.',
  },
  {
    year: '1971',
    title: 'The ABS composite action',
    description: 'Kawai pioneers ABS composite parts in the piano action — more stable than wood, immune to humidity.',
  },
  {
    year: '1978',
    title: 'One million pianos',
    description: 'Total piano production reaches one million instruments.',
  },
  {
    year: '1980',
    title: 'The Ryuyo Grand Piano Facility',
    description: 'Kawai opens its world-class grand piano plant near Hamamatsu — hand craftsmanship married to advanced technology.',
  },
  {
    year: '1989',
    title: 'The third generation',
    description: 'Hirotaka Kawai, the founder’s grandson, becomes president and introduces robotics alongside craft.',
  },
  {
    year: '1999',
    title: 'The Shigeru Kawai grand pianos',
    description: 'The Shigeru Kawai series of luxury, hand-built concert grand pianos is launched.',
  },
  {
    year: '2002',
    title: 'The Millennium III action',
    description: 'Carbon-fibre-infused action components deliver faster repetition and greater strength than wood.',
  },
  {
    year: '2024',
    title: 'The fourth generation',
    description: 'Following the passing of Hirotaka Kawai, Kentaro Kawai becomes the fourth president of Kawai — leading toward the company’s centennial in 2027.',
  },
  {
    year: 'Today',
    title: 'A global legacy',
    description: '61+ international competition victories, 50+ major awards, and 2.4M+ pianos built across four generations.',
  },
]

/* ---------------------------------------------------------------------------
 * Closing CTA
 * ------------------------------------------------------------------------ */

export const heritageClose = {
  eyebrow: 'The Story Continues',
  title: 'A legacy you can play',
  body:
    'Every Kawai instrument carries a century of craft — from Koichi Kawai’s first piano action to the concert grands built today. Explore the range, or meet the founder whose obsession started it all.',
} as const
