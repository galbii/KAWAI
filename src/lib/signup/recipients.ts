import type { SignupRecipients } from './types'

export interface RecipientInput {
  /** Explicit addresses from the campaign's Notifications tab. */
  recipients: string[]
  cc: string[]
  includeStorefrontEmail: boolean
  includeSchoolEmail: boolean
  storefrontEmail: string | null
  schoolEmail: string | null
  /** Already-matched RSM address, or null. Matching happens upstream. */
  rsmEmail: string | null
}

const DEFAULT_CC = 'contact@kawaius.com'

/**
 * Resolve who receives a signup notification.
 *
 * Pure by design: the caller does the ZIP geocoding and RSM lookup and hands
 * the result in, so every toggle combination is unit-testable without a
 * network. Never returns an empty `to` — a lead with nowhere to go is a lost
 * lead, so an empty resolution falls back to the corporate inbox.
 */
export function resolveSignupRecipients(input: RecipientInput): SignupRecipients {
  const to = dedupe([
    ...input.recipients,
    ...(input.includeStorefrontEmail ? [input.storefrontEmail] : []),
    ...(input.includeSchoolEmail ? [input.schoolEmail] : []),
    ...(input.rsmEmail ? [input.rsmEmail] : []),
  ])

  const resolved = to.length > 0 ? to : dedupe([fallbackAddress()])

  const ccCandidates = input.cc.length > 0 ? input.cc : [ccAddress()]
  const seen = new Set(resolved.map((a) => a.toLowerCase()))
  const cc = dedupe(ccCandidates).filter((a) => !seen.has(a.toLowerCase()))

  return { to: resolved, cc }
}

function ccAddress(): string {
  return process.env.LEAD_NOTIFY_CC_EMAIL?.trim() || DEFAULT_CC
}

function fallbackAddress(): string {
  return process.env.LEAD_NOTIFY_FALLBACK_EMAIL?.trim() || ccAddress()
}

/** Trim, drop blanks, dedupe case-insensitively, keep first-seen casing. */
function dedupe(values: (string | null | undefined)[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []

  for (const value of values) {
    const trimmed = value?.trim()
    if (!trimmed) continue
    const key = trimmed.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(trimmed)
  }

  return out
}
