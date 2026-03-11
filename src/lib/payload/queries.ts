import 'server-only'

import { getPayload } from 'payload'
import type { Payload, Where } from 'payload'
import config from '@/payload.config'
import { unstable_cache } from 'next/cache'
import { fetchShopifyProduct } from '@/lib/shopify/fetch-product'
import type {
  Product,
  PianosPage,
  HomePage,
  Media,
} from '@/payload-types'
import type { NewsItem } from '@/lib/types/homepage'

// Direct Payload client access - bypasses HTTP and works during build time
// This is the preferred approach for server-side data fetching

declare global {
  // eslint-disable-next-line no-var
  var __payloadInstance: Promise<Payload> | undefined
}

/**
 * Returns a cached Payload instance anchored to globalThis.
 *
 * In dev (HMR): module-level caches are cleared on every file save, which
 * forces a new Atlas TLS handshake costing ~2–4s. Anchoring to globalThis
 * (which persists for the Node.js process lifetime) reuses the existing
 * Mongoose connection pool across hot reloads.
 *
 * In production: getPayload's internal module-level cache is sufficient.
 */
export async function getPayloadClient(): Promise<Payload> {
  if (process.env.NODE_ENV === 'development') {
    if (!globalThis.__payloadInstance) {
      globalThis.__payloadInstance = getPayload({ config })
    }
    return globalThis.__payloadInstance
  }
  return getPayload({ config })
}

/**
 * Get piano categories data using direct Payload access
 */
export async function getPianoCategoriesDirect(): Promise<any[]> {
  try {
    const payload = await getPayloadClient()

    // Try to get categories from PianosPage collection first
    const pianosPageResult = await payload.find({
      collection: 'pianos-page',
      depth: 2,
      limit: 1
    })

    const pianosPageData = pianosPageResult?.docs?.[0]
    if (pianosPageData?.pianoCategories && pianosPageData.pianoCategories.length > 0) {
      return pianosPageData.pianoCategories.map((category: any) => ({
        ...category,
        // Ensure image is preserved as Media object or fallback string
        image: category.image || `/images/piano-categories/${category.slug}.jpg`,
        galleryImage1: category.galleryImage1,
        galleryImage2: category.galleryImage2,
        galleryImage3: category.galleryImage3
      }))
    }
  } catch (error) {
    console.error('Error fetching piano categories from PianosPage:', error)
  }

  // Fallback to hardcoded categories if CMS data not available
  return [
    {
      slug: "grand",
      name: "Acoustic Grand Pianos",
      description: "Professional grand pianos featuring advanced technology and superior craftsmanship",
      image: "/images/piano-categories/grand.jpg",
      priceRange: "$45,000 - $185,000",
      features: [{"feature": "Millennium III Action"}, {"feature": "Carbon Fiber Components"}, {"feature": "Neotex Key Surface"}, {"feature": "Konami Tuning Pins"}],
      icon: "piano",
      badge: "Professional",
      highlight: "GX BLAK Performance Series"
    },
    {
      slug: "upright",
      name: "Acoustic Upright Pianos",
      description: "Space-efficient acoustic pianos delivering exceptional touch and tone",
      image: "/images/piano-categories/upright.png",
      priceRange: "$8,999 - $35,000",
      features: [{"feature": "Extended Length Keys"}, {"feature": "Millennium III Prep"}, {"feature": "Soft-Close Fallboard"}, {"feature": "Premium Hammers"}],
      icon: "music",
      badge: "Classic",
      highlight: "K Professional Series"
    },
    {
      slug: "digital",
      name: "Digital Pianos",
      description: "Cutting-edge digital instruments with authentic piano touch and sound",
      image: "/images/piano-categories/digital.png",
      priceRange: "$1,999 - $12,999",
      features: [{"feature": "Grand Feel III Action"}, {"feature": "Harmonic Imaging XL"}, {"feature": "Onkyo Audio"}, {"feature": "Bluetooth Connectivity"}],
      icon: "zap",
      badge: "Innovation",
      highlight: "Concert Artist Series"
    },
    {
      slug: "hybrid",
      name: "Hybrid Pianos",
      description: "Revolutionary instruments combining acoustic action with digital versatility",
      image: "/images/piano-categories/hybrid.jpg",
      priceRange: "$12,999 - $24,999",
      features: [{"feature": "Real Grand Action"}, {"feature": "Silent Practice Mode"}, {"feature": "Digital Recording"}, {"feature": "Millennium III Action"}],
      icon: "award",
      badge: "Hybrid Technology",
      highlight: "NOVUS & AnyTime Series"
    }
  ]
}

/**
 * Get featured models data using direct Payload access
 */
export async function getFeaturedModelsDirect(): Promise<any[]> {
  try {
    const payload = await getPayloadClient()

    // Try to get featured models from PianosPage collection first
    const pianosPageResult = await payload.find({
      collection: 'pianos-page',
      depth: 2,
      limit: 1
    })

    const pianosPageData = pianosPageResult?.docs?.[0]
    if (pianosPageData?.featuredModels && pianosPageData.featuredModels.length > 0) {
      return pianosPageData.featuredModels.map((model: any) => ({
        ...model,
        // Preserve Media object or fallback to string
        image: model.image || getFallbackImageForModel(model.name)
      }))
    }
  } catch (error) {
    console.error('Error fetching featured models from PianosPage:', error)
  }

  // Fallback to hardcoded featured models
  return [
    {
      name: "GX-7 BLAK",
      category: "GX BLAK Performance Series",
      image: "/images/banners/GX-7-BLAK-grand-styling.webp",
      badge: "Performance Series",
      description: "Professional concert grand featuring revolutionary carbon fiber action technology, delivering unprecedented responsiveness and durability for the modern virtuoso."
    },
    {
      name: "CA99",
      category: "Concert Artist Digital",
      image: "/images/banners/CA99-digital-styling.webp",
      badge: "Flagship Digital",
      description: "The ultimate digital piano experience with Grand Feel III wooden-key action and authentic concert grand samples captured in stunning detail."
    },
    {
      name: "NOVUS NV-10S",
      category: "Hybrid Innovation",
      image: "/images/banners/NV10S_along the keyboard_whiteBG.jpg",
      badge: "Revolutionary",
      description: "Revolutionary hybrid piano combining a real grand piano action with advanced digital technology, offering the authentic touch of an acoustic grand with silent practice capabilities."
    }
  ]
}

/**
 * Get complete pianos page data using direct Payload access
 */
export async function getPianosPageDataDirect(): Promise<{
  hero: any
  categories: any[]
  featuredModels: any[]
  featuredModelsSection: any
  cta: any
  seo: any
} | null> {
  try {
    const payload = await getPayloadClient()

    // Get PianosPage collection data
    const pianosPageResult = await payload.find({
      collection: 'pianos-page',
      depth: 2,
      limit: 1
    })

    const pianosPageData = pianosPageResult?.docs?.[0]
    if (pianosPageData) {
      return {
        hero: {
          heroTitle: pianosPageData.heroTitle,
          heroDescription: pianosPageData.heroDescription,
          heroBackgroundImage: pianosPageData.heroBackgroundImage || "/images/piano-categories/NV10S_along%20the%20keyboard_whiteBG.jpg",
          heroCta: pianosPageData.heroCta
        },
        categories: pianosPageData.pianoCategories?.length > 0
          ? pianosPageData.pianoCategories.map((cat: any) => ({
              ...cat,
              image: cat.image || `/images/piano-categories/${cat.slug}.jpg`,
              galleryImage1: cat.galleryImage1,
              galleryImage2: cat.galleryImage2,
              galleryImage3: cat.galleryImage3
            }))
          : await getPianoCategoriesDirect(),
        featuredModels: pianosPageData.featuredModels?.length > 0
          ? pianosPageData.featuredModels.map((model: any) => ({
              ...model,
              image: model.image || getFallbackImageForModel(model.name)
            }))
          : await getFeaturedModelsDirect(),
        featuredModelsSection: pianosPageData.featuredModelsSection || {
          title: "Flagship & Featured Models",
          description: "Discover our most celebrated instruments, from competition-grade concert grands to innovative digital and hybrid pianos preferred by professionals worldwide."
        },
        cta: pianosPageData.ctaSection || {
          title: "Experience the Difference",
          description: "Visit our showroom to hear and feel the exceptional quality of Kawai pianos. Our experts will help you find the perfect instrument for your musical journey.",
          ctaText: "Schedule Showroom Visit",
          ctaLink: "/contact/schedule-visit"
        },
        seo: pianosPageData.seo || {
          metaTitle: "Kawai Pianos - Professional Digital, Grand, Hybrid & Upright Pianos",
          metaDescription: "Discover Kawai's complete piano collection including professional grand pianos, innovative digital pianos, and revolutionary hybrid instruments.",
          keywords: "kawai pianos, digital piano, grand piano, hybrid piano, upright piano"
        }
      }
    }
  } catch (error) {
    console.error('Error fetching pianos page data with direct Payload access:', error)
  }

  // Return fallback data structure
  return {
    hero: {
      heroTitle: "Experience the Complete Kawai Piano Collection",
      heroDescription: "From the legendary Shigeru Kawai concert grands used in international competitions to innovative digital and hybrid instruments, discover the piano that will inspire your musical journey.",
      heroBackgroundImage: "/images/piano-categories/NV10S_along%20the%20keyboard_whiteBG.jpg",
      heroCta: {
        text: "Explore Categories",
        link: "#categories"
      }
    },
    categories: await getPianoCategoriesDirect(),
    featuredModels: await getFeaturedModelsDirect(),
    featuredModelsSection: {
      title: "Flagship & Featured Models",
      description: "Discover our most celebrated instruments, from competition-grade concert grands to innovative digital and hybrid pianos preferred by professionals worldwide."
    },
    cta: {
      title: "Experience the Difference",
      description: "Visit our showroom to hear and feel the exceptional quality of Kawai pianos. Our experts will help you find the perfect instrument for your musical journey.",
      ctaText: "Schedule Showroom Visit",
      ctaLink: "/contact/schedule-visit"
    },
    seo: {
      metaTitle: "Kawai Pianos - Professional Digital, Grand, Hybrid & Upright Pianos",
      metaDescription: "Discover Kawai's complete piano collection including professional grand pianos, innovative digital pianos, and revolutionary hybrid instruments.",
      keywords: "kawai pianos, digital piano, grand piano, hybrid piano, upright piano"
    }
  }
}

/**
 * Get homepage data using direct Payload access
 */
export async function getHomePageDataDirect(): Promise<{
  content?: any[] // NEW: Blocks-based content from Page Builder tab
  heroSection: any
  showroomSection: any
  pianoCollectionSection: any
  pianoGallerySection: any
  newsCarouselSection: any
  contactFormSection: any
  seo: any
} | null> {
  try {
    const payload = await getPayloadClient()

    // Get HomePage collection data
    const homePageResult = await payload.find({
      collection: 'home-page',
      depth: 2,
      limit: 1
    })

    const homePageData = homePageResult?.docs?.[0]
    if (homePageData) {
      return {
        content: homePageData.content || [], // NEW: Include blocks from Page Builder tab
        heroSection: {
          locationText: homePageData.locationText,
          establishedText: homePageData.establishedText,
          titlePrefix: homePageData.titlePrefix,
          titleMain: homePageData.titleMain,
          titleSuffix: homePageData.titleSuffix,
          description: homePageData.description,
          primaryCta: homePageData.primaryCta,
          secondaryCta: homePageData.secondaryCta,
          backgroundVideo: homePageData.backgroundVideo
        },
        showroomSection: {
          sectionHeader: homePageData.sectionHeader,
          showroomTitle: homePageData.showroomTitle,
          showroomDescription: homePageData.showroomDescription,
          showroomInfo: homePageData.showroomInfo,
          hours: homePageData.hours,
          features: homePageData.features,
          mapApiKey: homePageData.mapApiKey,
          showroomCtas: homePageData.showroomCtas
        },
        pianoCollectionSection: {
          collectionSectionHeader: homePageData.collectionSectionHeader,
          collectionTitle: homePageData.collectionTitle,
          collectionDescription: homePageData.collectionDescription,
          collectionCta: homePageData.collectionCta,
          featuredVideo: homePageData.featuredVideo
        },
        pianoGallerySection: {
          galleryTitle: homePageData.galleryTitle,
          galleryDescription: homePageData.galleryDescription,
          pianoCategories: homePageData.pianoCategories
        },
        newsCarouselSection: {
          autoPlayDuration: homePageData.autoPlayDuration,
          newsItems: homePageData.newsItems
        },
        contactFormSection: {
          contactTitle: homePageData.contactTitle,
          contactTitleHighlight: homePageData.contactTitleHighlight,
          contactDescription: homePageData.contactDescription,
          stepTitles: homePageData.stepTitles,
          trustMessage: homePageData.trustMessage,
          benefits: homePageData.benefits,
          formOptions: homePageData.formOptions
        },
        seo: homePageData.seo
      }
    }
  } catch (error) {
    console.error('Error fetching homepage data with direct Payload access:', error)
  }

  // Return fallback structure
  return {
    content: [], // NEW: Empty blocks array for fallback
    heroSection: {
      locationText: "St. Louis's Premier Kawai Piano Dealer",
      establishedText: "Est. 1927 - Lake St. Louis, Missouri",
      titlePrefix: "The",
      titleMain: "INSTRUMENTAL",
      titleSuffix: "to Life",
      description: "Every musician harbors a vision. Every performance seeks perfection. Since 1927, we've been crafting the instruments that transform inspiration into reality. Visit our Lake St. Louis showroom and discover why we're Missouri's trusted Kawai piano experts.",
      primaryCta: {
        text: "View Our Piano Collection",
        link: "/pianos"
      },
      secondaryCta: {
        text: "Visit Our St. Louis Showroom",
        link: "/contact"
      },
      backgroundVideo: null
    },
    showroomSection: {
      sectionHeader: "Our Showroom",
      showroomTitle: "Visit Our Lake St. Louis",
      showroomDescription: "Experience the artistry of Kawai pianos in Missouri's premier showroom. From intimate consultations to comprehensive piano services, discover why discerning musicians choose our Lake St. Louis location.",
      showroomInfo: {
        name: "Kawai Piano Gallery St. Louis",
        address: "21 Meadows Circle Drive, Suite 312, Lake St. Louis, MO 63367",
        phone: "636-265-2866",
        serviceArea: "Serving St. Louis, St. Charles County, O'Fallon, Wentzville & surrounding Missouri areas"
      },
      hours: [
        { day: 'Monday', time: '10:00 am-7:00 pm' },
        { day: 'Tuesday', time: '10:00 am-7:00 pm' },
        { day: 'Wednesday', time: '10:00 am-7:00 pm' },
        { day: 'Thursday', time: '10:00 am-7:00 pm' },
        { day: 'Friday', time: '10:00 am-7:00 pm' },
        { day: 'Saturday', time: '10:00 am-6:00 pm' },
        { day: 'Sunday', time: '1:00 pm-5:00 pm' }
      ],
      features: [
        { icon: 'award', title: 'Expert Consultation', description: 'Personalized guidance from certified Kawai specialists' },
        { icon: 'piano', title: 'Full Service Center', description: 'Tuning, repair, and maintenance by certified technicians' },
        { icon: 'shield', title: 'Financing Available', description: 'Flexible payment options to make your piano dreams accessible' }
      ],
      showroomCtas: {
        directionsText: "Get Directions",
        directionsLink: "https://maps.google.com/?q=Lake+St.+Louis+MO",
        scheduleText: "Schedule Visit",
        scheduleLink: "/contact/schedule-visit"
      }
    },
    pianoCollectionSection: {
      collectionSectionHeader: "Featured Models",
      collectionTitle: "Kawai K-500 &\nGX2 Limited Edition",
      collectionDescription: "Discover the exceptional craftsmanship and innovation that defines our most sought-after instruments",
      collectionCta: {
        text: "Explore Collection",
        link: "/pianos"
      },
      featuredVideo: {
        youtubeId: "1cmwb6evs2A",
        width: 800,
        height: 500
      }
    },
    pianoGallerySection: {
      galleryTitle: "Explore Our Piano Collection",
      galleryDescription: "Discover the full range of Kawai pianos, from handcrafted grand pianos to innovative digital and hybrid instruments. Each piano represents our commitment to exceptional craftsmanship and musical excellence.",
      pianoCategories: [
        {
          model: 'Grand',
          title: 'Grand Pianos',
          description: 'Professional acoustic grand pianos for concert halls, studios, and discerning homes. Experience the ultimate in touch, tone, and musical expression with instruments trusted by professional musicians worldwide.',
          href: '/pianos/grand'
        },
        {
          model: 'Digital',
          title: 'Digital Pianos',
          description: 'Advanced digital pianos featuring realistic wooden-key actions and premium sound systems. Combining authentic acoustic piano experience with modern technology and convenient features for today\'s musicians.',
          href: '/pianos/digital'
        },
        {
          model: 'Upright',
          title: 'Upright Pianos',
          description: 'Space-efficient acoustic pianos delivering exceptional touch and tone quality. Perfect for homes, studios, schools, and institutions where space is at a premium but musical excellence cannot be compromised.',
          href: '/pianos/upright'
        },
        {
          model: 'Hybrid',
          title: 'Hybrid Pianos',
          description: 'Revolutionary instruments combining real grand piano actions with advanced digital sound technology. Experience the authentic touch of acoustic keys with the versatility and innovation of digital sound.',
          href: '/pianos/hybrid'
        }
      ]
    },
    newsCarouselSection: {
      autoPlayDuration: 7000,
      newsItems: [
        {
          title: 'Instrumental to Life',
          description: 'Redefining harmony between tradition and innovation',
          category: 'news',
          link: '/about/instrumental-to-life'
        },
        {
          title: 'Kawai Piano Gallery',
          description: 'Explore our complete collection of acoustic and digital pianos',
          category: 'news',
          link: '/pianos'
        },
        {
          title: 'Special Financing Offers',
          description: 'Make your dream piano more accessible with flexible payment options',
          category: 'promotions',
          link: '/financing'
        }
      ]
    },
    contactFormSection: {
      contactTitle: "Find Your Perfect",
      contactTitleHighlight: "Piano",
      contactDescription: "Get your free Piano Buying Guide and personalized recommendations from our Lake St. Louis piano experts. Serving the St. Louis area for over 95 years.",
      stepTitles: [
        { step: 'Tell us about your piano journey' },
        { step: 'Help us understand your needs' },
        { step: 'Get your free piano buying guide' }
      ],
      trustMessage: "Trusted by St. Louis area piano families since 1927",
      benefits: [
        { icon: 'shield-check', text: 'Free comprehensive Piano Buying Guide (PDF)' },
        { icon: 'users', text: 'Personalized piano recommendations' },
        { icon: 'award', text: 'Exclusive offers and updates' }
      ],
      formOptions: {
        experienceLevels: [
          { level: 'Beginner' },
          { level: 'Intermediate' },
          { level: 'Advanced' },
          { level: 'Professional' }
        ],
        pianoTypes: [
          { type: 'Acoustic Grand' },
          { type: 'Acoustic Upright' },
          { type: 'Digital Piano' },
          { type: 'Hybrid Piano' },
          { type: 'Not Sure' }
        ],
        budgetRanges: [
          { range: 'Under $5,000' },
          { range: '$5,000 - $15,000' },
          { range: '$15,000 - $35,000' },
          { range: '$35,000 - $75,000' },
          { range: '$75,000+' }
        ],
        primaryUses: [
          { use: 'Learning/Practice' },
          { use: 'Family Entertainment' },
          { use: 'Teaching' },
          { use: 'Performance' },
          { use: 'Recording/Studio' }
        ]
      }
    },
    seo: {
      metaTitle: "Kawai Pianos St. Louis | Premier Piano Dealer Since 1927 | Lake St. Louis",
      metaDescription: "St. Louis's premier Kawai piano dealer since 1927. Explore acoustic & digital pianos at our Lake St. Louis showroom. Expert consultation & service.",
      keywords: "Kawai pianos, St. Louis piano dealer, Lake St. Louis piano store, acoustic pianos, digital pianos, piano showroom, Missouri piano dealer, piano sales, piano service"
    }
  }
}

/**
 * Helper function to get fallback images for featured models
 */
function getFallbackImageForModel(modelName: string): string {
  const fallbackMap: Record<string, string> = {
    'GX-7 BLAK': '/images/banners/GX-7-BLAK-grand-styling.webp',
    'CA99': '/images/banners/CA99-digital-styling.webp',
    'NOVUS NV-10S': '/images/banners/NV10S_along the keyboard_whiteBG.jpg',
  }

  return fallbackMap[modelName] || '/images/banners/placeholder-piano.jpg'
}

/**
 * Get products using direct Payload access
 */
export async function getProductsDirect(category?: string): Promise<Product[]> {
  try {
    const payload = await getPayloadClient()

    const whereClause: any = {}

    if (category) {
      whereClause.category = { equals: category }
    }

    const result = await payload.find({
      collection: 'products',
      where: whereClause,
      sort: 'name',
      limit: 100,
      depth: 2
    })

    return result.docs
  } catch (error) {
    console.error('Error fetching products with direct Payload access:', error)
    return []
  }
}

/**
 * Get a single product by slug using direct Payload access
 * @param slug - The URL-friendly slug identifier for the product
 * @returns Product object or null if not found
 */
export async function getProductBySlugDirect(slug: string): Promise<Product | null> {
  try {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'products',
      where: {
        slug: { equals: slug },
        status: { not_equals: 'draft' }
      },
      depth: 2,
      limit: 1
    })

    return result.docs[0] || null
  } catch (error) {
    console.error(`Error fetching product with slug "${slug}" using direct Payload access:`, error)
    return null
  }
}

/**
 * Get active products using direct Payload access
 * @param category - Optional category filter (e.g., 'digital', 'grand', 'upright', 'hybrid')
 * @param options - Additional query options
 * @param options.limit - Maximum number of products to return (default: 100)
 * @param options.featured - If true, only return featured products
 * @returns Array of active Product objects
 */
export async function getActiveProductsDirect(
  category?: string,
  options?: { limit?: number; featured?: boolean }
): Promise<Product[]> {
  try {
    const payload = await getPayloadClient()

    const whereClause: any = {
      status: { equals: 'active' }
    }

    if (category) {
      whereClause.category = { equals: category }
    }

    if (options?.featured) {
      whereClause['visibility.featured'] = { equals: true }
    }

    const result = await payload.find({
      collection: 'products',
      where: whereClause,
      select: {
        name: true,
        slug: true,
        status: true,
        category: true,
        type: true,
        description: true,
        imageUrl: true,
        model: true,
        visibility: true,
      },
      sort: 'visibility.sortOrder,name',
      limit: options?.limit || 100,
      depth: 2
    })

    return result.docs as unknown as Product[]
  } catch (error) {
    console.error('Error fetching active products with direct Payload access:', error)
    return []
  }
}

/**
 * Get all catalog-visible products for the /pianos browse page.
 * Returns a lightweight shape — only the fields needed for product cards.
 */
export async function getCatalogProductsDirect(): Promise<
  Array<{
    id: string
    model: string
    name?: string | null
    slug: string
    type?: string | null
    category?: string | null
    imageUrl?: string | null
    price?: { msrp?: number | null; currency?: string | null } | null
    salePrice?: number | null
    compareAtPrice?: number | null
    shopifyCollections?: Array<{ title: string; handle: string }> | null
    variations?: Array<{
      name: string
      price: number | null
      compareAtPrice: number | null
      imageUrl: string | null
      available: boolean
    }> | null
  }>
> {
  try {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'products',
      where: {
        status: { equals: 'active' },
        'visibility.showInCatalog': { equals: true },
      },
      select: {
        model: true,
        name: true,
        slug: true,
        type: true,
        category: true,
        imageUrl: true,
        price: true,
        shopifyCollections: true,
        visibility: true,
        variations: true,
      },
      sort: 'visibility.sortOrder,name',
      limit: 500,
      depth: 0,
    })

    return result.docs.map((doc) => ({
      id: String(doc.id),
      model: doc.model,
      name: doc.name ?? null,
      slug: doc.slug ?? '',
      type: doc.type ?? null,
      category: doc.category ?? null,
      imageUrl: doc.imageUrl ?? null,
      price: doc.price
        ? { msrp: doc.price.msrp ?? null, currency: doc.price.currency ?? null }
        : null,
      ...(() => {
        const vars = doc.variations
        if (!Array.isArray(vars) || vars.length === 0) return { salePrice: null, compareAtPrice: null }
        const onSaleVars = vars.filter(
          (v: any) =>
            typeof v.compareAtPrice === 'number' &&
            typeof v.price === 'number' &&
            v.compareAtPrice > v.price,
        )
        if (onSaleVars.length === 0) return { salePrice: null, compareAtPrice: null }
        const minSalePrice = Math.min(...onSaleVars.map((v: any) => v.price as number))
        const minSaleVar = onSaleVars.find((v: any) => v.price === minSalePrice)
        return {
          salePrice: minSalePrice,
          compareAtPrice: (minSaleVar?.compareAtPrice as number) ?? null,
        }
      })(),
      shopifyCollections: Array.isArray(doc.shopifyCollections)
        ? doc.shopifyCollections.map((c: any) => ({
            title: c.title ?? '',
            handle: c.handle ?? '',
          }))
        : null,
      variations: Array.isArray(doc.variations)
        ? doc.variations.map((v: any) => ({
            name: (v.name as string) ?? '',
            price: typeof v.price === 'number' ? v.price : null,
            compareAtPrice: typeof v.compareAtPrice === 'number' ? v.compareAtPrice : null,
            imageUrl: (v.imageUrl as string) ?? null,
            available: v.available !== false,
          }))
        : null,
    }))
  } catch (error) {
    console.error('Error fetching catalog products:', error)
    return []
  }
}

/**
 * Get a single storefront by slug using direct Payload access
 * @param slug - The URL-friendly slug identifier for the storefront
 * @returns Storefront object or null if not found
 */
export async function getStorefrontBySlugDirect(slug: string): Promise<any | null> {
  try {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'storefronts',
      where: {
        slug: { equals: slug },
        isActive: { equals: true }
      },
      depth: 3,
      limit: 1,
      // Disable Next.js caching for this query to ensure fresh data
      // This is necessary because revalidatePath may not clear Payload query cache
      overrideAccess: false,
      draft: false
    })

    return result.docs[0] || null
  } catch (error) {
    console.error(`Error fetching storefront with slug "${slug}" using direct Payload access:`, error)
    return null
  }
}

/**
 * Get all active storefronts using direct Payload access
 * @returns Array of active Storefront objects sorted by most recently updated
 */
export async function getActiveStorefrontsDirect(): Promise<any[]> {
  try {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'storefronts',
      where: {
        isActive: { equals: true }
      },
      sort: '-updatedAt',
      limit: 100,
      depth: 2
    })

    return result.docs
  } catch (error) {
    console.error('Error fetching active storefronts with direct Payload access:', error)
    return []
  }
}

/**
 * Get dealer by slug with full relationship population
 * Used for dealer detail pages
 */
export async function getDealerBySlugDirect(slug: string): Promise<any | null> {
  try {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'dealers',
      where: {
        slug: { equals: slug },
        isActive: { equals: true }
      },
      depth: 2, // Populate dealerImage relationship
      limit: 1,
      draft: false
    })

    return result.docs[0] || null
  } catch (error) {
    console.error('Error fetching dealer by slug:', error)
    return null
  }
}

/**
 * Get all active dealers for generateStaticParams
 * Only fetches slug field for performance
 */
export async function getAllActiveDealersDirect(): Promise<Array<{ slug: string }>> {
  try {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'dealers',
      where: {
        isActive: { equals: true }
      },
      limit: 1000,
      select: { slug: true },
      draft: false
    })

    return result.docs.map(d => ({ slug: d.slug }))
  } catch (error) {
    console.error('Error fetching active dealers:', error)
    return []
  }
}

/**
 * Get nearby dealers using Haversine formula
 * For "Related Dealers" section
 */
export async function getNearbyDealersDirect(
  latitude: number,
  longitude: number,
  excludeSlug: string,
  maxDistance: number = 100,
  limit: number = 3
): Promise<any[]> {
  try {
    const payload = await getPayloadClient()

    // Fetch all active dealers
    const result = await payload.find({
      collection: 'dealers',
      where: {
        isActive: { equals: true },
        slug: { not_equals: excludeSlug }
      },
      select: {
        dealerName: true,
        slug: true,
        address: true,
        coordinates: true,
        contactInfo: true,
        shigeruKawaiDealer: true,
        acousticPianoDealer: true,
        professionalProductDealer: true,
        isFeatured: true,
      },
      depth: 0,
      limit: 100,
      draft: false
    })

    // Calculate distances using Haversine formula
    const dealersWithDistance = result.docs
      .map((dealer: any) => {
        if (!dealer.coordinates?.latitude || !dealer.coordinates?.longitude) {
          return null
        }

        const distance = calculateDistance(
          latitude,
          longitude,
          dealer.coordinates.latitude,
          dealer.coordinates.longitude
        )

        return { ...dealer, distance }
      })
      .filter((d): d is NonNullable<typeof d> => d !== null && d.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit)

    return dealersWithDistance
  } catch (error) {
    console.error('Error fetching nearby dealers:', error)
    return []
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in miles
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959 // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Get a single collection by its handle (Shopify slug).
 * Used for collection landing pages at /pianos/[handle].
 * depth:1 to populate the media relationship field.
 */
export async function getCollectionByHandle(handle: string): Promise<any | null> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'collections',
      where: { handle: { equals: handle } },
      depth: 1,
      limit: 1,
    })
    return result.docs[0] ?? null
  } catch (error) {
    console.error(`Error fetching collection by handle "${handle}":`, error)
    return null
  }
}

/**
 * Get all collection handles for generateStaticParams.
 * Returns only the handle field to keep the query lightweight.
 */
export async function getAllCollectionHandles(): Promise<string[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'collections',
      select: { handle: true },
      depth: 0,
      limit: 500,
    })
    return result.docs.map((d) => d.handle).filter(Boolean) as string[]
  } catch (error) {
    console.error('Error fetching collection handles:', error)
    return []
  }
}

export interface CollectionForBrowser {
  title: string
  handle: string
  pianoCategories?: string[] | null
  featured?: boolean | null
  youtubeUrl?: string | null
  mediaUrl?: string | null
  imageUrl?: string | null
  heading?: string | null
  subheading?: string | null
  textColor?: string | null
  textAlignment?: string | null
  overlayOpacity?: number | null
  headingSize?: string | null
  fontFamily?: string | null
  bannerSize?: string | null
}

/**
 * Get all collections with their piano category associations.
 * Used by the /pianos browser to show relevant collection filters per category tab.
 * Cached for 1 hour; invalidated by the 'collections' tag.
 */
export const getCollectionsForBrowser = unstable_cache(
  async (): Promise<CollectionForBrowser[]> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'collections',
      select: {
        title: true,
        handle: true,
        pianoCategories: true,
        featured: true,
        youtubeUrl: true,
        mediaUrl: true,
        imageUrl: true,
        heading: true,
        subheading: true,
        textColor: true,
        textAlignment: true,
        overlayOpacity: true,
        headingSize: true,
        fontFamily: true,
        bannerSize: true,
      },
      depth: 0,
      limit: 500,
    })
    return result.docs.map((d) => ({
      title: d.title,
      handle: d.handle,
      pianoCategories: (d.pianoCategories as string[] | null) ?? null,
      featured: (d.featured as boolean | null | undefined) ?? null,
      youtubeUrl: (d.youtubeUrl as string | null | undefined) ?? null,
      mediaUrl: (d.mediaUrl as string | null | undefined) ?? null,
      imageUrl: (d.imageUrl as string | null | undefined) ?? null,
      heading: (d.heading as string | null | undefined) ?? null,
      subheading: (d.subheading as string | null | undefined) ?? null,
      textColor: (d.textColor as string | null | undefined) ?? null,
      textAlignment: (d.textAlignment as string | null | undefined) ?? null,
      overlayOpacity: (d.overlayOpacity as number | null | undefined) ?? null,
      headingSize: (d.headingSize as string | null | undefined) ?? null,
      fontFamily: (d.fontFamily as string | null | undefined) ?? null,
      bannerSize: (d.bannerSize as string | null | undefined) ?? null,
    }))
  },
  ['collections-for-browser'],
  { tags: ['collections'], revalidate: 3600 },
)

/**
 * Get all catalog-visible products that belong to a specific collection.
 * Queries via the shopifyCollections.handle array field on products.
 * Returns a lightweight card-ready shape.
 */
export async function getProductsByCollectionHandle(handle: string): Promise<
  Array<{
    id: string
    model: string
    name?: string | null
    slug: string
    type?: string | null
    imageUrl?: string | null
    price?: { msrp?: number | null; currency?: string | null } | null
    salePrice?: number | null
    compareAtPrice?: number | null
    description?: string | null
    variations: Array<{
      name: string
      shopifyVariantId: string | null
      price: number | null
      compareAtPrice: number | null
      available: boolean
      imageUrl: string | null
    }>
  }>
> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      where: {
        'shopifyCollections.handle': { equals: handle },
        status: { equals: 'active' },
        'visibility.showInCatalog': { equals: true },
      },
      select: {
        model: true,
        name: true,
        slug: true,
        type: true,
        imageUrl: true,
        price: true,
        description: true,
        visibility: true,
        variations: true,
        shopify: true,
      },
      sort: '-price.msrp',
      depth: 0,
      limit: 100,
    })

    // Enrich each product with live Shopify variant prices in parallel
    const shopifyPriceMap = new Map<string, Map<string, { price: number; compareAtPrice: number | null }>>()
    await Promise.all(
      result.docs.map(async (doc) => {
        const shopifyHandle = (doc as any).shopify?.handle as string | null | undefined
        if (!shopifyHandle) return
        try {
          const shopifyProduct = await fetchShopifyProduct(shopifyHandle)
          if (!shopifyProduct) return
          const variantMap = new Map<string, { price: number; compareAtPrice: number | null }>()
          for (const variant of shopifyProduct.variants) {
            // Normalize to bare numeric ID for matching
            const numericId = variant.id.replace('gid://shopify/ProductVariant/', '')
            const priceNum = parseFloat(variant.price)
            const capNum = variant.compareAtPrice ? parseFloat(variant.compareAtPrice) : null
            variantMap.set(numericId, { price: priceNum, compareAtPrice: capNum })
            variantMap.set(variant.id, { price: priceNum, compareAtPrice: capNum })
          }
          shopifyPriceMap.set(String(doc.id), variantMap)
        } catch {
          // Non-fatal — fall back to CMS price if Shopify is unavailable
        }
      })
    )

    return result.docs.map((doc) => {
      const variantPrices = shopifyPriceMap.get(String(doc.id))
      const enrichedVariations = Array.isArray(doc.variations)
        ? doc.variations.map((v: any) => {
            const variantId = (v.shopifyVariantId as string) ?? null
            const shopifyPrice = variantId
              ? (variantPrices?.get(variantId) ?? variantPrices?.get(variantId?.replace('gid://shopify/ProductVariant/', '')))
              : null
            return {
              name: (v.name as string) ?? '',
              shopifyVariantId: variantId,
              price: shopifyPrice?.price ?? (typeof v.price === 'number' ? v.price : null),
              compareAtPrice: shopifyPrice?.compareAtPrice ?? (typeof v.compareAtPrice === 'number' ? v.compareAtPrice : null),
              available: v.available === true,
              imageUrl: (v.imageUrl as string) ?? null,
            }
          })
        : []

      const onSaleVars = enrichedVariations.filter(
        (v) => typeof v.compareAtPrice === 'number' && typeof v.price === 'number' && v.compareAtPrice > v.price,
      )
      const minSaleVar = onSaleVars.length > 0
        ? onSaleVars.reduce((min, v) => (v.price! < min.price! ? v : min), onSaleVars[0]!)
        : null

      return {
        id: String(doc.id),
        model: doc.model,
        name: doc.name ?? null,
        slug: doc.slug ?? '',
        type: doc.type ?? null,
        imageUrl: doc.imageUrl ?? null,
        price: doc.price
          ? { msrp: doc.price.msrp ?? null, currency: doc.price.currency ?? null }
          : null,
        salePrice: minSaleVar?.price ?? null,
        compareAtPrice: minSaleVar?.compareAtPrice ?? null,
        description: doc.description ?? null,
        variations: enrichedVariations,
      }
    })
  } catch (error) {
    console.error(`Error fetching products for collection "${handle}":`, error)
    return []
  }
}

/**
 * Get news items from the HomePage collection that have category 'view-product'.
 * Used to display a product spotlight carousel on the /pianos page.
 * Cached for 5 minutes and tagged with 'home-page' for on-demand revalidation.
 */
export const getProductSpotlightNewsItems = unstable_cache(
  async (): Promise<NewsItem[]> => {
    try {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'home-page',
        select: { newsItems: true },
        depth: 1,
        limit: 1,
      })
      const newsItems = (result as any)?.docs?.[0]?.newsItems ?? []
      return newsItems.filter((item: any) => item.category === 'view-product') as NewsItem[]
    } catch (error) {
      console.error('Failed to fetch product spotlight news items:', error)
      return []
    }
  },
  ['pianos-spotlight-news'],
  { tags: ['home-page'], revalidate: 300 }
)

// ─── FAQ Queries ──────────────────────────────────────────────────────────────

/**
 * Get all published FAQs, optionally filtered by category slug.
 */
export function getAllFaqs(categorySlug?: string) {
  const cacheKey = categorySlug ? `faqs-category-${categorySlug}` : 'faqs-all'
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      let categoryId: string | number | undefined
      if (categorySlug) {
        const catResult = await payload.find({
          collection: 'faq-categories',
          where: { slug: { equals: categorySlug } },
          depth: 0,
          limit: 1,
        })
        categoryId = catResult.docs[0]?.id
      }
      const result = await payload.find({
        collection: 'faqs',
        where: {
          status: { equals: 'published' },
          ...(categoryId ? { categories: { in: [categoryId] } } : {}),
        },
        sort: '-publishedDate',
        depth: 1,
        limit: 200,
      })
      return result.docs
    },
    [cacheKey],
    { tags: ['faqs'], revalidate: 3600 }
  )()
}

/**
 * Get all FAQ categories for filter UI.
 */
export const getAllFaqCategories = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'faq-categories',
      sort: 'displayOrder',
      depth: 0,
      limit: 100,
    })
    return result.docs
  },
  ['faq-categories-all'],
  { tags: ['faq-categories'], revalidate: 3600 }
)

/**
 * Get all published FAQ slugs for generateStaticParams.
 */
export const getAllFaqSlugs = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'faqs',
      where: { status: { equals: 'published' } },
      select: { slug: true },
      depth: 0,
      limit: 1000,
    })
    return result.docs.map((doc) => ({ slug: doc.slug as string }))
  },
  ['faq-slugs'],
  { tags: ['faqs'], revalidate: 3600 }
)

/**
 * Get a single FAQ by slug.
 */
export function getFaqBySlug(slug: string) {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'faqs',
        where: {
          slug: { equals: slug },
          status: { equals: 'published' },
        },
        depth: 2,
        limit: 1,
      })
      return result.docs[0] ?? null
    },
    [`faq-${slug}`],
    { tags: ['faqs', `faq-${slug}`], revalidate: 3600 }
  )()
}

// ─── TSD Hub Queries ──────────────────────────────────────────────────────────

/**
 * Fetch a single support group by its URL slug.
 * Used by the hub page for metadata and heading text.
 */
export function getSupportGroupBySlug(slug: string) {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'support-groups',
        where: { slug: { equals: slug }, isActive: { equals: true } },
        depth: 0,
        limit: 1,
      })
      return result.docs[0] ?? null
    },
    [`support-group-${slug}`],
    { tags: ['support-groups', `tsd-hub-${slug}`], revalidate: 3600 }
  )()
}

/**
 * Fetch all active support groups for generateStaticParams.
 */
export const getAllSupportGroups = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'support-groups',
      where: { isActive: { equals: true } },
      sort: 'displayOrder',
      depth: 0,
      limit: 100,
      select: { slug: true, name: true, heading: true, description: true, seo: true },
    })
    return result.docs
  },
  ['all-support-groups'],
  { tags: ['support-groups'], revalidate: 3600 }
)

/**
 * Get all published FAQs for a specific TSD hub, optionally filtered by category slug.
 * Per-call unstable_cache pattern since args vary per request.
 */
export function getFaqsByHub(hub: string, categorySlug?: string) {
  const cacheKey = categorySlug
    ? `faqs-hub-${hub}-cat-${categorySlug}`
    : `faqs-hub-${hub}`
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()

      // Resolve hub slug → support group ID
      const groupResult = await payload.find({
        collection: 'support-groups',
        where: { slug: { equals: hub } },
        depth: 0,
        limit: 1,
      })
      const groupId = groupResult.docs[0]?.id
      if (!groupId) return []

      let categoryId: string | number | undefined
      if (categorySlug) {
        const catResult = await payload.find({
          collection: 'faq-categories',
          where: { slug: { equals: categorySlug } },
          depth: 0,
          limit: 1,
        })
        categoryId = catResult.docs[0]?.id
      }

      const result = await payload.find({
        collection: 'faqs',
        where: {
          status: { equals: 'published' },
          group: { equals: groupId },
          ...(categoryId ? { categories: { in: [categoryId] } } : {}),
        },
        sort: '-publishedDate',
        depth: 1,
        limit: 200,
      })
      return result.docs
    },
    [cacheKey],
    { tags: ['faqs', `tsd-hub-${hub}`], revalidate: 3600 }
  )()
}

/**
 * Get all FAQ categories assigned to a specific TSD hub, sorted by displayOrder.
 */
export function getFaqCategoriesByHub(hub: string) {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()

      // Resolve hub slug → support group ID
      const groupResult = await payload.find({
        collection: 'support-groups',
        where: { slug: { equals: hub } },
        depth: 0,
        limit: 1,
      })
      const groupId = groupResult.docs[0]?.id
      if (!groupId) return []

      const result = await payload.find({
        collection: 'faq-categories',
        where: { group: { equals: groupId } },
        sort: 'displayOrder',
        depth: 0,
        limit: 100,
      })
      return result.docs
    },
    [`faq-categories-hub-${hub}`],
    { tags: ['faq-categories', `tsd-hub-${hub}`], revalidate: 3600 }
  )()
}

/**
 * Get all published FAQs for a specific product (by product ID).
 * Used by the product-faq block renderer on product pages.
 */
export function getFaqsByProductId(productId: string) {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'faqs',
        where: {
          status: { equals: 'published' },
          relatedProducts: { in: [productId] },
        },
        sort: '-publishedDate',
        depth: 0,
        limit: 50,
        select: {
          question: true,
          slug: true,
          excerpt: true,
          group: true,
        },
      })
      return result.docs
    },
    [`faqs-product-${productId}`],
    { tags: ['faqs', `product-faqs-${productId}`], revalidate: 3600 }
  )()
}

// ─── Category-filtered Queries ────────────────────────────────────────────────

/**
 * Get collections filtered by a specific piano category.
 * Used by the /pianos browser to show only collections relevant to a given tab.
 * Per-call unstable_cache pattern since the category arg varies.
 */
export function getCollectionsForCategory(
  category: 'digital' | 'grand' | 'upright' | 'hybrid',
): Promise<CollectionForBrowser[]> {
  return unstable_cache(
    async (): Promise<CollectionForBrowser[]> => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'collections',
        where: {
          pianoCategories: { contains: category },
        },
        select: {
          title: true,
          handle: true,
          pianoCategories: true,
          featured: true,
          youtubeUrl: true,
          mediaUrl: true,
          imageUrl: true,
          heading: true,
          subheading: true,
          textColor: true,
          textAlignment: true,
          overlayOpacity: true,
          headingSize: true,
          fontFamily: true,
          bannerSize: true,
        },
        depth: 1,
        limit: 100,
      })
      return result.docs.map((d) => ({
        title: d.title,
        handle: d.handle,
        pianoCategories: (d.pianoCategories as string[] | null) ?? null,
        featured: (d.featured as boolean | null | undefined) ?? null,
        youtubeUrl: (d.youtubeUrl as string | null | undefined) ?? null,
        mediaUrl: (d.mediaUrl as string | null | undefined) ?? null,
        imageUrl: (d.imageUrl as string | null | undefined) ?? null,
        heading: (d.heading as string | null | undefined) ?? null,
        subheading: (d.subheading as string | null | undefined) ?? null,
        textColor: (d.textColor as string | null | undefined) ?? null,
        textAlignment: (d.textAlignment as string | null | undefined) ?? null,
        overlayOpacity: (d.overlayOpacity as number | null | undefined) ?? null,
        headingSize: (d.headingSize as string | null | undefined) ?? null,
        fontFamily: (d.fontFamily as string | null | undefined) ?? null,
        bannerSize: (d.bannerSize as string | null | undefined) ?? null,
      }))
    },
    ['collections-for-category', category],
    { tags: ['collections', `collection-category-${category}`], revalidate: 3600 },
  )()
}

/**
 * Get all catalog-visible products for a specific piano category.
 * Filters by both the `type` and `category` fields using OR conditions that
 * cover all common values for each category.
 * Returns the same lightweight card-ready shape as getCatalogProductsDirect.
 */
export function getCatalogProductsByCategory(
  category: 'digital' | 'grand' | 'upright' | 'hybrid',
): Promise<
  Array<{
    id: string
    model: string
    name?: string | null
    slug: string
    type?: string | null
    category?: string | null
    imageUrl?: string | null
    price?: { msrp?: number | null; currency?: string | null } | null
    salePrice?: number | null
    compareAtPrice?: number | null
    shopifyCollections?: Array<{ title: string; handle: string }> | null
    variations?: Array<{
      name: string
      price: number | null
      compareAtPrice: number | null
      imageUrl: string | null
      available: boolean
    }> | null
  }>
> {
  const orConditions: Where[] = {
    grand: [
      { type: { contains: 'grand' } },
      { type: { contains: 'shigeru' } },
      { category: { contains: 'grand' } },
    ],
    digital: [
      { type: { contains: 'digital' } },
      { type: { contains: 'concert artist' } },
      { category: { contains: 'digital' } },
    ],
    upright: [
      { type: { contains: 'upright' } },
      { type: { contains: 'vertical' } },
      { category: { contains: 'upright' } },
    ],
    hybrid: [
      { type: { contains: 'hybrid' } },
      { type: { contains: 'anytime' } },
      { type: { contains: 'novus' } },
      { type: { contains: 'aures' } },
      { category: { contains: 'hybrid' } },
    ],
  }[category]

  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'products',
        where: {
          and: [
            { status: { equals: 'active' } },
            { 'visibility.showInCatalog': { equals: true } },
            { or: orConditions as Where[] },
          ],
        },
        select: {
          model: true,
          name: true,
          slug: true,
          type: true,
          category: true,
          imageUrl: true,
          price: true,
          shopifyCollections: true,
          visibility: true,
          variations: true,
        },
        sort: 'visibility.sortOrder,name',
        limit: 500,
        depth: 0,
      })

      return result.docs.map((doc) => ({
        id: String(doc.id),
        model: doc.model,
        name: doc.name ?? null,
        slug: doc.slug ?? '',
        type: doc.type ?? null,
        category: doc.category ?? null,
        imageUrl: doc.imageUrl ?? null,
        price: doc.price
          ? { msrp: doc.price.msrp ?? null, currency: doc.price.currency ?? null }
          : null,
        ...(() => {
          const vars = doc.variations
          if (!Array.isArray(vars) || vars.length === 0) return { salePrice: null, compareAtPrice: null }
          const onSaleVars = vars.filter(
            (v: any) =>
              typeof v.compareAtPrice === 'number' &&
              typeof v.price === 'number' &&
              v.compareAtPrice > v.price,
          )
          if (onSaleVars.length === 0) return { salePrice: null, compareAtPrice: null }
          const minSalePrice = Math.min(...onSaleVars.map((v: any) => v.price as number))
          const minSaleVar = onSaleVars.find((v: any) => v.price === minSalePrice)
          return {
            salePrice: minSalePrice,
            compareAtPrice: (minSaleVar?.compareAtPrice as number) ?? null,
          }
        })(),
        shopifyCollections: Array.isArray(doc.shopifyCollections)
          ? doc.shopifyCollections.map((c: any) => ({
              title: c.title ?? '',
              handle: c.handle ?? '',
            }))
          : null,
        variations: Array.isArray(doc.variations)
          ? doc.variations.map((v: any) => ({
              name: (v.name as string) ?? '',
              price: typeof v.price === 'number' ? v.price : null,
              compareAtPrice: typeof v.compareAtPrice === 'number' ? v.compareAtPrice : null,
              imageUrl: (v.imageUrl as string) ?? null,
              available: v.available !== false,
            }))
          : null,
      }))
    },
    ['catalog-products-by-category', category],
    { tags: ['products', `products-category-${category}`], revalidate: 3600 },
  )()
}

// ─── Careers Queries ────────────────────────────────────────────────────────

/**
 * Get all open job listings
 */
export const getOpenJobs = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'jobs',
      where: { status: { equals: 'open' } },
      sort: '-postedAt',
      select: { title: true, slug: true, department: true, location: true, type: true, postedAt: true, description: true },
      depth: 0,
      limit: 100,
    })
    return result.docs
  },
  ['careers-open-jobs'],
  { tags: ['careers'], revalidate: 3600 }
)

/**
 * Get the N most recently posted open jobs
 */
export async function getRecentJobs(limit = 6) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'jobs',
    where: { status: { equals: 'open' } },
    sort: '-postedAt',
    select: { title: true, slug: true, department: true, location: true, type: true, postedAt: true, description: true },
    depth: 0,
    limit,
  })
  return result.docs
}

/**
 * Get a single job by slug (for the job detail page)
 */
export async function getJobBySlug(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'jobs',
    where: { slug: { equals: slug }, status: { equals: 'open' } },
    depth: 0,
    limit: 1,
  })
  return result.docs[0] ?? null
}

/**
 * Generate static params for all open job pages
 */
export async function getAllJobSlugs() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'jobs',
    where: { status: { equals: 'open' } },
    select: { slug: true },
    depth: 0,
    limit: 500,
  })
  return result.docs
}
