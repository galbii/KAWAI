'use client'

import { useState, useLayoutEffect, useRef, useCallback, useEffect } from 'react'
import { useAdminBar } from '@/contexts/AdminBarContext'

type PayloadMeUser = { id: string; email: string } | null | undefined

const CMS_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

/**
 * Global admin bar — rendered once in the frontend layout.
 *
 * Owns auth detection directly (fetch /api/users/me) so the Edit link is
 * driven by our AdminBarContext doc state, not by PayloadAdminBar's internal
 * re-render timing. PayloadAdminBar evaluated collectionSlug && docID at the
 * moment user was first set — before AdminBarDoc's useEffect could register the
 * current page doc — causing the edit link to never appear.
 *
 * CRITICAL: The wrapper is position:fixed. The inner bar is position:relative so
 * getBoundingClientRect() returns the true height for the --admin-bar-height CSS
 * variable that offsets the header/announcement bar.
 */
export function AdminBar() {
  const { doc } = useAdminBar()
  const [user, setUser] = useState<PayloadMeUser>(undefined)
  const barRef = useRef<HTMLDivElement>(null)
  const isAuthenticated = Boolean(user?.id)

  useEffect(() => {
    fetch(`${CMS_URL}/api/users/me`, { credentials: 'include', method: 'get' })
      .then(r => r.json())
      .then(data => setUser(data.user ?? null))
      .catch(() => setUser(null))
  }, [])

  const handleLogout = useCallback(async () => {
    await fetch(`${CMS_URL}/api/users/logout`, { credentials: 'include', method: 'post' })
    setUser(null)
  }, [])

  useLayoutEffect(() => {
    const el = barRef.current
    if (!el || !isAuthenticated) {
      document.documentElement.style.setProperty('--admin-bar-height', '0px')
      return
    }

    const update = () => {
      const h = el.getBoundingClientRect().height
      if (h > 0) document.documentElement.style.setProperty('--admin-bar-height', `${h}px`)
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => {
      observer.disconnect()
      document.documentElement.style.setProperty('--admin-bar-height', '0px')
    }
  }, [isAuthenticated])

  const editHref =
    doc?.collection && doc?.id
      ? `${CMS_URL}/admin/collections/${doc.collection}/${doc.id}`
      : null

  const editLabel = doc?.collectionLabels?.singular
    ? `Edit ${doc.collectionLabels.singular}`
    : 'Edit'

  if (!isAuthenticated) return null

  return (
    <div
      ref={barRef}
      data-hide-on-3d-viewer
      style={{
        position: 'fixed',
        // Sits below the geo suggestion banner, which pins itself to top: 0.
        top: 'var(--geo-banner-height, 0px)',
        left: 0,
        right: 0,
        zIndex: 10000,
        transition: 'top 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        style={{
          alignItems: 'center',
          backgroundColor: '#8B0F14',
          boxSizing: 'border-box',
          color: '#fff',
          display: 'flex',
          fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif',
          fontSize: 'small',
          minWidth: 0,
          padding: '0.5rem',
          width: '100%',
        }}
      >
        {/* Logo / admin link */}
        <a
          href={`${CMS_URL}/admin`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ alignItems: 'center', color: 'inherit', display: 'flex', flexShrink: 0, height: '20px', marginRight: '10px', textDecoration: 'none' }}
        >
          <span style={{ fontWeight: 600, fontSize: '13px', letterSpacing: '0.03em' }}>
            Kawai America Corp
          </span>
        </a>

        {/* User email */}
        <a
          href={`${CMS_URL}/admin/collections/users/${user?.id}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'inherit', display: 'block', marginRight: '10px', minWidth: '50px', overflow: 'hidden', textDecoration: 'none', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.email}
          </span>
        </a>

        {/* Controls — right-aligned */}
        <div style={{ alignItems: 'center', display: 'flex', flexGrow: 1, justifyContent: 'flex-end', marginRight: '10px', gap: '10px' }}>
          {editHref && (
            <a
              href={editHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'inherit', display: 'block', flexShrink: 1, overflow: 'hidden', textDecoration: 'none', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {editLabel}
            </a>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', padding: 0, flexShrink: 1 }}
          type="button"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
