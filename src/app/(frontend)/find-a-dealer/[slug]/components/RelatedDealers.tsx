import Link from 'next/link'

interface DealerInfo {
  slug: string
  dealerName: string
  address: {
    city: string
    state: string
  }
  distance: number
  dealerType?: string[]
}

interface RelatedDealersProps {
  dealers: DealerInfo[]
  currentCity?: string | null
}

const DEALER_TYPE_LABELS: Record<string, string> = {
  'professional-products': 'Professional Products',
  'acoustic-digital': 'Acoustic & Digital',
}

export function RelatedDealers({ dealers, currentCity }: RelatedDealersProps) {
  if (!dealers || dealers.length === 0) return null

  const limitedDealers = dealers.slice(0, 3)
  const nearCity = currentCity?.trim() || limitedDealers[0]?.address?.city || 'you'

  return (
    <section className="bg-[#F5F5F5] py-16 sm:py-24 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
      <div className="container mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-10 sm:mb-14">
          <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-4">
            Nearby Dealers
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light font-serif text-kawai-black leading-tight">
            Other dealers near{' '}
            <span className="text-kawai-red">{nearCity}</span>
          </h2>
        </div>

        {/* Cards — matches homepage dealer location cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {limitedDealers.map((dealer) => (
            <Link
              key={dealer.slug}
              href={`/find-a-dealer/${dealer.slug}`}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105 touch-manipulation block"
            >
              <div className="p-6 sm:p-8 flex flex-col h-full">
                {/* Card header */}
                <div className="mb-4 sm:mb-6">
                  <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-2">
                    {dealer.address.city}, {dealer.address.state}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-kawai-black mb-2 group-hover:text-kawai-red transition-colors leading-tight uppercase">
                    {dealer.dealerName}
                  </h3>
                  <div className="w-12 h-px bg-kawai-red opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Distance */}
                <div className="mb-4 flex items-center space-x-3">
                  <div className="w-5 h-5 bg-kawai-red/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-kawai-red" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm text-kawai-black/70">
                    {dealer.distance.toFixed(1)} miles away
                  </p>
                </div>

                {/* Dealer type tags */}
                {dealer.dealerType && dealer.dealerType.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {dealer.dealerType.map((type) => (
                      <span
                        key={type}
                        className="px-2 sm:px-3 py-1 bg-kawai-red/10 text-kawai-red text-xs font-medium rounded-full"
                      >
                        {DEALER_TYPE_LABELS[type] ?? type}
                      </span>
                    ))}
                  </div>
                )}

                {/* CTA — matches homepage card footer */}
                <div className="pt-3 sm:pt-4 border-t border-kawai-pearl mt-auto">
                  <div className="flex items-center justify-between min-h-[44px]">
                    <span className="text-sm font-medium text-kawai-black group-hover:text-kawai-red transition-colors">
                      View Dealer
                    </span>
                    <div className="w-8 h-8 sm:w-6 sm:h-6 bg-kawai-red/10 group-hover:bg-kawai-red rounded-full flex items-center justify-center transition-colors">
                      <svg
                        className="w-4 h-4 sm:w-3 sm:h-3 text-kawai-red group-hover:text-white transition-colors transform group-hover:translate-x-0.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
