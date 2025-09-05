import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-8cc11ba1a6ef43369715136333c4b35a.r2.dev',
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
    ],
  },
  eslint: {
    // Disable ESLint during builds to allow deployment
    ignoreDuringBuilds: true,
  },
}

//export default nextConfig
export default withPayload(nextConfig)
