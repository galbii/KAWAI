import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import {
  getStorefrontBySlugDirect,
  getActiveStorefrontSlugs,
  getRebateShowcase,
} from '@/lib/payload/queries'
import { getSite, getSiteUrl, getSiteAlternates } from '@/lib/site-context'
import {
  BackToSchoolHero,
  OffersSection,
  RebateSection,
  TradeInBand,
  HowItWorksStrip,
  VisitSection,
  BookingSection,
  DeadlineDock,
  CampaignStyles,
  CampaignNoScript,
} from '@/components/back-to-school'
import { DATE_RANGE, DEADLINE_LONG } from '@/components/back-to-school/campaign'

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

  const site = await getSite()
  const siteUrl = getSiteUrl(site)
  const path = `/store/${storeslug}/back-to-school`

  const locationName: string =
    storefront.showroomInfo?.name ?? storefront.locationName ?? 'Our Showroom'
  const city = (storefront.address?.city as string | undefined) ?? ''

  const title = `Back to School Piano Sale — Instant Rebates Through ${DEADLINE_LONG} | ${locationName}`
  const description = `Instant rebates up to $4,500 on new Kawai pianos at ${locationName}${
    city ? ` in ${city}` : ''
  }, plus 0% financing for 36 months and $500 over any trade-in appraisal. ${DATE_RANGE}.`

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}${path}`,
      languages: getSiteAlternates(path),
    },
    openGraph: {
      title: `Back to School Piano Sale | ${locationName}`,
      description: `Instant rebates on every Kawai in the September program — ends ${DEADLINE_LONG}.`,
    },
  }
}

async function BackToSchoolContent({ storeslug }: { storeslug: string }) {
  const site = await getSite()
  const [storefront, rebates] = await Promise.all([
    getStorefrontBySlugDirect(storeslug),
    getRebateShowcase(site),
  ])

  if (!storefront) notFound()

  const locationName: string | null =
    storefront.showroomInfo?.name ?? storefront.locationName ?? null
  const address: string | null = storefront.showroomInfo?.address ?? null
  const phone: string | null = storefront.showroomInfo?.phone ?? null
  const hours = storefront.hours ?? null
  const mapApiKey: string | null =
    storefront.mapApiKey ?? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? null
  const directionsLink: string | null = storefront.showroomCtas?.directionsLink ?? null

  return (
    <>
      <BackToSchoolHero storeslug={storeslug} locationName={locationName} hours={hours} />

      <VisitSection
        locationName={locationName}
        address={address}
        phone={phone}
        hours={hours}
        mapApiKey={mapApiKey}
        directionsLink={directionsLink}
        storeslug={storeslug}
      />

      <OffersSection />

      <RebateSection
        data={rebates}
        locationName={locationName}
        hours={hours}
        storeslug={storeslug}
      />

      <TradeInBand phone={phone} />

      <HowItWorksStrip phone={phone} />

      <BookingSection
        locationName={locationName}
        hours={hours}
        storeslug={storeslug}
      />

      <DeadlineDock
        storeslug={storeslug}
        locationName={locationName}
        hours={hours}
      />
    </>
  )
}

export default async function BackToSchoolPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { storeslug } = await params

  return (
    <div className="bg-kawai-pearl">
      {/* One style block for the whole campaign — the type scale, the hero's
          entrance keyframes, and the scroll-reveal transitions. */}
      <CampaignStyles />
      <CampaignNoScript />
      <Suspense>
        <BackToSchoolContent storeslug={storeslug} />
      </Suspense>
    </div>
  )
}
