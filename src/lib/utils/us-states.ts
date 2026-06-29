/**
 * US state abbreviation ↔ name helpers.
 *
 * Used to derive a structured state (e.g. "TX") from a free-text address string
 * like "5800 Richmond Ave, Houston, TX 77057, USA" — needed because some
 * Storefront docs have an empty `address.state` but always carry a full
 * `showroomInfo.address`.
 */

export const US_STATES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  DC: 'District of Columbia',
}

/** Resolve a single token ("TX" or "Texas") to its 2-letter abbreviation. */
function resolveState(token: string): string | null {
  const up = token.trim().toUpperCase()
  if (!up) return null
  if (up in US_STATES) return up
  const entry = Object.entries(US_STATES).find(([, name]) => name.toUpperCase() === up)
  return entry ? entry[0] : null
}

/**
 * Extract a 2-letter US state abbreviation from a free-text address.
 * Strategy (most reliable first):
 *   1. The token(s) immediately before a 5-digit ZIP ("…, Houston, TX 77057" → TX,
 *      "…, Chesterfield, Missouri 63005" → MO; also handles two-word names like "New York").
 *   2. A ", XX" abbreviation near the end.
 *   3. A full state name appearing anywhere (last resort — can false-match street names).
 */
export function extractStateAbbrev(text?: string | null): string | null {
  if (!text) return null
  const t = text.trim()

  const zip = t.match(/\b\d{5}(?:-\d{4})?\b/)
  if (zip?.index !== undefined) {
    const before = t.slice(0, zip.index).replace(/,\s*$/, '').trim()
    const parts = before.split(/[\s,]+/).filter(Boolean)
    const last = parts[parts.length - 1] ?? ''
    const one = resolveState(last)
    if (one) return one
    const twoWord = parts.slice(-2).join(' ')
    const two = resolveState(twoWord)
    if (two) return two
  }

  const abbrev = t.toUpperCase().match(/,\s*([A-Z]{2})\b/)
  if (abbrev?.[1] && abbrev[1] in US_STATES) return abbrev[1]

  for (const [ab, name] of Object.entries(US_STATES)) {
    if (new RegExp(`\\b${name}\\b`, 'i').test(t)) return ab
  }
  return null
}
