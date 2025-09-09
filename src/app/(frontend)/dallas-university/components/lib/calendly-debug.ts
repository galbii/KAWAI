'use client'

import { getTrackingStatus } from './calendly-tracking'

// Debug utilities for Calendly tracking
export const CalendlyDebug = {
  // Log current tracking status to console
  logStatus() {
    if (typeof window === 'undefined') {
      console.warn('CalendlyDebug: Not available on server side')
      return
    }

    const status = getTrackingStatus()
    console.group('🔍 Calendly Tracking Status')
    console.log('Listener Active:', status?.isListenerActive)
    console.log('Current Source:', status?.calendlySource)
    console.log('Processed Appointments:', status?.processedAppointmentsCount)
    console.log('PostHog Ready:', status?.posthogReady)
    console.log('Attribution Data:', status?.attributionData)
    console.groupEnd()
    
    return status
  },

  // Get attribution data from storage
  getAttributionData() {
    if (typeof window === 'undefined') return null
    
    try {
      const primary = JSON.parse(localStorage.getItem('kawai_attribution') || '{}')
      const backup = JSON.parse(sessionStorage.getItem('kawai_attribution_backup') || '{}')
      const legacy = {
        source: localStorage.getItem('kawai_last_booking_source'),
        timestamp: localStorage.getItem('kawai_last_booking_time')
      }
      
      return { primary, backup, legacy }
    } catch (error) {
      console.error('Failed to get attribution data:', error)
      return null
    }
  },

  // Clear all attribution data (for testing)
  clearAttributionData() {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem('kawai_attribution')
    sessionStorage.removeItem('kawai_attribution_backup')
    localStorage.removeItem('kawai_last_booking_source')
    localStorage.removeItem('kawai_last_booking_time')
    
    console.log('✅ All attribution data cleared')
  },

  // Simulate a Calendly event for testing
  simulateEvent(eventType: 'profile_page_viewed' | 'event_type_viewed' | 'date_and_time_selected' | 'invitee_scheduled', mockPayload?: Record<string, unknown>) {
    if (typeof window === 'undefined') return
    
    const mockEvent = {
      event: `calendly.${eventType}`,
      payload: mockPayload || {}
    }
    
    console.log('🧪 Simulating Calendly event:', mockEvent)
    
    // Dispatch a fake postMessage event
    window.postMessage(mockEvent, window.location.origin)
  },

  // Monitor PostHog events for a period of time
  monitorPostHogEvents(durationMs = 10000) {
    if (typeof window === 'undefined' || !window.posthog) {
      console.warn('PostHog not available for monitoring')
      return
    }

    const originalCapture = window.posthog.capture
    const capturedEvents: Array<{ event: string, properties: Record<string, unknown>, timestamp: Date }> = []
    
    // Override capture method to log events
    window.posthog.capture = function(event: string, properties?: Record<string, unknown>) {
      capturedEvents.push({
        event,
        properties: properties || {},
        timestamp: new Date()
      })
      
      console.log('📊 PostHog Event Captured:', { event, properties })
      
      // Call original method
      return originalCapture.call(this, event, properties)
    }
    
    console.log(`🔍 Monitoring PostHog events for ${durationMs}ms...`)
    
    // Restore original method after monitoring period
    setTimeout(() => {
      window.posthog.capture = originalCapture
      console.group('📊 PostHog Monitoring Results')
      console.log(`Captured ${capturedEvents.length} events:`)
      capturedEvents.forEach(({ event, properties, timestamp }) => {
        console.log(`- ${timestamp.toISOString()}: ${event}`, properties)
      })
      console.groupEnd()
    }, durationMs)
    
    return capturedEvents
  }
}

// Make available globally for easy debugging in browser console
if (typeof window !== 'undefined') {
  ;(window as Record<string, unknown>).CalendlyDebug = CalendlyDebug
  console.log('🔧 CalendlyDebug available globally. Try: CalendlyDebug.logStatus()')
}