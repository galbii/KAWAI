'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { useConfig } from '@payloadcms/ui'
import { createPortal } from 'react-dom'
import { CollectionsModal } from './CollectionsModal'

// ── Design Tokens — glass-optimised ──────────────────────────────────────
// The .nav element's backdrop-filter + rgba background is in custom.scss.
// These tokens control only the interactive surfaces layered on top of it.
const t = {
  navBg:    'transparent',                      // glass applied via CSS on .nav
  surface:  'rgba(255,255,255,0.04)',
  card:     'rgba(255,255,255,0.05)',
  cardHov:  'rgba(255,255,255,0.08)',
  line:     'rgba(255,255,255,0.07)',
  lineStr:  'rgba(255,255,255,0.11)',
  loFaint:  'rgba(99,102,241,0.18)',
  high:     'rgba(255,255,255,0.92)',
  mid:      'rgba(255,255,255,0.46)',
  lo:       'rgba(255,255,255,0.22)',
  violet:   '#6366F1',
  violetGlass: 'rgba(99,102,241,0.14)',
  jade:     '#2EC4A0',
  gold:     '#E8A84E',
  pink:     '#EC4899',
  red:      '#C41E3A',
}

const COLLAPSED_W = 68
const EXPANDED_W  = 320

// ── SVG Icon primitives ────────────────────────────────────────────────────
type IP = { size?: number | undefined }

function Svg({ size = 18, children }: { size?: number | undefined; children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none"
      aria-hidden="true" style={{ flexShrink: 0, display: 'block' }}>
      {children}
    </svg>
  )
}

/* eslint-disable react/display-name */
const IcoDash    = ({ size }: IP) => <Svg size={size}><rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor"/><rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor"/><rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor"/><rect x="11" y="11" width="7" height="7" rx="1.5" fill="currentColor"/></Svg>
const IcoPiano   = ({ size }: IP) => <Svg size={size}><rect x="2" y="9" width="16" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="4.5" y="6" width="2" height="6" rx="0.5" fill="currentColor"/><rect x="8.5" y="6" width="2" height="6" rx="0.5" fill="currentColor"/><rect x="12.5" y="6" width="2" height="6" rx="0.5" fill="currentColor"/><line x1="2" y1="12.5" x2="18" y2="12.5" stroke="currentColor" strokeWidth="1"/></Svg>
const IcoStore   = ({ size }: IP) => <Svg size={size}><rect x="2" y="10" width="16" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M1 10L4 3H16L19 10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><rect x="7" y="13" width="6" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/></Svg>
const IcoDoc     = ({ size }: IP) => <Svg size={size}><rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><line x1="7" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="7" y1="10.5" x2="13" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="7" y1="14" x2="10.5" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></Svg>
const IcoImg     = ({ size }: IP) => <Svg size={size}><rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="7" cy="8.5" r="1.5" fill="currentColor"/><path d="M2 14L7 9L11 13L14 10.5L18 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></Svg>
const IcoPin     = ({ size }: IP) => <Svg size={size}><path d="M10 2C7.24 2 5 4.24 5 7C5 10.75 10 17 10 17C10 17 15 10.75 15 7C15 4.24 12.76 2 10 2Z" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="7" r="2" fill="currentColor"/></Svg>
const IcoUser    = ({ size }: IP) => <Svg size={size}><circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5"/><path d="M3 18C3 14.686 6.134 12 10 12C13.866 12 17 14.686 17 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></Svg>
const IcoPage    = ({ size }: IP) => <Svg size={size}><path d="M5 2H13L17 6V18H5V2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M13 2V6H17" stroke="currentColor" strokeWidth="1.5"/><line x1="7.5" y1="10" x2="14.5" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="7.5" y1="13.5" x2="14.5" y2="13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></Svg>
const IcoMic     = ({ size }: IP) => <Svg size={size}><circle cx="9" cy="14" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M12 14V5L18 3V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></Svg>
const IcoTag     = ({ size }: IP) => <Svg size={size}><path d="M2 3H9L17 11L11 17L3 9V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="6.5" cy="6.5" r="1.5" fill="currentColor"/></Svg>
const IcoGrid    = ({ size }: IP) => <Svg size={size}><rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></Svg>
const IcoSearch  = ({ size }: IP) => <Svg size={size}><circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5"/><path d="M13 13L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></Svg>
const IcoGear    = ({ size }: IP) => <Svg size={size}><circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10 2V4M10 16V18M2 10H4M16 10H18M3.5 3.5L5 5M15 15L16.5 16.5M3.5 16.5L5 15M15 5L16.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></Svg>
const IcoHome    = ({ size }: IP) => <Svg size={size}><path d="M2 9L10 3L18 9V18H13V13H7V18H2V9Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></Svg>
const IcoMusic   = ({ size }: IP) => <Svg size={size}><rect x="2" y="6" width="16" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="4.5" y="3" width="2" height="6" rx="0.5" fill="currentColor"/><rect x="9" y="3" width="2" height="6" rx="0.5" fill="currentColor"/><rect x="13.5" y="3" width="2" height="6" rx="0.5" fill="currentColor"/></Svg>
const IcoFaq     = ({ size }: IP) => <Svg size={size}><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M7.5 7.5C7.5 6.12 8.62 5 10 5C11.38 5 12.5 6.12 12.5 7.5C12.5 8.5 11.92 9.35 11.07 9.76L10 10.75V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="14.5" r="1" fill="currentColor"/></Svg>
const IcoBriefcase = ({ size }: IP) => <Svg size={size}><rect x="3" y="7" width="14" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M7 7V5C7 3.895 7.895 3 9 3H11C12.105 3 13 3.895 13 5V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="3" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="1.2"/></Svg>
const IcoExt     = ({ size }: IP) => <Svg size={size}><path d="M8 4H4V16H16V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 3H17V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="11" y1="9" x2="17" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></Svg>
const IcoShop    = ({ size }: IP) => <Svg size={size}><path d="M6 8.5V6C6 3.79 7.79 2 10 2C12.21 2 14 3.79 14 6V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M3 8.5H17L15.5 18H4.5L3 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></Svg>
const IcoChevR   = ({ size }: IP) => <Svg size={size}><path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></Svg>
const IcoChevL   = ({ size }: IP) => <Svg size={size}><path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></Svg>
const IcoColl    = ({ size }: IP) => <Svg size={size}><rect x="2" y="5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="12" y="5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="13" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="12" y="13" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/><line x1="3" y1="3" x2="17" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></Svg>
/* eslint-enable react/display-name */

// ── Nav data ───────────────────────────────────────────────────────────────
interface NavItem { slug: string; label: string; href: string; Ic: React.FC<IP> }

const PRIMARY: NavItem[] = [
  { slug: 'dashboard',   label: 'Dashboard',   href: '/admin',                              Ic: IcoDash  },
  { slug: 'products',    label: 'Products',     href: '/admin/collections/products',         Ic: IcoPiano },
  { slug: 'storefronts', label: 'Storefronts',  href: '/admin/collections/storefronts',      Ic: IcoStore },
  { slug: 'posts',       label: 'Posts',        href: '/admin/collections/posts',            Ic: IcoDoc   },
  { slug: 'faq-manager', label: 'FAQ Manager',  href: '/admin/faq-manager',                  Ic: IcoFaq   },
  { slug: 'job-manager', label: 'Jobs',         href: '/admin/job-manager',                  Ic: IcoBriefcase },
  { slug: 'dealers',     label: 'Dealers',      href: '/admin/collections/dealers',          Ic: IcoPin   },
]

// ── Fixed-position tooltip (escapes overflow:hidden containers) ───────────
function NavTip({ label, show, anchorRef }: {
  label: string
  show: boolean
  anchorRef: React.RefObject<HTMLElement | null>
}) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)

  useEffect(() => {
    if (show && anchorRef.current) {
      const r = anchorRef.current.getBoundingClientRect()
      setPos({ top: r.top + r.height / 2, left: r.right + 10 })
    } else {
      setPos(null)
    }
  }, [show, anchorRef])

  if (!show || !pos || typeof document === 'undefined') return null

  return createPortal(
    <div style={{
      position: 'fixed',
      top: pos.top,
      left: pos.left,
      transform: 'translateY(-50%)',
      background: 'rgba(14,14,28,0.88)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.10)',
      color: 'rgba(255,255,255,0.88)',
      padding: '6px 13px',
      borderRadius: 8,
      fontSize: 13,
      fontWeight: 500,
      whiteSpace: 'nowrap',
      zIndex: 99999,
      pointerEvents: 'none',
      boxShadow: '0 8px 28px rgba(0,0,0,0.5)',
    }}>
      {label}
    </div>,
    document.body,
  )
}

// ── Nav Row ────────────────────────────────────────────────────────────────
function NavRow({ item, active, collapsed }: { item: NavItem; active: boolean; collapsed: boolean }) {
  const [hov, setHov] = useState(false)
  const ref = useRef<HTMLAnchorElement>(null)

  return (
    <a
      ref={ref}
      href={item.href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        height: 46,
        padding: '0 18px',
        borderRadius: 10,
        margin: '1px 6px',
        color: active ? t.high : hov ? t.high : t.mid,
        // Glass active: violet tint + inset ring. Hover: lighter glass tint.
        background: active
          ? t.violetGlass
          : hov
            ? t.surface
            : 'transparent',
        boxShadow: active
          ? 'inset 0 0 0 1px rgba(99,102,241,0.22)'
          : hov
            ? 'inset 0 0 0 1px rgba(255,255,255,0.06)'
            : 'none',
        textDecoration: 'none',
        transition: 'color 0.14s, background 0.14s, box-shadow 0.14s',
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}
    >
      {/* Active indicator — violet glow bar replacing the old red bar */}
      {active && (
        <div style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 3,
          height: 22,
          borderRadius: '0 3px 3px 0',
          background: 'linear-gradient(180deg, #818CF8 0%, #6366F1 100%)',
          boxShadow: '0 0 10px rgba(99,102,241,0.7)',
        }} />
      )}

      {/* Icon — slightly brighter when active */}
      <span style={{
        display: 'flex',
        color: active ? '#818CF8' : hov ? t.high : t.mid,
        transition: 'color 0.14s',
        flexShrink: 0,
      }}>
        <item.Ic size={20} />
      </span>

      {!collapsed && (
        <span style={{
          fontSize: 14,
          fontWeight: active ? 600 : 400,
          whiteSpace: 'nowrap',
          letterSpacing: active ? '0.01em' : '0',
        }}>
          {item.label}
        </span>
      )}
      <NavTip label={item.label} show={collapsed && hov} anchorRef={ref} />
    </a>
  )
}

// ── Bottom Action ──────────────────────────────────────────────────────────
function BotAction({
  label, Ic, collapsed, onClick, href, external,
}: {
  label: string
  Ic: React.FC<IP>
  collapsed: boolean
  onClick?: (() => void) | undefined
  href?: string | undefined
  external?: boolean | undefined
}) {
  const [hov, setHov] = useState(false)
  const ref = useRef<HTMLElement>(null)

  const base: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: 11,
    height: 40,
    padding: '0 18px',
    width: 'calc(100% - 12px)',
    margin: '1px 6px',
    borderRadius: 9,
    color: hov ? 'rgba(255,255,255,0.38)' : 'rgba(255,255,255,0.18)',
    background: hov ? 'rgba(255,255,255,0.04)' : 'transparent',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 13,
    fontWeight: 400,
    transition: 'color 0.14s, background 0.14s',
    justifyContent: collapsed ? 'center' : 'flex-start',
    boxSizing: 'border-box',
  }

  const events = {
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
  }

  const tip = <NavTip label={label} show={collapsed && hov} anchorRef={ref} />

  const inner = (
    <>
      <Ic size={17} />
      {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
      {tip}
    </>
  )

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        style={base}
        {...events}
      >
        {inner}
      </a>
    )
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      style={base}
      {...events}
    >
      {inner}
    </button>
  )
}

// ── Piano logo badge ───────────────────────────────────────────────────────
// Uses the circular KAWAI piano icon from /public/
const PIANO_LOGO_SRC = '/ChatGPT%20Image%20Sep%209%2C%202025%2C%2003_13_02%20PM%20copy%202.png'

function PianoLogo({ size = 36 }: { size?: number | undefined }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      overflow: 'hidden', background: 'white',
      boxShadow: '0 0 0 1.5px rgba(196,30,58,0.35), 0 2px 8px rgba(0,0,0,0.4)',
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={PIANO_LOGO_SRC}
        alt="Kawai"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  )
}

// ── Main Nav ───────────────────────────────────────────────────────────────
export function CustomNav() {
  const [collapsed, setCollapsed] = useState(true)   // user-persisted state
  const [hovExpanded, setHovExpanded] = useState(false) // temporary hover state
  const [modalOpen, setModalOpen] = useState(false)
  const [recent, setRecent] = useState<string[]>([])
  const [allBtnHov, setAllBtnHov] = useState(false)
  const allBtnRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const { config } = useConfig()
  const siteURL = config.serverURL || 'http://localhost:3000'

  // isExpanded = user pinned open OR hovered while collapsed
  const isExpanded = !collapsed || hovExpanded

  // ── Restore persisted state ────────────────────────────────────────────
  useEffect(() => {
    try {
      const col = localStorage.getItem('kawai-nav-col')
      if (col !== null) setCollapsed(JSON.parse(col) as boolean)
      const rec = localStorage.getItem('kawai-nav-rec')
      if (rec) setRecent(JSON.parse(rec) as string[])
    } catch { /* ignore */ }
  }, [])

  // ── Track recently visited collections ────────────────────────────────
  useEffect(() => {
    const m = pathname?.match(/\/admin\/collections\/([^/]+)/)
    const slug = m?.[1]
    if (!slug) return
    setRecent(prev => {
      const next = [slug, ...prev.filter(s => s !== slug)].slice(0, 10)
      try { localStorage.setItem('kawai-nav-rec', JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }, [pathname])

  // ── Width management via CSS class on <html> ──────────────────────────
  // custom.scss reads:  :root { --nav-width: 68px }
  //                    html.kawai-expanded { --nav-width: 320px }
  // Both Payload's .nav width and the grid-template-columns respond instantly.
  // isExpanded = user pinned || hover-over-while-collapsed
  useEffect(() => {
    document.documentElement.classList.toggle('kawai-expanded', isExpanded)
  }, [isExpanded])

  const toggle = useCallback(() => {
    setCollapsed(p => {
      const n = !p
      try { localStorage.setItem('kawai-nav-col', JSON.stringify(n)) } catch { /* ignore */ }
      return n
    })
  }, [])

  const isActive = (item: NavItem) =>
    item.slug === 'dashboard'
      ? pathname === '/admin'
      : Boolean(pathname?.startsWith(item.href))

  return (
    <>
      <CollectionsModal open={modalOpen} onClose={() => setModalOpen(false)} recent={recent} />

      {/*
       * WHY position:fixed here (not in CSS):
       *
       * When admin.components.Nav is set to a custom component, Payload's
       * DefaultNav — and its NavWrapper (<aside class="nav">) — are skipped
       * entirely. Our component renders as a direct child of .template-default,
       * a normal CSS Grid item. Any CSS rules targeting ".nav" have no effect.
       *
       * Setting position:fixed here, directly on the root div, is the only
       * reliable way to pin the sidebar to the viewport. The grid column
       * (var(--nav-width)) still allocates space, keeping the content area
       * correctly indented even though the sidebar is out of flow.
       *
       * Width tracks the CSS variable --nav-width (toggled by .kawai-expanded
       * on <html>), so expand/collapse transitions work via CSS variable change.
       *
       * The transform:none on .template-default in custom.scss prevents the
       * parent grid wrapper from creating a new fixed-positioning containing
       * block (which would make position:fixed scroll with the page).
       */}
      <div
        onMouseEnter={() => { if (collapsed) setHovExpanded(true) }}
        onMouseLeave={() => setHovExpanded(false)}
        style={{
          // ── Viewport anchor ──────────────────────────────────────────
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100dvh',
          width: 'var(--nav-width)',
          zIndex: 20,
          overflow: 'hidden',
          transition: 'width var(--kawai-nav-trans, 0.28s cubic-bezier(0.4,0,0.2,1))',

          // ── Flex column (header | scrollable nav | bottom) ───────────
          display: 'flex',
          flexDirection: 'column',

          // ── Glassmorphism surface ─────────────────────────────────────
          background: 'rgba(6, 6, 18, 0.80)',
          backdropFilter: 'blur(32px) saturate(170%)',
          WebkitBackdropFilter: 'blur(32px) saturate(170%)',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          boxShadow: 'inset -1px 0 0 rgba(99,102,241,0.14), 6px 0 40px rgba(0,0,0,0.6)',

          userSelect: 'none',
        }}
      >

        {/* ── Header ──────────────────────────────────────────────────── */}
        <button
          onClick={toggle}
          title={collapsed ? 'Pin sidebar open' : 'Collapse sidebar'}
          style={{
            display: 'flex', alignItems: 'center',
            height: 62, padding: '0 14px', gap: 11,
            flexShrink: 0,
            border: 'none',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            // Slightly elevated glass surface for the header
            background: 'rgba(255,255,255,0.03)',
            cursor: 'pointer',
            width: '100%', textAlign: 'left',
            justifyContent: !isExpanded ? 'center' : 'flex-start',
          }}
        >
          <PianoLogo size={34} />
          {isExpanded && (
            <div style={{ minWidth: 0, overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.high, letterSpacing: '0.06em', lineHeight: 1.2 }}>KAWAI</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.12em', lineHeight: 1.4, textTransform: 'uppercase' }}>Admin Panel</div>
            </div>
          )}
          {isExpanded && (
            <span style={{
              color: collapsed ? 'rgba(99,102,241,0.7)' : 'rgba(255,255,255,0.2)',
              flexShrink: 0, display: 'flex',
              transition: 'color 0.14s',
            }}>
              <IcoChevL size={13} />
            </span>
          )}
        </button>

        {/* ── Primary Nav — scrollable zone ───────────────────────────── */}
        <nav
          className="kawai-nav-scroll"
          style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', padding: '10px 0' }}
        >
          {PRIMARY.map(item => (
            <NavRow key={item.slug} item={item} active={isActive(item)} collapsed={!isExpanded} />
          ))}
        </nav>

        {/* ── Bottom — pinned to base of viewport ─────────────────────── */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.07)',
          padding: '8px 0 10px',
          flexShrink: 0,
          // Slightly denser glass at the bottom for visual anchoring
          background: 'rgba(0,0,0,0.12)',
        }}>

          {/* All Collections — primary glass CTA */}
          <div style={{ padding: '4px 6px 6px' }}>
            <button
              ref={allBtnRef}
              onClick={() => setModalOpen(true)}
              onMouseEnter={() => setAllBtnHov(true)}
              onMouseLeave={() => setAllBtnHov(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 11,
                width: '100%', height: 44, padding: '0 18px',
                borderRadius: 10,
                border: `1px solid ${allBtnHov ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.09)'}`,
                background: allBtnHov ? 'rgba(99,102,241,0.14)' : 'rgba(255,255,255,0.04)',
                color: allBtnHov ? t.high : 'rgba(255,255,255,0.60)',
                cursor: 'pointer', fontFamily: 'inherit',
                fontSize: 13.5, fontWeight: 600,
                transition: 'background 0.14s, border-color 0.14s, color 0.14s',
                justifyContent: !isExpanded ? 'center' : 'flex-start',
                boxSizing: 'border-box',
                boxShadow: allBtnHov ? 'inset 0 0 0 1px rgba(99,102,241,0.22)' : 'none',
              }}
            >
              <span style={{ color: allBtnHov ? '#818CF8' : 'rgba(255,255,255,0.35)', display: 'flex', transition: 'color 0.14s' }}>
                <IcoGrid size={18} />
              </span>
              {isExpanded && <span style={{ whiteSpace: 'nowrap' }}>All Collections</span>}
            </button>
            <NavTip label="All Collections" show={!isExpanded && allBtnHov} anchorRef={allBtnRef} />
          </div>

          {/* External links — visually dimmed to signal they leave the CMS */}
          <BotAction label="View Live Site"  Ic={IcoExt}  collapsed={!isExpanded} href={siteURL}                    external />
          <BotAction label="Shopify Admin"   Ic={IcoShop} collapsed={!isExpanded} href="https://admin.shopify.com" external />
        </div>
      </div>
    </>
  )
}
