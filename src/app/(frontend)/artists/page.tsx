import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload/queries'
import type { Artist, Page } from '@/payload-types'
import ArtistsHeroWrapper from '@/components/artists/ArtistsHeroWrapper'
import { ArtistsGrid } from '@/components/artists/ArtistsGrid'
import { RenderBlocks } from '@/components/RenderBlocks'
import { getCMSPageMetadata } from '@/lib/seo/cms-page-metadata'
import { getSite, localeFromSite } from '@/lib/site-context'

const fallbackMetadata: Metadata = {
  title: 'KAWAI Artists | World-Class Musicians & Performers',
  description: 'Discover the talented artists and musicians who trust KAWAI pianos for their performances and recordings. From concert halls to recording studios, explore our roster of acclaimed pianists.',
}

export async function generateMetadata(): Promise<Metadata> {
  return getCMSPageMetadata('artists', fallbackMetadata, localeFromSite(await getSite()))
}

// Enable ISR with 15-minute revalidation
export const revalidate = 900

async function getArtists() {
  try {
    const payload = await getPayloadClient()
    const artists = await payload.find({
      collection: 'artists',
      where: {
        isActive: { equals: true },
      },
      limit: 100,
      sort: '-featured,-updatedAt',
      depth: 1,
    })
    return artists.docs as Artist[]
  } catch (error) {
    console.error('Error fetching artists:', error)
    return []
  }
}

async function getLegacyArtists() {
  try {
    const payload = await getPayloadClient()
    const artists = await payload.find({
      collection: 'artists',
      where: {
        isActive: { equals: false },
      },
      limit: 100,
      sort: 'name',
      depth: 1,
    })
    return artists.docs as Artist[]
  } catch (error) {
    console.error('Error fetching legacy artists:', error)
    return []
  }
}

async function getCMSArtistsPage(): Promise<Page | null> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: 'artists' },
        _status: { equals: 'published' },
      },
      limit: 1,
    })
    return (result.docs[0] as Page) ?? null
  } catch (error) {
    console.error('Error fetching CMS artists page:', error)
    return null
  }
}

export default async function ArtistsPage() {
  const [artists, legacyArtists, cmsPage] = await Promise.all([getArtists(), getLegacyArtists(), getCMSArtistsPage()])

  // If a CMS page exists with slug "artists", render it instead of the hardcoded layout
  if (cmsPage) {
    return (
      <div className="min-h-screen">
        <RenderBlocks blocks={cmsPage.layout} />
      </div>
    )
  }

  // Get featured artists for hero carousel
  const featuredArtists = artists.filter((artist) => artist.featured).slice(0, 5)
  const hasHeroArtists = featuredArtists.length > 0

  // Filter out featured artists from the grid (they're already in the hero)
  const gridArtists = hasHeroArtists
    ? artists.filter((artist) => !artist.featured)
    : artists

  return (
    <div className="min-h-screen bg-kawai-black">
      {/* Hero Carousel — only shown for featured artists */}
      {hasHeroArtists && <ArtistsHeroWrapper artists={featuredArtists} />}

      {/* Artists Grid */}
      <section id="artists-grid" className="scroll-mt-20">
        {/* Section header — only when hero is showing */}
        {hasHeroArtists && (
          <div className="container mx-auto px-6 text-center mb-16 pt-24">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-4 font-[family-name:var(--font-brand-serif)]">
              All Artists
            </h2>
            <div className="w-16 h-px bg-kawai-red mx-auto mb-6" />
            <p className="text-base text-white/50 max-w-2xl mx-auto font-[family-name:var(--font-brand-sans)]">
              Explore our complete roster of world-class musicians
            </p>
          </div>
        )}

        {gridArtists.length > 0 ? (
          <ArtistsGrid artists={gridArtists} legacyArtists={legacyArtists} />
        ) : (
          <div className="container mx-auto px-6 pb-24">
            <div className="max-w-2xl mx-auto text-center py-24">
              <div className="bg-white/5 rounded-2xl p-12 border border-white/10">
                <h2 className="text-3xl font-light text-white mb-4 font-[family-name:var(--font-brand-serif)]">
                  Artists Coming Soon
                </h2>
                <p className="text-base text-white/50">
                  We're building our roster of talented KAWAI artists. Check back soon to discover
                  the musicians who perform on our world-class instruments.
                </p>
                <div className="mt-8 pt-8 border-t border-white/10">
                  <p className="text-sm text-white/30 italic">
                    "The piano keys are black and white, but they sound like a million colors in your mind."
                  </p>
                </div>
              </div>

              <div className="mt-12">
                <p className="text-white/50 mb-6">Discover the instruments our artists will play</p>
                <Link
                  href="/pianos"
                  className="inline-flex items-center gap-2 bg-kawai-red text-white px-8 py-4 rounded-full hover:bg-kawai-red/90 transition-colors font-medium"
                >
                  Explore Pianos
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* CTA Section */}
      {artists.length > 0 && (
        <section className="py-16 bg-kawai-charcoal text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-light mb-4 font-[family-name:var(--font-brand-serif)]">
              Experience the KAWAI Difference
            </h2>
            <p className="text-base text-gray-400 mb-8 max-w-2xl mx-auto">
              Discover why world-class artists choose KAWAI pianos for their performances
            </p>
            <Link
              href="/pianos"
              className="inline-flex items-center gap-2 bg-kawai-red text-white px-8 py-4 rounded-full hover:bg-kawai-red/90 transition-colors font-medium"
            >
              Explore Our Pianos
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
