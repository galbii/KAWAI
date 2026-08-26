'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { buildSignupSchema } from '@/lib/signup/schema'
import type { SignupCoreConfig, SignupQuestion } from '@/lib/signup/types'
import { SignupQuestionField } from './SignupQuestionField'
import { submitSignupCampaign } from '@/lib/actions/signup-campaign-submit'

/**
 * How many campaign questions render inline in the sticky rail.
 *
 * Past this, the rail's form would grow taller than the viewport and "sticky"
 * would quietly stop meaning anything — the card would just scroll away with
 * the page, removing the entire reason to choose this layout. The overflow
 * opens in a modal instead.
 */
export const RAIL_QUESTION_LIMIT = 4

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

  const overflow = questions.length > RAIL_QUESTION_LIMIT
  const shown = inlineOnly ? questions.slice(0, RAIL_QUESTION_LIMIT) : questions

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)
    const result = await submitSignupCampaign({ campaignSlug, storeslug, values })
    if (!result.success) {
      setServerError(result.error)
      return
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

      {inlineOnly && overflow ? (
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

      {finePrint ? (
        <p className="text-center text-[11px] leading-snug text-kawai-charcoal/60">{finePrint}</p>
      ) : null}
    </form>
  )
}
