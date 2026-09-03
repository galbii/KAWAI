import type { CSSProperties } from 'react'
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
        <div className="flex-1 min-h-[1rem] pt-12 md:pt-16" aria-hidden />

        {/* ── Poster ── */}
        <div className={`${BTS_CONTAINER} w-full pb-6 md:pb-9`}>
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
              style={{ fontSize: 'clamp(2.8rem, 9.9vw, 8.4rem)', animationDelay: T.line1 }}
            >
              Back to
            </span>
            <span
              className="bts-inline"
              style={{ fontSize: 'clamp(2.8rem, 9.9vw, 8.4rem)', animationDelay: T.line2 }}
            >
              School
            </span>
            {/* The event name as a neon sign under the title — outlined type is
                already a glass tube, so it only wanted lighting. Large display
                sizes only: a hairline stroke at body size holds no contrast.

                Two spans because each carries an animation of its own — the
                outer one wipes the line on, the inner one is the tube and its
                flicker. The wipe's clip is inset negatively top and bottom so
                it never cuts the glyphs or the glow coming off them. */}
            <span
              className="bts-wipe block mt-3 sm:mt-4"
              style={{ animationDelay: T.line3 }}
            >
              <span
                className="bts-neon block text-kawai-red-400"
                style={
                  {
                    fontSize: 'clamp(1.35rem, 4.6vw, 3.5rem)',
                    letterSpacing: '0.01em',
                    // The tube strikes on the same cue that wipes it on.
                    ['--bts-neon-delay' as string]: T.line3,
                  } as CSSProperties
                }
              >
                Piano Sale Event
              </span>
            </span>
          </h1>

          <p
            className="bts-in bts-serif text-kawai-pearl/85 mt-5 max-w-xl leading-snug"
            style={{ fontSize: 'clamp(1.2rem, 2vw, 1.55rem)', animationDelay: T.subhead }}
          >
            Book an appointment and visit our official Kawai {storeName} location.
          </p>
        </div>

        {/* ── Offer rail ──
            Edge to edge under the poster: the numbers are the argument for the
            CTA above them, so they get the full width rather than a column. */}
        <div className="w-full border-t border-kawai-pearl/25 bg-[rgba(18,16,13,0.55)] backdrop-blur-[2px]">
          {/* Each cell stacks — qualifier, figure, label, detail — so the three
              read as one row of columns. Set side by side, a narrow figure
              ("0%") and a wide one ("$4,500") start their labels at different
              offsets and the rail looks broken. */}
          <ul className={`${BTS_CONTAINER} grid grid-cols-1 sm:grid-cols-3`}>
            {OFFERS.map(({ prefix, value, label, detail }, i) => (
              <li
                key={label}
                className="bts-in flex flex-col py-4 sm:py-5 sm:px-6 sm:first:pl-0 sm:last:pr-0 border-b sm:border-b-0 sm:border-r last:border-b-0 sm:last:border-r-0 border-kawai-pearl/15"
                style={{ animationDelay: `${T.rail + i * 0.09}s` }}
              >
                {/* Reserved whether or not this cell has a qualifier, so the
                    three figures sit on one line across the rail. */}
                <span className="bts-eyebrow block text-kawai-pearl/45 min-h-[1.05rem]">
                  {prefix ?? ''}
                </span>
                <span
                  className="bts-num block text-kawai-red-400 leading-none mt-1"
                  style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.9rem)' }}
                >
                  {value}
                </span>
                <span className="block bts-eyebrow text-kawai-pearl mt-3.5">{label}</span>
                <span className="block text-kawai-pearl/60 text-sm mt-1.5 leading-snug">
                  {detail}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* The ask sits under the numbers, not above them: the rail is the
            argument, so it gets read first and the buttons close it. */}
        <div className={`${BTS_CONTAINER} w-full pt-6 pb-8 md:pb-10`}>
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
