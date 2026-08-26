import Image from 'next/image'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import { SignupHeroVideo } from './SignupHeroVideo'
import type { Media, SignupCampaign } from '@/payload-types'

const SCRIM = {
  light: 'from-black/30 to-black/45',
  medium: 'from-black/40 to-black/60',
  heavy: 'from-black/55 to-black/75',
} as const

/**
 * Marketer-selectable hero surfaces, each shipped with the text colours that
 * actually pass on it rather than one palette reused across all three.
 *
 * Kawai red is the reason this is a table and not a single class swap: pearl
 * clears AA on it at 4.54:1, but the gold kicker lands at 2.84:1 and the 85%
 * subheading at 3.57:1 — both failures. On red those two go full pearl. Black
 * and charcoal have headroom to spare and keep the softer treatment.
 */
const SURFACE = {
  black: {
    bg: 'bg-kawai-black',
    kicker: 'text-kawai-gold',
    subheading: 'text-kawai-pearl/85',
  },
  red: {
    bg: 'bg-kawai-red',
    kicker: 'text-kawai-pearl',
    subheading: 'text-kawai-pearl',
  },
  charcoal: {
    bg: 'bg-kawai-charcoal',
    kicker: 'text-kawai-gold',
    subheading: 'text-kawai-pearl/85',
  },
} as const

function isMedia(value: unknown): value is Media {
  return typeof value === 'object' && value !== null && 'url' in value
}

/**
 * Owns the page's single <h1>. No block may emit another.
 *
 * The scrim is not decoration — hero text sits over marketer-chosen imagery,
 * and WCAG 1.4.3 still demands 4.5:1. Automated tools cannot measure text on an
 * image, so this must be checked visually per campaign.
 */
export function SignupHero({ hero }: { hero: SignupCampaign['hero'] }) {
  const surface = SURFACE[hero?.backgroundColor ?? 'black'] ?? SURFACE.black
  const scrim = SCRIM[hero?.scrim ?? 'medium'] ?? SCRIM.medium

  // No background is a legitimate campaign choice, not a missing asset — the
  // chosen surface colour carries the hero on its own. Rendering an <Image>
  // anyway would point at a fallback file that does not exist in public/, and
  // the browser paints a broken-image glyph over the hero.
  const background = hero?.background ?? null

  // The background field accepts video as well as stills, so branch on the
  // stored mimeType rather than assuming an image. Feeding a .mp4 to next/image
  // yields a broken <img>, which is what happened before this branch existed.
  const media = isMedia(background) ? background : null
  const isVideo = Boolean(media?.mimeType?.startsWith('video/'))

  const image =
    background && !isVideo
      ? getImagePropsWithFallback(background, '', 'hero', { priority: true, sizes: '100vw' })
      : null

  return (
    <section className={`relative isolate overflow-hidden ${surface.bg}`}>
      {isVideo && media?.url ? (
        <SignupHeroVideo
          src={media.url}
          type={media.mimeType ?? 'video/mp4'}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      {image ? (
        <Image
          {...image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      {/* Only over media. On a bare surface the scrim would mute the chosen
          colour to a muddy version of itself — most visibly on red, where the
          point of picking it is that it reads as Kawai red. */}
      {background ? (
        <div className={`absolute inset-0 bg-gradient-to-b ${scrim}`} aria-hidden="true" />
      ) : null}
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        {hero?.kicker ? (
          <p
            className={`mb-3 text-xs font-semibold uppercase tracking-[0.24em] ${surface.kicker}`}
          >
            {hero.kicker}
          </p>
        ) : null}
        <h1 className="max-w-[14ch] text-4xl font-extrabold leading-[1.03] tracking-tight text-kawai-pearl sm:text-6xl">
          {hero?.heading}
        </h1>
        {hero?.subheading ? (
          <p className={`mt-5 max-w-[42ch] text-base leading-relaxed ${surface.subheading}`}>
            {hero.subheading}
          </p>
        ) : null}
      </div>
    </section>
  )
}
