'use client'

import { useEffect } from 'react'
import { createClientFeature, toolbarAddDropdownGroupWithItems } from '@payloadcms/richtext-lexical/client'
import { $createUploadNode } from '@payloadcms/richtext-lexical/client'
import { createCommand, COMMAND_PRIORITY_EDITOR, type LexicalCommand } from '@payloadcms/richtext-lexical/lexical'
import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext'
import { $insertNodeToNearestRoot } from '@payloadcms/richtext-lexical/lexical/utils'
import { useMediaManagerSafe } from '@/components/admin/media-manager/MediaManagerProvider'
import type { MediaItem } from '@/components/admin/media-manager/types'

// Command to signal the plugin to open the media manager modal
const OPEN_MEDIA_MANAGER_COMMAND: LexicalCommand<void> =
  createCommand('OPEN_MEDIA_MANAGER_COMMAND')

// Command to insert the selected image into the editor
const INSERT_MEDIA_MANAGER_IMAGE_COMMAND: LexicalCommand<MediaItem> =
  createCommand('INSERT_MEDIA_MANAGER_IMAGE_COMMAND')

/**
 * Plugin that bridges the Lexical editor with the MediaManager context.
 * Runs as a React component so it can use hooks (useMediaManagerSafe).
 * If MediaManagerProvider is not in the tree, all commands are no-ops.
 */
function MediaManagerPlugin() {
  const [editor] = useLexicalComposerContext()
  const mediaManager = useMediaManagerSafe()
  const openModal = mediaManager?.openModal

  // Handle image insertion command
  useEffect(() => {
    return editor.registerCommand(
      INSERT_MEDIA_MANAGER_IMAGE_COMMAND,
      (media: MediaItem) => {
        editor.update(() => {
          const node = $createUploadNode({
            data: {
              fields: {},
              relationTo: 'media',
              value: media.id,
            },
          })
          $insertNodeToNearestRoot(node)
        })
        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor])

  // Handle open modal command
  useEffect(() => {
    return editor.registerCommand(
      OPEN_MEDIA_MANAGER_COMMAND,
      () => {
        if (!openModal) return false
        openModal({
          mode: 'select',
          filterMimeType: 'image/',
          onSelect: (media: MediaItem) => {
            editor.dispatchCommand(INSERT_MEDIA_MANAGER_IMAGE_COMMAND, media)
          },
        })
        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor, openModal])

  return null
}

export const MediaManagerUploadClientFeature = createClientFeature({
  toolbarFixed: {
    groups: [
      toolbarAddDropdownGroupWithItems([
        {
          key: 'media-manager-image',
          label: 'Media Library',
          onSelect: ({ editor }) => {
            editor.dispatchCommand(OPEN_MEDIA_MANAGER_COMMAND, undefined)
          },
        },
      ]),
    ],
  },
  plugins: [
    {
      Component: MediaManagerPlugin,
      position: 'normal',
    },
  ],
})
