import type { MarketingPianosBrowserBlock } from '@/payload-types'
import { getCatalogProductsDirect, getProductSpotlightNewsItems, getCollectionsForBrowser } from '@/lib/payload/queries'
import { getSite } from '@/lib/site-context'
import { PianosBrowser } from '@/components/piano/PianosBrowser'
import { NewsCarousel } from '@/components/homepage/news-carousel'

export async function PianosBrowserRenderer(props: MarketingPianosBrowserBlock) {
  const showNewsCarousel = props.showNewsCarousel !== false

  const [products, spotlightItems, collectionsForBrowser, site] = await Promise.all([
    getCatalogProductsDirect(),
    showNewsCarousel ? getProductSpotlightNewsItems() : Promise.resolve([]),
    getCollectionsForBrowser(),
    getSite(),
  ])

  return (
    <>
      {showNewsCarousel && spotlightItems.length > 0 && (
        <NewsCarousel data={{ autoPlayDuration: 7000, newsItems: spotlightItems }} />
      )}
      <PianosBrowser products={products} collectionsForBrowser={collectionsForBrowser} pageHeading={props.pageHeading ?? undefined} site={site} />
    </>
  )
}
