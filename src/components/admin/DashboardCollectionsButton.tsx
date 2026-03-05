'use client'

import { useState, useEffect } from 'react'
import { CollectionsModal, IcoGrid, IcoChevR, t, useCollectionTotal } from './CollectionsModal'

export function DashboardCollectionsButton() {
  const [open, setOpen] = useState(false)
  const [hov, setHov] = useState(false)
  const [recent, setRecent] = useState<string[]>([])
  const total = useCollectionTotal()

  useEffect(() => {
    try {
      const rec = localStorage.getItem('kawai-nav-rec')
      if (rec) setRecent(JSON.parse(rec) as string[])
    } catch { /* ignore */ }
  }, [])

  return (
    <div style={{ padding: '0 var(--gutter-h)', marginBottom: 36 }}>
      <button
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', padding: '22px 26px',
          background: hov ? '#1E1E2C' : t.card,
          border: `1px solid ${hov ? t.violet : t.lineStr}`,
          borderRadius: 14, cursor: 'pointer', color: t.high,
          fontFamily: 'inherit', textAlign: 'left',
          transition: 'background 0.15s, border-color 0.15s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, flexShrink: 0,
            background: `${t.violet}18`, border: `1px solid ${t.violet}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.violet,
          }}>
            <IcoGrid size={22} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.3 }}>Browse All Collections</div>
            <div style={{ fontSize: 13, color: t.lo, marginTop: 3 }}>
              Navigate all {total} collections in this workspace
            </div>
          </div>
        </div>
        <span style={{ color: t.lo }}>
          <IcoChevR size={18} />
        </span>
      </button>

      <CollectionsModal open={open} onClose={() => setOpen(false)} recent={recent} />
    </div>
  )
}
