'use client'

// The global floating search bar is handled by TSDGlobalSearch.tsx (layout-level).
// This wrapper is kept for backward compatibility but is now a simple passthrough.
export function TSDHeroSearchWithFloat({
  children,
}: {
  children: React.ReactNode
  placeholder: string
}) {
  return <>{children}</>
}
