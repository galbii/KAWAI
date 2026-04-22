import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import {
  getStorefrontBySlugDirect,
  getActiveStorefrontSlugs,
  getGrandPianoSaleProducts,
} from '@/lib/payload/queries'
import {
  TradeInHero,
  TradeInCalculator,
  HowItWorks,
  GrandSpringLink,
} from '@/components/trade-in'
import { StorefrontVisitSection } from '@/components/grand-spring-sale'
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

  const locationName: string =
    storefront.showroomInfo?.name ?? storefront.locationName ?? 'Our Showroom'
  const city = (storefront.address?.city as string | undefined) ?? ''

  return {
    title: `Piano Trade-In — $500 Over Any Appraisal | ${locationName}`,
    description: `Trade in your piano at ${locationName}${city ? ` in ${city}` : ''} and receive $500 above any independent appraisal toward a new Kawai grand. 0% financing for 36 months available. Spring offer ends May 17, 2026.`,
    openGraph: {
      title: `Piano Trade-In — $500 Bonus | ${locationName}`,
      description:
        'Your piano is worth more at Kawai. $500 over any appraisal + 0% financing on grand pianos.',
    },
  }
}

async function TradePageContent({ storeslug }: { storeslug: string }) {
  const [storefront, products] = await Promise.all([
    getStorefrontBySlugDirect(storeslug),
    getGrandPianoSaleProducts(),
  ])

  if (!storefront) notFound()

  const locationName: string =
    storefront.showroomInfo?.name ?? storefront.locationName ?? null
  const address: string | null = storefront.showroomInfo?.address ?? null
  const phone: string | null = storefront.showroomInfo?.phone ?? null
  const hours = storefront.hours ?? null
  const mapApiKey: string | null =
    storefront.mapApiKey ?? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? null
  const directionsLink: string | null = storefront.showroomCtas?.directionsLink ?? null
  const calendlyUrl: string | null = storefront.calendlyUrl ?? null

  return (
    <>
      <TradeInHero locationName={locationName} />

      <HowItWorks phone={phone} />

      <Suspense>
        <TradeInCalculator products={products} calendlyUrl={calendlyUrl} locationName={locationName} storeslug={storeslug} />
      </Suspense>

      <StorefrontVisitSection
        locationName={locationName}
        address={address}
        phone={phone}
        hours={hours}
        mapApiKey={mapApiKey}
        directionsLink={directionsLink}
        storeslug={storeslug}
        calendlyUrl={calendlyUrl}
      />

      <GrandSpringLink storeslug={storeslug} />
      <CampaignNavigator storeslug={storeslug} calendlyUrl={calendlyUrl} locationName={locationName} />
    </>
  )
}

export default async function TradeInPage({
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
        <TradePageContent storeslug={storeslug} />
      </Suspense>
    </main>
  )
}
