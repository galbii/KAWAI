import type { Artist } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload/queries'
import { ArtistsGrid } from '@/components/artists/ArtistsGrid'

interface ArtistsGridBlockProps {
  title?: string | null
  showSearch?: boolean | null
  limit?: number | null
}

export async function ArtistsGridBlock({ title, showSearch, limit }: ArtistsGridBlockProps) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'artists',
    where: { isActive: { equals: true } },
    sort: '-featured,-updatedAt',
    limit: limit ?? 200,
    depth: 1,
  })
  return (
    <ArtistsGrid
      artists={docs as Artist[]}
      title={title ?? 'Our Artists'}
      showSearch={showSearch ?? true}
    />
  )
}
