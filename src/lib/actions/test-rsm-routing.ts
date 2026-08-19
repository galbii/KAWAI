'use server'

/**
 * RSM lead-routing test tooling — INTERNAL TEST TOOL ONLY.
 *
 * Powers /zipcodetest2026kawaiamerica. Two actions, both password-gated
 * (verified server-side on every call):
 *
 *   - `testRsmRouting`  — DRY RUN. Runs the exact matching code as
 *     `notifyRsmOfLead` (geocode → rank → walk to first rsmEmail) but sends
 *     NOTHING. Returns the routing decision so the page can display where a
 *     submission for a given ZIP/postal code WOULD have gone.
 *
 *   - `sendTestRsmEmail` — LIVE SEND to operator-supplied test inboxes only.
 *     Renders the real production email (shared template) plus the 5 closest
 *     dealers, so a tester can experience what an RSM receives. It never emails
 *     a real `rsmEmail`, never BCCs the fallback inbox, and never touches
 *     HubSpot or Shopify.
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
  type NearbyDealerRow,
} from '@/lib/rsm/lead-email'
import type { DealerRegion } from '@/lib/utils/dealer-country'

/** How many nearest candidates to return for the map + table. */
const CANDIDATE_LIMIT = 10

/** How many dealers to include in the test email body. */
const EMAIL_DEALER_COUNT = 5

/** Max test inboxes per send — keeps us well inside Resend's 10 req/s limit. */
const MAX_RECIPIENTS = 5

export type ZipTestCandidate = NearbyDealerRow

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
}

/** Per-recipient outcome of a test send. */
export interface TestSendRecipient {
  email: string
  ok: boolean
  id?: string
  error?: string
}

export interface TestSendResult extends ZipTestResult {
  sends?: TestSendRecipient[]
}

const zipSchema = z.string().trim().min(3).max(10)

/** Shared access password for the internal test page (override via env). */
const TEST_TOOL_PASSWORD = process.env.ZIP_TEST_TOOL_PASSWORD ?? 'Kawai1927'

function fallbackInbox(): string {
  return (
    process.env.LEAD_NOTIFY_FALLBACK_EMAIL ??
    process.env.RESEND_FROM_EMAIL ??
    '(fallback not configured)'
  )
}

/**
 * Shared routing resolution: geocode → rank → first dealer with an rsmEmail.
 * Returns the same payload both actions surface to the page.
 */
async function resolveRouting(
  zip: string,
): Promise<{ result: ZipTestResult; match: RsmMatch | null; ranked: ZipTestCandidate[] }> {
  const fallback = fallbackInbox()
  const country = classifyLeadCountry(zip)
  const coords = await geocodeZipCode(zip)

  if (!coords) {
    return {
      match: null,
      ranked: [],
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

  return {
    match,
    ranked: candidates,
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
 * LIVE SEND — emails the real production template (plus the 5 closest dealers)
 * to operator-supplied test inboxes so a tester can experience the RSM's view.
 *
 * Deliberately diverges from production in four ways, all safety guards:
 *   - Recipients are ONLY the supplied test inboxes; the matched `rsmEmail` is
 *     shown in the body but never emailed, and the fallback inbox is not BCC'd.
 *   - Subject is prefixed `[TEST]` and the body carries a warning banner.
 *   - A fresh idempotency key per run, so repeat tests actually resend
 *     (production keys on lead+zip for 24h and would swallow the second send).
 *   - The Home Page CMS kill switch is ignored — it pauses production lead
 *     routing, not this tool.
 *
 * One request per recipient rather than a single multi-recipient `to`, so each
 * tester gets a clean inbox copy instead of seeing the others in the header.
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

  const { password, recipients: rawRecipients, ...lead } = parsed.data

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

  const { result, match, ranked } = await resolveRouting(lead.zip)

  const productionRecipient = result.wouldSendTo ?? fallbackInbox()
  const nearby = ranked.slice(0, EMAIL_DEALER_COUNT)

  const subject = buildLeadEmailSubject({ lead, match, test: { productionRecipient } })
  const html = buildLeadEmailHtml({
    lead,
    match,
    source: 'ziptest',
    nearby,
    test: { productionRecipient },
  })

  const resend = new Resend(apiKey)
  const sends: TestSendRecipient[] = []

  for (const to of emails) {
    try {
      const { data, error } = await resend.emails.send(
        {
          from: fromAddress,
          to: [to],
          replyTo: lead.email,
          subject,
          html,
          tags: [{ name: 'source', value: 'ziptest' }],
        },
        // Fresh key per recipient per run — repeat tests must actually resend.
        { idempotencyKey: `rsm-lead-test/${randomUUID()}` },
      )

      if (error) {
        sends.push({ email: to, ok: false, error: error.message || String(error) })
      } else {
        sends.push({ email: to, ok: true, ...(data?.id ? { id: data.id } : {}) })
      }
    } catch (err) {
      sends.push({ email: to, ok: false, error: err instanceof Error ? err.message : String(err) })
    }
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
  }
}
