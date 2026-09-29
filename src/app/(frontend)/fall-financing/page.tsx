import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getSite, getSiteUrl } from '@/lib/site-context'
import { getFinancingEligibleProducts, getPromoCollections } from '@/lib/payload/queries'
import { FinancingLeadProvider } from './_components/FinancingLeadProvider'
import { PromoStyles } from './_components/PromoStyles'
import { PromoHero } from './_components/PromoHero'
import { Sh9BundleBlock } from './_components/Sh9BundleBlock'
import { FinancingBlock } from './_components/FinancingBlock'
import { EsRebateBlock } from './_components/EsRebateBlock'
import { DealerBlock, QuestionsBlock, DisclosuresBlock } from './_components/CloseBlocks'
import { bundle, rebate, INTRO_APR, PROGRAM_END, TERMS_SENTENCE } from './_components/campaign'

export const revalidate = 3600

const TITLE = 'Kawai piano offers: 0% financing, free SH-9 headphones, ES rebates'
const DESCRIPTION =
  `Three Kawai offers through ${PROGRAM_END}: ${INTRO_APR} financing for 24 months on acoustic ` +
  `grands and uprights, a free pair of SH-9 headphones with every CN or CA Series digital, and ` +
  `up to $150 off ES Series portables. ${TERMS_SENTENCE}`

export async function generateMetadata(): Promise<Metadata> {
  // Always the US URL: these are US-market promotions, so there is no CA
  // counterpart to declare an alternate for. A self-referencing canonical with
  // no hreflang languages is the correct shape when a page has no sibling —
  // inventing an en-CA alternate would point Google at a 404.
  const url = `${getSiteUrl('us')}/fall-financing`

  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      siteName: 'KAWAI',
      title: TITLE,
      description: DESCRIPTION,
      images: [
        {
          url: '/images/banners/GX-7-BLAK-grand-styling.webp',
          width: 1200,
          height: 630,
          alt: 'Kawai GX-7 grand piano',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: TITLE,
      description: DESCRIPTION,
      images: ['/images/banners/GX-7-BLAK-grand-styling.webp'],
    },
  }
}

/**
 * /fall-financing — Kawai's three Q4 2026 consumer offers, and the destination
 * for the "Click here for details" link on the banner ads.
 *
 * One block per promotion, in the order a shopper is most likely to want them:
 * the headphone bundle on digitals, financing on acoustics, the ES rebate on
 * portables. Each block opens by naming the instruments it covers, because the
 * three offers are unrelated and a reader wants exactly one of them — which is
 * also why the hero is an index rather than a pitch.
 *
 * The source material is dealer trade bulletins. It is rewritten here for the
 * person buying the piano: the 50/50 shared-cost arrangement, the reimbursement
 * terms and the dealer participation form are all absent, because none of them
 * changes what a shopper pays.
 *
 * Copy lives in `_components/campaign.ts`; financing figures are formatted from
 * `@/lib/financing/terms` and the payment arithmetic is pinned by test to the
 * lender's worked example, so no figure on the page can drift from the
 * disclosures at its foot.
 */
export default async function FallFinancingPage() {
  const site = await getSite()

  // USA only. ca.kawaius.com must not serve a page quoting a US lender's credit
  // terms and USD prices to Canadian visitors, so the route does not exist there.
  if (site === 'cad') notFound()

  const [financingData, bundleGroups, rebateGroups] = await Promise.all([
    getFinancingEligibleProducts(),
    getPromoCollections(bundle.collections),
    getPromoCollections([rebate.collectionHandle]),
  ])

  // Server-side only — the browser cannot turn staging mode on or off.
  const testMode = process.env.FALL_FINANCING_TEST_MODE === 'true'

  return (
    <div className="q4 bg-[color:var(--paper)]">
      <PromoStyles />

      <FinancingLeadProvider testMode={testMode}>
        <PromoHero />
        <Sh9BundleBlock groups={bundleGroups} />
        <FinancingBlock data={financingData} />
        <EsRebateBlock products={rebateGroups[0]?.products ?? []} />
        <DealerBlock />
        <QuestionsBlock />
        <DisclosuresBlock />
      </FinancingLeadProvider>
    </div>
  )
}
