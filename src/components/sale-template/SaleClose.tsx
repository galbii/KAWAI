import { PhoneIcon, CalendarDaysIcon } from '@heroicons/react/24/solid'
import { PromoReveal } from '@/components/fall-promo'
import { Lockup } from './Lockup'
import { Wordmark } from './Wordmark'
import { DISPLAY, SANS } from './tokens'
import type { SaleCloseContent, SaleStore } from './types'

/**
 * The close, on the same white field as the hero, so the page ends where it
 * began: the closing lockup ("Instrumental to / Holiday"), the campaign's end
 * date and line, Call Now (solid Kawai red) and Schedule Visit (black
 * outline), then the wordmark over "Instrumental to Life".
 *
 * Schedule Visit appears only when the store has a real booking target
 * (`toSaleStore`); nothing is invented.
 */
export function SaleClose({
  close,
  store,
  callLabel,
  tagline,
}: {
  close: SaleCloseContent
  store: SaleStore
  callLabel: string
  tagline: string
}) {
  const tel = store.phone ? `tel:${store.phone.replace(/\D/g, '')}` : null

  return (
    <section
      aria-labelledby="sale-close"
      className="bg-white px-5 pb-20 pt-8 sm:px-10 sm:pb-28"
      style={{ fontFamily: SANS }}
    >
      <PromoReveal className="mx-auto max-w-3xl border-t border-kawai-black/15 pt-20 text-center sm:pt-28">
        <p data-reveal="rise" className="text-xs font-semibold uppercase tracking-[0.3em] text-kawai-red">
          {close.eyebrow}
        </p>
        <div data-reveal="rise" className="mt-6">
          <Lockup lockup={close.lockup} id="sale-close" size="xl" />
        </div>
        <p
          data-reveal="rise"
          className="mt-10 text-[clamp(1.4rem,2.6vw,1.9rem)] leading-tight text-kawai-black"
          style={{ fontFamily: DISPLAY, fontWeight: 900 }}
        >
          {close.heading}
        </p>
        <p data-reveal="rise" className="mx-auto mt-4 max-w-lg leading-relaxed text-kawai-black/75">
          {close.body}
        </p>

        <div data-reveal="pop" className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {tel && (
            <a
              href={tel}
              className="group inline-flex min-w-[13rem] items-center justify-center gap-2.5 rounded-full bg-kawai-red px-8 py-4 text-base font-semibold text-white shadow-[0_14px_30px_-14px_var(--color-kawai-red)] transition duration-300 hover:-translate-y-0.5 hover:bg-kawai-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-kawai-red"
            >
              <PhoneIcon aria-hidden className="h-5 w-5 transition-transform group-hover:-rotate-12" />
              {callLabel}
            </a>
          )}
          {store.schedule && (
            <a
              href={store.schedule.href}
              {...(store.schedule.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="inline-flex min-w-[13rem] items-center justify-center gap-2.5 rounded-full border-2 border-kawai-black px-8 py-4 text-base font-semibold text-kawai-black transition duration-300 hover:-translate-y-0.5 hover:bg-kawai-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-kawai-black"
            >
              <CalendarDaysIcon aria-hidden className="h-5 w-5" />
              {store.schedule.label}
            </a>
          )}
        </div>

        {store.phone && (
          <p data-reveal="fade" className="mt-6 text-sm text-kawai-muted">
            {store.name} · {store.phone}
          </p>
        )}

        <div data-reveal="fade" className="mt-16 flex justify-center">
          <Wordmark tagline={tagline} />
        </div>
      </PromoReveal>
    </section>
  )
}
