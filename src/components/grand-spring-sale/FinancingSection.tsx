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

interface FinancingSectionProps {
  exampleMsrp?: number
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export function FinancingSection({ exampleMsrp = 9995 }: FinancingSectionProps) {
  const monthlyPayment = Math.ceil(exampleMsrp / 36)

  return (
    <section className="border-y border-white/20">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        {/* Section label */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <SakuraIcon className="w-4 h-4 text-kawai-red/60" />
          <p className="text-kawai-red/60 text-xs tracking-[0.2em] uppercase font-medium">
            Spring Financing Offer
          </p>
        </div>

        {/* Headline */}
        <h2 className="text-center text-4xl md:text-5xl font-semibold font-[family-name:var(--font-brand-serif)] text-kawai-black mb-4">
          The math is simpler than you think.
        </h2>
        <p className="text-center text-kawai-charcoal/70 max-w-xl mx-auto mb-14 text-xl">
          We built this offer specifically to make grand piano ownership accessible —
          not as a gimmick, but as a genuine path to the instrument you&apos;ve always wanted.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 divide-x divide-kawai-neutral border border-kawai-neutral bg-white rounded-lg shadow-brand-subtle mb-10 overflow-hidden">
          {[
            { value: '0%', label: 'Financing', sub: '36 months, no interest' },
            { value: 'Sale', label: 'Spring Discounts', sub: 'On select grand pianos' },
            { value: '+$500', label: 'Trade-In Bonus', sub: 'Over any appraisal' },
          ].map(({ value, label, sub }) => (
            <div key={label} className="py-10 px-6 text-center">
              <div className="text-4xl md:text-5xl font-light font-[family-name:var(--font-brand-serif)] text-kawai-black mb-2">
                {value}
              </div>
              <div className="text-kawai-black text-sm font-medium tracking-wide mb-1">{label}</div>
              <div className="text-kawai-charcoal/50 text-xs">{sub}</div>
            </div>
          ))}
        </div>

        {/* Example calculation */}
        <div className="bg-white border border-kawai-neutral/60 rounded-lg p-6 md:p-8 max-w-2xl mx-auto shadow-brand-subtle">
          <div className="flex items-center justify-center gap-1.5 mb-4">
            <SakuraIcon className="w-3 h-3 text-kawai-red/60" />
            <p className="text-kawai-red/60 text-xs tracking-[0.2em] uppercase font-medium">
              Example calculation
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
            <div className="text-center">
              <div className="text-2xl font-light text-kawai-black font-[family-name:var(--font-brand-serif)]">
                {formatCurrency(exampleMsrp)}
              </div>
              <div className="text-xs text-kawai-charcoal/50 mt-1">Grand piano MSRP</div>
            </div>
            <div className="text-kawai-charcoal/30 text-2xl font-light">=</div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-kawai-red font-[family-name:var(--font-brand-serif)]">
                {formatCurrency(monthlyPayment)}<span className="text-base font-normal">/mo</span>
              </div>
              <div className="text-xs text-kawai-charcoal/50 mt-1">for 36 months at 0% APR</div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-kawai-charcoal/40 text-xs mt-8 max-w-lg mx-auto leading-relaxed">
          †Financing subject to credit approval through participating lenders. 0% APR for 36 months available on
          qualifying grand piano purchases. See store for complete details and eligibility.
        </p>
      </div>
    </section>
  )
}
