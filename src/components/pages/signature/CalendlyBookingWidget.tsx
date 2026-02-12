'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { InlineWidget, useCalendlyEventListener } from 'react-calendly'
import { usePostHog } from 'posthog-js/react'
import { trackSubmitApplication } from '@/components/MetaPixel'
import { cn } from '@/lib/utils'
// NOTE: Constant Contact integration removed - handled by parent components via useCalendlyTracking hook

// Interfaces

// Input data structure (what we receive from BookingPreForm)
interface PrefillInputData {
  email?: string
  firstName?: string
  lastName?: string
  name?: string
  phone?: string
}

// Calendly prefill structure (what InlineWidget expects)
interface CalendlyPrefillData {
  email?: string
  firstName?: string
  lastName?: string
  name?: string
  customAnswers?: {
    a1?: string  // Phone number (Calendly uses custom answers for phone)
    a2?: string
    a3?: string
    a4?: string
    a5?: string
    a6?: string
    a7?: string
    a8?: string
    a9?: string
    a10?: string
  }
}

interface CalendlyBookingWidgetProps {
  isOpen: boolean
  onClose: () => void
  signaturePageSlug?: string
  calendlyUrl?: string
  displayMode?: 'modal' | 'inline'
  className?: string
  prefillEmail?: string
  prefillData?: PrefillInputData  // Accept input data with phone field
  modalTitle?: string // CMS-configurable modal title
  modalSubtitle?: string // CMS-configurable modal subtitle
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
  prefillData?: PrefillInputData  // Accept input data with phone field
  onEventScheduled?: (eventData: any) => void
  onDateTimeSelected?: (eventData: any) => void
  onProfilePageViewed?: (eventData: any) => void
  className?: string
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // PostHog hook for proper event tracking
  const posthog = usePostHog()

  // NOTE: Constant Contact integration removed from this component
  // It's now handled by parent components (BookingModalBlock, CalendlyEmbedBlock)
  // via the useCalendlyTracking hook, which respects CMS configuration

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

  // NOTE: Constant Contact submission removed from this component
  // Parent components (BookingModalBlock, CalendlyEmbedBlock) handle CC submission
  // via useCalendlyTracking hook with CMS-configured list names

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

        console.log('🎯 PostHog: Firing signature_dallas_booking event with data:', {
          ...trackingData,
          email: contactData?.email ? '[PRESENT]' : '[MISSING]'
        })

        posthog.capture('signature_dallas_booking', trackingData)

        console.log('✅ PostHog signature_dallas_booking fired successfully: ' + (+new Date()))
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
        phone: contactData.phone ? `[PRESENT: ${contactData.phone}]` : '[MISSING]',
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

      // Execute tracking sequence: Calendly → Meta Pixel → PostHog
      // All tracking is non-blocking and won't affect booking completion
      // NOTE: Constant Contact submission is handled by parent components via useCalendlyTracking
      setTimeout(() => {
        console.log('🚀 Starting tracking sequence...')

        // Step 1: Fire Meta Pixel AFTER Calendly confirmation
        fireMetaPixelTracking(event, contactData)

        // Step 2: Fire PostHog AFTER Meta Pixel (small delay for proper sequence)
        setTimeout(() => {
          firePostHogTracking(event, contactData)
        }, 100)

        // NOTE: Constant Contact submission removed - handled by parent via useCalendlyTracking
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
    console.log('📧 Prefill data input:', prefillData || { email: prefillEmail })
    console.log('📋 Prefill object being passed to InlineWidget:', buildPrefillObject())
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

      // IMPORTANT: Calendly doesn't support a direct 'phone' field in prefill
      // Phone numbers must be passed via customAnswers (a1-a10)
      // NOTE: Phone is the 2nd custom question in Calendly (a2), not the 1st (a1)
      // a1 = "What type of piano are you most interested in?" (dropdown)
      // a2 = "Phone Number" (phone input)
      if (prefillData.phone) {
        // Add US country code (+1) if not already present
        let formattedPhone = prefillData.phone.replace(/\D/g, '') // Remove non-digits
        if (!formattedPhone.startsWith('1') && formattedPhone.length === 10) {
          formattedPhone = '1' + formattedPhone // Add country code
        }

        prefill.customAnswers = {
          a2: formattedPhone  // e.g., "17143268063"
        }
      }

      // Build full name if we have firstName and lastName
      if (prefillData.firstName && prefillData.lastName) {
        prefill.name = `${prefillData.firstName} ${prefillData.lastName}`
      } else if (prefillData.firstName) {
        prefill.name = prefillData.firstName
      }

      console.log('🔧 Built prefill object for Calendly:', JSON.stringify(prefill, null, 2))

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
        // On mobile, use a height that works well in the modal
        // Account for modal header (~120px) + padding (~48px)
        const reservedSpace = 168
        setWidgetHeight(`${Math.max(windowHeight - reservedSpace, 500)}px`)
      } else {
        // On desktop, use a height that fills the modal content area well
        // Modal is 95vh, header is ~100px, padding is ~48px
        const modalHeight = windowHeight * 0.95
        const reservedSpace = 148
        const calculatedHeight = modalHeight - reservedSpace
        setWidgetHeight(`${Math.max(calculatedHeight, 600)}px`)
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
  modalTitle,
  modalSubtitle,
  onEventScheduled,
  onDateTimeSelected,
  onProfilePageViewed
}: CalendlyBookingWidgetProps) {
  // Apply defaults for modal text if not provided
  const actualModalTitle = modalTitle || 'Book your appointment'
  const actualModalSubtitle = modalSubtitle || 'Choose a time that works best for your private piano experience'

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

  // Modal version - Piano Showroom Luxury
  if (displayMode === 'modal') {
    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-6">
            {/* Refined backdrop - Very light, airy luxury retail feel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0"
              style={{
                background: 'rgba(44, 44, 44, 0.15)', // Very light charcoal tint
                backdropFilter: 'blur(32px) saturate(150%) brightness(0.98)',
                WebkitBackdropFilter: 'blur(32px) saturate(150%) brightness(0.98)',
              }}
            />

            {/* Modal - Pure White Piano Showroom */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 300,
                mass: 0.8,
              }}
              className={cn(
                'relative flex flex-col',
                'w-full max-w-5xl h-[95vh]',
                className
              )}
              style={{
                background: '#FFFFFF', // Pure white
                borderRadius: '16px',
                boxShadow: `
                  0 8px 16px rgba(0, 0, 0, 0.04),
                  0 16px 32px rgba(0, 0, 0, 0.06),
                  0 32px 64px rgba(0, 0, 0, 0.08),
                  0 0 0 1px rgba(44, 44, 44, 0.06),
                  inset 0 1px 0 rgba(255, 255, 255, 1)
                `,
              }}
            >
              {/* Very subtle grain texture overlay */}
              <div
                className="absolute inset-0 pointer-events-none rounded-xl"
                style={{
                  opacity: 0.02,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Header - Clean White Background with Legible Typography */}
              <div className="relative flex items-center justify-between p-6 md:p-8 flex-shrink-0 bg-white rounded-t-xl">
                <div className="flex-1 pr-4">
                  <h2
                    className="text-2xl md:text-3xl lg:text-4xl leading-tight"
                    style={{
                      fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
                      fontWeight: 600, // Semibold for legibility
                      color: '#2C2C2C', // Charcoal for strong contrast on white
                      letterSpacing: '-0.02em', // Tight tracking for modern look
                    }}
                  >
                    {actualModalTitle}
                  </h2>
                  {actualModalSubtitle && (
                    <p
                      className="text-sm md:text-base mt-3 leading-relaxed"
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 400, // Regular weight for readability
                        color: 'rgba(44, 44, 44, 0.70)', // Softer charcoal for hierarchy
                      }}
                    >
                      {actualModalSubtitle}
                    </p>
                  )}
                </div>

                {/* Piano key-inspired close button - elegant on white */}
                <button
                  onClick={onClose}
                  className="flex-shrink-0 ml-4 group relative"
                  aria-label="Close booking modal"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F8F8F8 0%, #EFEFEF 100%)',
                    border: '1px solid rgba(44, 44, 44, 0.08)',
                    boxShadow: `
                      0 2px 4px rgba(0, 0, 0, 0.06),
                      0 4px 8px rgba(0, 0, 0, 0.04),
                      inset 0 1px 0 rgba(255, 255, 255, 0.9)
                    `,
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.08)'
                    e.currentTarget.style.background = 'linear-gradient(135deg, #FFFFFF 0%, #F8F8F8 100%)'
                    e.currentTarget.style.boxShadow = `
                      0 4px 8px rgba(0, 0, 0, 0.08),
                      0 8px 16px rgba(0, 0, 0, 0.06),
                      inset 0 1px 0 rgba(255, 255, 255, 1),
                      0 0 0 2px rgba(212, 175, 55, 0.4)
                    `
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.background = 'linear-gradient(135deg, #F8F8F8 0%, #EFEFEF 100%)'
                    e.currentTarget.style.boxShadow = `
                      0 2px 4px rgba(0, 0, 0, 0.06),
                      0 4px 8px rgba(0, 0, 0, 0.04),
                      inset 0 1px 0 rgba(255, 255, 255, 0.9)
                    `
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'scale(0.92)'
                    e.currentTarget.style.boxShadow = `
                      0 1px 2px rgba(0, 0, 0, 0.08),
                      inset 0 2px 4px rgba(0, 0, 0, 0.08)
                    `
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'scale(1.08)'
                  }}
                >
                  <svg
                    className="group-hover:text-[#C41E3A] transition-colors duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '20px',
                      height: '20px',
                      color: '#2C2C2C',
                    }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Refined gold hardware divider - subtle on white */}
              <div
                className="relative w-full flex-shrink-0"
                style={{
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.25) 50%, transparent 100%)',
                  boxShadow: '0 1px 3px rgba(212, 175, 55, 0.15)',
                }}
              />

              {/* Calendly Widget - Scrollable Content on Pure White */}
              <div className="flex-1 overflow-hidden relative bg-white rounded-b-xl">
                <div
                  className="h-full overflow-y-auto"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(212, 175, 55, 0.3) rgba(248, 248, 248, 0.5)',
                  }}
                >
                  <div className="p-6 md:p-8">
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
                </div>
              </div>

              {/* Bottom gold hardware accent - very subtle on white */}
              <div
                className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 rounded-full pointer-events-none"
                style={{
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.35) 50%, transparent 100%)',
                  boxShadow: '0 0 6px rgba(212, 175, 55, 0.15)',
                }}
              />
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