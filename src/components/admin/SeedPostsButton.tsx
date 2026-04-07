'use client'

import { useState } from 'react'
import { Button, toast } from '@payloadcms/ui'

/**
 * Shown in the Posts collection list view (admin.components.beforeList).
 * Seeds the posts collection from the built-in CSV seed data (kawaius_blogs.csv).
 * Deduplicates by slug — existing records are always skipped.
 */
export function SeedPostsButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')

  const handleSeed = async () => {
    if (status === 'loading') return

    const confirmed = confirm(
      `Seed 50 blog posts from kawaius_blogs.csv?\n\nExisting posts (matched by slug) will be skipped. This cannot be undone.`,
    )
    if (!confirmed) return

    setStatus('loading')

    try {
      const res = await fetch('/api/admin/seed-posts', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? 'Seed failed.')
        setStatus('idle')
        return
      }

      const { created, skipped, errors } = data
      if (errors?.length) {
        toast.error(
          `Done with ${errors.length} error(s). ${created} created, ${skipped} skipped.`,
        )
      } else {
        toast.success(`Seeded! ${created} created, ${skipped} already existed.`)
      }

      setStatus('done')
      if (created > 0) {
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
            : '🌱 Seed Blog Posts'}
      </Button>
    </div>
  )
}
