/**
 * ThreeDViewerBlock - Wrapper for Marketing 3D Viewer Block
 *
 * Interactive 3D piano model viewer block that displays a floating button
 * to open an immersive 3D model viewer modal. Supports customizable themes,
 * positioning, and auto-open behavior.
 *
 * @see docs/BLOCKS.md for block system documentation
 * @see docs/features/3D-VIEWER-FEATURE.md for 3D viewer system documentation
 */

import { ThreeDViewerRenderer } from './marketing/ThreeDViewerRenderer'

/**
 * Props interface - will be auto-generated as Marketing3DViewerBlock after build
 */
interface ThreeDViewerBlockProps {
  enabled?: boolean | null
  modelId: string
  productName?: string | null
  buttonText?: string | null
  buttonPosition?: 'bottom-left' | 'bottom-right' | 'bottom-center' | null
  theme?: 'blue' | 'kawai-red' | 'black' | 'gold' | null
  autoOpen?: boolean | null
  contextSection?: {
    showContext?: boolean | null
    heading?: string | null
    description?: string | null
    contextPosition?: 'above' | 'below' | 'separate' | null
  } | null
  layout?: {
    hideOnMobile?: boolean | null
    showScrollIndicator?: boolean | null
  } | null
  tracking?: any
  blockType?: string
  id?: string
}

export function ThreeDViewerBlock(props: ThreeDViewerBlockProps) {
  // Gate on the `enabled` toggle. Default is enabled — only an explicit `false`
  // hides it. Returning null here keeps the viewer's hooks/preload from mounting.
  if (props.enabled === false) return null
  return <ThreeDViewerRenderer {...props} />
}
