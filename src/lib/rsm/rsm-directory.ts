/**
 * Who each lead inbox belongs to: lead-owner email → the person's name, for
 * the HubSpot `rsm` field and the Shopify `rsm-*` tag (kawai-lead-rsm-holiday
 * v2, Nov 25, 2026). The user: "when an rsm is decided in the territory, it
 * tags them in shopify with that rsm and then we also save the rsm to the
 * field ... in hubspot".
 *
 * Server-side only by convention: it is imported solely by the server lead
 * pipeline (./lead-owner → ./resolve-lead-owner, the HubSpot and Shopify
 * server actions). Never import it from a client component — owner emails and
 * names must not reach the browser.
 *
 * No schema change: Dealers carries only `rsmEmail`, so the names live here.
 * An address missing from this map is labelled with the address itself (the
 * `rsm` field is never blank), so adding a name is purely cosmetic and safe.
 *
 * TO ADD KAWAI'S RSMs: one line per person, the key being the exact
 * `rsmEmail` on their dealers (Dealers → Internal tab), lower-cased:
 *
 *   'jane.doe@kawaius.com': 'Jane Doe',
 *
 * Kawai has not supplied the RSM name list yet (open client question). Only
 * the two Canadian inboxes are named, from the names already recorded in
 * src/lib/rsm/lead-envelopes.ts (DEFAULT_CANADA_LEAD_EMAIL / _EAST_).
 */
export const RSM_DIRECTORY: Readonly<Record<string, string>> = {
  // Canada west (BC/AB/SK/MB + territories) — lead-envelopes.ts: "default Dave Mitchell".
  'dmitchell@kawaius.com': 'Dave Mitchell',
  // Canada east (ON/QC/Atlantic) — lead-envelopes.ts: "default Robin Rooke".
  'rrooke@kawaius.com': 'Robin Rooke',
  // US RSMs: add here when Kawai supplies the list (email → name).
}

/** The name on file for an owner inbox, or null. Case- and whitespace-insensitive. */
export function rsmNameFor(email: string | null | undefined): string | null {
  const key = email?.trim().toLowerCase()
  if (!key) return null
  return Object.prototype.hasOwnProperty.call(RSM_DIRECTORY, key) ? (RSM_DIRECTORY[key] ?? null) : null
}
