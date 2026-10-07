'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { syncProductWithShopify } from '@/lib/actions/sync-product-shopify'

type Status = 'idle' | 'loading' | 'done' | 'error'

/**
 * AdminBar control that re-syncs the current product from Shopify.
 *
 * Calls the same server action as the admin-panel ShopifySyncButton. The
 * Products afterChange hooks revalidate /products/{slug}, so router.refresh()
 * picks up the synced data without a full reload.
 */
export function AdminBarShopifySync({ productId }: { productId: string }) {
  const router = useRouter()
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  const handleSync = async () => {
    if (status === 'loading') return
    setStatus('loading')
    setError(null)

    try {
      const result = await syncProductWithShopify(productId)
      if (result.success) {
        setStatus('done')
        router.refresh()
        setTimeout(() => setStatus('idle'), 2500)
      } else {
        setError(result.error ?? result.message)
        setStatus('error')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed')
      setStatus('error')
    }
  }

  const label =
    status === 'loading' ? 'Syncing…' :
    status === 'done'    ? '✓ Synced' :
    status === 'error'   ? 'Retry Sync' :
    'Sync from Shopify'

  return (
    <>
      <button
        type="button"
        onClick={handleSync}
        disabled={status === 'loading'}
        title={error ?? 'Pull latest product data and pricing from Shopify'}
        style={{
          background: 'none',
          border: '1px solid rgba(255,255,255,0.6)',
          borderRadius: '3px',
          color: 'inherit',
          cursor: status === 'loading' ? 'wait' : 'pointer',
          flexShrink: 0,
          fontFamily: 'inherit',
          fontSize: 'inherit',
          padding: '1px 8px',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </button>
      <span
        aria-live="polite"
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}
      >
        {status === 'done' ? 'Product synced from Shopify' : status === 'error' ? `Sync failed: ${error}` : ''}
      </span>
    </>
  )
}
