import { getPayload } from 'payload'
import config from '@/payload.config'
import type {
  Productline,
  Product,
  PianosPage,
  HomePage,
  Media
} from '@/payload-types'

// Direct Payload client access - bypasses HTTP and works during build time
// This is the preferred approach for server-side data fetching

/**
 * Initialize Payload client for direct database access
 * Works during build time without HTTP API calls
 */
async function getPayloadClient() {
  return await getPayload({ config })
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
    heroSection: {
      locationText: "St. Louis's Premier Kawai Piano Dealer",
      establishedText: "Est. 1927 • Lake St. Louis, Missouri",
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
        { day: 'Monday', time: '10:00 am–7:00 pm' },
        { day: 'Tuesday', time: '10:00 am–7:00 pm' },
        { day: 'Wednesday', time: '10:00 am–7:00 pm' },
        { day: 'Thursday', time: '10:00 am–7:00 pm' },
        { day: 'Friday', time: '10:00 am–7:00 pm' },
        { day: 'Saturday', time: '10:00 am–6:00 pm' },
        { day: 'Sunday', time: '1:00 pm–5:00 pm' }
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
 * Get productlines using direct Payload access
 */
export async function getProductlinesDirect(category?: string): Promise<Productline[]> {
  try {
    const payload = await getPayloadClient()

    const whereClause: any = {}

    if (category) {
      whereClause.category = { equals: category }
    }

    const result = await payload.find({
      collection: 'productlines',
      where: whereClause,
      sort: 'sortOrder,name',
      limit: 100,
      depth: 2
    })

    return result.docs
  } catch (error) {
    console.error('Error fetching productlines with direct Payload access:', error)
    return []
  }
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
      depth: 3
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
      depth: 3,
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
      status: { equals: 'active' },
      discontinued: { not_equals: true }
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
      sort: 'visibility.sortOrder,name',
      limit: options?.limit || 100,
      depth: 3
    })

    return result.docs
  } catch (error) {
    console.error('Error fetching active products with direct Payload access:', error)
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

    console.log(`[Payload Direct] Fetching storefront "${slug}" - Hours from DB:`, result.docs[0]?.hours?.slice(0, 2))

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