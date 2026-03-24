export type ShigeruModel = {
  slug: string
  name: string
  type: string
  tagline: string
  feet: string
  cm: string
  width: string
  widthCm: string
  weight: string
  weightKg: string
  beams: number
  finishes: string[]
  sellingPoints: string[]
  artistQuote: string
  artistName: string
  artistRole: string
  seoTitle: string
  seoDescription: string
}

export const SHIGERU_MODELS: ShigeruModel[] = [
  {
    slug: 'sk-2',
    name: 'SK-2',
    type: 'Classic Salon Grand',
    tagline: 'The first model in the premium line — rivals any piano of its class.',
    feet: "5' 11\"",
    cm: '180 cm',
    width: "5' 1\"",
    widthCm: '152 cm',
    weight: '714 lbs',
    weightKg: '324 kg',
    beams: 3,
    finishes: ['Polished Ebony', 'Sapele Mahogany Polish'],
    sellingPoints: [
      'First model in the premium Shigeru Kawai line',
      'Rivals any premium piano of its class',
      'Choice of talented musicians, teachers and demanding pianists worldwide',
      "Handcrafted in the Ryuyo grand piano factory — world's first ISO14001 certified piano factory",
    ],
    artistQuote:
      'I insist on a Shigeru Kawai for my recordings, my concerts and my home. It is the only piano I want to hear my music played on.',
    artistName: 'Adrian Farrugia',
    artistRole: 'Jazz Pianist',
    seoTitle: "Shigeru Kawai SK-2 Grand Piano | Classic Salon Grand | 5'11\"",
    seoDescription:
      "The Shigeru Kawai SK-2 Classic Salon Grand — 5 feet 11 inches of handcrafted excellence. The first model in the premium Shigeru Kawai line, handcrafted at the world's first ISO14001-certified piano factory in Hamamatsu, Japan.",
  },
  {
    slug: 'sk-3',
    name: 'SK-3',
    type: 'Conservatory Grand',
    tagline: 'Regarded as some of the finest pianos available — admired globally.',
    feet: "6' 2\"",
    cm: '188 cm',
    width: "5' 1\"",
    widthCm: '152 cm',
    weight: '736 lbs',
    weightKg: '334 kg',
    beams: 4,
    finishes: [
      'Polished Ebony',
      'Brown Sapele Mahogany',
      'Pyramid Mahogany (Limited Edition)',
    ],
    sellingPoints: [
      'Incredible blend of rich tone and responsive touch',
      'Admired by world-class pianists across the globe',
      'Regarded as some of the finest pianos available',
      'Second grand piano in the Shigeru Kawai range',
    ],
    artistQuote:
      'I insist on a Shigeru Kawai for my recordings, my concerts and my home. It is the only piano I want to hear my music played on.',
    artistName: 'Adrian Farrugia',
    artistRole: 'Jazz Pianist',
    seoTitle: "Shigeru Kawai SK-3 Grand Piano | Conservatory Grand | 6'2\"",
    seoDescription:
      'The Shigeru Kawai SK-3 Conservatory Grand — 6 feet 2 inches. Regarded as some of the finest pianos available. Available in Polished Ebony, Brown Sapele Mahogany, or limited-edition Pyramid Mahogany.',
  },
  {
    slug: 'sk-5',
    name: 'SK-5',
    type: 'Chamber Grand',
    tagline: 'Perfect fusion of robust tone, power, and presence.',
    feet: "6' 7\"",
    cm: '200 cm',
    width: "5' 1\"",
    widthCm: '153 cm',
    weight: '774 lbs',
    weightKg: '351 kg',
    beams: 4,
    finishes: ['Polished Ebony'],
    sellingPoints: [
      'Perfect fusion of robust tone, power and presence',
      'Third piano in the Shigeru Kawai series',
      'Perfect choice for stately homes, professional venues and intimate recital spaces',
      'Each new owner receives an MPA in-home visit within the first year',
    ],
    artistQuote:
      "Ever since I played a Shigeru Kawai piano for the first time years ago, I've dreamed of owning one — and now I do. Some dreams really do come true.",
    artistName: 'David Lanz',
    artistRole: 'Grammy-Nominated New Age Pianist',
    seoTitle: "Shigeru Kawai SK-5 Grand Piano | Chamber Grand | 6'7\"",
    seoDescription:
      'The Shigeru Kawai SK-5 Chamber Grand — 6 feet 7 inches. A perfect fusion of robust tone, power, and presence. Ideal for stately homes, professional venues, and intimate recital spaces.',
  },
  {
    slug: 'sk-6',
    name: 'SK-6',
    type: 'Orchestra Grand',
    tagline: 'Stability, consistent touch, and a rich well-rounded tone.',
    feet: "7' 0\"",
    cm: '214 cm',
    width: "5' 1\"",
    widthCm: '154 cm',
    weight: '842 lbs',
    weightKg: '382 kg',
    beams: 4,
    finishes: ['Polished Ebony'],
    sellingPoints: [
      'Sits proudly in the middle of the Shigeru Kawai range',
      'Boasts stability, consistent touch and a rich, well-rounded tone',
      'Designed with state-of-the-art digital design tools',
      'Each new piano owner receives an MPA in-home visit within the first year',
    ],
    artistQuote:
      "I've had the privilege of playing many of the world's finest pianos. However, the action of the Shigeru Kawai is far superior to anything I have experienced. It allows my fingers to connect with the very soul of an instrument whose timbre and resonance are absolutely breathtaking. Playing this instrument is pure joy!",
    artistName: 'David Hicken',
    artistRole: 'Contemporary Pianist & Composer',
    seoTitle: "Shigeru Kawai SK-6 Grand Piano | Orchestra Grand | 7'0\"",
    seoDescription:
      'The Shigeru Kawai SK-6 Orchestra Grand — 7 feet even. Stability, consistent touch, and a rich, well-rounded tone. Each new owner receives a Master Piano Artisan in-home visit.',
  },
  {
    slug: 'sk-7',
    name: 'SK-7',
    type: 'Semi-Concert Grand',
    tagline: 'Second only to the SK-EX in full-bodied tone and exceptional dynamic range.',
    feet: "7' 6\"",
    cm: '229 cm',
    width: "5' 2\"",
    widthCm: '157 cm',
    weight: '882 lbs',
    weightKg: '400 kg',
    beams: 4,
    finishes: ['Polished Ebony'],
    sellingPoints: [
      'Second only to the SK-EX in full-bodied tone and exceptional dynamic range',
      'Incredible range of expression, brilliant treble, resounding bass notes',
      'Uses the finest traditionally aged spruce for beams and soundboard',
    ],
    artistQuote:
      'My Shigeru SK-7 has given me a whole new level of expression, control, tone and clarity that I never dreamed was possible. I am undoubtedly a better composer and performer because of this world class instrument.',
    artistName: 'Joe Bongiorno',
    artistRole: 'Solo Piano Artist',
    seoTitle: "Shigeru Kawai SK-7 Grand Piano | Semi-Concert Grand | 7'6\"",
    seoDescription:
      'The Shigeru Kawai SK-7 Semi-Concert Grand — 7 feet 6 inches. Second only to the SK-EX in full-bodied tone and exceptional dynamic range. Features traditionally aged spruce beams and soundboard.',
  },
  {
    slug: 'sk-ex',
    name: 'SK-EX',
    type: 'Concert Grand',
    tagline: 'Fewer than 20 handcrafted each year. The pinnacle of the range.',
    feet: "9' 1\"",
    cm: '278 cm',
    width: "5' 2\"",
    widthCm: '158 cm',
    weight: '1111 lbs',
    weightKg: '504 kg',
    beams: 5,
    finishes: ['Polished Ebony'],
    sellingPoints: [
      'Pinnacle of the Shigeru Kawai range',
      'Fewer than 20 are handcrafted each year',
      'Flagship model of the Concert Series',
      'One of the most common choices among concert pianists at international piano competitions',
      'All six finalists at the 8th Sendai International Piano Competition chose the SK-EX',
    ],
    artistQuote:
      'The Shigeru piano always gives me inspiration to create music at a very high level. I love its honest and transparent sound.',
    artistName: 'Junko Ueno Garrett',
    artistRole: 'Concert Pianist',
    seoTitle: "Shigeru Kawai SK-EX Concert Grand Piano | 9'1\" | The Pinnacle",
    seoDescription:
      'The Shigeru Kawai SK-EX Concert Grand — 9 feet 1 inch. Fewer than 20 are handcrafted each year. Chosen by finalists at the Sendai International Piano Competition. The absolute pinnacle of the Shigeru Kawai range.',
  },
]
