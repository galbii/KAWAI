'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Globe, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  isBrowserTranslateSupported,
  restoreEnglish,
  translatePageToFrench,
  type TranslateStatus,
} from '@/lib/i18n/browser-translate'

type UiLocale = 'en' | 'fr'

/** Remembers the choice so it re-applies as the visitor moves around the site. */
const STORAGE_KEY = 'kawai-ui-locale'

const OPTIONS: ReadonlyArray<{ locale: UiLocale; label: string; short: string }> = [
  // Each language is named in its own language, never translated into the other.
  { locale: 'en', label: 'English', short: 'EN' },
  { locale: 'fr', label: 'Français', short: 'FR' },
]

/**
 * Globe dropdown that translates the page into French using the browser's
 * built-in on-device translator.
 *
 * Nothing is fetched and no URL changes — the page is rewritten in place. The
 * control hides entirely in browsers without the API rather than offering a
 * button that does nothing.
 */
export function LocaleSwitcher({ className }: { className?: string }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [locale, setLocale] = useState<UiLocale>('en')
  const [status, setStatus] = useState<TranslateStatus>('idle')
  const [progress, setProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const onStatus = useCallback((next: TranslateStatus, value?: number) => {
    setStatus(next)
    if (typeof value === 'number') setProgress(value)
  }, [])

  // Support is only knowable on the client, so the control renders nothing on
  // the server and appears after mount — which also keeps SSR and the first
  // client render identical (no hydration mismatch).
  useEffect(() => {
    setIsSupported(isBrowserTranslateSupported())
  }, [])

  // Re-apply French after client-side navigation, since the new page renders
  // in English. The browser may require a fresh tap if it withholds activation;
  // the menu still shows FR so the visitor can re-trigger it.
  useEffect(() => {
    if (!isSupported) return

    let stored: string | null = null
    try {
      stored = window.localStorage.getItem(STORAGE_KEY)
    } catch {
      /* private mode / blocked storage — treat as English */
    }
    if (stored !== 'fr') return

    setLocale('fr')
    void translatePageToFrench(onStatus)
  }, [pathname, isSupported, onStatus])

  // Close on outside click and on Escape.
  useEffect(() => {
    if (!isOpen) return

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  const handleSelect = useCallback(
    async (next: UiLocale) => {
      setIsOpen(false)
      if (next === locale) return

      setLocale(next)
      try {
        window.localStorage.setItem(STORAGE_KEY, next)
      } catch {
        /* non-fatal — the choice just won't survive navigation */
      }

      if (next === 'fr') {
        // Called straight from the click so the browser's user-activation
        // requirement for creating a translator is satisfied.
        await translatePageToFrench(onStatus)
      } else {
        restoreEnglish()
        setStatus('idle')
      }
    },
    [locale, onStatus],
  )

  if (!isSupported) return null

  const isBusy = status === 'downloading' || status === 'translating'
  const active = OPTIONS.find((o) => o.locale === locale) ?? OPTIONS[0]!

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-kawai-pearl transition-colors"
        aria-label="Change language"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {isBusy ? (
          <Loader2 className="h-4 w-4 text-kawai-charcoal animate-spin" aria-hidden="true" />
        ) : (
          <Globe className="h-4 w-4 text-kawai-charcoal" aria-hidden="true" />
        )}
        <span className="text-[11px] font-semibold tracking-[0.08em] text-kawai-charcoal">
          {isBusy ? `${progress}%` : active.short}
        </span>
        <ChevronDown
          className={cn(
            'h-3 w-3 text-kawai-charcoal transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      {/* Announce progress without stealing focus. */}
      <span role="status" aria-live="polite" className="sr-only">
        {status === 'downloading' && `Downloading language pack, ${progress} percent`}
        {status === 'translating' && `Translating page, ${progress} percent`}
        {status === 'translated' && 'Page translated to French'}
        {status === 'error' && 'Translation failed'}
      </span>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="menu"
            aria-label="Language"
            className="absolute right-0 top-full mt-1 w-48 bg-white border border-kawai-neutral rounded-lg shadow-brand-medium overflow-hidden z-50"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            {OPTIONS.map((option) => {
              const isActive = option.locale === locale

              return (
                <button
                  key={option.locale}
                  type="button"
                  role="menuitem"
                  lang={option.locale}
                  disabled={isBusy}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => void handleSelect(option.locale)}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 px-3 py-2.5 text-sm text-left transition-colors',
                    'text-kawai-charcoal hover:bg-kawai-pearl disabled:opacity-50',
                    isActive && 'font-semibold',
                  )}
                >
                  {option.label}
                  {isActive && <Check className="h-3.5 w-3.5 text-kawai-red" aria-hidden="true" />}
                </button>
              )
            })}

            {status === 'error' && (
              <p className="px-3 py-2 text-xs text-kawai-charcoal border-t border-kawai-neutral">
                Translation unavailable right now.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
