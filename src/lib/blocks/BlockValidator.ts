import type { Product } from '@/payload-types'

// Available block types from your block definitions
const VALID_BLOCK_TYPES = [
  'hero',
  'productShowcase',
  'productHero',
  'imageGallery',
  'featuresList',
  'specifications',
  'textContent',
  'callToAction',
  'testimonials'
] as const

type ValidBlockType = typeof VALID_BLOCK_TYPES[number]

// Block validation result interface
interface BlockValidationResult {
  isValid: boolean
  blockType?: ValidBlockType
  errors: string[]
  warnings: string[]
  suggestions: string[]
}

/**
 * Validates a block object structure and data
 */
export function validateBlock(block: any, index: number): BlockValidationResult {
  const result: BlockValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    suggestions: []
  }

  // Check if block exists
  if (!block) {
    result.isValid = false
    result.errors.push(`Block at index ${index} is null or undefined`)
    return result
  }

  // Check if block has required blockType property
  if (!block.blockType) {
    result.isValid = false
    result.errors.push(`Block at index ${index} missing required 'blockType' property`)
    result.suggestions.push('Ensure the block has a blockType field matching one of your block slugs')
    return result
  }

  // Validate blockType is a string
  if (typeof block.blockType !== 'string') {
    result.isValid = false
    result.errors.push(`Block at index ${index} has invalid blockType (expected string, got ${typeof block.blockType})`)
    return result
  }

  // Validate blockType is recognized
  if (!VALID_BLOCK_TYPES.includes(block.blockType as any)) {
    result.isValid = false
    result.errors.push(`Block at index ${index} has unknown blockType: "${block.blockType}"`)
    result.suggestions.push(`Valid block types: ${VALID_BLOCK_TYPES.join(', ')}`)
    return result
  }

  result.blockType = block.blockType as ValidBlockType

  // Check for unique ID
  if (!block.id) {
    result.warnings.push(`Block at index ${index} (${block.blockType}) missing ID - will use index for React key`)
  }

  // Validate specific block types
  switch (result.blockType) {
    case 'hero':
      validateHeroBlock(block, result)
      break
    case 'productShowcase':
      validateProductShowcaseBlock(block, result)
      break
    case 'productHero':
      validateProductHeroBlock(block, result)
      break
    case 'imageGallery':
      validateImageGalleryBlock(block, result)
      break
    case 'featuresList':
      validateFeaturesListBlock(block, result)
      break
    case 'specifications':
      validateSpecificationsBlock(block, result)
      break
    case 'textContent':
      validateTextContentBlock(block, result)
      break
    case 'callToAction':
      validateCallToActionBlock(block, result)
      break
    case 'testimonials':
      validateTestimonialsBlock(block, result)
      break
  }

  return result
}

/**
 * Validates Hero block specific requirements
 */
function validateHeroBlock(block: any, result: BlockValidationResult): void {
  // Check dataSource
  if (block.dataSource && !['manual', 'pianomodel', 'hybrid'].includes(block.dataSource)) {
    result.warnings.push('Hero block has invalid dataSource - should be manual, pianomodel, or hybrid')
  }

  // Check content structure
  if (block.content) {
    if (!block.content.title && !block.pianoModel) {
      result.warnings.push('Hero block has no title and no pianoModel fallback')
    }
  }

  // Check media structure
  if (block.media && block.media.type === 'image' && !block.media.backgroundImage && !block.pianoModel) {
    result.warnings.push('Hero block set to image type but has no backgroundImage and no pianoModel fallback')
  }
}

/**
 * Validates ProductShowcase block specific requirements
 */
function validateProductShowcaseBlock(block: any, result: BlockValidationResult): void {
  if (block.dataSource && !['manual', 'pianomodel', 'hybrid'].includes(block.dataSource)) {
    result.warnings.push('ProductShowcase block has invalid dataSource')
  }

  if (!block.product && !block.pianoModel) {
    result.warnings.push('ProductShowcase block has no product data and no pianoModel fallback')
  }
}

/**
 * Validates ProductHero block specific requirements
 */
function validateProductHeroBlock(block: any, result: BlockValidationResult): void {
  // ProductHero blocks use product data directly from context, so fewer validations needed
  
  // Check layout options are valid if provided
  if (block.layout) {
    if (block.layout.imagePosition && !['left', 'right'].includes(block.layout.imagePosition)) {
      result.warnings.push('ProductHero block has invalid imagePosition - should be left or right')
    }
    
    if (block.layout.backgroundColor && !['pearl', 'white', 'black'].includes(block.layout.backgroundColor)) {
      result.warnings.push('ProductHero block has invalid backgroundColor - should be pearl, white, or black')
    }
  }
  
  // Note: No need to check for product data since it comes from the current product document
}

/**
 * Validates ImageGallery block specific requirements  
 */
function validateImageGalleryBlock(block: any, result: BlockValidationResult): void {
  if (!block.images || !Array.isArray(block.images) || block.images.length === 0) {
    if (!block.pianoModel) {
      result.warnings.push('ImageGallery block has no images and no pianoModel fallback')
    }
  }
}

/**
 * Validates FeaturesList block specific requirements
 */
function validateFeaturesListBlock(block: any, result: BlockValidationResult): void {
  if (!block.features || !Array.isArray(block.features) || block.features.length === 0) {
    if (!block.pianoModel) {
      result.warnings.push('FeaturesList block has no features and no pianoModel fallback')
    }
  }
}

/**
 * Validates Specifications block specific requirements
 */
function validateSpecificationsBlock(block: any, result: BlockValidationResult): void {
  if (!block.specifications || !Array.isArray(block.specifications) || block.specifications.length === 0) {
    if (!block.pianoModel) {
      result.warnings.push('Specifications block has no specifications and no pianoModel fallback')
    }
  }
}

/**
 * Validates TextContent block specific requirements
 */
function validateTextContentBlock(block: any, result: BlockValidationResult): void {
  if (!block.content) {
    result.warnings.push('TextContent block has no content')
  }
}

/**
 * Validates CallToAction block specific requirements
 */
function validateCallToActionBlock(block: any, result: BlockValidationResult): void {
  if (!block.content || !block.content.title) {
    result.warnings.push('CallToAction block missing title')
  }
}

/**
 * Validates Testimonials block specific requirements
 */
function validateTestimonialsBlock(block: any, result: BlockValidationResult): void {
  if (!block.testimonials || !Array.isArray(block.testimonials) || block.testimonials.length === 0) {
    result.warnings.push('Testimonials block has no testimonials')
  }
}

/**
 * Validates an entire product's blocks array
 */
export function validateProductBlocks(product: Product): {
  isValid: boolean
  validBlocks: number
  totalBlocks: number
  results: BlockValidationResult[]
} {
  if (!product.pageContent || !Array.isArray(product.pageContent)) {
    return {
      isValid: false,
      validBlocks: 0,
      totalBlocks: 0,
      results: [{
        isValid: false,
        errors: ['Product has no pageContent or pageContent is not an array'],
        warnings: [],
        suggestions: ['Add blocks to the product pageContent field in the CMS']
      }]
    }
  }

  const results = product.pageContent.map((block, index) => validateBlock(block, index))
  const validBlocks = results.filter(r => r.isValid).length

  return {
    isValid: results.every(r => r.isValid),
    validBlocks,
    totalBlocks: product.pageContent.length,
    results
  }
}

/**
 * Logs validation results for debugging
 */
export function logBlockValidation(product: Product): void {
  if (process.env.NODE_ENV !== 'development') return

  const validation = validateProductBlocks(product)
  
  console.group(`[BlockValidator] Product: ${product.name}`)
  console.log(`Blocks: ${validation.validBlocks}/${validation.totalBlocks} valid`)
  
  if (!validation.isValid) {
    console.group('❌ Validation Issues:')
    validation.results.forEach((result, index) => {
      if (result.errors.length > 0) {
        console.error(`Block ${index} (${result.blockType || 'unknown'}):`, result.errors)
      }
      if (result.warnings.length > 0) {
        console.warn(`Block ${index} (${result.blockType || 'unknown'}):`, result.warnings)
      }
      if (result.suggestions.length > 0) {
        console.info(`Block ${index} suggestions:`, result.suggestions)
      }
    })
    console.groupEnd()
  } else {
    console.log('✅ All blocks valid')
  }
  
  console.groupEnd()
}