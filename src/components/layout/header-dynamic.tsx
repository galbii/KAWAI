import { Header } from './header'
import { headers } from 'next/headers'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { parseNavigationOrigin, getContextAwareUrl, type NavigationOrigin } from '@/lib/navigation-utils'
import type { Media } from '@/payload-types'

interface NavigationItem {
  label: string
  href?: string
  dropdown?: {
    label: string
    href: string
    description?: string
  }[]
}

interface DealerLocationData {
  locationName: string
  slug: string
}

interface NewsItem {
  title: string
  description: string
  image?: Media | string | null
  category: string
  link?: string
}

interface RegisterConfig {
  enabled?: boolean
  bannerImageUrl?: string | null
  bannerTitle?: string | null
  bannerDescription?: string | null
  hubspotEmbedUrl?: string | null
  hubspotFormId?: string | null
  hubspotPortalId?: string | null
  hubspotRegion?: string | null
}

interface QuickLink {
  label: string
  url: string
}

function getDealerLocationBySlug(slug: string): Promise<DealerLocationData | null> {
  return unstable_cache(
    async () => {
      try {
        const payload = await getPayload({ config })

        const result = await payload.find({
          collection: 'storefronts',
          where: {
            and: [
              {
                slug: {
                  equals: slug
                }
              },
              {
                isActive: {
                  equals: true
                }
              }
            ]
          },
          limit: 1,
          select: {
            locationName: true,
            slug: true
          }
        })

        const location = result.docs[0]

        if (location) {
          return {
            locationName: location.locationName,
            slug: location.slug
          }
        }

        return null
      } catch (error) {
        console.error('Error fetching storefront location:', error)
        return null
      }
    },
    [`header-storefront-${slug}`],
    { tags: [`storefront-${slug}`, 'storefronts'], revalidate: 3600 }
  )()
}

export const getRegisterConfig = unstable_cache(
  async (): Promise<RegisterConfig> => {
    try {
      const payload = await getPayload({ config })
      // No `select` — depth population doesn't reliably resolve relationships
      // inside group fields when select is active. Fetching the full doc is safe
      // since this is a singleton (1 document).
      const result = await payload.find({
        collection: 'home-page',
        limit: 1,
        depth: 2,
      })
      const data = result.docs[0] as any
      const reg = data?.registerMyPiano
      if (!reg) return {}

      // bannerImage is a populated Media object at depth 2.
      // generateFileURL may not fire on nested populations in the Local API,
      // so we fall back to constructing the CDN URL from `filename` directly.
      const image = reg.bannerImage
      let bannerImageUrl: string | null = null
      if (image && typeof image === 'object') {
        const img = image as any
        const s3Base = (process.env.NEXT_PUBLIC_S3_PUBLIC_URL ?? '').replace(/\/$/, '')
        bannerImageUrl =
          img.url ??
          (img.filename ? `${s3Base}/media/${img.filename}` : null)
      }

      // Parse the pasted HubSpot embed snippet to extract individual values
      const embedCode: string = reg.hubspotEmbedCode ?? ''
      const scriptSrcMatch = embedCode.match(/src="([^"]+)"/)
      const formIdMatch = embedCode.match(/data-form-id="([^"]+)"/)
      const portalIdMatch = embedCode.match(/data-portal-id="([^"]+)"/)
      const regionMatch = embedCode.match(/data-region="([^"]+)"/)

      return {
        enabled: reg.enabled ?? true,
        bannerImageUrl,
        bannerTitle: reg.bannerTitle ?? null,
        bannerDescription: reg.bannerDescription ?? null,
        hubspotEmbedUrl: scriptSrcMatch?.[1] ?? null,
        hubspotFormId: formIdMatch?.[1] ?? null,
        hubspotPortalId: portalIdMatch?.[1] ?? null,
        hubspotRegion: regionMatch?.[1] ?? null,
      }
    } catch (err) {
      console.error('[getRegisterConfig]', err)
      return {}
    }
  },
  ['header-register-config'],
  { tags: ['home-page'], revalidate: 3600 }
)

const DEFAULT_QUICK_LINKS: QuickLink[] = [
  { label: 'Instrumental to Life', url: '/instrumental-to-life' },
  { label: 'Find a Dealer', url: '/find-a-dealer' },
  { label: 'Register My Piano', url: '/warranty-registration' },
  { label: 'Kawai Exclusive Offers', url: '/explore' },
]

const getSearchQuickLinks = unstable_cache(
  async (): Promise<QuickLink[]> => {
    try {
      const payload = await getPayload({ config })
      const result = await payload.find({
        collection: 'home-page',
        limit: 1,
        depth: 0,
        select: { searchQuickLinks: true },
      })
      const links = (result.docs[0] as any)?.searchQuickLinks
      if (Array.isArray(links) && links.length > 0) {
        return links.map((l: any) => ({ label: l.label, url: l.url }))
      }
      return DEFAULT_QUICK_LINKS
    } catch (err) {
      console.error('[getSearchQuickLinks]', err)
      return DEFAULT_QUICK_LINKS
    }
  },
  ['header-quick-links'],
  { tags: ['home-page'], revalidate: 3600 }
)

const getHomePageNewsItems = unstable_cache(
  async (): Promise<NewsItem[]> => {
    try {
      const payload = await getPayload({ config })

      const result = await payload.find({
        collection: 'home-page',
        limit: 1,
        depth: 1, // Populate media relationships
        select: {
          newsItems: true,
        },
      })

      const homePageData = result.docs[0]

      if (homePageData?.newsItems && Array.isArray(homePageData.newsItems)) {
        return homePageData.newsItems.map((item: any) => ({
          title: item.title,
          description: item.description,
          image: item.image ?? null,
          category: item.category,
          ...(item.link && { link: item.link }),
        }))
      }

      return []
    } catch (error) {
      console.error('Error fetching HomePage news items:', error)
      return []
    }
  },
  ['header-news-items'],
  { tags: ['home-page'], revalidate: 300 }
)

export async function HeaderDynamic() {
  try {
    // Get current path and determine navigation origin
    const headersList = await headers()
    const pathname = headersList.get('x-pathname') || ''
    const origin = parseNavigationOrigin(pathname)

    // Check if we're on a signature page (signature, signature2, or gl-10-signature)
    const isSignaturePage = pathname.endsWith('/signature') || pathname.endsWith('/signature/') ||
                            pathname.endsWith('/signature2') || pathname.endsWith('/signature2/') ||
                            pathname.endsWith('/gl-10-signature') || pathname.endsWith('/gl-10-signature/')

    // Check if we're on the concert-artist page
    const isConcertArtistPage = pathname === '/concert-artist' || pathname === '/concert-artist/'

    // Check if we're on a university event page
    const isUniversityPage = pathname.includes('/university')

    // Check if we're on the find-a-dealer page (hide search on this page)
    const isFindADealerPage = pathname.startsWith('/find-a-dealer')

    // Check if we're on the homepage or a storefront page (hide logo on these pages)
    const isHomepage = pathname === '/' || pathname === ''
    const isStorefrontPage = pathname.includes('/store/')
    const shouldHideLogo = isHomepage || isStorefrontPage

    // Static navigation items (non-piano categories)
    // Note: Piano navigation is now handled by ProductsMegaMenu (Shopify integration),
    // StorefrontsMegaMenu, NewsMegaMenu, and ResourcesMegaMenu - these are rendered separately in header.tsx
    // Artists appears after the mega menus in the header
    const staticNavigation: NavigationItem[] = [
      // News has been moved to NewsMegaMenu - see header.tsx
      // Artists positioned after mega menus - see header.tsx
      {
        label: 'Artists',
        href: getContextAwareUrl('/artists', origin)
      },
      // Resources has been moved to ResourcesMegaMenu - see header.tsx
    ]

    // Check if we're on a dealer location page and fetch location data
    let locationData: DealerLocationData | null = null

    if (origin.isDealerLocation && origin.dealerSlug) {
      locationData = await getDealerLocationBySlug(origin.dealerSlug)
    }

    // Fetch news items, register config, and quick links from HomePage collection
    const [newsItems, registerConfig, quickLinks] = await Promise.all([
      getHomePageNewsItems(),
      getRegisterConfig(),
      getSearchQuickLinks(),
    ])

    return (
      <Header
        navigation={staticNavigation}
        locationData={locationData}
        isSignaturePage={isSignaturePage}
        hidePianoLinks={isConcertArtistPage}
        isUniversityPage={isUniversityPage}
        isFindADealerPage={isFindADealerPage}
        newsItems={newsItems}
        registerConfig={registerConfig}
        quickLinks={quickLinks}
      />
    )
  } catch (error) {
    console.error('Error in HeaderDynamic:', error)

    // Fallback to basic static navigation (non-piano items only)
    const headersList = await headers()
    const pathname = headersList.get('x-pathname') || ''
    const fallbackOrigin = parseNavigationOrigin(pathname)
    const isSignaturePage = pathname.endsWith('/signature') || pathname.endsWith('/signature/') ||
                            pathname.endsWith('/signature2') || pathname.endsWith('/signature2/') ||
                            pathname.endsWith('/gl-10-signature') || pathname.endsWith('/gl-10-signature/')
    const isConcertArtistPage = pathname === '/concert-artist' || pathname === '/concert-artist/'
    const isUniversityPage = pathname.includes('/university')
    const isFindADealerPage = pathname.startsWith('/find-a-dealer')

    // Minimal fallback navigation (piano navigation handled by ProductsMegaMenu)
    // News moved to NewsMegaMenu - see header.tsx
    // Resources moved to ResourcesMegaMenu - see header.tsx
    const fallbackNavigation: NavigationItem[] = [
      // News has been moved to NewsMegaMenu - see header.tsx
      // Artists positioned after mega menus - see header.tsx
      {
        label: 'Artists',
        href: getContextAwareUrl('/artists', fallbackOrigin)
      },
      // Resources has been moved to ResourcesMegaMenu - see header.tsx
    ]

    return <Header navigation={fallbackNavigation} isSignaturePage={isSignaturePage} hidePianoLinks={isConcertArtistPage} isUniversityPage={isUniversityPage} isFindADealerPage={isFindADealerPage} newsItems={[]} />
  }
}