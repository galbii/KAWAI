import { formatPrice } from '@/lib/utils'
import type { RebateCategory } from '@/lib/payload/rebate-types'
import type { RebateSeries } from '@/app/(frontend)/digital-piano-rebate/components/RebateSchedule'

/**
 * Adapt the /signup rebate data (category → products, pre-priced server-side) to
 * the shape the marketing Rebate Table UI (`RebateSchedule`) consumes. Pure and
 * presentational — runs on already-fetched data, so it changes nothing about how
 * rebates are queried.
 *
 *   category.label                → seriesName
 *   product.label (e.g. "GX-7")   → model
 *   product.note  (finish/elig.)  → finishes
 *   product.rebate                → consumerRebate
 *   product.msrp                  → productMsrp  (RebateSchedule then derives
 *                                                 salePrice = msrp − rebate = yourPrice)
 *
 * No Shopify variant is supplied, so Add-to-Cart never renders — rows fall back to
 * the View / Sign-Up CTAs (lead-gen mode).
 */
export function toRebateSeries(data: RebateCategory[]): RebateSeries[] {
  return data.map((category) => ({
    seriesName: category.label,
    models: category.products.map((p) => {
      // Show total savings off the true MSRP so the math reconciles: a piano can
      // be marked down from MSRP *and* carry a rebate, so "Save $400" beside a
      // $7,799 → $6,599 strikethrough reads as broken. Anchor everything to MSRP
      // and let the displayed savings be the full MSRP → your-price gap.
      const totalSavings = Math.max(p.msrp - p.yourPrice, 0)
      // Always call out the instant rebate whenever there is one — including
      // acoustic models with no compare-at markdown, where the whole saving IS
      // the rebate. When the piano is *also* marked down from MSRP, this same
      // line breaks out the rebate's share of the total.
      const rebateNote =
        p.rebate > 0
          ? `Includes ${formatPrice(p.rebate, p.currency)} instant rebate`
          : undefined
      return {
        model: p.label,
        finishes: p.note ?? '',
        consumerRebate: totalSavings,
        productSlug: p.slug,
        productName: p.name,
        productCompareAtPrice: p.msrp,
        productShopifyPrice: p.msrp,
        productCurrency: p.currency,
        productAvailable: true,
        ...(rebateNote ? { rebateNote } : {}),
        ...(p.imageUrl ? { productImageUrl: p.imageUrl } : {}),
      }
    }),
  }))
}
