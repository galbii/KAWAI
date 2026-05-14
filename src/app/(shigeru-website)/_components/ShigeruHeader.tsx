'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

type NavChild = { label: string; href: string }
type NavItem =
  | { label: string; href: string; children?: never }
  | { label: string; href: null; children: NavChild[] }

const leftNav: NavItem[] = [
  { label: 'Home', href: '/shigeru' },
  { label: 'Grand Pianos', href: '/shigeru/models' },
  { label: 'Artists', href: '/shigeru/artists' },
]

const rightNav: NavItem[] = [
  { label: 'Authorized Dealers', href: '/shigeru/dealers' },
  {
    label: 'Resources',
    href: null,
    children: [
      { label: 'Artisans', href: '/shigeru/artisans' },
      { label: 'Institutions', href: '/shigeru/institutions' },
    ],
  },
  { label: 'Contact', href: '/shigeru/contact' },
]

const mobileNavItems: NavItem[] = [
  { label: 'Home', href: '/shigeru' },
  { label: 'Grand Pianos', href: '/shigeru/models' },
  { label: 'Authorized Dealers', href: '/shigeru/dealers' },
  {
    label: 'Resources',
    href: null,
    children: [
      { label: 'Artists', href: '/shigeru/artists' },
      { label: 'Artisans', href: '/shigeru/artisans' },
      { label: 'Institutions', href: '/shigeru/institutions' },
    ],
  },
  { label: 'Contact', href: '/shigeru/contact' },
]

const f = { fontFamily: 'var(--font-oswald)' }
const SCROLL_THRESHOLD = 80
const ease = [0.25, 0.46, 0.45, 0.94] as const

const dropdownStyle: React.CSSProperties = {
  background: 'rgba(18,16,12,0.98)',
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '4px',
  boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
}

const linkBase = 'text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors duration-300'

// ── Nav side bar ────────────────────────────────────────────────────────────

function NavBar({
  items,
  pathname,
  openDropdown,
  onDropdownEnter,
  onDropdownLeave,
  side,
}: {
  items: NavItem[]
  pathname: string
  openDropdown: string | null
  onDropdownEnter: (label: string) => void
  onDropdownLeave: () => void
  side: 'left' | 'right'
}) {
  function isActive(item: NavItem): boolean {
    if (item.href === '/shigeru') return pathname === '/shigeru'
    if (item.href) return pathname.startsWith(item.href)
    if (item.children) return item.children.some((c) => pathname.startsWith(c.href))
    return false
  }

  return (
    <nav
      className={`hidden md:flex items-center ${side === 'right' ? 'justify-end' : 'justify-start'}`}
      aria-label={side === 'left' ? 'Primary navigation' : 'Secondary navigation'}
    >
      {items.map((item, idx) => {
        const active = isActive(item)
        const isContact = item.href === '/shigeru/contact'
        const textColor = active
          ? 'text-white'
          : isContact
            ? 'text-kawai-gold hover:text-kawai-gold/75 font-bold'
            : 'text-white/60 hover:text-white'

        return (
          <div key={item.label} className="flex items-center">
            {idx > 0 && (
              <span className="block w-px h-3 bg-white/25 mx-5 shrink-0" aria-hidden />
            )}

            {item.children ? (
              <div
                onMouseEnter={() => onDropdownEnter(item.label)}
                onMouseLeave={onDropdownLeave}
                className="relative"
              >
                <button
                  style={f}
                  aria-expanded={openDropdown === item.label}
                  aria-haspopup="true"
                  className={[linkBase, 'flex items-center gap-1 cursor-default select-none', textColor].join(' ')}
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
                </button>
              </div>
            ) : (
              <Link href={item.href} style={f} className={[linkBase, textColor].join(' ')}>
                {item.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export default function ShigeruHeader() {
  const pathname = usePathname()
  const isHomepage = pathname === '/shigeru'

  const [scrolled, setScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [logoHovered, setLogoHovered] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLeaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const logoLeaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Transparency only applies on the /shigeru homepage — all other pages are always solid
  const transparent = isHomepage && !scrolled

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > SCROLL_THRESHOLD) }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setOpenDropdown(null)
    setLogoHovered(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  function handleDropdownEnter(label: string) {
    if (navLeaveTimer.current) clearTimeout(navLeaveTimer.current)
    setOpenDropdown(label)
  }
  function handleDropdownLeave() {
    navLeaveTimer.current = setTimeout(() => setOpenDropdown(null), 150)
  }

  function handleLogoEnter() {
    if (logoLeaveTimer.current) clearTimeout(logoLeaveTimer.current)
    setLogoHovered(true)
  }
  function handleLogoLeave() {
    logoLeaveTimer.current = setTimeout(() => setLogoHovered(false), 180)
  }

  const activeDropdownItem = openDropdown
    ? [...leftNav, ...rightNav].find((i) => i.label === openDropdown && i.children)
    : null

  function handleHeaderClick(e: React.MouseEvent<HTMLElement>) {
    const target = e.target as HTMLElement
    if (!target.closest('a') && !target.closest('button')) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function isActive(item: NavItem): boolean {
    if (item.href === '/shigeru') return pathname === '/shigeru'
    if (item.href) return pathname.startsWith(item.href)
    return false
  }

  return (
    <>
      {/* ── Header ── */}
      <header
        onClick={handleHeaderClick}
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
            <NavBar
              items={leftNav}
              pathname={pathname}
              openDropdown={openDropdown}
              onDropdownEnter={handleDropdownEnter}
              onDropdownLeave={handleDropdownLeave}
              side="left"
            />
          </div>

          {/* Center logo with Kawai parent-brand hover dropdown */}
          <div
            className="relative flex items-center justify-center px-8"
            onMouseEnter={handleLogoEnter}
            onMouseLeave={handleLogoLeave}
          >
            <Link href="/shigeru" aria-label="Shigeru Kawai — Home" className="flex items-center justify-center">
              <Image
                src="https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/Shigeru%20Kawai%20logo%20(white).webp"
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
            <AnimatePresence>
              {logoHovered && (
                <motion.div
                  className="absolute top-full mt-3 left-1/2 -translate-x-1/2 pointer-events-auto z-50"
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.18, ease }}
                >
                  <Link
                    href="/"
                    aria-label="Back to Kawai America"
                    className="flex flex-col items-center gap-3 px-8 py-5 group"
                    style={dropdownStyle}
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
                      className="text-white/30 group-hover:text-white/55 transition-colors duration-200 text-[8px] tracking-[0.4em] uppercase whitespace-nowrap"
                      style={f}
                    >
                      Kawai America
                    </span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right nav + mobile hamburger */}
          <div className="flex items-center justify-end">
            <NavBar
              items={rightNav}
              pathname={pathname}
              openDropdown={openDropdown}
              onDropdownEnter={handleDropdownEnter}
              onDropdownLeave={handleDropdownLeave}
              side="right"
            />

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex flex-col justify-center gap-[5px] w-9 h-9 md:hidden"
              aria-label="Open navigation"
            >
              <span className="block h-px w-5 bg-white/70" />
              <span className="block h-px w-3.5 bg-white/70" />
              <span className="block h-px w-5 bg-white/70" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Nav dropdown (Resources etc.) ── */}
      <AnimatePresence>
        {activeDropdownItem?.children && (
          <motion.div
            className="fixed top-[68px] left-0 right-0 z-40 flex justify-center pointer-events-none"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease }}
            onMouseEnter={() => handleDropdownEnter(openDropdown!)}
            onMouseLeave={handleDropdownLeave}
          >
            <div
              className="pointer-events-auto flex items-center px-8 py-4"
              style={dropdownStyle}
              role="menu"
              aria-label={activeDropdownItem.label}
            >
              {activeDropdownItem.children.map((child, idx, arr) => (
                <div key={child.href} className="flex items-center">
                  <Link
                    href={child.href}
                    role="menuitem"
                    style={f}
                    className={[
                      'text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors duration-200 px-6',
                      pathname.startsWith(child.href) ? 'text-white' : 'text-white/50 hover:text-white',
                    ].join(' ')}
                  >
                    {child.label}
                  </Link>
                  {idx < arr.length - 1 && (
                    <span className="block w-px h-3 bg-kawai-gold/20 shrink-0" aria-hidden />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col"
            style={{ background: 'rgba(10,9,6,0.98)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease }}
          >
            {/* Top bar */}
            <div className="relative flex items-center justify-center h-[68px] border-b border-white/[0.06] shrink-0">
              <Link href="/shigeru" onClick={() => setMobileOpen(false)}>
                <Image
                  src="https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/Shigeru%20Kawai%20logo%20(white).webp"
                  alt="Shigeru Kawai"
                  width={0}
                  height={0}
                  sizes="160px"
                  className="h-[40px] w-auto object-contain"
                />
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-6 flex items-center justify-center w-9 h-9 text-white/40 hover:text-white/80 transition-colors"
                aria-label="Close menu"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex flex-col px-8 pt-12 gap-8 overflow-y-auto" aria-label="Mobile navigation">
              {mobileNavItems.map((item, i) => {
                if ('children' in item && item.children) {
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.08, duration: 0.26, ease }}
                    >
                      <span style={f} className="block text-[10px] tracking-[0.2em] uppercase text-white/30 mb-5">
                        {item.label}
                      </span>
                      <div className="flex flex-col gap-5 pl-5 border-l border-kawai-gold/20">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            style={f}
                            className={[
                              'text-[16px] font-semibold tracking-[0.04em] uppercase transition-colors duration-200',
                              pathname.startsWith(child.href) ? 'text-white' : 'text-white/60 hover:text-white',
                            ].join(' ')}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )
                }

                const href = item.href ?? '/shigeru'
                const isContact = href === '/shigeru/contact'

                return (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.08, duration: 0.26, ease }}
                  >
                    <Link
                      href={href}
                      style={f}
                      className={[
                        'block text-[16px] font-semibold tracking-[0.04em] uppercase transition-colors duration-200',
                        isActive(item) ? 'text-white' : isContact ? 'text-kawai-gold' : 'text-white/60 hover:text-white',
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
                  <span
                    className="text-white/20 text-[9px] tracking-[0.35em] uppercase"
                    style={f}
                  >
                    ← Kawai America
                  </span>
                </Link>
              </motion.div>

              <Link
                href="/shigeru/contact"
                style={{ ...f, borderRadius: '999px' }}
                className="inline-flex items-center border border-kawai-gold/30 hover:border-kawai-gold/65 text-kawai-gold text-[13px] font-semibold tracking-[0.1em] uppercase px-7 py-3 transition-all duration-300 hover:bg-kawai-gold/[0.06]"
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
