/**
 * FeaturedArtistsGrid Component
 *
 * Displays featured artists in a responsive grid layout
 * Black background with white text and kawai-red accents
 */

import Image from 'next/image'
import { Instagram, Twitter, Globe, Music } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FeaturedArtist {
  id: string
  name: string
  title: string
  genre: string
  imageUrl: string
  bio: string
  socialMedia?: {
    instagram?: string
    twitter?: string
    website?: string
  }
  featuredInstrument?: string
}

interface FeaturedArtistsGridProps {
  artists?: FeaturedArtist[]
  className?: string
}

// Default placeholder artists (replace with CMS data)
const DEFAULT_ARTISTS: FeaturedArtist[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    title: 'International Concert Pianist',
    genre: 'Classical',
    imageUrl: '/images/placeholders/artist-1.jpg',
    bio: 'Award-winning classical pianist known for her interpretations of Chopin and Rachmaninoff.',
    featuredInstrument: 'Shigeru Kawai SK-EX',
    socialMedia: {
      instagram: 'sarahchenmusic',
      website: 'sarahchen.com'
    }
  },
  {
    id: '2',
    name: 'Marcus Williams',
    title: 'Jazz Virtuoso & Composer',
    genre: 'Jazz',
    imageUrl: '/images/placeholders/artist-2.jpg',
    bio: 'Contemporary jazz artist blending traditional techniques with modern improvisation.',
    featuredInstrument: 'Kawai Novus NV10S',
    socialMedia: {
      twitter: 'marcusjazz',
      website: 'marcuswilliams.jazz'
    }
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    title: 'Film Composer & Producer',
    genre: 'Contemporary',
    imageUrl: '/images/placeholders/artist-3.jpg',
    bio: 'Grammy-nominated composer specializing in cinematic and ambient piano compositions.',
    featuredInstrument: 'Kawai CA901',
    socialMedia: {
      instagram: 'elenarodriguezmusic',
      website: 'elenarodriguez.com'
    }
  },
  {
    id: '4',
    name: 'David Thompson',
    title: 'Broadway Musical Director',
    genre: 'Broadway & Pop',
    imageUrl: '/images/placeholders/artist-4.jpg',
    bio: 'Renowned musical director bringing theatrical flair to piano performance.',
    featuredInstrument: 'Kawai MP11SE',
    socialMedia: {
      instagram: 'davidthompsonmusic',
      twitter: 'davidonbroadway'
    }
  },
  {
    id: '5',
    name: 'Yuki Tanaka',
    title: 'Contemporary Classical Pianist',
    genre: 'Modern Classical',
    imageUrl: '/images/placeholders/artist-5.jpg',
    bio: 'Innovative performer bridging classical tradition with contemporary expression.',
    featuredInstrument: 'Shigeru Kawai SK-7L',
    socialMedia: {
      website: 'yukitanaka.jp'
    }
  },
  {
    id: '6',
    name: 'Andre Dubois',
    title: 'R&B & Soul Producer',
    genre: 'R&B / Soul',
    imageUrl: '/images/placeholders/artist-6.jpg',
    bio: 'Multi-platinum producer and performer known for soulful piano-driven tracks.',
    featuredInstrument: 'Kawai NV5S',
    socialMedia: {
      instagram: 'andreduboismusic',
      twitter: 'andredubois'
    }
  }
]

function ArtistCard({ artist }: { artist: FeaturedArtist }) {
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl bg-zinc-900",
      "border border-white/5 hover:border-[#E31937]/50",
      "transition-all duration-500 ease-out",
      "hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#E31937]/10"
    )}>
      {/* Artist Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-800">
        <Image
          src={artist.imageUrl}
          alt={artist.name}
          fill
          className={cn(
            "object-cover transition-all duration-500",
            "group-hover:scale-110 group-hover:brightness-110"
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Gradient Overlay */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent",
          "opacity-60 group-hover:opacity-80 transition-opacity duration-500"
        )} />

        {/* Genre Badge */}
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
          <span className="text-xs font-semibold text-white uppercase tracking-wide">
            {artist.genre}
          </span>
        </div>

        {/* Social Media Icons */}
        {artist.socialMedia && (
          <div className={cn(
            "absolute top-4 right-4 flex flex-col gap-2",
            "opacity-0 group-hover:opacity-100 transition-all duration-300",
            "translate-x-2 group-hover:translate-x-0"
          )}>
            {artist.socialMedia.instagram && (
              <a
                href={`https://instagram.com/${artist.socialMedia.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-[#E31937] hover:border-[#E31937] transition-colors"
              >
                <Instagram className="w-4 h-4 text-white" />
              </a>
            )}
            {artist.socialMedia.twitter && (
              <a
                href={`https://twitter.com/${artist.socialMedia.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-[#E31937] hover:border-[#E31937] transition-colors"
              >
                <Twitter className="w-4 h-4 text-white" />
              </a>
            )}
            {artist.socialMedia.website && (
              <a
                href={`https://${artist.socialMedia.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-[#E31937] hover:border-[#E31937] transition-colors"
              >
                <Globe className="w-4 h-4 text-white" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Artist Info */}
      <div className="relative p-6">
        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#E31937] transition-colors">
          {artist.name}
        </h3>
        <p className="text-sm text-white/60 mb-3 font-medium">
          {artist.title}
        </p>
        <p className="text-sm text-white/70 leading-relaxed line-clamp-2">
          {artist.bio}
        </p>

        {/* Featured Instrument */}
        {artist.featuredInstrument && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Music className="w-3.5 h-3.5 text-[#E31937]" />
              <span className="uppercase tracking-wide">Performing on:</span>
            </div>
            <p className="text-sm text-white font-medium mt-1">
              {artist.featuredInstrument}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function FeaturedArtistsGrid({
  artists = DEFAULT_ARTISTS,
  className
}: FeaturedArtistsGridProps) {
  if (!artists || artists.length === 0) {
    return (
      <section className={cn("py-24 bg-black", className)}>
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Featured Artists
          </h2>
          <p className="text-lg text-white/60">
            Artist lineup coming soon - check back for updates
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className={cn("py-24 bg-black", className)}>
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Music className="w-4 h-4 text-[#E31937]" />
            <span className="text-sm font-medium text-white/80">
              {artists.length} Featured Artists
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Meet Our Artists
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            World-renowned pianists showcasing the artistry and precision of Kawai instruments
          </p>
        </div>

        {/* Artists Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </div>
    </section>
  )
}

export { ArtistCard }
