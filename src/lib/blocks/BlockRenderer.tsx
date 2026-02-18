import React from 'react'
import type { Product } from '@/payload-types'
import { populateBlockData } from '@/lib/blockDataPopulation'
import { validateBlock, logBlockValidation } from './BlockValidator'
import { getProductByModel } from '@/lib/shopify'

// Import all block components
import { HeroBlock } from '@/components/blocks/HeroBlock'
import { ProductShowcaseBlock } from '@/components/blocks/ProductShowcaseBlock'
import { ProductHeroBlock } from '@/components/blocks/ProductHeroBlock'
import { ProductDescriptionRenderer } from '@/components/blocks/product/ProductDescriptionRenderer'
import { ProductTechnicalSpecsRenderer } from '@/components/blocks/product/ProductTechnicalSpecsRenderer'
import { ProductFeatureSlidesRenderer } from '@/components/blocks/product/ProductFeatureSlidesRenderer'
import { ImageGalleryBlock } from '@/components/blocks/ImageGalleryBlock'
import { FeaturesListBlock } from '@/components/blocks/FeaturesListBlock'
import { SpecificationsBlock } from '@/components/blocks/SpecificationsBlock'
import { TextContentBlock } from '@/components/blocks/TextContentBlock'
import { CallToActionBlock } from '@/components/blocks/CallToActionBlock'
import { TestimonialsBlock } from '@/components/blocks/TestimonialsBlock'
import { BannerBlock } from '@/components/blocks/BannerBlock'
import { CodeBlock } from '@/components/blocks/CodeBlock'
import { CollectionShowcaseBlock } from '@/components/blocks/CollectionShowcaseBlock'
import { FloatingAddToCartBlock } from '@/components/blocks/FloatingAddToCartBlock'

// Block component mapping (using actual block slugs from block definitions)
const BLOCK_COMPONENTS = {
  // Marketing blocks
  'marketing-hero': HeroBlock,
  'marketing-cta': CallToActionBlock,
  'marketing-testimonials': TestimonialsBlock,
  // Product blocks
  'product-showcase': ProductShowcaseBlock,
  'product-hero': ProductHeroBlock,
  'product-description': ProductDescriptionRenderer,
  'product-gallery': ImageGalleryBlock,
  'product-features': FeaturesListBlock,
  'product-specs': SpecificationsBlock,
  'product-technical-specs': ProductTechnicalSpecsRenderer,
  'product-feature-slides': ProductFeatureSlidesRenderer,
  'product-collection-showcase': CollectionShowcaseBlock,
  'product-floating-add-to-cart': FloatingAddToCartBlock,
  // Content blocks
  'content-text': TextContentBlock,
  'content-banner': BannerBlock,
  'content-code': CodeBlock,
  // Legacy blocks (for backward compatibility)
  'textContent': TextContentBlock,
} as const

// Type for valid block types
type BlockType = keyof typeof BLOCK_COMPONENTS

// Props for individual block rendering
interface BlockRendererProps {
  block: any
  index: number
  product: Product
}

/**
 * BlockRenderer - Renders a single block with proper data population
 */
export async function BlockRenderer({ block, index, product }: BlockRendererProps) {
  // Safely extract block type
  const blockType = block.blockType as BlockType
  
  // Validate block type exists
  if (!blockType || !BLOCK_COMPONENTS[blockType]) {
    console.warn(`[BlockRenderer] Unknown or missing block type: "${blockType}"`, {
      availableTypes: Object.keys(BLOCK_COMPONENTS),
      block: { ...block, id: block.id }
    })
    return null
  }

  // Get the component for this block type
  const BlockComponent = BLOCK_COMPONENTS[blockType]

  try {
    // For ProductHero, ProductDescription, and FloatingAddToCart blocks, fetch Shopify product and pass both CMS + Shopify data
    if (blockType === 'product-hero' || blockType === 'product-description' || blockType === 'product-floating-add-to-cart') {
      // Fetch Shopify product server-side using model field
      let shopifyProduct = null

      if (product.model) {
        try {
          console.log(`[BlockRenderer] Fetching Shopify product for model: "${product.model}"`)
          shopifyProduct = await getProductByModel(product.model)

          if (shopifyProduct) {
            console.log(`[BlockRenderer] Shopify product loaded: "${shopifyProduct.title}" with ${shopifyProduct.variants.length} variant(s)`)
          } else {
            console.log(`[BlockRenderer] No Shopify product found for model "${product.model}"`)
          }
        } catch (error) {
          console.error('[BlockRenderer] Failed to fetch Shopify product:', error)
          shopifyProduct = null
        }
      } else {
        console.log('[BlockRenderer] No model field available, skipping Shopify lookup')
      }

      const populatedBlock = {
        ...block,
        product: product,
        shopifyProduct: shopifyProduct
      }

      // Log block rendering in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[BlockRenderer] Rendering ${blockType} block:`, {
          blockId: block.id,
          productName: product.name,
          hasMainImage: !!product.imageUrl,
          hasVariations: !!(product.variations && product.variations.length > 0),
          hasShopifyProduct: !!shopifyProduct,
          shopifyVariants: shopifyProduct?.variants.length || 0
        })
      }

      // Render the component with product data
      return (
        <BlockComponent
          key={block.id || `${blockType}-${index}`}
          {...populatedBlock}
        />
      )
    }
    
    // For product-collection-showcase, pass the Payload product (highlights already synced)
    if (blockType === 'product-collection-showcase') {
      const populatedBlock = { ...block, product }
      return <BlockComponent key={block.id || `${blockType}-${index}`} {...populatedBlock} />
    }

    // For other blocks, populate block data with pianoModel integration
    const populatedBlock = populateBlockData(block, blockType, product)
    
    // Log block rendering in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[BlockRenderer] Rendering ${blockType} block:`, {
        blockId: block.id,
        dataSource: block.dataSource,
        hasProduct: !!product,
        hasProductline: false // Productlines collection removed
      })
    }

    // Render the block component
    return (
      <BlockComponent
        key={block.id || `${blockType}-${index}`}
        {...populatedBlock}
      />
    )
  } catch (error) {
    console.error(`[BlockRenderer] Error rendering ${blockType} block:`, error, {
      blockId: block.id,
      blockData: block
    })
    
    // Return error fallback in development
    if (process.env.NODE_ENV === 'development') {
      return (
        <div 
          key={block.id || `error-${blockType}-${index}`}
          className="border-2 border-red-500 bg-red-50 p-4 m-4 rounded-lg"
        >
          <h3 className="text-red-800 font-bold">Block Rendering Error</h3>
          <p className="text-red-700">Block Type: {blockType}</p>
          <p className="text-red-700">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
          <details className="mt-2">
            <summary className="cursor-pointer text-red-600">Block Data</summary>
            <pre className="text-xs mt-2 p-2 bg-red-100 rounded overflow-auto">
              {JSON.stringify(block, null, 2)}
            </pre>
          </details>
        </div>
      )
    }
    
    return null
  }
}

/**
 * BlocksList - Renders an array of blocks
 */
interface BlocksListProps {
  blocks: any[]
  product: Product
}

export function BlocksList({ blocks, product }: BlocksListProps) {
  // Validate blocks in development
  if (process.env.NODE_ENV === 'development') {
    logBlockValidation(product)
  }

  if (!blocks || blocks.length === 0) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[BlocksList] No blocks to render', { product: product.name })
    }
    return null
  }

  return (
    <>
      {blocks.map((block, index) => {
        // Validate each block before rendering
        const validation = validateBlock(block, index)
        
        if (!validation.isValid) {
          console.error(`[BlocksList] Skipping invalid block at index ${index}:`, validation.errors)
          
          // Show error in development
          if (process.env.NODE_ENV === 'development') {
            return (
              <div 
                key={block.id || `invalid-block-${index}`}
                className="border-2 border-red-500 bg-red-50 p-4 m-4 rounded-lg"
              >
                <h3 className="text-red-800 font-bold">Invalid Block</h3>
                <p className="text-red-700">Block Index: {index}</p>
                <div className="text-red-700">
                  <strong>Errors:</strong>
                  <ul className="list-disc list-inside ml-2">
                    {validation.errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
                {validation.suggestions.length > 0 && (
                  <div className="text-blue-700 mt-2">
                    <strong>Suggestions:</strong>
                    <ul className="list-disc list-inside ml-2">
                      {validation.suggestions.map((suggestion, i) => (
                        <li key={i}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          }
          
          return null
        }
        
        return (
          <BlockRenderer
            key={block.id || `block-${index}`}
            block={block}
            index={index}
            product={product}
          />
        )
      })}
    </>
  )
}

/**
 * Utility function to validate if a value is a valid block
 */
export function isValidBlock(block: any): boolean {
  return (
    block &&
    typeof block === 'object' &&
    typeof block.blockType === 'string' &&
    block.blockType in BLOCK_COMPONENTS
  )
}

/**
 * Get available block types
 */
export function getAvailableBlockTypes(): string[] {
  return Object.keys(BLOCK_COMPONENTS)
}