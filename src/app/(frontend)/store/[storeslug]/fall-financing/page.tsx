import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getActiveStorefrontSlugs, getStorefrontBySlugDirect } from '@/lib/payload/queries'
import { getSite, getSiteUrl } from '@/lib/site-context'
import { SaleTemplate, toSaleStore } from '@/components/sale-template'
import { fallFinancingSale } from './_content'

export const revalidate = 3600

interface Params {
  storeslug: string
}

/**
 * /store/[storeslug]/fall-financing — the Fall Financing offers as one store's
 * sale page, on the reusable sale template.
 *
 * Sits beside the national /fall-financing (the banner-ad destination), which
 * is untouched. Standalone: nothing on a store homepage or nav links here yet.
 *
 * US only. The promo set includes Synchrony financing, which must never render
 * on ca.kawaius.com, so the route 404s there rather than filtering offers —
 * every active storefront today is a US gallery.
 */
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
  const site = await getSite()
  if (site !== 'us') return {}
  const storefront = await getStorefrontBySlugDirect(storeslug)
  if (!storefront) return {}

  const store = toSaleStore(storefront, storeslug)
  // The hero's own words (slides.ts opener), attributed to the store. No new
  // copy, and no rate figure: §4.5 reaches titles and meta descriptions.
  const title = `${fallFinancingSale.hero.titleLead} ${fallFinancingSale.hero.titleAccent} | ${store.name}`
  const description = fallFinancingSale.hero.body
  const url = `${getSiteUrl(site)}/store/${storeslug}/fall-financing`
  const image = fallFinancingSale.hero.image

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
      images: [{ url: image, alt: fallFinancingSale.hero.imageAlt }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}

export default async function StoreFallFinancingPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { storeslug } = await params
  const site = await getSite()
  if (site !== 'us') notFound()

  const storefront = await getStorefrontBySlugDirect(storeslug)
  if (!storefront) notFound()

  return <SaleTemplate content={fallFinancingSale} store={toSaleStore(storefront, storeslug)} />
}
