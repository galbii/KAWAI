import { unstable_cache } from 'next/cache'
import { fetchShopifyProductByModel } from '@/lib/shopify/fetch-product'
import { getPayloadClient } from '@/lib/payload/queries'
import type { Media } from '@/payload-types'

export type ShigeruModelShopifyData = {
  imageUrl: string | null
  finishes: string[]
  specLength: string | null
  specLengthSub: string | null
  specWidth: string | null
  specWidthSub: string | null
  specWeight: string | null
  specWeightSub: string | null
  specBeams: string | null
}

export type ShigeruPageData = Record<string, ShigeruModelShopifyData>

// Values must match Shopify's custom.model metafield exactly.
// SK-EX is stored with a dash in Shopify — "SKEX" would return no results.
const SK_MODELS = ['SK2', 'SK3', 'SK5', 'SK6', 'SK7', 'SK-EX'] as const

function fuzzySpec(
  json: Record<string, unknown>,
  keyword: string,
): { value: string; sub: string | null } | null {
  const matches = Object.entries(json).filter(([k]) =>
    k.toLowerCase().includes(keyword.toLowerCase()),
  )
  if (matches.length === 0) return null
  const primary = matches[0]!
  const secondary = matches[1]
  return {
    value: typeof primary[1] === 'string' ? primary[1] : String(primary[1]),
    sub: secondary
      ? typeof secondary[1] === 'string'
        ? secondary[1]
        : String(secondary[1])
      : null,
  }
}

const EMPTY: ShigeruModelShopifyData = {
  imageUrl: null,
  finishes: [],
  specLength: null,
  specLengthSub: null,
  specWidth: null,
  specWidthSub: null,
  specWeight: null,
  specWeightSub: null,
  specBeams: null,
}

// Looks up the first customMedia image for a given model from Payload CMS.
// Returns null if no customMedia image is set — caller falls back to Shopify.
async function getCustomMediaUrl(payload: Awaited<ReturnType<typeof getPayloadClient>>, model: string): Promise<string | null> {
  try {
    const result = await payload.find({
      collection: 'products',
      where: { model: { equals: model } },
      select: { customMedia: true },
      depth: 1,
      limit: 1,
    })
    const doc = result.docs[0]
    if (!doc?.customMedia?.length) return null
    const firstImage = doc.customMedia.find(
      (item) => !item.mediaType || item.mediaType === 'media',
    )
    if (!firstImage?.image) return null
    const img = firstImage.image as Media | string
    return typeof img === 'object' && img !== null && 'url' in img
      ? (img.url ?? null)
      : null
  } catch {
    return null
  }
}

// Fetches all six SK model images + specs.
// Priority: Payload CMS customMedia[0] → Shopify featuredImage → Shopify images[0].
// Cached for 1h, busted by 'shigeru-product-images' tag.
export const getShigeruPageData = unstable_cache(
  async (): Promise<ShigeruPageData> => {
    const payload = await getPayloadClient()
    const results = await Promise.all(
      SK_MODELS.map(async (model) => {
        const key = model.toLowerCase().replace(/-/g, '') // 'SK-EX' → 'skex'
        try {
          const [shopifyProduct, customMediaUrl] = await Promise.all([
            fetchShopifyProductByModel(model),
            getCustomMediaUrl(payload, model),
          ])
          const shopifyImageUrl =
            shopifyProduct?.featuredImage?.url ?? shopifyProduct?.images?.[0]?.url ?? null
          const imageUrl = customMediaUrl ?? shopifyImageUrl
          const finishes =
            shopifyProduct?.variants
              .filter((v) => v.title !== 'Default Title')
              .map((v) => v.title) ?? []
          const json = shopifyProduct?.metafields?.specificationJson ?? null
          const lengthSpec = json ? fuzzySpec(json, 'length') : null
          const widthSpec = json ? fuzzySpec(json, 'width') : null
          const weightSpec = json ? fuzzySpec(json, 'weight') : null
          const beamsSpec = json ? fuzzySpec(json, 'beam') : null
          return [
            key,
            {
              imageUrl,
              finishes,
              specLength: lengthSpec?.value ?? null,
              specLengthSub: lengthSpec?.sub ?? null,
              specWidth: widthSpec?.value ?? null,
              specWidthSub: widthSpec?.sub ?? null,
              specWeight: weightSpec?.value ?? null,
              specWeightSub: weightSpec?.sub ?? null,
              specBeams: beamsSpec?.value ?? null,
            } satisfies ShigeruModelShopifyData,
          ] as const
        } catch {
          return [key, EMPTY] as const
        }
      }),
    )
    return Object.fromEntries(results)
  },
  ['shigeru-page-data'],
  { tags: ['shigeru-product-images'], revalidate: 3600 },
)
