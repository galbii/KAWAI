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

/**
 * Entrance choreography. The order is the argument: the print is laid down, the
 * footage settles behind it, then the copy arrives in reading order — signature,
 * dates, headline, invitation, the ask, and only then the terms.
 *
 * Everything animates on transform / opacity / clip-path so nothing reflows
 * mid-entrance. Reduced motion needs no guard here: globals.css collapses every
 * animation to 0.01ms, and each keyframe below ends on its resting state with
 * `both`, so those users get the finished hero immediately.
 */
const T = {
  frame: '0s',
  lockup: '0.30s',
  divider: '0.36s',
  dash: '0.40s',
  date: '0.44s',
  line1: '0.50s',
  line2: '0.60s',
  eventLine: '0.76s',
  subhead: '0.88s',
  cta: '1.00s',
  /** Offer rows stagger from here, one every 80ms. */
  offers: 1.1,
  terms: '1.42s',
} as const

export function BackToSchoolHero({ storeslug, locationName, hours }: BackToSchoolHeroProps) {
  // Same cleanup the header lockup does (src/components/ui/kawai-logo.tsx): the
  // wordmark already carries "Kawai", so a stored name like "Kawai St. Louis"
  // or "St. Louis Piano Gallery" must not double-brand next to it.
  const storeName = (locationName ?? '')
    .replace(/PIANO GALLERY/gi, '')
    .replace(/KAWAI/gi, '')
    .trim()
    .toUpperCase()

  return (
    <>
      <style>{`
        /* The print being set down on the page. */
        @keyframes bts-frame-in {
          from { opacity: 0; transform: translateY(20px) scale(0.988); }
          to   { opacity: 1; transform: none; }
        }
        /* Copy arriving. Short travel — the type is large, so a long rise reads
           as drift rather than intent. */
        @keyframes bts-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: none; }
        }
        /* Headline lines rise into view from their own baseline rather than
           fading: condensed display caps read better revealed than dissolved.
           The end state insets negatively so nothing clips the glyphs once the
           reveal has finished. */
        @keyframes bts-line-up {
          from { opacity: 0; clip-path: inset(100% 0 0 0); transform: translateY(0.24em); }
          to   { opacity: 1; clip-path: inset(-30% -30% -30% -30%); transform: none; }
        }
        /* Rules and dividers draw themselves, echoing the pen-on-paper motif the
           rest of the page is built on. */
        @keyframes bts-draw-x { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes bts-draw-y { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        /* Tracking settling inward — the sub-title looks like it is being set. */
        @keyframes bts-track-in {
          from { opacity: 0; letter-spacing: 0.62em; }
          to   { opacity: 1; letter-spacing: 0.22em; }
        }

        .bts-frame  { animation: bts-frame-in 0.85s cubic-bezier(0.22,1,0.36,1) both; }
        .bts-fade   { animation: bts-fade-up 0.8s cubic-bezier(0.22,0.61,0.36,1) both; }
        .bts-line   { display: block; animation: bts-line-up 0.95s cubic-bezier(0.16,1,0.3,1) both; }
        .bts-drawx  { transform-origin: left center; animation: bts-draw-x 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .bts-drawy  { transform-origin: center; animation: bts-draw-y 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .bts-track  { animation: bts-track-in 1s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      <section className="relative overflow-hidden bg-kawai-pearl px-3 sm:px-6 lg:px-8 py-3 sm:py-6 lg:py-8">

        <RuledGround marginRule={false} />

        {/* The print frame — same white margin, hairline and shadow the smaller
            panel carried, sized up to hold the whole hero. */}
        <div
          className="bts-frame relative max-w-[1500px] mx-auto bg-white p-2.5 sm:p-3 rounded-sm border border-kawai-black/10 shadow-[0_24px_60px_rgba(30,27,22,0.16),0_6px_16px_rgba(30,27,22,0.08)]"
          style={{ animationDelay: T.frame }}
        >
          <div className="relative overflow-hidden rounded-[2px] bg-kawai-black">

            <HeroVideoBackground />

            <div className="relative z-10 px-6 sm:px-10 lg:px-16 pt-14 pb-16 md:pt-20 md:pb-24">
              <div className="max-w-2xl">

                {/* Storefront lockup — the campaign is run by a named showroom, so
                    the wordmark and the location sign the page before the headline
                    does. The red PNG is knocked out to white for the dark ground. */}
                <div className="flex items-center gap-3 sm:gap-3.5 mb-7">
                  <Image
                    src="/images/logos/kawai-logo-new-red.png"
                    alt="Kawai"
                    width={1030}
                    height={207}
                    className="bts-fade h-[30px] sm:h-[34px] w-auto brightness-0 invert"
                    style={{ animationDelay: T.lockup }}
                    priority
                  />
                  {storeName ? (
                    <>
                      <span
                        className="bts-drawy w-px h-9 bg-kawai-pearl/25"
                        style={{ animationDelay: T.divider }}
                        aria-hidden
                      />
                      {/* Type copied from the header's storefront lockup so the
                          campaign signs itself the same way every store page does. */}
                      <div className="bts-fade" style={{ animationDelay: T.lockup }}>
                        <div className="font-bold tracking-wide whitespace-nowrap text-base text-kawai-pearl">
                          {storeName}
                        </div>
                        <div className="-mt-1 tracking-widest font-medium whitespace-nowrap text-xs text-kawai-pearl/65">
                          Official Storefront
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>

                {/* The eyebrow matches the red-dash pattern every other section uses. */}
                <div className="flex items-center gap-3 mb-8">
                  <span
                    className="bts-drawx w-6 h-px bg-kawai-red-400"
                    style={{ animationDelay: T.dash }}
                    aria-hidden
                  />
                  <span
                    className="bts-fade text-kawai-pearl/75 uppercase"
                    style={{
                      fontFamily: 'var(--font-oswald), sans-serif',
                      fontSize: '0.75rem',
                      letterSpacing: '0.22em',
                      animationDelay: T.date,
                    }}
                  >
                    {DATE_RANGE}
                  </span>
                </div>

                <h1
                  className="text-kawai-pearl uppercase leading-[0.86]"
                  style={{
                    fontFamily: 'var(--font-oswald), sans-serif',
                    fontSize: 'clamp(3.2rem, 8vw, 6.2rem)',
                    letterSpacing: '-0.005em',
                  }}
                >
                  <span className="bts-line" style={{ animationDelay: T.line1 }}>
                    Back to
                  </span>
                  <span className="bts-line" style={{ animationDelay: T.line2 }}>
                    School
                  </span>
                  <span
                    className="bts-track block text-kawai-red-400 mt-4"
                    style={{
                      fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)',
                      animationDelay: T.eventLine,
                    }}
                  >
                    Piano Sale Event
                  </span>
                </h1>

                {/* The invitation, not the transaction — the offer ledger below and
                    the closing sentence carry the sale's terms and its standing. */}
                <p
                  className="bts-fade text-kawai-pearl/85 italic mt-6 max-w-md leading-snug"
                  style={{
                    fontFamily: 'var(--font-brand-serif)',
                    fontSize: 'clamp(1.25rem, 2.2vw, 1.6rem)',
                    animationDelay: T.subhead,
                  }}
                >
                  Come sit down at one. We&apos;ll have them tuned and uncovered for you.
                </p>

                {/* Booking sits directly under the title — the offers below are the
                    argument for it, not the gate in front of it. */}
                <div className="bts-fade mt-9" style={{ animationDelay: T.cta }}>
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
                <ul className="mt-10 border-t border-kawai-pearl/20 max-w-lg">
                  {OFFERS.map(({ value, label, detail }, i) => (
                    <li
                      key={label}
                      className="bts-fade flex items-baseline gap-4 sm:gap-6 py-3.5 border-b border-kawai-pearl/20"
                      style={{ animationDelay: `${T.offers + i * 0.08}s` }}
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

                <p
                  className="bts-fade text-kawai-pearl/80 text-base leading-relaxed mt-6 max-w-lg"
                  style={{ animationDelay: T.terms }}
                >
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
