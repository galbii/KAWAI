import React from 'react'
import { cn } from '@/lib/utils'

interface OfferItem {
  icon: 'gift' | 'percent' | 'truck' | 'shield' | 'award' | 'star'
  title: string
  description?: string
}

interface ScheduleItem {
  dayLabel: string
  dateLabel: string
  hours: string
  highlight?: boolean
}

interface UniversityEventDetailsRendererProps {
  block: {
    sectionHeading?: string
    locationName?: string
    eventStartDate?: string
    eventEndDate?: string
    showCountdownLink?: boolean
    offers?: OfferItem[]
    schedule?: ScheduleItem[]
  }
}

// Icon components (inline SVG to avoid dependency on any icon package)
const ICONS: Record<string, React.ReactNode> = {
  gift: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a4 4 0 00-4-4H6a2 2 0 00-2 2v2m8 0H4m8 0h8m0 0V6a4 4 0 014 4v2M4 10h16v10a2 2 0 01-2 2H6a2 2 0 01-2-2V10z" />
    </svg>
  ),
  percent: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
    </svg>
  ),
  truck: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0zM1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6" />
    </svg>
  ),
  shield: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  award: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  star: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
}

function formatEventDate(dateStr?: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

export const UniversityEventDetailsRenderer: React.FC<UniversityEventDetailsRendererProps> = ({ block }) => {
  const { sectionHeading, locationName, eventStartDate, eventEndDate, offers = [], schedule = [] } = block

  return (
    <section id="event" className="py-20 bg-gradient-to-br from-kawai-pearl to-white relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-kawai-red/5 rounded-full -translate-y-48 translate-x-48 pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-kawai-red/3 rounded-full translate-y-40 -translate-x-40 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          {sectionHeading && (
            <h2 className="text-4xl md:text-5xl font-bold text-kawai-black mb-4 tracking-tight">
              {sectionHeading}
            </h2>
          )}
          <div className="w-24 h-1 bg-kawai-red mx-auto mb-6 rounded-full" />
          {(eventStartDate || eventEndDate) && (
            <p className="text-lg text-kawai-charcoal font-medium">
              {formatEventDate(eventStartDate)}
              {eventEndDate && eventEndDate !== eventStartDate && (
                <> &ndash; {formatEventDate(eventEndDate)}</>
              )}
            </p>
          )}
          {locationName && (
            <p className="text-base text-kawai-charcoal/70 mt-2">{locationName}</p>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Schedule card */}
          {schedule.length > 0 && (
            <div className="bg-white rounded-3xl p-8 shadow-brand-medium">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-kawai-red rounded-full flex items-center justify-center mr-4 shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-kawai-black">Event Schedule</h3>
              </div>

              <div className="space-y-3">
                {schedule.map((item, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex flex-wrap justify-between items-center gap-2 p-4 rounded-xl transition-colors',
                      item.highlight
                        ? 'bg-kawai-red/10 border-l-4 border-kawai-red'
                        : 'bg-kawai-pearl hover:bg-kawai-red/5'
                    )}
                  >
                    <div>
                      <span className="font-semibold text-kawai-black block leading-tight">{item.dayLabel}</span>
                      <span className="text-sm text-kawai-charcoal/70">{item.dateLabel}</span>
                    </div>
                    <span className="text-kawai-charcoal font-medium">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Offers card */}
          {offers.length > 0 && (
            <div className="bg-white rounded-3xl p-8 shadow-brand-medium">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-kawai-gold rounded-full flex items-center justify-center mr-4 shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-kawai-black">Exclusive Offers</h3>
              </div>

              <div className="space-y-3">
                {offers.map((offer, i) => (
                  <div
                    key={i}
                    className="flex items-start p-4 rounded-xl bg-kawai-pearl hover:bg-kawai-red/5 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-kawai-red/10 rounded-lg flex items-center justify-center mr-4 shrink-0 text-kawai-red group-hover:bg-kawai-red group-hover:text-white transition-colors">
                      {ICONS[offer.icon] ?? ICONS.star}
                    </div>
                    <div>
                      <h4 className="font-semibold text-kawai-black leading-tight">{offer.title}</h4>
                      {offer.description && (
                        <p className="text-sm text-kawai-charcoal/70 mt-0.5">{offer.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
