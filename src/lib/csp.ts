/**
 * Content Security Policy configuration.
 *
 * To add a new third-party service, find the right directive below and add the domain.
 * Each directive is a plain array — one domain per line makes diffs readable.
 *
 * Directive reference:
 *   script-src  — <script src>, inline <script>, dynamically created scripts
 *   style-src   — <link rel=stylesheet>, inline <style>
 *   img-src     — <img>, CSS background-image
 *   font-src    — @font-face
 *   frame-src   — <iframe src> (what this page embeds)
 *   connect-src — fetch(), XHR, WebSocket
 *   media-src   — <video>, <audio>
 *   worker-src  — new Worker()
 */

type Directive = string[]
type CspDirectives = Record<string, Directive>

export function buildCspHeader(isDev: boolean): string {
  const directives: CspDirectives = {
    'default-src': ["'self'"],

    'script-src': [
      "'self'",
      "'unsafe-inline'", // required for GTM, Meta Pixel inline snippets
      ...(isDev ? ["'unsafe-eval'"] : []), // Turbopack source maps in dev only

      // Google
      'https://www.googletagmanager.com',
      'https://maps.googleapis.com',

      // Meta
      'https://connect.facebook.net',

      // Calendly
      'https://assets.calendly.com',

      // YouTube
      'https://www.youtube.com',
      'https://s.ytimg.com',

      // PostHog (proxied via /ingest/*)
      'https://us-assets.i.posthog.com',
      'https://us.i.posthog.com',

      // HubSpot — js.hsforms.net loads the embed, static.hsappstatic.net serves the JS bundle
      'https://js.hsforms.net',
      'https://static.hsappstatic.net',
      'https://js.hs-scripts.com',
      'https://js.hubspot.com',

      // Shopify
      'https://cdn.shopify.com',
    ],

    'style-src': [
      "'self'",
      "'unsafe-inline'", // required: Google Fonts injects inline styles, HubSpot form styles

      // Google Fonts
      'https://fonts.googleapis.com',

      // Calendly
      'https://assets.calendly.com',

      // HubSpot
      'https://static.hsappstatic.net',
    ],

    'font-src': [
      "'self'",
      'https://fonts.gstatic.com',
      'https://static.hsappstatic.net', // HubSpot form fonts
    ],

    'img-src': [
      "'self'",
      'data:',
      'blob:',

      // Cloudflare R2 — wildcard covers all bucket account IDs
      'https://*.r2.dev',

      // Google (Analytics, GTM, Maps tiles — *.googleapis.com covers all subdomains)
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com',
      'https://*.googleapis.com',
      'https://*.gstatic.com',

      // Meta
      'https://www.facebook.com',

      // YouTube thumbnails
      'https://img.youtube.com',
      'https://i.ytimg.com',

      // Shopify
      'https://cdn.shopify.com',

      // Social
      'https://www.instagram.com',
      'https://i1.sndcdn.com', // SoundCloud artwork

      // HubSpot
      'https://track.hubspot.com',
      'https://static.hsappstatic.net',

      // Kawai legacy CDN
      'https://kawaius.com',
      'https://cdn.kawaius.com',
    ],

    'connect-src': [
      "'self'",

      // PostHog (proxied via /ingest/*)
      'https://us.i.posthog.com',
      'https://us-assets.i.posthog.com',

      // Google Analytics + Maps API (*.googleapis.com covers Places, Geocoding, Directions)
      'https://www.google-analytics.com',
      'https://analytics.google.com',
      'https://*.googleapis.com',

      // Calendly
      'https://api.calendly.com',

      // Social
      'https://api.instagram.com',
      'https://api.soundcloud.com',

      // YouTube player requests
      'https://www.youtube.com',

      // HubSpot form submissions + tracking
      'https://api.hsforms.com',
      'https://forms.hsforms.com',
      'https://track.hubspot.com',

      // Shopify storefront/cart API + analytics beacon
      'https://*.myshopify.com',
      'https://monorail-edge.shopifysvc.com',
    ],

    'frame-src': [
      "'self'",

      // Calendly booking widget
      'https://calendly.com',

      // YouTube (youtube-nocookie.com is the privacy-enhanced embed domain)
      'https://www.youtube.com',
      'https://www.youtube-nocookie.com',

      // SoundCloud player
      'https://w.soundcloud.com',

      // Instagram embeds
      'https://www.instagram.com',

      // Google Maps Street View
      'https://www.google.com',

      // HubSpot — js.hsforms.net hosts the form iframe; forms/share.hsforms.com are fallbacks
      'https://js.hsforms.net',
      'https://forms.hsforms.com',
      'https://share.hsforms.com',

      // Shopify checkout
      'https://checkout.shopify.com',
    ],

    // *.googlevideo.com serves YouTube video stream data
    'media-src': ["'self'", 'blob:', 'https://*.r2.dev', 'https://cdn.shopify.com', 'https://*.googlevideo.com'],

    'worker-src': ["'self'", 'blob:'],

    // Rewrite http:// resource requests to https:// automatically
    'upgrade-insecure-requests': [],
  }

  return Object.entries(directives)
    .map(([key, values]) => (values.length ? `${key} ${values.join(' ')}` : key))
    .join('; ')
}

/** Relaxed policy for the Payload admin panel which requires unsafe-inline + unsafe-eval */
export const ADMIN_CSP = "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:;"
