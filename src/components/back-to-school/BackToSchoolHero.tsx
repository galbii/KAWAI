import { HeroVideoBackground } from './HeroVideoBackground'
import { HeroParallax } from './HeroParallax'
import { DATE_RANGE, OFFERS } from './campaign'
import { BTS_CONTAINER } from './RuledGround'
import { HeroCtas } from './HeroCtas'
import type { HoursEntry } from './schedule'

interface BackToSchoolHeroProps {
  storeslug: string
  locationName?: string | null
  hours?: HoursEntry[] | null
}

/**
 * The hero is the poster; everything below it is the program notes.
 *
 * The earlier version framed the footage inside a white print with a margin, so
 * the hero was one more sheet on the ruled page. This one goes full bleed and
 * full height: the title is set at poster scale in condensed caps, the third
 * line is outlined the way a sale poster outlines its event name, and the three
 * offers run edge to edge along the bottom as a rail rather than a list tucked
 * beside the copy. The paper picks up again at the section below.
 *
 * Server-rendered so the headline is in the initial HTML. Client JS is limited
 * to the video (playback + drift), the scroll parallax wrapper, and the booking
 * CTA.
 *
 * Red type on the footage is kawai-red-400, never brand red: brand red on a
 * dark ground is ~3.6:1 and fails AA (see the Accessibility notes in CLAUDE.md).
 */

/**
 * Entrance choreography. The order is the argument: the dates, then the title
 * one line at a time, then the invitation, the ask, and last the terms.
 *
 * Everything animates on transform / opacity / clip-path so nothing reflows
 * mid-entrance. The keyframes live in CampaignStyles.
 */
const T = {
  dash: '0.20s',
  date: '0.26s',
  line1: '0.34s',
  line2: '0.48s',
  line3: '0.66s',
  subhead: '0.82s',
  /** Rail cells stagger from here, one every 90ms. */
  rail: 0.94,
  /** After the rail it backs — the ask closes the sequence. */
  cta: '1.28s',
} as const

export function BackToSchoolHero({ storeslug, locationName, hours }: BackToSchoolHeroProps) {
  // "Kawai" is written out beside it in both places this is used, so a stored
  // name like "Kawai Denver" or "Denver Piano Gallery" must not repeat it.
  const cleanedName = (locationName ?? '')
    .replace(/piano gallery/gi, '')
    .replace(/kawai/gi, '')
    .trim()
  const storeName = cleanedName || 'showroom'

  return (
    <section className="relative flex flex-col min-h-[92svh] bg-kawai-black overflow-hidden">
      <HeroVideoBackground />

      <HeroParallax>
        {/* The site header two inches above already signs the page with the
            same storefront lockup, so the poster starts on the dates. */}
        <div className="flex-1 min-h-[2rem] pt-24" aria-hidden />

        {/* ── Poster ── */}
        <div className={`${BTS_CONTAINER} w-full pb-9 md:pb-12`}>
          <div className="flex items-center gap-3 mb-6">
            <span
              className="bts-drawx w-10 h-px bg-kawai-red-400"
              style={{ animationDelay: T.dash }}
              aria-hidden
            />
            {/* The storefront signs the poster here, at eyebrow size, rather
                than as a second full lockup under the header's. */}
            <span
              className="bts-in bts-eyebrow text-kawai-pearl/80"
              style={{ animationDelay: T.date }}
            >
              {cleanedName ? `Kawai ${cleanedName} · ${DATE_RANGE}` : DATE_RANGE}
            </span>
          </div>

          <h1 className="bts-display text-kawai-pearl">
            <span
              className="bts-inline"
              style={{ fontSize: 'clamp(3.1rem, 12.5vw, 10.5rem)', animationDelay: T.line1 }}
            >
              Back to
            </span>
            <span
              className="bts-inline"
              style={{ fontSize: 'clamp(3.1rem, 12.5vw, 10.5rem)', animationDelay: T.line2 }}
            >
              School
            </span>
            {/* Outlined, the way a sale poster outlines the event name under the
                title. Large display type only — a hairline stroke at body size
                would not hold its contrast. */}
            <span
              className="bts-wipe bts-outline block text-kawai-red-400 mt-3 sm:mt-4"
              style={{
                fontSize: 'clamp(1.35rem, 4.6vw, 3.5rem)',
                letterSpacing: '0.01em',
                animationDelay: T.line3,
              }}
            >
              Piano Sale Event
            </span>
          </h1>

          <p
            className="bts-in bts-serif text-kawai-pearl/85 mt-7 max-w-xl leading-snug"
            style={{ fontSize: 'clamp(1.3rem, 2.3vw, 1.75rem)', animationDelay: T.subhead }}
          >
            Book an appointment and visit our official Kawai {storeName} location.
          </p>
        </div>

        {/* ── Offer rail ──
            Edge to edge under the poster: the numbers are the argument for the
            CTA above them, so they get the full width rather than a column. */}
        <div className="w-full border-t border-kawai-pearl/25 bg-[rgba(18,16,13,0.55)] backdrop-blur-[2px]">
          <ul className={`${BTS_CONTAINER} grid grid-cols-1 sm:grid-cols-3`}>
            {OFFERS.map(({ value, label, detail }, i) => (
              <li
                key={label}
                className="bts-in flex items-baseline gap-4 py-4 sm:py-7 sm:px-6 sm:first:pl-0 sm:last:pr-0 border-b sm:border-b-0 sm:border-r last:border-b-0 sm:last:border-r-0 border-kawai-pearl/15"
                style={{ animationDelay: `${T.rail + i * 0.09}s` }}
              >
                <span
                  className="bts-num text-kawai-red-400 leading-none flex-shrink-0"
                  style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.9rem)' }}
                >
                  {value}
                </span>
                <span className="min-w-0">
                  <span className="block bts-eyebrow text-kawai-pearl">{label}</span>
                  <span className="block text-kawai-pearl/60 text-sm mt-1 leading-snug">
                    {detail}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* The ask sits under the numbers, not above them: the rail is the
            argument, so it gets read first and the buttons close it. */}
        <div className={`${BTS_CONTAINER} w-full pt-8 pb-10 md:pb-14`}>
          <div className="bts-in" style={{ animationDelay: T.cta }}>
            <HeroCtas
              storeslug={storeslug}
              locationName={locationName ?? null}
              hours={hours ?? null}
              tone="dark"
            />
          </div>
        </div>
      </HeroParallax>
    </section>
  )
}
