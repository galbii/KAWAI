import { generatePianoCategoriesNavigationServer } from '@/lib/payload-server'
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
    isProductline?: boolean
    isProduct?: boolean
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

    // Check if we're on a signature page (signature, signature2, or gl-10-signature) or Arlington page
    const isSignaturePage = pathname.endsWith('/signature') || pathname.endsWith('/signature/') ||
                            pathname.endsWith('/signature2') || pathname.endsWith('/signature2/') ||
                            pathname.endsWith('/gl-10-signature') || pathname.endsWith('/gl-10-signature/') ||
                            pathname.endsWith('/arlington') || pathname.endsWith('/arlington/') ||
                            pathname.endsWith('/arlington') || pathname.endsWith('/arlington/')

    // Check if we're on the concert-artist page
    const isConcertArtistPage = pathname === '/concert-artist' || pathname === '/concert-artist/'

    // Check if we're on a university event page
    const isUniversityPage = pathname.includes('/university')

    // Generate piano categories navigation (each category becomes a top-level nav item)
    const pianoCategories = await generatePianoCategoriesNavigationServer()

    // Create context-aware navigation structure
    const dynamicNavigation: NavigationItem[] = pianoCategories.map(category => ({
      label: category.label,
      href: getContextAwareUrl(category.href, origin),
      dropdown: category.dropdown?.map(item => ({
        label: item.label,
        href: getContextAwareUrl(item.href, origin),
        ...(item.description && { description: item.description }),
        ...(item.isProductline !== undefined && { isProductline: item.isProductline }),
        ...(item.isProduct !== undefined && { isProduct: item.isProduct })
      })) || []
    }))

    // Check if we're on a dealer location page and fetch location data
    let locationData: DealerLocationData | null = null

    if (origin.isDealerLocation && origin.dealerSlug) {
      locationData = await getDealerLocationBySlug(origin.dealerSlug)
    }

    return (
      <Header
        navigation={dynamicNavigation}
        locationData={locationData}
        isSignaturePage={isSignaturePage}
        hidePianoLinks={isConcertArtistPage}
        isUniversityPage={isUniversityPage}
      />
    )
  } catch (error) {
    console.error('Error in HeaderDynamic:', error)

    // Fallback to basic piano category navigation with context awareness
    const headersList = await headers()
    const pathname = headersList.get('x-pathname') || ''
    const fallbackOrigin = parseNavigationOrigin(pathname)
    const isSignaturePage = pathname.endsWith('/signature') || pathname.endsWith('/signature/') ||
                            pathname.endsWith('/signature2') || pathname.endsWith('/signature2/') ||
                            pathname.endsWith('/gl-10-signature') || pathname.endsWith('/gl-10-signature/') ||
                            pathname.endsWith('/arlington') || pathname.endsWith('/arlington/')
    const isConcertArtistPage = pathname === '/concert-artist' || pathname === '/concert-artist/'
    const isUniversityPage = pathname.includes('/university')

    const fallbackNavigation: NavigationItem[] = [
      { label: 'Digital Pianos', href: getContextAwareUrl('/pianos/digital', fallbackOrigin), dropdown: [] },
      { label: 'Grand Pianos', href: getContextAwareUrl('/pianos/grand', fallbackOrigin), dropdown: [] },
      { label: 'Upright Pianos', href: getContextAwareUrl('/pianos/upright', fallbackOrigin), dropdown: [] },
      { label: 'Hybrid Pianos', href: getContextAwareUrl('/pianos/hybrid', fallbackOrigin), dropdown: [] },
    ]

    return <Header navigation={fallbackNavigation} isSignaturePage={isSignaturePage} hidePianoLinks={isConcertArtistPage} isUniversityPage={isUniversityPage} />
  }
}