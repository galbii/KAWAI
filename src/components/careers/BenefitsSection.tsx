const BENEFITS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Health & Wellness',
    desc: 'Comprehensive medical, dental, and vision coverage from day one. Plus wellness reimbursement.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Flexible Work',
    desc: 'Hybrid schedules for qualifying roles. We trust you to do your best work, wherever that is.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    title: 'Global Team',
    desc: 'Work alongside colleagues across North America, Japan, and Europe — a truly international team.',
  },
]

export function BenefitsSection() {
  return (
    <section className="bg-kawai-pearl py-28 md:py-36 px-8 md:px-16 lg:px-24 border-t border-kawai-neutral/50">
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <div className="w-10 h-px bg-kawai-red mb-8" />
            <h2 className="text-[2.25rem] md:text-[2.75rem] font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-tight">
              Working Here
            </h2>
          </div>
          <p className="text-sm text-kawai-charcoal/50 font-[family-name:var(--font-brand-sans)] max-w-xs leading-relaxed md:text-right">
            Benefits designed for people who care deeply about their craft.
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-kawai-neutral/50">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="group relative p-8 md:p-10 bg-kawai-pearl hover:bg-white transition-colors duration-200"
            >
              {/* Top accent line on hover */}
              <div className="absolute top-0 left-8 right-8 h-px bg-kawai-red scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />

              {/* Icon */}
              <div className="text-kawai-red mb-5 opacity-80 group-hover:opacity-100 transition-opacity">
                {benefit.icon}
              </div>

              <h3 className="text-lg font-[family-name:var(--font-brand-luxury)] text-kawai-black mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-kawai-charcoal/60 font-[family-name:var(--font-brand-sans)] leading-relaxed">
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
