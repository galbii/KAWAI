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

/** Every interpolated value is escaped — a lead's name reaches a human inbox. */
export function buildNotificationHtml(input: NotificationInput): string {
  const rows: [string, string][] = [
    ['Name', `${input.firstName} ${input.lastName}`.trim()],
    ['Email', input.email],
  ]
  if (input.phone) rows.push(['Phone', input.phone])
  if (input.zip) rows.push(['ZIP', input.zip])

  const contact = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#6b655c">${escapeHtml(k)}</td><td style="padding:4px 0"><strong>${escapeHtml(v)}</strong></td></tr>`,
    )
    .join('')

  const answers = input.answers.length
    ? `<h3 style="margin:20px 0 6px;font-size:14px">Responses</h3><table style="border-collapse:collapse;font-size:14px">${input.answers
        .map(
          (a) =>
            `<tr><td style="padding:4px 12px 4px 0;color:#6b655c">${escapeHtml(a.label)}</td><td style="padding:4px 0"><strong>${escapeHtml(a.value)}</strong></td></tr>`,
        )
        .join('')}</table>`
    : ''

  return `<div style="font-family:-apple-system,Segoe UI,sans-serif;color:#1E1B16">
<h2 style="margin:0 0 4px;font-size:18px">New signup — ${escapeHtml(input.campaignTitle)}</h2>
<p style="margin:0 0 16px;color:#6b655c;font-size:13px">${escapeHtml(input.storeName)}</p>
<table style="border-collapse:collapse;font-size:14px">${contact}</table>
${answers}
${input.sourceUrl ? `<p style="margin-top:20px;font-size:12px;color:#a39c92">Submitted from ${escapeHtml(input.sourceUrl)}</p>` : ''}
</div>`
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

  return `<div style="font-family:-apple-system,Segoe UI,sans-serif;color:#1E1B16;line-height:1.6">
<p style="margin:0 0 12px">Hi ${escapeHtml(input.firstName)},</p>
<p style="margin:0 0 12px">${escapeHtml(body)}</p>
<p style="margin:24px 0 0;color:#6b655c;font-size:13px">${escapeHtml(input.storeName)}</p>
</div>`
}
