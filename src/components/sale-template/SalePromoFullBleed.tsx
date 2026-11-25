import type { ReactNode } from 'react'
import Image from 'next/image'
import { PromoReveal } from '@/components/fall-promo'
import { SaleCtaPair } from './SaleCtas'
import { DISPLAY } from './tokens'
import type { SaleCta, SaleImage, SalePromo, SaleStore } from './types'

type Actions = { cta: SaleCta; callLabel: string; store?: SaleStore | undefined }

/**
 * A full-bleed offer spread (kawai-holiday-close-redesign v2, national SH-9
 * Headphones spread; the user: "for the sh-9 bundle, can we make the headphone
 * image full bleed?"). Opt-in through `promo.layout: 'fullBleed'`.
 *
 * Desktop: the photograph runs edge to edge behind the spread; the subject
 * keeps the left of the frame and the offer's type sits on the right over a
 * kawai-black scrim, which also melts the photo's foot into the solid black
 * the fine print sits on. Phones: the photo bleeds to both edges under the
 * numbered eyebrow, then the type on solid kawai-black.
 *
 * It is still a numbered offer spread: same `<section id>`, eyebrow number,
 * h2, body, note, Request Inventory pair with its note, and the visible fine
 * print in the same section. Contrast: every word on desktop sits on ≥ 0.88
 * kawai-black scrim (measured over the photo, see the handoff); on phones the
 * type sits on solid kawai-black (white 16.6:1, white/75 fine print ~9.9:1,
 * kawai-red-400 ~6.2:1).
 */
export function PromoFullBleed({
  promo,
  image,
  number,
  actions,
  heading,
}: {
  promo: SalePromo
  image: SaleImage
  /** The spread's printed number ("01"). */
  number: string
  actions: Actions
  /** The rendered h2 (PromoHeading), so the regulated lockup rules stay in one place. */
  heading: ReactNode
}) {
  const headingId = `${promo.id}-heading`
  const eyebrow = (
    <p
      data-reveal="rise"
      className="flex items-baseline gap-4 text-xs font-semibold uppercase tracking-[0.26em] text-kawai-red-400"
    >
      <span aria-hidden className="tabular-nums text-white">
        {number}
      </span>
      {promo.eyebrow}
    </p>
  )

  return (
    <section
      id={promo.id}
      aria-labelledby={headingId}
      data-sale-tone="dark"
      data-sale-layout="full-bleed"
      className="relative isolate scroll-mt-24 overflow-hidden bg-kawai-black text-white"
    >
      {/* Phones: eyebrow, then the photo edge to edge. */}
      <div className="px-5 pt-14 sm:px-10 lg:hidden">{eyebrow}</div>

      <div className="relative mt-6 aspect-[4/3] w-full sm:aspect-[16/9] lg:absolute lg:inset-x-0 lg:bottom-52 lg:top-0 lg:mt-0 lg:aspect-auto">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="100vw"
          className="-z-20 object-cover"
          style={{ objectPosition: image.position ?? 'left center' }}
        />
        {/* Phones: the photo's foot melts into the black the type sits on. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_top,var(--color-kawai-black),transparent)] lg:hidden"
        />
        {/* Desktop: the type column's scrim on the right, and a short foot fade
            into the solid black the fine print sits on (the photo stops above it). */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 hidden lg:block lg:bg-[linear-gradient(to_right,transparent_22%,color-mix(in_srgb,var(--color-kawai-black)_70%,transparent)_42%,color-mix(in_srgb,var(--color-kawai-black)_90%,transparent)_52%,color-mix(in_srgb,var(--color-kawai-black)_94%,transparent)_100%),linear-gradient(to_top,var(--color-kawai-black)_0%,transparent_9rem)]"
        />
      </div>

      <PromoReveal className="relative mx-auto max-w-7xl px-5 pb-16 sm:px-10 sm:pb-24 lg:pt-28">
        <div className="lg:grid lg:min-h-[34rem] lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="pt-4 lg:col-span-5 lg:col-start-8 lg:pt-0">
            <div className="hidden lg:block">{eyebrow}</div>
            <div data-reveal="rise" className="lg:mt-8">
              {heading}
            </div>

            {promo.body && (
              <p data-reveal="rise" className="mt-5 text-[1.05rem] leading-relaxed text-white/85">
                {promo.body}
              </p>
            )}

            {promo.rows && promo.rows.length > 0 && (
              <ul data-reveal="rise" className="mt-7 border-t border-white/15">
                {promo.rows.map((row) => (
                  <li key={row.label} className="flex items-baseline justify-between gap-4 border-b border-white/15 py-3.5">
                    <span>
                      <span className="font-semibold text-white">{row.label}</span>
                      {row.note && <span className="ml-2 text-sm text-white/75">{row.note}</span>}
                    </span>
                    <span
                      className="whitespace-nowrap text-[1.6rem] leading-none text-kawai-red-400"
                      style={{ fontFamily: DISPLAY, fontWeight: 900 }}
                    >
                      {row.value}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {promo.note && (
              <p
                data-reveal="rise"
                className="mt-6 border-l-[3px] border-kawai-red pl-4 text-sm font-medium leading-relaxed text-white/90"
              >
                {promo.note}
              </p>
            )}

            {promo.cta && (
              <div data-reveal="rise" className="mt-8">
                <SaleCtaPair {...actions} placement={promo.id} align="start" tone="dark" />
              </div>
            )}
          </div>
        </div>

        {promo.fineprint.length > 0 && (
          // Visible page text on load — never collapsed. Legible at ≥12.8px.
          <div
            {...(promo.fineprintId ? { id: promo.fineprintId } : {})}
            className="mt-10 max-w-4xl space-y-2.5 border-t border-white/15 pt-5 sm:mt-12 lg:mt-20"
          >
            {promo.fineprint.map((line) => (
              <p key={line} className="text-[0.8rem] leading-relaxed text-white/75">
                {line}
              </p>
            ))}
          </div>
        )}
      </PromoReveal>
    </section>
  )
}
