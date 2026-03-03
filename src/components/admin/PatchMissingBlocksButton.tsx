'use client'

import { useState } from 'react'

interface PatchResult {
  success: boolean
  summary?: {
    total: number
    patched: number
    skipped: number
    errors: number
  }
  errors?: Array<{ id: string; model: string; error: string }>
  message?: string
}

export default function PatchMissingBlocksButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PatchResult | null>(null)

  const handlePatch = async () => {
    if (
      !confirm(
        'Add missing "Related Products" and "SoundCloud" blocks to all products that are missing them?\n\nThis will NOT overwrite or rearrange existing blocks — it only adds the missing ones.',
      )
    )
      return

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/products/patch-missing-blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data: PatchResult = await response.json()
      setResult(data)

      if (data.success) {
        console.log('[PatchMissingBlocks] Success:', data.summary)
      } else {
        console.error('[PatchMissingBlocks] Failed:', data.message)
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Network error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginBottom: '8px', display: 'inline-flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
      <button
        onClick={handlePatch}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#6b7280' : '#7c3aed',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '8px 16px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '13px',
          fontWeight: 500,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        {loading ? (
          <>
            <span>Patching…</span>
          </>
        ) : (
          <>
            <span>🧩</span>
            <span>Add Missing Blocks</span>
          </>
        )}
      </button>

      {result && (
        <span
          style={{
            fontSize: '12px',
            color: result.success ? '#16a34a' : '#dc2626',
            fontWeight: 500,
          }}
        >
          {result.success
            ? `✅ Patched ${result.summary?.patched ?? 0} products (${result.summary?.skipped ?? 0} already up-to-date)`
            : `❌ ${result.message ?? 'Failed'}`}
        </span>
      )}

      {result?.errors && result.errors.length > 0 && (
        <details style={{ fontSize: '11px', color: '#dc2626' }}>
          <summary style={{ cursor: 'pointer' }}>
            {result.errors.length} error(s)
          </summary>
          <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
            {result.errors.slice(0, 10).map((e, i) => (
              <li key={i}>
                <strong>{e.model}</strong>: {e.error}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}
