import { RuledGround, BTS_CONTAINER } from './RuledGround'
import { CampaignStyles, CampaignNoScript } from './CampaignStyles'
import { Reveal } from './Choreography'
import { DATE_RANGE, DEADLINE_LONG, OFFERS, daysUntilDeadline } from './campaign'
import { PromoCtas } from './PromoCtas'
import type { HoursEntry } from './schedule'

interface BackToSchoolPromoProps {
  storeslug: string
  locationName?: string | null
  hours?: HoursEntry[] | null
}

/**
 * The Back to School promo on the storefront home page — sits directly under
 * the news carousel.
 *
 * Drawn as a smaller printing of the campaign page's own poster: the same
 * inverted ground, the same condensed title with the event name outlined under
 * it, and the same offer rail running edge to edge. A visitor who clicks
 * through should land somewhere that looks like where they came from, and on a
 * page of pearl sections the dark band is also the thing that stops the scroll.
 *
 * The campaign page is the primary action — the visitor hasn't seen the offer
 * yet, so "Learn more" leads — with booking beside it for the already-decided.
 *
 * Server component; renders nothing once the program ends (ISR re-renders
 * within the hour, so the section survives at most one stale window past
 * Sept 30). It carries its own <CampaignStyles> because this is the only place
 * the campaign's type scale appears outside the campaign page.
 */
export function BackToSchoolPromo({ storeslug, locationName, hours }: BackToSchoolPromoProps) {
  if (daysUntilDeadline() <= 0) return null

  // "Kawai" is written out beside it, so a stored name like "Kawai Denver" or
  // "Denver Piano Gallery" must not repeat it.
  const cleanedName = (locationName ?? '')
    .replace(/piano gallery/gi, '')
    .replace(/kawai/gi, '')
    .trim()

  return (
    <section
      className="relative bg-kawai-black overflow-hidden"
      aria-label="Back to School Piano Sale"
    >
      <CampaignStyles />
      <CampaignNoScript />
      <RuledGround tone="dark" animate />

      <div className={`relative ${BTS_CONTAINER} pt-16 md:pt-24 pb-10 md:pb-14`}>
        <div className="flex items-center gap-3.5 mb-6">
          <Reveal as="span" variant="ruleX" className="w-10 h-px bg-kawai-red-400" aria-hidden />
          <Reveal as="span" delay={0.08} className="bts-eyebrow text-kawai-pearl/80">
            {cleanedName ? `Kawai ${cleanedName} · ${DATE_RANGE}` : DATE_RANGE}
          </Reveal>
        </div>

        <h2 className="bts-display text-kawai-pearl">
          <Reveal
            as="span"
            variant="line"
            className="block"
            style={{ fontSize: 'clamp(2.5rem, 7.5vw, 5.6rem)' }}
          >
            Back to School
          </Reveal>
          <Reveal
            as="span"
            variant="wipe"
            delay={0.16}
            className="bts-outline block text-kawai-red-400 mt-3"
            style={{ fontSize: 'clamp(1.05rem, 3.2vw, 2.2rem)', letterSpacing: '0.01em' }}
          >
            Piano Sale Event
          </Reveal>
        </h2>

        <Reveal
          as="p"
          delay={0.24}
          className="bts-serif text-kawai-pearl/85 mt-6 max-w-xl leading-snug"
          style={{ fontSize: 'clamp(1.15rem, 2vw, 1.5rem)' }}
        >
          Come sit down at one. We&apos;ll have them tuned and uncovered for you.
        </Reveal>
      </div>

      {/* Offer rail — the same edge-to-edge treatment the campaign hero uses. */}
      <div className="relative w-full border-t border-kawai-pearl/25">
        <ul className={`${BTS_CONTAINER} grid grid-cols-1 sm:grid-cols-3`}>
          {OFFERS.map(({ value, label, detail }, i) => (
            <Reveal
              as="li"
              key={label}
              delay={i * 0.08}
              className="flex items-baseline gap-4 py-4 sm:py-7 sm:px-6 sm:first:pl-0 sm:last:pr-0 border-b sm:border-b-0 sm:border-r last:border-b-0 sm:last:border-r-0 border-kawai-pearl/15"
            >
              <span
                className="bts-num text-kawai-red-400 leading-none flex-shrink-0"
                style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.9rem)' }}
              >
                {value}
              </span>
              <span className="min-w-0">
                <span className="block bts-eyebrow text-kawai-pearl">{label}</span>
                <span className="block text-kawai-pearl/60 text-sm mt-1 leading-snug">{detail}</span>
              </span>
            </Reveal>
          ))}
        </ul>
      </div>

      <div className={`relative ${BTS_CONTAINER} pt-8 pb-16 md:pb-20`}>
        <Reveal delay={0.1}>
          <PromoCtas storeslug={storeslug} locationName={locationName ?? null} hours={hours ?? null} />
        </Reveal>

        <Reveal as="p" delay={0.18} className="bts-eyebrow text-kawai-pearl/45 mt-6">
          Rebates end {DEADLINE_LONG}
        </Reveal>
      </div>
    </section>
  )
}
