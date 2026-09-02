import { RuledGround, BTS_CONTAINER } from './RuledGround'
import { SectionHead } from './SectionHead'
import { Reveal } from './Choreography'
import { ParallaxLayer } from './ParallaxLayer'

interface TradeInBandProps {
  phone?: string | null
}

/**
 * The trade-in offer, inverted to dark so it breaks the run of pearl sections.
 * The bonus itself is the picture: +$500 set as an outlined numeral the height
 * of the band, drifting against the scroll behind the copy.
 *
 * Red text on this ground uses kawai-red-400 — brand red is only ~3.6:1 on
 * kawai-black (see CLAUDE.md).
 */
export function TradeInBand({ phone }: TradeInBandProps) {
  return (
    <section className="relative bg-kawai-black overflow-hidden">
      <RuledGround tone="dark" animate />

      {/* Decorative — the figure is stated in words in the copy beside it. */}
      <ParallaxLayer
        from={90}
        to={-90}
        className="absolute inset-y-0 right-0 hidden md:flex items-center pointer-events-none select-none"
        aria-hidden
      >
        <span
          className="bts-display bts-outline block text-kawai-red-400/25 leading-none translate-x-[12%]"
          style={{ fontSize: 'clamp(9rem, 21vw, 20rem)' }}
        >
          +$500
        </span>
      </ParallaxLayer>

      <div className={`relative ${BTS_CONTAINER} py-20 md:py-28`}>
        <div className="grid lg:grid-cols-[1.35fr_1fr] gap-10 lg:gap-16 items-end">
          <div>
            <SectionHead
              tone="dark"
              eyebrow="Trade-In Bonus"
              title="Trade in, trade up"
              className="mb-8"
            />

            <Reveal as="p" delay={0.1} className="text-kawai-pearl/70 text-base md:text-lg leading-relaxed max-w-xl">
              Exchange your existing piano for its appraised value —{' '}
              <strong className="text-kawai-pearl font-semibold">plus $500</strong> — toward your
              next purchase at this official storefront. The bonus stacks: it comes off on top of
              the September rebate and 0% financing, not instead of them.
            </Reveal>
          </div>

          {phone && (
            <Reveal delay={0.18} className="flex flex-col items-stretch gap-4 lg:items-end">
              <a
                href={`tel:${phone.replace(/\D/g, '')}`}
                className="group inline-flex items-center justify-center gap-3 px-9 py-5 bg-kawai-red hover:bg-kawai-red-600 text-white text-sm tracking-[0.18em] uppercase font-semibold transition-colors w-full lg:w-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-pearl"
              >
                Call for an estimate
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </a>

              <span className="text-center lg:text-right text-kawai-pearl/75 text-sm">{phone}</span>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
