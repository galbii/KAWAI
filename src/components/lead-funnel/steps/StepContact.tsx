'use client'

/**
 * Step 1 — Offer + Contact capture (two-phase).
 *
 *   Phase A ("email")   — ask for the email only + a "Next" button. Clicking
 *                         Next fires a partial Shopify upsert in the background
 *                         (email + source tags, no consent) so the lead is
 *                         banked even if the visitor abandons phase B.
 *   Phase B ("details") — first / last / phone + marketing consent, with the
 *                         email from phase A carried over (shown read-only at
 *                         the top and submitted as part of the form). On success
 *                         the funnel advances with the captured email.
 *
 * The email entered in phase A persists into phase B automatically: React Hook
 * Form retains values for unmounted fields (default shouldUnregister: false),
 * and a hidden input keeps it in the submitted payload.
 */

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import {
  EnvelopeIcon,
  UserIcon,
  PhoneIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'
import { FormField } from '@/components/ui/form-field'
import { FormAlert } from '@/components/ui/form-alert'
import { submitLeadContact, submitLeadEmail } from '@/lib/actions/lead-funnel'
import type { LeadFunnelConfig } from '../types'
import type { ThemeTokens } from '../theme'

interface FormValues {
  firstName: string
  lastName: string
  phone: string
  email: string
  consent: boolean
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const DEFAULT_CONSENT =
  'By clicking below, you agree to receive marketing communications from Kawai. ' +
  'Message and data rates may apply. You can unsubscribe at any time.'

type Phase = 'email' | 'details'

interface StepContactProps {
  theme: ThemeTokens
  config: LeadFunnelConfig['offer']
  /** Comma-separated source tags from the funnel config. */
  customTags: string
  onSuccess: (email: string) => void
}

export function StepContact({ theme, config, customTags, onSuccess }: StepContactProps) {
  const [phase, setPhase] = useState<Phase>('email')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FormValues>()

  // Phase A → B. Validate the email locally, bank it in the background, advance.
  const goToDetails = () => {
    const email = (getValues('email') ?? '').trim()
    if (!EMAIL_RE.test(email)) {
      setEmailError('Please enter a valid email address')
      return
    }
    setEmailError(null)
    // Fire-and-forget: banking the partial lead must never block the user, and
    // the final submit re-upserts the full record regardless of the outcome.
    void submitLeadEmail(email, customTags || undefined).catch(() => {})
    setPhase('details')
  }

  const onSubmit = (values: FormValues) => {
    setServerError(null)
    const fd = new FormData()
    fd.set('firstName', values.firstName)
    fd.set('lastName', values.lastName)
    fd.set('phone', values.phone)
    fd.set('email', values.email)
    fd.set('consent', values.consent ? 'true' : 'false')
    if (customTags) fd.set('customTags', customTags)

    startTransition(async () => {
      const result = await submitLeadContact(fd)
      if (result.success) {
        onSuccess(values.email)
      } else {
        setServerError(result.message)
      }
    })
  }

  return (
    <div>
      {/* Heading + step indicator */}
      <div className="mb-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h2
            className="text-2xl font-semibold tracking-tight"
            style={{ color: theme.heading, fontFamily: 'var(--font-brand-serif)' }}
          >
            {config?.heading ?? 'Save on your next Kawai'}
          </h2>
          <span
            className="mt-1 flex-shrink-0 text-xs font-medium uppercase tracking-wide"
            style={{ color: theme.mutedText }}
          >
            Step {phase === 'email' ? '1' : '2'} of 2
          </span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: theme.subheading }}>
          {phase === 'email'
            ? (config?.subheading ??
              'Sign up for an exclusive discount and a local Kawai dealer will be in touch.')
            : 'Just a few more details and your discount is on its way.'}
        </p>
      </div>

      {phase === 'email' ? (
        // ─── Phase A: email only ────────────────────────────────────────────
        <div className="flex flex-col gap-4">
          <FormField
            name="email"
            label="Email Address"
            type="email"
            placeholder="your@email.com"
            required
            icon={EnvelopeIcon}
            error={emailError ?? undefined}
            register={register as never}
          />

          <button
            type="button"
            onClick={goToDetails}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-md py-3 text-sm font-semibold transition-colors duration-150"
            style={{ background: theme.submitBg, color: theme.submitFg }}
          >
            Next
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      ) : (
        // ─── Phase B: the rest, with the email carried over ─────────────────
        <>
          {serverError && <FormAlert variant="error" message={serverError} className="mb-4" />}

          {/* Email confirmed in phase A */}
          <div
            className="mb-4 flex items-center justify-between gap-3 rounded-md border px-3 py-2.5"
            style={{ borderColor: theme.inputBorder, background: theme.inputBg }}
          >
            <span className="flex min-w-0 items-center gap-2">
              <CheckCircleIcon
                className="h-4 w-4 flex-shrink-0"
                style={{ color: theme.submitBg }}
              />
              <span className="truncate text-sm" style={{ color: theme.bodyText }}>
                {watch('email')}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setPhase('email')}
              className="flex-shrink-0 text-xs font-medium underline-offset-2 hover:underline"
              style={{ color: theme.subheading }}
            >
              Change
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            {/* Keep the phase-A email in the submitted payload */}
            <input type="hidden" {...register('email')} />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                name="firstName"
                label="First Name"
                placeholder="Jane"
                required
                icon={UserIcon}
                error={errors.firstName}
                register={register as never}
              />
              <FormField
                name="lastName"
                label="Last Name"
                placeholder="Smith"
                required
                error={errors.lastName}
                register={register as never}
              />
            </div>

            <FormField
              name="phone"
              label="Phone"
              type="tel"
              placeholder="(555) 123-4567"
              required
              icon={PhoneIcon}
              error={errors.phone}
              register={register as never}
            />

            {/* Consent */}
            <label className="flex cursor-pointer items-start gap-2.5">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 flex-shrink-0 accent-kawai-red"
                {...register('consent', { required: true })}
              />
              <span className="text-xs leading-relaxed" style={{ color: theme.mutedText }}>
                {config?.consentText ?? DEFAULT_CONSENT}
              </span>
            </label>
            {errors.consent && (
              <p className="-mt-2 text-sm" style={{ color: '#E11922' }}>
                Please agree to receive marketing communications to continue.
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="mt-1 w-full rounded-md py-3 text-sm font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-70"
              style={{ background: theme.submitBg, color: theme.submitFg }}
            >
              {isPending ? 'Submitting…' : (config?.submitText ?? 'Get my discount')}
            </button>
          </form>
        </>
      )}
    </div>
  )
}
