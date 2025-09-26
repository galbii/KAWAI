import { Footer } from './footer'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { parseNavigationOrigin } from '@/lib/navigation-utils'

interface DealerLocationContactData {
  name: string
  address: string
  phone: string
  email?: string
  locationName?: string
  slug?: string
}

async function getDealerLocationContactInfo(slug: string): Promise<DealerLocationContactData | null> {
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
        showroomInfo: true,
        locationName: true,
        slug: true
      }
    })

    const location = result.docs[0]

    if (location) {
      const showroomInfo = location.showroomInfo

      return {
        name: showroomInfo?.name || '',
        address: showroomInfo?.address || '',
        phone: showroomInfo?.phone || '',
        // Generate location-specific email if needed
        email: `info@kawaipianos${slug.replace(/-/g, '')}.com`,
        locationName: location.locationName || '',
        slug: location.slug || ''
      }
    }

    return null
  } catch (error) {
    console.error('Error fetching dealer location contact info:', error)
    return null
  }
}

export async function FooterDynamic() {
  try {
    // Get current path and determine navigation origin
    const headersList = await headers()
    const pathname = headersList.get('x-pathname') || ''
    const origin = parseNavigationOrigin(pathname)

    // Check if we're on a signature page
    const isSignaturePage = pathname.endsWith('/signature') || pathname.endsWith('/signature/')

    // Check if we're on a dealer location page and fetch location contact data
    let locationContactData: DealerLocationContactData | null = null

    console.log('FooterDynamic - pathname:', pathname)
    console.log('FooterDynamic - origin:', origin)
    console.log('FooterDynamic - isSignaturePage:', isSignaturePage)

    if (origin.isDealerLocation && origin.dealerSlug) {
      console.log('FooterDynamic - fetching data for slug:', origin.dealerSlug)
      locationContactData = await getDealerLocationContactInfo(origin.dealerSlug)
      console.log('FooterDynamic - fetched locationContactData:', locationContactData)
    }

    return (
      <Footer
        locationContactData={locationContactData}
        isSignaturePage={isSignaturePage}
      />
    )
  } catch (error) {
    console.error('Error in FooterDynamic:', error)

    // Fallback to basic footer with signature page detection
    const headersList = await headers()
    const pathname = headersList.get('x-pathname') || ''
    const isSignaturePage = pathname.endsWith('/signature') || pathname.endsWith('/signature/')

    return <Footer isSignaturePage={isSignaturePage} />
  }
}