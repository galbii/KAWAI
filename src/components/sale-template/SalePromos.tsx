import { Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDownIcon, CheckIcon } from '@heroicons/react/24/outline'
import { PromoReveal } from '@/components/fall-promo'
import { SaleCtaPair } from './SaleCtas'
import { SaleMoment } from './SaleMoment'
import { PromoFullBleed } from './SalePromoFullBleed'
import { StoreContact } from './StoreContact'
import { DISPLAY, SANS } from './tokens'
import type {
  SaleChecklist,
  SaleCta,
  SaleHighlight,
  SaleMoment as Moment,
  SalePolish,
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

type Actions = { cta: SaleCta; callLabel: string; store?: SaleStore | undefined }

/** v2 polish (national only): louder offer type. Off, the sizes are the originals. */
const LOUD_HEADING = 'clamp(2.2rem, 4.2vw, 3.6rem)'

function OfferIndex({
  intro,
  items,
  promos,
  actions,
  compact = false,
}: {
  intro: string
  items: readonly SaleHighlight[]
  promos: readonly SalePromo[]
  actions: Actions
  /** v2 polish: below sm each card is a compact row with a 96px square thumbnail. */
  compact?: boolean
}) {
  const imageFor = (href: string) => promos.find((p) => `#${p.id}` === href)?.image
  return (
    <PromoReveal className="mx-auto max-w-7xl">
      {intro && (
        <p data-reveal="rise" className="mx-auto max-w-2xl text-center text-[1.05rem] leading-relaxed text-kawai-black/75">
          {intro}
        </p>
      )}
      {items.length > 0 && (
        <ul
          className={
            items.length === 2
              ? 'mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2 sm:gap-6 lg:gap-8'
              : 'mt-12 grid gap-6 sm:grid-cols-3 sm:gap-6 lg:gap-8'
          }
        >
          {items.map((item, i) => {
            const img = imageFor(item.href)
            return (
              <li key={item.href} data-reveal="rise">
                <a
                  href={item.href}
                  className={
                    compact
                      ? 'group flex h-full items-stretch gap-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-kawai-red sm:block'
                      : 'group block h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-kawai-red'
                  }
                >
                  <div
                    className={
                      compact
                        ? 'relative size-24 shrink-0 overflow-hidden bg-kawai-pearl sm:aspect-[4/5] sm:size-auto'
                        : 'relative aspect-[4/3] overflow-hidden bg-kawai-pearl sm:aspect-[4/5]'
                    }
                  >
                    {img && (
                      <Image
                        src={img.src}
                        alt=""
                        fill
                        sizes={
                          compact
                            ? items.length === 2
                              ? '(max-width: 640px) 96px, 45vw'
                              : '(max-width: 640px) 96px, 30vw'
                            : items.length === 2
                              ? '(max-width: 640px) 100vw, 45vw'
                              : '(max-width: 640px) 100vw, 30vw'
                        }
                        className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                        style={img.position ? { objectPosition: img.position } : undefined}
                      />
                    )}
                  </div>
                  <div
                    className={
                      compact
                        ? 'flex flex-1 items-start gap-3 border-b border-kawai-black/15 py-2 transition-colors group-hover:border-kawai-red sm:gap-4 sm:py-5'
                        : 'flex items-start gap-4 border-b border-kawai-black/15 py-5 transition-colors group-hover:border-kawai-red'
                    }
                  >
                    <span
                      aria-hidden
                      className="pt-1 text-sm font-semibold tabular-nums text-kawai-red"
                    >
                      {pad(i + 1)}
                    </span>
                    <span className="flex-1">
                      <span
                        className={
                          compact
                            ? 'block text-[1.2rem] leading-[1.1] text-kawai-black sm:text-[1.5rem]'
                            : 'block text-[1.5rem] leading-[1.1] text-kawai-black'
                        }
                        style={{ fontFamily: DISPLAY, fontWeight: 900 }}
                      >
                        {item.label}
                      </span>
                      <span
                        className={
                          compact
                            ? 'mt-1 block text-[0.9rem] leading-snug text-kawai-muted sm:mt-2 sm:text-[0.95rem]'
                            : 'mt-2 block text-[0.95rem] leading-snug text-kawai-muted'
                        }
                      >
                        {item.detail}
                      </span>
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
      )}
      <div data-reveal="rise" className="mt-12 flex flex-col items-center gap-5 text-center sm:mt-14">
        <p className="max-w-xl text-[1.05rem] font-medium leading-relaxed text-kawai-black">{actions.cta.leadIn}</p>
        <SaleCtaPair {...actions} placement="offers" />
      </div>
    </PromoReveal>
  )
}

/**
 * A headline and its check bullets, at the head of the offers (v1 rep edits,
 * Nov 23, 2026). Words come from the route's content; the template adds only
 * the check marks.
 */
function Checklist({ checklist }: { checklist: SaleChecklist }) {
  const headingId = `${checklist.id}-heading`
  return (
    <section id={checklist.id} aria-labelledby={headingId} className="scroll-mt-24">
      <PromoReveal className="mx-auto max-w-4xl text-center">
        <h2
          id={headingId}
          data-reveal="rise"
          className="text-[clamp(1.75rem,3.4vw,2.6rem)] leading-[1.1] text-kawai-black"
          style={{ fontFamily: DISPLAY, fontWeight: 900, letterSpacing: '-0.012em' }}
        >
          {checklist.heading}
        </h2>
        <ul
          data-reveal="rise"
          className="mx-auto mt-8 flex max-w-3xl flex-col items-start gap-4 text-left sm:mt-10 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-10"
        >
          {checklist.items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-[1.05rem] font-medium leading-snug text-kawai-black">
              <CheckIcon aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-kawai-red" strokeWidth={2.5} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </PromoReveal>
    </section>
  )
}

/**
 * Regulated lockup (Synchrony §4.1/§4.2): `lead` and `apr` are bare text in
 * one h2 at one size and one weight; only `connector` is wrapped and sized
 * down; the subhead follows immediately at ≥40% of the headline size. One
 * wrapper sets the font size so the ratio holds by construction. The holiday
 * script is never used here: a credit headline stays in the display serif.
 */
export const LOCKUP_SIZE = 'clamp(1.9rem, 3.6vw, 2.9rem)'
/**
 * v2 polish (national only): the same lockup scaled up with the spread
 * headings. Only the wrapper size changes; the connector and subhead stay at
 * CONNECTOR_RATIO / SUBHEAD_RATIO of it, so §4.1/§4.2 hold by construction.
 */
export const LOCKUP_SIZE_LOUD = LOUD_HEADING
export const CONNECTOR_RATIO = 0.72
export const SUBHEAD_RATIO = 0.42

function PromoHeading({
  heading,
  id,
  loud = false,
  dark = false,
}: {
  heading: SalePromoHeading
  id: string
  loud?: boolean
  dark?: boolean
}) {
  if (heading.kind === 'lockup') {
    return (
      <div style={{ fontSize: loud ? LOCKUP_SIZE_LOUD : LOCKUP_SIZE }}>
        <h2
          id={id}
          className={dark ? 'leading-[1.08] text-white' : 'leading-[1.08] text-kawai-black'}
          style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: '1em', letterSpacing: '-0.012em' }}
        >
          {heading.lead}{' '}
          <span style={{ fontSize: `${CONNECTOR_RATIO}em` }}>{heading.connector}</span>{' '}
          {heading.apr}
        </h2>
        <p
          className={dark ? 'mt-3 leading-relaxed text-white/85' : 'mt-3 leading-relaxed text-kawai-black/80'}
          style={{ fontSize: `${SUBHEAD_RATIO}em` }}
        >
          {heading.subhead}
        </p>
      </div>
    )
  }
  if (loud || dark) {
    return (
      <h2
        id={id}
        className={`leading-[1.05] ${dark ? 'text-white' : 'text-kawai-black'}`}
        style={{
          fontFamily: DISPLAY,
          fontWeight: 900,
          letterSpacing: '-0.012em',
          fontSize: loud ? LOUD_HEADING : 'clamp(1.9rem, 3.6vw, 2.9rem)',
        }}
      >
        {heading.text}
      </h2>
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

function PromoSpread({
  promo,
  index,
  actions,
  loud = false,
}: {
  promo: SalePromo
  index: number
  actions: Actions
  /** v2 polish (national only): louder headings and values, capped fine-print measure. */
  loud?: boolean
}) {
  const headingId = `${promo.id}-heading`
  if (promo.layout === 'fullBleed' && promo.image) {
    return (
      <PromoFullBleed
        promo={promo}
        image={promo.image}
        number={pad(index + 1)}
        actions={actions}
        heading={<PromoHeading heading={promo.heading} id={headingId} loud={loud} dark />}
      />
    )
  }
  const flip = index % 2 === 1
  const banner = promo.image?.shape === 'banner'
  // Every other spread sits on a Kawai pearl band (v4 color division); the
  // fine print keeps its kawai-muted color, 6.6:1 on pearl. v5: neutral
  // hairline edges, so the band reads as a block on the white field; the pearl
  // itself stays (any darker tint drops the red eyebrows under AA 4.5:1).
  const banded = index % 2 === 0
  // v2 polish: a spread may opt into the dark treatment of the cinematic
  // close (kawai-black, white type). On kawai-black (#1E1B16): white 16.6:1,
  // white/80 ~11:1, white/75 fine print ~9.9:1, kawai-red-400 eyebrow and
  // values ~6.2:1. Every class string below is the original when not dark.
  const dark = promo.tone === 'dark'
  const sectionTone = dark ? 'bg-kawai-black text-white' : banded ? 'border-y border-kawai-neutral bg-kawai-pearl' : 'bg-white'

  return (
    <section
      id={promo.id}
      aria-labelledby={headingId}
      {...(dark ? { 'data-sale-tone': 'dark' } : {})}
      className={`scroll-mt-24 px-5 py-16 sm:px-10 sm:py-24 ${sectionTone}`}
    >
      <PromoReveal className="mx-auto max-w-7xl">
        <article className="group">
          <p
            data-reveal="rise"
            className={`flex items-baseline gap-4 text-xs font-semibold uppercase tracking-[0.26em] ${dark ? 'text-kawai-red-400' : 'text-kawai-red'}`}
          >
            <span aria-hidden className={`tabular-nums ${dark ? 'text-white' : 'text-kawai-black'}`}>
              {pad(index + 1)}
            </span>
            {promo.eyebrow}
          </p>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
            {promo.image ? (
              <div className={banner ? 'lg:col-span-12' : `lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}>
                <div
                  data-reveal="wipe"
                  className={`relative overflow-hidden ${dark ? 'bg-white/5' : 'bg-kawai-pearl'} ${banner ? 'aspect-[2506/649]' : 'aspect-[4/3] lg:aspect-[5/4]'}`}
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
                <PromoHeading heading={promo.heading} id={headingId} loud={loud} dark={dark} />
              </div>

              {promo.body && (
                <p
                  data-reveal="rise"
                  className={`mt-5 text-[1.05rem] leading-relaxed ${dark ? 'text-white/80' : 'text-kawai-black/75'}`}
                >
                  {promo.body}
                </p>
              )}

              {promo.rows && promo.rows.length > 0 && (
                <ul data-reveal="rise" className={`mt-7 border-t ${dark ? 'border-white/15' : 'border-kawai-black/15'}`}>
                  {promo.rows.map((row) => (
                    <li
                      key={row.label}
                      className={`flex items-baseline justify-between gap-4 border-b ${dark ? 'border-white/15' : 'border-kawai-black/15'} py-3.5`}
                    >
                      <span>
                        <span className={`font-semibold ${dark ? 'text-white' : 'text-kawai-black'}`}>{row.label}</span>
                        {row.note && (
                          <span className={`ml-2 text-sm ${dark ? 'text-white/75' : 'text-kawai-muted'}`}>{row.note}</span>
                        )}
                      </span>
                      <span
                        className={`whitespace-nowrap ${loud ? 'text-[1.6rem] leading-none' : 'text-[1.15rem]'} ${dark ? 'text-kawai-red-400' : 'text-kawai-red'}`}
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
                  className={`mt-6 border-l-[3px] border-kawai-red pl-4 text-sm font-medium leading-relaxed ${dark ? 'text-white/85' : 'text-kawai-black/85'}`}
                >
                  {promo.note}
                </p>
              )}

              {promo.storeContact && actions.store && (
                <StoreContact lead={promo.storeContact.lead} store={actions.store} />
              )}

              {promo.link && (
                <Link
                  data-reveal="rise"
                  href={promo.link.href}
                  className={
                    dark
                      ? 'group/link mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-kawai-black transition hover:-translate-y-0.5 hover:bg-kawai-red hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
                      : 'group/link mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-kawai-black px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-kawai-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red'
                  }
                >
                  {promo.link.label}
                  <span aria-hidden className="transition-transform group-hover/link:translate-x-0.5">
                    →
                  </span>
                </Link>
              )}

              {promo.cta && (
                <div data-reveal="rise" className="mt-8">
                  <SaleCtaPair {...actions} placement={promo.id} align="start" {...(dark ? { tone: 'dark' as const } : {})} />
                </div>
              )}
            </div>
          </div>

          {promo.fineprint.length > 0 && (
            // Visible page text on load — never collapsed. Legible at ≥12.8px.
            <div
              {...(promo.fineprintId ? { id: promo.fineprintId } : {})}
              className={`mt-10 space-y-2.5 border-t ${dark ? 'border-white/15' : 'border-kawai-black/10'} pt-5 sm:mt-12${loud ? ' max-w-4xl' : ''}`}
            >
              {promo.fineprint.map((line) => (
                <p key={line} className={`text-[0.8rem] leading-relaxed ${dark ? 'text-white/75' : 'text-kawai-muted'}`}>
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
  checklist,
  promos,
  moments,
  cta,
  callLabel,
  store,
  polish,
}: {
  intro: string
  highlights: readonly SaleHighlight[]
  checklist?: SaleChecklist | undefined
  promos: readonly SalePromo[]
  moments: readonly Moment[]
  cta: SaleCta
  callLabel: string
  store?: SaleStore | undefined
  /** v2 polish flags (national only); omitted, everything renders as before. */
  polish?: SalePolish | undefined
}) {
  const actions: Actions = { cta, callLabel, store }
  return (
    <div
      id="offers"
      // v3 (national only): the hero's "View Offers" lands below the sticky header.
      className={`bg-white py-16 sm:py-24${polish ? ' scroll-mt-16' : ''}`}
      style={{ fontFamily: SANS }}
    >
      <div className="px-5 sm:px-10">
        {checklist && checklist.items.length > 0 && <Checklist checklist={checklist} />}
        <OfferIndex
          intro={intro}
          items={highlights}
          promos={promos}
          actions={actions}
          {...(polish?.compactIndex ? { compact: true } : {})}
        />
      </div>
      <div className="mt-24 sm:mt-32">
        {promos.map((promo, i) => (
          <Fragment key={promo.id}>
            {moments
              .filter((m) => m.before === promo.id)
              .map((m) => (
                <SaleMoment key={m.id} moment={m} {...(polish?.largeGallery ? { largeGallery: true } : {})} />
              ))}
            <PromoSpread promo={promo} index={i} actions={actions} {...(polish?.loudOffers ? { loud: true } : {})} />
          </Fragment>
        ))}
      </div>
    </div>
  )
}
