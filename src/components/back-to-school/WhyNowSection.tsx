import { DEADLINE_LONG } from './campaign'
import { RuledGround } from './RuledGround'

/**
 * Three reasons September is the month to buy. Not a sequence — a family can
 * care about any one of these on its own — so the columns carry short label
 * words rather than 01/02/03 markers.
 */
const REASONS = [
  {
    label: 'Timing',
    heading: 'Lessons fill up in September',
    body: 'Teachers set their fall schedules in the first weeks of the term. Having a piano at home by week one is the difference between practicing and meaning to.',
  },
  {
    label: 'Price',
    heading: 'The rebate comes off at the counter',
    body: `No mail-in form, no waiting on a check — the rebate is taken off the price the day you buy. On ${DEADLINE_LONG} the program closes and prices return to normal.`,
  },
  {
    label: 'Instrument',
    heading: 'A keyboard is not a piano',
    body: 'Eighty-eight weighted keys with real hammer action teach a hand what a spring-loaded keyboard never will. Technique built on the wrong touch has to be unlearned later.',
  },
] as const

export function WhyNowSection() {
  return (
    <section className="relative bg-kawai-pearl border-t border-kawai-black/10">
      <RuledGround />

      <div className="relative max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 py-20 md:py-28">

        {/* The eyebrow is the section's real heading — as a styled <span> it left
            the three reason headings skipping straight from h1 to h3. */}
        <h2 className="flex items-center gap-3 mb-10">
          <span className="w-6 h-px bg-kawai-red" aria-hidden />
          <span
            className="text-kawai-charcoal/50 uppercase"
            style={{ fontFamily: 'var(--font-oswald), sans-serif', fontSize: '0.7rem', letterSpacing: '0.24em' }}
          >
            Why September
          </span>
        </h2>

        <div className="grid md:grid-cols-3 gap-y-12 md:gap-y-0">
          {REASONS.map(({ label, heading, body }, i) => (
            <div
              key={label}
              className={
                i === 0
                  ? 'md:pr-10'
                  : 'md:px-10 md:border-l md:border-kawai-black/12'
              }
            >
              <span
                className="block text-kawai-red uppercase mb-4"
                style={{
                  fontFamily: 'var(--font-oswald), sans-serif',
                  fontSize: '0.72rem',
                  letterSpacing: '0.26em',
                }}
              >
                {label}
              </span>

              <h3
                className="text-kawai-black leading-[1.15] mb-4"
                style={{
                  fontFamily: 'var(--font-family-cormorant), Georgia, serif',
                  fontSize: 'clamp(1.5rem, 2.6vw, 1.9rem)',
                  fontWeight: 500,
                }}
              >
                {heading}
              </h3>

              <p className="text-kawai-charcoal/65 text-[0.95rem] leading-relaxed">
                {body}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
