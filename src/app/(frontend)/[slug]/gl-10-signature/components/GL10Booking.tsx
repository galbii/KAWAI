'use client'

import { useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { InlineWidget, useCalendlyEventListener } from 'react-calendly'
import { usePostHog } from 'posthog-js/react'
import { trackSubmitApplication } from '@/components/MetaPixel'
import { cn } from '@/lib/utils'
import useConstantContactIntegration, { type ConstantContactSubmissionData } from '@/hooks/useConstantContactIntegration'
import { useRef } from 'react'

// Interfaces
interface GL10PrefillData {
  email?: string
  firstName?: string
  lastName?: string
  phone?: string
}

interface GL10BookingProps {
  prefillData?: GL10PrefillData
  onBookingComplete?: () => void
  className?: string
}

// Calendly URL for GL-10 Signature bookings
const GL10_CALENDLY_URL = 'https://calendly.com/kawaipianogallery/gl10-signature'

// Benefits data
const BENEFITS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Private consultation with Kawai experts',
    description: 'One-on-one attention from our master craftsmen'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Exclusive access to the GL-10 Signature',
    description: 'Experience this extraordinary instrument firsthand'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    title: 'Personalized recommendations',
    description: 'Tailored advice based on your musical journey'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'No-pressure environment',
    description: 'Explore at your own pace without obligation'
  }
]

export default function GL10Booking({ prefillData, onBookingComplete, className }: GL10BookingProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [scarcityCount] = useState(3) // Could be dynamic from CMS
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  // PostHog hook for event tracking
  const posthog = usePostHog()

  // Constant Contact integration
  const { submitToConstantContact } = useConstantContactIntegration({
    targetList: 'SHOWROOM KAWAI',
    createListIfMissing: true,
    showAuthPrompts: false
  })

  // Handle successful booking submission
  const handleSuccessfulBooking = async (eventData: any) => {
    console.log('🎯 GL-10 Booking completed:', eventData)

    // Call parent callback immediately
    onBookingComplete?.()

    // Non-blocking tracking
    setTimeout(() => {
      // Fire Meta Pixel
      try {
        trackSubmitApplication({
          content_name: 'GL-10 Baby Grand Signature Booking',
          content_category: 'Premium Piano Consultation',
          value: 1500,
          currency: 'USD',
          status: 'completed'
        })
      } catch (error) {
        console.error('Meta Pixel error:', error)
      }

      // Fire PostHog
      setTimeout(() => {
        try {
          if (posthog) {
            posthog.capture('gl10_signature_booking', {
              source: 'gl10-landing-page',
              email: prefillData?.email,
              firstName: prefillData?.firstName,
              lastName: prefillData?.lastName,
              conversionType: 'showroom-consultation',
              timestamp: +new Date()
            })
          }
        } catch (error) {
          console.error('PostHog error:', error)
        }
      }, 100)

      // Submit to Constant Contact
      setTimeout(async () => {
        try {
          if (prefillData?.email) {
            const contactData: ConstantContactSubmissionData = {
              email: prefillData.email,
              ...(prefillData.firstName && { firstName: prefillData.firstName }),
              ...(prefillData.lastName && { lastName: prefillData.lastName }),
              ...(prefillData.phone && { phone: prefillData.phone }),
              optInMarketing: true
            }
            await submitToConstantContact(contactData)
          }
        } catch (error) {
          console.error('Constant Contact error:', error)
        }
      }, 200)
    }, 50)
  }

  // Set up Calendly event listeners
  useCalendlyEventListener({
    onEventScheduled: handleSuccessfulBooking
  })

  // Build prefill object
  const buildPrefill = () => {
    if (!prefillData) return undefined

    const prefill: any = {}
    if (prefillData.email) prefill.email = prefillData.email
    if (prefillData.firstName) prefill.firstName = prefillData.firstName
    if (prefillData.lastName) prefill.lastName = prefillData.lastName
    if (prefillData.phone) prefill.phone = prefillData.phone

    if (prefillData.firstName && prefillData.lastName) {
      prefill.name = `${prefillData.firstName} ${prefillData.lastName}`
    }

    return Object.keys(prefill).length > 0 ? prefill : undefined
  }

  // Handle widget loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    }
  }

  return (
    <section
      ref={containerRef}
      className={cn('bg-white py-16 md:py-24 overflow-hidden', className)}
    >
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* Left Column - Invitation Messaging */}
          <motion.div variants={itemVariants} className="space-y-8">
            {/* Headline */}
            <div className="space-y-4">
              <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 leading-tight"
              >
                You're Invited to Experience the{' '}
                <span className="text-kawai-red font-normal">GL-10 Baby Grand</span>
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-lg text-gray-600 leading-relaxed"
              >
                Schedule your private consultation and discover why this extraordinary instrument
                represents the pinnacle of piano craftsmanship.
              </motion.p>
            </div>

            {/* Benefits List */}
            <motion.div variants={itemVariants} className="space-y-6">
              {BENEFITS.map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex gap-4 group"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center text-amber-700 group-hover:from-amber-100 group-hover:to-orange-100 transition-colors duration-300">
                    {benefit.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Scarcity Indicator */}
            {scarcityCount > 0 && (
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-full"
              >
                <div className="w-2 h-2 bg-kawai-red rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-900">
                  Only {scarcityCount} appointments available this week
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - Calendly Widget */}
          <motion.div
            variants={itemVariants}
            className="relative"
          >
            {/* Loading State */}
            {isLoading && (
              <div className="absolute inset-0 bg-gray-50 rounded-2xl flex items-center justify-center z-10">
                <div className="text-center space-y-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-8 h-8 border-2 border-kawai-red border-t-transparent rounded-full mx-auto"
                  />
                  <p className="text-gray-600 text-sm">Loading calendar...</p>
                </div>
              </div>
            )}

            {/* Calendly Widget */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <InlineWidget
                url={GL10_CALENDLY_URL}
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
                  textColor: '000000'
                }}
                {...(buildPrefill() && { prefill: buildPrefill() })}
              />
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full blur-2xl opacity-50 -z-10" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-red-100 to-orange-100 rounded-full blur-2xl opacity-50 -z-10" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
