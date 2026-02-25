'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

// Dark theme color constants — matches media manager aesthetic
const c = {
  // Backgrounds
  bgDeepest: '#0C0C0F',
  bgPrimary: '#17171F',
  bgHeader: '#1A1A28',
  bgElevated: '#1E1E2A',
  bgHover: '#252535',
  bgControls: '#14141E',
  // Borders
  borderDefault: '#2C2C3E',
  borderAccent: 'rgba(99,102,241,0.3)',
  borderAccentStrong: 'rgba(99,102,241,0.4)',
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
  // Misc
  white: '#ffffff',
  black: '#000000',
  overlayDark: 'rgba(0,0,0,0.8)',
}

interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

interface ImageEditorProps {
  file: File
  onSave: (editedFile: File, convertToWebp: boolean) => void
  onCancel: () => void
}

/**
 * Simple image editor with crop, rotate, and quality controls
 * Scales consistently to fill available space
 */
export function ImageEditor({ file, onSave, onCancel }: ImageEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const [imageUrl, setImageUrl] = useState<string>('')
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  const [displayDimensions, setDisplayDimensions] = useState({ width: 0, height: 0 })
  const [containerSize, setContainerSize] = useState({ width: 800, height: 500 })

  const [rotation, setRotation] = useState(0)
  const [quality, setQuality] = useState(85)
  const isPng = file.type === 'image/png'
  const isJpeg = file.type === 'image/jpeg' || file.type === 'image/jpg'
  // Show WebP toggle for PNG and JPEG — both benefit from WebP conversion
  const isWebpConvertible = isPng || isJpeg
  const [convertToWebp, setConvertToWebp] = useState(isWebpConvertible)

  // Crop state (in display coordinates)
  const [crop, setCrop] = useState<CropArea | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const [isProcessing, setIsProcessing] = useState(false)

  // Load image and get its dimensions
  useEffect(() => {
    const url = URL.createObjectURL(file)
    setImageUrl(url)

    // Load image to get dimensions BEFORE rendering
    // This breaks the circular dependency where the img element
    // only renders when displayDimensions > 0, but dimensions
    // are only set via onLoad which requires the img to render
    const img = new Image()
    img.onload = () => {
      setImageDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      })
    }
    img.src = url

    return () => URL.revokeObjectURL(url)
  }, [file])

  // Measure container size
  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        // Account for padding (32px on each side)
        setContainerSize({
          width: rect.width - 64,
          height: rect.height - 64,
        })
      }
    }

    updateContainerSize()
    window.addEventListener('resize', updateContainerSize)
    return () => window.removeEventListener('resize', updateContainerSize)
  }, [])

  // Calculate display dimensions when image loads or container resizes
  const calculateDisplayDimensions = useCallback(() => {
    if (!imageDimensions.width || !imageDimensions.height) return

    const maxWidth = Math.min(containerSize.width, 900)
    const maxHeight = Math.min(containerSize.height, 600)

    const imageRatio = imageDimensions.width / imageDimensions.height
    const containerRatio = maxWidth / maxHeight

    let displayWidth: number
    let displayHeight: number

    if (imageRatio > containerRatio) {
      // Image is wider than container ratio - fit to width
      displayWidth = maxWidth
      displayHeight = maxWidth / imageRatio
    } else {
      // Image is taller than container ratio - fit to height
      displayHeight = maxHeight
      displayWidth = maxHeight * imageRatio
    }

    // Ensure minimum size
    displayWidth = Math.max(displayWidth, 200)
    displayHeight = Math.max(displayHeight, 200)

    setDisplayDimensions({
      width: Math.round(displayWidth),
      height: Math.round(displayHeight),
    })

    // Reset crop to full image when dimensions change
    setCrop({
      x: 0,
      y: 0,
      width: Math.round(displayWidth),
      height: Math.round(displayHeight),
    })
  }, [imageDimensions, containerSize])

  useEffect(() => {
    calculateDisplayDimensions()
  }, [calculateDisplayDimensions])

  // Handle image load
  const handleImageLoad = useCallback(() => {
    if (!imageRef.current) return

    const img = imageRef.current
    setImageDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight,
    })
  }, [])

  // Get mouse position relative to image
  const getMousePosition = useCallback((e: React.MouseEvent) => {
    if (!imageRef.current) return { x: 0, y: 0 }

    const rect = imageRef.current.getBoundingClientRect()
    return {
      x: Math.max(0, Math.min(e.clientX - rect.left, displayDimensions.width)),
      y: Math.max(0, Math.min(e.clientY - rect.top, displayDimensions.height)),
    }
  }, [displayDimensions])

  // Mouse handlers for crop selection
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

    const newCrop = {
      x: Math.min(dragStart.x, pos.x),
      y: Math.min(dragStart.y, pos.y),
      width: Math.abs(pos.x - dragStart.x),
      height: Math.abs(pos.y - dragStart.y),
    }

    setCrop(newCrop)
  }, [isDragging, dragStart, getMousePosition])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)

    // If crop is too small, reset to full image
    if (crop && (crop.width < 20 || crop.height < 20)) {
      setCrop({ x: 0, y: 0, width: displayDimensions.width, height: displayDimensions.height })
    }
  }, [crop, displayDimensions])

  // Rotate
  const rotate = useCallback((degrees: number) => {
    setRotation((prev) => (prev + degrees + 360) % 360)
  }, [])

  // Reset crop
  const resetCrop = useCallback(() => {
    setCrop({ x: 0, y: 0, width: displayDimensions.width, height: displayDimensions.height })
  }, [displayDimensions])

  // Process and save
  const handleSave = useCallback(async () => {
    if (!crop || !imageRef.current) return

    setIsProcessing(true)

    try {
      // Calculate scale from display to original
      const scaleX = imageDimensions.width / displayDimensions.width
      const scaleY = imageDimensions.height / displayDimensions.height

      // Convert crop from display coordinates to original image coordinates
      const originalCrop = {
        x: Math.round(crop.x * scaleX),
        y: Math.round(crop.y * scaleY),
        width: Math.round(crop.width * scaleX),
        height: Math.round(crop.height * scaleY),
      }

      // Ensure crop is within bounds
      originalCrop.x = Math.max(0, Math.min(originalCrop.x, imageDimensions.width - 1))
      originalCrop.y = Math.max(0, Math.min(originalCrop.y, imageDimensions.height - 1))
      originalCrop.width = Math.min(originalCrop.width, imageDimensions.width - originalCrop.x)
      originalCrop.height = Math.min(originalCrop.height, imageDimensions.height - originalCrop.y)

      // Create a new image element for processing
      const img = new Image()
      img.crossOrigin = 'anonymous'

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = imageUrl
      })

      // Step 1: Create canvas for rotation (if needed)
      let sourceCanvas: HTMLCanvasElement
      let sourceCtx: CanvasRenderingContext2D | null

      if (rotation !== 0) {
        // For 90/270 rotation, swap dimensions
        const swap = rotation === 90 || rotation === 270
        const rotatedWidth = swap ? img.height : img.width
        const rotatedHeight = swap ? img.width : img.height

        sourceCanvas = document.createElement('canvas')
        sourceCanvas.width = rotatedWidth
        sourceCanvas.height = rotatedHeight
        sourceCtx = sourceCanvas.getContext('2d')

        if (!sourceCtx) throw new Error('Could not get canvas context')

        // Rotate around center
        sourceCtx.translate(rotatedWidth / 2, rotatedHeight / 2)
        sourceCtx.rotate((rotation * Math.PI) / 180)
        sourceCtx.translate(-img.width / 2, -img.height / 2)
        sourceCtx.drawImage(img, 0, 0)
      } else {
        // No rotation - draw original image
        sourceCanvas = document.createElement('canvas')
        sourceCanvas.width = img.width
        sourceCanvas.height = img.height
        sourceCtx = sourceCanvas.getContext('2d')

        if (!sourceCtx) throw new Error('Could not get canvas context')
        sourceCtx.drawImage(img, 0, 0)
      }

      // Step 2: Crop from the (potentially rotated) source
      // Adjust crop coordinates if rotated
      let finalCrop = { ...originalCrop }

      if (rotation === 90) {
        finalCrop = {
          x: originalCrop.y,
          y: imageDimensions.width - originalCrop.x - originalCrop.width,
          width: originalCrop.height,
          height: originalCrop.width,
        }
      } else if (rotation === 180) {
        finalCrop = {
          x: imageDimensions.width - originalCrop.x - originalCrop.width,
          y: imageDimensions.height - originalCrop.y - originalCrop.height,
          width: originalCrop.width,
          height: originalCrop.height,
        }
      } else if (rotation === 270) {
        finalCrop = {
          x: imageDimensions.height - originalCrop.y - originalCrop.height,
          y: originalCrop.x,
          width: originalCrop.height,
          height: originalCrop.width,
        }
      }

      // Ensure final crop is valid
      finalCrop.x = Math.max(0, finalCrop.x)
      finalCrop.y = Math.max(0, finalCrop.y)
      finalCrop.width = Math.max(1, Math.min(finalCrop.width, sourceCanvas.width - finalCrop.x))
      finalCrop.height = Math.max(1, Math.min(finalCrop.height, sourceCanvas.height - finalCrop.y))

      // Create output canvas with crop dimensions
      const outputCanvas = document.createElement('canvas')
      outputCanvas.width = finalCrop.width
      outputCanvas.height = finalCrop.height
      const outputCtx = outputCanvas.getContext('2d')

      if (!outputCtx) throw new Error('Could not get output canvas context')

      // Draw cropped region
      outputCtx.drawImage(
        sourceCanvas,
        finalCrop.x, finalCrop.y, finalCrop.width, finalCrop.height,
        0, 0, finalCrop.width, finalCrop.height
      )

      // Determine output format — convert PNG or JPEG to WebP if toggled on
      const originalMimeType = file.type || 'image/jpeg'
      const supportedFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
      const baseMimeType = supportedFormats.includes(originalMimeType) ? originalMimeType : 'image/jpeg'
      const isConvertibleMime = baseMimeType === 'image/png' || baseMimeType === 'image/jpeg' || baseMimeType === 'image/jpg'
      const outputMimeType = (convertToWebp && isConvertibleMime) ? 'image/webp' : baseMimeType

      // Quality parameter applies to JPEG and WebP
      const qualityParam = (outputMimeType === 'image/jpeg' || outputMimeType === 'image/webp')
        ? quality / 100
        : undefined

      // Convert to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        outputCanvas.toBlob(
          (b) => b ? resolve(b) : reject(new Error('Failed to create blob')),
          outputMimeType,
          qualityParam
        )
      })

      const extensionMap: Record<string, string> = {
        'image/png': '.png',
        'image/jpeg': '.jpg',
        'image/webp': '.webp',
      }
      const extension = extensionMap[outputMimeType] ?? '.jpg'
      const fileName = file.name.replace(/\.[^.]+$/, extension)

      const editedFile = new File([blob], fileName, {
        type: outputMimeType,
        lastModified: Date.now(),
      })

      onSave(editedFile, convertToWebp)
    } catch (error) {
      console.error('Error processing image:', error)
      alert('Failed to process image. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }, [crop, rotation, quality, imageUrl, imageDimensions, displayDimensions, file.name, onSave])

  // Calculate crop info for display
  const getCropInfo = () => {
    if (!crop || !displayDimensions.width) return null

    const scaleX = imageDimensions.width / displayDimensions.width
    const scaleY = imageDimensions.height / displayDimensions.height

    return {
      width: Math.round(crop.width * scaleX),
      height: Math.round(crop.height * scaleY),
    }
  }

  const cropInfo = getCropInfo()

  return (
    <div
      className="fixed inset-0 z-[10002] flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
    >
      <div
        className="w-full max-w-5xl h-[90vh] max-h-[900px] flex flex-col overflow-hidden"
        style={{
          backgroundColor: c.bgPrimary,
          borderRadius: '12px',
          border: `1px solid ${c.borderDefault}`,
          boxShadow: '0 0 0 1px rgba(99,102,241,0.1), 0 25px 50px rgba(0,0,0,0.8)',
        }}
      >
        {/* Header */}
        <div
          className="flex-shrink-0 px-6 py-4"
          style={{
            backgroundColor: c.bgHeader,
            borderBottom: `1px solid ${c.borderDefault}`,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  backgroundColor: c.accentBg,
                }}
              >
                <svg
                  className="w-6 h-6"
                  style={{ color: c.accent }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3
                  className="text-lg font-semibold"
                  style={{ color: c.textPrimary, lineHeight: '1.3' }}
                >
                  Edit Image
                </h3>
                <p
                  className="text-sm truncate max-w-sm"
                  style={{ color: c.textMuted }}
                >
                  {file.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {imageDimensions.width > 0 && (
                <span
                  className="text-xs font-mono px-2 py-1"
                  style={{
                    color: c.textMuted,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderRadius: '4px',
                  }}
                >
                  {imageDimensions.width} × {imageDimensions.height}px
                </span>
              )}
              <button
                onClick={onCancel}
                className="p-2 rounded-lg"
                style={{
                  color: c.textDim,
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = c.textPrimary }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = c.textDim }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Image area - takes remaining space */}
        <div
          ref={containerRef}
          className="flex-1 relative flex items-center justify-center p-8 overflow-hidden"
          style={{
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
              className="relative select-none cursor-crosshair"
              style={{
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
              {/* Image */}
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Preview"
                onLoad={handleImageLoad}
                className="block"
                style={{
                  width: displayDimensions.width,
                  height: displayDimensions.height,
                  borderRadius: '6px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                }}
                draggable={false}
              />

              {/* Crop selection with shadow overlay */}
              {crop && (
                <div
                  className="absolute pointer-events-none"
                  style={{
                    left: crop.x,
                    top: crop.y,
                    width: Math.max(crop.width, 1),
                    height: Math.max(crop.height, 1),
                    border: `1.5px solid rgba(99,102,241,0.9)`,
                    boxShadow: '0 0 0 9999px rgba(0,0,0,0.65)',
                  }}
                >
                  {/* Corner handles — sharp violet squares */}
                  {crop.width > 30 && crop.height > 30 && (
                    <>
                      <div
                        className="absolute"
                        style={{
                          top: -3,
                          left: -3,
                          width: 6,
                          height: 6,
                          backgroundColor: c.accent,
                          borderRadius: 0,
                        }}
                      />
                      <div
                        className="absolute"
                        style={{
                          top: -3,
                          right: -3,
                          width: 6,
                          height: 6,
                          backgroundColor: c.accent,
                          borderRadius: 0,
                        }}
                      />
                      <div
                        className="absolute"
                        style={{
                          bottom: -3,
                          left: -3,
                          width: 6,
                          height: 6,
                          backgroundColor: c.accent,
                          borderRadius: 0,
                        }}
                      />
                      <div
                        className="absolute"
                        style={{
                          bottom: -3,
                          right: -3,
                          width: 6,
                          height: 6,
                          backgroundColor: c.accent,
                          borderRadius: 0,
                        }}
                      />

                      {/* Rule of thirds grid */}
                      <div className="absolute inset-0 pointer-events-none">
                        <div
                          className="absolute top-0 bottom-0 w-px"
                          style={{ left: '33.333%', backgroundColor: 'rgba(99,102,241,0.3)' }}
                        />
                        <div
                          className="absolute top-0 bottom-0 w-px"
                          style={{ right: '33.333%', backgroundColor: 'rgba(99,102,241,0.3)' }}
                        />
                        <div
                          className="absolute left-0 right-0 h-px"
                          style={{ top: '33.333%', backgroundColor: 'rgba(99,102,241,0.3)' }}
                        />
                        <div
                          className="absolute left-0 right-0 h-px"
                          style={{ bottom: '33.333%', backgroundColor: 'rgba(99,102,241,0.3)' }}
                        />
                      </div>
                    </>
                  )}

                  {/* Crop dimensions label */}
                  {crop.width > 60 && crop.height > 40 && cropInfo && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span
                        className="px-2 py-1 text-xs font-mono"
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          color: c.textPrimary,
                          borderRadius: '4px',
                        }}
                      >
                        {cropInfo.width} × {cropInfo.height}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <div
                className="animate-spin rounded-full h-10 w-10 border-2"
                style={{ borderColor: c.accent, borderTopColor: 'transparent' }}
              />
            </div>
          )}

          {/* Instructions overlay */}
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 backdrop-blur-sm"
            style={{
              backgroundColor: 'rgba(15,15,20,0.8)',
              border: `1px solid rgba(99,102,241,0.6)`,
              borderRadius: '999px',
            }}
          >
            <p className="text-sm font-medium" style={{ color: c.textSecondary }}>
              Click and drag to select crop area
            </p>
          </div>

          {/* Rotation indicator */}
          {rotation !== 0 && (
            <div
              className="absolute top-6 left-1/2 -translate-x-1/2 px-3 py-1.5"
              style={{
                backgroundColor: c.accentBgSubtle,
                border: `1px solid ${c.borderAccentStrong}`,
                borderRadius: '999px',
              }}
            >
              <p className="text-sm font-medium" style={{ color: c.accentLight }}>
                {rotation}° rotation
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div
          className="flex-shrink-0 px-6 py-4"
          style={{
            backgroundColor: c.bgControls,
            borderTop: `1px solid ${c.borderDefault}`,
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              {/* Rotation */}
              <div className="flex items-center gap-2">
                <span
                  className="text-xs uppercase tracking-widest"
                  style={{ color: c.textMuted }}
                >
                  Rotate
                </span>
                <div
                  className="flex items-center"
                  style={{
                    backgroundColor: c.bgElevated,
                    border: `1px solid ${c.borderDefault}`,
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => rotate(-90)}
                    className="p-2.5"
                    style={{
                      color: c.textSecondary,
                      borderRight: `1px solid ${c.borderDefault}`,
                      transition: 'all 0.15s ease',
                    }}
                    title="Rotate left 90°"
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = c.accent }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = c.textSecondary }}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => rotate(90)}
                    className="p-2.5"
                    style={{
                      color: c.textSecondary,
                      transition: 'all 0.15s ease',
                    }}
                    title="Rotate right 90°"
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = c.accent }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = c.textSecondary }}
                  >
                    <svg className="w-5 h-5 scale-x-[-1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Quality slider */}
              <div className="flex items-center gap-2">
                <span
                  className="text-xs uppercase tracking-widest"
                  style={{ color: c.textMuted }}
                >
                  Quality
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-32 cursor-pointer"
                    style={{ accentColor: c.accent, height: '4px' }}
                  />
                  <span
                    className="text-xs font-mono w-10 text-right px-1.5 py-1"
                    style={{
                      color: c.textPrimary,
                      backgroundColor: c.bgElevated,
                      borderRadius: '4px',
                      border: `1px solid ${c.borderDefault}`,
                    }}
                  >
                    {quality}%
                  </span>
                </div>
              </div>

              {/* Reset crop */}
              <button
                onClick={resetCrop}
                className="px-4 py-2 text-sm font-medium"
                style={{
                  color: c.textSecondary,
                  backgroundColor: 'transparent',
                  border: `1px solid ${c.borderDefault}`,
                  borderRadius: '8px',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.color = c.accent
                  el.style.borderColor = c.accent
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.color = c.textSecondary
                  el.style.borderColor = c.borderDefault
                }}
              >
                Reset Crop
              </button>

              {/* Convert to WebP toggle — PNG and JPEG */}
              {isWebpConvertible && (
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs uppercase tracking-widest"
                    style={{ color: c.textMuted }}
                  >
                    WebP
                  </span>
                  <button
                    onClick={() => setConvertToWebp(v => !v)}
                    className="relative flex-shrink-0"
                    style={{
                      width: '40px',
                      height: '22px',
                      borderRadius: '999px',
                      backgroundColor: convertToWebp ? c.accent : c.bgHover,
                      border: `1px solid ${convertToWebp ? c.accent : c.borderDefault}`,
                      transition: 'all 0.15s ease',
                    }}
                    title={convertToWebp ? 'Will convert PNG → WebP on upload' : 'Will keep original PNG format'}
                  >
                    <span
                      className="absolute"
                      style={{
                        top: '2px',
                        left: '2px',
                        width: '16px',
                        height: '16px',
                        borderRadius: '999px',
                        backgroundColor: c.white,
                        transform: convertToWebp ? 'translateX(18px)' : 'translateX(0)',
                        transition: 'transform 0.15s ease',
                      }}
                    />
                  </button>
                </div>
              )}
            </div>

            {/* Output info */}
            {cropInfo && (
              <div className="text-sm" style={{ color: c.textDim }}>
                Output:{' '}
                <span className="font-mono" style={{ color: c.textSecondary }}>
                  {cropInfo.width} × {cropInfo.height}px
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex-shrink-0 px-6 py-4 flex items-center justify-between"
          style={{
            backgroundColor: c.bgPrimary,
            borderTop: `1px solid ${c.borderDefault}`,
          }}
        >
          <button
            onClick={onCancel}
            className="px-5 py-2.5 text-sm font-medium"
            style={{
              color: c.textDim,
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = c.textSecondary }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = c.textDim }}
          >
            Skip Editing
          </button>
          <button
            onClick={handleSave}
            disabled={isProcessing || !crop}
            className="px-8 py-2.5 text-sm font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              color: c.white,
              backgroundColor: c.accent,
              borderRadius: '8px',
              border: 'none',
              transition: 'all 0.15s ease',
              boxShadow: isProcessing ? 'none' : '0 0 0 0 transparent',
            }}
            onMouseEnter={(e) => {
              if (!(e.currentTarget as HTMLButtonElement).disabled) {
                const el = e.currentTarget as HTMLButtonElement
                el.style.backgroundColor = c.accentHover
                el.style.boxShadow = '0 4px 20px rgba(99,102,241,0.4)'
              }
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.backgroundColor = c.accent
              el.style.boxShadow = '0 0 0 0 transparent'
            }}
          >
            {isProcessing ? (
              <>
                <div
                  className="animate-spin rounded-full h-4 w-4 border-2"
                  style={{ borderColor: c.white, borderTopColor: 'transparent' }}
                />
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Apply & Upload
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
