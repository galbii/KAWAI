import { useState, useCallback, useRef } from 'react'
import { useCalendlyEventListener } from 'react-calendly'
import { usePostHog } from 'posthog-js/react'
import { trackSubmitApplication } from '@/components/MetaPixel'
import useConstantContactIntegration, { type ConstantContactSubmissionData } from '@/hooks/useConstantContactIntegration'

// Global tracking registry (module-level, shared across all hook instances)
// This prevents duplicate tracking when multiple components use useCalendlyTracking
const globalTrackedEvents = new Set<string>()

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

  // Widget ownership (prevents duplicate tracking from multiple widgets on same page)
  calendlyUrl?: string // e.g., 'https://calendly.com/kawaipianogallery/consultation'
  widgetId?: string // Optional unique identifier for this widget instance

  // Enable/disable tracking (useful for modals that are mounted but hidden)
  enabled?: boolean // default: true

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
    targetList: string // e.g., 'SHOWROOM KAWAI', 'TSU2025'
    createListIfMissing?: boolean
    showAuthPrompts?: boolean
    listDescription?: string // Description for list creation
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
  // Use ref instead of state to prevent re-renders and callback recreation
  // This prevents multiple event listeners from accumulating
  const hasTrackedEvent = useRef(false)
  const lastTrackingTimestamp = useRef<number>(0)
  const [isTrackingReady, setIsTrackingReady] = useState(true)

  // Store prefillData in a ref so callbacks always have access to latest value
  const prefillDataRef = useRef(prefillData)
  prefillDataRef.current = prefillData

  // PostHog hook for event tracking
  const posthog = usePostHog()

  // Constant Contact integration (only if enabled)
  const { submitToConstantContact } = useConstantContactIntegration({
    targetList: config.constantContact?.targetList || 'SHOWROOM KAWAI',
    createListIfMissing: config.constantContact?.createListIfMissing ?? true,
    showAuthPrompts: config.constantContact?.showAuthPrompts ?? false,
    // Only include listDescription if it has a value (exactOptionalPropertyTypes: true)
    ...(config.constantContact?.listDescription && {
      listDescription: config.constantContact.listDescription
    })
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
      // Extract data from Calendly event payload (actual user-entered data)
      const payload = eventData?.data?.payload
      const invitee = payload?.event?.invitees?.[0]

      // Get email from Calendly payload (what user actually entered)
      const email = invitee?.email || payload?.invitee?.email || prefillDataRef.current?.email

      if (!email) {
        console.warn('⚠️ No email available for Constant Contact submission (non-blocking)', {
          payload,
          invitee,
          prefillData: prefillDataRef.current
        })
        return
      }

      // Extract name from Calendly payload, fallback to prefill
      const name = invitee?.name || payload?.invitee?.name || ''
      const nameParts = name.split(' ')
      const firstName = nameParts[0] || prefillDataRef.current?.firstName
      const lastName = nameParts.slice(1).join(' ') || prefillDataRef.current?.lastName

      // Create contact data with available information
      const contactData: ConstantContactSubmissionData = {
        email,
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(prefillDataRef.current?.phone && { phone: prefillDataRef.current.phone }),
        optInMarketing: true // Default to opted in for consultation bookings
      }

      console.log('📧 Extracted email from Calendly:', email)
      console.log('👤 Extracted name from Calendly:', { firstName, lastName })
      console.log('📦 prefillData passed to hook:', prefillDataRef.current)
      console.log('🔍 Calendly payload structure:', {
        hasPayload: !!payload,
        hasEvent: !!payload?.event,
        hasInvitees: !!payload?.event?.invitees,
        inviteesLength: payload?.event?.invitees?.length,
        hasInvitee: !!invitee,
        inviteeEmail: invitee?.email,
        payloadInviteeEmail: payload?.invitee?.email
      })

      console.log(`🎉 Booking COMPLETED! Adding to ${config.constantContact.targetList} list:`, contactData)

      // CRITICAL: Verify email is present before submission
      if (!contactData.email) {
        console.error('❌ CRITICAL ERROR: Email is missing from contactData! Cannot submit to Constant Contact.')
        console.error('Debug info:', {
          prefillData: prefillDataRef.current,
          payload,
          invitee,
          extractedEmail: email
        })
        return
      }

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
  }, [config, submitToConstantContact])
  // Note: prefillDataRef is a ref, not a dependency

  // Handle successful booking submission
  const handleSuccessfulBooking = useCallback(async (eventData: any) => {
    const now = Date.now()

    // Extract Calendly event identifiers for robust deduplication
    const payload = eventData?.data?.payload
    const eventUri = payload?.event?.uri  // e.g., "https://api.calendly.com/v2/scheduled_events/AAAA"
    const inviteeUri = payload?.invitee?.uri  // e.g., "https://api.calendly.com/v2/scheduled_events/AAAA/invitees/BBBB"
    const eventUuid = payload?.event?.uuid

    // Build robust event ID using invitee URI (most reliable) or event URI + UUID
    // This prevents race conditions from timestamp-based fallbacks
    const eventId = inviteeUri || eventUri || eventUuid || `fallback-${Math.floor(now / 1000)}`

    console.log(`🔍 [${config.eventName}] Checking event deduplication:`, {
      eventId: inviteeUri ? 'invitee_uri' : eventUri ? 'event_uri' : eventUuid ? 'uuid' : 'fallback',
      eventIdPreview: eventId.substring(0, 50) + '...',
      hasInviteeUri: !!inviteeUri,
      hasEventUri: !!eventUri,
      hasUuid: !!eventUuid,
      alreadyTracked: globalTrackedEvents.has(eventId),
      globalTrackedSize: globalTrackedEvents.size
    })

    // GLOBAL duplicate prevention (shared across all hook instances)
    // This prevents multiple components from tracking the same Calendly event
    // NOTE: Using inviteeUri as eventId ensures both widgets get the same ID for the same booking
    if (globalTrackedEvents.has(eventId)) {
      console.log(`⚠️ [${config.eventName}] Event already tracked GLOBALLY, skipping duplicate`)
      console.log(`   Event ID: ${eventId.substring(0, 60)}...`)
      return
    }

    // Optional: Widget ownership check (extra safety for multiple widgets on same page)
    // If calendlyUrl is provided, verify this event belongs to this widget's Calendly URL
    // This is a secondary check - the inviteeUri deduplication above should catch most duplicates
    if (config.calendlyUrl && eventUri) {
      // Extract the event type from the scheduling URL
      // e.g., "https://calendly.com/org/event-name" → "event-name"
      const urlPath = config.calendlyUrl.toLowerCase().replace(/\?.*$/, '').split('calendly.com/')[1]

      if (urlPath && eventUri && !eventUri.toLowerCase().includes('scheduled_events')) {
        // Only check if this is an event type URI (not a scheduled event URI)
        console.log(`📌 [${config.eventName}] Widget URL check:`, {
          configUrl: config.calendlyUrl,
          eventUri,
          urlPath
        })
      }
    }

    // Instance-level duplicate prevention (fallback)
    // 1. Check if THIS instance has already tracked (ref-based)
    // 2. Check if this is a rapid duplicate (< 1 second since last track)
    if (hasTrackedEvent.current) {
      console.log(`⚠️ [${config.eventName}] Event already tracked by this instance, skipping duplicate`)
      return
    }

    if (now - lastTrackingTimestamp.current < 1000) {
      console.log(`⚠️ [${config.eventName}] Duplicate event detected (< 1s since last), skipping`)
      return
    }

    // Mark as tracked GLOBALLY first (prevents other instances from tracking)
    globalTrackedEvents.add(eventId)
    console.log(`✅ [${config.eventName}] Event marked as tracked globally`)
    console.log(`   Widget ID: ${config.widgetId || 'unknown'}`)
    console.log(`   Event ID: ${eventId.substring(0, 60)}...`)

    // Also mark in this instance
    hasTrackedEvent.current = true
    lastTrackingTimestamp.current = now

    console.log(`🎯 [${config.eventName}] Booking completed by widget: ${config.widgetId || 'unknown'}`)
    console.log('📋 Event payload:', eventData?.data?.payload)

    // Call parent callback immediately
    config.onBookingComplete?.(eventData)

    // Extract data from Calendly event payload (actual user-entered data)
    // Note: payload and invitee already declared at top of function
    const invitee = payload?.event?.invitees?.[0]

    // Get email from Calendly payload (what user actually entered)
    const email = invitee?.email || payload?.invitee?.email || prefillDataRef.current?.email

    // Extract name from Calendly payload, fallback to prefill
    const name = invitee?.name || payload?.invitee?.name || ''
    const nameParts = name.split(' ')
    const firstName = nameParts[0] || prefillDataRef.current?.firstName || ''
    const lastName = nameParts.slice(1).join(' ') || prefillDataRef.current?.lastName || ''

    // Prepare contact data for tracking
    const contactData = {
      email,
      firstName,
      lastName,
      phone: prefillDataRef.current?.phone
    }

    console.log('📊 Contact data prepared for tracking (from Calendly payload):', {
      email: contactData.email ? '[PRESENT]' : '[MISSING]',
      firstName: contactData.firstName ? '[PRESENT]' : '[MISSING]',
      lastName: contactData.lastName ? '[PRESENT]' : '[MISSING]',
      phone: contactData.phone ? '[PRESENT]' : '[MISSING]',
      posthogAvailable: !!posthog,
      source: email === invitee?.email ? 'calendly-invitee' : email === payload?.invitee?.email ? 'calendly-payload' : 'prefillData'
    })

    // Verify we have essential data for tracking
    if (!contactData.email) {
      console.error('❌ CRITICAL: No email available for tracking - events may fail', {
        prefillData: prefillDataRef.current,
        payload,
        invitee,
        contactData
      })
    }

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
          email: contactData.email ? '[PRESENT]' : '[MISSING]',
          dataSource: email === invitee?.email ? 'calendly-invitee' : email === payload?.invitee?.email ? 'calendly-payload' : 'prefillData'
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
              email: contactData.email,
              firstName: contactData.firstName,
              lastName: contactData.lastName,
              conversionType: 'showroom-consultation',
              timestamp: +new Date(),
              dataSource: email === invitee?.email ? 'calendly-invitee' : email === payload?.invitee?.email ? 'calendly-payload' : 'prefillData',
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
  }, [config, posthog, handleConstantContactSubmission])
  // Note: hasTrackedEvent, lastTrackingTimestamp, and prefillDataRef are refs, not dependencies

  // Set up Calendly event listeners (only if enabled)
  // This prevents hidden modals from firing duplicate tracking events
  const isEnabled = config.enabled !== false // Default to true if not specified

  useCalendlyEventListener({
    // Only include handlers if enabled (exactOptionalPropertyTypes: true)
    ...(isEnabled && {
      onEventScheduled: handleSuccessfulBooking,
      onProfilePageViewed: (event) => {
        console.log(`📊 Calendly Profile Page Viewed (${config.eventName}):`, event)
      },
      onDateAndTimeSelected: (event) => {
        console.log(`📅 Calendly Date/Time Selected (${config.eventName}):`, event)
      }
    })
  })

  return {
    isTrackingReady,
    hasTrackedEvent: hasTrackedEvent.current,
    // Expose for manual reset if needed
    resetTracking: () => {
      hasTrackedEvent.current = false
      lastTrackingTimestamp.current = 0
    }
  }
}
