import type { Metadata } from 'next'
import { getSite, getSiteAlternates, getSiteName, getSiteUrl } from '@/lib/site-context'
import { SaleTemplate } from '@/components/sale-template'
import { HolidayLeadProvider } from './HolidayLeadProvider'
import { holidaySaleFor, HOLIDAY_META } from './_content'
import { HOLIDAY_SALE_PATH } from './sale-path'

// getSite() reads headers() to pick the site's offers, so this page cannot be ISR.
export const dynamic = 'force-dynamic'

const OG_IMAGE = '/images/signature/pianos/gl-10/gl-10-detail.webp'

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()
  const { title, description } = HOLIDAY_META[site]
  const url = `${getSiteUrl(site)}${HOLIDAY_SALE_PATH}`

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: getSiteAlternates(HOLIDAY_SALE_PATH),
    },
    openGraph: {
      type: 'website',
      url,
      siteName: getSiteName(site),
      title,
      description,
      images: [{ url: OG_IMAGE, alt: 'A black Kawai grand piano and bench in a bright white room' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE],
    },
  }
}

/**
 * /holiday-sale-event — the national holiday sale page
 * (kawai-holiday-sale-national v1, Nov 24, 2026): the store backup page
 * (/store/<slug>/holiday-sale-eventv1) without a store.
 *
 * Same sale template, rendered with no store: no store name, location band,
 * map, Call Now or Schedule Visit. Request Inventory opens the national
 * /fall-financing enquiry (ZIP → nearest dealer's RSM, see ./lead.ts).
 *
 * Both sites. The US page carries the compliant Synchrony financing spread
 * and its Supporting Disclosure; ca.kawaius.com carries no financing at all,
 * with Canada's acoustic rebate in its place (see ./_content.ts).
 */
export default async function HolidaySaleEventPage() {
  const site = await getSite()

  // Server-side only: the browser cannot turn the dry run on or off.
  const testMode = process.env.FALL_FINANCING_TEST_MODE === 'true'

  return (
    <HolidayLeadProvider testMode={testMode}>
      <SaleTemplate content={holidaySaleFor(site)} />
    </HolidayLeadProvider>
  )
}
