/**
 * Pure tag construction for signup leads. Kept free of `server-only` and the
 * Shopify client so it stays unit-testable.
 */
/**
 * Tags for a signup lead's Shopify customer record.
 *
 * `signup-{slug}` and `store-{storeslug}` are always present so any campaign's
 * leads are segmentable in Shopify without the marketer remembering to add them
 * by hand.
 */
export function buildSignupTags(
  campaignTags: string[],
  campaignSlug: string,
  storeslug: string,
  siteTags: string[],
): string[] {
  const all = [...campaignTags, `signup-${campaignSlug}`, `store-${storeslug}`, ...siteTags]

  const seen = new Set<string>()
  const out: string[] = []

  for (const tag of all) {
    const trimmed = tag?.trim()
    if (!trimmed || seen.has(trimmed)) continue
    seen.add(trimmed)
    out.push(trimmed)
  }

  return out
}

