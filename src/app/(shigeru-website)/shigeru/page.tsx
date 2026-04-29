import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { fetchShopifyProductByModel } from '@/lib/shopify/fetch-product'
import { ShigeruHero } from './_components/ShigeruHero'
import { ShigeruProductShowcase } from './_components/ShigeruProductShowcase'
import { ShigeruArtistsSection } from './_components/ShigeruArtistsSection'
import { MasterArtisansSection } from './_components/MasterArtisansSection'
import { ShigeruContactBox } from './_components/ShigeruContactBox'

// Shopify custom.model metafield values — no dashes
const SK_MODELS = ['SK2', 'SK3', 'SK5', 'SK6', 'SK7', 'SKEX'] as const

type ShigeruModelShopifyData = {
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

type ShigeruPageData = Record<string, ShigeruModelShopifyData>

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

const EMPTY_MODEL_DATA: ShigeruModelShopifyData = {
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

const getShigeruPageData = unstable_cache(
  async (): Promise<ShigeruPageData> => {
    const results = await Promise.all(
      SK_MODELS.map(async (model) => {
        try {
          const product = await fetchShopifyProductByModel(model)
          const imageUrl =
            product?.featuredImage?.url ?? product?.images?.[0]?.url ?? null
          const finishes =
            product?.variants
              .filter((v) => v.title !== 'Default Title')
              .map((v) => v.title) ?? []
          const json = product?.metafields?.specificationJson ?? null
          const lengthSpec = json ? fuzzySpec(json, 'length') : null
          const widthSpec = json ? fuzzySpec(json, 'width') : null
          const weightSpec = json ? fuzzySpec(json, 'weight') : null
          const beamsSpec = json ? fuzzySpec(json, 'beam') : null
          return [
            model.toLowerCase(),
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
          return [model.toLowerCase(), EMPTY_MODEL_DATA] as const
        }
      }),
    )
    return Object.fromEntries(results)
  },
  ['shigeru-page-data'],
  { tags: ['shigeru-product-images'], revalidate: 3600 },
)

export const metadata: Metadata = {
  title: 'Shigeru Kawai Grand Pianos | SK-2 to SK-EX | Handcrafted in Japan',
  description:
    "Shigeru Kawai grand pianos are the pinnacle of Japanese piano craftsmanship. Six handcrafted models from the SK-2 salon grand to the SK-EX concert grand — fewer than 20 SK-EX instruments are made each year at the Ryuyo factory in Hamamatsu, Japan.",
  keywords: [
    'shigeru kawai',
    'shigeru kawai grand piano',
    'shigeru kawai sk-ex',
    'shigeru kawai sk-7',
    'concert grand piano',
    'japanese grand piano',
    'handcrafted grand piano',
    'luxury grand piano',
    'kawai grand piano',
    'master piano artisan',
    'ryuyo factory',
    'shigeru kawai price',
    'shigeru kawai dealer',
  ],
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kawaius.com'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Shigeru Kawai Grand Pianos',
  description:
    'The complete collection of six Shigeru Kawai handcrafted grand pianos — from the SK-2 Classic Salon Grand to the SK-EX Concert Grand.',
  url: `${siteUrl}/shigeru`,
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Shigeru Kawai', item: `${siteUrl}/shigeru` },
    ],
  },
}

export default async function ShigeruPage() {
  const productData = await getShigeruPageData()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ShigeruHero />
      <ShigeruProductShowcase productData={productData} />
      <ShigeruArtistsSection />
      <MasterArtisansSection />
      <ShigeruContactBox />
    </>
  )
}
