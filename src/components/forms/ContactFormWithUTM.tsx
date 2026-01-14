/**
 * Contact Form with UTM Attribution Tracking
 *
 * Complete example of a contact form that captures UTM parameters
 * for marketing attribution in the CRM.
 *
 * Features:
 * - Form validation
 * - UTM tag extraction from sessionStorage
 * - Server action submission
 * - Loading and success states
 * - Error handling
 * - Accessibility
 */
'use client'

import { useState, type FormEvent } from 'react'
import { submitContactFormWithUTM } from '@/lib/actions/contact-form-with-utm'
import { getUTMTags } from '@/lib/shopify/utm-tracking'

interface ContactFormProps {
  /** Default storefront/location (optional) */
  defaultStorefront?: string
  /** Callback on successful submission */
  onSuccess?: () => void
  /** Custom submit button text */
  submitText?: string
}

export function ContactFormWithUTM({
  defaultStorefront,
  onSuccess,
  submitText = 'Send Message'
}: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage(null)

    const formElement = e.currentTarget
    const formData = new FormData(formElement)

    // ============================================================================
    // Get UTM tags from sessionStorage (client-side only)
    // ============================================================================
    const utmTags = getUTMTags()

    // Add UTM tags to form data as JSON string
    // This allows passing array data through FormData
    formData.set('utmTags', JSON.stringify(utmTags))

    // Log for debugging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('[Contact Form] Submitting with UTM tags:', utmTags)
    }

    // ============================================================================
    // Submit to server action
    // ============================================================================
    try {
      const result = await submitContactFormWithUTM(formData)

      if (result.success) {
        setStatus('success')
        formElement.reset()

        // Callback for parent component
        if (onSuccess) {
          onSuccess()
        }

        // Auto-reset after 5 seconds
        setTimeout(() => {
          setStatus('idle')
        }, 5000)
      } else {
        setStatus('error')
        setErrorMessage(result.error || 'Failed to submit form')
      }
    } catch (error) {
      console.error('[Contact Form] Submission error:', error)
      setStatus('error')
      setErrorMessage('An unexpected error occurred. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ============================================================================
          Personal Information
          ============================================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            disabled={status === 'submitting'}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kawai-red focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="John"
          />
        </div>

        {/* Last Name */}
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            disabled={status === 'submitting'}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kawai-red focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Doe"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          disabled={status === 'submitting'}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kawai-red focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="john.doe@example.com"
        />
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          disabled={status === 'submitting'}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kawai-red focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="(555) 123-4567"
        />
      </div>

      {/* ============================================================================
          Inquiry Details
          ============================================================================ */}

      {/* Storefront/Location */}
      <div>
        <label
          htmlFor="storefront"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Preferred Location <span className="text-red-500">*</span>
        </label>
        <select
          id="storefront"
          name="storefront"
          required
          disabled={status === 'submitting'}
          defaultValue={defaultStorefront || ''}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kawai-red focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Select a location...</option>
          <option value="stlouis">St. Louis</option>
          <option value="chicago">Chicago</option>
          <option value="nashville">Nashville</option>
          <option value="atlanta">Atlanta</option>
          <option value="dallas">Dallas</option>
        </select>
      </div>

      {/* Inquiry Type */}
      <div>
        <label
          htmlFor="inquiryType"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          How can we help? <span className="text-red-500">*</span>
        </label>
        <select
          id="inquiryType"
          name="inquiryType"
          required
          disabled={status === 'submitting'}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kawai-red focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Select inquiry type...</option>
          <option value="consultation">Piano Consultation</option>
          <option value="pricing">Pricing Information</option>
          <option value="trial">Home Trial Request</option>
          <option value="service">Service & Maintenance</option>
          <option value="financing">Financing Options</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          disabled={status === 'submitting'}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kawai-red focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="Tell us more about your needs..."
        />
      </div>

      {/* ============================================================================
          Marketing Consent
          ============================================================================ */}

      <div>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="subscribe"
            value="true"
            disabled={status === 'submitting'}
            className="mt-1 w-4 h-4 text-kawai-red border-gray-300 rounded focus:ring-kawai-red disabled:cursor-not-allowed"
          />
          <span className="text-sm text-gray-600">
            I would like to receive updates about new products, events, and special offers.
            You can unsubscribe at any time.
          </span>
        </label>
      </div>

      {/* ============================================================================
          Status Messages
          ============================================================================ */}

      {/* Success Message */}
      {status === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-green-800 font-medium">
              Thank you for contacting us!
            </p>
          </div>
          <p className="text-green-700 text-sm mt-2">
            We've received your message and will get back to you shortly.
          </p>
        </div>
      )}

      {/* Error Message */}
      {status === 'error' && errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-800 font-medium">
              Error submitting form
            </p>
          </div>
          <p className="text-red-700 text-sm mt-2">
            {errorMessage}
          </p>
        </div>
      )}

      {/* ============================================================================
          Submit Button
          ============================================================================ */}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full py-3 px-6 bg-kawai-red text-white font-semibold rounded-md hover:bg-kawai-red-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sending...
          </span>
        ) : (
          submitText
        )}
      </button>

      {/* Privacy Notice */}
      <p className="text-xs text-gray-500 text-center">
        By submitting this form, you agree to our{' '}
        <a href="/privacy" className="text-kawai-red hover:underline">
          Privacy Policy
        </a>
        . We respect your privacy and will never share your information.
      </p>
    </form>
  )
}
