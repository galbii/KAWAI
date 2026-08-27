/**
 * Pull the confirmation email's content out of the campaign and storefront.
 *
 * The email a lead receives should carry the same promises the page made —
 * what's included, and where to actually turn up — rather than a bare "we got
 * it". Both already exist as CMS data, so they are read from the same records
 * the page renders instead of being retyped into a second place that can drift.
 *
 * Pure and free of `server-only` so it stays unit-testable, matching
 * notify-format.ts. The `unknown`/`any` handling is deliberate: these come from
 * Payload's loosely-typed block array, and a campaign missing a block is the
 * normal case, not an error.
 */

export interface ConfirmationDetailItem {
  label: string
  value: string
}

export interface ConfirmationDetails {
  heading: string
  items: ConfirmationDetailItem[]
}

export interface ConfirmationHours {
  day: string
  time: string
}

export interface ConfirmationLocation {
  storeName: string
  address: string
  phone?: string | undefined
  directionsUrl: string
  hours: ConfirmationHours[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function findBlock(blocks: unknown, blockType: string): Record<string, unknown> | null {
  if (!Array.isArray(blocks)) return null
  for (const block of blocks) {
    if (isRecord(block) && block.blockType === blockType) return block
  }
  return null
}

/**
 * The value props, straight off the campaign's Event Details block.
 *
 * Returns null when the campaign has no such block or every row is blank —
 * an empty "What's included" heading over nothing reads as a broken email.
 */
export function extractConfirmationDetails(blocks: unknown): ConfirmationDetails | null {
  const block = findBlock(blocks, 'signup-details')
  if (!block) return null

  const rows = Array.isArray(block.items) ? block.items : []
  const items: ConfirmationDetailItem[] = []

  for (const row of rows) {
    if (!isRecord(row)) continue
    const label = text(row.label)
    const value = text(row.value)
    // Both halves are required in the CMS, but a half-filled row saved before
    // that rule existed would otherwise render as a dangling label.
    if (!label || !value) continue
    items.push({ label, value })
  }

  if (items.length === 0) return null
  return { heading: text(block.heading) || 'What to expect', items }
}

/**
 * Where the lead should go.
 *
 * The address comes from the storefront rather than the Location block — the
 * block only decides how the page presents it. So a campaign with no Location
 * block still gets an address in its email, which is the whole point of putting
 * it there. Opening hours follow the block's `showHours` toggle when a block
 * exists, so the email does not contradict the page.
 */
export function extractConfirmationLocation(
  storefront: unknown,
  blocks: unknown,
): ConfirmationLocation | null {
  if (!isRecord(storefront)) return null

  const showroom = isRecord(storefront.showroomInfo) ? storefront.showroomInfo : {}
  const address = text(showroom.address)
  if (!address) return null

  const storeName = text(storefront.locationName) || text(showroom.name) || 'our showroom'
  const phone = text(showroom.phone)

  const block = findBlock(blocks, 'signup-location')
  const showHours = block ? block.showHours !== false : true

  const hours: ConfirmationHours[] = []
  if (showHours && Array.isArray(storefront.hours)) {
    for (const row of storefront.hours) {
      if (!isRecord(row)) continue
      const day = text(row.day)
      const time = text(row.time)
      if (!day || !time) continue
      hours.push({ day, time })
    }
  }

  return {
    storeName,
    address,
    ...(phone ? { phone } : {}),
    // Same link the page's "Get directions" uses, so both open the same pin.
    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`,
    hours,
  }
}
