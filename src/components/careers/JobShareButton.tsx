'use client'

import { useState } from 'react'
import { Link2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function JobShareButton() {
  const [copied, setCopied] = useState(false)

  async function handleClick() {
    if (typeof window === 'undefined') return
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard API can fail on http or in restricted contexts — fail silently
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] font-[family-name:var(--font-brand-sans)]',
        'text-kawai-charcoal/70 hover:text-kawai-black transition-colors duration-150',
      )}
    >
      {copied ? (
        <>
          <Check size={13} strokeWidth={1.8} className="text-kawai-red" />
          Link copied
        </>
      ) : (
        <>
          <Link2 size={13} strokeWidth={1.6} />
          Copy link
        </>
      )}
    </button>
  )
}
