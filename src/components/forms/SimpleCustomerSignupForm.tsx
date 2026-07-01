'use client'

import React from 'react'
import { useForm, type UseFormRegisterReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useFormState } from 'react-dom'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { submitSimpleCustomerSignup } from '@/lib/actions/simple-customer-signup'
import { FormAlert } from '@/components/ui/form-alert'
import { DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { trackFormInteraction } from '@/lib/analytics/unified-tracking'

/**
 * Simple Customer Signup Form — luxury restyle.
 *
 * Collects firstName, lastName, email (+ optional opt-in) and creates/updates a
 * Shopify customer tagged with the storefront location. Behaviour is unchanged;
 * only the presentation was reworked for a quieter, more refined treatment.
 */

export interface SimpleCustomerSignupFormProps {
  /** Storefront slug for tagging customers (e.g., "dallas", "st-louis") */
  storefrontSlug: string
  /** Form title shown at the top */
  title?: string
  /** Form description/subtitle */
  description?: string
  /** Text for the submit button */
  submitButtonText?: string
  /** Optional image URL to display alongside the form */
  imageUrl?: string | null
  /** Optional custom tags from Payload CMS to apply to customers */
  customTags?: Array<{ tag: string }> | null
  /** Closes the surrounding modal */
  onClose?: () => void
  /** Callback fired when form submission is successful */
  onSuccess?: () => void
  /** Callback fired when form submission fails */
  onError?: (error: string) => void
}

// Client-side validation schema (must match server-side)
const signupFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subscribeToUpdates: z.boolean().optional(),
})

type SignupFormData = z.infer<typeof signupFormSchema>

/** Floating-label field with a hairline underline that sweeps red on focus. */
function Field({
  id,
  label,
  type = 'text',
  autoComplete,
  register,
  error,
}: {
  id: string
  label: string
  type?: string
  autoComplete?: string
  register: UseFormRegisterReturn
  error?: string | undefined
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        placeholder=" "
        autoComplete={autoComplete}
        aria-invalid={!!error}
        className="peer w-full border-0 border-b border-kawai-black/15 bg-transparent pb-2 pt-6 text-kawai-black placeholder:text-transparent focus:outline-none"
        {...register}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-0 top-5 text-base text-kawai-black/45 transition-all duration-200 peer-focus:top-0 peer-focus:text-xs peer-focus:uppercase peer-focus:tracking-[0.15em] peer-focus:text-kawai-black/60 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.15em] peer-[:not(:placeholder-shown)]:text-kawai-black/60"
      >
        {label}
      </label>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-kawai-red transition-transform duration-500 ease-out peer-focus:scale-x-100"
      />
      {error && <p className="mt-2 text-xs text-kawai-red">{error}</p>}
    </div>
  )
}

export function SimpleCustomerSignupForm({
  storefrontSlug,
  title = 'Stay Connected',
  description = 'Sign up to receive updates about our piano collection and exclusive offers.',
  submitButtonText = 'Sign Up',
  customTags = null,
  onClose,
  onSuccess,
  onError,
}: SimpleCustomerSignupFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
  })

  const [formState, formAction] = useFormState(submitSimpleCustomerSignup, null)

  const onSubmit = async (data: SignupFormData) => {
    const formData = new FormData()
    formData.append('firstName', data.firstName)
    formData.append('lastName', data.lastName)
    formData.append('email', data.email)
    formData.append('storefrontSlug', storefrontSlug)
    formData.append('subscribeToUpdates', String(data.subscribeToUpdates ?? false))

    if (customTags && customTags.length > 0) {
      const tagsString = customTags.map((t) => t.tag).join(',')
      formData.append('customTags', tagsString)
    }

    setIsSubmitting(true)
    try {
      await formAction(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  // React to server action result
  React.useEffect(() => {
    if (formState?.success) {
      reset()

      trackFormInteraction({
        blockType: 'forms-simple-signup',
        blockData: {},
        action: 'form_submit',
        formName: 'Customer Signup',
        additionalProps: {
          storefront: storefrontSlug,
        },
      })

      onSuccess?.()
    } else if (formState && !formState.success) {
      onError?.(formState.message)
    }
  }, [formState, reset, storefrontSlug, onSuccess, onError])

  return (
    <div className="relative flex h-full flex-col justify-center bg-white px-8 pb-10 pt-12 sm:px-12">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 z-20 text-kawai-black/40 transition-colors hover:text-kawai-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}

      {/* Header */}
      <div className="mb-9">
        <DialogTitle className="font-serif font-normal text-3xl leading-[1.1] tracking-tight text-kawai-black sm:text-[2rem]">
          {title}
        </DialogTitle>
        <div aria-hidden="true" className="mt-5 h-px w-12 bg-kawai-red" />
        <DialogDescription className="mt-5 max-w-sm text-sm leading-relaxed text-kawai-black/55">
          {description}
        </DialogDescription>
      </div>

      {/* Server Error Display */}
      {formState && !formState.success && (
        <FormAlert variant="error" title="Something went wrong" message={formState.message} className="mb-7" />
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        <div className="grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2">
          <Field
            id="firstName"
            label="First name"
            autoComplete="given-name"
            register={register('firstName')}
            error={errors.firstName?.message}
          />
          <Field
            id="lastName"
            label="Last name"
            autoComplete="family-name"
            register={register('lastName')}
            error={errors.lastName?.message}
          />
        </div>

        <Field
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          register={register('email')}
          error={errors.email?.message}
        />

        {/* Opt-in */}
        <label className="flex cursor-pointer items-start gap-3 pt-1">
          <input
            type="checkbox"
            {...register('subscribeToUpdates')}
            className="mt-0.5 h-4 w-4 shrink-0 accent-kawai-black"
          />
          <span className="text-sm leading-snug text-kawai-black/70">
            Send me news on new arrivals, private events, and exclusive offers.
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-kawai-black px-6 py-4 text-xs font-medium uppercase tracking-[0.25em] text-white transition-colors hover:bg-kawai-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Submitting' : submitButtonText}
        </button>

        <p className="text-center text-[11px] leading-relaxed tracking-wide text-kawai-black/40">
          Your information is kept private and used only to contact you about our pianos.
        </p>
      </form>
    </div>
  )
}
