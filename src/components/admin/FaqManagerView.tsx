'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { HubModal } from './faq-manager/HubModal'
import { CategoryModal } from './faq-manager/CategoryModal'
import { FaqModal } from './faq-manager/FaqModal'

// ── Design tokens (matching CustomNav) ──────────────────────────────────────
const t = {
  bg:      '#0D0D14',
  surface: '#141420',
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
  red:     '#C41E3A',
}

// ── Types ────────────────────────────────────────────────────────────────────
interface SupportGroup {
  id: string
  name: string
  slug: string
  heading?: string
  description?: string
  isActive: boolean
  displayOrder: number
  seo?: { metaTitle?: string; metaDescription?: string }
}

interface FaqCategory {
  id: string
  name: string
  slug: string
  displayOrder?: number
  color?: string
  description?: string
  icon?: string
  group?: { id: string; name: string; slug: string } | string | null
}

interface Faq {
  id: string
  question: string
  slug: string
  status: 'draft' | 'published'
  excerpt?: string | null
  answer?: unknown
  group?: SupportGroup | string | null
  categories?: Array<FaqCategory | string>
  updatedAt: string
}

interface GroupedFaqs {
  category: FaqCategory | null
  faqs: Faq[]
}

// ── Modal state ───────────────────────────────────────────────────────────────
type ModalState =
  | { type: 'hub'; hub?: SupportGroup | null }
  | { type: 'category'; category?: FaqCategory | null; defaultHubId?: string }
  | { type: 'faq'; faq?: Faq | null; defaultHubId?: string }
  | null

// ── Fetch helper ─────────────────────────────────────────────────────────────
async function fetchJSON(url: string) {
  const res = await fetch(url, { credentials: 'include' })
  if (!res.ok) throw new Error(`Failed to fetch: ${url} (${res.status})`)
  return res.json() as Promise<{ docs: unknown[] }>
}

// ── Main Component ────────────────────────────────────────────────────────────
export function FaqManagerView() {
  const [hubs, setHubs]             = useState<SupportGroup[]>([])
  const [categories, setCategories] = useState<FaqCategory[]>([])
  const [faqs, setFaqs]             = useState<Faq[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)
  const [activeHub, setActiveHub]   = useState<string>('all')
  const [activeCat, setActiveCat]   = useState<string>('all')
  const [status, setStatus]         = useState<'all' | 'published' | 'draft'>('all')
  const [search, setSearch]         = useState('')
  const [modal, setModal]           = useState<ModalState>(null)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [h, c, f] = await Promise.all([
        fetchJSON('/api/support-groups?limit=100&sort=displayOrder'),
        fetchJSON('/api/faq-categories?limit=100&sort=displayOrder'),
        fetchJSON('/api/faqs?limit=500&depth=1&sort=-updatedAt'),
      ])
      setHubs(h.docs as SupportGroup[])
      setCategories(c.docs as FaqCategory[])
      setFaqs(f.docs as Faq[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  // Reset category filter when hub changes
  useEffect(() => { setActiveCat('all') }, [activeHub])

  // ── Helpers ──────────────────────────────────────────────────────────────
  const closeModal = () => setModal(null)

  const activeHubObj = hubs.find(h => h.slug === activeHub) ?? null

  // ── Filtering ─────────────────────────────────────────────────────────────
  const filtered = faqs.filter(faq => {
    if (activeHub !== 'all') {
      const g = typeof faq.group === 'object' && faq.group !== null ? faq.group as SupportGroup : null
      if (!g || g.slug !== activeHub) return false
    }
    if (activeCat !== 'all') {
      const cats = (faq.categories ?? []).filter(c => typeof c === 'object') as FaqCategory[]
      if (!cats.some(c => c.slug === activeCat)) return false
    }
    if (status !== 'all' && faq.status !== status) return false
    if (search.trim()) {
      if (!faq.question.toLowerCase().includes(search.toLowerCase())) return false
    }
    return true
  })

  // ── Category chips — only those with matching FAQs ─────────────────────
  const visibleCats = categories.filter(cat =>
    filtered.some(faq => {
      const cats = (faq.categories ?? []).filter(c => typeof c === 'object') as FaqCategory[]
      return cats.some(c => c.id === cat.id)
    })
  )

  // ── Group by category ─────────────────────────────────────────────────────
  const groups: GroupedFaqs[] = []
  const uncategorized: Faq[] = []

  filtered.forEach(faq => {
    const cats = (faq.categories ?? []).filter(c => typeof c === 'object') as FaqCategory[]
    if (cats.length === 0) {
      uncategorized.push(faq)
      return
    }
    cats.forEach(cat => {
      if (activeCat !== 'all' && cat.slug !== activeCat) return
      let group = groups.find(g => g.category?.id === cat.id)
      if (!group) { group = { category: cat, faqs: [] }; groups.push(group) }
      if (!group.faqs.find(f => f.id === faq.id)) group.faqs.push(faq)
    })
  })

  if (uncategorized.length > 0) groups.push({ category: null, faqs: uncategorized })

  groups.sort((a, b) => {
    if (a.category === null) return 1
    if (b.category === null) return -1
    return (a.category.displayOrder ?? 99) - (b.category.displayOrder ?? 99)
  })

  const hubCount = (slug: string) =>
    faqs.filter(f => (typeof f.group === 'object' && f.group !== null ? (f.group as SupportGroup).slug : null) === slug).length

  // ── Loading / Error states ────────────────────────────────────────────────
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: t.mid, fontSize: 15, background: t.bg }}>
      Loading FAQ Manager…
    </div>
  )
  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: t.red, fontSize: 15, background: t.bg }}>
      Error: {error}
    </div>
  )

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: t.bg, color: t.high, fontFamily: 'system-ui,-apple-system,sans-serif', padding: '36px 44px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: t.high, margin: 0, letterSpacing: '-0.02em' }}>
            FAQ Manager
          </h1>
          <p style={{ color: t.mid, fontSize: 13.5, marginTop: 5, margin: '5px 0 0' }}>
            {faqs.length} total &middot; {faqs.filter(f => f.status === 'published').length} published &middot; {faqs.filter(f => f.status === 'draft').length} draft
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <ActionBtn
            label="+ New Hub"
            color={t.jade}
            onClick={() => setModal({ type: 'hub' })}
          />
          <ActionBtn
            label="+ New Category"
            color={t.gold}
            onClick={() => setModal({ type: 'category', ...(activeHubObj?.id !== undefined && { defaultHubId: activeHubObj.id }) })}
          />
          <ActionBtn
            label="+ New FAQ"
            color={t.violet}
            primary
            onClick={() => setModal({ type: 'faq', ...(activeHubObj?.id !== undefined && { defaultHubId: activeHubObj.id }) })}
          />
        </div>
      </div>

      {/* Hub Tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8, paddingBottom: 20, borderBottom: `1px solid ${t.line}`, alignItems: 'center' }}>
        <Tab label={`All (${faqs.length})`} active={activeHub === 'all'} onClick={() => setActiveHub('all')} />
        {hubs.map(h => (
          <HubTabWithEdit
            key={h.id}
            label={`${h.name} (${hubCount(h.slug)})`}
            active={activeHub === h.slug}
            onSelect={() => setActiveHub(h.slug)}
            onEdit={() => setModal({ type: 'hub', hub: h })}
          />
        ))}
        <button
          onClick={() => setModal({ type: 'hub' })}
          style={{ marginLeft: 'auto', fontSize: 12, color: t.lo, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, padding: 0 }}
        >
          + New hub
        </button>
      </div>

      {/* Search + Status filter */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 20, marginBottom: 18, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 260px', maxWidth: 400, display: 'flex', alignItems: 'center', gap: 10, background: t.surface, border: `1px solid ${t.lineStr}`, borderRadius: 10, padding: '0 14px', height: 40 }}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="5.5" stroke={t.mid} strokeWidth="1.5"/>
            <path d="M13 13L17 17" stroke={t.mid} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions…" style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: t.high, fontSize: 13.5, fontFamily: 'inherit' }} />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: t.mid, cursor: 'pointer', padding: 0, fontSize: 18, lineHeight: 1 }}>×</button>}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['all', 'published', 'draft'] as const).map(s => (
            <button key={s} onClick={() => setStatus(s)} style={{ height: 36, padding: '0 14px', borderRadius: 8, background: status === s ? t.surface : 'transparent', border: `1px solid ${status === s ? t.lineStr : 'transparent'}`, color: status === s ? t.high : t.mid, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: status === s ? 500 : 400 }}>
              {s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Category chips */}
      {visibleCats.length > 0 && (
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 24 }}>
          <Chip label={`All Categories (${filtered.length})`} active={activeCat === 'all'} onClick={() => setActiveCat('all')} />
          {visibleCats.map(cat => {
            const count = filtered.filter(f => {
              const cats = (f.categories ?? []).filter(c => typeof c === 'object') as FaqCategory[]
              return cats.some(c => c.id === cat.id)
            }).length
            return <Chip key={cat.id} label={`${cat.name} (${count})`} active={activeCat === cat.slug} color={cat.color ?? ''} onClick={() => setActiveCat(cat.slug)} />
          })}
          <button
            onClick={() => setModal({ type: 'category', ...(activeHubObj?.id !== undefined && { defaultHubId: activeHubObj.id }) })}
            style={{ marginLeft: 'auto', alignSelf: 'center', fontSize: 12, color: t.lo, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
          >
            + New category
          </button>
        </div>
      )}

      {/* Results count */}
      <div style={{ fontSize: 12, color: t.lo, marginBottom: 16 }}>
        Showing {filtered.length} FAQ{filtered.length !== 1 ? 's' : ''}
        {activeHub !== 'all' && ` in ${hubs.find(h => h.slug === activeHub)?.name ?? activeHub}`}
        {activeCat !== 'all' && ` · ${categories.find(c => c.slug === activeCat)?.name ?? activeCat}`}
      </div>

      {/* FAQ Groups */}
      {groups.length === 0 ? (
        <EmptyState
          activeHub={activeHub}
          search={search}
          onNewFaq={() => setModal({ type: 'faq', ...(activeHubObj?.id !== undefined && { defaultHubId: activeHubObj.id }) })}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {groups.map(g => (
            <FaqGroup
              key={g.category?.id ?? 'uncategorized'}
              group={g}
              onEditCategory={cat => setModal({ type: 'category', category: cat })}
              onEditFaq={faq => setModal({ type: 'faq', faq })}
            />
          ))}
        </div>
      )}

      {/* ── Modals ── */}
      <HubModal
        isOpen={modal?.type === 'hub'}
        onClose={closeModal}
        hub={modal?.type === 'hub' ? (modal.hub ?? null) : null}
        onSaved={() => { closeModal(); loadData() }}
      />

      <CategoryModal
        isOpen={modal?.type === 'category'}
        onClose={closeModal}
        category={modal?.type === 'category' ? (modal.category ?? null) : null}
        hubs={hubs}
        {...(modal?.type === 'category' && modal.defaultHubId !== undefined ? { defaultHubId: modal.defaultHubId } : {})}
        onSaved={() => { closeModal(); loadData() }}
      />

      <FaqModal
        isOpen={modal?.type === 'faq'}
        onClose={closeModal}
        faq={modal?.type === 'faq' ? (modal.faq ?? null) : null}
        hubs={hubs}
        categories={categories}
        {...(modal?.type === 'faq' && modal.defaultHubId !== undefined ? { defaultHubId: modal.defaultHubId } : {})}
        onSaved={() => { closeModal(); loadData() }}
      />
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ActionBtn({ onClick, label, color, primary }: { onClick: () => void; label: string; color: string; primary?: boolean }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display: 'inline-flex', alignItems: 'center', height: 38, padding: '0 16px', borderRadius: 9, background: primary ? (hov ? color : color + 'dd') : (hov ? color + '22' : 'transparent'), border: `1px solid ${hov ? color : color + '55'}`, color: primary ? '#fff' : color, textDecoration: 'none', fontSize: 13.5, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.12s' }}
    >
      {label}
    </button>
  )
}

// Hub tab with an adjacent edit icon button
function HubTabWithEdit({ label, active, onSelect, onEdit }: { label: string; active: boolean; onSelect: () => void; onEdit: () => void }) {
  const [hov, setHov] = useState(false)
  const [editHov, setEditHov] = useState(false)
  return (
    <div style={{ display: 'flex', alignItems: 'center', borderRadius: 9, overflow: 'hidden', border: `1px solid ${active ? t.jade + '55' : (hov ? t.lineStr : 'transparent')}`, transition: 'border-color 0.12s' }}>
      <button
        onClick={onSelect}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{ padding: '8px 12px 8px 14px', background: active ? t.jade + '20' : (hov ? t.surface : 'transparent'), border: 'none', color: active ? t.jade : (hov ? t.high : t.mid), cursor: 'pointer', fontSize: 13.5, fontWeight: active ? 600 : 400, fontFamily: 'inherit', transition: 'all 0.12s', borderRadius: 0 }}
      >
        {label}
      </button>
      <button
        onClick={onEdit}
        onMouseEnter={() => setEditHov(true)}
        onMouseLeave={() => setEditHov(false)}
        title="Edit hub settings"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: '100%', minHeight: 36, background: editHov ? t.cardHov : (active ? t.jade + '10' : 'transparent'), color: editHov ? t.high : t.lo, border: 'none', cursor: 'pointer', fontSize: 12, borderLeft: `1px solid ${active ? t.jade + '30' : t.line}`, transition: 'all 0.12s', flexShrink: 0, fontFamily: 'inherit' }}
      >
        ✎
      </button>
    </div>
  )
}

function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ padding: '8px 16px', borderRadius: 9, background: active ? t.jade + '20' : (hov ? t.surface : 'transparent'), border: `1px solid ${active ? t.jade + '55' : (hov ? t.lineStr : 'transparent')}`, color: active ? t.jade : (hov ? t.high : t.mid), cursor: 'pointer', fontSize: 13.5, fontWeight: active ? 600 : 400, fontFamily: 'inherit', transition: 'all 0.12s' }}>
      {label}
    </button>
  )
}

function Chip({ label, active, color, onClick }: { label: string; active: boolean; color?: string | null; onClick: () => void }) {
  const c = color || t.violet
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ padding: '5px 13px', borderRadius: 20, background: active ? c + '25' : (hov ? t.surface : 'transparent'), border: `1px solid ${active ? c + '60' : (hov ? t.lineStr : t.line)}`, color: active ? c : (hov ? t.high : t.mid), cursor: 'pointer', fontSize: 12.5, fontWeight: active ? 600 : 400, fontFamily: 'inherit', transition: 'all 0.12s' }}>
      {label}
    </button>
  )
}

function FaqGroup({ group, onEditCategory, onEditFaq }: { group: GroupedFaqs; onEditCategory: (cat: FaqCategory) => void; onEditFaq: (faq: Faq) => void }) {
  const [open, setOpen] = useState(true)
  const accent = group.category?.color || t.violet
  return (
    <div>
      <button onClick={() => setOpen(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 12px', textAlign: 'left' }}>
        <div style={{ width: 8, height: 8, borderRadius: 2, background: accent, flexShrink: 0 }} />
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: t.lo }}>
          {group.category?.name ?? 'Uncategorized'}
        </span>
        <span style={{ fontSize: 11, color: t.lo }}>({group.faqs.length})</span>
        <div style={{ flex: 1, height: 1, background: t.line }} />
        {group.category && (
          <button
            onClick={e => { e.stopPropagation(); onEditCategory(group.category!) }}
            style={{ fontSize: 11, color: t.lo, background: 'none', border: 'none', cursor: 'pointer', padding: '2px 8px', fontFamily: 'inherit' }}
          >
            Edit
          </button>
        )}
        <span style={{ fontSize: 11, color: t.lo, userSelect: 'none' }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{ border: `1px solid ${t.line}`, borderRadius: 12, overflow: 'hidden', background: t.surface }}>
          {group.faqs.map((faq, i) => (
            <FaqRow key={faq.id} faq={faq} last={i === group.faqs.length - 1} onEdit={() => onEditFaq(faq)} />
          ))}
        </div>
      )}
    </div>
  )
}

function FaqRow({ faq, last, onEdit }: { faq: Faq; last: boolean; onEdit: () => void }) {
  const [hov, setHov] = useState(false)
  const cats = (faq.categories ?? []).filter(c => typeof c === 'object') as FaqCategory[]
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 18px', borderBottom: last ? 'none' : `1px solid ${t.line}`, background: hov ? t.cardHov : 'transparent', transition: 'background 0.1s' }}>

      {/* Question text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, color: t.high, lineHeight: 1.4 }}>{faq.question}</div>
        {faq.excerpt && (
          <div style={{ fontSize: 12, color: t.mid, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 600 }}>
            {faq.excerpt}
          </div>
        )}
      </div>

      {/* Category badges */}
      {cats.length > 0 && (
        <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
          {cats.slice(0, 2).map(cat => (
            <span key={cat.id} style={{ padding: '2px 9px', borderRadius: 12, fontSize: 11, background: (cat.color || t.violet) + '20', color: cat.color || t.violet, border: `1px solid ${(cat.color || t.violet) + '40'}` }}>
              {cat.name}
            </span>
          ))}
          {cats.length > 2 && <span style={{ fontSize: 11, color: t.lo }}>+{cats.length - 2}</span>}
        </div>
      )}

      {/* Status badge */}
      <span style={{ padding: '3px 10px', borderRadius: 8, fontSize: 11, fontWeight: 500, flexShrink: 0, background: faq.status === 'published' ? t.jade + '18' : t.gold + '18', color: faq.status === 'published' ? t.jade : t.gold, border: `1px solid ${faq.status === 'published' ? t.jade + '40' : t.gold + '40'}` }}>
        {faq.status}
      </span>

      {/* Edit action */}
      <button
        onClick={onEdit}
        style={{ padding: '5px 12px', borderRadius: 7, background: hov ? t.card : 'transparent', border: `1px solid ${hov ? t.lineStr : 'transparent'}`, color: hov ? t.high : t.mid, fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.1s', flexShrink: 0 }}
      >
        Edit
      </button>

      {/* View on site */}
      <a href={`/technical-support-division/${typeof faq.group === 'object' && faq.group !== null ? (faq.group as SupportGroup).slug : ''}#${faq.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: t.lo, textDecoration: 'none', fontSize: 14, flexShrink: 0 }} title="View on site">
        ↗
      </a>
    </div>
  )
}

function EmptyState({ activeHub, search, onNewFaq }: { activeHub: string; search: string; onNewFaq: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', color: t.lo, gap: 12 }}>
      <svg width="44" height="44" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="8" stroke={t.lo} strokeWidth="1.5"/>
        <path d="M7.5 7.5C7.5 6.12 8.62 5 10 5C11.38 5 12.5 6.12 12.5 7.5C12.5 8.5 11.92 9.35 11.07 9.76L10 10.75V12" stroke={t.lo} strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="10" cy="14.5" r="1" fill={t.lo}/>
      </svg>
      <span style={{ fontSize: 15 }}>
        {search ? `No FAQs match "${search}"` : activeHub !== 'all' ? 'No FAQs in this hub yet' : 'No FAQs yet'}
      </span>
      {!search && (
        <button
          onClick={onNewFaq}
          style={{ color: t.violet, fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
        >
          Create the first FAQ →
        </button>
      )}
    </div>
  )
}
