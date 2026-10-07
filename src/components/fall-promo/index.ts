/**
 * Fall Promo 2026 — the shared campaign system.
 *
 * Two looks, one foundation. `PromoStyles` carries the palette and the type;
 * `.promo-a` (Seasonal Offers, /fall-financing) and `.promo-b` (Stack the
 * Savings, /fall-financing2) re-point the same semantic tokens, so everything
 * exported here renders correctly in either without a variation prop.
 *
 * The two signature elements do NOT cross over — `SeasonMark` belongs to A and
 * `OfferStack` to B, and the guidelines forbid mixing the looks on one page.
 */
export { PromoStyles, PROMO_CONTAINER, PROMO_CONTAINER_WIDE } from './PromoStyles'
export { SeasonMark } from './SeasonMark'
export {
  PromoHeroCarousel,
  type PromoSlide,
  type PromoValueProp,
  type PromoHeroOffer,
} from './PromoHeroCarousel'
export { PromoStage } from './PromoStage'
export { PromoReveal, StageParallax } from './PromoReveal'
export { PromoSideNav, type PromoNavSection } from './PromoSideNav'
export { PromoOfferDock } from './PromoOfferDock'
export { OfferStack, OfferStackAlt } from './OfferStack'
export { OfferChip, OfferChipRow } from './OfferChip'
export {
  PromoCta,
  PromoCtaLink,
  PromoCtaSecondary,
  PromoCtaSecondaryButton,
} from './PromoCta'
