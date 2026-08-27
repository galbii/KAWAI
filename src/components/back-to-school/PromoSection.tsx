import { RuledGround } from './RuledGround'
import { DATE_RANGE, DEADLINE_LONG, OFFERS, daysUntilDeadline } from './campaign'
import { PromoCtas } from './PromoCtas'
import type { HoursEntry } from './schedule'

interface BackToSchoolPromoProps {
  storeslug: string
  locationName?: string | null
  hours?: HoursEntry[] | null
}

/**
 * The Back to School promo section on the storefront home page — sits directly
 * under the hero carousel. Booking is the primary CTA (opens the campaign
 * booking modal in place); the campaign page is the secondary link. Drawn in
 * the campaign's practice-paper language so the click-through lands somewhere
 * that looks like where the visitor came from.
 *
 * Server component; renders nothing once the program ends (ISR re-renders
 * within the hour, so the section survives at most one stale window past
 * Sept 30).
 */
export function BackToSchoolPromo({ storeslug, locationName, hours }: BackToSchoolPromoProps) {
  if (daysUntilDeadline() <= 0) return null

  return (
    <section
      className="relative bg-kawai-pearl overflow-hidden border-y border-kawai-black/10"
      aria-label="Back to School Piano Sale"
    >
      <RuledGround />

      <div className="relative max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 py-16 md:py-24 flex flex-col items-center text-center">

        {/* Eyebrow — the campaign page's red-dash pattern */}
        <div className="flex items-center gap-3 mb-6">
          <span className="w-6 h-px bg-kawai-red" aria-hidden />
          <span
            className="text-kawai-charcoal/55 uppercase"
            style={{ fontFamily: 'var(--font-oswald), sans-serif', fontSize: '0.75rem', letterSpacing: '0.22em' }}
          >
            {DATE_RANGE}
          </span>
          <span className="w-6 h-px bg-kawai-red" aria-hidden />
        </div>

        <h2
          className="text-kawai-black leading-[1.02] mb-5"
          style={{
            fontFamily: 'var(--font-family-cormorant), Georgia, serif',
            fontSize: 'clamp(2.6rem, 7vw, 5.5rem)',
            fontWeight: 500,
          }}
        >
          Back to School.
        </h2>

        <p
          className="text-kawai-red uppercase mb-10"
          style={{ fontFamily: 'var(--font-oswald), sans-serif', fontSize: '0.8rem', letterSpacing: '0.24em' }}
        >
          Instant rebates on every Kawai in the program
        </p>

        {/* The three offers, stated the same way the campaign page states them */}
        <div className="flex items-start justify-center gap-8 sm:gap-14 mb-10">
          {OFFERS.map(({ value, label, detail }) => (
            <div key={label} className="flex flex-col items-center gap-1 max-w-[9.5rem]">
              <span
                className="text-kawai-black leading-none"
                style={{ fontFamily: 'var(--font-family-cormorant), Georgia, serif', fontSize: 'clamp(1.5rem, 2.6vw, 2.1rem)', fontWeight: 500 }}
              >
                {value}
              </span>
              <span
                className="text-kawai-red uppercase mt-1"
                style={{ fontFamily: 'var(--font-oswald), sans-serif', fontSize: '0.62rem', letterSpacing: '0.2em' }}
              >
                {label}
              </span>
              <span className="hidden sm:block text-kawai-charcoal/50 text-[0.7rem] leading-snug">
                {detail}
              </span>
            </div>
          ))}
        </div>

        <PromoCtas storeslug={storeslug} locationName={locationName ?? null} hours={hours ?? null} />

        <span className="mt-4 text-kawai-charcoal/45 text-[0.7rem] tracking-[0.14em] uppercase">
          Rebates end {DEADLINE_LONG}
        </span>

      </div>
    </section>
  )
}
