'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '@payloadcms/ui'
import { useMediaManager } from './media-manager/MediaManagerProvider'
import { CollectionsModal } from './CollectionsModal'

// ── SVG helpers ──────────────────────────────────────────────────────────────
function Svg({ size = 18, children }: { size?: number | undefined; children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true"
      style={{ flexShrink: 0, display: 'block' }}>
      {children}
    </svg>
  )
}
const IcoImg  = ({ size }: { size?: number | undefined }) => <Svg size={size}><rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="7" cy="8.5" r="1.5" fill="currentColor"/><path d="M2 14L7 9L11 13L14 10.5L18 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></Svg>
const IcoGrid = ({ size }: { size?: number | undefined }) => <Svg size={size}><rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></Svg>
const IcoDash = ({ size }: { size?: number | undefined }) => <Svg size={size}><rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor"/><rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor"/><rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor"/><rect x="11" y="11" width="7" height="7" rx="1.5" fill="currentColor"/></Svg>

// ── Floating pill button ──────────────────────────────────────────────────────
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
  const { user } = useAuth()
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

  // Only admins see the floating action bar
  if (!user || (user as { role?: string }).role !== 'admin') return null

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
      <CollectionsModal open={collOpen} onClose={() => setCollOpen(false)} recent={recent} />
    </>
  )
}
