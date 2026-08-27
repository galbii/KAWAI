/**
 * Appointment scheduling for the Back to School program — pure functions shared
 * by the booking modal (client) and the booking server action, which re-derives
 * the same slots to reject any tampered date/time.
 *
 * Storefront hours are free-text CMS strings ("10:00 am–7:00 pm", "1:00 PM -
 * 5:00 PM", "Closed"), so parsing is deliberately forgiving: any en/em dash or
 * hyphen separates the range, minutes and meridiems are optional, and a string
 * that mentions neither a time nor "closed" falls back to a conservative
 * 10:00–18:00 day rather than locking the store out of bookings.
 */

import { CAMPAIGN_YEAR, CAMPAIGN_MONTH, WINDOW_START_DAY, WINDOW_END_DAY } from './campaign'

export interface HoursEntry {
  day?: string | null
  time?: string | null
}

/** Minutes since midnight for open/close. */
export interface DayWindow {
  open: number
  close: number
}

const WEEKDAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const

/** Applied when a day's hours string exists but can't be parsed as a range. */
const FALLBACK_WINDOW: DayWindow = { open: 10 * 60, close: 18 * 60 }

/** Appointments start on the hour and block out this long before closing. */
const SLOT_MINUTES = 60

function toMinutes(hourRaw: number, minute: number, meridiem: string | undefined): number {
  let hour = hourRaw % 12
  if (meridiem === 'pm') hour += 12
  // No meridiem given: treat 1–7 as afternoon (nobody opens a showroom at 1 AM)
  if (!meridiem && hourRaw >= 1 && hourRaw <= 7) hour = hourRaw + 12
  return hour * 60 + minute
}

/**
 * Parse one hours string into an open/close window. Returns null for closed
 * days. Exported for the server action's re-validation.
 */
export function parseTimeRange(raw: string | null | undefined): DayWindow | null {
  if (!raw) return null
  const text = raw.toLowerCase().replace(/[–—]/g, '-').trim()
  if (text.includes('closed')) return null

  const match = text.match(
    /(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*-\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/,
  )
  if (!match) return FALLBACK_WINDOW

  const open = toMinutes(Number(match[1]), Number(match[2] ?? 0), match[3])
  const close = toMinutes(Number(match[4]), Number(match[5] ?? 0), match[6])
  if (close <= open) return FALLBACK_WINDOW
  return { open, close }
}

/** Find the hours window for a JS Date's weekday. Null = closed that day. */
export function windowForDate(hours: HoursEntry[] | null | undefined, date: Date): DayWindow | null {
  const weekday = WEEKDAYS[date.getDay()]
  if (!weekday) return null
  const entry = hours?.find((h) => h.day?.toLowerCase().trim().startsWith(weekday.slice(0, 3)))
  // No CMS hours at all → assume the fallback window so booking still works;
  // an entry that exists but reads "Closed" correctly yields null.
  if (!entry) return hours && hours.length > 0 ? null : FALLBACK_WINDOW
  return parseTimeRange(entry.time)
}

/** '13:00' minutes → '1:00 PM'. */
export function formatSlot(minutes: number): string {
  const hour24 = Math.floor(minutes / 60)
  const minute = minutes % 60
  const meridiem = hour24 >= 12 ? 'PM' : 'AM'
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12
  return `${hour12}:${String(minute).padStart(2, '0')} ${meridiem}`
}

/**
 * Bookable time labels for one date, hourly on the hour, ending an hour before
 * close. "10:00 am–7:00 pm" → 10:00 AM … 6:00 PM.
 */
export function slotsForDate(hours: HoursEntry[] | null | undefined, date: Date): string[] {
  const window = windowForDate(hours, date)
  if (!window) return []
  const slots: string[] = []
  const firstSlot = Math.ceil(window.open / 60) * 60
  for (let t = firstSlot; t + SLOT_MINUTES <= window.close; t += SLOT_MINUTES) {
    slots.push(formatSlot(t))
  }
  return slots
}

/** Every Date in the campaign window, Sept 7–30 inclusive. */
export function campaignDates(): Date[] {
  const dates: Date[] = []
  for (let day = WINDOW_START_DAY; day <= WINDOW_END_DAY; day++) {
    dates.push(new Date(CAMPAIGN_YEAR, CAMPAIGN_MONTH - 1, day))
  }
  return dates
}

/** In-window, not before today, and the store is open that day. */
export function isBookableDate(
  hours: HoursEntry[] | null | undefined,
  date: Date,
  now: Date = new Date(),
): boolean {
  if (date.getFullYear() !== CAMPAIGN_YEAR || date.getMonth() !== CAMPAIGN_MONTH - 1) return false
  const day = date.getDate()
  if (day < WINDOW_START_DAY || day > WINDOW_END_DAY) return false
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (date < today) return false
  return windowForDate(hours, date) !== null
}

/** '2026-09-12' → Date (local). Returns null for anything else. */
export function parseCampaignDate(iso: string): Date | null {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null
  const [, y, m, d] = match
  const date = new Date(Number(y), Number(m) - 1, Number(d))
  if (date.getFullYear() !== Number(y) || date.getMonth() !== Number(m) - 1 || date.getDate() !== Number(d)) return null
  return date
}

export function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

/** 'Saturday, September 12, 2026' — used in the modal, the email, and Shopify notes. */
export function formatLongDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}
