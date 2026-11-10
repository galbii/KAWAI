import Image from 'next/image'
import Link from 'next/link'
import { PromoReveal } from '@/components/fall-promo'
import { SERIF } from './tokens'
import type { SaleHighlight, SalePromo, SalePromoHeading } from './types'

/**
 * The promos: the flyer's red-check list as an index, then one card per offer.
 *
 * Reveal (PromoReveal) sits on an outer wrapper and the hover lift on the card
 * inside it, so the inline transform the reveal leaves behind can never pin
 * the card and swallow the hover.
 */

function RedCheck() {
  return (
    <span
      aria-hidden
      className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-kawai-red text-kawai-red transition-colors group-hover:bg-kawai-red group-hover:text-white"
    >
      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M4.5 10.5l3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

function Highlights({ items }: { items: readonly SaleHighlight[] }) {
  return (
    <PromoReveal className="mx-auto max-w-3xl">
      <ul className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        {items.map((item) => (
          <li key={item.href} data-reveal="rise">
            <a
              href={item.href}
              className="group flex h-full items-start gap-3 rounded-xl border border-kawai-red/15 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-kawai-red/40 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red"
            >
              <RedCheck />
              <span>
                <span className="block font-semibold text-kawai-black">{item.label}</span>
                <span className="mt-0.5 block text-sm text-kawai-muted">{item.detail}</span>
              </span>
            </a>
          </li>
        ))}
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
const LOCKUP_SIZE = 'clamp(1.7rem, 3.4vw, 2.6rem)'
const CONNECTOR_RATIO = 0.72
const SUBHEAD_RATIO = 0.42

function PromoHeading({ heading, id }: { heading: SalePromoHeading; id: string }) {
  if (heading.kind === 'lockup') {
    return (
      <div style={{ fontSize: LOCKUP_SIZE }}>
        <h2 id={id} className="leading-[1.1] text-kawai-black" style={{ fontFamily: SERIF, fontSize: '1em' }}>
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
      className="text-[clamp(1.7rem,3.4vw,2.6rem)] leading-[1.1] text-kawai-black"
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
        <article className="group overflow-hidden rounded-2xl border border-kawai-black/5 bg-white shadow-[0_18px_50px_-30px_color-mix(in_srgb,var(--color-kawai-black)_55%,transparent)] transition duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_30px_70px_-30px_color-mix(in_srgb,var(--color-kawai-red-900)_45%,transparent)]">
          <div className={`grid md:grid-cols-2 ${flip ? 'md:[&>*:first-child]:order-2' : ''}`}>
            {promo.image ? (
              <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[24rem]" data-reveal="wipe">
                <Image
                  src={promo.image.src}
                  alt={promo.image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                  style={promo.image.position ? { objectPosition: promo.image.position } : undefined}
                />
                {/* Red ribbon tab, the flyer's corner accent */}
                <span
                  aria-hidden
                  className="absolute left-0 top-6 h-8 w-24 bg-gradient-to-r from-kawai-red-800 to-kawai-red shadow-md [clip-path:polygon(0_0,100%_0,88%_50%,100%_100%,0_100%)]"
                />
              </div>
            ) : (
              <div aria-hidden className="hidden bg-gradient-to-br from-kawai-red-50 to-kawai-pearl md:block" />
            )}

            <div className="flex flex-col justify-center p-6 sm:p-10">
              <p
                data-reveal="rise"
                className="text-xs font-semibold uppercase tracking-[0.24em] text-kawai-red-700"
              >
                {promo.eyebrow}
              </p>
              <div data-reveal="rise" className="mt-3">
                <PromoHeading heading={promo.heading} id={headingId} />
              </div>

              {promo.body && (
                <p data-reveal="rise" className="mt-4 leading-relaxed text-kawai-black/80">
                  {promo.body}
                </p>
              )}

              {promo.rows && promo.rows.length > 0 && (
                <ul data-reveal="rise" className="mt-6 divide-y divide-kawai-red/10 border-y border-kawai-red/10">
                  {promo.rows.map((row) => (
                    <li key={row.label} className="flex items-baseline justify-between gap-4 py-3">
                      <span>
                        <span className="font-semibold text-kawai-black">{row.label}</span>
                        {row.note && <span className="ml-2 text-sm text-kawai-muted">{row.note}</span>}
                      </span>
                      <span className="whitespace-nowrap font-semibold text-kawai-red-700">{row.value}</span>
                    </li>
                  ))}
                </ul>
              )}

              {promo.note && (
                <p data-reveal="rise" className="mt-5 border-l-2 border-kawai-gold-on-light pl-3 text-sm font-medium text-kawai-black/85">
                  {promo.note}
                </p>
              )}

              {promo.link && (
                <Link
                  data-reveal="rise"
                  href={promo.link.href}
                  className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-kawai-red-700 underline decoration-kawai-red/30 underline-offset-4 transition hover:decoration-kawai-red"
                >
                  {promo.link.label}
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              )}
            </div>
          </div>

          {promo.fineprint.length > 0 && (
            // Visible page text on load — never collapsed. Legible at ≥12.8px.
            <div
              {...(promo.fineprintId ? { id: promo.fineprintId } : {})}
              className="space-y-2.5 border-t border-kawai-black/5 bg-kawai-pearl px-6 py-5 sm:px-10"
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
    <div className="relative bg-gradient-to-b from-white via-kawai-pearl to-kawai-pearl px-4 py-16 sm:px-6 sm:py-24">
      <Highlights items={highlights} />
      <div className="mx-auto mt-14 max-w-6xl space-y-10 sm:mt-20 sm:space-y-14">
        {promos.map((promo, i) => (
          <PromoCard key={promo.id} promo={promo} index={i} />
        ))}
      </div>
    </div>
  )
}
