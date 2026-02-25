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
import { Collections } from './collections/Collections'
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
  SideNavigation,
  CalendlyEmbed,
  BookingModal,
  // Marketing blocks
  Hero,
  GrandHero,
  CallToAction,
  Testimonials,
  InstrumentalToLife,
  TechnicalShowcase,
  FindADealer,
  ThreeDViewer,
  InstagramCarousel,
  ArtistCarousel,
  HomePageHero,
  Showroom,
  PianoCollection,
  PianoGallery,
  NewsCarousel,
  ContactForm,
  StorefrontLocations,
  FeaturedModels,
  // Events blocks
  UniversityHero,
  EventOverview,
  // Product blocks
  ProductShowcase,
  ProductHero,
  ProductDescription,
  ImageGallery,
  FeaturesList,
  Specifications,
  TechnicalSpecifications,
  CollectionShowcase,
  FloatingAddToCart,
  ProductFeatureSlides,
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
      // Disable automatic regeneration on every HMR event.
      // Run `bun run payload generate:importmap` after adding/moving admin components.
      autoGenerate: false,
    },
    meta: {
      // Payload meta configuration for HTML metadata
    },
    components: {
      graphics: {
        Logo: '/components/admin/Logo.tsx#Logo',
        Icon: '/components/admin/Icon.tsx#Icon',
      },
      // Root provider - wraps entire admin UI with necessary providers.
      // MediaManagerProvider, MediaManagerModal, and MediaManagerButton are all rendered
      // inside AdminRootProvider so they're available on every admin page without
      // relying on afterNavLinks (which runs inside the sidebar and breaks position:fixed).
      providers: ['/components/admin/AdminRootProvider#AdminRootProvider'],
      beforeDashboard: [
        '/components/admin/DashboardStats#DashboardStats',
        '/components/admin/DashboardQuickActions#DashboardQuickActions',
      ],
      afterNavLinks: [
        '/components/admin/NavLinks#NavLinks',
      ],
      actions: [
        '/components/admin/ViewSiteButton#ViewSiteButton',
      ],
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

        if (collectionConfig?.slug === 'home-page') {
          return baseURL
        }

        return baseURL
      },
      collections: ['posts', 'pages', 'home-page'],
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
    Collections,

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
    SideNavigation,
    CalendlyEmbed,
    BookingModal,

    // Marketing blocks
    Hero,
    GrandHero,
    CallToAction,
    Testimonials,
    InstrumentalToLife,
    TechnicalShowcase,
    FindADealer,
    ThreeDViewer,
    InstagramCarousel,
    ArtistCarousel,
    HomePageHero,
    Showroom,
    PianoCollection,
    PianoGallery,
    NewsCarousel,
    ContactForm,
    StorefrontLocations,
    FeaturedModels,

    // Events blocks
    UniversityHero,
    EventOverview,

    // Product blocks (for product pages)
    ProductShowcase,
    ProductHero,
    ProductDescription,
    ImageGallery,
    FeaturesList,
    Specifications,
    TechnicalSpecifications,
    CollectionShowcase,
    FloatingAddToCart,
    ProductFeatureSlides,

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
    connectOptions: {
      // Force IPv4 — skips IPv6 DNS timeout, saves ~300–800ms on first connect to Atlas
      family: 4,
      // Keep one warm connection alive at all times — eliminates cold pool reconnect cost
      minPoolSize: 1,
      maxPoolSize: 10,
      // More frequent heartbeats keep the TCP connection alive through NAT / Atlas idle-closer
      heartbeatFrequencyMS: 5000,
      // Fail fast in dev if Atlas is unreachable rather than hanging for 30s
      serverSelectionTimeoutMS: process.env.NODE_ENV === 'development' ? 8000 : 30000,
      connectTimeoutMS: 10000,
    },
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
        storefronts: 30,
        products: 20,
        pages: 10,
      },
      // Storefronts have a custom afterChange hook in Storefronts.ts that handles their
      // search sync manually. This bypasses a Payload 3.71.1 bug in the db-mongodb query
      // builder (parseParams.js:68) where querying polymorphic relationship fields using
      // dotted-path notation (doc.value + doc.relationTo simultaneously) causes:
      // TypeError: Cannot delete property '0' of [object String]
      skipSync: async ({ collectionSlug }) => collectionSlug === 'storefronts',
      // Note: storefronts are excluded from beforeSync via skipSync above.
      // Their search index is maintained by the manual afterChange hook in Storefronts.ts.
      beforeSync: ({ originalDoc, searchDoc, req }) => {
        const isProduct = originalDoc.name && originalDoc.model

        if (isProduct) {
          // Extract product tags from type and category
          const productTags = [
            originalDoc.type,
            originalDoc.category,
          ].filter((tag): tag is string => Boolean(tag))
            .map(tag => ({ tag }))

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

        if (originalDoc.title !== undefined) {
          // Extract page-specific fields
          // IMPORTANT: Store denormalized page data for reliable navigation

          // Handle tags: support both old format (string[]) and new format ([{tag: string}])
          let pageTags: Array<{ tag: string }> = []
          if (Array.isArray(originalDoc?.tags)) {
            pageTags = originalDoc.tags
              .map((t: any) => {
                // Handle old format (string)
                if (typeof t === 'string') {
                  return { tag: t }
                }
                // Handle new format ({tag: string})
                if (typeof t === 'object' && t?.tag && typeof t.tag === 'string') {
                  return { tag: t.tag }
                }
                return null
              })
              .filter((t: any): t is { tag: string } => t !== null && t.tag.length > 0)
          }

          return {
            ...searchDoc,
            title: originalDoc.title,
            excerpt: originalDoc?.hero?.richText
              ? extractTextFromRichText(originalDoc.hero.richText)?.substring(0, 200)
              : originalDoc?.title || '',
            category: originalDoc?.category || 'page',
            tags: pageTags,
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
            type: 'array',
            maxRows: 20,
            fields: [
              {
                name: 'tag',
                type: 'text',
                required: true,
              },
            ],
            admin: {
              position: 'sidebar',
              description: 'Tags for filtering (denormalized from source collections)',
              readOnly: true,
              components: {
                RowLabel: '/components/admin/TagRowLabel#TagRowLabel',
              },
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
          { name: 'storefrontSlug', type: 'text', admin: { position: 'sidebar', readOnly: true } },
          { name: 'storefrontLocationName', type: 'text', admin: { position: 'sidebar', readOnly: true } },
          { name: 'storefrontLocationText', type: 'text', admin: { position: 'sidebar', readOnly: true } },
          { name: 'storefrontEstablishedText', type: 'text', admin: { position: 'sidebar', readOnly: true } },
          { name: 'storefrontAddress', type: 'text', admin: { position: 'sidebar', readOnly: true } },
          { name: 'storefrontPhone', type: 'text', admin: { position: 'sidebar', readOnly: true } },
          { name: 'storefrontCity', type: 'text', admin: { position: 'sidebar', readOnly: true } },
          { name: 'storefrontRegion', type: 'text', admin: { position: 'sidebar', readOnly: true } },
        ],
      },
    }),
  ],
})
