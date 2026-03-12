"use client"

import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import type { MarketingArtistCarouselBlock, Artist, Media } from '@/payload-types'
import { cn } from '@/lib/utils'
import { getImagePropsWithFallback } from '@/lib/media/r2-utils'
import { trackCTAClick, trackBlockImpression } from '@/lib/analytics/unified-tracking'

interface ArtistCarouselRendererProps extends MarketingArtistCarouselBlock {}

// Type guard for Artist object
function isArtistObject(artist: Artist | string | null | undefined): artist is Artist {
  return typeof artist === 'object' && artist !== null && 'name' in artist
}

// Type guard for Media object
function isMediaObject(media: Media | string | null | undefined): media is Media {
  return typeof media === 'object' && media !== null && 'url' in media
}

// Social links icons (simple emoji mapping for social links section)
const socialIcons: Record<string, string> = {
  website: '🌐',
  instagram: '📷',
  youtube: '▶️',
  spotify: '🎵',
  'apple-music': '🍎',
  soundcloud: '☁️',
  facebook: '👥',
  twitter: '🐦',
  tiktok: '📱',
  linkedin: '💼',
  bandcamp: '🎸',
  other: '🔗',
}

// Social platform icons - SVG components for clean, scalable icons (for recent work)
const SocialIcon = ({ platform }: { platform: string }) => {
  const iconClass = "w-3.5 h-3.5 flex-shrink-0"

  switch (platform) {
    case 'instagram':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    case 'youtube':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    case 'tiktok':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      )
    case 'spotify':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      )
    case 'apple-music':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.997 6.124c0-.738-.065-1.47-.24-2.19-.317-1.31-1.062-2.31-2.18-3.043a5.62 5.62 0 0 0-1.877-.726c-.85-.192-1.715-.25-2.585-.25H6.888c-.87 0-1.735.058-2.585.25-.626.141-1.24.392-1.877.726-1.118.733-1.863 1.732-2.18 3.043-.175.72-.24 1.452-.24 2.19v11.53c0 .738.065 1.47.24 2.19.317 1.31 1.062 2.31 2.18 3.043.637.334 1.251.585 1.877.726.85.192 1.715.25 2.585.25h10.223c.87 0 1.735-.058 2.585-.25.626-.141 1.24-.392 1.877-.726 1.118-.733 1.863-1.732 2.18-3.043.175-.72.24-1.452.24-2.19V6.124zM9.28 19.584c-2.059 0-3.73-1.67-3.73-3.73 0-2.058 1.671-3.729 3.73-3.729.54 0 1.05.117 1.513.318v-5.69c0-.362.29-.652.652-.652h6.146c.362 0 .651.29.651.652v8.375c0 2.058-1.671 3.729-3.73 3.729s-3.729-1.67-3.729-3.729c0-.54.117-1.05.318-1.513H9.28c-1.398 0-2.533 1.135-2.533 2.533s1.135 2.533 2.533 2.533z"/>
        </svg>
      )
    case 'soundcloud':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c0-.057-.045-.1-.09-.1m-.899.828c-.051 0-.09.04-.099.092L0 14.479l.176 1.335c0 .055.045.094.099.094.051 0 .09-.04.099-.094l.207-1.335-.207-1.334c0-.057-.045-.092-.099-.092m1.8-1.958c-.06 0-.117.046-.117.098l-.329 4.105.329 3.974c0 .057.057.098.117.098.057 0 .117-.046.117-.098l.365-3.974-.365-4.105c0-.057-.06-.098-.117-.098m.899-.582c-.068 0-.113.058-.113.121l-.298 4.687.298 4.563c0 .063.045.117.113.117.063 0 .111-.054.111-.117l.334-4.563-.334-4.687c0-.063-.048-.121-.111-.121m.901-.207c-.073 0-.128.063-.128.134l-.277 4.894.277 4.748c0 .071.055.125.128.125.068 0 .124-.054.124-.125l.305-4.748-.305-4.894c0-.071-.056-.134-.124-.134m.964-.643c-.078 0-.139.062-.139.14l-.262 5.537.262 5.374c0 .078.061.139.139.139.076 0 .138-.061.138-.139l.291-5.374-.291-5.537c0-.078-.062-.14-.138-.14m1.034-.098c-.086 0-.155.068-.155.154l-.233 5.635.233 5.484c0 .086.069.154.155.154.084 0 .153-.068.153-.154l.258-5.484-.258-5.635c0-.086-.069-.154-.153-.154m.977.074c-.093 0-.168.074-.168.166l-.218 5.561.218 5.407c0 .092.075.168.168.168s.166-.076.166-.168l.241-5.407-.241-5.561c0-.092-.073-.166-.166-.166m1.022.139c-.101 0-.18.08-.18.176l-.196 5.422.196 5.33c0 .097.079.178.18.178.098 0 .176-.081.176-.178l.217-5.33-.217-5.422c0-.096-.078-.176-.176-.176m.969-.082c-.107 0-.191.086-.191.189l-.185 5.504.185 5.305c0 .103.084.189.191.189.103 0 .189-.086.189-.189l.205-5.305-.205-5.504c0-.103-.086-.189-.189-.189zm1.005.334c-.113 0-.204.092-.204.203l-.168 5.17.168 5.193c0 .111.091.203.204.203.111 0 .202-.092.202-.203l.185-5.193-.185-5.17c0-.111-.091-.203-.202-.203m.969-.281c-.119 0-.214.097-.214.213l-.159 5.451.159 5.158c0 .116.095.213.214.213.117 0 .212-.097.212-.213l.177-5.158-.177-5.451c0-.116-.095-.213-.212-.213m1.002.236c-.125 0-.223.101-.223.222l-.14 5.215.14 5.072c0 .121.098.221.223.221s.223-.1.223-.221l.155-5.072-.155-5.215c0-.121-.098-.222-.223-.222m.993-.294c-.131 0-.236.106-.236.234l-.13 5.509.13 5.018c0 .128.105.234.236.234s.234-.106.234-.234l.145-5.018-.145-5.509c0-.128-.103-.234-.234-.234m.976.313c-.137 0-.246.11-.246.244l-.121 5.196.121 4.961c0 .134.109.245.246.245s.245-.111.245-.245l.134-4.961-.134-5.196c0-.134-.108-.244-.245-.244m1.005.092c-.143 0-.257.115-.257.254l-.111 5.104.111 4.902c0 .139.114.252.257.252s.255-.113.255-.252l.124-4.902-.124-5.104c0-.139-.112-.254-.255-.254m.981.405c-.149 0-.268.12-.268.265l-.101 4.699.101 4.84c0 .145.119.264.268.264s.266-.119.266-.264l.112-4.84-.112-4.699c0-.145-.117-.265-.266-.265m.993.281c-.156 0-.28.125-.28.277l-.092 4.418.092 4.774c0 .152.124.276.28.276s.278-.124.278-.276l.102-4.774-.102-4.418c0-.152-.122-.277-.278-.277z"/>
        </svg>
      )
    case 'facebook':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    case 'twitter':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    case 'website':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
        </svg>
      )
    default:
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
        </svg>
      )
  }
}

// Color scheme configurations - Each scheme is carefully crafted to be distinctive and premium
const colorSchemes = {
  'kawai-red': {
    name: 'KAWAI Red',
    eyebrow: {
      bg: 'rgba(225, 25, 34, 0.05)',
      border: 'rgba(225, 25, 34, 0.2)',
      text: '#E11922',
      dotGlow: 'rgba(225, 25, 34, 0.6)',
    },
    heading: {
      gradientLight: 'linear-gradient(135deg, #2C2C2C 0%, #E11922 50%, #2C2C2C 100%)',
      gradientDark: 'linear-gradient(135deg, #FAF8F5 0%, #E11922 50%, #FAF8F5 100%)',
      glow: 'linear-gradient(135deg, #E11922 0%, #C41E3A 100%)',
    },
    background: {
      glowLight: '#E11922',
      glowDark: '#E11922',
    },
    decorative: {
      bar: 'linear-gradient(90deg, transparent 0%, #E11922 20%, #C41E3A 50%, #E11922 80%, transparent 100%)',
    },
  },
  'gold-luxury': {
    name: 'Gold Luxury',
    eyebrow: {
      bg: 'rgba(212, 175, 55, 0.08)',
      border: 'rgba(212, 175, 55, 0.25)',
      text: '#B8860B',
      dotGlow: 'rgba(212, 175, 55, 0.7)',
    },
    heading: {
      gradientLight: 'linear-gradient(135deg, #2C2C2C 0%, #D4AF37 40%, #B8860B 60%, #2C2C2C 100%)',
      gradientDark: 'linear-gradient(135deg, #FAF8F5 0%, #F4E4C1 40%, #D4AF37 60%, #FAF8F5 100%)',
      glow: 'linear-gradient(135deg, #D4AF37 0%, #F4E4C1 100%)',
    },
    background: {
      glowLight: '#D4AF37',
      glowDark: '#F4E4C1',
    },
    decorative: {
      bar: 'linear-gradient(90deg, transparent 0%, #D4AF37 20%, #F4E4C1 50%, #D4AF37 80%, transparent 100%)',
    },
  },
  'ocean-blue': {
    name: 'Ocean Blue',
    eyebrow: {
      bg: 'rgba(14, 116, 144, 0.06)',
      border: 'rgba(14, 116, 144, 0.22)',
      text: '#0E7490',
      dotGlow: 'rgba(6, 182, 212, 0.65)',
    },
    heading: {
      gradientLight: 'linear-gradient(135deg, #0C4A6E 0%, #0891B2 45%, #06B6D4 55%, #0C4A6E 100%)',
      gradientDark: 'linear-gradient(135deg, #E0F2FE 0%, #67E8F9 45%, #22D3EE 55%, #E0F2FE 100%)',
      glow: 'linear-gradient(135deg, #0891B2 0%, #06B6D4 100%)',
    },
    background: {
      glowLight: '#0891B2',
      glowDark: '#22D3EE',
    },
    decorative: {
      bar: 'linear-gradient(90deg, transparent 0%, #0891B2 20%, #06B6D4 50%, #0891B2 80%, transparent 100%)',
    },
  },
  'sunset-warmth': {
    name: 'Sunset Warmth',
    eyebrow: {
      bg: 'rgba(249, 115, 22, 0.07)',
      border: 'rgba(249, 115, 22, 0.23)',
      text: '#EA580C',
      dotGlow: 'rgba(251, 146, 60, 0.68)',
    },
    heading: {
      gradientLight: 'linear-gradient(135deg, #7C2D12 0%, #F97316 35%, #FB923C 50%, #FBBF24 65%, #7C2D12 100%)',
      gradientDark: 'linear-gradient(135deg, #FFF7ED 0%, #FED7AA 35%, #FDBA74 50%, #FDE047 65%, #FFF7ED 100%)',
      glow: 'linear-gradient(135deg, #F97316 0%, #FBBF24 100%)',
    },
    background: {
      glowLight: '#F97316',
      glowDark: '#FDBA74',
    },
    decorative: {
      bar: 'linear-gradient(90deg, transparent 0%, #F97316 15%, #FB923C 40%, #FBBF24 60%, #FB923C 85%, transparent 100%)',
    },
  },
  'sage-serenity': {
    name: 'Sage Serenity',
    eyebrow: {
      bg: 'rgba(132, 169, 140, 0.08)',
      border: 'rgba(132, 169, 140, 0.24)',
      text: '#6B8E75',
      dotGlow: 'rgba(156, 175, 136, 0.7)',
    },
    heading: {
      gradientLight: 'linear-gradient(135deg, #3A5A40 0%, #84A98C 45%, #9CAF88 55%, #3A5A40 100%)',
      gradientDark: 'linear-gradient(135deg, #F6F8F4 0%, #CAD2C5 45%, #9CAF88 55%, #F6F8F4 100%)',
      glow: 'linear-gradient(135deg, #84A98C 0%, #A3B18A 100%)',
    },
    background: {
      glowLight: '#84A98C',
      glowDark: '#A3B18A',
    },
    decorative: {
      bar: 'linear-gradient(90deg, transparent 0%, #84A98C 20%, #A3B18A 50%, #84A98C 80%, transparent 100%)',
    },
  },
  'cherry-blossom': {
    name: 'Cherry Blossom',
    eyebrow: {
      bg: 'rgba(236, 72, 153, 0.06)',
      border: 'rgba(236, 72, 153, 0.2)',
      text: '#DB2777',
      dotGlow: 'rgba(249, 168, 212, 0.65)',
    },
    heading: {
      gradientLight: 'linear-gradient(135deg, #831843 0%, #EC4899 40%, #F9A8D4 60%, #831843 100%)',
      gradientDark: 'linear-gradient(135deg, #FDF2F8 0%, #FBCFE8 40%, #F9A8D4 60%, #FDF2F8 100%)',
      glow: 'linear-gradient(135deg, #EC4899 0%, #F9A8D4 100%)',
    },
    background: {
      glowLight: '#EC4899',
      glowDark: '#F9A8D4',
    },
    decorative: {
      bar: 'linear-gradient(90deg, transparent 0%, #EC4899 20%, #F9A8D4 50%, #EC4899 80%, transparent 100%)',
    },
  },
} as const

export function ArtistCarouselRenderer({
  eyebrow,
  heading,
  subheading,
  artists,
  displayMode,
  showBio,
  showSocialLinks,
  showGenre,
  showInstrument,
  showRecentWork,
  maxRecentWorkItems,
  settings,
  styling,
  ctaButton,
  ctaTracking,
  impressionTracking,
}: ArtistCarouselRendererProps & { ctaTracking?: any; impressionTracking?: any }) {
  // Validate artists
  if (!artists || artists.length === 0) {
    return null
  }

  // Filter valid artist objects
  const validArtists = artists.filter(isArtistObject).filter((artist) => artist.isActive !== false)

  if (validArtists.length === 0) {
    return null
  }

  // Extract settings with defaults
  const autoPlay = settings?.autoPlay ?? false
  const autoPlayDuration = settings?.autoPlayDuration ?? 8000
  const enableLoop = settings?.enableLoop ?? true
  const showNavigationArrows = settings?.showNavigationArrows ?? true
  const showProgressIndicator = settings?.showProgressIndicator ?? true
  const enableKeyboardNav = settings?.enableKeyboardNav ?? true
  const enableTouchSwipe = settings?.enableTouchSwipe ?? true

  // Extract styling with defaults
  const theme = styling?.theme ?? 'light'
  const layout = styling?.layout ?? 'centered'
  const spacing = styling?.spacing ?? 'comfortable'
  const colorScheme = styling?.colorScheme ?? 'kawai-red'

  // Get the current color scheme configuration
  const colors = colorSchemes[colorScheme as keyof typeof colorSchemes] || colorSchemes['kawai-red']

  // State management
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Refs
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  // Constants
  const minSwipeDistance = 50

  // Theme class mapping
  const themeClasses = {
    light: 'bg-kawai-pearl text-kawai-charcoal',
    dark: 'bg-kawai-charcoal text-kawai-pearl',
    red: 'bg-gradient-to-br from-kawai-red/10 to-kawai-red/5 text-kawai-charcoal',
    transparent: 'bg-transparent text-kawai-charcoal',
  }

  // Spacing class mapping
  const spacingClasses = {
    compact: 'py-12 sm:py-16',
    comfortable: 'py-16 sm:py-24',
    spacious: 'py-24 sm:py-32 lg:py-40',
  }

  // Block impression tracking
  useEffect(() => {
    trackBlockImpression({
      blockType: 'marketing-artist-carousel',
      blockData: { impressionTracking: impressionTracking as any },
    })
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || !isInView || validArtists.length <= 1 || !autoPlay || isHovered) return

    const slideTimer = setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        enableLoop
          ? (prevIndex + 1) % validArtists.length
          : Math.min(prevIndex + 1, validArtists.length - 1)
      )
    }, autoPlayDuration)

    return () => clearTimeout(slideTimer)
  }, [isPlaying, currentIndex, isInView, validArtists.length, autoPlayDuration, autoPlay, enableLoop, isHovered])

  // Navigation functions
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      enableLoop
        ? prevIndex === 0
          ? validArtists.length - 1
          : prevIndex - 1
        : Math.max(prevIndex - 1, 0)
    )
    setIsPlaying(false)
  }, [validArtists.length, enableLoop])

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      enableLoop
        ? (prevIndex + 1) % validArtists.length
        : Math.min(prevIndex + 1, validArtists.length - 1)
    )
    setIsPlaying(false)
  }, [validArtists.length, enableLoop])

  // Touch event handlers
  const onTouchStart = (e: React.TouchEvent) => {
    if (!enableTouchSwipe) return
    setTouchEnd(null)
    if (e.targetTouches[0]) {
      setTouchStart(e.targetTouches[0].clientX)
    }
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (!enableTouchSwipe) return
    if (e.targetTouches[0]) {
      setTouchEnd(e.targetTouches[0].clientX)
    }
  }

  const onTouchEnd = () => {
    if (!enableTouchSwipe || !touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      goToNext()
    } else if (isRightSwipe) {
      goToPrevious()
    }
  }

  // Keyboard navigation
  useEffect(() => {
    if (!enableKeyboardNav) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enableKeyboardNav, goToPrevious, goToNext])

  // Get current artist
  const currentArtist = validArtists[currentIndex]
  if (!currentArtist) return null

  // Get artist image with fallback to imageUrl field
  const artistImage = isMediaObject(currentArtist.image)
    ? currentArtist.image
    : null

  // If no media object, try using the imageUrl field directly
  const imageSrc = artistImage?.url || currentArtist.imageUrl || '/images/defaults/artist-fallback.jpg'

  const imageProps = getImagePropsWithFallback(
    artistImage,
    imageSrc,
    displayMode === 'featured' ? 'hero' : 'card',
    {
      priority: currentIndex === 0,
      sizes: displayMode === 'featured'
        ? '(max-width: 768px) 100vw, 80vw'
        : '(max-width: 768px) 100vw, 50vw',
    }
  )

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative w-full overflow-hidden transition-colors duration-700',
        themeClasses[theme as keyof typeof themeClasses],
        spacingClasses[spacing as keyof typeof spacingClasses]
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section - Eye-Catching Design with Eyebrow */}
        {(eyebrow || heading || subheading) && (
          <div className="relative mb-16 sm:mb-20 lg:mb-24">
            {/* Dramatic Background Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 0.06, scale: 1 } : {}}
                transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute w-[600px] h-[400px] rounded-full blur-3xl"
                style={{
                  background: `radial-gradient(ellipse, ${theme === 'dark' ? colors.background.glowDark : colors.background.glowLight} 0%, transparent 70%)`
                }}
              />
            </div>

            <div className="relative max-w-5xl mx-auto text-center">
              {/* KAWAI Logo */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="mb-8 flex justify-center"
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                  className="relative"
                >
                  <Image
                    src="/images/Kawai (Red)(2).png"
                    alt="KAWAI"
                    width={120}
                    height={40}
                    className="h-8 sm:h-10 w-auto object-contain"
                    priority
                  />
                </motion.div>
              </motion.div>

              {/* Main Heading - Bold & Eye-Catching */}
              {heading && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-6"
                >
                  <h2
                    className="relative font-cormorant font-bold tracking-tight leading-[1.1]"
                    style={{
                      fontSize: 'clamp(2.5rem, 7vw, 5rem)',
                    }}
                  >
                    {/* Gradient text with dramatic effect */}
                    <span
                      className="relative z-10 inline-block"
                      style={{
                        background: theme === 'dark' ? colors.heading.gradientDark : colors.heading.gradientLight,
                        backgroundSize: '200% auto',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {heading}
                    </span>

                    {/* Dramatic glow effect */}
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 0.15 } : {}}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="absolute inset-0 blur-2xl -z-10"
                      style={{
                        background: colors.heading.glow,
                      }}
                      aria-hidden="true"
                    />
                  </h2>
                </motion.div>
              )}

              {/* Subheading with elegant typography */}
              {subheading && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p
                    className="max-w-3xl mx-auto text-current/70 leading-relaxed font-noto"
                    style={{
                      fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                      fontWeight: 400,
                      letterSpacing: '0.01em',
                    }}
                  >
                    {subheading}
                  </p>
                </motion.div>
              )}

              {/* Decorative Underline with Animation */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
                transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 mx-auto"
                style={{
                  width: 'min(200px, 30%)',
                  height: '3px',
                  background: colors.decorative.bar,
                  borderRadius: '2px',
                }}
              />
            </div>
          </div>
        )}

        {/* Carousel Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Carousel */}
          <div
            className={cn(
              'relative mx-auto',
              layout === 'centered' && 'max-w-3xl lg:max-w-4xl',
              layout === 'side-preview' && 'max-w-5xl lg:max-w-6xl',
              layout === 'full-width' && 'max-w-7xl'
            )}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Artist Cards */}
            <div className="relative">
              <AnimatePresence mode="wait" custom={currentIndex}>
                <motion.div
                  key={currentArtist.id}
                  custom={currentIndex}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative"
                >
                  {/* Genre Badge */}
                  {showGenre && currentArtist.genre && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="absolute -top-3 left-1/2 -translate-x-1/2 z-10"
                    >
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-kawai-red text-white text-xs font-medium tracking-wider uppercase rounded-full shadow-lg">
                        <span className="w-1.5 h-1.5 bg-white rounded-full" />
                        {currentArtist.genre}
                      </span>
                    </motion.div>
                  )}

                  {/* Artist Card */}
                  <div className="relative rounded-2xl overflow-hidden bg-white shadow-2xl">
                    {displayMode === 'minimal' ? (
                      // Minimal View
                      <div className="p-8 text-center">
                        <h3 className="text-2xl sm:text-3xl font-serif font-light mb-2">
                          {currentArtist.name}
                        </h3>
                        {currentArtist.genre && (
                          <p className="text-sm text-current/60 uppercase tracking-wider">
                            {currentArtist.genre}
                          </p>
                        )}
                      </div>
                    ) : (
                      // Card or Featured View
                      <div className={cn(
                        displayMode === 'featured'
                          ? 'grid lg:grid-cols-2 gap-0'
                          : 'flex flex-col'
                      )}>
                        {/* Artist Image */}
                        <div className={cn(
                          'relative overflow-hidden',
                          displayMode === 'featured'
                            ? 'aspect-[4/5] lg:aspect-auto'
                            : 'aspect-[16/9] sm:aspect-[3/2]'
                        )}>
                          <Image
                            {...imageProps}
                            alt={currentArtist.name}
                            className="object-cover w-full h-full"
                          />

                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        </div>

                        {/* Artist Info */}
                        <div className={cn(
                          'p-6 sm:p-8 lg:p-10',
                          displayMode === 'featured' && 'flex flex-col justify-center'
                        )}>
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-light tracking-tight mb-2">
                                {currentArtist.name}
                              </h3>

                              {showInstrument && currentArtist.instrument && (
                                <p className="text-sm text-kawai-red uppercase tracking-wider font-medium">
                                  {currentArtist.instrument}
                                </p>
                              )}
                            </div>

                            {/* Bio */}
                            {showBio !== 'none' && (
                              <div className="prose prose-sm sm:prose max-w-none">
                                {showBio === 'short' && currentArtist.shortBio ? (
                                  <p className="text-current/80 leading-relaxed">
                                    {currentArtist.shortBio}
                                  </p>
                                ) : showBio === 'full' && currentArtist.bio ? (
                                  <div className="text-current/80 leading-relaxed line-clamp-6">
                                    {/* Rich text bio - simplified rendering */}
                                    {typeof currentArtist.bio === 'string'
                                      ? currentArtist.bio
                                      : 'View artist page for full biography'}
                                  </div>
                                ) : null}
                              </div>
                            )}

                            {/* Social Links */}
                            {showSocialLinks && currentArtist.socialLinks && currentArtist.socialLinks.length > 0 && (
                              <div className="flex flex-wrap gap-3 pt-4">
                                {currentArtist.socialLinks.slice(0, 5).map((link, idx) => (
                                  <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                      'inline-flex items-center gap-2 px-4 py-2',
                                      'text-sm font-medium',
                                      'bg-kawai-charcoal/5 hover:bg-kawai-red hover:text-white',
                                      'rounded-full transition-all duration-300',
                                      'focus:outline-none focus:ring-2 focus:ring-kawai-red focus:ring-offset-2'
                                    )}
                                  >
                                    <span>{socialIcons[link.platform || 'other']}</span>
                                    <span>{link.label || link.platform}</span>
                                  </Link>
                                ))}
                              </div>
                            )}

                            {/* Recent Work - Subtle CTA */}
                            {showRecentWork && currentArtist.recentWork && currentArtist.recentWork.length > 0 && (
                              <div className="pt-6 mt-6 border-t border-current/10">
                                <div className="space-y-3">
                                  <h4 className="text-xs font-medium tracking-wider uppercase text-current/60">
                                    Recent Work
                                  </h4>

                                  {currentArtist.recentWork
                                    .filter((work) => work.featured || currentArtist.recentWork!.indexOf(work) < (maxRecentWorkItems || 2))
                                    .slice(0, maxRecentWorkItems || 2)
                                    .map((work, idx) => (
                                      <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 + idx * 0.1, duration: 0.4 }}
                                        className="group"
                                      >
                                        {work.link ? (
                                          <Link
                                            href={work.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={cn(
                                              'block p-4 rounded-lg',
                                              'bg-gradient-to-br from-kawai-charcoal/5 to-kawai-red/5',
                                              'hover:from-kawai-red/10 hover:to-kawai-red/5',
                                              'border border-current/10 hover:border-kawai-red/30',
                                              'transition-all duration-300',
                                              'focus:outline-none focus:ring-2 focus:ring-kawai-red focus:ring-offset-2'
                                            )}
                                          >
                                            <div className="flex flex-col gap-2">
                                              <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-3 mb-1.5">
                                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    {work.platform && (
                                                      <div className="flex items-center gap-1.5">
                                                        <SocialIcon platform={work.platform} />
                                                        <span className="text-[10px] font-medium tracking-wider uppercase text-current/50 whitespace-nowrap">
                                                          {work.platform === 'apple-music' ? 'Apple Music' : work.platform}
                                                        </span>
                                                      </div>
                                                    )}
                                                    {work.date && (
                                                      <>
                                                        <span className="text-current/30">•</span>
                                                        <time className="text-[10px] text-current/40 whitespace-nowrap tracking-wide">
                                                          {new Date(work.date).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            year: 'numeric'
                                                          })}
                                                        </time>
                                                      </>
                                                    )}
                                                  </div>
                                                </div>
                                                <h5 className="text-sm font-medium text-current group-hover:text-kawai-red transition-colors line-clamp-1 mb-1">
                                                  {work.title}
                                                </h5>
                                                {work.description && (
                                                  <p className="text-xs text-current/70 line-clamp-2 leading-relaxed">
                                                    {work.description}
                                                  </p>
                                                )}
                                                <div className="flex items-center gap-1 mt-2.5 text-kawai-red group-hover:gap-2 transition-all">
                                                  <span className="text-xs font-medium tracking-wider uppercase">
                                                    Click Here
                                                  </span>
                                                  <svg
                                                    className="w-3 h-3 transition-transform group-hover:translate-x-0.5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2.5}
                                                  >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                  </svg>
                                                </div>
                                              </div>
                                            </div>
                                          </Link>
                                        ) : (
                                          <div className="p-4 rounded-lg bg-kawai-charcoal/5 border border-current/10">
                                            <div className="flex flex-col gap-2">
                                              <div className="flex-1">
                                                <div className="flex items-start justify-between gap-3 mb-1.5">
                                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    {work.platform && (
                                                      <div className="flex items-center gap-1.5">
                                                        <SocialIcon platform={work.platform} />
                                                        <span className="text-[10px] font-medium tracking-wider uppercase text-current/50 whitespace-nowrap">
                                                          {work.platform === 'apple-music' ? 'Apple Music' : work.platform}
                                                        </span>
                                                      </div>
                                                    )}
                                                    {work.date && (
                                                      <>
                                                        <span className="text-current/30">•</span>
                                                        <time className="text-[10px] text-current/40 whitespace-nowrap tracking-wide">
                                                          {new Date(work.date).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            year: 'numeric'
                                                          })}
                                                        </time>
                                                      </>
                                                    )}
                                                  </div>
                                                </div>
                                                <h5 className="text-sm font-medium text-current line-clamp-1 mb-1">
                                                  {work.title}
                                                </h5>
                                                {work.description && (
                                                  <p className="text-xs text-current/70 line-clamp-2 leading-relaxed">
                                                    {work.description}
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </motion.div>
                                    ))}
                                </div>
                              </div>
                            )}

                            {/* View Profile Link */}
                            <div className="pt-4">
                              <Link
                                href={`/artists/${currentArtist.slug}`}
                                className={cn(
                                  'inline-flex items-center gap-2',
                                  'text-kawai-red hover:text-kawai-red/80',
                                  'font-medium text-sm tracking-wider uppercase',
                                  'transition-all duration-300',
                                  'group'
                                )}
                              >
                                <span>View Full Profile</span>
                                <svg
                                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2.5}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            {showNavigationArrows && validArtists.length > 1 && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  onClick={goToPrevious}
                  disabled={!enableLoop && currentIndex === 0}
                  className={cn(
                    'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 lg:-translate-x-12',
                    'w-12 h-12 sm:w-14 sm:h-14',
                    'flex items-center justify-center',
                    'bg-white/90 backdrop-blur-sm',
                    'border border-black/10',
                    'rounded-full shadow-lg',
                    'transition-all duration-300',
                    'hover:bg-kawai-red hover:text-white hover:border-kawai-red hover:scale-110',
                    'focus:outline-none focus:ring-2 focus:ring-kawai-red focus:ring-offset-2',
                    'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/90 disabled:hover:text-current disabled:hover:scale-100',
                    'group'
                  )}
                  aria-label="Previous artist"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:-translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  onClick={goToNext}
                  disabled={!enableLoop && currentIndex === validArtists.length - 1}
                  className={cn(
                    'absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 lg:translate-x-12',
                    'w-12 h-12 sm:w-14 sm:h-14',
                    'flex items-center justify-center',
                    'bg-white/90 backdrop-blur-sm',
                    'border border-black/10',
                    'rounded-full shadow-lg',
                    'transition-all duration-300',
                    'hover:bg-kawai-red hover:text-white hover:border-kawai-red hover:scale-110',
                    'focus:outline-none focus:ring-2 focus:ring-kawai-red focus:ring-offset-2',
                    'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/90 disabled:hover:text-current disabled:hover:scale-100',
                    'group'
                  )}
                  aria-label="Next artist"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </>
            )}
          </div>

          {/* Progress Indicator */}
          {showProgressIndicator && validArtists.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex items-center justify-center gap-2 mt-8 sm:mt-10"
            >
              {validArtists.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index)
                    setIsPlaying(false)
                  }}
                  className={cn(
                    'transition-all duration-500 ease-out',
                    'focus:outline-none focus:ring-2 focus:ring-kawai-red focus:ring-offset-2 rounded-full',
                    index === currentIndex
                      ? 'w-8 h-2 bg-kawai-red shadow-lg shadow-kawai-red/30'
                      : 'w-2 h-2 bg-current/20 hover:bg-current/40'
                  )}
                  aria-label={`Go to ${validArtists[index]?.name}`}
                  aria-current={index === currentIndex}
                />
              ))}

              {/* Counter */}
              <span className="ml-4 text-sm text-current/60 font-light tracking-wider tabular-nums">
                {currentIndex + 1} / {validArtists.length}
              </span>
            </motion.div>
          )}

          {/* CTA Button */}
          {ctaButton?.enabled && ctaButton.text && ctaButton.url && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex justify-center mt-10 sm:mt-12"
            >
              <Link
                href={ctaButton.url}
                target={ctaButton.openInNewTab ? '_blank' : undefined}
                rel={ctaButton.openInNewTab ? 'noopener noreferrer' : undefined}
                onClick={() => {
                  trackCTAClick({
                    blockType: 'marketing-artist-carousel',
                    blockData: { ctaTracking: ctaTracking as any },
                    ctaText: ctaButton?.text || '',
                    destination: ctaButton?.url || '',
                    additionalProps: { artist_count: artists?.length },
                  })
                }}
                className={cn(
                  'group relative inline-flex items-center gap-3',
                  'px-8 py-4 rounded-full',
                  'bg-kawai-charcoal text-white',
                  'font-medium text-sm tracking-wider uppercase',
                  'transition-all duration-500',
                  'hover:bg-kawai-red hover:shadow-xl hover:shadow-kawai-red/20 hover:scale-105',
                  'focus:outline-none focus:ring-2 focus:ring-kawai-red focus:ring-offset-2',
                  'overflow-hidden'
                )}
              >
                <span className="relative z-10">{ctaButton.text}</span>
                <svg
                  className="relative z-10 w-4 h-4 transition-transform duration-500 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>

                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Link>
            </motion.div>
          )}
        </div>

        {/* Keyboard hint */}
        {enableKeyboardNav && validArtists.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-center mt-6 sm:mt-8"
          >
            <p className="text-xs text-current/40 font-light tracking-wider">
              Use arrow keys to navigate
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
