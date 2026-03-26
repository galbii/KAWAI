import { cn } from '@/lib/utils'

interface FacilityVenue {
  name: string
  capacity?: number
  description?: string
  stageDimensions?: string
  availablePianos?: { model: string; description?: string }[]
  useCases?: { useCase: string }[]
  image?: any
}

interface FacilityRentalsData {
  facilityRentalsEnabled?: boolean
  facilityRentalsTitle?: string
  facilityRentalsDescription?: string
  facilities?: FacilityVenue[]
  pricingNote?: string
  pricingContactPhone?: string
  pricingContactEmail?: string
  facilityCtaText?: string
  facilityCtaLink?: string
}

interface FacilityRentalsSectionProps {
  data: FacilityRentalsData
}

export function FacilityRentalsSection({ data }: FacilityRentalsSectionProps) {
  if (!data.facilityRentalsEnabled) return null
  if (!data.facilities || data.facilities.length === 0) return null

  const title = data.facilityRentalsTitle || 'Facility Rentals'

  return (
    <section className="bg-kawai-black py-20 md:py-28">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-4">
            Venue & Facilities
          </div>
          <h2 className="text-4xl md:text-5xl font-light font-serif text-white mb-6 leading-tight">
            {title}
          </h2>
          {data.facilityRentalsDescription && (
            <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
              {data.facilityRentalsDescription}
            </p>
          )}
          <div className="w-16 h-px bg-kawai-red mx-auto mt-8" />
        </div>

        {/* Facility Cards */}
        <div className="space-y-8 mb-14">
          {data.facilities.map((facility, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 group"
            >
              <div className="flex flex-col md:flex-row">
                {/* Left: Info Panel */}
                <div className="flex-1 p-8 md:p-10">
                  {/* Name + Capacity Row */}
                  <div className="flex flex-wrap items-start gap-4 mb-5">
                    <h3 className="text-2xl md:text-3xl font-light font-serif text-white flex-1 leading-tight">
                      {facility.name}
                    </h3>
                    {facility.capacity != null && (
                      <span className="inline-flex items-center gap-1.5 bg-kawai-red text-white text-xs font-bold tracking-[0.12em] uppercase px-3 py-1.5 rounded-full flex-shrink-0">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                        </svg>
                        {facility.capacity} seats
                      </span>
                    )}
                  </div>

                  <div className="w-10 h-px bg-kawai-red mb-6 group-hover:w-20 transition-all duration-500" />

                  {facility.description && (
                    <p className="text-white/65 leading-relaxed mb-6 text-sm md:text-base">
                      {facility.description}
                    </p>
                  )}

                  {/* Stage Dimensions */}
                  {facility.stageDimensions && (
                    <div className="flex items-center gap-3 mb-6 text-sm text-white/50">
                      <svg
                        className="w-4 h-4 text-white/30 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                        />
                      </svg>
                      <span>
                        Stage: <span className="text-white/70 font-medium">{facility.stageDimensions}</span>
                      </span>
                    </div>
                  )}

                  {/* Available Pianos */}
                  {facility.availablePianos && facility.availablePianos.length > 0 && (
                    <div className="mb-6">
                      <p className="text-xs text-white/40 font-medium uppercase tracking-[0.15em] mb-3">
                        Available Instruments
                      </p>
                      <div className="space-y-2">
                        {facility.availablePianos.map((piano, pi) => (
                          <div key={pi} className="flex items-start gap-2 text-sm">
                            <span className="text-kawai-red mt-0.5 flex-shrink-0">
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                              </svg>
                            </span>
                            <span>
                              <span className="text-white/80 font-medium">{piano.model}</span>
                              {piano.description && (
                                <span className="text-white/45 ml-2">— {piano.description}</span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Use Case Tags */}
                  {facility.useCases && facility.useCases.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {facility.useCases.map((uc, ui) => (
                        <span
                          key={ui}
                          className="inline-block bg-kawai-red/15 border border-kawai-red/30 text-kawai-red text-xs font-medium tracking-wide px-3 py-1 rounded-full"
                        >
                          {uc.useCase}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Decorative accent column */}
                <div className="hidden md:flex md:w-2 bg-gradient-to-b from-kawai-red/40 via-kawai-red/20 to-transparent flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Callout */}
        {(data.pricingNote || data.pricingContactPhone || data.pricingContactEmail) && (
          <div className="bg-white/5 border border-kawai-red/20 rounded-xl p-8 mb-10">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-kawai-red/15 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-kawai-red"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs text-white/40 font-medium uppercase tracking-[0.15em] mb-1">
                  Pricing Information
                </p>
                {data.pricingNote && (
                  <p className="text-white/75 text-sm leading-relaxed">
                    {data.pricingNote}
                  </p>
                )}
              </div>
              {(data.pricingContactPhone || data.pricingContactEmail) && (
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {data.pricingContactPhone && (
                    <a
                      href={`tel:${data.pricingContactPhone}`}
                      className="inline-flex items-center gap-2 text-white hover:text-kawai-red text-sm font-medium transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                      </svg>
                      {data.pricingContactPhone}
                    </a>
                  )}
                  {data.pricingContactEmail && (
                    <a
                      href={`mailto:${data.pricingContactEmail}`}
                      className="inline-flex items-center gap-2 text-white hover:text-kawai-red text-sm font-medium transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                      </svg>
                      {data.pricingContactEmail}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CTA Button */}
        {data.facilityCtaText && (
          <div className="text-center">
            <a
              href={data.facilityCtaLink || '#'}
              className="inline-flex items-center gap-3 bg-kawai-red hover:bg-white hover:text-kawai-black text-white px-8 py-4 rounded-lg font-medium text-sm tracking-wide uppercase transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <span>{data.facilityCtaText}</span>
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
