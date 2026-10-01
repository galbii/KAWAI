'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { PROMO_SCROLL_OFFSET, scrollToPromoSection } from '@/lib/fall-promo/scroll'

export interface PromoNavSection {
  /** The `id` of the `<section>` this row jumps to. */
  readonly id: string
  /** What the row says. Wayfinding only — see the compliance note below. */
  readonly label: string
}

interface PromoSideNavProps {
  sections: readonly PromoNavSection[]
}

/**
 * The campaign pages' quick-navigation rail.
 *
 * Same interaction as the product pages' `ProductSideNav` and the CMS pages'
 * `layout-side-navigation` block — a thin rail pinned to the right edge that
 * expands to full labels on hover, with the active row tracked by an
 * IntersectionObserver — so a shopper who arrives from a product page finds the
 * control they already know in the place they left it.
 *
 * What differs is the paint and the data. It renders in the campaign palette
 * off the semantic tokens (`--ground`, `--body`, `--accent`…) rather than the
 * site's `kawai-*` scale, which is what lets one component sit correctly on
 * Variation A's Ivory ground and Variation B's Ink ground with no `variation`
 * prop; and it takes an explicit section list, because these pages are
 * hand-built React rather than a block array there is anything to derive from.
 *
 * Being `position: fixed` does not detach it from the cascade: the tokens
 * resolve from its DOM parent, so it must be rendered inside the `.promo`
 * wrapper. Outside it every custom property above falls back to nothing.
 *
 * ── Two constraints worth not rediscovering ──────────────────────────────
 *
 * **Labels carry no figures.** A rate, a term or a dollar amount in a nav row
 * is a credit advertisement that has escaped its disclosure: §4.1 requires the
 * APR to travel with the 0% and §4.2 requires the terms sentence directly
 * under it, and neither can follow a label into a floating panel. The three
 * offer rows take their names from `OFFER_CHIPS`, which is the same source the
 * chips and the section headings use, and `financing-compliance.test.ts`
 * checks these labels alongside the rest of the page's text.
 *
 * **Nothing here is styled in Ember at label size.** Ember on Ivory is 4.40:1
 * — under AA for text below 24px (`EMBER_TEXT_MIN_PX`). So the active row is
 * marked by weight plus an `--accent` bar, which is a graphic and needs only
 * 3:1, while the text itself stays on `--body` (10.14:1) and `--on-ground`
 * (15.01:1). Do not move the accent onto the label to make it louder.
 */

/** Matches the `scroll-mt-20` every section on these pages already carries. */

const APPEAR_DELAY_MS = 2000
const AUTO_COLLAPSE_MS = 3000

/**
 * Opaque enough that a row's contrast holds over whatever the rail happens to
 * be floating above — the dealer cinematic is a full-bleed Ink section, and a
 * panel at the 0.88 the product rail uses lets enough of it through to pull
 * `--body` off its measured 10.14:1.
 */
const PANEL_BG = 'color-mix(in srgb, var(--ground) 94%, transparent)'

export function PromoSideNav({ sections }: PromoSideNavProps) {
  const prefersReduced = useReducedMotion()

  // `useReducedMotion` reads a media query, so it disagrees with the server on
  // the first client render. Only durations and scroll behaviour branch on it —
  // never the rendered markup or a motion `initial` — so there is nothing here
  // for React to find mismatched. (Contrast DealerCinematic, which swaps whole
  // sections and therefore needs a mount guard.)
  const reduce = prefersReduced === true

  const [activeId, setActiveId] = useState<string | null>(null)
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(true)
  const [isMobileExpanded, setIsMobileExpanded] = useState(true)

  const desktopTimer = useRef<NodeJS.Timeout | null>(null)
  const mobileTimer = useRef<NodeJS.Timeout | null>(null)

  // Arrives expanded so it is discoverable, then folds back to the rail so it
  // stops competing with the page it is indexing.
  useEffect(() => {
    const collapseAt = APPEAR_DELAY_MS + AUTO_COLLAPSE_MS
    desktopTimer.current = setTimeout(() => setIsDesktopExpanded(false), collapseAt)
    mobileTimer.current = setTimeout(() => setIsMobileExpanded(false), collapseAt)
    return () => {
      if (desktopTimer.current) clearTimeout(desktopTimer.current)
      if (mobileTimer.current) clearTimeout(mobileTimer.current)
    }
  }, [])

  // Active row. The band runs from just under the header to the middle of the
  // viewport, which is what keeps the 340vh pinned cinematic reading as one
  // section for the whole of its scroll rather than dropping out halfway.
  useEffect(() => {
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: `-${PROMO_SCROLL_OFFSET}px 0px -50% 0px`, threshold: 0 }
    )

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sections])

  // Shared with the hero's value-prop bar — see `@/lib/fall-promo/scroll`.
  const scrollTo = useCallback((id: string) => scrollToPromoSection(id, reduce), [reduce])

  const handleDesktopEnter = useCallback(() => {
    if (desktopTimer.current) clearTimeout(desktopTimer.current)
    setIsDesktopExpanded(true)
  }, [])

  const handleDesktopLeave = useCallback(() => {
    if (desktopTimer.current) clearTimeout(desktopTimer.current)
    desktopTimer.current = setTimeout(() => setIsDesktopExpanded(false), AUTO_COLLAPSE_MS)
  }, [])

  const handleMobileTap = useCallback(() => {
    setIsMobileExpanded(true)
    if (mobileTimer.current) clearTimeout(mobileTimer.current)
    mobileTimer.current = setTimeout(() => setIsMobileExpanded(false), AUTO_COLLAPSE_MS)
  }, [])

  /**
   * Keyboard focus holds the panel open, and opens it if it had folded away.
   *
   * Without this the auto-collapse fires on its timer while a row is focused,
   * unmounts it mid-tab and drops focus to the body — so a keyboard user gets
   * three seconds to use the rail and then loses their place in the page. Focus
   * gets no deadline; the blur handler restarts the timer on the way out.
   */
  const handleMobileFocus = useCallback(() => {
    if (mobileTimer.current) clearTimeout(mobileTimer.current)
    setIsMobileExpanded(true)
  }, [])

  const handleMobileBlur = useCallback(() => {
    if (mobileTimer.current) clearTimeout(mobileTimer.current)
    mobileTimer.current = setTimeout(() => setIsMobileExpanded(false), AUTO_COLLAPSE_MS)
  }, [])

  if (sections.length === 0) return null

  const activeIndex = sections.findIndex((section) => section.id === activeId)

  /** Expanded panel. `compact` is the phone's tighter metrics. */
  const panel = (compact: boolean, onPick: (id: string) => void) => (
    <motion.nav
      key="expanded"
      initial={{ opacity: 0, width: 0 }}
      animate={{ opacity: 1, width: 'auto' }}
      exit={{ opacity: 0, width: 0 }}
      transition={{ duration: reduce ? 0 : 0.22, ease: [0.4, 0, 0.2, 1] }}
      className="overflow-hidden border shadow-lg backdrop-blur-xl"
      style={{ background: PANEL_BG, borderColor: 'var(--rule-soft)' }}
      aria-label="Offers on this page"
    >
      <div className="flex flex-col">
        <div
          className={`border-b ${compact ? 'px-5 pt-3.5 pb-2.5' : 'px-6 pt-4 pb-3'}`}
          style={{ borderColor: 'var(--rule-soft)' }}
        >
          <p
            className={`promo-body font-semibold uppercase leading-none ${
              compact ? 'text-[9px]' : 'text-[10px]'
            }`}
            style={{ letterSpacing: '0.16em', color: 'var(--body-dim)' }}
          >
            On this page
          </p>
        </div>

        <div className={`flex flex-col ${compact ? 'py-1.5' : 'py-2'}`}>
          {sections.map((section) => {
            const isActive = section.id === activeId
            return (
              <button
                key={section.id}
                onClick={() => onPick(section.id)}
                className={`promo-body relative flex items-center whitespace-nowrap tracking-wide transition-colors duration-150 ${
                  compact ? 'px-5 py-2.5 text-[12px]' : 'px-6 py-3 text-[13px]'
                } ${isActive ? 'font-semibold' : 'font-medium'}`}
                style={{
                  // Both clear AA on the panel; the accent bar below, not the
                  // label colour, is what marks the active row.
                  color: isActive ? 'var(--on-ground)' : 'var(--body)',
                }}
                aria-current={isActive ? 'true' : undefined}
              >
                {isActive && (
                  <motion.span
                    aria-hidden
                    layoutId={compact ? 'promoNavBarMobile' : 'promoNavBarDesktop'}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full ${
                      compact ? 'h-4' : 'h-5'
                    }`}
                    style={{ background: 'var(--accent)' }}
                    transition={{ duration: reduce ? 0 : 0.2, ease: 'easeInOut' }}
                  />
                )}
                {section.label}
              </button>
            )
          })}
        </div>
      </div>
    </motion.nav>
  )

  /** Collapsed rail: a hairline with the reading position on it. */
  const rail = (compact: boolean) => {
    const step = compact ? 20 : 24
    const marker = compact ? 16 : 20
    const pad = compact ? 6 : 8

    return (
      <motion.div
        key="collapsed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduce ? 0 : 0.18 }}
        className="relative cursor-pointer overflow-hidden rounded-full border shadow-md"
        style={{
          width: '6px',
          height: `${sections.length * step + pad * 2}px`,
          background: PANEL_BG,
          borderColor: 'var(--rule-soft)',
        }}
      >
        {/* `top` is in the style as well as the animation target: animating it
            from the CSS default of `auto` makes the marker jump on its first
            frame instead of sliding. */}
        <motion.span
          className="absolute left-0 right-0 rounded-full"
          style={{ height: `${marker}px`, background: 'var(--accent)', top: `${pad}px` }}
          animate={{ top: `${pad + Math.max(activeIndex, 0) * step}px` }}
          transition={{ duration: reduce ? 0 : 0.3, ease: 'easeInOut' }}
        />
      </motion.div>
    )
  }

  return (
    <>
      {/* ── Desktop ──
          z-40 keeps it under the z-50 lead and explainer dialogs. The product
          rail puts its phone layer at z-[100], which floats it over those
          backdrops; not copied. */}
      <div className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: reduce ? 0 : 0.4,
            ease: 'easeOut',
            delay: APPEAR_DELAY_MS / 1000,
          }}
          onMouseEnter={handleDesktopEnter}
          onMouseLeave={handleDesktopLeave}
          onFocusCapture={handleDesktopEnter}
          onBlurCapture={handleDesktopLeave}
        >
          <AnimatePresence mode="wait">
            {isDesktopExpanded ? panel(false, scrollTo) : rail(false)}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── Phone ── */}
      <div className="fixed right-3 top-1/2 z-40 -translate-y-1/2 lg:hidden">
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: reduce ? 0 : 0.4,
            ease: 'easeOut',
            delay: APPEAR_DELAY_MS / 1000,
          }}
          onClick={handleMobileTap}
          onFocusCapture={handleMobileFocus}
          onBlurCapture={handleMobileBlur}
        >
          <AnimatePresence mode="wait">
            {isMobileExpanded
              ? panel(true, (id) => {
                  handleMobileTap()
                  scrollTo(id)
                })
              : rail(true)}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  )
}
