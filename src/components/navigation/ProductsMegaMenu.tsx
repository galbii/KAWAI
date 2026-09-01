'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryStates, parseAsString } from 'nuqs'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Bluetooth, BookOpen, ChevronDown, ChevronUp, Music2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProductTypeNav, NavProduct, NavCollection, NavAccessory } from '@/lib/payload/products-navigation'
import { getProductsByCollection } from '@/lib/actions/collection-products'

// ─── Constants ────────────────────────────────────────────────────────────────

const SIDEBAR_CATEGORIES = [
  { label: 'Digital',       key: 'digital',       href: '/pianos/digital',       terms: ['digital'] },
  { label: 'Hybrid',        key: 'hybrid',         href: '/pianos/hybrid',        terms: ['hybrid'] },
  { label: 'Upright',       key: 'upright',        href: '/pianos/upright',       terms: ['upright'] },
  { label: 'Grand',         key: 'grand',          href: '/pianos/grand',         terms: ['grand', 'baby grand', 'baby-grand', 'gl series'] },
  {
    label: 'Shigeru Kawai',
    key: 'shigeru-kawai',
    href: '/shigeru',
    terms: [],
    bannerOnly: true as const,
    comingSoon: true as const,
  },
  {
    label: 'Accessories',
    key: 'accessories',
    href: '/accessories',
    terms: [],
    bannerOnly: true as const,
    accessoriesPanel: true as const,
  },
  {
    label: 'Apps & Software',
    key: 'apps-software',
    href: '/apps-software',
    terms: [],
    bannerOnly: true as const,
    appsPanel: true as const,
  },
] as const

const NAV_SESSION_KEY = 'kawai-nav-state'

const BANNER_SIZE_HEIGHT: Record<string, string> = {
  xxs:        'h-[150px]',
  xs:         'h-[250px]',
  small:      'h-[400px]',
  medium:     'h-[600px]',
  large:      'h-[800px]',
  fullscreen: 'h-screen',
}

type SidebarKey = (typeof SIDEBAR_CATEGORIES)[number]['key']

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductsMegaMenuProps {
  productTypes: ProductTypeNav[]
  collections: NavCollection[]
  allCollections?: NavCollection[]
  accessories?: NavAccessory[]
  isOpen: boolean
  onClose: () => void
  className?: string
  isLoading?: boolean
  isHeaderScrolled?: boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractYouTubeId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)
  return m?.[1] ?? null
}

function getProductsForSidebarKey(productTypes: ProductTypeNav[], terms: readonly string[]): NavProduct[] {
  return productTypes
    .filter((t) => terms.some((term) => t.type.toLowerCase().includes(term.toLowerCase())))
    .flatMap((t) => t.products)
}

function getSidebarKeyForCollection(collection: NavCollection): SidebarKey | null {
  const titleLower = collection.title.toLowerCase()
  const handleLower = collection.handle.toLowerCase()
  for (const cat of SIDEBAR_CATEGORIES) {
    if (cat.terms.some((term) => titleLower.includes(term) || handleLower.includes(term))) {
      return cat.key
    }
  }
  return null
}

function getCollectionsForSidebarKey(collections: NavCollection[], key: SidebarKey): NavCollection[] {
  return collections.filter((col) => {
    if (col.pianoCategories && col.pianoCategories.length > 0) return col.pianoCategories.includes(key)
    return getSidebarKeyForCollection(col) === key
  })
}

// ─── Shared UI atoms ──────────────────────────────────────────────────────────

const SCROLL_CLASS = 'flex gap-7 overflow-x-auto pb-3 scroll-smooth snap-x snap-mandatory [scrollbar-width:thin] [scrollbar-color:#C8C2BA_#EDE9E3] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-[#EDE9E3] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#C8C2BA] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-[#A01829]'
const NAV_BTN_CLASS = 'absolute top-[42%] -translate-y-1/2 w-10 h-10 rounded-full bg-[#FAF9F7] border border-[#E0DCD6] shadow-md flex items-center justify-center text-[#8A8078] hover:border-[#A01829] hover:text-[#A01829] transition-colors z-10'

function NavArrow({ dir, onClick, offset = '-left-5' }: { dir: 'left' | 'right'; onClick: () => void; offset?: string }) {
  return (
    <motion.button
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClick}
      aria-label={dir === 'left' ? 'Scroll left' : 'Scroll right'}
      className={cn(NAV_BTN_CLASS, dir === 'left' ? offset : offset.replace('left', 'right'))}
    >
      {dir === 'left' ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
    </motion.button>
  )
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-8 px-10 py-0 border-b border-[#E8E4DF]">
        {[36, 52, 44, 60, 40, 96, 76].map((w, i) => (
          <div key={i} className="py-4">
            <div style={{ width: w }} className="h-2.5 bg-[#EDE9E3] rounded-full animate-pulse" />
          </div>
        ))}
      </div>
      <div className="px-12 py-8">
        <div className="h-8 w-52 bg-[#EDE9E3] rounded animate-pulse mb-7" />
        <div className="grid grid-cols-3 gap-7">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[4/3] bg-[#EDE9E3] rounded-2xl animate-pulse" />
              <div className="h-3 w-20 bg-[#EDE9E3] rounded animate-pulse" />
              <div className="h-5 w-44 bg-[#EDE9E3] rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Collection Carousel Card ─────────────────────────────────────────────────

function CollectionCarouselCard({
  collection,
  onClose,
  onCategorySelect,
  index = 0,
}: {
  collection: NavCollection
  onClose: () => void
  onCategorySelect: (key: SidebarKey) => void
  index?: number
}) {
  const videoId = collection.youtubeUrl ? extractYouTubeId(collection.youtubeUrl) : null
  const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null
  const imageUrl = collection.mediaUrl ?? thumbnail ?? collection.imageUrl ?? null
  const hasMedia = Boolean(imageUrl || videoId)
  const displayTitle = collection.heading || collection.title
  const collectionHref = `/pianos/${collection.handle}`

  return (
    <div className="group relative w-full">
      <Link href={collectionHref} onClick={onClose} className="relative w-full text-left block" aria-label={`Browse ${displayTitle}`}>
        <div className="relative w-full overflow-hidden rounded-2xl bg-[#EAE6E0] aspect-video">
          {imageUrl && (
            <Image src={imageUrl} alt={displayTitle} fill sizes="(max-width: 1280px) 33vw, 500px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          )}
          {!hasMedia && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs tracking-widest uppercase text-[#B8AFA6]">{displayTitle}</span>
            </div>
          )}
          {hasMedia && <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none rounded-2xl" />}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-white/70 mb-2" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
              {collection.productCount > 0 ? `${collection.productCount} Models` : 'Collection'}
            </p>
            <h3 className="text-xl font-bold text-white font-serif leading-tight" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.5)' }}>{displayTitle}</h3>
            {collection.subheading && <p className="text-sm text-white/80 mt-1.5 line-clamp-1" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>{collection.subheading}</p>}
          </div>
          <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#A01829] transition-all duration-200 pointer-events-none" />
        </div>
      </Link>

      <Link
        href={collectionHref}
        onClick={onClose}
        className="mt-4 flex items-center justify-center w-full py-2.5 bg-[#1E1B16] text-white text-sm font-semibold tracking-[0.07em] uppercase rounded-lg hover:bg-[#2C2C2C] transition-colors duration-200"
        aria-label={`View all ${displayTitle} models`}
      >
        Explore Collection
      </Link>
    </div>
  )
}

// ─── Collection Carousel (default view) ───────────────────────────────────────

function CollectionCarousel({ collections, onClose, onCategorySelect }: {
  collections: NavCollection[]
  onClose: () => void
  onCategorySelect: (key: SidebarKey) => void
}) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#2C2C2C] font-serif leading-none">Featured Collections</h2>
      </div>

      {collections.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-[#B8AFA6]">Select a piano family to explore.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-8">
            {collections.length === 1 ? (
              <div className="col-start-2">
                <CollectionCarouselCard collection={collections[0]!} onClose={onClose} onCategorySelect={onCategorySelect} index={0} />
              </div>
            ) : (
              collections.map((col, i) => (
                <CollectionCarouselCard key={col.id} collection={col} onClose={onClose} onCategorySelect={onCategorySelect} index={i} />
              ))
            )}
          </div>

        </>
      )}
    </div>
  )
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product, onClose }: { product: NavProduct; onClose: () => void }) {
  return (
    <Link href={`/products/${product.handle}`} onClick={onClose} className="block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white mb-4">
        {product.image ? (
          <Image src={product.image.url} alt={product.image.alt} fill sizes="(max-width: 1280px) 22vw, 280px" className="object-contain p-2" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs uppercase tracking-widest text-[#C8C2BA]">No image</span>
          </div>
        )}
      </div>
      <h3 className="text-[15px] font-semibold text-[#2C2C2C] leading-snug line-clamp-2 font-serif px-0.5">
        {product.model ?? product.title}
      </h3>
    </Link>
  )
}

// ─── Collection Stage ─────────────────────────────────────────────────────────
// Full-bleed cinematic frame shown when a collection pill is active. The video
// takes the whole panel; a drawer-pull tab seated on its bottom edge reveals the
// models below. The tab is painted in the panel's bone tone so it reads as the
// drawer underneath peeking up through the video.

const STAGE_EASE = [0.22, 0.61, 0.36, 1] as const
const SCROLLER_ATTR = 'data-mega-scroller'

// A YouTube player accepts exactly one `listening` handshake; a second one is
// answered with `alreadyInitialized` and the player then stays silent. React
// StrictMode double-invokes effects in dev, so track which player windows have
// already been greeted. Messages are posted to the whole parent window, so a
// later listener still receives them even though an earlier effect registered.
const greetedPlayers = new WeakSet<Window>()

// scrollIntoView walks every scrollable ancestor and fights scroll-snap, so move
// the panel's own scroller by the exact delta instead. Mandatory snap re-targets
// a programmatic smooth scroll and strands it part-way, so lift snapping for the
// duration of the move and hand control back once it settles.
function scrollPanelTo(target: Element | null | undefined, smooth: boolean) {
  if (!target) return
  const scroller = target.closest<HTMLElement>(`[${SCROLLER_ATTR}]`)
  if (!scroller) return
  const top = scroller.scrollTop + (target.getBoundingClientRect().top - scroller.getBoundingClientRect().top)

  const previousSnap = scroller.style.scrollSnapType
  scroller.style.scrollSnapType = 'none'
  scroller.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' })

  if (!smooth) {
    scroller.style.scrollSnapType = previousSnap
    return
  }
  // `scrollend` can fire before the smooth scroll gets going, and restoring
  // mandatory snap part-way drags the panel straight back to where it started.
  // Wait until we've actually arrived instead.
  const deadline = 1200
  const startedAt = performance.now()
  const settle = () => {
    const arrived = Math.abs(scroller.scrollTop - top) < 2
    if (arrived || performance.now() - startedAt > deadline) {
      scroller.style.scrollSnapType = previousSnap
      return
    }
    requestAnimationFrame(settle)
  }
  requestAnimationFrame(settle)
}

function modelsLabel(count: number): string {
  if (count === 1) return 'Scroll to see 1 model'
  if (count > 1) return `Scroll to see ${count} models`
  return 'Scroll to see the models'
}

function CollectionStage({ collection, onClose, onReveal, tabHidden }: {
  collection: NavCollection
  onClose: () => void
  onReveal: () => void
  tabHidden: boolean
}) {
  const prefersReducedMotion = useReducedMotion()
  const videoId = collection.youtubeUrl ? extractYouTubeId(collection.youtubeUrl) : null

  // maxresdefault 404s for videos never published at 1080p — fall back to hqdefault,
  // which YouTube always generates.
  const [posterFailed, setPosterFailed] = useState(false)
  const ytPoster = videoId
    ? `https://img.youtube.com/vi/${videoId}/${posterFailed ? 'hqdefault' : 'maxresdefault'}.jpg`
    : null
  const posterUrl = collection.mediaUrl ?? collection.imageUrl ?? ytPoster

  // Defer the iframe so clicking through pills doesn't spawn and destroy players.
  const [showVideo, setShowVideo] = useState(false)
  const [frameLoaded, setFrameLoaded] = useState(false)
  const [playing, setPlaying] = useState(false)
  const frameRef = useRef<HTMLIFrameElement>(null)
  useEffect(() => {
    if (!videoId || prefersReducedMotion) return
    const t = setTimeout(() => setShowVideo(true), 180)
    return () => clearTimeout(t)
  }, [videoId, prefersReducedMotion])

  // The player's state channel does two jobs: hold the poster until real frames
  // are painting (an iframe `load` fires long before that, so the viewer would
  // otherwise watch YouTube's black-and-spinner), and restart the film the
  // instant it ends so the "More videos" grid never appears inside the nav.
  useEffect(() => {
    if (!frameLoaded || !videoId) return
    const frame = frameRef.current
    const player = frame?.contentWindow
    if (!frame || !player) return

    const send = (func: string, args: unknown[] = []) =>
      player.postMessage(JSON.stringify({ event: 'command', func, args }), '*')

    let heard = false
    const onMessage = (event: MessageEvent) => {
      if (event.source !== player) return
      let state: unknown
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
        heard = true
        state = data?.info?.playerState
      } catch {
        return
      }
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
      player.postMessage(JSON.stringify({ event: 'listening', id: frame.id, channel: 'widget' }), '*')
    }

    // If the channel never opens we keep the still rather than reveal a black
    // player mid-buffer — but don't hold a working video hostage to silence.
    const giveUp = window.setTimeout(() => { if (!heard) setPlaying(true) }, 6000)

    return () => {
      window.removeEventListener('message', onMessage)
      window.clearTimeout(giveUp)
    }
  }, [frameLoaded, videoId])

  const displayTitle = collection.heading || collection.title
  const collectionHref = `/pianos/${collection.handle}`

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: STAGE_EASE }}
      aria-label={`${displayTitle} collection`}
      className="relative h-full w-full flex-none snap-start overflow-hidden bg-[#0B0A09]"
    >
      {/* Poster paints instantly; the player crossfades over it once ready. */}
      {posterUrl && (
        <Image
          src={posterUrl}
          alt=""
          fill
          sizes="95vw"
          priority
          onError={() => setPosterFailed(true)}
          className="object-cover"
        />
      )}

      {showVideo && videoId && (
        <iframe
          ref={frameRef}
          id={`nav-film-${videoId}`}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&iv_load_policy=3&enablejsapi=1`}
          title={`${displayTitle} film`}
          tabIndex={-1}
          aria-hidden="true"
          allow="autoplay; encrypted-media"
          onLoad={() => setFrameLoaded(true)}
          className={cn(
            'pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700',
            playing ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}

      {/* Scrim — dense enough under the title block to hold 4.5:1, clearing fast so
          the footage itself still reads. One gradient, not two: the title sits in
          the bottom band, so a second left-hand wash only muddied the image. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

      {/* Identity block */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-10 px-14 pb-24">
        <div className="min-w-0">
          {collection.productCount > 0 && (
            <p
              className="mb-3 text-[11px] font-bold uppercase tracking-[0.32em] text-white/65"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
            >
              {collection.productCount} Models
            </p>
          )}
          <h3
            className="font-serif text-5xl font-bold leading-[1.05] text-white"
            style={{ textShadow: '0 2px 24px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.6)' }}
          >
            {displayTitle}
          </h3>
          {collection.subheading && (
            <p
              className="mt-3 max-w-xl text-[17px] leading-relaxed text-white/80 line-clamp-2"
              style={{ textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}
            >
              {collection.subheading}
            </p>
          )}
        </div>

        <Link
          href={collectionHref}
          onClick={onClose}
          className="group flex flex-shrink-0 items-center gap-3 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-[15px] font-semibold tracking-wide text-white backdrop-blur-sm transition-colors duration-200 hover:border-[#A01829] hover:bg-[#A01829] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          View Collection
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Drawer pull — same bone as the panel chrome, so it reads as the models
          drawer showing through the film. Fades out once they're in view. */}
      <motion.button
        type="button"
        onClick={onReveal}
        animate={{ opacity: tabHidden ? 0 : 1, y: tabHidden ? 12 : 0 }}
        transition={{ duration: 0.28, ease: STAGE_EASE }}
        className={cn(
          'group/pull absolute bottom-0 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 rounded-t-xl bg-[#FAF9F7] px-6 pb-3.5 pt-3 text-[13px] font-semibold tracking-[0.01em] text-[#1E1B16] shadow-[0_-6px_24px_rgba(0,0,0,0.4)] transition-colors duration-150 hover:text-[#A01829] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#A01829]',
          tabHidden && 'pointer-events-none'
        )}
      >
        <motion.span
          aria-hidden="true"
          className="flex"
          {...(prefersReducedMotion
            ? {}
            : {
                animate: { y: [0, 3, 0] },
                transition: { duration: 1.1, repeat: 2, repeatDelay: 0.6, ease: 'easeInOut' as const },
              })}
        >
          <ChevronDown className="h-4 w-4 text-[#A01829]" />
        </motion.span>
        {modelsLabel(collection.productCount)}
      </motion.button>
    </motion.section>
  )
}

// ─── Collection Video Banner ───────────────────────────────────────────────────
// Cinematic strip shown at the bottom of CategoryView when a collection tab is active.

function CollectionVideoBanner({ collection, onClose, heightClass = 'h-44', externalCtaUrl, comingSoon }: { collection: NavCollection; onClose: () => void; heightClass?: string; externalCtaUrl?: string; comingSoon?: boolean }) {
  const videoId = collection.youtubeUrl ? extractYouTubeId(collection.youtubeUrl) : null
  const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
  const imageUrl = thumbnail ?? collection.imageUrl ?? collection.mediaUrl ?? null
  const displayTitle = collection.heading || collection.title
  const collectionHref = externalCtaUrl ?? `/pianos/${collection.handle}`
  const isExternal = Boolean(externalCtaUrl)

  return (
    <motion.div
      key={collection.handle}
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className={cn('mt-5 relative rounded-2xl overflow-hidden bg-[#111]', heightClass)}
    >
      {imageUrl && (
        <Image src={imageUrl} alt={displayTitle} fill sizes="100vw" className="object-cover" />
      )}
      {!imageUrl && !videoId && <div className="absolute inset-0 bg-gradient-to-br from-[#2C2C2C] to-[#1A1A1A]" />}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10 pointer-events-none" />
      {comingSoon && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-2xl font-serif font-semibold tracking-wide text-white/60">Coming Soon</span>
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-between px-8">
        <div className="text-white min-w-0 mr-8">
          {collection.productCount > 0 && (
            <p className="text-xs font-bold tracking-[0.22em] uppercase text-white/50 mb-1.5">{collection.productCount} Models</p>
          )}
          <h3 className="text-2xl font-bold font-serif leading-tight truncate">{displayTitle}</h3>
          {collection.subheading && <p className="text-[15px] text-white/60 mt-1 line-clamp-1">{collection.subheading}</p>}
        </div>
        {!comingSoon && (isExternal ? (
          <a
            href={collectionHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="group flex items-center gap-2.5 px-6 py-3 bg-white/10 hover:bg-[#A01829] border border-white/25 hover:border-[#A01829] rounded-full text-[15px] font-medium text-white transition-all duration-200 flex-shrink-0"
          >
            View Collection
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
        ) : (
          <Link
            href={collectionHref}
            onClick={onClose}
            className="group flex items-center gap-2.5 px-6 py-3 bg-white/10 hover:bg-[#A01829] border border-white/25 hover:border-[#A01829] rounded-full text-[15px] font-medium text-white transition-all duration-200 flex-shrink-0"
          >
            View Collection
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Collection Pill Rail ─────────────────────────────────────────────────────
// Fixed strip of collection pills directly under the tab bar. Lives outside the
// scroll area so it stays put while the stage and model rail scroll beneath it.

function CollectionPillRail({ collections, activeHandle, onSelect, onClose, categoryHref, categoryLabel }: {
  collections: NavCollection[]
  activeHandle: string
  onSelect: (handle: string) => void
  onClose: () => void
  categoryHref: string
  categoryLabel: string | null
}) {
  if (collections.length === 0) return null

  const ctaHref = categoryHref
  const ctaLabel = categoryLabel ? `Browse All ${categoryLabel}` : 'Browse All Products'

  return (
    <div className="flex-shrink-0 border-b border-[#E8E4DF] bg-[#FAF9F7] px-12 py-3.5">
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-bold tracking-[0.28em] uppercase text-[#C8C2BA] whitespace-nowrap flex-shrink-0">
          Collections
        </span>
        <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-0.5 flex-1">
          {collections.map((col) => {
            const label = col.heading || col.title
            const isActive = activeHandle === col.handle
            return (
              <button
                key={col.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => onSelect(isActive ? 'all' : col.handle)}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01829] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F7]',
                  isActive ? 'bg-[#A01829] text-white' : 'bg-[#F2EFE9] text-[#8A8078] hover:bg-[#EDE9E3] hover:text-[#2C2C2C]'
                )}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* CTA — bottom-right */}
        <Link
          href={ctaHref}
          onClick={onClose}
          className="group flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#E11922] hover:bg-[#C41019] rounded-full text-sm font-semibold text-white transition-colors duration-150 whitespace-nowrap ml-auto"
        >
          {ctaLabel}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}

// ─── Category View ─────────────────────────────────────────────────────────────
// With a collection pill active, the stage fills the panel and the model rail sits
// one scroll below it. On "All", the rail is the whole view.

function CategoryView({ collections, allTabProducts, categoryHref, label, onClose, onBack, activeCollectionHandle, stageCollection }: {
  collections: NavCollection[]
  allTabProducts: NavProduct[]
  categoryHref: string
  label: string
  onClose: () => void
  onBack: () => void
  activeCollectionHandle: string
  stageCollection: NavCollection | null
}) {
  const [fetchedProducts, setFetchedProducts] = useState<NavProduct[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const productsRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const productsInView = useInView(productsRef, { amount: 0.2 })

  useEffect(() => {
    if (activeCollectionHandle === 'all') { setFetchedProducts([]); return }
    let cancelled = false
    setIsLoadingProducts(true)
    getProductsByCollection(activeCollectionHandle)
      .then((products) => { if (!cancelled) setFetchedProducts(products) })
      .catch(() => { if (!cancelled) setFetchedProducts([]) })
      .finally(() => { if (!cancelled) setIsLoadingProducts(false) })
    return () => { cancelled = true }
  }, [activeCollectionHandle])

  const displayProducts = activeCollectionHandle === 'all' ? allTabProducts : fetchedProducts

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    const ro = new ResizeObserver(updateScrollState)
    ro.observe(el)
    return () => { el.removeEventListener('scroll', updateScrollState); ro.disconnect() }
  }, [updateScrollState, displayProducts])

  const scrollBy = useCallback((dir: 1 | -1) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * ((el.offsetWidth - 56) / 3 + 28), behavior: 'smooth' })
  }, [])

  const revealProducts = useCallback(() => {
    scrollPanelTo(productsRef.current, !prefersReducedMotion)
  }, [prefersReducedMotion])

  // The stage is the drawer's previous sibling — both are direct children of the
  // scroller, so scrolling it back into view snaps the film into place.
  const returnToStage = useCallback(() => {
    scrollPanelTo(productsRef.current?.previousElementSibling, !prefersReducedMotion)
  }, [prefersReducedMotion])

  // The rail deals itself in once the drawer lands — left to right, the order you read.
  const railVariants = { hidden: {}, shown: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } } }
  const cardVariants = prefersReducedMotion
    ? { hidden: { opacity: 0 }, shown: { opacity: 1, transition: { duration: 0.2 } } }
    : {
        hidden: { opacity: 0, y: 28, scale: 0.97 },
        shown: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: STAGE_EASE } },
      }
  // Without a stage there's nothing to reveal — the rail is already the view.
  const railShown = stageCollection ? productsInView : true

  return (
    <>
      <AnimatePresence mode="wait">
        {stageCollection && (
          <CollectionStage
            key={stageCollection.handle}
            collection={stageCollection}
            onClose={onClose}
            onReveal={revealProducts}
            tabHidden={productsInView}
          />
        )}
      </AnimatePresence>

      <div
        ref={productsRef}
        className={cn(
          'relative bg-white px-14 py-10',
          // A full-panel drawer, so its snap point is actually reachable and the
          // rail sits centred rather than pinned under the film.
          stageCollection && 'flex min-h-full snap-start flex-col justify-center pt-24'
        )}
      >
        {stageCollection && (
          <>
            {/* The pull, mirrored: a dark tab dropping out of the film above.
                Fades in as the drawer lands, exactly as the down-tab fades out. */}
            <motion.button
              type="button"
              onClick={returnToStage}
              animate={{ opacity: productsInView ? 1 : 0, y: productsInView ? 0 : -12 }}
              transition={{ duration: 0.28, ease: STAGE_EASE }}
              className={cn(
                'absolute left-1/2 top-0 z-20 flex -translate-x-1/2 items-center gap-2.5 rounded-b-xl bg-[#1E1B16] px-6 pb-3 pt-3.5 text-[13px] font-semibold tracking-[0.01em] text-white shadow-[0_6px_24px_rgba(0,0,0,0.28)] transition-colors duration-150 hover:bg-[#A01829] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white',
                !productsInView && 'pointer-events-none'
              )}
            >
              <ChevronUp className="h-4 w-4" aria-hidden="true" />
              Back to the top
            </motion.button>

            {/* Leaving the collection entirely, not just scrolling back up. */}
            <button
              type="button"
              onClick={onBack}
              className="absolute left-14 top-8 inline-flex items-center gap-1.5 rounded-full text-[13px] font-medium text-[#8A8078] transition-colors duration-150 hover:text-[#A01829] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A01829] focus-visible:ring-offset-4 focus-visible:ring-offset-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              All collections
            </button>
          </>
        )}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeCollectionHandle}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          >
            {isLoadingProducts ? (
              <div className="flex gap-7">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="min-w-[calc((100%-56px)/3)] flex-shrink-0 space-y-3">
                    <div className="aspect-[4/3] bg-[#EDE9E3] rounded-2xl animate-pulse" />
                    <div className="h-3.5 w-28 bg-[#EDE9E3] rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : displayProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-sm text-[#B8AFA6] mb-4">No products found.</p>
                <Link href={categoryHref} onClick={onClose} className="text-sm font-medium text-[#A01829] hover:underline">
                  Browse all {label} pianos →
                </Link>
              </div>
            ) : (
              <div className="relative">
                <AnimatePresence>
                  {canScrollLeft && <NavArrow dir="left" onClick={() => scrollBy(-1)} />}
                </AnimatePresence>
                <motion.div
                  ref={scrollRef}
                  className={SCROLL_CLASS}
                  variants={railVariants}
                  initial="hidden"
                  animate={railShown ? 'shown' : 'hidden'}
                >
                  {displayProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      variants={cardVariants}
                      className="min-w-[calc((100%-56px)/3)] snap-start flex-shrink-0"
                    >
                      <ProductCard product={product} onClose={onClose} />
                    </motion.div>
                  ))}
                </motion.div>
                <AnimatePresence>
                  {canScrollRight && <NavArrow dir="right" onClick={() => scrollBy(1)} offset="-right-5" />}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}

// ─── Banner-Only View ─────────────────────────────────────────────────────────
// Shown for categories like Shigeru Kawai that render only a collection banner.

function BannerOnlyView({ label, href, externalCtaUrl, collectionHandle, collections, onClose, comingSoon }: {
  label: string
  href: string
  externalCtaUrl?: string
  collectionHandle: string
  collections: NavCollection[]
  onClose: () => void
  comingSoon?: boolean
}) {
  const router = useRouter()
  const collection = collections.find((c) => c.handle === collectionHandle)
  const heightClass = collection?.bannerSize ? (BANNER_SIZE_HEIGHT[collection.bannerSize] ?? 'h-[250px]') : 'h-[250px]'
  const ctaHref = externalCtaUrl ?? href
  const isExternal = Boolean(externalCtaUrl)

  /* ── Shigeru Kawai branded panel (comingSoon = true) ── */
  if (comingSoon) {
    const videoId = collection?.youtubeUrl ? extractYouTubeId(collection.youtubeUrl) : null
    const imgUrl = videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : collection?.imageUrl ?? collection?.mediaUrl ?? null

    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="rounded-2xl overflow-hidden bg-[#0a0a0a] relative cursor-pointer"
        style={{ minHeight: '320px' }}
        onClick={(e) => {
          if (!(e.target as Element).closest('a')) {
            onClose()
            router.push(ctaHref)
          }
        }}
      >
        {/* Full-bleed background image */}
        {imgUrl && (
          <Image src={imgUrl} alt={label} fill sizes="100vw" className="object-cover" />
        )}

        {/* Gradient so text stays legible */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

        {/* Content overlaid on image */}
        <div className="relative px-8 pt-7 pb-8 flex flex-col gap-5 h-full justify-end" style={{ minHeight: '320px' }}>
          {/* Eyebrow */}
          <p
            className="text-kawai-gold text-[10px] tracking-[0.5em] uppercase"
            style={{ fontFamily: 'var(--font-oswald)' }}
          >
            Grand Piano Collection
          </p>

          {/* Title + rule */}
          <div>
            <h2
              className="text-white font-extrabold uppercase leading-none"
              style={{
                fontFamily: 'var(--font-oswald)',
                fontSize: 'clamp(1.6rem, 2.5vw, 2rem)',
                letterSpacing: '0.04em',
              }}
            >
              Shigeru Kawai
            </h2>
            <span className="block mt-3 h-px w-10 bg-kawai-gold opacity-40" />
          </div>

          {/* Descriptor */}
          <p
            className="text-white/45 text-sm leading-relaxed max-w-[22ch]"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Six handcrafted grand pianos, built at the Ryuyo factory in Hamamatsu, Japan.
          </p>

          {/* CTA */}
          <Link
            href={ctaHref}
            onClick={onClose}
            className="self-start inline-flex items-center gap-3 border-2 border-kawai-gold/50 hover:border-kawai-gold text-kawai-gold hover:bg-kawai-gold/[0.08] px-7 py-3 transition-all duration-300"
            style={{ fontFamily: 'var(--font-oswald)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}
          >
            Explore Collection
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-3xl font-bold text-[#2C2C2C] font-serif leading-none">{label}</h2>
        {isExternal ? (
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="group flex items-center gap-2 text-sm font-medium text-[#A01829]"
          >
            View Collection
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
        ) : (
          <Link href={ctaHref} onClick={onClose} className="group flex items-center gap-2 text-sm font-medium text-[#A01829]">
            View Collection
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>

      {/* Banner */}
      {collection ? (
        <CollectionVideoBanner collection={collection} onClose={onClose} heightClass={heightClass} {...(externalCtaUrl !== undefined && { externalCtaUrl })} />
      ) : (
        <div className="flex items-center justify-center py-16">
          <Link href={href} onClick={onClose} className="text-sm font-medium text-[#A01829] hover:underline">
            Explore {label} →
          </Link>
        </div>
      )}
    </div>
  )
}

// ─── Accessories Panel ────────────────────────────────────────────────────────
// Shown when "Accessories" is selected in the sidebar.
// Intentionally mirrors BannerOnlyView header + CategoryView card row.

function AccessoriesBannerView({ onClose, accessories }: { onClose: () => void; accessories: NavAccessory[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#2C2C2C] font-serif leading-none">Accessories</h2>
      </div>

      {accessories.length > 0 ? (
        <div className="flex gap-7 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {accessories.map((acc) => (
            <div key={acc.id} className="min-w-[calc((100%-56px)/3)] flex-shrink-0">
              <Link href={`/products/${acc.slug ?? acc.model}`} onClick={onClose} className="block group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white mb-4">
                  {acc.imageUrl ? (
                    <Image
                      src={acc.imageUrl}
                      alt={acc.name ?? acc.model}
                      fill
                      sizes="(max-width: 1280px) 22vw, 280px"
                      className="object-contain p-2"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs uppercase tracking-widest text-[#C8C2BA]">No image</span>
                    </div>
                  )}
                </div>
                <h3 className="text-[15px] font-semibold text-[#2C2C2C] leading-snug line-clamp-2 font-serif px-0.5">
                  {acc.model}
                </h3>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-[#B8AFA6] mb-4">No accessories found.</p>
        </div>
      )}

      <div className="flex justify-center mt-6">
        <Link
          href="/accessories"
          onClick={onClose}
          className="group inline-flex items-center gap-2 px-6 py-2.5 bg-[#1E1B16] hover:bg-[#2C2C2C] rounded-full text-sm font-semibold text-white transition-colors duration-150 whitespace-nowrap"
        >
          View All Accessories
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.div>
  )
}

// ─── Apps & Software Panel ────────────────────────────────────────────────────
// Shown when "Apps & Software" is selected in the sidebar.

function AppsSoftwarePanelView({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center justify-center text-center py-16 px-8"
    >
      {/* Ornamental rule */}
      <div className="flex items-center gap-3 mb-8 w-full max-w-[260px]">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#D5C78C]" />
        <div className="w-1 h-1 rounded-full bg-[#D5C78C]" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#D5C78C]" />
      </div>

      <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#B8AFA6] mb-3">
        Apps &amp; Software
      </p>

      <h2 className="text-4xl font-serif text-[#1E1B16] leading-[1.1] mb-4">
        Coming Soon
      </h2>

      {/* App icons */}
      <div className="flex items-center gap-8 mb-6">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-[#F0EDE7] flex items-center justify-center">
            <Bluetooth className="h-5 w-5 text-[#8A8078]" />
          </div>
          <span className="text-[10px] font-medium tracking-wide text-[#B8AFA6]">Piano Remote</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-[#F0EDE7] flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-[#8A8078]" />
          </div>
          <span className="text-[10px] font-medium tracking-wide text-[#B8AFA6]">PiaBookPlayer</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-[#F0EDE7] flex items-center justify-center">
            <Music2 className="h-5 w-5 text-[#8A8078]" />
          </div>
          <span className="text-[10px] font-medium tracking-wide text-[#B8AFA6]">Aures Music</span>
        </div>
      </div>

      <p className="text-sm text-[#8A8078] leading-relaxed max-w-[220px] mb-5">
        Companion apps and software to elevate your playing experience.
      </p>

      <div className="flex items-center gap-2 mb-8">
        <span className="relative flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A01829] opacity-60" />
          <span className="relative inline-flex h-4 w-4 rounded-full bg-[#A01829]" />
        </span>
        <span className="text-[11px] font-medium tracking-wide text-[#B8AFA6]">More details coming soon</span>
      </div>

      <Link
        href="/pianos"
        onClick={onClose}
        className={cn(
          'group inline-flex items-center gap-2.5 px-6 py-2.5',
          'border border-[#2C2C2C] rounded-full',
          'text-xs font-semibold tracking-[0.12em] uppercase text-[#2C2C2C]',
          'hover:bg-[#2C2C2C] hover:text-white transition-all duration-200'
        )}
      >
        Explore Pianos
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>

      {/* Ornamental rule */}
      <div className="flex items-center gap-3 mt-8 w-full max-w-[260px]">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#D5C78C]" />
        <div className="w-1 h-1 rounded-full bg-[#D5C78C]" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#D5C78C]" />
      </div>
    </motion.div>
  )
}

// ─── Top Tab Bar ──────────────────────────────────────────────────────────────

function TopTabBar({ selectedKey, onSelect, onClose, productTypes }: {
  selectedKey: SidebarKey | null
  onSelect: (key: SidebarKey | null) => void
  onClose: () => void
  productTypes: ProductTypeNav[]
}) {
  const availableCategories = SIDEBAR_CATEGORIES.filter(
    (cat) => 'bannerOnly' in cat || getProductsForSidebarKey(productTypes, cat.terms).length > 0
  )

  const tabs: { label: string; key: SidebarKey | null }[] = [
    { label: 'All', key: null },
    ...availableCategories.map((cat) => ({ label: cat.label, key: cat.key as SidebarKey })),
  ]

  return (
    <div className="flex items-stretch gap-0 px-12 bg-[#FAF9F7] border-b border-[#E8E4DF]">
      {tabs.map((tab) => {
        const isActive = selectedKey === tab.key
        const isAccessories = tab.key === 'accessories'
        return (
          <div key={tab.key ?? 'all'} className={cn('flex items-stretch', isAccessories && 'ml-5 pl-5 border-l border-[#E8E4DF]')}>
            <button
              onClick={() => onSelect(tab.key)}
              className={cn(
                'relative flex items-center px-5 py-5 text-[15px] whitespace-nowrap transition-colors duration-150 outline-none',
                isActive ? 'text-[#1E1B16] font-semibold' : 'text-[#9A9189] font-medium hover:text-[#2C2C2C]'
              )}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="mega-menu-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#A01829] rounded-t-full"
                  transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                />
              )}
            </button>
          </div>
        )
      })}

    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ProductsMegaMenu({
  productTypes,
  collections,
  allCollections,
  accessories = [],
  isOpen,
  onClose,
  className,
  isLoading = false,
  isHeaderScrolled = false,
}: ProductsMegaMenuProps) {
  const [menuState, setMenuState] = useQueryStates(
    {
      nav_cat: parseAsString.withDefault(''),
      nav_col: parseAsString.withDefault('all'),
    },
    { history: 'replace', shallow: true, clearOnDefault: true },
  )

  // Derive typed selectedKey — fall back to null if URL value isn't a valid category
  const selectedKey = (
    SIDEBAR_CATEGORIES.some((c) => c.key === menuState.nav_cat) ? menuState.nav_cat : null
  ) as SidebarKey | null

  const activeCollectionHandle = menuState.nav_col

  function setSelectedKey(key: SidebarKey | null) {
    if (key === null) {
      // Explicit "All" — clear persistence so reopening the menu doesn't re-restore
      try { sessionStorage.removeItem(NAV_SESSION_KEY) } catch { /* ignore */ }
    }
    setMenuState({ nav_cat: key ?? '', nav_col: 'all' })
  }

  function setActiveCollectionHandle(handle: string) {
    setMenuState({ nav_col: handle })
  }

  // Persist selected category + collection for the session so navigating to another page
  // and reopening the menu restores the last selection (nuqs resets on URL change).
  useEffect(() => {
    if (!menuState.nav_cat) return
    try {
      sessionStorage.setItem(
        NAV_SESSION_KEY,
        JSON.stringify({ nav_cat: menuState.nav_cat, nav_col: menuState.nav_col }),
      )
    } catch { /* sessionStorage unavailable */ }
  }, [menuState.nav_cat, menuState.nav_col])

  // Tracks whether we've already attempted a restore for this menu open — prevents
  // the effect from re-running after setMenuState updates nav_cat mid-session.
  const hasRestoredRef = useRef(false)

  useEffect(() => {
    if (!isOpen) {
      hasRestoredRef.current = false // reset on close so next open can restore again
      return
    }
    if (hasRestoredRef.current || menuState.nav_cat) return
    try {
      const saved = sessionStorage.getItem(NAV_SESSION_KEY)
      if (!saved) return
      const parsed = JSON.parse(saved) as { nav_cat?: string; nav_col?: string }
      if (parsed.nav_cat && SIDEBAR_CATEGORIES.some((c) => c.key === parsed.nav_cat)) {
        hasRestoredRef.current = true
        void setMenuState({ nav_cat: parsed.nav_cat, nav_col: parsed.nav_col ?? 'all' })
      }
    } catch { /* ignore */ }
  }, [isOpen, menuState.nav_cat, setMenuState])

  const selectedProducts = useMemo(() => {
    if (!selectedKey) return []
    const cat = SIDEBAR_CATEGORIES.find((c) => c.key === selectedKey)
    if (!cat) return []
    const products = getProductsForSidebarKey(productTypes, cat.terms)
    // Build a set of handles for this category's featured collections (featured: true)
    // so we can float products that belong to them to the top.
    const pool = allCollections ?? collections
    const featuredHandles = new Set(
      getCollectionsForSidebarKey(pool, selectedKey)
        .filter((c) => c.featured)
        .map((c) => c.handle)
    )
    return [...products].sort((a, b) => {
      // Product-flagged featured leads (mirrors the nav action ordering)
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1
      // Then products belonging to a featured collection
      const aInFeatured = a.collectionIds.some((h) => featuredHandles.has(h))
      const bInFeatured = b.collectionIds.some((h) => featuredHandles.has(h))
      if (aInFeatured !== bInFeatured) return aInFeatured ? -1 : 1
      return 0
    })
  }, [selectedKey, productTypes, collections, allCollections])

  const selectedCollections = useMemo(() => {
    if (!selectedKey) return []
    const pool = allCollections ?? collections
    return getCollectionsForSidebarKey(pool, selectedKey)
  }, [selectedKey, collections, allCollections])

  // Footer: all collections on "All" tab, category-filtered on a category tab.
  // Featured collections (cross-referenced from the featured-only `collections` prop) sort first.
  const footerCollections = useMemo(() => {
    const pool = allCollections ?? collections
    const featuredIds = new Set(collections.map((c) => c.id))
    const base = !selectedKey ? [...pool] : getCollectionsForSidebarKey(pool, selectedKey)
    return base.sort((a, b) => {
      const aFeatured = featuredIds.has(a.id) || a.featured
      const bFeatured = featuredIds.has(b.id) || b.featured
      if (aFeatured !== bFeatured) return aFeatured ? -1 : 1
      return (b.collectionPriority ?? 0) - (a.collectionPriority ?? 0)
    })
  }, [selectedKey, collections, allCollections])

  const selectedCat = SIDEBAR_CATEGORIES.find((c) => c.key === selectedKey)

  // When on "All" tab with a specific collection selected, look up the collection
  // so we can render the same CategoryView experience as category-specific tabs.
  const allViewActiveCollection = useMemo(() => {
    if (selectedKey !== null || activeCollectionHandle === 'all') return null
    const pool = allCollections ?? collections
    return pool.find((c) => c.handle === activeCollectionHandle) ?? null
  }, [selectedKey, activeCollectionHandle, allCollections, collections])

  // The collection whose film fills the panel. Needs media to be worth a stage —
  // without it we'd show a black void, so fall through to the plain model rail.
  const stageCollection = useMemo(() => {
    if (activeCollectionHandle === 'all') return null
    if (selectedCat && 'bannerOnly' in selectedCat) return null
    const col =
      selectedKey === null
        ? allViewActiveCollection
        : (selectedCollections.find((c) => c.handle === activeCollectionHandle) ?? null)
    if (!col) return null
    return col.youtubeUrl || col.mediaUrl || col.imageUrl ? col : null
  }, [activeCollectionHandle, selectedCat, selectedKey, allViewActiveCollection, selectedCollections])

  const stageActive = stageCollection !== null

  // Every pill press opens on the film, never mid-drawer.
  const scrollerRef = useRef<HTMLDivElement>(null)
  const stageHandle = stageCollection?.handle ?? null
  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: 0 })
  }, [stageHandle])

  // Matches --header-bottom: 64px utility bar + 48px compact nav or 56px full nav.
  const topOffset = isHeaderScrolled
    ? 'calc(112px + var(--announcement-bar-height, 0px) + var(--admin-bar-height, 0px))'
    : 'calc(120px + var(--announcement-bar-height, 0px) + var(--admin-bar-height, 0px))'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="products-mega-menu"
          initial={{ opacity: 0, scaleY: 0.97, y: -8 }}
          animate={{ opacity: 1, scaleY: 1, y: 0, top: topOffset }}
          exit={{ opacity: 0, scaleY: 0.97, y: -8 }}
          transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformOrigin: 'top center', left: '50%', x: '-50%' }}
          className={cn('fixed z-[60] w-[95vw] max-w-[1440px] bg-[#FAF9F7] shadow-[0_8px_24px_-4px_rgba(0,0,0,0.12),0_32px_80px_-8px_rgba(0,0,0,0.28)] overflow-hidden rounded-2xl', className)}
        >
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#A01829]/30 to-transparent" />

          {/* Fixed height, always: the panel resizing per tab reads as a jolt, and a
              stage needs a definite height for its `h-full` to resolve against. */}
          <div className="flex h-[75vh] flex-col">
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <>
                <TopTabBar selectedKey={selectedKey} onSelect={setSelectedKey} onClose={onClose} productTypes={productTypes} />

                <CollectionPillRail
                  collections={footerCollections}
                  activeHandle={activeCollectionHandle}
                  onSelect={setActiveCollectionHandle}
                  onClose={onClose}
                  categoryHref={selectedCat?.href ?? '/pianos'}
                  categoryLabel={selectedCat ? selectedCat.label : null}
                />

                <div
                  ref={scrollerRef}
                  data-mega-scroller=""
                  className={cn(
                    'min-w-0 flex-1 overflow-y-auto bg-white',
                    // Inserting a full-panel stage above existing content makes the
                    // browser anchor-scroll away from it; opt out and reset instead.
                    stageActive && 'snap-y snap-mandatory [overflow-anchor:none]'
                  )}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {selectedKey === null && allViewActiveCollection ? (
                      <motion.div
                        key={`all-collection-${activeCollectionHandle}`}
                        className={cn(stageActive && 'h-full')}
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <CategoryView
                          collections={allCollections ?? collections}
                          allTabProducts={[]}
                          categoryHref={`/pianos/${activeCollectionHandle}`}
                          label={allViewActiveCollection.heading || allViewActiveCollection.title}
                          onClose={onClose}
                          onBack={() => setActiveCollectionHandle('all')}
                          activeCollectionHandle={activeCollectionHandle}
                          stageCollection={stageCollection}
                        />
                      </motion.div>
                    ) : selectedKey === null ? (
                      <motion.div
                        key="carousel" className="px-14 py-10"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <CollectionCarousel collections={collections} onClose={onClose} onCategorySelect={setSelectedKey} />
                      </motion.div>
                    ) : selectedCat && 'appsPanel' in selectedCat ? (
                      <motion.div
                        key="apps-panel" className="px-14 py-10"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <AppsSoftwarePanelView onClose={onClose} />
                      </motion.div>
                    ) : selectedCat && 'accessoriesPanel' in selectedCat ? (
                      <motion.div
                        key="accessories-panel" className="px-14 py-10"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <AccessoriesBannerView onClose={onClose} accessories={accessories} />
                      </motion.div>
                    ) : selectedCat && 'bannerOnly' in selectedCat ? (
                      <motion.div
                        key={`banner-${selectedKey}`} className="px-14 py-10"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <BannerOnlyView
                          label={selectedCat.label}
                          href={selectedCat.href}
                          {...('externalCtaUrl' in selectedCat && typeof selectedCat.externalCtaUrl === 'string' && { externalCtaUrl: selectedCat.externalCtaUrl })}
                          {...('comingSoon' in selectedCat && { comingSoon: selectedCat.comingSoon })}
                          collectionHandle={selectedCat.key}
                          collections={allCollections ?? collections}
                          onClose={onClose}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key={`category-${selectedKey}`}
                        className={cn(stageActive && 'h-full')}
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                      >
                        {selectedCat && (
                          <CategoryView
                            collections={selectedCollections}
                            allTabProducts={selectedProducts}
                            categoryHref={selectedCat.href}
                            label={selectedCat.label}
                            onClose={onClose}
                            onBack={() => setActiveCollectionHandle('all')}
                            activeCollectionHandle={activeCollectionHandle}
                            stageCollection={stageCollection}
                          />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E8E4DF] to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
