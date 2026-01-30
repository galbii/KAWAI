/**
 * Block Components Barrel Export
 *
 * Organized by category for maintainability.
 * All blocks integrate with the RenderBlocks component.
 */

// Legacy Blocks (backward compatibility)
export { ArchiveBlock } from './ArchiveBlock'
export { ContentBlock } from './ContentBlock'
export { MediaBlock } from './MediaBlock'
export { CtaBlock } from './CtaBlock'

// Content Blocks - Editorial content (text, media, code)
export { TextBlock } from './TextBlock'
export { ImageBlock } from './ImageBlock'
export { VideoBlock } from './VideoBlock'
export { CodeBlock } from './CodeBlock'
export { BannerBlock } from './BannerBlock'

// Layout Blocks - Structural components
export { ColumnsBlock } from './ColumnsBlock'
export { SpacerBlock } from './SpacerBlock'
export { DividerBlock } from './DividerBlock'
export { VideoBackgroundBlock } from './VideoBackgroundBlock'
export { BrandIntroBlock } from './BrandIntroBlock'

// Marketing Blocks - Conversion-focused
export { HeroBlock } from './HeroBlock'
export { CallToActionBlock } from './CallToActionBlock'
export { TestimonialsBlock } from './TestimonialsBlock'
export { InstrumentalToLifeBlock } from './InstrumentalToLifeBlock'
export { TechnicalShowcaseBlock } from './TechnicalShowcaseBlock'

// Product Blocks - Product-specific showcases
export { ProductShowcaseBlock } from './ProductShowcaseBlock'
export { ProductHeroBlock } from './ProductHeroBlock'
export { ImageGalleryBlock } from './ImageGalleryBlock'
export { FeaturesListBlock } from './FeaturesListBlock'
export { SpecificationsBlock } from './SpecificationsBlock'

// Special Purpose Blocks
export { HelloBlock } from './HelloBlock'
export { TextContentBlock } from './TextContentBlock'

// Re-export main ProductPageRenderer
export { ProductPageRenderer } from '../products/ProductPageRenderer'
