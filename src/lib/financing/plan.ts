import { type FinancingTerms, termMonths } from './terms'

/**
 * Turns an amount financed into the payment stream a customer actually sees.
 *
 * The structure is two windows, not one loan: during the promotional months the
 * payment is the amount spread flat across the WHOLE term (no interest accrues,
 * so there is nothing to amortize), which leaves a balance to amortize at the
 * post-promotional rate over the months that remain. That is why `introMonthly`
 * divides by the full term and not by `introMonths` — dividing by 24 would clear
 * the balance before the second window exists.
 *
 * `plan.test.ts` pins this against the lender's own worked example ($8,000 →
 * $133.33 then $185.78, 8.01% APR). If a figure here ever stops matching that
 * example, the page is advertising credit terms the lender did not offer.
 */

export interface PaymentPlan {
  /** What the plan was computed for. */
  amount: number
  introMonths: number
  /** Payment during the promotional window. */
  introMonthly: number
  postMonths: number
  /** Payment once the promotional rate ends. */
  postMonthly: number
  termMonths: number
  /** Balance still owed when the promotional window closes. */
  balanceAtRateChange: number
  /** Every dollar paid across the full term. */
  totalPaid: number
  /** Total paid less the amount financed — the cost of the credit. */
  financeCharge: number
  /** True when the program requires a down payment at this amount. */
  requiresDownPayment: boolean
  /** Minimum down payment in dollars, or 0 when none is required. */
  minDownPayment: number
  /** False below the program's floor — the amount cannot be financed at all. */
  eligible: boolean
}

/**
 * Level payment that clears `principal` over `months` at `monthlyRate`.
 * A zero rate degrades to simple division rather than dividing by zero.
 */
export function amortize(principal: number, monthlyRate: number, months: number): number {
  if (months <= 0) return 0
  if (monthlyRate === 0) return principal / months
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months))
}

export function planFor(amount: number, terms: FinancingTerms): PaymentPlan {
  const term = termMonths(terms)

  // Flat across the full term: the promotional window charges no interest, so
  // the payment is pure principal and the balance is deliberately NOT cleared
  // by the time the rate changes.
  const introMonthly = amortize(amount, terms.introApr / 12, term)
  const balanceAtRateChange = amount - introMonthly * terms.introMonths
  const postMonthly = amortize(balanceAtRateChange, terms.postApr / 12, terms.postMonths)

  const totalPaid = introMonthly * terms.introMonths + postMonthly * terms.postMonths
  const requiresDownPayment = amount > terms.downPaymentThreshold

  return {
    amount,
    introMonths: terms.introMonths,
    introMonthly,
    postMonths: terms.postMonths,
    postMonthly,
    termMonths: term,
    balanceAtRateChange,
    totalPaid,
    financeCharge: totalPaid - amount,
    requiresDownPayment,
    minDownPayment: requiresDownPayment ? amount * terms.downPaymentRate : 0,
    eligible: amount >= terms.minFinanced,
  }
}

/**
 * The APR the payment stream actually carries, solved rather than asserted.
 *
 * Exists to keep us honest: `FinancingTerms.blendedApr` is the figure the lender
 * advertises, and this recomputes it from the payments the page displays so a
 * test can prove the two agree. Bisection on the discount rate — the stream is
 * strictly decreasing in `r`, so it converges without needing a derivative.
 */
export function effectiveApr(plan: PaymentPlan): number {
  const payment = (month: number) =>
    month <= plan.introMonths ? plan.introMonthly : plan.postMonthly

  const presentValue = (monthlyRate: number) => {
    let pv = 0
    for (let month = 1; month <= plan.termMonths; month++) {
      pv += payment(month) / Math.pow(1 + monthlyRate, month)
    }
    return pv
  }

  let low = 0
  let high = 1
  for (let i = 0; i < 200; i++) {
    const mid = (low + high) / 2
    if (presentValue(mid) > plan.amount) low = mid
    else high = mid
  }
  return ((low + high) / 2) * 12
}
