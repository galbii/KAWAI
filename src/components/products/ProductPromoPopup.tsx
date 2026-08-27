import type { Product } from '@/payload-types'
import { PromoPopup } from '@/components/ui/promo-popup'

/**
 * Resolves a product's Promo tab config into the general-purpose PromoPopup.
 * The product must be fetched at depth ≥ 1 so linkedProduct/linkedCollection
 * resolve to full docs (getProductBySlugDirect uses depth 2).
 *
 * Renders nothing when the promo is disabled, the link target is missing, or
 * no headline can be derived (custom-URL promos must set an explicit title).
 */
export function ProductPromoPopup({ product }: { product: Product }) {
  const promo = product.promo
  if (!promo?.enabled) return null

  const linkType = promo.linkType ?? 'product'
  let href: string | null = null
  let targetTitle: string | null = null
  let targetImageUrl: string | null = null

  if (linkType === 'product') {
    const target =
      promo.linkedProduct && typeof promo.linkedProduct === 'object' ? promo.linkedProduct : null
    if (target?.slug) {
      href = `/products/${target.slug}`
      targetTitle = target.name ?? null
      targetImageUrl = target.imageUrl ?? null
    }
  } else if (linkType === 'collection') {
    const target =
      promo.linkedCollection && typeof promo.linkedCollection === 'object'
        ? promo.linkedCollection
        : null
    if (target?.handle) {
      href = `/pianos/${target.handle}`
      targetTitle = target.title ?? null
      targetImageUrl = target.imageUrl ?? null
    }
  } else if (linkType === 'custom' && promo.customUrl) {
    href = promo.customUrl
  }

  if (!href) return null

  const headline = promo.title || (targetTitle ? `Meet the ${targetTitle}` : null)
  if (!headline) return null

  const imageUrl =
    promo.image && typeof promo.image === 'object' && promo.image.url
      ? promo.image.url
      : targetImageUrl

  return (
    <PromoPopup
      storageKey={`kawai-product-promo-${product.slug}`}
      href={href}
      headline={headline}
      imageUrl={imageUrl}
      imageAlt={targetTitle ?? headline}
      eyebrow={promo.eyebrow}
      message={promo.message}
      ctaLabel={promo.ctaLabel}
      marque={product.name && targetTitle ? { from: product.name, to: targetTitle } : null}
      frequency={promo.displayFrequency}
      delaySeconds={promo.delaySeconds}
    />
  )
}
