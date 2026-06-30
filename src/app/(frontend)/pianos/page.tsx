import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import {
  getCatalogProductsDirect,
  getProductSpotlightNewsItems,
  getCollectionsForBrowser,
  getPayloadClient,
} from '@/lib/payload/queries'
import { getSite, localeFromSite } from '@/lib/site-context'
import { getCMSPageMetadata } from '@/lib/seo/cms-page-metadata'
import { PianosBrowser } from '@/components/piano/PianosBrowser'
import { NewsCarousel } from '@/components/homepage/news-carousel'
import { RenderBlocks } from '@/components/RenderBlocks'
import { AdminBarDoc } from '@/components/layout/AdminBarDoc'
import type { Page } from '@/payload-types'

export const revalidate = 3600

const fallbackMetadata: Metadata = {
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

export async function generateMetadata(): Promise<Metadata> {
  return getCMSPageMetadata('pianos', fallbackMetadata, localeFromSite(await getSite()))
}

type PianosPageCMSData = { heading: string | null; id: string | null }

const getPianosPageCMSData = unstable_cache(
  async (): Promise<PianosPageCMSData> => {
    try {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'pianos-page',
        limit: 1,
        depth: 0,
      })
      const doc = result.docs[0]
      return { heading: doc?.heroTitle ?? null, id: doc?.id ? String(doc.id) : null }
    } catch {
      return { heading: null, id: null }
    }
  },
  ['pianos-page-heading'],
  { tags: ['pianos-page'], revalidate: 3600 },
)

const getCMSPianosPage = unstable_cache(
  async (): Promise<Page | null> => {
    try {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'pages',
        where: {
          slug: { equals: 'pianos' },
          _status: { equals: 'published' },
        },
        depth: 1,
        limit: 1,
      })
      return result.docs[0] ?? null
    } catch (err) {
      console.error('[PianosPage] CMS override query failed:', err)
      return null
    }
  },
  ['cms-pianos-page'],
  { tags: ['pages'], revalidate: 3600 },
)

export default async function PianosPage() {
  // Check for a CMS page with slug "pianos" — if published, it overrides the static layout
  const cmsPage = await getCMSPianosPage()
  if (cmsPage?.layout && cmsPage.layout.length > 0) {
    return (
      <>
        <AdminBarDoc
          collection="pages"
          id={String(cmsPage.id)}
          collectionLabels={{ singular: 'Page', plural: 'Pages' }}
        />
        {/* Guarantee a single page-level h1 — the CMS blocks below carry the visual
            title in a banner/hero that isn't promoted to h1, so expose it for AT here. */}
        <h1 className="sr-only">{cmsPage.title ?? 'Kawai Pianos'}</h1>
        <RenderBlocks blocks={cmsPage.layout} />
      </>
    )
  }

  // Default static layout
  const [products, spotlightItems, collectionsForBrowser, pianosPageData, site] = await Promise.all([
    getCatalogProductsDirect(),
    getProductSpotlightNewsItems(),
    getCollectionsForBrowser(),
    getPianosPageCMSData(),
    getSite(),
  ])

  return (
    <>
      {pianosPageData.id && (
        <AdminBarDoc
          collection="pianos-page"
          id={pianosPageData.id}
          collectionLabels={{ singular: 'Pianos Page', plural: 'Pianos Pages' }}
        />
      )}
      {spotlightItems.length > 0 && (
        <NewsCarousel data={{ autoPlayDuration: 7000, newsItems: spotlightItems }} />
      )}
      {/* SEO H1 — server-rendered, technically visible (has color + size), not hidden */}
      {pianosPageData.heading && (
        <div className="bg-white px-6 pt-6 pb-1">
          <h1
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontWeight: 700,
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: 'rgba(30, 27, 22, 0.12)',
            }}
          >
            {pianosPageData.heading}
          </h1>
        </div>
      )}
      <PianosBrowser
        products={products}
        collectionsForBrowser={collectionsForBrowser}
        pageHeading={pianosPageData.heading ?? undefined}
        site={site}
      />
    </>
  )
}
