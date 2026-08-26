'use client'

import type { FieldError, UseFormRegister } from 'react-hook-form'
import type { SignupQuestion } from '@/lib/signup/types'

interface Props {
  question: SignupQuestion
  register: UseFormRegister<Record<string, unknown>>
  error?: FieldError | undefined
}

const CONTROL =
  'mt-1 w-full rounded border border-kawai-neutral bg-white px-3 py-2 text-sm text-kawai-black focus:border-kawai-red focus:outline-none focus:ring-2 focus:ring-kawai-red/30'
const LABEL = 'block text-xs font-semibold uppercase tracking-[0.12em] text-kawai-charcoal'

/**
 * One campaign-defined question.
 *
 * Every branch emits a real <label> or <fieldset>/<legend>. A placeholder is
 * not an accessible name (WCAG 1.3.1 / 3.3.2 / 4.1.2), and this form is under
 * an active ADA obligation.
 */
export function SignupQuestionField({ question, register, error }: Props) {
  const id = `q-${question.name}`
  const describedBy =
    [question.helpText ? `${id}-help` : null, error ? `${id}-error` : null]
      .filter(Boolean)
      .join(' ') || undefined

  const help = question.helpText ? (
    <p id={`${id}-help`} className="mt-1 text-xs text-kawai-charcoal/70">
      {question.helpText}
    </p>
  ) : null

  const errorEl = error ? (
    <p id={`${id}-error`} role="alert" className="mt-1 animate-signup-error-in text-xs text-kawai-red">
      {error.message}
    </p>
  ) : null

  const req = question.required ? ' *' : ''

  if (question.type === 'checkbox') {
    return (
      <div>
        <label htmlFor={id} className="flex items-start gap-2 text-sm text-kawai-black">
          <input
            id={id}
            type="checkbox"
            aria-describedby={describedBy}
            {...register(question.name)}
            className="mt-0.5 h-4 w-4 rounded border-kawai-neutral text-kawai-red focus:ring-kawai-red/30"
          />
          <span>
            {question.label}
            {req}
          </span>
        </label>
        {help}
        {errorEl}
      </div>
    )
  }

  if (question.type === 'radio') {
    return (
      <fieldset aria-describedby={describedBy}>
        <legend className={LABEL}>
          {question.label}
          {req}
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {(question.options ?? []).map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-kawai-neutral bg-white px-3 py-1.5 text-sm text-kawai-charcoal transition-colors has-[:checked]:border-kawai-black has-[:checked]:bg-kawai-black has-[:checked]:text-kawai-pearl has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-kawai-red/40"
            >
              <input
                type="radio"
                value={option.value}
                {...register(question.name)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
        {help}
        {errorEl}
      </fieldset>
    )
  }

  if (question.type === 'select') {
    return (
      <div>
        <label htmlFor={id} className={LABEL}>
          {question.label}
          {req}
        </label>
        <select id={id} aria-describedby={describedBy} {...register(question.name)} className={CONTROL}>
          <option value="">Please choose…</option>
          {(question.options ?? []).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {help}
        {errorEl}
      </div>
    )
  }

  if (question.type === 'textarea') {
    return (
      <div>
        <label htmlFor={id} className={LABEL}>
          {question.label}
          {req}
        </label>
        <textarea id={id} rows={3} aria-describedby={describedBy} {...register(question.name)} className={CONTROL} />
        {help}
        {errorEl}
      </div>
    )
  }

  return (
    <div>
      <label htmlFor={id} className={LABEL}>
        {question.label}
        {req}
      </label>
      <input
        id={id}
        type={question.type === 'date' ? 'date' : 'text'}
        aria-describedby={describedBy}
        {...register(question.name)}
        className={CONTROL}
      />
      {help}
      {errorEl}
    </div>
  )
}
