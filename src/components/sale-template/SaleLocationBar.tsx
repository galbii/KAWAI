import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import { PromoReveal } from '@/components/fall-promo'
import { SaleRequestButton } from './SaleCtas'
import { telHref } from './store'
import { DISPLAY, SANS } from './tokens'
import type { SaleCta, SaleStore } from './types'

/**
 * This store's location, set like an editorial masthead on a Kawai pearl
 * band (v4 color division; black 16:1, muted 6.6:1 on pearl; v5: neutral
 * hairline edges so the band reads as a block on white): the showroom
 * name large in the display serif, then address, phone and directions, and
 * the hours as a ruled two-column list, with one red rule as the accent.
 *
 * Everything here is store identity from the storefront collection, never
 * campaign copy, and nothing is invented when a field is empty. The one
 * exception is the campaign's optional `eyebrow`, a small caps label over
 * the name (the holiday page's "Factory-direct Kawai Pianos"). The one
 * campaign action, Request Inventory, leads the button row (v2); the phone
 * number above it is this band's Call Now.
 */
export function SaleLocationBar({
  store,
  cta,
  eyebrow,
}: {
  store: SaleStore
  cta: SaleCta
  /** The campaign's optional small caps label over the showroom name. */
  eyebrow?: string | undefined
}) {
  const tel = telHref(store)
  const hours = store.hours.filter((h) => h.day && h.time)

  return (
    <section
      id="visit"
      aria-labelledby="sale-location"
      className="scroll-mt-24 border-y border-kawai-neutral bg-kawai-pearl px-5 sm:px-10"
      style={{ fontFamily: SANS }}
    >
      <PromoReveal className="mx-auto max-w-7xl py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <span aria-hidden data-reveal="strike" className="block h-[3px] w-14 origin-left bg-kawai-red" />
            {eyebrow && (
              <p
                data-reveal="rise"
                className="mt-6 text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-kawai-black/70"
              >
                {eyebrow}
              </p>
            )}
            <h2
              id="sale-location"
              data-reveal="rise"
              className={`${eyebrow ? 'mt-3' : 'mt-6'} text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1] text-kawai-black`}
              style={{ fontFamily: DISPLAY, fontWeight: 900, letterSpacing: '-0.015em' }}
            >
              {store.name}
            </h2>

            <div data-reveal="rise" className="mt-7 flex flex-col gap-3 text-[1.02rem] text-kawai-black sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-8">
              {store.address &&
                (store.directions ? (
                  <a
                    href={store.directions.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-kawai-black/25 underline-offset-[6px] transition-colors hover:decoration-kawai-red"
                  >
                    {store.address}
                  </a>
                ) : (
                  <span>{store.address}</span>
                ))}
              {store.phone && tel && (
                <a
                  href={tel}
                  className="text-xl font-semibold tabular-nums tracking-wide underline decoration-kawai-black/25 underline-offset-[6px] transition-colors hover:text-kawai-red hover:decoration-kawai-red"
                >
                  {store.phone}
                </a>
              )}
            </div>

            <div
              data-reveal="rise"
              data-sale-cta="location"
              className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
            >
              <SaleRequestButton label={cta.requestLabel} placement="location" />
              {store.directions && (
                <a
                  href={store.directions.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-kawai-black px-6 py-2.5 text-sm font-semibold text-kawai-black transition hover:-translate-y-0.5 hover:border-kawai-red hover:bg-kawai-red hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red"
                >
                  {store.directions.label}
                  <ArrowUpRightIcon
                    aria-hidden
                    className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              )}
            </div>
          </div>

          {hours.length > 0 && (
            <dl data-reveal="fade" className="self-end text-[0.95rem] lg:col-span-5">
              {hours.map((h) => (
                <div
                  key={`${h.day}-${h.time}`}
                  className="flex items-baseline justify-between gap-6 border-b border-kawai-black/10 py-2.5 first:border-t"
                >
                  <dt className="font-semibold text-kawai-black">{h.day}</dt>
                  <dd className="whitespace-nowrap tabular-nums text-kawai-muted">{h.time}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </PromoReveal>
    </section>
  )
}
