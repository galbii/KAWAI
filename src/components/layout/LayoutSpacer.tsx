'use client'

/**
 * LayoutSpacer Component
 *
 * Adds spacing to account for the fixed header (utility bar + bottom nav).
 * Uses --header-bottom, which is set dynamically by header.tsx and already
 * includes announcement bar and admin bar offsets.
 *
 * Fallback (before JS sets the variable):
 *   Mobile: 70px (utility 64px + red line 6px)
 *   Desktop: 120px (utility 64px + bottom nav 56px)
 */
export function LayoutSpacer() {
  return (
    <div
      className="w-full flex-shrink-0"
      style={{
        height: 'var(--header-bottom, 120px)'
      }}
      aria-hidden="true"
    />
  )
}
