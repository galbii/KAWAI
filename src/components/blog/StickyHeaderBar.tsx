'use client'

import { useEffect, useState, useRef } from 'react'
import { Share2, Twitter, Linkedin, Mail, Link as LinkIcon } from 'lucide-react'

interface StickyHeaderBarProps {
  title: string
  category?: string
  readTime?: number
  onShare?: (platform: 'twitter' | 'linkedin' | 'email' | 'copy') => void
}

export function StickyHeaderBar({
  title,
  category,
  readTime,
  onShare
}: StickyHeaderBarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry) {
          setIsVisible(!entry.isIntersecting)
        }
      },
      {
        threshold: 0,
        rootMargin: '-100px 0px 0px 0px',
      }
    )

    // Delay observer setup until after PageTransition finishes (220ms) so the
    // hero's position is settled before we evaluate intersection.
    const timer = setTimeout(() => {
      const heroElement = document.querySelector('[data-blog-hero]')
      if (heroElement) {
        observer.observe(heroElement)
      }
    }, 300)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  const handleShare = (platform: 'twitter' | 'linkedin' | 'email' | 'copy') => {
    if (onShare) {
      onShare(platform)
    } else {
      // Default share behavior
      const url = window.location.href
      const text = title

      switch (platform) {
        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
            '_blank',
            'width=550,height=420'
          )
          break
        case 'linkedin':
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            '_blank',
            'width=550,height=420'
          )
          break
        case 'email':
          window.location.href = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`
          break
        case 'copy':
          navigator.clipboard.writeText(url).then(() => {
            // Could add toast notification here
            alert('Link copied to clipboard!')
          })
          break
      }
    }
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Title and meta */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {category && (
            <span className="hidden sm:inline-flex px-2 py-1 text-xs font-semibold uppercase tracking-wider bg-kawai-red/10 text-kawai-red rounded">
              {category}
            </span>
          )}
          <h2 className="text-sm font-semibold text-kawai-charcoal truncate">
            {title}
          </h2>
          {readTime && (
            <span className="hidden md:inline-flex text-xs text-gray-500">
              {readTime} min read
            </span>
          )}
        </div>

        {/* Right: Share buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleShare('twitter')}
            className="p-2 text-gray-600 hover:text-kawai-red hover:bg-kawai-red/5 rounded-lg transition-colors"
            aria-label="Share on Twitter"
          >
            <Twitter className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleShare('linkedin')}
            className="p-2 text-gray-600 hover:text-kawai-red hover:bg-kawai-red/5 rounded-lg transition-colors"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleShare('email')}
            className="hidden sm:inline-flex p-2 text-gray-600 hover:text-kawai-red hover:bg-kawai-red/5 rounded-lg transition-colors"
            aria-label="Share via Email"
          >
            <Mail className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleShare('copy')}
            className="p-2 text-gray-600 hover:text-kawai-red hover:bg-kawai-red/5 rounded-lg transition-colors"
            aria-label="Copy link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
