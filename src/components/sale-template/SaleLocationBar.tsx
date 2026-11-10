import { MapPinIcon, PhoneIcon, ClockIcon } from '@heroicons/react/24/outline'
import { PromoReveal } from '@/components/fall-promo'
import { SERIF } from './tokens'
import type { SaleStore } from './types'

/**
 * This store's location block, styled as the flyer's red bar: store name,
 * address and phone, plus hours and directions from the same CMS record.
 * Everything here is store identity from the storefront collection, never
 * campaign copy, and nothing is invented when a field is empty.
 */
export function SaleLocationBar({ store }: { store: SaleStore }) {
  const tel = store.phone ? `tel:${store.phone.replace(/\D/g, '')}` : null
  const hours = store.hours.filter((h) => h.day && h.time)

  return (
    <section aria-labelledby="sale-location" className="relative bg-white px-4 sm:px-6">
      <PromoReveal self="lift" className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-kawai-red via-kawai-red-700 to-kawai-red-900 text-white shadow-[0_24px_60px_-24px_color-mix(in_srgb,var(--color-kawai-red-900)_70%,transparent)]">
          {/* Satin sheen that sweeps the bar every few seconds. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent motion-reduce:hidden"
            style={{ animation: 'sale-shimmer 6s ease-in-out 1.5s infinite' }}
          />
          {/* Gold hairline, the flyer's foil edge. */}
          <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-kawai-gold/70" />

          <div className="relative grid gap-8 p-6 sm:p-10 md:grid-cols-[1.1fr_1fr] md:items-center">
            <div>
              <h2
                id="sale-location"
                data-reveal="rise"
                className="text-[clamp(1.6rem,3.6vw,2.4rem)] leading-tight"
                style={{ fontFamily: SERIF }}
              >
                {store.name}
              </h2>

              <ul className="mt-5 space-y-3 text-[0.98rem] text-white/95">
                {store.address && (
                  <li data-reveal="slide" className="flex items-start gap-3">
                    <MapPinIcon aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-kawai-gold" />
                    {store.directions ? (
                      <a
                        href={store.directions.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
                      >
                        {store.address}
                      </a>
                    ) : (
                      <span>{store.address}</span>
                    )}
                  </li>
                )}
                {store.phone && tel && (
                  <li data-reveal="slide" className="flex items-center gap-3">
                    <PhoneIcon aria-hidden className="h-5 w-5 shrink-0 text-kawai-gold" />
                    <a
                      href={tel}
                      className="text-lg font-semibold tracking-wide underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
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
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/50 px-5 py-2 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {store.directions.label}
                </a>
              )}
            </div>

            {hours.length > 0 && (
              <div
                data-reveal="fade"
                className="rounded-xl border border-white/20 bg-white/[0.07] p-5 backdrop-blur-sm"
              >
                <ClockIcon aria-hidden className="mb-3 h-5 w-5 text-kawai-gold" />
                <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
                  {hours.map((h) => (
                    <div key={`${h.day}-${h.time}`} className="contents">
                      <dt className="font-medium text-white">{h.day}</dt>
                      <dd className="text-white/85">{h.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </PromoReveal>
    </section>
  )
}
