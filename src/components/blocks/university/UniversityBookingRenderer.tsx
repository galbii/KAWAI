'use client'

import React, { useState, type FormEvent } from 'react'
import { cn } from '@/lib/utils'

interface TrustBadge {
  text: string
  id?: string
}

interface UniversityBookingRendererProps {
  block: {
    heading?: string
    subheading?: string
    description?: string
    formIntroText?: string
    privacyNotice?: string
    calendlyUrl: string
    trustBadges?: TrustBadge[]
    backgroundColor?: 'light' | 'white' | 'dark' | 'red'
  }
}

interface FormData {
  firstName: string
  lastName: string
  email: string
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
}

// ── Background color map ──────────────────────────────────────────────────────
const bgColorMap: Record<string, string> = {
  light: 'bg-kawai-pearl',
  white: 'bg-white',
  dark: 'bg-kawai-black',
  red: 'bg-kawai-red',
}

const textColorMap: Record<string, string> = {
  light: 'text-kawai-black',
  white: 'text-kawai-black',
  dark: 'text-white',
  red: 'text-white',
}

const mutedColorMap: Record<string, string> = {
  light: 'text-kawai-black/70',
  white: 'text-kawai-black/70',
  dark: 'text-white/70',
  red: 'text-white/80',
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function CalendlySkeleton() {
  return (
    <div className="bg-white rounded-xl border border-kawai-neutral p-6 space-y-4 animate-pulse">
      <div className="text-center mb-4">
        <div className="w-8 h-8 border-2 border-kawai-red border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-kawai-black/60 text-sm font-medium">Preparing your booking experience…</p>
      </div>
      {/* Month header skeleton */}
      <div className="h-8 bg-kawai-neutral/50 rounded" />
      {/* Calendar grid skeleton */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="h-8 bg-kawai-neutral/40 rounded" />
        ))}
      </div>
      {/* Time slots skeleton */}
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-10 bg-kawai-neutral/40 rounded" />
        ))}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function UniversityBookingRenderer({ block }: UniversityBookingRendererProps) {
  const {
    heading,
    subheading,
    description,
    formIntroText,
    privacyNotice,
    calendlyUrl,
    trustBadges,
    backgroundColor = 'light',
  } = block

  // Step state: 'form' → 'calendly'
  const [step, setStep] = useState<'form' | 'calendly'>('form')
  const [iframeLoaded, setIframeLoaded] = useState(false)

  // Form state
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Derived Calendly URL with prefill params
  const [calendlyWithPrefill, setCalendlyWithPrefill] = useState<string>(calendlyUrl)

  // Validate form fields
  const validate = (): boolean => {
    const next: FormErrors = {}

    if (!formData.firstName.trim()) {
      next.firstName = 'First name is required'
    } else if (formData.firstName.trim().length < 2) {
      next.firstName = 'Must be at least 2 characters'
    }

    if (!formData.lastName.trim()) {
      next.lastName = 'Last name is required'
    } else if (formData.lastName.trim().length < 2) {
      next.lastName = 'Must be at least 2 characters'
    }

    if (!formData.email.trim()) {
      next.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      next.email = 'Please enter a valid email address'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  // Handle input changes (clears field error on keystroke)
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  // Step 1 → Step 2 transition
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)

    // Build prefilled Calendly URL
    const base = calendlyUrl.replace(/\/$/, '')
    const params = new URLSearchParams({
      name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      email: formData.email.trim().toLowerCase(),
      hide_gdpr_banner: '1',
    })
    setCalendlyWithPrefill(`${base}?${params.toString()}`)

    // Brief UX delay
    await new Promise((resolve) => setTimeout(resolve, 400))

    setIsSubmitting(false)
    setStep('calendly')
  }

  const bgClass = bgColorMap[backgroundColor] ?? bgColorMap['light']
  const textClass = textColorMap[backgroundColor] ?? textColorMap['light']
  const mutedClass = mutedColorMap[backgroundColor] ?? mutedColorMap['light']

  // ── Input field shared classes ──
  const inputBase =
    'w-full px-4 py-3 border rounded-lg transition-colors text-kawai-black bg-white focus:outline-none focus:ring-2 focus:ring-kawai-red focus:border-kawai-red'

  return (
    <section className={cn('py-16 md:py-24', bgClass)}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2
                className={cn(
                  'text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3',
                  textClass,
                )}
              >
                {heading}
              </h2>
            )}
            {subheading && (
              <p className={cn('text-lg md:text-xl leading-relaxed max-w-2xl mx-auto', mutedClass)}>
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* ── Left column: description ── */}
          <div className="space-y-6">
            {description && (
              <p
                className={cn(
                  'text-base md:text-lg leading-relaxed',
                  step === 'form' ? mutedClass : mutedClass,
                )}
              >
                {description}
              </p>
            )}

            {/* Trust badges — shown in left column on desktop, below form on mobile */}
            {trustBadges && trustBadges.length > 0 && (
              <div className="hidden lg:flex flex-col gap-3 mt-8">
                {trustBadges.map((badge, i) => (
                  <div key={badge.id ?? i} className="flex items-center gap-2">
                    <svg
                      className={cn('w-4 h-4 flex-shrink-0', backgroundColor === 'red' || backgroundColor === 'dark' ? 'text-white/80' : 'text-kawai-red')}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 1a9 9 0 100 18A9 9 0 0010 1zm4.293 6.293a1 1 0 00-1.414-1.414L9 10.758 7.121 8.879a1 1 0 00-1.414 1.414l2.5 2.5a1 1 0 001.414 0l4.672-4.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className={cn('text-sm', mutedClass)}>{badge.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Right column: form or Calendly ── */}
          <div>
            {step === 'form' ? (
              /* ── Step 1: Contact capture form ── */
              <div className="bg-white rounded-2xl shadow-brand-medium p-8">
                {formIntroText && (
                  <p className="text-kawai-black/70 text-sm mb-6 text-center">{formIntroText}</p>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* First name */}
                  <div>
                    <label
                      htmlFor="ub-firstName"
                      className="block text-sm font-medium text-kawai-black mb-1.5"
                    >
                      First Name <span className="text-kawai-red">*</span>
                    </label>
                    <input
                      id="ub-firstName"
                      type="text"
                      autoComplete="given-name"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className={cn(inputBase, errors.firstName && 'border-kawai-red', !errors.firstName && 'border-kawai-neutral')}
                      placeholder="Jane"
                      disabled={isSubmitting}
                    />
                    {errors.firstName && (
                      <p className="text-kawai-red text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  {/* Last name */}
                  <div>
                    <label
                      htmlFor="ub-lastName"
                      className="block text-sm font-medium text-kawai-black mb-1.5"
                    >
                      Last Name <span className="text-kawai-red">*</span>
                    </label>
                    <input
                      id="ub-lastName"
                      type="text"
                      autoComplete="family-name"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className={cn(inputBase, errors.lastName && 'border-kawai-red', !errors.lastName && 'border-kawai-neutral')}
                      placeholder="Smith"
                      disabled={isSubmitting}
                    />
                    {errors.lastName && (
                      <p className="text-kawai-red text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="ub-email"
                      className="block text-sm font-medium text-kawai-black mb-1.5"
                    >
                      Email Address <span className="text-kawai-red">*</span>
                    </label>
                    <input
                      id="ub-email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={cn(inputBase, errors.email && 'border-kawai-red', !errors.email && 'border-kawai-neutral')}
                      placeholder="jane.smith@example.com"
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <p className="text-kawai-red text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      'w-full py-4 px-6 rounded-lg font-semibold text-white text-base tracking-wide transition-all duration-200',
                      'bg-kawai-red hover:bg-kawai-red-700 active:scale-[0.98]',
                      'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-kawai-red',
                      'shadow-brand-red-glow',
                    )}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Continuing…
                      </span>
                    ) : (
                      'Continue to Schedule →'
                    )}
                  </button>
                </form>

                {/* Privacy notice */}
                {privacyNotice && (
                  <p className="text-kawai-black/50 text-xs text-center mt-4">{privacyNotice}</p>
                )}

                {/* Mobile trust badges */}
                {trustBadges && trustBadges.length > 0 && (
                  <div className="flex flex-col gap-2 mt-6 pt-5 border-t border-kawai-neutral lg:hidden">
                    {trustBadges.map((badge, i) => (
                      <div key={badge.id ?? i} className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 flex-shrink-0 text-kawai-red"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 1a9 9 0 100 18A9 9 0 0010 1zm4.293 6.293a1 1 0 00-1.414-1.414L9 10.758 7.121 8.879a1 1 0 00-1.414 1.414l2.5 2.5a1 1 0 001.414 0l4.672-4.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-kawai-black/60 text-xs">{badge.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* ── Step 2: Calendly iframe ── */
              <div className="relative">
                {/* Loading skeleton — shown until iframe fires onLoad */}
                {!iframeLoaded && <CalendlySkeleton />}

                <div
                  className={cn(
                    'bg-white rounded-xl shadow-brand-medium border border-kawai-neutral overflow-hidden transition-opacity duration-500',
                    iframeLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0',
                  )}
                >
                  <iframe
                    src={calendlyWithPrefill}
                    title="Book an appointment"
                    width="100%"
                    height="700"
                    className="block border-0"
                    onLoad={() => setIframeLoaded(true)}
                    allow="payment"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
