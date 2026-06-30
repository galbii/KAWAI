import Link from 'next/link'

/* ─── Maintenance notice ──────────────────────────────────────────────────
   Temporary stand-in for the Serial Number Lookup tool. Rendered by
   `serial-number/page.tsx` while the lookup is offline. To restore the tool,
   swap this component back for <SerialNumberLookup /> in that page and revert
   the `robots` metadata to index/follow. */

export function SerialNumberMaintenance() {
  return (
    <div className="min-h-screen bg-kawai-pearl font-[family-name:var(--font-brand-sans)] flex flex-col">
      {/* Brand rule */}
      <div className="h-[3px] bg-kawai-red w-full" />

      <div className="flex-1 flex items-center justify-center px-5 sm:px-6 py-16">
        <div className="w-full max-w-xl text-center">
          <img
            src="/images/logos/kawai-logo-new-red.png"
            alt="Kawai"
            className="h-7 w-auto mx-auto mb-10"
          />

          <h1 className="text-3xl sm:text-4xl font-semibold text-kawai-black tracking-[-0.02em] leading-tight">
            We&rsquo;ll be back soon
          </h1>

          <p className="mt-5 text-lg text-kawai-charcoal leading-relaxed">
            The Serial Number Lookup is temporarily down for maintenance.
            Please check back shortly.
          </p>

          <p className="mt-4 text-base text-kawai-charcoal/75 leading-relaxed max-w-md mx-auto">
            In the meantime, your authorized Kawai dealer can help identify your
            piano&rsquo;s production year from its serial number.
          </p>

          {/* Actions */}
          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/find-a-dealer"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-md text-base font-medium text-white bg-kawai-red hover:bg-kawai-red-700 active:bg-kawai-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red/40 focus-visible:ring-offset-2 transition-colors"
            >
              Find a Dealer
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-md text-base font-medium text-kawai-charcoal border border-kawai-neutral hover:border-kawai-red/50 hover:text-kawai-red focus:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red/30 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
