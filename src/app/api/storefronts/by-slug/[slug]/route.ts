import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const revalidate = 3600

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug parameter is required' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    // Query the Storefronts collection by slug
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
      depth: 2 // Populate media relationships and their nested relationships
    })

    const storefront = result.docs[0]

    if (storefront) {

      // Transform the storefront data to match HomePageData structure
      // Note: Piano collection data is now sourced from HomePage collection
      const transformedData = {
        heroSection: {
          locationText: storefront.locationText,
          establishedText: storefront.establishedText,
          description: storefront.description,
          primaryCta: storefront.primaryCta,
          secondaryCta: storefront.secondaryCta,
          backgroundVideo: storefront.backgroundVideo
        },
        showroomSection: {
          sectionHeader: storefront.sectionHeader,
          showroomTitle: storefront.showroomTitle,
          showroomDescription: storefront.showroomDescription,
          showroomInfo: storefront.showroomInfo,
          hours: storefront.hours,
          features: storefront.features,
          mapApiKey: storefront.mapApiKey,
          showroomCtas: storefront.showroomCtas
        },
        newsCarouselSection: {
          autoPlayDuration: storefront.autoPlayDuration,
          newsItems: storefront.newsItems
        },
        contactFormSection: {
          contactTitle: storefront.contactTitle,
          contactTitleHighlight: storefront.contactTitleHighlight,
          contactDescription: storefront.contactDescription,
          stepTitles: storefront.stepTitles,
          trustMessage: storefront.trustMessage,
          benefits: storefront.benefits,
          formOptions: storefront.formOptions
        },
        seo: storefront.seo
      }

      return NextResponse.json({
        success: true,
        data: transformedData
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Storefront not found or inactive' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error fetching storefront data:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch storefront data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}