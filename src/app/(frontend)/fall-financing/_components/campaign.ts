import { FALL_2026, termMonths } from '@/lib/financing/terms'

/**
 * Every word on the Q4 page, in one file.
 *
 * Three separate offers, not one campaign with three ornaments — each applies
 * to a different part of the range, and a shopper cares about exactly one. So
 * each block states which instruments it covers before it says anything else,
 * and the page opens with an index rather than a pitch.
 *
 * The source material is dealer-facing trade bulletins. It is rewritten here
 * for the person buying the piano: no shared-cost language, no reimbursement
 * terms, no participation form — those are between Kawai and the dealer and
 * mean nothing to a shopper. What survives is what changes the price they pay.
 *
 * Financing figures are formatted from {@link FALL_2026} rather than retyped.
 * A financing promotion is a credit advertisement, so a headline that has
 * drifted from its disclosure is a regulatory problem, not a copy bug.
 */

const pct = (rate: number) =>
  `${(rate * 100).toLocaleString('en-US', { maximumFractionDigits: 2 })}%`

const usd = (amount: number) => `$${amount.toLocaleString('en-US')}`

/** All three offers run to the same date. Stated once. */
export const PROGRAM_END = 'December 31, 2026'
export const PROGRAM_END_SHORT = 'Dec 31'
export const FINANCING_RANGE = 'October 1 – December 31, 2026'
export const REBATE_RANGE = 'October 1 – December 31, 2026'

export const INTRO_APR = pct(FALL_2026.introApr)
export const POST_APR = pct(FALL_2026.postApr)
export const BLENDED_APR = pct(FALL_2026.blendedApr)
export const TERM = termMonths(FALL_2026)
export const MIN_FINANCED = usd(FALL_2026.minFinanced)

/**
 * The sentence the law attaches to the headline rate: naming a promotional rate
 * obliges the page to state the rate that follows it, the term, and what
 * qualifies. Repeated verbatim wherever the rate appears — never paraphrased.
 */
export const TERMS_SENTENCE =
  `After the introductory period, a ${POST_APR} rate applies for ${FALL_2026.postMonths} months. ` +
  `Available on qualifying purchases of ${MIN_FINANCED} or more on new Kawai or Shigeru Kawai ` +
  `acoustic pianos bought between ${FINANCING_RANGE}.`

/** Anchors, so the hero index and the blocks cannot disagree about where they point. */
export const SECTION = {
  bundle: 'headphones',
  financing: 'financing',
  rebate: 'rebates',
} as const

/**
 * The hero is an index, not a poster.
 *
 * Three offers, each stated as the figure a shopper saves, what it covers, and
 * a way in. A shopper who already knows they want a digital portable should be
 * able to reach the ES rebate without reading about acoustic financing.
 */
export const hero = {
  kicker: 'Kawai offers, autumn 2026',
  headline: 'Three ways to pay less for the piano you want',
  standfirst:
    `Every offer below runs through ${PROGRAM_END} at Authorized Kawai dealers. ` +
    'Each one covers a different part of the range, so find yours and take it to your dealer.',
  index: [
    {
      figure: INTRO_APR,
      figureNote: `for ${FALL_2026.introMonths} months`,
      title: 'Financing on acoustic pianos',
      covers: 'New Kawai and Shigeru Kawai grands and uprights',
      href: `#${SECTION.financing}`,
    },
    {
      figure: 'Free',
      figureNote: 'a $139 pair',
      title: 'SH-9 headphones with every piano',
      covers: 'CN Series and CA Series digital pianos',
      href: `#${SECTION.bundle}`,
    },
    {
      figure: '$150',
      figureNote: 'up to, taken off in store',
      title: 'Instant rebate on ES Series',
      covers: 'ES60, ES120 and ES920 portable digitals',
      href: `#${SECTION.rebate}`,
    },
  ],
  cta: 'Find your dealer',
} as const

/* ── Block 1 · SH-9 headphone bundle ───────────────────────────────────── */

export const bundle = {
  heading: 'A pair of SH-9 headphones, free with every CN or CA Series piano',
  standfirst:
    'Order any qualifying CN Series or CA Series digital piano and a pair of Kawai SH-9 ' +
    'high-performance headphones comes with it — one pair per piano, at no extra cost.',
  /** The four terms, as a shopper needs them rather than as the trade bulletin states them. */
  points: [
    'Buy any qualifying CN Series or CA Series digital piano',
    'One pair of SH-9 headphones included, at no extra cost',
    'One pair per piano',
    `Runs through ${PROGRAM_END}, while qualifying stock lasts`,
  ],
  headphone: {
    model: 'SH-9',
    name: 'Kawai SH-9 high-performance headphones',
    value: 139,
    blurb:
      'Closed-back, tuned for the Harmonic Imaging sound engine — the pair Kawai builds for its ' +
      'own instruments, so late-night practice sounds like the piano and not like headphones.',
  },
  tabsLabel: 'Choose a series',
  /** Tab order. Handles are Shopify collection handles. */
  collections: ['cn-series', 'ca-series'] as const,
  emptyState: 'Qualifying models are confirmed by your local Authorized Kawai dealer.',
  disclaimer:
    `One complimentary pair of SH-9 headphones per qualifying new CN or CA Series digital piano, ` +
    `through ${PROGRAM_END} or while qualifying stock lasts, whichever comes first. Headphones ` +
    `have no cash value and cannot be exchanged. Prices shown are manufacturer's suggested ` +
    `retail; your Authorized Kawai dealer sets the final price. Dealer participation may vary.`,
} as const

/* ── Block 2 · 0% financing ────────────────────────────────────────────── */

export const financing = {
  heading: `${INTRO_APR} for the first ${FALL_2026.introMonths} months on acoustic pianos`,
  standfirst:
    `New Kawai and Shigeru Kawai acoustic grands and uprights, financed over ${TERM} months ` +
    `through ${FALL_2026.lender}. Every model below shows what it comes to per month.`,
  includes: 'New Kawai and Shigeru Kawai acoustic pianos — grands and uprights.',
  excludes: 'Digital pianos, hybrid pianos, and the Shigeru Kawai SK-EX concert grand.',
  /** Second-level filter label, under the category tabs. */
  seriesLabel: 'Narrow by series',
  allSeries: 'All series',
  onRequest: 'Price on request',
  onRequestNote:
    'Eligible for the program. Your Authorized Kawai dealer quotes the price and the payment.',
  emptyState:
    'Qualifying models are confirmed by your local Authorized Kawai dealer — use the locator below.',
  /**
   * Restated under the table so a monthly figure is never the only thing on
   * screen. Quoting a payment obliges the page to disclose the whole repayment
   * stream and the APR; this and the expanded row carry that.
   */
  paymentNote:
    `Estimated payments on the full purchase price with no down payment: ${INTRO_APR} for the ` +
    `first ${FALL_2026.introMonths} months, then ${POST_APR} for ${FALL_2026.postMonths} months, ` +
    `${TERM} months in total, ${BLENDED_APR} APR. Prices shown are manufacturer's suggested ` +
    `retail; your Authorized Kawai dealer sets the final price, so your payment will differ. ` +
    `Subject to credit approval. This is not an offer of credit.`,
} as const

/* ── Block 3 · ES Series rebate ────────────────────────────────────────── */

/**
 * The Q4 ES rebate, consumer side only.
 *
 * Deliberately NOT read from `src/lib/data/rebates.ts`: that list is the Q3
 * program and drives the /signup rebate showcase, so editing it to Q4 figures
 * would silently change three live pages. These three amounts belong to this
 * promotion and live with it.
 *
 * The trade bulletin splits each rebate 50/50 between Kawai and the dealer.
 * That split is invisible to a shopper — they see one number come off the
 * price — so only the consumer amount appears here.
 */
export const REBATE_AMOUNTS: ReadonlyArray<{ model: string; rebate: number; finishes: string }> = [
  { model: 'ES60', rebate: 50, finishes: 'Black' },
  { model: 'ES120', rebate: 100, finishes: 'Black, white, grey' },
  { model: 'ES920', rebate: 150, finishes: 'Black, white' },
]

export const rebate = {
  heading: 'Up to $150 off an ES Series portable',
  standfirst:
    `Three ES Series models carry an instant rebate through ${PROGRAM_END}. It comes off the ` +
    'price at the counter — there is nothing to claim and nothing to post.',
  collectionHandle: 'es-series',
  emptyState: 'Rebated models are confirmed by your local Authorized Kawai dealer.',
  disclaimer:
    `Instant rebate on new ES60, ES120 and ES920 digital pianos bought ${REBATE_RANGE}. The ` +
    `rebate is taken off the price at the point of sale. Prices shown are manufacturer's ` +
    `suggested retail; your Authorized Kawai dealer sets the final price. Dealer participation ` +
    `may vary. Cannot be combined with other offers on the same instrument.`,
} as const

/* ── Close ─────────────────────────────────────────────────────────────── */

export const dealer = {
  heading: 'Every offer is redeemed at your dealer',
  body:
    'Kawai pianos are sold through authorized dealers, where you can play the instrument before ' +
    'you buy it. Find the one nearest you and ask which of these offers applies to the model ' +
    'you have in mind.',
  count: '200+',
  countLabel: 'authorized dealers across the United States',
  locatorCta: 'Open the dealer locator',
} as const

export const questions = {
  heading: 'Ask about any of it',
  body:
    'Send a note and your nearest Authorized Kawai dealer will follow up about the offers and ' +
    'the models you are weighing up.',
} as const

export const disclosures = {
  heading: 'Disclosures',
  general: `USA only. Dealer participation may vary. All offers run through ${PROGRAM_END}.`,
  financingTerms: [
    `Introductory rate of ${INTRO_APR} for the first ${FALL_2026.introMonths} months ` +
      `(APR ${BLENDED_APR}).`,
    TERMS_SENTENCE,
    `Financing is facilitated by ${FALL_2026.lender} and is subject to credit approval.`,
  ],
  /**
   * The lender's worked example. `plan.test.ts` pins planFor() to exactly these
   * payments, so the estimator above and this paragraph cannot disagree.
   */
  financingExample:
    `Example: on a ${TERM}-month term with ${usd(8000)} financed — ${INTRO_APR} for the first ` +
    `${FALL_2026.introMonths} months and ${POST_APR} for the remaining ${FALL_2026.postMonths} ` +
    `months — payments are $133.33 a month for the first ${FALL_2026.introMonths} months and ` +
    `$185.78 a month for the remaining ${FALL_2026.postMonths}. APR of ${BLENDED_APR}. A down ` +
    `payment may be required based on credit; a minimum ${pct(FALL_2026.downPaymentRate)} down ` +
    `payment is required on amounts over ${usd(FALL_2026.downPaymentThreshold)}. The program ` +
    `minimum is ${MIN_FINANCED}. Synchrony Pay Later installment loans are provided by ` +
    `${FALL_2026.lender}.`,
} as const
