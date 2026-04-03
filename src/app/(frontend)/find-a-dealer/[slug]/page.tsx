import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { getDealerBySlugDirect, getNearbyDealersDirect } from '@/lib/payload/queries'
import { DealerBusinessSchema } from '@/components/seo/DealerBusinessSchema'
import type { Media } from '@/payload-types'

// Component imports
import { DealerHero } from './components/DealerHero'
import { DealerStickyNav } from './components/DealerStickyNav'
import { DealerInfo } from './components/DealerInfo'
import { DealerMap } from './components/DealerMap'
import { RelatedDealers } from './components/RelatedDealers'
import { AdminBarDoc } from '@/components/layout/AdminBarDoc'

// ISR: 15-minute revalidation
export const revalidate = 900

function isMediaObject(media: unknown): media is Media {
  return typeof media === 'object' && media !== null && 'url' in media
}

function getCachedDealer(slug: string) {
  return unstable_cache(
    async () => getDealerBySlugDirect(slug),
    [`dealer-${slug}`],
    { tags: [`dealer-${slug}`], revalidate: 900 }
  )()
}

// Pre-render all active dealers at build time for SEO
export async function generateStaticParams() {
  try {
    const { getPayloadClient } = await import('@/lib/payload/queries')
    const payload = await getPayloadClient()

    const dealers = await payload.find({
      collection: 'dealers',
      where: { isActive: { equals: true } },
      limit: 500,
      select: { slug: true },
    })

    console.log(`✅ [SEO] Pre-rendering ${dealers.docs.length} dealer pages for Google indexing`)
    return dealers.docs.map((d) => ({ slug: d.slug }))
  } catch (error) {
    console.error('❌ [SEO] Error generating dealer static params:', error)
    return []
  }
}

// SEO metadata — optimized for local piano search
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  try {
    const { slug } = await params
    const dealer = await getDealerBySlugDirect(slug)

    if (!dealer) {
      return { title: 'Dealer Not Found', robots: { index: false, follow: false } }
    }

    const city = dealer.address?.city
    const state = dealer.address?.state
    const locationText = city && state ? `${city}, ${state}` : ''

    const title = locationText
      ? `Piano Dealer in ${locationText} | ${dealer.dealerName} | KAWAI`
      : `${dealer.dealerName} | Authorized Kawai Piano Dealer`

    const description = `${dealer.dealerName} — Authorized Kawai piano dealer in ${locationText}. Call ${dealer.contactInfo?.phone || 'us'} or visit our showroom at ${dealer.address?.street}.`

    const dealerImage = isMediaObject(dealer.dealerImage) ? dealer.dealerImage.url : null
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaipianogallerystl.com'
    const canonicalUrl = `${siteUrl}/find-a-dealer/${slug}`

    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        type: 'website',
        siteName: 'KAWAI Piano Gallery',
        ...(dealerImage && { images: [{ url: dealerImage, alt: `${dealer.dealerName} showroom` }] }),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        ...(dealerImage && { images: [dealerImage] }),
      },
    }
  } catch (error) {
    console.error('❌ [SEO] Error generating dealer metadata:', error)
    return { title: 'Dealer Not Found', robots: { index: false, follow: false } }
  }
}

// Main content — server component
async function DealerContent({ slug }: { slug: string }) {
  const dealer = await getCachedDealer(slug)

  if (!dealer) notFound()

  const nearbyDealers =
    dealer.coordinates?.latitude && dealer.coordinates?.longitude
      ? await getNearbyDealersDirect(
          dealer.coordinates.latitude,
          dealer.coordinates.longitude,
          slug,
          100,
          3
        )
      : []

  const hasPhone = Boolean(dealer.contactInfo?.phone?.trim())
  const hasEmail = Boolean(dealer.contactInfo?.email?.trim())
  const hasWebsite = Boolean(dealer.contactInfo?.website?.trim())
  const hasCoords =
    dealer.coordinates?.latitude != null && dealer.coordinates?.longitude != null

  return (
    <>
      <AdminBarDoc
        collection="dealers"
        id={dealer.id}
        collectionLabels={{ singular: 'Dealer', plural: 'Dealers' }}
      />

      {/* Local business structured data for Google */}
      <DealerBusinessSchema dealer={dealer} />

      {/* Sticky nav — appears after hero */}
      <DealerStickyNav dealer={dealer} />

      {/* Full-bleed hero */}
      <DealerHero
        dealerName={dealer.dealerName}
        city={dealer.address?.city}
        state={dealer.address?.state}
        isFeatured={dealer.isFeatured}
        yearEstablished={dealer.yearEstablished}
      />

      {/* Page body — kawai-pearl background matching homepage sections */}
      <div className="bg-kawai-pearl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16 sm:py-24">
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">

            {/* ── Left column (2/3): Map → About → Services ── */}
            <div className="lg:col-span-2 space-y-14">

              {/* Map section */}
              <div>
                <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-6">
                  Location
                </div>
                <DealerMap dealer={dealer} />
                {dealer.address && (
                  <p className="mt-3 text-sm text-kawai-black/60 leading-relaxed">
                    {dealer.address.street} · {dealer.address.city}, {dealer.address.state}{' '}
                    {dealer.address.zipCode}
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-kawai-pearl border-t border-kawai-black/10" />

              {/* About + services */}
              <DealerInfo dealer={dealer} />
            </div>

            {/* ── Right column (1/3): Contact card ── */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                {/* White card — matches homepage card style */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="p-6 sm:p-8 space-y-6">

                    {/* Header */}
                    <div>
                      <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-2">
                        Authorized Dealer
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-kawai-black leading-tight uppercase">
                        {dealer.dealerName}
                      </h2>
                      <div className="w-12 h-px bg-kawai-red opacity-50 mt-2" />
                    </div>

                    {/* Address */}
                    {dealer.address && (
                      <div className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-kawai-red/10 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                          <svg className="w-2.5 h-2.5 text-kawai-red" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                          </svg>
                        </div>
                        <p className="text-sm text-kawai-black/70 leading-relaxed">
                          {dealer.address.street}
                          <br />
                          {dealer.address.city}, {dealer.address.state} {dealer.address.zipCode}
                        </p>
                      </div>
                    )}

                    {/* Phone */}
                    {hasPhone && dealer.contactInfo?.phone && (
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-kawai-red/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-2.5 h-2.5 text-kawai-red" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                          </svg>
                        </div>
                        <a
                          href={`tel:${dealer.contactInfo.phone}`}
                          className="text-sm text-kawai-black/70 hover:text-kawai-red transition-colors font-medium"
                        >
                          {dealer.contactInfo.phone}
                        </a>
                      </div>
                    )}

                    {/* Email */}
                    {hasEmail && dealer.contactInfo?.email && (
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-kawai-red/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-2.5 h-2.5 text-kawai-red" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                          </svg>
                        </div>
                        <a
                          href={`mailto:${dealer.contactInfo.email}`}
                          className="text-sm text-kawai-black/70 hover:text-kawai-red transition-colors truncate"
                        >
                          {dealer.contactInfo.email}
                        </a>
                      </div>
                    )}

                    {/* Divider */}
                    <div className="h-px bg-kawai-pearl" />

                    {/* CTAs */}
                    <div className="space-y-3">
                      {/* Visit Website link */}
                      {hasWebsite && dealer.contactInfo?.website && (
                        <a
                          href={dealer.contactInfo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center space-x-2 w-full border border-kawai-black/20 hover:border-kawai-red text-kawai-black hover:text-kawai-red px-6 py-3 font-medium transition-colors text-sm tracking-wide uppercase rounded-lg min-h-[44px] touch-manipulation"
                        >
                          <span>Visit Website</span>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                          </svg>
                        </a>
                      )}

                      {/* Get Directions */}
                      {hasCoords &&
                        dealer.coordinates?.latitude != null &&
                        dealer.coordinates?.longitude != null && (
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${dealer.coordinates.latitude},${dealer.coordinates.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center space-x-2 w-full bg-kawai-red hover:bg-kawai-black text-white px-6 py-3 font-medium transition-colors text-sm tracking-wide uppercase rounded-lg min-h-[44px] touch-manipulation"
                          >
                            <span>Get Directions</span>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                            </svg>
                          </a>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related dealers — uses [#F5F5F5] section like homepage */}
        <RelatedDealers dealers={nearbyDealers} currentCity={dealer.address?.city} />
      </div>
    </>
  )
}

// Loading skeleton
function DealerPageSkeleton() {
  return (
    <div className="animate-pulse bg-kawai-pearl">
      <div className="w-full bg-kawai-black/20" style={{ height: 'clamp(460px, 60vh, 640px)' }} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16 sm:py-24">
        <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
          <div className="lg:col-span-2 space-y-8">
            <div className="h-[400px] bg-kawai-black/10 rounded-2xl" />
            <div className="space-y-3">
              <div className="h-3 bg-kawai-black/10 rounded w-24" />
              <div className="h-5 bg-kawai-black/10 rounded w-full" />
              <div className="h-5 bg-kawai-black/10 rounded w-4/5" />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="h-96 bg-white rounded-2xl shadow-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Page entry point
export default async function DealerPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <Suspense fallback={<DealerPageSkeleton />}>
      <DealerContent slug={slug} />
    </Suspense>
  )
}
