import { describe, expect, it } from 'bun:test'
import { amortize, effectiveApr, planFor } from './plan'
import { FALL_2026, termMonths } from './terms'

/**
 * The lender's own worked example from the Q4 2026 disclosure:
 *
 *   "A total 60-month term with an amount financed of $8,000: 0% intro rate for
 *    the first 24 months and 22.99% rate for the remaining 36 months requires
 *    monthly payments of $133.33 for the first 24 months, and monthly payments
 *    of $185.78 for the remaining 36 months. APR of 8.01%."
 *
 * Every payment figure the page shows comes out of planFor(), so pinning it to
 * this example is what stops the page advertising terms nobody offered.
 */
describe('planFor — the disclosed $8,000 example', () => {
  const plan = planFor(8000, FALL_2026)

  it('pays $133.33 a month through the promotional window', () => {
    expect(plan.introMonthly).toBeCloseTo(133.33, 2)
    expect(plan.introMonths).toBe(24)
  })

  it('pays $185.78 a month once the rate changes', () => {
    expect(plan.postMonthly).toBeCloseTo(185.78, 2)
    expect(plan.postMonths).toBe(36)
  })

  it('runs 60 months end to end', () => {
    expect(plan.termMonths).toBe(60)
    expect(termMonths(FALL_2026)).toBe(60)
  })

  it('leaves 60% of the balance for the second window', () => {
    // 24 of 60 flat payments made: 8000 − 3200. The promotional window is
    // deliberately not enough to clear the loan.
    expect(plan.balanceAtRateChange).toBeCloseTo(4800, 2)
  })

  it('carries the advertised 8.01% APR', () => {
    expect(effectiveApr(plan) * 100).toBeCloseTo(8.01, 2)
    // …and our solved figure agrees with the one we print.
    expect(effectiveApr(plan)).toBeCloseTo(FALL_2026.blendedApr, 3)
  })

  it('costs the finance charge the two streams imply', () => {
    expect(plan.totalPaid).toBeCloseTo(133.3333 * 24 + 185.7816 * 36, 1)
    expect(plan.financeCharge).toBeCloseTo(plan.totalPaid - 8000, 6)
  })
})

describe('planFor — program thresholds', () => {
  it('rejects amounts under the $1,000 floor', () => {
    expect(planFor(999, FALL_2026).eligible).toBe(false)
    expect(planFor(1000, FALL_2026).eligible).toBe(true)
  })

  it('requires no down payment at or below $50,000', () => {
    const plan = planFor(50_000, FALL_2026)
    expect(plan.requiresDownPayment).toBe(false)
    expect(plan.minDownPayment).toBe(0)
  })

  it('requires 10% down above $50,000', () => {
    const plan = planFor(60_000, FALL_2026)
    expect(plan.requiresDownPayment).toBe(true)
    expect(plan.minDownPayment).toBeCloseTo(6000, 6)
  })

  it('scales linearly, so a per-model estimate is just the amount', () => {
    const one = planFor(8000, FALL_2026)
    const two = planFor(16_000, FALL_2026)
    expect(two.introMonthly).toBeCloseTo(one.introMonthly * 2, 6)
    expect(two.postMonthly).toBeCloseTo(one.postMonthly * 2, 6)
  })
})

describe('amortize', () => {
  it('divides evenly at a zero rate instead of dividing by zero', () => {
    expect(amortize(6000, 0, 60)).toBeCloseTo(100, 6)
  })

  it('matches a standard amortization at a non-zero rate', () => {
    // $4,800 over 36 months at 22.99% — the second half of the example.
    expect(amortize(4800, 0.2299 / 12, 36)).toBeCloseTo(185.78, 2)
  })

  it('returns nothing for a zero-length term', () => {
    expect(amortize(1000, 0.01, 0)).toBe(0)
  })
})
