import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
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
    const globalHeaders = [
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
      },
    ]

    const frontendCSP = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net https://maps.googleapis.com https://assets.calendly.com https://www.youtube.com https://us-assets.i.posthog.com https://us.i.posthog.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://assets.calendly.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com https://www.facebook.com https://maps.googleapis.com https://maps.gstatic.com https://img.youtube.com https://i.ytimg.com https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev https://pub-8cc11ba1a6ef43369715136333c4b35a.r2.dev https://pub-486ee03121a24ede8b51409434e22709.r2.dev https://pub-8da77878131e4c099bb045b914814926.r2.dev https://cdn.shopify.com https://www.instagram.com https://i1.sndcdn.com https://kawaius.com https://cdn.kawaius.com",
      "connect-src 'self' https://us.i.posthog.com https://us-assets.i.posthog.com https://www.google-analytics.com https://analytics.google.com https://maps.googleapis.com https://api.calendly.com https://api.instagram.com https://api.soundcloud.com",
      "frame-src 'self' https://calendly.com https://www.youtube.com https://w.soundcloud.com https://www.instagram.com",
      "media-src 'self' blob: https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev https://pub-8cc11ba1a6ef43369715136333c4b35a.r2.dev https://pub-486ee03121a24ede8b51409434e22709.r2.dev https://pub-8da77878131e4c099bb045b914814926.r2.dev https://cdn.shopify.com",
      "worker-src 'self' blob:",
      "upgrade-insecure-requests",
    ].join('; ')

    const adminCSP = "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:;"

    return [
      // Global security headers — applied to all routes
      {
        source: '/(.*)',
        headers: globalHeaders,
      },
      // CSP for admin routes — relaxed to allow Payload admin UI
      {
        source: '/admin(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: adminCSP },
        ],
      },
      // CSP for all non-admin routes
      {
        source: '/((?!admin).*)',
        headers: [
          { key: 'Content-Security-Policy', value: frontendCSP },
        ],
      },
    ]
  },
}

//export default nextConfig
export default withPayload(nextConfig)
