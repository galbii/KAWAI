import type { Metadata } from 'next'
import {
  getCatalogProductsDirect,
  getProductSpotlightNewsItems,
  getCollectionsForBrowser,
  getPayloadClient,
} from '@/lib/payload/queries'
import { PianosBrowser } from '@/components/piano/PianosBrowser'
import { NewsCarousel } from '@/components/homepage/news-carousel'
import { RenderBlocks } from '@/components/RenderBlocks'
import type { Page } from '@/payload-types'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Kawai Pianos | Digital, Upright, Hybrid, and Grands',
  description:
    'Browse the complete Kawai piano collection — Shigeru Kawai concert grands, GX BLAK grand pianos, Concert Artist digital pianos, and AnyTime hybrid instruments.',
  keywords: [
    'kawai piano',
    'kawai grand piano',
    'kawai digital piano',
    'kawai upright piano',
    'kawai hybrid piano',
    'shigeru kawai',
    'kawai ca series',
    'kawai gx series',
  ],
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/pianos` },
  openGraph: {
    title: 'Kawai Pianos — Complete Collection',
    description:
      'Browse the complete Kawai piano collection — Shigeru Kawai concert grands, GX BLAK grand pianos, Concert Artist digital pianos, and AnyTime hybrid instruments.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/pianos`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kawai Pianos — Complete Collection',
    description:
      'Browse the complete Kawai piano collection — Shigeru Kawai concert grands, GX BLAK grand pianos, Concert Artist digital pianos, and AnyTime hybrid instruments.',
  },
}

async function getCMSPianosPage(): Promise<Page | null> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: 'pianos' },
        _status: { equals: 'published' },
      },
      depth: 2,
      limit: 1,
    })
    const page = result.docs[0] ?? null
    if (page) {
      console.log('[PianosPage] CMS override found — blocks:', page.layout?.length ?? 0)
    }
    return page
  } catch (err) {
    console.error('[PianosPage] CMS override query failed:', err)
    return null
  }
}

export default async function PianosPage() {
  // Check for a CMS page with slug "pianos" — if published, it overrides the static layout
  const cmsPage = await getCMSPianosPage()
  if (cmsPage?.layout && cmsPage.layout.length > 0) {
    return <RenderBlocks blocks={cmsPage.layout} />
  }

  // Default static layout
  const [products, spotlightItems, collectionsForBrowser] = await Promise.all([
    getCatalogProductsDirect(),
    getProductSpotlightNewsItems(),
    getCollectionsForBrowser(),
  ])

  return (
    <>
      {spotlightItems.length > 0 && (
        <NewsCarousel data={{ autoPlayDuration: 7000, newsItems: spotlightItems }} />
      )}
      <PianosBrowser products={products} collectionsForBrowser={collectionsForBrowser} />
    </>
  )
}
