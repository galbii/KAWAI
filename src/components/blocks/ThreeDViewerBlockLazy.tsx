'use client'

/**
 * ThreeDViewerBlockLazy — deferred client-only wrapper
 *
 * The 3D viewer uses useSearchParams() which prevents SSR, and its model-loading
 * JS is large. Wrapping with ssr:false here excludes it from the SSR bundle and
 * avoids a useSearchParams hydration boundary on every product page.
 * The `ssr: false` here requires this file to be a Client Component.
 */

import dynamic from 'next/dynamic'

const Inner = dynamic(
  () => import('./ThreeDViewerBlock').then(m => ({ default: m.ThreeDViewerBlock })),
  {
    ssr: false,
    loading: () => <div className="h-[400px] bg-kawai-pearl animate-pulse rounded-lg" />,
  }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ThreeDViewerBlockLazy(props: Record<string, any>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Inner {...(props as any)} />
}
