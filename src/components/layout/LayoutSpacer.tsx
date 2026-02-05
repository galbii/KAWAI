'use client'

/**
 * LayoutSpacer Component
 *
 * Adds spacing to account for fixed header and announcement bar.
 * Uses CSS variables to dynamically adjust height based on whether
 * announcement bar is present.
 *
 * Only accounts for the TOP utility bar (64px) which is always visible.
 * The bottom navigation bar auto-hides on scroll, so we don't include it.
 *
 * Top utility bar: 64px (h-16)
 * Announcement bar height: var(--announcement-bar-height, 0px)
 */
export function LayoutSpacer() {
  return (
    <div
      className="w-full flex-shrink-0"
      style={{
        height: 'calc(64px + var(--announcement-bar-height, 0px))'
      }}
      aria-hidden="true"
    />
  )
}
