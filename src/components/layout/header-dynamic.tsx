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
      collection: 'dealer-locations',
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
    
    if (result.docs.length > 0) {
      return {
        locationName: result.docs[0].locationName,
        slug: result.docs[0].slug
      }
    }
    
    return null
  } catch (error) {
    console.error('Error fetching dealer location:', error)
    return null
  }
}

export async function HeaderDynamic() {
  try {
    // Get current path and determine navigation origin
    const headersList = await headers()
    const pathname = headersList.get('x-pathname') || ''
    const origin = parseNavigationOrigin(pathname)

    // Check if we're on a signature page
    const isSignaturePage = pathname.endsWith('/signature')

    // Generate piano categories navigation (each category becomes a top-level nav item)
    const pianoCategories = await generatePianoCategoriesNavigationServer()

    // Create context-aware navigation structure
    const dynamicNavigation: NavigationItem[] = pianoCategories.map(category => ({
      label: category.label,
      href: getContextAwareUrl(category.href, origin),
      dropdown: category.dropdown?.map(item => ({
        label: item.label,
        href: getContextAwareUrl(item.href, origin),
        description: item.description,
        isProductline: item.isProductline,
        isProduct: item.isProduct
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
      />
    )
  } catch (error) {
    console.error('Error in HeaderDynamic:', error)

    // Fallback to basic piano category navigation with context awareness
    const headersList = await headers()
    const pathname = headersList.get('x-pathname') || ''
    const fallbackOrigin = parseNavigationOrigin(pathname)
    const isSignaturePage = pathname.endsWith('/signature')

    const fallbackNavigation: NavigationItem[] = [
      { label: 'Digital Pianos', href: getContextAwareUrl('/pianos/digital', fallbackOrigin), dropdown: [] },
      { label: 'Grand Pianos', href: getContextAwareUrl('/pianos/grand', fallbackOrigin), dropdown: [] },
      { label: 'Upright Pianos', href: getContextAwareUrl('/pianos/upright', fallbackOrigin), dropdown: [] },
      { label: 'Hybrid Pianos', href: getContextAwareUrl('/pianos/hybrid', fallbackOrigin), dropdown: [] },
    ]

    return <Header navigation={fallbackNavigation} isSignaturePage={isSignaturePage} />
  }
}