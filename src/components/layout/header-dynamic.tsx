import { generatePianoCategoriesNavigationServer } from '@/lib/payload-server'
import { Header } from './header'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'

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
    // Generate piano categories navigation (each category becomes a top-level nav item)
    const pianoCategories = await generatePianoCategoriesNavigationServer()
    
    // Create the navigation structure with only piano categories as main nav items
    const dynamicNavigation: NavigationItem[] = pianoCategories.map(category => ({
      label: category.label,
      href: category.href,
      dropdown: category.dropdown?.map(item => ({
        label: item.label,
        href: item.href,
        description: item.description,
        isProductline: item.isProductline,
        isProduct: item.isProduct
      })) || []
    }))

    // Get current path to determine if we're on a dealer location page
    const headersList = await headers()
    const pathname = headersList.get('x-pathname') || ''
    
    // Check if we're on a dealer location page (format: /[slug] or /[slug]/contact)
    const pathSegments = pathname.split('/').filter(Boolean)
    let locationData: DealerLocationData | null = null
    
    if (pathSegments.length >= 1) {
      const potentialSlug = pathSegments[0]
      // Avoid checking common routes that are not dealer locations
      if (!['pianos', 'admin', 'api', 'sitemap.xml', 'robots.txt'].includes(potentialSlug)) {
        locationData = await getDealerLocationBySlug(potentialSlug)
      }
    }

    return (
      <Header 
        navigation={dynamicNavigation} 
        locationData={locationData}
      />
    )
  } catch (error) {
    console.error('Error in HeaderDynamic:', error)
    
    // Fallback to basic piano category navigation
    const fallbackNavigation: NavigationItem[] = [
      { label: 'Digital Pianos', href: '/pianos/digital', dropdown: [] },
      { label: 'Grand Pianos', href: '/pianos/grand', dropdown: [] },
      { label: 'Upright Pianos', href: '/pianos/upright', dropdown: [] },
      { label: 'Hybrid Pianos', href: '/pianos/hybrid', dropdown: [] },
    ]
    
    return <Header navigation={fallbackNavigation} />
  }
}