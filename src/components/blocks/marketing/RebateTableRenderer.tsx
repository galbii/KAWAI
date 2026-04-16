import 'server-only'
import { cache } from 'react'
import type { MarketingRebateTableBlock, Collection } from '@/payload-types'
import { RebateSchedule } from '@/app/(frontend)/digital-piano-rebate/components/RebateSchedule'
import type { RebateSeries } from '@/app/(frontend)/digital-piano-rebate/components/RebateSchedule'
import { getProductByModel } from '@/lib/shopify'
import { getPayloadClient } from '@/lib/payload/queries'

const getProductByModelCached = cache(getProductByModel)

type CollectionWithMediaUrl = { col: Collection; mediaUrl: string | undefined }

// Fetch Collection at depth:0, then separately fetch Media via direct findByID.
// Direct Media findByID fires generateFileURL afterRead — nested depth:1 population does NOT.
const getCollectionWithMedia = cache(async (id: string): Promise<CollectionWithMediaUrl | null> => {
  try {
    const payload = await getPayloadClient()
    const col = await payload.findByID({ collection: 'collections', id, depth: 0 }) as Collection

    let mediaUrl: string | undefined
    const rawMedia = col.media
    if (rawMedia != null) {
      const mediaId = typeof rawMedia === 'string' ? rawMedia : rawMedia.id
      try {
        const mediaDoc = await payload.findByID({ collection: 'media', id: mediaId, depth: 0 })
        const s3Base = (process.env.NEXT_PUBLIC_S3_PUBLIC_URL ?? '').replace(/\/$/, '')
        mediaUrl =
          (mediaDoc as any).url ??
          ((mediaDoc as any).filename ? `${s3Base}/media/${(mediaDoc as any).filename}` : undefined)
      } catch {
        // Media doc missing — skip silently
      }
    }

    return { col, mediaUrl }
  } catch (err) {
    console.error('[RebateTableRenderer] collection fetch failed', id, err)
    return null
  }
})

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
    (rawSchedule ?? []).map(async (series) => {
      // Resolve the collection ID whether it came in as a bare string or a populated object
      const rawCol = series.collection
      const colId = rawCol != null
        ? (typeof rawCol === 'string' ? rawCol : (rawCol as Collection).id)
        : null

      let collectionYoutubeUrl: string | undefined
      let collectionBannerImageUrl: string | undefined

      if (colId) {
        const result = await getCollectionWithMedia(String(colId))
        if (result) {
          const { col, mediaUrl } = result
          // Priority 1: YouTube video embed
          collectionYoutubeUrl = col.youtubeUrl ?? undefined
          // Priority 2: Payload media upload (fetched directly so generateFileURL fires)
          collectionBannerImageUrl = mediaUrl
          // Priority 3: Shopify-synced imageUrl as last resort
          if (!collectionBannerImageUrl) {
            collectionBannerImageUrl = col.imageUrl ?? undefined
          }
        }
      }

      return {
        seriesName: series.seriesName,
        ...(collectionYoutubeUrl ? { collectionYoutubeUrl } : {}),
        ...(collectionBannerImageUrl ? { collectionBannerImageUrl } : {}),
        models: await Promise.all(
        (series.models ?? []).map(async (m) => {
          const row = m as typeof m & { productPage?: PopulatedProductPage | string | null }
          const productPage = row.productPage
          const isObj = productPage != null && typeof productPage === 'object'

          // Fetch live Shopify availability for rows with a linked product
          let liveVariantId: string | undefined
          let liveAvailable: boolean | undefined

          let liveCompareAtPrice: number | undefined
          let liveShopifyPrice: number | undefined

          if (isObj && productPage.model) {
            try {
              const shopifyProduct = await getProductByModelCached(productPage.model)
              if (shopifyProduct) {
                const firstAvailable = shopifyProduct.variants.find((v) => v.available)
                const variant = firstAvailable ?? shopifyProduct.variants[0]
                if (variant) {
                  liveVariantId = variant.id
                  liveAvailable = variant.available
                  if (variant.compareAtPrice != null) liveCompareAtPrice = variant.compareAtPrice
                  liveShopifyPrice = variant.price
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
            ...(liveCompareAtPrice != null ? { productCompareAtPrice: liveCompareAtPrice } : isObj && productPage.price?.msrp != null ? { productMsrp: productPage.price.msrp } : {}),
            ...(liveShopifyPrice != null ? { productShopifyPrice: liveShopifyPrice } : {}),
            ...(isObj && productPage.price?.currency ? { productCurrency: productPage.price.currency } : {}),
            ...(variantId ? { productVariantId: variantId } : {}),
            ...(isObj ? { productAvailable: available, productBackorder: productPage.backorder ?? false } : {}),
          }
        })
        ),
      }
    })
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
