import { Header } from './header'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { parseNavigationOrigin, getContextAwareUrl, type NavigationOrigin } from '@/lib/navigation-utils'

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

async function getDealerLocationBySlug(slug: string): Promise<DealerLocationData | null> {
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
}

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

    return (
      <Header
        navigation={staticNavigation}
        locationData={locationData}
        isSignaturePage={isSignaturePage}
        hidePianoLinks={isConcertArtistPage}
        isUniversityPage={isUniversityPage}
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

    return <Header navigation={fallbackNavigation} isSignaturePage={isSignaturePage} hidePianoLinks={isConcertArtistPage} isUniversityPage={isUniversityPage} />
  }
}