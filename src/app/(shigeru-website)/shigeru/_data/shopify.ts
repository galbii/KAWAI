import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload/queries'

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

// Model values must match the Payload product's `model` field exactly.
// Mirrors Shopify's custom.model metafield: numbered models have no dash,
// SK-EX retains the dash.
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

type PayloadSkData = {
  imageUrl: string | null
  finishes: string[]
  specificationJson: Record<string, unknown> | null
}

// Reads the Payload product for a given SK model. All Shigeru page data
// (image, finishes, specs) is sourced from Payload — the sync job is
// responsible for keeping these fields fresh from Shopify.
async function getPayloadSkData(
  payload: Awaited<ReturnType<typeof getPayloadClient>>,
  model: string,
): Promise<PayloadSkData> {
  const empty: PayloadSkData = { imageUrl: null, finishes: [], specificationJson: null }
  try {
    const result = await payload.find({
      collection: 'products',
      where: { model: { equals: model } },
      select: { imageUrl: true, variations: true, specificationJson: true },
      depth: 0,
      limit: 1,
    })
    const doc = result.docs[0]
    if (!doc) return empty

    const finishes =
      doc.variations
        ?.map((v: any) => v.name)
        .filter((n: string | null | undefined): n is string => !!n && n !== 'Default Title') ?? []

    const rawJson = (doc as any).specificationJson
    const specificationJson =
      rawJson && typeof rawJson === 'object' && !Array.isArray(rawJson)
        ? (rawJson as Record<string, unknown>)
        : null

    return {
      imageUrl: doc.imageUrl || null,
      finishes,
      specificationJson,
    }
  } catch {
    return empty
  }
}

// Fetches all six SK model images + finishes + specs from Payload.
// Cached for 1h, busted by 'shigeru-product-images' tag.
export const getShigeruPageData = unstable_cache(
  async (): Promise<ShigeruPageData> => {
    const payload = await getPayloadClient()
    const results = await Promise.all(
      SK_MODELS.map(async (model) => {
        const key = model.toLowerCase().replace(/-/g, '') // 'SK-EX' → 'skex'
        try {
          const data = await getPayloadSkData(payload, model)
          const json = data.specificationJson
          const lengthSpec = json ? fuzzySpec(json, 'length') : null
          const widthSpec = json ? fuzzySpec(json, 'width') : null
          const weightSpec = json ? fuzzySpec(json, 'weight') : null
          const beamsSpec = json ? fuzzySpec(json, 'beam') : null
          return [
            key,
            {
              imageUrl: data.imageUrl,
              finishes: data.finishes,
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
