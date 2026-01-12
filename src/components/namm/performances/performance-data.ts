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
  {
    id: 'thu-2',
    day: 'thursday',
    date: 'Thursday, January 22, 2026',
    time: '3:30 PM',
    artistName: 'Abi Carter',
    performanceType: 'Solo',
    description: 'American Idol Season 22 winner performing genre-blending indie-pop and folk with virtuosic piano artistry',
    startDateTime: '2026-01-22T15:30:00-08:00',
    endDateTime: '2026-01-22T16:15:00-08:00',
    genre: 'Indie-Pop/Folk',
    artistImage: 'https://pub-486ee03121a24ede8b51409434e22709.r2.dev/artists/%40mackenzieryanphoto-09201%5B34%5D.jpg.png',
    artistBio: 'After winning American Idol Season 22, Coachella Valley native Abi Carter officially introduced herself as a confident, layered artist with her 2024 album "ghosts in the backyard." The second-oldest in a family of seven kids, Abi was raised in a musical household and learned piano, which changed the trajectory of her life. Her near-virtuosic skill on the instrument remains infused into every aspect of her music-making process. Abi embraces influences like Phoebe Bridgers, Manchester Orchestra, and Gracie Abrams, playing with indie-pop, folk, and cinematic drama throughout her discography.',
    artistSlug: 'abi-carter',
    socialLinks: {
      instagram: 'https://www.instagram.com/abicartermusic',
      youtube: 'https://www.youtube.com/@Abicartermusic',
      spotify: 'https://open.spotify.com/artist/6ryJRp2gIl77hK36D8tz2m'
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
    artistImage: 'https://pub-486ee03121a24ede8b51409434e22709.r2.dev/artists/artur/Artur%20Zakiyan%20Kawai-1%202.jpg',
    artistBio: 'Artur Zakiyan is a modern composer and pianist. Influenced by his cultural roots, his music deeply reflects the spirit of Armenian heritage. With a unique style that blends elements of cinematic and classical music, Artur creates captivating soundscapes. Through his music, he paints a mesmerizing journey that resonates with listeners, inviting them to explore the beauty of his cultural identity. His compositions are marked by emotional depth and atmospheric textures, drawing listeners into a meditative and evocative experience.',
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
    artistImage: 'https://pub-486ee03121a24ede8b51409434e22709.r2.dev/artists/sergio/sergiohero.jpg',
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
    time: '1:00 PM',
    artistName: 'Krista Marina',
    performanceType: 'Solo',
    description: 'Alternative R&B/Pop performance blending jazz, blues, and Middle Eastern soul on the expressive Kawai piano',
    startDateTime: '2026-01-24T13:00:00-08:00',
    endDateTime: '2026-01-24T13:45:00-08:00',
    genre: 'Alternative R&B/Pop',
    artistImage: 'https://pub-486ee03121a24ede8b51409434e22709.r2.dev/artists/_MG_0968.JPG',
    artistBio: 'Krista Marina is an alternative R&B/Pop singer, songwriter and producer whose music displays jazz, blues, and hints of the Middle Eastern soul she grew up with, crafting a sound that is familiar yet fresh. Raised in an Armenian household, Krista developed an ear for dynamic vocals and appealing melodies. Her interest in songwriting sparked from the various music genres she explored growing up, with artists like Amy Winehouse, Alicia Keys, and H.E.R. among her inspirations, though she maintains an original style evident in her music.',
    artistSlug: 'krista-marina',
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/7gh5SnyMRtWO5mzAThI4AB',
      youtube: 'https://www.youtube.com/channel/UC0BEb1bKsrOyuL_MKcAIZsw',
      instagram: 'https://instagram.com/kristamarina_'
    }
  },
  {
    id: 'sat-3',
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
