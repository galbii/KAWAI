'use client'

/**
 * LayoutSpacer Component
 *
 * Adds spacing to account for fixed header and announcement bar.
 * Uses CSS variables to dynamically adjust height based on whether
 * announcement bar is present.
 *
 * Mobile (< lg): utility bar (64px) + red line (6px) = 70px
 * Desktop: only the utility bar (64px) — the bottom nav auto-hides on scroll
 *   so we don't add it here, avoiding a scroll jump when it disappears.
 *
 * Announcement bar height: var(--announcement-bar-height, 0px)
 * Admin bar height: var(--admin-bar-height, 0px)
 */
export function LayoutSpacer() {
  return (
    <div
      className="w-full flex-shrink-0"
      style={{
        // lg:hidden red line (6px) is always visible on mobile, so mobile = 70px
        height: 'calc(70px + var(--announcement-bar-height, 0px) + var(--admin-bar-height, 0px))'
      }}
      aria-hidden="true"
    />
  )
}
