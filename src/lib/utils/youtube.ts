/**
 * YouTube Embed Utilities
 *
 * Shared utilities for handling YouTube video embeds across the application.
 * Provides consistent URL parsing and optimized embed parameter configuration.
 */

/**
 * Extract YouTube video ID from various URL formats
 *
 * Supports:
 * - https://youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 * - https://www.youtube-nocookie.com/embed/VIDEO_ID
 * - a bare 11-character VIDEO_ID
 *
 * This is the union of every local copy that used to live beside a call site.
 * `/shorts/` and bare IDs are here because the regex copies handled them and
 * the original URL-based implementation did not — dropping either would have
 * silently blanked whichever CMS records use those forms.
 *
 * @param url - YouTube video URL in any supported format
 * @returns Video ID or null if URL is invalid or not recognized
 */
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/

export function extractYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null

  const trimmed = url.trim()
  if (!trimmed) return null

  // Editors paste bare IDs into the URL fields often enough to accept them.
  if (YOUTUBE_ID.test(trimmed)) return trimmed

  try {
    const urlObj = new URL(trimmed)
    const host = urlObj.hostname.replace(/^www\./, '')

    // youtu.be/VIDEO_ID
    if (host === 'youtu.be') {
      const id = urlObj.pathname.slice(1).split('/')[0]
      return id && YOUTUBE_ID.test(id) ? id : null
    }

    if (host !== 'youtube.com' && host !== 'youtube-nocookie.com' && host !== 'm.youtube.com') {
      return null
    }

    // youtube.com/watch?v=VIDEO_ID
    const v = urlObj.searchParams.get('v')
    if (v && YOUTUBE_ID.test(v)) return v

    // /embed/ID, /shorts/ID, /v/ID, /live/ID
    const segments = urlObj.pathname.split('/').filter(Boolean)
    if (segments.length >= 2 && ['embed', 'shorts', 'v', 'live'].includes(segments[0]!)) {
      const id = segments[1]!
      return YOUTUBE_ID.test(id) ? id : null
    }

    return null
  } catch {
    return null
  }
}

/**
 * Build optimized YouTube embed URL with minimal UI
 *
 * Applies parameters to maximize control and minimize YouTube branding:
 * - autoplay=1: Auto-play video on load
 * - mute=1: Muted by default (required for autoplay in most browsers)
 * - loop=1: Loop the video continuously
 * - playlist=${id}: Required for loop to work on single videos
 * - controls=0: Hide player controls
 * - rel=0: Show only same-channel videos in suggestions (can't fully disable)
 * - playsinline=1: Enable inline playback on iOS (prevent fullscreen)
 * - disablekb=1: Disable keyboard shortcuts
 * - fs=0: Hide fullscreen button
 * - iv_load_policy=3: Hide video annotations
 * - cc_load_policy=0: Don't show captions by default
 * - color=white: White progress bar (subtle on dark backgrounds)
 *
 * Note: YouTube no longer allows hiding video title/channel name completely.
 * These will always appear before playback, during pause, and after video ends.
 *
 * @param videoId - YouTube video ID
 * @returns Optimized embed URL with all parameters applied
 */
export function buildYouTubeEmbedUrl(videoId: string): string {
  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    loop: '1',
    playlist: videoId, // Required for loop to work on a single video
    controls: '0',
    rel: '0',
    playsinline: '1',
    disablekb: '1',
    fs: '0',
    iv_load_policy: '3',
    cc_load_policy: '0',
    // enablejsapi: allows this window to receive postMessage state-change events
    // from the iframe so we can reveal the video only once it's actually playing
    // (playerState === 1), not on the earlier iframe-document onLoad event.
    enablejsapi: '1',
  })

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
}

/**
 * Parse YouTube URL and return optimized embed URL
 *
 * Convenience function that combines extractYouTubeId and buildYouTubeEmbedUrl.
 *
 * @param url - YouTube video URL in any supported format
 * @returns Optimized embed URL or null if URL is invalid
 */
export function getYouTubeEmbedUrl(url: string | null | undefined): string | null {
  const videoId = extractYouTubeId(url)
  if (!videoId) return null
  return buildYouTubeEmbedUrl(videoId)
}
