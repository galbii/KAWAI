import { NextResponse, type NextRequest } from 'next/server'
import { getPayloadClient } from '@/lib/payload/queries'
import {
  parseCampaignDate,
  slotsForDate,
  windowForDate,
  formatLongDate,
  type HoursEntry,
} from '@/components/back-to-school/schedule'
import {
  CAMPAIGN_YEAR,
  CAMPAIGN_MONTH,
  WINDOW_START_DAY,
  WINDOW_END_DAY,
  DEADLINE_LONG,
} from '@/components/back-to-school/campaign'
import { appointmentStamps, appointmentTitle } from '@/components/back-to-school/calendar'

/**
 * The .ics for a booked Back to School appointment.
 *
 * Linked from the confirmation email and the booking modal's success screen, so
 * it has to work months after the tab that booked it is gone — it takes only
 * the store, the date and the slot, and rebuilds every other field from the
 * storefront record. Nothing free-text reaches the file: the date and time are
 * re-validated against the store's own hours (the same check the booking action
 * runs), and everything else is read out of the CMS.
 *
 * Times are floating — no timezone. See calendar.ts for why.
 */

export const dynamic = 'force-dynamic'

const SLUG = /^[a-z0-9-]{1,100}$/

/** RFC 5545 escaping for text values. */
function esc(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

/** Fold to 75 octets per line, continuations prefixed with a space. */
function fold(line: string): string {
  if (line.length <= 75) return line
  const parts: string[] = [line.slice(0, 75)]
  let rest = line.slice(75)
  while (rest.length > 74) {
    parts.push(` ${rest.slice(0, 74)}`)
    rest = rest.slice(74)
  }
  if (rest) parts.push(` ${rest}`)
  return parts.join('\r\n')
}

interface StorefrontLookup {
  locationName?: string | null
  showroomInfo?: { name?: string | null; address?: string | null; phone?: string | null } | null
  hours?: HoursEntry[] | null
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const storeslug = params.get('store')?.trim() ?? ''
  const isoDate = params.get('date')?.trim() ?? ''
  const time = params.get('time')?.trim() ?? ''

  if (!SLUG.test(storeslug)) {
    return NextResponse.json({ error: 'Unknown store.' }, { status: 400 })
  }

  const date = parseCampaignDate(isoDate)
  if (
    !date ||
    date.getFullYear() !== CAMPAIGN_YEAR ||
    date.getMonth() !== CAMPAIGN_MONTH - 1 ||
    date.getDate() < WINDOW_START_DAY ||
    date.getDate() > WINDOW_END_DAY
  ) {
    return NextResponse.json({ error: 'That date is outside the program.' }, { status: 400 })
  }

  let storefront: StorefrontLookup | null = null
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'storefronts',
      where: { slug: { equals: storeslug }, isActive: { equals: true } },
      select: { locationName: true, showroomInfo: true, hours: true },
      depth: 0,
      limit: 1,
    })
    storefront = (result.docs[0] as StorefrontLookup | undefined) ?? null
  } catch (error) {
    console.error('[appointment-ics] Storefront lookup failed:', error)
    return NextResponse.json({ error: 'Could not build that invitation.' }, { status: 500 })
  }
  if (!storefront) return NextResponse.json({ error: 'Unknown store.' }, { status: 404 })

  const hours = storefront.hours ?? null
  // Deliberately not isBookableDate(): that also rejects dates in the past, and
  // adding a past appointment to a calendar is a reasonable thing to want.
  if (!windowForDate(hours, date) || !slotsForDate(hours, date).includes(time)) {
    return NextResponse.json({ error: 'That time is not one of ours.' }, { status: 400 })
  }

  const stamps = appointmentStamps(isoDate, time)
  if (!stamps) return NextResponse.json({ error: 'That time is not one of ours.' }, { status: 400 })

  const rawStoreName = storefront.showroomInfo?.name ?? storefront.locationName ?? 'Kawai'
  // The store's own name usually already carries "Kawai" — don't double it.
  const storeName = /kawai/i.test(rawStoreName) ? rawStoreName : `Kawai ${rawStoreName}`
  const address = storefront.showroomInfo?.address?.trim() ?? ''
  const phone = storefront.showroomInfo?.phone?.trim() ?? ''
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kawaius.com'
  const pageUrl = `${siteUrl}/store/${storeslug}/back-to-school`

  const description = [
    `Your Back to School appointment at ${storeName} — ${formatLongDate(date)} at ${time}.`,
    'Pianos will be uncovered and in tune when you arrive.',
    phone ? `Questions: ${phone}` : '',
    `Back to School pricing and the $500 trade-in bonus are held for you through ${DEADLINE_LONG}.`,
  ]
    .filter(Boolean)
    .join('\n')

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kawai America//Back to School//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${esc(`bts-${storeslug}-${isoDate}-${stamps.start}@kawaius.com`)}`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
    `DTSTART:${stamps.start}`,
    `DTEND:${stamps.end}`,
    `SUMMARY:${esc(appointmentTitle(rawStoreName))}`,
    address ? `LOCATION:${esc(address)}` : '',
    `DESCRIPTION:${esc(description)}`,
    `URL:${esc(pageUrl)}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${esc(`Appointment at ${storeName} in 2 hours`)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean)

  const ics = `${lines.map(fold).join('\r\n')}\r\n`

  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="kawai-appointment.ics"',
      'Cache-Control': 'private, no-store',
    },
  })
}
