'use client'

import { useState, useLayoutEffect, useRef } from 'react'
import { PayloadAdminBar } from '@payloadcms/admin-bar'
import { useAdminBar } from '@/contexts/AdminBarContext'

/**
 * Global admin bar — rendered once in the frontend layout.
 * Automatically shows/hides based on Payload auth state.
 *
 * CRITICAL: PayloadAdminBar renders position:fixed by default, which takes
 * it out of our wrapper's flow (making height 0). We override position to
 * 'relative' so it stays in flow, then our wrapper provides the fixed
 * positioning. This lets getBoundingClientRect() measure the true height.
 *
 * useLayoutEffect fires synchronously before the browser paints, so
 * --admin-bar-height is always set before the header/announcement bar render.
 */
export function AdminBar() {
  const { doc } = useAdminBar()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = barRef.current
    if (!el || !isAuthenticated) {
      document.documentElement.style.setProperty('--admin-bar-height', '0px')
      return
    }

    const update = () => {
      const h = el.getBoundingClientRect().height
      if (h > 0) {
        document.documentElement.style.setProperty('--admin-bar-height', `${h}px`)
      }
    }

    update()

    const observer = new ResizeObserver(update)
    observer.observe(el)

    return () => {
      observer.disconnect()
      document.documentElement.style.setProperty('--admin-bar-height', '0px')
    }
  }, [isAuthenticated])

  return (
    <div
      ref={barRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10000,
        display: isAuthenticated ? 'block' : 'none',
      }}
    >
      <PayloadAdminBar
        cmsURL={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}
        {...(doc?.collection ? { collectionSlug: doc.collection } : {})}
        {...(doc?.id ? { id: doc.id } : {})}
        {...(doc?.collectionLabels ? { collectionLabels: doc.collectionLabels } : {})}
        onAuthChange={(user) => setIsAuthenticated(Boolean(user?.id))}
        logo={
          <span style={{ fontWeight: 600, fontSize: '13px', letterSpacing: '0.03em', color: 'white' }}>
            Kawai America Corp
          </span>
        }
        style={{
          // Override PayloadAdminBar's default position:fixed so it stays in our
          // wrapper's flow and getBoundingClientRect() returns the true height.
          position: 'relative',
          top: 'auto',
          left: 'auto',
          width: '100%',
          zIndex: 'auto',
          backgroundColor: '#8B0F14',
        }}
      />
    </div>
  )
}
