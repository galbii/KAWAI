/**
 * Pure formatting for signup notification emails.
 *
 * Deliberately free of `server-only` and of the Resend client so these
 * functions stay unit-testable — `server-only` is resolved by Next at build
 * time and does not exist as a real package, so importing it here would make
 * every test in this file unrunnable.
 */
import { escapeHtml } from '@/lib/rsm/lead-email'
import type { ConfirmationDetails, ConfirmationLocation } from './confirmation-content'
import type { SignupAnswer } from './types'

interface SubjectVars {
  campaign: string
  store: string
  firstName: string
}

export function buildNotificationSubject(template: string, vars: SubjectVars): string {
  if (!template.trim()) return `New signup — ${vars.campaign} (${vars.store})`

  return template
    .replace(/\{\{campaign\}\}/g, vars.campaign)
    .replace(/\{\{store\}\}/g, vars.store)
    .replace(/\{\{firstName\}\}/g, vars.firstName)
}

interface NotificationInput {
  campaignTitle: string
  storeName: string
  firstName: string
  lastName: string
  email: string
  phone?: string | undefined
  zip?: string | undefined
  answers: SignupAnswer[]
  sourceUrl?: string | undefined
}

/* ------------------------------------------------------------------ *
 * Branded shell.
 *
 * Matches the RSM lead emails sent from /signup and /signup2
 * (src/lib/rsm/lead-email.ts) — same pearl page, same white card, same black
 * header band with a red eyebrow — so a recipient who gets both does not see
 * two different companies. The values are duplicated rather than imported
 * because that module builds whole documents, not a shell; if the two ever
 * need to move together, extracting a shared one is the fix.
 *
 * Table-based rows and fully inline styles are not stylistic choices: email
 * clients strip <style> blocks and have no flexbox worth relying on.
 * ------------------------------------------------------------------ */

function emailShell({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string
  title: string
  body: string
}): string {
  return `<!DOCTYPE html>
<html>
  <body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#FAF8F5;padding:40px 20px;color:#1E1B16">
    <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #DBDBDB;border-radius:8px;overflow:hidden">
      <div style="background:#1E1B16;padding:24px 32px">
        <p style="margin:0;color:#E11922;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase">${escapeHtml(eyebrow)}</p>
        <h1 style="margin:6px 0 0;color:#fff;font-size:20px;font-weight:700">${escapeHtml(title)}</h1>
      </div>
      <div style="padding:28px 32px;font-size:14px;line-height:1.6">${body}</div>
    </div>
  </body>
</html>`
}

/**
 * A two-column label/value row.
 *
 * Only for the fixed contact fields — Name, Email, Phone, ZIP. Their labels are
 * one short word, so `nowrap` costs nothing and the columns stay aligned.
 */
function detailRow(label: string, value: string): string {
  return `<tr><td style="padding:6px 16px 6px 0;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td><td style="padding:6px 0;color:#1E1B16;font-size:14px">${escapeHtml(value)}</td></tr>`
}

/**
 * A stacked label/value row for a campaign question.
 *
 * Question labels are whole sentences a marketer typed — "Which would you like
 * to study?", "I'm also interested in piano rental or purchase options" — not
 * one-word field names. Rendering those through `detailRow` put a ~400px
 * nowrap, uppercased sentence in the label column of a 520px card, leaving the
 * answer a sliver of width or pushing it out of the card entirely, depending on
 * the client. Stacking gives the label the full width to wrap into and puts the
 * answer on its own line, where it is the thing that reads first.
 *
 * `width="100%"` is an attribute as well as a style because Outlook's Word
 * renderer ignores CSS widths on tables.
 */
function answerRow(label: string, value: string): string {
  return `<tr><td style="padding:0 0 14px 0">
  <div style="color:#6b7280;font-size:12px;line-height:1.4">${escapeHtml(label)}</div>
  <div style="margin-top:2px;color:#1E1B16;font-size:15px;font-weight:600;line-height:1.5">${escapeHtml(value)}</div>
</td></tr>`
}

/** Section label, styled like the red eyebrows in the RSM emails. */
function sectionLabel(text: string): string {
  return `<p style="margin:24px 0 8px;color:#E11922;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase">${escapeHtml(text)}</p>`
}

/** Every interpolated value is escaped — a lead's name reaches a human inbox. */
export function buildNotificationHtml(input: NotificationInput): string {
  const rows: [string, string][] = [
    ['Name', `${input.firstName} ${input.lastName}`.trim()],
    ['Email', input.email],
  ]
  if (input.phone) rows.push(['Phone', input.phone])
  if (input.zip) rows.push(['ZIP', input.zip])

  const contact = rows.map(([k, v]) => detailRow(k, v)).join('')

  const answers = input.answers.length
    ? `${sectionLabel('Responses')}<table width="100%" style="width:100%;border-collapse:collapse">${input.answers
        .map((a) => answerRow(a.label, a.value))
        .join('')}</table>`
    : ''

  return emailShell({
    // The store is the letterhead; the heading keeps the existing sentence
    // intact rather than being split across the two slots.
    eyebrow: input.storeName,
    title: `New signup — ${input.campaignTitle}`,
    body: `<table style="border-collapse:collapse">${contact}</table>
${answers}
${input.sourceUrl ? `<p style="margin:24px 0 0;color:#6b7280;font-size:12px">Submitted from ${escapeHtml(input.sourceUrl)}</p>` : ''}`,
  })
}

/** Resend tag values accept only ASCII letters, numbers, underscores and dashes. */
export function sanitizeTag(value: string): string {
  return value.replace(/[^A-Za-z0-9_-]/g, '-').slice(0, 60)
}

/**
 * Flatten a Lexical richText document to plain text.
 *
 * The confirmation email needs a body a marketer can edit, but pulling in a
 * full Lexical→HTML converter for one paragraph is not worth the weight. Text
 * extraction covers what these bodies actually contain.
 */
export function lexicalToPlainText(doc: unknown): string {
  const out: string[] = []

  const walk = (node: any) => {
    if (!node || typeof node !== 'object') return
    if (typeof node.text === 'string') out.push(node.text)
    const children = node.children ?? node.root?.children
    if (Array.isArray(children)) children.forEach(walk)
  }

  walk(doc)
  return out.join(' ').replace(/\s+/g, ' ').trim()
}

/** A value-prop row: the promise on the left, the specific on the right. */
function includedRow(label: string, value: string): string {
  return `<tr>
  <td style="padding:0 14px 10px 0;vertical-align:top;white-space:nowrap"><span style="color:#E11922;font-size:14px;font-weight:700">&#10003;</span></td>
  <td style="padding:0 0 10px 0;vertical-align:top">
    <div style="color:#1E1B16;font-size:14px;font-weight:600;line-height:1.4">${escapeHtml(label)}</div>
    <div style="margin-top:1px;color:#6b7280;font-size:14px;line-height:1.5">${escapeHtml(value)}</div>
  </td>
</tr>`
}

/** One opening-hours line. */
function hoursRow(day: string, time: string): string {
  return `<tr><td style="padding:2px 16px 2px 0;color:#6b7280;font-size:13px;white-space:nowrap">${escapeHtml(day)}</td><td style="padding:2px 0;color:#1E1B16;font-size:13px">${escapeHtml(time)}</td></tr>`
}

/**
 * Confirmation email sent to the person who signed up.
 *
 * Carries the campaign's value props and the showroom address, so the thing
 * sitting in the lead's inbox on the day still tells them what they signed up
 * for and where to go. Both sections are optional — a campaign with no Event
 * Details block, or a storefront with no address, simply renders without them
 * rather than showing an empty heading.
 *
 * The marketer's `body` copy is untouched and stays the first thing read.
 */
export function buildConfirmationHtml(input: {
  firstName: string
  campaignTitle: string
  storeName: string
  body: string
  details?: ConfirmationDetails | null | undefined
  location?: ConfirmationLocation | null | undefined
  /** Link back to the store's page on the site, rendered after the location card. */
  storefrontUrl?: string | null | undefined
  /** Header eyebrow override — defaults to the store name. */
  eyebrow?: string | undefined
}): string {
  const body =
    input.body ||
    `We've received your signup for ${input.campaignTitle} at ${input.storeName}. We'll be in touch shortly with the details.`

  const details = input.details
    ? `${sectionLabel(input.details.heading)}<table width="100%" style="width:100%;border-collapse:collapse">${input.details.items
        .map((i) => includedRow(i.label, i.value))
        .join('')}</table>`
    : ''

  const loc = input.location
  const hours =
    loc && loc.hours.length
      ? `<p style="margin:14px 0 4px;color:#6b7280;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase">Opening hours</p>
<table style="border-collapse:collapse">${loc.hours.map((h) => hoursRow(h.day, h.time)).join('')}</table>`
      : ''

  // The address is a real <address> element and the phone a tel: link — on a
  // phone, which is where most of these are read, that is the difference
  // between tapping to call and copying digits by hand.
  const location = loc
    ? `${sectionLabel('Where to find us')}
<div style="border:1px solid #DBDBDB;border-radius:6px;padding:16px">
  <div style="color:#1E1B16;font-size:14px;font-weight:600">Kawai ${escapeHtml(loc.storeName)}</div>
  <address style="margin:4px 0 0;color:#6b7280;font-size:14px;font-style:normal;line-height:1.5">${escapeHtml(loc.address)}</address>
  ${loc.phone ? `<div style="margin-top:4px;font-size:14px"><a href="tel:${escapeHtml(loc.phone.replace(/[^\d+]/g, ''))}" style="color:#1E1B16;text-decoration:none">${escapeHtml(loc.phone)}</a></div>` : ''}
  <div style="margin-top:12px"><a href="${escapeHtml(loc.directionsUrl)}" style="display:inline-block;background:#E11922;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;padding:9px 16px;border-radius:4px">Get directions</a></div>
  ${hours}
</div>`
    : ''

  const storefrontLink = input.storefrontUrl
    ? `<p style="margin:20px 0 0;font-size:14px"><a href="${escapeHtml(input.storefrontUrl)}" style="color:#E11922;font-weight:700;text-decoration:none">Visit the ${escapeHtml(input.storeName)} showroom online &rarr;</a></p>`
    : ''

  return emailShell({
    eyebrow: input.eyebrow ?? input.storeName,
    title: input.campaignTitle,
    body: `<p style="margin:0 0 12px">Hi ${escapeHtml(input.firstName)},</p>
<p style="margin:0 0 12px">${escapeHtml(body)}</p>
${details}
${location}
${storefrontLink}
<p style="margin:24px 0 0;color:#6b7280;font-size:12px">${escapeHtml(input.storeName)}</p>`,
  })
}
