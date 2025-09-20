'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import { cn } from '@/lib/utils'
import { CalendlyBookingWidget } from './CalendlyBookingWidget'

// Interfaces
interface ConversionCTAProps {
  className?: string
  onAssessmentClick?: () => void
  onConsultationClick?: () => void
  signaturePageSlug?: string
  customData?: {
    title?: string
    subtitle?: string
    urgencyText?: string
    benefits?: string[]
  }
}

interface PremiumButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'md' | 'lg'
  className?: string
  onClick?: () => void
  icon?: React.ReactNode
}

// Premium button component optimized for conversion
function PremiumButton({
  children,
  variant = 'primary',
  size = 'lg',
  className = '',
  onClick,
  icon
}: PremiumButtonProps) {
  const baseStyles = "relative font-medium tracking-wide transition-all duration-500 overflow-hidden group focus:outline-none focus:ring-2 focus:ring-kawai-gold/30 border disabled:opacity-50 disabled:cursor-not-allowed"

  const variants = {
    primary: "bg-gradient-to-r from-kawai-gold to-kawai-gold/90 text-kawai-black border-kawai-gold hover:from-kawai-gold/90 hover:to-kawai-gold shadow-lg hover:shadow-xl hover:scale-105",
    secondary: "bg-transparent text-kawai-gold border-kawai-gold/50 hover:bg-kawai-gold/10 hover:border-kawai-gold backdrop-blur-sm hover:scale-105"
  }

  const sizes = {
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  }

  return (
    <motion.button
      onClick={onClick}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {/* Premium shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000"></div>
      <span className="relative z-10 flex items-center justify-center gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        {children}
      </span>
    </motion.button>
  )
}

// Urgency badge component
function UrgencyBadge({ text, className = '' }: { text: string, className?: string }) {
  return (
    <motion.div
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full border border-kawai-gold/30 bg-kawai-gold/5 backdrop-blur-sm",
        className
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Pulsing indicator */}
      <motion.div
        className="w-2 h-2 bg-kawai-gold rounded-full"
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className="text-kawai-gold text-xs font-light tracking-wider uppercase">
        {text}
      </span>
    </motion.div>
  )
}

// Benefits reveal component
function BenefitsReveal({ benefits }: { benefits: string[] }) {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true }}
    >
      <h3 className="text-kawai-gold text-2xl md:text-3xl font-light mb-6 tracking-wide">
        October 9th through the 11th
      </h3>
      <h4 className="text-kawai-pearl text-lg font-medium mb-4">
        A special event for our Qualified Musicians:
      </h4>
      <div className="space-y-3">
        {benefits.map((benefit, index) => {
          const isDeliveryBenefit = benefit.includes("Present your invitation for white glove")
          return (
            <motion.div
              key={index}
              className={`flex items-start gap-3 ${isDeliveryBenefit ? 'mt-4 p-4 rounded-xl bg-gradient-to-r from-kawai-gold/10 via-kawai-gold/5 to-transparent border border-kawai-gold/20' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={`flex-shrink-0 rounded-full flex items-center justify-center mt-0.5 ${isDeliveryBenefit ? 'w-6 h-6 bg-kawai-gold/30' : 'w-5 h-5 bg-kawai-gold/20'}`}>
                <svg className={`text-kawai-gold fill-current ${isDeliveryBenefit ? 'w-4 h-4' : 'w-3 h-3'}`} viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className={`leading-relaxed ${isDeliveryBenefit ? 'text-kawai-gold font-medium text-base' : 'text-kawai-pearl/80 text-sm'}`}>
                {benefit}
              </span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

// Continue indicator component
function ContinueIndicator({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer group"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
    >
      <div className="flex flex-col items-center space-y-2 text-kawai-gold/70 hover:text-kawai-gold transition-colors duration-300">
        <span className="text-xs font-light tracking-widest">CONTINUE</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }}
          className="w-6 h-6 border border-kawai-gold/50 rounded-full flex items-center justify-center group-hover:border-kawai-gold transition-colors duration-300"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Main ConversionCTA component
export function ConversionCTA({
  className = '',
  onAssessmentClick,
  onConsultationClick,
  signaturePageSlug,
  customData
}: ConversionCTAProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showInlineBooking, setShowInlineBooking] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100])

  // Default data
  const defaultData = {
    title: "Transform your space into a grand concert hall",
    subtitle: "Where each instrument carries a century of musical history, artistic cultivation, and devoted craftsmanship",
    urgencyText: "Only 12 Assessment Spots Remaining This Quarter",
    benefits: [
      "Apply for the signature circle and join thousands of passionate musicians",
      "Exclusive consultation and personal showroom tour with master technicians",
      "Very Limited and special offers on your own piece of Kawai's hundred year legacy",
      "Present your invitation for white glove delivery and professional tuning, on us"
    ]
  }

  const data = { ...defaultData, ...customData }

  // Handle assessment click
  const handleAssessmentClick = () => {
    if (onAssessmentClick) {
      onAssessmentClick()
    } else {
      // Find and scroll to assessment section
      const assessmentSection = document.getElementById('signature-experience') ||
                               document.querySelector('[data-section="assessment"]') ||
                               document.querySelector('.assessment-section')

      if (assessmentSection) {
        assessmentSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  // Handle consultation click
  const handleConsultationClick = () => {
    if (onConsultationClick) {
      onConsultationClick()
    } else {
      // Show inline booking widget
      setShowInlineBooking(true)
    }
  }

  // Handle return to CTA
  const handleBackToCTA = () => {
    setShowInlineBooking(false)
  }

  // Handle successful Calendly booking
  const handleCalendlyEventScheduled = (eventData: any) => {
    console.log('🎉 Calendly consultation booked successfully:', eventData)
    // You can add additional success handling here:
    // - Analytics tracking
    // - Success notifications
    // - Internal CRM updates
    // - Follow-up automation
  }

  // Handle Calendly date/time selection for tracking
  const handleCalendlyDateTimeSelected = (eventData: any) => {
    console.log('📅 User selected consultation date/time:', eventData)
    // Track user engagement with date selection
  }

  // Handle Calendly profile page view for tracking
  const handleCalendlyProfilePageViewed = (eventData: any) => {
    console.log('👁️ User viewed consultation booking page:', eventData)
    // Track initial booking page engagement
  }

  const backgroundImageProps = getImagePropsWithFallback(
    null,
    '/images/signature/conversion-bg.webp',
    'hero',
    {
      fill: true,
      className: 'object-cover object-center'
    }
  )

  return (
    <section
      ref={containerRef}
      className={cn(
        "relative py-20 md:py-32 overflow-hidden",
        className
      )}
    >
      {/* Background with parallax */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-kawai-black via-gray-900 to-kawai-black"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 opacity-30">
          <Image
            {...backgroundImageProps}
            alt="Signature Selection piano background"
          />
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-kawai-black/70 via-kawai-black/80 to-kawai-black/90" />
      </motion.div>

      {/* Geometric light overlays */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-kawai-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-kawai-gold/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-kawai-gold/3 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">

          {/* Conditional Content Based on State */}
          <AnimatePresence mode="wait">
            {!showInlineBooking ? (
              /* Original CTA Content */
              <motion.div
                key="cta-content"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Urgency Badge */}
                <motion.div
                  className="text-center mb-8"
                  style={{ y }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <UrgencyBadge text="Limited Signature Selection" />
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left Column - Main Message */}
            <motion.div
              className="space-y-8"
              style={{ y }}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-kawai-pearl leading-tight">
                  {data.title.split(' ').map((word, index) => (
                    <span key={index} className={word === 'Concert' || word === 'Hall' ? 'text-kawai-gold font-normal' : ''}>
                      {word}{' '}
                    </span>
                  ))}
                </h2>

                <h3 className="text-xl md:text-2xl text-kawai-pearl/80 font-light leading-relaxed">
                  {data.subtitle}
                </h3>

                <p className="text-lg text-kawai-pearl/70 font-light leading-relaxed">
                  We're offering a warm welcome to musicians, educators, and other passionate individuals to check out the Signature Collection,
                  Kawai's personally selected line of baby grand pianos such as the GL-10 and GL-20 at a special rate for our community.
                </p>
              </div>

              {/* Social Proof */}
              <motion.div
                className="p-6 rounded-lg border border-kawai-gold/20 bg-kawai-black/30 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="text-kawai-gold text-sm font-light tracking-wider uppercase mb-3">
                  Artist Testimonial
                </div>
                <blockquote className="text-kawai-pearl/80 font-light italic leading-relaxed">
                  "If you are looking for a truly elite, innovative and without question world-class concert quality instrument the Shigeru Kawai is in my opinion the only option. In playing a Shigeru Kawai, I have a euphoric oneness with the instrument. It is so responsive that it feels like a continuation of my very self."
                </blockquote>
                <footer className="text-kawai-pearl/60 text-sm mt-3">
                  — Dave Bradshaw Jr., Professional Pianist
                </footer>
              </motion.div>

              {/* CTAs */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <PremiumButton
                  variant="primary"
                  size="lg"
                  onClick={handleAssessmentClick}
                  className="w-full sm:w-auto min-w-[280px]"
                >
                  Reserve Your Spot
                </PremiumButton>

                <div className="text-kawai-pearl/50 text-sm text-center sm:text-left">
                  {data.urgencyText}
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Benefits */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="p-8 rounded-lg border border-kawai-gold/20 bg-gradient-to-br from-kawai-black/50 to-transparent backdrop-blur-sm">
                <BenefitsReveal benefits={data.benefits} />
              </div>

              {/* Event Details */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="text-center mb-4">
                  <h4 className="text-kawai-gold text-lg font-light mb-2">Get event details when you reserve your spot</h4>
                </div>
                <div className="rounded-lg border border-kawai-gold/20 bg-kawai-black/30 overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27720!2d-95.4896!3d29.7281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640c70b7c8c8c8b%3A0x1234567890abcdef!2sGalleria%20Area%2C%20Houston%2C%20TX!5e0!3m2!1sen!2sus!4v1695000000000!5m2!1sen!2sus"
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full"
                  />
                </div>
              </motion.div>
            </motion.div>
                </div>
              </motion.div>
            ) : (
              /* Inline Booking Content */
              <motion.div
                key="booking-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Booking Header with Back Button */}
                <div className="text-center space-y-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="space-y-4"
                  >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-kawai-pearl leading-tight">
                      Claim Your <span className="text-kawai-red font-normal">Invite</span>
                    </h2>
                    <p className="text-lg text-kawai-pearl/80 font-light leading-relaxed max-w-3xl mx-auto">
                      Schedule your exclusive piano viewing and consultation with our master technicians.
                      Experience the signature collection in our private showroom.
                    </p>
                  </motion.div>

                  {/* Back Button */}
                  <motion.button
                    onClick={handleBackToCTA}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="inline-flex items-center gap-2 text-kawai-gold/70 hover:text-kawai-gold transition-colors duration-300 group"
                  >
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm font-light tracking-wider">Return to Signature Selection</span>
                  </motion.button>
                </div>

                {/* Inline Calendly Widget */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-gradient-to-br from-kawai-black/50 to-transparent backdrop-blur-sm rounded-2xl border border-kawai-gold/20 overflow-hidden"
                >
                  <CalendlyBookingWidget
                    isOpen={true}
                    onClose={handleBackToCTA}
                    signaturePageSlug={signaturePageSlug}
                    calendlyUrl="https://calendly.com/kawaipianogallery/houston-baby-grand-sale"
                    displayMode="inline"
                    className="p-6"
                    onEventScheduled={handleCalendlyEventScheduled}
                    onDateTimeSelected={handleCalendlyDateTimeSelected}
                    onProfilePageViewed={handleCalendlyProfilePageViewed}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-kawai-gold/20 to-transparent" />
    </section>
  )
}