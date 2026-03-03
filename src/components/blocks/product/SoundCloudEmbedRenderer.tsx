import React from 'react'

// -------------------------------------------------------------------
// Types
// -------------------------------------------------------------------

interface PlayerOptions {
  visual?: boolean | null
  autoPlay?: boolean | null
  showComments?: boolean | null
  showRelated?: boolean | null
}

interface SoundCloudEmbedBlockData {
  soundcloudUrl?: string | null
  heading?: string | null
  playerOptions?: PlayerOptions | null
  theme?: 'light' | 'dark' | null
}

interface SoundCloudEmbedRendererProps extends SoundCloudEmbedBlockData {
  /** Injected by BlockRenderer */
  product?: unknown
}

// -------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------

/**
 * Strip UTM and tracking params from a SoundCloud URL and return the clean base URL.
 */
function cleanSoundCloudUrl(raw: string): string {
  try {
    const url = new URL(raw)
    // Keep only the origin + pathname
    return `${url.origin}${url.pathname}`
  } catch {
    return raw
  }
}

/**
 * Build the SoundCloud widget iframe src from a public SoundCloud URL.
 * Docs: https://developers.soundcloud.com/docs/api/html5-widget
 */
function buildWidgetUrl(soundcloudUrl: string, options: PlayerOptions): string {
  const clean = cleanSoundCloudUrl(soundcloudUrl)
  const encoded = encodeURIComponent(clean)

  const params = new URLSearchParams({
    url: encoded,
    color: 'e21922',           // Kawai red accent
    auto_play: String(options.autoPlay ?? false),
    hide_related: String(!(options.showRelated ?? false)),
    show_comments: String(options.showComments ?? false),
    show_user: 'true',
    show_reposts: 'false',
    show_teaser: 'false',
    visual: String(options.visual ?? false),
  })

  return `https://w.soundcloud.com/player/?${params.toString()}`
}

/**
 * Detect whether the URL is a playlist/set or a single track.
 * Sets get a taller iframe; tracks get the compact bar.
 */
function isPlaylist(url: string): boolean {
  return url.includes('/sets/')
}

// -------------------------------------------------------------------
// Renderer
// -------------------------------------------------------------------

export async function SoundCloudEmbedRenderer({
  soundcloudUrl,
  heading,
  playerOptions,
  theme = 'light',
}: SoundCloudEmbedRendererProps) {
  // Block is intentionally hidden when no URL is configured
  if (!soundcloudUrl || soundcloudUrl.trim() === '') return null

  const options: PlayerOptions = {
    visual: playerOptions?.visual ?? false,
    autoPlay: playerOptions?.autoPlay ?? false,
    showComments: playerOptions?.showComments ?? false,
    showRelated: playerOptions?.showRelated ?? false,
  }

  const widgetSrc = buildWidgetUrl(soundcloudUrl, options)
  const playlist = isPlaylist(soundcloudUrl)

  // Height: visual playlist = 450, classic playlist = 450, visual track = 400, classic track = 166
  const iframeHeight = playlist ? 450 : options.visual ? 400 : 166

  const isDark = theme === 'dark'
  const sectionBg = isDark ? 'bg-kawai-black' : 'bg-[#f5f3f0]'
  const headingColor = isDark ? 'text-white' : 'text-kawai-black'
  const dividerColor = isDark ? 'bg-white/15' : 'bg-kawai-neutral'

  return (
    <section className={`py-12 md:py-16 ${sectionBg}`}>
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Optional heading */}
        {heading && (
          <div className="mb-6">
            <p className="text-[11px] tracking-[0.3em] uppercase text-kawai-red mb-2 font-medium">
              Audio
            </p>
            <h2
              className={`text-2xl md:text-3xl font-[family-name:var(--font-brand-luxury)] ${headingColor}`}
            >
              {heading}
            </h2>
            <div className={`mt-4 w-12 h-px ${dividerColor}`} />
          </div>
        )}

        {/* SoundCloud widget */}
        <div
          className="rounded-sm overflow-hidden"
          style={{ height: `${iframeHeight}px` }}
        >
          <iframe
            src={widgetSrc}
            width="100%"
            height={iframeHeight}
            allow="autoplay"
            title={heading ?? 'SoundCloud Audio Player'}
            className="border-0 w-full h-full"
            loading="lazy"
          />
        </div>

        {/* Subtle SoundCloud attribution */}
        <p className={`mt-3 text-[10px] tracking-wider uppercase ${isDark ? 'text-white/30' : 'text-kawai-charcoal/40'}`}>
          Listen on SoundCloud
        </p>
      </div>
    </section>
  )
}
