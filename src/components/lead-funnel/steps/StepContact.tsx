'use client'

/**
 * Step 1 — Offer + Contact capture.
 * Collects name / phone / email + marketing consent and saves the lead to
 * Shopify. On success, advances the funnel with the captured email.
 */

import { useTransition, useState } from 'react'
import { useForm } from 'react-hook-form'
import { EnvelopeIcon, UserIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { FormField } from '@/components/ui/form-field'
import { FormAlert } from '@/components/ui/form-alert'
import { submitLeadContact } from '@/lib/actions/lead-funnel'
import type { LeadFunnelConfig } from '../types'
import type { ThemeTokens } from '../theme'

interface FormValues {
  firstName: string
  lastName: string
  phone: string
  email: string
  consent: boolean
}

const DEFAULT_CONSENT =
  'By clicking below, you agree to receive marketing communications from Kawai. ' +
  'Message and data rates may apply. You can unsubscribe at any time.'

interface StepContactProps {
  theme: ThemeTokens
  config: LeadFunnelConfig['offer']
  /** Comma-separated source tags from the funnel config. */
  customTags: string
  onSuccess: (email: string) => void
}

export function StepContact({ theme, config, customTags, onSuccess }: StepContactProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

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
      {/* Heading */}
      <div className="mb-5">
        <h2
          className="mb-2 text-2xl font-semibold tracking-tight"
          style={{ color: theme.heading, fontFamily: 'var(--font-brand-serif)' }}
        >
          {config?.heading ?? 'Save on your next Kawai'}
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: theme.subheading }}>
          {config?.subheading ??
            'Sign up for an exclusive discount and a local Kawai dealer will be in touch.'}
        </p>
      </div>

      {serverError && <FormAlert variant="error" message={serverError} className="mb-4" />}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
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

        <FormField
          name="email"
          label="Email Address"
          type="email"
          placeholder="your@email.com"
          required
          icon={EnvelopeIcon}
          error={errors.email}
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
    </div>
  )
}
