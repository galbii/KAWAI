'use client'

/**
 * ClientOnlyOverlays — browser-only layout chrome
 *
 * NavigationProgress and AdminBar both require browser APIs (setInterval, ResizeObserver)
 * that are meaningless during SSR. Wrapping them here with ssr:false removes their JS
 * from the server render and defers it until after first paint, reducing TBT.
 *
 * This file must remain a Client Component so that next/dynamic with ssr:false is valid.
 */

import dynamic from 'next/dynamic'

const NavigationProgress = dynamic(
  () => import('./NavigationProgress').then(m => ({ default: m.NavigationProgress })),
  { ssr: false }
)

const AdminBar = dynamic(
  () => import('./AdminBar').then(m => ({ default: m.AdminBar })),
  { ssr: false }
)

const MotionPauseControl = dynamic(
  () => import('./MotionPauseControl').then(m => ({ default: m.MotionPauseControl })),
  { ssr: false }
)

export function ClientOnlyOverlays() {
  return (
    <>
      <NavigationProgress />
      <AdminBar />
      <MotionPauseControl />
    </>
  )
}
