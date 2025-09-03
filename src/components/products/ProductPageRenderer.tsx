import { Product } from '@/payload-types'
import { BlocksList } from '@/lib/blocks/BlockRenderer'
import { BlockDebugger } from '@/components/debug/BlockDebugger'
import { HeroBlock } from '@/components/blocks/HeroBlock'
import { ProductShowcaseBlock } from '@/components/blocks/ProductShowcaseBlock'
import { FeaturesListBlock } from '@/components/blocks/FeaturesListBlock'
import { SpecificationsBlock } from '@/components/blocks/SpecificationsBlock'
import { CallToActionBlock } from '@/components/blocks/CallToActionBlock'

interface ProductPageRendererProps {
  product: Product
}

/**
 * ProductPageRenderer
 * 
 * Renders Product pages with dynamic block content that integrates Agent 1's
 * pianoModel relationship system. Supports 3 data source modes:
 * - manual: Use only block data
 * - pianomodel: Use only PianoModel data
 * - hybrid: Use PianoModel as base, override with block data
 */
export function ProductPageRenderer({ product }: ProductPageRendererProps) {
  // If no page content, render a basic product layout
  if (!product.pageContent || product.pageContent.length === 0) {
    return <BasicProductLayout product={product} />
  }

  return (
    <div className="min-h-screen">
      <BlocksList blocks={product.pageContent} product={product} />
      <BlockDebugger product={product} />
    </div>
  )
}

// Block rendering is now handled by BlockRenderer utility

/**
 * Basic Product Layout - Fallback when no pageContent is defined
 * Creates a sensible default layout using Product and PianoModel data
 */
function BasicProductLayout({ product }: { product: Product }) {
  const pianoModel = typeof product.pianoModel === 'object' ? product.pianoModel : null

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroBlock
        dataSource="pianomodel"
        pianoModel={pianoModel}
        content={{
          primaryCta: {
            text: product.buyButton?.text || "Learn More",
            link: product.buyButton?.link || "#specifications",
            style: product.buyButton?.style || "primary"
          }
        }}
        media={{
          type: "image",
          overlay: {
            enable: true,
            color: "dark",
            opacity: 0.4
          }
        }}
        layout={{
          height: "large",
          contentAlignment: "left",
          verticalAlignment: "center",
          maxWidth: "large"
        }}
      />

      {/* Product Showcase */}
      <ProductShowcaseBlock
        dataSource="pianomodel"
        pianoModel={pianoModel}
        product={{
          buyButton: product.buyButton
        }}
        layout={{
          imagePosition: "left",
          showFinishes: true,
          showPrice: true,
          compact: false
        }}
      />

      {/* Features List */}
      {pianoModel?.keyFeatures && pianoModel.keyFeatures.length > 0 && (
        <FeaturesListBlock
          dataSource="pianomodel"
          pianoModel={pianoModel}
          layout={{
            columns: 2,
            showIcons: true,
            compact: false
          }}
        />
      )}

      {/* Image Gallery - Now handled by Product pageContent blocks */}

      {/* Specifications */}
      {pianoModel?.specifications && (
        <SpecificationsBlock
          dataSource="pianomodel"
          pianoModel={pianoModel}
          layout={{
            columns: 2,
            showCategories: true,
            compact: false
          }}
        />
      )}

      {/* Call to Action */}
      <CallToActionBlock
        content={{
          title: `Experience the ${product.name}`,
          description: "Visit our showroom to hear and feel this exceptional instrument in person.",
          primaryCta: {
            text: "Schedule Visit",
            link: "/showroom",
            style: "primary"
          },
          secondaryCta: {
            text: "Contact Us",
            link: "/contact",
            style: "outline"
          }
        }}
        layout={{
          alignment: "center",
          backgroundType: "color",
          backgroundColor: "brand"
        }}
      />
    </div>
  )
}