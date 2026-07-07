'use client'

/**
 * News Video Background - Video support for news carousel items
 *
 * Displays YouTube or direct MP4 videos as backgrounds for news items.
 * Videos auto-play, muted, and loop seamlessly while maintaining
 * the same content overlay structure as other news slides.
 */

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { getYouTubeEmbedUrl } from '@/lib/utils/youtube'
import { BackgroundMotionToggle } from '@/components/ui/background-motion-toggle'

export interface NewsVideoBackgroundProps {
  title: string
  description: string
  videoUrl: string
  videoSource?: 'youtube' | 'direct' | null
  videoMimeType?: string | null
  youtubeZoom?: number | null
  category: string
  link?: string | null | undefined
  prefersReducedMotion?: boolean
}

/**
 * NewsVideoBackground Component
 *
 * Renders a video background (YouTube or MP4) with news content overlay.
 * Maintains consistent visual style with other carousel slides.
 */
export function NewsVideoBackground({
  title,
  description,
  videoUrl,
  videoSource = 'youtube',
  videoMimeType,
  youtubeZoom,
  category,
  link,
  prefersReducedMotion = false,
}: NewsVideoBackgroundProps) {
  const zoom = youtubeZoom ?? 1.15
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoReady, setIsVideoReady] = useState(false)

  useEffect(() => {
    if (videoSource !== 'youtube') return

    // Reveal only once the player is actually playing (playerState === 1).
    // YouTube's iframe sends postMessage events when enablejsapi=1 is in the URL.
    // The 4 s fallback covers networks or browsers where the message never fires.
    const fallback = setTimeout(() => setIsVideoReady(true), 4000)

    const handleMessage = (event: MessageEvent) => {
      try {
        const data =
          typeof event.data === 'string' ? JSON.parse(event.data) : event.data
        if (data?.event === 'infoDelivery' && data?.info?.playerState === 1) {
          setIsVideoReady(true)
          clearTimeout(fallback)
        }
      } catch {
        // ignore non-JSON messages from other origins
      }
    }

    window.addEventListener('message', handleMessage)
    return () => {
      clearTimeout(fallback)
      window.removeEventListener('message', handleMessage)
    }
  }, [videoSource])

  const handleVideoReady = () => {
    setIsVideoReady(true)
  }

  // Build YouTube embed URL or use direct URL
  const embedUrl =
    videoSource === 'youtube' ? getYouTubeEmbedUrl(videoUrl) : videoUrl

  if (!embedUrl) {
    console.error('Invalid video URL:', videoUrl)
    return null
  }

  return (
    <>
      {/* Background Video */}
      <div className="absolute inset-0">
        {videoSource === 'youtube' ? (
          // YouTube Embed — hidden until postMessage signals playerState === 1 (actually playing)
          <div className="relative h-full w-full">
            <iframe
              src={embedUrl}
              className={cn(
                'absolute left-1/2 top-1/2 h-[56.25vw] min-h-screen w-[177.77vh] min-w-full object-cover transition-opacity duration-1000',
                isVideoReady ? 'opacity-100' : 'opacity-0'
              )}
              // pointerEvents: none → YouTube's document never receives mouse events, so
              // its hover-triggered transport controls (center pause, skip buttons) never appear.
              // translate + scale combined in one declaration to prevent Tailwind transform conflict.
              style={{ transform: `translate(-50%, -50%) scale(${zoom})`, pointerEvents: 'none' }}
              allow="autoplay; encrypted-media"
              frameBorder="0"
              title={`${title} - Background video`}
            />
          </div>
        ) : (
          // Direct MP4 Video
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={handleVideoReady}
            className={cn(
              'h-full w-full object-cover transition-opacity duration-1000',
              isVideoReady ? 'opacity-100' : 'opacity-0'
            )}
          >
            <source src={embedUrl} type={videoMimeType ?? 'video/webm'} />
          </video>
        )}
      </div>

      {/* Background-motion pause control (WCAG 2.2.2) */}
      <BackgroundMotionToggle className="bottom-6 right-6 lg:bottom-8 lg:right-8" />

      {/* Gradient Overlays for Better Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-kawai-black/80 via-kawai-black/40 to-kawai-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-kawai-black/60 via-transparent to-transparent" />

      {/* Category Badge - Top Right */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute top-8 right-8 sm:top-12 sm:right-12 lg:top-16 lg:right-16 z-20"
      >
        <span className="inline-block px-6 py-3 text-xs font-bold tracking-[0.25em] uppercase bg-kawai-red/90 backdrop-blur-sm text-white rounded-full shadow-xl border border-white/10">
          {category}
        </span>
      </motion.div>

      {/* Video Indicator - Top Right below category */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="absolute top-20 right-8 sm:top-24 sm:right-12 lg:top-28 lg:right-16 z-20"
      >
        <div className="flex items-center space-x-2 text-white/80">
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
          <span className="text-xs uppercase tracking-wider">Video</span>
        </div>
      </motion.div>

      {/* Content Overlay - Bottom Left with Glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12 lg:bottom-16 lg:left-16 right-8 sm:right-12 lg:right-1/3 z-20"
      >
        {/* Glassmorphism Container */}
        <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 sm:p-10 lg:p-12 shadow-2xl">
          <div className="space-y-6">
            {/* Small Label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <span className="text-xs text-kawai-pearl tracking-[0.2em] uppercase font-medium">
                Latest News • Video
              </span>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light font-serif text-white leading-tight"
            >
              {title}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl"
            >
              {description}
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="pt-4"
            >
              <Link
                href={link || '#'}
                className="inline-flex items-center space-x-3 bg-white hover:bg-kawai-red text-kawai-black hover:text-white px-8 py-4 rounded-full font-medium text-sm tracking-wide uppercase transition-all duration-300 shadow-lg hover:shadow-2xl group"
              >
                <span>Read Full Story</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
