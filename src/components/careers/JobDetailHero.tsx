import { Clock, MapPin, CalendarDays } from 'lucide-react'

interface Props {
  title: string
  department?: string | null
  location?: string | null
  type?: string | null
  postedAt?: string | null
}

function formatType(type: string) {
  return type.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatPostedDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function daysSince(date: string) {
  return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
}

export function JobDetailHero({ title, department, location, type, postedAt }: Props) {
  const isNew = postedAt ? daysSince(postedAt) < 14 : false

  return (
    <section className="relative bg-kawai-pearl overflow-hidden">
      {/* Ambient warm orb — pearl-side accent */}
      <div
        aria-hidden
        className="absolute pointer-events-none inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 60% at 12% 25%, rgba(225,25,34,0.05) 0%, transparent 60%), radial-gradient(ellipse 45% 50% at 90% 90%, rgba(213,199,140,0.10) 0%, transparent 60%)',
        }}
      />

      {/* Breadcrumb */}
      <div className="relative z-10 px-8 md:px-16 lg:px-24 pt-12 md:pt-16">
        <a
          href="/careers"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-kawai-charcoal/45 hover:text-kawai-black transition-colors font-[family-name:var(--font-brand-sans)]"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M9 6H3M6 3L3 6l3 3"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Careers{department ? <span className="text-kawai-charcoal/30">{` / ${department}`}</span> : null}
        </a>
      </div>

      {/* Title block */}
      <div className="relative z-10 px-8 md:px-16 lg:px-24 pt-10 md:pt-14 pb-12 md:pb-16">
        <div className="max-w-4xl">
          {/* Red rule + kicker */}
          <div className="flex items-center gap-5 mb-7">
            <span aria-hidden className="w-12 h-px bg-kawai-red" />
            {department && (
              <span className="text-[10px] uppercase tracking-[0.22em] text-kawai-red font-[family-name:var(--font-brand-sans)]">
                {department}
              </span>
            )}
            {isNew && (
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-kawai-red font-[family-name:var(--font-brand-sans)] ml-auto md:ml-3">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-kawai-red opacity-60 animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-kawai-red" />
                </span>
                Just Posted
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-[family-name:var(--font-brand-luxury)] text-kawai-black leading-[1.02] tracking-tight">
            {title}
          </h1>

          {/* Badge pills */}
          {(type || location || postedAt) && (
            <div className="mt-10 flex flex-wrap items-center gap-3">
              {type && (
                <span className="inline-flex items-center gap-2 bg-white border border-kawai-neutral/50 rounded-full px-4 py-2 text-[13px] text-kawai-black font-[family-name:var(--font-brand-sans)] shadow-brand-subtle">
                  <Clock size={13} strokeWidth={1.6} className="text-kawai-charcoal/50" />
                  {formatType(type)}
                </span>
              )}
              {location && (
                <span className="inline-flex items-center gap-2 bg-white border border-kawai-neutral/50 rounded-full px-4 py-2 text-[13px] text-kawai-black font-[family-name:var(--font-brand-sans)] shadow-brand-subtle">
                  <MapPin size={13} strokeWidth={1.6} className="text-kawai-charcoal/50" />
                  {location}
                </span>
              )}
              {postedAt && (
                <span className="inline-flex items-center gap-2 bg-white border border-kawai-neutral/50 rounded-full px-4 py-2 text-[13px] text-kawai-charcoal font-[family-name:var(--font-brand-sans)] shadow-brand-subtle">
                  <CalendarDays size={13} strokeWidth={1.6} className="text-kawai-charcoal/50" />
                  Posted {formatPostedDate(postedAt)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hairline divider into body */}
      <div className="relative z-10 px-8 md:px-16 lg:px-24">
        <div className="h-px bg-kawai-neutral/50" />
      </div>
    </section>
  )
}
