'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X } from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

export interface SuccessorPromoPopupProps {
  /** Handle of the collection the visitor is currently viewing (namespaces the dismissal key) */
  currentHandle: string
  /** Title of the collection the visitor is currently viewing — shown in the lineage marque */
  currentTitle: string
  /** Handle of the successor collection — the popup links to /pianos/{successorHandle} */
  successorHandle: string
  successorTitle: string
  imageUrl?: string | null
  eyebrow?: string | null
  title?: string | null
  message?: string | null
  ctaLabel?: string | null
  frequency?: 'session' | 'visitor' | 'always' | null
  delaySeconds?: number | null
}

// Light-theme tokens mirrored from BottomLeftPopupBlock so both popups read as
// one system (accent bar, shadow, type treatment, CTA styling).
const T = {
  bg: '#FAF8F5',
  accentBar: '#E11922',
  titleColor: '#1E1B16',
  messageColor: '#6B7280',
  ctaBg: '#E11922',
  ctaFg: '#FFFFFF',
  ctaHoverBg: '#c7151c',
  shadow: '0 24px 64px rgba(0,0,0,0.10), 0 6px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
} as const

const ENTER_EASE = [0.16, 1, 0.3, 1] as const

/**
 * Succession announcement modal shown on legacy collection pages, pointing
 * visitors at the successor collection. Centered dialog on desktop, bottom
 * sheet on mobile — same design tokens as the homepage Bottom Popup block.
 * Dismissal is remembered per collection handle: sessionStorage ("session"),
 * localStorage ("visitor"), or not at all ("always").
 */
export function SuccessorPromoPopup({
  currentHandle,
  currentTitle,
  successorHandle,
  successorTitle,
  imageUrl,
  eyebrow,
  title,
  message,
  ctaLabel,
  frequency = 'session',
  delaySeconds = 2,
}: SuccessorPromoPopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  const reduceMotion = useReducedMotion()

  const storageKey = `kawai-successor-promo-${currentHandle}`

  const getStorage = (): Storage | null => {
    if (frequency === 'visitor') return window.localStorage
    if (frequency === 'session') return window.sessionStorage
    return null
  }

  useEffect(() => {
    try {
      if (getStorage()?.getItem(storageKey)) return
    } catch {
      // Storage unavailable (private mode) — fall through and show the popup
    }

    const timeoutId = setTimeout(() => setIsVisible(true), Math.max(0, delaySeconds ?? 2) * 1000)
    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, delaySeconds, frequency])

  const dismiss = () => {
    setIsVisible(false)
    try {
      getStorage()?.setItem(storageKey, Date.now().toString())
    } catch {
      // Storage unavailable — dismissal just won't persist
    }
  }

  // A11y: initial focus, focus trap, Escape-to-close, focus restore, scroll lock
  const dialogRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isVisible) return
    previouslyFocused.current = document.activeElement as HTMLElement | null
    dialogRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dismiss()
        return
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (!first || !last) return
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused.current?.focus?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible])

  const headline = title || `Meet the ${successorTitle}`

  // Orchestrated entrance — content rows rise in sequence after the card lands.
  // Collapses to plain fades when the visitor prefers reduced motion.
  const fadeUp = (order: number) =>
    reduceMotion
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } }
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay: 0.22 + order * 0.07, ease: ENTER_EASE },
        }

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[9990] flex items-end sm:items-center justify-center">
          {/* Backdrop scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute inset-0 bg-black/[0.55]"
            onClick={dismiss}
            aria-hidden
          />

          {/* Modal card — bottom sheet on mobile, centered on desktop */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="kawai-successor-promo-title"
            aria-describedby={message ? 'kawai-successor-promo-message' : undefined}
            tabIndex={-1}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 36, scale: 0.97 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0.2 : 0.55, ease: ENTER_EASE }}
            className="relative w-full sm:max-w-[680px] sm:mx-4 overflow-hidden rounded-t-[20px] rounded-b-none sm:rounded-[10px] focus:outline-none"
            style={{ background: T.bg, boxShadow: T.shadow }}
          >
            {/* Accent bar — the brand signature line */}
            <div style={{ height: 3, background: T.accentBar }} aria-hidden />

            {/* Successor image — settles from a slow zoom, vignette for legibility */}
            {imageUrl && (
              <div className="relative w-full h-[200px] sm:h-[310px] overflow-hidden">
                <motion.div
                  className="absolute inset-0"
                  {...(reduceMotion
                    ? {}
                    : {
                        initial: { scale: 1.08 },
                        animate: { scale: 1 },
                        transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] as const },
                      })}
                >
                  <Image
                    src={imageUrl}
                    alt={successorTitle}
                    fill
                    sizes="(max-width: 640px) 100vw, 680px"
                    className="object-cover"
                    priority
                  />
                </motion.div>
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.18) 100%)' }}
                  aria-hidden
                />
              </div>
            )}

            {/* Mobile drag handle */}
            <div className="flex sm:hidden justify-center pt-3.5 pb-0.5" aria-hidden>
              <div className="w-9 h-1 rounded-full bg-black/[0.14]" />
            </div>

            {/* Dismiss — frosted circle over the image, subtle corner button otherwise */}
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="absolute flex items-center justify-center cursor-pointer transition-colors duration-150
                         focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red"
              style={
                imageUrl
                  ? {
                      top: 13,
                      right: 13,
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.40)',
                      backdropFilter: 'blur(6px)',
                      WebkitBackdropFilter: 'blur(6px)',
                      color: 'rgba(255,255,255,0.92)',
                      border: 'none',
                    }
                  : {
                      top: 14,
                      right: 14,
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: 'transparent',
                      color: 'rgba(30,27,22,0.35)',
                      border: 'none',
                    }
              }
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.background = imageUrl ? 'rgba(0,0,0,0.60)' : 'rgba(30,27,22,0.06)'
                el.style.color = imageUrl ? '#FFFFFF' : T.titleColor
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.background = imageUrl ? 'rgba(0,0,0,0.40)' : 'transparent'
                el.style.color = imageUrl ? 'rgba(255,255,255,0.92)' : 'rgba(30,27,22,0.35)'
              }}
            >
              <X size={imageUrl ? 15 : 13} strokeWidth={2.2} />
            </button>

            {/* Succession marque — the lineage this modal exists to announce.
                Same hairline-divider motif as the collection page's Gallery rule;
                weight shifts from the outgoing name to the successor. */}
            <motion.div
              {...fadeUp(0)}
              className="flex items-center gap-3 px-7 sm:px-12 pt-6 sm:pt-8"
              style={{ fontFamily: 'var(--font-brand-sans, system-ui)' }}
            >
              <div className="h-px flex-1 bg-kawai-black/10" aria-hidden />
              <span className="text-[9px] tracking-[0.28em] uppercase font-semibold text-kawai-black/40 whitespace-nowrap">
                {currentTitle}
              </span>
              <svg
                viewBox="0 0 26 8"
                className="w-6 h-2.5 text-kawai-red shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden
              >
                <path d="M0 4h23M20 1l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[9px] tracking-[0.28em] uppercase font-bold text-kawai-black whitespace-nowrap">
                {successorTitle}
              </span>
              <div className="h-px flex-1 bg-kawai-black/10" aria-hidden />
            </motion.div>

            {/* Content */}
            <div className="px-7 sm:px-12 pt-6 sm:pt-8 pb-9 sm:pb-11 text-center">
              <motion.p
                {...fadeUp(1)}
                className="text-[9px] tracking-[0.45em] uppercase font-bold text-kawai-red mb-3.5"
                style={{ fontFamily: 'var(--font-brand-sans, system-ui)' }}
              >
                {eyebrow || 'The Next Generation'}
              </motion.p>

              <motion.h3
                {...fadeUp(2)}
                id="kawai-successor-promo-title"
                className="text-[28px] sm:text-[36px]"
                style={{
                  fontFamily: 'var(--font-brand-luxury, Georgia, serif)',
                  fontWeight: 500,
                  lineHeight: 1.2,
                  color: T.titleColor,
                  margin: '0 0 12px',
                  letterSpacing: '-0.01em',
                }}
              >
                {headline}
              </motion.h3>

              {message && (
                <motion.p
                  {...fadeUp(3)}
                  id="kawai-successor-promo-message"
                  className="max-w-[460px] mx-auto"
                  style={{
                    fontFamily: 'var(--font-brand-sans, system-ui)',
                    fontSize: 14.5,
                    lineHeight: 1.65,
                    color: T.messageColor,
                    margin: '0 auto 24px',
                    fontWeight: 400,
                  }}
                >
                  {message}
                </motion.p>
              )}

              <motion.div {...fadeUp(4)} className={message ? '' : 'mt-6'}>
                <Link
                  href={`/pianos/${successorHandle}`}
                  onClick={dismiss}
                  className="block sm:inline-block text-center transition-colors duration-200
                             focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red"
                  style={{
                    padding: '15px 48px',
                    background: T.ctaBg,
                    color: T.ctaFg,
                    borderRadius: 4,
                    fontSize: 11,
                    fontFamily: 'var(--font-brand-sans, system-ui)',
                    fontWeight: 600,
                    letterSpacing: '0.10em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLAnchorElement).style.background = T.ctaHoverBg
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLAnchorElement).style.background = T.ctaBg
                  }}
                >
                  {ctaLabel || 'Explore the New Collection'}
                </Link>

                {/* Explicit stay-here path — an interrupting modal should name it */}
                <button
                  onClick={dismiss}
                  className="mt-4 mx-auto block text-[10px] tracking-[0.15em] uppercase font-semibold
                             text-kawai-black/40 hover:text-kawai-black transition-colors duration-200
                             focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red"
                  style={{ fontFamily: 'var(--font-brand-sans, system-ui)' }}
                >
                  Continue browsing the {currentTitle}
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
