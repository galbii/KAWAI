import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import { buildCspHeader, ADMIN_CSP } from './src/lib/csp'

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react', '@heroicons/react'],
  },
  webpack: (config, { isServer }) => {
    // Suppress Payload CMS dynamic import warning
    // This is intentional by Payload for loading migrations at runtime
    config.ignoreWarnings = [
      {
        module: /node_modules\/payload\/dist\/utilities\/dynamicImport\.js/,
        message: /Critical dependency: the request of a dependency is an expression/,
      },
    ]
    return config
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      // Primary R2 CDN via custom domain (assets.kawaius.com → officialkawai R2 bucket)
      {
        protocol: 'https',
        hostname: 'assets.kawaius.com',
        pathname: '/**',
      },
      // Legacy R2 dev URL — kept so existing DB records still resolve
      {
        protocol: 'https',
        hostname: 'pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev',
        pathname: '/**',
      },
      // Legacy R2 CDN hostnames
      {
        protocol: 'https',
        hostname: 'pub-8cc11ba1a6ef43369715136333c4b35a.r2.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-486ee03121a24ede8b51409434e22709.r2.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-8da77878131e4c099bb045b914814926.r2.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'kawaius.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.kawaius.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'kawai.com.au',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'berqwp-cdn.sfo3.cdn.digitaloceanspaces.com',
        pathname: '/**',
      },
      // Shopify CDN for product images
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/**',
      },
      // YouTube thumbnail images
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    // Disable ESLint during builds to allow deployment
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      // Legacy top-level category URLs from the pre-migration platform.
      // /digital-pianos is handled via CMS-managed redirect seed data; the other
      // three were missed during migration and were soft-404ing, dropping years
      // of accumulated rankings and backlinks.
      {
        source: '/grand-pianos',
        destination: '/pianos/grand',
        permanent: true,
      },
      {
        source: '/upright-pianos',
        destination: '/pianos/upright',
        permanent: true,
      },
      {
        source: '/hybrid-pianos',
        destination: '/pianos/hybrid',
        permanent: true,
      },
      // Redirect old nested category URLs to flat collection URLs for SEO
      // e.g. /pianos/grand-pianos/gx-blak → /pianos/gx-blak
      {
        source: '/pianos/:category(upright-pianos|digital-pianos|hybrid-pianos|grand-pianos)/:slug',
        destination: '/pianos/:slug',
        permanent: true,
      },
      // Redirect singular /product/ path to plural /products/ (canonical URL pattern)
      // Hardcoded /product/ links exist in ES60 slides, concert-artist, and legacy content
      {
        source: '/product/:slug*',
        destination: '/products/:slug*',
        permanent: true,
      },
      // The /company hub was consolidated into /about. Exact-match only —
      // /company/koichi-kawai, /company/awards, /company/our-philosophy are unaffected.
      {
        source: '/company',
        destination: '/about',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
    ]
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
  async headers() {
    const isDev = process.env.NODE_ENV === 'development'

    return [
      // Static security headers — applied to every route
      {
        source: '/(.*)',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()' },
        ],
      },
      // Edge-cache public HTML pages at Cloudflare.
      // s-maxage=300 matches the ISR revalidate window; stale-while-revalidate
      // lets Cloudflare serve stale HTML for an extra 10 minutes while the
      // origin generates a fresh copy in the background.
      // Excludes: API routes (dynamic/private), Payload admin (auth-gated),
      // Next.js internals (_next/static, _next/image already have their own headers).
      {
        source: '/((?!api|admin|_next).*)',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=300, stale-while-revalidate=600' },
        ],
      },
      // Relaxed CSP for the Payload admin UI (requires unsafe-inline + unsafe-eval).
      {
        source: '/admin(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: ADMIN_CSP },
        ],
      },
      // COEP credentialless + COOP same-origin-allow-popups enable SharedArrayBuffer,
      // required by @ffmpeg/ffmpeg v0.12 (browser-side video compression in the media manager).
      // Scoped to /admin/collections/media only — applying these to all admin routes breaks
      // live-preview in Firefox/Zen: the parent COEP: credentialless makes Firefox refuse to
      // load the preview iframe even when the frontend page has COEP: unsafe-none.
      {
        source: '/admin/collections/media(.*)',
        headers: [
          { key: 'Cross-Origin-Embedder-Policy', value: 'credentialless' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
        ],
      },
      // Frontend CSP — edit src/lib/csp.ts to add/remove third-party domains
      // COEP unsafe-none is the spec default but must be explicit on frontend pages so that
      // Firefox/Zen allows them to load inside the Payload admin live-preview iframe, which
      // runs under COEP: credentialless. Without an explicit value, Firefox blocks the iframe
      // with a "security configuration doesn't match" error even for same-origin embeds.
      {
        source: '/((?!admin).*)',
        headers: [
          { key: 'Content-Security-Policy', value: buildCspHeader(isDev) },
          { key: 'Cross-Origin-Embedder-Policy', value: 'unsafe-none' },
        ],
      },
    ]
  },
}

export default withPayload(nextConfig)
