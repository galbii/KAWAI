import { DATE_RANGE, DEADLINE_LONG, DEADLINE_SHORT } from '@/components/back-to-school/campaign'

/**
 * Every word on /signup3, in one file.
 *
 * The page runs the /signup2 conversion flow — the dealer sign-up popup, the
 * rebate ledger, the same lead routing — under the Back to School campaign, so
 * the poster carries that campaign's title and its dates rather than a second,
 * competing event name. The window (`September 7 – 30, 2026`) is imported from
 * the campaign constants, never retyped, so the two pages cannot state
 * different dates.
 *
 * The cinematic pinned canvas /signup2 uses (and its SCENE_WINDOWS
 * choreography) is gone, so nothing here describes scroll position any more;
 * this file is only copy.
 */

/** The poster: the campaign dates, the title, and the ask. */
export const heroPoster = {
  eyebrow: DATE_RANGE,
  headlineLead: 'Back to',
  headlineFigure: 'School',
  /** Outlined under the title, the way a sale poster outlines its event name. */
  headlineTail: 'Piano Sale Event',
  /** The one italic serif line the poster gets. */
  sub: '200+ Authorized Dealers Nationwide',
  signUpCta: 'Sign Up Now',
  viewRebatesCta: 'View Rebates',
  /** Screen-reader h1 — the display lines above are split across spans. */
  a11yHeadline: `Kawai Back to School Piano Sale Event — ${DATE_RANGE}`,
} as const

/** Top rebate in each market. Canada runs a smaller program than the US. */
const TOP_REBATE = { us: '$4,500', cad: '$2,600' } as const

/**
 * The offer rail under the poster, edge to edge. Three figures, stated the same
 * way the Back to School rail states its three: the numbers are the argument
 * for the button below them, so they get the full width rather than a column.
 *
 * Built per site rather than declared flat — the rebate ceiling is the one
 * number on this page that differs between kawaius.com and ca.kawaius.com.
 */
export function offerRail(site: 'us' | 'cad') {
  return [
    {
      value: 'Instant',
      label: 'Rebates',
      detail: `Up to ${TOP_REBATE[site]} off, taken at the counter`,
    },
    {
      value: '200+',
      label: 'Authorized Dealers',
      detail: 'Nationwide — one near you',
    },
    {
      value: DEADLINE_SHORT,
      label: 'Program Ends',
      detail: 'Savings confirmed by your local dealer',
    },
  ] as const
}

/**
 * Trust strip — the three most credible, purchase-relevant numbers. The full
 * five-stat heritage scene (awards, competition victories, generations) was cut
 * for the conversion-first variant; what remains reassures a buyer right before
 * the closing CTA without sending them off to read history.
 */
export const stats = [
  { value: '1927', label: 'Crafting Pianos Since' },
  { value: '2.4M+', label: 'Pianos Built' },
  { value: '200+', label: 'Authorized Dealers Nationwide' },
] as const

export const statsCopy = {
  eyebrow: 'By the Numbers',
  headline: 'Ninety-eight years of one thing',
  aside: 'Every piano in the program below comes out of that same workshop discipline.',
} as const

export const showroomsCopy = {
  eyebrow: 'Where to Play',
  headline: 'Experience Kawai in person',
  subhead: '200+ Authorized Dealers Nationwide',
  aside: 'Play our pianos in person and get expert guidance from an authorized Kawai dealer near you.',
  findDealerCta: { label: 'Find a Dealer', href: '/find-a-dealer' },
} as const

export const codaCopy = {
  eyebrow: 'Last Step',
  headline: 'Claim your rebate today',
  body: 'Sign up and your local Authorized Kawai dealer will reach out about current rebates and savings on your next piano.',
  secondaryCta: { label: 'Explore Pianos', href: '/pianos' },
} as const

/**
 * HubSpot form the native two-step sign-up submits to (via the public Forms API,
 * not an iframe) so the submission fires in our page context and GTM can read it.
 *
 * portalId + region come from Kawai's HubSpot account (same as warranty). Only
 * `formGuid` is form-specific — it's the `data-form-id` UUID in the form's
 * HubSpot embed code (Marketing → Forms → your form → Share/Embed).
 */
export const hubspotSignupForm = {
  portalId: '21987263',
  formGuid: '6a40df6b-d339-413c-8f62-d6e8324f3959',
  region: 'na1',
} as const

/**
 * Dealer discount offer. Copy shared by every offer CTA on the page and the
 * OfferModal they open.
 */
export const offerCopy = {
  eyebrow: 'Exclusive Offer',
  headline: 'Sign up for instant rebates at your local Authorized dealer',
  body: "We'll reach out soon to tell you about availability and potential savings.",
  /** Unified label for every call to action on the page — all open the signup popup. */
  signUp: 'Sign Up Now',
  submitLabel: 'Sign Up Now',
  zipHelp: "We'll match you to your nearest Authorized Kawai dealer.",
  success: {
    headline: "You're in.",
    body: 'Thanks — your local Authorized Kawai dealer will reach out soon about availability and potential savings.',
  },
} as const

/**
 * The rebate ledger. Lets a visitor scan every rebated model and the price the
 * rebate takes it to, then open any row for the detail. Products + rebates come
 * from the Products collection via getRebateShowcase().
 */
export const rebatesCopy = {
  eyebrow: 'Current Rebates',
  headline: 'See your savings, by model',
  subhead: `Ends ${DEADLINE_LONG}`,
  aside:
    'Pick a category, then a model. Your local Authorized Kawai dealer confirms the final price.',
  disclaimer: `Estimated savings off MSRP, taken off the price at the counter on qualifying new Kawai pianos. Rebate amounts vary by model. The Back to School program runs ${DATE_RANGE}; rebates end ${DEADLINE_LONG}. Final pricing and availability confirmed by your local Authorized Kawai dealer.`,
} as const
