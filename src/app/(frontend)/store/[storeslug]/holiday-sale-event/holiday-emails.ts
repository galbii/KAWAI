/**
 * The two holiday-sale-event emails, in the shared Kawai branded template
 * (src/lib/email/branded-email.ts): the customer's confirmation and the
 * store's lead notification. Both are signed with the store's own name and
 * contact details from its storefront record (by slug).
 *
 * Pure: the server action (`notify-store-lead.ts`) looks the storefront up and
 * sends; the preview script (`scripts/preview-holiday-emails.ts`) renders the
 * same builders to files without sending anything.
 *
 * Words are today's: the confirmation copy and subject from
 * `holidayConfirmationCopy`, the store subject from `buildDealerEmailSubject`,
 * the store body from `buildDealerEmailHtml` ("chosen" wording). No rates or
 * financing terms appear in either email.
 */
import {
  callout,
  button,
  detailsTable,
  detailsText,
  paragraph,
  renderBrandedEmail,
  sectionLabel,
  telHref,
  type RenderedEmail,
  type StoreContact,
} from '@/lib/email/branded-email'
import {
  buildDealerEmailSubject,
  escapeHtml,
  testBanner,
  type LeadEmailValues,
} from '@/lib/rsm/lead-email'
import type { LeadEnvelope } from '@/lib/rsm/lead-envelopes'
import { holidayConfirmationCopy, type HolidayStore } from './store-inbox'

export interface HolidayEmail extends RenderedEmail {
  subject: string
}

/** The customer's confirmation: thanks, the store will be in touch, how to reach it. */
export function buildHolidayConfirmationEmail({
  firstName,
  store,
  contact,
  test = false,
}: {
  firstName: string
  store: HolidayStore
  contact: StoreContact
  /** Prefix the subject with [TEST] (LEAD_NOTIFY_TEST_INBOX). */
  test?: boolean
}): HolidayEmail {
  const copy = holidayConfirmationCopy(store)
  const subject = test ? `[TEST] ${copy.subject}` : copy.subject
  const name = firstName.trim() || 'there'

  const actions = [
    contact.directionsUrl ? button(contact.directionsUrl, 'Get directions', 'primary') : '',
    contact.phone ? button(telHref(contact.phone), `Call ${contact.phone}`, 'secondary') : '',
  ].join('')

  const contentHtml = [
    paragraph(`Hi ${escapeHtml(name)},`),
    paragraph(escapeHtml(copy.body)),
    paragraph(
      `Questions before then? Just reply to this email — it goes straight to the ${escapeHtml(contact.name)} team.`,
    ),
    actions ? `${sectionLabel('Visit the showroom')}<div>${actions}</div>` : '',
  ].join('\n')

  const contentText = [
    `Hi ${name},`,
    '',
    copy.body,
    '',
    `Questions before then? Just reply to this email — it goes straight to the ${contact.name} team.`,
  ].join('\n')

  const rendered = renderBrandedEmail({
    subject,
    preheader: `The ${contact.name} team will be in touch soon with pricing and inventory.`,
    eyebrow: contact.name,
    title: copy.campaignTitle,
    contentHtml,
    contentText,
    store: contact,
    finePrint: `You're receiving this because you asked the ${contact.name} showroom about the ${copy.campaignTitle} on kawaius.com.`,
  })
  return { subject, ...rendered }
}

/** The store's notification: a new lead chose this showroom; reply to reach them. */
export function buildHolidayStoreNotificationEmail({
  lead,
  contact,
  source,
  test,
}: {
  lead: LeadEmailValues
  contact: StoreContact
  source: string
  /** LEAD_NOTIFY_TEST_INBOX copy: the test banner with the live envelope. */
  test?: { label?: string; envelope?: LeadEnvelope } | undefined
}): HolidayEmail {
  const subject = buildDealerEmailSubject({ lead, ...(test ? { test } : {}) })
  const fullName = [lead.firstname, lead.lastname].filter(Boolean).join(' ')
  const firstName = lead.firstname || 'They'

  const rows: Array<[string, string | undefined]> = [
    ['Name', fullName || undefined],
    ['Email', lead.email],
    ['Phone', lead.phone],
    ['ZIP / Postal', lead.zip],
    ['Shopping for', lead.piano_type?.replaceAll(';', ', ')],
    ['Timeframe', lead.when_are_you_looking_to_purchase_?.replaceAll('_', ' ')],
  ]

  const contentHtml = [
    paragraph(`Hello ${escapeHtml(contact.name)},`),
    paragraph(
      `Good news — a customer looking for a Kawai piano asked to be connected with you. Here's how to reach ${escapeHtml(fullName || 'them')}.`,
    ),
    detailsTable(rows),
    callout(
      `<strong>Just hit reply</strong> — your response goes straight to ${escapeHtml(firstName)}. The sooner they hear from you, the better.`,
    ),
  ].join('\n')

  const contentText = [
    `Hello ${contact.name},`,
    '',
    `Good news — a customer looking for a Kawai piano asked to be connected with you. Here's how to reach ${fullName || 'them'}.`,
    '',
    detailsText(rows),
    '',
    `Just hit reply — your response goes straight to ${firstName}. The sooner they hear from you, the better.`,
  ].join('\n')

  const noticeText = test
    ? [
        `TEST EMAIL — not a real lead${test.label ? ` — ${test.label}` : ''}.`,
        ...(test.envelope
          ? [
              'Live, this would have gone to:',
              `  To: ${test.envelope.to}`,
              `  Cc: ${test.envelope.cc.length ? test.envelope.cc.join(', ') : 'none'}`,
              `  Bcc: ${test.envelope.bcc.length ? test.envelope.bcc.join(', ') : 'none'}`,
            ]
          : []),
      ].join('\n')
    : undefined

  const rendered = renderBrandedEmail({
    subject,
    preheader: `${fullName || 'A customer'} chose ${contact.name} on the Holiday Sale Event page.`,
    eyebrow: 'New Customer Lead',
    title: 'Someone chose your showroom',
    contentHtml,
    contentText,
    store: contact,
    ...(test ? { noticeHtml: testBanner(test), noticeText } : {}),
    finePrint: `Sent by Kawai America because this customer selected your location on kawaius.com (source: ${source}).`,
  })
  return { subject, ...rendered }
}
