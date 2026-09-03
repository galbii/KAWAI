/**
 * Back to School campaign constants — the single source of truth for dates and
 * offer copy across every section of /store/[storeslug]/back-to-school.
 *
 * The spring campaign duplicated its date string across four components, so a
 * date change meant four edits. Everything here is imported, never retyped.
 *
 * The rebate AMOUNTS live in src/lib/data/rebates.ts (REBATES) and are joined to
 * products by getRebateShowcase(). This file only knows the program window.
 */

/** Campaign window. Sept 7 is Labor Day 2026 — the Monday school starts. */
export const CAMPAIGN_START = '2026-09-07'
/** Rebates expire at end of day. Same date the Q3 rebate program closes. */
export const CAMPAIGN_END = '2026-09-30'

export const CAMPAIGN_YEAR = 2026
/** 1-indexed, matching how a human says it. Converted at Date() call sites. */
export const CAMPAIGN_MONTH = 9

export const DATE_RANGE = 'September 7 – 30, 2026'
export const DEADLINE_LONG = 'September 30, 2026'
export const DEADLINE_SHORT = 'Sept 30'

/** Sale window days, used to ink the calendar. Sept 7 through Sept 30 inclusive. */
export const WINDOW_START_DAY = 7
export const WINDOW_END_DAY = 30

/** One cell of the offer rail the hero and the storefront promo both carry. */
export interface CampaignOffer {
  /**
   * The figure. Always a numeral — the rail sets these at display scale in
   * tabular figures, and a word among them ("Instant") reads as a mistake and
   * throws the three cells out of alignment.
   */
  value: string
  label: string
  detail: string
  /** Qualifier set above the figure, e.g. "Up to". Keeps the claim accurate. */
  prefix?: string
}

/** The three offers, stated the same way everywhere they appear. */
export const OFFERS: readonly CampaignOffer[] = [
  {
    value: '0%',
    label: 'Financing',
    detail: '36 months, no interest',
  },
  {
    prefix: 'Up to',
    value: '$4,500',
    label: 'Instant Rebates',
    detail: 'Taken off at the counter',
  },
  {
    value: '+$500',
    label: 'Trade-In Bonus',
    detail: 'Over any independent appraisal',
  },
]

/** Short offer pills for closing CTAs. */
export const OFFER_PILLS = [
  '0% financing · 36 months',
  'Instant rebates up to $4,500',
  '+$500 trade-in bonus',
  `Ends ${DEADLINE_LONG}`,
] as const

/**
 * Whole days from `now` until end of day on the deadline. Returns 0 once the
 * deadline has passed. Call this client-side only — a server render would bake
 * a stale count into the ISR'd HTML.
 */
export function daysUntilDeadline(now: Date = new Date()): number {
  const end = new Date(`${CAMPAIGN_END}T23:59:59`)
  const ms = end.getTime() - now.getTime()
  if (ms <= 0) return 0
  return Math.ceil(ms / 86_400_000)
}
