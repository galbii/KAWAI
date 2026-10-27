/**
 * Shopify Analytics for the headless storefront
 *
 * Feeds storefront activity (sessions, page/product views, add-to-cart) into
 * Shopify Admin → Analytics under the Headless channel, and stamps the same
 * visitor/session tokens onto cart requests so checkouts attribute back to the
 * storefront visit. Checkout/order events need nothing here — Shopify records
 * those itself on its hosted checkout.
 *
 * How the pieces fit (Shopify retired the `_shopify_y`/`_shopify_s` cookies in 2026):
 * 1. `ensureShopifyCookies()` asks our same-origin Storefront API proxy
 *    (`src/app/api/[sfVersion]/graphql.json/route.ts`) to set Shopify's new
 *    HttpOnly tracking cookies on our domain.
 * 2. The Customer Privacy API (consent-tracking-api) loads in backend-consent
 *    mode and becomes the source of the visitor/session tokens.
 * 3. `CookieConsentBanner` pushes the visitor's choice in via
 *    `applyShopifyConsent()`; events only send when analytics is allowed.
 *
 * Mirrors Hydrogen 2026.4's `useCustomerPrivacy` + `ShopifyAnalytics`.
 * Shopify documents this setup for custom frameworks but doesn't officially
 * support it — if events stop appearing, diff against that implementation.
 *
 * Browser-only. Every export is a no-op on the server and never throws —
 * analytics failures must not interrupt browsing or checkout.
 */

import {
  AnalyticsEventName,
  AnalyticsPageType,
  ShopifySalesChannel,
  getClientBrowserParameters,
  getTrackingValues,
  sendShopifyAnalytics,
} from '@shopify/hydrogen-react'
import type { ShopifyAnalyticsProduct, ShopifyPageViewPayload } from '@shopify/hydrogen-react'
import type { SimpleCart } from './types'

// ============================================================================
// Store configuration
// ============================================================================

type ShopifyStoreAnalyticsConfig = {
  /** `gid://shopify/Shop/<id>` — from `{ shop { id } }` on the Storefront API */
  shopId: string
  currency: 'USD' | 'CAD'
  storefrontAccessToken: string
  /**
   * Host for the monorail beacon (`/.well-known/shopify/monorail`). A
   * Shopify-served domain under our root domain keeps the beacon first-party
   * and past most ad blockers; `undefined` falls back to monorail-edge.
   */
  monorailDomain: string | undefined
  /**
   * Root domain shared by the storefront and checkout, dot-prefixed. Only set
   * when checkout really lives under our domain — the CA store checks out on
   * myshopify.com, so it has none.
   */
  storefrontRootDomain: string | undefined
}

const STORES: Record<'us' | 'cad', ShopifyStoreAnalyticsConfig> = {
  us: {
    shopId: 'gid://shopify/Shop/74046701723',
    currency: 'USD',
    storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? '',
    monorailDomain: 'shop.kawaius.com',
    storefrontRootDomain: '.kawaius.com',
  },
  cad: {
    shopId: 'gid://shopify/Shop/66716532870',
    currency: 'CAD',
    storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_CA_STOREFRONT_ACCESS_TOKEN ?? '',
    monorailDomain: undefined,
    storefrontRootDomain: undefined,
  },
}

const CONSENT_API_SCRIPT =
  'https://cdn.shopify.com/shopifycloud/consent-tracking-api/v0.2/consent-tracking-api.js'

/** Same detection as cart.ts / cart-storage.ts — no prop threading needed. */
function getStore(): ShopifyStoreAnalyticsConfig {
  return window.location.hostname.startsWith('ca.') ? STORES.cad : STORES.us
}

/** Local dev and Vercel previews would pollute production Shopify reports. */
function isTrackedHost(): boolean {
  const host = window.location.hostname
  return host === 'kawaius.com' || host.endsWith('.kawaius.com')
}

// ============================================================================
// Customer Privacy API
// ============================================================================

type VisitorConsent = {
  analytics: boolean
  marketing: boolean
  preferences: boolean
  sale_of_data: boolean
}

type CustomerPrivacy = {
  setTrackingConsent: (
    consent: VisitorConsent & Record<string, unknown>,
    callback: (result?: { error?: string }) => void
  ) => void
  currentVisitorConsent: () => Partial<Record<keyof VisitorConsent, 'yes' | 'no' | ''>>
  analyticsProcessingAllowed: () => boolean
  marketingAllowed: () => boolean
  saleOfDataAllowed: () => boolean
  cachedConsent?: string
}

declare global {
  interface Window {
    // Assigned by Shopify's consent-tracking-api script; see loadCustomerPrivacy()
    Shopify?: { customerPrivacy?: CustomerPrivacy | { backendConsentEnabled: true } }
  }
}

let privacyReady: Promise<CustomerPrivacy | null> | null = null

// Events wait for the banner's first consent sync so the landing page view
// isn't judged against a not-yet-recorded choice. Restricted-region visitors
// who haven't chosen never sync, hence the timeout.
let markConsentSynced: () => void = () => {}
const consentSynced = new Promise<void>(resolve => {
  markConsentSynced = resolve
})
const CONSENT_SYNC_TIMEOUT_MS = 3000

/**
 * Ask the proxy to set Shopify's tracking cookies (the `ensureCookies` query
 * hydrogen-react's `useShopifyCookies({ fetchTrackingValues: true })` sends —
 * inlined because that export is a React hook).
 */
async function ensureShopifyCookies(store: ShopifyStoreAnalyticsConfig): Promise<void> {
  const { uniqueToken, visitToken } = getTrackingValues()
  const response = await fetch('/api/unstable/graphql.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': store.storefrontAccessToken,
      'Shopify-Storefront-Consent-Management': '1',
      ...(uniqueToken || visitToken
        ? { 'X-Shopify-UniqueToken': uniqueToken, 'X-Shopify-VisitToken': visitToken }
        : {}),
    },
    body: JSON.stringify({
      query:
        'query ensureCookies { consentManagement { cookies(visitorConsent:{}) { trackingConsentCookie cookieDomain shopifyUnique shopifyVisit } } }',
    }),
  })
  // Read the body: until it's consumed the request never completes, so it
  // never gets a resource-timing entry — and that entry's Server-Timing
  // (`_y` / `_s`) is where the consent API reads the visitor/session tokens.
  // Unread, repeat visitors (whose consent is unchanged) send empty tokens.
  await response.text()
}

/**
 * Load the Customer Privacy API in backend-consent mode. The script assigns
 * `window.Shopify = {}` and then `window.Shopify.customerPrivacy = api`; the
 * `{ backendConsentEnabled: true }` stub it reads in between is what switches
 * it to the server-set cookies instead of the retired `_shopify_y`/`_s`.
 */
function loadCustomerPrivacy(): Promise<CustomerPrivacy | null> {
  return new Promise(resolve => {
    let shopify = window.Shopify
    let api: CustomerPrivacy | null = null
    const stub = { backendConsentEnabled: true as const }

    Object.defineProperty(window, 'Shopify', {
      configurable: true,
      get: () => shopify,
      set(value: Window['Shopify']) {
        shopify = value
        if (!value || typeof value !== 'object' || Object.keys(value).length > 0) return
        Object.defineProperty(value, 'customerPrivacy', {
          configurable: true,
          get: () => api ?? stub,
          set(next: unknown) {
            if (next && typeof next === 'object' && 'setTrackingConsent' in next) {
              api = next as CustomerPrivacy
              const { consent } = getTrackingValues()
              if (!api.cachedConsent && consent) api.cachedConsent = consent
              resolve(api)
            }
          },
        })
      },
    })

    const script = document.createElement('script')
    script.id = 'customer-privacy-api'
    script.async = true
    script.src = CONSENT_API_SCRIPT
    script.onerror = () => resolve(null)
    document.head.appendChild(script)
  })
}

function getCustomerPrivacy(): Promise<CustomerPrivacy | null> {
  if (typeof window === 'undefined' || !isTrackedHost()) return Promise.resolve(null)
  privacyReady ??= ensureShopifyCookies(getStore())
    .catch(() => {})
    .then(loadCustomerPrivacy)
    .catch(() => null)
  return privacyReady
}

/**
 * Record the visitor's cookie-banner choice with Shopify. Called by
 * `CookieConsentBanner` on load and whenever the choice changes. Skips the
 * network round-trip when Shopify already holds the same choice.
 *
 * Mapping: Shopify's `preferences` follows analytics (we have no separate
 * functional category); `sale_of_data` follows marketing, which is the
 * CCPA/CPRA "do not sell or share" opt-out.
 */
export async function applyShopifyConsent(analytics: boolean, marketing: boolean): Promise<void> {
  try {
    await setShopifyConsent(analytics, marketing)
  } finally {
    markConsentSynced()
  }
}

async function setShopifyConsent(analytics: boolean, marketing: boolean): Promise<void> {
  const privacy = await getCustomerPrivacy()
  if (!privacy) return

  const consent: VisitorConsent = {
    analytics,
    marketing,
    preferences: analytics,
    sale_of_data: marketing,
  }

  const current = privacy.currentVisitorConsent()
  const unchanged = (Object.keys(consent) as Array<keyof VisitorConsent>).every(
    key => current[key] === (consent[key] ? 'yes' : 'no')
  )
  if (unchanged) return

  const store = getStore()
  await new Promise<void>(resolve => {
    try {
      privacy.setTrackingConsent(
        {
          ...consent,
          headlessStorefront: true,
          // Consent requests go through our same-origin proxy, not checkout
          checkoutRootDomain: window.location.host,
          storefrontRootDomain: store.storefrontRootDomain,
          storefrontAccessToken: store.storefrontAccessToken,
        },
        () => resolve()
      )
    } catch {
      resolve()
    }
  })
}

// ============================================================================
// Events
// ============================================================================

async function basePayload() {
  // URL/referrer now, before any wait — the visitor may navigate meanwhile
  const browser = getClientBrowserParameters()
  await Promise.race([
    consentSynced,
    new Promise(resolve => setTimeout(resolve, CONSENT_SYNC_TIMEOUT_MS)),
  ])
  const privacy = await getCustomerPrivacy()
  if (!privacy || !privacy.analyticsProcessingAllowed()) return null

  const store = getStore()
  const marketingAllowed = privacy.marketingAllowed()
  const saleOfDataAllowed = privacy.saleOfDataAllowed()
  // Tokens only exist once the Customer Privacy API has loaded
  const { uniqueToken, visitToken } = getTrackingValues()

  return {
    store,
    payload: {
      ...browser,
      uniqueToken,
      visitToken,
      shopifySalesChannel: ShopifySalesChannel.headless,
      shopId: store.shopId,
      currency: store.currency,
      acceptedLanguage: 'EN' as const,
      hasUserConsent: true,
      analyticsAllowed: true,
      marketingAllowed,
      saleOfDataAllowed,
      // Read by the monorail schema, not part of hydrogen-react's public type
      ccpaEnforced: !saleOfDataAllowed,
      gdprEnforced: !marketingAllowed,
    },
  }
}

function send(event: Parameters<typeof sendShopifyAnalytics>[0], store: ShopifyStoreAnalyticsConfig) {
  sendShopifyAnalytics(event, store.monorailDomain).catch(() => {})
}

/** Page view — fired by PageViewTracker on every route change. */
export async function trackShopifyPageView(): Promise<void> {
  if (typeof window === 'undefined' || window.location.pathname.startsWith('/admin')) return
  const base = await basePayload().catch(() => null)
  if (!base) return
  send({ eventName: AnalyticsEventName.PAGE_VIEW, payload: base.payload }, base.store)
}

export type ShopifyViewedProduct = {
  /** Product ID, numeric or `gid://shopify/Product/<id>` */
  productId: string
  /** Variant ID, numeric or `gid://shopify/ProductVariant/<id>` */
  variantId: string
  name: string
  variantName?: string | null
  brand: string
  category?: string | null
  sku?: string | null
  price: number
}

const toGid = (type: 'Product' | 'ProductVariant' | 'Cart', id: string) =>
  id.startsWith('gid://') ? id : `gid://shopify/${type}/${id}`

function toAnalyticsProduct(product: ShopifyViewedProduct, quantity?: number): ShopifyAnalyticsProduct {
  return {
    productGid: toGid('Product', product.productId),
    variantGid: toGid('ProductVariant', product.variantId),
    name: product.name,
    variantName: product.variantName ?? '',
    brand: product.brand,
    ...(product.category ? { category: product.category } : {}),
    ...(product.sku ? { sku: product.sku } : {}),
    price: String(product.price),
    ...(quantity ? { quantity } : {}),
  }
}

/** Product view — fired once per product by the product hero. */
export async function trackShopifyProductView(product: ShopifyViewedProduct): Promise<void> {
  const base = await basePayload().catch(() => null)
  if (!base) return
  const payload: ShopifyPageViewPayload = {
    ...base.payload,
    pageType: AnalyticsPageType.product,
    resourceId: toGid('Product', product.productId),
    products: [toAnalyticsProduct(product)],
    totalValue: product.price,
  }
  send({ eventName: AnalyticsEventName.PRODUCT_VIEW, payload }, base.store)
}

/**
 * Add to cart — fired by `addVariantToCart` with the cart Shopify returned.
 * Reads the line back off the cart so price/title are what Shopify charged.
 */
export async function trackShopifyAddToCart(
  cart: SimpleCart,
  variantId: string,
  quantity: number,
  brand = 'Kawai'
): Promise<void> {
  const line = cart.lines.find(l => toGid('ProductVariant', l.variantId) === toGid('ProductVariant', variantId))
  if (!line) return
  const base = await basePayload().catch(() => null)
  if (!base) return
  send(
    {
      eventName: AnalyticsEventName.ADD_TO_CART,
      payload: {
        ...base.payload,
        cartId: toGid('Cart', cart.id),
        totalValue: line.price * quantity,
        products: [
          toAnalyticsProduct(
            {
              productId: line.productId,
              variantId: line.variantId,
              name: line.productTitle,
              variantName: line.variantTitle,
              brand,
              price: line.price,
            },
            quantity
          ),
        ],
      },
    },
    base.store
  )
}

/**
 * Visitor/session tokens for Storefront API cart requests, so the checkout
 * Shopify builds from the cart joins the storefront session. Empty until the
 * Customer Privacy API has loaded, or when analytics is declined.
 */
export function getShopifyTrackingHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const privacy = window.Shopify?.customerPrivacy
  if (!privacy || !('analyticsProcessingAllowed' in privacy) || !privacy.analyticsProcessingAllowed()) {
    return {}
  }
  const { uniqueToken, visitToken } = getTrackingValues()
  if (!uniqueToken && !visitToken) return {}
  return { 'X-Shopify-UniqueToken': uniqueToken, 'X-Shopify-VisitToken': visitToken }
}
