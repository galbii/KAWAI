'use client'

/**
 * Decorative background YouTube player with no YouTube chrome.
 *
 * YouTube's own params can no longer hide its UI: `modestbranding` was
 * deprecated 2023-08-15 ("will have no effect"), `showinfo` was deprecated
 * 2018-08-23, and `rel=0` stopped disabling related videos in 2018 — it now
 * only restricts them to the same channel. What actually suppresses each
 * piece of chrome is a mix of one live param and three client-side behaviours:
 *
 *  - bottom control bar + YouTube logo → `controls=0` (still supported)
 *  - top title / channel / share bar   → `pointer-events-none`, so the player
 *                                        never sees a mouseover to fade it in
 *  - play button + title before start  → the frame is held at opacity-0 until
 *                                        the player reports PLAYING, with the
 *                                        poster painting underneath
 *  - "More videos" end-screen grid     → seekTo(0) + playVideo on ENDED, rather
 *                                        than trusting `loop=1` to get there
 *  - spacebar pause (title returns)    → `disablekb=1`
 *
 * Because the frame only reveals on PLAYING, an autoplay block (iOS Low Power
 * Mode, data saver) or an embed-restricted video degrades to a still poster
 * instead of YouTube's branded error/play screen.
 *
 * This is decorative media only. It is aria-hidden and out of the tab order;
 * anything the viewer is meant to read or click belongs in the caller's markup
 * layered above it. Pair it with <BackgroundMotionToggle /> for WCAG 2.2.2 —
 * that control finds this iframe by its `autoplay=1` src and drives it over the
 * same postMessage channel `enablejsapi=1` opens here.
 */

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { extractYouTubeId } from '@/lib/utils/youtube'

// A YouTube player accepts exactly one `listening` handshake; a second one is
// answered with `alreadyInitialized` and the player then stays silent. React
// StrictMode double-invokes effects in dev, so track which player windows have
// already been greeted. Messages are posted to the whole parent window, so a
// later listener still receives them even though an earlier effect registered.
const greetedPlayers = new WeakSet<Window>()

const BG_PARAMS = [
  'autoplay=1',
  'mute=1',
  'loop=1',
  'controls=0',
  'playsinline=1',
  'disablekb=1',
  'fs=0',
  'iv_load_policy=3',
  'cc_load_policy=0',
  'rel=0',
  'enablejsapi=1',
].join('&')

export interface BackgroundYouTubeProps {
  /** Any YouTube URL form, or null — renders poster-only when it can't be parsed. */
  url: string | null | undefined
  /** CMS still, preferred over YouTube's generated thumbnail. */
  poster?: string | null | undefined
  /** iframe title attribute. Not announced (the frame is aria-hidden) but required markup. */
  title: string
  /** Applied to the positioned wrapper, not the frame. */
  className?: string | undefined
  /** Set on above-the-fold banners so the poster isn't lazy-loaded. */
  priority?: boolean | undefined
  /** next/image sizes for the poster. */
  sizes?: string | undefined
}

export function BackgroundYouTube({
  url,
  poster,
  title,
  className,
  priority = false,
  sizes = '100vw',
}: BackgroundYouTubeProps) {
  const prefersReducedMotion = useReducedMotion()
  const videoId = extractYouTubeId(url)

  // maxresdefault 404s for anything never published at 1080p — fall back to
  // hqdefault, which YouTube always generates.
  const [posterFailed, setPosterFailed] = useState(false)
  const ytPoster = videoId
    ? `https://img.youtube.com/vi/${videoId}/${posterFailed ? 'hqdefault' : 'maxresdefault'}.jpg`
    : null
  const posterUrl = poster ?? ytPoster

  // Defer the frame a beat so rapidly switching collections doesn't spawn and
  // destroy a player per keystroke.
  const [showVideo, setShowVideo] = useState(false)
  const [frameLoaded, setFrameLoaded] = useState(false)
  const [playing, setPlaying] = useState(false)
  const frameRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (!videoId || prefersReducedMotion) return
    const t = setTimeout(() => setShowVideo(true), 180)
    return () => clearTimeout(t)
  }, [videoId, prefersReducedMotion])

  useEffect(() => {
    if (!frameLoaded || !videoId) return
    const frame = frameRef.current
    const player = frame?.contentWindow
    if (!frame || !player) return

    const send = (func: string, args: unknown[] = []) =>
      player.postMessage(JSON.stringify({ event: 'command', func, args }), '*')

    let heard = false
    let errored = false

    const onMessage = (event: MessageEvent) => {
      if (event.source !== player) return
      let data: { event?: unknown; info?: { playerState?: unknown } }
      try {
        data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
        heard = true
      } catch {
        return
      }

      // Unavailable / embedding-disabled / age-gated: keep the still rather
      // than let the give-up timer reveal YouTube's error card.
      if (data?.event === 'onError') {
        errored = true
        setPlaying(false)
        return
      }

      const state = data?.info?.playerState
      if (typeof state !== 'number') return
      if (state === 1) setPlaying(true)
      if (state === 0) {
        send('seekTo', [0, true])
        send('playVideo')
      }
    }
    window.addEventListener('message', onMessage)

    if (!greetedPlayers.has(player)) {
      greetedPlayers.add(player)
      player.postMessage(
        JSON.stringify({ event: 'listening', id: frame.id, channel: 'widget' }),
        '*',
      )
    }

    // If the channel never opens at all we'd sit on the poster forever, so
    // reveal on a timer — but never over a player we know has errored.
    const giveUp = window.setTimeout(() => {
      if (!heard && !errored) setPlaying(true)
    }, 6000)

    return () => {
      window.removeEventListener('message', onMessage)
      window.clearTimeout(giveUp)
    }
  }, [frameLoaded, videoId])

  return (
    // container-type: size turns cqw/cqh below into this box's dimensions, so the
    // cover math works in a 55%-wide 4:3 pane as well as a full-bleed stage.
    <div
      className={cn('absolute inset-0 overflow-hidden', className)}
      style={{ containerType: 'size' }}
    >
      {posterUrl && (
        <Image
          src={posterUrl}
          alt=""
          aria-hidden="true"
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setPosterFailed(true)}
          className="object-cover"
        />
      )}

      {showVideo && videoId && (
        <iframe
          ref={frameRef}
          id={`bg-yt-${videoId}`}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?${BG_PARAMS}&playlist=${videoId}`}
          title={title}
          tabIndex={-1}
          aria-hidden="true"
          allow="autoplay; encrypted-media"
          onLoad={() => setFrameLoaded(true)}
          // Sized to cover the box at 16:9 and centred, so YouTube never
          // letterboxes and any chrome it paints falls outside the clip.
          style={{
            width: 'max(100cqw, calc(100cqh * 16 / 9))',
            height: 'max(100cqh, calc(100cqw * 9 / 16))',
          }}
          className={cn(
            'pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2',
            '-translate-y-1/2 border-0 transition-opacity duration-700',
            playing ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}
    </div>
  )
}

export default BackgroundYouTube
