/**
 * Type for the store sale template — the holiday branding from Chance's comps
 * (kawai-holiday-financing-landing, Nov 17, 2026), which replaces the Nov 10
 * Buena Park (Playfair) exception for these pages.
 *
 * - DISPLAY: black heavy display serif for setup lines and headings. Fraunces
 *   at 700/900, loaded in `src/app/layout.tsx` as `--font-holiday-display`
 *   with `preload: false`, so only a page that paints it downloads it. It is a
 *   separate loader from the Fall Promo `--font-fraunces` (400 only), which
 *   the national /fall-financing page keeps unchanged.
 * - SCRIPT: the Kawai red flourishing script for the one hero word (Holiday,
 *   Played, Holidays, Sound). Great Vibes, `--font-great-vibes`, already loaded.
 * - SANS: the sub-lines, body, prices, buttons and fine print. Inter, the
 *   site's body face.
 *
 * Use these through `style={{ fontFamily }}` inside the template only, so no
 * other route changes typography.
 */
export const DISPLAY = 'var(--font-holiday-display), Georgia, "Times New Roman", serif'
export const SCRIPT = 'var(--font-great-vibes), "Snell Roundhand", cursive'
export const SANS = 'var(--font-inter), system-ui, sans-serif'

/** Official Kawai red (#E11922) is `--color-kawai-red` / `text-kawai-red`. */
