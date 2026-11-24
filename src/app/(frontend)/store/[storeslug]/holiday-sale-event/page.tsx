import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getStorefrontBySlugDirect } from '@/lib/payload/queries'
import { getSite, getSiteUrl } from '@/lib/site-context'
import { SaleTemplate, lockupText, toSaleStore } from '@/components/sale-template'
import { fallFinancingSale, saleStoreFor, META_DESCRIPTION } from './_content'
import { StoreLeadProvider } from './StoreLeadProvider'
import { STORE_SALE_PATH } from './sale-path'

// getSite() reads headers() so the route can 404 on the CA host (US Synchrony
// terms must not render on ca.kawaius.com). That is incompatible with
// generateStaticParams + revalidate ISR: on `next start` Next throws
// DYNAMIC_SERVER_USAGE and the page 500s. Same pattern as
// /store/[storeslug]/university (force-dynamic). The contact page got there
// by dropping generateStaticParams instead.
export const dynamic = 'force-dynamic'

interface Params {
  storeslug: string
}

/**
 * /store/[storeslug]/holiday-sale-event — one store's holiday sale-event
 * landing page for the Fall Financing offers, on the store sale template
 * (kawai-holiday-financing-landing, Nov 17, 2026: white field, heavy display
 * serif, Kawai red script, image-led spreads; see SaleTemplate.tsx).
 *
 * Sits beside the national /fall-financing (the banner-ad destination), which
 * is untouched: the two routes share no UI components, only copy (this
 * route's `_content.ts` imports the terms, rates and disclosures from the
 * national campaign.ts). Standalone: nothing on a store homepage or nav links
 * here yet.
 *
 * Store data stays dynamic: `getStorefrontBySlugDirect` + `toSaleStore` read
 * the name, address, phone, hours, directions and booking link from the
 * storefront record on every request.
 *
 * Moved here from /store/[storeslug]/fall-financing in v6 (Nov 19, 2026;
 * Chance asked for "store/[slug]/holdiay-sale-event", read as holiday). The
 * old path is a permanent redirect in next.config.ts, so ads and links already
 * out keep landing here.
 *
 * Request Inventory (v2, Nov 19, 2026) opens the national page's dealer
 * enquiry form — same HubSpot form, fields and routing — through
 * `StoreLeadProvider`; see lead.ts. No new form and no new send path.
 *
 * US only. The promo set includes Synchrony financing, which must never render
 * on ca.kawaius.com, so the route 404s there rather than filtering offers —
 * every active storefront today is a US gallery.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { storeslug } = await params
  const site = await getSite()
  if (site !== 'us') return {}
  const storefront = await getStorefrontBySlugDirect(storeslug)
  if (!storefront) return {}

  const store = toSaleStore(storefront, storeslug)
  // The hero headline, attributed to the store, and (v1 rep edits, Nov 23,
  // 2026) the reps' factory-boxed headline as the description. No rate
  // figure: §4.5 reaches titles and meta descriptions.
  const title = `${lockupText(fallFinancingSale.hero.lockup)} | ${store.name}`
  const description = META_DESCRIPTION
  const url = `${getSiteUrl(site)}/store/${storeslug}/${STORE_SALE_PATH}`
  const image = fallFinancingSale.hero.image.src

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      siteName: 'KAWAI',
      title,
      description,
      images: [{ url: image, alt: fallFinancingSale.hero.image.alt }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}

export default async function StoreHolidaySaleEventPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { storeslug } = await params
  const site = await getSite()
  if (site !== 'us') notFound()

  const storefront = await getStorefrontBySlugDirect(storeslug)
  if (!storefront) notFound()

  // Server-side only — the browser cannot turn staging mode on or off. The
  // national page's own switch, so one setting dry-runs every enquiry form.
  const testMode = process.env.FALL_FINANCING_TEST_MODE === 'true'

  return (
    <StoreLeadProvider storeSlug={storeslug} testMode={testMode}>
      <SaleTemplate content={fallFinancingSale} store={saleStoreFor(toSaleStore(storefront, storeslug))} />
    </StoreLeadProvider>
  )
}
