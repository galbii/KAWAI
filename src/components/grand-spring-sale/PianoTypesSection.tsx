'use client'

interface PianoTypesSectionProps {
  storeslug: string
}

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

const PIANO_TYPES = [
  {
    name: 'Baby Grand',
    sizeRange: "4'10\" – 5'11\"",
    headline: 'Concert sound. Every room.',
    copy: 'Rich, warm tone in a form that fits your home. The ideal grand for living spaces — Kawai quality without compromise.',
    accent: 'Warm. Intimate. Timeless.',
  },
  {
    name: 'Grand Piano',
    sizeRange: "6' – 9'",
    headline: 'Full range. Full expression.',
    copy: 'Longer strings, deeper tone, greater dynamic range. For players who want concert-level performance at home.',
    accent: 'Powerful. Expressive. Uncompromising.',
  },
]

export function PianoTypesSection({ storeslug }: PianoTypesSectionProps) {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <style>{`
        @keyframes pts-rise {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pts-card {
          transition: box-shadow 0.35s cubic-bezier(0.22,0.61,0.36,1),
                      transform 0.35s cubic-bezier(0.22,0.61,0.36,1);
        }
        .pts-card:hover {
          box-shadow: 0 20px 60px rgba(30,27,22,0.12);
          transform: translateY(-3px);
        }
        .pts-arrow {
          display: inline-block;
          transition: transform 0.25s cubic-bezier(0.22,0.61,0.36,1);
        }
        .pts-see-models:hover .pts-arrow {
          transform: translateX(4px);
        }
      `}</style>

      <section className="relative bg-kawai-pearl py-20 md:py-28">

        {/* Subtle grain texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
          aria-hidden
        />

        <div className="relative max-w-6xl mx-auto px-6">

          {/* Section header */}
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-2.5 mb-4">
              <SakuraIcon className="w-4 h-4 text-kawai-red/50" />
              <span className="text-kawai-red/70 text-xs tracking-[0.28em] uppercase font-medium font-[family-name:var(--font-brand-sans)]">
                Available This Spring
              </span>
              <SakuraIcon className="w-4 h-4 text-kawai-red/50" />
            </div>
            <h2
              className="font-[family-name:var(--font-brand-serif)] text-kawai-black leading-[1.1]"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}
            >
              Spring Savings
            </h2>
            <p className="mt-4 text-kawai-charcoal/55 text-lg max-w-xl mx-auto leading-relaxed font-[family-name:var(--font-brand-sans)]">
              Limited time offers when you book an in-store appointment today.
            </p>
          </div>

          {/* Piano type cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
            {PIANO_TYPES.map((piano, i) => (
              <div
                key={piano.name}
                className="pts-card bg-white border border-kawai-neutral/60 rounded-sm overflow-hidden"
              >
                {/* Red accent bar */}
                <div className="h-[3px] bg-kawai-red w-full" />

                <div className="p-8 md:p-10 flex flex-col h-full">

                  {/* Roman numeral + size badge row */}
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className="font-[family-name:var(--font-brand-serif)] text-kawai-black/15 leading-none select-none"
                      style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}
                      aria-hidden
                    >
                      {i === 0 ? 'I' : 'II'}
                    </span>
                    <span className="text-xs tracking-[0.2em] uppercase font-medium text-kawai-charcoal/45 border border-kawai-neutral px-3 py-1.5 rounded-full font-[family-name:var(--font-brand-sans)]">
                      {piano.sizeRange}
                    </span>
                  </div>

                  {/* Piano name in script */}
                  <div
                    className="font-kawai-script text-kawai-black leading-[1] mb-1"
                    style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)' }}
                  >
                    {piano.name}
                  </div>

                  {/* Accent phrase */}
                  <p className="text-kawai-red/70 text-xs tracking-[0.2em] uppercase font-medium mb-5 font-[family-name:var(--font-brand-sans)]">
                    {piano.accent}
                  </p>

                  {/* Divider */}
                  <div className="h-px bg-kawai-neutral/60 mb-5" />

                  {/* Headline */}
                  <h3
                    className="font-[family-name:var(--font-brand-serif)] text-kawai-black mb-3 leading-snug"
                    style={{ fontSize: 'clamp(1.1rem, 2vw, 1.35rem)' }}
                  >
                    {piano.headline}
                  </h3>

                  {/* Copy */}
                  <p className="text-kawai-charcoal/60 text-sm leading-relaxed mb-6 font-[family-name:var(--font-brand-sans)]">
                    {piano.copy}
                  </p>

                  {/* Footer */}
                  <div className="mt-auto flex items-center justify-end pt-4 border-t border-kawai-neutral/40">
                    <button
                      onClick={() => scrollTo('grand-showcase')}
                      className="pts-see-models inline-flex items-center gap-1.5 text-kawai-black hover:text-kawai-red text-sm font-medium tracking-[0.05em] transition-colors font-[family-name:var(--font-brand-sans)]"
                    >
                      See models
                      <span className="pts-arrow">→</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  )
}
