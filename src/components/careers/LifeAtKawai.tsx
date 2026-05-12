const PILLARS = [
  {
    num: '01',
    title: 'Craft',
    desc: 'Kawai builds fewer than 300 Shigeru Kawai concert grands per year, each voiced by hand. That standard for detail carries into every part of how we work.',
  },
  {
    num: '02',
    title: 'Legacy',
    desc: 'Kawai has operated in North America since 1963. Our team averages more than 20 years of tenure. That continuity is not an accident.',
  },
  {
    num: '03',
    title: 'Reach',
    desc: 'Our instruments are sold in over 180 countries through 212+ authorized dealers in North America alone. Working here means working at the center of a genuinely global distribution network.',
  },
  {
    num: '04',
    title: 'Innovation',
    desc: "Kawai's North American team works closely with manufacturing in Japan and a production facility in North Carolina. The work here is connected to how the instrument is built, not just how it is sold.",
  },
]

const STATS = [
  { num: '63+', label: 'Years in North America' },
  { num: '180+', label: 'Countries' },
  { num: '100K+', label: 'Instruments Yearly' },
  { num: '1927', label: 'Founded' },
]

export function LifeAtKawai() {
  return (
    <>
      {/* ── Values + Culture (Pearl + glass) ─────────────────────── */}
      <section
        id="life"
        className="relative bg-kawai-pearl py-28 md:py-36 px-8 md:px-16 lg:px-24 overflow-hidden"
      >
        {/* Radial gradient orb */}
        <div
          className="absolute pointer-events-none inset-0 z-0"
          style={{
            background:
              'radial-gradient(ellipse 50% 60% at 90% 10%, rgba(213,199,140,0.10) 0%, transparent 60%)',
          }}
        />

        <div className="relative z-10 max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: Intro copy */}
          <div className="lg:sticky lg:top-24">
            <div className="w-10 h-px bg-kawai-red mb-10" />
            <h2 className="text-[2.25rem] md:text-[2.75rem] leading-[1.05] font-[family-name:var(--font-brand-luxury)] text-kawai-black mb-8">
              What it means
              <br />
              to work at Kawai.
            </h2>
            <p className="text-kawai-charcoal/60 font-[family-name:var(--font-brand-sans)] text-base leading-relaxed max-w-sm mb-10">
              Kawai America Corporation has been based in Southern California since 1963.
              We are a small, experienced team — and that is by design. Every role here
              has real scope.
            </p>
            <p className="text-kawai-charcoal/45 font-[family-name:var(--font-brand-sans)] text-sm leading-relaxed max-w-sm">
              Our work spans sales and distribution, artist relations, institutional programs,
              technical support, and dealer partnerships. Colleagues here often stay for
              decades. The people who join tend to find reasons to stay.
            </p>
          </div>

          {/* Right: Glass pillar cards */}
          <div className="flex flex-col gap-3">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.num}
                className="bg-white/65 backdrop-blur-md border border-kawai-neutral/20 shadow-brand-subtle rounded-2xl px-7 py-7 flex gap-6 hover:shadow-brand-medium hover:bg-white/80 transition-all duration-200"
              >
                <span className="text-kawai-red text-[11px] font-mono font-medium leading-none mt-1 flex-shrink-0 w-6 font-[family-name:var(--font-brand-sans)]">
                  {pillar.num}
                </span>
                <div>
                  <h3 className="text-xl font-[family-name:var(--font-brand-luxury)] text-kawai-black mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-kawai-charcoal/60 font-[family-name:var(--font-brand-sans)] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Culture Quote + Stats (Pearl + glass) ────────────────── */}
      <section className="relative bg-kawai-pearl overflow-hidden">
        {/* Radial gradient orbs */}
        <div
          className="absolute pointer-events-none inset-0 z-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 20% 70%, rgba(225,25,34,0.05) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 75% 20%, rgba(213,199,140,0.12) 0%, transparent 55%)',
          }}
        />

        <div className="relative z-10 px-8 md:px-16 lg:px-24 py-28 md:py-36 max-w-screen-xl mx-auto">
          {/* Red rule */}
          <div className="w-12 h-px bg-kawai-red mb-14" />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 lg:gap-24 items-end">
            {/* Value proposition */}
            <div className="max-w-3xl">
              <h2 className="text-[2rem] md:text-[2.5rem] lg:text-[3rem] font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-[1.2] mb-6">
                A century of craft.<br />
                <span className="text-kawai-red">Built for the next century.</span>
              </h2>
              <p className="text-kawai-charcoal/60 font-[family-name:var(--font-brand-sans)] text-base leading-relaxed max-w-lg">
                Kawai has been part of how people experience music since 1927 — in concert halls, universities, conservatories, and living rooms across 180 countries. Kawai America is where that presence is built and maintained in North America.
              </p>
            </div>

            {/* Attribution */}
            <div className="lg:pb-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-kawai-charcoal/40 font-[family-name:var(--font-brand-sans)]">
                Kawai Musical Instruments
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-kawai-charcoal/30 font-[family-name:var(--font-brand-sans)] mt-1">
                Est. 1927, Hamamatsu Japan
              </p>
            </div>
          </div>

          {/* Glass stat cards */}
          <div className="mt-16 pt-12 border-t border-kawai-neutral/30 grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/70 backdrop-blur-md border border-kawai-neutral/20 shadow-brand-subtle rounded-2xl px-6 py-6 hover:shadow-brand-medium hover:bg-white/85 transition-all duration-200"
              >
                <div className="text-[2rem] md:text-[2.5rem] font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-none">
                  {stat.num}
                </div>
                <div className="text-[9px] uppercase tracking-[0.18em] text-kawai-charcoal/45 font-[family-name:var(--font-brand-sans)] mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
