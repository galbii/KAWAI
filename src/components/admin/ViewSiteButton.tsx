'use client'

import { useState } from 'react'
import { useConfig } from '@payloadcms/ui'

const ExternalIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 4 }}>
    <path d="M8 1H12V5M12 1L5.5 7.5M2 4H1V12H9V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function ViewSiteButton() {
  const { config } = useConfig()
  const siteURL = (config as any).serverURL || 'http://localhost:3000'
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={siteURL}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 34,
        padding: '0 12px',
        borderRadius: 6,
        border: '1px solid rgba(255,255,255,0.12)',
        color: 'var(--theme-text)',
        fontSize: 13,
        fontWeight: 500,
        textDecoration: 'none',
        background: hovered ? 'rgba(255,255,255,0.06)' : 'transparent',
        transition: 'background 0.12s',
        whiteSpace: 'nowrap' as const,
      }}
    >
      View Site <ExternalIcon />
    </a>
  )
}
