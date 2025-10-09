/**
 * 3D Viewer Type Definitions
 *
 * Type-safe interfaces for the 3D model viewer system.
 * These types align with the Products collection viewer3D configuration.
 */

/**
 * Configuration for the 3D viewer from CMS
 * Maps to the Products.viewer3D group field
 */
export interface Viewer3DConfig {
  /** Enable the 3D viewer for this product */
  enabled: boolean
  /** Full URL to the 3D viewer iframe source */
  viewerUrl?: string
  /** URL parameters for the specific model (e.g., "?model=gl-10&color=ebony") */
  modelParams?: string
  /** Allow auto-open when ?mode=3d URL parameter is present */
  autoOpen?: boolean
  /** Custom button text (defaults to "View in 3D") */
  buttonText?: string
}

/**
 * Props for the ThreeDViewerModal component
 */
export interface ThreeDViewerModalProps {
  /** Whether the modal is currently open */
  isOpen: boolean
  /** Callback to close the modal */
  onClose: () => void
  /** Full URL to the viewer (viewerUrl + modelParams) */
  viewerUrl: string
  /** Product name for accessibility and GTM tracking */
  productName: string
  /** Optional custom class name */
  className?: string
}

/**
 * Props for the ThreeDViewerButton component
 */
export interface ThreeDViewerButtonProps {
  /** Callback when button is clicked */
  onClick: () => void
  /** Button text to display */
  text?: string
  /** Product name for GTM tracking */
  productName: string
  /** Optional custom class name */
  className?: string
  /** Whether button should be visible */
  visible?: boolean
}

/**
 * Return type for the use3DViewer hook
 */
export interface Use3DViewerReturn {
  /** Whether the modal is currently open */
  isOpen: boolean
  /** Function to open the modal */
  open: () => void
  /** Function to close the modal */
  close: () => void
  /** Toggle the modal open/closed */
  toggle: () => void
  /** Full viewer URL (base URL + parameters) */
  fullViewerUrl: string
  /** Whether the viewer should auto-open (based on URL params and config) */
  shouldAutoOpen: boolean
}

/**
 * Options for the use3DViewer hook
 */
export interface Use3DViewerOptions {
  /** 3D viewer configuration from CMS */
  config: Viewer3DConfig | null | undefined
  /** Product name for tracking */
  productName: string
  /** URL search parameters (for detecting ?mode=3d) */
  searchParams?: URLSearchParams | null
}

/**
 * GTM event data for 3D viewer tracking
 */
export interface ViewerGTMEvent {
  event: '3d_viewer_opened' | '3d_viewer_closed'
  product_name: string
  viewer_url: string
  auto_opened?: boolean
}
