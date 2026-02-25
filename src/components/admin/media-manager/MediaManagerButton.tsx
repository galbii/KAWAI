'use client'

import { useMediaManager } from './MediaManagerProvider'

export function MediaManagerButton() {
  const { openModal } = useMediaManager()

  return (
    <button
      onClick={() => openModal()}
      title="Media Library"
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        height: 56,
        padding: '0 22px 0 18px',
        borderRadius: 28,
        background: 'linear-gradient(180deg, #1E1E2A 0%, #17171F 100%)',
        border: '1px solid #2C2C3E',
        boxShadow: '0 6px 20px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        cursor: 'pointer',
        userSelect: 'none' as const,
        outline: 'none',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.borderColor = 'rgba(99,102,241,0.6)'
        el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.6), 0 0 0 3px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.05)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.borderColor = '#2C2C3E'
        el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
        el.style.transform = 'scale(1)'
      }}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.96)' }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
    >
      {/* Image icon */}
      <svg
        width="22" height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#6E6E8E"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>

      <span style={{
        fontSize: 15,
        fontWeight: 500,
        color: '#7A7A9E',
        letterSpacing: '0.01em',
        lineHeight: 1,
      }}>
        Media
      </span>

      {/* Subtle dot indicator */}
      <span style={{
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: '#6366F1',
        opacity: 0.7,
        flexShrink: 0,
        marginLeft: 1,
      }} />
    </button>
  )
}
