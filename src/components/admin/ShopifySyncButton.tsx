'use client'

import { useDocumentInfo, Button, toast } from '@payloadcms/ui'
import { useState } from 'react'
import { syncProductWithShopify } from '@/lib/actions/sync-product-shopify'

const SyncIcon = ({ spinning }: { spinning: boolean }) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    style={{
      display: 'inline-block',
      flexShrink: 0,
      animation: spinning ? 'spin 1s linear infinite' : 'none',
    }}
  >
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <path
      d="M4 12a8 8 0 018-8V2L20 6l-8 4V8a6 6 0 100 6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export function ShopifySyncButton() {
  const { id } = useDocumentInfo()
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  // Only show on saved documents
  if (!id) return null

  const handleSync = async () => {
    if (status === 'loading') return
    setStatus('loading')

    try {
      const result = await syncProductWithShopify(id as string)

      if (result.success) {
        toast.success(`Synced: ${result.product?.name ?? 'product updated'}`)
        setStatus('done')
        setTimeout(() => {
          setStatus('idle')
          window.location.reload()
        }, 1200)
      } else {
        toast.error(result.error ?? result.message)
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3000)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Sync failed')
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const label =
    status === 'loading' ? 'Syncing…' :
    status === 'done'    ? '✓ Synced' :
    status === 'error'   ? 'Retry Sync' :
    'Sync from Shopify'

  return (
    <Button
      onClick={handleSync}
      disabled={status === 'loading' || status === 'done'}
      buttonStyle="secondary"
      size="small"
      type="button"
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <SyncIcon spinning={status === 'loading'} />
        {label}
      </span>
    </Button>
  )
}
