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
 *
 * @param url - YouTube video URL in any supported format
 * @returns Video ID or null if URL is invalid or not recognized
 */
export function extractYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null

  try {
    const urlObj = new URL(url)

    // youtube.com/watch?v=VIDEO_ID
    if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.has('v')) {
      return urlObj.searchParams.get('v')
    }

    // youtu.be/VIDEO_ID
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1) // Remove leading slash
    }

    // youtube.com/embed/VIDEO_ID
    if (urlObj.pathname.includes('/embed/')) {
      return urlObj.pathname.split('/embed/')[1]?.split('?')[0] || null
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
    playlist: videoId, // Required for loop
    controls: '0',
    rel: '0',
    playsinline: '1',
    disablekb: '1',
    fs: '0',
    iv_load_policy: '3',
    cc_load_policy: '0',
    color: 'white',
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
