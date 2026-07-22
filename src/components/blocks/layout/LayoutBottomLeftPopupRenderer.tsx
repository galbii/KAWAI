import React from 'react'
// Type will be available after running: bun run build
// import type { LayoutBottomLeftPopupBlock } from '@/payload-types'
import { BottomLeftPopupBlock } from '../BottomLeftPopupBlock'

// Temporary type until payload-types.ts is regenerated
interface LayoutBottomLeftPopupRendererProps {
  enabled?: boolean | null
  icon?: any
  featuredImage?: any
  featuredImageHeight?: 'small' | 'medium' | 'large' | 'tall' | null
  title?: string | null
  message?: string | null
  ctaText?: string | null
  ctaLink?: string | null
  ctaOpenInNewTab?: boolean | null
  theme?: 'light' | 'dark' | 'red' | 'gold' | null
  position?: 'bottom-left' | 'bottom-right' | null
  size?: 'compact' | 'medium' | 'large' | null
  autoShowDelay?: number | null
  autoDismissDelay?: number | null
  showOncePerSession?: boolean | null
  dismissible?: boolean | null
  animationStyle?: 'slide' | 'fade' | 'bounce' | 'scale' | null
  customStorageKey?: string | null
  zIndex?: number | null
  showOnAllPages?: boolean | null
  excludePaths?: Array<{ path?: string | null }> | null
}

export function LayoutBottomLeftPopupRenderer(props: LayoutBottomLeftPopupRendererProps) {
  return <BottomLeftPopupBlock {...props} />
}
