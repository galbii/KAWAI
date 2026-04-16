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

const navItems: NavItem[] = [
  { label: 'Home', href: '/shigeru' },
  { label: 'Concert Grands', href: '/shigeru/models' },
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
]

const mobileNavItems = [
  ...navItems,
  { label: 'Contact', href: '/shigeru/contact' } as NavItem,
]

const f = { fontFamily: 'var(--font-oswald)' }

const pillStyle: React.CSSProperties = {
  background: 'rgba(8, 8, 8, 0.72)',
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '56px',
  boxShadow: '0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)',
}

const dropdownStyle: React.CSSProperties = {
  background: 'rgba(8, 8, 8, 0.88)',
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '24px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)',
}

export default function ShigeruHeader() {
  const pathname = usePathname()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setMobileOpen(false)
    setDropdownOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  function isActive(item: NavItem): boolean {
    if (item.href === '/shigeru') return pathname === '/shigeru'
    if (item.href) return pathname.startsWith(item.href)
    if (item.children) return item.children.some((c) => pathname.startsWith(c.href))
    return false
  }

  function openDropdown() {
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
    setDropdownOpen(true)
  }

  function scheduleClose() {
    leaveTimer.current = setTimeout(() => setDropdownOpen(false), 150)
  }

  const linkBase = 'text-[13px] font-semibold tracking-[0.06em] uppercase transition-colors duration-250'

  return (
    <>
      {/* ── Floating glassmorphism pill ── */}
      <div className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <header className="pointer-events-auto w-full max-w-4xl" style={pillStyle}>
          <div className="flex items-center justify-between h-[58px] px-5 md:px-7">

            {/* Logo */}
            <Link href="/shigeru" aria-label="Shigeru Kawai — Home" className="flex items-center shrink-0">
              <Image
                src="https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/Shigeru%20Kawai%20logo.webp"
                alt="Shigeru Kawai"
                width={0}
                height={0}
                sizes="180px"
                priority
                className="h-[44px] w-auto object-contain"
              />
            </Link>

            {/* Desktop nav — hidden on mobile */}
            <nav className="hidden md:flex items-center gap-7" aria-label="Shigeru Kawai navigation">
              {navItems.map((item) => {
                const active = isActive(item)

                if (item.children) {
                  return (
                    <div
                      key={item.label}
                      onMouseEnter={openDropdown}
                      onMouseLeave={scheduleClose}
                      className="relative"
                    >
                      <button
                        style={f}
                        aria-expanded={dropdownOpen}
                        aria-haspopup="true"
                        className={[
                          linkBase,
                          'flex items-center gap-1.5 cursor-default select-none',
                          active ? 'text-white' : 'text-white/55 hover:text-white/90',
                        ].join(' ')}
                      >
                        {item.label}
                        <motion.span
                          animate={{ rotate: dropdownOpen ? 180 : 0 }}
                          transition={{ duration: 0.18 }}
                          aria-hidden
                        >
                          <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
                            <path d="M1 1L3.5 3.5L6 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </motion.span>
                      </button>
                    </div>
                  )
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={f}
                    className={[
                      linkBase,
                      active ? 'text-white' : 'text-white/55 hover:text-white/90',
                    ].join(' ')}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Contact pill — desktop */}
              <Link
                href="/shigeru/contact"
                style={{ ...f, borderRadius: '999px' }}
                className="hidden md:inline-flex items-center border border-kawai-gold/30 hover:border-kawai-gold/65 text-kawai-gold text-[12px] font-semibold tracking-[0.08em] uppercase px-5 py-2 transition-all duration-300 hover:bg-kawai-gold/[0.06]"
              >
                Contact
              </Link>

              {/* Hamburger — mobile */}
              <button
                onClick={() => setMobileOpen(true)}
                className="flex flex-col justify-center gap-[5px] w-8 h-8 md:hidden"
                aria-label="Open navigation"
              >
                <span className="block h-px w-5 bg-white/65" />
                <span className="block h-px w-3.5 bg-white/65" />
                <span className="block h-px w-5 bg-white/65" />
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* ── Resources dropdown ── */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            className="fixed top-[84px] left-0 right-0 z-40 flex justify-center pointer-events-none"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.16, ease: [0.25, 0.46, 0.45, 0.94] }}
            onMouseEnter={openDropdown}
            onMouseLeave={scheduleClose}
          >
            <div
              className="pointer-events-auto flex items-center px-8 py-4"
              style={dropdownStyle}
              role="menu"
              aria-label="Resources"
            >
              {navItems
                .find((i) => i.children)
                ?.children?.map((child, idx, arr) => (
                  <div key={child.href} className="flex items-center">
                    <Link
                      href={child.href}
                      role="menuitem"
                      style={f}
                      className={[
                        'text-[13px] font-semibold tracking-[0.06em] uppercase transition-colors duration-200 px-7',
                        pathname.startsWith(child.href) ? 'text-white' : 'text-white/50 hover:text-white/90',
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

      {/* ── Mobile full-screen overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col"
            style={{ background: 'rgba(6,6,6,0.97)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 h-[72px] border-b border-white/[0.06] shrink-0">
              <Link href="/shigeru" onClick={() => setMobileOpen(false)}>
                <Image
                  src="https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/Shigeru%20Kawai%20logo.webp"
                  alt="Shigeru Kawai"
                  width={0}
                  height={0}
                  sizes="180px"
                  className="h-[40px] w-auto object-contain"
                />
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-9 h-9 text-white/40 hover:text-white/80 transition-colors"
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
                      transition={{ delay: i * 0.05 + 0.05, duration: 0.26, ease: [0.25, 0.46, 0.45, 0.94] }}
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
                return (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.05, duration: 0.26, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <Link
                      href={href}
                      style={f}
                      className={[
                        'block text-[16px] font-semibold tracking-[0.04em] uppercase transition-colors duration-200',
                        isActive(item) ? 'text-white' : 'text-white/60 hover:text-white',
                      ].join(' ')}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            {/* Bottom CTA */}
            <div className="mt-auto px-8 pb-12 pt-8 shrink-0">
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
