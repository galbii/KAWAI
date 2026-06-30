import type { ReactNode } from 'react'
import { NAMMHeader } from '@/components/namm/NAMMHeader'

/**
 * NAMM 2026 Layout
 *
 * This nested layout overrides the parent (frontend) layout to provide
 * a custom black-themed header experience for the NAMM landing page.
 *
 * This layout uses:
 * - NAMMHeader (custom black header with minimal navigation)
 * - No footer (page has custom CantAttendCTA)
 * - No NavigationContext (not needed for single-page experience)
 */
export default function NAMM2026Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <NAMMHeader />
      <div className="flex-1 bg-black">{children}</div>
      {/* No footer - page has custom CantAttendCTA */}
    </div>
  )
}
