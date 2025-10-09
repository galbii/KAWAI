/**
 * 3D Viewer Module
 *
 * A complete 3D model viewer system for product pages.
 * Provides iframe-based 3D model viewing with modal overlay,
 * floating button, and state management.
 *
 * @module 3d-viewer
 *
 * @example Basic Usage
 * ```tsx
 * import { ThreeDViewerButton, ThreeDViewerModal, use3DViewer } from '@/components/ui/3d-viewer'
 *
 * export function ProductPage({ product }) {
 *   const viewer = use3DViewer({
 *     config: product.viewer3D,
 *     productName: product.name
 *   })
 *
 *   if (!product.viewer3D?.enabled) return null
 *
 *   return (
 *     <>
 *       <ThreeDViewerButton
 *         onClick={viewer.open}
 *         text={product.viewer3D.buttonText}
 *         productName={product.name}
 *       />
 *       <ThreeDViewerModal
 *         isOpen={viewer.isOpen}
 *         onClose={viewer.close}
 *         viewerUrl={viewer.fullViewerUrl}
 *         productName={product.name}
 *       />
 *     </>
 *   )
 * }
 * ```
 */

// Components
export { ThreeDViewerModal } from './ThreeDViewerModal'
export { ThreeDViewerButton } from './ThreeDViewerButton'

// Hooks
export { use3DViewer } from './use3DViewer'

// Types
export type {
  Viewer3DConfig,
  ThreeDViewerModalProps,
  ThreeDViewerButtonProps,
  Use3DViewerReturn,
  Use3DViewerOptions,
  ViewerGTMEvent
} from './types'
