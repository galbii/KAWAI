const TECH_PILLARS = [
  {
    id: 'action',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.651a3.75 3.75 0 0 1 0-5.303m5.304-.001a3.75 3.75 0 0 1 0 5.304m-7.425 2.122a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12Z" />
      </svg>
    ),
    title: 'Millennium III Action',
    subtitle: 'ABS Styran & WNG Technology',
    body: 'Kawai\'s grand piano actions use ABS Styran composite components — lighter and more dimensionally stable than wood. Combined with Wessell, Nickel & Gross grand action components in select models, they deliver a touch that world-class pianists trust on stage.',
  },
  {
    id: 'keys',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    title: 'NEOTEX Key Surface',
    subtitle: 'Premium synthetic ivory & ebony',
    body: 'NEOTEX, Kawai\'s proprietary key surface material, mimics the moisture-absorbing texture of real ivory without any of the ethical or durability concerns. Your fingertips stay gripped and controlled through long practice sessions — exactly as the key material should work.',
  },
  {
    id: 'sound',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
      </svg>
    ),
    title: 'Hand-Selected Spruce Soundboards',
    subtitle: 'Responsive tone at every dynamic',
    body: 'Each Kawai grand piano soundboard is crafted from carefully selected spruce. The grain density and arching are calibrated for maximum resonance and sustain — producing the full, singing tone that distinguishes a concert-quality grand from everything else in the room.',
  },
  {
    id: 'craftsmanship',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    ),
    title: '70+ Years of Grand Piano Craft',
    subtitle: 'Ryuyo, Japan — where every Kawai grand is born',
    body: 'Kawai has been building grand pianos in Hamamatsu, Japan since 1927. Every Kawai grand undergoes extensive voicing, regulation, and quality control before it leaves the factory — a process that takes weeks, not hours. That attention to craft is what you hear and feel.',
  },
]

export function TechnologySection() {
  return (
    <section className="py-16 md:py-24 bg-kawai-black/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-kawai-red/60" aria-hidden>
              {[0, 72, 144, 216, 288].map((deg) => (
                <g key={deg} transform={`rotate(${deg} 20 20)`}>
                  <ellipse cx="20" cy="11" rx="5" ry="9" fill="currentColor" fillOpacity="0.9" />
                  <ellipse cx="20" cy="5.5" rx="2" ry="2.5" fill="white" fillOpacity="0.35" />
                </g>
              ))}
              <circle cx="20" cy="20" r="4" fill="white" fillOpacity="0.5" />
              <circle cx="20" cy="20" r="2.5" fill="currentColor" />
            </svg>
            <p className="text-kawai-red/60 text-xs tracking-[0.2em] uppercase font-medium">
              Built Different
            </p>
          </div>
          <h2 className="text-3xl md:text-4xl font-light font-[family-name:var(--font-brand-luxury)] text-white mb-4">
            Why a Kawai grand?
          </h2>
          <p className="text-kawai-pearl/50 max-w-xl mx-auto text-lg font-light">
            Four principles that separate a Kawai from every other instrument in its class.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TECH_PILLARS.map(({ id, icon, title, subtitle, body }) => (
            <div
              key={id}
              className="bg-white/[0.04] rounded-lg border border-white/8 p-8 md:p-10 hover:bg-white/[0.07] hover:border-white/[0.12] transition-all group"
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-kawai-red/10 flex items-center justify-center text-kawai-red group-hover:bg-kawai-red/15 transition-colors">
                  {icon}
                </div>
                <div>
                  <h3 className="text-white text-lg font-medium mb-1 font-[family-name:var(--font-brand-serif)]">
                    {title}
                  </h3>
                  <p className="text-kawai-red/60 text-xs tracking-[0.2em] uppercase font-medium mb-4">{subtitle}</p>
                  <p className="text-kawai-pearl/50 text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footnote link */}
        <p className="text-center mt-12">
          <a
            href="/pianos/grand"
            className="inline-flex items-center gap-2.5 text-kawai-pearl/40 hover:text-kawai-pearl/70 text-sm transition-colors group"
          >
            Explore the full grand piano collection
            <div className="w-6 h-6 rounded-full border border-kawai-pearl/20 group-hover:border-kawai-red group-hover:bg-kawai-red flex items-center justify-center transition-all">
              <svg className="w-3 h-3 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </a>
        </p>
      </div>
    </section>
  )
}
