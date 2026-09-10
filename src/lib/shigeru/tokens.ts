/**
 * Shigeru Kawai microsite — shared design tokens.
 *
 * The microsite runs on two surfaces and one accent: pearl ground, ink text,
 * gold hairline. Components that render on pearl reach for `ink()`; components
 * that render on the near-black bands reach for `pearl()`.
 *
 * Alpha floors matter here — the microsite is an ADA/WCAG AA matter. On
 * kawai-pearl, ink at 0.72 is the lowest alpha that clears 4.5:1 for small
 * text, so 0.72 is the floor for anything readable and everything below it
 * (0.18, 0.12) is reserved for rules and dividers.
 *
 * GOLD is a *rule* colour, never a text colour: #D5C78C on pearl is ~1.6:1.
 */

const INK_RGB = '30, 27, 22' // kawai-black #1E1B16
const PEARL_RGB = '250, 248, 245' // kawai-pearl #FAF8F5

/** Ink on pearl. 0.95 display · 0.78 body · 0.72 small-text floor · 0.18 rules. */
export const ink = (alpha: number): string => `rgba(${INK_RGB}, ${alpha})`

/** Pearl on the near-black bands. */
export const pearl = (alpha: number): string => `rgba(${PEARL_RGB}, ${alpha})`

/** kawai-gold. Hairlines, underlines, and dividers only — never type. */
export const GOLD = 'rgb(213, 199, 140)'

/** The near-black used by every dark band on the microsite. */
export const NEAR_BLACK = '#0a0a0a'

export const OSWALD = 'var(--font-oswald)'
export const SERIF = 'var(--font-brand-luxury)'
export const SANS = 'var(--font-brand-sans)'

/**
 * Tracked Oswald caps — the microsite's voice for data labels and controls.
 * 0.7rem is the smallest size the microsite's legibility baseline allows.
 */
export const labelStyle = (alpha = 0.72, size = '0.7rem') => ({
  fontFamily: OSWALD,
  fontSize: size,
  letterSpacing: '0.28em',
  color: ink(alpha),
})

/**
 * Every section below a model page's hero runs on one grid: heading left,
 * content right. The hero is the only centred thing on the page — it is the
 * monument, and the rest is the document.
 */
export const EDITORIAL_GRID =
  'grid gap-y-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-x-16'

const parseCm = (cm: string): number => parseInt(cm, 10) || 0

/**
 * The range is differentiated by length (180 cm → 278 cm), so wherever more
 * than one instrument shares a floor line they are drawn to true relative
 * scale against the SK-EX. A lone instrument is drawn at full size — with no
 * sibling beside it a 65%-size piano reads as timid, not as small.
 */
export const lengthRatio = (cm: string, longestCm = 278): number =>
  longestCm ? parseCm(cm) / longestCm : 1
