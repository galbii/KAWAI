import { PhoneIcon, CalendarDaysIcon } from '@heroicons/react/24/solid'
import { PromoReveal } from '@/components/fall-promo'
import { Snowfall } from './Snowfall'
import { SERIF } from './tokens'
import type { SaleCloseContent, SaleStore } from './types'

/**
 * The close: Call Now or Schedule Visit, on the flyer's deep-red field.
 *
 * The Call Now button carries a soft expanding ring to draw the eye; under
 * reduced motion the ring is removed and the button is simply solid white on
 * red, which is already the strongest contrast on the page.
 */
export function SaleClose({
  close,
  store,
  callLabel,
}: {
  close: SaleCloseContent
  store: SaleStore
  callLabel: string
}) {
  const tel = store.phone ? `tel:${store.phone.replace(/\D/g, '')}` : null

  return (
    <section
      aria-labelledby="sale-close"
      className="relative overflow-hidden bg-gradient-to-b from-kawai-red-800 via-kawai-red-900 to-kawai-black px-4 py-20 text-white sm:px-6 sm:py-28"
    >
      <Snowfall />
      {/* Gold radial glow behind the headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-kawai-gold/10 blur-3xl"
      />

      <PromoReveal className="relative mx-auto max-w-2xl text-center">
        <p data-reveal="rise" className="text-xs font-semibold uppercase tracking-[0.3em] text-kawai-gold">
          {close.eyebrow}
        </p>
        <h2
          id="sale-close"
          data-reveal="rise"
          className="mt-4 text-[clamp(2.1rem,5vw,3.5rem)] leading-[1.05]"
          style={{ fontFamily: SERIF }}
        >
          {close.heading}
        </h2>
        <p data-reveal="rise" className="mx-auto mt-5 max-w-lg leading-relaxed text-white/85">
          {close.body}
        </p>

        <div data-reveal="pop" className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {tel && (
            <a
              href={tel}
              className="group relative inline-flex min-w-[13rem] items-center justify-center gap-2.5 rounded-full bg-white px-8 py-4 text-base font-bold text-kawai-red-700 shadow-[0_12px_30px_-10px_color-mix(in_srgb,black_60%,transparent)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-12px_color-mix(in_srgb,black_70%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <span
                aria-hidden
                className="absolute inset-0 rounded-full border-2 border-white motion-reduce:hidden"
                style={{ animation: 'sale-ring 2.4s cubic-bezier(0.16,1,0.3,1) infinite' }}
              />
              <PhoneIcon aria-hidden className="h-5 w-5 transition-transform group-hover:-rotate-12" />
              {callLabel}
            </a>
          )}
          {store.schedule && (
            <a
              href={store.schedule.href}
              {...(store.schedule.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="group inline-flex min-w-[13rem] items-center justify-center gap-2.5 rounded-full border-2 border-kawai-gold px-8 py-4 text-base font-bold text-kawai-gold transition duration-300 hover:-translate-y-0.5 hover:bg-kawai-gold hover:text-kawai-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-kawai-gold"
            >
              <CalendarDaysIcon aria-hidden className="h-5 w-5" />
              {store.schedule.label}
            </a>
          )}
        </div>

        {store.phone && (
          <p data-reveal="fade" className="mt-6 text-sm text-white/70">
            {store.name} · {store.phone}
          </p>
        )}
      </PromoReveal>
    </section>
  )
}
