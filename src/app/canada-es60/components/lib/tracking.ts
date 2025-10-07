/**
 * Meta Pixel & PostHog Tracking Utilities for ES60 Canada Landing Page
 *
 * Centralized tracking functions for Meta Pixel and PostHog events to ensure
 * consistent tracking across all components and slides.
 */

import posthog from 'posthog-js'

/**
 * Track "Find a Dealer" link clicks
 *
 * Fires both standard Contact event (for Meta ad optimization) and
 * custom ES60_DealerLinkClick event (for custom audiences and reporting)
 * Also tracks to PostHog for product analytics
 *
 * @param source - Identifier for where the click originated (e.g., 'es60_landing_page_opening')
 */
export const trackDealerLinkClick = (source: string) => {
  // Get UTM parameters from URL for attribution tracking
  const urlParams = new URLSearchParams(window.location.search);
  const utmCampaign = urlParams.get('utm_campaign') || 'direct';
  const utmSource = urlParams.get('utm_source') || 'direct';
  const utmMedium = urlParams.get('utm_medium') || 'none';
  const utmContent = urlParams.get('utm_content') || 'none';

  // Meta Pixel tracking - DISABLED per request
  if (typeof window !== 'undefined' && (window as any).fbq) {
    // DISABLED: Standard Meta event for dealer contact intent
    // (window as any).fbq('track', 'Contact', {
    //   content_name: 'Find a Dealer - ES60',
    //   content_category: 'Dealer Locator',
    //   utm_campaign: utmCampaign,
    //   utm_source: utmSource,
    //   utm_medium: utmMedium,
    //   utm_content: utmContent,
    //   source: source
    // });

    // DISABLED: ES60_DealerLinkClick custom event
    // (window as any).fbq('trackCustom', 'ES60_DealerLinkClick', {
    //   campaign: utmCampaign,
    //   source: source,
    //   intent: 'find_dealer'
    // });

    // console.log('🎯 Meta Pixel: Dealer link click tracked', { source, utmCampaign });
  }

  // PostHog tracking for product analytics
  if (posthog) {
    posthog.capture('canada_es60_dealer_link_click', {
      source: source,
      page: 'canada_es60',
      utm_campaign: utmCampaign,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_content: utmContent,
      intent: 'find_dealer'
    });

    console.log('📊 PostHog: Dealer link click tracked', { source, utmCampaign });
  }
};

/**
 * Track when users open the ES60 Bundle promotional popup
 *
 * Helps measure engagement with the bundle offer across different slides
 * Tracks to both Meta Pixel and PostHog
 *
 * @param source - Identifier for which slide triggered the popup (e.g., 'es60_landing_page_finale')
 */
export const trackBundlePopupOpen = (source: string) => {
  // Meta Pixel tracking - DISABLED per request
  if (typeof window !== 'undefined' && (window as any).fbq) {
    // DISABLED: ES60_BundlePopupOpen custom event
    // (window as any).fbq('trackCustom', 'ES60_BundlePopupOpen', {
    //   source: source,
    //   intent: 'view_bundle_offer'
    // });

    // console.log('🎯 Meta Pixel: Bundle popup open tracked', { source });
  }

  // PostHog tracking for product analytics
  if (posthog) {
    posthog.capture('canada_es60_bundle_popup_open', {
      source: source,
      page: 'canada_es60',
      intent: 'view_bundle_offer'
    });

    console.log('📊 PostHog: Bundle popup open tracked', { source });
  }
};

/**
 * Track when users click the "Find a Dealer" button in the bundle popup
 *
 * This tracks conversions from the promotional popup specifically
 * Tracks to both Meta Pixel and PostHog with bundle value
 *
 * @param source - Should be 'es60_bundle_popup' for popup tracking
 */
export const trackBundleDealerClick = (source: string = 'es60_bundle_popup') => {
  // Get UTM parameters from URL for attribution tracking
  const urlParams = new URLSearchParams(window.location.search);
  const utmCampaign = urlParams.get('utm_campaign') || 'direct';
  const utmSource = urlParams.get('utm_source') || 'direct';
  const utmMedium = urlParams.get('utm_medium') || 'none';
  const utmContent = urlParams.get('utm_content') || 'none';

  // Meta Pixel tracking - DISABLED per request
  if (typeof window !== 'undefined' && (window as any).fbq) {
    // DISABLED: Standard Meta event for dealer contact intent from bundle popup
    // (window as any).fbq('track', 'Contact', {
    //   content_name: 'Find a Dealer - ES60 Bundle',
    //   content_category: 'Dealer Locator',
    //   value: 499, // Bundle value
    //   currency: 'USD',
    //   utm_campaign: utmCampaign,
    //   utm_source: utmSource,
    //   utm_medium: utmMedium,
    //   utm_content: utmContent,
    //   source: source
    // });

    // DISABLED: ES60_DealerLinkClick custom event
    // (window as any).fbq('trackCustom', 'ES60_DealerLinkClick', {
    //   campaign: utmCampaign,
    //   source: source,
    //   intent: 'find_dealer_bundle'
    // });

    // console.log('🎯 Meta Pixel: Bundle dealer click tracked', { source, utmCampaign });
  }

  // PostHog tracking for product analytics
  if (posthog) {
    posthog.capture('canada_es60_bundle_dealer_click', {
      source: source,
      page: 'canada_es60',
      utm_campaign: utmCampaign,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_content: utmContent,
      intent: 'find_dealer_bundle',
      value: 499,
      currency: 'USD'
    });

    console.log('📊 PostHog: Bundle dealer click tracked', { source, utmCampaign });
  }
};
