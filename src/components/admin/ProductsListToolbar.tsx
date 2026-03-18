'use client'

import { useState } from 'react'
import { useListQuery, toast } from '@payloadcms/ui'

// ---------------------------------------------------------------------------
// Shared constants
// ---------------------------------------------------------------------------

const c = {
  panel:   '#111116',
  line:    '#252535',
  mid:     '#8484A0',
  high:    '#ECECF2',
  red:     '#C41E3A',
  surface: '#1A1A24',
}

const TABS = [
  { label: 'All',         where: null },
  { label: 'Digital',     where: { type: { equals: 'digital' } } },
  { label: 'Grand',       where: { type: { equals: 'grand' } } },
  { label: 'Shigeru',     where: { type: { equals: 'shigeru' } } },
  { label: 'Upright',     where: { type: { equals: 'upright' } } },
  { label: 'Hybrid',      where: { type: { equals: 'hybrid' } } },
  { label: 'Accessories', where: { type: { equals: 'accessory' } } },
]

// ---------------------------------------------------------------------------
// Patch-missing-blocks logic (inlined from PatchMissingBlocksButton)
// ---------------------------------------------------------------------------

interface PatchResult {
  success: boolean
  summary?: { total: number; patched: number; skipped: number; errors: number }
  errors?: Array<{ id: string; model: string; error: string }>
  message?: string
}

// ---------------------------------------------------------------------------
// Bulk sync logic (inlined from BulkShopifySyncButton)
// ---------------------------------------------------------------------------

interface SyncResult {
  success: boolean
  summary: { total: number; created: number; updated: number; skipped: number; errors: number }
  errors?: Array<{ model: string; error: string }>
  message?: string
}

// ---------------------------------------------------------------------------
// Toolbar
// ---------------------------------------------------------------------------

export function ProductsListToolbar() {
  const { handleWhereChange } = useListQuery()
  const [activeIndex, setActiveIndex] = useState(0)
  const [syncing, setSyncing] = useState(false)
  const [patching, setPatching] = useState(false)

  // Tab filter
  function handleTab(i: number) {
    setActiveIndex(i)
    if (handleWhereChange) handleWhereChange(TABS[i]?.where ?? {})
  }

  // Sync from Shopify
  async function handleSync() {
    if (!confirm('Sync all products from Shopify?\n\nThis will create or update products based on their model number. This may take a few minutes for large catalogs.')) return
    setSyncing(true)
    try {
      const res = await fetch('/api/products/bulk-sync-from-shopify', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
      const data: SyncResult = await res.json()
      if (res.ok && data.success) {
        toast.success(`✓ Sync complete: ${data.summary.created} created, ${data.summary.updated} updated${data.summary.errors > 0 ? `, ${data.summary.errors} errors` : ''}`)
        data.errors?.forEach(e => toast.error(`${e.model}: ${e.error}`))
        setTimeout(() => window.location.reload(), 2000)
      } else {
        toast.error(data.message || 'Bulk sync failed')
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Network error')
    } finally {
      setSyncing(false)
    }
  }

  // Patch missing blocks
  async function handlePatch() {
    if (!confirm('Add missing blocks to all products that are missing them?\n\nThis will NOT overwrite or rearrange existing blocks.')) return
    setPatching(true)
    try {
      const res = await fetch('/api/products/patch-missing-blocks', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
      const data: PatchResult = await res.json()
      if (data.success) {
        toast.success(`✓ Patched ${data.summary?.patched ?? 0} products (${data.summary?.skipped ?? 0} already up-to-date)`)
      } else {
        toast.error(data.message || 'Patch failed')
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Network error')
    } finally {
      setPatching(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      padding: '8px var(--gutter-h)',
      marginBottom: 'calc(var(--base) * -0.5)',
    }}>

      {/* Filter tabs */}
      <div style={{
        display: 'inline-flex',
        background: c.panel,
        border: `1px solid ${c.line}`,
        borderRadius: 10,
        padding: 4,
        flexShrink: 0,
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

      {/* Action buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <button
          onClick={handlePatch}
          disabled={patching}
          title="Add missing blocks to all products"
          style={{
            height: 32,
            padding: '0 12px',
            borderRadius: 7,
            border: `1px solid ${c.line}`,
            background: c.surface,
            color: patching ? c.mid : c.high,
            fontSize: 12,
            fontWeight: 500,
            cursor: patching ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            transition: 'border-color 0.12s, color 0.12s',
          }}
        >
          <span style={{ fontSize: 14 }}>🧩</span>
          {patching ? 'Patching…' : 'Patch Blocks'}
        </button>

        <button
          onClick={handleSync}
          disabled={syncing}
          title="Bulk sync all products from Shopify"
          style={{
            height: 32,
            padding: '0 12px',
            borderRadius: 7,
            border: `1px solid ${c.line}`,
            background: c.surface,
            color: syncing ? c.mid : c.high,
            fontSize: 12,
            fontWeight: 500,
            cursor: syncing ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            transition: 'border-color 0.12s, color 0.12s',
          }}
        >
          <span style={{ fontSize: 14 }}>↻</span>
          {syncing ? 'Syncing…' : 'Sync Shopify'}
        </button>
      </div>
    </div>
  )
}
