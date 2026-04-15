'use client'

/**
 * CalendlyEmbedBlockLazy — deferred client-only wrapper
 *
 * react-calendly (~35KB) is excluded from the SSR bundle and only loaded
 * when the block appears on a page. The `ssr: false` here requires this
 * file to be a Client Component.
 */

import dynamic from 'next/dynamic'
import type { LayoutCalendlyEmbedBlock } from '@/payload-types'

const Inner = dynamic(
  () => import('./CalendlyEmbedBlock').then(m => ({ default: m.CalendlyEmbedBlock })),
  {
    ssr: false,
    loading: () => <div className="h-[600px] bg-kawai-pearl animate-pulse rounded-lg" />,
  }
)

export function CalendlyEmbedBlockLazy(props: LayoutCalendlyEmbedBlock) {
  return <Inner {...props} />
}
