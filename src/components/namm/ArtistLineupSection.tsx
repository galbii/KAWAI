/**
 * ArtistLineupSection Component
 *
 * Showcases featured artist performances at NAMM 2026
 * Provides social proof and entertainment draw for booth visitors
 */

import Image from 'next/image'
import { cn } from '@/lib/utils'

export interface ArtistCardProps {
  name: string
  genre: string
  performanceTime?: string
  imageUrl: string
  bio: string
}

interface ArtistLineupSectionProps {
  artists?: ArtistCardProps[]
  className?: string
}

// Placeholder artist data (can be replaced with CMS data later)
const DEFAULT_ARTISTS: ArtistCardProps[] = [
  {
    name: 'Sarah Chen',
    genre: 'Classical Virtuoso',
    performanceTime: 'January 22, 2:00 PM',
    imageUrl: '/images/placeholders/artist-1.jpg',
    bio: 'Award-winning pianist known for her interpretations of Chopin and Rachmaninoff.'
  },
  {
    name: 'Marcus Williams',
    genre: 'Jazz Innovator',
    performanceTime: 'January 23, 11:00 AM',
    imageUrl: '/images/placeholders/artist-2.jpg',
    bio: 'Contemporary jazz artist blending traditional techniques with modern improvisation.'
  },
  {
    name: 'Elena Rodriguez',
    genre: 'Contemporary Composer',
    performanceTime: 'January 23, 3:30 PM',
    imageUrl: '/images/placeholders/artist-3.jpg',
    bio: 'Grammy-nominated composer specializing in cinematic and ambient piano compositions.'
  },
  {
    name: 'David Thompson',
    genre: 'Pop & Broadway',
    performanceTime: 'January 24, 1:00 PM',
    imageUrl: '/images/placeholders/artist-4.jpg',
    bio: 'Broadway musical director and performer bringing theatrical flair to the piano.'
  }
]

function ArtistCard({ artist }: { artist: ArtistCardProps }) {
  return (
    <div className={cn(
      "group flex flex-col items-center text-center",
      "transition-all duration-300 ease-out",
      "hover:scale-105"
    )}>
      {/* Artist Photo */}
      <div className={cn(
        "relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden",
        "ring-4 ring-white shadow-lg",
        "group-hover:ring-kawai-red transition-all duration-300"
      )}>
        <Image
          src={artist.imageUrl}
          alt={artist.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 128px, 160px"
        />
      </div>

      {/* Artist Info */}
      <div className="mt-4 space-y-1">
        <h3 className="font-bold text-lg md:text-xl text-gray-900">
          {artist.name}
        </h3>
        <p className="text-sm font-medium text-kawai-red">
          {artist.genre}
        </p>
        {artist.performanceTime && (
          <p className="text-xs text-gray-600 font-medium">
            {artist.performanceTime}
          </p>
        )}
      </div>

      {/* Bio */}
      <p className="mt-3 text-sm text-gray-600 leading-relaxed max-w-xs">
        {artist.bio}
      </p>
    </div>
  )
}

export default function ArtistLineupSection({
  artists = DEFAULT_ARTISTS,
  className
}: ArtistLineupSectionProps) {
  // If no artists provided, show fallback message
  if (!artists || artists.length === 0) {
    return (
      <section className={cn(
        "py-16 px-4 md:py-20 bg-[#F5F0E8]",
        className
      )}>
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Artist Performances
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Artist lineup coming soon - check back for performance schedules and exclusive artist demonstrations
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className={cn(
      "py-16 px-4 md:py-20 bg-[#F5F0E8]",
      className
    )}>
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Featured Artist Performances
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Watch Kawai artists showcase the power of our instruments
          </p>
        </div>

        {/* Artist Cards */}
        <div className={cn(
          // Mobile: Horizontal scroll
          "flex gap-8 overflow-x-auto pb-6 md:pb-0 snap-x snap-mandatory scrollbar-hide",
          // Tablet & Desktop: Grid layout
          "md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 lg:gap-10",
          // Hide scrollbar but maintain functionality
          "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        )}>
          {artists.map((artist, index) => (
            <div
              key={`${artist.name}-${index}`}
              className="flex-shrink-0 w-72 md:w-auto snap-center"
            >
              <ArtistCard artist={artist} />
            </div>
          ))}
        </div>

        {/* Mobile scroll hint */}
        <div className="md:hidden mt-6 text-center">
          <p className="text-xs text-gray-500">
            Swipe to see more artists
          </p>
        </div>
      </div>
    </section>
  )
}

export { ArtistCard }
