import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import {
  getStorefrontBySlugDirect,
  getActiveStorefrontSlugs,
  getRebateShowcase,
} from '@/lib/payload/queries'
import { getSite, getSiteUrl } from '@/lib/site-context'
import {
  BackToSchoolHero,
  SimpleHeroCtas,
  StoreAndOffers,
  SimpleBookingSection,
  CampaignStyles,
  CampaignNoScript,
} from '@/components/back-to-school'
import { DATE_RANGE, DEADLINE_LONG } from '@/components/back-to-school/campaign'

/**
 * Back to School, stripped to the conversion.
 *
 * Three blocks: the poster, one screen that answers "where is this and what
 * comes off the price", and the booking form. The rebate ledger — the longest
 * thing on the original page and the one a visitor is most likely to want —
 * opens in a dialog from either place it is offered, so checking a price never
 * costs the visitor their place on the page.
 *
 * The sections it does NOT have are the point: the offers restated at
 * paragraph length, the trade-in band and its three how-to-claim steps, a
 * closing panel that restates the offers again, and a floating dock that
 * restates the deadline. All of it argued a case the numbers in the hero rail
 * had already made, and all of it sat between the visitor and the form.
 *
 * Everything is drawn in the same campaign language as /back-to-school
 * (RuledGround, SectionHead, Reveal, the bts-* type scale) and books through
 * the same server action, so a booking from either page is indistinguishable
 * downstream.
 */

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
  const path = `/store/${storeslug}/back-to-school2`

  const locationName: string =
    storefront.showroomInfo?.name ?? storefront.locationName ?? 'Our Showroom'
  const city = (storefront.address?.city as string | undefined) ?? ''

  return {
    title: `Back to School Piano Sale — Instant Rebates Through ${DEADLINE_LONG} | ${locationName}`,
    description: `Instant rebates up to $4,500 on new Kawai pianos at ${locationName}${
      city ? ` in ${city}` : ''
    }, plus 0% financing for 36 months and $500 over any trade-in appraisal. ${DATE_RANGE}.`,
    // This is a second treatment of a page that is already live and indexed at
    // /back-to-school. Left indexable the two would compete for the same query
    // and split the campaign's authority, so the canonical points at the
    // original and this one stays out of the index entirely.
    robots: { index: false, follow: true },
    alternates: {
      canonical: `${siteUrl}/store/${storeslug}/back-to-school`,
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
      <BackToSchoolHero
        storeslug={storeslug}
        locationName={locationName}
        hours={hours}
        ctas={<SimpleHeroCtas rebates={rebates} locationName={locationName} />}
      />

      <StoreAndOffers
        locationName={locationName}
        address={address}
        phone={phone}
        hours={hours}
        mapApiKey={mapApiKey}
        directionsLink={directionsLink}
        rebates={rebates}
      />

      <SimpleBookingSection
        storeslug={storeslug}
        locationName={locationName}
        hours={hours}
      />
    </>
  )
}

export default async function BackToSchool2Page({
  params,
}: {
  params: Promise<Params>
}) {
  const { storeslug } = await params

  return (
    <div className="bg-kawai-pearl">
      {/* One style block for the whole campaign — the type scale, the hero's
          entrance keyframes, the scroll-reveal transitions, and the dialogs. */}
      <CampaignStyles />
      <CampaignNoScript />
      <Suspense>
        <BackToSchoolContent storeslug={storeslug} />
      </Suspense>
    </div>
  )
}
