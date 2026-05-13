import { UniversityPianoShowcaseRenderer } from './university/UniversityPianoShowcaseRenderer'

/**
 * University Piano Showcase Block Wrapper
 *
 * Renders featured piano models in an alternating left/right layout with
 * pricing, key features, and per-piano CTAs. Designed for university event
 * landing pages to showcase available instruments with university pricing.
 */
export function UniversityPianoShowcaseBlock(props: any) {
  return <UniversityPianoShowcaseRenderer block={props} />
}
