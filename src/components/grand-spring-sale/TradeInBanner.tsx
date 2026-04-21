'use client'

function SakuraIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      {[0, 72, 144, 216, 288].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 20 20)`}>
          <ellipse cx="20" cy="11" rx="5" ry="9" fill="currentColor" fillOpacity="0.9" />
          <ellipse cx="20" cy="5.5" rx="2" ry="2.5" fill="white" fillOpacity="0.35" />
        </g>
      ))}
      <circle cx="20" cy="20" r="4" fill="white" fillOpacity="0.5" />
      <circle cx="20" cy="20" r="2.5" fill="currentColor" />
    </svg>
  )
}

interface TradeInBannerProps {
  storeslug: string
}

export function TradeInBanner({ storeslug }: TradeInBannerProps) {
  return (
    <section className="border-y border-white/20">
      <div className="max-w-4xl mx-auto px-6 py-14 md:py-16">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Icon */}
          <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-kawai-red/10 flex items-center justify-center">
            <svg className="w-7 h-7 text-kawai-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
            </svg>
          </div>

          {/* Copy */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 mb-2 md:justify-start justify-center">
              <SakuraIcon className="w-3.5 h-3.5 text-kawai-red/60" />
              <p className="text-kawai-red/60 text-xs tracking-[0.2em] uppercase font-medium">
                Trade-In Offer
              </p>
            </div>
            <h3 className="text-3xl md:text-5xl font-semibold font-[family-name:var(--font-brand-serif)] text-kawai-black mb-3">
              Already have a piano? It&apos;s worth more here.
            </h3>
            <p className="text-kawai-charcoal/60 text-lg">
              We&apos;ll give you <strong className="text-kawai-black font-semibold">$500 over any independent appraisal</strong>{' '}
              toward your new Kawai grand. No gimmicks — just a fair trade that makes upgrading easier.
            </p>
          </div>

          {/* CTA */}
          <div className="flex-shrink-0">
            <a
              href="#grand-lead-form"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('grand-lead-form')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="inline-flex items-center gap-3 px-7 py-4 bg-kawai-black hover:bg-kawai-charcoal text-white text-sm tracking-[0.1em] uppercase font-medium transition-colors rounded-sm whitespace-nowrap group"
            >
              Get a trade-in estimate
              <div className="w-6 h-6 rounded-full border border-white/25 group-hover:border-white/50 group-hover:bg-white/10 flex items-center justify-center transition-all">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
