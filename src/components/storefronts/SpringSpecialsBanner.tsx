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

interface SpringSpecialsBannerProps {
  storeslug: string
}

export function SpringSpecialsBanner({ storeslug }: SpringSpecialsBannerProps) {
  return (
    <section className="py-16 md:py-20 bg-kawai-pearl border-b border-kawai-neutral">
      <div className="max-w-6xl mx-auto px-6">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <SakuraIcon className="w-4 h-4 text-kawai-red/60" />
          <p className="text-kawai-red/60 text-xs tracking-[0.2em] uppercase font-medium">
            Limited Time Spring Offers · May 1–17
          </p>
          <SakuraIcon className="w-4 h-4 text-kawai-red/60" />
        </div>

        <h2 className="text-center text-3xl md:text-4xl font-light font-[family-name:var(--font-brand-serif)] text-kawai-black mb-3">
          Spring Specials
        </h2>
        <p className="text-center text-kawai-charcoal/60 max-w-lg mx-auto mb-12">
          Two exclusive offers available now through May 17th — designed to make owning a Kawai grand more attainable than ever.
        </p>

        {/* Campaign cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {/* Grand Spring Sale card */}
          <a
            href={`/store/${storeslug}/grand-spring-sale`}
            className="group bg-white rounded-xl border border-kawai-neutral/60 shadow-brand-subtle hover:shadow-brand-medium hover:border-kawai-neutral transition-all p-8 flex flex-col"
          >
            <div className="flex items-start gap-4 mb-5">
              <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-kawai-red/10 flex items-center justify-center text-kawai-red group-hover:bg-kawai-red/15 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-kawai-black text-lg font-[family-name:var(--font-brand-serif)] leading-tight">
                  Grand Spring Sale
                </h3>
                <p className="text-kawai-red/70 text-xs tracking-[0.15em] uppercase font-medium mt-0.5">
                  0% financing · 36 months
                </p>
              </div>
            </div>

            <p className="text-kawai-charcoal/65 text-sm leading-relaxed flex-1 mb-6">
              Every Kawai grand on our showroom floor — GL, GX, and Shigeru SK series — at 0% interest for three years. Play before you decide.
            </p>

            <div className="flex items-center gap-3 text-kawai-black text-sm font-medium">
              <span>Explore the collection</span>
              <div className="w-7 h-7 rounded-full border border-kawai-black/20 group-hover:border-kawai-red group-hover:bg-kawai-red flex items-center justify-center transition-all ml-auto">
                <svg className="w-3 h-3 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </div>
          </a>

          {/* Trade-In card */}
          <a
            href={`/store/${storeslug}/trade`}
            className="group bg-white rounded-xl border border-kawai-neutral/60 shadow-brand-subtle hover:shadow-brand-medium hover:border-kawai-neutral transition-all p-8 flex flex-col"
          >
            <div className="flex items-start gap-4 mb-5">
              <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-kawai-black/6 flex items-center justify-center text-kawai-black group-hover:bg-kawai-black/10 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-kawai-black text-lg font-[family-name:var(--font-brand-serif)] leading-tight">
                  Trade-In Offer
                </h3>
                <p className="text-kawai-charcoal/50 text-xs tracking-[0.15em] uppercase font-medium mt-0.5">
                  $500 over any appraisal
                </p>
              </div>
            </div>

            <p className="text-kawai-charcoal/65 text-sm leading-relaxed flex-1 mb-6">
              Already own a piano? We&apos;ll give you $500 over any independent appraisal toward a new Kawai grand. No gimmicks — just a fair trade.
            </p>

            <div className="flex items-center gap-3 text-kawai-black text-sm font-medium">
              <span>Get a trade-in estimate</span>
              <div className="w-7 h-7 rounded-full border border-kawai-black/20 group-hover:border-kawai-red group-hover:bg-kawai-red flex items-center justify-center transition-all ml-auto">
                <svg className="w-3 h-3 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </div>
          </a>
        </div>

        {/* Fine print */}
        <p className="text-center text-kawai-charcoal/40 text-xs mt-8">
          Offers valid May 1–17, 2026. Financing subject to credit approval. Trade-in value based on independent appraisal plus $500 bonus credit.
        </p>
      </div>
    </section>
  )
}
