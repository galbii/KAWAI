import Image from 'next/image'
import { PhoneIcon } from '@heroicons/react/24/solid'
import { Lockup } from './Lockup'
import { Wordmark } from './Wordmark'
import { SANS } from './tokens'
import type { SaleHeroContent, SaleStore } from './types'

/**
 * The hero, after the comp (hero.png): a centred typographic stack on a plain
 * white field — heavy serif setup line, the red script word, the heavy serif
 * close — then the sans sub-line and the red wordmark over "Instrumental to
 * Life". Beside it (below it on phones) the photography: one tall frame under
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
  callLabel,
  tagline,
}: {
  hero: SaleHeroContent
  store: SaleStore
  callLabel: string
  tagline: string
}) {
  const tel = store.phone ? `tel:${store.phone.replace(/\D/g, '')}` : null

  return (
    <header className="relative isolate overflow-hidden bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-14 sm:px-10 sm:pt-20 lg:min-h-[min(56rem,94vh)] lg:grid-cols-12 lg:gap-10 lg:pb-20 lg:pt-16">
        {/* Type */}
        <div className="flex flex-col items-center text-center lg:col-span-6">
          <p
            className={`${ENTER} flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-kawai-black/70`}
            style={{ fontFamily: SANS, animationDelay: '0.05s' }}
          >
            <span aria-hidden className="h-px w-8 bg-kawai-red" />
            {store.name}
            <span aria-hidden className="h-px w-8 bg-kawai-red" />
          </p>

          <div className={`${ENTER} mt-8 sm:mt-10`} style={{ animationDelay: '0.15s' }}>
            <Lockup lockup={hero.lockup} as="h1" size="hero" />
          </div>

          <p
            className={`${ENTER} mt-10 text-[1.15rem] leading-[1.45] tracking-[0.01em] text-kawai-black sm:mt-14 sm:text-[1.35rem]`}
            style={{ fontFamily: SANS, animationDelay: '0.35s' }}
          >
            {hero.subline.map((line, i) => (
              <span key={line} className="block">
                {line}
                {i < hero.subline.length - 1 ? ' ' : null}
              </span>
            ))}
          </p>

          <div
            className={`${ENTER} mt-9 flex flex-col items-center gap-4 sm:flex-row`}
            style={{ animationDelay: '0.5s' }}
          >
            {tel && (
              <a
                href={tel}
                className="inline-flex min-w-[11rem] items-center justify-center gap-2 rounded-full bg-kawai-red px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-kawai-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-kawai-red"
                style={{ fontFamily: SANS }}
              >
                <PhoneIcon aria-hidden className="h-4 w-4" />
                {callLabel}
              </a>
            )}
            <p className="text-sm text-kawai-black/70" style={{ fontFamily: SANS }}>
              {hero.ending}
            </p>
          </div>

          <div className={`${ENTER} mt-12 sm:mt-14`} style={{ animationDelay: '0.65s' }}>
            <Wordmark tagline={tagline} />
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
