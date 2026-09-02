/**
 * Calendar handoff for a booked Back to School appointment.
 *
 * Pure functions, shared by the booking modal (client), the confirmation email
 * (server action) and the .ics route — the same appointment has to describe
 * itself identically in all three.
 *
 * Times are written *floating*: `20260912T110000`, with no timezone and no Z.
 * Storefronts run from Hawaii to Massachusetts and the CMS records no timezone
 * for them, so a stamped UTC offset would be a guess. Floating time means every
 * calendar client reads 11:00 AM as 11:00 AM local — which is what both the
 * customer and the showroom mean, since they are in the same place.
 */

/** How long an appointment blocks out, in minutes. Matches SLOT_MINUTES. */
export const APPOINTMENT_MINUTES = 60

/** '11:00 AM' → 660. Returns null for anything that isn't a slot label. */
export function slotToMinutes(label: string): number | null {
  const match = label.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return null
  const hour12 = Number(match[1])
  const minute = Number(match[2])
  const meridiem = (match[3] ?? '').toUpperCase()
  if (hour12 < 1 || hour12 > 12 || minute > 59) return null
  const hour = meridiem === 'PM' ? (hour12 % 12) + 12 : hour12 % 12
  return hour * 60 + minute
}

/** '2026-09-12' + 660 → '20260912T110000'. */
export function floatingStamp(isoDate: string, minutes: number): string | null {
  const date = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!date) return null
  const total = ((minutes % 1440) + 1440) % 1440
  const hh = String(Math.floor(total / 60)).padStart(2, '0')
  const mm = String(total % 60).padStart(2, '0')
  return `${date[1]}${date[2]}${date[3]}T${hh}${mm}00`
}

/** Start and end stamps for a slot, or null if the slot label doesn't parse. */
export function appointmentStamps(
  isoDate: string,
  time: string,
): { start: string; end: string } | null {
  const minutes = slotToMinutes(time)
  if (minutes == null) return null
  const start = floatingStamp(isoDate, minutes)
  const end = floatingStamp(isoDate, minutes + APPOINTMENT_MINUTES)
  if (!start || !end) return null
  return { start, end }
}

/**
 * The event's title, used by the .ics file, Google, and the email alike.
 * A store name that already carries "Kawai" is not branded twice.
 */
export function appointmentTitle(storeName: string): string {
  const branded = /kawai/i.test(storeName) ? storeName : `Kawai ${storeName}`
  return `Back to School appointment — ${branded}`
}

/**
 * Link to the .ics route. `origin` is required for email (absolute URLs only);
 * omit it in the browser, where a root-relative path is what you want.
 */
export function appointmentIcsUrl(
  params: { storeslug: string; isoDate: string; time: string },
  origin = '',
): string {
  const query = new URLSearchParams({
    store: params.storeslug,
    date: params.isoDate,
    time: params.time,
  })
  return `${origin}/api/appointment/calendar?${query.toString()}`
}

export function googleCalendarUrl(params: {
  storeName: string
  isoDate: string
  time: string
  address?: string | null
  details?: string | null
}): string | null {
  const stamps = appointmentStamps(params.isoDate, params.time)
  if (!stamps) return null

  const query = new URLSearchParams({
    action: 'TEMPLATE',
    text: appointmentTitle(params.storeName),
    dates: `${stamps.start}/${stamps.end}`,
  })
  if (params.details) query.set('details', params.details)
  if (params.address) query.set('location', params.address)
  return `https://calendar.google.com/calendar/render?${query.toString()}`
}
