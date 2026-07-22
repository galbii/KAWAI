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

export function buildCspHeader(_isDev: boolean): string {
  const directives: CspDirectives = {
    'default-src': ["'self'"],

    'script-src': [
      "'self'",
      "'unsafe-inline'", // required for GTM, Meta Pixel inline snippets
      // GTM Custom HTML tags that reference variables ({{Click URL}} etc.) require eval() at runtime.
      // Turbopack also needs it in dev for source maps.
      "'unsafe-eval'",

      // Google
      'https://www.googletagmanager.com',
      'https://maps.googleapis.com',

      // Google Ads — conversion tag scripts load from googleads.g.doubleclick.net
      'https://googleads.g.doubleclick.net',

      // Meta
      'https://connect.facebook.net',

      // Calendly
      'https://assets.calendly.com',

      // YouTube
      'https://www.youtube.com',
      'https://s.ytimg.com',

      // PostHog — wildcard covers us.i, us-assets.i, and toolbar domains (internal-j, us.posthog.com)
      'https://*.posthog.com',
      'https://*.i.posthog.com',

      // HubSpot — js.hsforms.net loads the embed, static.hsappstatic.net serves the JS bundle
      'https://js.hsforms.net',
      'https://static.hsappstatic.net',
      'https://js.hs-scripts.com',
      'https://js.hubspot.com',

      // Shopify
      'https://cdn.shopify.com',

      // Cloudflare Web Analytics beacon (injected by Cloudflare at the edge)
      'https://static.cloudflareinsights.com',

      // Kawai 3D model viewer (proxied via /api/3d-viewer-proxy) loads these directly:
      //   cdn.jsdelivr.net — @google/model-viewer + qrcodejs
      //   www.gstatic.com  — Draco decoder (draco_wasm_wrapper.js)
      // The proxied HTML runs same-origin, so it inherits this page's CSP.
      'https://cdn.jsdelivr.net',
      'https://www.gstatic.com',
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

      // PostHog toolbar stylesheet
      'https://us.i.posthog.com',
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

      // Google (Analytics, GTM, Maps tiles — wildcards cover all regional subdomains)
      // googlesyndication.com covers Google Ads conversion pixel pings
      'https://*.google-analytics.com',
      'https://www.googletagmanager.com',
      'https://www.google.com',           // conversion beacons: /pagead/1p-conversion/, /ccm/collect, /rmkt/collect/
      'https://*.doubleclick.net',        // Google Ads conversion/viewthrough pixels (ad./td./stats.g./googleads.g.)
      'https://*.googleapis.com',
      'https://*.gstatic.com',
      'https://pagead2.googlesyndication.com',

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
      'blob:', // model-viewer decodes the .glb into a blob: URL and re-fetches it


      // PostHog — wildcard covers all endpoints including toolbar (internal-j, us.posthog.com)
      'https://*.posthog.com',
      'https://*.i.posthog.com',

      // Google Analytics — wildcard covers regional subdomains (region1/region2 added June 2022)
      // stats.g.doubleclick.net receives GA4 data by default even without Google Ads
      // www.googletagmanager.com needed in connect-src so GTM can fetch its own container config
      // pagead2.googlesyndication.com — Google Ads conversion measurement (ccm/collect endpoint)
      // www.google.com — Enhanced Conversions (/pagead/1p-conversion/), consent mode (/ccm/collect), remarketing (/rmkt/collect/)
      // *.doubleclick.net — Google Ads conversion/enhanced-conversion beacons: ad. + td. (ccm/s/collect),
      //   stats.g. (GA4 default), googleads.g. (viewthrough). Wildcard so rotating ccm endpoints don't break it.
      'https://www.googletagmanager.com',
      'https://*.google-analytics.com',
      'https://analytics.google.com',
      'https://www.google.com',
      'https://*.doubleclick.net',
      'https://pagead2.googlesyndication.com',
      // Google Maps API (*.googleapis.com covers Places, Geocoding, Directions)
      'https://*.googleapis.com',

      // Kawai 3D model viewer — Draco decoder .wasm is fetched (not <script>) from gstatic.
      // The model .glb itself is proxied same-origin via /api/3d-viewer-proxy ('self' covers it).
      'https://www.gstatic.com',

      // Calendly
      'https://api.calendly.com',

      // Social
      'https://api.instagram.com',
      'https://api.soundcloud.com',

      // YouTube player requests
      'https://www.youtube.com',

      // Meta Pixel — fbq('track') sends event data to /tr endpoint via XHR/beacon
      'https://www.facebook.com',
      // NOTE (intentional omission): fbevents.js also probes rotating "captured
      // event endpoint" hosts (random subdomains of *.run.app / *.on.aws hitting
      // /events?cee=no). Those are per-session random hostnames on open PaaS
      // domains — allowlisting them would require wildcarding all of Google
      // Cloud Run / AWS ECS, gutting the CSP. Leave them blocked; the pixel
      // falls back to www.facebook.com/tr. The console CSP errors they cause
      // are expected and harmless.

      // Cloudflare Web Analytics beacon submits RUM data here
      'https://cloudflareinsights.com',

      // HubSpot form submissions + tracking
      'https://api.hsforms.com',
      'https://forms.hsforms.com',
      'https://track.hubspot.com',

      // Shopify storefront/cart API + analytics beacon
      'https://*.myshopify.com',
      'https://monorail-edge.shopifysvc.com',

      // OpenFreeMap — map tile styles and vector tiles for the dealer locator
      'https://tiles.openfreemap.org',

      // Carto — dark-matter tile style for the Shigeru Kawai dealer map
      'https://basemaps.cartocdn.com',
      'https://*.basemaps.cartocdn.com',
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

      // Meta Pixel occasionally frames facebook.com for cookie matching
      'https://www.facebook.com',
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
