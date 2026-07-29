'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import type { 
  AlternativeOffer,
  TrustSignal,
  ConversionAction
} from './types'

// Exit intent capture schema
const exitIntentSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  interests: z.array(z.string()).optional(),
  reason: z.string().optional()
})

type ExitIntentData = z.infer<typeof exitIntentSchema>

interface ExitIntentModalProps {
  isOpen: boolean
  onClose: () => void
  onCapture: (email: string, interests?: string[]) => void
  headline?: string
  description?: string
  incentive?: {
    title: string
    description: string
    value?: string
  }
  alternativeOffers?: AlternativeOffer[]
  trustSignals?: TrustSignal[]
  urgencyMessage?: string
  showAlternatives?: boolean
  className?: string
}

// Hook for detecting exit intent
export const useExitIntent = (enabled = true) => {
  const [showModal, setShowModal] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)

  useEffect(() => {
    if (!enabled || hasTriggered) return undefined

    let mouseLeaveTimer: NodeJS.Timeout
    let isMouseNearTop = false

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger on top edge exit
      if (e.clientY <= 0 && !isMouseNearTop) {
        mouseLeaveTimer = setTimeout(() => {
          setShowModal(true)
          setHasTriggered(true)
        }, 100)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      isMouseNearTop = e.clientY <= 50

      // Clear timer if mouse comes back quickly
      if (mouseLeaveTimer && e.clientY > 0) {
        clearTimeout(mouseLeaveTimer)
      }
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasTriggered) {
        // Modern browsers mostly ignore custom messages
        e.preventDefault()
        e.returnValue = ''
        setShowModal(true)
        setHasTriggered(true)
      }
    }

    // Mobile detection - use touch events
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    if (isMobile) {
      // For mobile, trigger on scroll back to top after scrolling down
      let hasScrolledDown = false

      const handleScroll = () => {
        if (window.scrollY > 200) {
          hasScrolledDown = true
        } else if (hasScrolledDown && window.scrollY === 0) {
          setShowModal(true)
          setHasTriggered(true)
        }
      }

      window.addEventListener('scroll', handleScroll, { passive: true })

      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    } else {
      // Desktop: mouse leave detection
      document.addEventListener('mouseleave', handleMouseLeave)
      document.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('beforeunload', handleBeforeUnload)

      return () => {
        document.removeEventListener('mouseleave', handleMouseLeave)
        document.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('beforeunload', handleBeforeUnload)
        if (mouseLeaveTimer) clearTimeout(mouseLeaveTimer)
      }
    }
  }, [enabled, hasTriggered])

  return { showModal, setShowModal }
}

/**
 * Exit Intent Modal Component
 * Captures departing users with compelling retention offers
 */
export const ExitIntentModal: React.FC<ExitIntentModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  headline = "Wait! Don't Miss Your Perfect Piano Match",
  description = "You're so close to discovering your ideal piano. Let us send your personalized recommendations before you go.",
  incentive = {
    title: "Exclusive Guide Included",
    description: "Get our complete Piano Buyer's Guide (valued at $47) FREE with your recommendations",
    value: "$47 Value"
  },
  alternativeOffers = [
    {
      title: "Quick Phone Consultation",
      description: "5-minute call with a piano specialist",
      action: 'video-call',
      value: "Free"
    },
    {
      title: "Virtual Piano Tour",
      description: "See your recommended pianos in action",
      action: 'virtual-tour',
      value: "15 min"
    }
  ],
  trustSignals = [
    {
      icon: "shield-check",
      text: "No spam, ever"
    },
    {
      icon: "clock",
      text: "Instant delivery"
    },
    {
      icon: "star",
      text: "Expert recommendations"
    }
  ],
  urgencyMessage = "This offer expires when you leave this page",
  showAlternatives = true,
  className
}) => {
  const [step, setStep] = useState<'offer' | 'alternatives' | 'success'>('offer')
  const [selectedOffer, setSelectedOffer] = useState<AlternativeOffer | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors }, watch } = useForm<ExitIntentData>({
    resolver: zodResolver(exitIntentSchema),
    defaultValues: {
      interests: []
    }
  })

  const watchedEmail = watch('email')

  const handleEmailSubmit = useCallback(async (data: ExitIntentData) => {
    setIsSubmitting(true)
    try {
      await onCapture(data.email, data.interests)
      setStep('success')
    } catch (error) {
      console.error('Exit intent capture failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [onCapture])

  const handleOfferSelect = useCallback((offer: AlternativeOffer) => {
    setSelectedOffer(offer)
    setStep('alternatives')
  }, [])

  const handleAlternativeSubmit = useCallback(async () => {
    if (!selectedOffer || !watchedEmail) return
    
    setIsSubmitting(true)
    try {
      await onCapture(watchedEmail, [selectedOffer.title])
      setStep('success')
    } catch (error) {
      console.error('Alternative offer submission failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [selectedOffer, watchedEmail, onCapture])

  // A11y: dialog focus trap, initial focus, Escape-to-close, focus restore
  const dialogRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    if (!isOpen) return
    previouslyFocused.current = document.activeElement as HTMLElement | null
    dialogRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeRef.current()
        return
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (!first || !last) return
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocused.current?.focus?.()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Special offer"
          tabIndex={-1}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className={cn(
            "bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto focus:outline-none",
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors z-10"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <AnimatePresence mode="wait">
            {step === 'offer' && (
              <OfferStep
                key="offer"
                headline={headline}
                description={description}
                incentive={incentive}
                alternativeOffers={alternativeOffers}
                trustSignals={trustSignals}
                urgencyMessage={urgencyMessage}
                showAlternatives={showAlternatives}
                register={register}
                handleSubmit={handleSubmit}
                errors={errors}
                onSubmit={handleEmailSubmit}
                onOfferSelect={handleOfferSelect}
                isSubmitting={isSubmitting}
              />
            )}

            {step === 'alternatives' && selectedOffer && (
              <AlternativeStep
                key="alternatives"
                offer={selectedOffer}
                onSubmit={handleAlternativeSubmit}
                onBack={() => setStep('offer')}
                isSubmitting={isSubmitting}
              />
            )}

            {step === 'success' && (
              <SuccessStep
                key="success"
                onClose={onClose}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * Main Offer Step
 */
const OfferStep: React.FC<{
  headline: string
  description: string
  incentive: { title: string; description: string; value?: string }
  alternativeOffers: AlternativeOffer[]
  trustSignals: TrustSignal[]
  urgencyMessage: string
  showAlternatives: boolean
  register: any
  handleSubmit: any
  errors: any
  onSubmit: (data: ExitIntentData) => void
  onOfferSelect: (offer: AlternativeOffer) => void
  isSubmitting: boolean
}> = ({
  headline,
  description,
  incentive,
  alternativeOffers,
  trustSignals,
  urgencyMessage,
  showAlternatives,
  register,
  handleSubmit,
  errors,
  onSubmit,
  onOfferSelect,
  isSubmitting
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-8"
    >
      {/* Header with urgency */}
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {urgencyMessage}
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          {headline}
        </h2>
        
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          {description}
        </p>
      </div>

      {/* Incentive Banner */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6 mb-8">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-green-800">{incentive.title}</h3>
              {incentive.value && (
                <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold mt-1">
                  {incentive.value}
                </span>
              )}
            </div>
          </div>
          
          <p className="text-green-700 font-medium">{incentive.description}</p>
        </div>
      </div>

      {/* Email Capture Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter your email to get your recommendations + FREE guide:
          </label>
          <input
            {...register('email')}
            type="email"
            className={cn(
              "w-full px-4 py-4 border-2 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
              errors.email ? "border-red-300" : "border-gray-300"
            )}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Interest Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What interests you most? (Optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              'Grand Pianos',
              'Digital Pianos', 
              'Upright Pianos',
              'Hybrid Technology',
              'Silent Systems',
              'Financing Options'
            ].map((interest) => (
              <label key={interest} className="flex items-center">
                <input
                  {...register('interests')}
                  type="checkbox"
                  value={interest}
                  className="sr-only"
                />
                <div className="px-3 py-2 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-full text-sm cursor-pointer transition-colors peer-checked:bg-blue-600 peer-checked:text-white">
                  {interest}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "w-full py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
            isSubmitting && "opacity-50 cursor-not-allowed transform-none"
          )}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Sending Your Guide...</span>
            </div>
          ) : (
            "Get My FREE Piano Guide + Recommendations"
          )}
        </button>
      </form>

      {/* Trust Signals */}
      <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-gray-500">
        {trustSignals.map((signal, index) => (
          <div key={index} className="flex items-center space-x-1">
            <TrustIcon icon={signal.icon} />
            <span>{signal.text}</span>
          </div>
        ))}
      </div>

      {/* Alternative Offers */}
      {showAlternatives && alternativeOffers.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-600 text-sm mb-4">
            Not ready for email? Choose an alternative:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {alternativeOffers.map((offer, index) => (
              <button
                key={index}
                onClick={() => onOfferSelect(offer)}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{offer.title}</h4>
                    <p className="text-sm text-gray-600">{offer.description}</p>
                  </div>
                  {offer.value && (
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      {offer.value}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center mt-6 text-xs text-gray-500">
        <p>100% secure. We respect your privacy and never share your information.</p>
      </div>
    </motion.div>
  )
}

/**
 * Alternative Offer Step
 */
const AlternativeStep: React.FC<{
  offer: AlternativeOffer
  onSubmit: () => void
  onBack: () => void
  isSubmitting: boolean
}> = ({ offer, onSubmit, onBack, isSubmitting }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-8 text-center"
    >
      <div className="space-y-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {offer.title}
          </h3>
          <p className="text-gray-600">
            {offer.description}
          </p>
          {offer.value && (
            <div className="mt-2">
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {offer.value}
              </span>
            </div>
          )}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <span className="font-medium">Limited Time:</span> This offer is only available during your visit today.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onBack}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
          >
            Back to Offers
          </button>
          
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className={cn(
              "flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all",
              isSubmitting && "opacity-50 cursor-not-allowed"
            )}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              `Yes, I Want ${offer.title}`
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Success Step
 */
const SuccessStep: React.FC<{
  onClose: () => void
}> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-8 text-center"
    >
      <div className="space-y-6">
        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Perfect! Your Guide is on its Way
          </h3>
          <p className="text-gray-600">
            Check your inbox in the next few minutes for your personalized piano recommendations 
            and FREE buyer's guide.
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 text-sm">
          <div className="flex items-center justify-center space-x-2 text-blue-800 mb-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">What's Next?</span>
          </div>
          <ul className="text-blue-700 space-y-1 text-left">
            <li>• Review your personalized piano matches</li>
            <li>• Download your FREE Piano Buyer's Guide</li>
            <li>• Schedule a private viewing if interested</li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-all"
        >
          Continue Browsing
        </button>

        <p className="text-xs text-gray-500">
          Don't see our email? Check your spam folder and add us to your contacts.
        </p>
      </div>
    </motion.div>
  )
}

/**
 * Trust Icon Component
 */
const TrustIcon: React.FC<{ icon: string }> = ({ icon }) => {
  const icons = {
    'shield-check': (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    'clock': (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'star': (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    )
  }
  
  return icons[icon as keyof typeof icons] || icons['star']
}

export default ExitIntentModal