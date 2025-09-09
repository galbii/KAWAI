'use client'

import { captureWithValidation } from './posthog-validation'
import { POSTHOG_CONFIG } from './posthog-config'
import { getCampaignString, getTrafficSource, campaignAttribution } from './campaign-attribution'

export interface CampaignPerformanceData {
  campaign_name: string
  traffic_source: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  event_value?: number
  conversion_type?: string
}

// Track campaign-specific conversions
async function trackCampaignConversion(
  conversionType: 'consultation_booked' | 'piano_viewed' | 'event_info_requested' | 'newsletter_signup',
  additionalData: Record<string, unknown> = {}
) {
  const attribution = campaignAttribution.getCurrentAttribution()
  
  if (!attribution) {
    console.warn('No campaign attribution available for conversion tracking')
    return
  }

  // Map conversion types to values (for ROI calculation)
  const conversionValues = {
    consultation_booked: 100,    // High value - actual lead
    piano_viewed: 10,           // Medium value - interest signal  
    event_info_requested: 25,   // Medium-high value - qualified interest
    newsletter_signup: 5        // Low value - future marketing opportunity
  }

  const performanceData: CampaignPerformanceData = {
    campaign_name: getCampaignString(),
    traffic_source: getTrafficSource(),
    utm_source: attribution.utm_source,
    utm_medium: attribution.utm_medium,
    utm_campaign: attribution.utm_campaign,
    event_value: conversionValues[conversionType],
    conversion_type: conversionType
  }

  // Track campaign conversion event
  return await captureWithValidation(
    'campaign_conversion',
    {
      ...performanceData,
      ...additionalData,
      conversion_timestamp: new Date().toISOString(),
      attribution_age_seconds: Math.floor(
        (Date.now() - new Date(attribution.attribution_timestamp).getTime()) / 1000
      )
    },
    { logValidation: process.env.NODE_ENV === 'development' }
  )
}

// Track campaign performance metrics
async function trackCampaignEngagement(
  engagementType: 'page_view' | 'cta_click' | 'section_view' | 'video_play',
  engagementData: Record<string, unknown> = {}
) {
  const attribution = campaignAttribution.getCurrentAttribution()
  
  if (!attribution) return

  return await captureWithValidation(
    'campaign_engagement',
    {
      campaign_name: getCampaignString(),
      traffic_source: getTrafficSource(),
      utm_source: attribution.utm_source,
      utm_medium: attribution.utm_medium,
      utm_campaign: attribution.utm_campaign,
      engagement_type: engagementType,
      engagement_value: engagementData.value || 1,
      ...engagementData
    }
  )
}

// Enhanced analytics for specific piano business events
export const campaignAnalytics = {
  // Track when user views a piano model with campaign context
  trackPianoView: async (pianoData: {
    model: string
    price: string
    category: string
    source: string
  }) => {
    await trackCampaignConversion('piano_viewed', {
      piano_model: pianoData.model,
      piano_price: pianoData.price,
      piano_category: pianoData.category,
      piano_source_section: pianoData.source
    })
    
    await trackCampaignEngagement('cta_click', {
      cta_type: 'piano_view',
      piano_model: pianoData.model,
      value: 10
    })
  },

  // Track consultation booking with campaign ROI data
  trackConsultationBooked: async (bookingData: {
    source: string
    calendlyStatus: string
  }) => {
    await trackCampaignConversion('consultation_booked', {
      booking_source: bookingData.source,
      booking_status: bookingData.calendlyStatus,
      high_value_conversion: true
    })

    // Also track as separate high-value event
    return await captureWithValidation(
      POSTHOG_CONFIG.EVENTS.CONSULTATION_BOOKING_ATTEMPT,
      {
        booking_source: bookingData.source === 'hero' ? 'modal' : 'booking_section',
        calendly_status: bookingData.calendlyStatus,
        campaign_attribution: getCampaignString(),
        traffic_source: getTrafficSource(),
        high_value_lead: true
      }
    )
  },

  // Track event information requests with campaign data
  trackEventInfoRequested: async (requestData: {
    source: string
    eventDates: string
    location: string
  }) => {
    await trackCampaignConversion('event_info_requested', {
      request_source: requestData.source,
      event_dates: requestData.eventDates,
      event_location: requestData.location
    })
  },

  // Track newsletter signups with campaign attribution
  trackNewsletterSignup: async (signupData: {
    source: string
    email?: string
  }) => {
    await trackCampaignConversion('newsletter_signup', {
      signup_source: signupData.source,
      has_email: !!signupData.email
    })
  }
}

// Campaign performance analysis helpers
export const campaignReporting = {
  // Get campaign summary for current session
  getCampaignSummary: () => {
    const attribution = campaignAttribution.getCurrentAttribution()
    
    if (!attribution) {
      return {
        campaign: 'unknown',
        source: 'direct',
        medium: 'none',
        isNewVisitor: true
      }
    }

    return {
      campaign: getCampaignString(),
      source: attribution.utm_source || attribution.traffic_source,
      medium: attribution.utm_medium || 'unknown',
      content: attribution.utm_content,
      term: attribution.utm_term,
      isNewVisitor: attribution.is_first_visit,
      referrer: attribution.referrer_domain,
      sessionEntry: attribution.session_entry_page,
      attributionAge: Math.floor(
        (Date.now() - new Date(attribution.attribution_timestamp).getTime()) / 1000
      )
    }
  },

  // Debug campaign performance data
  debugCampaignData: () => {
    if (process.env.NODE_ENV === 'development') {
      console.group('Campaign Performance Debug')
      console.log('Campaign Summary:', campaignReporting.getCampaignSummary())
      console.log('Attribution:', campaignAttribution.getCurrentAttribution())
      console.log('Campaign String:', getCampaignString())
      console.log('Traffic Source:', getTrafficSource())
      console.groupEnd()
    }
  }
}

// Expose utilities for development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as Record<string, unknown>).campaignPerformance = {
    trackConversion: trackCampaignConversion,
    trackEngagement: trackCampaignEngagement,
    analytics: campaignAnalytics,
    reporting: campaignReporting
  }
}

export {
  trackCampaignConversion,
  trackCampaignEngagement
}