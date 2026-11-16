import type { Metadata } from 'next'
import { getSite, getSiteUrl, getSiteAlternates } from '@/lib/site-context'
import {
  getCollectionArt,
  getFinancingEligibleProducts,
  getPromoCollections,
  getRebateModelArt,
} from '@/lib/payload/queries'
import { PromoStyles, PromoSideNav, PromoOfferDock } from '@/components/fall-promo'
import { Sh9BundleBlock } from '../../fall-financing/_components/Sh9BundleBlock'
import { FinancingBlock } from '../../fall-financing/_components/FinancingBlock'
import { AcousticRebateBlock } from '../../fall-financing/_components/AcousticRebateBlock'
import { EsRebateBlock } from '../../fall-financing/_components/EsRebateBlock'
import { DealerCinematic } from '../../fall-financing/_components/DealerCinematic'
import { LearningPartnersBlock } from '../../fall-financing/_components/LearningPartnersBlock'
import {
  acousticRebateModels,
  bundle,
  rebate,
  navSectionsFor,
  financingRanges,
  SECTION,
  CTA_LABEL_SHORT,
  CTA_LEAD_IN,
} from '../../fall-financing/_components/campaign'
import { SaleHero } from './SaleHero'
import { SaleStyles } from './SaleStyles'
import { BF_ACOUSTIC_STAGE, BF_BUNDLE_ART, BF_REBATE_STAGE, BF_SCENES } from './art'
import { SaleLeadProvider } from './SaleLeadProvider'
import { SALE_ENDING, SALE_META, SALE_PATH, type SaleVariant } from './sale'

/**
 * /black-friday and the standby /black-friday-ext.
 *
 * A clone of /fall-financing (page.tsx there) that imports its sections rather
 * than copying them, so the offers, prices, disclosures and the US/CA split
 * cannot drift between the three pages. /fall-financing itself is untouched.
 *
 * What differs: the hero's words (`SaleHero`), the metadata, the dock's
 * deadline, the lead attribution (`SaleLeadProvider`), and — redesign v2 — the
 * look: the `promo-bf` theme (`SaleStyles`) and the photographs (`art.ts`),
 * passed to the shared sections as optional props they default without. Everything else,
 * including which offers render on which site, is the fall-financing logic
 * verbatim: Synchrony financing on kawaius.com only, the acoustic rebate on
 * ca.kawaius.com only, CAD prices from `getPromoCollections(…, 'cad')`.
 */
export async function saleMetadata(variant: SaleVariant): Promise<Metadata> {
  const site = await getSite()
  const { title, description } = SALE_META[variant][site]
  const path = SALE_PATH[variant]
  const url = `${getSiteUrl(site)}${path}`

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: getSiteAlternates(path),
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

export async function SalePage({ variant }: { variant: SaleVariant }) {
  const site = await getSite()

  // The same two flags as /fall-financing: exactly one acoustic offer per site.
  const showFinancing = site === 'us'
  const showAcoustic = site === 'cad'

  const [financingData, bundleGroups, rebateGroups, rangeArt, acousticArt] = await Promise.all([
    showFinancing ? getFinancingEligibleProducts() : Promise.resolve([]),
    // Priced for the site: CAD from the CA store on ca.kawaius.com.
    getPromoCollections(bundle.collections, site),
    getPromoCollections([rebate.collectionHandle], site),
    showFinancing
      ? getCollectionArt(financingRanges.map((r) => r.handle))
      : Promise.resolve({} as Record<string, string>),
    showAcoustic
      ? getRebateModelArt(acousticRebateModels)
      : Promise.resolve({} as Awaited<ReturnType<typeof getRebateModelArt>>),
  ])

  const bundleTabs = bundleGroups
    .map((g) => {
      const allowed = bundle.modelFilter[g.handle]
      return allowed ? { ...g, products: g.products.filter((p) => allowed.test(p.model)) } : g
    })
    .filter((g) => g.products.length > 0)

  // Server-side only, and the same switch /fall-financing reads, so staging
  // puts every campaign form into test mode together.
  const testMode = process.env.FALL_FINANCING_TEST_MODE === 'true'
  const ending = SALE_ENDING[variant]

  return (
    <div className="promo promo-a promo-bf">
      <PromoStyles />
      <SaleStyles />

      <SaleLeadProvider testMode={testMode}>
        <SaleHero site={site} variant={variant} />
        <Sh9BundleBlock groups={bundleTabs} art={BF_BUNDLE_ART} />
        {showFinancing && <FinancingBlock data={financingData} rangeArt={rangeArt} />}
        {showAcoustic && <AcousticRebateBlock art={acousticArt} stage={BF_ACOUSTIC_STAGE} />}
        <EsRebateBlock
          products={rebateGroups[0]?.products ?? []}
          site={site}
          stage={BF_REBATE_STAGE}
        />
        <LearningPartnersBlock />
        <DealerCinematic images={BF_SCENES} />

        <PromoSideNav sections={navSectionsFor(site)} />

        <PromoOfferDock
          endsOn={ending.iso}
          endsLabel={ending.short}
          label={CTA_LABEL_SHORT}
          ariaLabel={`${CTA_LABEL_SHORT} — ${CTA_LEAD_IN}`}
          afterId={SECTION.bundle}
          beforeId={SECTION.disclosures}
        />
      </SaleLeadProvider>
    </div>
  )
}
