'use client'

import { useConfig, useFormFields, useDocumentInfo, Button, toast } from '@payloadcms/ui'
import { useState } from 'react'

const ExternalIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 13 13"
    fill="none"
    aria-hidden="true"
    style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 5, flexShrink: 0 }}
  >
    <path
      d="M8 1H12V5M12 1L5.5 7.5M2 4H1V12H9V8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const MapPinIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    style={{ display: 'inline-block', flexShrink: 0 }}
  >
    <path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"
      fill="currentColor"
    />
  </svg>
)

/**
 * Shown in the Dealers collection list view (admin.components.beforeList).
 * Seeds the dealers collection from the built-in seed data.
 * Deduplicates by slug — existing records are always skipped.
 */
export function SeedDealersButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')

  const handleSeed = async () => {
    if (status === 'loading') return
    setStatus('loading')
    try {
      const res = await fetch('/api/admin/seed-dealers', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? 'Seed failed.')
        setStatus('idle')
        return
      }

      const { created, skipped, errors } = data
      if (errors?.length) {
        toast.error(`Done with ${errors.length} error(s). ${created} created, ${skipped} skipped.`)
      } else {
        toast.success(`Seeded! ${created} created, ${skipped} already existed.`)
      }
      setStatus('done')
      setTimeout(() => setStatus('idle'), 4000)
    } catch {
      toast.error('Request failed.')
      setStatus('idle')
    }
  }

  return (
    <div style={{ marginBottom: 8 }}>
      <Button
        onClick={handleSeed}
        disabled={status === 'loading'}
        buttonStyle="secondary"
        size="small"
        type="button"
      >
        {status === 'loading' ? 'Seeding…' : status === 'done' ? '✓ Done' : '🌱 Seed Dealers'}
      </Button>
    </div>
  )
}

/**
 * Shown in the Dealers collection list view (admin.components.beforeList).
 * Links to the public /find-a-dealer page.
 */
export function FindADealerListButton() {
  const { config } = useConfig()
  const siteURL = (config as any).serverURL || 'http://localhost:3000'
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '10px 0 6px',
      }}
    >
      <a
        href={`${siteURL}/find-a-dealer`}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          height: 34,
          padding: '0 14px',
          borderRadius: 6,
          border: `1px solid ${hovered ? 'var(--theme-elevation-200)' : 'var(--theme-elevation-150)'}`,
          background: hovered ? 'var(--theme-elevation-50)' : 'transparent',
          color: 'var(--theme-text)',
          fontSize: 13,
          fontWeight: 500,
          textDecoration: 'none',
          transition: 'background 0.12s, border-color 0.12s',
          whiteSpace: 'nowrap',
        }}
      >
        <MapPinIcon />
        View Find a Dealer Page
        <ExternalIcon />
      </a>
    </div>
  )
}

/**
 * Shown in the Dealers document edit view (admin.components.edit.beforeDocumentControls).
 * Reads the slug field value and links to the public /find-a-dealer/[slug] page.
 */
export function FindADealerDocButton() {
  const { config } = useConfig()
  const siteURL = (config as any).serverURL || 'http://localhost:3000'
  const { id } = useDocumentInfo()
  const [hovered, setHovered] = useState(false)

  const slug = useFormFields(([fields]) => fields['slug']?.value as string | undefined)

  // Don't show on a new (unsaved) document or if slug isn't set yet
  if (!id || !slug) return null

  return (
    <a
      href={`${siteURL}/find-a-dealer/${slug}`}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
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
        whiteSpace: 'nowrap',
      }}
    >
      <MapPinIcon />
      View on Site
      <ExternalIcon />
    </a>
  )
}
