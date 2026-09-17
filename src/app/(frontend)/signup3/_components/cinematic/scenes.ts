import { offerCopy as campaignOfferCopy } from '../campaign'

/**
 * The /signup2 cinematic's own copy and scene choreography, carried over as-is.
 *
 * It lives here rather than in `campaign.ts` on purpose: `campaign.ts` states
 * the Back to School page's copy in the print register (`showroomsCopy.subhead`,
 * flat `stats` strings), while the cinematic needs the shapes its scenes were
 * authored against — a body paragraph, a `dealerStat`, numeric stat targets for
 * the count-up. Two registers, two files; neither has to bend to the other.
 *
 * SCENE_WINDOWS is the original /signup2 coordinate space. CinematicOutro
 * remaps its own scroll into that range, so none of the numbers below needed
 * re-tuning.
 */

/**
 * Trust strip — the three most credible, purchase-relevant numbers. The full
 * five-stat heritage scene (awards, competition victories, generations) was cut
 * for the conversion-first variant; what remains reassures a buyer right before
 * the closing CTA without sending them off to read history.
 */
export const stats = [
  { numeric: 1927, suffix: '', label: 'Crafting Pianos Since', plain: true },
  { numeric: 2.4, decimals: 1, suffix: 'M+', label: 'Pianos Built' },
  { numeric: 200, suffix: '+', label: 'Authorized Dealers Nationwide' },
] as const

export const codaCopy = {
  eyebrow: 'Last Step',
  headline: 'Claim your rebate today',
  body: 'Sign up and your local Authorized Kawai dealer will reach out about current rebates and savings on your next piano.',
} as const

export const showroomsCopy = {
  eyebrow: 'Where to Play',
  headline: 'Experience Kawai in Person',
  body: 'Play our pianos in person and get expert guidance from an authorized Kawai dealer near you.',
  dealerStat: { numeric: 200, suffix: '+', label: 'Authorized Dealers Nationwide' },
} as const

/**
 * CTA labels per placement. Every one of them opens the same offer popup, so
 * they take the page's single sign-up label from `campaign.ts` rather than
 * restating it — one place to change the wording, as on /signup2.
 */
export const offerCopy = {
  cta: {
    hero: campaignOfferCopy.signUp,
    stats: campaignOfferCopy.signUp,
    showrooms: campaignOfferCopy.signUp,
    coda: campaignOfferCopy.signUp,
  },
} as const

/**
 * Five scene windows on master scroll progress (0 → 1) for the conversion-first
 * /signup2 variant. Each scene gets ~20% of scroll plus a ~1.5% crossfade
 * overlap. Order: hero → rebates → showrooms → stats (trust strip) → coda.
 *
 * Only the last three play here — the hero and rebate windows stay in the table
 * because PinnedCanvas's camera path is authored across the whole range.
 */
export const SCENE_WINDOWS = {
  hero: [0.0, 0.2] as const,
  rebates: [0.185, 0.42] as const,
  showrooms: [0.405, 0.61] as const,
  stats: [0.595, 0.79] as const,
  coda: [0.775, 1.0] as const,
}
