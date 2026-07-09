'use client'

import { useState } from 'react'
import { Button, toast } from '@payloadcms/ui'

export function SeedRedirectsButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')

  const handleSeed = async () => {
    if (status === 'loading') return

    const confirmed = confirm(
      `Seed missing redirects from the seed file (~586 entries)?\n\nCovers product pages (SK, CA, CN, GX, GL, K-series, hybrids, etc.), WooCommerce categories/tags, artists, CMS pages, and GSC legacy-URL exports.\n\nOnly NEW entries are created — existing records (including your manual edits) are never touched.`,
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

      const { created, updated, skipped, errors } = data
      if (errors?.length) {
        toast.error(
          `Done with ${errors.length} error(s). ${created} created, ${skipped} existing skipped.`,
        )
      } else {
        toast.success(`Done! ${created} created, ${skipped} existing skipped (untouched).`)
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
            : '🌱 Seed Missing Redirects'}
      </Button>
    </div>
  )
}
