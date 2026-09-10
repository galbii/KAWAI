'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  leftNav,
  rightNav,
  mobileNav,
  resolveActive,
  isDropdown,
  type NavItem,
  type NavDropdown,
} from '@/lib/shigeru/nav'

const SHIGERU_LOGO =
  'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/Shigeru%20Kawai%20logo%20(white).webp'

const f = { fontFamily: 'var(--font-oswald)' }
const SCROLL_THRESHOLD = 80
const ease = [0.25, 0.46, 0.45, 0.94] as const

const panelStyle: React.CSSProperties = {
  background: 'rgba(18,16,12,0.98)',
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '4px',
  boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
}

const linkBase =
  'relative text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors duration-300'

const dropdownId = (label: string) => `sk-nav-${label.toLowerCase().replace(/\s+/g, '-')}`

/** Gold rule beneath the current page — active state must not be colour-only (WCAG 1.4.1). */
function ActiveRule() {
  return (
    <span
      aria-hidden
      className="absolute -bottom-2 left-0 right-0 h-px bg-kawai-gold"
    />
  )
}

// ── Dropdown panels ──────────────────────────────────────────────────────────

/** Plain link column — Resources. */
function ListPanel({ item, pathname }: { item: NavDropdown; pathname: string }) {
  return (
    <ul className="flex flex-col min-w-[208px] py-2" style={panelStyle}>
      {item.children.map((child) => {
        const childActive = resolveActive(pathname, child)
        return (
          <li key={child.href}>
            <Link
              href={child.href}
              style={f}
              aria-current={childActive ? 'page' : undefined}
              className={[
                'block text-[11px] font-semibold tracking-[0.14em] uppercase px-6 py-3 transition-colors duration-200',
                childActive
                  ? 'text-white bg-white/[0.05] border-l-2 border-kawai-gold'
                  : 'text-white/75 hover:text-white hover:bg-white/[0.04] border-l-2 border-transparent',
              ].join(' ')}
            >
              {child.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

/** Every model class ends in "Grand"; the menu is already labelled Grands. */
const shortKind = (kind: string) => kind.replace(/\s+Grand$/i, '')

/** Ink alphas match the collection carousel's — ≥0.72 clears 4.5:1 on pearl. */
const INK = '30,27,22'
const ink = (a: number) => `rgba(${INK},${a})`

export type ModelImages = Record<string, string | null>

/**
 * The grand-piano mega menu — the homepage collection filmstrip, moved into
 * the header.
 *
 * The carousel's argument is that the range is read by length, so it stands the
 * six pianos to true relative scale on one shared floor: the SK-2 fills 65% of
 * the SK-EX's frame because that is how long it actually is. This panel keeps
 * that reading, and keeps the pearl stage with it — the product shots are lit
 * on white and blend into pearl, not into the header's near-black.
 */
function ModelsPanel({
  item,
  pathname,
  modelImages,
}: {
  item: NavDropdown
  pathname: string
  modelImages: ModelImages
}) {
  const { overview } = item
  const overviewActive = overview ? pathname === overview.href : false

  return (
    <div className="bg-kawai-pearl">
      <ul
        className="sk-scroll-hide mx-auto flex max-w-screen-2xl items-end overflow-x-auto px-8 pt-10 md:px-14"
        style={{ scrollSnapType: 'x proximity' }}
      >
        {item.children.map((child) => {
          const childActive = resolveActive(pathname, child)
          const detail = child.detail
          const image = detail ? modelImages[detail.slug] : null
          const ratio = detail?.lengthRatio ?? 1
          return (
            <li
              key={child.href}
              className="shrink-0"
              style={{ width: `${ratio * 19}rem`, minWidth: '9rem', scrollSnapAlign: 'start' }}
            >
              <Link
                href={child.href}
                aria-current={childActive ? 'page' : undefined}
                className="group relative flex h-full flex-col justify-end pb-6 text-center transition-colors duration-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-black"
              >
                {/* Each piano occupies its true share of the frame, and every
                    column's bottom border joins the next into one floor. */}
                <span
                  className="flex items-end justify-center px-4 pb-1"
                  style={{ borderBottom: `1px solid ${ink(0.18)}`, minHeight: '10.5rem' }}
                >
                  <span
                    className="relative block"
                    style={{ width: '100%', height: `${ratio * 9.5}rem` }}
                  >
                    {image && (
                      // mix-blend-multiply drops the white-lit product shot onto
                      // the pearl stage. Nothing is layered over the photograph.
                      <Image
                        src={image}
                        alt=""
                        fill
                        sizes="(min-width: 1536px) 320px, 25vw"
                        className="object-contain object-bottom mix-blend-multiply"
                      />
                    )}
                  </span>
                </span>

                <span
                  className="mt-4 block uppercase leading-none transition-colors duration-300"
                  style={{
                    fontFamily: 'var(--font-oswald)',
                    fontSize: '1.05rem',
                    fontWeight: childActive ? 700 : 500,
                    letterSpacing: '0.1em',
                    color: childActive ? ink(0.95) : ink(0.78),
                  }}
                >
                  {child.label}
                </span>

                {detail && (
                  <>
                    <span
                      className="mt-2 block italic leading-tight"
                      style={{
                        fontFamily: 'var(--font-brand-luxury)',
                        fontSize: '1rem',
                        color: ink(0.72),
                      }}
                    >
                      {shortKind(detail.kind)}
                    </span>
                    <span
                      className="mt-2 block"
                      style={{
                        fontFamily: 'var(--font-oswald)',
                        fontSize: '0.8rem',
                        letterSpacing: '0.18em',
                        color: ink(0.72),
                      }}
                    >
                      {detail.length}
                    </span>
                  </>
                )}

                {/* Gold marker under the model you're on — the filmstrip's. */}
                <span
                  aria-hidden
                  className={[
                    'absolute inset-x-4 bottom-0 h-[3px] bg-kawai-gold transition-opacity duration-300',
                    childActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                  ].join(' ')}
                />
              </Link>
            </li>
          )
        })}
      </ul>

      {overview && (
        <div className="bg-kawai-black">
          <Link
            href={overview.href}
            aria-current={overviewActive ? 'page' : undefined}
            className="group mx-auto flex max-w-screen-2xl items-center gap-3 px-8 py-5 md:px-14"
          >
            <span
              style={f}
              className={[
                'text-[12px] font-semibold tracking-[0.16em] uppercase transition-colors duration-300',
                overviewActive ? 'text-white' : 'text-white/75 group-hover:text-white',
              ].join(' ')}
            >
              Compare all six side by side
            </span>
            <span
              aria-hidden
              className="text-kawai-gold text-xs transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      )}
    </div>
  )
}

// ── One side of the split nav ────────────────────────────────────────────────

function NavBar({
  items,
  pathname,
  openDropdown,
  onOpen,
  onClose,
  onToggle,
  side,
}: {
  items: NavItem[]
  pathname: string
  openDropdown: string | null
  onOpen: (label: string) => void
  onClose: () => void
  onToggle: (label: string) => void
  side: 'left' | 'right'
}) {
  return (
    <nav
      className={`hidden lg:flex items-center ${side === 'right' ? 'justify-end' : 'justify-start'}`}
      aria-label={side === 'left' ? 'Primary navigation' : 'Secondary navigation'}
    >
      {items.map((item, idx) => {
        const active = resolveActive(pathname, item)
        const isContact = !isDropdown(item) && item.href === '/shigeru/contact'

        // Contact is the primary CTA — give it a real affordance, matching mobile.
        if (isContact && !isDropdown(item)) {
          return (
            <div key={item.label} className="flex items-center">
              {idx > 0 && <span className="block w-px h-3 bg-white/25 mx-5 shrink-0" aria-hidden />}
              <Link
                href={item.href}
                style={{ ...f, borderRadius: '999px' }}
                aria-current={active ? 'page' : undefined}
                className={[
                  'text-[11px] font-semibold tracking-[0.14em] uppercase px-5 py-2 border transition-all duration-300',
                  active
                    ? 'border-kawai-gold text-kawai-gold bg-kawai-gold/[0.10]'
                    : 'border-kawai-gold/45 text-kawai-gold hover:border-kawai-gold hover:bg-kawai-gold/[0.08]',
                ].join(' ')}
              >
                {item.label}
              </Link>
            </div>
          )
        }

        const textColor = active ? 'text-white' : 'text-white/75 hover:text-white'

        return (
          <div key={item.label} className="flex items-center">
            {idx > 0 && <span className="block w-px h-3 bg-white/25 mx-5 shrink-0" aria-hidden />}

            {isDropdown(item) ? (
              <div
                className="relative"
                onMouseEnter={() => onOpen(item.label)}
                onMouseLeave={onClose}
              >
                <button
                  type="button"
                  style={f}
                  onClick={() => onToggle(item.label)}
                  aria-expanded={openDropdown === item.label}
                  aria-controls={dropdownId(item.label)}
                  className={[linkBase, 'flex items-center gap-1 cursor-pointer select-none', textColor].join(' ')}
                >
                  {item.label}
                  <motion.span
                    animate={{ rotate: openDropdown === item.label ? 180 : 0 }}
                    transition={{ duration: 0.18 }}
                    aria-hidden
                  >
                    <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
                      <path d="M1 1L3.5 3.5L6 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.span>
                  {active && <ActiveRule />}
                </button>

                {/* Anchored to its own trigger. `pt-3` is the hover bridge, so the
                    close-delay timer never has to cover a bare gap. */}
                {/* Deliberately NOT wrapped in <AnimatePresence>. With framer-motion 12
                    + React 19 the exit animation runs but the node is never unmounted,
                    leaving an opacity-0 panel that still has pointer-events and keeps its
                    links in the tab order — an invisible click-blocker over the page.
                    A plain conditional mount unmounts synchronously and is correct; only
                    the (unnoticed) exit animation is given up. */}
                {openDropdown === item.label && item.variant !== 'models' && (
                    <motion.div
                      id={dropdownId(item.label)}
                      className={`absolute top-full pt-3 z-50 ${side === 'right' ? 'right-0' : 'left-0'}`}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.16, ease }}
                    >
                      <ListPanel item={item} pathname={pathname} />
                    </motion.div>
                )}
              </div>
            ) : (
              <Link
                href={item.href}
                style={f}
                aria-current={active ? 'page' : undefined}
                className={[linkBase, textColor].join(' ')}
              >
                {item.label}
                {active && <ActiveRule />}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export default function ShigeruHeader({ modelImages = {} }: { modelImages?: ModelImages }) {
  const pathname = usePathname()
  const isHomepage = pathname === '/shigeru'

  const [scrolled, setScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [logoHovered, setLogoHovered] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const headerRef = useRef<HTMLElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const hamburgerRef = useRef<HTMLButtonElement | null>(null)
  const navLeaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const logoLeaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // The one full-bleed menu, if it's the one that's open.
  const megaItem = mobileNav.find(
    (item): item is NavDropdown =>
      isDropdown(item) && item.variant === 'models' && item.label === openDropdown,
  )

  // Transparency only applies on the /shigeru homepage — all other pages are
  // always solid. The mega menu is a full-width sheet, so the bar above it goes
  // solid too and the two read as one surface.
  const transparent = isHomepage && !scrolled && !megaItem

  // Only the homepage reacts to scroll, and only once per frame.
  useEffect(() => {
    if (!isHomepage) {
      setScrolled(false)
      return
    }
    let frame = 0
    function onScroll() {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        setScrolled(window.scrollY > SCROLL_THRESHOLD)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [isHomepage])

  useEffect(() => {
    setMobileOpen(false)
    setOpenDropdown(null)
    setLogoHovered(false)
  }, [pathname])

  // Lock the page behind the mobile sheet without losing scroll position (iOS
  // resets to top if you only set `overflow: hidden`).
  useEffect(() => {
    if (!mobileOpen) return
    const y = window.scrollY
    const { body } = document
    const prev = { position: body.style.position, top: body.style.top, width: body.style.width }
    body.style.position = 'fixed'
    body.style.top = `-${y}px`
    body.style.width = '100%'
    return () => {
      body.style.position = prev.position
      body.style.top = prev.top
      body.style.width = prev.width
      window.scrollTo(0, y)
    }
  }, [mobileOpen])

  const closeDropdownNow = useCallback(() => {
    if (navLeaveTimer.current) clearTimeout(navLeaveTimer.current)
    setOpenDropdown(null)
  }, [])

  // Escape closes whatever is open and hands focus back to its trigger.
  useEffect(() => {
    if (!openDropdown && !mobileOpen) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      if (mobileOpen) {
        setMobileOpen(false)
        hamburgerRef.current?.focus()
        return
      }
      const trigger = headerRef.current?.querySelector<HTMLButtonElement>('[aria-expanded="true"]')
      closeDropdownNow()
      trigger?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [openDropdown, mobileOpen, closeDropdownNow])

  // Any press outside the header dismisses an open dropdown.
  useEffect(() => {
    if (!openDropdown) return
    function onPointerDown(e: PointerEvent) {
      if (!headerRef.current?.contains(e.target as Node)) closeDropdownNow()
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [openDropdown, closeDropdownNow])

  // Focus trap for the mobile sheet.
  useEffect(() => {
    if (!mobileOpen) return
    const root = overlayRef.current
    if (!root) return
    const selector =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    const first = root.querySelector<HTMLElement>(selector)
    first?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab' || !root) return
      const focusable = Array.from(root.querySelectorAll<HTMLElement>(selector))
      if (focusable.length === 0) return
      const start = focusable[0]!
      const end = focusable[focusable.length - 1]!
      if (e.shiftKey && document.activeElement === start) {
        e.preventDefault()
        end.focus()
      } else if (!e.shiftKey && document.activeElement === end) {
        e.preventDefault()
        start.focus()
      }
    }
    root.addEventListener('keydown', onKeyDown)
    return () => root.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen])

  function handleDropdownOpen(label: string) {
    if (navLeaveTimer.current) clearTimeout(navLeaveTimer.current)
    setOpenDropdown(label)
  }
  function handleDropdownLeave() {
    navLeaveTimer.current = setTimeout(() => setOpenDropdown(null), 150)
  }
  function handleDropdownToggle(label: string) {
    if (navLeaveTimer.current) clearTimeout(navLeaveTimer.current)
    setOpenDropdown((current) => (current === label ? null : label))
  }

  function handleLogoEnter() {
    if (logoLeaveTimer.current) clearTimeout(logoLeaveTimer.current)
    setLogoHovered(true)
  }
  function handleLogoLeave() {
    logoLeaveTimer.current = setTimeout(() => setLogoHovered(false), 180)
  }

  const navBarProps = {
    pathname,
    openDropdown,
    onOpen: handleDropdownOpen,
    onClose: handleDropdownLeave,
    onToggle: handleDropdownToggle,
  }

  return (
    <>
      {/* ── Header ── */}
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: transparent ? 'transparent' : 'rgba(16,14,10,0.97)',
          backdropFilter: transparent ? 'none' : 'blur(20px) saturate(160%)',
          WebkitBackdropFilter: transparent ? 'none' : 'blur(20px) saturate(160%)',
          borderBottom: transparent ? '1px solid transparent' : '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-[68px] px-8 md:px-14 max-w-screen-2xl mx-auto">

          {/* Left nav — wrapper div keeps this column in grid flow on mobile */}
          <div>
            <NavBar items={leftNav} side="left" {...navBarProps} />
          </div>

          {/* Center logo with Kawai parent-brand hover dropdown */}
          <div
            className="relative flex items-center justify-center px-8"
            onMouseEnter={handleLogoEnter}
            onMouseLeave={handleLogoLeave}
          >
            <Link href="/shigeru" aria-label="Shigeru Kawai — Home" className="flex items-center justify-center">
              <Image
                src={SHIGERU_LOGO}
                alt="Shigeru Kawai"
                width={0}
                height={0}
                sizes="160px"
                priority
                className="h-[46px] w-auto object-contain transition-opacity duration-300"
                style={{ opacity: logoHovered ? 0.7 : 1 }}
              />
            </Link>

            {/* Kawai parent brand dropdown */}
            {logoHovered && (
                <motion.div
                  className="absolute top-full mt-3 left-1/2 -translate-x-1/2 pointer-events-auto z-50"
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.18, ease }}
                >
                  <Link
                    href="/"
                    aria-label="Back to Kawai America"
                    className="flex flex-col items-center gap-3 px-8 py-5 group"
                    style={panelStyle}
                  >
                    <Image
                      src="/images/Kawai (Red).png"
                      alt="Kawai America"
                      width={120}
                      height={40}
                      className="object-contain transition-opacity duration-200 group-hover:opacity-75"
                      style={{ height: '28px', width: 'auto' }}
                    />
                    <span
                      className="text-white/65 group-hover:text-white transition-colors duration-200 text-[10px] tracking-[0.4em] uppercase whitespace-nowrap"
                      style={f}
                    >
                      Kawai America
                    </span>
                  </Link>
                </motion.div>
            )}
          </div>

          {/* Right nav + mobile hamburger */}
          <div className="flex items-center justify-end">
            <NavBar items={rightNav} side="right" {...navBarProps} />

            {/* Mobile hamburger */}
            <button
              ref={hamburgerRef}
              onClick={() => setMobileOpen(true)}
              className="flex flex-col justify-center items-end gap-[5px] w-11 h-11 lg:hidden"
              aria-label="Open navigation"
              aria-expanded={mobileOpen}
            >
              <span className="block h-px w-5 bg-white/80" />
              <span className="block h-px w-3.5 bg-white/80" />
              <span className="block h-px w-5 bg-white/80" />
            </button>
          </div>
        </div>

        {/* Grand-piano mega menu — full-bleed under the bar, kept open while the
            pointer is inside it. Not wrapped in <AnimatePresence> for the same
            reason as the anchored panels above. */}
        {megaItem && (
          <motion.div
            id={dropdownId(megaItem.label)}
            onMouseEnter={() => handleDropdownOpen(megaItem.label)}
            onMouseLeave={handleDropdownLeave}
            className="hidden lg:block overflow-hidden"
            style={{ boxShadow: '0 24px 48px rgba(0,0,0,0.45)' }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease }}
          >
            <ModelsPanel item={megaItem} pathname={pathname} modelImages={modelImages} />
          </motion.div>
        )}
      </header>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-0 z-[60] flex flex-col"
            style={{ background: 'rgba(10,9,6,0.98)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease }}
          >
            {/* Top bar */}
            <div className="relative flex items-center justify-center h-[68px] border-b border-white/[0.06] shrink-0">
              <Link href="/shigeru" onClick={() => setMobileOpen(false)} aria-label="Shigeru Kawai — Home">
                <Image
                  src={SHIGERU_LOGO}
                  alt="Shigeru Kawai"
                  width={0}
                  height={0}
                  sizes="160px"
                  className="h-[40px] w-auto object-contain"
                />
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-5 flex items-center justify-center w-11 h-11 text-white/70 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Nav items — same source of truth as desktop */}
            <nav className="flex flex-col px-8 pt-12 gap-8 overflow-y-auto" aria-label="Mobile navigation">
              {mobileNav.map((item, i) => {
                const active = resolveActive(pathname, item)

                if (isDropdown(item)) {
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.08, duration: 0.26, ease }}
                    >
                      <span style={f} className="block text-[10px] tracking-[0.2em] uppercase text-white/55 mb-5">
                        {item.label}
                      </span>
                      <div className="flex flex-col gap-5 pl-5 border-l border-kawai-gold/30">
                        {item.children.map((child) => {
                          const childActive = resolveActive(pathname, child)
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              aria-current={childActive ? 'page' : undefined}
                              className="flex flex-col gap-1"
                            >
                              <span
                                style={f}
                                className={[
                                  'text-[16px] font-semibold tracking-[0.04em] uppercase transition-colors duration-200',
                                  childActive ? 'text-kawai-gold' : 'text-white/75',
                                ].join(' ')}
                              >
                                {child.label}
                              </span>
                              {child.detail && (
                                <span
                                  className="flex items-baseline gap-4 text-[11px] tracking-[0.16em] uppercase text-white/45"
                                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                                >
                                  <span>{child.detail.kind}</span>
                                  <span>{child.detail.length}</span>
                                </span>
                              )}
                            </Link>
                          )
                        })}

                        {item.overview && (
                          <Link
                            href={item.overview.href}
                            style={f}
                            aria-current={pathname === item.overview.href ? 'page' : undefined}
                            className={[
                              'inline-flex items-center gap-2 text-[13px] font-semibold tracking-[0.14em] uppercase transition-colors duration-200',
                              pathname === item.overview.href
                                ? 'text-kawai-gold'
                                : 'text-kawai-gold/85',
                            ].join(' ')}
                          >
                            Compare all six
                            <span aria-hidden className="text-xs">→</span>
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  )
                }

                const isContact = item.href === '/shigeru/contact'

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.08, duration: 0.26, ease }}
                  >
                    <Link
                      href={item.href}
                      style={f}
                      aria-current={active ? 'page' : undefined}
                      className={[
                        'block text-[16px] font-semibold tracking-[0.04em] uppercase transition-colors duration-200',
                        active ? 'text-kawai-gold' : isContact ? 'text-kawai-gold/85' : 'text-white/75 hover:text-white',
                      ].join(' ')}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            {/* Bottom section */}
            <div className="mt-auto px-8 pb-12 pt-8 shrink-0 flex flex-col gap-8">
              <span className="block h-px bg-white/[0.06]" aria-hidden />

              {/* Kawai America link */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.02, duration: 0.26, ease }}
              >
                <Link
                  href="/"
                  className="inline-flex items-center gap-3"
                  onClick={() => setMobileOpen(false)}
                >
                  <Image
                    src="/images/Kawai (Red).png"
                    alt="Kawai America"
                    width={80}
                    height={24}
                    className="object-contain"
                    style={{ height: '18px', width: 'auto' }}
                  />
                  <span className="text-white/65 text-[10px] tracking-[0.35em] uppercase" style={f}>
                    ← Kawai America
                  </span>
                </Link>
              </motion.div>

              <Link
                href="/shigeru/contact"
                style={{ ...f, borderRadius: '999px' }}
                className="inline-flex items-center self-start border border-kawai-gold/45 hover:border-kawai-gold text-kawai-gold text-[13px] font-semibold tracking-[0.1em] uppercase px-7 py-3 transition-all duration-300 hover:bg-kawai-gold/[0.08]"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
