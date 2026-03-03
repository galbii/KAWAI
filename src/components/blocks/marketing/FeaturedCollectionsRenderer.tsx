import type { MarketingFeaturedCollectionsBlock } from '@/payload-types'
import { getNavCollections } from '@/lib/payload/products-navigation'
import { FeaturedCollectionsCarousel } from '@/components/piano/featured-collections-carousel'

export async function FeaturedCollectionsRenderer(props: MarketingFeaturedCollectionsBlock) {
  const collections = await getNavCollections(props.limit ?? 9)
  return (
    <FeaturedCollectionsCarousel
      collections={collections}
      eyebrow={props.eyebrow ?? 'Kawai Piano'}
      heading={props.heading ?? 'Featured Collections'}
      ctaText={props.ctaText ?? 'Explore All'}
      ctaHref={props.ctaHref ?? '/pianos'}
    />
  )
}
