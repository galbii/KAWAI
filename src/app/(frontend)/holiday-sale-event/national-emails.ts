/**
 * The national /holiday-sale-event page's lead emails (kawai-lead-rsm-holiday
 * v1, Nov 25, 2026). The user: "make sure to send an email to the rsm as well
 * as the user and brand it like a holiday? just like fall financing but
 * different styling".
 *
 * Routing is /fall-financing's, unchanged (src/lib/rsm/lead-notify-core.ts):
 * these builders only replace the words and the look, in the same Kawai
 * branded template the store holiday pages send (src/lib/email/branded-email.ts):
 *
 *   - RSM notification: today's routing readout (lead details, nearest dealer
 *     or the visitor's choice, nearby showroom, unmatched warning), holiday
 *     branded. Never names which RSM or inbox was chosen.
 *   - Storefront variant: when a Kawai showroom owns the lead (storefront
 *     routing on), the narrow "a new lead in your area" email.
 *   - Visitor confirmation: thanks, your local dealer will be in touch, signed
 *     Kawai America with the corporate inbox (replies land there, never with
 *     an RSM's address).
 *
 * Pure string building: no Resend, no Payload, no env. The server action
 * (./notify-national-lead.ts) sends; scripts/preview-holiday-emails.ts renders
 * them to files.
 *
 * No rates or financing terms: a rate in an email is a credit advertisement
 * without its disclosure, so the emails name the offers' end date only.
 */
import {
  button,
  callout,
  detailsTable,
  detailsText,
  paragraph,
  renderBrandedEmail,
  sectionLabel,
  type RenderedEmail,
  type StoreContact,
} from '@/lib/email/branded-email'
import {
  escapeHtml,
  testBanner,
  type LeadEmailTestOptions,
  type LeadEmailValues,
} from '@/lib/rsm/lead-email'
import type { LeadNotificationTemplates } from '@/lib/rsm/lead-notify-core'
import type { LeadDealerChoice } from '@/lib/rsm/nearby-dealers'
import type { NearbyStorefrontOption } from '@/lib/rsm/nearby-storefront'
import type { RsmMatch } from '@/lib/rsm/routing'
import { PROGRAM_END } from '@/app/(frontend)/fall-financing/_components/campaign'
import { HOLIDAY_SALE_PATH } from './sale-path'

export interface NationalHolidayEmail extends RenderedEmail {
  subject: string
}

const CAMPAIGN = 'Holiday Sale Event'

/** Kawai America's signature: the corporate inbox, the national page. No invented phone or address. */
export function kawaiAmericaContact(email: string, siteUrl = 'https://kawaius.com'): StoreContact {
  return {
    name: 'Kawai America',
    ...(email ? { email } : {}),
    hours: [],
    pageUrl: `${siteUrl.replace(/\/+$/, '')}${HOLIDAY_SALE_PATH}`,
  }
}

function leadRows(lead: LeadEmailValues): Array<[string, string | undefined]> {
  return [
    ['Name', [lead.firstname, lead.lastname].filter(Boolean).join(' ') || undefined],
    ['Email', lead.email],
    ['Phone', lead.phone],
    ['ZIP / Postal', lead.zip],
    ['Shopping for', lead.piano_type?.replaceAll(';', ', ')],
    ['Timeframe', lead.when_are_you_looking_to_purchase_?.replaceAll('_', ' ')],
  ]
}

/** Plain-text twin of lead-email's testBanner, for the text part of a test copy. */
function testNoticeText(test: LeadEmailTestOptions): string {
  return [
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
}

function testNotice(test: LeadEmailTestOptions | undefined) {
  return test ? { noticeHtml: testBanner(test), noticeText: testNoticeText(test) } : {}
}

/* ------------------------------------------------------------------ *
 * RSM notification
 * ------------------------------------------------------------------ */

export interface NationalRsmEmailOptions {
  lead: LeadEmailValues
  match: RsmMatch | null
  source: string
  /** Whether the visitor-chosen dealer is being sent their own email. */
  dealerNotified: boolean
  storefront: NearbyStorefrontOption | null
  choice?: LeadDealerChoice | undefined
  /** Kawai America's footer. */
  contact: StoreContact
  test?: LeadEmailTestOptions | undefined
}

/** Subject: the same routing facts as today's RSM subject, holiday-named. */
export function buildNationalRsmSubject({
  lead,
  match,
  choice,
  test,
}: Pick<NationalRsmEmailOptions, 'lead' | 'match' | 'choice' | 'test'>): string {
  const prefix = test ? '[TEST] ' : ''
  if (choice?.kind === 'selected') {
    return `${prefix}New ${CAMPAIGN} lead for ${choice.dealer.name} — ${lead.zip}`
  }
  return match
    ? `${prefix}New ${CAMPAIGN} lead near ${match.dealer.address?.city ?? lead.zip} — ${lead.zip}`
    : `${prefix}New ${CAMPAIGN} lead — ${lead.zip} (unmatched)`
}

/** The routing readout, as [html, text] sections. Mirrors lead-email's buildLeadEmailHtml. */
function routingSections({
  match,
  choice,
  dealerNotified,
  storefront,
}: Pick<NationalRsmEmailOptions, 'match' | 'choice' | 'dealerNotified' | 'storefront'>): {
  html: string[]
  text: string[]
} {
  const html: string[] = []
  const text: string[] = []

  if (choice?.kind === 'selected') {
    const d = choice.dealer
    const rows: Array<[string, string | undefined]> = [
      ['Dealer', d.name],
      ['Location', [d.location, `${d.distance.toFixed(1)} mi from the lead`].filter(Boolean).join(' · ')],
      ['Contact', [d.phone, d.email].filter(Boolean).join(' · ') || undefined],
    ]
    const note = dealerNotified
      ? "The customer asked to be connected with this location. The dealer has been sent their own notification with the customer's details."
      : 'The customer asked to be connected with this location. The dealer has not been contacted — please make the introduction.'
    html.push(sectionLabel('Dealer the customer chose'), detailsTable(rows), paragraph(escapeHtml(note)))
    text.push('DEALER THE CUSTOMER CHOSE', detailsText(rows), note, '')
  } else if (choice?.kind === 'unsure') {
    const note =
      'They asked for a recommendation instead of picking a location — they are expecting you to point them at the right showroom.'
    html.push(sectionLabel("Customer wasn't sure which dealer"), paragraph(escapeHtml(note)))
    text.push("CUSTOMER WASN'T SURE WHICH DEALER", note, '')
  } else if (match) {
    const rows: Array<[string, string | undefined]> = [
      ['Dealer', match.dealer.dealerName],
      ['Location', [match.dealer.address?.city, match.dealer.address?.state].filter(Boolean).join(', ') || undefined],
      ['Distance', `${Math.round(match.distance * 10) / 10} miles from lead`],
      ['Territory', match.dealer.region ?? undefined],
    ]
    html.push(sectionLabel('Nearest dealer to this lead'), detailsTable(rows))
    text.push('NEAREST DEALER TO THIS LEAD', detailsText(rows), '')
  }

  if (storefront) {
    const how = storefront.coveredZip
      ? "ZIP is in this showroom's service area"
      : `${storefront.distance.toFixed(1)} mi from the lead`
    const rows: Array<[string, string | undefined]> = [
      ['Showroom', `Kawai ${storefront.name}`],
      ['Location', [storefront.location, how].filter(Boolean).join(' · ')],
      ['Contact', [storefront.phone, storefront.email].filter(Boolean).join(' · ') || undefined],
    ]
    const note = 'The showroom has not been sent this lead.'
    html.push(sectionLabel('Nearest Kawai showroom'), detailsTable(rows), paragraph(escapeHtml(note)))
    text.push('NEAREST KAWAI SHOWROOM', detailsText(rows), note, '')
  }

  // Shown whenever the ZIP couldn't be matched, regardless of the visitor's
  // choice — somebody has to know this lead needs a manual hand-off.
  if (!match) {
    const warn =
      'No RSM-managed dealer could be matched to this ZIP / postal code. Please forward this lead to the right territory.'
    html.push(callout(`⚠️ ${escapeHtml(warn)}`))
    text.push(`WARNING: ${warn}`, '')
  }

  return { html, text }
}

export function buildNationalRsmEmail(options: NationalRsmEmailOptions): NationalHolidayEmail {
  const { lead, source, contact, test } = options
  const subject = buildNationalRsmSubject(options)
  const fullName = [lead.firstname, lead.lastname].filter(Boolean).join(' ')
  const firstName = lead.firstname || 'them'
  const rows = leadRows(lead)
  const routing = routingSections(options)
  const intro = `A visitor asked about the Kawai ${CAMPAIGN} on kawaius.com and is waiting to hear from their local Kawai dealer.`
  const reply = `Just hit reply — your response goes straight to ${firstName}.`

  const contentHtml = [
    paragraph(escapeHtml(intro)),
    detailsTable(rows),
    ...routing.html,
    callout(`<strong>Just hit reply</strong> — your response goes straight to ${escapeHtml(firstName)}.`),
  ].join('\n')

  const contentText = [intro, '', detailsText(rows), '', ...routing.text, reply].join('\n')

  const rendered = renderBrandedEmail({
    subject,
    preheader: `${fullName || 'A customer'} (${lead.zip}) asked about the ${CAMPAIGN}.`,
    eyebrow: `${CAMPAIGN} · New Sales Lead`,
    title: `A new ${CAMPAIGN} lead`,
    contentHtml,
    contentText,
    store: contact,
    ...testNotice(test),
    finePrint: `Source: ${source} (national ${CAMPAIGN} page). Reply to this email to reach the lead directly.`,
  })
  return { subject, ...rendered }
}

/* ------------------------------------------------------------------ *
 * Storefront variant: a Kawai showroom owns the lead.
 * ------------------------------------------------------------------ */

export function buildNationalStorefrontEmail({
  lead,
  storefrontName,
  source,
  contact,
  test,
}: {
  lead: LeadEmailValues
  /** 'Kawai Dallas'. */
  storefrontName: string
  source: string
  contact: StoreContact
  test?: LeadEmailTestOptions | undefined
}): NationalHolidayEmail {
  const prefix = test ? '[TEST] ' : ''
  const fullName = [lead.firstname, lead.lastname].filter(Boolean).join(' ')
  const subject = `${prefix}New ${CAMPAIGN} lead — ${fullName || lead.zip}`
  const firstName = lead.firstname || 'They'
  const rows = leadRows(lead)
  const intro = `A customer near your showroom just asked Kawai about the ${CAMPAIGN}. Here's how to reach ${fullName || 'them'}.`

  const contentHtml = [
    paragraph(`Hello ${escapeHtml(storefrontName)},`),
    paragraph(escapeHtml(intro)),
    detailsTable(rows),
    callout(
      `<strong>Just hit reply</strong> — your response goes straight to ${escapeHtml(firstName)}. The sooner they hear from you, the better.`,
    ),
  ].join('\n')

  const contentText = [
    `Hello ${storefrontName},`,
    '',
    intro,
    '',
    detailsText(rows),
    '',
    `Just hit reply — your response goes straight to ${firstName}. The sooner they hear from you, the better.`,
  ].join('\n')

  const rendered = renderBrandedEmail({
    subject,
    preheader: `${fullName || 'A customer'} near ${storefrontName} asked about the ${CAMPAIGN}.`,
    eyebrow: `${CAMPAIGN} · New Customer Lead`,
    title: 'A new lead in your area',
    contentHtml,
    contentText,
    store: contact,
    ...testNotice(test),
    finePrint: `Sent by Kawai America because this customer, who is near your showroom, contacted Kawai on kawaius.com (source: ${source}).`,
  })
  return { subject, ...rendered }
}

/* ------------------------------------------------------------------ *
 * Visitor confirmation
 * ------------------------------------------------------------------ */

export const NATIONAL_CONFIRMATION = {
  campaignTitle: CAMPAIGN,
  storeName: 'Kawai America',
  subject: 'Thanks — your local Kawai dealer will be in touch',
  body:
    `Thanks for reaching out about the Kawai ${CAMPAIGN}. Your local Authorized Kawai dealer ` +
    `will be in touch soon with pricing and inventory for the pianos you're considering. ` +
    `The holiday offers run through ${PROGRAM_END}.`,
} as const

export function buildNationalConfirmationEmail({
  firstName,
  contact,
  test = false,
}: {
  firstName: string
  contact: StoreContact
  /** Prefix the subject with [TEST] (LEAD_NOTIFY_TEST_INBOX). */
  test?: boolean
}): NationalHolidayEmail {
  const copy = NATIONAL_CONFIRMATION
  const subject = test ? `[TEST] ${copy.subject}` : copy.subject
  const name = firstName.trim() || 'there'
  const replyLine = `Questions before then? Just reply to this email — it goes straight to the ${contact.name} team.`

  const contentHtml = [
    paragraph(`Hi ${escapeHtml(name)},`),
    paragraph(escapeHtml(copy.body)),
    paragraph(escapeHtml(replyLine)),
    contact.pageUrl ? `${sectionLabel('The holiday offers')}<div>${button(contact.pageUrl, `See the ${CAMPAIGN}`, 'primary')}</div>` : '',
  ].join('\n')

  const contentText = [`Hi ${name},`, '', copy.body, '', replyLine].join('\n')

  const rendered = renderBrandedEmail({
    subject,
    preheader: 'Your local Authorized Kawai dealer will be in touch soon with pricing and inventory.',
    eyebrow: contact.name,
    title: copy.campaignTitle,
    contentHtml,
    contentText,
    store: contact,
    finePrint: `You're receiving this because you asked Kawai about the ${CAMPAIGN} on kawaius.com.`,
  })
  return { subject, ...rendered }
}

/** The core pipeline's templates for this page: the two owner emails above, Kawai America-signed. */
export function nationalHolidayTemplates(contact: StoreContact): LeadNotificationTemplates {
  return {
    rsm: ({ lead, match, source, dealerNotified, storefront, choice, test }) =>
      buildNationalRsmEmail({ lead, match, source, dealerNotified, storefront, choice, contact, test }),
    storefront: ({ lead, storefrontName, source, test }) =>
      buildNationalStorefrontEmail({ lead, storefrontName, source, contact, test }),
  }
}
