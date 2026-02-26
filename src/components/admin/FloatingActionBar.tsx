'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useMediaManager } from './media-manager/MediaManagerProvider'

// ── Dark modal tokens (unchanged) ───────────────────────────────────────────
const m = {
  panel:   '#0E0E14',
  card:    '#191926',
  cardHov: '#1E1E2C',
  line:    '#1C1C2C',
  lineStr: '#252535',
  high:    '#ECECF2',
  mid:     '#8484A0',
  lo:      '#4C4C68',
  violet:  '#6366F1',
  jade:    '#2EC4A0',
  gold:    '#E8A84E',
  pink:    '#EC4899',
}

// ── SVG helpers ──────────────────────────────────────────────────────────────
function Svg({ size = 18, children }: { size?: number | undefined; children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true"
      style={{ flexShrink: 0, display: 'block' }}>
      {children}
    </svg>
  )
}
const IcoPiano   = ({ size }: { size?: number | undefined }) => <Svg size={size}><rect x="2" y="9" width="16" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="4.5" y="6" width="2" height="6" rx="0.5" fill="currentColor"/><rect x="8.5" y="6" width="2" height="6" rx="0.5" fill="currentColor"/><rect x="12.5" y="6" width="2" height="6" rx="0.5" fill="currentColor"/><line x1="2" y1="12.5" x2="18" y2="12.5" stroke="currentColor" strokeWidth="1"/></Svg>
const IcoStore   = ({ size }: { size?: number | undefined }) => <Svg size={size}><rect x="2" y="10" width="16" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M1 10L4 3H16L19 10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><rect x="7" y="13" width="6" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/></Svg>
const IcoDoc     = ({ size }: { size?: number | undefined }) => <Svg size={size}><rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><line x1="7" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="7" y1="10.5" x2="13" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="7" y1="14" x2="10.5" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></Svg>
const IcoImg     = ({ size }: { size?: number | undefined }) => <Svg size={size}><rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="7" cy="8.5" r="1.5" fill="currentColor"/><path d="M2 14L7 9L11 13L14 10.5L18 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></Svg>
const IcoPin     = ({ size }: { size?: number | undefined }) => <Svg size={size}><path d="M10 2C7.24 2 5 4.24 5 7C5 10.75 10 17 10 17C10 17 15 10.75 15 7C15 4.24 12.76 2 10 2Z" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="7" r="2" fill="currentColor"/></Svg>
const IcoUser    = ({ size }: { size?: number | undefined }) => <Svg size={size}><circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5"/><path d="M3 18C3 14.686 6.134 12 10 12C13.866 12 17 14.686 17 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></Svg>
const IcoPage    = ({ size }: { size?: number | undefined }) => <Svg size={size}><path d="M5 2H13L17 6V18H5V2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M13 2V6H17" stroke="currentColor" strokeWidth="1.5"/><line x1="7.5" y1="10" x2="14.5" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="7.5" y1="13.5" x2="14.5" y2="13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></Svg>
const IcoMic     = ({ size }: { size?: number | undefined }) => <Svg size={size}><circle cx="9" cy="14" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M12 14V5L18 3V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></Svg>
const IcoTag     = ({ size }: { size?: number | undefined }) => <Svg size={size}><path d="M2 3H9L17 11L11 17L3 9V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="6.5" cy="6.5" r="1.5" fill="currentColor"/></Svg>
const IcoColl    = ({ size }: { size?: number | undefined }) => <Svg size={size}><rect x="2" y="5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="12" y="5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="13" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="12" y="13" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/><line x1="3" y1="3" x2="17" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></Svg>
const IcoSearch  = ({ size }: { size?: number | undefined }) => <Svg size={size}><circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5"/><path d="M13 13L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></Svg>
const IcoGear    = ({ size }: { size?: number | undefined }) => <Svg size={size}><circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10 2V4M10 16V18M2 10H4M16 10H18M3.5 3.5L5 5M15 15L16.5 16.5M3.5 16.5L5 15M15 5L16.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></Svg>
const IcoHome    = ({ size }: { size?: number | undefined }) => <Svg size={size}><path d="M2 9L10 3L18 9V18H13V13H7V18H2V9Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></Svg>
const IcoMusic   = ({ size }: { size?: number | undefined }) => <Svg size={size}><rect x="2" y="6" width="16" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="4.5" y="3" width="2" height="6" rx="0.5" fill="currentColor"/><rect x="9" y="3" width="2" height="6" rx="0.5" fill="currentColor"/><rect x="13.5" y="3" width="2" height="6" rx="0.5" fill="currentColor"/></Svg>
const IcoGrid    = ({ size }: { size?: number | undefined }) => <Svg size={size}><rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></Svg>
const IcoDash    = ({ size }: { size?: number | undefined }) => <Svg size={size}><rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor"/><rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor"/><rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor"/><rect x="11" y="11" width="7" height="7" rx="1.5" fill="currentColor"/></Svg>

// ── Nav data ─────────────────────────────────────────────────────────────────
interface NavItem { slug: string; label: string; href: string; Ic: React.FC<{ size?: number | undefined }> }
interface CollGroup { group: string; color: string; items: NavItem[] }

const ALL_GROUPS: CollGroup[] = [
  { group: 'Commerce', color: m.violet, items: [
    { slug: 'products',    label: 'Products',    href: '/admin/collections/products',    Ic: IcoPiano },
    { slug: 'collections', label: 'Collections', href: '/admin/collections/collections', Ic: IcoColl  },
  ]},
  { group: 'Content', color: m.jade, items: [
    { slug: 'posts',      label: 'Posts',       href: '/admin/collections/posts',      Ic: IcoDoc  },
    { slug: 'pages',      label: 'Pages',       href: '/admin/collections/pages',      Ic: IcoPage },
    { slug: 'artists',    label: 'Artists',     href: '/admin/collections/artists',    Ic: IcoMic  },
    { slug: 'categories', label: 'Categories',  href: '/admin/collections/categories', Ic: IcoTag  },
  ]},
  { group: 'Business', color: m.gold, items: [
    { slug: 'storefronts', label: 'Storefronts', href: '/admin/collections/storefronts', Ic: IcoStore },
    { slug: 'dealers',     label: 'Dealers',     href: '/admin/collections/dealers',     Ic: IcoPin   },
  ]},
  { group: 'Singletons', color: m.pink, items: [
    { slug: 'home-page',           label: 'Home Page',      href: '/admin/collections/home-page',           Ic: IcoHome  },
    { slug: 'pianos-page',         label: 'Pianos Page',    href: '/admin/collections/pianos-page',         Ic: IcoMusic },
    { slug: 'concert-artist-page', label: 'Concert Artist', href: '/admin/collections/concert-artist-page', Ic: IcoMic   },
  ]},
  { group: 'System', color: m.mid, items: [
    { slug: 'users', label: 'Users', href: '/admin/collections/users', Ic: IcoUser },
    { slug: 'media', label: 'Media', href: '/admin/collections/media', Ic: IcoImg  },
  ]},
  { group: 'Integrations', color: m.lo, items: [
    { slug: 'search',                         label: 'Search Index',     href: '/admin/collections/search',                         Ic: IcoSearch },
    { slug: 'constant-contact-settings',      label: 'CC Settings',      href: '/admin/collections/constant-contact-settings',      Ic: IcoGear   },
    { slug: 'constant-contact-custom-fields', label: 'CC Custom Fields', href: '/admin/collections/constant-contact-custom-fields', Ic: IcoGear   },
  ]},
]

const FLAT = ALL_GROUPS.flatMap(g => g.items)

// ── CollCard ─────────────────────────────────────────────────────────────────
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
        background: hov ? m.cardHov : m.card,
        border: `1px solid ${hov ? color + '50' : m.line}`,
        color: m.high, textDecoration: 'none',
        transition: 'background 0.12s, border-color 0.12s',
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 11, flexShrink: 0,
        background: `${color}18`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color,
      }}>
        <item.Ic size={22} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.3 }}>{item.label}</div>
        <div style={{ fontSize: 11, color: m.lo, marginTop: 3, fontFamily: 'ui-monospace, monospace' }}>{item.slug}</div>
      </div>
    </a>
  )
}

// ── Document result type ──────────────────────────────────────────────────────
type DocResult = {
  id: string
  title: string
  excerpt?: string | null
  doc: { relationTo: string; value: string }
}

const DOC_COLORS: Record<string, string> = {
  products: m.violet, pages: m.jade, storefronts: m.gold,
  collections: m.pink, posts: m.jade, artists: m.jade,
}

// ── Collections Modal ────────────────────────────────────────────────────────
function CollModal({ open, onClose, recent }: { open: boolean; onClose: () => void; recent: string[] }) {
  const [q, setQ] = useState('')
  const [mounted, setMounted] = useState(false)
  const [docResults, setDocResults] = useState<DocResult[]>([])
  const [searching, setSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60)
    else { setQ(''); setDocResults([]) }
  }, [open])
  useEffect(() => {
    if (!open) return
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [open, onClose])

  // Debounced document search against the Payload search collection
  useEffect(() => {
    const trimmed = q.trim()
    if (trimmed.length < 2) { setDocResults([]); return }
    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const params = new URLSearchParams({
          'where[or][0][title][like]': trimmed,
          'where[or][1][excerpt][like]': trimmed,
          limit: '12',
          depth: '0',
          sort: '-priority',
        })
        const res = await fetch(`/api/search?${params}`)
        if (res.ok) {
          const data = await res.json() as { docs: DocResult[] }
          setDocResults(data.docs)
        }
      } catch { /* ignore */ }
      setSearching(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [q])

  if (!mounted || !open) return null

  const recentItems = recent
    .map(s => FLAT.find(i => i.slug === s))
    .filter((x): x is NavItem => Boolean(x))

  const lower = q.toLowerCase().trim()
  const navGroups: CollGroup[] = lower
    ? [{ group: 'Collections', color: m.violet, items: FLAT.filter(i => i.label.toLowerCase().includes(lower) || i.slug.includes(lower)) }]
    : ALL_GROUPS

  const hasResults = docResults.length > 0 || navGroups.some(g => g.items.length > 0)

  return createPortal(
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.76)', backdropFilter: 'blur(8px)', zIndex: 100000 }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(940px, 94vw)', maxHeight: '86vh',
        background: m.panel, border: `1px solid ${m.lineStr}`,
        borderRadius: 20, zIndex: 100001,
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 40px 120px rgba(0,0,0,0.7)', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '20px 26px', borderBottom: `1px solid ${m.line}`, flexShrink: 0 }}>
          <IcoSearch size={18} />
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search collections and documents…"
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: m.high, fontSize: 17, fontFamily: 'inherit' }}
          />
          {searching && <span style={{ fontSize: 12, color: m.lo, flexShrink: 0 }}>searching…</span>}
          <button onClick={onClose} style={{ background: m.card, border: `1px solid ${m.lineStr}`, color: m.mid, borderRadius: 8, padding: '5px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>esc</button>
        </div>
        <div style={{ overflowY: 'auto', padding: '26px 30px', flex: 1 }}>
          {/* Document search results from search index */}
          {docResults.length > 0 && (
            <section style={{ marginBottom: 36 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: m.lo, marginBottom: 14 }}>Documents</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {docResults.map(result => {
                  const col = DOC_COLORS[result.doc.relationTo] ?? m.mid
                  return (
                    <a
                      key={result.id}
                      href={`/admin/collections/${result.doc.relationTo}/${result.doc.value}`}
                      onClick={onClose}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '12px 16px', borderRadius: 10,
                        background: m.card, border: `1px solid ${m.line}`,
                        color: m.high, textDecoration: 'none',
                      }}
                    >
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: col, flexShrink: 0 }} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{result.title}</div>
                        {result.excerpt && (
                          <div style={{ fontSize: 12, color: m.lo, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {result.excerpt}
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: m.lo, flexShrink: 0, fontFamily: 'ui-monospace, monospace' }}>
                        {result.doc.relationTo}
                      </div>
                    </a>
                  )
                })}
              </div>
            </section>
          )}

          {/* No results state */}
          {lower && !searching && !hasResults && (
            <div style={{ color: m.lo, fontSize: 14, padding: '8px 0' }}>No results for "{q}"</div>
          )}

          {/* Recently visited (only when not searching) */}
          {!lower && recentItems.length > 0 && (
            <section style={{ marginBottom: 36 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: m.lo, marginBottom: 14 }}>Recently Visited</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {recentItems.map(item => (
                  <a key={item.slug} href={item.href} onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 18px', background: m.card, border: `1px solid ${m.lineStr}`, borderRadius: 10, color: m.high, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
                    <item.Ic size={15} />
                    {item.label}
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Collection nav groups */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 34 }}>
            {navGroups.map(grp => (
              grp.items.length > 0 && (
                <section key={grp.group}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 9, height: 9, borderRadius: 3, background: grp.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: m.lo }}>{grp.group}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
                    {grp.items.map(item => <CollCard key={item.slug} item={item} color={grp.color} onClose={onClose} />)}
                  </div>
                </section>
              )
            ))}
          </div>
        </div>
      </div>
    </>,
    document.body,
  )
}

// ── Floating pill button (white on light style) ──────────────────────────────
function FloatBtn({
  label, icon, onClick, href,
}: {
  label: string
  icon: React.ReactNode
  onClick?: () => void
  href?: string | undefined
}) {
  const [hov, setHov] = useState(false)

  const style: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 9,
    height: 44, padding: '0 18px',
    background: hov ? '#111118' : '#FFFFFF',
    border: `1px solid ${hov ? '#333350' : '#E2E2EE'}`,
    borderRadius: 22,
    boxShadow: hov
      ? '0 8px 24px rgba(0,0,0,0.35)'
      : '0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
    color: hov ? '#FFFFFF' : '#111118',
    cursor: 'pointer',
    fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600,
    letterSpacing: '0.01em',
    transition: 'all 0.14s ease',
    transform: hov ? 'translateY(-2px)' : 'none',
    whiteSpace: 'nowrap',
    outline: 'none',
    textDecoration: 'none',
  }

  const events = {
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
  }

  const inner = (
    <>
      <span style={{ display: 'flex', opacity: hov ? 1 : 0.6, transition: 'opacity 0.14s' }}>
        {icon}
      </span>
      {label}
    </>
  )

  if (href) {
    return <a href={href} style={style} {...events}>{inner}</a>
  }

  return (
    <button onClick={onClick} style={style} {...events}>
      {inner}
    </button>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export function FloatingActionBar() {
  const { openModal } = useMediaManager()
  const [collOpen, setCollOpen] = useState(false)
  const [recent, setRecent] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const rec = localStorage.getItem('kawai-nav-rec')
      if (rec) setRecent(JSON.parse(rec) as string[])
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key !== 'l' && e.key !== 'L') return
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return
      setCollOpen(v => !v)
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [])

  /*
   * Portal the dock directly into document.body.
   *
   * Payload's admin tree contains ancestor elements with CSS `transform` (used
   * for the sidebar animation and nav transitions). Any `position: fixed` child
   * inside a transformed ancestor is positioned relative to that ancestor, not
   * the viewport — causing the dock to appear in the wrong place.
   *
   * createPortal(content, document.body) renders outside Payload's tree
   * entirely, so `position: fixed` is always viewport-relative.
   */
  const dock = (
    <div style={{
      position: 'fixed',
      right: 20,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 9998,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      alignItems: 'flex-end',
    }}>
      <FloatBtn
        label="Dashboard"
        icon={<IcoDash size={16} />}
        href="/admin"
      />
      <FloatBtn
        label="Collections"
        icon={<IcoGrid size={16} />}
        onClick={() => setCollOpen(true)}
      />
      <FloatBtn
        label="Media"
        icon={<IcoImg size={16} />}
        onClick={() => openModal()}
      />
    </div>
  )

  return (
    <>
      {mounted && createPortal(dock, document.body)}
      <CollModal open={collOpen} onClose={() => setCollOpen(false)} recent={recent} />
    </>
  )
}
