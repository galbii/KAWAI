/**
 * Pure formatting for signup notification emails.
 *
 * Deliberately free of `server-only` and of the Resend client so these
 * functions stay unit-testable — `server-only` is resolved by Next at build
 * time and does not exist as a real package, so importing it here would make
 * every test in this file unrunnable.
 */
import { escapeHtml } from '@/lib/rsm/lead-email'
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

/** A label/value row. Labels here are marketer-authored, so they are escaped too. */
function detailRow(label: string, value: string): string {
  return `<tr><td style="padding:6px 16px 6px 0;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td><td style="padding:6px 0;color:#1E1B16;font-size:14px">${escapeHtml(value)}</td></tr>`
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
    ? `${sectionLabel('Responses')}<table style="border-collapse:collapse">${input.answers
        .map((a) => detailRow(a.label, a.value))
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

/** Confirmation email sent to the person who signed up. */
export function buildConfirmationHtml(input: {
  firstName: string
  campaignTitle: string
  storeName: string
  body: string
}): string {
  const body =
    input.body ||
    `We've received your signup for ${input.campaignTitle} at ${input.storeName}. We'll be in touch shortly with the details.`

  return emailShell({
    eyebrow: input.storeName,
    title: input.campaignTitle,
    body: `<p style="margin:0 0 12px">Hi ${escapeHtml(input.firstName)},</p>
<p style="margin:0 0 12px">${escapeHtml(body)}</p>
<p style="margin:24px 0 0;color:#6b7280;font-size:12px">${escapeHtml(input.storeName)}</p>`,
  })
}
