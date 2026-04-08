import type { MarketingRebateTableBlock } from '@/payload-types'
import { RebateSchedule } from '@/app/(frontend)/digital-piano-rebate/components/RebateSchedule'
import type { RebateSeries } from '@/app/(frontend)/digital-piano-rebate/components/RebateSchedule'

export function RebateTableRenderer(props: MarketingRebateTableBlock) {
  const { eyebrow, heading, deadline, schedule: rawSchedule } = props

  const schedule: RebateSeries[] = (rawSchedule ?? []).map((series) => ({
    seriesName: series.seriesName,
    models: (series.models ?? []).map((m) => {
      const row = m as typeof m & {
        productPage?: {
          slug?: string
          name?: string
          imageUrl?: string
          price?: { msrp?: number; currency?: string }
          variations?: Array<{ shopifyVariantId?: string; available?: boolean }>
          backorder?: boolean
        } | string | null
      }
      const productPage = row.productPage
      const isObj = productPage != null && typeof productPage === 'object'
      const firstVariant = isObj ? productPage.variations?.[0] : undefined

      return {
        model: m.model,
        finishes: m.finishes ?? '',
        consumerRebate: m.consumerRebate,
        ...(isObj && productPage.slug ? { productSlug: productPage.slug } : {}),
        ...(isObj && productPage.name ? { productName: productPage.name } : {}),
        ...(isObj && productPage.imageUrl ? { productImageUrl: productPage.imageUrl } : {}),
        ...(isObj && productPage.price?.msrp != null ? { productMsrp: productPage.price.msrp } : {}),
        ...(isObj && productPage.price?.currency ? { productCurrency: productPage.price.currency } : {}),
        ...(firstVariant?.shopifyVariantId ? { productVariantId: firstVariant.shopifyVariantId } : {}),
        ...(isObj ? { productAvailable: firstVariant?.available !== false || (productPage.backorder ?? false) } : {}),
        ...(isObj ? { productBackorder: productPage.backorder ?? false } : {}),
      }
    }),
  }))

  if (schedule.length === 0) return null

  return (
    <RebateSchedule
      schedule={schedule}
      {...(eyebrow != null ? { eyebrow } : {})}
      {...(heading != null ? { heading } : {})}
      {...(deadline != null ? { deadline } : {})}
    />
  )
}
