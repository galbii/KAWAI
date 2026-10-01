'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

export type PromoFrequency = 'session' | 'visitor' | 'always'

// Light-theme tokens mirrored from BottomLeftPopupBlock so every promo popup
// reads as one system (accent bar, shadow, type treatment, CTA styling).
export const PROMO_TOKENS = {
  bg: '#FAF8F5',
  accentBar: '#E11922',
  titleColor: '#1E1B16',
  messageColor: '#6B7280',
  ctaBg: '#E11922',
  ctaFg: '#FFFFFF',
  ctaHoverBg: '#c7151c',
  shadow: '0 24px 64px rgba(0,0,0,0.10), 0 6px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
} as const

export const PROMO_ENTER_EASE = [0.16, 1, 0.3, 1] as const

// Orchestrated entrance — content rows rise in sequence after the card lands.
// Collapses to plain fades when the visitor prefers reduced motion.
const makeFadeUp = (reduceMotion: boolean) => (order: number) =>
  reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } }
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.55, delay: 0.22 + order * 0.07, ease: PROMO_ENTER_EASE },
      }

export type PromoFadeUp = ReturnType<typeof makeFadeUp>

export interface PromoPopupShellRenderProps {
  /** Closes the popup and records the dismissal under the storage key */
  dismiss: () => void
  reduceMotion: boolean
  /** Spread onto a motion element to stagger it into place ({...fadeUp(2)}) */
  fadeUp: PromoFadeUp
}

export interface PromoPopupShellProps {
  /** Full storage key remembering dismissal (e.g. `kawai-product-promo-{slug}`) */
  storageKey: string
  frequency?: PromoFrequency | null | undefined
  delaySeconds?: number | null | undefined
  /** id of the element that names the dialog */
  labelledBy: string
  describedBy?: string | undefined
  /** Desktop sizing for the card — mobile is always a full-width bottom sheet */
  cardClassName?: string
  /** Frosted circle for a card that opens on imagery, subtle corner button otherwise */
  closeOverImage?: boolean
  children: (props: PromoPopupShellRenderProps) => ReactNode
}

/**
 * Drag handle for the mobile bottom-sheet presentation. Variants place it in
 * flow themselves — it sits under the card's opening image, wherever that is.
 */
export function PromoSheetHandle() {
  return (
    <div className="flex sm:hidden justify-center pt-3.5 pb-0.5" aria-hidden>
      <div className="w-9 h-1 rounded-full bg-black/[0.14]" />
    </div>
  )
}

/**
 * Shared chrome for every promo modal — centered dialog on desktop, bottom
 * sheet on mobile, same design tokens as the homepage Bottom Popup block.
 *
 * Owns the parts that must behave identically across styles: the reveal delay,
 * dismissal memory (sessionStorage for "session", localStorage for "visitor",
 * nothing for "always"), scroll lock, focus trap, Escape-to-close, focus
 * restore, the brand accent bar and the close button. Layout comes from the
 * children render prop — see PromoPopup (successor style) and BundlePromoPopup.
 */
export function PromoPopupShell({
  storageKey,
  frequency = 'session',
  delaySeconds = 2,
  labelledBy,
  describedBy,
  cardClassName = 'sm:max-w-[680px] sm:mx-4',
  closeOverImage = false,
  children,
}: PromoPopupShellProps) {
  const [isVisible, setIsVisible] = useState(false)
  const reduceMotion = useReducedMotion() ?? false

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

  const fadeUp = makeFadeUp(reduceMotion)

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
            aria-labelledby={labelledBy}
            aria-describedby={describedBy}
            tabIndex={-1}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 36, scale: 0.97 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0.2 : 0.55, ease: PROMO_ENTER_EASE }}
            className={`relative w-full overflow-hidden rounded-t-[20px] rounded-b-none sm:rounded-[10px] focus:outline-none ${cardClassName}`}
            style={{ background: PROMO_TOKENS.bg, boxShadow: PROMO_TOKENS.shadow }}
          >
            {/* Accent bar — the brand signature line */}
            <div style={{ height: 3, background: PROMO_TOKENS.accentBar }} aria-hidden />

            {/* Dismiss — first stop in the tab order, as a dialog's close should be */}
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="absolute z-20 flex items-center justify-center cursor-pointer transition-colors duration-150
                         focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red"
              style={
                closeOverImage
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
                el.style.background = closeOverImage ? 'rgba(0,0,0,0.60)' : 'rgba(30,27,22,0.06)'
                el.style.color = closeOverImage ? '#FFFFFF' : PROMO_TOKENS.titleColor
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.background = closeOverImage ? 'rgba(0,0,0,0.40)' : 'transparent'
                el.style.color = closeOverImage ? 'rgba(255,255,255,0.92)' : 'rgba(30,27,22,0.35)'
              }}
            >
              <X size={closeOverImage ? 15 : 13} strokeWidth={2.2} />
            </button>

            {children({ dismiss, reduceMotion, fadeUp })}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export interface PromoCtaProps {
  href: string
  label: string
  /** Called after the visitor commits — records the dismissal so it doesn't re-open */
  onNavigate: () => void
  onDismiss: () => void
  /** Text button under the CTA naming the stay-here path */
  dismissLabel: string
  /** Horizontal alignment of the stay-here button — follows the card's text */
  align?: 'center' | 'start'
  className?: string
}

/**
 * The red CTA plus the explicit stay-here text button. An interrupting modal
 * should always name the way out, so both live together.
 */
export function PromoCta({
  href,
  label,
  onNavigate,
  onDismiss,
  dismissLabel,
  align = 'center',
  className,
}: PromoCtaProps) {
  return (
    <div className={className}>
      <Link
        href={href}
        onClick={onNavigate}
        className="block sm:inline-block text-center transition-colors duration-200
                   focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red"
        style={{
          padding: '15px 48px',
          background: PROMO_TOKENS.ctaBg,
          color: PROMO_TOKENS.ctaFg,
          borderRadius: 4,
          fontSize: 11,
          fontFamily: 'var(--font-brand-sans, system-ui)',
          fontWeight: 600,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          textDecoration: 'none',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLAnchorElement).style.background = PROMO_TOKENS.ctaHoverBg
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLAnchorElement).style.background = PROMO_TOKENS.ctaBg
        }}
      >
        {label}
      </Link>

      <button
        onClick={onDismiss}
        className={`mt-4 block text-[10px] tracking-[0.15em] uppercase font-semibold
                   text-kawai-black/40 hover:text-kawai-black transition-colors duration-200
                   focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red ${
                     align === 'center' ? 'mx-auto' : 'mx-0'
                   }`}
        style={{ fontFamily: 'var(--font-brand-sans, system-ui)' }}
      >
        {dismissLabel}
      </button>
    </div>
  )
}
