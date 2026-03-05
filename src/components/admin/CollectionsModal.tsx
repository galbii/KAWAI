'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useConfig } from '@payloadcms/ui'

// ── Design tokens ────────────────────────────────────────────────────────────
export const t = {
  panel:   '#0E0E14',
  card:    '#191926',
  cardHov: '#1E1E2C',
  line:    '#1C1C2C',
  lineStr: '#252535',
  loFaint: '#2A2A40',
  high:    '#ECECF2',
  mid:     '#8484A0',
  lo:      '#4C4C68',
  violet:  '#6366F1',
  jade:    '#2EC4A0',
  gold:    '#E8A84E',
  pink:    '#EC4899',
}

// ── Icon primitives ──────────────────────────────────────────────────────────
function S({ size, ch }: { size?: number | undefined; ch: React.ReactNode }) {
  const sz = size ?? 18
  return (
    <svg width={sz} height={sz} viewBox="0 0 20 20" fill="none" aria-hidden="true"
      style={{ flexShrink: 0, display: 'block' }}>
      {ch}
    </svg>
  )
}

export const IcoPiano  = (p: { size?: number }) => <S size={p.size} ch={<><rect x="2" y="9" width="16" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="4.5" y="6" width="2" height="6" rx="0.5" fill="currentColor"/><rect x="8.5" y="6" width="2" height="6" rx="0.5" fill="currentColor"/><rect x="12.5" y="6" width="2" height="6" rx="0.5" fill="currentColor"/><line x1="2" y1="12.5" x2="18" y2="12.5" stroke="currentColor" strokeWidth="1"/></>} />
export const IcoStore  = (p: { size?: number }) => <S size={p.size} ch={<><rect x="2" y="10" width="16" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M1 10L4 3H16L19 10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><rect x="7" y="13" width="6" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/></>} />
export const IcoDoc    = (p: { size?: number }) => <S size={p.size} ch={<><rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><line x1="7" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="7" y1="10.5" x2="13" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="7" y1="14" x2="10.5" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />
export const IcoImg    = (p: { size?: number }) => <S size={p.size} ch={<><rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="7" cy="8.5" r="1.5" fill="currentColor"/><path d="M2 14L7 9L11 13L14 10.5L18 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>} />
export const IcoPin    = (p: { size?: number }) => <S size={p.size} ch={<><path d="M10 2C7.24 2 5 4.24 5 7C5 10.75 10 17 10 17C10 17 15 10.75 15 7C15 4.24 12.76 2 10 2Z" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="7" r="2" fill="currentColor"/></>} />
export const IcoUser   = (p: { size?: number }) => <S size={p.size} ch={<><circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5"/><path d="M3 18C3 14.686 6.134 12 10 12C13.866 12 17 14.686 17 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />
export const IcoPage   = (p: { size?: number }) => <S size={p.size} ch={<><path d="M5 2H13L17 6V18H5V2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M13 2V6H17" stroke="currentColor" strokeWidth="1.5"/><line x1="7.5" y1="10" x2="14.5" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="7.5" y1="13.5" x2="14.5" y2="13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />
export const IcoMic    = (p: { size?: number }) => <S size={p.size} ch={<><circle cx="9" cy="14" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M12 14V5L18 3V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />
export const IcoTag    = (p: { size?: number }) => <S size={p.size} ch={<><path d="M2 3H9L17 11L11 17L3 9V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="6.5" cy="6.5" r="1.5" fill="currentColor"/></>} />
export const IcoColl   = (p: { size?: number }) => <S size={p.size} ch={<><rect x="2" y="5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="12" y="5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="13" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="12" y="13" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/><line x1="3" y1="3" x2="17" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />
export const IcoSearch = (p: { size?: number }) => <S size={p.size} ch={<><circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5"/><path d="M13 13L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />
export const IcoGear   = (p: { size?: number }) => <S size={p.size} ch={<><circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10 2V4M10 16V18M2 10H4M16 10H18M3.5 3.5L5 5M15 15L16.5 16.5M3.5 16.5L5 15M15 5L16.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />
export const IcoHome   = (p: { size?: number }) => <S size={p.size} ch={<><path d="M2 9L10 3L18 9V18H13V13H7V18H2V9Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></>} />
export const IcoMusic  = (p: { size?: number }) => <S size={p.size} ch={<><rect x="2" y="6" width="16" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="4.5" y="3" width="2" height="6" rx="0.5" fill="currentColor"/><rect x="9" y="3" width="2" height="6" rx="0.5" fill="currentColor"/><rect x="13.5" y="3" width="2" height="6" rx="0.5" fill="currentColor"/></>} />
export const IcoFaq    = (p: { size?: number }) => <S size={p.size} ch={<><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M7.5 7.5C7.5 6.12 8.62 5 10 5C11.38 5 12.5 6.12 12.5 7.5C12.5 8.5 11.92 9.35 11.07 9.76L10 10.75V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="14.5" r="1" fill="currentColor"/></>} />
export const IcoGrid   = (p: { size?: number }) => <S size={p.size} ch={<><rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></>} />
export const IcoChevR  = (p: { size?: number }) => <S size={p.size} ch={<path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>} />

type IconFC = (p: { size?: number }) => React.ReactElement

// ── Slug → icon mapping (add new collections here) ───────────────────────────
const ICON_MAP: Record<string, IconFC> = {
  products:                        IcoPiano,
  collections:                     IcoColl,
  posts:                           IcoDoc,
  pages:                           IcoPage,
  artists:                         IcoMic,
  categories:                      IcoTag,
  faqs:                            IcoFaq,
  'faq-categories':                IcoTag,
  'support-groups':                IcoTag,
  storefronts:                     IcoStore,
  dealers:                         IcoPin,
  'home-page':                     IcoHome,
  'pianos-page':                   IcoMusic,
  'concert-artist-page':           IcoMic,
  users:                           IcoUser,
  media:                           IcoImg,
  search:                          IcoSearch,
  'constant-contact-settings':     IcoGear,
  'constant-contact-custom-fields':IcoGear,
}

// ── Group → accent color ─────────────────────────────────────────────────────
const GROUP_COLORS: Record<string, string> = {
  Commerce:       t.violet,
  Content:        t.jade,
  Business:       t.gold,
  Singletons:     t.pink,
  Pages:          t.pink,
  System:         t.mid,
  Administration: t.mid,
  Integrations:   t.lo,
}

// ── Types ────────────────────────────────────────────────────────────────────
export interface NavItem {
  slug: string
  label: string
  href: string
  Ic: IconFC
}

interface CollGroup {
  group: string
  color: string
  items: NavItem[]
}

type DocResult = {
  id: string
  title: string
  excerpt?: string | null
  doc: { relationTo: string; value: string }
}

const DOC_COLORS: Record<string, string> = {
  products: t.violet, pages: t.jade, storefronts: t.gold,
  collections: t.pink, posts: t.jade, artists: t.jade,
}

// ── Build groups dynamically from Payload client config ──────────────────────
function useCollectionGroups(): { groups: CollGroup[]; flat: NavItem[]; total: number } {
  const { config } = useConfig()

  const groups: CollGroup[] = []
  const groupMap = new Map<string, NavItem[]>()

  for (const col of config.collections) {
    const groupName = (typeof col.admin?.group === 'string' ? col.admin.group : null) ?? 'Other'
    const label = typeof col.labels?.plural === 'string' ? col.labels.plural : col.slug
    const Ic = ICON_MAP[col.slug] ?? IcoDoc

    const item: NavItem = {
      slug: col.slug,
      label,
      href: `/admin/collections/${col.slug}`,
      Ic,
    }

    if (!groupMap.has(groupName)) groupMap.set(groupName, [])
    groupMap.get(groupName)!.push(item)
  }

  // Preferred group order
  const ORDER = ['Commerce', 'Content', 'Business', 'Singletons', 'Pages', 'System', 'Administration', 'Integrations']
  const sorted = [...groupMap.keys()].sort((a, b) => {
    const ai = ORDER.indexOf(a)
    const bi = ORDER.indexOf(b)
    if (ai === -1 && bi === -1) return a.localeCompare(b)
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })

  for (const name of sorted) {
    groups.push({
      group: name,
      color: GROUP_COLORS[name] ?? t.mid,
      items: groupMap.get(name)!,
    })
  }

  const flat = groups.flatMap(g => g.items)
  return { groups, flat, total: flat.length }
}

// ── Collection card ──────────────────────────────────────────────────────────
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
        display: 'flex', alignItems: 'center', justifyContent: 'center', color,
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

// ── Main modal ───────────────────────────────────────────────────────────────
interface CollectionsModalProps {
  open: boolean
  onClose: () => void
  recent?: string[]
}

export function CollectionsModal({ open, onClose, recent = [] }: CollectionsModalProps) {
  const { groups, flat, total } = useCollectionGroups()
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

  // Debounced document search
  useEffect(() => {
    const trimmed = q.trim()
    if (trimmed.length < 2) { setDocResults([]); return }
    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const params = new URLSearchParams({
          'where[or][0][title][like]': trimmed,
          'where[or][1][excerpt][like]': trimmed,
          limit: '12', depth: '0', sort: '-priority',
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
    .map(s => flat.find(i => i.slug === s))
    .filter((x): x is NavItem => Boolean(x))

  const lower = q.toLowerCase().trim()
  const navGroups: CollGroup[] = lower
    ? [{ group: 'Collections', color: t.violet, items: flat.filter(i => i.label.toLowerCase().includes(lower) || i.slug.includes(lower)) }]
    : groups

  return createPortal(
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.76)', backdropFilter: 'blur(8px)', zIndex: 100000,
      }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(940px, 94vw)', maxHeight: '86vh',
        background: t.panel, border: `1px solid ${t.lineStr}`,
        borderRadius: 20, zIndex: 100001,
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 40px 120px rgba(0,0,0,0.7)', overflow: 'hidden',
      }}>
        {/* Search bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '20px 26px', borderBottom: `1px solid ${t.line}`, flexShrink: 0,
        }}>
          <IcoSearch size={18} />
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search collections and documents…"
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: t.high, fontSize: 17, fontFamily: 'inherit' }}
          />
          {searching && <span style={{ fontSize: 12, color: t.lo, flexShrink: 0 }}>searching…</span>}
          <button onClick={onClose} style={{
            background: t.card, border: `1px solid ${t.lineStr}`, color: t.mid,
            borderRadius: 8, padding: '5px 12px', fontSize: 12,
            cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.04em',
          }}>esc</button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', padding: '26px 30px', flex: 1 }}>
          {/* Document search results */}
          {docResults.length > 0 && (
            <section style={{ marginBottom: 36 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: t.lo, marginBottom: 14 }}>
                Documents
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {docResults.map(result => {
                  const col = DOC_COLORS[result.doc.relationTo] ?? t.mid
                  return (
                    <a key={result.id}
                      href={`/admin/collections/${result.doc.relationTo}/${result.doc.value}`}
                      onClick={onClose}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '12px 16px', borderRadius: 10,
                        background: t.card, border: `1px solid ${t.line}`,
                        color: t.high, textDecoration: 'none',
                      }}
                    >
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: col, flexShrink: 0 }} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{result.title}</div>
                        {result.excerpt && (
                          <div style={{ fontSize: 12, color: t.lo, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {result.excerpt}
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: t.lo, flexShrink: 0, fontFamily: 'ui-monospace, monospace' }}>
                        {result.doc.relationTo}
                      </div>
                    </a>
                  )
                })}
              </div>
            </section>
          )}

          {/* No results */}
          {lower && !searching && docResults.length === 0 && navGroups.every(g => g.items.length === 0) && (
            <div style={{ color: t.lo, fontSize: 14, padding: '8px 0' }}>No results for "{q}"</div>
          )}

          {/* Recently visited */}
          {!lower && recentItems.length > 0 && (
            <section style={{ marginBottom: 36 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: t.lo, marginBottom: 14 }}>
                Recently Visited
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {recentItems.map(item => (
                  <a key={item.slug} href={item.href} onClick={onClose} style={{
                    display: 'flex', alignItems: 'center', gap: 9,
                    padding: '10px 18px', background: t.card,
                    border: `1px solid ${t.lineStr}`, borderRadius: 10,
                    color: t.high, textDecoration: 'none', fontSize: 14, fontWeight: 500,
                  }}>
                    <item.Ic size={15} />
                    {item.label}
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Collection groups */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 34 }}>
            {navGroups.map(grp => grp.items.length > 0 && (
              <section key={grp.group}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <div style={{ width: 9, height: 9, borderRadius: 3, background: grp.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: t.lo }}>
                    {grp.group}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
                  {grp.items.map(item => (
                    <CollCard key={item.slug} item={item} color={grp.color} onClose={onClose} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 30px', borderTop: `1px solid ${t.line}`, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 12, color: t.lo }}>{total} collections</span>
          <span style={{ fontSize: 12, color: t.lo }}>
            <kbd style={{ fontFamily: 'inherit', background: t.card, border: `1px solid ${t.lineStr}`, borderRadius: 4, padding: '2px 6px' }}>esc</kbd> to close
          </span>
        </div>
      </div>
    </>,
    document.body,
  )
}

// ── Export total count hook for button label ─────────────────────────────────
export function useCollectionTotal(): number {
  return useCollectionGroups().total
}
