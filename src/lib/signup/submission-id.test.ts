import { describe, expect, it } from 'bun:test'
import { buildSubmissionId } from './submission-id'
import type { SignupAnswer } from './types'

const answers: SignupAnswer[] = [
  { name: 'instrument', label: 'Which would you like to study?', value: 'Piano' },
  { name: 'ageGroup', label: 'Student age group', value: '9–12' },
]

describe('buildSubmissionId', () => {
  it('is stable for identical input', () => {
    expect(buildSubmissionId('back-to-school', 'a@example.com', answers)).toBe(
      buildSubmissionId('back-to-school', 'a@example.com', answers),
    )
  })

  it('ignores email casing and surrounding whitespace', () => {
    expect(buildSubmissionId('back-to-school', '  A@Example.COM ', answers)).toBe(
      buildSubmissionId('back-to-school', 'a@example.com', answers),
    )
  })

  it('differs across campaigns', () => {
    expect(buildSubmissionId('back-to-school', 'a@example.com', answers)).not.toBe(
      buildSubmissionId('fall-open-house', 'a@example.com', answers),
    )
  })

  it('differs across email addresses', () => {
    expect(buildSubmissionId('back-to-school', 'a@example.com', answers)).not.toBe(
      buildSubmissionId('back-to-school', 'b@example.com', answers),
    )
  })

  // The case this hash exists for: one household, one email address, two
  // different children. Both submissions must reach the inbox.
  it('differs when the answers differ under the same email', () => {
    const second: SignupAnswer[] = [
      { name: 'instrument', label: 'Which would you like to study?', value: 'Voice' },
      { name: 'ageGroup', label: 'Student age group', value: '5–8' },
    ]

    expect(buildSubmissionId('back-to-school', 'a@example.com', answers)).not.toBe(
      buildSubmissionId('back-to-school', 'a@example.com', second),
    )
  })

  it('ignores label edits, which do not change what was answered', () => {
    const relabelled: SignupAnswer[] = [
      { name: 'instrument', label: 'Instrument?', value: 'Piano' },
      { name: 'ageGroup', label: 'Age', value: '9–12' },
    ]

    expect(buildSubmissionId('back-to-school', 'a@example.com', relabelled)).toBe(
      buildSubmissionId('back-to-school', 'a@example.com', answers),
    )
  })

  it('handles a campaign with no custom questions', () => {
    const id = buildSubmissionId('back-to-school', 'a@example.com', [])
    expect(id).toHaveLength(32)
    expect(id).toMatch(/^[0-9a-f]{32}$/)
  })
})
