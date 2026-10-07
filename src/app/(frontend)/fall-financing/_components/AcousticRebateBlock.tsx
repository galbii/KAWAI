import Image from 'next/image'
import Link from 'next/link'
import { PromoStage } from '@/components/fall-promo'
import { PromoButton } from './PromoUI'
import { acousticRebate, acousticRebates, PROGRAM_END_SHORT, SECTION } from './campaign'
import { formatOfferPrice } from './money'
import type { RebateModelArt } from '@/lib/payload/queries'

/**
 * Up to CAD 2,600 off a new acoustic piano. ca.kawaius.com only.
 *
 * The Canadian counterpart to the US financing block, and it sits in the same
 * place on the page for that reason: both are the acoustic offer, and a
 * Canadian visitor should meet one where an American meets the other.
 *
 * ── Rows link to the model's page ─────────────────────────────────────────
 * Each row is a link to its product page, where a Canadian shopper sees the
 * instrument at full size with CA pricing and a dealer CTA. Not the ES
 * ledger's `RebateModelModal`: that card states an MSRP and a "your price",
 * and the rebate here comes off a dealer's price this page does not quote.
 *
 * The rows used to be inert, because the ND-21 had no product record and a
 * ledger where five rows respond and the sixth does not reads as broken. It
 * has one now (`kawai-nd-21-upright-piano`, Canada only), so all six link.
 * A model whose record goes missing again falls back to a plain row rather
 * than a link to nowhere.
 *
 * ── Prices ────────────────────────────────────────────────────────────────
 * The ledger shows the rebate and nothing else. No MSRP, no "your price", for
 * the reason above: the only prices this app holds for these models are
 * American. A rebate in CAD is a fact; a Canadian price is not one this page
 * can state.
 */
export function AcousticRebateBlock({ art }: { art: Record<string, RebateModelArt> }) {
  return (
    <PromoStage
      id={SECTION.acoustic}
      image={acousticRebate.stageImage}
      imageAlt={acousticRebate.stageImageAlt}
      eyebrow={`Through ${PROGRAM_END_SHORT}`}
      heading={acousticRebate.heading}
      subheading={acousticRebate.standfirst}
      scrim={0}
      lockupCard
      aside={
        /* Opaque panel, so it re-asserts the light set — on the stage's dark
           tokens the model names would set Ivory on Parchment. */
        <ul className="promo-on-light border border-[color:var(--rule)] bg-[color:var(--ground)]">
          {acousticRebates.map((row) => {
            const entry = art[row.model]
            const href = entry?.slug ? `/products/${entry.slug}` : null

            const cells = (
              <>
                <span className="relative h-14 w-18 shrink-0 overflow-hidden bg-white sm:h-16 sm:w-20">
                  <Image
                    src={entry?.imageUrl ?? acousticRebate.fallbackImage}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-contain p-1 transition-transform duration-500 group-hover:scale-105"
                  />
                </span>

                <span className="min-w-0">
                  <span className="promo-body block truncate text-[1.15rem] font-medium text-[color:var(--on-ground)] sm:text-[1.3rem]">
                    {entry?.label ?? row.label}
                  </span>
                  <span className="promo-body mt-1 block truncate text-[0.82rem] text-[color:var(--body-dim)]">
                    {acousticRebate.finish}
                  </span>
                </span>

                <span data-reveal="pop" data-reveal-delay="0.35" className="whitespace-nowrap text-right">
                  <span className="promo-label block text-[color:var(--money-accent)]">Save</span>
                  <span className="promo-num mt-0.5 block text-[1.3rem] font-semibold text-[color:var(--on-ground)] sm:text-[1.45rem]">
                    {formatOfferPrice(row.cad, 'CAD')}
                  </span>
                </span>
              </>
            )

            const grid =
              'grid items-center gap-x-4 px-5 py-5 sm:gap-x-6 sm:px-7 sm:py-6'

            return (
              <li
                key={row.model}
                data-reveal="slide"
                className="border-b border-[color:var(--rule-soft)] last:border-b-0"
              >
                {href ? (
                  <Link
                    href={href}
                    className={`promo-focus group ${grid} grid-cols-[auto_minmax(0,1fr)_auto_auto] transition-colors duration-200 hover:bg-[color:var(--surface)]`}
                  >
                    {cells}
                    {/* The ES ledger's affordance, so the two ledgers on the
                        page say "this goes somewhere" the same way. */}
                    <svg
                      className="h-5 w-5 text-[color:var(--body-dim)] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[color:var(--money)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                ) : (
                  <div className={`${grid} grid-cols-[auto_minmax(0,1fr)_auto]`}>{cells}</div>
                )}
              </li>
            )
          })}
        </ul>
      }
    >
      <p className="promo-body text-[1rem] font-medium leading-snug text-[color:var(--ivory)]">
        {acousticRebate.dealerNote}
      </p>

      <div className="mt-7">
        <PromoButton />
      </div>

      {/* Beside the figures it qualifies, like the ES block's. It matters more
          here: ca.kawaius.com renders no FinancingDisclosure, so the page's
          fine print is whatever its sections carry themselves. */}
      <p className="promo-body mt-9 max-w-[46ch] text-[0.72rem] leading-relaxed text-[color:var(--ivory)]/80">
        {acousticRebate.disclaimer}
      </p>
    </PromoStage>
  )
}
