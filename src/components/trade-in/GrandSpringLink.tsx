interface GrandSpringLinkProps {
  storeslug: string
}

export function GrandSpringLink({ storeslug }: GrandSpringLinkProps) {
  return (
    <section className="border-t border-white/20">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-kawai-pearl/30 text-xs tracking-[0.2em] uppercase font-medium mb-3">
              Spring Collection
            </p>
            <h3
              className="font-[family-name:var(--font-family-cormorant)] text-white leading-tight"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}
            >
              Ready to see what you&apos;d be
              <br />
              <span className="text-kawai-pearl/40">trading up</span> to?
            </h3>
          </div>

          <div className="flex-shrink-0">
            <a
              href={`/store/${storeslug}/grand-spring-sale`}
              className="inline-flex items-center gap-4 px-8 py-5 border border-white/15 hover:border-white/35 text-kawai-pearl/70 hover:text-white transition-colors text-sm tracking-[0.12em] uppercase font-medium rounded-sm group"
            >
              <span>View the Grand Spring Sale</span>
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Offer summary strip */}
        <div className="mt-10 pt-8 border-t border-white/5 flex flex-wrap gap-6 md:gap-12">
          {[
            { label: '0% financing', value: '36 months' },
            { label: 'Trade-in bonus', value: '+$500 over appraisal' },
            { label: 'Offer ends', value: 'May 17, 2026' },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-kawai-pearl/25 text-xs tracking-wide uppercase mb-0.5">{label}</div>
              <div className="text-kawai-pearl/60 text-sm">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
