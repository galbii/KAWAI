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
  // Content blocks
  Text,
  Image,
  Video,
  Code,
  Banner,
  // Layout blocks
  Columns,
  Spacer,
  Divider,
  HeroCarousel,
  VideoBackground,
  BrandIntro,
  BottomLeftPopup,
  // Marketing blocks
  Hero,
  CallToAction,
  Testimonials,
  InstrumentalToLife,
  TechnicalShowcase,
  FindADealer,
  // Product blocks
  ProductShowcase,
  ProductHero,
  ImageGallery,
  FeaturesList,
  Specifications,
  // Legacy blocks (keep for backward compatibility)
  TextContent,
  Hello,
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

        if (collectionConfig?.slug === 'pages') {
          return `${baseURL}/${data.slug || 'preview'}`
        }

        return baseURL
      },
      collections: ['posts', 'pages'],
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
    // Content blocks (for blog articles)
    Text,
    Image,
    Video,
    Code,
    Banner,

    // Layout blocks
    Columns,
    Spacer,
    Divider,
    HeroCarousel,
    VideoBackground,
    BrandIntro,
    BottomLeftPopup,

    // Marketing blocks
    Hero,
    CallToAction,
    Testimonials,
    InstrumentalToLife,
    TechnicalShowcase,
    FindADealer,

    // Product blocks (for product pages)
    ProductShowcase,
    ProductHero,
    ImageGallery,
    FeaturesList,
    Specifications,

    // Legacy blocks (keep for backward compatibility)
    TextContent,
    Hello,
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
      collections: ['storefronts', 'products', 'pages'],
      defaultPriorities: {
        storefronts: 30, // Storefronts appear FIRST
        products: 20,     // Products appear second
        pages: 10,        // Pages appear third
      },
      beforeSync: ({ originalDoc, searchDoc, req }) => {
        // Extract searchable data based on collection type
        // Detect collection type by unique fields
        const collectionSlug = (originalDoc.locationName && originalDoc.slug && 'isActive' in originalDoc)
          ? 'storefronts'
          : (originalDoc.name && originalDoc.model)
            ? 'products'
            : 'pages'

        if (collectionSlug === 'storefronts') {
          // Only index active storefronts
          if (!originalDoc.isActive) {
            return searchDoc // Don't modify the doc if inactive (will be filtered by Payload)
          }

          // Extract storefront-specific fields for search
          // Build searchable content from location data and service area
          const searchableText = [
            originalDoc.locationName,
            originalDoc.locationText,
            originalDoc.establishedText,
            originalDoc.showroomSection?.showroomInfo?.name,
            originalDoc.showroomSection?.showroomInfo?.address,
            originalDoc.serviceAreaCoverage?.primaryCity,
            originalDoc.serviceAreaCoverage?.stateRegion,
            originalDoc.serviceAreaCoverage?.coveredCities?.map((city: any) => city.cityName).join(', '),
          ].filter(Boolean).join(' ')

          return {
            ...searchDoc,
            title: originalDoc.locationName,
            excerpt: originalDoc.locationText || originalDoc.establishedText || '',
            category: 'storefront',
            tags: ['storefront', 'location', 'showroom'],
            // Denormalized storefront fields (stored directly in search doc)
            storefrontSlug: originalDoc.slug,
            storefrontLocationName: originalDoc.locationName,
            storefrontLocationText: originalDoc.locationText,
            storefrontEstablishedText: originalDoc.establishedText,
            storefrontAddress: originalDoc.showroomSection?.showroomInfo?.address,
            storefrontPhone: originalDoc.showroomSection?.showroomInfo?.phone,
            storefrontCity: originalDoc.serviceAreaCoverage?.primaryCity,
            storefrontRegion: originalDoc.serviceAreaCoverage?.stateRegion,
          }
        }

        if (collectionSlug === 'products') {
          // Valid tag options from the search collection schema
          const validTags = ['piano', 'digital', 'grand', 'hybrid', 'upright', 'accessory', 'software', 'page', 'faq', 'support', 'storefront', 'location', 'showroom']

          // Filter tags to only include valid options
          const productTags = [
            originalDoc.type,
            originalDoc.category,
          ].filter((tag): tag is string => Boolean(tag) && validTags.includes(tag))

          // Extract product-specific fields
          // IMPORTANT: Store denormalized product data for search results
          return {
            ...searchDoc,
            title: originalDoc.name || originalDoc.model || originalDoc.title,
            excerpt: originalDoc.description?.substring(0, 200) || `${originalDoc.brand || 'Kawai'} ${originalDoc.model || ''}`.trim(),
            category: originalDoc.category || originalDoc.type || 'product',
            tags: productTags,
            // Denormalized product fields (stored directly in search doc)
            productModel: originalDoc.model,
            productImageUrl: originalDoc.imageUrl,
            productType: originalDoc.type, // piano, accessory, software
            productCategory: originalDoc.category, // digital, grand, upright, hybrid (for pianos only)
            productSlug: originalDoc.slug,
          }
        }

        if (collectionSlug === 'pages') {
          // Extract page-specific fields
          // IMPORTANT: Store denormalized page data for reliable navigation
          return {
            ...searchDoc,
            title: originalDoc.title,
            excerpt: originalDoc?.hero?.richText
              ? extractTextFromRichText(originalDoc.hero.richText)?.substring(0, 200)
              : originalDoc?.title || '',
            category: originalDoc?.category || 'page',
            tags: originalDoc?.tags || [],
            // Denormalized page fields (stored directly in search doc)
            pageSlug: originalDoc.slug,
          }
        }

        // Fallback for any other collection
        return {
          ...searchDoc,
          excerpt: originalDoc?.title || '',
          category: 'other',
          tags: [],
        }
      },
      searchOverrides: {
        slug: 'search',
        fields: ({ defaultFields }) => [
          ...defaultFields,
          {
            name: 'excerpt',
            type: 'textarea',
            admin: {
              position: 'sidebar',
              description: 'Short excerpt displayed in search results',
            },
          },
          {
            name: 'category',
            type: 'text',
            admin: {
              position: 'sidebar',
              description: 'Category/type (product, page, digital, grand, etc.)',
            },
          },
          {
            name: 'tags',
            type: 'select',
            hasMany: true,
            options: [
              { label: 'Piano', value: 'piano' },
              { label: 'Digital', value: 'digital' },
              { label: 'Grand', value: 'grand' },
              { label: 'Hybrid', value: 'hybrid' },
              { label: 'Upright', value: 'upright' },
              { label: 'Accessory', value: 'accessory' },
              { label: 'Software', value: 'software' },
              { label: 'Page', value: 'page' },
              { label: 'FAQ', value: 'faq' },
              { label: 'Support', value: 'support' },
              { label: 'Storefront', value: 'storefront' },
              { label: 'Location', value: 'location' },
              { label: 'Showroom', value: 'showroom' },
            ],
            admin: {
              position: 'sidebar',
              description: 'Tags for filtering',
            },
          },
          // Denormalized product fields for fast search results
          {
            name: 'productModel',
            type: 'text',
            admin: {
              position: 'sidebar',
              description: 'Product model (denormalized from Products collection)',
              readOnly: true,
            },
          },
          {
            name: 'productImageUrl',
            type: 'text',
            admin: {
              position: 'sidebar',
              description: 'Product image URL (denormalized from Products collection)',
              readOnly: true,
            },
          },
          {
            name: 'productType',
            type: 'text',
            admin: {
              position: 'sidebar',
              description: 'Product type: piano, accessory, software (denormalized from Products collection)',
              readOnly: true,
            },
          },
          {
            name: 'productCategory',
            type: 'text',
            admin: {
              position: 'sidebar',
              description: 'Product category: digital, grand, upright, hybrid (pianos only, denormalized from Products collection)',
              readOnly: true,
            },
          },
          {
            name: 'productSlug',
            type: 'text',
            admin: {
              position: 'sidebar',
              description: 'Product slug (denormalized from Products collection)',
              readOnly: true,
            },
          },
          // Denormalized page fields for fast search results
          {
            name: 'pageSlug',
            type: 'text',
            admin: {
              position: 'sidebar',
              description: 'Page slug (denormalized from Pages collection)',
              readOnly: true,
            },
          },
          // Denormalized storefront fields for fast search results
          {
            name: 'storefrontSlug',
            type: 'text',
            admin: {
              position: 'sidebar',
              description: 'Storefront slug (denormalized from Storefronts collection)',
              readOnly: true,
            },
          },
          {
            name: 'storefrontLocationName',
            type: 'text',
            admin: {
              position: 'sidebar',
              description: 'Storefront location name (denormalized from Storefronts collection)',
              readOnly: true,
            },
          },
          {
            name: 'storefrontLocationText',
            type: 'text',
            admin: {
              position: 'sidebar',
              description: 'Storefront location text (denormalized from Storefronts collection)',
              readOnly: true,
            },
          },
          {
            name: 'storefrontEstablishedText',
            type: 'text',
            admin: {
              position: 'sidebar',
              description: 'Storefront established text (denormalized from Storefronts collection)',
              readOnly: true,
            },
          },
          {
            name: 'storefrontAddress',
            type: 'text',
            admin: {
              position: 'sidebar',
              description: 'Storefront address (denormalized from Storefronts collection)',
              readOnly: true,
            },
          },
          {
            name: 'storefrontPhone',
            type: 'text',
            admin: {
              position: 'sidebar',
              description: 'Storefront phone (denormalized from Storefronts collection)',
              readOnly: true,
            },
          },
          {
            name: 'storefrontCity',
            type: 'text',
            admin: {
              position: 'sidebar',
              description: 'Storefront city (denormalized from Storefronts collection)',
              readOnly: true,
            },
          },
          {
            name: 'storefrontRegion',
            type: 'text',
            admin: {
              position: 'sidebar',
              description: 'Storefront region (denormalized from Storefronts collection)',
              readOnly: true,
            },
          },
        ],
      },
    }),
  ],
})
