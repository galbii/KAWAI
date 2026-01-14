'use client'

import { useCallback, useState, useRef, useEffect, type DragEvent } from 'react'
import { useMediaManager } from './MediaManagerProvider'
import { MediaGrid } from './MediaGrid'
import { FolderTree } from './FolderTree'
import { ToastContainer } from './Toast'
import { ImageEditor } from './ImageEditor'

// Explicit color constants to avoid Payload theme conflicts
const colors = {
  white: '#ffffff',
  black: '#000000',
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  slate500: '#64748b',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1e293b',
  slate900: '#0f172a',
  blue50: '#eff6ff',
  blue100: '#dbeafe',
  blue500: '#3b82f6',
  blue600: '#2563eb',
  blue700: '#1d4ed8',
  amber500: '#f59e0b',
  red50: '#fef2f2',
  red100: '#fee2e2',
  red600: '#dc2626',
}

/**
 * Modal dialog for the media manager with folder navigation and drag-drop upload
 */
export function MediaManagerModal() {
  const {
    isOpen,
    closeModal,
    handleFilesSelected,
    isUploading,
    error,
    searchQuery,
    setSearchQuery,
    selectedMedia,
    copyPublicUrl,
    totalDocs,
    toasts,
    dismissToast,
    editingFile,
    setEditingFile,
    uploadEditedFile,
    skipEditing,
    pendingFiles,
    currentFolder,
    folders,
    moveMediaToFolder,
  } = useMediaManager()

  const [isDragging, setIsDragging] = useState(false)
  const [showMoveMenu, setShowMoveMenu] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragCounterRef = useRef(0)

  // Handle keyboard escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !editingFile) {
        closeModal()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeModal, editingFile])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current++
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }, [])

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current--
    if (dragCounterRef.current === 0) {
      setIsDragging(false)
    }
  }, [])

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    dragCounterRef.current = 0

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFilesSelected(files)
    }
  }, [handleFilesSelected])

  // File input handler
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFilesSelected(files)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [handleFilesSelected])

  // Handle move to folder
  const handleMoveToFolder = useCallback(async (folderId: string | null) => {
    if (selectedMedia) {
      await moveMediaToFolder(selectedMedia.id, folderId)
      setShowMoveMenu(false)
    }
  }, [selectedMedia, moveMediaToFolder])

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
          onClick={closeModal}
        />

        {/* Modal */}
        <div
          className="relative w-full max-w-7xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ backgroundColor: colors.white, color: colors.slate800 }}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Header */}
          <div
            className="flex-shrink-0 flex items-center justify-between px-8 py-5 border-b"
            style={{ backgroundColor: colors.slate50, borderColor: colors.slate200 }}
          >
            <div className="flex items-center gap-5">
              <div className="p-3 rounded-xl" style={{ backgroundColor: colors.blue100 }}>
                <svg className="w-7 h-7" style={{ color: colors.blue600 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: colors.slate900 }}>Media Library</h2>
                <div className="flex items-center gap-2 text-base mt-1" style={{ color: colors.slate500 }}>
                  <span>{totalDocs.toLocaleString()} items</span>
                  {currentFolder && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" style={{ color: colors.amber500 }} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 7V17a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6.586a1 1 0 01-.707-.293L10 5H5a2 2 0 00-2 2z" />
                        </svg>
                        {currentFolder.name}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 pl-12 pr-5 py-3 text-base border-0 rounded-xl focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: colors.slate100,
                    color: colors.slate800,
                  }}
                />
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: colors.slate400 }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Upload button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2.5 px-6 py-3 text-base font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                style={{
                  backgroundColor: colors.blue600,
                  color: colors.white,
                }}
              >
                {isUploading ? (
                  <>
                    <div
                      className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent"
                      style={{ borderColor: colors.white, borderTopColor: 'transparent' }}
                    />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Upload</span>
                  </>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,audio/*,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Close button */}
              <button
                onClick={closeModal}
                className="p-3 rounded-xl transition-colors"
                style={{ color: colors.slate500 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div
              className="flex-shrink-0 px-6 py-3 border-b"
              style={{ backgroundColor: colors.red50, borderColor: colors.red100 }}
            >
              <div className="flex items-center gap-2" style={{ color: colors.red600 }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Content area with sidebar */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* Folder sidebar */}
            <div
              className={`flex-shrink-0 border-r transition-all duration-200 relative ${sidebarCollapsed ? 'w-0 overflow-hidden' : 'w-72'}`}
              style={{ backgroundColor: colors.white, borderColor: colors.slate200 }}
            >
              <FolderTree />

              {/* Toggle sidebar button - attached to sidebar */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="absolute top-1/2 -translate-y-1/2 -right-4 z-20 w-8 h-8 flex items-center justify-center border rounded-full shadow-md transition-all hover:scale-110"
                style={{
                  backgroundColor: colors.white,
                  borderColor: colors.slate200,
                  color: colors.slate600,
                }}
              >
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${sidebarCollapsed ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>

            {/* Collapsed sidebar toggle */}
            {sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="absolute top-1/2 -translate-y-1/2 left-0 z-20 w-8 h-8 flex items-center justify-center border rounded-r-lg shadow-md transition-all hover:scale-110"
                style={{
                  backgroundColor: colors.white,
                  borderColor: colors.slate200,
                  color: colors.slate600,
                }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Main content */}
            <div className="flex-1 relative" style={{ backgroundColor: colors.white }}>
              <MediaGrid />

              {/* Drag overlay */}
              {isDragging && (
                <div
                  className="absolute inset-0 flex items-center justify-center z-10"
                  style={{ backgroundColor: 'rgba(239, 246, 255, 0.95)' }}
                >
                  <div className="text-center">
                    <div
                      className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: colors.blue100 }}
                    >
                      <svg className="w-10 h-10" style={{ color: colors.blue600 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-xl font-semibold" style={{ color: colors.blue700 }}>Drop files to upload</p>
                    <p className="text-sm mt-1" style={{ color: colors.blue500 }}>
                      {currentFolder
                        ? `Uploading to "${currentFolder.name}"`
                        : 'Images will open in editor for cropping'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer - Selected item details */}
          {selectedMedia && (
            <div
              className="flex-shrink-0 px-8 py-5 border-t"
              style={{ backgroundColor: colors.white, borderColor: colors.slate200 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  {selectedMedia.mimeType?.startsWith('image/') && (
                    <div
                      className="w-16 h-16 rounded-xl overflow-hidden shadow-md"
                      style={{ backgroundColor: colors.slate100 }}
                    >
                      <img
                        src={selectedMedia.sizes?.thumbnail?.url || selectedMedia.publicUrl || selectedMedia.url}
                        alt={selectedMedia.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-base font-semibold" style={{ color: colors.slate900 }}>{selectedMedia.filename}</p>
                    <p className="text-sm mt-1" style={{ color: colors.slate500 }}>
                      {selectedMedia.width && selectedMedia.height && (
                        <span>{selectedMedia.width} × {selectedMedia.height}px</span>
                      )}
                      {selectedMedia.filesize > 0 && (
                        <span className="ml-2">• {formatFileSize(selectedMedia.filesize)}</span>
                      )}
                      {selectedMedia.folder && (
                        <span className="ml-2">
                          • in{' '}
                          <span style={{ color: colors.amber500 }}>
                            {typeof selectedMedia.folder === 'string'
                              ? selectedMedia.folder
                              : selectedMedia.folder.name
                            }
                          </span>
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Move to folder button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowMoveMenu(!showMoveMenu)}
                      className="flex items-center gap-2.5 px-5 py-2.5 text-base font-medium rounded-xl transition-colors"
                      style={{ backgroundColor: colors.slate100, color: colors.slate700 }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      Move
                    </button>

                    {/* Move menu dropdown */}
                    {showMoveMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowMoveMenu(false)}
                        />
                        <div
                          className="absolute bottom-full right-0 mb-2 w-64 rounded-xl shadow-xl border py-2 z-20 max-h-72 overflow-y-auto"
                          style={{ backgroundColor: colors.white, borderColor: colors.slate200 }}
                        >
                          <button
                            onClick={() => handleMoveToFolder(null)}
                            className="w-full flex items-center gap-3 px-5 py-3 text-base"
                            style={{ color: colors.slate700 }}
                          >
                            <svg className="w-5 h-5" style={{ color: colors.slate400 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Root (No folder)
                          </button>
                          <div className="h-px my-1" style={{ backgroundColor: colors.slate200 }} />
                          {folders.map((folder) => (
                            <button
                              key={folder.id}
                              onClick={() => handleMoveToFolder(folder.id)}
                              className="w-full flex items-center gap-3 px-5 py-3 text-base"
                              style={{ color: colors.slate700 }}
                            >
                              <svg className="w-5 h-5" style={{ color: colors.amber500 }} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3 7V17a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6.586a1 1 0 01-.707-.293L10 5H5a2 2 0 00-2 2z" />
                              </svg>
                              {folder.name}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => copyPublicUrl(selectedMedia.publicUrl || selectedMedia.url)}
                    className="flex items-center gap-2.5 px-5 py-2.5 text-base font-medium rounded-xl transition-colors"
                    style={{ backgroundColor: colors.slate100, color: colors.slate700 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy URL
                  </button>
                  <a
                    href={selectedMedia.publicUrl || selectedMedia.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-5 py-2.5 text-base font-medium rounded-xl transition-colors shadow-md"
                    style={{ backgroundColor: colors.slate900, color: colors.white }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Editor */}
      {editingFile && (
        <ImageEditor
          file={editingFile}
          onSave={uploadEditedFile}
          onCancel={() => {
            if (pendingFiles.length > 1) {
              skipEditing()
            } else {
              setEditingFile(null)
            }
          }}
        />
      )}

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  )
}

/**
 * Format file size in human readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}
