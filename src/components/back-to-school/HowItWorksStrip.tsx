import { RuledGround } from './RuledGround'

interface HowItWorksStripProps {
  phone?: string | null
}

/**
 * Trade-in mechanics as a slim three-step strip. Replaces the shared trade-in
 * HowItWorks on this page: that component is a different visual language
 * (rounded number chips, 1,200px for three sentences) and its step copy asks
 * visitors to "bring your trade-in invitation" — a spring-campaign artifact
 * that doesn't exist in this program.
 */
const STEPS = [
  {
    number: '01',
    heading: 'Estimate the value',
    body: 'Call us — we’ll give you a number based on the age, condition, and market value of your current piano.',
  },
  {
    number: '02',
    heading: 'Book your visit',
    body: 'Pick a time during the program window. If you have a written independent appraisal, bring it; if not, we can help you arrange one.',
  },
  {
    number: '03',
    heading: 'Claim it at the counter',
    body: 'We beat any independent appraisal by $500, applied to your new Kawai — on top of the instant rebate and 0% financing.',
  },
] as const

export function HowItWorksStrip({ phone }: HowItWorksStripProps) {
  return (
    <section className="relative bg-kawai-pearl border-t border-kawai-black/10">
      <RuledGround />

      <div className="relative max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 py-16 md:py-20">

        <h2 className="flex items-center gap-3 mb-10">
          <span className="w-6 h-px bg-kawai-red" aria-hidden />
          <span
            className="text-kawai-charcoal/50 uppercase"
            style={{ fontFamily: 'var(--font-oswald), sans-serif', fontSize: '0.7rem', letterSpacing: '0.24em' }}
          >
            How the trade-in works
          </span>
        </h2>

        <ol className="grid md:grid-cols-3 gap-y-10 md:gap-y-0">
          {STEPS.map(({ number, heading, body }, i) => (
            <li
              key={number}
              className={i === 0 ? 'md:pr-10' : 'md:px-10 md:border-l md:border-kawai-black/12'}
            >
              <span
                className="block text-kawai-red leading-none mb-4"
                style={{
                  fontFamily: 'var(--font-oswald), sans-serif',
                  fontSize: '1.4rem',
                  letterSpacing: '0.08em',
                }}
                aria-hidden
              >
                {number}
              </span>

              <h3
                className="text-kawai-black leading-[1.15] mb-3"
                style={{
                  fontFamily: 'var(--font-family-cormorant), Georgia, serif',
                  fontSize: 'clamp(1.35rem, 2.2vw, 1.6rem)',
                  fontWeight: 500,
                }}
              >
                {heading}
              </h3>

              <p className="text-kawai-charcoal/65 text-[0.95rem] leading-relaxed">{body}</p>
            </li>
          ))}
        </ol>

        {phone && (
          <p className="mt-10 text-kawai-charcoal/55 text-sm">
            Questions about a specific piano?{' '}
            <a
              href={`tel:${phone.replace(/\D/g, '')}`}
              className="text-kawai-black underline underline-offset-4 decoration-kawai-black/25 hover:text-kawai-red hover:decoration-kawai-red transition-colors"
            >
              Call {phone}
            </a>
          </p>
        )}

      </div>
    </section>
  )
}
