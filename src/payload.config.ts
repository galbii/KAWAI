// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
// import { Sites } from './collections/Sites'
// import { SitePages } from './collections/SitePages'
import { Productlines } from './collections/Productlines'
import { PianoModels } from './collections/PianoModels'
import { PianosPage } from './collections/PianosPage'
import { HomePage } from './collections/HomePage'
import { DealerLocations } from './collections/DealerLocations'
import { Products } from './collections/Products'
import { LandingPages } from './collections/LandingPages'
import { ConstantContactSettings } from './collections/ConstantContactSettings'
import {
  ProductShowcase,
  ProductHero,
  Hero,
  TextContent,
  ImageGallery,
  FeaturesList,
  Specifications,
  CallToAction,
  Testimonials,
  Hello,
  LandingHero,
  LandingFeatures,
  LandingTestimonials
} from './blocks'
import { productlinesSeedPlugin } from './plugins/productlines-seed'
import { pianoModelsSeedPlugin } from './plugins/piano-models-seed'
import { pianosPageSeedPlugin } from './plugins/pianos-page-seed'
// import DealerLocationsSeedPlugin from './plugins/dealer-locations-seed' // Temporarily disabled

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      // Payload meta configuration for HTML metadata
    },
  },
  collections: [
    Users,
    Media,
    // Sites,        // Multi-site management (disabled)
    // SitePages,    // Site-specific pages with template inheritance (disabled)
    Productlines,
    PianoModels,
    HomePage,       // Main homepage content
    DealerLocations, // Multiple dealer location pages
    LandingPages,   // Campaign landing pages
    PianosPage,     // Keep for backward compatibility during migration
    Products,
    ConstantContactSettings, // Constant Contact API credentials and tokens
  ],
  // Define blocks at root level for performance optimization using blockReferences
  blocks: [
    ProductShowcase,
    ProductHero,
    Hero,
    TextContent,
    ImageGallery,
    FeaturesList,
    Specifications,
    CallToAction,
    Testimonials,
    Hello,
    LandingHero,
    LandingFeatures,
    LandingTestimonials
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    productlinesSeedPlugin(),
    pianoModelsSeedPlugin(),
    pianosPageSeedPlugin(),
    // DealerLocationsSeedPlugin, // Temporarily disabled due to TypeScript errors
    // storage-adapter-placeholder
    s3Storage({
      collections: {
        'media': {
          prefix: 'media',
          disablePayloadAccessControl: true, // Use direct R2 URLs instead of proxying through Payload
          generateFileURL: ({ filename, prefix }) => {
            // Validate environment variable
            const publicUrl = process.env.NEXT_PUBLIC_S3_PUBLIC_URL
            if (!publicUrl) {
              console.error('NEXT_PUBLIC_S3_PUBLIC_URL environment variable is not set')
              throw new Error('R2 public URL not configured')
            }
            
            // Construct the full URL ensuring proper path structure
            const cleanPublicUrl = publicUrl.replace(/\/$/, '') // Remove trailing slash
            const path = prefix ? `${prefix}/${filename}` : filename
            const fullUrl = `${cleanPublicUrl}/${path}`
            
            // Log URL generation for debugging in development
            if (process.env.NODE_ENV === 'development') {
              console.debug(`Generated media URL: ${fullUrl}`)
            }
            
            return fullUrl
          },
        },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION || 'auto',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        forcePathStyle: true, // Required for Cloudflare R2
      },
    }),
  ],
})
