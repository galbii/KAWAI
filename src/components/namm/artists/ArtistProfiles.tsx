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
}

interface ArtistProfilesProps {
  profiles?: ArtistProfile[]
  className?: string
}

// Artist-specific achievements based on research
const ARTIST_ACHIEVEMENTS: Record<string, string[]> = {
  'David Snyder': [
    'Over 12 years of classical training with advanced expertise in Renaissance through Modern era repertoire',
    'Featured performer on America\'s Got Talent Season 17, advancing past initial auditions',
    '2+ million streams across piano music catalog with 120,000+ social media followers',
    'Performed with major artists including Snoop Dogg, Ice Cube, and Flo Rida',
    'Creator of popular online piano education content including "Piano Basics and Essentials" course on Domestika',
    'Professional film and commercial composer based in Los Angeles'
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
    'Youngest performer ever at Carnegie Hall (July 20, 2025, age 5)',
    'First Prize Winner - 2025 Charleston International Music Competition',
    'First Prize Winner - 2025 NY Classical Debut Awards International Competition',
    'First Prize Winner - 2025 Los Angeles Golden Classical Music Awards International Competition',
    '"Exceptional Young Talent Special Prize" recipient',
    'Performed at Walt Disney Concert Hall (July 2025), met Gustavo Dudamel, director of LA Philharmonic',
    'Possesses perfect pitch, began performing publicly at age 4',
    'Repertoire includes works by Beethoven, Bach, Gillock, and Burgmüller'
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
        instruments: ['Kawai Piano']
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

  const visibleAchievements = showAllAchievements
    ? profile.achievements
    : profile.achievements?.slice(0, 2) || []
  const hasMoreAchievements = (profile.achievements?.length || 0) > 2

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
        <p className="text-lg md:text-xl text-white/80 leading-relaxed font-light">
          {profile.fullBio}
        </p>

        {/* Achievements - Clean list without icons */}
        {profile.achievements && profile.achievements.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/40">
              Notable Achievements
            </h4>
            <ul className="space-y-3 pl-5 border-l-2 border-white/10">
              {visibleAchievements.map((achievement, idx) => (
                <li key={idx} className="text-base md:text-lg text-white/70 leading-relaxed -ml-5 pl-5">
                  {achievement}
                </li>
              ))}
            </ul>

            {/* Read More/Less Button */}
            {hasMoreAchievements && (
              <button
                onClick={() => setShowAllAchievements(!showAllAchievements)}
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-3 rounded-full",
                  "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20",
                  "text-sm font-medium text-white/80 hover:text-white",
                  "transition-all duration-300",
                  "hover:scale-105 active:scale-95"
                )}
              >
                <span>{showAllAchievements ? 'Show Less' : `Show ${profile.achievements.length - 2} More`}</span>
                <svg
                  className={cn(
                    "w-4 h-4 transition-transform duration-300",
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

        {/* Website Link - Clean button without icon */}
        {profile.website && (
          <a
            href={`https://${profile.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-block px-8 py-4 rounded-full mt-2",
              "bg-gradient-to-r from-[#E31937] to-[#FF3B55]",
              "text-base font-medium text-white",
              "transition-all duration-300",
              "hover:shadow-lg hover:shadow-[#E31937]/25 hover:scale-105",
              "active:scale-95"
            )}
          >
            Visit Website
          </a>
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
