'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { usePostHog } from 'posthog-js/react'
import { CalendlyBookingWidget } from '@/components/pages/signature/CalendlyBookingWidget'

interface BookingPageProps {
  params: { slug: string }
}

export default function BookingPage({ params }: BookingPageProps) {
  const [mounted, setMounted] = useState(false)
  const [animationStage, setAnimationStage] = useState(0)
  const posthog = usePostHog()
  const { slug } = params

  // Fire email_tracked event when page loads
  useEffect(() => {
    if (posthog) {
      posthog.capture('email_tracked', {
        page: 'booking',
        signature_page: slug,
        entry_point: 'direct_page_access',
        url_path: `/${slug}/signature/booking`,
        timestamp: new Date().toISOString()
      })
      console.log('📧 PostHog email_tracked event fired on booking page load for:', slug)
    }
  }, [posthog, slug])

  // Signature experience animation sequence: Baby Grand → Booking → October 9th-11th → Description → CTAs → Booking Form
  useEffect(() => {
    setMounted(true)
    const timers = [
      setTimeout(() => setAnimationStage(1), 300),   // Baby Grand appears
      setTimeout(() => setAnimationStage(2), 800),   // Signature appears
      setTimeout(() => setAnimationStage(3), 1300),  // October 9th-11th appears
      setTimeout(() => setAnimationStage(4), 1800),  // Description appears
      setTimeout(() => setAnimationStage(5), 2300),  // Show CTAs
      setTimeout(() => setAnimationStage(6), 3000),  // Show booking form
    ]

    return () => timers.forEach(timer => clearTimeout(timer))
  }, [])

  // Handle when booking is completed
  const handleEventScheduled = (eventData: any) => {
    if (posthog) {
      posthog.capture('event_booked', {
        page: 'booking',
        signature_page: slug,
        booking_source: 'signature_booking_page',
        calendly_event_uri: eventData?.data?.payload?.event?.uri,
        calendly_invitee_uri: eventData?.data?.payload?.invitee?.uri,
        url_path: `/${slug}/signature/booking`,
        timestamp: new Date().toISOString()
      })
      console.log('🎯 PostHog event_booked event fired from booking page for:', slug)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-kawai-black flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-kawai-black/50 to-kawai-black/80"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-kawai-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-kawai-black via-gray-900 to-kawai-black"></div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-4">
        {/* Signature Experience Animation Sequence */}
        <div className="relative text-center min-h-[100px] md:min-h-[120px] lg:min-h-[150px] flex items-center justify-center w-full max-w-4xl mx-auto">

          {/* Stage 1: Baby Grand - Fades in from below */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, y: 80 }}
            animate={{
              opacity: animationStage >= 1 && animationStage < 6 ? 1 : 0,
              y: animationStage >= 1 && animationStage < 6 ? 0 : 80
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative text-center">
              {/* Baby Grand - Smaller, lighter styling */}
              <motion.span
                className="block font-light tracking-wide text-center mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: animationStage >= 1 ? 1 : 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{
                  fontSize: 'clamp(1.2rem, 5vw, 2rem)',
                  color: 'white',
                  fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
                  textShadow: '0 2px 40px rgba(0,0,0,0.4)',
                  fontWeight: '300'
                }}
              >
                Baby Grand
              </motion.span>

              {/* Signature - The emphasized word */}
              <motion.span
                className="block leading-[0.8] font-black tracking-tight text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: animationStage >= 2 ? 1 : 0,
                  y: animationStage >= 2 ? 0 : 30
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                  fontSize: 'clamp(2.5rem, 10vw, 5.5rem)',
                  color: '#d5c78c',
                  fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
                  textShadow: '0 6px 80px rgba(0,0,0,0.7), 0 4px 40px rgba(213,199,140,0.3)',
                  fontWeight: '900'
                }}
              >
                Signature
              </motion.span>

              {/* October 9th-11th - Final part of sequence */}
              <motion.span
                className="block font-light tracking-[0.2em] text-center mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: animationStage >= 3 ? 1 : 0,
                  y: animationStage >= 3 ? 0 : 20
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                  fontSize: 'clamp(1rem, 3.5vw, 1.5rem)',
                  color: 'white',
                  fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
                  textShadow: '0 2px 30px rgba(0,0,0,0.6)',
                  fontWeight: '300'
                }}
              >
                October 9th – 11th
              </motion.span>

              {/* Description - Very small text under date */}
              <motion.p
                className="font-light leading-relaxed text-center mt-4 max-w-xl mx-auto px-4"
                initial={{ opacity: 0, y: 15 }}
                animate={{
                  opacity: animationStage >= 4 ? 1 : 0,
                  y: animationStage >= 4 ? 0 : 15
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{
                  fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
                  textShadow: '0 2px 30px rgba(0,0,0,0.5)',
                  fontWeight: '300',
                  lineHeight: '1.4'
                }}
              >
                Reserve your invitation to this limited-time signature collection showcase.
              </motion.p>

              {/* Stage 5: CTA Message */}
              <motion.div
                className="mt-2"
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: animationStage >= 5 ? 1 : 0,
                  y: animationStage >= 5 ? 0 : 30
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <p className="text-kawai-gold text-sm md:text-base font-light tracking-wide">
                  Reserve Your Invitation
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Booking Form Stage - Full Screen */}
        <motion.div
          className="fixed inset-0 z-20 bg-kawai-black"
          initial={{ opacity: 0 }}
          animate={{
            opacity: animationStage >= 6 ? 1 : 0
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {animationStage >= 6 && (
            <div className="h-full flex flex-col">
              {/* Compact Header */}
              <div className="bg-gradient-to-r from-kawai-black to-gray-900 px-4 py-2 md:py-3 border-b border-kawai-gold/20 flex-shrink-0">
                <div className="text-center">
                  <h1 className="text-base md:text-xl font-light text-kawai-pearl mb-0.5 md:mb-1">
                    Reserve Your <span className="text-kawai-gold font-serif">Invitation</span>
                  </h1>
                  <p className="text-kawai-pearl/70 text-xs md:text-sm">
                    Schedule your exclusive signature collection viewing
                  </p>
                </div>
              </div>

              {/* Full-Screen Calendly Widget */}
              <div className="flex-1 bg-white">
                <CalendlyBookingWidget
                  isOpen={true}
                  onClose={() => {}} // Not needed for inline display
                  displayMode="inline"
                  signaturePageSlug={slug}
                  calendlyUrl="https://calendly.com/kawaipianogallery/houston-baby-grand-sale"
                  onEventScheduled={handleEventScheduled}
                  className="h-full w-full"
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}