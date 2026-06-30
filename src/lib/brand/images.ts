/**
 * Central registry of reused R2 imagery for the company / heritage / recognition
 * pages. Keeps R2 URLs in one place instead of copy-pasted across pages, so a
 * swapped asset is a one-line change. Page-specific imagery still lives in that
 * page's `_data.ts`.
 *
 * Mirrors the assets used by the cinematic /about page
 * (`about/_components/images.ts`) and the koichi-kawai story.
 */
export const R2 = 'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media'

export const brandImages = {
  /** Soundboard / action macro — engineering, technology, craft. */
  soundboard: `${R2}/1024-685-max.jpg`,
  /** Intimate pianist at the keys — human, warm. */
  warmPianist: `${R2}/250829_0113-1.webp`,
  /** Aspirational interior with grand piano. */
  luxeRoom: `${R2}/MS130_RGB_image_04.webp`,
  /** Upright in a drawing room — heritage. */
  upright: `${R2}/1024-683-madx.webp`,
  /** Lifestyle / location shot. */
  location: `${R2}/MP7SE_location_red.webp`,
} as const

export type BrandImageKey = keyof typeof brandImages
