/**
 * The Q4 2026 Synchrony promotion, stated once.
 *
 * Every rate, term, threshold and date on /fall-financing is read from here —
 * the hero, the offer rail, the per-model payment estimates, the worked example
 * and the disclosure all derive from this object rather than restating it. A
 * financing promotion is a credit advertisement: a figure that drifts out of
 * sync with the disclosure is a compliance problem, not a typo, so there is
 * exactly one place to change when the program changes.
 *
 * Next year's promotion replaces this file; nothing else has to move.
 */
export interface FinancingTerms {
  /** Promotional APR for the opening window. 0 for this program. */
  introApr: number
  introMonths: number
  /** The rate that takes over once the promotional window closes. */
  postApr: number
  postMonths: number
  /**
   * The advertised blended APR over the full term. Stated by the lender rather
   * than derived — it is the figure on the offer sheet, and `assertBlendedApr`
   * in ./plan checks our own math agrees with it.
   */
  blendedApr: number
  /** Smallest purchase the program will finance. */
  minFinanced: number
  /** Above this amount a down payment is required outright. */
  downPaymentThreshold: number
  /** Minimum down payment on amounts over the threshold. */
  downPaymentRate: number
  lender: string
  /** Program window, ISO dates, inclusive. */
  start: string
  end: string
}

export const FALL_2026: FinancingTerms = {
  introApr: 0,
  introMonths: 24,
  postApr: 0.2299,
  postMonths: 36,
  blendedApr: 0.0801,
  minFinanced: 1000,
  downPaymentThreshold: 50_000,
  downPaymentRate: 0.1,
  lender: 'Synchrony Bank',
  start: '2026-10-01',
  end: '2026-12-31',
}

/** Full repayment term. Always the two windows end to end — never retyped. */
export function termMonths(terms: FinancingTerms): number {
  return terms.introMonths + terms.postMonths
}
