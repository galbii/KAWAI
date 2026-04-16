'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Link2, Check, MessageSquare, Share2, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ShareButtonsProps {
  title: string
  slug: string
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('fill-current', className)} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.738l7.73-8.835L1.254 2.25H8.08l4.261 5.636 5.903-5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Detect Web Share API support client-side only
  useEffect(() => {
    setCanNativeShare(
      typeof navigator !== 'undefined' &&
        typeof navigator.share === 'function' &&
        typeof navigator.canShare === 'function',
    )
  }, [])

  // Close panel on outside click or Escape
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  function getPostUrl() {
    return `${window.location.origin}/blog/${slug}`
  }

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getPostUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }, [slug])

  function handleX() {
    const url = getPostUrl()
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    window.open(intent, '_blank', 'noopener,noreferrer')
    setOpen(false)
  }

  function handleSMS() {
    const url = getPostUrl()
    // sms:?body= works on both iOS and Android (no recipient = user picks from contacts)
    const body = encodeURIComponent(`${title}\n${url}`)
    window.location.href = `sms:?body=${body}`
    setOpen(false)
  }

  async function handleNativeShare() {
    const url = getPostUrl()
    try {
      await navigator.share({ title, text: title, url })
    } catch {
      // User cancelled or share failed — silent
    }
    setOpen(false)
  }

  return (
    <div className="relative flex items-center gap-3">
      {/* Copy link — always visible */}
      <button
        onClick={handleCopy}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
          'border border-kawai-neutral text-kawai-charcoal',
          'hover:border-kawai-black hover:text-kawai-black',
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

      {/* Share trigger */}
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
          'bg-kawai-black text-white hover:bg-kawai-charcoal',
        )}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Share options"
      >
        <Share2 className="w-4 h-4" aria-hidden="true" />
        <span>Share</span>
      </button>

      {/* Share panel */}
      {open && (
        <div
          ref={panelRef}
          role="menu"
          className={cn(
            'absolute bottom-full mb-2 right-0 z-50',
            'w-52 rounded-xl overflow-hidden',
            'bg-white border border-kawai-neutral',
            'shadow-brand-medium',
          )}
        >
          {/* Caret */}
          <div className="absolute -bottom-[7px] right-6 w-3 h-3 bg-white border-r border-b border-kawai-neutral rotate-45" />

          <div className="py-1.5">
            {/* X / Twitter */}
            <button
              role="menuitem"
              onClick={handleX}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-kawai-black hover:bg-kawai-pearl transition-colors duration-150 font-[family-name:var(--font-brand-sans)]"
            >
              <XIcon className="w-4 h-4 shrink-0" />
              <span>Share on X</span>
            </button>

            {/* SMS / Text */}
            <button
              role="menuitem"
              onClick={handleSMS}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-kawai-black hover:bg-kawai-pearl transition-colors duration-150 font-[family-name:var(--font-brand-sans)]"
            >
              <MessageSquare className="w-4 h-4 shrink-0 text-kawai-charcoal" aria-hidden="true" />
              <span>Send as text</span>
            </button>

            {/* Native share — only when browser supports it */}
            {canNativeShare && (
              <>
                <div className="my-1 h-px bg-kawai-neutral mx-4" />
                <button
                  role="menuitem"
                  onClick={handleNativeShare}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-kawai-charcoal hover:bg-kawai-pearl transition-colors duration-150 font-[family-name:var(--font-brand-sans)]"
                >
                  <ChevronUp className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>More options</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
