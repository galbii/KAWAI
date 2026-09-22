/**
 * Kill switch for the French UI locale.
 *
 * The routing, switcher, and hreflang wiring all land before the translation
 * layer does. Until French pages actually render in French, advertising
 * /fr URLs to crawlers would publish duplicate English content under a second
 * set of URLs — so everything user-visible stays behind this flag.
 *
 * Set NEXT_PUBLIC_FRENCH_ENABLED=true to turn it on.
 */
export const FRENCH_ENABLED = process.env.NEXT_PUBLIC_FRENCH_ENABLED === 'true'
