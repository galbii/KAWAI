import { OFFERS } from './campaign'
import { RuledGround } from './RuledGround'

/**
 * The three offers as full-width columns — the same OFFERS trio the hero lists
 * in its ruled rows, restated at section scale for simplicity and consistency.
 */

export function WhyNowSection() {
  return (
    <section className="relative bg-kawai-pearl border-t border-kawai-black/10">
      <RuledGround />

      <div className="relative max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 py-16 md:py-20">

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
          {OFFERS.map(({ value, label, detail }, i) => (
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
                  fontSize: 'clamp(1.9rem, 3.2vw, 2.4rem)',
                  fontWeight: 500,
                }}
              >
                {value}
              </h3>

              <p className="text-kawai-charcoal/65 text-[0.95rem] leading-relaxed">
                {detail}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
