import type { SaleBadge, SaleContent, SaleLockup, SaleMoment, SalePromo, SaleStore } from '@/components/sale-template'
import { LOCATION_TOKEN } from '@/components/sale-template/store'
import { OFFER_CHIPS } from '@/lib/fall-promo/tokens'
import {
  bundle,
  coda,
  esRebatesFor,
  lessons,
  rebate,
  rebateCopyFor,
  valuePropsFor,
  CTA_LEAD_IN,
  PROGRAM_END,
} from '@/app/(frontend)/fall-financing/_components/campaign'
import { heroOpenerFor, heroSlides } from '@/app/(frontend)/fall-financing/_components/slides'
import { formatOfferPrice } from '@/app/(frontend)/fall-financing/_components/money'
import { REQUEST_LABEL } from '../holiday-sale-event/labels'
import { holidayFinancing } from './financing'
import { holidayStoreFor } from '../holiday-sale-event/store-inbox'

export { REQUEST_LABEL }

/**
 * BACKUP SNAPSHOT (kawai-holiday-sale-rep-edits v1, Nov 23, 2026). A frozen
 * copy of ../holiday-sale-event/_content.ts as it stood at c012653, before the
 * reps' edits, served at /store/<slug>/holiday-sale-eventv1. Do not edit to
 * follow the live page; the live page lives in ../holiday-sale-event.
 */

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
 *    Two exceptions, both this page's own and both leaving /fall-financing
 *    unchanged:
 *    - The financing promo (v2 edits, Chance, Nov 20, 2026) is the one line
 *      "0% financing on every model" from `./financing.ts`, with no lender,
 *      term or example fine print. It replaced this page's 36-month terms
 *      (Nov 19) on Chance's call.
 *    - The close's line (same edits) names the showroom: "Contact our
 *      showroom at <Location> for pricing and inventory." in place of the
 *      national CTA_LEAD_IN, then the rest of the national coda line.
 *
 * No holiday headline is ever put on the financing promo.
 */

/**
 * Chance's holiday headline set (comps, Nov 17, 2026), corrected spellings.
 *
 * v4 (Chance, #qa / card thread 1572326447140438136, 10:28 AM PT Nov 19,
 * 2026): "I don't like instrumental to holiday do instrumental to the
 * holidays". The close lockup now reads "Instrumental to the Holidays". The
 * brand tagline "Instrumental to Life" (TAGLINE) is unchanged.
 */
export const HEADLINES = {
  // v2 edits (Chance, voice 4:44–4:46 PM PT Nov 20, 2026, from Alexis's
  // email): the hero reads "Factory direct, Factory fresh." The second
  // "Factory" is the red script word; read in order it is the header as written.
  hero: { lead: 'Factory direct,', script: 'Factory', tail: 'fresh.', layout: 'stack' },
  played: { kicker: 'Some gifts get unwrapped', lead: 'This one gets', script: 'Played', layout: 'inline' },
  instrumental: { kicker: 'Instrumental to the', script: 'Holidays', layout: 'stack' },
  soundtrack: { lead: 'Make your soundtrack for the', script: 'Holidays', layout: 'stack' },
  sound: { kicker: 'Your holidays have photos', lead: 'Give them a', script: 'Sound', layout: 'inline' },
} as const satisfies Record<string, SaleLockup>

/**
 * The sale event. v3 added it (Chance, #qa / card thread 1572326447140438136,
 * 9:35 AM PT Nov 19, 2026); v5 moves its end date (same thread, 12:19 PM PT
 * Nov 19, 2026): "the dates should be to the 31st of december across site,
 * creatives, and meta copy sheet."
 *
 * The sale event now ends on the same day as the financing program, so both
 * lines are built from PROGRAM_END ("December 31, 2026", campaign.ts) rather
 * than retyped: the hero, the close and every offer spread can only ever show
 * one end date. Nothing here changes or restates a financing term; each
 * offer's own term, range and disclosure stay exactly as campaign.ts has them.
 */
export const SALE_EVENT = {
  label: 'Sale Event',
  offers: `Exclusive offers until ${PROGRAM_END}`,
  ends: `Sale event ends ${PROGRAM_END}.`,
} as const

/**
 * The hero badge (v4). Chance, same thread, 10:28 AM PT Nov 19, 2026: "Can we
 * redo the hero, too many words ... something cleaner for the graphics like
 * Limited Time “offer”". His words: "Limited Time" in sans caps, "Offer" as the
 * script word. A label, not an offer claim: the offers and their own terms
 * are the spreads below.
 */
export const HERO_BADGE = { lead: 'Limited Time', script: 'Offer' } as const satisfies SaleBadge

/**
 * The small eyebrow over the showroom name in the location band. Chance,
 * Nov 19, 2026: "update the landing page to say factory direct somewhere for
 * pianos (just subtle)". The v3 hero sub-line's wording, set as a label in
 * the band under the hero rather than back in the hero (v4: "too many words").
 */
export const FACTORY_DIRECT = 'Factory-direct Kawai Pianos'

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
    // v2 edits (Chance, Nov 20, 2026): one line, no lender/term fine print.
    heading: { kind: 'text', text: holidayFinancing.heading },
    ...(financingSlide
      ? { image: { src: financingSlide.image, alt: financingSlide.imageAlt } }
      : {}),
    note: holidayFinancing.dealerNote,
    cta: true,
    fineprint: [],
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

/**
 * The close's line (v2 edits, Chance, Nov 20, 2026): "Contact our showroom at
 * <Location> for pricing and inventory." in place of the national lead-in
 * ("Contact a dealer near you for pricing and inventory."), then the rest of
 * the national coda line, unchanged. `{location}` is filled per store by the
 * template (see `saleStoreFor`). CTA_LEAD_IN itself is not edited.
 */
const CODA_REST = coda.body.startsWith(CTA_LEAD_IN) ? coda.body.slice(CTA_LEAD_IN.length).trim() : ''
export const SHOWROOM_LEAD_IN = `Contact our showroom at ${LOCATION_TOKEN} for pricing and inventory.`
export const CLOSE_BODY = [SHOWROOM_LEAD_IN, CODA_REST].filter(Boolean).join(' ')

/**
 * The store for the template, with its place name pinned to this route's
 * fixed store map ("Dallas", "Houston", "Denver", "St. Louis", the same names
 * as the store inboxes). Any other slug keeps the storefront's location name.
 */
export function saleStoreFor(store: SaleStore): SaleStore {
  const fixed = holidayStoreFor(store.slug)
  return fixed ? { ...store, location: fixed.name } : store
}

/** The national value props' section ids → this page's section ids. */
const HIGHLIGHT_TARGET: Record<string, string> = {
  bundle: SECTION_IDS.bundle,
  financing: SECTION_IDS.financing,
  rebates: SECTION_IDS.rebates,
}

export const fallFinancingSale: SaleContent = {
  hero: {
    // v4, fewer words: badge → headline → one support line → the CTA pair.
    // The v3 sub-line ("Factory-direct Kawai Pianos / ready for their first
    // carol"), the separate "Sale Event" pill and the second date line under
    // the buttons are gone. The sale-event date stays as the one support line;
    // financing and the other offers keep their own dates in their spreads.
    badge: HERO_BADGE,
    lockup: HEADLINES.hero,
    support: SALE_EVENT.offers,
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
  locationEyebrow: FACTORY_DIRECT,
  promos,
  moments,
  // The close leads with the sale event too. v5: the sale event and the
  // offers now end on the same day (PROGRAM_END), so the close's red band and
  // the hero's support line carry the same date as every spread's own terms.
  // coda.heading ("Offers end December 31, 2026") stays off the close so the
  // band does not repeat itself. The body is the per-store showroom line.
  // v4: the close opens on a red band with the badge words and the sale's
  // end line, so it does not repeat the hero's line word for word.
  close: {
    eyebrow: `${HERO_BADGE.lead} ${HERO_BADGE.script}`,
    heading: SALE_EVENT.ends,
    body: CLOSE_BODY,
    lockup: HEADLINES.instrumental,
  },
  // The exact label already used by the showroom CTAs (src/components/ui/showroom-cta.tsx).
  callLabel: 'Call Now',
  // The lead-in is the national line that already sits above every enquiry
  // button on /fall-financing, imported, never retyped.
  cta: { requestLabel: REQUEST_LABEL, leadIn: CTA_LEAD_IN },
  tagline: TAGLINE,
}
