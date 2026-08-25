import type { SignupAnswer, SignupQuestion } from './types'

/**
 * Freeze a submission's answers into `{ name, label, value }` triples.
 *
 * Leads store the question label as it read at submission time rather than a
 * pointer into the live campaign. Marketers rename, reorder and delete
 * questions constantly; without this snapshot, one edit would quietly make
 * every historical lead unreadable and a deleted question would orphan its
 * answers outright.
 */
export function denormalizeAnswers(
  questions: SignupQuestion[],
  values: Record<string, unknown>,
): SignupAnswer[] {
  const answers: SignupAnswer[] = []

  for (const question of questions) {
    const raw = values[question.name]
    if (raw === undefined || raw === null || raw === '') continue

    answers.push({
      name: question.name,
      label: question.label,
      value: displayValue(question, raw),
    })
  }

  return answers
}

function displayValue(question: SignupQuestion, raw: unknown): string {
  if (typeof raw === 'boolean') return raw ? 'Yes' : 'No'

  const value = String(raw)
  const match = question.options?.find((o) => o.value === value)
  return match?.label ?? value
}
