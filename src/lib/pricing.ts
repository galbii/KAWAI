import { formatPrice } from '@/lib/utils'

type PriceField = { msrp?: number | null; currency?: string | null } | null | undefined

export interface SitePrice {
  amount: number | null
  currency: string
  formatted: string | null
}

export function getPriceForSite(
  product: { price?: PriceField; priceCAD?: PriceField },
  site: 'us' | 'cad',
): SitePrice {
  const field = site === 'cad' ? (product.priceCAD ?? product.price) : product.price
  const amount = field?.msrp ?? null
  const currency = site === 'cad' ? 'CAD' : (field?.currency ?? 'USD')
  return {
    amount,
    currency,
    formatted: amount !== null ? formatPrice(amount, currency) : null,
  }
}

export function getPriceRangeForSite(
  variants: Array<{ price?: number | null; compareAtPrice?: number | null }>,
  currency: string,
): { min: number | null; max: number | null; currency: string } {
  const prices = variants.map((v) => v.price).filter((p): p is number => p !== null && p !== undefined)
  if (prices.length === 0) return { min: null, max: null, currency }
  return { min: Math.min(...prices), max: Math.max(...prices), currency }
}
