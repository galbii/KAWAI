import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic' // DB-dependent — never execute at build time

/**
 * GET /api/search-quick-links
 * Returns quick navigation links for the search overlay welcome screen
 * Fetches from HomePage collection's searchQuickLinks field
 */
export async function GET() {
  try {
    const payload = await getPayload({ config })

    // Fetch the HomePage singleton
    const result = await payload.find({
      collection: 'home-page',
      limit: 1,
      depth: 0, // No need for deep population
    })

    if (result.docs.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'HomePage not found',
          // Return default links as fallback
          data: [
            { label: 'Instrumental to Life', url: '/instrumental-to-life' },
            { label: 'Find a Dealer', url: '/find-a-dealer' },
            { label: 'Register My Piano', url: '/warranty-registration' },
            { label: 'Kawai Exclusive Offers', url: '/explore' },
          ]
        },
        { status: 200 }
      )
    }

    const homePage = result.docs[0] as any // Type will be generated after first build
    const quickLinks = homePage?.searchQuickLinks || []

    // Return quick links or defaults
    return NextResponse.json({
      success: true,
      data: quickLinks.length > 0
        ? quickLinks
        : [
            { label: 'Instrumental to Life', url: '/instrumental-to-life' },
            { label: 'Find a Dealer', url: '/find-a-dealer' },
            { label: 'Register My Piano', url: '/warranty-registration' },
            { label: 'Kawai Exclusive Offers', url: '/explore' },
          ],
    })
  } catch (error) {
    console.error('[API] Error fetching search quick links:', error)

    // Return default links even on error
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch quick links',
        data: [
          { label: 'Instrumental to Life', url: '/instrumental-to-life' },
          { label: 'Find a Dealer', url: '/find-a-dealer' },
          { label: 'Register My Piano', url: '/warranty-registration' },
          { label: 'Kawai Exclusive Offers', url: '/explore' },
        ],
      },
      { status: 200 } // Return 200 with defaults to prevent UI errors
    )
  }
}
