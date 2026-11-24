'use server'

import { createHash } from 'node:crypto'
import { Resend } from 'resend'
import { leadEmailSchema } from '@/lib/rsm/lead-email'
import { storeContactFromStorefront } from '@/lib/email/branded-email'
import { describeEnvelope } from '@/lib/rsm/lead-envelopes'
import { holidayConfirmationCopy, planHolidayLeadEmails } from './store-inbox'
import { STORE_SALE_PATH } from './sale-path'
import { buildHolidayConfirmationEmail, buildHolidayStoreNotificationEmail } from './holiday-emails'

/**
 * A holiday-sale-event lead → that page's store inbox, plus a confirmation to
 * the person who submitted it. Replaces the national ZIP → RSM routing on
 * this page only; /fall-financing and every other campaign page still call
 * notifyRsmOfLead directly.
 *
 * Only `storeSlug` comes from the browser. The inbox is looked up from the
 * fixed map in ./store-inbox, so no address the client sends can be emailed.
 * A slug not in the map falls back to notifyRsmOfLead: today's routing.
 *
 * Same contract as notifyRsmOfLead: fire-and-forget from the form's
 * `onComplete`, never throws, every failure logged, each send independent.
 * Same valves: LEAD_NOTIFY_TEST_INBOX redirects every send (no CC); the
 * page's FALL_FINANCING_TEST_MODE dry run without a test inbox holds both
 * emails and logs the envelope. Idempotency keys stop a double-fired submit
 * from emailing twice.
 *
 * Both emails use the shared Kawai branded template (./holiday-emails →
 * src/lib/email/branded-email.ts): logo, brand colours and type, HTML plus a
 * plain-text part, and a footer signed with the store's name and contact
 * details from its storefront record (looked up once, by slug). A failed
 * lookup still sends both, signed with the store's name only.
 *
 * Heavy, server-only modules (Payload, the signup mailer, the national
 * action) are imported inside the function so the page's client config can
 * reference this action without pulling them into the client graph or tests.
 */
export async function notifyHolidayStoreLead(
  values: Record<string, string>,
  storeSlug: string,
  source: string,
): Promise<{ success: boolean }> {
  try {
    const parsed = leadEmailSchema.safeParse(values)
    const lead = parsed.success ? parsed.data : null
    const testInbox = process.env.LEAD_NOTIFY_TEST_INBOX?.trim() || null
    const testMode = process.env.FALL_FINANCING_TEST_MODE === 'true'
    const plan = lead ? planHolidayLeadEmails({ storeSlug, leadEmail: lead.email, testInbox, testMode }) : null

    if (!lead || !plan) {
      // Unknown slug (or a payload the national path will reject and log the
      // same way): today's routing, unchanged.
      const { notifyRsmOfLead } = await import('@/lib/actions/notify-rsm-of-lead')
      return await notifyRsmOfLead(values, source)
    }

    const apiKey = process.env.RESEND_API_KEY
    const fromAddress = process.env.RESEND_FROM_EMAIL
    const leadKey = createHash('sha256').update(`${storeSlug}|${lead.email}|${lead.zip}`).digest('hex')
    const tag = (v: string) => v.replace(/[^A-Za-z0-9_-]/g, '_')

    // — The store's record, once, for both emails' footer and the
    //   confirmation's location. A failure never stops a send. —
    let storefront: unknown = null
    let storePageUrl = ''
    try {
      const { getStorefrontBySlugDirect } = await import('@/lib/payload/queries')
      const { getSiteUrl } = await import('@/lib/site-context')
      storePageUrl = `${getSiteUrl('us')}/store/${storeSlug}/${STORE_SALE_PATH}`
      storefront = await getStorefrontBySlugDirect(storeSlug).catch((err: unknown) => {
        console.error('[holiday-lead] Storefront lookup failed — sending without the store contact card:', err)
        return null
      })
    } catch (err) {
      console.error('[holiday-lead] Storefront lookup failed — sending without the store contact card:', err)
    }
    const contact = storeContactFromStorefront(storefront, {
      displayName: plan.store.name,
      ...(storePageUrl ? { pageUrl: storePageUrl } : {}),
    })

    // — The store's notification: the "someone chose your showroom" email,
    //   Reply-To the customer, corporate CC'd (dropped under the test inbox). —
    let storeSent = false
    const storeEmail = buildHolidayStoreNotificationEmail({
      lead,
      contact,
      source,
      ...(testInbox ? { test: { label: 'Holiday store notification', envelope: plan.storeEnvelope } } : {}),
    })
    const subject = storeEmail.subject
    if (!plan.live) {
      console.log(
        `[holiday-lead] HELD (test mode, no LEAD_NOTIFY_TEST_INBOX) — store email would have gone ` +
          `${describeEnvelope(plan.storeEnvelope)} (subject: "${subject}").`,
      )
    } else if (!apiKey || !fromAddress) {
      console.error('[holiday-lead] RESEND_API_KEY / RESEND_FROM_EMAIL not configured — skipping')
    } else {
      try {
        const { data, error } = await new Resend(apiKey).emails.send(
          {
            from: fromAddress,
            to: [plan.storeSend.to],
            ...(plan.storeSend.cc.length > 0 ? { cc: plan.storeSend.cc } : {}),
            replyTo: lead.email,
            subject,
            html: storeEmail.html,
            text: storeEmail.text,
            tags: [
              { name: 'source', value: tag(source) },
              { name: 'store', value: tag(storeSlug) },
            ],
          },
          { idempotencyKey: `holiday-store-lead/${leadKey}` },
        )
        if (error) {
          console.error('[holiday-lead] Resend error on store email:', error)
        } else {
          storeSent = true
          console.log(
            testInbox
              ? `[holiday-lead] Sent store email (${data?.id}) to TEST INBOX ${testInbox} — live routing would have been ${describeEnvelope(plan.storeEnvelope)}`
              : `[holiday-lead] Sent store email (${data?.id}) ${describeEnvelope(plan.storeEnvelope)}`,
          )
        }
      } catch (err) {
        console.error('[holiday-lead] Failed to send store email:', err)
      }
    }

    // — The confirmation to the person who submitted: the branded holiday
    //   confirmation, signed with the store's name, address, phone and hours. —
    let confirmed = false
    try {
      const { sendLeadConfirmation } = await import('@/lib/signup/notify')
      const { extractConfirmationLocation } = await import('@/lib/signup/confirmation-content')

      const location = extractConfirmationLocation(storefront, null)
      const copy = holidayConfirmationCopy(plan.store)
      const confirmation = buildHolidayConfirmationEmail({
        firstName: lead.firstname || 'there',
        store: plan.store,
        contact,
        test: Boolean(testInbox),
      })

      const result = await sendLeadConfirmation({
        submissionId: `holiday-${leadKey}`,
        to: plan.confirmationTo,
        firstName: lead.firstname || 'there',
        campaignTitle: copy.campaignTitle,
        storeName: copy.storeName,
        subject: confirmation.subject,
        body: copy.body,
        location: location ? { ...location, storeName: plan.store.name } : null,
        ...(storePageUrl ? { storefrontUrl: storePageUrl } : {}),
        rendered: { html: confirmation.html, text: confirmation.text },
        replyTo: plan.confirmationReplyTo,
        liveSendEnabled: plan.live,
      })
      confirmed = result.status === 'sent'
      console.log(
        `[holiday-lead] Confirmation ${result.status}` +
          (testInbox ? ` to TEST INBOX ${testInbox} (live: the lead)` : ' to the lead'),
      )
    } catch (err) {
      console.error('[holiday-lead] Failed to send confirmation:', err)
    }

    return { success: storeSent || confirmed }
  } catch (err) {
    console.error('[holiday-lead] Failed:', err)
    return { success: false }
  }
}
