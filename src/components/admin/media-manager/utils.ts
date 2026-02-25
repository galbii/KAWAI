/**
 * Media Manager Utilities
 * Shared helper functions used across media manager components.
 */

/**
 * Format a byte count into a human-readable string.
 * e.g. 1536 → "1.5 KB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Format an ISO date string into a short locale date.
 * e.g. "2024-01-17T11:45:00Z" → "Jan 17, 2024"
 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Map a MIME type to a short uppercase badge label.
 * e.g. "image/jpeg" → "JPG"
 */
export function mimeLabel(mimeType: string): string {
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

/**
 * Return a badge background color for a MIME type.
 */
export function badgeColor(mimeType: string): string {
  if (mimeType?.startsWith('image/')) return 'rgba(99,102,241,0.75)'
  if (mimeType?.startsWith('video/')) return 'rgba(232,168,78,0.75)'
  if (mimeType?.startsWith('audio/')) return 'rgba(46,196,160,0.75)'
  if (mimeType === 'application/pdf') return 'rgba(241,108,108,0.75)'
  return 'rgba(132,132,160,0.75)'
}
