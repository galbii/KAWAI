const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

export function MissionBanner() {
  return (
    <section className="relative bg-kawai-red overflow-hidden">
      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: GRAIN_SVG }}
      />

      {/* Diagonal lines */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="w-full h-full">
          <line x1="0" y1="200" x2="1440" y2="0" stroke="white" strokeWidth="1" />
          <line x1="200" y1="200" x2="1440" y2="40" stroke="white" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative z-10 px-8 md:px-16 lg:px-24 py-16 md:py-20 max-w-screen-xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <p className="text-2xl md:text-3xl lg:text-4xl font-[family-name:var(--font-brand-luxury)] text-white leading-snug max-w-2xl italic">
          &ldquo;Since 1927, we&apos;ve crafted instruments for the world&apos;s greatest
          musicians. Now we&apos;re looking for the people who will craft the next
          century.&rdquo;
        </p>
        <a
          href="#openings"
          className="flex-shrink-0 inline-flex items-center gap-3 px-8 py-4 bg-white text-kawai-red text-sm font-medium uppercase tracking-[0.1em] font-[family-name:var(--font-brand-sans)] hover:bg-kawai-pearl transition-colors duration-200 self-start md:self-auto"
        >
          See Open Roles
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M3 8h10M8 3l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </section>
  )
}
