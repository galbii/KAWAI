'use client'

import { useState, useCallback } from 'react'
import { useMediaManager } from './MediaManagerProvider'
import type { FolderItem, FolderTreeNode } from './types'

// Explicit color constants to avoid Payload theme conflicts
const colors = {
  white: '#ffffff',
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
  amber400: '#fbbf24',
  amber500: '#f59e0b',
  red500: '#ef4444',
  red600: '#dc2626',
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
  const hasChildren = folder.children.length > 0
  const isExpanded = expandedFolders.has(folder.id)
  const isSelected = selectedFolderId === folder.id

  return (
    <div>
      <div
        className="group flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-150 mb-1"
        style={{
          marginLeft: `${depth * 20}px`,
          backgroundColor: isSelected ? colors.blue50 : 'transparent',
          borderLeft: isSelected ? `3px solid ${colors.blue500}` : '3px solid transparent',
        }}
        onClick={() => onSelect(folder)}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
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
            backgroundColor: hasChildren ? colors.slate100 : 'transparent',
          }}
        >
          {hasChildren && (
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
              style={{ color: colors.slate500 }}
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
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: isSelected ? colors.blue100 : colors.slate100 }}
        >
          <svg
            className="w-5 h-5"
            style={{ color: isSelected ? colors.blue600 : colors.amber500 }}
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

        {/* Folder name */}
        <span
          className="flex-1 text-base font-medium truncate"
          style={{ color: isSelected ? colors.blue700 : colors.slate700 }}
        >
          {folder.name}
        </span>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onCreateChild(folder.id)
              }}
              className="p-2 rounded-lg transition-colors"
              style={{ backgroundColor: colors.slate100, color: colors.slate600 }}
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
              className="p-2 rounded-lg transition-colors"
              style={{ backgroundColor: colors.slate100, color: colors.red500 }}
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
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl shadow-2xl w-full max-w-md p-8"
        style={{ backgroundColor: colors.white }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: colors.amber400 + '20' }}
          >
            <svg className="w-6 h-6" style={{ color: colors.amber500 }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 7V17a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6.586a1 1 0 01-.707-.293L10 5H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold" style={{ color: colors.slate900 }}>New Folder</h3>
            {parentName && (
              <p className="text-sm mt-0.5" style={{ color: colors.slate500 }}>Inside: {parentName}</p>
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
            className="w-full px-5 py-4 text-base border-2 rounded-xl focus:outline-none focus:border-blue-500 transition-colors mb-6"
            style={{
              backgroundColor: colors.slate50,
              borderColor: colors.slate200,
              color: colors.slate900,
            }}
          />
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-base font-medium rounded-xl transition-colors"
              style={{ color: colors.slate600, backgroundColor: colors.slate100 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isCreating}
              className="px-6 py-3 text-base font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: colors.blue600, color: colors.white }}
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
  } = useMediaManager()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [createParentId, setCreateParentId] = useState<string | null>(null)
  const [createParentName, setCreateParentName] = useState<string | undefined>()

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
      <div className="p-8 flex items-center justify-center">
        <div
          className="animate-spin rounded-full h-8 w-8 border-3 border-t-transparent"
          style={{ borderColor: colors.blue600, borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: colors.white }}>
      {/* Header */}
      <div
        className="flex-shrink-0 px-6 py-5 border-b"
        style={{ borderColor: colors.slate200 }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold" style={{ color: colors.slate800 }}>Folders</h3>
          <button
            onClick={() => openCreateDialog()}
            className="p-2.5 rounded-xl transition-colors"
            style={{ backgroundColor: colors.slate100, color: colors.slate600 }}
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
          className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-150 mb-2"
          style={{
            backgroundColor: currentFolder === null ? colors.blue50 : 'transparent',
            borderLeft: currentFolder === null ? `3px solid ${colors.blue500}` : '3px solid transparent',
          }}
          onClick={() => setCurrentFolder(null)}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: currentFolder === null ? colors.blue100 : colors.slate100 }}
          >
            <svg
              className="w-5 h-5"
              style={{ color: currentFolder === null ? colors.blue600 : colors.slate500 }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span
            className="text-base font-medium"
            style={{ color: currentFolder === null ? colors.blue700 : colors.slate700 }}
          >
            All Media
          </span>
        </div>

        {/* Divider */}
        {folderTree.length > 0 && (
          <div className="h-px my-3" style={{ backgroundColor: colors.slate200 }} />
        )}

        {/* Folder tree */}
        {folderTree.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: colors.slate100 }}
            >
              <svg className="w-8 h-8" style={{ color: colors.slate400 }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 7V17a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6.586a1 1 0 01-.707-.293L10 5H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <p className="text-base font-medium mb-2" style={{ color: colors.slate600 }}>No folders yet</p>
            <p className="text-sm mb-4" style={{ color: colors.slate400 }}>Organize your media into folders</p>
            <button
              onClick={() => openCreateDialog()}
              className="px-5 py-2.5 text-sm font-medium rounded-xl transition-colors"
              style={{ backgroundColor: colors.blue600, color: colors.white }}
            >
              Create First Folder
            </button>
          </div>
        ) : (
          folderTree.map((folder) => (
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
