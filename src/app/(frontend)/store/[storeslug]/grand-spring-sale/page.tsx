import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import {
  getStorefrontBySlugDirect,
  getActiveStorefrontSlugs,
  getGrandPianoSaleProducts,
} from '@/lib/payload/queries'
import {
  GrandSpringHero,
  FinancingSection,
  GrandPianoShowcase,
  TradeInBanner,
  TestimonialsSection,
  StorefrontVisitSection,
  SaleLeadForm,
} from '@/components/grand-spring-sale'
import { CampaignNavigator } from '@/components/storefronts/CampaignNavigator'

export const revalidate = 3600

interface Params {
  storeslug: string
}

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getActiveStorefrontSlugs()
  return slugs.map((storeslug) => ({ storeslug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { storeslug } = await params
  const storefront = await getStorefrontBySlugDirect(storeslug)
  if (!storefront) return {}

  const locationName: string = storefront.showroomInfo?.name ?? storefront.locationName ?? 'Our Showroom'
  const city = (storefront.address?.city as string | undefined) ?? ''

  return {
    title: `Grand Spring Sale — 0% Financing for 36 Months | ${locationName}`,
    description: `A grand piano isn't out of reach anymore. Shop Kawai grand pianos with 0% financing for 36 months at ${locationName}${city ? ` in ${city}` : ''}. Trade-in welcome — $500 over any appraisal.`,
    openGraph: {
      title: `Grand Spring Sale | ${locationName}`,
      description: `0% financing for 36 months on every Kawai grand piano. Limited spring offer.`,
    },
  }
}

async function GrandSpringContent({ storeslug }: { storeslug: string }) {
  const [storefront, products] = await Promise.all([
    getStorefrontBySlugDirect(storeslug),
    getGrandPianoSaleProducts(),
  ])

  if (!storefront) notFound()

  const locationName: string = storefront.showroomInfo?.name ?? storefront.locationName ?? null
  const address: string | null = storefront.showroomInfo?.address ?? null
  const phone: string | null = storefront.showroomInfo?.phone ?? null
  const hours = storefront.hours ?? null
  const mapApiKey: string | null = storefront.mapApiKey ?? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? null
  const directionsLink: string | null = storefront.showroomCtas?.directionsLink ?? null
  const testimonials = storefront.customerTestimonials ?? null

  const lowestMsrp = products.reduce<number | null>((min, p) => {
    const msrp = p.price?.msrp ?? null
    if (msrp === null) return min
    return min === null || msrp < min ? msrp : min
  }, null)

  return (
    <>
      <GrandSpringHero locationName={locationName} storeslug={storeslug} />

      <Suspense>
        <FinancingSection exampleMsrp={lowestMsrp ?? 9995} />
      </Suspense>

      <Suspense>
        <GrandPianoShowcase products={products} storeslug={storeslug} />
      </Suspense>

      <Suspense>
        <TestimonialsSection testimonials={testimonials} />
      </Suspense>

      <TradeInBanner storeslug={storeslug} />

      <StorefrontVisitSection
        locationName={locationName}
        address={address}
        phone={phone}
        hours={hours}
        mapApiKey={mapApiKey}
        directionsLink={directionsLink}
        storeslug={storeslug}
      />

      <SaleLeadForm storeslug={storeslug} products={products} />
    </>
  )
}

export default async function GrandSpringSalePage({
  params,
}: {
  params: Promise<Params>
}) {
  const { storeslug } = await params

  const VIDEO_SRC = 'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/kling_20260422_%E4%BD%9C%E5%93%81_Can_you_an_460_0.mp4'

  return (
    <main className="relative">
      {/* Fixed video — visible through all transparent sections as the user scrolls */}
      <div className="fixed inset-0 -z-10 bg-kawai-black">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          aria-hidden
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      </div>

      <Suspense>
        <GrandSpringContent storeslug={storeslug} />
      </Suspense>
      <CampaignNavigator storeslug={storeslug} />
    </main>
  )
}
