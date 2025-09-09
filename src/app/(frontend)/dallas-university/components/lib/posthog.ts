import posthog from 'posthog-js'

export interface PianoModel {
  name: string
  price: string
  category: 'Digital' | 'Acoustic' | 'Hybrid'
}

export interface ConsultationEvent {
  trigger: 'hero_cta' | 'gallery_cta' | 'booking_section' | 'exit_intent'
  modelsViewed: number
  sessionDuration: number
  engagementScore: number
  timeToIntent: number
}

export interface PianoInteractionEvent {
  model: string
  price: string
  category: string
  timeSpent: number
  sourceSection: string
  interactionType: 'view' | 'compare' | 'calculate_payment'
}

class PostHogAnalytics {
  private initialized = false

  init() {
    if (typeof window !== 'undefined' && !this.initialized) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.posthog.com',
        person_profiles: 'identified_only', // Only create profiles for identified users
        capture_pageview: false, // We'll handle this manually to avoid duplication with GA4
        capture_pageleave: true,
        debug: true, // Enable debug mode and toolbar
        session_recording: {
          maskAllInputs: true,
          maskInputOptions: {
            password: true,
            email: false, // Allow email for lead qualification
          },
        },
        autocapture: {
          capture_copied_text: false,
          css_selector_allowlist: [
            '[data-ph-capture]', // Only capture elements explicitly marked
          ],
        },
        bootstrap: {
          featureFlags: {
            'piano-gallery-layout': 'grid',
            'hero-cta-variation': 'book-consultation',
            'countdown-position': 'hero',
          },
        },
      })
      this.initialized = true
    }
  }

  // Piano-specific tracking methods
  trackPianoModelViewed(model: PianoInteractionEvent) {
    if (!this.initialized) return
    
    posthog.capture('piano_model_viewed', {
      model_name: model.model,
      model_price: model.price,
      model_category: model.category,
      time_spent_seconds: model.timeSpent,
      source_section: model.sourceSection,
      interaction_type: model.interactionType,
      timestamp: new Date().toISOString(),
    })
  }

  trackConsultationIntent(event: ConsultationEvent) {
    if (!this.initialized) return
    
    posthog.capture('consultation_intent_signal', {
      trigger_source: event.trigger,
      models_viewed_count: event.modelsViewed,
      session_duration_seconds: event.sessionDuration,
      engagement_score: event.engagementScore,
      time_to_intent_seconds: event.timeToIntent,
      high_intent: event.engagementScore > 70,
      timestamp: new Date().toISOString(),
    })

    // Start session recording for high-intent users
    if (event.engagementScore > 70) {
      this.startSessionRecording()
    }
  }

  trackConsultationBookingAttempt(data: {
    bookingSource: 'modal' | 'booking_section'
    calendlyStatus: 'opened' | 'time_selected' | 'completed' | 'abandoned'
    abandonmentStage?: string
    sessionData?: {
      qualityScore?: number
      isReturning?: boolean
      modelsViewedCount?: number
      totalInteractions?: number
    }
  }) {
    if (!this.initialized) return
    
    posthog.capture('consultation_booking_attempt', {
      booking_source: data.bookingSource,
      calendly_status: data.calendlyStatus,
      abandonment_stage: data.abandonmentStage,
      session_quality: data.sessionData?.qualityScore || 0,
      user_type: data.sessionData?.isReturning ? 'returning' : 'new',
      timestamp: new Date().toISOString(),
    })
  }

  trackPianoInterest(pianos: PianoModel[], userBehavior: {
    timeSpent: number
    scrollDepth: number
    interactions: number
  }) {
    if (!this.initialized) return
    
    // Determine user segment based on piano preferences
    const priceRange = this.determinePriceRange(pianos)
    const categoryPreference = this.determineCategoryPreference(pianos)
    
    posthog.capture('piano_interest_profile', {
      interested_models: pianos.map(p => p.name),
      price_range: priceRange,
      category_preference: categoryPreference,
      session_engagement: {
        time_spent_seconds: userBehavior.timeSpent,
        scroll_depth_percent: userBehavior.scrollDepth,
        interaction_count: userBehavior.interactions,
      },
      lead_score: this.calculateLeadScore(userBehavior, pianos),
      timestamp: new Date().toISOString(),
    })
  }

  // Removed trackEventAttendance - no longer tracking kawai_event_interest

  // User identification for consultation bookings
  identifyUser(userData: {
    email?: string
    phone?: string
    consultationBooked?: boolean
    pianoPreferences?: string[]
  }) {
    if (!this.initialized) return
    
    if (userData.email) {
      posthog.identify(userData.email, {
        email: userData.email,
        phone: userData.phone,
        consultation_booked: userData.consultationBooked,
        piano_preferences: userData.pianoPreferences,
        first_identified: new Date().toISOString(),
      })
    }
  }

  // Feature flag helpers
  shouldShowVariation(flagName: string): string | boolean {
    if (!this.initialized) return false
    return posthog.getFeatureFlag(flagName) || false
  }

  // Session recording control
  startSessionRecording() {
    if (!this.initialized) return
    posthog.startSessionRecording()
  }

  stopSessionRecording() {
    if (!this.initialized) return
    posthog.stopSessionRecording()
  }

  // Utility methods
  private determinePriceRange(pianos: PianoModel[]): 'entry' | 'mid' | 'premium' | 'mixed' {
    const prices = pianos.map(p => parseInt(p.price.replace(/[$,]/g, '')))
    const maxPrice = Math.max(...prices)
    
    if (maxPrice < 1000) return 'entry'
    if (maxPrice < 3000) return 'mid'
    if (maxPrice >= 3000) return 'premium'
    return 'mixed'
  }

  private determineCategoryPreference(pianos: PianoModel[]): string {
    const categories = pianos.map(p => p.category)
    const categoryCount = categories.reduce((acc, cat) => {
      acc[cat] = (acc[cat] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return Object.keys(categoryCount).reduce((a, b) => 
      categoryCount[a] > categoryCount[b] ? a : b
    )
  }

  private calculateLeadScore(behavior: {
    timeSpent: number
    scrollDepth: number
    interactions: number
  }, pianos: PianoModel[]): number {
    let score = 0
    
    // Time engagement (0-30 points)
    if (behavior.timeSpent > 60) score += 30
    else if (behavior.timeSpent > 30) score += 20
    else if (behavior.timeSpent > 15) score += 10
    
    // Scroll engagement (0-25 points)
    if (behavior.scrollDepth > 75) score += 25
    else if (behavior.scrollDepth > 50) score += 15
    else if (behavior.scrollDepth > 25) score += 10
    
    // Interaction count (0-25 points)
    if (behavior.interactions > 5) score += 25
    else if (behavior.interactions > 2) score += 15
    else if (behavior.interactions > 0) score += 10
    
    // Piano interest depth (0-20 points)
    if (pianos.length > 3) score += 20
    else if (pianos.length > 1) score += 15
    else if (pianos.length > 0) score += 10
    
    return Math.min(score, 100)
  }
}

export const postHogAnalytics = new PostHogAnalytics()
export default posthog