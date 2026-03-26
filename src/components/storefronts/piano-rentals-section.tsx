import { cn } from '@/lib/utils'

interface MonthlyRental {
  pianoType: string
  startingPrice: number
  unit: string
  description?: string
  image?: any
}

interface EventRentalRate {
  pianoType: string
  price: number
  durationLabel: string
}

interface PianoRentalsData {
  pianoRentalsEnabled?: boolean
  pianoRentalsTitle?: string
  pianoRentalsDescription?: string
  monthlyRentals?: MonthlyRental[]
  rentToOwn?: {
    enabled?: boolean
    applicationMonths?: number
    minimumRentalMonths?: number
    description?: string
  }
  eventRentals?: {
    enabled?: boolean
    rates?: EventRentalRate[]
    eventTypes?: { eventType: string }[]
    contactPhone?: string
    contactNote?: string
  }
  rentalCtaText?: string
  rentalCtaLink?: string
}

interface PianoRentalsSectionProps {
  data: PianoRentalsData
}

export function PianoRentalsSection({ data }: PianoRentalsSectionProps) {
  if (!data.pianoRentalsEnabled) return null
  if (!data.monthlyRentals || data.monthlyRentals.length === 0) return null

  const title = data.pianoRentalsTitle || 'Piano Rentals'

  return (
    <section className="bg-kawai-pearl py-20 md:py-28">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-4">
            Rental Programs
          </div>
          <h2 className="text-4xl md:text-5xl font-light font-serif text-kawai-black mb-6 leading-tight">
            {title}
          </h2>
          {data.pianoRentalsDescription && (
            <p className="text-lg text-kawai-black/70 max-w-2xl mx-auto leading-relaxed">
              {data.pianoRentalsDescription}
            </p>
          )}
          <div className="w-16 h-px bg-kawai-red mx-auto mt-8" />
        </div>

        {/* Monthly Rental Cards */}
        <div
          className={cn(
            'grid gap-6 mb-12',
            data.monthlyRentals.length === 1
              ? 'md:grid-cols-1 max-w-sm mx-auto'
              : data.monthlyRentals.length === 2
                ? 'md:grid-cols-2 max-w-2xl mx-auto'
                : 'md:grid-cols-3',
          )}
        >
          {data.monthlyRentals.map((rental, index) => (
            <div
              key={index}
              className="bg-white border border-kawai-neutral rounded-xl p-8 flex flex-col hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-kawai-black mb-1 uppercase tracking-wide">
                  {rental.pianoType}
                </h3>
                <div className="w-8 h-px bg-kawai-red mt-3 group-hover:w-16 transition-all duration-300" />
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-kawai-black/50 font-medium uppercase tracking-wide">
                    Starting at
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-bold text-kawai-red">
                    ${rental.startingPrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-kawai-black/60 ml-1">
                    /{rental.unit}
                  </span>
                </div>
              </div>

              {rental.description && (
                <p className="text-sm text-kawai-black/65 leading-relaxed flex-1">
                  {rental.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Rent-to-Own Callout */}
        {data.rentToOwn?.enabled && (
          <div className="bg-kawai-black rounded-xl p-8 md:p-10 mb-10 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-kawai-red/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-kawai-red"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">
                Rent-to-Own Program
              </h3>
              {data.rentToOwn.description ? (
                <p className="text-white/70 text-sm leading-relaxed">
                  {data.rentToOwn.description}
                </p>
              ) : (
                <p className="text-white/70 text-sm leading-relaxed">
                  {data.rentToOwn.minimumRentalMonths
                    ? `Minimum ${data.rentToOwn.minimumRentalMonths} months required. `
                    : ''}
                  {data.rentToOwn.applicationMonths
                    ? `Rental payments can be applied toward purchase within ${data.rentToOwn.applicationMonths} months.`
                    : 'Apply your rental payments toward ownership.'}
                </p>
              )}
            </div>
            <div className="flex-shrink-0">
              <span className="inline-block bg-kawai-red/20 border border-kawai-red/40 text-kawai-red text-xs font-bold tracking-[0.15em] uppercase px-4 py-2 rounded-full">
                Apply Equity
              </span>
            </div>
          </div>
        )}

        {/* Event Rentals */}
        {data.eventRentals?.enabled && (
          <div className="bg-white border border-kawai-neutral rounded-xl p-8 md:p-10 mb-10">
            <div className="mb-6">
              <h3 className="text-2xl font-light font-serif text-kawai-black mb-2">
                Event Rentals
              </h3>
              <div className="w-10 h-px bg-kawai-red" />
            </div>

            {/* Event Types */}
            {data.eventRentals.eventTypes && data.eventRentals.eventTypes.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {data.eventRentals.eventTypes.map((et, i) => (
                  <span
                    key={i}
                    className="inline-block bg-kawai-pearl border border-kawai-neutral text-kawai-charcoal text-xs font-medium tracking-wide uppercase px-3 py-1.5 rounded-full"
                  >
                    {et.eventType}
                  </span>
                ))}
              </div>
            )}

            {/* Rates Table */}
            {data.eventRentals.rates && data.eventRentals.rates.length > 0 && (
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-kawai-neutral">
                      <th className="text-left text-kawai-black font-semibold pb-3 pr-6">
                        Piano Type
                      </th>
                      <th className="text-left text-kawai-black font-semibold pb-3 pr-6">
                        Duration
                      </th>
                      <th className="text-right text-kawai-black font-semibold pb-3">
                        Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.eventRentals.rates.map((rate, i) => (
                      <tr
                        key={i}
                        className="border-b border-kawai-neutral/50 last:border-0 hover:bg-kawai-pearl/50 transition-colors"
                      >
                        <td className="py-3.5 pr-6 text-kawai-charcoal font-medium">
                          {rate.pianoType}
                        </td>
                        <td className="py-3.5 pr-6 text-kawai-black/60">
                          {rate.durationLabel}
                        </td>
                        <td className="py-3.5 text-right font-bold text-kawai-red">
                          ${rate.price.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Event Rentals Contact */}
            {(data.eventRentals.contactPhone || data.eventRentals.contactNote) && (
              <div className="flex items-start gap-3 text-sm text-kawai-black/65 mt-4">
                {data.eventRentals.contactPhone && (
                  <a
                    href={`tel:${data.eventRentals.contactPhone}`}
                    className="inline-flex items-center gap-2 text-kawai-red hover:text-kawai-black font-medium transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                    {data.eventRentals.contactPhone}
                  </a>
                )}
                {data.eventRentals.contactNote && (
                  <span>{data.eventRentals.contactNote}</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* CTA Button */}
        {data.rentalCtaText && (
          <div className="text-center">
            <a
              href={data.rentalCtaLink || '#'}
              className="inline-flex items-center gap-3 bg-kawai-red hover:bg-kawai-black text-white px-8 py-4 rounded-lg font-medium text-sm tracking-wide uppercase transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <span>{data.rentalCtaText}</span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
