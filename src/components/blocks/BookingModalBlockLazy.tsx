'use client'

/**
 * BookingModalBlockLazy — deferred client-only wrapper
 *
 * Booking modal and its Calendly dependency are excluded from the SSR bundle
 * and only loaded when the block appears on a page.
 * The `ssr: false` here requires this file to be a Client Component.
 */

import dynamic from 'next/dynamic'
import type { LayoutBookingModalBlock } from '@/payload-types'

const Inner = dynamic(
  () => import('./BookingModalBlock').then(m => ({ default: m.BookingModalBlock })),
  { ssr: false, loading: () => null }
)

export function BookingModalBlockLazy(props: LayoutBookingModalBlock) {
  return <Inner {...props} />
}
