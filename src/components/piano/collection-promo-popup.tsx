'use client'

import { SuccessorPromoPopup } from '@/components/piano/successor-promo-popup'
import { BundlePromoPopup } from '@/components/ui/bundle-promo-popup'
import { PromoPopup } from '@/components/ui/promo-popup'
import {
  asDoc,
  promoShowsOnSite,
  resolveBundleItems,
  resolveBundleMedia,
  uploadUrl,
  type PromoProduct,
  type PromoSite,
} from '@/lib/promo/bundle'

export interface CollectionPromoPopupProps {
  /** Collection doc fetched at depth ≥ 1 so promo relationships resolve to docs */
  collection: any
  site?: PromoSite
}

/** Resolves the single and bundle styles' CTA target into a path */
function ctaHref(promo: any): string | null {
  const ctaType = promo.ctaType ?? 'product'
  if (ctaType === 'product') {
    const target = asDoc<PromoProduct>(promo.ctaProduct)
    return target?.slug ? `/products/${target.slug}` : null
  }
  if (ctaType === 'collection') {
    const target = asDoc<{ handle?: string | null }>(promo.ctaCollection)
    return target?.handle ? `/pianos/${target.handle}` : null
  }
  return promo.ctaUrl || null
}

/**
 * Resolves a collection's Promo Popup tab into the matching popup style:
 * "single" promotes one thing wherever you point it, "successor" adds a lineage
 * marque and links to a replacement collection, "bundle" showcases several
 * products sold together. Renders nothing when the promo is disabled or its
 * style is missing the data it needs.
 */
export function CollectionPromoPopup({ collection, site = 'us' }: CollectionPromoPopupProps) {
  const promo = collection?.successorPromo
  if (!promo?.enabled) return null
  if (!promoShowsOnSite(promo.sites, site)) return null

  // Promos saved before the style field existed are successor promos
  const style: 'single' | 'successor' | 'bundle' =
    promo.style === 'bundle' ? 'bundle' : promo.style === 'single' ? 'single' : 'successor'

  if (style === 'single') {
    const href = ctaHref(promo)
    // A single-style promo carries no target doc to borrow a headline from
    if (!href || !promo.title) return null

    return (
      <PromoPopup
        storageKey={`kawai-collection-promo-${collection.handle}`}
        href={href}
        headline={promo.title}
        imageUrl={uploadUrl(promo.image)}
        eyebrow={promo.eyebrow}
        message={promo.message}
        ctaLabel={promo.ctaLabel}
        frequency={promo.displayFrequency}
        delaySeconds={promo.delaySeconds}
      />
    )
  }

  if (style === 'bundle') {
    const isCad = site === 'cad'
    const items = resolveBundleItems(promo.bundleItems, site)
    if (items.length === 0) return null

    const href = ctaHref(promo)
    if (!href) return null

    return (
      <BundlePromoPopup
        storageKey={`kawai-bundle-promo-${collection.handle}`}
        href={href}
        headline={promo.title || `${collection.title} Bundle`}
        eyebrow={promo.eyebrow || 'Bundle Offer'}
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

  // Successor style — populated at depth 1, so the relationship is a full doc
  const successor = asDoc<{ handle?: string | null; title?: string | null; imageUrl?: string | null }>(
    promo.successorCollection,
  )
  if (!successor?.handle || !successor.title) return null

  return (
    <SuccessorPromoPopup
      currentHandle={collection.handle}
      currentTitle={collection.title}
      successorHandle={successor.handle}
      successorTitle={successor.title}
      imageUrl={uploadUrl(promo.image) ?? successor.imageUrl ?? null}
      eyebrow={promo.eyebrow}
      title={promo.title}
      message={promo.message}
      ctaLabel={promo.ctaLabel}
      frequency={promo.displayFrequency}
      delaySeconds={promo.delaySeconds}
    />
  )
}
