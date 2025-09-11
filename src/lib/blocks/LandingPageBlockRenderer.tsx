import React from 'react'

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
interface LandingPageBlockRendererProps {
  block: any
  index: number
}

/**
 * LandingPageBlockRenderer - Renders a single block for landing pages
 */
export function LandingPageBlockRenderer({ block, index }: LandingPageBlockRendererProps) {
  // Safely extract block type
  const blockType = block.blockType as BlockType
  
  // Validate block type exists
  if (!blockType || !BLOCK_COMPONENTS[blockType]) {
    console.warn(`[LandingPageBlockRenderer] Unknown or missing block type: "${blockType}"`, {
      availableTypes: Object.keys(BLOCK_COMPONENTS),
      block: { ...block, id: block.id }
    })
    return null
  }

  // Get the component for this block type
  const BlockComponent = BLOCK_COMPONENTS[blockType]

  try {
    // Log block rendering in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[LandingPageBlockRenderer] Rendering ${blockType} block:`, {
        blockId: block.id,
        blockType,
        hasData: !!block
      })
    }

    // Render the block component with all block data
    return (
      <BlockComponent
        key={block.id || `${blockType}-${index}`}
        {...block}
      />
    )
  } catch (error) {
    console.error(`[LandingPageBlockRenderer] Error rendering ${blockType} block:`, error, {
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
          <h3 className="text-red-800 font-bold">Landing Page Block Rendering Error</h3>
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
 * LandingPageBlocksList - Renders an array of blocks for landing pages
 */
interface LandingPageBlocksListProps {
  blocks: any[]
  className?: string
}

export function LandingPageBlocksList({ blocks, className = '' }: LandingPageBlocksListProps) {
  if (!blocks || blocks.length === 0) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[LandingPageBlocksList] No blocks to render')
    }
    return null
  }

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        // Basic validation
        if (!block || typeof block !== 'object') {
          console.error(`[LandingPageBlocksList] Invalid block at index ${index}:`, block)
          return null
        }

        if (!block.blockType) {
          console.error(`[LandingPageBlocksList] Block missing blockType at index ${index}:`, block)
          return null
        }
        
        return (
          <LandingPageBlockRenderer
            key={block.id || `landing-block-${index}`}
            block={block}
            index={index}
          />
        )
      })}
    </div>
  )
}

/**
 * Utility function to validate if a value is a valid landing page block
 */
export function isValidLandingPageBlock(block: any): boolean {
  return (
    block &&
    typeof block === 'object' &&
    typeof block.blockType === 'string' &&
    block.blockType in BLOCK_COMPONENTS
  )
}

/**
 * Get available block types for landing pages
 */
export function getAvailableLandingPageBlockTypes(): string[] {
  return Object.keys(BLOCK_COMPONENTS)
}