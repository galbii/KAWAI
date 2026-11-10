import type { SaleContent, SalePromo } from '@/components/sale-template'
import { OFFER_CHIPS } from '@/lib/fall-promo/tokens'
import {
  bundle,
  coda,
  disclosures,
  esRebatesFor,
  financing,
  lessons,
  rebate,
  rebateCopyFor,
  valuePropsFor,
  PROGRAM_END,
} from '@/app/(frontend)/fall-financing/_components/campaign'
import { heroOpenerFor, heroSlides } from '@/app/(frontend)/fall-financing/_components/slides'
import { formatOfferPrice } from '@/app/(frontend)/fall-financing/_components/money'

/**
 * The Fall Financing campaign, mapped into the store sale template.
 *
 * Every word is imported from the national page's copy files — `campaign.ts`
 * ("Every word on the Q4 page, in one file.") and `slides.ts` — and none is
 * retyped here. Only design and structure change (Chance, Nov 10, 2026). The
 * store pages run on kawaius.com only, so this is the US set: the copy differs
 * by site, never by store.
 *
 * The financing promo keeps its regulated shape: the headline lockup, the terms
 * subhead directly under it, and the Supporting Disclosure (lender terms, the
 * `*` worked example, the `**` exclusions) as visible text in the same card.
 */

const opener = heroOpenerFor('us')
const financingSlide = heroSlides.find((s) => s.id === 'financing')

/** "Fall for a Kawai" → "Fall for a" + the red italic accent "Kawai". */
function splitTitle(title: string): { lead: string; accent: string } {
  const at = title.lastIndexOf(' ')
  return at > 0 ? { lead: title.slice(0, at), accent: title.slice(at + 1) } : { lead: title, accent: '' }
}

const title = splitTitle(opener.title)
const rebateCopy = rebateCopyFor('us')

const SECTION_IDS = {
  bundle: 'headphones',
  financing: 'financing',
  rebates: 'rebates',
  lessons: 'lessons',
} as const

const promos: SalePromo[] = [
  {
    id: SECTION_IDS.bundle,
    eyebrow: `Through ${PROGRAM_END}`,
    heading: { kind: 'text', text: bundle.heading },
    body: bundle.standfirst,
    image: { src: bundle.stageImage, alt: bundle.stageImageAlt, position: 'center 78%' },
    note: bundle.dealerNote,
    fineprint: [bundle.disclaimer],
  },
  {
    id: SECTION_IDS.financing,
    eyebrow: OFFER_CHIPS.financing,
    heading: {
      kind: 'lockup',
      lead: financing.heading.lead,
      connector: financing.heading.connector,
      apr: financing.heading.apr,
      subhead: financing.subhead,
    },
    ...(financingSlide
      ? { image: { src: financingSlide.image, alt: financingSlide.imageAlt } }
      : {}),
    note: financing.dealerNote,
    fineprint: [...disclosures.financingTerms, disclosures.financingExample, disclosures.exclusions],
    fineprintId: 'disclosures',
  },
  {
    id: SECTION_IDS.rebates,
    eyebrow: OFFER_CHIPS.rebates,
    heading: { kind: 'text', text: rebateCopy.heading },
    body: rebate.standfirst,
    image: { src: rebate.stageImage, alt: rebate.stageImageAlt },
    rows: esRebatesFor('us').map((r) => ({
      label: r.model,
      value: `Save ${formatOfferPrice(r.rebate, r.currency)}`,
      note: r.finishes,
    })),
    note: rebate.dealerNote,
    fineprint: [rebateCopy.disclaimer],
  },
  {
    id: SECTION_IDS.lessons,
    eyebrow: lessons.eyebrow,
    heading: { kind: 'text', text: lessons.heading },
    body: lessons.standfirst,
    image: { src: lessons.stageImage, alt: lessons.stageImageAlt },
    note: lessons.redeemNote,
    link: { label: lessons.redeemLabel, href: lessons.redeemHref },
    fineprint: [lessons.disclaimer],
  },
]

/** The national value props' section ids → this page's section ids. */
const HIGHLIGHT_TARGET: Record<string, string> = {
  bundle: SECTION_IDS.bundle,
  financing: SECTION_IDS.financing,
  rebates: SECTION_IDS.rebates,
}

export const fallFinancingSale: SaleContent = {
  hero: {
    titleLead: title.lead,
    titleAccent: title.accent,
    body: opener.body ?? '',
    ending: `Offers end ${PROGRAM_END}.`,
    image: opener.image,
    imageAlt: opener.imageAlt,
  },
  highlights: valuePropsFor('us').map((v) => ({
    label: OFFER_CHIPS[v.offer],
    detail: v.detail,
    href: `#${HIGHLIGHT_TARGET[v.offer] ?? v.sectionId}`,
  })),
  promos,
  close: { eyebrow: coda.eyebrow, heading: coda.heading, body: coda.body },
  // The exact label already used by the showroom CTAs (src/components/ui/showroom-cta.tsx).
  callLabel: 'Call Now',
}
