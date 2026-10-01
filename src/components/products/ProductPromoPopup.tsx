import type { Product } from '@/payload-types'
import { PromoPopup } from '@/components/ui/promo-popup'
import { BundlePromoPopup } from '@/components/ui/bundle-promo-popup'
import {
  promoShowsOnSite,
  resolveBundleItems,
  resolveBundleMedia,
  type PromoSite,
} from '@/lib/promo/bundle'

/**
 * Resolves a product's Promo tab config into the matching popup style: "single"
 * promotes one product/collection/URL, "bundle" showcases several products sold
 * together. Both styles take their CTA target from the tab's link fields.
 *
 * The product must be fetched at depth ≥ 1 so linkedProduct/linkedCollection and
 * the bundle pieces resolve to full docs (getProductBySlugDirect uses depth 2).
 *
 * Renders nothing when the promo is disabled, the link target is missing, or no
 * headline can be derived (custom-URL single promos must set an explicit title).
 */
export function ProductPromoPopup({ product, site = 'us' }: { product: Product; site?: PromoSite }) {
  const promo = product.promo
  if (!promo?.enabled) return null
  if (!promoShowsOnSite(promo.sites, site)) return null

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

  // Promos saved before the style field existed are single-subject promos
  if (promo.style === 'bundle') {
    const isCad = site === 'cad'
    const items = resolveBundleItems(promo.bundleItems, site)
    if (items.length === 0) return null

    const subject = product.modelLabel || product.name || product.model
    return (
      <BundlePromoPopup
        storageKey={`kawai-product-bundle-promo-${product.slug}`}
        href={href}
        headline={promo.title || `${subject} Bundle`}
        eyebrow={promo.eyebrow}
        message={promo.message}
        items={items}
        bundlePrice={isCad ? promo.bundlePriceCAD : promo.bundlePrice}
        priceNote={promo.priceNote}
        currency={isCad ? 'CAD' : 'USD'}
        media={resolveBundleMedia(promo.bundleMedia)}
        ctaLabel={promo.ctaLabel}
        frequency={promo.displayFrequency}
        delaySeconds={promo.delaySeconds}
      />
    )
  }

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
