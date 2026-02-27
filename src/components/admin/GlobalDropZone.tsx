'use client'

import { useEffect, useRef, useState } from 'react'
import { useMediaManager } from './media-manager/MediaManagerProvider'

/**
 * GlobalDropZone
 *
 * Listens for file drag events anywhere in the admin dashboard.
 * When files are dragged over the window, shows a fullscreen drop target.
 * On drop: opens the media manager modal and passes the files for upload.
 *
 * Uses a ref counter (not just enter/leave events) to handle the fact that
 * dragenter/dragleave fire as the cursor crosses child element boundaries.
 */
export function GlobalDropZone() {
  const { openModal, handleFilesSelected } = useMediaManager()
  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)

  useEffect(() => {
    const onDragEnter = (e: DragEvent) => {
      if (!e.dataTransfer?.types.includes('Files')) return
      e.preventDefault()
      dragCounter.current++
      if (dragCounter.current === 1) setIsDragging(true)
    }

    const onDragOver = (e: DragEvent) => {
      if (!e.dataTransfer?.types.includes('Files')) return
      e.preventDefault()
      // Required to allow drop
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'
    }

    const onDragLeave = (e: DragEvent) => {
      dragCounter.current--
      if (dragCounter.current === 0) setIsDragging(false)
    }

    const onDrop = (e: DragEvent) => {
      e.preventDefault()
      dragCounter.current = 0
      setIsDragging(false)

      const files = e.dataTransfer?.files
      if (!files || files.length === 0) return

      openModal()
      // Small delay so the modal mounts before we try to hand off files
      setTimeout(() => handleFilesSelected(files), 50)
    }

    window.addEventListener('dragenter', onDragEnter)
    window.addEventListener('dragover', onDragOver)
    window.addEventListener('dragleave', onDragLeave)
    window.addEventListener('drop', onDrop)

    return () => {
      window.removeEventListener('dragenter', onDragEnter)
      window.removeEventListener('dragover', onDragOver)
      window.removeEventListener('dragleave', onDragLeave)
      window.removeEventListener('drop', onDrop)
    }
  }, [openModal, handleFilesSelected])

  if (!isDragging) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(4px)',
        pointerEvents: 'none',
      }}
    >
      {/* Drop target ring */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          border: '2px dashed rgba(255,255,255,0.7)',
          borderRadius: 16,
          padding: '48px 64px',
          color: '#fff',
        }}
      >
        {/* Upload icon */}
        <svg
          width={48}
          height={48}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0.9 }}
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>

        <p style={{ margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em' }}>
          Drop to upload
        </p>
        <p style={{ margin: 0, fontSize: 14, opacity: 0.7 }}>
          Files will open in the media manager
        </p>
      </div>
    </div>
  )
}
