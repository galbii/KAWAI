'use client'

import { useState, useEffect } from 'react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useFormState } from 'react-dom'
import { submitSimpleCustomerSignup } from '@/lib/actions/simple-customer-signup'
import { UserIcon, EnvelopeIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

/**
 * Simple Customer Signup Form Component - Modal Popup
 *
 * Displays as a modal popup when the page loads. Collects email, first name, and last name,
 * then creates/updates a Shopify customer tagged with the storefront location.
 *
 * @example
 * ```tsx
 * // In a storefront page
 * <SimpleCustomerSignup storefrontSlug="dallas" />
 * ```
 */

interface SimpleCustomerSignupProps {
  storefrontSlug: string
  title?: string
  description?: string
  submitButtonText?: string
  /** Delay in milliseconds before showing the modal (default: 1000ms) */
  showDelay?: number
  /** Success message title shown after form submission */
  successTitle?: string
  /** Success message description shown after form submission */
  successMessage?: string
  /** Optional image URL to display on the left side (desktop only) */
  imageUrl?: string | null
  /** Optional custom tags from Payload CMS to apply to customers */
  customTags?: Array<{ tag: string }> | null
}

// Client-side validation schema (must match server-side)
const signupFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address')
})

type SignupFormData = z.infer<typeof signupFormSchema>

export function SimpleCustomerSignup({
  storefrontSlug,
  title = 'Stay Connected',
  description = 'Sign up to receive updates about our piano collection and exclusive offers.',
  submitButtonText = 'Sign Up',
  showDelay = 1000,
  successTitle = 'Thank You for Signing Up!',
  successMessage = "We'll be in touch soon with updates about our piano collection.",
  imageUrl = null,
  customTags = null
}: SimpleCustomerSignupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema)
  })

  const [formState, formAction] = useFormState(submitSimpleCustomerSignup, null)

  // Show modal after delay on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, showDelay)

    return () => clearTimeout(timer)
  }, [showDelay])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const onSubmit = async (data: SignupFormData) => {
    // Create FormData object from the validated data
    const formData = new FormData()
    formData.append('firstName', data.firstName)
    formData.append('lastName', data.lastName)
    formData.append('email', data.email)
    formData.append('storefrontSlug', storefrontSlug)

    // Add custom tags from Payload CMS if provided
    if (customTags && customTags.length > 0) {
      const tagsString = customTags.map(t => t.tag).join(',')
      formData.append('customTags', tagsString)
    }

    setIsSubmitting(true)
    try {
      await formAction(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  // Check if form was successfully submitted via server action
  React.useEffect(() => {
    if (formState?.success) {
      setIsSubmitted(true)
      reset() // Reset form fields
    }
  }, [formState, reset])

  // Don't render anything if modal is not open
  if (!isOpen) {
    return null
  }

  // Success state
  if (isSubmitted) {
    return (
      <>
        {/* Modal Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
          onClick={handleClose}
          aria-hidden="true"
        />

        {/* Modal Content */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full relative animate-in fade-in zoom-in duration-300"
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-kawai-black/40 hover:text-kawai-black transition-colors"
              aria-label="Close"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            {/* Success Content */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-serif text-kawai-black mb-2">
                {successTitle}
              </h3>
              <p className="text-kawai-black/70 mb-6">
                {successMessage}
              </p>
              <button
                onClick={handleClose}
                className="bg-kawai-red hover:bg-kawai-black text-white px-8 py-3 rounded-md font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className={`bg-white rounded-lg shadow-2xl relative animate-in fade-in zoom-in duration-300 my-8 ${
            imageUrl ? 'max-w-[90vw] w-full max-h-[90vh]' : 'max-w-md w-full p-8'
          }`}
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-kawai-black/40 hover:text-kawai-black transition-colors z-10"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {/* Conditional Layout: Flex with Image or Centered Form */}
          <div className={imageUrl ? 'flex flex-col md:flex-row items-stretch h-full' : ''}>
            {/* Image Section (Desktop Only) - 70% width */}
            {imageUrl && (
              <div className="hidden md:flex items-center justify-center rounded-l-lg overflow-hidden bg-gray-100 md:w-[70%] min-h-[600px]">
                <Image
                  src={imageUrl}
                  alt="Piano gallery"
                  width={1200}
                  height={800}
                  className="w-full h-full object-cover"
                  priority
                  sizes="70vw"
                />
              </div>
            )}

            {/* Form Section - 30% width */}
            <div className={imageUrl ? 'p-8 md:p-12 lg:p-16 md:w-[30%] flex flex-col justify-center overflow-y-auto' : ''}>
              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-3xl font-serif text-kawai-black mb-2">{title}</h3>
                <p className="text-kawai-black/70">{description}</p>
              </div>

              {/* Server Error Display */}
              {formState && !formState.success && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center mb-1">
                    <svg
                      className="w-5 h-5 text-red-600 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <h4 className="font-medium text-red-800">Error</h4>
                  </div>
                  <p className="text-red-700 text-sm">{formState.message}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-kawai-black mb-2">
                First Name *
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-kawai-black/40" />
                <input
                  type="text"
                  {...register('firstName')}
                  className="w-full pl-10 pr-4 py-3 border border-kawai-black/20 rounded-md focus:border-kawai-red focus:outline-none transition-colors bg-white text-kawai-black placeholder:text-kawai-black/40"
                  placeholder="John"
                />
              </div>
              {errors.firstName && (
                <p className="text-kawai-red text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-kawai-black mb-2">
                Last Name *
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-kawai-black/40" />
                <input
                  type="text"
                  {...register('lastName')}
                  className="w-full pl-10 pr-4 py-3 border border-kawai-black/20 rounded-md focus:border-kawai-red focus:outline-none transition-colors bg-white text-kawai-black placeholder:text-kawai-black/40"
                  placeholder="Smith"
                />
              </div>
              {errors.lastName && (
                <p className="text-kawai-red text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-kawai-black mb-2">
                Email Address *
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-kawai-black/40" />
                <input
                  type="email"
                  {...register('email')}
                  className="w-full pl-10 pr-4 py-3 border border-kawai-black/20 rounded-md focus:border-kawai-red focus:outline-none transition-colors bg-white text-kawai-black placeholder:text-kawai-black/40"
                  placeholder="john.smith@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-kawai-red text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-md font-medium text-lg transition-all ${
                isSubmitting
                  ? 'bg-kawai-black/40 text-white cursor-not-allowed'
                  : 'bg-kawai-red hover:bg-kawai-black text-white hover:scale-105'
              }`}
            >
              {isSubmitting ? 'Submitting...' : submitButtonText}
            </button>

            {/* Privacy Note */}
            <p className="text-xs text-kawai-black/50 text-center mt-4">
              Your information is secure and will only be used to contact you about our piano services.
            </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
