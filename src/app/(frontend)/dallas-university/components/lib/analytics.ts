'use client'

import { sendGAEvent } from '@next/third-parties/google'
import { postHogAnalytics } from './posthog'
import { eventMonitor } from './posthog-validation'
import { POSTHOG_CONFIG } from './posthog-config'
import { campaignAnalytics } from './campaign-performance'

// Check if running in browser
const isBrowser = typeof window !== 'undefined'

// Type for pixel parameters
type PixelParameters = Record<string, string | number | boolean>

// Meta Pixel helper function with enhanced debugging
function trackMetaPixel(eventName: string, parameters?: PixelParameters) {
  if (!isBrowser || typeof window.fbq !== 'function') {
    console.warn('Meta Pixel not available:', { isBrowser, fbqExists: typeof window?.fbq })
    return
  }
  
  try {
    // Clean parameters to ensure Meta Pixel compatibility
    const cleanParameters = parameters ? {
      ...parameters,
      // Ensure value is a number if present
      ...(parameters.value && { value: Number(parameters.value) }),
      // Ensure currency is a string if present
      ...(parameters.currency && { currency: String(parameters.currency) })
    } : undefined
    
    console.log('Meta Pixel tracking:', eventName, cleanParameters)
    window.fbq('track', eventName, cleanParameters)
  } catch (error) {
    console.error('Meta Pixel tracking error:', error, { eventName, parameters })
  }
}

// Google Ads conversion tracking helper function
function trackGoogleAdsConversion(conversionLabel?: string) {
  if (!isBrowser || typeof window.gtag !== 'function') return
  
  try {
    window.gtag('event', 'conversion', {
      'send_to': `AW-755074614${conversionLabel ? `/${conversionLabel}` : ''}`,
      'value': 1.0,
      'currency': 'USD'
    })
  } catch (error) {
    console.warn('Google Ads conversion tracking error:', error)
  }
}

// Global functions are declared elsewhere in Next.js types

// Enhanced demographic tracking utilities
export const trackDemographics = {
  // Enable Google Analytics enhanced demographic data collection
  enableGoogleDemographics: () => {
    if (!isBrowser || typeof window.gtag !== 'function') return
    
    // Enable Google Signals for demographic data
    window.gtag('config', 'G-P91EKWK0XB', {
      'allow_google_signals': true,
      'allow_ad_personalization_signals': true
    })
    
    console.log('Google Analytics demographics enabled')
  },

  // Meta Pixel Advanced Matching - enhances demographic targeting
  enhanceMetaMatching: (userData?: {
    email?: string
    firstName?: string
    lastName?: string
    phone?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
    gender?: 'f' | 'm'
    birthDate?: string // Format: YYYYMMDD
  }) => {
    if (!isBrowser || typeof window.fbq !== 'function' || !userData) return
    
    try {
      // Meta Pixel automatically hashes this data for privacy
      const advancedMatchingData: Record<string, string> = {}
      
      if (userData.email) advancedMatchingData.em = userData.email.toLowerCase()
      if (userData.firstName) advancedMatchingData.fn = userData.firstName.toLowerCase()
      if (userData.lastName) advancedMatchingData.ln = userData.lastName.toLowerCase()
      if (userData.phone) advancedMatchingData.ph = userData.phone.replace(/\D/g, '') // digits only
      if (userData.city) advancedMatchingData.ct = userData.city.toLowerCase().replace(/\s/g, '')
      if (userData.state) advancedMatchingData.st = userData.state.toLowerCase()
      if (userData.zipCode) advancedMatchingData.zp = userData.zipCode
      if (userData.country) advancedMatchingData.country = userData.country.toLowerCase()
      if (userData.gender) advancedMatchingData.ge = userData.gender
      if (userData.birthDate) advancedMatchingData.db = userData.birthDate
      
      // Re-initialize pixel with advanced matching
      window.fbq('init', '783258114117252', advancedMatchingData)
      
      console.log('Meta Pixel advanced matching enhanced')
    } catch (error) {
      console.error('Meta advanced matching error:', error)
    }
  },

  // Set Google Analytics user properties for segmentation
  setUserSegment: (properties: {
    customer_type?: 'first_time' | 'returning' | 'vip'
    engagement_level?: 'low' | 'medium' | 'high'
    piano_interest?: 'digital' | 'acoustic' | 'both'
    budget_range?: 'budget' | 'mid_range' | 'premium'
    experience_level?: 'beginner' | 'intermediate' | 'advanced'
  }) => {
    if (!isBrowser || typeof window.gtag !== 'function') return
    
    window.gtag('set', 'user_properties', {
      customer_type: properties.customer_type,
      engagement_level: properties.engagement_level,
      piano_interest: properties.piano_interest,
      budget_range: properties.budget_range,
      experience_level: properties.experience_level
    })
    
    console.log('User segment properties set:', properties)
  },

  // PostHog demographic and person properties tracking
  setPostHogDemographics: (userData?: {
    // Basic identifying info (will trigger person profile creation)
    email?: string
    phone?: string
    name?: string
    
    // Demographic attributes
    age_group?: '18-24' | '25-34' | '35-44' | '45-54' | '55-64' | '65+'
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
    income_range?: 'under_50k' | '50k_75k' | '75k_100k' | '100k_150k' | 'over_150k'
    education?: 'high_school' | 'some_college' | 'college' | 'graduate' | 'post_graduate'
    occupation?: string
    
    // Location (supplements automatic GeoIP data)
    city?: string
    state?: string
    zip_code?: string
    country?: string
    
    // Piano-specific demographics
    musical_experience?: 'none' | 'beginner' | 'intermediate' | 'advanced' | 'professional'
    piano_ownership?: 'none' | 'acoustic' | 'digital' | 'both'
    household_type?: 'single' | 'couple' | 'family_with_children' | 'retired'
    home_type?: 'apartment' | 'house' | 'condo' | 'other'
    
    // Interest and behavioral segments
    piano_budget?: 'under_2k' | '2k_5k' | '5k_10k' | '10k_20k' | 'over_20k'
    purchase_timeline?: 'immediate' | 'within_3_months' | 'within_6_months' | 'over_6_months'
    primary_use?: 'learning' | 'teaching' | 'performance' | 'hobby' | 'family'
    
    // Lead qualification
    consultation_interest?: 'high' | 'medium' | 'low'
    event_attendance_likelihood?: 'definitely' | 'probably' | 'maybe' | 'unlikely'
  }) => {
    if (!isBrowser || !userData) return
    
    try {
      // Import PostHog dynamically if not already available
      import('./posthog').then(({ postHogAnalytics }) => {
        // If we have identifying info, identify the user and set person properties
        if (userData.email || userData.phone) {
          postHogAnalytics.identifyUser({
            email: userData.email,
            phone: userData.phone,
            // Add piano-specific attributes
            pianoPreferences: userData.piano_ownership ? [userData.piano_ownership] : undefined
          })
        }
        
        // Set person properties using PostHog's $set method
        const personProperties: Record<string, unknown> = {}
        
        // Basic demographics
        if (userData.age_group) personProperties.age_group = userData.age_group
        if (userData.gender) personProperties.gender = userData.gender
        if (userData.income_range) personProperties.income_range = userData.income_range
        if (userData.education) personProperties.education_level = userData.education
        if (userData.occupation) personProperties.occupation = userData.occupation
        
        // Location (supplements GeoIP)
        if (userData.city) personProperties.city = userData.city
        if (userData.state) personProperties.state = userData.state
        if (userData.zip_code) personProperties.zip_code = userData.zip_code
        if (userData.country) personProperties.country = userData.country
        
        // Piano-specific demographics
        if (userData.musical_experience) personProperties.musical_experience = userData.musical_experience
        if (userData.piano_ownership) personProperties.current_piano_ownership = userData.piano_ownership
        if (userData.household_type) personProperties.household_type = userData.household_type
        if (userData.home_type) personProperties.home_type = userData.home_type
        
        // Interest and behavioral data
        if (userData.piano_budget) personProperties.piano_budget_range = userData.piano_budget
        if (userData.purchase_timeline) personProperties.purchase_timeline = userData.purchase_timeline
        if (userData.primary_use) personProperties.piano_primary_use = userData.primary_use
        
        // Lead qualification scores
        if (userData.consultation_interest) personProperties.consultation_interest_level = userData.consultation_interest
        if (userData.event_attendance_likelihood) personProperties.event_attendance_likelihood = userData.event_attendance_likelihood
        
        // Set properties using PostHog's setPersonProperties (recommended method)
        if (typeof window !== 'undefined' && window.posthog) {
          window.posthog.setPersonProperties(personProperties)
        }
        
        // Also capture as an event for immediate analysis
        import('./posthog').then(({ default: posthog }) => {
          posthog.capture('demographic_profile_updated', {
            $set: personProperties,
            profile_completeness: Object.keys(personProperties).length,
            data_source: 'user_provided'
          })
        })
        
        console.log('PostHog demographic properties set:', personProperties)
      })
    } catch (error) {
      console.error('PostHog demographic tracking error:', error)
    }
  },

  // Unified demographic tracking across all platforms
  setAllPlatformDemographics: (userData: {
    // Core identifying info
    email?: string
    firstName?: string
    lastName?: string
    phone?: string
    
    // Demographics for all platforms
    age_group?: '18-24' | '25-34' | '35-44' | '45-54' | '55-64' | '65+'
    gender?: 'male' | 'female' | 'other'
    city?: string
    state?: string
    zipCode?: string
    country?: string
    
    // Piano buyer segments
    customer_type?: 'first_time' | 'returning' | 'vip'
    piano_interest?: 'digital' | 'acoustic' | 'both'
    budget_range?: 'budget' | 'mid_range' | 'premium'
    musical_experience?: 'beginner' | 'intermediate' | 'advanced'
  }) => {
    // Google Analytics user properties
    trackDemographics.setUserSegment({
      customer_type: userData.customer_type,
      piano_interest: userData.piano_interest,
      budget_range: userData.budget_range,
      experience_level: userData.musical_experience
    })
    
    // Meta Pixel advanced matching
    trackDemographics.enhanceMetaMatching({
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      city: userData.city,
      state: userData.state,
      zipCode: userData.zipCode,
      country: userData.country,
      gender: userData.gender === 'male' ? 'm' : userData.gender === 'female' ? 'f' : undefined
    })
    
    // PostHog person properties
    trackDemographics.setPostHogDemographics({
      email: userData.email,
      name: userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : undefined,
      phone: userData.phone,
      age_group: userData.age_group,
      gender: userData.gender,
      city: userData.city,
      state: userData.state,
      zip_code: userData.zipCode,
      country: userData.country,
      musical_experience: userData.musical_experience === 'beginner' ? 'beginner' : 
                           userData.musical_experience === 'intermediate' ? 'intermediate' : 
                           userData.musical_experience === 'advanced' ? 'advanced' : undefined,
      piano_budget: userData.budget_range === 'budget' ? 'under_2k' :
                    userData.budget_range === 'mid_range' ? '2k_5k' :
                    userData.budget_range === 'premium' ? 'over_20k' : undefined
    })
    
    console.log('Cross-platform demographic tracking completed')
  }
}

// Analytics tracking utility for button clicks and user interactions
export const trackEvent = {
  // CTA button clicks (using GA4 recommended select_content event)
  buttonClick: (buttonText: string, location: string, additionalData?: Record<string, string | number | boolean>) => {
    if (!isBrowser) return
    sendGAEvent('event', 'select_content', {
      content_type: 'button',
      item_name: buttonText,
      item_category: 'cta_button',
      button_location: location,
      interaction_type: 'button_click',
      ...additionalData
    })
  },

  // Lead generation events (ACTUAL CONVERSIONS ONLY - primarily Calendly appointment scheduling)
  generateLead: (action: string, location: string, additionalData?: Record<string, string | number | boolean>) => {
    if (!isBrowser) return
    
    // IMPORTANT: This function should ONLY be used for actual conversions (Calendly appointment scheduling)
    // All other interactions should use buttonClick() or other engagement tracking functions
    
    console.log('🎯 GA4 Lead Generation Event:', {
      action,
      location,
      value: additionalData?.is_actual_conversion ? 50 : 1,
      additionalData
    })
    
    // Google Analytics - Generate Lead (actual conversion) with enhanced parameters
    sendGAEvent('event', 'generate_lead', {
      currency: 'USD',
      value: additionalData?.is_actual_conversion ? 50 : 1,
      lead_source: location,
      lead_type: 'piano_consultation',
      event_category: 'lead_generation',
      action: action,
      location: location,
      ...additionalData
    })
    
    // Meta Pixel - Enhanced Lead tracking (actual conversion)
    trackMetaPixel('Lead', {
      content_name: action,
      content_category: 'lead_generation',
      content_type: 'consultation',
      source: location,
      value: additionalData?.is_actual_conversion ? 50 : 1,
      currency: 'USD',
      predicted_ltv: additionalData?.is_actual_conversion ? 2000 : 500, // Higher LTV for actual conversions
      ...additionalData
    })
  },

  // Contact interactions (improved GA4 event with better categorization)
  contact: (method: 'phone' | 'email' | 'form', location: string, additionalData?: Record<string, string | number | boolean>) => {
    if (!isBrowser) return
    
    // Google Analytics - using select_content for contact interactions
    sendGAEvent('event', 'select_content', {
      content_type: 'contact_method',
      item_name: `contact_${method}`,
      item_category: 'contact',
      contact_method: method,
      contact_location: location,
      interaction_type: 'contact_initiation',
      ...additionalData
    })
    
    // Meta Pixel - Contact tracking
    trackMetaPixel('Contact', {
      content_name: `contact_${method}`,
      content_category: 'contact',
      content_type: 'customer_service',
      source: location,
      method: method,
      ...additionalData
    })
  },

  // Newsletter signup
  signUp: (location: string, additionalData?: Record<string, string | number | boolean>) => {
    if (!isBrowser) return
    sendGAEvent('event', 'sign_up', {
      event_category: 'engagement',
      signup_type: 'newsletter',
      location: location,
      ...additionalData
    })
  },

  // Information requests
  viewInfo: (contentType: string, location: string, additionalData?: Record<string, string | number | boolean>) => {
    if (!isBrowser) return
    sendGAEvent('event', 'view_item', {
      event_category: 'engagement',
      content_type: contentType,
      location: location,
      ...additionalData
    })
  },

  // Piano consultation interest tracking (NOT purchases - just service interest)
  viewConsultation: (consultationType: string, location: string, additionalData?: Record<string, string | number | boolean>) => {
    if (!isBrowser) return
    
    console.log('🎹 Piano Consultation Interest:', {
      consultationType,
      location,
      additionalData
    })
    
    // GA4 view_item event for consultation services (not products)
    sendGAEvent('event', 'view_item', {
      currency: 'USD',
      value: 50, // Estimated consultation value
      items: [{
        item_id: 'piano_consultation',
        item_name: consultationType,
        item_category: 'consultation_service',
        item_category2: 'piano_expertise',
        affiliation: 'KAWAI Houston',
        price: 50,
        quantity: 1
      }],
      event_category: 'consultation_interest',
      consultation_type: consultationType,
      source_location: location,
      ...additionalData
    })
  }
}

// Page engagement and behavior tracking
export const trackPageEvent = {
  // Engagement time tracking (disabled)
  engagementTime: null as ((timeSpent: number, pageSection?: string) => void) | null,

  // Scroll depth tracking (disabled)
  scrollDepth: null as ((percentage: number, pageSection?: string) => void) | null,

  // Session quality scoring (disabled)
  sessionQuality: null as ((score: number, interactionCount: number, timeSpent: number) => void) | null,

  // Content interaction tracking (using GA4 recommended select_content event)
  contentInteraction: (contentType: string, elementId?: string, timeToInteraction?: number) => {
    if (!isBrowser) return
    sendGAEvent('event', 'select_content', {
      content_type: contentType,
      item_id: elementId || 'unknown',
      time_to_interaction: timeToInteraction ? Math.round(timeToInteraction) : undefined,
      interaction_type: 'content_interaction'
    })
  },

  // Page section visibility tracking (using GA4 recommended view_item event)
  sectionView: (sectionName: string, timeInView: number, isFullyVisible: boolean) => {
    if (!isBrowser) return
    sendGAEvent('event', 'view_item', {
      item_name: sectionName,
      item_category: 'page_section',
      value: Math.round(timeInView),
      time_in_view: Math.round(timeInView),
      fully_visible: isFullyVisible,
      interaction_type: 'section_view'
    })
  },

  // Exit intent detection
  exitIntent: (timeOnPage: number, scrollDepth: number, interactionCount: number) => {
    if (!isBrowser) return
    sendGAEvent('event', 'exit_intent', {
      time_on_page: Math.round(timeOnPage),
      max_scroll_depth: scrollDepth,
      interaction_count: interactionCount,
      event_category: 'user_behavior'
    })
  },

  // Custom page timing events
  timing: (eventName: string, timingValue: number, category: string = 'performance') => {
    if (!isBrowser) return
    sendGAEvent('event', 'timing_complete', {
      event_category: category,
      timing_name: eventName,
      timing_value: Math.round(timingValue),
      value: Math.round(timingValue)
    })
  }
}

// Web Vitals tracking for performance monitoring
export const trackWebVitals = {
  // Core Web Vitals
  coreVital: (name: string, value: number, rating: 'good' | 'needs-improvement' | 'poor', id: string) => {
    if (!isBrowser) return
    sendGAEvent('event', 'web_vital', {
      event_category: 'performance',
      metric_name: name,
      metric_value: Math.round(name === 'CLS' ? value * 1000 : value),
      metric_rating: rating,
      metric_id: id,
      value: Math.round(name === 'CLS' ? value * 1000 : value)
    })
  },

  // Custom Next.js metrics
  nextjsMetric: (name: string, value: number, navigationType?: string) => {
    if (!isBrowser) return
    sendGAEvent('event', 'nextjs_metric', {
      event_category: 'performance',
      metric_name: name,
      metric_value: Math.round(value),
      navigation_type: navigationType || 'unknown',
      value: Math.round(value)
    })
  }
}

// Convenience functions for common KAWAI piano sale events
export const trackKawaiEvent = {
  // Consultation booking CTA click (engagement, not conversion - only actual Calendly scheduling is conversion)
  bookConsultation: (source: string) => {
    // Track as both button click and consultation interest
    trackEvent.buttonClick('Book Consultation', source, {
      event_type: 'piano_consultation',
      event_date: 'september_2025',
      cta_intent: 'consultation_booking',
      interaction_type: 'consultation_interest'
    })

    // Track consultation interest with GA4 view_item event
    trackEvent.viewConsultation('Piano Consultation Booking', source, {
      event_type: 'piano_consultation',
      event_date: 'september_2025',
      cta_intent: 'consultation_booking',
      interaction_type: 'consultation_interest'
    })
    
    // PostHog consultation intent tracking with validation
    eventMonitor.capture(POSTHOG_CONFIG.EVENTS.CONSULTATION_INTENT_SIGNAL, {
      trigger_source: source.includes('hero') ? 'hero_cta' : source.includes('booking') ? 'booking_section' : 'gallery_cta',
      models_viewed_count: 0, // Will be updated by the hook
      session_duration_seconds: Math.floor(performance.now() / 1000),
      engagement_score: 75, // High intent signal
      time_to_intent_seconds: Math.floor(performance.now() / 1000),
      high_intent: true
    })
  },

  // Piano browsing
  findPiano: (source: string) => {
    trackEvent.buttonClick('Find Your Piano', source, {
      event_type: 'piano_discovery'
    })
    
    // PostHog piano interest tracking with validation
    eventMonitor.capture(POSTHOG_CONFIG.EVENTS.PIANO_MODEL_VIEWED, {
      model_name: 'piano_gallery_browse',
      model_price: 'various',
      model_category: 'Digital',
      time_spent_seconds: 0,
      source_section: source,
      interaction_type: 'view'
    })
    
    // Campaign performance tracking
    campaignAnalytics.trackPianoView({
      model: 'piano_gallery_browse',
      price: 'various',
      category: 'Digital',
      source: source
    })
  },

  // Event registration CTA click (engagement, not conversion - only actual Calendly scheduling is conversion)
  secureSpot: (source: string) => {
    // Track as both button click and consultation interest
    trackEvent.buttonClick('Secure Your Spot', source, {
      event_type: 'sale_event_registration',
      event_date: 'september_2025',
      cta_intent: 'event_registration',
      interaction_type: 'event_interest'
    })

    // Track event interest with GA4 view_item event
    trackEvent.viewConsultation('Piano Sale Event Registration', source, {
      event_type: 'sale_event_registration',
      event_date: 'september_2025',
      cta_intent: 'event_registration',
      interaction_type: 'event_interest'
    })
    
    // PostHog event interest tracking with validation
    eventMonitor.capture(POSTHOG_CONFIG.EVENTS.KAWAI_EVENT_INTEREST, {
      event_dates: 'September 11-14, 2025',
      event_location: 'Houston, TX',
      interaction_type: 'save_date',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    })
  },

  // Contact actions
  callPhone: (source: string) => {
    trackEvent.contact('phone', source, {
      phone_number: '713-904-0001'
    })
  },

  emailContact: (source: string) => {
    trackEvent.contact('email', source, {
      email: 'info@kawaipianoshouston.com'
    })
  },

  // Location/directions
  getDirections: (source: string) => {
    trackEvent.buttonClick('Get Directions', source, {
      destination: 'kawai_showroom_houston'
    })
  },

  // Private tour scheduling CTA click (engagement, not conversion - only actual Calendly scheduling is conversion)
  scheduleTour: (source: string) => {
    trackEvent.buttonClick('Schedule Private Tour', source, {
      event_type: 'showroom_tour',
      cta_intent: 'private_tour_request',
      interaction_type: 'tour_interest'
    })
  },

  // Newsletter signup
  subscribeNewsletter: (source: string) => {
    trackEvent.signUp(source, {
      subscription_type: 'kawai_updates'
    })
  },

  // Calendly-specific tracking functions
  calendlyConversion: (source: 'modal' | 'booking_section' | 'unknown') => {
    // Track the main conversion - ONLY actual Calendly appointment scheduling is tracked as conversion
    trackEvent.generateLead('calendly_appointment_scheduled', source, {
      event_type: 'piano_consultation',
      event_date: 'september_2025',
      calendly_source: source,
      conversion_value: 50, // Higher value for actual appointments
      is_actual_conversion: true // Flag to distinguish from engagement tracking
    })
    
    // Meta Pixel SubmitApplication - Primary application event for consultation
    trackMetaPixel('SubmitApplication', {
      content_name: 'piano_consultation_application',
      content_category: 'consultation_services',
      content_type: 'service',
      source: source,
      value: 50,
      currency: 'USD',
      service_type: 'piano_consultation',
      application_type: 'consultation_booking',
      event_month: 'september',
      event_year: '2025',
      business_type: 'piano_dealer'
    })
    
    // Meta Pixel CompleteRegistration - Secondary confirmation event
    trackMetaPixel('CompleteRegistration', {
      content_name: 'piano_consultation_appointment',
      content_category: 'appointment_confirmation',
      content_type: 'consultation_booking',
      source: source,
      value: 100,
      currency: 'USD',
      num_items: 1,
      appointment_type: 'piano_consultation',
      event_month: 'september',
      event_year: '2025',
      business_type: 'piano_dealer'
    })
    
    // Campaign performance tracking for consultation conversion
    campaignAnalytics.trackConsultationBooked({
      source: source,
      calendlyStatus: 'completed'
    })
    
    // Google Ads conversion tracking for Calendly
    trackGoogleAdsConversion()
  },

  calendlyInteraction: (interaction: string, source: 'modal' | 'booking_section' | 'unknown') => {
    // Track user interactions within Calendly widget - GA tracking only
    trackEvent.buttonClick(`calendly_${interaction}`, source, {
      interaction_type: interaction,
      calendly_source: source,
      event_type: 'calendly_engagement'
    })
    
    // Meta Pixel ViewContent removed - focusing on conversions only
    console.log(`Calendly interaction tracked: ${interaction} from ${source}`)
  },

  // Modal CTA button tracking
  openModal: (ctaText: string, location: string, modalType: string, intendedAction: string) => {
    if (!isBrowser) return
    
    // Google Analytics - using GA4 recommended select_content event for modal interactions
    sendGAEvent('event', 'select_content', {
      content_type: 'modal',
      item_name: modalType,
      item_id: `modal_${modalType}`,
      cta_text: ctaText,
      cta_location: location,
      intended_action: intendedAction,
      interaction_type: 'modal_open',
      event_date: 'september_2025'
    })
    
    // Meta Pixel ViewContent removed - focusing on conversions only
    console.log(`Modal opened: ${modalType} from ${location}`)
  },

  // Houston event information request
  requestEventInfo: (data: { source: string; houstonArea?: string; pianoInterest?: string }) => {
    if (!isBrowser) return
    
    // Track as high-value engagement (not conversion - only Calendly scheduling is conversion)
    trackEvent.buttonClick('Houston Event Information Request', data.source, {
      event_type: 'event_information_request',
      houston_area: data.houstonArea || 'not_specified',
      piano_interest: data.pianoInterest || 'not_specified',
      event_date: 'september_2025',
      interaction_type: 'information_request',
      engagement_level: 'high'
    })
    
    // Meta Pixel ViewContent removed - focusing on conversions only
    console.log(`Event info requested from ${data.source}`)
    
    // PostHog tracking
    postHogAnalytics.trackConsultationIntent({
      trigger: 'hero_cta',
      modelsViewed: 0,
      sessionDuration: Math.floor(performance.now() / 1000),
      engagementScore: 50, // Medium intent signal
      timeToIntent: Math.floor(performance.now() / 1000)
    })
  },

  // Test function to validate GA4 tracking is working
  testTracking: () => {
    if (!isBrowser) return
    
    console.log('🧪 Testing GA4 tracking implementation...')
    
    // Test generate_lead event
    trackEvent.generateLead('test_lead_generation', 'test_validation', {
      is_actual_conversion: false,
      test_event: true
    })
    
    // Test consultation interest
    trackEvent.viewConsultation('Test Piano Consultation', 'test_validation', {
      test_event: true
    })
    
    console.log('✅ GA4 test events sent - check browser network tab and GA4 DebugView')
  }
}