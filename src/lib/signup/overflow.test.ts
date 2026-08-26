import { describe, expect, it } from 'bun:test'
import { RAIL_QUESTION_LIMIT, hiddenQuestions, requiresOverflowStep } from './overflow'
import type { SignupQuestion } from './types'

const q = (name: string, required = false): SignupQuestion =>
  ({ name, label: name, type: 'text', required }) as SignupQuestion

const many = (n: number, requiredIndexes: number[] = []) =>
  Array.from({ length: n }, (_, i) => q(`q${i}`, requiredIndexes.includes(i)))

describe('requiresOverflowStep', () => {
  it('does not force the popup when everything fits in the rail', () => {
    expect(requiresOverflowStep(many(RAIL_QUESTION_LIMIT))).toBe(false)
    expect(requiresOverflowStep([])).toBe(false)
  })

  // The case this exists for: one optional question past the fold should not
  // cost the visitor a whole extra screen.
  it('submits directly when the hidden questions are all optional', () => {
    expect(requiresOverflowStep(many(5))).toBe(false)
    expect(requiresOverflowStep(many(9))).toBe(false)
  })

  it('forces the popup when a hidden question is required', () => {
    expect(requiresOverflowStep(many(5, [4]))).toBe(true)
    expect(requiresOverflowStep(many(8, [7]))).toBe(true)
  })

  // A required question the visitor can already see needs no second screen.
  it('ignores required questions that are visible in the rail', () => {
    expect(requiresOverflowStep(many(5, [0, 1, 2, 3]))).toBe(false)
  })

  it('reports which questions the rail truncates', () => {
    expect(hiddenQuestions(many(6)).map((x) => x.name)).toEqual(['q4', 'q5'])
    expect(hiddenQuestions(many(3))).toEqual([])
  })
})
