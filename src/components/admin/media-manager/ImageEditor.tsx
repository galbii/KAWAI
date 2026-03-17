'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import type { MediaMetadata } from './MediaUploadMetadataForm'

// Dark theme color constants — matches media manager aesthetic
const c = {
  // Backgrounds
  bgDeepest: '#0C0C0F',
  bgPrimary: '#17171F',
  bgHeader: '#1A1A28',
  bgElevated: '#1E1E2A',
  bgHover: '#252535',
  bgControls: '#14141E',
  bgSidebar: '#13131C',
  bgInput: '#0F0F18',
  // Borders
  borderDefault: '#2C2C3E',
  borderAccent: 'rgba(99,102,241,0.3)',
  borderAccentStrong: 'rgba(99,102,241,0.4)',
  borderFocus: 'rgba(99,102,241,0.6)',
  // Text
  textPrimary: '#E8E8F0',
  textSecondary: '#A0A0B8',
  textMuted: '#6B6B8A',
  textDim: '#4A4A6A',
  // Accent / violet
  accent: '#6366F1',
  accentHover: '#4F46E5',
  accentLight: '#818CF8',
  accentBg: 'rgba(99,102,241,0.12)',
  accentBgSubtle: 'rgba(99,102,241,0.15)',
  accentTag: 'rgba(99,102,241,0.18)',
  // Misc
  white: '#ffffff',
  black: '#000000',
}

interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

interface ImageEditorProps {
  file: File
  /** If provided, pre-fills the WebP toggle state. */
  initialConvertToWebp?: boolean
  onSave: (editedFile: File, metadata: MediaMetadata) => void
  onCancel: () => void
}

// ─── Small reusable sidebar input styles ───────────────────────────────────

function inputStyle(focused: boolean): React.CSSProperties {
  return {
    width: '100%',
    padding: '8px 10px',
    background: c.bgInput,
    border: `1px solid ${focused ? c.borderFocus : c.borderDefault}`,
    borderRadius: 6,
    color: c.textPrimary,
    fontSize: 12.5,
    outline: 'none',
    transition: 'border-color 0.12s',
    resize: 'none' as const,
    fontFamily: 'inherit',
  }
}

function labelStyle(): React.CSSProperties {
  return {
    display: 'block',
    fontSize: 10.5,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.07em',
    color: c.textMuted,
    marginBottom: 6,
    fontWeight: 600,
  }
}

function SidebarToggle({
  label,
  checked,
  onChange,
}: {
  label: string
  hint?: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
      <span style={{ fontSize: 12.5, color: c.textSecondary }}>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        style={{
          flexShrink: 0,
          width: 36,
          height: 20,
          borderRadius: 999,
          background: checked ? c.accent : c.bgHover,
          border: `1px solid ${checked ? c.borderAccentStrong : c.borderDefault}`,
          position: 'relative',
          cursor: 'pointer',
          transition: 'all 0.15s',
          outline: 'none',
          padding: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: 2,
            width: 14,
            height: 14,
            borderRadius: 999,
            background: c.white,
            transform: checked ? 'translateX(16px)' : 'translateX(0)',
            transition: 'transform 0.15s',
          }}
        />
      </button>
    </div>
  )
}

/**
 * Image editor with crop, rotate, quality controls + inline metadata sidebar.
 * Replaces the two-step ImageEditor → MediaUploadMetadataForm flow with a single panel.
 */
export function ImageEditor({ file, initialConvertToWebp, onSave, onCancel }: ImageEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // ─── Image editor state ──────────────────────────────────────────────────
  const [imageUrl, setImageUrl] = useState<string>('')
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  const [displayDimensions, setDisplayDimensions] = useState({ width: 0, height: 0 })
  const [containerSize, setContainerSize] = useState({ width: 800, height: 500 })
  const [rotation, setRotation] = useState(0)
  const [quality, setQuality] = useState(85)
  const isPng = file.type === 'image/png'
  const isJpeg = file.type === 'image/jpeg' || file.type === 'image/jpg'
  const isWebpConvertible = isPng || isJpeg
  const isConvertibleFormat =
    file.type === 'image/png' ||
    file.type === 'image/tiff' ||
    file.type === 'image/jpeg' ||
    (file.type === 'image/webp' && initialConvertToWebp === true)
  const [convertToWebp, setConvertToWebp] = useState(
    initialConvertToWebp ?? isWebpConvertible
  )
  const [crop, setCrop] = useState<CropArea | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isProcessing, setIsProcessing] = useState(false)

  // ─── Metadata sidebar state ──────────────────────────────────────────────
  const defaultAlt = file.name
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (ch) => ch.toUpperCase())

  const detectMediaType = (): 'image' | 'video' | 'audio' | 'document' => {
    if (file.type.startsWith('image/')) return 'image'
    if (file.type.startsWith('video/')) return 'video'
    if (file.type.startsWith('audio/')) return 'audio'
    return 'document'
  }

  const [alt, setAlt] = useState(defaultAlt)
  const [caption, setCaption] = useState('')
  const [description, setDescription] = useState('')
  const [mediaType, setMediaType] = useState(detectMediaType())
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [featured, setFeatured] = useState(false)
  const [videoDuration, setVideoDuration] = useState<number | undefined>()
  const [videoAutoplay, setVideoAutoplay] = useState(false)
  const [videoMuted, setVideoMuted] = useState(true)
  const [seoKeywords, setSeoKeywords] = useState('')
  const [seoPhotographer, setSeoPhotographer] = useState('')
  const [seoCopyright, setSeoCopyright] = useState('')
  const [seoSource, setSeoSource] = useState('')

  // Focus tracking for input border styling
  const [focusedField, setFocusedField] = useState<string | null>(null)

  // Keep metadata in a ref so handleSave doesn't need them all as deps
  const metaRef = useRef({
    alt, caption, description, mediaType, tags, featured,
    videoDuration, videoAutoplay, videoMuted,
    seoKeywords, seoPhotographer, seoCopyright, seoSource,
  })
  useEffect(() => {
    metaRef.current = {
      alt, caption, description, mediaType, tags, featured,
      videoDuration, videoAutoplay, videoMuted,
      seoKeywords, seoPhotographer, seoCopyright, seoSource,
    }
  }, [alt, caption, description, mediaType, tags, featured, videoDuration, videoAutoplay, videoMuted, seoKeywords, seoPhotographer, seoCopyright, seoSource])

  // ─── Image loading ────────────────────────────────────────────────────────
  useEffect(() => {
    const url = URL.createObjectURL(file)
    setImageUrl(url)
    const img = new Image()
    img.onload = () => setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight })
    img.src = url
    return () => URL.revokeObjectURL(url)
  }, [file])

  // ─── Container size measurement ───────────────────────────────────────────
  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setContainerSize({ width: rect.width - 64, height: rect.height - 64 })
      }
    }
    updateContainerSize()
    window.addEventListener('resize', updateContainerSize)
    return () => window.removeEventListener('resize', updateContainerSize)
  }, [])

  // ─── Display dimension calculation ────────────────────────────────────────
  const calculateDisplayDimensions = useCallback(() => {
    if (!imageDimensions.width || !imageDimensions.height) return
    const maxWidth = Math.min(containerSize.width, 900)
    const maxHeight = Math.min(containerSize.height, 600)
    const imageRatio = imageDimensions.width / imageDimensions.height
    const containerRatio = maxWidth / maxHeight
    let displayWidth: number, displayHeight: number
    if (imageRatio > containerRatio) {
      displayWidth = maxWidth
      displayHeight = maxWidth / imageRatio
    } else {
      displayHeight = maxHeight
      displayWidth = maxHeight * imageRatio
    }
    displayWidth = Math.max(displayWidth, 200)
    displayHeight = Math.max(displayHeight, 200)
    setDisplayDimensions({ width: Math.round(displayWidth), height: Math.round(displayHeight) })
    setCrop({ x: 0, y: 0, width: Math.round(displayWidth), height: Math.round(displayHeight) })
  }, [imageDimensions, containerSize])

  useEffect(() => { calculateDisplayDimensions() }, [calculateDisplayDimensions])

  const handleImageLoad = useCallback(() => {
    if (!imageRef.current) return
    const img = imageRef.current
    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight })
  }, [])

  // ─── Crop mouse handlers ──────────────────────────────────────────────────
  const getMousePosition = useCallback((e: React.MouseEvent) => {
    if (!imageRef.current) return { x: 0, y: 0 }
    const rect = imageRef.current.getBoundingClientRect()
    return {
      x: Math.max(0, Math.min(e.clientX - rect.left, displayDimensions.width)),
      y: Math.max(0, Math.min(e.clientY - rect.top, displayDimensions.height)),
    }
  }, [displayDimensions])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const pos = getMousePosition(e)
    setIsDragging(true)
    setDragStart(pos)
    setCrop({ x: pos.x, y: pos.y, width: 0, height: 0 })
  }, [getMousePosition])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    const pos = getMousePosition(e)
    setCrop({
      x: Math.min(dragStart.x, pos.x),
      y: Math.min(dragStart.y, pos.y),
      width: Math.abs(pos.x - dragStart.x),
      height: Math.abs(pos.y - dragStart.y),
    })
  }, [isDragging, dragStart, getMousePosition])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    if (crop && (crop.width < 20 || crop.height < 20)) {
      setCrop({ x: 0, y: 0, width: displayDimensions.width, height: displayDimensions.height })
    }
  }, [crop, displayDimensions])

  // ─── Rotation + reset ────────────────────────────────────────────────────
  const rotate = useCallback((degrees: number) => {
    setRotation((prev) => (prev + degrees + 360) % 360)
  }, [])

  const resetCrop = useCallback(() => {
    setCrop({ x: 0, y: 0, width: displayDimensions.width, height: displayDimensions.height })
  }, [displayDimensions])

  // ─── Tag management ───────────────────────────────────────────────────────
  const addTag = useCallback(() => {
    const trimmed = tagInput.trim().toLowerCase()
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed])
      setTagInput('')
    }
  }, [tagInput, tags])

  const removeTag = useCallback((tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag))
  }, [])

  // ─── Save / upload ────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!crop || !imageRef.current) return
    setIsProcessing(true)
    try {
      const scaleX = imageDimensions.width / displayDimensions.width
      const scaleY = imageDimensions.height / displayDimensions.height
      const originalCrop = {
        x: Math.round(crop.x * scaleX),
        y: Math.round(crop.y * scaleY),
        width: Math.round(crop.width * scaleX),
        height: Math.round(crop.height * scaleY),
      }
      originalCrop.x = Math.max(0, Math.min(originalCrop.x, imageDimensions.width - 1))
      originalCrop.y = Math.max(0, Math.min(originalCrop.y, imageDimensions.height - 1))
      originalCrop.width = Math.min(originalCrop.width, imageDimensions.width - originalCrop.x)
      originalCrop.height = Math.min(originalCrop.height, imageDimensions.height - originalCrop.y)

      const img = new Image()
      img.crossOrigin = 'anonymous'
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = imageUrl
      })

      let sourceCanvas: HTMLCanvasElement
      let sourceCtx: CanvasRenderingContext2D | null
      if (rotation !== 0) {
        const swap = rotation === 90 || rotation === 270
        const rotatedWidth = swap ? img.height : img.width
        const rotatedHeight = swap ? img.width : img.height
        sourceCanvas = document.createElement('canvas')
        sourceCanvas.width = rotatedWidth
        sourceCanvas.height = rotatedHeight
        sourceCtx = sourceCanvas.getContext('2d')
        if (!sourceCtx) throw new Error('Could not get canvas context')
        sourceCtx.translate(rotatedWidth / 2, rotatedHeight / 2)
        sourceCtx.rotate((rotation * Math.PI) / 180)
        sourceCtx.translate(-img.width / 2, -img.height / 2)
        sourceCtx.drawImage(img, 0, 0)
      } else {
        sourceCanvas = document.createElement('canvas')
        sourceCanvas.width = img.width
        sourceCanvas.height = img.height
        sourceCtx = sourceCanvas.getContext('2d')
        if (!sourceCtx) throw new Error('Could not get canvas context')
        sourceCtx.drawImage(img, 0, 0)
      }

      let finalCrop = { ...originalCrop }
      if (rotation === 90) {
        finalCrop = { x: originalCrop.y, y: imageDimensions.width - originalCrop.x - originalCrop.width, width: originalCrop.height, height: originalCrop.width }
      } else if (rotation === 180) {
        finalCrop = { x: imageDimensions.width - originalCrop.x - originalCrop.width, y: imageDimensions.height - originalCrop.y - originalCrop.height, width: originalCrop.width, height: originalCrop.height }
      } else if (rotation === 270) {
        finalCrop = { x: imageDimensions.height - originalCrop.y - originalCrop.height, y: originalCrop.x, width: originalCrop.height, height: originalCrop.width }
      }
      finalCrop.x = Math.max(0, finalCrop.x)
      finalCrop.y = Math.max(0, finalCrop.y)
      finalCrop.width = Math.max(1, Math.min(finalCrop.width, sourceCanvas.width - finalCrop.x))
      finalCrop.height = Math.max(1, Math.min(finalCrop.height, sourceCanvas.height - finalCrop.y))

      const outputCanvas = document.createElement('canvas')
      outputCanvas.width = finalCrop.width
      outputCanvas.height = finalCrop.height
      const outputCtx = outputCanvas.getContext('2d')
      if (!outputCtx) throw new Error('Could not get output canvas context')
      outputCtx.drawImage(sourceCanvas, finalCrop.x, finalCrop.y, finalCrop.width, finalCrop.height, 0, 0, finalCrop.width, finalCrop.height)

      const originalMimeType = file.type || 'image/jpeg'
      const supportedFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
      const baseMimeType = supportedFormats.includes(originalMimeType) ? originalMimeType : 'image/jpeg'
      const isConvertibleMime = baseMimeType === 'image/png' || baseMimeType === 'image/jpeg' || baseMimeType === 'image/jpg'
      const outputMimeType = (convertToWebp && isConvertibleMime) ? 'image/webp' : baseMimeType
      const qualityParam = (outputMimeType === 'image/jpeg' || outputMimeType === 'image/webp') ? quality / 100 : undefined

      const blob = await new Promise<Blob>((resolve, reject) => {
        outputCanvas.toBlob(
          (b) => b ? resolve(b) : reject(new Error('Failed to create blob')),
          outputMimeType,
          qualityParam
        )
      })

      const extensionMap: Record<string, string> = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp' }
      const extension = extensionMap[outputMimeType] ?? '.jpg'
      const fileName = file.name.replace(/\.[^.]+$/, extension)
      const editedFile = new File([blob], fileName, { type: outputMimeType, lastModified: Date.now() })

      // Build metadata from sidebar state (via ref to avoid stale closure)
      const m = metaRef.current
      const metadata: MediaMetadata = {
        alt: m.alt,
        mediaType: m.mediaType,
        featured: m.featured,
        ...(isConvertibleFormat ? { convertToWebp } : {}),
      }
      if (m.caption) metadata.caption = m.caption
      if (m.description) metadata.description = m.description
      if (m.tags.length > 0) metadata.tags = m.tags
      if (m.mediaType === 'video') {
        metadata.videoMeta = { autoplay: m.videoAutoplay, muted: m.videoMuted }
        if (m.videoDuration !== undefined) metadata.videoMeta.duration = m.videoDuration
      }
      if (m.seoKeywords || m.seoPhotographer || m.seoCopyright || m.seoSource) {
        metadata.seoMeta = {}
        if (m.seoKeywords) metadata.seoMeta.focusKeywords = m.seoKeywords
        if (m.seoPhotographer) metadata.seoMeta.photographerCredit = m.seoPhotographer
        if (m.seoCopyright) metadata.seoMeta.copyrightInfo = m.seoCopyright
        if (m.seoSource) metadata.seoMeta.originalSource = m.seoSource
      }

      onSave(editedFile, metadata)
    } catch (error) {
      console.error('Error processing image:', error)
      alert('Failed to process image. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }, [crop, rotation, quality, imageUrl, imageDimensions, displayDimensions, file.name, file.type, convertToWebp, isConvertibleFormat, onSave])

  const getCropInfo = () => {
    if (!crop || !displayDimensions.width) return null
    const scaleX = imageDimensions.width / displayDimensions.width
    const scaleY = imageDimensions.height / displayDimensions.height
    return { width: Math.round(crop.width * scaleX), height: Math.round(crop.height * scaleY) }
  }
  const cropInfo = getCropInfo()

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 10002,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
        backgroundColor: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1440,
          height: '92vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: c.bgPrimary,
          borderRadius: 12,
          border: `1px solid ${c.borderDefault}`,
          boxShadow: '0 0 0 1px rgba(99,102,241,0.1), 0 25px 50px rgba(0,0,0,0.8)',
          overflow: 'hidden',
        }}
      >
        {/* ── Header ───────────────────────────────────────────────────── */}
        <div
          style={{
            flexShrink: 0,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            backgroundColor: c.bgHeader,
            borderBottom: `1px solid ${c.borderDefault}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: 8, borderRadius: 8, backgroundColor: c.accentBg }}>
              <svg style={{ width: 20, height: 20, color: c.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: c.textPrimary, lineHeight: 1.3 }}>Edit Image</div>
              <div style={{ fontSize: 12, color: c.textMuted, maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {imageDimensions.width > 0 && (
              <span style={{ fontSize: 11, fontFamily: 'monospace', padding: '3px 8px', color: c.textMuted, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 4 }}>
                {imageDimensions.width} × {imageDimensions.height}px
              </span>
            )}
            <button
              onClick={onCancel}
              style={{ padding: 8, borderRadius: 8, color: c.textDim, background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = c.textPrimary }}
              onMouseLeave={(e) => { e.currentTarget.style.color = c.textDim }}
            >
              <svg style={{ width: 18, height: 18 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Body: editor (left) + metadata sidebar (right) ────────────── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Left: canvas area + controls */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

            {/* Image canvas area */}
            <div
              ref={containerRef}
              style={{
                flex: 1,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 32,
                overflow: 'hidden',
                backgroundColor: c.bgDeepest,
                backgroundImage:
                  'linear-gradient(45deg, #161620 25%, transparent 25%),' +
                  'linear-gradient(-45deg, #161620 25%, transparent 25%),' +
                  'linear-gradient(45deg, transparent 75%, #161620 75%),' +
                  'linear-gradient(-45deg, transparent 75%, #161620 75%)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              }}
            >
              {imageUrl && displayDimensions.width > 0 ? (
                <div
                  style={{
                    position: 'relative',
                    userSelect: 'none',
                    cursor: 'crosshair',
                    width: displayDimensions.width,
                    height: displayDimensions.height,
                    transform: `rotate(${rotation}deg)`,
                    transition: 'transform 0.3s ease',
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <img
                    ref={imageRef}
                    src={imageUrl}
                    alt="Preview"
                    onLoad={handleImageLoad}
                    style={{ display: 'block', width: displayDimensions.width, height: displayDimensions.height, borderRadius: 6, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}
                    draggable={false}
                  />
                  {crop && (
                    <div
                      style={{
                        position: 'absolute', pointerEvents: 'none',
                        left: crop.x, top: crop.y,
                        width: Math.max(crop.width, 1), height: Math.max(crop.height, 1),
                        border: '1.5px solid rgba(99,102,241,0.9)',
                        boxShadow: '0 0 0 9999px rgba(0,0,0,0.65)',
                      }}
                    >
                      {crop.width > 30 && crop.height > 30 && (
                        <>
                          {[{ top: -3, left: -3 }, { top: -3, right: -3 }, { bottom: -3, left: -3 }, { bottom: -3, right: -3 }].map((pos, i) => (
                            <div key={i} style={{ position: 'absolute', width: 6, height: 6, backgroundColor: c.accent, ...pos }} />
                          ))}
                          <div style={{ position: 'absolute', inset: 0 }}>
                            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '33.333%', width: 1, backgroundColor: 'rgba(99,102,241,0.3)' }} />
                            <div style={{ position: 'absolute', top: 0, bottom: 0, right: '33.333%', width: 1, backgroundColor: 'rgba(99,102,241,0.3)' }} />
                            <div style={{ position: 'absolute', left: 0, right: 0, top: '33.333%', height: 1, backgroundColor: 'rgba(99,102,241,0.3)' }} />
                            <div style={{ position: 'absolute', left: 0, right: 0, bottom: '33.333%', height: 1, backgroundColor: 'rgba(99,102,241,0.3)' }} />
                          </div>
                          {crop.width > 60 && crop.height > 40 && cropInfo && (
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                              <span style={{ padding: '2px 8px', fontSize: 11, fontFamily: 'monospace', backgroundColor: 'rgba(0,0,0,0.8)', color: c.textPrimary, borderRadius: 4 }}>
                                {cropInfo.width} × {cropInfo.height}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', border: `2px solid ${c.accent}`, borderTopColor: 'transparent', animation: 'spin 0.75s linear infinite' }} />
                </div>
              )}

              {/* Instructions */}
              <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', padding: '5px 14px', backgroundColor: 'rgba(15,15,20,0.8)', border: `1px solid rgba(99,102,241,0.5)`, borderRadius: 999, backdropFilter: 'blur(4px)' }}>
                <p style={{ fontSize: 12, color: c.textSecondary, margin: 0, whiteSpace: 'nowrap' }}>Drag to crop · Use controls below to rotate</p>
              </div>

              {rotation !== 0 && (
                <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', padding: '4px 12px', backgroundColor: c.accentBgSubtle, border: `1px solid ${c.borderAccentStrong}`, borderRadius: 999 }}>
                  <p style={{ fontSize: 12, color: c.accentLight, margin: 0 }}>{rotation}° rotation</p>
                </div>
              )}
            </div>

            {/* Controls bar */}
            <div
              style={{
                flexShrink: 0,
                padding: '12px 20px',
                backgroundColor: c.bgControls,
                borderTop: `1px solid ${c.borderDefault}`,
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                flexWrap: 'wrap' as const,
              }}
            >
              {/* Rotate */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10.5, textTransform: 'uppercase' as const, letterSpacing: '0.07em', color: c.textMuted, fontWeight: 600 }}>Rotate</span>
                <div style={{ display: 'flex', border: `1px solid ${c.borderDefault}`, borderRadius: 8, overflow: 'hidden', backgroundColor: c.bgElevated }}>
                  <button
                    onClick={() => rotate(-90)}
                    style={{ padding: '8px 10px', color: c.textSecondary, background: 'none', border: 'none', borderRight: `1px solid ${c.borderDefault}`, cursor: 'pointer', transition: 'color 0.15s' }}
                    title="Rotate left 90°"
                    onMouseEnter={(e) => { e.currentTarget.style.color = c.accent }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = c.textSecondary }}
                  >
                    <svg style={{ width: 18, height: 18 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => rotate(90)}
                    style={{ padding: '8px 10px', color: c.textSecondary, background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s' }}
                    title="Rotate right 90°"
                    onMouseEnter={(e) => { e.currentTarget.style.color = c.accent }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = c.textSecondary }}
                  >
                    <svg style={{ width: 18, height: 18, transform: 'scaleX(-1)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Quality */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10.5, textTransform: 'uppercase' as const, letterSpacing: '0.07em', color: c.textMuted, fontWeight: 600 }}>Quality</span>
                <input
                  type="range" min="10" max="100" value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  style={{ width: 100, cursor: 'pointer', accentColor: c.accent }}
                />
                <span style={{ fontSize: 11, fontFamily: 'monospace', padding: '3px 6px', color: c.textPrimary, backgroundColor: c.bgElevated, border: `1px solid ${c.borderDefault}`, borderRadius: 4, minWidth: 38, textAlign: 'center' as const }}>
                  {quality}%
                </span>
              </div>

              {/* Reset crop */}
              <button
                onClick={resetCrop}
                style={{ padding: '6px 12px', fontSize: 12, color: c.textSecondary, background: 'none', border: `1px solid ${c.borderDefault}`, borderRadius: 7, cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = c.accent; e.currentTarget.style.borderColor = c.accent }}
                onMouseLeave={(e) => { e.currentTarget.style.color = c.textSecondary; e.currentTarget.style.borderColor = c.borderDefault }}
              >
                Reset Crop
              </button>

              {cropInfo && (
                <span style={{ marginLeft: 'auto', fontSize: 11.5, color: c.textDim }}>
                  Output: <span style={{ fontFamily: 'monospace', color: c.textSecondary }}>{cropInfo.width} × {cropInfo.height}px</span>
                </span>
              )}
            </div>
          </div>

          {/* Right: metadata sidebar */}
          <div
            style={{
              flexShrink: 0,
              width: 340,
              display: 'flex',
              flexDirection: 'column',
              borderLeft: `1px solid ${c.borderDefault}`,
              backgroundColor: c.bgSidebar,
              overflow: 'hidden',
            }}
          >
            {/* Sidebar header */}
            <div style={{ flexShrink: 0, padding: '12px 16px 11px', borderBottom: `1px solid ${c.borderDefault}` }}>
              <span style={{ fontSize: 10.5, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: c.textMuted, fontWeight: 700 }}>Media Details</span>
            </div>

            {/* Scrollable fields */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Alt text (required) */}
              <div>
                <label style={labelStyle()}>
                  Alt Text <span style={{ color: '#F16C6C', fontWeight: 700 }}>*</span>
                </label>
                <input
                  type="text"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="Describe the image content…"
                  style={inputStyle(focusedField === 'alt')}
                  onFocus={() => setFocusedField('alt')}
                  onBlur={() => setFocusedField(null)}
                />
                <div style={{ fontSize: 11, color: c.textDim, marginTop: 4 }}>Required for accessibility &amp; SEO</div>
              </div>

              {/* Caption */}
              <div>
                <label style={labelStyle()}>Caption / Title</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Optional display title…"
                  style={inputStyle(focusedField === 'caption')}
                  onFocus={() => setFocusedField('caption')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle()}>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description…"
                  rows={2}
                  style={inputStyle(focusedField === 'description')}
                  onFocus={() => setFocusedField('description')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>

              {/* Tags */}
              <div>
                <label style={labelStyle()}>Tags</label>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                    placeholder="Add a tag…"
                    style={{ ...inputStyle(focusedField === 'tags'), flex: 1 }}
                    onFocus={() => setFocusedField('tags')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    disabled={!tagInput.trim()}
                    style={{
                      padding: '0 10px',
                      background: c.bgElevated,
                      border: `1px solid ${c.borderDefault}`,
                      borderRadius: 6,
                      color: c.textSecondary,
                      fontSize: 12,
                      cursor: tagInput.trim() ? 'pointer' : 'not-allowed',
                      opacity: tagInput.trim() ? 1 : 0.4,
                      transition: 'all 0.1s',
                      outline: 'none',
                      whiteSpace: 'nowrap' as const,
                    }}
                  >
                    Add
                  </button>
                </div>
                {tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 5 }}>
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          padding: '3px 8px', borderRadius: 5,
                          background: c.accentTag,
                          border: `1px solid ${c.borderAccent}`,
                          color: c.accentLight,
                          fontSize: 11.5,
                        }}
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, lineHeight: 1, opacity: 0.7 }}
                          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
                          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7' }}
                        >
                          <svg style={{ width: 10, height: 10 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: c.borderDefault, margin: '0 -16px', padding: '0 16px' }} />

              {/* Featured toggle */}
              <SidebarToggle label="Featured" checked={featured} onChange={setFeatured} />

              {/* Convert to WebP */}
              {isConvertibleFormat && (
                <div>
                  <SidebarToggle
                    label="Convert to WebP"
                    checked={convertToWebp}
                    onChange={setConvertToWebp}
                  />
                  <div style={{ fontSize: 10.5, color: c.textDim, marginTop: 4 }}>
                    {file.type === 'image/jpeg'
                      ? 'Converts before upload — smaller file'
                      : 'Smaller file size, better performance'}
                  </div>
                </div>
              )}

              {/* Media type */}
              <div>
                <label style={labelStyle()}>Media Type</label>
                <select
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value as 'image' | 'video' | 'audio' | 'document')}
                  style={{ ...inputStyle(focusedField === 'mediaType'), cursor: 'pointer' }}
                  onFocus={() => setFocusedField('mediaType')}
                  onBlur={() => setFocusedField(null)}
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="document">Document</option>
                </select>
              </div>

              {/* Video settings */}
              {mediaType === 'video' && (
                <div>
                  <div style={{ fontSize: 10.5, textTransform: 'uppercase' as const, letterSpacing: '0.07em', color: c.textMuted, fontWeight: 700, marginBottom: 10 }}>Video Settings</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div>
                      <label style={{ ...labelStyle(), textTransform: 'none' as const, letterSpacing: 0, fontSize: 11.5, fontWeight: 400, color: c.textSecondary }}>Duration (seconds)</label>
                      <input
                        type="number"
                        value={videoDuration || ''}
                        onChange={(e) => setVideoDuration(e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="e.g. 120"
                        style={inputStyle(focusedField === 'videoDuration')}
                        onFocus={() => setFocusedField('videoDuration')}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                    <SidebarToggle label="Autoplay" checked={videoAutoplay} onChange={setVideoAutoplay} />
                    <SidebarToggle label="Start muted" checked={videoMuted} onChange={setVideoMuted} />
                  </div>
                </div>
              )}

              {/* SEO & attribution (collapsible) */}
              <details>
                <summary style={{ fontSize: 10.5, textTransform: 'uppercase' as const, letterSpacing: '0.07em', color: c.textMuted, fontWeight: 700, cursor: 'pointer', userSelect: 'none', listStyle: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg style={{ width: 12, height: 12 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  SEO &amp; Attribution
                </summary>
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { key: 'seoKeywords', label: 'Focus Keywords', value: seoKeywords, setter: setSeoKeywords, placeholder: 'grand-piano, kawai' },
                    { key: 'seoPhotographer', label: 'Photographer Credit', value: seoPhotographer, setter: setSeoPhotographer, placeholder: 'Photo credit' },
                    { key: 'seoCopyright', label: 'Copyright Info', value: seoCopyright, setter: setSeoCopyright, placeholder: 'Copyright or licensing' },
                    { key: 'seoSource', label: 'Original Source', value: seoSource, setter: setSeoSource, placeholder: 'Source URL' },
                  ].map(({ key, label, value, setter, placeholder }) => (
                    <div key={key}>
                      <label style={{ ...labelStyle(), textTransform: 'none' as const, letterSpacing: 0, fontSize: 11.5, fontWeight: 400, color: c.textSecondary }}>{label}</label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setter(e.target.value)}
                        placeholder={placeholder}
                        style={inputStyle(focusedField === key)}
                        onFocus={() => setFocusedField(key)}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                  ))}
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <div
          style={{
            flexShrink: 0,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            backgroundColor: c.bgPrimary,
            borderTop: `1px solid ${c.borderDefault}`,
          }}
        >
          <button
            onClick={onCancel}
            style={{ padding: '8px 16px', fontSize: 13, color: c.textDim, background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8, transition: 'color 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = c.textSecondary }}
            onMouseLeave={(e) => { e.currentTarget.style.color = c.textDim }}
          >
            Skip
          </button>
          <button
            onClick={handleSave}
            disabled={isProcessing || !crop || !alt.trim()}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 24px',
              fontSize: 13, fontWeight: 600,
              color: c.white,
              backgroundColor: c.accent,
              border: 'none', borderRadius: 8,
              cursor: (isProcessing || !crop || !alt.trim()) ? 'not-allowed' : 'pointer',
              opacity: (isProcessing || !crop || !alt.trim()) ? 0.5 : 1,
              transition: 'all 0.15s',
              boxShadow: (!isProcessing && crop && alt.trim()) ? '0 4px 16px rgba(99,102,241,0.35)' : 'none',
            }}
            onMouseEnter={(e) => { if (!(e.currentTarget as HTMLButtonElement).disabled) e.currentTarget.style.backgroundColor = c.accentHover }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = c.accent }}
          >
            {isProcessing ? (
              <>
                <div style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid rgba(255,255,255,0.35)`, borderTopColor: c.white, animation: 'spin 0.75s linear infinite' }} />
                Processing…
              </>
            ) : (
              <>
                <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Media
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
