'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { useConfig } from '@payloadcms/ui'
import { createPortal } from 'react-dom'

// ── Design Tokens ─────────────────────────────────────────────────────────
const t = {
  navBg:    '#0A0A0E',
  surface:  '#141420',
  card:     '#191926',
  cardHov:  '#1E1E2C',
  line:     '#1C1C2C',
  lineStr:  '#252535',
  loFaint:  '#2A2A40',
  high:     '#ECECF2',
  mid:      '#8484A0',
  lo:       '#4C4C68',
  violet:   '#6366F1',
  jade:     '#2EC4A0',
  gold:     '#E8A84E',
  pink:     '#EC4899',
  red:      '#C41E3A',
}

const COLLAPSED_W = 68
const EXPANDED_W  = 272

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
const IcoExt     = ({ size }: IP) => <Svg size={size}><path d="M8 4H4V16H16V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 3H17V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="11" y1="9" x2="17" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></Svg>
const IcoShop    = ({ size }: IP) => <Svg size={size}><path d="M6 8.5V6C6 3.79 7.79 2 10 2C12.21 2 14 3.79 14 6V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M3 8.5H17L15.5 18H4.5L3 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></Svg>
const IcoChevR   = ({ size }: IP) => <Svg size={size}><path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></Svg>
const IcoChevL   = ({ size }: IP) => <Svg size={size}><path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></Svg>
const IcoColl    = ({ size }: IP) => <Svg size={size}><rect x="2" y="5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="12" y="5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="13" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="12" y="13" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/><line x1="3" y1="3" x2="17" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></Svg>
/* eslint-enable react/display-name */

// ── Nav data ───────────────────────────────────────────────────────────────
interface NavItem { slug: string; label: string; href: string; Ic: React.FC<IP> }
interface CollGroup { group: string; color: string; items: NavItem[] }

const PRIMARY: NavItem[] = [
  { slug: 'dashboard',   label: 'Dashboard',   href: '/admin',                              Ic: IcoDash  },
  { slug: 'products',    label: 'Products',     href: '/admin/collections/products',         Ic: IcoPiano },
  { slug: 'storefronts', label: 'Storefronts',  href: '/admin/collections/storefronts',      Ic: IcoStore },
  { slug: 'posts',       label: 'Posts',        href: '/admin/collections/posts',            Ic: IcoDoc   },
  { slug: 'dealers',     label: 'Dealers',      href: '/admin/collections/dealers',          Ic: IcoPin   },
]

const ALL_GROUPS: CollGroup[] = [
  { group: 'Commerce',     color: t.violet, items: [
    { slug: 'products',    label: 'Products',    href: '/admin/collections/products',    Ic: IcoPiano },
    { slug: 'collections', label: 'Collections', href: '/admin/collections/collections', Ic: IcoColl  },
  ]},
  { group: 'Content',      color: t.jade,   items: [
    { slug: 'posts',       label: 'Posts',       href: '/admin/collections/posts',      Ic: IcoDoc  },
    { slug: 'pages',       label: 'Pages',       href: '/admin/collections/pages',      Ic: IcoPage },
    { slug: 'artists',     label: 'Artists',     href: '/admin/collections/artists',    Ic: IcoMic  },
    { slug: 'categories',  label: 'Categories',  href: '/admin/collections/categories', Ic: IcoTag  },
  ]},
  { group: 'Business',     color: t.gold,   items: [
    { slug: 'storefronts', label: 'Storefronts', href: '/admin/collections/storefronts', Ic: IcoStore },
    { slug: 'dealers',     label: 'Dealers',     href: '/admin/collections/dealers',     Ic: IcoPin   },
  ]},
  { group: 'Singletons',   color: t.pink,   items: [
    { slug: 'home-page',           label: 'Home Page',      href: '/admin/collections/home-page',           Ic: IcoHome  },
    { slug: 'pianos-page',         label: 'Pianos Page',    href: '/admin/collections/pianos-page',         Ic: IcoMusic },
    { slug: 'concert-artist-page', label: 'Concert Artist', href: '/admin/collections/concert-artist-page', Ic: IcoMic   },
  ]},
  { group: 'System',       color: t.mid,    items: [
    { slug: 'users', label: 'Users', href: '/admin/collections/users', Ic: IcoUser },
    { slug: 'media', label: 'Media', href: '/admin/collections/media', Ic: IcoImg  },
  ]},
  { group: 'Integrations', color: t.lo,     items: [
    { slug: 'search',                         label: 'Search Index',    href: '/admin/collections/search',                         Ic: IcoSearch },
    { slug: 'constant-contact-settings',      label: 'CC Settings',     href: '/admin/collections/constant-contact-settings',      Ic: IcoGear   },
    { slug: 'constant-contact-custom-fields', label: 'CC Custom Fields',href: '/admin/collections/constant-contact-custom-fields', Ic: IcoGear   },
  ]},
]

const FLAT: NavItem[] = ALL_GROUPS.flatMap(g => g.items)

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
      background: '#1A1A28',
      border: `1px solid ${t.loFaint}`,
      color: t.high,
      padding: '6px 12px',
      borderRadius: 8,
      fontSize: 13,
      fontWeight: 500,
      whiteSpace: 'nowrap',
      zIndex: 99999,
      pointerEvents: 'none',
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
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
        height: 48,
        padding: '0 18px',
        borderRadius: 11,
        margin: '2px 6px',
        color: active ? t.high : hov ? t.high : t.mid,
        background: active ? t.cardHov : hov ? t.surface : 'transparent',
        textDecoration: 'none',
        transition: 'color 0.12s, background 0.12s',
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}
    >
      {active && (
        <div style={{
          position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
          width: 3, height: 24, borderRadius: '0 2px 2px 0', background: t.red,
        }} />
      )}
      <item.Ic size={20} />
      {!collapsed && (
        <span style={{ fontSize: 14, fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>
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
    height: 44,
    padding: '0 18px',
    width: 'calc(100% - 12px)',
    margin: '1px 6px',
    borderRadius: 10,
    color: hov ? t.mid : t.lo,
    background: hov ? t.surface : 'transparent',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 13.5,
    fontWeight: 500,
    transition: 'color 0.12s, background 0.12s',
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

// ── Collection Card (in modal) ─────────────────────────────────────────────
function CollCard({ item, color, onClose }: { item: NavItem; color: string; onClose: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <a
      href={item.href}
      onClick={onClose}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '16px 18px', borderRadius: 13,
        background: hov ? t.cardHov : t.card,
        border: `1px solid ${hov ? color + '50' : t.line}`,
        color: t.high, textDecoration: 'none',
        transition: 'background 0.12s, border-color 0.12s',
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 11, flexShrink: 0,
        background: `${color}18`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color,
      }}>
        <item.Ic size={22} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.3 }}>{item.label}</div>
        <div style={{ fontSize: 11, color: t.lo, marginTop: 3, fontFamily: 'ui-monospace, monospace' }}>{item.slug}</div>
      </div>
    </a>
  )
}

// ── Collections Navigator Modal ────────────────────────────────────────────
function CollModal({ open, onClose, recent }: { open: boolean; onClose: () => void; recent: string[] }) {
  const [q, setQ] = useState('')
  const [mounted, setMounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60)
    else setQ('')
  }, [open])
  useEffect(() => {
    if (!open) return
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [open, onClose])

  if (!mounted || !open) return null

  const recentItems = recent
    .map(s => FLAT.find(i => i.slug === s))
    .filter((x): x is NavItem => Boolean(x))

  const lower = q.toLowerCase().trim()
  const groups: CollGroup[] = lower
    ? [{ group: 'Search Results', color: t.violet, items: FLAT.filter(i => i.label.toLowerCase().includes(lower) || i.slug.includes(lower)) }]
    : ALL_GROUPS

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.76)', backdropFilter: 'blur(8px)',
          zIndex: 100000,
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(940px, 94vw)', maxHeight: '86vh',
        background: '#0E0E14',
        border: `1px solid ${t.lineStr}`,
        borderRadius: 20, zIndex: 100001,
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 40px 120px rgba(0,0,0,0.7)',
        overflow: 'hidden',
      }}>
        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '20px 26px', borderBottom: `1px solid ${t.line}`, flexShrink: 0,
        }}>
          <IcoSearch size={18} />
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search all collections…"
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: t.high, fontSize: 17, fontFamily: 'inherit',
            }}
          />
          <button
            onClick={onClose}
            style={{
              background: t.card, border: `1px solid ${t.lineStr}`, color: t.mid,
              borderRadius: 8, padding: '5px 12px', fontSize: 12,
              cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.04em',
            }}
          >esc</button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', padding: '26px 30px', flex: 1 }}>

          {/* Recently Visited */}
          {!lower && recentItems.length > 0 && (
            <section style={{ marginBottom: 36 }}>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: t.lo, marginBottom: 14,
              }}>
                Recently Visited
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {recentItems.map(item => (
                  <a
                    key={item.slug}
                    href={item.href}
                    onClick={onClose}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 9,
                      padding: '10px 18px', background: t.card,
                      border: `1px solid ${t.lineStr}`, borderRadius: 10,
                      color: t.high, textDecoration: 'none',
                      fontSize: 14, fontWeight: 500,
                    }}
                  >
                    <item.Ic size={15} />
                    {item.label}
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Groups */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 34 }}>
            {groups.map(grp => (
              <section key={grp.group}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <div style={{ width: 9, height: 9, borderRadius: 3, background: grp.color, flexShrink: 0 }} />
                  <span style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: t.lo,
                  }}>
                    {grp.group}
                  </span>
                </div>
                {grp.items.length > 0 ? (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: 10,
                  }}>
                    {grp.items.map(item => (
                      <CollCard key={item.slug} item={item} color={grp.color} onClose={onClose} />
                    ))}
                  </div>
                ) : (
                  <div style={{ color: t.lo, fontSize: 14, padding: '8px 0' }}>
                    No matches for "{q}"
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </>,
    document.body,
  )
}

// ── K-badge SVG ────────────────────────────────────────────────────────────
function KBadge({ size = 36 }: { size?: number | undefined }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 9, background: t.red, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width={Math.round(size * 0.53)} height={Math.round(size * 0.53)} viewBox="0 0 20 20" fill="none">
        <rect x="3" y="2" width="3" height="16" rx="1" fill="white" />
        <path d="M6 10 L15 2 L18 2 L9 10" fill="white" />
        <path d="M9 10 L18 18 L15 18 L6 10" fill="white" />
      </svg>
    </div>
  )
}

// ── Main Nav ───────────────────────────────────────────────────────────────
export function CustomNav() {
  const [collapsed, setCollapsed] = useState(true)   // minimized by default
  const [modalOpen, setModalOpen] = useState(false)
  const [recent, setRecent] = useState<string[]>([])
  const [allBtnHov, setAllBtnHov] = useState(false)
  const allBtnRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const { config } = useConfig()
  const siteURL = config.serverURL || 'http://localhost:3000'

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
  //                    html.kawai-expanded { --nav-width: 272px }
  // Payload's .nav CSS uses width: var(--nav-width) and the grid template
  // uses grid-template-columns: var(--nav-width) auto — both respond instantly.
  useEffect(() => {
    document.documentElement.classList.toggle('kawai-expanded', !collapsed)
  }, [collapsed])

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
      <CollModal open={modalOpen} onClose={() => setModalOpen(false)} recent={recent} />

      {/*
       * This div IS the nav content. It lives inside Payload's .nav element
       * (.nav__scroll > .nav__wrap > HERE). The .nav element's width is controlled
       * by --nav-width via custom.scss, so we just fill 100% height.
       */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: t.navBg,
        userSelect: 'none',
      }}>

        {/* ── Header — click to collapse/expand ───────────────────────── */}
        <button
          onClick={toggle}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            display: 'flex', alignItems: 'center',
            height: 60, padding: '0 12px', gap: 10,
            borderBottom: `1px solid ${t.line}`, flexShrink: 0,
            background: 'none', border: 'none', cursor: 'pointer',
            width: '100%', textAlign: 'left',
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
        >
          <KBadge size={34} />
          {!collapsed && (
            <div style={{ minWidth: 0, overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: t.high, letterSpacing: '0.05em', lineHeight: 1.2 }}>KAWAI</div>
              <div style={{ fontSize: 10, color: t.lo, letterSpacing: '0.1em', lineHeight: 1.2 }}>ADMIN PANEL</div>
            </div>
          )}
          {!collapsed && (
            <span style={{ color: t.lo, flexShrink: 0, display: 'flex' }}>
              <IcoChevL size={13} />
            </span>
          )}
        </button>

        {/* ── Primary Nav ─────────────────────────────────────────────── */}
        <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'visible', padding: '10px 0' }}>
          {PRIMARY.map(item => (
            <NavRow key={item.slug} item={item} active={isActive(item)} collapsed={collapsed} />
          ))}
        </nav>

        {/* ── Bottom ──────────────────────────────────────────────────── */}
        <div style={{ borderTop: `1px solid ${t.line}`, padding: '8px 0', flexShrink: 0 }}>

          {/* All Collections CTA */}
          <div style={{ padding: '4px 6px 4px' }}>
            <button
              ref={allBtnRef}
              onClick={() => setModalOpen(true)}
              onMouseEnter={() => setAllBtnHov(true)}
              onMouseLeave={() => setAllBtnHov(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 11,
                width: '100%', height: 46, padding: '0 18px',
                borderRadius: 11,
                border: `1px solid ${allBtnHov ? t.violet : t.lineStr}`,
                background: allBtnHov ? t.cardHov : t.card,
                color: t.high, cursor: 'pointer', fontFamily: 'inherit',
                fontSize: 14, fontWeight: 600,
                transition: 'background 0.12s, border-color 0.12s',
                justifyContent: collapsed ? 'center' : 'flex-start',
                boxSizing: 'border-box',
              }}
            >
              <IcoGrid size={19} />
              {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>All Collections</span>}
            </button>
            <NavTip label="All Collections" show={collapsed && allBtnHov} anchorRef={allBtnRef} />
          </div>

          <BotAction label="View Live Site"  Ic={IcoExt}  collapsed={collapsed} href={siteURL}                    external />
          <BotAction label="Shopify Admin"   Ic={IcoShop} collapsed={collapsed} href="https://admin.shopify.com" external />
        </div>
      </div>
    </>
  )
}
