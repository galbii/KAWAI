/**
 * Recognises a search for the firmware register itself, rather than for one
 * instrument in it.
 *
 * `/software` is a hardcoded route, not a CMS page, so it is absent from the
 * Payload `search` index — typing "firmware" into either search box found nothing
 * before this. And the model matcher in `grouping.ts` only knows model names, so
 * "software" matches no row there either. Both searches ask this module instead,
 * so a generic query lands on the register from anywhere on the site.
 *
 * Pure — no I/O, safe on either side of the network boundary.
 */

/** Single words that, on their own, mean "I want the firmware page". */
const TERMS = new Set([
  'software',
  'softwares',
  'firmware',
  'firmwares',
  'update',
  'updates',
  'updating',
  'upgrade',
  'upgrades',
  'download',
  'downloads',
  'patch',
  'patches',
  'os',
])

/** Phrases worth catching whole, because neither word alone is decisive. */
const PHRASES = [
  'system version',
  'software version',
  'firmware version',
  'operating system',
]

export interface SoftwareDestination {
  title: string
  description: string
  href: string
}

export const SOFTWARE_DESTINATION: SoftwareDestination = {
  title: 'Software & Firmware',
  description:
    'System updates for Kawai digital, hybrid, AnyTime and AURES instruments. Search by model to find your update file and instructions.',
  href: '/software',
}

/**
 * True when the query is asking for the firmware register.
 *
 * Token-based, so it fires on "firmware" alone and on "ES920 firmware" alike —
 * a model query that also names the errand should still offer the page. Matching
 * is on whole tokens, so "updated" or "downloader" do not trigger it.
 */
export function matchesSoftwareIntent(query: string): boolean {
  const normalized = query.toLowerCase().trim()
  if (normalized.length < 2) return false

  if (PHRASES.some((phrase) => normalized.includes(phrase))) return true

  return normalized
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .some((token) => TERMS.has(token))
}

/**
 * The query with its errand words removed — "es920 firmware" becomes "es920".
 *
 * Both searches match a whole query string at once, so naming the errand alongside
 * the model ("ES920 firmware") otherwise matches neither: no model is called that,
 * and no FAQ title contains the pair. Callers retry with this remainder when the
 * literal query finds nothing. Returns '' when only errand words were typed, which
 * callers must treat as "no model named" rather than as an empty match-everything
 * query.
 */
export function stripSoftwareTerms(query: string): string {
  let out = query.toLowerCase()
  for (const phrase of PHRASES) out = out.split(phrase).join(' ')
  return out
    .split(/[^a-z0-9]+/)
    .filter((token) => token && !TERMS.has(token))
    .join(' ')
    .trim()
}
