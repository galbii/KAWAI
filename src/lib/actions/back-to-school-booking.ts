'use server'

import { z } from 'zod'
import { Resend } from 'resend'
import { getPayloadClient } from '@/lib/payload/queries'
import { captureBookingLead } from './booking-lead'
import { sendLeadConfirmation } from '@/lib/signup/notify'
import { DEADLINE_LONG, DATE_RANGE } from '@/components/back-to-school/campaign'
import { appointmentIcsUrl, googleCalendarUrl } from '@/components/back-to-school/calendar'
import {
  slotsForDate,
  parseCampaignDate,
  isBookableDate,
  formatLongDate,
  type HoursEntry,
} from '@/components/back-to-school/schedule'

/**
 * Back to School appointment request — replaces the Calendly embed.
 *
 * One submission does three things:
 *   1. Upserts the customer into Shopify (the CRM), tagged with the sale
 *      ('back-to-school') and the storefront slug, with the requested
 *      appointment in the customer note.
 *   2. Emails the showroom (showroomInfo.email) via Resend with the contact
 *      details and requested time; reply-to is the customer so the store can
 *      answer in one click. Falls back to LEAD_NOTIFY_FALLBACK_EMAIL (the same
 *      inbox unrouted signup leads use) when a store has no email configured.
 *   3. Re-derives the store's open slots server-side and rejects any date/time
 *      the UI could not have offered, so the window and store hours are
 *      enforced here, not just in the browser.
 */

const bookingSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(30).optional(),
  storeslug: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
  /** Local calendar date, e.g. '2026-09-12'. */
  date: z.string().trim(),
  /** Slot label exactly as offered, e.g. '11:00 AM'. */
  time: z.string().trim().max(10),
})

export type BackToSchoolBookingInput = z.infer<typeof bookingSchema>

export interface BackToSchoolBookingResult {
  ok: boolean
  error?: string
}

const GENERIC_ERROR =
  'Something went wrong sending your request. Please try again, or call the showroom directly.'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildStoreEmailHtml(input: {
  firstName: string
  lastName: string
  email: string
  phone?: string | undefined
  storeName: string
  when: string
}): string {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:8px 16px;color:#8a8578;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;white-space:nowrap;">${label}</td>
      <td style="padding:8px 16px;color:#1E1B16;font-size:14px;">${escapeHtml(value)}</td>
    </tr>`

  return `
  <div style="background:#FAF8F5;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #DBDBDB;border-top:3px solid #E11922;">
      <div style="padding:24px 24px 16px;">
        <p style="margin:0 0 4px;color:#E11922;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;font-weight:600;">Back to School &middot; Appointment Request</p>
        <h1 style="margin:0;color:#1E1B16;font-size:22px;font-weight:600;">${escapeHtml(input.firstName)} ${escapeHtml(input.lastName)} wants to come play a few.</h1>
      </div>
      <table style="width:100%;border-collapse:collapse;border-top:1px solid #EFEDE8;">
        ${row('Requested time', input.when)}
        ${row('Showroom', input.storeName)}
        ${row('Email', input.email)}
        ${input.phone ? row('Phone', input.phone) : ''}
      </table>
      <div style="padding:16px 24px 24px;border-top:1px solid #EFEDE8;">
        <p style="margin:0;color:#6b6659;font-size:13px;line-height:1.6;">
          Reply to this email to confirm the time with the customer directly —
          replies go straight to them. They were told to expect a confirmation
          from the showroom.
        </p>
      </div>
    </div>
  </div>`
}

export async function bookBackToSchoolAppointment(
  rawInput: BackToSchoolBookingInput,
): Promise<BackToSchoolBookingResult> {
  const parsed = bookingSchema.safeParse(rawInput)
  if (!parsed.success) return { ok: false, error: 'Please check your details and try again.' }
  const input = parsed.data

  const date = parseCampaignDate(input.date)
  if (!date) return { ok: false, error: 'Please pick a date within the program.' }

  // Storefront lookup — also the source of truth for hours, the store inbox,
  // and everything the customer confirmation needs (address, phone, directions).
  interface StorefrontLookup {
    locationName?: string | null
    showroomInfo?: {
      name?: string | null
      email?: string | null
      address?: string | null
      phone?: string | null
    } | null
    showroomCtas?: { directionsLink?: string | null } | null
    hours?: HoursEntry[] | null
  }
  let storefront: StorefrontLookup | null = null
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'storefronts',
      where: { slug: { equals: input.storeslug }, isActive: { equals: true } },
      select: { locationName: true, showroomInfo: true, showroomCtas: true, hours: true },
      depth: 0,
      limit: 1,
    })
    storefront = (result.docs[0] as StorefrontLookup | undefined) ?? null
  } catch (error) {
    console.error('[bts-booking] Storefront lookup failed:', error)
  }
  if (!storefront) return { ok: false, error: GENERIC_ERROR }

  const hours = storefront.hours ?? null
  if (!isBookableDate(hours, date) || !slotsForDate(hours, date).includes(input.time)) {
    return { ok: false, error: 'That time is no longer available — please pick another.' }
  }

  const storeName = storefront.showroomInfo?.name ?? storefront.locationName ?? input.storeslug
  const when = `${formatLongDate(date)} at ${input.time}`

  // CRM first — a lead in Shopify is worth keeping even if the email fails.
  // captureBookingLead never throws; it tags with customTags + storeslug + site.
  await captureBookingLead({
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    storeslug: input.storeslug,
    customTags: ['back-to-school'],
    note: `Back to School appointment request: ${when} — ${storeName}`,
  })

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // Dev / misconfigured env: the lead is in Shopify with the requested time in
    // its note, so don't fail the visitor over a missing key — just make noise.
    console.warn(`[bts-booking] RESEND_API_KEY missing — store notification skipped (${when})`)
    return { ok: true }
  }

  const to =
    storefront.showroomInfo?.email?.trim() ||
    process.env.LEAD_NOTIFY_FALLBACK_EMAIL?.trim() ||
    process.env.RESEND_FROM_EMAIL ||
    'noreply@kawaius.com'

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'noreply@kawaius.com',
      to: [to],
      replyTo: input.email,
      subject: `Appointment request — ${input.firstName} ${input.lastName} — ${when}`,
      html: buildStoreEmailHtml({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        storeName,
        when,
      }),
      tags: [
        { name: 'campaign', value: 'back-to-school' },
        { name: 'store', value: input.storeslug },
      ],
    })
    if (error) {
      console.error('[bts-booking] Resend send failed:', error.message)
      return { ok: false, error: GENERIC_ERROR }
    }
  } catch (error) {
    console.error('[bts-booking] Resend send threw:', error)
    return { ok: false, error: GENERIC_ERROR }
  }

  // Warm confirmation to the customer — appointment, address, directions, and
  // a way back to the storefront page. Best-effort: the booking already
  // succeeded (Shopify + store notification), so a hiccup here must not turn
  // the success screen into an error.
  try {
    const address = storefront.showroomInfo?.address?.trim() ?? ''
    const directionsUrl =
      storefront.showroomCtas?.directionsLink?.trim() ||
      (address ? `https://maps.google.com/?q=${encodeURIComponent(address)}` : '')
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kawaius.com'

    // The store's own name usually already carries "Kawai" — don't double it.
    const brandedStore = /kawai/i.test(storeName) ? storeName : `Kawai ${storeName}`
    const dateLabel = formatLongDate(date)
    const icsUrl = appointmentIcsUrl(
      { storeslug: input.storeslug, isoDate: input.date, time: input.time },
      siteUrl,
    )
    const googleUrl = googleCalendarUrl({
      storeName,
      isoDate: input.date,
      time: input.time,
      address: address || null,
      details: `Your Back to School appointment at ${brandedStore}. The pianos will be uncovered and in tune when you arrive.`,
    })

    await sendLeadConfirmation({
      submissionId: crypto.randomUUID(),
      to: input.email,
      firstName: input.firstName,
      campaignTitle: `You're invited to ${brandedStore}`,
      eyebrow: 'Back to School · Official Invitation',
      storeName,
      subject: `Your invitation — ${when} at ${brandedStore}`,
      body:
        `This is your official invitation to the Back to School Piano Sale Event at ` +
        `${brandedStore}. We have you down for ${when}, and the pianos will be uncovered and ` +
        `in tune when you arrive. Reply to this email with anything you'd like set aside to ` +
        `play, and the showroom will confirm your time shortly.`,
      appointment: {
        dateLabel,
        timeLabel: input.time,
        storeName: brandedStore,
        eyebrow: 'Official Invitation',
        icsUrl,
        ...(googleUrl ? { googleUrl } : {}),
      },
      details: {
        heading: 'What to expect',
        items: [
          {
            label: 'An hour with the pianos, not a pitch',
            value: 'Nothing to sign, no obligation — play as many as you like.',
          },
          {
            label: 'Your rebate is held',
            value: `Back to School pricing runs ${DATE_RANGE} and is locked for you through ${DEADLINE_LONG}.`,
          },
          {
            label: 'Bring an appraisal if you have one',
            value: 'We beat any written independent appraisal on your trade-in by $500.',
          },
        ],
      },
      location: address
        ? {
            storeName,
            address,
            phone: storefront.showroomInfo?.phone ?? undefined,
            directionsUrl,
            hours: (storefront.hours ?? [])
              .filter((h): h is { day: string; time: string } => Boolean(h.day && h.time))
              .map((h) => ({ day: h.day, time: h.time })),
          }
        : null,
      storefrontUrl: `${siteUrl}/store/${input.storeslug}`,
      replyTo: to,
      liveSendEnabled: true,
    })
  } catch (error) {
    console.error('[bts-booking] Customer confirmation failed:', error)
  }

  return { ok: true }
}
