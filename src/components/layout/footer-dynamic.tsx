import { Footer } from './footer'
import { headers, cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'

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
      email: `info@kawaipianos${slug.replace(/-/g, '')}.com`,
      locationName: location.locationName || '',
      slug: location.slug || '',
    }
  } catch (error) {
    console.error('Error fetching storefront location contact info:', error)
    return null
  }
}

export async function FooterDynamic() {
  try {
    const [headersList, cookieStore] = await Promise.all([headers(), cookies()])
    const pathname = headersList.get('x-pathname') || ''

    const isSignaturePage =
      pathname.endsWith('/signature') || pathname.endsWith('/signature/') ||
      pathname.endsWith('/signature2') || pathname.endsWith('/signature2/') ||
      pathname.endsWith('/gl-10-signature') || pathname.endsWith('/gl-10-signature/')

    // Resolve dealer slug from pathname first, then cookie fallback
    const pathDealerSlug = pathname.startsWith('/store/') ? pathname.split('/')[2] : undefined
    const cookieDealerSlug = cookieStore.get('kawai-dealer-slug')?.value
    const dealerSlug = pathDealerSlug ?? cookieDealerSlug

    let locationContactData: DealerLocationContactData | null = null
    if (dealerSlug) {
      locationContactData = await getDealerLocationContactInfo(dealerSlug)
    }

    return (
      <Footer
        locationContactData={locationContactData}
        isSignaturePage={isSignaturePage}
      />
    )
  } catch (error) {
    console.error('Error in FooterDynamic:', error)

    const headersList = await headers()
    const pathname = headersList.get('x-pathname') || ''
    const isSignaturePage =
      pathname.endsWith('/signature') || pathname.endsWith('/signature/') ||
      pathname.endsWith('/signature2') || pathname.endsWith('/signature2/') ||
      pathname.endsWith('/gl-10-signature') || pathname.endsWith('/gl-10-signature/')

    return <Footer isSignaturePage={isSignaturePage} />
  }
}
