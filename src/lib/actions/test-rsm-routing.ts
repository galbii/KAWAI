'use server'

/**
 * RSM lead-routing test tooling — INTERNAL TEST TOOL ONLY.
 *
 * Powers /zipcodetest2026kawaiamerica. Two actions, both password-gated
 * (verified server-side on every call):
 *
 *   - `testRsmRouting`  — DRY RUN. Runs the exact matching code as
 *     `notifyRsmOfLead` (geocode → rank → walk to first rsmEmail) but sends
 *     NOTHING. Returns the routing decision plus the 5 nearest dealers, so the
 *     page can both show where a submission WOULD go and populate the
 *     post-submit dealer picker.
 *
 *   - `sendTestRsmEmail` — LIVE SEND to operator-supplied test inboxes only.
 *     Renders the real production email — including the visitor's dealer choice
 *     and the 5 closest dealers — so a tester can experience what an RSM
 *     receives. It never emails a real `rsmEmail`, never CCs the chosen dealer,
 *     never BCCs the fallback inbox, and never touches HubSpot or Shopify.
 *
 * ⚠️ These actions intentionally return internal-only data (`rsmEmail`) to the
 * browser, which the production pipeline never does. Delete the page + this
 * file when testing wraps up.
 */

import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { Resend } from 'resend'
import { geocodeZipCode } from '@/lib/utils/dealer-search'
import {
  classifyLeadCountry,
  getDealersForRsmRouting,
  rankRsmCandidates,
  findNearestRsm,
  type RsmMatch,
} from '@/lib/rsm/routing'
import {
  leadEmailSchema,
  buildLeadEmailHtml,
  buildLeadEmailSubject,
  buildDealerEmailHtml,
  buildDealerEmailSubject,
} from '@/lib/rsm/lead-email'
import {
  NEARBY_DEALER_COUNT,
  dealerNotifyAddress,
  resolveDealerChoice,
  toNearbyDealerOptions,
  type LeadDealerChoice,
  type NearbyDealerOption,
} from '@/lib/rsm/nearby-dealers'
import type { DealerRegion } from '@/lib/utils/dealer-country'
import type { Dealer } from '@/payload-types'

/** How many nearest candidates to return for the map + diagnostic table. */
const CANDIDATE_LIMIT = 10

/** Max test inboxes per send — keeps us well inside Resend's 10 req/s limit. */
const MAX_RECIPIENTS = 5

/**
 * One row of the internal candidate table. Carries the whole `Dealer` (rsmEmail
 * included) because this table exists to expose routing internals — it is the
 * one place in the app where that is intentional.
 */
export interface ZipTestCandidate {
  dealer: Dealer
  distance: number
  hasRsmEmail: boolean
}

export interface ZipTestResult {
  success: boolean
  message: string
  zip?: string
  country?: DealerRegion
  coords?: { lat: number; lng: number }
  /** The address the notification email would be sent to. */
  wouldSendTo?: string
  /** True when no candidate had an rsmEmail (or geocoding failed). */
  usedFallback?: boolean
  /** id of the dealer whose RSM would be emailed. */
  matchedDealerId?: string | null
  candidates?: ZipTestCandidate[]
  totalCandidates?: number
  /** The 5 nearest dealers, exactly as the visitor's picker would show them. */
  nearby?: NearbyDealerOption[]
}

/** Which of the two emails a row refers to. */
export type EmailKind = 'rsm' | 'dealer'

/** Per-recipient outcome of a test send. */
export interface TestSendRecipient {
  email: string
  kind: EmailKind
  ok: boolean
  id?: string
  error?: string
}

/**
 * Who a live send would have delivered to. Reported so an operator can verify
 * routing — including BCC — without a real inbox being touched.
 */
export interface PlannedDelivery {
  kind: EmailKind
  to: string
  bcc: string[]
  /** Set when this email wouldn't be produced at all, with the reason. */
  skipped?: string
}

export interface TestSendResult extends ZipTestResult {
  sends?: TestSendRecipient[]
  /** Dealer the operator picked in the modal, or null for "not sure". */
  chosenDealer?: NearbyDealerOption | null
  /** Envelopes the production pipeline would use. Displayed, never delivered. */
  plan?: PlannedDelivery[]
}

const zipSchema = z.string().trim().min(3).max(10)

/** Shared access password for the internal test page (override via env). */
const TEST_TOOL_PASSWORD = process.env.ZIP_TEST_TOOL_PASSWORD ?? 'Kawai1927'

function fallbackInbox(): string {
  // `||`, not `??` — a blank env var (LEAD_NOTIFY_FALLBACK_EMAIL=) is an empty
  // string, which `??` would pass straight through as a recipient.
  return (
    process.env.LEAD_NOTIFY_FALLBACK_EMAIL?.trim() ||
    process.env.RESEND_FROM_EMAIL?.trim() ||
    '(fallback not configured)'
  )
}

/**
 * Shared routing resolution: geocode → rank → first dealer with an rsmEmail.
 * Returns the same payload both actions surface to the page, so the dry run and
 * the send can never disagree about where a lead goes.
 */
async function resolveRouting(
  zip: string,
): Promise<{ result: ZipTestResult; match: RsmMatch | null; nearby: NearbyDealerOption[] }> {
  const fallback = fallbackInbox()
  const country = classifyLeadCountry(zip)
  const coords = await geocodeZipCode(zip)

  if (!coords) {
    return {
      match: null,
      nearby: [],
      result: {
        success: true,
        message: `Could not geocode "${zip}" — the real pipeline would route this lead to the fallback inbox.`,
        zip,
        country,
        wouldSendTo: fallback,
        usedFallback: true,
        matchedDealerId: null,
        candidates: [],
        totalCandidates: 0,
        nearby: [],
      },
    }
  }

  const dealers = await getDealersForRsmRouting()
  const ranked = rankRsmCandidates(dealers, coords, country)
  const match = findNearestRsm(ranked)

  const candidates: ZipTestCandidate[] = ranked
    .slice(0, CANDIDATE_LIMIT)
    .map(({ dealer, distance }) => ({
      dealer,
      distance: Math.round(distance * 10) / 10,
      hasRsmEmail: Boolean(dealer.rsmEmail),
    }))

  const nearby = toNearbyDealerOptions(ranked, NEARBY_DEALER_COUNT)

  return {
    match,
    nearby,
    result: {
      success: true,
      message: '',
      zip,
      country,
      coords,
      wouldSendTo: match?.rsmEmail ?? fallback,
      usedFallback: !match,
      matchedDealerId: match?.dealer.id ?? null,
      candidates,
      totalCandidates: ranked.length,
      nearby,
    },
  }
}

/** DRY RUN — resolves routing for a ZIP and sends nothing. */
export async function testRsmRouting(zip: string, password: string): Promise<ZipTestResult> {
  if (password !== TEST_TOOL_PASSWORD) {
    return { success: false, message: 'Incorrect password.' }
  }

  const parsed = zipSchema.safeParse(zip)
  if (!parsed.success) {
    return { success: false, message: 'Enter a valid ZIP or postal code (3–10 characters).' }
  }

  const { result } = await resolveRouting(parsed.data)
  return result
}

const testSendSchema = leadEmailSchema.extend({
  password: z.string(),
  /** Comma / semicolon / whitespace separated list of test inboxes. */
  recipients: z.string().trim().min(1),
  /** Dealer picked in the modal. `null` = the visitor answered "not sure". */
  selectedDealerId: z.string().nullable().optional(),
  /** False when the send skips the picker entirely (legacy-style submission). */
  dealerChoiceMade: z.boolean().optional(),
})

export type TestSendInput = z.input<typeof testSendSchema>

/** Split, normalise, dedupe and validate the operator-supplied inbox list. */
function parseRecipients(raw: string): { emails: string[]; invalid: string[] } {
  const parts = raw
    .split(/[\s,;]+/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)

  const emails: string[] = []
  const invalid: string[] = []
  const seen = new Set<string>()

  for (const part of parts) {
    if (!z.string().email().safeParse(part).success) {
      invalid.push(part)
      continue
    }
    if (seen.has(part)) continue
    seen.add(part)
    emails.push(part)
  }

  return { emails, invalid }
}

/**
 * LIVE SEND — delivers the real production emails to operator-supplied test
 * inboxes so a tester can experience both sides of a lead.
 *
 * Sends up to two emails per test inbox, exactly as production composes them:
 *   RSM email    — lead details, the 5 nearest dealers, and the visitor's pick.
 *   Dealer email — only when a dealer was chosen and has a public inbox. Warm,
 *                  narrow, no competitor list.
 *
 * Deliberately diverges from production in four ways, all safety guards:
 *   - Every recipient is an operator test inbox. The matched `rsmEmail`, the
 *     chosen dealer and the fallback inbox are never addressed, copied or
 *     BCC'd — the envelopes production would use come back as `plan` for the
 *     page to display instead.
 *   - Subjects are prefixed `[TEST]` and both bodies carry a warning banner.
 *   - A fresh idempotency key per send, so repeat tests actually resend
 *     (production keys on kind+lead+zip+choice for 24h).
 *   - No dealer `leadCount` is incremented — the test must not touch
 *     production dealer records.
 *
 * The Home Page CMS kill switch and the LEAD_NOTIFY_* delivery switches are
 * also ignored: they pause production lead routing, not this tool.
 *
 * One request per recipient per email, so each tester gets clean inbox copies
 * instead of seeing the others in the header.
 */
export async function sendTestRsmEmail(input: TestSendInput): Promise<TestSendResult> {
  const parsed = testSendSchema.safeParse(input)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return {
      success: false,
      message: first ? `${first.path.join('.') || 'input'}: ${first.message}` : 'Invalid input.',
    }
  }

  const {
    password,
    recipients: rawRecipients,
    selectedDealerId,
    dealerChoiceMade,
    ...lead
  } = parsed.data

  if (password !== TEST_TOOL_PASSWORD) {
    return { success: false, message: 'Incorrect password.' }
  }

  const { emails, invalid } = parseRecipients(rawRecipients)
  if (emails.length === 0) {
    return {
      success: false,
      message: `No valid test recipient addresses${invalid.length ? ` (couldn't parse: ${invalid.join(', ')})` : ''}.`,
    }
  }
  if (emails.length > MAX_RECIPIENTS) {
    return {
      success: false,
      message: `Too many recipients (${emails.length}). Max ${MAX_RECIPIENTS} per send.`,
    }
  }

  const apiKey = process.env.RESEND_API_KEY
  const fromAddress = process.env.RESEND_FROM_EMAIL
  if (!apiKey || !fromAddress) {
    return {
      success: false,
      message:
        'RESEND_API_KEY / RESEND_FROM_EMAIL not configured — set both in .env.local and restart the dev server.',
    }
  }

  const { result, match, nearby } = await resolveRouting(lead.zip)

  // Resolved against the offered list, mirroring production — an id the picker
  // never showed degrades to "unsure" rather than pulling in a stray dealer.
  const choice: LeadDealerChoice | undefined = dealerChoiceMade
    ? resolveDealerChoice(nearby, selectedDealerId)
    : undefined

  const rsmTo = result.wouldSendTo ?? fallbackInbox()
  const dealerTo = dealerNotifyAddress(choice)

  // Exactly the envelopes `notifyRsmOfLead` would build, reported rather than used.
  const rsmPlan: PlannedDelivery = {
    kind: 'rsm',
    to: rsmTo,
    bcc: match ? [fallbackInbox()] : [],
  }

  const plan: PlannedDelivery[] = [
    rsmPlan,
    dealerTo
      ? { kind: 'dealer', to: dealerTo, bcc: [rsmTo] }
      : {
          kind: 'dealer',
          to: '—',
          bcc: [],
          skipped:
            choice?.kind === 'selected'
              ? `${choice.dealer.name} has no contact email on file`
              : 'visitor was not sure, so no dealer is contacted',
        },
  ]

  // Both emails carry a [TEST] subject and a warning banner that spells out the
  // exact To/Bcc a live send would have used, so a tester can confirm routing
  // from the message itself. Only test sends carry those addresses.
  const rsmSubject = buildLeadEmailSubject({ lead, match, ...(choice ? { choice } : {}), test: {} })
  const rsmHtml = buildLeadEmailHtml({
    lead,
    match,
    source: 'ziptest',
    nearby,
    ...(choice ? { choice } : {}),
    test: {
      label: 'RSM notification',
      envelope: { to: rsmPlan.to, bcc: rsmPlan.bcc },
    },
  })

  const dealerEmail =
    choice?.kind === 'selected' && dealerTo
      ? {
          subject: buildDealerEmailSubject({ lead, test: {} }),
          html: buildDealerEmailHtml({
            lead,
            dealer: choice.dealer,
            source: 'ziptest',
            test: {
              label: 'Dealer notification',
              envelope: { to: dealerTo, bcc: [rsmTo] },
            },
          }),
        }
      : null

  const resend = new Resend(apiKey)
  const sends: TestSendRecipient[] = []

  /** One request per recipient per email kind, so each inbox gets clean copies. */
  const sendOne = async (to: string, kind: EmailKind, subject: string, html: string) => {
    try {
      const { data, error } = await resend.emails.send(
        {
          from: fromAddress,
          // The operator's inbox and nothing else — no dealer, no RSM, no BCC.
          to: [to],
          replyTo: lead.email,
          subject,
          html,
          tags: [{ name: 'source', value: 'ziptest' }],
        },
        // Fresh key per send — repeat tests must actually resend.
        { idempotencyKey: `rsm-lead-test/${randomUUID()}` },
      )

      if (error) {
        sends.push({ email: to, kind, ok: false, error: error.message || String(error) })
      } else {
        sends.push({ email: to, kind, ok: true, ...(data?.id ? { id: data.id } : {}) })
      }
    } catch (err) {
      sends.push({
        email: to,
        kind,
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  for (const to of emails) {
    await sendOne(to, 'rsm', rsmSubject, rsmHtml)
    if (dealerEmail) await sendOne(to, 'dealer', dealerEmail.subject, dealerEmail.html)
  }

  const sent = sends.filter((s) => s.ok).length
  const notes: string[] = []
  if (invalid.length) notes.push(`skipped unparseable: ${invalid.join(', ')}`)

  return {
    ...result,
    success: true,
    message:
      sent === sends.length
        ? `Sent ${sent} test email${sent === 1 ? '' : 's'}.${notes.length ? ` (${notes.join('; ')})` : ''}`
        : `Sent ${sent} of ${sends.length}. See per-recipient errors below.${notes.length ? ` (${notes.join('; ')})` : ''}`,
    sends,
    chosenDealer: choice?.kind === 'selected' ? choice.dealer : null,
    plan,
  }
}
