const R2 = 'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media'

/**
 * Imagery for the cinematic /about page. The first two images
 * are eager-loaded; the rest stream in during scroll.
 *
 *   heroBg       → hero (intro) + timeline callback
 *   warmPianist  → showrooms + go-deeper (intimate, human) and reduced-motion fallback
 *   soundboard   → stats, manifesto, technology (instrument base layer)
 *   collectionsBg → featured collections (location/lifestyle)
 *   upright      → heritage (heritage drawing room)
 *   luxeRoom     → coda (aspirational interior)
 *   wordmark     → manifesto watermark only
 */
export const aboutImages = {
  heroBg: `${R2}/250829_0113-1.webp`,
  warmPianist: `${R2}/250829_0028.webp`,
  soundboard: `${R2}/1024-685-max.jpg`,
  collectionsBg: `${R2}/MP7SE_location_red.webp`,
  upright: `${R2}/1024-683-madx.webp`,
  luxeRoom: `${R2}/MS130_RGB_image_04.webp`,
  wordmark: `${R2}/Kawai%20(Red).png`,
} as const
