import type { Product, PianoModel, Media } from '@/payload-types'
import { resolveMediaUrl } from '@/lib/payload'

/**
 * Block Data Population System
 * 
 * This system handles the 3 data source modes implemented by Agent 1:
 * 1. 'manual' - Use only manual block data
 * 2. 'pianomodel' - Use only PianoModel data  
 * 3. 'hybrid' - Use PianoModel data as base, override with manual data where provided
 */

// Type for block data with pianoModel relationship
interface BlockWithPianoModel {
  dataSource?: 'manual' | 'pianomodel' | 'hybrid' | null
  pianoModel?: string | PianoModel | null
}

// Extract PianoModel from relationship field
export function extractPianoModel(block: BlockWithPianoModel, product: Product): PianoModel | null {
  // First check if block has a pianoModel relationship
  if (block.pianoModel && typeof block.pianoModel === 'object') {
    return block.pianoModel
  }
  
  // Fall back to product's pianoModel relationship
  if (product.pianoModel && typeof product.pianoModel === 'object') {
    return product.pianoModel
  }
  
  return null
}

// Hero Block Data Population
interface HeroBlockData {
  dataSource?: 'manual' | 'pianomodel' | 'hybrid' | null
  pianoModel?: string | PianoModel | null
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
  const pianoModel = extractPianoModel(block, product)

  if (dataSource === 'manual') {
    // Return block data as-is
    return block
  }

  if (dataSource === 'pianomodel' && pianoModel) {
    // Use only PianoModel data
    return {
      ...block,
      content: {
        title: pianoModel.name,
        subtitle: pianoModel.shortDescription || '',
        description: pianoModel.description,
        // Keep manual CTA buttons as they're not in PianoModel
        primaryCta: block.content?.primaryCta,
        secondaryCta: block.content?.secondaryCta
      },
      media: {
        ...block.media,
        backgroundImage: pianoModel.image, // Use PianoModel main image
      }
    }
  }

  if (dataSource === 'hybrid' && pianoModel) {
    // Use PianoModel as base, override with manual data where provided
    return {
      ...block,
      content: {
        title: block.content?.title || pianoModel.name,
        subtitle: block.content?.subtitle || pianoModel.shortDescription || '',
        description: block.content?.description || pianoModel.description,
        primaryCta: block.content?.primaryCta, // Always manual
        secondaryCta: block.content?.secondaryCta // Always manual
      },
      media: {
        ...block.media,
        backgroundImage: block.media?.backgroundImage || pianoModel.image,
      }
    }
  }

  // Fallback to original block data
  return block
}

// Product Showcase Block Data Population
interface ProductShowcaseBlockData {
  dataSource?: 'manual' | 'pianomodel' | 'hybrid' | null
  pianoModel?: string | PianoModel | null
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
    finishes?: Array<{
      name: string
      image?: string | Media | null
      priceModifier?: number | null
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
    showFinishes?: boolean | null
    showPrice?: boolean | null
    compact?: boolean | null
  }
}

export function populateProductShowcaseData(block: ProductShowcaseBlockData, product: Product) {
  const dataSource = block.dataSource || 'manual'
  const pianoModel = extractPianoModel(block, product)

  if (dataSource === 'manual') {
    return block
  }

  if (dataSource === 'pianomodel' && pianoModel) {
    // Use only PianoModel data
    return {
      ...block,
      product: {
        image: pianoModel.image,
        title: pianoModel.name,
        description: pianoModel.description,
        price: {
          currency: pianoModel.pricing?.currency,
          amount: pianoModel.pricing?.msrp,
          saleAmount: pianoModel.pricing?.salePrice,
          priceText: pianoModel.pricing?.priceText
        },
        finishes: pianoModel.availableFinishes?.map(finish => ({
          name: finish.name || '',
          image: finish.image,
          priceModifier: finish.priceModifier
        })),
        // Keep manual buy button as it's not in PianoModel schema
        buyButton: block.product?.buyButton,
        badge: block.product?.badge,
        inStock: block.product?.inStock
      }
    }
  }

  if (dataSource === 'hybrid' && pianoModel) {
    // Use PianoModel as base, override with manual data where provided
    return {
      ...block,
      product: {
        image: block.product?.image || pianoModel.image,
        title: block.product?.title || pianoModel.name,
        description: block.product?.description || pianoModel.description,
        price: {
          currency: block.product?.price?.currency || pianoModel.pricing?.currency,
          amount: block.product?.price?.amount || pianoModel.pricing?.msrp,
          saleAmount: block.product?.price?.saleAmount || pianoModel.pricing?.salePrice,
          priceText: block.product?.price?.priceText || pianoModel.pricing?.priceText
        },
        finishes: block.product?.finishes || pianoModel.availableFinishes?.map(finish => ({
          name: finish.name || '',
          image: finish.image,
          priceModifier: finish.priceModifier
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
  pianoModel?: string | PianoModel | null
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
  const pianoModel = extractPianoModel(block, product)

  if (dataSource === 'manual') {
    return block
  }

  if (dataSource === 'pianomodel' && pianoModel) {
    // PianoModel no longer has gallery field - just use main image
    const galleryImages = [{
      image: pianoModel.image,
      caption: `${pianoModel.name} main image`,
      alt: `${pianoModel.name} main image`
    }]

    return {
      ...block,
      images: galleryImages
    }
  }

  if (dataSource === 'hybrid' && pianoModel) {
    // Use manual images if provided, otherwise use PianoModel main image
    if (block.images && block.images.length > 0) {
      return block // Use manual images
    }

    const galleryImages = [{
      image: pianoModel.image,
      caption: `${pianoModel.name} main image`,
      alt: `${pianoModel.name} main image`
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
  pianoModel?: string | PianoModel | null
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
  const pianoModel = extractPianoModel(block, product)

  if (dataSource === 'manual') {
    return block
  }

  if (dataSource === 'pianomodel' && pianoModel) {
    // Use PianoModel key features
    const features = pianoModel.keyFeatures?.map(kf => ({
      icon: 'music', // Default icon
      title: kf.feature,
      description: '' // PianoModel doesn't have feature descriptions
    })) || []

    return {
      ...block,
      features
    }
  }

  if (dataSource === 'hybrid' && pianoModel) {
    // Use manual features if provided, otherwise use PianoModel features
    if (block.features && block.features.length > 0) {
      return block // Use manual features
    }

    const features = pianoModel.keyFeatures?.map(kf => ({
      icon: 'music', // Default icon
      title: kf.feature,
      description: ''
    })) || []

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
  pianoModel?: string | PianoModel | null
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
  const pianoModel = extractPianoModel(block, product)

  if (dataSource === 'manual') {
    return block
  }

  if (dataSource === 'pianomodel' && pianoModel && pianoModel.specifications) {
    // Transform PianoModel specifications into block format
    const specs = pianoModel.specifications
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

  if (dataSource === 'hybrid' && pianoModel) {
    // Use manual specs if provided, otherwise use PianoModel specs
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