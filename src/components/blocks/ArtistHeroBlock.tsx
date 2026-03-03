import { getPayloadClient } from '@/lib/payload/queries'
import ArtistsHeroWrapper from '@/components/artists/ArtistsHeroWrapper'
import type { Artist } from '@/payload-types'

interface ArtistHeroBlockProps {
  autoFeatured?: boolean | null
  artists?: (Artist | string)[] | null
  maxArtists?: number | null
  showScrollIndicator?: boolean | null
  scrollTargetId?: string | null
  [key: string]: unknown
}

/**
 * ArtistHeroBlock
 *
 * Full-screen hero carousel for featured KAWAI artists.
 * When autoFeatured is true, fetches artists marked as featured from Payload.
 * Otherwise uses the manually selected artists relationship.
 *
 * Server component — renders ArtistsHeroWrapper with fetched artist data.
 */
export async function ArtistHeroBlock({
  autoFeatured = true,
  artists: selectedArtists,
  maxArtists = 5,
}: ArtistHeroBlockProps) {
  const limit = maxArtists ?? 5
  let displayArtists: Artist[] = []

  if (autoFeatured !== false) {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'artists',
      where: {
        featured: { equals: true },
        isActive: { equals: true },
      },
      sort: '-updatedAt',
      limit,
      depth: 1,
    })
    displayArtists = result.docs as Artist[]
  } else if (selectedArtists && Array.isArray(selectedArtists)) {
    displayArtists = selectedArtists
      .filter((a): a is Artist => typeof a === 'object' && a !== null)
      .slice(0, limit)
  }

  if (displayArtists.length === 0) return null

  return <ArtistsHeroWrapper artists={displayArtists} />
}
