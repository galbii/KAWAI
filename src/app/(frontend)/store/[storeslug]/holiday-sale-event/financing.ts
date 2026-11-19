import { FALL_2026, termMonths, type FinancingTerms } from '@/lib/financing/terms'
import { effectiveApr, planFor } from '@/lib/financing/plan'
import {
  disclosures,
  financing,
  FINANCING_RANGE,
  FOOTNOTE_EXAMPLE,
  FOOTNOTE_EXCLUSIONS,
} from '@/app/(frontend)/fall-financing/_components/campaign'

/**
 * The holiday page's own financing terms: 0% for the first 36 months
 * (Chance, Nov 19, 2026: "update on the page 24 months to 36 months just on
 * this page").
 *
 * Only this route reads these. The national /fall-financing page and
 * everything else keep {@link FALL_2026} (24 + 36) exactly as it is, so the
 * national campaign.ts / slides.ts / terms.ts are not edited.
 *
 * Same program in every other respect: same lender, rates, threshold, floor,
 * dates and 60-month total term. The windows swap (36 intro, then the 22.99%
 * rate for the remaining 24), and every figure that follows from the windows
 * is computed with the national `planFor` / `effectiveApr` model, never typed:
 * the $8,000 example's two payments and the blended APR. That is the same
 * model `plan.test.ts` pins to the lender's 24/36 example ($133.33, $185.78,
 * 8.01%), so the holiday figures are what that model gives for 36/24.
 *
 * The sentence templates mirror campaign.ts word for word (the approved
 * banner subhead and the `*` worked example); `financing.test.ts` proves the
 * only difference from the national copy is the figures.
 *
 * PM assumption, to confirm against Synchrony's terms before it ships: the
 * 36-month program keeps the 60-month total term.
 */

const HOLIDAY_WINDOWS = { introMonths: 36, postMonths: 24 } as const

/** The disclosure's worked-example amount, as on the national page. */
export const EXAMPLE_AMOUNT = 8000

/** The example's payment stream under the holiday windows. */
export const examplePlan = planFor(EXAMPLE_AMOUNT, { ...FALL_2026, ...HOLIDAY_WINDOWS })

/**
 * The holiday terms. `blendedApr` is the APR of the example's payment stream,
 * solved by `effectiveApr` and rounded to the hundredth of a percent the page
 * prints (the national 8.01% is that same stream's APR, 8.0137%, rounded).
 */
export const HOLIDAY_FINANCING: FinancingTerms = {
  ...FALL_2026,
  ...HOLIDAY_WINDOWS,
  blendedApr: Math.round(effectiveApr(examplePlan) * 10_000) / 10_000,
}

const pct = (rate: number) =>
  `${(rate * 100).toLocaleString('en-US', { maximumFractionDigits: 2 })}%`

const usd = (amount: number) => `$${amount.toLocaleString('en-US')}`

const usdCents = (amount: number) =>
  `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const T = HOLIDAY_FINANCING
const INTRO_APR = pct(T.introApr)
const POST_APR = pct(T.postApr)
const BLENDED_APR = pct(T.blendedApr)
const TERM = termMonths(T)
const MIN_FINANCED = usd(T.minFinanced)

/** campaign.ts `TERMS_SENTENCE`, on the holiday windows. No footnote mark (see there). */
export const HOLIDAY_TERMS_SENTENCE =
  `After the introductory period, a ${POST_APR} rate will apply for ` +
  `${T.postMonths} months. Available on qualifying purchases of ${MIN_FINANCED} or more ` +
  `on new Kawai acoustic or Shigeru Kawai made between ${FINANCING_RANGE}.`

/** campaign.ts `financing.heading` + `subhead`, on the holiday windows. */
export const holidayFinancing = {
  heading: {
    lead: `Introductory Rate of ${INTRO_APR}`,
    connector: `for the first ${T.introMonths} months`,
    apr: `(APR ${BLENDED_APR})${FOOTNOTE_EXAMPLE}`,
  },
  subhead: `${HOLIDAY_TERMS_SENTENCE}${FOOTNOTE_EXCLUSIONS}`,
  dealerNote: financing.dealerNote,
} as const

/**
 * campaign.ts `disclosures`, on the holiday windows. The lender lines and the
 * `**` exclusions carry no figure and are the national ones, imported.
 */
export const holidayDisclosures = {
  financingTerms: disclosures.financingTerms,
  financingExample:
    `${FOOTNOTE_EXAMPLE}Example: A total ${TERM}-month term with an amount financed of ` +
    `${usd(EXAMPLE_AMOUNT)}: ${INTRO_APR} intro rate for the first ${T.introMonths} months and ` +
    `${POST_APR} rate for the remaining ${T.postMonths} months requires monthly ` +
    `payments of ${usdCents(examplePlan.introMonthly)} for the first ${T.introMonths} months, and monthly payments ` +
    `of ${usdCents(examplePlan.postMonthly)} for the remaining ${T.postMonths} months. APR of ${BLENDED_APR}. Down ` +
    `payment may be required based on customer credit; a minimum ` +
    `${pct(T.downPaymentRate)} down payment is required on loan amounts over ` +
    `${usd(T.downPaymentThreshold)}. Program minimum amount financing is ` +
    `${MIN_FINANCED}. Subject to credit approval. Synchrony Pay Later installment loans are ` +
    `provided by ${T.lender}.`,
  exclusions: disclosures.exclusions,
} as const
