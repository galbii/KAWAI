export interface ResolvableCampaign {
  slug: string
  isActive: boolean
  isDefault: boolean
  /** ISO strings as Payload returns them, or null for open-ended. */
  startDate: string | null
  endDate: string | null
}

export interface CampaignResolution<T extends ResolvableCampaign = ResolvableCampaign> {
  status: 'active' | 'ended' | 'missing'
  campaign: T | null
}

interface ResolveOptions {
  /** The campaign slug from the URL, or null for the bare /signup URL. */
  slug: string | null
  now: Date
}

/**
 * Decide which campaign a request resolves to.
 *
 * Pure so every date-boundary case is testable without a database. The caller
 * supplies only campaigns already scoped to the requested storefront.
 *
 * An expired campaign resolves to `ended`, not `missing` — these URLs are
 * printed on flyers and encoded in QR codes that outlive the promo, so a 404
 * would discard real traffic and the link equity built up with it.
 */
export function resolveCampaign<T extends ResolvableCampaign>(
  candidates: T[],
  { slug, now }: ResolveOptions,
): CampaignResolution<T> {
  const live = candidates.filter((c) => c.isActive)

  if (slug) {
    const named = live.find((c) => c.slug === slug)
    if (!named) return { status: 'missing', campaign: null }
    if (hasEnded(named, now)) return { status: 'ended', campaign: named }
    if (!hasStarted(named, now)) return { status: 'missing', campaign: null }
    return { status: 'active', campaign: named }
  }

  const defaults = live
    .filter((c) => c.isDefault && hasStarted(c, now) && !hasEnded(c, now))
    .sort((a, b) => startTime(b) - startTime(a))

  const chosen = defaults[0]
  return chosen ? { status: 'active', campaign: chosen } : { status: 'missing', campaign: null }
}

function hasStarted(campaign: ResolvableCampaign, now: Date): boolean {
  if (!campaign.startDate) return true
  return new Date(campaign.startDate).getTime() <= now.getTime()
}

function hasEnded(campaign: ResolvableCampaign, now: Date): boolean {
  if (!campaign.endDate) return false
  return new Date(campaign.endDate).getTime() < now.getTime()
}

function startTime(campaign: ResolvableCampaign): number {
  return campaign.startDate ? new Date(campaign.startDate).getTime() : 0
}
