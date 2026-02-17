import Link from 'next/link'

interface DealerHeroProps {
  dealerName: string | null | undefined
  city: string | null | undefined
  state: string | null | undefined
  isFeatured?: boolean | null
  yearEstablished?: number | null
}

export function DealerHero({
  dealerName,
  city,
  state,
  isFeatured,
  yearEstablished,
}: DealerHeroProps) {
  const displayName = dealerName?.trim() ?? 'Dealer'
  const location = [city?.trim(), state?.trim()].filter(Boolean).join(', ')

  return (
    <section className="bg-kawai-black pt-24 pb-16 sm:pt-32 sm:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8 sm:mb-10" aria-label="Breadcrumb">
          <Link
            href="/"
            className="text-kawai-pearl/50 hover:text-kawai-pearl text-xs tracking-[0.15em] uppercase transition-colors"
          >
            Home
          </Link>
          <span className="text-kawai-pearl/25 text-xs">/</span>
          <Link
            href="/find-a-dealer"
            className="text-kawai-pearl/50 hover:text-kawai-pearl text-xs tracking-[0.15em] uppercase transition-colors"
          >
            Dealers
          </Link>
          <span className="text-kawai-pearl/25 text-xs">/</span>
          <span className="text-kawai-pearl/30 text-xs tracking-[0.15em] uppercase">
            {location || displayName}
          </span>
        </nav>

        {/* Dealer identity */}
        <div className="space-y-3">
          {(yearEstablished || isFeatured) && (
            <div className="flex items-center gap-4">
              {yearEstablished && (
                <span className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase">
                  Est. {yearEstablished}
                </span>
              )}
              {isFeatured && (
                <span className="text-xs text-kawai-pearl/50 font-medium tracking-[0.2em] uppercase">
                  Featured
                </span>
              )}
            </div>
          )}
          <h1 className="font-serif font-light text-kawai-pearl leading-tight tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            {displayName}
          </h1>
          {location && (
            <p className="text-kawai-pearl/60 text-base sm:text-lg font-light tracking-wide">
              {location}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
