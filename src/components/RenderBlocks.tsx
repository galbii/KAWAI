/**
 * RenderBlocks - Universal Block Renderer
 *
 * Dynamically renders Payload CMS blocks from the `layout` field.
 * Supports 22 block types across 5 categories.
 *
 * Block Categories:
 * - Legacy (4): archive, content, mediaBlock, cta
 * - Content (5): content-text, content-image, content-video, content-code, content-banner
 * - Layout (6): layout-columns, layout-spacer, layout-divider, layout-hero-carousel, layout-video-background, layout-brand-intro
 * - Marketing (4): marketing-hero, marketing-cta, marketing-testimonials, marketing-i2l
 * - Product (5): product-showcase, product-hero, product-gallery, product-features, product-specs
 *
 * Usage:
 * ```tsx
 * import { RenderBlocks } from '@/components/RenderBlocks'
 *
 * export default function Page({ layout }) {
 *   return <RenderBlocks blocks={layout} />
 * }
 * ```
 *
 * Adding New Blocks:
 * 1. Create block component in src/components/blocks/
 * 2. Import component below
 * 3. Add to blockComponents mapping with correct slug
 * 4. Update barrel export in src/components/blocks/index.ts
 *
 * @see docs/BLOCKS.md for detailed block documentation
 */

import React, { Fragment } from 'react'
import type { Page } from '@/payload-types'
import { cn } from '@/lib/utils'

// Legacy Blocks (backward compatibility)
import { ArchiveBlock } from './blocks/ArchiveBlock'
import { ContentBlock } from './blocks/ContentBlock'
import { MediaBlock } from './blocks/MediaBlock'
import { CtaBlock } from './blocks/CtaBlock'

// Content Blocks - Editorial content (text, media, code)
import { TextBlock } from './blocks/TextBlock'
import { ImageBlock } from './blocks/ImageBlock'
import { VideoBlock } from './blocks/VideoBlock'
import { CodeBlock } from './blocks/CodeBlock'
import { BannerBlock } from './blocks/BannerBlock'

// Layout Blocks - Structural components
import { ColumnsBlock } from './blocks/ColumnsBlock'
import { SpacerBlock } from './blocks/SpacerBlock'
import { DividerBlock } from './blocks/DividerBlock'
import { HeroCarouselBlock } from './blocks/HeroCarouselBlock'
import { VideoBackgroundBlock } from './blocks/VideoBackgroundBlock'
import { BrandIntroBlock } from './blocks/BrandIntroBlock'

// Marketing Blocks - Conversion-focused
import { HeroBlock } from './blocks/HeroBlock'
import { CallToActionBlock } from './blocks/CallToActionBlock'
import { TestimonialsBlock } from './blocks/TestimonialsBlock'
import { InstrumentalToLifeBlock } from './blocks/InstrumentalToLifeBlock'

// Product Blocks - Product-specific showcases
import { ProductShowcaseBlock } from './blocks/ProductShowcaseBlock'
import { ProductHeroBlock } from './blocks/ProductHeroBlock'
import { ImageGalleryBlock } from './blocks/ImageGalleryBlock'
import { FeaturesListBlock } from './blocks/FeaturesListBlock'
import { SpecificationsBlock } from './blocks/SpecificationsBlock'

/**
 * Block Components Mapping
 *
 * Maps block slugs to their respective React components.
 * Organized by category for maintainability.
 */
const blockComponents = {
  // Legacy blocks (backward compatibility)
  archive: ArchiveBlock,
  content: ContentBlock,
  mediaBlock: MediaBlock,
  cta: CtaBlock,

  // Content blocks (content-*)
  'content-text': TextBlock,
  'content-image': ImageBlock,
  'content-video': VideoBlock,
  'content-code': CodeBlock,
  'content-banner': BannerBlock,

  // Layout blocks (layout-*)
  'layout-columns': ColumnsBlock,
  'layout-spacer': SpacerBlock,
  'layout-divider': DividerBlock,
  'layout-hero-carousel': HeroCarouselBlock,
  'layout-video-background': VideoBackgroundBlock,
  'layout-brand-intro': BrandIntroBlock,

  // Marketing blocks (marketing-*)
  'marketing-hero': HeroBlock,
  'marketing-cta': CallToActionBlock,
  'marketing-testimonials': TestimonialsBlock,
  'marketing-i2l': InstrumentalToLifeBlock,

  // Product blocks (product-*)
  'product-showcase': ProductShowcaseBlock,
  'product-hero': ProductHeroBlock,
  'product-gallery': ImageGalleryBlock,
  'product-features': FeaturesListBlock,
  'product-specs': SpecificationsBlock,
} as const

type BlockComponents = typeof blockComponents
type BlockType = keyof BlockComponents

/**
 * Type guard to check if blockType is a valid block component
 */
function isValidBlockType(blockType: string | undefined): blockType is BlockType {
  return blockType !== undefined && blockType in blockComponents
}

/**
 * RenderBlocks Component
 *
 * Dynamically renders an array of blocks from Payload CMS.
 * Each block is mapped to its corresponding React component based on blockType.
 *
 * Supports all modern block categories:
 * - Content blocks (text, image, video, code, banner)
 * - Layout blocks (columns, spacer, divider)
 * - Marketing blocks (hero, cta, testimonials)
 * - Product blocks (showcase, hero, gallery, features, specs)
 * - Legacy blocks (archive, content, mediaBlock, cta)
 *
 * Server Component - can be used in RSC context
 *
 * @example
 * ```tsx
 * <RenderBlocks blocks={page.layout} />
 * ```
 */
export function RenderBlocks({ blocks }: { blocks: Page['layout'] }) {
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  console.log('🎨 [RenderBlocks] Starting render...')
  console.log('🎨 [RenderBlocks] Blocks received:', hasBlocks ? blocks.length : 0)

  if (!hasBlocks) {
    console.log('🎨 [RenderBlocks] ⚠️ No blocks to render (blocks is empty, null, or not an array)')
    return null
  }

  console.log('🎨 [RenderBlocks] Block types:', blocks.map(b => b.blockType).join(', '))

  return (
    <Fragment>
      {blocks.map((block, index) => {
        const { blockType } = block

        console.log(`🎨 [RenderBlocks] Rendering block ${index}:`, blockType)

        // Validate block type and get component
        if (!isValidBlockType(blockType)) {
          // Log unmapped blocks in development
          if (process.env.NODE_ENV === 'development') {
            console.warn(
              `[RenderBlocks] Unmapped block type: "${blockType}"`,
              '\nAvailable types:',
              Object.keys(blockComponents).join(', ')
            )
          }
          return null
        }

        const Block = blockComponents[blockType]

        if (!Block) {
          if (process.env.NODE_ENV === 'development') {
            console.error(`[RenderBlocks] No component found for block type: "${blockType}"`)
          }
          return null
        }

        console.log(`🎨 [RenderBlocks] ✅ Rendering ${blockType} with component ${Block.name}`)

        return (
          <div
            key={index}
            className={cn(
              'block-container',
              // Remove ALL margin from first block to sit directly under header
              index === 0 && '[&>*]:!m-0 [&>*]:!mt-0 [&>*]:!mb-0'
            )}
          >
            {/* @ts-expect-error - Block types are complex unions; runtime safety ensured by type guard */}
            <Block {...block} />
          </div>
        )
      })}
    </Fragment>
  )
}
