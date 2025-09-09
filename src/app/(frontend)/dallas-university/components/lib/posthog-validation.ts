'use client'

import posthog from 'posthog-js'
import { POSTHOG_CONFIG } from './posthog-config'
import { getAttributionForEvent } from './campaign-attribution'

export interface PostHogEventValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  sanitizedProperties: Record<string, unknown>
}

export interface EventTrackingResponse {
  success: boolean
  eventId?: string
  timestamp: string
  validation: PostHogEventValidation
}

// Campaign properties schema - common to all events
const CAMPAIGN_PROPERTIES_SCHEMA = {
  campaign_id: { type: 'string', required: false, maxLength: 100 },
  partner: { type: 'string', required: false, maxLength: 50 },
  event_context: { type: 'string', required: false, maxLength: 100 },
  page_variant: { type: 'string', required: false, maxLength: 50 },
  target_audience: { type: 'string', required: false, maxLength: 50 },
  campaign_type: { type: 'string', required: false, enum: ['university_partnership', 'direct_marketing'] },
  university: { type: 'string', required: false, maxLength: 200 },
  program_focus: { type: 'string', required: false, maxLength: 100 },
  // UTM equivalent properties
  utm_source: { type: 'string', required: false, maxLength: 100 },
  utm_medium: { type: 'string', required: false, maxLength: 100 },
  utm_campaign: { type: 'string', required: false, maxLength: 100 },
  utm_content: { type: 'string', required: false, maxLength: 100 },
  utm_term: { type: 'string', required: false, maxLength: 100 }
}

// Event property validation schemas
const PIANO_MODEL_SCHEMA = {
  model_name: { type: 'string', required: true, maxLength: 100 },
  model_price: { type: 'string', required: true, pattern: /^\$[\d,]+$/ },
  model_category: { type: 'string', required: true, enum: ['Digital', 'Acoustic', 'Hybrid'] },
  time_spent_seconds: { type: 'number', required: false, min: 0, max: 3600 },
  source_section: { type: 'string', required: true, maxLength: 100 }, // Increased for campaign-enhanced sections
  interaction_type: { type: 'string', required: false, enum: ['view', 'compare', 'calculate_payment'] },
  ...CAMPAIGN_PROPERTIES_SCHEMA
}

const CONSULTATION_INTENT_SCHEMA = {
  trigger_source: { type: 'string', required: true, enum: ['hero_cta', 'gallery_cta', 'booking_section', 'exit_intent'] },
  models_viewed_count: { type: 'number', required: true, min: 0, max: 50 },
  session_duration_seconds: { type: 'number', required: true, min: 0, max: 86400 },
  engagement_score: { type: 'number', required: true, min: 0, max: 100 },
  time_to_intent_seconds: { type: 'number', required: true, min: 0, max: 86400 },
  high_intent: { type: 'boolean', required: false },
  ...CAMPAIGN_PROPERTIES_SCHEMA
}

const BOOKING_ATTEMPT_SCHEMA = {
  booking_source: { type: 'string', required: true, enum: ['modal', 'booking_section'] },
  calendly_status: { type: 'string', required: true, enum: ['opened', 'time_selected', 'completed', 'abandoned'] },
  abandonment_stage: { type: 'string', required: false, maxLength: 50 },
  session_quality: { type: 'number', required: false, min: 0, max: 100 },
  user_type: { type: 'string', required: false, enum: ['new', 'returning'] },
  models_viewed_count: { type: 'number', required: false, min: 0, max: 50 },
  total_interactions: { type: 'number', required: false, min: 0, max: 100 },
  ...CAMPAIGN_PROPERTIES_SCHEMA
}

const EVENT_ATTENDANCE_SCHEMA = {
  event_dates: { type: 'string', required: true, maxLength: 100 },
  event_location: { type: 'string', required: true, maxLength: 100 },
  interaction_type: { type: 'string', required: true, enum: ['view', 'save_date', 'directions'] },
  timezone: { type: 'string', required: false, maxLength: 50 },
  ...CAMPAIGN_PROPERTIES_SCHEMA
}

const CALENDLY_APPOINTMENT_SCHEMA = {
  booking_id: { type: 'string', required: true, maxLength: 100 },
  invitee_name: { type: 'string', required: true, maxLength: 100 },
  invitee_email: { type: 'string', required: true, maxLength: 200 },
  invitee_phone: { type: 'string', required: false, maxLength: 20 },
  event_type_name: { type: 'string', required: true, maxLength: 100 },
  scheduled_time: { type: 'string', required: true, maxLength: 50 },
  duration_minutes: { type: 'number', required: false, min: 1, max: 480 },
  location_type: { type: 'string', required: false, maxLength: 50 },
  booking_source: { type: 'string', required: false, enum: ['modal', 'booking_section', 'direct'] },
  calendly_event_type: { type: 'string', required: false, maxLength: 100 },
  additional_notes: { type: 'string', required: false, maxLength: 500 },
  lead_score: { type: 'number', required: false, min: 0, max: 100 },
  ...CAMPAIGN_PROPERTIES_SCHEMA
}

const EVENT_SCHEMAS: Record<string, Record<string, unknown>> = {
  [POSTHOG_CONFIG.EVENTS.PIANO_MODEL_VIEWED]: PIANO_MODEL_SCHEMA,
  [POSTHOG_CONFIG.EVENTS.CONSULTATION_INTENT_SIGNAL]: CONSULTATION_INTENT_SCHEMA,
  [POSTHOG_CONFIG.EVENTS.CONSULTATION_BOOKING_ATTEMPT]: BOOKING_ATTEMPT_SCHEMA,
  [POSTHOG_CONFIG.EVENTS.KAWAI_EVENT_INTEREST]: EVENT_ATTENDANCE_SCHEMA,
  [POSTHOG_CONFIG.EVENTS.CALENDLY_APPOINTMENT_BOOKED]: CALENDLY_APPOINTMENT_SCHEMA
}

// Validation functions
function validateProperty(value: unknown, schema: Record<string, unknown>, propertyName: string): { isValid: boolean; errors: string[]; sanitizedValue: unknown } {
  const errors: string[] = []
  let sanitizedValue = value

  // Check if required
  if (schema.required && (value === undefined || value === null || value === '')) {
    errors.push(`Property '${propertyName}' is required`)
    return { isValid: false, errors, sanitizedValue }
  }

  // Skip validation if optional and empty
  if (!schema.required && (value === undefined || value === null || value === '')) {
    return { isValid: true, errors: [], sanitizedValue: null }
  }

  // Type validation
  if (schema.type === 'string' && typeof value !== 'string') {
    sanitizedValue = String(value)
  } else if (schema.type === 'number') {
    if (typeof value === 'string') {
      const parsed = parseFloat(value)
      if (isNaN(parsed)) {
        errors.push(`Property '${propertyName}' must be a valid number`)
        return { isValid: false, errors, sanitizedValue }
      }
      sanitizedValue = parsed
    } else if (typeof value !== 'number') {
      errors.push(`Property '${propertyName}' must be a number`)
      return { isValid: false, errors, sanitizedValue }
    }
  } else if (schema.type === 'boolean' && typeof value !== 'boolean') {
    sanitizedValue = Boolean(value)
  }

  // String validations
  if (schema.type === 'string' && typeof sanitizedValue === 'string') {
    if (typeof schema.maxLength === 'number' && sanitizedValue.length > schema.maxLength) {
      errors.push(`Property '${propertyName}' exceeds maximum length of ${schema.maxLength}`)
      sanitizedValue = sanitizedValue.substring(0, schema.maxLength as number)
    }
    
    if (schema.pattern instanceof RegExp && !schema.pattern.test(sanitizedValue as string)) {
      errors.push(`Property '${propertyName}' does not match required pattern`)
    }
    
    if (Array.isArray(schema.enum) && !schema.enum.includes(sanitizedValue)) {
      errors.push(`Property '${propertyName}' must be one of: ${schema.enum.join(', ')}`)
    }
  }

  // Number validations
  if (schema.type === 'number' && typeof sanitizedValue === 'number') {
    if (typeof schema.min === 'number' && (sanitizedValue as number) < schema.min) {
      errors.push(`Property '${propertyName}' must be at least ${schema.min}`)
      sanitizedValue = schema.min
    }
    
    if (typeof schema.max === 'number' && (sanitizedValue as number) > schema.max) {
      errors.push(`Property '${propertyName}' must be at most ${schema.max}`)
      sanitizedValue = schema.max
    }
  }

  return { isValid: errors.length === 0, errors, sanitizedValue }
}

export function validateEventProperties(eventName: string, properties: Record<string, unknown>): PostHogEventValidation {
  const schema = EVENT_SCHEMAS[eventName]
  const errors: string[] = []
  const warnings: string[] = []
  const sanitizedProperties: Record<string, unknown> = {}

  if (!schema) {
    warnings.push(`No validation schema found for event '${eventName}' - proceeding without validation`)
    return {
      isValid: true,
      errors: [],
      warnings,
      sanitizedProperties: properties
    }
  }

  // Validate each property in the schema
  for (const [propName, propSchema] of Object.entries(schema)) {
    const validation = validateProperty(properties[propName], propSchema as Record<string, unknown>, propName)
    
    if (!validation.isValid) {
      errors.push(...validation.errors)
    }
    
    if (validation.sanitizedValue !== null && validation.sanitizedValue !== undefined) {
      sanitizedProperties[propName] = validation.sanitizedValue
    }
  }

  // Check for unexpected properties
  for (const propName of Object.keys(properties)) {
    if (!schema[propName]) {
      warnings.push(`Unexpected property '${propName}' in event '${eventName}'`)
      sanitizedProperties[propName] = properties[propName] // Keep unexpected properties
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    sanitizedProperties
  }
}

// Enhanced capture function with validation and error handling
export async function captureWithValidation(
  eventName: string, 
  properties: Record<string, unknown> = {},
  options: {
    skipValidation?: boolean
    logValidation?: boolean
    fallbackToGA?: boolean
  } = {}
): Promise<EventTrackingResponse> {
  const timestamp = new Date().toISOString()
  
  try {
    let validation: PostHogEventValidation = {
      isValid: true,
      errors: [],
      warnings: [],
      sanitizedProperties: properties
    }

    // Validate properties unless explicitly skipped
    if (!options.skipValidation) {
      validation = validateEventProperties(eventName, properties)
      
      if (options.logValidation && (validation.errors.length > 0 || validation.warnings.length > 0)) {
        console.group(`PostHog Event Validation: ${eventName}`)
        if (validation.errors.length > 0) {
          console.error('Validation Errors:', validation.errors)
        }
        if (validation.warnings.length > 0) {
          console.warn('Validation Warnings:', validation.warnings)
        }
        console.groupEnd()
      }
    }

    // Add meta information to properties
    const enhancedProperties = {
      ...validation.sanitizedProperties,
      $timestamp: timestamp,
      $source: 'kawai_landing_page',
      $validation_passed: validation.isValid,
      $session_id: typeof window !== 'undefined' ? (posthog.sessionRecording as any)?.sessionId : undefined,
      $page_url: typeof window !== 'undefined' ? window.location.href : undefined,
      $user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      
      // Campaign Attribution - Always use original attribution for campaign analysis
      ...getAttributionForEvent(true)
    }

    // Capture event with PostHog
    if (typeof window !== 'undefined' && posthog) {
      posthog.capture(eventName, enhancedProperties)
      
      return {
        success: true,
        eventId: `${eventName}_${Date.now()}`,
        timestamp,
        validation
      }
    } else {
      console.warn('PostHog not available - event not captured:', eventName)
      return {
        success: false,
        timestamp,
        validation: {
          ...validation,
          errors: [...validation.errors, 'PostHog not initialized']
        }
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('PostHog capture error:', errorMessage, { eventName, properties })
    
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

// Debug function to check PostHog status
export function debugPostHogStatus(): void {
  if (typeof window === 'undefined') {
    console.log('PostHog Debug: Running server-side, PostHog not available')
    return
  }

  console.group('PostHog Debug Status')
  console.log('PostHog available:', !!window.posthog)
  console.log('PostHog loaded:', !!posthog)
  
  if (posthog) {
    console.log('PostHog config:', {
      api_host: posthog.config?.api_host,
      loaded: posthog.config?.loaded,
      debug: posthog.config?.debug
    })
    console.log('Session recording:', {
      sessionId: (posthog.sessionRecording as any)?.sessionId
    })
    console.log('Distinct ID:', posthog.get_distinct_id?.())
  }
  console.groupEnd()
}

// Event testing function for development
export async function testEventCapture(): Promise<void> {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('Event testing only available in development mode')
    return
  }

  console.group('PostHog Event Testing')
  
  // Test piano model viewed event
  const pianoEvent = await captureWithValidation(
    POSTHOG_CONFIG.EVENTS.PIANO_MODEL_VIEWED,
    {
      model_name: 'ES120',
      model_price: '$949',
      model_category: 'Digital',
      time_spent_seconds: 45,
      source_section: 'test_section',
      interaction_type: 'view'
    },
    { logValidation: true }
  )
  console.log('Piano Event Result:', pianoEvent)

  // Test consultation intent event
  const consultationEvent = await captureWithValidation(
    POSTHOG_CONFIG.EVENTS.CONSULTATION_INTENT_SIGNAL,
    {
      trigger_source: 'hero_cta',
      models_viewed_count: 2,
      session_duration_seconds: 120,
      engagement_score: 85,
      time_to_intent_seconds: 30,
      high_intent: true
    },
    { logValidation: true }
  )
  console.log('Consultation Event Result:', consultationEvent)

  // Test invalid event (should show validation errors)
  const invalidEvent = await captureWithValidation(
    POSTHOG_CONFIG.EVENTS.CONSULTATION_BOOKING_ATTEMPT,
    {
      booking_source: 'invalid_source', // Invalid enum value
      calendly_status: 'opened',
      session_quality: 150 // Over maximum
    },
    { logValidation: true }
  )
  console.log('Invalid Event Result (should have errors):', invalidEvent)

  // Test UTD campaign event
  const utdCampaignEvent = await captureWithValidation(
    POSTHOG_CONFIG.EVENTS.PIANO_MODEL_VIEWED,
    {
      model_name: 'CA99',
      model_price: '$4,799',
      model_category: 'Digital',
      time_spent_seconds: 60,
      source_section: 'university-dallas:gallery',
      interaction_type: 'view',
      // Campaign properties
      campaign_id: 'utd-partnership-2025',
      partner: 'UTD',
      event_context: 'university_partnership',
      page_variant: 'university-dallas',
      target_audience: 'students_faculty',
      campaign_type: 'university_partnership',
      university: 'University of Texas at Dallas',
      program_focus: 'music_education',
      utm_source: 'utd',
      utm_medium: 'partnership',
      utm_campaign: 'utd-partnership-2025',
      utm_content: 'university-dallas',
      utm_term: 'students_faculty'
    },
    { logValidation: true }
  )
  console.log('UTD Campaign Event Result:', utdCampaignEvent)

  console.groupEnd()
}

// Real-time event monitoring for debugging
export class PostHogEventMonitor {
  private events: Array<{ eventName: string; properties: Record<string, unknown>; timestamp: string; validation: PostHogEventValidation }> = []
  private maxEvents = 100

  capture(eventName: string, properties: Record<string, unknown>): Promise<EventTrackingResponse> {
    const result = captureWithValidation(eventName, properties, { logValidation: true })
    
    result.then(response => {
      this.events.push({
        eventName,
        properties: response.validation.sanitizedProperties,
        timestamp: response.timestamp,
        validation: response.validation
      })

      // Keep only last maxEvents
      if (this.events.length > this.maxEvents) {
        this.events = this.events.slice(-this.maxEvents)
      }
    })

    return result
  }

  getEvents(): Array<{ eventName: string; properties: Record<string, unknown>; timestamp: string; validation: PostHogEventValidation }> {
    return [...this.events]
  }

  getEventsByType(eventName: string) {
    return this.events.filter(event => event.eventName === eventName)
  }

  getValidationErrors(): Array<{ eventName: string; errors: string[]; timestamp: string }> {
    return this.events
      .filter(event => !event.validation.isValid)
      .map(event => ({
        eventName: event.eventName,
        errors: event.validation.errors,
        timestamp: event.timestamp
      }))
  }

  clearEvents(): void {
    this.events = []
  }

  printSummary(): void {
    console.group('PostHog Event Monitor Summary')
    console.log(`Total events captured: ${this.events.length}`)
    
    const eventTypes = [...new Set(this.events.map(e => e.eventName))]
    console.log('Event types:', eventTypes)
    
    const errorCount = this.getValidationErrors().length
    console.log(`Events with validation errors: ${errorCount}`)
    
    if (errorCount > 0) {
      console.log('Recent validation errors:', this.getValidationErrors().slice(-5))
    }
    
    console.groupEnd()
  }
}

// Global monitor instance for development
export const eventMonitor = new PostHogEventMonitor()

// Development helper to expose debugging functions globally
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as Record<string, unknown>).postHogDebug = {
    status: debugPostHogStatus,
    testEvents: testEventCapture,
    monitor: eventMonitor,
    validateEvent: validateEventProperties,
    captureWithValidation
  }
}

const postHogValidation = {
  captureWithValidation,
  validateEventProperties,
  debugPostHogStatus,
  testEventCapture,
  eventMonitor
}

export default postHogValidation