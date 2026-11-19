import { Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDownIcon } from '@heroicons/react/24/outline'
import { PromoReveal } from '@/components/fall-promo'
import { SaleCtaPair } from './SaleCtas'
import { SaleMoment } from './SaleMoment'
import { DISPLAY, SANS } from './tokens'
import type {
  SaleCta,
  SaleHighlight,
  SaleMoment as Moment,
  SalePromo,
  SalePromoHeading,
  SaleStore,
} from './types'

/**
 * The offers, laid out as a magazine on the white field:
 *
 * 1. An index — the intro line, then one photographed card per highlighted
 *    offer, numbered, each jumping to its spread.
 * 2. One spread per offer: a large photograph beside the offer's type, with
 *    its fine print as visible text directly underneath, in the same section.
 * 3. Between spreads, the holiday moments (`SaleMoment`), each placed before
 *    the promo its `before` names.
 *
 * Actions (v2): the lead-in and the Request Inventory / Call Now pair close
 * the index, and every spread with `cta` carries the pair under its note, so
 * the next step is always on screen beside the offer it is about. The pair
 * sits above the spread's fine print, which stays in the same section.
 *
 * Reveal (PromoReveal) sits on an outer wrapper and the hover motion on the
 * elements inside it, so the inline transform the reveal leaves behind can
 * never pin an element and swallow the hover.
 */

const pad = (n: number) => String(n).padStart(2, '0')

type Actions = { cta: SaleCta; callLabel: string; store: SaleStore }

function OfferIndex({
  intro,
  items,
  promos,
  actions,
}: {
  intro: string
  items: readonly SaleHighlight[]
  promos: readonly SalePromo[]
  actions: Actions
}) {
  const imageFor = (href: string) => promos.find((p) => `#${p.id}` === href)?.image
  return (
    <PromoReveal className="mx-auto max-w-7xl">
      {intro && (
        <p data-reveal="rise" className="mx-auto max-w-2xl text-center text-[1.05rem] leading-relaxed text-kawai-black/75">
          {intro}
        </p>
      )}
      <ul className="mt-12 grid gap-6 sm:grid-cols-3 sm:gap-6 lg:gap-8">
        {items.map((item, i) => {
          const img = imageFor(item.href)
          return (
            <li key={item.href} data-reveal="rise">
              <a
                href={item.href}
                className="group block h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-kawai-red"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-kawai-pearl sm:aspect-[4/5]">
                  {img && (
                    <Image
                      src={img.src}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 30vw"
                      className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                      style={img.position ? { objectPosition: img.position } : undefined}
                    />
                  )}
                </div>
                <div className="flex items-start gap-4 border-b border-kawai-black/15 py-5 transition-colors group-hover:border-kawai-red">
                  <span
                    aria-hidden
                    className="pt-1 text-sm font-semibold tabular-nums text-kawai-red"
                  >
                    {pad(i + 1)}
                  </span>
                  <span className="flex-1">
                    <span
                      className="block text-[1.5rem] leading-[1.1] text-kawai-black"
                      style={{ fontFamily: DISPLAY, fontWeight: 900 }}
                    >
                      {item.label}
                    </span>
                    <span className="mt-2 block text-[0.95rem] leading-snug text-kawai-muted">{item.detail}</span>
                  </span>
                  <ArrowDownIcon
                    aria-hidden
                    className="mt-1.5 h-4 w-4 shrink-0 text-kawai-black/40 transition duration-300 group-hover:translate-y-0.5 group-hover:text-kawai-red"
                  />
                </div>
              </a>
            </li>
          )
        })}
      </ul>
      <div data-reveal="rise" className="mt-12 flex flex-col items-center gap-5 text-center sm:mt-14">
        <p className="max-w-xl text-[1.05rem] font-medium leading-relaxed text-kawai-black">{actions.cta.leadIn}</p>
        <SaleCtaPair {...actions} placement="offers" />
      </div>
    </PromoReveal>
  )
}

/**
 * Regulated lockup (Synchrony §4.1/§4.2): `lead` and `apr` are bare text in
 * one h2 at one size and one weight; only `connector` is wrapped and sized
 * down; the subhead follows immediately at ≥40% of the headline size. One
 * wrapper sets the font size so the ratio holds by construction. The holiday
 * script is never used here: a credit headline stays in the display serif.
 */
const LOCKUP_SIZE = 'clamp(1.9rem, 3.6vw, 2.9rem)'
const CONNECTOR_RATIO = 0.72
const SUBHEAD_RATIO = 0.42

function PromoHeading({ heading, id }: { heading: SalePromoHeading; id: string }) {
  if (heading.kind === 'lockup') {
    return (
      <div style={{ fontSize: LOCKUP_SIZE }}>
        <h2
          id={id}
          className="leading-[1.08] text-kawai-black"
          style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: '1em', letterSpacing: '-0.012em' }}
        >
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
      style={{ fontFamily: DISPLAY, fontWeight: 900, letterSpacing: '-0.012em' }}
    >
      {heading.text}
    </h2>
  )
}

function PromoSpread({ promo, index, actions }: { promo: SalePromo; index: number; actions: Actions }) {
  const headingId = `${promo.id}-heading`
  const flip = index % 2 === 1
  const banner = promo.image?.shape === 'banner'
  // Every other spread sits on a Kawai pearl band (v4 color division); the
  // fine print keeps its kawai-muted color, 6.6:1 on pearl.
  const banded = index % 2 === 0

  return (
    <section
      id={promo.id}
      aria-labelledby={headingId}
      className={`scroll-mt-24 px-5 py-16 sm:px-10 sm:py-24 ${banded ? 'bg-kawai-pearl' : 'bg-white'}`}
    >
      <PromoReveal className="mx-auto max-w-7xl">
        <article className="group">
          <p
            data-reveal="rise"
            className="flex items-baseline gap-4 text-xs font-semibold uppercase tracking-[0.26em] text-kawai-red"
          >
            <span aria-hidden className="tabular-nums text-kawai-black">
              {pad(index + 1)}
            </span>
            {promo.eyebrow}
          </p>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
            {promo.image ? (
              <div className={banner ? 'lg:col-span-12' : `lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}>
                <div
                  data-reveal="wipe"
                  className={`relative overflow-hidden bg-kawai-pearl ${banner ? 'aspect-[2506/649]' : 'aspect-[4/3] lg:aspect-[5/4]'}`}
                >
                  <Image
                    src={promo.image.src}
                    alt={promo.image.alt}
                    fill
                    sizes={banner ? '(max-width: 1280px) 100vw, 1280px' : '(max-width: 1024px) 100vw, 58vw'}
                    className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.03]"
                    style={promo.image.position ? { objectPosition: promo.image.position } : undefined}
                  />
                </div>
              </div>
            ) : null}

            <div className={promo.image && !banner ? 'lg:col-span-5' : 'lg:col-span-8'}>
              <div data-reveal="rise">
                <PromoHeading heading={promo.heading} id={headingId} />
              </div>

              {promo.body && (
                <p data-reveal="rise" className="mt-5 text-[1.05rem] leading-relaxed text-kawai-black/75">
                  {promo.body}
                </p>
              )}

              {promo.rows && promo.rows.length > 0 && (
                <ul data-reveal="rise" className="mt-7 border-t border-kawai-black/15">
                  {promo.rows.map((row) => (
                    <li
                      key={row.label}
                      className="flex items-baseline justify-between gap-4 border-b border-kawai-black/15 py-3.5"
                    >
                      <span>
                        <span className="font-semibold text-kawai-black">{row.label}</span>
                        {row.note && <span className="ml-2 text-sm text-kawai-muted">{row.note}</span>}
                      </span>
                      <span
                        className="whitespace-nowrap text-[1.15rem] text-kawai-red"
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
                  className="mt-6 border-l-[3px] border-kawai-red pl-4 text-sm font-medium leading-relaxed text-kawai-black/85"
                >
                  {promo.note}
                </p>
              )}

              {promo.link && (
                <Link
                  data-reveal="rise"
                  href={promo.link.href}
                  className="group/link mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-kawai-black px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-kawai-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red"
                >
                  {promo.link.label}
                  <span aria-hidden className="transition-transform group-hover/link:translate-x-0.5">
                    →
                  </span>
                </Link>
              )}

              {promo.cta && (
                <div data-reveal="rise" className="mt-8">
                  <SaleCtaPair {...actions} placement={promo.id} align="start" />
                </div>
              )}
            </div>
          </div>

          {promo.fineprint.length > 0 && (
            // Visible page text on load — never collapsed. Legible at ≥12.8px.
            <div
              {...(promo.fineprintId ? { id: promo.fineprintId } : {})}
              className="mt-10 space-y-2.5 border-t border-kawai-black/10 pt-5 sm:mt-12"
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
  intro,
  highlights,
  promos,
  moments,
  cta,
  callLabel,
  store,
}: {
  intro: string
  highlights: readonly SaleHighlight[]
  promos: readonly SalePromo[]
  moments: readonly Moment[]
  cta: SaleCta
  callLabel: string
  store: SaleStore
}) {
  const actions: Actions = { cta, callLabel, store }
  return (
    <div id="offers" className="bg-white py-16 sm:py-24" style={{ fontFamily: SANS }}>
      <div className="px-5 sm:px-10">
        <OfferIndex intro={intro} items={highlights} promos={promos} actions={actions} />
      </div>
      <div className="mt-24 sm:mt-32">
        {promos.map((promo, i) => (
          <Fragment key={promo.id}>
            {moments
              .filter((m) => m.before === promo.id)
              .map((m) => (
                <SaleMoment key={m.id} moment={m} />
              ))}
            <PromoSpread promo={promo} index={i} actions={actions} />
          </Fragment>
        ))}
      </div>
    </div>
  )
}
