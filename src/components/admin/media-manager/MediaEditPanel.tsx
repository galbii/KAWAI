'use client'

import { useState, useEffect, useCallback } from 'react'
import { useMediaManager } from './MediaManagerProvider'
import type { MediaItem } from './types'

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
  amber500: '#f59e0b',
}

interface MediaEditPanelProps {
  media: MediaItem
  onClose: () => void
}

/**
 * Side panel for editing media metadata
 */
export function MediaEditPanel({ media, onClose }: MediaEditPanelProps) {
  const { updateMedia } = useMediaManager()

  // Form state
  const [alt, setAlt] = useState(media.alt || '')
  const [caption, setCaption] = useState(media.caption || '')
  const [description, setDescription] = useState(media.description || '')
  const [mediaType, setMediaType] = useState(media.mediaType || 'image')
  const [tags, setTags] = useState<string[]>(media.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [featured, setFeatured] = useState(media.featured || false)

  // Video metadata state
  const [videoDuration, setVideoDuration] = useState<number | undefined>(media.videoMeta?.duration)
  const [videoAutoplay, setVideoAutoplay] = useState<boolean>(media.videoMeta?.autoplay || false)
  const [videoMuted, setVideoMuted] = useState<boolean>(media.videoMeta?.muted ?? true)

  // SEO metadata state
  const [seoKeywords, setSeoKeywords] = useState(media.seoMeta?.focusKeywords || '')
  const [seoPhotographer, setSeoPhotographer] = useState(media.seoMeta?.photographerCredit || '')
  const [seoCopyright, setSeoCopyright] = useState(media.seoMeta?.copyrightInfo || '')
  const [seoSource, setSeoSource] = useState(media.seoMeta?.originalSource || '')

  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Track changes
  useEffect(() => {
    const changed =
      alt !== (media.alt || '') ||
      caption !== (media.caption || '') ||
      description !== (media.description || '') ||
      mediaType !== (media.mediaType || 'image') ||
      featured !== (media.featured || false) ||
      JSON.stringify(tags) !== JSON.stringify(media.tags || []) ||
      // Video metadata changes
      videoDuration !== media.videoMeta?.duration ||
      videoAutoplay !== (media.videoMeta?.autoplay || false) ||
      videoMuted !== (media.videoMeta?.muted || true) ||
      // SEO metadata changes
      seoKeywords !== (media.seoMeta?.focusKeywords || '') ||
      seoPhotographer !== (media.seoMeta?.photographerCredit || '') ||
      seoCopyright !== (media.seoMeta?.copyrightInfo || '') ||
      seoSource !== (media.seoMeta?.originalSource || '')
    setHasChanges(changed)
  }, [alt, caption, description, mediaType, tags, featured, videoDuration, videoAutoplay, videoMuted, seoKeywords, seoPhotographer, seoCopyright, seoSource, media])

  // Handle tag add
  const addTag = useCallback(() => {
    const trimmed = tagInput.trim().toLowerCase()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
      setTagInput('')
    }
  }, [tagInput, tags])

  // Handle tag remove
  const removeTag = useCallback((tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove))
  }, [tags])

  // Handle save
  const handleSave = useCallback(async () => {
    if (!hasChanges) return

    setIsSaving(true)
    try {
      // Build update data object
      const updateData: Record<string, unknown> = {
        alt,
        mediaType,
        featured,
      }
      if (caption) updateData.caption = caption
      if (description) updateData.description = description
      if (tags.length > 0) updateData.tags = tags

      // Add video metadata if mediaType is video
      if (mediaType === 'video') {
        updateData.videoMeta = {
          duration: videoDuration,
          autoplay: videoAutoplay,
          muted: videoMuted,
        }
      }

      // Add SEO metadata if any field is filled
      if (seoKeywords || seoPhotographer || seoCopyright || seoSource) {
        updateData.seoMeta = {
          focusKeywords: seoKeywords || undefined,
          photographerCredit: seoPhotographer || undefined,
          copyrightInfo: seoCopyright || undefined,
          originalSource: seoSource || undefined,
        }
      }

      await updateMedia(media.id, updateData)
      onClose()
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setIsSaving(false)
    }
  }, [hasChanges, updateMedia, media.id, alt, caption, description, mediaType, tags, featured, videoDuration, videoAutoplay, videoMuted, seoKeywords, seoPhotographer, seoCopyright, seoSource, onClose])

  return (
    <div
      className="fixed inset-0 z-[10002] flex justify-end"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-lg h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        style={{ backgroundColor: colors.white }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex-shrink-0 px-6 py-5 border-b flex items-center justify-between"
          style={{ borderColor: colors.slate200 }}
        >
          <div>
            <h2 className="text-lg font-semibold" style={{ color: colors.slate900 }}>
              Edit Media
            </h2>
            <p className="text-sm mt-0.5 truncate max-w-xs" style={{ color: colors.slate500 }}>
              {media.filename}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: colors.slate400 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Preview */}
          {media.mimeType?.startsWith('image/') && (
            <div
              className="aspect-video rounded-xl overflow-hidden"
              style={{ backgroundColor: colors.slate100 }}
            >
              <img
                src={media.sizes?.card?.url || media.publicUrl || media.url}
                alt={media.alt}
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Alt Text (required) */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.slate700 }}>
              Alt Text <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Describe what this image shows..."
              className="w-full px-4 py-3 text-base border rounded-xl focus:outline-none focus:ring-2 transition-colors"
              style={{
                backgroundColor: colors.slate50,
                borderColor: colors.slate200,
                color: colors.slate900,
              }}
            />
            <p className="text-xs mt-1.5" style={{ color: colors.slate400 }}>
              Required for accessibility and SEO
            </p>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.slate700 }}>
              Caption
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Optional caption for display..."
              className="w-full px-4 py-3 text-base border rounded-xl focus:outline-none focus:ring-2 transition-colors"
              style={{
                backgroundColor: colors.slate50,
                borderColor: colors.slate200,
                color: colors.slate900,
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.slate700 }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description for administrative purposes..."
              rows={3}
              className="w-full px-4 py-3 text-base border rounded-xl focus:outline-none focus:ring-2 transition-colors resize-none"
              style={{
                backgroundColor: colors.slate50,
                borderColor: colors.slate200,
                color: colors.slate900,
              }}
            />
          </div>

          {/* Media Type */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.slate700 }}>
              Media Type
            </label>
            <select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value as any)}
              className="w-full px-4 py-3 text-base border rounded-xl focus:outline-none focus:ring-2 transition-colors appearance-none"
              style={{
                backgroundColor: colors.slate50,
                borderColor: colors.slate200,
                color: colors.slate900,
              }}
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="document">Document</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.slate700 }}>
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addTag()
                  }
                }}
                placeholder="Add a tag..."
                className="flex-1 px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-colors"
                style={{
                  backgroundColor: colors.slate50,
                  borderColor: colors.slate200,
                  color: colors.slate900,
                }}
              />
              <button
                onClick={addTag}
                disabled={!tagInput.trim()}
                className="px-4 py-2.5 text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
                style={{ backgroundColor: colors.slate100, color: colors.slate700 }}
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg"
                    style={{ backgroundColor: colors.blue50, color: colors.blue600 }}
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="p-0.5 rounded hover:bg-blue-100"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Featured */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium" style={{ color: colors.slate700 }}>
                Featured
              </label>
              <p className="text-xs mt-0.5" style={{ color: colors.slate400 }}>
                Mark as featured media for easy access
              </p>
            </div>
            <button
              onClick={() => setFeatured(!featured)}
              className="relative w-12 h-7 rounded-full transition-colors"
              style={{ backgroundColor: featured ? colors.blue500 : colors.slate200 }}
            >
              <span
                className="absolute top-1 left-1 w-5 h-5 rounded-full transition-transform"
                style={{
                  backgroundColor: colors.white,
                  transform: featured ? 'translateX(20px)' : 'translateX(0)',
                }}
              />
            </button>
          </div>

          {/* Video Metadata (conditional) */}
          {mediaType === 'video' && (
            <div
              className="p-4 rounded-xl space-y-4"
              style={{ backgroundColor: colors.blue50 }}
            >
              <h4 className="text-sm font-semibold" style={{ color: colors.slate900 }}>
                Video Settings
              </h4>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.slate700 }}>
                  Duration (seconds)
                </label>
                <input
                  type="number"
                  value={videoDuration || ''}
                  onChange={(e) => setVideoDuration(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Video duration in seconds"
                  className="w-full px-4 py-3 text-base border rounded-xl focus:outline-none focus:ring-2 transition-colors"
                  style={{
                    backgroundColor: colors.white,
                    borderColor: colors.slate200,
                    color: colors.slate900,
                  }}
                />
              </div>

              {/* Autoplay */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium" style={{ color: colors.slate700 }}>
                    Autoplay
                  </label>
                  <p className="text-xs mt-0.5" style={{ color: colors.slate500 }}>
                    Video will start playing automatically
                  </p>
                </div>
                <button
                  onClick={() => setVideoAutoplay(!videoAutoplay)}
                  className="relative w-12 h-7 rounded-full transition-colors"
                  style={{ backgroundColor: videoAutoplay ? colors.blue500 : colors.slate200 }}
                >
                  <span
                    className="absolute top-1 left-1 w-5 h-5 rounded-full transition-transform"
                    style={{
                      backgroundColor: colors.white,
                      transform: videoAutoplay ? 'translateX(20px)' : 'translateX(0)',
                    }}
                  />
                </button>
              </div>

              {/* Muted */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium" style={{ color: colors.slate700 }}>
                    Start Muted
                  </label>
                  <p className="text-xs mt-0.5" style={{ color: colors.slate500 }}>
                    Recommended for autoplay videos
                  </p>
                </div>
                <button
                  onClick={() => setVideoMuted(!videoMuted)}
                  className="relative w-12 h-7 rounded-full transition-colors"
                  style={{ backgroundColor: videoMuted ? colors.blue500 : colors.slate200 }}
                >
                  <span
                    className="absolute top-1 left-1 w-5 h-5 rounded-full transition-transform"
                    style={{
                      backgroundColor: colors.white,
                      transform: videoMuted ? 'translateX(20px)' : 'translateX(0)',
                    }}
                  />
                </button>
              </div>
            </div>
          )}

          {/* SEO Metadata */}
          <div
            className="p-4 rounded-xl space-y-4"
            style={{ backgroundColor: colors.slate50 }}
          >
            <h4 className="text-sm font-semibold" style={{ color: colors.slate900 }}>
              SEO & Attribution
            </h4>

            {/* Focus Keywords */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.slate700 }}>
                Focus Keywords
              </label>
              <input
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                placeholder="e.g., grand-piano, kawai, black-finish"
                className="w-full px-4 py-3 text-base border rounded-xl focus:outline-none focus:ring-2 transition-colors"
                style={{
                  backgroundColor: colors.white,
                  borderColor: colors.slate200,
                  color: colors.slate900,
                }}
              />
              <p className="text-xs mt-1.5" style={{ color: colors.slate400 }}>
                Comma-separated keywords for SEO
              </p>
            </div>

            {/* Photographer Credit */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.slate700 }}>
                Photographer Credit
              </label>
              <input
                type="text"
                value={seoPhotographer}
                onChange={(e) => setSeoPhotographer(e.target.value)}
                placeholder="Photo credit"
                className="w-full px-4 py-3 text-base border rounded-xl focus:outline-none focus:ring-2 transition-colors"
                style={{
                  backgroundColor: colors.white,
                  borderColor: colors.slate200,
                  color: colors.slate900,
                }}
              />
            </div>

            {/* Copyright Info */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.slate700 }}>
                Copyright Information
              </label>
              <input
                type="text"
                value={seoCopyright}
                onChange={(e) => setSeoCopyright(e.target.value)}
                placeholder="Copyright or licensing info"
                className="w-full px-4 py-3 text-base border rounded-xl focus:outline-none focus:ring-2 transition-colors"
                style={{
                  backgroundColor: colors.white,
                  borderColor: colors.slate200,
                  color: colors.slate900,
                }}
              />
            </div>

            {/* Original Source */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.slate700 }}>
                Original Source
              </label>
              <input
                type="text"
                value={seoSource}
                onChange={(e) => setSeoSource(e.target.value)}
                placeholder="Original source URL"
                className="w-full px-4 py-3 text-base border rounded-xl focus:outline-none focus:ring-2 transition-colors"
                style={{
                  backgroundColor: colors.white,
                  borderColor: colors.slate200,
                  color: colors.slate900,
                }}
              />
            </div>
          </div>

          {/* File Info */}
          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: colors.slate50 }}
          >
            <h4 className="text-sm font-medium mb-3" style={{ color: colors.slate700 }}>
              File Information
            </h4>
            <dl className="space-y-2 text-sm">
              {media.width && media.height && (
                <div className="flex justify-between">
                  <dt style={{ color: colors.slate500 }}>Dimensions</dt>
                  <dd style={{ color: colors.slate700 }}>{media.width} × {media.height}px</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt style={{ color: colors.slate500 }}>File Size</dt>
                <dd style={{ color: colors.slate700 }}>{formatFileSize(media.filesize)}</dd>
              </div>
              <div className="flex justify-between">
                <dt style={{ color: colors.slate500 }}>Type</dt>
                <dd style={{ color: colors.slate700 }}>{media.mimeType}</dd>
              </div>
              <div className="flex justify-between">
                <dt style={{ color: colors.slate500 }}>Created</dt>
                <dd style={{ color: colors.slate700 }}>{formatDate(media.createdAt)}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex-shrink-0 px-6 py-4 border-t flex items-center justify-between"
          style={{ backgroundColor: colors.white, borderColor: colors.slate200 }}
        >
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium rounded-xl transition-colors"
            style={{ color: colors.slate600 }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || !alt.trim() || isSaving}
            className="px-6 py-2.5 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            style={{ backgroundColor: colors.blue600, color: colors.white }}
          >
            {isSaving ? (
              <>
                <div
                  className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent"
                  style={{ borderColor: colors.white, borderTopColor: 'transparent' }}
                />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
