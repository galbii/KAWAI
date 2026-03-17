'use client'

import type { DefaultCellComponentProps } from 'payload'

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  digital:   { label: 'Digital',    color: '#60A5FA', bg: 'rgba(96,165,250,0.12)'  },
  grand:     { label: 'Grand',      color: '#A78BFA', bg: 'rgba(167,139,250,0.12)' },
  upright:   { label: 'Upright',    color: '#34D399', bg: 'rgba(52,211,153,0.12)'  },
  hybrid:    { label: 'Hybrid',     color: '#FBBF24', bg: 'rgba(251,191,36,0.12)'  },
  accessory: { label: 'Accessory',  color: '#F87171', bg: 'rgba(248,113,113,0.12)' },
  other:     { label: 'Other',      color: '#8484A0', bg: 'rgba(132,132,160,0.12)' },
}

export function ProductTypeCell({ cellData }: DefaultCellComponentProps) {
  const raw = String(cellData ?? '').toLowerCase()
  const cfg = TYPE_CONFIG[raw]

  if (!cfg) {
    return (
      <span style={{ color: '#8484A0', fontSize: 12 }}>
        {cellData ?? '—'}
      </span>
    )
  }

  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 4,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: cfg.color,
      background: cfg.bg,
      border: `1px solid ${cfg.color}30`,
    }}>
      {cfg.label}
    </span>
  )
}
