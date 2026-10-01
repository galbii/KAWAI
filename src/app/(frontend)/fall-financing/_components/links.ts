/**
 * Outbound destinations for the financing section, §5 of the developer
 * requirements.
 *
 * ── Currently unused, deliberately kept ──────────────────────────────────
 *
 * Nothing links here any more: every call to action on the page opens the
 * enquiry form instead, which takes a ZIP and routes to the nearest dealer —
 * see `CTA_LABEL` in campaign.ts for why. The constant stays because the URL
 * is still marked "URL to confirm" in the requirements, and if a direct
 * locator link is ever wanted back this is the line to set, once, rather than
 * a href copied into each scene. (It had drifted to that already: two call
 * sites used this and three hardcoded the same path.)
 *
 * ── Still in force ──────────────────────────────────────────────────────
 *
 * §5 forbids store links from this section — no "Shop Now", no "Buy", no
 * add-to-cart, because acoustic pianos are not sold through the online store.
 * A model's product page is allowed: for an acoustic it renders a dealer CTA
 * and carries no cart control (verified on /products/kawai-gx-7-grand-piano).
 * If that ever changes, the model links in FinancingRangeModal must go.
 */
export const DEALER_LOCATOR = '/find-a-dealer'
