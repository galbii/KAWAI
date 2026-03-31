import { cn } from '@/lib/utils'

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

const PILLARS = [
  {
    num: '01',
    title: 'Craft',
    desc: "Attention to detail is our culture — whether you're voicing a concert grand or shipping a line of code.",
  },
  {
    num: '02',
    title: 'Legacy',
    desc: 'Nearly a century of expertise. Everything we build here adds to something that was already great.',
  },
  {
    num: '03',
    title: 'Reach',
    desc: 'Our instruments are played in over 180 countries. Your work reaches musicians on every continent.',
  },
  {
    num: '04',
    title: 'Innovation',
    desc: 'Japanese precision meets modern technology. We bridge a century of tradition with the future of music.',
  },
]

const STATS = [
  { num: '100', label: 'Years of Craft' },
  { num: '180+', label: 'Countries' },
  { num: '100K+', label: 'Instruments Yearly' },
  { num: '1927', label: 'Founded' },
]

export function LifeAtKawai() {
  return (
    <>
      {/* ── Values + Culture (White) ─────────────────────────────── */}
      <section
        id="life"
        className="bg-white py-28 md:py-36 px-8 md:px-16 lg:px-24 overflow-hidden"
      >
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: Intro copy */}
          <div className="lg:sticky lg:top-24">
            <div className="w-10 h-px bg-kawai-red mb-10" />
            <h2 className="text-[2.25rem] md:text-[2.75rem] leading-[1.05] font-[family-name:var(--font-brand-luxury)] text-kawai-black mb-8">
              What it means
              <br />
              to work at Kawai.
            </h2>
            <p className="text-kawai-charcoal/60 font-[family-name:var(--font-brand-sans)] text-base leading-relaxed max-w-sm mb-10">
              We&apos;re a century-old company with the mindset of a craftsman&apos;s studio.
              Every role — from engineering to customer experience — shapes how music
              is made and heard around the world.
            </p>
            <p className="text-kawai-charcoal/45 font-[family-name:var(--font-brand-sans)] text-sm leading-relaxed max-w-sm">
              Our teams in North America work closely with craftspeople, engineers, and
              musicians in Japan and across Europe. The result is a workplace where the
              music industry&apos;s highest standards apply to everything we do.
            </p>
          </div>

          {/* Right: Pillars */}
          <div>
            {PILLARS.map((pillar, i) => (
              <div
                key={pillar.num}
                className={cn(
                  'flex gap-6 py-9',
                  i < PILLARS.length - 1 && 'border-b border-kawai-neutral/60',
                )}
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

      {/* ── Culture Quote + Stats (Black) ────────────────────────── */}
      <section className="relative bg-kawai-black overflow-hidden">
        {/* Grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: GRAIN_SVG }}
        />

        {/* Red top border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-kawai-red" />

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-20 h-20 opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" className="text-white w-full h-full">
            <line x1="0" y1="30" x2="30" y2="30" stroke="currentColor" strokeWidth="1" />
            <line x1="30" y1="0" x2="30" y2="30" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-20 h-20 opacity-10 rotate-180 pointer-events-none">
          <svg viewBox="0 0 100 100" className="text-white w-full h-full">
            <line x1="0" y1="30" x2="30" y2="30" stroke="currentColor" strokeWidth="1" />
            <line x1="30" y1="0" x2="30" y2="30" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>

        <div className="relative z-10 px-8 md:px-16 lg:px-24 py-28 md:py-36 max-w-screen-xl mx-auto">
          {/* Red rule */}
          <div className="w-12 h-px bg-kawai-red mb-14" />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 lg:gap-24 items-end">
            {/* Value proposition */}
            <div className="max-w-3xl">
              <h2 className="text-[2rem] md:text-[2.5rem] lg:text-[3rem] font-[family-name:var(--font-brand-luxury)] text-white leading-[1.2] mb-6">
                A century of craft.<br />
                <span className="text-kawai-red">Built for the next century.</span>
              </h2>
              <p className="text-white/50 font-[family-name:var(--font-brand-sans)] text-base leading-relaxed max-w-lg">
                Kawai has been shaping how the world experiences music since 1927. Join a team where your work contributes to instruments played by millions of musicians across 180+ countries.
              </p>
            </div>

            {/* Attribution */}
            <div className="lg:pb-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-[family-name:var(--font-brand-sans)]">
                Kawai Musical Instruments
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-[family-name:var(--font-brand-sans)] mt-1">
                Est. 1927, Hamamatsu Japan
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-16 pt-12 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="text-[2rem] md:text-[2.5rem] font-[family-name:var(--font-brand-luxury)] text-white leading-none">
                  {stat.num}
                </div>
                <div className="text-[9px] uppercase tracking-[0.18em] text-white/35 font-[family-name:var(--font-brand-sans)] mt-2">
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
