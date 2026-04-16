'use server'

import { getProductByModel, isProductOnSale } from '@/lib/shopify/products'

export type PianoPriceData = {
  min: number
  max: number
  currency: string
  display: string
  compareAtMin: number | null
  compareAtMax: number | null
  onSale: boolean
}

export async function fetchPianoShopifyPrice(model: string): Promise<PianoPriceData | null> {
  try {
    const product = await getProductByModel(model)
    if (!product) return null

    const onSale = isProductOnSale(product)
    const compareAtPrices = product.variants
      .map((v) => v.compareAtPrice)
      .filter((p): p is number => p !== null)

    return {
      min: product.price.min,
      max: product.price.max,
      currency: product.price.currency,
      display: product.price.display,
      compareAtMin: compareAtPrices.length > 0 ? Math.min(...compareAtPrices) : null,
      compareAtMax: compareAtPrices.length > 0 ? Math.max(...compareAtPrices) : null,
      onSale,
    }
  } catch {
    return null
  }
}
