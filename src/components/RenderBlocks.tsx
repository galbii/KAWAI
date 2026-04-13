/**
 * RenderBlocks - Universal Block Renderer
 *
 * Dynamically renders Payload CMS blocks from the `layout` field.
 * Supports 33 block types across 6 categories.
 *
 * Block Categories:
 * - Legacy (4): archive, content, mediaBlock, cta
 * - Content (5): content-text, content-image, content-video, content-code, content-banner
 * - Layout (10): layout-columns, layout-spacer, layout-divider, layout-hero-carousel, layout-video-background, layout-brand-intro, layout-bottom-left-popup, layout-side-navigation, layout-calendly-embed, layout-booking-modal
 * - Marketing (12): marketing-hero, marketing-grand-hero, marketing-cta, marketing-testimonials, marketing-i2l, marketing-technical-showcase, marketing-find-a-dealer, marketing-dealer-finder, marketing-3d-viewer, marketing-instagram-carousel, marketing-artist-carousel, marketing-featured-models
 * - Events (2): events-university-hero, events-event-overview
 * - Product (6): product-showcase, product-hero, product-gallery, product-features, product-specs, product-collection-showcase
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
import { PageLayoutProvider } from '@/lib/contexts/PageLayoutContext'

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
import { RichTextContentBlock } from './blocks/RichTextContentBlock'
import { ContentCtaBlock } from './blocks/ContentCtaBlock'

// Layout Blocks - Structural components
import { ColumnsBlock } from './blocks/ColumnsBlock'
import { SpacerBlock } from './blocks/SpacerBlock'
import { DividerBlock } from './blocks/DividerBlock'
import { HeroCarouselBlock } from './blocks/HeroCarouselBlock'
import { VideoBackgroundBlock } from './blocks/VideoBackgroundBlock'
import { BrandIntroBlock } from './blocks/BrandIntroBlock'
import { BottomLeftPopupBlock } from './blocks/BottomLeftPopupBlock'
import { SideNavigationBlock } from './blocks/SideNavigationBlock'
import { CalendlyEmbedBlock } from './blocks/CalendlyEmbedBlock'
import { BookingModalBlock } from './blocks/BookingModalBlock'

// Marketing Blocks - Conversion-focused
import { HeroBlock } from './blocks/HeroBlock'
import { GrandHeroBlock } from './blocks/GrandHeroBlock'
import { UniversityHeroBlock } from './blocks/UniversityHeroBlock'
import { EventOverviewBlock } from './blocks/EventOverviewBlock'
import { CallToActionBlock } from './blocks/CallToActionBlock'
import { TestimonialsBlock } from './blocks/TestimonialsBlock'
import { InstrumentalToLifeBlock } from './blocks/InstrumentalToLifeBlock'
import { TechnicalShowcaseBlock } from './blocks/TechnicalShowcaseBlock'
import { FindADealerBlock } from './blocks/FindADealerBlock'
import { DealerFinderMapBlock } from './blocks/DealerFinderMapBlock'
import { ThreeDViewerBlock } from './blocks/ThreeDViewerBlock'
import { InstagramCarouselBlock } from './blocks/InstagramCarouselBlock'
import { ArtistCarouselBlock } from './blocks/ArtistCarouselBlock'
import { HomePageHeroBlock } from './blocks/HomePageHeroBlock'
import { ShowroomBlock } from './blocks/ShowroomBlock'
import { PianoCollectionBlock } from './blocks/PianoCollectionBlock'
import { PianoGalleryBlock } from './blocks/PianoGalleryBlock'
import { NewsCarouselBlock } from './blocks/NewsCarouselBlock'
import { ContactFormBlock } from './blocks/ContactFormBlock'
import { StorefrontLocationsBlock } from './blocks/StorefrontLocationsBlock'
import { FeaturedModelsBlock } from './blocks/FeaturedModelsBlock'
import { FeaturedCollectionsBlock } from './blocks/FeaturedCollectionsBlock'
import { RebateTableBlock } from './blocks/RebateTableBlock'
import { ArtistHeroBlock } from './blocks/ArtistHeroBlock'
import { PianosBrowserBlock } from './blocks/PianosBrowserBlock'
import { ArtistsGridBlock } from './blocks/ArtistsGridBlock'
import { BlogGridBlock } from './blocks/BlogGridBlock'
import { BlogLatestBlock } from './blocks/BlogLatestBlock'
import { NewsletterPopupBlock } from './blocks/NewsletterPopupBlock'

// Product Blocks - Product-specific showcases
import PianoPagesBlock from './blocks/PianoPagesBlock'
import { ProductShowcaseBlock } from './blocks/ProductShowcaseBlock'
import { ProductHeroBlockWrapper as ProductHeroBlock } from './blocks/ProductHeroBlockWrapper'
import { ImageGalleryBlock } from './blocks/ImageGalleryBlock'
import { FeaturesListBlock } from './blocks/FeaturesListBlock'
import { SpecificationsBlock } from './blocks/SpecificationsBlock'
import { CollectionShowcaseBlock } from './blocks/CollectionShowcaseBlock'
import { FloatingAddToCartBlock } from './blocks/FloatingAddToCartBlock'
import { ProductHeroCarouselBlock } from './blocks/ProductHeroCarouselBlock'

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
  'content-rich-text': RichTextContentBlock,
  'content-text': TextBlock,
  'content-image': ImageBlock,
  'content-video': VideoBlock,
  'content-code': CodeBlock,
  'content-banner': BannerBlock,
  'content-cta': ContentCtaBlock,

  // Layout blocks (layout-*)
  'layout-columns': ColumnsBlock,
  'layout-spacer': SpacerBlock,
  'layout-divider': DividerBlock,
  'layout-hero-carousel': HeroCarouselBlock,
  'layout-video-background': VideoBackgroundBlock,
  'layout-brand-intro': BrandIntroBlock,
  'layout-bottom-left-popup': BottomLeftPopupBlock,
  'layout-side-navigation': SideNavigationBlock,
  'layout-calendly-embed': CalendlyEmbedBlock,
  'layout-booking-modal': BookingModalBlock,

  // Marketing blocks (marketing-*)
  'marketing-hero': HeroBlock,
  'marketing-grand-hero': GrandHeroBlock,
  'marketing-cta': CallToActionBlock,
  'marketing-testimonials': TestimonialsBlock,
  'marketing-i2l': InstrumentalToLifeBlock,
  'marketing-technical-showcase': TechnicalShowcaseBlock,
  'marketing-find-a-dealer': FindADealerBlock,
  'marketing-dealer-finder': DealerFinderMapBlock,
  'marketing-3d-viewer': ThreeDViewerBlock,
  'marketing-instagram-carousel': InstagramCarouselBlock,
  'marketing-artist-carousel': ArtistCarouselBlock,
  'marketing-homepage-hero': HomePageHeroBlock,
  'marketing-showroom': ShowroomBlock,
  'marketing-piano-collection': PianoCollectionBlock,
  'marketing-piano-gallery': PianoGalleryBlock,
  'marketing-news-carousel': NewsCarouselBlock,
  'marketing-contact-form': ContactFormBlock,
  'marketing-storefront-locations': StorefrontLocationsBlock,
  'marketing-featured-models': FeaturedModelsBlock,
  'marketing-featured-collections': FeaturedCollectionsBlock,
  'marketing-rebate-table': RebateTableBlock,
  'marketing-artist-hero': ArtistHeroBlock,
  'marketing-pianos-browser': PianosBrowserBlock,
  'marketing-artists-grid': ArtistsGridBlock,
  'marketing-blog-grid': BlogGridBlock,
  'marketing-blog-latest': BlogLatestBlock,
  'marketing-newsletter-popup': NewsletterPopupBlock,

  // Events blocks (events-*)
  'events-university-hero': UniversityHeroBlock,
  'events-event-overview': EventOverviewBlock,

  // Product blocks (product-*)
  'product-piano-pages': PianoPagesBlock,
  'product-showcase': ProductShowcaseBlock,
  'product-hero': ProductHeroBlock,
  'product-gallery': ImageGalleryBlock,
  'product-features': FeaturesListBlock,
  'product-specs': SpecificationsBlock,
  'product-collection-showcase': CollectionShowcaseBlock,
  'product-floating-add-to-cart': FloatingAddToCartBlock,
  'product-hero-carousel': ProductHeroCarouselBlock,
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

  if (!hasBlocks) {
    return null
  }

  return (
    <PageLayoutProvider blocks={blocks}>
      <Fragment>
        {blocks.map((block, index) => {
        const { blockType } = block

        if (!isValidBlockType(blockType)) {
          return null
        }

        const Block = blockComponents[blockType]

        if (!Block) {
          return null
        }

        return (
          <div
            key={index}
            id={`block-${block.id}`}
            className={cn(
              'block-container',
              // Remove ALL margin from first block to sit directly under header
              index === 0 && '[&>*]:!m-0 [&>*]:!mt-0 [&>*]:!mb-0'
            )}
          >
            {/* @ts-expect-error - Block types are complex unions; runtime safety ensured by type guard */}
            <Block
              {...block}
              {...((blockType as string) === 'product-collection-showcase' ? { showViewCollectionLink: true } : {})}
              {...((blockType as string) === 'product-hero-carousel' ? { headingLevel: index === 0 ? 'h1' : 'h2' } : {})}
              {...((blockType as string) === 'layout-hero-carousel' ? { headingLevel: index === 0 ? 'h1' : 'h2' } : {})}
              {...((blockType as string) === 'product-hero' ? { headingLevel: index === 0 ? 'h1' : 'h2' } : {})}
            />
          </div>
        )
      })}
    </Fragment>
    </PageLayoutProvider>
  )
}
