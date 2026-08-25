import { describe, expect, it } from 'bun:test'
import { denormalizeAnswers } from './answers'
import type { SignupQuestion } from './types'

const QUESTIONS: SignupQuestion[] = [
  {
    type: 'select',
    label: 'Which instrument?',
    name: 'instrument',
    options: [
      { label: 'Piano', value: 'piano' },
      { label: 'Voice', value: 'voice' },
    ],
  },
  { type: 'text', label: 'Student name', name: 'studentName' },
  { type: 'checkbox', label: 'Send me updates', name: 'updates' },
]

describe('denormalizeAnswers', () => {
  it('captures the label as it read at submission time', () => {
    const answers = denormalizeAnswers(QUESTIONS, {
      instrument: 'piano',
      studentName: 'Ada',
      updates: true,
    })
    expect(answers).toEqual([
      { name: 'instrument', label: 'Which instrument?', value: 'Piano' },
      { name: 'studentName', label: 'Student name', value: 'Ada' },
      { name: 'updates', label: 'Send me updates', value: 'Yes' },
    ])
  })

  it('resolves a choice to its human-readable option label', () => {
    const answers = denormalizeAnswers(QUESTIONS, { instrument: 'voice' })
    expect(answers[0]?.value).toBe('Voice')
  })

  it('keeps the raw value when it matches no known option', () => {
    const answers = denormalizeAnswers(QUESTIONS, { instrument: 'tuba' })
    expect(answers[0]?.value).toBe('tuba')
  })

  it('renders booleans as Yes and No', () => {
    expect(denormalizeAnswers(QUESTIONS, { updates: false })[0]?.value).toBe('No')
  })

  it('omits questions the visitor left blank', () => {
    const answers = denormalizeAnswers(QUESTIONS, { studentName: 'Ada' })
    expect(answers).toHaveLength(1)
    expect(answers[0]?.name).toBe('studentName')
  })

  it('ignores submitted values with no matching question', () => {
    const answers = denormalizeAnswers(QUESTIONS, { ghost: 'boo' })
    expect(answers).toHaveLength(0)
  })

  it('stays readable after the campaign renames a question', () => {
    // The archive is a snapshot: a lead captured under the old label keeps it.
    const before = denormalizeAnswers(QUESTIONS, { instrument: 'piano' })
    const renamed: SignupQuestion[] = [{ ...QUESTIONS[0]!, label: 'Primary instrument' }]
    const after = denormalizeAnswers(renamed, { instrument: 'piano' })
    expect(before[0]?.label).toBe('Which instrument?')
    expect(after[0]?.label).toBe('Primary instrument')
  })
})
