/**
 * Unified Analytics Tracking System for KAWAI CMS
 *
 * Reads tracking config from Payload CMS blocks and fires events
 * to PostHog, GA4, and Meta Pixel with UTM attribution
 *
 * Key Features:
 * - Respects CMS tracking configuration per block instance
 * - Auto-includes UTM attribution from session
 * - Type-safe with Payload generated types
 * - Supports all analytics platforms (PostHog, GA4, Meta)
 *
 * Usage:
 * ```typescript
 * import { trackWithConfig } from '@/lib/analytics/unified-tracking'
 *
 * const handleClick = () => {
 *   trackWithConfig({
 *     blockType: 'marketing-find-a-dealer',
 *     blockData: { tracking },
 *     action: 'cta_click',
 *     label: 'Find a Dealer',
 *   })
 * }
 * ```
 */

'use client'

import { getStoredUTMParams } from '@/lib/shopify/utm-tracking'

// ============================================================================
// Types
// ============================================================================

/**
 * Tracking configuration from CMS block
 * Matches the shape of tracking fields created by trackingField()
 * Uses `| null` to match Payload's generated types
 */
export interface BlockTrackingConfig {
  enabled?: boolean | null
  eventName?: string | null
  category?: 'engagement' | 'conversion' | 'lead' | 'navigation' | 'media' | null
  conversionValue?: number | null
  customProperties?: Record<string, any> | null
}

/**
 * CTA-specific tracking config
 */
export interface CTATrackingConfig extends BlockTrackingConfig {
  trackAsConversion?: boolean | null
  ga4EventType?: string | null
  metaEventType?: string | null
}

/**
 * Video-specific tracking config
 */
export interface VideoTrackingConfig extends BlockTrackingConfig {
  trackPlayPause?: boolean | null
  trackProgress?: boolean | null
}

/**
 * Any block with optional tracking
 * Uses `| undefined` to satisfy exactOptionalPropertyTypes: true
 */
export type BlockWithTracking = {
  tracking?: BlockTrackingConfig | undefined
  ctaTracking?: CTATrackingConfig | undefined
  videoTracking?: VideoTrackingConfig | undefined
  impressionTracking?: BlockTrackingConfig | undefined
}

/**
 * Tracking event actions
 */
export type TrackingAction =
  | 'cta_click'
  | 'impression'
  | 'video_play'
  | 'video_pause'
  | 'video_progress'
  | 'video_complete'
  | 'form_submit'
  | 'form_start'
  | 'engagement'
  | 'navigation'

/**
 * Context for tracking an interaction
 */
export interface TrackingContext {
  /** Block slug (e.g., 'marketing-find-a-dealer') */
  blockType: string
  /** Block data with tracking configuration */
  blockData: BlockWithTracking
  /** Interaction type */
  action: TrackingAction
  /** Human-readable label (e.g., button text) */
  label?: string | undefined
  /** Block position on page (0-indexed) */
  position?: number | undefined
  /** Additional runtime properties */
  additionalProps?: Record<string, any> | undefined
  /** Override tracking config field name (default: 'tracking') */
  trackingFieldName?: 'tracking' | 'ctaTracking' | 'videoTracking' | 'impressionTracking' | undefined
}

/**
 * Options for tracking behavior
 */
export interface TrackingOptions {
  /** Skip PostHog tracking */
  skipPostHog?: boolean
  /** Skip GA4 tracking */
  skipGA?: boolean
  /** Skip Meta Pixel tracking */
  skipMeta?: boolean
  /** Custom Meta Pixel event name override */
  metaEventName?: string
  /** Debug mode (extra console logs) */
  debug?: boolean
}

// ============================================================================
// Core Tracking Function
// ============================================================================

/**
 * Main tracking function that respects CMS tracking configuration
 *
 * Checks if tracking is enabled in CMS before firing events.
 * Automatically includes UTM attribution and page context.
 *
 * @example
 * ```typescript
 * trackWithConfig({
 *   blockType: 'marketing-find-a-dealer',
 *   blockData: { tracking: { enabled: true, category: 'lead' } },
 *   action: 'cta_click',
 *   label: 'Find a Dealer',
 *   additionalProps: { destination: '/find-a-dealer' },
 * })
 * ```
 */
export function trackWithConfig(
  context: TrackingContext,
  options: TrackingOptions = {}
): void {
  // Safety check for SSR
  if (typeof window === 'undefined') {
    if (options.debug) {
      console.log('📊 [Unified Tracking] Skipping - SSR environment')
    }
    return
  }

  const {
    blockType,
    blockData,
    action,
    label,
    position,
    additionalProps = {},
    trackingFieldName = 'tracking',
  } = context

  // Get tracking config from specified field
  const trackingConfig = blockData[trackingFieldName] as BlockTrackingConfig | undefined

  // Check if tracking is enabled in CMS
  if (trackingConfig?.enabled === false) {
    if (options.debug || process.env.NODE_ENV === 'development') {
      console.log(`📊 [Unified Tracking] Tracking disabled for block: ${blockType}`)
    }
    return
  }

  // Use custom event name if provided, otherwise auto-generate
  const eventName = trackingConfig?.eventName || `${blockType.replace('marketing-', '')}_${action}`
  const category = trackingConfig?.category || 'engagement'
  const value = trackingConfig?.conversionValue

  // Get UTM attribution from session
  const utmParams = getStoredUTMParams()

  // Construct enriched event data
  const eventData = {
    block_type: blockType,
    action,
    label,
    category,
    value,
    position,
    page_path: window.location.pathname,
    page_url: window.location.href,
    referrer: document.referrer || 'direct',
    timestamp: new Date().toISOString(),
    // UTM attribution
    utm_source: utmParams?.utm_source,
    utm_medium: utmParams?.utm_medium,
    utm_campaign: utmParams?.utm_campaign,
    utm_content: utmParams?.utm_content,
    utm_term: utmParams?.utm_term,
    // CMS custom properties
    ...trackingConfig?.customProperties,
    // Runtime additional props
    ...additionalProps,
  }

  // Log in development or debug mode
  if (options.debug || process.env.NODE_ENV === 'development') {
    console.log('📊 [Unified Tracking] Event:', eventName, eventData)
  }

  // Track to PostHog
  if (!options.skipPostHog && window.posthog) {
    try {
      window.posthog.capture(eventName, eventData)
      if (options.debug) {
        console.log('✅ [PostHog] Tracked:', eventName)
      }
    } catch (error) {
      console.error('❌ [PostHog] Error:', error)
    }
  }

  // Track to Google Analytics 4
  if (!options.skipGA && window.gtag) {
    try {
      const ga4EventName = mapToGA4Event(action, category, blockType, trackingConfig)
      window.gtag('event', ga4EventName, {
        event_category: category,
        event_label: label,
        ...eventData, // eventData already includes 'value'
      })
      if (options.debug) {
        console.log('✅ [GA4] Tracked:', ga4EventName)
      }
    } catch (error) {
      console.error('❌ [GA4] Error:', error)
    }
  }

  // Track to Meta Pixel
  if (!options.skipMeta && window.fbq) {
    try {
      const metaEventName =
        options.metaEventName || mapToMetaEvent(action, category, blockType, trackingConfig)
      window.fbq('trackCustom', metaEventName, eventData)
      if (options.debug) {
        console.log('✅ [Meta Pixel] Tracked:', metaEventName)
      }
    } catch (error) {
      console.error('❌ [Meta Pixel] Error:', error)
    }
  }
}

// ============================================================================
// Event Name Mapping
// ============================================================================

/**
 * Map action and category to GA4 recommended events
 * Checks for CTA-specific GA4 event type first, then falls back to intelligent mapping
 * @see https://developers.google.com/analytics/devguides/collection/ga4/reference/events
 */
function mapToGA4Event(
  action: TrackingAction,
  category: string,
  blockType: string,
  trackingConfig?: BlockTrackingConfig
): string {
  // Check for CTA-specific GA4 event type (from CMS configuration)
  const ctaConfig = trackingConfig as CTATrackingConfig | undefined
  if (ctaConfig?.ga4EventType && ctaConfig.ga4EventType !== 'Custom') {
    return ctaConfig.ga4EventType
  }

  // Fall back to intelligent mapping based on action and context
  if (action === 'cta_click') {
    if (blockType.includes('find-a-dealer')) return 'find_location'
    if (blockType.includes('contact') || category === 'lead') return 'generate_lead'
    return 'select_promotion'
  }

  if (action === 'form_submit') return 'generate_lead'
  if (action === 'form_start') return 'begin_checkout'
  if (action === 'video_play') return 'video_start'
  if (action === 'video_complete') return 'video_complete'
  if (action === 'impression') return 'view_promotion'

  // Return action as-is for custom events
  return action
}

/**
 * Map action and category to Meta Pixel standard events
 * @see https://developers.facebook.com/docs/meta-pixel/reference
 */
function mapToMetaEvent(
  action: TrackingAction,
  category: string,
  blockType: string,
  trackingConfig?: BlockTrackingConfig
): string {
  // Check for CTA-specific Meta event type
  const ctaConfig = trackingConfig as CTATrackingConfig | undefined
  if (ctaConfig?.metaEventType && ctaConfig.metaEventType !== 'Custom') {
    return ctaConfig.metaEventType
  }

  // Map to Meta Pixel standard events
  if (action === 'cta_click') {
    if (blockType.includes('find-a-dealer')) return 'FindLocation'
    if (blockType.includes('contact') || category === 'lead') return 'Lead'
    if (category === 'conversion') return 'Lead'
    return 'CTAClick'
  }

  if (action === 'form_submit') return 'Lead'
  if (action === 'form_start') return 'InitiateCheckout'
  if (action === 'video_play') return 'VideoView'

  // Return custom event with Block_ prefix
  return `Block_${action}`
}

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Track a CTA click with automatic event mapping
 *
 * @example
 * ```typescript
 * trackCTAClick({
 *   blockType: 'marketing-find-a-dealer',
 *   blockData: { tracking },
 *   ctaText: 'Find a Dealer',
 *   destination: '/find-a-dealer',
 * })
 * ```
 */
export function trackCTAClick(params: {
  blockType: string
  blockData: BlockWithTracking
  ctaText: string
  destination: string
  position?: number
  additionalProps?: Record<string, any>
}): void {
  trackWithConfig({
    blockType: params.blockType,
    blockData: params.blockData,
    action: 'cta_click',
    label: params.ctaText,
    position: params.position,
    trackingFieldName: 'ctaTracking',
    additionalProps: {
      destination: params.destination,
      ...params.additionalProps,
    },
  })
}

/**
 * Track a block impression (visibility)
 *
 * @example
 * ```typescript
 * useEffect(() => {
 *   trackBlockImpression({
 *     blockType: 'marketing-hero',
 *     blockData: { tracking },
 *   })
 * }, [])
 * ```
 */
export function trackBlockImpression(params: {
  blockType: string
  blockData: BlockWithTracking
  position?: number
  additionalProps?: Record<string, any>
}): void {
  trackWithConfig({
    blockType: params.blockType,
    blockData: params.blockData,
    action: 'impression',
    position: params.position,
    trackingFieldName: 'impressionTracking',
    additionalProps: params.additionalProps,
  })
}

/**
 * Track video interaction (play, pause, progress)
 *
 * @example
 * ```typescript
 * <video onPlay={() => trackVideoInteraction({
 *   blockType: 'marketing-i2l',
 *   blockData: { videoTracking },
 *   action: 'video_play',
 *   videoId: 'dQw4w9WgXcQ',
 * })} />
 * ```
 */
export function trackVideoInteraction(params: {
  blockType: string
  blockData: BlockWithTracking
  action: 'video_play' | 'video_pause' | 'video_progress' | 'video_complete'
  videoId: string
  videoTitle?: string
  progress?: number
  position?: number
}): void {
  trackWithConfig({
    blockType: params.blockType,
    blockData: params.blockData,
    action: params.action,
    label: params.videoTitle,
    position: params.position,
    trackingFieldName: 'videoTracking',
    additionalProps: {
      video_id: params.videoId,
      video_title: params.videoTitle,
      progress: params.progress,
    },
  })
}

/**
 * Track form interaction (start, submit)
 *
 * @example
 * ```typescript
 * trackFormInteraction({
 *   blockType: 'marketing-contact-form',
 *   blockData: { tracking },
 *   action: 'form_submit',
 *   formName: 'Contact Us',
 * })
 * ```
 */
export function trackFormInteraction(params: {
  blockType: string
  blockData: BlockWithTracking
  action: 'form_start' | 'form_submit'
  formName?: string
  position?: number
  additionalProps?: Record<string, any>
}): void {
  trackWithConfig({
    blockType: params.blockType,
    blockData: params.blockData,
    action: params.action,
    label: params.formName,
    position: params.position,
    additionalProps: params.additionalProps,
  })
}
