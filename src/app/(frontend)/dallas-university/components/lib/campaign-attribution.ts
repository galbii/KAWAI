'use client'

export interface CampaignAttribution {
  // UTM Parameters
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  
  // Traffic Classification
  traffic_source: 'organic' | 'direct' | 'referral' | 'social' | 'email' | 'paid' | 'unknown'
  referrer?: string
  referrer_domain?: string
  
  // Attribution Metadata
  attribution_timestamp: string
  attribution_url: string
  is_first_visit: boolean
  session_entry_page: string
}

export interface SessionAttribution {
  current: CampaignAttribution
  original: CampaignAttribution // First attribution in session
}

const SOCIAL_DOMAINS = [
  'facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com',
  'tiktok.com', 'youtube.com', 'pinterest.com', 'snapchat.com'
]

const SEARCH_ENGINES = [
  'google.com', 'bing.com', 'yahoo.com', 'duckduckgo.com',
  'baidu.com', 'yandex.com', 'ask.com'
]

const EMAIL_DOMAINS = [
  'gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com',
  'mail.google.com', 'mail.yahoo.com'
]

class CampaignAttributionManager {
  private attribution: SessionAttribution | null = null
  private readonly STORAGE_KEY = 'kawai_campaign_attribution'
  private readonly SESSION_KEY = 'kawai_session_attribution'

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeAttribution()
    }
  }

  private initializeAttribution() {
    // Try to get existing session attribution first
    const sessionAttribution = this.getStoredSessionAttribution()
    
    if (sessionAttribution) {
      this.attribution = sessionAttribution
      return
    }

    // Create new attribution from current page
    const currentAttribution = this.extractAttribution()
    const originalAttribution = this.getStoredAttribution() || currentAttribution

    this.attribution = {
      current: currentAttribution,
      original: originalAttribution
    }

    // Store in session and local storage
    this.storeSessionAttribution()
    this.storeAttribution(currentAttribution)
  }

  private extractAttribution(): CampaignAttribution {
    const url = new URL(window.location.href)
    const referrer = document.referrer
    const referrerDomain = referrer ? new URL(referrer).hostname : undefined

    // Extract UTM parameters
    const utmSource = url.searchParams.get('utm_source')
    const utmMedium = url.searchParams.get('utm_medium')
    const utmCampaign = url.searchParams.get('utm_campaign')
    const utmContent = url.searchParams.get('utm_content')
    const utmTerm = url.searchParams.get('utm_term')

    // Classify traffic source
    const trafficSource = this.classifyTrafficSource({
      utmSource,
      utmMedium,
      referrer,
      referrerDomain
    })

    // Check if first visit
    const isFirstVisit = !this.getStoredAttribution()

    return {
      utm_source: utmSource || undefined,
      utm_medium: utmMedium || undefined,
      utm_campaign: utmCampaign || undefined,
      utm_content: utmContent || undefined,
      utm_term: utmTerm || undefined,
      traffic_source: trafficSource,
      referrer: referrer || undefined,
      referrer_domain: referrerDomain,
      attribution_timestamp: new Date().toISOString(),
      attribution_url: window.location.href,
      is_first_visit: isFirstVisit,
      session_entry_page: window.location.pathname
    }
  }

  private classifyTrafficSource(data: {
    utmSource?: string | null
    utmMedium?: string | null
    referrer: string
    referrerDomain?: string
  }): CampaignAttribution['traffic_source'] {
    const { utmSource, utmMedium, referrer, referrerDomain } = data

    // UTM-based classification (most reliable)
    if (utmSource && utmMedium) {
      if (utmMedium === 'cpc' || utmMedium === 'paid' || utmMedium === 'ppc') {
        return 'paid'
      }
      if (utmMedium === 'email' || utmMedium === 'newsletter') {
        return 'email'
      }
      if (utmMedium === 'social') {
        return 'social'
      }
      if (utmMedium === 'organic') {
        return 'organic'
      }
      if (utmMedium === 'referral') {
        return 'referral'
      }
    }

    // UTM source-only classification
    if (utmSource) {
      if (SOCIAL_DOMAINS.some(domain => utmSource.includes(domain.split('.')[0]))) {
        return 'social'
      }
      if (SEARCH_ENGINES.some(domain => utmSource.includes(domain.split('.')[0]))) {
        return utmMedium === 'cpc' ? 'paid' : 'organic'
      }
      if (utmSource === 'email' || utmSource === 'newsletter') {
        return 'email'
      }
    }

    // Referrer-based classification
    if (referrer && referrerDomain) {
      // Same domain = direct (shouldn't happen but handle it)
      if (referrerDomain === window.location.hostname) {
        return 'direct'
      }

      // Social media referrers
      if (SOCIAL_DOMAINS.some(domain => referrerDomain.includes(domain))) {
        return 'social'
      }

      // Search engine referrers
      if (SEARCH_ENGINES.some(domain => referrerDomain.includes(domain))) {
        return 'organic'
      }

      // Email clients
      if (EMAIL_DOMAINS.some(domain => referrerDomain.includes(domain))) {
        return 'email'
      }

      // Any other referrer
      return 'referral'
    }

    // No referrer = direct traffic
    if (!referrer) {
      return 'direct'
    }

    return 'unknown'
  }

  private getStoredAttribution(): CampaignAttribution | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  private storeAttribution(attribution: CampaignAttribution) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(attribution))
    } catch (error) {
      console.warn('Failed to store campaign attribution:', error)
    }
  }

  private getStoredSessionAttribution(): SessionAttribution | null {
    try {
      const stored = sessionStorage.getItem(this.SESSION_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  private storeSessionAttribution() {
    try {
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(this.attribution))
    } catch (error) {
      console.warn('Failed to store session attribution:', error)
    }
  }

  // Public methods
  getCurrentAttribution(): CampaignAttribution | null {
    return this.attribution?.current || null
  }

  getOriginalAttribution(): CampaignAttribution | null {
    return this.attribution?.original || null
  }

  getSessionAttribution(): SessionAttribution | null {
    return this.attribution
  }

  // Get attribution properties for event tracking
  getAttributionProperties(useOriginal: boolean = false): Record<string, unknown> {
    const attribution = useOriginal ? this.getOriginalAttribution() : this.getCurrentAttribution()
    
    if (!attribution) {
      return {}
    }

    return {
      // UTM Properties
      utm_source: attribution.utm_source,
      utm_medium: attribution.utm_medium,
      utm_campaign: attribution.utm_campaign,
      utm_content: attribution.utm_content,
      utm_term: attribution.utm_term,
      
      // Traffic Classification
      traffic_source: attribution.traffic_source,
      referrer: attribution.referrer,
      referrer_domain: attribution.referrer_domain,
      
      // Attribution Context
      attribution_timestamp: attribution.attribution_timestamp,
      attribution_url: attribution.attribution_url,
      is_first_visit: attribution.is_first_visit,
      session_entry_page: attribution.session_entry_page,
      
      // Attribution Type
      attribution_type: useOriginal ? 'original' : 'current'
    }
  }

  // Update attribution on page navigation (for SPAs)
  updateCurrentAttribution() {
    if (!this.attribution) return

    const newAttribution = this.extractAttribution()
    this.attribution.current = newAttribution
    this.storeSessionAttribution()
  }

  // Clear attribution (for testing or privacy)
  clearAttribution() {
    this.attribution = null
    try {
      localStorage.removeItem(this.STORAGE_KEY)
      sessionStorage.removeItem(this.SESSION_KEY)
    } catch (error) {
      console.warn('Failed to clear attribution:', error)
    }
  }

  // Debug information
  debug() {
    if (process.env.NODE_ENV === 'development') {
      console.group('Campaign Attribution Debug')
      console.log('Current Attribution:', this.getCurrentAttribution())
      console.log('Original Attribution:', this.getOriginalAttribution())
      console.log('Session Attribution:', this.getSessionAttribution())
      console.log('Attribution Properties:', this.getAttributionProperties())
      console.groupEnd()
    }
  }
}

// Export singleton instance
export const campaignAttribution = new CampaignAttributionManager()

// Utility functions
export function getAttributionForEvent(useOriginal: boolean = true): Record<string, unknown> {
  return campaignAttribution.getAttributionProperties(useOriginal)
}

export function getCampaignString(): string {
  const attribution = campaignAttribution.getCurrentAttribution()
  if (!attribution) return 'unknown'
  
  if (attribution.utm_campaign) {
    return attribution.utm_campaign
  }
  
  if (attribution.utm_source && attribution.utm_medium) {
    return `${attribution.utm_source}_${attribution.utm_medium}`
  }
  
  if (attribution.utm_source) {
    return attribution.utm_source
  }
  
  return attribution.traffic_source
}

export function getTrafficSource(): string {
  const attribution = campaignAttribution.getCurrentAttribution()
  return attribution?.traffic_source || 'unknown'
}

// Development helper
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as Record<string, unknown>).campaignAttribution = {
    manager: campaignAttribution,
    getAttributionForEvent,
    getCampaignString,
    getTrafficSource
  }
}

export default campaignAttribution