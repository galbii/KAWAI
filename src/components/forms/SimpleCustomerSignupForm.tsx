'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useFormState } from 'react-dom'
import { submitSimpleCustomerSignup } from '@/lib/actions/simple-customer-signup'
import { UserIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import { FormField } from '@/components/ui/form-field'
import { FormAlert } from '@/components/ui/form-alert'
import { Button } from '@/components/ui/button'
import { trackLead } from '@/components/MetaPixel'

/**
 * Simple Customer Signup Form Component
 *
 * Reusable form component for collecting customer information (firstName, lastName, email)
 * and creating/updating Shopify customers with location tags.
 *
 * @example
 * ```tsx
 * <SimpleCustomerSignupForm
 *   storefrontSlug="dallas"
 *   title="Stay Connected"
 *   description="Sign up to receive updates"
 *   onSuccess={() => console.log('Form submitted!')}
 * />
 * ```
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
})

type SignupFormData = z.infer<typeof signupFormSchema>

export function SimpleCustomerSignupForm({
  storefrontSlug,
  title = 'Stay Connected',
  description = 'Sign up to receive updates about our piano collection and exclusive offers.',
  submitButtonText = 'Sign Up',
  imageUrl = null,
  customTags = null,
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
    // Create FormData object from the validated data
    const formData = new FormData()
    formData.append('firstName', data.firstName)
    formData.append('lastName', data.lastName)
    formData.append('email', data.email)
    formData.append('storefrontSlug', storefrontSlug)

    // Add custom tags from Payload CMS if provided
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

  // Check if form was successfully submitted via server action
  React.useEffect(() => {
    if (formState?.success) {
      reset() // Reset form fields

      // Fire Meta Pixel Lead event
      trackLead({
        content_name: 'Simple Customer Signup',
        content_category: storefrontSlug,
        value: 1.0, // Estimated lead value
        currency: 'USD',
      })

      // Call success callback if provided
      if (onSuccess) {
        onSuccess()
      }
    } else if (formState && !formState.success && onError) {
      // Call error callback if provided
      onError(formState.message)
    }
  }, [formState, reset, storefrontSlug, onSuccess, onError])

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-3xl font-serif text-kawai-black mb-2">{title}</h3>
        <p className="text-kawai-black/70">{description}</p>
      </div>

      {/* Server Error Display */}
      {formState && !formState.success && (
        <FormAlert
          variant="error"
          title="Error"
          message={formState.message}
          className="mb-6"
        />
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* First Name */}
        <FormField
          name="firstName"
          label="First Name"
          type="text"
          placeholder="John"
          required
          icon={UserIcon}
          {...(errors.firstName && { error: errors.firstName })}
          register={register}
        />

        {/* Last Name */}
        <FormField
          name="lastName"
          label="Last Name"
          type="text"
          placeholder="Smith"
          required
          icon={UserIcon}
          {...(errors.lastName && { error: errors.lastName })}
          register={register}
        />

        {/* Email */}
        <FormField
          name="email"
          label="Email Address"
          type="email"
          placeholder="john.smith@example.com"
          required
          icon={EnvelopeIcon}
          {...(errors.email && { error: errors.email })}
          register={register}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 text-lg bg-kawai-red hover:bg-kawai-black text-white"
        >
          {isSubmitting ? 'Submitting...' : submitButtonText}
        </Button>

        {/* Privacy Note */}
        <p className="text-xs text-kawai-black/50 text-center mt-4">
          Your information is secure and will only be used to contact you about our piano
          services.
        </p>
      </form>
    </div>
  )
}
