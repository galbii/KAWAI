'use server'

import { headers } from 'next/headers'
import {
  getPayloadClient,
  getSignupCampaignsForStore,
  getStorefrontBySlugDirect,
  getMusicSchoolByStorefrontSlug,
} from '@/lib/payload/queries'
import { buildSignupSchema } from '@/lib/signup/schema'
import { denormalizeAnswers } from '@/lib/signup/answers'
import { resolveCampaign, type ResolvableCampaign } from '@/lib/signup/resolve'
import { sendSignupNotification, sendLeadConfirmation } from '@/lib/signup/notify'
import { lexicalToPlainText } from '@/lib/signup/notify-format'
import { buildSignupTags } from '@/lib/signup/shopify-tags'
import { syncSignupLeadToShopify } from '@/lib/signup/shopify'
import { siteTags } from '@/lib/shopify/site-tags'
import type { SignupQuestion } from '@/lib/signup/types'

export type SubmitResult =
  | { success: true; mode: 'message' | 'redirect'; message?: string; redirectUrl?: string }
  | { success: false; error: string }

interface SubmitInput {
  campaignSlug: string
  storeslug: string
  values: Record<string, unknown>
}

const GENERIC_SUCCESS = "Thanks — you're all set. Check your email for a confirmation."

/**
 * Handle one campaign form submission.
 *
 * Order is deliberate. The campaign is re-fetched server-side and the schema
 * derived from THAT — never from anything the client sent. If the client could
 * supply field definitions, a crafted POST would bypass every `required` rule
 * and every option whitelist.
 *
 * The lead is written before any outbound call, so the visitor's data is durable
 * before anything that can fail over the network is attempted. Notification,
 * confirmation and Shopify sync are independent: each records its own status on
 * the lead and none can fail the submission or suppress the others.
 */
export async function submitSignupCampaign(input: SubmitInput): Promise<SubmitResult> {
  try {
    // Honeypot: a hidden field only an automated filler would populate.
    // Report success so the bot learns nothing from the response.
    if (typeof input.values.company === 'string' && input.values.company.trim() !== '') {
      return { success: true, mode: 'message', message: GENERIC_SUCCESS }
    }

    const [storefront, campaigns] = await Promise.all([
      getStorefrontBySlugDirect(input.storeslug),
      getSignupCampaignsForStore(input.storeslug),
    ])

    if (!storefront) return { success: false, error: 'This store was not found.' }

    const { status, campaign } = resolveCampaign(
      campaigns.map((c) => ({
        ...c,
        isActive: Boolean(c.isActive),
        isDefault: Boolean(c.isDefault),
        startDate: c.startDate ?? null,
        endDate: c.endDate ?? null,
      })) as (ResolvableCampaign & (typeof campaigns)[number])[],
      { slug: input.campaignSlug, now: new Date() },
    )

    if (status !== 'active' || !campaign) {
      return { success: false, error: 'This signup is no longer accepting submissions.' }
    }

    const questions = (campaign.form?.questions ?? []) as unknown as SignupQuestion[]
    const schema = buildSignupSchema(
      {
        collectPhone: Boolean(campaign.form?.collectPhone),
        requirePhone: Boolean(campaign.form?.requirePhone),
        collectZip: Boolean(campaign.form?.collectZip),
        requireZip: Boolean(campaign.form?.requireZip),
      },
      questions,
    )

    const parsed = schema.safeParse(input.values)
    if (!parsed.success) {
      return { success: false, error: 'Please check the highlighted fields and try again.' }
    }

    const values = parsed.data as Record<string, unknown>
    const answers = denormalizeAnswers(questions, values)
    const headerList = await headers()
    const payload = await getPayloadClient()

    const firstName = String(values.firstName ?? '')
    const lastName = String(values.lastName ?? '')
    const email = String(values.email ?? '')
    const phone = values.phone ? String(values.phone) : undefined
    const zip = values.zip ? String(values.zip) : undefined
    const storeName: string = storefront.locationName ?? input.storeslug

    const lead = await payload.create({
      collection: 'signup-leads',
      data: {
        campaign: campaign.id,
        campaignSlug: campaign.slug,
        storefront: storefront.id,
        storeslug: input.storeslug,
        firstName,
        lastName,
        email,
        ...(phone ? { phone } : {}),
        ...(zip ? { zip } : {}),
        answers,
        sourceUrl: headerList.get('referer') ?? null,
        userAgent: headerList.get('user-agent') ?? null,
        ipAddress: headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
        submittedAt: new Date().toISOString(),
      },
    })

    const notify = campaign.notify
    const liveSendEnabled = Boolean(notify?.liveSendEnabled)
    const school = notify?.includeSchoolEmail
      ? await getMusicSchoolByStorefrontSlug(input.storeslug)
      : null

    const notification = await sendSignupNotification({
      leadId: String(lead.id),
      campaignSlug: campaign.slug,
      storeslug: input.storeslug,
      campaignTitle: campaign.title,
      storeName,
      firstName,
      lastName,
      email,
      phone,
      zip,
      answers,
      sourceUrl: headerList.get('referer') ?? undefined,
      subjectTemplate: notify?.subjectTemplate ?? '',
      liveSendEnabled,
      recipients: {
        recipients: (notify?.recipients ?? [])
          .map((r) => r.email)
          .filter((e): e is string => Boolean(e)),
        cc: (notify?.cc ?? []).map((r) => r.email).filter((e): e is string => Boolean(e)),
        includeStorefrontEmail: Boolean(notify?.includeStorefrontEmail),
        includeSchoolEmail: Boolean(notify?.includeSchoolEmail),
        storefrontEmail: storefront.showroomInfo?.email ?? null,
        schoolEmail: school?.contactInfo?.schoolEmail ?? school?.contactInfo?.email ?? null,
        // autoRouteToRSM is hidden in the admin until the ZIP→RSM matcher is
        // extracted out of notify-rsm-of-lead.ts.
        rsmEmail: null,
      },
    }).catch((error) => {
      console.error('[signup] Notification dispatch failed:', error)
      return { status: 'failed' as const }
    })

    const confirmation = notify?.sendConfirmationToLead
      ? await sendLeadConfirmation({
          leadId: String(lead.id),
          to: email,
          firstName,
          campaignTitle: campaign.title,
          storeName,
          subject: notify.confirmationSubject ?? "Thanks — we've got your spot",
          body: lexicalToPlainText(notify.confirmationBody),
          liveSendEnabled,
        }).catch((error) => {
          console.error('[signup] Confirmation dispatch failed:', error)
          return { status: 'failed' as const }
        })
      : { status: 'skipped' as const }

    const shopifyResult = campaign.shopify?.enableSync
      ? await syncSignupLeadToShopify({
          email,
          firstName,
          lastName,
          phone,
          tags: buildSignupTags(
            (campaign.shopify?.tags ?? [])
              .map((t) => t.tag)
              .filter((t): t is string => Boolean(t)),
            campaign.slug,
            input.storeslug,
            await siteTags(),
          ),
          acceptsMarketing: Boolean(campaign.shopify?.acceptsMarketing),
        }).catch((error) => {
          console.error('[signup] Shopify dispatch failed:', error)
          return { status: 'failed' as const }
        })
      : { status: 'skipped' as const }

    await payload.update({
      collection: 'signup-leads',
      id: lead.id,
      data: {
        resendStatus: notification.status,
        ...('emailId' in notification && notification.emailId
          ? { resendEmailId: notification.emailId }
          : {}),
        confirmationStatus: confirmation.status,
        ...('emailId' in confirmation && confirmation.emailId
          ? { confirmationEmailId: confirmation.emailId }
          : {}),
        shopifyStatus: shopifyResult.status,
        ...('customerId' in shopifyResult && shopifyResult.customerId
          ? { shopifyCustomerId: shopifyResult.customerId }
          : {}),
      },
      context: { skipHook: true },
    })

    if (campaign.form?.successMode === 'redirect' && campaign.form.redirectUrl) {
      return { success: true, mode: 'redirect', redirectUrl: campaign.form.redirectUrl }
    }

    return { success: true, mode: 'message', message: GENERIC_SUCCESS }
  } catch (error) {
    console.error('[signup] Submission failed:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
