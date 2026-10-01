import Image from 'next/image'
import { PromoStage } from '@/components/fall-promo'
import { PromoButton } from './PromoUI'
import { acousticRebate, acousticRebates, PROGRAM_END_SHORT, SECTION } from './campaign'
import { formatPrice } from '@/lib/utils'
import type { RebateModelArt } from '@/lib/payload/queries'

/**
 * Up to CAD 2,600 off a new acoustic piano. ca.kawaius.com only.
 *
 * The Canadian counterpart to the US financing block, and it sits in the same
 * place on the page for that reason: both are the acoustic offer, and a
 * Canadian visitor should meet one where an American meets the other.
 *
 * ── Not clickable, by decision ────────────────────────────────────────────
 * The ES ledger's rows are buttons that open `RebateModelModal`. These are
 * plain rows, and that is not a shortcut:
 *
 *   · ND-21 has no product record yet, so one row in six has nothing to open.
 *     A ledger where five rows respond and the sixth does not is worse than one
 *     where none do.
 *   · The card shows MSRP and a "your price". Payload's catalogue prices are
 *     USD, and this is the Canadian page — the card would render a US figure
 *     under a CAD label, which is the bug the ES ledger avoids by hiding prices
 *     and which the card itself does not avoid. Nothing here opens it, so
 *     nothing here can hit it.
 *
 * So the rows carry no chevron, no hover translate and no focus ring: nothing
 * that offers an interaction the row does not have. The section's one action is
 * the dealer button, which is the only action the offer actually has — the
 * rebate is applied in a showroom.
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
            return (
              <li
                key={row.model}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 border-b border-[color:var(--rule-soft)] px-5 py-5 last:border-b-0 sm:gap-x-6 sm:px-7 sm:py-6"
              >
                <span className="relative h-14 w-18 shrink-0 overflow-hidden bg-white sm:h-16 sm:w-20">
                  <Image
                    src={entry?.imageUrl ?? acousticRebate.fallbackImage}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-contain p-1"
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

                <span className="whitespace-nowrap text-right">
                  <span className="promo-label block text-[color:var(--money-accent)]">Save</span>
                  <span className="promo-num mt-0.5 block text-[1.3rem] font-semibold text-[color:var(--on-ground)] sm:text-[1.45rem]">
                    {formatPrice(row.cad, 'CAD')}
                  </span>
                </span>
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
