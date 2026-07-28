'use client'

/**
 * LayoutSpacer Component
 *
 * Adds spacing to account for the fixed header (utility bar + bottom nav).
 * Uses --header-bottom, which is set dynamically by header.tsx and already
 * includes announcement bar and admin bar offsets.
 *
 * Fallback (before JS sets the variable): 70px (utility 64px + red line 6px).
 * Matches mobile/tablet — desktop settles at 120px after JS, causing at most a
 * 50px downward shift rather than the previous 50px upward snap on mobile.
 */
export function LayoutSpacer() {
  return (
    <div
      className="w-full flex-shrink-0"
      style={{
        height: 'var(--header-bottom, 70px)',
        // Glide in step with the geo banner sliding in/out (--header-bottom
        // includes --geo-banner-height) instead of snapping the page down.
        transition: 'height 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      aria-hidden="true"
    />
  )
}
