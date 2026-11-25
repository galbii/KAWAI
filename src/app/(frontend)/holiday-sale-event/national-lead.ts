import { createHash } from 'node:crypto'
import { leadEmailSchema } from '@/lib/rsm/lead-email'
import { leadCcAddress } from '@/lib/rsm/lead-envelopes'
import type { RunLeadNotificationOptions } from '@/lib/rsm/lead-notify-core'
import {
  buildNationalConfirmationEmail,
  kawaiAmericaContact,
  NATIONAL_CONFIRMATION,
  nationalHolidayTemplates,
} from './national-emails'

/** The two server-only senders, passed in by the server action. */
export interface NationalLeadDeps {
  runLeadNotification: (
    values: Record<string, string>,
    source: string,
    options: RunLeadNotificationOptions,
  ) => Promise<{ success: boolean }>
  sendLeadConfirmation: (input: {
    submissionId: string
    to: string
    firstName: string
    campaignTitle: string
    storeName: string
    subject: string
    body: string
    storefrontUrl?: string | null | undefined
    rendered?: { html: string; text: string } | undefined
    replyTo?: string | undefined
    liveSendEnabled: boolean
  }) => Promise<{ status: 'sent' | 'failed' | 'skipped' }>
}

/**
 * A national /holiday-sale-event lead → the RSM (holiday-branded) + a
 * confirmation to the person who submitted it (kawai-lead-rsm-holiday v1,
 * Nov 25, 2026).
 *
 * The RSM email is /fall-financing's routing, unchanged: ZIP → nearest
 * dealer's RSM, Canada west/east inbox, storefront area (LEAD_NOTIFY_STOREFRONT_EMAIL),
 * fallback inbox; held unless LEAD_NOTIFY_RSM_EMAIL is on; paused by the Home
 * Page CMS toggle; redirected by LEAD_NOTIFY_TEST_INBOX. Only the email's
 * words and look differ (./national-emails). Its idempotency keys are
 * namespaced `holiday-national-`, so a visitor who also submits
 * /fall-financing still reaches the RSM from both.
 *
 * The confirmation uses the store pages' valves: LEAD_NOTIFY_TEST_INBOX
 * redirects it; the page's FALL_FINANCING_TEST_MODE dry run without a test
 * inbox holds it (logged, not sent). Replies go to the corporate inbox
 * (LEAD_NOTIFY_CC_EMAIL, default contact@kawaius.com), never to an RSM.
 *
 * Only the form values come from the browser. Every recipient is decided
 * here. Fire-and-forget from the lead provider: never throws, every failure
 * logged, the two sends independent.
 *
 * Not a server action: ./notify-national-lead.ts is, and hands this the real
 * routing core and mailer. Taking them as arguments keeps Payload and Resend
 * out of this module, so it is unit-tested with fakes and no module mocks.
 */
export async function sendNationalHolidayLead(
  values: Record<string, string>,
  source: string,
  { runLeadNotification, sendLeadConfirmation }: NationalLeadDeps,
): Promise<{ success: boolean }> {
  try {
    const corporate = leadCcAddress()
    const contact = kawaiAmericaContact(corporate)

    const notify = (async () => {
      return runLeadNotification(values, source, {
        templates: nationalHolidayTemplates(contact),
        idempotencyNamespace: 'holiday-national',
        logTag: '[holiday-national-lead]',
      })
    })().catch((err: unknown) => {
      console.error('[holiday-national-lead] RSM notification failed:', err)
      return { success: false }
    })

    const confirm = (async (): Promise<boolean> => {
      const parsed = leadEmailSchema.safeParse(values)
      if (!parsed.success) {
        console.error('[holiday-national-lead] Invalid lead payload — no confirmation:', parsed.error.issues)
        return false
      }
      const lead = parsed.data
      const testInbox = process.env.LEAD_NOTIFY_TEST_INBOX?.trim() || null
      const testMode = process.env.FALL_FINANCING_TEST_MODE === 'true'
      const leadKey = createHash('sha256').update(`${lead.email}|${lead.zip}`).digest('hex')
      const email = buildNationalConfirmationEmail({
        firstName: lead.firstname || 'there',
        contact,
        test: Boolean(testInbox),
      })

      const result = await sendLeadConfirmation({
        submissionId: `holiday-national-${leadKey}`,
        to: testInbox ?? lead.email,
        firstName: lead.firstname || 'there',
        campaignTitle: NATIONAL_CONFIRMATION.campaignTitle,
        storeName: NATIONAL_CONFIRMATION.storeName,
        subject: email.subject,
        body: NATIONAL_CONFIRMATION.body,
        ...(contact.pageUrl ? { storefrontUrl: contact.pageUrl } : {}),
        rendered: { html: email.html, text: email.text },
        replyTo: corporate,
        liveSendEnabled: Boolean(testInbox) || !testMode,
      })
      console.log(
        `[holiday-national-lead] Confirmation ${result.status}` +
          (testInbox ? ` to TEST INBOX ${testInbox} (live: the lead)` : ' to the lead'),
      )
      return result.status === 'sent'
    })().catch((err: unknown) => {
      console.error('[holiday-national-lead] Failed to send confirmation:', err)
      return false
    })

    const [notified, confirmed] = await Promise.all([notify, confirm])
    return { success: notified.success || confirmed }
  } catch (err) {
    console.error('[holiday-national-lead] Failed:', err)
    return { success: false }
  }
}
