'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '@payloadcms/ui'
import { useMediaManager } from './media-manager/MediaManagerProvider'
import { CollectionsModal } from './CollectionsModal'

// ── Icons ─────────────────────────────────────────────────────────────────────

const IcoDash = () => (
  <svg width={18} height={18} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor" />
    <rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor" />
    <rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor" />
    <rect x="11" y="11" width="7" height="7" rx="1.5" fill="currentColor" />
  </svg>
)

const IcoGrid = () => (
  <svg width={18} height={18} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const IcoImg = () => (
  <svg width={18} height={18} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="7" cy="8.5" r="1.5" fill="currentColor" />
    <path
      d="M2 14L7 9L11 13L14 10.5L18 14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const IcoPlus = ({ open }: { open: boolean }) => (
  <svg
    width={22}
    height={22}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    style={{
      transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
      transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    }}
  >
    <line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
)

// ── Action Item ───────────────────────────────────────────────────────────────

interface ActionItemProps {
  label: string
  icon: React.ReactNode
  onClick?: () => void
  href?: string
  visible: boolean
  openDelay: number
  closeDelay: number
}

function ActionItem({ label, icon, onClick, href, visible, openDelay, closeDelay }: ActionItemProps) {
  const [hov, setHov] = useState(false)
  const delay = visible ? openDelay : closeDelay

  const pill: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    height: 52,
    paddingLeft: 14,
    paddingRight: 22,
    background: hov ? 'rgba(99,102,241,0.16)' : 'rgba(18,18,30,0.94)',
    border: `1px solid ${hov ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.07)'}`,
    borderRadius: 26,
    color: hov ? '#C7D2FE' : 'rgba(255,255,255,0.65)',
    cursor: 'pointer',
    fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: '0.055em',
    textTransform: 'uppercase',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    boxShadow: hov
      ? '0 0 0 1px rgba(99,102,241,0.2), 0 6px 20px rgba(0,0,0,0.3)'
      : '0 2px 10px rgba(0,0,0,0.28)',
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.95)',
    transition: [
      `opacity 0.2s ease ${delay}ms`,
      `transform 0.24s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`,
      'background 0.15s ease',
      'border-color 0.15s ease',
      'color 0.15s ease',
      'box-shadow 0.15s ease',
    ].join(', '),
    pointerEvents: visible ? 'auto' : 'none',
    outline: 'none',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  }

  const iconBox: React.CSSProperties = {
    width: 34,
    height: 34,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: hov ? 'rgba(99,102,241,0.22)' : 'rgba(255,255,255,0.06)',
    color: hov ? '#818CF8' : 'rgba(255,255,255,0.4)',
    transition: 'background 0.15s, color 0.15s',
    flexShrink: 0,
  }

  const events = {
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
  }

  const inner = (
    <>
      <span style={iconBox}>{icon}</span>
      <span>{label}</span>
    </>
  )

  if (href) return <a href={href} style={pill} {...events}>{inner}</a>
  return <button onClick={onClick} style={pill} {...events}>{inner}</button>
}

// ── Main export ───────────────────────────────────────────────────────────────

export function FloatingActionBar() {
  const { openModal } = useMediaManager()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
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

  if (!user || (user as { role?: string }).role !== 'admin') return null

  // Visual order top→bottom: Dashboard (furthest), Collections, Media (closest to trigger)
  const actions: { label: string; icon: React.ReactNode; href?: string; onClick?: () => void }[] = [
    { label: 'Dashboard', icon: <IcoDash />, href: '/admin' },
    { label: 'Collections', icon: <IcoGrid />, onClick: () => { setCollOpen(true); setOpen(false) } },
    { label: 'Media',       icon: <IcoImg  />, onClick: () => { openModal();         setOpen(false) } },
  ]

  const n = actions.length

  const triggerStyle: React.CSSProperties = {
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: open
      ? 'linear-gradient(140deg, #6366F1 0%, #818CF8 100%)'
      : 'rgba(18, 18, 30, 0.96)',
    border: `1px solid ${open ? 'rgba(129,140,248,0.45)' : 'rgba(255,255,255,0.09)'}`,
    boxShadow: open
      ? '0 0 0 5px rgba(99,102,241,0.14), 0 8px 30px rgba(99,102,241,0.38)'
      : '0 4px 18px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.04)',
    color: open ? '#FFFFFF' : 'rgba(255,255,255,0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    flexShrink: 0,
    outline: 'none',
  }

  /*
   * Portal directly into document.body to escape Payload's transform ancestors.
   * Any position:fixed inside a CSS-transformed ancestor is positioned relative
   * to that ancestor, not the viewport. Portaling out fixes this.
   */
  const dock = (
    <div
      style={{
        position: 'fixed',
        right: 28,
        bottom: 28,
        zIndex: 9998,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 10,
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {actions.map((action, i) => (
        <ActionItem
          key={action.label}
          label={action.label}
          icon={action.icon}
          href={action.href}
          onClick={action.onClick}
          visible={open}
          // Opening: Media (i=2) appears first (0ms), Dashboard (i=0) last (110ms)
          openDelay={(n - 1 - i) * 55}
          // Closing: Dashboard (i=0) disappears first (0ms), Media (i=2) last (70ms)
          closeDelay={i * 35}
        />
      ))}

      <button
        aria-label={open ? 'Close quick actions' : 'Open quick actions'}
        onClick={() => setOpen(v => !v)}
        style={triggerStyle}
      >
        <IcoPlus open={open} />
      </button>
    </div>
  )

  return (
    <>
      {mounted && createPortal(dock, document.body)}
      <CollectionsModal open={collOpen} onClose={() => setCollOpen(false)} recent={recent} />
    </>
  )
}
