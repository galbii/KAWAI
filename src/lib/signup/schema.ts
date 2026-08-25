import { z } from 'zod'
import type { SignupCoreConfig, SignupQuestion } from './types'

/**
 * Build the validation schema for one campaign's form.
 *
 * The server derives this from the STORED campaign on every submission — the
 * client never supplies field definitions. If it could, a crafted POST would
 * bypass every `required` constraint and every option whitelist.
 *
 * Zod strips unknown keys by default, so anything the campaign did not define
 * is silently dropped rather than reaching the database.
 */
export function buildSignupSchema(
  core: SignupCoreConfig,
  questions: SignupQuestion[],
) {
  const shape: Record<string, z.ZodTypeAny> = {
    firstName: z.string().trim().min(1, 'Please enter your first name'),
    lastName: z.string().trim().min(1, 'Please enter your last name'),
    email: z.email('Please enter a valid email address'),
  }

  if (core.collectPhone) {
    const phone = z.string().trim()
    shape.phone = core.requirePhone
      ? phone.min(10, 'Please enter a valid phone number')
      : phone.optional()
  }

  if (core.collectZip) {
    const zip = z.string().trim()
    shape.zip = core.requireZip
      ? zip.min(3, 'Please enter your ZIP or postal code')
      : zip.optional()
  }

  for (const question of questions) {
    shape[question.name] = questionSchema(question)
  }

  return z.object(shape)
}

function questionSchema(question: SignupQuestion): z.ZodTypeAny {
  const required = question.required === true

  if (question.type === 'checkbox') {
    // Unchecked boxes are simply absent from a form POST, so a checkbox is
    // never "missing" — it is false. A required checkbox means "must be ticked".
    const box = z.coerce.boolean().default(false)
    return required
      ? box.refine((v) => v === true, { message: `${question.label} is required` })
      : box
  }

  if (question.type === 'date') {
    const date = z.iso.date('Please enter a valid date')
    return required ? date : date.optional()
  }

  if (question.type === 'select' || question.type === 'radio') {
    const values = (question.options ?? []).map((o) => o.value).filter(Boolean)
    // A marketer can save an option-less select. Degrade to free text rather
    // than throwing at request time and taking the whole page down.
    if (values.length === 0) {
      const free = z.string().trim()
      return required ? free.min(1, `${question.label} is required`) : free.optional()
    }
    const choice = z.enum(values as [string, ...string[]])
    return required ? choice : choice.optional()
  }

  const text = z.string().trim()
  return required ? text.min(1, `${question.label} is required`) : text.optional()
}
