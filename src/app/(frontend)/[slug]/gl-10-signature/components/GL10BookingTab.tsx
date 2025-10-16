'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { InlineWidget, useCalendlyEventListener } from 'react-calendly'
import { usePostHog } from 'posthog-js/react'
import { trackSubmitApplication } from '@/components/MetaPixel'
import { cn } from '@/lib/utils'

// Calendly URL for Houston Baby Grand Sale
const HOUSTON_CALENDLY_URL = 'https://calendly.com/kawaipianogallery/houston-baby-grand-sale-clone'

interface GL10BookingTabProps {
  className?: string
}

export default function GL10BookingTab({ className }: GL10BookingTabProps) {
  const [isLoading, setIsLoading] = useState(true)

  // PostHog hook for event tracking
  const posthog = usePostHog()

  // Handle successful booking submission
  const handleSuccessfulBooking = async (eventData: any) => {
    console.log('🎯 GL-10 Booking Tab - Consultation scheduled:', eventData)

    // Non-blocking tracking
    setTimeout(() => {
      // Fire Meta Pixel
      try {
        trackSubmitApplication({
          content_name: 'GL-10 Baby Grand Sale Booking',
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
            posthog.capture('gl10_booking_tab_scheduled', {
              source: 'gl10-booking-tab',
              calendly_url: HOUSTON_CALENDLY_URL,
              conversionType: 'showroom-consultation',
              timestamp: +new Date()
            })
          }
        } catch (error) {
          console.error('PostHog error:', error)
        }
      }, 100)
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

  return (
    <section
      className={cn(
        'min-h-screen bg-gradient-to-b from-white to-gray-50 py-16 md:py-24',
        className
      )}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Header Section */}
          <div className="text-center space-y-4 mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 leading-tight"
            >
              Special offers when you reserve your spot to the{' '}
              <span className="text-kawai-red font-normal">Kawai Signature Showroom Sale Event</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              Bring your invitation to the event to secure free delivery and tuning services along with exclusive financing offers.
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
            />
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
      </div>
    </section>
  )
}
