const STEPS = [
  {
    number: '01',
    title: 'Tell us about your piano',
    body: 'Fill out the appraisal form below. Brand, type, approximate age, condition. Takes two minutes. We\'ll follow up within one business day with a preliminary range.',
    footnote: null,
  },
  {
    number: '02',
    title: 'Bring it to our showroom',
    body: 'A certified technician appraises your instrument in person — no guesswork, no lowball offers. You\'ll receive a written appraisal you can take anywhere.',
    footnote: null,
  },
  {
    number: '03',
    title: 'We add $500 on top',
    body: 'Whatever the appraisal says, we\'ll give you $500 more. That credit is applied directly to your new Kawai — combined with 0% financing, it makes the numbers genuinely work.',
    footnote: 'Spring offer ends May 17, 2026.',
  },
]

export function HowItWorks() {
  return (
    <section className="border-y border-white/20 py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-8 bg-kawai-red/40" />
            <span className="text-kawai-red/60 text-xs tracking-[0.2em] uppercase font-medium">How it works</span>
          </div>
          <h2
            className="font-[family-name:var(--font-family-cormorant)] font-normal text-kawai-black leading-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            Three steps. No surprises.
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical connector line on desktop */}
          <div className="hidden md:block absolute left-[2.25rem] top-12 bottom-12 w-px bg-kawai-neutral" aria-hidden />

          <div className="space-y-12">
            {STEPS.map(({ number, title, body, footnote }) => (
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
                  {footnote && (
                    <p className="text-kawai-charcoal/40 text-xs mt-2 italic">{footnote}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
