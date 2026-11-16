import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'bun:test'

/**
 * Redesign v3: the look changes, the words do not.
 *
 * QA diffs the page's rendered text against origin/main, and rendered text
 * reads `text-transform` and `display`. So the BF stylesheet may restyle
 * anything but must never re-case or show/hide a word. These guards read the
 * source, so a later tweak that breaks the rule fails here before QA.
 */
const DIR = join(process.cwd(), 'src/app/(frontend)/black-friday/_components')
const styles = readFileSync(join(DIR, 'SaleStyles.tsx'), 'utf8')
const css = styles
  .slice(styles.indexOf('__html: `') + '__html: `'.length, styles.lastIndexOf('`'))
  .replace(/\/\*[\s\S]*?\*\//g, '')
const hero = readFileSync(join(DIR, 'BfHero.tsx'), 'utf8')

describe('Black Friday v3 styles keep the words', () => {
  it('never re-cases text', () => {
    expect(css).not.toMatch(/text-transform/)
  })

  it('never hides or shows anything', () => {
    expect(css).not.toMatch(/display\s*:\s*none/)
    expect(css).not.toMatch(/visibility\s*:/)
    expect(css).not.toMatch(/content-visibility/)
  })

  it('only adds letter-free generated content (numerals and an arrow are pseudo-elements)', () => {
    const contents = [...css.matchAll(/content:\s*([^;]+);/g)].map((m) => m[1]!.trim())
    for (const c of contents) {
      expect(["''", "' \\\\2192'", 'counter(bf-tile, decimal-leading-zero)']).toContain(c)
    }
  })

  it('scopes every rule to the Black Friday wrapper', () => {
    const selectors = [...css.matchAll(/(^|\})\s*([^@{}][^{}]*)\{/g)].map((m) => m[2]!.trim())
    for (const sel of selectors) {
      if (sel.startsWith('@') || /^(from|to|\d+%)/.test(sel)) continue // at-rule heads, keyframe steps
      for (const part of sel.split(',')) expect({ part: part.trim(), scoped: /\.promo-bf\b|\.promo\.promo-bf/.test(part) }).toEqual({ part: part.trim(), scoped: true })
    }
  })

  it('keeps the hero copy visible under reduced motion', () => {
    expect(hero).toMatch(/const STILL: Variants = \{\s*hide: \{\},\s*show: \{ opacity: 1, y: 0/)
  })

  it('keeps "See the offer" hidden on phones exactly as the fall hero does', () => {
    expect(hero).toMatch(/className="[^"]*\bhidden\b[^"]*\bsm:inline-block\b[^"]*">\s*See the offer/)
  })
})
