'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { buildSignupSchema } from '@/lib/signup/schema'
import type { SignupCoreConfig, SignupQuestion } from '@/lib/signup/types'
import { SignupQuestionField } from './SignupQuestionField'
import { submitSignupCampaign } from '@/lib/actions/signup-campaign-submit'
import { RAIL_QUESTION_LIMIT, hiddenQuestions, requiresOverflowStep } from '@/lib/signup/overflow'
import { pushSignupFormSubmitted } from '@/lib/signup/analytics'

export { RAIL_QUESTION_LIMIT }

export interface SignupSuccess {
  mode: 'message' | 'redirect'
  message?: string | undefined
  redirectUrl?: string | undefined
}

interface Props {
  campaignSlug: string
  storeslug: string
  core: SignupCoreConfig
  questions: SignupQuestion[]
  submitLabel: string
  finePrint?: string | null | undefined
  /** Render only the first RAIL_QUESTION_LIMIT questions; the rest live in the modal. */
  inlineOnly?: boolean
  /**
   * Stagger the fields in on mount. Only for the popup, which mounts on a
   * deliberate action — the rail is present from page load, so animating it
   * would mean fields sliding around during the reader's first scroll.
   */
  animateIn?: boolean
  /**
   * Called with everything typed so far when the visitor hits Continue. The
   * values must travel — the popup is a different form instance, so without
   * them the visitor watches their own answers get thrown away.
   */
  onOverflow?: (values: Record<string, unknown>) => void
  /** Seeds the popup with what was already entered in the rail. */
  defaultValues?: Record<string, unknown> | undefined
  onSuccess: (result: SignupSuccess) => void
}

const CONTROL =
  'mt-1 w-full rounded border border-kawai-neutral bg-white px-3 py-2 text-sm text-kawai-black transition-colors focus:border-kawai-red focus:outline-none focus:ring-2 focus:ring-kawai-red/30'
const LABEL = 'block text-xs font-semibold uppercase tracking-[0.12em] text-kawai-charcoal'
const ERROR = 'mt-1 animate-signup-error-in text-xs text-kawai-red'

/**
 * Staggers one field group into view. The cap keeps a long campaign form from
 * making the last question wait — past eight groups every remaining one shares
 * the same delay rather than compounding into a wait the visitor can feel.
 */
function Reveal({
  on,
  index,
  children,
}: {
  on: boolean
  index: number
  children: React.ReactNode
}) {
  if (!on) return <>{children}</>
  return (
    <div
      className="animate-signup-field-in"
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      {children}
    </div>
  )
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function SignupForm({
  campaignSlug,
  storeslug,
  core,
  questions,
  submitLabel,
  finePrint,
  inlineOnly = false,
  animateIn = false,
  onOverflow,
  defaultValues,
  onSuccess,
}: Props) {
  const [serverError, setServerError] = useState<string | null>(null)
  const schema = buildSignupSchema(core, questions)
  const { register, handleSubmit, getValues, formState } = useForm<Record<string, unknown>>({
    resolver: zodResolver(schema as never),
    ...(defaultValues ? { defaultValues } : {}),
  })

  const shown = inlineOnly ? questions.slice(0, RAIL_QUESTION_LIMIT) : questions

  // Only a REQUIRED question past the fold earns the extra screen. Optional
  // ones are dropped rather than charged for — see lib/signup/overflow.ts.
  const mustStepThrough = inlineOnly && requiresOverflowStep(questions)
  const skippedOptional = inlineOnly && !mustStepThrough ? hiddenQuestions(questions) : []

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)
    const result = await submitSignupCampaign({ campaignSlug, storeslug, values })
    if (!result.success) {
      setServerError(result.error)
      return
    }

    // A honeypot hit also returns success, so the bot learns nothing from the
    // response. It is not a lead though, and counting it would inflate the
    // conversion number the ad spend is judged against. The client already
    // knows what it submitted, so it can skip the event without the response
    // giving the game away.
    const trippedHoneypot = typeof values.company === 'string' && values.company.trim() !== ''

    // Fired before onSuccess because a redirect-mode campaign navigates away
    // there, and the push would never run.
    if (!trippedHoneypot) {
      pushSignupFormSubmitted({
        campaignSlug,
        storeslug,
        email: String(values.email ?? ''),
        phone: values.phone ? String(values.phone) : undefined,
        zip: values.zip ? String(values.zip) : undefined,
      })
    }

    onSuccess({ mode: result.mode, message: result.message, redirectUrl: result.redirectUrl })
  })

  const fieldError = (name: string) => {
    const err = formState.errors[name]
    return err ? String(err.message) : null
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3">
      {/* Honeypot — off-screen and hidden from assistive tech, so only an
          automated filler will populate it. */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        {...register('company')}
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <Reveal on={animateIn} index={0}>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="firstName" className={LABEL}>
            First name *
          </label>
          <input id="firstName" autoComplete="given-name" {...register('firstName')} className={CONTROL} />
          {fieldError('firstName') ? (
            <p role="alert" className={ERROR}>
              {fieldError('firstName')}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="lastName" className={LABEL}>
            Last name *
          </label>
          <input id="lastName" autoComplete="family-name" {...register('lastName')} className={CONTROL} />
          {fieldError('lastName') ? (
            <p role="alert" className={ERROR}>
              {fieldError('lastName')}
            </p>
          ) : null}
        </div>
      </div>
      </Reveal>

      <Reveal on={animateIn} index={1}>
      <div>
        <label htmlFor="email" className={LABEL}>
          Email *
        </label>
        <input id="email" type="email" autoComplete="email" {...register('email')} className={CONTROL} />
        {fieldError('email') ? (
          <p role="alert" className={ERROR}>
            {fieldError('email')}
          </p>
        ) : null}
      </div>
      </Reveal>

      {core.collectPhone || core.collectZip ? (
        <Reveal on={animateIn} index={2}>
        <div className="grid grid-cols-2 gap-3">
          {core.collectPhone ? (
            <div>
              <label htmlFor="phone" className={LABEL}>
                Phone{core.requirePhone ? ' *' : ''}
              </label>
              <input id="phone" type="tel" autoComplete="tel" {...register('phone')} className={CONTROL} />
              {fieldError('phone') ? (
                <p role="alert" className={ERROR}>
                  {fieldError('phone')}
                </p>
              ) : null}
            </div>
          ) : null}
          {core.collectZip ? (
            <div>
              <label htmlFor="zip" className={LABEL}>
                ZIP{core.requireZip ? ' *' : ''}
              </label>
              <input id="zip" autoComplete="postal-code" {...register('zip')} className={CONTROL} />
              {fieldError('zip') ? (
                <p role="alert" className={ERROR}>
                  {fieldError('zip')}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
        </Reveal>
      ) : null}

      {shown.length > 0 ? (
        <div className="space-y-3 border-t border-kawai-neutral/60 pt-3">
          {shown.map((q, i) => (
            <Reveal key={q.name} on={animateIn} index={3 + i}>
              <SignupQuestionField
                question={q}
                register={register}
                error={formState.errors[q.name] as never}
              />
            </Reveal>
          ))}
        </div>
      ) : null}

      {serverError ? (
        <p
          role="alert"
          className="animate-signup-error-in rounded bg-kawai-red/10 px-3 py-2 text-sm text-kawai-red"
        >
          {serverError}
        </p>
      ) : null}

      {mustStepThrough ? (
        <button
          type="button"
          // Hand over the current values, not the click event.
          onClick={() => onOverflow?.(getValues())}
          className="w-full rounded bg-kawai-red px-4 py-3 font-bold text-white transition-[background-color,transform] duration-150 hover:bg-kawai-red-600 active:scale-[0.99]"
        >
          Continue
        </button>
      ) : (
        <button
          type="submit"
          disabled={formState.isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded bg-kawai-red px-4 py-3 font-bold text-white transition-[background-color,transform] duration-150 hover:bg-kawai-red-600 active:scale-[0.99] disabled:opacity-60 disabled:active:scale-100"
        >
          {formState.isSubmitting ? (
            <>
              <Spinner />
              Sending…
            </>
          ) : (
            submitLabel
          )}
        </button>
      )}

      {skippedOptional.length > 0 ? (
        // These questions are configured but never rendered in the rail. Without
        // this the marketer's fifth question would silently do nothing, so the
        // way to reach it stays available — as a quiet link, not a second step.
        <button
          type="button"
          onClick={() => onOverflow?.(getValues())}
          className="mx-auto block text-xs font-medium text-kawai-charcoal underline underline-offset-2 hover:text-kawai-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red"
        >
          Add more details (optional)
        </button>
      ) : null}

      {finePrint ? (
        <p className="text-center text-[11px] leading-snug text-kawai-charcoal/60">{finePrint}</p>
      ) : null}
    </form>
  )
}
