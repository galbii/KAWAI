'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { InlineWidget, useCalendlyEventListener } from 'react-calendly'
import { cn } from '@/lib/utils'
import useConstantContactIntegration, { type ConstantContactSubmissionData } from '@/hooks/useConstantContactIntegration'

// Interfaces
interface CalendlyBookingWidgetProps {
  isOpen: boolean
  onClose: () => void
  signaturePageSlug?: string
  calendlyUrl?: string
  displayMode?: 'modal' | 'inline'
  className?: string
  prefillEmail?: string
  onEventScheduled?: (eventData: any) => void
  onDateTimeSelected?: (eventData: any) => void
  onProfilePageViewed?: (eventData: any) => void
}

interface CalendlyEventData {
  event: string
  payload?: any
}

// Default Calendly URL for Houston Baby Grand Sale
const DEFAULT_CALENDLY_URL = 'https://calendly.com/kawaipianogallery/houston-baby-grand-sale'

// Component for the actual Calendly widget with event tracking
function CalendlyWidgetContent({
  calendlyUrl,
  signaturePageSlug,
  prefillEmail,
  onEventScheduled,
  onDateTimeSelected,
  onProfilePageViewed,
  className = ''
}: {
  calendlyUrl: string
  signaturePageSlug?: string
  prefillEmail?: string
  onEventScheduled?: (eventData: any) => void
  onDateTimeSelected?: (eventData: any) => void
  onProfilePageViewed?: (eventData: any) => void
  className?: string
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Constant Contact integration for booking events
  const {
    submitToConstantContact,
    isSubmitting: isSubmittingToCC,
    submitSuccess,
    submitError
  } = useConstantContactIntegration({
    targetList: 'SHOWROOM KAWAI',
    createListIfMissing: true,
    showAuthPrompts: false
  })

  // Build UTM parameters for tracking
  const buildUtmParams = () => {
    const baseParams = {
      utmSource: 'signature-page',
      utmMedium: 'inline-widget',
      utmCampaign: signaturePageSlug || 'signature-collection',
      utmContent: 'premium-consultation'
    }
    return baseParams
  }

  // Handle successful widget load
  const handleWidgetLoad = () => {
    console.log('✅ Calendly widget loaded successfully')
    setIsLoading(false)
    setLoadError(null)
  }

  // Handle widget load error
  const handleWidgetError = (error: any) => {
    console.error('❌ Calendly widget failed to load:', error)
    setIsLoading(false)
    setLoadError('Failed to load booking calendar. Please try refreshing the page.')
  }

  // Submit contact to Constant Contact when booking is successful
  const handleConstantContactSubmission = async (eventData: any) => {
    try {
      // Validate we have an email to submit
      if (!prefillEmail) {
        console.warn('⚠️ No email available for Constant Contact submission from Calendly booking')
        return
      }

      // Create contact data with available information
      const contactData: ConstantContactSubmissionData = {
        email: prefillEmail,
        optInMarketing: true // Default to opted in for consultation bookings
      }

      // Add signature page context and event details
      const additionalData = {
        source: 'calendly-booking',
        signaturePageSlug,
        calendlyEventUri: eventData?.data?.payload?.event?.uri,
        calendlyInviteeUri: eventData?.data?.payload?.invitee?.uri,
        bookingDateTime: new Date().toISOString(),
        conversionType: 'showroom-consultation'
      }

      console.log('📧 Submitting Calendly booking contact to Constant Contact:', contactData)
      console.log('📋 Additional booking context:', additionalData)

      // Submit to Constant Contact
      const success = await submitToConstantContact(contactData)

      if (success) {
        console.log('✅ Contact successfully added to Constant Contact from Calendly booking')
        console.log('📝 Contact added to list: SHOWROOM KAWAI')
      } else {
        console.warn('⚠️ Failed to add contact to Constant Contact, but Calendly booking succeeded')
      }
    } catch (error) {
      console.error('❌ Error submitting Calendly contact to Constant Contact:', error)
      // Don't throw - booking succeeded even if CC submission failed
    }
  }

  // Set up Calendly event listeners for tracking
  useCalendlyEventListener({
    onProfilePageViewed: (event) => {
      console.log('📊 Calendly Profile Page Viewed:', event)
      onProfilePageViewed?.(event)
    },
    onDateAndTimeSelected: (event) => {
      console.log('📅 Calendly Date/Time Selected:', event)
      onDateTimeSelected?.(event)
    },
    onEventTypeViewed: (event) => {
      console.log('👀 Calendly Event Type Viewed:', event)
    },
    onEventScheduled: async (event) => {
      console.log('🎉 Calendly Event Scheduled:', event)
      console.log('📋 Event payload:', event.data?.payload)

      // Submit to Constant Contact
      await handleConstantContactSubmission(event)

      // Call the original callback
      onEventScheduled?.(event)
    },
    onPageHeightResize: (event) => {
      console.log('📏 Calendly Page Height Resized:', event.data?.payload?.height)
    }
  })

  // Build the full Calendly URL with UTM parameters
  const buildCalendlyUrl = () => {
    const url = new URL(calendlyUrl)
    const utmParams = buildUtmParams()

    // Add UTM parameters to the URL using standard UTM format
    url.searchParams.set('utm_source', utmParams.utmSource)
    url.searchParams.set('utm_medium', utmParams.utmMedium)
    url.searchParams.set('utm_campaign', utmParams.utmCampaign)
    url.searchParams.set('utm_content', utmParams.utmContent)

    // Add signature page context for better attribution
    if (signaturePageSlug) {
      url.searchParams.set('signature_page', signaturePageSlug)
    }

    console.log('🔗 Built Calendly URL with tracking:', url.toString())
    console.log('📧 Prefill email being used:', prefillEmail)
    return url.toString()
  }

  useEffect(() => {
    // Set up a timer to handle loading state
    const loadingTimer = setTimeout(() => {
      if (isLoading) {
        handleWidgetLoad() // Assume loaded if no error after 3 seconds
      }
    }, 3000)

    return () => clearTimeout(loadingTimer)
  }, [isLoading])

  return (
    <div className={cn('relative', className)}>
      {/* Loading State */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-kawai-black/90 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg"
          >
            <div className="text-center space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-kawai-gold border-t-transparent rounded-full mx-auto"
              />
              <p className="text-kawai-pearl text-sm">Loading booking calendar...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {loadError && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-red-900/20 border border-red-400/30 rounded-lg text-center"
        >
          <div className="text-red-400 text-sm mb-2">⚠️ Booking Calendar Error</div>
          <p className="text-kawai-pearl/80 text-sm">{loadError}</p>
          <button
            onClick={() => {
              setLoadError(null)
              setIsLoading(true)
            }}
            className="mt-3 px-4 py-2 bg-kawai-gold text-kawai-black rounded text-sm hover:bg-kawai-gold/90 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      )}

      {/* Calendly Widget */}
      {!loadError && (
        <div className="calendly-widget-container">
          <InlineWidget
            url={buildCalendlyUrl()}
            styles={{
              height: '700px',
              minWidth: '320px'
            }}
            pageSettings={{
              backgroundColor: 'ffffff',
              hideEventTypeDetails: false,
              hideLandingPageDetails: false,
              primaryColor: 'D4AF37', // Kawai gold color
              textColor: '000000'
            }}
            utm={buildUtmParams()}
            prefill={prefillEmail ? { email: prefillEmail } : undefined}
          />
        </div>
      )}
    </div>
  )
}

// Main Calendly Booking Widget Component
export function CalendlyBookingWidget({
  isOpen,
  onClose,
  signaturePageSlug,
  calendlyUrl = DEFAULT_CALENDLY_URL,
  displayMode = 'modal',
  className = '',
  prefillEmail,
  onEventScheduled,
  onDateTimeSelected,
  onProfilePageViewed
}: CalendlyBookingWidgetProps) {

  // Handle successful booking
  const handleEventScheduled = (eventData: any) => {
    console.log('🎯 Booking completed successfully:', eventData)

    // Call external callback if provided
    onEventScheduled?.(eventData)

    // You can add additional tracking logic here later:
    // - Send to analytics
    // - Update internal state
    // - Show success notification
    // - etc.
  }

  // Handle date/time selection for tracking
  const handleDateTimeSelected = (eventData: any) => {
    console.log('📅 User selected date/time:', eventData)
    onDateTimeSelected?.(eventData)
  }

  // Handle profile page view for tracking
  const handleProfilePageViewed = (eventData: any) => {
    console.log('👁️ User viewed booking page:', eventData)
    onProfilePageViewed?.(eventData)
  }

  // Modal version
  if (displayMode === 'modal') {
    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-kawai-black/90 backdrop-blur-md"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className={cn(
                'relative bg-gradient-to-br from-gray-900 to-kawai-black rounded-2xl shadow-2xl',
                'w-full max-w-4xl max-h-[90vh] overflow-hidden border border-kawai-gold/20',
                className
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-kawai-gold/20">
                <div>
                  <h2 className="text-2xl font-light text-kawai-pearl">
                    Claim Your <span className="text-kawai-red">Invite</span>
                  </h2>
                  <p className="text-kawai-pearl/70 text-sm mt-1">
                    Schedule your exclusive piano viewing • Houston Baby Grand Sale
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-kawai-pearl/60 hover:text-kawai-pearl transition-colors duration-300 p-2"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Calendly Widget */}
              <div className="p-6">
                <CalendlyWidgetContent
                  calendlyUrl={calendlyUrl}
                  signaturePageSlug={signaturePageSlug}
                  prefillEmail={prefillEmail}
                  onEventScheduled={handleEventScheduled}
                  onDateTimeSelected={handleDateTimeSelected}
                  onProfilePageViewed={handleProfilePageViewed}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    )
  }

  // Inline version
  return (
    <div className={cn('w-full', className)}>
      <CalendlyWidgetContent
        calendlyUrl={calendlyUrl}
        signaturePageSlug={signaturePageSlug}
        prefillEmail={prefillEmail}
        onEventScheduled={handleEventScheduled}
        onDateTimeSelected={handleDateTimeSelected}
        onProfilePageViewed={handleProfilePageViewed}
      />
    </div>
  )
}