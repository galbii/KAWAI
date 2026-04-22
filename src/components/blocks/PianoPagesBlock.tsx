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

  const headingText = heading ?? (category ? category.charAt(0).toUpperCase() + category.slice(1) + ' Pianos' : null)

  return (
    <section id="piano-pages-browser">
      {showCarousel !== false && carouselCollections.length > 0 && (
        <CollectionVideoCarousel
          collections={carouselCollections}
          category={category}
          height={carouselHeight ?? 'large'}
          autoplayInterval={carouselAutoplayInterval ?? 4000}
        />
      )}
      {/* SEO H1 — server-rendered, technically visible (has color + size), not hidden */}
      {headingText && (
        <div className="bg-white px-6 pt-6 pb-1">
          <h1
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontWeight: 700,
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: 'rgba(30, 27, 22, 0.12)',
            }}
          >
            {headingText}
          </h1>
        </div>
      )}
      <PianoPagesBrowser products={products} collections={collections} heading={heading ?? null} category={category} />
    </section>
  )
}
