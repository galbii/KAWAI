import Image from 'next/image'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import type { SignupCampaign } from '@/payload-types'

const SCRIM = {
  light: 'from-black/30 to-black/45',
  medium: 'from-black/40 to-black/60',
  heavy: 'from-black/55 to-black/75',
} as const

/**
 * Owns the page's single <h1>. No block may emit another.
 *
 * The scrim is not decoration — hero text sits over marketer-chosen imagery,
 * and WCAG 1.4.3 still demands 4.5:1. Automated tools cannot measure text on an
 * image, so this must be checked visually per campaign.
 */
export function SignupHero({ hero }: { hero: SignupCampaign['hero'] }) {
  const scrim = SCRIM[hero?.scrim ?? 'medium'] ?? SCRIM.medium
  // No background is a legitimate campaign choice, not a missing asset — the
  // section's solid bg-kawai-black carries the hero on its own. Rendering an
  // <Image> anyway would point at a fallback file that does not exist in
  // public/, and the browser paints a broken-image glyph over the hero.
  const background = hero?.background ?? null
  const image = background
    ? getImagePropsWithFallback(background, '', 'hero', { priority: true, sizes: '100vw' })
    : null

  return (
    <section className="relative isolate overflow-hidden bg-kawai-black">
      {image ? (
        <Image
          {...image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      <div className={`absolute inset-0 bg-gradient-to-b ${scrim}`} aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        {hero?.kicker ? (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-kawai-gold">
            {hero.kicker}
          </p>
        ) : null}
        <h1 className="max-w-[14ch] text-4xl font-extrabold leading-[1.03] tracking-tight text-kawai-pearl sm:text-6xl">
          {hero?.heading}
        </h1>
        {hero?.subheading ? (
          <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-kawai-pearl/85">
            {hero.subheading}
          </p>
        ) : null}
      </div>
    </section>
  )
}
