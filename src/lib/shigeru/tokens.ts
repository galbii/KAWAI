import type { CSSProperties } from 'react'

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

/** Opaque pearl. Needed as a real background wherever an animated wrapper
 *  sits above a mix-blend-multiply image — see RangeFloor. */
export const PEARL = 'rgb(250, 248, 245)'

/** The microsite's motion curve — the same one the homepage carousel rides. */
export const ease = [0.25, 0.46, 0.45, 0.94] as const

/**
 * The Shigeru Kawai wordmark. The asset is gold on transparent, which is only
 * ~1.6:1 on pearl — render it over a light ground with `filter: brightness(0)`
 * so it reads as ink, and use the white variant on the dark chrome.
 */
export const SHIGERU_WORDMARK =
  'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/Shigeru%20Kawai%20logo.webp'

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
 * The range is differentiated by length (180 cm → 278 cm). Used by the
 * collection entries, where each instrument gets a section of its own and the
 * page is read top to bottom, so the range can grow as you scroll.
 *
 * Not used by the range strip: see SHOT_FRAME_ASPECT for why a row of six
 * cannot be drawn to scale from these files.
 */
export const lengthRatio = (cm: string, longestCm = 278): number =>
  longestCm ? parseCm(cm) / longestCm : 1

/**
 * Uniform frame ratio for the product shots.
 *
 * A row of six is read as a set of six destinations, not as a measurement, and
 * these files cannot carry a measurement anyway: SK-2–SK-7 are one matched
 * set, each cropped tight and rendered at the same pixel height, so the files
 * already normalise the instrument and encode length only as canvas width. Any
 * frame that scales by length therefore shrinks the SK-2 in the wrong axis —
 * and the SK-EX, whose file is framed differently again, lands 18–27% off the
 * ratio it is supposed to be showing. One frame per model instead, and the
 * length is stated in words beside it.
 *
 * The ratio itself is load-bearing. `object-contain` gives every model the
 * same rendered height only while it binds on height, i.e. while the frame is
 * at least as wide as the widest shot. The SK-EX canvas is 1.36:1 and
 * `shotFix` scales it a further 1.177×, so the frame must clear 1.60:1 or the
 * blend group clips. 7.5/4.6 ≈ 1.63 is the ratio the homepage filmstrip
 * already uses.
 */
export const SHOT_FRAME_ASPECT = '7.5 / 4.6'

/**
 * How much of its own file each instrument actually occupies — measured from
 * the live assets, not eyeballed.
 *
 * SK-2–SK-7 are transparent PNGs cropped flush to the instrument on all four
 * edges, so in a uniform frame they already fill it with their feet on the
 * floor and need no entry here. The SK-EX is a different asset: a 5616×4134
 * JPEG on white carrying real margin, in which the piano fills 85.0% of the
 * height and stands 11.8% of it above the bottom edge. Dropped into the same
 * frame it renders 15% short and floats off the floor line.
 *
 * Re-crop the SK-EX to match the set and this table becomes identity. That is
 * the real fix — it also retires the mix-blend-multiply workaround that the
 * one white-background file forces on every wrapper that animates. This is the
 * fix that needs no asset pipeline.
 */
const SHOT_FILL: Record<string, { fillsHeight: number; bottomPad: number }> = {
  'sk-ex': { fillsHeight: 0.85, bottomPad: 0.118 },
}

/**
 * Normalises one shot inside a uniform frame: translate the feet down onto the
 * floor, then scale up from that floor until the instrument fills the frame.
 *
 * Both figures are fractions of the frame's height, which holds only while the
 * image is height-bound — hence SHOT_FRAME_ASPECT. Order matters: the scale is
 * written first so it applies last, over a translate it then carries with it.
 */
export const shotFix = (slug: string): CSSProperties | undefined => {
  const fill = SHOT_FILL[slug]
  if (!fill) return undefined
  return {
    transform: `scale(${(1 / fill.fillsHeight).toFixed(4)}) translateY(${(
      fill.bottomPad * 100
    ).toFixed(2)}%)`,
    transformOrigin: 'bottom center',
  }
}
