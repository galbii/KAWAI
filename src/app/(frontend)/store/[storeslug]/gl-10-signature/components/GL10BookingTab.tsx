'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { InlineWidget, useCalendlyEventListener } from 'react-calendly'
import { usePostHog } from 'posthog-js/react'
import { trackSubmitApplication } from '@/components/MetaPixel'
import { CheckCircle2, User, Phone, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGL10Context } from './GL10Context'
import useConstantContactIntegration, { type ConstantContactSubmissionData } from '@/hooks/useConstantContactIntegration'

// Zod validation schema for booking contact form
const bookingContactSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Please enter a valid first name'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Please enter a valid last name'),
  phone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .regex(/^[\d\s()+-]+$/, 'Please enter a valid phone number')
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => val.length >= 10, 'Phone number must be at least 10 digits')
})

type BookingContactFormData = z.infer<typeof bookingContactSchema>

// Phone number formatting utility
function formatPhoneNumber(value: string): string {
  const phoneNumber = value.replace(/\D/g, '')
  const phoneNumberLength = phoneNumber.length

  if (phoneNumberLength < 4) return phoneNumber
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
}

// Calendly URL for Houston Baby Grand Sale
const HOUSTON_CALENDLY_URL = 'https://calendly.com/kawaipianogallery/houston-baby-grand-sale-clone'

interface GL10BookingTabProps {
  className?: string
  onViewChange?: (view: 'signature' | 'gallery' | 'baby-grand' | 'millennium-action' | 'booking' | 'location') => void
}

export default function GL10BookingTab({ className, onViewChange }: GL10BookingTabProps) {
  // Get user data from GL10 context
  const { progress, updateProgress } = useGL10Context()

  // Check if user has already provided contact information
  const hasRequiredInfo = !!(
    progress.email &&
    progress.contactDetails.name &&
    progress.contactDetails.phone
  )

  // State management
  const [showForm, setShowForm] = useState(!hasRequiredInfo)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [showFormSuccess, setShowFormSuccess] = useState(false)

  // PostHog hook for event tracking
  const posthog = usePostHog()

  // Constant Contact integration hook
  const { submitToConstantContact } = useConstantContactIntegration({
    targetList: 'SHOWROOM KAWAI',
    createListIfMissing: true,
    showAuthPrompts: false
  })

  // Form setup with react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    setValue,
    watch
  } = useForm<BookingContactFormData>({
    resolver: zodResolver(bookingContactSchema),
    defaultValues: {
      email: progress.email || '',
      firstName: progress.contactDetails.name?.split(' ')[0] || '',
      lastName: progress.contactDetails.name?.split(' ').slice(1).join(' ') || '',
      phone: progress.contactDetails.phone || ''
    }
  })

  const phoneValue = watch('phone')

  // Handle phone number formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setValue('phone', formatted, { shouldValidate: !!touchedFields.phone })
  }

  // Handle form submission
  const onFormSubmit = async (data: BookingContactFormData) => {
    setIsSubmittingForm(true)

    // Brief delay for UX
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Update GL10Context with form data
    updateProgress({
      email: data.email,
      contactDetails: {
        name: `${data.firstName} ${data.lastName}`,
        phone: data.phone,
        preferredContact: 'phone'
      }
    })

    setShowFormSuccess(true)

    // Wait for success animation, then show Calendly
    setTimeout(() => {
      setShowForm(false)
      setIsSubmittingForm(false)
    }, 1200)
  }

  // Submit contact to SHOWROOM KAWAI list (non-blocking)
  const handleConstantContactSubmission = async (eventData: any) => {
    console.log('🎯 Calendly onEventScheduled fired for GL-10 Booking Tab:', +new Date())
    console.log('📋 Calendly event data:', eventData?.data?.payload)

    // Timeout protection
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Constant Contact submission timeout')), 10000)
    )

    try {
      // Get contact data from GL10 context (prefill data)
      const email = progress.email
      if (!email) {
        console.warn('⚠️ No email available in GL10 context for SHOWROOM KAWAI submission (non-blocking)')
        return
      }

      // Parse name from context
      const nameParts = progress.contactDetails.name?.split(' ') || []
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      // Create contact data for SHOWROOM KAWAI list
      const contactData: ConstantContactSubmissionData = {
        email,
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(progress.contactDetails.phone && { phone: progress.contactDetails.phone }),
        optInMarketing: true // Default to opted in for consultation bookings
      }

      console.log('🎉 Booking COMPLETED successfully! Adding to SHOWROOM KAWAI list:', {
        email: contactData.email,
        firstName: contactData.firstName || '[NONE]',
        lastName: contactData.lastName || '[NONE]',
        phone: contactData.phone || '[NONE]'
      })

      // Submit to SHOWROOM KAWAI list (non-blocking with timeout)
      const success = await Promise.race([
        submitToConstantContact(contactData),
        timeoutPromise
      ]) as boolean

      if (success) {
        console.log('📧 Constant Contact SHOWROOM KAWAI submission completed:', +new Date())
        console.log('✅ Contact successfully added to SHOWROOM KAWAI list')
      } else {
        console.warn('⚠️ Failed to add contact to SHOWROOM KAWAI list, but booking still succeeded')
      }
    } catch (error) {
      console.error('❌ Error adding successful booking to SHOWROOM KAWAI list (non-blocking):', error)
      // This is non-blocking - booking completion is not affected
    }
  }

  // Handle successful booking submission
  const handleSuccessfulBooking = async (eventData: any) => {
    console.log('🎯 GL-10 Booking Tab - Consultation scheduled:', eventData)

    // Create contact data for tracking
    const contactData = {
      email: progress.email,
      name: progress.contactDetails.name,
      phone: progress.contactDetails.phone
    }

    console.log('📊 Contact data prepared for tracking:', {
      email: contactData.email ? '[PRESENT]' : '[MISSING]',
      name: contactData.name ? '[PRESENT]' : '[MISSING]',
      phone: contactData.phone ? '[PRESENT]' : '[MISSING]',
      posthogAvailable: !!posthog
    })

    // Verify we have essential data for tracking
    if (!contactData.email) {
      console.error('❌ CRITICAL: No email available for tracking - events may fail', {
        progress,
        contactData
      })
    }

    // Non-blocking tracking sequence: Meta Pixel → PostHog → Constant Contact
    setTimeout(() => {
      console.log('🚀 Starting tracking sequence...')

      // Fire Meta Pixel
      try {
        const metaPixelData = {
          content_name: 'GL-10 Baby Grand Sale Booking',
          content_category: 'Premium Piano Consultation',
          value: 1500,
          currency: 'USD',
          status: 'completed'
        }

        console.log('🎯 Meta Pixel: Firing SubmitApplication event with data:', {
          ...metaPixelData,
          email: progress.email ? '[PRESENT]' : '[MISSING]'
        })

        trackSubmitApplication(metaPixelData)

        console.log('✅ Meta Pixel SubmitApplication fired via utility function:', +new Date())
      } catch (error) {
        console.error('❌ Meta Pixel error (non-blocking):', error)
      }

      // Fire PostHog
      setTimeout(() => {
        try {
          if (posthog) {
            posthog.capture('gl10_booking_tab_scheduled', {
              source: 'gl10-booking-tab',
              email: progress.email,
              name: progress.contactDetails.name,
              calendly_url: HOUSTON_CALENDLY_URL,
              conversionType: 'showroom-consultation',
              timestamp: +new Date()
            })
            console.log('✅ PostHog gl10_booking_tab_scheduled fired successfully:', +new Date())
          } else {
            console.warn('⚠️ PostHog not available - gl10_booking_tab_scheduled event not fired')
          }
        } catch (error) {
          console.error('❌ PostHog error (non-blocking):', error)
        }
      }, 100)

      // Submit to SHOWROOM KAWAI list (fire and forget, largest delay)
      setTimeout(() => {
        handleConstantContactSubmission(eventData).catch(error => {
          console.error('⚠️ SHOWROOM KAWAI list submission failed (non-blocking):', error)
        })
      }, 200)
    }, 50)
  }

  // Set up Calendly event listeners
  useCalendlyEventListener({
    onEventScheduled: handleSuccessfulBooking
  })

  // Handle widget loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Build prefill object from context data
  const buildPrefill = () => {
    const prefill: any = {}

    // Add email if available
    if (progress.email) {
      prefill.email = progress.email
    }

    // Parse name into firstName and lastName
    if (progress.contactDetails.name) {
      const nameParts = progress.contactDetails.name.split(' ')
      if (nameParts.length > 0) {
        prefill.firstName = nameParts[0]
        if (nameParts.length > 1) {
          prefill.lastName = nameParts.slice(1).join(' ')
        }
      }
      prefill.name = progress.contactDetails.name
    }

    // Add phone if available
    if (progress.contactDetails.phone) {
      prefill.phone = progress.contactDetails.phone
    }

    return Object.keys(prefill).length > 0 ? prefill : undefined
  }

  return (
    <section
      className={cn(
        'min-h-screen bg-gradient-to-b from-white to-gray-50 py-16 md:py-24',
        className
      )}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <AnimatePresence mode="wait">
          {/* Show Contact Form if user doesn't have required info */}
          {showForm ? (
            <motion.div
              key="contact-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Header Section */}
              <div className="text-center space-y-4 mb-12">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-normal text-kawai-red leading-tight"
                >
                  Let's get you reserved!
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
                >
                  Please provide your contact information so we can prepare for your visit and send you your exclusive invitation.
                </motion.p>
              </div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="relative max-w-3xl mx-auto"
              >
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border-2 border-kawai-pearl">
                  <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                    {/* Email Field */}
                    <div className="relative">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address <span className="text-kawai-red">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className={cn(
                            'w-5 h-5 transition-colors',
                            errors.email ? 'text-red-500' : 'text-gray-400'
                          )} />
                        </div>
                        <input
                          id="email"
                          type="email"
                          {...register('email')}
                          className={cn(
                            'w-full min-h-[56px] pl-12 pr-4 py-4 text-lg',
                            'bg-white border-2 rounded-xl transition-all duration-200',
                            'text-gray-900 placeholder:text-gray-400',
                            'focus:outline-none focus:ring-2 focus:ring-kawai-red/20',
                            errors.email
                              ? 'border-red-300 focus:border-red-500'
                              : 'border-gray-200 focus:border-kawai-red'
                          )}
                          placeholder="your.email@example.com"
                          disabled={isSubmittingForm}
                        />
                      </div>
                      <AnimatePresence>
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-2 text-sm text-red-600"
                          >
                            {errors.email.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Name Fields Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* First Name */}
                      <div className="relative">
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          First Name <span className="text-kawai-red">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className={cn(
                              'w-5 h-5 transition-colors',
                              errors.firstName ? 'text-red-500' : 'text-gray-400'
                            )} />
                          </div>
                          <input
                            id="firstName"
                            type="text"
                            {...register('firstName')}
                            className={cn(
                              'w-full min-h-[56px] pl-12 pr-4 py-4 text-lg',
                              'bg-white border-2 rounded-xl transition-all duration-200',
                              'text-gray-900 placeholder:text-gray-400',
                              'focus:outline-none focus:ring-2 focus:ring-kawai-red/20',
                              errors.firstName
                                ? 'border-red-300 focus:border-red-500'
                                : 'border-gray-200 focus:border-kawai-red'
                            )}
                            placeholder="John"
                            disabled={isSubmittingForm}
                          />
                        </div>
                        <AnimatePresence>
                          {errors.firstName && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="mt-2 text-sm text-red-600"
                            >
                              {errors.firstName.message}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Last Name */}
                      <div className="relative">
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Last Name <span className="text-kawai-red">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className={cn(
                              'w-5 h-5 transition-colors',
                              errors.lastName ? 'text-red-500' : 'text-gray-400'
                            )} />
                          </div>
                          <input
                            id="lastName"
                            type="text"
                            {...register('lastName')}
                            className={cn(
                              'w-full min-h-[56px] pl-12 pr-4 py-4 text-lg',
                              'bg-white border-2 rounded-xl transition-all duration-200',
                              'text-gray-900 placeholder:text-gray-400',
                              'focus:outline-none focus:ring-2 focus:ring-kawai-red/20',
                              errors.lastName
                                ? 'border-red-300 focus:border-red-500'
                                : 'border-gray-200 focus:border-kawai-red'
                            )}
                            placeholder="Doe"
                            disabled={isSubmittingForm}
                          />
                        </div>
                        <AnimatePresence>
                          {errors.lastName && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="mt-2 text-sm text-red-600"
                            >
                              {errors.lastName.message}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="relative">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Phone Number <span className="text-kawai-red">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Phone className={cn(
                            'w-5 h-5 transition-colors',
                            errors.phone ? 'text-red-500' : 'text-gray-400'
                          )} />
                        </div>
                        <input
                          id="phone"
                          type="tel"
                          {...register('phone')}
                          onChange={handlePhoneChange}
                          className={cn(
                            'w-full min-h-[56px] pl-12 pr-4 py-4 text-lg',
                            'bg-white border-2 rounded-xl transition-all duration-200',
                            'text-gray-900 placeholder:text-gray-400',
                            'focus:outline-none focus:ring-2 focus:ring-kawai-red/20',
                            errors.phone
                              ? 'border-red-300 focus:border-red-500'
                              : 'border-gray-200 focus:border-kawai-red'
                          )}
                          placeholder="(555) 123-4567"
                          disabled={isSubmittingForm}
                        />
                      </div>
                      <AnimatePresence>
                        {errors.phone && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-2 text-sm text-red-600"
                          >
                            {errors.phone.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmittingForm}
                        className={cn(
                          'w-full min-h-[56px] px-8 py-4 text-lg font-semibold',
                          'bg-kawai-red text-white rounded-xl',
                          'transition-all duration-200',
                          'hover:bg-kawai-red/90 hover:shadow-lg hover:-translate-y-0.5',
                          'focus:outline-none focus:ring-4 focus:ring-kawai-red/20',
                          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
                          'relative overflow-hidden'
                        )}
                      >
                        <AnimatePresence mode="wait">
                          {showFormSuccess ? (
                            <motion.span
                              key="success"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="flex items-center justify-center gap-2"
                            >
                              <CheckCircle2 className="w-6 h-6" />
                              Success!
                            </motion.span>
                          ) : (
                            <motion.span
                              key="submit"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              {isSubmittingForm ? 'Processing...' : 'Continue to Book Your Appointment'}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </button>
                    </div>

                    {/* Privacy Note */}
                    <p className="text-center text-sm text-gray-500 pt-2">
                      Your information is secure and will only be used for your booking.
                    </p>
                  </form>
                </div>

                {/* Decorative Border Accent */}
                <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-kawai-red/5 rounded-3xl -z-10" />
                <div className="absolute -top-2 -left-2 w-24 h-24 bg-kawai-red/5 rounded-3xl -z-10" />
              </motion.div>
            </motion.div>
          ) : (
            /* Show Calendly Widget */
            <motion.div
              key="calendly-widget"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Header Section */}
              <div className="text-center space-y-4 mb-12">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-normal text-kawai-red leading-tight"
                >
                  Reserve your spot!
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
                >
                  Reserve your spot for special pricing on your personal baby grand piano. Show your invitation at the door for exclusive offers!
                </motion.p>
              </div>

              {/* Calendly Embed */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="relative w-full"
              >
                {/* Loading State */}
                {isLoading && (
                  <div className="absolute inset-0 bg-white/95 flex items-center justify-center z-10">
                    <div className="text-center space-y-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-10 h-10 border-3 border-kawai-red border-t-transparent rounded-full mx-auto"
                      />
                      <p className="text-gray-600 text-sm font-medium">Loading calendar...</p>
                    </div>
                  </div>
                )}

                {/* Calendly Widget - Direct Embed */}
                <InlineWidget
                  url={HOUSTON_CALENDLY_URL}
                  styles={{
                    height: '700px',
                    minWidth: '320px',
                    width: '100%'
                  }}
                  pageSettings={{
                    backgroundColor: 'ffffff',
                    hideEventTypeDetails: false,
                    hideLandingPageDetails: false,
                    primaryColor: 'C41E3A', // Kawai red
                    textColor: '2C2C2C' // Kawai charcoal
                  }}
                  {...(buildPrefill() && { prefill: buildPrefill() })}
                />
              </motion.div>

              {/* Free Delivery CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-center mt-8"
              >
                <button
                  onClick={() => onViewChange?.('signature')}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-kawai-red rounded-lg hover:bg-kawai-red/90 transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  I want free delivery and tuning!
                </button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-gray-600"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>No-pressure environment</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Expert guidance</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Flexible scheduling</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
