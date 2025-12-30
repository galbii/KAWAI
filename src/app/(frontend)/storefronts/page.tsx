import type { Metadata } from 'next'
import { StorefrontsGrid } from '@/components/storefronts/StorefrontsGrid'

export const metadata: Metadata = {
  title: 'Official KAWAI Storefronts | Find a Showroom Near You',
  description: 'Discover authorized KAWAI Piano Gallery showrooms across the country. Visit our official storefronts to experience the finest pianos and expert customer service.',
  openGraph: {
    title: 'Official KAWAI Storefronts',
    description: 'Find an authorized KAWAI Piano Gallery showroom near you',
  },
}

export const revalidate = 300 // 5 minutes

/**
 * Storefronts Page - Directory of all official KAWAI showrooms
 *
 * Features:
 * - Server-side data fetching for SEO
 * - Client-side search and filtering
 * - Responsive grid layout
 * - Premium card design
 */
export default async function StorefrontsPage() {
  // Fetch storefronts from API endpoint
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  let storefronts = []
  let error = null

  try {
    const response = await fetch(`${baseUrl}/api/storefronts/active`, {
      next: { revalidate: 300 }, // 5 minutes cache
    })

    if (response.ok) {
      const result = await response.json()
      storefronts = result.data || []
    } else {
      error = 'Failed to load storefronts'
    }
  } catch (err) {
    console.error('[Storefronts Page] Error fetching storefronts:', err)
    error = 'Failed to load storefronts'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kawai-pearl via-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-kawai-charcoal via-kawai-charcoal/95 to-kawai-charcoal/90 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* KAWAI Brand Mark */}
            <div className="mb-8 flex justify-center">
              <div className="inline-block px-4 py-2 bg-kawai-red/10 border border-kawai-red/30 rounded-full">
                <span className="text-kawai-red text-xs font-medium tracking-[0.2em] uppercase">
                  Official Showrooms
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              KAWAI Official Storefronts
            </h1>

            {/* Decorative Divider */}
            <div className="w-24 h-1.5 bg-kawai-red mx-auto mb-8"></div>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Visit our authorized KAWAI Piano Gallery locations to experience
              world-class instruments and receive expert guidance from our dedicated team
            </p>

            {/* Stats */}
            {storefronts.length > 0 && (
              <div className="mt-12 flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-kawai-red mb-1">
                    {storefronts.length}
                  </div>
                  <div className="text-sm text-white/60 uppercase tracking-wider">
                    {storefronts.length === 1 ? 'Location' : 'Locations'}
                  </div>
                </div>
                <div className="h-12 w-px bg-white/20"></div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-kawai-red mb-1">
                    100+
                  </div>
                  <div className="text-sm text-white/60 uppercase tracking-wider">
                    Years Legacy
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Client Component for Search */}
      <StorefrontsGrid storefronts={storefronts} error={error} />

      {/* Additional Info Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-kawai-charcoal mb-6">
              Why Visit a KAWAI Showroom?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-kawai-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-kawai-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-kawai-charcoal mb-2">
                  Experience the Difference
                </h3>
                <p className="text-gray-600 text-sm">
                  Feel the touch, hear the tone, and play the pianos that have inspired generations
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-kawai-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-kawai-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-kawai-charcoal mb-2">
                  Expert Guidance
                </h3>
                <p className="text-gray-600 text-sm">
                  Get personalized recommendations from our knowledgeable staff
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-kawai-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-kawai-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-kawai-charcoal mb-2">
                  Premium Service
                </h3>
                <p className="text-gray-600 text-sm">
                  Enjoy exceptional service and ongoing support for your piano journey
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
