import Image from 'next/image'
import {
  HeroVideoBackground,
  HeroParallax,
  BTS_CONTAINER,
  CAMPAIGN_FILM,
} from '@/components/back-to-school'
import { heroPoster, offerRail } from './campaign'
import { aboutImages } from './images'
import { HeroCtas } from './CampaignCtas'

interface HeroPosterProps {
  /** 'cad' swaps the rail's rebate ceiling to the Canadian program figure. */
  site?: 'us' | 'cad'
}

/**
 * The hero is the poster; everything below it is the program notes.
 *
 * The brand leads the poster: the KAWAI logotype at poster scale is the title,
 * with "Back to School" set one line under it at a clearly smaller size and the
 * event name outlined below that, the way a sale poster outlines its event
 * name. Three figures run edge to edge along the bottom as a rail. The footage
 * plays bare — no scrims — so the frame belongs to the film and the lockup.
 * The rail states the national offer, and the CTAs open the dealer sign-up
 * popup instead of a store booking calendar.
 *
 * Server-rendered so the headline is in the initial HTML. Client JS is limited
 * to the video (playback + drift), the parallax wrapper, and the CTA pair.
 *
 * Red type on the footage is kawai-red-400, never brand red: brand red on a
 * dark ground is ~3.6:1 and fails AA (see the Accessibility notes in CLAUDE.md).
 */

/**
 * Entrance choreography. The order is the argument: the dates, then the logo,
 * the campaign line, the event name, then the invitation, the rail, and last
 * the ask.
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
      {/* The clip runs bare — no scrims, no colour treatment — so the footage
          carries the frame and the logo lockup sits directly on it. */}
      <HeroVideoBackground
        src={CAMPAIGN_FILM}
        poster={aboutImages.soundboard}
        filter="none"
        overlay={false}
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

            {/* The brand leads: the KAWAI logotype at poster scale is the title.
                Decorative here — the sr-only line above already says "Kawai".
                A logo is exempt from 1.4.3, so it can sit on the bare footage. */}
            <span aria-hidden className="bts-in block" style={{ animationDelay: T.line1 }}>
              <Image
                src="/images/logos/kawai-logo-new-red.png"
                alt=""
                width={1030}
                height={207}
                priority
                quality={90}
                sizes="(max-width: 768px) 88vw, 680px"
                className="object-contain h-auto"
                style={{ width: 'clamp(280px, 62vw, 680px)' }}
              />
            </span>

            {/* The campaign under the brand, one line, well below logo scale. */}
            <span
              aria-hidden
              className="bts-inline mt-4 sm:mt-5"
              style={{ fontSize: 'clamp(1.9rem, 5.8vw, 4.4rem)', animationDelay: T.line2 }}
            >
              {heroPoster.headlineLead} {heroPoster.headlineFigure}
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
            CTA above them, so they get the full width rather than a column.

            Two layouts, because a third of the container is not a third of a
            phone. On phones each cell is a full-width row — figure left, words
            right — which stays compact under an already tall poster. From `sm`
            the cells become columns and the figure sits ON its label rather
            than beside it: side by side, a cell at the 640–900px range is only
            ~150px wide and a figure like "Up to $4,500" eats the whole of it,
            leaving the label nowhere to go. */}
        <div className="w-full border-t border-kawai-pearl/25 bg-[rgba(18,16,13,0.55)] backdrop-blur-[2px]">
          <ul className={`${BTS_CONTAINER} grid grid-cols-1 sm:grid-cols-3`}>
            {rail.map((cell, i) => (
              <li
                key={cell.label}
                className="bts-in flex items-baseline gap-4 sm:block py-3.5 sm:py-5 sm:px-6 sm:first:pl-0 sm:last:pr-0 border-b sm:border-b-0 sm:border-r last:border-b-0 sm:last:border-r-0 border-kawai-pearl/15"
                style={{ animationDelay: `${T.rail + i * 0.09}s` }}
              >
                <span
                  className="bts-num block text-kawai-red-400 leading-none flex-shrink-0 whitespace-nowrap"
                  style={{ fontSize: 'clamp(1.7rem, 2.9vw, 2.6rem)' }}
                >
                  {/* Set at 0.42em so the qualifier is legible and adjacent but
                      never competes with the figure it qualifies. */}
                  {'prefix' in cell && (
                    <span
                      className="mr-[0.35em] align-baseline tracking-[0.12em] uppercase opacity-80"
                      style={{ fontSize: '0.42em' }}
                    >
                      {cell.prefix}
                    </span>
                  )}
                  {cell.value}
                </span>
                <span className="min-w-0 sm:mt-3 sm:block">
                  <span className="block bts-eyebrow text-kawai-pearl">{cell.label}</span>
                  <span className="block text-kawai-pearl/60 text-sm mt-1 leading-snug">
                    {cell.detail}
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
