export type DealerRegion = 'us' | 'canada' | 'other'

export function classifyDealerCountry(
  country: string | null | undefined,
): DealerRegion {
  if (country === 'Canada') return 'canada'
  if (country === 'USA' || country === 'PR' || !country) return 'us'
  return 'other'
}
