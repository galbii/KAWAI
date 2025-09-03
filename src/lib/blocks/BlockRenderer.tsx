import React from 'react'
import type { Product } from '@/payload-types'
import { populateBlockData } from '@/lib/blockDataPopulation'
import { validateBlock, logBlockValidation } from './BlockValidator'

// Import all block components
import { HeroBlock } from '@/components/blocks/HeroBlock'
import { ProductShowcaseBlock } from '@/components/blocks/ProductShowcaseBlock'
import { ProductHeroBlock } from '@/components/blocks/ProductHeroBlock'
import { ImageGalleryBlock } from '@/components/blocks/ImageGalleryBlock'
import { FeaturesListBlock } from '@/components/blocks/FeaturesListBlock'
import { SpecificationsBlock } from '@/components/blocks/SpecificationsBlock'
import { TextContentBlock } from '@/components/blocks/TextContentBlock'
import { CallToActionBlock } from '@/components/blocks/CallToActionBlock'
import { TestimonialsBlock } from '@/components/blocks/TestimonialsBlock'

// Block component mapping
const BLOCK_COMPONENTS = {
  hero: HeroBlock,
  productShowcase: ProductShowcaseBlock,
  productHero: ProductHeroBlock,
  imageGallery: ImageGalleryBlock,
  featuresList: FeaturesListBlock,
  specifications: SpecificationsBlock,
  textContent: TextContentBlock,
  callToAction: CallToActionBlock,
  testimonials: TestimonialsBlock,
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
export function BlockRenderer({ block, index, product }: BlockRendererProps) {
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
    // For ProductHero blocks, pass product data directly without complex data population
    if (blockType === 'productHero') {
      const populatedBlock = {
        ...block,
        product: product
      }
      
      // Log ProductHero rendering in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[BlockRenderer] Rendering ProductHero block with direct product data:`, {
          blockId: block.id,
          productName: product.name,
          hasMainImage: !!product.mainImage,
          hasFinishes: !!(product.finishes && product.finishes.length > 0)
        })
      }

      // Render the ProductHero component with product data
      return (
        <BlockComponent
          key={block.id || `${blockType}-${index}`}
          {...populatedBlock}
        />
      )
    }
    
    // For other blocks, populate block data with pianoModel integration
    const populatedBlock = populateBlockData(block, blockType, product)
    
    // Log block rendering in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[BlockRenderer] Rendering ${blockType} block:`, {
        blockId: block.id,
        dataSource: block.dataSource,
        hasProduct: !!product,
        hasPianoModel: !!(product.pianoModel && typeof product.pianoModel === 'object')
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