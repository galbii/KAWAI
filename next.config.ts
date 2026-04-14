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
      // Current R2 CDN (from NEXT_PUBLIC_S3_PUBLIC_URL)
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
      // Redirect old nested category URLs to flat collection URLs for SEO
      // e.g. /pianos/grand-pianos/gx-blak → /pianos/gx-blak
      {
        source: '/pianos/:category(upright-pianos|digital-pianos|hybrid-pianos|grand-pianos)/:slug',
        destination: '/pianos/:slug',
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
      // Relaxed CSP for the Payload admin UI (requires unsafe-inline + unsafe-eval)
      {
        source: '/admin(.*)',
        headers: [{ key: 'Content-Security-Policy', value: ADMIN_CSP }],
      },
      // Frontend CSP — edit src/lib/csp.ts to add/remove third-party domains
      {
        source: '/((?!admin).*)',
        headers: [{ key: 'Content-Security-Policy', value: buildCspHeader(isDev) }],
      },
    ]
  },
}

export default withPayload(nextConfig)
