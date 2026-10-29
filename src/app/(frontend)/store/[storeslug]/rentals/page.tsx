import { Suspense } from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getStorefrontBySlugDirect, getActiveStorefrontSlugs } from '@/lib/payload/queries'
import { getSite, getSiteUrl, getSiteAlternates } from '@/lib/site-context'
import { PianoRentalsSection } from '@/components/storefronts/piano-rentals-section'
import { RentalInquiryForm } from '@/components/storefronts/rental-inquiry-form'
import { RentalsHeroCopy } from '@/components/storefronts/rentals/RentalsHeroCopy'
import { RentalsSectionNav } from '@/components/storefronts/rentals/RentalsSectionNav'
import { RENTAL_SECTION_SCROLL_MARGIN } from '@/components/storefronts/rentals/SectionHeading'
import { ShowroomLocation } from '@/components/homepage'
import { RENTAL_INQUIRY_ANCHOR } from '@/lib/rentals'
import { getRentalImageFallbacks, mediaUrl } from '@/lib/rentals-images'

export const revalidate = 3600

interface Params {
  storeslug: string
}

const SERIF = 'var(--font-crimson), Georgia, serif'

/** A store gets a rentals page when either rental program is switched on. */
function offersRentals(storefront: any): boolean {
  return Boolean(storefront?.pianoRentalsEnabled || storefront?.facilityRentalsEnabled)
}

function storeNameOf(storefront: any): string {
  return storefront.showroomInfo?.name ?? storefront.locationName ?? 'Kawai Showroom'
}

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getActiveStorefrontSlugs()
  return slugs.map((storeslug) => ({ storeslug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { storeslug } = await params
  const storefront = await getStorefrontBySlugDirect(storeslug)
  if (!storefront || !offersRentals(storefront)) return {}

  const storeName = storeNameOf(storefront)
  const city = (storefront.address?.city as string | undefined) ?? ''
  const path = `/store/${storeslug}/rentals`
  const siteUrl = getSiteUrl(await getSite())
  const title = `Piano Rentals${city ? ` in ${city}` : ''} | ${storeName}`
  const description = `Rent a brand-new Kawai acoustic or digital piano from ${storeName}${city ? ` in ${city}` : ''}. The first six months of rental fees can be applied toward the down payment if you decide to buy.`

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}${path}`,
      languages: getSiteAlternates(path),
    },
    openGraph: { title, description, url: `${siteUrl}${path}` },
  }
}

export default async function RentalsPage({ params }: { params: Promise<Params> }) {
  const { storeslug } = await params
  // Resolve before any Suspense boundary so a store without rentals is a real
  // 404 status, not a streamed not-found UI on a 200 (soft 404).
  const storefront = await getStorefrontBySlugDirect(storeslug)
  if (!storefront || !offersRentals(storefront)) notFound()

  const fallbacks = await getRentalImageFallbacks()
  const storeName = storeNameOf(storefront)
  const brandedStore = /kawai/i.test(storeName) ? storeName : `Kawai ${storeName}`
  const phone: string | null = storefront.showroomInfo?.phone ?? null
  const heroImage = mediaUrl(storefront.rentalHeroImage) ?? fallbacks.hero

  return (
    <div className="min-h-screen">
      {/* Hero — full-bleed photo with the homepage carousel's gradients */}
      <section className="relative h-[78vh] min-h-[560px] max-h-[860px] overflow-hidden bg-kawai-black">
        {heroImage && <Image src={heroImage} alt="" fill priority sizes="100vw" className="object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-kawai-black/85 via-kawai-black/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-kawai-black/55 via-kawai-black/10 to-transparent" />
        <div className="relative z-10 flex h-full items-end">
          <div className="container mx-auto max-w-screen-2xl px-6 md:px-10 pb-14 md:pb-20">
            <RentalsHeroCopy
              eyebrow={`Piano rentals · ${brandedStore}`}
              title="Rent a Kawai"
              subtitle="Acoustic and digital pianos, available only at Kawai-owned showrooms. Start with a rental and decide later."
              ctaText="Send a rental inquiry"
              ctaHref={`#${RENTAL_INQUIRY_ANCHOR}`}
              phone={phone}
              back={{
                href: `/store/${storeslug}`,
                label: `${storeName} showroom`,
              }}
            />
          </div>
        </div>
      </section>

      {/* Everything below the hero shares one wrapper so the section nav stays
          pinned all the way down to the map. */}
      <div>
        <RentalsSectionNav inquiryHref={`#${RENTAL_INQUIRY_ANCHOR}`} inquiryText="Inquire" />

        <PianoRentalsSection data={storefront} storeslug={storeslug} onRentalsPage fallbacks={fallbacks} />

        {/* Inquiry */}
        <section
          id={RENTAL_INQUIRY_ANCHOR}
          className={`${RENTAL_SECTION_SCROLL_MARGIN} bg-white`}
        >
          <div className="container mx-auto grid max-w-screen-2xl gap-12 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="block h-px w-6 bg-kawai-red" />
                <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-kawai-charcoal/60">
                  Rental inquiry
                </p>
              </div>
              <h2
                className="font-light leading-tight text-kawai-black"
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(1.9rem, 3.4vw, 3rem)',
                  letterSpacing: '-0.02em',
                }}
              >
                Ask {storeName} about renting
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-kawai-black/70">
                Tell us who&apos;s playing and what you have in mind. The showroom replies within one business day with
                availability and rates — or stop by to compare models in person.
              </p>
              {phone && (
                <p className="mt-8 text-kawai-black/65">
                  Prefer to talk?{' '}
                  <a
                    href={`tel:${phone}`}
                    className="font-medium text-kawai-black underline decoration-kawai-red underline-offset-4 hover:text-kawai-red"
                  >
                    {phone}
                  </a>
                </p>
              )}
            </div>
            <Suspense fallback={null}>
              <RentalInquiryForm storeslug={storeslug} storeName={storeName} />
            </Suspense>
          </div>
        </section>

        <div id="visit" data-rental-nav="Visit" className={RENTAL_SECTION_SCROLL_MARGIN}>
          <ShowroomLocation
            data={{
              sectionHeader: storefront.sectionHeader,
              showroomTitle: storefront.showroomTitle,
              showroomDescription: storefront.showroomDescription,
              showroomInfo: storefront.showroomInfo,
              hours: storefront.hours,
              features: storefront.features,
              mapApiKey: storefront.mapApiKey,
              showroomCtas: storefront.showroomCtas,
              trustBanner: storefront.trustBanner,
            }}
          />
        </div>
      </div>
    </div>
  )
}
