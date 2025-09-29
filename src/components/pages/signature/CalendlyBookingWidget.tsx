'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { InlineWidget, useCalendlyEventListener } from 'react-calendly'
import { usePostHog } from 'posthog-js/react'
import { trackSubmitApplication } from '@/components/MetaPixel'
import { cn } from '@/lib/utils'
import useConstantContactIntegration, { type ConstantContactSubmissionData } from '@/hooks/useConstantContactIntegration'

// Interfaces
interface CalendlyPrefillData {
  email?: string
  firstName?: string
  lastName?: string
  name?: string
  phone?: string
}

interface CalendlyBookingWidgetProps {
  isOpen: boolean
  onClose: () => void
  signaturePageSlug?: string
  calendlyUrl?: string
  displayMode?: 'modal' | 'inline'
  className?: string
  prefillEmail?: string
  prefillData?: CalendlyPrefillData
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
  prefillData,
  onEventScheduled,
  onDateTimeSelected,
  onProfilePageViewed,
  className = ''
}: {
  calendlyUrl: string
  signaturePageSlug?: string
  prefillEmail?: string
  prefillData?: CalendlyPrefillData
  onEventScheduled?: (eventData: any) => void
  onDateTimeSelected?: (eventData: any) => void
  onProfilePageViewed?: (eventData: any) => void
  className?: string
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // PostHog hook for proper event tracking
  const posthog = usePostHog()

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

  // Submit contact to SHOWROOM KAWAI list when booking COMPLETES successfully (NON-BLOCKING)
  const handleSuccessfulBookingSubmission = async (eventData: any) => {
    console.log('🎯 Calendly onEventScheduled fired: ' + (+new Date()))
    console.log('📋 Calendly event data:', eventData?.data?.payload)

    // Implement timeout protection to prevent hanging
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Constant Contact submission timeout')), 10000)
    )

    try {
      // Get email from prefillData or fallback to prefillEmail
      const email = prefillData?.email || prefillEmail
      if (!email) {
        console.warn('⚠️ No email available for successful booking submission (non-blocking)')
        return
      }

      // Create contact data with available information for SHOWROOM KAWAI list
      const contactData: ConstantContactSubmissionData = {
        email,
        ...(prefillData?.firstName && { firstName: prefillData.firstName }),
        ...(prefillData?.lastName && { lastName: prefillData.lastName }),
        ...(prefillData?.phone && { phone: prefillData.phone }),
        optInMarketing: true // Default to opted in for consultation bookings
      }

      console.log('🎉 Booking COMPLETED successfully! Adding to SHOWROOM KAWAI list:', contactData)

      // Submit to SHOWROOM KAWAI list (non-blocking)
      const success = await Promise.race([
        submitToConstantContact(contactData), // This should target SHOWROOM KAWAI list
        timeoutPromise
      ])

      if (success) {
        console.log('📧 Constant Contact SHOWROOM KAWAI submission: ' + (+new Date()))
        console.log('✅ Contact successfully added to SHOWROOM KAWAI list')
      } else {
        console.warn('⚠️ Failed to add contact to SHOWROOM KAWAI list, but booking still succeeded')
      }
    } catch (error) {
      console.error('❌ Error adding successful booking to SHOWROOM KAWAI list (non-blocking):', error)
      // This is non-blocking - booking completion is not affected
    }
  }

  // Fire Meta Pixel AFTER Calendly booking completion using the proper utility function
  const fireMetaPixelTracking = (eventData: any, contactData: any) => {
    try {
      const metaPixelData = {
        content_name: 'Signature Experience Booking',
        content_category: 'Piano Consultation',
        value: 1000, // High-value lead
        currency: 'USD',
        status: 'completed'
      }

      console.log('🎯 Meta Pixel: Firing SubmitApplication event with data:', {
        ...metaPixelData,
        email: contactData?.email ? '[PRESENT]' : '[MISSING]'
      })

      // Use the proper Meta Pixel utility function instead of direct window.fbq access
      trackSubmitApplication(metaPixelData)

      console.log('✅ Meta Pixel SubmitApplication fired via utility function: ' + (+new Date()))

    } catch (error) {
      console.error('❌ Error firing Meta Pixel event (non-blocking):', error)
    }
  }

  // Fire PostHog AFTER Meta Pixel
  const firePostHogTracking = (eventData: any, contactData: any) => {
    try {
      // Verify PostHog is available via the hook
      if (posthog) {
        const trackingData = {
          source: 'calendly-booking-completed',
          email: contactData?.email,
          firstName: contactData?.firstName,
          lastName: contactData?.lastName,
          signaturePageSlug,
          calendlyEventUri: eventData?.data?.payload?.event?.uri,
          conversionType: 'showroom-consultation',
          timestamp: +new Date()
        }

        console.log('🎯 PostHog: Firing signature_houston_booking event with data:', {
          ...trackingData,
          email: contactData?.email ? '[PRESENT]' : '[MISSING]'
        })

        posthog.capture('signature_houston_booking', trackingData)

        console.log('✅ PostHog signature_houston_booking fired successfully: ' + (+new Date()))
      } else {
        console.warn('⚠️ PostHog not available - event not fired', {
          posthogHook: !!posthog,
          contactDataAvailable: !!contactData,
          emailPresent: !!contactData?.email
        })
      }
    } catch (error) {
      console.error('❌ Error firing PostHog event (non-blocking):', error)
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
    onEventScheduled: (event) => {
      console.log('🎉 Calendly Event Scheduled:', event)
      console.log('📋 Event payload:', event.data?.payload)

      // CRITICAL FIX: Call the original callback IMMEDIATELY (non-blocking)
      // This ensures booking appears complete to user regardless of tracking status
      onEventScheduled?.(event)

      // Create contact data for tracking
      const contactData = {
        email: prefillData?.email || prefillEmail,
        firstName: prefillData?.firstName,
        lastName: prefillData?.lastName,
        phone: prefillData?.phone
      }

      console.log('📊 Contact data prepared for tracking:', {
        email: contactData.email ? '[PRESENT]' : '[MISSING]',
        firstName: contactData.firstName ? '[PRESENT]' : '[MISSING]',
        lastName: contactData.lastName ? '[PRESENT]' : '[MISSING]',
        phone: contactData.phone ? '[PRESENT]' : '[MISSING]',
        signaturePageSlug,
        posthogAvailable: !!posthog
      })

      // Verify we have essential data for tracking
      if (!contactData.email) {
        console.error('❌ CRITICAL: No email available for tracking - events may fail', {
          prefillData,
          prefillEmail,
          contactData
        })
      }

      // Execute tracking sequence: Calendly → Meta Pixel → PostHog → Constant Contact
      // All tracking is non-blocking and won't affect booking completion
      setTimeout(() => {
        console.log('🚀 Starting tracking sequence...')

        // Step 1: Fire Meta Pixel AFTER Calendly confirmation
        fireMetaPixelTracking(event, contactData)

        // Step 2: Fire PostHog AFTER Meta Pixel (small delay for proper sequence)
        setTimeout(() => {
          firePostHogTracking(event, contactData)
        }, 100)

        // Step 3: Submit to SHOWROOM KAWAI list (fire and forget, largest delay)
        setTimeout(() => {
          handleSuccessfulBookingSubmission(event).catch(error => {
            console.error('⚠️ SHOWROOM KAWAI list submission failed (non-blocking):', error)
          })
        }, 200)
      }, 50) // Small initial delay to ensure Calendly has fully processed
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
    console.log('📧 Prefill data being used:', prefillData || { email: prefillEmail })
    return url.toString()
  }

  // Build prefill object for Calendly
  const buildPrefillObject = (): CalendlyPrefillData | undefined => {
    if (prefillData) {
      // Use the complete prefill data object
      const prefill: CalendlyPrefillData = {}

      if (prefillData.email) prefill.email = prefillData.email
      if (prefillData.firstName) prefill.firstName = prefillData.firstName
      if (prefillData.lastName) prefill.lastName = prefillData.lastName
      if (prefillData.phone) prefill.phone = prefillData.phone

      // Build full name if we have firstName and lastName
      if (prefillData.firstName && prefillData.lastName) {
        prefill.name = `${prefillData.firstName} ${prefillData.lastName}`
      } else if (prefillData.firstName) {
        prefill.name = prefillData.firstName
      }

      return Object.keys(prefill).length > 0 ? prefill : undefined
    } else if (prefillEmail) {
      // Fallback to email-only prefill for backward compatibility
      return { email: prefillEmail }
    }

    return undefined
  }

  // Calculate optimal height for mobile/desktop
  const [widgetHeight, setWidgetHeight] = useState('600px')

  // Add debugging for event listener registration
  useEffect(() => {
    console.log('🔧 Calendly widget initialized with configuration:')
    console.log('- URL:', buildCalendlyUrl())
    console.log('- Prefill data:', buildPrefillObject())
    console.log('- Signature page:', signaturePageSlug)
    console.log('- Event listeners: onEventScheduled registered')
  }, [])

  useEffect(() => {
    const calculateHeight = () => {
      const windowHeight = window.innerHeight
      const isMobile = window.innerWidth < 768

      if (isMobile) {
        // On mobile, use most of the viewport height minus header
        const headerHeight = 80 // Approximate header height
        setWidgetHeight(`${windowHeight - headerHeight}px`)
      } else {
        // On desktop, use a reasonable height that fits in viewport
        const headerHeight = 100
        const availableHeight = windowHeight - headerHeight
        setWidgetHeight(`${Math.min(availableHeight, 700)}px`)
      }
    }

    calculateHeight()
    window.addEventListener('resize', calculateHeight)

    // Set up a timer to handle loading state
    const loadingTimer = setTimeout(() => {
      if (isLoading) {
        handleWidgetLoad() // Assume loaded if no error after 3 seconds
      }
    }, 3000)

    return () => {
      clearTimeout(loadingTimer)
      window.removeEventListener('resize', calculateHeight)
    }
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
      {!loadError && (() => {
        const prefillData = buildPrefillObject();
        return (
          <div className="calendly-widget-container">
            <InlineWidget
              url={buildCalendlyUrl()}
              styles={{
                height: widgetHeight,
                minWidth: '320px',
                width: '100%'
              }}
              pageSettings={{
                backgroundColor: 'ffffff',
                hideEventTypeDetails: false,
                hideLandingPageDetails: false,
                primaryColor: 'D4AF37', // Kawai gold color
                textColor: '000000'
              }}
              // Remove utm prop to avoid conflicts with URL parameters
              {...(prefillData && { prefill: prefillData })}
            />
          </div>
        );
      })()}
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
  prefillData,
  onEventScheduled,
  onDateTimeSelected,
  onProfilePageViewed
}: CalendlyBookingWidgetProps) {

  // Handle successful booking
  const handleEventScheduled = (eventData: any) => {
    console.log('🎯 Booking completed successfully in CalendlyBookingWidget: ' + (+new Date()))
    console.log('📊 Event data structure:', {
      event: eventData.event,
      payload: eventData.data?.payload,
      inviteeUri: eventData.data?.payload?.invitee?.uri,
      eventUri: eventData.data?.payload?.event?.uri
    })

    // Call external callback if provided
    onEventScheduled?.(eventData)

    console.log('✅ External onEventScheduled callback has been called')
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
                  {...(signaturePageSlug && { signaturePageSlug })}
                  {...(prefillEmail && { prefillEmail })}
                  {...(prefillData && { prefillData })}
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
    <div className={cn('w-full h-full', className)}>
      <CalendlyWidgetContent
        calendlyUrl={calendlyUrl}
        {...(signaturePageSlug && { signaturePageSlug })}
        {...(prefillEmail && { prefillEmail })}
        {...(prefillData && { prefillData })}
        onEventScheduled={handleEventScheduled}
        onDateTimeSelected={handleDateTimeSelected}
        onProfilePageViewed={handleProfilePageViewed}
        className="h-full"
      />
    </div>
  )
}