import { MapPinIcon, PhoneIcon, ClockIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline'
import { PromoReveal } from '@/components/fall-promo'
import { SERIF } from './tokens'
import type { SaleStore } from './types'

/**
 * This store's location block, styled as a gift tag: a red satin tag (store
 * name, address, phone, directions) tied to a white card holding the hours.
 * Everything here is store identity from the storefront collection, never
 * campaign copy, and nothing is invented when a field is empty.
 */
export function SaleLocationBar({ store }: { store: SaleStore }) {
  const tel = store.phone ? `tel:${store.phone.replace(/\D/g, '')}` : null
  const hours = store.hours.filter((h) => h.day && h.time)

  return (
    <section aria-labelledby="sale-location" className="relative bg-kawai-pearl px-4 pt-16 sm:px-6 sm:pt-24">
      <PromoReveal self="lift" className="mx-auto max-w-5xl">
        <div className="grid overflow-hidden rounded-[1.75rem] bg-white shadow-[0_30px_80px_-40px_color-mix(in_srgb,var(--color-kawai-black)_55%,transparent)] ring-1 ring-kawai-black/5 md:grid-cols-[1.15fr_1fr]">
          {/* The tag */}
          <div className="relative overflow-hidden bg-gradient-to-br from-kawai-red via-kawai-red-700 to-kawai-red-900 p-7 text-white sm:p-10">
            {/* Satin sheen that sweeps the tag every few seconds. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent motion-reduce:hidden"
              style={{ animation: 'sale-shimmer 6s ease-in-out 1.5s infinite' }}
            />
            {/* Tag eyelet + string */}
            <span aria-hidden className="absolute right-6 top-6 h-4 w-4 rounded-full bg-white/90 ring-4 ring-kawai-gold/60" />
            <span aria-hidden className="absolute -right-8 top-[2.05rem] h-px w-14 rotate-[-18deg] bg-kawai-gold/70" />
            {/* Soft gold glow in the corner */}
            <span aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-kawai-gold/15 blur-3xl" />

            <div className="relative">
              <h2
                id="sale-location"
                data-reveal="rise"
                className="pr-10 text-[clamp(2rem,4.4vw,3rem)] leading-[1.02]"
                style={{ fontFamily: SERIF }}
              >
                {store.name}
              </h2>
              <span aria-hidden data-reveal="strike" className="mt-4 block h-px w-16 origin-left bg-kawai-gold" />

              <ul className="mt-6 space-y-4 text-[0.98rem] text-white/95">
                {store.address && (
                  <li data-reveal="slide" className="flex items-start gap-3">
                    <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
                      <MapPinIcon className="h-4 w-4 text-kawai-gold" />
                    </span>
                    {store.directions ? (
                      <a
                        href={store.directions.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pt-1 underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
                      >
                        {store.address}
                      </a>
                    ) : (
                      <span className="pt-1">{store.address}</span>
                    )}
                  </li>
                )}
                {store.phone && tel && (
                  <li data-reveal="slide" className="flex items-center gap-3">
                    <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
                      <PhoneIcon className="h-4 w-4 text-kawai-gold" />
                    </span>
                    <a
                      href={tel}
                      className="text-xl font-semibold tracking-wide underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
                    >
                      {store.phone}
                    </a>
                  </li>
                )}
              </ul>

              {store.directions && (
                <a
                  data-reveal="rise"
                  href={store.directions.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-kawai-red-700 shadow-[0_10px_24px_-12px_color-mix(in_srgb,black_60%,transparent)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-12px_color-mix(in_srgb,black_70%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {store.directions.label}
                  <ArrowUpRightIcon aria-hidden className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              )}
            </div>
          </div>

          {/* The hours */}
          {hours.length > 0 && (
            <div data-reveal="fade" className="flex flex-col justify-center p-7 sm:p-10">
              <span aria-hidden className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-kawai-red-50 text-kawai-red">
                <ClockIcon className="h-5 w-5" />
              </span>
              <dl className="space-y-0.5 text-[0.95rem]">
                {hours.map((h) => (
                  <div
                    key={`${h.day}-${h.time}`}
                    className="flex items-baseline gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-kawai-pearl"
                  >
                    <dt className="flex flex-1 items-baseline gap-3 font-semibold text-kawai-black after:flex-1 after:translate-y-[-0.2rem] after:border-b after:border-dotted after:border-kawai-black/20 after:content-['']">
                      {h.day}
                    </dt>
                    <dd className="whitespace-nowrap tabular-nums text-kawai-muted">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </PromoReveal>
    </section>
  )
}
