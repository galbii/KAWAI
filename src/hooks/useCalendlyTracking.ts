import { useState, useCallback } from 'react'
import { useCalendlyEventListener } from 'react-calendly'
import { usePostHog } from 'posthog-js/react'
import { trackSubmitApplication } from '@/components/MetaPixel'
import useConstantContactIntegration, { type ConstantContactSubmissionData } from '@/hooks/useConstantContactIntegration'

// Types for prefill data
export interface CalendlyPrefillData {
  email?: string
  firstName?: string
  lastName?: string
  phone?: string
}

// Types for tracking configuration
export interface CalendlyTrackingConfig {
  // Event identification
  eventName: string // e.g., 'TSU Piano Sale', 'GL-10 Signature'
  posthogEventName?: string // e.g., 'tsu_piano_booking', 'signature_dallas_booking'

  // Meta Pixel configuration
  metaPixel: {
    content_name: string // e.g., 'TSU Piano Sale Consultation'
    content_category: string // e.g., 'appointment_booking'
    value: number // e.g., 1000
    currency?: string // default: 'USD'
    status?: string // e.g., 'calendly_booking'
  }

  // Constant Contact integration (optional)
  constantContact?: {
    enabled: boolean
    targetList: string // e.g., 'SHOWROOM KAWAI', 'TSU LEADS'
    createListIfMissing?: boolean
    showAuthPrompts?: boolean
  }

  // Callbacks
  onBookingComplete?: (eventData: any) => void

  // Additional tracking data
  additionalData?: Record<string, any>
}

/**
 * Reusable hook for Calendly event tracking with Meta Pixel, PostHog, and Constant Contact
 *
 * Provides consistent, non-blocking tracking across all Calendly integrations
 *
 * @example
 * ```tsx
 * const { isTrackingReady, hasTrackedEvent } = useCalendlyTracking({
 *   eventName: 'TSU Piano Sale',
 *   posthogEventName: 'tsu_piano_booking',
 *   metaPixel: {
 *     content_name: 'TSU Piano Sale Consultation',
 *     content_category: 'appointment_booking',
 *     value: 1000
 *   },
 *   constantContact: {
 *     enabled: true,
 *     targetList: 'TSU LEADS'
 *   }
 * }, prefillData)
 * ```
 */
export default function useCalendlyTracking(
  config: CalendlyTrackingConfig,
  prefillData?: CalendlyPrefillData
) {
  const [hasTrackedEvent, setHasTrackedEvent] = useState(false)
  const [isTrackingReady, setIsTrackingReady] = useState(true)

  // PostHog hook for event tracking
  const posthog = usePostHog()

  // Constant Contact integration (only if enabled)
  const { submitToConstantContact } = useConstantContactIntegration({
    targetList: config.constantContact?.targetList || 'SHOWROOM KAWAI',
    createListIfMissing: config.constantContact?.createListIfMissing ?? true,
    showAuthPrompts: config.constantContact?.showAuthPrompts ?? false
  })

  // Handle Constant Contact submission (non-blocking)
  const handleConstantContactSubmission = useCallback(async (eventData: any) => {
    if (!config.constantContact?.enabled) {
      console.log('⏭️  Constant Contact integration disabled, skipping')
      return
    }

    console.log('🎯 Starting Constant Contact submission for:', config.eventName)
    console.log('📋 Calendly event data:', eventData?.data?.payload)

    // Implement timeout protection to prevent hanging
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Constant Contact submission timeout')), 10000)
    )

    try {
      // Get email from prefillData
      const email = prefillData?.email
      if (!email) {
        console.warn('⚠️ No email available for Constant Contact submission (non-blocking)')
        return
      }

      // Create contact data with available information
      const contactData: ConstantContactSubmissionData = {
        email,
        ...(prefillData?.firstName && { firstName: prefillData.firstName }),
        ...(prefillData?.lastName && { lastName: prefillData.lastName }),
        ...(prefillData?.phone && { phone: prefillData.phone }),
        optInMarketing: true // Default to opted in for consultation bookings
      }

      console.log(`🎉 Booking COMPLETED! Adding to ${config.constantContact.targetList} list:`, contactData)

      // Submit to Constant Contact list (non-blocking)
      const success = await Promise.race([
        submitToConstantContact(contactData),
        timeoutPromise
      ])

      if (success) {
        console.log(`✅ Contact successfully added to ${config.constantContact.targetList} list: ` + (+new Date()))
      } else {
        console.warn(`⚠️ Failed to add contact to ${config.constantContact.targetList} list, but booking still succeeded`)
      }
    } catch (error) {
      console.error(`❌ Error adding contact to ${config.constantContact.targetList} list (non-blocking):`, error)
      // This is non-blocking - booking completion is not affected
    }
  }, [config, prefillData, submitToConstantContact])

  // Handle successful booking submission
  const handleSuccessfulBooking = useCallback(async (eventData: any) => {
    // Prevent duplicate tracking
    if (hasTrackedEvent) {
      console.log('⚠️ Event already tracked, skipping duplicate')
      return
    }

    console.log(`🎯 ${config.eventName} Booking completed:`, eventData)
    console.log('📋 Event payload:', eventData?.data?.payload)

    // Call parent callback immediately
    config.onBookingComplete?.(eventData)

    // Prepare contact data for tracking
    const contactData = {
      email: prefillData?.email,
      firstName: prefillData?.firstName,
      lastName: prefillData?.lastName,
      phone: prefillData?.phone
    }

    console.log('📊 Contact data prepared for tracking:', {
      email: contactData.email ? '[PRESENT]' : '[MISSING]',
      firstName: contactData.firstName ? '[PRESENT]' : '[MISSING]',
      lastName: contactData.lastName ? '[PRESENT]' : '[MISSING]',
      phone: contactData.phone ? '[PRESENT]' : '[MISSING]',
      posthogAvailable: !!posthog
    })

    // Verify we have essential data for tracking
    if (!contactData.email) {
      console.error('❌ CRITICAL: No email available for tracking - events may fail', {
        prefillData,
        contactData
      })
    }

    // Mark as tracked immediately to prevent duplicates
    setHasTrackedEvent(true)

    // Non-blocking tracking sequence: Meta Pixel → PostHog → Constant Contact
    // All tracking is non-blocking and won't affect booking completion
    setTimeout(() => {
      console.log('🚀 Starting tracking sequence...')

      // 1. Fire Meta Pixel (highest priority)
      try {
        const metaPixelData = {
          ...config.metaPixel,
          currency: config.metaPixel.currency || 'USD',
          ...(config.additionalData && config.additionalData)
        }

        console.log('🎯 Meta Pixel: Firing SubmitApplication event with data:', {
          ...metaPixelData,
          email: prefillData?.email ? '[PRESENT]' : '[MISSING]'
        })

        trackSubmitApplication(metaPixelData)

        console.log('✅ Meta Pixel SubmitApplication fired successfully: ' + (+new Date()))
      } catch (error) {
        console.error('❌ Meta Pixel error (non-blocking):', error)
      }

      // 2. Fire PostHog (medium priority)
      setTimeout(() => {
        try {
          if (posthog && config.posthogEventName) {
            posthog.capture(config.posthogEventName, {
              source: config.eventName.toLowerCase().replace(/\s+/g, '-'),
              email: prefillData?.email,
              firstName: prefillData?.firstName,
              lastName: prefillData?.lastName,
              conversionType: 'showroom-consultation',
              timestamp: +new Date(),
              ...(config.additionalData && config.additionalData)
            })
            console.log(`✅ PostHog ${config.posthogEventName} fired successfully: ` + (+new Date()))
          } else if (!posthog) {
            console.warn('⚠️ PostHog not available - event not fired')
          } else if (!config.posthogEventName) {
            console.log('⏭️  PostHog event name not configured, skipping')
          }
        } catch (error) {
          console.error('❌ PostHog error (non-blocking):', error)
        }
      }, 100)

      // 3. Submit to Constant Contact (lowest priority)
      setTimeout(() => {
        handleConstantContactSubmission(eventData).catch(error => {
          console.error('⚠️ Constant Contact submission failed (non-blocking):', error)
        })
      }, 200)
    }, 50)
  }, [config, prefillData, posthog, hasTrackedEvent, handleConstantContactSubmission])

  // Set up Calendly event listeners
  useCalendlyEventListener({
    onEventScheduled: handleSuccessfulBooking,
    onProfilePageViewed: (event) => {
      console.log(`📊 Calendly Profile Page Viewed (${config.eventName}):`, event)
    },
    onDateAndTimeSelected: (event) => {
      console.log(`📅 Calendly Date/Time Selected (${config.eventName}):`, event)
    }
  })

  return {
    isTrackingReady,
    hasTrackedEvent,
    // Expose for manual reset if needed
    resetTracking: () => setHasTrackedEvent(false)
  }
}
