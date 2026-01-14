'use client'

import { MediaManagerProvider } from './MediaManagerProvider'
import { MediaManagerButton } from './MediaManagerButton'
import { MediaManagerModal } from './MediaManagerModal'

/**
 * Complete Media Manager component for the Payload admin panel
 *
 * This component provides:
 * - A floating button to open the media manager
 * - A modal dialog with a grid view of all media
 * - Drag and drop file upload support
 * - Search functionality
 * - Copy public URL to clipboard
 * - Delete media items
 *
 * Usage in payload.config.ts:
 * ```ts
 * admin: {
 *   components: {
 *     afterDashboard: ['/components/admin/media-manager/MediaManager'],
 *   }
 * }
 * ```
 */
export function MediaManager() {
  return (
    <MediaManagerProvider>
      <MediaManagerButton />
      <MediaManagerModal />
    </MediaManagerProvider>
  )
}

export default MediaManager
