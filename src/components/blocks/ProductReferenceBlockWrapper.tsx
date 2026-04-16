import { cache } from 'react'
import type { Product } from '@/payload-types'
import { getSite } from '@/lib/site-context'
import { getProductByModel } from '@/lib/shopify'
import { ProductReferenceBlock } from './ProductReferenceBlock'

// React cache deduplicates Shopify calls across multiple ProductReference blocks on the same render
const getShopifyProduct = cache(getProductByModel)

interface ProductReferenceBlockWrapperProps {
  product: Product | string | null
  display?: {
    showPrice?: boolean | null
    showBuyNow?: boolean | null
    showAddToCart?: boolean | null
    showDescription?: boolean | null
    showVariantSelector?: boolean | null
  } | null
  layout?: {
    orientation?: ('horizontal' | 'vertical') | null
    imageSize?: ('small' | 'medium' | 'large') | null
    backgroundColor?: ('white' | 'pearl' | 'black') | null
  } | null
  [key: string]: unknown
}

export async function ProductReferenceBlockWrapper({
  product: productProp,
  display,
  layout,
}: ProductReferenceBlockWrapperProps) {
  // Relationship field may arrive as a full object (depth >= 1) or bare string ID
  const product = typeof productProp === 'object' && productProp !== null ? productProp : null

  if (!product) return null

  const [site, shopifyProduct] = await Promise.all([
    getSite(),
    product.model ? getShopifyProduct(product.model) : Promise.resolve(null),
  ])

  return (
    <ProductReferenceBlock
      product={product}
      shopifyProduct={shopifyProduct}
      isCanada={site === 'cad'}
      display={display ?? null}
      layout={layout ?? null}
    />
  )
}
