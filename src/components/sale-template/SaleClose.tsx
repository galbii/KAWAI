import { CalendarDaysIcon } from '@heroicons/react/24/solid'
import { PromoReveal } from '@/components/fall-promo'
import { Lockup } from './Lockup'
import { Wordmark } from './Wordmark'
import { SaleCtaPair } from './SaleCtas'
import { DISPLAY, SANS } from './tokens'
import type { SaleCloseContent, SaleCta, SaleStore } from './types'

/**
 * The close, on the same white field as the hero, so the page ends where it
 * began: the closing lockup ("Instrumental to / Holiday"), the campaign's end
 * date and line, Request Inventory (solid Kawai red) and Call Now (black
 * outline) as a pair, Schedule Visit as a quieter third under them (v2,
 * Nov 19, 2026), then the wordmark over "Instrumental to Life".
 *
 * Schedule Visit appears only when the store has a real booking target
 * (`toSaleStore`); nothing is invented.
 */
export function SaleClose({
  close,
  store,
  cta,
  callLabel,
  tagline,
  ctaId,
}: {
  close: SaleCloseContent
  store: SaleStore
  cta: SaleCta
  callLabel: string
  tagline: string
  /** The pair's id: the phone bar hides once it is on screen. */
  ctaId: string
}) {
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

        <div id={ctaId} data-reveal="pop" className="mt-10 flex flex-col items-center gap-5">
          <SaleCtaPair cta={cta} callLabel={callLabel} store={store} placement="close" size="lg" />
          {store.schedule && (
            <a
              href={store.schedule.href}
              {...(store.schedule.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              data-cta="schedule-visit"
              data-cta-placement="close"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-kawai-black underline decoration-kawai-black/25 underline-offset-[6px] transition hover:text-kawai-red hover:decoration-kawai-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-kawai-black"
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
