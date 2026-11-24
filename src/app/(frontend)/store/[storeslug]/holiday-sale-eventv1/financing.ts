import { financing } from '@/app/(frontend)/fall-financing/_components/campaign'

/**
 * The holiday page's financing spread (kawai-holiday-sale-page-edits v2,
 * Chance, voice 4:44–4:46 PM PT Nov 20, 2026, relayed from Alexis's email
 * "KPG Holiday Campaign - Edits"): "0% financing on every model", with no
 * Synchrony or 24-month fine print added or kept, and neither mentioned.
 *
 * This replaces the page's own 36-month terms (Nov 19: 0% for 36 months, then
 * 22.99% for 24, Synchrony Pay Later, acoustic or Shigeru only, the worked
 * example). Those terms, and the national 24-month terms, are no longer
 * printed on this route. That is a deliberate departure from the holiday
 * legal and the v6 verbatim terms, on Chance's call.
 *
 * Only this route reads this file. The national /fall-financing page keeps
 * campaign.ts / FALL_2026 (24 + 36) exactly as it is.
 */
/**
 * BACKUP SNAPSHOT (Nov 23, 2026): the financing note as it read at c012653,
 * before the live page's St. Louis line. Frozen for /holiday-sale-eventv1.
 */
export const holidayFinancing = {
  heading: '0% financing on every model',
  // The figure-free line above the button pair, as before (campaign.ts).
  dealerNote: financing.dealerNote,
} as const
