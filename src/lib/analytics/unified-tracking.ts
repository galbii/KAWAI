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
 * GA4 ecommerce item for add_to_cart / purchase events
 * @see https://developers.google.com/analytics/devguides/collection/ga4/reference/events#add_to_cart
 */
export interface GA4EcommerceItem {
  item_id?: string | null
  item_name: string
  item_variant?: string | null
  item_category?: string | null
  price?: number | null
  quantity?: number
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
  | 'add_to_cart'
  | 'begin_checkout'

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
  /** GA4 ecommerce items array (for add_to_cart, purchase events) */
  ecommerceItems?: GA4EcommerceItem[] | undefined
  /** Currency code for ecommerce events */
  currency?: string | undefined
  /** Total monetary value for ecommerce events */
  value?: number | undefined
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

/** Meta Pixel standard events — use fbq('track') instead of fbq('trackCustom') */
const META_STANDARD_EVENTS = new Set([
  'AddPaymentInfo', 'AddToCart', 'AddToWishlist', 'CompleteRegistration',
  'Contact', 'CustomizeProduct', 'Donate', 'FindLocation', 'InitiateCheckout',
  'Lead', 'Purchase', 'Schedule', 'Search', 'StartTrial', 'SubmitApplication',
  'Subscribe', 'ViewContent',
])

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
    ecommerceItems,
    currency,
    value: ecommerceValue,
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
      const ga4Payload: Record<string, unknown> = {
        event_category: category,
        event_label: label,
        ...eventData,
      }
      // For ecommerce events, add the structured items array GA4 expects
      if (ecommerceItems && ecommerceItems.length > 0) {
        ga4Payload.items = ecommerceItems
        ga4Payload.currency = currency || 'USD'
        if (ecommerceValue !== undefined) {
          ga4Payload.value = ecommerceValue
        }
      }
      window.gtag('event', ga4EventName, ga4Payload)
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
      // Standard events use fbq('track') so the Meta algorithm can use them for optimization
      const metaMethod = META_STANDARD_EVENTS.has(metaEventName) ? 'track' : 'trackCustom'
      const metaPayload: Record<string, unknown> = { ...eventData }
      // For AddToCart / InitiateCheckout, pass the structured params Meta expects for purchase optimization
      if ((metaEventName === 'AddToCart' || metaEventName === 'InitiateCheckout') && ecommerceItems && ecommerceItems.length > 0) {
        metaPayload.content_ids = ecommerceItems.map(i => i.item_id).filter(Boolean)
        metaPayload.content_type = 'product'
        metaPayload.currency = currency || 'USD'
        metaPayload.value = ecommerceValue ?? ecommerceItems.reduce(
          (sum, i) => sum + ((i.price ?? 0) * (i.quantity ?? 1)), 0
        )
        metaPayload.num_items = ecommerceItems.reduce((sum, i) => sum + (i.quantity ?? 1), 0)
      }
      window.fbq(metaMethod, metaEventName, metaPayload)
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
  // begin_checkout always maps to its GA4 standard name — not subject to CMS add_to_cart override
  if (action === 'begin_checkout') return 'begin_checkout'

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
  // begin_checkout always maps to InitiateCheckout — not subject to CMS AddToCart override
  if (action === 'begin_checkout') return 'InitiateCheckout'

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
  if (action === 'add_to_cart') return 'AddToCart'

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

/**
 * Track an add to cart event with structured GA4 ecommerce items and Meta Pixel params.
 * Product data auto-populates GA4 items array and Meta content_ids.
 *
 * @example
 * ```typescript
 * trackAddToCart({
 *   blockType: 'product-hero',
 *   blockData: { ctaTracking },
 *   productName: product.name,
 *   variantId: selectedVariant.id,
 *   variantName: 'Ebony Polish',
 *   price: selectedVariant.price,
 *   currency: shopifyProduct.price.currency,
 *   productId: shopifyProduct.handle,
 *   productCategory: shopifyProduct.type,
 *   additionalProps: { button_type: 'buy_now' },
 * })
 * ```
 */
export function trackAddToCart(params: {
  blockType: string
  blockData: BlockWithTracking
  productName: string
  variantId: string
  variantName?: string | null
  price?: number | null
  /** Currency code (e.g. 'USD') — used for GA4 and Meta Pixel */
  currency?: string
  /** Shopify product handle or stable product ID for item_id */
  productId?: string | null
  /** Product type/category for GA4 item_category */
  productCategory?: string | null
  quantity?: number
  position?: number
  additionalProps?: Record<string, unknown>
}): void {
  const quantity = params.quantity ?? 1
  const price = params.price ?? 0
  const totalValue = price * quantity

  const item: GA4EcommerceItem = {
    item_id: params.productId ?? params.variantId,
    item_name: params.productName,
    item_variant: params.variantName ?? null,
    item_category: params.productCategory ?? null,
    price: price > 0 ? price : null,
    quantity,
  }

  trackWithConfig({
    blockType: params.blockType,
    blockData: params.blockData,
    action: 'add_to_cart',
    label: params.productName,
    position: params.position,
    trackingFieldName: 'ctaTracking',
    ecommerceItems: [item],
    currency: params.currency,
    value: totalValue > 0 ? totalValue : undefined,
    additionalProps: {
      variant_id: params.variantId,
      variant_name: params.variantName,
      price: params.price,
      ...params.additionalProps,
    },
  })
}

/**
 * Track checkout initiation — fires GA4 `begin_checkout` and Meta Pixel `InitiateCheckout`.
 * Call alongside trackAddToCart whenever a button directly initiates a purchase flow.
 *
 * Early returns in mapToGA4Event / mapToMetaEvent ensure this always fires the correct
 * standard events regardless of the CMS `ga4EventType` / `metaEventType` config.
 *
 * @example
 * ```typescript
 * onSuccess={() => {
 *   trackAddToCart({ ... })
 *   trackBeginCheckout({ ... })  // same params
 * }}
 * ```
 */
export function trackBeginCheckout(params: {
  blockType: string
  blockData: BlockWithTracking
  productName: string
  variantId: string
  variantName?: string | null
  price?: number | null
  currency?: string
  productId?: string | null
  productCategory?: string | null
  quantity?: number
  position?: number
  additionalProps?: Record<string, unknown>
}): void {
  const quantity = params.quantity ?? 1
  const price = params.price ?? 0
  const totalValue = price * quantity

  const item: GA4EcommerceItem = {
    item_id: params.productId ?? params.variantId,
    item_name: params.productName,
    item_variant: params.variantName ?? null,
    item_category: params.productCategory ?? null,
    price: price > 0 ? price : null,
    quantity,
  }

  trackWithConfig({
    blockType: params.blockType,
    blockData: params.blockData,
    action: 'begin_checkout',
    label: params.productName,
    position: params.position,
    trackingFieldName: 'ctaTracking',
    ecommerceItems: [item],
    currency: params.currency,
    value: totalValue > 0 ? totalValue : undefined,
    additionalProps: {
      variant_id: params.variantId,
      variant_name: params.variantName,
      price: params.price,
      ...params.additionalProps,
    },
  })
}
