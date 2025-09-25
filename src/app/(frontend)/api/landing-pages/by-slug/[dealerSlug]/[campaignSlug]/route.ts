import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dealerSlug: string; campaignSlug: string }> }
) {
  try {
    const { dealerSlug, campaignSlug } = await params
    const payload = await getPayload({ config })
    
    console.log('[DEBUG] Landing page API route called:', { dealerSlug, campaignSlug })
    
    // First, find the dealer location to get its ID
    const dealerResult = await payload.find({
      collection: 'dealer-locations',
      where: {
        and: [
          {
            slug: {
              equals: dealerSlug
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
      depth: 0 // We only need the ID
    })
    
    const dealer = dealerResult.docs[0]

    if (!dealer) {
      console.log('[DEBUG] Dealer location not found or inactive:', dealerSlug)
      return NextResponse.json(
        { success: false, error: 'Dealer location not found or inactive' },
        { status: 404 }
      )
    }

    const dealerId = dealer.id
    console.log('[DEBUG] Found dealer ID:', dealerId)
    
    // Now find the landing page for this dealer and campaign
    const result = await payload.find({
      collection: 'landing-pages',
      where: {
        and: [
          {
            slug: {
              equals: campaignSlug
            }
          },
          {
            dealerLocation: {
              equals: dealerId
            }
          },
          {
            or: [
              {
                status: {
                  equals: 'active'
                }
              },
              {
                isActive: {
                  equals: true
                }
              }
            ]
          }
        ]
      },
      limit: 1,
      depth: 3 // Populate dealerLocation, media relationships, and nested relationships
    })
    
    console.log('[DEBUG] Landing page query result:', { 
      count: result.docs.length, 
      dealerId, 
      campaignSlug,
      query: {
        slug: campaignSlug,
        dealerLocation: dealerId,
        status: 'active'
      }
    })
    
    const landingPage = result.docs[0]

    if (landingPage) {
      // Check if campaign dates are set and validate them
      const now = new Date()

      if (landingPage.campaignStartDate) {
        const startDate = new Date(landingPage.campaignStartDate)
        if (now < startDate) {
          console.log('[DEBUG] Campaign has not started yet:', { campaignSlug, startDate })
          return NextResponse.json(
            { success: false, error: 'Campaign has not started yet' }, 
            { status: 404 }
          )
        }
      }
      
      if (landingPage.campaignEndDate) {
        const endDate = new Date(landingPage.campaignEndDate)
        if (now > endDate) {
          console.log('[DEBUG] Campaign has expired:', { campaignSlug, endDate })
          return NextResponse.json(
            { success: false, error: 'Campaign has expired' }, 
            { status: 404 }
          )
        }
      }
      
      console.log('[DEBUG] Landing page found and active:', {
        title: landingPage.title,
        campaignType: landingPage.campaignType,
        hasPageContent: !!(landingPage.pageContent && landingPage.pageContent.length > 0)
      })
      
      return NextResponse.json({
        success: true,
        data: landingPage
      })
    } else {
      console.log('[DEBUG] Landing page not found:', { dealerSlug, campaignSlug })
      return NextResponse.json(
        { success: false, error: 'Landing page not found or inactive' }, 
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error fetching landing page data:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch landing page data',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}