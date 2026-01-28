/**
 * MediaUrlSelectorButton Component
 *
 * A custom component that integrates with Payload's text fields to allow selecting
 * media from the MediaManager library and populating the field with the media URL.
 *
 * Unlike MediaSelectorButton (which stores relationship IDs), this component stores
 * the actual URL string of the selected media, making it useful for cases where you
 * want direct URL storage but still want the convenience of the media library picker.
 *
 * Usage in collection config:
 * ```typescript
 * {
 *   name: 'imageUrl',
 *   type: 'text',
 *   admin: {
 *     components: {
 *       beforeInput: ['/components/admin/MediaUrlSelectorButton#MediaUrlSelectorButton'],
 *     },
 *   },
 * }
 * ```
 */
'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'
import { useMediaManager } from './media-manager/MediaManagerProvider'
import type { Media } from '@/payload-types'

/**
 * Button component for selecting media from the library and storing its URL
 */
export const MediaUrlSelectorButton: React.FC = () => {
  const { value, setValue } = useField<string>({ path: '' })
  const { openModal, isOpen } = useMediaManager()

  const handleOpenLibrary = () => {
    console.log('[MediaUrlSelectorButton] Opening modal in select mode')
    openModal({
      mode: 'select',
      onSelect: (media: Media) => {
        console.log('[MediaUrlSelectorButton] Media selected:', media.id, media.url)
        // Extract and set the URL from the selected media
        if (media.url) {
          setValue(media.url)
        } else {
          console.warn('[MediaUrlSelectorButton] Selected media has no URL')
        }
      },
    })
    console.log('[MediaUrlSelectorButton] Modal state after open:', isOpen)
  }

  // Check if the current value looks like a URL
  const isUrl = typeof value === 'string' && value && (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('/')
  )

  return (
    <div className="media-url-selector-button-wrapper" style={{ marginBottom: '1rem' }}>
      <button
        type="button"
        onClick={handleOpenLibrary}
        className="btn btn--style-secondary btn--size-medium"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>Browse Media Library</span>
      </button>
      {isUrl && (
        <p
          style={{
            marginTop: '0.5rem',
            fontSize: '0.875rem',
            color: 'var(--theme-success-500)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
          URL selected from library
        </p>
      )}
    </div>
  )
}
