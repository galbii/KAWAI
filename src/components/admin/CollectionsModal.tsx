'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useConfig } from '@payloadcms/ui'

// ── Design tokens ────────────────────────────────────────────────────────────
export const t = {
  panel:   '#0E0E14',
  card:    '#191926',
  cardHov: '#1E1E2C',
  cardSel: '#20203A',
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
export const IcoEdit   = (p: { size?: number }) => <S size={p.size} ch={<><path d="M14 3L17 6L8 15H5V12L14 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><line x1="3" y1="18" x2="17" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />

type IconFC = (p: { size?: number }) => React.ReactElement

// ── Slug → icon mapping ──────────────────────────────────────────────────────
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

// ── Collection type → accent color ───────────────────────────────────────────
const DOC_COLORS: Record<string, string> = {
  products:    t.violet,
  collections: t.violet,
  storefronts: t.gold,
  artists:     t.jade,
  pages:       t.pink,
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
  category?: string | null
  doc: {
    relationTo: string
    value: string | { id: string; [key: string]: unknown } | null
  }
  // product fields
  productModel?: string | null
  productImageUrl?: string | null
  productType?: string | null
  productCategory?: string | null
  productSlug?: string | null
  // page fields
  pageSlug?: string | null
  // storefront fields
  storefrontSlug?: string | null
  storefrontLocationName?: string | null
  storefrontLocationText?: string | null
  storefrontCity?: string | null
  storefrontRegion?: string | null
  storefrontAddress?: string | null
  storefrontPhone?: string | null
  // collection fields
  collectionHandle?: string | null
  collectionTitle?: string | null
  // artist fields
  artistSlug?: string | null
  artistImageUrl?: string | null
  artistGenre?: string | null
  artistInstrument?: string | null
  artistShortBio?: string | null
}

// Extract ID from polymorphic value — may be a bare string or a populated document object
function getDocId(value: string | { id: string; [key: string]: unknown } | null | undefined): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  return String(value.id ?? '')
}

// Build the admin edit URL for a document result
function adminHref(result: DocResult): string {
  const id = getDocId(result.doc?.value)
  return `/admin/collections/${result.doc?.relationTo}/${id}`
}

// ── Subtitle logic per collection type ───────────────────────────────────────
function getSubtitle(result: DocResult): string | null {
  const type = result.doc?.relationTo
  if (type === 'products') {
    const parts = [result.productType, result.productCategory].filter(Boolean)
    return parts.length ? parts.join(' · ') : result.excerpt ?? null
  }
  if (type === 'storefronts') {
    const loc = [result.storefrontCity, result.storefrontRegion].filter(Boolean).join(', ')
    return loc || result.storefrontAddress || (result.excerpt ?? null)
  }
  if (type === 'artists') {
    return [result.artistGenre, result.artistInstrument].filter(Boolean).join(' · ') || (result.excerpt ?? null)
  }
  if (type === 'collections') {
    return result.collectionHandle ? `/${result.collectionHandle}` : result.excerpt ?? null
  }
  return result.excerpt ?? null
}

// ── Build groups from Payload config ─────────────────────────────────────────
function useCollectionGroups(): { groups: CollGroup[]; flat: NavItem[]; total: number } {
  const { config } = useConfig()

  const groups: CollGroup[] = []
  const groupMap = new Map<string, NavItem[]>()

  for (const col of config.collections) {
    const groupName = (typeof col.admin?.group === 'string' ? col.admin.group : null) ?? 'Other'
    const label = typeof col.labels?.plural === 'string' ? col.labels.plural : col.slug
    const Ic = ICON_MAP[col.slug] ?? IcoDoc

    const item: NavItem = { slug: col.slug, label, href: `/admin/collections/${col.slug}`, Ic }
    if (!groupMap.has(groupName)) groupMap.set(groupName, [])
    groupMap.get(groupName)!.push(item)
  }

  const ORDER = ['Commerce', 'Content', 'Business', 'Singletons', 'Pages', 'System', 'Administration', 'Integrations']
  const sorted = [...groupMap.keys()].sort((a, b) => {
    const ai = ORDER.indexOf(a), bi = ORDER.indexOf(b)
    if (ai === -1 && bi === -1) return a.localeCompare(b)
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })

  for (const name of sorted) {
    groups.push({ group: name, color: GROUP_COLORS[name] ?? t.mid, items: groupMap.get(name)! })
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

// ── Document result card ─────────────────────────────────────────────────────
function DocResultCard({
  result,
  selected,
  onClose,
  elRef,
}: {
  result: DocResult
  selected: boolean
  onClose: () => void
  elRef?: React.Ref<HTMLAnchorElement> | undefined
}) {
  const [hov, setHov] = useState(false)
  const collectionType = result.doc?.relationTo ?? 'unknown'
  const color = DOC_COLORS[collectionType] ?? t.mid
  const subtitle = getSubtitle(result)
  const imageUrl = result.productImageUrl ?? result.artistImageUrl ?? null
  const href = adminHref(result)

  const labelMap: Record<string, string> = {
    products:    'Product',
    storefronts: 'Storefront',
    artists:     'Artist',
    pages:       'Page',
    collections: 'Collection',
  }
  const typeLabel = labelMap[collectionType] ?? collectionType

  const active = selected || hov

  return (
    <a
      ref={elRef}
      href={href}
      onClick={onClose}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '12px 16px', borderRadius: 12,
        background: selected ? t.cardSel : hov ? t.cardHov : t.card,
        border: `1px solid ${selected ? color + '60' : active ? color + '35' : t.line}`,
        color: t.high, textDecoration: 'none',
        transition: 'background 0.1s, border-color 0.1s',
        outline: 'none',
      }}
    >
      {/* Thumbnail or icon fallback */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          style={{
            width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0,
            border: `1px solid ${t.lineStr}`,
          }}
        />
      ) : (
        <div style={{
          width: 44, height: 44, borderRadius: 10, flexShrink: 0,
          background: `${color}14`, border: `1px solid ${color}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color,
        }}>
          {ICON_MAP[collectionType] ? (
            (() => { const Ic = ICON_MAP[collectionType]!; return <Ic size={20} /> })()
          ) : (
            <IcoDoc size={20} />
          )}
        </div>
      )}

      {/* Text */}
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3, color: t.high }}>
          {result.title}
        </div>
        {subtitle && (
          <div style={{
            fontSize: 12, color: t.mid, marginTop: 3,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {subtitle}
          </div>
        )}
      </div>

      {/* Type badge + edit hint */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
          color, background: `${color}18`, border: `1px solid ${color}30`,
          borderRadius: 5, padding: '3px 8px',
        }}>
          {typeLabel}
        </span>
        {selected && (
          <span style={{
            fontSize: 10, color: t.lo,
            background: t.loFaint, borderRadius: 4, padding: '2px 6px',
            fontFamily: 'inherit', border: `1px solid ${t.lineStr}`,
          }}>
            ↵ edit
          </span>
        )}
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
  const [selectedIdx, setSelectedIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const selectedRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => { setMounted(true) }, [])

  // Focus input on open; clear state on close
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQ('')
      setDocResults([])
      setSelectedIdx(-1)
    }
  }, [open])

  // Reset selection when results change
  useEffect(() => { setSelectedIdx(-1) }, [q])

  // Scroll selected result into view
  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [selectedIdx])

  // Keyboard: Esc, ArrowDown, ArrowUp, Enter
  useEffect(() => {
    if (!open) return
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (docResults.length > 0) {
          setSelectedIdx(prev => Math.min(prev + 1, docResults.length - 1))
        }
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIdx(prev => {
          if (prev <= 0) {
            inputRef.current?.focus()
            return -1
          }
          return prev - 1
        })
        return
      }

      if (e.key === 'Enter' && selectedIdx >= 0) {
        const result = docResults[selectedIdx]
        if (result) {
          window.location.href = adminHref(result)
          onClose()
        }
      }
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [open, onClose, selectedIdx, docResults])

  // Debounced document search using the rich /api/search endpoint
  useEffect(() => {
    const trimmed = q.trim()
    if (trimmed.length < 2) { setDocResults([]); setSelectedIdx(-1); return }
    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}&limit=15`)
        if (res.ok) {
          const data = await res.json() as { results: DocResult[]; totalDocs: number }
          setDocResults(data.results ?? [])
        }
      } catch { /* ignore */ }
      setSearching(false)
    }, 250)
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

  const hasDocResults = docResults.length > 0
  const noResults = lower.length >= 2 && !searching && !hasDocResults && navGroups.every(g => g.items.length === 0)

  return createPortal(
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.76)', backdropFilter: 'blur(8px)', zIndex: 100000,
      }} />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(960px, 94vw)', maxHeight: '88vh',
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
          <span style={{ color: t.lo, flexShrink: 0 }}><IcoSearch size={18} /></span>
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search collections and documents…"
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: t.high, fontSize: 17, fontFamily: 'inherit',
            }}
          />
          {searching && (
            <span style={{ fontSize: 12, color: t.lo, flexShrink: 0 }}>searching…</span>
          )}
          <button onClick={onClose} style={{
            background: t.card, border: `1px solid ${t.lineStr}`, color: t.mid,
            borderRadius: 8, padding: '5px 12px', fontSize: 12,
            cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.04em',
          }}>esc</button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', padding: '24px 28px', flex: 1 }}>

          {/* Document results */}
          {hasDocResults && (
            <section style={{ marginBottom: 32 }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 14,
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: t.lo,
                }}>
                  Documents
                </div>
                <div style={{ fontSize: 11, color: t.lo }}>
                  {docResults.length} result{docResults.length !== 1 ? 's' : ''}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {docResults.map((result, i) => (
                  <DocResultCard
                    key={result.id}
                    result={result}
                    selected={i === selectedIdx}
                    onClose={onClose}
                    elRef={i === selectedIdx ? selectedRef : undefined}
                  />
                ))}
              </div>
            </section>
          )}

          {/* No results */}
          {noResults && (
            <div style={{ color: t.lo, fontSize: 14, padding: '8px 0' }}>
              No results for &ldquo;{q}&rdquo;
            </div>
          )}

          {/* Recently visited */}
          {!lower && recentItems.length > 0 && (
            <section style={{ marginBottom: 32 }}>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: t.lo, marginBottom: 14,
              }}>
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
                  <span style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: t.lo,
                  }}>
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
          padding: '13px 28px', borderTop: `1px solid ${t.line}`, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 12, color: t.lo }}>{total} collections</span>
          <span style={{ display: 'flex', gap: 14, fontSize: 12, color: t.lo, alignItems: 'center' }}>
            {docResults.length > 0 && (
              <span>
                <kbd style={kbdStyle}>↑↓</kbd> navigate
                <span style={{ margin: '0 6px' }}>·</span>
                <kbd style={kbdStyle}>↵</kbd> open
                <span style={{ margin: '0 6px' }}>·</span>
              </span>
            )}
            <kbd style={kbdStyle}>L</kbd> toggle
            <span style={{ margin: '0 4px' }}>·</span>
            <kbd style={kbdStyle}>esc</kbd> close
          </span>
        </div>
      </div>
    </>,
    document.body,
  )
}

const kbdStyle: React.CSSProperties = {
  fontFamily: 'inherit',
  background: '#1C1C2C',
  border: '1px solid #252535',
  borderRadius: 4,
  padding: '2px 6px',
  fontSize: 11,
}

// ── Export total count hook for button label ─────────────────────────────────
export function useCollectionTotal(): number {
  return useCollectionGroups().total
}
