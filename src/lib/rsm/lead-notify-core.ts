/**
 * The lead notification pipeline, shared by every ZIP-routed lead form.
 *
 * Extracted from `notifyRsmOfLead` (kawai-lead-rsm-holiday v1, Nov 25, 2026)
 * so the national /holiday-sale-event page can send the SAME routing — ZIP →
 * nearest dealer's RSM, Canada west/east inbox, storefront area, fallback, the
 * LEAD_NOTIFY_* switches, the CMS kill switch and the test-inbox valve — in
 * its own holiday-branded emails. Only the email *content* is pluggable
 * (`templates`); who receives a lead is decided here and nowhere else.
 *
 * With the default templates this is byte-for-byte what `notifyRsmOfLead`
 * sent before the extraction: same subjects, same HTML (no plain-text part),
 * same idempotency keys, same tags, same logs. /fall-financing, /black-friday
 * and the store pages' unknown-slug fallback all still go through it that way.
 *
 * Server-only (Payload Local API, access-restricted `rsmEmail`). Not a server
 * action itself: `'use server'` modules wrap it, so nothing here is callable
 * from the browser, and no routing address is ever returned.
 */

import { createHash } from 'node:crypto'
import { unstable_cache } from 'next/cache'
import { Resend } from 'resend'
import { getPayloadClient } from '@/lib/payload/queries'
import { geocodeZipCode } from '@/lib/utils/dealer-search'
import {
  classifyLeadCountry,
  getDealersForRsmRouting,
  rankRsmCandidates,
  findNearestRsm,
  matchStorefrontForLead,
  type RsmMatch,
} from '@/lib/rsm/routing'
import type { NearbyStorefrontOption } from '@/lib/rsm/nearby-storefront'
import {
  leadEmailSchema,
  buildLeadEmailHtml,
  buildLeadEmailSubject,
  buildDealerEmailHtml,
  buildDealerEmailSubject,
  type LeadEmailTestOptions,
  type LeadEmailValues,
} from '@/lib/rsm/lead-email'
import {
  dealerNotifyAddress,
  resolveDealerChoice,
  toNearbyDealerOptions,
  type LeadDealerChoice,
  type NearbyDealerOption,
} from '@/lib/rsm/nearby-dealers'
import { incrementDealerLeadCount } from '@/lib/rsm/lead-counter'
import {
  buildLeadEnvelope,
  describeEnvelope,
  isDealerEmailEnabled,
  isRsmEmailEnabled,
  isStorefrontEmailEnabled,
  resolveLeadRecipient,
  type LeadEnvelope,
} from '@/lib/rsm/lead-envelopes'

/** One composed email. `text` is optional: the original lead emails are HTML only. */
export interface LeadEmailContent {
  subject: string
  html: string
  text?: string
}

/**
 * The two "owner" emails a page may restyle. The visitor-chosen dealer email
 * is not here: the post-submit dealer picker is off on every page, and when it
 * runs it keeps today's dealer template.
 */
export interface LeadNotificationTemplates {
  /** RSM-path owner (matched RSM, Canada inbox, fallback): the full routing readout. */
  rsm(options: {
    lead: LeadEmailValues
    match: RsmMatch | null
    source: string
    dealerNotified: boolean
    storefront: NearbyStorefrontOption | null
    choice?: LeadDealerChoice
    /** Set only under LEAD_NOTIFY_TEST_INBOX: the banner with the live envelope. */
    test?: LeadEmailTestOptions
  }): LeadEmailContent
  /** A Kawai storefront owns the lead (storefront routing on): the narrow "in your area" email. */
  storefront(options: {
    lead: LeadEmailValues
    /** 'Kawai Dallas'. */
    storefrontName: string
    source: string
    test?: LeadEmailTestOptions
  }): LeadEmailContent
}

/** Today's emails (src/lib/rsm/lead-email.ts), exactly as notifyRsmOfLead built them. */
export const DEFAULT_LEAD_TEMPLATES: LeadNotificationTemplates = {
  rsm: ({ lead, match, source, dealerNotified, storefront, choice, test }) => ({
    subject: buildLeadEmailSubject({
      lead,
      match,
      ...(choice ? { choice } : {}),
      ...(test ? { test: {} } : {}),
    }),
    html: buildLeadEmailHtml({
      lead,
      match,
      source,
      dealerNotified,
      storefront,
      storefrontNotified: false,
      ...(choice ? { choice } : {}),
      ...(test ? { test } : {}),
    }),
  }),
  storefront: ({ lead, storefrontName, source, test }) => ({
    subject: buildDealerEmailSubject({ lead, ...(test ? { test: {} } : {}) }),
    html: buildDealerEmailHtml({
      lead,
      dealer: { name: storefrontName },
      source,
      reason: 'nearby',
      ...(test ? { test } : {}),
    }),
  }),
}

export interface RunLeadNotificationOptions {
  /**
   * What the visitor picked in the post-submit dealer modal. `{ dealerId: null }`
   * is the explicit "not sure" answer; omit entirely when the modal never ran.
   */
  choice?: { dealerId: string | null }
  /** Email content. Defaults to today's RSM / storefront emails. */
  templates?: LeadNotificationTemplates
  /**
   * Prefixed to every Resend idempotency key, so a page with its own emails
   * never dedupes against another page's. Omit to keep today's keys.
   */
  idempotencyNamespace?: string
  /** Log prefix. Defaults to today's '[notify-rsm]'. */
  logTag?: string
}

/**
 * Global test-inbox valve. When LEAD_NOTIFY_TEST_INBOX is set, every lead email
 * is re-addressed to it and all Cc/Bcc is dropped, so no RSM, dealer or
 * corporate inbox can be reached no matter what the enable flags say.
 * Server-side only — nothing the browser sends can influence a recipient.
 * Unset it to go live.
 */
const testInbox = () => process.env.LEAD_NOTIFY_TEST_INBOX?.trim() || null

/**
 * CMS kill switch — "RSM Lead Notification Emails" checkbox in the Home Page
 * sidebar. Fails open (missing doc/field → enabled) so a fetch hiccup can't
 * silently pause lead routing. Short revalidate keeps toggle lag ≤ 5 min.
 */
const isRsmNotificationEnabled = unstable_cache(
  async (): Promise<boolean> => {
    try {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'home-page',
        select: { enableRsmLeadNotifications: true },
        depth: 0,
        limit: 1,
      })
      return result.docs[0]?.enableRsmLeadNotifications !== false
    } catch (err) {
      console.error('[notify-rsm] Failed to read feature flag — defaulting to enabled:', err)
      return true
    }
  },
  ['rsm-notification-flag'],
  { tags: ['home-page'], revalidate: 300 },
)

/**
 * Route one lead and send its owner email (plus the chosen-dealer email when
 * the picker ran). See `notifyRsmOfLead` for the full routing contract.
 *
 * @returns `{ success }` — never rejects; failures are logged and swallowed.
 *          Intentionally returns no dealer/RSM data (internal-only fields).
 */
export async function runLeadNotification(
  values: Record<string, string>,
  source: string,
  {
    choice,
    templates = DEFAULT_LEAD_TEMPLATES,
    idempotencyNamespace,
    logTag = '[notify-rsm]',
  }: RunLeadNotificationOptions = {},
): Promise<{ success: boolean }> {
  try {
    const apiKey = process.env.RESEND_API_KEY
    const fromAddress = process.env.RESEND_FROM_EMAIL
    if (!apiKey || !fromAddress) {
      console.error(`${logTag} RESEND_API_KEY / RESEND_FROM_EMAIL not configured — skipping`)
      return { success: false }
    }

    if (!(await isRsmNotificationEnabled())) {
      console.log(`${logTag} Disabled via Home Page CMS toggle — skipping`)
      return { success: false }
    }

    const parsed = leadEmailSchema.safeParse(values)
    if (!parsed.success) {
      console.error(`${logTag} Invalid lead payload:`, parsed.error.issues)
      return { success: false }
    }
    const lead = parsed.data

    // Match: geocode → nearest same-country RSM-managed dealer with an rsmEmail.
    // The same ranked list feeds the 5-nearest table, so what the RSM reads is
    // exactly what the visitor was offered in the picker.
    let match: RsmMatch | null = null
    let nearby: NearbyDealerOption[] = []
    // The official Kawai showroom in the lead's area, if any — marketed to in
    // addition to the dealer/RSM routing, never instead of it.
    let storefront: NearbyStorefrontOption | null = null
    const coords = await geocodeZipCode(lead.zip)
    if (coords) {
      const [dealers, sf] = await Promise.all([
        getDealersForRsmRouting(),
        matchStorefrontForLead(coords, lead.zip),
      ])
      const ranked = rankRsmCandidates(dealers, coords, classifyLeadCountry(lead.zip))
      match = findNearestRsm(ranked)
      nearby = toNearbyDealerOptions(ranked)
      storefront = sf
    } else {
      console.warn(`${logTag} Could not geocode "${lead.zip}" — using fallback inbox`)
    }

    // The id comes from the browser, so it is resolved against the offered list
    // rather than trusted — an unknown id degrades to "unsure".
    const dealerChoice: LeadDealerChoice | undefined = choice
      ? resolveDealerChoice(nearby, choice.dealerId)
      : undefined

    // `||`, not `??`: an env var that is present but blank (LEAD_NOTIFY_FALLBACK_EMAIL=)
    // is an empty string, which `??` happily passes through — that would put a
    // literal '' in To/Bcc and make Resend reject the whole send.
    const fallback = process.env.LEAD_NOTIFY_FALLBACK_EMAIL?.trim() || fromAddress
    const redirect = testInbox()
    const leadKey = `${lead.email}|${lead.zip}|${choice ? (choice.dealerId ?? 'unsure') : 'none'}`
    const keyPrefix = idempotencyNamespace ? `${idempotencyNamespace}-` : ''
    const resend = new Resend(apiKey)

    /**
     * Send one email, or — while its kill switch is off — log the exact
     * envelope it would have used and send nothing. Returns whether an email
     * actually went out. Never throws: each delivery is independent, so a
     * failure on one must not take the other down with it.
     */
    const deliver = async (
      kind: 'rsm' | 'dealer' | 'storefront',
      enabled: boolean,
      envelope: LeadEnvelope,
      { subject, html, text }: LeadEmailContent,
    ): Promise<boolean> => {
      if (!enabled) {
        const flag = {
          rsm: 'LEAD_NOTIFY_RSM_EMAIL',
          dealer: 'LEAD_NOTIFY_DEALER_EMAIL',
          storefront: 'LEAD_NOTIFY_STOREFRONT_EMAIL',
        }[kind]
        console.log(
          `${logTag} HELD — ${kind} email not sent. Would have gone ${describeEnvelope(envelope)} ` +
            `(subject: "${subject}"). Set ${flag}=true to deliver.`,
        )
        return false
      }

      // Redirect the envelope, never the log — the log must always record the
      // real routing decision, not the test detour.
      const actual: LeadEnvelope = redirect ? { to: redirect, cc: [], bcc: [] } : envelope

      try {
        const { data, error } = await resend.emails.send(
          {
            from: fromAddress,
            to: [actual.to],
            ...(actual.cc.length > 0 ? { cc: actual.cc } : {}),
            ...(actual.bcc.length > 0 ? { bcc: actual.bcc } : {}),
            // Replies go straight to the customer, for RSM and dealer alike.
            replyTo: lead.email,
            subject,
            html,
            ...(text ? { text } : {}),
            tags: [{ name: 'source', value: source.replace(/[^A-Za-z0-9_-]/g, '_') }],
          },
          {
            // One send per lead+zip+choice per kind per 24h. Guards a
            // double-fired submit without letting the dealer email dedupe
            // against the RSM email — note `kind` is part of the hash.
            idempotencyKey: `${keyPrefix}${kind}-lead/${createHash('sha256').update(`${kind}|${leadKey}`).digest('hex')}`,
          },
        )

        if (error) {
          console.error(`${logTag} Resend error on ${kind} email:`, error)
          return false
        }
        console.log(
          redirect
            ? `${logTag} Sent ${kind} email (${data?.id}) to TEST INBOX ${redirect} — live routing would have been ${describeEnvelope(envelope)}`
            : `${logTag} Sent ${kind} email (${data?.id}) ${describeEnvelope(envelope)}`,
        )
        return true
      } catch (err) {
        console.error(`${logTag} Failed to send ${kind} email:`, err)
        return false
      }
    }

    // Resolved before the lead email is composed: the RSM's wording depends on
    // whether the dealer is actually being contacted, and getting that backwards
    // would tell the RSM to stand down on a lead nobody has picked up.
    const dealerTo = dealerNotifyAddress(dealerChoice)

    // — Who owns the lead. A storefront-area lead goes to the storefront's
    //   contact email instead of the RSM (while storefront routing is on);
    //   everything else takes the RSM path: matched RSM, Canada west/east
    //   inbox, fallback.
    const storefrontRouting = isStorefrontEmailEnabled()
    const recipient = resolveLeadRecipient({
      zip: lead.zip,
      storefrontEmail: storefront?.email,
      storefrontRouting,
      matchedRsmEmail: match?.rsmEmail,
      fallback,
    })

    if (storefront && recipient.kind === 'rsm') {
      console.log(
        `${logTag} Lead is in Kawai ${storefront.name}'s area but goes to the RSM path — ` +
          (storefront.email
            ? 'storefront routing is off (LEAD_NOTIFY_STOREFRONT_EMAIL).'
            : 'the storefront has no contact email on file.'),
      )
    }
    if (recipient.canadaOverride) {
      console.log(
        `${logTag} Canadian lead "${lead.zip}" (${recipient.canadaRegion ?? 'west'} region) — ` +
          `routing to ${recipient.to} instead of ` +
          `${match?.rsmEmail ?? 'the fallback inbox'}.`,
      )
    }

    // The dealer email never duplicates the lead email into the same inbox
    // (a storefront that is also listed in `dealers`).
    const dealerDuplicatesOwner =
      Boolean(dealerTo) && dealerTo!.trim().toLowerCase() === recipient.to.toLowerCase()
    const dealerNotified = Boolean(dealerTo) && !dealerDuplicatesOwner && isDealerEmailEnabled()

    const leadEnvelope = buildLeadEnvelope(recipient.to)
    let leadSent: boolean

    if (recipient.kind === 'storefront' && storefront) {
      // — Storefront notification: the storefront owns this lead. The narrow
      //   template — no nearest-dealer list, no routing internals — worded so it
      //   never claims the visitor picked the storefront. Corporate CC'd. —
      leadSent = await deliver(
        'storefront',
        true, // routing to the storefront at all is what the switch gates
        leadEnvelope,
        templates.storefront({
          lead,
          storefrontName: `Kawai ${storefront.name}`,
          source,
          ...(redirect
            ? { test: { label: 'Storefront notification', envelope: leadEnvelope } }
            : {}),
        }),
      )
    } else {
      // — RSM notification: the standard email. Corporate CC'd, no dealer
      //   copied. Names the storefront when one is nearby but not routed to. —
      leadSent = await deliver(
        'rsm',
        isRsmEmailEnabled(),
        leadEnvelope,
        templates.rsm({
          lead,
          match,
          source,
          dealerNotified,
          storefront,
          ...(dealerChoice ? { choice: dealerChoice } : {}),
          ...(redirect ? { test: { label: 'RSM notification', envelope: leadEnvelope } } : {}),
        }),
      )
    }

    // — Dealer notification: only when the visitor named a dealer that has a
    //   public inbox. Warmer, no competitor list, corporate CC'd. —
    let dealerSent = false

    if (dealerTo && dealerChoice?.kind === 'selected' && !dealerDuplicatesOwner) {
      const dealerEnvelope = buildLeadEnvelope(dealerTo)
      dealerSent = await deliver('dealer', isDealerEmailEnabled(), dealerEnvelope, {
        subject: buildDealerEmailSubject({ lead, ...(redirect ? { test: {} } : {}) }),
        html: buildDealerEmailHtml({
          lead,
          dealer: dealerChoice.dealer,
          source,
          ...(redirect
            ? { test: { label: 'Dealer notification', envelope: dealerEnvelope } }
            : {}),
        }),
      })
    } else if (dealerChoice?.kind === 'selected' && !dealerTo) {
      console.log(
        `${logTag} No dealer email — ${dealerChoice.dealer.name} has no contact email on file.`,
      )
    }

    // Attribution is about what the visitor chose, not what we managed to
    // deliver, so this counts even while the emails are held back.
    if (dealerChoice?.kind === 'selected') {
      void incrementDealerLeadCount(dealerChoice.dealer.id)
    }

    return { success: leadSent || dealerSent }
  } catch (err) {
    // Fire-and-forget contract: log, never throw — the visitor-facing HubSpot
    // submission must not be affected by a notification failure.
    console.error(`${logTag} Failed:`, err)
    return { success: false }
  }
}
