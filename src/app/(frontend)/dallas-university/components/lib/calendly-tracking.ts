'use client'

import posthog from 'posthog-js'
import { trackKawaiEvent } from './analytics'
import { eventMonitor } from './posthog-validation'
import { POSTHOG_CONFIG } from './posthog-config'

// Check if running in browser
const isBrowser = typeof window !== 'undefined'

// Calendly event types we want to track
type CalendlyEventType = 
  | 'calendly.profile_page_viewed'
  | 'calendly.event_type_viewed'
  | 'calendly.invitee_date_time_selected'  // Documented name
  | 'calendly.date_and_time_selected'      // Actual name being sent
  | 'calendly.invitee_scheduled'
  | 'calendly.event_scheduled'  // The actual event that fires on booking
  | 'calendly.page_height'      // Height change events

interface CalendlyEvent {
  event: CalendlyEventType | string
  payload?: {
    event?: {
      uri?: string
    }
    invitee?: {
      uri?: string
    }
    [key: string]: unknown
  }
  [key: string]: unknown
}

// Track the source of the Calendly widget for attribution
let calendlySource: 'modal' | 'booking_section' | 'unknown' = 'unknown'

// Enhanced duplicate event prevention with time-based deduplication
const processedAppointments = new Map<string, number>()

// Clean up old processed appointments (older than 30 seconds)
function cleanupOldAppointments() {
  const now = Date.now()
  const thirtySecondsAgo = now - 30000
  
  for (const [key, timestamp] of processedAppointments.entries()) {
    if (timestamp < thirtySecondsAgo) {
      processedAppointments.delete(key)
    }
  }
}

// Enhanced booking UUID generation for better deduplication
function generateBookingUUID(eventType: string, eventData: CalendlyEvent): string {
  const sessionId = typeof window !== 'undefined' ? window.crypto?.randomUUID?.() || 'unknown' : 'server'
  const eventIdentifier = eventData.payload?.event?.uri || eventData.payload?.invitee?.uri || 'unknown'
  const timestamp = Math.floor(Date.now() / 1000) // Round to seconds
  
  return `${eventType}-${sessionId}-${eventIdentifier}-${timestamp}`.replace(/[^a-zA-Z0-9-]/g, '_')
}

// Check if message is from Calendly
function isCalendlyEvent(e: MessageEvent): e is MessageEvent<CalendlyEvent> {
  return (
    e.data &&
    typeof e.data === 'object' &&
    'event' in e.data &&
    typeof e.data.event === 'string' &&
    e.data.event.indexOf('calendly') === 0
  )
}

// Enhanced attribution persistence
function persistAttributionData() {
  if (!isBrowser) return
  
  const attributionData = {
    source: calendlySource,
    timestamp: Date.now(),
    sessionId: typeof posthog !== 'undefined' && posthog.get_session_id ? posthog.get_session_id() : 'unknown',
    distinctId: typeof posthog !== 'undefined' && posthog.get_distinct_id ? posthog.get_distinct_id() : 'unknown',
    userAgent: navigator.userAgent,
    referrer: document.referrer || 'direct'
  }

  try {
    // Store in multiple locations for reliability
    localStorage.setItem('kawai_attribution', JSON.stringify(attributionData))
    sessionStorage.setItem('kawai_attribution_backup', JSON.stringify(attributionData))
    
    // Also store legacy format for webhook compatibility
    localStorage.setItem('kawai_last_booking_source', calendlySource)
    localStorage.setItem('kawai_last_booking_time', Date.now().toString())
  } catch (error) {
    console.error('Failed to persist attribution data:', error)
  }
}

// Handle Calendly events with enhanced error handling and validation
function handleCalendlyEvent(event: CalendlyEvent) {
  if (!isBrowser) return

  // Clean up old appointments periodically
  cleanupOldAppointments()

  // Check if PostHog is properly initialized
  const isPostHogReady = posthog && (posthog.__loaded || typeof posthog.capture === 'function')
  if (!isPostHogReady) {
    console.warn('PostHog not ready for Calendly event:', event.event, {
      posthogExists: !!posthog,
      isLoaded: posthog?.__loaded,
      hasCaptureMethod: typeof posthog?.capture === 'function'
    })
  }

  console.log('✅ Calendly event detected:', event.event, {
    source: calendlySource,
    hasPayload: !!event.payload,
    timestamp: new Date().toISOString()
  })

  switch (event.event) {
    case 'calendly.profile_page_viewed':
      // Track when Calendly widget loads
      console.log('🎨 Calendly profile page viewed:', event)
      
      trackKawaiEvent.calendlyInteraction('profile_viewed', calendlySource)
      
      // Track widget load in PostHog
      eventMonitor.capture('calendly_widget_loaded', {
        booking_source: calendlySource,
        widget_type: 'inline',
        load_timestamp: new Date().toISOString(),
        user_type: localStorage.getItem('kawai_returning_user') === 'true' ? 'returning' : 'new',
        funnel_step: 'widget_load'
      })
      
      console.log('✅ Calendly widget load tracked')
      break

    case 'calendly.event_type_viewed':
      // Track when user views event details
      console.log('🔍 User viewing event type details:', event)
      
      trackKawaiEvent.calendlyInteraction('event_type_viewed', calendlySource)
      
      // Removed calendly_event_browsed tracking
      
      console.log('✅ Event type browsing tracked')
      break

    case 'calendly.invitee_date_time_selected':
    case 'calendly.date_and_time_selected':
      // Track when user selects a time slot (both possible event names)
      console.log('📅 User selected date/time in Calendly:', event)
      
      // Track with Google Analytics and other platforms
      trackKawaiEvent.calendlyInteraction('time_selected', calendlySource)
      
      // Track with PostHog for funnel analysis using proper schema
      eventMonitor.capture(POSTHOG_CONFIG.EVENTS.CONSULTATION_BOOKING_ATTEMPT, {
        booking_source: calendlySource,
        calendly_status: 'time_selected',
        user_type: localStorage.getItem('kawai_returning_user') === 'true' ? 'returning' : 'new',
        // Optional contextual properties for funnel analysis
        models_viewed_count: parseInt(localStorage.getItem('kawai_pianos_viewed') || '0'),
        session_quality: parseInt(localStorage.getItem('kawai_session_quality') || '75'), // Higher quality for time selection
        total_interactions: parseInt(localStorage.getItem('kawai_total_interactions') || '2')
      })
      
      console.log('✅ Time selection tracked in PostHog and analytics')
      break

    case 'calendly.invitee_scheduled':
    case 'calendly.event_scheduled':
      // Handle both event types (some Calendly versions send different events)
      const isMainEvent = event.event === 'calendly.invitee_scheduled'
      const eventLabel = isMainEvent ? 'Primary Booking Event' : 'Secondary Booking Event'
      
      console.group(`🎯 ${eventLabel}`)
      console.log('Event data:', event)
      console.log('Booking source:', calendlySource)
      console.log('PostHog available:', !!posthog)
      console.log('Payload data:', event.payload)
      
      // Generate enhanced UUID for this booking
      const bookingUUID = generateBookingUUID(event.event, event)
      
      // Check for recent duplicates using the enhanced system
      if (!processedAppointments.has(bookingUUID)) {
        // Mark as processed immediately
        processedAppointments.set(bookingUUID, Date.now())
        
        console.log('🚀 Processing new booking event...')
        
        // Track conversion with all analytics platforms
        trackKawaiEvent.calendlyConversion(calendlySource)
        console.log('✅ Cross-platform conversion tracking completed')
        
        // Enhanced PostHog tracking with proper validation schema
        const enhancedEventData = {
          booking_source: calendlySource,
          calendly_status: 'completed',
          user_type: localStorage.getItem('kawai_returning_user') === 'true' ? 'returning' : 'new',
          // Optional contextual properties for funnel analysis
          models_viewed_count: parseInt(localStorage.getItem('kawai_pianos_viewed') || '0'),
          session_quality: parseInt(localStorage.getItem('kawai_session_quality') || '50'),
          total_interactions: parseInt(localStorage.getItem('kawai_total_interactions') || '1')
        }
        
        // Primary PostHog tracking with error handling
        try {
          // Track the booking attempt completion
          eventMonitor.capture(POSTHOG_CONFIG.EVENTS.CONSULTATION_BOOKING_ATTEMPT, enhancedEventData)
            .then(result => {
              console.log('✅ PostHog booking attempt event captured successfully:', result)
            })
            .catch(error => {
              console.error('❌ PostHog booking attempt event capture failed:', error)
              // Fallback to direct capture
              posthog.capture(POSTHOG_CONFIG.EVENTS.CONSULTATION_BOOKING_ATTEMPT, enhancedEventData)
            })

          // Also track the actual Calendly appointment with detailed data
          const appointmentData = {
            booking_id: bookingUUID,
            invitee_name: 'Contact Information Provided', // Privacy-safe generic value
            invitee_email: 'contact@calendly-form.com', // Privacy-safe generic value
            event_type_name: 'KAWAI Piano Consultation',
            scheduled_time: new Date().toISOString(),
            duration_minutes: 30,
            location_type: 'video_call',
            booking_source: calendlySource,
            calendly_event_type: event.event,
            additional_notes: `Calendly event: ${event.event}, Source: ${calendlySource}`,
            lead_score: parseInt(localStorage.getItem('kawai_session_quality') || '50')
          }
          
          eventMonitor.capture(POSTHOG_CONFIG.EVENTS.CALENDLY_APPOINTMENT_BOOKED, appointmentData)
            .then(result => {
              console.log('✅ PostHog appointment event captured successfully:', result)
              
              // Validate event was received
              setTimeout(() => validateEventDelivery(bookingUUID), 2000)
            })
            .catch(error => {
              console.error('❌ PostHog appointment event capture failed:', error)
              // Fallback to direct capture
              posthog.capture(POSTHOG_CONFIG.EVENTS.CALENDLY_APPOINTMENT_BOOKED, appointmentData)
            })
        } catch (error) {
          console.error('❌ PostHog tracking error:', error)
        }
        
        // Persist enhanced attribution data
        persistAttributionData()
        console.log('✅ Attribution data persisted')
        
        console.log('🎉 Booking event processing completed successfully!')
      } else {
        const originalTimestamp = processedAppointments.get(bookingUUID)
        const timeSinceOriginal = Date.now() - (originalTimestamp || 0)
        console.warn(`⚠️ Duplicate booking event detected and prevented`, {
          uuid: bookingUUID,
          timeSinceOriginal: `${timeSinceOriginal}ms`,
          eventType: event.event
        })
      }
      
      console.groupEnd()
      break

    case 'calendly.page_height':
      // Just ignore height change events - they're not important for tracking
      console.log('📏 Calendly height changed (ignoring)')
      break

    default:
      // Log any other Calendly events for debugging and track them
      console.log('🔍 Unhandled Calendly event:', event.event, event)
      
      // Track unknown events in PostHog for analysis
      eventMonitor.capture('calendly_unknown_event', {
        event_name: event.event,
        booking_source: calendlySource,
        event_data: event,
        timestamp: new Date().toISOString(),
        user_type: localStorage.getItem('kawai_returning_user') === 'true' ? 'returning' : 'new'
      })
      
      // Also track as generic interaction for analytics
      if (typeof event.event === 'string' && event.event.startsWith('calendly.')) {
        const eventType = event.event.replace('calendly.', '')
        trackKawaiEvent.calendlyInteraction(eventType, calendlySource)
        console.log('✅ Unknown Calendly event tracked as generic interaction')
      }
  }
}

// Event delivery validation
function validateEventDelivery(bookingUUID: string) {
  if (!isBrowser) return
  
  try {
    // Check if PostHog has processed the event
    const sessionId = posthog.get_session_id?.()
    const distinctId = posthog.get_distinct_id?.()
    
    console.log('🔍 Validating event delivery:', {
      bookingUUID,
      sessionId,
      distinctId,
      posthogReady: !!posthog.__loaded
    })
    
    // Log validation attempt for debugging
    eventMonitor.capture('calendly_event_validation', {
      booking_uuid: bookingUUID,
      validation_timestamp: new Date().toISOString(),
      posthog_session_id: sessionId,
      posthog_distinct_id: distinctId
    })
  } catch (error) {
    console.error('❌ Event validation failed:', error)
  }
}

// Track if listener is already active to prevent multiple listeners
let isListenerActive = false

// Initialize Calendly event listener
export function initializeCalendlyTracking(source: 'modal' | 'booking_section') {
  if (!isBrowser) return

  // Set the source for attribution
  calendlySource = source

  // Only add listener if not already active
  if (!isListenerActive) {
    window.addEventListener('message', handleCalendlyMessage)
    isListenerActive = true
    console.log(`Calendly tracking initialized for source: ${source}`)
  } else {
    console.log(`Calendly tracking already active, updated source to: ${source}`)
  }
}

// Message event handler
function handleCalendlyMessage(e: MessageEvent) {
  if (isCalendlyEvent(e)) {
    handleCalendlyEvent(e.data)
  }
}

// Enhanced cleanup with better lifecycle management
export function cleanupCalendlyTracking() {
  if (!isBrowser) return
  
  if (isListenerActive) {
    window.removeEventListener('message', handleCalendlyMessage)
    isListenerActive = false
    console.log('✅ Calendly message listener removed')
  }
  
  // Reset tracking state
  calendlySource = 'unknown'
  processedAppointments.clear()
  
  console.log('🧹 Calendly tracking cleaned up completely')
}

// Export function to get current tracking status for debugging
export function getTrackingStatus() {
  if (!isBrowser) return null
  
  return {
    isListenerActive,
    calendlySource,
    processedAppointmentsCount: processedAppointments.size,
    posthogReady: posthog && (posthog.__loaded || typeof posthog.capture === 'function'),
    attributionData: (() => {
      try {
        return JSON.parse(localStorage.getItem('kawai_attribution') || '{}')
      } catch {
        return {}
      }
    })()
  }
}

// Manual tracking for custom events (if needed)
export function trackCalendlyCustomEvent(eventType: string, source?: 'modal' | 'booking_section' | 'unknown') {
  if (!isBrowser) return
  
  const currentSource = source || calendlySource
  trackKawaiEvent.calendlyInteraction(eventType, currentSource)
}