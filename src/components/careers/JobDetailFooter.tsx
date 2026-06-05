import Link from 'next/link'

export function JobDetailFooter() {
  return (
    <section className="relative bg-kawai-pearl border-t border-kawai-neutral/50 overflow-hidden">
      <div
        aria-hidden
        className="absolute pointer-events-none inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 55% at 80% 50%, rgba(213,199,140,0.10) 0%, transparent 60%)',
        }}
      />
      <div className="relative z-10 px-8 md:px-16 lg:px-24 py-16 md:py-24 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="max-w-xl">
          <div className="w-10 h-px bg-kawai-red mb-5" />
          <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-tight">
            Don&rsquo;t see your role?
          </h2>
          <p className="mt-3 text-kawai-charcoal/70 font-[family-name:var(--font-brand-sans)] leading-relaxed">
            We&rsquo;re always looking for people who build things that last. Browse every open position across sales, technology, service, and more.
          </p>
        </div>
        <Link
          href="/careers#openings"
          className="group inline-flex items-center gap-2.5 bg-kawai-black hover:bg-kawai-charcoal text-white rounded-full py-3.5 px-7 text-[13px] uppercase tracking-[0.14em] font-semibold font-[family-name:var(--font-brand-sans)] shadow-brand-medium transition-colors"
        >
          View all open positions
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
            <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
