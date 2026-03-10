import { getCollectionsForCategory, getCatalogProductsByCategory } from '@/lib/payload/queries'
import { CollectionVideoCarousel } from '@/components/piano/CollectionVideoCarousel'
import PianoPagesBrowser from '@/components/piano/PianoPagesBrowser'

type Props = {
  id?: string | null
  category?: 'digital' | 'grand' | 'upright' | 'hybrid' | null
  heading?: string | null
  showCarousel?: boolean | null
  carouselHeight?: 'medium' | 'large' | 'fullscreen' | null
  carouselAutoplayInterval?: number | null
}

export default async function PianoPagesBlock({
  category,
  heading,
  showCarousel,
  carouselHeight,
  carouselAutoplayInterval,
}: Props) {
  if (!category) return null

  const [products, collections] = await Promise.all([
    getCatalogProductsByCategory(category),
    getCollectionsForCategory(category),
  ])

  const carouselCollections = collections.filter(
    (c) => c.youtubeUrl || c.mediaUrl || c.imageUrl,
  )

  return (
    <section id="piano-pages-browser">
      {showCarousel !== false && carouselCollections.length > 0 && (
        <CollectionVideoCarousel
          collections={carouselCollections}
          height={carouselHeight ?? 'large'}
          autoplayInterval={carouselAutoplayInterval ?? 6000}
        />
      )}
      <PianoPagesBrowser products={products} collections={collections} heading={heading ?? null} category={category} />
    </section>
  )
}
