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
 * Renders Product pages with dynamic block content using the consolidated
 * Product collection structure. Supports different product types:
 * - piano: Full feature set with specifications and finishes
 * - accessory/software/other: Adapted layouts with appropriate CTAs
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
 * Creates a sensible default layout that adapts to different product types
 */
function BasicProductLayout({ product }: { product: Product }) {
  const isPiano = product.type === 'piano'

  return (
    <div className="min-h-screen">
      {/* Hero Section - Adapted for product type */}
      <HeroBlock
        dataSource="manual"
        content={{
          title: product.name,
          description: product.description,
          primaryCta: {
            text: product.buyButton?.text || "Learn More",
            link: product.buyButton?.link || "#specifications",
            style: product.buyButton?.style || "primary"
          }
        }}
        media={{
          type: "image",
          backgroundImage: product.mainImage ?? null,
          overlay: {
            enable: false,
            color: "dark",
            opacity: 0
          }
        }}
        layout={{
          height: "large",
          contentAlignment: "left",
          verticalAlignment: "center",
          maxWidth: "large"
        }}
      />

      {/* Product Showcase - Adapted for product type */}
      <ProductShowcaseBlock
        dataSource="manual"
        product={{
          name: product.name,
          description: product.description,
          image: product.mainImage ?? null,
          ...(product.price && {
            price: {
              ...(product.price.currency !== undefined && { currency: product.price.currency }),
              ...(product.price.msrp !== undefined && { amount: product.price.msrp }),
              ...(product.price.salePrice !== undefined && { saleAmount: product.price.salePrice }),
              ...(product.price.priceText !== undefined && { priceText: product.price.priceText })
            }
          }),
          ...(isPiano && product.finishes !== undefined && { finishes: product.finishes }),
          buyButton: product.buyButton
        }}
        layout={{
          imagePosition: "left",
          showFinishes: isPiano,
          showPrice: true,
          compact: false
        }}
      />

      {/* Features List - Only show for pianos with features */}
      {isPiano && product.keyFeatures && product.keyFeatures.length > 0 && (
        <FeaturesListBlock
          dataSource="manual"
          layout={{
            columns: 2,
            showIcons: true,
            compact: false
          }}
        />
      )}

      {/* Specifications - Only show for pianos with specifications */}
      {isPiano && product.specifications && (
        <SpecificationsBlock
          dataSource="manual"
          layout={{
            columns: 2,
            showCategories: true,
            compact: false
          }}
        />
      )}

      {/* Call to Action - Adapted for product type */}
      <CallToActionBlock
        content={{
          title: isPiano ? `Experience the ${product.name}` : `Get Your ${product.name}`,
          description: isPiano 
            ? "Visit our showroom to hear and feel this exceptional instrument in person."
            : "Contact us to learn more about this product and how it can enhance your musical journey.",
          primaryCta: {
            text: isPiano ? "Schedule Visit" : "Get More Info",
            link: isPiano ? "/showroom" : "/contact",
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