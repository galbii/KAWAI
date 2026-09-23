'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
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
import { getTranslateHint, type TranslateHint } from '@/lib/i18n/translate-hints'

type UiLocale = 'en' | 'fr'

/** Remembers the choice so it re-applies as the visitor moves around the site. */
const STORAGE_KEY = 'kawai-ui-locale'

const OPTIONS: ReadonlyArray<{ locale: UiLocale; label: string; short: string }> = [
  // Each language is named in its own language, never translated into the other.
  { locale: 'en', label: 'English', short: 'EN' },
  { locale: 'fr', label: 'Français', short: 'FR' },
]

/**
 * Globe dropdown offering French on the Canadian site.
 *
 * On Chrome 138+ / Edge 148+ this is a real toggle: picking Français hands the
 * page to the browser's own on-device translation model, and picking English
 * restores the original text exactly from a snapshot. Back and forth, no
 * reload, no vendor, no API key, nothing to pay for.
 *
 * Everywhere else — Firefox, Safari, all mobile — no browser lets a page invoke
 * its native translate command, so there is nothing to toggle. Those visitors
 * get the two taps for their own browser instead of a hidden control.
 *
 * Not Quebec Bill 96 compliance; see i18n/flags.ts.
 */
export function LocaleSwitcher({ className }: { className?: string }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [canTranslateInPage, setCanTranslateInPage] = useState(false)
  const [hint, setHint] = useState<TranslateHint | null>(null)
  const [prefersFrench, setPrefersFrench] = useState(false)
  const [locale, setLocale] = useState<UiLocale>('en')
  const [status, setStatus] = useState<TranslateStatus>('idle')
  const [progress, setProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  // Ties the inert "Français" row to the how-to steps below it.
  const hintId = useId()

  const onStatus = useCallback((next: TranslateStatus, value?: number) => {
    setStatus(next)
    if (typeof value === 'number') setProgress(value)
  }, [])

  // Capability and UA are only knowable on the client. Rendering nothing until
  // mounted keeps SSR and the first client render identical (no hydration
  // mismatch) — the same guard KawaiLogo uses for NavigationContext.
  useEffect(() => {
    setMounted(true)
    setCanTranslateInPage(isBrowserTranslateSupported())
    setHint(getTranslateHint(navigator.userAgent))
    setPrefersFrench(navigator.language.toLowerCase().startsWith('fr'))
  }, [])

  // Re-apply French after client-side navigation, since the new page renders
  // in English. The translator instance created by the original click is kept
  // alive precisely so this works without a fresh user gesture.
  useEffect(() => {
    if (!canTranslateInPage) return

    let stored: string | null = null
    try {
      stored = window.localStorage.getItem(STORAGE_KEY)
    } catch {
      /* private mode / blocked storage — treat as English */
    }
    if (stored !== 'fr') return

    setLocale('fr')
    void translatePageToFrench(onStatus)
  }, [pathname, canTranslateInPage, onStatus])

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
      if (next === locale) {
        setIsOpen(false)
        return
      }

      // On browsers without the API, picking Français can't do anything by
      // itself — leave the menu open so the instructions stay on screen.
      if (next === 'fr' && !canTranslateInPage) return

      setIsOpen(false)
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
    [locale, canTranslateInPage, onStatus],
  )

  const isBusy = status === 'downloading' || status === 'translating'
  const active = useMemo(() => OPTIONS.find((o) => o.locale === locale) ?? OPTIONS[0]!, [locale])

  if (!mounted) return null

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={cn(
          'flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-kawai-pearl transition-colors',
          // A visitor whose browser is already set to French is the one person
          // guaranteed to want this — make the control easier to spot for them.
          prefersFrench && locale === 'en' && 'ring-1 ring-kawai-red/40',
        )}
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
            className={cn(
              'absolute right-0 top-full mt-1 bg-white border border-kawai-neutral rounded-lg shadow-brand-medium overflow-hidden z-50',
              canTranslateInPage ? 'w-48' : 'w-72',
            )}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            {OPTIONS.map((option) => {
              const isActive = option.locale === locale
              // Français isn't a switch on these browsers — it's a label for
              // the instructions below, so it must not look clickable.
              const isInert = option.locale === 'fr' && !canTranslateInPage

              return (
                <button
                  key={option.locale}
                  type="button"
                  role="menuitem"
                  lang={option.locale}
                  // `disabled` would take this out of the tab order, but on
                  // these browsers the instructions it points at are the whole
                  // point of opening the menu — a keyboard or screen-reader
                  // user has to be able to land on it. aria-disabled keeps it
                  // focusable and still announces it as unavailable.
                  disabled={isBusy && !isInert}
                  aria-disabled={isInert ? 'true' : undefined}
                  aria-describedby={isInert ? hintId : undefined}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => void handleSelect(option.locale)}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 px-3 py-2.5 text-sm text-left transition-colors',
                    'text-kawai-charcoal',
                    !isInert && 'hover:bg-kawai-pearl disabled:opacity-50',
                    isInert && 'cursor-default font-semibold',
                    isActive && 'font-semibold',
                  )}
                >
                  {option.label}
                  {isActive && <Check className="h-3.5 w-3.5 text-kawai-red" aria-hidden="true" />}
                </button>
              )
            })}

            {!canTranslateInPage && hint && (
              <div id={hintId} className="px-3 py-2.5 border-t border-kawai-neutral bg-kawai-pearl">
                <p className="text-xs font-semibold text-kawai-black">
                  {hint.hasNativeTranslation
                    ? `Translate this page with ${hint.label}`
                    : `${hint.label} can’t translate pages`}
                </p>
                <ol className="mt-1.5 space-y-1 text-xs text-kawai-charcoal list-decimal list-inside">
                  {hint.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

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
