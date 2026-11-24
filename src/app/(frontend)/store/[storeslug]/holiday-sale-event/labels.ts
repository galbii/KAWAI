/**
 * The primary action's label — Chance's own words (via Marcy, voice, 8:17 AM
 * PT Nov 19, 2026: primary "Request Inventory", secondary "Call Now"). It
 * opens the same dealer enquiry form as the national page's buttons.
 *
 * Its own module so the client-side lead config (lead.ts) can read it without
 * pulling the page's whole copy file into the browser bundle.
 */
export const REQUEST_LABEL = 'Request Inventory'

/**
 * Added to every holiday-sale-event lead in Shopify, on top of the national
 * tags: the store pages and the national /holiday-sale-event page alike.
 *
 * Lives here, not in lead.ts, so the national page's lead config can read it
 * without pulling the store notifier (a 'use server' module) into its bundle
 * (kawai-holiday-sale-national v1, Nov 24, 2026). lead.ts re-exports it.
 */
export const HOLIDAY_LEAD_TAG = 'holiday-2026-lead'
