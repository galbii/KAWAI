'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import type { Media } from '@/payload-types'
import type { VideoPlayerProps, VideoPlayerState } from '@/lib/media/types'
import { getVideoProps, extractFilename } from '@/lib/media/r2-utils'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

/**
 * Advanced video player component optimized for R2-hosted videos
 * Features: custom controls, thumbnails, progressive loading, accessibility
 */
export const VideoPlayer = React.forwardRef<
  HTMLVideoElement,
  VideoPlayerProps
>(({
  media,
  poster = true,
  thumbnailPreset = 'gallery',
  showControls = true,
  showProgressBar = true,
  showVolumeControl = true,
  showFullscreenButton = true,
  customControls = false,
  className,
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  onVolumeChange,
  ...props
}, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const volumeRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<VideoPlayerState>({
    isPlaying: false,
    isPaused: true,
    isEnded: false,
    isMuted: props.muted || true,
    volume: 1,
    currentTime: 0,
    duration: 0,
    buffered: null,
    isFullscreen: false,
    hasError: false
  })

  // Combine refs
  React.useImperativeHandle(ref, () => videoRef.current!)

  // Get video properties from R2 utils
  const videoProps = getVideoProps(media, {
    poster: poster !== false,
    autoplay: props.autoPlay,
    muted: props.muted,
    controls: !customControls && showControls,
    loop: props.loop,
    preload: props.preload
  })

  if (!videoProps?.src) {
    return (
      <div className={cn('flex items-center justify-center bg-muted text-muted-foreground', className)}>
        <span>Invalid video</span>
      </div>
    )
  }

  // Play/pause toggle
  const togglePlay = useCallback(async () => {
    if (!videoRef.current) return

    try {
      if (state.isPlaying) {
        videoRef.current.pause()
      } else {
        await videoRef.current.play()
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        hasError: true, 
        error: error instanceof Error ? error.message : 'Playback error'
      }))
    }
  }, [state.isPlaying])

  // Seek to specific time
  const seek = useCallback((time: number) => {
    if (!videoRef.current) return
    videoRef.current.currentTime = time
  }, [])

  // Volume control
  const setVolume = useCallback((volume: number) => {
    if (!videoRef.current) return
    const clampedVolume = Math.max(0, Math.min(1, volume))
    videoRef.current.volume = clampedVolume
    setState(prev => ({ ...prev, volume: clampedVolume }))
    onVolumeChange?.(clampedVolume)
  }, [onVolumeChange])

  // Mute toggle
  const toggleMute = useCallback(() => {
    if (!videoRef.current) return
    const newMuted = !state.isMuted
    videoRef.current.muted = newMuted
    setState(prev => ({ ...prev, isMuted: newMuted }))
  }, [state.isMuted])

  // Fullscreen toggle
  const toggleFullscreen = useCallback(async () => {
    if (!videoRef.current) return

    try {
      if (!document.fullscreenElement) {
        await videoRef.current.requestFullscreen()
        setState(prev => ({ ...prev, isFullscreen: true }))
      } else {
        await document.exitFullscreen()
        setState(prev => ({ ...prev, isFullscreen: false }))
      }
    } catch (error) {
      console.warn('Fullscreen not supported or failed:', error)
    }
  }, [])

  // Event handlers
  const handlePlay = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: true, isPaused: false, isEnded: false }))
    onPlay?.()
  }, [onPlay])

  const handlePause = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false, isPaused: true }))
    onPause?.()
  }, [onPause])

  const handleEnded = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false, isPaused: true, isEnded: true }))
    onEnded?.()
  }, [onEnded])

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return
    const { currentTime, duration } = videoRef.current
    setState(prev => ({ ...prev, currentTime, duration }))
    onTimeUpdate?.(currentTime, duration)
  }, [onTimeUpdate])

  const handleLoadedMetadata = useCallback(() => {
    if (!videoRef.current) return
    setState(prev => ({ ...prev, duration: videoRef.current!.duration }))
  }, [])

  const handleVolumeChange = useCallback(() => {
    if (!videoRef.current) return
    setState(prev => ({ 
      ...prev, 
      volume: videoRef.current!.volume,
      isMuted: videoRef.current!.muted
    }))
  }, [])

  const handleProgress = useCallback(() => {
    if (!videoRef.current) return
    setState(prev => ({ ...prev, buffered: videoRef.current!.buffered }))
  }, [])

  const handleError = useCallback(() => {
    setState(prev => ({ ...prev, hasError: true }))
  }, [])

  // Progress bar click handler
  const handleProgressClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current || !state.duration) return

    const rect = progressRef.current.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const percentage = clickX / rect.width
    const newTime = percentage * state.duration

    seek(newTime)
  }, [state.duration, seek])

  // Volume bar click handler
  const handleVolumeClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeRef.current) return

    const rect = volumeRef.current.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const percentage = clickX / rect.width
    setVolume(percentage)
  }, [setVolume])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!videoRef.current) return

      switch (event.code) {
        case 'Space':
          event.preventDefault()
          togglePlay()
          break
        case 'ArrowLeft':
          event.preventDefault()
          seek(Math.max(0, state.currentTime - 10))
          break
        case 'ArrowRight':
          event.preventDefault()
          seek(Math.min(state.duration, state.currentTime + 10))
          break
        case 'KeyM':
          event.preventDefault()
          toggleMute()
          break
        case 'KeyF':
          event.preventDefault()
          toggleFullscreen()
          break
      }
    }

    const video = videoRef.current
    if (video) {
      video.addEventListener('keydown', handleKeyDown)
      return () => video.removeEventListener('keydown', handleKeyDown)
    }
  }, [togglePlay, seek, state.currentTime, state.duration, toggleMute, toggleFullscreen])

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setState(prev => ({ ...prev, isFullscreen: !!document.fullscreenElement }))
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Progress percentage
  const progressPercentage = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0

  // Buffered percentage
  const bufferedPercentage = state.buffered && state.duration > 0 && state.buffered.length > 0
    ? (state.buffered.end(state.buffered.length - 1) / state.duration) * 100
    : 0

  return (
    <div className={cn('relative group', className)}>
      <video
        ref={videoRef}
        {...videoProps}
        className="w-full h-full"
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onVolumeChange={handleVolumeChange}
        onProgress={handleProgress}
        onError={handleError}
        {...props}
      />

      {/* Custom Controls Overlay */}
      {customControls && showControls && (
        <div className={cn(
          'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-200'
        )}>
          {/* Progress Bar */}
          {showProgressBar && (
            <div className="mb-4">
              <div
                ref={progressRef}
                className="relative h-2 bg-white/20 rounded-full cursor-pointer"
                onClick={handleProgressClick}
              >
                {/* Buffered Progress */}
                <div
                  className="absolute top-0 left-0 h-full bg-white/40 rounded-full"
                  style={{ width: `${bufferedPercentage}%` }}
                />
                {/* Current Progress */}
                <div
                  className="absolute top-0 left-0 h-full bg-white rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
                {/* Progress Thumb */}
                <div
                  className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Play/Pause Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                className="text-white hover:text-white hover:bg-white/20"
              >
                {state.isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </Button>

              {/* Time Display */}
              <span className="text-white text-sm">
                {formatTime(state.currentTime)} / {formatTime(state.duration)}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {/* Volume Control */}
              {showVolumeControl && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-white hover:text-white hover:bg-white/20"
                  >
                    {state.isMuted || state.volume === 0 ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.776L4.83 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.83l3.553-3.776a1 1 0 011.617.776zM15 8.586V6a1 1 0 012 0v10a1 1 0 11-2 0v-2.586l-2.293 2.293a1 1 0 01-1.414-1.414L13.586 12l-2.293-2.293a1 1 0 011.414-1.414L15 8.586z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.776L4.83 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.83l3.553-3.776a1 1 0 011.617.776zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                      </svg>
                    )}
                  </Button>
                  <div
                    ref={volumeRef}
                    className="w-16 h-1 bg-white/20 rounded-full cursor-pointer"
                    onClick={handleVolumeClick}
                  >
                    <div
                      className="h-full bg-white rounded-full"
                      style={{ width: `${state.volume * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Fullscreen Button */}
              {showFullscreenButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-white hover:text-white hover:bg-white/20"
                >
                  {state.isFullscreen ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 1v10h10V5H5z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 1v10h10V5H5z" clipRule="evenodd" />
                    </svg>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {state.hasError && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="text-center text-white">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-lg font-medium mb-2">Video Error</p>
            <p className="text-sm text-white/70">{state.error || 'Failed to load video'}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setState(prev => ({ ...prev, hasError: false, error: undefined }))
                if (videoRef.current) {
                  videoRef.current.load()
                }
              }}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </div>
      )}
    </div>
  )
})

VideoPlayer.displayName = 'VideoPlayer'