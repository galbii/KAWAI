export const SERIF = 'var(--font-crimson), Georgia, serif'

/** Red-rule label + light Crimson heading — the homepage section header. */
export function SectionHeading({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-8 md:mb-12">
      <div className="mb-4 flex items-center gap-3">
        <span className="block h-px w-6 bg-kawai-red" />
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-kawai-charcoal/60">{label}</p>
      </div>
      <h2
        className="font-light leading-tight text-kawai-black"
        style={{ fontFamily: SERIF, fontSize: 'clamp(1.9rem, 3.4vw, 3rem)', letterSpacing: '-0.02em' }}
      >
        {children}
      </h2>
    </div>
  )
}
