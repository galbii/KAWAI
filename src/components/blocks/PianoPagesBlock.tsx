import { getCollectionsForCategory, getCatalogProductsByCategory } from '@/lib/payload/queries'
import { getSite } from '@/lib/site-context'
import { CollectionVideoCarousel } from '@/components/piano/CollectionVideoCarousel'
import PianoPagesBrowser from '@/components/piano/PianoPagesBrowser'

type Props = {
  id?: string | null
  category?: 'digital' | 'grand' | 'upright' | 'hybrid' | null
  heading?: string | null
  showCarousel?: boolean | null
  carouselHeight?: 'medium' | 'large' | 'fullscreen' | null
  carouselAutoplayInterval?: number | null
  headingLevel?: 'h1' | 'h2'
}

export default async function PianoPagesBlock({
  category,
  heading,
  showCarousel,
  carouselHeight,
  carouselAutoplayInterval,
  headingLevel = 'h1',
}: Props) {
  if (!category) return null

  const [products, collections, site] = await Promise.all([
    getCatalogProductsByCategory(category),
    getCollectionsForCategory(category),
    getSite(),
  ])

  const carouselCollections = collections.filter(
    (c) => c.youtubeUrl || c.mediaUrl || c.imageUrl,
  )

  // The carousel renders the category title as the page heading when present.
  // In that case the text heading below drops a level so there is only one h1.
  const carouselShown = showCarousel !== false && carouselCollections.length > 0
  const SectionHeading = carouselShown ? 'h2' : headingLevel

  const headingText = heading ?? (category ? category.charAt(0).toUpperCase() + category.slice(1) + ' Pianos' : null)

  return (
    <section id="piano-pages-browser">
      {carouselShown && (
        <CollectionVideoCarousel
          collections={carouselCollections}
          category={category}
          height={carouselHeight ?? 'large'}
          autoplayInterval={carouselAutoplayInterval ?? 4000}
          headingLevel={headingLevel}
        />
      )}
      {/* Secondary text heading — server-rendered, faint. Drops to h2 when the
          carousel above already provides the page heading (single-h1 rule). */}
      {headingText && (
        <div className="bg-white px-6 pt-6 pb-1">
          <SectionHeading
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
          </SectionHeading>
        </div>
      )}
      <PianoPagesBrowser products={products} collections={collections} heading={heading ?? null} category={category} site={site} />
    </section>
  )
}
