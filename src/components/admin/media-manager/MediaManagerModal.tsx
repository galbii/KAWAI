'use client'

import { useCallback, useState, useRef, useEffect, type DragEvent } from 'react'
import { useMediaManager } from './MediaManagerProvider'
import type { FolderTreeNode } from './types'
import { MediaGrid } from './MediaGrid'
import { FolderTree } from './FolderTree'
import { ToastContainer } from './Toast'
import { ImageEditor } from './ImageEditor'
import { MediaEditPanel } from './MediaEditPanel'
import { VideoCompressor } from './VideoCompressor'

// ─── Design tokens ──────────────────────────────────────────────────────────
const c = {
  bg:      '#0C0C0F',
  panel:   '#111116',
  surface: '#16161E',
  card:    '#1C1C26',
  input:   '#12121A',
  hover:   '#1E1E2A',

  line:    '#252535',
  lineSub: '#1C1C28',
  lineFocus: '#6366F1',

  high:  '#ECECF2',
  mid:   '#8484A0',
  lo:    '#4C4C68',

  violet:    '#6366F1',
  violetHov: '#5558E0',
  violetGlow:'rgba(99,102,241,0.10)',
  violetRing:'rgba(99,102,241,0.25)',

  jade:     '#2EC4A0',
  jadeFill: 'rgba(46,196,160,0.08)',
  rose:     '#F16C6C',
  roseFill: 'rgba(241,108,108,0.08)',
  gold:     '#E8A84E',
  goldFill: 'rgba(232,168,78,0.10)',

  white: '#ffffff',
  black: '#000000',
  backdrop: 'rgba(4,4,8,0.82)',
}

// ─── Reusable footer-bar button style ────────────────────────────────────────
function fbtn(extra: React.CSSProperties = {}): React.CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    height: 40,
    padding: '0 14px',
    borderRadius: 7,
    background: 'transparent',
    border: `1px solid ${c.line}`,
    color: c.mid,
    fontSize: 13.5,
    fontWeight: 500,
    cursor: 'pointer',
    outline: 'none',
    whiteSpace: 'nowrap' as const,
    transition: 'background 0.1s, border-color 0.1s, color 0.1s',
    textDecoration: 'none',
    ...extra,
  }
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function MediaManagerModal() {
  const {
    isOpen,
    closeModal,
    handleFilesSelected,
    isUploading,
    error,
    searchQuery,
    setSearchQuery,
    fileTypeFilter,
    setFileTypeFilter,
    sortOrder,
    setSortOrder,
    selectedMedia,
    copyPublicUrl,
    totalDocs,
    toasts,
    dismissToast,
    showToast,
    editingFile,
    editingMedia,
    setEditingFile,
    setEditingMedia,
    uploadWithMetadata,
    skipEditing,
    pendingFiles,
    currentFolder,
    folders,
    folderTree,
    moveMediaToFolder,
    replaceMediaFile,
    modalOptions,
    compressingVideoFile,
    onVideoCompressed,
    onVideoSkipped,
    onVideoCancel,
  } = useMediaManager()

  const [isDragging, setIsDragging] = useState(false)
  const [showMoveMenu, setShowMoveMenu] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoadingEditFile, setIsLoadingEditFile] = useState(false)
  const [editingExistingFile, setEditingExistingFile] = useState<File | null>(null)
  const [editingExistingMediaId, setEditingExistingMediaId] = useState<string | null>(null)
  const [isAnimatingIn, setIsAnimatingIn] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragCounterRef = useRef(0)

  // Trigger entrance animation when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsAnimatingIn(true)
    }
  }, [isOpen])

  // Keyboard escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !editingFile) closeModal()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, closeModal, editingFile])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Debug
  useEffect(() => {
    console.log('[MediaManagerModal] State changed:', { isOpen, mode: modalOptions?.mode })
  }, [isOpen, modalOptions])

  // Drag handlers
  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault(); e.stopPropagation()
    dragCounterRef.current++
    if (e.dataTransfer.items?.length > 0) setIsDragging(true)
  }, [])
  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault(); e.stopPropagation()
    if (--dragCounterRef.current === 0) setIsDragging(false)
  }, [])
  const handleDragOver = useCallback((e: DragEvent) => { e.preventDefault(); e.stopPropagation() }, [])
  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault(); e.stopPropagation()
    setIsDragging(false); dragCounterRef.current = 0
    const files = e.dataTransfer.files
    if (files?.length > 0) handleFilesSelected(files)
  }, [handleFilesSelected])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) handleFilesSelected(files)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [handleFilesSelected])

  const handleMoveToFolder = useCallback(async (folderId: string | null) => {
    if (selectedMedia) {
      await moveMediaToFolder(selectedMedia.id, folderId)
      setShowMoveMenu(false)
    }
  }, [selectedMedia, moveMediaToFolder])

  const handleSelect = useCallback(() => {
    if (selectedMedia && modalOptions?.onSelect) {
      modalOptions.onSelect(selectedMedia)
      closeModal()
    }
  }, [selectedMedia, modalOptions, closeModal])

  const handleEditImage = useCallback(async () => {
    if (!selectedMedia || !selectedMedia.mimeType?.startsWith('image/')) return
    setIsLoadingEditFile(true)
    try {
      // Fetch via same-origin proxy — direct R2 fetches fail due to CORS
      const response = await fetch(`/api/admin/media-proxy?id=${selectedMedia.id}`)
      if (!response.ok) throw new Error(`Proxy returned ${response.status}`)
      const blob = await response.blob()
      const file = new File([blob], selectedMedia.filename, { type: selectedMedia.mimeType })
      setEditingExistingMediaId(selectedMedia.id)
      setEditingExistingFile(file)
    } catch (err) {
      showToast('error', 'Failed to load image for editing')
    } finally {
      setIsLoadingEditFile(false)
    }
  }, [selectedMedia, showToast])

  const isSelectionMode = modalOptions?.mode === 'select'

  // ─── Recursive move-menu folder renderer ───────────────────────────────────
  function renderMoveFolderTree(
    nodes: FolderTreeNode[],
    onMove: (id: string | null) => void,
    depth: number
  ): React.ReactNode {
    return nodes.map((node) => (
      <div key={node.id}>
        <MoveMenuItem label={node.name} onClick={() => onMove(node.id)} isFolder depth={depth} />
        {node.children.length > 0 && renderMoveFolderTree(node.children, onMove, depth + 1)}
      </div>
    ))
  }

  if (!isOpen) return null

  return (
    <>
      {/* ── Keyframe animations ──────────────────────────────────────────── */}
      <style>{`
        @keyframes mmBackdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes mmModalIn {
          from { opacity: 0; transform: scale(0.975) translateY(10px); }
          to   { opacity: 1; transform: scale(1)     translateY(0); }
        }
        @keyframes mmSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes mmFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>

      {/* ── Backdrop + modal shell ───────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}
      >
        {/* Backdrop */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: c.backdrop,
            backdropFilter: 'blur(6px)',
            animation: 'mmBackdropIn 0.2s ease forwards',
          }}
          onClick={closeModal}
        />

        {/* Modal container */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 1600,
            height: '90vh',
            display: 'flex',
            flexDirection: 'column',
            background: c.bg,
            border: `1px solid ${c.line}`,
            borderRadius: 14,
            boxShadow: '0 32px 96px rgba(0,0,0,0.8), 0 8px 32px rgba(0,0,0,0.5)',
            color: c.high,
            overflow: 'hidden',
            animation: 'mmModalIn 0.22s cubic-bezier(0.22,1,0.36,1) forwards',
          }}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >

          {/* ── Header toolbar ─────────────────────────────────────────────── */}
          <div
            style={{
              flexShrink: 0,
              height: 72,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '0 18px',
              borderBottom: `1px solid ${c.line}`,
              background: c.panel,
            }}
          >
            {/* Left: title + breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 180, flexShrink: 0 }}>
              {/* Icon */}
              <div style={{
                width: 34, height: 34,
                borderRadius: 8,
                background: c.violetGlow,
                border: `1px solid ${c.violetRing}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.violet} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>

              <span style={{ fontSize: 17, fontWeight: 600, color: c.high, letterSpacing: '-0.015em', lineHeight: 1 }}>
                {isSelectionMode ? 'Select Media' : 'Media Library'}
              </span>

              {/* Count chip */}
              <span style={{
                fontSize: 13,
                color: c.lo,
                background: c.card,
                border: `1px solid ${c.lineSub}`,
                borderRadius: 5,
                padding: '2px 7px',
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1.6,
              }}>
                {totalDocs.toLocaleString()}
              </span>

              {/* Folder breadcrumb */}
              {currentFolder && (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c.lo} strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                  <span style={{ fontSize: 14, color: c.mid, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentFolder.name}
                  </span>
                </>
              )}

              {/* Selection mode badge */}
              {isSelectionMode && (
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: c.violet,
                  background: c.violetGlow,
                  border: `1px solid ${c.violetRing}`,
                  borderRadius: 5,
                  padding: '2px 8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  lineHeight: 1.6,
                }}>
                  Select
                </span>
              )}
            </div>

            {/* Center: search */}
            <div style={{ flex: 1, position: 'relative', maxWidth: 520, margin: '0 auto' }}>
              <input
                type="text"
                placeholder="Search files…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  height: 40,
                  background: c.input,
                  border: `1px solid ${c.line}`,
                  borderRadius: 7,
                  color: c.high,
                  fontSize: 14,
                  padding: '0 14px 0 40px',
                  outline: 'none',
                  transition: 'border-color 0.12s',
                }}
                onFocus={(e) => { e.target.style.borderColor = c.lineFocus }}
                onBlur={(e) => { e.target.style.borderColor = c.line }}
              />
              <svg
                width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke={c.lo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            {/* Right: actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, marginLeft: 'auto' }}>

              {/* Upload */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  height: 42, padding: '0 16px',
                  borderRadius: 7,
                  background: c.violet,
                  border: 'none',
                  color: c.white,
                  fontSize: 14, fontWeight: 500,
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  opacity: isUploading ? 0.55 : 1,
                  outline: 'none',
                  transition: 'background 0.12s, opacity 0.12s',
                }}
                onMouseEnter={(e) => { if (!isUploading) e.currentTarget.style.background = c.violetHov }}
                onMouseLeave={(e) => { e.currentTarget.style.background = c.violet }}
              >
                {isUploading ? (
                  <>
                    <span style={{
                      width: 14, height: 14,
                      border: '1.5px solid rgba(255,255,255,0.35)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      display: 'inline-block',
                      animation: 'spin 0.75s linear infinite',
                    }} />
                    <span>Uploading</span>
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="19" x2="12" y2="5" />
                      <polyline points="5 12 12 5 19 12" />
                    </svg>
                    <span>Upload</span>
                  </>
                )}
              </button>
              <input ref={fileInputRef} type="file" multiple accept="image/*,video/*,audio/*,application/pdf" onChange={handleFileSelect} style={{ display: 'none' }} />

              {/* Close */}
              <HeaderIconBtn title="Close" onClick={closeModal} danger>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </HeaderIconBtn>
            </div>
          </div>

          {/* ── Error banner ────────────────────────────────────────────────── */}
          {error && (
            <div style={{
              flexShrink: 0,
              padding: '9px 20px',
              background: c.roseFill,
              borderBottom: `1px solid rgba(241,108,108,0.2)`,
              display: 'flex', alignItems: 'center', gap: 9,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.rose} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span style={{ fontSize: 13.5, color: c.rose }}>{error}</span>
            </div>
          )}

          {/* ── Filter / sort toolbar ────────────────────────────────────────── */}
          <div
            style={{
              flexShrink: 0,
              height: 46,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '0 16px',
              borderBottom: `1px solid ${c.line}`,
              background: c.panel,
            }}
          >
            {/* File type pills */}
            {(['all', 'image', 'video', 'audio', 'pdf'] as const).map((type) => {
              const active = type === 'all' ? fileTypeFilter === null : fileTypeFilter === type
              const labels: Record<string, string> = { all: 'All', image: 'Images', video: 'Videos', audio: 'Audio', pdf: 'PDFs' }
              const icons: Record<string, React.ReactNode> = {
                all: (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                  </svg>
                ),
                image: (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                ),
                video: (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
                  </svg>
                ),
                audio: (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                  </svg>
                ),
                pdf: (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                ),
              }
              return (
                <button
                  key={type}
                  onClick={() => setFileTypeFilter(type === 'all' ? null : type)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    height: 28, padding: '0 10px',
                    borderRadius: 5,
                    background: active ? c.violetGlow : 'transparent',
                    border: `1px solid ${active ? c.violetRing : c.line}`,
                    color: active ? c.violet : c.mid,
                    fontSize: 12.5, fontWeight: active ? 600 : 400,
                    cursor: 'pointer', outline: 'none',
                    transition: 'all 0.1s',
                    whiteSpace: 'nowrap' as const,
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = c.hover
                      e.currentTarget.style.color = c.high
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = c.mid
                    }
                  }}
                >
                  {icons[type]}
                  {labels[type]}
                </button>
              )
            })}

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Sort */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c.lo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/>
              </svg>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                style={{
                  height: 28,
                  background: c.input,
                  border: `1px solid ${c.line}`,
                  borderRadius: 5,
                  color: c.mid,
                  fontSize: 12.5,
                  padding: '0 8px',
                  cursor: 'pointer',
                  outline: 'none',
                }}
                onFocus={(e) => { e.target.style.borderColor = c.lineFocus }}
                onBlur={(e) => { e.target.style.borderColor = c.line }}
              >
                <option value="-createdAt">Newest first</option>
                <option value="createdAt">Oldest first</option>
                <option value="filename">Name A → Z</option>
                <option value="-filename">Name Z → A</option>
                <option value="-filesize">Largest first</option>
                <option value="filesize">Smallest first</option>
              </select>
            </div>
          </div>

          {/* ── Body ────────────────────────────────────────────────────────── */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
            {/* Sidebar panel */}
            <div
              style={{
                flexShrink: 0,
                width: sidebarCollapsed ? 0 : 300,
                overflow: 'hidden',
                background: c.panel,
                transition: 'width 0.22s cubic-bezier(0.4,0,0.2,1)',
              }}
            >
              <FolderTree />
            </div>

            {/* Sidebar toggle strip — always visible, rides the sidebar/grid border */}
            <button
              title={sidebarCollapsed ? 'Show folders' : 'Hide folders'}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{
                flexShrink: 0,
                width: 18,
                background: c.panel,
                border: 'none',
                borderRight: `1px solid ${c.line}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                paddingTop: 14,
                color: c.lo,
                transition: 'background 0.1s, color 0.1s',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = c.hover
                e.currentTarget.style.color = c.high
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = c.panel
                e.currentTarget.style.color = c.lo
              }}
            >
              <svg
                width="10" height="10" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
                style={{ transition: 'transform 0.22s cubic-bezier(0.4,0,0.2,1)', transform: sidebarCollapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Grid area */}
            <div style={{ flex: 1, position: 'relative', background: c.bg }}>
              <MediaGrid />

              {/* Drag overlay */}
              {isDragging && (
                <div
                  style={{
                    position: 'absolute', inset: 0, zIndex: 10,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(12,12,15,0.88)',
                    backdropFilter: 'blur(4px)',
                    border: `2px dashed ${c.violet}`,
                  }}
                >
                  <div style={{
                    width: 76, height: 76, borderRadius: 18,
                    background: c.violetGlow, border: `1px solid ${c.violetRing}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 18,
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={c.violet} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 16 12 12 8 16" />
                      <line x1="12" y1="12" x2="12" y2="21" />
                      <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
                    </svg>
                  </div>
                  <p style={{ fontSize: 18, fontWeight: 600, color: c.high, margin: 0, marginBottom: 5 }}>Drop to upload</p>
                  <p style={{ fontSize: 14, color: c.mid, margin: 0 }}>
                    {currentFolder ? `Into "${currentFolder.name}"` : 'Images will open in editor'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Footer: selected media ──────────────────────────────────────── */}
          {selectedMedia && (
            <div
              style={{
                flexShrink: 0,
                height: 78,
                display: 'flex',
                alignItems: 'center',
                padding: '0 18px',
                gap: 12,
                borderTop: `1px solid ${c.line}`,
                background: c.panel,
                animation: 'mmSlideDown 0.18s ease forwards',
              }}
            >
              {/* Thumbnail */}
              <div style={{
                width: 54, height: 54, borderRadius: 8, overflow: 'hidden',
                flexShrink: 0, border: `1px solid ${c.line}`,
                background: c.card,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {selectedMedia.mimeType?.startsWith('image/') ? (
                  <img
                    src={selectedMedia.sizes?.thumbnail?.url || selectedMedia.publicUrl || selectedMedia.url}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c.mid} strokeWidth="1.75">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                )}
              </div>

              {/* File info */}
              <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                <div style={{
                  fontSize: 15, fontWeight: 500, color: c.high,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  lineHeight: 1.4,
                }}>
                  {selectedMedia.filename}
                </div>
                <div style={{
                  fontSize: 13, color: c.lo, display: 'flex', alignItems: 'center', gap: 6,
                  lineHeight: 1.4, marginTop: 1,
                }}>
                  {selectedMedia.width && selectedMedia.height && (
                    <span>{selectedMedia.width} × {selectedMedia.height}px</span>
                  )}
                  {selectedMedia.width && selectedMedia.filesize > 0 && (
                    <span style={{ color: c.lineSub }}>·</span>
                  )}
                  {selectedMedia.filesize > 0 && (
                    <span>{formatFileSize(selectedMedia.filesize)}</span>
                  )}
                  {selectedMedia.folder && (
                    <>
                      <span style={{ color: c.lineSub }}>·</span>
                      <span style={{ color: c.gold }}>
                        {typeof selectedMedia.folder === 'string' ? selectedMedia.folder : selectedMedia.folder.name}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div style={{ width: 1, height: 32, background: c.line, flexShrink: 0 }} />

              {/* Action buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                {/* Move (browse mode only) */}
                {!isSelectionMode && (
                  <div style={{ position: 'relative' }}>
                    <button
                      style={fbtn()}
                      onClick={() => setShowMoveMenu(!showMoveMenu)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = c.hover
                        e.currentTarget.style.borderColor = c.line
                        e.currentTarget.style.color = c.high
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = c.mid
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      Move
                    </button>

                    {showMoveMenu && (
                      <>
                        <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setShowMoveMenu(false)} />
                        <div style={{
                          position: 'absolute', bottom: '100%', right: 0, marginBottom: 6,
                          minWidth: 220, maxWidth: 280, maxHeight: 320,
                          background: c.card, border: `1px solid ${c.line}`, borderRadius: 9,
                          boxShadow: '0 12px 36px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.4)',
                          zIndex: 20, overflowY: 'auto',
                          paddingTop: 4, paddingBottom: 4,
                          animation: 'mmSlideDown 0.15s ease forwards',
                        }}>
                          <MoveMenuItem label="Root (no folder)" onClick={() => handleMoveToFolder(null)} depth={0} />
                          {folderTree.length > 0 && <div style={{ height: 1, background: c.line, margin: '4px 6px' }} />}
                          {renderMoveFolderTree(folderTree, handleMoveToFolder, 0)}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Edit Image — images only */}
                {selectedMedia.mimeType?.startsWith('image/') && (
                  <button
                    style={fbtn()}
                    onClick={handleEditImage}
                    disabled={isLoadingEditFile || isUploading}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = c.hover
                      e.currentTarget.style.color = c.high
                      e.currentTarget.style.borderColor = c.line
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = c.mid
                    }}
                  >
                    {isLoadingEditFile ? (
                      <>
                        <span style={{
                          width: 12, height: 12,
                          border: '1.5px solid rgba(132,132,160,0.4)',
                          borderTopColor: c.mid,
                          borderRadius: '50%',
                          display: 'inline-block',
                          animation: 'spin 0.75s linear infinite',
                          flexShrink: 0,
                        }} />
                        Loading…
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Edit Image
                      </>
                    )}
                  </button>
                )}

                {/* Edit Metadata */}
                <button
                  style={fbtn()}
                  onClick={() => setEditingMedia(selectedMedia)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = c.hover
                    e.currentTarget.style.color = c.high
                    e.currentTarget.style.borderColor = c.line
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = c.mid
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  Edit Metadata
                </button>

                {/* Copy URL */}
                <button
                  style={fbtn()}
                  onClick={() => copyPublicUrl(selectedMedia.publicUrl || selectedMedia.url)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = c.hover
                    e.currentTarget.style.color = c.high
                    e.currentTarget.style.borderColor = c.line
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = c.mid
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                  </svg>
                  Copy URL
                </button>

                {/* Download */}
                <a
                  href={selectedMedia.publicUrl || selectedMedia.url}
                  download={selectedMedia.filename}
                  style={fbtn()}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = c.hover
                    e.currentTarget.style.color = c.high
                    e.currentTarget.style.borderColor = c.line
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = c.mid
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download
                </a>

                {/* Open in new tab */}
                <a
                  href={selectedMedia.publicUrl || selectedMedia.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={fbtn()}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = c.hover
                    e.currentTarget.style.color = c.high
                    e.currentTarget.style.borderColor = c.line
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = c.mid
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Open
                </a>

                {/* Select (selection mode only) */}
                {isSelectionMode && (
                  <button
                    onClick={handleSelect}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      height: 40, padding: '0 18px',
                      borderRadius: 7,
                      background: c.violet, border: 'none',
                      color: c.white, fontSize: 14, fontWeight: 600,
                      cursor: 'pointer', outline: 'none',
                      marginLeft: 4,
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = c.violetHov }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = c.violet }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Select
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Image Editor (with inline metadata sidebar) ──────────────────── */}
      {editingFile && (
        <ImageEditor
          file={editingFile}
          onSave={(editedFile, metadata) => {
            uploadWithMetadata(editedFile, metadata)
          }}
          onCancel={() => {
            if (pendingFiles.length > 1) {
              skipEditing()
            } else {
              setEditingFile(null)
            }
          }}
        />
      )}

      {/* ── Edit Existing Image ──────────────────────────────────────────── */}
      {editingExistingFile && editingExistingMediaId && (
        <ImageEditor
          file={editingExistingFile}
          onSave={async (editedFile, metadata) => {
            setEditingExistingFile(null)
            if (editingExistingMediaId) {
              await replaceMediaFile(editingExistingMediaId, editedFile, metadata.convertToWebp)
            }
            setEditingExistingMediaId(null)
          }}
          onCancel={() => {
            setEditingExistingFile(null)
            setEditingExistingMediaId(null)
          }}
        />
      )}

      {/* ── Video Compressor ─────────────────────────────────────────────── */}
      {compressingVideoFile && (
        <VideoCompressor
          file={compressingVideoFile}
          onComplete={onVideoCompressed}
          onSkip={onVideoSkipped}
          onCancel={onVideoCancel}
        />
      )}

      {/* ── Edit Panel ───────────────────────────────────────────────────── */}
      {editingMedia && (
        <MediaEditPanel
          media={editingMedia}
          onClose={() => setEditingMedia(null)}
        />
      )}

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function HeaderIconBtn({
  children,
  title,
  onClick,
  active,
  danger,
}: {
  children: React.ReactNode
  title: string
  onClick: () => void
  active?: boolean
  danger?: boolean
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 42, height: 42,
        borderRadius: 7,
        background: active ? c.card : c.card,
        border: `1px solid ${c.line}`,
        color: c.mid,
        cursor: 'pointer', outline: 'none',
        transition: 'background 0.1s, border-color 0.1s, color 0.1s',
      }}
      onMouseEnter={(e) => {
        if (danger) {
          e.currentTarget.style.background = c.roseFill
          e.currentTarget.style.borderColor = 'rgba(241,108,108,0.3)'
          e.currentTarget.style.color = c.rose
        } else {
          e.currentTarget.style.background = c.hover
          e.currentTarget.style.color = c.high
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = c.card
        e.currentTarget.style.borderColor = c.line
        e.currentTarget.style.color = c.mid
      }}
    >
      {children}
    </button>
  )
}

function MoveMenuItem({ label, onClick, isFolder, depth = 0 }: { label: string; onClick: () => void; isFolder?: boolean; depth?: number }) {
  const indent = 16 + depth * 16
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 8,
        padding: `6px 14px 6px ${indent}px`,
        background: 'transparent',
        border: 'none',
        color: depth === 0 ? c.mid : c.lo,
        fontSize: depth === 0 ? 13 : 12.5,
        cursor: 'pointer', outline: 'none',
        transition: 'background 0.1s, color 0.1s',
        textAlign: 'left',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = c.hover
        e.currentTarget.style.color = c.high
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = depth === 0 ? c.mid : c.lo
      }}
    >
      {isFolder ? (
        <>
          {depth > 0 && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={c.lo} strokeWidth="2.5" style={{ flexShrink: 0 }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          )}
          <svg width="13" height="13" viewBox="0 0 24 24" fill={depth === 0 ? c.gold : 'rgba(232,168,78,0.6)'} stroke="none" style={{ flexShrink: 0 }}>
            <path d="M3 7V17a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6.586a1 1 0 01-.707-.293L10 5H5a2 2 0 00-2 2z" />
          </svg>
        </>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c.lo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      )}
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
    </button>
  )
}

// ─── Utilities ───────────────────────────────────────────────────────────────
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}
