'use client'

import { useState } from 'react'
import { Button, toast } from '@payloadcms/ui'

export function SeedRedirectsButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')

  const handleSeed = async () => {
    if (status === 'loading') return

    const confirmed = confirm(
      `Seed/update ~500 redirects from kawaius-redirect-map.csv?\n\nCovers product pages (SK, CA, CN, GX, GL, K-series, hybrids, etc.), WooCommerce categories/tags, artists, and CMS pages.\n\nExisting records will be OVERWRITTEN with corrected destinations.`,
    )
    if (!confirmed) return

    setStatus('loading')

    try {
      const res = await fetch('/api/admin/seed-redirects', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? 'Seed failed.')
        setStatus('idle')
        return
      }

      const { created, updated, errors } = data
      if (errors?.length) {
        toast.error(`Done with ${errors.length} error(s). ${created} created, ${updated} updated.`)
      } else {
        toast.success(`Done! ${created} created, ${updated} updated.`)
      }

      setStatus('done')
      if (created > 0 || updated > 0) {
        setTimeout(() => window.location.reload(), 1500)
      } else {
        setTimeout(() => setStatus('idle'), 4000)
      }
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
        {status === 'loading'
          ? 'Seeding…'
          : status === 'done'
            ? '✓ Done'
            : '🌱 Seed / Update Redirects'}
      </Button>
    </div>
  )
}
