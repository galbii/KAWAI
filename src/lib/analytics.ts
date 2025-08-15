// Analytics tracking infrastructure for piano interest and user journey

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  userId?: string
  sessionId?: string
  timestamp?: Date
}

export interface PianoInteractionEvent extends AnalyticsEvent {
  pianoId: string
  pianoName: string
  pianoModel: string
  pianoSeries?: string
  pianoType: string
  price?: number
  interactionType: 'view' | 'compare' | 'inquiry' | 'favorite' | 'share' | 'audio_play' | 'video_play' | 'brochure_download'
}

export interface UserJourneyEvent extends AnalyticsEvent {
  step: string
  source?: string
  category?: string
  value?: number
}

export interface SearchEvent extends AnalyticsEvent {
  query: string
  resultsCount: number
  filters?: Record<string, any>
  selectedResult?: string
}

export interface RecommendationEvent extends AnalyticsEvent {
  criteria: Record<string, any>
  recommendedPianos: string[]
  selectedPiano?: string
}

export class KawaiAnalytics {
  private gtag?: Function
  private pixelId?: string
  private sessionId: string
  private userId?: string

  constructor(config: {
    googleAnalyticsId?: string
    facebookPixelId?: string
    userId?: string
  }) {
    this.sessionId = this.generateSessionId()
    this.userId = config.userId
    this.pixelId = config.facebookPixelId

    // Initialize Google Analytics
    if (config.googleAnalyticsId && typeof window !== 'undefined') {
      this.initializeGA(config.googleAnalyticsId)
    }

    // Initialize Facebook Pixel
    if (config.facebookPixelId && typeof window !== 'undefined') {
      this.initializeFBPixel(config.facebookPixelId)
    }
  }

  private initializeGA(gaId: string): void {
    // Load Google Analytics script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    document.head.appendChild(script)

    // Initialize gtag
    window.dataLayer = window.dataLayer || []
    this.gtag = function() {
      window.dataLayer?.push(arguments)
    }
    this.gtag('js', new Date())
    this.gtag('config', gaId, {
      session_id: this.sessionId,
      user_id: this.userId
    })
  }

  private initializeFBPixel(pixelId: string): void {
    // Facebook Pixel initialization
    const fbq = function(...args: any[]) {
      (window as any).fbq = (window as any).fbq || {}
      ;(window as any).fbq.callMethod ? (window as any).fbq.callMethod.apply((window as any).fbq, args) : (window as any).fbq.queue.push(args)
    }
    
    if (!(window as any).fbq) (window as any).fbq = fbq
    fbq('init', pixelId)
    fbq('track', 'PageView')
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Piano Interaction Tracking
  trackPianoView(piano: any): void {
    const event: PianoInteractionEvent = {
      name: 'piano_view',
      pianoId: piano.id,
      pianoName: piano.name,
      pianoModel: piano.model,
      pianoSeries: piano.series?.name,
      pianoType: piano.pianoType,
      price: piano.pricing?.salePrice || piano.pricing?.msrp,
      interactionType: 'view',
      properties: {
        category: piano.category?.name,
        series: piano.series?.name,
        is_featured: piano.isFeatured,
        is_pre_owned: piano.isPreOwned
      },
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: new Date()
    }

    this.sendEvent(event)
    
    // Google Analytics Enhanced Ecommerce
    if (this.gtag) {
      this.gtag('event', 'view_item', {
        currency: 'USD',
        value: event.price || 0,
        items: [{
          item_id: event.pianoId,
          item_name: event.pianoName,
          category: event.properties?.category,
          brand: 'Kawai',
          price: event.price || 0
        }]
      })
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_type: 'product',
        content_ids: [event.pianoId],
        content_name: event.pianoName,
        value: event.price || 0,
        currency: 'USD'
      })
    }
  }

  trackPianoComparison(pianos: any[]): void {
    const event: AnalyticsEvent = {
      name: 'piano_comparison',
      properties: {
        piano_count: pianos.length,
        piano_ids: pianos.map(p => p.id),
        piano_names: pianos.map(p => p.name),
        piano_types: pianos.map(p => p.pianoType),
        price_range: {
          min: Math.min(...pianos.map(p => p.pricing?.salePrice || p.pricing?.msrp || 0)),
          max: Math.max(...pianos.map(p => p.pricing?.salePrice || p.pricing?.msrp || 0))
        }
      },
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: new Date()
    }

    this.sendEvent(event)

    if (this.gtag) {
      this.gtag('event', 'compare_pianos', {
        event_category: 'Piano Interaction',
        piano_count: pianos.length
      })
    }
  }

  trackPianoInquiry(piano: any, inquiryType: 'contact' | 'quote' | 'demo' | 'availability'): void {
    const event: PianoInteractionEvent = {
      name: 'piano_inquiry',
      pianoId: piano.id,
      pianoName: piano.name,
      pianoModel: piano.model,
      pianoSeries: piano.series?.name,
      pianoType: piano.pianoType,
      price: piano.pricing?.salePrice || piano.pricing?.msrp,
      interactionType: 'inquiry',
      properties: {
        inquiry_type: inquiryType
      },
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: new Date()
    }

    this.sendEvent(event)

    // High-value conversion event
    if (this.gtag) {
      this.gtag('event', 'generate_lead', {
        currency: 'USD',
        value: event.price || 0,
        event_category: 'Piano Inquiry',
        inquiry_type: inquiryType
      })
    }

    if (window.fbq) {
      window.fbq('track', 'Lead', {
        content_type: 'product',
        content_ids: [event.pianoId],
        value: event.price || 0,
        currency: 'USD'
      })
    }
  }

  trackAudioPlay(piano: any, audioTitle: string, duration?: number): void {
    const event: PianoInteractionEvent = {
      name: 'audio_play',
      pianoId: piano.id,
      pianoName: piano.name,
      pianoModel: piano.model,
      pianoSeries: piano.series?.name,
      pianoType: piano.pianoType,
      interactionType: 'audio_play',
      properties: {
        audio_title: audioTitle,
        duration: duration
      },
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: new Date()
    }

    this.sendEvent(event)

    if (this.gtag) {
      this.gtag('event', 'audio_play', {
        event_category: 'Media Interaction',
        piano_model: piano.model,
        audio_title: audioTitle
      })
    }
  }

  trackVideoPlay(piano: any, videoTitle: string, duration?: number): void {
    const event: PianoInteractionEvent = {
      name: 'video_play',
      pianoId: piano.id,
      pianoName: piano.name,
      pianoModel: piano.model,
      pianoSeries: piano.series?.name,
      pianoType: piano.pianoType,
      interactionType: 'video_play',
      properties: {
        video_title: videoTitle,
        duration: duration
      },
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: new Date()
    }

    this.sendEvent(event)

    if (this.gtag) {
      this.gtag('event', 'video_play', {
        event_category: 'Media Interaction',
        piano_model: piano.model,
        video_title: videoTitle
      })
    }
  }

  // Search Tracking
  trackSearch(query: string, resultsCount: number, filters?: Record<string, any>): void {
    const event: SearchEvent = {
      name: 'piano_search',
      query: query,
      resultsCount: resultsCount,
      filters: filters,
      properties: {
        has_filters: filters && Object.keys(filters).length > 0,
        filter_count: filters ? Object.keys(filters).length : 0
      },
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: new Date()
    }

    this.sendEvent(event)

    if (this.gtag) {
      this.gtag('event', 'search', {
        search_term: query,
        results_count: resultsCount
      })
    }
  }

  trackSearchResultClick(query: string, pianoId: string, position: number): void {
    const event: SearchEvent = {
      name: 'search_result_click',
      query: query,
      resultsCount: 0,
      selectedResult: pianoId,
      properties: {
        click_position: position
      },
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: new Date()
    }

    this.sendEvent(event)

    if (this.gtag) {
      this.gtag('event', 'select_content', {
        content_type: 'piano',
        content_id: pianoId,
        search_term: query,
        position: position
      })
    }
  }

  // User Journey Tracking
  trackUserJourney(step: string, properties?: Record<string, any>): void {
    const event: UserJourneyEvent = {
      name: 'user_journey',
      step: step,
      properties: properties,
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: new Date()
    }

    this.sendEvent(event)

    if (this.gtag) {
      this.gtag('event', 'user_journey', {
        event_category: 'User Flow',
        journey_step: step,
        ...properties
      })
    }
  }

  trackRecommendationView(criteria: Record<string, any>, recommendedPianos: string[]): void {
    const event: RecommendationEvent = {
      name: 'recommendation_view',
      criteria: criteria,
      recommendedPianos: recommendedPianos,
      properties: {
        recommendation_count: recommendedPianos.length,
        budget: criteria.budget,
        experience: criteria.experience,
        usage: criteria.usage
      },
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: new Date()
    }

    this.sendEvent(event)

    if (this.gtag) {
      this.gtag('event', 'recommendation_view', {
        event_category: 'Recommendation Engine',
        recommendation_count: recommendedPianos.length
      })
    }
  }

  trackRecommendationClick(recommendedPiano: string, position: number): void {
    const event: RecommendationEvent = {
      name: 'recommendation_click',
      criteria: {},
      recommendedPianos: [],
      selectedPiano: recommendedPiano,
      properties: {
        click_position: position
      },
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: new Date()
    }

    this.sendEvent(event)

    if (this.gtag) {
      this.gtag('event', 'select_content', {
        content_type: 'recommendation',
        content_id: recommendedPiano,
        position: position
      })
    }
  }

  // Newsletter and Engagement
  trackNewsletterSignup(source: string): void {
    const event: AnalyticsEvent = {
      name: 'newsletter_signup',
      properties: {
        source: source
      },
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: new Date()
    }

    this.sendEvent(event)

    if (this.gtag) {
      this.gtag('event', 'sign_up', {
        method: 'newsletter',
        source: source
      })
    }

    if (window.fbq) {
      window.fbq('track', 'Subscribe', {
        source: source
      })
    }
  }

  trackBrochureDownload(piano: any): void {
    const event: PianoInteractionEvent = {
      name: 'brochure_download',
      pianoId: piano.id,
      pianoName: piano.name,
      pianoModel: piano.model,
      pianoSeries: piano.series?.name,
      pianoType: piano.pianoType,
      interactionType: 'brochure_download',
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: new Date()
    }

    this.sendEvent(event)

    if (this.gtag) {
      this.gtag('event', 'download', {
        event_category: 'Content Engagement',
        content_type: 'brochure',
        piano_model: piano.model
      })
    }
  }

  // Page and Session Tracking
  trackPageView(page: string, title?: string): void {
    const event: AnalyticsEvent = {
      name: 'page_view',
      properties: {
        page: page,
        title: title,
        referrer: typeof document !== 'undefined' ? document.referrer : undefined
      },
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: new Date()
    }

    this.sendEvent(event)

    if (this.gtag) {
      this.gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: title,
        page_location: window.location.href
      })
    }
  }

  trackSessionStart(): void {
    const event: AnalyticsEvent = {
      name: 'session_start',
      properties: {
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        screen_resolution: typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : undefined,
        language: typeof navigator !== 'undefined' ? navigator.language : undefined
      },
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: new Date()
    }

    this.sendEvent(event)
  }

  // Utility Methods
  setUserId(userId: string): void {
    this.userId = userId
    
    if (this.gtag) {
      this.gtag('config', 'GA_MEASUREMENT_ID', {
        user_id: userId
      })
    }
  }

  private sendEvent(event: AnalyticsEvent): void {
    // Send to internal analytics endpoint
    if (typeof fetch !== 'undefined') {
      fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      }).catch(console.error)
    }

    // Log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event)
    }
  }
}

// Conversion Funnel Tracking
export class ConversionFunnel {
  private analytics: KawaiAnalytics
  private funnelSteps = [
    'homepage_visit',
    'piano_browse',
    'piano_view',
    'piano_compare',
    'inquiry_form',
    'contact_submitted',
    'demo_scheduled',
    'purchase_intent'
  ]

  constructor(analytics: KawaiAnalytics) {
    this.analytics = analytics
  }

  trackStep(step: string, properties?: Record<string, any>): void {
    this.analytics.trackUserJourney(step, {
      funnel_step: step,
      funnel_position: this.funnelSteps.indexOf(step) + 1,
      ...properties
    })
  }

  trackConversion(fromStep: string, toStep: string, value?: number): void {
    this.analytics.trackUserJourney('funnel_conversion', {
      from_step: fromStep,
      to_step: toStep,
      conversion_value: value,
      conversion_rate: this.calculateConversionRate(fromStep, toStep)
    })
  }

  private calculateConversionRate(fromStep: string, toStep: string): number {
    // This would calculate actual conversion rates from stored data
    // For now, return a placeholder
    return 0.15 // 15% conversion rate
  }
}

// A/B Testing Support
export class ABTestTracker {
  private analytics: KawaiAnalytics
  private activeTests: Map<string, string> = new Map()

  constructor(analytics: KawaiAnalytics) {
    this.analytics = analytics
  }

  assignVariant(testName: string, variants: string[]): string {
    const variant = variants[Math.floor(Math.random() * variants.length)]
    this.activeTests.set(testName, variant)
    
    this.analytics.trackUserJourney('ab_test_assignment', {
      test_name: testName,
      variant: variant
    })

    return variant
  }

  trackConversion(testName: string, conversionType: string, value?: number): void {
    const variant = this.activeTests.get(testName)
    if (variant) {
      this.analytics.trackUserJourney('ab_test_conversion', {
        test_name: testName,
        variant: variant,
        conversion_type: conversionType,
        value: value
      })
    }
  }
}

// Global analytics instance
export let analytics: KawaiAnalytics

export function initializeAnalytics(config: {
  googleAnalyticsId?: string
  facebookPixelId?: string
  userId?: string
}) {
  analytics = new KawaiAnalytics(config)
  return analytics
}

// Declare global types for TypeScript
declare global {
  interface Window {
    dataLayer: any[]
    gtag: Function
    fbq: Function
  }
}