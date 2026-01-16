import type { Product, Media } from '@/payload-types'
import { resolveMediaUrl } from '@/lib/payload'

/**
 * Block Data Population System
 *
 * This system handles the 3 data source modes for consolidated Products:
 * 1. 'manual' - Use only manual block data
 * 2. 'product' - Use product data (formerly 'pianomodel')
 * 3. 'hybrid' - Use product data as base, override with manual data where provided
 */

// Type for block data with product relationship
interface BlockWithProduct {
  dataSource?: 'manual' | 'product' | 'pianomodel' | 'hybrid' | null
  product?: string | Product | null
  // Legacy support for pianoModel field (will map to product)
  pianoModel?: string | Product | null
}

// Extract product from relationship field (legacy support for pianoModel field name)
export function extractPianoModel(block: any, product: Product): Product | null {
  // First check if block has a pianoModel relationship
  if (block.pianoModel && typeof block.pianoModel === 'object') {
    return block.pianoModel as Product
  }

  // Since we consolidated PianoModels into Products, return null
  // The product itself now contains all the consolidated data
  return null
}

// Hero Block Data Population
interface HeroBlockData {
  dataSource?: 'manual' | 'pianomodel' | 'hybrid' | null
  pianoModel?: string | Product | null
  content?: {
    title?: string | null
    subtitle?: string | null
    description?: string | null
    primaryCta?: {
      text?: string | null
      link?: string | null
      style?: string | null
      openInNewTab?: boolean | null
    }
    secondaryCta?: {
      text?: string | null
      link?: string | null
      style?: string | null
      openInNewTab?: boolean | null
    }
  }
  media?: {
    type?: 'image' | 'video' | 'none' | null
    backgroundImage?: string | Media | null
    backgroundVideo?: string | Media | null
    overlay?: {
      enable?: boolean | null
      color?: 'dark' | 'light' | 'brand' | null
      opacity?: number | null
    }
  }
  layout?: {
    height?: 'small' | 'medium' | 'large' | 'fullscreen' | null
    contentAlignment?: 'left' | 'center' | 'right' | null
    verticalAlignment?: 'top' | 'center' | 'bottom' | null
    maxWidth?: 'small' | 'medium' | 'large' | 'full' | null
  }
}

export function populateHeroData(block: HeroBlockData, product: Product) {
  const dataSource = block.dataSource || 'manual'

  if (dataSource === 'manual') {
    // Return block data as-is
    return block
  }

  if (dataSource === 'pianomodel' && product.type === 'piano') {
    // Use consolidated product data (formerly PianoModel data)
    return {
      ...block,
      content: {
        title: product.name,
        subtitle: product.description || '',
        description: product.description,
        // Keep manual CTA buttons
        primaryCta: block.content?.primaryCta,
        secondaryCta: block.content?.secondaryCta
      },
      media: {
        ...block.media,
        backgroundImage: product.imageUrl, // Use product main image
      }
    }
  }

  if (dataSource === 'hybrid' && product.type === 'piano') {
    // Use product data as base, override with manual data where provided
    return {
      ...block,
      content: {
        title: block.content?.title || product.name,
        subtitle: block.content?.subtitle || product.description || '',
        description: block.content?.description || product.description,
        primaryCta: block.content?.primaryCta, // Always manual
        secondaryCta: block.content?.secondaryCta // Always manual
      },
      media: {
        ...block.media,
        backgroundImage: block.media?.backgroundImage || product.imageUrl,
      }
    }
  }

  // Fallback to original block data
  return block
}

// Product Showcase Block Data Population
interface ProductShowcaseBlockData {
  dataSource?: 'manual' | 'pianomodel' | 'hybrid' | null
  pianoModel?: string | Product | null
  product?: {
    image?: string | Media | null
    title?: string | null
    description?: string | null
    price?: {
      currency?: 'USD' | 'EUR' | 'GBP' | 'CAD' | null
      amount?: number | null
      saleAmount?: number | null
      priceText?: string | null
    }
    variations?: Array<{
      name: string
      price?: number | null
      image?: string | Media | null
    }> | null
    buyButton?: {
      text?: string | null
      link?: string | null
      style?: 'primary' | 'secondary' | 'outline' | null
      openInNewTab?: boolean | null
    }
    badge?: string | null
    inStock?: boolean | null
  }
  layout?: {
    imagePosition?: 'left' | 'right' | 'top' | 'bottom' | null
    showVariations?: boolean | null
    showPrice?: boolean | null
    compact?: boolean | null
  }
}

export function populateProductShowcaseData(block: ProductShowcaseBlockData, product: Product) {
  const dataSource = block.dataSource || 'manual'

  if (dataSource === 'manual') {
    return block
  }

  if (dataSource === 'pianomodel' && product.type === 'piano') {
    // Use consolidated product data
    return {
      ...block,
      product: {
        image: product.imageUrl,
        title: product.name,
        description: product.description,
        price: {
          currency: product.price?.currency,
          amount: product.price?.msrp,
          saleAmount: undefined,
          priceText: undefined
        },
        variations: product.variations?.map(variation => ({
          name: variation.name || '',
          price: variation.price,
          image: variation.image,
        })),
        // Keep manual buy button
        buyButton: block.product?.buyButton,
        badge: block.product?.badge,
        inStock: block.product?.inStock
      }
    }
  }

  if (dataSource === 'hybrid' && product.type === 'piano') {
    // Use product data as base, override with manual data where provided
    return {
      ...block,
      product: {
        image: block.product?.image || product.imageUrl,
        title: block.product?.title || product.name,
        description: block.product?.description || product.description,
        price: {
          currency: block.product?.price?.currency || product.price?.currency,
          amount: block.product?.price?.amount || product.price?.msrp,
          saleAmount: block.product?.price?.saleAmount || undefined,
          priceText: block.product?.price?.priceText || undefined
        },
        variations: block.product?.variations || product.variations?.map(variation => ({
          name: variation.name || '',
          image: variation.image,
          price: variation.price
        })),
        buyButton: block.product?.buyButton, // Always manual
        badge: block.product?.badge, // Always manual
        inStock: block.product?.inStock // Always manual
      }
    }
  }

  return block
}

// Image Gallery Block Data Population
interface ImageGalleryBlockData {
  dataSource?: 'manual' | 'pianomodel' | 'hybrid' | null
  pianoModel?: string | Product | null
  images?: Array<{
    image: string | Media
    caption?: string | null
    alt?: string | null
  }> | null
  layout?: {
    columns?: number | null
    aspectRatio?: string | null
    showCaptions?: boolean | null
    lightbox?: boolean | null
  }
}

export function populateImageGalleryData(block: ImageGalleryBlockData, product: Product) {
  const dataSource = block.dataSource || 'manual'

  if (dataSource === 'manual') {
    return block
  }

  if (dataSource === 'pianomodel' && product.type === 'piano') {
    // Use product main image for gallery
    const galleryImages = [{
      image: product.imageUrl,
      caption: `${product.name} main image`,
      alt: `${product.name} main image`
    }]

    return {
      ...block,
      images: galleryImages
    }
  }

  if (dataSource === 'hybrid' && product.type === 'piano') {
    // Use manual images if provided, otherwise use product main image
    if (block.images && block.images.length > 0) {
      return block // Use manual images
    }

    const galleryImages = [{
      image: product.imageUrl,
      caption: `${product.name} main image`,
      alt: `${product.name} main image`
    }]

    return {
      ...block,
      images: galleryImages
    }
  }

  return block
}

// Features List Block Data Population
interface FeaturesListBlockData {
  dataSource?: 'manual' | 'pianomodel' | 'hybrid' | null
  pianoModel?: string | Product | null
  features?: Array<{
    icon?: string | null
    title?: string | null
    description?: string | null
  }> | null
  layout?: {
    columns?: number | null
    showIcons?: boolean | null
    compact?: boolean | null
  }
}

export function populateFeaturesListData(block: FeaturesListBlockData, product: Product) {
  const dataSource = block.dataSource || 'manual'

  if (dataSource === 'manual') {
    return block
  }

  if (dataSource === 'pianomodel' && product.type === 'piano') {
    // keyFeatures field removed from Product schema - use Page Content blocks instead
    const features: any[] = []

    return {
      ...block,
      features
    }
  }

  if (dataSource === 'hybrid' && product.type === 'piano') {
    // Use manual features if provided, otherwise use product features
    if (block.features && block.features.length > 0) {
      return block // Use manual features
    }

    // keyFeatures field removed from Product schema - use Page Content blocks instead
    const features: any[] = []

    return {
      ...block,
      features
    }
  }

  return block
}

// Specifications Block Data Population
interface SpecificationsBlockData {
  dataSource?: 'manual' | 'pianomodel' | 'hybrid' | null
  pianoModel?: string | Product | null
  specifications?: Array<{
    category?: string | null
    specs?: Array<{
      label: string
      value: string
    }> | null
  }> | null
  layout?: {
    columns?: number | null
    showCategories?: boolean | null
    compact?: boolean | null
  }
}

export function populateSpecificationsData(block: SpecificationsBlockData, product: Product) {
  const dataSource = block.dataSource || 'manual'

  if (dataSource === 'manual') {
    return block
  }

  // specifications field removed from Product schema - use Page Content blocks instead
  if (false && dataSource === 'pianomodel' && product.type === 'piano') {
    // Transform product specifications into block format
    const specs = null as any
    const specifications = [
      {
        category: 'General Specifications',
        specs: [
          ...(specs.keys ? [{ label: 'Keys', value: specs.keys.toString() }] : []),
          ...(specs.pedals ? [{ label: 'Pedals', value: specs.pedals.toString() }] : []),
          ...(specs.voices ? [{ label: 'Voices', value: specs.voices.toString() }] : []),
          ...(specs.polyphony ? [{ label: 'Polyphony', value: specs.polyphony.toString() }] : []),
          ...(specs.actionType ? [{ label: 'Action Type', value: specs.actionType }] : []),
          ...(specs.soundEngine ? [{ label: 'Sound Engine', value: specs.soundEngine }] : []),
        ]
      },
      ...(specs.dimensions ? [{
        category: 'Dimensions',
        specs: [
          ...(specs.dimensions.width ? [{ label: 'Width', value: specs.dimensions.width }] : []),
          ...(specs.dimensions.depth ? [{ label: 'Depth', value: specs.dimensions.depth }] : []),
          ...(specs.dimensions.height ? [{ label: 'Height', value: specs.dimensions.height }] : []),
        ]
      }] : []),
      ...(specs.weight ? [{
        category: 'Physical',
        specs: [
          { label: 'Weight', value: specs.weight }
        ]
      }] : [])
    ].filter(category => category.specs && category.specs.length > 0)

    return {
      ...block,
      specifications
    }
  }

  if (dataSource === 'hybrid' && product.type === 'piano') {
    // Use manual specs if provided, otherwise use product specs
    if (block.specifications && block.specifications.length > 0) {
      return block // Use manual specifications
    }

    // Use the same logic as pianomodel mode
    return populateSpecificationsData({ ...block, dataSource: 'pianomodel' }, product)
  }

  return block
}

// Master block population function
export function populateBlockData(block: any, blockType: string, product: Product) {
  switch (blockType) {
    case 'hero':
      return populateHeroData(block, product)
    case 'productShowcase':
      return populateProductShowcaseData(block, product)
    case 'imageGallery':
      return populateImageGalleryData(block, product)
    case 'featuresList':
      return populateFeaturesListData(block, product)
    case 'specifications':
      return populateSpecificationsData(block, product)
    default:
      // For blocks that don't have pianoModel integration (textContent, callToAction, testimonials)
      return block
  }
}