// About-page imagery. These assets live in the project's Cloudflare R2 media
// bucket (NEXT_PUBLIC_S3_PUBLIC_URL) — the hostname is already whitelisted in
// next.config.ts remotePatterns, so next/image optimizes them directly.
const R2 = 'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media'

export const aboutImages = {
  hero: `${R2}/250829_0028.webp`,
  heritage: `${R2}/1024-683-madx.webp`,
  technology: `${R2}/1024-685-max.jpg`,
  cta: `${R2}/MS130_RGB_image_04.webp`,
  wordmark: `${R2}/Kawai%20(Red).png`,
} as const
