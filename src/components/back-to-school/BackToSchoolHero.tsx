import Image from 'next/image'
import { HeroVideoBackground } from './HeroVideoBackground'
import { DATE_RANGE, OFFERS } from './campaign'
import { RuledGround } from './RuledGround'
import { HeroCtas } from './HeroCtas'
import type { HoursEntry } from './schedule'

interface BackToSchoolHeroProps {
  storeslug: string
  locationName?: string | null
  hours?: HoursEntry[] | null
}

/**
 * Hero — server-rendered so the headline is in the initial HTML. Client JS is
 * limited to the background video's playback control and the booking CTA.
 *
 * The campaign clip runs full-bleed behind the copy, inside the same white
 * print frame the smaller panel used: the hero is one large print laid on the
 * page's ruled paper, which keeps the paper language the sections below are
 * drawn in instead of dropping it for one section.
 *
 * Inside the frame the palette inverts — pearl type on the dark footage. Red
 * type here is kawai-red-400, never the brand red: brand red on a dark ground
 * is ~3.6:1 and fails AA (see the Accessibility notes in CLAUDE.md).
 */
export function BackToSchoolHero({ storeslug, locationName, hours }: BackToSchoolHeroProps) {
  return (
    <>
      <style>{`
        @keyframes bts-rise {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .bts-r1 { animation: bts-rise 0.7s cubic-bezier(0.22,0.61,0.36,1) 0.05s both; }
        .bts-r2 { animation: bts-rise 0.8s cubic-bezier(0.22,0.61,0.36,1) 0.18s both; }
        .bts-r3 { animation: bts-rise 0.8s cubic-bezier(0.22,0.61,0.36,1) 0.32s both; }
        .bts-r4 { animation: bts-rise 0.8s cubic-bezier(0.22,0.61,0.36,1) 0.46s both; }
        .bts-r5 { animation: bts-rise 0.8s cubic-bezier(0.22,0.61,0.36,1) 0.60s both; }
      `}</style>

      <section className="relative overflow-hidden bg-kawai-pearl px-3 sm:px-6 lg:px-8 py-3 sm:py-6 lg:py-8">

        <RuledGround marginRule={false} />

        {/* The print frame — same white margin, hairline and shadow the smaller
            panel carried, sized up to hold the whole hero. */}
        <div className="relative max-w-[1500px] mx-auto bg-white p-2.5 sm:p-3 rounded-sm border border-kawai-black/10 shadow-[0_24px_60px_rgba(30,27,22,0.16),0_6px_16px_rgba(30,27,22,0.08)]">
          <div className="relative overflow-hidden rounded-[2px] bg-kawai-black">

            <HeroVideoBackground />

            <div className="relative z-10 px-6 sm:px-10 lg:px-16 pt-14 pb-16 md:pt-20 md:pb-24">
              <div className="max-w-2xl">

                {/* Storefront lockup — the campaign is run by a named showroom, so
                    the wordmark and the location sign the page before the headline
                    does. The red PNG is knocked out to white for the dark ground. */}
                <div className="bts-r1 flex items-center gap-3.5 mb-6">
                  <Image
                    src="/images/logos/kawai-logo-new-red.png"
                    alt="Kawai"
                    width={1030}
                    height={207}
                    className="h-[22px] w-auto brightness-0 invert"
                    priority
                  />
                  {locationName ? (
                    <>
                      <span className="w-px h-5 bg-kawai-pearl/30" aria-hidden />
                      <span
                        className="text-kawai-pearl uppercase"
                        style={{
                          fontFamily: 'var(--font-oswald), sans-serif',
                          fontSize: '0.8rem',
                          letterSpacing: '0.2em',
                        }}
                      >
                        {locationName}
                      </span>
                    </>
                  ) : null}
                </div>

                {/* The eyebrow matches the red-dash pattern every other section uses. */}
                <div className="bts-r1 flex items-center gap-3 mb-8">
                  <span className="w-6 h-px bg-kawai-red-400" aria-hidden />
                  <span
                    className="text-kawai-pearl/75 uppercase"
                    style={{
                      fontFamily: 'var(--font-oswald), sans-serif',
                      fontSize: '0.75rem',
                      letterSpacing: '0.22em',
                    }}
                  >
                    {DATE_RANGE}
                  </span>
                </div>

                <h1
                  className="bts-r2 text-kawai-pearl uppercase leading-[0.86]"
                  style={{
                    fontFamily: 'var(--font-oswald), sans-serif',
                    fontSize: 'clamp(3.2rem, 8vw, 6.2rem)',
                    letterSpacing: '-0.005em',
                  }}
                >
                  Back to
                  <br />
                  School
                  <span
                    className="block text-kawai-red-400 mt-4"
                    style={{
                      fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)',
                      letterSpacing: '0.22em',
                    }}
                  >
                    Piano Sale Event
                  </span>
                </h1>

                {/* The invitation, not the transaction — the offer ledger below and
                    the closing sentence carry the sale's terms and its standing. */}
                <p
                  className="bts-r3 text-kawai-pearl/85 italic mt-6 max-w-md leading-snug"
                  style={{
                    fontFamily: 'var(--font-brand-serif)',
                    fontSize: 'clamp(1.25rem, 2.2vw, 1.6rem)',
                  }}
                >
                  Come sit down at one. We&apos;ll have them tuned and uncovered for you.
                </p>

                {/* Booking sits directly under the title — the offers below are the
                    argument for it, not the gate in front of it. */}
                <div className="bts-r4 mt-9">
                  <HeroCtas
                    storeslug={storeslug}
                    locationName={locationName ?? null}
                    hours={hours ?? null}
                    tone="dark"
                  />
                </div>

                {/* Offers — ruled rows rather than cards, so they sit on the paper.
                    They back the CTA above: the numbers are the argument. */}
                {/* The value stays readable text rather than aria-hidden decoration, so
                    a screen reader gets "0% — Financing — 36 months, no interest" in
                    one pass instead of the value twice. */}
                <ul className="bts-r5 mt-10 border-t border-kawai-pearl/20 max-w-lg">
                  {OFFERS.map(({ value, label, detail }) => (
                    <li
                      key={label}
                      className="flex items-baseline gap-4 sm:gap-6 py-3.5 border-b border-kawai-pearl/20"
                    >
                      <span
                        className="text-kawai-red-400 flex-shrink-0 w-[4.5rem] sm:w-[5.5rem] leading-none"
                        style={{
                          fontFamily: 'var(--font-oswald), sans-serif',
                          fontSize: 'clamp(1.35rem, 2.4vw, 1.75rem)',
                          letterSpacing: '0.01em',
                        }}
                      >
                        {value}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-kawai-pearl text-[0.7rem] tracking-[0.18em] uppercase font-semibold">
                          {label}
                        </span>
                        <span className="block text-kawai-pearl/70 text-sm mt-0.5">{detail}</span>
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="bts-r5 text-kawai-pearl/80 text-base leading-relaxed mt-6 max-w-lg">
                  Every Kawai in the September rebate program comes down at the counter — up to
                  $4,500 off — and pairs with 0% financing for 36 months. Trade in the piano you
                  have and we&apos;ll beat any independent appraisal by $500.
                  {locationName ? (
                    <> All of it, in person at the official Kawai {locationName} showroom.</>
                  ) : (
                    <> All of it, in person at the official Kawai showroom.</>
                  )}
                </p>

              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
