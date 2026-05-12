'use client'

import { Button, toast } from '@payloadcms/ui'
import { useState } from 'react'

/**
 * Shown in the Artists collection list view (admin.components.beforeList).
 * Seeds the artists collection from the built-in CSV seed data.
 * Deduplicates by slug — existing records are always skipped.
 */
export function SeedArtistsButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')

  const handleSeed = async () => {
    if (status === 'loading') return
    setStatus('loading')
    try {
      const res = await fetch('/api/admin/seed-artists', { method: 'POST' })
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
        {status === 'loading' ? 'Seeding…' : status === 'done' ? '✓ Done' : '🌱 Seed Artists'}
      </Button>
    </div>
  )
}
