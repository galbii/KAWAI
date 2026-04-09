'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'

/**
 * NavigationProgress — Kawai-red top-of-page progress bar.
 *
 * Strategy: intercept anchor clicks to start, watch pathname changes to finish.
 * Uses an interval-based decelerating progress (NProgress-style) so the bar
 * feels confident without needing router lifecycle hooks.
 */
export function NavigationProgress() {
  const pathname = usePathname()
  const prevPath = useRef(pathname)

  const [width, setWidth] = useState(0)
  const [visible, setVisible] = useState(false)
  const [completing, setCompleting] = useState(false)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearAll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    timeoutRefs.current.forEach(clearTimeout)
    timeoutRefs.current = []
  }

  const after = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms)
    timeoutRefs.current.push(id)
  }

  const begin = useCallback(() => {
    clearAll()
    setCompleting(false)
    setVisible(true)
    setWidth(3)

    // Decelerate toward 90%: each tick adds 12% of remaining distance
    intervalRef.current = setInterval(() => {
      setWidth(prev => {
        if (prev >= 90) {
          clearInterval(intervalRef.current!)
          return prev
        }
        return prev + (90 - prev) * 0.12
      })
    }, 120)
  }, [])

  const finish = useCallback(() => {
    clearAll()
    setCompleting(true)
    setWidth(100)
    after(() => setVisible(false), 420)
    after(() => { setCompleting(false); setWidth(0) }, 500)
  }, [])

  // Finish when pathname changes (navigation complete)
  useEffect(() => {
    if (pathname !== prevPath.current) {
      prevPath.current = pathname
      finish()
    }
  }, [pathname, finish])

  // Intercept anchor clicks to start the bar
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const a = (e.target as HTMLElement).closest('a')
      if (!a) return

      const href = a.getAttribute('href') ?? ''
      if (!href) return
      if (a.target === '_blank') return
      if (/^(https?:|\/\/|mailto:|tel:|#)/.test(href)) return

      // Normalise relative href for comparison
      const resolved = href.startsWith('/') ? href : `/${href}`
      if (resolved === pathname || resolved === window.location.pathname) return

      begin()
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [pathname, begin])

  useEffect(() => () => clearAll(), [])

  if (!visible) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[9999] h-[2px]"
      style={{ opacity: completing && width >= 100 ? 0 : 1, transition: 'opacity 280ms ease' }}
    >
      <div
        style={{
          height: '100%',
          width: `${width}%`,
          backgroundColor: '#E11922',
          // Glow at the leading edge — light refracting off lacquered piano
          boxShadow: '0 0 12px 1px rgba(225, 25, 34, 0.4), 0 0 4px rgba(225, 25, 34, 0.6)',
          transition: completing
            ? 'width 220ms cubic-bezier(0.4, 0, 0.2, 1)'
            : 'width 180ms linear',
          willChange: 'width',
        }}
      />
    </div>
  )
}
