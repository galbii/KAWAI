import type { SignupQuestion } from './types'

/**
 * How many campaign questions render inline in the sticky rail.
 *
 * Past this, the rail's form would grow taller than the viewport and "sticky"
 * would quietly stop meaning anything — the card would just scroll away with
 * the page, removing the entire reason to choose this layout.
 */
export const RAIL_QUESTION_LIMIT = 4

/** The questions the rail truncates away. */
export function hiddenQuestions(questions: SignupQuestion[]): SignupQuestion[] {
  return questions.slice(RAIL_QUESTION_LIMIT)
}

/**
 * Whether the rail must send the visitor through the popup before submitting.
 *
 * Only a REQUIRED question past the fold justifies the extra step. When the
 * hidden questions are all optional the rail submits straight away and they go
 * unanswered, which is the correct trade: an optional question is by definition
 * one the campaign can live without, and a second screen to reach it costs more
 * leads than the answers are worth.
 *
 * A required one is different — skipping it would fail validation anyway, since
 * the schema is built from every question rather than the visible ones.
 */
export function requiresOverflowStep(questions: SignupQuestion[]): boolean {
  return hiddenQuestions(questions).some((q) => q.required === true)
}
