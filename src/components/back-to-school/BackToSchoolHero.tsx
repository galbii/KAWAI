import { SeptemberCalendar } from './SeptemberCalendar'
import { DATE_RANGE, OFFERS } from './campaign'
import { RuledGround } from './RuledGround'

interface BackToSchoolHeroProps {
  locationName?: string | null
}

/**
 * Hero — server-rendered so the headline is in the initial HTML.
 * The only client JS in here is the calendar's date-dependent strip.
 */
export function BackToSchoolHero({ locationName }: BackToSchoolHeroProps) {
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

      <section className="relative overflow-hidden bg-kawai-pearl">

        <RuledGround />

        <div className="relative max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 pt-14 pb-16 md:pt-20 md:pb-24">
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-14 lg:gap-16 items-center">

            {/* ── Left: the pitch ── */}
            <div>
              {/* No in-page wordmark — the site header 100px above already says
                  KAWAI. The eyebrow matches the red-dash pattern every other
                  section uses. */}
              <div className="bts-r1 flex items-center gap-3 mb-8">
                <span className="w-6 h-px bg-kawai-red" aria-hidden />
                <span
                  className="text-kawai-charcoal/55 uppercase"
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
                className="bts-r2 text-kawai-black uppercase leading-[0.86]"
                style={{
                  fontFamily: 'var(--font-oswald), sans-serif',
                  fontSize: 'clamp(3.2rem, 8vw, 6.2rem)',
                  letterSpacing: '-0.005em',
                }}
              >
                Back to
                <br />
                School
              </h1>

              <p
                className="bts-r3 text-kawai-charcoal/75 italic mt-6 max-w-md leading-snug"
                style={{
                  fontFamily: 'var(--font-brand-serif)',
                  fontSize: 'clamp(1.25rem, 2.2vw, 1.6rem)',
                }}
              >
                Practice goes better on an instrument that answers back.
              </p>

              <p className="bts-r3 text-kawai-charcoal/65 text-base leading-relaxed mt-5 max-w-lg">
                Every Kawai in the September rebate program comes down at the counter — up to
                $4,500 off — and pairs with 0% financing for 36 months. Trade in the piano you
                have and we&apos;ll beat any independent appraisal by $500.
                {locationName ? <> All of it, in person at {locationName}.</> : null}
              </p>

              {/* Offers — ruled rows rather than cards, so they sit on the paper */}
              {/* The value stays readable text rather than aria-hidden decoration, so
                  a screen reader gets "0% — Financing — 36 months, no interest" in
                  one pass instead of the value twice. */}
              <ul className="bts-r4 mt-8 border-t border-kawai-black/12 max-w-lg">
                {OFFERS.map(({ value, label, detail }) => (
                  <li
                    key={label}
                    className="flex items-baseline gap-4 sm:gap-6 py-3.5 border-b border-kawai-black/12"
                  >
                    <span
                      className="text-kawai-red flex-shrink-0 w-[4.5rem] sm:w-[5.5rem] leading-none"
                      style={{
                        fontFamily: 'var(--font-oswald), sans-serif',
                        fontSize: 'clamp(1.35rem, 2.4vw, 1.75rem)',
                        letterSpacing: '0.01em',
                      }}
                    >
                      {value}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-kawai-black text-[0.7rem] tracking-[0.18em] uppercase font-semibold">
                        {label}
                      </span>
                      <span className="block text-kawai-charcoal/55 text-sm mt-0.5">{detail}</span>
                    </span>
                  </li>
                ))}
              </ul>

              {/* One button. The booking path stays one line of quiet text — the
                  page repeats it at full weight where booking is the next step. */}
              <div className="bts-r5 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-8 mt-8">
                <a
                  href="#rebates"
                  className="inline-flex items-center justify-center px-8 py-4 bg-kawai-red hover:bg-kawai-red-600 text-white text-sm tracking-[0.14em] uppercase font-medium transition-colors rounded-sm"
                >
                  See the rebates
                </a>
                <a
                  href="#book"
                  className="inline-flex items-center justify-center sm:justify-start gap-2 text-kawai-black/70 hover:text-kawai-red text-sm tracking-[0.1em] uppercase font-medium underline underline-offset-4 decoration-kawai-black/25 hover:decoration-kawai-red transition-colors"
                >
                  Or book an appointment
                </a>
              </div>
            </div>

            {/* ── Right: the calendar ── */}
            <div className="bts-r4 flex justify-center lg:justify-end">
              <SeptemberCalendar />
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
