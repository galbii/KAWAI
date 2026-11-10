import Image from 'next/image'
import { RibbonBow } from './RibbonBow'
import { Snowfall } from './Snowfall'
import { SERIF } from './tokens'
import type { SaleHeroContent } from './types'

/**
 * The flyer's top half: a bright photograph tied off with a red ribbon and
 * bow, then a serif headline whose second line is a red italic accent.
 *
 * Above the fold, so it enters on CSS keyframes rather than a scroll trigger.
 * `both` fill keeps the end state under reduced motion, where the global rule
 * clamps every duration to ~0 — the copy is simply there.
 */
const ENTER = 'animate-[price-rise_0.9s_cubic-bezier(0.16,1,0.3,1)_both]'

export function SaleHero({ hero, storeName }: { hero: SaleHeroContent; storeName: string }) {
  return (
    <header className="relative bg-white">
      {/* Photograph */}
      <div className="relative h-[46vh] min-h-[18rem] w-full overflow-hidden sm:h-[58vh] lg:h-[64vh]">
        <Image
          src={hero.image}
          alt={hero.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover motion-safe:animate-[sale-hero-zoom_14s_ease-out_both]"
        />
        {/* Warm wash so the snow reads and the photo meets the cream below. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-kawai-red-900/35 via-transparent to-white/10"
        />
        <Snowfall />
      </div>

      {/* Ribbon + bow straddling the photograph's foot */}
      <RibbonBow className="relative z-10 -mt-10 sm:-mt-12" />

      {/* Headline panel */}
      <div className="relative mx-auto max-w-3xl px-4 pb-14 pt-4 text-center sm:px-6 sm:pb-20">
        <p
          className={`${ENTER} text-xs font-semibold uppercase tracking-[0.28em] text-kawai-red-700 sm:text-sm`}
          style={{ animationDelay: '0.1s' }}
        >
          {storeName}
        </p>

        <h1
          className="mt-4 text-[clamp(2.6rem,7vw,4.75rem)] leading-[1.02] text-kawai-black"
          style={{ fontFamily: SERIF }}
        >
          <span className={`${ENTER} block`} style={{ animationDelay: '0.2s' }}>
            {hero.titleLead}
          </span>
          <span
            className={`${ENTER} block font-medium italic text-kawai-red`}
            style={{ animationDelay: '0.35s' }}
          >
            {hero.titleAccent}
          </span>
        </h1>

        <p
          className={`${ENTER} mx-auto mt-6 max-w-xl text-base leading-relaxed text-kawai-muted sm:text-lg`}
          style={{ animationDelay: '0.5s' }}
        >
          {hero.body}
        </p>

        <p
          className={`${ENTER} mt-5 inline-flex items-center gap-2 rounded-full border border-kawai-gold-on-light/40 bg-kawai-pearl px-4 py-1.5 text-sm font-medium text-kawai-gold-on-light`}
          style={{ animationDelay: '0.62s' }}
        >
          <svg aria-hidden viewBox="0 0 24 24" className="h-3.5 w-3.5">
            <path
              fill="currentColor"
              d="M12 0c.6 5.6 2.4 7.4 8 8-5.6.6-7.4 2.4-8 8-.6-5.6-2.4-7.4-8-8 5.6-.6 7.4-2.4 8-8z"
              transform="translate(0 4)"
            />
          </svg>
          {hero.ending}
        </p>
      </div>
    </header>
  )
}
