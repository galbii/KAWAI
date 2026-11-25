import type { SaleBadge, SaleContent, SaleLockup, SaleMoment, SalePromo } from '@/components/sale-template'
import { OFFER_CHIPS } from '@/lib/fall-promo/tokens'
import {
  acousticRebate,
  acousticRebates,
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
  SECTION,
} from '@/app/(frontend)/fall-financing/_components/campaign'
import { heroOpenerFor } from '@/app/(frontend)/fall-financing/_components/slides'
import { formatOfferPrice } from '@/app/(frontend)/fall-financing/_components/money'
import { REQUEST_LABEL } from '@/app/(frontend)/store/[storeslug]/holiday-sale-event/labels'

export { REQUEST_LABEL }

/** The line under every Request Inventory pair on this page (not the phone bar). */
export const CTA_NOTE = 'Submit a form to find out about availability!'

type Site = 'us' | 'cad'

/**
 * The national holiday sale page, /holiday-sale-event (kawai-holiday-sale-
 * national v1, Nov 24, 2026). The user: "can you copy the
 * /store/[]/holiday-sale-eventv1 to /holiday-sale-event?"
 *
 * A self-contained copy of the store backup page's content
 * (store/[storeslug]/holiday-sale-eventv1/_content.ts), adapted for a page
 * that belongs to no store. It imports nothing from that folder, so the
 * frozen backup and this page can never move together by accident.
 *
 * What differs from v1, all on the user's calls (brief.md, Decisions):
 *
 * - No store anywhere: no `{location}` placeholder, no showroom line, no
 *   location band eyebrow. The close points to "your nearest Authorized Kawai
 *   dealer", and the form routes ZIP → nearest RSM like /fall-financing.
 * - The hero leads with the sale-event line ("Holiday Sale Event" /
 *   "Exclusive offers until December 31, 2026"). v1's "Factory direct,
 *   Factory fresh." is not used on this page.
 * - US financing is the compliant /fall-financing credit advertisement, not
 *   v1's figure-free "0% financing on every model": the Synchrony lockup
 *   (`financing.heading` + `financing.subhead`, the template's regulated
 *   `lockup` heading) with the Supporting Disclosure (`disclosures`) as the
 *   spread's visible fine print, in the same section, so both footnote marks
 *   resolve on the page (§4.1–§4.4). Every word is imported from campaign.ts,
 *   never retyped.
 * - It runs on both sites. On ca.kawaius.com there is no financing at all;
 *   Canada's acoustic rebate takes its slot (CAD), and the ES rebates show
 *   CAD amounts with the Canadian disclaimer, as /fall-financing does.
 *
 * Every offer heading, standfirst, rate, term, dealer note and disclosure is
 * imported from the national copy files (`campaign.ts`, `slides.ts`,
 * `money.ts`), so legal copy cannot drift. Only the holiday lockups and the
 * sale-event lines are this page's own.
 */

/**
 * The holiday headline set (comps, Nov 17, 2026), as on the store pages, with
 * this page's own hero: "Holiday" in red script, "Sale Event" in the display
 * serif under it. Read in order it is "Holiday Sale Event".
 */
export const HEADLINES = {
  hero: { script: 'Holiday', tail: 'Sale Event', layout: 'stack' },
  // stackOnMobile (v2 polish): on phones the script drops under the serif
  // words instead of colliding with them.
  played: { kicker: 'Some gifts get unwrapped', lead: 'This one gets', script: 'Played', layout: 'inline', stackOnMobile: true },
  instrumental: { kicker: 'Instrumental to the', script: 'Holidays', layout: 'stack' },
  soundtrack: { lead: 'Make your soundtrack for the', script: 'Holidays', layout: 'stack' },
  sound: { kicker: 'Your holidays have photos', lead: 'Give them a', script: 'Sound', layout: 'inline', stackOnMobile: true },
} as const satisfies Record<string, SaleLockup>

/** The sale event's lines, built from PROGRAM_END so every date on the page is one date. */
export const SALE_EVENT = {
  name: 'Holiday Sale Event',
  offers: `Exclusive offers until ${PROGRAM_END}`,
  ends: `Sale event ends ${PROGRAM_END}.`,
} as const

/** The hero badge: a label, not an offer claim. National reads "Offers" (the user, Nov 25, 2026); the store pages keep "Offer". */
export const HERO_BADGE = { lead: 'Limited Time', script: 'Offers' } as const satisfies SaleBadge

/** The brand line under the wordmark. */
export const TAGLINE = 'Instrumental to Life'

/** Photography: the store pages' own frames, real Kawai images under /images. */
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
  /**
   * v2 polish: the financing (US) and acoustic rebate (CA) spreads, both
   * acoustic-only offers, in place of /fall-financing's autumn-leaves digital
   * upright. The strings and plate inside a Kawai GX-1 grand: holiday-neutral,
   * unmistakably acoustic, and not another white French-door room (the hero
   * has one). Override here only; /fall-financing keeps its own photo.
   */
  acoustic: {
    src: '/images/signature/pianos/gx-1/gx-1-secondary.webp',
    alt: 'The strings and golden plate inside a Kawai GX-1 grand piano',
    position: 'center 45%',
  },
  /**
   * The cinematic close (kawai-holiday-close-redesign v1): a concert
   * grand alone on the stage of a warm, wood-lined concert hall, shot on the
   * hall's axis. Already in the repo (NAMM hero, Black Friday art). Anchored low so
   * the piano and stage stay in frame at every width; the ceiling corridor
   * sits behind the type.
   */
  close: {
    src: '/images/namm/general/_MG_7325.jpg',
    alt: 'A black concert grand piano and bench alone on the stage of a wood-panelled concert hall',
    position: 'center 72%',
  },
} as const

const SECTION_IDS = {
  bundle: SECTION.bundle,
  financing: SECTION.financing,
  acoustic: SECTION.acoustic,
  rebates: SECTION.rebate,
  lessons: SECTION.lessons,
} as const

const bundlePromo: SalePromo = {
  id: SECTION_IDS.bundle,
  eyebrow: `Through ${PROGRAM_END}`,
  heading: { kind: 'text', text: bundle.heading },
  body: bundle.standfirst,
  image: { src: bundle.stageImage, alt: bundle.stageImageAlt, position: 'center 78%' },
  note: bundle.dealerNote,
  cta: true,
  fineprint: [bundle.disclaimer],
  // v2 polish: the Headphones spread goes dark (kawai-black), a mid-page dark
  // beat that sets up the cinematic close; its near-black photo no longer
  // reads as a hole on pearl.
  tone: 'dark',
  // v2 (the user: "for the sh-9 bundle, can we make the headphone image full
  // bleed?"): the photo runs edge to edge, the offer's type beside it.
  layout: 'fullBleed',
}

/**
 * US only. The /fall-financing credit advertisement, set in the template's
 * regulated lockup: lead and APR as bare text in one h2 (§4.1), the terms
 * subhead immediately under it (§4.2), the figure-free dealer note after it.
 * The Supporting Disclosure is the spread's fine print: visible page text on
 * load, never collapsed (§4.4), carrying the `*` and `**` footnotes the
 * headline and subhead point at (§4.3). It renders with `id="disclosures"`,
 * the same anchor /fall-financing gives it.
 */
const financingPromo: SalePromo = {
  id: SECTION_IDS.financing,
  eyebrow: OFFER_CHIPS.financing,
  heading: {
    kind: 'lockup',
    lead: financing.heading.lead,
    connector: financing.heading.connector,
    apr: financing.heading.apr,
    subhead: financing.subhead,
  },
  // v2 polish: an acoustic photo (ART.acoustic) in place of the national
  // slide's autumn digital upright; the offer covers acoustic pianos only.
  image: ART.acoustic,
  note: financing.dealerNote,
  cta: true,
  fineprint: [...disclosures.financingTerms, disclosures.financingExample, disclosures.exclusions],
  fineprintId: SECTION.disclosures,
}

/** CA only. Canada's acoustic offer, in the slot the US financing takes. All CAD. */
const acousticPromo: SalePromo = {
  id: SECTION_IDS.acoustic,
  eyebrow: acousticRebate.eyebrow,
  heading: { kind: 'text', text: acousticRebate.heading },
  body: acousticRebate.standfirst,
  // v2 polish: the same acoustic photo as the US financing spread, in place of
  // the autumn digital upright.
  image: ART.acoustic,
  rows: acousticRebates.map((r) => ({
    label: r.label,
    value: `Save ${formatOfferPrice(r.cad, 'CAD')}`,
    note: acousticRebate.finish,
  })),
  note: acousticRebate.dealerNote,
  cta: true,
  fineprint: [acousticRebate.disclaimer],
}

function rebatesPromo(site: Site): SalePromo {
  const copy = rebateCopyFor(site)
  return {
    id: SECTION_IDS.rebates,
    eyebrow: OFFER_CHIPS.rebates,
    heading: { kind: 'text', text: copy.heading },
    body: rebate.standfirst,
    image: { src: rebate.stageImage, alt: rebate.stageImageAlt },
    rows: esRebatesFor(site).map((r) => ({
      label: r.model,
      value: `Save ${formatOfferPrice(r.rebate, r.currency)}`,
      note: r.finishes,
    })),
    note: rebate.dealerNote,
    cta: true,
    fineprint: [copy.disclaimer],
  }
}

const lessonsPromo: SalePromo = {
  id: SECTION_IDS.lessons,
  eyebrow: lessons.eyebrow,
  heading: { kind: 'text', text: lessons.heading },
  body: lessons.standfirst,
  // The partners' logo strip (~3.9:1): shown whole, never cropped.
  image: { src: lessons.stageImage, alt: lessons.stageImageAlt, shape: 'banner' },
  note: lessons.redeemNote,
  link: { label: lessons.redeemLabel, href: lessons.redeemHref },
  fineprint: [lessons.disclaimer],
}

/** Promo order: US headphones, financing, rebates, lessons; CA headphones, acoustic, rebates, lessons. */
function promosFor(site: Site): SalePromo[] {
  return [bundlePromo, site === 'us' ? financingPromo : acousticPromo, rebatesPromo(site), lessonsPromo]
}

/**
 * The holiday moments between spreads. None sits before the financing (or the
 * acoustic) spread, so no marketing headline is ever read as part of the
 * credit advertisement. v2 polish (user decision, Nov 25, 2026): the
 * "Make your soundtrack for the Holidays" band is cut on this page (same
 * white French-door room as the hero, and "Holidays" is the close's word).
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
]

/**
 * The close's line: "Contact your nearest Authorized Kawai dealer for pricing
 * and inventory." in place of the national lead-in, then the rest of the
 * national coda line, unchanged ("They will confirm which offers apply to the
 * piano you want.").
 */
const CODA_REST = coda.body.startsWith(CTA_LEAD_IN) ? coda.body.slice(CTA_LEAD_IN.length).trim() : ''
export const DEALER_LEAD_IN = 'Contact your nearest Authorized Kawai dealer for pricing and inventory.'
export const CLOSE_BODY = [DEALER_LEAD_IN, CODA_REST].filter(Boolean).join(' ')

/**
 * Offer index cards → this page's section ids. CA has one rebates card for
 * both rebate offers (valuePropsFor's note), so it lands on the first of them,
 * the acoustic rebate.
 */
function highlightTarget(site: Site, offer: string, fallback: string): string {
  if (offer === 'bundle') return SECTION_IDS.bundle
  if (offer === 'financing') return SECTION_IDS.financing
  if (offer === 'rebates') return site === 'cad' ? SECTION_IDS.acoustic : SECTION_IDS.rebates
  return fallback
}

/** The page's content for one site. */
export function holidaySaleFor(site: Site): SaleContent {
  const opener = heroOpenerFor(site)
  return {
    hero: {
      badge: HERO_BADGE,
      lockup: HEADLINES.hero,
      support: SALE_EVENT.offers,
      image: ART.heroRoom,
      inset: ART.heroHands,
      // v3 (the user, Nov 25, 2026): "a secondary cta for view offers in the
      // hero? which will just scroll down". National only.
      secondary: { label: 'View Offers', href: '#offers' },
    },
    // The national opener's body for this site, introducing the offer index.
    intro: opener.body ?? '',
    highlights: valuePropsFor(site).map((v) => ({
      label: OFFER_CHIPS[v.offer],
      detail: v.detail,
      href: `#${highlightTarget(site, v.offer, v.sectionId)}`,
    })),
    promos: promosFor(site),
    moments,
    close: {
      eyebrow: `${HERO_BADGE.lead} ${HERO_BADGE.script}`,
      heading: SALE_EVENT.ends,
      body: CLOSE_BODY,
      lockup: HEADLINES.instrumental,
      // The full-bleed photo close (user decision, Nov 25, 2026): national only.
      image: ART.close,
    },
    // Required by the content contract; with no store there is no tel: link,
    // so the template never renders it on this page.
    callLabel: 'Call Now',
    // kawai-holiday-cta-availability-note v1 (Nov 24, 2026), the user: "under
    // each of the cta's get a submit a form to find out about availability!"
    // National page only; the store pages set no note.
    cta: { requestLabel: REQUEST_LABEL, leadIn: CTA_LEAD_IN, note: CTA_NOTE },
    tagline: TAGLINE,
    // v2 polish (user decision, Nov 25, 2026), national only.
    polish: {
      loudOffers: true,
      compactIndex: true,
      largeGallery: true,
      largeHeroMobile: true,
      stickyAvoidsPairs: true,
    },
  }
}

/**
 * Title and description per site. Figure-free on both: the US financing
 * offer is named, never quoted, so no rate sits in a title or preview text
 * away from its disclosure (§4.5 reaches metadata). CA names no financing at
 * all.
 */
export const HOLIDAY_META = {
  us: {
    title: SALE_EVENT.name,
    description:
      `Kawai's Holiday Sale Event, through ${PROGRAM_END}: financing options on acoustic grands ` +
      `and uprights, a free pair of SH-9 headphones with every qualifying CN or CA Series ` +
      `digital, instant rebates on ES Series portables and three months of free lessons. ` +
      `Contact your nearest Authorized Kawai dealer.`,
  },
  cad: {
    title: SALE_EVENT.name,
    description:
      `Kawai's Holiday Sale Event, through ${PROGRAM_END}: instant rebates on select Kawai ` +
      `acoustic pianos and ES Series portables, a free pair of SH-9 headphones with every ` +
      `qualifying CN or CA Series digital and three months of free lessons. Contact your ` +
      `nearest Authorized Kawai dealer.`,
  },
} as const satisfies Record<Site, { title: string; description: string }>
