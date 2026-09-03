import { RuledGround, BTS_CONTAINER } from './RuledGround'
import { SectionHead } from './SectionHead'
import { Reveal } from './Choreography'
import { ParallaxLayer } from './ParallaxLayer'
import { BookCta } from './BookCta'
import type { HoursEntry } from './schedule'

interface TradeInBandProps {
  storeslug: string
  phone?: string | null
  locationName?: string | null
  hours?: HoursEntry[] | null
}

/**
 * The trade-in offer and how to claim it, in one dark block.
 *
 * The offer and its three steps used to be two sections — a dark band that
 * stated the bonus, then a pearl section that explained it — which meant the
 * page said "+$500 on top of the rebate" twice, two hundred pixels apart, under
 * two headings. They are one thought: here is the bonus, here is how you get
 * it. So the steps run under the same heading, on the same ground.
 *
 * The bonus itself is the picture: +$500 set as an outlined numeral, drifting
 * against the scroll behind the copy. It stays anchored to the top of the
 * section rather than centred in it, so the steps below get a clear ground.
 *
 * Red text on this ground uses kawai-red-400 — brand red is only ~3.6:1 on
 * kawai-black (see CLAUDE.md).
 */

/**
 * Call, book, claim. A real sequence, so the numerals earn their place: set
 * outlined at display scale, loud enough to carry the order at a glance without
 * competing with the step headings.
 */
const STEPS = [
  {
    number: '01',
    heading: 'Estimate the value',
    body: 'Call us — we’ll give you a number based on the age, condition, and market value of your current piano.',
  },
  {
    number: '02',
    heading: 'Book your visit',
    body: 'Pick a time during the program window. If you have a written independent appraisal, bring it; if not, we can help you arrange one.',
  },
  {
    number: '03',
    heading: 'Claim it at the counter',
    body: 'We beat any written independent appraisal by $500, applied to your new Kawai on the day you buy.',
  },
] as const

export function TradeInBand({ storeslug, phone, locationName, hours }: TradeInBandProps) {
  return (
    <section id="trade-in" className="relative bg-kawai-black overflow-hidden scroll-mt-24">
      <RuledGround tone="dark" animate />

      {/* Decorative — the figure is stated in words in the copy beside it. */}
      <ParallaxLayer
        from={90}
        to={-90}
        className="absolute top-0 right-0 h-[58%] hidden md:flex items-center pointer-events-none select-none"
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

        {/* ── How to claim it ──
            Same block, one rule down. The invitation is the only line between
            the offer and the mechanics; the steps answer it. */}
        <div className="mt-16 md:mt-20 pt-14 md:pt-16 border-t border-kawai-pearl/15">
          <Reveal
            as="p"
            className="bts-serif text-kawai-pearl/70 mb-12 max-w-2xl"
            style={{ fontSize: 'clamp(1.15rem, 2.1vw, 1.5rem)', lineHeight: 1.35 }}
          >
            Come to our official showroom and reserve these special offers.
          </Reveal>

          <ol className="grid md:grid-cols-3 gap-y-12 md:gap-y-0">
            {STEPS.map(({ number, heading, body }, i) => (
              <li
                key={number}
                className={i === 0 ? 'md:pr-10' : 'md:px-10 md:border-l md:border-kawai-pearl/15'}
              >
                <Reveal
                  delay={i * 0.08}
                  className="bts-display bts-outline text-kawai-red-400 leading-none mb-5"
                  style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)' }}
                  aria-hidden
                >
                  {number}
                </Reveal>

                <h3
                  className="bts-display text-kawai-pearl mb-3"
                  style={{ fontSize: 'clamp(1.15rem, 1.9vw, 1.45rem)' }}
                >
                  <Reveal as="span" variant="line" delay={i * 0.08 + 0.06} className="block">
                    {heading}
                  </Reveal>
                </h3>

                <Reveal
                  as="p"
                  delay={i * 0.08 + 0.14}
                  className="text-kawai-pearl/65 text-[0.95rem] leading-relaxed"
                >
                  {body}
                </Reveal>
              </li>
            ))}
          </ol>

          {/* The steps end on "claim it at the counter", which only happens if
              they are standing there — so the section closes on the booking,
              not on another phone number. Calling is already offered above. */}
          <Reveal delay={0.3} className="mt-14 md:mt-16">
            <BookCta
              storeslug={storeslug}
              locationName={locationName}
              hours={hours}
              tone="dark"
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
