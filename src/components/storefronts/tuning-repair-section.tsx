import { cn } from '@/lib/utils'

interface TuningService {
  name: string
  description?: string
  icon?: 'wrench' | 'settings' | 'music' | 'shield' | 'award' | 'sparkle' | 'piano'
}

interface TuningRepairData {
  tuningRepairEnabled?: boolean
  tuningRepairTitle?: string
  tuningRepairDescription?: string
  tuningFrequency?: string
  tuningServices?: TuningService[]
  tuningContactPhone?: string
  tuningContactNote?: string
  serviceCtaText?: string
  serviceCtaLink?: string
}

interface TuningRepairSectionProps {
  data: TuningRepairData
}

function ServiceIcon({ icon }: { icon?: TuningService['icon'] }) {
  switch (icon) {
    case 'wrench':
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
          />
        </svg>
      )
    case 'settings':
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    case 'shield':
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
      )
    case 'award':
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
          />
        </svg>
      )
    case 'sparkle':
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
          />
        </svg>
      )
    case 'music':
    case 'piano':
    default:
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      )
  }
}

export function TuningRepairSection({ data }: TuningRepairSectionProps) {
  if (!data.tuningRepairEnabled) return null
  if (!data.tuningServices || data.tuningServices.length === 0) return null

  const title = data.tuningRepairTitle || 'Tuning & Repair'

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-4">
            Piano Care
          </div>
          <h2 className="text-4xl md:text-5xl font-light font-serif text-kawai-black mb-6 leading-tight">
            {title}
          </h2>
          {data.tuningRepairDescription && (
            <p className="text-lg text-kawai-black/65 max-w-2xl mx-auto leading-relaxed">
              {data.tuningRepairDescription}
            </p>
          )}
          <div className="w-16 h-px bg-kawai-red mx-auto mt-8" />
        </div>

        {/* Services Grid */}
        <div
          className={cn(
            'grid gap-6 mb-12',
            data.tuningServices.length === 1
              ? 'max-w-sm mx-auto'
              : data.tuningServices.length === 2
                ? 'md:grid-cols-2 max-w-2xl mx-auto'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
          )}
        >
          {data.tuningServices.map((service, index) => (
            <div
              key={index}
              className="bg-kawai-pearl border border-kawai-neutral rounded-xl p-7 flex gap-5 hover:shadow-md hover:border-kawai-red/30 transition-all duration-300 group"
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-kawai-red rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                  <ServiceIcon icon={service.icon} />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-kawai-black mb-2 leading-snug">
                  {service.name}
                </h3>
                {service.description && (
                  <p className="text-sm text-kawai-black/60 leading-relaxed">
                    {service.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tuning Frequency Callout */}
        {data.tuningFrequency && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-7 mb-10 flex items-start gap-5">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-800 mb-1 uppercase tracking-wide">
                Recommended Tuning Frequency
              </p>
              <p className="text-sm text-amber-700 leading-relaxed">
                {data.tuningFrequency}
              </p>
            </div>
          </div>
        )}

        {/* Contact + CTA Row */}
        {(data.tuningContactPhone || data.tuningContactNote || data.serviceCtaText) && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-kawai-neutral">
            {/* Contact Info */}
            <div className="flex flex-col gap-2 text-sm">
              {data.tuningContactPhone && (
                <a
                  href={`tel:${data.tuningContactPhone}`}
                  className="inline-flex items-center gap-2 text-kawai-charcoal hover:text-kawai-red font-medium transition-colors"
                >
                  <svg className="w-4 h-4 text-kawai-red flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                  {data.tuningContactPhone}
                </a>
              )}
              {data.tuningContactNote && (
                <p className="text-kawai-black/55 italic">{data.tuningContactNote}</p>
              )}
            </div>

            {/* CTA */}
            {data.serviceCtaText && (
              <a
                href={data.serviceCtaLink || '#'}
                className="inline-flex items-center gap-3 bg-kawai-red hover:bg-kawai-black text-white px-8 py-4 rounded-lg font-medium text-sm tracking-wide uppercase transition-all duration-300 shadow-lg hover:shadow-xl group flex-shrink-0"
              >
                <span>{data.serviceCtaText}</span>
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
            )}
          </div>
        )}
      </div>
    </section>
  )
}
