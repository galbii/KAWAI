import type { SaleContent, SaleLockup, SaleMoment, SalePromo } from '@/components/sale-template'
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
  CTA_LEAD_IN,
  PROGRAM_END,
} from '@/app/(frontend)/fall-financing/_components/campaign'
import { heroOpenerFor, heroSlides } from '@/app/(frontend)/fall-financing/_components/slides'
import { formatOfferPrice } from '@/app/(frontend)/fall-financing/_components/money'
import { REQUEST_LABEL } from './labels'

export { REQUEST_LABEL }

/**
 * The store holiday landing page (kawai-holiday-financing-landing, Chance,
 * Nov 17, 2026), mapped into the store sale template.
 *
 * Two kinds of words live here, kept apart on purpose:
 *
 * 1. Store-only marketing headlines — the five holiday lockups from Chance's
 *    comps (`HEADLINES`). They are this page's own, so the national
 *    /fall-financing page (which reads campaign.ts / slides.ts directly) does
 *    not change. Spellings are the corrected ones: the source art read "Some
 *    gift get unwrapped" and "Make your soundrack for the"; the page says
 *    "Some gifts get unwrapped" and "Make your soundtrack for the".
 * 2. Everything else — every offer heading, standfirst, rate, term, dealer
 *    note and disclosure — is imported from the national copy files
 *    (`campaign.ts`, `slides.ts`, `money.ts`) and never retyped, so legal copy
 *    cannot drift. The store pages run on kawaius.com only, so this is the US
 *    set: the copy differs by site, never by store.
 *
 * The financing promo keeps its regulated shape: the headline lockup, the
 * terms subhead directly under it, and the Supporting Disclosure (lender
 * terms, the `*` worked example, the `**` exclusions) as visible text in the
 * same card. No holiday headline is ever put on it.
 */

/** Chance's holiday headline set (comps, Nov 17, 2026), corrected spellings. */
export const HEADLINES = {
  hero: { lead: 'Make the first note a', script: 'Holiday', tail: 'memory', layout: 'stack' },
  played: { kicker: 'Some gifts get unwrapped', lead: 'This one gets', script: 'Played', layout: 'inline' },
  instrumental: { kicker: 'Instrumental to', script: 'Holiday', layout: 'stack' },
  soundtrack: { lead: 'Make your soundtrack for the', script: 'Holidays', layout: 'stack' },
  sound: { kicker: 'Your holidays have photos', lead: 'Give them a', script: 'Sound', layout: 'inline' },
} as const satisfies Record<string, SaleLockup>

/** The hero sub-line under the primary lockup, one entry per line (comp). */
export const HERO_SUBLINE = ['Factory-direct Kawai Pianos', 'ready for their first carol'] as const

/** The brand line under the wordmark. */
export const TAGLINE = 'Instrumental to Life'

/**
 * Store-page photography. Real Kawai photographs already served on
 * kawaius.com under /images. The signature-series frames carry a burned-in
 * "Cabinet finish and bench style vary based on market region." caption at
 * the bottom right; the crops (object-position here, frame ratios in the
 * template) keep it out of view rather than editing the photograph.
 */
const ART = {
  heroRoom: {
    src: '/images/signature/pianos/gl-10/gl-10-detail.webp',
    alt: 'A black Kawai grand piano and bench in a bright white room with French doors',
    position: '20% center',
  },
  heroHands: {
    src: '/images/signature/pianos/gl-10/gl-10-hero.jpeg',
    alt: "A pianist's hands on the keys of a black Kawai grand piano",
  },
  played: {
    src: '/images/signature/pianos/gl-30/gl-30-secondary.webp',
    alt: 'A young girl playing a black Kawai grand piano',
    position: 'center 15%',
  },
  soundA: {
    src: '/images/gallery/CA701R-43 copy.webp',
    alt: 'A woman playing a Kawai CA Series digital piano at home',
  },
  soundB: {
    src: '/images/cx/hero_cx102.jpg',
    alt: 'A smiling woman playing a white Kawai digital piano in a bright living room',
    position: '30% center',
  },
  soundC: {
    src: '/images/gallery/KAWAI_CA401B-43 copy.webp',
    alt: 'A young pianist playing a black Kawai CA401 digital piano',
    position: '70% center',
  },
  soundtrack: {
    src: '/images/signature/pianos/gx-3/gx-3-secondary.webp',
    alt: 'A black Kawai grand piano by the windows of a white dining room set with flowers',
    position: 'center 35%',
  },
} as const

const opener = heroOpenerFor('us')
const financingSlide = heroSlides.find((s) => s.id === 'financing')
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
    cta: true,
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
    cta: true,
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
    cta: true,
    fineprint: [rebateCopy.disclaimer],
  },
  {
    id: SECTION_IDS.lessons,
    eyebrow: lessons.eyebrow,
    heading: { kind: 'text', text: lessons.heading },
    body: lessons.standfirst,
    // The partners' logo strip (~3.9:1): shown whole, never cropped.
    image: { src: lessons.stageImage, alt: lessons.stageImageAlt, shape: 'banner' },
    note: lessons.redeemNote,
    link: { label: lessons.redeemLabel, href: lessons.redeemHref },
    fineprint: [lessons.disclaimer],
  },
]

/**
 * The holiday moments between spreads. None sits before the financing spread,
 * so no marketing headline is ever read as part of the credit advertisement.
 */
const moments: SaleMoment[] = [
  { id: 'played', before: SECTION_IDS.bundle, layout: 'feature', lockup: HEADLINES.played, images: [ART.played] },
  {
    id: 'sound',
    before: SECTION_IDS.rebates,
    layout: 'gallery',
    lockup: HEADLINES.sound,
    images: [ART.soundA, ART.soundB, ART.soundC],
  },
  {
    id: 'soundtrack',
    before: SECTION_IDS.lessons,
    layout: 'band',
    lockup: HEADLINES.soundtrack,
    images: [ART.soundtrack],
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
    lockup: HEADLINES.hero,
    subline: HERO_SUBLINE,
    ending: `Offers end ${PROGRAM_END}.`,
    image: ART.heroRoom,
    inset: ART.heroHands,
  },
  // The national opener's body, now introducing the offer index.
  intro: opener.body ?? '',
  highlights: valuePropsFor('us').map((v) => ({
    label: OFFER_CHIPS[v.offer],
    detail: v.detail,
    href: `#${HIGHLIGHT_TARGET[v.offer] ?? v.sectionId}`,
  })),
  promos,
  moments,
  close: { eyebrow: coda.eyebrow, heading: coda.heading, body: coda.body, lockup: HEADLINES.instrumental },
  // The exact label already used by the showroom CTAs (src/components/ui/showroom-cta.tsx).
  callLabel: 'Call Now',
  // The lead-in is the national line that already sits above every enquiry
  // button on /fall-financing, imported, never retyped.
  cta: { requestLabel: REQUEST_LABEL, leadIn: CTA_LEAD_IN },
  tagline: TAGLINE,
}
