import { PostHog } from 'posthog-node'
import { validateEventProperties, type EventTrackingResponse } from './posthog-validation'
import { POSTHOG_CONFIG } from './posthog-config'

// Server-side PostHog client
let serverPostHog: PostHog | null = null

function initServerPostHog(): PostHog | null {
  if (serverPostHog) {
    return serverPostHog
  }

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.posthog.com'

  if (!apiKey) {
    console.warn('PostHog server-side tracking disabled: NEXT_PUBLIC_POSTHOG_KEY not found')
    return null
  }

  try {
    serverPostHog = new PostHog(apiKey, {
      host,
      // Optimized for serverless/Next.js
      flushAt: 1,        // Immediate flush for short-lived functions
      flushInterval: 0,  // Don't wait for batch
      // Disable features that don't work server-side
      disableGeoip: false,
      // Enhanced privacy and compliance
    })

    console.log('PostHog server-side client initialized')
    return serverPostHog
  } catch (error) {
    console.error('Failed to initialize PostHog server-side client:', error)
    return null
  }
}

export interface ServerEventTrackingOptions {
  skipValidation?: boolean
  logValidation?: boolean
  distinctId?: string
  userProperties?: Record<string, unknown>
}

// Server-side event capture with validation
export async function captureServerEvent(
  eventName: string,
  properties: Record<string, unknown> = {},
  options: ServerEventTrackingOptions = {}
): Promise<EventTrackingResponse> {
  const timestamp = new Date().toISOString()
  const client = initServerPostHog()

  try {
    // Validate properties unless explicitly skipped
    let validation = {
      isValid: true,
      errors: [] as string[],
      warnings: [] as string[],
      sanitizedProperties: properties
    }

    if (!options.skipValidation) {
      validation = validateEventProperties(eventName, properties)
      
      if (options.logValidation && (validation.errors.length > 0 || validation.warnings.length > 0)) {
        console.group(`PostHog Server Event Validation: ${eventName}`)
        if (validation.errors.length > 0) {
          console.error('Validation Errors:', validation.errors)
        }
        if (validation.warnings.length > 0) {
          console.warn('Validation Warnings:', validation.warnings)
        }
        console.groupEnd()
      }
    }

    // Add server-side meta information
    const enhancedProperties = {
      ...validation.sanitizedProperties,
      $timestamp: timestamp,
      $source: 'kawai_landing_page_server',
      $validation_passed: validation.isValid,
      $server_side: true,
      $environment: process.env.NODE_ENV || 'unknown'
    }

    // Capture event with PostHog server client
    if (client) {
      const distinctId = options.distinctId || `server_${Date.now()}`
      
      // Set user properties if provided
      if (options.userProperties && Object.keys(options.userProperties).length > 0) {
        client.identify({
          distinctId,
          properties: {
            ...options.userProperties,
            $identified_server_side: true,
            $first_identified: timestamp
          }
        })
      }

      // Capture the event
      client.capture({
        distinctId,
        event: eventName,
        properties: enhancedProperties
      })

      // Ensure immediate flush for serverless environments
      await client.flush()

      console.log(`PostHog server event captured: ${eventName}`, {
        distinctId,
        propertiesCount: Object.keys(enhancedProperties).length,
        validationPassed: validation.isValid
      })

      return {
        success: true,
        eventId: `${eventName}_${Date.now()}`,
        timestamp,
        validation
      }
    } else {
      console.warn('PostHog server client not available - event not captured:', eventName)
      return {
        success: false,
        timestamp,
        validation: {
          ...validation,
          errors: [...validation.errors, 'PostHog server client not initialized']
        }
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error'
    console.error('PostHog server capture error:', errorMessage, { eventName, properties })
    
    return {
      success: false,
      timestamp,
      validation: {
        isValid: false,
        errors: [errorMessage],
        warnings: [],
        sanitizedProperties: properties
      }
    }
  }
}

// Calendly-specific booking tracking
export async function trackCalendlyAppointment(bookingData: {
  bookingId: string
  name: string
  email: string
  phone?: string
  startTime: string
  endTime?: string
  eventType: string
  location?: string
  additionalNotes?: string
  uid?: string
  bookingSource?: 'modal' | 'booking_section' | 'direct'
}): Promise<EventTrackingResponse> {
  
  // Calculate appointment duration
  let durationMinutes: number | undefined
  if (bookingData.startTime && bookingData.endTime) {
    try {
      const start = new Date(bookingData.startTime)
      const end = new Date(bookingData.endTime)
      durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60))
    } catch {
      durationMinutes = undefined
    }
  }

  // Calculate lead score based on booking data
  const leadScore = calculateBookingLeadScore({
    hasPhone: !!bookingData.phone,
    hasNotes: !!bookingData.additionalNotes,
    eventType: bookingData.eventType,
    advanceBookingDays: calculateAdvanceBookingDays(bookingData.startTime)
  })

  const eventProperties = {
    booking_id: bookingData.bookingId,
    invitee_name: bookingData.name,
    invitee_email: bookingData.email,
    invitee_phone: bookingData.phone || undefined,
    event_type_name: bookingData.eventType,
    scheduled_time: bookingData.startTime,
    duration_minutes: durationMinutes,
    location_type: bookingData.location,
    booking_source: bookingData.bookingSource || 'direct',
    calendly_event_type: bookingData.eventType,
    additional_notes: bookingData.additionalNotes,
    lead_score: leadScore,
    // Additional context
    booking_uid: bookingData.uid,
    booked_at: new Date().toISOString(),
    advance_booking_days: calculateAdvanceBookingDays(bookingData.startTime)
  }

  const userProperties = {
    email: bookingData.email,
    name: bookingData.name,
    phone: bookingData.phone,
    latest_booking_type: bookingData.eventType,
    consultation_booked: true,
    lead_score: leadScore,
    booking_count: 1, // This could be enhanced to track multiple bookings
    first_booking_date: bookingData.startTime
  }

  return captureServerEvent(
    POSTHOG_CONFIG.EVENTS.CALENDLY_APPOINTMENT_BOOKED,
    eventProperties,
    {
      distinctId: bookingData.email, // Use email as distinct ID for proper user tracking
      userProperties,
      logValidation: true
    }
  )
}

// Helper function to calculate lead score for bookings
function calculateBookingLeadScore(data: {
  hasPhone: boolean
  hasNotes: boolean
  eventType: string
  advanceBookingDays: number
}): number {
  let score = 50 // Base score for booking

  // Phone number provided (shows higher intent)
  if (data.hasPhone) score += 15

  // Additional notes provided (shows engagement)
  if (data.hasNotes) score += 10

  // Event type scoring
  if (data.eventType.toLowerCase().includes('consultation')) score += 20
  if (data.eventType.toLowerCase().includes('private')) score += 10

  // Advance booking time (planned vs urgent)
  if (data.advanceBookingDays > 7) score += 15
  else if (data.advanceBookingDays > 3) score += 10
  else if (data.advanceBookingDays > 1) score += 5

  return Math.min(score, 100)
}

// Helper function to calculate days between now and booking
function calculateAdvanceBookingDays(scheduledTime: string): number {
  try {
    const scheduled = new Date(scheduledTime)
    const now = new Date()
    const diffTime = scheduled.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  } catch {
    return 0
  }
}

// Shutdown function for graceful cleanup
export async function shutdownServerPostHog(): Promise<void> {
  if (serverPostHog) {
    try {
      // Flush any pending events
      await serverPostHog.flush()
      // Shutdown the client
      await serverPostHog.shutdown()
      serverPostHog = null
      console.log('PostHog server client shut down gracefully')
    } catch (error) {
      console.error('Error during PostHog server shutdown:', error)
      serverPostHog = null
    }
  }
}

// Utility function for Next.js API routes to ensure proper cleanup
export function withPostHogCleanup<T extends unknown[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await handler(...args)
    } finally {
      // Always attempt cleanup after API route execution
      await shutdownServerPostHog()
    }
  }
}

// Export the server client for direct use if needed
export { serverPostHog }

const postHogServerExports = {
  captureServerEvent,
  trackCalendlyAppointment,
  shutdownServerPostHog
}

export default postHogServerExports