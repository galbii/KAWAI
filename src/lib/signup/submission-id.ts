import { createHash } from 'node:crypto'
import type { SignupAnswer } from './types'

/**
 * A stable id for one signup submission, derived from its content.
 *
 * Signup leads are no longer persisted, so there is no database row whose id
 * can key Resend's idempotency. This hashes what was actually submitted
 * instead, which gives the property that matters: a double-click or a retried
 * request produces the same id and Resend collapses it to one send.
 *
 * The answers are part of the hash on purpose. Keying on campaign + email alone
 * would silently swallow a genuine second signup — a parent enrolling a second
 * child under one email address is a real case, and those submissions differ in
 * their answers. Including them keeps true duplicates deduped and distinct
 * submissions distinct.
 *
 * Resend expires idempotency keys after 24h, so this only ever suppresses
 * same-day repeats.
 */
export function buildSubmissionId(
  campaignSlug: string,
  email: string,
  answers: SignupAnswer[],
): string {
  const canonical = JSON.stringify([
    campaignSlug,
    email.trim().toLowerCase(),
    answers.map((a) => [a.name, a.value]),
  ])

  return createHash('sha256').update(canonical).digest('hex').slice(0, 32)
}
