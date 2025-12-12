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
    artistBio: 'Los Angeles-based pianist and composer David Snyder bridges classical tradition with contemporary innovation. With over 12 years of rigorous classical training spanning Renaissance through Modern era repertoire, David has evolved into a multifaceted artist whose work encompasses performance, film scoring, and digital education. Featured on America\'s Got Talent Season 17 and boasting 2+ million streams across his catalog, David brings virtuosic technique and modern sensibility to the concert stage. His collaborations with artists like Snoop Dogg and Ice Cube showcase his versatility, while his popular online piano courses inspire the next generation of musicians.',
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
    artistImage: '/images/artists/namm-2026/sergio-de-miguel.jpg',
    artistBio: 'At just 21 years old, Galician pianist and composer Sergio De Miguel has already claimed some of music\'s highest honors. Winner of the 2024 ASCAP Foundation Herb Alpert Young Jazz Composer Award and recipient of the Latin Grammy Cultural Foundation\'s prestigious "Prodigy" Award (as its youngest honoree), Sergio represents a new generation of boundary-pushing artists. A Berklee College of Music graduate with dual majors in Film Scoring and Jazz Piano Performance, he\'s currently pursuing his MFA in Music Composition at Columbia College Chicago. His acclaimed debut album "Atlántida" masterfully weaves together his Galician heritage with jazz, flamenco, and classical influences, creating a sound that is both deeply rooted and refreshingly innovative.',
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
    artistImage: '/images/artists/namm-2026/sergio-de-miguel.jpg',
    artistBio: 'At just 21 years old, Galician pianist and composer Sergio De Miguel has already claimed some of music\'s highest honors. Winner of the 2024 ASCAP Foundation Herb Alpert Young Jazz Composer Award and recipient of the Latin Grammy Cultural Foundation\'s prestigious "Prodigy" Award (as its youngest honoree), Sergio represents a new generation of boundary-pushing artists. A Berklee College of Music graduate with dual majors in Film Scoring and Jazz Piano Performance, he\'s currently pursuing his MFA in Music Composition at Columbia College Chicago. His acclaimed debut album "Atlántida" masterfully weaves together his Galician heritage with jazz, flamenco, and classical influences, creating a sound that is both deeply rooted and refreshingly innovative.',
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
    artistBio: 'Five-year-old piano prodigy Alec Van Khajadourian has already made history as the youngest performer ever to grace the stage at Carnegie Hall. In 2025 alone, this Los Angeles-based virtuoso swept three first-place prizes at major international competitions: the Charleston International Music Competition, NY Classical Debut Awards, and LA Golden Classical Music Awards. Born with perfect pitch and an innate musical gift, Alec began matching melodies to piano keys at just two years old. By age four, he was performing publicly, captivating audiences with interpretations of Beethoven, Bach, and contemporary composers that belie his young age. His July 2025 performance at Walt Disney Concert Hall, where he met LA Philharmonic director Gustavo Dudamel, marked another milestone in what promises to be an extraordinary musical journey.',
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
