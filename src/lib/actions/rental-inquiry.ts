'use server'

import { z } from 'zod'
import { Resend } from 'resend'
import { getPayloadClient } from '@/lib/payload/queries'
import { captureBookingLead } from './booking-lead'
import { sendLeadConfirmation } from '@/lib/signup/notify'
import {
  RENTAL_TYPES,
  RENTAL_TYPE_LABELS,
  RENTAL_PIANO_TYPES,
  RENTAL_PIANO_TYPE_LABELS,
} from '@/lib/rentals'

/**
 * Rental inquiry from /store/[storeslug]/rentals.
 *
 * Mirrors the Back to School booking flow:
 *   1. Upserts the customer into Shopify (the CRM), tagged 'rental-inquiry',
 *      `rental:<type>` and the storefront slug, with the request in the note.
 *   2. Emails the showroom (showroomInfo.email) via Resend; reply-to is the
 *      customer. Falls back to LEAD_NOTIFY_FALLBACK_EMAIL when a store has no
 *      email configured.
 *   3. Sends the customer a best-effort confirmation.
 */

const inquirySchema = z.object({
  firstName: z.string().trim().min(1, 'Please enter your first name').max(100),
  lastName: z.string().trim().min(1, 'Please enter your last name').max(100),
  email: z.string().trim().email('Please enter a valid email address').max(200),
  phone: z.string().trim().max(30).optional(),
  storeslug: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
  rentalType: z.enum(RENTAL_TYPES),
  pianoType: z.enum(RENTAL_PIANO_TYPES),
  timeframe: z.string().trim().max(100).optional(),
  message: z.string().trim().max(2000).optional(),
})

export type RentalInquiryInput = z.infer<typeof inquirySchema>

export interface RentalInquiryResult {
  ok: boolean
  error?: string
  fieldErrors?: Partial<Record<keyof RentalInquiryInput, string>>
}

const GENERIC_ERROR =
  'Something went wrong sending your inquiry. Please try again, or call the showroom directly.'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildStoreEmailHtml(input: RentalInquiryInput & { storeName: string }): string {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:8px 16px;color:#8a8578;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:8px 16px;color:#1E1B16;font-size:14px;white-space:pre-wrap;">${escapeHtml(value)}</td>
    </tr>`

  return `
  <div style="background:#FAF8F5;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #DBDBDB;border-top:3px solid #E11922;">
      <div style="padding:24px 24px 16px;">
        <p style="margin:0 0 4px;color:#E11922;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;font-weight:600;">Piano Rentals &middot; New Inquiry</p>
        <h1 style="margin:0;color:#1E1B16;font-size:22px;font-weight:600;">${escapeHtml(input.firstName)} ${escapeHtml(input.lastName)} is interested in renting.</h1>
      </div>
      <table style="width:100%;border-collapse:collapse;border-top:1px solid #EFEDE8;">
        ${row('Rental type', RENTAL_TYPE_LABELS[input.rentalType])}
        ${row('Piano', RENTAL_PIANO_TYPE_LABELS[input.pianoType])}
        ${input.timeframe ? row('Timeframe', input.timeframe) : ''}
        ${row('Showroom', input.storeName)}
        ${row('Email', input.email)}
        ${input.phone ? row('Phone', input.phone) : ''}
        ${input.message ? row('Message', input.message) : ''}
      </table>
      <div style="padding:16px 24px 24px;border-top:1px solid #EFEDE8;">
        <p style="margin:0;color:#6b6659;font-size:13px;line-height:1.6;">
          Reply to this email to respond to the customer directly — replies go
          straight to them. They were told to expect a reply from the showroom
          within one business day.
        </p>
      </div>
    </div>
  </div>`
}

export async function submitRentalInquiry(
  rawInput: RentalInquiryInput,
): Promise<RentalInquiryResult> {
  const parsed = inquirySchema.safeParse(rawInput)
  if (!parsed.success) {
    const fieldErrors: RentalInquiryResult['fieldErrors'] = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof RentalInquiryInput | undefined
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message
    }
    return { ok: false, error: 'Please check the form for errors.', fieldErrors }
  }
  const input = parsed.data

  interface StorefrontLookup {
    locationName?: string | null
    showroomInfo?: {
      name?: string | null
      email?: string | null
      address?: string | null
      phone?: string | null
    } | null
    showroomCtas?: { directionsLink?: string | null } | null
    hours?: Array<{ day?: string | null; time?: string | null }> | null
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
    console.error('[rental-inquiry] Storefront lookup failed:', error)
  }
  if (!storefront) return { ok: false, error: GENERIC_ERROR }

  const storeName = storefront.showroomInfo?.name ?? storefront.locationName ?? input.storeslug

  const noteLines = [
    `Rental inquiry — ${storeName}`,
    `Type: ${RENTAL_TYPE_LABELS[input.rentalType]}`,
    `Piano: ${RENTAL_PIANO_TYPE_LABELS[input.pianoType]}`,
    input.timeframe ? `Timeframe: ${input.timeframe}` : null,
    input.message ? `Message: ${input.message}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  // CRM first — a lead in Shopify is worth keeping even if the email fails.
  // captureBookingLead never throws; it tags with customTags + storeslug + site.
  await captureBookingLead({
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    storeslug: input.storeslug,
    customTags: ['rental-inquiry', `rental:${input.rentalType}`, `rental-piano:${input.pianoType}`],
    note: noteLines,
  })

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn(`[rental-inquiry] RESEND_API_KEY missing — store notification skipped (${input.storeslug})`)
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
      subject: `Rental inquiry — ${input.firstName} ${input.lastName} — ${RENTAL_PIANO_TYPE_LABELS[input.pianoType]}`,
      html: buildStoreEmailHtml({ ...input, storeName }),
      tags: [
        { name: 'campaign', value: 'rental-inquiry' },
        { name: 'store', value: input.storeslug },
      ],
    })
    if (error) {
      console.error('[rental-inquiry] Resend send failed:', error.message)
      return { ok: false, error: GENERIC_ERROR }
    }
  } catch (error) {
    console.error('[rental-inquiry] Resend send threw:', error)
    return { ok: false, error: GENERIC_ERROR }
  }

  // Best-effort customer confirmation — the inquiry already reached the store.
  try {
    const address = storefront.showroomInfo?.address?.trim() ?? ''
    const directionsUrl =
      storefront.showroomCtas?.directionsLink?.trim() ||
      (address ? `https://maps.google.com/?q=${encodeURIComponent(address)}` : '')
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kawaius.com'
    const brandedStore = /kawai/i.test(storeName) ? storeName : `Kawai ${storeName}`

    await sendLeadConfirmation({
      submissionId: crypto.randomUUID(),
      to: input.email,
      firstName: input.firstName,
      campaignTitle: `Thanks for your rental inquiry`,
      eyebrow: 'Piano Rentals',
      storeName,
      subject: `We received your rental inquiry — ${brandedStore}`,
      body:
        `Thank you for your interest in renting a Kawai piano from ${brandedStore}. ` +
        `A member of our showroom team will reply within one business day to talk through ` +
        `models, availability and rates. You're always welcome to visit the showroom to ` +
        `compare instruments in person.`,
      details: {
        heading: 'Why rent from Kawai',
        items: [
          {
            label: 'Brand-new instruments',
            value: 'Acoustic and digital pianos, rented exclusively through Kawai-owned stores.',
          },
          {
            label: 'Rent first, then decide',
            value: 'If you purchase, the first six months of rental fees can be applied toward the down payment.',
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
    console.error('[rental-inquiry] Customer confirmation failed:', error)
  }

  return { ok: true }
}
