import { Header } from './header'
import { headers, cookies } from 'next/headers'
import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload/queries'
import type { Media } from '@/payload-types'
import type { LatestPost } from './header'

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
  hasMusicSchool: boolean
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

export interface ResourceLink {
  title: string
  description?: string
  href: string
  icon?: string
  openInNewTab?: boolean
  enabled?: boolean
}

function getDealerLocationBySlug(slug: string): Promise<DealerLocationData | null> {
  return unstable_cache(
    async () => {
      try {
        const payload = await getPayloadClient()

        const storefrontResult = await payload.find({
          collection: 'storefronts',
          where: {
            and: [
              { slug: { equals: slug } },
              { isActive: { equals: true } },
            ],
          },
          limit: 1,
          depth: 0,
        })

        const location = storefrontResult.docs[0]
        if (!location) return null

        // Check if a music school is linked to this storefront
        const musicSchoolResult = await payload.find({
          collection: 'music-schools',
          where: {
            storefront: { equals: location.id },
            isActive: { equals: true },
          },
          depth: 0,
          limit: 1,
        })

        return {
          locationName: location.locationName,
          slug: location.slug,
          hasMusicSchool: musicSchoolResult.docs.length > 0,
        }
      } catch (error) {
        console.error('Error fetching storefront location:', error)
        return null
      }
    },
    [`header-storefront-${slug}`],
    { tags: [`storefront-${slug}`, 'storefronts', 'music-schools'], revalidate: 3600 }
  )()
}

export const getRegisterConfig = unstable_cache(
  async (): Promise<RegisterConfig> => {
    try {
      const payload = await getPayloadClient()
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
      const payload = await getPayloadClient()
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

const DEFAULT_RESOURCE_LINKS: ResourceLink[] = [
  {
    title: 'Support Center',
    description: 'Troubleshooting, connectivity, firmware, warranty, and piano care — for owners, buyers, and technicians.',
    href: '/technical-support-division',
    icon: 'headphones',
    openInNewTab: false,
    enabled: true,
  },
  {
    title: 'Warranty',
    description: "View Kawai's warranty coverage, terms, and claim information for your piano.",
    href: 'https://kawaius.com/warranty',
    icon: 'shield',
    openInNewTab: true,
    enabled: true,
  },
  {
    title: 'Careers',
    description: "Join the Kawai team and help bring the world's finest pianos to musicians everywhere.",
    href: '/careers',
    icon: 'briefcase',
    openInNewTab: false,
    enabled: true,
  },
]

const getResourcesNavConfig = unstable_cache(
  async (): Promise<ResourceLink[]> => {
    try {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'home-page',
        limit: 1,
        depth: 0,
        select: { resourcesNav: true } as any,
      })
      const links = (result.docs[0] as any)?.resourcesNav?.links
      if (Array.isArray(links) && links.length > 0) {
        return links.map((l: any) => ({
          title: l.title,
          description: l.description ?? undefined,
          href: l.href,
          icon: l.icon ?? undefined,
          openInNewTab: l.openInNewTab ?? false,
          enabled: l.enabled ?? true,
        }))
      }
      return DEFAULT_RESOURCE_LINKS
    } catch (err) {
      console.error('[getResourcesNavConfig]', err)
      return DEFAULT_RESOURCE_LINKS
    }
  },
  ['header-resources-nav'],
  { tags: ['home-page'], revalidate: 3600 }
)

const getHomePageNewsItems = unstable_cache(
  async (): Promise<NewsItem[]> => {
    try {
      const payload = await getPayloadClient()

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
          ...(item.videoUrl && { videoUrl: item.videoUrl }),
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

const getHeaderSettings = unstable_cache(
  async (): Promise<{ autoMinimize: boolean }> => {
    try {
      const payload = await getPayloadClient()
      const settings = await payload.findGlobal({ slug: 'header-settings' })
      return { autoMinimize: settings.autoMinimize ?? true }
    } catch (err) {
      console.error('[getHeaderSettings]', err)
      return { autoMinimize: true }
    }
  },
  ['header-settings'],
  { tags: ['header-settings'], revalidate: 3600 }
)

const getLatestPosts = unstable_cache(
  async (): Promise<LatestPost[]> => {
    try {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'posts',
        where: { status: { equals: 'published' } },
        sort: '-publishedDate',
        limit: 4,
        depth: 1,
        select: {
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          heroVideoUrl: true,
          categories: true,
        },
      })
      return result.docs.map((post: any) => {
        // Extract image URL
        let featuredImage: string | null = null
        if (post.featuredImage) {
          if (typeof post.featuredImage === 'object' && post.featuredImage.url) {
            featuredImage = post.featuredImage.url
          } else if (typeof post.featuredImage === 'object' && post.featuredImage.filename) {
            const s3Base = (process.env.NEXT_PUBLIC_S3_PUBLIC_URL ?? '').replace(/\/$/, '')
            featuredImage = `${s3Base}/media/${post.featuredImage.filename}`
          }
        }
        // Extract first category title
        const firstCategory = post.categories?.[0]
        const category =
          typeof firstCategory === 'object' && firstCategory !== null
            ? (firstCategory as any).title ?? null
            : null
        return {
          id: String(post.id),
          title: post.title,
          slug: post.slug ?? '',
          excerpt: post.excerpt ?? null,
          featuredImage,
          heroVideoUrl: post.heroVideoUrl ?? null,
          category,
        }
      })
    } catch (err) {
      console.error('[getLatestPosts]', err)
      return []
    }
  },
  ['header-latest-posts'],
  { tags: ['posts'], revalidate: 300 }
)

export async function HeaderDynamic() {
  try {
    // Get current path, site context, and dealer context from cookie
    const [headersList, cookieStore] = await Promise.all([headers(), cookies()])
    const pathname = headersList.get('x-pathname') || ''
    const site = headersList.get('x-site') ?? 'us'

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

    // Resolve dealer slug: pathname takes priority (user is on the storefront right now),
    // cookie is the fallback (user navigated here from a storefront).
    const pathDealerSlug = pathname.startsWith('/store/') ? pathname.split('/')[2] : undefined
    const cookieDealerSlug = cookieStore.get('kawai-dealer-slug')?.value
    const dealerSlug = pathDealerSlug ?? cookieDealerSlug

    const staticNavigation: NavigationItem[] = []

    // Fetch dealer location data server-side on every page where cookie is present.
    // This eliminates the client-side flash of un-branded → dealer header.
    let locationData: DealerLocationData | null = null

    if (site === 'cad') {
      // Canadian site — show "Canada Music" branding in the logo, no storefront-specific nav
      locationData = { locationName: 'Canada Music', slug: '', hasMusicSchool: false }
    } else if (dealerSlug) {
      locationData = await getDealerLocationBySlug(dealerSlug)
    }

    // Fetch news items, register config, quick links, resource links, latest posts, and header settings
    const [newsItems, registerConfig, quickLinks, resourceLinks, latestPosts, headerSettings] = await Promise.all([
      getHomePageNewsItems(),
      getRegisterConfig(),
      getSearchQuickLinks(),
      getResourcesNavConfig(),
      getLatestPosts(),
      getHeaderSettings(),
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
        latestPosts={latestPosts}
        registerConfig={registerConfig}
        quickLinks={quickLinks}
        resourceLinks={resourceLinks}
        autoMinimize={headerSettings.autoMinimize}
      />
    )
  } catch (error) {
    console.error('Error in HeaderDynamic:', error)

    // Fallback to basic static navigation
    const headersList = await headers()
    const pathname = headersList.get('x-pathname') || ''
    const isSignaturePage = pathname.endsWith('/signature') || pathname.endsWith('/signature/') ||
                            pathname.endsWith('/signature2') || pathname.endsWith('/signature2/') ||
                            pathname.endsWith('/gl-10-signature') || pathname.endsWith('/gl-10-signature/')
    const isConcertArtistPage = pathname === '/concert-artist' || pathname === '/concert-artist/'
    const isUniversityPage = pathname.includes('/university')
    const isFindADealerPage = pathname.startsWith('/find-a-dealer')

    return <Header navigation={[]} isSignaturePage={isSignaturePage} hidePianoLinks={isConcertArtistPage} isUniversityPage={isUniversityPage} isFindADealerPage={isFindADealerPage} newsItems={[]} />
  }
}