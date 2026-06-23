/**
 * Hard-coded featured collections for the /brand cinematic scene.
 *
 * On the CMS-driven Pages collection this data comes from the
 * `marketing-featured-collections` block → `getNavCollections()`. The /brand
 * page is a static clone, so the same shape is frozen here (sorted by
 * collectionPriority, then productCount — the same order the live query uses).
 * Refresh by re-running the featured-collections query if the catalog changes.
 */

export type BrandCollection = {
  title: string
  handle: string
  imageUrl: string
  productCount: number
  category: 'digital' | 'grand' | 'upright' | 'hybrid' | 'shigeru'
}

export const CATEGORY_LABELS: Record<BrandCollection['category'], string> = {
  digital: 'Digital',
  grand: 'Grand',
  upright: 'Upright',
  hybrid: 'Hybrid',
  shigeru: 'Shigeru Kawai',
}

const R2 = 'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media'

export const featuredCollections: readonly BrandCollection[] = [
  {
    title: 'Master Series',
    handle: 'master-series',
    imageUrl: `${R2}/250829_0101.png`,
    productCount: 3,
    category: 'upright',
  },
  {
    title: 'Novus Series',
    handle: 'novus-series',
    imageUrl: `${R2}/1024-683-madx-1.webp`,
    productCount: 4,
    category: 'hybrid',
  },
  {
    title: 'GX Series',
    handle: 'gx-series',
    imageUrl: `${R2}/GX-2_RGB_loc03_sRGB.png`,
    productCount: 7,
    category: 'grand',
  },
  {
    title: 'CA Series',
    handle: 'ca-series',
    imageUrl: `${R2}/CA901MB_location.png`,
    productCount: 5,
    category: 'digital',
  },
  {
    title: 'ES Series',
    handle: 'es-series',
    imageUrl: `${R2}/KAWAI_ES_FILMSTILLS_16x9_00025.png`,
    productCount: 9,
    category: 'digital',
  },
  {
    title: 'MP Stage Pianos',
    handle: 'mp-stage-pianos',
    imageUrl: `${R2}/1024-683-ddgsdfax.webp`,
    productCount: 6,
    category: 'digital',
  },
] as const

export const collectionsCopy = {
  eyebrow: 'The Range',
  headline: 'Featured Collections',
  cta: { label: 'Explore All Pianos', href: '/pianos' },
}
