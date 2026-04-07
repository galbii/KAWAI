import type { Collection } from '@/payload-types'
import type { MarketingFeaturedCollectionsBlock } from '@/payload-types'
import { getNavCollections } from '@/lib/payload/products-navigation'
import type { NavCollection } from '@/lib/payload/products-navigation'
import { FeaturedCollectionsCarousel } from '@/components/piano/featured-collections-carousel'
import { FeaturedCollectionsGrid } from '@/components/piano/featured-collections-grid'

// ─── Collection shape adapter ─────────────────────────────────────────────────
//
// When `collectionSource === 'manual'`, the `collections` relationship field is
// populated by Payload at depth:1 — each item is a full Collection document.
// This maps that shape to NavCollection so both display modes share the same type.

function isPopulated(c: string | Collection): c is Collection {
  return typeof c === 'object'
}

function collectionToNav(col: Collection): NavCollection {
  // `media` is a relationship — populated at depth:1 as a Media object with a `url` field.
  const mediaUrl =
    col.media && typeof col.media === 'object'
      ? ((col.media as unknown as Record<string, unknown>).url as string | null | undefined) ?? null
      : null

  return {
    id: String(col.id),
    title: col.title,
    handle: col.handle,
    description: col.description ?? null,
    imageUrl: col.imageUrl ?? null,
    youtubeUrl: col.youtubeUrl ?? null,
    mediaUrl,
    heading: col.heading ?? null,
    subheading: col.subheading ?? null,
    productCount: col.productCount ?? 0,
    collectionPriority: (col as unknown as { collectionPriority?: number }).collectionPriority ?? 0,
    featured: Boolean(col.featured),
    pianoCategories: (col.pianoCategories as string[] | null | undefined) ?? null,
    bannerSize: (col.bannerSize as NavCollection['bannerSize']) ?? null,
  }
}

// ─── Renderer ─────────────────────────────────────────────────────────────────

export async function FeaturedCollectionsRenderer(props: MarketingFeaturedCollectionsBlock) {
  const {
    displayMode = 'grid',
    collectionSource = 'featured',
    collections: manualCollections,
    categoryFilter,
    limit,
    columns,
    showCategoryFilter,
    eyebrow,
    heading,
    ctaText,
    ctaHref,
    browseCtaText,
    browseCtaHref,
  } = props

  // ── Resolve collection data ──────────────────────────────────────────────────
  let collections: NavCollection[]

  if (collectionSource === 'manual' && Array.isArray(manualCollections) && manualCollections.length > 0) {
    // Relationship field at depth:1 — filter to populated objects, discard bare ID strings
    collections = manualCollections.filter(isPopulated).map(collectionToNav)
  } else if (collectionSource === 'category' && categoryFilter) {
    collections = await getNavCollections(limit ?? 9, true, categoryFilter)
  } else {
    // Default: auto-pull featured collections
    collections = await getNavCollections(limit ?? 9)
  }

  // ── Shared props ─────────────────────────────────────────────────────────────
  const sharedProps = {
    collections,
    eyebrow: eyebrow ?? 'Kawai Piano',
    heading: heading ?? 'Featured Collections',
    ctaText: ctaText ?? 'Explore All',
    ctaHref: ctaHref ?? '/pianos',
  }

  // ── Route to display component ───────────────────────────────────────────────
  if (displayMode === 'carousel') {
    return <FeaturedCollectionsCarousel {...sharedProps} showCategoryFilter={showCategoryFilter ?? false} />
  }

  return (
    <FeaturedCollectionsGrid
      {...sharedProps}
      columns={columns ?? '3'}
      showCategoryFilter={showCategoryFilter ?? false}
      browseCtaText={browseCtaText ?? 'Browse All Products'}
      browseCtaHref={browseCtaHref ?? '/pianos'}
    />
  )
}
