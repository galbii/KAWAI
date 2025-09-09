// PostHog configuration and constants for KAWAI Piano Landing Page

export const POSTHOG_CONFIG = {
  // Feature flags for A/B testing
  FEATURE_FLAGS: {
    HERO_CTA_VARIATION: 'hero-cta-variation',
    PIANO_GALLERY_LAYOUT: 'piano-gallery-layout', 
    COUNTDOWN_POSITION: 'countdown-position',
    CONSULTATION_MODAL_TIMING: 'consultation-modal-timing',
    MOBILE_OPTIMIZATION: 'mobile-optimization-v2'
  },

  // Event names for tracking
  EVENTS: {
    // Piano-specific events
    PIANO_MODEL_VIEWED: 'piano_model_viewed',
    PIANO_COMPARISON_STARTED: 'piano_comparison_started',
    PIANO_INTEREST_PROFILE: 'piano_interest_profile',
    
    // Consultation flow events
    CONSULTATION_INTENT_SIGNAL: 'consultation_intent_signal',
    CONSULTATION_BOOKING_ATTEMPT: 'consultation_booking_attempt',
    CONSULTATION_COMPLETED: 'consultation_completed',
    CONSULTATION_ABANDONED: 'consultation_abandoned',
    CALENDLY_APPOINTMENT_BOOKED: 'calendly_appointment_booked',
    
    // Event attendance events
    KAWAI_EVENT_INTEREST: 'kawai_event_interest',
    SAVE_THE_DATE: 'save_the_date',
    DIRECTIONS_REQUESTED: 'directions_requested',
    
    // Lead qualification events
    HIGH_INTENT_SIGNAL: 'high_intent_signal',
    LEAD_QUALITY_SCORE: 'lead_quality_score',
    RETURN_VISITOR: 'return_visitor',
    
    // User experience events
    USER_JOURNEY_PROGRESSION: 'user_journey_progression',
    SESSION_QUALITY_HIGH: 'session_quality_high',
    MOBILE_EXPERIENCE_METRIC: 'mobile_experience_metric'
  },

  // User properties for segmentation
  USER_PROPERTIES: {
    PIANO_PREFERENCES: 'piano_preferences',
    BUDGET_RANGE: 'budget_range',
    EXPERIENCE_LEVEL: 'experience_level', // beginner, intermediate, advanced
    PURCHASE_INTENT: 'purchase_intent', // browsing, considering, ready_to_buy
    CONSULTATION_STATUS: 'consultation_status',
    LEAD_SCORE: 'lead_score'
  },

  // Session recording configuration
  SESSION_RECORDING: {
    // Only record high-value sessions to optimize performance
    TRIGGERS: {
      HIGH_ENGAGEMENT_SCORE: 70,
      CONSULTATION_INTENT: true,
      MULTIPLE_PIANO_VIEWS: 3,
      LONG_SESSION: 120 // seconds
    },
    
    // Privacy settings
    MASK_INPUTS: {
      password: true,
      email: false, // Allow for lead qualification
      phone: false,
      credit_card: true
    }
  },

  // Piano-specific data structure
  PIANO_CATEGORIES: {
    DIGITAL: 'Digital',
    ACOUSTIC: 'Acoustic', 
    HYBRID: 'Hybrid'
  } as const,

  PRICE_RANGES: {
    ENTRY: 'entry',      // < $1000
    MID: 'mid',          // $1000 - $3000
    PREMIUM: 'premium',   // > $3000
    MIXED: 'mixed'       // Multiple ranges viewed
  } as const,

  // Lead scoring weights
  LEAD_SCORING: {
    TIME_WEIGHTS: {
      VERY_SHORT: 0,     // < 15 seconds
      SHORT: 10,         // 15-30 seconds
      MEDIUM: 20,        // 30-60 seconds
      LONG: 30           // > 60 seconds
    },
    SCROLL_WEIGHTS: {
      MINIMAL: 0,        // < 25%
      PARTIAL: 10,       // 25-50%
      GOOD: 15,          // 50-75%
      EXCELLENT: 25      // > 75%
    },
    INTERACTION_WEIGHTS: {
      NONE: 0,           // 0 interactions
      MINIMAL: 10,       // 1-2 interactions
      MODERATE: 15,      // 3-5 interactions
      HIGH: 25           // > 5 interactions
    },
    PIANO_INTEREST_WEIGHTS: {
      NONE: 0,           // 0 pianos viewed
      MINIMAL: 10,       // 1 piano
      MODERATE: 15,      // 2-3 pianos
      HIGH: 20           // > 3 pianos
    }
  }
} as const

// Helper functions for PostHog integration
export const getLeadScore = (behavior: {
  timeSpent: number
  scrollDepth: number
  interactions: number
  pianosViewed: number
}): number => {
  const { TIME_WEIGHTS, SCROLL_WEIGHTS, INTERACTION_WEIGHTS, PIANO_INTEREST_WEIGHTS } = POSTHOG_CONFIG.LEAD_SCORING
  
  let score = 0
  
  // Time scoring
  if (behavior.timeSpent >= 60) score += TIME_WEIGHTS.LONG
  else if (behavior.timeSpent >= 30) score += TIME_WEIGHTS.MEDIUM
  else if (behavior.timeSpent >= 15) score += TIME_WEIGHTS.SHORT
  else score += TIME_WEIGHTS.VERY_SHORT
  
  // Scroll scoring
  if (behavior.scrollDepth > 75) score += SCROLL_WEIGHTS.EXCELLENT
  else if (behavior.scrollDepth > 50) score += SCROLL_WEIGHTS.GOOD
  else if (behavior.scrollDepth > 25) score += SCROLL_WEIGHTS.PARTIAL
  else score += SCROLL_WEIGHTS.MINIMAL
  
  // Interaction scoring
  if (behavior.interactions > 5) score += INTERACTION_WEIGHTS.HIGH
  else if (behavior.interactions > 2) score += INTERACTION_WEIGHTS.MODERATE
  else if (behavior.interactions > 0) score += INTERACTION_WEIGHTS.MINIMAL
  else score += INTERACTION_WEIGHTS.NONE
  
  // Piano interest scoring
  if (behavior.pianosViewed > 3) score += PIANO_INTEREST_WEIGHTS.HIGH
  else if (behavior.pianosViewed > 1) score += PIANO_INTEREST_WEIGHTS.MODERATE
  else if (behavior.pianosViewed > 0) score += PIANO_INTEREST_WEIGHTS.MINIMAL
  else score += PIANO_INTEREST_WEIGHTS.NONE
  
  return Math.min(score, 100)
}

export const shouldTriggerSessionRecording = (behavior: {
  engagementScore: number
  consultationIntent: boolean
  pianosViewed: number
  sessionDuration: number
}): boolean => {
  const triggers = POSTHOG_CONFIG.SESSION_RECORDING.TRIGGERS
  
  return (
    behavior.engagementScore >= triggers.HIGH_ENGAGEMENT_SCORE ||
    behavior.consultationIntent === triggers.CONSULTATION_INTENT ||
    behavior.pianosViewed >= triggers.MULTIPLE_PIANO_VIEWS ||
    behavior.sessionDuration >= triggers.LONG_SESSION
  )
}

export const getPriceRange = (prices: number[]): string => {
  if (prices.length === 0) return POSTHOG_CONFIG.PRICE_RANGES.ENTRY
  
  const maxPrice = Math.max(...prices)
  const minPrice = Math.min(...prices)
  
  if (maxPrice < 1000) return POSTHOG_CONFIG.PRICE_RANGES.ENTRY
  if (minPrice >= 3000) return POSTHOG_CONFIG.PRICE_RANGES.PREMIUM
  if (maxPrice >= 3000 && minPrice < 1000) return POSTHOG_CONFIG.PRICE_RANGES.MIXED
  return POSTHOG_CONFIG.PRICE_RANGES.MID
}

// PostHog query helpers for dashboard creation
export const POSTHOG_QUERIES = {
  // Conversion funnel query
  CONSULTATION_FUNNEL: {
    insight: 'FUNNELS',
    events: [
      { id: 'piano_model_viewed' },
      { id: 'consultation_intent_signal' },
      { id: 'consultation_booking_attempt' },
      { id: 'consultation_completed' }
    ],
    filters: {
      date_from: '-30d'
    }
  },

  // Cohort analysis for piano preferences
  PIANO_PREFERENCE_COHORTS: {
    insight: 'LIFECYCLE',
    events: [{ id: 'piano_model_viewed' }],
    properties: [
      { key: 'model_category', operator: 'exact', value: ['Digital', 'Acoustic', 'Hybrid'] }
    ]
  },

  // A/B test results
  FEATURE_FLAG_PERFORMANCE: {
    insight: 'TRENDS',
    events: [{ id: 'consultation_booking_attempt' }],
    breakdown: 'hero-cta-variation',
    filters: {
      date_from: '-7d'
    }
  }
}

export default POSTHOG_CONFIG