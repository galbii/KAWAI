'use client'

import { useState } from 'react'
import { useFormFields, useDocumentInfo, Button, toast } from '@payloadcms/ui'

const LinkIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    style={{ display: 'inline-block', flexShrink: 0 }}
  >
    <path
      d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1 1M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1-1"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/**
 * Registered on a collection's admin.components.edit.beforeDocumentControls.
 * Fetches a share URL with PREVIEW_SECRET embedded and copies it to clipboard.
 * Reviewers who open the URL can view the draft without logging in.
 *
 * Supported collections are configured in
 * /api/admin/share-preview-link → PATH_PREFIX_BY_COLLECTION.
 */
export function SharePreviewLinkButton() {
  const { id, collectionSlug } = useDocumentInfo()
  const slug = useFormFields(([fields]) => fields['slug']?.value as string | undefined)
  const [loading, setLoading] = useState(false)

  if (!id || !slug || !collectionSlug) return null

  const handleClick = async () => {
    if (loading) return
    setLoading(true)
    try {
      const params = new URLSearchParams({ collection: collectionSlug, slug })
      const res = await fetch(`/api/admin/share-preview-link?${params.toString()}`)
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Failed to generate share link.')
        return
      }
      await navigator.clipboard.writeText(data.url)
      toast.success('Share link copied to clipboard.')
    } catch (err) {
      console.error(err)
      toast.error('Could not copy share link.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      buttonStyle="secondary"
      size="small"
      type="button"
      icon={<LinkIcon />}
    >
      {loading ? 'Copying…' : 'Copy Share Link'}
    </Button>
  )
}
