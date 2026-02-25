'use client'

import { useState } from 'react'
import { useConfig } from '@payloadcms/ui'

const c = {
  line: '#252535', mid: '#8484A0', high: '#ECECF2', lo: '#4C4C68', card: '#1C1C26',
}

const ExternalLinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M7 1H11V5M11 1L5 7M2 3H1V11H9V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ShopifyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M9.5 2.5 C9.3 1.4 8.4 1 7.7 1 L7.5 1.1 C7.4 0.7 7.1 0.5 6.7 0.5 C6.1 0.5 5.5 1 5.3 1.7 L3.5 2.2 L2 11 L9 12.5 L12 11 L9.5 2.5Z" stroke="currentColor" strokeWidth="1" fill="none" />
    <path d="M5.3 1.7 C5.5 1 6.1 0.5 6.7 0.5 C7.1 0.5 7.4 0.7 7.5 1.1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
)

interface NavLinkItemProps {
  href: string
  label: string
  icon: React.ReactNode
}

function NavLinkItem({ href, label, icon }: NavLinkItemProps) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 8px',
        borderRadius: 6,
        color: hovered ? c.high : c.mid,
        background: hovered ? c.card : 'transparent',
        textDecoration: 'none',
        fontSize: 13,
        transition: 'color 0.12s, background 0.12s',
      }}
    >
      {icon}
      <span style={{ flex: 1 }}>{label}</span>
      <ExternalLinkIcon />
    </a>
  )
}

export function NavLinks() {
  const { config } = useConfig()
  const siteURL = (config as any).serverURL || 'http://localhost:3000'

  return (
    <div style={{
      borderTop: `1px solid ${c.line}`,
      padding: '12px 12px 8px',
    }}>
      <div style={{
        fontSize: 10,
        color: c.lo,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.1em',
        fontWeight: 600,
        marginBottom: 4,
        padding: '0 8px',
      }}>
        External
      </div>
      <NavLinkItem
        href={siteURL}
        label="View Live Site"
        icon={<ExternalLinkIcon />}
      />
      <NavLinkItem
        href="https://admin.shopify.com"
        label="Shopify Admin"
        icon={<ShopifyIcon />}
      />
    </div>
  )
}
