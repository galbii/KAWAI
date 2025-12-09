/**
 * ArtistProfiles Component
 *
 * Detailed artist biography section with alternating layouts
 * In-depth look at featured artists' backgrounds and achievements
 */

import Image from 'next/image'
import { Award, Music2, Calendar, ExternalLink } from 'lucide-react'
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
        achievements: [
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

  return (
    <div
      id={`profile-${profile.id}`}
      className={cn(
        "grid md:grid-cols-2 gap-8 lg:gap-12 items-center scroll-mt-20",
        !isEven && "md:grid-flow-dense"
      )}
    >
      {/* Image */}
      <div className={cn(
        "relative aspect-[3/4] md:aspect-square rounded-2xl overflow-hidden",
        "bg-zinc-900 shadow-2xl",
        !isEven && "md:col-start-2"
      )}>
        <Image
          src={profile.imageUrl}
          alt={profile.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className={cn(
        "space-y-6",
        !isEven && "md:col-start-1 md:row-start-1"
      )}>
        {/* Header */}
        <div>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {profile.name}
          </h3>
          <p className="text-lg text-[#E31937] font-semibold">
            {profile.title}
          </p>
          {profile.yearsActive && (
            <div className="flex items-center gap-2 text-sm text-white/50 mt-2">
              <Calendar className="w-4 h-4" />
              <span>{profile.yearsActive}</span>
            </div>
          )}
        </div>

        {/* Bio */}
        <p className="text-base text-white/70 leading-relaxed">
          {profile.fullBio}
        </p>

        {/* Achievements */}
        <div>
          <div className="flex items-center gap-2 text-white/80 mb-3">
            <Award className="w-5 h-5 text-[#E31937]" />
            <h4 className="text-sm font-bold uppercase tracking-wide">Notable Achievements</h4>
          </div>
          <ul className="space-y-2">
            {profile.achievements.map((achievement, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-white/60">
                <span className="text-[#E31937] mt-1">•</span>
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instruments */}
        {profile.instruments && profile.instruments.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-white/80 mb-3">
              <Music2 className="w-5 h-5 text-[#E31937]" />
              <h4 className="text-sm font-bold uppercase tracking-wide">Preferred Instruments</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.instruments.map((instrument, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white"
                >
                  {instrument}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Website Link */}
        {profile.website && (
          <a
            href={`https://${profile.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
              "bg-white/5 border border-white/10 hover:border-[#E31937]/50",
              "text-sm font-medium text-white hover:text-[#E31937]",
              "transition-all duration-300 group"
            )}
          >
            <span>Visit Website</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
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
    <section className={cn("py-24 bg-black", className)}>
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Music2 className="w-4 h-4 text-[#E31937]" />
            <span className="text-sm font-medium text-white/80">
              In-Depth Profiles
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get to Know Our Artists
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Discover the stories, achievements, and artistry behind each performer
          </p>
        </div>

        {/* Artist Profile Cards */}
        <div className="space-y-24">
          {profiles.map((profile, index) => (
            <ProfileCard key={profile.id} profile={profile} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export { ProfileCard }
