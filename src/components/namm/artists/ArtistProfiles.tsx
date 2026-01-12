/**
 * ArtistProfiles Component
 *
 * Detailed artist biography section with clean, modern design
 * In-depth look at featured artists' backgrounds and achievements
 */

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { PERFORMANCES } from '../performances/performance-data'

export interface ArtistProfile {
  id: string
  name: string
  title: string
  imageUrl: string
  fullBio: string
  achievements: string[]
  yearsActive?: string
  notableWorks?: string[]
  instruments?: string[]
  website?: string
  socialLinks?: {
    website?: string
    instagram?: string
    youtube?: string
    spotify?: string
    facebook?: string
    tiktok?: string
  }
}

interface ArtistProfilesProps {
  profiles?: ArtistProfile[]
  className?: string
}

// Artist-specific achievements based on research
const ARTIST_ACHIEVEMENTS: Record<string, string[]> = {
  'Krista Marina': [
    'Alternative R&B/Pop artist blending jazz, blues, and Middle Eastern soul influences',
    'Collaborated with Arc North on "Meant To Be" - over 30 million Spotify streams',
    'UCLA graduate in Music Business and Communication',
    'Lead singer, keyboardist, and cajon player - performed at iconic venues including the Troubadour and Viper Room',
    'Released debut EP "Bittersweet" (2016) - wrote and co-produced',
    'Written music for networks including CBS',
    'Collaborated with creators Tim Atlas, Jorg Huttner, and Bei Ru (Diaspora Dreams, 2022)',
    'Starred in and composed original music for feature film (2024-2025)',
    'Currently recording first full-length solo album (2026)'
  ],
  'Abi Carter': [
    'Winner of American Idol Season 22 (2024)',
    'Released debut album "ghosts in the backyard" (2024) - wrote every song on the 10-track LP',
    'Near-virtuosic piano skill infused into every aspect of her music-making process',
    'Coachella Valley native raised in a musical household as second-oldest of seven kids',
    'Genre-blending artist embracing indie-pop, folk, and cinematic drama',
    'Influences include Phoebe Bridgers, Manchester Orchestra, Gracie Abrams, and Renee Rapp',
    'Known for raw earnestness and performing from the very bottom of her soul',
    'Rare crossover artist with natural talent and technical skill to back it up'
  ],
  'David Snyder': [
    'Raised in rural North Dakota, now based in Los Angeles',
    'Over 12 years of classical training creating breathtaking solo piano and instrumental tracks',
    'Featured performer on America\'s Got Talent',
    'Opened for renowned artists including Snoop Dogg, Ice Cube, Flo Rida, and RevRun',
    'Music has accumulated millions of streams',
    'Over 450k followers across TikTok, Instagram, YouTube, and Snapchat',
    'Known for charming and funny piano presence as a social media influencer'
  ],
  'Sergio De Miguel': [
    'Winner of 2024 ASCAP Foundation Herb Alpert Young Jazz Composer Award',
    'Latin Grammy Cultural Foundation "Prodigy" Award recipient (2019), youngest musician to receive this honor',
    '"Best Small Jazz Combo" at 2023 and 2022 Downbeat Magazine Awards (Sergio de Miguel Septet and Trio)',
    '2022 Yamaha Young Performing Artist',
    'Full scholarship recipient from Latin Grammy Cultural Foundation, sponsored by Gloria and Emilio Estefan',
    'Double major graduate from Berklee College of Music in Film Scoring and Jazz Piano Performance (2023)',
    'Released acclaimed debut album "Atlántida" (2023), fusing Galician traditional music with jazz, flamenco, and classical elements',
    'Currently pursuing MFA in Music Composition for the Screen at Columbia College Chicago'
  ],
  'Artur Zakiyan': [
    'Graduate of the prestigious Yerevan State Conservatory After Komitas',
    'Acclaimed composer blending Armenian ethnic music with classical contemporary and new age influences',
    'Music Producer at Solidwave Studios',
    'Touring artist with performances at major venues including Catalina Jazz Club (Los Angeles) and Tower Theatre (Fresno)',
    'Known for innovative fusion of Armenian classics with world-renowned classical masterpieces',
    'Original compositions featured in contemporary piano performance circuits'
  ],
  'Alec Van Khajadourian': [
    'One of the youngest pianists ever to perform at Carnegie Hall (July 2025, age 5) - performance called a "masterclass in talent"',
    'First Prize Winner - 2025 Charleston International Music Competition, praised for "exceptional musicianship"',
    'First Prize Winner - 2025 NY Classical Debut Awards International Competition',
    'First Prize Winner - 2025 Los Angeles Golden Classical Music Awards International Competition',
    'Performed at Walt Disney Concert Hall and several other venues across Los Angeles to crowds of over a thousand people',
    'Released debut EP "5" (September 2025) featuring classical works by J.S. Bach, F. Bürgmuller, and selections from Bach\'s Anna Magdalena Notebook',
    'Featured on World News Tonight, ABC, CBS, NBC, Fox, The Jennifer Hudson Show, UK\'s ClassicFM, The Today Show, and KTLA',
    'Performance videos viewed by millions on Instagram (@alecvanmusic)',
    'Born with perfect pitch, began exploring piano before he could walk and performing classical works by age 4'
  ]
}

// Generate profiles from actual performance data
const generateProfilesFromPerformances = (): ArtistProfile[] => {
  const artistMap = new Map<string, ArtistProfile>()

  PERFORMANCES.forEach((perf) => {
    if (!artistMap.has(perf.artistName)) {
      const profile: ArtistProfile = {
        id: perf.id,
        name: perf.artistName,
        title: perf.performanceType,
        imageUrl: perf.artistImage || '/images/placeholders/artist-default.jpg',
        fullBio: perf.artistBio || `${perf.artistName} is a talented ${perf.genre?.toLowerCase() || 'piano'} artist performing at NAMM 2026. Experience their exceptional performance showcasing the expressive capabilities of Kawai instruments.`,
        achievements: ARTIST_ACHIEVEMENTS[perf.artistName] || [
          `Performing ${perf.genre || 'Piano'} at NAMM 2026`,
          'Kawai Artist',
          'Professional Pianist'
        ],
        instruments: ['Kawai Piano'],
        ...(perf.socialLinks && { socialLinks: perf.socialLinks })
      }

      const websiteUrl = perf.socialLinks?.website?.replace('https://', '')
      if (websiteUrl !== undefined) {
        profile.website = websiteUrl
      }

      artistMap.set(perf.artistName, profile)
    }
  })

  return Array.from(artistMap.values())
}

const PROFILES_FROM_PERFORMANCES = generateProfilesFromPerformances()

function ProfileCard({ profile, index }: { profile: ArtistProfile; index: number }) {
  const isEven = index % 2 === 0
  const [showAllAchievements, setShowAllAchievements] = useState(false)
  const [showFullBio, setShowFullBio] = useState(false)

  const visibleAchievements = showAllAchievements
    ? profile.achievements
    : profile.achievements?.slice(0, 2) || []
  const hasMoreAchievements = (profile.achievements?.length || 0) > 2

  // Split bio into sentences and show first 2-3 sentences when collapsed
  const bioSentences = profile.fullBio.match(/[^.!?]+[.!?]+/g) || [profile.fullBio]
  const shortBio = bioSentences.slice(0, 2).join(' ')
  const shouldShowReadMore = bioSentences.length > 2
  const displayBio = showFullBio ? profile.fullBio : shortBio

  return (
    <div
      id={`profile-${profile.id}`}
      className={cn(
        "group relative grid md:grid-cols-2 gap-10 lg:gap-16 items-start scroll-mt-20",
        !isEven && "md:grid-flow-dense"
      )}
    >
      {/* Image */}
      <div className={cn(
        "relative aspect-[4/5] rounded-3xl overflow-hidden",
        "bg-gradient-to-br from-zinc-900 to-black shadow-2xl",
        "transition-transform duration-500 group-hover:scale-[1.02]",
        !isEven && "md:col-start-2"
      )}>
        <Image
          src={profile.imageUrl}
          alt={profile.name}
          fill
          className={cn(
            "object-cover transition-all duration-700 group-hover:scale-105",
            profile.name === 'Alec Van Khajadourian' ? 'object-[center_60%]' : ''
          )}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className={cn(
        "space-y-8 pt-4",
        !isEven && "md:col-start-1 md:row-start-1"
      )}>
        {/* Header */}
        <div className="space-y-3">
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white leading-tight">
            {profile.name}
          </h3>
          <div className="h-1 w-16 bg-gradient-to-r from-[#E31937] to-[#FF3B55] rounded-full" />
          <p className="text-xl md:text-2xl text-white/60 font-light">
            {profile.title}
          </p>
        </div>

        {/* Bio */}
        <div className="space-y-4">
          <div className="overflow-hidden">
            <p
              className={cn(
                "text-lg md:text-xl text-white/80 leading-relaxed font-light",
                "transition-all duration-500 ease-in-out"
              )}
              style={{
                maxHeight: showFullBio ? '1000px' : '200px',
                opacity: 1
              }}
            >
              {displayBio}
            </p>

            {/* Gradient overlay when collapsed */}
            {!showFullBio && shouldShowReadMore && (
              <div className="h-12 -mt-12 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none transition-opacity duration-300" />
            )}
          </div>

          {/* Read More/Less Button for Bio */}
          {shouldShowReadMore && (
            <button
              onClick={() => setShowFullBio(!showFullBio)}
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3 rounded-full",
                "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20",
                "text-sm font-medium text-white/80 hover:text-white",
                "transition-all duration-300",
                "hover:scale-105 active:scale-95",
                "group"
              )}
            >
              <span className="transition-all duration-200">{showFullBio ? 'Read Less' : 'Read More'}</span>
              <svg
                className={cn(
                  "w-4 h-4 transition-transform duration-500 ease-out",
                  showFullBio && "rotate-180"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Achievements - Clean list without icons */}
        {profile.achievements && profile.achievements.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/40">
              Notable Achievements
            </h4>
            <div className="overflow-hidden">
              <ul className="space-y-3 pl-5 border-l-2 border-white/10 transition-all duration-500 ease-in-out">
                {visibleAchievements.map((achievement, idx) => (
                  <li
                    key={idx}
                    className={cn(
                      "text-base md:text-lg text-white/70 leading-relaxed -ml-5 pl-5",
                      "transition-all duration-300 ease-out",
                      idx >= 2 && showAllAchievements && "animate-in fade-in slide-in-from-left-2"
                    )}
                    style={{
                      animationDelay: idx >= 2 && showAllAchievements ? `${(idx - 2) * 50}ms` : '0ms',
                      animationFillMode: 'backwards'
                    }}
                  >
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>

            {/* Read More/Less Button */}
            {hasMoreAchievements && (
              <button
                onClick={() => setShowAllAchievements(!showAllAchievements)}
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-3 rounded-full",
                  "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20",
                  "text-sm font-medium text-white/80 hover:text-white",
                  "transition-all duration-300",
                  "hover:scale-105 active:scale-95",
                  "group"
                )}
              >
                <span className="transition-all duration-200">{showAllAchievements ? 'Show Less' : `Show ${profile.achievements.length - 2} More`}</span>
                <svg
                  className={cn(
                    "w-4 h-4 transition-transform duration-500 ease-out",
                    showAllAchievements && "rotate-180"
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Social Links */}
        {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
          <div className="space-y-4 pt-4 border-t border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/40">
              Connect
            </h4>
            <div className="flex flex-wrap gap-3">
              {profile.socialLinks.website && (
                <a
                  href={profile.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2 px-5 py-3 rounded-full",
                    "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20",
                    "text-sm font-medium text-white/80 hover:text-white",
                    "transition-all duration-300",
                    "hover:scale-105 active:scale-95"
                  )}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span>Website</span>
                </a>
              )}
              {profile.socialLinks.instagram && (
                <a
                  href={profile.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2 px-5 py-3 rounded-full",
                    "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20",
                    "text-sm font-medium text-white/80 hover:text-white",
                    "transition-all duration-300",
                    "hover:scale-105 active:scale-95"
                  )}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Instagram</span>
                </a>
              )}
              {profile.socialLinks.youtube && (
                <a
                  href={profile.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2 px-5 py-3 rounded-full",
                    "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20",
                    "text-sm font-medium text-white/80 hover:text-white",
                    "transition-all duration-300",
                    "hover:scale-105 active:scale-95"
                  )}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span>YouTube</span>
                </a>
              )}
              {profile.socialLinks.tiktok && (
                <a
                  href={profile.socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2 px-5 py-3 rounded-full",
                    "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20",
                    "text-sm font-medium text-white/80 hover:text-white",
                    "transition-all duration-300",
                    "hover:scale-105 active:scale-95"
                  )}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                  <span>TikTok</span>
                </a>
              )}
              {profile.socialLinks.spotify && (
                <a
                  href={profile.socialLinks.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2 px-5 py-3 rounded-full",
                    "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20",
                    "text-sm font-medium text-white/80 hover:text-white",
                    "transition-all duration-300",
                    "hover:scale-105 active:scale-95"
                  )}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  <span>Spotify</span>
                </a>
              )}
              {profile.socialLinks.facebook && (
                <a
                  href={profile.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2 px-5 py-3 rounded-full",
                    "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20",
                    "text-sm font-medium text-white/80 hover:text-white",
                    "transition-all duration-300",
                    "hover:scale-105 active:scale-95"
                  )}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ArtistProfiles({
  profiles = PROFILES_FROM_PERFORMANCES,
  className
}: ArtistProfilesProps) {
  if (!profiles || profiles.length === 0) {
    return null
  }

  return (
    <section className={cn("py-32 lg:py-40 bg-gradient-to-b from-black via-zinc-950 to-black", className)}>
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-24 lg:mb-32">
          <div className="inline-block px-6 py-2.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <span className="text-sm font-light uppercase tracking-widest text-white/70">
              In-Depth Profiles
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-white mb-6 leading-tight">
            Get to Know Our Artists
          </h2>

          <div className="flex justify-center mb-8">
            <div className="h-1 w-24 bg-gradient-to-r from-[#E31937] to-[#FF3B55] rounded-full" />
          </div>

          <p className="text-xl md:text-2xl font-light leading-relaxed text-white/60 max-w-3xl mx-auto">
            Discover the stories, achievements, and artistry behind each performer bringing exceptional music to NAMM 2026
          </p>
        </div>

        {/* Artist Profile Cards */}
        <div className="space-y-32 lg:space-y-40">
          {profiles.map((profile, index) => (
            <ProfileCard key={profile.id} profile={profile} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export { ProfileCard }
