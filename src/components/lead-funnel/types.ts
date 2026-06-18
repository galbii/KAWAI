/**
 * Lead Funnel — shared types
 *
 * A modular, plug-and-play multi-step lead-capture popup:
 *   Step 1 (Offer + Contact) → save lead to Shopify
 *   Step 2 (ZIP → 5 nearest dealers) → tag customer with chosen dealer
 *   Step 3 (Thank you) → "visit in person" CTA to the dealer's page
 *
 * Drop <LeadFunnelPopup config={...} /> into any page (wrapped in
 * <LeadFunnelProvider> if you also want manual CTA triggers). A future
 * Payload CMS block can map block fields → LeadFunnelConfig and render the
 * same component.
 */

export type LeadFunnelTheme = 'light' | 'dark' | 'red'

/** A slim dealer record returned by the findNearestDealers server action. */
export interface NearestDealer {
  slug: string
  dealerName: string
  city: string | null
  state: string | null
  phone: string | null
  /** Distance from the searched ZIP in miles. */
  distance: number
}

export interface LeadFunnelConfig {
  /**
   * Theme for the modal chrome. Defaults to 'light'.
   */
  theme?: LeadFunnelTheme

  /** Copy for step 1 (offer + contact). */
  offer?: {
    /** Big headline, e.g. "Save on your next Kawai". */
    heading?: string
    /** Supporting line under the headline. */
    subheading?: string
    /** Submit button text. Defaults to "Get my discount". */
    submitText?: string
    /**
     * Consent disclaimer shown above/near the submit button. A sensible
     * default is used if omitted.
     */
    consentText?: string
  }

  /** Copy for step 2 (dealer locator). */
  dealers?: {
    heading?: string
    subheading?: string
    /** Button text for the ZIP search. Defaults to "Find dealers". */
    submitText?: string
  }

  /** Copy for step 3 (thank you). */
  thankYou?: {
    heading?: string
    /**
     * Body message. `{dealer}` is replaced with the chosen dealer name.
     * Defaults to a "the dealer will contact you shortly" message.
     */
    message?: string
    /** Visit-in-person button text. Defaults to "Visit in person today". */
    ctaText?: string
  }

  /**
   * Shopify tags applied to every lead from this placement, in addition to
   * the always-on 'lead-funnel' + 'newsletter' tags. Use to segment by source
   * (e.g. ['source-brand-page']).
   */
  tags?: string[]

  /** Trigger behaviour. */
  behavior?: {
    /** Auto-show the popup. Defaults to true. */
    autoShow?: boolean
    /** Delay before auto-show, in ms. Defaults to 5000. */
    autoShowDelay?: number
    /** Also open when the user scrolls past 30% of the page. Defaults to true. */
    triggerOnScroll?: boolean
    /** Only auto-show once per browser (localStorage). Defaults to true. */
    showOncePerSession?: boolean
    /** localStorage key for the once-per-session guard. */
    storageKey?: string
  }

  /** Modal size. Defaults to 'md'. */
  size?: 'sm' | 'md' | 'lg' | 'xl'
}
