import { Footer } from './footer'
import { headers } from 'next/headers'
import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload/queries'
import {
  getSearchQuickLinks,
  getResourcesNavConfig,
  getActiveStorefrontsForNav,
} from './header-dynamic'

interface DealerLocationContactData {
  name: string
  address: string
  phone: string
  email?: string
  locationName?: string
  slug?: string
}

function getDealerLocationContactInfo(slug: string): Promise<DealerLocationContactData | null> {
  return unstable_cache(
    async () => {
      try {
        const payload = await getPayloadClient()
        const result = await payload.find({
          collection: 'storefronts',
          where: {
            and: [
              { slug: { equals: slug } },
              { isActive: { equals: true } },
            ],
          },
          limit: 1,
          select: {
            showroomInfo: true,
            locationName: true,
            slug: true,
          },
        })

        const location = result.docs[0]
        if (!location) return null

        const showroomInfo = location.showroomInfo
        return {
          name: showroomInfo?.name || '',
          address: showroomInfo?.address || '',
          phone: showroomInfo?.phone || '',
          email: showroomInfo?.email || '',
          locationName: location.locationName || '',
          slug: location.slug || '',
        }
      } catch (error) {
        console.error('Error fetching storefront location contact info:', error)
        return null
      }
    },
    [`footer-storefront-${slug}`],
    { tags: [`storefront-${slug}`, 'storefronts'], revalidate: 3600 }
  )()
}

export async function FooterDynamic() {
  try {
    // Cookies are intentionally NOT read here — reading cookies forces dynamic
    // rendering on every request, bypassing the Cloudflare edge cache.
    // Cookie-based dealer context (user navigated away from a storefront) is
    // handled client-side by NavigationContext via sessionStorage.
    const headersList = await headers()
    const pathname = headersList.get('x-pathname') || ''
    const site = headersList.get('x-site') === 'cad' ? 'cad' : 'us'

    const isSignaturePage =
      pathname.endsWith('/signature') || pathname.endsWith('/signature/') ||
      pathname.endsWith('/signature2') || pathname.endsWith('/signature2/') ||
      pathname.endsWith('/gl-10-signature') || pathname.endsWith('/gl-10-signature/')

    // Dealer slug from URL path only (no cookie fallback)
    const dealerSlug = pathname.startsWith('/store/') ? pathname.split('/')[2] : undefined

    // Fetch dealer contact + site index data in parallel. All four getters
    // are unstable_cache'd and shared with the header, so within a single
    // request these calls are deduped — no extra MongoDB roundtrips.
    const [locationContactData, promotedLinks, resourceLinks, storeLocations] =
      await Promise.all([
        dealerSlug ? getDealerLocationContactInfo(dealerSlug) : Promise.resolve(null),
        getSearchQuickLinks(),
        getResourcesNavConfig(),
        getActiveStorefrontsForNav(),
      ])

    return (
      <Footer
        locationContactData={locationContactData}
        isSignaturePage={isSignaturePage}
        promotedLinks={promotedLinks}
        resourceLinks={resourceLinks}
        storeLocations={storeLocations}
        site={site}
      />
    )
  } catch (error) {
    console.error('Error in FooterDynamic:', error)

    let fallbackPathname = ''
    try {
      fallbackPathname = (await headers()).get('x-pathname') || ''
    } catch { /* ignore */ }

    const isSignaturePage =
      fallbackPathname.endsWith('/signature') || fallbackPathname.endsWith('/signature/') ||
      fallbackPathname.endsWith('/signature2') || fallbackPathname.endsWith('/signature2/') ||
      fallbackPathname.endsWith('/gl-10-signature') || fallbackPathname.endsWith('/gl-10-signature/')

    return <Footer isSignaturePage={isSignaturePage} />
  }
}
