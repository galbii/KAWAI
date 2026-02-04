import React from 'react'
// Type will be available after running: bun run build
// import type { LayoutSideNavigationBlock } from '@/payload-types'
import { SideNavigationBlock } from '../SideNavigationBlock'

// Temporary type until payload-types.ts is regenerated
interface SectionLabel {
  label: string
}

interface LayoutSideNavigationRendererProps {
  enabled?: boolean | null
  sectionLabels?: SectionLabel[] | null
  title?: string | null
  position?: 'left' | 'right' | null
  theme?: 'light' | 'dark' | 'red' | 'gold' | null
  mobileStyle?: 'bottom-bar' | 'hamburger' | 'hidden' | null
  mobileLabel?: string | null
  smoothScroll?: boolean | null
  scrollOffset?: number | null
  autoHide?: boolean | null
  showProgress?: boolean | null
  glassmorphism?: boolean | null
  showBorder?: boolean | null
  compactMode?: boolean | null
}

export function LayoutSideNavigationRenderer(props: LayoutSideNavigationRendererProps) {
  return <SideNavigationBlock {...props} />
}
