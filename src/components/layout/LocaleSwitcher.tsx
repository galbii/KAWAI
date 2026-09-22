'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { parseLocalePath, withLocale, type UiLocale } from '@/lib/i18n/locale-path'

/** Remembers the visitor's choice for their next visit. The URL always wins. */
const LOCALE_COOKIE = 'kawai-ui-locale'

const OPTIONS: ReadonlyArray<{
  locale: UiLocale
  /** Always written in its own language — never "French" in an English menu. */
  label: string
  short: string
  hrefLang: string
}> = [
  { locale: 'en', label: 'English', short: 'EN', hrefLang: 'en-CA' },
  { locale: 'fr', label: 'Français', short: 'FR', hrefLang: 'fr-CA' },
]

/**
 * Globe dropdown for switching between English and French on the CA domain.
 *
 * Locale comes from the URL via `usePathname()` rather than a cookie or a
 * server prop, so this stays a pure client component and never drags the
 * layout into dynamic rendering (see the `headers()` note in CLAUDE.md).
 */
export function LocaleSwitcher({ className }: { className?: string }) {
  const pathname = usePathname() || '/'
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const { locale: activeLocale } = parseLocalePath(pathname)
  const activeOption = OPTIONS.find((o) => o.locale === activeLocale) ?? OPTIONS[0]!

  // The root layout renders a static lang="en" (it can't read headers without
  // forcing every page dynamic), so correct it here once the client knows the
  // locale. Assistive tech reads the live DOM attribute; crawlers get the
  // language signal from the hreflang alternates instead.
  useEffect(() => {
    document.documentElement.lang = activeLocale === 'fr' ? 'fr-CA' : 'en-CA'
  }, [activeLocale])

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

  const handleSelect = useCallback((locale: UiLocale) => {
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`
    setIsOpen(false)
  }, [])

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
        <Globe className="h-4 w-4 text-kawai-charcoal" aria-hidden="true" />
        <span className="text-[11px] font-semibold tracking-[0.08em] text-kawai-charcoal">
          {activeOption.short}
        </span>
        <ChevronDown
          className={cn(
            'h-3 w-3 text-kawai-charcoal transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="menu"
            aria-label="Language"
            className="absolute right-0 top-full mt-1 w-44 bg-white border border-kawai-neutral rounded-lg shadow-brand-medium overflow-hidden z-50"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            {OPTIONS.map((option) => {
              const isActive = option.locale === activeLocale

              return (
                <Link
                  key={option.locale}
                  role="menuitem"
                  href={withLocale(pathname, option.locale)}
                  hrefLang={option.hrefLang}
                  lang={option.locale}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => handleSelect(option.locale)}
                  className={cn(
                    'flex items-center justify-between gap-2 px-3 py-2.5 text-sm transition-colors',
                    'text-kawai-charcoal hover:bg-kawai-pearl',
                    isActive && 'font-semibold',
                  )}
                >
                  {option.label}
                  {isActive && <Check className="h-3.5 w-3.5 text-kawai-red" aria-hidden="true" />}
                </Link>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
