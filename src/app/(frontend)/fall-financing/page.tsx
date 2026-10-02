import type { Metadata } from 'next'
import { getSite, getSiteUrl, getSiteAlternates } from '@/lib/site-context'
import {
  getCollectionArt,
  getFinancingEligibleProducts,
  getPromoCollections,
  getRebateModelArt,
} from '@/lib/payload/queries'
import { FinancingLeadProvider } from './_components/FinancingLeadProvider'
import { PromoStyles, PromoSideNav, PromoOfferDock } from '@/components/fall-promo'
import { PromoHero } from './_components/PromoHero'
import { Sh9BundleBlock } from './_components/Sh9BundleBlock'
import { FinancingBlock } from './_components/FinancingBlock'
import { AcousticRebateBlock } from './_components/AcousticRebateBlock'
import { EsRebateBlock } from './_components/EsRebateBlock'
import { DealerCinematic } from './_components/DealerCinematic'
import {
  acousticRebateModels,
  bundle,
  rebate,
  navSectionsFor,
  financingRanges,
  SECTION,
  CTA_LABEL_SHORT,
  CTA_LEAD_IN,
  INTRO_APR,
  PROGRAM_END,
  PROGRAM_END_ISO,
  PROGRAM_END_SHORT,
  TERMS_SENTENCE,
} from './_components/campaign'

export const revalidate = 3600

/**
 * Title and description per site.
 *
 * The financing offer is USA-only, so CA's metadata must not mention it — §4.5
 * of the developer requirements explicitly reaches page titles, meta
 * descriptions, alt text and OG preview text, and the safest way to satisfy a
 * rule about how an offer is described is not to describe it at all where it
 * does not run.
 */
const META = {
  us: {
    title: 'Kawai piano offers: 0% financing, free SH-9 headphones, ES rebates',
    description:
      `Three Kawai offers through ${PROGRAM_END}: ${INTRO_APR} financing for 24 months on ` +
      `acoustic grands and uprights, a free pair of SH-9 headphones with every CN or CA Series ` +
      `digital, and up to $150 off ES Series portables. ${TERMS_SENTENCE}`,
  },
  cad: {
    title: 'Kawai piano offers: free SH-9 headphones and ES Series rebates',
    description:
      `Two Kawai offers through ${PROGRAM_END}: a free pair of SH-9 headphones with every ` +
      `qualifying CN or CA Series digital piano, and instant rebates on ES Series portables at ` +
      `your Authorized Kawai dealer.`,
  },
} as const

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()
  const { title, description } = META[site]

  // The page now exists on both domains — the offers inside it differ, not the
  // route — so the canonical is self-referencing and both hreflang alternates
  // are real. It used to hardcode the US URL because ca.kawaius.com 404'd here.
  const url = `${getSiteUrl(site)}/fall-financing`

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: getSiteAlternates('/fall-financing'),
    },
    openGraph: {
      type: 'website',
      url,
      siteName: 'KAWAI',
      title,
      description,
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
      title,
      description,
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

  /**
   * The Synchrony offer is USA-only, so it is filtered out of ca.kawaius.com
   * rather than the whole route 404ing there.
   *
   * The page used to `notFound()` on CA because everything in it was
   * US-market. The bundle and the ES rebates now run in Canada too —
   * `esRebatesFor(site)` carries the CAD amounts — so what is US-only is this
   * one offer, and this one flag removes all of it: the block, the Supporting
   * Disclosure that exists to serve it, its hero slide, its rail anchor and
   * its metadata. Nothing on the Canadian page may quote a US lender's credit
   * terms.
   */
  const showFinancing = site === 'us'

  /**
   * Canada's acoustic offer, which exists because the US one cannot cross the
   * border. The two are mutually exclusive by construction: `showFinancing` and
   * `showAcoustic` are the same boolean read both ways, so the page always has
   * exactly one acoustic offer and never two or none.
   */
  const showAcoustic = site === 'cad'

  const [financingData, bundleGroups, rebateGroups, rangeArt, acousticArt] = await Promise.all([
    // Skipped entirely on CA — no point querying for a section that will not
    // render, and an empty result is the correct shape if it somehow does.
    showFinancing ? getFinancingEligibleProducts() : Promise.resolve([]),
    getPromoCollections(bundle.collections),
    getPromoCollections([rebate.collectionHandle]),
    // Showcase art for the financing carousel. A range with no art is dropped
    // by FinancingBlock rather than rendered as an empty tile.
    showFinancing
      ? getCollectionArt(financingRanges.map((r) => r.handle))
      : Promise.resolve({} as Record<string, string>),
    // CA only. A model with no catalogue entry is simply missing from the map
    // and the ledger falls back to a placeholder — ND-21 has no product record
    // yet, and the rebate is real whether or not the catalogue has caught up.
    showAcoustic
      ? getRebateModelArt(acousticRebateModels)
      : Promise.resolve({} as Awaited<ReturnType<typeof getRebateModelArt>>),
  ])

  // Server-side only — the browser cannot turn staging mode on or off.
  const testMode = process.env.FALL_FINANCING_TEST_MODE === 'true'

  return (
    <div className="promo promo-a">
      <PromoStyles />

      <FinancingLeadProvider testMode={testMode}>
        <PromoHero site={site} />
        <Sh9BundleBlock groups={bundleGroups} />
        {/* US only. It quotes a US lender's credit terms and now carries
            the Supporting Disclosure that qualifies them, so the whole section
            is gated rather than just the query behind it. */}
        {showFinancing && <FinancingBlock data={financingData} rangeArt={rangeArt} />}
        {/* CA's acoustic offer, in the slot the US financing block occupies —
            both cover new acoustic grands and uprights, and a visitor should
            meet one where the other visitor meets the other. */}
        {showAcoustic && <AcousticRebateBlock art={acousticArt} />}
        {/* Last of the three offers, and the last thing that is still an
            offer — the cinematic close follows it. `site` picks the currency:
            USD on kawaius.com, CAD on ca.kawaius.com. */}
        <EsRebateBlock products={rebateGroups[0]?.products ?? []} site={site} />
        <DealerCinematic />

        {/* Inside `.promo`, and it has to be: the rail paints itself from the
            variation's semantic tokens, which resolve from its DOM parent
            rather than from where `position: fixed` puts it on screen. */}
        <PromoSideNav sections={navSectionsFor(site)} />

        {/* The corner pill. It opens the same modal as every PromoButton —
            same provider, same config — and runs from the first offer to the
            disclosure, which is the one part of the page an urgency pill has no
            business sitting over. On ca.kawaius.com there is no disclosure, so
            the dock's own fallback carries it to the end of the page.

            `ariaLabel` because this is the one CTA on the page with no lead-in
            sentence beside it: "Sign Up Now" in a bare pill is a verb with no
            object. The visible label stays short and the accessible name says
            what the page's other buttons get from the copy above them. */}
        <PromoOfferDock
          endsOn={PROGRAM_END_ISO}
          endsLabel={PROGRAM_END_SHORT}
          label={CTA_LABEL_SHORT}
          ariaLabel={`${CTA_LABEL_SHORT} — ${CTA_LEAD_IN}`}
          afterId={SECTION.bundle}
          beforeId={SECTION.disclosures}
        />
      </FinancingLeadProvider>
    </div>
  )
}
