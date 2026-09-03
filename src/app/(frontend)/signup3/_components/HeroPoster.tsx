import Image from 'next/image'
import { HeroVideoBackground, HeroParallax, BTS_CONTAINER } from '@/components/back-to-school'
import { heroPoster, offerRail } from './campaign'
import { aboutImages } from './images'
import { HeroCtas } from './CampaignCtas'

/** Summer-savings background film (R2). Poster + scrims guarantee legible copy. */
const HERO_VIDEO =
  'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/summersavingsbackground.mp4'

interface HeroPosterProps {
  /** 'cad' swaps the rail's rebate ceiling to the Canadian program figure. */
  site?: 'us' | 'cad'
}

/**
 * The hero is the poster; everything below it is the program notes.
 *
 * Same poster as the Back to School hero — full bleed, full height, the title
 * set at poster scale in condensed caps with the third line outlined the way a
 * sale poster outlines its event name, and three figures running edge to edge
 * along the bottom as a rail. It carries the same campaign title and dates; what
 * differs is that this page has no storefront behind it, so the poster starts on
 * the dates rather than a store lockup, the rail states the national offer, and
 * the CTAs open the dealer sign-up popup instead of a store booking calendar.
 *
 * Server-rendered so the headline is in the initial HTML. Client JS is limited
 * to the video (playback + drift), the parallax wrapper, and the CTA pair.
 *
 * Red type on the footage is kawai-red-400, never brand red: brand red on a
 * dark ground is ~3.6:1 and fails AA (see the Accessibility notes in CLAUDE.md).
 */

/**
 * Entrance choreography. The order is the argument: the dates, then the title
 * one line at a time, then the invitation, the rail, and last the ask.
 *
 * Everything animates on transform / opacity / clip-path so nothing reflows
 * mid-entrance. The keyframes live in the shared CampaignStyles.
 */
const T = {
  dash: '0.20s',
  eyebrow: '0.26s',
  line1: '0.34s',
  line2: '0.48s',
  line3: '0.66s',
  sub: '0.82s',
  /** Rail cells stagger from here, one every 90ms. */
  rail: 0.98,
  /** After the rail it backs — the ask closes the sequence. */
  cta: '1.32s',
} as const

export function HeroPoster({ site = 'us' }: HeroPosterProps) {
  const rail = offerRail(site)

  return (
    <section className="relative flex flex-col min-h-[92svh] bg-kawai-black overflow-hidden">
      {/* Unlike the Back to School stage footage this clip is a sunlit room, so
          it takes no brightness lift and a heavier base scrim — the title sits
          in the middle band, which the gradients barely reach. */}
      <HeroVideoBackground
        src={HERO_VIDEO}
        poster={aboutImages.soundboard}
        filter="brightness(0.82) contrast(1.05) saturate(0.95)"
        baseScrim={0.52}
      />

      <HeroParallax>
        <div className="flex-1 min-h-[1rem] pt-16" aria-hidden />

        {/* ── Poster ── */}
        <div className={`${BTS_CONTAINER} w-full pb-7 md:pb-10`}>
          <div className="flex items-center gap-3 mb-6">
            <span
              className="bts-drawx w-10 h-px bg-kawai-red-400"
              style={{ animationDelay: T.dash }}
              aria-hidden
            />
            <span
              className="bts-in bts-eyebrow text-kawai-pearl/80"
              style={{ animationDelay: T.eyebrow }}
            >
              {heroPoster.eyebrow}
            </span>
          </div>

          <h1 className="bts-display text-kawai-pearl">
            <span className="sr-only">{heroPoster.a11yHeadline}</span>

            <span
              aria-hidden
              className="bts-inline"
              style={{ fontSize: 'clamp(2.9rem, 10.5vw, 8.6rem)', animationDelay: T.line1 }}
            >
              {heroPoster.headlineLead}
            </span>
            <span
              aria-hidden
              className="bts-inline"
              style={{ fontSize: 'clamp(2.9rem, 10.5vw, 8.6rem)', animationDelay: T.line2 }}
            >
              {heroPoster.headlineFigure}
            </span>
            {/* Outlined, the way a sale poster outlines the event name under the
                title. Large display type only — a hairline stroke at body size
                would not hold its contrast. */}
            <span
              aria-hidden
              className="bts-wipe bts-outline block text-kawai-red-400 mt-3 sm:mt-4"
              style={{
                fontSize: 'clamp(1.35rem, 4.6vw, 3.4rem)',
                letterSpacing: '0.01em',
                animationDelay: T.line3,
              }}
            >
              {heroPoster.headlineTail}
            </span>
          </h1>

          <p
            className="bts-in bts-serif text-kawai-pearl/85 mt-5 max-w-xl leading-snug"
            style={{ fontSize: 'clamp(1.15rem, 2vw, 1.5rem)', animationDelay: T.sub }}
          >
            {heroPoster.sub}
          </p>

        </div>

        {/* ── Offer rail ──
            Edge to edge under the poster: the numbers are the argument for the
            CTA above them, so they get the full width rather than a column. */}
        <div className="w-full border-t border-kawai-pearl/25 bg-[rgba(18,16,13,0.55)] backdrop-blur-[2px]">
          <ul className={`${BTS_CONTAINER} grid grid-cols-1 sm:grid-cols-3`}>
            {rail.map(({ value, label, detail }, i) => (
              <li
                key={label}
                className="bts-in flex items-baseline gap-4 py-3.5 sm:py-5 sm:px-6 sm:first:pl-0 sm:last:pr-0 border-b sm:border-b-0 sm:border-r last:border-b-0 sm:last:border-r-0 border-kawai-pearl/15"
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
        <div className={`${BTS_CONTAINER} w-full pt-6 pb-8 md:pb-12`}>
          <div className="bts-in" style={{ animationDelay: T.cta }}>
            <HeroCtas tone="dark" />
          </div>
        </div>
      </HeroParallax>
    </section>
  )
}
