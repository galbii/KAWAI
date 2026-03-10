export function LifeAtKawai() {
  return (
    <section
      id="life-at-kawai"
      className="relative bg-kawai-black py-28 md:py-36 px-8 md:px-16 lg:px-24 overflow-hidden"
    >
      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Corner accents — white version */}
      <div className="absolute top-0 left-0 w-20 h-20 opacity-15 pointer-events-none">
        <svg viewBox="0 0 100 100" className="text-white w-full h-full">
          <line x1="0" y1="25" x2="25" y2="25" stroke="currentColor" strokeWidth="1" />
          <line x1="25" y1="0" x2="25" y2="25" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-20 h-20 opacity-15 rotate-180 pointer-events-none">
        <svg viewBox="0 0 100 100" className="text-white w-full h-full">
          <line x1="0" y1="25" x2="25" y2="25" stroke="currentColor" strokeWidth="1" />
          <line x1="25" y1="0" x2="25" y2="25" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      {/* Gold rule */}
      <div className="relative z-10 w-12 h-px bg-kawai-gold mb-12" />

      {/* Quote */}
      <blockquote className="relative z-10 text-4xl md:text-5xl lg:text-[3.25rem] font-[family-name:var(--font-brand-luxury)] text-white leading-[1.2] italic max-w-3xl mb-10">
        &ldquo;We don&apos;t make products.
        <br />
        We make instruments
        <br />
        that outlast their owners.&rdquo;
      </blockquote>

      {/* Stats row */}
      <div className="relative z-10 flex flex-wrap gap-12 mt-12 pt-10 border-t border-white/10">
        {[
          { num: '75+', label: 'Years of Craft' },
          { num: '180+', label: 'Countries' },
          { num: '100K+', label: 'Instruments Yearly' },
        ].map((stat) => (
          <div key={stat.label}>
            <div className="text-3xl font-[family-name:var(--font-brand-luxury)] text-white">
              {stat.num}
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-[family-name:var(--font-brand-sans)] mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
