import type { Artist } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload/queries'
import { unstable_cache } from 'next/cache'
import { ArtistsGrid } from '@/components/artists/ArtistsGrid'

interface ArtistsGridBlockProps {
  title?: string | null
  showSearch?: boolean | null
  limit?: number | null
}

const getArtistsGrid = unstable_cache(
  async (limit: number) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'artists',
      where: { isActive: { equals: true } },
      sort: '-featured,-updatedAt',
      limit,
      depth: 1,
    })
    return docs
  },
  ['artists-grid'],
  { tags: ['artists'], revalidate: 3600 }
)

export async function ArtistsGridBlock({ title, showSearch, limit }: ArtistsGridBlockProps) {
  const docs = await getArtistsGrid(limit ?? 200)
  return (
    <ArtistsGrid
      artists={docs as Artist[]}
      title={title ?? 'Our Artists'}
      showSearch={showSearch ?? true}
    />
  )
}
