import 'server-only'
import { cache } from 'react'
import type { MarketingRebateTableBlock } from '@/payload-types'
import { RebateSchedule } from '@/app/(frontend)/digital-piano-rebate/components/RebateSchedule'
import type { RebateSeries } from '@/app/(frontend)/digital-piano-rebate/components/RebateSchedule'
import { getProductByModel } from '@/lib/shopify'

const getProductByModelCached = cache(getProductByModel)

type PopulatedProductPage = {
  slug?: string
  name?: string
  imageUrl?: string
  model?: string
  price?: { msrp?: number; currency?: string }
  variations?: Array<{ shopifyVariantId?: string; available?: boolean }>
  backorder?: boolean
}

export async function RebateTableRenderer(props: MarketingRebateTableBlock) {
  const { eyebrow, heading, deadline, schedule: rawSchedule } = props

  const schedule: RebateSeries[] = await Promise.all(
    (rawSchedule ?? []).map(async (series) => ({
      seriesName: series.seriesName,
      models: await Promise.all(
        (series.models ?? []).map(async (m) => {
          const row = m as typeof m & { productPage?: PopulatedProductPage | string | null }
          const productPage = row.productPage
          const isObj = productPage != null && typeof productPage === 'object'

          // Fetch live Shopify availability for rows with a linked product
          let liveVariantId: string | undefined
          let liveAvailable: boolean | undefined

          if (isObj && productPage.model) {
            try {
              const shopifyProduct = await getProductByModelCached(productPage.model)
              if (shopifyProduct) {
                const firstAvailable = shopifyProduct.variants.find((v) => v.available)
                const variant = firstAvailable ?? shopifyProduct.variants[0]
                if (variant) {
                  liveVariantId = variant.id
                  liveAvailable = variant.available
                }
              }
            } catch (err) {
              console.error('[RebateTableRenderer] Shopify fetch failed for model', productPage.model, err)
            }
          }

          // CMS fallback values (used if live fetch fails/unavailable)
          const firstVariant = isObj ? productPage.variations?.[0] : undefined
          const cmsVariantId = firstVariant?.shopifyVariantId
          const cmsAvailable = firstVariant?.available !== false || (isObj ? (productPage.backorder ?? false) : false)

          const variantId = liveVariantId ?? cmsVariantId
          const available =
            liveAvailable !== undefined
              ? liveAvailable || (isObj ? (productPage.backorder ?? false) : false)
              : cmsAvailable

          return {
            model: m.model,
            finishes: m.finishes ?? '',
            consumerRebate: m.consumerRebate,
            ...(isObj && productPage.slug ? { productSlug: productPage.slug } : {}),
            ...(isObj && productPage.name ? { productName: productPage.name } : {}),
            ...(isObj && productPage.imageUrl ? { productImageUrl: productPage.imageUrl } : {}),
            ...(isObj && productPage.price?.msrp != null ? { productMsrp: productPage.price.msrp } : {}),
            ...(isObj && productPage.price?.currency ? { productCurrency: productPage.price.currency } : {}),
            ...(variantId ? { productVariantId: variantId } : {}),
            ...(isObj ? { productAvailable: available, productBackorder: productPage.backorder ?? false } : {}),
          }
        })
      ),
    }))
  )

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
