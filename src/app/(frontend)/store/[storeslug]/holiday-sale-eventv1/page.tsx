import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getStorefrontBySlugDirect } from '@/lib/payload/queries'
import { getSite, getSiteUrl } from '@/lib/site-context'
import { SaleTemplate, lockupText, toSaleStore } from '@/components/sale-template'
import { StoreLeadProvider } from '../holiday-sale-event/StoreLeadProvider'
import { fallFinancingSale, saleStoreFor } from './_content'
import { BACKUP_STORE_SALE_PATH } from './sale-path'

// Same reason as the live route: getSite() reads headers() for the US-only 404.
export const dynamic = 'force-dynamic'

interface Params {
  storeslug: string
}

/**
 * /store/[storeslug]/holiday-sale-eventv1 — the backup copy of the store
 * holiday sale page as it stood before the reps' edits
 * (kawai-holiday-sale-rep-edits v1, Chance relayed by Marcy, Nov 23, 2026:
 * "Before any edits, save a backup copy of the current page at
 * store/slug/holiday-sale-eventv1").
 *
 * It renders the c012653 page (hero, three-card offer strip, the holiday
 * banners, SH-9 bundle, ES rebate, lessons, financing with the dealer line,
 * close) from its own frozen `_content.ts` + `financing.ts`, through the same
 * sale template and the same Request Inventory form as the live page.
 *
 * An archive URL, same pattern family as /back-to-school2 and /signature2: not
 * in sitemap.ts, not a redirect target, and the live page's canonical does not
 * point here. Same US-only storefront slug lookup as the live page, so only
 * real store slugs resolve; anything else 404s.
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
  const title = `${lockupText(fallFinancingSale.hero.lockup)} | ${store.name}`
  const description = fallFinancingSale.intro
  const url = `${getSiteUrl(site)}/store/${storeslug}/${BACKUP_STORE_SALE_PATH}`

  return {
    title,
    description,
    alternates: { canonical: url },
  }
}

export default async function StoreHolidaySaleEventBackupPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { storeslug } = await params
  const site = await getSite()
  if (site !== 'us') notFound()

  const storefront = await getStorefrontBySlugDirect(storeslug)
  if (!storefront) notFound()

  // Same server-side dry-run switch as the live page.
  const testMode = process.env.FALL_FINANCING_TEST_MODE === 'true'

  return (
    <StoreLeadProvider storeSlug={storeslug} testMode={testMode}>
      <SaleTemplate content={fallFinancingSale} store={saleStoreFor(toSaleStore(storefront, storeslug))} />
    </StoreLeadProvider>
  )
}
