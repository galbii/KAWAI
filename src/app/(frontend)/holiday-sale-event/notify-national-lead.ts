'use server'

import { sendNationalHolidayLead } from './national-lead'

/**
 * A national /holiday-sale-event lead → the RSM, holiday-branded, plus a
 * confirmation to the visitor (kawai-lead-rsm-holiday v1, Nov 25, 2026).
 * The routing and both emails are described in ./national-lead.ts.
 *
 * Fire-and-forget from the lead provider; never throws. Only the form values
 * come from the browser; every recipient is decided server-side.
 *
 * The routing core (Payload) and the signup mailer (Resend) are imported
 * inside the function so the page's client config can reference this action
 * without pulling them into the client graph or tests.
 */
export async function notifyHolidayNationalLead(
  values: Record<string, string>,
  source: string,
): Promise<{ success: boolean }> {
  try {
    const [{ runLeadNotification }, { sendLeadConfirmation }] = await Promise.all([
      import('@/lib/rsm/lead-notify-core'),
      import('@/lib/signup/notify'),
    ])
    return await sendNationalHolidayLead(values, source, { runLeadNotification, sendLeadConfirmation })
  } catch (err) {
    console.error('[holiday-national-lead] Failed:', err)
    return { success: false }
  }
}
