'use client'

import { useState, useCallback } from 'react'
import { useMediaManager } from './MediaManagerProvider'
import type { FolderItem, FolderTreeNode } from './types'

const colors = {
  backdrop: 'rgba(4,4,8,0.82)',
  modalBg: '#0C0C0F',
  headerBg: '#16161E',
  sidebarBg: '#111116',
  contentBg: '#0C0C0F',
  cardBg: '#1C1C26',
  inputBg: '#12121A',
  hoverBg: '#1E1E2A',

  border: '#252535',
  borderLight: '#2E2E40',
  borderFocus: '#6366F1',

  textPrimary: '#ECECF2',
  textSecondary: '#8484A0',
  textMuted: '#4C4C68',
  textAccent: '#818CF8',

  primary: '#6366F1',
  primaryHover: '#5558E0',
  primaryLight: '#818CF8',
  success: '#2EC4A0',
  successBg: 'rgba(46,196,160,0.08)',
  error: '#F16C6C',
  errorBg: 'rgba(241,108,108,0.08)',
  warning: '#E8A84E',
  warningBg: 'rgba(232,168,78,0.10)',

  accent: '#6366F1',
  accentHover: '#5558E0',
  gold: '#E8A84E',

  white: '#ffffff',
  black: '#000000',
}

interface FolderTreeItemProps {
  folder: FolderTreeNode
  depth: number
  selectedFolderId: string | null
  onSelect: (folder: FolderItem | null) => void
  onToggle: (folderId: string) => void
  onDelete: (folderId: string) => void
  onCreateChild: (parentId: string) => void
  expandedFolders: Set<string>
}

function FolderTreeItem({
  folder,
  depth,
  selectedFolderId,
  onSelect,
  onToggle,
  onDelete,
  onCreateChild,
  expandedFolders,
}: FolderTreeItemProps) {
  const [showActions, setShowActions] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState(folder.name)
  const [isDragOver, setIsDragOver] = useState(false)

  const { renameFolder, moveMediaToFolder, moveFolderToFolder } = useMediaManager()

  const hasChildren = folder.children.length > 0
  const isExpanded = expandedFolders.has(folder.id)
  const isSelected = selectedFolderId === folder.id

  const handleRenameSave = useCallback(async () => {
    const trimmed = renameValue.trim()
    if (trimmed && trimmed !== folder.name) {
      await renameFolder(folder.id, trimmed)
    } else {
      setRenameValue(folder.name)
    }
    setIsRenaming(false)
  }, [renameValue, folder.id, folder.name, renameFolder])

  return (
    <div>
      <div
        className="group flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-150 mb-1"
        style={{
          marginLeft: `${depth * 20}px`,
          backgroundColor: isDragOver ? colors.primary + '22' : isSelected ? colors.hoverBg : 'transparent',
          borderLeft: isDragOver
            ? `3px solid ${colors.primary}`
            : isSelected ? `3px solid ${colors.primary}` : '3px solid transparent',
          outline: isDragOver ? `1px solid ${colors.primary}33` : undefined,
          transition: 'background 0.1s, outline 0.1s',
        }}
        onClick={() => {
          if (!isRenaming) onSelect(folder)
        }}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        draggable
        onDragStart={(e) => {
          e.stopPropagation()
          e.dataTransfer.setData('folderId', folder.id)
          e.dataTransfer.setData('folderName', folder.name)
          e.dataTransfer.effectAllowed = 'move'
        }}
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsDragOver(true)
        }}
        onDragLeave={(e) => {
          e.stopPropagation()
          setIsDragOver(false)
        }}
        onDrop={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsDragOver(false)
          const mediaId = e.dataTransfer.getData('mediaId')
          const folderId = e.dataTransfer.getData('folderId')
          if (mediaId) {
            moveMediaToFolder(mediaId, folder.id)
          } else if (folderId && folderId !== folder.id) {
            moveFolderToFolder(folderId, folder.id)
          }
        }}
      >
        {/* Expand/collapse button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggle(folder.id)
          }}
          className="w-6 h-6 flex items-center justify-center rounded-lg transition-colors"
          style={{
            opacity: hasChildren ? 1 : 0,
            backgroundColor: hasChildren ? colors.cardBg : 'transparent',
          }}
        >
          {hasChildren && (
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
              style={{ color: colors.textSecondary }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>

        {/* Folder icon */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: isSelected ? colors.cardBg : colors.inputBg }}
        >
          <svg
            className="w-5 h-5"
            style={{ color: isSelected ? colors.primary : colors.gold }}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            {isExpanded ? (
              <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h4.586a1 1 0 01.707.293L12 6h7a2 2 0 012 2v10a2 2 0 01-2 2z" />
            ) : (
              <path d="M3 7V17a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6.586a1 1 0 01-.707-.293L10 5H5a2 2 0 00-2 2z" />
            )}
          </svg>
        </div>

        {/* Folder name or rename input */}
        {isRenaming ? (
          <input
            autoFocus
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleRenameSave()
              } else if (e.key === 'Escape') {
                setRenameValue(folder.name)
                setIsRenaming(false)
              }
            }}
            onBlur={handleRenameSave}
            className="flex-1 text-base font-medium bg-transparent border-0 border-b outline-none min-w-0"
            style={{
              color: colors.textAccent,
              borderColor: colors.borderFocus,
              padding: '0 2px',
            }}
          />
        ) : (
          <span
            className="flex-1 text-base font-medium truncate"
            style={{ color: isSelected ? colors.textAccent : colors.textPrimary }}
          >
            {folder.name}
          </span>
        )}

        {/* Actions */}
        {showActions && !isRenaming && (
          <div className="flex items-center gap-1">
            {/* Rename button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setRenameValue(folder.name)
                setIsRenaming(true)
              }}
              className="p-2 rounded-lg transition-colors hover:bg-opacity-80"
              style={{ backgroundColor: colors.cardBg, color: colors.textSecondary }}
              title="Rename folder"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            {/* Create subfolder button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onCreateChild(folder.id)
              }}
              className="p-2 rounded-lg transition-colors hover:bg-opacity-80"
              style={{ backgroundColor: colors.cardBg, color: colors.textSecondary }}
              title="Create subfolder"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (confirm(`Delete folder "${folder.name}"? Media will be moved to root.`)) {
                  onDelete(folder.id)
                }
              }}
              className="p-2 rounded-lg transition-colors hover:bg-opacity-80"
              style={{ backgroundColor: colors.errorBg, color: colors.error }}
              title="Delete folder"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {folder.children.map((child) => (
            <FolderTreeItem
              key={child.id}
              folder={child}
              depth={depth + 1}
              selectedFolderId={selectedFolderId}
              onSelect={onSelect}
              onToggle={onToggle}
              onDelete={onDelete}
              onCreateChild={onCreateChild}
              expandedFolders={expandedFolders}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface CreateFolderDialogProps {
  parentId?: string | null
  parentName?: string | undefined
  onClose: () => void
  onCreate: (name: string, parentId?: string) => void
}

function CreateFolderDialog({ parentId, parentName, onClose, onCreate }: CreateFolderDialogProps) {
  const [name, setName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsCreating(true)
    await onCreate(name.trim(), parentId || undefined)
    setIsCreating(false)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[10003] flex items-center justify-center p-4"
      style={{ backgroundColor: colors.backdrop }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl shadow-2xl w-full max-w-md p-8 border"
        style={{ backgroundColor: colors.modalBg, borderColor: colors.border }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: colors.warningBg }}
          >
            <svg className="w-6 h-6" style={{ color: colors.gold }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 7V17a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6.586a1 1 0 01-.707-.293L10 5H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>New Folder</h3>
            {parentName && (
              <p className="text-sm mt-0.5" style={{ color: colors.textSecondary }}>Inside: {parentName}</p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter folder name..."
            autoFocus
            className="w-full px-5 py-4 text-base border-2 rounded-xl focus:outline-none transition-colors mb-6"
            style={{
              backgroundColor: colors.inputBg,
              borderColor: colors.border,
              color: colors.textPrimary,
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = colors.borderFocus}
            onBlur={(e) => e.currentTarget.style.borderColor = colors.border}
          />
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-base font-medium rounded-xl transition-colors hover:bg-opacity-80"
              style={{ color: colors.textSecondary, backgroundColor: colors.cardBg }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isCreating}
              className="px-6 py-3 text-base font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
              style={{ backgroundColor: colors.primary, color: colors.white }}
            >
              {isCreating ? 'Creating...' : 'Create Folder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/**
 * Folder tree navigation component
 */
export function FolderTree() {
  const {
    folderTree,
    currentFolder,
    setCurrentFolder,
    toggleFolderExpanded,
    expandedFolders,
    isFoldersLoading,
    createFolder,
    deleteFolder,
    showToast,
    moveMediaToFolder,
  } = useMediaManager()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [createParentId, setCreateParentId] = useState<string | null>(null)
  const [createParentName, setCreateParentName] = useState<string | undefined>()
  const [isDragOverRoot, setIsDragOverRoot] = useState(false)

  const handleCreateFolder = useCallback(async (name: string, parentId?: string) => {
    const folder = await createFolder(name, parentId)
    if (folder) {
      showToast('success', `Created folder "${name}"`)
    }
  }, [createFolder, showToast])

  const handleDeleteFolder = useCallback(async (folderId: string) => {
    await deleteFolder(folderId)
    showToast('success', 'Folder deleted')
  }, [deleteFolder, showToast])

  const openCreateDialog = useCallback((parentId?: string, parentName?: string) => {
    setCreateParentId(parentId || null)
    setCreateParentName(parentName)
    setCreateDialogOpen(true)
  }, [])

  if (isFoldersLoading) {
    return (
      <div className="p-8 flex items-center justify-center" style={{ backgroundColor: colors.sidebarBg }}>
        <div
          className="animate-spin rounded-full h-8 w-8 border-3 border-t-transparent"
          style={{ borderColor: colors.primary, borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: colors.sidebarBg }}>
      {/* Header */}
      <div
        className="flex-shrink-0 px-6 py-5 border-b"
        style={{ borderColor: colors.border }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>Folders</h3>
          <button
            onClick={() => openCreateDialog()}
            className="p-2.5 rounded-xl transition-colors hover:bg-opacity-80"
            style={{ backgroundColor: colors.cardBg, color: colors.textSecondary }}
            title="Create folder"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* All Media (Root) */}
        <div
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-150 mb-2"
          style={{
            backgroundColor: isDragOverRoot
              ? colors.primary + '22'
              : currentFolder === null ? colors.hoverBg : 'transparent',
            borderLeft: isDragOverRoot
              ? `3px solid ${colors.primary}`
              : currentFolder === null ? `3px solid ${colors.primary}` : '3px solid transparent',
            outline: isDragOverRoot ? `1px solid ${colors.primary}33` : undefined,
            transition: 'background 0.1s, outline 0.1s',
          }}
          onClick={() => setCurrentFolder(null)}
          onDragOver={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsDragOverRoot(true)
          }}
          onDragLeave={(e) => {
            e.stopPropagation()
            setIsDragOverRoot(false)
          }}
          onDrop={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsDragOverRoot(false)
            const mediaId = e.dataTransfer.getData('mediaId')
            if (mediaId) {
              moveMediaToFolder(mediaId, null)
            }
          }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: currentFolder === null ? colors.cardBg : colors.inputBg }}
          >
            <svg
              className="w-5 h-5"
              style={{ color: currentFolder === null ? colors.primary : colors.textMuted }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span
            className="text-base font-medium"
            style={{ color: currentFolder === null ? colors.textAccent : colors.textPrimary }}
          >
            All Media
          </span>
        </div>

        {/* Divider */}
        {folderTree.length > 0 && (
          <div className="h-px my-3" style={{ backgroundColor: colors.border }} />
        )}

        {/* Folder tree */}
        {folderTree.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: colors.cardBg }}
            >
              <svg className="w-8 h-8" style={{ color: colors.textMuted }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 7V17a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6.586a1 1 0 01-.707-.293L10 5H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <p className="text-base font-medium mb-2" style={{ color: colors.textSecondary }}>No folders yet</p>
            <p className="text-sm mb-4" style={{ color: colors.textMuted }}>Organize your media into folders</p>
            <button
              onClick={() => openCreateDialog()}
              className="px-5 py-2.5 text-sm font-medium rounded-xl transition-colors hover:bg-opacity-90"
              style={{ backgroundColor: colors.primary, color: colors.white }}
            >
              Create First Folder
            </button>
          </div>
        ) : (
          folderTree.map((folder: FolderTreeNode) => (
            <FolderTreeItem
              key={folder.id}
              folder={folder}
              depth={0}
              selectedFolderId={currentFolder?.id || null}
              onSelect={setCurrentFolder}
              onToggle={toggleFolderExpanded}
              onDelete={handleDeleteFolder}
              onCreateChild={(parentId) => openCreateDialog(parentId, folder.name)}
              expandedFolders={expandedFolders}
            />
          ))
        )}
      </div>

      {/* Create folder dialog */}
      {createDialogOpen && (
        <CreateFolderDialog
          parentId={createParentId}
          parentName={createParentName}
          onClose={() => setCreateDialogOpen(false)}
          onCreate={handleCreateFolder}
        />
      )}
    </div>
  )
}
