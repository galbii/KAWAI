'use client'

import { useState } from 'react'
import { Link2, Check, Twitter } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ShareButtonsProps {
  title: string
  slug: string
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  function getPostUrl() {
    return `${window.location.origin}/blog/${slug}`
  }

  function handleTwitter() {
    const url = getPostUrl()
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    window.open(tweetUrl, '_blank', 'noopener,noreferrer')
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(getPostUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      setCopied(false)
    }
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={handleTwitter}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
          'bg-kawai-black text-white',
          'hover:bg-kawai-charcoal transition-colors duration-200',
        )}
        aria-label="Share on X / Twitter"
      >
        <Twitter className="w-4 h-4" aria-hidden="true" />
        <span>Share</span>
      </button>

      <button
        onClick={handleCopy}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
          'border border-kawai-neutral text-kawai-charcoal',
          'hover:border-kawai-black hover:text-kawai-black transition-colors duration-200',
        )}
        aria-label={copied ? 'Link copied!' : 'Copy link to clipboard'}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-kawai-red" aria-hidden="true" />
            <span className="text-kawai-red">Copied!</span>
          </>
        ) : (
          <>
            <Link2 className="w-4 h-4" aria-hidden="true" />
            <span>Copy link</span>
          </>
        )}
      </button>
    </div>
  )
}
