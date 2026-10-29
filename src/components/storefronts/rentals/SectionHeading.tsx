export const SERIF = 'var(--font-crimson), Georgia, serif'

/** Clears the fixed header plus the rentals page's sticky section nav. */
export const RENTAL_SECTION_SCROLL_MARGIN = 'scroll-mt-[calc(var(--header-bottom,70px)_+_4.5rem)]'

/** Underlined uppercase text link — the quiet secondary CTA on rental pages. */
export const TEXT_LINK =
  'inline-flex items-center gap-2 border-b border-kawai-black/30 pb-px text-[11px] font-medium uppercase tracking-[0.2em] text-kawai-black transition-colors duration-300 hover:border-kawai-red hover:text-kawai-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-kawai-red'

/** Red-pill primary CTA. */
export const PILL =
  'inline-flex items-center justify-center rounded-full bg-kawai-red px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-300 hover:bg-kawai-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red'

/** Red-rule label + light Crimson heading — the homepage section header. */
export function SectionHeading({
  label,
  action,
  children,
}: {
  label: string
  /** Optional link aligned to the heading's right on wider screens. */
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between md:gap-10">
      <div>
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
      {action && <div className="shrink-0 md:pb-2">{action}</div>}
    </div>
  )
}
