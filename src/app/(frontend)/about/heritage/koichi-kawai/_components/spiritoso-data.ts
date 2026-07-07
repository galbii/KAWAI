/**
 * Content for the "Spiritoso" cinematic story of Koichi Kawai.
 * Chapters follow the animated film's chronology: 1897 → 1907 → 1927 → 1953/55.
 */

const R2 = 'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media'

export const storyImages = {
  koichi: `${R2}/KoichiKawai.webp`,
  founders: `${R2}/Kawai%20Founders.webp`,
  hamamatsu: `${R2}/HamamatsuStreetscape.webp`,
  // Brand atmospherics from the /about art-direction family.
  soundboard: `${R2}/1024-685-max.jpg`,
  warmPianist: `${R2}/250829_0113-1.webp`,
  luxeRoom: `${R2}/MS130_RGB_image_04.webp`,
} as const

export type Chapter = {
  id: string
  /** Year shown in the rail + as a watermark. */
  year: string
  /** Evocative chapter name — the headline. */
  name: string
  /** Descriptive subtitle. */
  subtitle: string
  body: string[]
  image: string
  imageAlt: string
  /** Period caption, e.g. "Hamamatsu, Japan". */
  place?: string
  /** Which side the copy sits on (alternates down the page). */
  align: 'left' | 'right'
}

export const chapters: Chapter[] = [
  {
    id: 'spark',
    year: '1897',
    name: 'A Spark of Wonder',
    subtitle: 'Discovering the Art of Instrument Making',
    image: storyImages.hamamatsu,
    imageAlt: 'A Hamamatsu streetscape near the turn of the 20th century',
    place: 'Hamamatsu, Japan',
    align: 'left',
    body: [
      'The story begins in Hamamatsu, Japan, just before the turn of the 20th century. Hamamatsu is now globally recognised as the “City of Music,” but in 1897 that legacy was only just beginning to take root.',
      'Here we meet a young Koichi Kawai — a boy with an extraordinary innate talent for mechanics and invention. The pivotal moment comes when he is introduced to an early keyboard instrument, likely a reed organ. The look of sheer amazement on his face captures the exact instant a lifelong passion was ignited. It was here that Koichi realised his calling: not just to build machines, but to craft instruments that could sing.',
    ],
  },
  {
    id: 'pursuit',
    year: '1907',
    name: 'The Pursuit of Perfection',
    subtitle: 'The First Japanese-Made Piano Action',
    image: storyImages.soundboard,
    imageAlt: 'The inner workings of a Kawai piano',
    align: 'right',
    body: [
      'As Koichi grew, so too did his unparalleled skill. Having apprenticed under Torakusu Yamaha, he became a central figure in the research and development of early Japanese pianos — at a time when Japan was heavily reliant on imported parts to construct Western musical instruments.',
      'In 1907 came a monumental milestone: Koichi’s successful completion of the first entirely Japanese-made piano action. Meticulously sanding wood, drafting blueprints, collaborating with his peers — his tireless dedication and collaborative spirit overcame immense technical hurdles. He was not just an inventor; he was a pioneer pushing the boundaries of what domestic craftsmanship could achieve.',
    ],
  },
  {
    id: 'path',
    year: '1927',
    name: 'Forging a New Path',
    subtitle: 'The Birth of Kawai',
    image: storyImages.founders,
    imageAlt: 'The founders of the Kawai Musical Instrument Research Laboratory, 1927',
    place: 'The Kawai Musical Instrument Research Laboratory',
    align: 'left',
    body: [
      'The film takes a solemn turn as an older Koichi stands silently before a grave — the passing of his employer and mentor, a great loss that would become a major turning point in his life.',
      'Driven by an unwavering desire to build the world’s finest pianos, Koichi struck out on his own. In 1927, alongside seven like-minded craftsmen, he founded the Kawai Musical Instrument Research Laboratory. He stepped into his own as a leader, yet remained intimately connected to the tactile, hands-on crafting of the instruments he so deeply loved.',
    ],
  },
  {
    id: 'legacy',
    year: '1953',
    name: 'Recognition & Legacy',
    subtitle: 'Passing the Spirit to the Next Generation',
    image: storyImages.warmPianist,
    imageAlt: 'A pianist at a Kawai grand piano',
    align: 'right',
    body: [
      'Koichi’s relentless pursuit of excellence did not go unnoticed. In 1953, the Japanese government awarded him the prestigious Medal with Blue Ribbon — making him the very first person in the musical instrument industry to receive such an honour.',
      'As the film draws to a close, we see Koichi at the piano before the image transitions to a younger man: Shigeru Kawai, the second president. Taking the reins in 1955, Shigeru would modernise Kawai’s manufacturing and introduce the brand to the world. A clenched fist and a confident smile symbolise the passing of the torch — ensuring that Koichi’s spirit of innovation would echo through generations to come.',
    ],
  },
]

export const scoreCopy = {
  eyebrow: 'The Original Score',
  title: 'The Spirit of Craftsmanship, Carried in Sound',
  subtitle: 'An Original Score Inspired by Koichi Kawai’s Legacy',
  intro: [
    'The music that accompanies this film is, like the story itself, deeply rooted in Kawai’s history. The original score was created by a young Kawai staff member, who carefully explored how best to express the spirit of founder Koichi Kawai through sound as well as image.',
  ],
  quote:
    'When he was fully satisfied, Koichi would sit at the instrument and play a phrase from “Echigo Jishi.” The moment that familiar phrase echoed through the factory, the technicians could finally breathe a sigh of relief.',
  body: [
    'At the heart of the composition lies a cherished story passed down through generations. It is said that Koichi personally carried out the final inspection of every completed piano. His standards were exacting, and the technicians would wait in silence, holding their breath as he made his judgment.',
    'This image — of a single melody signalling that a piano had met Koichi’s uncompromising standards — remains a powerful symbol of Kawai’s enduring commitment to craftsmanship. The score is built as an homage to Echigo Jishi, the motif serving as the unifying theme throughout, returning in increasingly expressive variations as the story unfolds.',
    'The quoted musical idea is inspired by the Echigo Jishi passage in Act I of Puccini’s Madama Butterfly — the moment Cio-Cio-San recounts how she became a geisha. Because that passage stands musically on its own, it offered a compelling way to imagine what Koichi himself may once have played.',
    'For the piano sound itself, the production uses “Piano Premier ‘Kawai Legend,’” a software instrument sampled from the SK-EX concert grand. Through the voice of Kawai’s finest piano, the score reimagines the very note to which our founder once listened so intently.',
  ],
}

export const filmCopy = {
  eyebrow: 'The Animated Short Film',
  title: 'Watch the Full Animated Story',
  body: 'Experience the complete animated journey of Koichi Kawai and discover the origins of a legacy that continues to inspire pianists around the world.',
}

/**
 * YouTube ID for the Spiritoso film. Leave empty to render the cinematic
 * "coming soon" poster; drop the ID in when the video is published.
 */
export const SPIRITOSO_VIDEO_ID = 'AVaa7UmqD5g'
