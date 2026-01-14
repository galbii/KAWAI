import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import type { Artist, Media } from '@/payload-types'
import { cn } from '@/lib/utils'
import ArtistsHeroWrapper from '@/components/artists/ArtistsHeroWrapper'

export const metadata: Metadata = {
  title: 'KAWAI Artists | World-Class Musicians & Performers',
  description: 'Discover the talented artists and musicians who trust KAWAI pianos for their performances and recordings. From concert halls to recording studios, explore our roster of acclaimed pianists.',
}

// Enable ISR with 15-minute revalidation
export const revalidate = 900

async function getArtists() {
  try {
    const payload = await getPayloadHMR({ config: configPromise })

    const artists = await payload.find({
      collection: 'artists',
      where: {
        isActive: {
          equals: true
        }
      },
      limit: 100,
      sort: '-featured,-updatedAt'
    })

    return artists.docs as Artist[]
  } catch (error) {
    console.error('Error fetching artists:', error)
    return []
  }
}

function ArtistCard({ artist }: { artist: Artist }) {
  // Get image source directly without preset dimensions since we're using fill
  const imageUrl = (() => {
    if (artist.image && typeof artist.image === 'object') {
      return (artist.image as Media).url || artist.imageUrl || '/images/defaults/artist-placeholder.jpg'
    }
    return artist.imageUrl || '/images/defaults/artist-placeholder.jpg'
  })()

  const genreLabel = artist.genre ? artist.genre.charAt(0).toUpperCase() + artist.genre.slice(1) : null

  return (
    <Link
      href={`/artists/${artist.slug}`}
      className={cn(
        "group relative overflow-hidden rounded-xl bg-white shadow-sm",
        "hover:shadow-xl transition-all duration-300",
        "border border-gray-100 hover:border-kawai-red/20",
        artist.featured && "md:col-span-2 md:row-span-2"
      )}
    >
      {/* Image Container */}
      <div className={cn(
        "relative overflow-hidden bg-gray-100",
        artist.featured ? "aspect-[4/3]" : "aspect-square"
      )}>
        <Image
          src={imageUrl}
          alt={artist.name}
          fill
          className="object-cover transform group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Featured Badge */}
        {artist.featured && (
          <div className="absolute top-2 right-2 bg-kawai-red text-white px-2 py-1 rounded-md text-xs font-semibold shadow-lg">
            Featured
          </div>
        )}

        {/* Genre Tag */}
        {genreLabel && (
          <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm text-kawai-charcoal px-2 py-1 rounded-md text-xs font-medium shadow-sm">
            {genreLabel}
          </div>
        )}

        {/* Artist Name Overlay on Hover (for compact view) */}
        {!artist.featured && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="font-bold text-white text-sm mb-1">
              {artist.name}
            </h3>
            {artist.shortBio && (
              <p className="text-white/90 text-xs line-clamp-2">
                {artist.shortBio}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Content - Only show for featured artists */}
      {artist.featured && (
        <div className="p-4 md:p-6">
          <h3 className="text-xl md:text-2xl font-bold text-kawai-charcoal mb-2 group-hover:text-kawai-red transition-colors">
            {artist.name}
          </h3>

          {artist.shortBio && (
            <p className="text-gray-600 text-sm md:text-base line-clamp-3 mb-3">
              {artist.shortBio}
            </p>
          )}

          {/* Social Links Preview */}
          {artist.socialLinks && artist.socialLinks.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mb-3">
              {artist.socialLinks.slice(0, 4).map((link, idx) => (
                <span
                  key={idx}
                  className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded"
                >
                  {link.platform}
                </span>
              ))}
              {artist.socialLinks.length > 4 && (
                <span className="text-xs text-gray-500">
                  +{artist.socialLinks.length - 4}
                </span>
              )}
            </div>
          )}

          {/* View Profile CTA */}
          <div className="pt-3 border-t border-gray-100">
            <span className="text-kawai-red font-medium text-sm group-hover:underline inline-flex items-center gap-1">
              View Profile
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      )}

      {/* Minimal content for non-featured (just the name at bottom) */}
      {!artist.featured && (
        <div className="p-3 bg-white">
          <h3 className="font-semibold text-kawai-charcoal text-sm group-hover:text-kawai-red transition-colors line-clamp-1">
            {artist.name}
          </h3>
        </div>
      )}
    </Link>
  )
}

export default async function ArtistsPage() {
  const artists = await getArtists()

  // Get featured artists for hero carousel
  const featuredArtists = artists.filter(artist => artist.featured).slice(0, 5)
  const hasHeroArtists = featuredArtists.length > 0

  // Filter out featured artists from the grid (they're already in the hero)
  const gridArtists = hasHeroArtists
    ? artists.filter(artist => !artist.featured)
    : artists

  // Debug logging
  console.log(`[Artists Page] Total artists: ${artists.length}, Featured artists: ${featuredArtists.length}, Grid artists: ${gridArtists.length}`)
  if (featuredArtists.length > 0) {
    console.log(`[Artists Page] Featured artist names:`, featuredArtists.map(a => a.name))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kawai-pearl via-white to-gray-50">
      {/* Hero Carousel - Only show if there are featured artists */}
      {hasHeroArtists && <ArtistsHeroWrapper artists={featuredArtists} />}

      {/* Artists Grid */}
      <section id="artists-grid" className="pb-24 scroll-mt-20">
        <div className="container mx-auto px-6">
          {/* Section Header - Only show if there are featured artists in hero */}
          {hasHeroArtists && (
            <div className="text-center mb-16 pt-24">
              <h2 className="text-4xl md:text-5xl font-bold text-kawai-charcoal mb-4">
                All Artists
              </h2>
              <div className="w-24 h-1.5 bg-kawai-red mx-auto mb-6" />
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore our complete roster of world-class musicians
              </p>
            </div>
          )}
          {gridArtists.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {gridArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-kawai-charcoal mb-4">
                    Artists Coming Soon
                  </h2>
                  <p className="text-lg text-gray-600">
                    We're building our roster of talented KAWAI artists. Check back soon to discover the musicians who perform on our world-class instruments.
                  </p>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <p className="text-sm text-gray-500 italic">
                    "The piano keys are black and white, but they sound like a million colors in your mind."
                  </p>
                </div>
              </div>

              <div className="mt-12">
                <p className="text-gray-600 mb-6">
                  Discover the instruments our artists will play
                </p>
                <Link
                  href="/pianos"
                  className="inline-flex items-center gap-2 bg-kawai-red text-white px-8 py-4 rounded-lg hover:bg-kawai-red/90 transition-colors font-medium shadow-lg hover:shadow-xl"
                >
                  Explore Pianos
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {artists.length > 0 && (
        <section className="py-16 bg-kawai-charcoal text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Experience the KAWAI Difference
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover why world-class artists choose KAWAI pianos for their performances
            </p>
            <Link
              href="/pianos"
              className="inline-flex items-center gap-2 bg-kawai-red text-white px-8 py-4 rounded-lg hover:bg-kawai-red/90 transition-colors font-medium shadow-lg hover:shadow-xl"
            >
              Explore Our Pianos
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
