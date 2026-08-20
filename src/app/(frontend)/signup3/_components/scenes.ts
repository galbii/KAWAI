export const heroCopy = {
  eyebrow: 'Kawai America Corporation',
  sinceLabel: 'Since 1927',
  headline: ['Crafting', 'Inspiration'],
  sub: 'Visit an Authorized Dealer or Official Kawai location for best prices and other rebate offers.',
  primaryCta: { label: 'Our Story', href: '#story' },
  secondaryCta: { label: 'Explore Pianos', href: '/pianos' },
}

/** Static hero block — Kawai logo + Summer Savings Event + dealer proof. */
export const summerHero = {
  eyebrow: 'Summer Savings Event',
  headline: 'Up to $4,500 off select pianos at your Local Dealer',
  /** Canada (ca.kawaius.com) variant. */
  headlineCA: 'Up to $2,600 off select pianos at your Local Dealer',
  sub: '200+ Authorized Dealers Nationwide',
  deadline: 'Only until September 30th',
  signUpCta: 'Sign Up Now',
  viewRebatesCta: 'View Rebates',
} as const

/**
 * Trust strip — the three most credible, purchase-relevant numbers. The full
 * five-stat heritage scene (awards, competition victories, generations) was cut
 * for the conversion-first variant; what remains reassures a buyer right before
 * the closing CTA without sending them off to read history.
 */
export const stats = [
  { value: '1927', numeric: 1927, suffix: '', label: 'Crafting Pianos Since', plain: true },
  { value: '2.4M+', numeric: 2.4, decimals: 1, suffix: 'M+', label: 'Pianos Built' },
  { value: '200+', numeric: 200, suffix: '+', label: 'Authorized Dealers Nationwide' },
] as const

export const codaCopy = {
  eyebrow: 'Last Step',
  headline: 'Claim your rebate today',
  body: 'Sign up and your local Authorized Kawai dealer will reach out about current rebates and savings on your next piano.',
  primaryCta: { label: 'Explore Pianos', href: '/pianos' },
  secondaryCta: { label: 'Find a Dealer', href: '/find-a-dealer' },
}

export const showroomsCopy = {
  eyebrow: 'Where to Play',
  headline: 'Experience Kawai in Person',
  body: 'Play our pianos in person and get expert guidance from an authorized Kawai dealer near you.',
  dealerStat: { numeric: 200, suffix: '+', label: 'Authorized Dealers Nationwide' },
  secondaryCta: { label: 'Find a Dealer', href: '/find-a-dealer' },
} as const

/**
 * HubSpot form the native two-step sign-up submits to (via the public Forms API,
 * not an iframe) so the submission fires in our page context and GTM can read it.
 *
 * portalId + region come from Kawai's HubSpot account (same as warranty). Only
 * `formGuid` is form-specific — it's the `data-form-id` UUID in the form's
 * HubSpot embed code (Marketing → Forms → your form → Share/Embed).
 *
 * TODO: paste the sign-up form's GUID below. Until then submission will error.
 */
export const hubspotSignupForm = {
  portalId: '21987263',
  formGuid: '6a40df6b-d339-413c-8f62-d6e8324f3959',
  region: 'na1',
} as const

/**
 * Dealer discount offer. Copy shared by the three offer CTAs (Hero, Showrooms,
 * Coda) and the OfferModal they open. Prototype only — the form is not yet
 * wired to a backend; see OfferModal for the stubbed submit flow.
 */
export const offerCopy = {
  eyebrow: 'Exclusive Offer',
  headline: 'Sign up for instant rebates at your local Authorized dealer',
  body: "We'll reach out soon to tell you about availability and potential savings.",
  /** Unified label for every call to action on the page — all open the signup popup. */
  signUp: 'Sign Up Now',
  /** CTA button labels per placement. */
  cta: {
    hero: 'Sign Up Now',
    stats: 'Sign Up Now',
    showrooms: 'Sign Up Now',
    coda: 'Sign Up Now',
  },
  submitLabel: 'Sign Up Now',
  zipHelp: "We'll match you to your nearest Authorized Kawai dealer.",
  success: {
    headline: "You're in.",
    body: "Thanks — your local Authorized Kawai dealer will reach out soon about availability and potential savings.",
  },
} as const

/**
 * Rebate showcase scene (Scene 2, directly under the hero). Lets a visitor pick
 * a piano category, then a model, and see the dealer rebate taken off the price.
 * Primary CTA is Find a Dealer. Products + rebates come from the Products
 * collection via getRebateShowcase().
 */
export const rebatesCopy = {
  eyebrow: 'Current Rebates',
  headline: 'See your savings, by model',
  sub: 'Choose a category, then a model, to preview the instant rebate. Your local Authorized Kawai dealer confirms the final price.',
  msrpLabel: 'MSRP',
  yourPriceLabel: 'Your price',
  saveLabel: 'Save',
  primaryCta: { label: 'Sign Up Now', href: '/find-a-dealer' },
  viewLabelPrefix: 'View the',
  disclaimer: 'Estimated savings off MSRP. Final pricing and availability confirmed by your local Authorized Kawai dealer.',
  empty: {
    headline: 'Rebates are on the way',
    body: 'Ask your local Authorized Kawai dealer about current rebates and exclusive offers on your next piano.',
  },
} as const

/**
 * Five scene windows on master scroll progress (0 → 1) for the conversion-first
 * /signup3 variant. Each scene gets ~20% of scroll plus a ~1.5% crossfade
 * overlap. Order: hero → rebates → showrooms → stats (trust strip) → coda.
 * (Track height is 500vh in SignupScroll so each scene keeps ~100vh of scroll.)
 */
export const SCENE_WINDOWS = {
  hero: [0.0, 0.2] as const,
  rebates: [0.185, 0.42] as const,
  showrooms: [0.405, 0.61] as const,
  stats: [0.595, 0.79] as const,
  coda: [0.775, 1.0] as const,
}
