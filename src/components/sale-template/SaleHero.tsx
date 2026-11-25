import Image from 'next/image'
import { Lockup } from './Lockup'
import { SaleCtaPair } from './SaleCtas'
import { DISPLAY, SANS, SCRIPT } from './tokens'
import type { SaleCta, SaleHeroContent, SaleStore } from './types'

/**
 * The hero (v4, Nov 19, 2026: "too many words", "a little bit more color
 * division", "something cleaner ... like Limited Time Offer"). Two blocks:
 *
 * 1. A Kawai red band across the top carrying the badge lockup (white sans
 *    caps setup words + one white script word), when the campaign sets one.
 * 2. The white field: the store name, the headline lockup, ONE support line,
 *    then the Request Inventory / Call Now pair. Nothing else: no sub-line
 *    paragraph, no second date line, no wordmark (the close signs off).
 *
 * Beside the type (below it on phones) the photography: one tall frame under
 * an arch, a smaller detail frame laid across its foot.
 *
 * Above the fold, so it enters on CSS keyframes rather than a scroll trigger.
 * `both` fill keeps the end state under reduced motion, where the global rule
 * clamps every duration to ~0: the page is simply there.
 */
const ENTER = 'animate-[price-rise_0.9s_cubic-bezier(0.16,1,0.3,1)_both]'

export function SaleHero({
  hero,
  store,
  cta,
  callLabel,
  ctaId,
  largeMobile = false,
}: {
  hero: SaleHeroContent
  /** Optional: without a store (the national page) the store name line is left out. */
  store?: SaleStore | undefined
  cta: SaleCta
  callLabel: string
  /** The pair's id: the phone bar shows once it has scrolled away. */
  ctaId: string
  /** v2 polish (national only): a larger lockup minimum on phones. */
  largeMobile?: boolean
}) {
  return (
    <header className="relative isolate overflow-hidden bg-white">
      {hero.badge && (
        // White on Kawai red: 4.8:1, and the type is large and bold.
        <div className="bg-kawai-red px-5 py-3 text-white sm:px-10 sm:py-4">
          <p
            className={`${ENTER} mx-auto flex max-w-7xl items-center justify-center gap-4 sm:gap-6`}
            style={{ animationDelay: '0.05s' }}
          >
            <span aria-hidden className="hidden h-px w-12 bg-white/70 sm:block" />
            <span
              className="text-[0.9rem] font-bold uppercase tracking-[0.32em] sm:text-[1.05rem]"
              style={{ fontFamily: SANS }}
            >
              {hero.badge.lead}
            </span>{' '}
            <span
              className="-my-2 text-[2.4rem] leading-none sm:text-[2.9rem]"
              style={{ fontFamily: SCRIPT, fontWeight: 400 }}
            >
              {hero.badge.script}
            </span>
            <span aria-hidden className="hidden h-px w-12 bg-white/70 sm:block" />
          </p>
        </div>
      )}

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-10 sm:px-10 sm:pt-16 lg:min-h-[min(50rem,88vh)] lg:grid-cols-12 lg:gap-10 lg:pb-20 lg:pt-14">
        {/* Type: store → headline → one support line → actions. */}
        <div className="flex flex-col items-center text-center lg:col-span-6">
          {store && (
            <p
              className={`${ENTER} flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-kawai-black/70`}
              style={{ fontFamily: SANS, animationDelay: '0.1s' }}
            >
              <span aria-hidden className="h-px w-8 bg-kawai-red" />
              {store.name}
              <span aria-hidden className="h-px w-8 bg-kawai-red" />
            </p>
          )}

          <div className={`${ENTER} ${store ? 'mt-8 sm:mt-10' : ''}`} style={{ animationDelay: '0.15s' }}>
            <Lockup lockup={hero.lockup} as="h1" size={largeMobile ? 'heroLarge' : 'hero'} />
          </div>

          <p
            className={`${ENTER} mt-10 max-w-md text-balance text-[clamp(1.3rem,3.2vw,1.75rem)] leading-tight text-kawai-black sm:mt-12`}
            style={{ fontFamily: DISPLAY, fontWeight: 900, animationDelay: '0.3s' }}
          >
            {hero.support}
          </p>

          {/* On phones the pair stacks full width so both are thumb-sized. */}
          <div
            id={ctaId}
            className={`${ENTER} mt-8 flex w-full flex-col items-center sm:mt-9`}
            style={{ animationDelay: '0.45s' }}
          >
            <SaleCtaPair cta={cta} callLabel={callLabel} store={store} placement="hero" />
          </div>
        </div>

        {/* Photography */}
        <div className="relative mx-auto w-full max-w-md pb-10 sm:max-w-lg lg:col-span-6 lg:max-w-none lg:pb-0 lg:pl-6">
          <div
            className={`${ENTER} relative aspect-[4/5] overflow-hidden rounded-t-[999px] bg-kawai-pearl lg:ml-auto lg:w-[88%]`}
            style={{ animationDelay: '0.2s' }}
          >
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover motion-safe:animate-[sale-hero-zoom_14s_ease-out_both]"
              style={hero.image.position ? { objectPosition: hero.image.position } : undefined}
            />
          </div>
          {hero.inset && (
            <div
              className={`${ENTER} absolute bottom-0 left-0 w-[46%] overflow-hidden border-[6px] border-white bg-kawai-pearl shadow-[0_30px_60px_-30px_color-mix(in_srgb,var(--color-kawai-black)_55%,transparent)] sm:border-8 lg:-bottom-6 lg:w-[42%]`}
              style={{ animationDelay: '0.45s' }}
            >
              <div className="relative aspect-square">
                <Image
                  src={hero.inset.src}
                  alt={hero.inset.alt}
                  fill
                  sizes="(max-width: 1024px) 45vw, 22vw"
                  className="object-cover"
                  style={hero.inset.position ? { objectPosition: hero.inset.position } : undefined}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
