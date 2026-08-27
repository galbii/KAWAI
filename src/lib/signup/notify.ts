import 'server-only'
import { Resend } from 'resend'
import { resolveSignupRecipients, type RecipientInput } from './recipients'
import {
  buildNotificationSubject,
  buildNotificationHtml,
  buildConfirmationHtml,
  sanitizeTag,
} from './notify-format'
import type { ConfirmationDetails, ConfirmationLocation } from './confirmation-content'
import type { SignupAnswer } from './types'

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

interface SendInput extends NotificationInput {
  submissionId: string
  campaignSlug: string
  storeslug: string
  subjectTemplate: string
  liveSendEnabled: boolean
  recipients: RecipientInput
}


export async function sendSignupNotification(
  input: SendInput,
): Promise<{ status: 'sent' | 'failed' | 'held'; emailId?: string }> {
  const { to, cc } = resolveSignupRecipients(input.recipients)

  // Held-back safety valve: the pipeline runs end to end and logs the exact
  // recipients a live send would use, so routing is verifiable before a single
  // real email leaves. Mirrors notify-rsm-of-lead.ts.
  if (!input.liveSendEnabled) {
    console.info(
      `[signup] HELD — would notify To: ${to.join(', ')} Cc: ${cc.join(', ') || '(none)'} for submission ${input.submissionId}`,
    )
    return { status: 'held' }
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[signup] RESEND_API_KEY missing — notification skipped')
    return { status: 'failed' }
  }

  try {
    const resend = new Resend(apiKey)
    const { data, error } = await resend.emails.send(
      {
        from: process.env.RESEND_FROM_EMAIL ?? 'noreply@kawaius.com',
        to,
        ...(cc.length ? { cc } : {}),
        replyTo: input.email,
        subject: buildNotificationSubject(input.subjectTemplate, {
          campaign: input.campaignTitle,
          store: input.storeName,
          firstName: input.firstName,
        }),
        html: buildNotificationHtml(input),
        tags: [
          { name: 'campaign', value: sanitizeTag(input.campaignSlug) },
          { name: 'store', value: sanitizeTag(input.storeslug) },
        ],
      },
      // Expires after 24h; pattern is <event-type>/<entity-id>. A double-fired
      // submit cannot notify twice.
      { idempotencyKey: `signup-lead/${input.submissionId}` },
    )

    if (error) {
      console.error('[signup] Resend notification failed:', error.message)
      return { status: 'failed' }
    }

    return { status: 'sent', ...(data?.id ? { emailId: data.id } : {}) }
  } catch (error) {
    console.error('[signup] Resend notification threw:', error)
    return { status: 'failed' }
  }
}

/**
 * Confirmation to the person who signed up.
 *
 * Held back by the same `liveSendEnabled` flag as the internal notification —
 * turning a campaign live is one decision, not two.
 */
export async function sendLeadConfirmation(input: {
  submissionId: string
  to: string
  firstName: string
  campaignTitle: string
  storeName: string
  subject: string
  body: string
  details?: ConfirmationDetails | null | undefined
  location?: ConfirmationLocation | null | undefined
  /** Link back to the store's page on the site, rendered after the location card. */
  storefrontUrl?: string | null | undefined
  /** Where a customer's reply should land — the store inbox, not the noreply sender. */
  replyTo?: string | undefined
  /** Header eyebrow override — defaults to the store name. */
  eyebrow?: string | undefined
  liveSendEnabled: boolean
}): Promise<{ status: 'sent' | 'failed' | 'skipped'; emailId?: string }> {
  if (!input.liveSendEnabled) {
    console.info(`[signup] HELD — would confirm to ${input.to} for submission ${input.submissionId}`)
    return { status: 'skipped' }
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return { status: 'skipped' }

  try {
    const resend = new Resend(apiKey)
    const { data, error } = await resend.emails.send(
      {
        from: process.env.RESEND_FROM_EMAIL ?? 'noreply@kawaius.com',
        to: [input.to],
        ...(input.replyTo ? { replyTo: input.replyTo } : {}),
        subject: input.subject,
        html: buildConfirmationHtml({
          firstName: input.firstName,
          campaignTitle: input.campaignTitle,
          storeName: input.storeName,
          body: input.body,
          details: input.details,
          location: input.location,
          storefrontUrl: input.storefrontUrl,
          eyebrow: input.eyebrow,
        }),
      },
      { idempotencyKey: `signup-confirm/${input.submissionId}` },
    )

    if (error) {
      console.error('[signup] Confirmation failed:', error.message)
      return { status: 'failed' }
    }
    return { status: 'sent', ...(data?.id ? { emailId: data.id } : {}) }
  } catch (error) {
    console.error('[signup] Confirmation threw:', error)
    return { status: 'failed' }
  }
}
