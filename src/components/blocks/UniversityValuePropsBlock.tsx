import { UniversityValuePropsRenderer } from './university/UniversityValuePropsRenderer'

/**
 * University Value Props Block Wrapper
 *
 * Renders a 3-column benefit grid with a full-bleed background image and dark
 * overlay. Designed for university partnership landing pages to communicate key
 * value propositions (pricing, selection, protection).
 */
export function UniversityValuePropsBlock(props: any) {
  return <UniversityValuePropsRenderer block={props} />
}
