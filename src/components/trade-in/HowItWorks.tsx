'use client'

interface HowItWorksProps {
  phone?: string | null
}

const STEPS = [
  {
    number: '01',
    title: 'Estimate the value of your Piano',
    body: 'Get an estimate on the value of your piano. This will be determined in store based on the condition and market value of your piano.',
    badge: 'Best Price Guaranteed',
  },
  {
    number: '02',
    title: 'Book an appointment and show your invitation bonus',
    body: 'Schedule a time at your local showroom and bring your trade-in invitation. Our team will walk you through the process from start to finish.',
    badge: null,
  },
  {
    number: '03',
    title: 'Claim your total trade in value',
    body: 'Receive your full trade-in credit — $500 over any appraisal — applied directly toward your new Kawai. Combined with 0% financing, the numbers genuinely work in your favor.',
    badge: null,
  },
]

export function HowItWorks({ phone }: HowItWorksProps) {
  return (
    <section id="how-it-works" className="border-y border-white/20 py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-8 bg-kawai-red/40" />
            <span className="text-kawai-red/60 text-xs tracking-[0.2em] uppercase font-medium">Trade In Policy</span>
          </div>
          <p
            className="font-[family-name:var(--font-brand-sans)] font-medium text-kawai-black/50 tracking-[0.3em] uppercase mb-3"
            style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)' }}
          >
            Three Steps
          </p>
          <h2
            className="font-[family-name:var(--font-family-cormorant)] font-normal text-kawai-black leading-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            Claim Your Bonus
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical connector line on desktop */}
          <div className="hidden md:block absolute left-[2.25rem] top-12 bottom-12 w-px bg-kawai-neutral" aria-hidden />

          <div className="space-y-12">
            {STEPS.map(({ number, title, body, badge }) => (
              <div key={number} className="relative flex gap-8 md:gap-12 items-start">
                {/* Step number */}
                <div className="flex-shrink-0 w-[4.5rem] h-[4.5rem] flex items-center justify-center border border-kawai-red/20 bg-white rounded-sm relative z-10">
                  <span
                    className="font-[family-name:var(--font-family-cormorant)] text-kawai-red"
                    style={{ fontSize: '1.5rem', lineHeight: 1 }}
                  >
                    {number}
                  </span>
                </div>

                {/* Content */}
                <div className="pt-3 flex-1">
                  <h3 className="text-kawai-black text-xl font-medium mb-3 font-[family-name:var(--font-brand-serif)]">
                    {title}
                  </h3>
                  <p className="text-kawai-charcoal/65 leading-relaxed">{body}</p>
                  {badge && (
                    <span className="inline-block mt-3 px-3 py-1 bg-kawai-red text-white text-[0.65rem] tracking-[0.2em] uppercase font-semibold rounded-sm">
                      {badge}
                    </span>
                  )}
                  {number === '01' && phone && (
                    <p className="mt-3 text-kawai-charcoal/50 text-sm">
                      Have questions?{' '}
                      <a
                        href={`tel:${phone.replace(/\D/g, '')}`}
                        className="text-kawai-charcoal/70 hover:text-kawai-red transition-colors underline underline-offset-2 decoration-kawai-charcoal/30 hover:decoration-kawai-red"
                      >
                        {phone}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 flex justify-center">
          <a
            href="#trade-calculator"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('trade-calculator')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-flex items-center px-10 py-4 bg-kawai-red hover:bg-kawai-red/90 text-white text-sm tracking-[0.12em] uppercase font-medium transition-colors rounded-sm shadow-[0_4px_24px_rgba(225,25,34,0.35)]"
          >
            Claim Bonus
          </a>
        </div>
      </div>
    </section>
  )
}
