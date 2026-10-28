import { getNavCollections } from '@/lib/payload/products-navigation'

/**
 * Photography for the rental pages. A storefront can attach its own photos
 * (rental hero image, per-rate images); anything it leaves empty falls back to
 * the featured-collection imagery the homepage tiles already use, so a store
 * that has never touched these fields still gets an image-led page.
 */

export type RentalCategory = 'grand' | 'upright' | 'digital' | 'hybrid'

export interface RentalImageFallbacks {
  hero: string | null
  byCategory: Partial<Record<RentalCategory, string>>
  /** Every usable collection photo, in priority order — for picking unused ones. */
  all: string[]
}

/** Maps a rate's free-text name ("Grand Pianos") to a collection category. */
export function rentalCategoryOf(pianoType: string): RentalCategory | null {
  const t = pianoType.toLowerCase()
  if (t.includes('grand')) return 'grand'
  if (t.includes('upright')) return 'upright'
  if (t.includes('digital')) return 'digital'
  if (t.includes('hybrid')) return 'hybrid'
  return null
}

/** URL of an upload field value (populated Media object), else null. */
export function mediaUrl(value: unknown): string | null {
  if (value && typeof value === 'object' && 'url' in value) {
    const url = (value as { url?: unknown }).url
    return typeof url === 'string' && url.length > 0 ? url : null
  }
  return null
}

export async function getRentalImageFallbacks(): Promise<RentalImageFallbacks> {
  const collections = await getNavCollections(20, true)
  const byCategory: RentalImageFallbacks['byCategory'] = {}
  const all: string[] = []

  // Collections arrive sorted by priority — the first image per category wins.
  for (const c of collections) {
    const image = c.mediaUrl ?? c.imageUrl
    // Stage pianos are shot on stage — wrong picture for a home rental.
    if (!image || /stage/i.test(c.title)) continue
    all.push(image)
    for (const cat of c.pianoCategories ?? []) {
      const key = cat.toLowerCase() as RentalCategory
      if (['grand', 'upright', 'digital', 'hybrid'].includes(key) && !byCategory[key]) {
        byCategory[key] = image
      }
    }
  }

  // Hero: a lifestyle shot that isn't already on a rate tile. Hybrids aren't
  // a rental category, so their (home, person-at-the-piano) photo is free.
  const hero = byCategory.hybrid ?? byCategory.upright ?? byCategory.digital ?? byCategory.grand ?? null
  return { hero, byCategory, all }
}
