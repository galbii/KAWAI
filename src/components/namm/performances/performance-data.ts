/**
 * NAMM 2026 Performance Schedule Data
 *
 * Official performance lineup for the Kawai booth at NAMM Show 2026
 * January 22-24, 2026 | Anaheim Convention Center
 */

export interface Performance {
  id: string
  day: 'thursday' | 'friday' | 'saturday'
  date: string // Full date for display
  time: string // Time in 12-hour format
  artistName: string
  performanceType: string
  description?: string
  startDateTime: string // ISO 8601 format for Schema.org
  endDateTime: string // ISO 8601 format for Schema.org
  genre?: string

  // Artist-focused fields for premium card design
  artistImage?: string // Artist portrait/headshot (3:4 aspect ratio)
  artistBio?: string // 2-3 sentence artist description
  artistSlug?: string // URL slug for artist detail page
  socialLinks?: {
    website?: string
    instagram?: string
    youtube?: string
    spotify?: string
    facebook?: string
    tiktok?: string
  }
}

export interface DaySchedule {
  id: 'thursday' | 'friday' | 'saturday'
  dayName: string
  date: string
  dateShort: string // For mobile tabs
  dayNumber: number
  performances: Performance[]
}

/**
 * All NAMM 2026 Kawai booth performances
 */
export const PERFORMANCES: Performance[] = [
  // THURSDAY, JANUARY 22
  {
    id: 'thu-1',
    day: 'thursday',
    date: 'Thursday, January 22, 2026',
    time: '11:00 AM',
    artistName: 'David Snyder',
    performanceType: 'Solo Piano',
    description: 'Virtuosic classical repertoire showcasing the expressive power of the Shigeru Kawai SK-EX Concert Grand',
    startDateTime: '2026-01-22T11:00:00-08:00',
    endDateTime: '2026-01-22T11:45:00-08:00',
    genre: 'Classical',
    artistImage: '/images/namm/david-snyder.jpg',
    artistBio: 'David Snyder is a pianist and composer raised in rural North Dakota and now based in the vibrant city of Los Angeles. With over twelve years of classical training, he has delicately translated his expertise into creating breathtaking solo piano and instrumental tracks. David\'s musical journey has seen him grace esteemed stages, including an appearance on America\'s Got Talent and opening for renowned artists like Snoop Dogg, Ice Cube, Flo Rida, and RevRun. His music has resonated with millions, accumulating millions of streams. David also showcases his charming and funny piano presence on TikTok, Instagram, Youtube, and Snapchat, captivating over 450k followers as an influencer across those platforms.',
    artistSlug: 'david-snyder',
    socialLinks: {
      website: 'https://www.thepianosaysitbetter.com/',
      instagram: 'https://www.instagram.com/david_msnyder',
      youtube: 'https://www.youtube.com/channel/UCgu8vTd8CLpeQnWKBdLN_aw',
      tiktok: 'https://www.tiktok.com/@david_msnyder'
    }
  },

  // FRIDAY, JANUARY 23
  {
    id: 'fri-1',
    day: 'friday',
    date: 'Friday, January 23, 2026',
    time: '11:00 AM',
    artistName: 'Sergio De Miguel',
    performanceType: 'Solo',
    description: 'Innovative solo piano performance exploring contemporary techniques and classical traditions',
    startDateTime: '2026-01-23T11:00:00-08:00',
    endDateTime: '2026-01-23T11:45:00-08:00',
    genre: 'Modern Classical',
    artistImage: 'https://pub-486ee03121a24ede8b51409434e22709.r2.dev/artists/sergio/DSC06342-2.jpg',
    artistBio: 'Sergio de Miguel is a Spanish pianist and composer from Vigo, Galicia, now based in Los Angeles. His music blends his Galician and Spanish roots with jazz, flamenco, classical and contemporary music elements, and world music. Guided by the belief that melodies can tell stories words cannot, he creates music full of emotional depth, color, and cultural richness, inviting listeners into a unique, multicultural soundscape.',
    artistSlug: 'sergio-de-miguel',
    socialLinks: {
      website: 'https://sergiodemiguelmusic.com/'
    }
  },
  {
    id: 'fri-2',
    day: 'friday',
    date: 'Friday, January 23, 2026',
    time: '3:30 PM',
    artistName: 'Artur Zakiyan',
    performanceType: 'Piano Solo',
    description: 'Masterful interpretation of romantic and contemporary piano works on the world-renowned Kawai instruments',
    startDateTime: '2026-01-23T15:30:00-08:00',
    endDateTime: '2026-01-23T16:15:00-08:00',
    genre: 'Romantic',
    artistImage: '/images/artists/namm-2026/artur-zakiyan.jpg',
    artistBio: 'Armenian pianist and composer Artur Zakiyan creates a mesmerizing sonic landscape where centuries-old Armenian traditions meet contemporary classical expression. A graduate of the prestigious Yerevan State Conservatory After Komitas, Artur has dedicated his artistry to reimagining the rich heritage of Armenian music through a modern lens. As Music Producer at Solidwave Studios and an active touring artist performing at venues from Los Angeles\' Catalina Jazz Club to Fresno\'s Tower Theatre, he brings passionate intensity and cultural depth to every performance. His innovative fusion of Armenian ethnic melodies with classical contemporary and new age influences offers audiences a unique and emotionally powerful musical journey.',
    artistSlug: 'artur-zakiyan',
    socialLinks: {
      website: 'https://www.arturzakiyan.com/',
      instagram: 'https://www.instagram.com/arturzakiyan',
      youtube: 'https://www.youtube.com/@artur_zakiyan',
      tiktok: 'https://www.tiktok.com/@artur_zakiyan'
    }
  },

  // SATURDAY, JANUARY 24
  {
    id: 'sat-1',
    day: 'saturday',
    date: 'Saturday, January 24, 2026',
    time: '11:00 AM',
    artistName: 'Sergio De Miguel',
    performanceType: 'Trio',
    description: 'Dynamic trio performance featuring piano, bass, and percussion in a collaborative jazz exploration',
    startDateTime: '2026-01-24T11:00:00-08:00',
    endDateTime: '2026-01-24T11:45:00-08:00',
    genre: 'Jazz',
    artistImage: 'https://pub-486ee03121a24ede8b51409434e22709.r2.dev/artists/sergio/DSC06342-2.jpg',
    artistBio: 'Sergio de Miguel is a Spanish pianist and composer from Vigo, Galicia, now based in Los Angeles. His music blends his Galician and Spanish roots with jazz, flamenco, classical and contemporary music elements, and world music. Guided by the belief that melodies can tell stories words cannot, he creates music full of emotional depth, color, and cultural richness, inviting listeners into a unique, multicultural soundscape.',
    artistSlug: 'sergio-de-miguel',
    socialLinks: {
      website: 'https://sergiodemiguelmusic.com/'
    }
  },
  {
    id: 'sat-2',
    day: 'saturday',
    date: 'Saturday, January 24, 2026',
    time: '3:30 PM',
    artistName: 'Alec Van Khajadourian',
    performanceType: 'Piano Solo',
    description: 'Closing performance featuring powerful solo piano works that demonstrate the versatility of Kawai pianos',
    startDateTime: '2026-01-24T15:30:00-08:00',
    endDateTime: '2026-01-24T16:15:00-08:00',
    genre: 'Contemporary',
    artistImage: 'https://pub-486ee03121a24ede8b51409434e22709.r2.dev/artists/alec/IMG_4838.JPG',
    artistBio: 'Six-year-old piano prodigy Alec Van Khajadourian has captured international attention with his extraordinary musical gift. Born with perfect pitch, Alec began exploring the piano before he could even walk and was performing classical works by Bach and Beethoven by age four. In 2025, he earned first-place in multiple international music competitions praised for his "exceptional musicianship" and made history in July as one of the youngest pianists to ever perform at Carnegie Hall. That same year, Alec Van made his debut at Walt Disney Concert Hall as well as several other venues across Los Angeles to crowds of over a thousand people. To commemorate his memorable year as a five-year-old, he recorded his favorite pieces and released his debut EP titled "5" in September 2025, featuring works including Prelude in C Minor BWV 999 by J.S. Bach, Arabesque by F. Bürgmuller, and Polonaise in G Minor from Bach\'s Anna Magdalena Notebook. The music community has embraced his talent, with media outlets including World News Tonight, ABC, CBS, NBC, Fox, The Jennifer Hudson Show, UK\'s ClassicFM, The Today Show, and KTLA all praising his accomplishments, with his Carnegie Hall performance being called a "masterclass in talent." His story continues to capture hearts worldwide, as performance videos have been viewed by millions on Instagram (@alecvanmusic).',
    artistSlug: 'alec-van-khajadourian',
    socialLinks: {
      instagram: 'https://www.instagram.com/alecvanmusic/'
    }
  }
]

/**
 * Group performances by day for easier rendering
 */
export const DAYS_SCHEDULE: DaySchedule[] = [
  {
    id: 'thursday',
    dayName: 'Thursday',
    date: 'January 22, 2026',
    dateShort: 'THU 22',
    dayNumber: 22,
    performances: PERFORMANCES.filter(p => p.day === 'thursday')
  },
  {
    id: 'friday',
    dayName: 'Friday',
    date: 'January 23, 2026',
    dateShort: 'FRI 23',
    dayNumber: 23,
    performances: PERFORMANCES.filter(p => p.day === 'friday')
  },
  {
    id: 'saturday',
    dayName: 'Saturday',
    date: 'January 24, 2026',
    dateShort: 'SAT 24',
    dayNumber: 24,
    performances: PERFORMANCES.filter(p => p.day === 'saturday')
  }
]

/**
 * SEO-optimized keywords related to performances
 */
export const PERFORMANCE_KEYWORDS = [
  'namm 2026 performances',
  'namm 2026 artist schedule',
  'namm 2026 events schedule',
  'live artist performances',
  'piano demonstrations namm 2026',
  'kawai artists namm',
  'namm 2026 live music',
  'piano performance schedule'
] as const
