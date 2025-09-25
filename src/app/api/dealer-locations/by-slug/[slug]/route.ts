import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

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
    
    // Query the DealerLocations collection by slug
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
      depth: 2 // Populate media relationships and their nested relationships
    })
    
    const dealerLocation = result.docs[0]

    if (dealerLocation) {
      
      // Transform the dealer location data to match HomePageData structure
      const transformedData = {
        heroSection: {
          locationText: dealerLocation.locationText,
          establishedText: dealerLocation.establishedText,
          titlePrefix: dealerLocation.titlePrefix,
          titleMain: dealerLocation.titleMain,
          titleSuffix: dealerLocation.titleSuffix,
          description: dealerLocation.description,
          primaryCta: dealerLocation.primaryCta,
          secondaryCta: dealerLocation.secondaryCta,
          backgroundVideo: dealerLocation.backgroundVideo
        },
        showroomSection: {
          sectionHeader: dealerLocation.sectionHeader,
          showroomTitle: dealerLocation.showroomTitle,
          showroomDescription: dealerLocation.showroomDescription,
          showroomInfo: dealerLocation.showroomInfo,
          hours: dealerLocation.hours,
          features: dealerLocation.features,
          mapApiKey: dealerLocation.mapApiKey,
          showroomCtas: dealerLocation.showroomCtas
        },
        pianoCollectionSection: {
          collectionSectionHeader: dealerLocation.collectionSectionHeader,
          collectionTitle: dealerLocation.collectionTitle,
          collectionDescription: dealerLocation.collectionDescription,
          collectionCta: dealerLocation.collectionCta,
          featuredVideo: dealerLocation.featuredVideo
        },
        newsCarouselSection: {
          autoPlayDuration: dealerLocation.autoPlayDuration,
          newsItems: dealerLocation.newsItems
        },
        contactFormSection: {
          contactTitle: dealerLocation.contactTitle,
          contactTitleHighlight: dealerLocation.contactTitleHighlight,
          contactDescription: dealerLocation.contactDescription,
          stepTitles: dealerLocation.stepTitles,
          trustMessage: dealerLocation.trustMessage,
          benefits: dealerLocation.benefits,
          formOptions: dealerLocation.formOptions
        },
        seo: dealerLocation.seo
      }
      
      return NextResponse.json({
        success: true,
        data: transformedData
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Dealer location not found or inactive' }, 
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error fetching dealer location data:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch dealer location data',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}