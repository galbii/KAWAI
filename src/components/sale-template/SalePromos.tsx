import Image from 'next/image'
import Link from 'next/link'
import type { ComponentType, SVGProps } from 'react'
import {
  ArrowDownIcon,
  GiftIcon,
  ReceiptPercentIcon,
  SparklesIcon,
  TagIcon,
} from '@heroicons/react/24/outline'
import { PromoReveal } from '@/components/fall-promo'
import { SERIF } from './tokens'
import type { SaleHighlight, SalePromo, SalePromoHeading } from './types'

/**
 * The promos: a three-tile index of the offers, then one editorial spread per
 * offer — a large photograph in a red offset frame beside the offer's type,
 * with its fine print as visible text directly underneath.
 *
 * Reveal (PromoReveal) sits on an outer wrapper and the hover motion on the
 * elements inside it, so the inline transform the reveal leaves behind can
 * never pin an element and swallow the hover.
 */

type Icon = ComponentType<SVGProps<SVGSVGElement>>

/** Decorative glyph per offer anchor. Purely visual; unknown anchors get a sparkle. */
const HIGHLIGHT_ICON: Record<string, Icon> = {
  '#headphones': GiftIcon,
  '#financing': ReceiptPercentIcon,
  '#rebates': TagIcon,
}

function Highlights({ items }: { items: readonly SaleHighlight[] }) {
  return (
    <PromoReveal className="mx-auto max-w-5xl">
      <ul className="grid gap-3 sm:grid-cols-3 sm:gap-5">
        {items.map((item) => {
          const Glyph = HIGHLIGHT_ICON[item.href] ?? SparklesIcon
          return (
            <li key={item.href} data-reveal="rise">
              <a
                href={item.href}
                className="group relative flex h-full items-start gap-4 overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-kawai-black/5 shadow-[0_14px_40px_-28px_color-mix(in_srgb,var(--color-kawai-black)_60%,transparent)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_color-mix(in_srgb,var(--color-kawai-red-900)_55%,transparent)] hover:ring-kawai-red/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red sm:flex-col sm:p-6"
              >
                {/* Red rule that grows along the top on hover */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-kawai-red to-kawai-gold transition-transform duration-500 group-hover:scale-x-100"
                />
                <span
                  aria-hidden
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-kawai-red-50 text-kawai-red transition-colors duration-300 group-hover:bg-kawai-red group-hover:text-white"
                >
                  <Glyph className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="block font-semibold text-kawai-black">{item.label}</span>
                  <span className="mt-1 block text-sm leading-snug text-kawai-muted">{item.detail}</span>
                </span>
                <ArrowDownIcon
                  aria-hidden
                  className="absolute right-5 top-5 h-4 w-4 text-kawai-red/40 transition duration-300 group-hover:translate-y-0.5 group-hover:text-kawai-red sm:right-6 sm:top-6"
                />
              </a>
            </li>
          )
        })}
      </ul>
    </PromoReveal>
  )
}

/**
 * Regulated lockup (Synchrony §4.1/§4.2): `lead` and `apr` are bare text in
 * one h2 at one size; only `connector` is wrapped and sized down; the subhead
 * follows immediately at ≥40% of the headline size. One wrapper sets the font
 * size so the ratio holds by construction.
 */
const LOCKUP_SIZE = 'clamp(1.9rem, 3.6vw, 2.9rem)'
const CONNECTOR_RATIO = 0.72
const SUBHEAD_RATIO = 0.42

function PromoHeading({ heading, id }: { heading: SalePromoHeading; id: string }) {
  if (heading.kind === 'lockup') {
    return (
      <div style={{ fontSize: LOCKUP_SIZE }}>
        <h2 id={id} className="leading-[1.08] text-kawai-black" style={{ fontFamily: SERIF, fontSize: '1em' }}>
          {heading.lead}{' '}
          <span style={{ fontSize: `${CONNECTOR_RATIO}em` }}>{heading.connector}</span>{' '}
          {heading.apr}
        </h2>
        <p className="mt-3 leading-relaxed text-kawai-black/80" style={{ fontSize: `${SUBHEAD_RATIO}em` }}>
          {heading.subhead}
        </p>
      </div>
    )
  }
  return (
    <h2
      id={id}
      className="text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.05] text-kawai-black"
      style={{ fontFamily: SERIF }}
    >
      {heading.text}
    </h2>
  )
}

function PromoCard({ promo, index }: { promo: SalePromo; index: number }) {
  const headingId = `${promo.id}-heading`
  const flip = index % 2 === 1

  return (
    <section id={promo.id} aria-labelledby={headingId} className="scroll-mt-24">
      <PromoReveal self="lift">
        <article className="group">
          <div className="grid items-center gap-8 md:grid-cols-12 md:gap-12 lg:gap-16">
            {promo.image ? (
              <div className={`relative md:col-span-7 ${flip ? 'md:order-2' : ''}`}>
                {/* Red offset frame behind the photograph */}
                <span
                  aria-hidden
                  className={`absolute inset-0 translate-y-3 rounded-[2rem] bg-gradient-to-br from-kawai-red to-kawai-red-900 transition-transform duration-700 ease-out sm:translate-y-5 ${
                    flip
                      ? '-translate-x-3 group-hover:-translate-x-4 sm:-translate-x-5'
                      : 'translate-x-3 group-hover:translate-x-4 sm:translate-x-5'
                  } group-hover:translate-y-4 sm:group-hover:translate-y-6`}
                />
                <div
                  className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-kawai-pearl ring-1 ring-kawai-black/5 md:aspect-[5/4]"
                  data-reveal="wipe"
                >
                  <Image
                    src={promo.image.src}
                    alt={promo.image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 58vw"
                    className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]"
                    style={promo.image.position ? { objectPosition: promo.image.position } : undefined}
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-kawai-black/25 via-transparent to-transparent"
                  />
                </div>
              </div>
            ) : (
              <div
                aria-hidden
                className={`hidden aspect-[5/4] rounded-[2rem] bg-gradient-to-br from-kawai-red-50 to-kawai-pearl md:col-span-7 md:block ${flip ? 'md:order-2' : ''}`}
              />
            )}

            <div className="md:col-span-5">
              <p
                data-reveal="rise"
                className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-kawai-red-700"
              >
                <span aria-hidden className="h-px w-8 bg-kawai-red" />
                {promo.eyebrow}
              </p>
              <div data-reveal="rise" className="mt-4">
                <PromoHeading heading={promo.heading} id={headingId} />
              </div>

              {promo.body && (
                <p data-reveal="rise" className="mt-5 text-[1.05rem] leading-relaxed text-kawai-black/75">
                  {promo.body}
                </p>
              )}

              {promo.rows && promo.rows.length > 0 && (
                <ul data-reveal="rise" className="mt-7 space-y-2">
                  {promo.rows.map((row) => (
                    <li
                      key={row.label}
                      className="flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-3 ring-1 ring-kawai-black/5 transition hover:ring-kawai-red/30"
                    >
                      <span>
                        <span className="font-semibold text-kawai-black">{row.label}</span>
                        {row.note && <span className="ml-2 text-sm text-kawai-muted">{row.note}</span>}
                      </span>
                      <span className="whitespace-nowrap rounded-full bg-kawai-red px-3 py-1 text-sm font-bold text-white">
                        {row.value}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {promo.note && (
                <p
                  data-reveal="rise"
                  className="mt-6 rounded-xl bg-kawai-gold/10 px-4 py-3 text-sm font-medium leading-relaxed text-kawai-black/85 ring-1 ring-kawai-gold-on-light/25"
                >
                  {promo.note}
                </p>
              )}

              {promo.link && (
                <Link
                  data-reveal="rise"
                  href={promo.link.href}
                  className="group/link mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-kawai-black px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-kawai-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red"
                >
                  {promo.link.label}
                  <span aria-hidden className="transition-transform group-hover/link:translate-x-0.5">→</span>
                </Link>
              )}
            </div>
          </div>

          {promo.fineprint.length > 0 && (
            // Visible page text on load — never collapsed. Legible at ≥12.8px.
            <div
              {...(promo.fineprintId ? { id: promo.fineprintId } : {})}
              className="mt-10 space-y-2.5 border-t border-kawai-black/10 pt-5 sm:mt-14"
            >
              {promo.fineprint.map((line) => (
                <p key={line} className="text-[0.8rem] leading-relaxed text-kawai-muted">
                  {line}
                </p>
              ))}
            </div>
          )}
        </article>
      </PromoReveal>
    </section>
  )
}

export function SalePromos({
  highlights,
  promos,
}: {
  highlights: readonly SaleHighlight[]
  promos: readonly SalePromo[]
}) {
  return (
    <div className="relative bg-gradient-to-b from-kawai-pearl via-white to-kawai-pearl px-4 py-14 sm:px-6 sm:py-20">
      <Highlights items={highlights} />
      <div className="mx-auto mt-20 max-w-6xl space-y-24 sm:mt-28 sm:space-y-32">
        {promos.map((promo, i) => (
          <PromoCard key={promo.id} promo={promo} index={i} />
        ))}
      </div>
    </div>
  )
}
