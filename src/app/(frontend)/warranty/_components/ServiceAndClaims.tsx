interface ServiceAndClaimsProps {
  /** "full" (boxed card, detail pages) or "inline" (single line, hub) */
  variant?: 'full' | 'inline'
}

export function ServiceAndClaims({ variant = 'full' }: ServiceAndClaimsProps) {
  if (variant === 'inline') {
    return (
      <p className="text-[14px] text-kawai-charcoal/70">
        <span className="font-medium text-kawai-charcoal">Service &amp; claims:</span>{' '}
        Contact your authorized dealer or Kawai Technical Services at{' '}
        <a href="tel:+18004212177" className="text-kawai-red hover:underline">
          1-800-421-2177
        </a>
        . Authorization required prior to any warranty repair.
      </p>
    )
  }

  return (
    <section id="service" className="scroll-mt-[8rem]">
      <h2 className="text-[11px] font-semibold uppercase tracking-widest text-kawai-charcoal/40 mb-4">
        Service &amp; Claims
      </h2>
      <div className="text-[15px] text-kawai-charcoal/75 leading-relaxed space-y-3 max-w-2xl">
        <p>
          Warranty service is performed exclusively through Kawai&apos;s Authorized Service
          Provider network. To initiate a claim, contact your nearest authorized dealer or reach
          Kawai America Corporation directly.
        </p>
        <p>
          <span className="font-medium text-kawai-charcoal">Phone</span>{' '}
          <a href="tel:+18004212177" className="text-kawai-red hover:underline">
            1-800-421-2177
          </a>
          {'  ·  '}
          <span className="font-medium text-kawai-charcoal">Address</span>{' '}
          2055 East University Drive, Rancho Dominguez, CA 90220
        </p>
        <p className="text-[13px] text-kawai-charcoal/50">
          Do not return any product without a written Return Authorization issued in advance by
          Kawai.
        </p>
      </div>
    </section>
  )
}
