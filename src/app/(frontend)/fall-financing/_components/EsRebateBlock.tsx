import { Q4_CONTAINER } from './PromoStyles'
import { BlockHead, ProductCard, PromoButton } from './PromoUI'
import { rebate, REBATE_AMOUNTS, PROGRAM_END_SHORT, SECTION } from './campaign'
import type { PromoProduct } from '@/lib/payload/promo-types'

/**
 * Up to $150 off three ES Series portables.
 *
 * Three models only, so this is a short list rather than a table. A filterable
 * table for three rows would be scaffolding with nothing to hold up — the
 * shopper can see the whole offer at once, which is the point of an instant
 * rebate, and the cards let each instrument show itself.
 *
 * Server-rendered: nothing here is interactive, so nothing here needs to be a
 * client component.
 *
 * The trade bulletin splits each rebate 50/50 between Kawai and the dealer.
 * That split is deliberately absent — a shopper sees one number come off the
 * price at the counter, and the reimbursement arrangement behind it is not
 * theirs to read.
 */
export function EsRebateBlock({ products }: { products: PromoProduct[] }) {
  // Join the catalogue to this quarter's rebate list, in rebate order — the
  // biggest saving first, which is the order a shopper scans for.
  const rows = REBATE_AMOUNTS.map((entry) => {
    const product = products.find((p) => p.model === entry.model)
    return product ? { product, ...entry } : null
  })
    .filter((r): r is { product: PromoProduct; model: string; rebate: number; finishes: string } =>
      r !== null,
    )
    .sort((a, b) => b.rebate - a.rebate)

  return (
    <section
      id={SECTION.rebate}
      className="scroll-mt-20 border-b border-[color:var(--rule)] bg-[color:var(--paper)]"
    >
      <div className={`${Q4_CONTAINER} py-20 md:py-28`}>
        <BlockHead
          heading={rebate.heading}
          standfirst={rebate.standfirst}
          aside={`Through ${PROGRAM_END_SHORT}`}
        />

        {rows.length === 0 ? (
          <p className="border border-[color:var(--rule-soft)] bg-[color:var(--card)] px-6 py-12 text-center text-[0.95rem] text-[color:var(--muted)]">
            {rebate.emptyState}
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((row) => (
              <li key={row.product.slug} className="flex flex-col">
                <ProductCard product={row.product} saving={row.rebate} />
                <p className="mt-2.5 text-[0.8rem] text-[color:var(--muted-dim)]">
                  {row.finishes}
                </p>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 flex flex-wrap items-start gap-6">
          <PromoButton />
          <p className="max-w-[54ch] text-[0.76rem] leading-relaxed text-[color:var(--muted-dim)]">
            {rebate.disclaimer}
          </p>
        </div>
      </div>
    </section>
  )
}
