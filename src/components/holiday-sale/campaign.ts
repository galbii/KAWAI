/**
 * Holiday sale banner window (kawai-holiday-sale-banner v1, Chance, Nov 23, 2026).
 *
 * Mirrors src/components/back-to-school/campaign.ts: the banner is toggled by a
 * date window, not a CMS field, a flag or a route. It ends with the holiday
 * financing program, PROGRAM_END (December 31, 2026), at end of day.
 */
export const HOLIDAY_BANNER_END = '2026-12-31T23:59:59'

/**
 * Whole days from `now` until the end of the holiday sale. Returns 0 once the
 * deadline has passed, and the banner then renders nothing. The store homepage
 * is ISR'd hourly, so it can stay up at most one stale window past the end.
 */
export function holidayDaysUntilDeadline(now: Date = new Date()): number {
  const end = new Date(HOLIDAY_BANNER_END)
  const ms = end.getTime() - now.getTime()
  if (ms <= 0) return 0
  return Math.ceil(ms / 86_400_000)
}
