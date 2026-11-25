import Image from 'next/image'
import { CalendarDaysIcon } from '@heroicons/react/24/solid'
import { PromoReveal } from '@/components/fall-promo'
import { Lockup } from './Lockup'
import { Wordmark } from './Wordmark'
import { SaleCtaPair } from './SaleCtas'
import { fillLocation } from './store'
import { DISPLAY, SANS } from './tokens'
import type { SaleCloseContent, SaleCta, SaleImage, SaleStore } from './types'

/**
 * The cinematic close (kawai-holiday-close-redesign v1, Nov 25, 2026). The
 * user, of the two-block close: "I don't like it's structure and it doesn't
 * really look cool and bold." Opt-in through `close.image`; the national
 * /holiday-sale-event sets it, the store pages do not.
 *
 * A full-bleed photograph, composed like a title card: the lockup huge and
 * centred on the photo's axis, the dated line, the one body line, Request
 * Inventory with its note, then the photo's subject left clear below the type
 * as the "stage". The wordmark sits small in the bottom-right corner.
 *
 * Contrast is held by the scrims, not by the photo:
 *
 * - The type column sits on a black scrim of 0.66–0.78 alpha that fades out
 *   only below the column. Even on a pure white pixel that is ≤ rgb 87 grey,
 *   so white text is ≥ 7.3:1 and the white/90 note ≥ 6:1 whatever the photo.
 * - The `kawai-red-400` script (large text, needs 3:1) sits in the darkest
 *   band. Measured over this photo with the words hidden, at the brightest
 *   3px patch behind each glyph box (1440 / 820 / 390): ≥ 3.26:1 at 1440
 *   (one ceiling downlight), ≥ 5.4:1 at 820 and 390. Every white line
 *   measured ≥ 7.8:1.
 * - The wordmark's corner has its own radial scrim (0.82 → 0.7): the white
 *   tagline measured ≥ 16:1.
 * - Request Inventory is the shared solid Kawai red button: white on Kawai red
 *   is 4.8:1 wherever it sits.
 *
 * Schedule Visit and the store phone line render only when a store is passed
 * (no store page sets `close.image` today; this keeps the option safe).
 *
 * The photo is below the fold, so it loads lazily (no `priority`).
 */
export function SaleCloseCinematic({
  close,
  image,
  store,
  cta,
  callLabel,
  tagline,
  ctaId,
}: {
  close: SaleCloseContent
  image: SaleImage
  store?: SaleStore | undefined
  cta: SaleCta
  callLabel: string
  tagline: string
  /** The pair's id: the phone bar hides once it is on screen. */
  ctaId: string
}) {
  return (
    <section
      aria-labelledby="sale-close"
      data-sale-close="cinematic"
      className="relative isolate flex min-h-[max(100svh,52rem)] flex-col overflow-hidden bg-black text-white sm:min-h-[max(92svh,60rem)] lg:min-h-[clamp(88vh,64vw,118vh)]"
      style={{ fontFamily: SANS }}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        // Cover on a portrait section renders the 3:2 photo far wider than
        // the viewport (≈325vw on a phone, ≈200vw on a tablet); size for that
        // so the stage is not upscaled soft.
        sizes="(max-width: 639px) 330vw, (max-width: 1023px) 200vw, 100vw"
        className="-z-20 object-cover"
        style={{ objectPosition: image.position ?? 'center' }}
      />
      {/* Foot scrim for the wordmark corner, plus a soft edge vignette. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(26rem_14rem_at_100%_100%,color-mix(in_srgb,var(--color-black)_82%,transparent)_0%,color-mix(in_srgb,var(--color-black)_70%,transparent)_45%,color-mix(in_srgb,var(--color-black)_0%,transparent)_100%),linear-gradient(to_top,color-mix(in_srgb,var(--color-black)_55%,transparent)_0%,color-mix(in_srgb,var(--color-black)_0%,transparent)_10rem),radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--color-black)_0%,transparent)_60%,color-mix(in_srgb,var(--color-black)_35%,transparent)_100%)]"
      />

      <div className="relative">
        {/* The column's scrim: 0.66–0.78 behind every word, fading out only below it. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -bottom-40 -z-10 bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--color-black)_78%,transparent)_0%,color-mix(in_srgb,var(--color-black)_66%,transparent)_45%,color-mix(in_srgb,var(--color-black)_68%,transparent)_calc(100%-10rem),color-mix(in_srgb,var(--color-black)_0%,transparent)_100%)]"
        />
        <PromoReveal
          className="mx-auto flex max-w-5xl flex-col items-center px-5 pb-6 pt-20 text-center sm:px-10 sm:pt-20 lg:pt-20"
        >
          <div data-reveal="rise" style={{ textShadow: '0 4px 40px color-mix(in srgb, var(--color-black) 55%, transparent)' }}>
            <Lockup lockup={close.lockup} id="sale-close" size="display" tone="dark" />
          </div>

          <p data-reveal="rise" className="mt-8 sm:mt-10">
            <span className="block text-sm font-semibold text-white/90 sm:text-base">{close.eyebrow}</span>
            <span
              className="mt-2 block text-balance text-[clamp(1.7rem,3.6vw,2.9rem)] leading-[1.08] text-white"
              style={{ fontFamily: DISPLAY, fontWeight: 900, letterSpacing: '-0.01em' }}
            >
              {close.heading}
            </span>
          </p>

          <p data-reveal="rise" className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/90 sm:text-lg lg:max-w-2xl">
            {fillLocation(close.body, store)}
          </p>

          <div id={ctaId} data-reveal="pop" className="mt-9 flex w-full flex-col items-center">
            <SaleCtaPair
              cta={cta}
              callLabel={callLabel}
              store={store}
              placement="close"
              size="lg"
              tone="dark"
            />
            {store?.schedule && (
              <a
                href={store.schedule.href}
                {...(store.schedule.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                data-cta="schedule-visit"
                data-cta-placement="close"
                className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white underline decoration-white/40 underline-offset-[6px] transition hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <CalendarDaysIcon aria-hidden className="h-5 w-5" />
                {store.schedule.label}
              </a>
            )}
          </div>

          {store?.phone && (
            <p data-reveal="fade" className="mt-4 text-sm text-white/90">
              {store.name} · {store.phone}
            </p>
          )}
        </PromoReveal>
      </div>

      {/* The stage: the photograph's subject, left clear under the type. */}
      <div aria-hidden className="min-h-56 flex-1 sm:min-h-72" />

      <div className="absolute bottom-6 right-5 sm:bottom-10 sm:right-10">
        <Wordmark tagline={tagline} tone="reversed" className="origin-bottom-right scale-[0.78]" />
      </div>
    </section>
  )
}
