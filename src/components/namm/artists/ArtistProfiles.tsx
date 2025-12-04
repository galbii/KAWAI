/**
 * ArtistProfiles Component
 *
 * Detailed artist biography section with alternating layouts
 * In-depth look at featured artists' backgrounds and achievements
 */

import Image from 'next/image'
import { Award, Music2, Calendar, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

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

// Default artist profiles (replace with CMS data)
const DEFAULT_PROFILES: ArtistProfile[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    title: 'International Concert Pianist',
    imageUrl: '/images/placeholders/artist-1.jpg',
    fullBio: 'Sarah Chen has captivated audiences worldwide with her passionate interpretations of Romantic-era masterworks. A graduate of The Juilliard School, she has performed with major orchestras across five continents and maintains a busy concert schedule while serving as a professor at the San Francisco Conservatory of Music. Her recordings of Chopin\'s complete Nocturnes received critical acclaim and established her as one of the leading interpreters of the composer\'s work.',
    achievements: [
      'Gold Medal - Van Cliburn International Piano Competition',
      'Grammy Award - Best Classical Instrumental Solo',
      'Avery Fisher Career Grant Recipient',
      '50+ orchestral performances annually'
    ],
    yearsActive: '2008 - Present',
    notableWorks: [
      'Chopin: Complete Nocturnes (2018)',
      'Rachmaninoff: Piano Concerto No. 3 with Boston Symphony',
      'Liszt: Transcendental Études (2021)'
    ],
    instruments: ['Shigeru Kawai SK-EX Concert Grand'],
    website: 'sarahchen.com'
  },
  {
    id: '2',
    name: 'Marcus Williams',
    title: 'Jazz Virtuoso & Composer',
    imageUrl: '/images/placeholders/artist-2.jpg',
    fullBio: 'Marcus Williams is at the forefront of contemporary jazz piano, seamlessly blending bebop traditions with modern electronic elements. His innovative approach to improvisation has earned him recognition from DownBeat Magazine as "Rising Star Pianist" for three consecutive years. Marcus regularly performs at premier jazz venues worldwide and has collaborated with legends like Herbie Hancock and Chick Corea. His latest album explores the intersection of acoustic piano and digital synthesis.',
    achievements: [
      'DownBeat Critics Poll - Rising Star Pianist (3x)',
      'NEA Jazz Masters Fellowship',
      'Blue Note Records Recording Artist',
      'Thelonious Monk International Jazz Competition Finalist'
    ],
    yearsActive: '2010 - Present',
    notableWorks: [
      'Digital Dreams - Jazz Fusion Album (2022)',
      'Live at the Village Vanguard (2020)',
      'Collaborations with The Marcus Williams Trio'
    ],
    instruments: ['Kawai Novus NV10S Hybrid Piano', 'Kawai MP11SE Stage Piano'],
    website: 'marcuswilliams.jazz'
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    title: 'Film Composer & Producer',
    imageUrl: '/images/placeholders/artist-3.jpg',
    fullBio: 'Elena Rodriguez creates haunting, evocative soundscapes that have become signature elements in modern film scores. Her work spans over 40 feature films, including award-winning documentaries and Hollywood blockbusters. Elena\'s compositional style combines minimalist piano textures with orchestral arrangements, creating deeply emotional moments that resonate with audiences. She divides her time between her recording studio in Los Angeles and concert performances showcasing her cinematic compositions.',
    achievements: [
      'Grammy Award - Best Score Soundtrack for Visual Media',
      'Academy Award Nomination - Best Original Score',
      'BAFTA Award - Best Original Music',
      '40+ Film Score Compositions'
    ],
    yearsActive: '2012 - Present',
    notableWorks: [
      '"Echoes of Tomorrow" - Feature Film Score (2023)',
      '"Ambient Nocturnes" - Solo Piano Album (2021)',
      '"The Last Light" - Documentary Score (2022)'
    ],
    instruments: ['Kawai CA901 Digital Piano', 'Shigeru Kawai SK-7L'],
    website: 'elenarodriguez.com'
  }
]

function ProfileCard({ profile, index }: { profile: ArtistProfile; index: number }) {
  const isEven = index % 2 === 0

  return (
    <div className={cn(
      "grid md:grid-cols-2 gap-8 lg:gap-12 items-center",
      !isEven && "md:grid-flow-dense"
    )}>
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
  profiles = DEFAULT_PROFILES,
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
