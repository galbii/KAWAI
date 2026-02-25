'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useMediaManager } from './MediaManagerProvider'
import type { MediaItem, FolderItem } from './types'

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

  high:  '#ECECF2',
  mid:   '#8484A0',
  lo:    '#4C4C68',

  violet:    '#6366F1',
  violetRing:'rgba(99,102,241,0.35)',
  violetGlow:'rgba(99,102,241,0.08)',

  jade:     '#2EC4A0',
  rose:     '#F16C6C',
  roseFill: 'rgba(241,108,108,0.08)',
  gold:     '#E8A84E',

  white: '#ffffff',
  black: '#000000',
}

// ─── MIME type → short badge label ───────────────────────────────────────────
function mimeLabel(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'JPG', 'image/jpg': 'JPG', 'image/png': 'PNG',
    'image/webp': 'WEBP', 'image/gif': 'GIF', 'image/svg+xml': 'SVG',
    'image/avif': 'AVIF', 'image/tiff': 'TIFF',
    'video/mp4': 'MP4', 'video/webm': 'WEBM', 'video/quicktime': 'MOV',
    'audio/mpeg': 'MP3', 'audio/wav': 'WAV', 'audio/ogg': 'OGG',
    'application/pdf': 'PDF',
  }
  return map[mimeType] ?? mimeType?.split('/')[1]?.toUpperCase().slice(0, 5) ?? 'FILE'
}

// ─── Badge color by type ──────────────────────────────────────────────────────
function badgeColor(mimeType: string): string {
  if (mimeType?.startsWith('image/')) return 'rgba(99,102,241,0.75)'
  if (mimeType?.startsWith('video/')) return 'rgba(232,168,78,0.75)'
  if (mimeType?.startsWith('audio/')) return 'rgba(46,196,160,0.75)'
  if (mimeType === 'application/pdf') return 'rgba(241,108,108,0.75)'
  return 'rgba(132,132,160,0.75)'
}

// ─── MediaGrid ───────────────────────────────────────────────────────────────
export function MediaGrid() {
  const {
    media,
    isLoading,
    selectedMedia,
    selectMedia,
    copyPublicUrl,
    deleteMedia,
    currentPage,
    totalPages,
    fetchMedia,
    folders,
    moveMediaToFolder,
    subFolders,
    setCurrentFolder,
    moveFolderToFolder,
  } = useMediaManager()

  if (isLoading && media.length === 0) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100%', background: c.bg,
        flexDirection: 'column', gap: 10,
      }}>
        <div style={{
          width: 28, height: 28,
          border: `2px solid ${c.line}`,
          borderTopColor: c.violet,
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }} />
        <span style={{ fontSize: 14, color: c.lo }}>Loading…</span>
      </div>
    )
  }

  if (subFolders.length === 0 && media.length === 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '100%', background: c.bg, padding: 40,
      }}>
        <div style={{
          width: 70, height: 70, borderRadius: 16,
          background: c.card, border: `1px solid ${c.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 18,
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c.lo} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <p style={{ fontSize: 15, fontWeight: 500, color: c.mid, margin: 0, marginBottom: 5 }}>No files here</p>
        <p style={{ fontSize: 13, color: c.lo, margin: 0 }}>Drop files or click Upload to add media</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: c.bg }}>
      {/* Grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 26 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 14,
        }}>
          {/* Sub-folder tiles first */}
          {subFolders.map((folder) => (
            <FolderTile
              key={folder.id}
              folder={folder}
              onNavigate={() => setCurrentFolder(folder)}
              onDrop={(mediaId) => moveMediaToFolder(mediaId, folder.id)}
              onFolderDrop={(draggedFolderId) => moveFolderToFolder(draggedFolderId, folder.id)}
            />
          ))}

          {/* Media file tiles */}
          {media.map((item) => (
            <MediaGridItem
              key={item.id}
              item={item}
              isSelected={selectedMedia?.id === item.id}
              onSelect={() => selectMedia(selectedMedia?.id === item.id ? null : item)}
              onCopyUrl={() => copyPublicUrl(item.publicUrl || item.url)}
              onDelete={() => deleteMedia(item.id)}
              folders={folders}
              onMoveToFolder={(folderId) => moveMediaToFolder(item.id, folderId)}
            />
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          padding: '10px 16px',
          borderTop: `1px solid ${c.line}`,
          background: c.panel,
        }}>
          <PagBtn onClick={() => fetchMedia(currentPage - 1)} disabled={currentPage === 1}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </PagBtn>

          {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
            let p: number
            if (totalPages <= 7) p = i + 1
            else if (currentPage <= 4) p = i + 1
            else if (currentPage >= totalPages - 3) p = totalPages - 6 + i
            else p = currentPage - 3 + i
            return (
              <PagBtn key={p} onClick={() => fetchMedia(p)} active={currentPage === p}>
                {p}
              </PagBtn>
            )
          })}

          <PagBtn onClick={() => fetchMedia(currentPage + 1)} disabled={currentPage === totalPages}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </PagBtn>
        </div>
      )}
    </div>
  )
}

function PagBtn({ children, onClick, disabled, active }: {
  children: React.ReactNode; onClick: () => void; disabled?: boolean; active?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minWidth: 38, height: 38,
        padding: '0 8px',
        borderRadius: 6,
        border: `1px solid ${active ? c.violet : c.line}`,
        background: active ? c.violet : c.card,
        color: active ? c.white : c.mid,
        fontSize: 13, fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        outline: 'none',
      }}
    >
      {children}
    </button>
  )
}

// ─── Folder tile ─────────────────────────────────────────────────────────────
interface FolderTileProps {
  folder: FolderItem
  onNavigate: () => void
  onDrop: (mediaId: string) => void
  onFolderDrop: (draggedFolderId: string) => void
}

function FolderTile({ folder, onNavigate, onDrop, onFolderDrop }: FolderTileProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  return (
    <div
      onClick={onNavigate}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('folderId', folder.id)
        e.dataTransfer.setData('folderName', folder.name)
        e.dataTransfer.effectAllowed = 'move'
      }}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true) }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(false)
        const mediaId = e.dataTransfer.getData('mediaId')
        const folderId = e.dataTransfer.getData('folderId')
        if (mediaId) onDrop(mediaId)
        else if (folderId && folderId !== folder.id) onFolderDrop(folderId)
      }}
      style={{
        position: 'relative',
        borderRadius: 8,
        cursor: 'pointer',
        background: isDragOver ? 'rgba(99,102,241,0.12)' : c.card,
        border: isDragOver ? `2px solid ${c.violet}` : `1px solid ${c.line}`,
        boxShadow: isDragOver ? `0 0 0 3px rgba(99,102,241,0.15)` : '0 1px 4px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        transition: 'border-color 0.12s, box-shadow 0.12s, background 0.12s',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Folder thumbnail area — matches aspect ratio of media tiles */}
      <div style={{
        aspectRatio: '1 / 1',
        background: isDragOver ? 'rgba(99,102,241,0.08)' : c.input,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        {/* Big folder icon */}
        <svg width="44" height="44" viewBox="0 0 24 24" fill={isDragOver ? c.violet : c.gold} stroke="none">
          <path d="M3 7V17a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6.586a1 1 0 01-.707-.293L10 5H5a2 2 0 00-2 2z" />
        </svg>
        {/* "DIR" badge top-right */}
        <span style={{
          position: 'absolute', top: 5, right: 5,
          fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
          background: 'rgba(232,168,78,0.75)',
          backdropFilter: 'blur(4px)',
          color: c.white,
          padding: '3px 6px',
          borderRadius: 4,
          lineHeight: 1.4,
        }}>
          DIR
        </span>
        {/* Drop hint overlay */}
        {isDragOver && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(99,102,241,0.18)',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c.violet} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 16 12 12 8 16" />
              <line x1="12" y1="12" x2="12" y2="21" />
              <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
            </svg>
          </div>
        )}
      </div>

      {/* Folder name strip */}
      <div style={{ padding: '8px 10px 9px', borderTop: `1px solid ${c.line}` }}>
        <p style={{
          margin: 0, fontSize: 13, fontWeight: 500, color: c.high,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          lineHeight: 1.3,
        }} title={folder.name}>
          {folder.name}
        </p>
      </div>
    </div>
  )
}

// ─── Grid item ───────────────────────────────────────────────────────────────
interface MediaGridItemProps {
  item: MediaItem
  isSelected: boolean
  onSelect: () => void
  onCopyUrl: () => void
  onDelete: () => void
  folders: FolderItem[]
  onMoveToFolder: (folderId: string | null) => void
}

function MediaGridItem({ item, isSelected, onSelect, onCopyUrl, onDelete, folders, onMoveToFolder }: MediaGridItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [showFolderMenu, setShowFolderMenu] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 })
  const moreRef = useRef<HTMLButtonElement>(null)

  const isImage = item.mimeType?.startsWith('image/')
  const thumbUrl = item.sizes?.thumbnail?.url || item.publicUrl || item.url
  const badge = mimeLabel(item.mimeType)
  const bColor = badgeColor(item.mimeType)

  useEffect(() => {
    if (showActions && moreRef.current) {
      const r = moreRef.current.getBoundingClientRect()
      setDropdownPos({
        top: r.bottom + 6,
        left: Math.min(r.right - 180, window.innerWidth - 196),
      })
    }
  }, [showActions])

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setShowActions(false); setShowFolderMenu(false) }}
      draggable
      onDragStart={(e) => {
        e.stopPropagation()
        e.dataTransfer.setData('mediaId', item.id)
        e.dataTransfer.setData('mediaFilename', item.filename)
        e.dataTransfer.effectAllowed = 'move'
      }}
      style={{
        position: 'relative',
        borderRadius: 8,
        cursor: 'pointer',
        background: c.card,
        border: isSelected
          ? `2px solid ${c.violet}`
          : `1px solid ${isHovered ? '#2E2E40' : c.line}`,
        boxShadow: isSelected
          ? `0 0 0 3px ${c.violetGlow}`
          : isHovered ? '0 4px 16px rgba(0,0,0,0.4)' : '0 1px 4px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        transition: 'border-color 0.12s, box-shadow 0.12s',
        transform: isSelected ? 'scale(1.015)' : undefined,
      }}
    >
      {/* Square thumbnail */}
      <div style={{
        aspectRatio: '1 / 1',
        background: c.input,
        overflow: 'hidden',
        position: 'relative',
      }}>
        {isImage ? (
          <img
            src={thumbUrl}
            alt={item.alt || item.filename}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FileTypeIcon mimeType={item.mimeType} />
          </div>
        )}

        {/* Hover overlay (very subtle) */}
        {isHovered && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 45%)',
            pointerEvents: 'none',
          }} />
        )}

        {/* File type badge — always visible top-right */}
        <span style={{
          position: 'absolute', top: 5, right: 5,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.05em',
          background: bColor,
          backdropFilter: 'blur(4px)',
          color: c.white,
          padding: '3px 6px',
          borderRadius: 4,
          lineHeight: 1.4,
        }}>
          {badge}
        </span>

        {/* Selection check — top-left */}
        {isSelected && (
          <div style={{
            position: 'absolute', top: 5, left: 5,
            width: 22, height: 22, borderRadius: '50%',
            background: c.violet,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}

        {/* ⋯ menu button — appears on hover */}
        {isHovered && (
          <button
            ref={moreRef}
            onClick={(e) => { e.stopPropagation(); setShowActions(!showActions); setShowFolderMenu(false) }}
            style={{
              position: 'absolute', top: isSelected ? 32 : 6, left: 6,
              width: 26, height: 26, borderRadius: 5,
              background: 'rgba(28,28,38,0.88)',
              border: `1px solid ${c.line}`,
              color: c.mid,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', outline: 'none',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="5" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="19" r="1" fill="currentColor" />
            </svg>
          </button>
        )}
      </div>

      {/* Filename strip */}
      <div style={{
        padding: '8px 10px 9px',
        borderTop: `1px solid ${c.line}`,
      }}>
        <p style={{
          margin: 0,
          fontSize: 13,
          fontWeight: 400,
          color: c.mid,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          lineHeight: 1.3,
        }} title={item.filename}>
          {item.filename}
        </p>
      </div>

      {/* ─ Dropdown portal ─────────────────────────────────────────────── */}
      {showActions && typeof document !== 'undefined' && createPortal(
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 10000 }} onClick={(e) => { e.stopPropagation(); setShowActions(false); setShowFolderMenu(false) }} />
          <div
            style={{
              position: 'fixed',
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: 180,
              background: c.card,
              border: `1px solid ${c.line}`,
              borderRadius: 8,
              boxShadow: '0 10px 32px rgba(0,0,0,0.7)',
              zIndex: 10001,
              overflow: 'hidden',
              paddingTop: 4,
              paddingBottom: 4,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Move to folder */}
            <div style={{ position: 'relative' }}>
              <DropItem
                onClick={(e) => { e.stopPropagation(); setShowFolderMenu(!showFolderMenu) }}
                label="Move to folder"
                suffix={
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                }
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill={c.gold} stroke="none">
                  <path d="M3 7V17a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6.586a1 1 0 01-.707-.293L10 5H5a2 2 0 00-2 2z" />
                </svg>
              </DropItem>

              {showFolderMenu && (
                <div style={{
                  position: 'absolute', left: '100%', top: 0, marginLeft: 4,
                  width: 180,
                  background: c.card, border: `1px solid ${c.line}`, borderRadius: 8,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                  paddingTop: 4, paddingBottom: 4, overflow: 'hidden',
                }}>
                  <DropItem
                    onClick={(e) => { e.stopPropagation(); onMoveToFolder(null); setShowActions(false); setShowFolderMenu(false) }}
                    label="Root (no folder)"
                    active={!item.folder}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c.lo} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                    </svg>
                  </DropItem>
                  {folders.length > 0 && <div style={{ height: 1, background: c.line, margin: '4px 0' }} />}
                  {folders.map((f) => {
                    const cur = typeof item.folder === 'object' ? item.folder?.id === f.id : item.folder === f.id
                    return (
                      <DropItem
                        key={f.id}
                        onClick={(e) => { e.stopPropagation(); onMoveToFolder(f.id); setShowActions(false); setShowFolderMenu(false) }}
                        label={f.name}
                        active={cur}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill={c.gold} stroke="none">
                          <path d="M3 7V17a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6.586a1 1 0 01-.707-.293L10 5H5a2 2 0 00-2 2z" />
                        </svg>
                      </DropItem>
                    )
                  })}
                </div>
              )}
            </div>

            <div style={{ height: 1, background: c.line, margin: '4px 0' }} />

            {/* Open in new tab */}
            <a
              href={item.publicUrl || item.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ display: 'block', textDecoration: 'none' }}
            >
              <DropItem onClick={() => {}} label="Open in new tab">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c.mid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </DropItem>
            </a>

            {/* Copy URL */}
            <DropItem onClick={(e) => { e.stopPropagation(); onCopyUrl(); setShowActions(false) }} label="Copy URL">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c.mid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
              </svg>
            </DropItem>

            <div style={{ height: 1, background: c.line, margin: '4px 0' }} />

            {/* Delete */}
            <DropItem
              onClick={(e) => { e.stopPropagation(); if (confirm('Delete this file?')) { onDelete() }; setShowActions(false) }}
              label="Delete"
              danger
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
              </svg>
            </DropItem>
          </div>
        </>,
        document.body
      )}
    </div>
  )
}

// ─── Dropdown item ────────────────────────────────────────────────────────────
function DropItem({ children, label, onClick, suffix, active, danger }: {
  children: React.ReactNode
  label: string
  onClick: (e: React.MouseEvent) => void
  suffix?: React.ReactNode
  active?: boolean
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        width: '100%', padding: '7px 12px',
        background: active ? c.hover : 'transparent',
        border: 'none',
        color: danger ? c.rose : active ? c.high : c.mid,
        fontSize: 13, cursor: 'pointer', outline: 'none',
        transition: 'background 0.1s, color 0.1s',
        textAlign: 'left' as const,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = danger ? 'rgba(241,108,108,0.08)' : c.hover
        e.currentTarget.style.color = danger ? c.rose : c.high
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = active ? c.hover : 'transparent'
        e.currentTarget.style.color = danger ? c.rose : active ? c.high : c.mid
      }}
    >
      {children}
      <span style={{ flex: 1 }}>{label}</span>
      {suffix && <span style={{ color: c.lo, marginLeft: 'auto' }}>{suffix}</span>}
      {active && !suffix && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={c.violet} strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </button>
  )
}

// ─── File type icon ───────────────────────────────────────────────────────────
function FileTypeIcon({ mimeType }: { mimeType: string }) {
  const sz = 36
  if (mimeType?.startsWith('video/')) return (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  )
  if (mimeType?.startsWith('audio/')) return (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c.jade} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
    </svg>
  )
  if (mimeType === 'application/pdf') return (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c.rose} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  )
  return (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c.lo} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
  )
}
