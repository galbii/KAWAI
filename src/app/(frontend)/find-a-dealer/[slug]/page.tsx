import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { getDealerBySlugDirect, getNearbyDealersDirect } from '@/lib/payload/queries'
import { DealerBusinessSchema } from '@/components/seo/DealerBusinessSchema'
import type { Media } from '@/payload-types'

// Component imports
import { DealerHero } from './components/DealerHero'
import { DealerContactBar } from './components/DealerContactBar'
import { DealerInfo } from './components/DealerInfo'
import { DealerHours } from './components/DealerHours'
import { DealerMap } from './components/DealerMap'
import { RelatedDealers } from './components/RelatedDealers'

// Enable ISR with 15-minute revalidation
export const revalidate = 900

// Type guard for Media objects
function isMediaObject(media: any): media is Media {
  return typeof media === 'object' && media !== null && 'url' in media
}

// Cached dealer fetcher with proper Next.js cache tags
function getCachedDealer(slug: string) {
  return unstable_cache(
    async () => getDealerBySlugDirect(slug),
    [`dealer-${slug}`],
    {
      tags: [`dealer-${slug}`],
      revalidate: 900 // 15 minutes
    }
  )()
}

// Pre-render all active dealers at build time
export async function generateStaticParams() {
  try {
    const { getPayloadHMR } = await import('@payloadcms/next/utilities')
    const configPromise = await import('@payload-config')
    const payload = await getPayloadHMR({ config: configPromise.default })

    const dealers = await payload.find({
      collection: 'dealers',
      where: {
        isActive: { equals: true }
      },
      limit: 500,
      select: { slug: true }
    })

    console.log(`✅ [SEO] Pre-rendering ${dealers.docs.length} dealer pages for Google indexing`)

    return dealers.docs.map(d => ({ slug: d.slug }))
  } catch (error) {
    console.error('❌ [SEO] Error generating dealer static params:', error)
    return []
  }
}

// Generate metadata for SEO - CRITICAL FOR LOCAL SEARCH
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  try {
    const { slug } = await params
    const dealer = await getDealerBySlugDirect(slug)

    if (!dealer) {
      return {
        title: 'Dealer Not Found',
        robots: { index: false, follow: false }
      }
    }

    const city = dealer.address?.city
    const state = dealer.address?.state
    const locationText = city && state ? `${city}, ${state}` : ''

    // Title pattern: "Piano Dealer in {City}, {State} | {Dealer Name} | KAWAI"
    const title = locationText
      ? `Piano Dealer in ${locationText} | ${dealer.dealerName} | KAWAI`
      : `${dealer.dealerName} | Authorized Kawai Piano Dealer`

    // Build service list from tags (limit to first 3 for description)
    const services = dealer.tags?.slice(0, 3).map((t: string) =>
      t.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
    ).join(', ')

    // Description pattern with services and contact info
    const description = `${dealer.dealerName} - Authorized Kawai piano dealer in ${locationText}.${services ? ` ${services}.` : ''} Call ${dealer.contactInfo?.phone || 'us'} or visit our showroom at ${dealer.address?.street}.`

    // Get dealer image URL for OpenGraph
    const dealerImage = isMediaObject(dealer.dealerImage)
      ? dealer.dealerImage.url
      : null

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaipianogallerystl.com'
    const canonicalUrl = `${siteUrl}/find-a-dealer/${slug}`

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true
        }
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        type: 'website',
        siteName: 'KAWAI Piano Gallery',
        ...(dealerImage && {
          images: [{
            url: dealerImage,
            alt: `${dealer.dealerName} showroom`
          }]
        })
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        ...(dealerImage && {
          images: [dealerImage]
        })
      }
    }
  } catch (error) {
    console.error('❌ [SEO] Error generating dealer metadata:', error)
    return {
      title: 'Dealer Not Found',
      robots: { index: false, follow: false }
    }
  }
}

// Main dealer content component
async function DealerContent({ slug }: { slug: string }) {
  const dealer = await getCachedDealer(slug)

  if (!dealer) {
    notFound()
  }

  // Fetch nearby dealers for "Related Dealers" section
  const nearbyDealers = dealer.coordinates?.latitude && dealer.coordinates?.longitude
    ? await getNearbyDealersDirect(
        dealer.coordinates.latitude,
        dealer.coordinates.longitude,
        slug,
        100, // 100 mile radius
        3    // Top 3 nearest
      )
    : []

  return (
    <>
      {/* Structured data for local SEO */}
      <DealerBusinessSchema dealer={dealer} />

      {/* Hero section */}
      <DealerHero
        dealerName={dealer.dealerName}
        dealerImage={dealer.dealerImage}
        city={dealer.address?.city}
        state={dealer.address?.state}
        isFeatured={dealer.isFeatured}
        yearEstablished={dealer.yearEstablished}
      />

      {/* Sticky contact bar */}
      <DealerContactBar dealer={dealer} />

      {/* Main content with enhanced spacing and layout */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid lg:grid-cols-3 gap-10 lg:gap-12">
          <div className="lg:col-span-2 space-y-10">
            {/* Dealer Info Component */}
            <DealerInfo dealer={dealer} />

            {/* Hours Component */}
            <DealerHours dealer={dealer} />

            {/* Map Component */}
            <DealerMap dealer={dealer} />
          </div>

          {/* Sidebar - Premium Contact Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white to-gray-50/50 p-8 rounded-2xl shadow-2xl border-0 sticky top-24 space-y-6 overflow-hidden">
              {/* Decorative gold accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-kawai-gold via-kawai-red to-kawai-gold/20" />

              <h2 className="text-2xl font-serif font-bold text-kawai-charcoal flex items-center gap-3">
                <div className="p-2 bg-kawai-gold/10 rounded-lg">
                  <svg className="w-6 h-6 text-kawai-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                Contact
              </h2>

              <div className="space-y-5">
                {/* Address */}
                <div className="space-y-2 pb-5 border-b border-gray-200/60">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-kawai-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h3 className="text-xs font-bold text-kawai-gold uppercase tracking-widest">Address</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed font-medium pl-6">
                    {dealer.address?.street}<br />
                    {dealer.address?.city}, {dealer.address?.state} {dealer.address?.zipCode}
                  </p>
                </div>

                {/* Phone */}
                {dealer.contactInfo?.phone && (
                  <div className="space-y-2 pb-5 border-b border-gray-200/60">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-kawai-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <h3 className="text-xs font-bold text-kawai-gold uppercase tracking-widest">Phone</h3>
                    </div>
                    <a
                      href={`tel:${dealer.contactInfo.phone}`}
                      className="block text-kawai-red hover:text-kawai-gold transition-colors duration-300 font-semibold text-lg pl-6 group"
                    >
                      {dealer.contactInfo.phone}
                      <span className="block w-0 h-0.5 bg-kawai-gold group-hover:w-full transition-all duration-300" />
                    </a>
                  </div>
                )}

                {/* Email */}
                {dealer.contactInfo?.email && (
                  <div className="space-y-2 pb-5 border-b border-gray-200/60">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-kawai-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                      <h3 className="text-xs font-bold text-kawai-gold uppercase tracking-widest">Email</h3>
                    </div>
                    <a
                      href={`mailto:${dealer.contactInfo.email}`}
                      className="block text-kawai-red hover:text-kawai-gold transition-colors duration-300 font-medium break-words pl-6 group"
                    >
                      {dealer.contactInfo.email}
                      <span className="block w-0 h-0.5 bg-kawai-gold group-hover:w-full transition-all duration-300" />
                    </a>
                  </div>
                )}

                {/* Website */}
                {dealer.contactInfo?.website && (
                  <div className="space-y-2 pb-5 border-b border-gray-200/60">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-kawai-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <h3 className="text-xs font-bold text-kawai-gold uppercase tracking-widest">Website</h3>
                    </div>
                    <a
                      href={dealer.contactInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-kawai-red hover:text-kawai-gold transition-all duration-300 font-semibold pl-6 group"
                    >
                      Visit Website
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>

              {/* Premium Directions Button */}
              {dealer.coordinates?.latitude && dealer.coordinates?.longitude && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${dealer.coordinates.latitude},${dealer.coordinates.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block w-full bg-gradient-to-r from-kawai-gold to-kawai-gold/90 text-white text-center py-4 px-6 rounded-xl hover:from-kawai-gold hover:to-kawai-red transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 mt-6"
                >
                  <span className="flex items-center justify-center gap-3">
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Get Directions
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Related Dealers Component */}
        <RelatedDealers dealers={nearbyDealers} currentCity={dealer.address?.city} />
      </div>
    </>
  )
}

// Loading skeleton
function DealerPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 animate-pulse">
      <div className="h-12 bg-gray-200 rounded w-2/3 mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default async function DealerPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  return (
    <Suspense fallback={<DealerPageSkeleton />}>
      <DealerContent slug={slug} />
    </Suspense>
  )
}
