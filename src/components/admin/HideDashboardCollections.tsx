'use client'

import { useEffect } from 'react'

// The groups Payload renders on the dashboard based on admin.group config.
// Matches the text content of the h2/h3 heading Payload puts above each grid.
const PAYLOAD_GROUPS = new Set([
  'Commerce', 'Content', 'Business', 'System', 'Pages',
  'Collections', 'Integrations', 'Administration',
])

/**
 * Hides Payload's default dashboard collection card groups.
 *
 * Payload 3.x uses CSS Modules (hashed class names) so CSS selectors can't
 * reliably target the groups. Instead we walk the DOM, find h2 elements whose
 * text matches known Payload group labels, and hide their parent container.
 *
 * Runs on mount + via MutationObserver to handle any async hydration timing.
 */
export function HideDashboardCollections() {
  useEffect(() => {
    const hide = () => {
      document.querySelectorAll<HTMLElement>('h2, h3').forEach(heading => {
        const text = heading.textContent?.trim() ?? ''
        if (!PAYLOAD_GROUPS.has(text)) return

        // The group container is the heading's direct parent.
        // It holds both the heading and the cards grid below it.
        const container = heading.parentElement
        if (container && container !== document.body) {
          container.style.display = 'none'
        }
      })
    }

    // Run immediately (catches SSR-hydrated content)
    hide()
    // Run after a short delay in case Payload hydrates async
    const t = setTimeout(hide, 400)

    // Watch for DOM changes (Payload may render collection cards after a tick)
    const observer = new MutationObserver(hide)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      clearTimeout(t)
      observer.disconnect()
    }
  }, [])

  return null
}
