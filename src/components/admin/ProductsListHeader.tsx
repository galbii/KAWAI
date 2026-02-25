'use client'

import { useState } from 'react'
import { useListQuery } from '@payloadcms/ui'

const c = {
  panel: '#111116', line: '#252535', high: '#ECECF2', mid: '#8484A0', red: '#C41E3A',
}

const TABS = [
  { label: 'All',         where: null },
  { label: 'Digital',     where: { category: { like: 'Digital' } } },
  { label: 'Grand',       where: { category: { like: 'Grand' } } },
  { label: 'Upright',     where: { category: { like: 'Upright' } } },
  { label: 'Hybrid',      where: { category: { like: 'Hybrid' } } },
  { label: 'Accessories', where: { type: { like: 'accessory' } } },
]

export function ProductsListHeader() {
  const { handleWhereChange } = useListQuery()
  const [activeIndex, setActiveIndex] = useState(0)

  function handleTab(i: number) {
    setActiveIndex(i)
    const tab = TABS[i]
    if (handleWhereChange) {
      handleWhereChange(tab?.where ?? {})
    }
  }

  return (
    <div style={{
      margin: `0 var(--gutter-h)`,
      marginBottom: `calc(var(--base) * -0.5)`,
    }}>
      <div style={{
        display: 'inline-flex',
        background: c.panel,
        border: `1px solid ${c.line}`,
        borderRadius: 10,
        padding: 4,
      }}>
        {TABS.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => handleTab(i)}
            style={{
              height: 32,
              padding: '0 14px',
              borderRadius: 7,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: activeIndex === i ? 600 : 400,
              color: activeIndex === i ? '#FFFFFF' : c.mid,
              background: activeIndex === i ? c.red : 'transparent',
              transition: 'background 0.12s, color 0.12s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
