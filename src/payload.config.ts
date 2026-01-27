// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { searchPlugin } from '@payloadcms/plugin-search'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { extractTextFromRichText } from './lib/utils'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
// import { Sites } from './collections/Sites'
// import { SitePages } from './collections/SitePages'
import { Pages } from './collections/Pages'
import { PianosPage } from './collections/PianosPage'
import { HomePage } from './collections/HomePage'
import { Storefronts } from './collections/Storefronts'
import { Products } from './collections/Products'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { Artists } from './collections/Artists'
import { ConcertArtistPage } from './collections/ConcertArtistPage'
import { ConstantContactSettings } from './collections/ConstantContactSettings'
import { ConstantContactCustomFields } from './collections/ConstantContactCustomFields'
import { Dealers } from './collections/Dealers'
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
  Image,
  Text,
  Video,
  Spacer,
  Divider,
  Columns,
  Hello,
  Banner,
  Code,
  // Pages collection blocks
  Archive,
  Content,
  MediaBlock,
  Cta,
} from './blocks'
import { pianosPageSeedPlugin } from './plugins/pianos-page-seed'
// import { categoriesSeedPlugin } from './plugins/categories-seed' // Disabled - needs type regeneration
// import DealerLocationsSeedPlugin from './plugins/dealer-locations-seed' // Temporarily disabled

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Verify S3 configuration at startup
console.log('🔧 [S3 CONFIG] Verifying environment variables...')
console.log('  S3_BUCKET:', process.env.S3_BUCKET ? '✅ Set' : '❌ Missing')
console.log('  S3_ENDPOINT:', process.env.S3_ENDPOINT ? '✅ Set' : '❌ Missing')
console.log('  S3_REGION:', process.env.S3_REGION || 'auto')
console.log('  S3_ACCESS_KEY_ID:', process.env.S3_ACCESS_KEY_ID ? '✅ Set' : '❌ Missing')
console.log('  S3_SECRET_ACCESS_KEY:', process.env.S3_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Missing')
console.log('  NEXT_PUBLIC_S3_PUBLIC_URL:', process.env.NEXT_PUBLIC_S3_PUBLIC_URL || '❌ Missing')

export default buildConfig({
  // Enable folders for media organization
  folders: {
    browseByFolder: true,
    slug: 'payload-folders',
    fieldName: 'folder',
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      // Payload meta configuration for HTML metadata
    },
    components: {
      graphics: {
        Logo: '/components/admin/Logo.tsx#Logo',
        Icon: '/components/admin/Icon.tsx#Icon',
      },
      // Root provider - wraps entire admin UI with necessary providers
      providers: ['/components/admin/AdminRootProvider#AdminRootProvider'],
      // Media Manager - floating button on all admin pages
      afterDashboard: ['/components/admin/media-manager/MediaManager.tsx#MediaManager'],
    },
    livePreview: {
      url: ({ data, collectionConfig }) => {
        const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

        // Generate preview URL based on collection
        if (collectionConfig?.slug === 'posts') {
          return `${baseURL}/blog/${data.slug || 'preview'}`
        }

        return baseURL
      },
      collections: ['posts'],
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  collections: [
    // System Collections
    Users,
    Media,

    // Pages (Singleton landing pages)
    Pages,
    HomePage,
    PianosPage,
    ConcertArtistPage,

    // Content Collections
    Storefronts,
    Posts,
    Categories,
    Artists,

    // Commerce Collections
    Products,

    // Business Collections
    Dealers,

    // Integration Collections
    ConstantContactSettings,
    ConstantContactCustomFields,
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
    // Modular/Atomic blocks for blog content
    Image,
    Text,
    Video,
    Spacer,
    Divider,
    Columns,
    // Landing page blocks
    Hello,
    // Rich text content blocks (for inline use in Lexical editor)
    Banner,
    Code,
    // Pages collection blocks
    Archive,
    Content,
    MediaBlock,
    Cta,
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
    // NOTE: Temporarily disabled to test S3 plugin conflict
    // payloadCloudPlugin(),
    pianosPageSeedPlugin(),
    // categoriesSeedPlugin(), // Disabled - needs type regeneration
    // DealerLocationsSeedPlugin, // Temporarily disabled due to TypeScript errors
    // storage-adapter-placeholder
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) => {
            // Construct direct R2 public URL
            const baseUrl = process.env.NEXT_PUBLIC_S3_PUBLIC_URL?.replace(/\/$/, '') || ''
            return `${baseUrl}/${prefix}/${filename}`
          },
        },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT || '',
        region: process.env.S3_REGION || 'auto',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        forcePathStyle: true, // Required for Cloudflare R2
      },
    }),
    searchPlugin({
      collections: ['pages'],
      defaultPriorities: {
        pages: 10,
      },
      beforeSync: ({ originalDoc, searchDoc }) => ({
        ...searchDoc,
        excerpt: originalDoc?.hero?.richText
          ? extractTextFromRichText(originalDoc.hero.richText)
          : originalDoc?.title || '',
        category: originalDoc?.category || '',
        tags: originalDoc?.tags || [],
      }),
      searchOverrides: {
        slug: 'search',
        fields: ({ defaultFields }) => [
          ...defaultFields,
          {
            name: 'category',
            type: 'text',
            admin: {
              position: 'sidebar',
            },
          },
          {
            name: 'tags',
            type: 'select',
            hasMany: true,
            options: [],
            admin: {
              position: 'sidebar',
            },
          },
          {
            name: 'excerpt',
            type: 'textarea',
            admin: {
              position: 'sidebar',
            },
          },
        ],
      },
    }),
  ],
})
