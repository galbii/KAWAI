/**
 * Page surfaces a campaign can choose for the section below the hero.
 *
 * `tone` is not cosmetic — it is what tells SignupBlocks whether a block that
 * paints no background of its own needs a white card to stay readable. Adding a
 * surface here without setting its tone honestly is how dark-on-dark text ships.
 */
export const BODY_SURFACE = {
  white: { bg: 'bg-white', tone: 'light' },
  pearl: { bg: 'bg-kawai-pearl', tone: 'light' },
  red: { bg: 'bg-kawai-red', tone: 'dark' },
  black: { bg: 'bg-kawai-black', tone: 'dark' },
} as const satisfies Record<string, { bg: string; tone: 'light' | 'dark' }>
