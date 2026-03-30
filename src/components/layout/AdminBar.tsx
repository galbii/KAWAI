'use client'

import { useState, useEffect, useRef } from 'react'
import { PayloadAdminBar } from '@payloadcms/admin-bar'
import { useAdminBar } from '@/contexts/AdminBarContext'

/**
 * Global admin bar — rendered once in the frontend layout.
 * Automatically shows/hides based on Payload auth state.
 * Uses ResizeObserver to set --admin-bar-height exactly to the rendered
 * bar height so the fixed header and announcement bar offset correctly.
 */
export function AdminBar() {
  const { doc } = useAdminBar()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = barRef.current
    if (!el) return

    if (!isAuthenticated) {
      document.documentElement.style.setProperty('--admin-bar-height', '0px')
      return
    }

    const update = () => {
      const h = el.getBoundingClientRect().height
      if (h > 0) {
        document.documentElement.style.setProperty('--admin-bar-height', `${h}px`)
      }
    }

    const observer = new ResizeObserver(update)
    observer.observe(el)
    // Let the display:block paint before measuring
    requestAnimationFrame(() => requestAnimationFrame(update))

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
        style={{ backgroundColor: '#E11922' }}
      />
    </div>
  )
}
