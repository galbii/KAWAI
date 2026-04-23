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
    <>
      <style>{`
        .ssb-panel-dark  { transition: background 0.4s cubic-bezier(0.22,0.61,0.36,1); }
        .ssb-panel-light { transition: background 0.4s cubic-bezier(0.22,0.61,0.36,1); }
        .ssb-panel-dark:hover  { background: #161310; }
        .ssb-panel-light:hover { background: #f5f3ef; }

        .ssb-numeral-dark  { transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,0.61,0.36,1); }
        .ssb-numeral-light { transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,0.61,0.36,1); }
        .ssb-panel-dark:hover  .ssb-numeral-dark  { opacity: 0.09; transform: translateY(-8px) rotate(-2deg); }
        .ssb-panel-light:hover .ssb-numeral-light { opacity: 0.055; transform: translateY(-8px) rotate(2deg); }

        .ssb-cta-red   { transition: letter-spacing 0.3s ease, background 0.25s ease; }
        .ssb-cta-dark  { transition: letter-spacing 0.3s ease, background 0.25s ease; }
        .ssb-panel-dark:hover  .ssb-cta-red  { letter-spacing: 0.18em; background: #c8151d; }
        .ssb-panel-light:hover .ssb-cta-dark { letter-spacing: 0.18em; background: #161310; }

        @keyframes ssb-bar-grow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .ssb-bar { transform-origin: left; animation: ssb-bar-grow 1s cubic-bezier(0.22,0.61,0.36,1) 0.3s both; }
      `}</style>

      <section className="relative bg-kawai-pearl py-20 md:py-28 border-b border-kawai-neutral overflow-hidden">

        {/* Grain texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
          aria-hidden
        />

        <div className="relative max-w-6xl mx-auto px-6">

          {/* ── Header ─────────────────────────────────────────────── */}
          <div className="text-center mb-14">

            {/* Eyebrow */}
            <div className="flex items-center justify-center gap-2.5 mb-6">
              <SakuraIcon className="w-4 h-4 text-kawai-red/50" />
              <span className="text-kawai-red/65 text-xs md:text-sm tracking-[0.28em] uppercase font-semibold font-[family-name:var(--font-brand-sans)]">
                Limited Time Spring Offers
              </span>
              <SakuraIcon className="w-4 h-4 text-kawai-red/50" />
            </div>

            {/* Script headline */}
            <h2
              className="font-kawai-script text-kawai-black leading-[0.95] mb-6"
              style={{ fontSize: 'clamp(4.5rem, 11vw, 9rem)' }}
            >
              Spring Specials.
            </h2>

            {/* Ruled divider */}
            <div className="flex items-center gap-5 max-w-sm mx-auto mb-10">
              <div className="flex-1 h-px bg-kawai-black/25" />
              <span className="text-kawai-black/45 text-xs md:text-sm tracking-[0.35em] uppercase font-semibold font-[family-name:var(--font-brand-sans)] whitespace-nowrap">
                Kawai · May 1–17
              </span>
              <div className="flex-1 h-px bg-kawai-black/25" />
            </div>

            {/* Stats */}
            <div className="flex items-start justify-center gap-8 md:gap-16">
              {[
                { value: '0%',   label: 'Financing',     sub: '36 months · no interest' },
                { value: 'Sale', label: 'Spring Pricing', sub: 'Select grand pianos'     },
                { value: '+$500',label: 'Trade-In Bonus', sub: 'Over any appraisal'      },
              ].map(({ value, label, sub }) => (
                <div key={label} className="flex flex-col items-center gap-1.5">
                  <div className="ssb-bar w-8 h-[2px] bg-kawai-red mb-2" aria-hidden />
                  <span className="font-kawai-script text-kawai-black leading-none" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)' }}>
                    {value}
                  </span>
                  <span className="text-kawai-black text-xs md:text-sm tracking-[0.2em] uppercase font-semibold mt-1 font-[family-name:var(--font-brand-sans)]">
                    {label}
                  </span>
                  <span className="text-kawai-black/50 text-xs md:text-sm tracking-wide font-[family-name:var(--font-brand-sans)]">
                    {sub}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Full-width Grand Spring Sale panel ─────────────────── */}
          <div className="rounded-sm overflow-hidden border border-kawai-neutral shadow-brand-premium">

            <a
              href={`/store/${storeslug}/grand-spring-sale`}
              className="ssb-panel-dark relative bg-kawai-black overflow-hidden flex flex-col md:flex-row min-h-[420px] group"
            >
              {/* Red top bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-kawai-red" />

              {/* Ghost numeral */}
              <span
                className="ssb-numeral-dark absolute -bottom-8 -left-4 font-[family-name:var(--font-brand-serif)] text-white opacity-[0.05] leading-none select-none pointer-events-none"
                style={{ fontSize: 'clamp(180px, 25vw, 320px)' }}
                aria-hidden
              >
                I
              </span>

              {/* Left: headline block */}
              <div className="relative z-10 flex flex-col justify-between p-10 md:p-14 md:w-1/2 border-b md:border-b-0 md:border-r border-white/10">
                <div>
                  <p className="text-kawai-red text-[0.6rem] tracking-[0.32em] uppercase font-semibold mb-8 font-[family-name:var(--font-brand-sans)]">
                    Spring Offer · 2026
                  </p>
                  <div
                    className="font-kawai-script text-white leading-[1] mb-3"
                    style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}
                  >
                    Grand Spring Sale
                  </div>
                  <p className="text-kawai-red/70 text-[0.65rem] tracking-[0.22em] uppercase font-medium font-[family-name:var(--font-brand-sans)]">
                    0% Financing · 36 Months
                  </p>
                </div>

                <div className="mt-10">
                  <span className="ssb-cta-red inline-flex w-full md:w-auto items-center justify-center gap-3 px-8 py-4 bg-kawai-red text-white text-xs tracking-[0.15em] uppercase font-semibold font-[family-name:var(--font-brand-sans)] rounded-sm">
                    Explore the Collection
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Right: body copy + stats */}
              <div className="relative z-10 flex flex-col justify-center p-10 md:p-14 md:w-1/2 gap-8">
                <div>
                  <h3
                    className="font-[family-name:var(--font-brand-serif)] text-white/90 leading-snug mb-3"
                    style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)' }}
                  >
                    Play now. Pay nothing for three years.
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed font-[family-name:var(--font-brand-sans)]">
                    Every Kawai grand on our showroom floor — GL, GX, and Shigeru SK series — at 0% interest for 36 months. Plus $500 over any trade-in appraisal. Come play before you decide.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                  {[
                    { value: '0%',    label: 'Interest' },
                    { value: '36mo',  label: 'Financing' },
                    { value: '+$500', label: 'Trade-In' },
                  ].map(({ value, label }) => (
                    <div key={label} className="text-center">
                      <div className="font-kawai-script text-white/90 leading-none mb-1" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}>
                        {value}
                      </div>
                      <div className="text-white/35 text-[10px] tracking-[0.2em] uppercase font-[family-name:var(--font-brand-sans)]">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </a>

          </div>

          {/* Fine print */}
          <p className="text-center text-kawai-charcoal/45 text-xs mt-6 tracking-wide font-[family-name:var(--font-brand-sans)]">
            Offers valid May 1–17, 2026. Financing subject to credit approval. Trade-in value based on independent appraisal plus $500 bonus credit.
          </p>

        </div>
      </section>
    </>
  )
}
