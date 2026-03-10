import { cn } from '@/lib/utils'

export function CareersHero() {
  return (
    <section className="relative w-full min-h-[70vh] bg-kawai-pearl flex flex-col justify-between overflow-hidden px-8 md:px-16 lg:px-24 pt-20 pb-16">
      {/* Subtle grain texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-20 h-20 opacity-20 pointer-events-none">
        <svg viewBox="0 0 100 100" className="text-kawai-black w-full h-full">
          <line x1="0" y1="25" x2="25" y2="25" stroke="currentColor" strokeWidth="1" />
          <line x1="25" y1="0" x2="25" y2="25" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-20 h-20 opacity-20 rotate-180 pointer-events-none">
        <svg viewBox="0 0 100 100" className="text-kawai-black w-full h-full">
          <line x1="0" y1="25" x2="25" y2="25" stroke="currentColor" strokeWidth="1" />
          <line x1="25" y1="0" x2="25" y2="25" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      {/* Top label row */}
      <div className="flex items-center justify-between relative z-10">
        <p className="text-[10px] uppercase tracking-[0.2em] text-kawai-charcoal/50 font-[family-name:var(--font-brand-sans)]">
          Careers at Kawai
        </p>
        <div className="h-px flex-1 bg-kawai-neutral/60 mx-8" />
        <p className="text-[10px] uppercase tracking-[0.2em] text-kawai-charcoal/30 font-[family-name:var(--font-brand-sans)]">
          Est. 1927
        </p>
      </div>

      {/* Heading */}
      <div className="my-auto py-12 relative z-10">
        <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-[7rem] font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-[0.92] tracking-tight">
          Shape the Future
          <br />
          <span className="italic text-kawai-charcoal/70">of Music.</span>
        </h1>
        <p className="mt-8 text-base md:text-lg text-kawai-charcoal/60 max-w-lg font-[family-name:var(--font-brand-sans)] leading-relaxed">
          We make instruments that outlast their owners. We&apos;re looking for people who think the
          same way.
        </p>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between relative z-10">
        <div className="h-px flex-1 bg-kawai-neutral/60 mr-8" />
        <a
          href="#openings"
          className="text-[11px] uppercase tracking-[0.18em] text-kawai-charcoal/50 hover:text-kawai-black transition-colors duration-200 font-[family-name:var(--font-brand-sans)] flex items-center gap-2"
        >
          View open positions
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M7 2v10M2 7l5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </section>
  )
}
