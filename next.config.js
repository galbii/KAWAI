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
}

//export default nextConfig
export default withPayload(nextConfig)
